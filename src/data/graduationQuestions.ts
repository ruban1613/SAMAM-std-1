export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
}

// ==========================================
// VOLUME 1 GRADUATION QUESTIONS (50 Questions)
// ==========================================
export const GRADUATION_QUESTIONS_V1: TestQuestion[] = [
  // --- MATHEMATICS (Questions 1 - 10) ---
  {
    id: 1,
    subject: "math",
    question: "Let's count these yummy red apples: 🍎🍎🍎🍎. How many apples are there in total?",
    options: ["3 apples", "4 apples", "5 apples"],
    correctAnswer: "4 apples",
    explanation: "Excellent counting! You counted exactly 4 delicious apples! 🍎"
  },
  {
    id: 2,
    subject: "math",
    question: "Which of these beautiful creatures is the BIGGEST in real life? 🐘",
    options: ["A tiny ant 🐜", "A sweet little mouse 🐭", "A majestic elephant 🐘"],
    correctAnswer: "A majestic elephant 🐘",
    explanation: "Wow, you have a giant brain! Yes, the elephant is the biggest animal here! 🐘"
  },
  {
    id: 3,
    subject: "math",
    question: "Our number friends are standing in a line. What number comes right after 14? 🎯",
    options: ["13", "15", "16"],
    correctAnswer: "15",
    explanation: "Fantastic! Number 15 comes right after 14. You are a math star! ⭐"
  },
  {
    id: 4,
    subject: "math",
    question: "Kiki parrot has 4 green seeds 🟢 and finds 3 more. How many seeds does she have now? 4 + 3 = ?",
    options: ["6 seeds", "7 seeds", "8 seeds"],
    correctAnswer: "7 seeds",
    explanation: "Superb! Adding 4 and 3 gives us exactly 7 seeds for Kiki! 🦜"
  },
  {
    id: 5,
    subject: "math",
    question: "Chiku monkey had 6 sweet yellow bananas 🍌. He happily ate 2 of them. How many are left? 6 - 2 = ?",
    options: ["4 bananas", "3 bananas", "5 bananas"],
    correctAnswer: "4 bananas",
    explanation: "Yum! 6 take away 2 is 4 bananas left for Chiku's snack time! 🍌"
  },
  {
    id: 6,
    subject: "math",
    question: "Which of these shapes is perfectly round, just like a delicious full pizza? 🍕",
    options: ["Square 🟥", "Triangle 🔺", "Circle 🔴"],
    correctAnswer: "Circle 🔴",
    explanation: "Spot on! A circle is perfectly round with no corners at all, just like a pizza! 🍕"
  },
  {
    id: 7,
    subject: "math",
    question: "Complete the magic pattern: Red, Blue, Red, Blue, ... What color comes next? 🎨",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢"],
    correctAnswer: "Red 🔴",
    explanation: "Brilliant pattern tracking! Red comes next to continue the repeating pattern! 🔴"
  },
  {
    id: 8,
    subject: "math",
    question: "Which magic tool is best to measure how long your workbook or desk is? 📏",
    options: ["A thermometer 🌡️", "A measuring ruler 📏", "A kitchen scale ⚖️"],
    correctAnswer: "A measuring ruler 📏",
    explanation: "Great job! We use a measuring ruler to see how long things are in centimeters! 📏"
  },
  {
    id: 9,
    subject: "math",
    question: "What is the correct number code for 'thirty-five'?",
    options: ["35", "53", "305"],
    correctAnswer: "35",
    explanation: "Amazing! Thirty-five is written as 3 tens and 5 ones, which is 35! 💯"
  },
  {
    id: 10,
    subject: "math",
    question: "What is the total value of five shiny 1-rupee coins added together? 🪙",
    options: ["2 Rupees", "5 Rupees", "10 Rupees"],
    correctAnswer: "5 Rupees",
    explanation: "Perfect! Adding 1 rupee five times gives us exactly 5 Rupees! 🪙"
  },

  // --- LANGUAGE & LITERACY (Questions 11 - 20) ---
  {
    id: 11,
    subject: "lang",
    question: "Which magic letter comes right after 'C' in the alphabet song? 🔤",
    options: ["Letter B", "Letter D", "Letter E"],
    correctAnswer: "Letter D",
    explanation: "Super! A, B, C, D... D is the correct letter! Keep singing! 🎵"
  },
  {
    id: 12,
    subject: "lang",
    question: "Which spelling is correct for the friendly pet animal that says 'Woof Woof'? 🐶",
    options: ["Dag", "Dgo", "Dog"],
    correctAnswer: "Dog",
    explanation: "Excellent! D-O-G spells Dog! You are a word detective! 🐶"
  },
  {
    id: 13,
    subject: "lang",
    question: "When a friend shares a toy or gives you a gift, what polite words should you say? 🗣️",
    options: ["Thank you! 💖", "Give me more!", "Hello!"],
    correctAnswer: "Thank you! 💖",
    explanation: "Beautiful manners! Saying 'Thank you' makes everyone feel happy and appreciated! 💖"
  },
  {
    id: 14,
    subject: "lang",
    question: "In our exciting learning stories, who is Chiku? 🐵",
    options: ["A brave lion 🦁", "A singing parrot 🦜", "A playful little monkey 🐵"],
    correctAnswer: "A playful little monkey 🐵",
    explanation: "Yes! Chiku is our adorable, banana-loving monkey buddy! 🐵"
  },
  {
    id: 15,
    subject: "lang",
    question: "Which of these is a complete, correct sentence starting with a capital letter? ✏️",
    options: ["the cat sleeps.", "The cat sleeps.", "sleeping cat."],
    correctAnswer: "The cat sleeps.",
    explanation: "A++! Every sentence must start with a capital letter and end with a full stop! ✏️"
  },
  {
    id: 16,
    subject: "lang",
    question: "Rhyming words sound the same at the end. Which word rhymes with 'CAT'?",
    options: ["DOG", "HAT", "PIN"],
    correctAnswer: "HAT",
    explanation: "Lovely rhyme! Cat and Hat sound exactly the same at the end! 🎩"
  },
  {
    id: 17,
    subject: "lang",
    question: "In the word 'KNIFE', which starting letter is completely silent when we speak it?",
    options: ["Letter K", "Letter N", "Letter F"],
    correctAnswer: "Letter K",
    explanation: "Wow, you are a language wizard! The 'K' is silent, so we pronounce it as 'nife'! 🔈"
  },
  {
    id: 18,
    subject: "lang",
    question: "Which of these is an active action word (verb) that you do with your feet? 🏃",
    options: ["Read 📖", "Eat 🍎", "Run 🏃"],
    correctAnswer: "Run 🏃",
    explanation: "Terrific! Running is a high-energy action verb we do with our legs and feet! 🏃"
  },
  {
    id: 19,
    subject: "lang",
    question: "When doing Show & Tell, how should you speak so your friends can hear your story?",
    options: ["In a very quiet whisper", "Clearly and with a happy voice 📢", "With your back to everyone"],
    correctAnswer: "Clearly and with a happy voice 📢",
    explanation: "Perfect! Standing tall and speaking clearly makes your stories super fun to hear! 📢"
  },
  {
    id: 20,
    subject: "lang",
    question: "What is the front cover of a storybook used for? 📚",
    options: ["To hold the title and a beautiful picture 📚", "To draw on with markers", "To tear off and play with"],
    correctAnswer: "To hold the title and a beautiful picture 📚",
    explanation: "Yes! The front cover tells us the book's name and has a beautiful drawing to explore! 📚"
  },

  // --- DISCOVERY / EVS (Questions 21 - 30) ---
  {
    id: 21,
    subject: "evs",
    question: "Which amazing part of your body do you use to hear Kiki parrot's sweet voice? 👂",
    options: ["Your nose 👃", "Your eyes 👁️", "Your ears 👂"],
    correctAnswer: "Your ears 👂",
    explanation: "Sensational! We use our ears to listen to music, stories, and our animal friends! 👂"
  },
  {
    id: 22,
    subject: "evs",
    question: "Who are your mother and father's parents? 👴👵",
    options: ["Your aunts and uncles", "Your grandparents 👴👵", "Your cousins"],
    correctAnswer: "Your grandparents 👴👵",
    explanation: "Correct! Your grandparents love you so much and tell the best stories! 👵👴"
  },
  {
    id: 23,
    subject: "evs",
    question: "What are the flat, green parts of a tree that catch sunlight to make plant food? 🍃",
    options: ["Leaves 🍃", "Roots 🪵", "Flowers 🌸"],
    correctAnswer: "Leaves 🍃",
    explanation: "Wonderful! Leaves act like little solar panels, drinking in sunlight for the tree! 🌳"
  },
  {
    id: 24,
    subject: "evs",
    question: "Which beautiful wild animal has a super long neck to eat leaves from tall treetops? 🦒",
    options: ["Lion 🦁", "Giraffe 🦒", "Elephant 🐘"],
    correctAnswer: "Giraffe 🦒",
    explanation: "Spot on! The giraffe is the tallest animal, reaching high up with its long neck! 🦒"
  },
  {
    id: 25,
    subject: "evs",
    question: "Who is the brave community hero who drives a red truck and puts out fires? 🧑‍🚒",
    options: ["A doctor 🩺", "A police officer 👮", "A firefighter 🧑‍🚒"],
    correctAnswer: "A firefighter 🧑‍🚒",
    explanation: "Hooray! Firefighters keep our neighborhoods safe from dangerous fires! 🚒"
  },
  {
    id: 26,
    subject: "evs",
    question: "What useful shield should you carry to stay dry on a very rainy day? 🌧️",
    options: ["Sunglasses 🕶️", "An umbrella 🌂", "A sun hat 👒"],
    correctAnswer: "An umbrella 🌂",
    explanation: "Smart choice! An umbrella blocks the raindrops and keeps you dry and warm! 🌂"
  },
  {
    id: 27,
    subject: "evs",
    question: "Which of these snacks is a super healthy choice that gives your body long-term energy?",
    options: ["A fresh sweet apple 🍏", "A bag of salty potato chips 🍟", "A colorful candy bar 🍬"],
    correctAnswer: "A fresh sweet apple 🍏",
    explanation: "Yummy! Fresh fruits like apples are packed with natural vitamins for growth! 🍏"
  },
  {
    id: 28,
    subject: "evs",
    question: "Why is it important to turn off the water tap while brushing your teeth? 💧",
    options: ["To save precious clean water 💧", "Because water is too noisy", "To keep our brush dry"],
    correctAnswer: "To save precious clean water 💧",
    explanation: "Excellent eco-habit! Saving water protects our rivers and ensures there is enough for everyone! 💧"
  },
  {
    id: 29,
    subject: "evs",
    question: "Which gorgeous blue and green planet do we live on? 🌍",
    options: ["Mars 🔴", "Earth 🌍", "Venus 🟡"],
    correctAnswer: "Earth 🌍",
    explanation: "Home sweet home! Planet Earth is full of water, trees, animals, and clean air! 🌍"
  },
  {
    id: 30,
    subject: "evs",
    question: "Which bright, warm celestial object lights up our sky and starts the daytime? ☀️",
    options: ["The Moon 🌙", "The Sun ☀️", "A Shooting Star ☄️"],
    correctAnswer: "The Sun ☀️",
    explanation: "Glorious! The Sun is a giant star that provides warmth and light for our planet! ☀️"
  },

  // --- ART & CRAFT (Questions 31 - 40) ---
  {
    id: 31,
    subject: "art",
    question: "Which bright color is often associated with warmth, glowing sunshine, and happiness? 💛",
    options: ["Yellow 💛", "Grey 🩶", "Black 🖤"],
    correctAnswer: "Yellow 💛",
    explanation: "Beautiful! Yellow is a happy primary color that matches the sun and flowers! 🌻"
  },
  {
    id: 32,
    subject: "art",
    question: "What kind of line goes straight up and down, like a tall, strong tree trunk? ⬆️",
    options: ["Wavy line 〰️", "Vertical line ⬆️", "Horizontal line ⬅️"],
    correctAnswer: "Vertical line ⬆️",
    explanation: "Yes! Vertical lines stand tall and straight, going up to the sky! 🌲"
  },
  {
    id: 33,
    subject: "art",
    question: "What tools do we use directly to paint during a messy, fun finger-painting session? 🤚",
    options: ["A big wooden brush", "Our own clean fingers and hands 🤚", "Sponges and stamps"],
    correctAnswer: "Our own clean fingers and hands 🤚",
    explanation: "Incredible! Finger painting lets you touch colors and create designs with your hands! 🎨"
  },
  {
    id: 34,
    subject: "art",
    question: "How can we change the shape of clay to build a cute animal or a small cup? 🧸",
    options: ["Squeeze, roll, and mold it 🧸", "Paint it with water only", "Let it sit in a dark drawer"],
    correctAnswer: "Squeeze, roll, and mold it 🧸",
    explanation: "Spot on! Clay is squishy, so we can roll and mold it into any sculpture we dream of! 🧸"
  },
  {
    id: 35,
    subject: "art",
    question: "What materials do we glue together to make a beautiful, multi-colored collage? ✂️",
    options: ["Glued pieces of colorful paper ✂️", "A single pencil line", "Clean water in a cup"],
    correctAnswer: "Glued pieces of colorful paper ✂️",
    explanation: "Fabulous! A collage is made by tearing or cutting paper and pasting it into an art piece! 🧩"
  },
  {
    id: 36,
    subject: "art",
    question: "Origami is the famous traditional art of doing what to paper? 🦒",
    options: ["Folding paper sheets 🦒", "Cutting paper into tiny circles", "Throwing wet paint"],
    correctAnswer: "Folding paper sheets 🦒",
    explanation: "Amazing! Origami lets you fold a single square sheet of paper into birds, frogs, and stars! 📄"
  },
  {
    id: 37,
    subject: "art",
    question: "How do we create beautiful leaf printing art? 🍃",
    options: ["Paint a real leaf and press it on paper 🍃", "Draw a leaf with a heavy ruler", "Tear a leaf into tiny pieces"],
    correctAnswer: "Paint a real leaf and press it on paper 🍃",
    explanation: "Spectacular! Real leaf veins create a beautiful natural stamp pattern on paper! 🍃"
  },
  {
    id: 38,
    subject: "art",
    question: "What unique texture does sponge dabbing create on your paper background? 🧽",
    options: ["A smooth pencil line", "A textured, bubbly pattern 🧽", "A shiny metallic finish"],
    correctAnswer: "A textured, bubbly pattern 🧽",
    explanation: "Nice! Dabbing paint with a sponge creates soft, cloud-like patterns on your canvas! 🧽"
  },
  {
    id: 39,
    subject: "art",
    question: "What element can we add to a castle drawing to make it look 3D and realistic? 🏰",
    options: ["Adding shadows and height details 🏰", "Using only one color", "Drawing it as small as a dot"],
    correctAnswer: "Adding shadows and height details 🏰",
    explanation: "Super! Adding shadows and shading gives depth, making your castle stand out! 🏰"
  },
  {
    id: 40,
    subject: "art",
    question: "Why is there no such thing as a mistake in your art sketchbook? 🖌️",
    options: ["Because every mark can become a new creative idea! 🖌️", "Because art is graded with zero points", "Because we always erase everything"],
    correctAnswer: "Because every mark can become a new creative idea! 🖌️",
    explanation: "Beautiful philosophy! In art, mistakes are just happy accidents that lead to new ideas! 🎨✨"
  },

  // --- LIFE SKILLS (Questions 41 - 50) ---
  {
    id: 41,
    subject: "life",
    question: "How many times should we brush our teeth every day to keep them sparkling and healthy? 🪥",
    options: ["Once a week", "Two times a day (morning and night) 🪥", "Only on birthdays"],
    correctAnswer: "Two times a day (morning and night) 🪥",
    explanation: "Excellent dental habit! Brushing morning and night keeps cavities far away! 🪥"
  },
  {
    id: 42,
    subject: "life",
    question: "If your friend is sad because they lost a toy, what is the kindest thing to do? 🤗",
    options: ["Laugh at them", "Offer to help look for it or give a warm hug 🤗", "Walk away and play alone"],
    correctAnswer: "Offer to help look for it or give a warm hug 🤗",
    explanation: "You have a gold heart! Empathy and kindness make us super friends! 🤝"
  },
  {
    id: 43,
    subject: "life",
    question: "If you have a big box of crayons and a classmate has none, what should you do? 🤝",
    options: ["Hide your crayons", "Share your crayons so you both can color 🤝", "Tell them to buy their own"],
    correctAnswer: "Share your crayons so you both can color 🤝",
    explanation: "Generous! Sharing is caring, and it makes coloring together double the fun! 🖍️"
  },
  {
    id: 44,
    subject: "life",
    question: "What should you do when your teacher, parent, or friend is speaking to you? 👂",
    options: ["Look at them, listen quietly, and show you care 👂", "Talk over them loudly", "Play with your toys"],
    correctAnswer: "Look at them, listen quietly, and show you care 👂",
    explanation: "Fabulous listening! Using active listening shows respect and helps you learn fast! 👂"
  },
  {
    id: 45,
    subject: "life",
    question: "What is the most important health rule to do before eating any meal? 🧼",
    options: ["Wash your hands thoroughly with soap and water 🧼", "Start eating immediately with dirty hands", "Wipe your hands on your shirt"],
    correctAnswer: "Wash your hands thoroughly with soap and water 🧼",
    explanation: "Squeaky clean! Washing hands washes away invisible germs to keep us healthy! 🧼"
  },
  {
    id: 46,
    subject: "life",
    question: "When is it completely safe for children to cross a busy road? 🚦",
    options: ["When the pedestrian light is green and cars are stopped 🚦", "Whenever you feel like running across", "When you close your eyes and go"],
    correctAnswer: "When the pedestrian light is green and cars are stopped 🚦",
    explanation: "Safe and sound! Always hold an adult's hand and cross only at zebra crossings when safe! 🚦"
  },
  {
    id: 47,
    subject: "life",
    question: "What is a great way to save electricity at home and help our Earth? 💡",
    options: ["Leave all lights on when you go outside", "Turn off lights and fans when you leave a room 💡", "Keep the fridge door open"],
    correctAnswer: "Turn off lights and fans when you leave a room 💡",
    explanation: "Awesome! Turning off unused appliances saves energy and helps protect nature! 🌍"
  },
  {
    id: 48,
    subject: "life",
    question: "What is the best way to keep your study room tidy and pleasant to work in? 🧹",
    options: ["Put toys and books back in their places after use 🧹", "Throw everything under the bed", "Wait for someone else to clean it"],
    correctAnswer: "Put toys and books back in their places after use 🧹",
    explanation: "Neat and tidy! Organizing your space helps you find things easily and makes your room shine! ✨"
  },
  {
    id: 49,
    subject: "life",
    question: "How does belly breathing (slow deep breaths) help us when we feel nervous or angry? 🌬️",
    options: ["It makes us more angry", "It calms our heart rate and relaxes our mind 🌬️", "It makes us feel tired"],
    correctAnswer: "It calms our heart rate and relaxes our mind 🌬️",
    explanation: "Breathe in, breathe out! Belly breathing is your inner super anchor for calm! 🌬️"
  },
  {
    id: 50,
    subject: "life",
    question: "Which of these is a quiet superpower that anyone can use every single day? 💖",
    options: ["Flying high in the sky", "Being kind, helpful, and caring to others 💖", "Lifting heavy trucks with one hand"],
    correctAnswer: "Being kind, helpful, and caring to others 💖",
    explanation: "A true hero! Kindness is the ultimate superpower that changes the world! 💖🌎"
  }
];

