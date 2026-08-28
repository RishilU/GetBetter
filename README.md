# GetBetter

A personal growth tracker I built for myself — part habit tracker, part journal, part
coach. It's organized around five areas of life (Mind, Presence, Social, Communication,
Body), each broken into concrete goals with their own roadmap and daily habits, plus a
journal that quietly figures out how everything connects.

I wanted something more honest than the usual streak-counter apps: a tool that actually
looks at what I'm doing and tells me something true about it, instead of just cheering
me on for checking boxes.

## What it does

**Goals, not just habits.** Each goal has a roadmap — an ordered set of milestones with
their own resources (books, articles, practices) — separate from the daily habits that
build toward it. Stages get checked off once and stay done; habits reset daily and build
streaks.

**A journal that links itself.** Write an entry, tag a mood, and it's automatically
compared against your other entries and goals to find genuine connections — not keyword
matching, an actual read of what's related and why. Those connections render as a
force-directed graph, closer to a personal knowledge graph than a diary.

**A coach that reads the data, not a hype machine.** Once a day (or on demand), it looks
at your real completion rates, streaks, mood trend, and recent journal entries, and
surfaces specific observations — including uncomfortable ones — rather than generic
encouragement.

**Adaptive roadmaps.** Any goal can ask for suggested next steps, generated from what's
actually been finished vs. stalled and what your journal reveals about it. Suggestions
are proposals you approve one at a time — nothing gets rewritten without you asking.

**Progress that doesn't reset.** Daily completion percentages and current streaks reset
by design, so I added a separate lifetime layer: total habits ever completed, best streak
per goal (survives a missed day), goals fully mastered at least once. Numbers that only
go up.

**Everything else you'd expect**: full-text search, a weekly review with week-over-week
deltas, light/dark themes, mobile layout, a shareable read-only link for a single goal
(no login required to view, nothing else exposed), and one-click JSON export/import.

## How it's built

- **React + Vite** — no router, no framework overhead; it's a single-page app with view
  state, not a multi-route site.
- **Vercel Serverless Functions** for anything that needs a secret key or shouldn't run
  in the browser: the AI calls, auth, and storage all live here.
- **Vercel Blob** as the datastore. It's a single-user app, so a full database would've
  been overkill — one JSON blob, read on load, written on a debounce, is enough to sync
  across devices without standing up Postgres for one person's data.
- **Vercel Edge Middleware** gates the entire site behind a passphrase, verified via a
  signed cookie (HMAC-SHA256, no auth library) — everything, including the API routes,
  requires it except the login page and share links (which are deliberately public by
  design, scoped to exactly one goal's numbers).
- **Claude (Anthropic API)** powers the journal linking, the coach, and the roadmap
  suggestions — each one gated (once-daily batching, on-demand buttons) so it's cheap to
  run for a single user instead of firing on every keystroke.
- Client-side state syncs to `localStorage` instantly (so it's fast and works offline)
  and to the server on a debounce, with a last-write-wins merge by timestamp on load —
  simple, and correct enough for one person using it from two devices.

## Running it locally

Needs the [Vercel CLI](https://vercel.com/docs/cli) since the serverless functions and
middleware don't run under a plain `vite dev` server.

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
vercel dev
```

`.env.local` needs:

| Variable | What it's for |
|---|---|
| `SITE_PASSWORD` | The passphrase for the login gate |
| `AUTH_SECRET` | Random string that signs the login cookie (`openssl rand -hex 32`) |
| `ANTHROPIC_API_KEY` | Powers the journal linking, coach, and roadmap suggestions |

Cross-device sync needs a private Vercel Blob store connected to the project — see the
comment in `.env.local.example` for the two-click setup in the Vercel dashboard.
