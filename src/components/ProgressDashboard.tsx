import { useState } from "react";
import { Trophy, Award, Percent, ShieldCheck, HelpCircle, Volume2, CheckCircle2, ChevronRight, RefreshCw, Star } from "lucide-react";
import { StudentProgress, SubjectType } from "../types";
import { playClickSound, playPopSound, speakClientSide } from "../utils/audio";
import { getGraduationQuestions, TestQuestion } from "../data/graduationQuestions";

interface ProgressDashboardProps {
  progress: StudentProgress;
  studentName: string;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
  activeVolume?: number;
  setActiveVolume?: (vol: number) => void;
}

export default function ProgressDashboard({ 
  progress, 
  studentName, 
  onUpdateProgress,
  activeVolume,
  setActiveVolume
}: ProgressDashboardProps) {
  const [testState, setTestState] = useState<"not_started" | "running" | "completed">("not_started");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const activeVol = activeVolume || 1;
  const testQuestions = getGraduationQuestions(activeVol);

  const subjects: { id: SubjectType; name: string; emoji: string; color: string; fillClass: string }[] = [
    { id: "math", name: "Mathematics", emoji: "🔢", color: "text-blue-500", fillClass: "bg-blue-500" },
    { id: "lang", name: "Language & Literacy", emoji: "📖", color: "text-pink-500", fillClass: "bg-pink-500" },
    { id: "evs", name: "Discovery / EVS", emoji: "🌿", color: "text-teal-500", fillClass: "bg-teal-500" },
    { id: "art", name: "Art & Craft", emoji: "🎨", color: "text-orange-500", fillClass: "bg-orange-500" },
    { id: "life", name: "Life Skills", emoji: "💡", color: "text-purple-500", fillClass: "bg-purple-500" },
  ];

  const handleStartTest = () => {
    playPopSound();
    setTestState("running");
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setScore(0);
    speakClientSide(`Let's start your Volume ${activeVol} Graduation Test! Read or listen to the questions carefully.`);
  };

  const speakQuestion = (q: TestQuestion) => {
    speakClientSide(`${q.question} Is it ${q.options.join(", or ")}?`);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOption(option);
    setIsAnswered(true);

    const q = testQuestions[currentQuestionIdx];
    const correct = option === q.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      speakClientSide(q.explanation);
    } else {
      speakClientSide(`Oops! Let's learn. The correct answer is ${q.correctAnswer}.`);
    }
  };

  const handleNextQuestion = () => {
    playPopSound();
    if (currentQuestionIdx < testQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setTestState("completed");
      const passPercent = activeVol === 1 ? 0.85 : 0.80;
      const passingScore = Math.ceil(testQuestions.length * passPercent);
      const passed = score >= passingScore;
      if (passed) {
        const badgeId = `volume${activeVol}-graduate`;
        const hasBadge = progress.badgesEarned.some((b) => b.id === badgeId);
        if (!hasBadge) {
          onUpdateProgress((prev) => {
            const badges = [...prev.badgesEarned];
            badges.push({
              id: badgeId,
              title: `Volume ${activeVol} Graduate 🏆`,
              icon: activeVol === 3 ? "👑" : "🎓",
              unlockedAt: new Date().toLocaleDateString(),
              subject: "general",
            });
            return {
              ...prev,
              badgesEarned: badges,
            };
          });
        }
        speakClientSide(`Congratulations! You answered ${score} out of 50 questions correctly and graduated from Volume ${activeVol}! You are a superstar!`);
      } else {
        speakClientSide(`Good try! You scored ${score} out of 50. You need ${passingScore} correct answers to pass. Keep trying and you'll graduate soon!`);
      }
    }
  };

  const isGraduated = progress.badgesEarned.some((b) => b.id === `volume${activeVol}-graduate`);

  return (
    <div id="progress-dashboard-box" className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 select-none">
        {/* Streak card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-md flex items-center gap-4 relative overflow-hidden">
          <div className="text-4xl animate-bounce">🔥</div>
          <div>
            <div className="text-xxs font-bold uppercase tracking-wider text-amber-100">Learning Streak</div>
            <div className="text-2xl font-black">{progress.dailyStreak} Days Active</div>
            <div className="text-[10px] text-amber-100 font-semibold mt-0.5">Keep learning daily!</div>
          </div>
        </div>

        {/* Badges card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center gap-4 relative overflow-hidden font-sans">
          <div className="text-4xl">🏅</div>
          <div>
            <div className="text-xxs font-bold uppercase tracking-wider text-purple-100">Badges Earned</div>
            <div className="text-2xl font-black">{progress.badgesEarned.length} Badges</div>
            <div className="text-[10px] text-purple-100 font-semibold mt-0.5 font-sans">Unlock badges by doing quizzes!</div>
          </div>
        </div>

        {/* Speed grid time */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 text-white shadow-md flex items-center gap-4 relative overflow-hidden">
          <div className="text-4xl">🏎️</div>
          <div>
            <div className="text-xxs font-bold uppercase tracking-wider text-teal-100 font-sans">Speed Grid Record</div>
            <div className="text-2xl font-black font-sans">
              {progress.speedGridBestTime !== undefined ? `${progress.speedGridBestTime}s` : "No Record"}
            </div>
            <div className="text-[10px] text-teal-100 font-semibold mt-0.5 font-sans">Beat your speed record!</div>
          </div>
        </div>
      </div>

      {/* 🔥 Weekly Streak Tracker Panel */}
      <div className="bg-white border-2 border-orange-200 rounded-[28px] p-5 shadow-sm select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-orange-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-pulse">🔥</span>
            <div>
              <h4 className="font-heading text-lg font-black text-slate-800">
                Daily Streak Challenge!
              </h4>
              <p className="text-xs font-bold text-slate-400">
                Study every single day to keep your learning flame burning hot!
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5">
            <span>🔥 Current Streak:</span>
            <span className="text-sm font-black text-orange-700">{progress.dailyStreak} Days</span>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-7 gap-2.5">
          {(() => {
            const daysOfStreak = [];
            const today = new Date();
            // We want to show 7 days: 6 days ago up to today
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(today.getDate() - i);
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, etc.
              const dateNumber = d.getDate(); // 25
              const isToday = i === 0;
              
              // A day is active if the streak spans back to it
              const isActive = i < progress.dailyStreak;
              
              daysOfStreak.push({
                dayName,
                dateNumber,
                isToday,
                isActive,
              });
            }

            return daysOfStreak.map((day, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all ${
                  day.isActive
                    ? "bg-gradient-to-b from-amber-50 to-orange-100 border-orange-300 shadow-xxs scale-102"
                    : day.isToday
                    ? "bg-slate-50 border-slate-300 animate-pulse"
                    : "bg-slate-50/50 border-slate-100 opacity-65"
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  day.isActive ? "text-orange-600" : "text-slate-400"
                }`}>
                  {day.dayName}
                </span>
                
                {/* Visual day badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm my-2 transition-all ${
                  day.isActive
                    ? "bg-orange-500 text-white shadow-sm font-black scale-110"
                    : "bg-slate-200 text-slate-500 font-bold"
                }`}>
                  {day.isActive ? "🔥" : day.dateNumber}
                </div>

                <span className={`text-[9px] font-black uppercase ${
                  day.isToday
                    ? "text-indigo-600 font-black animate-pulse"
                    : day.isActive
                    ? "text-orange-700"
                    : "text-slate-400"
                }`}>
                  {day.isToday ? "Today" : day.isActive ? "Active" : "Locked"}
                </span>
              </div>
            ));
          })()}
        </div>

        {/* Motivation message depending on streak length */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mt-4 flex items-center gap-3">
          <span className="text-2xl select-none">💬</span>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">
            {progress.dailyStreak >= 5 
              ? "Phenomenal dedication! Your learning engine is red-hot! Keep up the brilliant daily habit! 🌟🚀"
              : progress.dailyStreak >= 3
              ? "Fabulous streak! You are becoming a master standard-1 adventurer! Keep logging in every day. 🎒✨"
              : "Awesome start! Every step counts. Log in tomorrow to increase your streak multiplier! 🐵🌈"}
          </p>
        </div>
      </div>

      {/* 🎓 Volume Comprehensive Graduation Test / Certificate Section */}
      <div className="bg-white border-4 border-indigo-600 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        {/* Decorative corner stars */}
        <div className="absolute top-4 right-4 text-3xl animate-pulse">✨</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-30">🌟</div>

        {testState === "not_started" && (
          <div className="text-center space-y-4 select-none py-4">
            <div className="inline-flex items-center justify-center bg-indigo-50 border-2 border-indigo-200 text-indigo-700 w-16 h-16 rounded-full text-3xl shadow-sm mb-1">
              🎓
            </div>
            <h4 className="font-heading text-2xl font-black text-indigo-950">
              Volume {activeVol} Comprehensive Graduation Test
            </h4>
            <p className="text-sm font-bold text-slate-500 max-w-xl mx-auto leading-relaxed">
              Show off everything you have learned! This test features **50 different questions** (10 questions per subject) covering every chapter in Mathematics, Language, Discovery/EVS, Art, and Life Skills. You need **{activeVol === 1 ? "85% (43 correct)" : "80% (40 correct)"}** or higher to pass and earn your official Volume {activeVol} diploma badge!
            </p>

            {isGraduated ? (
              <div className="max-w-md mx-auto bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 mt-4">
                <span className="text-4xl">{activeVol === 3 ? "👑📜" : "🏆📜"}</span>
                <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Officially Graduated!</p>
                <p className="text-sm font-extrabold text-emerald-950">
                  Congratulations! You mastered the 50-question test and graduated from Volume {activeVol}! {activeVol < 3 ? `You have unlocked Volume ${activeVol + 1}!` : "You have completed the entire standard curriculum!"}
                </p>
                <button
                  onClick={handleStartTest}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl border-b-4 border-indigo-800 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md mt-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Test
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartTest}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base px-8 py-3.5 rounded-2xl border-b-4 border-indigo-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg max-w-xs mx-auto"
              >
                Start Graduation Test! 🎓🚀
              </button>
            )}
          </div>
        )}

        {testState === "running" && (
          <div className="space-y-6 select-none py-2">
            {/* Question Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-black text-indigo-950">
                <span className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-800 flex items-center gap-1.5">
                  <span>Question {currentQuestionIdx + 1} of {testQuestions.length}</span>
                  <span className="text-xxs uppercase bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-black">
                    {testQuestions[currentQuestionIdx].subject === "math" ? "🔢 Mathematics" :
                     testQuestions[currentQuestionIdx].subject === "lang" ? "📖 Language" :
                     testQuestions[currentQuestionIdx].subject === "evs" ? "🌿 Discovery/EVS" :
                     testQuestions[currentQuestionIdx].subject === "art" ? "🎨 Art & Craft" :
                     "💡 Life Skills"}
                  </span>
                </span>
                <span className="font-mono text-indigo-600">Correct Answers: {score}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIdx + 1) / testQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 relative flex items-center justify-between gap-4">
              <p className="text-base font-extrabold text-slate-800 leading-relaxed pr-8">
                {testQuestions[currentQuestionIdx].question}
              </p>
              <button
                onClick={() => speakQuestion(testQuestions[currentQuestionIdx])}
                className="p-2.5 hover:bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer text-slate-600 hover:text-indigo-600 shadow-xs shrink-0 self-start"
                title="Listen to question"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
              </button>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {testQuestions[currentQuestionIdx].options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorr = opt === testQuestions[currentQuestionIdx].correctAnswer;

                let btnStyles = "bg-white border-slate-200 hover:border-indigo-400 text-slate-800 hover:bg-slate-50";
                if (isAnswered) {
                  if (isSelected) {
                    btnStyles = isCorr
                      ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200"
                      : "bg-rose-500 border-rose-600 text-white shadow-rose-200 animate-shake";
                  } else if (isCorr) {
                    btnStyles = "bg-emerald-100 border-emerald-300 text-emerald-800";
                  } else {
                    btnStyles = "bg-white border-slate-100 text-slate-300 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl text-sm font-black border-2 border-b-4 transition-all text-center flex items-center justify-center ${
                      !isAnswered ? "active:scale-95 cursor-pointer shadow-xs" : ""
                    } ${btnStyles}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Status explanation indicator and Next button */}
            {isAnswered && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border-2 text-center text-xs font-black animate-pulse ${
                  isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  {isCorrect ? "✨ Amazing! Correct! ✨" : "💡 Don't worry! Keep going! 💡"}
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm py-4 px-6 rounded-2xl border-b-4 border-indigo-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {currentQuestionIdx < testQuestions.length - 1 ? (
                    <>Next Question <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <>Submit Test & See Results! 🏆</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {testState === "completed" && (
          <div className="text-center py-6 space-y-6 select-none">
            {score >= 43 ? (
              <div className="space-y-4">
                {/* Visual Certificate Frame */}
                <div className="bg-[#FFFDF6] border-8 border-double border-amber-500 rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-lg relative font-serif">
                  <div className="absolute top-2 left-2 text-xl text-amber-500 opacity-50">🌟</div>
                  <div className="absolute top-2 right-2 text-xl text-amber-500 opacity-50">🌟</div>
                  <div className="absolute bottom-2 left-2 text-xl text-amber-500 opacity-50">🌟</div>
                  <div className="absolute bottom-2 right-2 text-xl text-amber-500 opacity-50">🌟</div>

                  <span className="text-3xl block mb-2">📜🎓</span>
                  <p className="font-heading text-xs uppercase tracking-widest text-amber-800 font-sans font-black mb-1">
                    S.A.M.A.M. Primary Education
                  </p>
                  <h5 className="font-heading text-lg sm:text-2xl text-amber-950 font-black tracking-tight leading-none mb-6">
                    Volume 1 Graduation Diploma
                  </h5>
                  
                  <p className="text-xs text-slate-500 italic mb-2 font-sans font-bold">This is proudly awarded to our brilliant adventurer</p>
                  <p className="text-xl sm:text-2xl font-sans font-black text-indigo-900 border-b-2 border-dashed border-indigo-200 pb-2 max-w-sm mx-auto mb-4">
                    {studentName}
                  </p>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-extrabold max-w-md mx-auto mb-6">
                    For mastering the 50-chapter Volume 1 curriculum with an outstanding score of **{score}/50** ({Math.round((score/50)*100)}%)!
                  </p>
                  
                  <div className="flex justify-between items-center px-4 max-w-xs mx-auto border-t border-amber-200 pt-3 text-xxs font-sans font-bold text-slate-400">
                    <div>
                      <p className="font-black text-amber-900">Adventure Buddy AI</p>
                      <p>S.A.M.A.M Tutor</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-amber-900">{new Date().toLocaleDateString()}</p>
                      <p>Date Graduated</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-heading text-2xl font-black text-indigo-950">
                    You have Officially Graduated! 🎉
                  </h4>
                  <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-relaxed">
                    You've passed with a magnificent score of **{score} out of 50** ({Math.round((score/50)*100)}%)! Tell your teacher that you are fully ready to tackle **Volume 2 & Volume 3**!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <span className="text-5xl block animate-bounce">💡</span>
                <h4 className="font-heading text-2xl font-black text-slate-800">
                  Great Try! You scored {score} / 50
                </h4>
                <p className="text-sm font-extrabold text-slate-500 leading-relaxed">
                  You scored **{Math.round((score/50)*100)}%**. You need at least **85% (43 correct answers)** to pass the Graduation Test. You're doing wonderful—review your book chapters, play some math or language games, and try again!
                </p>
                <button
                  onClick={handleStartTest}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-6 py-3 rounded-2xl border-b-4 border-indigo-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md max-w-xs mx-auto"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again!
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Bars Section */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
        <h4 className="font-heading text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Percent className="w-5 h-5 text-slate-600" /> Subject Progress
        </h4>

        <div className="space-y-5">
          {subjects.map((sub) => {
            const pct = progress.subjectsCompleted[sub.id] || 0;
            return (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="text-lg">{sub.emoji}</span>
                    {sub.name}
                  </span>
                  <span className={sub.color}>{pct}% Completed</span>
                </div>
                
                {/* Progress track */}
                <div className="h-3.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${sub.fillClass}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm select-none">
        <h4 className="font-heading text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" /> Your Badge Album
        </h4>

        {progress.badgesEarned.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed rounded-2xl border-slate-200">
            <div className="text-5xl mb-3">🔒</div>
            <p className="text-sm text-slate-500 font-bold max-w-xs mx-auto">
              Earn your very first badge by playing our math games or completing chapter quizzes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {progress.badgesEarned.map((badge) => (
              <div
                key={badge.id}
                className="bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-4 text-center transition-all shadow-xxs transform hover:-translate-y-0.5"
              >
                <div className="text-4xl mb-2.5 animate-pulse">{badge.icon}</div>
                <div className="text-sm font-black text-slate-800 leading-snug">{badge.title}</div>
                <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Unlocked {badge.unlockedAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
