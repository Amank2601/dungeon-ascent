// src/data/problems.js
// Each floor has up to 3 problems (variants).
// Problem 0 = original (from worlds.js)
// Problem 1 = similar but different values/context
// Problem 2 = slightly harder variant of same concept
//
// Structure: { [floorId]: [ variant1, variant2 ] }
// variant = { challenge, hint, testDisplay, validate, testCases, functionName }

export const FOLLOW_UPS = {

  // ── WORLD 1 ──────────────────────────────────────────────────────────────

  "w1f1": [
    {
      challenge: `Good try! Similar problem:\nPrint exactly: "I am a coder!"`,
      hint: "Same idea — use print() or console.log() with the exact text.",
      testDisplay: [`Output: I am a coder!`],
      functionName: null,
      testCases: [],
      validate: (code) => code.includes("I am a coder"),
    },
    {
      challenge: `One more try! Print exactly: "Coding is my superpower!"`,
      hint: "You know how to print now. Just change the text inside the quotes.",
      testDisplay: [`Output: Coding is my superpower!`],
      functionName: null,
      testCases: [],
      validate: (code) => code.includes("Coding is my superpower"),
    },
  ],

  "w1f2": [
    {
      challenge: `Similar problem:\nWrite a comment that says: "Programming is fun"\nThen print: "I love coding"`,
      hint: "Comment first (// or #), then print statement below it.",
      testDisplay: [`Must have a comment`, `Must print: I love coding`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const hasComment = code.includes("//") || code.includes("#") || code.includes("/*");
        return hasComment && code.includes("I love coding");
      },
    },
    {
      challenge: `Final try! Write TWO comments explaining what a variable is.\nThen print: "Variables store data"`,
      hint: "Two separate comment lines, then your print statement.",
      testDisplay: [`Must have 2 comments`, `Must print: Variables store data`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const lines = code.split("\n");
        const commentLines = lines.filter(l => l.trim().startsWith("//") || l.trim().startsWith("#"));
        return commentLines.length >= 2 && code.includes("Variables store data");
      },
    },
  ],

  "w1f3": [
    {
      challenge: `Similar problem — create these variables:\n  - heroName = "Dragon"\n  - power = 9000\n\nThen print both.`,
      hint: "Same pattern: create variable, assign value, print it.",
      testDisplay: [`Must create heroName = "Dragon"`, `Must create power = 9000`, `Must print both`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return (c.includes('"dragon"') || c.includes("'dragon'")) &&
               c.includes("9000") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Almost there! Create:\n  - city = "Tokyo"\n  - population = 14000000\n  - isCapital = true\n\nPrint all three.`,
      hint: "Three variables, three print statements.",
      testDisplay: [`city = "Tokyo"`, `population = 14000000`, `isCapital = true`, `Print all 3`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return (c.includes("tokyo")) && c.includes("14000000") && c.includes("true") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f4": [
    {
      challenge: `Similar problem — create one of each type:\n  - item = "Sword"     (String)\n  - damage = 50        (Integer)\n  - speed = 1.5        (Float)\n  - isEnchanted = false (Boolean)\n\nPrint all four.`,
      hint: "Same 4 types: String (quotes), Integer (whole), Float (decimal), Boolean (true/false).",
      testDisplay: [`item = "Sword" (string)`, `damage = 50 (int)`, `speed = 1.5 (float)`, `isEnchanted = false (bool)`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("sword") && c.includes("50") && c.includes("1.5") && c.includes("false") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Last chance! Create:\n  - language = "Python"   (String)\n  - version = 3           (Integer)\n  - rating = 9.8          (Float)\n  - isPopular = true      (Boolean)\n\nPrint all.`,
      hint: "You've done this twice. You know the pattern now!",
      testDisplay: [`"Python", 3, 9.8, true`, `Print all 4 variables`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("python") && c.includes("9.8") && c.includes("true") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f5": [
    {
      challenge: `Similar problem — create x = 15, y = 4\nCalculate and print:\n  - x + y\n  - x - y\n  - x * y\n  - x % y`,
      hint: "Same as before but with x=15, y=4. Remember % is remainder.",
      testDisplay: [`x=15, y=4`, `x+y = 19`, `x-y = 11`, `x*y = 60`, `x%y = 3`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("15") && c.includes("4") &&
               c.includes("+") && c.includes("-") && c.includes("*") && c.includes("%") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Final attempt! Create price = 250, discount = 30\nCalculate:\n  - finalPrice = price - discount\n  - tax = finalPrice * 0.18\n  - total = finalPrice + tax\n\nPrint all three results.`,
      hint: "Chain calculations: first finalPrice, then use finalPrice to get tax, then add them.",
      testDisplay: [`finalPrice = 250-30 = 220`, `tax = 220*0.18 = 39.6`, `total = 259.6`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("250") && c.includes("30") && c.includes("0.18") &&
               c.includes("-") && c.includes("*") && c.includes("+") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f6": [
    {
      challenge: `Similar: Create first = "Dark" and last = "Knight"\nJoin with a space and print: "Dark Knight"`,
      hint: 'JS: first + " " + last   Python: first + " " + last',
      testDisplay: [`Output: Dark Knight`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("dark") && c.includes("knight") &&
               (c.includes("+") || c.includes("f\"") || c.includes("`")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Final try! Create:\n  - greeting = "Hello"\n  - name = "Warrior"\n  - punctuation = "!"\n\nJoin all three and print: "Hello Warrior!"`,
      hint: 'JS: greeting + " " + name + punctuation',
      testDisplay: [`Output: Hello Warrior!`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("hello") && c.includes("warrior") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f7": [
    {
      challenge: `Similar problem: Create age = 16\n  - If age >= 18: print "You can vote!"\n  - Otherwise: print "Too young to vote."`,
      hint: "Same if/else pattern. Change the variable name, value, and messages.",
      testDisplay: [`age=16 → "Too young to vote."`, `age=20 → "You can vote!"`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("16") && c.includes("18") && c.includes("if") &&
               (c.includes("vote") || c.includes("young")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Last chance! Create speed = 120 (km/h)\n  - If speed > 100: print "Speeding! Slow down."\n  - If speed == 100: print "Exactly at limit."\n  - Otherwise: print "Safe speed."`,
      hint: "Three branches: if, else if, else.",
      testDisplay: [`speed=120 → "Speeding! Slow down."`, `speed=80 → "Safe speed."`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("120") && c.includes("100") && c.includes("if") &&
               (c.includes("speed") || c.includes("slow") || c.includes("safe")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f8": [
    {
      challenge: `Similar: Create humidity = 55\n  - Above 80: "Very Humid"\n  - 60-80: "Humid"\n  - 40-59: "Comfortable"\n  - Below 40: "Dry"`,
      hint: "Same elif/else if pattern but different ranges.",
      testDisplay: [`humidity=55 → "Comfortable"`, `humidity=85 → "Very Humid"`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("humidity") && (c.includes("elif") || c.includes("else if")) &&
               c.includes("80") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Final! Create bmi = 22.5\n  - Below 18.5: "Underweight"\n  - 18.5-24.9: "Normal"\n  - 25-29.9: "Overweight"\n  - 30+: "Obese"`,
      hint: "Check from top to bottom with elif/else if.",
      testDisplay: [`bmi=22.5 → "Normal"`, `bmi=17 → "Underweight"`, `bmi=31 → "Obese"`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("bmi") && (c.includes("elif") || c.includes("else if")) &&
               c.includes("18") && c.includes("25") &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f9": [
    {
      challenge: `Similar: Create a = 7, b = 7\nPrint:\n  - a == b\n  - a > b\n  - a >= b\n  - a != b`,
      hint: "Same comparison operators, different values.",
      testDisplay: [`a==b → true`, `a>b → false`, `a>=b → true`, `a!=b → false`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("7") && (c.includes("==") || c.includes(">=") || c.includes("!=")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Last try! Create x = 100\nCheck and print these:\n  - Is x exactly 100? (x == 100)\n  - Is x at least 50? (x >= 50)\n  - Is x less than 200? (x < 200)\n  - Is x not equal to 99? (x != 99)`,
      hint: "Just print each comparison directly.",
      testDisplay: [`x==100 → true`, `x>=50 → true`, `x<200 → true`, `x!=99 → true`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("100") && (c.includes("==") && c.includes(">=") && c.includes("<") && c.includes("!=")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  "w1f10": [
    {
      challenge: `Similar: Create temperature = 38, isSummer = true\n  - If temp > 35 AND isSummer: print "Beach day!"\n  - Otherwise: print "Stay home."`,
      hint: "JS: temperature > 35 && isSummer   Python: temperature > 35 and is_summer",
      testDisplay: [`temp=38, summer=true → "Beach day!"`, `temp=20 → "Stay home."`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes("temperature") && c.includes("summer") &&
               (c.includes("&&") || c.includes(" and ")) && c.includes("35") &&
               (c.includes("beach") || c.includes("home")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
    {
      challenge: `Final! Create isWeekend = true, hoursSlept = 6\n  - If isWeekend OR hoursSlept >= 8: print "Feel rested!"\n  - Otherwise: print "Need more sleep."`,
      hint: "JS: isWeekend || hoursSlept >= 8   Python: is_weekend or hours_slept >= 8",
      testDisplay: [`weekend=true → "Feel rested!"`, `weekend=false, sleep=5 → "Need more sleep."`],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return (c.includes("weekend") || c.includes("slept") || c.includes("sleep")) &&
               (c.includes("||") || c.includes(" or ")) &&
               (c.includes("rest") || c.includes("sleep")) &&
               (c.includes("print") || c.includes("console.log") || c.includes("cout") || c.includes("system.out"));
      },
    },
  ],

  // ── WORLD 2 FOLLOW-UPS ────────────────────────────────────────────────────

  "w2f2": [ // sumTo
    {
      challenge: `Similar: Write sumTo(n) that returns sum of 1 to n.\nThis time test with different values — make sure it handles n=1 and n=0 too.`,
      hint: "Same accumulator pattern. Loop from 1 to n, add to sum.",
      testDisplay: [`sumTo(1) → 1`, `sumTo(0) → 0`, `sumTo(20) → 210`],
      functionName: "sumTo",
      testCases: [
        { label: "sumTo(1)", input: 1, expected: 1 },
        { label: "sumTo(20)", input: 20, expected: 210 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return sumTo;`)(); return fn(1)===1 && fn(20)===210; } catch { return false; }
      },
    },
    {
      challenge: `Almost there! Similar function: sumOdds(n) — return sum of all ODD numbers from 1 to n.`,
      hint: "Check if i % 2 !== 0 (or i % 2 === 1) before adding.",
      testDisplay: [`sumOdds(5) → 9 (1+3+5)`, `sumOdds(10) → 25 (1+3+5+7+9)`],
      functionName: "sumOdds",
      testCases: [
        { label: "sumOdds(5)", input: 5, expected: 9 },
        { label: "sumOdds(10)", input: 10, expected: 25 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return sumOdds;`)(); return fn(5)===9 && fn(10)===25; } catch { return false; }
      },
    },
  ],

  "w2f3": [ // sumEvens
    {
      challenge: `Similar: countEvens(n) — return the COUNT (not sum) of even numbers from 1 to n.`,
      hint: "Check i % 2 === 0, then count++ instead of sum += i.",
      testDisplay: [`countEvens(10) → 5`, `countEvens(6) → 3`],
      functionName: "countEvens",
      testCases: [
        { label: "countEvens(10)", input: 10, expected: 5 },
        { label: "countEvens(6)", input: 6, expected: 3 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return countEvens;`)(); return fn(10)===5 && fn(6)===3; } catch { return false; }
      },
    },
    {
      challenge: `Final: sumDivisibleBy3(n) — sum all numbers from 1 to n divisible by 3.`,
      hint: "Check i % 3 === 0.",
      testDisplay: [`sumDivisibleBy3(9) → 18 (3+6+9)`, `sumDivisibleBy3(6) → 9`],
      functionName: "sumDivisibleBy3",
      testCases: [
        { label: "sumDivisibleBy3(9)", input: 9, expected: 18 },
        { label: "sumDivisibleBy3(6)", input: 6, expected: 9 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return sumDivisibleBy3;`)(); return fn(9)===18 && fn(6)===9; } catch { return false; }
      },
    },
  ],

  "w2f4": [ // multiTable
    {
      challenge: `Similar: multiTableFrom(n, start, end) — multiplication table of n from start to end.`,
      hint: "Same loop but use start and end instead of 1 and 10.",
      testDisplay: [`multiTableFrom(5, 1, 5) → [5,10,15,20,25]`],
      functionName: "multiTableFrom",
      testCases: [{ label: "5 table 1-5", input: [5, 1, 5], expected: [5,10,15,20,25] }],
      validate: (code) => {
        try { const fn = new Function(`${code}; return multiTableFrom;`)(); return JSON.stringify(fn(5,1,5))===JSON.stringify([5,10,15,20,25]); } catch { return false; }
      },
    },
    {
      challenge: `Final: squareNumbers(n) — return array of squares: [1, 4, 9, 16 ... up to n*n]`,
      hint: "Loop from 1 to n, push i*i each time.",
      testDisplay: [`squareNumbers(5) → [1, 4, 9, 16, 25]`],
      functionName: "squareNumbers",
      testCases: [{ label: "squareNumbers(5)", input: 5, expected: [1,4,9,16,25] }],
      validate: (code) => {
        try { const fn = new Function(`${code}; return squareNumbers;`)(); return JSON.stringify(fn(5))===JSON.stringify([1,4,9,16,25]); } catch { return false; }
      },
    },
  ],

  "w2f5": [ // countVowels
    {
      challenge: `Similar: countConsonants(str) — count consonants (letters that are NOT vowels).`,
      hint: "Loop through chars. If it's a letter AND not in 'aeiou', count it.",
      testDisplay: [`countConsonants("hello") → 3`, `countConsonants("aeiou") → 0`],
      functionName: "countConsonants",
      testCases: [
        { label: "hello", input: "hello", expected: 3 },
        { label: "aeiou", input: "aeiou", expected: 0 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return countConsonants;`)(); return fn("hello")===3 && fn("aeiou")===0; } catch { return false; }
      },
    },
    {
      challenge: `Final: hasVowel(str) — return true if string contains at least one vowel, else false.`,
      hint: "Loop through. If ANY char is a vowel, return true. After loop, return false.",
      testDisplay: [`hasVowel("hello") → true`, `hasVowel("rhythm") → false`],
      functionName: "hasVowel",
      testCases: [
        { label: "hello", input: "hello", expected: true },
        { label: "rhythm", input: "rhythm", expected: false },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return hasVowel;`)(); return fn("hello")===true && fn("rhythm")===false; } catch { return false; }
      },
    },
  ],

  // ── WORLD 3 FOLLOW-UPS ────────────────────────────────────────────────────

  "w3f1": [ // square
    {
      challenge: `Similar: cube(n) — return n * n * n.`,
      hint: "return n * n * n  or  return n ** 3",
      testDisplay: [`cube(3) → 27`, `cube(4) → 64`],
      functionName: "cube",
      testCases: [
        { label: "cube(3)", input: 3, expected: 27 },
        { label: "cube(4)", input: 4, expected: 64 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return cube;`)(); return fn(3)===27 && fn(4)===64; } catch { return false; }
      },
    },
    {
      challenge: `Final: power(base, exp) — return base raised to exp. Don't use Math.pow.`,
      hint: "Loop exp times, multiplying result by base each time.",
      testDisplay: [`power(2, 8) → 256`, `power(3, 3) → 27`],
      functionName: "power",
      testCases: [
        { label: "power(2,8)", input: [2, 8], expected: 256 },
        { label: "power(3,3)", input: [3, 3], expected: 27 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return power;`)(); return fn(2,8)===256 && fn(3,3)===27; } catch { return false; }
      },
    },
  ],

  "w3f3": [ // isPrime (w3f3 in worlds.js uses concept w3f4)
    {
      challenge: `Similar: isEven(n) — returns true if n is even, false if odd.`,
      hint: "return n % 2 === 0",
      testDisplay: [`isEven(4) → true`, `isEven(7) → false`, `isEven(0) → true`],
      functionName: "isEven",
      testCases: [
        { label: "isEven(4)", input: 4, expected: true },
        { label: "isEven(7)", input: 7, expected: false },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return isEven;`)(); return fn(4)===true && fn(7)===false; } catch { return false; }
      },
    },
    {
      challenge: `Final: countPrimes(n) — count how many primes exist from 2 to n (inclusive).`,
      hint: "Reuse your isPrime logic inside a loop. Count each prime found.",
      testDisplay: [`countPrimes(10) → 4 (2,3,5,7)`, `countPrimes(20) → 8`],
      functionName: "countPrimes",
      testCases: [
        { label: "countPrimes(10)", input: 10, expected: 4 },
        { label: "countPrimes(20)", input: 20, expected: 8 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return countPrimes;`)(); return fn(10)===4 && fn(20)===8; } catch { return false; }
      },
    },
  ],

  "w3f4": [ // isPalindrome
    {
      challenge: `Similar: reverseString(str) — return the string reversed.`,
      hint: "JS: str.split('').reverse().join('')  Python: str[::-1]",
      testDisplay: [`reverseString("hello") → "olleh"`, `reverseString("code") → "edoc"`],
      functionName: "reverseString",
      testCases: [
        { label: "hello", input: "hello", expected: "olleh" },
        { label: "code", input: "code", expected: "edoc" },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return reverseString;`)(); return fn("hello")==="olleh" && fn("code")==="edoc"; } catch { return false; }
      },
    },
    {
      challenge: `Final: longestWord(sentence) — return the longest word in a sentence.\nIf tie, return the first one.`,
      hint: "Split by space. Loop and track longest word found.",
      testDisplay: [`longestWord("I love programming") → "programming"`, `longestWord("cat dog") → "cat"`],
      functionName: "longestWord",
      testCases: [
        { label: "I love programming", input: "I love programming", expected: "programming" },
        { label: "cat dog", input: "cat dog", expected: "cat" },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return longestWord;`)(); return fn("I love programming")==="programming" && fn("cat dog")==="cat"; } catch { return false; }
      },
    },
  ],

  "w3f5": [ // fizzBuzz
    {
      challenge: `Similar: fizzbuzzRange(start, end) — return array of FizzBuzz results from start to end.`,
      hint: "Same divisibility rules, but loop from start to end and collect results.",
      testDisplay: [`fizzbuzzRange(1,5) → ["1","2","Fizz","4","Buzz"]`],
      functionName: "fizzbuzzRange",
      testCases: [{ label: "1 to 5", input: [1, 5], expected: ["1","2","Fizz","4","Buzz"] }],
      validate: (code) => {
        try { const fn = new Function(`${code}; return fizzbuzzRange;`)(); return JSON.stringify(fn(1,5))===JSON.stringify(["1","2","Fizz","4","Buzz"]); } catch { return false; }
      },
    },
    {
      challenge: `Final: customBuzz(n, a, b) — "Fizz" if divisible by a, "Buzz" by b, "FizzBuzz" if both, else n as string.`,
      hint: "Same logic but use a and b instead of hardcoded 3 and 5.",
      testDisplay: [`customBuzz(4, 2, 3) → "Buzz"`, `customBuzz(6, 2, 3) → "FizzBuzz"`],
      functionName: "customBuzz",
      testCases: [
        { label: "customBuzz(4,2,3)", input: [4, 2, 3], expected: "Buzz" },
        { label: "customBuzz(6,2,3)", input: [6, 2, 3], expected: "FizzBuzz" },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return customBuzz;`)(); return fn(4,2,3)==="Buzz" && fn(6,2,3)==="FizzBuzz"; } catch { return false; }
      },
    },
  ],

  // ── WORLD 4 FOLLOW-UPS ────────────────────────────────────────────────────

  "w4f2": [ // findLargest
    {
      challenge: `Similar: findSmallest(arr) — find the minimum value WITHOUT using Math.min.`,
      hint: "Start with smallest=arr[0], update if arr[i] < smallest.",
      testDisplay: [`findSmallest([3,1,9,2]) → 1`, `findSmallest([-5,-1,-10]) → -10`],
      functionName: "findSmallest",
      testCases: [
        { label: "[3,1,9,2]", input: [3,1,9,2], expected: 1 },
        { label: "[-5,-1,-10]", input: [-5,-1,-10], expected: -10 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return findSmallest;`)(); return fn([3,1,9,2])===1 && fn([-5,-1,-10])===-10; } catch { return false; }
      },
    },
    {
      challenge: `Final: secondLargest(arr) — find the second largest value.`,
      hint: "Sort the unique values descending, return index 1. Or track top two manually.",
      testDisplay: [`secondLargest([3,1,9,2,7]) → 7`, `secondLargest([5,5,3]) → 3`],
      functionName: "secondLargest",
      testCases: [
        { label: "[3,1,9,2,7]", input: [3,1,9,2,7], expected: 7 },
        { label: "[5,5,3]", input: [5,5,3], expected: 3 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return secondLargest;`)(); return fn([3,1,9,2,7])===7 && fn([5,5,3])===3; } catch { return false; }
      },
    },
  ],

  "w4f4": [ // frequency
    {
      challenge: `Similar: mostFrequent(arr) — return the most frequent element.`,
      hint: "Build frequency map first, then find key with highest count.",
      testDisplay: [`mostFrequent([1,2,2,3,3,3]) → 3`, `mostFrequent(["a","b","a"]) → "a"`],
      functionName: "mostFrequent",
      testCases: [
        { label: "[1,2,2,3,3,3]", input: [1,2,2,3,3,3], expected: 3 },
        { label: '["a","b","a"]', input: ["a","b","a"], expected: "a" },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return mostFrequent;`)(); return fn([1,2,2,3,3,3])===3 && fn(["a","b","a"])==="a"; } catch { return false; }
      },
    },
    {
      challenge: `Final: uniqueCount(arr) — return count of unique elements.`,
      hint: "Build a Set or frequency map. Return the number of unique keys.",
      testDisplay: [`uniqueCount([1,2,2,3]) → 3`, `uniqueCount([1,1,1]) → 1`],
      functionName: "uniqueCount",
      testCases: [
        { label: "[1,2,2,3]", input: [1,2,2,3], expected: 3 },
        { label: "[1,1,1]", input: [1,1,1], expected: 1 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return uniqueCount;`)(); return fn([1,2,2,3])===3 && fn([1,1,1])===1; } catch { return false; }
      },
    },
  ],

  // ── WORLD 5 FOLLOW-UPS ────────────────────────────────────────────────────

  "w5f1": [ // binarySearch
    {
      challenge: `Similar: binarySearchFirst(arr, target) — same but return -1 if not found, or the index. Make sure it handles duplicates (return any valid index).`,
      hint: "Same low/high/mid pattern.",
      testDisplay: [`binarySearchFirst([1,2,3,4,5], 3) → 2`, `binarySearchFirst([1,2,3], 9) → -1`],
      functionName: "binarySearchFirst",
      testCases: [
        { label: "find 3", input: [[1,2,3,4,5], 3], expected: 2 },
        { label: "not found", input: [[1,2,3], 9], expected: -1 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return binarySearchFirst;`)(); return fn([1,2,3,4,5],3)===2 && fn([1,2,3],9)===-1; } catch { return false; }
      },
    },
    {
      challenge: `Final: countInRange(sortedArr, low, high) — count elements between low and high (inclusive) using binary search approach.`,
      hint: "Find leftmost index >= low and rightmost index <= high. Difference + 1 is the count.",
      testDisplay: [`countInRange([1,3,5,7,9,11], 3, 9) → 4`],
      functionName: "countInRange",
      testCases: [{ label: "3 to 9", input: [[1,3,5,7,9,11], 3, 9], expected: 4 }],
      validate: (code) => {
        try { const fn = new Function(`${code}; return countInRange;`)(); return fn([1,3,5,7,9,11],3,9)===4; } catch { return false; }
      },
    },
  ],

  "w5f2": [ // bubbleSort
    {
      challenge: `Similar: sortDescending(arr) — sort array in DESCENDING order without .sort().`,
      hint: "Same bubble sort but swap when arr[j] < arr[j+1] instead of >.",
      testDisplay: [`sortDescending([3,1,4,2]) → [4,3,2,1]`],
      functionName: "sortDescending",
      testCases: [{ label: "[3,1,4,2]", input: [3,1,4,2], expected: [4,3,2,1] }],
      validate: (code) => {
        try {
          if (code.includes(".sort(")) return false;
          const fn = new Function(`${code}; return sortDescending;`)();
          return JSON.stringify(fn([3,1,4,2]))===JSON.stringify([4,3,2,1]);
        } catch { return false; }
      },
    },
    {
      challenge: `Final: selectionSort(arr) — implement selection sort (find min each pass and place it).`,
      hint: "Outer loop: find min from i to end. Swap it into position i.",
      testDisplay: [`selectionSort([64,25,12,22,11]) → [11,12,22,25,64]`],
      functionName: "selectionSort",
      testCases: [{ label: "selection", input: [64,25,12,22,11], expected: [11,12,22,25,64] }],
      validate: (code) => {
        try {
          if (code.includes(".sort(")) return false;
          const fn = new Function(`${code}; return selectionSort;`)();
          return JSON.stringify(fn([64,25,12,22,11]))===JSON.stringify([11,12,22,25,64]);
        } catch { return false; }
      },
    },
  ],

  "w5f3": [ // fibonacci
    {
      challenge: `Similar: tribonacci(n) — like fibonacci but each number is sum of the 3 before it.\n(0, 0, 1, 1, 2, 4, 7, 13...)`,
      hint: "Base: trib(0)=0, trib(1)=0, trib(2)=1. Recursive: trib(n-1)+trib(n-2)+trib(n-3)",
      testDisplay: [`tribonacci(4) → 2`, `tribonacci(6) → 7`],
      functionName: "tribonacci",
      testCases: [
        { label: "trib(4)", input: 4, expected: 2 },
        { label: "trib(6)", input: 6, expected: 7 },
      ],
      validate: (code) => {
        try { const fn = new Function(`${code}; return tribonacci;`)(); return fn(4)===2 && fn(6)===7; } catch { return false; }
      },
    },
    {
      challenge: `Final: fibSequence(n) — return array of first n fibonacci numbers.`,
      hint: "Build iteratively: start with [0,1], add prev two each step.",
      testDisplay: [`fibSequence(7) → [0,1,1,2,3,5,8]`],
      functionName: "fibSequence",
      testCases: [{ label: "first 7", input: 7, expected: [0,1,1,2,3,5,8] }],
      validate: (code) => {
        try { const fn = new Function(`${code}; return fibSequence;`)(); return JSON.stringify(fn(7))===JSON.stringify([0,1,1,2,3,5,8]); } catch { return false; }
      },
    },
  ],

  // ── WORLD 6 FOLLOW-UPS ────────────────────────────────────────────────────

  "w6f1": [ // safeDivide / error handling
    {
      challenge: `Similar: safeSquareRoot(n) — return Math.sqrt(n), but throw Error("Cannot sqrt negative") if n < 0.`,
      hint: "if (n < 0) throw new Error('Cannot sqrt negative')",
      testDisplay: [`safeSquareRoot(9) → 3`, `safeSquareRoot(-1) → throws Error`],
      functionName: "safeSquareRoot",
      testCases: [{ label: "sqrt(9)", input: 9, expected: 3 }],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return safeSquareRoot;`)();
          if (fn(9) !== 3) return false;
          try { fn(-1); return false; } catch (e) { return e.message.includes("negative"); }
        } catch { return false; }
      },
    },
    {
      challenge: `Final: parseAge(str) — parse string to integer. Throw Error("Invalid age") if result is NaN or negative.`,
      hint: "parseInt(str) then check isNaN() and < 0.",
      testDisplay: [`parseAge("25") → 25`, `parseAge("abc") → throws Error`, `parseAge("-5") → throws Error`],
      functionName: "parseAge",
      testCases: [{ label: "parseAge('25')", input: "25", expected: 25 }],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return parseAge;`)();
          if (fn("25") !== 25) return false;
          try { fn("abc"); return false; } catch { }
          try { fn("-5"); return false; } catch { }
          return true;
        } catch { return false; }
      },
    },
  ],

  "w6f2": [ // BankAccount
    {
      challenge: `Similar: Create a Counter class with:\n  - increment() adds 1\n  - decrement() subtracts 1 (min 0)\n  - getCount() returns current count\n  - reset() sets to 0`,
      hint: "constructor: this.count = 0. increment: this.count++. decrement: if > 0, this.count--.",
      testDisplay: [`increment() x3 → count: 3`, `decrement() → count: 2`, `reset() → count: 0`],
      functionName: "Counter",
      testCases: [],
      validate: (code) => {
        try {
          const Cls = new Function(`${code}; return Counter;`)();
          const c = new Cls();
          c.increment(); c.increment(); c.increment();
          if (c.getCount() !== 3) return false;
          c.decrement();
          if (c.getCount() !== 2) return false;
          c.reset();
          return c.getCount() === 0;
        } catch { return false; }
      },
    },
    {
      challenge: `Final: Create a Stack class with:\n  - push(item) — add to top\n  - pop() — remove and return top item (null if empty)\n  - peek() — return top without removing\n  - isEmpty() — return true/false`,
      hint: "Use an array internally. push=append, pop=remove last, peek=last item.",
      testDisplay: [`push(1),push(2),peek() → 2`, `pop() → 2`, `isEmpty() on empty → true`],
      functionName: "Stack",
      testCases: [],
      validate: (code) => {
        try {
          const Cls = new Function(`${code}; return Stack;`)();
          const s = new Cls();
          if (!s.isEmpty()) return false;
          s.push(1); s.push(2);
          if (s.peek() !== 2) return false;
          if (s.pop() !== 2) return false;
          if (s.pop() !== 1) return false;
          return s.isEmpty();
        } catch { return false; }
      },
    },
  ],
  // World 2 bridge floor
  w2f1b: [
    {
      challenge: "Without a function, loop from 1 to 20 and print only the ODD numbers.",
      hint: "Check if i % 2 !== 0 (or === 1) before printing.",
      testDisplay: ["Print: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19"],
      functionName: null,
      testCases: [],
      validate: (code) => {
        const c = code.toLowerCase();
        return (c.includes('for') || c.includes('while')) && c.includes('%') &&
               (c.includes('print') || c.includes('console.log'));
      },
    },
  ],

  // World 3 new floors
  w3f2b: [
    {
      challenge: `Write truncate(str, maxLen) that cuts a string to maxLen characters.
If the string is longer, add "..." at the end.

truncate("Hello World", 7) → "Hello W..."
truncate("Hi", 10) → "Hi"`,
      hint: "if str.length > maxLen: return str.slice(0, maxLen) + '...' else return str",
      testDisplay: [`truncate("Hello World", 7) → "Hello W..."`, `truncate("Hi", 10) → "Hi"`],
      functionName: "truncate",
      testCases: [
        { label: '"Hello World", 7', input: ["Hello World", 7], expected: "Hello W..." },
        { label: '"Hi", 10', input: ["Hi", 10], expected: "Hi" },
      ],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return truncate;`)();
          return fn("Hello World", 7) === "Hello W..." && fn("Hi", 10) === "Hi";
        } catch { return false; }
      },
    },
  ],

  w3f2c: [
    {
      challenge: `Write clamp(value, min = 0, max = 100) that clamps a value between min and max.

clamp(150)      → 100
clamp(-5)       → 0
clamp(50)       → 50
clamp(50, 0, 40) → 40`,
      hint: "if value < min return min. if value > max return max. else return value.",
      testDisplay: [`clamp(150) → 100`, `clamp(-5) → 0`, `clamp(50, 0, 40) → 40`],
      functionName: "clamp",
      testCases: [
        { label: "clamp(150)", input: 150, expected: 100 },
        { label: "clamp(-5)", input: -5, expected: 0 },
        { label: "clamp(50,0,40)", input: [50, 0, 40], expected: 40 },
      ],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return clamp;`)();
          return fn(150) === 100 && fn(-5) === 0 && fn(50, 0, 40) === 40;
        } catch { return false; }
      },
    },
  ],

  // World 4 new string floor
  w4f0: [
    {
      challenge: `Write isPangram(sentence) — returns true if the sentence contains every letter of the alphabet at least once (case-insensitive).

isPangram("The quick brown fox jumps over the lazy dog") → true
isPangram("Hello World") → false`,
      hint: "Lowercase the sentence, filter only letters, put them in a Set, check if Set size === 26.",
      testDisplay: [`"The quick brown fox..." → true`, `"Hello World" → false`],
      functionName: "isPangram",
      testCases: [
        { label: "pangram", input: "The quick brown fox jumps over the lazy dog", expected: true },
        { label: "not pangram", input: "Hello World", expected: false },
      ],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return isPangram;`)();
          return fn("The quick brown fox jumps over the lazy dog") === true &&
                 fn("Hello World") === false;
        } catch { return false; }
      },
    },
  ],

  // World 5 two-pointer floor
  w5f0: [
    {
      challenge: `Write hasPairWithSum(arr, target) — returns true if any two numbers in the SORTED array add up to target.

hasPairWithSum([1,2,4,6,10], 8) → true  (2+6)
hasPairWithSum([1,2,3,9], 8) → false`,
      hint: "Same two-pointer approach: l=0, r=end. Move pointers based on sum vs target.",
      testDisplay: [`hasPairWithSum([1,2,4,6,10], 8) → true`, `hasPairWithSum([1,2,3,9], 8) → false`],
      functionName: "hasPairWithSum",
      testCases: [
        { label: "[1,2,4,6,10], 8", input: [[1,2,4,6,10], 8], expected: true },
        { label: "[1,2,3,9], 8", input: [[1,2,3,9], 8], expected: false },
      ],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return hasPairWithSum;`)();
          return fn([1,2,4,6,10], 8) === true && fn([1,2,3,9], 8) === false;
        } catch { return false; }
      },
    },
  ],

  // World 6 async floor
  w6f1b: [
    {
      challenge: `Write fetchWithTimeout(promise, ms) — returns the promise result if it resolves within ms milliseconds. If it takes longer, return "Timeout!".

Use Promise.race() with a timeout promise.`,
      hint: "Promise.race([yourPromise, new Promise(resolve => setTimeout(() => resolve('Timeout!'), ms))])",
      testDisplay: [`Fast promise → resolves normally`, `Slow promise → "Timeout!"`],
      functionName: "fetchWithTimeout",
      testCases: [],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return fetchWithTimeout;`)();
          const fast = new Promise(r => setTimeout(() => r("done"), 10));
          const result = fn(fast, 1000);
          return result && typeof result.then === "function";
        } catch { return false; }
      },
    },
  ],

};