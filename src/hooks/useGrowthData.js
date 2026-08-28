import { useEffect, useRef, useState } from "react";
import { DEFAULT_DATA } from "../data/defaultData";
import { loadData, saveData, getLocalUpdatedAt } from "../lib/storage";
import { today, isoDate, habitKey, isHabitDoneOn, bumpStreak } from "../lib/date";
import { fetchLinkSuggestions, fetchServerData, pushServerData, fetchCoachInsights } from "../lib/api";
import { buildCoachSummary } from "../lib/coachSummary";

const AREA_COLORS = ["#d15b45", "#3f9baa", "#5b8f6b", "#b85a86", "#8b7fd6"];
const AREA_ICONS = ["⭐", "🎯", "🔥", "💡", "🚀"];
const SYNC_DEBOUNCE_MS = 1000;
const UNDO_WINDOW_MS = 6000;

function normalize(stored) {
  const journal = (stored?.journal ?? []).map((e) => ({
    mood: null,
    date: e.date || isoDate(new Date(e.createdAt)),
    ...e,
  }));
  return {
    areas: stored?.areas ?? DEFAULT_DATA.areas,
    journal,
    shares: stored?.shares ?? [],
    coachInsights: stored?.coachInsights ?? [],
  };
}

function truncate(text, max = 30) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function useGrowthData() {
  const [data, setData] = useState(() => normalize(loadData(DEFAULT_DATA)));
  const [undo, setUndo] = useState(null); // { label, snapshot }
  const undoTimerRef = useRef(null);
  const syncTimerRef = useRef(null);
  const hydratedRef = useRef(false);

  // Persist locally + push to the server (debounced) on every change.
  useEffect(() => {
    saveData(data);
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      pushServerData({ ...data, updatedAt: new Date().toISOString() });
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(syncTimerRef.current);
  }, [data]);

  // One-time pull from the server on mount, so a second device picks up
  // whatever's newer instead of always trusting whatever's in this browser.
  useEffect(() => {
    (async () => {
      const server = await fetchServerData();
      if (hydratedRef.current) return;
      hydratedRef.current = true;
      if (!server) return; // nothing synced yet — this device's copy will seed it
      const localUpdatedAt = getLocalUpdatedAt();
      if (!localUpdatedAt || new Date(server.updatedAt) > new Date(localUpdatedAt)) {
        setData(normalize(server));
      }
    })();
  }, []);

  const todayStr = today();

  const pushUndo = (label, snapshot) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndo({ label, snapshot });
    undoTimerRef.current = setTimeout(() => setUndo(null), UNDO_WINDOW_MS);
  };

  const performUndo = () => {
    if (!undo) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setData(undo.snapshot);
    setUndo(null);
  };

  const findNode = (nodeId) => {
    for (const area of data.areas) {
      const node = area.nodes.find((n) => n.id === nodeId);
      if (node) return node;
    }
    return null;
  };

  const updateNode = (nodeId, mutate) => {
    setData((prev) => {
      const next = structuredClone(prev);
      for (const area of next.areas) {
        const node = area.nodes.find((n) => n.id === nodeId);
        if (node) {
          mutate(node);
          break;
        }
      }
      return next;
    });
  };

  const toggleHabit = (nodeId, habitIdx) =>
    updateNode(nodeId, (node) => {
      const key = habitKey(todayStr, habitIdx);
      const idx = node.completed.indexOf(key);
      if (idx >= 0) {
        node.completed.splice(idx, 1);
        return;
      }
      node.completed.push(key);
      const allDone = node.habits.every((_, i) => isHabitDoneOn(node, todayStr, i));
      if (allDone) bumpStreak(node, todayStr);
    });

  const addHabit = (nodeId, habit) => updateNode(nodeId, (node) => node.habits.push(habit));

  const deleteHabit = (nodeId, idx) => {
    const node = findNode(nodeId);
    pushUndo(`"${truncate(node?.habits[idx] || "Habit")}" deleted`, data);
    updateNode(nodeId, (node) => node.habits.splice(idx, 1));
  };

  const renameHabit = (nodeId, idx, text) => updateNode(nodeId, (node) => { node.habits[idx] = text; });

  const toggleStage = (nodeId, stageId) =>
    updateNode(nodeId, (node) => {
      const stage = node.stages.find((s) => s.id === stageId);
      if (!stage) return;
      stage.done = !stage.done;
      stage.completedAt = stage.done ? new Date().toISOString() : null;
      // Once a goal's whole roadmap has been completed at least once, it's
      // permanently "mastered" — adding a stage later or unchecking one
      // doesn't take that away.
      if (!node.masteredAt && node.stages.length > 0 && node.stages.every((s) => s.done)) {
        node.masteredAt = new Date().toISOString();
      }
    });

  const addStage = (nodeId, title, resources = []) =>
    updateNode(nodeId, (node) => {
      if (!node.stages) node.stages = [];
      node.stages.push({ id: `stage-${Date.now()}`, title, done: false, resources });
    });

  const deleteStage = (nodeId, stageId) => {
    const node = findNode(nodeId);
    const stage = node?.stages.find((s) => s.id === stageId);
    pushUndo(`"${truncate(stage?.title || "Stage")}" deleted`, data);
    updateNode(nodeId, (node) => {
      node.stages = node.stages.filter((s) => s.id !== stageId);
    });
  };

  const renameStage = (nodeId, stageId, title) =>
    updateNode(nodeId, (node) => {
      const stage = node.stages.find((s) => s.id === stageId);
      if (stage) stage.title = title;
    });

  const addResource = (nodeId, stageId, resource) =>
    updateNode(nodeId, (node) => {
      const stage = node.stages.find((s) => s.id === stageId);
      if (stage) stage.resources.push(resource);
    });

  const deleteResource = (nodeId, stageId, idx) => {
    const node = findNode(nodeId);
    const stage = node?.stages.find((s) => s.id === stageId);
    pushUndo(`"${truncate(stage?.resources[idx] || "Resource")}" deleted`, data);
    updateNode(nodeId, (node) => {
      const stage = node.stages.find((s) => s.id === stageId);
      if (stage) stage.resources.splice(idx, 1);
    });
  };

  const editResource = (nodeId, stageId, idx, value) =>
    updateNode(nodeId, (node) => {
      const stage = node.stages.find((s) => s.id === stageId);
      if (stage) stage.resources[idx] = value;
    });

  const renameNode = (nodeId, name) => updateNode(nodeId, (node) => { node.name = name; });
  const setNodeDescription = (nodeId, description) => updateNode(nodeId, (node) => { node.description = description; });

  const addNode = (areaId, name) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const area = next.areas.find((a) => a.id === areaId);
      if (area) {
        area.nodes.push({
          id: `node-${Date.now()}`,
          name,
          description: "Your new goal",
          stages: [],
          habits: [],
          streak: 0,
          bestStreak: 0,
          lastChecked: null,
          completed: [],
          masteredAt: null,
        });
      }
      return next;
    });
  };

  const deleteNode = (areaId, nodeId) => {
    const node = findNode(nodeId);
    pushUndo(`"${truncate(node?.name || "Goal")}" deleted`, data);
    setData((prev) => {
      const next = structuredClone(prev);
      const area = next.areas.find((a) => a.id === areaId);
      if (area) area.nodes = area.nodes.filter((n) => n.id !== nodeId);
      return next;
    });
  };

  const addArea = (name) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.areas.push({
        id: `area-${Date.now()}`,
        name,
        icon: AREA_ICONS[next.areas.length % AREA_ICONS.length],
        color: AREA_COLORS[next.areas.length % AREA_COLORS.length],
        nodes: [],
      });
      return next;
    });
  };

  const deleteArea = (areaId) => {
    const area = data.areas.find((a) => a.id === areaId);
    pushUndo(`"${truncate(area?.name || "Area")}" deleted`, data);
    setData((prev) => ({ ...prev, areas: prev.areas.filter((a) => a.id !== areaId) }));
  };

  const renameArea = (areaId, name) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const area = next.areas.find((a) => a.id === areaId);
      if (area) area.name = name;
      return next;
    });
  };

  const swap = (arr, i, j) => {
    if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const moveArea = (areaId, direction) => {
    setData((prev) => {
      const areas = [...prev.areas];
      const idx = areas.findIndex((a) => a.id === areaId);
      swap(areas, idx, idx + direction);
      return { ...prev, areas };
    });
  };

  const moveNode = (areaId, nodeId, direction) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const area = next.areas.find((a) => a.id === areaId);
      if (!area) return prev;
      const idx = area.nodes.findIndex((n) => n.id === nodeId);
      swap(area.nodes, idx, idx + direction);
      return next;
    });
  };

  // Candidates for AI linking: every goal, plus other journal entries (most
  // recent 40, to keep the prompt bounded as the journal grows).
  const buildLinkCandidates = (snapshot, excludeEntryId) => {
    const goalCandidates = snapshot.areas.flatMap((a) =>
      a.nodes.map((n) => ({ id: n.id, type: "goal", label: n.name, excerpt: n.description }))
    );
    const journalCandidates = snapshot.journal
      .filter((e) => e.id !== excludeEntryId)
      .slice(0, 40)
      .map((e) => ({ id: e.id, type: "journal", label: e.text.slice(0, 40), excerpt: e.text.slice(0, 150) }));
    return [...goalCandidates, ...journalCandidates];
  };

  const refreshLinks = async (entryId, text, snapshot) => {
    const links = await fetchLinkSuggestions(text, buildLinkCandidates(snapshot, entryId));
    setData((prev) => ({
      ...prev,
      journal: prev.journal.map((e) => (e.id === entryId ? { ...e, links } : e)),
    }));
  };

  const updateJournalEntry = (entryId, patch) => {
    setData((prev) => ({
      ...prev,
      journal: prev.journal.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
    }));
  };

  const addJournalEntry = (text, areaId, mood, date) => {
    const id = `entry-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      journal: [
        { id, createdAt: new Date().toISOString(), date: date || isoDate(), text, areaId: areaId || null, mood: mood || null, links: [] },
        ...prev.journal,
      ],
    }));
    refreshLinks(id, text, data);
  };

  const editJournalEntry = (entryId, text) => {
    updateJournalEntry(entryId, { text });
    refreshLinks(entryId, text, data);
  };

  const setJournalMood = (entryId, mood) => updateJournalEntry(entryId, { mood });
  const setJournalDate = (entryId, date) => updateJournalEntry(entryId, { date });

  const deleteJournalEntry = (entryId) => {
    pushUndo("Entry deleted", data);
    setData((prev) => ({ ...prev, journal: prev.journal.filter((e) => e.id !== entryId) }));
  };

  const replaceData = (imported) => setData(normalize(imported));

  // Sharing: one token per goal, reused if it already exists rather than
  // minted fresh every click. crypto.randomUUID() is a browser/Node global,
  // no extra dependency needed.
  const getOrCreateShareLink = (nodeId) => {
    const existing = (data.shares || []).find((s) => s.nodeId === nodeId);
    if (existing) return existing.token;
    const token = crypto.randomUUID();
    setData((prev) => ({
      ...prev,
      shares: [...(prev.shares || []), { token, nodeId, createdAt: new Date().toISOString() }],
    }));
    return token;
  };

  const revokeShare = (token) => {
    setData((prev) => ({ ...prev, shares: (prev.shares || []).filter((s) => s.token !== token) }));
  };

  // The proactive coach: bundles insights by day so re-opening the Coach view
  // doesn't just spam new API calls — one batch/day, plus an explicit refresh.
  const hasTodaysCoachBatch = () => (data.coachInsights || []).some((b) => b.date === isoDate());

  const generateCoachInsights = async () => {
    const summary = buildCoachSummary(data);
    const insights = await fetchCoachInsights(summary);
    if (insights.length === 0) return;
    const batch = { id: `coach-${Date.now()}`, date: isoDate(), createdAt: new Date().toISOString(), insights };
    setData((prev) => ({ ...prev, coachInsights: [batch, ...(prev.coachInsights || [])] }));
  };

  const dismissCoachBatch = (batchId) => {
    setData((prev) => ({ ...prev, coachInsights: (prev.coachInsights || []).filter((b) => b.id !== batchId) }));
  };

  return {
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
    revokeShare,
    hasTodaysCoachBatch,
    generateCoachInsights,
    dismissCoachBatch,
  };
}
