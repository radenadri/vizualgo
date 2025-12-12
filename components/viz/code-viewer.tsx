'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const codeSnippets: Record<string, string> = {
  'bubble-sort': `function bubbleSort(&$arr) {
  $n = count($arr);
  for ($i = 0; $i < $n - 1; $i++) {
    for ($j = 0; $j < $n - $i - 1; $j++) {
      // Compare adjacent elements
      if ($arr[$j] > $arr[$j + 1]) {
        // Swap
        $temp = $arr[$j];
        $arr[$j] = $arr[$j + 1];
        $arr[$j + 1] = $temp;
      }
    }
  }
}`,
  'selection-sort': `function selectionSort(&$arr) {
  $n = count($arr);
  for ($i = 0; $i < $n - 1; $i++) {
    $minIdx = $i;
    for ($j = $i + 1; $j < $n; $j++) {
      if ($arr[$j] < $arr[$minIdx]) {
        $minIdx = $j;
      }
    }
    if ($minIdx !== $i) {
      // Swap
      $temp = $arr[$i];
      $arr[$i] = $arr[$minIdx];
      $arr[$minIdx] = $temp;
    }
  }
}`,
  'insertion-sort': `function insertionSort(&$arr) {
  $n = count($arr);
  for ($i = 1; $i < $n; $i++) {
    // Store current element
    $key = $arr[$i];
    $j = $i - 1;
    
    // Move elements greater than key
    // one position ahead
    while ($j >= 0 && $arr[$j] > $key) {
      $arr[$j + 1] = $arr[$j];
      $j--;
    }
    
    // Insert key at correct position
    $arr[$j + 1] = $key;
  }
}`,
  'merge-sort': `function mergeSort($arr) {
  if (count($arr) <= 1) return $arr;
  
  $mid = floor(count($arr) / 2);
  $left = mergeSort(array_slice($arr, 0, $mid));
  $right = mergeSort(array_slice($arr, $mid));
  
  return merge($left, $right);
}

function merge($left, $right) {
  $result = [];
  $i = 0; $j = 0;
  
  while ($i < count($left) && $j < count($right)) {
    if ($left[$i] <= $right[$j]) {
      $result[] = $left[$i++];
    } else {
      $result[] = $right[$j++];
    }
  }
  
  return array_merge($result, array_slice($left, $i), array_slice($right, $j));
}`,
  'quick-sort': `function quickSort(&$arr, $low = 0, $high = null) {
  if ($high === null) $high = count($arr) - 1;

  if ($low < $high) {
    $pi = partition($arr, $low, $high);
    quickSort($arr, $low, $pi - 1);
    quickSort($arr, $pi + 1, $high);
  }
  return $arr;
}

function partition(&$arr, $low, $high) {
  $pivot = $arr[$high];
  $i = $low - 1;
  
  for ($j = $low; $j < $high; $j++) {
    if ($arr[$j] < $pivot) {
      $i++;
      // Swap
      $temp = $arr[$i];
      $arr[$i] = $arr[$j];
      $arr[$j] = $temp;
    }
  }
  
  // Swap pivot
  $temp = $arr[$i + 1];
  $arr[$i + 1] = $arr[$high];
  $arr[$high] = $temp;
  
  return $i + 1;
}`,
  'bfs': `function bfs($grid, $start, $end) {
  $queue = new SplQueue();
  $queue->enqueue($start);
  $start->visited = true;
  
  while (!$queue->isEmpty()) {
    $node = $queue->dequeue();
    
    if ($node === $end) {
      return reconstructPath($end);
    }
    
    foreach (getNeighbors($node) as $neighbor) {
      if (!$neighbor->visited && !$neighbor->wall) {
        $neighbor->visited = true;
        $neighbor->prev = $node;
        $queue->enqueue($neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  'dfs': `function dfs($grid, $start, $end) {
  $stack = new SplStack();
  $stack->push($start);
  $start->visited = true;
  
  while (!$stack->isEmpty()) {
    $node = $stack->pop();
    
    if ($node === $end) {
      return reconstructPath($end);
    }
    
    foreach (getNeighbors($node) as $neighbor) {
      if (!$neighbor->visited && !$neighbor->wall) {
        $neighbor->visited = true;
        $neighbor->prev = $node;
        $stack->push($neighbor);
      }
    }
  }
  
  return null; // No path found
}`,
  'dijkstra': `function dijkstra($grid, $start, $end) {
  $pq = new SplPriorityQueue();
  $start->distance = 0;
  $pq->insert($start, 0);
  
  while (!$pq->isEmpty()) {
    $node = $pq->extract();
    
    if ($node->visited) continue;
    $node->visited = true;
    
    if ($node === $end) {
      return reconstructPath($end);
    }
    
    foreach (getNeighbors($node) as $neighbor) {
      if (!$neighbor->visited && !$neighbor->wall) {
        $newDist = $node->distance + 1;
        if ($newDist < $neighbor->distance) {
          $neighbor->distance = $newDist;
          $neighbor->prev = $node;
          $pq->insert($neighbor, -$newDist); // Max heap, so negate
        }
      }
    }
  }
  
  return null;
}`,
  'linkedlist-impl': `class LinkedList {
  public $head;

  public function __construct() {
    $this->head = null;
  }
  
  public function append($value) {
    $node = new Node($value);
    
    if ($this->head === null) {
      $this->head = $node;
      return;
    }
    
    $current = $this->head;
    while ($current->next !== null) {
      $current = $current->next;
    }
    $current->next = $node;
  }
  
  public function delete($value) {
    if ($this->head === null) return;
    
    if ($this->head->value === $value) {
      $this->head = $this->head->next;
      return;
    }
    
    $current = $this->head;
    while ($current->next !== null) {
      if ($current->next->value === $value) {
        $current->next = $current->next->next;
        return;
      }
      $current = $current->next;
    }
  }
}`,
  'bst-impl': `class BST {
  public $root;

  public function __construct() {
    $this->root = null;
  }
  
  public function insert($value) {
    $node = new Node($value);
    
    if ($this->root === null) {
      $this->root = $node;
      return;
    }
    
    $current = $this->root;
    while (true) {
      if ($value < $current->value) {
        if ($current->left === null) {
          $current->left = $node;
          return;
        }
        $current = $current->left;
      } else {
        if ($current->right === null) {
          $current->right = $node;
          return;
        }
        $current = $current->right;
      }
    }
  }
  
  public function search($value) {
    $current = $this->root;
    
    while ($current !== null) {
      if ($value === $current->value) {
        return $current;
      }
      $current = $value < $current->value 
        ? $current->left 
        : $current->right;
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
        {algorithm}.php
      </div>
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter 
          language="php" 
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
