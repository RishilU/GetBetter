// Turns the passive tracker into something that notices things about you.
// Called at most a few times a day (client gates it to ~once/day plus a
// manual refresh), so it's worth paying for a stronger model than the
// classification-style link-suggestions endpoint.
export const config = { maxDuration: 30 };

const COACH_TOOL = {
  name: "give_insights",
  description: "Return 1-3 short, specific, second-person observations about the person's current patterns, each with an optional one-line suggested action.",
  input_schema: {
    type: "object",
    properties: {
      insights: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: { type: "string", description: "One or two sentences, direct and specific, referencing real numbers/patterns from the data. Never generic encouragement." },
            suggestion: { type: "string", description: "One concrete next action, or empty string if there isn't a clean one." },
          },
          required: ["text", "suggestion"],
        },
      },
    },
    required: ["insights"],
  },
};

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ insights: [] });

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { summary } = body;
    if (!summary) return Response.json({ insights: [] });

    const prompt = `You are a direct, perceptive personal coach inside someone's private habit and journal app. You have their real data below. Give 1-3 SHORT, SPECIFIC observations about what's actually happening — patterns, contradictions, stalled goals, mood dips tied to something, anything worth noticing. Reference real numbers where you have them. Never generic ("keep up the good work!"). Being a little blunt is fine and preferred if the data calls for it.\n\n${summary}`;

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
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
          tools: [COACH_TOOL],
          tool_choice: { type: "tool", name: "give_insights" },
        }),
      });
    } catch {
      return Response.json({ insights: [] });
    }

    if (!res.ok) return Response.json({ insights: [] });

    const data = await res.json();
    const toolUse = data.content?.find((b) => b.type === "tool_use" && b.name === "give_insights");
    return Response.json({ insights: toolUse?.input?.insights ?? [] });
  },
};
