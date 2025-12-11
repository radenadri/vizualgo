import type { PathfindingAlgorithm, GridNode } from '../../types'

export const bfs: PathfindingAlgorithm = function* (grid, startNode, endNode) {
  const queue: GridNode[] = [startNode]
  startNode.isVisited = true

  while (queue.length > 0) {
    const currentNode = queue.shift()!

    // If we reached the end
    if (currentNode === endNode) {
      yield* backtrackPath(endNode)
      return
    }

    // Yield visit step for visualization
    if (currentNode !== startNode) {
      yield {
        type: 'visit' as const,
        indices: [currentNode.row, currentNode.col],
        description: `Visiting node at [${currentNode.row}, ${currentNode.col}]`,
        highlightLines: [9] // const node = queue.shift()
      }
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of neighbors) {
      neighbor.isVisited = true
      neighbor.previousNode = currentNode
      queue.push(neighbor)

      yield {
        type: 'explore' as const,
        indices: [neighbor.row, neighbor.col],
        description: `Adding neighbor [${neighbor.row}, ${neighbor.col}] to queue`,
        highlightLines: [15, 16, 17, 18, 19] // neighbor check and queue.push
      }
    }
  }
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = []
  const { row, col } = node

  // Up
  if (row > 0) neighbors.push(grid[row - 1][col])
  // Down
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  // Left
  if (col > 0) neighbors.push(grid[row][col - 1])
  // Right
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

  return neighbors.filter(n => !n.isVisited && !n.isWall)
}

function* backtrackPath(endNode: GridNode) {
  const path: GridNode[] = []
  let currentNode: GridNode | null = endNode

  while (currentNode !== null) {
    path.unshift(currentNode)
    currentNode = currentNode.previousNode
  }

  // Visualize path from Start to End
  for (const node of path) {
    yield {
      type: 'path' as const,
      indices: [node.row, node.col],
      description: `Path [${node.row}, ${node.col}]`,
      highlightLines: [12] // return reconstructPath(end)
    }
  }
}
