import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Volume2, X, Star, BookOpen, Sparkles, Smile, ArrowRight, Heart, RefreshCw, Mic, MicOff } from "lucide-react";
import { playClickSound, playPopSound, speakClientSide, stopAllSpeech, playAnimalSFX } from "../utils/audio";
import { playSynthBeep } from "./SpeedGridGame";

import { type DictionaryEntry, VISUAL_DICTIONARY_ENTRIES } from "../data/dictionaryData";

interface VisualDictionaryProps {
  onClose: () => void;
  initialWordId?: string | null;
}

// S.A.M.A.M Fun Facts Database Helper
const getFunFactForWord = (entry: any): string => {
  const w = entry.word.toLowerCase();
  if (w.includes("lion")) return "Lions are the only cats that live in big family groups called prides! They make a mighty roar that can be heard 5 miles away! 🦁🔊";
  if (w.includes("tiger")) return "Tigers have striped skin, not just striped fur! No two tigers have the same pattern of stripes! 🐯🦓";
  if (w.includes("panda")) return "Giant pandas spend up to 12 hours a day eating bamboo stalk! They are excellent climbers! 🐼🎋";
  if (w.includes("rabbit")) return "Rabbits do a happy hop-and-twist dance in the air when they are excited! It's called a 'binky'! 🐰💃";
  if (w.includes("bird")) return "Some birds can sleep while they are flying high in the blue sky! They have hollow bones to make them super light! 🐦✈️";
  if (w.includes("monkey")) return "Monkeys are very smart and some can even use tools to eat their food, just like humans! 🐵🛠️";
  if (w.includes("elephant")) return "Elephants can talk to each other using rumbling sounds that are too low for humans to hear! 🐘🗣️";
  if (w.includes("bear")) return "Bears are super smart and have an amazing sense of smell that is 7 times stronger than a bloodhound! 🐻👃";
  if (w.includes("apple")) return "Apples float in water because they are 25% empty air inside! 🍎🌊";
  if (w.includes("banana")) return "Bananas are actually giant herbs, and they grow pointing upwards towards the warm sun! 🍌☀️";
  
  if (entry.category === "animals") return `A baby ${w} is full of energy and loves playing tag with its friends in nature! 🐾`;
  if (entry.category === "nature") return `Every single plant and leaf in nature absorbs warm sunshine to produce fresh air for us to breathe! 🌿🌍`;
  if (entry.category === "shapes") return `Shapes are the building blocks of our universe! Every building and toy you see is made of circles, squares, and triangles! 📐🧱`;
  return `This magical item is used by explorers all over the world to build beautiful houses, create art, and solve problems! 🌟🛠️`;
};

// S.A.M.A.M Dynamic Mini Quiz Options Helper
const getMiniQuizForWord = (entry: any) => {
  const word = entry.word;
  const opt1 = word;
  
  // create spelling typo
  let opt2 = word;
  if (word.match(/[aeiou]/i)) {
    opt2 = word.replace(/[aeiou]/i, (m: string) => m.toLowerCase() === "a" ? "e" : "a");
  } else {
    opt2 = word + "y";
  }
  
  // transposed spelling option
  const opt3 = word.length > 3 ? word.slice(1) + word[0] : word + "s";
  
  // Uniqify options
  const rawOptions = [opt1, opt2, opt3];
  const uniqueOptions = Array.from(new Set(rawOptions));
  if (uniqueOptions.length < 3) {
    uniqueOptions.push(word + "z");
  }
  
  // Sort them stable-ishly
  const options = uniqueOptions.sort();

  return {
    question: `Which is the correct spelling of this word? ✏️`,
    options,
    correctAnswer: word,
    explanation: `Superb! You know exactly how to spell "${word}"! 🏆`
  };
};

