export async function fetchLinkSuggestions(text, candidates) {
  try {
    const res = await fetch("/api/link-suggestions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, candidates }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.links || [];
  } catch {
    return [];
  }
}

// Cross-device sync: the whole data blob, GET to pull the server's copy and
// PUT to push the local one. Both fail silently (offline, cold start before
// the Blob store is configured, etc) — localStorage always stays the source
// of truth for the current tab, this just keeps other devices in step.
export async function fetchServerData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function pushServerData(payload) {
  try {
    await fetch("/api/data", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // offline or transient failure — next local change retries
  }
}

export async function fetchCoachInsights(summary) {
  try {
    const res = await fetch("/api/coach-insight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ summary }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.insights || [];
  } catch {
    return [];
  }
}

export async function fetchRoadmapSuggestions(payload) {
  try {
    const res = await fetch("/api/roadmap-suggest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}
