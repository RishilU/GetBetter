import { COLORS } from "../lib/theme";

export default function ProgressBar({ value, max, color, height = 6 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: COLORS.borderSoft, borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }} />
    </div>
  );
}
