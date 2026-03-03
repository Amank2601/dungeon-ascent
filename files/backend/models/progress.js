// backend/models/Progress.js
const mongoose = require("mongoose");

// Mirrors the frontend progress state exactly:
// {
//   worlds: {
//     w1: { completedFloors: ["w1f1", "w1f2"], bossDefeated: false },
//     w2: { completedFloors: [], bossDefeated: false },
//   },
//   totalXP: 600,
//   introDone: true,
//   selectedLanguage: "python"
// }

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one progress document per user
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        worlds: {},
        totalXP: 0,
        introDone: false,
        selectedLanguage: "javascript",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);