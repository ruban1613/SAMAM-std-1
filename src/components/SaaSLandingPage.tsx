import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle, Gamepad2, Compass, Award, Star, BookOpen, User } from "lucide-react";
import { playClickSound, playPopSound } from "../utils/audio";
import { kidSkillsData } from "../competencies/CompetencyData";

interface SaaSLandingPageProps {
  onStartQuest: () => void;
  onAdminClick: () => void;
}

export default function SaaSLandingPage({ onStartQuest, onAdminClick }: SaaSLandingPageProps) {
  
  const handleCTA = () => {
    playPopSound();
    onStartQuest();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBEB] via-orange-50 to-pink-50 text-slate-800 font-sans relative overflow-hidden select-none pb-12">
      
      {/* Playful Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-12 left-10 text-5xl opacity-40"
        >
          🎈
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-16 text-5xl opacity-40"
        >
          ☁️
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-1/3 left-12 text-4xl"
        >
          ⭐
        </motion.div>
        <motion.div 
          animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          className="absolute bottom-36 left-24 text-5xl opacity-30"
        >
          🦄
        </motion.div>
        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 360, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute bottom-48 right-24 text-4xl opacity-35"
        >
          🎡
        </motion.div>
      </div>

      {/* Hero Header Area */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-16 flex flex-col items-center justify-between relative z-10">
        <div className="w-full flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex items-center gap-2.5"
          >
            <span className="text-4xl bg-orange-100 p-2 rounded-3xl border-2 border-orange-200 shadow-md">🏰</span>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">SAMAM</h2>
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest bg-orange-100/60 px-2 py-0.5 rounded-full mt-1 inline-block">Kids Academy</span>
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTA}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md border-b-4 border-indigo-800 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <User className="w-3.5 h-3.5" /> Parent Sign In
          </motion.button>
        </div>

        {/* Hero Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full mt-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-orange-100 text-orange-600 border-2 border-orange-200 uppercase tracking-widest shadow-sm">
              ✨ Play-Led Learning SaaS For Standard 1
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
              Where Standard 1 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-600 drop-shadow-sm">
                Becomes A Magical Quest!
              </span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform traditional primary school subjects into an interactive, play-led educational saga. 
              Featuring AI companion buddies, custom speed arithmetic challenges, phonics exploration, 
              and gorgeous collectible achievement badges!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.08, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCTA}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black text-base px-8 py-5 rounded-[24px] shadow-lg border-b-6 border-orange-700 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Start Your Adventure! 🚀</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
                <span>⭐ No credit card required</span>
                <span className="text-slate-300">•</span>
                <span>🔒 Secure cloud database</span>
              </div>
            </div>

            {/* Mascot Bubbles */}
            <div className="pt-4 flex justify-center lg:justify-start gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/75 border-2 border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-extrabold">
                <span className="text-xl">🐵</span> Chiku the Math Monkey
              </div>
              <div className="flex items-center gap-2 bg-white/75 border-2 border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-extrabold">
                <span className="text-xl">🦜</span> Kiki the Word Parrot
              </div>
              <div className="flex items-center gap-2 bg-white/75 border-2 border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-extrabold">
                <span className="text-xl">🤖</span> Robo the Tech Explorer
              </div>
            </div>
          </motion.div>

          {/* Interactive Hero Graphic (SaaS Landing Feature) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative flex justify-center"
          >
            {/* The 21st.dev inspired Child-Friendly Interactive App Widget Preview */}
            <div className="bg-white rounded-[40px] p-6 shadow-2xl border-4 border-slate-800 max-w-sm w-full relative z-10 select-none overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐵</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-none">Chiku's Arena</h4>
                    <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider">Level 1: Speed Arithmetic</span>
                  </div>
                </div>
                <span className="bg-yellow-100 border border-yellow-200 text-yellow-700 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  ⭐ 150 Stars
                </span>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-4 text-center border-2 border-indigo-100/60 relative overflow-hidden space-y-3">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Interactive Math Portal</p>
                <div className="text-3xl font-black text-slate-800 tracking-tight">5 + 4 = ?</div>
                
                <div className="grid grid-cols-3 gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playClickSound()}
                    className="bg-white hover:bg-slate-100 border-2 border-slate-200 font-black text-sm py-2 rounded-xl cursor-pointer"
                  >
                    7
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      playPopSound();
                      alert("Bingo! Standard 1 Genius! 🏅🎉");
                    }}
                    className="bg-emerald-400 text-white hover:bg-emerald-500 border-2 border-emerald-500 font-black text-sm py-2 rounded-xl cursor-pointer shadow-sm"
                  >
                    9
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playClickSound()}
                    className="bg-white hover:bg-slate-100 border-2 border-slate-200 font-black text-sm py-2 rounded-xl cursor-pointer"
                  >
                    8
                  </motion.button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-orange-50 border border-orange-100 p-3 rounded-2xl">
                <span className="text-[10px] font-black text-orange-600 flex items-center gap-1">
                  🏅 Badge Unlocked!
                </span>
                <span className="text-xs font-black text-orange-700">🔢 Addition Knight</span>
              </div>
              
              {/* Outer decorative items */}
              <div className="absolute top-[-10px] right-[-10px] bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white animate-bounce">
                👑
              </div>
            </div>

            {/* Aesthetic Glow behind preview */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-indigo-500 rounded-full blur-[80px] opacity-20 -z-10 scale-90" />
          </motion.div>
        </div>
      </header>

      {/* 21st.dev Component: "Interactive Magical Quest Map" (Animate with Framer Motion) */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3 mb-12"
        >
          <span className="text-3xl">🗺️</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            The Interactive Quest Map
          </h2>
          <p className="text-sm font-extrabold text-slate-400 max-w-lg mx-auto">
            Standard 1 students unlock and journey through colorful skill islands. Hover over any zone to explore its features!
          </p>
        </motion.div>

        {/* Quest Islands Grid (Interactive, Attractive to Kids, Fully Animated) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {kidSkillsData.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 80 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: index % 2 === 0 ? 1 : -1,
                y: -10 
              }}
              onClick={() => {
                playPopSound();
              }}
              className={`bg-white rounded-[32px] p-6 shadow-lg border-4 border-slate-800 flex flex-col justify-between text-left cursor-pointer select-none relative overflow-hidden transition-all duration-300`}
            >
              <div className="space-y-4">
                <span className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${skill.color} text-white text-3xl flex items-center justify-center shadow-md`}>
                  {skill.icon}
                </span>

                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-black text-slate-800">{skill.name}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{skill.badge}</span>
                </div>

                <p className="text-xs font-semibold text-slate-500 leading-relaxed">{skill.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                  🎮 {skill.activityName}
                </span>
                <span className="text-slate-300 hover:text-indigo-600">➔</span>
              </div>

              {/* Decorative stars */}
              <div className="absolute top-2 right-2 text-slate-200 text-xs font-black group-hover:text-yellow-400 transition-colors">
                ⭐
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Details section with Framer Motion scroll animation */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-white rounded-[48px] border-4 border-slate-800 shadow-xl relative z-10 my-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature details listing */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-black uppercase text-pink-600 bg-pink-100 border-2 border-pink-200 px-3.5 py-1.5 rounded-full tracking-wider">
              🎮 Child-Safe Gamification
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
              Complete Chapters, <br />
              Earn Magical Collectibles!
            </h2>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              Our e-book dashboard isn't a spreadsheet — it's an adventurer's vault! Students track their learning statistics, complete interactive chapter review quizzes, and unlock shining badges for Math, Language, Art, and Social Empathy.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">100% Curriculum Compliant</h4>
                  <p className="text-xs font-semibold text-slate-400">Perfectly covers Standard 1 primary academic requirements.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Intelligent AI Buddies</h4>
                  <p className="text-xs font-semibold text-slate-400">Child-safe educational chatbots that help read, tell stories, and explain concepts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">Real-Time Parents Dashboard</h4>
                  <p className="text-xs font-semibold text-slate-400">See what your child has unlocked and where they are excelling.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Collectible Badges Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-orange-50 rounded-[36px] p-8 border-2 border-orange-200 shadow-inner flex flex-col justify-center space-y-6"
          >
            <h3 className="text-lg font-black text-center text-orange-700 uppercase tracking-widest leading-none">🎖️ Magical Badges to Earn</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-150 shadow-sm flex flex-col items-center justify-center space-y-1.5">
                <span className="text-4xl animate-pulse">🏅</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Numbers Hero</h4>
                <p className="text-[10px] font-bold text-slate-400">Complete Math Chapters</p>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-150 shadow-sm flex flex-col items-center justify-center space-y-1.5">
                <span className="text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>🌿</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Eco Knight</h4>
                <p className="text-[10px] font-bold text-slate-400">Explore Nature Chapters</p>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-150 shadow-sm flex flex-col items-center justify-center space-y-1.5">
                <span className="text-4xl animate-pulse" style={{ animationDelay: "1s" }}>🎙️</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Phonics Spell</h4>
                <p className="text-[10px] font-bold text-slate-400">Read Phonics Chapters</p>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center border-2 border-slate-150 shadow-sm flex flex-col items-center justify-center space-y-1.5">
                <span className="text-4xl animate-pulse" style={{ animationDelay: "1.5s" }}>💖</span>
                <h4 className="text-xs font-black text-slate-800 leading-none">Heart Guardian</h4>
                <p className="text-[10px] font-bold text-slate-400">Complete Life Skills</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing / Access Area (Friendly child-style bento grid) */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-indigo-900 rounded-[48px] border-4 border-indigo-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />

          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <span className="bg-yellow-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-md">
              ⚡ Limited Free Launch Offer
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Unlock Your Child's Academic Potential!
            </h2>
            <p className="text-sm font-bold text-indigo-100 max-w-md mx-auto">
              Get full access to all standard 1 interactive chapters, gamified play zones, AI learning companions, and persistent security.
            </p>

            <div className="bg-indigo-950/60 rounded-3xl p-6 border border-indigo-800/80 max-w-sm mx-auto flex flex-col items-center justify-center space-y-3 shadow-inner">
              <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">MAGICAL ADVENTURER PLAN</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black line-through text-indigo-400">$29</span>
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-xs text-indigo-200 font-extrabold">/ forever</span>
              </div>
              <p className="text-[11px] font-bold text-indigo-200 text-center">Free forever for early-bird standard 1 student classrooms!</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTA}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-base px-8 py-4.5 rounded-[20px] shadow-lg border-b-6 border-yellow-700 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Adventure Portal! 🗝️</span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer Area with requested Admin links */}
      <footer className="max-w-7xl mx-auto px-6 pt-16 pb-4 border-t-2 border-slate-200/50 relative z-10 text-center space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>🏰</span> SAMAM Standard 1 Interactive E-Book
            </h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1">Play-led primary educational ecosystem. Secured via Firebase Cloud database.</p>
          </div>

          {/* Required: Admin and signup link in footer ONLY, not on header! */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button 
              onClick={() => {
                playClickSound();
                onStartQuest();
              }}
              className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 underline bg-indigo-50/50 hover:bg-indigo-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              🔑 Parent Sign In / Sign Up
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => {
                playClickSound();
                onAdminClick();
              }}
              className="text-[11px] font-black text-slate-500 hover:text-slate-800 underline bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-slate-400" /> Administrative Portal
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] font-extrabold text-slate-400 leading-loose">
          <p>© 2026 SAMAM Kids E-Learning Platform. All Rights Reserved.</p>
          <p className="text-[9px] text-slate-300">Built using React, Vite, Framer Motion, and Google Firebase.</p>
        </div>
      </footer>

    </div>
  );
}
