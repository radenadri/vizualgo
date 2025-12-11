'use client'

import { useVisualizerStore } from '~/libs/visualizer/store'
import cn from 'clsx'

export function GridCanvas() {
  const { 
    grid, 
    toggleWall, 
    isMousePressed, 
    setMousePressed
  } = useVisualizerStore()

  const handleMouseDown = (row: number, col: number) => {
    setMousePressed(true)
    toggleWall(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isMousePressed) {
      toggleWall(row, col)
    }
  }

  const handleMouseUp = () => {
    setMousePressed(false)
  }

  return (
    <div 
      className="flex h-full w-full items-center justify-center bg-neutral-50 p-4 overflow-hidden select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex flex-col gap-px bg-neutral-200 border border-neutral-200">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-px">
            {row.map((node, colIdx) => {
              let bgClass = 'bg-white' // Default Empty
              
              if (node.isWall) bgClass = 'bg-neutral-400'
              if (node.isPath) bgClass = 'bg-amber-400'
              else if (node.isVisited) bgClass = 'bg-indigo-200'
              
              if (node.isStart) bgClass = 'bg-emerald-500'
              if (node.isEnd) bgClass = 'bg-rose-500'

              return (
                <div
                  key={colIdx}
                  className={cn("w-5 h-5 transition-colors duration-150", bgClass)}
                  onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
