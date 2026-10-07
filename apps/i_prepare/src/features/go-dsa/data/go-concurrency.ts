import type { Module } from '../types'

export const MODULE_10: Module = {
  id: 'm10',
  number: 10,
  track: 'go',
  title: 'Concurrency',
  shortTitle: 'Concurrency',
  tagline: 'Goroutines and the scheduler, channels, select and context, the sync package, pipelines and worker pools, and every way it goes wrong.',
  topics: [
    {
      id: 'm10-t1',
      title: 'Goroutines, the Runtime Scheduler and GOMAXPROCS',
      summary: 'Concurrency vs parallelism, G-M-P, and why main exiting kills everything.',
      concept: [
        'A goroutine is a function running concurrently, started with `go f()`. It costs a ~2 KB growable stack, so millions are feasible. `main` itself runs in a goroutine; when main returns, the program exits and all other goroutines are killed mid-flight.',
        'The runtime scheduler multiplexes goroutines (G) onto OS threads (M) via logical processors (P). GOMAXPROCS = number of Ps = how many goroutines execute Go code in PARALLEL (defaults to CPU count; container-aware since Go 1.25). Blocking syscalls hand off the P; network I/O parks the goroutine on the netpoller.',
        'Concurrency is structuring a program as independently executing tasks; parallelism is executing them simultaneously. Concurrency works even with GOMAXPROCS=1.',
        'The scheduler is preemptive (asynchronous preemption since Go 1.14), and goroutine order is NOT deterministic. You must synchronise to wait for or communicate with goroutines.',
      ],
      why: 'Cheap goroutines let you write straightforward blocking code per request/connection while the runtime handles efficient multiplexing.',
      whenToUse: ['Per-connection/per-request handlers', 'Independent I/O-bound work in parallel', 'Background tasks with a clear owner and stop condition'],
      whenNotToUse: ['Fire-and-forget without a way to stop or wait (goroutine leaks).', 'Tiny CPU work where coordination costs more than the work.'],
      syntax: `go worker(id)
go func(msg string) {
	fmt.Println(msg)
}("hi")
runtime.GOMAXPROCS(0)   // read current value
runtime.NumGoroutine()`,
      example: {
        code: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			fmt.Println("worker", i)
		}()
	}
	wg.Wait()
	fmt.Println("all done")
}`,
        output: `worker 3
worker 1
worker 2
all done   (worker order varies run to run)`,
        notes: ['Each goroutine captures its own i (Go 1.22+).', 'wg.Wait blocks main until all three call Done.', 'The order of worker lines is up to the scheduler; "all done" is always last.'],
      },
      mistakes: ['Assuming goroutines run in the order started.', 'Using time.Sleep to "wait" for goroutines.', 'Starting goroutines in a loop with no bound (100k HTTP requests at once).'],
      problems: [
        {
          id: 'm10-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'The brief’s hello/main question',
          prompt: 'Is `main` a goroutine? What happens to the goroutine when main returns? Why can the output differ? What does the runtime do?',
          code: `package main

import "fmt"

func main() {
	go func() {
		fmt.Println("hello")
	}()
	fmt.Println("main")
}`,
          check: {
            options: [
              'Usually prints only "main"; "hello" may or may not print because the program exits when main returns',
              'Always prints "hello" then "main"',
              'Always prints "main" then "hello"',
              'Deadlock: fatal error',
            ],
            answerIndex: 0,
          },
          hints: ['Nothing waits for the anonymous goroutine.', 'Program exit does not wait for other goroutines.'],
          solution: 'Yes, main runs in the main goroutine. When main returns, the process exits and the other goroutine is killed — no cleanup. Typically only "main" prints; occasionally "hello" prints first or in between if the scheduler happens to run it before exit. The runtime put the new goroutine on a run queue; whether a P picks it up before os.Exit is a race.',
          explanation: 'Use a WaitGroup or channel to wait. Output that depends on scheduling is a bug.',
        },
        {
          id: 'm10-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Fetch prices in parallel',
          story: 'A travel site queries 5 airline APIs; sequentially it takes 5 × 400 ms = 2 s.',
          prompt: 'Write `FetchAll(airlines []string, fetch func(string) (int, error)) map[string]int` that calls fetch concurrently for all airlines, ignores failed ones, and returns the prices. No data races (verify mentally with -race).',
          hints: ['Write results into a pre-sized slice by index (no lock needed), then build the map after Wait.', 'Or protect a shared map with a sync.Mutex.'],
          solution: `func FetchAll(airlines []string, fetch func(string) (int, error)) map[string]int {
	type result struct {
		price int
		ok    bool
	}
	results := make([]result, len(airlines))
	var wg sync.WaitGroup
	for i, name := range airlines {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if p, err := fetch(name); err == nil {
				results[i] = result{p, true}
			}
		}()
	}
	wg.Wait()
	prices := make(map[string]int, len(airlines))
	for i, r := range results {
		if r.ok {
			prices[airlines[i]] = r.price
		}
	}
	return prices
}`,
          explanation: 'Each goroutine writes a distinct slice element — no shared memory location, so no race. The map is built single-threaded after Wait (which establishes happens-before). Total latency ≈ slowest call.',
          complexity: { time: 'O(n) work; wall time ≈ max latency', space: 'O(n)' },
          variation: 'Add a per-call timeout via context and cap concurrency at 3 with a semaphore channel.',
        },
        {
          id: 'm10-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'GOMAXPROCS=1',
          prompt: 'With GOMAXPROCS=1, can two goroutines run concurrently? In parallel? Can a data race still happen? Explain with the G-M-P model.',
          hints: ['One P means one goroutine executes Go code at a time.', 'Preemption can switch goroutines between any two instructions of your logic.'],
          solution: 'Concurrently: yes — the scheduler interleaves them on the single P (they make progress over the same period). In parallel: no — only one runs Go code at any instant (though blocked syscalls may occupy extra Ms). Races: yes — preemption can switch goroutines in the middle of a read-modify-write such as `counter++`, so unsynchronised access is still a race and still undefined behaviour per the memory model; the race detector reports it regardless of GOMAXPROCS.',
          explanation: 'Correctness must never depend on GOMAXPROCS.',
        },
      ],
    },
    {
      id: 'm10-t2',
      title: 'Channels: Unbuffered, Buffered, close, range and Direction',
      summary: '"Don’t communicate by sharing memory; share memory by communicating."',
      concept: [
        'A channel `chan T` is a typed, goroutine-safe queue. Unbuffered channels (`make(chan T)`) synchronise: a send blocks until a receiver takes it — a handoff. Buffered channels (`make(chan T, n)`) block sends only when full and receives only when empty.',
        '`close(ch)` signals no more values. Receivers drain remaining buffered values, then get the zero value with ok=false: `v, ok := <-ch`. `for v := range ch` stops after close. Sending on a closed channel panics; closing twice panics; only the SENDER should close.',
        'A nil channel blocks forever on send and receive — useful to disable a select case.',
        'Directional types restrict usage: `chan<- T` send-only, `<-chan T` receive-only. Functions should declare them to document ownership.',
      ],
      why: 'Channels combine communication and synchronisation, letting you transfer ownership of data between goroutines without locks.',
      whenToUse: ['Passing work items or results between goroutines', 'Signalling done/quit (close a `chan struct{}`)', 'Bounding concurrency (buffered channel as semaphore)'],
      whenNotToUse: ['Protecting a simple counter or cache — a mutex is simpler and faster.', 'As a general-purpose queue in single-goroutine code.'],
      syntax: `ch := make(chan int)        // unbuffered
