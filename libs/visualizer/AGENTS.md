# VISUALIZER ENGINE

Core algorithm execution and state management module.

## STRUCTURE

```
visualizer/
├── store/index.ts       # Zustand state (411 lines)
├── types/index.ts       # AnimationStep, node types
├── content/index.ts     # Algorithm descriptions
└── algorithms/
    ├── sorting/         # bubble, selection, insertion, merge, quick
    ├── pathfinding/     # bfs, dfs, dijkstra
    ├── linked-list/     # operations
    └── bst/             # operations
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add sorting algo | `algorithms/sorting/` - export generator |
| Add pathfinding | `algorithms/pathfinding/` - uses GridNode[][] |
| State actions | `store/index.ts` - Zustand actions |
| Animation types | `types/index.ts` - AnimationStep type |

## CONVENTIONS

### Algorithm Pattern
```typescript
export function* bubbleSort(arr: number[]): Generator<AnimationStep> {
  yield { type: 'compare', indices: [i, j] }
  yield { type: 'swap', indices: [i, j], snapshot: [...arr] }
}
```

### AnimationStep Fields
- `type`: compare|swap|write|pivot|sorted|visit|explore|path|create|delete|link|unlink
- `indices`: affected array positions
- `description?`: step explanation for UI
- `highlightLines?`: code line numbers
- `snapshot?`: array state after mutation
- `nodeId?`, `targetId?`, `value?`: for tree/list ops

### Store Patterns
- `applyStep(step)`: applies animation to current state
- `nextStep()`, `prevStep()`: playback controls
- Grid: 15 rows x 30 cols default
- Auto-init on mount via setTimeout

## ANTI-PATTERNS

- **NO direct state mutation** - always use store actions
- **NO async algorithms** - must be synchronous generators
- **NO missing snapshots** - swap/write steps need snapshot for undo
