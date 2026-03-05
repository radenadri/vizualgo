# Pathfinding Maze Visualization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a maze-first pathfinding workflow with clearer per-step tile differentiation so traversal behavior is easy to understand.

**Architecture:** Introduce a dedicated maze-generation module that prepares a traversable wall/corridor grid, then run existing BFS/DFS/Dijkstra over that grid. Keep the existing generator + step-replay architecture, but add explicit UI state mapping for frontier/visited/path and wire controls for maze generation. This keeps changes localized to pathfinding modules, store state/actions, and pathfinding UI components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, Bun, Biome.

---

### Task 1: Add deterministic maze generator + tests

**Files:**
- Create: `libs/visualizer/algorithms/pathfinding/generate-maze.ts`
- Create: `libs/visualizer/algorithms/pathfinding/generate-maze.test.ts`
- Modify: `libs/visualizer/algorithms/pathfinding/index.ts` (create if missing and export generator)

**Step 1: Write the failing tests**

```ts
import { describe, expect, it } from 'bun:test'
import { generateMaze } from './generate-maze'

describe('generateMaze', () => {
  it('keeps start and end open', () => {
    const grid = generateMaze({ rows: 15, cols: 30, start: { row: 5, col: 5 }, end: { row: 5, col: 25 }, seed: 42 })
    expect(grid[5][5].isWall).toBe(false)
    expect(grid[5][25].isWall).toBe(false)
  })

  it('produces at least one traversable path from start to end', () => {
    const grid = generateMaze({ rows: 15, cols: 30, start: { row: 5, col: 5 }, end: { row: 5, col: 25 }, seed: 42 })
    // quick BFS reachability check in test
    const visited = new Set<string>()
    const q: Array<[number, number]> = [[5, 5]]
    const key = (r: number, c: number) => `${r}:${c}`

    while (q.length) {
      const [r, c] = q.shift()!
      if (r === 5 && c === 25) break
      for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
        if (!grid[nr]?.[nc]) continue
        if (grid[nr][nc].isWall) continue
        const k = key(nr, nc)
        if (visited.has(k)) continue
        visited.add(k)
        q.push([nr, nc])
      }
    }

    expect(visited.has('5:25')).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `bun test libs/visualizer/algorithms/pathfinding/generate-maze.test.ts`
Expected: FAIL with module/function not found.

**Step 3: Write minimal implementation**

```ts
import type { GridNode } from '../../types'

type Coord = { row: number; col: number }

interface GenerateMazeInput {
  rows: number
  cols: number
  start: Coord
  end: Coord
  seed?: number
}

const createRng = (seed = Date.now()) => {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

const makeNode = (row: number, col: number, start: Coord, end: Coord): GridNode => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isEnd: row === end.row && col === end.col,
  isWall: true,
  isVisited: false,
  isPath: false,
  distance: Infinity,
  previousNode: null,
})

export const generateMaze = ({ rows, cols, start, end, seed }: GenerateMazeInput): GridNode[][] => {
  const rand = createRng(seed)
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeNode(r, c, start, end))
  )

  // Simple guaranteed corridor first (YAGNI baseline)
  for (let c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++) {
    grid[start.row][c].isWall = false
  }

  // Random side openings for maze-like texture
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if ((r === start.row && c >= Math.min(start.col, end.col) && c <= Math.max(start.col, end.col))) continue
      grid[r][c].isWall = rand() < 0.35
    }
  }

  grid[start.row][start.col].isWall = false
  grid[end.row][end.col].isWall = false
  return grid
}
```

**Step 4: Run test to verify it passes**

Run: `bun test libs/visualizer/algorithms/pathfinding/generate-maze.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add libs/visualizer/algorithms/pathfinding/generate-maze.ts libs/visualizer/algorithms/pathfinding/generate-maze.test.ts libs/visualizer/algorithms/pathfinding/index.ts
git commit -m "feat: add deterministic maze generation for pathfinding"
```

### Task 2: Add store action for maze generation and frontier state reset

**Files:**
- Modify: `libs/visualizer/types/index.ts`
- Modify: `libs/visualizer/store/index.ts`

**Step 1: Write the failing test**

Create a targeted state test file:
- Create: `libs/visualizer/store/pathfinding-store.test.ts`

```ts
import { describe, expect, it } from 'bun:test'
import { useVisualizerStore } from './index'

