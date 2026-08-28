import { isoDate, countDoneToday } from "./date";
import { MOODS } from "./mood";

const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m]));

function overallPctForDate(areas, dateStr) {
  let done = 0;
  let total = 0;
  for (const area of areas) {
    for (const node of area.nodes) {
      total += node.habits.length;
      done += countDoneToday(node, dateStr);
    }
  }
  return total > 0 ? (done / total) * 100 : null;
}

function avgMoodByDate(journal) {
  const byDate = {};
  for (const e of journal) {
    if (!e.mood || !MOOD_BY_ID[e.mood]) continue;
    (byDate[e.date] ||= []).push(MOOD_BY_ID[e.mood].score);
  }
  const out = {};
  for (const [iso, scores] of Object.entries(byDate)) {
    out[iso] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return out;
}

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// Habit completion on days you logged a good mood vs a bad mood.
export function moodCompletionCorrelation(areas, journal) {
  const moodByDate = avgMoodByDate(journal);
  const upPcts = [];
  const downPcts = [];

  for (const [iso, score] of Object.entries(moodByDate)) {
    const dateStr = new Date(`${iso}T00:00:00`).toDateString();
    const pct = overallPctForDate(areas, dateStr);
    if (pct === null) continue;
    if (score > 0.2) upPcts.push(pct);
    else if (score < -0.2) downPcts.push(pct);
  }

  if (upPcts.length < 2 || downPcts.length < 2) return null;
  return { upAvg: Math.round(avg(upPcts)), downAvg: Math.round(avg(downPcts)), upDays: upPcts.length, downDays: downPcts.length };
}

// Habit completion in weeks you journaled a lot vs weeks you barely did.
export function journalingCompletionCorrelation(areas, journal, weeks = 8) {
  const now = new Date();
  const weekly = [];

  for (let w = 0; w < weeks; w++) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - w * 7 - i);
      return d;
    });
    const isoSet = new Set(days.map((d) => isoDate(d)));
    const entryCount = journal.filter((e) => isoSet.has(e.date)).length;
    const pcts = days.map((d) => overallPctForDate(areas, d.toDateString())).filter((p) => p !== null);
    if (pcts.length === 0) continue;
    weekly.push({ entryCount, avgPct: avg(pcts) });
  }

  const heavy = weekly.filter((w) => w.entryCount >= 3).map((w) => w.avgPct);
  const light = weekly.filter((w) => w.entryCount < 3).map((w) => w.avgPct);
  if (heavy.length < 1 || light.length < 1) return null;
  return { heavyAvg: Math.round(avg(heavy)), lightAvg: Math.round(avg(light)) };
}

// Which life area's completion swings most in step with logged mood.
export function bestAreaForMood(areas, journal) {
  const moodByDate = avgMoodByDate(journal);
  if (Object.keys(moodByDate).length < 4) return null;

  let best = null;
  for (const area of areas) {
    const pairs = [];
    for (const [iso, mood] of Object.entries(moodByDate)) {
      const dateStr = new Date(`${iso}T00:00:00`).toDateString();
      let done = 0;
      let total = 0;
      for (const node of area.nodes) {
        total += node.habits.length;
        done += countDoneToday(node, dateStr);
      }
      if (total === 0) continue;
      pairs.push({ pct: (done / total) * 100, mood });
    }
    if (pairs.length < 4) continue;

    const sorted = [...pairs].sort((a, b) => b.pct - a.pct);
    const half = Math.floor(sorted.length / 2) || 1;
    const diff = avg(sorted.slice(0, half).map((p) => p.mood)) - avg(sorted.slice(-half).map((p) => p.mood));
    if (!best || diff > best.diff) best = { area, diff };
  }

  return best && best.diff > 0.15 ? { areaName: best.area.name, areaIcon: best.area.icon, areaColor: best.area.color } : null;
}
