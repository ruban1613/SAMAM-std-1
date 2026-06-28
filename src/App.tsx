import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  MessageSquare, 
  Heart, 
  LogOut, 
  Sun, 
  Moon 
} from "lucide-react";
import SyllabusBook from "./components/SyllabusBook";
import PlayZone from "./components/PlayZone";
import AIBuddy from "./components/AIBuddy";
import ProgressDashboard from "./components/ProgressDashboard";
import VisualDictionary from "./components/VisualDictionary";
import SaaSLandingPage from "./components/SaaSLandingPage";
import AuthPages from "./components/AuthPages";
import AdminPortal from "./components/AdminPortal";
import StudentPortal from "./components/StudentPortal";
import { StudentProgress } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  auth,
  getStudentProfiles, 
  saveStudentProfile, 
  isCurrentUserAdmin,
  StudentProfile, 
  INITIAL_PROGRESS 
} from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { playClickSound, playPopSound, triggerHaptic, speakClientSide } from "./utils/audio";
import CelebrationOverlay from "./components/CelebrationOverlay";

export default function App() {
  const [view, setView] = useState<"landing" | "auth" | "student_portal" | "ebook" | "admin">("landing");
  const [parentUser, setParentUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"syllabus" | "games" | "progress" | "chat">("syllabus");
  const [progress, setProgress] = useState<StudentProgress>(INITIAL_PROGRESS);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isVisualDictOpen, setIsVisualDictOpen] = useState(false);
  const [visualDictWordId, setVisualDictWordId] = useState<string | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [showCompanion, setShowCompanion] = useState(true);
  const [activeVolume, setActiveVolume] = useState<number>(1);

  // Window size tracking for floating button drag constraints
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Firestore-backed Student profile states
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Night Mode theme state
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    return localStorage.getItem("samam_night_mode") === "true";
  });

  const toggleNightMode = () => {
    playClickSound();
    setIsNightMode((prev) => {
      const next = !prev;
      localStorage.setItem("samam_night_mode", String(next));
      return next;
    });
  };

  // Listen to Firebase Auth changes to update our views and profiles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setParentUser(authUser);
        setIsLoadingProfiles(true);
        try {
          // Sync authenticated user with Cloud SQL database!
          try {
            const token = await authUser.getIdToken();
            const syncRes = await fetch("/api/auth/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
            });
            if (syncRes.ok) {
              console.log("Successfully synchronized authenticated user with Cloud SQL!");
            } else {
              console.error("Failed to sync authenticated user with Cloud SQL:", await syncRes.text());
            }
          } catch (syncErr) {
            console.error("Error during Cloud SQL auth sync:", syncErr);
          }

          // Check if current user is admin
          const adminCheck = await isCurrentUserAdmin(authUser.uid);
          if (adminCheck) {
            setView("admin");
          } else {
            // Only perform automatic redirect and profile loading for standard users
            // if we are not currently viewing the admin portal
            if (view !== "admin") {
              // Load student profiles for normal authenticated user
              const loaded = await getStudentProfiles();
              setProfiles(loaded);
              
              // Auto-login the last active student if available
              const lastActiveId = localStorage.getItem("samam_active_student_id");
              if (lastActiveId && loaded.length > 0) {
                const found = loaded.find(p => p.id === lastActiveId);
                if (found) {
                  const updated = updateStreakIfNeeded(found);
                  setCurrentStudent(updated);
                  setProgress(updated.progress);
                  setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
                  setView("ebook");
                } else {
                  setView("student_portal");
                }
              } else {
                setView("student_portal");
              }
            }
          }
        } catch (err) {
          console.error("Error setting user view on auth change:", err);
          if (view !== "admin") {
            setView("student_portal");
          }
        } finally {
          setIsLoadingProfiles(false);
        }
      } else {
        setParentUser(null);
        setProfiles([]);
        setCurrentStudent(null);
        // Only redirect to landing page if the user is on normal student/ebook portals
        if (view === "ebook" || view === "student_portal") {
          setView("landing");
        }
      }
    });

    return () => unsubscribe();
  }, [view]);

  // Check Gemini API service status on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(!!data.hasGeminiKey);
      })
      .catch((err) => {
        console.warn("Backend API offline", err);
      });
  }, []);

  // Streak update helper
  const updateStreakIfNeeded = (profile: StudentProfile): StudentProfile => {
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const lastActive = profile.progress.lastActiveDate;
    
    if (lastActive === todayStr) {
      return profile;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA");

    let newStreak = profile.progress.dailyStreak || 0;
    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // broken or new streak
    }

    const updatedProgress: StudentProgress = {
      ...profile.progress,
      dailyStreak: newStreak,
      lastActiveDate: todayStr,
    };

    const updatedProfile: StudentProfile = {
      ...profile,
      progress: updatedProgress,
    };

    // Save the updated profile to Firestore in background
    saveStudentProfile(updatedProfile).catch(err => {
      console.error("Failed to update streak in Firestore:", err);
    });

    return updatedProfile;
  };

  // Update progress state and Firestore safely
  const updateProgress = (updater: (prev: StudentProgress) => StudentProgress) => {
    setProgress((prev) => {
      const next = updater(prev);

      // Kid-friendly celebration triggers!
      let triggerCelebration = false;
      let msg = "";

      // 1. Check if a new badge was unlocked
      if (next.badgesEarned.length > prev.badgesEarned.length) {
        triggerCelebration = true;
        const newBadge = next.badgesEarned[next.badgesEarned.length - 1];
        msg = `You earned the super shiny ${newBadge.icon} ${newBadge.title} Badge! 🏅✨`;
      }
      // 2. Check if a new quiz was completed
      else if (Object.keys(next.quizScores).length > Object.keys(prev.quizScores).length) {
        triggerCelebration = true;
        msg = "Awesome work! You passed a new Quiz! 📝🏆";
      }
      // 3. Check if a quiz score was improved
      else {
        for (const qId in next.quizScores) {
          const prevScore = prev.quizScores[qId]?.score ?? -1;
          const nextScore = next.quizScores[qId]?.score ?? 0;
          if (nextScore > prevScore) {
            triggerCelebration = true;
            msg = "Woohoo! You got a higher score on your Quiz! ⭐🌟";
            break;
          }
        }
      }

      // 4. Check if a chapter was completed
      if (!triggerCelebration && next.completedChapterIds.length > prev.completedChapterIds.length) {
        triggerCelebration = true;
        msg = "Magnificent! You completed a Chapter book! 📖🎒";
      }

      // 5. Check if a game score/time was updated/improved
      if (!triggerCelebration) {
        if (next.speedGridBestTime !== prev.speedGridBestTime && next.speedGridBestTime !== undefined) {
          triggerCelebration = true;
          msg = "Lightning fast! You set a new Speed Grid record! 🔢⚡";
        } else if (next.pathfinderBestScore !== prev.pathfinderBestScore && next.pathfinderBestScore !== undefined) {
          if (prev.pathfinderBestScore === undefined || next.pathfinderBestScore > prev.pathfinderBestScore) {
            triggerCelebration = true;
            msg = "Outstanding explorer! New Pathfinder high score! 🦜✨";
          }
        }
      }

      if (triggerCelebration && msg) {
        setTimeout(() => {
          setCelebrationMessage(msg);
        }, 100);
      }

      if (currentStudent) {
        const updatedProfile: StudentProfile = {
          ...currentStudent,
          progress: next,
        };
        // Trigger haptic on update
        triggerHaptic(50);
        // Save back to Firestore in background
        saveStudentProfile(updatedProfile).catch(err => {
          console.error("Failed to save progress to Firestore:", err);
        });
        // Update local profiles list
        setProfiles(prevProfiles => 
          prevProfiles.map(p => p.id === currentStudent.id ? updatedProfile : p)
        );
        // Keep currentStudent reference updated
        setCurrentStudent(updatedProfile);
      }
      return next;
    });
  };

  const handleSelectStudent = (profile: StudentProfile) => {
    playPopSound();
    const updated = updateStreakIfNeeded(profile);
    setCurrentStudent(updated);
    setProgress(updated.progress);
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
    localStorage.setItem("samam_active_student_id", updated.id);
    setView("ebook");
  };

  const handleCreateStudent = async (name: string, avatar: string, standard: number) => {
    const newId = "student_" + Date.now();
    const todayStr = new Date().toLocaleDateString("en-CA");
    const newProfile: StudentProfile = {
      id: newId,
      name: name,
      avatar: avatar,
      standard: standard,
      progress: { 
        ...INITIAL_PROGRESS,
        dailyStreak: 1,
        lastActiveDate: todayStr,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      await saveStudentProfile(newProfile);
      setProfiles(prev => [...prev, newProfile]);
      setCurrentStudent(newProfile);
      setProgress(newProfile.progress);
      localStorage.setItem("samam_active_student_id", newId);
      setView("ebook");
    } catch (err) {
      console.error("Failed to save new student:", err);
    }
  };

  // Exit current student ebook and return to select explorer
  const handleLogout = () => {
    playClickSound();
    setCurrentStudent(null);
    localStorage.removeItem("samam_active_student_id");
    setView("student_portal");
  };

  // Sign out parent account
  const handleLogoutUser = async () => {
    playClickSound();
    try {
      await signOut(auth);
      setCurrentStudent(null);
      localStorage.removeItem("samam_active_student_id");
      setView("landing");
    } catch (err) {
      console.error("Failed to sign out parent:", err);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: SaaS Landing Page */}
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SaaSLandingPage 
              onStartQuest={() => {
                if (parentUser) {
                  setView("student_portal");
                } else {
                  setView("auth");
                }
              }}
              onAdminClick={() => setView("admin")}
            />
          </motion.div>
        )}

        {/* VIEW 2: Separate User Registration & Login */}
        {view === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPages 
              onBack={() => setView("landing")}
              onSuccess={() => setView("student_portal")}
            />
          </motion.div>
        )}

        {/* VIEW 3: Admin Console (Setup / Login / Dashboard) */}
        {view === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPortal 
              onBack={() => setView("landing")}
            />
          </motion.div>
        )}

        {/* VIEW 4: Student Selection & Creation Portal */}
        {view === "student_portal" && (
          <motion.div
            key="student_portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StudentPortal
              profiles={profiles}
              isLoading={isLoadingProfiles}
              onSelectStudent={handleSelectStudent}
              onCreateStudent={handleCreateStudent}
              onLogoutUser={handleLogoutUser}
              isNightMode={isNightMode}
              toggleNightMode={toggleNightMode}
            />
          </motion.div>
        )}

        {/* VIEW 5: Interactive Standard 1 E-Book Journey */}
        {view === "ebook" && currentStudent && (
          <motion.div
            key="ebook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen ${isNightMode ? "night-theme bg-[#1A1512]" : "bg-[#FFFBEB]"} pb-16 font-sans relative transition-colors duration-500`}
          >
            {/* Floating Night Mode Toggle */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              <button
                onClick={toggleNightMode}
                className={`p-2.5 sm:p-3 rounded-full border-2 cursor-pointer shadow-md transition-all active:scale-90 flex items-center justify-center gap-1.5 ${
                  isNightMode 
                    ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200" 
                    : "bg-slate-800/85 backdrop-blur-md border-white/20 text-yellow-300 hover:bg-slate-700/85 bg-slate-900"
                }`}
                title={isNightMode ? "Switch to Day Mode ☀️" : "Switch to Night Mode 🌙"}
              >
                {isNightMode ? <span>☀️</span> : <span>🌙</span>}
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
                  {isNightMode ? "Day Mode" : "Night Mode"}
                </span>
              </button>
            </div>

            {/* Dynamic Header / Hero Area */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-b-[48px] px-6 pt-12 pb-16 shadow-xl relative overflow-hidden border-b-8 border-orange-200">
              <div className="absolute top-0 left-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

              <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="flex justify-center items-center gap-2 select-none">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-white/20 backdrop-blur-md border-2 border-white/25 uppercase tracking-widest text-yellow-200 shadow-md">
                    ✨ S.A.M.A.M · Standard 1 · Volume 1 · Interactive E-Book
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight leading-tight select-none">
                  Welcome to <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 drop-shadow-md">
                    Adventure Land! 🏰
                  </span>
                </h1>

                {/* Student Status Bar */}
                <div className="max-w-md mx-auto bg-white/15 backdrop-blur-md p-3.5 rounded-3xl border-2 border-white/20 flex items-center justify-between gap-3 text-left shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl select-none">{currentStudent.avatar}</span>
                    <div>
                      <p className="text-xs text-yellow-200 font-black uppercase tracking-wider">Explorer Profile</p>
                      <h3 className="text-base font-black text-white">{currentStudent.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-600 text-[10px] font-black px-3.5 py-2 rounded-xl border-2 border-slate-100 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <LogOut className="w-3 h-3" /> Exit
                  </button>
                </div>
              </div>
            </div>

            {/* Main Body */}
            <main className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* S.A.M.A.M. Volume Tracker Banner */}
              <div className="lg:col-span-12 bg-indigo-900 border-4 border-indigo-950 rounded-[32px] p-6 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800/40 via-transparent to-pink-500/10 pointer-events-none" />
                
                <div className="space-y-1 md:max-w-md relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Volume 1 Published 🚀
                  </span>
                    <span className="text-xxs font-black text-indigo-200">STANDARD 1 CURRICULUM</span>
                  </div>
                  <h4 className="font-heading text-xl font-black text-white">S.A.M.A.M Learning Journey Path</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed font-semibold">
                    Complete all chapters & games in <span className="text-yellow-200">Volume {activeVolume}</span> to explore and expand your learning superpower!
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto relative z-10 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x">
                  {[1, 2, 3].map((vol) => {
                    const isActive = activeVolume === vol;
                    const isVol1Passed = progress.badgesEarned.some((b) => b.id === "volume1-graduate");
                    const isVol2Passed = progress.badgesEarned.some((b) => b.id === "volume2-graduate");
                    const isLocked = (vol === 2 && !isVol1Passed) || (vol === 3 && !isVol2Passed);

                    return (
                      <button
                        key={vol}
                        onClick={() => {
                          if (vol === 2 && !isVol1Passed) {
                            playClickSound();
                            speakClientSide("Volume 2 is locked! You must pass the Volume 1 Graduation Test first to unlock it!");
                            return;
                          }
                          if (vol === 3 && !isVol2Passed) {
                            playClickSound();
                            speakClientSide("Volume 3 is locked! You must pass the Volume 2 Graduation Test first with an 80 percent score to unlock it!");
                            return;
                          }
                          playClickSound();
                          setActiveVolume(vol);
                        }}
                        className={`flex-1 md:flex-none min-w-[120px] px-4 py-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 select-none border-2 ${
                          isActive
                            ? "bg-yellow-400 border-yellow-300 text-slate-900 shadow-md"
                            : isLocked
                            ? "bg-slate-800/80 border-slate-700 text-slate-500 opacity-60 cursor-not-allowed"
                            : "bg-indigo-950/60 hover:bg-indigo-950/85 border-indigo-800/50 text-indigo-200"
                        }`}
                      >
                        <span className="text-2xl">{isLocked ? "🔒" : (isActive ? "📖" : "📚")}</span>
                        <span className="text-xs font-black leading-none mt-1">Volume {vol}</span>
                        <span className={`text-[9px] font-black uppercase mt-1 tracking-wider ${isActive ? "text-amber-950" : isLocked ? "text-slate-400" : "text-indigo-400"}`}>
                          {isActive ? "Active 🟢" : isLocked ? "Locked 🔒" : "Select 💡"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="lg:col-span-12 bg-white rounded-[24px] sm:rounded-[28px] p-2 shadow-lg border-4 border-slate-800 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("syllabus");
                  }}
                  className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-2 ${
                    activeTab === "syllabus"
                      ? "bg-orange-500 border-orange-400 text-white border-b-4 border-b-orange-700 shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-orange-50/50 border-transparent hover:border-orange-100"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Curriculum Book
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("games");
                  }}
                  className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-2 ${
                    activeTab === "games"
                      ? "bg-orange-500 border-orange-400 text-white border-b-4 border-b-orange-700 shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-orange-50/50 border-transparent hover:border-orange-100"
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Play Games
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("progress");
                  }}
                  className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-2 ${
                    activeTab === "progress"
                      ? "bg-orange-500 border-orange-400 text-white border-b-4 border-b-orange-700 shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-orange-50/50 border-transparent hover:border-orange-100"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  My Progress
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setShowCompanion((prev) => !prev);
                  }}
                  className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-2 ${
                    showCompanion
                      ? "bg-indigo-600 border-indigo-500 text-white border-b-4 border-b-indigo-800 shadow-md animate-pulse"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 border-transparent hover:border-indigo-100"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Ask Buddy AI {showCompanion ? "🟢" : "💬"}
                </button>

                <button
                  onClick={() => {
                    playPopSound();
                    setVisualDictWordId(null);
                    setIsVisualDictOpen(true);
                  }}
                  className="flex-1 min-w-[130px] sm:min-w-0 py-2.5 sm:py-3.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer border-4 bg-yellow-400 border-yellow-300 text-slate-950 border-b-8 border-b-yellow-700 shadow-lg hover:bg-yellow-500 transform hover:-translate-y-0.5 active:translate-y-0 active:border-b-4 transition-all"
                >
                  <span>📔</span>
                  Visual Dictionary
                </button>
              </div>

              {/* Dynamic Workspace Area */}
              <div className="lg:col-span-12 space-y-6 transition-all duration-300">
                {activeTab === "syllabus" && (
                  <div className="animate-fade-in">
                    <SyllabusBook
                      progress={progress}
                      onUpdateProgress={updateProgress}
                      currentStudent={currentStudent}
                      activeVolume={activeVolume}
                      setActiveVolume={setActiveVolume}
                      onOpenVisualDictionary={(wordId) => {
                        setVisualDictWordId(wordId || null);
                        setIsVisualDictOpen(true);
                      }}
                    />
                  </div>
                )}

                {activeTab === "games" && (
                  <div className="space-y-6 animate-fade-in">
                    <PlayZone progress={progress} onUpdateProgress={updateProgress} currentStudent={currentStudent} />
                  </div>
                )}

                {activeTab === "progress" && (
                  <div className="animate-fade-in">
                    <ProgressDashboard
                      progress={progress}
                      studentName={currentStudent?.name || "Explorer"}
                      onUpdateProgress={updateProgress}
                      activeVolume={activeVolume}
                      setActiveVolume={setActiveVolume}
                    />
                  </div>
                )}
              </div>
            </main>

            {/* Floating Launcher Action Button for AI Companion */}
            {!showCompanion && (
              <motion.button
                drag
                dragMomentum={false}
                dragElastic={0.1}
                dragConstraints={{
                  left: -windowSize.width + 180,
                  right: 0,
                  top: -windowSize.height + 80,
                  bottom: 0
                }}
                whileDrag={{ scale: 1.05 }}
                onClick={() => {
                  playClickSound();
                  setShowCompanion(true);
                }}
                className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black px-3.5 py-2.5 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-indigo-400 cursor-pointer hover:scale-105 active:scale-95 opacity-50 hover:opacity-100 touch-none select-none hover:cursor-grab active:cursor-grabbing"
                title="Drag me anywhere! Talk to your AI Learning Companions!"
              >
                <span className="text-lg select-none animate-bounce">🐵</span>
                <span className="text-[11px] font-extrabold hidden sm:inline">Ask AI Companions ✨</span>
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  !
                </span>
              </motion.button>
            )}

            {/* Sliding Fixed Sidebar Drawer Overlay */}
            <AnimatePresence>
              {showCompanion && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      playClickSound();
                      setShowCompanion(false);
                    }}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[99] cursor-pointer"
                  />

                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-l-4 border-orange-100 z-[100] flex flex-col select-none h-screen"
                  >
                    <AIBuddy 
                      onClose={() => {
                        playClickSound();
                        setShowCompanion(false);
                      }} 
                      hasGeminiKey={hasGeminiKey}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Humble Footer */}
            <footer className="text-center text-slate-400 text-xs py-10 flex flex-col items-center justify-center gap-1.5">
              <p className="font-black flex items-center gap-1 text-slate-500">
                Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for SAMAM primary education
              </p>
              <p className="font-bold text-[10px] text-slate-400">Phase 1: Foundation & Engagement · Standard 1</p>
            </footer>

            {/* Confetti and Star-burst animation overlay */}
            <AnimatePresence>
              {celebrationMessage && (
                <CelebrationOverlay
                  message={celebrationMessage}
                  onComplete={() => setCelebrationMessage(null)}
                />
              )}
            </AnimatePresence>

            {/* Immersive Magical Visual Dictionary Modal Overlay */}
            <AnimatePresence>
              {isVisualDictOpen && (
                <VisualDictionary
                  onClose={() => setIsVisualDictOpen(false)}
                  initialWordId={visualDictWordId}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
