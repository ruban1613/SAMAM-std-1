import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Sparkles } from "lucide-react";
import { playPopSound, triggerHaptic } from "../utils/audio";

interface CelebrationOverlayProps {
  message: string;
  onComplete: () => void;
}

interface StarParticle {
  id: number;
  char: string;
  angle: number; // in radians
  distance: number; // in px
  color: string;
  size: number; // text size
  delay: number;
}

interface ConfettiParticle {
  id: number;
  color: string;
  left: number; // percentage (0-100)
  size: number; // px
  shape: "rect" | "circle" | "triangle";
  duration: number;
  delay: number;
}

const STAR_CHARS = ["★", "✦", "✨", "⭐", "🌸"];
const CONFETTI_COLORS = [
  "bg-pink-500 shadow-pink-500/50",
  "bg-yellow-400 shadow-yellow-400/50",
  "bg-orange-500 shadow-orange-500/50",
  "bg-emerald-400 shadow-emerald-400/50",
  "bg-sky-400 shadow-sky-400/50",
  "bg-purple-500 shadow-purple-500/50",
  "bg-rose-400 shadow-rose-400/50",
];
const STAR_COLORS = [
  "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]",
  "text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]",
  "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]",
  "text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]",
  "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]",
];

export default function CelebrationOverlay({ message, onComplete }: CelebrationOverlayProps) {
  const [stars, setStars] = useState<StarParticle[]>([]);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Procedural celebration arpeggio
  const playCelebrationSound = () => {
    triggerHaptic([80, 40, 80, 40, 150]);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C major arpeggio scaling up
      notes.forEach((freq, index) => {
        const timeOffset = index * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternate wave types for nice bright bell-like timbre
        osc.type = index % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);

        gain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.35);
      });
    } catch (e) {
      // Audio fallback using available sounds
      playPopSound();
    }
  };

  useEffect(() => {
    // Generate starburst particles shooting out from the center
    const newStars: StarParticle[] = [];
    const starCount = 36;
    for (let i = 0; i < starCount; i++) {
      const angle = (i * (360 / starCount) * Math.PI) / 180 + (Math.random() * 0.2 - 0.1);
      newStars.push({
        id: i,
        char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
        angle,
        distance: 120 + Math.random() * 180, // shoot outward distance
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        size: 16 + Math.random() * 24, // font sizes
        delay: Math.random() * 0.15,
      });
    }
    setStars(newStars);

    // Generate confetti raining down from above
    const newConfetti: ConfettiParticle[] = [];
    const confettiCount = 55;
    const shapes: ("rect" | "circle" | "triangle")[] = ["rect", "circle", "triangle"];
    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        left: Math.random() * 100,
        size: 8 + Math.random() * 12,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        duration: 2.0 + Math.random() * 2.0,
        delay: Math.random() * 1.5, // staggered rain effect
      });
    }
    setConfetti(newConfetti);

    // Play pleasant victory theme
    playCelebrationSound();

    // Auto dismiss after 4.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Semi-transparent dark blur background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
        onClick={onComplete}
      />

      {/* RAINING CONFETTI CONTAINER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => {
          const rotationStart = Math.random() * 360;
          const rotationEnd = rotationStart + 360 + Math.random() * 720;
          const swingDistance = 30 + Math.random() * 50;

          return (
            <motion.div
              key={`confetti-${c.id}`}
              initial={{
                opacity: 0,
                y: -50,
                x: `${c.left}vw`,
                rotate: rotationStart,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: "110vh",
                x: [
                  `${c.left}vw`,
                  `${c.left + (Math.random() > 0.5 ? 1 : -1) * (swingDistance / 15)}vw`,
                  `${c.left + (Math.random() > 0.5 ? -1 : 1) * (swingDistance / 15)}vw`,
                ],
                rotate: rotationEnd,
              }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "linear",
                times: [0, 0.1, 0.8, 1],
              }}
              className={`absolute shadow-md ${c.color} ${
                c.shape === "circle"
                  ? "rounded-full"
                  : c.shape === "triangle"
                  ? "clip-path-triangle"
                  : "rounded-sm"
              }`}
              style={{
                width: c.size,
                height: c.shape === "triangle" ? c.size : c.size * (c.shape === "rect" ? 1.4 : 1),
                clipPath: c.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
              }}
            />
          );
        })}
      </div>

      {/* CENTERPIECE CELEBRATION BOX */}
      <motion.div
        initial={{ scale: 0.3, y: 50, opacity: 0 }}
        animate={{
          scale: [0.3, 1.1, 1],
          y: 0,
          opacity: 1,
        }}
        exit={{ scale: 0.8, y: -20, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 14,
          stiffness: 120,
        }}
        className="bg-white rounded-[40px] p-8 sm:p-10 max-w-md w-11/12 mx-auto text-center border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.35)] pointer-events-auto relative z-10"
      >
        {/* Floating Crown / Trophy Header */}
        <div className="relative inline-flex mb-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-amber-100 border-4 border-amber-400 p-4 rounded-full text-amber-500 shadow-md relative"
          >
            <Trophy className="w-12 h-12 stroke-[2.5]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            <Sparkles className="w-6 h-6 fill-current" />
          </motion.div>
        </div>

        {/* Happy Text */}
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
            YAY! 🎉
          </h2>
          <p className="text-lg font-black text-indigo-600 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-2xl">
            {message}
          </p>
          <p className="text-xs font-extrabold text-slate-500 max-w-xs mx-auto">
            You are doing an incredibly amazing job! Keep exploring and collecting stars! 🌟
          </p>
        </div>

        {/* Dismiss Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg border-b-4 border-orange-700 cursor-pointer hover:brightness-110 active:border-b-0 transition-all uppercase tracking-wide"
        >
          Woohoo! 🚀
        </motion.button>
      </motion.div>

      {/* STARBURST PARTICLE SPRAY (FROM CENTER) */}
      <div className="absolute flex items-center justify-center">
        {stars.map((s) => {
          const dx = Math.cos(s.angle) * s.distance;
          const dy = Math.sin(s.angle) * s.distance;

          return (
            <motion.span
              key={`star-${s.id}`}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: dx,
                y: dy,
                scale: [0, 1.3, 1, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360 + Math.random() * 360],
              }}
              transition={{
                duration: 1.4,
                delay: s.delay,
                ease: "easeOut",
              }}
              className={`absolute select-none font-black ${s.color}`}
              style={{ fontSize: s.size }}
            >
              {s.char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
