import { useEffect, useRef, useState } from "react";
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceX, forceY } from "d3-force";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

// The Obsidian-style "web": goals are always shown, journal entries join once
// the AI has found at least one connection for them. Positions come from a
// live physics simulation (d3-force) that settles on load.
export default function GraphView({ areas, journal }) {
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 520 });
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: Math.max(420, height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const goalNodes = areas.flatMap((a) =>
      a.nodes.map((n) => ({ id: n.id, kind: "goal", label: n.name, color: a.color, description: n.description, r: 9 }))
    );
    const entryNodes = journal
      .filter((e) => (e.links || []).length > 0)
      .map((e) => {
        const area = e.areaId ? areas.find((a) => a.id === e.areaId) : null;
        return { id: e.id, kind: "journal", label: e.text.slice(0, 28) + (e.text.length > 28 ? "…" : ""), color: area?.color || COLORS.accent, text: e.text, r: 6 };
      });

    const nodeIds = new Set([...goalNodes, ...entryNodes].map((n) => n.id));
    const graphLinks = journal.flatMap((e) =>
      (e.links || [])
        .filter((l) => nodeIds.has(l.targetId) && nodeIds.has(e.id))
        .map((l) => ({ source: e.id, target: l.targetId, reason: l.reason }))
    );

    const allNodes = [...goalNodes, ...entryNodes];

    const sim = forceSimulation(allNodes)
      .force("charge", forceManyBody().strength(-160))
      .force("link", forceLink(graphLinks).id((d) => d.id).distance(80).strength(0.5))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      .force("x", forceX(size.w / 2).strength(0.03))
      .force("y", forceY(size.h / 2).strength(0.03))
      .force("collide", forceCollide().radius((d) => d.r + 14));

    sim.on("tick", () => {
      setNodes([...sim.nodes()]);
    });
    setLinks(graphLinks);
    simRef.current = sim;

    return () => sim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, journal, size.w, size.h]);

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 140px)", minHeight: 420 }}>
      <div ref={containerRef} style={{ flex: 1, background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, overflow: "hidden", position: "relative" }}>
        {nodes.length === 0 ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: 24 }}>
            Your goals will show up here. Write a few journal entries and their AI-found connections will start weaving the web.
          </div>
        ) : (
          <svg width={size.w} height={size.h}>
            {links.map((l, i) => {
              const s = nodeById[l.source.id || l.source];
              const t = nodeById[l.target.id || l.target];
              if (!s || !t) return null;
              return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={COLORS.border} strokeWidth={1.4} />;
            })}
            {nodes.map((n) => (
              <g key={n.id} onClick={() => setSelected(n)} style={{ cursor: "pointer" }}>
                <circle cx={n.x} cy={n.y} r={selected?.id === n.id ? n.r + 3 : n.r} fill={n.kind === "goal" ? n.color : COLORS.bgElevated} stroke={n.color} strokeWidth={n.kind === "goal" ? 0 : 2} />
                <text x={n.x} y={n.y - n.r - 6} textAnchor="middle" fontSize={10.5} fontFamily={FONT_DISPLAY} fill={COLORS.textSecondary}>
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {selected && (
        <div style={{ width: 260, flexShrink: 0, background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: selected.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{selected.kind === "goal" ? "Goal" : "Journal entry"}</span>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 6 }}>{selected.label}</div>
          <div style={{ fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 1.5 }}>{selected.description || selected.text}</div>
        </div>
      )}
    </div>
  );
}
