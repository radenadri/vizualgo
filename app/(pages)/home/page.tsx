'use client'

import { VisualizerCanvas } from '~/components/viz/visualizer-canvas'
import { GridCanvas } from '~/components/viz/grid-canvas'
import { LinkedListCanvas } from '~/components/viz/linked-list-canvas'
import { ControlPanel } from '~/components/viz/control-panel'
import { CodeViewer } from '~/components/viz/code-viewer'
import { useVisualizerStore } from '~/libs/visualizer/store'
import { bubbleSort } from '~/libs/visualizer/algorithms/sorting/bubble-sort'
import { selectionSort } from '~/libs/visualizer/algorithms/sorting/selection-sort'
import { insertionSort } from '~/libs/visualizer/algorithms/sorting/insertion-sort'
import { mergeSort } from '~/libs/visualizer/algorithms/sorting/merge-sort'
import { quickSort } from '~/libs/visualizer/algorithms/sorting/quick-sort'
import { bfs } from '~/libs/visualizer/algorithms/pathfinding/bfs'
import { dfs } from '~/libs/visualizer/algorithms/pathfinding/dfs'
import { dijkstra } from '~/libs/visualizer/algorithms/pathfinding/dijkstra'
import { useState, useEffect } from 'react'
import type { SortingAlgorithm, PathfindingAlgorithm, AlgorithmType } from '~/libs/visualizer/types'
import { linkedListAlgorithm } from '~/libs/visualizer/algorithms/linked-list'
import { bstAlgorithm } from '~/libs/visualizer/algorithms/bst'
import { BSTCanvas } from '~/components/viz/bst-canvas'
import { ALGORITHM_CONTENT } from '~/libs/visualizer/content'
import Link from 'next/link'

const SORTING_ALGORITHMS: Record<string, { name: string; func: SortingAlgorithm }> = {
  'bubble-sort': { name: 'Bubble Sort', func: bubbleSort },
  'selection-sort': { name: 'Selection Sort', func: selectionSort },
  'insertion-sort': { name: 'Insertion Sort', func: insertionSort },
  'merge-sort': { name: 'Merge Sort', func: mergeSort },
  'quick-sort': { name: 'Quick Sort', func: quickSort },
}

const PATHFINDING_ALGORITHMS: Record<string, { name: string; func: PathfindingAlgorithm }> = {
  'bfs': { name: 'BFS', func: bfs },
  'dfs': { name: 'DFS', func: dfs },
  'dijkstra': { name: 'Dijkstra', func: dijkstra },
}

const MODES: { key: AlgorithmType; label: string }[] = [
  { key: 'sorting', label: 'Sorting' },
  { key: 'pathfinding', label: 'Pathfinding' },
  { key: 'linkedlist', label: 'Linked List' },
  { key: 'bst', label: 'BST' },
]

