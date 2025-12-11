export interface AlgorithmContent {
    name: string
    description: string
    complexity: {
        time: string
        space: string
    }
    pseudocode?: string
    tips?: string
}

export const ALGORITHM_CONTENT: Record<string, AlgorithmContent> = {
    // Sorting
    'bubble-sort': {
        name: 'Bubble Sort',
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        complexity: {
            time: 'O(n²)',
            space: 'O(1)'
        },
        tips: 'Simple to understand but inefficient for large datasets.'
    },
    'selection-sort': {
        name: 'Selection Sort',
        description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items.',
        complexity: {
            time: 'O(n²)',
            space: 'O(1)'
        },
        tips: 'Performs well on small lists where auxiliary memory is limited.'
    },
    'insertion-sort': {
        name: 'Insertion Sort',
        description: 'Builds the final sorted array one item at a time. It iterates, consuming one input element each repetition, and growing a sorted output list.',
        complexity: {
            time: 'O(n²)',
            space: 'O(1)'
        },
        tips: 'Efficient for small data sets or substantially sorted arrays.'
    },
    'merge-sort': {
        name: 'Merge Sort',
        description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
        complexity: {
            time: 'O(n log n)',
            space: 'O(n)'
        },
        tips: 'Stable sort with guaranteed O(n log n) performance.'
    },
    'quick-sort': {
        name: 'Quick Sort',
        description: 'A divide and conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
        complexity: {
            time: 'O(n log n)',
            space: 'O(log n)'
        },
        tips: 'Often faster in practice than other O(n log n) algorithms.'
    },

    // Pathfinding
    'bfs': {
        name: 'Breadth First Search',
        description: 'Explores the neighbor nodes first, before moving to the next level neighbors. Guarantees the shortest path in an unweighted grid.',
        complexity: {
            time: 'O(V + E)',
            space: 'O(V)'
        },
        tips: 'Great for finding the shortest path in unweighted graphs.'
    },
    'dfs': {
        name: 'Depth First Search',
        description: 'Explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.',
        complexity: {
            time: 'O(V + E)',
            space: 'O(V)'
        },
        tips: 'Useful for topological sorting, cycle detection, and maze generation.'
    },
    'dijkstra': {
        name: 'Dijkstra',
        description: 'Finds the shortest path between nodes in a graph. It picks the unvisited node with the smallest distance, calculates the distance through it to each unvisited neighbor, and updates the neighbor\'s distance if smaller.',
        complexity: {
            time: 'O((V + E) log V)',
            space: 'O(V)'
        },
        tips: 'The standard algorithm for shortest paths in weighted graphs.'
    },

    // Data Structures
    'linkedlist': {
        name: 'Linked List',
        description: 'A linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers.',
        complexity: {
            time: 'Access: O(n), Insert/Delete: O(1)',
            space: 'O(n)'
        },
        tips: 'Dynamic size, easy insertion/deletion.'
    },
    'bst': {
        name: 'Binary Search Tree',
        description: 'A node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node’s key.',
        complexity: {
            time: 'Access/Search/Insert/Delete: O(log n)',
            space: 'O(n)'
        },
        tips: 'Keeps keys in sorted order for fast lookup.'
    }
}
