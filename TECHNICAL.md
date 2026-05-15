# GamePulse — Technical Document

This document describes the architecture, data contracts, conventions, and extension points of the GamePulse platform. For a product-level overview see [`README.md`](./README.md).

---

## 1. Goals

GamePulse provides a moderator-facing control center for AI-classified player chat. The system must:

1. Classify each chat message into one of six emotions in near real time.
2. Aggregate emotion volume by game, genre, region, channel, and player.
3. Surface toxicity hotspots and flag actionable moderation events.
4. Compute and display per-player reputation.
5. Generate scoped, human-readable AI summaries on demand.
6. Be filterable globally by game / genre / region / free-text search.

The current build implements the full UI, data flow, and filtering surface against a deterministic mock data engine, with clean integration seams for a real AI backend.

---

## 2. Architecture overview

```
                   ┌────────────────────────────┐
                   │  Browser (React 19, SSR)   │
                   │                            │
                   │  TanStack Router routes    │
                   │   /  /players  /channels   │
                   │   /reports                 │
                   │                            │
                   │  FiltersProvider (context) │
                   │   ├── filters state        │
                   │   ├── AI summary state     │
                   │   └── runSweep()           │
                   │                            │
                   │  Widgets ── matchesFilters │
                   └────────────┬───────────────┘
                                │
                                │  (current) reads from
                                ▼
                   ┌────────────────────────────┐
                   │  src/lib/mock-data.ts      │
                   │  Deterministic generators  │
                   └────────────────────────────┘

                                │  (future) replaced by
                                ▼
                   ┌────────────────────────────┐
                   │  TanStack server functions │
                   │  + Lovable AI Gateway      │
                   │  + Lovable Cloud (Postgres)│
                   └────────────────────────────┘
```

The frontend is fully decoupled from the data source: every widget reads from the filter context and a typed module in `src/lib/`. Swapping mock data for real server functions is a per-module change, not a rewrite.

---

## 3. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | TanStack Start v1 | React 19, SSR-capable |
| Build | Vite 7 | Configured via `@lovable.dev/vite-tanstack-config` |
| Edge runtime | Cloudflare Workers | `wrangler.jsonc`, `nodejs_compat` |
| Routing | TanStack Router | File-based, `src/routes/` |
| Styling | Tailwind v4 | `@import` + `@theme` in `src/styles.css` |
| Tokens | `oklch` CSS variables | Semantic only — no raw colors in components |
| UI | shadcn/ui + Radix | `src/components/ui/` |
| Charts | Recharts | Area, radial bar, custom heatmap |
| Toasts | sonner | Wired in `__root.tsx` |
| TS | strict | `tsconfig.json` |

---

## 4. File layout

```
src/
├── routes/
│   ├── __root.tsx           # Root layout: providers, <Outlet/>, <Toaster/>
│   ├── index.tsx            # Dashboard composition
│   ├── players.tsx
│   ├── channels.tsx
│   └── reports.tsx
├── components/
│   ├── Header.tsx           # Nav + global search + Run AI Sweep
│   ├── FilterBar.tsx        # game / genre / region selects
│   ├── StatCard.tsx
│   ├── LiveChatFeed.tsx
│   ├── SentimentTrend.tsx
│   ├── EmotionDistribution.tsx
│   ├── ToxicityHeatmap.tsx
│   ├── ModerationAlerts.tsx
│   ├── PlayerReputation.tsx
│   ├── MatchmakingPanel.tsx
│   ├── AISummary.tsx
│   └── ui/                  # shadcn primitives
├── lib/
│   ├── mock-data.ts         # Types + generators (single source of truth)
│   └── filter-context.tsx   # Global filters + AI summary state
├── styles.css               # Design tokens + Tailwind theme
├── router.tsx               # createRouter()
├── start.ts                 # createStart() — request middleware
└── server.ts                # SSR entry (do not duplicate)
```

`src/routeTree.gen.ts` is **auto-generated** by the TanStack Router Vite plugin. Never hand-edit it.

---

## 5. Data model

All types live in `src/lib/mock-data.ts`.

### 5.1 Emotions

```ts
type Emotion = "positive" | "excited" | "neutral" | "frustrated" | "negative" | "toxic";
```

Each has display metadata (label, color token, emoji) in `emotionMeta`. Colors resolve to CSS variables defined in `src/styles.css` (`--positive`, `--excited`, …) so theming is centralized.

### 5.2 Games & regions

```ts
type GameType = "FPS" | "MOBA" | "Battle Royale" | "Sports";
interface Game { id: string; name: string; type: GameType; emoji: string }

const GAMES: Game[];                  // valorant, cs2, apex, fortnite, lol, dota2, fifa
const GAME_TYPES: GameType[];
const REGIONS = ["NA-East","NA-West","EU-West","EU-North","SA","OCE","ASIA","ME"] as const;
type Region = typeof REGIONS[number];
```

### 5.3 Chat message

```ts
interface ChatMessage {
  id: string;
  player: string;
  channel: string;
  text: string;
  emotion: Emotion;
  confidence: number;   // 0..1
  ts: number;           // epoch ms
  gameId: string;       // FK to Game.id
  region: Region;
}
```

`generateMessage()` produces a single message; `initialMessages` seeds the live feed.

### 5.4 Player reputation

```ts
interface PlayerRep {
  name: string;
  reputation: number;          // 0..100
  trend: number;               // signed delta vs prior window
  matches: number;
  toxicityRate: number;        // % of messages flagged toxic
  badge: "exemplary" | "trusted" | "watch" | "flagged";
  mainGame: string;            // FK to Game.id
  region: Region;
}
```

