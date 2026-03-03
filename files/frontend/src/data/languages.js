// src/data/languages.js
// Uses Piston API — 100% free, no API key, no signup, no card needed
// Docs: https://github.com/engineer-man/piston


export const LANGUAGES = {
  javascript: {
    id: "javascript", name: "JavaScript", emoji: "🟨",
    color: "#f7df1e", monoColor: "#86efac", comment: "//",
    note: "✅ Runs live in browser",
    pistonLang: "javascript", pistonVersion: "20.11.1",
  },
  python: {
    id: "python", name: "Python", emoji: "🐍",
    color: "#3776ab", monoColor: "#7dd3fc", comment: "#",
    note: "✅ Runs via Piston (free)",
    pistonLang: "python", pistonVersion: "3.12.0",
  },
  java: {
    id: "java", name: "Java", emoji: "☕",
    color: "#ed8b00", monoColor: "#fdba74", comment: "//",
    note: "✅ Runs via Piston (free)",
    pistonLang: "java", pistonVersion: "15.0.2",
  },
  cpp: {
    id: "cpp", name: "C++", emoji: "⚡",
    color: "#00599c", monoColor: "#a78bfa", comment: "//",
    note: "✅ Runs via Piston (free)",
    pistonLang: "cpp", pistonVersion: "10.2.0",  // "cpp" not "c++" for Piston Docker
  },
};

