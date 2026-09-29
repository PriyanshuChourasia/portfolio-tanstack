import type { JavaQuestionInput } from '../types'

/** Backend domain bank: Spring, Spring Data JPA, REST & Security, Kafka, Microservices, Docker & Kubernetes, Testing, JDBC & SQL, I/O & Networking. */
export const backendQuestions: JavaQuestionInput[] = [
  /* ── Spring ─────────────────────────────────────────────────────────────── */
  {
    id: 'spr-001',
    domain: 'Spring',
    level: 3,
    kind: 'mcq',
    prompt: 'What is the default singleton bean scope\u2019s hidden requirement?',
    options: [
      'Singleton beans must be immutable',
      'Singleton beans must be stateless or thread-safe — they are shared across all requests',
      'Singleton beans are created per request',
      'Singleton beans cannot use @Autowired',
    ],
    answerKey: 1,
    explanation:
      'One instance per container, shared by every concurrent request — mutable request state in a singleton field is a race condition. Prototype scope creates per lookup; request/session scopes are web-bound.',
    followUps: ['How do you inject a prototype into a singleton correctly? (ObjectProvider / scoped proxy)'],
    trap: 'Injecting a prototype into a singleton silently gives you a singleton — the classic scope trap.',
  },
  {
    id: 'spr-002',
    domain: 'Spring',
    level: 4,
    kind: 'mcq',
    prompt: 'Why does calling @Transactional methodB() from methodA() in the same class not start a transaction?',
    options: [
      'Spring transactions are ASYNC-only',
      'Self-invocation bypasses the proxy — the annotation is enforced by the proxy, not the class',
      'methodB must be public and the class final',
      'The transaction manager caches invocations',
    ],
    answerKey: 1,
    explanation:
      'Spring AOP uses proxies (JDK interface or CGLIB subclass). this.methodB() skips the proxy entirely, so the interceptor never runs. Fixes: self-injection, AopContext.currentProxy(), or moving the method to another bean.',
    followUps: ['What else does the proxy skip? (@Cacheable, @Async, @PreAuthorize — same root cause)',
      'What does AspectJ weaving offer here? (bytecode weaving, no proxy bypass)'],
    trap: 'Same root cause bites @Async and @Cacheable — knowing the proxy model explains them all.',
  },
  {
    id: 'spr-003',
    domain: 'Spring',
    level: 3,
    kind: 'mcq',
    prompt: 'How does Spring Boot auto-configuration decide what to configure?',
    options: [
      'Scans all jars for classes',
      'Conditional annotations (@ConditionalOnClass/@ConditionalOnMissingBean) evaluated against the classpath and existing beans',
      'A mandatory config file per dependency',
      'Runtime reflection over controllers',
    ],
    answerKey: 1,
    explanation:
      'Auto-configuration classes listed in AutoConfiguration.imports are gated by @Conditional* annotations: H2 on the classpath + no DataSource bean → configure an embedded one. Your own beans win (@ConditionalOnMissingBean) — convention with an escape hatch.',
    followUps: ['How do you debug which auto-configs matched? (--debug condition evaluation report)'],
  },
  {
    id: 'spr-004',
    domain: 'Spring',
    level: 4,
    kind: 'short_answer',
    prompt: 'Explain AOP as Spring uses it: proxy types, what join points are supported, and where AOP silently fails.',
    modelAnswer:
      'Spring AOP is proxy-based method interception: JDK dynamic proxies (interface-based) or CGLIB subclass proxies. Join points are method executions only — no field access or constructor advice. Silent failures: self-invocation (this.method() bypasses the advice), final methods/classes (CGLIB cannot subclass/override), private methods (not visible to the proxy), and static methods (no instance dispatch). These are exactly the failure modes of @Transactional/@Async/@Cacheable. For cross-cutting concerns needing field/constructor join points or non-Spring objects, AspectJ load-time weaving is the heavier alternative. Production guidance: keep aspects narrow (logging, metrics, security) and note that behaviour depends on how the bean is obtained, not just declared.',
    rubric: [
      'Proxy mechanism (JDK vs CGLIB) and method-only join points',
      'All four silent-failure modes',
      'AspectJ contrast',
    ],
    explanation:
      'AOP questions are proxy-model questions in disguise — the silent failures are the assessment.',
  },
  /* ── Spring Data JPA ────────────────────────────────────────────────────── */
  {
    id: 'jpa-001',
    domain: 'Spring Data JPA',
    level: 4,
    kind: 'mcq',
    prompt: 'Lazy loading works in unit tests but throws LazyInitializationException in production. Why?',
    options: [
      'The entity is serialised to JSON outside the persistence context — the session that would fetch it is closed',
      'The database lacks indexes',
      'Lazy loading is test-only',
      'The transaction is too long',
    ],
    answerKey: 0,
    explanation:
      'A lazy association is a proxy backed by the persistence context. Once the session/transaction ends (controller layer, @Transactional boundary), initialising it fails. Fixes: fetch joins / entity graphs sized to the use case, DTO projection queries, or @Transactional(readOnly) service boundaries that keep the view materialisation inside.',
    followUps: ['Why is Open Session in View considered an anti-pattern? (hides the boundary, holds connections)'],
  },
  {
    id: 'jpa-002',
    domain: 'Spring Data JPA',
    level: 4,
    kind: 'short_answer',
    prompt: 'The N+1 problem: what is it, how do you detect it, and what are three fixes with trade-offs?',
    modelAnswer:
      'Loading N parent entities then touching a lazy association issues one query per parent — 1 + N queries. Detect: enable hibernate statistics / datasource-proxy / p6spy logs; look for repeating identical selects per row in one request; test with 100 parents and count statements. Fixes: (1) JOIN FETCH / @EntityGraph — one query, but cartesian-product risk with multiple collection joins (use pagination on parents, not joins); (2) Batch fetching (hibernate.default_batch_fetch_size=16) — IN-lists of 16, usually the best default; (3) DTO projections for read paths — fetch exactly the columns, no persistence context, no proxies. Anti-fix: global eager fetch — it makes every query heavier and spreads the cost everywhere. Optimistic locking note: dirty checking at flush means long sessions re-snapshot everything; keep transactions short.',
    rubric: [
      'Correct 1+N definition',
      'Detection mechanism (SQL log/counting)',
      'Three fixes with the cartesian-product caveat',
    ],
    explanation:
      'The batch-fetch-size answer distinguishes production experience from theory — most people know only JOIN FETCH.',
  },
  {
    id: 'jpa-003',
    domain: 'Spring Data JPA',
    level: 4,
    kind: 'mcq',
    prompt: 'Two concurrent transactions read stock=1, both decrement and save — one update is lost. Which mechanism prevents this?',
    options: [
      'First-level cache',
      'Optimistic locking with @Version — the second commit fails with OptimisticLockException',
      'Dirty checking',
      'Read-only transactions',
    ],
    answerKey: 1,
    explanation:
      '@Version columns make updates conditional on the version read (WHERE version=?); a concurrent update affects 0 rows → OptimisticLockException → retry or 409. Pessimistic (SELECT FOR UPDATE) blocks instead — right for high-contention short critical sections.',
    followUps: ['How do you retry OptimisticLockException safely? (reload, reapply, bounded retries)'],
  },
  /* ── REST & Security ────────────────────────────────────────────────────── */
  {
    id: 'rst-001',
    domain: 'REST & Security',
    level: 3,
    kind: 'multiple_select',
    prompt: 'Which properties make a REST endpoint idempotent-safe to retry (select all that apply)?',
    options: ['GET /orders/42', 'PUT /orders/42 (full replace)', 'POST /orders (creates)', 'DELETE /orders/42'],
    answerKey: [0, 1, 3],
    explanation:
      'Idempotency = same request repeated has the same effect. GET/PUT/DELETE are idempotent by spec; POST is not — payments/creation flows need an idempotency key (client-supplied unique key deduplicated server-side) to be retry-safe.',
    followUps: ['Design the idempotency-key storage: key → response with TTL, atomic insert'],
    trap: 'PUT is idempotent but not safe (mutates) — GET is both.',
  },
  {
    id: 'rst-002',
    domain: 'REST & Security',
    level: 4,
    kind: 'short_answer',
    prompt: 'Design the security for a public REST API: authN, authZ, token lifecycle, and the OWASP basics you harden by default.',
    modelAnswer:
      'AuthN: OAuth2/OIDC with short-lived JWT access tokens (10–15m) + refresh rotation; validate signature, issuer, audience and expiry at the gateway or resource server (spring-boot-starter-oauth2-resource-server), never decode without verification. AuthZ: centralised method/URL security (SecurityFilterChain + @PreAuthorize with roles/scopes), deny by default; object-level checks (owner == principal) are where IDOR vulnerabilities live. Hardening defaults: BCrypt/Argon2 for any passwords (never SHA), CSRF protection for cookie-authenticated browsers (stateless bearer APIs can disable with justification), strict CORS allow-lists, rate limiting (bucket4j/gateway), input validation (@Valid + allow-lists), security headers, no secrets in logs, TLS everywhere. JWT trade-off: stateless scale vs revocation — keep access tokens short, maintain a revocation list only when required, rotate refresh tokens with reuse detection.',
    rubric: [
      'Token validation details (signature/iss/aud/exp)',
      'Separation of authN vs authZ with object-level check',
      'Concrete hardening list',
      'JWT revocation trade-off',
    ],
    explanation:
      'Depth signals: refresh-rotation reuse detection and IDOR — not just "use JWT".',
  },
  /* ── Kafka ──────────────────────────────────────────────────────────────── */
  {
    id: 'kaf-001',
    domain: 'Kafka',
    level: 4,
    kind: 'mcq',
    prompt: 'A consumer crashes AFTER processing but BEFORE committing the offset. What happens, and what guarantees does that give?',
    options: [
      'The message is lost — at-most-once',
      'The message is redelivered → at-least-once; processing must be idempotent',
      'The message is processed exactly once automatically',
      'The consumer group fails permanently',
    ],
    answerKey: 1,
    explanation:
      'Offsets commit after work; a crash replays uncommitted messages → duplicates are normal. Exactly-once requires idempotent effects (dedup keys) or Kafka transactions (read-process-write within one transactional consumer-producer).',
    followUps: ['Design dedup: (topic, key, eventId) unique constraint or Redis SETNX with TTL'],
    trap: 'There is no free exactly-once — anyone claiming otherwise has not operated Kafka.',
  },
  {
    id: 'kaf-002',
    domain: 'Kafka',
    level: 4,
    kind: 'mcq',
    prompt: 'Topic with 12 partitions, consumer group of 4 → then scaled to 8 consumers. What happens?',
    options: [
      '8 consumers each get 1.5 partitions',
      '4 consumers get 2 each; 4 sit idle — partitions are the parallelism unit',
      'All 8 share every partition',
      'Kafka auto-splits partitions',
    ],
    answerKey: 1,
    explanation:
      'Assignment is per-partition: 12/4 = 3 each originally; with 8, four consumers get 2 and four idle. More consumers than partitions buys nothing — increase partitions (carefully: keys remap, ordering changes) or rebalance work inside the consumer.',
    followUps: ['Why is adding partitions to an existing keyed topic risky? (same key may land on a new partition, breaking ordering)'],
  },
  {
    id: 'kaf-003',
    domain: 'Kafka',
    level: 5,
    kind: 'debugging',
    prompt:
      'Consumer lag grows for hours, the consumer is alive, no errors. Walk the diagnosis.',
    modelAnswer:
      '1) Quantify: lag per partition (kafka-consumer-groups --describe) — one partition or all? 2) One hot partition → key skew (one tenant key dominating) → repartition with composite keys or isolate that tenant. 3) All partitions slow → capacity: max.poll.records/poll interval vs processing time — if processing exceeds max.poll.interval.ms the consumer is evicted → rebalance storm → lag compounds (check rebalance logs); processing time per record vs arrival rate defines required parallelism = arrival/processing; scale consumers up to partition count. 4) Slow downstream (DB writes) → batch, parallelise inside the consumer with care for ordering, or add partitions. 5) Paused/flux states: check for repeated group rebalances (membership timeouts, k8s liveness kills mid-poll → session.timeout/heartbeat tuning). 6) Long-run fix: DLQ for poison messages, autoscaling on lag metric, end-to-end lag SLO with alerting before customer impact.',
    rubric: [
      'Per-partition vs global lag triage (skew vs capacity)',
      'max.poll.interval.ms eviction/rebalance storm awareness',
      'Concrete capacity math (arrival rate ÷ processing rate)',
      'Operational fixes (DLQ, autoscaling, SLOs)',
    ],
    explanation:
      'Lag is the Kafka incident — the rebalance-storm interaction with slow processing is the senior detail.',
  },
  /* ── Microservices ──────────────────────────────────────────────────────── */
  {
    id: 'mic-001',
    domain: 'Microservices',
    level: 5,
    kind: 'mcq',
    prompt: 'Order service (Postgres) → Payment service (own DB) must stay consistent. What is the standard pattern?',
    options: [
      'Two-phase commit across both databases',
      'Saga with compensating transactions + Outbox pattern for reliable event publishing',
      'Shared database for both services',
      'Distributed locks on order rows',
    ],
    answerKey: 1,
    explanation:
      'Cross-service 2PC kills availability and couples services; shared DB couples schemas. A saga sequences local transactions with compensating actions for rollback; the Outbox pattern (write event to an outbox table in the same local transaction, relay to Kafka via CDC/poller) solves the dual-write problem reliably.',
    followUps: ['Order a payment-refund saga: who holds the state machine?',
      'What goes wrong with a naive "commit then publish to Kafka"? (dual write)'],
    trap: 'The dual-write problem (DB commit succeeds, publish fails) is the detail that separates book knowledge from production scars.',
  },
  {
    id: 'mic-002',
    domain: 'Microservices',
    level: 4,
    kind: 'multiple_select',
    prompt: 'Which resilience patterns prevent cascading failure when a downstream service degrades (select all)?',
    options: ['Circuit breaker', 'Timeout + retry with exponential backoff and jitter', 'Bulkhead (isolated pools)', 'Synchronous retry loop without limit'],
    answerKey: [0, 1, 2],
    explanation:
      'Breaker stops calling a failing dependency; bounded timeouts + jittered retries handle transient blips without thundering herds; bulkheads isolate resource pools so one dependency\u2019s collapse cannot exhaust all threads. Unbounded retry loops amplify outages — the anti-pattern.',
    followUps: ['Where does the circuit state live in a multi-instance service? (per-instance is usually fine; discuss)',
      'What does retry amplification do to a struggling dependency?'],
  },
  /* ── Docker & Kubernetes ────────────────────────────────────────────────── */
  {
    id: 'dk8-001',
    domain: 'Docker & Kubernetes',
    level: 4,
    kind: 'mcq',
    prompt: 'A JVM pod gets 2GB memory limit but is OOMKilled with heap set to 2GB. Why?',
    options: [
      'Kubernetes rounding error',
      'Heap ≠ total JVM footprint — metaspace, thread stacks, code cache, GC structures and native memory live outside heap; total RSS must fit the limit',
      'The app leaks memory in PostgreSQL',
      'JVM ignores memory limits',
    ],
    answerKey: 1,
    explanation:
      'Container limits constrain RSS. Total = heap + metaspace + code cache + thread stacks (×threads) + GC overhead + direct buffers. Set -XX:MaxRAMPercentage≈60–75% of the limit (or explicit -Xmx with headroom) and watch for thread-count-driven native growth.',
    followUps: ['How does UseContainerSupport/MaxRAMPercentage compute defaults?',
      'Why do 500 platform threads OOM a pod with modest heap? (1MB stacks each)'],
  },
  {
    id: 'dk8-002',
    domain: 'Docker & Kubernetes',
    level: 4,
    kind: 'mcq',
    prompt: 'Liveness vs readiness for a Spring Boot service: which setup is correct?',
    options: [
      'Liveness fails when a downstream DB is slow; readiness on startup',
      'Readiness fails when the app cannot serve traffic (DB down, warming up); liveness only when the process is truly stuck/restarting is the cure',
      'Both should check all dependencies',
      'Neither is needed with Actuator',
    ],
    answerKey: 1,
    explanation:
      'Restarting (liveness) does not fix a dead DB — it causes restart loops. Liveness should be near-stateless (thread deadlock detection at most); readiness gates traffic on dependency health/warmup. Use Actuator\u2019s /health with grouped indicators on separate endpoints.',
    followUps: ['What happens during a rolling deploy if readiness is wrong? (traffic to unready pods or mass restarts)'],
    trap: 'Putting DB checks on liveness is the classic self-inflicted outage.',
  },
  /* ── JDBC & SQL ─────────────────────────────────────────────────────────── */
  {
    id: 'sql-001',
    domain: 'JDBC & SQL',
    level: 3,
    kind: 'mcq',
    prompt: 'Why must SQL parameters be bound (PreparedStatement) rather than concatenated?',
    options: [
      'Only for performance',
      'SQL injection prevention plus plan caching; values never re-parse as SQL syntax',
      'PreparedStatements are the only way to run transactions',
      'Required for connection pooling',
    ],
    answerKey: 1,
    explanation:
      'Binding sends values as data — \u0027 OR 1=1 -- cannot escape into the statement text. Same-shape statements also reuse the DB plan cache. Identifiers (table/column names) and ORDER BY directions cannot be bound — validate/allow-list those.',
    followUps: ['How do you safely parameterise ORDER BY? (allow-list mapping, never bind)'],
  },
  {
    id: 'sql-002',
    domain: 'JDBC & SQL',
    level: 4,
    kind: 'short_answer',
    prompt: 'Read Committed vs Repeatable Read vs Serializable — anomalies prevented, and what you pick for an order-processing service.',
    modelAnswer:
      'Read Committed: no dirty reads; non-repeatable reads and phantoms possible — the sane default with explicit locking where needed. Repeatable Read: snapshot for the transaction — repeated reads consistent, phantoms still possible in most engines (Postgres RR actually snapshot-isolates and guards phantoms for reads but write-skew remains). Serializable: full serial semantics — detects/aborts serialization failures; must retry. For orders: Read Committed + explicit row locks (SELECT … FOR UPDATE on stock rows) or optimistic @Version on aggregates; money movements stay in short transactions; retry serialization failures only when actually using Serializable. Isolation is per-requirement, not global — raising it globally trades concurrency for guarantees most code paths never need.',
    rubric: [
      'Anomaly → level mapping (dirty, non-repeatable, phantom)',
      'Concrete choice with justification for an order flow',
      'Retry semantics for serialization failures',
    ],
    explanation:
      'The exam answer is the mapping table plus the judgement that isolation is chosen per use case.',
    followUps: ['What is write skew and which level permits it? (snapshot isolation / Postgres RR)'],
  },
  /* ── I/O & Networking ───────────────────────────────────────────────────── */
  {
    id: 'io-001',
    domain: 'I/O & Networking',
    level: 3,
    kind: 'mcq',
    prompt: 'Your HTTP client defaults to no connect timeout. What happens under a network partition?',
    options: [
      'Fails fast with IOException',
      'Calls can hang for minutes on OS-level TCP retries — threads pile up until the pool exhausts',
      'The JVM aborts the connection after 1s',
      'Nothing, HTTP handles it',
    ],
    answerKey: 1,
    explanation:
      'Without connectTimeout/requestTimeout a black-holed peer blocks the calling thread indefinitely; every retry adds a stuck thread → pool exhaustion → full outage. Always set connect, request and (pooled) idle timeouts; Java\u2019s HttpClient: HttpClient.connectTimeout + HttpRequest.timeout, plus pool bounds (keep-alive, max connections).',
    followUps: ['Why is a retry without timeout worse than no retry? (multiplies stuck threads)'],
  },
  /* ── Testing ────────────────────────────────────────────────────────────── */
  {
    id: 'tst-001',
    domain: 'Testing',
    level: 3,
    kind: 'mcq',
    prompt: 'When is Testcontainers the right choice over mocks for integration tests?',
    options: [
      'Always — never mock anything',
      'When the real dependency\u2019s behaviour matters: SQL semantics, migrations, Kafka consumer loops, Redis commands — mocks drift from reality',
      'Only for UI tests',
      'When the team dislikes Mockito',
    ],
    answerKey: 1,
    explanation:
      'Testcontainers runs the real engine (Postgres, Kafka, Redis) in Docker — tests catch dialect/migration/serialisation issues mocks cannot. Cost: slower; keep the pyramid — unit tests mock, a thin slice of high-value integration tests use containers, CI caches images.',
    followUps: ['How do you keep container-based suites fast? (singleton containers, reuse, test ordering by state)'],
  },
  {
    id: 'tst-002',
    domain: 'Testing',
    level: 4,
    kind: 'short_answer',
    prompt: 'Your service tests mock the repository layer, yet production keeps failing on data-shaped bugs. Redesign the test strategy.',
    modelAnswer:
      'Mocking repositories asserts your assumptions about the data layer, not its behaviour — every query bug, migration drift and mapping error passes green. Redesign: (1) unit tests keep mocks for pure logic only; (2) repository/DAO tests on Testcontainers-Postgres run real SQL incl. migrations (Flyway) — flushes out dialect and constraint issues; (3) a slim service-integration layer wires the real repository with test data builders, not mocks; (4) contract tests (Spring Cloud Contract/Pact) pin the API for consumers; (5) golden-path E2E only for the 3–4 revenue flows. Add data-shaped fixtures with property-based tests for mappers. Expected outcome: mocks stop at the boundary where behaviour is genuinely delegated, data-layer regressions are caught in CI, and the suite stays under ~10 minutes by keeping E2E minimal.',
    rubric: [
      'Names the core failure: mocks encode assumptions',
      'Layered strategy with real-DB repository tests',
      'Keeps E2E minimal; contract testing mentioned',
    ],
    explanation:
      'This is the "tests pass but prod fails" story — the answer is moving the mock boundary down, not more tests.',
  },
]