buf := make(chan string, 3) // buffered
go func() { ch <- 42 }()
v := <-ch
close(buf)
for s := range buf {}
func producer(out chan<- int) {}
func consumer(in <-chan int) {}`,
      example: {
        code: `package main

import "fmt"

func gen(n int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for i := 1; i <= n; i++ {
			out <- i * i
		}
	}()
	return out
}

func main() {
	sum := 0
	for v := range gen(4) {
		sum += v
	}
	fmt.Println(sum)
	ch := make(chan int, 1)
	ch <- 7
	close(ch)
	a, ok1 := <-ch
	b, ok2 := <-ch
	fmt.Println(a, ok1, b, ok2)
}`,
        output: `30
7 true 0 false`,
        notes: ['The generator owns and closes its channel; range ends after close.', 'Buffered values survive close and are drained first.', 'After draining, receives return the zero value and ok=false.'],
      },
      mistakes: ['Closing from the receiver side or from multiple senders.', 'Forgetting to close → range never ends → deadlock or leak.', 'Unbuffered send with no receiver in the same goroutine → deadlock.'],
      problems: [
        {
          id: 'm10-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Deadlock on an unbuffered channel',
          prompt: 'What happens?',
          code: `package main

import "fmt"

func main() {
	ch := make(chan int)
	ch <- 1
	fmt.Println(<-ch)
}`,
          check: { options: ['fatal error: all goroutines are asleep - deadlock!', 'prints 1', 'panic: send on closed channel', 'prints 0'], answerIndex: 0 },
          hints: ['An unbuffered send waits for a receiver. Who is receiving?'],
          solution: '`fatal error: all goroutines are asleep - deadlock!`',
          explanation: 'The send blocks main until another goroutine receives, but the only receive is on the next line of the same goroutine. The runtime detects that no goroutine can make progress. With `make(chan int, 1)` it would print 1.',
        },
        {
          id: 'm10-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Semaphore-bounded image resizing',
          story: 'A photo service must resize 10,000 images but the host can only handle 8 at once.',
          prompt: 'Write `ResizeAll(paths []string, limit int, resize func(string) error) []error` using a buffered channel as a semaphore. Return errors in the same order as paths (nil for success).',
          hints: ['`sem := make(chan struct{}, limit)`; acquire with `sem <- struct{}{}`, release with `<-sem`.', 'Acquire BEFORE starting the goroutine to avoid spawning 10,000 goroutines at once.'],
          solution: `func ResizeAll(paths []string, limit int, resize func(string) error) []error {
	errs := make([]error, len(paths))
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	for i, p := range paths {
		sem <- struct{}{}
		wg.Add(1)
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			errs[i] = resize(p)
		}()
	}
	wg.Wait()
	return errs
}`,
          explanation: 'The channel capacity is the number of permits. Acquiring in the loop throttles goroutine creation itself; each goroutine releases its permit when done.',
          complexity: { time: 'O(n) tasks, ≤ limit in flight', space: 'O(n) for errs, O(limit) goroutines alive' },
          variation: 'Use `golang.org/x/sync/errgroup` with `SetLimit` and stop scheduling new work after the first error.',
        },
        {
          id: 'm10-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Who closes the channel?',
          prompt: 'Three producers send on `results` and main ranges over it. It sometimes panics and sometimes hangs. Fix it.',
          code: `func main() {
	results := make(chan int)
	for i := 0; i < 3; i++ {
		go func() {
			results <- i * 10
			close(results)
		}()
	}
	for r := range results {
		fmt.Println(r)
	}
}`,
          hints: ['Three goroutines each call close.', 'Who knows when ALL producers are done?'],
          solution: 'The first producer closes the channel; the others then panic with "send on closed channel" (or "close of closed channel"). Without the close, range would hang forever.\n\nFix: a separate closer waits for all producers.\n\n```go\nvar wg sync.WaitGroup\nfor i := 0; i < 3; i++ {\n\twg.Add(1)\n\tgo func() {\n\t\tdefer wg.Done()\n\t\tresults <- i * 10\n\t}()\n}\ngo func() {\n\twg.Wait()\n\tclose(results)\n}()\nfor r := range results { fmt.Println(r) }\n```',
          explanation: 'With multiple senders, closing is the job of a coordinator that knows all senders have finished.',
        },
      ],
    },
    {
      id: 'm10-t3',
      title: 'select, Timeouts, Cancellation and context',
      summary: 'Waiting on many channels, giving up in time, and propagating cancellation through call trees.',
      concept: [
        '`select` waits on multiple channel operations and runs ONE ready case; if several are ready it picks pseudo-randomly. A `default` case makes it non-blocking.',
        'Timeouts: `case <-time.After(d):`. In loops prefer a reusable `time.NewTimer` / `time.Ticker` and stop it.',
        '`context.Context` carries cancellation, deadlines and request-scoped values across API boundaries. `ctx.Done()` is a channel closed on cancel; `ctx.Err()` says why (Canceled or DeadlineExceeded). Create children with `WithCancel`, `WithTimeout`, `WithDeadline`, and ALWAYS call the returned cancel func.',
        'Convention: ctx is the first parameter, named ctx; never store it in a struct; pass `context.Background()` at the top (main, tests).',
      ],
      why: 'Without cancellation, a client that disconnects leaves your server doing work (and holding goroutines) for nobody.',
      whenToUse: ['Every outbound I/O call (HTTP, DB, RPC) takes a ctx', 'select with ctx.Done() in every long-running loop', 'default for try-send/try-receive'],
      whenNotToUse: ['context.Value for optional function parameters — only for request-scoped data like trace IDs.', 'Busy-looping select with default.'],
      syntax: `ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
