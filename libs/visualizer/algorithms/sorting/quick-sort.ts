import type { SortingAlgorithm, AnimationStep } from '../../types'

export const quickSort: SortingAlgorithm = function*(array) {
  yield* quickSortHelper(array, 0, array.length - 1)
}

function* quickSortHelper(
  array: number[],
  startIdx: number,
  endIdx: number
): Generator<AnimationStep, void, unknown> {
  if (startIdx >= endIdx) return
  
  const pivotIdx = startIdx
  let leftIdx = startIdx + 1
  let rightIdx = endIdx
  
  yield {
    type: 'pivot',
    indices: [pivotIdx],
    description: `Pivot selected: ${array[pivotIdx]}`,
    highlightLines: []
  }
  
  while (rightIdx >= leftIdx) {
    yield {
      type: 'compare',
      indices: [leftIdx, rightIdx, pivotIdx],
      description: `Comparing elements with pivot`,
      highlightLines: []
    }
    
    if (array[leftIdx] > array[pivotIdx] && array[rightIdx] < array[pivotIdx]) {
      yield {
        type: 'swap',
        indices: [leftIdx, rightIdx],
        description: `Swapping ${array[leftIdx]} and ${array[rightIdx]}`,
        highlightLines: []
      }
      swap(leftIdx, rightIdx, array)
    }
    
    if (array[leftIdx] <= array[pivotIdx]) leftIdx++
    if (array[rightIdx] >= array[pivotIdx]) rightIdx--
  }
  
  yield {
    type: 'swap',
    indices: [pivotIdx, rightIdx],
    description: `Moving pivot to correct position`,
    highlightLines: []
  }
  swap(pivotIdx, rightIdx, array)
  
  yield {
      type: 'sorted',
      indices: [rightIdx],
      description: `${array[rightIdx]} is now in sorted position`,
      highlightLines: []
  }
  
  const leftSubarrayIsSmaller = rightIdx - 1 - startIdx < endIdx - (rightIdx + 1)
  
  if (leftSubarrayIsSmaller) {
    yield* quickSortHelper(array, startIdx, rightIdx - 1)
    yield* quickSortHelper(array, rightIdx + 1, endIdx)
  } else {
    yield* quickSortHelper(array, rightIdx + 1, endIdx)
    yield* quickSortHelper(array, startIdx, rightIdx - 1)
  }
}

function swap(i: number, j: number, array: number[]) {
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}
