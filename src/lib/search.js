// Simple client-side substring search across goals, roadmap stages/resources,
// and journal entries. No index needed at this data size — just filter.
export function searchAll(data, query) {
  const q = query.trim().toLowerCase();
  if (!q) return { goals: [], resources: [], entries: [] };

  const goals = [];
  const resources = [];

  for (const area of data.areas) {
    for (const node of area.nodes) {
      if (node.name.toLowerCase().includes(q) || node.description?.toLowerCase().includes(q)) {
        goals.push({ id: node.id, name: node.name, areaName: area.name, areaColor: area.color, areaIcon: area.icon });
      }
      for (const stage of node.stages || []) {
        if (stage.title.toLowerCase().includes(q)) {
          resources.push({ nodeId: node.id, nodeName: node.name, areaColor: area.color, label: stage.title, kind: "stage" });
        }
        for (const r of stage.resources || []) {
          if (r.toLowerCase().includes(q)) {
            resources.push({ nodeId: node.id, nodeName: node.name, areaColor: area.color, label: r, kind: "resource" });
          }
        }
      }
    }
  }

  const entries = data.journal
    .filter((e) => e.text.toLowerCase().includes(q))
    .map((e) => ({ id: e.id, snippet: e.text, date: e.date }));

  return { goals, resources, entries };
}
