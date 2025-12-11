'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { useEffect } from 'react'
import { bubbleSort } from '~/libs/visualizer/algorithms/sorting/bubble-sort'
import { motion } from 'framer-motion'

export function VisualizerCanvas() {
  const { 
    array, 
    randomizeArray, 
    generateSteps,
    steps,
    currentStepIndex
  } = useVisualizerStore()

  useEffect(() => {
    randomizeArray(30)
  }, [randomizeArray])

  useEffect(() => {
    if (array.length > 0 && steps.length === 0) {
      generateSteps(bubbleSort) 
    }
  }, [array.length, steps.length, generateSteps])

  const currentStep = steps[currentStepIndex]
  const maxValue = Math.max(...array, 1)

  if (array.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    )
  }
  
  return (
    <div className="flex h-full w-full items-end justify-center gap-[1px] p-6 bg-neutral-50">
      {array.map((value, idx) => {
        let bgColor = 'bg-neutral-400'
        
        if (currentStep) {
          if (currentStep.indices.includes(idx)) {
            if (currentStep.type === 'compare') bgColor = 'bg-amber-500'
            if (currentStep.type === 'swap') bgColor = 'bg-rose-500'
            if (currentStep.type === 'sorted') bgColor = 'bg-emerald-500'
          }
        }
        
        const isSorted = steps.some(
          (s, i) => i <= currentStepIndex && s.type === 'sorted' && s.indices.includes(idx)
        )
        if (isSorted && bgColor === 'bg-neutral-400') {
          bgColor = 'bg-emerald-500'
        }
        
        return (
          <motion.div
            key={idx}
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex-1 max-w-[20px] transition-colors duration-100 ${bgColor}`}
            style={{ minWidth: '2px' }}
          />
        )
      })}
    </div>
  )
}
