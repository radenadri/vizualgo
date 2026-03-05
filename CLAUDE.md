# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

- Install dependencies: `bun install`
- Start dev server: `bun dev`
- Build production bundle: `bun build`
- Start production server: `bun start`
- Lint: `bun lint`
- Auto-fix lint issues: `bun lint:fix`
- Format code: `bun format`
- Type-check: `bun typecheck`

### Validation / test commands

This repo does not use a formal unit test runner yet. Validation is done via lint/typecheck and the algorithm smoke script.

- Run algorithm smoke checks: `bun run test-all.ts`
- Run one algorithm smoke check (example):
  `bun -e "import { bubbleSort } from './libs/visualizer/algorithms/sorting/bubble-sort'; const arr=[5,3,1]; const a=[...arr]; for (const s of bubbleSort(arr)) { if (s.type==='swap'){const [i,j]=s.indices; [a[i],a[j]]=[a[j],a[i]]} else if (s.type==='write'&&s.snapshot){const [i]=s.indices; const [v]=s.snapshot; a[i]=v;} } console.log(a.join(','));"`

## Tooling and repo-specific rules

- Package manager is **bun** (`packageManager: bun@1.3.0`).
- Lint/format is **Biome** (not ESLint).
- Pre-commit hook runs: `bun biome check --max-diagnostics=200 --write {staged_files}`.
- Custom Biome plugin rules in `biome-plugins/` enforce:
  - no anchor elements,
  - no unnecessary `forwardRef`,
  - no relative parent imports (`../`) in favor of absolute alias imports.
- TypeScript path alias: `~/*` maps to repo root (see `tsconfig.json`).

## High-level architecture

### App shell and routing

- Next.js App Router project.
- Main route behavior is defined in `next.config.ts`:
  - `/` is rewritten to `/home`.
  - `/home` redirects back to `/` (canonicalization behavior exists alongside rewrite).
- `app/page.tsx` is a client wrapper that re-exports `app/(pages)/home/page.tsx`.
- `app/layout.tsx` defines metadata/SEO defaults and injects Microsoft Clarity script.

### Core product model

The app is an algorithm visualizer with four modes:

- sorting
- pathfinding
- linked list
- BST

The main mode orchestration happens in `app/(pages)/home/page.tsx`, which:

- selects algorithm mode,
- chooses specific algorithm implementations,
- calls store actions to generate animation steps,
- renders mode-specific canvas + shared control panel + code viewer.

### Visualization engine

`libs/visualizer/` is the core engine:

- `algorithms/*`: algorithm implementations
- `types/index.ts`: shared contract (`AnimationStep`, node types, algorithm function signatures)
- `store/index.ts`: Zustand state machine and playback logic
- `content/index.ts`: algorithm descriptions/metadata shown in UI

Critical pattern: algorithms are synchronous **generators** that emit `AnimationStep` objects. UI replay is step-driven rather than algorithm-running-in-real-time.

### State and playback flow

`useVisualizerStore` is the central state boundary:

1. `generate*Steps(...)` executes an algorithm generator and records all steps.
2. Playback (`nextStep`, `prevStep`, `jumpToStep`) applies/replays steps onto current visual state.
3. Canvases render derived state from the store.

This means feature work usually touches all three layers:

- algorithm generator output,
- `AnimationStep` type compatibility,
- step application logic in store and canvas rendering.

### UI composition

`components/viz/` contains rendering and controls:

- mode canvases (`visualizer-canvas`, `grid-canvas`, `linked-list-canvas`, `bst-canvas`)
- `control-panel` for playback and generation actions
- `code-viewer` for algorithm source display

Main page composes these; canvases should stay focused on presentation of store state.

## Practical guidance for future edits

- When adding an algorithm, update:
  1. implementation in `libs/visualizer/algorithms/...`
  2. metadata in `libs/visualizer/content/index.ts`
  3. algorithm selection map in `app/(pages)/home/page.tsx`
  4. step handling compatibility in `libs/visualizer/store/index.ts` if introducing new step behavior.
- Prefer `~` absolute imports to satisfy lint rules.
- Run at least: `bun lint && bun typecheck && bun run test-all.ts` before finishing changes.
