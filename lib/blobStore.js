import { get } from "@vercel/blob";

export const DATA_PATHNAME = "getbetter/data.json";

// Reads the whole app-data blob server-side. Returns null if nothing's been
// synced yet. Shared by api/data.js (authenticated) and api/share.js (a
// public token look-up that must never leak more than one goal's numbers).
export async function readDataBlob() {
  try {
    const result = await get(DATA_PATHNAME, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}
