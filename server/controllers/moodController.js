const Mood = require('../models/Mood');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Record a new mood entry for the authenticated user.
 */
const createMood = async (req, res) => {
  const { mood, stressLevel, energyLevel, sleepHours } = req.body;

  const moodEntry = await Mood.create({
    user: req.user._id,
    mood,
    stressLevel,
    energyLevel,
    sleepHours,
  });

  res.status(201).json(
    new ApiResponse(201, { mood: moodEntry }, 'Mood recorded successfully')
  );
};

/**
 * Get today's most recent mood entry for the user.
 */
const getTodayMood = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const mood = await Mood.findOne({
    user: req.user._id,
    createdAt: { $gte: today, $lt: tomorrow },
  }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, { mood }, 'Today\'s mood fetched successfully')
  );
};

/**
 * Get mood history for the authenticated user.
 */
const getMoodHistory = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 30;

  const moods = await Mood.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json(
    new ApiResponse(200, { moods, count: moods.length }, 'Mood history fetched successfully')
  );
};

module.exports = { createMood, getTodayMood, getMoodHistory };
