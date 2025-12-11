import type { BSTAlgorithm, BSTNode } from '../../types'

// Helper for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9)

const ROOT_X = 50 // Percent
const ROOT_Y = 10 // Percent
const LEVEL_HEIGHT = 15 // Percent vertical space

export const bstAlgorithm: BSTAlgorithm = function* (rootId, nodes, operation, payload) {
    if (operation === 'insert') {
        const value = payload as number
        const newNodeId = generateId()

        // Root case
        if (!rootId) {
            yield {
                type: 'create',
                indices: [],
                nodeId: newNodeId,
                value: value,
                x: ROOT_X,
                y: ROOT_Y,
                description: `Creating root node ${value}`,
                highlightLines: [6, 7, 8] // if (!this.root) { this.root = node; return; }
            }
            return
        }

        // Traverse
        let currentId = rootId
        let depth = 0
        let horizontalSpan = 25 // Initial span from center

        // Yield selection of root
        yield {
            type: 'select',
            indices: [],
            nodeId: currentId,
            description: `Starting at root: ${nodes[currentId].value}`,
            highlightLines: [11] // let current = this.root
        }

        while (true) {
            const currentNode = nodes[currentId]
            depth++
            const nextSpan = horizontalSpan / 2

            yield {
                type: 'compare',
                indices: [],
                nodeId: currentId,
                description: `Comparing ${value} with ${currentNode.value}`,
                highlightLines: [13] // if (value < current.value)
            }

            if (value < currentNode.value) {
                // Go Left
                if (!currentNode.leftId) {
                    // Create left child
                    const childX = nodes[currentId].x - nextSpan
                    const childY = nodes[currentId].y + LEVEL_HEIGHT

                    yield {
                        type: 'create',
                        indices: [],
                        nodeId: newNodeId,
                        value: value,
                        x: childX,
                        y: childY,
                        description: `${value} < ${currentNode.value}, inserting left`,
                        highlightLines: [14, 15, 16] // if (!current.left) { current.left = node; return; }
                    }

                    yield {
                        type: 'link',
                        indices: [],
                        nodeId: currentId,
                        targetId: newNodeId,
                        description: `Linking ${currentNode.value} to ${value}`,
                        highlightLines: [15] // current.left = node
                    }
                    return
                } else {
                    // Visit Left
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.leftId,
                        description: `${value} < ${currentNode.value}, moving left`,
                        highlightLines: [18] // current = current.left
                    }
                    currentId = currentNode.leftId
                    horizontalSpan = nextSpan
                }
            } else {
                // Go Right
                if (!currentNode.rightId) {
                    // Create right child
                    const childX = nodes[currentId].x + nextSpan
                    const childY = nodes[currentId].y + LEVEL_HEIGHT

                    yield {
                        type: 'create',
                        indices: [],
                        nodeId: newNodeId,
                        value: value,
                        x: childX,
                        y: childY,
                        description: `${value} >= ${currentNode.value}, inserting right`,
                        highlightLines: [20, 21, 22] // if (!current.right) { current.right = node; return; }
                    }

                    yield {
                        type: 'link',
                        indices: [],
                        nodeId: currentId,
                        targetId: newNodeId,
                        description: `Linking ${currentNode.value} to ${value}`,
                        highlightLines: [21] // current.right = node
                    }
                    return
                } else {
                    // Visit Right
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.rightId,
                        description: `${value} >= ${currentNode.value}, moving right`,
                        highlightLines: [24] // current = current.right
                    }
                    currentId = currentNode.rightId
                    horizontalSpan = nextSpan
                }
            }
        }
    }

    else if (operation === 'search') {
        const value = payload as number
        if (!rootId) return

        let currentId: string | null = rootId

        yield {
            type: 'select',
            indices: [],
            nodeId: currentId,
            description: `Searching for ${value}`,
            highlightLines: [30] // let current = this.root
        }

        while (currentId) {
            const currentNode: BSTNode = nodes[currentId]

            yield {
                type: 'compare',
                indices: [],
                nodeId: currentId,
                description: `Comparing ${value} with ${currentNode.value}`,
                highlightLines: [33] // if (value === current.value)
            }

            if (currentNode.value === value) {
                yield {
                    type: 'sorted', // Found!
                    indices: [],
                    nodeId: currentId,
                    description: `Found ${value}!`,
                    highlightLines: [34] // return current
                }
                return
            }

            if (value < currentNode.value) {
                if (currentNode.leftId) {
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.leftId,
                        description: `${value} < ${currentNode.value}, going left`,
                        highlightLines: [36, 37] // if (value < current.value) { current = current.left }
                    }
                    currentId = currentNode.leftId
                } else {
                    break
                }
            } else {
                if (currentNode.rightId) {
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.rightId,
                        description: `${value} > ${currentNode.value}, going right`,
                        highlightLines: [39, 40] // else { current = current.right }
                    }
                    currentId = currentNode.rightId
                } else {
                    break
                }
            }
        }
    }
}
