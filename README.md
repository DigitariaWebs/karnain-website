# NEXTJS-SKELETON

A production-grade Next.js starting point built on one premise: **AI agents write most of the code, the repository itself guarantees the quality.** Docs carry the knowledge, specs carry the intent, gates enforce the taste, screenshots prove the result.

> Agents: your entry point is [AGENTS.md](AGENTS.md). Humans: keep reading.

## Stack

Next.js 16 (App Router, RSC) · TypeScript strict · Tailwind CSS v4 + shadcn/ui · Zustand 5 · Motion · Vitest + Testing Library · Playwright · pnpm · ESLint 9 (+ enforced module boundaries) · Prettier · Husky + commitlint.

## Quickstart

```bash
corepack enable                       # or: npm i -g pnpm
pnpm install
pnpm exec playwright install chromium # once, for e2e + PDF rendering
pnpm dev                              # http://localhost:3000
pnpm verify                           # the full local gate (same as CI)
pnpm e2e:shots                        # CUJ tests + screenshot evidence
```

For AI-driven work, open the repo in Claude Code (or any agent that reads `AGENTS.md`) and start with `/create-spec`.

## How work happens here

| You want to…                | Do                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Fix a bug / small change    | branch → implement → `pnpm verify` → PR (quick track)                                                                        |
| Ship a feature              | `/create-spec` → `/plan-feature` → `/implement-feature` → `/verify-ui` → `/review` → `/feature-report` → PR → `/update-docs` |
| Add a feature module        | `/new-module <name>`                                                                                                         |
| Make a correction permanent | `/encode-lesson`                                                                                                             |

The full process, roles (PM, dev, tester, designer), and conflict-avoidance model: [docs/process/workflow.md](docs/process/workflow.md).

## Map

```
AGENTS.md            agent operating model (CLAUDE.md imports it)
docs/                the knowledge tree — INDEX.md is the map
specs/               constitution + feature specs (SDD)
.claude/             skills, reviewer subagents, hooks, path rules
src/app|features|components|hooks|lib|core   layered code (ESLint-enforced)
e2e/                 Playwright CUJ tests → artifacts/screenshots evidence
docs/reports/        generated feature reports (diff + screenshots + verdicts)
scripts/             repo gates (docs links, typography) + report-to-PDF
.github/             CI: quality gates, e2e + evidence upload, AI persona review
```

## CI

Three workflows run on every PR: **CI** (lint/types/format/docs/typography/tests/build), **E2E** (Playwright + screenshot artifacts), and **Claude persona review** (AI review board against `docs/personas/` — needs the `ANTHROPIC_API_KEY` secret; set it up with `/install-github-app` from Claude Code). Branch protection on `main` should require the first two.

## Cloning this skeleton for a new project

1. Fill in `docs/product/overview.md` (product identity) and prune `docs/product/features/`.
2. Replace the painted-door stub in `src/features/task-list/actions.ts` or delete the example slice (`src/features/task-list` + `src/app/examples`).
3. Update `.github/CODEOWNERS` placeholders and repo secrets.
4. Write your first spec: `/create-spec`.

## Why it's built this way

Every structural decision has an ADR in [docs/architecture/decisions/](docs/architecture/decisions/README.md). The two-page version: [docs/architecture/overview.md](docs/architecture/overview.md) and the engineering [constitution](specs/constitution.md).
