import { next } from "@vercel/functions";
import { AUTH_COOKIE, verifyAuthToken, getCookie } from "./lib/auth.js";

// Gates the whole site (including the /api routes) behind a password.
// login.html/api/login are excluded so the gate isn't circular, and
// share.html/api/share are excluded on purpose — that's the whole point of
// a share link, it has to work for someone who isn't logged in.
export const config = {
  matcher: ["/((?!api/login|login.html|api/share|share.html|favicon.svg).*)"],
};

export default async function middleware(request) {
  const secret = process.env.AUTH_SECRET;
  const token = getCookie(request, AUTH_COOKIE);

  if (secret && (await verifyAuthToken(token, secret))) {
    return next();
  }

  return Response.redirect(new URL("/login.html", request.url));
}