export default function Home() {
  const [mode, setMode] = useState<AlgorithmType>('sorting')
  const [selectedSortAlgo, setSelectedSortAlgo] = useState('bubble-sort')
  const [selectedPathAlgo, setSelectedPathAlgo] = useState('bfs')
  const [showAbout, setShowAbout] = useState(false)
  
  const { generateSteps, generatePathfindingSteps, generateLinkedListSteps, generateBSTSteps, reset, resetGrid, randomizeArray, setLinkedList, setBST } = useVisualizerStore()

  useEffect(() => {
    reset()
    if (mode === 'sorting') {
      randomizeArray()
    } else if (mode === 'pathfinding') {
      resetGrid()
    } else if (mode === 'linkedlist') {
      setLinkedList([])
    } else if (mode === 'bst') {
      setBST({}, null)
    }
  }, [mode, reset, resetGrid, randomizeArray, setLinkedList, setBST])

  const handleSortChange = (algoKey: string) => {
    setSelectedSortAlgo(algoKey)
    reset()
    generateSteps(SORTING_ALGORITHMS[algoKey].func)
  }

  const handlePathChange = (algoKey: string) => {
    setSelectedPathAlgo(algoKey)
    reset()
  }

  const handleGenerate = (operation?: string, payload?: any) => {
    if (mode === 'sorting') {
      generateSteps(SORTING_ALGORITHMS[selectedSortAlgo].func)
    } else if (mode === 'pathfinding') {
      generatePathfindingSteps(PATHFINDING_ALGORITHMS[selectedPathAlgo].func)
    } else if (mode === 'linkedlist' && operation) {
      generateLinkedListSteps(linkedListAlgorithm, operation, payload)
    } else if (mode === 'bst' && operation) {
      generateBSTSteps(bstAlgorithm, operation, payload)
    }
  }

  const currentAlgoKey = mode === 'sorting' ? selectedSortAlgo : mode === 'pathfinding' ? selectedPathAlgo : mode
  const content = ALGORITHM_CONTENT[currentAlgoKey] || ALGORITHM_CONTENT['bubble-sort']

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/">
              <h1 className="text-sm font-medium tracking-tight">VizualGo</h1>
            </Link>
            
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {MODES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    mode === key 
                      ? 'text-neutral-900' 
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {label}
                </button>
              ))}
              <span className="w-px h-4 bg-neutral-200 mx-2" />
              <button
                onClick={() => setShowAbout(true)}
                className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                About
              </button>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-3">
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value as AlgorithmType)}
                className="bg-transparent border border-neutral-200 rounded px-2 py-1 text-sm"
              >
                {MODES.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAbout(true)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="About"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Algorithm Selector */}
      {(mode === 'sorting' || mode === 'pathfinding') && (
        <div className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
            <div className="flex items-center gap-4 overflow-x-auto">
              <span className="text-xs text-neutral-400 uppercase tracking-widest shrink-0">Algorithm</span>
              <div className="flex items-center gap-1">
                {mode === 'sorting' ? (
                  Object.entries(SORTING_ALGORITHMS).map(([key, { name }]) => (
                    <button
                      key={key}
                      onClick={() => handleSortChange(key)}
                      className={`px-3 py-1 text-sm transition-colors ${
                        selectedSortAlgo === key 
                          ? 'text-neutral-900 bg-neutral-100' 
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  Object.entries(PATHFINDING_ALGORITHMS).map(([key, { name }]) => (
                    <button
                      key={key}
                      onClick={() => handlePathChange(key)}
                      className={`px-3 py-1 text-sm transition-colors ${
                        selectedPathAlgo === key 
                          ? 'text-neutral-900 bg-neutral-100' 
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visualization Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Canvas */}
            <section className="bg-neutral-50 border border-neutral-200 overflow-hidden">
              <div className="h-[420px] relative">
                {mode === 'sorting' && <VisualizerCanvas />}
                {mode === 'pathfinding' && <GridCanvas />}
                {mode === 'linkedlist' && <LinkedListCanvas />}
                {mode === 'bst' && <BSTCanvas />}
              </div>
            </section>

            {/* Controls */}
            <section className="bg-neutral-50 border border-neutral-200 p-4">
              <ControlPanel mode={mode} onGenerate={handleGenerate} />
            </section>

            {/* Algorithm Info */}
            <section className="border border-neutral-200 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                <h2 className="text-lg font-medium">{content.name}</h2>
                <div className="flex gap-3 text-xs font-mono text-neutral-400">
                  <span>Time: {content.complexity.time}</span>
                  <span>Space: {content.complexity.space}</span>
                </div>
              </div>
              
              <p className="text-neutral-500 text-sm leading-relaxed">
                {content.description}
              </p>
              
              {content.tips && (
                <p className="mt-4 text-sm text-neutral-400 border-l-2 border-neutral-200 pl-4">
                  {content.tips}
                </p>
              )}

              {mode === 'pathfinding' && (
                <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap gap-6 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500"/>
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500"/>
                    <span>End</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neutral-400"/>
                    <span>Wall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-400"/>
                    <span>Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-300"/>
                    <span>Visited</span>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Code Sidebar */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8">
              <section className="bg-neutral-50 border border-neutral-200 overflow-hidden h-[calc(100vh-100px)]">
                <div className="px-4 py-3 border-b border-neutral-200">
                  <span className="text-xs text-neutral-400 uppercase tracking-widest">Source</span>
                </div>
                <div className="h-[calc(100%-44px)] overflow-auto">
                  <CodeViewer algorithm={mode === 'sorting' ? selectedSortAlgo : mode === 'pathfinding' ? selectedPathAlgo : mode === 'linkedlist' ? 'linkedlist-impl' : 'bst-impl'} />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
            <p>
              © {new Date().getFullYear()} Created by{' '}
              <a 
                href="https://radenadri.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Adriana Eka Prayudha
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="bg-white border border-neutral-200 max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">About</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-neutral-600">
              <p>
                <strong className="text-neutral-900">VizualGo</strong> is an interactive algorithm visualizer 
                that helps you understand how algorithms work through step-by-step animations.
              </p>
              
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-neutral-400">Features</h3>
                <ul className="space-y-1">
                  <li>• Sorting algorithms (Bubble, Selection, Insertion, Merge, Quick)</li>
                  <li>• Pathfinding algorithms (BFS, DFS, Dijkstra)</li>
                  <li>• Data structures (Linked List, Binary Search Tree)</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400">
                  Created by{' '}
                  <a 
                    href="https://radenadri.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    Adriana Eka Prayudha
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
