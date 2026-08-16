/**
 * Mood Engine — converts mood into study preferences and recommendations.
 */

const MOOD_PROFILES = {
  Happy: {
    sessionDuration: 90,
    preferredDifficulty: ['Hard', 'Medium', 'Easy'],
    taskOrder: 'hardFirst',
    breakFrequency: 15,
    breakDuration: 10,
    recommendations: [
      'Tackle challenging tasks while motivation is high.',
      'Use 90-minute deep work sessions.',
      'Take a short break after each session.',
    ],
  },
  Focused: {
    sessionDuration: 120,
    preferredDifficulty: ['Hard', 'Medium'],
    taskOrder: 'longSessions',
    breakFrequency: 20,
    breakDuration: 10,
    recommendations: [
      'Ideal time for long coding or problem-solving sessions.',
      'Minimize distractions and batch similar tasks.',
      'Keep breaks brief to maintain flow.',
    ],
  },
  Neutral: {
    sessionDuration: 60,
    preferredDifficulty: ['Medium', 'Easy', 'Hard'],
    taskOrder: 'balanced',
    breakFrequency: 12,
    breakDuration: 10,
    recommendations: [
      'Maintain a balanced mix of task difficulties.',
      'Use standard 60-minute study blocks.',
      'Review progress at each break.',
    ],
  },
  Tired: {
    sessionDuration: 30,
    preferredDifficulty: ['Easy', 'Medium'],
    taskOrder: 'easyFirst',
    breakFrequency: 8,
    breakDuration: 15,
    recommendations: [
      'Focus on easy tasks to build momentum.',
      'Take longer, more frequent breaks.',
      'Avoid starting new difficult topics.',
    ],
  },
  Stressed: {
    sessionDuration: 30,
    preferredDifficulty: ['Easy', 'Medium'],
    taskOrder: 'revision',
    breakFrequency: 5,
    breakDuration: 5,
    recommendations: [
      'Use 30-minute Pomodoro sessions.',
      'Prioritize revision over new material.',
      'Take breathing breaks between sessions.',
    ],
  },
  Sleepy: {
    sessionDuration: 0,
    preferredDifficulty: [],
    taskOrder: 'none',
    breakFrequency: 0,
    breakDuration: 0,
    recommendations: [
      'Consider a 20–30 minute power nap before studying.',
      'Avoid difficult coding or complex problem-solving.',
      'If you must study, stick to light revision only.',
    ],
  },
};

/**
 * Get study preferences profile for a given mood.
 * @param {string} mood - One of the supported mood values
 * @returns {object} Mood profile with session settings and recommendations
 */
const getMoodProfile = (mood) => {
  const profile = MOOD_PROFILES[mood];

  if (!profile) {
    return MOOD_PROFILES.Neutral;
  }

  return {
    mood,
    ...profile,
  };
};

module.exports = { getMoodProfile, MOOD_PROFILES };
