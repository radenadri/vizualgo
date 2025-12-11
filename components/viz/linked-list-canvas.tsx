'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

export function LinkedListCanvas() {
  const { linkedList, steps, currentStepIndex } = useVisualizerStore()
  
  const orderedList = useMemo(() => {
    if (linkedList.length === 0) return []
    return linkedList
  }, [linkedList])

  const step = steps[currentStepIndex > -1 ? currentStepIndex : steps.length - 1]

  if (orderedList.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-400">Empty list</p>
          <p className="text-xs text-neutral-300 mt-1">Enter a value and click Append</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-start p-8 overflow-x-auto bg-neutral-50">
      <div className="flex gap-1 items-center min-w-max">
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider mr-3">Head</span>

        <AnimatePresence mode="popLayout">
          {orderedList.map((node) => {
            const isHighlighted = step?.nodeId === node.id || step?.targetId === node.id
            const isDeleting = step?.type === 'delete' && step?.nodeId === node.id
            
            return (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isDeleting ? 0.3 : 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <motion.div 
                  className="w-12 h-12 border flex items-center justify-center font-mono text-sm"
                  animate={{
                    backgroundColor: isHighlighted ? '#f5f5f5' : 'white',
                    borderColor: isHighlighted ? '#a3a3a3' : '#e5e5e5',
                  }}
                >
                  {node.value}
                </motion.div>
                
                {node.nextId ? (
                  <div className="w-6 h-[1px] bg-neutral-300" />
                ) : (
                  <span className="ml-3 text-[10px] text-neutral-400 font-mono">null</span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
