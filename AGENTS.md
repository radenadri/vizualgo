# VIZUALGO - KNOWLEDGE BASE

**Generated:** 2025-01-25
**Commit:** 453c364
**Branch:** main

## OVERVIEW

Interactive algorithm visualizer for sorting, pathfinding, linked lists, and BST operations. Built with Next.js 16 + React 19 + Zustand + Tailwind 4.

## STRUCTURE

```
vizualgo/
├── app/                 # Next.js App Router
│   ├── (pages)/home/    # Main interactive UI
│   └── page.tsx         # Re-exports home (client wrapper)
├── components/viz/      # Canvas + control components
├── libs/visualizer/     # Algorithm engine (see AGENTS.md)
├── biome-plugins/       # Custom Biome rules
└── types/               # Global TS types
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add algorithm | `libs/visualizer/algorithms/{category}/` | Must be generator yielding AnimationStep |
| Algorithm metadata | `libs/visualizer/content/index.ts` | Descriptions, complexities |
| State management | `libs/visualizer/store/index.ts` | Zustand store (411 lines) |
| Type definitions | `libs/visualizer/types/index.ts` | AnimationStep, GridNode, etc. |
| UI modes | `app/(pages)/home/page.tsx` | sorting/pathfinding/linkedlist/bst |
| Canvas rendering | `components/viz/*-canvas.tsx` | Per-mode visualization |

## CONVENTIONS

### Routing
- `/` rewrites to `/home` (next.config.ts)
- Route groups: `(pages)/` for page organization

### Code Style (Biome)
- Single quotes, no semicolons, trailing commas ES5
- `useImportType` / `useExportType` enforced
- No nested ternaries
- kebab-case or camelCase for files

### Algorithms
- All algorithms are **generators** yielding `AnimationStep`
- Each step has: type, indices, optional description/highlightLines
- AnimationType: compare|swap|write|pivot|sorted|visit|explore|path|wall|create|delete|link|unlink|select

## ANTI-PATTERNS

- **NO anchor elements** - custom Biome plugin enforces
- **NO unnecessary forwardRef** - use ref as prop
- **NO relative parent imports** (../) - use absolute paths
- **NO ESLint** - Biome only

## COMMANDS

```bash
bun dev          # Start dev server
bun build        # Production build
bun lint         # Biome check
bun check        # Biome format + lint
```

## NOTES

- Package manager: **bun** (not npm/pnpm/yarn)
- React 19 with `use client` for interactive pages
- Store auto-initializes array on mount (setTimeout)
