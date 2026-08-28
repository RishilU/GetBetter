import { useState } from "react";
import { COLORS } from "../lib/theme";

// Reusable "+ Add X" trigger that expands into a text input with Add/Cancel.
// Used for adding habits, goals, stages, and areas so that flow only exists once.
export default function InlineAddForm({ color, placeholder, buttonLabel, onSubmit, triggerStyle }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={triggerStyle}>
        {buttonLabel}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: COLORS.bgElevatedHover,
          border: `1px solid ${color}44`,
          borderRadius: 8,
          padding: "6px 10px",
          color: COLORS.textPrimary,
          fontSize: 13,
          outline: "none",
        }}
      />
      <button
        onClick={submit}
        style={{ background: color, border: "none", borderRadius: 8, color: COLORS.onAccent, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
      >
        Add
      </button>
      <button
        onClick={() => setOpen(false)}
        style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textMuted, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}
      >
        Cancel
      </button>
    </div>
  );
}
