import type { JavaQuestionInput } from '../types'

/** Multithreading + Concurrency Utilities + Virtual Threads + CompletableFuture domain bank. */
export const concurrencyQuestions: JavaQuestionInput[] = [
  {
    id: 'thr-001',
    domain: 'Multithreading',
    level: 3,
    kind: 'mcq',
    prompt: 'Why does volatile int count; not make count++ atomic?',
    options: [
      'volatile only guarantees visibility, not atomicity of read-modify-write',
      'volatile is slower so the increment is skipped',
      'volatile makes count++ atomic but unordered',
      'It does — volatile int is always safe',
    ],
    answerKey: 0,
    explanation:
      'count++ is three steps (read, add, write). volatile establishes happens-before and prevents caching/reordering, but two threads can still interleave the read and write — losing updates. Use AtomicInteger.incrementAndGet (CAS) or a lock.',
    followUps: ['Show where exactly the lost update happens with two threads.'],
    trap: 'The single most common concurrency misconception — visibility ≠ atomicity.',
  },
  {
    id: 'thr-002',
    domain: 'Multithreading',
    level: 3,
    kind: 'mcq',
    prompt: 'What are the four conditions for deadlock?',
    options: [
      'Mutual exclusion, hold-and-wait, no preemption, circular wait',
      'Racing, blocking, caching, reordering',
      'Visibility, atomicity, ordering, fairness',
      'Two threads, one lock, a queue, a timer',
    ],
    answerKey: 0,
    explanation:
      'All four must hold simultaneously; breaking any one prevents deadlock — consistent lock ordering (breaks circular wait) is the standard prevention.',
    followUps: ['How does tryLock with timeout break hold-and-wait?'],
  },
  {
    id: 'thr-003',
    domain: 'Multithreading',
    level: 4,
    kind: 'debugging',
    prompt:
      'This transfer method deadlocks in production. Identify the deadlock condition and fix it.',
    code: 'class Account {\n  private final long id;\n  private long balance;\n  synchronized void debit(long amt) { balance -= amt; }\n  synchronized void credit(long amt) { balance += amt; }\n}\n\nvoid transfer(Account from, Account to, long amt) {\n  synchronized (from) { synchronized (to) { from.debit(amt); to.credit(amt); } }\n}',
    modelAnswer:
      'T1 transfers A→B (locks A then B); T2 transfers B→A (locks B then A) — circular wait on inconsistent lock ordering. Fixes: (1) order locks by a global key (e.g. Long.compare(from.id, to.id)) so acquisition order is consistent; (2) tryLock with timeout and back-off, releasing on failure (breaks hold-and-wait); (3) better: route all transfers through a single serialized actor/queue or a DB transaction with SELECT … FOR UPDATE ordered by id — removing in-memory locks entirely. Detection: jstack / ThreadMXBean.findDeadlockedThreads report the monitor cycle.',
    rubric: [
      'Names the inconsistent lock ordering → circular wait',
      'At least one correct fix (ordering or tryLock)',
      'Mentions detection (jstack/ThreadMXBean)',
    ],
    explanation:
      'The account-transfer deadlock is the canonical senior concurrency screen.',
    followUps: ['Why does lock ordering by object hashCode() fail? (hash codes collide / change per run)'],
  },
  {
    id: 'thr-004',
    domain: 'Multithreading',
    level: 3,
    kind: 'multiple_select',
    prompt: 'Which statements about the Java Memory Model are true (select all)?',
    options: [
      'A write by T1 is visible to T2\u2019s subsequent read after T2 acquires the same lock T1 released',
      'A volatile write happens-before every subsequent volatile read of that variable',
      'final field values are safely visible after construction without synchronisation',
      'Program order guarantees cross-thread visibility of writes',
    ],
    answerKey: [0, 1, 2],
    explanation:
      'Unlock happens-before subsequent lock of the same monitor; volatile write happens-before subsequent reads; final fields freeze safely at construction (safe publication of immutable objects). Program order alone says nothing across threads.',
    followUps: ['Why is unsafe publication of a mutable object with final fields still fine, but with non-final fields not?'],
    trap: 'final-field safe publication is the one candidates always forget.',
  },
  {
    id: 'thr-005',
    domain: 'Multithreading',
    level: 4,
    kind: 'short_answer',
    prompt: 'synchronized vs ReentrantLock vs AtomicInteger vs LongAdder — pick the right tool for four different workloads and justify.',
    modelAnswer:
      'synchronized: simple mutual exclusion, uncontended cost is near-zero after biased/thin locks and JIT optimisation — default choice for straightforward critical sections. ReentrantLock: when you need tryLock/timeout, interruptible acquisition, fairness, or multiple Conditions (bounded-buffer with distinct not-full/not-empty signals). AtomicInteger: lock-free single-variable counters/CAS state machines — beats locks when the operation maps to one CAS (incrementAndGet) and contention is moderate. LongAdder: hot write-heavy counters where even CAS contention hurts — it stripes cells across CPUs and only sums on read; wrong when you need the exact current value every operation (then AtomicLong). Rule of thumb: clarity first (synchronized), escalate only with a measured contention problem.',
    rubric: [
      'Correct primary use case for each of the four',
      'LongAdder exact-read trade-off',
      'Measure-first escalation reasoning',
    ],
    explanation:
      'The four-way comparison is a senior staple — the LongAdder read-accuracy caveat is the differentiator.',
  },
  {
    id: 'thr-006',
    domain: 'Multithreading',
    level: 4,
    kind: 'mcq',
    prompt: 'You must run 100,000 short I/O-bound tasks. Best choice?',
    options: [
      'A fixed pool of 100,000 platform threads',
      'A fixed pool of 200 platform threads',
      'Virtual threads (one per task)',
      'One shared ForkJoinPool with 200 threads',
    ],
    answerKey: 2,
    explanation:
      '100k platform threads ≈ 100GB stack reservation; 200 threads serialise I/O waits. Virtual threads are JVM-managed, park on blocking I/O (unmounting the carrier), cost ~KBs — designed exactly for massive concurrent blocking work. CPU-bound work still wants a pool sized to cores.',
    followUps: ['When do virtual threads NOT help? (CPU-bound, pinning on synchronized+I/O, native calls)'],
  },
  {
    id: 'vt-001',
    domain: 'Virtual Threads',
    level: 4,
    kind: 'mcq',
    prompt: 'What is "pinning" a virtual thread, and why does it matter?',
    options: [
      'Affinity-pinning a thread to a CPU core',
      'The virtual thread cannot unmount from its carrier — notably inside synchronized blocks doing blocking I/O or native frames — holding the platform thread hostage',
      'A GC root pinning objects',
      'A scheduler priority',
    ],
    answerKey: 1,
    explanation:
      'When a virtual thread blocks inside a synchronized region (pre-Java 24) or native call, it stays mounted on its carrier — if pinning is widespread, carriers exhaust and throughput collapses back to platform-thread behaviour. Fix hotspots: ReentrantLock instead of synchronized around I/O, or upgrade (JEP 491 resolved synchronized pinning in Java 24).',
    followUps: ['Which JDK flag/technique detects pinning? (-Djdk.tracePinnedThreads, JFR VirtualThreadPinned event)'],
    trap: '"Virtual threads make synchronized dangerous around I/O" is the practical interview landmine.',
  },
  {
    id: 'vt-002',
    domain: 'Virtual Threads',
    level: 5,
    kind: 'short_answer',
    prompt: 'Your team adopted virtual threads and latency got worse. Diagnose the likely causes.',
    modelAnswer:
      'Typical causes: (1) pinning — synchronized blocks wrapping HTTP/DB calls pin carriers (check -Djdk.tracePinnedThreads / JFR pinned events); (2) CPU-bound tasks scheduled on virtual threads — they never park, so they monopolise carriers and starve genuinely-I/O tasks (CPU work belongs in a fixed platform pool); (3) unbounded creation — millions of concurrent virtual threads flooding a downstream database with 100k simultaneous connections (no connection-pool throttling) — virtual threads remove the cost of threads, not the need for backpressure; use Semaphores/limited pools as bulkheads; (4) ThreadLocal-heavy libraries — each virtual thread allocates its own copy, memory balloons; (5) keeping the thread-per-request model with heavy per-request state instead of adopting structured concurrency scopes. Fix ordering: measure pinning, add bulkheads, move CPU work off virtual threads.',
    rubric: [
      'Pinning as the first suspect with detection mechanism',
      'Backpressure point — thread cost ≠ resource cost',
      'CPU-bound vs I/O-bound placement',
    ],
    explanation:
      'The reverse-failure story is the staff-level probe — knowing when the new tool makes things worse.',
  },
  {
    id: 'cf-001',
    domain: 'CompletableFuture',
    level: 3,
    kind: 'mcq',
    prompt: 'Three parallel calls, each ~200ms, joined with CompletableFuture.allOf — total wall time vs sequential?',
    options: ['~200ms vs ~600ms', '~600ms vs ~200ms', '~200ms vs ~200ms', '~800ms vs ~600ms'],
    answerKey: 0,
    explanation:
      'Concurrent fan-out waits for the slowest (~200ms); sequential sums (~600ms). Error handling: exceptionally/handle per stage or allOf().exceptionally — and always supply a dedicated executor for blocking calls, never the default ForkJoinPool.commonPool.',
    followUps: ['What happens if one future fails before the others finish? (allOf completes exceptionally only after all complete — anyOf or dedicated handling for fail-fast)'],
  },
  {
    id: 'cf-002',
    domain: 'CompletableFuture',
    level: 4,
    kind: 'mcq',
    prompt: 'thenApply vs thenCompose vs thenCombine?',
    options: [
      'thenApply transforms value→value; thenCompose flattens value→CompletionStage; thenCombine merges two independent stages',
      'thenCompose transforms value→value; thenApply flattens',
      'thenCombine chains sequentially',
      'All three are aliases',
    ],
    answerKey: 0,
    explanation:
      'thenApply is map; thenCompose is flatMap (avoiding CompletableFuture<CompletableFuture<T>>); thenCombine joins two independent futures with a merge function.',
    followUps: ['thenApply vs thenApplyAsync — where does the continuation run?'],
  },
  {
    id: 'cf-003',
    domain: 'CompletableFuture',
    level: 5,
    kind: 'coding',
    prompt:
      'Fan out to 3 remote services with per-call timeouts, aggregate results, fall back per service on failure, and never block the common pool. Sketch the code.',
    modelAnswer:
      'ExecutorService io = Executors.newVirtualThreadPerTaskExecutor();\nCompletableFuture<Price> a = CompletableFuture.supplyAsync(() -> callA(), io)\n    .orTimeout(200, MILLISECONDS).exceptionally(e -> Price.fallbackA());\n// same for b, c\nCompletableFuture<Quote> quote = a.thenCombine(b, Quote::merge).thenCombine(c, Quote::merge);\nKey points: dedicated executor (virtual per task) so the common pool stays free; orTimeout per call; exceptionally/handle for per-service fallbacks rather than failing the whole aggregate; thenCombine composes independent results; for fail-fast use anyOf with a first-success semantic; completeOnTimeout for partial defaults. Mention cancellation is cooperative (orTimeout cancels the stage but not the underlying call — the connection still needs its own timeout).',
    rubric: [
      'Dedicated executor, not commonPool',
      'Per-call timeout + fallback',
      'Correct composition (thenCombine) and aggregate error strategy',
      'Awareness that cancelling the stage ≠ cancelling the I/O',
    ],
    explanation:
      'This is the everyday production shape of CompletableFuture — the cancellation nuance is what seniors know.',
  },
  {
    id: 'cu-001',
    domain: 'Concurrency Utilities',
    level: 4,
    kind: 'mcq',
    prompt: 'CountDownLatch vs CyclicBarrier vs Semaphore — which fits "limit concurrent DB access to 50 across a 200-thread service"?',
    options: [
      'CountDownLatch(50)',
      'CyclicBarrier(50)',
      'Semaphore(50)',
      'ReadWriteLock',
    ],
    answerKey: 2,
    explanation:
      'Semaphore(50) gates concurrent permits, released on completion. Latch is a one-shot gate (await until count hits zero); barrier synchronises parties at a phase point; neither bounds ongoing concurrency.',
    followUps: ['Which fits "wait for 3 warmup tasks before serving traffic"? (latch)',
      'Which fits "pause until all 4 phases complete per batch"? (barrier)'],
  },
  {
    id: 'cu-002',
    domain: 'Concurrency Utilities',
    level: 4,
    kind: 'coding',
    prompt:
      'Implement a bounded producer-consumer pipeline where producers block when full and consumers block when empty. Cover graceful shutdown.',
    modelAnswer:
      'BlockingQueue<Job> queue = new ArrayBlockingQueue<>(1000);\n// producer: queue.put(job) — blocks when full\n// consumer: Job j = queue.take() — blocks when empty\nShutdown: poison-pill pattern — producer(s) put a sentinel after finishing; consumers take() until they receive the pill then exit; main thread awaitTermination with timeout after shutdown(). Alternative: queue.poll(timeout) loops checking a volatile running flag; or ExecutorService.shutdown() + awaitTermination for task-shaped work. Mention: bounded capacity is the backpressure; unbounded LinkedBlockingQueue hides overload until OOM; Go analogue is a buffered channel + context cancellation.',
    rubric: [
      'put/take blocking semantics for backpressure',
      'A correct shutdown protocol (poison pill or poll+flag)',
      'Notes why the queue must be bounded',
    ],
    explanation:
      'The shutdown half is where most candidates stumble — graceful termination is the real test.',
    followUps: ['How does java.util.concurrent.Flow (reactive streams) formalise this with demand signalling?'],
  },
  {
    id: 'thr-007',
    domain: 'Multithreading',
    level: 5,
    kind: 'debugging',
    prompt:
      'A thread pool with 50 threads and an unbounded LinkedBlockingQueue accepts 10k tasks; throughput collapses and memory climbs. Diagnose and redesign.',
    code: 'new ThreadPoolExecutor(50, 50, 0, MILLISECONDS, new LinkedBlockingQueue<>());',
    modelAnswer:
      'Two interacting problems: (1) unbounded queue — tasks accumulate faster than 50 threads drain them; latency grows without limit, heap fills with queued tasks, and rejection never triggers so there is no backpressure signal to callers; (2) possibly the wrong pool shape — if tasks block on I/O, 50 threads may be too few; if CPU-bound, more threads than cores adds overhead. Redesign: bound the queue (e.g. 1–2k), set a RejectedExecutionHandler with intent — CallerRunsPolicy applies backpressure to producers, AbortPolicy + retry/queue-outside gives explicit overload handling; add metrics on queue depth; for I/O-heavy workloads prefer virtual threads per task (no pool sizing at all) with a semaphore bulkhead on the downstream resource. Never leave the queue unbounded in production.',
    rubric: [
      'Unbounded queue = no backpressure identified',
      'Rejection policy chosen deliberately',
      'Pool sizing tied to task type (CPU vs I/O)',
    ],
    explanation:
      'The default Executors.newFixedThreadPool hides this landmine — knowing why it is dangerous is the point.',
  },
]
