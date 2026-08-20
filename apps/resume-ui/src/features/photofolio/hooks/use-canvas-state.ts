import { useCallback, useReducer } from 'react'
import type { CanvasTransform, Point } from '../types'
import { clamp } from '../utils'
import { CANVAS_DEFAULTS } from '../constants'

interface CanvasState {
  transform: CanvasTransform
  showGrid: boolean
  gridSize: number
}

type CanvasAction =
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_OFFSET'; offset: Point }
  | { type: 'TOGGLE_GRID' }
  | { type: 'RESET_VIEW' }

const initialState: CanvasState = {
  transform: {
    offset: { x: 0, y: 0 },
    zoom: CANVAS_DEFAULTS.ZOOM_INITIAL,
  },
  showGrid: CANVAS_DEFAULTS.GRID_VISIBLE,
  gridSize: CANVAS_DEFAULTS.GRID_SIZE,
}

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'SET_ZOOM':
      return {
        ...state,
        transform: {
          ...state.transform,
          zoom: clamp(action.zoom, CANVAS_DEFAULTS.ZOOM_MIN, CANVAS_DEFAULTS.ZOOM_MAX),
        },
      }
    case 'SET_OFFSET':
      return { ...state, transform: { ...state.transform, offset: action.offset } }
    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid }
    case 'RESET_VIEW':
      return { ...state, transform: initialState.transform }
    default:
      return state
  }
}

export function useCanvasState() {
  const [state, dispatch] = useReducer(canvasReducer, initialState)

  const setZoom = useCallback((zoom: number) => dispatch({ type: 'SET_ZOOM', zoom }), [])
  const setOffset = useCallback((offset: Point) => dispatch({ type: 'SET_OFFSET', offset }), [])
  const toggleGrid = useCallback(() => dispatch({ type: 'TOGGLE_GRID' }), [])
  const resetView = useCallback(() => dispatch({ type: 'RESET_VIEW' }), [])

  return {
    transform: state.transform,
    showGrid: state.showGrid,
    gridSize: state.gridSize,
    setZoom,
    setOffset,
    toggleGrid,
    resetView,
  }
}
