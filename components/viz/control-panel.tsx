'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { useEffect, useState } from 'react'
import type { AlgorithmType } from '~/libs/visualizer/types'

interface ControlPanelProps {
  mode?: AlgorithmType
  onGenerate?: (operation?: string, payload?: any) => void
}

export function ControlPanel({ mode = 'sorting', onGenerate }: ControlPanelProps) {
  const { 
    randomizeArray, 
    resetGrid,
    nextStep,
    prevStep,
    reset,
    isPlaying,
    setPlaying,
    playbackSpeed,
    currentStepIndex,
    steps
  } = useVisualizerStore()

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, playbackSpeed)
    }

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  useEffect(() => {
    if (currentStepIndex >= steps.length - 1 && isPlaying && steps.length > 0) {
      setPlaying(false)
    }
  }, [currentStepIndex, steps.length, isPlaying, setPlaying])

  const handlePlay = () => {
    if (steps.length === 0) {
      if (onGenerate) onGenerate()
    }
    setPlaying(!isPlaying)
  }

  // For data structures: replay from beginning without adding new nodes
  const handleDataStructurePlay = () => {
    if (isPlaying) {
      setPlaying(false)
    } else if (steps.length > 0) {
      // If at the end or somewhere in the middle, reset to beginning and play
      if (currentStepIndex >= steps.length - 1 || currentStepIndex > -1) {
        // Reset to start of animation
        // For linked list: remove nodes that were added during this animation to avoid duplicate keys
        const state = useVisualizerStore.getState()
        const nodeIdsInSteps = new Set(
          steps
            .filter(s => s.type === 'create' && s.nodeId)
            .map(s => s.nodeId)
        )
        const linkedListWithoutAnimatedNodes = state.linkedList.filter(
          node => !nodeIdsInSteps.has(node.id)
        )
        useVisualizerStore.setState({ 
          currentStepIndex: -1,
          linkedList: linkedListWithoutAnimatedNodes
        })
      }
      setPlaying(true)
    }
    // If no steps, do nothing (button should be disabled anyway)
  }

  // Auto-play after data structure action
  const handleDataStructureAction = (operation: string) => {
    const val = Number(inputValue) || Math.floor(Math.random() * 100)
    onGenerate?.(operation, val)
    setInputValue('')
    // Auto-start playing after a short delay
    setTimeout(() => {
      setPlaying(true)
    }, 100)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-700">
      {/* Sorting controls */}
      {mode === 'sorting' && (
        <>
          <button 
            onClick={() => randomizeArray()}
            className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            Randomize
          </button>
          <label className="flex items-center gap-2 text-neutral-400">
            <span className="text-xs">Size</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              defaultValue="20"
              onChange={(e) => randomizeArray(Number(e.target.value))}
              className="w-16 accent-neutral-400"
            />
          </label>
        </>
      )}
      
      {/* Pathfinding controls */}
      {mode === 'pathfinding' && (
        <button 
          onClick={() => resetGrid()}
          className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
        >
          Clear
        </button>
      )}

      {/* Linked List controls - simplified */}
      {mode === 'linkedlist' && (
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Value" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDataStructureAction('append')}
            className="bg-white border border-neutral-300 px-3 py-1.5 w-24 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400"
          />
          <button 
            onClick={() => handleDataStructureAction('append')}
            className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            Append
          </button>
          <button 
            onClick={() => handleDataStructureAction('delete')}
            className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-400"
          >
            Delete
          </button>
        </div>
      )}
      
      {/* BST controls - simplified */}
      {mode === 'bst' && (
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Value" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDataStructureAction('insert')}
            className="bg-white border border-neutral-300 px-3 py-1.5 w-24 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400"
          />
          <button 
            onClick={() => handleDataStructureAction('insert')}
            className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            Insert
          </button>
          <button 
            onClick={() => handleDataStructureAction('search')}
            className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-400"
          >
            Search
          </button>
        </div>
      )}

      <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
      
      {/* Playback controls - only show for sorting/pathfinding */}
      {(mode === 'sorting' || mode === 'pathfinding') && (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => reset()}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={prevStep}
            disabled={isPlaying || currentStepIndex <= -1}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-30"
          >
            Prev
          </button>
          <button 
            onClick={handlePlay}
            className={`px-4 py-1.5 border transition-colors ${
              isPlaying 
                ? 'border-amber-500 text-amber-600' 
                : 'border-neutral-400 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={nextStep}
            disabled={isPlaying || currentStepIndex >= steps.length - 1}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {/* Playback controls for data structures */}
      {(mode === 'linkedlist' || mode === 'bst') && (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => reset()}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Clear All
          </button>
          <button 
            onClick={prevStep}
            disabled={isPlaying || currentStepIndex <= -1}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-30"
          >
            Prev
          </button>
          <button 
            onClick={handleDataStructurePlay}
            disabled={steps.length === 0}
            className={`px-4 py-1.5 border transition-colors disabled:opacity-30 ${
              isPlaying 
                ? 'border-amber-500 text-amber-600' 
                : 'border-neutral-400 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={nextStep}
            disabled={isPlaying || currentStepIndex >= steps.length - 1}
            className="px-2 py-1.5 text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <span className="ml-auto text-xs text-neutral-400 font-mono">
        {Math.max(0, currentStepIndex + 1)}/{steps.length}
      </span>
    </div>
  )
}
