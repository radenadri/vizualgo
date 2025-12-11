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
                description: `Creating root node ${value}`
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
            description: `Starting at root: ${nodes[currentId].value}`
        }

        while (true) {
            const currentNode = nodes[currentId]
            depth++
            const nextSpan = horizontalSpan / 2

            yield {
                type: 'compare',
                indices: [],
                nodeId: currentId,
                description: `Comparing ${value} with ${currentNode.value}`
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
                        description: `${value} < ${currentNode.value}, inserting left`
                    }

                    yield {
                        type: 'link',
                        indices: [],
                        nodeId: currentId,
                        targetId: newNodeId,
                        description: `Linking ${currentNode.value} to ${value}`
                    }
                    return
                } else {
                    // Visit Left
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.leftId,
                        description: `${value} < ${currentNode.value}, moving left`
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
                        description: `${value} >= ${currentNode.value}, inserting right`
                    }

                    yield {
                        type: 'link',
                        indices: [],
                        nodeId: currentId,
                        targetId: newNodeId,
                        description: `Linking ${currentNode.value} to ${value}`
                    }
                    return
                } else {
                    // Visit Right
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.rightId,
                        description: `${value} >= ${currentNode.value}, moving right`
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
            description: `Searching for ${value}`
        }

        while (currentId) {
            const currentNode: BSTNode = nodes[currentId]

            yield {
                type: 'compare',
                indices: [],
                nodeId: currentId,
                description: `Comparing ${value} with ${currentNode.value}`
            }

            if (currentNode.value === value) {
                yield {
                    type: 'sorted', // Found!
                    indices: [],
                    nodeId: currentId,
                    description: `Found ${value}!`
                }
                return
            }

            if (value < currentNode.value) {
                if (currentNode.leftId) {
                    yield {
                        type: 'visit',
                        indices: [],
                        nodeId: currentNode.leftId,
                        description: `${value} < ${currentNode.value}, going left`
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
                        description: `${value} > ${currentNode.value}, going right`
                    }
                    currentId = currentNode.rightId
                } else {
                    break
                }
            }
        }

        // Not found logic?
    }
}
