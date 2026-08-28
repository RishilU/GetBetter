import { useMemo, useState } from "react";
import { searchAll } from "../lib/search";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}

function ResultRow({ icon, color, label, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: COLORS.bgElevated,
        border: `1px solid ${COLORS.borderSoft}`,
        borderRadius: 10,
        padding: "10px 14px",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 13, color, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: COLORS.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function SearchView({ data, onJumpToNode, onJumpToEntry }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchAll(data, query), [data, query]);
  const hasQuery = query.trim().length > 0;
  const totalResults = results.goals.length + results.resources.length + results.entries.length;

  return (
    <div style={{ maxWidth: 640 }}>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search goals, roadmap resources, journal entries..."
        style={{
          width: "100%",
          background: COLORS.bgElevated,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: FONT_DISPLAY,
          color: COLORS.textPrimary,
          outline: "none",
          marginBottom: 20,
        }}
      />

      {!hasQuery && <div style={{ color: COLORS.textMuted, fontSize: 13 }}>Start typing to search across your goals, roadmap resources, and journal.</div>}
      {hasQuery && totalResults === 0 && <div style={{ color: COLORS.textMuted, fontSize: 13 }}>No matches for "{query}".</div>}

      {results.goals.length > 0 && (
        <Section title="Goals">
          {results.goals.map((g) => (
            <ResultRow key={g.id} icon={g.areaIcon} color={g.areaColor} label={g.name} sub={g.areaName} onClick={() => onJumpToNode(g.id)} />
          ))}
        </Section>
      )}

      {results.resources.length > 0 && (
        <Section title="Roadmap &amp; Resources">
          {results.resources.map((r, i) => (
            <ResultRow key={i} icon={r.kind === "stage" ? "◆" : "🔗"} color={r.areaColor} label={r.label} sub={r.nodeName} onClick={() => onJumpToNode(r.nodeId)} />
          ))}
        </Section>
      )}

      {results.entries.length > 0 && (
        <Section title="Journal">
          {results.entries.map((e) => (
            <ResultRow key={e.id} icon="📝" color={COLORS.accent} label={e.snippet.slice(0, 80)} sub={e.date} onClick={() => onJumpToEntry(e.id)} />
          ))}
        </Section>
      )}
    </div>
  );
}
