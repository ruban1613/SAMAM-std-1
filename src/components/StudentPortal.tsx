import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, LogOut, ArrowRight, Sun, Moon } from "lucide-react";
import { StudentProfile } from "../firebase";
import { playClickSound, playPopSound } from "../utils/audio";

interface StudentPortalProps {
  profiles: StudentProfile[];
  isLoading: boolean;
  onSelectStudent: (profile: StudentProfile) => void;
  onCreateStudent: (name: string, avatar: string, standard: number) => Promise<void>;
  onLogoutUser: () => void;
  isNightMode: boolean;
  toggleNightMode: () => void;
}

export default function StudentPortal({
  profiles,
  isLoading,
  onSelectStudent,
  onCreateStudent,
  onLogoutUser,
  isNightMode,
  toggleNightMode
}: StudentPortalProps) {
  const [newStudentName, setNewStudentName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🐵");
  const [selectedStandard, setSelectedStandard] = useState<number>(1);
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AVAILABLE_AVATARS = ["🐵", "🦜", "🤖", "🧭", "🦁", "🐼", "🐯", "🦄", "🐱", "🐶", "🐰", "🦊"];

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || isSubmitting) return;

    playPopSound();
    setIsSubmitting(true);
    try {
      await onCreateStudent(newStudentName.trim(), selectedAvatar, selectedStandard);
      setNewStudentName("");
    } catch (err) {
      console.error("Failed to create student profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = loginName.trim().toLowerCase();
    if (!trimmed) return;

    const found = profiles.find(p => p.name.trim().toLowerCase() === trimmed);
    if (found) {
      setLoginError("");
      setLoginName("");
      onSelectStudent(found);
    } else {
      playClickSound();
      setLoginError(`Oops! We couldn't find an adventurer named "${loginName}". Double-check the spelling, or create a brand new explorer profile! 🎒✨`);
    }
  };

  return (
    <div className={`min-h-screen ${isNightMode ? "night-theme bg-[#1A1512]" : "bg-[#FFFBEB]"} flex flex-col justify-between py-8 px-4 select-none font-sans relative overflow-hidden transition-colors duration-500`}>
      
      {/* Floating Night Mode and User Log Out Toggles */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={toggleNightMode}
          className={`p-2.5 sm:p-3 rounded-full border-2 cursor-pointer shadow-md transition-all active:scale-90 flex items-center justify-center gap-1.5 ${
            isNightMode 
              ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200" 
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
          }`}
          title={isNightMode ? "Switch to Day Mode ☀️" : "Switch to Night Mode 🌙"}
        >
          {isNightMode ? <span>☀️</span> : <span>🌙</span>}
        </button>

        <button
          onClick={() => {
            playClickSound();
            onLogoutUser();
          }}
          className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-700 text-xs font-black px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out Parent
        </button>
      </div>

      {/* Ambient background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-200/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: "15s" }} />

      <div className="max-w-5xl w-full mx-auto space-y-8 my-auto relative z-10">
        {/* Logo Heading */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-600 border-2 border-indigo-200 uppercase tracking-widest">
            ✨ S.A.M.A.M · Adventure Land Student Portal
          </span>
          <h1 className={`text-4xl sm:text-5xl font-black ${isNightMode ? "text-amber-100" : "text-slate-800"} leading-tight`}>
            Select Your Explorer! 🏰
          </h1>
          <p className="text-sm font-extrabold text-slate-500 max-w-lg mx-auto leading-relaxed">
            Welcome to the adventurer entrance. Choose a registered student profile to load your interactive workbook journey, or create a brand new profile to register! 🎒✨
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-[36px] p-12 shadow-xl border-4 border-slate-800 max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
            <span className="text-5xl animate-spin">🌀</span>
            <p className="text-sm font-black text-slate-500">Loading learning scrolls...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Pillar 1: Registered Student Profiles (Left side, takes 7 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 border-slate-800 flex flex-col justify-between space-y-6 lg:col-span-7"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                  <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600 border-2 border-indigo-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-black text-slate-800">
                      Registered Students
                    </h3>
                    <p className="text-xs font-bold text-slate-400">Continue a current student quest</p>
                  </div>
                </div>

                {/* Profile quick selector search */}
                <form onSubmit={handleNameSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => {
                      setLoginName(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    placeholder="Search profile by name..."
                    className="flex-1 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-black text-slate-800 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    Go!
                  </button>
                </form>

                {loginError && (
                  <p className="text-[10px] font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100 leading-normal">
                    {loginError}
                  </p>
                )}

                {/* Explorer Verification Guard - Hidden Public Profiles */}
                <div className="p-5 bg-indigo-50/40 rounded-2xl border-2 border-dashed border-indigo-100 text-center space-y-3">
                  <span className="text-4xl select-none block">🔒</span>
                  <h4 className="font-black text-indigo-950 text-xs uppercase tracking-wider">
                    Explorer Verification Guard
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 leading-relaxed max-w-sm mx-auto">
                    To protect every explorer's achievements and records, profile lists are private. Simply type your exact registered name in the search box above and press <span className="font-black text-indigo-600">"Go!"</span> to load your personalized interactive adventure!
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/60 p-4.5 rounded-2xl border-2 border-indigo-100/60 text-center">
                <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest leading-none">
                  ⭐ Cloud Database Connection Active
                </p>
                <p className="text-[9px] font-bold text-indigo-500 mt-1">
                  Scores, stats, and collectibles are automatically synced securely in the cloud!
                </p>
              </div>
            </motion.div>

            {/* Pillar 2: Create a Brand New Profile (Right side, takes 5 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
              className="bg-white rounded-[36px] p-6 sm:p-8 shadow-xl border-4 border-slate-800 flex flex-col justify-between space-y-6 lg:col-span-5"
            >
              <form onSubmit={handleCreateSubmit} className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                    <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-600 border-2 border-emerald-200">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-black text-slate-800">
                        New Student
                      </h3>
                      <p className="text-xs font-bold text-slate-400">Add an adventurer explorer</p>
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                      Explorer's Name? ✏
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={18}
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Type explorer name..."
                      className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white rounded-2xl px-4 py-3 text-xs font-black text-slate-800 outline-none transition-all"
                    />
                  </div>



                  {/* Avatar Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                      Mascot Buddy! 🐾
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {AVAILABLE_AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedAvatar(av);
                          }}
                          className={`h-9 w-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer border-2 ${
                            selectedAvatar === av
                              ? "bg-emerald-500 text-white border-emerald-400 shadow-md scale-105"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!newStudentName.trim() || isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-black py-3.5 rounded-2xl shadow-md border-b-4 border-emerald-700 disabled:border-b-0 cursor-pointer transform active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>{isSubmitting ? "Creating..." : "Start Adventure! 🌈"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-xxs pt-10">
        <p>Made with 💖 for Standard 1 Educational Journeys · Cloud Synchronized</p>
      </footer>

    </div>
  );
}
