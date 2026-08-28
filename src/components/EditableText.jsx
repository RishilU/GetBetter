import { useState, useEffect } from "react";
import { COLORS } from "../lib/theme";

// Click the text to rename it in place. Used for area/goal names,
// descriptions, stage titles, and habit text — anywhere that's just plain
// text with no links to worry about (see EditableLinkText for resources).
export default function EditableText({ value, onSave, multiline = false, style, inputStyle }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (!editing) setVal(value);
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    if (val.trim() && val !== value) onSave(val.trim());
    else setVal(value);
  };

  if (editing) {
    const Field = multiline ? "textarea" : "input";
    return (
      <Field
        autoFocus
        value={val}
        rows={multiline ? 2 : undefined}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !multiline) commit();
          if (e.key === "Escape") { setVal(value); setEditing(false); }
        }}
        style={{
          background: COLORS.bgElevatedHover,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          color: COLORS.textPrimary,
          font: "inherit",
          padding: "2px 6px",
          outline: "none",
          width: "100%",
          resize: multiline ? "vertical" : "none",
          ...inputStyle,
        }}
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      title="Click to edit"
      style={{ cursor: "text", ...style }}
    >
      {value}
    </span>
  );
}
