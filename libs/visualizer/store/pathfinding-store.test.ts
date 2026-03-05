// @ts-nocheck
import { describe, expect, it } from 'bun:test'
import { useVisualizerStore } from './index'

describe('pathfinding store actions', () => {
  it('generateMazeGrid resets playback state and keeps start/end open', () => {
    const initial = useVisualizerStore.getState()
    initial.generateMazeGrid(42)

    const next = useVisualizerStore.getState()

    expect(next.currentStepIndex).toBe(-1)
    expect(next.steps.length).toBe(0)
    expect(next.isPlaying).toBe(false)
    expect(next.grid[next.startNode.row][next.startNode.col].isWall).toBe(false)
    expect(next.grid[next.endNode.row][next.endNode.col].isWall).toBe(false)
  })

  it('clearPathfindingStates clears transient traversal markers', () => {
    const state = useVisualizerStore.getState()
    state.generateMazeGrid(7)

    // mutate some node flags
    const node = useVisualizerStore.getState().grid[2][2]
    node.isFrontier = true
    node.frontierOrder = 3
    node.isVisited = true
    node.isPath = true

    useVisualizerStore.getState().clearPathfindingStates()

    const cleared = useVisualizerStore.getState().grid[2][2]
    expect(cleared.isFrontier).toBe(false)
    expect(cleared.frontierOrder).toBeUndefined()
    expect(cleared.isVisited).toBe(false)
    expect(cleared.isPath).toBe(false)
  })
})
