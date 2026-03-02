// src/services/api.js
// Central API client for Dungeon Ascent backend

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("dungeon_token");
}

function setToken(token) {
  localStorage.setItem("dungeon_token", token);
}

function clearToken() {
  localStorage.removeItem("dungeon_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  async register(username, email, password) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    setToken(data.token);
    return data;
  },

  async login(email, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async me() {
    return request("/auth/me");
  },

  logout() {
    clearToken();
  },

  isLoggedIn() {
    return !!getToken();
  },
};

// ─── Progress ─────────────────────────────────────────────────────────────────

export const progress = {
  async get() {
    return request("/progress");
  },

  async advanceFloor(floorDefeated) {
    return request("/progress/floor", {
      method: "PATCH",
      body: JSON.stringify({ floorDefeated }),
    });
  },

  async logAttempt(puzzleId, code, passed) {
    return request("/progress/attempt", {
      method: "POST",
      body: JSON.stringify({ puzzleId, code, passed }),
    });
  },

  async reset() {
    return request("/progress/reset", { method: "DELETE" });
  },
};

// ─── Puzzles ─────────────────────────────────────────────────────────────────

export const puzzles = {
  async getAll() {
    return request("/puzzles");
  },

  async getByFloor(floor) {
    return request(`/puzzles/floor/${floor}`);
  },

  async getById(id) {
    return request(`/puzzles/${id}`);
  },
};

// ─── Validate ─────────────────────────────────────────────────────────────────

export const validate = {
  /**
   * Submit user code to be validated server-side.
   * @param {string} puzzleId - e.g. "p1"
   * @param {string} code - the full function code as a string
   * @returns {{ passed: boolean, testResults: Array, message: string }}
   */
  async submit(puzzleId, code) {
    return request("/validate", {
      method: "POST",
      body: JSON.stringify({ puzzleId, code }),
    });
  },
};

export default { auth, progress, puzzles, validate };
