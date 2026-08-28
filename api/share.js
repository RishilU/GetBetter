import { readDataBlob } from "../lib/blobStore.js";
import { today, countDoneToday } from "../src/lib/date.js";

// Deliberately NOT behind the auth gate (see middleware.js matcher) — this is
// what makes a share link work for someone without an account. It only ever
// returns the one goal's numbers for a valid token, never the full dataset.
export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

    const data = await readDataBlob();
    const share = data?.shares?.find((s) => s.token === token);
    if (!share) return Response.json({ error: "Not found" }, { status: 404 });

    let node = null;
    let area = null;
    for (const a of data.areas) {
      const n = a.nodes.find((n) => n.id === share.nodeId);
      if (n) {
        node = n;
        area = a;
        break;
      }
    }
    if (!node) return Response.json({ error: "Not found" }, { status: 404 });

    const todayStr = today();
    return Response.json({
      goalName: node.name,
      description: node.description,
      areaName: area.name,
      areaColor: area.color,
      areaIcon: area.icon,
      streak: node.streak,
      habitDone: countDoneToday(node, todayStr),
      habitTotal: node.habits.length,
      stagesDone: (node.stages || []).filter((s) => s.done).length,
      stagesTotal: (node.stages || []).length,
    });
  },
};
