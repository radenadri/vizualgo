import type { PathfindingAlgorithm, GridNode } from '../../types'

export const dijkstra: PathfindingAlgorithm = function* (grid, startNode, endNode) {
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
                highlightLines: [7, 8] // const node = pq.dequeue(), node.visited = true
            }
        }

        if (closestNode === endNode) {
            yield* backtrackPath(endNode)
            return
        }

        // Update neighbors
        const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid)
        for (const neighbor of unvisitedNeighbors) {
            const newDistance = closestNode.distance + 1
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance
                neighbor.previousNode = closestNode

                yield {
                    type: 'explore' as const,
                    indices: [neighbor.row, neighbor.col],
                    description: `Updating distance of [${neighbor.row}, ${neighbor.col}] to ${newDistance}`,
                    highlightLines: [16, 17, 18, 19, 20] // distance update block
                }
            }
        }
    }
}

function sortNodesByDistance(unvisitedNodes: GridNode[]) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
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
            highlightLines: [13] // return reconstructPath(end)
        }
    }
}
