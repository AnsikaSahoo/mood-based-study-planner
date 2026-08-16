const Task = require('../models/Task');
const Mood = require('../models/Mood');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { rankTasks } = require('../services/recommendationEngine');
const { generateSchedule, getTodayPlan, deleteTodayPlan } = require('../services/plannerEngine');
const { getMoodProfile } = require('../services/moodEngine');

/**
 * @desc    Generate today's study plan based on mood and available tasks
 * @route   POST /api/planner/generate
 * @access  Private
 */
const generatePlan = async (req, res) => {
  const { availableStudyHours, mood: moodOverride } = req.body;

  const hours = availableStudyHours ?? req.user.preferredStudyHours ?? 4;

  let mood = moodOverride;

  if (!mood) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMood = await Mood.findOne({
      user: req.user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    // Fallback to 'Focused' if user hasn't logged mood yet
    mood = todayMood ? todayMood.mood : 'Focused';
  }

  const tasks = await Task.find({ user: req.user._id, completed: false });
  const rankedTasks = rankTasks(tasks, mood);
  const moodProfile = getMoodProfile(mood);

  const schedule = await generateSchedule({
    mood,
    rankedTasks,
    availableStudyHours: hours,
    userId: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        mood,
        moodProfile,
        rankedTasks: rankedTasks.map((r) => ({
          task: r.task,
          score: r.score,
          reason: r.reason,
        })),
        schedule,
      },
      'Study plan generated successfully'
    )
  );
};

/**
 * @desc    Get today's persisted study plan
 * @route   GET /api/planner/today
 * @access  Private
 */
const getTodayPlanHandler = async (req, res) => {
  const plan = await getTodayPlan(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, { plan }, "Today's study plan fetched successfully")
  );
};

/**
 * @desc    Regenerate/delete today's study plan
 * @route   DELETE /api/planner/regenerate
 * @access  Private
 */
const regeneratePlanHandler = async (req, res) => {
  await deleteTodayPlan(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, null, "Today's study plan cleared. You can now generate a new plan.")
  );
};

module.exports = {
  generatePlan,
  getTodayPlan: getTodayPlanHandler,
  regeneratePlan: regeneratePlanHandler,
};