defer cancel()

select {
case res := <-results:
	use(res)
case <-ctx.Done():
	return ctx.Err()
}

select {
case ch <- v:
default:
	dropped++ // non-blocking send
}`,
      example: {
        code: `package main

import (
	"context"
	"fmt"
	"time"
)

func slowQuery(ctx context.Context) (string, error) {
	select {
	case <-time.After(200 * time.Millisecond):
		return "rows", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()
	res, err := slowQuery(ctx)
	fmt.Printf("%q %v\\n", res, err)
}`,
        output: `"" context deadline exceeded`,
        notes: ['The context expires after 50 ms, closing ctx.Done().', 'select picks the Done case first because it becomes ready first.', 'Callers can use errors.Is(err, context.DeadlineExceeded).'],
      },
      mistakes: ['Forgetting `defer cancel()` (leaks timers until the parent ends; vet warns).', '`time.After` in a hot loop allocates a timer per iteration.', 'Ignoring ctx inside workers so cancellation never stops them.'],
      problems: [
        {
          id: 'm10-t3-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'select with default',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	for i := 0; i < 3; i++ {
		select {
		case ch <- i:
			fmt.Print("sent", i, " ")
		default:
			fmt.Print("full", i, " ")
		}
	}
	fmt.Println(<-ch)
}`,
          check: { options: ['sent0 full1 full2 0', 'sent0 sent1 sent2 2', 'sent0 full1 full2 2', 'deadlock'], answerIndex: 0 },
          hints: ['Capacity 1, nobody receives during the loop.'],
          solution: '`sent0 full1 full2 0`',
          explanation: 'The first send fills the buffer. The next two sends would block, so default runs. Then main receives the buffered 0. (Print adds no spaces between a string and a number operand pair here because one is a string.)',
        },
        {
          id: 'm10-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'First response wins',
          story: 'A CDN asks 3 replica servers for the same object and uses whichever answers first, cancelling the rest.',
          prompt: 'Write `First(ctx context.Context, replicas []string, get func(ctx context.Context, replica string) ([]byte, error)) ([]byte, error)`. Return the first success; if all fail return the last error; cancel the losers; do not leak goroutines.',
          hints: ['Derive `ctx, cancel := context.WithCancel(ctx)`; defer cancel.', 'Use a BUFFERED results channel of len(replicas) so losers never block on send after you return.'],
          solution: `func First(ctx context.Context, replicas []string,
	get func(context.Context, string) ([]byte, error)) ([]byte, error) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	type result struct {
		data []byte
		err  error
	}
	results := make(chan result, len(replicas))
	for _, r := range replicas {
		go func() {
			data, err := get(ctx, r)
			results <- result{data, err}
		}()
	}

	var lastErr error = errors.New("no replicas")
	for range replicas {
		select {
		case res := <-results:
			if res.err == nil {
				return res.data, nil // deferred cancel stops the others
			}
			lastErr = res.err
		case <-ctx.Done():
			return nil, ctx.Err()
		}
	}
	return nil, lastErr
}`,
          explanation: 'The buffer guarantees every goroutine can complete its send even after First returns, so none leak. cancel() propagates to in-flight gets that honour ctx.',
          complexity: { time: 'Wall time ≈ fastest success', space: 'O(replicas)' },
          variation: 'Hedged requests: start replica 1, and only if it has not answered in 50 ms start replica 2, then 3.',
        },
        {
          id: 'm10-t3-p3',
          tier: 'interview',
          level: 4,
          kind: 'debug',
          title: 'Leaking timeouts',
          prompt: 'This handler leaks a goroutine on every timeout. Why? Fix it with a one-character-class change.',
          code: `func handle(ctx context.Context) (string, error) {
	ch := make(chan string)
	go func() {
		ch <- expensive()
	}()
	select {
	case s := <-ch:
		return s, nil
	case <-time.After(time.Second):
		return "", errors.New("timeout")
	}
}`,
          hints: ['After the timeout, who receives from ch?'],
          solution: 'On timeout, handle returns and nobody ever receives from the unbuffered ch, so the goroutine blocks on `ch <- …` forever — one leaked goroutine (and its stack/captures) per timeout.\n\nFix: `ch := make(chan string, 1)` — the send completes into the buffer and the goroutine exits. Better still, pass ctx to `expensive` so the work itself stops, and use ctx.Done() instead of time.After.',
          explanation: 'Every goroutine needs a guaranteed exit path; a send with no possible receiver is a leak.',
        },
      ],
    },
    {
      id: 'm10-t4',
      title: 'The sync Package and Atomics',
      summary: 'WaitGroup, Mutex, RWMutex, Once, Cond, sync.Map and sync/atomic.',
      concept: [
        '`sync.WaitGroup`: Add before starting, Done when finished, Wait to block. (Go 1.25 adds `wg.Go(f)`.) `sync.Mutex` guards a critical section; `sync.RWMutex` allows many readers or one writer.',
        '`sync.Once` runs initialisation exactly once even under concurrency (`sync.OnceValue` returns a value). `sync.Cond` lets goroutines wait for a condition with Wait/Signal/Broadcast — rarely needed when channels fit.',
        '`sync.Map` is optimised for keys written once and read many times, or disjoint key sets per goroutine; otherwise a map + Mutex is usually faster and type-safe.',
        '`sync/atomic` provides lock-free operations: `atomic.Int64{}.Add`, `Load`, `Store`, `CompareAndSwap`, `atomic.Pointer[T]`. Good for counters and flags, not for multi-field invariants.',
      ],
      why: 'Some state is naturally shared (caches, counters, connection pools); sync primitives make that sharing safe and cheap.',
      whenToUse: ['Mutex for protecting a struct’s fields', 'RWMutex for read-heavy caches', 'atomic for metrics counters', 'Once for lazy singletons'],
      whenNotToUse: ['RWMutex for write-heavy or tiny critical sections (more overhead than Mutex).', 'Atomics to coordinate several variables.', 'Copying any sync type after use.'],
      syntax: `type Cache struct {
	mu sync.RWMutex
	m  map[string]string
}
func (c *Cache) Get(k string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	v, ok := c.m[k]
	return v, ok
}
var hits atomic.Int64
hits.Add(1)
var once sync.Once
once.Do(loadConfig)`,
      example: {
        code: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	plain, locked := 0, 0
	var atom atomic.Int64
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			plain++ // DATA RACE
			mu.Lock()
			locked++
			mu.Unlock()
			atom.Add(1)
		}()
	}
	wg.Wait()
	fmt.Println(plain <= 1000, locked, atom.Load())
}`,
        output: `true 1000 1000   (plain is often < 1000; go run -race reports it)`,
        notes: ['plain++ is read-modify-write without sync → lost updates and a data race.', 'The mutex serialises increments → exactly 1000.', 'atomic.Add is a single indivisible hardware operation → 1000.'],
      },
      mistakes: ['wg.Add inside the goroutine (Wait may return before Add runs).', 'Forgetting to Unlock on an early return (use defer).', 'Locking in inconsistent order across two mutexes → deadlock.'],
      problems: [
        {
          id: 'm10-t4-p1',
          tier: 'foundation',
          level: 2,
          kind: 'debug',
          title: 'WaitGroup misuse',
          prompt: 'This sometimes prints fewer than 5 lines. Why?',
          code: `var wg sync.WaitGroup
