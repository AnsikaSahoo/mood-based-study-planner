const StudyPlan = require('../models/StudyPlan');
const { getMoodProfile } = require('./moodEngine');

/**
 * Format minutes from midnight into HH:MM string.
 */
const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Generate today's study schedule based on mood profile and ranked tasks.
 * @param {object} params
 * @param {string} params.mood - Current mood
 * @param {Array} params.rankedTasks - Output from recommendationEngine
 * @param {number} params.availableStudyHours - Hours available today
 * @param {string} params.userId - User id for persistence
 * @param {number} [params.startHour=9] - Schedule start hour (24h)
 * @returns {object} Timetable with slots, studyBlocks, breakBlocks and summary
 */
const generateSchedule = async ({
  mood,
  rankedTasks,
  availableStudyHours,
  userId,
  startHour = 9,
}) => {
  const moodProfile = getMoodProfile(mood);
  const availableMinutes = availableStudyHours * 60;

  if (mood === 'Sleepy' || moodProfile.sessionDuration === 0) {
    const sleepyPlan = {
      mood,
      recommendations: moodProfile.recommendations,
      slots: [],
      studyBlocks: [],
      breakBlocks: [],
      summary: {
        totalStudyTime: 0,
        breakTime: 0,
        totalBreakTime: 0,
        tasksScheduled: 0,
        message: 'Rest recommended. Consider a nap before studying.',
      },
    };

    await persistPlan(userId, mood, sleepyPlan, []);
    return sleepyPlan;
  }

  const slots = [];
  const studyBlocks = [];
  const breakBlocks = [];
  const scheduledTaskIds = [];
  let currentMinute = startHour * 60;
  let totalStudyTime = 0;
  let breakTime = 0;
  let remainingMinutes = availableMinutes;

  for (const ranked of rankedTasks) {
    if (remainingMinutes <= 0) break;

    const task = ranked.task;
    let taskRemaining = task.estimatedTime;

    while (taskRemaining > 0 && remainingMinutes > 0) {
      const sessionDuration = Math.min(
        moodProfile.sessionDuration,
        taskRemaining,
        remainingMinutes
      );

      if (sessionDuration <= 0) break;

      const sessionStart = currentMinute;
      const sessionEnd = currentMinute + sessionDuration;

      const studyBlock = {
        type: 'study',
        task: task._id,
        taskTitle: task.title,
        subject: task.subject,
        startTime: formatTime(sessionStart),
        endTime: formatTime(sessionEnd),
        duration: sessionDuration,
      };

      slots.push(studyBlock);
      studyBlocks.push({
        task: task._id,
        title: task.title,
        startTime: formatTime(sessionStart),
        endTime: formatTime(sessionEnd),
        duration: sessionDuration,
      });

      if (!scheduledTaskIds.find((id) => id.toString() === task._id.toString())) {
        scheduledTaskIds.push(task._id);
      }

      currentMinute = sessionEnd;
      totalStudyTime += sessionDuration;
      taskRemaining -= sessionDuration;
      remainingMinutes -= sessionDuration;

      if (taskRemaining > 0 && remainingMinutes > 0) {
        const breakDuration = Math.min(
          moodProfile.breakDuration,
          remainingMinutes
        );

        if (breakDuration > 0) {
          const breakBlock = {
            type: 'break',
            title: 'Short Break',
            startTime: formatTime(currentMinute),
            endTime: formatTime(currentMinute + breakDuration),
            duration: breakDuration,
          };

          slots.push(breakBlock);
          breakBlocks.push({
            title: 'Short Break',
            startTime: formatTime(currentMinute),
            endTime: formatTime(currentMinute + breakDuration),
            duration: breakDuration,
          });

          currentMinute += breakDuration;
          breakTime += breakDuration;
          remainingMinutes -= breakDuration;
        }
      }
    }

    if (remainingMinutes > 0 && moodProfile.breakFrequency > 0) {
      const breakDuration = Math.min(moodProfile.breakDuration, remainingMinutes);

      if (breakDuration > 0 && slots.length > 0 && slots[slots.length - 1].type === 'study') {
        const breakBlock = {
          type: 'break',
          title: 'Break',
          startTime: formatTime(currentMinute),
          endTime: formatTime(currentMinute + breakDuration),
          duration: breakDuration,
        };

        slots.push(breakBlock);
        breakBlocks.push({
          title: 'Break',
          startTime: formatTime(currentMinute),
          endTime: formatTime(currentMinute + breakDuration),
          duration: breakDuration,
        });

        currentMinute += breakDuration;
        breakTime += breakDuration;
        remainingMinutes -= breakDuration;
      }
    }
  }

  const plan = {
    mood,
    recommendations: moodProfile.recommendations,
    slots,
    studyBlocks,
    breakBlocks,
    summary: {
      totalStudyTime,
      breakTime,
      totalBreakTime: breakTime,
      tasksScheduled: scheduledTaskIds.length,
      availableMinutes,
      message: `Scheduled ${scheduledTaskIds.length} task(s) within ${availableStudyHours} hour(s).`,
    },
  };

  await persistPlan(userId, mood, plan, scheduledTaskIds);

  return plan;
};

/**
 * Save or update today's study plan for the user.
 */
const persistPlan = async (userId, mood, plan, taskIds) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await StudyPlan.findOneAndUpdate(
    { user: userId, date: today },
    {
      user: userId,
      date: today,
      tasks: taskIds,
      slots: plan.slots,
      studyBlocks: plan.studyBlocks,
      breakBlocks: plan.breakBlocks,
      totalStudyTime: plan.summary.totalStudyTime,
      totalBreakTime: plan.summary.breakTime,
      breakTime: plan.summary.breakTime,
      mood,
      recommendations: plan.recommendations,
    },
    { upsert: true, new: true }
  );
};

/**
 * Retrieve today's persisted plan for a user.
 */
const getTodayPlan = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return StudyPlan.findOne({ user: userId, date: today }).populate(
    'tasks',
    'title subject priority difficulty estimatedTime deadline'
  );
};

/**
 * Delete/clear today's study plan for a user.
 */
const deleteTodayPlan = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return StudyPlan.findOneAndDelete({ user: userId, date: today });
};

module.exports = {
  generateSchedule,
  getTodayPlan,
  deleteTodayPlan,
  formatTime,
};
