// Shared between middleware.js (Edge runtime) and api/login.js (Node runtime),
// so it only uses Web APIs available in both: crypto.subtle, TextEncoder, atob/btoa.

const encoder = new TextEncoder();

async function hmacHex(payload, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const AUTH_COOKIE = "gb_auth";

export async function createAuthToken(secret, ttlMs = 30 * 24 * 60 * 60 * 1000) {
  const payload = btoa(JSON.stringify({ exp: Date.now() + ttlMs }));
  const sig = await hmacHex(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyAuthToken(token, secret) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmacHex(payload, secret);
  if (!safeEqual(expected, sig)) return false;
  try {
    const data = JSON.parse(atob(payload));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}
