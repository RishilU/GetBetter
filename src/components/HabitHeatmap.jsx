import { countDoneToday } from "../lib/date";
import { COLORS } from "../lib/theme";

const WEEKS = 12;
const CELL = 10;
const GAP = 3;

function opacityForPct(pct) {
  if (pct <= 0) return 0;
  if (pct < 0.34) return 0.3;
  if (pct < 0.67) return 0.55;
  if (pct < 1) return 0.78;
  return 1;
}

// A GitHub-style contribution grid: 12 weeks of daily habit completion for
// one goal, oldest day top-left, today bottom-right, filled column by column.
export default function HabitHeatmap({ node, areaColor }) {
  const totalHabits = node.habits.length;
  if (totalHabits === 0) return null;

  const days = WEEKS * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    cells.push({ date: d, pct: countDoneToday(node, d.toDateString()) / totalHabits });
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
        Last {WEEKS} Weeks
      </div>
      <div style={{ display: "grid", gridTemplateRows: `repeat(7, ${CELL}px)`, gridAutoFlow: "column", gap: GAP, width: "fit-content" }}>
        {cells.map((cell, i) => (
          <div
            key={i}
            title={`${cell.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${Math.round(cell.pct * 100)}%`}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 2,
              background: cell.pct > 0 ? areaColor : COLORS.borderSoft,
              opacity: cell.pct > 0 ? opacityForPct(cell.pct) : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
