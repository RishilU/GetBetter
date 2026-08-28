import { useState } from "react";
import JournalEntry from "./JournalEntry";
import MoodChart from "./MoodChart";
import VoiceButton from "./VoiceButton";
import { MOODS } from "../lib/mood";
import { isoDate } from "../lib/date";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

export default function JournalView({ entries, areas, onAdd, onEdit, onDelete, onSetMood, onSetDate }) {
  const [text, setText] = useState("");
  const [areaId, setAreaId] = useState("");
  const [mood, setMood] = useState(null);
  const [date, setDate] = useState(() => isoDate());

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), areaId || null, mood, date);
    setText("");
    setAreaId("");
    setMood(null);
    setDate(isoDate());
  };

  const areaById = Object.fromEntries(areas.map((a) => [a.id, a]));
  const entryById = Object.fromEntries(entries.map((e) => [e.id, e]));
  const goalById = Object.fromEntries(areas.flatMap((a) => a.nodes.map((n) => [n.id, { ...n, areaColor: a.color, areaIcon: a.icon }])));

  const resolveLink = (targetId) => {
    if (goalById[targetId]) {
      const g = goalById[targetId];
      return { label: g.name, color: g.areaColor, icon: g.areaIcon };
    }
    if (entryById[targetId]) {
      const e = entryById[targetId];
      const area = e.areaId ? areaById[e.areaId] : null;
      return { label: e.text.slice(0, 32) + (e.text.length > 32 ? "…" : ""), color: area?.color || COLORS.accent, icon: "📝" };
    }
    return null;
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ padding: "8px 4px 100px", maxWidth: 640 }}>
      <MoodChart journal={entries} />

      <div style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 16, marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind today?"
            rows={4}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: COLORS.textPrimary,
              fontFamily: FONT_DISPLAY,
              fontSize: 15,
              lineHeight: 1.5,
              outline: "none",
              resize: "vertical",
            }}
          />
          <VoiceButton onTranscript={(t) => setText((prev) => (prev ? `${prev} ${t}` : t))} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, marginBottom: 10 }}>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(mood === m.id ? null : m.id)}
              title={m.label}
              style={{
                background: mood === m.id ? COLORS.bgElevatedHover : "transparent",
                border: `1px solid ${mood === m.id ? COLORS.border : "transparent"}`,
                borderRadius: 8,
                fontSize: 17,
                padding: "3px 8px",
                cursor: "pointer",
                opacity: mood === null || mood === m.id ? 1 : 0.4,
              }}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="date"
              value={date}
              max={isoDate()}
              onChange={(e) => setDate(e.target.value)}
              style={{
                background: COLORS.bgElevatedHover,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.textSecondary,
                fontSize: 12,
                padding: "5px 8px",
                outline: "none",
              }}
            />
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              style={{
                background: COLORS.bgElevatedHover,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.textSecondary,
                fontSize: 12,
                padding: "5px 8px",
                outline: "none",
              }}
            >
              <option value="">No tag</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.icon} {a.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={submit}
            style={{ background: COLORS.accent, border: "none", borderRadius: 8, color: COLORS.onAccent, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
          >
            Add entry
          </button>
        </div>
      </div>

      {sortedEntries.length === 0 ? (
        <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "40px 0" }}>Nothing here yet. Write something.</div>
      ) : (
        sortedEntries.map((entry) => (
          <JournalEntry
            key={entry.id}
            entry={entry}
            area={entry.areaId ? areaById[entry.areaId] : null}
            resolveLink={resolveLink}
            onEdit={onEdit}
            onDelete={onDelete}
            onSetMood={onSetMood}
            onSetDate={onSetDate}
          />
        ))
      )}
    </div>
  );
}
