const ACTIVITY_TIME_ZONE = 'Asia/Kolkata';

export function claimQuestCompletion(UserProgressModel, {
  userId,
  planId,
  nodeId,
  nodeTitle,
  roadmapName,
  completedAt = new Date(),
}) {
  return UserProgressModel.findOneAndUpdate(
    {
      userId,
      planId,
      completedNodeIds: { $ne: nodeId },
    },
    {
      $addToSet: { completedNodeIds: nodeId },
      $push: {
        completionEvents: { nodeId, nodeTitle, roadmapName, completedAt },
      },
    },
    { new: true },
  );
}

export function claimPassingAssessmentCompletion(UserProgressModel, input, passed) {
  return passed ? claimQuestCompletion(UserProgressModel, input) : Promise.resolve(null);
}

export function getActivityDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ACTIVITY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isActivityDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function summarizeCompletions(progressRecords) {
  const counts = new Map();
  for (const record of progressRecords) {
    for (const event of record.completionEvents || []) {
      const date = getActivityDate(event.completedAt);
      counts.set(date, (counts.get(date) || 0) + 1);
    }
  }
  return [...counts]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCompletionDetails(progressRecords, date) {
  return progressRecords.flatMap((record) =>
    (record.completionEvents || [])
      .filter((event) => getActivityDate(event.completedAt) === date)
      .map(({ nodeId, nodeTitle, roadmapName, completedAt }) => ({
        nodeId,
        nodeTitle,
        roadmapName,
        completedAt,
      })),
  );
}