for i := 0; i < 5; i++ {
	go func() {
		wg.Add(1)
		defer wg.Done()
		fmt.Println(i)
	}()
}
wg.Wait()`,
          hints: ['What is the counter when Wait runs if no goroutine has started yet?'],
          solution: 'Add is called inside the goroutine. If main reaches Wait before any goroutine runs, the counter is 0 and Wait returns immediately; main exits and kills the goroutines.\n\nFix: call `wg.Add(1)` in the loop before `go`, or `wg.Add(5)` before the loop (or use `wg.Go(func(){...})` in Go 1.25+).',
          explanation: 'Add must happen-before Wait; the goroutine body has no ordering guarantee relative to main.',
        },
        {
          id: 'm10-t4-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Thread-safe latest-location store',
          story: 'A fleet tracker receives GPS pings from 50,000 vehicles; dashboards read the latest position thousands of times per second.',
          prompt: 'Write `type LocationStore` with `Update(vehicleID string, loc Location)`, `Get(vehicleID string) (Location, bool)` and `Snapshot() map[string]Location` (a copy). Choose RWMutex vs Mutex vs sync.Map and justify. Include an `Updates()` counter using atomic.',
          hints: ['Reads dominate → RWMutex.', 'Snapshot must copy under RLock so callers cannot race on the internal map.'],
          solution: `type Location struct{ Lat, Lng float64; At time.Time }

