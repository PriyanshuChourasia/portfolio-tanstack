/**
 * Persistence for the mock-test system.
 *
 * IndexedDB is the primary store (it comfortably holds the question snapshots that
 * make a finished result self-contained). If IndexedDB is unavailable — private
 * browsing, blocked storage, older browsers — the same interface falls back to
 * localStorage and finally to memory, and the UI surfaces which one is in use so an
 * answer is never silently dropped.
 */

export type StorageKind = 'indexeddb' | 'localstorage' | 'memory'

export type Collection = 'kv' | 'sessions' | 'results'

/** Anything with the primary key of its collection (`id`, or `key` for the kv store). */
export interface PersistableRecord {
  id?: string
  key?: string
}

export interface PersistAdapter {
  readonly kind: StorageKind
  get<T>(collection: Collection, key: string): Promise<T | null>
  getAll<T>(collection: Collection): Promise<T[]>
  put<T extends PersistableRecord>(collection: Collection, record: T): Promise<void>
  remove(collection: Collection, key: string): Promise<void>
}

export const STORAGE_LABELS: Record<StorageKind, string> = {
  indexeddb: 'Saved to this browser (IndexedDB)',
  localstorage: 'Saved to this browser (localStorage fallback)',
  memory: 'Storage unavailable — progress is kept only in this tab',
}

/* ── IndexedDB ─────────────────────────────────────────────────────────────── */

const DB_NAME = 'reasoning-mock'
const DB_VERSION = 1
const KEY_PATH: Record<Collection, string> = { kv: 'key', sessions: 'id', results: 'id' }

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

class IndexedDbAdapter implements PersistAdapter {
  readonly kind = 'indexeddb' as const
  private db: IDBDatabase | null = null

  async init(): Promise<boolean> {
    if (typeof indexedDB === 'undefined') return false
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
          const db = request.result
          for (const collection of Object.keys(KEY_PATH) as Collection[]) {
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

  private store(collection: Collection, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error('IndexedDB is not open')
    return this.db.transaction(collection, mode).objectStore(collection)
  }

  async get<T>(collection: Collection, key: string): Promise<T | null> {
    if (!this.db) return null
    const result = await promisifyRequest<T | undefined>(this.store(collection, 'readonly').get(key))
    return result ?? null
  }

  async getAll<T>(collection: Collection): Promise<T[]> {
    if (!this.db) return []
    return promisifyRequest<T[]>(this.store(collection, 'readonly').getAll())
  }

  async put<T extends PersistableRecord>(collection: Collection, record: T): Promise<void> {
    if (!this.db) throw new Error('IndexedDB is not open')
    await promisifyRequest(this.store(collection, 'readwrite').put(record))
  }

  async remove(collection: Collection, key: string): Promise<void> {
    if (!this.db) return
    await promisifyRequest(this.store(collection, 'readwrite').delete(key))
  }
}

/* ── localStorage / memory ─────────────────────────────────────────────────── */

class JsonCollectionAdapter implements PersistAdapter {
  readonly kind: StorageKind
  private memory = new Map<Collection, PersistableRecord[]>()
  /** Set when localStorage rejects a write, so reads switch to the memory copy. */
  private degraded = false

  constructor(kind: 'localstorage' | 'memory') {
    this.kind = kind
  }

  private storageKey(collection: Collection): string {
    return `reasoning-mock:${collection}`
  }

  async init(): Promise<boolean> {
    if (this.kind === 'memory') return true
    try {
      const probe = '__reasoning-mock-probe__'
      localStorage.setItem(probe, '1')
      localStorage.removeItem(probe)
      return true
    } catch {
      return false
    }
  }

  private read(collection: Collection): PersistableRecord[] {
    if (this.kind === 'memory' || this.degraded) return this.memory.get(collection) ?? []
    try {
      const raw = localStorage.getItem(this.storageKey(collection))
      return raw ? (JSON.parse(raw) as PersistableRecord[]) : []
    } catch {
      return []
    }
  }

  private write(collection: Collection, records: PersistableRecord[]): void {
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

  private keyOf(collection: Collection, record: PersistableRecord): string | undefined {
    return (record as Record<string, unknown>)[KEY_PATH[collection]] as string | undefined
  }

  async get<T>(collection: Collection, key: string): Promise<T | null> {
    const found = this.read(collection).find((record) => this.keyOf(collection, record) === key)
    return (found as T | undefined) ?? null
  }

  async getAll<T>(collection: Collection): Promise<T[]> {
    return this.read(collection) as T[]
  }

  async put<T extends PersistableRecord>(collection: Collection, record: T): Promise<void> {
    const key = this.keyOf(collection, record)
    if (!key) throw new Error(`Record for "${collection}" needs a key`)
    const records = this.read(collection)
    const index = records.findIndex((item) => this.keyOf(collection, item) === key)
    if (index >= 0) records[index] = record
    else records.push(record)
    this.write(collection, records)
  }

  async remove(collection: Collection, key: string): Promise<void> {
    const records = this.read(collection).filter((record) => this.keyOf(collection, record) !== key)
    this.write(collection, records)
  }
}

/* ── Factory ───────────────────────────────────────────────────────────────── */

export async function createStorage(): Promise<PersistAdapter> {
  const indexedDb = new IndexedDbAdapter()
  if (await indexedDb.init()) return indexedDb

  const local = new JsonCollectionAdapter('localstorage')
  if (await local.init()) return local

  const memory = new JsonCollectionAdapter('memory')
  await memory.init()
  return memory
}
