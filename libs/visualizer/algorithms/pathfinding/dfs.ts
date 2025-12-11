import type { PathfindingAlgorithm, GridNode } from '../../types'

export const dfs: PathfindingAlgorithm = function* (grid, startNode, endNode) {
    const stack: GridNode[] = [startNode]

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
                    highlightLines: [8] // const node = stack.pop()
                }
            }

            if (currentNode === endNode) {
                yield* backtrackPath(endNode)
                return
            }

            // Get neighbors and push to stack
            const neighbors = getUnvisitedNeighbors(currentNode, grid)
            for (const neighbor of neighbors) {
                neighbor.previousNode = currentNode
                stack.push(neighbor)

                yield {
                    type: 'explore' as const,
                    indices: [neighbor.row, neighbor.col],
                    description: `Adding neighbor [${neighbor.row}, ${neighbor.col}] to stack`,
                    highlightLines: [14, 15, 16, 17, 18] // neighbor check and stack.push
                }
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
            highlightLines: [11] // return reconstructPath(end)
        }
    }
}