type LocationStore struct {
	mu      sync.RWMutex
	latest  map[string]Location
	updates atomic.Int64
}

func NewLocationStore() *LocationStore {
	return &LocationStore{latest: make(map[string]Location)}
}

func (s *LocationStore) Update(id string, loc Location) {
	s.mu.Lock()
	if cur, ok := s.latest[id]; !ok || loc.At.After(cur.At) { // ignore out-of-order pings
		s.latest[id] = loc
	}
	s.mu.Unlock()
	s.updates.Add(1)
}

func (s *LocationStore) Get(id string) (Location, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	loc, ok := s.latest[id]
	return loc, ok
}

func (s *LocationStore) Snapshot() map[string]Location {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return maps.Clone(s.latest)
}

func (s *LocationStore) Updates() int64 { return s.updates.Load() }`,
          explanation: 'RWMutex lets many dashboard readers proceed in parallel. sync.Map would also suit "many reads" but loses type safety and Snapshot is awkward. Out-of-order protection is a real-world GPS concern. Location is a value type, so returned copies are safe.',
          complexity: { time: 'O(1) Get/Update; O(n) Snapshot', space: 'O(vehicles)', notes: 'At very high write rates, shard the map into N stripes by hash(id) to reduce lock contention.' },
          variation: 'Implement 64-way sharding and benchmark against the single-lock version with `b.RunParallel`.',
        },
        {
          id: 'm10-t4-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Lazy, concurrent-safe config with sync.Once',
          prompt: 'Write `func Config() (*Settings, error)` that loads settings from disk exactly once even when 1,000 goroutines call it simultaneously, and returns the same result (including the same error) to everyone. Then explain what goes wrong with the "check nil then lock" double-checked pattern without atomics.',
          hints: ['`sync.OnceValues(func() (*Settings, error))` (Go 1.21).', 'Without sync, a reader may see a non-nil pointer before the pointed-to fields are visible.'],
          solution: `type Settings struct{ DSN string }

