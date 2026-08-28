import { isoDate, parseIsoDate } from "./date";

export const MOODS = [
  { id: "happy", emoji: "🙂", label: "Happy", score: 1 },
  { id: "neutral", emoji: "😐", label: "Neutral", score: 0 },
  { id: "sad", emoji: "🙁", label: "Sad", score: -1 },
];

const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m]));

export function moodOf(id) {
  return MOOD_BY_ID[id] || null;
}

export const RANGES = ["1D", "5D", "1M", "1Y"];

// Buckets journal entries by mood score for the mood chart. 1D buckets by
// entry (time of day); 5D/1M bucket by day (average that day's moods);
// 1Y buckets by month. `score: null` means nothing was logged in that slot,
// which reads differently on the chart than a logged neutral (score 0).
export function buildMoodBuckets(journal, range) {
  const rated = journal.filter((e) => e.mood && MOOD_BY_ID[e.mood]);
  const scoreOf = (e) => MOOD_BY_ID[e.mood].score;

  if (range === "1D") {
    const todayIso = isoDate();
    return rated
      .filter((e) => e.date === todayIso)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((e) => ({
        key: e.id,
        label: new Date(e.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        score: scoreOf(e),
        count: 1,
      }));
  }

  if (range === "5D" || range === "1M") {
    const days = range === "5D" ? 5 : 30;
    const now = new Date();
    const buckets = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const iso = isoDate(d);
      const dayEntries = rated.filter((e) => e.date === iso);
      const avg = dayEntries.length ? dayEntries.reduce((s, e) => s + scoreOf(e), 0) / dayEntries.length : null;
      buckets.push({ key: iso, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), score: avg, count: dayEntries.length });
    }
    return buckets;
  }

  // 1Y — last 12 months
  const now = new Date();
  const buckets = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEntries = rated.filter((e) => {
      const ed = parseIsoDate(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
    });
    const avg = monthEntries.length ? monthEntries.reduce((s, e) => s + scoreOf(e), 0) / monthEntries.length : null;
    buckets.push({ key: isoDate(d), label: d.toLocaleDateString("en-US", { month: "short" }), score: avg, count: monthEntries.length });
  }
  return buckets;
}

// Average mood score for journal entries whose `date` falls in isoDates —
// used to compare this week's mood against last week's on the Review page.
export function averageMoodForDates(journal, isoDates) {
  const dateSet = new Set(isoDates);
  const rated = journal.filter((e) => e.mood && MOOD_BY_ID[e.mood] && dateSet.has(e.date));
  if (rated.length === 0) return null;
  return rated.reduce((s, e) => s + MOOD_BY_ID[e.mood].score, 0) / rated.length;
}
