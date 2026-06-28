import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, Volume2, VolumeX, RefreshCw, X, Mic, MicOff } from "lucide-react";
import { ChatMessage, BuddyCharacter } from "../types";
import { speakPremium, stopAllSpeech, playClickSound, playPopSound, speakClientSide, setGlobalSpeechRate, getGlobalSpeechRate } from "../utils/audio";

const BUDDY_CHARACTERS: BuddyCharacter[] = [
  {
    id: "chiku",
    name: "Chiku the Monkey",
    emoji: "🐵",
    role: "Jungle Guide",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    voiceName: "Fenrir",
    greeting: "Hurrah! I'm Chiku! 🐵 Let's count some yellow bananas or go on a jungle treasure hunt together! Ask me anything!",
  },
  {
    id: "kiki",
    name: "Kiki the Parrot",
    emoji: "🦜",
    role: "Word Detective",
    color: "text-pink-600 bg-pink-50 border-pink-200",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-300",
    voiceName: "Kore",
    greeting: "Chirp chirp! 🦜 I'm Kiki! I know 500 words and love to rhyme. Tell me a word, and let's spell something fun! 📖",
  },
  {
    id: "robo",
    name: "Robo the Robot",
    emoji: "🤖",
    role: "Shape Solver",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    voiceName: "Puck",
    greeting: "Bleep bloop! 🤖 I am Robo, your metallic helper. I love shapes, numbers, and digital riddles. What pattern shall we solve?",
  },
  {
    id: "maya",
    name: "Maya the Explorer",
    emoji: "🧭",
    role: "Nature Explorer",
    color: "text-teal-600 bg-teal-50 border-teal-200",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-300",
    voiceName: "Zephyr",
    greeting: "Hi adventurer! 🧭 I'm Maya. I've explored deep jungles and high mountains. Ready to discover plants, body senses, and the weather?",
  },
];

const PRESET_QUESTIONS: Record<string, string[]> = {
  chiku: [
    "🐵 Tell me a funny monkey joke!",
    "🍌 Can you help me count to ten?",
    "🌳 Why do monkeys love swinging on trees?",
  ],
  kiki: [
    "🦜 Can you make a rhyme with CAT?",
    "🔤 What is a word that starts with letter S?",
    "📖 Can you teach me a new word today?",
  ],
  robo: [
    "🤖 What is your favorite shape?",
    "🧩 Teach me a simple pattern code!",
    "⚡ How do robots charge their batteries?",
  ],
  maya: [
    "🧭 What does a tiny seed need to grow?",
    "🦁 Tell me about wild animals in the jungle!",
    "☀️ Why is the sun so bright and warm?",
  ],
};

