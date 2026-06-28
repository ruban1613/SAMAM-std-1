import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCw, Trophy, Volume2, Star, CheckCircle2, ChevronLeft, Award } from "lucide-react";
import { StudentProgress, SubjectType } from "../types";
import { getCurriculumForStandard } from "../data/curriculum";
import { speakClientSide, stopAllSpeech, playClickSound, playPopSound, playPageTurnSound, playOptionSound } from "../utils/audio";
import { playSynthBeep } from "./SpeedGridGame";
import { motion, AnimatePresence } from "motion/react";

interface PlayZoneProps {
  progress: StudentProgress;
  onUpdateProgress: (updater: (prev: StudentProgress) => StudentProgress) => void;
  currentStudent?: any;
}

interface GameConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  skills: string[];
  gameplayType: "grid" | "sort" | "input" | "tap_timer" | "canvas" | "story" | "match";
}

// 10 Distinct Game Ideas for each of the 5 subjects
const SUBJECT_GAMES: Record<SubjectType, GameConfig[]> = {
  math: [
    { id: "math-g1", name: "Speed Grid Race 🏎️", emoji: "🔢", description: "Tap the numbers in order from 1 to 9 as fast as you can!", skills: ["Number Ordering", "Focus"], gameplayType: "grid" },
    { id: "math-g2", name: "Banana Counting Safari 🐵", emoji: "🍌", description: "Help Chiku count bananas! Tap the correct count card.", skills: ["Counting 1-10", "Counting"], gameplayType: "match" },
    { id: "math-g3", name: "Size Scale Balancer ⚖️", emoji: "🐘", description: "Tap the heavier, taller, or larger object on the scale!", skills: ["Comparison", "Sizes"], gameplayType: "match" },
    { id: "math-g4", name: "Space Jump 11-20 🚀", emoji: "🤖", description: "Hop on numbers in sequence to help Robo charge his spaceship!", skills: ["Numbers 11-20", "Sequencing"], gameplayType: "grid" },
    { id: "math-g5", name: "Maya's Gold Coin Sums 🪙", emoji: "➕", description: "Solve the treasure sum by adding gold coins together!", skills: ["Addition", "Arithmetic"], gameplayType: "input" },
    { id: "math-g6", name: "Kiki's Berry Subtraction 🍓", emoji: "➖", description: "Erase or take away berries to find out how many remain!", skills: ["Subtraction", "Problem Solving"], gameplayType: "match" },
    { id: "math-g7", name: "Shape Match Arena 🔵", emoji: "🔺", description: "Match standard everyday objects with their 2D geometric shape!", skills: ["Shapes", "Visual Match"], gameplayType: "match" },
    { id: "math-g8", name: "Pattern Train Conductor 🚂", emoji: "🔁", description: "Crack the secret repeating emoji pattern to let the train pass!", skills: ["Pattern Logic", "Sequences"], gameplayType: "match" },
    { id: "math-g9", name: "Height Block Sorter 🪜", emoji: "🧱", description: "Sort colorful blocks from shortest to tallest!", skills: ["Measurement", "Sorting"], gameplayType: "sort" },
    { id: "math-g10", name: "Math Treasure Decoder 🗺️", emoji: "🔑", description: "Solve three math equations in a row to open the golden chest!", skills: ["Equation Decoding", "Mental Math"], gameplayType: "input" },
  ],
  lang: [
    { id: "lang-g1", name: "Letter Sound Phonics 🔤", emoji: "🍎", description: "Listen to Kiki's audio and choose the correct starting phonics letter!", skills: ["Phonics", "Letter Sounds"], gameplayType: "match" },
    { id: "lang-g2", name: "Word Builder Blocks 🏷️", emoji: "🧱", description: "Drag or tap letter blocks in order to spell three-letter words!", skills: ["Spelling", "CVC Words"], gameplayType: "grid" },
    { id: "lang-g3", name: "Rhyming Bubble Popper 🧼", emoji: "🫧", description: "Pop only the bubbles containing words that rhyme with the target word!", skills: ["Rhyming Sounds", "Phonetics"], gameplayType: "match" },
    { id: "lang-g4", name: "Word Train Conductor 🚂", emoji: "📝", description: "Arrange jumbled words in the correct order to build a simple sentence!", skills: ["Grammar", "Sentence Structure"], gameplayType: "sort" },
    { id: "lang-g5", name: "Word Search Jungle 🌴", emoji: "🔍", description: "Find three vocabulary words hidden in the letter grid!", skills: ["Word Search", "Vocabulary"], gameplayType: "grid" },
    { id: "lang-g6", name: "Alphabet Dot-to-Dot 🎨", emoji: "✏️", description: "Connect alphabets A to J in order to reveal Chiku's cute drawings!", skills: ["Alphabet Order", "Hand-Eye coordination"], gameplayType: "grid" },
    { id: "lang-g7", name: "Opposite Card Matcher 🌗", emoji: "🃏", description: "Flip card tiles to find and match word opposites (e.g., Hot & Cold)!", skills: ["Vocabulary", "Antonyms"], gameplayType: "match" },
    { id: "lang-g8", name: "Vowel Balloon Catch 🎈", emoji: "☁️", description: "Tap and catch only the balloons containing vowels (A, E, I, O, U)!", skills: ["Vowels", "Quick Reflexes"], gameplayType: "tap_timer" },
    { id: "lang-g9", name: "Sight Word Speed Run 🏃", emoji: "📣", description: "Tap the correct sight word as fast as possible when called out!", skills: ["Sight Reading", "Focus"], gameplayType: "match" },
    { id: "lang-g10", name: "Spellbook Scramble 🪄", emoji: "📖", description: "Unscramble letters to complete Kiki's secret spellbook words!", skills: ["Spelling", "Word Puzzles"], gameplayType: "input" },
  ],
  evs: [
    { id: "evs-g1", name: "My Body Parts Labeler 👤", emoji: "👃", description: "Identify and tap the correct body parts on Chiku's interactive avatar!", skills: ["Human Body", "Biology"], gameplayType: "match" },
    { id: "evs-g2", name: "Jungle Sound Safari 🐯", emoji: "🔊", description: "Listen to the animal calls and tap the correct animal picture!", skills: ["Animals", "Auditory skills"], gameplayType: "match" },
    { id: "evs-g3", name: "Plant Growth Care 🌱", emoji: "☀️", description: "Give seeds sunlight and water to watch them sprout roots and leaves!", skills: ["Plant Cycle", "Botany"], gameplayType: "tap_timer" },
    { id: "evs-g4", name: "Healthy Basket Sorter 🥦", emoji: "🧺", description: "Sort nutritious fruits and vegetables away from junk treats!", skills: ["Nutrition", "Healthy Habits"], gameplayType: "sort" },
    { id: "evs-g5", name: "Five Senses Matcher 🧠", emoji: "👅", description: "Match our 5 senses with items (e.g. eyes with rainbow, tongue with lemon)!", skills: ["Sensory Organs", "Observation"], gameplayType: "match" },
    { id: "evs-g6", name: "Day & Night Sorter ☀️", emoji: "🌙", description: "Classify daily tasks into daytime sunshine or bedtime moon activities!", skills: ["Time cycles", "Habits"], gameplayType: "sort" },
    { id: "evs-g7", name: "Animal Habitat Sorter 🌳", emoji: "🐳", description: "Sort animals into their correct homes: Land, Ocean, or Sky!", skills: ["Habitats", "Zoology"], gameplayType: "sort" },
    { id: "evs-g8", name: "Weather Dress-Up 🧣", emoji: "🌦️", description: "Dress Chiku up in warm boots, raincoats, or sun hats for the day!", skills: ["Seasons & Weather", "Practical Life"], gameplayType: "match" },
    { id: "evs-g9", name: "Living or Non-Living? 🧱", emoji: "🌲", description: "Classify growing, breathing things separate from static toys and stones!", skills: ["Living Things", "Natural Science"], gameplayType: "sort" },
    { id: "evs-g10", name: "Forest Cleanup Guard ♻️", emoji: "🗑️", description: "Help Maya clean up by sorting plastic bottles, paper, and fruit peels!", skills: ["Environment", "Recycling"], gameplayType: "sort" },
  ],
  art: [
    { id: "art-g1", name: "Magic Color Mixer 🧪", emoji: "🎨", description: "Combine two primary colors to magically invent brand new secondary colors!", skills: ["Color Mixing", "Art Theory"], gameplayType: "match" },
    { id: "art-g2", name: "Pattern Painter Palette 🧱", emoji: "🖌️", description: "Tap the gray tiles to paint a beautiful, repeating color pattern!", skills: ["Symmetry", "Sequences"], gameplayType: "grid" },
    { id: "art-g3", name: "Pixel Art Mirror 🪞", emoji: "👾", description: "Copy color blocks on the right side to reflect the pixel pattern on the left!", skills: ["Symmetry", "Fractions"], gameplayType: "grid" },
    { id: "art-g4", name: "Doodle Guess Board 👨‍🎨", emoji: "🤫", description: "Guess what mascot drawing is emerging based on minimal outlines!", skills: ["Creative Guessing", "Shapes"], gameplayType: "match" },
    { id: "art-g5", name: "Rainbow Canvas Board 🌈", emoji: "📝", description: "Doodle freely with brush sizes, colors, magic stamps, and a blank page!", skills: ["Free Drawing", "Motor Skills"], gameplayType: "canvas" },
    { id: "art-g6", name: "Color Swatch Matcher 🎨", emoji: "✨", description: "Find the exact match for different shades of beautiful pastel colors!", skills: ["Visual Spectrum", "Observation"], gameplayType: "match" },
    { id: "art-g7", name: "Silhouette Shadow Match 🧸", emoji: "👥", description: "Connect lovely jungle toys with their dark, mysterious shadows!", skills: ["Silhouette Match", "Visual perception"], gameplayType: "match" },
    { id: "art-g8", name: "Sticker Book Safari 🦁", emoji: "🐘", description: "Drag and place cute animals, clouds, and trees onto Chiku's forest background!", skills: ["Canvas Collage", "Composition"], gameplayType: "canvas" },
    { id: "art-g9", name: "Mosaic Grid Copy 📐", emoji: "🟧", description: "Replicate a geometric mosaic puzzle block-for-block!", skills: ["Grid Translation", "Focus"], gameplayType: "grid" },
    { id: "art-g10", name: "Origami Paper Folds 🕊️", emoji: "📄", description: "Follow simple folding guide paths to craft virtual animal origami!", skills: ["Origami", "Following Guides"], gameplayType: "match" },
  ],
  life: [
    { id: "life-g1", name: "Magic Manners Stories 📖", emoji: "🤝", description: "Help Chiku choose the polite words (Please, Sorry, Thanks) in stories!", skills: ["Manners", "Empathy"], gameplayType: "story" },
    { id: "life-g2", name: "Teeth Brushing Race 🪥", emoji: "🦷", description: "Scrub away germ plaque by tapping brushing zones before the timer runs out!", skills: ["Hygiene", "Self-Care"], gameplayType: "tap_timer" },
    { id: "life-g3", name: "Morning Routine Conductor ⏰", emoji: "🌅", description: "Arrange morning routine activities in the correct sequence!", skills: ["Daily Routines", "Time Management"], gameplayType: "sort" },
    { id: "life-g4", name: "Toy Sharing Helper 🪵", emoji: "🧸", description: "Distribute gold stars and blocks equally to make Chiku and Kiki happy!", skills: ["Sharing", "Division"], gameplayType: "match" },
    { id: "life-g5", name: "Feeling Face Matcher 🎭", emoji: "😢", description: "Match correct emotions (Happy, Sad, Worried, Angry) to animal stories!", skills: ["Emotional IQ", "Social Skills"], gameplayType: "match" },
    { id: "life-g6", name: "Germ Soap Destroyer 🧼", emoji: "🦠", description: "Tap and wash off germ bubbles from dirty hands using magical soap!", skills: ["Handwashing", "Health"], gameplayType: "tap_timer" },
    { id: "life-g7", name: "Traffic Crossing Guard 🚦", emoji: "🚸", description: "Help Robo cross streets safely by tapping appropriate traffic signals!", skills: ["Road Safety", "Observation"], gameplayType: "match" },
    { id: "life-g8", name: "Polite Diner Table Manners 🍽️", emoji: "🥗", description: "Classify dining actions as 'Super Polite' or 'Needs Practice'!", skills: ["Dining Etiquette", "Social Skills"], gameplayType: "sort" },
    { id: "life-g9", name: "Bedtime Robo Charger 💤", emoji: "🔋", description: "Turn off background screen lights to help Robo save sleep battery!", skills: ["Bedtime Habits", "Energy Conservation"], gameplayType: "tap_timer" },
    { id: "life-g10", name: "Chore Helper Clean-Up 🧹", emoji: "🧸", description: "Clean Chiku's messy bedroom by sorting books, toys, and clothes!", skills: ["Organization", "Responsibility"], gameplayType: "sort" },
  ],
};