var loadConfig = sync.OnceValues(func() (*Settings, error) {
	b, err := os.ReadFile("config.json")
	if err != nil {
		return nil, fmt.Errorf("read config: %w", err)
	}
	var s Settings
	if err := json.Unmarshal(b, &s); err != nil {
		return nil, fmt.Errorf("parse config: %w", err)
	}
	return &s, nil
})

func Config() (*Settings, error) { return loadConfig() }`,
          explanation: 'OnceValues guarantees the function runs once; all callers block until it completes and then see its results (Once establishes happens-before). Hand-rolled `if cfg == nil { mu.Lock(); ... }` reads cfg without synchronisation — a data race; under the Go memory model a reader could observe the pointer without the initialised fields.',
          complexity: { time: 'O(1) after first call', space: 'O(1)' },
          variation: 'Config must be reloadable on SIGHUP. Use `atomic.Pointer[Settings]` so readers never lock.',
        },
      ],
    },
    {
      id: 'm10-t5',
      title: 'Patterns: Worker Pools, Fan-out/Fan-in, Pipelines',
      summary: 'Composable concurrent stages with clean shutdown.',
      concept: [
        'Worker pool: N goroutines read jobs from one channel and write results to another — bounded parallelism.',
        'Fan-out: several goroutines read from the same channel to parallelise a stage. Fan-in (merge): several channels are combined into one, closed when all inputs are done.',
        'Pipeline: a series of stages connected by channels; each stage owns and closes its output. Every stage must select on ctx.Done() (or a done channel) when sending, so cancellation tears the pipeline down without leaks.',
        'errgroup (`golang.org/x/sync/errgroup`) bundles WaitGroup + first-error + context cancellation.',
      ],
      why: 'These patterns turn "process a stream concurrently" into small, testable pieces with bounded resources.',
      whenToUse: ['CPU-bound batch work (N = GOMAXPROCS)', 'I/O-bound fan-out with a concurrency cap', 'Streaming ETL'],
      whenNotToUse: ['When a simple loop is fast enough.', 'When ordering matters and you have not designed for it (results arrive out of order).'],
      syntax: `jobs := make(chan Job)
results := make(chan Result)
for w := 0; w < n; w++ {
	go func() {
		for j := range jobs { results <- process(j) }
	}()
}`,
      example: {
        code: `package main

import (
	"fmt"
	"sync"
)

func square(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for v := range in {
			out <- v * v
		}
	}()
	return out
}

func merge(cs ...<-chan int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup
	for _, c := range cs {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for v := range c {
				out <- v
			}
		}()
	}
	go func() { wg.Wait(); close(out) }()
	return out
}

