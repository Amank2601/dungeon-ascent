const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  puzzleId: { type: String, required: true },
  code: { type: String, required: true },
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now },
});

const floorSchema = new mongoose.Schema({
  floor: { type: Number, required: true },           // e.g. -5, -4 ... -1
  monsterDefeated: { type: Boolean, default: false },
  defeatedAt: { type: Date },
  attempts: [attemptSchema],
});

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentFloor: { type: Number, default: -5 },
    gameCompleted: { type: Boolean, default: false },
    gameCompletedAt: { type: Date },
    totalAttempts: { type: Number, default: 0 },
    floors: [floorSchema],
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Helper: get or create a floor record
progressSchema.methods.getFloor = function (floorNum) {
  let f = this.floors.find((f) => f.floor === floorNum);
  if (!f) {
    this.floors.push({ floor: floorNum });
    f = this.floors[this.floors.length - 1];
  }
  return f;
};

module.exports = mongoose.model("Progress", progressSchema);
