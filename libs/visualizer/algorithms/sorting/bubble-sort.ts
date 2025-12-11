import type { SortingAlgorithm } from '../../types'

export const bubbleSort: SortingAlgorithm = function*(array) {
  const n = array.length
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      yield {
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing ${array[j]} and ${array[j + 1]}`,
        highlightLines: [6] // Hypothetical line number
      }
      
      if (array[j] > array[j + 1]) {
        // Swap
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
        
        yield {
          type: 'swap',
          indices: [j, j + 1],
          description: `Swapping ${array[j]} and ${array[j + 1]}`,
          highlightLines: [9, 10, 11]
        }
      }
    }
    
    // Mark sorted
    yield {
      type: 'sorted',
      indices: [n - 1 - i],
      description: `${array[n - 1 - i]} is now in its sorted position`,
      highlightLines: []
    }
  }
  
  // Mark last element as sorted
  yield {
      type: 'sorted',
      indices: [0],
      description: 'First element is sorted',
      highlightLines: []
  }
}
