const mongoose = require('mongoose');

const MOOD_VALUES = ['Happy', 'Focused', 'Neutral', 'Tired', 'Stressed', 'Sleepy'];

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: MOOD_VALUES,
      required: [true, 'Mood is required'],
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Stress level is required'],
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Energy level is required'],
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      required: [true, 'Sleep hours is required'],
    },
  },
  {
    timestamps: true,
  }
);

moodSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema);
module.exports.MOOD_VALUES = MOOD_VALUES;
