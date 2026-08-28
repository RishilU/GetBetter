const LEVEL_TITLES = [
  "Novice",
  "Beginner",
  "Apprentice",
  "Practitioner",
  "Adept",
  "Skilled",
  "Proficient",
  "Expert",
  "Master",
  "Elite",
];

// A goal's level is derived, not stored: roadmap stages finished plus a
// bonus for the best streak this goal has ever hit — bestStreak, not the
// current streak, so missing a day doesn't knock your level backwards.
// Uncapped: past "Elite" the title just holds while the number keeps climbing.
export function computeNodeLevel(node) {
  const stagesDone = (node.stages || []).filter((s) => s.done).length;
  const streakBonus = Math.floor((node.bestStreak || 0) / 3);
  const level = 1 + stagesDone + streakBonus;
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
  return { level, title };
}
