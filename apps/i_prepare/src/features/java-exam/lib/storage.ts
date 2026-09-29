/**
 * Persistence for the Java exam system, under its own storage namespace so its
 * sessions/results/mastery never collide with the reasoning mock-test data.
 *
 * IndexedDB primary → localStorage → memory, matching the reasoning storage
 * adapter's behaviour and surfacing which backend is live.
 */

export type JavaStorageKind = 'indexeddb' | 'localstorage' | 'memory'

export type JavaCollection = 'java-kv' | 'java-sessions' | 'java-results' | 'java-mastery'

export interface JavaPersistableRecord {
  id?: string
  key?: string
}

export interface JavaPersistAdapter {
  readonly kind: JavaStorageKind
  get<T>(collection: JavaCollection, key: string): Promise<T | null>
  getAll<T>(collection: JavaCollection): Promise<T[]>
  put<T extends JavaPersistableRecord>(collection: JavaCollection, record: T): Promise<void>
  remove(collection: JavaCollection, key: string): Promise<void>
}

export const JAVA_STORAGE_LABELS: Record<JavaStorageKind, string> = {
  indexeddb: 'Saved to this browser (IndexedDB)',
  localstorage: 'Saved to this browser (localStorage fallback)',
  memory: 'Storage unavailable — progress is kept only in this tab',
}

const DB_NAME = 'i-prepare'
const DB_VERSION = 2 // v2 adds the java-* object stores
const KEY_PATH: Record<JavaCollection, string> = {
  'java-kv': 'key',
  'java-sessions': 'id',
  'java-results': 'id',
  'java-mastery': 'key',
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

class JavaIndexedDbAdapter implements JavaPersistAdapter {
  readonly kind = 'indexeddb' as const
  private db: IDBDatabase | null = null

  async init(): Promise<boolean> {
    if (typeof indexedDB === 'undefined') return false
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
          const db = request.result
          for (const collection of Object.keys(KEY_PATH) as JavaCollection[]) {
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

  private store(collection: JavaCollection, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error('IndexedDB is not open')
    return this.db.transaction(collection, mode).objectStore(collection)
  }

  async get<T>(collection: JavaCollection, key: string): Promise<T | null> {
    if (!this.db) return null
    const result = await promisifyRequest<T | undefined>(this.store(collection, 'readonly').get(key))
    return result ?? null
  }

  async getAll<T>(collection: JavaCollection): Promise<T[]> {
    if (!this.db) return []
    return promisifyRequest<T[]>(this.store(collection, 'readonly').getAll())
  }

  async put<T extends JavaPersistableRecord>(collection: JavaCollection, record: T): Promise<void> {
    if (!this.db) throw new Error('IndexedDB is not open')
    await promisifyRequest(this.store(collection, 'readwrite').put(record))
  }

  async remove(collection: JavaCollection, key: string): Promise<void> {
    if (!this.db) return
    await promisifyRequest(this.store(collection, 'readwrite').delete(key))
  }
}

class JavaJsonAdapter implements JavaPersistAdapter {
  readonly kind: JavaStorageKind
  private memory = new Map<JavaCollection, JavaPersistableRecord[]>()
  private degraded = false

  constructor(kind: 'localstorage' | 'memory') {
    this.kind = kind
  }

  private storageKey(collection: JavaCollection): string {
    return `i-prepare:${collection}`
  }

  async init(): Promise<boolean> {
    if (this.kind === 'memory') return true
    try {
      const probe = '__i-prepare-java-probe__'
      localStorage.setItem(probe, '1')
      localStorage.removeItem(probe)
      return true
    } catch {
      return false
    }
  }

  private read(collection: JavaCollection): JavaPersistableRecord[] {
    if (this.kind === 'memory' || this.degraded) return this.memory.get(collection) ?? []
    try {
      const raw = localStorage.getItem(this.storageKey(collection))
      return raw ? (JSON.parse(raw) as JavaPersistableRecord[]) : []
    } catch {
      return []
    }
  }

  private write(collection: JavaCollection, records: JavaPersistableRecord[]): void {
    if (this.kind === 'memory') {
      this.memory.set(collection, records)
      return
    }
    try {
      localStorage.setItem(this.storageKey(collection), JSON.stringify(records))
    } catch {
      this.degraded = true
      this.memory.set(collection, records)
    }
  }

  private keyOf(collection: JavaCollection, record: JavaPersistableRecord): string | undefined {
    return (record as Record<string, unknown>)[KEY_PATH[collection]] as string | undefined
  }

  async get<T>(collection: JavaCollection, key: string): Promise<T | null> {
    const found = this.read(collection).find((record) => this.keyOf(collection, record) === key)
    return (found as T | undefined) ?? null
  }

  async getAll<T>(collection: JavaCollection): Promise<T[]> {
    return this.read(collection) as T[]
  }

  async put<T extends JavaPersistableRecord>(collection: JavaCollection, record: T): Promise<void> {
    const key = this.keyOf(collection, record)
    if (!key) throw new Error(`Record for "${collection}" needs a key`)
    const records = this.read(collection)
    const index = records.findIndex((item) => this.keyOf(collection, item) === key)
    if (index >= 0) records[index] = record
    else records.push(record)
    this.write(collection, records)
  }

  async remove(collection: JavaCollection, key: string): Promise<void> {
    const records = this.read(collection).filter((record) => this.keyOf(collection, record) !== key)
    this.write(collection, records)
  }
}

/* ── Factory ───────────────────────────────────────────────────────────────── */

let adapter: JavaPersistAdapter | null = null

export async function createJavaStorage(): Promise<JavaPersistAdapter> {
  if (adapter) return adapter
  const indexedDb = new JavaIndexedDbAdapter()
  if (await indexedDb.init()) {
    adapter = indexedDb
    return adapter
  }
  const local = new JavaJsonAdapter('localstorage')
  if (await local.init()) {
    adapter = local
    return adapter
  }
  adapter = new JavaJsonAdapter('memory')
  return adapter
}

export function getJavaStorage(): JavaPersistAdapter {
  if (!adapter) throw new Error('Java storage has not been initialised')
  return adapter
}
