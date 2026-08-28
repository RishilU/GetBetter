import { useEffect, useState } from "react";
import { useGrowthData } from "./hooks/useGrowthData";
import { useIsMobile } from "./hooks/useIsMobile";
import { useTheme } from "./hooks/useTheme";
import { today, countDoneToday } from "./lib/date";
import { COLORS, FONT_BODY } from "./lib/theme";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AreaSection from "./components/AreaSection";
import InlineAddForm from "./components/InlineAddForm";
import JournalView from "./components/JournalView";
import GraphView from "./components/GraphView";
import ReviewView from "./components/ReviewView";
import SettingsView from "./components/SettingsView";
import SearchView from "./components/SearchView";
import CoachView from "./components/CoachView";
import ProgressView from "./components/ProgressView";
import Toast from "./components/Toast";

const VIEW_TITLES = {
  dashboard: "Dashboard",
  journal: "Journal",
  coach: "Coach",
  progress: "Progress",
  search: "Search",
  graph: "Graph",
  review: "Review",
  settings: "Settings",
};
const VIEWS_WITH_RING = new Set(["dashboard"]);

export default function App() {
  const [view, setView] = useState("dashboard");
  const [pendingScrollId, setPendingScrollId] = useState(null);
  const [collapsedAreaIds, setCollapsedAreaIds] = useState(() => new Set());
  const [expandedNodeIds, setExpandedNodeIds] = useState(() => new Set());
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const {
    data,
    undo,
    performUndo,
    toggleHabit,
    addHabit,
    deleteHabit,
    renameHabit,
    toggleStage,
    addStage,
    deleteStage,
    renameStage,
    addResource,
    deleteResource,
    editResource,
    renameNode,
    setNodeDescription,
    addNode,
    deleteNode,
    addArea,
    deleteArea,
    renameArea,
    moveArea,
    moveNode,
    addJournalEntry,
    editJournalEntry,
    setJournalMood,
    setJournalDate,
    deleteJournalEntry,
    replaceData,
    getOrCreateShareLink,
    hasTodaysCoachBatch,
    generateCoachInsights,
    dismissCoachBatch,
  } = useGrowthData();

  useEffect(() => {
    if (!pendingScrollId) return;
    document.getElementById(pendingScrollId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPendingScrollId(null);
  }, [view, pendingScrollId]);

  const toggleAreaCollapsed = (areaId) => {
    setCollapsedAreaIds((prev) => {
      const next = new Set(prev);
      next.has(areaId) ? next.delete(areaId) : next.add(areaId);
      return next;
    });
  };

  const toggleNodeExpanded = (nodeId) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return next;
    });
  };

  const jumpToArea = (areaId) => {
    setView("dashboard");
    setPendingScrollId(`area-${areaId}`);
  };

  const jumpToNode = (nodeId) => {
    const area = data.areas.find((a) => a.nodes.some((n) => n.id === nodeId));
    if (area) setCollapsedAreaIds((prev) => { const next = new Set(prev); next.delete(area.id); return next; });
    setExpandedNodeIds((prev) => new Set(prev).add(nodeId));
    setView("dashboard");
    setPendingScrollId(`node-${nodeId}`);
  };

  const jumpToEntry = (entryId) => {
    setView("journal");
    setPendingScrollId(`entry-${entryId}`);
  };

  const todayStr = today();
  const totalHabits = data.areas.reduce((s, a) => s + a.nodes.reduce((ss, n) => ss + n.habits.length, 0), 0);
  const doneToday = data.areas.reduce((s, a) => s + a.nodes.reduce((ss, n) => ss + countDoneToday(n, todayStr), 0), 0);
  const overallPct = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: FONT_BODY, color: COLORS.textPrimary, display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar view={view} onChangeView={setView} data={data} onJumpToArea={jumpToArea} mobile={isMobile} />

      <div style={{ flex: 1, padding: isMobile ? "18px 16px 80px" : "28px 36px 100px", maxWidth: 900, minWidth: 0 }}>
        <Header
          title={VIEW_TITLES[view]}
          overallPct={overallPct}
          doneToday={doneToday}
          totalHabits={totalHabits}
          showRing={VIEWS_WITH_RING.has(view)}
          data={data}
          onJumpToNode={jumpToNode}
          onJumpToEntry={jumpToEntry}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {view === "dashboard" && (
          <>
            {data.areas.map((area, i) => (
              <AreaSection
                key={area.id}
                area={area}
                isFirst={i === 0}
                isLast={i === data.areas.length - 1}
                onMoveUp={() => moveArea(area.id, -1)}
                onMoveDown={() => moveArea(area.id, 1)}
                collapsed={collapsedAreaIds.has(area.id)}
                onToggleCollapsed={() => toggleAreaCollapsed(area.id)}
                expandedNodeIds={expandedNodeIds}
                onToggleNodeExpanded={toggleNodeExpanded}
                onToggleHabit={toggleHabit}
                onAddHabit={addHabit}
                onDeleteHabit={deleteHabit}
                onRenameHabit={renameHabit}
                onToggleStage={toggleStage}
                onAddStage={addStage}
                onDeleteStage={deleteStage}
                onRenameStage={renameStage}
                onAddResource={addResource}
                onDeleteResource={deleteResource}
                onEditResource={editResource}
                onRenameNode={renameNode}
                onSetNodeDescription={setNodeDescription}
                onAddNode={addNode}
                onDeleteNode={deleteNode}
                onDeleteArea={deleteArea}
                onRenameArea={renameArea}
                onMoveNode={moveNode}
                onGetShareLink={getOrCreateShareLink}
                journal={data.journal}
              />
            ))}

            <InlineAddForm
              color={COLORS.accent}
              placeholder="New area name (e.g. Finance, Career)..."
              buttonLabel="+ Add new area"
              onSubmit={addArea}
              triggerStyle={{
                width: "100%",
                background: "transparent",
                border: `1px dashed ${COLORS.border}`,
                borderRadius: 12,
                color: COLORS.textMuted,
                padding: "14px",
                cursor: "pointer",
                fontSize: 14,
                marginTop: 8,
              }}
            />
          </>
        )}

        {view === "journal" && (
          <JournalView
            entries={data.journal}
            areas={data.areas}
            onAdd={addJournalEntry}
            onEdit={editJournalEntry}
            onDelete={deleteJournalEntry}
            onSetMood={setJournalMood}
            onSetDate={setJournalDate}
          />
        )}

        {view === "coach" && (
          <CoachView
            coachInsights={data.coachInsights || []}
            hasTodaysBatch={hasTodaysCoachBatch()}
            onGenerate={generateCoachInsights}
            onDismissBatch={dismissCoachBatch}
          />
        )}

        {view === "progress" && <ProgressView data={data} />}

        {view === "search" && <SearchView data={data} onJumpToNode={jumpToNode} onJumpToEntry={jumpToEntry} />}

        {view === "graph" && <GraphView areas={data.areas} journal={data.journal} />}

        {view === "review" && <ReviewView areas={data.areas} journal={data.journal} />}

        {view === "settings" && <SettingsView data={data} onImport={replaceData} />}
      </div>

      <Toast undo={undo} onUndo={performUndo} />
    </div>
  );
}
