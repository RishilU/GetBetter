import { useState } from "react";
import EditableLinkText from "./EditableLinkText";
import ConfirmDialog from "./ConfirmDialog";
import { formatEntryDate, isoDate } from "../lib/date";
import { MOODS, moodOf } from "../lib/mood";
import { COLORS } from "../lib/theme";

function DateBadge({ entry, onSetDate }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <input
        type="date"
        autoFocus
        defaultValue={entry.date}
        max={isoDate()}
        onBlur={(e) => { onSetDate(entry.id, e.target.value); setEditing(false); }}
        onChange={(e) => { onSetDate(entry.id, e.target.value); setEditing(false); }}
        style={{ fontSize: 11.5, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "1px 4px", color: COLORS.textSecondary, background: COLORS.bgElevatedHover }}
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} title="Click to change the date" style={{ fontSize: 11.5, color: COLORS.textMuted, cursor: "pointer" }}>
      {formatEntryDate(entry)}
    </span>
  );
}

function MoodPicker({ entry, onSetMood }) {
  const [open, setOpen] = useState(false);
  const current = moodOf(entry.mood);

  if (!open) {
    return (
      <span onClick={() => setOpen(true)} title="Click to set mood" style={{ cursor: "pointer", fontSize: 13.5, opacity: current ? 1 : 0.35 }}>
        {current ? current.emoji : "🙂"}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {MOODS.map((m) => (
        <span
          key={m.id}
          onClick={() => { onSetMood(entry.id, entry.mood === m.id ? null : m.id); setOpen(false); }}
          style={{ cursor: "pointer", fontSize: 13.5, opacity: entry.mood === m.id ? 1 : 0.4 }}
        >
          {m.emoji}
        </span>
      ))}
    </span>
  );
}

export default function JournalEntry({ entry, area, resolveLink, onEdit, onDelete, onSetMood, onSetDate }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const links = (entry.links || []).map((l) => ({ ...l, meta: resolveLink(l.targetId) })).filter((l) => l.meta);

  return (
    <div id={`entry-${entry.id}`} style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, scrollMarginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <MoodPicker entry={entry} onSetMood={onSetMood} />
        <DateBadge entry={entry} onSetDate={onSetDate} />
        {area && (
          <span style={{ fontSize: 10.5, color: area.color, background: area.color + "1a", borderRadius: 99, padding: "1px 8px", fontWeight: 600 }}>
            {area.icon} {area.name}
          </span>
        )}
      </div>
      <EditableLinkText value={entry.text} multiline color={area?.color || COLORS.accent} onSave={(v) => onEdit(entry.id, v)} onDelete={() => setConfirmingDelete(true)} />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this entry?"
        message="You can undo this for a few seconds right after."
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => { setConfirmingDelete(false); onDelete(entry.id); }}
      />

      {links.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.borderSoft}` }}>
          {links.map((l, i) => (
            <span
              key={i}
              title={l.reason}
              style={{
                fontSize: 11,
                color: l.meta.color,
                background: l.meta.color + "16",
                borderRadius: 99,
                padding: "2px 9px",
              }}
            >
              {l.meta.icon} {l.meta.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
