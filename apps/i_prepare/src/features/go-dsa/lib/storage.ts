/**
 * Persistence for the Go + DSA mentor. The whole learner state is one small
 * JSON document, so it lives in localStorage under its own key (no IndexedDB
 * version bump shared with the other features). Falls back to memory when
 * storage is blocked so the current tab keeps working.
 */

export type GoStorageKind = 'localstorage' | 'memory'

export const GO_STORAGE_LABELS: Record<GoStorageKind, string> = {
  localstorage: 'Saved to this browser',
  memory: 'Storage unavailable — progress is kept only in this tab',
}

const STORAGE_KEY = 'i-prepare:go-dsa'

let memory: unknown = null
let kind: GoStorageKind | null = null

function detect(): GoStorageKind {
  if (kind) return kind
  try {
    const probe = '__i-prepare-go-probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    kind = 'localstorage'
  } catch {
    kind = 'memory'
  }
  return kind
}

export function storageKind(): GoStorageKind {
  return detect()
}

export function loadState(): unknown {
  if (detect() === 'memory') return memory
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Returns false when the write failed (quota, blocked) — the caller surfaces it. */
export function saveState(value: unknown): boolean {
  memory = value
  if (detect() === 'memory') return true
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    return true
  } catch {
    kind = 'memory'
    return false
  }
}
