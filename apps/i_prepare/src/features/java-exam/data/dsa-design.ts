import type { JavaQuestionInput } from '../types'

/** Data Structures + System Design domain bank. */
export const dsaDesignQuestions: JavaQuestionInput[] = [
  /* ── Data Structures ────────────────────────────────────────────────────── */
  {
    id: 'dsa-001',
    domain: 'Data Structures',
    level: 3,
    kind: 'coding',
    prompt:
      'Sliding Window Maximum: given nums and window k, return the max of each window. Example [1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7]. Give the O(n) approach and complexity.',
    modelAnswer:
      'Monotonic deque of indices, decreasing values. For each i: drop indices outside the window from the front; while the last deque value < nums[i], pop from the back (they can never be a max again); add i; once i ≥ k-1 the front is the window max. O(n) time — each index enters/leaves the deque once; O(k) space. Java: ArrayDeque<Integer>; primitive alternative int[] deque with head/tail pointers avoids boxing. Edge cases: k == nums.length (single max), k == 1 (copy), duplicates (keep indices, not values).',
    rubric: [
      'Monotonic deque with indices',
      'O(n) amortised argument (each element handled once)',
      'Edge cases',
    ],
    explanation:
      'The brute force O(n·k) answer is the warm-up; the deque is the real test.',
    followUps: ['How does this extend to a streaming input? (keep the deque, emit on arrival)',
      'What if the window were min instead of max? (invert the comparison)'],
  },
  {
    id: 'dsa-002',
    domain: 'Data Structures',
    level: 4,
    kind: 'coding',
    prompt:
      'Design a thread-safe rate limiter allowing N requests/second per user (token bucket). Give the data structures and the distributed variant.',
    modelAnswer:
      'Single instance: per-user TokenBucket {double tokens; long lastRefillNanos} in ConcurrentHashMap<String, TokenBucket>; on request computeRefill = (now-last)*rate, tokens=min(capacity, tokens+refill); if tokens>=1 {tokens-=1; allow} else reject — the check-and-decrement must be atomic: synchronized per bucket, or AtomicLong with CAS retry, or LongAdder-style striping under contention. Distributed: Redis — Lua script making read-refill-decide-write atomic (single-threaded executor), or sliding-window via ZSET (ZREMRANGEBYSCORE + ZCARD) for exactness; note clock skew (use Redis TIME), memory bound via TTL on idle buckets. Production: bucket4j with a Redis/Hazelcast backend; discuss fairness and burst tolerance (capacity = burst size).',
    rubric: [
      'Token-bucket refill math',
      'Atomicity of the check-and-decrement',
      'Distributed variant with atomic execution (Lua) and clock caveat',
    ],
    explanation:
      'The single-node version is mid-level; the atomic distributed detail is the senior bar.',
    followUps: ['Token bucket vs leaky bucket — which allows bursts?',
      'How do you rate-limit globally when Redis goes down? (fail open vs closed — trade-offs)'],
  },
  {
    id: 'dsa-003',
    domain: 'Data Structures',
    level: 3,
    kind: 'coding',
    prompt:
      'Longest substring without repeating characters: "abcabcbb" → 3. Give the sliding-window solution and complexity.',
    modelAnswer:
      'Two pointers + last-index map: right scans, if s[r] seen at index ≥ left, jump left to lastIndex+1; record lastIndex; track max window. O(n) time, O(min(n, charset)) space. Edge cases: empty string, single char, all-same, all-unique, unicode (use code points, not chars).',
    rubric: [
      'Sliding window with last-index map',
      'The left-jump (not re-scan) invariant',
      'Complexity and unicode caveat',
    ],
    explanation:
      'The classic trap is shrinking left one-at-a-time with an expensive contains check — O(2n) is acceptable but the index-jump is the clean answer.',
  },
  {
    id: 'dsa-004',
    domain: 'Data Structures',
    level: 4,
    kind: 'coding',
    prompt:
      'Course Schedule: prerequisites [a,b] = b before a. Return a valid order or detect a cycle. Give both BFS and DFS approaches.',
    modelAnswer:
      'BFS (Kahn): build adjacency + in-degree counts; enqueue in-degree-0 nodes; pop, decrement neighbours, enqueue when zero; if processed < courses → cycle, else the pop order is valid. DFS: colour states WHITE/GRAY/BLACK; on reaching GRAY → back edge → cycle; append BLACK nodes in reverse finish order for topological order. Both O(V+E). Edge cases: no prerequisites (any order), self-loop (cycle), disconnected components (outer loop over all nodes).',
    rubric: [
      'Kahn\u2019s algorithm with in-degrees',
      'DFS three-colour cycle detection',
      'Cycle-reporting correctness in both',
    ],
    explanation:
      'Interviewers probe when to prefer which: Kahn gives the order directly and is iterative (no stack overflow on deep graphs).',
  },
  /* ── System Design ──────────────────────────────────────────────────────── */
  {
    id: 'sd-001',
    domain: 'System Design',
    level: 5,
    kind: 'system_design',
    prompt:
      'Design a GPS/IoT vehicle-tracking platform: devices send binary TCP packets (~1/sec, 100k devices). Cover ingestion, decoding, storage, real-time tracking, trip detection and backpressure.',
    modelAnswer:
      'Architecture: Device → TCP (Netty, epoll, one channel per device, heartbeat/idle detection) → Protocol decoder (binary → Position: IMEI as bytes/BCD, timestamps, lat/lon scaled ints, checksum validation; reject-and-log malformed frames) → Kafka producer keyed by device-IMEI (ordering per device) → consumers: (a) live tracker → Redis GEO (GEOADD per position, last-status TTL) driving WebSocket/polling APIs; (b) history writer → batch/copy into Postgres (partitioned by time, BRIN index) or TimescaleDB; (c) trip detector — stateful consumer: segment positions by ignition/movement with dwell/stop hysteresis, emits TripStarted/TripEnded events. Backpressure: Netty write-buffer watermarks + auto-read toggling, bounded Kafka producer buffer with full-buffer blocking, consumer batching; devices tolerate brief backpressure via store-and-forward. Scaling: partitions per device key for parallel decode-stage consumers; stateful trip detection via Kafka Streams with changelog topics (rebalance-safe state). Failure handling: idempotent position writes (device+timestamp natural key, ON CONFLICT DO NOTHING), duplicate-window dedup on device reconnects, DLQ for poison packets, per-stage lag monitoring. Capacity sketch: 100k msg/s ≈ 200 bytes → 20MB/s in — trivially one Kafka cluster; the hard parts are connection count (C1M tuning: file descriptors, TCP knobs, pinned NICs) and query-layer write amplification.',
    rubric: [
      'Binary protocol decode detail (IMEI/BCD/checksum) — not just "parse JSON"',
      'Kafka keying for per-device ordering',
      'Separate live vs historical paths with the right stores (Redis GEO, time-partitioned Postgres)',
      'Stateful trip detection + backpressure at the TCP layer',
      'Idempotency/dedup on reconnects',
    ],
    explanation:
      'This mirrors a real production GPS platform — interviewers look for TCP/Kafka/state-store fluency, not web-app patterns.',
    followUps: ['Why Kafka between decode and storage rather than direct writes? (buffering, replay, fan-out)',
      'How do you guarantee at-least-once without duplicate trips? (idempotent state transitions on deviceId+timestamp)'],
  },
  {
    id: 'sd-002',
    domain: 'System Design',
    level: 4,
    kind: 'system_design',
    prompt:
      'Design a URL shortener: ID generation, storage, cache, read/write ratio, expiry and analytics.',
    modelAnswer:
      'Requirements: create(shorten) writes ~1:100 vs redirect reads; 100M new URLs/year, redirects 10k/s peak; latency <50ms for redirects. ID: Base62 of a per-range auto-increment (ranges leased from a coordinator — simple, ordered) or Snowflake IDs (no coordination, sortable); collision-free by construction; 62^7 covers 3.5T. Storage: Postgres/MySQL (short_code PK, long_url, created_at, expires_at) sharded by code hash when needed; unique constraint handles retries. Read path: Redis cache of hot codes (80/20), CDN for the hottest, 301/302 (302 for analytics/expiry semantics); cache-miss → DB → backfill. Expiry: lazy check on read + background sweeper. Analytics: emit click events to Kafka → rollups (count by code/day/country) in ClickHouse/dragon, never synchronously on the redirect path. Trade-offs: auto-increment ranges guessable → encrypt/offset if privacy matters; redirect = 302 vs 301 (caching kills analytics).',
    rubric: [
      'Explicit read/write ratio and latency target',
      'ID generation with collision reasoning',
      'Cache + DB read path with expiry handling',
      'Async analytics off the hot path',
    ],
    explanation:
      'The 301-vs-302 analytics trade-off is the classic follow-up — redirect caching silently breaks click tracking.',
  },
  {
    id: 'sd-003',
    domain: 'System Design',
    level: 4,
    kind: 'system_design',
    prompt:
      'Design a notification service: email/SMS/push channels, retries, dedup, rate limits and delivery tracking.',
    modelAnswer:
      'Flow: producer → Kafka topic (key=userId for per-user ordering) → notification-service consumers → per-channel adapters (SES/SendGrid, Twilio/SMSC, FCM/APNs). Pipeline stages: validate + enrich (template render, locale, timezone), preference/check (user opt-outs — hard mute vs per-channel), dedup (Redis SETNX dedupKey=eventId+channel with TTL — survives at-least-once redelivery), rate limit (token bucket per user per channel — SMS especially; per-provider QPS caps), send with per-provider client timeouts + circuit breaker, record attempt. Retries: exponential backoff, max 5, jitter; retryable (timeout, 5xx) vs non-retryable (invalid phone, hard bounce) — non-retryable go straight to a DLQ with an alerting hook. Delivery tracking: provider webhooks → status-events topic → updates notification-status store (PENDING→SENT→DELIVERED→BOUNCED); user-facing inbox reads that store. Guarantees: at-least-once with idempotent sends (provider idempotency keys where available); exactly-once display via the dedup layer. Scaling: partitions by user, consumers scale to partition count; burst control via consumer-side batching to providers.',
    rubric: [
      'Kafka-ordered flow with per-channel adapters',
      'Dedup + idempotency against redelivery',
      'Retryable vs non-retryable classification with DLQ',
      'Status tracking via provider webhooks',
    ],
    explanation:
      'The dedup-before-send step is what stops "user got 3 identical SMS" incidents — the failure mode every real notification system hits.',
  },
  {
    id: 'sd-004',
    domain: 'System Design',
    level: 5,
    kind: 'system_design',
    prompt:
      'Design a distributed job scheduler: millions of jobs/day, exact-ish timing, retries, no duplicates, multi-instance.',
    modelAnswer:
      'Storage: jobs table (id, run_at, payload, status, attempts, locked_by, locked_at) in Postgres with index on (status, run_at). Scheduling: poller instances run SELECT … WHERE status=\u0027pending\u0027 AND run_at <= now() ORDER BY run_at LIMIT k FOR UPDATE SKIP LOCKED — SKIP LOCKED gives multi-instance mutual exclusion without a central scheduler; mark running with locked_at lease. Execution: submit to a bounded worker pool; on completion mark done; on failure increment attempts, exponential backoff next_run_at, park to dead-letter status after max attempts. Exact-ish timing: polling interval trades latency vs DB load — for tighter SLAs add a delay-queue layer (Kafka with per-delay topics or a timing-wheel in-memory for sub-second, reloaded from DB on restart). No duplicates: idempotency key on job submit (unique constraint), lease expiry (locked_at < now - lease → requeue) with idempotent execution (job handler checks effect key). Observability: queue-depth age (oldest pending), success rate, dead-letter count; alert on oldest-job age. Trade-offs discussed: DB-per-poll load vs dedicated queue (SQS delayed messages has 15-min cap; Kafka has no native delay), cron-style vs one-shot jobs, and what happens on instance crash mid-job (lease expiry requeue — handlers must be idempotent).',
    rubric: [
      'FOR UPDATE SKIP LOCKED for multi-instance claiming',
      'Lease/heartbeat + crash recovery',
      'Idempotency end-to-end (submit and execute)',
      'Backoff + dead-lettering',
    ],
    explanation:
      'SKIP LOCKED is the modern senior answer (vs sharding locks or ZooKeeper) — the lease-expiry-plus-idempotent-handler pairing is what makes it correct.',
    followUps: ['How would you migrate to Kafka if the DB poller becomes the bottleneck? (outbox → delay topics)',
      'How do you prevent thundering herds of lease-expired retries? (jitter, attempt caps)'],
  },
  {
    id: 'sd-005',
    domain: 'System Design',
    level: 4,
    kind: 'architecture',
    prompt:
      'A monolith\u2019s checkout flow calls 6 services synchronously; p99 is 4s and one slow service degrades everything. Restructure it.',
    modelAnswer:
      'Diagnose first: trace (OpenTelemetry) to find which of the 6 contribute latency and which are actually required before the response. Classify: (a) response-critical (inventory reserve, payment) — keep synchronous, with timeouts + circuit breakers + hedged calls where safe; (b) eventual (emails, analytics, loyalty, recommendations) — move out of the request path: publish OrderPlaced to Kafka (via outbox), consumers handle side effects asynchronously. Result: checkout p99 becomes max of 2 critical calls (~300ms); downstream failures degrade features, not checkout. Guardrails: consumer idempotency, DLQ + replay tooling, SLO per flow (checkout availability vs email lag are different SLOs), bulkheads so consumer slowness cannot starve serving threads. Anti-patterns to avoid: replacing sync chains with sync chains plus retries (amplifies), or eventual consistency where the user needs the answer now (stock display) — prefer soft reservations with expiry there.',
    rubric: [
      'Tracing/classification before restructuring',
      'Outbox + async side effects for non-critical work',
      'Resilience only where calls stay synchronous',
      'Consistency trade-off reasoning per step',
    ],
    explanation:
      'The staff-level insight is the classification step — not every dependency deserves the same treatment.',
  },
]