// ─── Piston API ───────────────────────────────────────────────────────────────
// Completely free, open source, no auth needed
// https://emkc.org/api/v2/piston/execute
const PISTON_URL = "http://localhost:5000/api/piston/execute";
export async function runWithPiston(userCode, language, testCases, functionName) {
  console.log("Running language:", language);
  console.log("Lang config:", LANGUAGES[language]);
  if (language === "javascript") {
    // JS runs directly in browser, don't use Piston
    return { passed: false, error: "Use browser runner for JS", usedFallback: true };
  }

  try {
    const lang = LANGUAGES[language];
    const wrappedCode = buildTestHarness(userCode, language, testCases, functionName);

    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.pistonLang,
        version: lang.pistonVersion,
        files: [{ content: wrappedCode }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Piston error ${res.status}: ${text}`);
    }

    const data = await res.json();
    const stdout = data.run?.stdout || "";
    const stderr = data.run?.stderr || data.compile?.stderr || "";

    if (stderr && !stdout) {
      return { passed: false, error: stderr, testResults: [], stdout: "" };
    }

    return parseOutput(stdout, stderr, testCases);

  } catch (err) {
    // Network error / Piston down — fall back to pseudocode check
    return { passed: false, error: err.message, testResults: [], usedFallback: true };
  }
}

function getFileName(language) {
  switch (language) {
    case "python": return "solution.py";
    case "java":   return "Main.java";
    case "cpp":    return "solution.cpp";
    default:       return "solution.js";
  }
}

// ─── Test Harness Builders ────────────────────────────────────────────────────
function buildTestHarness(code, lang, testCases, fnName) {
  // For World 1 floors (no functions, just output-based)
  if (!testCases || testCases.length === 0) {
    return code; // Just run the code as-is
  }

  if (lang === "python") return buildPythonHarness(code, testCases, fnName);
  if (lang === "java")   return buildJavaHarness(code, testCases, fnName);
  if (lang === "cpp")    return buildCppHarness(code, testCases, fnName);
  return code;
}

// ── Python harness ────────────────────────────────────────────────────────────
function toPy(val) {
  if (val === null || val === undefined) return "None";
  if (val === true)  return "True";
  if (val === false) return "False";
  if (typeof val === "string") return `"${val.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`;
  if (Array.isArray(val)) return `[${val.map(toPy).join(", ")}]`;
  if (typeof val === "object") return `{${Object.entries(val).map(([k,v])=>`"${k}": ${toPy(v)}`).join(", ")}}`;
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
    if _r${i} == _e${i} or str(_r${i}) == str(_e${i}):
        print("PASS:${i}")
    else:
        print(f"FAIL:${i}:got={_r${i}}:exp={_e${i}}")
except Exception as _ex:
    print(f"FAIL:${i}:error={_ex}")`;
  }).join("\n");

  return `${code}\n\n# -- test runner --\n${tests}`;
}

// ── Java harness ──────────────────────────────────────────────────────────────
function toJava(val) {
  if (val === null)  return "null";
  if (val === true)  return "true";
  if (val === false) return "false";
  if (typeof val === "string") return `"${val.replace(/"/g,'\\"')}"`;
  if (Array.isArray(val)) return `new int[]{${val.join(",")}}`;
  return String(val);
}

function buildJavaHarness(code, testCases, fnName) {
  const tests = testCases.map((tc, i) => {
    const args = Array.isArray(tc.input) ? tc.input.map(toJava).join(", ") : toJava(tc.input);
    const exp  = toJava(tc.expected);
    return `
        try {
            Object _r${i} = sol.${fnName}(${args});
            if (String.valueOf(_r${i}).equals(String.valueOf(${exp}))) {
                System.out.println("PASS:${i}");
            } else {
                System.out.println("FAIL:${i}:got=" + _r${i} + ":exp=${tc.expected}");
            }
        } catch (Exception _e) {
            System.out.println("FAIL:${i}:error=" + _e.getMessage());
        }`;
  }).join("\n");

  return `public class Main {
    ${code}
    public static void main(String[] args) {
        Main sol = new Main();
        ${tests}
    }
}`;
}

// ── C++ harness ───────────────────────────────────────────────────────────────
function toCpp(val) {
  if (val === null)  return "nullptr";
  if (val === true)  return "true";
  if (val === false) return "false";
  if (typeof val === "string") return `"${val.replace(/"/g,'\\"')}"`;
  if (Array.isArray(val)) return `{${val.join(",")}}`;
  return String(val);
}

function buildCppHarness(code, testCases, fnName) {
  const tests = testCases.map((tc, i) => {
    const args = Array.isArray(tc.input) ? tc.input.map(toCpp).join(", ") : toCpp(tc.input);
    const exp  = toCpp(tc.expected);
    return `
    try {
        auto _r${i} = ${fnName}(${args});
        if (to_string(_r${i}) == to_string(${exp})) {
            cout << "PASS:${i}" << endl;
        } else {
            cout << "FAIL:${i}:got=" << _r${i} << ":exp=${tc.expected}" << endl;
        }
    } catch (...) {
        cout << "FAIL:${i}:error=exception" << endl;
    }`;
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
  // If no test cases (World 1 output-based), just check it ran without error
  if (!testCases || testCases.length === 0) {
    return {
      passed: !stderr || stdout.length > 0,
      testResults: [],
      error: stderr || null,
      stdout,
    };
  }

  const lines = (stdout || "").split("\n").filter(Boolean);
  const testResults = testCases.map((tc, i) => {
    const line = lines.find(l =>
      l.startsWith(`PASS:${i}`) || l.startsWith(`FAIL:${i}`)
    );
    if (!line) return { label: tc.label || `Test ${i+1}`, pass: false, result: "No output" };
    if (line.startsWith(`PASS:${i}`)) return { label: tc.label || `Test ${i+1}`, pass: true, result: tc.expected };
    const got = line.split(":").find(p => p.startsWith("got="))?.replace("got=", "") || "Error";
    return { label: tc.label || `Test ${i+1}`, pass: false, result: got };
  });

  return {
    passed: testResults.every(t => t.pass),
    testResults,
    error: stderr || null,
    stdout,
  };
}

// ─── Smart Pseudocode Fallback ────────────────────────────────────────────────
// Only used if Piston is unreachable (rare). Smart per-concept checks.
export function validatePseudoCode(code, concept, lang) {
  const c = code.toLowerCase().replace(/\s+/g, " ");
  const lines = code.trim().split("\n").filter(l => l.trim().length > 0);
  if (lines.length < 1) return false;

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
    // World 1 — pure basics, no functions
    case "w1f1": return hasPrint && (c.includes("hello") || c.includes("world"));
    case "w1f2": return (c.includes("//") || c.includes("#") || c.includes("/*")) && hasPrint;
    case "w1f3": return c.includes("name") && c.includes("level") && hasPrint;
    case "w1f4": return c.includes("true") || c.includes("false") || c.includes("99.5") && hasPrint;
    case "w1f5": return c.includes("+") && c.includes("*") && c.includes("%") && hasPrint;
    case "w1f6": return (c.includes("+") || c.includes("f\"") || c.includes("`")) && hasPrint;
    case "w1f7": return hasIf && c.includes("60") && hasPrint;
    case "w1f8": return (c.includes("elif") || c.includes("else if")) && hasIf && hasPrint;
    case "w1f9": return (c.includes(">") || c.includes("<") || c.includes("==")) && hasPrint;
    case "w1f10": return (c.includes("&&") || c.includes(" and ") || c.includes("||") || c.includes(" or ")) && hasPrint;
    case "w1f11": return c.includes("axel") && (c.includes("&&") || c.includes(" and ")) && hasPrint;

    // World 2 — loops
    case "w2f1": return hasLoop && hasPrint;
    case "w2f2": return (c.includes("sum") || c.includes("+=")) && hasLoop && hasReturn;
    case "w2f3": return c.includes("%") && c.includes("2") && hasLoop && hasReturn;
    case "w2f4": return (c.includes("append") || c.includes("push")) && hasLoop;
    case "w2f5": return (c.includes("aeiou") || c.includes("vowel")) && hasLoop;
    case "w2f6": return c.includes("while") && (c.includes("append") || c.includes("push"));
    case "w2f7": return (c.includes("repeat") || c.includes("* i") || c.includes("*i")) && hasLoop;

    // World 3 — functions
    case "w3f1": return (c.includes("**") || c.includes("* n") || c.includes("*n")) && hasReturn;
    case "w3f4": return c.includes("%") && hasLoop && (c.includes("false") || c.includes("true") || hasReturn);
    case "w3f5": return c.includes("reverse") || c.includes("::-1") || c.includes("palindrome");
    case "w1f8": return c.includes("fizz") && c.includes("buzz") && c.includes("%");

    // World 4
    case "w4f1": return (c.includes("len(") || c.includes(".length")) && hasReturn;
    case "w4f3": return c.includes("%") && hasLoop && hasReturn;
    case "w4f5": return (c.includes("set") || c.includes("seen")) && hasReturn;
    case "w4f6": return (c.includes("{}") || c.includes("dict")) && hasLoop;
    case "w4f8": return (c.includes("sort") || c.includes("sorted")) && hasReturn;

    // World 5
    case "w5f2": return (c.includes("mid") || c.includes("middle")) && c.includes("low") && c.includes("high");
    case "w5f3": return c.includes("swap") && hasLoop;
    case "w5f4": return c.includes("fib") || (c.includes("n-1") && c.includes("n-2"));
    case "w5f5": return (c.includes("isinstance") || c.includes("isarray") || c.includes("flatten")) && hasLoop;

    // World 6
    case "w6f1": return (c.includes("try") || c.includes("raise") || c.includes("throw")) && c.includes("0");
    case "w6f2": return c.includes("map") || c.includes("filter") || c.includes("reduce");
    case "w6f3": return (c.includes("class") || c.includes("self") || c.includes("this")) && c.includes("balance");
    case "w6f4": return (c.includes("extends") || c.includes("super") || c.includes("class")) && c.includes("interest");
    case "w6f5": return (c.includes("emit") || c.includes("listen")) && c.includes("callback");

    default:
      return lines.length >= 2 && (hasOutput || hasPrint);
  }
}