export default function AIBuddy({ onClose, hasGeminiKey }: { onClose?: () => void; hasGeminiKey?: boolean }) {
  const [speechRate, setSpeechRate] = useState<number>(() => {
    return getGlobalSpeechRate();
  });
  const [activeBuddy, setActiveBuddy] = useState<BuddyCharacter>(BUDDY_CHARACTERS[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    chiku: [
      { id: "g1", role: "assistant", text: BUDDY_CHARACTERS[0].greeting, timestamp: new Date().toLocaleTimeString() }
    ],
    kiki: [
      { id: "g2", role: "assistant", text: BUDDY_CHARACTERS[1].greeting, timestamp: new Date().toLocaleTimeString() }
    ],
    robo: [
      { id: "g3", role: "assistant", text: BUDDY_CHARACTERS[2].greeting, timestamp: new Date().toLocaleTimeString() }
    ],
    maya: [
      { id: "g4", role: "assistant", text: BUDDY_CHARACTERS[3].greeting, timestamp: new Date().toLocaleTimeString() }
    ],
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleSpeechInput = () => {
    playClickSound();
    if (!recognitionRef.current) {
      speakClientSide("Voice recognition is not supported in this browser. Try Chrome or Safari!");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeBuddy]);

  useEffect(() => {
    const handleRateChange = () => {
      setSpeechRate(getGlobalSpeechRate());
    };
    window.addEventListener("samam_speech_rate_changed", handleRateChange);
    return () => window.removeEventListener("samam_speech_rate_changed", handleRateChange);
  }, []);

  const activeHistory = messages[activeBuddy.id] || [];

  const handleBuddyChange = (buddy: BuddyCharacter) => {
    stopAllSpeech();
    playPopSound();
    setIsAudioPlaying(false);
    setActiveBuddy(buddy);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    playClickSound();
    stopAllSpeech();
    setIsAudioPlaying(false);

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeBuddy.id]: [...(prev[activeBuddy.id] || []), userMsg],
    }));
    setInputValue("");
    setIsLoading(true);

    try {
      // Map previous messages to structured history for the endpoint
      const chatHistory = (messages[activeBuddy.id] || [])
        .slice(-6) // Keep last 6 exchanges to avoid token bloat
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: activeBuddy.id,
          message: text,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat api failed");
      }

      const data = await res.json();
      const botText = data.text || "Bleep bloop! Something went wrong.";

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: botText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeBuddy.id]: [...(prev[activeBuddy.id] || []), botMsg],
      }));

      // Auto play premium voice synthesis!
      speakPremium(
        botText,
        activeBuddy.id,
        () => setIsAudioPlaying(true),
        () => setIsAudioPlaying(false)
      );
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: `Oh no, my antenna lost signal! 🔌 Let's try again!`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeBuddy.id]: [...(prev[activeBuddy.id] || []), errMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (text: string) => {
    playClickSound();
    if (isAudioPlaying) {
      stopAllSpeech();
      setIsAudioPlaying(false);
    } else {
      speakPremium(
        text,
        activeBuddy.id,
        () => setIsAudioPlaying(true),
        () => setIsAudioPlaying(false)
      );
    }
  };

  const handleResetChat = () => {
    stopAllSpeech();
    setIsAudioPlaying(false);
    setMessages((prev) => ({
      ...prev,
      [activeBuddy.id]: [
        { id: Math.random().toString(), role: "assistant", text: activeBuddy.greeting, timestamp: new Date().toLocaleTimeString() }
      ],
    }));
  };

  return (
    <div id="ai-buddy-chat-box" className="bg-white flex flex-col h-full w-full">
      {/* Header */}
      <div className={`p-4 ${activeBuddy.bgColor} border-b-4 ${activeBuddy.borderColor} flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-2.5">
          <span className="text-4xl animate-bounce select-none">{activeBuddy.emoji}</span>
          <div>
            <h4 className="font-heading text-base sm:text-lg font-black text-slate-800 flex items-center gap-1">
              {activeBuddy.name} <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 uppercase tracking-wide">
                {activeBuddy.role}
              </span>
              {hasGeminiKey ? (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-500 text-white animate-pulse uppercase tracking-wide flex items-center gap-0.5">
                  ✨ Gemini
                </span>
              ) : (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-400 text-white uppercase tracking-wide">
                  🔌 Native
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playClickSound();
              const rates = [0.72, 0.58, 0.9];
              const currentIndex = rates.indexOf(speechRate);
              const nextIndex = (currentIndex + 1) % rates.length;
              const nextRate = rates[nextIndex];
              setGlobalSpeechRate(nextRate);
              
              let speedLabel = "Slow Speed 🐌";
              if (nextRate === 0.58) speedLabel = "Super Slow Speed 🐢";
              if (nextRate === 0.9) speedLabel = "Normal Speed 👤";
              
              speakClientSide(`Speed is now ${speedLabel}!`);
            }}
            title="Change speaking speed"
            className="px-2.5 py-1.5 bg-white hover:bg-orange-50 rounded-xl text-xs font-black text-slate-700 hover:text-orange-600 border-2 border-slate-200 hover:border-orange-200 transition-all shadow-sm flex items-center gap-1 cursor-pointer select-none"
          >
            <span>{speechRate === 0.72 ? "🐌" : speechRate === 0.58 ? "🐢" : "👤"}</span>
            <span className="text-[10px] hidden sm:inline">
              {speechRate === 0.72 ? "Slow" : speechRate === 0.58 ? "Slower" : "Normal"}
            </span>
          </button>

          <button
            onClick={handleResetChat}
            title="Reset Conversation"
            className="p-2 bg-white hover:bg-orange-50 rounded-xl text-slate-500 hover:text-orange-600 transition-all border-2 border-slate-200 hover:border-orange-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              title="Close Companion Panel"
              className="p-2 bg-white hover:bg-rose-50 rounded-xl text-slate-500 hover:text-rose-600 transition-all border-2 border-slate-200 hover:border-rose-200 shadow-sm cursor-pointer"
            >
              <X className="w-4 h-4 text-rose-500" />
            </button>
          )}
        </div>
      </div>

      {/* Characters Picker Row */}
      <div className="flex gap-2 p-3 bg-slate-50 border-b-2 border-slate-100 overflow-x-auto select-none">
        {BUDDY_CHARACTERS.map((buddy) => {
          const isSelected = activeBuddy.id === buddy.id;
          return (
            <button
              key={buddy.id}
              onClick={() => handleBuddyChange(buddy)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all border-2 shrink-0 ${
                isSelected
                  ? "bg-white text-slate-800 shadow-sm border-orange-400 border-b-4 border-b-orange-600"
                  : "bg-white hover:bg-slate-100 text-slate-500 border-slate-200 border-b-4 border-b-slate-300"
              }`}
            >
              <span>{buddy.emoji}</span>
              <span>{buddy.id.charAt(0).toUpperCase() + buddy.id.slice(1)}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FFFBEB]/20 space-y-4">
        {activeHistory.map((msg) => {
          const isMe = msg.role === "user";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-[24px] p-4 shadow-md text-sm leading-relaxed relative border-4 ${
                isMe
                  ? "bg-indigo-600 text-white rounded-tr-none border-indigo-800"
                  : "bg-white text-slate-800 border-orange-200 rounded-tl-none shadow-sm"
              }`}>
                <p className="font-bold whitespace-pre-wrap">{msg.text}</p>
                
                <div className={`flex items-center justify-between gap-4 mt-2 pt-2 border-t ${
                  isMe ? "border-white/10" : "border-slate-100"
                }`}>
                  <span className={`text-[9px] font-black ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                  {!isMe && (
                    <button
                      onClick={() => handleSpeakMessage(msg.text)}
                      className="p-1 hover:bg-orange-50 rounded-full text-slate-400 hover:text-orange-500 transition-all border border-transparent hover:border-orange-100"
                      title="Read Aloud"
                    >
                      {isAudioPlaying ? (
                        <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border-2 border-orange-100 rounded-[24px] rounded-tl-none p-4 shadow-sm max-w-[80%] flex items-center gap-3">
              <span className="text-2xl animate-spin">🌀</span>
              <p className="text-xs font-black text-orange-600 italic">
                {activeBuddy.id === "chiku" && "Chiku is swinging on vines to get your answer... 🍌"}
                {activeBuddy.id === "kiki" && "Kiki is flying over word trees... 🦜"}
                {activeBuddy.id === "robo" && "Robo is computing pattern formulas... 🤖"}
                {activeBuddy.id === "maya" && "Maya is looking at her ancient compass... 🧭"}
              </p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Presets Section */}
      <div className="p-2 border-t-2 border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto whitespace-nowrap select-none">
        {PRESET_QUESTIONS[activeBuddy.id].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="inline-block bg-white hover:bg-orange-50/50 border-2 border-slate-200 hover:border-orange-300 text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-2xl text-xs font-black cursor-pointer transition-all shadow-sm border-b-4 border-b-slate-300 shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Text Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t-4 border-orange-100 bg-white flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder={isListening ? "Listening... Speak clearly! 🎤" : `Speak with ${activeBuddy.id.charAt(0).toUpperCase() + activeBuddy.id.slice(1)}...`}
          className="flex-1 bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition-all"
        />
        <button
          type="button"
          onClick={toggleSpeechInput}
          disabled={isLoading}
          className={`p-3 rounded-2xl border-b-4 transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white border-red-700 animate-pulse"
              : "bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-700"
          }`}
          title={isListening ? "Stop listening" : "Voice Input (Speech-to-text)"}
        >
          {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 text-white p-3 rounded-2xl transition-all cursor-pointer shadow-md border-b-4 border-orange-700"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
}
