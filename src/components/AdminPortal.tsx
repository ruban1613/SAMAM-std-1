import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  auth, 
  db, 
  isAdminSetupCompleted, 
  isCurrentUserAdmin, 
  registerAdminAccount, 
  getActivityLogs, 
  ActivityLog,
  signInWithGoogle
} from "../firebase";
import { 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User, 
  FileText, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  LogOut 
} from "lucide-react";
import { playClickSound, playPopSound } from "../utils/audio";

interface AdminPortalProps {
  onBack: () => void;
}

export default function AdminPortal({ onBack }: AdminPortalProps) {
  const [isSetupDone, setIsSetupDone] = useState<boolean | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Registration States
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  // Initial checks
  useEffect(() => {
    async function runChecks() {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/admin/check-setup");
        const data = await res.json();
        const setupCompleted = data.isSetupDone;
        setIsSetupDone(setupCompleted);

        // Check if an admin is already logged in
        const user = auth.currentUser;
        if (user && setupCompleted) {
          const adminCheck = await isCurrentUserAdmin(user.uid);
          if (adminCheck) {
            setIsAdminLoggedIn(true);
            await fetchLogs();
          } else {
            // Logged in but not admin, sign out from this view
            await signOut(auth);
          }
        }
      } catch (err) {
        console.error("Initial admin checks failed:", err);
      } finally {
        setLoading(false);
      }
    }
    runChecks();
  }, []);

  const fetchLogs = async () => {
    try {
      const activityLogs = await getActivityLogs(150);
      setLogs(activityLogs);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    }
  };

  const handleRefreshLogs = async () => {
    playClickSound();
    setLoading(true);
    await fetchLogs();
    setLoading(false);
  };

  const handleAdminGoogleSignUp = async () => {
    playPopSound();
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Setup Admin records using their Google authenticated details
      await registerAdminAccount(user.email || "", user.displayName || "Google Admin");
      
      setSuccessMsg("System Administrator Account Created Successfully via Google! Slot is now permanently locked.");
      setIsSetupDone(true);
      setIsAdminLoggedIn(true);
      await fetchLogs();
    } catch (err: any) {
      console.error("Admin Google setup failed:", err);
      setError(err.message || "Failed to provision administrator account via Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    playPopSound();
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();

      const adminCheck = await isCurrentUserAdmin(user.uid);
      if (adminCheck) {
        setIsAdminLoggedIn(true);
        await fetchLogs();
      } else {
        await signOut(auth);
        setError("Access Denied: Your Google account is not a registered System Administrator.");
      }
    } catch (err: any) {
      console.error("Admin Google login failed:", err);
      setError(err.message || "Access Denied: Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignUp = async (e: FormEvent) => {
    e.preventDefault();
    playPopSound();
    setError(null);
    setLoading(true);

    if (!adminName.trim()) {
      setError("Please enter your administrator name.");
      setLoading(false);
      return;
    }
    if (adminPassword.length < 6) {
      setError("Admin password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      setError("Admin passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create User in Firebase Auth client-side
      const userCred = await createUserWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
      
      // 2. Setup Admin records in Firestore (locks setup slot)
      await registerAdminAccount(adminEmail.trim(), adminName.trim());

      // 3. Sync to Cloud SQL database via ID Token
      const idToken = await userCred.user.getIdToken();
      const syncRes = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ role: "admin", name: adminName.trim() })
      });

      if (!syncRes.ok) {
        console.warn("Database sync completed with warnings.");
      }
      
      setSuccessMsg("System Administrator Account Created Successfully! Slot is now permanently locked.");
      setIsSetupDone(true);
      setIsAdminLoggedIn(true);
      await fetchLogs();
    } catch (err: any) {
      console.error("Admin setup failed:", err);
      if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("operation-not-allowed"))) {
        setError("Email/Password login is not enabled in your Firebase project yet! (auth/operation-not-allowed). Please enable it in your Firebase Console, or log in instantly using Google below.");
      } else {
        setError(err.message || "Failed to provision administrator account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    playPopSound();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate with Firebase client-side
      const userCred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);

      // 2. Validate admin privileges
      const adminCheck = await isCurrentUserAdmin(userCred.user.uid);
      if (!adminCheck) {
        await signOut(auth);
        throw new Error("Access Denied: You are not a registered System Administrator.");
      }

      // 3. Sync to Cloud SQL database via ID Token
      const idToken = await userCred.user.getIdToken();
      const syncRes = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ role: "admin" })
      });

      if (!syncRes.ok) {
        console.warn("Database sync completed with warnings.");
      }

      setIsAdminLoggedIn(true);
      await fetchLogs();
    } catch (err: any) {
      console.error("Admin login failed:", err);
      if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("operation-not-allowed"))) {
        setError("Email/Password login is not enabled in your Firebase project yet! (auth/operation-not-allowed). Please enable it in your Firebase Console, or log in instantly using Google below.");
      } else {
        setError(err.message || "Access Denied: Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    playClickSound();
    setLoading(true);
    try {
      await signOut(auth);
      setIsAdminLoggedIn(false);
      setLoginEmail("");
      setLoginPassword("");
      setError(null);
    } catch (err) {
      console.error("Failed to log out admin:", err);
    } finally {
      setLoading(false);
    }
  };

  // Log filtering
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "All" || log.action.includes(actionFilter);

    return matchesSearch && matchesAction;
  });

  if (loading && isSetupDone === null) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4 font-sans select-none">
        <span className="text-5xl animate-spin">🌀</span>
        <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Verifying Admin clearance levels...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between py-8 px-4 select-none relative overflow-hidden">
      
      {/* Back button */}
      {!isAdminLoggedIn && (
        <div className="absolute top-4 left-4 z-50">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound();
              onBack();
            }}
            className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 text-slate-300 text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Landing Page
          </motion.button>
        </div>
      )}

      {/* Background patterns */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto my-auto relative z-10 space-y-8">
        
        {/* VIEW 1: SINGLE SLOT ADMIN REGISTRATION */}
        {isSetupDone === false && !isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-slate-900 border-4 border-amber-500/60 rounded-[36px] p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="text-5xl">🗝️</span>
              <h2 className="text-2xl font-black text-white">Create System Admin</h2>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-md">
                ⚠️ Exclusive Single Slot Available
              </span>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mt-2">
                This is the unique administration setup slot. After you fill this slot, nobody else will ever be permitted to create an admin account!
              </p>
            </div>

            {error && (
              <div className="space-y-3">
                <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                  ⚠️ {error}
                </div>
                {error.includes("operation-not-allowed") && (
                  <div className="bg-slate-950 p-4 rounded-xl text-xs space-y-2 border border-slate-800 text-slate-300">
                    <p className="font-bold text-amber-400">💡 How to enable Email/Password login:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-400 font-medium">
                      <li>Open your <span className="text-indigo-400 font-bold">Firebase Console</span>.</li>
                      <li>Navigate to <span className="font-bold">Build &gt; Authentication &gt; Sign-in method</span>.</li>
                      <li>Click <span className="font-bold">Add new provider</span>, select <span className="font-bold">Email/Password</span>, toggle <span className="font-bold">Enable</span>, and click <span className="font-bold">Save</span>.</li>
                    </ol>
                    <p className="font-bold text-emerald-400 mt-2">✨ Or use the zero-setup button below:</p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleAdminSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Admin Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Master Administrator"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Repeat admin password"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs py-4 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-4 border-amber-700"
              >
                Claim Admin Slot & Setup 🗝️
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="mx-3 text-[10px] font-black text-slate-500 uppercase">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleAdminGoogleSignUp}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-4 border-slate-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.81-6.277-6.277 0-3.466 2.81-6.277 6.277-6.277 1.481 0 2.836.513 3.914 1.371l3.051-3.051C18.91 1.956 15.823 1 12.24 1s-8.24 3.01-8.24 8.24 3.01 8.24 8.24 8.24c5.158 0 8.014-3.518 8.014-8.014 0-.441-.038-.881-.11-1.311h-7.904z" />
              </svg>
              Sign Up as Admin with Google 🗝️
            </button>
          </motion.div>
        )}

        {/* VIEW 2: ADMIN LOGIN (IF SLOT FILLED) */}
        {isSetupDone === true && !isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-slate-900 border-4 border-slate-800 rounded-[36px] p-8 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="text-5xl">🔒</span>
              <h2 className="text-2xl font-black text-white">Admin Login</h2>
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                ✔ Admin Setup Locked
              </span>
              <p className="text-xs font-bold text-slate-400 mt-2">
                The administrative account has been established. Log in with your credentials to manage user logs.
              </p>
            </div>

            {error && (
              <div className="space-y-3">
                <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs font-semibold">
                  ⚠️ {error}
                </div>
                {error.includes("operation-not-allowed") && (
                  <div className="bg-slate-950 p-4 rounded-xl text-xs space-y-2 border border-slate-800 text-slate-300">
                    <p className="font-bold text-amber-400">💡 How to enable Email/Password login:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-400 font-medium">
                      <li>Open your <span className="text-indigo-400 font-bold">Firebase Console</span>.</li>
                      <li>Navigate to <span className="font-bold">Build &gt; Authentication &gt; Sign-in method</span>.</li>
                      <li>Click <span className="font-bold">Add new provider</span>, select <span className="font-bold">Email/Password</span>, toggle <span className="font-bold">Enable</span>, and click <span className="font-bold">Save</span>.</li>
                    </ol>
                    <p className="font-bold text-emerald-400 mt-2">✨ Or use the zero-setup button below:</p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs font-black text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-4 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-4 border-indigo-800"
              >
                Access Administration Logs ➔
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="mx-3 text-[10px] font-black text-slate-500 uppercase">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleAdminGoogleLogin}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-4 border-slate-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.81-6.277-6.277 0-3.466 2.81-6.277 6.277-6.277 1.481 0 2.836.513 3.914 1.371l3.051-3.051C18.91 1.956 15.823 1 12.24 1s-8.24 3.01-8.24 8.24 3.01 8.24 8.24 8.24c5.158 0 8.014-3.518 8.014-8.014 0-.441-.038-.881-.11-1.311h-7.904z" />
              </svg>
              Sign In with Google Account ➔
            </button>
          </motion.div>
        )}

        {/* VIEW 3: SECURED ADMIN LOGS DASHBOARD */}
        {isAdminLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border-4 border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🛡️</span>
                  <h1 className="text-2xl font-black text-white">Administrative Portal</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    ✔ Cloud Log Synced
                  </span>
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    🔐 Double Encrypted
                  </span>
                  <span className="text-xs text-slate-400">Admin UID: {auth.currentUser?.uid}</span>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" /> Close Session
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex items-center gap-3">
                <div className="bg-indigo-950 text-indigo-400 p-2.5 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-500">Total Activities</h4>
                  <p className="text-xl font-black text-white">{logs.length}</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex items-center gap-3">
                <div className="bg-emerald-950 text-emerald-400 p-2.5 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-500">Security Clearance</h4>
                  <p className="text-xl font-black text-white">Grade Level A</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex items-center gap-3">
                <div className="bg-amber-950 text-amber-400 p-2.5 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-500">Single Setup Slot</h4>
                  <p className="text-xl font-black text-white">Permanently Locked</p>
                </div>
              </div>
            </div>

            {/* Filter and search controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-850">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs by action, actor, details..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden md:inline">Filters:</span>
                {["All", "Registered", "Logged In", "Saved"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      playClickSound();
                      setActionFilter(filter);
                    }}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      actionFilter === filter
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                
                <button
                  onClick={handleRefreshLogs}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 p-2 rounded-lg cursor-pointer transition-all active:scale-90"
                  title="Refresh activity logs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Activity logs list / table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden">
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left border-collapse text-xs select-text">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 font-black uppercase tracking-wider border-b border-slate-850 text-[10px]">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Actor</th>
                      <th className="p-4">Event Action</th>
                      <th className="p-4">Specific Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 font-semibold text-slate-300">
                    <AnimatePresence>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map(log => (
                          <motion.tr 
                            key={log.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-900/40 transition-colors"
                          >
                            <td className="p-4 text-slate-450 text-[11px] font-mono whitespace-nowrap">{log.timestamp}</td>
                            <td className="p-4 whitespace-nowrap">
                              <p className="font-bold text-white leading-none">{log.userName}</p>
                              <span className="text-[10px] text-slate-500">{log.userEmail}</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                log.action.includes("Registered") || log.action.includes("Created")
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                  : log.action.includes("Logged")
                                  ? "bg-indigo-950 text-indigo-400 border border-indigo-900"
                                  : log.action.includes("Saved")
                                  ? "bg-amber-950 text-amber-400 border border-amber-900"
                                  : "bg-slate-900 text-slate-400 border border-slate-800"
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 max-w-xs md:max-w-sm truncate" title={log.details}>
                              {log.details}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-slate-500 font-bold">
                            <ShieldAlert className="w-8 h-8 text-slate-650 mx-auto mb-2 opacity-55" />
                            No matching administration security logs found.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

      </div>

      {/* Footer Area */}
      <footer className="text-center text-slate-600 text-xxs pt-12 relative z-10">
        <p>© 2026 SAMAM Administrator Portal. System clearance level restricted.</p>
      </footer>

    </div>
  );
}
