import { COLORS, FONT_BODY } from "../lib/theme";

export default function Toast({ undo, onUndo }) {
  if (!undo) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: COLORS.ink,
        color: COLORS.onAccent,
        borderRadius: 10,
        padding: "10px 10px 10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 13,
        fontFamily: FONT_BODY,
        boxShadow: "0 12px 28px rgba(36,31,26,0.28)",
        zIndex: 200,
        animation: "fadeSlideUp 0.2s ease",
      }}
    >
      <span>{undo.label}</span>
      <button
        onClick={onUndo}
        style={{ background: "transparent", border: "none", color: COLORS.accent, fontWeight: 700, cursor: "pointer", fontSize: 13, padding: "4px 8px" }}
      >
        Undo
      </button>
    </div>
  );
}
