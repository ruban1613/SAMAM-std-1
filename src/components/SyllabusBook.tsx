import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X, Volume2, CheckCircle2, ChevronRight, HelpCircle, Trophy, Star, Check, Award, Maximize2, Minimize2, Compass, Map } from "lucide-react";
import { getCurriculumForStandard } from "../data/curriculum";
import { Chapter, StudentProgress, SubjectType } from "../types";
import { speakClientSide, stopAllSpeech, playPageTurnSound, playOptionSound, playAnimalSFX, playClickSound, playPopSound, setGlobalSpeechRate, getGlobalSpeechRate } from "../utils/audio";
import { playSynthBeep } from "./SpeedGridGame";
import { generate25PagesForChapter, BookPage } from "../utils/curriculumGenerator";
import { motion, AnimatePresence } from "motion/react";

interface SyllabusBookProps {
  progress: StudentProgress;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
  onOpenVisualDictionary: (wordId?: string) => void;
  currentStudent?: any;
  activeVolume?: number;
  setActiveVolume?: (vol: number) => void;
}

const findDictionaryWordId = (text: string): string | null => {
  const words = [
    "lion", "apple", "monkey", "elephant", "banana", "bear", "dog", "cat", "cow", 
    "sun", "flower", "circle", "square", "triangle", "rectangle", "ball"
  ];
  const lower = text.toLowerCase();
  for (const w of words) {
    if (lower.includes(w)) return w;
  }
  return null;
};

