// src/data/worlds.js
// Complete game world structure - 6 worlds, 40+ floors, 6 Mastery Forges

export const WORLDS = [
  {
    id: "w1",
    number: 1,
    name: "The Awakening",
    subtitle: "Absolute Beginner",
    description: "You know nothing. The dungeon teaches all.",
    theme: { primary: "#22d3ee", bg: "#0a1a1f", accent: "#06b6d4" },
    emoji: "🌍",
    floors: [
      {
        id: "w1f1", floorNum: 1, title: "What is Programming?",
        type: "lesson",
        lesson: "Programming is giving instructions to a computer. Like a recipe — step by step. JavaScript is your spell book here.",
        challenge: "Write a comment explaining what programming means to you, then write `console.log('I am a programmer');`",
        hint: "Comments start with //. console.log() prints to screen.",
        starterCode: `// Write your comment here explaining programming\n// Then write the console.log below\n`,
        validate: (code) => code.includes("console.log") && code.includes("programmer"),
        testDisplay: [`Must include console.log(...)`, `Must include the word 'programmer'`],
      },
      {
        id: "w1f2", floorNum: 2, title: "Print Text",
        type: "code",
        lesson: "console.log() is how you speak to the world. Every programmer starts here.",
        challenge: "Write a function `greet(name)` that returns the string `'Hello, NAME!'` where NAME is the parameter.",
        hint: "Use string concatenation: 'Hello, ' + name + '!'  or template literals: `Hello, ${name}!`",
        starterCode: `function greet(name) {\n  // return 'Hello, NAME!'\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return greet;`)();
            return fn("World") === "Hello, World!" && fn("Coder") === "Hello, Coder!";
          } catch { return false; }
        },
        testDisplay: [`greet("World") → "Hello, World!"`, `greet("Coder") → "Hello, Coder!"`],
      },
      {
        id: "w1f3", floorNum: 3, title: "Variables",
        type: "code",
        lesson: "Variables store data. Think of them as labelled boxes. let, const, var are the keywords.",
        challenge: "Write a function `introduce(name, age)` that returns `'My name is NAME and I am AGE years old.'`",
        hint: "Use template literals: `My name is ${name} and I am ${age} years old.`",
        starterCode: `function introduce(name, age) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return introduce;`)();
            return fn("Alex", 20) === "My name is Alex and I am 20 years old." &&
                   fn("Sam", 25) === "My name is Sam and I am 25 years old.";
          } catch { return false; }
        },
        testDisplay: [`introduce("Alex", 20) → "My name is Alex and I am 20 years old."`, `introduce("Sam", 25) → "My name is Sam and I am 25 years old."`],
      },
      {
        id: "w1f4", floorNum: 4, title: "Basic Math",
        type: "code",
        lesson: "Computers are calculators at heart. +, -, *, /, % (modulo) are your tools.",
        challenge: "Write a function `calculator(a, op, b)` that returns the result of a op b. Support +, -, *, /.",
        hint: "Use if/else or switch to check what op is.",
        starterCode: `function calculator(a, op, b) {\n  // return a + b, a - b, a * b, or a / b based on op\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return calculator;`)();
            return fn(4, "+", 2) === 6 && fn(10, "-", 3) === 7 && fn(3, "*", 4) === 12 && fn(10, "/", 2) === 5;
          } catch { return false; }
        },
        testDisplay: [`calculator(4,"+",2) → 6`, `calculator(10,"-",3) → 7`, `calculator(3,"*",4) → 12`, `calculator(10,"/",2) → 5`],
      },
      {
        id: "w1f5", floorNum: 5, title: "Input & Output",
        type: "code",
        lesson: "Functions take input (parameters) and give output (return values). This is the heartbeat of programming.",
        challenge: "Write `celsiusToFahrenheit(c)` that converts Celsius to Fahrenheit. Formula: (c × 9/5) + 32",
        hint: "return (c * 9/5) + 32",
        starterCode: `function celsiusToFahrenheit(c) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return celsiusToFahrenheit;`)();
            return fn(0) === 32 && fn(100) === 212 && fn(37) === 98.6;
          } catch { return false; }
        },
        testDisplay: [`celsiusToFahrenheit(0) → 32`, `celsiusToFahrenheit(100) → 212`, `celsiusToFahrenheit(37) → 98.6`],
      },
      {
        id: "w1f6", floorNum: 6, title: "If-Else Basics",
        type: "code",
        lesson: "if/else lets your code make decisions. Like a fork in the road.",
        challenge: "Write `isAdult(age)` that returns `'Adult'` if age >= 18, otherwise `'Minor'`.",
        hint: "if (age >= 18) { return 'Adult'; } else { return 'Minor'; }",
        starterCode: `function isAdult(age) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isAdult;`)();
            return fn(18) === "Adult" && fn(17) === "Minor" && fn(25) === "Adult" && fn(0) === "Minor";
          } catch { return false; }
        },
        testDisplay: [`isAdult(18) → "Adult"`, `isAdult(17) → "Minor"`, `isAdult(25) → "Adult"`],
      },
      {
        id: "w1f7", floorNum: 7, title: "Comparisons",
        type: "code",
        lesson: ">, <, >=, <=, ===, !== are comparison operators. They return true or false.",
        challenge: "Write `grade(score)` that returns: 'A' (>=90), 'B' (>=80), 'C' (>=70), 'D' (>=60), 'F' (below 60).",
        hint: "Use if, else if, else chain — check from highest to lowest.",
        starterCode: `function grade(score) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return grade;`)();
            return fn(95) === "A" && fn(85) === "B" && fn(75) === "C" && fn(65) === "D" && fn(50) === "F";
          } catch { return false; }
        },
        testDisplay: [`grade(95) → "A"`, `grade(85) → "B"`, `grade(75) → "C"`, `grade(65) → "D"`, `grade(50) → "F"`],
      },
      {
        id: "w1f8", floorNum: 8, title: "Mini Logic Problems",
        type: "code",
        lesson: "Combine everything: variables, math, and conditions to solve real problems.",
        challenge: "Write `fizzBuzz(n)` — return 'Fizz' if divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else return n as string.",
        hint: "Check FizzBuzz first (both conditions), then Fizz, then Buzz.",
        starterCode: `function fizzBuzz(n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return fizzBuzz;`)();
            return fn(3) === "Fizz" && fn(5) === "Buzz" && fn(15) === "FizzBuzz" && fn(7) === "7";
          } catch { return false; }
        },
        testDisplay: [`fizzBuzz(3) → "Fizz"`, `fizzBuzz(5) → "Buzz"`, `fizzBuzz(15) → "FizzBuzz"`, `fizzBuzz(7) → "7"`],
      },
    ],
    boss: {
      id: "w1boss", type: "mastery",
      title: "Mastery Forge: Simple Calculator",
      bossName: "The Arithmetic Titan",
      bossEmoji: "🔥",
      description: "Build a complete calculator function that handles all 4 operations AND handles edge cases like division by zero.",
      challenge: `Write \`smartCalc(a, op, b)\` that:
- Supports +, -, *, /
- Returns "Error: Division by zero" if dividing by 0
- Returns "Error: Unknown operator" for invalid operators
- Returns the numeric result otherwise`,
      starterCode: `function smartCalc(a, op, b) {\n  // Build your complete calculator\n  // Handle all edge cases!\n}`,
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return smartCalc;`)();
          return fn(10, "+", 5) === 15 &&
                 fn(10, "-", 3) === 7 &&
                 fn(4, "*", 5) === 20 &&
                 fn(10, "/", 2) === 5 &&
                 fn(5, "/", 0) === "Error: Division by zero" &&
                 fn(5, "^", 2) === "Error: Unknown operator";
        } catch { return false; }
      },
      testDisplay: [
        `smartCalc(10,"+",5) → 15`,
        `smartCalc(4,"*",5) → 20`,
        `smartCalc(5,"/",0) → "Error: Division by zero"`,
        `smartCalc(5,"^",2) → "Error: Unknown operator"`,
      ],
    },
  },

  // ─── WORLD 2 ──────────────────────────────────────────────────────────────
  {
    id: "w2",
    number: 2,
    name: "The Loop Realm",
    subtitle: "Loops & Iteration",
    description: "Repetition is power. Master the loop, master the machine.",
    theme: { primary: "#a78bfa", bg: "#0f0a1f", accent: "#7c3aed" },
    emoji: "🌀",
    floors: [
      {
        id: "w2f1", floorNum: 1, title: "What is a Loop?",
        type: "code",
        lesson: "Loops repeat code. for, while, do-while. They save you from writing the same thing 100 times.",
        challenge: "Write `repeatString(str, n)` that returns str repeated n times.",
        hint: "Use a for loop and concatenate, or use str.repeat(n)",
        starterCode: `function repeatString(str, n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return repeatString;`)();
            return fn("ha", 3) === "hahaha" && fn("ab", 2) === "abab" && fn("x", 1) === "x";
          } catch { return false; }
        },
        testDisplay: [`repeatString("ha", 3) → "hahaha"`, `repeatString("ab", 2) → "abab"`],
      },
      {
        id: "w2f2", floorNum: 2, title: "Sum of Numbers",
        type: "code",
        lesson: "Accumulating values in a loop is one of the most common patterns in programming.",
        challenge: "Write `sumTo(n)` that returns the sum of all integers from 1 to n.",
        hint: "Start with sum = 0, loop from 1 to n, add each number.",
        starterCode: `function sumTo(n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return sumTo;`)();
            return fn(5) === 15 && fn(10) === 55 && fn(1) === 1 && fn(100) === 5050;
          } catch { return false; }
        },
        testDisplay: [`sumTo(5) → 15`, `sumTo(10) → 55`, `sumTo(100) → 5050`],
      },
      {
        id: "w2f3", floorNum: 3, title: "Even Numbers",
        type: "code",
        lesson: "Filtering inside loops: use if + modulo to pick specific numbers.",
        challenge: "Write `sumEvens(n)` that returns the sum of all even numbers from 1 to n.",
        hint: "Check if i % 2 === 0 before adding.",
        starterCode: `function sumEvens(n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return sumEvens;`)();
            return fn(10) === 30 && fn(5) === 6 && fn(2) === 2;
          } catch { return false; }
        },
        testDisplay: [`sumEvens(10) → 30`, `sumEvens(5) → 6`, `sumEvens(2) → 2`],
      },
      {
        id: "w2f4", floorNum: 4, title: "Multiplication Table",
        type: "code",
        lesson: "Loops can build collections. Push results into an array.",
        challenge: "Write `multiTable(n)` that returns an array of n's multiplication table from 1 to 10.",
        hint: "Create empty array, loop 1-10, push n*i each time.",
        starterCode: `function multiTable(n) {\n  // return [n*1, n*2, ..., n*10]\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return multiTable;`)();
            const r = fn(3);
            return JSON.stringify(r) === JSON.stringify([3,6,9,12,15,18,21,24,27,30]);
          } catch { return false; }
        },
        testDisplay: [`multiTable(3) → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]`],
      },
      {
        id: "w2f5", floorNum: 5, title: "Nested Loops",
        type: "code",
        lesson: "A loop inside a loop. Powerful for grids, tables, combinations.",
        challenge: "Write `multiplyMatrix(n)` that returns an n×n multiplication table as a 2D array.",
        hint: "Outer loop for rows (i), inner loop for columns (j). Push i*j.",
        starterCode: `function multiplyMatrix(n) {\n  // return 2D array where result[i][j] = (i+1)*(j+1)\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return multiplyMatrix;`)();
            const r = fn(3);
            return r[0][0] === 1 && r[0][2] === 3 && r[2][2] === 9 && r[1][1] === 4;
          } catch { return false; }
        },
        testDisplay: [`multiplyMatrix(3)[0] → [1,2,3]`, `multiplyMatrix(3)[2][2] → 9`],
      },
      {
        id: "w2f6", floorNum: 6, title: "Pattern Printing",
        type: "code",
        lesson: "Classic interview question. Nested loops + string building.",
        challenge: "Write `triangle(n)` that returns an array of n strings forming a right triangle of stars.\nRow 1: '*', Row 2: '**', Row 3: '***', etc.",
        hint: "For each row i (1 to n), create a string of i stars.",
        starterCode: `function triangle(n) {\n  // return array of strings like ['*', '**', '***']\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return triangle;`)();
            const r = fn(4);
            return r[0] === "*" && r[1] === "**" && r[2] === "***" && r[3] === "****";
          } catch { return false; }
        },
        testDisplay: [`triangle(4) → ["*", "**", "***", "****"]`],
      },
      {
        id: "w2f7", floorNum: 7, title: "Logical Loop Challenges",
        type: "code",
        lesson: "Combine loops with conditions for powerful logic.",
        challenge: "Write `countVowels(str)` that counts the number of vowels (a,e,i,o,u) in a string (case-insensitive).",
        hint: "Loop through each character, check if it's in 'aeiou'.",
        starterCode: `function countVowels(str) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return countVowels;`)();
            return fn("hello") === 2 && fn("AEIOU") === 5 && fn("rhythm") === 0 && fn("programming") === 3;
          } catch { return false; }
        },
        testDisplay: [`countVowels("hello") → 2`, `countVowels("AEIOU") → 5`, `countVowels("rhythm") → 0`],
      },
    ],
    boss: {
      id: "w2boss", type: "mastery",
      title: "Mastery Forge: Number Guessing Game",
      bossName: "The Loop Leviathan",
      bossEmoji: "🌀",
      description: "Build the logic engine of a number guessing game.",
      challenge: `Write \`guessGame(secret, guesses)\` where:
- secret is the hidden number (1-100)
- guesses is an array of guesses in order
- Return an array of hints: 'Too low', 'Too high', or 'Correct!'
- Stop processing after a correct guess`,
      starterCode: `function guessGame(secret, guesses) {\n  // Process each guess and return hints array\n}`,
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return guessGame;`)();
          const r1 = fn(50, [25, 75, 50]);
          const r2 = fn(30, [50, 20, 30]);
          return JSON.stringify(r1) === JSON.stringify(["Too low", "Too high", "Correct!"]) &&
                 JSON.stringify(r2) === JSON.stringify(["Too high", "Too low", "Correct!"]);
        } catch { return false; }
      },
      testDisplay: [
        `guessGame(50, [25,75,50]) → ["Too low","Too high","Correct!"]`,
        `guessGame(30, [50,20,30]) → ["Too high","Too low","Correct!"]`,
      ],
    },
  },

  // ─── WORLD 3 ──────────────────────────────────────────────────────────────
  {
    id: "w3",
    number: 3,
    name: "The Function Forge",
    subtitle: "Functions & Modularity",
    description: "Break problems apart. Conquer them piece by piece.",
    theme: { primary: "#f59e0b", bg: "#1a1200", accent: "#d97706" },
    emoji: "⚙️",
    floors: [
      {
        id: "w3f1", floorNum: 1, title: "What is a Function?",
        type: "code",
        lesson: "Functions are reusable blocks of code. Input → Process → Output. The building block of all software.",
        challenge: "Write `square(n)` and `cube(n)` — both return n raised to the respective power.",
        hint: "Use n*n for square, n*n*n for cube, or Math.pow(n, 2).",
        starterCode: `function square(n) {\n  // return n squared\n}\n\nfunction cube(n) {\n  // return n cubed\n}`,
        validate: (code) => {
          try {
            const sq = new Function(`${code}; return square;`)();
            const cu = new Function(`${code}; return cube;`)();
            return sq(4) === 16 && sq(3) === 9 && cu(3) === 27 && cu(2) === 8;
          } catch { return false; }
        },
        testDisplay: [`square(4) → 16`, `square(3) → 9`, `cube(3) → 27`, `cube(2) → 8`],
      },
      {
        id: "w3f2", floorNum: 2, title: "Return Values",
        type: "code",
        lesson: "A function without return is like a sentence without a period. Always return your result.",
        challenge: "Write `minMax(arr)` that returns an object `{min, max}` containing the minimum and maximum values.",
        hint: "Use Math.min(...arr) and Math.max(...arr), or loop manually.",
        starterCode: `function minMax(arr) {\n  // return {min: ..., max: ...}\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return minMax;`)();
            const r = fn([3, 1, 9, 2, 7]);
            return r.min === 1 && r.max === 9;
          } catch { return false; }
        },
        testDisplay: [`minMax([3,1,9,2,7]) → {min:1, max:9}`],
      },
      {
        id: "w3f3", floorNum: 3, title: "Parameters & Arguments",
        type: "code",
        lesson: "Parameters are the variables in function definition. Arguments are the values you pass in.",
        challenge: "Write `power(base, exponent = 2)` with a default exponent of 2. Returns base^exponent.",
        hint: "function power(base, exponent = 2) — default parameters use = in the definition.",
        starterCode: `function power(base, exponent = 2) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return power;`)();
            return fn(3) === 9 && fn(2, 10) === 1024 && fn(5, 3) === 125;
          } catch { return false; }
        },
        testDisplay: [`power(3) → 9 (default exponent=2)`, `power(2,10) → 1024`, `power(5,3) → 125`],
      },
      {
        id: "w3f4", floorNum: 4, title: "Prime Checker",
        type: "code",
        lesson: "A prime number is divisible only by 1 and itself. Classic algorithmic problem.",
        challenge: "Write `isPrime(n)` that returns true if n is a prime number, false otherwise.",
        hint: "Loop from 2 to √n. If n is divisible by any number in that range, it's not prime.",
        starterCode: `function isPrime(n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isPrime;`)();
            return fn(2) === true && fn(17) === true && fn(1) === false && fn(4) === false && fn(97) === true;
          } catch { return false; }
        },
        testDisplay: [`isPrime(2) → true`, `isPrime(17) → true`, `isPrime(1) → false`, `isPrime(4) → false`],
      },
      {
        id: "w3f5", floorNum: 5, title: "Palindrome Checker",
        type: "code",
        lesson: "A palindrome reads the same forwards and backwards. 'racecar', 'madam'.",
        challenge: "Write `isPalindrome(str)` that returns true if the string is a palindrome (ignore case, ignore spaces).",
        hint: "Clean the string (lowercase, remove spaces), then compare it to its reverse.",
        starterCode: `function isPalindrome(str) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isPalindrome;`)();
            return fn("racecar") === true && fn("hello") === false && fn("A man a plan a canal Panama") === true;
          } catch { return false; }
        },
        testDisplay: [`isPalindrome("racecar") → true`, `isPalindrome("hello") → false`, `isPalindrome("A man a plan a canal Panama") → true`],
      },
      {
        id: "w3f6", floorNum: 6, title: "Modular Thinking",
        type: "code",
        lesson: "Good code is modular — small functions that do one thing well, combined to solve bigger problems.",
        challenge: "Write `sumOfPrimes(n)` that returns the sum of all prime numbers up to and including n. Use a helper function `isPrime`.",
        hint: "Define isPrime first, then loop from 2 to n summing up primes.",
        starterCode: `function isPrime(n) {\n  // helper\n}\n\nfunction sumOfPrimes(n) {\n  // use isPrime here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return sumOfPrimes;`)();
            return fn(10) === 17 && fn(20) === 77 && fn(5) === 10;
          } catch { return false; }
        },
        testDisplay: [`sumOfPrimes(10) → 17 (2+3+5+7)`, `sumOfPrimes(20) → 77`, `sumOfPrimes(5) → 10`],
      },
    ],
    boss: {
      id: "w3boss", type: "mastery",
      title: "Mastery Forge: Menu-Driven Calculator",
      bossName: "The Function Overlord",
      bossEmoji: "⚙️",
      description: "Build a complete calculator with history tracking.",
      challenge: `Write a \`Calculator\` class (or use closures) with:
- \`calculate(a, op, b)\` — performs operation
- \`getHistory()\` — returns array of all calculations as strings like "3 + 4 = 7"
- \`clearHistory()\` — empties the history`,
      starterCode: `function createCalculator() {\n  let history = [];\n  \n  function calculate(a, op, b) {\n    // perform and record the calculation\n  }\n  \n  function getHistory() {\n    // return history array\n  }\n  \n  function clearHistory() {\n    // clear the history\n  }\n  \n  return { calculate, getHistory, clearHistory };\n}`,
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return createCalculator;`)();
          const calc = fn();
          calc.calculate(3, "+", 4);
          calc.calculate(10, "*", 2);
          const h = calc.getHistory();
          if (h[0] !== "3 + 4 = 7" || h[1] !== "10 * 2 = 20") return false;
          calc.clearHistory();
          return calc.getHistory().length === 0;
        } catch { return false; }
      },
      testDisplay: [
        `After calculate(3,"+",4): getHistory() → ["3 + 4 = 7"]`,
        `After calculate(10,"*",2): getHistory() → ["3 + 4 = 7", "10 * 2 = 20"]`,
        `After clearHistory(): getHistory() → []`,
      ],
    },
  },

  // ─── WORLD 4 ──────────────────────────────────────────────────────────────
  {
    id: "w4",
    number: 4,
    name: "The Memory Vault",
    subtitle: "Arrays & Strings",
    description: "Data lives in collections. Learn to store, search, and transform.",
    theme: { primary: "#34d399", bg: "#001a0f", accent: "#059669" },
    emoji: "📦",
    floors: [
      {
        id: "w4f1", floorNum: 1, title: "Array Basics",
        type: "code",
        lesson: "Arrays are ordered lists. Zero-indexed. Your most used data structure.",
        challenge: "Write `arrayInfo(arr)` returning `{length, first, last}` of the array.",
        hint: "arr.length, arr[0], arr[arr.length-1]",
        starterCode: `function arrayInfo(arr) {\n  // return {length, first, last}\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return arrayInfo;`)();
            const r = fn([10, 20, 30, 40, 50]);
            return r.length === 5 && r.first === 10 && r.last === 50;
          } catch { return false; }
        },
        testDisplay: [`arrayInfo([10,20,30,40,50]) → {length:5, first:10, last:50}`],
      },
      {
        id: "w4f2", floorNum: 2, title: "Loop Through Arrays",
        type: "code",
        lesson: "forEach, for...of, and classic for loops all let you visit each element.",
        challenge: "Write `doubleAll(arr)` that returns a new array with every element doubled.",
        hint: "Use arr.map(x => x * 2) or a for loop pushing x*2.",
        starterCode: `function doubleAll(arr) {\n  // return new array with each element doubled\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return doubleAll;`)();
            return JSON.stringify(fn([1,2,3])) === JSON.stringify([2,4,6]) &&
                   JSON.stringify(fn([5,10])) === JSON.stringify([10,20]);
          } catch { return false; }
        },
        testDisplay: [`doubleAll([1,2,3]) → [2,4,6]`, `doubleAll([5,10]) → [10,20]`],
      },
      {
        id: "w4f3", floorNum: 3, title: "Find Largest",
        type: "code",
        lesson: "Searching through an array is a fundamental algorithm skill.",
        challenge: "Write `findLargest(arr)` WITHOUT using Math.max — use a loop.",
        hint: "Start with largest = arr[0], loop and update if current > largest.",
        starterCode: `function findLargest(arr) {\n  // do NOT use Math.max\n}`,
        validate: (code) => {
          try {
            if (code.includes("Math.max")) return false;
            const fn = new Function(`${code}; return findLargest;`)();
            return fn([3,1,9,2,7]) === 9 && fn([100, 50, 200]) === 200 && fn([-1,-5,-2]) === -1;
          } catch { return false; }
        },
        testDisplay: [`findLargest([3,1,9,2,7]) → 9`, `findLargest([-1,-5,-2]) → -1`, `No Math.max allowed!`],
      },
      {
        id: "w4f4", floorNum: 4, title: "Second Largest",
        type: "code",
        lesson: "A twist on searching — track two values simultaneously.",
        challenge: "Write `secondLargest(arr)` that returns the second largest unique value.",
        hint: "Track both largest and second largest as you loop.",
        starterCode: `function secondLargest(arr) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return secondLargest;`)();
            return fn([3,1,9,2,7]) === 7 && fn([5,5,4,3]) === 4 && fn([10,20]) === 10;
          } catch { return false; }
        },
        testDisplay: [`secondLargest([3,1,9,2,7]) → 7`, `secondLargest([5,5,4,3]) → 4`, `secondLargest([10,20]) → 10`],
      },
      {
        id: "w4f5", floorNum: 5, title: "Remove Duplicates",
        type: "code",
        lesson: "Sets automatically remove duplicates. Or you can do it manually with loops.",
        challenge: "Write `removeDuplicates(arr)` that returns array with duplicates removed, preserving order.",
        hint: "Use [...new Set(arr)] or loop with a seen-tracker object.",
        starterCode: `function removeDuplicates(arr) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return removeDuplicates;`)();
            return JSON.stringify(fn([1,2,2,3,3,3])) === JSON.stringify([1,2,3]) &&
                   JSON.stringify(fn([5,5,5])) === JSON.stringify([5]);
          } catch { return false; }
        },
        testDisplay: [`removeDuplicates([1,2,2,3,3,3]) → [1,2,3]`, `removeDuplicates([5,5,5]) → [5]`],
      },
      {
        id: "w4f6", floorNum: 6, title: "Count Frequency",
        type: "code",
        lesson: "Objects as frequency maps — a hugely useful pattern.",
        challenge: "Write `frequency(arr)` that returns an object mapping each value to its count.",
        hint: "Start with empty object {}. For each item, obj[item] = (obj[item] || 0) + 1.",
        starterCode: `function frequency(arr) {\n  // return {value: count, ...}\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return frequency;`)();
            const r = fn(["a","b","a","c","b","a"]);
            return r.a === 3 && r.b === 2 && r.c === 1;
          } catch { return false; }
        },
        testDisplay: [`frequency(["a","b","a","c","b","a"]) → {a:3, b:2, c:1}`],
      },
      {
        id: "w4f7", floorNum: 7, title: "String Manipulation",
        type: "code",
        lesson: "Strings have powerful built-in methods: split, join, replace, slice, toUpperCase...",
        challenge: "Write `titleCase(str)` that capitalizes the first letter of every word.",
        hint: "Split by space, map each word to capitalize first char, join back.",
        starterCode: `function titleCase(str) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return titleCase;`)();
            return fn("hello world") === "Hello World" && fn("the quick brown fox") === "The Quick Brown Fox";
          } catch { return false; }
        },
        testDisplay: [`titleCase("hello world") → "Hello World"`, `titleCase("the quick brown fox") → "The Quick Brown Fox"`],
      },
      {
        id: "w4f8", floorNum: 8, title: "Anagram Checker",
        type: "code",
        lesson: "Anagrams are words with the same letters rearranged. Sorting solves this elegantly.",
        challenge: "Write `isAnagram(s1, s2)` — true if strings are anagrams (case-insensitive, ignore spaces).",
        hint: "Clean both strings, sort their characters, compare.",
        starterCode: `function isAnagram(s1, s2) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isAnagram;`)();
            return fn("listen","silent") === true && fn("hello","world") === false && fn("Astronomer","Moon starer") === true;
          } catch { return false; }
        },
        testDisplay: [`isAnagram("listen","silent") → true`, `isAnagram("hello","world") → false`, `isAnagram("Astronomer","Moon starer") → true`],
      },
    ],
    boss: {
      id: "w4boss", type: "mastery",
      title: "Mastery Forge: Contact Manager",
      bossName: "The Vault Keeper",
      bossEmoji: "📦",
      challenge: `Build a contact manager with:
- \`addContact(name, phone)\` — adds contact
- \`findContact(name)\` — returns contact object or null
- \`deleteContact(name)\` — removes contact, returns true/false
- \`listAll()\` — returns sorted array of all contact names`,
      starterCode: `function createContactManager() {\n  let contacts = [];\n\n  function addContact(name, phone) {\n    // add {name, phone}\n  }\n\n  function findContact(name) {\n    // return contact or null\n  }\n\n  function deleteContact(name) {\n    // remove and return true, or false if not found\n  }\n\n  function listAll() {\n    // return sorted array of names\n  }\n\n  return { addContact, findContact, deleteContact, listAll };\n}`,
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return createContactManager;`)();
          const cm = fn();
          cm.addContact("Alice", "111");
          cm.addContact("Charlie", "333");
          cm.addContact("Bob", "222");
          if (cm.findContact("Alice").phone !== "111") return false;
          if (cm.findContact("Zara") !== null) return false;
          const list = cm.listAll();
          if (JSON.stringify(list) !== JSON.stringify(["Alice","Bob","Charlie"])) return false;
          if (cm.deleteContact("Bob") !== true) return false;
          if (cm.deleteContact("Zara") !== false) return false;
          return cm.listAll().length === 2;
        } catch { return false; }
      },
      testDisplay: [
        `addContact("Alice","111") then findContact("Alice") → {name:"Alice",phone:"111"}`,
        `listAll() returns names sorted alphabetically`,
        `deleteContact("Bob") → true, deleteContact("Zara") → false`,
      ],
    },
  },

  // ─── WORLD 5 ──────────────────────────────────────────────────────────────
  {
    id: "w5",
    number: 5,
    name: "The Logic Arena",
    subtitle: "Intermediate Algorithms",
    description: "Real problems. Real thinking. This is where coders are made.",
    theme: { primary: "#f87171", bg: "#1a0505", accent: "#dc2626" },
    emoji: "⚔️",
    floors: [
      {
        id: "w5f1", floorNum: 1, title: "Dictionaries (Objects)",
        type: "code",
        lesson: "Objects are key-value stores — like a dictionary. Lookup by name, not by index.",
        challenge: "Write `groupByLength(words)` that groups words by their length into an object.",
        hint: "For each word, use its length as key, push word into the array at that key.",
        starterCode: `function groupByLength(words) {\n  // {3: ['cat','dog'], 5: ['crane'], ...}\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return groupByLength;`)();
            const r = fn(["cat","dog","crane","fish","elephant"]);
            return r[3].includes("cat") && r[3].includes("dog") && r[5].includes("crane") && r[8].includes("elephant");
          } catch { return false; }
        },
        testDisplay: [`groupByLength(["cat","dog","crane","fish","elephant"]) → {3:["cat","dog"], 4:["fish"], 5:["crane"], 8:["elephant"]}`],
      },
      {
        id: "w5f2", floorNum: 2, title: "Binary Search",
        type: "code",
        lesson: "Binary search cuts the search space in half each time. O(log n) — incredibly efficient.",
        challenge: "Write `binarySearch(sortedArr, target)` — returns index of target, or -1 if not found.",
        hint: "Use low, high, mid pointers. Compare mid value to target.",
        starterCode: `function binarySearch(sortedArr, target) {\n  // return index or -1\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return binarySearch;`)();
            return fn([1,3,5,7,9,11], 7) === 3 && fn([1,3,5,7,9], 10) === -1 && fn([2,4,6,8,10], 2) === 0;
          } catch { return false; }
        },
        testDisplay: [`binarySearch([1,3,5,7,9,11], 7) → 3`, `binarySearch([1,3,5,7,9], 10) → -1`, `binarySearch([2,4,6,8,10], 2) → 0`],
      },
      {
        id: "w5f3", floorNum: 3, title: "Bubble Sort",
        type: "code",
        lesson: "Sorting algorithms rearrange data. Bubble sort is the simplest — compare adjacent elements.",
        challenge: "Implement `bubbleSort(arr)` — return a sorted array (ascending) using bubble sort.",
        hint: "Nested loops. Compare arr[j] and arr[j+1], swap if out of order.",
        starterCode: `function bubbleSort(arr) {\n  // sort without using .sort()\n  let a = [...arr]; // don't mutate original\n}`,
        validate: (code) => {
          try {
            if (code.includes(".sort(")) return false;
            const fn = new Function(`${code}; return bubbleSort;`)();
            return JSON.stringify(fn([5,3,1,4,2])) === JSON.stringify([1,2,3,4,5]) &&
                   JSON.stringify(fn([9,1])) === JSON.stringify([1,9]);
          } catch { return false; }
        },
        testDisplay: [`bubbleSort([5,3,1,4,2]) → [1,2,3,4,5]`, `No .sort() allowed!`],
      },
      {
        id: "w5f4", floorNum: 4, title: "Recursion Basics",
        type: "code",
        lesson: "Recursion: a function that calls itself. Always needs a base case to stop.",
        challenge: "Write `fibonacci(n)` that returns the nth Fibonacci number recursively. (0,1,1,2,3,5,8...)",
        hint: "Base cases: fibonacci(0)=0, fibonacci(1)=1. Recursive: fibonacci(n-1)+fibonacci(n-2).",
        starterCode: `function fibonacci(n) {\n  // your code here\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return fibonacci;`)();
            return fn(0)===0 && fn(1)===1 && fn(6)===8 && fn(10)===55;
          } catch { return false; }
        },
        testDisplay: [`fibonacci(0) → 0`, `fibonacci(1) → 1`, `fibonacci(6) → 8`, `fibonacci(10) → 55`],
      },
      {
        id: "w5f5", floorNum: 5, title: "Flatten Nested Array",
        type: "code",
        lesson: "Recursion shines on nested structures. Flatten any depth.",
        challenge: "Write `flatten(arr)` that flattens a deeply nested array to one level.",
        hint: "Check if each item is an array. If yes, recurse. If no, push it.",
        starterCode: `function flatten(arr) {\n  // flatten [1,[2,[3,[4]]],5] → [1,2,3,4,5]\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return flatten;`)();
            return JSON.stringify(fn([1,[2,[3,[4]]],5])) === JSON.stringify([1,2,3,4,5]) &&
                   JSON.stringify(fn([[1,2],[3,4]])) === JSON.stringify([1,2,3,4]);
          } catch { return false; }
        },
        testDisplay: [`flatten([1,[2,[3,[4]]],5]) → [1,2,3,4,5]`, `flatten([[1,2],[3,4]]) → [1,2,3,4]`],
      },
    ],
    boss: {
      id: "w5boss", type: "mastery",
      title: "Mastery Forge: Quiz System",
      bossName: "The Logic Warlord",
      bossEmoji: "⚔️",
      challenge: `Build a quiz engine:
- \`createQuiz(questions)\` — takes array of {question, answer} objects
- \`submitAnswer(index, answer)\` — returns 'Correct!' or 'Wrong!'
- \`getScore()\` — returns "X/Y" format
- \`isComplete()\` — returns true when all questions answered`,
      starterCode: `function createQuiz(questions) {\n  let answers = new Array(questions.length).fill(null);\n\n  function submitAnswer(index, answer) {\n    // record and return 'Correct!' or 'Wrong!'\n  }\n\n  function getScore() {\n    // return "X/Y"\n  }\n\n  function isComplete() {\n    // return true if all answered\n  }\n\n  return { submitAnswer, getScore, isComplete };\n}`,
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return createQuiz;`)();
          const quiz = fn([{question:"2+2",answer:"4"},{question:"Sky color",answer:"blue"}]);
          if (quiz.submitAnswer(0,"4") !== "Correct!") return false;
          if (quiz.submitAnswer(1,"red") !== "Wrong!") return false;
          if (quiz.getScore() !== "1/2") return false;
          if (quiz.isComplete() !== true) return false;
          return true;
        } catch { return false; }
      },
      testDisplay: [
        `submitAnswer(0,"4") → "Correct!"`,
        `submitAnswer(1,"red") → "Wrong!"`,
        `getScore() → "1/2"`,
        `isComplete() → true`,
      ],
    },
  },

  // ─── WORLD 6 ──────────────────────────────────────────────────────────────
  {
    id: "w6",
    number: 6,
    name: "The Architect Layer",
    subtitle: "Advanced Concepts",
    description: "You've come so far. Now think like a system builder.",
    theme: { primary: "#e879f9", bg: "#1a001a", accent: "#a21caf" },
    emoji: "🏛️",
    floors: [
      {
        id: "w6f1", floorNum: 1, title: "Error Handling",
        type: "code",
        lesson: "Real code fails. try/catch handles errors gracefully. Always handle your edge cases.",
        challenge: "Write `safeDivide(a, b)` — returns a/b, but throws `Error('Cannot divide by zero')` if b is 0.",
        hint: "if (b === 0) throw new Error('Cannot divide by zero');",
        starterCode: `function safeDivide(a, b) {\n  // throw error if b is 0\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return safeDivide;`)();
            if (fn(10, 2) !== 5) return false;
            try { fn(5, 0); return false; }
            catch(e) { return e.message === "Cannot divide by zero"; }
          } catch { return false; }
        },
        testDisplay: [`safeDivide(10, 2) → 5`, `safeDivide(5, 0) → throws Error("Cannot divide by zero")`],
      },
      {
        id: "w6f2", floorNum: 2, title: "Higher Order Functions",
        type: "code",
        lesson: "map, filter, reduce — the holy trinity of functional programming.",
        challenge: "Write `pipeline(arr, ...fns)` that applies each function in sequence to the array.",
        hint: "Use reduce to apply each function: fns.reduce((acc, fn) => fn(acc), arr)",
        starterCode: `function pipeline(arr, ...fns) {\n  // apply fns in sequence to arr\n}`,
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return pipeline;`)();
            const double = a => a.map(x => x*2);
            const filterEvens = a => a.filter(x => x%2===0);
            const result = fn([1,2,3,4,5], double, filterEvens);
            return JSON.stringify(result) === JSON.stringify([2,4,6,8,10]);
          } catch { return false; }
        },
        testDisplay: [`pipeline([1,2,3,4,5], double, filterEvens) → [2,4,6,8,10]`],
      },
      {
        id: "w6f3", floorNum: 3, title: "OOP Basics",
        type: "code",
        lesson: "Classes are blueprints for objects. They bundle data and behavior together.",
        challenge: "Create a `BankAccount` class with `deposit(amount)`, `withdraw(amount)`, and `getBalance()`. Withdrawals can't go below 0.",
        hint: "constructor sets balance=0. withdraw: if amount > balance, don't deduct.",
        starterCode: `class BankAccount {\n  constructor() {\n    // initialize balance\n  }\n  deposit(amount) {}\n  withdraw(amount) {}\n  getBalance() {}\n}`,
        validate: (code) => {
          try {
            const Cls = new Function(`${code}; return BankAccount;`)();
            const acc = new Cls();
            acc.deposit(100);
            acc.withdraw(30);
            if (acc.getBalance() !== 70) return false;
            acc.withdraw(200); // should not go below 0
            return acc.getBalance() === 70;
          } catch { return false; }
        },
        testDisplay: [`deposit(100), withdraw(30) → balance: 70`, `withdraw(200) when balance is 70 → balance stays 70`],
      },
      {
        id: "w6f4", floorNum: 4, title: "Inheritance",
        type: "code",
        lesson: "Inheritance lets a class extend another, inheriting its properties and methods.",
        challenge: "Create a `SavingsAccount` that extends `BankAccount` and adds `addInterest(rate)` which multiplies balance by (1 + rate/100).",
        hint: "class SavingsAccount extends BankAccount. addInterest sets balance *= (1 + rate/100).",
        starterCode: `class BankAccount {\n  constructor() { this.balance = 0; }\n  deposit(amount) { this.balance += amount; }\n  withdraw(amount) { if (amount <= this.balance) this.balance -= amount; }\n  getBalance() { return this.balance; }\n}\n\nclass SavingsAccount extends BankAccount {\n  addInterest(rate) {\n    // multiply balance by (1 + rate/100)\n  }\n}`,
        validate: (code) => {
          try {
            const Cls = new Function(`${code}; return SavingsAccount;`)();
            const acc = new Cls();
            acc.deposit(1000);
            acc.addInterest(10); // 10% interest
            return acc.getBalance() === 1100;
          } catch { return false; }
        },
        testDisplay: [`deposit(1000), addInterest(10) → balance: 1100`],
      },
      {
        id: "w6f5", floorNum: 5, title: "System Design Thinking",
        type: "code",
        lesson: "Design patterns solve recurring problems elegantly. The Observer pattern notifies listeners of changes.",
        challenge: "Implement a simple `EventEmitter` with `on(event, callback)`, `emit(event, data)`, and `off(event, callback)`.",
        hint: "Store listeners in an object as arrays. emit calls all listeners for that event.",
        starterCode: `class EventEmitter {\n  constructor() {\n    this.listeners = {};\n  }\n  on(event, callback) {\n    // register callback for event\n  }\n  emit(event, data) {\n    // call all callbacks for event with data\n  }\n  off(event, callback) {\n    // remove specific callback\n  }\n}`,
        validate: (code) => {
          try {
            const Cls = new Function(`${code}; return EventEmitter;`)();
            const emitter = new Cls();
            let log = [];
            const cb = (d) => log.push(d);
            emitter.on("test", cb);
            emitter.emit("test", "hello");
            emitter.emit("test", "world");
            if (log.join(",") !== "hello,world") return false;
            emitter.off("test", cb);
            emitter.emit("test", "ignored");
            return log.length === 2;
          } catch { return false; }
        },
        testDisplay: [
          `on("test",cb), emit("test","hello") → cb called with "hello"`,
          `off("test",cb), emit("test","x") → cb NOT called`,
        ],
      },
    ],
    boss: {
      id: "w6boss", type: "mastery",
      title: "🏆 FINAL Mastery Forge: Mini Inventory System",
      bossName: "The Architect Supreme",
      bossEmoji: "🏛️",
      challenge: `Build a complete inventory system:
- \`addItem(name, quantity, price)\`
- \`removeItem(name)\` → returns true/false
- \`updateQuantity(name, qty)\`
- \`getTotalValue()\` → sum of quantity*price for all items
- \`getLowStock(threshold)\` → array of item names below threshold`,
      starterCode: `class Inventory {\n  constructor() {\n    this.items = {};\n  }\n  addItem(name, quantity, price) {}\n  removeItem(name) {}\n  updateQuantity(name, qty) {}\n  getTotalValue() {}\n  getLowStock(threshold) {}\n}`,
      validate: (code) => {
        try {
          const Cls = new Function(`${code}; return Inventory;`)();
          const inv = new Cls();
          inv.addItem("sword", 5, 100);
          inv.addItem("shield", 2, 150);
          inv.addItem("potion", 20, 10);
          if (inv.getTotalValue() !== 1000) return false; // 500+300+200
          const low = inv.getLowStock(5);
          if (!low.includes("shield")) return false;
          inv.updateQuantity("sword", 10);
          if (inv.removeItem("potion") !== true) return false;
          if (inv.removeItem("dragon") !== false) return false;
          return inv.getTotalValue() === 1300; // 1000+300
        } catch { return false; }
      },
      testDisplay: [
        `addItem("sword",5,100), addItem("shield",2,150), addItem("potion",20,10)`,
        `getTotalValue() → 1000`,
        `getLowStock(5) includes "shield"`,
        `removeItem("potion") → true, removeItem("dragon") → false`,
      ],
    },
  },
];

export const TOTAL_FLOORS = WORLDS.reduce((sum, w) => sum + w.floors.length + 1, 0); // +1 for boss
