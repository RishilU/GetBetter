import { useState } from "react";
import Linkified from "./Linkified";
import { COLORS } from "../lib/theme";

// Display + edit combo for text that may contain links (resources, journal
// entries). Displayed text auto-linkifies; a pencil icon switches to an
// editable field so a raw URL you paste in becomes clickable immediately.
export default function EditableLinkText({ value, onSave, onDelete, multiline = false, color = COLORS.accent }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  const commit = () => {
    if (val.trim()) onSave(val.trim());
    setEditing(false);
  };

  if (editing) {
    const Field = multiline ? "textarea" : "input";
    return (
      <div style={{ display: "flex", flexDirection: multiline ? "column" : "row", gap: 6, width: "100%" }}>
        <Field
          autoFocus
          value={val}
          rows={multiline ? 4 : undefined}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !multiline) commit();
            if (e.key === "Escape") { setVal(value); setEditing(false); }
          }}
          style={{
            flex: 1,
            background: COLORS.bgElevatedHover,
            border: `1px solid ${color}55`,
            borderRadius: 6,
            color: COLORS.textPrimary,
            font: "inherit",
            fontSize: 13,
            padding: "5px 8px",
            outline: "none",
            resize: multiline ? "vertical" : "none",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={commit} style={{ background: color, border: "none", borderRadius: 6, color: COLORS.onAccent, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            Save
          </button>
          <button onClick={() => { setVal(value); setEditing(false); }} style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.textMuted, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <div style={{ flex: 1, color: COLORS.textSecondary, fontSize: 12.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
        <Linkified text={value} />
      </div>
      <span onClick={() => setEditing(true)} title="Edit" style={{ cursor: "pointer", opacity: 0.55, fontSize: 12, flexShrink: 0 }}>
        ✎
      </span>
      {onDelete && (
        <span onClick={onDelete} title="Delete" style={{ cursor: "pointer", color: COLORS.dangerMuted, fontSize: 13, flexShrink: 0 }}>
          ×
        </span>
      )}
    </div>
  );
}
