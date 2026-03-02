// src/data/languages.js

export const LANGUAGES = {
  javascript: {
    id: "javascript", name: "JavaScript", emoji: "🟨",
    color: "#f7df1e", monoColor: "#86efac", comment: "//",
    note: "✅ Runs live in browser", judge0Id: 63,
  },
  python: {
    id: "python", name: "Python", emoji: "🐍",
    color: "#3776ab", monoColor: "#7dd3fc", comment: "#",
    note: "✅ Runs via Judge0 engine", judge0Id: 71,
  },
  java: {
    id: "java", name: "Java", emoji: "☕",
    color: "#ed8b00", monoColor: "#fdba74", comment: "//",
    note: "✅ Runs via Judge0 engine", judge0Id: 62,
  },
  cpp: {
    id: "cpp", name: "C++", emoji: "⚡",
    color: "#00599c", monoColor: "#a78bfa", comment: "//",
    note: "✅ Runs via Judge0 engine", judge0Id: 54,
  },
};

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── Judge0 Runner ────────────────────────────────────────────────────────────
export async function runWithJudge0(userCode, language, testCases, functionName) {
  try {
    const wrappedCode = buildTestHarness(userCode, language, testCases, functionName);
    const res = await fetch(`${API}/judge/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("dungeon_token")}`,
      },
      body: JSON.stringify({
        code: wrappedCode,
        languageId: LANGUAGES[language].judge0Id,
        language,
      }),
    });
    if (!res.ok) throw new Error("Judge0 request failed");
    const data = await res.json();
    return parseOutput(data.stdout, data.stderr, testCases);
  } catch (err) {
    return { passed: false, error: err.message, testResults: [], usedFallback: true };
  }
}

// ─── Test Harness Builders ────────────────────────────────────────────────────
function buildTestHarness(code, lang, testCases, fnName) {
  if (lang === "python") return buildPythonHarness(code, testCases, fnName);
  if (lang === "java")   return buildJavaHarness(code, testCases, fnName);
  if (lang === "cpp")    return buildCppHarness(code, testCases, fnName);
  return code;
}

function toPy(val) {
  if (val === null)  return "None";
  if (val === true)  return "True";
  if (val === false) return "False";
  if (typeof val === "string") return `"${val.replace(/"/g, '\\"')}"`;
  if (Array.isArray(val)) return `[${val.map(toPy).join(", ")}]`;
  return String(val);
}

function buildPythonHarness(code, testCases, fnName) {
  const tests = testCases.map((tc, i) => {
    const args = Array.isArray(tc.input) ? tc.input.map(toPy).join(", ") : toPy(tc.input);
    const exp  = toPy(tc.expected);
    return `
try:
    _r${i} = ${fnName}(${args})
    _e${i} = ${exp}
    if str(_r${i}) == str(_e${i}) or _r${i} == _e${i}:
        print("PASS:${i}")
    else:
        print(f"FAIL:${i}:got={_r${i}}:exp={_e${i}}")
except Exception as _ex${i}:
    print(f"FAIL:${i}:error={_ex${i}}")`;
  }).join("\n");

  return `${code}\n\n# ── auto test harness ──\n${tests}`;
}

function toJava(val) {
  if (val === null)  return "null";
  if (val === true)  return "true";
  if (val === false) return "false";
  if (typeof val === "string") return `"${val.replace(/"/g, '\\"')}"`;
  if (Array.isArray(val)) return `new int[]{${val.join(",")}}`;
  return String(val);
}

function buildJavaHarness(code, testCases, fnName) {
  const tests = testCases.map((tc, i) => {
    const args = Array.isArray(tc.input) ? tc.input.map(toJava).join(", ") : toJava(tc.input);
    const exp  = toJava(tc.expected);
    return `
        try {
            Object _r${i} = String.valueOf(sol.${fnName}(${args}));
            if (_r${i}.equals(String.valueOf(${exp}))) { System.out.println("PASS:${i}"); }
            else { System.out.println("FAIL:${i}:got=" + _r${i} + ":exp=${tc.expected}"); }
        } catch (Exception e) { System.out.println("FAIL:${i}:error=" + e.getMessage()); }`;
  }).join("\n");

  return `public class Main {
    ${code}
    public static void main(String[] args) {
        Main sol = new Main();
        ${tests}
    }
}`;
}

