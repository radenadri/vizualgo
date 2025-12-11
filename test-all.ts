import { bubbleSort } from './libs/visualizer/algorithms/sorting/bubble-sort'
import { selectionSort } from './libs/visualizer/algorithms/sorting/selection-sort'
import { insertionSort } from './libs/visualizer/algorithms/sorting/insertion-sort'
import { mergeSort } from './libs/visualizer/algorithms/sorting/merge-sort'
import { quickSort } from './libs/visualizer/algorithms/sorting/quick-sort'
import type { SortingAlgorithm } from './libs/visualizer/types'

const algos: Record<string, SortingAlgorithm> = {
    'Bubble': bubbleSort,
    'Selection': selectionSort,
    'Insertion': insertionSort,
    'Merge': mergeSort,
    'Quick': quickSort
}

const runTest = (name: string, algo: SortingAlgorithm) => {
    // Large enough to be interesting, small enough to fail fast
    const initial = [12, 5, 8, 3, 1, 9, 4, 7, 2, 6, 11, 10]
    const arr = [...initial]
    
    console.log(`Testing ${name}...`)
    // Pass a copy so the generator modifies its own local version
    // while we modify 'arr' based on the yields
    const generator = algo([...arr]) 
    let stepsCount = 0
    
    // Simulate engine
    for (const step of generator) {
        stepsCount++
        
        // Apply swap
        if (step.type === 'swap') {
            const [i, j] = step.indices
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        } 
        // Apply write/overwrite (Merge sort)
        else if (step.type === 'write' && step.snapshot) {
            const [i] = step.indices
            const [val] = step.snapshot
            arr[i] = val
        }
    }
    
    console.log(`> Steps: ${stepsCount}`)
    
    // Check if sorted
    let isSorted = true
    for(let i=0; i<arr.length-1; i++) {
        if (arr[i] > arr[i+1]) {
            isSorted = false
            break
        }
    }
    
    if (isSorted) console.log(`> Result: PASSED`)
    else {
        console.error(`> Result: FAILED`)
        console.error(`Expected sorted, got:`, arr)
    }
    console.log('---')
}

Object.entries(algos).forEach(([name, algo]) => runTest(name, algo))
