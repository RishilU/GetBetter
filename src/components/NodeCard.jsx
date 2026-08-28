import { useState } from "react";
import ProgressBar from "./ProgressBar";
import HabitList from "./HabitList";
import StageList from "./StageList";
import EditableText from "./EditableText";
import LevelBadge from "./LevelBadge";
import MoveButtons from "./MoveButtons";
import HabitHeatmap from "./HabitHeatmap";
import { today, countDoneToday } from "../lib/date";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

function ShareButton({ node, onGetShareLink }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    const token = onGetShareLink(node.id);
    const url = `${window.location.origin}/share.html?token=${token}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — link is still created, user can find it another way
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      onClick={handleClick}
      title="Copy a read-only share link for this goal"
      style={{ cursor: "pointer", fontSize: 14, color: copied ? COLORS.moodUp : COLORS.textMuted, marginLeft: 12, flexShrink: 0 }}
    >
      {copied ? "✓" : "🔗"}
    </span>
  );
}

export default function NodeCard({
  node,
  areaColor,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  expanded,
  onToggleExpanded,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onRenameHabit,
  onToggleStage,
  onAddStage,
  onDeleteStage,
  onRenameStage,
  onAddResource,
  onDeleteResource,
  onEditResource,
  onRenameNode,
  onSetNodeDescription,
  onDeleteNode,
  onGetShareLink,
  relatedJournalSnippets,
}) {
  const todayStr = today();
  const todayCompleted = countDoneToday(node, todayStr);
  const totalHabits = node.habits.length;

  const totalStages = node.stages?.length || 0;
  const doneStages = node.stages?.filter((s) => s.done).length || 0;

  return (
    <div
      id={`node-${node.id}`}
      style={{
        background: COLORS.bgElevated,
        border: `1px solid ${expanded ? areaColor + "55" : COLORS.borderSoft}`,
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 10,
        scrollMarginTop: 20,
        transition: "border-color 0.25s ease",
      }}
    >
      <div onClick={onToggleExpanded} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <EditableText
              value={node.name}
              onSave={(v) => onRenameNode(node.id, v)}
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, color: COLORS.textPrimary, fontSize: 15.5 }}
            />
            <LevelBadge node={node} />
            {totalStages > 0 && (
              <span style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.bgElevatedHover, borderRadius: 99, padding: "2px 8px" }}>
                {doneStages}/{totalStages} roadmap
              </span>
            )}
            {node.streak > 0 && (
              <span style={{ fontSize: 11, color: COLORS.accent, animation: "flicker 2.4s ease-in-out infinite" }}>🔥 {node.streak}d</span>
            )}
          </div>
          <ProgressBar value={todayCompleted} max={totalHabits || 1} color={areaColor} />
        </div>
        <MoveButtons isFirst={isFirst} isLast={isLast} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        <ShareButton node={node} onGetShareLink={onGetShareLink} />
        <span onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }} style={{ color: COLORS.dangerMuted, cursor: "pointer", marginLeft: 12, fontSize: 16 }}>
          ×
        </span>
        <span style={{ color: COLORS.textMuted, marginLeft: 8, fontSize: 16, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", display: "inline-block" }}>
          ▾
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, animation: "fadeSlideIn 0.2s ease" }}>
          <EditableText
            value={node.description}
            onSave={(v) => onSetNodeDescription(node.id, v)}
            multiline
            style={{ color: COLORS.textSecondary, fontSize: 12.5, display: "block", margin: "0 0 14px", lineHeight: 1.5 }}
          />
          <HabitHeatmap node={node} areaColor={areaColor} />
          <StageList
            node={node}
            areaColor={areaColor}
            onToggleStage={onToggleStage}
            onAddStage={onAddStage}
            onDeleteStage={onDeleteStage}
            onRenameStage={onRenameStage}
            onAddResource={onAddResource}
            onDeleteResource={onDeleteResource}
            onEditResource={onEditResource}
            relatedJournalSnippets={relatedJournalSnippets}
          />
          <HabitList
            node={node}
            areaColor={areaColor}
            onToggleHabit={onToggleHabit}
            onAddHabit={onAddHabit}
            onDeleteHabit={onDeleteHabit}
            onRenameHabit={onRenameHabit}
          />
        </div>
      )}
    </div>
  );
}
