import { SubjectConfig, SubjectType, Chapter, QuizQuestion } from "../types";

export const SUBJECT_METADATA: Record<SubjectType, { name: string; emoji: string; tagline: string; description: string; badgeColor: string; gradient: string }> = {
  math: {
    name: "Mathematics",
    emoji: "🔢",
    tagline: "Numbers are secret treasure codes!",
    description: "Let's discover numbers, patterns, and shapes through games, races, and adventures.",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    gradient: "from-blue-500 to-indigo-600",
  },
  lang: {
    name: "Language & Literacy",
    emoji: "📖",
    tagline: "Every word is a magic spell!",
    description: "Join Kiki on letter quests, word-building puzzles, and confidence storytelling.",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-200",
    gradient: "from-pink-500 to-rose-600",
  },
  evs: {
    name: "Discovery / EVS",
    emoji: "🌿",
    tagline: "The world is your magic laboratory!",
    description: "Explore your body, nature, animals, and community through observation quests.",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    gradient: "from-teal-500 to-emerald-600",
  },
  art: {
    name: "Art & Craft",
    emoji: "🎨",
    tagline: "Your hands are magic wands!",
    description: "Mix colors, draw storytelling lines, and create beautiful clay models. No wrong answers here!",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    gradient: "from-orange-500 to-amber-600",
  },
  life: {
    name: "Life Skills",
    emoji: "💡",
    tagline: "Being a good human is the greatest superpower!",
    description: "Learn daily self-care, explore your emotions, work in teams, and stay safe.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    gradient: "from-purple-500 to-fuchsia-600",
  }
};

