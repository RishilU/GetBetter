import { AUTH_COOKIE, createAuthToken } from "../lib/auth.js";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const sitePassword = process.env.SITE_PASSWORD;
    const secret = process.env.AUTH_SECRET;
    if (!sitePassword || !secret) {
      return Response.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (body.password !== sitePassword) {
      return Response.json({ ok: false }, { status: 401 });
    }

    const token = await createAuthToken(secret);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
      },
    });
  },
};
