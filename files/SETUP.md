# 🏰 Dungeon Ascent: Code Arena — Setup Guide

## Project Structure

```
dungeon-ascent/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js           ← User schema + password hashing
│   │   ├── Progress.js       ← Player progress tracking
│   │   └── Puzzle.js         ← Puzzle schema + seed data
│   ├── middleware/
│   │   └── auth.js           ← JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           ← /api/auth (register, login, me)
│   │   ├── progress.js       ← /api/progress (get, advance, reset)
│   │   ├── puzzles.js        ← /api/puzzles (list, by floor)
│   │   └── validate.js       ← /api/validate (sandboxed code execution)
│   ├── server.js             ← Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                 ← React.js app
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js        ← API client (auth, progress, validate)
│   │   ├── App.js            ← Main game component (DungeonAscent.jsx)
│   │   └── index.js
│   ├── package.json
│   └── .env.example
```

---

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | (comes with Node.js) |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| Git | any | https://git-scm.com |

---

## Step 1 — Install MongoDB

### Option A: Local MongoDB (Recommended for development)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
- Download the installer from https://www.mongodb.com/try/download/community
- Run the `.msi` installer and check "Install MongoDB as a Service"
- MongoDB will start automatically

**Verify MongoDB is running:**
```bash
mongosh
# You should see a MongoDB shell. Type `exit` to quit.
```

### Option B: MongoDB Atlas (Free Cloud Database)
1. Go to https://cloud.mongodb.com and create a free account
2. Create a free M0 cluster
3. Click "Connect" → "Drivers" → copy the connection string
4. Replace `MONGO_URI` in your `.env` with that string

---

## Step 2 — Clone & Setup Backend

```bash
# Navigate into the backend folder
cd dungeon-ascent/backend

# Install all dependencies
npm install

# Copy environment config
cp .env.example .env

# Open .env and edit if needed (the defaults work for local dev)
# MONGO_URI=mongodb://localhost:27017/dungeon_ascent
# JWT_SECRET=change_this_to_a_long_random_secret
# PORT=5000
# CLIENT_URL=http://localhost:3000
```

> ⚠️ **Important:** Change `JWT_SECRET` to a long random string in production!
> You can generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

---

## Step 3 — Run the Backend

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode
npm start
```

**Expected output:**
```
✅ MongoDB connected
🌱 Puzzles seeded successfully   ← only shows first time
🚀 Server running at http://localhost:5000
```

**Test it's working:**
```bash
curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}
```

---

## Step 4 — Setup Frontend

```bash
# Navigate to the frontend folder
cd dungeon-ascent/frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# .env should contain:
# REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 5 — Add the Game Component

Copy `DungeonAscent.jsx` into your frontend:

```bash
cp DungeonAscent.jsx dungeon-ascent/frontend/src/App.js
```

Then update `src/index.js` to:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## Step 6 — Run the Frontend

```bash
cd dungeon-ascent/frontend
npm start
```

**Expected output:**
```
Compiled successfully!
Local: http://localhost:3000
```

Your browser will open automatically at `http://localhost:3000` 🎮

---

## Step 7 — Connect Frontend to Backend API

In your `App.js` / `DungeonAscent.jsx`, import the API service and wire it up:

```javascript
import { auth, progress, validate } from './services/api';

// Example: Login
const handleLogin = async () => {
  const data = await auth.login(email, password);
  console.log("Logged in:", data.user);
};

// Example: Validate puzzle code via backend
const handleSubmit = async (puzzleId, code) => {
  const result = await validate.submit(puzzleId, code);
  if (result.passed) {
    await progress.advanceFloor(currentFloor);
    // move to next floor
  }
};

// Example: Load saved progress on startup
const loadProgress = async () => {
  if (auth.isLoggedIn()) {
    const { progress: p } = await progress.get();
    setCurrentFloor(p.currentFloor);
  }
};
```

---

## API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{username, email, password}` | Create account |
| POST | `/api/auth/login` | `{email, password}` | Login |
| GET | `/api/auth/me` | — | Get current user (JWT required) |

### Progress *(JWT required)*
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/progress` | — | Get player progress |
| PATCH | `/api/progress/floor` | `{floorDefeated}` | Advance to next floor |
| POST | `/api/progress/attempt` | `{puzzleId, code, passed}` | Log attempt |
| DELETE | `/api/progress/reset` | — | Reset to Floor -5 |

### Puzzles *(JWT required)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/puzzles` | All puzzles |
| GET | `/api/puzzles/floor/-5` | Puzzle for Floor -5 |
| GET | `/api/puzzles/p1` | Puzzle by ID |

### Validate *(JWT required)*
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/validate` | `{puzzleId, code}` | Run & validate user code (sandboxed) |

---

## Running Both Servers Together

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd dungeon-ascent/backend && npm run dev

# Terminal 2 — Frontend
cd dungeon-ascent/frontend && npm start
```

Or install `concurrently` in the root and run both with one command:

```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoServerError: connection refused` | Make sure MongoDB is running: `brew services start mongodb-community` |
| `CORS error` in browser | Check `CLIENT_URL` in backend `.env` matches your React port |
| `jwt malformed` error | Clear localStorage in browser dev tools and log in again |
| `vm2` not found | Run `npm install` inside the `backend/` folder |
| Port 3000 already in use | React will ask to use 3001 — say yes, update `CLIENT_URL` in backend `.env` |
| Port 5000 already in use | Change `PORT=5001` in backend `.env` and update frontend `.env` |

---

## Tech Stack Summary

```
Frontend          Backend           Database
─────────         ─────────         ─────────
React 18          Express 4         MongoDB 7
React Hooks       Node.js 18        Mongoose 8
Fetch API         JWT Auth          
CSS-in-JS         vm2 (sandbox)
                  bcryptjs
                  express-rate-limit
```
