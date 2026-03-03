// backend/routes/daily.js
const express = require("express");
const { protect } = require("../middleware/auth");
const Progress = require("../models/Progress");
const router = express.Router();

const POOL = [
  { id:"d01",title:"Sum Digits",difficulty:"easy",xpReward:150,
    description:"Write sumDigits(n) returning the sum of all digits.\nsumDigits(123) → 6\nsumDigits(9999) → 36",
    hint:"Convert to string, split, map to Number, reduce.",
    functionName:"sumDigits",
    starterCode:"function sumDigits(n) {\n  // your code here\n}",
    testCases:[{input:123,expected:6},{input:9999,expected:36},{input:0,expected:0}] },
  { id:"d02",title:"Capitalize Words",difficulty:"easy",xpReward:150,
    description:"Write capitalizeWords(str) to capitalize the first letter of every word.\ncapitalizeWords('hello world') → 'Hello World'",
    hint:"Split, map each word, join back.",
    functionName:"capitalizeWords",
    starterCode:"function capitalizeWords(str) {\n  // your code here\n}",
    testCases:[{input:"hello world",expected:"Hello World"},{input:"the quick brown fox",expected:"The Quick Brown Fox"}] },
  { id:"d03",title:"Count Unique",difficulty:"easy",xpReward:150,
    description:"Write countUnique(arr) returning the count of unique values.\ncountUnique([1,1,2,3,3]) → 3",
    hint:"new Set(arr).size",
    functionName:"countUnique",
    starterCode:"function countUnique(arr) {\n  // your code here\n}",
    testCases:[{input:[1,1,2,3,3],expected:3}] },
  { id:"d04",title:"Rotate Array",difficulty:"medium",xpReward:250,
    description:"Write rotateRight(arr, k) rotating the array right by k steps.\nrotateRight([1,2,3,4,5], 2) → [4,5,1,2,3]",
    hint:"Slice last k elements and prepend them.",
    functionName:"rotateRight",
    starterCode:"function rotateRight(arr, k) {\n  // your code here\n}",
    testCases:[{input:[[1,2,3,4,5],2],expected:[4,5,1,2,3]}] },
  { id:"d05",title:"Longest Word",difficulty:"easy",xpReward:150,
    description:"Write longestWord(str) returning the longest word.\nlongestWord('I love programming') → 'programming'",
    hint:"Split and reduce.",
    functionName:"longestWord",
    starterCode:"function longestWord(str) {\n  // your code here\n}",
    testCases:[{input:"I love programming",expected:"programming"}] },
  { id:"d06",title:"Deep Equal",difficulty:"hard",xpReward:350,
    description:"Write deepEqual(a, b) returning true if two values are deeply equal.\ndeepEqual({x:1,y:[2,3]}, {x:1,y:[2,3]}) → true",
    hint:"JSON.stringify both and compare.",
    functionName:"deepEqual",
    starterCode:"function deepEqual(a, b) {\n  // your code here\n}",
    testCases:[{input:[{x:1,y:[2,3]},{x:1,y:[2,3]}],expected:true},{input:[{x:1},{x:2}],expected:false}] },
  { id:"d07",title:"Caesar Cipher",difficulty:"medium",xpReward:250,
    description:"Write caesar(str, shift) shifting each letter forward by shift.\ncaesar('abc', 1) → 'bcd'\ncaesar('xyz', 2) → 'zab'",
    hint:"charCodeAt, fromCharCode, modulo 26 wrap.",
    functionName:"caesar",
    starterCode:"function caesar(str, shift) {\n  // your code here\n}",
    testCases:[{input:["abc",1],expected:"bcd"},{input:["xyz",2],expected:"zab"}] },
  { id:"d08",title:"Matrix Diagonal",difficulty:"medium",xpReward:250,
    description:"Write diagonalSum(matrix) summing the main diagonal.\ndiagonalSum([[1,2],[3,4]]) → 5",
    hint:"matrix[i][i] for i in 0..n-1",
    functionName:"diagonalSum",
    starterCode:"function diagonalSum(matrix) {\n  // your code here\n}",
    testCases:[{input:[[1,2],[3,4]],expected:5}] },
  { id:"d09",title:"Run-Length Encoding",difficulty:"medium",xpReward:250,
    description:"Write rle(str) run-length encoding a string.\nrle('aaabbc') → '3a2b1c'",
    hint:"Walk through, count consecutive same chars.",
    functionName:"rle",
    starterCode:"function rle(str) {\n  // your code here\n}",
    testCases:[{input:"aaabbc",expected:"3a2b1c"},{input:"aaa",expected:"3a"}] },
  { id:"d10",title:"Valid Brackets",difficulty:"medium",xpReward:250,
    description:"Write validBrackets(str) returning true if all brackets are balanced.\nvalidBrackets('({[]})') → true\nvalidBrackets('([)]') → false",
    hint:"Stack: push open, pop+match on close.",
    functionName:"validBrackets",
    starterCode:"function validBrackets(str) {\n  // your code here\n}",
    testCases:[{input:"({[]})",expected:true},{input:"([)]",expected:false},{input:"",expected:true}] },
  { id:"d11",title:"Chunk Array",difficulty:"easy",xpReward:150,
    description:"Write chunk(arr, size) splitting array into chunks.\nchunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]",
    hint:"Loop with step=size, slice each chunk.",
    functionName:"chunk",
    starterCode:"function chunk(arr, size) {\n  // your code here\n}",
    testCases:[{input:[[1,2,3,4,5],2],expected:[[1,2],[3,4],[5]]}] },
  { id:"d12",title:"Flatten One Level",difficulty:"easy",xpReward:150,
    description:"Write flattenOne(arr) flattening exactly one level deep.\nflattenOne([[1,2],[3,[4]]]) → [1,2,3,[4]]",
    hint:"[].concat(...arr) or arr.flat(1)",
    functionName:"flattenOne",
    starterCode:"function flattenOne(arr) {\n  // your code here\n}",
    testCases:[{input:[[1,2],[3,[4]]],expected:[1,2,3,[4]]}] },
];

