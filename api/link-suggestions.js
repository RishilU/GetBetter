// Called automatically whenever a journal entry is saved. Sends the entry
// plus a list of candidate goals/other entries to the model and asks which
// are genuinely related — the Obsidian-style "web" is these AI-found links.
export const config = { maxDuration: 30 };

const SUGGEST_LINKS_TOOL = {
  name: "suggest_links",
  description: "Return the candidate items that are meaningfully related to the note.",
  input_schema: {
    type: "object",
    properties: {
      links: {
        type: "array",
        items: {
          type: "object",
          properties: {
            targetId: { type: "string" },
            reason: { type: "string", description: "One short sentence on why they're related" },
          },
          required: ["targetId", "reason"],
        },
      },
    },
    required: ["links"],
  },
};

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { text, candidates } = body;
    if (!text || !Array.isArray(candidates) || candidates.length === 0) {
      return Response.json({ links: [] });
    }

    const candidateList = candidates
      .slice(0, 80)
      .map((c) => `- id: ${c.id} | type: ${c.type} | ${c.label}${c.excerpt ? ` — ${c.excerpt}` : ""}`)
      .join("\n");

    const prompt = `A person is journaling in a personal growth app. Here is their new note:\n\n"""\n${text}\n"""\n\nHere are other notes and goals already in their system:\n${candidateList}\n\nWhich of these, if any, are meaningfully related to the new note? Only include genuine connections (shared theme, cause/effect, the note is about working on that goal, etc.), not superficial keyword overlap. It's completely fine to return zero links.`;

    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
          tools: [SUGGEST_LINKS_TOOL],
          tool_choice: { type: "tool", name: "suggest_links" },
        }),
      });
    } catch {
      return Response.json({ links: [] });
    }

    if (!anthropicRes.ok) {
      return Response.json({ links: [] }, { status: 200 });
    }

    const data = await anthropicRes.json();
    const toolUse = data.content?.find((b) => b.type === "tool_use" && b.name === "suggest_links");
    const candidateIds = new Set(candidates.map((c) => c.id));
    const links = (toolUse?.input?.links ?? []).filter((l) => candidateIds.has(l.targetId));

    return Response.json({ links });
  },
};
