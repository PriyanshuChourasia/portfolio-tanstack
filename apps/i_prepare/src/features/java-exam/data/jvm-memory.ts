import type { JavaQuestionInput } from '../types'

/** JVM & Memory + Garbage Collection + Performance & Debugging domain bank. */
export const jvmMemoryQuestions: JavaQuestionInput[] = [
  {
    id: 'jvm-001',
    domain: 'JVM & Memory',
    level: 3,
    kind: 'mcq',
    prompt: 'Which runtime data areas are shared across threads, and which are per-thread?',
    options: [
      'Heap and method area (Metaspace) shared; stack, PC register and native method stack per-thread',
      'Everything is shared',
      'Heap per-thread; Metaspace shared',
      'Stack shared; heap per-thread',
    ],
    answerKey: 0,
    explanation:
      'Shared: heap (objects), method area/Metaspace (class metadata, since Java 8 native memory not heap). Per-thread: JVM stack (frames, locals), PC register, native method stack.',
    followUps: ['Where does a young-gen allocation pointer (TLAB) fit in this picture?'],
    trap: 'Metaspace is NOT on the heap since Java 8 — PermGen removal is a favourite probe.',
  },
  {
    id: 'jvm-002',
    domain: 'JVM & Memory',
    level: 3,
    kind: 'mcq',
    prompt: 'What are the phases of the class lifecycle?',
    options: [
      'Loading → Linking (verify, prepare, resolve) → Initialization',
      'Compile → Load → Run',
      'Loading → Initialization → Linking',
      'Verification → Loading → Compilation',
    ],
    answerKey: 0,
    explanation:
      'Loading (find bytecode, define Class), linking (verify structure, prepare statics with defaults, resolve symbolic refs), initialization (run <clinit> on first active use).',
    followUps: ['When exactly does initialization trigger? (new, static access, reflection — not Class.forName with initialize=false)'],
  },
  {
    id: 'jvm-003',
    domain: 'JVM & Memory',
    level: 4,
    kind: 'mcq',
    prompt: 'How does the parent-delegation model protect core classes?',
    options: [
      'Custom loaders load JDK classes first for speed',
      'A loader delegates up before loading; java.lang.String is loaded once by the bootstrap loader, preventing shadowing',
      'The security manager blocks custom loaders',
      'Classes are verified by checksum',
    ],
    answerKey: 1,
    explanation:
      'Application/platform loaders first delegate to their parent; only on failure do they attempt loading themselves. This guarantees core classes come from the most trusted loader and are loaded once.',
    followUps: ['How do application servers/OSGi deliberately break or layer delegation?'],
  },
  {
    id: 'jvm-004',
    domain: 'JVM & Memory',
    level: 4,
    kind: 'output_prediction',
    prompt: 'Two loaders load the same class file. What happens with instanceof?',
    code: '// Same MyClass.class loaded by LoaderA and LoaderB\nObject a = loaderA.load("MyClass");\nObject b = loaderB.load("MyClass");\nSystem.out.println(a.getClass() == b.getClass());',
    options: ['true', 'false — class identity includes the defining loader', 'Throws ClassCastException', 'Depends on JVM version'],
    answerKey: 1,
    explanation:
      'A class is identified by (defining loader, fully-qualified name). Two loaders loading identical bytecode produce distinct runtime classes — instanceof fails, casts throw. This is the basis of app-server/OSGi isolation.',
    followUps: ['How does this create ClassCastException in redeployment scenarios?'],
  },
  {
    id: 'jvm-005',
    domain: 'JVM & Memory',
    level: 3,
    kind: 'short_answer',
    prompt: 'StackOverflowError vs OutOfMemoryError — what runs out in each, and how do you diagnose which one you have?',
    modelAnswer:
      'StackOverflowError: a single thread\u2019s stack (default ~512KB–1MB) is exhausted — deep or unbounded recursion, or mutual recursion; diagnosis: the stack trace shows the repeating frames, -Xss controls size. OutOfMemoryError: the shared heap (or Metaspace, or native) is exhausted — too many live objects, leaks, or oversized caches; diagnosis: heap dump (-XX:+HeapDumpOnOutOfMemoryError) analysed for dominator trees, GC log trend (is heap recovering after full GC?). Quick discriminator: SOE names one thread and repeats frames; OOM messages name the space (Java heap space, Metaspace, unable to create native thread).',
    rubric: [
      'Per-thread stack vs shared heap distinction',
      'Typical causes of each',
      'Concrete diagnostic tooling for each',
    ],
    explanation:
      'The "unable to create native thread" variant (thread leak exhausting OS limits) is the follow-up that exposes depth.',
    followUps: ['Why can "unable to create new native thread" OOM happen with plenty of heap free?'],
  },
  {
    id: 'gc-001',
    domain: 'Garbage Collection',
    level: 3,
    kind: 'mcq',
    prompt: 'How does generational GC justify itself?',
    options: [
      'Most objects die young — collecting the young gen frequently and cheaply avoids scanning the whole heap',
      'It makes all pauses longer but rarer',
      'It eliminates the need for GC roots',
      'It compacts the heap on every allocation',
    ],
    answerKey: 0,
    explanation:
      'The weak generational hypothesis: allocation is cheap (TLAB bump) and most objects die young. Minor GCs scan only the young gen + remembered sets, giving short frequent pauses; survivors promote to old gen.',
    followUps: ['What is a remembered set / card table for?'],
  },
  {
    id: 'gc-002',
    domain: 'Garbage Collection',
    level: 4,
    kind: 'mcq',
    prompt: 'Which GC choice fits a large-heap latency-sensitive trading service (sub-ms pauses, 30GB+ heap)?',
    options: [
      'Serial GC',
      'Parallel GC',
      'ZGC or Shenandoah',
      'G1 with 8s max pause',
    ],
    answerKey: 2,
    explanation:
      'ZGC/Shenandoah do concurrent compaction with sub-millisecond pauses regardless of heap size. G1 targets ~200ms pauses; Parallel maximises throughput but stops everything; Serial is for tiny heaps.',
    followUps: ['What is the throughput cost of concurrent compaction? (read/write barriers, ~10-15%)'],
    trap: 'G1 was the "modern" answer in 2018 — knowing ZGC/Shenandoah trade-offs is the current senior bar.',
  },
  {
    id: 'gc-003',
    domain: 'Garbage Collection',
    level: 4,
    kind: 'short_answer',
    prompt: 'Walk through investigating high GC frequency in a production service: symptoms → data → root causes → fixes.',
    modelAnswer:
      'Symptoms: latency spikes correlated with GC logs, CPU burn on GC threads, allocation-rate alarms. Data: enable -Xlog:gc* (or JFR) — capture allocation rate (MB/s), pause times, heap-after-GC trend, Full GC count. Root causes by pattern: (1) heap-after-GC climbing after each young GC → live set growing → leak or undersized heap → heap dump dominator analysis; (2) high allocation rate with healthy GC → premature promotion or churning buffers (e.g. new byte[] per request) → reduce allocation (reuse, primitive streams, right-sizing); (3) Metaspace growth → classloader leak (dynamic proxies, Groovy/ reflelection) → class histogram; (4) humongous allocations in G1 → objects > half region size → tune region size or cache buffers. Fixes ordered by risk: tune -Xmn/-XX:MaxGCPauseMillis conservatively, fix allocation hotspots, then resize heap; validate with the same metrics over a full business cycle.',
    rubric: [
      'Structured symptom → metric → cause flow',
      'Distinguishes leak vs churn vs sizing problems by GC-log signature',
      'Concrete JVM flags/tools (Xlog:gc, JFR, heap dump)',
      'Fix validation loop',
    ],
    explanation:
      'This is the incident-response question — the structure of the answer matters as much as the facts.',
    followUps: ['Which JFR events would you enable for allocation profiling?'],
  },
  {
    id: 'gc-004',
    domain: 'Garbage Collection',
    level: 4,
    kind: 'multiple_select',
    prompt: 'Which references prevent their referent from being collected while the GC runs only a normal young/old collection (select all that apply)?',
    options: ['Strong reference (normal field)', 'SoftReference', 'WeakReference', 'PhantomReference'],
    answerKey: [0, 1],
    explanation:
      'Strong: never collected while reachable. Soft: cleared only before OOM (caches). Weak: collected at the next GC (WeakHashMap keys). Phantom: enqueued after collection for cleanup (Cleaner).',
    followUps: ['Why did ThreadLocal caches move from weak keys to using Cleaner/phantom reachability?'],
    trap: 'Soft vs weak semantics are swapped in most candidates\u2019 heads — soft survives until memory pressure, weak dies at next GC.',
  },
  {
    id: 'jvm-006',
    domain: 'JVM & Memory',
    level: 5,
    kind: 'short_answer',
    prompt: 'Explain JIT compilation: interpretation, hotspot detection, inlining, escape analysis and deoptimization — and how each affects a hot path.',
    modelAnswer:
      'The JVM starts interpreting bytecode (profile-building). Hot methods/loops cross invocation/back-edge thresholds and are compiled by C2 (or the layered C1 first — tiered compilation). Inlining: hot small methods are inlined into callers, unlocking further optimisations across method boundaries — this is why "small methods" advice exists (and why final/private is not required for speed). Escape analysis: if an object never escapes a method/thread, allocation can be scalar-replaced onto the stack or eliminated entirely (lock elision for non-escaping monitors). Speculative optimisation uses profiles (e.g. "this branch is always monomorphic"); when a new class loading invalidates the assumption, the compiled code is deoptimized and execution falls back to interpretation/recompilation — why megamorphic call sites (2+ receiver types) kill performance. Practical consequences: micro-benchmarks need warmup (JMH), -XX:+PrintCompilation/LogCompilation reveal deopts, and relying on un-compiled timing in tests is misleading.',
    rubric: [
      'Tiered compilation / hotspot thresholds',
      'Inlining as the gateway optimisation',
      'Escape analysis → scalar replacement + lock elision',
      'Deoptimization via megamorphic sites / class loading',
    ],
    explanation:
      'The JIT story separates people who read about the JVM from people who debug it.',
    followUps: ['Why does adding a new subtype to a monomorphic call site cause a deopt storm?'],
  },
  {
    id: 'perf-001',
    domain: 'Performance & Debugging',
    level: 4,
    kind: 'debugging',
    prompt:
      'Incident: a service\u2019s CPU is pegged at 100%, throughput collapsed, no errors. Walk your diagnosis end-to-end.',
    modelAnswer:
      '1) Scope: is it one instance or all? (deploy, config change, traffic shift). 2) Distinguish JVM vs OS CPU: top -H -p <pid> to find hot threads; JFR/async-profiler flame graph (wall vs CPU mode). 3) Classic signatures: (a) GC threads dominate → GC storm → GC logs → allocation spike or heap too small for current traffic; (b) one app thread spinning → regex catastrophic backtracking, unbounded loop, bad hashCode bucket storm → flame graph shows the method; (c) thousands of threads → context-switch overhead → thread dump count. 4) Fixes per signature: fix regex, add circuit breaker/queue bounds, resize heap, fix the hot method (caching, algorithm). 5) Prevention: JFR continuous recording, CPU alarms tied to GC metrics, load tests with flame-graph baselines. Never restart before capturing the thread dump — the evidence dies with the restart.',
    rubric: [
      'Capture evidence before remediation (thread dump / profiler)',
      'Distinguishes GC-driven vs app-thread vs thread-count CPU',
      'Names tooling: top -H, JFR, async-profiler flame graphs',
      'Prevention/monitoring loop',
    ],
    explanation:
      'Interviewers grade the discipline: restart-without-evidence is the instant-fail answer.',
    followUps: ['How do you safely take a heap dump from a pegged 30GB JVM without restarting?'],
  },
  {
    id: 'perf-002',
    domain: 'Performance & Debugging',
    level: 5,
    kind: 'debugging',
    prompt:
      'Incident: heap usage climbs monotonically for days then OOM. One full GC recovers only 10%. Diagnose.',
    code: '// GC log pattern:\n// [gc] Heap after GC: 8GB/24GB → day 2: 12GB → day 4: 19GB → day 6: 23GB → OOM',
    modelAnswer:
      'Classic leak: the live set grows without bound — full GC cannot reclaim what is still strongly reachable. Process: 1) take two heap dumps hours apart (or use -XX:+HeapDumpOnOutOfMemoryError); 2) dominator tree in MAT/JProfiler — find the biggest retained clusters; 3) usual suspects: static Map caches without eviction, unbounded listener registries, ThreadLocal not removed in pools, session/cart data keyed forever, classloader leaks (Metaspace would also climb); 4) confirm growth source via JFR OldObjectSample or jmap -histo deltas. Fixes: bound and evict caches (Caffeine with maximumSize/expiry), explicit deregistration (try/finally, Cleaner), fix ThreadLocal.remove in thread pools. Prevention: leak alarms on heap-after-full-GC trend, soak tests with JFR leak detection, Container-aware -XX:MaxRAMPercentage.',
    rubric: [
      'Reads the GC signature correctly (live set growth, not churn)',
      'Heap-dump dominator methodology with two snapshots',
      'Names the common leak sources with concrete fixes',
    ],
    explanation:
      'The 10%-recovered full GC is the tell: churn problems recover, leak problems do not.',
  },
  {
    id: 'perf-003',
    domain: 'Performance & Debugging',
    level: 4,
    kind: 'mcq',
    prompt: 'Why does -XX:+UseStringDeduplication exist, and when does it pay off?',
    options: [
      'It interns all strings automatically — always use it',
      'G1/ZGC option that deduplicates identical char arrays across String objects during GC — pays off with many duplicate long-lived strings',
      'A compile-time optimisation in javac',
      'It compresses strings to byte[] — default since Java 9',
    ],
    answerKey: 1,
    explanation:
      'Many workloads hold duplicates of the same value in long-lived data (JSON field names, countries). Deduplication swaps equal String backing arrays for one shared copy during GC — heap relief without code change. Costs some GC-phase CPU; useless if strings are mostly short-lived (already young-collected) or unique.',
    followUps: ['What did compact strings (Java 9, byte[] + LATIN1 flag) already save?'],
  },
]