// ==========================================
// VOLUME 2 GRADUATION QUESTIONS (50 Questions)
// ==========================================
export const GRADUATION_QUESTIONS_V2: TestQuestion[] = [
  // --- MATHEMATICS (Questions 1 - 10) ---
  {
    id: 101,
    subject: "math",
    question: "In our Place Value Castle, what does the number 2 in the tens place of '25' represent?",
    options: ["2 ones", "20 ones", "200 ones"],
    correctAnswer: "20 ones",
    explanation: "Splendid! The 2 in the tens place means 2 tens, which is exactly twenty! 🏰"
  },
  {
    id: 102,
    subject: "math",
    question: "When adding 18 and 5, we carry over a '1' to the tens place. What is the sum? 18 + 5 = ?",
    options: ["22", "23", "24"],
    correctAnswer: "23",
    explanation: "Super math power! 18 plus 5 is 23. You handled the carry-over like a champion! 🚀"
  },
  {
    id: 103,
    subject: "math",
    question: "We have 32 water balloons and we throw away 7. We borrow '1 ten' to solve 12 - 7. What is 32 - 7?",
    options: ["25", "27", "24"],
    correctAnswer: "25",
    explanation: "Magical! 32 subtract 7 leaves us with 25 balloons! Borrowing magic is fun! 🎈"
  },
  {
    id: 104,
    subject: "math",
    question: "Let's skip count by 5s like a happy rabbit! 5, 10, 15, ... What number comes next? 🐇",
    options: ["18", "20", "25"],
    correctAnswer: "20",
    explanation: "Boing boing! Yes! 20 comes next in our skip-counting sequence! 🐇"
  },
  {
    id: 105,
    subject: "math",
    question: "Chiku monkey has 3 plates, and each plate has 4 sweet strawberries. How many strawberries in total? 3 × 4 = ?",
    options: ["10", "12", "14"],
    correctAnswer: "12",
    explanation: "Yum! 3 groups of 4 make exactly 12 delicious strawberries! ✖️"
  },
  {
    id: 106,
    subject: "math",
    question: "If the little hand is on 3 and the big hand is on 12 on a clock, what time is it? ⏰",
    options: ["12 o'clock", "3 o'clock", "6 o'clock"],
    correctAnswer: "3 o'clock",
    explanation: "Tick-tock, perfect clock reading! It is exactly 3 o'clock! ⏰"
  },
  {
    id: 107,
    subject: "math",
    question: "Which calendar buddy has exactly 12 months in its cycle?",
    options: ["A week", "A year 📅", "A month"],
    correctAnswer: "A year 📅",
    explanation: "Terrific! A whole year has 12 exciting months, from January to December! 📅"
  },
  {
    id: 108,
    subject: "math",
    question: "Your pencil measures 12 centimeters on a ruler. If you sharpen it and lose 2 centimeters, how long is it now?",
    options: ["10 cm 📏", "14 cm", "8 cm"],
    correctAnswer: "10 cm 📏",
    explanation: "Great job! 12 minus 2 is 10 centimeters of creative drawing power! 📏"
  },
  {
    id: 109,
    subject: "math",
    question: "Which of these shape friends is 3D and solid like a real playing block? 🧊",
    options: ["A flat Square 🟥", "A solid Cube 🧊", "A flat Circle 🔴"],
    correctAnswer: "A solid Cube 🧊",
    explanation: "Spot on! A cube is a 3D solid shape with 6 flat square faces! 🧊"
  },
  {
    id: 110,
    subject: "math",
    question: "If we slice a delicious chocolate cake perfectly into two equal halves, what fraction is one slice? 🍰",
    options: ["One-half (1/2) 🍰", "One-third (1/3)", "One-quarter (1/4)"],
    correctAnswer: "One-half (1/2) 🍰",
    explanation: "Sweet! Cutting something in two equal parts gives us one-half! 🍰"
  },

  // --- LANGUAGE & LITERACY (Questions 11 - 20) ---
  {
    id: 111,
    subject: "lang",
    question: "In the word 'BOAT', the letters 'O' and 'A' work together as a vowel team. What sound does this team make?",
    options: ["A short 'o' sound", "A long 'O' sound like in 'go' 🥖", "A quiet 'ah' sound"],
    correctAnswer: "A long 'O' sound like in 'go' 🥖",
    explanation: "Spot on! When two vowels go walking, the first one does the talking and says its name! 🥖"
  },
  {
    id: 112,
    subject: "lang",
    question: "Which of these word types represents a person, place, or thing, like 'school' or 'Chiku'?",
    options: ["An Adjective", "A Noun 🏷️", "A Verb"],
    correctAnswer: "A Noun 🏷️",
    explanation: "Correct! Nouns are naming words for people, places, animals, and things! 🏷️"
  },
  {
    id: 113,
    subject: "lang",
    question: "Instead of saying 'Kiki has a book. Kiki likes reading', we use a pronoun buddy. What is it? 👥",
    options: ["She 👥", "It", "They"],
    correctAnswer: "She 👥",
    explanation: "Wonderful! We use 'She' to replace the noun 'Kiki' and make our sentence sound smoother! 👥"
  },
  {
    id: 114,
    subject: "lang",
    question: "Which word is a sparkly adjective that describes a beautiful, glowing star? ✨",
    options: ["Bright ✨", "Fly", "Sky"],
    correctAnswer: "Bright ✨",
    explanation: "Fantastic! 'Bright' is an adjective because it describes how the star looks! ✨"
  },
  {
    id: 115,
    subject: "lang",
    question: "What type of word is 'JUMP', which describes an energetic physical action? 🏃",
    options: ["A Noun", "An Adjective", "A Verb 🏃"],
    correctAnswer: "A Verb 🏃",
    explanation: "Hooray! Verbs are action words that show what someone or something is doing! 🏃"
  },
  {
    id: 116,
    subject: "lang",
    question: "Synonyms are words that have the same meaning. What is a synonym for the word 'LARGE'? 💎",
    options: ["Tiny", "Huge 💎", "Quick"],
    correctAnswer: "Huge 💎",
    explanation: "Incredible! Large and Huge are synonyms because they both mean very big! 💎"
  },
  {
    id: 117,
    subject: "lang",
    question: "Which of these is a questioning word used to ask about a specific time or day? ❓",
    options: ["Who", "Where", "When ❓"],
    correctAnswer: "When ❓",
    explanation: "Perfect! We use 'When' to ask about time, like 'When is play time?'! ❓"
  },
  {
    id: 118,
    subject: "lang",
    question: "A diary is a special notebook where you write about what? 📝",
    options: ["Math multiplication tables", "Your daily thoughts, events, and feelings 📝", "Random scribbles with markers"],
    correctAnswer: "Your daily thoughts, events, and feelings 📝",
    explanation: "Beautiful! Writing in a daily diary helps you express your feelings and track your growth! 📝"
  },
  {
    id: 119,
    subject: "lang",
    question: "When telling a story to friends, what can you use to make animal characters come alive?",
    options: ["Different funny voices and expressions 📖", "No expression at all", "A very loud whistle"],
    correctAnswer: "Different funny voices and expressions 📖",
    explanation: "Yes! Using expressive voices and gestures makes your storytelling super magical! 📖"
  },
  {
    id: 120,
    subject: "lang",
    question: "Poems are beautiful writing pieces that often use what special audio feature? ✍️",
    options: ["Loud shouting", "Rhyming words at the end of lines ✍️", "No spelling rules"],
    correctAnswer: "Rhyming words at the end of lines ✍️",
    explanation: "Wonderful! Rhyming words give poems a musical beat that is fun to speak and hear! ✍️"
  },

  // --- DISCOVERY / EVS (Questions 21 - 30) ---
  {
    id: 121,
    subject: "evs",
    question: "Which super inner-body organ works like a computer to help you think, learn, and feel? 🧠",
    options: ["Your Heart", "Your Brain 🧠", "Your Lungs"],
    correctAnswer: "Your Brain 🧠",
    explanation: "Sensational! Your brain controls everything you do and stores all your beautiful memories! 🧠"
  },
  {
    id: 122,
    subject: "evs",
    question: "Which shelter buddy is made of sturdy bricks and cement, and cannot be easily moved? 🏡",
    options: ["A tent made of cloth", "A permanent house (pucca house) 🏡", "A wooden caravan on wheels"],
    correctAnswer: "A permanent house (pucca house) 🏡",
    explanation: "Perfect! Brick houses are strong and keep us safe from heavy rain and wind! 🏡"
  },
  {
    id: 123,
    subject: "evs",
    question: "Who works hard on the farm to grow healthy crops and vegetables for our tables? 🌾",
    options: ["A pilot", "A farmer 🌾", "A chef"],
    correctAnswer: "A farmer 🌾",
    explanation: "Yes! Farmers are food heroes who look after the soil, water, and crops! 🌾"
  },
  {
    id: 124,
    subject: "evs",
    question: "What is the very first stage in a plant's lifecycle before it grows roots and leaves? 🌱",
    options: ["A flower", "A seed 🌱", "A giant tree"],
    correctAnswer: "A seed 🌱",
    explanation: "Spot on! Every beautiful plant starts as a tiny seed sleeping in the warm soil! 🌱"
  },
  {
    id: 125,
    subject: "evs",
    question: "Which of these is a community space where you go to read books and study quietly?",
    options: ["A playground", "A library ⛪", "A fire station"],
    correctAnswer: "A library ⛪",
    explanation: "A library is a treasure chest of books where everyone can learn and read! 📚"
  },
  {
    id: 126,
    subject: "evs",
    question: "What is a major source of fresh water on Earth that falls from the clouds? 💨",
    options: ["Rainwater 💧", "The ocean salt-water", "Wind storms"],
    correctAnswer: "Rainwater 💧",
    explanation: "Beautiful! Rainwater fills our lakes and rivers, giving us clean water to live! 💧"
  },
  {
    id: 127,
    subject: "evs",
    question: "In which season do we wear warm woolen sweaters, coats, and mufflers? ⛅",
    options: ["Summer season", "Winter season ⛅", "Monsoon season"],
    correctAnswer: "Winter season ⛅",
    explanation: "Stay warm! Woolen clothes trap heat and keep us cozy during cold winter days! ❄️"
  },
  {
    id: 128,
    subject: "evs",
    question: "Which high-speed vehicle flies in the air and helps us travel across oceans quickly? 🚀",
    options: ["A motorboat", "An airplane 🚀", "A bicycle"],
    correctAnswer: "An airplane 🚀",
    explanation: "Perfect! Airplanes zoom through the sky to carry passengers to far countries! ✈️"
  },
  {
    id: 129,
    subject: "evs",
    question: "What electronic tool can we use to send instant written text messages to friends? 📱",
    options: ["A postal envelope", "A mobile phone 📱", "A paper airplane"],
    correctAnswer: "A mobile phone 📱",
    explanation: "Great! Mobile phones let us send texts and call loved ones in seconds! 📱"
  },
  {
    id: 130,
    subject: "evs",
    question: "Where should we always throw dry and wet waste to keep our neighborhood clean? 🧹",
    options: ["On the public road", "In the waste dustbins 🧹", "In the local park pond"],
    correctAnswer: "In the waste dustbins 🧹",
    explanation: "Eco-hero! Throwing waste in dustbins prevents germs and keeps our planet green! 🧹"
  },

  // --- ART & CRAFT (Questions 31 - 40) ---
  {
    id: 131,
    subject: "art",
    question: "What color is created when you mix the primary colors Yellow and Blue? 🎨",
    options: ["Purple", "Green 🎨", "Orange"],
    correctAnswer: "Green 🎨",
    explanation: "Splendid! Yellow and Blue work together to create a gorgeous Green color! 🟢"
  },
  {
    id: 132,
    subject: "art",
    question: "If you fold a paper butterfly down the middle and both sides match perfectly, what is this called? 🦋",
    options: ["Symmetry 🦋", "Asymmetry", "Perspective"],
    correctAnswer: "Symmetry 🦋",
    explanation: "Beautiful! Symmetry means both sides of an object are identical mirror images! 🦋"
  },
  {
    id: 133,
    subject: "art",
    question: "What handy kitchen vegetable can we cut and dip in paint to make flower patterns? 🧄",
    options: ["A soft tomato", "A ladyfinger (okra) or potato 🧄", "A long carrot"],
    correctAnswer: "A ladyfinger (okra) or potato 🧄",
    explanation: "Amazing! Okra has a beautiful star-like cross-section that makes a natural stamp! 🧄"
  },
  {
    id: 134,
    subject: "art",
    question: "What recyclable item is excellent for building sturdy cardboard castle walls? 📦",
    options: ["An empty shoe box or tissue box 📦", "A plastic shopping bag", "A metal spoon"],
    correctAnswer: "An empty shoe box or tissue box 📦",
    explanation: "Super recycling! Cardboard boxes make strong walls and towers for toy castles! 🏰"
  },
  {
    id: 135,
    subject: "art",
    question: "Stick figure comics are a great way to draw what kind of stories? ✏️",
    options: ["Stories with lots of action and movement ✏️", "Paintings with realistic shadows", "A single dot on a canvas"],
    correctAnswer: "Stories with lots of action and movement ✏️",
    explanation: "Terrific! Stick figures are quick to draw, showing high-energy actions and poses! 🏃"
  },
  {
    id: 136,
    subject: "art",
    question: "A mosaic is a beautiful picture created by gluing together tiny pieces of what? 🧩",
    options: ["Colored paper, tiles, or shells 🧩", "Long straight metal wires", "Clean water droplets"],
    correctAnswer: "Colored paper, tiles, or shells 🧩",
    explanation: "Fabulous! Fitting small colorful pieces together creates stunning mosaic art! 🎨"
  },
  {
    id: 137,
    subject: "art",
    question: "When making a carnival mask, why do we cut out two empty spaces near the top? 🎭",
    options: ["For our ears to fit through", "For our eyes to see through 🎭", "To breathe through our mouth"],
    correctAnswer: "For our eyes to see through 🎭",
    explanation: "Exactly! Eye holes let you look around and enjoy the festival while wearing your mask! 🎭"
  },
  {
    id: 138,
    subject: "art",
    question: "How do we create textured bubble painting art? 🫧",
    options: ["Mix paint with liquid soap and blow bubbles with a straw 🫧", "Use a dry toothbrush on paper", "Drip water directly on paint"],
    correctAnswer: "Mix paint with liquid soap and blow bubbles with a straw 🫧",
    explanation: "Wow! When the colorful paint bubbles pop on paper, they leave bubbly rings! 🫧"
  },
  {
    id: 139,
    subject: "art",
    question: "What is the main purpose of creating a hand-drawn Greeting Card? 💌",
    options: ["To show how fast you can write", "To send a loving message and wish a friend well 💌", "To test if your glue is sticky"],
    correctAnswer: "To send a loving message and wish a friend well 💌",
    explanation: "Beautiful! Making cards shows your love and makes your friends feel very special! 💌"
  },
  {
    id: 140,
    subject: "art",
    question: "When designing a repeating border pattern, what should you do with your shapes? 📐",
    options: ["Change them randomly on every page", "Repeat the same shapes in a fixed order 📐", "Erase them as soon as you draw"],
    correctAnswer: "Repeat the same shapes in a fixed order 📐",
    explanation: "Excellent pattern designer! Repeating shapes creates rhythm and a beautiful border! 📐"
  },

  // --- LIFE SKILLS (Questions 41 - 50) ---
  {
    id: 141,
    subject: "life",
    question: "What kind of foods should fill our healthy daily meal plates? 🍎",
    options: ["Salty potato chips and cold sodas", "A colorful mix of vegetables, fruits, and grains 🍎", "Chocolate pastries and candies"],
    correctAnswer: "A colorful mix of vegetables, fruits, and grains 🍎",
    explanation: "Super health champ! Eating colorful fruits and vegetables gives you a super strong body! 🍎"
  },
  {
    id: 142,
    subject: "life",
    question: "If you get lost in a shopping center, who is a safe helper to ask for help?",
    options: ["A random stranger walking by", "A store manager or security officer in uniform 👮", "No one, you should run outside"],
    correctAnswer: "A store manager or security officer in uniform 👮",
    explanation: "Yes! Uniformed staff and police officers are safe helpers who can contact your parents! 👮"
  },
  {
    id: 143,
    subject: "life",
    question: "In a cooperation relay game, what is the best way to succeed as a team? 🤸",
    options: ["Run as fast as you can without looking at partners", "Work together, support each other, and pass safely 🤸", "Shout at partners who are slow"],
    correctAnswer: "Work together, support each other, and pass safely 🤸",
    explanation: "Fantastic teamwork! Cooperation and cheering for your buddies makes winning sweet! 🤝"
  },
  {
    id: 144,
    subject: "life",
    question: "What is an excellent way to save water at home and help our local rivers? 💧",
    options: ["Leaving the garden pipe running", "Closing the tap while rubbing soap on hands 💧", "Taking long bath tub showers"],
    correctAnswer: "Closing the tap while rubbing soap on hands 💧",
    explanation: "Eco-hero! Turning off the tap when not directly using water saves thousands of drops! 💧"
  },
  {
    id: 145,
    subject: "life",
    question: "If you have a pet puppy or cat at home, how should you treat them? 🐶",
    options: ["With kindness, gentle strokes, and timely food 🐶", "Pull their tails for fun", "Ignore them and lock them in a dark closet"],
    correctAnswer: "With kindness, gentle strokes, and timely food 🐶",
    explanation: "Sweetest heart! Pets are family and deserve our gentle care, nutrition, and love! 🐶"
  },
  {
    id: 146,
    subject: "life",
    question: "If you accidentally bump into a classmate and their pencil falls, what should you say? 🌟",
    options: ["It's not my fault!", "Say 'I am sorry' politely and help pick it up 🌟", "Walk away quickly"],
    correctAnswer: "Say 'I am sorry' politely and help pick it up 🌟",
    explanation: "Perfect manners! Saying sorry and helping others heals accidents immediately! 💖"
  },
  {
    id: 147,
    subject: "life",
    question: "When should you make your bed to keep your bedroom tidy and organized? 🛏️",
    options: ["Right after you wake up in the morning 🛏️", "Only when guests are visiting", "Once a year on your birthday"],
    correctAnswer: "Right after you wake up in the morning 🛏️",
    explanation: "Excellent morning habit! Making your bed starts your day with a tiny victory! 🛏️"
  },
  {
    id: 148,
    subject: "life",
    question: "When presenting on a stage, what should you do with your eyes? 🎙️",
    options: ["Look down at your shoes", "Look at your audience with a friendly smile 🎙️", "Close your eyes so you don't feel nervous"],
    correctAnswer: "Look at your audience with a friendly smile 🎙️",
    explanation: "Hooray! Making eye contact and smiling builds high-confidence speaking power! 🎙️"
  },
  {
    id: 149,
    subject: "life",
    question: "When doing mindful breathing, what should we focus our attention on? 🌬️",
    options: ["The gentle feel of air flowing in and out of our nose 🌬️", "Our weekend playing plans", "The ticking sound of a clock only"],
    correctAnswer: "The gentle feel of air flowing in and out of our nose 🌬️",
    explanation: "Breathe in, breathe out! Focusing on your breath brings your mind to a peaceful calm! 🧘‍♀️"
  },
  {
    id: 150,
    subject: "life",
    question: "What makes your own personal mindful space feel comfortable and calming? 🧘",
    options: ["Loud pop music playing", "A quiet, neat corner with cozy pillows and books 🧘", "Messy toys thrown everywhere"],
    correctAnswer: "A quiet, neat corner with cozy pillows and books 🧘",
    explanation: "Perfect! A clean, quiet space helps you sit back, relax, and calm your thoughts! 🌸"
  }
];

