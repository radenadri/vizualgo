import type { GridNode } from '../../types'

type Coord = { row: number; col: number }

interface GenerateMazeInput {
  rows: number
  cols: number
  start: Coord
  end: Coord
  seed?: number
}

const makeRng = (seed = Date.now()) => {
  let state = seed >>> 0
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

const createNode = (row: number, col: number, start: Coord, end: Coord): GridNode => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isEnd: row === end.row && col === end.col,
  isWall: true,
  isVisited: false,
  isPath: false,
  isFrontier: false,
  frontierOrder: undefined,
  distance: Infinity,
  previousNode: null,
})

export const generateMaze = ({ rows, cols, start, end, seed }: GenerateMazeInput): GridNode[][] => {
  const rand = makeRng(seed)
  const grid = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => createNode(row, col, start, end))
  )

  const minCol = Math.min(start.col, end.col)
  const maxCol = Math.max(start.col, end.col)

  for (let col = minCol; col <= maxCol; col++) {
    grid[start.row][col].isWall = false
  }

  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      const inSafeCorridor = row === start.row && col >= minCol && col <= maxCol
      if (inSafeCorridor) continue

      grid[row][col].isWall = rand() < 0.35
    }
  }

  grid[start.row][start.col].isWall = false
  grid[end.row][end.col].isWall = false

  return grid
}
