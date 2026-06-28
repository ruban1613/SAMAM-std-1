import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  auth, 
  logActivity,
  signInWithGoogle
} from "../firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { Mail, Lock, User, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { playClickSound, playPopSound } from "../utils/audio";

interface AuthPagesProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AuthPages({ onBack, onSuccess }: AuthPagesProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    playClickSound();
    setIsSignUp(prev => !prev);
    setError(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const handleParentGoogleSignIn = async () => {
    playPopSound();
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      await logActivity("User Auth via Google", `User "${user.displayName || user.email}" authenticated successfully via Google.`);
      onSuccess();
    } catch (err: any) {
      console.error("Google authentication error:", err);
      setError(err.message || "An error occurred during Google authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playPopSound();
    setError(null);
    setLoading(true);

    if (isSignUp) {
      // Sign Up validation
      if (!name.trim()) {
        setError("Please enter your name adventurer!");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 magical characters long!");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Your passwords do not match! Double check and try again.");
        setLoading(false);
        return;
      }

      try {
        // 1. Create user on client side
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        
        // 2. Update display name
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName: name.trim() });
        }

        // 3. Sync with backend database via ID Token
        const idToken = await userCred.user.getIdToken();
        const syncRes = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({ role: "parent", name: name.trim() })
        });
        
        if (!syncRes.ok) {
          console.warn("Database sync completed with warnings.");
        }

        await logActivity("User Registered", `New parent user "${name.trim()}" (${email.trim()}) signed up.`);
        onSuccess();
      } catch (err: any) {
        console.error("Signup error:", err);
        if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("operation-not-allowed"))) {
          setError("Email/Password login is not enabled in your Firebase project yet! (auth/operation-not-allowed). Please enable it in your Firebase Console, or log in instantly using Google below.");
        } else {
          setError(err.message || "An error occurred during magical registration.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In
      try {
        // 1. Sign in on client side
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);

        // 2. Sync with backend database via ID Token
        const idToken = await userCred.user.getIdToken();
        const syncRes = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({ role: "parent" })
        });

        if (!syncRes.ok) {
          console.warn("Database sync completed with warnings.");
        }

        await logActivity("User Logged In", `Parent user "${email.trim()}" signed in.`);
        onSuccess();
      } catch (err: any) {
        console.error("Login error:", err);
        if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("operation-not-allowed"))) {
          setError("Email/Password login is not enabled in your Firebase project yet! (auth/operation-not-allowed). Please enable it in your Firebase Console, or log in instantly using Google below.");
        } else {
          setError("Oops! Invalid email or password. Please double check and try again!");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBEB] via-indigo-50 to-purple-50 text-slate-800 font-sans flex flex-col justify-between py-8 px-4 select-none relative overflow-hidden">
      
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing
        </motion.button>
      </div>

      {/* Floating Sparkles decoration */}
      <div className="absolute top-1/4 right-1/4 text-4xl opacity-20 pointer-events-none animate-bounce">✨</div>
      <div className="absolute bottom-1/4 left-1/4 text-4xl opacity-20 pointer-events-none animate-bounce" style={{ animationDelay: "1s" }}>🎈</div>

      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white rounded-[36px] p-8 shadow-xl border-4 border-slate-800 space-y-6"
          >
            {/* Form Header */}
            <div className="text-center space-y-2">
              <span className="text-4xl">🔑</span>
              <h2 className="text-2xl font-black text-slate-800">
                {isSignUp ? "Create Parent Account" : "Welcome Back Parent!"}
              </h2>
              <p className="text-xs font-bold text-slate-400">
                {isSignUp 
                  ? "Sign up to register student profiles and unlock volume chapters" 
                  : "Sign in to resume standard 1 progress and learning activities"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-black flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
                {error.includes("operation-not-allowed") && (
                  <div className="bg-amber-50/60 p-4 rounded-2xl text-xs space-y-2 border-2 border-amber-200 text-slate-700 font-bold">
                    <p className="text-amber-700">💡 How to enable Email/Password login:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-600 font-bold">
                      <li>Open your <span className="text-indigo-600">Firebase Console</span>.</li>
                      <li>Navigate to <span className="font-black">Build &gt; Authentication &gt; Sign-in method</span>.</li>
                      <li>Click <span className="font-black">Add new provider</span>, select <span className="font-black">Email/Password</span>, toggle <span className="font-black">Enable</span>, and click <span className="font-black">Save</span>.</li>
                    </ol>
                    <p className="text-emerald-700 mt-2">✨ Or use the zero-setup button below:</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. parent@example.com"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Must be at least 6 characters"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm py-4 rounded-2xl shadow-md border-b-4 border-indigo-800 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:bg-slate-200 disabled:border-b-0"
              >
                {loading ? (
                  <span>Magical Loading... 🌀</span>
                ) : (
                  <>
                    <span>{isSignUp ? "Register Account" : "Access Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="mx-3 text-[10px] font-black text-slate-400 uppercase">OR</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleParentGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-black text-xs py-3.5 rounded-2xl shadow-md cursor-pointer transition-all active:scale-98 border-2 border-slate-200 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.81-6.277-6.277 0-3.466 2.81-6.277 6.277-6.277 1.481 0 2.836.513 3.914 1.371l3.051-3.051C18.91 1.956 15.823 1 12.24 1s-8.24 3.01-8.24 8.24 3.01 8.24 8.24 8.24c5.158 0 8.014-3.518 8.014-8.014 0-.441-.038-.881-.11-1.311h-7.904z" />
              </svg>
              {isSignUp ? "Sign Up with Google Account" : "Access with Google Account"}
            </button>

            {/* Toggle Sign Up / Sign In link */}
            <div className="pt-4 border-t-2 border-dashed border-slate-100 text-center">
              <button
                onClick={handleToggle}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                {isSignUp 
                  ? "Already have an account? Sign In here!" 
                  : "Don't have an account yet? Create one now!"}
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <footer className="text-center text-slate-400 text-xxs">
        <p>© 2026 SAMAM E-Book Adventure · Secured Parent-Protected Space</p>
      </footer>

    </div>
  );
}
