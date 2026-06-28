import { Chapter, SubjectType } from "../types";

export interface BookPage {
  pageNumber: number;
  type: "story" | "explanation" | "vocabulary" | "exercise" | "fill_blank" | "match_following" | "qa" | "review" | "celebration";
  title: string;
  subtitle?: string;
  content: string;
  audioText: string;
  imageUrl?: string;
  interactiveData?: {
    question?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    placeholder?: string;
    label?: string;
    exerciseCode?: string; // e.g. "Ex 1.1"
    
    // For Match the Following
    leftItems?: { id: string; text: string; matchId: string }[];
    rightItems?: { id: string; text: string }[];
    correctPairs?: Record<string, string>; // leftId -> rightId
    
    // For Fill in the Blank
    blankSentence?: string; // e.g. "A triangle has ___ sides."
    blankAnswer?: string; // "3"
    choices?: string[];
  };
}

// 1. LESSON CONTENT EXPLANATIONS (Page 2)
function getLessonContent(subjectId: SubjectType, chNum: number, title: string, skills: string[]): { content: string; audioText: string } {
  let content = "";
  let audioText = "";

  if (subjectId === "math") {
    if (chNum === 1) {
      content = `Let's count from 1 to 10 with our fingers! 🖐️\n\n` +
        `1️⃣ ONE: One shining sun in the sky! ☀️\n` +
        `2️⃣ TWO: Two playful little eyes! 👀\n` +
        `3️⃣ THREE: Three sweet yellow bananas! 🍌🍌🍌\n` +
        `4️⃣ FOUR: Four wheels on a family car! 🚗\n` +
        `5️⃣ FIVE: Five star fingers on your hand! 🖐️\n` +
        `6️⃣ SIX: Six buzz bees around a flower! 🐝\n` +
        `7️⃣ SEVEN: Seven colors in a pretty rainbow! 🌈\n` +
        `8️⃣ EIGHT: Eight legs on a crawling spider! 🕷️\n` +
        `9️⃣ NINE: Nine fish swimming in the pond! 🐟\n` +
        `🔟 TEN: Ten gold stars for a superstar student! ⭐`;
      audioText = "Let's count from one to ten with our fingers! One, one shining sun! Two, two playful little eyes! Three, three sweet yellow bananas! Four, four wheels on a family car! Five, five star fingers on your hand! Six, six buzz bees! Seven, seven colors in a pretty rainbow! Eight, eight legs on a crawling spider! Nine, nine fish swimming! Ten, ten gold stars for a superstar student!";
    } else if (chNum === 2) {
      content = `Let's learn about size and quantity comparison!\n\n` +
        `🐘 BIG: The Elephant is HUGE and heavy!\n` +
        `🐭 SMALL: The little Mouse is tiny and light!\n\n` +
        `🌳 TALL: A palm tree reaches high up to the sky!\n` +
        `🌱 SHORT: A small grass sprout is short and stays close to the ground!\n\n` +
        `🍎🍎🍎 MORE: A basket with three apples has MORE apples than a basket with only one apple!\n` +
        `🍎 LESS: One apple is LESS than three apples!`;
      audioText = "Let's learn about size and quantity comparison! Big: The Elephant is huge and heavy! Small: The little Mouse is tiny and light! Tall: A palm tree reaches high up to the sky! Short: A small grass sprout is short! More: A basket with three apples has more apples than a basket with only one! Less: One apple is less than three apples!";
    } else if (chNum === 3) {
      content = `Let's count double digits beyond 10, up to 20!\n\n` +
        `1️⃣1️⃣ ELEVEN (11): Ten plus one! 🌟\n` +
        `1️⃣2️⃣ TWELVE (12): Ten plus two! 🟢\n` +
        `1️⃣3️⃣ THIRTEEN (13): Ten plus three! 🥥\n` +
        `1️⃣4️⃣ FOURTEEN (14): Ten plus four! 🍊\n` +
        `1️⃣5️⃣ FIFTEEN (15): Ten plus five! 💎\n` +
        `1️⃣6️⃣ SIXTEEN (16): Ten plus six! 🍎\n` +
        `1️⃣7️⃣ SEVENTEEN (17): Ten plus seven! 🎈\n` +
        `1️⃣8️⃣ EIGHTEEN (18): Ten plus eight! 🌸\n` +
        `1️⃣9️⃣ NINETEEN (19): Ten plus nine! 🍓\n` +
        `2️⃣0️⃣ TWENTY (20): Two tens together! 🪙`;
      audioText = "Let's count double digits beyond ten, up to twenty! Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty! Twenty is two full tens together!";
    } else if (chNum === 4) {
      content = `Addition means putting things together to make a bigger group!\n\n` +
        `🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎\n` +
        `Two apples plus three apples put together make five total apples!\n\n` +
        `We write this as: 2 + 3 = 5\n\n` +
        `• The plus sign (+) means "join together"!\n` +
        `• The equals sign (=) means "makes total"!`;
      audioText = "Addition means putting things together to make a bigger group! Two apples plus three apples put together make five total apples! We write this as: two plus three equals five. The plus sign means join together, and the equals sign means makes total!";
    } else if (chNum === 5) {
      content = `Subtraction means taking things away from a group to make it smaller!\n\n` +
        `🎈🎈🎈🎈🎈 - 🎈🎈 = 🎈🎈🎈\n` +
        `If you have five colorful balloons and two fly away into the clouds, how many are left?\n\n` +
        `Let's count the leftover balloons: 1, 2, 3!\n` +
        `We write this as: 5 - 2 = 3\n\n` +
        `• The minus sign (-) means "take away" or "pop"!\n` +
        `• The equals sign (=) tells us how many are LEFT!`;
      audioText = "Subtraction means taking things away from a group to make it smaller! If you have five colorful balloons and two fly away into the clouds, how many are left? Let's count the leftover balloons: one, two, three! We write this as: five minus two equals three. The minus sign means take away or pop, and the equals sign tells us how many are left!";
    } else if (chNum === 6) {
      content = `Shapes are beautiful designs and outlines we see everywhere!\n\n` +
        `🔴 CIRCLE: Round and smooth with NO corners! Like a rolling ball ⚽ or a wall clock ⏰.\n` +
        `🟥 SQUARE: Has 4 straight sides that are all EQUAL and 4 sharp corners! Like a window 🪟.\n` +
        `🔺 TRIANGLE: Has exactly 3 straight sides and 3 pointy corners! Like a tasty slice of pizza 🍕.\n` +
        `🟦 RECTANGLE: Has 4 sides where two sides are long and two sides are short! Like a classroom door 🚪.`;
      audioText = "Shapes are beautiful designs and outlines we see everywhere! Circle: Round and smooth with no corners! Like a rolling ball or a wall clock. Square: Has four straight sides that are all equal and four sharp corners! Like a window. Triangle: Has exactly three straight sides and three pointy corners! Like a tasty slice of pizza. Rectangle: Has four sides where two sides are long and two sides are short! Like a classroom door.";
    } else if (chNum === 7) {
      content = `Patterns are magical designs that repeat in a neat order!\n\n` +
        `Let's look at this pattern of colors:\n` +
        `🔴 🔵 🔴 🔵 🔴 ... What comes next? Yes, 🔵 (Blue)!\n\n` +
        `Let's look at this pattern of fruits:\n` +
        `Apple, Banana, Apple, Banana, Apple ... What comes next? Yes, Banana! 🍎 🍌 🍎 🍌 🍎 [ 🍌 ]\n\n` +
        `Our brain loves patterns because they help us guess what comes next!`;
      audioText = "Patterns are magical designs that repeat in a neat order! Look at this pattern: Red, Blue, Red, Blue, Red... What comes next? Yes, Blue! Look at this fruit pattern: Apple, Banana, Apple, Banana, Apple... What comes next? Yes, Banana! Our brain loves patterns because they help us guess what comes next!";
    } else {
      content = `Let's master the art of Measuring!\n\n` +
        `📏 HANDSPAN: Spread your hand fingers wide! You can measure how long your book is.\n` +
        `🦶 FOOTSTEPS: Walk heel-to-toe to measure the width of your room!\n` +
        `⚖️ HEAVY vs LIGHT: A big stone is HEAVY to lift, but a bird feather is LIGHT and floats!`;
      audioText = "Let's master the art of Measuring! Handspan: Spread your hand fingers wide! You can measure how long your book is. Footsteps: Walk heel-to-toe to measure the width of your room! Heavy versus Light: A big stone is heavy to lift, but a bird feather is light and floats!";
    }
  } else if (subjectId === "evs") {
    if (chNum === 1) {
      content = `Our body is amazing! Let's meet our 5 magical sense organs:\n\n` +
        `👁️ EYES (Sight): We use our two eyes to see rainbows, colors, and books!\n` +
        `👂 EARS (Hearing): We use our two ears to listen to birds singing and music!\n` +
        `👃 NOSE (Smell): We use our nose to smell sweet flowers and yummy cupcakes!\n` +
        `👅 TONGUE (Taste): We use our tongue to taste sweet ice cream and sour lemons!\n` +
        `🖐️ SKIN/HANDS (Touch): We use our hands to touch and feel a soft teddy bear!`;
      audioText = "Our body is amazing! Let's meet our five magical sense organs! Eyes: We use our two eyes to see rainbows! Ears: We use our two ears to listen to birds singing! Nose: We use our nose to smell sweet flowers! Tongue: We use our tongue to taste sweet ice cream! Skin: We use our hands to feel a soft teddy bear!";
    } else if (chNum === 2) {
      content = `Our family is the special group of people who love and care for us!\n\n` +
        `👨‍👩‍👧 Family members can include Father, Mother, Brother, Sister, and Grandparents!\n` +
        `🏡 We live together in a warm house called a Home.\n` +
        `🧹 We can help our family by picking up our toys after playing, keeping our rooms neat, and saying polite words!`;
      audioText = "Our family is the special group of people who love and care for us! Family members can include Father, Mother, Brother, Sister, and Grandparents! We live together in a warm house called a Home. We can help our family by picking up our toys after playing, keeping our rooms neat, and saying polite words!";
    } else if (chNum === 3) {
      content = `Plants are our beautiful green friends! Let's learn how they grow:\n\n` +
        `🌱 PARTS OF A PLANT:\n` +
        `• ROOTS: Hide in the soil to drink water and hold the plant steady!\n` +
        `• STEM: The strong green straw that carries water up to the leaves!\n` +
        `• LEAVES: Flat green panels that catch warm sunlight to cook food!\n` +
        `• FLOWERS & FRUITS: Colorful petals that grow yummy apples and berries!`;
      audioText = "Plants are our beautiful green friends! Let's learn how they grow. Roots: Hide in the soil to drink water and hold the plant steady. Stem: The strong green straw that carries water up to the leaves. Leaves: Flat green panels that catch warm sunlight to cook food. Flowers and Fruits: Colorful petals that grow yummy apples and berries.";
    } else if (chNum === 4) {
      content = `Let's learn about animals, our friends! They are categorized into two groups:\n\n` +
        `🏡 DOMESTIC ANIMALS:\n` +
        `They are friendly and live with us as pets or on farms. Examples:\n` +
        `• DOG 🐶: Wags its tail and guards our home!\n` +
        `• CAT 🐱: Purrs softly and loves drinking milk!\n` +
        `• COW 🐄: Gives us fresh, healthy milk to drink!\n\n` +
        `🌳 WILD ANIMALS:\n` +
        `They live freely in the deep jungle forest. Examples:\n` +
        `• LION 🦁: The King of the Jungle with a mighty ROAR!\n` +
        `• ELEPHANT 🐘: A giant animal with huge floppy ears and a long water trunk!\n` +
        `• BEAR 🐻: A big furry animal that loves eating sweet forest honey!`;
      audioText = "Let's learn about animals, our friends! They are categorized into two groups: Domestic animals and Wild animals. Domestic animals are friendly and live with us as pets or on farms, like Dogs, Cats, and Cows. Wild animals live freely in the deep jungle forest, like Lions, Elephants, and Bears. The Lion is the King of the Jungle. The Elephant has a long trunk. The Bear loves sweet forest honey!";
    } else {
      content = `Our neighborhood is full of amazing Community Heroes who help us every day!\n\n` +
        `🧑‍⚕️ DOCTORS: Help us heal and feel strong when we are sick!\n` +
        `🧑‍🌾 FARMERS: Work hard in fields to grow our healthy vegetables and grains!\n` +
        `🧑‍🏫 TEACHERS: Help us read, write, draw, and learn cool things!\n` +
        `🧑‍🚒 FIREFIGHTERS: Put out dangerous fires and rescue sweet animals!`;
      audioText = "Our neighborhood is full of amazing Community Heroes who help us every day! Doctors help us heal when we are sick. Farmers work hard in fields to grow our healthy vegetables and grains. Teachers help us read, write, and learn. Firefighters put out dangerous fires and rescue sweet animals.";
    }
  } else if (subjectId === "lang") {
    if (chNum === 1) {
      content = `Every letter in our Alphabet Kingdom makes a special sound!\n\n` +
        `🍎 A says 'Ah' like Apple!\n` +
        `🎈 B says 'Buh' like Ball!\n` +
        `🐱 C says 'Cuh' like Cat!\n` +
        `🐶 D says 'Duh' like Dog!\n` +
        `🥚 E says 'Eh' like Egg!\n` +
        `🐟 F says 'Fuh' like Fish!\n\n` +
        `Let's practice repeating these letter sounds aloud with Kiki!`;
      audioText = "Every letter in our Alphabet Kingdom makes a special sound! A says Ah like Apple. B says Buh like Ball. C says Cuh like Cat. D says Duh like Dog. E says Eh like Egg. F says Fuh like Fish. Let's practice repeating these letter sounds aloud with Kiki!";
    } else if (chNum === 2) {
      content = `Let's join letter sounds together to build our very first words!\n\n` +
        `🐱 C - A - T makes CAT! A furry pet that meows.\n` +
        `🐶 D - O - G makes DOG! A loyal friend that barks.\n` +
        `☀️ S - U - N makes SUNSpell the sun! The hot, yellow circle in the sky.\n` +
        `📦 B - O - X makes BOX! A nice square container for your toys.`;
      audioText = "Let's join letter sounds together to build our very first words! C-A-T makes CAT, a furry pet that meows. D-O-G makes DOG, a loyal friend that barks. S-U-N makes SUN, the hot yellow circle in the sky. B-O-X makes BOX, a nice square container for your toys.";
    } else if (chNum === 3) {
      content = `Speaking and listening are magic superpowers of communication!\n\n` +
        `👂 LISTENING: Pay attention with your ears, stay quiet, and keep eyes on the speaker.\n` +
        `🗣️ SPEAKING: Use a clear, pleasant, and confident voice to tell your story.\n` +
        `💖 POLITE WORDS: Remember to always say 'Please' when asking, and 'Thank You' when receiving!`;
      audioText = "Speaking and listening are magic superpowers of communication! Listening: Pay attention with your ears, stay quiet, and keep eyes on the speaker. Speaking: Use a clear, pleasant, and confident voice to tell your story. Polite words: Remember to always say Please when asking, and Thank You when receiving!";
    } else {
      content = `A sentence is a beautiful group of words that tells a full story!\n\n` +
        `For example:\n` +
        `• "The cat is big." 🐱\n` +
        `• "The apple is red." 🍎\n\n` +
        `Remember these two magic rules:\n` +
        `1️⃣ EVERY sentence starts with a big Capital Letter (like T, A, S)!\n` +
        `2️⃣ EVERY sentence ends with a little full stop period (.) to show we are done!`;
      audioText = "A sentence is a beautiful group of words that tells a full story! For example: The cat is big, or The apple is red. Remember these two magic rules: One, every sentence starts with a big Capital Letter. Two, every sentence ends with a little full stop period.";
    }
  } else {
    // Fallback for Art, Life, and others
    content = `${title}\n\nKey Concepts:\n` +
      `✨ Learn with a positive heart.\n` +
      `✨ Practice makes us confident!\n` +
      `✨ Ask questions and explore daily!`;
    audioText = `${title}. Let's learn with a positive heart, practice to gain confidence, and ask questions daily!`;
  }

  return { content, audioText };
}