// Chapter titles & icons for all 5 Standards and 5 Subjects (exactly 9 chapters each)
const TITLES_DB: Record<number, Record<SubjectType, { title: string; icon: string }[]>> = {
  1: {
    math: [
      { title: "Hello Numbers! (1-10)", icon: "1️⃣" },
      { title: "Big & Small, More & Less", icon: "⚖️" },
      { title: "Number Friends (11-20)", icon: "🎯" },
      { title: "Add It Up!", icon: "➕" },
      { title: "Take Away!", icon: "➖" },
      { title: "Shapes All Around", icon: "🔴" },
      { title: "Pattern Magic", icon: "🔁" },
      { title: "Measuring Fun!", icon: "📏" },
      { title: "Number Families (21-100)", icon: "💯" },
      { title: "Let's Do Money & Coins", icon: "🪙" }
    ],
    lang: [
      { title: "The Alphabet Kingdom", icon: "🔤" },
      { title: "My First Words", icon: "🏷️" },
      { title: "Listen & Speak!", icon: "🎙️" },
      { title: "Story Time with Chiku", icon: "🐵" },
      { title: "My First Sentences", icon: "✏️" },
      { title: "Rhyme & Rhythm", icon: "🎵" },
      { title: "Silent Letters & Sounds", icon: "🔈" },
      { title: "Magic Action Words", icon: "🏃" },
      { title: "Show & Tell Masters", icon: "📢" },
      { title: "My First Storybook", icon: "📚" }
    ],
    evs: [
      { title: "My Body, My Self", icon: "🧍" },
      { title: "My Family & Home", icon: "🏡" },
      { title: "Plants & Trees Around Us", icon: "🌳" },
      { title: "Animals - Our Friends", icon: "🦁" },
      { title: "Community Heroes", icon: "🦺" },
      { title: "Sunny or Rainy?", icon: "☁️" },
      { title: "Healthy Food", icon: "🍏" },
      { title: "Water is Life", icon: "💧" },
      { title: "Our Beautiful Earth", icon: "🌍" },
      { title: "Sky and Stars Adventure", icon: "🌌" }
    ],
    art: [
      { title: "Colors Are Feelings", icon: "🌈" },
      { title: "Lines Tell Stories", icon: "〰️" },
      { title: "Finger Painting Fun", icon: "🤚" },
      { title: "Clay Play & Modeling", icon: "🧸" },
      { title: "Paper Collage Day", icon: "✂️" },
      { title: "Origami Animals", icon: "🦒" },
      { title: "Leaf Printing Magic", icon: "🍃" },
      { title: "Sponge Dabbing Fun", icon: "🧽" },
      { title: "My Dream Castle", icon: "🏰" },
      { title: "My Masterpiece Canvas", icon: "🖌️" }
    ],
    life: [
      { title: "Good Habits Hero", icon: "🪥" },
      { title: "Feelings & Emotions", icon: "😊" },
      { title: "Sharing is Caring", icon: "🤝" },
      { title: "Listening Ears", icon: "👂" },
      { title: "Table Manners", icon: "🍽️" },
      { title: "Safe & Sound", icon: "🚦" },
      { title: "Saving Electricity", icon: "💡" },
      { title: "Neat & Tidy Room", icon: "🧹" },
      { title: "Belly Breathing Calm", icon: "🌬️" },
      { title: "Superpower of Kindness", icon: "💖" }
    ]
  },
  2: {
    math: [
      { title: "Place Value Castle", icon: "🏰" },
      { title: "Carry-Over Sums", icon: "🚀" },
      { title: "Borrowing Magic", icon: "🎈" },
      { title: "Skip Counting Joy", icon: "🐇" },
      { title: "Fun Multiplication", icon: "✖️" },
      { title: "Time and Clocks", icon: "⏰" },
      { title: "Calendar Explorers", icon: "📅" },
      { title: "Measuring Centimeters", icon: "📏" },
      { title: "3D Shapes & Solids", icon: "🧊" },
      { title: "Fractions and Parts", icon: "🍰" }
    ],
    lang: [
      { title: "Vowel Teams", icon: "🥖" },
      { title: "Naming Nouns", icon: "🏷️" },
      { title: "Pronoun Buddies", icon: "👥" },
      { title: "Sparkly Adjectives", icon: "✨" },
      { title: "Action Verbs", icon: "🏃" },
      { title: "Synonym Treasures", icon: "💎" },
      { title: "Asking Words", icon: "❓" },
      { title: "My Daily Diary", icon: "📝" },
      { title: "Buddy Story Teller", icon: "📖" },
      { title: "My First Poem", icon: "✍️" }
    ],
    evs: [
      { title: "Our Inner Body Wonders", icon: "🧠" },
      { title: "Types of Shelters", icon: "🏡" },
      { title: "Farm to Plate Journey", icon: "🌾" },
      { title: "Plant Lifecycle Discovery", icon: "🌱" },
      { title: "Our Neighbours & Places", icon: "⛪" },
      { title: "Fresh Air & Water", icon: "💨" },
      { title: "Seasons and Clothes", icon: "⛅" },
      { title: "Vehicles of the World", icon: "🚀" },
      { title: "Sending Messages", icon: "📱" },
      { title: "My Clean Neighborhood", icon: "🧹" }
    ],
    art: [
      { title: "Secondary Colors", icon: "🎨" },
      { title: "Symmetry Butterfly", icon: "🦋" },
      { title: "Vegetable Block Printing", icon: "🧄" },
      { title: "Cardboard Box Castles", icon: "📦" },
      { title: "Stick Figure Comics", icon: "✏️" },
      { title: "Mosaic Paper Craft", icon: "🧩" },
      { title: "Mask Making Carnival", icon: "🎭" },
      { title: "Bubble Painting Art", icon: "🫧" },
      { title: "Greeting Cards", icon: "💌" },
      { title: "Pattern Designing", icon: "📐" }
    ],
    life: [
      { title: "Healthy Diet Plate", icon: "🍎" },
      { title: "Asking for Help Safely", icon: "🤝" },
      { title: "Cooperation Relay", icon: "🤸" },
      { title: "Water Conservation", icon: "💧" },
      { title: "Kindness to Pets", icon: "🐶" },
      { title: "Apologizing Politely", icon: "🌟" },
      { title: "Making My Bed", icon: "🛏️" },
      { title: "Public Speaking Stars", icon: "🎙️" },
      { title: "Mindful Breathing", icon: "🌬️" },
      { title: "My Mindful Space", icon: "🧘" }
    ]
  },
  3: {
    math: [
      { title: "Numbers to 1,000", icon: "🚀" },
      { title: "3-Digit Math Battles", icon: "⚔️" },
      { title: "Times Tables Mastery", icon: "✖️" },
      { title: "Division Sharing", icon: "➗" },
      { title: "Fractions Pizza Slice", icon: "🍕" },
      { title: "Length, Mass, & Liters", icon: "⚖️" },
      { title: "Toy Shop Budgets", icon: "💵" },
      { title: "Reading Calendar Timelines", icon: "📅" },
      { title: "Bar Charts & Graphs", icon: "📊" },
      { title: "Decimals Explorer", icon: "🪙" }
    ],
    lang: [
      { title: "Prefix & Suffix Powers", icon: "🪄" },
      { title: "Nifty Adverbs", icon: "🏃" },
      { title: "Connecting Conjunctions", icon: "🔗" },
      { title: "Tense Time Travel", icon: "⏳" },
      { title: "Comprehension Detective", icon: "🔍" },
      { title: "Plural Spelling Rules", icon: "📖" },
      { title: "Creative Story Steps", icon: "✍️" },
      { title: "Poetic Similes", icon: "🌸" },
      { title: "Conversation Pairs", icon: "💬" },
      { title: "My First Play", icon: "🎭" }
    ],
    evs: [
      { title: "Animal Habitats", icon: "🌊" },
      { title: "Photosynthesis Magic", icon: "🌱" },
      { title: "Water Cycle Wonders", icon: "🌧️" },
      { title: "Secrets of Soil", icon: "🪱" },
      { title: "Local Government & Helpers", icon: "🏛️" },
      { title: "First Aid Safety Rules", icon: "🩹" },
      { title: "Food Preservation Tricks", icon: "🍏" },
      { title: "Solar System Journey", icon: "🪐" },
      { title: "Resource Conservation", icon: "🌍" },
      { title: "Eco-System Heroes", icon: "🌳" }
    ],
    art: [
      { title: "Warm & Cool Landscapes", icon: "🎨" },
      { title: "Near and Far Perspective", icon: "🗺️" },
      { title: "Plasticine Clay Figures", icon: "🧸" },
      { title: "Thread Painting Magic", icon: "🧵" },
      { title: "Shadow Puppetry Theatre", icon: "👥" },
      { title: "Pattern Weaving Craft", icon: "🧶" },
      { title: "Sock Puppet Design", icon: "🧦" },
      { title: "Blow Painting Designs", icon: "🌬️" },
      { title: "Outdoor Sketching Day", icon: "🌲" },
      { title: "My Abstract Sculpture", icon: "🗿" }
    ],
    life: [
      { title: "Basic First Aid", icon: "🩹" },
      { title: "Cultural Respect", icon: "🌍" },
      { title: "Creative Problem Solving", icon: "💡" },
      { title: "Plastic-Free Living", icon: "♻️" },
      { title: "Time Management Plans", icon: "⏰" },
      { title: "Dealing with Anger", icon: "😤" },
      { title: "Setting Personal Goals", icon: "🎯" },
      { title: "Empathy & Friendship", icon: "🤝" },
      { title: "Mindfulness Meditation", icon: "🧘‍♀️" },
      { title: "Our Diverse Culture", icon: "🤝" }
    ]
  },
  4: {
    math: [
      { title: "Multi-Digit Arithmetic", icon: "🧮" },
      { title: "Division with Remainders", icon: "➗" },
      { title: "Equivalent Fractions", icon: "🥞" },
      { title: "Decimal Introduction", icon: "🪙" },
      { title: "Area & Perimeter Battles", icon: "📐" },
      { title: "Angle Safari (Acute, Obtuse)", icon: "📐" },
      { title: "Telling Time to Minutes", icon: "⏱️" },
      { title: "Data Collection & Tallying", icon: "📋" },
      { title: "Math Logic Riddles", icon: "🧩" }
    ],
    lang: [
      { title: "Noun-Pronoun Agreement", icon: "🗣️" },
      { title: "Irregular Verbs", icon: "📖" },
      { title: "Adverbs vs Adjectives", icon: "✨" },
      { title: "Preposition Island", icon: "🏝️" },
      { title: "Punctuation Perfection", icon: "✍️" },
      { title: "Homophones Hunt (Their/There)", icon: "🏹" },
      { title: "Paragraph Construction", icon: "📝" },
      { title: "Metaphors & Idioms", icon: "🌟" },
      { title: "Debating Skills", icon: "🎙️" }
    ],
    evs: [
      { title: "Digestive System Road", icon: "🍏" },
      { title: "States of Matter", icon: "💨" },
      { title: "Force, Work, & Energy", icon: "⚡" },
      { title: "Our Environment Ecosystems", icon: "🌲" },
      { title: "Waste Management 3Rs", icon: "♻️" },
      { title: "History of Clothes", icon: "🧣" },
      { title: "Farming & Agriculture", icon: "🚜" },
      { title: "Map Reading Adventures", icon: "🗺️" },
      { title: "Natural Disasters Alert", icon: "🌋" }
    ],
    art: [
      { title: "Monochrome Shades", icon: "🎨" },
      { title: "Silhouette Sunset", icon: "🌇" },
      { title: "Abstract Shape Collage", icon: "🧩" },
      { title: "Clay Relief Murals", icon: "🧱" },
      { title: "Stained Glass Paper Art", icon: "🪟" },
      { title: "3D Paper Crafting", icon: "✂️" },
      { title: "Weaving with Yarn", icon: "🧶" },
      { title: "Portrait Basics", icon: "👤" },
      { title: "Festival Poster Design", icon: "📣" }
    ],
    life: [
      { title: "Digital Safety Basics", icon: "💻" },
      { title: "Active Listening", icon: "👂" },
      { title: "Money Savings Jar", icon: "🏦" },
      { title: "Coping with Stress", icon: "🧘" },
      { title: "Energy Conservation", icon: "🔌" },
      { title: "Empathy Exercises", icon: "🤝" },
      { title: "Leadership in Team Games", icon: "👑" },
      { title: "Time Allocation Chart", icon: "📈" },
      { title: "Deep Focus Breathing", icon: "🌬️" }
    ]
  },
  5: {
    math: [
      { title: "Decimals & Percentages", icon: "🔢" },
      { title: "Fractions Multiplication", icon: "🥞" },
      { title: "Ratios & Proportions", icon: "⚖️" },
      { title: "Volume & Capacity Math", icon: "🧪" },
      { title: "Algebraic Codebreaking", icon: "🔑" },
      { title: "Graphing Coordinate Planes", icon: "📈" },
      { title: "Average & Mean Calculations", icon: "📊" },
      { title: "Advanced Symmetry & Rotation", icon: "🔄" },
      { title: "Cryptographic Math Riddles", icon: "🕵️" }
    ],
    lang: [
      { title: "Complex Sentence Building", icon: "🔗" },
      { title: "Active vs Passive Voice", icon: "📣" },
      { title: "Direct & Indirect Speech", icon: "💬" },
      { title: "Conjunctions & Clauses", icon: "📖" },
      { title: "Research Essay Writing", icon: "📝" },
      { title: "Vocabulary Expansion Quest", icon: "📚" },
      { title: "Analyzing Character Arcs", icon: "🎭" },
      { title: "Poetry Composition", icon: "🖋️" },
      { title: "Formal Public Speaking", icon: "🎙️" }
    ],
    evs: [
      { title: "Respiratory & Circulatory Systems", icon: "🫁" },
      { title: "The Solar System & Beyond", icon: "🚀" },
      { title: "Simple Machines", icon: "⚙️" },
      { title: "Adaptation in Extreme Climates", icon: "🌵" },
      { title: "Fossil Fuels vs Green Energy", icon: "☀️" },
      { title: "Ancient Civilizations", icon: "🏺" },
      { title: "Water Treatment Processes", icon: "🧪" },
      { title: "Natural Ecosystem Preservation", icon: "🦌" },
      { title: "Global Warming Solutions", icon: "🌍" }
    ],
    art: [
      { title: "Color Harmony Wheels", icon: "🎨" },
      { title: "Landscape Depth & Tones", icon: "🏞️" },
      { title: "Advanced Clay Sculptures", icon: "🗽" },
      { title: "String and Ink Abstract Art", icon: "✒️" },
      { title: "Origami Sculpting", icon: "🦢" },
      { title: "Batik Paper Painting", icon: "🕯️" },
      { title: "Still Life Sketching", icon: "🏺" },
      { title: "Stop-Motion Frame Basics", icon: "📸" },
      { title: "Community Mural Painting", icon: "🧱" }
    ],
    life: [
      { title: "Cybersecurity Master", icon: "🔒" },
      { title: "Conflict Resolution Circle", icon: "🤝" },
      { title: "Setting SMART Goals", icon: "🎯" },
      { title: "Carbon Footprint Reducer", icon: "🌱" },
      { title: "Time Scheduling Strategy", icon: "📅" },
      { title: "Emotional Self-Regulation", icon: "🧠" },
      { title: "Peer Mediation", icon: "⚖️" },
      { title: "Simple Budget Planning", icon: "💰" },
      { title: "Daily Meditation Practice", icon: "🧘‍♂️" }
    ]
  }
};

