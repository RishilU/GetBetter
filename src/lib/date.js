export const today = () => new Date().toDateString();

// YYYY-MM-DD in local time — used as the editable "logged date" on journal entries.
export function isoDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// A journal entry's display date: exact time for today/yesterday (from the
// immutable createdAt), otherwise just the day — since a backdated entry has
// no real "time logged" to show.
export function formatEntryDate(entry) {
  const todayIso = isoDate();
  const yesterdayIso = isoDate(new Date(Date.now() - 86400000));

  if (entry.date === todayIso) {
    const time = new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `Today, ${time}`;
  }
  if (entry.date === yesterdayIso) return "Yesterday";

  const d = parseIsoDate(entry.date);
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts);
}

// toDateString()-format days for the last n days, offset back by offsetDays —
// e.g. lastNDays(7, 7) is "the 7 days before this week", for week-over-week deltas.
export function lastNDays(n, offsetDays = 0) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays - i);
    days.push(d.toDateString());
  }
  return days;
}

// Same idea in YYYY-MM-DD, for comparing against journal entries' `date` field.
export function lastNIsoDays(n, offsetDays = 0) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays - i);
    days.push(isoDate(d));
  }
  return days;
}

export function habitKey(dateStr, idx) {
  return `${dateStr}-${idx}`;
}

export function isHabitDoneOn(node, dateStr, idx) {
  return node.completed.includes(habitKey(dateStr, idx));
}

export function countDoneToday(node, dateStr) {
  return node.habits.filter((_, i) => isHabitDoneOn(node, dateStr, i)).length;
}

export function formatTimestamp(iso) {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (d.toDateString() === now.toDateString()) return `Today, ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

// Habit completion across a set of areas (or one area) for a list of days —
// used to compare "this week" vs "last week" on the Review page.
export function habitCompletionForRange(areas, dateStrs) {
  let done = 0;
  let total = 0;
  for (const area of areas) {
    for (const node of area.nodes) {
      total += node.habits.length * dateStrs.length;
      for (const dateStr of dateStrs) done += countDoneToday(node, dateStr);
    }
  }
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// Call once all of a node's habits are done for the day to bump its streak.
// bestStreak only ever goes up, even when the current streak later resets —
// that's the number that belongs in anything meant to feel permanent.
export function bumpStreak(node, dateStr) {
  if (node.lastChecked) {
    const last = new Date(node.lastChecked);
    const diffDays = (new Date(dateStr) - last) / 86400000;
    node.streak = diffDays <= 1.5 ? node.streak + 1 : 1;
  } else {
    node.streak = 1;
  }
  node.lastChecked = dateStr;
  node.bestStreak = Math.max(node.bestStreak || 0, node.streak);
}
