import ProgressRing from "./ProgressRing";
import QuickSearch from "./QuickSearch";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

export default function Header({ title, overallPct, doneToday, totalHabits, showRing, data, onJumpToNode, onJumpToEntry, theme, onToggleTheme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, color: COLORS.textPrimary }}>{title}</div>
        <div style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 2 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, justifyContent: "flex-end" }}>
        <QuickSearch data={data} onJumpToNode={onJumpToNode} onJumpToEntry={onJumpToEntry} />

        <button
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {showRing && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>today</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 600 }}>
                {doneToday}/{totalHabits}
              </div>
            </div>
            <div style={{ position: "relative", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ProgressRing pct={overallPct} size={52} color={COLORS.accent} />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, lineHeight: 1 }}>{overallPct}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
