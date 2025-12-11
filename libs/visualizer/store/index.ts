import { create } from 'zustand'
import type { AnimationStep, SortingAlgorithm, PathfindingAlgorithm, GridNode, LinkedListNode, LinkedListAlgorithm, BSTNode, BSTAlgorithm } from '../types'

interface VisualizerState {
  // Data State
  initialArray: number[]
  array: number[] // Current display array
  setArray: (array: number[]) => void
  randomizeArray: (size?: number) => void
  
  // Grid State
  grid: GridNode[][]
  isMousePressed: boolean
  setGrid: (grid: GridNode[][]) => void
  resetGrid: () => void
  toggleWall: (row: number, col: number) => void
  setMousePressed: (isPressed: boolean) => void
  startNode: { row: number, col: number }
  endNode: { row: number, col: number }
  
  // Linked List State
  linkedList: LinkedListNode[]
  setLinkedList: (list: LinkedListNode[]) => void
  
  // Algorithm State
  steps: AnimationStep[]
  currentStepIndex: number
  isSorted: boolean 
  isPathFound: boolean
  
  // BST State
  bstNodes: Record<string, BSTNode>
  bstRoot: string | null
  setBST: (nodes: Record<string, BSTNode>, root: string | null) => void
  
  // Playback Control
  isPlaying: boolean
  playbackSpeed: number // ms delay
  setPlaybackSpeed: (speed: number) => void
  
  // Actions
  generateSteps: (algorithm: SortingAlgorithm) => void
  generatePathfindingSteps: (algorithm: PathfindingAlgorithm) => void
  generateLinkedListSteps: (algorithm: LinkedListAlgorithm, operation: string, payload: unknown) => void
  generateBSTSteps: (algorithm: BSTAlgorithm, operation: string, payload: unknown) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  setPlaying: (isPlaying: boolean) => void
  jumpToStep: (index: number) => void
}

const DEFAULT_ARRAY_SIZE = 20
const MAX_VALUE = 100
const DEFAULT_ROWS = 15 // Smaller default for visibility
const DEFAULT_COLS = 30

const createNode = (col: number, row: number, startNode: {row: number, col: number}, endNode: {row: number, col: number}): GridNode => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isEnd: row === endNode.row && col === endNode.col,
    isWall: false,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    previousNode: null,
  }
}

const getInitialGrid = (rows = DEFAULT_ROWS, cols = DEFAULT_COLS, startNode: {row:number, col: number}, endNode: {row: number, col: number}) => {
  const grid = []
  for (let row = 0; row < rows; row++) {
    const currentRow = []
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(col, row, startNode, endNode))
    }
    grid.push(currentRow)
  }
  return grid
}

