// @ts-nocheck
import { describe, expect, it } from 'bun:test'
import { generateMaze } from './generate-maze'

const START = { row: 5, col: 5 }
const END = { row: 5, col: 25 }

describe('generateMaze', () => {
  it('keeps start and end nodes open', () => {
    const grid = generateMaze({
      rows: 15,
      cols: 30,
      start: START,
      end: END,
      seed: 42,
    })

    expect(grid[START.row][START.col].isWall).toBe(false)
    expect(grid[END.row][END.col].isWall).toBe(false)
  })

  it('creates a traversable path between start and end', () => {
    const grid = generateMaze({
      rows: 15,
      cols: 30,
      start: START,
      end: END,
      seed: 42,
    })

    const queue: Array<[number, number]> = [[START.row, START.col]]
    const visited = new Set([`${START.row}:${START.col}`])

    while (queue.length > 0) {
      const [row, col] = queue.shift() as [number, number]

      if (row === END.row && col === END.col) {
        break
      }

      const neighbors: Array<[number, number]> = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ]

      for (const [nextRow, nextCol] of neighbors) {
        if (!grid[nextRow]?.[nextCol]) continue
        if (grid[nextRow][nextCol].isWall) continue

        const key = `${nextRow}:${nextCol}`
        if (visited.has(key)) continue

        visited.add(key)
        queue.push([nextRow, nextCol])
      }
    }

    expect(visited.has(`${END.row}:${END.col}`)).toBe(true)
  })
})
