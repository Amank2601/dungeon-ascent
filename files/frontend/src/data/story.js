// src/data/story.js
// Story narrative, monsters, and betrayal lore

export const STORY_INTRO = [
  {
    text: "Year 2157. The Code Arena — a digital dungeon built by the world's greatest engineers.",
    delay: 0,
  },
  {
    text: "You were part of the Elite Six — the most powerful coding team ever assembled.",
    delay: 2500,
  },
  {
    text: "Together, you descended to Floor -100 to retrieve the Forbidden Algorithm.",
    delay: 5000,
  },
  {
    text: "But greed corrupts even the best.",
    delay: 7500,
  },
  {
    text: "While you slept, they took it. And then... they pushed you deeper.",
    delay: 9500,
  },
  {
    text: "You wake in The Abyss — Floor Zero. No weapons. No team. No memory of your skills.",
    delay: 12000,
  },
  {
    text: "Only one thing remains: your mind. And the dungeon will teach you everything you need.",
    delay: 14500,
  },
  {
    text: "Defeat the monsters. Reclaim your power. Find your betrayers.",
    delay: 17000,
  },
  {
    text: "⚔️  BEGIN YOUR ASCENT.",
    delay: 19500,
    highlight: true,
  },
];

export const BETRAYER_REVEALS = {
  w1: {
    name: "KIRA — The Syntax Witch",
    message:
      "Ha! You reached here? Kira was behind sealing your memory. She whispers: 'You'll never reach me, amateur.'",
    emoji: "🧙‍♀️",
  },
  w2: {
    name: "REX — The Loop Runner",
    message:
      "Rex left a trap in this world. A note reads: 'Loops are pointless — just like your survival.'",
    emoji: "🏃",
  },
  w3: {
    name: "NOVA — The Function Thief",
    message:
      "Nova stole your function knowledge. She laughs from the shadows: 'No function can save you now.'",
    emoji: "💫",
  },
  w4: {
    name: "BYTE — The Memory Devourer",
    message:
      "Byte consumed your data structures. His echo: 'Your memory is mine. Your arrays are empty.'",
    emoji: "🧠",
  },
  w5: {
    name: "CIPHER — The Algorithm Lord",
    message:
      "Cipher encoded your logic centers. His taunt: 'Algorithms are beyond you, broken hero.'",
    emoji: "🔐",
  },
  w6: {
    name: "VOID — The Architect of Betrayal",
    message:
      "The final betrayer. VOID — the one who planned it all. 'You've come far... but it ends HERE.'",
    emoji: "👁️",
  },
};

