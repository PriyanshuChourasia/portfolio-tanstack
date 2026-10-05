/**
 * Persistence for the ML mentor system, under its own storage namespace so its
 * progress/sessions/interviews never collide with the reasoning, Java or
 * mock-test data.
 *
 * IndexedDB primary → localStorage → memory, matching the other feature
 * adapters' behaviour and surfacing which backend is live.
 */

export type MLStorageKind = 'indexeddb' | 'localstorage' | 'memory'

export type MLCollection = 'ml-kv' | 'ml-progress' | 'ml-assessments' | 'ml-interviews' | 'ml-sessions'

export interface MLPersistableRecord {
  id?: string
  key?: string
}

export interface MLPersistAdapter {
  readonly kind: MLStorageKind
  get<T>(collection: MLCollection, key: string): Promise<T | null>
  getAll<T>(collection: MLCollection): Promise<T[]>
  put<T extends MLPersistableRecord>(collection: MLCollection, record: T): Promise<void>
  remove(collection: MLCollection, key: string): Promise<void>
}

export const ML_STORAGE_LABELS: Record<MLStorageKind, string> = {
  indexeddb: 'Saved to this browser (IndexedDB)',
  localstorage: 'Saved to this browser (localStorage fallback)',
  memory: 'Storage unavailable — progress is kept only in this tab',
}

const DB_NAME = 'i-prepare'
const DB_VERSION = 3 // v3 adds the ml-* object stores
const KEY_PATH: Record<MLCollection, string> = {
  'ml-kv': 'key',
  'ml-progress': 'key',
  'ml-assessments': 'id',
  'ml-interviews': 'id',
  'ml-sessions': 'id',
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

class MLIndexedDbAdapter implements MLPersistAdapter {
  readonly kind = 'indexeddb' as const
  private db: IDBDatabase | null = null

  async init(): Promise<boolean> {
    if (typeof indexedDB === 'undefined') return false
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
          const db = request.result
          for (const collection of Object.keys(KEY_PATH) as MLCollection[]) {
            if (!db.objectStoreNames.contains(collection)) {
              db.createObjectStore(collection, { keyPath: KEY_PATH[collection] })
            }
          }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'))
      })
      return true
    } catch {
      this.db = null
      return false
    }
  }

  private store(collection: MLCollection, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error('IndexedDB is not open')
    return this.db.transaction(collection, mode).objectStore(collection)
  }

  async get<T>(collection: MLCollection, key: string): Promise<T | null> {
    if (!this.db) return null
    const result = await promisifyRequest<T | undefined>(this.store(collection, 'readonly').get(key))
    return result ?? null
  }

  async getAll<T>(collection: MLCollection): Promise<T[]> {
    if (!this.db) return []
    return promisifyRequest<T[]>(this.store(collection, 'readonly').getAll())
  }

  async put<T extends MLPersistableRecord>(collection: MLCollection, record: T): Promise<void> {
    if (!this.db) throw new Error('IndexedDB is not open')
    await promisifyRequest(this.store(collection, 'readwrite').put(record))
  }

  async remove(collection: MLCollection, key: string): Promise<void> {
    if (!this.db) return
    await promisifyRequest(this.store(collection, 'readwrite').delete(key))
  }
}

class MLJsonAdapter implements MLPersistAdapter {
  readonly kind: MLStorageKind
  private memory = new Map<MLCollection, MLPersistableRecord[]>()
  private degraded = false

  constructor(kind: 'localstorage' | 'memory') {
    this.kind = kind
  }

  private storageKey(collection: MLCollection): string {
    return `i-prepare:${collection}`
  }

  async init(): Promise<boolean> {
    if (this.kind === 'memory') return true
    try {
      const probe = '__i-prepare-ml-probe__'
      localStorage.setItem(probe, '1')
      localStorage.removeItem(probe)
      return true
    } catch {
      return false
    }
  }

  private read(collection: MLCollection): MLPersistableRecord[] {
    if (this.kind === 'memory' || this.degraded) return this.memory.get(collection) ?? []
    try {
      const raw = localStorage.getItem(this.storageKey(collection))
      return raw ? (JSON.parse(raw) as MLPersistableRecord[]) : []
    } catch {
      return []
    }
  }

  private write(collection: MLCollection, records: MLPersistableRecord[]): void {
    if (this.kind === 'memory') {
      this.memory.set(collection, records)
      return
    }
    try {
      localStorage.setItem(this.storageKey(collection), JSON.stringify(records))
    } catch {
      // Quota or blocked storage — keep the data in memory so the current tab survives.
      this.degraded = true
      this.memory.set(collection, records)
    }
  }

  private keyOf(collection: MLCollection, record: MLPersistableRecord): string | undefined {
    return (record as Record<string, unknown>)[KEY_PATH[collection]] as string | undefined
  }

  async get<T>(collection: MLCollection, key: string): Promise<T | null> {
    const found = this.read(collection).find((record) => this.keyOf(collection, record) === key)
    return (found as T | undefined) ?? null
  }

  async getAll<T>(collection: MLCollection): Promise<T[]> {
    return this.read(collection) as T[]
  }

  async put<T extends MLPersistableRecord>(collection: MLCollection, record: T): Promise<void> {
    const key = this.keyOf(collection, record)
    if (!key) throw new Error(`Record for "${collection}" needs a key`)
    const records = this.read(collection)
    const index = records.findIndex((item) => this.keyOf(collection, item) === key)
    if (index >= 0) records[index] = record
    else records.push(record)
    this.write(collection, records)
  }

  async remove(collection: MLCollection, key: string): Promise<void> {
    const records = this.read(collection).filter((record) => this.keyOf(collection, record) !== key)
    this.write(collection, records)
  }
}

/* ── Factory ───────────────────────────────────────────────────────────────── */

let adapter: MLPersistAdapter | null = null

export async function createMLStorage(): Promise<MLPersistAdapter> {
  if (adapter) return adapter
  const indexedDb = new MLIndexedDbAdapter()
  if (await indexedDb.init()) {
    adapter = indexedDb
    return adapter
  }
  const local = new MLJsonAdapter('localstorage')
  if (await local.init()) {
    adapter = local
    return adapter
  }
  adapter = new MLJsonAdapter('memory')
  return adapter
}

export function getMLStorage(): MLPersistAdapter {
  if (!adapter) throw new Error('ML storage has not been initialised')
  return adapter
}
