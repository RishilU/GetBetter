import { lastNDays, lastNIsoDays, habitCompletionForRange } from "../lib/date";
import { averageMoodForDates } from "../lib/mood";
import { moodCompletionCorrelation, journalingCompletionCorrelation, bestAreaForMood } from "../lib/insights";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function DeltaTag({ current, previous, suffix = "pt" }) {
  if (previous === null || current === null) return null;
  const diff = Math.round(current - previous);
  if (diff === 0) return <span style={{ fontSize: 12, color: COLORS.textMuted }}>flat vs last week</span>;
  const up = diff > 0;
  return (
    <span style={{ fontSize: 12, color: up ? COLORS.moodUp : COLORS.moodDown, fontWeight: 600 }}>
      {up ? "▲" : "▼"} {Math.abs(diff)}
      {suffix} vs last week
    </span>
  );
}

function Card({ children }) {
  return <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 12 }}>{children}</div>;
}

export default function ReviewView({ areas, journal }) {
  const thisWeek = lastNDays(7, 0);
  const lastWeek = lastNDays(7, 7);
  const thisWeekIso = lastNIsoDays(7, 0);
  const lastWeekIso = lastNIsoDays(7, 7);

  const overallThisWeek = habitCompletionForRange(areas, thisWeek);
  const overallLastWeek = habitCompletionForRange(areas, lastWeek);

  const moodThisWeek = averageMoodForDates(journal, thisWeekIso);
  const moodLastWeek = averageMoodForDates(journal, lastWeekIso);
  const moodEmoji = (score) => (score === null ? "—" : score > 0.33 ? "🙂" : score < -0.33 ? "🙁" : "😐");

  const entriesThisWeek = journal.filter((e) => thisWeekIso.includes(e.date)).length;
  const entriesLastWeek = journal.filter((e) => lastWeekIso.includes(e.date)).length;

  const recentStages = areas
    .flatMap((a) => a.nodes.flatMap((n) => (n.stages || []).filter((s) => s.done && s.completedAt).map((s) => ({ ...s, area: a, node: n }))))
    .filter((s) => new Date(s.completedAt) >= new Date(Date.now() - 7 * 86400000))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const moodPattern = moodCompletionCorrelation(areas, journal);
  const journalPattern = journalingCompletionCorrelation(areas, journal);
  const areaPattern = bestAreaForMood(areas, journal);
  const patterns = [];
  if (moodPattern) {
    patterns.push(
      `You complete ${moodPattern.upAvg}% of habits on days you log a good mood, vs ${moodPattern.downAvg}% on low-mood days.`
    );
  }
  if (journalPattern) {
    patterns.push(
      `Weeks you journal 3+ times, you complete ${journalPattern.heavyAvg}% of habits — vs ${journalPattern.lightAvg}% in lighter weeks.`
    );
  }
  if (areaPattern) {
    patterns.push(`${areaPattern.areaIcon} ${areaPattern.areaName} tracks closest with your mood — when it's going well, you tend to feel better.`);
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <Card>
        <SectionLabel>This Week</SectionLabel>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 600, color: COLORS.textPrimary }}>{overallThisWeek.pct}%</span>
          <DeltaTag current={overallThisWeek.pct} previous={overallLastWeek.pct} suffix="pt" />
        </div>
        <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>
          {overallThisWeek.done}/{overallThisWeek.total} habits completed across all goals, last 7 days
        </div>
      </Card>

      <Card>
        <SectionLabel>By Area, Last 7 Days</SectionLabel>
        {areas.map((area) => {
          const stat = habitCompletionForRange([area], thisWeek);
          return (
            <div key={area.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, width: 22 }}>{area.icon}</span>
              <span style={{ flex: 1, fontSize: 13, color: COLORS.textSecondary }}>{area.name}</span>
              <div style={{ width: 120, background: COLORS.borderSoft, borderRadius: 99, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${stat.pct}%`, background: area.color, height: "100%" }} />
              </div>
              <span style={{ fontSize: 12, color: area.color, fontWeight: 600, width: 34, textAlign: "right" }}>{stat.pct}%</span>
            </div>
          );
        })}
      </Card>

      <Card>
        <SectionLabel>Mood &amp; Journal</SectionLabel>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>avg mood this week</div>
            <div style={{ fontSize: 22 }}>{moodEmoji(moodThisWeek)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>entries logged</div>
            <div style={{ fontSize: 18, color: COLORS.textPrimary, fontWeight: 600 }}>
              {entriesThisWeek} <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 400 }}>vs {entriesLastWeek} last week</span>
            </div>
          </div>
        </div>
      </Card>

      {patterns.length > 0 && (
        <Card>
          <SectionLabel>Patterns</SectionLabel>
          {patterns.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < patterns.length - 1 ? 10 : 0, fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5 }}>
              <span style={{ color: COLORS.accent, flexShrink: 0 }}>◆</span>
              <span>{p}</span>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <SectionLabel>Roadmap Progress, Last 7 Days</SectionLabel>
        {recentStages.length === 0 ? (
          <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>No roadmap stages checked off this week yet.</div>
        ) : (
          recentStages.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12.5 }}>
              <span>{s.area.icon}</span>
              <span style={{ color: COLORS.textSecondary }}>
                <strong style={{ color: COLORS.textPrimary }}>{s.node.name}</strong> — {s.title}
              </span>
              <span style={{ marginLeft: "auto", color: COLORS.textMuted, fontSize: 11 }}>
                {new Date(s.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
