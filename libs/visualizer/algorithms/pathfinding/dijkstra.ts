import type { PathfindingAlgorithm, GridNode } from '../../types'

export const dijkstra: PathfindingAlgorithm = function*(grid, startNode, endNode) {
    const unvisitedNodes: GridNode[] = []
    
    // Flatten grid to list of nodes
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity
            node.previousNode = null
            unvisitedNodes.push(node)
        }
    }
    
    startNode.distance = 0
    
    // Sort unvisited nodes by distance
    // In efficient implementation use Priority Queue
    // For small grid, sorting array is fine (O(N^2) total)
    
    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()!
        
        // Wall check
        if (closestNode.isWall) continue
        
        // Impossible to reach
        if (closestNode.distance === Infinity) return
        
        closestNode.isVisited = true
        
        if (closestNode !== startNode) {
            yield {
                type: 'visit' as const,
                indices: [closestNode.row, closestNode.col],
                description: `Visiting [${closestNode.row}, ${closestNode.col}] with distance ${closestNode.distance}`,
                highlightLines: []
            }
        }
        
        if (closestNode === endNode) {
            yield* backtrackPath(endNode)
            return
        }
        
        updateUnvisitedNeighbors(closestNode, grid)
    }
}

function sortNodesByDistance(unvisitedNodes: GridNode[]) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node: GridNode, grid: GridNode[][]) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
        // Distance is 1 for unweighted grid
        // If we add weights, this changes to node.distance + neighbor.weight
        const newDistance = node.distance + 1 
        // For Dijkstra on unweighted graph, it's essentially BFS, but logically driven by distance.
        if (newDistance < neighbor.distance) {
             neighbor.distance = newDistance
             neighbor.previousNode = node
        }
    }
}

function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  return neighbors.filter(n => !n.isVisited)
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
