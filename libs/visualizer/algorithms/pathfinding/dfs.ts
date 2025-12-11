import type { PathfindingAlgorithm, GridNode } from '../../types'

export const dfs: PathfindingAlgorithm = function*(grid, startNode, endNode) {
    const stack: GridNode[] = [startNode]
    
    // We can use a recursive helper *generator* too.
    // yield* dfsHelper(startNode)
    
    // Iterative approach
    while (stack.length > 0) {
        const currentNode = stack.pop()!
        
        if (!currentNode.isVisited) {
            currentNode.isVisited = true
            
            if (currentNode !== startNode) {
                yield {
                    type: 'visit' as const,
                    indices: [currentNode.row, currentNode.col],
                    description: `Visiting [${currentNode.row}, ${currentNode.col}]`,
                    highlightLines: []
                }
            }
            
            if (currentNode === endNode) {
                yield* backtrackPath(endNode)
                return
            }
            
            // Get neighbors
            // For DFS usually we push in reverse order of how we want to visit? 
            // Neighbors order: Up, Right, Down, Left -> Pop Left first?
            const neighbors = getUnvisitedNeighbors(currentNode, grid)
            for (const neighbor of neighbors) {
                neighbor.previousNode = currentNode
                stack.push(neighbor)
            }
        }
    }
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = []
  const { row, col } = node
  
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  
  return neighbors.filter(n => !n.isVisited && !n.isWall)
}

function* backtrackPath(endNode: GridNode) {
    const path: GridNode[] = []
    let currentNode: GridNode | null = endNode
    
    while (currentNode !== null) {
        path.unshift(currentNode)
        currentNode = currentNode.previousNode
    }
    
    for (const node of path) {
        yield {
            type: 'path' as const,
            indices: [node.row, node.col],
            description: `Path [${node.row}, ${node.col}]`,
            highlightLines: []
        }
    }
}
