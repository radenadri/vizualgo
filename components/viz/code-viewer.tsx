'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const codeSnippets: Record<string, string> = {
  'bubble-sort': `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
  'selection-sort': `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      // Swap
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
}`,
  'insertion-sort': `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    // Store current element
    let key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key
    // one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert key at correct position
    arr[j + 1] = key;
  }
}`,
  'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  'bfs': `function bfs(grid, start, end) {
  const queue = [start];
  start.visited = true;
  
  while (queue.length) {
    const node = queue.shift();
    
    if (node === end) {
      return reconstructPath(end);
    }
    
    for (const neighbor of getNeighbors(node)) {
      if (!neighbor.visited && !neighbor.wall) {
        neighbor.visited = true;
        neighbor.prev = node;
        queue.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  'dfs': `function dfs(grid, start, end) {
  const stack = [start];
  start.visited = true;
  
  while (stack.length) {
    const node = stack.pop();
    
    if (node === end) {
      return reconstructPath(end);
    }
    
    for (const neighbor of getNeighbors(node)) {
      if (!neighbor.visited && !neighbor.wall) {
        neighbor.visited = true;
        neighbor.prev = node;
        stack.push(neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  'dijkstra': `function dijkstra(grid, start, end) {
  const pq = new PriorityQueue();
  start.distance = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const node = pq.dequeue();
    
    if (node.visited) continue;
    node.visited = true;
    
    if (node === end) {
      return reconstructPath(end);
    }
    
    for (const neighbor of getNeighbors(node)) {
      if (!neighbor.visited && !neighbor.wall) {
        const newDist = node.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.prev = node;
          pq.enqueue(neighbor, newDist);
        }
      }
    }
  }
  
  return null;
}`,
  'linkedlist-impl': `class LinkedList {
  constructor() {
    this.head = null;
  }
  
  append(value) {
    const node = { value, next: null };
    
    if (!this.head) {
      this.head = node;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
  
  delete(value) {
    if (!this.head) return;
    
    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}`,
  'bst-impl': `class BST {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const node = { value, left: null, right: null };
    
    if (!this.root) {
      this.root = node;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }
  
  search(value) {
    let current = this.root;
    
    while (current) {
      if (value === current.value) {
        return current;
      }
      current = value < current.value 
        ? current.left 
        : current.right;
    }
    
    return null;
  }
}`
}

export function CodeViewer({ algorithm = 'bubble-sort' }: { algorithm?: string }) {
  const { currentStepIndex, steps } = useVisualizerStore()
  const step = steps[currentStepIndex]
  
  const highlightLines = step?.highlightLines || []
  
  const lineProps = (lineNumber: number) => {
    const style: React.CSSProperties = { display: 'block' }
    if (highlightLines.includes(lineNumber)) {
      style.backgroundColor = '#fef3c7'
      style.borderLeft = '3px solid #f59e0b'
    }
    return { style }
  }

  return (
    <div className="overflow-hidden bg-neutral-50 text-sm h-full flex flex-col">
      <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200 font-mono text-xs text-neutral-500">
        {algorithm}.js
      </div>
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter 
          language="javascript" 
          style={oneLight}
          wrapLines={true}
          showLineNumbers={true}
          lineProps={lineProps}
          customStyle={{ 
            margin: 0, 
            padding: '1rem', 
            background: 'transparent',
            fontSize: '12px'
          }}
        >
          {codeSnippets[algorithm] || '// Code not available'}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
