import { COLORS } from "../lib/theme";

export default function MoveButtons({ isFirst, isLast, onMoveUp, onMoveDown }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 1 }} onClick={(e) => e.stopPropagation()}>
      <span
        onClick={isFirst ? undefined : onMoveUp}
        title="Move up"
        style={{ cursor: isFirst ? "default" : "pointer", color: isFirst ? COLORS.borderSoft : COLORS.textMuted, fontSize: 9, lineHeight: "9px" }}
      >
        ▲
      </span>
      <span
        onClick={isLast ? undefined : onMoveDown}
        title="Move down"
        style={{ cursor: isLast ? "default" : "pointer", color: isLast ? COLORS.borderSoft : COLORS.textMuted, fontSize: 9, lineHeight: "9px" }}
      >
        ▼
      </span>
    </span>
  );
}
