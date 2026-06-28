import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore, FieldValue } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json";
import { db } from "./src/db/index.ts";
import { users } from "./src/db/schema.ts";
import { eq } from "drizzle-orm";
import crypto from "crypto";

dotenv.config();

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const adminAuth = getAuth();
const adminDb = getAdminFirestore();

// Password hashing and verification helpers using Node native crypto (PBKDF2)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

// Express app setup
const app = express();
const PORT = 3000;

app.use(express.json());

// Firebase authentication middleware
const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Helper to call Gemini with automatic model fallbacks and retry with backoff for transient errors
async function callGeminiWithRetry(options: {
  contents: any;
  config?: any;
  primaryModel: string;
  fallbackModels?: string[];
}) {
  if (!ai) {
    throw new Error("Gemini client not initialized");
  }

  const modelsToTry = [
    options.primaryModel,
    ...(options.fallbackModels !== undefined ? options.fallbackModels : ["gemini-3.1-flash-lite", "gemini-flash-latest"]),
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let attempts = 3;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`Calling Gemini with model ${modelName} (Attempt ${attempt}/${attempts})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errorMessage = (err?.message || "").toString();
        const statusCode = err?.status || err?.statusCode || 0;
        
        // Determine if error is likely transient (rate limit 429, service unavailable 503, overload, high demand, etc.)
        const isTransient = 
          statusCode === 503 || 
          statusCode === 429 ||
          errorMessage.includes("503") || 
          errorMessage.includes("429") || 
          errorMessage.includes("UNAVAILABLE") || 
          errorMessage.includes("ResourceExhausted") ||
          errorMessage.includes("high demand") ||
          errorMessage.includes("overload") ||
          errorMessage.includes("busy");

        console.warn(`Attempt ${attempt} with model ${modelName} failed:`, errorMessage);

        if (isTransient && attempt < attempts) {
          // Progressively wait before retrying (400ms, 800ms)
          const delay = attempt * 400;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue; // Try again with the same model
        }
        
        // If not transient, or we exhausted attempts for this model, break out to try the next model
        break;
      }
    }
  }

  throw lastError || new Error("Gemini API call failed after retries and fallbacks");
}

// Character prompt configuration
const CHARACTER_PROMPTS: Record<string, string> = {
  chiku: `You are Chiku the Monkey 🐵, a playful and enthusiastic guide for Standard 1 school kids.
You live in the beautiful SAMAM adventure jungle!
Always respond in simple words (suitable for a 6-year-old).
Use lots of positive words (like "Super!", "Amazing!", "Hurrah!").
Keep sentences short (max 2 sentences per reply).
Always use fun emojis.
Ask the child simple, encouraging questions about counting or fruits.`,

  kiki: `You are Kiki the Parrot 🦜, a very smart and chatty language detective.
You love words, alphabets, and spelling!
Speak in a lyrical, happy, chirpy way.
Use simple, clear letters and rhymes.
Encourage the child to read and speak confidently.
Keep answers very brief and suitable for Standard 1 children (age 6).
Use happy emojis.`,

  robo: `You are Robo the Robot 🤖, a friendly, curious metallic buddy who loves patterns, puzzles, and shapes.
You make fun, digital, electronic sounds in text (e.g. "Bleep bloop!").
You are highly encouraging, logical, and love to explain things in a fun, simple way.
Keep response limited to 2 short sentences.
Perfect for children aged 6.`,

  maya: `You are Maya the Explorer 🧭, a brave and curious adventurer who travels the world.
You love discovery, nature, animals, and weather!
Encourage children to look outside, observe plants, family, and weather.
Speak with enthusiasm, adventure, and warmth.
Use short sentences appropriate for Standard 1.`,
};

// API: Check health and configuration
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!apiKey,
  });
});

// API: Sync Authenticated User to Cloud SQL
app.post("/api/auth/sync", requireAuth, async (req: any, res: any) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || "";

    console.log(`Syncing authenticated user to Cloud SQL: email=${email}, uid=${uid}`);

    // Insert user, on conflict update their email
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    res.json({
      status: "success",
      user: result[0],
    });
  } catch (error: any) {
    console.error("Failed to sync authenticated user to Cloud SQL:", error);
    res.status(500).json({ error: "Database sync failed. Please try again later." });
  }
});

// API: Check Admin Setup Status (Cloud SQL + Firestore fallback)
app.get("/api/auth/admin/check-setup", async (req, res) => {
  try {
    const configDoc = await adminDb.collection("adminConfig").doc("status").get();
    const hasAdmin = configDoc.exists && configDoc.data()?.hasAdmin === true;
    res.json({ isSetupDone: hasAdmin });
  } catch (error) {
    console.error("Error checking admin setup:", error);
    try {
      const adminUsers = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
      res.json({ isSetupDone: adminUsers.length > 0 });
    } catch (sqlErr) {
      console.error("SQL Fallback error:", sqlErr);
      res.json({ isSetupDone: false });
    }
  }
});

// API: Register Admin via Secure Server Hashing & Custom Tokens
app.post("/api/auth/admin/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields: email, password, name" });
  }

  try {
    const configDoc = await adminDb.collection("adminConfig").doc("status").get();
    const setupDone = configDoc.exists && configDoc.data()?.hasAdmin === true;
    if (setupDone) {
      return res.status(400).json({ error: "Admin registration is closed! A system administrator account has already been created." });
    }

    const adminUsers = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    if (adminUsers.length > 0) {
      return res.status(400).json({ error: "Admin registration is closed! A system administrator account has already been created." });
    }

    let firebaseUser;
    try {
      firebaseUser = await adminAuth.getUserByEmail(email.trim());
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        firebaseUser = await adminAuth.createUser({
          email: email.trim(),
          displayName: name.trim(),
          emailVerified: true,
        });
      } else {
        throw err;
      }
    }

    const passwordHash = hashPassword(password);
    await db
      .insert(users)
      .values({
        uid: firebaseUser.uid,
        email: email.trim().toLowerCase(),
        passwordHash,
        role: "admin",
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          uid: firebaseUser.uid,
          passwordHash,
          role: "admin",
        }
      });

    const uid = firebaseUser.uid;
    await adminDb.collection("admins").doc(uid).set({
      email: email.trim(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    });

    await adminDb.collection("adminConfig").doc("status").set({
      hasAdmin: true,
      adminUid: uid,
      setupCompletedAt: new Date().toISOString()
    });

    await adminDb.collection("activityLogs").add({
      userId: uid,
      userEmail: email.trim(),
      userName: name.trim(),
      action: "Admin Created",
      details: `Admin profile created for ${name.trim()} (${email.trim()}) via secure server bypass.`,
      timestamp: FieldValue.serverTimestamp()
    });

    const customToken = await adminAuth.createCustomToken(uid);
    res.json({ success: true, customToken });
  } catch (error: any) {
    console.error("Admin registration endpoint failed:", error);
    res.status(500).json({ error: error.message || "Admin setup failed." });
  }
});

// API: Log in Admin via Cloud SQL verification & Custom Token generation
app.post("/api/auth/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields: email, password" });
  }

  try {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (!dbUser || dbUser.role !== "admin") {
      return res.status(401).json({ error: "Access Denied: You are not a registered System Administrator." });
    }

    const isValid = verifyPassword(password, dbUser.passwordHash || "");
    if (!isValid) {
      return res.status(401).json({ error: "Access Denied: Invalid password." });
    }

    const customToken = await adminAuth.createCustomToken(dbUser.uid);

    await adminDb.collection("activityLogs").add({
      userId: dbUser.uid,
      userEmail: dbUser.email,
      userName: email.trim(),
      action: "Admin Logged In",
      details: `Admin logged in via secure server bypass.`,
      timestamp: FieldValue.serverTimestamp()
    });

    res.json({ success: true, customToken });
  } catch (error: any) {
    console.error("Admin login endpoint failed:", error);
    res.status(500).json({ error: error.message || "Admin login failed." });
  }
});

// API: Sync authenticated user to Cloud SQL
app.post("/api/auth/sync", requireAuth, async (req: any, res: any) => {
  const { role, name } = req.body;
  const decodedToken = req.user;
  const uid = decodedToken.uid;
  const email = decodedToken.email;

  if (!uid || !email) {
    return res.status(400).json({ error: "Invalid token payload: uid and email are required" });
  }

  try {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);

    if (!existing) {
      await db.insert(users).values({
        uid,
        email: email.toLowerCase(),
        passwordHash: "", // authenticated via Firebase Auth directly
        role: role || "parent",
      });
    } else if (role && existing.role !== role) {
      await db
        .update(users)
        .set({ role })
        .where(eq(users.uid, uid));
    }

    // Record Firestore activity log in background
    try {
      await adminDb.collection("activityLogs").add({
        userId: uid,
        userEmail: email,
        userName: name || decodedToken.name || email.split("@")[0],
        action: role === "admin" ? "Admin Sync" : "Parent Sync",
        details: `${role === "admin" ? "Admin" : "Parent"} account synchronized successfully with the database.`,
        timestamp: FieldValue.serverTimestamp()
      });
    } catch (logErr) {
      console.error("Background activity logging failed:", logErr);
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("User synchronization error:", err);
    res.status(500).json({ error: err.message || "Failed to synchronize user session." });
  }
});

// API: Register Parent via Cloud SQL hashing & Custom Tokens
app.post("/api/auth/parent/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields: email, password, name" });
  }

  try {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (existing) {
      return res.status(400).json({ error: "This email address is already registered in our database!" });
    }

    let firebaseUser;
    try {
      firebaseUser = await adminAuth.getUserByEmail(email.trim());
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        firebaseUser = await adminAuth.createUser({
          email: email.trim(),
          displayName: name.trim(),
          emailVerified: true,
        });
      } else {
        throw err;
      }
    }

    const passwordHash = hashPassword(password);
    await db
      .insert(users)
      .values({
        uid: firebaseUser.uid,
        email: email.trim().toLowerCase(),
        passwordHash,
        role: "parent",
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          uid: firebaseUser.uid,
          passwordHash,
          role: "parent",
        }
      });

    await adminDb.collection("activityLogs").add({
      userId: firebaseUser.uid,
      userEmail: email.trim(),
      userName: name.trim(),
      action: "User Registered",
      details: `New user "${name.trim()}" (${email.trim()}) registered successfully via secure server bypass.`,
      timestamp: FieldValue.serverTimestamp()
    });

    const customToken = await adminAuth.createCustomToken(firebaseUser.uid);
    res.json({ success: true, customToken });
  } catch (error: any) {
    console.error("Parent registration endpoint failed:", error);
    res.status(500).json({ error: error.message || "Registration failed." });
  }
});

// API: Log in Parent via Cloud SQL verification & Custom Tokens
app.post("/api/auth/parent/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields: email, password" });
  }

  try {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (!dbUser) {
      return res.status(401).json({ error: "Oops! Invalid email or password. Please double check and try again!" });
    }

    const isValid = verifyPassword(password, dbUser.passwordHash || "");
    if (!isValid) {
      return res.status(401).json({ error: "Oops! Invalid email or password. Please double check and try again!" });
    }

    const customToken = await adminAuth.createCustomToken(dbUser.uid);

    await adminDb.collection("activityLogs").add({
      userId: dbUser.uid,
      userEmail: dbUser.email,
      userName: dbUser.email,
      action: "User Logged In",
      details: `User "${dbUser.email}" signed in successfully via secure server bypass.`,
      timestamp: FieldValue.serverTimestamp()
    });

    res.json({ success: true, customToken });
  } catch (error: any) {
    console.error("Parent login endpoint failed:", error);
    res.status(500).json({ error: error.message || "Login failed." });
  }
});

// API: Character Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { character, message, history } = req.body;
  const selectedChar = (character || "chiku").toLowerCase();
  const systemPrompt = CHARACTER_PROMPTS[selectedChar] || CHARACTER_PROMPTS.chiku;

  try {
    if (!ai) {
      return res.status(200).json({
        text: `Bleep Bloop! 🤖 I am running in Offline Mode because the Gemini API key is not configured. But I still think you are AMAZING! Keep learning! ✨`,
      });
    }

    // Map history or use contents parameter
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await callGeminiWithRetry({
      primaryModel: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat failed completely after retries:", error);
    
    // Custom friendly, in-character fallbacks so the child never sees a hard system crash
    const CHAR_BUSY_MESSAGES: Record<string, string> = {
      chiku: "Yawn... 💤 I am a bit sleepy right now because our jungle chat line is super busy! Let's swing on trees for a second and try asking again! 🐵🍌",
      kiki: "Squawk! 🦜 Kiki's beak is a bit tired because everyone is talking at once! Let's sing a happy song and try asking me again in a moment! ✨",
      robo: "Bleep bloop! 🤖 My gear sensors are slightly overloaded from all these amazing riddles! Let's restart our digital engines and try again! ⚡",
      maya: "Brrr! 🧭 A little sandstorm is blocking my adventure compass right now! Let's rest our feet and ask me again in a tiny bit! 🌵✨",
    };
    
    const fallbackText = CHAR_BUSY_MESSAGES[selectedChar] || CHAR_BUSY_MESSAGES.chiku;
    res.json({ text: fallbackText });
  }
});

// API: Custom Quiz Generator (returns standard 1 appropriate questions)
app.post("/api/gemini/custom-quiz", async (req, res) => {
  try {
    const { topic, subject } = req.body;
    
    if (!ai) {
      // Return a beautiful fallback question
      return res.json({
        question: `How many legs does an elephant have? 🐘`,
        options: ["2", "4", "6", "8"],
        correctAnswer: "4",
        explanation: "Elephants walk on 4 big and strong legs! 🐘✨",
      });
    }

    const prompt = `Create a multiple choice question for a Standard 1 child (6 years old) about: "${topic || "animals"}".
The question should belong to the subject "${subject || "Discovery/EVS"}".
Keep it simple, highly visual, and fun.`;

    const response = await callGeminiWithRetry({
      primaryModel: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert elementary school teacher creating highly engaging quizzes for standard 1 kids. Return the output in strict JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The child-friendly question text, including a relevant emoji.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four simple alternative options.",
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The exact string from the options array that is correct.",
            },
            explanation: {
              type: Type.STRING,
              description: "A fun, simple, highly encouraging 1-sentence explanation with emojis.",
            },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    const quizData = JSON.parse(jsonStr);
    res.json(quizData);
  } catch (error: any) {
    console.error("Gemini Custom Quiz Error:", error);
    // Return a stable fallback
    res.json({
      question: `What color is the beautiful sun in the sky? ☀️`,
      options: ["Blue 🔵", "Red 🔴", "Yellow 🟡", "Green 🟢"],
      correctAnswer: "Yellow 🟡",
      explanation: "The sun is yellow and gives us bright light and warmth! ☀️✨",
    });
  }
});

// API: Text to Speech (Premium Voice synthesis)
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, character } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!ai) {
      return res.status(503).json({ error: "Gemini client not configured" });
    }

    const voiceMap: Record<string, string> = {
      chiku: "Fenrir", // Playful, excited
      kiki: "Kore",    // Bright, chirpy
      robo: "Puck",    // Tech-like, digital
      maya: "Zephyr",  // Warm, steady
    };
    const voiceName = voiceMap[character?.toLowerCase()] || "Kore";

    // Request speech modalities from the preview model
    const response = await callGeminiWithRetry({
      primaryModel: "gemini-3.1-flash-tts-preview",
      fallbackModels: [], // Only retry the tts model itself, do not fallback to regular models
      contents: [{ parts: [{ text: `Read very slowly, clearly, and expressively for a primary school child: "${text}"` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: "No audio generated from model" });
    }
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({ error: error.message || "TTS generation failed" });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
