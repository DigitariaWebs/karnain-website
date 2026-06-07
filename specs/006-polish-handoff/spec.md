# Spec 006 — Polish & handoff

- **Status:** shipped
- **Type:** enhancement
- **Requested by / owner:** Achraf Arabi / progix
- **Date:** 2026-06-07
- **Slice / areas touched:** remove `src/features/task-list` + `src/app/(site)/examples`, `e2e/task-list.spec.ts`; `README.md`; product docs

## Problem (the why)

The real Karnain features have shipped, but the repo still carried the skeleton’s
`task-list` demo and a skeleton-flavoured README. Both mislead a reader about what the
product is and add dead surface.

## Desired behavior (the what)

The demo is gone, the README describes Karnain (including how to run and how to connect
Supabase), and the docs reflect the current feature set. The public site and all gates are
unchanged and green.

## Acceptance criteria

- **AC-1:** The `task-list` slice, `/examples/tasks` route, and its e2e spec are removed;
  nothing imports them; `pnpm verify` + e2e (CUJ-A/B/C) stay green.
- **AC-2:** Its feature doc is archived (not deleted) with a “removed” note; CUJ-02 and the
  features index are updated.
- **AC-3:** `README.md` describes Karnain: stack, quickstart, Supabase setup, structure.
- **AC-4:** No `any`, `@ts-ignore`, stray `console.log`, or non-`TODO(client)` TODOs in `src`.

## Out of scope

- Removing the teaching examples that reference `task-list` in `docs/conventions/*` (they
  illustrate patterns and remain valid) and the historical `specs/001-task-list` + report.

## CUJ impact

- Removes CUJ-02 (skeleton demo). Public CUJs A/B/C unchanged.