export default function PlayZone({ progress, onUpdateProgress, currentStudent }: PlayZoneProps) {
  const selectedStandard = currentStudent?.standard || 1;
  const standardCurriculum = React.useMemo(() => {
    return getCurriculumForStandard(selectedStandard);
  }, [selectedStandard]);

  const [activeSubject, setActiveSubject] = useState<SubjectType>("math");
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">("idle");
  const [score, setScore] = useState<number>(0);
  const [gameTimer, setGameTimer] = useState<number>(15);
  const [gameStars, setGameStars] = useState<number>(0);

  // --- MINIGAME LOGIC STATES ---
  // Grid tapping items (for Speed Grid / Space Jump / Letter Builder)
  const [gridItems, setGridItems] = useState<{ id: string; val: string | number; clicked: boolean }[]>([]);
  const [nextExpectedVal, setNextExpectedVal] = useState<number>(1);
  
  // Matching elements (for counts, shapes, opposites, etc)
  const [matchLeft, setMatchLeft] = useState<{ id: string; text: string; matchId: string }[]>([]);
  const [matchRight, setMatchRight] = useState<{ id: string; text: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  
  // Sorting elements (for heavy/light, height, healthy/junk)
  const [sortItems, setSortItems] = useState<{ id: string; name: string; category: string; icon: string }[]>([]);
  const [binLeft, setBinLeft] = useState<string>("");
  const [binRight, setBinRight] = useState<string>("");
  
  // Text input value (for sums, spelling etc)
  const [inputVal, setInputVal] = useState<string>("");
  const [targetAnswer, setTargetAnswer] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [inputChoices, setInputChoices] = useState<string[]>([]);
  
  // Free draw canvas elements
  const [brushColor, setBrushColor] = useState<string>("#EF4444");
  const [brushSize, setBrushSize] = useState<number>(8);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Set up specific mini-game playboard
  const handleLaunchGame = (game: GameConfig) => {
    playPageTurnSound();
    setSelectedGame(game);
    setGameState("playing");
    setScore(0);
    setGameStars(0);
    setInputVal("");
    setMatches({});
    setSelectedLeft(null);
    setMatchLeft([]);
    setMatchRight([]);
    setInputChoices([]);
    setTargetAnswer("");
    setQuestionText(game.description);
    
    // Speak intro
    speakClientSide(`Playing ${game.name}! Let's have fun!`);

    // 1. GRID type setup (Speed Grid or Space Jump)
    if (game.gameplayType === "grid") {
      if (game.id === "math-g1") {
        // Speed Grid Race: Numbers 1 to 9 shuffled
        setQuestionText("Speed Grid Race: Tap the numbers 1 to 9 in order as fast as you can! 🏎️");
        const nums = Array.from({ length: 9 }, (_, i) => i + 1);
        const shuffled = nums
          .map((v) => ({ id: `num-${v}`, val: v, clicked: false }))
          .sort(() => Math.random() - 0.5);
        setGridItems(shuffled);
        setNextExpectedVal(1);
      } else if (game.id === "math-g4") {
        // Space Jump 11-20
        setQuestionText("Space Jump 11-20: Help Robo fly by tapping the numbers from 11 to 19 in sequence! 🚀");
        const nums = Array.from({ length: 9 }, (_, i) => i + 11);
        const shuffled = nums
          .map((v) => ({ id: `num-${v}`, val: v, clicked: false }))
          .sort(() => Math.random() - 0.5);
        setGridItems(shuffled);
        setNextExpectedVal(11);
      } else if (game.id === "lang-g2") {
        // Word Builder blocks - RANDOMIZED
        const wordsList = [
          { word: "CAT", hint: "CAT! 🐱" },
          { word: "DOG", hint: "DOG! 🐶" },
          { word: "SUN", hint: "SUN! ☀️" },
          { word: "BUG", hint: "BUG! 🪲" },
          { word: "FOX", hint: "FOX! 🦊" },
          { word: "HAT", hint: "HAT! 🎩" },
          { word: "BOX", hint: "BOX! 📦" },
          { word: "BAG", hint: "BAG! 🎒" }
        ];
        const chosenWord = wordsList[Math.floor(Math.random() * wordsList.length)];
        setQuestionText(`Word Builder Blocks: Tap the letter blocks in order to spell the word ${chosenWord.hint}`);
        setTargetAnswer(chosenWord.word);
        const letters = chosenWord.word.split("").map((c, i) => ({ id: `letter-${i}`, val: c, clicked: false })).sort(() => Math.random() - 0.5);
        setGridItems(letters);
        setNextExpectedVal(0); // Will track sequence indexes
      } else if (game.id === "lang-g6") {
        // Alphabet Dot-to-Dot
        setQuestionText("Alphabet Dot-to-Dot: Tap the letters from A to I in alphabetical order to connect the dots! 🎨");
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        const shuffled = letters
          .map((v) => ({ id: `let-${v}`, val: v, clicked: false }))
          .sort(() => Math.random() - 0.5);
        setGridItems(shuffled);
        setNextExpectedVal(65); // ASCII code of 'A'
      } else {
        // Fallback or custom grids (like Word Search, Pattern Painter Palette, Pixel Art Mirror, Mosaic Grid Copy)
        let items: string[] = [];
        if (game.id === "lang-g5") {
          setQuestionText("Word Search Jungle: Tap all the hidden letter tiles to clear the jungle path! 🌴");
          items = ["J", "U", "N", "G", "L", "E", "🌲", "🌴", "🐵"];
        } else if (game.id === "art-g2") {
          setQuestionText("Pattern Painter Palette: Tap the tiles to paint a beautiful repeating pattern! 🎨");
          items = ["🔴", "🟡", "🔵", "🔴", "🟡", "🔵", "🔴", "🟡", "🔵"];
        } else if (game.id === "art-g3") {
          setQuestionText("Pixel Art Mirror: Tap the symmetric pixel blocks to mirror the pattern! 🪞");
          items = ["🟥", "🟦", "🟧", "🟥", "🟦", "🟧", "🟥", "🟦", "🟧"];
        } else if (game.id === "art-g9") {
          setQuestionText("Mosaic Grid Copy: Tap all the colorful mosaic shards to copy the pattern! 📐");
          items = ["📐", "🟩", "🟦", "🟧", "🟨", "🟥", "🟪", "💎", "⭐"];
        } else {
          items = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        }
        const shuffled = items
          .map((v, i) => ({ id: `let-${i}-${v}`, val: v, clicked: false }))
          .sort(() => Math.random() - 0.5);
        setGridItems(shuffled);
      }
    }

    // 2. MATCH type setup (counting banana, shapes, opposites)
    if (game.gameplayType === "match") {
      if (game.id === "math-g2") {
        // Banana counting - RANDOMIZED
        const count = Math.floor(Math.random() * 6) + 3; // 3 to 8
        const choices = Array.from(new Set([count, count - 1, count + 1, count + 2].filter(n => n > 0))).sort((a, b) => a - b).map(String);
        setQuestionText(`How many bananas are in the basket? ${"🍌 ".repeat(count)}`);
        setTargetAnswer(String(count));
        setInputChoices(choices);
      } else if (game.id === "math-g3") {
        // Size Scale Balancer - RANDOMIZED
        const scenarios = [
          { q: "Which animal is the BIGGEST? 🐘 🦁 🐭", ans: "Elephant 🐘", options: ["Elephant 🐘", "Lion 🦁", "Mouse 🐭"] },
          { q: "Which object is the TALLEST? 🦒 🌳 🌱", ans: "Giraffe 🦒", options: ["Giraffe 🦒", "Tree 🌳", "Grass 🌱"] },
          { q: "Which object is the HEAVIEST on the scale? 🪨 🍃 🪶", ans: "Rock 🪨", options: ["Rock 🪨", "Leaf 🍃", "Feather 🪶"] },
          { q: "Which object is the LIGHTEST in the sky? ☁️ 🪶 🧱", ans: "Feather 🪶", options: ["Feather 🪶", "Cloud ☁️", "Brick 🧱"] }
        ];
        const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "math-g6") {
        // Berry subtraction - RANDOMIZED
        const total = Math.floor(Math.random() * 4) + 6; // 6 to 9
        const eaten = Math.floor(Math.random() * 3) + 2; // 2 to 4
        const ans = total - eaten;
        const choices = Array.from(new Set([ans, ans - 1, ans + 1, ans + 2].filter(n => n > 0))).sort((a, b) => a - b).map(String);
        setQuestionText(`Subtract: You have ${total} berries and Kiki eats ${eaten}. How many berries remain? ${"🍓".repeat(total)}`);
        setTargetAnswer(String(ans));
        setInputChoices(choices);
      } else if (game.id === "math-g7") {
        // Shape match - RANDOMIZED
        const shapes = [
          { q: "What shape is a standard wall clock? ⏰", ans: "Circle 🔴", options: ["Circle 🔴", "Square 🟥", "Triangle 🔺", "Rectangle 🟩"] },
          { q: "What shape is a delicious slice of pizza? 🍕", ans: "Triangle 🔺", options: ["Triangle 🔺", "Circle 🔴", "Square 🟥", "Rectangle 🟩"] },
          { q: "What shape is a square present box? 🎁", ans: "Square 🟥", options: ["Square 🟥", "Circle 🔴", "Triangle 🔺", "Rectangle 🟩"] },
          { q: "What shape is our classroom blackboard? 🖳", ans: "Rectangle 🟩", options: ["Rectangle 🟩", "Circle 🔴", "Square 🟥", "Triangle 🔺"] }
        ];
        const chosen = shapes[Math.floor(Math.random() * shapes.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "math-g8") {
        // Pattern logic - RANDOMIZED
        const patterns = [
          { q: "Complete Chiku's pattern: 🍎 🍌 🍎 🍌 ___", ans: "🍎 Apple", options: ["🍎 Apple", "🍌 Banana", "🍒 Cherry"] },
          { q: "Complete the wildlife pattern: 🐸 🦊 🐸 🦊 ___", ans: "🐸 Frog", options: ["🐸 Frog", "🦊 Fox", "🦁 Lion"] },
          { q: "Complete the space pattern: ⭐ 🌙 ⭐ 🌙 ___", ans: "⭐ Star", options: ["⭐ Star", "🌙 Moon", "☀️ Sun"] },
          { q: "Complete the vehicle pattern: 🚂 🚗 🚂 🚗 ___", ans: "🚂 Train", options: ["🚂 Train", "🚗 Car", "✈️ Airplane"] }
        ];
        const chosen = patterns[Math.floor(Math.random() * patterns.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "lang-g1") {
        // Phonics sounds - RANDOMIZED
        const phonics = [
          { word: "Apple 🍎", letter: "A", options: ["A", "B", "C", "D"] },
          { word: "Banana 🍌", letter: "B", options: ["B", "C", "A", "M"] },
          { word: "Cat 🐱", letter: "C", options: ["C", "K", "S", "T"] },
          { word: "Dog 🐶", letter: "D", options: ["D", "T", "B", "P"] },
          { word: "Elephant 🐘", letter: "E", options: ["E", "F", "I", "A"] }
        ];
        const chosen = phonics[Math.floor(Math.random() * phonics.length)];
        setQuestionText(`Phonics Sounds: Which letter makes the starting sound of ${chosen.word}?`);
        setTargetAnswer(chosen.letter);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "lang-g3") {
        // Rhyming bubble - RANDOMIZED
        const rhyming = [
          { word: "Cat 🐱", ans: "Hat 🎩", options: ["Hat 🎩", "Dog 🐶", "Sun ☀️", "Tree 🌲"] },
          { word: "Dog 🐶", ans: "Log 🪵", options: ["Log 🪵", "Cat 🐱", "Star ⭐", "Pig 🐷"] },
          { word: "Sun ☀️", ans: "Run 🏃", options: ["Run 🏃", "Moon 🌙", "Box 📦", "Toy 🧸"] },
          { word: "Star ⭐", ans: "Car 🚗", options: ["Car 🚗", "Moon 🌙", "Cow 🐮", "Bed 🛌"] }
        ];
        const chosen = rhyming[Math.floor(Math.random() * rhyming.length)];
        setQuestionText(`Rhyming Bubble: Which word rhymes with the word '${chosen.word}'?`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "lang-g9") {
        // Sight word speed run - RANDOMIZED
        const sightWords = [
          { word: "the", ans: "THE", options: ["THE", "TEH", "THT", "AND"] },
          { word: "you", ans: "YOU", options: ["YOU", "YUO", "YOW", "OUT"] },
          { word: "and", ans: "AND", options: ["AND", "ADN", "ANT", "THE"] },
          { word: "play", ans: "PLAY", options: ["PLAY", "PALY", "PLY", "TOY"] }
        ];
        const chosen = sightWords[Math.floor(Math.random() * sightWords.length)];
        setQuestionText(`Sight Words: Choose the correct spelling of the word '${chosen.word}':`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "evs-g2") {
        // Jungle Sound Safari - RANDOMIZED
        const sounds = [
          { sound: "ROAR! 🦁", ans: "Lion 🦁", options: ["Lion 🦁", "Elephant 🐘", "Frog 🐸", "Bird 🐦"] },
          { sound: "TRUMPET! 🐘", ans: "Elephant 🐘", options: ["Elephant 🐘", "Lion 🦁", "Monkey 🐵", "Frog 🐸"] },
          { sound: "RIBBIT! 🐸", ans: "Frog 🐸", options: ["Frog 🐸", "Snake 🐍", "Lion 🦁", "Bird 🐦"] },
          { sound: "HISS! 🐍", ans: "Snake 🐍", options: ["Snake 🐍", "Frog 🐸", "Elephant 🐘", "Cat 🐱"] }
        ];
        const chosen = sounds[Math.floor(Math.random() * sounds.length)];
        setQuestionText(`Jungle Sound Safari: Listen to the animal sound: '${chosen.sound}' Which animal is that?`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "evs-g8") {
        // Weather Dress-Up - RANDOMIZED
        const weather = [
          { scenario: "It is raining heavily outside! 🌧️", ans: "Raincoat 🧥", options: ["Raincoat 🧥", "Sunglasses 🕶️", "Swimwear 🩱"] },
          { scenario: "It is extremely sunny and hot outside! ☀️", ans: "Sunglasses 🕶️", options: ["Sunglasses 🕶️", "Raincoat 🧥", "Winter Boots 🥾"] },
          { scenario: "It is freezing cold and snowing outside! ❄️", ans: "Warm Scarf 🧣", options: ["Warm Scarf 🧣", "Swimwear 🩱", "Flip Flops 🩴"] }
        ];
        const chosen = weather[Math.floor(Math.random() * weather.length)];
        setQuestionText(`Weather Dress-Up: ${chosen.scenario} What should Chiku wear?`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "art-g1") {
        // Magic color mixer - RANDOMIZED
        const mix = [
          { colors: "Red 🔴 and Yellow 🟡", ans: "Orange 🟠", options: ["Orange 🟠", "Green 🟢", "Purple 🟣", "Pink 🌸"] },
          { colors: "Blue 🔵 and Yellow 🟡", ans: "Green 🟢", options: ["Green 🟢", "Orange 🟠", "Purple 🟣", "Brown 🟫"] },
          { colors: "Red 🔴 and Blue 🔵", ans: "Purple 🟣", options: ["Purple 🟣", "Orange 🟠", "Green 🟢", "White ⚪"] }
        ];
        const chosen = mix[Math.floor(Math.random() * mix.length)];
        setQuestionText(`Magic Color Mixer: What color do you get when you mix ${chosen.colors}?`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "art-g4") {
        // Doodle Guess - RANDOMIZED
        const doodles = [
          { q: "Doodle Guess Board: Chiku is drawing a round, yellow shape with shiny rays. What is it? ☀️", ans: "The Sun ☀️", options: ["The Sun ☀️", "A Moon 🌙", "An Apple 🍎", "A Star ⭐"] },
          { q: "Doodle Guess Board: Maya is sketching a fluffy, white shape floating in the blue sky. What is it? ☁️", ans: "A Cloud ☁️", options: ["A Cloud ☁️", "A Bird 🐦", "An Airplane ✈️", "The Sun ☀️"] },
          { q: "Doodle Guess Board: Kiki is tracing a red, juicy fruit with a brown stem and a leaf. What is it? 🍎", ans: "An Apple 🍎", options: ["An Apple 🍎", "A Banana 🍌", "A Leaf 🍃", "A Grape 🍇"] }
        ];
        const chosen = doodles[Math.floor(Math.random() * doodles.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "art-g6") {
        // Color Swatch Matcher - RANDOMIZED
        const swatches = [
          { name: "Sky Blue 🩵", ans: "🩵 Sky Blue", options: ["🩵 Sky Blue", "💙 Royal Blue", "💜 Purple", "💚 Green"] },
          { name: "Emerald Green 💚", ans: "💚 Emerald Green", options: ["💚 Emerald Green", "💛 Yellow", "❤️ Red", "💙 Blue"] },
          { name: "Ruby Red ❤️", ans: "❤️ Ruby Red", options: ["❤️ Ruby Red", "💖 Pink", "🧡 Orange", "💜 Purple"] }
        ];
        const chosen = swatches[Math.floor(Math.random() * swatches.length)];
        setQuestionText(`Color Swatch: Which of these is the correct '${chosen.name}' shade?`);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "art-g10") {
        // Origami Paper folds - RANDOMIZED
        const folds = [
          { q: "Origami Airplane: To fold a paper airplane, what is the very first step? ✈️", ans: "Fold in half 📄", options: ["Fold in half 📄", "Cut it ✂️", "Color it 🎨"] },
          { q: "Origami Hat: To fold a paper hat, what do we create from the rectangular paper? 👒", ans: "A Triangle 🔺", options: ["A Triangle 🔺", "A Circle 🔴", "A Star ⭐"] }
        ];
        const chosen = folds[Math.floor(Math.random() * folds.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "life-g4") {
        // Toy sharing - RANDOMIZED
        const sharing = [
          { q: "Toy Sharing: If you have 4 toys and want to share them equally with 1 friend, how many toys does each get? 🧸", ans: "2", options: ["1", "2", "3", "4"] },
          { q: "Star Sharing: If you have 6 golden stars and want to share them equally with 1 friend, how many does each get? ⭐", ans: "3", options: ["2", "3", "4", "5"] },
          { q: "Cookie Sharing: If you have 8 tasty cookies and share them equally with 1 friend, how many does each get? 🍪", ans: "4", options: ["3", "4", "5", "6"] }
        ];
        const chosen = sharing[Math.floor(Math.random() * sharing.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else if (game.id === "life-g7") {
        // Traffic Signal - RANDOMIZED
        const signals = [
          { q: "Traffic Safety: The pedestrian walking light turns Green! 🟢 What should Robo do?", ans: "Cross the street safely 🚸", options: ["Cross the street safely 🚸", "Wait on the curb 🛑", "Run backwards 🏃‍♂️"] },
          { q: "Traffic Safety: The traffic signal light turns solid Red! 🔴 What should Robo do?", ans: "Stop and wait 🛑", options: ["Stop and wait 🛑", "Cross immediately 🚸", "Dance in place 💃"] },
          { q: "Traffic Safety: The traffic signal light turns solid Yellow! 🟡 What should Robo do?", ans: "Slow down and prepare to stop ⚠️", options: ["Slow down and prepare to stop ⚠️", "Speed up super fast 🏎️", "Close his eyes 🙈"] }
        ];
        const chosen = signals[Math.floor(Math.random() * signals.length)];
        setQuestionText(chosen.q);
        setTargetAnswer(chosen.ans);
        setInputChoices(chosen.options.sort(() => Math.random() - 0.5));
      } else {
        // Column matching games: lang-g7, evs-g1, evs-g5, art-g7, life-g5 - RANDOM SHUFFLED
        let lefts = [
          { id: "L1", text: "SUN ☀️", matchId: "R1" },
          { id: "L2", text: "ICE ❄️", matchId: "R2" },
          { id: "L3", text: "ANT 🐜", matchId: "R3" },
        ];
        let rights = [
          { id: "R2", text: "Cold" },
          { id: "R3", text: "Small" },
          { id: "R1", text: "Hot" },
        ];

        if (game.id === "lang-g7") {
          setQuestionText("Opposite Card Matcher: Match each word with its opposite! 🌗");
          lefts = [
            { id: "L1", text: "HOT ☀️", matchId: "R1" },
            { id: "L2", text: "BIG 🐘", matchId: "R2" },
            { id: "L3", text: "UP 🎈", matchId: "R3" },
          ];
          rights = [
            { id: "R2", text: "Small 🐭" },
            { id: "R3", text: "Down 🎈" },
            { id: "R1", text: "Cold ❄️" },
          ];
        } else if (game.id === "evs-g1") {
          setQuestionText("My Body Parts Labeler: Match Chiku's body parts with what they do! 👤");
          lefts = [
            { id: "L1", text: "EYES 👀", matchId: "R1" },
            { id: "L2", text: "EARS 👂", matchId: "R2" },
            { id: "L3", text: "NOSE 👃", matchId: "R3" },
          ];
          rights = [
            { id: "R2", text: "To Hear 🔔" },
            { id: "R3", text: "To Smell 🌸" },
            { id: "R1", text: "To See 🌈" },
          ];
        } else if (game.id === "evs-g5") {
          setQuestionText("Five Senses Matcher: Match our sensory organs with the right object! 🧠");
          lefts = [
            { id: "L1", text: "TONGUE 👅", matchId: "R1" },
            { id: "L2", text: "SKIN ✋", matchId: "R2" },
            { id: "L3", text: "EYES 👀", matchId: "R3" },
          ];
          rights = [
            { id: "R2", text: "Feel Teddy 🧸" },
            { id: "R3", text: "See Rainbow 🌈" },
            { id: "R1", text: "Taste Lemon 🍋" },
          ];
        } else if (game.id === "art-g7") {
          setQuestionText("Silhouette Shadow Match: Match each toy to its dark shadow! 🧸");
          lefts = [
            { id: "L1", text: "Teddy Bear 🧸", matchId: "R1" },
            { id: "L2", text: "Toy Train 🚂", matchId: "R2" },
            { id: "L3", text: "Rubber Duck 🦆", matchId: "R3" },
          ];
          rights = [
            { id: "R2", text: "Train Shadow 👥" },
            { id: "R3", text: "Duck Shadow 👥" },
            { id: "R1", text: "Bear Shadow 👥" },
          ];
        } else if (game.id === "life-g5") {
          setQuestionText("Feeling Face Matcher: Match each happy or sad scenario to the correct emotion! 🎭");
          lefts = [
            { id: "L1", text: "Chiku got a new toy! 🎁", matchId: "R1" },
            { id: "L2", text: "Kiki dropped her ice cream 🍦", matchId: "R2" },
            { id: "L3", text: "Robo is scared of thunder ⚡", matchId: "R3" },
          ];
          rights = [
            { id: "R2", text: "Sad / Crying 😢" },
            { id: "R3", text: "Scared / Nervous 😨" },
            { id: "R1", text: "Excited / Happy 😄" },
          ];
        }

        setMatchLeft(lefts);
        setMatchRight(rights.sort(() => Math.random() - 0.5));
      }
    }

    // 3. SORT type setup
    if (game.gameplayType === "sort") {
      if (game.id === "evs-g4") {
        // Healthy vs Junk
        setQuestionText("Healthy Basket Sorter: Help sort nutritious foods to the left, and sugary junk treats to the right! 🥦");
        setBinLeft("Healthy Fruits & Veggies 🥦");
        setBinRight("Sweet Treats & Junk 🍭");
        setSortItems([
          { id: "s1", name: "Apple 🍎", category: "left", icon: "🍎" },
          { id: "s2", name: "Broccoli 🥦", category: "left", icon: "🥦" },
          { id: "s3", name: "Candy Cane 🍭", category: "right", icon: "🍭" },
          { id: "s4", name: "French Fries 🍟", category: "right", icon: "🍟" },
          { id: "s5", name: "Donut 🍩", category: "right", icon: "🍩" },
          { id: "s6", name: "Fresh Carrot 🥕", category: "left", icon: "🥕" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "evs-g7") {
        // Animal Habitats
        setQuestionText("Animal Habitat Sorter: Sort animals into their correct natural homes! 🌳");
        setBinLeft("Land Forest 🌳");
        setBinRight("Blue Ocean 🐳");
        setSortItems([
          { id: "s1", name: "Goldfish 🐠", category: "right", icon: "🐠" },
          { id: "s2", name: "Jungle Tiger 🐯", category: "left", icon: "🐯" },
          { id: "s3", name: "Octopus 🐙", category: "right", icon: "🐙" },
          { id: "s4", name: "Teddy Bear 🐻", category: "left", icon: "🐻" },
          { id: "s5", name: "Whale 🐳", category: "right", icon: "🐳" },
          { id: "s6", name: "Monkey 🐵", category: "left", icon: "🐵" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "math-g9") {
        // Height Sorter
        setQuestionText("Height Block Sorter: Sort toy blocks into short piles on the left, and tall towers on the right! 🪜");
        setBinLeft("Short Blocks 🧱");
        setBinRight("Tall Blocks 🪜");
        setSortItems([
          { id: "s1", name: "Red Block (2 blocks)", category: "left", icon: "🧱" },
          { id: "s2", name: "Blue Block (1 block)", category: "left", icon: "🧱" },
          { id: "s3", name: "Yellow Tower (10 blocks)", category: "right", icon: "🪜" },
          { id: "s4", name: "Green Tower (9 blocks)", category: "right", icon: "🪜" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "lang-g4") {
        // Noun vs Verb
        setQuestionText("Word Train Conductor: Sort naming words (nouns) to the left, and active doing words (verbs) to the right! 🚂");
        setBinLeft("Noun (Naming Words) 👤");
        setBinRight("Verb (Doing Words) 🏃");
        setSortItems([
          { id: "s1", name: "Cat 🐱", category: "left", icon: "🐱" },
          { id: "s2", name: "Boy 👦", category: "left", icon: "👦" },
          { id: "s3", name: "Run 🏃", category: "right", icon: "🏃" },
          { id: "s4", name: "Jump 🦘", category: "right", icon: "🦘" },
          { id: "s5", name: "Play 🎮", category: "right", icon: "🎮" },
          { id: "s6", name: "Apple 🍎", category: "left", icon: "🍎" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "evs-g6") {
        // Day vs Night
        setQuestionText("Day & Night Sorter: Sort everyday tasks into daytime activities, and nighttime sleep routines! ☀️");
        setBinLeft("Daytime Sunshine ☀️");
        setBinRight("Nighttime Sleep 🌙");
        setSortItems([
          { id: "s1", name: "Eat Breakfast 🥞", category: "left", icon: "🥞" },
          { id: "s2", name: "Go to School 🏫", category: "left", icon: "🏫" },
          { id: "s3", name: "Sleep in Bed 🛌", category: "right", icon: "🛌" },
          { id: "s4", name: "Read Bedtime Story 📖", category: "right", icon: "📖" },
          { id: "s5", name: "Brush Night Teeth 🪥", category: "right", icon: "🪥" },
          { id: "s6", name: "Play in Playground 🛝", category: "left", icon: "𛛝" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "evs-g10") {
        // Forest cleanup
        setQuestionText("Forest Cleanup Guard: Sort waste into recyclable plastic/paper on the left, and organic skins/fruits on the right! ♻️");
        setBinLeft("Recyclables ♻️");
        setBinRight("Organic Food Peels 🍎");
        setSortItems([
          { id: "s1", name: "Plastic Bottle 🧴", category: "left", icon: "🧴" },
          { id: "s2", name: "Banana Peel 🍌", category: "right", icon: "🍌" },
          { id: "s3", name: "Newspaper 📰", category: "left", icon: "📰" },
          { id: "s4", name: "Apple Core 🍏", category: "right", icon: "🍏" },
          { id: "s5", name: "Cardboard Box 📦", category: "left", icon: "📦" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "life-g3") {
        // Morning vs night
        setQuestionText("Morning Routine Conductor: Sort tasks into the first morning things on the left, and bedtime routines on the right! 🌅");
        setBinLeft("Morning Routine 🌅");
        setBinRight("Bedtime Routine 🌙");
        setSortItems([
          { id: "s1", name: "Wake up ⏰", category: "left", icon: "⏰" },
          { id: "s2", name: "Brush morning teeth 🪥", category: "left", icon: "🪥" },
          { id: "s3", name: "Put on pajamas 👕", category: "right", icon: "👕" },
          { id: "s4", name: "Go to Sleep 😴", category: "right", icon: "😴" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "life-g8") {
        // Dining etiquette
        setQuestionText("Polite Diner: Help sort table actions into polite dinner habits, and noisy actions that need practice! 🍽️");
        setBinLeft("Polite Dinner Habits 👍");
        setBinRight("Needs More Practice 👎");
        setSortItems([
          { id: "s1", name: "Saying Thank You 🤝", category: "left", icon: "🤝" },
          { id: "s2", name: "Chewing with mouth closed 🤐", category: "left", icon: "🤐" },
          { id: "s3", name: "Yelling at the table 🗣️", category: "right", icon: "🗣️" },
          { id: "s4", name: "Playing on mobile phone 📱", category: "right", icon: "📱" },
          { id: "s5", name: "Wiping mouth with napkin 🧻", category: "left", icon: "🧻" },
        ].sort(() => Math.random() - 0.5));
      } else if (game.id === "life-g10") {
        // Bedroom cleanup
        setQuestionText("Chore Helper Clean-Up: Tidy Chiku's messy room by sorting toys into the toy box, and books onto the shelf! 🧹");
        setBinLeft("Toy Chest 🧸");
        setBinRight("Bookshelf 📚");
        setSortItems([
          { id: "s1", name: "Teddy Bear 🧸", category: "left", icon: "🧸" },
          { id: "s2", name: "Storybook 📖", category: "right", icon: "📖" },
          { id: "s3", name: "Toy Car 🚗", category: "left", icon: "🚗" },
          { id: "s4", name: "Dictionary 📕", category: "right", icon: "📕" },
          { id: "s5", name: "Action Figure 🦸", category: "left", icon: "🦸" },
          { id: "s6", name: "Comic Book 🎨", category: "right", icon: "🎨" },
        ].sort(() => Math.random() - 0.5));
      } else {
        // evs-g9 (Living vs Non-Living)
        setQuestionText("Living or Non-Living: Sort growing, breathing living things to the left, and static non-living toys to the right! 🌲");
        setBinLeft("Living Things 🌳");
        setBinRight("Non-Living Things 🧸");
        setSortItems([
          { id: "s1", name: "Puppy Dog 🐶", category: "left", icon: "🐶" },
          { id: "s2", name: "Toy Train 🚂", category: "right", icon: "🚂" },
          { id: "s3", name: "Tall Tree 🌲", category: "left", icon: "🌲" },
          { id: "s4", name: "Small Pebble 🪨", category: "right", icon: "🪨" },
        ].sort(() => Math.random() - 0.5));
      }
    }

    // 4. INPUT type setup - FULLY RANDOMIZED / DYNAMIC NO-REPEAT
    if (game.gameplayType === "input") {
      if (game.id === "math-g5") {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        setQuestionText(`Addition Challenge: What is ${a} + ${b}? ${"🪙".repeat(a)} + ${"🪙".repeat(b)}`);
        setTargetAnswer(String(a + b));
      } else if (game.id === "math-g10") {
        const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
        const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1
        setQuestionText(`Treasure Decoder: What is ${a} - ${b}? ${"🔑".repeat(a)} minus ${"🔑".repeat(b)}`);
        setTargetAnswer(String(a - b));
      } else if (game.id === "lang-g10") {
        const wordsList = [
          { word: "SUN", letters: "U S N", hint: "a warm celestial star ☀️" },
          { word: "CAT", letters: "T C A", hint: "a friendly purring pet 🐱" },
          { word: "DOG", letters: "O G D", hint: "a playful barking pup 🐶" },
          { word: "FOX", letters: "X O F", hint: "a clever forest animal 🦊" },
          { word: "TOY", letters: "Y T O", hint: "a soft teddy to play with 🧸" },
          { word: "RED", letters: "D E R", hint: "the color of a sweet apple 🍎" },
        ];
        const chosen = wordsList[Math.floor(Math.random() * wordsList.length)];
        setQuestionText(`Unscramble Kiki's letters '${chosen.letters}' to spell: ${chosen.hint}`);
        setTargetAnswer(chosen.word);
      } else {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        setQuestionText(`Solve Kiki's secret math quest: ${a} + ${b} = ?`);
        setTargetAnswer(String(a + b));
      }
    }

    // 5. TAP TIMER type setup
    if (game.gameplayType === "tap_timer") {
      setGameTimer(15);
      setScore(0);
      if (game.id === "evs-g3") {
        setQuestionText("Plant Growth: Tap the Sunlight ☀️ and Water 💧 icons repeatedly to help the seed sprout roots and leaves!");
      } else if (game.id === "lang-g8") {
        setQuestionText("Vowel Balloon Catch: Tap the bouncy balloon bubbles 🎈 to catch all the magical letter vowels!");
      } else if (game.id === "life-g9") {
        setQuestionText("Bedtime Robo Charger: Tap the glowing phone screen light icons 📱 quickly to turn them off so Robo can sleep!");
      } else if (game.id === "life-g2") {
        setQuestionText("Teeth Brushing Race: Tap the shiny teeth icons 🦷 repeatedly to scrub away germ plaque before the timer runs out!");
      } else {
        // life-g6
        setQuestionText("Germ Soap Destroyer: Tap the bubbly green germ icons 🦠 repeatedly to wash dirty hands clean!");
      }
      
      // Start counting down
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setGameTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState("completed");
            setGameStars(3);
            playSynthBeep("success");
            speakClientSide("Timer up! Outstanding cleaning job!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // 6. STORY type setup
    if (game.gameplayType === "story") {
      setQuestionText("Chiku says: 'May I borrow your orange pencil, please?' What should you answer?");
      setTargetAnswer("Sure, here it is! 🌟");
      setInputChoices(["No, go away!", "Sure, here it is! 🌟", "Keep quiet."]);
    }
  };

  // --- INTERACTION HANDLERS ---
  const handleGridTap = (id: string, val: string | number) => {
    playPopSound();
    
    // Math Speed Grid / Space Jump
    if (selectedGame?.id === "math-g1" || selectedGame?.id === "math-g4") {
      if (val === nextExpectedVal) {
        setGridItems((prev) => prev.map((item) => (item.id === id ? { ...item, clicked: true } : item)));
        
        const nextVal = nextExpectedVal + 1;
        const maxVal = selectedGame.id === "math-g1" ? 9 : 19;
        
        if (nextExpectedVal === maxVal) {
          // Completed game!
          setGameState("completed");
          setGameStars(3);
          playSynthBeep("success");
          speakClientSide("Amazing ordering speed! You got all numbers correct!");
        } else {
          setNextExpectedVal(nextVal);
        }
      } else {
        playSynthBeep("error");
      }
      return;
    }

    // Alphabet Dot-to-Dot sequence
    if (selectedGame?.id === "lang-g6") {
      const expectedChar = String.fromCharCode(nextExpectedVal);
      if (val === expectedChar) {
        setGridItems((prev) => prev.map((item) => (item.id === id ? { ...item, clicked: true } : item)));
        if (expectedChar === "I") {
          setGameState("completed");
          setGameStars(3);
          playSynthBeep("success");
          speakClientSide("Sensational! You connected all the dots to reveal Chiku's painting!");
        } else {
          setNextExpectedVal((prev) => prev + 1);
        }
      } else {
        playSynthBeep("error");
      }
      return;
    }

    // Phonics spelling Word Builder
    if (selectedGame?.id === "lang-g2") {
      // Expected letter sequence
      const targetChar = targetAnswer[nextExpectedVal];
      if (val === targetChar) {
        setGridItems((prev) => prev.map((item) => (item.id === id ? { ...item, clicked: true } : item)));
        if (nextExpectedVal + 1 === targetAnswer.length) {
          setGameState("completed");
          setGameStars(3);
          playSynthBeep("success");
          speakClientSide(`Outstanding! You spelled the word ${targetAnswer}!`);
        } else {
          setNextExpectedVal((prev) => prev + 1);
        }
      } else {
        playSynthBeep("error");
      }
      return;
    }

    // General Grid Tapper for other grid-based games
    if (selectedGame && selectedGame.gameplayType === "grid") {
      setGridItems((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, clicked: true } : item));
        const allClicked = updated.every((item) => item.clicked);
        if (allClicked) {
          setGameState("completed");
          setGameStars(3);
          playSynthBeep("success");
          speakClientSide(`Fantastic! You successfully completed ${selectedGame.name}!`);
        }
        return updated;
      });
      return;
    }
  };

  const handleChoiceSelect = (choice: string) => {
    playClickSound();
    if (choice === targetAnswer) {
      setGameState("completed");
      setGameStars(3);
      playSynthBeep("success");
      speakClientSide("Sensational work! That is the exact correct answer!");
    } else {
      playSynthBeep("error");
      speakClientSide("Let's try that one again!");
    }
  };

  const handleMatchPairTap = (leftId: string, rightId: string) => {
    playPopSound();
    const updated = { ...matches, [leftId]: rightId };
    setMatches(updated);
    
    // Check if correct
    if (leftId === "L1" && rightId === "R1") {
      // match ok
    }
    
    if (Object.keys(updated).length === 3) {
      // Check overall matches
      if (updated.L1 === "R1" && updated.L2 === "R2" && updated.L3 === "R3") {
        setGameState("completed");
        setGameStars(3);
        playSynthBeep("success");
        speakClientSide("Hooray! Every opposite has been correctly paired!");
      } else {
        // Reset matches
        playSynthBeep("error");
        setMatches({});
        speakClientSide("Not quite. Let's reset and try again!");
      }
    }
  };

  const handleSortItem = (itemId: string, direction: "left" | "right") => {
    playPopSound();
    const item = sortItems.find((i) => i.id === itemId)!;
    
    if (item.category === direction) {
      // Correct sort
      setSortItems((prev) => prev.filter((i) => i.id !== itemId));
      setScore((prev) => prev + 1);
      
      // If none left
      if (sortItems.length <= 1) {
        setGameState("completed");
        setGameStars(3);
        playSynthBeep("success");
        speakClientSide("Outstanding category sorting job!");
      } else {
        playSynthBeep("success");
      }
    } else {
      playSynthBeep("error");
      speakClientSide("Oops, try sorting it to the other box!");
    }
  };

  const handleInputSubmit = () => {
    playClickSound();
    if (inputVal.trim().toUpperCase() === targetAnswer.toUpperCase()) {
      setGameState("completed");
      setGameStars(3);
      playSynthBeep("success");
      speakClientSide("Correct! You cracked the math code!");
    } else {
      playSynthBeep("error");
      speakClientSide("Let's try calculating that again!");
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playPopSound();
  };

  const handleSaveGameProgress = () => {
    playPageTurnSound();
    // Update local and firestore progress
    onUpdateProgress((prev) => {
      const badges = [...prev.badgesEarned];
      const hasGameBadge = badges.some((b) => b.id === "game-champion");
      
      if (!hasGameBadge) {
        badges.push({
          id: "game-champion",
          title: "Arcade Master 🕹️",
          icon: "👑",
          unlockedAt: new Date().toLocaleDateString(),
          subject: activeSubject,
        });
      }

      return {
        ...prev,
        badgesEarned: badges,
      };
    });

    setSelectedGame(null);
    setGameState("idle");
  };

  return (
    <div id="play-zone-box" className="space-y-6">
      {/* Subject Navigation Tab */}
      <AnimatePresence mode="wait">
        {gameState === "idle" && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 snap-x select-none">
            {(["math", "lang", "evs", "art", "life"] as SubjectType[]).map((subId) => {
              const subConfig = SUBJECT_GAMES[subId];
              const curriculumSub = standardCurriculum.find((s) => s.id === subId);
              const emoji = curriculumSub ? curriculumSub.emoji : (subId === "math" ? "🔢" : subId === "lang" ? "📖" : subId === "evs" ? "🌿" : subId === "art" ? "🎨" : "💡");
              const label = curriculumSub ? curriculumSub.name : (subId === "math" ? "Math" : subId === "lang" ? "Language" : subId === "evs" ? "Science" : subId === "art" ? "Art" : "Life Skills");
              const isActive = activeSubject === subId;
              
              return (
                <button
                  key={subId}
                  onClick={() => {
                    playClickSound();
                    setActiveSubject(subId);
                  }}
                  className={`flex-1 min-w-[100px] py-3.5 px-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all snap-start border-4 ${
                    isActive
                      ? "bg-slate-900 border-yellow-400 border-b-8 border-b-slate-950 text-white shadow-md transform -translate-y-0.5"
                      : "bg-white border-slate-200 hover:border-amber-200 text-slate-700 hover:bg-amber-50/20 border-b-8 border-b-slate-300"
                  }`}
                >
                  <span className="text-2xl transform hover:scale-115 transition-transform">{emoji}</span>
                  <span className="text-[10px] font-black font-heading tracking-tight">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Console Board */}
      <div className="bg-slate-900 border-[12px] border-slate-800 rounded-[36px] overflow-hidden p-6 shadow-2xl relative">
        {/* Retro style speaker grid & branding */}
        <div className="flex justify-between items-center mb-4 text-slate-500 font-mono text-[9px] select-none border-b border-slate-800 pb-3">
          <div className="flex gap-1.5 items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-400">ARCADE MASTER OS v3.5</span>
          </div>
          <div className="flex gap-2">
            <span>🔊 AUDIO HIGH</span>
            <span>🔋 BATTERY FULL</span>
          </div>
        </div>

        {/* --- STATE 1: IDLE GAME LIST (10 Games with different ideas!) --- */}
        {gameState === "idle" && (
          <div className="space-y-6">
            <div className="text-center text-white space-y-1 py-4">
              <h4 className="font-heading text-xl font-black text-yellow-400 flex items-center justify-center gap-2">
                <span>🎮</span> Subject Arcade Cabinets
              </h4>
              <p className="text-xs text-slate-400 font-bold">Choose from 10 custom interactive games for this subject!</p>
            </div>

            {/* Games Grid (10 items!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBJECT_GAMES[activeSubject].map((game, idx) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800 rounded-2xl p-4.5 border-2 border-slate-700 hover:border-yellow-400 transition-all flex flex-col justify-between shadow-md"
                >
                  <div className="flex gap-3.5 mb-3">
                    <span className="text-4xl shrink-0 select-none bg-slate-950 p-2.5 rounded-xl border border-slate-700">{game.emoji}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono font-bold bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded-sm uppercase">GAME {idx + 1}</span>
                        <span className="text-[8px] font-mono text-slate-400 font-bold">· {game.skills[0]}</span>
                      </div>
                      <h5 className="text-sm font-black text-white mt-1">{game.name}</h5>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">{game.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchGame(game)}
                    className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 border-yellow-300 text-slate-950 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-4 border-b-yellow-700 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Insert Coin & Play!
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* --- STATE 2: ACTIVE GAMEPLAY SCREEN --- */}
        {gameState === "playing" && selectedGame && (
          <div className="bg-slate-950 rounded-[28px] p-5 md:p-7 min-h-[400px] flex flex-col justify-between border-2 border-slate-800">
            {/* Gameplay Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedGame(null);
                    setGameState("idle");
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[8px] font-mono font-bold text-yellow-400 uppercase tracking-widest bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-900">
                    Active Game Console
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">{selectedGame.name}</h4>
                </div>
              </div>

              {/* Live Timer if applicable, otherwise star count */}
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-yellow-400 font-mono font-bold">
                {selectedGame.gameplayType === "tap_timer" ? (
                  <>
                    <span>⏱️ TIMER:</span>
                    <span className="text-white animate-pulse">{gameTimer}s</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-yellow-400 stroke-none" />
                    <span>SCORE: {score}</span>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Game Board content based on gameplayType */}
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              {/* Question / Guide banner */}
              {questionText && (
                <div className="w-full text-center bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-white font-bold text-xs sm:text-sm mb-6 max-w-lg leading-relaxed select-none">
                  {questionText}
                </div>
              )}

              {/* Type A: GRID (Speed Grid / Space Jump / Phonics letter tapper) */}
              {selectedGame.gameplayType === "grid" && (
                <div className="grid grid-cols-3 gap-3 max-w-[340px] w-full">
                  {gridItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleGridTap(item.id, item.val)}
                      disabled={item.clicked}
                      className={`h-18 rounded-2xl font-black text-lg flex items-center justify-center transition-all cursor-pointer select-none border-b-6 ${
                        item.clicked
                          ? "bg-slate-800 border-slate-900 text-slate-600 border-b-2 opacity-50 cursor-not-allowed scale-95"
                          : "bg-indigo-600 hover:bg-indigo-500 border-indigo-400 hover:border-indigo-300 text-white border-b-6 border-b-indigo-850 active:scale-95 active:border-b-2"
                      }`}
                    >
                      {item.val}
                    </button>
                  ))}
                </div>
              )}

              {/* Type B: MATCH Selection (banana count, size comparer, shapes) */}
              {selectedGame.gameplayType === "match" && (
                <div className="space-y-4 max-w-sm w-full select-none">
                  {/* If we have dynamic matched lists */}
                  {matchLeft.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left list */}
                      <div className="space-y-2">
                        {matchLeft.map((item) => {
                          const isMatched = !!matches[item.id];
                          const isSelected = selectedLeft === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                playClickSound();
                                if (!isMatched) setSelectedLeft(item.id);
                              }}
                              disabled={isMatched}
                              className={`w-full p-3 rounded-xl border-2 font-bold text-xs text-left transition-all cursor-pointer ${
                                isMatched
                                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 opacity-60 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-yellow-400 text-slate-950 border-yellow-300"
                                  : "bg-slate-800 border-slate-700 hover:border-slate-500 text-white"
                              }`}
                            >
                              {item.text} {isMatched && "✔️"}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right list */}
                      <div className="space-y-2">
                        {matchRight.map((item) => {
                          const isMatched = Object.values(matches).includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (selectedLeft) {
                                  handleMatchPairTap(selectedLeft, item.id);
                                  setSelectedLeft(null);
                                }
                              }}
                              disabled={isMatched || !selectedLeft}
                              className={`w-full p-3 rounded-xl border-2 font-bold text-xs text-left transition-all cursor-pointer ${
                                isMatched
                                  ? "bg-emerald-950/40 border-emerald-800 text-emerald-400 opacity-60 cursor-not-allowed"
                                  : selectedLeft
                                  ? "bg-indigo-900 border-indigo-700 hover:bg-indigo-850 text-white"
                                  : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {item.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Simple single choice selection list */
                    <div className="grid grid-cols-2 gap-3.5">
                      {inputChoices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleChoiceSelect(choice)}
                          className="p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border-b-4 border-slate-950 hover:border-slate-800 active:scale-95 transition-all text-center cursor-pointer"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type C: SORT (Healthy/Junk, Habitats, Living/Non-living) */}
              {selectedGame.gameplayType === "sort" && sortItems.length > 0 && (
                <div className="w-full flex flex-col items-center gap-6 select-none">
                  {/* Floating active item */}
                  <motion.div
                    key={sortItems[0].id}
                    initial={{ scale: 0.5, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="bg-slate-800 border-4 border-yellow-400 p-6 rounded-[24px] flex flex-col items-center gap-2 shadow-xl shrink-0"
                  >
                    <span className="text-5xl filter drop-shadow-md select-none">{sortItems[0].icon}</span>
                    <span className="text-xs font-black text-white">{sortItems[0].name}</span>
                  </motion.div>

                  {/* Bin triggers */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <button
                      onClick={() => handleSortItem(sortItems[0].id, "left")}
                      className="p-4 rounded-2xl bg-indigo-950/50 hover:bg-indigo-900/60 border-2 border-indigo-700 hover:border-indigo-500 text-indigo-200 transition-all font-black text-xxs sm:text-xs text-center cursor-pointer"
                    >
                      👈 Sort Left Into:
                      <div className="text-white mt-1 text-xs">{binLeft}</div>
                    </button>

                    <button
                      onClick={() => handleSortItem(sortItems[0].id, "right")}
                      className="p-4 rounded-2xl bg-teal-950/50 hover:bg-teal-900/60 border-2 border-teal-700 hover:border-teal-500 text-teal-200 transition-all font-black text-xxs sm:text-xs text-center cursor-pointer"
                    >
                      👉 Sort Right Into:
                      <div className="text-white mt-1 text-xs">{binRight}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Type D: INPUT Sums, Spelling Decoder */}
              {selectedGame.gameplayType === "input" && (
                <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type your smart answer..."
                    className="w-full p-4 bg-slate-900 border-4 border-slate-700 rounded-2xl text-white font-bold text-center text-sm focus:outline-hidden focus:border-yellow-400 shadow-inner"
                  />
                  <button
                    onClick={handleInputSubmit}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs py-3.5 px-6 rounded-xl shadow-md border-b-4 border-b-yellow-700 transition-all active:scale-95 cursor-pointer"
                  >
                    Verify Answer Code! 🚀
                  </button>
                </div>
              )}

              {/* Type E: TAP TIMER germ pops, teeth brush */}
              {selectedGame.gameplayType === "tap_timer" && (
                <div className="w-full flex flex-col items-center gap-6 select-none">
                  <div className="flex flex-wrap justify-center gap-3.5 max-w-sm">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          playPopSound();
                          setScore((prev) => prev + 1);
                        }}
                        className="h-14 w-14 rounded-full bg-slate-900 border-2 border-emerald-500 hover:bg-emerald-950/40 hover:border-emerald-400 flex items-center justify-center text-2xl shadow-md shrink-0 cursor-pointer"
                      >
                        {selectedGame.id === "life-g2" ? "🦷" : selectedGame.id === "evs-g3" ? "🌱" : selectedGame.id === "lang-g8" ? "🎈" : selectedGame.id === "life-g9" ? "📱" : "🦠"}
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-center font-mono text-[10px] text-slate-400">
                    TAP REPEATEDLY AS QUICKLY AS YOU CAN TO INCREASE CLEAN SCORE!
                  </div>
                </div>
              )}

              {/* Type F: FREE DRAW CANVAS (Art magic canvas) */}
              {selectedGame.gameplayType === "canvas" && (
                <div className="w-full flex flex-col items-center gap-4 select-none">
                  {/* Drawing toolbar */}
                  <div className="flex gap-2 items-center bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    {(["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"]).map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          playClickSound();
                          setBrushColor(col);
                        }}
                        style={{ backgroundColor: col }}
                        className={`h-6 w-6 rounded-full border-2 cursor-pointer transition-all ${
                          brushColor === col ? "border-white scale-115 ring-2 ring-slate-400" : "border-slate-800"
                        }`}
                      />
                    ))}
                    <div className="h-5 w-0.5 bg-slate-800 mx-1" />
                    <button
                      onClick={clearCanvas}
                      className="text-[9px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 cursor-pointer transition-all"
                    >
                      CLEAR CANVAS 🧹
                    </button>
                    <button
                      onClick={() => {
                        playSynthBeep("success");
                        setGameState("completed");
                        setGameStars(3);
                        speakClientSide("Sensational jungle masterpiece drawing! You are an incredible artist!");
                      }}
                      className="text-[9px] font-mono font-bold bg-yellow-400 text-slate-950 px-2.5 py-1 rounded-md border border-yellow-300 cursor-pointer hover:bg-yellow-500 transition-all"
                    >
                      FINISH WORK 🎨
                    </button>
                  </div>

                  {/* Draw Frame */}
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={220}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="bg-white rounded-2xl border-4 border-slate-800 shadow-inner cursor-crosshair max-w-full"
                  />
                </div>
              )}

              {/* Type G: STORY choices */}
              {selectedGame.gameplayType === "story" && (
                <div className="grid grid-cols-1 gap-2.5 w-full max-w-md select-none">
                  {inputChoices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleChoiceSelect(choice)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border-l-4 border-slate-600 hover:border-slate-400 active:scale-95 transition-all text-left cursor-pointer"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* End Gameplay footer info */}
            <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[9px] text-slate-500 select-none">
              <span>DEVELOPED FOR EARLY LEARNERS</span>
              <span>EARN BADGES BY EXCELLING</span>
            </div>
          </div>
        )}

        {/* --- STATE 3: GAME COMPLETED CELEBRATION --- */}
        {gameState === "completed" && selectedGame && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 border border-slate-800 rounded-[28px] p-6 text-center space-y-6 flex flex-col justify-between min-h-[380px]"
          >
            <div className="space-y-4 py-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                <Trophy className="w-18 h-18 text-yellow-400 mx-auto transform hover:scale-110 transition-transform filter drop-shadow-md" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-3 py-1 rounded-full inline-block">
                  RETRO STAGE CLEARED!
                </span>
                <h4 className="text-xl font-heading font-black text-white mt-2">Victory in {selectedGame.name}!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-bold mt-1">
                  You cracked the puzzles, trained your reflexes, and gained magical knowledge stickers!
                </p>
              </div>

              {/* Stars earned */}
              <div className="flex justify-center gap-1.5 select-none pt-2">
                {Array.from({ length: gameStars }).map((_, i) => (
                  <Star key={i} className="w-7 h-7 fill-yellow-400 stroke-none animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>

            {/* Action controls */}
            <div className="space-y-2 select-none">
              <button
                onClick={handleSaveGameProgress}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md border-b-4 border-b-emerald-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Collect Star Badges & Back to Cabinets
              </button>
              
              <button
                onClick={() => handleLaunchGame(selectedGame)}
                className="w-full text-slate-400 hover:text-white font-black text-xs py-2 hover:bg-slate-900 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Play Again!
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Arcade Margins credit info */}
      <div className="text-center text-[10px] text-slate-400 select-none font-bold">
        🕹️ insert coin • play freely • build standard 1 superpowers!
      </div>
    </div>
  );
}
