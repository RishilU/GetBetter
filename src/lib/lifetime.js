// Numbers that only go up. Mostly derived straight from data that's already
// being kept (node.completed never gets pruned, stage.done accumulates) —
// the two exceptions are bestStreak and masteredAt, which exist specifically
// because the values they're based on (current streak, current stage state)
// can go backwards and these shouldn't.
export function computeLifetimeStats(data) {
  let totalHabitCompletions = 0;
  let totalStagesDone = 0;
  let bestStreakEver = 0;
  let bestStreakGoal = null;
  let goalsMastered = 0;
  const activeDates = new Set();
  const perGoal = [];

  for (const area of data.areas) {
    for (const node of area.nodes) {
      totalHabitCompletions += node.completed.length;

      for (const key of node.completed) {
        activeDates.add(key.slice(0, key.lastIndexOf("-")));
      }

      const stagesDone = (node.stages || []).filter((s) => s.done).length;
      totalStagesDone += stagesDone;

      const best = node.bestStreak || 0;
      if (best > bestStreakEver) {
        bestStreakEver = best;
        bestStreakGoal = node.name;
      }

      if (node.masteredAt) goalsMastered++;

      perGoal.push({
        name: node.name,
        areaIcon: area.icon,
        areaColor: area.color,
        completions: node.completed.length,
        bestStreak: best,
        mastered: !!node.masteredAt,
      });
    }
  }

  for (const entry of data.journal) {
    activeDates.add(entry.date);
  }

  const totalGoals = data.areas.reduce((s, a) => s + a.nodes.length, 0);

  return {
    totalHabitCompletions,
    totalStagesDone,
    bestStreakEver,
    bestStreakGoal,
    goalsMastered,
    totalGoals,
    daysActive: activeDates.size,
    totalJournalEntries: data.journal.length,
    perGoal: perGoal.sort((a, b) => b.completions - a.completions),
  };
}
