import type { SortingAlgorithm } from '../../types'

export const selectionSort: SortingAlgorithm = function*(array) {
  const n = array.length
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    
    // Mark the current position we are looking to fill
    yield {
        type: 'compare',
        indices: [i],
        description: `Looking for minimum value starting from index ${i}`,
        highlightLines: []
    }
    
    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'compare',
        indices: [minIdx, j],
        description: `Comparing minimum ${array[minIdx]} with ${array[j]}`,
        highlightLines: []
      }
      
      if (array[j] < array[minIdx]) {
        minIdx = j
        yield {
            type: 'compare',
            indices: [minIdx],
            description: `New minimum found: ${array[minIdx]}`,
            highlightLines: []
        }
      }
    }
    
    if (minIdx !== i) {
      const temp = array[i]
      array[i] = array[minIdx]
      array[minIdx] = temp
      
      yield {
        type: 'swap',
        indices: [i, minIdx],
        description: `Swapping ${array[i]} with ${array[minIdx]}`,
        highlightLines: []
      }
    }
    
    yield {
      type: 'sorted',
      indices: [i],
      description: `${array[i]} is now sorted`,
      highlightLines: []
    }
  }
  
  yield {
      type: 'sorted',
      indices: [n - 1],
      description: 'Last element is sorted',
      highlightLines: []
  }
}
