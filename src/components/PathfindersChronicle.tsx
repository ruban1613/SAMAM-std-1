import { useState } from "react";
import { Play, RotateCcw, Trophy, Check, ArrowRight, HelpCircle } from "lucide-react";
import { StudentProgress } from "../types";
import { playSynthBeep } from "./SpeedGridGame";
import { speakClientSide, playAnimalSFX, playPageTurnSound, playClickSound } from "../utils/audio";

interface PathfindersChronicleProps {
  progress: StudentProgress;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
}

interface WordClue {
  word: string;
  emoji: string;
  clue: string;
}

const WORD_QUESTS: WordClue[] = [
  { word: "CAT", emoji: "🐱", clue: "A furry little pet that goes 'Meow!'" },
  { word: "SUN", emoji: "☀️", clue: "The big yellow circle that lights up the day sky!" },
  { word: "DOG", emoji: "🐶", clue: "A loyal helper that barks 'Woof Woof!'" },
  { word: "BALL", emoji: "⚽", clue: "A round toy you kick, throw, or bounce!" },
  { word: "BANANA", emoji: "🍌", clue: "Chiku the Monkey's absolute favorite sweet yellow fruit!" },
  { word: "TREE", emoji: "🌳", clue: "It has green leaves and gives us cool shade." },
  { word: "PARROT", emoji: "🦜", clue: "Kiki's family! A colorful bird that can chirp and talk!" },
];

