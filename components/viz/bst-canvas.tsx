'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import { motion, AnimatePresence } from 'framer-motion'

export function BSTCanvas() {
  const { bstNodes, steps, currentStepIndex } = useVisualizerStore()

  const nodes = Object.values(bstNodes)
  const step = steps[currentStepIndex > -1 ? currentStepIndex : steps.length - 1]

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-400">Empty tree</p>
          <p className="text-xs text-neutral-300 mt-1">Enter a value and click Insert</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-50">
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map(node => {
          if (!node.leftId && !node.rightId) return null
          return (
            <g key={`edges-${node.id}`}>
              {node.leftId && bstNodes[node.leftId] && (
                <line 
                  x1={`${node.x}%`} 
                  y1={`${node.y}%`}
                  x2={`${bstNodes[node.leftId].x}%`}
                  y2={`${bstNodes[node.leftId].y}%`}
                  stroke="#d4d4d4"
                  strokeWidth="1"
                />
              )}
              {node.rightId && bstNodes[node.rightId] && (
                <line 
                  x1={`${node.x}%`} 
                  y1={`${node.y}%`}
                  x2={`${bstNodes[node.rightId].x}%`}
                  y2={`${bstNodes[node.rightId].y}%`}
                  stroke="#d4d4d4"
                  strokeWidth="1"
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      <AnimatePresence>
        {nodes.map((node) => {
          const isHighlighted = step?.nodeId === node.id || step?.targetId === node.id
          const isFound = step?.type === 'sorted' && step?.nodeId === node.id

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                left: `${node.x}%`,
                top: `${node.y}%`
              }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <motion.div 
                className="w-full h-full border flex items-center justify-center font-mono text-sm"
                animate={{
                  backgroundColor: isFound ? '#22c55e' : isHighlighted ? '#f5f5f5' : 'white',
                  borderColor: isFound ? '#22c55e' : isHighlighted ? '#a3a3a3' : '#e5e5e5',
                  color: isFound ? '#fff' : '#171717',
                }}
              >
                {node.value}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