function buildCppHarness(code, testCases, fnName) {
  const tests = testCases.map((tc, i) => {
    const args = Array.isArray(tc.input) ? tc.input.map(v => JSON.stringify(v)).join(", ") : JSON.stringify(tc.input);
    const exp  = JSON.stringify(tc.expected);
    return `
    try {
        auto _r${i} = ${fnName}(${args});
        if (to_string(_r${i}) == to_string(${exp})) cout << "PASS:${i}" << endl;
        else cout << "FAIL:${i}:got=" << _r${i} << ":exp=${tc.expected}" << endl;
    } catch (...) { cout << "FAIL:${i}:error=exception" << endl; }`;
  }).join("\n");

  return `#include <bits/stdc++.h>
using namespace std;
${code}
int main() {
    ${tests}
    return 0;
}`;
}

// ─── Output Parser ────────────────────────────────────────────────────────────
function parseOutput(stdout, stderr, testCases) {
  if (!stdout && stderr) return { passed: false, error: stderr, testResults: [] };
  const lines = (stdout || "").split("\n").filter(Boolean);
  const testResults = testCases.map((tc, i) => {
    const line = lines.find(l => l.startsWith(`PASS:${i}`) || l.startsWith(`FAIL:${i}`));
    if (!line) return { label: tc.label || `Test ${i+1}`, pass: false, result: "No output" };
    if (line.startsWith(`PASS:${i}`)) return { label: tc.label || `Test ${i+1}`, pass: true, result: tc.expected };
    const got = line.split(":").find(p => p.startsWith("got="))?.replace("got=", "") || "Error";
    return { label: tc.label || `Test ${i+1}`, pass: false, result: got };
  });
  return { passed: testResults.every(t => t.pass), testResults, error: stderr || null };
}