function todayKey() {
  const n = new Date();
  return `${n.getUTCFullYear()}-${n.getUTCMonth()+1}-${n.getUTCDate()}`;
}
function todayProblem() {
  const n = new Date();
  const doy = Math.floor((n - new Date(n.getUTCFullYear(),0,0)) / 86400000);
  return POOL[doy % POOL.length];
}
function msToMidnight() {
  const n = new Date();
  const mid = new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()+1));
  return mid - n;
}

router.get("/", protect, async (req, res) => {
  try {
    const p = todayProblem();
    const key = todayKey();
    const rec = await Progress.findOne({ user: req.user._id });
    const history = rec?.data?.dailyHistory || {};
    res.json({ problem: p, completedToday: !!history[key], streak: rec?.data?.dailyStreak||0, nextResetMs: msToMidnight() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post("/complete", protect, async (req, res) => {
  try {
    const key = todayKey();
    const p   = todayProblem();
    const rec = await Progress.findOne({ user: req.user._id });
    if (!rec) return res.status(404).json({ error:"Progress not found" });
    const data    = rec.data || {};
    const history = data.dailyHistory || {};
    if (history[key]) return res.json({ alreadyCompleted:true, xpAwarded:0 });

    const yest = new Date(); yest.setUTCDate(yest.getUTCDate()-1);
    const yKey = `${yest.getUTCFullYear()}-${yest.getUTCMonth()+1}-${yest.getUTCDate()}`;
    const newStreak = history[yKey] ? (data.dailyStreak||0)+1 : 1;
    const bonus  = newStreak%3===0 ? 50 : 0;
    const xpAwarded = p.xpReward + bonus;

    await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: { data: { ...data, totalXP:(data.totalXP||0)+xpAwarded, dailyStreak:newStreak, dailyHistory:{...history,[key]:{completedAt:new Date(),xpAwarded}} } } },
      { new:true }
    );
    res.json({ alreadyCompleted:false, xpAwarded, streakBonus:bonus, newStreak });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;