import type { SortingAlgorithm } from '../../types'

export const insertionSort: SortingAlgorithm = function*(array) {
  const n = array.length
  
  // First element is implicitly sorted
  yield {
      type: 'sorted',
      indices: [0],
      description: 'First element is considered sorted',
      highlightLines: []
  }

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1
    
    yield {
        type: 'compare',
        indices: [i],
        description: `Selected ${key} to insert into sorted portion`,
        highlightLines: []
    }

    while (j >= 0 && array[j] > key) {
        yield {
            type: 'compare',
            indices: [j, j + 1], // Comparing key (at j+1 conceptually) with array[j]
            description: `Comparing ${key} with ${array[j]}`,
            highlightLines: []
        }
        
        array[j + 1] = array[j]
        
        yield {
            type: 'write',
            indices: [j + 1],
            snapshot: [array[j]], // Visualize the move/copy
            description: `Moving ${array[j]} forward`,
            highlightLines: []
        }
        
        j = j - 1
    }
    
    array[j + 1] = key
    
    yield {
        type: 'write',
        indices: [j + 1],
        snapshot: [key],
        description: `Inserted ${key} at position ${j + 1}`,
        highlightLines: []
    }
    
    // In insertion sort, everything up to i is strictly sorted relative to each other
    // But conceptually we extend the sorted window
    yield {
        type: 'sorted',
        indices: [i], // Just mark the boundary expansion
        description: `Sorted portion extended to index ${i}`,
        highlightLines: []
    }
  }
  
  // Mark all as sorted at the end to be sure
  for(let k=0; k<n; k++) {
      yield { type: 'sorted', indices: [k], description: 'Sorted', highlightLines: [] }
  }
}