export default function VisualDictionary({ onClose, initialWordId }: VisualDictionaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(null);

  // Mini quiz states for word cards
  const [miniQuizAnswered, setMiniQuizAnswered] = useState<boolean>(false);
  const [miniQuizCorrect, setMiniQuizCorrect] = useState<boolean | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  // Reset mini quiz when selected word changes
  useEffect(() => {
    setMiniQuizAnswered(false);
    setMiniQuizCorrect(null);
    setSelectedQuizOption(null);
  }, [selectedWord]);

  // Responsive mobile state
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Spelling game state
  const [spellingGameActive, setSpellingGameActive] = useState(false);
  const [spellingProgress, setSpellingProgress] = useState<string[]>([]);
  const [letterOptions, setLetterOptions] = useState<string[]>([]);
  const [spellingSuccess, setSpellingSuccess] = useState(false);

  // Speech pronunciation practice state
  const [speechPracticeActive, setSpeechPracticeActive] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechSuccess, setSpeechSuccess] = useState<boolean | null>(null);
  const [isSpeechListening, setIsSpeechListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // Cleanup speech practice on unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Speak individual alphabet letter sounds (phonics for kids!)
  const speakPhonicSound = (letter: string) => {
    playClickSound();
    let audioText = "";
    const l = letter.toUpperCase();
    if (l === "A") audioText = "A says Ah, like Apple!";
    else if (l === "B") audioText = "B says Buh, like Ball!";
    else if (l === "C") audioText = "C says Cuh, like Cat!";
    else if (l === "D") audioText = "D says Duh, like Dog!";
    else if (l === "E") audioText = "E says Eh, like Egg!";
    else if (l === "F") audioText = "F says Fuh, like Fish!";
    else if (l === "G") audioText = "G says Guh, like Goat!";
    else if (l === "H") audioText = "H says Huh, like Home!";
    else if (l === "I") audioText = "I says Eye, like Ice!";
    else if (l === "J") audioText = "J says Juh, like Jar!";
    else if (l === "K") audioText = "K says Kuh, like Kite!";
    else if (l === "L") audioText = "L says Luh, like Lion!";
    else if (l === "M") audioText = "M says Muh, like Monkey!";
    else if (l === "N") audioText = "N says Nuh, like Nose!";
    else if (l === "O") audioText = "O says Oh, like Orange!";
    else if (l === "P") audioText = "P says Puh, like Pen!";
    else if (l === "Q") audioText = "Q says Quuh, like Queen!";
    else if (l === "R") audioText = "R says Rruhh, like Rainbow!";
    else if (l === "S") audioText = "S says Ssss, like Sun!";
    else if (l === "T") audioText = "T says Tuh, like Tree!";
    else if (l === "U") audioText = "U says Uh, like Umbrella!";
    else if (l === "V") audioText = "V says Vuh, like Van!";
    else if (l === "W") audioText = "W says Wuh, like Wind!";
    else if (l === "X") audioText = "X says Ks, like Box!";
    else if (l === "Y") audioText = "Y says Yeh, like Yellow!";
    else if (l === "Z") audioText = "Z says Zuh, like Zebra!";
    else audioText = l;

    speakClientSide(audioText);
  };

  // Initialize spelling game
  const startSpellingGame = (entry: DictionaryEntry) => {
    playPopSound();
    setSpellingGameActive(true);
    setSpeechPracticeActive(false);
    setSpellingProgress([]);
    setSpellingSuccess(false);

    // Prepare spelling choice options (shuffle word letters + add 2 extra random ones)
    const originalLetters = [...entry.letters];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const randomLetters = alphabet
      .filter(char => !originalLetters.includes(char))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const shuffled = [...originalLetters, ...randomLetters].sort(() => 0.5 - Math.random());
    setLetterOptions(shuffled);
  };

  const handleSelectLetterOption = (letter: string) => {
    if (!selectedWord) return;
    playClickSound();

    const expectedIndex = spellingProgress.length;
    const expectedLetter = selectedWord.letters[expectedIndex];

    if (letter === expectedLetter) {
      const updated = [...spellingProgress, letter];
      setSpellingProgress(updated);
      
      // Speak letter and sound success
      speakClientSide(`${letter}! Correct!`);

      if (updated.length === selectedWord.letters.length) {
        setSpellingSuccess(true);
        playSynthBeep("success");
        setTimeout(() => {
          speakClientSide(`Outstanding job! You spelled ${selectedWord.word}!`);
        }, 500);
      }
    } else {
      // Incorrect letter tap
      playSynthBeep("error");
      speakClientSide(`Oops! Let's try that letter again!`);
    }
  };

  // Handle Speech Pronunciation Practice
  const toggleSpeechPractice = (entry: DictionaryEntry) => {
    playClickSound();
    
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      speakClientSide("Voice recognition is not supported in this browser. Try Google Chrome!");
      return;
    }

    if (!speechPracticeActive) {
      setSpeechPracticeActive(true);
      setSpellingGameActive(false);
      setSpeechTranscript("");
      setSpeechSuccess(null);
      setIsSpeechListening(false);
    }

    if (isSpeechListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsSpeechListening(false);
    } else {
      setIsSpeechListening(true);
      setSpeechSuccess(null);
      setSpeechTranscript("Listening... speak now! 🎙️");

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsSpeechListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSpeechTranscript(transcript);
          const spokenClean = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
          const wordClean = entry.word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
          
          if (spokenClean.includes(wordClean) || wordClean.includes(spokenClean)) {
            setSpeechSuccess(true);
            playSynthBeep("success");
            speakClientSide(`Sensational pronunciation! You said ${entry.word} perfectly!`);
          } else {
            setSpeechSuccess(false);
            playSynthBeep("error");
            speakClientSide(`I heard you say: "${transcript}". Let's try pronouncing "${entry.word}" again!`);
          }
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech practice error:", event.error);
        setIsSpeechListening(false);
        setSpeechTranscript("Oops! Please tap the microphone and try speaking again.");
      };

      rec.onend = () => {
        setIsSpeechListening(false);
      };

      speechRecognitionRef.current = rec;
      try {
        rec.start();
      } catch (err) {
        console.error("Failed to start speech practice:", err);
        setIsSpeechListening(false);
      }
    }
  };

  // Handle opening directly via syllabus workbook trigger
  useEffect(() => {
    if (initialWordId) {
      const match = VISUAL_DICTIONARY_ENTRIES.find(
        (entry) => entry.id === initialWordId.toLowerCase().trim()
      );
      if (match) {
        setSelectedWord(match);
        setSpellingGameActive(false);
        setSpeechPracticeActive(false);
      }
    }
  }, [initialWordId]);

  // Audio narrator helper
  const narrateWordDetails = (entry: DictionaryEntry) => {
    playClickSound();
    const text = `${entry.word}. Pronounced: ${entry.phonetic}. Definition: ${entry.definition}`;
    speakClientSide(text);
  };

  // Dynamic S.A.M.A.M category helper
  const getDynamicCategory = (entry: DictionaryEntry): string => {
    const lowerWord = entry.word.toLowerCase();
    
    // 1. Fruits
    const fruits = ["apple", "banana", "mango", "orange", "strawberry", "grape", "peach", "pear", "cherry", "fruit", "watermelon", "blueberry", "pineapple"];
    if (fruits.some(f => lowerWord.includes(f))) return "fruits";
    
    // 2. Vegetables
    const veggies = ["carrot", "potato", "tomato", "onion", "broccoli", "spinach", "cabbage", "peas", "vegetable", "lettuce", "garlic", "ginger"];
    if (veggies.some(v => lowerWord.includes(v))) return "vegetables";
    
    // 3. Colors
    const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white", "brown", "gold", "silver"];
    if (colors.some(c => lowerWord === c || lowerWord.includes(c + " color"))) return "colors";
    
    // 4. Numbers
    const numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "zero", "hundred", "thousand"];
    if (numbers.some(n => lowerWord === n)) return "numbers";
    
    // 5. Vehicles
    const vehicles = ["car", "train", "truck", "plane", "helicopter", "ship", "boat", "bicycle", "cycle", "motorcycle", "vehicle", "rocket"];
    if (vehicles.some(vh => lowerWord.includes(vh))) return "vehicles";
    
    // 6. Professions
    const professions = ["doctor", "teacher", "police", "firefighter", "astronaut", "chef", "nurse", "pilot", "painter", "job", "profession", "dentist", "farmer", "engineer"];
    if (professions.some(p => lowerWord.includes(p))) return "professions";
    
    // 7. Food
    const foods = ["pizza", "burger", "cookie", "cake", "bread", "milk", "cheese", "honey", "juice", "sweet", "candy", "ice cream", "pasta", "rice", "sandwich"];
    if (foods.some(fd => lowerWord.includes(fd))) return "food";
    
    // 8. Shapes
    if (entry.category === "shapes" || lowerWord.includes("circle") || lowerWord.includes("square") || lowerWord.includes("triangle") || lowerWord.includes("rectangle") || lowerWord.includes("oval") || lowerWord.includes("star") || lowerWord.includes("pentagon") || lowerWord.includes("hexagon")) {
      return "shapes";
    }
    
    // 9. Animals
    if (entry.category === "animals" || lowerWord.includes("cat") || lowerWord.includes("dog") || lowerWord.includes("lion") || lowerWord.includes("tiger") || lowerWord.includes("cow") || lowerWord.includes("sheep") || lowerWord.includes("bear") || lowerWord.includes("pig")) {
      return "animals";
    }
    
    // 10. Nature
    if (entry.category === "nature" || lowerWord.includes("tree") || lowerWord.includes("flower") || lowerWord.includes("sun") || lowerWord.includes("cloud") || lowerWord.includes("river") || lowerWord.includes("mountain") || lowerWord.includes("grass") || lowerWord.includes("rain") || lowerWord.includes("sky")) {
      return "nature";
    }
    
    // 11. Objects / Everyday
    return "objects";
  };

  // Filter entry items
  const filteredEntries = VISUAL_DICTIONARY_ENTRIES.filter((entry) => {
    const matchesSearch = entry.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const dynCat = getDynamicCategory(entry);
    const matchesCategory = selectedCategory === "all" || dynCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-[#FFFCEE] border-4 border-slate-800 rounded-[36px] w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header Board */}
        <div className="p-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 border-b-4 border-slate-800 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">📔</span>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight">
                My Magical Visual Dictionary
              </h2>
              <p className="text-xs font-bold text-orange-950/80">
                First register the animal or fruit, then read and spell without confusion! 🌈
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              stopAllSpeech();
              onClose();
            }}
            className="p-3 bg-white hover:bg-rose-100 text-slate-800 hover:text-rose-600 rounded-2xl border-2 border-slate-800 hover:border-rose-300 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Search & Category Filter Area */}
        <div className="p-5 bg-amber-50/50 border-b-2 border-amber-100 shrink-0 select-none space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-amber-600 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words (e.g. lion, banana, circle)..."
                className="w-full bg-white border-4 border-amber-200 focus:border-amber-400 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-black text-slate-800 outline-none transition-all placeholder:text-amber-600/40"
              />
              {searchQuery && (
                <button
                  onClick={() => { playClickSound(); setSearchQuery(""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Surprise Me / Random word button */}
            <button
              onClick={() => {
                playPopSound();
                const randomEntry = VISUAL_DICTIONARY_ENTRIES[Math.floor(Math.random() * VISUAL_DICTIONARY_ENTRIES.length)];
                setSelectedWord(randomEntry);
                setSpellingGameActive(false);
                setSpeechPracticeActive(false);
                speakClientSide(`Surprise! Here is a ${randomEntry.word}!`);
              }}
              className="py-3 px-5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-2 border-slate-800 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md shrink-0"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Surprise Me! 🎲</span>
            </button>

            {/* Category Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x shrink-0 max-w-full">
              {(
                [
                  { id: "all", label: "✨ All", emoji: "💎" },
                  { id: "animals", label: "🦁 Animals", emoji: "🦁" },
                  { id: "nature", label: "🌿 Nature", emoji: "🌿" },
                  { id: "food", label: "🍕 Food", emoji: "🍕" },
                  { id: "objects", label: "🧸 Objects", emoji: "🧸" },
                  { id: "shapes", label: "🔴 Shapes", emoji: "🔴" },
                  { id: "colors", label: "🎨 Colors", emoji: "🎨" },
                  { id: "numbers", label: "🔢 Numbers", emoji: "🔢" },
                  { id: "vehicles", label: "🚀 Vehicles", emoji: "🚀" },
                  { id: "professions", label: "👨‍⚕️ Jobs", emoji: "👨‍⚕️" },
                  { id: "fruits", label: "🍎 Fruits", emoji: "🍎" },
                  { id: "vegetables", label: "🥕 Veggies", emoji: "🥕" },
                ] as const
              ).map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playPopSound();
                      setSelectedCategory(cat.id);
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap snap-start border-2 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-500 border-amber-600 text-slate-950 shadow-sm"
                        : "bg-white hover:bg-amber-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master Workspace Split Panel */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* List panel (left column) */}
          {(!isMobile || !selectedWord) && (
            <div className="md:col-span-5 border-r-2 border-amber-100 overflow-y-auto p-5 select-none space-y-3.5 max-h-[50vh] md:max-h-none h-full w-full">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-4xl">🎒</span>
                  <p className="text-sm font-black text-slate-400 italic">No magic words found!</p>
                  <button
                    onClick={() => { playClickSound(); setSearchQuery(""); setSelectedCategory("all"); }}
                    className="px-4 py-2 bg-amber-200 text-amber-950 font-black text-xs rounded-xl hover:bg-amber-300"
                  >
                    Show All Words 🔄
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                  {filteredEntries.map((entry) => {
                    const isSelected = selectedWord?.id === entry.id;
                    return (
                      <motion.button
                        key={entry.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          playPopSound();
                          setSelectedWord(entry);
                          setSpellingGameActive(false);
                          setSpeechPracticeActive(false);
                        }}
                        className={`p-4 rounded-2xl text-left border-4 transition-all cursor-pointer flex items-center justify-between gap-4 w-full group ${
                          isSelected
                            ? `bg-${entry.color}-100 border-${entry.color}-400 ring-4 ring-${entry.color}-200/50 shadow-md`
                            : "bg-white border-amber-200/60 hover:border-amber-300 shadow-xxs"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-4xl group-hover:scale-125 transition-transform inline-block`}>
                            {entry.emoji}
                          </span>
                          <div>
                            <h4 className="font-heading text-base font-black text-slate-800 leading-tight">
                              {entry.word}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-slate-450 uppercase">
                              {entry.phonetic}
                            </span>
                          </div>
                        </div>

                        <span className="bg-slate-100 text-slate-400 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
                          <Volume2 className="w-4 h-4 text-slate-500" />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Details / Interactive game panel (right column) */}
          {(!isMobile || selectedWord) && (
            <div className="md:col-span-7 bg-amber-50/20 overflow-y-auto p-6 flex flex-col justify-between min-h-[40vh] md:min-h-0 h-full w-full">
              <AnimatePresence mode="wait">
                {selectedWord ? (
                  <motion.div
                    key={selectedWord.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-6">
                      {isMobile && (
                        <button
                          onClick={() => {
                            playClickSound();
                            setSelectedWord(null);
                          }}
                          className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm mb-4"
                        >
                          <span>🔙 Back to Word List</span>
                        </button>
                      )}
                    {/* Visual Card Display */}
                    <div className="relative">
                      {/* Standard 1 visual registration frame */}
                      <div className="absolute top-2.5 left-2.5 bg-yellow-400 text-slate-900 border-2 border-slate-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-sm">
                        Visual Registration System
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex gap-1.5 z-10">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-xxs font-black uppercase tracking-wider border-2 ${selectedWord.badgeBg}`}>
                          {selectedWord.category}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-xxs font-black uppercase tracking-wider border-2 ${selectedWord.isLiving ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm" : "bg-sky-100 text-sky-800 border-sky-300 shadow-sm"}`}>
                          {selectedWord.isLiving ? "🌱 Living" : "🧱 Object"}
                        </span>
                      </div>

                      {/* Display beautiful real illustration alongside emoji */}
                      <div className={`p-6 bg-gradient-to-br ${selectedWord.bgGradient} rounded-[32px] border-4 border-slate-800 shadow-lg relative overflow-hidden select-none flex flex-col md:flex-row items-center justify-center gap-6 min-h-[180px]`}>
                        {/* Star dust elements */}
                        <span className="absolute top-4 left-4 text-2xl animate-spin" style={{ animationDuration: "12s" }}>✨</span>
                        <span className="absolute bottom-4 right-4 text-2xl animate-bounce">⭐</span>
                        
                        {/* Real outside image illustration card with real-world caption/credit */}
                        {selectedWord.imageUrl && (
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
                              <img
                                src={selectedWord.imageUrl}
                                alt={selectedWord.word}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1 right-1 bg-slate-900/60 backdrop-blur-xs text-white rounded-md text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                                Real Photo 📸
                              </div>
                            </div>
                            <span className="text-[10px] md:text-xs font-black text-white/95 bg-slate-950/50 backdrop-blur-xs px-2.5 py-1 rounded-xl text-center max-w-[150px] md:max-w-[170px] leading-snug border border-white/25 select-none shadow-xs">
                              {selectedWord.category === "animals" && `Real Animal: Look at its true fur, size, and details! 🦁`}
                              {selectedWord.category === "nature" && `Real Nature: Observe its natural colors and texture! 🌿`}
                              {selectedWord.category === "shapes" && `Real Shape: Spot this geometric shape in our world! 📐`}
                              {selectedWord.category === "everyday" && `Real Object: Recognize its material and daily use! 🏠`}
                            </span>
                          </div>
                        )}

                        {/* HUGE visual anchor representation */}
                        <div className="text-center flex flex-col items-center">
                          <motion.span
                            animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-7xl md:text-8xl drop-shadow-lg cursor-pointer inline-block select-none"
                            onClick={() => {
                              if (selectedWord.hasCustomSound) {
                                playAnimalSFX(selectedWord.id);
                              } else {
                                narrateWordDetails(selectedWord);
                              }
                            }}
                          >
                            {selectedWord.emoji}
                          </motion.span>

                          {/* Visual helper badge */}
                          <p className="mt-3 text-white font-mono font-black text-[10px] uppercase tracking-widest bg-slate-950/25 px-3 py-1 rounded-full select-none">
                            👉 Tap to listen!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Word Title & Phonics spelling split */}
                    <div className="flex items-center justify-between border-b-2 border-amber-100 pb-3">
                      <div>
                        <h3 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 flex items-center gap-2">
                          {selectedWord.word}
                        </h3>
                        <p className="text-xs sm:text-sm font-black text-amber-700 mt-0.5">
                          Sounds like: <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-amber-200">"{selectedWord.phonetic}"</span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {selectedWord.hasCustomSound && (
                          <button
                            onClick={() => playAnimalSFX(selectedWord.id)}
                            className="p-3 bg-yellow-400 hover:bg-yellow-500 border-2 border-slate-800 rounded-2xl font-black text-xs text-slate-900 cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <span>📣 Sound FX</span>
                          </button>
                        )}
                        <button
                          onClick={() => narrateWordDetails(selectedWord)}
                          className="p-3 bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-800 rounded-2xl font-black text-xs text-white cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Narrate</span>
                        </button>
                      </div>
                    </div>

                    {/* Fun kid description */}
                    <div className="bg-white border-2 border-amber-100 rounded-2xl p-4.5 space-y-2 select-none shadow-xxs">
                      <h5 className="text-xs font-black uppercase text-amber-800 tracking-wider">What is it? 💡</h5>
                      <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                        {selectedWord.definition}
                      </p>
                      <div className="pt-2 border-t border-dashed border-amber-100 mt-2">
                        <span className="text-[11px] font-mono font-black text-amber-700/80 uppercase">Example Sentence:</span>
                        <p className="text-xs sm:text-sm font-bold italic text-slate-600 leading-relaxed mt-0.5">
                          "{selectedWord.example}"
                        </p>
                      </div>

                      {/* Living vs Non-Living Educational Guide */}
                      <div className={`mt-3 p-3.5 rounded-xl border-2 flex items-center gap-3 ${selectedWord.isLiving ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-sky-50 border-sky-200 text-sky-950"}`}>
                        <span className="text-2xl shrink-0">{selectedWord.isLiving ? "🌱" : "🧱"}</span>
                        <div>
                          <span className="font-black uppercase tracking-wider block text-[10px] mb-0.5">
                            {selectedWord.isLiving ? "Living Being" : "Everyday Object"}
                          </span>
                          <p className="text-xs font-medium leading-normal opacity-90">
                            {selectedWord.isLiving 
                              ? `${selectedWord.word} is a living thing because it grows, breathes, and is full of life! 💚`
                              : `${selectedWord.word} is a non-living object created or found in our world to help us or make things fun! ⚙️`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fun Fact Section */}
                    <div className="bg-amber-100/40 border-2 border-amber-200/60 rounded-2xl p-4.5 space-y-2 select-none shadow-xxs">
                      <h5 className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                        <span>💡 Did you know? Fun Fact!</span>
                      </h5>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed italic">
                        "{getFunFactForWord(selectedWord)}"
                      </p>
                    </div>

                    {/* S.A.M.A.M Interactive Mini Quiz Card */}
                    <div className="bg-indigo-50 border-4 border-indigo-200 rounded-[24px] p-5 space-y-3.5 select-none shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-800 flex items-center gap-1.5 uppercase tracking-wider">
                          🎯 Quick Brain Quiz!
                        </span>
                        <span className="text-[9px] font-mono font-black bg-indigo-200 text-indigo-800 px-2.5 py-1 rounded-full uppercase">
                          +15 XP Reward
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">
                          {getMiniQuizForWord(selectedWord).question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {getMiniQuizForWord(selectedWord).options.map((opt, idx) => {
                          const isSelected = selectedQuizOption === opt;
                          let optStyle = "bg-white hover:bg-slate-50 text-slate-700 border-slate-200";
                          if (miniQuizAnswered) {
                            if (opt === getMiniQuizForWord(selectedWord).correctAnswer) {
                              optStyle = "bg-emerald-100 text-emerald-800 border-emerald-400";
                            } else if (isSelected) {
                              optStyle = "bg-rose-100 text-rose-800 border-rose-400";
                            } else {
                              optStyle = "bg-white text-slate-400 border-slate-100 opacity-60";
                            }
                          } else if (isSelected) {
                            optStyle = "bg-indigo-100 text-indigo-800 border-indigo-400";
                          }

                          return (
                            <button
                              key={idx}
                              disabled={miniQuizAnswered}
                              onClick={() => {
                                playClickSound();
                                setSelectedQuizOption(opt);
                                setMiniQuizAnswered(true);
                                const isCorr = opt === getMiniQuizForWord(selectedWord).correctAnswer;
                                setMiniQuizCorrect(isCorr);
                                if (isCorr) {
                                  playSynthBeep("success");
                                  speakClientSide("Correct! Fantastic job!");
                                } else {
                                  playSynthBeep("error");
                                  speakClientSide(`Not quite! The correct spelling is ${selectedWord.word}!`);
                                }
                              }}
                              className={`w-full py-3 px-4 rounded-xl text-xs font-black text-left border-2 transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                            >
                              <span>{idx + 1}. {opt}</span>
                              {miniQuizAnswered && opt === getMiniQuizForWord(selectedWord).correctAnswer && (
                                <span className="text-emerald-600 font-bold text-sm">✓ Correct</span>
                              )}
                              {miniQuizAnswered && isSelected && opt !== getMiniQuizForWord(selectedWord).correctAnswer && (
                                <span className="text-rose-600 font-bold text-sm">✕ Try again</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {miniQuizAnswered && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-xxs sm:text-xs font-bold ${miniQuizCorrect ? "text-emerald-700" : "text-slate-500"}`}
                        >
                          {miniQuizCorrect 
                            ? getMiniQuizForWord(selectedWord).explanation
                            : `Oops! The correct spelling of "${selectedWord.word}" is shown in green. Let's memorize it! 🌟`}
                        </motion.p>
                      )}
                    </div>

                    {/* interactive Letter Spelling Board */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <h5 className="text-xs font-black uppercase text-amber-800 tracking-wider">
                          Phonics Spelling Grid 🔠
                        </h5>
                        <span className="text-[10px] font-mono font-bold text-slate-450">Tap letters for phonic sound support</span>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {selectedWord.letters.map((letter, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => speakPhonicSound(letter)}
                            className="h-12 w-12 sm:h-14 sm:w-14 bg-white hover:bg-amber-100 border-4 border-amber-200 rounded-2xl flex flex-col items-center justify-center font-black text-xl text-amber-950 transition-all cursor-pointer shadow-xxs select-none font-heading"
                          >
                            <span>{letter}</span>
                            <span className="text-[8px] font-mono text-amber-500 mt-[-2px] leading-none">🗣️</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Double interactive challenge blocks */}
                    <div className="border-t-2 border-amber-100/60 pt-5 space-y-4">
                      {/* Flex grid for challenge options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Spelling Challenge Button */}
                        <button
                          onClick={() => startSpellingGame(selectedWord)}
                          className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm border-b-4 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                            spellingGameActive
                              ? "bg-emerald-600 text-white border-emerald-800 scale-98"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-emerald-700"
                          }`}
                        >
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>Spelling Challenge ⭐</span>
                        </button>

                        {/* Speech Pronunciation Reading Practice Button */}
                        <button
                          onClick={() => toggleSpeechPractice(selectedWord)}
                          className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm border-b-4 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                            speechPracticeActive
                              ? "bg-indigo-600 text-white border-indigo-800 scale-98"
                              : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-indigo-700"
                          }`}
                        >
                          <Mic className={`w-4 h-4 ${isSpeechListening ? "text-red-400 animate-ping" : ""}`} />
                          <span>Speaking Practice 🗣️</span>
                        </button>
                      </div>

                      {/* Interactive spelling mini-game display */}
                      {spellingGameActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-emerald-50 border-4 border-emerald-200 rounded-3xl p-5 space-y-4 shadow-inner relative"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                              <Star className="w-3.5 h-3.5 fill-emerald-500 stroke-none animate-spin" /> Spelling Quest
                            </span>
                            <button
                              onClick={() => { playClickSound(); setSpellingGameActive(false); }}
                              className="text-xs text-emerald-600 hover:text-emerald-800 font-black cursor-pointer bg-white px-2.5 py-1 border border-emerald-200 rounded-lg"
                            >
                              Exit Quest ✕
                            </button>
                          </div>

                          {/* Progress display */}
                          <div className="flex justify-center gap-3 py-2">
                            {selectedWord.letters.map((letter, i) => {
                              const isFilled = i < spellingProgress.length;
                              return (
                                <div
                                  key={i}
                                  className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-4 flex items-center justify-center text-xl font-heading font-black shadow-xxs transition-all ${
                                    isFilled
                                      ? "bg-emerald-500 border-emerald-400 text-white"
                                      : "bg-white border-dashed border-slate-300 text-slate-300"
                                  }`}
                                >
                                  {isFilled ? letter : "?"}
                                </div>
                              );
                            })}
                          </div>

                          {/* Options to tap */}
                          {!spellingSuccess ? (
                            <div className="space-y-2 text-center pt-2">
                              <p className="text-xxs font-black text-emerald-800 uppercase tracking-widest">
                                Tap the next letter to build the spelling:
                              </p>
                              <div className="flex justify-center gap-2 flex-wrap pt-1">
                                {letterOptions.map((letter, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleSelectLetterOption(letter)}
                                    className="h-11 w-11 bg-white hover:bg-emerald-100 border-2 border-emerald-300 rounded-xl font-black text-lg text-slate-800 cursor-pointer active:scale-90 select-none transition-all"
                                  >
                                    {letter}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: [1, 1.03, 1] }}
                              className="bg-white border-2 border-emerald-300 p-4 rounded-2xl text-center space-y-2 mt-2"
                            >
                              <span className="text-3xl animate-bounce inline-block">🏆✨</span>
                              <h5 className="font-heading text-lg font-black text-emerald-950">Awesome Work Spelling Champion!</h5>
                              <p className="text-xs text-emerald-800 font-bold leading-normal">
                                You correctly spelled <span className="font-black text-sm uppercase">"{selectedWord.word}"</span>! Chiku is extremely proud of you!
                              </p>
                              <button
                                onClick={() => startSpellingGame(selectedWord)}
                                className="mt-2.5 py-1.5 px-3.5 bg-emerald-500 text-white font-black text-xxs rounded-xl border-b-2 border-emerald-700 hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> Play Again
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Interactive Speaking/Pronunciation Practice Display */}
                      {speechPracticeActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-indigo-50 border-4 border-indigo-200 rounded-3xl p-5 space-y-4 shadow-inner relative"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-indigo-800 flex items-center gap-1.5 uppercase tracking-wider">
                              <Star className="w-3.5 h-3.5 fill-indigo-500 stroke-none animate-spin" /> Speech Reading Quest
                            </span>
                            <button
                              onClick={() => {
                                playClickSound();
                                if (speechRecognitionRef.current) {
                                  try { speechRecognitionRef.current.stop(); } catch (e) {}
                                }
                                setSpeechPracticeActive(false);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-black cursor-pointer bg-white px-2.5 py-1 border border-indigo-200 rounded-lg"
                            >
                              Exit Quest ✕
                            </button>
                          </div>

                          <div className="text-center space-y-4">
                            <p className="text-xs font-bold text-indigo-900 leading-normal">
                              Practice speaking clearly! Tap the microphone button, say the word <span className="font-black text-base uppercase text-indigo-700 font-heading">"{selectedWord.word}"</span> aloud, and test your speech accuracy!
                            </p>

                            <div className="flex flex-col items-center justify-center gap-3">
                              {/* Microphone Action Trigger */}
                              <button
                                onClick={() => toggleSpeechPractice(selectedWord)}
                                className={`h-16 w-16 rounded-full flex items-center justify-center border-4 border-indigo-800 shadow-md cursor-pointer transition-all active:scale-90 ${
                                  isSpeechListening
                                    ? "bg-red-500 hover:bg-red-600 animate-pulse text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                              >
                                {isSpeechListening ? (
                                  <Mic className="w-7 h-7 animate-bounce text-white" />
                                ) : (
                                  <Mic className="w-7 h-7 text-white" />
                                )}
                              </button>
                              
                              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                isSpeechListening ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
                              }`}>
                                {isSpeechListening ? "● Listening... Speak Now!" : "Tap Microphone to Speak"}
                              </span>
                            </div>

                            {/* Captured transcript feedback */}
                            {speechTranscript && (
                              <div className="bg-white border-2 border-indigo-100 p-3.5 rounded-2xl max-w-sm mx-auto text-center">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">What I Heard:</span>
                                <p className="text-sm font-black text-slate-800 italic">"{speechTranscript}"</p>
                              </div>
                            )}

                            {/* Success Celebration or Try Again Block */}
                            {speechSuccess !== null && (
                              <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.03, 1] }}
                                className={`p-4 rounded-2xl text-center space-y-2 border-2 ${
                                  speechSuccess
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                                    : "bg-rose-50 border-rose-200 text-rose-950"
                                }`}
                              >
                                {speechSuccess ? (
                                  <>
                                    <span className="text-3xl animate-bounce inline-block">🏆🌟</span>
                                    <h5 className="font-heading text-base font-black">Pronunciation Star Unlocked!</h5>
                                    <p className="text-xs font-bold leading-relaxed">
                                      Unbelievable work! Your voice recognized correctly! You spoke the word <span className="font-black uppercase">"{selectedWord.word}"</span> perfectly and earned a magic learning badge!
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-3xl inline-block">🗣️💡</span>
                                    <h5 className="font-heading text-sm font-black">Keep Practicing!</h5>
                                    <p className="text-xs font-bold leading-normal">
                                      Speech patterns can be tricky! Tap the microphone and say <span className="font-black uppercase">"{selectedWord.word}"</span> again nice and clearly. You can do it!
                                    </p>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* S.A.M.A.M Related Words Navigation */}
                    <div className="bg-slate-50 border-2 border-slate-200/60 rounded-2xl p-4 space-y-2.5 select-none mt-4">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        🔗 Related Words in {getDynamicCategory(selectedWord).toUpperCase()}
                      </h5>
                      <div className="flex gap-2 flex-wrap">
                        {VISUAL_DICTIONARY_ENTRIES
                          .filter(item => getDynamicCategory(item) === getDynamicCategory(selectedWord) && item.id !== selectedWord.id)
                          .slice(0, 3)
                          .map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                playPopSound();
                                setSelectedWord(item);
                                setSpellingGameActive(false);
                                setSpeechPracticeActive(false);
                                speakClientSide(`Switching to related word: ${item.word}!`);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xxs active:scale-95"
                            >
                              <span>{item.emoji}</span>
                              <span className="font-heading font-black">{item.word}</span>
                              <span className="text-[9px] text-slate-400 font-bold">➔</span>
                            </button>
                          ))}
                        {VISUAL_DICTIONARY_ENTRIES
                          .filter(item => getDynamicCategory(item) === getDynamicCategory(selectedWord) && item.id !== selectedWord.id)
                          .length === 0 && (
                          <span className="text-[10px] font-bold text-slate-400 italic">No other words in this category yet!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 text-center select-none">
                    <p className="text-[10px] font-bold text-slate-400">
                      Standard 1 Interactive Word Dictionary · Verified content
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-10 space-y-4 select-none">
                  <span className="text-7xl animate-pulse">📚🌟</span>
                  <div>
                    <h4 className="font-heading text-2xl font-black text-slate-800">
                      Vocabulary Card Explorer
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-sm leading-relaxed mt-1">
                      Tap any magic word card on the left panel to display high-quality visual representations, phonics pronunciation rules, fun examples, and spelling games!
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