describe('pathfinding store maze actions', () => {
  it('generateMazeGrid resets playback and keeps start/end open', () => {
    const state = useVisualizerStore.getState()
    state.generateMazeGrid(123)

    const next = useVisualizerStore.getState()
    expect(next.currentStepIndex).toBe(-1)
    expect(next.steps.length).toBe(0)
    expect(next.grid[next.startNode.row][next.startNode.col].isWall).toBe(false)
    expect(next.grid[next.endNode.row][next.endNode.col].isWall).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `bun test libs/visualizer/store/pathfinding-store.test.ts`
Expected: FAIL because `generateMazeGrid` is missing.

**Step 3: Write minimal implementation**

In `libs/visualizer/types/index.ts`, extend `GridNode` with optional transient UI state:

```ts
frontierOrder?: number
```

In `libs/visualizer/store/index.ts`:
- import `generateMaze`
- add action to interface and store implementation:

```ts
generateMazeGrid: (seed?: number) => void
clearPathfindingStates: () => void
```

Implementation behavior:
- `generateMazeGrid(seed)` replaces `grid`, clears `steps`, sets `currentStepIndex: -1`, `isPathFound: false`, `isPlaying: false`
- `clearPathfindingStates()` clears `isVisited`, `isPath`, `frontierOrder`, and algorithm internals (`distance`, `previousNode`) without removing walls

**Step 4: Run test to verify it passes**

Run: `bun test libs/visualizer/store/pathfinding-store.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add libs/visualizer/types/index.ts libs/visualizer/store/index.ts libs/visualizer/store/pathfinding-store.test.ts
git commit -m "feat: add maze grid and pathfinding reset actions to store"
```

### Task 3: Normalize pathfinding step semantics for clearer visualization

**Files:**
- Modify: `libs/visualizer/algorithms/pathfinding/bfs.ts`
- Modify: `libs/visualizer/algorithms/pathfinding/dfs.ts`
- Modify: `libs/visualizer/algorithms/pathfinding/dijkstra.ts`

**Step 1: Write failing tests for step contract**

Create:
- `libs/visualizer/algorithms/pathfinding/pathfinding-steps.test.ts`

```ts
import { describe, expect, it } from 'bun:test'
import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'

const run = (algo: any, grid: any[][], start: any, end: any) => [...algo(grid, start, end)]

describe('pathfinding step semantics', () => {
  it('emits explore/visit/path in valid sequence for BFS', () => {
    const steps = run(bfs, makeSimpleGrid(), startNode(), endNode())
    expect(steps.some((s) => s.type === 'explore')).toBe(true)
    expect(steps.some((s) => s.type === 'visit')).toBe(true)
    expect(steps.at(-1)?.type).toBe('path')
  })

  it('never emits wall nodes in explore/visit/path for DFS and Dijkstra', () => {
    for (const algo of [dfs, dijkstra]) {
      const { grid, isWallAt } = makeSimpleGridWithWalls()
      const steps = run(algo, grid, startNode(), endNode())
      for (const step of steps.filter((s) => ['explore', 'visit', 'path'].includes(s.type))) {
        const [r, c] = step.indices
        expect(isWallAt(r, c)).toBe(false)
      }
    }
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `bun test libs/visualizer/algorithms/pathfinding/pathfinding-steps.test.ts`
Expected: FAIL where semantics/filtering are inconsistent.

**Step 3: Implement minimal contract fixes**

For each algorithm:
- Ensure neighbors filter excludes walls before enqueue/push/relax.
- Emit `explore` when discovered/frontier-enqueued.
- Emit `visit` when node is popped/dequeued/processed.
- Emit `path` only during backtrack from reached end.
- Keep `highlightLines`/descriptions aligned with existing code viewer behavior.

**Step 4: Run tests to verify pass**

Run: `bun test libs/visualizer/algorithms/pathfinding/pathfinding-steps.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add libs/visualizer/algorithms/pathfinding/bfs.ts libs/visualizer/algorithms/pathfinding/dfs.ts libs/visualizer/algorithms/pathfinding/dijkstra.ts libs/visualizer/algorithms/pathfinding/pathfinding-steps.test.ts
git commit -m "refactor: normalize pathfinding step semantics for visualization"
```

### Task 4: Update pathfinding controls and grid rendering for maze UX

**Files:**
- Modify: `components/viz/control-panel.tsx`
- Modify: `components/viz/grid-canvas.tsx`
- Modify: `libs/visualizer/store/index.ts`

**Step 1: Write failing UI behavior tests**

Create:
- `components/viz/pathfinding-controls.test.tsx`

```tsx
import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ControlPanel } from './control-panel'

describe('pathfinding controls', () => {
  it('renders Generate Maze action in pathfinding mode', () => {
    render(<ControlPanel mode="pathfinding" onGenerate={() => {}} />)
    expect(screen.getByRole('button', { name: /generate maze/i })).toBeInTheDocument()
  })

  it('disables maze generation while playing', async () => {
    // set store state isPlaying=true before render
    // assert disabled button
  })
})
```

**Step 2: Run test to verify it fails**

Run: `bun test components/viz/pathfinding-controls.test.tsx`
Expected: FAIL (button missing/disabled behavior missing).

**Step 3: Implement minimal UI and render-state updates**

In `control-panel.tsx` pathfinding controls:
- Add `Generate Maze` button wired to `generateMazeGrid()`.
- Keep existing `Clear` behavior but map to `clearPathfindingStates()`.
- Disable `Generate Maze`, `Play`, and `Next/Prev` appropriately when `isPlaying`.

In `grid-canvas.tsx`:
- Keep terrain base (`wall/corridor`) visible.
- Add explicit class mapping for frontier vs visited vs path (e.g., `isPath` highest priority, then visited/frontier, then base).
- Preserve start/end style priority.

In `store/index.ts` step-apply logic:
- map `explore` to `frontierOrder` or a frontier marker state,
- map `visit` to `isVisited=true`,
- map `path` to `isPath=true`.

**Step 4: Run test to verify it passes**

Run: `bun test components/viz/pathfinding-controls.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/viz/control-panel.tsx components/viz/grid-canvas.tsx libs/visualizer/store/index.ts components/viz/pathfinding-controls.test.tsx
git commit -m "feat: add maze controls and clearer pathfinding tile states"
```

### Task 5: Full verification and docs alignment

**Files:**
- Modify: `CLAUDE.md` (if command/test instructions changed materially)
- Modify: `docs/plans/2026-03-06-pathfinding-maze-visual-design.md` (only if implementation scope changed)

**Step 1: Run repo validation commands**

Run:
- `bun lint`
- `bun typecheck`
- `bun run test-all.ts`
- `bun test libs/visualizer/algorithms/pathfinding/generate-maze.test.ts`
- `bun test libs/visualizer/algorithms/pathfinding/pathfinding-steps.test.ts`
- `bun test libs/visualizer/store/pathfinding-store.test.ts`
- `bun test components/viz/pathfinding-controls.test.tsx`

Expected: All pass.

**Step 2: Manual QA in browser**

Run: `bun dev`

Check:
- Generate Maze creates varied corridor layouts.
- Start/end remain visible and walkable.
- BFS/DFS/Dijkstra exploration patterns are visually distinct.
- Frontier/visited/path progression is understandable.
- Playback controls behave correctly during animation.

**Step 3: Commit final polish/docs (if any)**

```bash
git add CLAUDE.md docs/plans/2026-03-06-pathfinding-maze-visual-design.md
git commit -m "docs: align guidance with maze-mode pathfinding workflow"
```
