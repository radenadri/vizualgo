import type { PathfindingAlgorithm, GridNode } from '../../types'

export const bfs: PathfindingAlgorithm = function*(grid, startNode, endNode) {
  const queue: GridNode[] = [startNode]
  // We need to track visited status locally to avoid modifying the passed grid directly
  // IF the grid passed is a fresh clone. 
  // But wait, the generator modifies 'grid' locally, visualizer updates UI based on steps?
  // Actually, visualizer store usually replays steps to update state. 
  // BUT for algorithm correctness, we need to know what's visited *during* calculation.
  // Since we receive a clone in the store `generatePathfindingSteps`, we can mutate it freely for logic.
  
  startNode.isVisited = true
  // Note: We don't yield "visit start" usually, or we can.
  
  while (queue.length > 0) {
    const currentNode = queue.shift()!
    
    // If we reached the end
    if (currentNode === endNode) {
        // Backtrack
        yield* backtrackPath(endNode)
        return
    }
    
    // Yield visit step for visualization (except start maybe?)
        if (currentNode !== startNode) {
        yield {
            type: 'visit' as const,
            indices: [currentNode.row, currentNode.col],
            description: `Visiting node at [${currentNode.row}, ${currentNode.col}]`,
            highlightLines: []
        }
    }
    
    const neighbors = getUnvisitedNeighbors(currentNode, grid)
    for (const neighbor of neighbors) {
      neighbor.isVisited = true
      neighbor.previousNode = currentNode
      queue.push(neighbor)
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
    
    // Visualizer path from Start to End
    for (const node of path) {
        yield {
            type: 'path' as const,
            indices: [node.row, node.col],
            description: `Path [${node.row}, ${node.col}]`,
            highlightLines: []
        }
    }
}
