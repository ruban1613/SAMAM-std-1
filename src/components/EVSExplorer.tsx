import { useState } from "react";
import { Play, RotateCcw, Trophy, Check, ArrowRight } from "lucide-react";
import { StudentProgress } from "../types";
import { playSynthBeep } from "./SpeedGridGame";
import { playAnimalSFX, playPageTurnSound, speakClientSide, playClickSound } from "../utils/audio";

interface EVSExplorerProps {
  progress: StudentProgress;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
}

interface MatchItem {
  id: string;
  name: string;
  emoji: string;
  target: string;
}

const HABITATS = [
  { id: "farm", title: "Farm & Home 🏡", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "jungle", title: "Deep Jungle 🌳", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

const ANIMAL_ITEMS: MatchItem[] = [
  { id: "cow", name: "Cow", emoji: "🐄", target: "farm" },
  { id: "lion", name: "Lion", emoji: "🦁", target: "jungle" },
  { id: "sheep", name: "Sheep", emoji: "🐑", target: "farm" },
  { id: "elephant", name: "Elephant", emoji: "🐘", target: "jungle" },
  { id: "pig", name: "Pig", emoji: "🐷", target: "farm" },
  { id: "monkey", name: "Monkey", emoji: "🐵", target: "jungle" },
];

export default function EVSExplorer({ progress, onUpdateProgress }: EVSExplorerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<"senses" | "animals" | "done">("senses");
  
  // Sense Level State
  const [selectedSense, setSelectedSense] = useState<string | null>(null);
  const [senseMatches, setSenseMatches] = useState<Record<string, string>>({}); // senseId -> funcId
  
  // Animal Level State
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [animalMatches, setAnimalMatches] = useState<Record<string, string>>({}); // animalId -> habitatId

  const senses = [
    { id: "eyes", name: "Eyes 👁️", emoji: "👁️", description: "Seeing colors & butterflies" },
    { id: "ears", name: "Ears 👂", emoji: "👂", description: "Hearing bird songs" },
    { id: "nose", name: "Nose 👃", emoji: "👃", description: "Smelling pretty flowers" },
    { id: "tongue", name: "Tongue 👅", emoji: "👅", description: "Tasting sweet apples" },
    { id: "hands", name: "Hands ✋", emoji: "✋", description: "Touching soft bunnies" },
  ];

  const functions = [
    { id: "ears", text: "🎵 Hear sweet bird songs!" },
    { id: "eyes", text: "🦋 See colorful butterflies!" },
    { id: "hands", text: "🐰 Touch a soft furry bunny!" },
    { id: "tongue", text: "🍎 Taste a sweet red apple!" },
    { id: "nose", text: "🌹 Smell a beautiful rose!" },
  ];

  const handleStartGame = () => {
    playPageTurnSound();
    speakClientSide("Let's explore nature!");
    setIsPlaying(true);
    setCurrentLevel("senses");
    setSelectedSense(null);
    setSenseMatches({});
    setSelectedAnimal(null);
    setAnimalMatches({});
  };

  // Sense level logic
  const handleSenseClick = (senseId: string) => {
    if (senseMatches[senseId]) return;
    playClickSound();
    setSelectedSense(senseId);
    
    const senseObj = senses.find((s) => s.id === senseId);
    if (senseObj) {
      speakClientSide(senseObj.name);
    }
  };

  const handleFunctionClick = (funcId: string) => {
    if (!selectedSense) return;

    if (selectedSense === funcId) {
      playSynthBeep("success");
      const senseObj = senses.find((s) => s.id === funcId);
      speakClientSide(`Perfect! Senses at work!`);
      setSenseMatches((prev) => ({ ...prev, [selectedSense]: funcId }));
      setSelectedSense(null);
    } else {
      playSynthBeep("error");
      speakClientSide("Try matching another one!");
      setSelectedSense(null);
    }
  };

  const checkSensesComplete = () => {
    return Object.keys(senseMatches).length === senses.length;
  };

  const handleGoToAnimals = () => {
    playPageTurnSound();
    speakClientSide("Mission two! Help the animal buddies find their cozy homes!");
    setCurrentLevel("animals");
  };

  // Animal level logic
  const handleAnimalClick = (animalId: string) => {
    if (animalMatches[animalId]) return;
    setSelectedAnimal(animalId);
    
    const animal = ANIMAL_ITEMS.find((a) => a.id === animalId);
    if (animal) {
      playAnimalSFX(animal.name);
    }
  };

  const handleHabitatClick = (habitatId: string) => {
    if (!selectedAnimal) return;

    const animal = ANIMAL_ITEMS.find((a) => a.id === selectedAnimal);
    if (animal && animal.target === habitatId) {
      playSynthBeep("success");
      
      const homeName = habitatId === "farm" ? "Farm" : "Jungle";
      speakClientSide(`Yes! The ${animal.name} belongs in the ${homeName}!`);
      
      setAnimalMatches((prev) => ({ ...prev, [selectedAnimal]: habitatId }));
      setSelectedAnimal(null);

      // Check if complete
      if (Object.keys(animalMatches).length + 1 === ANIMAL_ITEMS.length) {
        setTimeout(() => {
          playSynthBeep("complete");
          speakClientSide("Sensational job! You are a certified Nature Explorer!");
          setCurrentLevel("done");
          setIsPlaying(false);

          // Save EVS Badge
          onUpdateProgress((prev) => {
            const hasBadge = prev.badgesEarned.some((b) => b.id === "evs-explorer");
            const badges = [...prev.badgesEarned];
            if (!hasBadge) {
              badges.push({
                id: "evs-explorer",
                title: "Nature Explorer 🌿",
                icon: "🔭",
                unlockedAt: new Date().toLocaleDateString(),
                subject: "evs",
              });
            }
            return {
              ...prev,
              badgesEarned: badges,
            };
          });
        }, 800);
      }
    } else {
      playSynthBeep("error");
      speakClientSide("Oops! That is not their natural home. Try again!");
      setSelectedAnimal(null);
    }
  };

  return (
    <div id="evs-explorer-game-box" className="bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 uppercase tracking-wider mb-2">
            🧭 Maya's Discovery Game
          </span>
          <h3 className="font-heading text-2xl font-bold text-slate-800 flex items-center gap-2">
            🔭 Nature Explorer's Log
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Let's match body senses and help animals find their cozy natural homes!
          </p>
        </div>
      </div>

      {!isPlaying && currentLevel !== "done" ? (
        <div className="text-center py-12 px-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="text-5xl mb-4">🧭🦁👁️</div>
          <h4 className="font-bold text-lg text-slate-800">Ready to Explore Nature?</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mt-2 mb-6">
            Help Maya solve discovery missions, understand senses, and map out animals.
          </p>

          <button
            onClick={handleStartGame}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-base font-black px-8 py-3.5 rounded-2xl shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            START EXPLORATION!
          </button>
        </div>
      ) : currentLevel === "done" ? (
        <div className="text-center py-12 px-6 bg-teal-50 rounded-xl border-2 border-teal-100">
          <div className="text-6xl mb-4 animate-pulse">🌳🔭✨</div>
          <h4 className="font-heading text-2xl font-black text-teal-800">Super Discovery Champion!</h4>
          <p className="text-sm text-teal-700 mt-1">
            You matched all sensory organs and sent our animal buddies back to their perfect homes!
          </p>

          <div className="my-6 bg-white rounded-2xl p-4 inline-block shadow-sm border border-teal-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Awarded Badge</span>
            <span className="text-3xl font-black text-teal-600">Nature Explorer 🧭🌿</span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                handleStartGame();
              }}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-black px-6 py-3 rounded-xl shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => {
                playClickSound();
                setCurrentLevel("senses");
              }}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      ) : currentLevel === "senses" ? (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-4">
            <span>MISSION 1: SENSORY MAPPING 🌟</span>
            <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Level 1/2</span>
          </div>

          <p className="text-sm text-slate-600 mb-6 text-center italic">
            Click on a <strong className="text-teal-600">body sense</strong>, then click on the <strong className="text-teal-600">correct function description</strong> to match them!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Senses left column */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">Sense Organs</span>
              {senses.map((sense) => {
                const isMatched = !!senseMatches[sense.id];
                const isSelected = selectedSense === sense.id;
                return (
                  <button
                    key={sense.id}
                    onClick={() => handleSenseClick(sense.id)}
                    disabled={isMatched}
                    className={`p-4 rounded-xl font-bold flex items-center gap-3 border text-left transition-all ${
                      isMatched
                        ? "bg-emerald-50 text-emerald-500 border-emerald-200 cursor-not-allowed"
                        : isSelected
                        ? "bg-teal-500 text-white border-teal-600 scale-102 ring-2 ring-teal-300"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <span className="text-2xl">{sense.emoji}</span>
                    <span>{sense.name}</span>
                    {isMatched && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Functions right column */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">Senses at Work</span>
              {functions.map((func) => {
                const isMatched = Object.values(senseMatches).includes(func.id);
                return (
                  <button
                    key={func.id}
                    onClick={() => handleFunctionClick(func.id)}
                    disabled={isMatched}
                    className={`p-4 rounded-xl font-semibold border text-left text-sm transition-all h-15 flex items-center ${
                      isMatched
                        ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                        : selectedSense
                        ? "bg-white text-slate-700 border-teal-300 hover:bg-teal-50 hover:border-teal-400 cursor-pointer shadow-sm animate-pulse"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <span>{func.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {checkSensesComplete() && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  playClickSound();
                  handleGoToAnimals();
                }}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-black px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Go to Mission 2 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-4">
            <span>MISSION 2: ANIMAL HABITAT SORTING 🐾</span>
            <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Level 2/2</span>
          </div>

          <p className="text-sm text-slate-600 mb-6 text-center italic">
            Click an <strong className="text-teal-600">animal</strong>, then click its <strong className="text-teal-600">natural habitat home</strong>!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Animals list */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">Animals</span>
              <div className="grid grid-cols-2 gap-3">
                {ANIMAL_ITEMS.map((animal) => {
                  const isMatched = !!animalMatches[animal.id];
                  const isSelected = selectedAnimal === animal.id;
                  return (
                    <button
                      key={animal.id}
                      onClick={() => handleAnimalClick(animal.id)}
                      disabled={isMatched}
                      className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all ${
                        isMatched
                          ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                          : isSelected
                          ? "bg-teal-500 text-white border-teal-600 scale-102 ring-2 ring-teal-300"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
                      }`}
                    >
                      <span className="text-4xl">{animal.emoji}</span>
                      <span className="text-xs">{animal.name}</span>
                      {isMatched && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1">Homed!</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Habitats sorting zones */}
            <div className="flex flex-col gap-6 justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">Habitat Homes</span>
              {HABITATS.map((habitat) => {
                // Find animals in this habitat
                const nestedAnimals = ANIMAL_ITEMS.filter(
                  (a) => animalMatches[a.id] === habitat.id
                );
                return (
                  <button
                    key={habitat.id}
                    onClick={() => handleHabitatClick(habitat.id)}
                    className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all min-h-36 ${
                      selectedAnimal
                        ? "bg-teal-50/50 border-teal-400 cursor-pointer shadow animate-pulse"
                        : "bg-white border-slate-200 cursor-default"
                    }`}
                  >
                    <span className="font-black text-base text-slate-800">{habitat.title}</span>
                    <div className="flex gap-2 flex-wrap justify-center min-h-12 items-center">
                      {nestedAnimals.length === 0 ? (
                        <span className="text-xs text-slate-400 font-semibold italic">Place animals here...</span>
                      ) : (
                        nestedAnimals.map((animal) => (
                          <span
                            key={animal.id}
                            className="text-3xl bg-slate-50 border border-slate-200 rounded-xl w-12 h-12 flex items-center justify-center shadow-xs"
                            title={animal.name}
                          >
                            {animal.emoji}
                          </span>
                        ))
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
