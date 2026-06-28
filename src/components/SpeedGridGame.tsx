import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Trophy, Timer, Check, AlertTriangle } from "lucide-react";
import { StudentProgress } from "../types";
import { triggerHaptic, playClickSound } from "../utils/audio";

interface SpeedGridGameProps {
  progress: StudentProgress;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
}

export function playSynthBeep(type: "success" | "error" | "complete") {
  try {
    if (type === "success") {
      triggerHaptic(50);
    } else if (type === "error") {
      triggerHaptic([100, 80, 100]);
    } else if (type === "complete") {
      triggerHaptic([100, 50, 100, 50, 200]);
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "success") {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "error") {
      osc.frequency.setValueAtTime(180.00, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "complete") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    // Ignored if browser restricts AudioContext before interaction
  }
}

export default function SpeedGridGame({ progress, onUpdateProgress }: SpeedGridGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gridSize, setGridSize] = useState<9 | 16>(9); // 3x3 (9) or 4x4 (16)
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wrongSelection, setWrongSelection] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle numbers
  const initGame = () => {
    const arr = Array.from({ length: gridSize }, (_, i) => i + 1);
    // Fisher-Yates Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNumbers(arr);
    setNextNumber(1);
    setGameCompleted(false);
    setWrongSelection(null);
    setElapsedTime(0);
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  // Timer tick
  useEffect(() => {
    if (isPlaying && startTime && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(parseFloat(((Date.now() - startTime) / 1000).toFixed(1)));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, startTime, gameCompleted]);

  const handleNumClick = (num: number) => {
    if (!isPlaying || gameCompleted) return;

    if (num === nextNumber) {
      playSynthBeep("success");
      setWrongSelection(null);
      if (num === gridSize) {
        // Completed game!
        playSynthBeep("complete");
        setGameCompleted(true);
        setIsPlaying(false);
        const finalTime = elapsedTime;

        // Save best time
        onUpdateProgress((prev) => {
          const currentBest = prev.speedGridBestTime;
          const updatedBest = currentBest === undefined || finalTime < currentBest ? finalTime : currentBest;
          
          // Check if badge is unlocked
          const hasBadge = prev.badgesEarned.some((b) => b.id === "speedgrid-wizard");
          const badges = [...prev.badgesEarned];
          if (!hasBadge) {
            badges.push({
              id: "speedgrid-wizard",
              title: "Speed Grid Wizard 🔢",
              icon: "🏎️",
              unlockedAt: new Date().toLocaleDateString(),
              subject: "math",
            });
          }

          return {
            ...prev,
            speedGridBestTime: updatedBest,
            badgesEarned: badges,
          };
        });
      } else {
        setNextNumber((prev) => prev + 1);
      }
    } else {
      playSynthBeep("error");
      setWrongSelection(num);
      setTimeout(() => setWrongSelection(null), 500);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setNumbers([]);
    setGameCompleted(false);
  };

  return (
    <div id="speed-grid-game-box" className="bg-white border-4 border-blue-200 rounded-[32px] p-6 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 border-2 border-blue-200 uppercase tracking-wider mb-2">
            🐵 Chiku's Math Game
          </span>
          <h3 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2">
            🏎️ Speed Grid Challenge
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-bold">
            Tap the numbers in order: <span className="font-black text-blue-600 underline decoration-2">1 → {gridSize}</span> as fast as you can!
          </p>
        </div>

        {progress.speedGridBestTime !== undefined && (
          <div className="flex items-center gap-2.5 bg-amber-50 border-4 border-amber-200 rounded-2xl px-4 py-2">
            <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            <div>
              <div className="text-[9px] font-black text-amber-700 uppercase tracking-wider">Your Best Time</div>
              <div className="text-lg font-black text-amber-900">{progress.speedGridBestTime}s</div>
            </div>
          </div>
        )}
      </div>

      {!isPlaying && !gameCompleted ? (
        <div className="text-center py-12 px-6 bg-amber-50/20 rounded-[28px] border-4 border-dashed border-orange-200 shadow-xs">
          <div className="text-5xl mb-4 select-none animate-pulse">🏎️💨</div>
          <h4 className="font-heading text-xl font-black text-slate-800">Ready to race against the clock?</h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-2 mb-6 font-bold leading-relaxed">
            Pick a size and see how fast your eyes and fingers can count numbers!
          </p>

          <div className="flex justify-center gap-3 mb-6 select-none">
            <button
              onClick={() => {
                playClickSound();
                setGridSize(9);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black border-2 border-b-4 transition-all ${
                gridSize === 9
                  ? "bg-blue-600 text-white border-blue-400 border-b-blue-800 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 border-b-slate-300 hover:bg-slate-50"
              }`}
            >
              Easy Grid (1–9) 🟩
            </button>
            <button
              onClick={() => {
                playClickSound();
                setGridSize(16);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black border-2 border-b-4 transition-all ${
                gridSize === 16
                  ? "bg-blue-600 text-white border-blue-400 border-b-blue-800 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 border-b-slate-300 hover:bg-slate-50"
              }`}
            >
              Super Grid (1–16) 🔥
            </button>
          </div>

          <button
            onClick={() => {
              playClickSound();
              initGame();
            }}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-black px-8 py-4 rounded-2xl shadow-lg border-b-4 border-emerald-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current animate-bounce" />
            START GAME!
          </button>
        </div>
      ) : gameCompleted ? (
        <div className="text-center py-12 px-6 bg-emerald-50 rounded-[28px] border-4 border-emerald-200 shadow-lg">
          <div className="text-6xl mb-4 animate-pulse">🏆✨</div>
          <h4 className="font-heading text-2xl font-black text-emerald-800">Amazing Job!</h4>
          <p className="text-sm text-emerald-700 mt-1 font-bold">
            You successfully counted all the numbers in order!
          </p>

          <div className="my-6 bg-white rounded-2xl p-4.5 inline-block shadow-md border-4 border-emerald-200">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Your Time</div>
            <div className="text-3xl font-black text-slate-800">{elapsedTime} seconds</div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                initGame();
              }}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-md border-b-4 border-emerald-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => {
                playClickSound();
                handleStop();
              }}
              className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-2xl border-b-4 border-slate-400 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Dashboard row */}
          <div className="flex items-center justify-between mb-5 bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-200">
                <Timer className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="font-mono text-lg font-black text-slate-700">{elapsedTime}s</span>
              </div>
              <div className="text-xs font-black text-slate-500">
                Next Number: <span className="bg-blue-600 text-white text-base px-3 py-0.5 rounded-full font-black animate-bounce inline-block border-2 border-blue-400">{nextNumber}</span>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                handleStop();
              }}
              className="text-xs text-red-500 hover:text-red-700 font-black underline decoration-2 transition-all"
            >
              Cancel Race
            </button>
          </div>

          {/* Numbers Grid */}
          <div
            className={`grid gap-4.5 ${
              gridSize === 9 ? "grid-cols-3" : "grid-cols-4"
            } max-w-md mx-auto aspect-square`}
          >
            {numbers.map((num) => {
              const isTapped = num < nextNumber;
              const isWrong = wrongSelection === num;
              return (
                <button
                  key={num}
                  onClick={() => handleNumClick(num)}
                  disabled={isTapped}
                  className={`relative rounded-2xl font-black transition-all transform active:scale-95 text-3xl flex items-center justify-center border-4 select-none cursor-pointer h-16 md:h-20 ${
                    isTapped
                      ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed border-b-2"
                      : isWrong
                      ? "bg-red-500 text-white border-red-700 shadow-inner animate-shake border-b-2"
                      : num === nextNumber
                      ? "bg-blue-500 text-white border-blue-400 border-b-8 border-b-blue-700 shadow-md scale-102 hover:bg-blue-400"
                      : "bg-white text-slate-800 border-slate-200 border-b-8 border-b-slate-300 shadow-sm hover:border-blue-400"
                  }`}
                >
                  {isTapped ? <Check className="w-10 h-10 text-emerald-500 stroke-[4]" /> : num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