// ─── Smart Pseudocode Fallback ────────────────────────────────────────────────
// Used when Judge0 is unavailable. Checks logical structure per concept.
export function validatePseudoCode(code, concept, lang) {
  const c = code.toLowerCase().replace(/\s+/g, " ");
  const lines = code.trim().split("\n").filter(l => l.trim().length > 0);
  if (lines.length < 2) return false;

  const hasPrint =
    lang === "python" ? c.includes("print(") :
    lang === "java"   ? c.includes("system.out") :
    lang === "cpp"    ? c.includes("cout") :
    c.includes("console.log");

  const hasReturn = c.includes("return");
  const hasOutput = hasPrint || hasReturn;
  const hasLoop   = c.includes("for") || c.includes("while") || c.includes("range(");
  const hasIf     = c.includes("if") || c.includes("elif") || c.includes("else if");

  switch (concept) {
    // ── World 1 ──────────────────────────────────────────────────────────────
    case "w1f1":
      return hasPrint && c.includes("programmer");
    case "w1f2":
      return (c.includes("hello") || hasOutput) && c.includes("name");
    case "w1f3":
      return c.includes("name") && c.includes("age") && hasOutput;
    case "w1f4":
      return c.includes("+") && c.includes("*") && hasIf && hasOutput;
    case "w1f5":
      return (c.includes("9") || c.includes("1.8")) && c.includes("32") && hasOutput;
    case "w1f6":
      return c.includes("18") && hasIf && hasOutput;
    case "w1f7":
      return (c.includes("90") || c.includes("80")) && hasIf && hasOutput;
    case "w1f8":
      return c.includes("fizz") && c.includes("buzz") && c.includes("%");

    // ── World 2 ──────────────────────────────────────────────────────────────
    case "w2f1":
      return hasLoop && hasOutput;
    case "w2f2":
      return (c.includes("sum") || c.includes("total") || c.includes("+=")) && hasLoop;
    case "w2f3":
      return c.includes("%") && c.includes("2") && hasLoop;
    case "w2f4":
      return (c.includes("*") || c.includes("append") || c.includes("push")) && hasLoop;
    case "w2f5":
      return c.includes("for") && (c.includes("append") || c.includes("push") || c.includes("[[")) && hasLoop;
    case "w2f6":
      return c.includes("*") && hasLoop && hasOutput;
    case "w2f7":
      return (c.includes("aeiou") || c.includes("vowel")) && hasLoop;

    // ── World 3 ──────────────────────────────────────────────────────────────
    case "w3f1":
      return (c.includes("**") || c.includes("pow") || c.includes("* n") || c.includes("*n")) && hasOutput;
    case "w3f2":
      return (c.includes("min") || c.includes("max")) && hasOutput;
    case "w3f3":
      return (c.includes("**") || c.includes("pow") || c.includes("*")) && hasOutput;
    case "w3f4":
      return c.includes("%") && hasLoop && (c.includes("false") || c.includes("true") || hasReturn);
    case "w3f5":
      return c.includes("reverse") || c.includes("::-1") || c.includes("palindrome") ||
             (hasLoop && (c.includes("left") || c.includes("i")) && (c.includes("right") || c.includes("j")));
    case "w3f6":
      return c.includes("prime") && c.includes("sum") && hasLoop;

    // ── World 4 ──────────────────────────────────────────────────────────────
    case "w4f1":
      return (c.includes("len(") || c.includes(".length") || c.includes(".size")) && hasOutput;
    case "w4f2":
      return (c.includes("* 2") || c.includes("*2") || c.includes("map") || c.includes("double")) && hasOutput;
    case "w4f3":
      return (c.includes("largest") || c.includes("max") || hasLoop) && hasOutput;
    case "w4f4":
      return (c.includes("second") || c.includes("sorted") || (hasLoop && lines.length > 4)) && hasOutput;
    case "w4f5":
      return (c.includes("set") || c.includes("seen") || c.includes("unique")) && hasOutput;
    case "w4f6":
      return (c.includes("{}") || c.includes("dict") || c.includes("map") || c.includes("frequency")) && hasLoop;
    case "w4f7":
      return (c.includes("upper") || c.includes("capitalize") || c.includes("title")) &&
             (c.includes("split") || c.includes("join") || hasLoop);
    case "w4f8":
      return (c.includes("sort") || c.includes("sorted") || c.includes("count")) && hasReturn;

    // ── World 5 ──────────────────────────────────────────────────────────────
    case "w5f1":
      return (c.includes("len(") || c.includes(".length")) && (c.includes("{}") || c.includes("dict")) && hasLoop;
    case "w5f2":
      return (c.includes("mid") || c.includes("middle")) &&
             (c.includes("low") || c.includes("left")) &&
             (c.includes("high") || c.includes("right"));
    case "w5f3":
      return (c.includes("swap") || (c.includes("[") && c.includes("]") && c.includes(">"))) && hasLoop;
    case "w5f4":
      return c.includes("fib") || ((c.includes("n-1") || c.includes("n - 1")) && (c.includes("n-2") || c.includes("n - 2")));
    case "w5f5":
      return (c.includes("flatten") || c.includes("extend") || c.includes("isinstance") || c.includes("isarray")) && hasLoop;

    // ── World 6 ──────────────────────────────────────────────────────────────
    case "w6f1":
      return (c.includes("try") || c.includes("raise") || c.includes("throw") || c.includes("except")) && c.includes("0");
    case "w6f2":
      return (c.includes("map") || c.includes("filter") || c.includes("reduce") || hasLoop) &&
             (c.includes("lambda") || c.includes("function") || c.includes("def ") || c.includes("fn"));
    case "w6f3":
      return (c.includes("class") || c.includes("self") || c.includes("this")) &&
             c.includes("balance") && (c.includes("deposit") || c.includes("withdraw"));
    case "w6f4":
      return (c.includes("extends") || c.includes("super") || c.includes("class")) && c.includes("interest");
    case "w6f5":
      return (c.includes("on") || c.includes("emit") || c.includes("listen")) &&
             (c.includes("callback") || c.includes("listener") || c.includes("def ") || c.includes("function"));

    default:
      return lines.length >= 3 && (hasOutput || hasPrint);
  }
}
