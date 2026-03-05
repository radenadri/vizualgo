# Pathfinding Maze Visual Design

## Goal
Improve pathfinding visualization clarity by introducing a maze-first scenario and clearer tile-state differentiation so users can understand traversal progression at a glance.

## Scope
- Pathfinding mode only (`bfs`, `dfs`, `dijkstra`)
- Add maze generation workflow
- Improve visual state mapping for `explore`, `visit`, and `path`
- Keep existing playback model and algorithm selection UX

## Architecture
1. Add a maze generation module in `libs/visualizer/algorithms/pathfinding/` that creates traversable corridors while preserving start/end accessibility.
2. Keep BFS/DFS/Dijkstra as path solvers, running on generated maze grids.
3. Use the existing step-driven replay model (`AnimationStep` via Zustand store) and improve the semantic-to-style mapping for step types.
4. Expose maze generation through pathfinding controls without altering non-pathfinding modes.

## Component and Data Flow
1. User clicks **Generate Maze** in pathfinding controls.
2. Store replaces grid with generated maze (walls + corridors), resets playback state, clears prior pathfinding steps.
3. User runs selected algorithm (`bfs`, `dfs`, or `dijkstra`).
4. Algorithm yields steps:
   - `explore` = frontier candidate
   - `visit` = processed node
   - `path` = final shortest/found route
5. `GridCanvas` renders layered tile states:
   - base terrain (wall/corridor)
   - traversal overlay (frontier/visited/path)
   - special markers (start/end)

## UI/UX Behavior
- Add **Generate Maze** action in pathfinding controls.
- Disable Generate/Run controls while playback is active (`isPlaying`) to prevent state races.
- Keep algorithm selection and speed settings intact across maze regenerations.
- If no route exists, finish gracefully with no `path` animation instead of failing.

## Implementation Notes
- Reuse `GridNode` model; add minimal optional fields only if needed for transient visual state (e.g., frontier marker/order), avoiding unnecessary schema growth.
- Preserve existing wall toggling behavior for manual editing after maze creation.
- Ensure start/end cannot become walls during generation or paint interactions.
- Keep style updates in `components/viz/grid-canvas.tsx` driven by current store state.

## Validation Plan
### Automated
- `bun lint`
- `bun typecheck`
- `bun run test-all.ts`

### Manual
- Generate maze multiple times and verify varied layouts.
- Run BFS/DFS/Dijkstra on same maze and verify distinct exploration patterns.
- Verify clear progression of tile states (frontier → visited → path).
- Verify start/end always remain visible and traversable.
- Verify playback controls still work correctly (play/pause/step/jump/reset).
