import { useState } from "react";
import { COLORS } from "../lib/theme";
import { fetchRoadmapSuggestions } from "../lib/api";
import InlineAddForm from "./InlineAddForm";
import EditableText from "./EditableText";
import EditableLinkText from "./EditableLinkText";

function SuggestStages({ node, areaColor, relatedJournalSnippets, onAddStage }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const run = async () => {
    setLoading(true);
    setSuggestions(null);
    const results = await fetchRoadmapSuggestions({
      goalName: node.name,
      goalDescription: node.description,
      existingStages: (node.stages || []).map((s) => ({ title: s.title, done: s.done })),
      journalSnippets: relatedJournalSnippets || [],
    });
    setSuggestions(results);
    setLoading(false);
  };

  const accept = (s) => {
    onAddStage(node.id, s.title, s.resources);
    setSuggestions((prev) => prev?.filter((x) => x !== s) || null);
  };

  return (
    <div style={{ marginTop: 10 }}>
      {suggestions === null ? (
        <button
          onClick={run}
          disabled={loading}
          style={{
            background: "transparent",
            border: `1px dashed ${areaColor}44`,
            borderRadius: 8,
            color: areaColor,
            padding: "5px 12px",
            cursor: loading ? "default" : "pointer",
            fontSize: 12,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Thinking..." : "✨ Suggest next stages"}
        </button>
      ) : suggestions.length === 0 ? (
        <div style={{ fontSize: 11.5, color: COLORS.textMuted }}>No suggestions right now — roadmap looks solid as-is.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ background: COLORS.bgElevatedHover, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginBottom: 6 }}>{s.reason}</div>
              <button
                onClick={() => accept(s)}
                style={{ background: areaColor, border: "none", borderRadius: 6, color: COLORS.onAccent, padding: "4px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 600 }}
              >
                + Add this stage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// The roadmap: an ordered set of stages per goal, each with its own
// resources. Unlike habits, a stage is checked off once and stays done.
// Fully editable in-app: rename/add/delete stages and resources.
export default function StageList({
  node,
  areaColor,
  onToggleStage,
  onAddStage,
  onDeleteStage,
  onRenameStage,
  onAddResource,
  onDeleteResource,
  onEditResource,
  relatedJournalSnippets,
}) {
  const stages = node.stages || [];

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
        Roadmap
      </div>
      {stages.map((stage, i) => (
        <div
          key={stage.id}
          style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `2px solid ${stage.done ? areaColor : COLORS.border}`, transition: "border-color 0.3s ease" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              onClick={() => onToggleStage(node.id, stage.id)}
              title={stage.done ? "Click to mark as not done" : "Click to mark this stage complete"}
              style={{
                width: 19,
                height: 19,
                borderRadius: "50%",
                border: `2px solid ${areaColor}`,
                background: stage.done ? areaColor : COLORS.bgElevatedHover,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: stage.done ? COLORS.onAccent : areaColor,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s ease, transform 0.1s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {stage.done ? "✓" : i + 1}
            </span>
            <EditableText
              value={stage.title}
              onSave={(v) => onRenameStage(node.id, stage.id, v)}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: stage.done ? COLORS.textMuted : COLORS.textPrimary,
                textDecoration: stage.done ? "line-through" : "none",
              }}
            />
            <span onClick={() => onDeleteStage(node.id, stage.id)} style={{ color: COLORS.dangerMuted, cursor: "pointer", marginLeft: "auto", fontSize: 14 }}>
              ×
            </span>
          </div>

          <div style={{ marginTop: 6, marginLeft: 25, display: "flex", flexDirection: "column", gap: 4 }}>
            {stage.resources?.map((r, ri) => (
              <EditableLinkText
                key={ri}
                value={r}
                color={areaColor}
                onSave={(v) => onEditResource(node.id, stage.id, ri, v)}
                onDelete={() => onDeleteResource(node.id, stage.id, ri)}
              />
            ))}
            <InlineAddForm
              color={areaColor}
              placeholder="New resource — paste a link or type a note..."
              buttonLabel="+ Add resource"
              onSubmit={(value) => onAddResource(node.id, stage.id, value)}
              triggerStyle={{
                background: "transparent",
                border: "none",
                color: areaColor + "aa",
                padding: "2px 0",
                cursor: "pointer",
                fontSize: 11,
                marginTop: 2,
                textAlign: "left",
              }}
            />
          </div>
        </div>
      ))}

      <InlineAddForm
        color={areaColor}
        placeholder="New stage title (e.g. 'Build the Habit')..."
        buttonLabel="+ Add stage"
        onSubmit={(value) => onAddStage(node.id, value)}
        triggerStyle={{
          background: "transparent",
          border: `1px dashed ${areaColor}44`,
          borderRadius: 8,
          color: areaColor,
          padding: "5px 12px",
          cursor: "pointer",
          fontSize: 12,
          marginTop: 4,
        }}
      />

      <SuggestStages node={node} areaColor={areaColor} relatedJournalSnippets={relatedJournalSnippets} onAddStage={onAddStage} />
    </div>
  );
}
