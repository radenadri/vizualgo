import type { LinkedListAlgorithm, LinkedListNode } from '../../types'

// Simple helper for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9)

export const linkedListAlgorithm: LinkedListAlgorithm = function*(list, operation, payload) {
    if (operation === 'append') {
        const value = payload as number
        const newNodeId = generateId()
        
        // 1. Create Node Step
        yield {
            type: 'create',
            indices: [], 
            nodeId: newNodeId,
            value: value,
            description: `Creating new node with value ${value}`
        }
        
        if (list.length === 0) {
            // First node
        } else {
            // Traverse to end
            let currentNode = list[0]
            
            // Highlight Head
            yield {
                type: 'select',
                indices: [0],
                nodeId: currentNode.id,
                description: `Starting at head: ${currentNode.value}`
            }
            
            while (currentNode.nextId) {
                const nextNodeIndex = list.findIndex(n => n.id === currentNode.nextId)
                if (nextNodeIndex === -1) break; 
                
                yield {
                    type: 'visit', 
                    indices: [nextNodeIndex],
                    nodeId: list[nextNodeIndex].id,
                    description: `Traversing to next node: ${list[nextNodeIndex].value}`
                }
                
                currentNode = list[nextNodeIndex]
            }
            
            // Link tail to new node
            yield {
                type: 'link',
                indices: [],
                nodeId: currentNode.id, // Source
                targetId: newNodeId,    // Target
                description: `Linking node ${currentNode.value} to new node ${value}`
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
            description: `Searching for ${value} starting at head`
        }
        
        while (currentNode) {
            if (currentNode.value === value) {
                // Found it
                yield {
                    type: 'compare', 
                    indices: [list.indexOf(currentNode)],
                    nodeId: currentNode.id,
                    description: `Found match: ${value}`
                }
                
                if (prevNode) {
                    // Unlink prev and link to next
                    yield {
                        type: 'unlink',
                        indices: [],
                        nodeId: prevNode.id,
                        description: `Unlinking previous node`
                    }
                    
                    if (currentNode.nextId) {
                         yield {
                            type: 'link',
                            indices: [],
                            nodeId: prevNode.id,
                            targetId: currentNode.nextId,
                            description: `Linking previous node to next node`
                        }
                    }
                }
                
                yield {
                    type: 'delete',
                    indices: [],
                    nodeId: currentNode.id,
                    description: `Deleting node ${value}`
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
                        description: `Visiting ${currentNode.value}`
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