// 2. VOCABULARY ITEMS PICTURE DICTIONARY (Page 3)
function getVocabularyItems(subjectId: SubjectType, chNum: number, skills: string[]): { title: string; subtitle: string; content: string; audioText: string } {
  let title = "Picture Word Dictionary";
  let subtitle = "Tap each card to register the image and pronunciation! 🔊";
  let items: string[] = [];

  if (subjectId === "math") {
    title = "Math Count Board";
    if (chNum === 1) {
      items = [
        "⭐ 1 🍎 - One Apple",
        "⭐ 2 🍌 - Two Bananas",
        "⭐ 3 🥥 - Three Coconuts",
        "⭐ 4 🍊 - Four Oranges",
        "⭐ 5 🖐️ - Five Fingers",
        "⭐ 10 ⭐ - Ten Stars"
      ];
    } else if (chNum === 2) {
      items = [
        "⭐ 🐘 - Giant Elephant (BIG!)",
        "⭐ 🐭 - Tiny Mouse (SMALL!)",
        "⭐ 🌳 - Tall Palm Tree",
        "⭐ 🌱 - Short Sprout",
        "⭐ 🍎🍎🍎 - MORE Apples",
        "⭐ 🍎 - LESS Apples"
      ];
    } else if (chNum === 3) {
      items = [
        "⭐ 11 🌟 - Eleven Stars",
        "⭐ 12 🟢 - Twelve Beads",
        "⭐ 15 💎 - Fifteen Crystals",
        "⭐ 20 🪙 - Twenty Pennies",
        "⭐ 🔟 - Tens Place",
        "⭐ 1️⃣ - Ones Place"
      ];
    } else if (chNum === 4) {
      items = [
        "⭐ ➕ - Plus (Add)",
        "⭐ 🟰 - Equals (Total)",
        "⭐ 🍎🍎 - Two Apples",
        "⭐ 🍎🍎🍎 - Three Apples",
        "⭐ 📈 - Put Together",
        "⭐ 🔢 - Sum / Total"
      ];
    } else if (chNum === 5) {
      items = [
        "⭐ ➖ - Minus (Take Away)",
        "⭐ 🟰 - Equals (Left)",
        "⭐ 🎈🎈🎈🎈🎈 - Five Balloons",
        "⭐ 🎈🎈 - Two Popped",
        "⭐ 📉 - Leftover Items",
        "⭐ 🍒 - Berries Eaten"
      ];
    } else if (chNum === 6) {
      items = [
        "⭐ 🔴 - Round Circle",
        "⭐ 🟥 - Equal Square",
        "⭐ 🔺 - Pointy Triangle",
        "⭐ 🟦 - Long Rectangle",
        "⭐ ⚽ - Rolling Sphere",
        "⭐ 🪟 - Glass Window"
      ];
    } else {
      items = [
        "⭐ 📏 - Measuring Ruler",
        "⭐ 🖐️ - Handspan Width",
        "⭐ 🦶 - Footsteps Distance",
        "⭐ ⚖️ - Heavy Rock",
        "⭐ 🪶 - Light Feather",
        "⭐ 📊 - Compare Length"
      ];
    }
  } else if (subjectId === "evs") {
    title = "EVS Nature Board";
    if (chNum === 1) {
      items = [
        "⭐ 👁️ - Eyes for Seeing",
        "⭐ 👂 - Ears for Hearing",
        "⭐ 👃 - Nose for Smelling",
        "⭐ 👅 - Tongue for Tasting",
        "⭐ 🖐️ - Hands for Touching",
        "⭐ 🧍 - My Amazing Body"
      ];
    } else if (chNum === 2) {
      items = [
        "⭐ 👨 - Dear Father",
        "⭐ 👩 - Loving Mother",
        "⭐ 👧 - Playful Sister",
        "⭐ 🏡 - Safe cozy Home",
        "⭐ 🧸 - Pack up Toys",
        "⭐ 🌳 - My Family Tree"
      ];
    } else if (chNum === 3) {
      items = [
        "⭐ 🌱 - Tiny Seed Sprout",
        "⭐ 🪵 - Plant Roots in Soil",
        "⭐ 🌿 - Strong green Stem",
        "⭐ 🍃 - Flat sun Leaves",
        "⭐ 🌸 - Beautiful Flower",
        "⭐ 🍎 - Sweet ripe Fruit"
      ];
    } else if (chNum === 4) {
      // THE ANIMAL DICTIONARY WITH VISUALIZATION
      items = [
        "⭐ 🦁 - Wild Lion (Jungle King)",
        "⭐ 🐘 - Wild Elephant (Long Trunk)",
        "⭐ 🐻 - Wild Bear (Loves Honey)",
        "⭐ 🐶 - Domestic Dog (Wags Tail)",
        "⭐ 🐱 - Domestic Cat (Purrs Softly)",
        "⭐ 🐄 - Domestic Cow (Fresh Milk)"
      ];
    } else {
      items = [
        "⭐ 🩺 - Doctor heals sick",
        "⭐ 🧑‍🌾 - Farmer grows food",
        "⭐ 🧑‍🏫 - Teacher helps learn",
        "⭐ 🧑‍🚒 - Firefighter saves us",
        "⭐ 👮 - Police guards safety",
        "⭐ 🦺 - Community Helper"
      ];
    }
  } else if (subjectId === "lang") {
    title = "Word Power Soundboard";
    if (chNum === 1) {
      items = [
        "⭐ 🍎 - A is for Apple",
        "⭐ 🎈 - B is for Ball",
        "⭐ 🐱 - C is for Cat",
        "⭐ 🐶 - D is for Dog",
        "⭐ 🥚 - E is for Egg",
        "⭐ 🐟 - F is for Fish"
      ];
    } else if (chNum === 2) {
      items = [
        "⭐ 🐱 C-A-T - CAT",
        "⭐ 🐶 D-O-G - DOG",
        "⭐ ☀️ S-U-N - SUN",
        "⭐ 📦 B-O-X - BOX",
        "⭐ 🧑‍🍳 P-E-N - PEN",
        "⭐ 🧢 C-A-P - CAP"
      ];
    } else if (chNum === 3) {
      items = [
        "⭐ 👂 - Listen carefully",
        "⭐ 🗣️ - Speak confidently",
        "⭐ 🤝 - Say Please",
        "⭐ 💖 - Say Thank You",
        "⭐ 🎙️ - Show and Tell",
        "⭐ 🗺️ - Adventure Clues"
      ];
    } else {
      items = [
        "⭐ 🔠 - Capital Letter start",
        "⭐ 🛑 - Full Stop period end",
        "⭐ 🐈 - The cat is big",
        "⭐ 🍎 - The apple is red",
        "⭐ ✏️ - Write neat sentences",
        "⭐ 📖 - Read exciting stories"
      ];
    }
  } else {
    // Fallback vocabulary
    items = [
      `⭐ 1. ${skills[0] || "Explore"}`,
      `⭐ 2. ${skills[1] || "Discover"}`,
      `⭐ 3. Happy Learner`,
      `⭐ 4. Magic Steps`,
      `⭐ 5. Proud Achiever`,
      `⭐ 6. Golden Star`
    ];
  }

  const content = items.join("\n");
  const audioText = `Let's practice pronouncing our picture dictionary words: ` + items.map(i => i.replace("⭐ ", "").split(" - ")[0]).join(", ") + `. Tap any card to hear it aloud!`;

  return { title, subtitle, content, audioText };
}

