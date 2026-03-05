// @ts-nocheck
import { describe, expect, it } from 'bun:test'
import type { GridNode } from '../../types'
import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'

const makeNode = (row: number, col: number): GridNode => ({
  row,
  col,
  isStart: false,
  isEnd: false,
  isWall: false,
  isVisited: false,
  isPath: false,
  isFrontier: false,
  frontierOrder: undefined,
  distance: Infinity,
  previousNode: null,
})

const buildGrid = () => {
  const rows = 5
  const cols = 5

  const grid = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => makeNode(row, col))
  )

  const start = grid[1][1]
  const end = grid[3][3]

  start.isStart = true
  end.isEnd = true

  // Add one wall to validate no step emitted on wall
  grid[2][2].isWall = true

  return {
    grid,
    start,
    end,
    isWallAt: (row: number, col: number) => grid[row][col].isWall,
  }
}

describe('pathfinding step semantics', () => {
  it('BFS emits explore and visit steps and ends with path', () => {
    const { grid, start, end } = buildGrid()
    const steps = [...bfs(grid, start, end)]

    expect(steps.some((step) => step.type === 'explore')).toBe(true)
    expect(steps.some((step) => step.type === 'visit')).toBe(true)
    expect(steps.at(-1)?.type).toBe('path')
  })

  it('DFS and Dijkstra never emit wall nodes for explore/visit/path', () => {
    for (const runAlgorithm of [dfs, dijkstra]) {
      const { grid, start, end, isWallAt } = buildGrid()
      const steps = [...runAlgorithm(grid, start, end)]

      for (const step of steps.filter((item) => item.type === 'explore' || item.type === 'visit' || item.type === 'path')) {
        const [row, col] = step.indices
        expect(isWallAt(row, col)).toBe(false)
      }
    }
  })
})
