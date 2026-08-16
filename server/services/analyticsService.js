const StudySession = require('../models/StudySession');
const Mood = require('../models/Mood');
const Task = require('../models/Task');

/**
 * Get start and end of a day range.
 */
const getDayBounds = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Calculate total study minutes from sessions.
 */
const getSessionDurationMinutes = (session) => {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  return Math.max(0, (end - start) / (1000 * 60));
};

/**
 * Get weekly analytics for the last 7 days.
 */
const getWeeklyAnalytics = async (userId) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const sessions = await StudySession.find({
    user: userId,
    startTime: { $gte: startDate, $lte: endDate },
  }).populate('task', 'subject title');

  const moods = await Mood.find({
    user: userId,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ createdAt: 1 });

  const dailyHours = {};
  const subjectTime = {};
  let totalFocusScore = 0;
  let focusCount = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dailyHours[d.toISOString().split('T')[0]] = 0;
  }

  sessions.forEach((session) => {
    const minutes = getSessionDurationMinutes(session);
    const dayKey = new Date(session.startTime).toISOString().split('T')[0];

    if (dailyHours[dayKey] !== undefined) {
      dailyHours[dayKey] += minutes / 60;
    }

    const subject = session.task?.subject || 'Unknown';
    subjectTime[subject] = (subjectTime[subject] || 0) + minutes;

    if (session.focusScore != null) {
      totalFocusScore += session.focusScore;
      focusCount += 1;
    }
  });

  const totalStudyHours = Object.values(dailyHours).reduce((sum, h) => sum + h, 0);
  const averageFocusScore = focusCount > 0 ? Math.round(totalFocusScore / focusCount) : 0;

  const moodTrend = moods.map((m) => ({
    date: m.createdAt,
    mood: m.mood,
    stressLevel: m.stressLevel,
    energyLevel: m.energyLevel,
  }));

  return {
    period: 'weekly',
    totalStudyHours: Math.round(totalStudyHours * 100) / 100,
    dailyStudyHours: dailyHours,
    averageFocusScore,
    moodTrend,
    subjectWiseTime: subjectTime,
  };
};

/**
 * Get monthly analytics for the last 30 days.
 */
const getMonthlyAnalytics = async (userId) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  const sessions = await StudySession.find({
    user: userId,
    startTime: { $gte: startDate, $lte: endDate },
  }).populate('task', 'subject');

  const moods = await Mood.find({
    user: userId,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ createdAt: 1 });

  let totalMinutes = 0;
  const subjectTime = {};
  let totalFocusScore = 0;
  let focusCount = 0;

  sessions.forEach((session) => {
    const minutes = getSessionDurationMinutes(session);
    totalMinutes += minutes;

    const subject = session.task?.subject || 'Unknown';
    subjectTime[subject] = (subjectTime[subject] || 0) + minutes;

    if (session.focusScore != null) {
      totalFocusScore += session.focusScore;
      focusCount += 1;
    }
  });

  const moodCounts = moods.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});

  return {
    period: 'monthly',
    totalStudyHours: Math.round((totalMinutes / 60) * 100) / 100,
    averageDailyHours: Math.round((totalMinutes / 60 / 30) * 100) / 100,
    averageFocusScore: focusCount > 0 ? Math.round(totalFocusScore / focusCount) : 0,
    moodDistribution: moodCounts,
    subjectWiseTime: subjectTime,
    totalSessions: sessions.length,
  };
};

/**
 * Calculate daily study streak — consecutive days with at least one session.
 */
const getDailyStreak = async (userId) => {
  const sessions = await StudySession.find({ user: userId })
    .sort({ startTime: -1 })
    .select('startTime');

  if (sessions.length === 0) return 0;

  const studyDays = new Set(
    sessions.map((s) => new Date(s.startTime).toISOString().split('T')[0])
  );

  let streak = 0;
  const checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  const todayKey = checkDate.toISOString().split('T')[0];
  const yesterday = new Date(checkDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  if (!studyDays.has(todayKey) && !studyDays.has(yesterdayKey)) {
    return 0;
  }

  if (!studyDays.has(todayKey)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = checkDate.toISOString().split('T')[0];
    if (!studyDays.has(key)) break;
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};

/**
 * Get overall progress metrics including completion percentage and streak.
 */
const getProgressAnalytics = async (userId) => {
  const [totalTasks, completedTasks, streak] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, completed: true }),
    getDailyStreak(userId),
  ]);

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weekly = await getWeeklyAnalytics(userId);

  return {
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    completionPercentage,
    dailyStreak: streak,
    weeklyStudyHours: weekly.totalStudyHours,
    averageFocusScore: weekly.averageFocusScore,
    moodTrend: weekly.moodTrend,
    subjectWiseTime: weekly.subjectWiseTime,
  };
};

module.exports = {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getProgressAnalytics,
  getDailyStreak,
};
