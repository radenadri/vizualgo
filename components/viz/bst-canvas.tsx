'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useVisualizerStore } from '~/libs/visualizer/store'

function BSTNode({
  node,
  isHighlighted,
  isFound,
}: {
  node: any
  isHighlighted: boolean
  isFound: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(ref.current, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
      })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      gsap.to(ref.current, {
        left: `${node.x}%`,
        top: `${node.y}%`,
        duration: 0.4,
        ease: 'power2.out',
      })

      let targetBg = 'white'
      let targetBorder = '#e5e5e5'
      let targetColor = '#171717'

      if (isFound) {
        targetBg = '#22c55e'
        targetBorder = '#22c55e'
        targetColor = '#fff'
      } else if (isHighlighted) {
        targetBg = '#f5f5f5'
        targetBorder = '#a3a3a3'
      }

      gsap.to('.node-content', {
        backgroundColor: targetBg,
        borderColor: targetBorder,
        color: targetColor,
        duration: 0.2,
      })
    },
    { dependencies: [node.x, node.y, isHighlighted, isFound], scope: ref }
  )

  return (
    <div
      ref={ref}
      className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        width: '2.5rem',
        height: '2.5rem',
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
    >
      <div
        className="node-content w-full h-full border flex items-center justify-center font-mono text-sm rounded-full"
        style={{
          backgroundColor: 'white',
          borderColor: '#e5e5e5',
        }}
      >
        {node.value}
      </div>
    </div>
  )
}

export function BSTCanvas() {
  const { bstNodes, steps, currentStepIndex } = useVisualizerStore()

  const nodes = Object.values(bstNodes)
  const step =
    steps[currentStepIndex > -1 ? currentStepIndex : steps.length - 1]

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-400">Empty tree</p>
          <p className="text-xs text-neutral-300 mt-1">
            Enter a value and click Insert
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-50">
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <title>BST Edges</title>
        {nodes.map((node) => {
          if (!(node.leftId || node.rightId)) return null
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
      {nodes.map((node) => {
        const isHighlighted =
          step?.nodeId === node.id || step?.targetId === node.id
        const isFound = step?.type === 'sorted' && step?.nodeId === node.id

        return (
          <BSTNode
            key={node.id}
            node={node}
            isHighlighted={!!isHighlighted}
            isFound={!!isFound}
          />
        )
      })}
    </div>
  )
}