// Helper to apply a single step to an array
const applyStep = (arr: number[], grid: GridNode[][], step: AnimationStep) => {
  if (step.type === 'swap') {
    const [i, j] = step.indices
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  } else if (step.type === 'write' && step.snapshot) {
    const [idx] = step.indices
    const [val] = step.snapshot
    arr[idx] = val
  } else if (step.type === 'visit') {
      const [row, col] = step.indices
      if (grid[row] && grid[row][col]) {
        grid[row][col].isVisited = true
        // Logic for 'unvisiting' if we were reversible? 
        // usually we just re-render. 
        // But for persistent state in store:
      }
  } else if (step.type === 'path') {
      const [row, col] = step.indices
      if (grid[row] && grid[row][col]) {
        grid[row][col].isPath = true
      }
  }
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  initialArray: [],
  array: [],
  steps: [],
  currentStepIndex: -1,
  
  isSorted: false,
  isPathFound: false,
  isPlaying: false,
  playbackSpeed: 100,
  
  // Grid defaults
  startNode: { row: 5, col: 5 },
  endNode: { row: 5, col: 25 },
  grid: [], // Initialized below
  isMousePressed: false,

  // Linked List defaults
  linkedList: [],
  
  setArray: (array) => set({ initialArray: [...array], array: [...array], steps: [], currentStepIndex: -1, isSorted: false }),
  setLinkedList: (list) => set({ linkedList: list }),
  
  // BST defaults
  bstNodes: {},
  bstRoot: null,
  setBST: (nodes, root) => set({ bstNodes: nodes, bstRoot: root }),

  setGrid: (grid) => set({ grid }),
  setMousePressed: (isMousePressed) => set({ isMousePressed }),
  
  resetGrid: () => {
    const { startNode, endNode } = get()
    // Re-create generic grid
    const grid = getInitialGrid(DEFAULT_ROWS, DEFAULT_COLS, startNode, endNode)
    set({ grid, steps: [], currentStepIndex: -1, isPathFound: false })
  },
  
  toggleWall: (row, col) => {
      const { grid } = get()
      const newGrid = [...grid]
      // Deep clone only necessary rows? Or use existing objects if Mutable. 
      // Detailed state management:
      const node = newGrid[row][col]
      if (!node.isStart && !node.isEnd) {
          const newNode = { ...node, isWall: !node.isWall }
          newGrid[row] = [...newGrid[row]]
          newGrid[row][col] = newNode
          set({ grid: newGrid })
      }
  },

  randomizeArray: (size = DEFAULT_ARRAY_SIZE) => {
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * MAX_VALUE) + 5)
    set({ initialArray: [...array], array: [...array], steps: [], currentStepIndex: -1, isSorted: false })
  },
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  
  generateSteps: (algorithm) => {
    const { array } = get()
    const arrayCopy = [...array]
    const generator = algorithm(arrayCopy)
    const steps: AnimationStep[] = []
    
    for (const step of generator) {
      steps.push(step)
    }
    
    set({ steps, currentStepIndex: -1, isSorted: false })
  },
  
  generatePathfindingSteps: (algorithm) => {
      const { grid, startNode, endNode } = get()
      
      // Need a deep clone of grid for the algorithm to run on simulation? 
      // Or just run on the structure and let it return steps without mutating real Grid UI yet?
      // Usually algorithms like BFS need 'visited' set on nodes.
      // So we clone the grid structure for the algorithm to use.
      const gridClone = grid.map(row => row.map(node => ({...node})))
      
      const start = gridClone[startNode.row][startNode.col]
      const end = gridClone[endNode.row][endNode.col]
      
      const generator = algorithm(gridClone, start, end)
      const steps: AnimationStep[] = []
      
      for (const step of generator) {
          steps.push(step)
      }
      
      set({ steps, currentStepIndex: -1, isPathFound: false })
  },

  generateLinkedListSteps: (algorithm, operation, payload) => {
      const { linkedList } = get()
      // Deep clone linked list
      const listClone = JSON.parse(JSON.stringify(linkedList))
      const generator = algorithm(listClone, operation, payload)
      const steps: AnimationStep[] = []
      
      for (const step of generator) {
          steps.push(step)
      }
      
      set({ steps, currentStepIndex: -1 })
  },

  generateBSTSteps: (algorithm, operation, payload) => {
      const { bstNodes, bstRoot } = get()
      // Deep clone nodes
      const nodesClone = JSON.parse(JSON.stringify(bstNodes))
      const generator = algorithm(bstRoot, nodesClone, operation, payload)
      const steps: AnimationStep[] = []

      for (const step of generator) {
          steps.push(step)
      }

      set({ steps, currentStepIndex: -1 })
  },

  nextStep: () => {
    set((state) => {
      const { steps, currentStepIndex, array, grid, linkedList } = state
      if (currentStepIndex >= steps.length - 1) {
        return { isPlaying: false, isSorted: true, isPathFound: true } // Naive completion
      }

      const nextIndex = currentStepIndex + 1
      const step = steps[nextIndex]
      const newArray = [...array]
      // Grid mutation is slightly complex due to 2D array.
      // We will mutate 'in place' on a shallow copy of rows for performance?
      // Or use Immer. For now, manual shallow copy of rows involved.
      const newGrid = [...grid]
      const newLinkedList = [...linkedList]
      
      if (step.type === 'visit' || step.type === 'path') {
          const [r, c] = step.indices
          if (newGrid[r]) {
             newGrid[r] = [...newGrid[r]]
             if (newGrid[r][c]) {
                 newGrid[r][c] = { 
                     ...newGrid[r][c], 
                     isVisited: step.type === 'visit' || newGrid[r][c].isVisited,
                     isPath: step.type === 'path' || newGrid[r][c].isPath
                 }
             }
          }
      }
      
      // Linked List logic
      if (step.type === 'create' && step.nodeId && step.value !== undefined) {
         // Check if it's BST (has x, y) or Linked List
         if (step.x !== undefined && step.y !== undefined) {
             // BST Create
             return { 
                 ...state,
                 currentStepIndex: nextIndex, 
                 array: newArray, 
                 grid: newGrid, 
                 linkedList: newLinkedList,
                 bstNodes: { 
                     ...state.bstNodes, 
                     [step.nodeId]: { 
                         id: step.nodeId, 
                         value: step.value, 
                         x: step.x, 
                         y: step.y, 
                         leftId: null, 
                         rightId: null 
                    } 
                 },
                 bstRoot: state.bstRoot || step.nodeId 
             }
         } else {
             newLinkedList.push({ id: step.nodeId, value: step.value, nextId: null })
         }
      } else if (step.type === 'link' && step.nodeId && step.targetId) {
         // Check if BST node exists
         if (state.bstNodes[step.nodeId]) {
             // BST Link - tricky part: left or right?
             // Usually step.description or metadata might say? 
             // Or we imply based on value?
             // Simplest: The Step 'link' for BST could include 'tag' or something?
             // Or we just check value < or > ?
             // Let's assume for now we don't fully replay structural links for BST if they are static 
             // OR we add 'tag' to AnimationStep to specify 'left' or 'right'
             
             // Actually, 'create' sets up the node. 
             // 'link' connects parent to child. 
             // For visualization, we might just repaint lines based on state.
             
             // Let's update BST structure if we have info.
             // If we don't update structure here, 'prevStep' won't work correctly for structure changes.
             // We need to store structure changes.
             
             // Strategy: The 'create' step for a child could implicitly link it?
             // No.
             
             // Let's verify what `linkedList` logic does:
             const node = newLinkedList.find(n => n.id === step.nodeId)
             if (node) node.nextId = step.targetId
             
             // For BST, we need to know 'left' or 'right'.
             // Let's rely on finding where the target fits?
             const parent = state.bstNodes[step.nodeId]
             const child = state.bstNodes[step.targetId]
             if (parent && child) {
                 const newNodes = { ...state.bstNodes }
                 if (child.value < parent.value) {
                     newNodes[step.nodeId] = { ...parent, leftId: child.id }
                 } else {
                     newNodes[step.nodeId] = { ...parent, rightId: child.id }
                 }
                 return { ...state, currentStepIndex: nextIndex, array: newArray, grid: newGrid, linkedList: newLinkedList, bstNodes: newNodes }
             }
         } else {
             const node = newLinkedList.find(n => n.id === step.nodeId)
             if (node) node.nextId = step.targetId
         }
      } else if (step.type === 'unlink' && step.nodeId) {
         const node = newLinkedList.find(n => n.id === step.nodeId)
         if (node) node.nextId = null
      } 
      
      applyStep(newArray, newGrid, step)
      
      return { currentStepIndex: nextIndex, array: newArray, grid: newGrid, linkedList: newLinkedList }
    })
  },

  prevStep: () => {
    const { currentStepIndex } = get()
    if (currentStepIndex > -1) {
        get().jumpToStep(currentStepIndex - 1)
    }
  },
  
  reset: () => {
    const { initialArray } = get()
    // Reset Array
    // Reset Grid (Visually only, keep walls?)
    // This 'reset' is tricky for grid if we want to keep walls.
    // Let's assume 'reset' keeps walls but clears path
    const cleanGrid = get().grid.map(row => row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null
    })))

    set({ 
        array: [...initialArray], 
        grid: cleanGrid,
        currentStepIndex: -1, 
        isSorted: false, 
        isPathFound: false,
        isPlaying: false 
    })
  },
  
  jumpToStep: (targetIndex) => {
      const { initialArray, steps } = get()
      // Clamp index
      const limitIndex = Math.max(-1, Math.min(targetIndex, steps.length - 1))
      
      const newArray = [...initialArray]
      
      // For grid jump, better to rebuild from clean state respecting walls
      // We need 'initialGrid' or valid 'currentGridWithWalls'
      // Ideally we store 'cleanGridWithWalls' in state to revert to?
      // For now, we clean the *current* grid of visited flags
      
      const newGrid = get().grid.map(row => row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false
      })))

      for (let i = 0; i <= limitIndex; i++) {
          applyStep(newArray, newGrid, steps[i])
      }
      
      set({ 
          array: newArray, 
          grid: newGrid,
          currentStepIndex: limitIndex, 
          isSorted: limitIndex === steps.length - 1 
      })
  }
}))

// Auto-initialize grid
setTimeout(() => {
    useVisualizerStore.getState().resetGrid()
}, 0)
