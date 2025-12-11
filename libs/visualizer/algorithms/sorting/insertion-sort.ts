import type { SortingAlgorithm } from '../../types'

export const insertionSort: SortingAlgorithm = function* (array) {
    const n = array.length

    // First element is implicitly sorted
    yield {
        type: 'sorted',
        indices: [0],
        description: 'First element is considered sorted',
        highlightLines: [3] // for loop start
    }

    for (let i = 1; i < n; i++) {
        const key = array[i]
        let j = i - 1

        yield {
            type: 'compare',
            indices: [i],
            description: `Selected ${key} to insert into sorted portion`,
            highlightLines: [5, 6] // key = arr[i], j = i - 1
        }

        while (j >= 0 && array[j] > key) {
            yield {
                type: 'compare',
                indices: [j, j + 1],
                description: `Comparing ${key} with ${array[j]}`,
                highlightLines: [10] // while condition
            }

            array[j + 1] = array[j]

            yield {
                type: 'write',
                indices: [j + 1],
                snapshot: [array[j]],
                description: `Moving ${array[j]} forward`,
                highlightLines: [11, 12] // arr[j + 1] = arr[j], j--
            }

            j = j - 1
        }

        array[j + 1] = key

        yield {
            type: 'write',
            indices: [j + 1],
            snapshot: [key],
            description: `Inserted ${key} at position ${j + 1}`,
            highlightLines: [15] // arr[j + 1] = key
        }

        yield {
            type: 'sorted',
            indices: [i],
            description: `Sorted portion extended to index ${i}`,
            highlightLines: []
        }
    }

    // Mark all as sorted at the end
    for (let k = 0; k < n; k++) {
        yield { type: 'sorted', indices: [k], description: 'Sorted', highlightLines: [] }
    }
}
