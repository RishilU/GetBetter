import { computeLifetimeStats } from "../lib/lifetime";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function Card({ children, style }) {
  return <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 18, marginBottom: 16, ...style }}>{children}</div>;
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ flex: "1 1 120px" }}>
      <div style={{ fontSize: 10.5, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function ProgressView({ data }) {
  const stats = computeLifetimeStats(data);

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 16 }}>
        Everything on this page only goes up. Missing a day, unchecking a stage, none of that takes anything away from here.
      </div>

      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Stat label="Habits completed" value={stats.totalHabitCompletions.toLocaleString()} sub="all time" />
          <Stat label="Days active" value={stats.daysActive.toLocaleString()} sub="any activity logged" />
          <Stat label="Best streak ever" value={`🔥 ${stats.bestStreakEver}d`} sub={stats.bestStreakGoal || "—"} />
          <Stat label="Goals mastered" value={`${stats.goalsMastered}/${stats.totalGoals}`} sub="full roadmap completed" />
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Stat label="Roadmap stages done" value={stats.totalStagesDone.toLocaleString()} sub="currently checked off" />
          <Stat label="Journal entries" value={stats.totalJournalEntries.toLocaleString()} sub="written" />
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 12 }}>By Goal</div>
        {stats.perGoal.length === 0 ? (
          <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>Nothing tracked yet.</div>
        ) : (
          stats.perGoal.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 13 }}>
              <span style={{ fontSize: 13, width: 20 }}>{g.areaIcon}</span>
              <span style={{ flex: 1, color: COLORS.textSecondary, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {g.name}
                {g.mastered && <span title="Roadmap fully completed at least once" style={{ marginLeft: 6, color: COLORS.accent }}>★</span>}
              </span>
              <span style={{ color: g.areaColor, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{g.completions} done</span>
              <span style={{ color: COLORS.textMuted, fontSize: 11.5, flexShrink: 0, width: 60, textAlign: "right" }}>🔥 {g.bestStreak}d best</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