func main() {
	in := make(chan int)
	go func() {
		defer close(in)
		for i := 1; i <= 4; i++ {
			in <- i
		}
	}()
	sum := 0
	for v := range merge(square(in), square(in)) {
		sum += v
	}
	fmt.Println(sum)
}`,
        output: `30`,
        notes: ['Two square stages fan out over the same input channel.', 'merge fans them back in and closes out only after both inputs close.', 'Order of values varies; the sum (1+4+9+16) does not.'],
      },
      mistakes: ['Stages that block on send forever after the consumer quits (no done/ctx).', 'Closing the results channel before all workers finish.', 'Unbounded goroutine creation per item instead of a pool.'],
      problems: [
        {
          id: 'm10-t5-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Sizing a worker pool',
          prompt: 'You process 1M log files: (a) gzip-decompress (CPU-bound), (b) upload to S3 (network-bound, ~200 ms each). How many workers for each stage, and why?',
          hints: ['CPU-bound stages cannot go faster than the number of cores.', 'I/O-bound throughput ≈ workers / latency until the remote side or bandwidth saturates.'],
          solution: '(a) ≈ GOMAXPROCS (number of usable cores): more workers only add context switching. (b) many more — e.g. 64–256 — because each worker spends almost all its time waiting; target throughput = workers / 0.2 s, capped by S3 rate limits, bandwidth and memory. Measure and tune; separate stages so each gets its own pool size.',
          explanation: 'Little’s law: concurrency = throughput × latency.',
        },
        {
          id: 'm10-t5-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Order-processing worker pool with cancellation',
          story: 'An e-commerce backend validates and prices 100k orders after a flash sale.',
          prompt: 'Write `ProcessOrders(ctx context.Context, orders []Order, workers int, price func(context.Context, Order) (Invoice, error)) ([]Invoice, error)` using errgroup: return invoices IN INPUT ORDER, stop everything on the first error, respect ctx.',
          hints: ['`g, ctx := errgroup.WithContext(ctx)`; feed indexes through a channel.', 'Write each invoice into `out[i]` — no lock needed.'],
          solution: `func ProcessOrders(ctx context.Context, orders []Order, workers int,
	price func(context.Context, Order) (Invoice, error)) ([]Invoice, error) {
	out := make([]Invoice, len(orders))
	g, ctx := errgroup.WithContext(ctx)
	idx := make(chan int)

	g.Go(func() error {
		defer close(idx)
		for i := range orders {
			select {
			case idx <- i:
			case <-ctx.Done():
				return ctx.Err()
			}
		}
		return nil
	})

	for w := 0; w < workers; w++ {
		g.Go(func() error {
			for i := range idx {
				inv, err := price(ctx, orders[i])
				if err != nil {
					return fmt.Errorf("order %d: %w", i, err)
				}
				out[i] = inv
			}
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return out, nil
}`,
          explanation: 'The feeder stops when ctx is cancelled (first worker error cancels the errgroup ctx), workers exit when idx closes, and Wait returns the first error. Writing by index preserves order without sorting.',
          complexity: { time: 'O(n) work, wall ≈ n·latency / workers', space: 'O(n) results' },
          variation: 'Stream results instead of collecting them, while still emitting them in input order (reorder buffer keyed by index).',
        },
        {
          id: 'm10-t5-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Cancellable pipeline',
          story: 'A log-analytics job reads lines → parses JSON → filters errors → counts per service. The user may cancel at any time.',
          prompt: 'Write stages `parse(ctx, <-chan string) <-chan Event`, `filter(ctx, <-chan Event, level string) <-chan Event` and a sink `count(<-chan Event) map[string]int`. Every send must be cancellable. Explain why `for v := range in { out <- v }` alone leaks on cancel.',
          hints: ['Wrap every send in `select { case out <- e: case <-ctx.Done(): return }`.', 'Each stage defers close(out).'],
          solution: `type Event struct {
	Service string \`json:"service"\`
	Level   string \`json:"level"\`
}

func parse(ctx context.Context, in <-chan string) <-chan Event {
	out := make(chan Event)
	go func() {
		defer close(out)
		for line := range in {
			var e Event
			if json.Unmarshal([]byte(line), &e) != nil {
				continue
			}
			select {
			case out <- e:
			case <-ctx.Done():
				return
			}
		}
	}()
	return out
}

func filter(ctx context.Context, in <-chan Event, level string) <-chan Event {
	out := make(chan Event)
	go func() {
		defer close(out)
		for e := range in {
			if e.Level != level {
				continue
			}
			select {
			case out <- e:
			case <-ctx.Done():
				return
			}
		}
	}()
	return out
}

func count(in <-chan Event) map[string]int {
	counts := map[string]int{}
	for e := range in {
		counts[e.Service]++
	}
	return counts
}`,
          explanation: 'If the consumer stops reading, a plain `out <- v` blocks forever and that stage (and every upstream stage blocked on it) leaks. The select lets each stage exit on cancel; closing out then unblocks downstream ranges. The source feeding `in` must also respect ctx.',
          complexity: { time: 'O(lines)', space: 'O(services) + O(1) per stage' },
          variation: 'Fan out `parse` to 4 goroutines and merge them; the merged channel must still close exactly once.',
        },
      ],
    },
    {
      id: 'm10-t6',
      title: 'Race Conditions, Deadlocks, Livelocks, Starvation and Goroutine Leaks',
      summary: 'Recognising and diagnosing the failure modes.',
      concept: [
        'A data race: two goroutines access the same memory concurrently, at least one writes, and there is no happens-before ordering. Behaviour is undefined (torn reads, lost updates, crashes on maps: "concurrent map writes"). Detect with `go test -race` / `go run -race`.',
        'A race CONDITION is a logic bug where outcome depends on timing even with synchronised operations (check-then-act: `if balance >= x { balance -= x }` with separate locks).',
        'Deadlock: goroutines wait on each other forever (lock ordering, channel with no partner). The runtime only detects it when ALL goroutines are blocked. Livelock: goroutines keep reacting to each other without progress. Starvation: a goroutine never gets the resource (e.g. a writer behind constant readers).',
        'Goroutine leak: a goroutine blocked forever on a channel/lock/IO that will never complete. Detect with `runtime.NumGoroutine`, pprof goroutine profiles, or `go.uber.org/goleak` in tests.',
      ],
      why: 'Concurrency bugs are non-deterministic; knowing the patterns lets you find them by reading code instead of waiting for production.',
      whenToUse: ['Always run tests with -race in CI', 'Consistent lock ordering', 'Timeouts/ctx on every blocking operation'],
      whenNotToUse: ['Do not "fix" races with time.Sleep.', 'Do not assume x86 behaviour — the Go memory model is the contract.'],
      syntax: `$ go test -race ./...
$ curl localhost:6060/debug/pprof/goroutine?debug=2
runtime.NumGoroutine()`,
      example: {
        code: `package main

import (
	"fmt"
	"sync"
)

func main() {
	m := map[int]int{}
	var mu sync.Mutex
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock() // remove these two lines → "fatal error: concurrent map writes"
			m[i%10]++
			mu.Unlock()
		}()
	}
	wg.Wait()
	fmt.Println(len(m), m[0])
}`,
        output: `10 10`,
        notes: ['Maps are not safe for concurrent writes; the runtime detects some cases and crashes deliberately.', 'With the mutex, 100 increments over 10 keys → each key 10.'],
      },
      mistakes: ['Testing without -race.', 'Holding a lock while sending on a channel or doing I/O.', 'Starting goroutines with no exit path.'],
      problems: [
        {
          id: 'm10-t6-p1',
          tier: 'foundation',
          level: 3,
          kind: 'debug',
          title: 'Bank transfer deadlock',
          story: 'Two transfers run concurrently: A→B and B→A. The service freezes.',
          prompt: 'Explain the deadlock and fix it.',
          code: `type Account struct {
	mu      sync.Mutex
	ID      int
	Balance int
}

func Transfer(from, to *Account, amt int) {
	from.mu.Lock()
	defer from.mu.Unlock()
	to.mu.Lock()
	defer to.mu.Unlock()
	from.Balance -= amt
	to.Balance += amt
}`,
          hints: ['Goroutine 1 holds A and wants B; goroutine 2 holds B and wants A.', 'Impose a global order on locks.'],
          solution: 'Classic lock-ordering deadlock: T1 locks A then waits for B; T2 locks B then waits for A. Neither can proceed.\n\nFix: always lock in a consistent global order, e.g. by ID.\n\n```go\nfunc Transfer(from, to *Account, amt int) error {\n\tif from == to { return errors.New("same account") }\n\tfirst, second := from, to\n\tif second.ID < first.ID { first, second = second, first }\n\tfirst.mu.Lock(); defer first.mu.Unlock()\n\tsecond.mu.Lock(); defer second.mu.Unlock()\n\tif from.Balance < amt { return ErrInsufficientFunds }\n\tfrom.Balance -= amt\n\tto.Balance += amt\n\treturn nil\n}\n```\n\nAlso handles the self-transfer case (locking the same mutex twice would deadlock) and checks funds atomically.',
          explanation: 'Deadlock needs a cycle in the wait-for graph; a total lock order makes cycles impossible.',
        },
        {
          id: 'm10-t6-p2',
          tier: 'practical',
          level: 3,
          kind: 'debug',
          title: 'Check-then-act race condition',
          prompt: 'Every operation is protected by a lock, yet the inventory goes negative under load. Why?',
          code: `func (s *Store) Available(sku string) int {
	s.mu.Lock(); defer s.mu.Unlock()
	return s.stock[sku]
}
func (s *Store) Take(sku string, n int) {
	s.mu.Lock(); defer s.mu.Unlock()
	s.stock[sku] -= n
}

// handler
if store.Available(sku) >= qty {
	store.Take(sku, qty)
}`,
          hints: ['What can happen between Available returning and Take acquiring the lock?'],
          solution: 'The check and the act are separately atomic but not atomic TOGETHER. Two requests both see stock 1 ≥ 1, then both Take → −1. No data race (the detector is silent) — it is a race condition.\n\nFix: one method that checks and updates under one lock:\n\n```go\nfunc (s *Store) TryTake(sku string, n int) bool {\n\ts.mu.Lock(); defer s.mu.Unlock()\n\tif s.stock[sku] < n { return false }\n\ts.stock[sku] -= n\n\treturn true\n}\n```\n\nIn SQL the equivalent is `UPDATE … SET stock = stock - $1 WHERE sku = $2 AND stock >= $1`.',
          explanation: 'Invariants spanning multiple steps need a single critical section (or a CAS loop).',
        },
        {
          id: 'm10-t6-p3',
          tier: 'interview',
          level: 4,
          kind: 'predict',
          title: 'Leak counter',
          prompt: 'What does this print (approximately), and which goroutines are leaked?',
          code: `package main

import (
	"fmt"
	"runtime"
	"time"
)

func search(q string) <-chan string {
	ch := make(chan string)
	go func() {
		time.Sleep(10 * time.Millisecond)
		ch <- "result for " + q
	}()
	return ch
}

func main() {
	for i := 0; i < 100; i++ {
		select {
		case <-search("go"):
		case <-time.After(time.Millisecond):
		}
	}
	time.Sleep(50 * time.Millisecond)
	fmt.Println(runtime.NumGoroutine())
}`,
          check: { options: ['101', '1', '2', '0'], answerIndex: 0 },
          hints: ['Every select times out after 1 ms; nobody ever receives from those channels.'],
          solution: '`101` (100 leaked senders + main).',
          explanation: 'Each search goroutine finishes sleeping, then blocks forever on the unbuffered send because its receiver moved on. They never exit. Fix: `make(chan string, 1)` and/or pass a ctx.',
        },
      ],
    },
  ],
}