export default function SyllabusBook({
  progress,
  onUpdateProgress,
  onOpenVisualDictionary,
  currentStudent,
  activeVolume: propActiveVolume,
  setActiveVolume: propSetActiveVolume,
}: SyllabusBookProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectType>("math");
  const [localActiveVolume, setLocalActiveVolume] = useState<number>(1);
  const activeVolume = propActiveVolume !== undefined ? propActiveVolume : localActiveVolume;
  const setActiveVolume = propSetActiveVolume !== undefined ? propSetActiveVolume : setLocalActiveVolume;
  const selectedStandard = activeVolume;

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [openFlaps, setOpenFlaps] = useState<Record<string, boolean>>({});

  // Physical ebook layout states
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Interactive page states for 25-page layout
  const [pageAnswers, setPageAnswers] = useState<Record<number, string>>({});

  const [speechRate, setSpeechRate] = useState<number>(() => {
    return getGlobalSpeechRate();
  });

  useEffect(() => {
    const handleRateChange = () => {
      setSpeechRate(getGlobalSpeechRate());
    };
    window.addEventListener("samam_speech_rate_changed", handleRateChange);
    return () => window.removeEventListener("samam_speech_rate_changed", handleRateChange);
  }, []);
  const [pageChecked, setPageChecked] = useState<Record<number, boolean>>({});
  const [pageCorrect, setPageCorrect] = useState<Record<number, boolean>>({});
  const [matchingPairs, setMatchingPairs] = useState<Record<number, Record<string, string>>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [windowHeight, setWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      const isSinglePage = window.innerWidth < 900 || (window.innerWidth < 1100 && window.innerHeight > window.innerWidth);
      setIsMobile(isSinglePage);
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bookScale = useMemo(() => {
    if (typeof window === "undefined") return 1;

    // Budget for non-book headers, progress, margins
    const budget = isMobile ? 310 : 255;
    const availableHeight = windowHeight - budget;
    const targetHeight = isMobile ? 480 : 530;

    let scale = availableHeight / targetHeight;

    // Also factor in screen width to prevent horizontal overflow
    if (!isMobile) {
      const targetWidth = isMaximized ? windowWidth : Math.min(1024, windowWidth - 64);
      const widthScale = targetWidth / 1024;
      scale = Math.min(scale, widthScale);
    } else {
      const targetWidth = windowWidth - 32;
      const widthScale = targetWidth / 450;
      scale = Math.min(scale, widthScale);
    }

    return Math.max(0.45, Math.min(1.15, scale));
  }, [windowHeight, windowWidth, isMobile, isMaximized]);

  const [textScale, setTextScale] = useState<"large" | "larger" | "huge">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("samam_text_scale");
      if (saved === "large" || saved === "larger" || saved === "huge") {
        return saved;
      }
    }
    return "large";
  });

  const handleTextScaleChange = (scale: "large" | "larger" | "huge") => {
    setTextScale(scale);
    localStorage.setItem("samam_text_scale", scale);
  };

  const getTextClass = (element: "title" | "subtitle" | "badge" | "content" | "question" | "choice" | "vocabulary" | "feedback") => {
    switch (element) {
      case "title":
        if (textScale === "huge") return "text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 leading-tight";
        if (textScale === "larger") return "text-xl sm:text-2xl md:text-3xl font-black text-amber-950 leading-tight";
        return "text-lg sm:text-xl md:text-2xl font-black text-amber-950 leading-tight";
      
      case "subtitle":
        if (textScale === "huge") return "text-sm sm:text-base md:text-lg font-black text-amber-700/80 mt-1";
        if (textScale === "larger") return "text-xs sm:text-sm md:text-base font-black text-amber-700/80 mt-1";
        return "text-[11px] sm:text-xs md:text-sm font-black text-amber-700/80 mt-1";

      case "badge":
        if (textScale === "huge") return "text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-widest px-4 py-2 rounded-full border";
        if (textScale === "larger") return "text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border";
        return "text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border";

      case "content":
        if (textScale === "huge") return "text-base sm:text-lg md:text-xl font-bold leading-relaxed whitespace-pre-line text-slate-900";
        if (textScale === "larger") return "text-sm sm:text-base md:text-lg font-bold leading-relaxed whitespace-pre-line text-slate-900";
        return "text-xs sm:text-sm md:text-base font-bold leading-relaxed whitespace-pre-line text-slate-900";

      case "question":
        if (textScale === "huge") return "text-lg sm:text-xl md:text-2xl font-black leading-snug";
        if (textScale === "larger") return "text-base sm:text-lg md:text-xl font-black leading-snug";
        return "text-sm sm:text-base md:text-lg font-black leading-snug";

      case "choice":
        if (textScale === "huge") return "p-4 text-sm sm:text-base md:text-lg font-black text-center";
        if (textScale === "larger") return "p-3.5 text-xs sm:text-sm md:text-base font-black text-center";
        return "p-3 text-[11px] sm:text-xs md:text-sm font-black text-center";

      case "vocabulary":
        if (textScale === "huge") return "p-4 text-sm sm:text-base md:text-lg font-black";
        if (textScale === "larger") return "p-3.5 text-xs sm:text-sm md:text-base font-black";
        return "p-3 text-[11px] sm:text-xs md:text-sm font-black";

      case "feedback":
        if (textScale === "huge") return "p-4 text-xs sm:text-sm md:text-base font-bold leading-normal";
        if (textScale === "larger") return "p-3.5 text-[11px] sm:text-xs md:text-sm font-bold leading-normal";
        return "p-3 text-[10px] sm:text-[11px] md:text-xs font-bold leading-normal";
    }
  };

  const standardCurriculum = useMemo(() => {
    return getCurriculumForStandard(selectedStandard);
  }, [selectedStandard]);

  const subjectConfig = standardCurriculum.find((s) => s.id === activeSubject)!;

  // Generate 25 pages dynamically
  const bookPages = useMemo(() => {
    return selectedChapter ? generate25PagesForChapter(activeSubject, selectedChapter) : [];
  }, [activeSubject, selectedChapter]);

  const completePage = (pageIdx: number) => {
    if (!selectedChapter) return;
    onUpdateProgress((prev) => {
      const completedPagesMap = prev.completedChapterPages ? { ...prev.completedChapterPages } : {};
      const currentList = completedPagesMap[selectedChapter.id] || [];
      if (currentList.includes(pageIdx)) {
        return prev;
      }
      const newList = [...currentList, pageIdx].sort((a, b) => a - b);
      completedPagesMap[selectedChapter.id] = newList;
      return {
        ...prev,
        completedChapterPages: completedPagesMap,
      };
    });
  };

  // Auto-complete non-interactive pages upon viewing them
  useEffect(() => {
    if (!selectedChapter || bookPages.length === 0) return;

    const completedList = progress.completedChapterPages?.[selectedChapter.id] || [];

    const visibleIndices = isMobile
      ? [currentPageIndex]
      : [currentPageIndex, currentPageIndex + 1].filter((idx) => idx < bookPages.length);

    visibleIndices.forEach((idx) => {
      const page = bookPages[idx];
      if (!page) return;

      const nonInteractiveTypes = ["story", "explanation", "vocabulary", "review", "celebration"];
      if (nonInteractiveTypes.includes(page.type)) {
        if (!completedList.includes(idx)) {
          completePage(idx);
        }
      }
    });
  }, [currentPageIndex, selectedChapter, isMobile, bookPages, progress.completedChapterPages]);

  const handleOpenChapter = (chapter: Chapter) => {
    stopAllSpeech();
    playPageTurnSound();
    setSelectedChapter(chapter);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
    setCurrentlySpeakingText(null);
    setOpenFlaps({});
    setCurrentPageIndex(0);
    setDirection(0);
    setCompletedSteps({});
    setPageAnswers({});
    setPageChecked({});
    setPageCorrect({});
    setMatchingPairs({});
    setSelectedLeftId(null);
  };

  const handleCloseChapter = () => {
    stopAllSpeech();
    playPageTurnSound();
    setSelectedChapter(null);
    setCurrentlySpeakingText(null);
    setIsMaximized(false);
    setIsSidebarOpen(false);
  };

  const handleNarrateText = (text: string) => {
    playClickSound();
    if (currentlySpeakingText === text) {
      stopAllSpeech();
      setCurrentlySpeakingText(null);
    } else {
      setCurrentlySpeakingText(text);
      speakClientSide(
        text,
        () => setCurrentlySpeakingText(text),
        () => setCurrentlySpeakingText(null)
      );
    }
  };

  const handleAnswerSubmit = (option: string) => {
    if (!selectedChapter || !selectedChapter.quiz || selectedAnswer) return;

    const quiz = selectedChapter.quiz[0];
    setSelectedAnswer(option);
    
    // Pronounce the option and trigger animal FX immediately
    playOptionSound(option);

    const isCorrect = option === quiz.correctAnswer;
    
    // Wait a brief moment to let the animal's roar or voice play fully before evaluating correct/incorrect chimes
    setTimeout(() => {
      if (isCorrect) {
        playSynthBeep("success");
        setIsAnswerCorrect(true);
        setShowExplanation(true);

        // Save progress
        onUpdateProgress((prev) => {
          const completedIds = [...prev.completedChapterIds];
          if (!completedIds.includes(selectedChapter.id)) {
            completedIds.push(selectedChapter.id);
          }

          // Calculate new completion percentage for this subject
          const totalChapters = subjectConfig.chapters.length;
          const completedCount = subjectConfig.chapters.filter((ch) =>
            completedIds.includes(ch.id)
          ).length;
          const newPct = Math.round((completedCount / totalChapters) * 100);

          const newSubjectsCompleted = {
            ...prev.subjectsCompleted,
            [activeSubject]: newPct,
          };

          // Check if subject completed badge is unlocked
          const badgeId = `${activeSubject}-mastery`;
          const hasBadge = prev.badgesEarned.some((b) => b.id === badgeId);
          const badges = [...prev.badgesEarned];

          if (newPct === 100 && !hasBadge) {
            const badgeTitles: Record<SubjectType, string> = {
              math: "Math Wizard 🔢",
              lang: "Word Master 📖",
              evs: "Nature Scientist 🌿",
              art: "Creative Artist 🎨",
              life: "Habit Hero 💡",
            };
            badges.push({
              id: badgeId,
              title: badgeTitles[activeSubject],
              icon: "🎓",
              unlockedAt: new Date().toLocaleDateString(),
              subject: activeSubject,
            });
          }

          return {
            ...prev,
            completedChapterIds: completedIds,
            subjectsCompleted: newSubjectsCompleted,
            badgesEarned: badges,
          };
        });
      } else {
        playSynthBeep("error");
        setIsAnswerCorrect(false);
        setShowExplanation(true);
      }
    }, 1200);
  };

  const handleNextPage = () => {
    stopAllSpeech();
    playPageTurnSound();
    if (isMobile) {
      if (currentPageIndex < 24) {
        setDirection(1);
        setCurrentPageIndex((prev) => prev + 1);
      }
    } else {
      if (currentPageIndex < 24) {
        setDirection(1);
        setCurrentPageIndex((prev) => Math.min(24, prev + 2));
      }
    }
  };

  const handlePrevPage = () => {
    stopAllSpeech();
    playPageTurnSound();
    if (isMobile) {
      if (currentPageIndex > 0) {
        setDirection(-1);
        setCurrentPageIndex((prev) => prev - 1);
      }
    } else {
      if (currentPageIndex >= 2) {
        setDirection(-1);
        setCurrentPageIndex((prev) => Math.max(0, prev - 2));
      }
    }
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : dir < 0 ? "-100%" : "0%",
      rotateY: dir > 0 ? 55 : dir < 0 ? -55 : 0,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: "0%",
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 95, damping: 16 },
        rotateY: { type: "spring", stiffness: 95, damping: 16 },
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 95, damping: 16 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : dir < 0 ? "100%" : "0%",
      rotateY: dir > 0 ? -55 : dir < 0 ? 55 : 0,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 95, damping: 16 },
        rotateY: { type: "spring", stiffness: 95, damping: 16 },
        opacity: { duration: 0.15 },
        scale: { type: "spring", stiffness: 95, damping: 16 },
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
      },
    },
  };

  const renderPage = (index: number) => {
    if (!selectedChapter || index < 0 || index >= bookPages.length) {
      return (
        <div className="p-6 md:p-8 flex flex-col justify-center items-center h-full bg-[#FAF6E8] select-none text-slate-400 font-bold italic text-xs">
          📓 Back Cover
        </div>
      );
    }
    
    const page = bookPages[index];
    const isPageAnswered = !!pageAnswers[index];
    const isPageChecked = !!pageChecked[index];
    const isPageCorrect = !!pageCorrect[index];
    
    switch (page.type) {
      case "story":
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <motion.div 
              className="absolute inset-0 bg-[#FAF6E8] opacity-60 pointer-events-none"
              animate={{ scale: [1, 1.02, 1], rotate: [0, 0.3, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getTextClass("badge")} text-amber-800 bg-amber-200/50 border border-amber-300`}>
                    📖 Lesson Story
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-4">
                  <h5 className={`font-heading ${getTextClass("title")} flex items-center gap-2`}>
                    {page.title}
                  </h5>
                  <p className={`${getTextClass("subtitle")}`}>{page.subtitle || "Tap the speaker to listen aloud! 🔊"}</p>
                </div>

                <div className="space-y-4">
                  {page.imageUrl && (
                    <div className="h-20 sm:h-28 md:h-32 w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-xs shrink-0 relative">
                      <img 
                        src={page.imageUrl} 
                        alt={page.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleNarrateText(page.audioText)}
                    className={`p-6 rounded-2xl border-4 transition-all cursor-pointer leading-relaxed font-bold shadow-xs ${
                      currentlySpeakingText === page.audioText
                        ? "border-amber-400 bg-amber-100/70 text-slate-900 ring-4 ring-amber-300 shadow-md"
                        : "border-amber-200/60 bg-white hover:bg-amber-50/40 text-slate-800"
                    }`}
                  >
                    <p className="flex items-start gap-4">
                      <span className="mt-0.5 bg-orange-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-xs shrink-0">
                        <Volume2 className="w-5 h-5 fill-current" />
                      </span>
                      <span className={`${getTextClass("content")} font-bold leading-relaxed`}>
                        {page.content}
                      </span>
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 border-t-2 border-amber-200/40 pt-4 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-4xl animate-bounce">✨</span>
                  <p className="text-xs sm:text-sm font-black text-amber-800/80 uppercase tracking-wide leading-tight">
                    Awesome! Press Next Page to explore active practice!
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shrink-0 animate-fade-in shadow-xs">
                  <span>✓ Read & Completed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "explanation":
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getTextClass("badge")} text-amber-800 bg-amber-200/50 border border-amber-300`}>
                    💡 Concept Board
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-4">
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.title}
                  </h5>
                  <p className={`${getTextClass("subtitle")}`}>Let's learn together!</p>
                </div>

                <div className="space-y-4">
                  {page.imageUrl && (
                    <div className="h-20 sm:h-28 md:h-32 w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-xs shrink-0 relative">
                      <img 
                        src={page.imageUrl} 
                        alt={page.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <motion.div
                    onClick={() => handleNarrateText(page.audioText)}
                    className={`p-6 rounded-2xl border-4 bg-white cursor-pointer hover:bg-amber-50/25 ${
                      currentlySpeakingText === page.audioText ? "border-amber-400 bg-amber-50/50 ring-4 ring-amber-300" : "border-amber-200/80"
                    }`}
                  >
                    <p className={`${getTextClass("content")} font-black leading-relaxed`}>
                      {page.content}
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 border-t-2 border-amber-200/40 pt-4 flex items-center justify-between gap-2.5">
                <span className="text-xs font-black text-amber-800/60 uppercase tracking-widest">
                  standard 1 interactive academy
                </span>
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shrink-0 shadow-xs">
                  <span>✓ Learned & Completed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "vocabulary":
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getTextClass("badge")} text-amber-800 bg-amber-200/50 border border-amber-300`}>
                    ⭐ Word Power
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-3">
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.title}
                  </h5>
                  <p className={`${getTextClass("subtitle")}`}>{page.subtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 max-h-[280px] overflow-y-auto pr-1">
                  {page.content.split("\n").filter(Boolean).map((line, i) => {
                    const cleanText = line.replace(/⭐ \d+\. /, "").replace("⭐ ", "");
                    const wordId = findDictionaryWordId(cleanText);
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (wordId) {
                            playPopSound();
                            onOpenVisualDictionary(wordId);
                          } else {
                            playPopSound();
                            handleNarrateText(cleanText);
                          }
                        }}
                        className={`bg-white border-4 rounded-xl text-left font-black text-amber-900 shadow-xs flex flex-col justify-between gap-2.5 cursor-pointer whitespace-normal break-words transition-all ${getTextClass("vocabulary")} ${
                          wordId 
                            ? "border-amber-450 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50/50" 
                            : "border-amber-200 hover:border-amber-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Star className={`w-5 h-5 shrink-0 ${wordId ? "fill-amber-500 stroke-amber-600" : "fill-amber-400 stroke-none"}`} />
                          <span className="font-black text-amber-950 leading-tight">{cleanText}</span>
                        </div>
                        {wordId && (
                          <span className="text-[9px] bg-amber-200 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-lg font-mono font-black uppercase self-end flex items-center gap-1">
                            📔 Spell & Sound ➔
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t-2 border-amber-200/40 pt-4 flex items-center justify-between gap-2.5">
                <span className="text-xs font-black text-amber-800/60 uppercase tracking-widest">
                  Tap card to learn letters & spelling!
                </span>
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shrink-0 shadow-xs">
                  <span>✓ Words Explored</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "exercise":
      case "qa":
        const isCorrect = isPageCorrect;
        const activeChoice = pageAnswers[index];
        const data = page.interactiveData;
        
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${getTextClass("badge")} text-indigo-800 bg-indigo-100/70 border border-indigo-200`}>
                    {data?.exerciseCode ? `📝 Practice ${data.exerciseCode}` : "✏️ Chapter Trivia"}
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-3">
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.subtitle || "Solve to earn your gold star!"}
                  </h5>
                  <p className={`${getTextClass("subtitle")} text-slate-600`}>{page.content}</p>
                </div>

                {/* Question Box */}
                {data?.question && (
                  <div className={`bg-slate-900 border-4 border-slate-800 rounded-2xl p-5 text-white font-black mb-4 shadow-md flex justify-between items-center gap-4 ${getTextClass("question")}`}>
                    <span>{data.question}</span>
                    <button
                      onClick={() => handleNarrateText(data.question!)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-yellow-400 transition-all shrink-0 bg-slate-800/50"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* Choices */}
                {data?.options && (
                  <div className="grid grid-cols-2 gap-3">
                    {data.options.map((option) => {
                      const isChosen = activeChoice === option;
                      return (
                        <button
                          key={option}
                          disabled={isPageChecked}
                          onClick={() => {
                            playPopSound();
                            setPageAnswers(prev => ({ ...prev, [index]: option }));
                          }}
                          className={`border-4 rounded-xl font-black text-center transition-all cursor-pointer ${getTextClass("choice")} ${
                            isChosen
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-md scale-[1.02]"
                              : "bg-white border-amber-200 hover:border-amber-300 text-slate-800"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Verification results feedback */}
                {isPageChecked && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl border-2 font-bold mt-4 leading-normal ${getTextClass("feedback")} ${
                      isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
                    }`}
                  >
                    <div className="flex gap-2">
                      <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
                      <div>
                        <h6 className="font-black">{isCorrect ? "Super Job!" : "Let's try that again!"}</h6>
                        <p className="opacity-90 mt-0.5">
                          {isCorrect ? data?.explanation : "Oops! Pick another option and verify again!"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Verify button */}
              <div className="mt-4 border-t border-amber-200/30 pt-3 flex justify-between items-center">
                <span className="text-[8px] font-mono font-black text-slate-400">STATUS: {isPageCorrect ? "PASSED ⭐" : "ACTIVE QUEST"}</span>
                {!isPageChecked ? (
                  <button
                    disabled={!activeChoice}
                    onClick={() => {
                      if (!data) return;
                      const correct = activeChoice === data.correctAnswer;
                      setPageChecked(prev => ({ ...prev, [index]: true }));
                      setPageCorrect(prev => ({ ...prev, [index]: correct }));
                      
                      if (correct) {
                        playSynthBeep("success");
                        completePage(index);
                      } else {
                        playSynthBeep("error");
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xxs font-black border-b-4 uppercase transition-all cursor-pointer active:scale-95 ${
                      activeChoice
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    Verify Answer ✨
                  </button>
                ) : (
                  !isCorrect && (
                    <button
                      onClick={() => {
                        setPageChecked(prev => ({ ...prev, [index]: false }));
                        setPageAnswers(prev => {
                          const updated = { ...prev };
                          delete updated[index];
                          return updated;
                        });
                        playClickSound();
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xxs rounded-xl border-b-4 border-slate-400 uppercase cursor-pointer"
                    >
                      Retry Exercise 🔄
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "fill_blank":
        const activeFill = pageAnswers[index];
        const blankData = page.interactiveData;
        const isFillCorrect = isPageCorrect;
        
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${getTextClass("badge")} text-pink-800 bg-pink-100/70 border border-pink-200`}>
                    ✍️ Fill in the Blanks
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-3">
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.subtitle}
                  </h5>
                  <p className={`${getTextClass("subtitle")} text-slate-600`}>{page.content}</p>
                </div>

                {/* Sentence Display */}
                {blankData?.blankSentence && (
                  <div className={`bg-white border-4 border-amber-200 rounded-2xl p-6 text-center font-black text-slate-800 leading-relaxed shadow-sm mb-4 ${getTextClass("question")}`}>
                    {blankData.blankSentence.replace("___", activeFill ? `[ ${activeFill} ]` : "________")}
                  </div>
                )}

                {/* Word choices */}
                {blankData?.choices && !isPageChecked && (
                  <div className="flex justify-center gap-3 flex-wrap mt-2">
                    {blankData.choices.map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          playPopSound();
                          setPageAnswers(prev => ({ ...prev, [index]: choice }));
                        }}
                        className={`border-4 rounded-xl font-black transition-all cursor-pointer ${getTextClass("choice")} ${
                          activeFill === choice
                            ? "bg-pink-600 border-pink-400 text-white shadow-md scale-102"
                            : "bg-white border-amber-200 hover:border-pink-300 text-slate-700"
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                )}

                {isPageChecked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl border-2 font-bold mt-4 leading-normal ${getTextClass("feedback")} ${
                      isFillCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl">{isFillCorrect ? "🎉" : "💡"}</span>
                      <div>
                        <h6 className="text-sm font-black">{isFillCorrect ? "Wonderful!" : "Let's recalculate!"}</h6>
                        <p className="opacity-90 mt-1">
                          {isFillCorrect ? blankData?.explanation : "That's not the magic word we need here. Reset and try again!"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Verify button */}
              <div className="mt-4 border-t border-amber-200/30 pt-3 flex justify-between items-center">
                <span className="text-xs font-mono font-black text-slate-400">STATUS: {isPageCorrect ? "PASSED ⭐" : "ACTIVE QUEST"}</span>
                {!isPageChecked ? (
                  <button
                    disabled={!activeFill}
                    onClick={() => {
                      if (!blankData) return;
                      const correct = activeFill === blankData.blankAnswer;
                      setPageChecked(prev => ({ ...prev, [index]: true }));
                      setPageCorrect(prev => ({ ...prev, [index]: correct }));
                      
                      if (correct) {
                        playSynthBeep("success");
                        completePage(index);
                      } else {
                        playSynthBeep("error");
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black border-b-4 uppercase transition-all cursor-pointer active:scale-95 ${
                      activeFill
                        ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-800"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    Verify Word 📝
                  </button>
                ) : (
                  !isFillCorrect && (
                    <button
                      onClick={() => {
                        setPageChecked(prev => ({ ...prev, [index]: false }));
                        setPageAnswers(prev => {
                          const updated = { ...prev };
                          delete updated[index];
                          return updated;
                        });
                        playClickSound();
                      }}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs rounded-xl border-b-4 border-slate-400 uppercase cursor-pointer"
                    >
                      Reset 🔄
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "match_following":
        const matchData = page.interactiveData;
        const activePairs = matchingPairs[index] || {};
        const isMatchCorrect = isPageCorrect;
        
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${getTextClass("badge")} text-teal-800 bg-teal-100/70 border border-teal-200`}>
                    🔗 Match the Following
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-2">
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.subtitle}
                  </h5>
                  <p className={`${getTextClass("subtitle")} text-slate-600`}>{page.content}</p>
                </div>

                {/* Match Board Columns */}
                {matchData?.leftItems && matchData?.rightItems && (
                  <div className="grid grid-cols-2 gap-4 mt-2 max-h-[220px] overflow-y-auto pr-1">
                    {/* Left List */}
                    <div className="space-y-2">
                      {matchData.leftItems.map((item) => {
                        const isMatched = !!activePairs[item.id];
                        const isSelected = selectedLeftId === item.id;
                        return (
                          <button
                            key={item.id}
                            disabled={isMatched || isPageChecked}
                            onClick={() => {
                              playClickSound();
                              setSelectedLeftId(item.id);
                            }}
                            className={`w-full rounded-xl border-4 text-left font-black transition-all cursor-pointer ${getTextClass("choice")} ${
                              isMatched
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-70"
                                : isSelected
                                ? "bg-yellow-400 border-yellow-300 text-slate-950"
                                : "bg-white border-amber-200 hover:border-amber-300 text-slate-700"
                            }`}
                          >
                            {item.text} {isMatched && "✓"}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right List */}
                    <div className="space-y-2">
                      {matchData.rightItems.map((item) => {
                        const matchedLeftKey = Object.keys(activePairs).find(k => activePairs[k] === item.id);
                        const isMatched = !!matchedLeftKey;
                        return (
                          <button
                            key={item.id}
                            disabled={isMatched || !selectedLeftId || isPageChecked}
                            onClick={() => {
                              if (!selectedLeftId) return;
                              playPopSound();
                              const updated = { ...activePairs, [selectedLeftId]: item.id };
                              setMatchingPairs(prev => ({ ...prev, [index]: updated }));
                              setSelectedLeftId(null);
                            }}
                            className={`w-full rounded-xl border-4 text-left font-black transition-all cursor-pointer ${getTextClass("choice")} ${
                              isMatched
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-70"
                                : selectedLeftId
                                ? "bg-teal-900 border-teal-700 hover:bg-teal-850 text-white"
                                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            {item.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isPageChecked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl border-2 font-bold mt-4 leading-normal ${getTextClass("feedback")} ${
                      isMatchCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl">{isMatchCorrect ? "🎉" : "💡"}</span>
                      <div>
                        <h6 className="text-sm font-black">{isMatchCorrect ? "Splendid Matching!" : "Check your lines!"}</h6>
                        <p className="opacity-90 mt-1">
                          {isMatchCorrect ? matchData?.explanation : "Not all items match. Hit Reset and trace the partners again!"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Verify matched pairs */}
              <div className="mt-4 border-t border-amber-200/30 pt-3 flex justify-between items-center">
                <span className="text-xs font-mono font-black text-slate-400">STATUS: {isPageCorrect ? "PASSED ⭐" : "ACTIVE QUEST"}</span>
                {!isPageChecked ? (
                  <button
                    disabled={Object.keys(activePairs).length < 3}
                    onClick={() => {
                      if (!matchData) return;
                      const correct = matchData.correctPairs;
                      let isCorrect = true;
                      for (const key of Object.keys(correct!)) {
                        if (activePairs[key] !== correct![key]) isCorrect = false;
                      }
                      
                      setPageChecked(prev => ({ ...prev, [index]: true }));
                      setPageCorrect(prev => ({ ...prev, [index]: isCorrect }));
                      
                      if (isCorrect) {
                        playSynthBeep("success");
                        completePage(index);
                      } else {
                        playSynthBeep("error");
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black border-b-4 uppercase transition-all cursor-pointer active:scale-95 ${
                      Object.keys(activePairs).length === 3
                        ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-800"
                        : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    }`}
                  >
                    Verify Pairs 🔗
                  </button>
                ) : (
                  !isMatchCorrect && (
                    <button
                      onClick={() => {
                        setPageChecked(prev => ({ ...prev, [index]: false }));
                        setMatchingPairs(prev => {
                          const updated = { ...prev };
                          delete updated[index];
                          return updated;
                        });
                        setSelectedLeftId(null);
                        playClickSound();
                      }}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs rounded-xl border-b-4 border-slate-400 uppercase cursor-pointer"
                    >
                      Reset 🔄
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "review":
        // Count how many exercises have been solved correctly on this book run
        const totalChecked = Object.keys(pageCorrect).filter(k => pageCorrect[Number(k)]).length;
        
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getTextClass("badge")} text-amber-800 bg-amber-200/50 border border-amber-300`}>
                    📈 Chapter Progress
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="mb-4 text-center">
                  <Award className="w-16 h-16 text-yellow-500 mx-auto animate-bounce mb-2" />
                  <h5 className={`font-heading ${getTextClass("title")}`}>
                    {page.title}
                  </h5>
                  <p className={`${getTextClass("subtitle")} uppercase tracking-wide`}>
                    Excellent milestone achieved! Let's review:
                  </p>
                </div>

                <div className={`bg-white border-4 border-amber-200 rounded-2xl space-y-3.5 shadow-xs font-black text-slate-800 ${getTextClass("content")}`}>
                  <div className="flex items-center justify-between">
                    <span>✔️ 10 Practice Exercises Solved:</span>
                    <span className="text-amber-900 font-mono">10 / 10 Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✔️ 10-Question Solving Quest:</span>
                    <span className="text-amber-900 font-mono">10 / 10 Complete</span>
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-dashed border-amber-100 pt-3.5 mt-2.5 text-amber-950">
                    <span>⭐ Quest Points Achieved:</span>
                    <span>{totalChecked * 10} PTS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t-2 border-amber-200/40 pt-4 flex items-center justify-between gap-2.5">
                <span className="text-xs font-black text-amber-800/60 uppercase tracking-widest block animate-pulse">
                  Ready to graduate! Turn to Page 25!
                </span>
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shrink-0 shadow-xs">
                  <span>✓ Progress Reviewed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "celebration":
        return (
          <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-[#FAF6E8] relative overflow-hidden select-none">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getTextClass("badge")} text-emerald-800 bg-emerald-100 border border-emerald-200`}>
                    🏆 Lesson Complete
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-700">Page {page.pageNumber}</span>
                </div>

                <div className="text-center py-4 space-y-4">
                  {page.imageUrl && (
                    <div className="h-16 sm:h-24 w-full rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-xs relative">
                      <img 
                        src={page.imageUrl} 
                        alt="Celebration" 
                        className="w-full h-full object-cover opacity-90" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl">🎉🥳🎈</span>
                      </div>
                    </div>
                  )}

                  <div className="relative inline-block">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto filter drop-shadow animate-pulse" />
                    <span className="absolute -top-1 -right-1 text-3xl animate-ping">✨</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className={`font-heading ${getTextClass("title")} leading-none text-emerald-950`}>
                      {page.title}
                    </h5>
                    <p className={`${getTextClass("subtitle")} text-amber-900 tracking-wider uppercase bg-amber-200/50 px-4 py-1 rounded-full inline-block mt-1 text-[11px] sm:text-xs`}>
                      {page.subtitle}
                    </p>
                  </div>

                  <p className={`${getTextClass("content")} text-slate-700 max-w-sm mx-auto leading-relaxed pt-1 text-xs sm:text-sm`}>
                    Buddy Chiku and Kiki have awarded you a shiny golden completion medal! Tap "Finish Lesson" below to lock in your badge rewards!
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-amber-200/30 pt-3 flex items-center justify-between gap-2.5">
                <span className="text-[10px] font-mono font-black text-slate-400">STANDARD 1 GRADUATION RECORD • VERIFIED</span>
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black shrink-0 shadow-xs">
                  <span>✓ Chapter Graduated!</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Filter chapters based on active volume
  const filteredChapters = useMemo(() => {
    return subjectConfig.chapters || [];
  }, [subjectConfig]);

  return (
    <div id="syllabus-book-box" className="space-y-6">

      {/* Subject Selector Buttons */}
      <div className="flex gap-3 overflow-x-auto pb-2.5 snap-x select-none">
        {standardCurriculum.map((sub) => {
          const isActive = activeSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                playPageTurnSound();
                setActiveSubject(sub.id);
                stopAllSpeech();
              }}
              className={`flex-1 min-w-[120px] py-4 px-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all snap-start border-4 ${
                isActive
                  ? `text-white shadow-lg transform -translate-y-1 ${
                      sub.id === "math"
                        ? "bg-blue-600 border-blue-400 border-b-8 border-b-blue-800"
                        : sub.id === "lang"
                        ? "bg-pink-600 border-pink-400 border-b-8 border-b-pink-800"
                        : sub.id === "evs"
                        ? "bg-teal-600 border-teal-400 border-b-8 border-b-teal-800"
                        : sub.id === "art"
                        ? "bg-orange-600 border-orange-400 border-b-8 border-b-orange-800"
                        : "bg-purple-600 border-purple-400 border-b-8 border-b-purple-800"
                    }`
                  : "bg-white hover:bg-orange-50/50 text-slate-600 border-slate-200 hover:border-orange-200 border-b-8 border-b-slate-300"
              }`}
            >
              <span className="text-3xl transform hover:scale-125 transition-transform">{sub.emoji}</span>
              <span className="text-xs font-black font-heading tracking-tight">{sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subject Header Board */}
      <div className={`p-8 rounded-[32px] text-white bg-gradient-to-r ${subjectConfig.gradient} shadow-xl border-4 border-amber-200 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
        <div className="text-xxs font-black uppercase tracking-widest bg-white/20 text-white rounded-full px-3.5 py-1.5 inline-block mb-3 border-2 border-white/20 shadow-xs">
          ✨ Subject Exploration Mode
        </div>
        <h3 className="font-heading text-3xl sm:text-4xl font-black mb-1.5 drop-shadow-sm">{subjectConfig.name}</h3>
        <p className="font-bold text-white/95 text-sm sm:text-base italic">{subjectConfig.tagline}</p>
        <p className="text-xs sm:text-sm text-white/90 max-w-xl mt-4 leading-relaxed font-medium">{subjectConfig.description}</p>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length === 0 ? (
        <div className="bg-slate-50 rounded-[32px] p-12 border-4 border-dashed border-slate-200 text-center space-y-4">
          <span className="text-5xl select-none block">📭</span>
          <h4 className="font-black text-slate-800 text-lg">No Chapters in Volume {activeVolume}</h4>
          <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
            There are no chapters published under this volume for {subjectConfig.name}. Please select another Volume (1 to 3) or change the subject!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredChapters.map((ch) => {
            const isCompleted = progress.completedChapterIds.includes(ch.id);
            const completedPages = progress.completedChapterPages?.[ch.id] || [];
            const pageCount = completedPages.length;
            const compPercent = Math.min(100, Math.round((pageCount / 25) * 100));
            const readPercent = compPercent;

            // Dynamic difficulty and rewards based on Chapter and selected Standard
            let difficulty = "Easy";
            let diffColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
            let duration = "12 mins";
            let xpReward = 100;

            if (ch.num <= 2) {
              difficulty = "Easy";
              diffColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
              duration = `${10 + selectedStandard} mins`;
              xpReward = 50 + selectedStandard * 10;
            } else if (ch.num <= 5) {
              difficulty = "Medium";
              diffColor = "bg-amber-100 text-amber-850 border-amber-200";
              duration = `${12 + selectedStandard} mins`;
              xpReward = 80 + selectedStandard * 10;
            } else {
              difficulty = "Advanced Explorer";
              diffColor = "bg-indigo-100 text-indigo-850 border-indigo-200";
              duration = `${15 + selectedStandard} mins`;
              xpReward = 120 + selectedStandard * 10;
            }

            const quizScore = progress.quizScores?.[ch.id];
            const quizCompleted = quizScore !== undefined || isCompleted;
            const practiceCompleted = pageCount >= 8;
            const gameCompleted = pageCount >= 18;

            return (
              <div
                key={ch.id}
                className={`bg-white rounded-[32px] p-6 border-4 transition-all relative overflow-hidden flex flex-col justify-between shadow-md ${
                  isCompleted
                    ? "border-emerald-400 bg-emerald-50/20 shadow-emerald-50"
                    : "border-slate-800 hover:border-indigo-500 hover:shadow-lg"
                }`}
              >
                <div>
                  {/* Card top flags */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-2 ${
                      activeSubject === "math" ? "text-blue-700 bg-blue-50 border-blue-200" :
                      activeSubject === "lang" ? "text-pink-700 bg-pink-50 border-pink-200" :
                      activeSubject === "evs" ? "text-teal-700 bg-teal-50 border-teal-200" :
                      activeSubject === "art" ? "text-orange-700 bg-orange-50 border-orange-200" : "text-purple-700 bg-purple-50 border-purple-200"
                    }`}>
                      Chapter {ch.num}
                    </span>

                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${diffColor}`}>
                      {difficulty}
                    </span>
                  </div>

                  {/* Character Illustration & Title block */}
                  <div className="flex gap-4 mb-4">
                    <span className="text-5xl shrink-0 select-none transform hover:scale-115 transition-transform">{ch.icon}</span>
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-black text-slate-800 leading-snug">{ch.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-bold">{ch.summary}</p>
                    </div>
                  </div>

                  {/* Chapter Stats and Rewards Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xxs font-black text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <span>⏱️ Est. Time:</span>
                      <span className="text-slate-700">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <span>💎 Reward:</span>
                      <span className="text-indigo-600">+{xpReward} XP</span>
                    </div>
                  </div>

                  {/* Progress completion bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <span className="text-slate-400">QUEST PROGRESS</span>
                      <span className="text-indigo-600">{compPercent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${compPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Checklist criteria */}
                  <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100/80 space-y-2 mb-5">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Chapter Criteria checklist</h5>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <span className={readPercent >= 100 || isCompleted ? "text-emerald-500" : "text-slate-300"}>
                          {readPercent >= 100 || isCompleted ? "✓" : "○"}
                        </span>
                        <span className="text-slate-600 text-xxs">Read</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <span className={quizCompleted ? "text-emerald-500" : "text-slate-300"}>
                          {quizCompleted ? "✓" : "○"}
                        </span>
                        <span className="text-slate-600 text-xxs">Quiz</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <span className={gameCompleted || isCompleted ? "text-emerald-500" : "text-slate-300"}>
                          {gameCompleted || isCompleted ? "✓" : "○"}
                        </span>
                        <span className="text-slate-600 text-xxs">Game</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenChapter(ch)}
                    className={`flex-1 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border-b-4 ${
                      isCompleted
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                        : activeSubject === "math"
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
                        : activeSubject === "lang"
                        ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-800"
                        : activeSubject === "evs"
                        ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-800"
                        : activeSubject === "art"
                        ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-800"
                        : "bg-purple-600 hover:bg-purple-700 text-white border-purple-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    {compPercent > 0 && compPercent < 100
                      ? "Continue Quest 🚀"
                      : isCompleted
                      ? "Re-Read Chapter 🎒"
                      : "Start Chapter! 📖"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reading Chapter Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-[9999] transition-all duration-300 ${isMaximized ? "p-0" : "p-4"}`}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40, rotate: 2 }}
              transition={{ type: "spring", stiffness: 95, damping: 15 }}
              className={`bg-[#FFFBEB] overflow-hidden shadow-2xl flex flex-col transition-all duration-300 relative ${
                isMaximized 
                  ? "w-screen h-screen max-h-screen rounded-none border-0" 
                  : "rounded-[36px] w-full md:max-w-4xl lg:max-w-5xl max-h-[95vh] border-4 border-orange-200"
              }`}
            >
              {/* Modal Header */}
              <div className={`bg-white border-b-4 border-orange-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0 select-none transition-all ${
                windowHeight < 720 ? "p-2 sm:py-2 px-4" : "p-4"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`bg-orange-400 rounded-xl flex items-center justify-center shadow-md transform -rotate-2 shrink-0 transition-all ${
                    windowHeight < 720 ? "w-8 h-8" : "w-11 h-11"
                  }`}>
                    <span className={`select-none transition-all ${windowHeight < 720 ? "text-lg" : "text-2xl"}`}>{selectedChapter.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Chapter {selectedChapter.num}</span>
                    <h4 className={`font-heading font-black text-slate-800 leading-tight transition-all ${
                      windowHeight < 720 ? "text-sm" : "text-base sm:text-lg"
                    }`}>{selectedChapter.title}</h4>
                  </div>
                </div>

                {/* Visual Speaking Speed Control Panel */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-100 border-2 border-slate-200 p-1 rounded-xl shadow-xxs">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1.5 hidden lg:inline">Pace:</span>
                    {[
                      { rate: 0.58, label: "Slower", emoji: "🐢" },
                      { rate: 0.72, label: "Slow", emoji: "🐌" },
                      { rate: 0.9, label: "Normal", emoji: "👤" }
                    ].map((cfg) => {
                      const isSelected = speechRate === cfg.rate;
                      return (
                        <button
                          key={cfg.rate}
                          onClick={() => {
                            playClickSound();
                            setGlobalSpeechRate(cfg.rate);
                            let label = cfg.label;
                            if (cfg.rate === 0.58) label = "Slower";
                            if (cfg.rate === 0.72) label = "Slow";
                            if (cfg.rate === 0.9) label = "Normal";
                            speakClientSide(`Speed is now ${label}!`);
                          }}
                          title={`Change speech rate to ${cfg.label}`}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-orange-500 text-white shadow-xs scale-105"
                              : "text-slate-600 hover:bg-white hover:text-slate-800"
                          }`}
                        >
                          <span>{cfg.emoji}</span>
                          <span className="text-[10px] font-black">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                  {/* Dynamic Text Scaling Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-100 border-2 border-slate-200 p-1 rounded-xl shadow-xxs">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider pl-1.5 hidden lg:inline">Text:</span>
                    {[
                      { scale: "large", label: "Large", emoji: "Aa" },
                      { scale: "larger", label: "Larger", emoji: "Aa+" },
                      { scale: "huge", label: "Huge", emoji: "Aa✨" }
                    ].map((cfg) => {
                      const isSelected = textScale === cfg.scale;
                      return (
                        <button
                          key={cfg.scale}
                          onClick={() => {
                            playClickSound();
                            handleTextScaleChange(cfg.scale as "large" | "larger" | "huge");
                            speakClientSide(`Text scale is now ${cfg.label}!`);
                          }}
                          title={`Change text size to ${cfg.label}`}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs scale-105"
                              : "text-slate-600 hover:bg-white hover:text-slate-800"
                          }`}
                        >
                          <span>{cfg.emoji}</span>
                          <span className="text-[10px] font-black">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                  {/* Chapter Map Toggle Button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsSidebarOpen(!isSidebarOpen);
                      speakClientSide(isSidebarOpen ? "Closed learning map." : "Opened learning map!");
                    }}
                    title="Toggle Chapter Map"
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-all cursor-pointer border-2 border-transparent hover:border-slate-200 shrink-0 flex items-center justify-center gap-1.5 px-3"
                  >
                    <Compass className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                    <span className="text-xs font-black text-indigo-600 hidden md:inline">Chapter Map</span>
                  </button>

                  <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

                  {/* Maximize/Minimize Button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsMaximized(!isMaximized);
                      speakClientSide(isMaximized ? "Minimized book view." : "Maximized book view!");
                    }}
                    title={isMaximized ? "Minimize View" : "Maximize View"}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-all cursor-pointer border-2 border-transparent hover:border-slate-200 shrink-0 flex items-center justify-center"
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>

                  <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

                  <button
                    onClick={handleCloseChapter}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-all cursor-pointer border-2 border-transparent hover:border-slate-200 shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body (The physical book container) */}
              <div className={`flex-1 overflow-y-auto bg-slate-900/5 flex flex-col justify-start items-center transition-all ${
                windowHeight < 720 ? "p-2 gap-2" : "p-4 md:p-6 gap-4"
              }`}>
                
                {/* Perspective container wrapping the physical-feel book */}
                <div 
                  className="w-full relative mx-auto my-auto flex items-center justify-center transition-all duration-300"
                  style={{ 
                    height: isMobile ? `${480 * bookScale}px` : `${530 * bookScale}px`,
                  }}
                >
                  <div 
                    className="relative origin-center transition-all duration-300 shrink-0"
                    style={{ 
                      perspective: 1200,
                      transform: `scale(${bookScale})`,
                      width: isMobile ? "450px" : (isMaximized ? "100%" : "1024px"),
                    }}
                  >
                    {/* Ribbon Bookmark - decorative, highly aesthetic */}
                    <div className="absolute -top-3 right-10 w-6 h-12 bg-rose-500 rounded-b-md shadow-md z-30 pointer-events-none transform origin-top hover:scale-y-115 transition-transform" />

                    {/* 3D Flipping Book container */}
                    <div className="relative flex items-center justify-center w-full">
                    {/* Left Floating Turn Button (Desktop) */}
                    {!isMobile && currentPageIndex >= 2 && (
                      <button
                        onClick={handlePrevPage}
                        className="absolute -left-16 z-30 bg-amber-950/90 text-amber-100 hover:text-white h-12 w-12 rounded-full flex items-center justify-center cursor-pointer border-2 border-amber-800 shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <span className="text-xl font-bold font-sans">←</span>
                      </button>
                    )}

                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={isMobile ? currentPageIndex : Math.floor(currentPageIndex / 2)}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ transformStyle: "preserve-3d" }}
                        className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#FAF3DD] rounded-[36px] border-[12px] border-amber-950 shadow-2xl overflow-hidden min-h-[480px] relative"
                      >
                        {/* Left Page (in desktop layout) or Single Page (in mobile layout) */}
                        <div className="relative h-full [backface-visibility:hidden]">
                          {renderPage(currentPageIndex)}
                        </div>

                        {/* Right Page (only visible in desktop double-page layout) */}
                        {!isMobile && (
                          <div className="relative h-full border-l border-amber-950/25 [backface-visibility:hidden]">
                            {renderPage(currentPageIndex + 1)}
                          </div>
                        )}

                        {/* Center spine crease - only visible on desktop double-page view */}
                        {!isMobile && (
                          <>
                            <div className="absolute top-0 bottom-0 left-1/2 w-[24px] -translate-x-1/2 bg-gradient-to-r from-black/[0.04] via-black/[0.14] to-black/[0.04] pointer-events-none z-20" />
                            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-amber-950/15 pointer-events-none z-20" />
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Right Floating Turn Button (Desktop) */}
                    {!isMobile && currentPageIndex < 23 && (
                      <button
                        onClick={handleNextPage}
                        className="absolute -right-16 z-30 bg-amber-950/90 text-amber-100 hover:text-white h-12 w-12 rounded-full flex items-center justify-center cursor-pointer border-2 border-amber-800 shadow-xl hover:scale-110 active:scale-95 transition-all"
                      >
                        <span className="text-xl font-bold">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

                {/* Mobile Turn Controls */}
                {isMobile && (
                  <div className="flex justify-between items-center w-full mt-4 select-none px-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPageIndex === 0}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 border-b-4 shadow-md transition-all active:scale-95 ${
                        currentPageIndex === 0
                          ? "bg-slate-100 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span>👈</span> Prev Page
                    </button>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPageIndex === 24}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 border-b-4 shadow-md transition-all active:scale-95 ${
                        currentPageIndex === 24
                          ? "bg-slate-100 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                      }`}
                    >
                      Next Page 👉
                    </button>
                  </div>
                )}

                {/* Sleek Progress Bar Tracker */}
                <div className={`w-full max-w-md bg-amber-950/10 rounded-full overflow-hidden relative border-2 border-amber-950/20 shadow-inner flex items-center transition-all ${
                  windowHeight < 720 ? "h-4.5 mt-1.5" : "h-6 mt-4"
                }`}>
                  <div 
                    className="bg-amber-950 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentPageIndex + (isMobile ? 1 : 2)) / 25) * 100}%` }}
                  />
                  <span className={`absolute inset-0 flex items-center justify-center font-black text-amber-950 font-sans tracking-widest drop-shadow-xs transition-all ${
                    windowHeight < 720 ? "text-[8px]" : "text-[9px]"
                  }`}>
                    PAGE {currentPageIndex + 1} {!isMobile && currentPageIndex + 1 < 25 && `& ${currentPageIndex + 2}`} OF 25
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`bg-white border-t-4 border-orange-100 flex justify-between items-center shrink-0 select-none transition-all ${
                windowHeight < 720 ? "p-2 sm:py-2.5 px-4" : "p-4"
              }`}>
                <button
                  onClick={handleCloseChapter}
                  className="text-xs font-black text-slate-500 hover:text-slate-800 transition-all cursor-pointer px-4 py-2 hover:bg-slate-50 rounded-xl"
                >
                  🎒 Close Book
                </button>

                {/* Let's guide children to turn the page or close when completed */}
                <div className="flex gap-2">
                  {!(isMobile ? currentPageIndex === 24 : currentPageIndex >= 23) ? (
                    <button
                      onClick={handleNextPage}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md border-b-4 border-orange-700 active:scale-95 transition-all cursor-pointer"
                    >
                      Next Page 👉
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Mark as completed!
                        if (selectedChapter) {
                          onUpdateProgress((prev) => {
                            const completedIds = [...prev.completedChapterIds];
                            if (!completedIds.includes(selectedChapter.id)) {
                              completedIds.push(selectedChapter.id);
                            }
                            
                            const totalChapters = subjectConfig.chapters.length;
                            const completedCount = subjectConfig.chapters.filter((ch) =>
                              completedIds.includes(ch.id)
                            ).length;
                            const newPct = Math.round((completedCount / totalChapters) * 100);

                            const newSubjectsCompleted = {
                              ...prev.subjectsCompleted,
                              [activeSubject]: newPct,
                            };

                            const badgeId = `${activeSubject}-mastery`;
                            const hasBadge = prev.badgesEarned.some((b) => b.id === badgeId);
                            const badges = [...prev.badgesEarned];

                            if (newPct === 100 && !hasBadge) {
                              const badgeTitles: Record<SubjectType, string> = {
                                math: "Math Wizard 🔢",
                                lang: "Word Master 📖",
                                evs: "Nature Scientist 🌿",
                                art: "Creative Artist 🎨",
                                life: "Habit Hero 💡",
                              };
                              badges.push({
                                id: badgeId,
                                title: badgeTitles[activeSubject],
                                icon: "🎓",
                                unlockedAt: new Date().toLocaleDateString(),
                                subject: activeSubject,
                              });
                            }

                            return {
                              ...prev,
                              completedChapterIds: completedIds,
                              subjectsCompleted: newSubjectsCompleted,
                              badgesEarned: badges,
                            };
                          });
                        }
                        handleCloseChapter();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md border-b-4 border-emerald-800 active:scale-95 transition-all cursor-pointer"
                    >
                      Finish Lesson & Close! 🎓🏆
                    </button>
                  )}
                </div>
              </div>

              {/* Floating Chapter Map Toggle Tab on the side of the container */}
              {selectedChapter && (
                <button
                  onClick={() => {
                    playClickSound();
                    setIsSidebarOpen(true);
                    speakClientSide("Opened learning map!");
                  }}
                  title="Open Chapter Map"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-l from-orange-500 to-amber-500 text-white font-black text-[10px] pl-3 pr-2 py-4 rounded-l-2xl flex flex-col items-center gap-1.5 shadow-lg border-2 border-r-0 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                >
                  <Compass className="w-4 h-4 animate-spin-slow group-hover:rotate-45 transition-transform" />
                  <span className="uppercase tracking-widest text-[8px] flex flex-col items-center leading-none font-bold mt-1">
                    <span>M</span>
                    <span>A</span>
                    <span>P</span>
                  </span>
                </button>
              )}

              {/* Sliding Sidebar for Chapter Map Navigation */}
              <AnimatePresence>
                {isSidebarOpen && selectedChapter && (
                  <>
                    {/* Backdrop wrapper to close drawer when clicking outside, satisfying "cancel anytime" */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        playClickSound();
                        setIsSidebarOpen(false);
                      }}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-[99] cursor-pointer"
                    />

                    {/* The actual drawer panel */}
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-[#FFFDF6] shadow-2xl border-l-4 border-orange-200 z-[100] flex flex-col select-none"
                    >
                      {/* Drawer Header */}
                      <div className="p-4 bg-orange-50 border-b-2 border-orange-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className="w-5 h-5 text-orange-600 animate-spin-slow" />
                          <h5 className="font-heading font-black text-sm text-slate-800">
                            Chapter Map 🗺️
                          </h5>
                        </div>
                        <button
                          onClick={() => {
                            playClickSound();
                            setIsSidebarOpen(false);
                          }}
                          className="p-1.5 hover:bg-orange-100/80 rounded-full text-slate-500 hover:text-slate-800 transition-all cursor-pointer border border-transparent hover:border-orange-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Drawer Progress Stats */}
                      <div className="p-4 bg-amber-50/50 border-b border-orange-100 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600">Chapter Progress</span>
                          <span className="text-xs font-black text-orange-600">
                            {progress.completedChapterPages?.[selectedChapter.id]?.length || 0}/25 Complete
                          </span>
                        </div>
                        {/* Progress bar inside drawer */}
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${((progress.completedChapterPages?.[selectedChapter.id]?.length || 0) / 25) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Drawer Map/Scroll of Clickable Nodes */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Select a page to jump directly:
                        </p>
                        
                        <div className="grid grid-cols-4 gap-2 pb-6">
                          {Array.from({ length: 25 }).map((_, idx) => {
                            const isPageCompleted = (progress.completedChapterPages?.[selectedChapter.id] || []).includes(idx);
                            const isCurrent = isMobile 
                              ? currentPageIndex === idx 
                              : currentPageIndex === idx || (currentPageIndex + 1 === idx && idx < 25);
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  playClickSound();
                                  if (isMobile) {
                                    setCurrentPageIndex(idx);
                                  } else {
                                    setCurrentPageIndex(Math.floor(idx / 2) * 2);
                                  }
                                }}
                                className={`h-11 rounded-xl font-mono font-black text-xs flex flex-col items-center justify-center border-2 transition-all cursor-pointer transform hover:scale-105 active:scale-95 relative ${
                                  isCurrent
                                    ? "bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-300 scale-105 z-10"
                                    : isPageCompleted
                                    ? "bg-emerald-500 text-white border-emerald-600 shadow-xxs"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50/30"
                                }`}
                              >
                                <span>{idx + 1}</span>
                                {isPageCompleted && (
                                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Map Guide/Legend */}
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Map Legend</span>
                          <div className="space-y-1.5 text-xs font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-md bg-orange-500 border border-orange-600" />
                              <span>Current Page</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-600" />
                              <span>Completed / Mastered</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-md bg-white border border-slate-200" />
                              <span>Unread / Locked</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Drawer Footer */}
                      <div className="p-3 bg-orange-50/50 border-t border-orange-100 flex justify-center">
                        <button
                          onClick={() => {
                            playClickSound();
                            setIsSidebarOpen(false);
                          }}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          Close Map
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
