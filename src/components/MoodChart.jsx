import { useState } from "react";
import { RANGES, MOODS, buildMoodBuckets } from "../lib/mood";
import { COLORS, FONT_BODY } from "../lib/theme";

const CHART_H = 180;
const BASELINE_Y = CHART_H / 2;
const MAX_BAR_HALF = BASELINE_Y - 24;
const BAR_RADIUS = 4;
const GAP = 2;
const MAX_BAR_W = 24;

// A bar with the far end rounded and the baseline end square, per the
// diverging-bar mark spec — rounds top corners when it grows up, bottom
// corners when it grows down.
function barPath(x, w, yBaseline, yEnd) {
  const r = Math.min(BAR_RADIUS, Math.abs(yEnd - yBaseline), w / 2);
  if (r <= 0.5) return `M${x},${yBaseline} L${x + w},${yBaseline} L${x + w},${yEnd} L${x},${yEnd} Z`;
  if (yEnd < yBaseline) {
    // grows upward — round the top
    return `M${x},${yBaseline} L${x},${yEnd + r} Q${x},${yEnd} ${x + r},${yEnd} L${x + w - r},${yEnd} Q${x + w},${yEnd} ${x + w},${yEnd + r} L${x + w},${yBaseline} Z`;
  }
  // grows downward — round the bottom
  return `M${x},${yBaseline} L${x + w},${yBaseline} L${x + w},${yEnd - r} Q${x + w},${yEnd} ${x + w - r},${yEnd} L${x + r},${yEnd} Q${x},${yEnd} ${x},${yEnd - r} Z`;
}

export default function MoodChart({ journal }) {
  const [range, setRange] = useState("5D");
  const [hovered, setHovered] = useState(null);

  const buckets = buildMoodBuckets(journal, range);
  const hasAny = buckets.some((b) => b.count > 0);

  const width = Math.max(320, buckets.length * (MAX_BAR_W + GAP * 4));
  const slot = width / buckets.length;
  const barW = Math.min(MAX_BAR_W, slot - GAP * 2);

  const active = hovered ?? [...buckets].reverse().find((b) => b.count > 0) ?? null;

  return (
    <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 16, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                background: range === r ? COLORS.bgElevatedHover : "transparent",
                border: "none",
                borderRadius: 7,
                color: range === r ? COLORS.textPrimary : COLORS.textMuted,
                fontWeight: range === r ? 600 : 500,
                fontSize: 12.5,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {MOODS.map((m) => (
            <span key={m.id} style={{ fontSize: 11.5, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: m.score > 0 ? COLORS.moodUp : m.score < 0 ? COLORS.moodDown : COLORS.moodFlat,
                  display: "inline-block",
                }}
              />
              {m.emoji} {m.label}
            </span>
          ))}
        </div>
      </div>

      {!hasAny ? (
        <div style={{ height: CHART_H, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          No moods logged in this range yet — pick one when you add a journal entry.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <svg width={width} height={CHART_H} style={{ display: "block", fontFamily: FONT_BODY }}>
            <line x1={0} y1={BASELINE_Y} x2={width} y2={BASELINE_Y} stroke={COLORS.border} strokeWidth={1} />
            {buckets.map((b, i) => {
              const x = i * slot + (slot - barW) / 2;
              const isHover = hovered?.key === b.key;
              if (b.count === 0) {
                return <circle key={b.key} cx={x + barW / 2} cy={BASELINE_Y} r={1.5} fill={COLORS.border} />;
              }
              const magnitude = b.score === 0 ? 4 : Math.abs(b.score) * MAX_BAR_HALF;
              const yEnd = b.score >= 0 ? BASELINE_Y - magnitude : BASELINE_Y + magnitude;
              const fill = b.score > 0 ? COLORS.moodUp : b.score < 0 ? COLORS.moodDown : COLORS.moodFlat;
              return (
                <path
                  key={b.key}
                  d={barPath(x, barW, BASELINE_Y, yEnd)}
                  fill={fill}
                  opacity={isHover ? 1 : 0.88}
                  tabIndex={0}
                  role="img"
                  aria-label={`${b.label}: ${b.count} entr${b.count === 1 ? "y" : "ies"}`}
                  style={{ cursor: "pointer", outline: "none" }}
                  onMouseEnter={() => setHovered(b)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(b)}
                  onBlur={() => setHovered(null)}
                />
              );
            })}
          </svg>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: COLORS.textSecondary, minHeight: 16 }}>
        {active && active.count > 0 && (
          <>
            <strong style={{ color: COLORS.textPrimary }}>{active.label}</strong> — {active.count} entr{active.count === 1 ? "y" : "ies"}, avg mood{" "}
            {active.score > 0.33 ? "🙂" : active.score < -0.33 ? "🙁" : "😐"}
          </>
        )}
      </div>
    </div>
  );
}
