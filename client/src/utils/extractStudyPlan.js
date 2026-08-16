/**
 * Safely extract study plan data from backend API response payloads.
 */
export const extractStudyPlan = (res) => {
  if (!res) return null;

  // 1. Unwrap Axios response.data if present
  let val = res.data !== undefined ? res.data : res;
  if (!val) return null;

  // 2. Extract nested plan/schedule object if wrapped
  if (val.plan && typeof val.plan === 'object') {
    val = val.plan;
  }
  if (val.schedule && typeof val.schedule === 'object' && !Array.isArray(val.schedule)) {
    val = val.schedule;
  }

  // 3. Extract items array (check slots, studyBlocks, or schedule)
  const rawItems = Array.isArray(val?.slots)
    ? val.slots
    : Array.isArray(val?.schedule)
    ? val.schedule
    : Array.isArray(val?.studyBlocks)
    ? val.studyBlocks
    : Array.isArray(val)
    ? val
    : [];

  const summaryMsg =
    typeof val?.summary === 'string'
      ? val.summary
      : val?.summary?.message
      ? val.summary.message
      : 'Custom AI study schedule calculated for your current workload.';

  return {
    mood: val.mood || 'Focused',
    summary: summaryMsg,
    hasItems: rawItems.length > 0,
    schedule: rawItems.map((item) => {
      const isBreak =
        item.type === 'break' ||
        item.type === 'Break' ||
        item.taskTitle?.toLowerCase().includes('break') ||
        item.title?.toLowerCase().includes('break');

      const title = item.taskTitle || item.title || item.task?.title || (isBreak ? 'Short Break' : 'Study Task');
      const timeSlot = item.timeSlot || (item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : `${item.duration || item.durationMinutes || 30} mins`);
      const duration = item.durationMinutes || item.duration || 30;

      return {
        timeSlot,
        taskTitle: title,
        durationMinutes: duration,
        type: isBreak ? 'Break' : 'Task',
      };
    }),
  };
};
