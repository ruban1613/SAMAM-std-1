export interface KidSkill {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  funFact: string;
  activityName: string;
  badge: string;
  interactiveSound: string;
}

export const kidSkillsData: KidSkill[] = [
  {
    id: "numbers",
    name: "Maths Wizardry",
    icon: "🔢",
    color: "from-amber-400 to-orange-500",
    bgGradient: "bg-gradient-to-r from-amber-50 to-orange-50",
    description: "Learn to count to 100, add magic stars, and trace geometric portals!",
    funFact: "Did you know that the number 0 was invented by brilliant math explorers in ancient India?",
    activityName: "Chiku's Speed Grid Game",
    badge: "🔢 Numbers Master",
    interactiveSound: "pop"
  },
  {
    id: "words",
    name: "Word Sorcery",
    icon: "🗣️",
    color: "from-blue-400 to-indigo-600",
    bgGradient: "bg-gradient-to-r from-blue-50 to-indigo-50",
    description: "Read phonics adventures, find hidden words, and chat with AI buddies!",
    funFact: "The word 'bookworm' was coined hundreds of years ago to describe bugs that eat paper!",
    activityName: "Visual Word Matcher",
    badge: "🗣️ Phonics Hero",
    interactiveSound: "sparkle"
  },
  {
    id: "nature",
    name: "Eco Explorer",
    icon: "🌿",
    color: "from-emerald-400 to-teal-600",
    bgGradient: "bg-gradient-to-r from-emerald-50 to-teal-50",
    description: "Learn about the animal kingdom, water cycles, and magical plant growth!",
    funFact: "Plants listen to music! Playing happy music actually helps flowers grow faster!",
    activityName: "Pathfinder EVS Explorer",
    badge: "🌿 Nature Knight",
    interactiveSound: "breeze"
  },
  {
    id: "art",
    name: "Doodle Alchemist",
    icon: "🎨",
    color: "from-pink-400 to-rose-600",
    bgGradient: "bg-gradient-to-r from-pink-50 to-rose-50",
    description: "Mix primary colors, draw gorgeous doodles, and build magical visual designs!",
    funFact: "If you mix Red and Yellow, you make orange! If you mix Blue and Yellow, you get green!",
    activityName: "Interactive Visual Dict",
    badge: "🎨 Creative Legend",
    interactiveSound: "pop"
  },
  {
    id: "empathy",
    name: "Heart Guardian",
    icon: "💖",
    color: "from-purple-400 to-fuchsia-600",
    bgGradient: "bg-gradient-to-r from-purple-50 to-fuchsia-50",
    description: "Learn sharing, positive words, dynamic emotions, and wonderful life skills!",
    funFact: "A warm hug releases happy molecules in your brain called oxytocin, making you feel super cozy!",
    activityName: "AIBuddy Emotion Quest",
    badge: "💖 Empathy Champion",
    interactiveSound: "heart"
  }
];
