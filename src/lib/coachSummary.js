import { lastNDays, countDoneToday } from "./date";
import { moodOf } from "./mood";

// Compresses the whole dataset into a compact, information-dense summary for
// the coach prompt — real numbers, not raw records, so it stays cheap and
// the model isn't drowning in noise.
export function buildCoachSummary(data) {
  const thisWeek = lastNDays(7, 0);
  const lines = [];

  lines.push("GOALS & ROADMAPS:");
  for (const area of data.areas) {
    for (const node of area.nodes) {
      const stagesTotal = (node.stages || []).length;
      const stagesDone = (node.stages || []).filter((s) => s.done).length;
      const habitSlots = node.habits.length * thisWeek.length;
      const habitDone = thisWeek.reduce((sum, d) => sum + countDoneToday(node, d), 0);
      const pctThisWeek = habitSlots > 0 ? Math.round((habitDone / habitSlots) * 100) : 0;
      lines.push(`- [${area.name}] "${node.name}": streak ${node.streak}d, roadmap ${stagesDone}/${stagesTotal} stages done, ${pctThisWeek}% habit completion this week.`);
    }
  }

  lines.push("\nRECENT JOURNAL ENTRIES (most recent first):");
  const recent = [...data.journal].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
  if (recent.length === 0) lines.push("(none yet)");
  for (const e of recent) {
    const mood = moodOf(e.mood);
    lines.push(`- [${e.date}${mood ? `, mood: ${mood.label}` : ""}] ${e.text.slice(0, 200)}`);
  }

  return lines.join("\n");
}
