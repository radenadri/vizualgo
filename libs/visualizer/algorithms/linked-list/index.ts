import type { LinkedListAlgorithm, LinkedListNode } from '../../types'

// Simple helper for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9)

export const linkedListAlgorithm: LinkedListAlgorithm = function* (list, operation, payload) {
    if (operation === 'append') {
        const value = payload as number
        const newNodeId = generateId()

        // 1. Create Node Step
        yield {
            type: 'create',
            indices: [],
            nodeId: newNodeId,
            value: value,
            description: `Creating new node with value ${value}`,
            highlightLines: [6] // const node = { value, next: null }
        }

        if (list.length === 0) {
            // First node - set as head
            yield {
                type: 'link',
                indices: [],
                nodeId: newNodeId,
                description: `Setting as head node`,
                highlightLines: [8, 9, 10] // if (!this.head) { this.head = node; return; }
            }
        } else {
            // Traverse to end
            let currentNode = list[0]

            // Highlight Head
            yield {
                type: 'select',
                indices: [0],
                nodeId: currentNode.id,
                description: `Starting at head: ${currentNode.value}`,
                highlightLines: [13] // let current = this.head
            }

            while (currentNode.nextId) {
                const nextNodeIndex = list.findIndex(n => n.id === currentNode.nextId)
                if (nextNodeIndex === -1) break;

                yield {
                    type: 'visit',
                    indices: [nextNodeIndex],
                    nodeId: list[nextNodeIndex].id,
                    description: `Traversing to next node: ${list[nextNodeIndex].value}`,
                    highlightLines: [14, 15] // while (current.next) { current = current.next }
                }

                currentNode = list[nextNodeIndex]
            }

            // Link tail to new node
            yield {
                type: 'link',
                indices: [],
                nodeId: currentNode.id,
                targetId: newNodeId,
                description: `Linking node ${currentNode.value} to new node ${value}`,
                highlightLines: [17] // current.next = node
            }
        }
    }

    else if (operation === 'delete') {
        const value = payload as number
        if (list.length === 0) return

        let currentNode = list[0]
        let prevNode: LinkedListNode | null = null

        yield {
            type: 'select',
            indices: [0],
            nodeId: currentNode.id,
            description: `Searching for ${value} starting at head`,
            highlightLines: [28] // let current = this.head
        }

        // Check if head needs to be deleted
        if (currentNode.value === value) {
            yield {
                type: 'compare',
                indices: [0],
                nodeId: currentNode.id,
                description: `Found match at head: ${value}`,
                highlightLines: [23] // if (this.head.value === value)
            }
            yield {
                type: 'delete',
                indices: [],
                nodeId: currentNode.id,
                description: `Deleting head node ${value}`,
                highlightLines: [24, 25] // this.head = this.head.next; return;
            }
            return
        }

        while (currentNode) {
            if (currentNode.value === value) {
                yield {
                    type: 'compare',
                    indices: [list.indexOf(currentNode)],
                    nodeId: currentNode.id,
                    description: `Found match: ${value}`,
                    highlightLines: [30] // if (current.next.value === value)
                }

                if (prevNode) {
                    yield {
                        type: 'unlink',
                        indices: [],
                        nodeId: prevNode.id,
                        description: `Unlinking previous node`,
                        highlightLines: [31] // current.next = current.next.next
                    }

                    if (currentNode.nextId) {
                        yield {
                            type: 'link',
                            indices: [],
                            nodeId: prevNode.id,
                            targetId: currentNode.nextId,
                            description: `Linking previous node to next node`,
                            highlightLines: [31] // current.next = current.next.next
                        }
                    }
                }

                yield {
                    type: 'delete',
                    indices: [],
                    nodeId: currentNode.id,
                    description: `Deleting node ${value}`,
                    highlightLines: [32] // return
                }
                return
            }

            // Advance
            prevNode = currentNode
            if (currentNode.nextId) {
                const nextIndex = list.findIndex(n => n.id === currentNode.nextId)
                if (nextIndex !== -1) {
                    currentNode = list[nextIndex]
                    yield {
                        type: 'visit',
                        indices: [nextIndex],
                        nodeId: currentNode.id,
                        description: `Visiting ${currentNode.value}`,
                        highlightLines: [34] // current = current.next
                    }
                } else {
                    break
                }
            } else {
                break
            }
        }
    }
}
