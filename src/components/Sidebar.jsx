import { today, countDoneToday } from "../lib/date";
import { computeLifetimeStats } from "../lib/lifetime";
import { COLORS, FONT_DISPLAY } from "../lib/theme";
import NavDropdown from "./NavDropdown";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "journal", label: "Journal" },
  { id: "coach", label: "Coach" },
  { id: "progress", label: "Progress" },
  { id: "search", label: "Search" },
  { id: "graph", label: "Graph" },
  { id: "review", label: "Review" },
  { id: "settings", label: "Settings" },
];

export default function Sidebar({ view, onChangeView, data, onJumpToArea, mobile }) {
  const todayStr = today();
  const areas = data.areas;

  if (mobile) {
    return (
      <div style={{ background: COLORS.bgSidebar, borderBottom: `1px solid ${COLORS.borderSoft}`, padding: "12px 14px" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10 }}>GetBetter</div>
        <nav style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
          {NAV_ITEMS.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                style={{
                  flexShrink: 0,
                  background: active ? COLORS.bgElevated : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: active ? COLORS.textPrimary : COLORS.textSecondary,
                  fontWeight: active ? 600 : 500,
                  fontSize: 13,
                  padding: "7px 12px",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  const lifetime = computeLifetimeStats(data);

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        background: COLORS.bgSidebar,
        borderRight: `1px solid ${COLORS.borderSoft}`,
        minHeight: "100vh",
        padding: "22px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, padding: "0 8px", marginBottom: 22 }}>
        GetBetter
      </div>

      <NavDropdown items={NAV_ITEMS} view={view} onChangeView={onChangeView} />

      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.textMuted, padding: "0 10px", marginBottom: 8 }}>
        Areas
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {areas.map((area) => {
          const tot = area.nodes.reduce((s, n) => s + n.habits.length, 0);
          const done = area.nodes.reduce((s, n) => s + countDoneToday(n, todayStr), 0);
          const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
          return (
            <button
              key={area.id}
              onClick={() => onJumpToArea(area.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "none",
                borderRadius: 8,
                padding: "7px 10px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 13, opacity: 0.9 }}>{area.icon}</span>
              <span style={{ flex: 1, fontSize: 12.5, color: COLORS.textSecondary }}>{area.name}</span>
              <span style={{ fontSize: 11, color: area.color, fontWeight: 600 }}>{pct}%</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onChangeView("progress")}
        title="Lifetime progress — never resets"
        style={{
          marginTop: "auto",
          background: COLORS.bgElevated,
          border: `1px solid ${COLORS.borderSoft}`,
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Lifetime</div>
        <div style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 600 }}>{lifetime.totalHabitCompletions.toLocaleString()} completions</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
          🔥 {lifetime.bestStreakEver}d best · {lifetime.goalsMastered} mastered
        </div>
      </button>

      <div style={{ marginTop: 12, paddingTop: 8, textAlign: "center", fontSize: 11, color: COLORS.textMuted }}>
        Made by: Rishil Uppaluru
      </div>
    </div>
  );
}
