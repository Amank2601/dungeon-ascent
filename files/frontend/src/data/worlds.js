// src/data/worlds.js
// World 1 — Absolute Basics (NO functions, NO parameters, pure concepts)
// World 2+ — Progressive difficulty

export const WORLDS = [

  // ══════════════════════════════════════════════════════════════════
  // WORLD 1 — THE AWAKENING
  // Target: Someone who has NEVER coded before
  // Topics: print, comments, variables, data types, math, input,
  //         if/else, comparison, logical operators, mini problems
  // NO functions. NO parameters. NO return values. Just basics.
  // ══════════════════════════════════════════════════════════════════
  {
    id: "w1",
    number: 1,
    name: "The Awakening",
    subtitle: "Absolute Beginner — Zero to First Code",
    description: "You remember nothing. The dungeon will teach you from scratch.",
    theme: { primary: "#22d3ee", bg: "#0a1a1f", accent: "#06b6d4" },
    emoji: "🌍",
    floors: [

      // Floor 1 — What is programming / print
      {
        id: "w1f1",
        floorNum: 1,
        title: "Your First Line of Code",
        concept: "w1f1",
        type: "lesson",
        lesson: `Programming is giving step-by-step instructions to a computer.
Every program starts with output — making the computer say something.

JavaScript:  console.log("Hello")
Python:      print("Hello")
Java:        System.out.println("Hello");
C++:         cout << "Hello";`,
        challenge: `Print exactly: Hello, World!

JavaScript: console.log("Hello, World!")
Python:     print("Hello, World!")
Java:       System.out.println("Hello, World!");
C++:        cout << "Hello, World!";`,
        hint: "Copy the exact syntax for your chosen language. Every character matters!",
        starterCode: `// Type your print statement below:\n`,
        starterCodes: {
          javascript: `// Print Hello, World!\nconsole.log("Hello, World!")`,
          python: `# Print Hello, World!\nprint("Hello, World!")`,
          java: `System.out.println("Hello, World!");`,
          cpp: `cout << "Hello, World!";`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [`Output must contain: Hello, World!`],
        validate: (code) => {
          return code.includes("Hello, World") ||
                 code.includes('Hello, World!');
        },
      },

      // Floor 2 — Comments
      {
        id: "w1f2",
        floorNum: 2,
        title: "Comments — Notes for Humans",
        concept: "w1f2",
        type: "lesson",
        lesson: `Comments are notes in your code that the computer ignores.
They explain what the code does — for you and other programmers.

JavaScript / Java / C++:   // This is a comment
Python:                    # This is a comment
Multi-line (JS/Java/C++):  /* This spans
                              multiple lines */`,
        challenge: `Write a comment that says: "I am learning to code"
Then print: "Comments are invisible to computers"`,
        hint: "A comment starts with // in JS, # in Python. Then write your print statement.",
        starterCode: `// Write your comment here\n// Then print below\n`,
        starterCodes: {
          javascript: `// I am learning to code\nconsole.log("Comments are invisible to computers")`,
          python: `# I am learning to code\nprint("Comments are invisible to computers")`,
          java: `// I am learning to code\nSystem.out.println("Comments are invisible to computers");`,
          cpp: `// I am learning to code\ncout << "Comments are invisible to computers";`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `Must have a comment (// or #)`,
          `Must print: "Comments are invisible to computers"`,
        ],
        validate: (code) => {
          const hasComment = code.includes("//") || code.includes("#") || code.includes("/*");
          const hasPrint = code.includes("Comments are invisible");
          return hasComment && hasPrint;
        },
      },

      // Floor 3 — Variables (storing data)
      {
        id: "w1f3",
        floorNum: 3,
        title: "Variables — Boxes That Store Data",
        concept: "w1f3",
        type: "lesson",
        lesson: `A variable is like a labelled box that stores a value.
You give it a name and put data inside.

JavaScript:   let name = "Alex";
              let age = 20;
Python:       name = "Alex"
              age = 20
Java:         String name = "Alex";
              int age = 20;
C++:          string name = "Alex";
              int age = 20;

Then print the variable:
  JS:      console.log(name)       → Alex
  Python:  print(name)             → Alex`,
        challenge: `Create two variables:
  - name = "Warrior"
  - level = 1

Then print both on separate lines.`,
        hint: `JS: let name = "Warrior"; let level = 1;
Python: name = "Warrior" then level = 1`,
        starterCode: `// Create variables name and level\n// Then print them\n`,
        starterCodes: {
          javascript: `let name = "Warrior";\nlet level = 1;\nconsole.log(name);\nconsole.log(level);`,
          python: `name = "Warrior"\nlevel = 1\nprint(name)\nprint(level)`,
          java: `String name = "Warrior";\nint level = 1;\nSystem.out.println(name);\nSystem.out.println(level);`,
          cpp: `string name = "Warrior";\nint level = 1;\ncout << name << endl;\ncout << level << endl;`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `Must create variable named: name`,
          `Must create variable named: level`,
          `Must print both values`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          const hasName = c.includes('name') && (c.includes('"warrior"') || c.includes("'warrior'"));
          const hasLevel = c.includes('level') && c.includes('1');
          const hasPrint = c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out');
          return hasName && hasLevel && hasPrint;
        },
      },

      // Floor 4 — Data Types
      {
        id: "w1f4",
        floorNum: 4,
        title: "Data Types — What Kind of Data?",
        concept: "w1f4",
        type: "lesson",
        lesson: `Data comes in different types:

  String  → Text in quotes       "Hello", "42"
  Integer → Whole numbers        42, -5, 0
  Float   → Decimal numbers      3.14, 2.5
  Boolean → True or False        true, false (JS/Java/C++)
                                 True, False (Python)

JavaScript:  typeof "hi"    → "string"
             typeof 42      → "number"
             typeof true    → "boolean"`,
        challenge: `Create one variable of each type:
  - playerName = "Hero"      (String)
  - score = 100              (Integer)  
  - health = 99.5            (Float)
  - isAlive = true           (Boolean)

Print all four.`,
        hint: `Strings use quotes. Numbers don't. Booleans are true/false (JS) or True/False (Python).`,
        starterCode: `// Create 4 variables of different types\n// Then print them all\n`,
        starterCodes: {
          javascript: `let playerName = "Hero";\nlet score = 100;\nlet health = 99.5;\nlet isAlive = true;\nconsole.log(playerName);\nconsole.log(score);\nconsole.log(health);\nconsole.log(isAlive);`,
          python: `player_name = "Hero"\nscore = 100\nhealth = 99.5\nis_alive = True\nprint(player_name)\nprint(score)\nprint(health)\nprint(is_alive)`,
          java: `String playerName = "Hero";\nint score = 100;\ndouble health = 99.5;\nboolean isAlive = true;\nSystem.out.println(playerName);\nSystem.out.println(score);\nSystem.out.println(health);\nSystem.out.println(isAlive);`,
          cpp: `string playerName = "Hero";\nint score = 100;\ndouble health = 99.5;\nbool isAlive = true;\ncout << playerName << endl;\ncout << score << endl;\ncout << health << endl;\ncout << isAlive << endl;`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `Must have a String variable`,
          `Must have an Integer variable`,
          `Must have a Float/Double variable`,
          `Must have a Boolean variable`,
          `Must print all four`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          const hasString  = c.includes('"hero"') || c.includes("'hero'");
          const hasInt     = c.includes('100');
          const hasFloat   = c.includes('99.5');
          const hasBool    = c.includes('true');
          const hasPrint   = c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out');
          return hasString && hasInt && hasFloat && hasBool && hasPrint;
        },
      },

      // Floor 5 — Basic Math operators
      {
        id: "w1f5",
        floorNum: 5,
        title: "Basic Math — Let the Computer Calculate",
        concept: "w1f5",
        type: "lesson",
        lesson: `Computers are calculators. Math operators:

  +   Addition          10 + 3 = 13
  -   Subtraction       10 - 3 = 7
  *   Multiplication    10 * 3 = 30
  /   Division          10 / 4 = 2.5
  %   Modulo (remainder) 10 % 3 = 1
  **  Power (JS/Python)  2 ** 3 = 8

JavaScript:   let result = 10 + 5;   console.log(result);
Python:       result = 10 + 5        print(result)`,
        challenge: `Create two variables: a = 20, b = 6
Then calculate and print:
  - sum = a + b
  - difference = a - b
  - product = a * b
  - quotient = a / b
  - remainder = a % b`,
        hint: `Create a and b first. Then do each operation and store in a new variable. Print each result.`,
        starterCode: `// Create a = 20 and b = 6\n// Then calculate sum, difference, product, quotient, remainder\n`,
        starterCodes: {
          javascript: `let a = 20;\nlet b = 6;\nlet sum = a + b;\nlet difference = a - b;\nlet product = a * b;\nlet quotient = a / b;\nlet remainder = a % b;\nconsole.log(sum);\nconsole.log(difference);\nconsole.log(product);\nconsole.log(quotient);\nconsole.log(remainder);`,
          python: `a = 20\nb = 6\nsum = a + b\ndifference = a - b\nproduct = a * b\nquotient = a / b\nremainder = a % b\nprint(sum)\nprint(difference)\nprint(product)\nprint(quotient)\nprint(remainder)`,
          java: `int a = 20;\nint b = 6;\nint sum = a + b;\nint difference = a - b;\nint product = a * b;\ndouble quotient = (double)a / b;\nint remainder = a % b;\nSystem.out.println(sum);\nSystem.out.println(difference);\nSystem.out.println(product);\nSystem.out.println(quotient);\nSystem.out.println(remainder);`,
          cpp: `int a = 20;\nint b = 6;\nint sum = a + b;\nint difference = a - b;\nint product = a * b;\ndouble quotient = (double)a / b;\nint remainder = a % b;\ncout << sum << endl;\ncout << difference << endl;\ncout << product << endl;\ncout << quotient << endl;\ncout << remainder << endl;`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `a = 20, b = 6`,
          `sum = 26`,
          `difference = 14`,
          `product = 120`,
          `remainder = 2`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('20') && c.includes('6') &&
                 c.includes('+') && c.includes('-') &&
                 c.includes('*') && c.includes('%') &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 6 — String concatenation
      {
        id: "w1f6",
        floorNum: 6,
        title: "String Joining — Combine Text",
        concept: "w1f6",
        type: "lesson",
        lesson: `You can join strings together — called concatenation.

JavaScript:
  let first = "Hello";
  let second = "World";
  console.log(first + " " + second);   → Hello World
  // Or use template literals (backticks):
  console.log(\`\${first} \${second}\`);  → Hello World

Python:
  first = "Hello"
  second = "World"
  print(first + " " + second)          → Hello World
  print(f"{first} {second}")           → Hello World`,
        challenge: `Create variables:
  - firstName = "Code"
  - lastName = "Warrior"

Join them with a space and print: "Code Warrior"`,
        hint: `JS: console.log(firstName + " " + lastName)
Python: print(firstName + " " + lastName)  or  print(f"{firstName} {lastName}")`,
        starterCode: `// Create firstName and lastName variables\n// Join and print them\n`,
        starterCodes: {
          javascript: `let firstName = "Code";\nlet lastName = "Warrior";\nconsole.log(firstName + " " + lastName);`,
          python: `first_name = "Code"\nlast_name = "Warrior"\nprint(first_name + " " + last_name)`,
          java: `String firstName = "Code";\nString lastName = "Warrior";\nSystem.out.println(firstName + " " + lastName);`,
          cpp: `string firstName = "Code";\nstring lastName = "Warrior";\ncout << firstName + " " + lastName;`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [`Output: Code Warrior`],
        validate: (code) => {
          const c = code.toLowerCase();
          return (c.includes('code') && c.includes('warrior')) &&
                 (c.includes('+') || c.includes('f"') || c.includes('f\'') || c.includes('`')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 7 — If / Else
      {
        id: "w1f7",
        floorNum: 7,
        title: "If / Else — Making Decisions",
        concept: "w1f7",
        type: "lesson",
        lesson: `if/else lets your code make decisions based on conditions.

JavaScript / Java / C++:
  let hp = 30;
  if (hp > 50) {
    console.log("Healthy");
  } else {
    console.log("Low HP!");
  }

Python:
  hp = 30
  if hp > 50:
      print("Healthy")
  else:
      print("Low HP!")`,
        challenge: `Create a variable: score = 75
  - If score is 60 or more: print "You passed!"
  - Otherwise: print "You failed!"`,
        hint: `if (score >= 60) in JS/Java/C++
if score >= 60: in Python`,
        starterCode: `// Create score = 75\n// Check if score >= 60 and print result\n`,
        starterCodes: {
          javascript: `let score = 75;\nif (score >= 60) {\n  console.log("You passed!");\n} else {\n  console.log("You failed!");\n}`,
          python: `score = 75\nif score >= 60:\n    print("You passed!")\nelse:\n    print("You failed!")`,
          java: `int score = 75;\nif (score >= 60) {\n    System.out.println("You passed!");\n} else {\n    System.out.println("You failed!");\n}`,
          cpp: `int score = 75;\nif (score >= 60) {\n    cout << "You passed!" << endl;\n} else {\n    cout << "You failed!" << endl;\n}`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `score = 75 → print "You passed!"`,
          `score < 60 → print "You failed!"`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('75') &&
                 c.includes('60') &&
                 (c.includes('if') || c.includes('else')) &&
                 (c.includes('passed') || c.includes('failed')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 8 — Else if / elif
      {
        id: "w1f8",
        floorNum: 8,
        title: "Else-If — Multiple Conditions",
        concept: "w1f8",
        type: "lesson",
        lesson: `When you have MORE than two options, use else-if (or elif in Python).

JavaScript / Java / C++:
  if (score >= 90) {
    console.log("A");
  } else if (score >= 80) {
    console.log("B");
  } else if (score >= 70) {
    console.log("C");
  } else {
    console.log("F");
  }

Python:
  if score >= 90:
      print("A")
  elif score >= 80:
      print("B")
  elif score >= 70:
      print("C")
  else:
      print("F")`,
        challenge: `Create variable: temperature = 35
  - Above 40: print "Danger! Too hot!"
  - 30 to 40:  print "Hot day"
  - 20 to 29:  print "Nice weather"  
  - Below 20:  print "Cold day"`,
        hint: `Check from highest to lowest. Use >= for each range. Python uses elif, JS/Java use else if.`,
        starterCode: `// Create temperature = 35\n// Check temperature ranges and print result\n`,
        starterCodes: {
          javascript: `let temperature = 35;\nif (temperature > 40) {\n  console.log("Danger! Too hot!");\n} else if (temperature >= 30) {\n  console.log("Hot day");\n} else if (temperature >= 20) {\n  console.log("Nice weather");\n} else {\n  console.log("Cold day");\n}`,
          python: `temperature = 35\nif temperature > 40:\n    print("Danger! Too hot!")\nelif temperature >= 30:\n    print("Hot day")\nelif temperature >= 20:\n    print("Nice weather")\nelse:\n    print("Cold day")`,
          java: `int temperature = 35;\nif (temperature > 40) {\n    System.out.println("Danger! Too hot!");\n} else if (temperature >= 30) {\n    System.out.println("Hot day");\n} else if (temperature >= 20) {\n    System.out.println("Nice weather");\n} else {\n    System.out.println("Cold day");\n}`,
          cpp: `int temperature = 35;\nif (temperature > 40) {\n    cout << "Danger! Too hot!" << endl;\n} else if (temperature >= 30) {\n    cout << "Hot day" << endl;\n} else if (temperature >= 20) {\n    cout << "Nice weather" << endl;\n} else {\n    cout << "Cold day" << endl;\n}`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `temperature = 35 → "Hot day"`,
          `temperature = 45 → "Danger! Too hot!"`,
          `temperature = 25 → "Nice weather"`,
          `temperature = 10 → "Cold day"`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('temperature') &&
                 (c.includes('elif') || c.includes('else if')) &&
                 c.includes('40') && c.includes('30') && c.includes('20') &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 9 — Comparison operators
      {
        id: "w1f9",
        floorNum: 9,
        title: "Comparisons — True or False?",
        concept: "w1f9",
        type: "lesson",
        lesson: `Comparison operators return true or false:

  >    Greater than          10 > 5   → true
  <    Less than             10 < 5   → false
  >=   Greater or equal      5 >= 5   → true
  <=   Less or equal         4 <= 5   → true
  ==   Equal to              5 == 5   → true
  !=   Not equal to          5 != 3   → true

JavaScript also has:
  ===  Strictly equal (type + value)   5 === "5" → false
  !==  Strictly not equal`,
        challenge: `Create variables: x = 10, y = 20
Print the result of these comparisons:
  - Is x greater than y?       (x > y)
  - Is x equal to 10?          (x == 10)
  - Is y not equal to 20?      (y != 20)
  - Is x less than or equal y? (x <= y)`,
        hint: `Just print each comparison directly: console.log(x > y) or print(x > y)`,
        starterCode: `// Create x = 10 and y = 20\n// Print the 4 comparisons\n`,
        starterCodes: {
          javascript: `let x = 10;\nlet y = 20;\nconsole.log(x > y);\nconsole.log(x == 10);\nconsole.log(y != 20);\nconsole.log(x <= y);`,
          python: `x = 10\ny = 20\nprint(x > y)\nprint(x == 10)\nprint(y != 20)\nprint(x <= y)`,
          java: `int x = 10;\nint y = 20;\nSystem.out.println(x > y);\nSystem.out.println(x == 10);\nSystem.out.println(y != 20);\nSystem.out.println(x <= y);`,
          cpp: `int x = 10;\nint y = 20;\ncout << (x > y) << endl;\ncout << (x == 10) << endl;\ncout << (y != 20) << endl;\ncout << (x <= y) << endl;`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `x > y  → false`,
          `x == 10 → true`,
          `y != 20 → false`,
          `x <= y → true`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('x') && c.includes('y') &&
                 c.includes('10') && c.includes('20') &&
                 (c.includes('>') || c.includes('<') || c.includes('==') || c.includes('!=')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 10 — Logical operators
      {
        id: "w1f10",
        floorNum: 10,
        title: "Logical Operators — AND, OR, NOT",
        concept: "w1f10",
        type: "lesson",
        lesson: `Combine multiple conditions with logical operators:

  AND  → Both must be true
    JS/Java/C++:  &&      Python: and
    (age > 18) && (hasId == true)

  OR   → At least one must be true
    JS/Java/C++:  ||      Python: or
    (isAdmin) || (isOwner)

  NOT  → Flips true to false
    JS/Java/C++:  !       Python: not
    !(isLoggedIn)`,
        challenge: `Create variables: age = 20, hasTicket = true
  - If age >= 18 AND hasTicket is true: print "Welcome to the arena!"
  - If age < 18 OR hasTicket is false: print "Access denied!"`,
        hint: `JS: if (age >= 18 && hasTicket)
Python: if age >= 18 and has_ticket:`,
        starterCode: `// Create age = 20 and hasTicket = true\n// Check both conditions\n`,
        starterCodes: {
          javascript: `let age = 20;\nlet hasTicket = true;\nif (age >= 18 && hasTicket) {\n  console.log("Welcome to the arena!");\n} else {\n  console.log("Access denied!");\n}`,
          python: `age = 20\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print("Welcome to the arena!")\nelse:\n    print("Access denied!")`,
          java: `int age = 20;\nboolean hasTicket = true;\nif (age >= 18 && hasTicket) {\n    System.out.println("Welcome to the arena!");\n} else {\n    System.out.println("Access denied!");\n}`,
          cpp: `int age = 20;\nbool hasTicket = true;\nif (age >= 18 && hasTicket) {\n    cout << "Welcome to the arena!" << endl;\n} else {\n    cout << "Access denied!" << endl;\n}`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `age=20, hasTicket=true → "Welcome to the arena!"`,
          `age=16 or hasTicket=false → "Access denied!"`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('age') && c.includes('ticket') &&
                 (c.includes('&&') || c.includes(' and ') || c.includes('||') || c.includes(' or ')) &&
                 (c.includes('welcome') || c.includes('denied')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },

      // Floor 11 — Mini challenge combining all W1 knowledge
      {
        id: "w1f11",
        floorNum: 11,
        title: "The Dungeon Entry Check",
        concept: "w1f11",
        type: "lesson",
        lesson: `Time to combine EVERYTHING you've learned:
  - Variables (store data)
  - Data types (string, number, boolean)
  - Math operators
  - String joining
  - If/else conditions
  - Comparison and logical operators

This is your first REAL mini-program!`,
        challenge: `You are the dungeon gatekeeper. Write a program that:

1. Creates these variables:
   - playerName = "Axel"
   - playerLevel = 5
   - hasWeapon = true
   - entryFee = 100
   - playerGold = 150

2. Calculates: goldAfterFee = playerGold - entryFee

3. If playerLevel >= 3 AND hasWeapon is true AND goldAfterFee >= 0:
   Print: "Welcome, Axel! Gold remaining: 50"
   
4. Otherwise:
   Print: "Entry denied!"`,
        hint: `Build it step by step. Variables first, then math, then the if condition.
JS: if (playerLevel >= 3 && hasWeapon && goldAfterFee >= 0)
Python: if player_level >= 3 and has_weapon and gold_after_fee >= 0:`,
        starterCode: `// Step 1: Create all 5 variables\n// Step 2: Calculate goldAfterFee\n// Step 3: Check conditions and print result\n`,
        starterCodes: {
          javascript: `let playerName = "Axel";\nlet playerLevel = 5;\nlet hasWeapon = true;\nlet entryFee = 100;\nlet playerGold = 150;\n\nlet goldAfterFee = playerGold - entryFee;\n\nif (playerLevel >= 3 && hasWeapon && goldAfterFee >= 0) {\n  console.log("Welcome, " + playerName + "! Gold remaining: " + goldAfterFee);\n} else {\n  console.log("Entry denied!");\n}`,
          python: `player_name = "Axel"\nplayer_level = 5\nhas_weapon = True\nentry_fee = 100\nplayer_gold = 150\n\ngold_after_fee = player_gold - entry_fee\n\nif player_level >= 3 and has_weapon and gold_after_fee >= 0:\n    print(f"Welcome, {player_name}! Gold remaining: {gold_after_fee}")\nelse:\n    print("Entry denied!")`,
          java: `String playerName = "Axel";\nint playerLevel = 5;\nboolean hasWeapon = true;\nint entryFee = 100;\nint playerGold = 150;\n\nint goldAfterFee = playerGold - entryFee;\n\nif (playerLevel >= 3 && hasWeapon && goldAfterFee >= 0) {\n    System.out.println("Welcome, " + playerName + "! Gold remaining: " + goldAfterFee);\n} else {\n    System.out.println("Entry denied!");\n}`,
          cpp: `string playerName = "Axel";\nint playerLevel = 5;\nbool hasWeapon = true;\nint entryFee = 100;\nint playerGold = 150;\n\nint goldAfterFee = playerGold - entryFee;\n\nif (playerLevel >= 3 && hasWeapon && goldAfterFee >= 0) {\n    cout << "Welcome, " << playerName << "! Gold remaining: " << goldAfterFee << endl;\n} else {\n    cout << "Entry denied!" << endl;\n}`,
        },
        functionName: null,
        testCases: [],
        testDisplay: [
          `playerLevel=5, hasWeapon=true, gold=150, fee=100`,
          `goldAfterFee = 150 - 100 = 50`,
          `Output: "Welcome, Axel! Gold remaining: 50"`,
        ],
        validate: (code) => {
          const c = code.toLowerCase();
          return c.includes('axel') &&
                 (c.includes('150') || c.includes('100')) &&
                 (c.includes('&&') || c.includes(' and ')) &&
                 (c.includes('welcome') || c.includes('denied')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },
    ],

    // ── World 1 Boss ─────────────────────────────────────────────────────────
    boss: {
      id: "w1boss",
      type: "mastery",
      title: "Mastery Forge: The Dungeon Calculator",
      bossName: "The Arithmetic Titan",
      bossEmoji: "🔥",
      description: "Boss uses ALL World 1 knowledge against you!",
      challenge: `Build a complete dungeon inventory program using ONLY variables, math, strings, and if/else (NO functions!):

Create these variables:
  - warriorName = "Shadow"
  - swordDamage = 45
  - armorDefense = 20
  - potions = 3
  - potionHeal = 30
  - monsterHP = 100

Then calculate:
  - netDamage = swordDamage - armorDefense
  - totalHeal = potions * potionHeal

Then print this exact battle report:
  "Warrior: Shadow"
  "Net Damage Per Hit: 25"
  "Total Healing Available: 90"

Finally:
  - If netDamage >= 20: print "You can defeat the monster!"
  - Else: print "You need a stronger sword!"`,
      hint: `No functions needed! Just variables, math operators (- and *), and if/else.`,
      starterCode: `// Create all 6 variables\n// Calculate netDamage and totalHeal\n// Print the battle report\n// Check the final condition\n`,
      starterCodes: {
        javascript: `let warriorName = "Shadow";\nlet swordDamage = 45;\nlet armorDefense = 20;\nlet potions = 3;\nlet potionHeal = 30;\nlet monsterHP = 100;\n\nlet netDamage = swordDamage - armorDefense;\nlet totalHeal = potions * potionHeal;\n\nconsole.log("Warrior: " + warriorName);\nconsole.log("Net Damage Per Hit: " + netDamage);\nconsole.log("Total Healing Available: " + totalHeal);\n\nif (netDamage >= 20) {\n  console.log("You can defeat the monster!");\n} else {\n  console.log("You need a stronger sword!");\n}`,
        python: `warrior_name = "Shadow"\nsword_damage = 45\narmor_defense = 20\npotions = 3\npotion_heal = 30\nmonster_hp = 100\n\nnet_damage = sword_damage - armor_defense\ntotal_heal = potions * potion_heal\n\nprint("Warrior: " + warrior_name)\nprint("Net Damage Per Hit: " + str(net_damage))\nprint("Total Healing Available: " + str(total_heal))\n\nif net_damage >= 20:\n    print("You can defeat the monster!")\nelse:\n    print("You need a stronger sword!")`,
        java: `String warriorName = "Shadow";\nint swordDamage = 45;\nint armorDefense = 20;\nint potions = 3;\nint potionHeal = 30;\nint monsterHP = 100;\n\nint netDamage = swordDamage - armorDefense;\nint totalHeal = potions * potionHeal;\n\nSystem.out.println("Warrior: " + warriorName);\nSystem.out.println("Net Damage Per Hit: " + netDamage);\nSystem.out.println("Total Healing Available: " + totalHeal);\n\nif (netDamage >= 20) {\n    System.out.println("You can defeat the monster!");\n} else {\n    System.out.println("You need a stronger sword!");\n}`,
        cpp: `string warriorName = "Shadow";\nint swordDamage = 45;\nint armorDefense = 20;\nint potions = 3;\nint potionHeal = 30;\nint monsterHP = 100;\n\nint netDamage = swordDamage - armorDefense;\nint totalHeal = potions * potionHeal;\n\ncout << "Warrior: " << warriorName << endl;\ncout << "Net Damage Per Hit: " << netDamage << endl;\ncout << "Total Healing Available: " << totalHeal << endl;\n\nif (netDamage >= 20) {\n    cout << "You can defeat the monster!" << endl;\n} else {\n    cout << "You need a stronger sword!" << endl;\n}`,
      },
      functionName: null,
      testCases: [],
      testDisplay: [
        `netDamage = 45 - 20 = 25`,
        `totalHeal = 3 * 30 = 90`,
        `Print "Warrior: Shadow"`,
        `Print "Net Damage Per Hit: 25"`,
        `Print "Total Healing Available: 90"`,
        `netDamage >= 20 → "You can defeat the monster!"`,
      ],
      validate: (code) => {
        const c = code.toLowerCase();
        return c.includes('shadow') &&
               c.includes('45') && c.includes('20') &&
               c.includes('3') && c.includes('30') &&
               c.includes('-') && c.includes('*') &&
               (c.includes('warrior') || c.includes('net damage') || c.includes('heal')) &&
               (c.includes('defeat') || c.includes('stronger')) &&
               (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // WORLD 2 — THE LOOP REALM (Loops & Iteration)
  // Now we introduce loops — AFTER basics are solid
  // ══════════════════════════════════════════════════════════════════
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
        concept: "w2f1", type: "code",
        lesson: "Loops repeat code. Without loops: print 100 lines by hand. With loops: 3 lines of code.",
        challenge: "Write a loop that prints numbers 1 to 5, each on a new line.\n\nExpected output:\n1\n2\n3\n4\n5",
        hint: "JS: for(let i=1; i<=5; i++) { console.log(i); }\nPython: for i in range(1, 6): print(i)",
        starterCode: `// Print 1 to 5 using a loop\n`,
        starterCodes: {
          javascript: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}`,
          python: `for i in range(1, 6):\n    print(i)`,
          java: `for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}`,
          cpp: `for (int i = 1; i <= 5; i++) {\n    cout << i << endl;\n}`,
        },
        functionName: "sumTo",
        testCases: [{ label: "sumTo(5)", input: 5, expected: 15 }, { label: "sumTo(10)", input: 10, expected: 55 }],
        testDisplay: [`Print numbers 1 through 5`, `Each on a new line`],
        validate: (code) => {
          const c = code.toLowerCase();
          return (c.includes('for') || c.includes('while')) &&
                 (c.includes('print') || c.includes('console.log') || c.includes('cout') || c.includes('system.out'));
        },
      },
      {
        id: "w2f2", floorNum: 2, title: "Sum of Numbers",
        concept: "w2f2", type: "code",
        lesson: "Accumulate values in a loop — one of the most used patterns in programming.",
        challenge: "Write a function `sumTo(n)` that returns the sum of all integers from 1 to n.",
        hint: "Start with sum = 0, loop from 1 to n, add each number to sum, return sum.",
        starterCode: `function sumTo(n) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function sumTo(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum = sum + i;\n  }\n  return sum;\n}`,
          python: `def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total`,
          java: `public int sumTo(int n) {\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        sum += i;\n    }\n    return sum;\n}`,
          cpp: `int sumTo(int n) {\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        sum += i;\n    }\n    return sum;\n}`,
        },
        functionName: "sumTo",
        testCases: [
          { label: "sumTo(5)", input: 5, expected: 15 },
          { label: "sumTo(10)", input: 10, expected: 55 },
          { label: "sumTo(100)", input: 100, expected: 5050 },
        ],
        testDisplay: [`sumTo(5) → 15`, `sumTo(10) → 55`, `sumTo(100) → 5050`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return sumTo;`)();
            return fn(5) === 15 && fn(10) === 55 && fn(100) === 5050;
          } catch { return false; }
        },
      },
      {
        id: "w2f3", floorNum: 3, title: "Even Numbers",
        concept: "w2f3", type: "code",
        lesson: "Filter inside loops using if + modulo (%). Even numbers have remainder 0 when divided by 2.",
        challenge: "Write `sumEvens(n)` — returns the sum of all even numbers from 1 to n.",
        hint: "Check if i % 2 === 0 before adding to sum.",
        starterCode: `function sumEvens(n) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function sumEvens(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) {\n      sum += i;\n    }\n  }\n  return sum;\n}`,
          python: `def sum_evens(n):\n    total = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            total += i\n    return total`,
          java: `public int sumEvens(int n) {\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 2 == 0) sum += i;\n    }\n    return sum;\n}`,
          cpp: `int sumEvens(int n) {\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 2 == 0) sum += i;\n    }\n    return sum;\n}`,
        },
        functionName: "sumEvens",
        testCases: [
          { label: "sumEvens(10)", input: 10, expected: 30 },
          { label: "sumEvens(5)", input: 5, expected: 6 },
        ],
        testDisplay: [`sumEvens(10) → 30 (2+4+6+8+10)`, `sumEvens(5) → 6 (2+4)`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return sumEvens;`)();
            return fn(10) === 30 && fn(5) === 6 && fn(2) === 2;
          } catch { return false; }
        },
      },
      {
        id: "w2f4", floorNum: 4, title: "Multiplication Table",
        concept: "w2f4", type: "code",
        lesson: "Loops can build collections. Push results into an array as you go.",
        challenge: "Write `multiTable(n)` — returns an array of n's multiplication table from 1 to 10.",
        hint: "Create empty array, loop from 1 to 10, push n*i each time.",
        starterCode: `function multiTable(n) {\n  // return array [n*1, n*2, ..., n*10]\n}`,
        starterCodes: {
          javascript: `function multiTable(n) {\n  let result = [];\n  for (let i = 1; i <= 10; i++) {\n    result.push(n * i);\n  }\n  return result;\n}`,
          python: `def multi_table(n):\n    result = []\n    for i in range(1, 11):\n        result.append(n * i)\n    return result`,
          java: `public int[] multiTable(int n) {\n    int[] result = new int[10];\n    for (int i = 0; i < 10; i++) {\n        result[i] = n * (i + 1);\n    }\n    return result;\n}`,
          cpp: `vector<int> multiTable(int n) {\n    vector<int> result;\n    for (int i = 1; i <= 10; i++) {\n        result.push_back(n * i);\n    }\n    return result;\n}`,
        },
        functionName: "multiTable",
        testCases: [{ label: "multiTable(3)", input: 3, expected: [3,6,9,12,15,18,21,24,27,30] }],
        testDisplay: [`multiTable(3) → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return multiTable;`)();
            return JSON.stringify(fn(3)) === JSON.stringify([3,6,9,12,15,18,21,24,27,30]);
          } catch { return false; }
        },
      },
      {
        id: "w2f5", floorNum: 5, title: "Count Vowels",
        concept: "w2f5", type: "code",
        lesson: "Loop through each character of a string. Check each one with if.",
        challenge: "Write `countVowels(str)` that returns the number of vowels (a,e,i,o,u) in the string (case-insensitive).",
        hint: "Loop through each character. Check if it's in 'aeiou' (lowercase the string first).",
        starterCode: `function countVowels(str) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function countVowels(str) {\n  let count = 0;\n  let vowels = "aeiou";\n  for (let i = 0; i < str.length; i++) {\n    if (vowels.includes(str[i].toLowerCase())) {\n      count++;\n    }\n  }\n  return count;\n}`,
          python: `def count_vowels(s):\n    count = 0\n    for ch in s.lower():\n        if ch in "aeiou":\n            count += 1\n    return count`,
          java: `public int countVowels(String str) {\n    int count = 0;\n    for (char c : str.toLowerCase().toCharArray()) {\n        if ("aeiou".indexOf(c) >= 0) count++;\n    }\n    return count;\n}`,
          cpp: `int countVowels(string str) {\n    int count = 0;\n    string vowels = "aeiou";\n    for (char c : str) {\n        if (vowels.find(tolower(c)) != string::npos) count++;\n    }\n    return count;\n}`,
        },
        functionName: "countVowels",
        testCases: [
          { label: "hello", input: "hello", expected: 2 },
          { label: "AEIOU", input: "AEIOU", expected: 5 },
          { label: "rhythm", input: "rhythm", expected: 0 },
        ],
        testDisplay: [`countVowels("hello") → 2`, `countVowels("AEIOU") → 5`, `countVowels("rhythm") → 0`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return countVowels;`)();
            return fn("hello") === 2 && fn("AEIOU") === 5 && fn("rhythm") === 0;
          } catch { return false; }
        },
      },
      {
        id: "w2f6", floorNum: 6, title: "While Loop",
        concept: "w2f6", type: "code",
        lesson: "while loops repeat as long as a condition is true. Great when you don't know how many times to loop.",
        challenge: "Write `countDown(n)` that returns an array counting down from n to 1 using a while loop.",
        hint: "let i = n; while(i >= 1) { push i; i--; }",
        starterCode: `function countDown(n) {\n  // use a while loop\n}`,
        starterCodes: {
          javascript: `function countDown(n) {\n  let result = [];\n  let i = n;\n  while (i >= 1) {\n    result.push(i);\n    i--;\n  }\n  return result;\n}`,
          python: `def count_down(n):\n    result = []\n    i = n\n    while i >= 1:\n        result.append(i)\n        i -= 1\n    return result`,
          java: `public int[] countDown(int n) {\n    // simplified for Java\n    int[] result = new int[n];\n    int i = n;\n    int idx = 0;\n    while (i >= 1) { result[idx++] = i--; }\n    return result;\n}`,
          cpp: `vector<int> countDown(int n) {\n    vector<int> result;\n    int i = n;\n    while (i >= 1) { result.push_back(i--); }\n    return result;\n}`,
        },
        functionName: "countDown",
        testCases: [
          { label: "countDown(5)", input: 5, expected: [5,4,3,2,1] },
          { label: "countDown(3)", input: 3, expected: [3,2,1] },
        ],
        testDisplay: [`countDown(5) → [5,4,3,2,1]`, `countDown(3) → [3,2,1]`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return countDown;`)();
            return JSON.stringify(fn(5)) === JSON.stringify([5,4,3,2,1]) &&
                   JSON.stringify(fn(3)) === JSON.stringify([3,2,1]);
          } catch { return false; }
        },
      },
      {
        id: "w2f7", floorNum: 7, title: "Pattern Printing",
        concept: "w2f7", type: "code",
        lesson: "Classic loop challenge: use loops to build patterns. Each row has more stars.",
        challenge: "Write `triangle(n)` that returns an array of n strings forming a star triangle.\nRow 1: '*'\nRow 2: '**'\nRow 3: '***'",
        hint: "For each row i (1 to n), create a string of i stars using repeat() or a loop.",
        starterCode: `function triangle(n) {\n  // return ["*", "**", "***", ...]\n}`,
        starterCodes: {
          javascript: `function triangle(n) {\n  let result = [];\n  for (let i = 1; i <= n; i++) {\n    result.push("*".repeat(i));\n  }\n  return result;\n}`,
          python: `def triangle(n):\n    result = []\n    for i in range(1, n + 1):\n        result.append("*" * i)\n    return result`,
          java: `public String[] triangle(int n) {\n    String[] result = new String[n];\n    for (int i = 0; i < n; i++) {\n        result[i] = "*".repeat(i + 1);\n    }\n    return result;\n}`,
          cpp: `vector<string> triangle(int n) {\n    vector<string> result;\n    for (int i = 1; i <= n; i++) {\n        result.push_back(string(i, '*'));\n    }\n    return result;\n}`,
        },
        functionName: "triangle",
        testCases: [{ label: "triangle(4)", input: 4, expected: ["*","**","***","****"] }],
        testDisplay: [`triangle(4) → ["*", "**", "***", "****"]`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return triangle;`)();
            const r = fn(4);
            return r[0]==="*" && r[1]==="**" && r[2]==="***" && r[3]==="****";
          } catch { return false; }
        },
      },
    ],
    boss: {
      id: "w2boss", type: "mastery",
      title: "Mastery Forge: Number Guessing Game Logic",
      bossName: "The Loop Leviathan",
      bossEmoji: "🌀",
      challenge: `Write \`guessGame(secret, guesses)\` where:
- secret is the target number
- guesses is an array of attempts
- Return array of hints: 'Too low', 'Too high', or 'Correct!'
- Stop after correct guess`,
      starterCode: `function guessGame(secret, guesses) {\n  // your code here\n}`,
      starterCodes: {
        javascript: `function guessGame(secret, guesses) {\n  let results = [];\n  for (let i = 0; i < guesses.length; i++) {\n    if (guesses[i] < secret) {\n      results.push("Too low");\n    } else if (guesses[i] > secret) {\n      results.push("Too high");\n    } else {\n      results.push("Correct!");\n      break;\n    }\n  }\n  return results;\n}`,
        python: `def guess_game(secret, guesses):\n    results = []\n    for g in guesses:\n        if g < secret:\n            results.append("Too low")\n        elif g > secret:\n            results.append("Too high")\n        else:\n            results.append("Correct!")\n            break\n    return results`,
        java: `public String[] guessGame(int secret, int[] guesses) {\n    // implementation\n}`,
        cpp: `vector<string> guessGame(int secret, vector<int> guesses) {\n    // implementation\n}`,
      },
      functionName: "guessGame",
      testCases: [
        { label: "secret=50", input: [50, [25,75,50]], expected: ["Too low","Too high","Correct!"] },
      ],
      testDisplay: [
        `guessGame(50,[25,75,50]) → ["Too low","Too high","Correct!"]`,
        `guessGame(30,[50,20,30]) → ["Too high","Too low","Correct!"]`,
      ],
      validate: (code) => {
        try {
          const fn = new Function(`${code}; return guessGame;`)();
          return JSON.stringify(fn(50,[25,75,50])) === JSON.stringify(["Too low","Too high","Correct!"]) &&
                 JSON.stringify(fn(30,[50,20,30])) === JSON.stringify(["Too high","Too low","Correct!"]);
        } catch { return false; }
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // WORLD 3 — THE FUNCTION FORGE
  // NOW we introduce functions — after loops and basics
  // ══════════════════════════════════════════════════════════════════
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
        concept: "w3f1", type: "code",
        lesson: `A function is a reusable block of code. 
You define it once, call it many times.
Input (parameters) → Process → Output (return value)

JS:      function add(a, b) { return a + b; }
Python:  def add(a, b): return a + b`,
        challenge: "Write `square(n)` that returns n multiplied by n.",
        hint: "return n * n",
        starterCode: `function square(n) {\n  // return n squared\n}`,
        starterCodes: {
          javascript: `function square(n) {\n  return n * n;\n}`,
          python: `def square(n):\n    return n * n`,
          java: `public int square(int n) {\n    return n * n;\n}`,
          cpp: `int square(int n) {\n    return n * n;\n}`,
        },
        functionName: "square",
        testCases: [
          { label: "square(4)", input: 4, expected: 16 },
          { label: "square(3)", input: 3, expected: 9 },
          { label: "square(0)", input: 0, expected: 0 },
        ],
        testDisplay: [`square(4) → 16`, `square(3) → 9`, `square(0) → 0`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return square;`)();
            return fn(4)===16 && fn(3)===9 && fn(0)===0;
          } catch { return false; }
        },
      },
      {
        id: "w3f2", floorNum: 2, title: "Return Values",
        concept: "w3f2", type: "code",
        lesson: "A function must RETURN its result. Without return, you get undefined. Return ends the function immediately.",
        challenge: "Write `minMax(arr)` that returns an object `{min, max}` with the minimum and maximum values of the array.",
        hint: "Use Math.min(...arr) and Math.max(...arr)",
        starterCode: `function minMax(arr) {\n  // return {min: ..., max: ...}\n}`,
        starterCodes: {
          javascript: `function minMax(arr) {\n  return { min: Math.min(...arr), max: Math.max(...arr) };\n}`,
          python: `def min_max(arr):\n    return {"min": min(arr), "max": max(arr)}`,
          java: `// Return object with min and max`,
          cpp: `// Return struct with min and max`,
        },
        functionName: "minMax",
        testCases: [{ label: "minMax([3,1,9,2,7])", input: [3,1,9,2,7], expected: {min:1,max:9} }],
        testDisplay: [`minMax([3,1,9,2,7]) → {min:1, max:9}`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return minMax;`)();
            const r = fn([3,1,9,2,7]);
            return r.min===1 && r.max===9;
          } catch { return false; }
        },
      },
      {
        id: "w3f3", floorNum: 3, title: "isPrime Checker",
        concept: "w3f4", type: "code",
        lesson: "A prime number is divisible only by 1 and itself. 2,3,5,7,11,13... are primes.",
        challenge: "Write `isPrime(n)` that returns true if n is prime, false otherwise.",
        hint: "Loop from 2 to √n. If n is divisible by any number in range, return false.",
        starterCode: `function isPrime(n) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}`,
          python: `def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True`,
          java: `public boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i <= Math.sqrt(n); i++)\n        if (n % i == 0) return false;\n    return true;\n}`,
          cpp: `bool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++)\n        if (n % i == 0) return false;\n    return true;\n}`,
        },
        functionName: "isPrime",
        testCases: [
          { label: "isPrime(2)", input: 2, expected: true },
          { label: "isPrime(17)", input: 17, expected: true },
          { label: "isPrime(1)", input: 1, expected: false },
          { label: "isPrime(4)", input: 4, expected: false },
        ],
        testDisplay: [`isPrime(2) → true`, `isPrime(17) → true`, `isPrime(1) → false`, `isPrime(4) → false`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isPrime;`)();
            return fn(2)===true && fn(17)===true && fn(1)===false && fn(4)===false && fn(97)===true;
          } catch { return false; }
        },
      },
      {
        id: "w3f4", floorNum: 4, title: "Palindrome Checker",
        concept: "w3f5", type: "code",
        lesson: "A palindrome reads the same forwards and backwards. 'racecar', 'madam', 'level'.",
        challenge: "Write `isPalindrome(str)` — returns true if string is a palindrome (ignore case and spaces).",
        hint: "Clean the string (lowercase, remove spaces), then compare with its reverse.",
        starterCode: `function isPalindrome(str) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function isPalindrome(str) {\n  let clean = str.toLowerCase().replace(/\\s/g, "");\n  return clean === clean.split("").reverse().join("");\n}`,
          python: `def is_palindrome(s):\n    clean = s.lower().replace(" ", "")\n    return clean == clean[::-1]`,
          java: `public boolean isPalindrome(String str) {\n    String clean = str.toLowerCase().replaceAll("\\\\s", "");\n    return clean.equals(new StringBuilder(clean).reverse().toString());\n}`,
          cpp: `bool isPalindrome(string str) {\n    string clean = "";\n    for (char c : str) if (c != ' ') clean += tolower(c);\n    string rev = string(clean.rbegin(), clean.rend());\n    return clean == rev;\n}`,
        },
        functionName: "isPalindrome",
        testCases: [
          { label: "racecar", input: "racecar", expected: true },
          { label: "hello", input: "hello", expected: false },
          { label: "A man a plan a canal Panama", input: "A man a plan a canal Panama", expected: true },
        ],
        testDisplay: [`isPalindrome("racecar") → true`, `isPalindrome("hello") → false`, `isPalindrome("A man a plan a canal Panama") → true`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return isPalindrome;`)();
            return fn("racecar")===true && fn("hello")===false && fn("A man a plan a canal Panama")===true;
          } catch { return false; }
        },
      },
      {
        id: "w3f5", floorNum: 5, title: "FizzBuzz — The Classic",
        concept: "w1f8", type: "code",
        lesson: "The most famous coding interview question. Combines loops, modulo, and conditions in a function.",
        challenge: "Write `fizzBuzz(n)` — return 'Fizz' if divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else return n as string.",
        hint: "Check FizzBuzz FIRST (both conditions), then Fizz, then Buzz.",
        starterCode: `function fizzBuzz(n) {\n  // your code here\n}`,
        starterCodes: {
          javascript: `function fizzBuzz(n) {\n  if (n % 15 === 0) return "FizzBuzz";\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  return String(n);\n}`,
          python: `def fizz_buzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    elif n % 3 == 0:\n        return "Fizz"\n    elif n % 5 == 0:\n        return "Buzz"\n    else:\n        return str(n)`,
          java: `public String fizzBuzz(int n) {\n    if (n % 15 == 0) return "FizzBuzz";\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    return String.valueOf(n);\n}`,
          cpp: `string fizzBuzz(int n) {\n    if (n % 15 == 0) return "FizzBuzz";\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    return to_string(n);\n}`,
        },
        functionName: "fizzBuzz",
        testCases: [
          { label: "fizzBuzz(3)", input: 3, expected: "Fizz" },
          { label: "fizzBuzz(5)", input: 5, expected: "Buzz" },
          { label: "fizzBuzz(15)", input: 15, expected: "FizzBuzz" },
          { label: "fizzBuzz(7)", input: 7, expected: "7" },
        ],
        testDisplay: [`fizzBuzz(3) → "Fizz"`, `fizzBuzz(5) → "Buzz"`, `fizzBuzz(15) → "FizzBuzz"`, `fizzBuzz(7) → "7"`],
        validate: (code) => {
          try {
            const fn = new Function(`${code}; return fizzBuzz;`)();
            return fn(3)==="Fizz" && fn(5)==="Buzz" && fn(15)==="FizzBuzz" && fn(7)==="7";
          } catch { return false; }
        },
      },
    ],
    boss: {
      id: "w3boss", type: "mastery",
      title: "Mastery Forge: Calculator with History",
      bossName: "The Function Overlord",
      bossEmoji: "⚙️",
      challenge: `Create a \`createCalculator()\` that returns an object with:
- \`calculate(a, op, b)\` — performs +,-,*,/ and records it
- \`getHistory()\` — returns array like ["3 + 4 = 7"]
- \`clearHistory()\` — empties history`,
      starterCode: `function createCalculator() {\n  let history = [];\n  function calculate(a, op, b) {\n    // perform and record\n  }\n  function getHistory() {\n    return history;\n  }\n  function clearHistory() {\n    history = [];\n  }\n  return { calculate, getHistory, clearHistory };\n}`,
      starterCodes: {
        javascript: `function createCalculator() {\n  let history = [];\n  function calculate(a, op, b) {\n    let result;\n    if (op === "+") result = a + b;\n    else if (op === "-") result = a - b;\n    else if (op === "*") result = a * b;\n    else if (op === "/") result = a / b;\n    history.push(\`\${a} \${op} \${b} = \${result}\`);\n    return result;\n  }\n  function getHistory() { return history; }\n  function clearHistory() { history = []; }\n  return { calculate, getHistory, clearHistory };\n}`,
        python: `def create_calculator():\n    history = []\n    def calculate(a, op, b):\n        if op == "+": result = a + b\n        elif op == "-": result = a - b\n        elif op == "*": result = a * b\n        elif op == "/": result = a / b\n        history.append(f"{a} {op} {b} = {result}")\n        return result\n    def get_history(): return history\n    def clear_history(): history.clear()\n    return {"calculate": calculate, "get_history": get_history, "clear_history": clear_history}`,
        java: `// Implement using a class with history list`,
        cpp: `// Implement using struct with history vector`,
      },
      functionName: "createCalculator",
      testCases: [],
      testDisplay: [
        `After calculate(3,"+",4): getHistory() → ["3 + 4 = 7"]`,
        `After calculate(10,"*",2): getHistory() has 2 entries`,
        `After clearHistory(): getHistory() → []`,
      ],
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
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // WORLDS 4, 5, 6 — kept from previous version
  // ══════════════════════════════════════════════════════════════════
  {
    id: "w4", number: 4, name: "The Memory Vault", subtitle: "Arrays & Strings",
    description: "Data lives in collections. Learn to store, search, transform.",
    theme: { primary: "#34d399", bg: "#001a0f", accent: "#059669" }, emoji: "📦",
    floors: [
      { id:"w4f1", floorNum:1, title:"Array Basics", concept:"w4f1", type:"code", lesson:"Arrays are ordered lists. Zero-indexed.", challenge:"Write `arrayInfo(arr)` returning `{length, first, last}`.", hint:"arr.length, arr[0], arr[arr.length-1]", starterCode:`function arrayInfo(arr) {\n  // return {length, first, last}\n}`, starterCodes:{javascript:`function arrayInfo(arr) {\n  return { length: arr.length, first: arr[0], last: arr[arr.length-1] };\n}`, python:`def array_info(arr):\n    return {"length": len(arr), "first": arr[0], "last": arr[-1]}`, java:``, cpp:``}, functionName:"arrayInfo", testCases:[{label:"[10,20,30,40,50]",input:[10,20,30,40,50],expected:{length:5,first:10,last:50}}], testDisplay:[`arrayInfo([10,20,30,40,50]) → {length:5, first:10, last:50}`], validate:(code)=>{ try{ const fn=new Function(`${code}; return arrayInfo;`)(); const r=fn([10,20,30,40,50]); return r.length===5&&r.first===10&&r.last===50; }catch{return false;} } },
      { id:"w4f2", floorNum:2, title:"Find Largest Without Math.max", concept:"w4f3", type:"code", lesson:"Manual searching — builds algorithmic thinking.", challenge:"Write `findLargest(arr)` WITHOUT using Math.max.", hint:"Start with largest=arr[0], loop and update if current > largest.", starterCode:`function findLargest(arr) {\n  // do NOT use Math.max\n}`, starterCodes:{javascript:`function findLargest(arr) {\n  let largest = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > largest) largest = arr[i];\n  }\n  return largest;\n}`, python:`def find_largest(arr):\n    largest = arr[0]\n    for x in arr:\n        if x > largest:\n            largest = x\n    return largest`, java:``, cpp:``}, functionName:"findLargest", testCases:[{label:"[3,1,9,2,7]",input:[3,1,9,2,7],expected:9},{label:"[-1,-5,-2]",input:[-1,-5,-2],expected:-1}], testDisplay:[`findLargest([3,1,9,2,7]) → 9`,`findLargest([-1,-5,-2]) → -1`,`No Math.max!`], validate:(code)=>{ try{ if(code.includes("Math.max"))return false; const fn=new Function(`${code}; return findLargest;`)(); return fn([3,1,9,2,7])===9&&fn([-1,-5,-2])===-1; }catch{return false;} } },
      { id:"w4f3", floorNum:3, title:"Remove Duplicates", concept:"w4f5", type:"code", lesson:"Sets automatically hold unique values only.", challenge:"Write `removeDuplicates(arr)` returning array with duplicates removed.", hint:"Use [...new Set(arr)] or loop with seen object.", starterCode:`function removeDuplicates(arr) {\n  // your code here\n}`, starterCodes:{javascript:`function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}`, python:`def remove_duplicates(arr):\n    return list(dict.fromkeys(arr))`, java:``, cpp:``}, functionName:"removeDuplicates", testCases:[{label:"[1,2,2,3,3,3]",input:[1,2,2,3,3,3],expected:[1,2,3]}], testDisplay:[`removeDuplicates([1,2,2,3,3,3]) → [1,2,3]`], validate:(code)=>{ try{ const fn=new Function(`${code}; return removeDuplicates;`)(); return JSON.stringify(fn([1,2,2,3,3,3]))===JSON.stringify([1,2,3]); }catch{return false;} } },
      { id:"w4f4", floorNum:4, title:"Frequency Counter", concept:"w4f6", type:"code", lesson:"Objects as frequency maps — a hugely useful pattern.", challenge:"Write `frequency(arr)` returning object mapping each value to its count.", hint:"obj[item] = (obj[item] || 0) + 1", starterCode:`function frequency(arr) {\n  // return {value: count, ...}\n}`, starterCodes:{javascript:`function frequency(arr) {\n  let obj = {};\n  for (let item of arr) {\n    obj[item] = (obj[item] || 0) + 1;\n  }\n  return obj;\n}`, python:`def frequency(arr):\n    obj = {}\n    for item in arr:\n        obj[item] = obj.get(item, 0) + 1\n    return obj`, java:``, cpp:``}, functionName:"frequency", testCases:[{label:'["a","b","a","c","b","a"]',input:["a","b","a","c","b","a"],expected:{a:3,b:2,c:1}}], testDisplay:[`frequency(["a","b","a","c","b","a"]) → {a:3, b:2, c:1}`], validate:(code)=>{ try{ const fn=new Function(`${code}; return frequency;`)(); const r=fn(["a","b","a","c","b","a"]); return r.a===3&&r.b===2&&r.c===1; }catch{return false;} } },
      { id:"w4f5", floorNum:5, title:"Anagram Checker", concept:"w4f8", type:"code", lesson:"Anagrams: same letters, different order. Sort both and compare.", challenge:"Write `isAnagram(s1, s2)` returning true if strings are anagrams (ignore case, spaces).", hint:"Clean both strings, sort chars, compare.", starterCode:`function isAnagram(s1, s2) {\n  // your code here\n}`, starterCodes:{javascript:`function isAnagram(s1, s2) {\n  const clean = s => s.toLowerCase().replace(/\\s/g,"").split("").sort().join("");\n  return clean(s1) === clean(s2);\n}`, python:`def is_anagram(s1, s2):\n    clean = lambda s: sorted(s.lower().replace(" ", ""))\n    return clean(s1) == clean(s2)`, java:``, cpp:``}, functionName:"isAnagram", testCases:[{label:"listen/silent",input:["listen","silent"],expected:true},{label:"hello/world",input:["hello","world"],expected:false}], testDisplay:[`isAnagram("listen","silent") → true`,`isAnagram("hello","world") → false`], validate:(code)=>{ try{ const fn=new Function(`${code}; return isAnagram;`)(); return fn("listen","silent")===true&&fn("hello","world")===false&&fn("Astronomer","Moon starer")===true; }catch{return false;} } },
    ],
    boss: {
      id:"w4boss", type:"mastery", title:"Mastery Forge: Contact Manager", bossName:"The Vault Keeper", bossEmoji:"📦",
      challenge:`Build a contact manager:\n- addContact(name, phone)\n- findContact(name) → contact or null\n- deleteContact(name) → true/false\n- listAll() → sorted names array`,
      starterCode:`function createContactManager() {\n  let contacts = [];\n  function addContact(name, phone) {}\n  function findContact(name) {}\n  function deleteContact(name) {}\n  function listAll() {}\n  return { addContact, findContact, deleteContact, listAll };\n}`,
      starterCodes:{javascript:`function createContactManager() {\n  let contacts = [];\n  function addContact(name, phone) { contacts.push({name, phone}); }\n  function findContact(name) { return contacts.find(c => c.name === name) || null; }\n  function deleteContact(name) {\n    const idx = contacts.findIndex(c => c.name === name);\n    if (idx === -1) return false;\n    contacts.splice(idx, 1);\n    return true;\n  }\n  function listAll() { return contacts.map(c => c.name).sort(); }\n  return { addContact, findContact, deleteContact, listAll };\n}`, python:``, java:``, cpp:``},
      functionName:"createContactManager", testCases:[],
      testDisplay:[`addContact("Alice","111") then findContact("Alice") → {name:"Alice",phone:"111"}`,`listAll() → sorted names`,`deleteContact("Bob") → true`],
      validate:(code)=>{ try{ const fn=new Function(`${code}; return createContactManager;`)(); const cm=fn(); cm.addContact("Alice","111"); cm.addContact("Charlie","333"); cm.addContact("Bob","222"); if(cm.findContact("Alice").phone!=="111")return false; if(cm.findContact("Zara")!==null)return false; if(JSON.stringify(cm.listAll())!==JSON.stringify(["Alice","Bob","Charlie"]))return false; if(cm.deleteContact("Bob")!==true)return false; return cm.listAll().length===2; }catch{return false;} }
    },
  },

  {
    id:"w5", number:5, name:"The Logic Arena", subtitle:"Intermediate Algorithms",
    description:"Real problems. Real thinking. This is where coders are made.",
    theme:{primary:"#f87171",bg:"#1a0505",accent:"#dc2626"}, emoji:"⚔️",
    floors:[
      { id:"w5f1", floorNum:1, title:"Binary Search", concept:"w5f2", type:"code", lesson:"Binary search halves the search space each time — O(log n).", challenge:"Write `binarySearch(sortedArr, target)` — returns index or -1.", hint:"Use low, high, mid. Compare mid to target.", starterCode:`function binarySearch(sortedArr, target) {\n  // return index or -1\n}`, starterCodes:{javascript:`function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`, python:`def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1`, java:``, cpp:``}, functionName:"binarySearch", testCases:[{label:"find 7",input:[[1,3,5,7,9,11],7],expected:3},{label:"not found",input:[[1,3,5],10],expected:-1}], testDisplay:[`binarySearch([1,3,5,7,9,11], 7) → 3`,`binarySearch([1,3,5], 10) → -1`], validate:(code)=>{ try{ const fn=new Function(`${code}; return binarySearch;`)(); return fn([1,3,5,7,9,11],7)===3&&fn([1,3,5,7,9],10)===-1; }catch{return false;} } },
      { id:"w5f2", floorNum:2, title:"Bubble Sort", concept:"w5f3", type:"code", lesson:"Sorting algorithms rearrange data. Bubble sort: compare adjacent, swap if out of order.", challenge:"Write `bubbleSort(arr)` without using .sort().", hint:"Nested loops. Compare arr[j] and arr[j+1], swap if out of order.", starterCode:`function bubbleSort(arr) {\n  let a = [...arr];\n  // sort without .sort()\n  return a;\n}`, starterCodes:{javascript:`function bubbleSort(arr) {\n  let a = [...arr];\n  for (let i = 0; i < a.length; i++) {\n    for (let j = 0; j < a.length - i - 1; j++) {\n      if (a[j] > a[j+1]) {\n        let temp = a[j];\n        a[j] = a[j+1];\n        a[j+1] = temp;\n      }\n    }\n  }\n  return a;\n}`, python:`def bubble_sort(arr):\n    a = arr[:]\n    for i in range(len(a)):\n        for j in range(len(a) - i - 1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n    return a`, java:``, cpp:``}, functionName:"bubbleSort", testCases:[{label:"[5,3,1,4,2]",input:[5,3,1,4,2],expected:[1,2,3,4,5]}], testDisplay:[`bubbleSort([5,3,1,4,2]) → [1,2,3,4,5]`,`No .sort() allowed!`], validate:(code)=>{ try{ if(code.includes(".sort("))return false; const fn=new Function(`${code}; return bubbleSort;`)(); return JSON.stringify(fn([5,3,1,4,2]))===JSON.stringify([1,2,3,4,5]); }catch{return false;} } },
      { id:"w5f3", floorNum:3, title:"Fibonacci (Recursion)", concept:"w5f4", type:"code", lesson:"Recursion: a function that calls itself. Always needs a base case.", challenge:"Write `fibonacci(n)` recursively. (0,1,1,2,3,5,8...)", hint:"Base: fib(0)=0, fib(1)=1. Recursive: fib(n-1)+fib(n-2)", starterCode:`function fibonacci(n) {\n  // your code here\n}`, starterCodes:{javascript:`function fibonacci(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  return fibonacci(n-1) + fibonacci(n-2);\n}`, python:`def fibonacci(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    return fibonacci(n-1) + fibonacci(n-2)`, java:``, cpp:``}, functionName:"fibonacci", testCases:[{label:"fib(0)",input:0,expected:0},{label:"fib(6)",input:6,expected:8},{label:"fib(10)",input:10,expected:55}], testDisplay:[`fibonacci(0) → 0`,`fibonacci(6) → 8`,`fibonacci(10) → 55`], validate:(code)=>{ try{ const fn=new Function(`${code}; return fibonacci;`)(); return fn(0)===0&&fn(6)===8&&fn(10)===55; }catch{return false;} } },
      { id:"w5f4", floorNum:4, title:"Find the Duplicate", concept:"w4f6", type:"code", lesson:"Use a Set or object to track seen values efficiently.", challenge:"Write `findDuplicate(arr)` returning the first duplicate, or null if none.", hint:"Use a Set. If you see an item already in the set — that's the duplicate.", starterCode:`function findDuplicate(arr) {\n  // your code here\n}`, starterCodes:{javascript:`function findDuplicate(arr) {\n  let seen = new Set();\n  for (let item of arr) {\n    if (seen.has(item)) return item;\n    seen.add(item);\n  }\n  return null;\n}`, python:`def find_duplicate(arr):\n    seen = set()\n    for item in arr:\n        if item in seen: return item\n        seen.add(item)\n    return None`, java:``, cpp:``}, functionName:"findDuplicate", testCases:[{label:"[1,2,3,2,4]",input:[1,2,3,2,4],expected:2},{label:"[1,2,3]",input:[1,2,3],expected:null}], testDisplay:[`findDuplicate([1,2,3,2,4]) → 2`,`findDuplicate([1,2,3]) → null`], validate:(code)=>{ try{ const fn=new Function(`${code}; return findDuplicate;`)(); return fn([1,2,3,2,4])===2&&fn([1,2,3])===null; }catch{return false;} } },
      { id:"w5f5", floorNum:5, title:"Flatten Nested Array", concept:"w5f5", type:"code", lesson:"Recursion shines on nested structures.", challenge:"Write `flatten(arr)` that flattens a deeply nested array.", hint:"If item is array, recurse. Otherwise push it.", starterCode:`function flatten(arr) {\n  // flatten [1,[2,[3]],4] → [1,2,3,4]\n}`, starterCodes:{javascript:`function flatten(arr) {\n  let result = [];\n  for (let item of arr) {\n    if (Array.isArray(item)) result = result.concat(flatten(item));\n    else result.push(item);\n  }\n  return result;\n}`, python:`def flatten(arr):\n    result = []\n    for item in arr:\n        if isinstance(item, list): result.extend(flatten(item))\n        else: result.append(item)\n    return result`, java:``, cpp:``}, functionName:"flatten", testCases:[{label:"nested",input:[1,[2,[3,[4]]],5],expected:[1,2,3,4,5]}], testDisplay:[`flatten([1,[2,[3,[4]]],5]) → [1,2,3,4,5]`], validate:(code)=>{ try{ const fn=new Function(`${code}; return flatten;`)(); return JSON.stringify(fn([1,[2,[3,[4]]],5]))===JSON.stringify([1,2,3,4,5]); }catch{return false;} } },
    ],
    boss:{ id:"w5boss", type:"mastery", title:"Mastery Forge: Quiz System", bossName:"The Logic Warlord", bossEmoji:"⚔️", challenge:`Build a quiz engine:\n- createQuiz(questions)\n- submitAnswer(index, answer) → 'Correct!' or 'Wrong!'\n- getScore() → "X/Y"\n- isComplete() → true when all answered`, starterCode:`function createQuiz(questions) {\n  let answers = new Array(questions.length).fill(null);\n  function submitAnswer(index, answer) {}\n  function getScore() {}\n  function isComplete() {}\n  return { submitAnswer, getScore, isComplete };\n}`, starterCodes:{javascript:`function createQuiz(questions) {\n  let answers = new Array(questions.length).fill(null);\n  function submitAnswer(i, ans) {\n    answers[i] = ans;\n    return ans === questions[i].answer ? "Correct!" : "Wrong!";\n  }\n  function getScore() {\n    let correct = answers.filter((a,i) => a === questions[i].answer).length;\n    return correct + "/" + questions.length;\n  }\n  function isComplete() { return answers.every(a => a !== null); }\n  return { submitAnswer, getScore, isComplete };\n}`, python:``, java:``, cpp:``}, functionName:"createQuiz", testCases:[], testDisplay:[`submitAnswer(0,"4") → "Correct!"`,`submitAnswer(1,"red") → "Wrong!"`,`getScore() → "1/2"`,`isComplete() → true`], validate:(code)=>{ try{ const fn=new Function(`${code}; return createQuiz;`)(); const quiz=fn([{question:"2+2",answer:"4"},{question:"Sky",answer:"blue"}]); if(quiz.submitAnswer(0,"4")!=="Correct!")return false; if(quiz.submitAnswer(1,"red")!=="Wrong!")return false; if(quiz.getScore()!=="1/2")return false; return quiz.isComplete()===true; }catch{return false;} } },
  },

  {
    id:"w6", number:6, name:"The Architect Layer", subtitle:"Advanced Concepts",
    description:"You've come so far. Now think like a system builder.",
    theme:{primary:"#e879f9",bg:"#1a001a",accent:"#a21caf"}, emoji:"🏛️",
    floors:[
      { id:"w6f1", floorNum:1, title:"Error Handling", concept:"w6f1", type:"code", lesson:"Real code fails. try/catch handles errors gracefully.", challenge:"Write `safeDivide(a, b)` — returns a/b, throws Error('Cannot divide by zero') if b is 0.", hint:"if (b === 0) throw new Error('Cannot divide by zero')", starterCode:`function safeDivide(a, b) {\n  // throw error if b is 0\n}`, starterCodes:{javascript:`function safeDivide(a, b) {\n  if (b === 0) throw new Error("Cannot divide by zero");\n  return a / b;\n}`, python:`def safe_divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b`, java:``, cpp:``}, functionName:"safeDivide", testCases:[{label:"10/2",input:[10,2],expected:5}], testDisplay:[`safeDivide(10, 2) → 5`,`safeDivide(5, 0) → throws Error`], validate:(code)=>{ try{ const fn=new Function(`${code}; return safeDivide;`)(); if(fn(10,2)!==5)return false; try{fn(5,0);return false;}catch(e){return e.message==="Cannot divide by zero";} }catch{return false;} } },
      { id:"w6f2", floorNum:2, title:"OOP: Classes & Objects", concept:"w6f3", type:"code", lesson:"Classes are blueprints. Objects are instances. They bundle data and behavior.", challenge:"Create a `BankAccount` class with deposit(amount), withdraw(amount), getBalance(). Withdrawals can't go below 0.", hint:"constructor sets balance=0. withdraw: only deduct if amount <= balance.", starterCode:`class BankAccount {\n  constructor() {}\n  deposit(amount) {}\n  withdraw(amount) {}\n  getBalance() {}\n}`, starterCodes:{javascript:`class BankAccount {\n  constructor() { this.balance = 0; }\n  deposit(amount) { this.balance += amount; }\n  withdraw(amount) { if (amount <= this.balance) this.balance -= amount; }\n  getBalance() { return this.balance; }\n}`, python:`class BankAccount:\n    def __init__(self):\n        self.balance = 0\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n    def get_balance(self):\n        return self.balance`, java:``, cpp:``}, functionName:"BankAccount", testCases:[], testDisplay:[`deposit(100), withdraw(30) → balance: 70`,`withdraw(200) when balance=70 → balance stays 70`], validate:(code)=>{ try{ const Cls=new Function(`${code}; return BankAccount;`)(); const acc=new Cls(); acc.deposit(100); acc.withdraw(30); if(acc.getBalance()!==70)return false; acc.withdraw(200); return acc.getBalance()===70; }catch{return false;} } },
      { id:"w6f3", floorNum:3, title:"Inheritance", concept:"w6f4", type:"code", lesson:"A child class inherits everything from parent and can add more.", challenge:"Create `SavingsAccount extends BankAccount` with addInterest(rate) that multiplies balance by (1 + rate/100).", hint:"class SavingsAccount extends BankAccount. addInterest: this.balance *= (1 + rate/100)", starterCode:`class BankAccount {\n  constructor() { this.balance = 0; }\n  deposit(amount) { this.balance += amount; }\n  withdraw(amount) { if (amount <= this.balance) this.balance -= amount; }\n  getBalance() { return this.balance; }\n}\n\nclass SavingsAccount extends BankAccount {\n  addInterest(rate) {\n    // multiply balance by (1 + rate/100)\n  }\n}`, starterCodes:{javascript:`class BankAccount {\n  constructor() { this.balance = 0; }\n  deposit(a) { this.balance += a; }\n  withdraw(a) { if(a<=this.balance) this.balance -= a; }\n  getBalance() { return this.balance; }\n}\nclass SavingsAccount extends BankAccount {\n  addInterest(rate) { this.balance *= (1 + rate/100); }\n}`, python:`class SavingsAccount(BankAccount):\n    def add_interest(self, rate):\n        self.balance *= (1 + rate/100)`, java:``, cpp:``}, functionName:"SavingsAccount", testCases:[], testDisplay:[`deposit(1000), addInterest(10) → balance: 1100`], validate:(code)=>{ try{ const Cls=new Function(`${code}; return SavingsAccount;`)(); const acc=new Cls(); acc.deposit(1000); acc.addInterest(10); return acc.getBalance()===1100; }catch{return false;} } },
      { id:"w6f4", floorNum:4, title:"Higher Order Functions", concept:"w6f2", type:"code", lesson:"map, filter, reduce — transform arrays without loops.", challenge:"Write `pipeline(arr, ...fns)` that applies each function in sequence to the array.", hint:"Use reduce: fns.reduce((acc, fn) => fn(acc), arr)", starterCode:`function pipeline(arr, ...fns) {\n  // apply fns in sequence\n}`, starterCodes:{javascript:`function pipeline(arr, ...fns) {\n  return fns.reduce((acc, fn) => fn(acc), arr);\n}`, python:`def pipeline(arr, *fns):\n    result = arr\n    for fn in fns:\n        result = fn(result)\n    return result`, java:``, cpp:``}, functionName:"pipeline", testCases:[], testDisplay:[`pipeline([1,2,3,4,5], double, filterEvens) → [2,4,6,8,10]`], validate:(code)=>{ try{ const fn=new Function(`${code}; return pipeline;`)(); const double=a=>a.map(x=>x*2); const filterEvens=a=>a.filter(x=>x%2===0); return JSON.stringify(fn([1,2,3,4,5],double,filterEvens))===JSON.stringify([2,4,6,8,10]); }catch{return false;} } },
      { id:"w6f5", floorNum:5, title:"Event Emitter (Design Pattern)", concept:"w6f5", type:"code", lesson:"The Observer pattern: objects subscribe to events and react when they fire.", challenge:"Implement EventEmitter with on(event,cb), emit(event,data), off(event,cb).", hint:"Store listeners in object as arrays. emit calls all listeners for that event.", starterCode:`class EventEmitter {\n  constructor() { this.listeners = {}; }\n  on(event, callback) {}\n  emit(event, data) {}\n  off(event, callback) {}\n}`, starterCodes:{javascript:`class EventEmitter {\n  constructor() { this.listeners = {}; }\n  on(e, cb) { if(!this.listeners[e]) this.listeners[e]=[]; this.listeners[e].push(cb); }\n  emit(e, data) { (this.listeners[e]||[]).forEach(cb=>cb(data)); }\n  off(e, cb) { this.listeners[e]=(this.listeners[e]||[]).filter(l=>l!==cb); }\n}`, python:``, java:``, cpp:``}, functionName:"EventEmitter", testCases:[], testDisplay:[`on("test",cb), emit("test","hello") → cb called`,`off("test",cb), emit again → cb NOT called`], validate:(code)=>{ try{ const Cls=new Function(`${code}; return EventEmitter;`)(); const em=new Cls(); let log=[]; const cb=d=>log.push(d); em.on("test",cb); em.emit("test","hello"); em.emit("test","world"); if(log.join(",")!=="hello,world")return false; em.off("test",cb); em.emit("test","ignored"); return log.length===2; }catch{return false;} } },
    ],
    boss:{ id:"w6boss", type:"mastery", title:"🏆 FINAL Mastery Forge: Inventory System", bossName:"VOID — The Architect of Betrayal", bossEmoji:"👁️", challenge:`Build a complete Inventory class:\n- addItem(name, quantity, price)\n- removeItem(name) → true/false\n- updateQuantity(name, qty)\n- getTotalValue() → sum of qty*price\n- getLowStock(threshold) → names below threshold`, starterCode:`class Inventory {\n  constructor() { this.items = {}; }\n  addItem(name, quantity, price) {}\n  removeItem(name) {}\n  updateQuantity(name, qty) {}\n  getTotalValue() {}\n  getLowStock(threshold) {}\n}`, starterCodes:{javascript:`class Inventory {\n  constructor() { this.items = {}; }\n  addItem(n,q,p) { this.items[n]={quantity:q,price:p}; }\n  removeItem(n) { if(!this.items[n])return false; delete this.items[n]; return true; }\n  updateQuantity(n,q) { if(this.items[n]) this.items[n].quantity=q; }\n  getTotalValue() { return Object.values(this.items).reduce((s,i)=>s+i.quantity*i.price,0); }\n  getLowStock(t) { return Object.keys(this.items).filter(n=>this.items[n].quantity<t); }\n}`, python:``, java:``, cpp:``}, functionName:"Inventory", testCases:[], testDisplay:[`addItem("sword",5,100), addItem("shield",2,150), addItem("potion",20,10)`,`getTotalValue() → 1000`,`getLowStock(5) includes "shield"`,`removeItem("potion") → true`], validate:(code)=>{ try{ const Cls=new Function(`${code}; return Inventory;`)(); const inv=new Cls(); inv.addItem("sword",5,100); inv.addItem("shield",2,150); inv.addItem("potion",20,10); if(inv.getTotalValue()!==1000)return false; const low=inv.getLowStock(5); if(!low.includes("shield"))return false; inv.updateQuantity("sword",10); if(inv.removeItem("potion")!==true)return false; if(inv.removeItem("dragon")!==false)return false; return inv.getTotalValue()===1300; }catch{return false;} } },
  },
];

export const TOTAL_FLOORS = WORLDS.reduce((sum,w)=>sum+w.floors.length+1, 0);