export default function PathfindersChronicle({ progress, onUpdateProgress }: PathfindersChronicleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [spelledWord, setSpelledWord] = useState<string[]>([]);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [isError, setIsError] = useState(false);

  const activeQuest = WORD_QUESTS[currentIndex];

  const scramble = (word: string): string[] => {
    const letters = word.split("");
    // Shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    // Ensure it's not the same as original
    if (letters.join("") === word) {
      return scramble(word);
    }
    return letters;
  };

  const startQuest = (index: number) => {
    const word = WORD_QUESTS[index].word;
    setScrambledLetters(scramble(word));
    setSpelledWord([]);
    setQuestCompleted(false);
    setIsError(false);
  };

  const handleStartGame = () => {
    playPageTurnSound();
    setIsPlaying(true);
    setGameDone(false);
    setCurrentIndex(0);
    startQuest(0);
  };

  const handleLetterClick = (letter: string, indexInScrambled: number) => {
    if (questCompleted) return;

    const nextIndexToMatch = spelledWord.length;
    const correctLetter = activeQuest.word[nextIndexToMatch];

    if (letter === correctLetter) {
      playSynthBeep("success");
      speakClientSide(letter); // Speak the letter
      
      const newSpelled = [...spelledWord, letter];
      setSpelledWord(newSpelled);
      setIsError(false);

      // Remove letter from scrambled pool
      const newScrambled = [...scrambledLetters];
      newScrambled.splice(indexInScrambled, 1);
      setScrambledLetters(newScrambled);

      // Check if word is complete
      if (newSpelled.join("") === activeQuest.word) {
        setQuestCompleted(true);
        
        // Speak the full word, and then trigger its custom animal sound
        setTimeout(() => {
          speakClientSide(`Excellent spelling! That is ${activeQuest.word}!`);
          setTimeout(() => {
            playAnimalSFX(activeQuest.word);
          }, 1500);
        }, 300);

        if (currentIndex === WORD_QUESTS.length - 1) {
          playSynthBeep("complete");
          setGameDone(true);
          setIsPlaying(false);

          // Update student progress & badges
          onUpdateProgress((prev) => {
            const hasBadge = prev.badgesEarned.some((b) => b.id === "lang-pathfinder");
            const badges = [...prev.badgesEarned];
            if (!hasBadge) {
              badges.push({
                id: "lang-pathfinder",
                title: "Word Detective 📖",
                icon: "🕵️‍♂️",
                unlockedAt: new Date().toLocaleDateString(),
                subject: "lang",
              });
            }
            return {
              ...prev,
              pathfinderBestScore: WORD_QUESTS.length,
              badgesEarned: badges,
            };
          });
        }
      }
    } else {
      playSynthBeep("error");
      speakClientSide("Try again!");
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  const handleNextQuest = () => {
    playPageTurnSound();
    if (currentIndex < WORD_QUESTS.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      startQuest(nextIdx);
    }
  };

  const handleResetLetter = () => {
    playPageTurnSound();
    startQuest(currentIndex);
  };

  return (
    <div id="pathfinder-game-box" className="bg-white border-4 border-pink-200 rounded-[32px] p-6 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700 border-2 border-pink-200 uppercase tracking-wider mb-2">
            🦜 Kiki's Word Game
          </span>
          <h3 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2">
            🕵️‍♂️ Pathfinders' Chronicle
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-bold">
            Tap the scrambled letters in correct order to solve Kiki's treasure clues!
          </p>
        </div>
      </div>

      {!isPlaying && !gameDone ? (
        <div className="text-center py-12 px-6 bg-amber-50/20 rounded-[28px] border-4 border-dashed border-orange-200 shadow-xs">
          <div className="text-5xl mb-4 select-none animate-bounce">🦜🗺️🎒</div>
          <h4 className="font-heading text-xl font-black text-slate-800">Become a Word Detective!</h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-2 mb-6 font-bold leading-relaxed">
            Help Kiki decipher the lost letters of Adventure Land to find Chiku's missing backpack!
          </p>

          <button
            onClick={() => {
              playClickSound();
              handleStartGame();
            }}
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-base font-black px-8 py-4 rounded-2xl shadow-lg border-b-4 border-pink-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current animate-pulse" />
            PLAY QUESTS!
          </button>
        </div>
      ) : gameDone ? (
        <div className="text-center py-12 px-6 bg-rose-50 rounded-[28px] border-4 border-rose-200 shadow-lg">
          <div className="text-6xl mb-4 animate-bounce">🏆🗺️✨</div>
          <h4 className="font-heading text-2xl font-black text-rose-800">Amazing Spelling!</h4>
          <p className="text-sm text-rose-700 mt-1 font-bold">
            You cracked all of Kiki's word puzzles and unlocked the treasure chest!
          </p>

          <div className="my-6 bg-white rounded-2xl p-4.5 inline-block shadow-md border-4 border-rose-200">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Completed Quests</span>
            <span className="text-3xl font-black text-rose-600">{WORD_QUESTS.length} / {WORD_QUESTS.length} Words ✨</span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                handleStartGame();
              }}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-md border-b-4 border-pink-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => {
                playClickSound();
                setGameDone(false);
              }}
              className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-2xl border-b-4 border-slate-400 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] p-5 border-4 border-slate-800 shadow-md">
          {/* Progress bar */}
          <div className="flex justify-between items-center text-xs text-slate-500 font-black mb-4 select-none">
            <span>WORD QUEST {currentIndex + 1} OF {WORD_QUESTS.length}</span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 border-2 border-pink-200 rounded-full font-black uppercase tracking-wider">{Math.round(((currentIndex + 1) / WORD_QUESTS.length) * 100)}% Done</span>
          </div>
          
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-6 border-2 border-slate-200 select-none">
            <div
              className="h-full bg-pink-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / WORD_QUESTS.length) * 100}%` }}
            ></div>
          </div>

          {/* Quest clue box */}
          <div className="bg-amber-50/50 border-4 border-orange-200 rounded-[24px] p-5 text-center shadow-xs relative overflow-hidden mb-6">
            <div className="text-6xl mb-2 select-none transform hover:scale-115 transition-transform">{activeQuest.emoji}</div>
            <p className="text-slate-800 font-black text-lg sm:text-xl leading-relaxed flex items-center justify-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-pink-500" />
              Clue: "{activeQuest.clue}"
            </p>
          </div>

          {/* Spelled letters tray */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 select-none">SPELLING TRAY</div>
            <div className={`flex gap-2 min-h-[64px] items-center justify-center p-3.5 bg-slate-50 border-4 border-dashed rounded-2xl w-full max-w-md ${isError ? "border-red-400 bg-red-100" : "border-slate-300"}`}>
              {spelledWord.length === 0 ? (
                <span className="text-xs sm:text-sm text-slate-400 font-black italic">Tap letters below in order...</span>
              ) : (
                spelledWord.map((letter, idx) => (
                  <span
                    key={idx}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-pink-500 text-white text-xl font-black rounded-xl shadow-md transform scale-102 border-b-4 border-pink-700 select-none animate-pulse"
                  >
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Interactive options pool */}
          {!questCompleted ? (
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 select-none">SCRAMBLED LETTERS (TAP TO SELECT)</div>
              <div className="flex flex-wrap gap-3.5 justify-center mb-6">
                {scrambledLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLetterClick(letter, idx)}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border-2 border-slate-200 hover:border-pink-400 text-slate-800 hover:text-pink-600 text-2xl font-black rounded-2xl shadow-sm border-b-4 border-b-slate-300 hover:border-b-pink-500 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all select-none"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <button
                onClick={handleResetLetter}
                className="text-xs text-slate-500 hover:text-rose-500 underline decoration-2 font-black tracking-tight"
              >
                Reset Word 🔄
              </button>
            </div>
          ) : (
            <div className="text-center py-4 select-none">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 border-2 border-emerald-200 mb-3 uppercase tracking-wider">
                <Check className="w-4 h-4 stroke-[3]" /> Well Done!
              </div>
              <h5 className="font-black text-3xl text-emerald-800 tracking-wider mb-4">
                {activeQuest.word} ✨
              </h5>
              
              {currentIndex < WORD_QUESTS.length - 1 ? (
                <button
                  onClick={() => {
                    playClickSound();
                    handleNextQuest();
                  }}
                  className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg border-b-4 border-pink-700 transition-all cursor-pointer"
                >
                  Next Clue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-emerald-700 font-black text-sm">Press continue to finish your mission! 🎉</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
