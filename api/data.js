import { put } from "@vercel/blob";
import { AUTH_COOKIE, verifyAuthToken, getCookie } from "../lib/auth.js";
import { DATA_PATHNAME, readDataBlob } from "../lib/blobStore.js";

async function isAuthed(request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  const token = getCookie(request, AUTH_COOKIE);
  return verifyAuthToken(token, secret);
}

export default {
  async fetch(request) {
    if (!(await isAuthed(request))) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (request.method === "GET") {
      const data = await readDataBlob();
      return Response.json(data);
    }

    if (request.method === "PUT") {
      const body = await request.text();
      await put(DATA_PATHNAME, body, { access: "private", allowOverwrite: true, contentType: "application/json" });
      return Response.json({ ok: true });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
