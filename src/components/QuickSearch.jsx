import { useState } from "react";
import { searchAll } from "../lib/search";
import { COLORS, FONT_BODY } from "../lib/theme";

const MAX_PER_SECTION = 5;

export default function QuickSearch({ data, onJumpToNode, onJumpToEntry }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const trimmed = query.trim();
  const results = trimmed ? searchAll(data, trimmed) : { goals: [], resources: [], entries: [] };
  const items = [
    ...results.goals.slice(0, MAX_PER_SECTION).map((g) => ({ kind: "goal", nodeId: g.id, label: g.name, sub: g.areaName, color: g.areaColor, icon: g.areaIcon })),
    ...results.resources.slice(0, MAX_PER_SECTION).map((r) => ({ kind: "resource", nodeId: r.nodeId, label: r.label, sub: r.nodeName, color: r.areaColor, icon: r.kind === "stage" ? "◆" : "🔗" })),
    ...results.entries.slice(0, MAX_PER_SECTION).map((e) => ({ kind: "entry", entryId: e.id, label: e.snippet.slice(0, 60), sub: e.date, color: COLORS.accent, icon: "📝" })),
  ];

  const go = (item) => {
    setQuery("");
    setOpen(false);
    if (item.kind === "entry") onJumpToEntry(item.entryId);
    else onJumpToNode(item.nodeId);
  };

  return (
    <div style={{ position: "relative", flex: 1, maxWidth: 340, minWidth: 160 }}>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setQuery(""); setOpen(false); e.currentTarget.blur(); }
        }}
        placeholder="Search..."
        style={{
          width: "100%",
          background: COLORS.bgElevated,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: 13,
          fontFamily: FONT_BODY,
          color: COLORS.textPrimary,
          outline: "none",
        }}
      />
      {open && trimmed && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            boxShadow: "0 12px 28px rgba(20,17,14,0.16)",
            maxHeight: 320,
            overflowY: "auto",
            zIndex: 50,
            padding: 6,
          }}
        >
          {items.length === 0 ? (
            <div style={{ padding: "10px 8px", fontSize: 12.5, color: COLORS.textMuted }}>No matches.</div>
          ) : (
            items.map((item, i) => (
              <div
                key={i}
                onMouseDown={(e) => { e.preventDefault(); go(item); }}
                style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                <span style={{ fontSize: 12, color: item.color, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: COLORS.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 10.5, color: COLORS.textMuted }}>{item.sub}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
