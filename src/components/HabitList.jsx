import { useState } from "react";
import { today, isHabitDoneOn } from "../lib/date";
import { COLORS } from "../lib/theme";
import InlineAddForm from "./InlineAddForm";
import EditableText from "./EditableText";

const SECTION_LABEL_STYLE = {
  color: COLORS.textMuted,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1,
  marginBottom: 8,
  textTransform: "uppercase",
};

function HabitCheckbox({ done, areaColor, onToggle }) {
  const [popping, setPopping] = useState(false);
  return (
    <div
      onClick={() => {
        onToggle();
        if (!done) {
          setPopping(true);
          setTimeout(() => setPopping(false), 220);
        }
      }}
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `2px solid ${areaColor}`,
        background: done ? areaColor : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: popping ? "scale(1.25)" : "scale(1)",
        transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease",
      }}
    >
      {done && <span style={{ color: COLORS.onAccent, fontSize: 12, fontWeight: 700 }}>✓</span>}
    </div>
  );
}

export default function HabitList({ node, areaColor, onToggleHabit, onAddHabit, onDeleteHabit, onRenameHabit }) {
  const todayStr = today();

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={SECTION_LABEL_STYLE}>Daily Habits</div>
      {node.habits.map((habit, i) => {
        const done = isHabitDoneOn(node, todayStr, i);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <HabitCheckbox done={done} areaColor={areaColor} onToggle={() => onToggleHabit(node.id, i)} />
            <EditableText
              value={habit}
              onSave={(v) => onRenameHabit(node.id, i, v)}
              style={{
                color: done ? COLORS.textMuted : COLORS.textSecondary,
                fontSize: 13,
                textDecoration: done ? "line-through" : "none",
                transition: "color 0.2s ease",
              }}
            />
            <span onClick={() => onDeleteHabit(node.id, i)} style={{ color: COLORS.dangerMuted, cursor: "pointer", marginLeft: "auto", fontSize: 14 }}>
              ×
            </span>
          </div>
        );
      })}
      <InlineAddForm
        color={areaColor}
        placeholder="New habit..."
        buttonLabel="+ Add habit"
        onSubmit={(value) => onAddHabit(node.id, value)}
        triggerStyle={{
          background: "transparent",
          border: `1px dashed ${areaColor}44`,
          borderRadius: 8,
          color: areaColor,
          padding: "5px 12px",
          cursor: "pointer",
          fontSize: 12,
          marginTop: 6,
        }}
      />
    </div>
  );
}