export const MONSTERS = {
  // WORLD 1 monsters
  w1: [
    { name: "Syntax Slime", emoji: "🟢", hp: 3, maxHp: 3, dialogue: ["...grrr... print... broken...", "Syntax error is my weapon!", "You'll never compile again!"], reward: "Syntax Scroll" },
    { name: "Variable Goblin", emoji: "👺", hp: 3, maxHp: 3, dialogue: ["Me steal your variables!", "undefined! undefined!", "Where did my value go?!"], reward: "Variable Tome" },
    { name: "Null Pointer", emoji: "❓", hp: 3, maxHp: 3, dialogue: ["I point to nothing...", "Your value is NULL!", "Cannot read property of undefined!"], reward: "Reference Crystal" },
    { name: "Conditional Crab", emoji: "🦀", hp: 4, maxHp: 4, dialogue: ["If you pass... ELSE you die!", "My pincers are if-else chains!", "You failed my condition check!"], reward: "Logic Gem" },
    { name: "Comparison Cobra", emoji: "🐍", hp: 4, maxHp: 4, dialogue: ["=== or ==? You don't know!", "Strict equality is my venom!", "Type coercion will end you!"], reward: "Truth Stone" },
    { name: "Loop Worm", emoji: "🪱", hp: 4, maxHp: 4, dialogue: ["Infinite loop... infinite pain...", "I loop forever. Can you stop me?", "Off by one! Off by one!"], reward: "Iteration Badge" },
    { name: "Math Phantom", emoji: "👻", hp: 4, maxHp: 4, dialogue: ["NaN! NaN! NaN!", "Your math overflows!", "Floating point is my curse!"], reward: "Number Rune" },
    { name: "The Bug Beast", emoji: "🐛", hp: 5, maxHp: 5, dialogue: ["I AM every error you ever made!", "Segmentation fault... in your SOUL!", "console.error: YOU LOSE"], reward: "Debug Amulet" },
  ],
  w1boss: { name: "The Arithmetic Titan", emoji: "🔥", hp: 8, maxHp: 8, isBoss: true, dialogue: ["I am born of every miscalculation!", "Division by zero is my birthright!", "Prove you can handle ALL operations!"], reward: "Calculator Crown" },

  // WORLD 2 monsters
  w2: [
    { name: "Infinite Looper", emoji: "♾️", hp: 4, maxHp: 4, dialogue: ["while(true) { destroy(you); }", "I never break! Can you?", "No exit condition found!"], reward: "Break Key" },
    { name: "Off-By-One Ogre", emoji: "👹", hp: 4, maxHp: 4, dialogue: ["i=0 or i=1?! WRONG EITHER WAY!", "Your fence posts are wrong!", "Array index out of bounds — ALWAYS!"], reward: "Index Amulet" },
    { name: "Nested Nightmare", emoji: "🌀", hp: 5, maxHp: 5, dialogue: ["Loop in loop in loop in loop...", "O(n²)! O(n³)! Infinite complexity!", "Your nested loop becomes my web!"], reward: "Complexity Badge" },
    { name: "Pattern Phantom", emoji: "🔮", hp: 5, maxHp: 5, dialogue: ["Print the pattern! PRINT IT!", "*\n**\n***\n... or face me!", "Your stars misalign!"], reward: "Star Fragment" },
    { name: "Iterator Imp", emoji: "😈", hp: 5, maxHp: 5, dialogue: ["forEach? map? reduce? WRONG!", "I swallow your iterators!", "Functional programming is dead!"], reward: "Iterator Ring" },
    { name: "Accumulator Specter", emoji: "👁️", hp: 5, maxHp: 5, dialogue: ["Sum = 0. Forever.", "Your accumulator... is mine!", "Add nothing. Gain nothing."], reward: "Sum Crystal" },
    { name: "Modulo Minotaur", emoji: "🐂", hp: 6, maxHp: 6, dialogue: ["% % % % %", "Divisibility is my labyrinth!", "Odd or even? You always get it wrong!"], reward: "Modulo Blade" },
  ],
  w2boss: { name: "The Loop Leviathan", emoji: "🌀", hp: 10, maxHp: 10, isBoss: true, dialogue: ["I am every loop that never ended!", "I've been running since the first computer!", "Your logic cannot contain me!"], reward: "Leviathan Core" },

  // WORLD 3 monsters
  w3: [
    { name: "Scope Shadow", emoji: "🕶️", hp: 5, maxHp: 5, dialogue: ["Out of scope! OUT OF SCOPE!", "var? let? const? Doesn't matter, you're scoped out!", "Closure? More like PRISON!"], reward: "Scope Lens" },
    { name: "Return Reaper", emoji: "💀", hp: 5, maxHp: 5, dialogue: ["You forgot to return!", "undefined is your fate!", "What does your function even return?!"], reward: "Return Stone" },
    { name: "Recursion Revenant", emoji: "🔄", hp: 6, maxHp: 6, dialogue: ["Maximum call stack exceeded — ALWAYS!", "Recurse... forever...", "Your base case is a lie!"], reward: "Stack Fragment" },
    { name: "Parameter Poltergeist", emoji: "👻", hp: 5, maxHp: 5, dialogue: ["Wrong arguments! TypeError!", "Too many params! Too few params!", "Your function signature is doomed!"], reward: "Argument Gem" },
    { name: "Higher Order Hydra", emoji: "🐉", hp: 6, maxHp: 6, dialogue: ["Functions returning functions... CHAOS!", "Callbacks in callbacks in callbacks!", "Your higher order mind is weak!"], reward: "Hydra Scale" },
    { name: "Prime Predator", emoji: "🦁", hp: 7, maxHp: 7, dialogue: ["Is 1 prime? IS IT?!", "Your prime checker has bugs!", "I am divisible by nothing but myself!"], reward: "Prime Crystal" },
  ],
  w3boss: { name: "The Function Overlord", emoji: "⚙️", hp: 12, maxHp: 12, isBoss: true, dialogue: ["I AM the function that calls itself into infinity!", "Your modular thinking... is SHATTERED!", "No function can contain the Overlord!"], reward: "Overlord Gear" },

  // WORLD 4
  w4: [
    { name: "Array Abolisher", emoji: "📛", hp: 5, maxHp: 5, dialogue: ["Arrays are weakness!", "Index -1 is my address!", "Your list is now empty!"], reward: "Array Shield" },
    { name: "Duplicate Demon", emoji: "👯", hp: 6, maxHp: 6, dialogue: ["I duplicate! I multiply!", "Can you find which one is real?!", "Duplicates everywhere... Set is useless!"], reward: "Unique Ring" },
    { name: "Sort Specter", emoji: "🔀", hp: 6, maxHp: 6, dialogue: ["Unsorted! Chaotic! BEAUTIFUL!", "Your O(n log n) is my prison!", "Bubble sort forever... FOREVER!"], reward: "Sort Blade" },
    { name: "String Strangler", emoji: "🪢", hp: 6, maxHp: 6, dialogue: ["Your strings are tangled!", "Immutability? I don't care!", "Split? Join? WRONG ANSWER!"], reward: "String Amulet" },
    { name: "Frequency Fiend", emoji: "📊", hp: 7, maxHp: 7, dialogue: ["Count me if you can!", "My frequency is... undefined!", "Hash map? I eat hash maps!"], reward: "Frequency Gem" },
    { name: "Anagram Assassin", emoji: "🔤", hp: 7, maxHp: 7, dialogue: ["listen = silent? PROVE IT!", "My letters rearrange to spell DOOM!", "Sort and compare... if you dare!"], reward: "Anagram Key" },
    { name: "Slice Serpent", emoji: "🐍", hp: 7, maxHp: 7, dialogue: ["slice(0, -1)... or was it -2?", "Your subarray is my nest!", "splice vs slice — which kills you?"], reward: "Slice Fang" },
  ],
  w4boss: { name: "The Vault Keeper", emoji: "📦", hp: 14, maxHp: 14, isBoss: true, dialogue: ["I guard ALL the data structures!", "Your contact list is MINE!", "The Memory Vault shall never open!"], reward: "Vault Key" },

  // WORLD 5
  w5: [
    { name: "Binary Beast", emoji: "🔢", hp: 7, maxHp: 7, dialogue: ["O(log n) or O(n)? Wrong either way!", "Binary search me... you can't!", "Left or right? YOU ALWAYS PICK WRONG!"], reward: "Binary Eye" },
    { name: "Complexity Crawler", emoji: "🕷️", hp: 7, maxHp: 7, dialogue: ["O(n!)... that's my complexity!", "Time complexity is your enemy!", "Big O notation... Big O PAIN!"], reward: "Complexity Badge" },
    { name: "Recursion Titan", emoji: "🗿", hp: 8, maxHp: 8, dialogue: ["Fibonacci... it never ends!", "Stack overflow is my aura!", "Your recursion tree... BURNS!"], reward: "Recursion Staff" },
    { name: "Sort Sorcerer", emoji: "🧙", hp: 8, maxHp: 8, dialogue: ["Bubble? Merge? Quick? ALL FAIL!", "My array is permanently unsorted!", "O(n²) is your destiny!"], reward: "Sort Grimoire" },
    { name: "Dictionary Devil", emoji: "📚", hp: 8, maxHp: 8, dialogue: ["KeyError! KeyError!", "Your keys have no values!", "Hash collision is my superpower!"], reward: "Dict Tome" },
  ],
  w5boss: { name: "The Logic Warlord", emoji: "⚔️", hp: 15, maxHp: 15, isBoss: true, dialogue: ["I am every unsolved algorithm!", "Big O infinity — that's me!", "The Logic Arena bows to NO ONE!"], reward: "Warlord Sword" },

  // WORLD 6
  w6: [
    { name: "Exception Entity", emoji: "💥", hp: 8, maxHp: 8, dialogue: ["Unhandled exception — ALWAYS!", "Try? Catch? You'll catch nothing!", "Throw... your last hope... away!"], reward: "Try Crystal" },
    { name: "Closure Creep", emoji: "🔒", hp: 8, maxHp: 8, dialogue: ["Your closure leaked memory!", "I live in your outer scope!", "Garbage collected... your SOUL!"], reward: "Closure Key" },
    { name: "Inheritance Imp", emoji: "👑", hp: 9, maxHp: 9, dialogue: ["extends? extends NOTHING!", "Your parent class... is DEAD!", "super() is useless against me!"], reward: "Crown Shard" },
    { name: "Prototype Phantom", emoji: "🧬", hp: 9, maxHp: 9, dialogue: ["prototype chain... SEVERED!", "Object.create(CHAOS)", "Your inheritance is broken!"], reward: "Proto Stone" },
    { name: "Observer Overlord", emoji: "👁️‍🗨️", hp: 10, maxHp: 10, dialogue: ["I observe everything!", "Your events go unheard!", "emit() into the void!"], reward: "Observer Eye" },
  ],
  w6boss: {
    name: "VOID — The Architect of Betrayal",
    emoji: "👁️",
    hp: 20,
    maxHp: 20,
    isBoss: true,
    isFinalBoss: true,
    dialogue: [
      "So. You made it.",
      "I am VOID. I orchestrated everything.",
      "I pushed you into the abyss. I took the Forbidden Algorithm.",
      "But you... you learned. You grew. You defeated my entire army.",
      "Now face me. Your FINAL test.",
    ],
    reward: "The Forbidden Algorithm",
  },
};
