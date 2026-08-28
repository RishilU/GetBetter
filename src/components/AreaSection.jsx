import ProgressBar from "./ProgressBar";
import NodeCard from "./NodeCard";
import InlineAddForm from "./InlineAddForm";
import EditableText from "./EditableText";
import MoveButtons from "./MoveButtons";
import { today, countDoneToday } from "../lib/date";
import { COLORS, FONT_DISPLAY } from "../lib/theme";

export default function AreaSection({
  area,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  collapsed,
  onToggleCollapsed,
  expandedNodeIds,
  onToggleNodeExpanded,
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
  onAddNode,
  onDeleteNode,
  onDeleteArea,
  onRenameArea,
  onMoveNode,
  onGetShareLink,
  journal,
}) {
  const todayStr = today();

  const totalHabits = area.nodes.reduce((sum, n) => sum + n.habits.length, 0);
  const doneToday = area.nodes.reduce((sum, n) => sum + countDoneToday(n, todayStr), 0);
  const areaProgress = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;

  const areaJournalSnippets = (journal || [])
    .filter((e) => e.areaId === area.id)
    .slice(0, 5)
    .map((e) => e.text);

  return (
    <div id={`area-${area.id}`} style={{ marginBottom: 28, scrollMarginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span onClick={onToggleCollapsed} style={{ fontSize: 21, cursor: "pointer", opacity: 0.9 }}>
          {area.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <EditableText
              value={area.name}
              onSave={(v) => onRenameArea(area.id, v)}
              style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: COLORS.textPrimary, fontSize: 19 }}
            />
            <span style={{ fontSize: 12, color: area.color, background: area.color + "22", borderRadius: 99, padding: "2px 10px", fontWeight: 600 }}>
              {areaProgress}%
            </span>
          </div>
          <ProgressBar value={doneToday} max={totalHabits || 1} color={area.color} />
        </div>
        <MoveButtons isFirst={isFirst} isLast={isLast} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        <span onClick={() => onDeleteArea(area.id)} style={{ color: COLORS.dangerMuted, cursor: "pointer", fontSize: 16 }}>
          ×
        </span>
        <span
          onClick={onToggleCollapsed}
          style={{ color: COLORS.textMuted, fontSize: 16, cursor: "pointer", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "inline-block" }}
        >
          ▾
        </span>
      </div>

      {!collapsed && (
        <div style={{ paddingLeft: 4 }}>
          {area.nodes.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              areaColor={area.color}
              isFirst={i === 0}
              isLast={i === area.nodes.length - 1}
              onMoveUp={() => onMoveNode(area.id, node.id, -1)}
              onMoveDown={() => onMoveNode(area.id, node.id, 1)}
              expanded={expandedNodeIds.has(node.id)}
              onToggleExpanded={() => onToggleNodeExpanded(node.id)}
              onToggleHabit={onToggleHabit}
              onAddHabit={onAddHabit}
              onDeleteHabit={onDeleteHabit}
              onRenameHabit={onRenameHabit}
              onToggleStage={onToggleStage}
              onAddStage={onAddStage}
              onDeleteStage={onDeleteStage}
              onRenameStage={onRenameStage}
              onAddResource={onAddResource}
              onDeleteResource={onDeleteResource}
              onEditResource={onEditResource}
              onRenameNode={onRenameNode}
              onSetNodeDescription={onSetNodeDescription}
              onDeleteNode={(nodeId) => onDeleteNode(area.id, nodeId)}
              onGetShareLink={onGetShareLink}
              relatedJournalSnippets={areaJournalSnippets}
            />
          ))}
          <InlineAddForm
            color={area.color}
            placeholder="New goal name..."
            buttonLabel={`+ Add goal to ${area.name}`}
            onSubmit={(name) => onAddNode(area.id, name)}
            triggerStyle={{
              background: "transparent",
              border: `1px dashed ${area.color}33`,
              borderRadius: 10,
              color: area.color + "99",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              width: "100%",
              marginTop: 4,
            }}
          />
        </div>
      )}
    </div>
  );
}