// Generates static high-quality quiz questions dynamically for any chapter based on subject/standard
function generateQuizQuestionsForChapter(
  subject: SubjectType,
  std: number,
  chNum: number,
  chTitle: string
): QuizQuestion[] {
  const baseId = `${subject}-std${std}-ch${chNum}-q1`;
  
  if (subject === "math") {
    return [
      {
        id: baseId,
        question: `What is the key mathematical focus of "${chTitle}"? 🧠`,
        options: [
          `Solving challenges using core mathematical techniques`,
          `Skipping math exercises completely`,
          `Memorizing without understanding`,
          `Playing other non-math video games`
        ],
        correctAnswer: `Solving challenges using core mathematical techniques`,
        explanation: `Splendid! As a math wizard, you tackle "${chTitle}" using logical, level-appropriate methods! 🏆`
      }
    ];
  } else if (subject === "lang") {
    return [
      {
        id: baseId,
        question: `How do we spell or understand words in "${chTitle}"? ✏️`,
        options: [
          `By applying active reading and vocabulary skills`,
          `By writing backwards in secret code`,
          `By ignoring vowels completely`,
          `By guessing with closed eyes`
        ],
        correctAnswer: `By applying active reading and vocabulary skills`,
        explanation: `Fabulous! You are building excellent communication and spelling habits! 📖✨`
      }
    ];
  } else {
    return [
      {
        id: baseId,
        question: `What do we discover during "${chTitle}"? 🌟`,
        options: [
          `New science, art, and life skill insights`,
          `That learning is boring and static`,
          `Only how to sleep better`,
          `Nothing new about our world`
        ],
        correctAnswer: `New science, art, and life skill insights`,
        explanation: `Perfect! Every explorer knows that "${chTitle}" opens up gorgeous new windows of discovery! 🌍💫`
      }
    ];
  }
}