### 5.5 Moderation alert

```ts
interface ModAlert {
  id: string;
  severity: "high" | "medium" | "low";
  player: string;
  reason: string;
  time: string;
  action: string;
  gameId: string;
  region: Region;
}
```

### 5.6 AI summary

```ts
interface AISummaryT {
  headline: string;
  bullets: string[];
  generated: string;
}
```

`generateAISummary({ game?, region?, gameType? })` returns a freshly scoped summary.

### 5.7 Heatmap & trend

- `heatmapData: { region; hours: number[] /* length 24 */ }[]` — generated with a **deterministic seeded PRNG** to keep SSR markup identical to client markup (avoids React hydration mismatch).
- `trendData: { hour, positive, excited, neutral, frustrated, negative, toxic }[]` — 24 buckets.

---

## 6. Filter context

`src/lib/filter-context.tsx` is the single global store.

```ts
interface Filters { game: string; gameType: string; region: string; search: string }

interface Ctx {
  filters: Filters;
  setFilter<K extends keyof Filters>(k: K, v: Filters[K]): void;
  resetFilters(): void;
  summary: AISummaryT;
  sweeping: boolean;
  runSweep(): void;
}
```

### `matchesFilters(item, filters, gamesById)`

Pure helper used by every widget. An `item` may carry any subset of `{ gameId, region, player, channel, text }`; the helper returns `true` only when every active filter is satisfied. Free-text search is matched case-insensitively against `player + channel + text`.

### Provider wiring

`FiltersProvider` wraps the app inside `src/routes/__root.tsx`. The header's search input and the `FilterBar` selects both call `setFilter`, so they stay in lockstep.

---

## 7. Routing

File-based; the Vite plugin regenerates `routeTree.gen.ts`. Conventions:

- Flat dot-separated names: `posts.$postId.tsx` → `/posts/:postId`.
- No trailing slashes in `<Link to="…">`.
- Use `@tanstack/react-router` (not `react-router-dom`).
- Imports must use existing files — strict TS is enforced.

Pages live at `/`, `/players`, `/channels`, `/reports`. The header builds nav links from a small array, so adding a route is one line plus a route file.

---

## 8. Styling & design tokens

All colors are semantic CSS variables defined in `src/styles.css` (`oklch`). Components use Tailwind utilities that reference those tokens (e.g. `text-positive`, `bg-card/50`). Rules:

- **Never** hardcode `text-white`, `bg-black`, hex values, etc. in components.
- Add new tokens to `styles.css` first; consume them via Tailwind.
- The shared "card" surface is the `.glass-card` utility — keep widget shells consistent.

The dark theme uses neon accents per emotion to make sentiment data visually scannable.

---

## 9. AI Sweep flow

```
Header [Run AI Sweep]
        │
        ▼
filter-context.runSweep()
        │
        ├── setSweeping(true)
        ├── setTimeout(1400ms)        ← simulated latency
        ├── generateAISummary(filters)
        ├── setSummary(...)
        ├── setSweeping(false)
        └── toast.success(...)
```

`AISummary` and the header button both subscribe to `sweeping` to show a spinner. To wire this to the real Lovable AI Gateway, replace the body of `runSweep()` with a call to a TanStack server function that prompts the gateway and returns an `AISummaryT`.

---

## 10. Extension: real AI classification

When swapping mock data for real classification:

1. Enable Lovable Cloud and the Lovable AI Gateway.
2. Create `src/lib/sentiment.functions.ts`:

   ```ts
   import { createServerFn } from "@tanstack/react-start";
   import { z } from "zod";

   export const classify = createServerFn({ method: "POST" })
     .inputValidator((d) => z.object({ text: z.string().min(1).max(2000) }).parse(d))
     .handler(async ({ data }) => {
       // call Lovable AI Gateway; return { emotion, confidence }
     });
   ```

3. Replace `generateMessage()` in `LiveChatFeed` with a server-function call (or subscribe to a Cloud Realtime channel populated by an ingest webhook).
4. Persist results in a `messages` table behind RLS; aggregate for `trendData` and `heatmapData` via SQL views.

For ingestion from external game servers, add a public webhook route at `app/routes/api/public/chat-ingest.ts`, **always verifying the signature** before writing.

---

## 11. SSR & hydration notes

- `heatmapData` uses a **seeded PRNG**, not `Math.random()`, so server- and client-rendered DOM match. Any new module that derives state at module scope must do the same — never call `Math.random()` or `Date.now()` outside of effects / event handlers / server functions.
- The root layout (`src/routes/__root.tsx`) must always render `<Outlet />`. Removing it makes every child route render blank.
- Do not create `entry-client.tsx` / `entry-server.tsx` — TanStack Start v1's Vite plugin handles SSR entry automatically.

---

## 12. Coding conventions

- TypeScript strict mode; types live next to the data they describe.
- Prefer small, focused components; assemble in route files.
- Reads should go through context or typed modules, not prop-drilled blobs.
- Toast user feedback for every async action (filter changes excluded).
- No raw color literals in JSX; use design tokens.
- No `react-router-dom`; use `@tanstack/react-router`.
- No edits to `src/routeTree.gen.ts`.

---

## 13. Known limitations

- Sentiment classification is mocked.
- Reports / Channels pages render derived static data.
- No persistence — refreshing the page resets the AI summary.
- No authentication or role checks yet.

These are tracked in the README's [Roadmap](./README.md#roadmap).
