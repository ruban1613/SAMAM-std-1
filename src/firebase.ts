import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { StudentProgress } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyDIGpap3rU0qm301YNbJExs5EHnGemhsHA",
  authDomain: "elliptical-delight-p8kj5.firebaseapp.com",
  projectId: "elliptical-delight-p8kj5",
  storageBucket: "elliptical-delight-p8kj5.firebasestorage.app",
  messagingSenderId: "738359497692",
  appId: "1:738359497692:web:a9a2a4bf8885efad1b3519"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the custom database ID
export const db = getFirestore(app, "ai-studio-0880b8fb-275a-4c34-93bc-3cf705bdd214");

// Initialize Auth
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string; // Emoji
  standard?: number; // Standard 1 to 5
  progress: StudentProgress;
  createdAt: string;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: string; // e.g. "User Registered", "Student Profile Created", "Quiz Completed"
  details: string; // e.g. "Math Chapter 1 score: 4/5"
  timestamp: any;
}

export const INITIAL_PROGRESS: StudentProgress = {
  subjectsCompleted: {
    math: 0,
    lang: 0,
    evs: 0,
    art: 0,
    life: 0,
  },
  badgesEarned: [],
  quizScores: {},
  completedChapterIds: [],
  speedGridBestTime: undefined,
  pathfinderBestScore: undefined,
  dailyStreak: 1,
  completedChapterPages: {},
};

/**
 * Fetch all student profiles from Firestore
 */
export async function getStudentProfiles(): Promise<StudentProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const profiles: StudentProfile[] = [];
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() } as StudentProfile);
    });
    return profiles;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "students");
    return [];
  }
}

/**
 * Recursively removes all undefined properties from an object to make it Firestore-safe.
 */
function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (typeof obj === "object") {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = (obj as any)[key];
        if (val !== undefined) {
          cleaned[key] = cleanUndefined(val);
        }
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Create or save/update a student profile in Firestore
 */
export async function saveStudentProfile(profile: StudentProfile): Promise<void> {
  try {
    const studentRef = doc(db, "students", profile.id);
    const cleanedData = cleanUndefined({
      name: profile.name,
      avatar: profile.avatar,
      progress: profile.progress,
      createdAt: profile.createdAt,
    });
    await setDoc(studentRef, cleanedData, { merge: true });
    
    // Log student profile activity in background
    if (auth.currentUser) {
      await logActivity(
        "Student Profile Saved",
        `Student "${profile.name}" (${profile.avatar}) progress updated.`
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${profile.id}`);
  }
}

/**
 * Write a new activity log entry to Firestore
 */
export async function logActivity(action: string, details: string): Promise<void> {
  try {
    const user = auth.currentUser;
    const logData: ActivityLog = {
      userId: user?.uid || "anonymous",
      userEmail: user?.email || "anonymous",
      userName: user?.displayName || "Anonymous User",
      action,
      details,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, "activityLogs"), logData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "activityLogs");
  }
}

/**
 * Retrieve activity logs for Admin view (ordered by latest timestamp)
 */
export async function getActivityLogs(limitCount: number = 100): Promise<ActivityLog[]> {
  try {
    const logsCol = collection(db, "activityLogs");
    const q = query(logsCol, orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    const logs: ActivityLog[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        userId: data.userId || "",
        userEmail: data.userEmail || "",
        userName: data.userName || "",
        action: data.action || "",
        details: data.details || "",
        timestamp: data.timestamp ? data.timestamp.toDate().toLocaleString() : "Just now"
      });
    });
    return logs;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "activityLogs");
    return [];
  }
}

/**
 * Checks if the unique system admin slot has been filled.
 */
export async function isAdminSetupCompleted(): Promise<boolean> {
  try {
    const configDoc = await getDoc(doc(db, "adminConfig", "status"));
    return configDoc.exists() && configDoc.data()?.hasAdmin === true;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "adminConfig/status");
    return false;
  }
}

/**
 * Checks if a specific UID is registered in the list of admins.
 */
export async function isCurrentUserAdmin(uid: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, "admins", uid));
    return adminDoc.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `admins/${uid}`);
    return false;
  }
}

/**
 * Registers the single-slot administrator account.
 * This will create the admin user in Firebase Auth, write their profile to `/admins/{uid}`,
 * and write `hasAdmin: true` to `/adminConfig/status`.
 * If an admin setup has already been completed, it throws an error.
 */
export async function registerAdminAccount(email: string, name: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be signed in to promote to admin");
  }

  // Check if admin is already set up to prevent duplicate registration
  const setupDone = await isAdminSetupCompleted();
  if (setupDone) {
    throw new Error("Admin registration is closed! A system administrator account has already been created.");
  }

  try {
    // 1. Update auth profile display name
    await updateProfile(user, { displayName: name });
  } catch (error) {
    console.error("Error updating auth profile displayName:", error);
  }

  try {
    // 2. Add to admins collection
    await setDoc(doc(db, "admins", user.uid), {
      email,
      name,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${user.uid}`);
  }

  try {
    // 3. Mark admin setup as complete to lock out any future signups
    await setDoc(doc(db, "adminConfig", "status"), {
      hasAdmin: true,
      adminUid: user.uid,
      setupCompletedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "adminConfig/status");
  }

  try {
    await logActivity("Admin Created", `Admin profile created for ${name} (${email}). Setup slot is now locked.`);
  } catch (error) {
    console.error("Failed to log activity for admin creation:", error);
  }
}
