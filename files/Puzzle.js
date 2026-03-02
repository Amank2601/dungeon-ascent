const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  label: String,
  input: mongoose.Schema.Types.Mixed,
  expected: mongoose.Schema.Types.Mixed,
});

const puzzleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },   // e.g. "p1"
  floor: { type: Number, required: true },               // which floor it belongs to
  title: { type: String, required: true },
  description: { type: String, required: true },
  starterCode: { type: String, required: true },
  functionName: { type: String, required: true },        // the function players must define
  testCases: [testCaseSchema],
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  tags: [String],
  hint: String,
});

const Puzzle = mongoose.model("Puzzle", puzzleSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PUZZLES = [
  {
    id: "p1",
    floor: -5,
    title: "FizzBuzz Fragment",
    description:
      "Complete the function that returns 'Fizz' if n is divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else the number as a string.",
    starterCode: `function fizzBuzz(n) {\n  // your code here\n}`,
    functionName: "fizzBuzz",
    difficulty: "easy",
    tags: ["conditionals", "modulo"],
    hint: "Use the modulo operator (%) to check divisibility.",
    testCases: [
      { label: "divisible by 3", input: 3, expected: "Fizz" },
      { label: "divisible by 5", input: 5, expected: "Buzz" },
      { label: "divisible by both", input: 15, expected: "FizzBuzz" },
      { label: "neither", input: 7, expected: "7" },
    ],
  },
  {
    id: "p2",
    floor: -4,
    title: "Array Reversal",
    description:
      "Write a function `reverseArray(arr)` that returns a new array with elements in reverse order. Do not use .reverse().",
    starterCode: `function reverseArray(arr) {\n  // your code here\n}`,
    functionName: "reverseArray",
    difficulty: "easy",
    tags: ["arrays", "loops"],
    hint: "Try iterating the array from the end to the beginning.",
    testCases: [
      { label: "numbers", input: [1, 2, 3], expected: [3, 2, 1] },
      { label: "strings", input: ["a", "b", "c"], expected: ["c", "b", "a"] },
      { label: "single", input: [42], expected: [42] },
    ],
  },
  {
    id: "p3",
    floor: -3,
    title: "Factorial Recursion",
    description:
      "Write a recursive function `factorial(n)` that returns n! (n factorial). Assume n >= 0.",
    starterCode: `function factorial(n) {\n  // your code here\n}`,
    functionName: "factorial",
    difficulty: "medium",
    tags: ["recursion", "math"],
    hint: "Base case: factorial(0) = 1. Recursive case: n * factorial(n-1).",
    testCases: [
      { label: "zero", input: 0, expected: 1 },
      { label: "one", input: 1, expected: 1 },
      { label: "five", input: 5, expected: 120 },
      { label: "seven", input: 7, expected: 5040 },
    ],
  },
  {
    id: "p4",
    floor: -2,
    title: "Find the Duplicate",
    description:
      "Write `findDuplicate(arr)` that returns the first duplicate value in the array. Return null if none exists.",
    starterCode: `function findDuplicate(arr) {\n  // your code here\n}`,
    functionName: "findDuplicate",
    difficulty: "medium",
    tags: ["arrays", "hash-map"],
    hint: "Use a Set to track seen values as you iterate.",
    testCases: [
      { label: "duplicate at index 3", input: [1, 2, 3, 2, 4], expected: 2 },
      { label: "duplicate at index 2", input: [5, 1, 5, 2, 3], expected: 5 },
      { label: "no duplicate", input: [1, 2, 3], expected: null },
    ],
  },
  {
    id: "p5",
    floor: -1,
    title: "Anagram Detector",
    description:
      "Write `isAnagram(s1, s2)` that returns true if the two strings are anagrams of each other (case-insensitive, ignore spaces).",
    starterCode: `function isAnagram(s1, s2) {\n  // your code here\n}`,
    functionName: "isAnagram",
    difficulty: "hard",
    tags: ["strings", "sorting", "hash-map"],
    hint: "Sort the characters of each string (after lowercasing and removing spaces) and compare.",
    testCases: [
      { label: "classic anagram", input: ["listen", "silent"], expected: true },
      { label: "not an anagram", input: ["hello", "world"], expected: false },
      { label: "with spaces", input: ["Astronomer", "Moon starer"], expected: true },
    ],
  },
];

async function seedPuzzles() {
  const count = await Puzzle.countDocuments();
  if (count === 0) {
    await Puzzle.insertMany(SEED_PUZZLES);
    console.log("🌱 Puzzles seeded successfully");
  }
}

module.exports = { Puzzle, seedPuzzles };
