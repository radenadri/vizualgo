// Basic visual types
export type AnimationType =
  | 'compare' // Highlighting two elements being compared
  | 'swap'    // Swapping two elements
  | 'write'   // Overwriting a value (e.g. in merge sort)
  | 'pivot'   // Marking a pivot (quick sort)
  | 'sorted'  // Marking elements as final/sorted
  | 'visit'   // Visiting a node (pathfinding)
  | 'explore' // Exploring a neighbor (pathfinding)
  | 'path'    // Marking a node as part of the path (pathfinding)
  | 'wall'    // Marking a node as a wall (optional)
  // Linked List specific
  | 'create'  // Creating a new node
  | 'delete'  // Deleting a node
  | 'link'    // Linking two nodes
  | 'unlink'  // Unlinking nodes
  | 'select'  // Selecting a node (e.g. current traversal)


export interface AnimationStep {
  type: AnimationType
  indices: number[] // For LL: [nodeIndex, targetIndex?]
  description?: string
  highlightLines?: number[]
  snapshot?: number[]
  // For Linked List custom data
  nodeId?: string
  targetId?: string
  value?: number
  // For BST
  x?: number
  y?: number
}

export interface GridNode {
  row: number
  col: number
  isStart: boolean
  isEnd: boolean
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: GridNode | null
}

export interface LinkedListNode {
  id: string
  value: number
  nextId: string | null
  highlight?: boolean
}

export interface BSTNode {
  id: string
  value: number
  leftId: string | null
  rightId: string | null
  x: number
  y: number
  highlight?: boolean
}

export type AlgorithmType = 'sorting' | 'pathfinding' | 'linkedlist' | 'bst'

export type SortingAlgorithm = (
  array: number[]
) => Generator<AnimationStep, void, unknown>

export type PathfindingAlgorithm = (
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
) => Generator<AnimationStep, void, unknown>

export type LinkedListAlgorithm = (
  list: LinkedListNode[],
  operation: string,
  payload: any
) => Generator<AnimationStep, void, unknown>

export type BSTAlgorithm = (
  rootId: string | null,
  nodes: Record<string, BSTNode>,
  operation: string,
  payload: any
) => Generator<AnimationStep, void, unknown>
