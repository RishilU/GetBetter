import { useEffect, useState } from "react";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function InsightCard({ text, suggestion }) {
  return (
    <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ fontSize: 13.5, color: COLORS.textPrimary, lineHeight: 1.55 }}>{text}</div>
      {suggestion && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.borderSoft}` }}>
          <span style={{ color: COLORS.accent, flexShrink: 0, fontSize: 12 }}>→</span>
          <span style={{ fontSize: 12.5, color: COLORS.textSecondary }}>{suggestion}</span>
        </div>
      )}
    </div>
  );
}

export default function CoachView({ coachInsights, hasTodaysBatch, onGenerate, onDismissBatch }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasTodaysBatch) {
      setLoading(true);
      onGenerate().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5 }}>
          Reads your actual data — completion rates, streaks, journal, mood — and tells you what it notices. Not a hype machine.
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            color: COLORS.textSecondary,
            padding: "7px 14px",
            cursor: loading ? "default" : "pointer",
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
            marginLeft: 12,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Thinking..." : "Get a fresh read"}
        </button>
      </div>

      {loading && coachInsights.length === 0 && (
        <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "40px 0" }}>Looking at your data...</div>
      )}

      {!loading && coachInsights.length === 0 && (
        <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "40px 0" }}>
          Not enough data yet to say anything useful — log a few more days first.
        </div>
      )}

      {coachInsights.map((batch) => (
        <div key={batch.id} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: COLORS.textMuted }}>
              {new Date(batch.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            <span onClick={() => onDismissBatch(batch.id)} style={{ cursor: "pointer", fontSize: 12, color: COLORS.textMuted }} title="Dismiss">
              ×
            </span>
          </div>
          {batch.insights.map((ins, i) => (
            <InsightCard key={i} text={ins.text} suggestion={ins.suggestion} />
          ))}
        </div>
      ))}
    </div>
  );
}