// ==========================================
// VOLUME 3 GRADUATION QUESTIONS (50 Questions)
// ==========================================
export const GRADUATION_QUESTIONS_V3: TestQuestion[] = [
  // --- MATHEMATICS (Questions 1 - 10) ---
  {
    id: 201,
    subject: "math",
    question: "How do we write 'nine hundred and forty-two' in numbers? 🚀",
    options: ["924", "942", "9042"],
    correctAnswer: "942",
    explanation: "Perfect! Nine hundred and forty-two is written as 942! 🚀"
  },
  {
    id: 202,
    subject: "math",
    question: "Solve the 3-digit math battle: 300 + 450 = ? ⚔️",
    options: ["700", "750", "850"],
    correctAnswer: "750",
    explanation: "Outstanding! 300 + 450 makes exactly 750! You are a master calculator! ⚔️"
  },
  {
    id: 203,
    subject: "math",
    question: "What is the correct value of 7 times 8 in times tables? 7 × 8 = ? ✖️",
    options: ["54", "56", "64"],
    correctAnswer: "56",
    explanation: "Spectacular multiplication! 7 × 8 is exactly 56! 🏆"
  },
  {
    id: 204,
    subject: "math",
    question: "If 15 sweet cherries are shared equally among 3 happy children, how many does each child get? 15 ÷ 3 = ?",
    options: ["4 cherries", "5 cherries", "6 cherries"],
    correctAnswer: "5 cherries",
    explanation: "Wonderful sharing! 15 divided by 3 gives each child exactly 5 cherries! ➗"
  },
  {
    id: 205,
    subject: "math",
    question: "A pizza is cut into 8 equal slices. If Chiku eats 3 slices, what fraction of the pizza did he eat? 🍕",
    options: ["3/8 🍕", "5/8", "1/8"],
    correctAnswer: "3/8 🍕",
    explanation: "Spot on fraction work! Chiku ate 3 out of 8 slices, which is 3/8! 🍕"
  },
  {
    id: 206,
    subject: "math",
    question: "Which of these units is best to measure the weight (mass) of a heavy sack of rice? ⚖️",
    options: ["Grams (g)", "Kilograms (kg) ⚖️", "Liters (L)"],
    correctAnswer: "Kilograms (kg) ⚖️",
    explanation: "Super weight unit! We use kilograms for heavy things and grams for lighter things! ⚖️"
  },
  {
    id: 207,
    subject: "math",
    question: "You have 50 Rupees. You buy a toy plane for 35 Rupees. How much pocket money is left? 💵",
    options: ["10 Rupees", "15 Rupees", "25 Rupees"],
    correctAnswer: "15 Rupees",
    explanation: "Great budget math! 50 subtract 35 leaves you with exactly 15 Rupees! 💵"
  },
  {
    id: 208,
    subject: "math",
    question: "If a calendar month starts on a Monday, what day of the week is the 8th day of that month? 📅",
    options: ["Monday 📅", "Tuesday", "Sunday"],
    correctAnswer: "Monday 📅",
    explanation: "Brilliant calendar reading! Adding 7 days to a date brings you back to the exact same weekday! 📅"
  },
  {
    id: 209,
    subject: "math",
    question: "In a bar chart, the height of a bar represents what information? 📊",
    options: ["How colorful the drawing is", "The quantity or number value of that item 📊", "The name of the researcher"],
    correctAnswer: "The quantity or number value of that item 📊",
    explanation: "Excellent data tracking! The taller the bar, the larger the quantity it measures! 📊"
  },
  {
    id: 210,
    subject: "math",
    question: "What is 0.5 written as a simple fraction? 🪙",
    options: ["1/5", "1/2 🪙", "1/10"],
    correctAnswer: "1/2 🪙",
    explanation: "Perfect! 0.5 represents five-tenths, which simplifies to exactly one-half! 🪙"
  },

  // --- LANGUAGE & LITERACY (Questions 11 - 20) ---
  {
    id: 211,
    subject: "lang",
    question: "What does the prefix 'UN-' change the word 'HAPPY' into? 🪄",
    options: ["Very happy", "Not happy (unhappy) 🪄", "Happier"],
    correctAnswer: "Not happy (unhappy) 🪄",
    explanation: "Magic spelling! The prefix 'un-' means 'not', so unhappy means not happy! 🪄"
  },
  {
    id: 212,
    subject: "lang",
    question: "Adverbs tell us how an action is done. Which word is an adverb in: 'Kiki sings SWEETLY'? 🏃",
    options: ["Sings", "Sweetly 🏃", "Kiki"],
    correctAnswer: "Sweetly 🏃",
    explanation: "Hooray! 'Sweetly' is an adverb because it describes *how* Kiki sings! 🏃"
  },
  {
    id: 213,
    subject: "lang",
    question: "Conjunctions connect sentences. Which conjunction shows a contrast: 'I want to play, ___ it is raining'?",
    options: ["and", "but 🔗", "because"],
    correctAnswer: "but 🔗",
    explanation: "Awesome connecting! We use 'but' to link two contrasting or opposite ideas! 🔗"
  },
  {
    id: 214,
    subject: "lang",
    question: "Which of these sentences is written in the past tense, describing something that already happened? ⏳",
    options: ["Chiku climbs the tree.", "Chiku climbed the tree. ⏳", "Chiku will climb the tree."],
    correctAnswer: "Chiku climbed the tree. ⏳",
    explanation: "Wonderful! The '-ed' ending in 'climbed' tells us the action happened in the past! ⏳"
  },
  {
    id: 215,
    subject: "lang",
    question: "When you are a comprehension detective, where do you find the clues to answer story questions? 🔍",
    options: ["By guessing randomly", "By carefully reading the sentences in the text 🔍", "By asking friends what they think"],
    correctAnswer: "By carefully reading the sentences in the text 🔍",
    explanation: "Super reading detective! The text holds all the true answers if you inspect closely! 🔍"
  },
  {
    id: 216,
    subject: "lang",
    question: "What is the correct plural spelling for the word 'BOX'? 📖",
    options: ["Boxs", "Boxes 📖", "Boxies"],
    correctAnswer: "Boxes 📖",
    explanation: "Great spelling! Words ending in 'x' require '-es' to become plural! 📖"
  },
  {
    id: 217,
    subject: "lang",
    question: "What are the three main parts of writing a creative and exciting story? ✍️",
    options: ["Beginning, Middle, and End ✍️", "Title, Author, and Index", "Paper, Pen, and Desk"],
    correctAnswer: "Beginning, Middle, and End ✍️",
    explanation: "Spectacular! A great story introduces characters, faces an adventure, and resolves happily! ✍️"
  },
  {
    id: 218,
    subject: "lang",
    question: "Similes compare things using 'like' or 'as'. What is compared in: 'He is as brave as a LION'? 🦁",
    options: ["His strength to an elephant", "His bravery to a lion's courage 🦁", "His height to a giraffe"],
    correctAnswer: "His bravery to a lion's courage 🦁",
    explanation: "Brilliant! 'As brave as a lion' tells us he has huge courage, just like a lion! 🦁"
  },
  {
    id: 219,
    subject: "lang",
    question: "When acting in conversation pairs, why is it vital to wait for your partner to finish speaking? 💬",
    options: ["Because you might forget your lines", "To show respectful listening and respond correctly 💬", "Because speaking together is fun"],
    correctAnswer: "To show respectful listening and respond correctly 💬",
    explanation: "Perfect active listening! Waiting for your turn builds great understanding and friendship! 💬"
  },
  {
    id: 220,
    subject: "lang",
    question: "In a theatrical play, what is the script used for? 🎭",
    options: ["To hold the character lines and stage directions 🎭", "To build the background scenery", "To print tickets for viewers"],
    correctAnswer: "To hold the character lines and stage directions 🎭",
    explanation: "Yes! The script tells the actors exactly what to say and how to move on stage! 🎭"
  },

  // --- DISCOVERY / EVS (Questions 21 - 30) ---
  {
    id: 221,
    subject: "evs",
    question: "Which habitat is home to salt-water plants, colorful coral reefs, and dolphins? 🌊",
    options: ["The sandy desert", "The ocean 🌊", "The grassy meadow"],
    correctAnswer: "The ocean 🌊",
    explanation: "Perfect! Oceans are giant saltwater ecosystems teeming with marine life! 🐬"
  },
  {
    id: 222,
    subject: "evs",
    question: "What is the name of the green magic pigment in leaves that catches sunlight for photosynthesis? 🌱",
    options: ["Oxygen", "Chlorophyll 🌱", "Carbon dioxide"],
    correctAnswer: "Chlorophyll 🌱",
    explanation: "Spectacular science knowledge! Chlorophyll gives leaves their green color and captures sunlight! 🍃"
  },
  {
    id: 223,
    subject: "evs",
    question: "In the water cycle, what do we call water changing from liquid to gas and rising up? 🌧️",
    options: ["Condensation", "Evaporation 🌧️", "Precipitation"],
    correctAnswer: "Evaporation 🌧️",
    explanation: "Outstanding! Heat from the sun evaporates liquid water into invisible vapor! ☀️"
  },
  {
    id: 224,
    subject: "evs",
    question: "Why are earthworms called 'friends of the soil'? 🪱",
    options: ["Because they eat plant flowers", "Because they loosen the soil and make it rich 🪱", "Because they are colorful"],
    correctAnswer: "Because they loosen the soil and make it rich 🪱",
    explanation: "Yes! Earthworms tunnel through the earth, adding air and nutrients for crops! 🪱"
  },
  {
    id: 225,
    subject: "evs",
    question: "Who are our local government helpers responsible for keeping city drinking water clean? 🏛️",
    options: ["The traffic police", "Municipal corporation sanitation engineers 🏛️", "Postmen"],
    correctAnswer: "Municipal corporation sanitation engineers 🏛️",
    explanation: "Correct! Local municipal bodies manage public water supply, waste, and parks! 🏛️"
  },
  {
    id: 226,
    subject: "evs",
    question: "What is the first step when someone suffers a small cut or scrape? 🩹",
    options: ["Apply colorful paints", "Clean the wound with clean running water 🩹", "Wrap it tightly in a blanket"],
    correctAnswer: "Clean the wound with clean running water 🩹",
    explanation: "Excellent first aid! Washing the scrape removes dirt and prevents germ infections! 🩹"
  },
  {
    id: 227,
    subject: "evs",
    question: "What is a natural way to preserve fresh fruits, like making sweet mango pickles? 🍏",
    options: ["Adding oil, salt, or sugar to lock out air 🍏", "Leaving them out in the sun forever", "Washing them in soapy water"],
    correctAnswer: "Adding oil, salt, or sugar to lock out air 🍏",
    explanation: "Yummy science! High salt and oil prevent microbial growth, preserving food for months! 🍏"
  },
  {
    id: 228,
    subject: "evs",
    question: "Which of these is the largest planet in our solar system, famous for its big red spot? 🪐",
    options: ["Mars", "Jupiter 🪐", "Saturn"],
    correctAnswer: "Jupiter 🪐",
    explanation: "Jupiter is a giant gas planet, so big that all other planets could fit inside it! 🪐"
  },
  {
    id: 229,
    subject: "evs",
    question: "What is the meaning of the ecological term: Reduce, Reuse, and Recycle? 🌍",
    options: ["Throwing more waste on the road", "Using resources wisely to minimize waste and protect Earth 🌍", "Buying new things every day"],
    correctAnswer: "Using resources wisely to minimize waste and protect Earth 🌍",
    explanation: "Perfect! Following the 3 Rs saves energy, raw materials, and protects forests! 🌳"
  },
  {
    id: 230,
    subject: "evs",
    question: "What is a main role of plants and trees in keeping our neighborhood ecosystem healthy?",
    options: ["They generate plastic materials", "They release fresh Oxygen and absorb Carbon Dioxide 🌳", "They block all rain clouds"],
    correctAnswer: "They release fresh Oxygen and absorb Carbon Dioxide 🌳",
    explanation: "Hooray! Trees are our green lungs, providing fresh oxygen for humans and animals! 🌬️"
  },

  // --- ART & CRAFT (Questions 31 - 40) ---
  {
    id: 231,
    subject: "art",
    question: "Which of these color groups are warm colors that evoke fire, autumn leaves, and heat? 🎨",
    options: ["Blue, Green, and Purple", "Red, Orange, and Yellow 🎨", "Grey, Silver, and White"],
    correctAnswer: "Red, Orange, and Yellow 🎨",
    explanation: "Beautiful! Red, orange, and yellow make paintings feel warm, energetic, and sunny! ☀️"
  },
  {
    id: 232,
    subject: "art",
    question: "In drawing, what does 'perspective' mean? 🗺️",
    options: ["Using only bright primary colors", "Showing distance so close objects look big and far objects look small 🗺️", "Drawing with your eyes closed"],
    correctAnswer: "Showing distance so close objects look big and far objects look small 🗺️",
    explanation: "Spot on! Perspective creates a 3D depth on a flat piece of paper! 🗺️"
  },
  {
    id: 233,
    subject: "art",
    question: "What modeling material stays squishy and moldable without drying out quickly like mud? 🧸",
    options: ["Plain school paper", "Plasticine or modeling clay 🧸", "Hot liquid glue"],
    correctAnswer: "Plasticine or modeling clay 🧸",
    explanation: "Incredible! Plasticine allows you to remodel figures over and over again! 🧸"
  },
  {
    id: 234,
    subject: "art",
    question: "How do you create abstract patterns using thread painting? 🧵",
    options: ["Dip a thread in paint, fold it inside paper, and pull the thread out 🧵", "Use a needle to sew shapes on paper", "Wrap a book in wet wool thread"],
    correctAnswer: "Dip a thread in paint, fold it inside paper, and pull the thread out 🧵",
    explanation: "Spectacular! Pulling the painted thread creates organic, ribbon-like leaf patterns! 🎨"
  },
  {
    id: 235,
    subject: "art",
    question: "What creates the dramatic shadows in a traditional shadow puppetry theater? 👥",
    options: ["A bright light shining behind a semi-clear cloth screen 👥", "A very dark container filled with water", "Multi-colored laser lights"],
    correctAnswer: "A bright light shining behind a semi-clear cloth screen 👥",
    explanation: "Perfect! The light blocks the opaque puppet figures, creating crisp dark shapes! 👥"
  },
  {
    id: 236,
    subject: "art",
    question: "Paper weaving lets us create beautiful checkerboard designs by interlacing what? 🧶",
    options: ["Torn wet tissue sheets", "Vertical strips (warp) and horizontal strips (weft) of paper 🧶", "Pencil lines only"],
    correctAnswer: "Vertical strips (warp) and horizontal strips (weft) of paper 🧶",
    explanation: "Terrific! Weaving paper strips under and over creates gorgeous woven crafts! 🧶"
  },
  {
    id: 237,
    subject: "art",
    question: "What is the best way to attach puppet eyes and hair to a fluffy woolen sock puppet? 🧦",
    options: ["Using plain clear water", "Using fabric glue or adult-supervised stitching 🧦", "Pressing them with a wooden ruler"],
    correctAnswer: "Using fabric glue or adult-supervised stitching 🧦",
    explanation: "Amazing! Fabric glue makes your sock puppet sturdy and ready for play acting! 🧦"
  },
  {
    id: 238,
    subject: "art",
    question: "How do we create organic blow painting art? 🌬️",
    options: ["Blowing air through a drinking straw to spread wet paint droplets 🌬️", "Using an electric fan on high speed", "Blowing dry chalk powder"],
    correctAnswer: "Blowing air through a drinking straw to spread wet paint droplets 🌬️",
    explanation: "Fabulous! Blow painting spreads paint in branching lines, perfect for drawing trees! 🌳"
  },
  {
    id: 239,
    subject: "art",
    question: "What is an excellent rule of outdoor sketching day? 🌲",
    options: ["Draw only from your imagination", "Look closely at real trees, shadows, and record what you see 🌲", "Erase all lines that aren't straight"],
    correctAnswer: "Look closely at real trees, shadows, and record what you see 🌲",
    explanation: "Wonderful! Observing real nature is the secret of capturing life-like details! 🎨"
  },
  {
    id: 240,
    subject: "art",
    question: "An abstract sculpture represents what kind of design? 🗿",
    options: ["A highly realistic drawing of an animal", "Shapes, lines, and textures that express feelings rather than objects 🗿", "A blank white canvas block"],
    correctAnswer: "Shapes, lines, and textures that express feelings rather than objects 🗿",
    explanation: "Splendid! Abstract art uses shapes and colors to trigger your wild imagination! 🎨✨"
  },

  // --- LIFE SKILLS (Questions 41 - 50) ---
  {
    id: 241,
    subject: "life",
    question: "What is a vital emergency item to keep inside a basic First Aid box? 🩹",
    options: ["Salty snack packets", "Antiseptic wipes and adhesive bandages 🩹", "Stickers and colored pencils"],
    correctAnswer: "Antiseptic wipes and adhesive bandages 🩹",
    explanation: "Excellent health safety! Bandages keep cuts clean and protected from dirt! 🩹"
  },
  {
    id: 242,
    subject: "life",
    question: "Why is cultural respect important when meeting friends from different states or countries? 🌍",
    options: ["To show we are better than them", "Because everyone's customs are beautiful and we can learn together 🌍", "Because it is required to pass a exam"],
    correctAnswer: "Because everyone's customs are beautiful and we can learn together 🌍",
    explanation: "Heart of gold! Celebrating our differences makes our community vibrant and unified! 🤝"
  },
  {
    id: 243,
    subject: "life",
    question: "What is the best way to handle a big problem, like your toy breaking? 💡",
    options: ["Shouting, crying, and throwing other toys", "Brainstorming creative solutions or asking an adult for help 💡", "Hiding it under your bed and ignoring it"],
    correctAnswer: "Brainstorming creative solutions or asking an adult for help 💡",
    explanation: "Awesome problem solver! Staying calm helps you find smart, creative answers! 💡"
  },
  {
    id: 244,
    subject: "life",
    question: "How can we practice plastic-free living and protect marine animals? ♻️",
    options: ["Using disposable plastic straws and cups", "Carrying a reusable cloth bag and steel water flask ♻️", "Buying new plastic toys daily"],
    correctAnswer: "Carrying a reusable cloth bag and steel water flask ♻️",
    explanation: "Eco champ! Carrying reusable steel bottles prevents plastic waste from entering oceans! ♻️"
  },
  {
    id: 245,
    subject: "life",
    question: "How does a daily time management plan help you get schoolwork and playtime done? ⏰",
    options: ["It leaves no time for play", "It schedules fixed slots for study, play, and sound sleep ⏰", "It makes you do everything at once"],
    correctAnswer: "It schedules fixed slots for study, play, and sound sleep ⏰",
    explanation: "Terrific organizing skill! Managing time means you have stress-free hours to learn and play! 📅"
  },
  {
    id: 246,
    subject: "life",
    question: "When you feel extremely angry or frustrated, what is the healthiest way to calm down? 😤",
    options: ["Bite your lips and hit the table", "Step back, take five deep breaths, and express it with calm words 🌬️", "Keep screaming until someone helps you"],
    correctAnswer: "Step back, take five deep breaths, and express it with calm words 🌬️",
    explanation: "Super self-control! Taking deep breaths triggers your brain's anchor of calm! 🧘‍♀️"
  },
  {
    id: 247,
    subject: "life",
    question: "Why is setting a personal learning goal, like reading one storybook a week, helpful? 🎯",
    options: ["Because it forces you to study without rest", "It gives you a clear target and makes you feel proud when achieved 🎯", "Because it is a competition against classmates"],
    correctAnswer: "It gives you a clear target and makes you feel proud when achieved 🎯",
    explanation: "Perfect! Setting milestones inspires you to make steady daily progress! 🏆"
  },
  {
    id: 248,
    subject: "life",
    question: "What does empathy mean when communicating with friends? 🤝",
    options: ["Telling them what they are doing wrong", "Understanding and feeling what your friend is going through 🤝", "Giving them your toys only"],
    correctAnswer: "Understanding and feeling what your friend is going through 🤝",
    explanation: "Beautiful! Empathy lets us connect deeply with friends and build trusted relationships! 💖"
  },
  {
    id: 249,
    subject: "life",
    question: "What are the benefits of practicing a 5-minute quiet mindfulness meditation daily? 🧘‍♀️",
    options: ["It makes you look cool to others", "It reduces mental chatter, relaxes muscles, and sharpens concentration 🧘‍♀️", "It makes you sleep instantly during daytime"],
    correctAnswer: "It reduces mental chatter, relaxes muscles, and sharpens concentration 🧘‍♀️",
    explanation: "Incredible wellness habit! Meditation calms your mind, leaving you fresh for discovery! 🌸"
  },
  {
    id: 250,
    subject: "life",
    question: "What is the beauty of our diverse culture in our school and neighborhood? 🤝",
    options: ["It causes everyone to talk the same way", "It brings a rich mosaic of food, languages, celebrations, and love 🤝", "It is only seen in history storybooks"],
    correctAnswer: "It brings a rich mosaic of food, languages, celebrations, and love 🤝",
    explanation: "Superb! Diversity is a beautiful bouquet of different flowers that makes the world gorgeous! 🌍🌸"
  }
];

// Helper to retrieve questions based on Volume level
export function getGraduationQuestions(volume: number): TestQuestion[] {
  if (volume === 2) {
    return GRADUATION_QUESTIONS_V2;
  }
  if (volume === 3) {
    return GRADUATION_QUESTIONS_V3;
  }
  return GRADUATION_QUESTIONS_V1;
}

// Keep backwards-compatibility for existing imports of GRADUATION_QUESTIONS
export const GRADUATION_QUESTIONS = GRADUATION_QUESTIONS_V1;
