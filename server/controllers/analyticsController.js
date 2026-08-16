const ApiResponse = require('../utils/ApiResponse');
const {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getProgressAnalytics,
} = require('../services/analyticsService');

/**
 * @desc    Get weekly study analytics
 * @route   GET /api/analytics/weekly
 * @access  Private
 */
const getWeekly = async (req, res) => {
  const analytics = await getWeeklyAnalytics(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, { analytics }, 'Weekly analytics fetched successfully')
  );
};

/**
 * @desc    Get monthly study analytics
 * @route   GET /api/analytics/monthly
 * @access  Private
 */
const getMonthly = async (req, res) => {
  const analytics = await getMonthlyAnalytics(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, { analytics }, 'Monthly analytics fetched successfully')
  );
};

/**
 * @desc    Get overall progress metrics
 * @route   GET /api/analytics/progress
 * @access  Private
 */
const getProgress = async (req, res) => {
  const analytics = await getProgressAnalytics(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, { analytics }, 'Progress analytics fetched successfully')
  );
};

/**
 * @desc    Get comprehensive dashboard summary
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
const getDashboard = async (req, res) => {
  const [weekly, monthly, progress] = await Promise.all([
    getWeeklyAnalytics(req.user._id),
    getMonthlyAnalytics(req.user._id),
    getProgressAnalytics(req.user._id),
  ]);

  const dashboard = {
    totalStudyHours: monthly.totalStudyHours,
    weeklyStudyHours: weekly.totalStudyHours,
    monthlyStudyHours: monthly.totalStudyHours,
    subjectWiseStudyTime: weekly.subjectWiseTime,
    averageFocusScore: weekly.averageFocusScore,
    moodTrends: weekly.moodTrend,
    taskCompletionPercentage: progress.completionPercentage,
    currentStudyStreak: progress.dailyStreak,
    totalTasks: progress.totalTasks,
    completedTasks: progress.completedTasks,
  };

  return res.status(200).json(
    new ApiResponse(200, { dashboard }, 'Dashboard summary fetched successfully')
  );
};

module.exports = { getWeekly, getMonthly, getProgress, getDashboard };