// Curriculum retriever for a specific Standard
export function getCurriculumForStandard(std: number): SubjectConfig[] {
  // Clamp standard level between 1 and 5
  const clampedStd = Math.max(1, Math.min(5, std));
  const titlesForStd = TITLES_DB[clampedStd];

  return (["math", "lang", "evs", "art", "life"] as SubjectType[]).map((subId) => {
    const meta = SUBJECT_METADATA[subId];
    const chDefs = titlesForStd[subId] || [];

    const chapters: Chapter[] = chDefs.map((def, idx) => {
      const chNum = idx + 1;
      const chId = `${subId}-std${clampedStd}-ch${chNum}`;
      
      return {
        id: chId,
        num: chNum,
        title: def.title,
        icon: def.icon,
        summary: `Explore ${def.title} as part of our core learning program!`,
        description: `Welcome to ${def.title}! In this chapter, we dive deep into key learning skills. We will work together with our mascots to discover secrets, trace ideas, and complete hands-on activities!`,
        skills: [`${meta.name} Basics`, `Core Learning`, `Topic Exploration`],
        sampleActivityName: `${def.title} Active Hunt`,
        sampleActivitySteps: [
          `Buddy mascot introduces the main objective of ${def.title}.`,
          `Children work in teams or individually to solve interactive challenges.`,
          `Verify steps with your teacher to earn a custom sticker!`
        ],
        storyStarter: `One bright morning, our buddy mascot started exploring ${def.title} and found a mysterious clue...`,
        quiz: generateQuizQuestionsForChapter(subId, clampedStd, chNum, def.title)
      };
    });

    const signatureGame = subId === "math" ? {
      id: "speedgrid",
      emoji: "🏎️",
      name: "Speed Grid Challenge",
      description: "A fun speed test where numbers appear on the grid and you tap them in order as fast as you can!",
      skills: ["Number Recognition", "Ordering", "Quick Reflexes"],
    } : subId === "lang" ? {
      id: "pathfinder",
      emoji: "🗺️",
      name: "Pathfinders' Chronicle",
      description: "A fun letter puzzle where letters are scrambled and you drag/tap them to spell the correct words!",
      skills: ["Spelling", "Phonics", "Word Building"],
    } : {
      id: `${subId}_game`,
      emoji: meta.emoji,
      name: `${meta.name} Explorer's Arena`,
      description: `Test your skills in ${meta.name} through core matching games!`,
      skills: ["Topic Mastery", "Interactive Choice"],
    };

    return {
      id: subId,
      name: meta.name,
      emoji: meta.emoji,
      tagline: meta.tagline,
      description: meta.description,
      badgeColor: meta.badgeColor,
      gradient: meta.gradient,
      chapters,
      signatureGame
    };
  });
}

// Backward compatibility: Default export matches Standard 1
export const CURRICULUM = getCurriculumForStandard(1);