// 3. 10 PRACTICE EXERCISES (Pages 4 to 13)
interface ExerciseData {
  question: string;
  ans: string;
  choices: string[];
}
function getExerciseForSubjectAndChapter(subjectId: SubjectType, chNum: number, idx: number): ExerciseData {
  if (subjectId === "math") {
    if (chNum === 1) {
      const q = [
        { question: "How many apples do you see? 🍎 🍎", ans: "2", choices: ["1", "2", "3", "4"] },
        { question: "Count the sweet bananas: 🍌 🍌 🍌", ans: "3", choices: ["2", "3", "4"] },
        { question: "How many playful monkeys are in the tree? 🐵 🐵 🐵 🐵", ans: "4", choices: ["3", "4", "5"] },
        { question: "Count the shiny gold stars: ⭐ ⭐ ⭐ ⭐ ⭐", ans: "5", choices: ["4", "5", "6"] },
        { question: "How many suns in the daytime sky? ☀️", ans: "1", choices: ["1", "2", "3"] },
        { question: "Count the colorful balloons: 🎈 🎈 🎈 🎈 🎈 🎈", ans: "6", choices: ["5", "6", "7"] },
        { question: "What number comes after 2? 1, 2, ...", ans: "3", choices: ["1", "3", "4"] },
        { question: "What number comes before 5? ..., 5", ans: "4", choices: ["3", "4", "5"] },
        { question: "Count the little fishes: 🐟 🐟 🐟 🐟 🐟 🐟 🐟", ans: "7", choices: ["6", "7", "8"] },
        { question: "How many fingers on one normal hand? 🖐️", ans: "5", choices: ["4", "5", "10"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { question: "Which animal is giant and BIG? 🐘 or 🐭", ans: "Elephant 🐘", choices: ["Elephant 🐘", "Mouse 🐭"] },
        { question: "Which group has MORE stars? ⭐⭐⭐ vs ⭐", ans: "3 stars ⭐⭐⭐", choices: ["3 stars ⭐⭐⭐", "1 star ⭐"] },
        { question: "Is an ant smaller than a bear? 🐜 vs 🐻", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Which basket has LESS berries? 🍒 vs 🍒🍒🍒", ans: "1 berry 🍒", choices: ["1 berry 🍒", "3 berries 🍒🍒🍒"] },
        { question: "Which tree is TALL? 🌳 or 🌿", ans: "Tree 🌳", choices: ["Tree 🌳", "Sprout 🌿"] },
        { question: "Which is HEAVY and hard to lift? 🪨 or 🪶", ans: "Stone 🪨", choices: ["Stone 🪨", "Feather 🪶"] },
        { question: "Is a giraffe taller than Chiku the Monkey? 🦒 vs 🐵", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Which bowl has MORE yummy candies? 🍬🍬🍬🍬 vs 🍬🍬", ans: "4 candies 🍬", choices: ["4 candies 🍬", "2 candies 🍬"] },
        { question: "Which is light like wind? 🪶 (feather) or 🧱 (brick)", ans: "Feather 🪶", choices: ["Feather 🪶", "Brick 🧱"] },
        { question: "Does a big ocean hold more water than a tiny cup? 🌊 vs 🥛", ans: "Yes", choices: ["Yes", "No"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 3) {
      const q = [
        { question: "What number comes right after 14?", ans: "15", choices: ["13", "15", "16", "12"] },
        { question: "What number comes right before 12?", ans: "11", choices: ["10", "11", "13", "14"] },
        { question: "What is 10 plus 5? 🔟 + 🖐️", ans: "15", choices: ["13", "14", "15", "16"] },
        { question: "How many stars do you count? ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐", ans: "11", choices: ["10", "11", "12"] },
        { question: "What number comes right after 19?", ans: "20", choices: ["18", "19", "20", "21"] },
        { question: "Which is the correct order: 11, 12, ___?", ans: "13", choices: ["10", "13", "14"] },
        { question: "What is 10 plus 10? 🔟 + 🔟", ans: "20", choices: ["15", "18", "20", "22"] },
        { question: "Which number is bigger: 13 or 17?", ans: "17", choices: ["13", "17", "equal"] },
        { question: "Which number is smaller: 19 or 12?", ans: "12", choices: ["19", "12", "equal"] },
        { question: "What number is one ten and four ones?", ans: "14", choices: ["12", "14", "41"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      const q = [
        { question: "What is 1 + 1? 👍 + 👍", ans: "2", choices: ["1", "2", "3", "4"] },
        { question: "What is 2 + 3? 🍎🍎 + 🍎🍎🍎", ans: "5", choices: ["4", "5", "6", "7"] },
        { question: "What is 4 + 2? ⭐️⭐️⭐️⭐️ + ⭐️⭐️", ans: "6", choices: ["5", "6", "7", "8"] },
        { question: "What is 5 + 5? 🖐️ + 🖐️", ans: "10", choices: ["8", "9", "10", "11"] },
        { question: "What is 3 + 1? 🐵🐵🐵 + 🐵", ans: "4", choices: ["3", "4", "5", "6"] },
        { question: "Solve: 2 + 2 = ___", ans: "4", choices: ["2", "3", "4", "5"] },
        { question: "Solve: 6 + 1 = ___", ans: "7", choices: ["6", "7", "8", "9"] },
        { question: "Solve: 7 + 2 = ___", ans: "9", choices: ["8", "9", "10", "11"] },
        { question: "Solve: 3 + 3 = ___", ans: "6", choices: ["5", "6", "7", "8"] },
        { question: "What is 1 + 9? ☝️ + ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️", ans: "10", choices: ["9", "10", "11", "12"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 5) {
      const q = [
        { question: "What is 3 - 1? 🎈🎈🎈 take 1 away", ans: "2", choices: ["1", "2", "3"] },
        { question: "What is 5 - 2? 🍒🍒🍒🍒🍒 take 2 eaten", ans: "3", choices: ["2", "3", "4", "5"] },
        { question: "What is 10 - 5? 🔟 take 🖐️ away", ans: "5", choices: ["4", "5", "6", "10"] },
        { question: "Solve: 4 - 2 = ___", ans: "2", choices: ["1", "2", "3", "4"] },
        { question: "Solve: 6 - 1 = ___", ans: "5", choices: ["4", "5", "6", "7"] },
        { question: "Solve: 7 - 3 = ___", ans: "4", choices: ["3", "4", "5", "6"] },
        { question: "Solve: 8 - 4 = ___", ans: "4", choices: ["2", "4", "6", "8"] },
        { question: "Solve: 9 - 2 = ___", ans: "7", choices: ["6", "7", "8", "9"] },
        { question: "Solve: 5 - 5 = ___ (all fly away!)", ans: "0", choices: ["0", "1", "5"] },
        { question: "What is 3 - 3? 🍌🍌🍌 all eaten!", ans: "0", choices: ["0", "1", "3"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 6) {
      const q = [
        { question: "Which shape is round with NO corners? 🔴", ans: "Circle", choices: ["Circle", "Square", "Triangle"] },
        { question: "Which shape has 3 pointy corners? 🔺", ans: "Triangle", choices: ["Circle", "Square", "Triangle"] },
        { question: "Which shape has 4 equal straight sides? 🟥", ans: "Square", choices: ["Square", "Triangle", "Rectangle"] },
        { question: "Is a wall clock usually a circle? ⏰", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Is a window usually a square? 🪟", ans: "Yes", choices: ["Yes", "No"] },
        { question: "A slice of delicious pizza is shaped like a: 🍕", ans: "Triangle", choices: ["Circle", "Square", "Triangle"] },
        { question: "A school book or blackboard is shaped like a: 📘", ans: "Rectangle", choices: ["Circle", "Triangle", "Rectangle"] },
        { question: "How many sides does a triangle have? 🔺", ans: "3", choices: ["2", "3", "4", "5"] },
        { question: "How many sides does a square have? 🟥", ans: "4", choices: ["3", "4", "5", "6"] },
        { question: "Does a circle have 4 sides?", ans: "No, 0 sides!", choices: ["Yes, 4 sides!", "No, 0 sides!"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 7) {
      const q = [
        { question: "Complete the pattern: 🔴, 🔵, 🔴, 🔵, 🔴, ___", ans: "🔵 Blue", choices: ["🔴 Red", "🔵 Blue", "🟢 Green"] },
        { question: "Complete the pattern: 🍎, 🍌, 🍎, 🍌, 🍎, ___", ans: "🍌 Banana", choices: ["🍎 Apple", "🍌 Banana", "🍊 Orange"] },
        { question: "Complete: Star, Moon, Star, Moon, ___", ans: "Star", choices: ["Star", "Moon", "Sun"] },
        { question: "Complete: 1, 2, 1, 2, 1, ___", ans: "2", choices: ["1", "2", "3"] },
        { question: "Complete: 🟢, 🟡, 🟢, 🟡, ___", ans: "🟢 Green", choices: ["🟢 Green", "🟡 Yellow", "🔴 Red"] },
        { question: "Complete: Dog, Cat, Dog, Cat, ___", ans: "Dog", choices: ["Dog", "Cat", "Bird"] },
        { question: "Complete: A, B, A, B, ___", ans: "A", choices: ["A", "B", "C"] },
        { question: "Complete: ☀️, 🌧️, ☀️, 🌧️, ___", ans: "☀️ Sun", choices: ["☀️ Sun", "🌧️ Rain", "❄️ Snow"] },
        { question: "Complete: 🎈, 🎈, 🧸, 🎈, 🎈, ___", ans: "🧸 Toy", choices: ["🎈 Balloon", "🧸 Toy"] },
        { question: "Complete: 10, 20, 10, 20, ___", ans: "10", choices: ["10", "20", "30"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { question: "Which is heavier: a rock 🪨 or a leaf 🍃?", ans: "Rock 🪨", choices: ["Rock 🪨", "Leaf 🍃"] },
        { question: "Which is lighter: a feather 🪶 or a brick 🧱?", ans: "Feather 🪶", choices: ["Feather 🪶", "Brick 🧱"] },
        { question: "Can we measure a desk width with our handspan? 🖐️", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Is an elephant heavier than Chiku the Monkey? 🐘 vs 🐵", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Who is taller: a palm tree 🌳 or a blade of grass 🌱?", ans: "Palm Tree 🌳", choices: ["Palm Tree 🌳", "Grass 🌱"] },
        { question: "Is a pencil longer than an eraser? ✏️ vs 🧼", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Which takes MORE footsteps to cross: your bedroom or your notebook?", ans: "Your bedroom", choices: ["Your bedroom", "Your notebook"] },
        { question: "Is a balloon lighter than a water bottle? 🎈 vs 🍾", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Which animal is SHORTER: a rabbit 🐇 or a giraffe 🦒?", ans: "Rabbit 🐇", choices: ["Rabbit 🐇", "Giraffe 🦒"] },
        { question: "Are your hands bigger than your teacher's hands?", ans: "No, smaller!", choices: ["Yes, bigger!", "No, smaller!"] }
      ];
      return q[idx % q.length];
    }
  } else if (subjectId === "evs") {
    if (chNum === 1) {
      const q = [
        { question: "Which organ do we use to SEE beautiful rainbows? 🌈", ans: "Eyes 👁️", choices: ["Eyes 👁️", "Ears 👂", "Nose 👃"] },
        { question: "Which organ do we use to HEAR soft songs? 🎵", ans: "Ears 👂", choices: ["Eyes 👁️", "Ears 👂", "Nose 👃"] },
        { question: "Which organ do we use to SMELL a sweet flower? 🌹", ans: "Nose 👃", choices: ["Nose 👃", "Tongue 👅", "Hands 🖐️"] },
        { question: "Which organ do we use to TASTE sweet honey? 🍯", ans: "Tongue 👅", choices: ["Nose 👃", "Tongue 👅", "Ears 👂"] },
        { question: "We use our hands and skin to: 🖐️", ans: "Touch & Feel", choices: ["See rainbows", "Hear songs", "Touch & Feel"] },
        { question: "How many eyes do we have? 👀", ans: "2", choices: ["1", "2", "3"] },
        { question: "How many noses do we have? 👃", ans: "1", choices: ["1", "2", "5"] },
        { question: "We listen to our teacher's story with our: 🎙️", ans: "Ears 👂", choices: ["Eyes 👁️", "Ears 👂", "Tongue 👅"] },
        { question: "What is the flavor of a sour lemon we taste? 🍋", ans: "Sour", choices: ["Sweet", "Sour", "Salty"] },
        { question: "Is our skin the organ of touch? 🖐️", ans: "Yes", choices: ["Yes", "No"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { question: "Who lives with us and loves us at home? 👨‍👩‍👧", ans: "Family", choices: ["Strangers", "Family", "Wild beasts"] },
        { question: "Where do we sleep, eat, and laugh with family? 🏡", ans: "Home", choices: ["Forest", "Home", "Office"] },
        { question: "Is helper-word 'Please' polite? 🤝", ans: "Yes", choices: ["Yes", "No"] },
        { question: "How can we help at home after playing? 🧸", ans: "Pack up our toys", choices: ["Throw toys", "Pack up our toys", "Scream loudly"] },
        { question: "Who is our father's mother?", ans: "Grandmother", choices: ["Aunt", "Sister", "Grandmother"] },
        { question: "Should we share our toys with our siblings? 🧸", ans: "Yes, sharing is caring!", choices: ["Yes, sharing is caring!", "No, keep all!"] },
        { question: "Who is our mother's husband?", ans: "Father", choices: ["Uncle", "Brother", "Father"] },
        { question: "What do we say when someone gives us a gift? 🎁", ans: "Thank you!", choices: ["Go away!", "Thank you!", "Gimme more!"] },
        { question: "Is a family tree a drawing of our loved ones? 🌳", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Should we keep our home tidy? 🧹", ans: "Yes, clean!", choices: ["Yes, clean!", "No, messy!"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 3) {
      const q = [
        { question: "What does a tiny plant need to grow green? 🌱", ans: "Water & Sunlight ☀️💧", choices: ["Chocolate", "Soda", "Water & Sunlight ☀️💧"] },
        { question: "Which plant part drinks water from the soil? 🪵", ans: "Roots", choices: ["Roots", "Leaves", "Flowers"] },
        { question: "Which green part catches warm sunlight to make food? 🍃", ans: "Leaves", choices: ["Roots", "Leaves", "Flowers"] },
        { question: "What is the strong green stick carrying water up? 🌿", ans: "Stem", choices: ["Roots", "Stem", "Fruits"] },
        { question: "Do plants give us sweet red apples to eat? 🍎", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Are plants living things that grow? 🌱", ans: "Yes", choices: ["Yes", "No"] },
        { question: "What grows from a beautiful flower? 🌸 ➔ 🍓", ans: "Fruit", choices: ["Stone", "Fruit", "Toy"] },
        { question: "Should we water our green plants daily? 💧", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Is a giant oak tree a plant that grew from a tiny seed?", ans: "Yes", choices: ["Yes", "No"] },
        { question: "What color are healthy plant leaves? 🍃", ans: "Green", choices: ["Red", "Green", "Blue"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      // ANIMAL CURRICULUM QUESTIONS WITH HIGH-CONTRAST EMOJIS
      const q = [
        { question: "Which animal is the King of the Jungle with a loud ROAR? 🦁", ans: "Lion 🦁", choices: ["Lion 🦁", "Cow 🐄", "Dog 🐶"] },
        { question: "Which giant animal has floppy ears and a long water trunk? 🐘", ans: "Elephant 🐘", choices: ["Monkey 🐵", "Elephant 🐘", "Cat 🐱"] },
        { question: "Is a dog 🐶 a wild jungle animal or a domestic pet?", ans: "Domestic pet", choices: ["Wild jungle animal", "Domestic pet"] },
        { question: "What friendly farm animal goes 'Moo Moo' and gives milk? 🐄", ans: "Cow 🐄", choices: ["Cow 🐄", "Lion 🦁", "Sheep 🐑"] },
        { question: "Which cute pet goes 'Meow Meow' and purrs softly? 🐱", ans: "Cat 🐱", choices: ["Cat 🐱", "Dog 🐶", "Frog 🐸"] },
        { question: "Which forest animal is big, furry, and loves honey? 🐻", ans: "Bear 🐻", choices: ["Cow 🐄", "Bear 🐻", "Fish 🐠"] },
        { question: "Which animal gives us fluffy wool to make warm sweaters? 🐑", ans: "Sheep 🐑", choices: ["Sheep 🐑", "Tiger 🐯", "Mouse 🐭"] },
        { question: "Which playful animal swings on trees and loves bananas? 🐵", ans: "Monkey 🐵", choices: ["Cow 🐄", "Monkey 🐵", "Hen 🐔"] },
        { question: "Which bird has green feathers and can copy our voice? 🦜", ans: "Parrot 🦜", choices: ["Hen 🐔", "Parrot 🦜", "Crow 🐦"] },
        { question: "Is a wild tiger 🐯 safe to keep as a pet inside our bedroom?", ans: "No, it's wild!", choices: ["Yes, cute pet!", "No, it's wild!"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { question: "Who heals us with a stethoscope when we are sick? 🧑‍⚕️", ans: "Doctor 🧑‍⚕️", choices: ["Doctor 🧑‍⚕️", "Farmer 🧑‍🌾", "Teacher 🧑‍🏫"] },
        { question: "Who grows healthy rice, wheat, and fruits for us? 🧑‍🌾", ans: "Farmer 🧑‍🌾", choices: ["Police 👮", "Farmer 🧑‍🌾", "Doctor 🧑‍⚕️"] },
        { question: "Who helps us read storybooks and write letters? 🧑‍🏫", ans: "Teacher 🧑‍🏫", choices: ["Teacher 🧑‍🏫", "Firefighter 🧑‍🚒", "Farmer 🧑‍🌾"] },
        { question: "Who puts out big fires with water hoses? 🧑‍🚒", ans: "Firefighter 🧑‍🚒", choices: ["Firefighter 🧑‍🚒", "Doctor 🧑‍⚕️", "Farmer 🧑‍🌾"] },
        { question: "Who keeps our neighborhood safe and guards us? 👮", ans: "Police Officer", choices: ["Police Officer", "Farmer", "Actor"] },
        { question: "What tool does a doctor use to listen to our heartbeat? 🩺", ans: "Stethoscope", choices: ["Stethoscope", "Tractor", "Hose"] },
        { question: "What does a farmer drive on the farm? 🚜", ans: "Tractor", choices: ["Tractor", "Ambulance", "Police Car"] },
        { question: "Where do firefighters keep their big red fire truck? 🚒", ans: "Fire Station", choices: ["Fire Station", "Hospital", "School"] },
        { question: "Where do we go to learn from our teacher? 🏫", ans: "School", choices: ["School", "Farm", "Hospital"] },
        { question: "Should we thank our neighborhood helpers? 🤝", ans: "Yes, always!", choices: ["Yes, always!", "No, ignore them"] }
      ];
      return q[idx % q.length];
    }
  } else if (subjectId === "lang") {
    if (chNum === 1) {
      const q = [
        { question: "Which letter starts the word 'APPLE'? 🍎", ans: "A", choices: ["A", "B", "C", "D"] },
        { question: "Which letter starts the word 'BALL'? 🎈", ans: "B", choices: ["A", "B", "C", "D"] },
        { question: "Which letter starts the word 'CAT'? 🐱", ans: "C", choices: ["B", "C", "D", "E"] },
        { question: "Which letter makes the sound 'Duh' like Dog? 🐶", ans: "D", choices: ["C", "D", "E", "F"] },
        { question: "Which letter makes the sound 'Eh' like Egg? 🥚", ans: "E", choices: ["A", "D", "E", "F"] },
        { question: "Which letter makes the sound 'Fuh' like Fish? 🐟", ans: "F", choices: ["E", "F", "G", "H"] },
        { question: "Which sound does letter A make?", ans: "Ah", choices: ["Ah", "Buh", "Cuh"] },
        { question: "Which sound does letter B make?", ans: "Buh", choices: ["Ah", "Buh", "Cuh"] },
        { question: "Which letter starts the word 'EGG'? 🥚", ans: "E", choices: ["A", "E", "O"] },
        { question: "Which letter makes the snake sound 'Sssss'?", ans: "S", choices: ["S", "T", "C", "Z"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { question: "Spell the word for this furry pet: 🐱", ans: "CAT", choices: ["CAT", "DOG", "SUN", "BOX"] },
        { question: "Spell the word for this loyal animal: 🐶", ans: "DOG", choices: ["CAT", "DOG", "SUN", "BOX"] },
        { question: "Spell the word for the hot sun in the sky: ☀️", ans: "SUN", choices: ["SON", "SUN", "SUT", "SAN"] },
        { question: "Spell the word for this cardboard box: 📦", ans: "BOX", choices: ["BAG", "BOX", "TOY", "PEN"] },
        { question: "Spell the word we write with: 🖊️", ans: "PEN", choices: ["PEN", "PIN", "PAN", "PUN"] },
        { question: "What is this? 🧢 (A head cap)", ans: "CAP", choices: ["CAP", "CUP", "CAT", "COW"] },
        { question: "Complete the spelling: D - O - ___", ans: "G", choices: ["T", "G", "N"] },
        { question: "Complete the spelling: C - ___ - T", ans: "A", choices: ["A", "O", "I"] },
        { question: "Complete the spelling: S - U - ___", ans: "N", choices: ["M", "N", "T"] },
        { question: "Is 'DOG' a three-letter word?", ans: "Yes", choices: ["Yes", "No"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { question: "When someone is telling a story, what should we do?", ans: "Listen carefully 👂", choices: ["Talk loudly", "Listen carefully 👂", "Run around"] },
        { question: "What polite word do we say to ask for a pencil? ✏️", ans: "Please", choices: ["Gimme", "Please", "Get out"] },
        { question: "What polite word do we say when given a sweet candy? 🍬", ans: "Thank you", choices: ["Go away", "Thank you", "Nothing"] },
        { question: "Which organ do we use to listen to stories? 👂", ans: "Ears", choices: ["Eyes", "Ears", "Nose"] },
        { question: "When we speak in front of friends, we should: 🎙️", ans: "Speak clearly & smile", choices: ["Speak clearly & smile", "Mumble & cry", "Whisper quietly"] },
        { question: "Should we listen when our friend is speaking?", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Polite words make people feel:", ans: "Happy & respected", choices: ["Happy & respected", "Sad & angry"] },
        { question: "When someone says 'Thank You', we can reply:", ans: "You are welcome!", choices: ["You are welcome!", "Go away!"] },
        { question: "Is a storybook fun to share with friends?", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Do we listen to birds singing with our ears? 🦜", ans: "Yes", choices: ["Yes", "No"] }
      ];
      return q[idx % q.length];
    }
  } else {
    // Fallback exercises
    const q = [
      { question: "What is the color of a ripe banana? 🍌", ans: "Yellow", choices: ["Red", "Blue", "Yellow"] },
      { question: "Is a puppy a baby dog? 🐶", ans: "Yes", choices: ["Yes", "No"] },
      { question: "Which primary colors make Green when mixed? 🎨", ans: "Blue & Yellow", choices: ["Red & Blue", "Blue & Yellow", "Red & Yellow"] },
      { question: "Should we wash our hands before eating? 🧼", ans: "Yes", choices: ["Yes", "No"] },
      { question: "What do we say when someone gives us a gift? 🎁", ans: "Thank you", choices: ["Give me more", "Thank you", "Nothing"] },
      { question: "How many times should we brush our teeth daily? 🪥", ans: "2 times", choices: ["1 time", "2 times", "Never"] },
      { question: "Is the sun hot and bright? ☀️", ans: "Yes", choices: ["Yes", "No"] },
      { question: "What color is a fresh green leaf? 🍃", ans: "Green", choices: ["Red", "Green", "Yellow"] },
      { question: "Which organ do we use to smell things? 👃", ans: "Nose", choices: ["Eyes", "Ears", "Nose"] },
      { question: "Is learning with friends fun?", ans: "Yes!", choices: ["Yes!", "No"] }
    ];
    return q[idx % q.length];
  }
}

// 4. FILL IN THE BLANKS (Pages 14 to 16)
interface FillBlankData {
  sentence: string;
  ans: string;
  choices: string[];
}
function getFillBlankQuestionForSubjectAndChapter(subjectId: SubjectType, chNum: number, idx: number): FillBlankData {
  if (subjectId === "math") {
    if (chNum === 1) {
      const q = [
        { sentence: "Chiku the Monkey has ___ sweet yellow bananas. 🍌🍌🍌", ans: "3", choices: ["2", "3", "4"] },
        { sentence: "We have ___ bright sun in the daytime sky. ☀️", ans: "1", choices: ["1", "2", "3"] },
        { sentence: "A normal hand has ___ star fingers. 🖐️", ans: "5", choices: ["4", "5", "10"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { sentence: "A giant elephant is ___ than a tiny mouse. 🐘 vs 🐭", ans: "bigger", choices: ["smaller", "bigger", "shorter"] },
        { sentence: "A basket with 5 apples has ___ than a basket with 1. 🍎", ans: "more", choices: ["less", "more", "equal"] },
        { sentence: "A crawling ant is very ___ compared to a bear. 🐜 vs 🐻", ans: "small", choices: ["big", "tall", "small"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      const q = [
        { sentence: "Two apples + two apples make ___ total apples. 🍎🍎+🍎🍎", ans: "4", choices: ["3", "4", "5"] },
        { sentence: "The ___ sign is used when we join groups together. ➕", ans: "+", choices: ["+", "-", "="] },
        { sentence: "Five balloons and five balloons make ___ balloons. 🎈", ans: "10", choices: ["8", "10", "12"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 5) {
      const q = [
        { sentence: "Three balloons minus one popped leaves ___ balloons. 🎈", ans: "2", choices: ["1", "2", "3"] },
        { sentence: "The ___ sign is used when we take things away. ➖", ans: "-", choices: ["+", "-", "="] },
        { sentence: "Five sweet berries minus five eaten leaves ___ berries.", ans: "0", choices: ["0", "1", "5"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 6) {
      const q = [
        { sentence: "A pointy triangle has exactly ___ corners. 🔺", ans: "3", choices: ["3", "4", "0"] },
        { sentence: "A round smooth circle has ___ corners. 🔴", ans: "0", choices: ["0", "3", "4"] },
        { sentence: "A square has four straight sides that are all ___. 🟥", ans: "equal", choices: ["equal", "different", "round"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { sentence: "A heavy stone is ___ to lift. 🪨", ans: "hard", choices: ["easy", "hard", "soft"] },
        { sentence: "A bird feather is ___ and floats in the wind. 🪶", ans: "light", choices: ["heavy", "light", "hard"] },
        { sentence: "We can measure our book length using our ___. 🖐️", ans: "handspan", choices: ["handspan", "footsteps", "ruler"] }
      ];
      return q[idx % q.length];
    }
  } else if (subjectId === "evs") {
    if (chNum === 1) {
      const q = [
        { sentence: "We use our two ___ to see colorful rainbows. 👁️👁️", ans: "eyes", choices: ["eyes", "ears", "hands"] },
        { sentence: "We use our ___ to smell sweet roses. 👃", ans: "nose", choices: ["eyes", "nose", "tongue"] },
        { sentence: "We use our tongue to ___ sweet ice cream. 👅", ans: "taste", choices: ["see", "hear", "taste"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { sentence: "We live together in a safe cozy ___. 🏡", ans: "home", choices: ["home", "forest", "office"] },
        { sentence: "When asking for help politely, we say '___'. 🤝", ans: "please", choices: ["gimme", "please", "thanks"] },
        { sentence: "We should help ___ our toys after we finish playing. 🧸", ans: "pack up", choices: ["throw", "pack up", "break"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 3) {
      const q = [
        { sentence: "Plant ___ grow deep in soil to drink water. 🪵", ans: "roots", choices: ["roots", "stem", "leaves"] },
        { sentence: "Green plant ___ catch warm sunlight to cook food. 🍃", ans: "leaves", choices: ["roots", "stem", "leaves"] },
        { sentence: "A plant needs water and ___ to grow healthy. ☀️💧", ans: "sunlight", choices: ["sunlight", "chocolate", "soda"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      // ANIMAL BLANKS FOR REGISTRATION
      const q = [
        { sentence: "The ___ is the King of the Jungle with a loud roar. 🦁", ans: "lion", choices: ["cow", "dog", "lion"] },
        { sentence: "A domestic ___ wags its tail and guards our home. 🐶", ans: "dog", choices: ["lion", "dog", "bear"] },
        { sentence: "A giant ___ has floppy ears and a long trunk. 🐘", ans: "elephant", choices: ["monkey", "elephant", "cat"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { sentence: "A ___ uses a stethoscope to heal us when sick. 🧑‍⚕️", ans: "doctor", choices: ["doctor", "farmer", "teacher"] },
        { sentence: "A hard-working ___ grows fresh vegetables for us. 🧑‍🌾", ans: "farmer", choices: ["doctor", "farmer", "teacher"] },
        { sentence: "A ___ helps us learn to read and write books. 🧑‍🏫", ans: "teacher", choices: ["doctor", "teacher", "firefighter"] }
      ];
      return q[idx % q.length];
    }
  } else {
    // English & generic blanks
    const q = [
      { sentence: "A says 'Ah' for ___. 🍎", ans: "apple", choices: ["apple", "ball", "cat"] },
      { sentence: "C - A - T spells ___. 🐱", ans: "cat", choices: ["dog", "cat", "sun"] },
      { sentence: "When given a sweet gift, we always say '___'. 🎁", ans: "thank you", choices: ["gimme", "thank you", "please"] }
    ];
    return q[idx % q.length];
  }
}

// 5. MATCH THE FOLLOWING (Pages 17 to 19)
interface MatchData {
  left: { id: string; text: string; matchId: string }[];
  right: { id: string; text: string }[];
  pairs: Record<string, string>;
}
function getMatchFollowingDataForSubjectAndChapter(subjectId: SubjectType, chNum: number, idx: number): MatchData {
  if (subjectId === "math") {
    if (chNum === 1) {
      return {
        left: [
          { id: "L1", text: "3 bananas 🍌🍌🍌", matchId: "R1" },
          { id: "L2", text: "5 stars ⭐⭐⭐⭐⭐", matchId: "R2" },
          { id: "L3", text: "1 sun ☀️", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Number 5" },
          { id: "R3", text: "Number 1" },
          { id: "R1", text: "Number 3" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    } else if (chNum === 2) {
      return {
        left: [
          { id: "L1", text: "Giant Elephant 🐘", matchId: "R1" },
          { id: "L2", text: "Tiny Mouse 🐭", matchId: "R2" },
          { id: "L3", text: "Palm Tree 🌳", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "SMALL Size" },
          { id: "R3", text: "TALL Height" },
          { id: "R1", text: "BIG Size" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    } else if (chNum === 6) {
      return {
        left: [
          { id: "L1", text: "Round Ball ⚽", matchId: "R1" },
          { id: "L2", text: "Pizza Slice 🍕", matchId: "R2" },
          { id: "L3", text: "Window 🪟", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Triangle 🔺" },
          { id: "R3", text: "Square 🟥" },
          { id: "R1", text: "Circle 🔴" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    } else {
      return {
        left: [
          { id: "L1", text: "2 + 2 🍎🍎", matchId: "R1" },
          { id: "L2", text: "5 - 1 🎈", matchId: "R2" },
          { id: "L3", text: "3 + 0 🍌", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Equals 4" },
          { id: "R3", text: "Equals 3" },
          { id: "R1", text: "Equals 4" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    }
  } else if (subjectId === "evs") {
    if (chNum === 1) {
      return {
        left: [
          { id: "L1", text: "Eyes 👁️", matchId: "R1" },
          { id: "L2", text: "Nose 👃", matchId: "R2" },
          { id: "L3", text: "Ears 👂", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Smell Roses" },
          { id: "R3", text: "Hear Songs" },
          { id: "R1", text: "See Rainbows" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    } else if (chNum === 4) {
      // THE ANIMAL MATCHING FOR RECOGNITION
      return {
        left: [
          { id: "L1", text: "LION 🦁", matchId: "R1" },
          { id: "L2", text: "DOG 🐶", matchId: "R2" },
          { id: "L3", text: "COW 🐄", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Domestic Pet" },
          { id: "R3", text: "Farm Friend" },
          { id: "R1", text: "Wild Beast" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    } else {
      return {
        left: [
          { id: "L1", text: "Doctor 🩺", matchId: "R1" },
          { id: "L2", text: "Farmer 🧑‍🌾", matchId: "R2" },
          { id: "L3", text: "Teacher 🧑‍🏫", matchId: "R3" },
        ],
        right: [
          { id: "R2", text: "Grows healthy crops" },
          { id: "R3", text: "Helps us read books" },
          { id: "R1", text: "Heals sick children" },
        ],
        pairs: { L1: "R1", L2: "R2", L3: "R3" },
      };
    }
  } else {
    // Language matching
    return {
      left: [
        { id: "L1", text: "A is for", matchId: "R1" },
        { id: "L2", text: "B is for", matchId: "R2" },
        { id: "L3", text: "C is for", matchId: "R3" },
      ],
      right: [
        { id: "R2", text: "Ball 🎈" },
        { id: "R3", text: "Cat 🐱" },
        { id: "R1", text: "Apple 🍎" },
      ],
      pairs: { L1: "R1", L2: "R2", L3: "R3" },
    };
  }
}

// 6. TRIVIA QUIZ QUESTIONS (Pages 20 to 23)
interface TriviaData {
  question: string;
  ans: string;
  choices: string[];
}
function getQAQuestionForSubjectAndChapter(subjectId: SubjectType, chNum: number, idx: number): TriviaData {
  if (subjectId === "math") {
    if (chNum === 1) {
      const q = [
        { question: "How many noses do you have? 👃", ans: "1", choices: ["1", "2", "10"] },
        { question: "What is the missing number: 1, 2, ___, 4?", ans: "3", choices: ["2", "3", "5"] },
        { question: "Count your ears: 👂 👂", ans: "2", choices: ["1", "2", "4"] },
        { question: "How many total digits is number 10?", ans: "2 digits", choices: ["1 digit", "2 digits", "3 digits"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 2) {
      const q = [
        { question: "Which animal is bigger: a rabbit 🐇 or a lion 🦁?", ans: "Lion 🦁", choices: ["Rabbit 🐇", "Lion 🦁"] },
        { question: "Does a small cup hold less milk than a big bottle? 🥛 vs 🍾", ans: "Yes", choices: ["Yes", "No"] },
        { question: "Which is shorter: a grass sprout 🌱 or a coconut tree 🌴?", ans: "Grass sprout 🌱", choices: ["Grass sprout 🌱", "Coconut tree 🌴"] },
        { question: "Which group is heavier: 5 heavy rocks 🪨 or 1 light feather 🪶?", ans: "5 rocks 🪨", choices: ["5 rocks 🪨", "1 feather 🪶"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      const q = [
        { question: "What is 3 + 2? 🍒🍒🍒 + 🍒🍒", ans: "5", choices: ["4", "5", "6"] },
        { question: "What is 1 + 8? ☝️ + ⭐⭐⭐⭐⭐⭐⭐⭐", ans: "9", choices: ["8", "9", "10"] },
        { question: "Solve: 4 + 4 = ___", ans: "8", choices: ["6", "8", "10"] },
        { question: "What do we get when we add 0 to any number?", ans: "The same number!", choices: ["Zero", "The same number!", "Double number"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { question: "What is 5 - 1? 🎈🎈🎈🎈🎈 (1 popped)", ans: "4", choices: ["3", "4", "5"] },
        { question: "What is 3 - 3? 🍌🍌🍌 (all eaten!)", ans: "0", choices: ["0", "1", "3"] },
        { question: "Which shape is round with 0 corners? 🔴", ans: "Circle", choices: ["Circle", "Square", "Triangle"] },
        { question: "What comes next in the pattern: Red, Yellow, Red, Yellow, ___?", ans: "Red", choices: ["Red", "Yellow", "Blue"] }
      ];
      return q[idx % q.length];
    }
  } else if (subjectId === "evs") {
    if (chNum === 1) {
      const q = [
        { question: "Which organ do we use to hear bird chirps? 🦜", ans: "Ears 👂", choices: ["Eyes 👁️", "Ears 👂", "Nose 👃"] },
        { question: "Which organ tells us if ice cream is sweet? 🍦", ans: "Tongue 👅", choices: ["Nose 👃", "Tongue 👅", "Skin 🖐️"] },
        { question: "Which organ is used to feel if a dog is soft? 🐶", ans: "Skin/Hands 🖐️", choices: ["Eyes 👁️", "Ears 👂", "Skin/Hands 🖐️"] },
        { question: "Should we clean our ears with sharp sticks?", ans: "No, very dangerous!", choices: ["Yes, daily!", "No, very dangerous!"] }
      ];
      return q[idx % q.length];
    } else if (chNum === 4) {
      // ANIMAL TRIVIA FOR VISUALIZATION
      const q = [
        { question: "Is a cow 🐄 a wild forest animal or a domestic friend?", ans: "Domestic friend", choices: ["Wild forest animal", "Domestic friend"] },
        { question: "Which wild friend is big and furry and loves forest honey? 🐻", ans: "Bear 🐻", choices: ["Bear 🐻", "Dog 🐶", "Cat 🐱"] },
        { question: "Which wild animal is the King of the Jungle with a mighty roar? 🦁", ans: "Lion 🦁", choices: ["Lion 🦁", "Cow 🐄", "Sheep 🐑"] },
        { question: "Does a domestic dog 🐶 wag its tail to show happiness?", ans: "Yes!", choices: ["Yes!", "No, it roars"] }
      ];
      return q[idx % q.length];
    } else {
      const q = [
        { question: "Who teaches us reading, writing, and drawing? 🧑‍🏫", ans: "Teacher", choices: ["Farmer", "Teacher", "Firefighter"] },
        { question: "Who cures sick animals and children? 🧑‍⚕️", ans: "Doctor", choices: ["Doctor", "Farmer", "Police"] },
        { question: "What grows from a tiny apple seed planted in the soil? 🌱", ans: "Apple Tree 🌳", choices: ["Apple Tree 🌳", "Toy Train 🚂", "Soda Cup 🥤"] },
        { question: "Who protects our town and keeps our families safe? 👮", ans: "Police Officer", choices: ["Police Officer", "Farmer", "Teacher"] }
      ];
      return q[idx % q.length];
    }
  } else {
    // English language trivia
    const q = [
      { question: "Which letter sound starts the word 'FISH'? 🐟", ans: "F", choices: ["E", "F", "G", "H"] },
      { question: "What action is this: 🏃?", ans: "RUN", choices: ["SIT", "RUN", "SLEEP"] },
      { question: "Which word rhymes with 'CAT'?", ans: "HAT", choices: ["HAT", "LOG", "SUN"] },
      { question: "Should we say 'Please' when asking for a toy? 🧸", ans: "Yes, always!", choices: ["Yes, always!", "No, scream!"] }
    ];
    return q[idx % q.length];
  }
}

const CHAPTER_IMAGES: Record<string, string> = {
  "math-1": "https://images.unsplash.com/photo-1596495578065-6e0763fa1141?w=500&auto=format&fit=crop&q=80", // Kids counting numbers / toy blocks
  "math-2": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&auto=format&fit=crop&q=80", // Big elephant representing Big and Small comparison
  "math-3": "https://images.unsplash.com/photo-1608447714925-599deeb5a682?w=500&auto=format&fit=crop&q=80", // Galaxy outer space stars
  "math-4": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80", // Golden coins addition
  "math-5": "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500&auto=format&fit=crop&q=80", // Balloons flying in blue sky
  "math-6": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80", // Beautiful 3D geometric shapes
  "math-7": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop&q=80", // Color beads / patterns
  "math-8": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80", // Classroom table measurement scales
  
  "lang-1": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80", // Kids reading a massive glowing alphabet book
  "lang-2": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=80", // Alphabet spelling blocks CAT DOG
  "lang-3": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80", // Child speaking confidently in class
  "lang-4": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80", // Colorful story books
  "lang-5": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80", // Books representing sentences
  "lang-6": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", // Cute child playing xylophone / rhymes
  
  "evs-1": "https://images.unsplash.com/photo-1505151214177-00a67a51da79?w=500&auto=format&fit=crop&q=80", // Exploring body parts / glasses / eye
  "evs-2": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80", // Happy family playing at home
  "evs-3": "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&auto=format&fit=crop&q=80", // Green leaf and plants sprouting
  "evs-4": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&auto=format&fit=crop&q=80", // Forest animal friends (deer)
  "evs-5": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80", // Friendly community doctor helpers
  
  "art-1": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80", // Splash colorful paint
  "art-2": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80", // Colored pencil drawings / lines
  
  "life-1": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80", // Kids hygiene / brushing teeth / habits
  "life-2": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&auto=format&fit=crop&q=80", // Happy smiling child / emotions
};

// Dynamic curriculum page generator that returns 25 distinct pages for any chapter
export function generate25PagesForChapter(
  subjectId: SubjectType,
  chapter: Chapter
): BookPage[] {
  const pages: BookPage[] = [];
  const chNum = chapter.num;
  const title = chapter.title;

  // Let's determine the theme character and mascot
  let mascot = "🐵 Chiku";
  if (subjectId === "lang") mascot = "🦜 Kiki";
  if (subjectId === "evs") mascot = "🔍 Maya";
  if (subjectId === "art") mascot = "🎨 Artie";
  if (subjectId === "life") mascot = "🤖 Robo";

  // Select the appropriate real image for this chapter
  const chapterImageKey = `${subjectId}-${chNum}`;
  const realChapterImage = CHAPTER_IMAGES[chapterImageKey] || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80";

  // --- PAGE 1: CHAPTER INTRO STORY ---
  pages.push({
    pageNumber: 1,
    type: "story",
    title: `${chNum}. ${chapter.title}`,
    subtitle: "A Fun Learning Adventure",
    content: `${chapter.description}\n\nOur friendly buddy ${mascot} is ready to guide you on this journey! Let's turn our learning hats on and get started!`,
    audioText: `${chapter.title}. ${chapter.description}. Our friendly buddy ${mascot} is ready to guide you on this journey! Let's turn our learning hats on and get started!`,
    imageUrl: realChapterImage,
  });

  // --- PAGE 2: CORE LESSON BOARD ---
  const lesson = getLessonContent(subjectId, chNum, title, chapter.skills);
  pages.push({
    pageNumber: 2,
    type: "explanation",
    title: `Lesson Board: Let's Learn!`,
    subtitle: "Read with your buddy, then press Next!",
    content: lesson.content,
    audioText: lesson.audioText,
    imageUrl: realChapterImage,
  });

  // --- PAGE 3: KEY VOCABULARY ---
  const vocab = getVocabularyItems(subjectId, chNum, chapter.skills);
  pages.push({
    pageNumber: 3,
    type: "vocabulary",
    title: vocab.title,
    subtitle: vocab.subtitle,
    content: vocab.content,
    audioText: vocab.audioText,
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80", // Picture books vocabulary board
  });

  // --- PAGES 4 to 13: THE 10 EXERCISES (EX X.1 TO EX X.10) ---
  for (let i = 1; i <= 10; i++) {
    const exerciseDetails = getExerciseForSubjectAndChapter(subjectId, chNum, i - 1);
    const exerciseCode = `Ex ${chNum}.${i}`;

    pages.push({
      pageNumber: i + 3, // starts at Page 4
      type: "exercise",
      title: `${exerciseCode}: Active Practice`,
      subtitle: "Solve to unlock your progress sticker!",
      content: `Let's try this question together. Tap the correct answer below. Remember, ${mascot} is rooting for you!`,
      audioText: `Exercise ${chNum} point ${i}. ${exerciseDetails.question}. Tap the correct answer below to earn a shiny star!`,
      interactiveData: {
        exerciseCode,
        question: exerciseDetails.question,
        options: exerciseDetails.choices,
        correctAnswer: exerciseDetails.ans,
        explanation: `Excellent! You answered "${exerciseDetails.ans}" correctly. That is amazing! 🎉`,
      },
    });
  }

  // --- PAGES 14 to 23: THE 10-QUESTION SOLVING SECTION (END OF CHAPTER SECTION) ---
  // Page 14 to 16: 3 x Fill in the Blanks
  for (let idx = 0; idx < 3; idx++) {
    const q = getFillBlankQuestionForSubjectAndChapter(subjectId, chNum, idx);
    const questionNumber = idx + 1;
    pages.push({
      pageNumber: idx + 14, // starts at Page 14
      type: "fill_blank",
      title: `Quest Q${questionNumber}: Fill the Blanks`,
      subtitle: "Tap the correct word below!",
      content: `Fill in the missing word in the sentence below. Tap the best answer to complete it!`,
      audioText: `Quest Question ${questionNumber}. Fill in the blanks. Complete the sentence: ${q.sentence.replace("___", "blank")}`,
      interactiveData: {
        blankSentence: q.sentence,
        blankAnswer: q.ans,
        choices: q.choices,
        explanation: `Fabulous! The correct sentence is: "${q.sentence.replace("___", q.ans)}" 🎉`,
      },
    });
  }

  // Page 17 to 19: 3 x Match the Following
  for (let idx = 0; idx < 3; idx++) {
    const q = getMatchFollowingDataForSubjectAndChapter(subjectId, chNum, idx);
    const questionNumber = idx + 4;
    pages.push({
      pageNumber: idx + 17, // starts at Page 17
      type: "match_following",
      title: `Quest Q${questionNumber}: Match the Pairs`,
      subtitle: "Tap a card on the left, then its match on the right!",
      content: `Let's connect related pairs! Tap any yellow card on the left, and then match it with its partner card on the right.`,
      audioText: `Quest Question ${questionNumber}. Match the Following. Connect the cards on the left side with their matching cards on the right side!`,
      interactiveData: {
        leftItems: q.left,
        rightItems: q.right,
        correctPairs: q.pairs,
        explanation: `Perfect matching! You aligned all cards successfully! You are a superstar matcher! ⭐`,
      },
    });
  }

  // Page 20 to 23: 4 x Q&A / Quiz Solving Section
  for (let idx = 0; idx < 4; idx++) {
    const q = getQAQuestionForSubjectAndChapter(subjectId, chNum, idx);
    const questionNumber = idx + 7;
    pages.push({
      pageNumber: idx + 20, // starts at Page 20
      type: "qa",
      title: `Quest Q${questionNumber}: Chapter Trivia`,
      subtitle: "Tap the correct bubble below!",
      content: `${q.question}`,
      audioText: `Quest Question ${questionNumber}. Chapter Trivia. ${q.question}. Choose the correct option below!`,
      interactiveData: {
        question: q.question,
        options: q.choices,
        correctAnswer: q.ans,
        explanation: `Brilliant! You answered "${q.ans}" correctly. Keep it up! 🚀`,
      },
    });
  }

  // --- PAGE 24: SUMMARY REVIEW ---
  pages.push({
    pageNumber: 24,
    type: "review",
    title: "Lesson Review & Badge Progress",
    subtitle: "Check off your learning accomplishments!",
    content: `You have successfully unlocked all topics in this chapter! Let's do a fast revision:\n\n✔️ Completed 10 Active Practice Exercises (${chNum}.1 to ${chNum}.10)\n✔️ Solved Fill in the Blanks quests\n✔️ Completed Match the Following pairs\n✔️ Completed Chapter Trivia quiz\n\nYour total stars are growing!`,
    audioText: "Congratulations! You have completed all lesson pages and active quests. Let's review our accomplishments and head to the final graduation page!",
  });

  // --- PAGE 25: CELEBRATION GRADUATION PAGE ---
  pages.push({
    pageNumber: 25,
    type: "celebration",
    title: "Chapter Champion! 🎓🏆",
    subtitle: "You earned a Gold Star!",
    content: `CONGRATULATIONS!\nYou have officially graduated from Chapter ${chNum}: ${title}!\n\nBuddy ${mascot} has awarded you a beautiful Chapter Master Sticker! Tap 'Finish Lesson' below to return to your dashboard and lock in your new badges!`,
    audioText: `Congratulations! You are officially a Chapter Champion for Chapter ${chNum}, ${title}! Tap Finish Lesson below to lock in your master badges!`,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80", // Sparkly celebration confetti
  });

  return pages;
}
