import { COLORS, FONT_DISPLAY } from "../lib/theme";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(43,38,33,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 14, padding: 22, maxWidth: 320, width: "90%", boxShadow: "0 12px 32px rgba(43,38,33,0.18)" }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 18, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textSecondary, padding: "7px 14px", cursor: "pointer", fontSize: 13 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ background: COLORS.danger, border: "none", borderRadius: 8, color: COLORS.onAccent, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
