import type { JavaQuestionInput } from '../types'

/** Collections domain: List/Set/Map internals, HashMap deep-dive, concurrent collections. */
export const collectionsQuestions: JavaQuestionInput[] = [
  {
    id: 'col-001',
    domain: 'Collections',
    level: 2,
    kind: 'mcq',
    prompt: 'What happens on HashMap.put when two keys have the same hash but are not equal?',
    options: [
      'The second put replaces the first value',
      'Both entries live in the same bucket (linked list / tree) and equals() separates them',
      'The second put is rejected',
      'The map grows its capacity',
    ],
    answerKey: 1,
    explanation:
      'Same bucket, different entries: put walks the bucket comparing equals(); no match → append. Java 8+ converts a bucket to a red-black tree once it holds 8 entries (untreeify at 6).',
    followUps: ['What are the treeify/untreeify thresholds and why 8 and 6?'],
    trap: 'Same hash ≠ same key. Replacement happens only when hash AND equals match.',
  },
  {
    id: 'col-002',
    domain: 'Collections',
    level: 3,
    kind: 'mcq',
    prompt: 'How does HashMap compute the final bucket index?',
    options: [
      'hashCode() % table.length',
      '(table.length - 1) & (h ^ (h >>> 16))',
      'Math.abs(hashCode()) % capacity',
      'Directly hashCode() & 0xFF',
    ],
    answerKey: 1,
    explanation:
      'HashMap spreads the high bits down (h ^ h >>> 16) then masks with capacity-1 — cheaper than modulo and reduces clustering from poor hashCodes.',
    followUps: ['Why must capacity be a power of two?'],
  },
  {
    id: 'col-003',
    domain: 'Collections',
    level: 3,
    kind: 'mcq',
    prompt: 'What is the difference between fail-fast HashMap iterator and ConcurrentHashMap\u2019s iterator?',
    options: [
      'No difference — both throw ConcurrentModificationException',
      'HashMap throws CME (modCount check, best-effort); CHM iterates weakly consistent without throwing',
      'HashMap is weakly consistent; CHM throws CME',
      'Both iterate over snapshots',
    ],
    answerKey: 1,
    explanation:
      'HashMap\u2019s iterator checks modCount on next() and throws ConcurrentModificationException (best-effort). CHM\u2019s iterators are weakly consistent: they never throw CME and reflect (or not) concurrent updates without a guarantee.',
    followUps: ['Why is fail-fast best-effort rather than guaranteed?'],
  },
  {
    id: 'col-004',
    domain: 'Collections',
    level: 4,
    kind: 'mcq',
    prompt: 'How does ConcurrentHashMap achieve thread safety in Java 8+?',
    options: [
      'One lock on the whole map',
      'Segment-level locking (16 segments)',
      'CAS on empty bins + synchronized on the bin head for updates; volatile reads',
      'Copy-on-write on every update',
    ],
    answerKey: 2,
    explanation:
      'Java 8 CHM dropped segments: empty bins are inserted with CAS; contended bins lock only that bin\u2019s head node with synchronized; reads are volatile and lock-free.',
    followUps: ['What did the Java 7 segment design cost?', 'Why not ReentrantLock per bin?'],
    trap: 'The segment answer is the classic outdated one — knowing the Java 8 redesign is the senior signal.',
  },
  {
    id: 'col-005',
    domain: 'Collections',
    level: 4,
    kind: 'short_answer',
    prompt: 'Compare HashMap, Hashtable, Collections.synchronizedMap and ConcurrentHashMap for a high-traffic cache. When is each appropriate?',
    modelAnswer:
      'HashMap: fastest, no thread safety — single-threaded or externally synchronised use. Hashtable: legacy, every method synchronized on the object → poor throughput, no null keys; never choose it. Collections.synchronizedMap: one lock for the whole map, correct but serialises all access; iteration still requires manual synchronisation (no weakly consistent iterator). ConcurrentHashMap: bucket-level locking + CAS, lock-free volatile reads, weakly consistent iterators, computeIfAbsent for atomic read-or-compute — the default choice for concurrent caches. Also mention size()/isEmpty() are estimates under concurrency, and that CHM forbids null keys/values because an ambiguous null get() cannot be distinguished from absent.',
    rubric: [
      'Correct safety mechanism for each of the four',
      'Iteration caveat for synchronizedMap',
      'Why CHM disallows nulls',
      'Performance reasoning, not just "CHM is faster"',
    ],
    explanation:
      'This comparison appears in nearly every senior Java screen — the null-key rationale is what separates memorised from understood.',
    followUps: ['How would you migrate a synchronizedMap to CHM without behavioural regressions?'],
  },
  {
    id: 'col-006',
    domain: 'Collections',
    level: 3,
    kind: 'output_prediction',
    prompt: 'What is the output?',
    code: 'List<String> list = new ArrayList<>();\nlist.add("a"); list.add("b"); list.add("c");\nfor (String s : list) {\n  if (s.equals("b")) list.remove(s);\n}\nSystem.out.println(list);',
    options: ['[a, c]', '[a, b, c]', 'ConcurrentModificationException', '[a]'],
    answerKey: 2,
    explanation:
      'The enhanced for loop uses an iterator; removing via the list (not iterator.remove()) increments modCount and the next next() throws ConcurrentModificationException. Interestingly, removing the second-to-last element sometimes escapes detection — but not here.',
    followUps: ['Why does removing the second-to-last element often NOT throw? (hasNext checks cursor != size)'],
    trap: 'The "remove second-to-last doesn\u2019t throw" quirk is a favourite follow-up.',
  },
  {
    id: 'col-007',
    domain: 'Collections',
    level: 2,
    kind: 'mcq',
    prompt: 'Which collection preserves insertion order AND allows O(1) lookup by key?',
    options: ['TreeMap', 'LinkedHashMap', 'PriorityQueue', 'HashSet'],
    answerKey: 1,
    explanation:
      'LinkedHashMap maintains a doubly-linked list through its entries on top of hashing — insertion-order iteration with HashMap-speed operations.',
    followUps: ['How does accessOrder=true enable LRU caches?'],
  },
  {
    id: 'col-008',
    domain: 'Collections',
    level: 4,
    kind: 'coding',
    prompt:
      'Implement an LRU cache with O(1) get and put using JDK collections only. State what you would change for thread safety.',
    modelAnswer:
      'class LruCache<K,V> extends LinkedHashMap<K,V> { protected boolean removeEldestEntry(Map.Entry<K,V> e) { return size() > capacity; } } constructed with accessOrder=true. get/put are O(1) via hashing + the linked list moving entries to the tail. Thread safety: wrap every call in synchronisation (coarse), or use Caffeine/CHM + an access-order deque with computeIfAbsent and CAS-based eviction; production answer names Caffeine (window-TinyLFU) and discusses sizing by live traffic, not guesswork.',
    rubric: [
      'LinkedHashMap with accessOrder + removeEldestEntry',
      'O(1) reasoning for both operations',
      'A credible thread-safe production alternative',
    ],
    explanation:
      'The interviewer checks you know the JDK gives you this for free — then whether you know its concurrency limits.',
    followUps: ['What eviction policy does Caffeine add beyond LRU and why?'],
  },
  {
    id: 'col-009',
    domain: 'Collections',
    level: 3,
    kind: 'mcq',
    prompt: 'ArrayList vs LinkedList: when is LinkedList actually the better choice?',
    options: [
      'Random access by index — LinkedList is O(1)',
      'Almost never in practice; ArrayList wins even for middle inserts in real hardware',
      'When elements are primitives',
      'When sorted iteration is needed',
    ],
    answerKey: 1,
    explanation:
      'LinkedList has O(n) traversal to the position and node allocation/cache misses per element; ArrayList\u2019s contiguous array and System.arraycopy shift is extremely fast. LinkedList is justified mainly for heavy head-removal queue usage — where ArrayDeque is still usually better.',
    followUps: ['Why is ArrayDeque preferred over java.util.Stack and LinkedList as a stack?'],
    trap: '"LinkedList for inserts" is the trap answer — the O(n) search to the insertion point kills it.',
  },
  {
    id: 'col-010',
    domain: 'Collections',
    level: 4,
    kind: 'mcq',
    prompt: 'What does CopyOnWriteArrayList guarantee, and at what cost?',
    options: [
      'Lock-free reads on a snapshot; every mutation copies the whole array — reads are cheap, writes expensive',
      'Cheap writes; reads lock the array',
      'Element-level locking',
      'Weakly consistent writes with no copying',
    ],
    answerKey: 0,
    explanation:
      'CoW copies the backing array on every write (volatile swap for lock-free reads). Ideal for listener lists: many reads, rare writes, iteration without CME. Wrong for high-write workloads.',
    followUps: ['Does its iterator reflect writes made after iterator creation? (No — snapshot)'],
  },
  {
    id: 'col-011',
    domain: 'Collections',
    level: 5,
    kind: 'debugging',
    prompt:
      'This cache is losing entries under concurrency — entries vanish even though nothing removes them. Diagnose and fix.',
    code: 'class Cache {\n  private final Map<String, byte[]> map = new HashMap<>();\n\n  byte[] computeIfMissing(String key, Supplier<byte[]> loader) {\n    if (map.containsKey(key)) return map.get(key);\n    byte[] value = loader.get();\n    map.put(key, value);\n    return value;\n  }\n}',
    modelAnswer:
      'Two bugs: (1) HashMap under concurrency can strand entries in wrong buckets after resizing — lost writes with no exception; (2) the check-then-act sequence loads and stores duplicates. Fix: ConcurrentHashMap with map.computeIfAbsent(key, k -> loader.get()) — one atomic operation, no duplicate loads, correct under resize. If loader is expensive/side-effecting, note CHM computes atomically per bin so the loader runs once per key; for async loading use a key → CompletableFuture<byte[]> map with completeOnTimeout.',
    rubric: [
      'Identifies both the race and the lost-update risk of HashMap',
      'Replaces with computeIfAbsent as a single atomic step',
      'Mentions the duplicate-load problem, not just correctness',
    ],
    explanation:
      'The "lost update" on HashMap is the insidious part — HashMap under concurrent writes silently loses entries rather than throwing.',
    followUps: ['How would you make the loader fire exactly once cluster-wide?'],
  },
  {
    id: 'col-012',
    domain: 'Collections',
    level: 2,
    kind: 'true_false',
    prompt: 'TreeSet iterates its elements in sorted order but offers O(log n) add/remove/contains.',
    options: ['True', 'False'],
    answerKey: 0,
    explanation:
      'TreeSet is backed by a red-black TreeMap: sorted iteration, O(log n) operations, and navigable methods (floor, ceiling, headSet).',
    followUps: ['When would you use EnumSet instead? (finite enum universe — bit-vector speed)'],
  },
]
