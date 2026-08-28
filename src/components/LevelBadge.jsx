import { computeNodeLevel } from "../lib/levels";
import { COLORS } from "../lib/theme";

export default function LevelBadge({ node }) {
  const { level, title } = computeNodeLevel(node);
  return (
    <span
      title={title}
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.onAccent,
        background: COLORS.accent,
        borderRadius: 99,
        padding: "2px 8px",
        letterSpacing: 0.2,
      }}
    >
      Lv {level}
    </span>
  );
}
