const { getMoodProfile } = require('./moodEngine');

/**
 * Scoring weights — modular and easy to adjust.
 */
const WEIGHTS = {
  priority: { High: 30, Medium: 20, Low: 10 },
  deadlineMax: 40,
  difficultyFitMax: 25,
  incompleteBonus: 5,
};

/**
 * Calculate urgency score based on days until deadline.
 * Closer deadlines receive higher scores.
 */
const getDeadlineScore = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.max(0, (deadlineDate - now) / msPerDay);

  if (daysRemaining <= 0) return WEIGHTS.deadlineMax;
  if (daysRemaining <= 1) return 35;
  if (daysRemaining <= 3) return 28;
  if (daysRemaining <= 7) return 20;
  if (daysRemaining <= 14) return 12;
  return 5;
};

/**
 * Score how well a task difficulty matches the current mood profile.
 */
const getDifficultyFitScore = (difficulty, moodProfile) => {
  const preferred = moodProfile.preferredDifficulty || [];
  const index = preferred.indexOf(difficulty);

  if (index === -1) return 0;

  const rankBonus = preferred.length - index;
  return Math.round((rankBonus / preferred.length) * WEIGHTS.difficultyFitMax);
};

/**
 * Build a human-readable reason string for the ranking.
 */
const buildReason = (task, scores) => {
  return `Priority: ${scores.priority}, Deadline: ${scores.deadline}, Mood fit: ${scores.difficultyFit}`;
};

/**
 * Rank tasks by composite score based on priority, deadline, difficulty, and mood.
 * @param {Array} tasks - List of task documents
 * @param {string} mood - Current user mood
 * @returns {Array} Sorted list of { task, score, reason, breakdown }
 */
const rankTasks = (tasks, mood) => {
  const moodProfile = getMoodProfile(mood);
  const activeTasks = tasks.filter((task) => !task.completed);

  const ranked = activeTasks.map((task) => {
    const priorityScore = WEIGHTS.priority[task.priority] || WEIGHTS.priority.Medium;
    const deadlineScore = getDeadlineScore(task.deadline);
    const difficultyFitScore = getDifficultyFitScore(task.difficulty, moodProfile);
    const incompleteBonus = task.completed ? 0 : WEIGHTS.incompleteBonus;

    const breakdown = {
      priority: priorityScore,
      deadline: deadlineScore,
      difficultyFit: difficultyFitScore,
      incompleteBonus,
    };

    const score = priorityScore + deadlineScore + difficultyFitScore + incompleteBonus;

    return {
      task,
      score,
      reason: buildReason(task, breakdown),
      breakdown,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  if (moodProfile.taskOrder === 'hardFirst') {
    ranked.sort((a, b) => {
      const difficultyOrder = { Hard: 3, Medium: 2, Easy: 1 };
      const diffCompare =
        (difficultyOrder[b.task.difficulty] || 0) - (difficultyOrder[a.task.difficulty] || 0);
      return diffCompare !== 0 ? diffCompare : b.score - a.score;
    });
  }

  if (moodProfile.taskOrder === 'easyFirst') {
    ranked.sort((a, b) => {
      const difficultyOrder = { Easy: 3, Medium: 2, Hard: 1 };
      const diffCompare =
        (difficultyOrder[b.task.difficulty] || 0) - (difficultyOrder[a.task.difficulty] || 0);
      return diffCompare !== 0 ? diffCompare : b.score - a.score;
    });
  }

  return ranked;
};

module.exports = { rankTasks, WEIGHTS, getDeadlineScore, getDifficultyFitScore };
