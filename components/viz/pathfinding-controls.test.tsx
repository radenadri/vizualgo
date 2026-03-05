// @ts-nocheck
import { describe, expect, it } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { ControlPanel } from './control-panel'
import { useVisualizerStore } from '~/libs/visualizer/store'

describe('pathfinding controls', () => {
  it('renders generate maze action in pathfinding mode', () => {
    const html = renderToString(<ControlPanel mode="pathfinding" />)
    expect(html.includes('Generate Maze')).toBe(true)
  })

  it('disables generate maze action while playing', () => {
    useVisualizerStore.setState({ isPlaying: true })

    const html = renderToString(<ControlPanel mode="pathfinding" />)
    expect(html.includes('Generate Maze')).toBe(true)
    expect(html.includes('disabled')).toBe(true)

    useVisualizerStore.setState({ isPlaying: false })
  })
})
