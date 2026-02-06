'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { bubbleSort } from '~/libs/visualizer/algorithms/sorting/bubble-sort'
import { useVisualizerStore } from '~/libs/visualizer/store'

export function VisualizerCanvas() {
  const {
    array,
    randomizeArray,
    generateSteps,
    steps,
    currentStepIndex,
    playbackSpeed,
  } = useVisualizerStore()
  const containerRef = useRef<HTMLDivElement>(null)

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

  useGSAP(
    () => {
      if (array.length === 0) return

      gsap.to('.bar', {
        height: (i) => `${(array[i] / maxValue) * 100}%`,
        duration: playbackSpeed
          ? Math.max(0.1, (1010 - playbackSpeed) / 2000)
          : 0.2,
        ease: 'power2.out',

        overwrite: 'auto',
      })
    },
    {
      dependencies: [array, maxValue, playbackSpeed],
      scope: containerRef,
    }
  )

  if (array.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-end justify-center gap-[1px] p-6 bg-neutral-50"
    >
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
          (s, i) =>
            i <= currentStepIndex &&
            s.type === 'sorted' &&
            s.indices.includes(idx)
        )
        if (isSorted && bgColor === 'bg-neutral-400') {
          bgColor = 'bg-emerald-500'
        }

        return (
          <div
            key={idx}
            className={`bar flex-1 max-w-[20px] transition-colors duration-100 ${bgColor} relative group`}
            style={{ minWidth: '2px', height: '0%' }}
          >
            <span
              className={`
                absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 font-mono
                ${array.length <= 20 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                transition-opacity duration-200
              `}
            >
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
