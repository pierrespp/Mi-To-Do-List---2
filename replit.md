# Mi To Do List

A personal Kawaii Pride / Queer Aesthetic to-do list app with workspaces, sections, tasks, shift cycles, and two beautiful themes.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/mi-todo run dev` — run the frontend (port 21843)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project (currently unused by backend, available for frontend use)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + Nunito font + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (Replit managed)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/index.ts` — DB schema (workspaces, sections, tasks, shifts)
- `artifacts/api-server/src/routes/` — route handlers (workspaces, sections, tasks, shifts)
- `artifacts/mi-todo/src/pages/` — frontend pages (Home, WorkspacePage)
- `artifacts/mi-todo/src/index.css` — theme variables (`:root` = Clean Pride, `.theme-rainbow` = Soft Rainbow)

## Architecture decisions

- Single-user, no authentication — workspaces are identified by URL slug (`/w/nome-da-lista`)
- Shift system: tasks are archived and recurring tasks re-spawned on "Reiniciar Turno"
- Two CSS themes toggled by adding `.theme-rainbow` class to `<html>` — instant swap, no reload
- Frontend filter by section is client-side (all tasks fetched per workspace, filtered in memory)
- Default sections (Tarefas do Dia, Importantes, Fechamento) auto-created with each new workspace

## Product

- Workspaces at `/w/:slug` — each has its own sections, tasks, and shift cycle
- Sidebar with section navigation, stats (completed/pinned), and ✨ Reiniciar Turno button
- Tasks: create inline (Enter), complete/delete, priority badges, pin + recurring indicators
- Theme switcher (palette icon, bottom right): Soft Rainbow ↔ Clean Pride
- "Reiniciar Turno": archives all tasks, spawns recurring tasks into new shift

## User preferences

- Visual-first: kawaii, premium, queer aesthetic is top priority
- Keep files small and focused — avoid overengineering
- Portuguese UI labels preferred (Tarefas do Dia, Reiniciar Turno, etc.)

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Operations with both path AND query params can cause Orval naming collisions — avoid query params on routes that already have path params or rename the operationId
- The DB is Replit-managed PostgreSQL — do NOT use Supabase DB for persistence

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
