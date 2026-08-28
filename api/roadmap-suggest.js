// Adaptive roadmap: suggests new stages to append based on progress so far
// and related journal entries. Never rewrites or deletes existing stages —
// only ever proposes additions the user explicitly accepts.
export const config = { maxDuration: 30 };

const ROADMAP_TOOL = {
  name: "suggest_stages",
  description: "Suggest 1-3 new roadmap stages to add next.",
  input_schema: {
    type: "object",
    properties: {
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            resources: { type: "array", items: { type: "string" }, description: "1-3 concrete resources: books, apps, practices" },
            reason: { type: "string", description: "One short sentence on why this is the right next stage" },
          },
          required: ["title", "resources", "reason"],
        },
      },
    },
    required: ["suggestions"],
  },
};

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ suggestions: [] });

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { goalName, goalDescription, existingStages, journalSnippets } = body;
    if (!goalName) return Response.json({ suggestions: [] });

    const stagesText = (existingStages || []).map((s, i) => `${i + 1}. ${s.title}${s.done ? " (done)" : " (not done)"}`).join("\n") || "(none yet)";
    const journalText = (journalSnippets || []).map((s) => `- ${s}`).join("\n") || "(no related journal entries)";

    const prompt = `Someone is working on this personal growth goal: "${goalName}" — ${goalDescription || "no description"}.\n\nTheir current roadmap:\n${stagesText}\n\nRelated journal entries:\n${journalText}\n\nSuggest 1-3 NEW stages to add next (don't repeat existing ones). Base it on what's actually done vs. stalled, and anything the journal reveals about what's working or not working for them. Keep titles short and concrete, matching the style of the existing ones.`;

    let res;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
          tools: [ROADMAP_TOOL],
          tool_choice: { type: "tool", name: "suggest_stages" },
        }),
      });
    } catch {
      return Response.json({ suggestions: [] });
    }

    if (!res.ok) return Response.json({ suggestions: [] });

    const data = await res.json();
    const toolUse = data.content?.find((b) => b.type === "tool_use" && b.name === "suggest_stages");
    return Response.json({ suggestions: toolUse?.input?.suggestions ?? [] });
  },
};
