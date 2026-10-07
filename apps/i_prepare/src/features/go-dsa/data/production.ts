import type { Problem } from '../types'

/** PRODUCTION MODE — real backend components in idiomatic Go. */
export const PRODUCTION_PROBLEMS: Problem[] = [
  {
    id: 'prod-01',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Token-bucket rate limiter',
    story: 'A public API must allow each API key 100 requests per second with bursts up to 200, across 50k active keys.',
    prompt: 'Implement `Limiter` with `Allow(key string) bool`. Tokens refill continuously at `rate` per second up to `burst`. Must be safe for concurrent use and must not leak memory for idle keys.',
    requirements: [
      'O(1) per Allow',
      'Lazy refill computed from elapsed time (no per-key goroutine)',
      'Injectable clock for tests',
      'Idle buckets evicted (e.g. a janitor removing buckets unused for 10 minutes)',
    ],
    code: `type Limiter struct {
	// TODO
}

func NewLimiter(rate, burst float64, now func() time.Time) *Limiter

func (l *Limiter) Allow(key string) bool`,
    hints: [
      'Per key store {tokens float64, last time.Time}. On Allow: tokens = min(burst, tokens + elapsed·rate).',
      'Protect the map with a mutex; for high contention shard by hash(key).',
      'Janitor: a ticker goroutine stopped via a Close() method or context.',
    ],
    solution: `type bucket struct {
	tokens float64
	last   time.Time
}

type Limiter struct {
	mu      sync.Mutex
	rate    float64
	burst   float64
	now     func() time.Time
	buckets map[string]*bucket
}

func NewLimiter(rate, burst float64, now func() time.Time) *Limiter {
	if now == nil {
		now = time.Now
	}
	return &Limiter{rate: rate, burst: burst, now: now, buckets: map[string]*bucket{}}
}

func (l *Limiter) Allow(key string) bool {
	now := l.now()
	l.mu.Lock()
	defer l.mu.Unlock()
	b, ok := l.buckets[key]
	if !ok {
		b = &bucket{tokens: l.burst, last: now}
		l.buckets[key] = b
	}
	elapsed := now.Sub(b.last).Seconds()
	b.tokens = min(l.burst, b.tokens+elapsed*l.rate)
	b.last = now
	if b.tokens < 1 {
		return false
	}
	b.tokens--
	return true
}

// Run evicts idle buckets until ctx is cancelled.
func (l *Limiter) Run(ctx context.Context, idle time.Duration) {
	t := time.NewTicker(idle)
	defer t.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-t.C:
			cutoff := l.now().Add(-idle)
			l.mu.Lock()
			for k, b := range l.buckets {
				if b.last.Before(cutoff) {
					delete(l.buckets, k)
				}
			}
			l.mu.Unlock()
		}
	}
}`,
    explanation: 'Lazy refill avoids timers per key. An evicted bucket is recreated full, which is exactly the state a long-idle bucket would have reached. golang.org/x/time/rate provides a production version of one bucket.',
    complexity: { time: 'O(1) Allow; O(keys) per janitor sweep', space: 'O(active keys)' },
    variation: 'Make it distributed across 10 API servers using Redis (atomic Lua script) — what consistency do you lose?',
    followUps: ['Sliding-window log vs token bucket trade-offs?', 'How do you shard the mutex?', 'What HTTP status and headers should rejected requests get? (429, Retry-After)'],
  },
  {
    id: 'prod-02',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Worker pool with graceful shutdown',
    story: 'An image-processing service consumes jobs from a queue with N workers and must drain cleanly on SIGTERM.',
    prompt: 'Implement `Pool` with `NewPool(workers int, handler func(context.Context, Job) error)`, `Submit(ctx, Job) error` (blocks when the queue is full, respects ctx), and `Shutdown(ctx) error` that stops accepting, lets in-flight jobs finish, and returns ctx.Err() if the deadline passes.',
    requirements: ['Bounded queue', 'No goroutine leaks', 'Submit after Shutdown returns ErrClosed', 'Handler panics do not kill workers'],
    hints: [
      'jobs channel with capacity; a closed flag guarded by a mutex (or a quit channel) — never send on a closed channel.',
      'Shutdown: mark closed, close(jobs), wait for a WaitGroup in a goroutine, select on done vs ctx.Done().',
    ],
    solution: `var ErrClosed = errors.New("pool closed")

type Job struct{ ID string }

type Pool struct {
	jobs    chan Job
	wg      sync.WaitGroup
	mu      sync.RWMutex
	closed  bool
	handler func(context.Context, Job) error
	ctx     context.Context
	cancel  context.CancelFunc
}

func NewPool(workers, queue int, handler func(context.Context, Job) error) *Pool {
	ctx, cancel := context.WithCancel(context.Background())
	p := &Pool{jobs: make(chan Job, queue), handler: handler, ctx: ctx, cancel: cancel}
	for i := 0; i < workers; i++ {
		p.wg.Add(1)
		go p.worker()
	}
	return p
}

func (p *Pool) worker() {
	defer p.wg.Done()
	for job := range p.jobs {
		func() {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("job %s panicked: %v", job.ID, r)
				}
			}()
			if err := p.handler(p.ctx, job); err != nil {
				log.Printf("job %s: %v", job.ID, err)
			}
		}()
	}
}

func (p *Pool) Submit(ctx context.Context, job Job) error {
	p.mu.RLock()
	defer p.mu.RUnlock()
	if p.closed {
		return ErrClosed
	}
	select {
	case p.jobs <- job:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (p *Pool) Shutdown(ctx context.Context) error {
	p.mu.Lock()
	if !p.closed {
		p.closed = true
		close(p.jobs)
	}
	p.mu.Unlock()

	done := make(chan struct{})
	go func() { p.wg.Wait(); close(done) }()
	select {
	case <-done:
		p.cancel()
		return nil
	case <-ctx.Done():
		p.cancel() // ask in-flight handlers to abort
		return ctx.Err()
	}
}`,
    explanation: 'The RWMutex makes "check closed + send" atomic with respect to close(jobs), so Submit can never send on a closed channel. Workers drain the remaining queue before exiting. The pool context lets Shutdown signal handlers to abort when the deadline passes.',
    complexity: { time: 'O(1) per Submit', space: 'O(queue + workers)' },
    variation: 'Add per-job retries with exponential backoff and a dead-letter queue.',
    followUps: ['Why can Submit holding RLock while blocked on a full queue delay Shutdown? How would you fix it?', 'How would you expose queue depth and worker utilisation metrics?'],
  },
  {
    id: 'prod-03',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Generic, thread-safe LRU cache with TTL',
    story: 'A product-catalogue service caches 100k product documents with a 5-minute TTL.',
    prompt: 'Implement `Cache[K comparable, V any]` with Get/Set/Delete/Len, capacity-bounded LRU eviction and per-entry TTL, safe for concurrent use. Use container/list.',
    requirements: ['O(1) operations', 'Expired entries never returned', 'Injectable clock', 'Optional OnEvict callback (called outside the lock)'],
    hints: ['map[K]*list.Element + list of *entry{key, val, expires}.', 'Collect evicted entries under the lock, invoke callbacks after unlocking.'],
    solution: `type entry[K comparable, V any] struct {
	key     K
	val     V
	expires time.Time
}

type Cache[K comparable, V any] struct {
	mu      sync.Mutex
	cap     int
	ttl     time.Duration
	ll      *list.List
	items   map[K]*list.Element
	now     func() time.Time
	OnEvict func(K, V)
}

func New[K comparable, V any](capacity int, ttl time.Duration) *Cache[K, V] {
	return &Cache[K, V]{cap: capacity, ttl: ttl, ll: list.New(), items: map[K]*list.Element{}, now: time.Now}
}

func (c *Cache[K, V]) Get(k K) (V, bool) {
	c.mu.Lock()
	el, ok := c.items[k]
	if !ok {
		c.mu.Unlock()
		var zero V
		return zero, false
	}
	e := el.Value.(*entry[K, V])
	if c.now().After(e.expires) {
		c.removeElement(el)
		c.mu.Unlock()
		c.notify([]*entry[K, V]{e})
		var zero V
		return zero, false
	}
	c.ll.MoveToFront(el)
	c.mu.Unlock()
	return e.val, true
}

func (c *Cache[K, V]) Set(k K, v V) {
	var evicted []*entry[K, V]
	c.mu.Lock()
	if el, ok := c.items[k]; ok {
		e := el.Value.(*entry[K, V])
		e.val, e.expires = v, c.now().Add(c.ttl)
		c.ll.MoveToFront(el)
	} else {
		c.items[k] = c.ll.PushFront(&entry[K, V]{k, v, c.now().Add(c.ttl)})
		for c.ll.Len() > c.cap {
			back := c.ll.Back()
			evicted = append(evicted, back.Value.(*entry[K, V]))
			c.removeElement(back)
		}
	}
	c.mu.Unlock()
	c.notify(evicted)
}

func (c *Cache[K, V]) Delete(k K) {
	c.mu.Lock()
	if el, ok := c.items[k]; ok {
		c.removeElement(el)
	}
	c.mu.Unlock()
}

func (c *Cache[K, V]) Len() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.ll.Len()
}

func (c *Cache[K, V]) removeElement(el *list.Element) {
	c.ll.Remove(el)
	delete(c.items, el.Value.(*entry[K, V]).key)
}

func (c *Cache[K, V]) notify(es []*entry[K, V]) {
	if c.OnEvict == nil {
		return
	}
	for _, e := range es {
		c.OnEvict(e.key, e.val)
	}
}`,
    explanation: 'Even Get mutates (MoveToFront), so a plain Mutex is required — an RWMutex would not help. Calling user callbacks outside the lock prevents deadlocks if the callback touches the cache.',
    complexity: { time: 'O(1) all ops', space: 'O(capacity)' },
    variation: 'Shard into 16 caches by hash(key) to cut contention; benchmark with b.RunParallel.',
  },
  {
    id: 'prod-04',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Delayed job scheduler',
    story: 'A notification service schedules reminders ("send at 09:00 tomorrow"); jobs can be cancelled before they fire.',
    prompt: 'Implement `Scheduler` with `Schedule(at time.Time, fn func()) (id int)`, `Cancel(id int) bool`, and `Run(ctx)` that executes due jobs. Use a min-heap by time and a single timer that is reset to the earliest job.',
    requirements: ['O(log n) schedule/cancel', 'No busy waiting', 'Jobs run in their own goroutine so a slow job does not delay others', 'Wake up early when a new earlier job arrives'],
    hints: ['A wake channel (buffered, size 1) signals Run that the head changed.', 'Cancel by marking cancelled in a map (lazy deletion) or with heap.Remove using stored indexes.'],
    solution: `type job struct {
	id    int
	at    time.Time
	fn    func()
	index int
}

type jobHeap []*job

func (h jobHeap) Len() int            { return len(h) }
func (h jobHeap) Less(i, j int) bool  { return h[i].at.Before(h[j].at) }
func (h jobHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i]; h[i].index = i; h[j].index = j }
func (h *jobHeap) Push(x any)         { j := x.(*job); j.index = len(*h); *h = append(*h, j) }
func (h *jobHeap) Pop() any           { o := *h; j := o[len(o)-1]; *h = o[:len(o)-1]; j.index = -1; return j }

type Scheduler struct {
	mu     sync.Mutex
	h      jobHeap
	byID   map[int]*job
	nextID int
	wake   chan struct{}
}

func NewScheduler() *Scheduler {
	return &Scheduler{byID: map[int]*job{}, wake: make(chan struct{}, 1)}
}

func (s *Scheduler) poke() {
	select {
	case s.wake <- struct{}{}:
	default:
	}
}

func (s *Scheduler) Schedule(at time.Time, fn func()) int {
	s.mu.Lock()
	s.nextID++
	j := &job{id: s.nextID, at: at, fn: fn}
	heap.Push(&s.h, j)
	s.byID[j.id] = j
	s.mu.Unlock()
	s.poke()
	return j.id
}

func (s *Scheduler) Cancel(id int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	j, ok := s.byID[id]
	if !ok || j.index < 0 {
		return false
	}
	heap.Remove(&s.h, j.index)
	delete(s.byID, id)
	return true
}

func (s *Scheduler) Run(ctx context.Context) {
	timer := time.NewTimer(time.Hour)
	defer timer.Stop()
	for {
		s.mu.Lock()
		now := time.Now()
		for s.h.Len() > 0 && !s.h[0].at.After(now) {
			j := heap.Pop(&s.h).(*job)
			delete(s.byID, j.id)
			go j.fn()
		}
		wait := time.Hour
		if s.h.Len() > 0 {
			wait = s.h[0].at.Sub(now)
		}
		s.mu.Unlock()
		timer.Reset(wait)
		select {
		case <-ctx.Done():
			return
		case <-timer.C:
		case <-s.wake:
		}
	}
}`,
    explanation: 'Stored heap indexes make Cancel O(log n) via heap.Remove. The wake channel (size 1, non-blocking send) coalesces many Schedule calls into one re-evaluation. Since Go 1.23, Timer.Reset on an unstopped timer is safe (no stale value is delivered).',
    complexity: { time: 'O(log n) Schedule/Cancel/dispatch', space: 'O(n)' },
    variation: 'Persist jobs so they survive restarts; make execution at-least-once with idempotency keys.',
  },
  {
    id: 'prod-05',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Concurrent log processor',
    story: 'A security team needs failed-login counts per IP from 200 GB of gzip logs per day.',
    prompt: 'Design and implement `Process(ctx, files []string, workers int) (map[string]int, error)` as a pipeline: file readers → line parsers (fan-out) → per-worker local maps → merge. Stop everything on the first error.',
    requirements: ['Constant memory per worker (streaming)', 'errgroup with context', 'No shared map mutation across goroutines'],
    hints: ['Each parser worker keeps its own map[string]int and sends it on a results channel at the end — no locks in the hot path.', 'gzip.NewReader + bufio.Scanner per file.'],
    solution: `func Process(ctx context.Context, files []string, workers int) (map[string]int, error) {
	g, ctx := errgroup.WithContext(ctx)
	lines := make(chan string, 1024)
	partials := make(chan map[string]int, workers)

	g.Go(func() error {
		defer close(lines)
		for _, path := range files {
			if err := readGz(ctx, path, lines); err != nil {
				return fmt.Errorf("%s: %w", path, err)
			}
		}
		return nil
	})

	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		g.Go(func() error {
			defer wg.Done()
			local := map[string]int{}
			for line := range lines {
				if ip, ok := failedLoginIP(line); ok {
					local[ip]++
				}
			}
			partials <- local
			return nil
		})
	}
	go func() { wg.Wait(); close(partials) }()

	total := map[string]int{}
	for m := range partials {
		for ip, n := range m {
			total[ip] += n
		}
	}
	if err := g.Wait(); err != nil {
		return nil, err
	}
	return total, nil
}

func readGz(ctx context.Context, path string, out chan<- string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	zr, err := gzip.NewReader(f)
	if err != nil {
		return err
	}
	defer zr.Close()
	sc := bufio.NewScanner(zr)
	sc.Buffer(make([]byte, 64<<10), 1<<20)
	for sc.Scan() {
		select {
		case out <- sc.Text():
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return sc.Err()
}

func failedLoginIP(line string) (string, bool) {
	if !strings.Contains(line, "Failed password") {
		return "", false
	}
	_, rest, ok := strings.Cut(line, " from ")
	if !ok {
		return "", false
	}
	ip, _, _ := strings.Cut(rest, " ")
	return ip, true
}`,
    explanation: 'Local maps per worker remove lock contention; merging N small maps at the end is cheap. On a reader error, ctx is cancelled, the reader stops, lines closes, workers finish, and g.Wait returns the error.',
    complexity: { time: 'O(total lines)', space: 'O(workers × distinct IPs)' },
    variation: 'Read files in parallel too (one reader goroutine per file, bounded), and emit the top 100 IPs with a heap.',
  },
  {
    id: 'prod-06',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'URL shortener service',
    story: 'Marketing needs short links (sho.rt/aZ3k9) with click counts.',
    prompt: 'Implement an HTTP service: `POST /links {"url": "…"}` → `{"code": "…"}`; `GET /{code}` → 302 redirect and increments clicks; `GET /links/{code}/stats`. Codes are base62 of an atomic counter. Validate URLs. Store in an interface-backed repo with an in-memory implementation.',
    requirements: ['Go 1.22 ServeMux patterns', 'Repo interface + MemRepo', 'URL validation with net/url', 'Atomic click counting', 'httptest-based tests'],
    hints: ['base62: repeatedly divmod by 62 into "0-9a-zA-Z".', 'Clicks as atomic.Int64 inside the stored record pointer.'],
    solution: `const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func base62(n uint64) string {
	if n == 0 {
		return "0"
	}
	var b []byte
	for n > 0 {
		b = append(b, alphabet[n%62])
		n /= 62
	}
	slices.Reverse(b)
	return string(b)
}

type Link struct {
	URL    string
	Clicks atomic.Int64
}

type Repo interface {
	Save(code string, l *Link)
	Get(code string) (*Link, bool)
}

type MemRepo struct {
	mu    sync.RWMutex
	links map[string]*Link
}

func (m *MemRepo) Save(code string, l *Link) { m.mu.Lock(); m.links[code] = l; m.mu.Unlock() }
func (m *MemRepo) Get(code string) (*Link, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	l, ok := m.links[code]
	return l, ok
}

type Server struct {
	repo Repo
	seq  atomic.Uint64
}

func (s *Server) Routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /links", s.create)
	mux.HandleFunc("GET /links/{code}/stats", s.stats)
	mux.HandleFunc("GET /{code}", s.redirect)
	return mux
}

func (s *Server) create(w http.ResponseWriter, r *http.Request) {
	var req struct{ URL string \`json:"url"\` }
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&req); err != nil {
		http.Error(w, "bad json", http.StatusBadRequest)
		return
	}
	u, err := url.ParseRequestURI(req.URL)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}
	code := base62(s.seq.Add(1) + 100_000) // skip very short codes
	s.repo.Save(code, &Link{URL: u.String()})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"code": code})
}

func (s *Server) redirect(w http.ResponseWriter, r *http.Request) {
	l, ok := s.repo.Get(r.PathValue("code"))
	if !ok {
		http.NotFound(w, r)
		return
	}
	l.Clicks.Add(1)
	http.Redirect(w, r, l.URL, http.StatusFound)
}

func (s *Server) stats(w http.ResponseWriter, r *http.Request) {
	l, ok := s.repo.Get(r.PathValue("code"))
	if !ok {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"url": l.URL, "clicks": l.Clicks.Load()})
}`,
    explanation: 'Sequential IDs encoded in base62 are collision-free and short. The more specific pattern "GET /links/{code}/stats" wins over "GET /{code}" in Go 1.22 routing precedence. Atomic counters avoid locking on the hot redirect path.',
    complexity: { time: 'O(1) per request', space: 'O(links)' },
    variation: 'Sequential codes are guessable — how do you make them unguessable but still collision-free across many instances? (Feistel/format-preserving permutation, or random + uniqueness check.)',
  },
  {
    id: 'prod-07',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Metrics aggregator (sliding-window percentiles)',
    story: 'An APM agent receives millions of latency samples per minute and must report count, avg, p50, p95, p99 over the last 60 seconds.',
    prompt: 'Implement `Aggregator.Observe(d time.Duration)` and `Snapshot() Stats` with bounded memory using per-second buckets of fixed latency histograms (e.g. exponential buckets), rotating every second.',
    requirements: ['Observe is O(1) and lock-light', 'Memory independent of sample count', 'Percentiles approximated from histogram buckets', 'Explain the accuracy trade-off'],
    hints: ['60 ring slots × N histogram buckets of atomic counters.', 'Bucket index = floor(log2(micros)) capped to N−1.'],
    solution: `const slots, buckets = 60, 32

type secondSlot struct {
	sec    atomic.Int64
	counts [buckets]atomic.Int64
	sum    atomic.Int64
}

type Aggregator struct {
	ring [slots]secondSlot
	now  func() time.Time
}

func bucketOf(d time.Duration) int {
	us := d.Microseconds()
	if us < 1 {
		return 0
	}
	return min(buckets-1, bits.Len64(uint64(us)))
}

func (a *Aggregator) Observe(d time.Duration) {
	sec := a.now().Unix()
	s := &a.ring[sec%slots]
	if old := s.sec.Load(); old != sec && s.sec.CompareAndSwap(old, sec) {
		for i := range s.counts {
			s.counts[i].Store(0)
		}
		s.sum.Store(0)
	}
	s.counts[bucketOf(d)].Add(1)
	s.sum.Add(int64(d))
}

type Stats struct {
	Count         int64
	Avg           time.Duration
	P50, P95, P99 time.Duration
}

func (a *Aggregator) Snapshot() Stats {
	now := a.now().Unix()
	var hist [buckets]int64
	var count, sum int64
	for i := range a.ring {
		s := &a.ring[i]
		if now-s.sec.Load() >= slots {
			continue
		}
		for b := range hist {
			n := s.counts[b].Load()
			hist[b] += n
			count += n
		}
		sum += s.sum.Load()
	}
	if count == 0 {
		return Stats{}
	}
	pct := func(p float64) time.Duration {
		target := int64(math.Ceil(p * float64(count)))
		var seen int64
		for b, n := range hist {
			seen += n
			if seen >= target {
				return time.Duration(1<<b) * time.Microsecond // bucket upper bound
			}
		}
		return 0
	}
	return Stats{Count: count, Avg: time.Duration(sum / count), P50: pct(0.50), P95: pct(0.95), P99: pct(0.99)}
}`,
    explanation: 'Fixed histograms give O(1) memory and lock-free updates; percentiles are accurate to within one bucket (here a factor of 2). A small race at second rollover (a sample counted before the reset) is accepted for speed — document it. Production systems use HDR histograms or DDSketch for tighter relative error.',
    complexity: { time: 'Observe O(1); Snapshot O(60 × 32)', space: 'O(60 × 32) counters' },
    variation: 'Replace power-of-two buckets with log-linear buckets (e.g. 8 sub-buckets per power) for ~12% max error.',
  },
  {
    id: 'prod-08',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'In-memory key-value store with TCP protocol',
    story: 'Build a tiny Redis-like server for internal feature flags: SET, GET, DEL, EXPIRE over a line protocol.',
    prompt: 'Implement a TCP server on :6380 accepting commands `SET k v`, `GET k`, `DEL k`, `EXPIRE k seconds`, `KEYS prefix`. Replies: `OK`, value, `(nil)`, integer counts, or `ERR msg`. Store with a sharded map; expired keys are removed lazily and by a periodic sweeper.',
    requirements: ['Goroutine per connection with read deadlines', '16-way sharded store (hash/fnv)', 'Lazy + active expiry', 'Graceful shutdown closes the listener and waits for connections'],
    hints: ['Shard index = fnv32(key) % 16; each shard has its own RWMutex and map[string]item{val, exp}.', 'strings.Fields to parse commands; reply with fmt.Fprintln.'],
    solution: `type item struct {
	val string
	exp time.Time // zero = no expiry
}

type shard struct {
	mu sync.RWMutex
	m  map[string]item
}

type Store struct{ shards [16]*shard }

func NewStore() *Store {
	s := &Store{}
	for i := range s.shards {
		s.shards[i] = &shard{m: map[string]item{}}
	}
	return s
}

func (s *Store) shard(k string) *shard {
	h := fnv.New32a()
	h.Write([]byte(k))
	return s.shards[h.Sum32()%16]
}

func (s *Store) Set(k, v string) {
	sh := s.shard(k)
	sh.mu.Lock()
	sh.m[k] = item{val: v}
	sh.mu.Unlock()
}

func (s *Store) Get(k string) (string, bool) {
	sh := s.shard(k)
	sh.mu.RLock()
	it, ok := sh.m[k]
	sh.mu.RUnlock()
	if !ok || (!it.exp.IsZero() && time.Now().After(it.exp)) {
		return "", false
	}
	return it.val, true
}

func (s *Store) Del(k string) bool {
	sh := s.shard(k)
	sh.mu.Lock()
	defer sh.mu.Unlock()
	_, ok := sh.m[k]
	delete(sh.m, k)
	return ok
}

func (s *Store) Expire(k string, d time.Duration) bool {
	sh := s.shard(k)
	sh.mu.Lock()
	defer sh.mu.Unlock()
	it, ok := sh.m[k]
	if ok {
		it.exp = time.Now().Add(d)
		sh.m[k] = it
	}
	return ok
}

func (s *Store) Sweep() {
	now := time.Now()
	for _, sh := range s.shards {
		sh.mu.Lock()
		for k, it := range sh.m {
			if !it.exp.IsZero() && now.After(it.exp) {
				delete(sh.m, k)
			}
		}
		sh.mu.Unlock()
	}
}

func (s *Store) handle(conn net.Conn) {
	defer conn.Close()
	sc := bufio.NewScanner(conn)
	for {
		conn.SetReadDeadline(time.Now().Add(5 * time.Minute))
		if !sc.Scan() {
			return
		}
		f := strings.Fields(sc.Text())
		if len(f) == 0 {
			continue
		}
		switch strings.ToUpper(f[0]) {
		case "SET":
			if len(f) != 3 {
				fmt.Fprintln(conn, "ERR usage: SET key value")
				continue
			}
			s.Set(f[1], f[2])
			fmt.Fprintln(conn, "OK")
		case "GET":
			if v, ok := s.Get(f[1]); ok {
				fmt.Fprintln(conn, v)
			} else {
				fmt.Fprintln(conn, "(nil)")
			}
		case "DEL":
			if s.Del(f[1]) {
				fmt.Fprintln(conn, 1)
			} else {
				fmt.Fprintln(conn, 0)
			}
		case "EXPIRE":
			secs, err := strconv.Atoi(f[2])
			if err != nil {
				fmt.Fprintln(conn, "ERR seconds must be an integer")
				continue
			}
			if s.Expire(f[1], time.Duration(secs)*time.Second) {
				fmt.Fprintln(conn, 1)
			} else {
				fmt.Fprintln(conn, 0)
			}
		default:
			fmt.Fprintln(conn, "ERR unknown command")
		}
	}
}`,
    explanation: 'Sharding divides lock contention by 16. Lazy expiry keeps reads correct; the sweeper bounds memory. (Index bounds on f[1]/f[2] for GET/DEL/EXPIRE should be validated like SET — a good review point.)',
    complexity: { time: 'O(1) per command', space: 'O(keys)' },
    variation: 'Add an append-only file for persistence and replay it on startup; add KEYS with a prefix scan.',
  },
  {
    id: 'prod-09',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'In-process pub/sub message broker',
    story: 'Services in a monolith publish domain events (order.created) that several subscribers consume asynchronously.',
    prompt: 'Implement `Broker` with `Subscribe(topic string, buffer int) (<-chan Event, func())` (the func unsubscribes) and `Publish(ctx, topic, Event) error`. Slow subscribers must not block publishers: drop and count dropped events per subscriber.',
    requirements: ['Topic → subscriber set', 'Unsubscribe closes the channel exactly once', 'Publish never sends on a closed channel', 'Dropped-message metric'],
    hints: ['Hold an RWMutex: RLock in Publish while sending non-blocking; Lock in unsubscribe before closing.'],
    solution: `type Event struct {
	Topic   string
	Payload []byte
}

type subscriber struct {
	ch      chan Event
	dropped atomic.Int64
}

type Broker struct {
	mu   sync.RWMutex
	subs map[string]map[*subscriber]struct{}
}

func NewBroker() *Broker { return &Broker{subs: map[string]map[*subscriber]struct{}{}} }

func (b *Broker) Subscribe(topic string, buffer int) (<-chan Event, func()) {
	s := &subscriber{ch: make(chan Event, buffer)}
	b.mu.Lock()
	if b.subs[topic] == nil {
		b.subs[topic] = map[*subscriber]struct{}{}
	}
	b.subs[topic][s] = struct{}{}
	b.mu.Unlock()
	var once sync.Once
	return s.ch, func() {
		once.Do(func() {
			b.mu.Lock()
			delete(b.subs[topic], s)
			close(s.ch)
			b.mu.Unlock()
		})
	}
}

func (b *Broker) Publish(ctx context.Context, topic string, e Event) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	b.mu.RLock()
	defer b.mu.RUnlock()
	for s := range b.subs[topic] {
		select {
		case s.ch <- e:
		default:
			s.dropped.Add(1)
		}
	}
	return nil
}`,
    explanation: 'Close happens under the write lock while sends happen under the read lock, so a send can never race with close. Non-blocking sends isolate slow consumers; sync.Once makes unsubscribe idempotent.',
    complexity: { time: 'O(subscribers) per Publish', space: 'O(subscribers × buffer)' },
    variation: 'At-least-once delivery: per-subscriber durable queue with acks and redelivery after a visibility timeout.',
  },
  {
    id: 'prod-10',
    tier: 'advanced',
    level: 7,
    kind: 'design',
    title: 'Generic connection pool',
    story: 'A service talks to a legacy TCP system that allows at most 20 connections; dialling is slow (300 ms).',
    prompt: 'Implement `Pool[T io.Closer]` with `Get(ctx) (T, error)`, `Put(T, healthy bool)`, `Close()`. Max open connections; idle connections are reused; waiters block until a connection is returned or ctx expires.',
    requirements: ['Semaphore for max open', 'Idle channel for reuse', 'Broken connections (healthy=false) are closed and their slot released', 'Close closes all idle connections'],
    hints: ['sem := make(chan struct{}, max) counts OPEN connections; idle := make(chan T, max).', 'Get: try idle first (non-blocking), else acquire sem (or wait for idle) with select on ctx.'],
    solution: `var ErrPoolClosed = errors.New("pool closed")

type Pool[T io.Closer] struct {
	dial   func(context.Context) (T, error)
	sem    chan struct{} // one token per open connection
	idle   chan T
	closed atomic.Bool
}

func NewPool[T io.Closer](max int, dial func(context.Context) (T, error)) *Pool[T] {
	return &Pool[T]{dial: dial, sem: make(chan struct{}, max), idle: make(chan T, max)}
}

func (p *Pool[T]) Get(ctx context.Context) (T, error) {
	var zero T
	if p.closed.Load() {
		return zero, ErrPoolClosed
	}
	select {
	case c := <-p.idle:
		return c, nil
	default:
	}
	select {
	case c := <-p.idle:
		return c, nil
	case p.sem <- struct{}{}:
		c, err := p.dial(ctx)
		if err != nil {
			<-p.sem
			return zero, err
		}
		return c, nil
	case <-ctx.Done():
		return zero, ctx.Err()
	}
}

func (p *Pool[T]) Put(c T, healthy bool) {
	if !healthy || p.closed.Load() {
		c.Close()
		<-p.sem
		return
	}
	select {
	case p.idle <- c:
	default: // should not happen: idle cap == max open
		c.Close()
		<-p.sem
	}
}

func (p *Pool[T]) Close() {
	if p.closed.Swap(true) {
		return
	}
	for {
		select {
		case c := <-p.idle:
			c.Close()
			<-p.sem
		default:
			return
		}
	}
}`,
    explanation: 'The semaphore bounds total open connections; the idle channel recycles them. Selecting on idle, sem and ctx together means a waiter wakes for whichever comes first: a returned connection or a free slot.',
    complexity: { time: 'O(1) Get/Put (excluding dial)', space: 'O(max)' },
    variation: 'Add max idle time (close connections idle > 5 min) and health checks before handing out a connection.',
  },
]
