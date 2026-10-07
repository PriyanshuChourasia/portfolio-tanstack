import type { Module } from '../types'

export const MODULE_11: Module = {
  id: 'm11',
  number: 11,
  track: 'go',
  title: 'Go Memory Model',
  shortTitle: 'Memory',
  tagline: 'Stack vs heap, escape analysis, the garbage collector, happens-before and memory visibility.',
  topics: [
    {
      id: 'm11-t1',
      title: 'Stack, Heap, Escape Analysis and Garbage Collection',
      summary: 'Where values live is decided by the compiler, not by new or &.',
      concept: [
        'Each goroutine has a stack for local variables that do not outlive the function call. Values that may outlive the call — returned pointers, values captured by escaping closures, values stored in interfaces or heap objects, things too large or of unknown size — "escape" to the heap.',
        'The compiler decides via escape analysis: `go build -gcflags=-m` prints decisions. `new(T)` and `&T{}` do NOT force heap allocation; only escaping does.',
        'Heap memory is reclaimed by a concurrent, tri-colour mark-and-sweep garbage collector with short stop-the-world pauses. GOGC (default 100) sets how much the heap may grow relative to live data before the next cycle; GOMEMLIMIT sets a soft memory cap.',
        'Fewer heap allocations = less GC work. Common techniques: pre-size slices/maps, reuse buffers (sync.Pool), avoid needless pointers, avoid converting to interfaces in hot loops.',
      ],
      why: 'Allocation rate, not raw CPU, is often what limits Go service throughput; understanding escape analysis lets you fix it with evidence.',
      whenToUse: ['-gcflags=-m when a benchmark shows allocs/op you did not expect', 'sync.Pool for short-lived, frequently reused buffers', 'GOMEMLIMIT in containers'],
      whenNotToUse: ['Micro-optimising allocations before profiling.', 'sync.Pool for long-lived objects or connection pooling.'],
      syntax: `$ go build -gcflags='-m' ./...
./main.go:8:9: &User{...} escapes to heap
./main.go:14:7: s does not escape

$ GODEBUG=gctrace=1 ./app
$ go test -bench . -benchmem`,
      example: {
        code: `package main

type Point struct{ X, Y int }

func onStack() int {
	p := Point{1, 2}   // does not escape
	return p.X + p.Y
}

func onHeap() *Point {
	p := Point{3, 4}   // escapes: returned by pointer
	return &p
}

func viaInterface(v any) {}

func main() {
	_ = onStack()
	_ = onHeap()
	n := 42
	viaInterface(n)    // n is copied into an interface → may allocate
}`,
        notes: [
          'onStack: p lives in the frame and is gone when the function returns.',
          'onHeap: returning &p is safe in Go — the compiler moves p to the heap ("moved to heap: p").',
          'Passing a non-pointer value as `any` generally boxes it (small ints 0–255 and constants are optimised).',
        ],
      },
      mistakes: ['Believing "returning a pointer to a local is dangerous" (it is safe in Go).', 'Returning pointers to tiny structs everywhere "for performance" (adds heap allocs + GC).', 'Holding big buffers in global caches without limits.'],
      problems: [
        {
          id: 'm11-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Does it escape?',
          prompt: 'Which variable escapes to the heap?',
          code: `func a() int      { x := 1; return x }
func b() *int     { y := 2; return &y }
func c() int      { z := 3; p := &z; return *p }
func d(s []int)   { w := make([]int, 4); copy(w, s) }`,
          check: { options: ['only y', 'y and z', 'y, z and w', 'all of them'], answerIndex: 0 },
          hints: ['Taking an address does not by itself cause escape.', 'A small make with constant size that is not retained can stay on the stack.'],
          solution: 'Only **y**.',
          explanation: 'y outlives b via the returned pointer. z’s address is used only locally. w has constant size 4 and does not leave d, so it can be stack-allocated. Verify with `-gcflags=-m`.',
        },
        {
          id: 'm11-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Reuse buffers with sync.Pool',
          story: 'A JSON API encodes 50k responses/s; profiling shows bytes.Buffer allocations dominate GC time.',
          prompt: 'Write `Encode(v any) ([]byte, error)` that takes a *bytes.Buffer from a sync.Pool, encodes JSON into it, copies the result out, resets the buffer and returns it to the pool. Explain why you must copy before Put, and why oversized buffers should be dropped.',
          hints: ['`var bufPool = sync.Pool{New: func() any { return new(bytes.Buffer) }}`.', 'After Put another goroutine may reuse the same buffer.'],
          solution: `var bufPool = sync.Pool{New: func() any { return new(bytes.Buffer) }}

func Encode(v any) ([]byte, error) {
	buf := bufPool.Get().(*bytes.Buffer)
	buf.Reset()
	defer func() {
		if buf.Cap() <= 64<<10 { // don't keep giant buffers alive
			bufPool.Put(buf)
		}
	}()
	if err := json.NewEncoder(buf).Encode(v); err != nil {
		return nil, err
	}
	return bytes.Clone(buf.Bytes()), nil
}`,
          explanation: 'buf.Bytes() aliases the pooled buffer; once returned to the pool another request may overwrite it, so the caller needs its own copy. Putting back a buffer that grew to 10 MB would pin that memory indefinitely.',
          complexity: { time: 'O(output size)', space: 'O(output) per call; pool amortises scratch buffers', notes: 'Pool contents may be dropped at any GC — it is a cache, not a guarantee.' },
          variation: 'Avoid the final copy by having the caller pass an io.Writer (e.g. http.ResponseWriter) instead of returning []byte.',
        },
        {
          id: 'm11-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'concept',
          title: 'GOGC and GOMEMLIMIT',
          prompt: 'A service has 400 MB of live heap and runs in a 1 GB container. It gets OOM-killed during traffic spikes. Explain how GOGC=100 contributes, and how GOMEMLIMIT changes behaviour. What is the risk of setting the limit too low?',
          hints: ['With GOGC=100, the next GC triggers at roughly 2× live heap.', 'GOMEMLIMIT makes the GC run more often as total memory approaches the limit.'],
          solution: 'With GOGC=100 the heap target is live × 2 ≈ 800 MB, plus goroutine stacks, runtime overhead and non-heap memory — a spike in live data pushes the target past 1 GB and the kernel kills the process before the GC reacts.\n\nGOMEMLIMIT=900MiB (a soft limit) tells the GC to collect more aggressively as total runtime memory nears 900 MiB, regardless of GOGC. Too low (below the real live set) causes a GC death spiral: the collector runs constantly, CPU goes to 100%, latency explodes (the runtime caps GC CPU at ~50% to limit this). Common setting: GOMEMLIMIT ≈ 90% of the container limit, GOGC left at default or raised.',
          explanation: 'GOGC trades memory for CPU; GOMEMLIMIT adds a ceiling.',
        },
      ],
    },
    {
      id: 'm11-t2',
      title: 'Happens-Before, Memory Visibility and Data Races',
      summary: 'Why a write in one goroutine is not automatically visible in another.',
      concept: [
        'Within a goroutine, statements appear to run in program order. Across goroutines, the compiler and CPU may reorder and cache memory operations. A write is guaranteed visible to a read only if the write happens-before the read.',
        'Happens-before edges come from synchronisation: a send on a channel happens-before the corresponding receive completes; close happens-before a receive that returns because of close; Unlock happens-before the next Lock; once.Do(f) completes before any Do returns; wg.Done happens-before Wait returns; atomic operations are sequentially consistent.',
        'A program with a data race has no defined behaviour guarantees for the racing variables — loops may never see updates, struct fields may tear.',
      ],
      why: 'Correct concurrent code is defined by the memory model, not by "it worked on my laptop".',
      whenToUse: ['Reason about every shared variable: which sync edge orders its writes and reads?', 'atomic.Bool for stop flags'],
      whenNotToUse: ['Plain bools/ints as cross-goroutine flags.', 'Assuming "benign" races are safe.'],
      syntax: `var ready atomic.Bool
var data string

go func() {
	data = "hello"      // (1)
	ready.Store(true)   // (2) release
}()
for !ready.Load() {}    // (3) acquire
fmt.Println(data)       // guaranteed "hello"`,
      example: {
        code: `package main

import "fmt"

var msg string
var done = make(chan struct{})

func setup() {
	msg = "configured"
	close(done)
}

func main() {
	go setup()
	<-done
	fmt.Println(msg)
}`,
        output: `configured`,
        notes: ['The write to msg happens-before close(done) (program order).', 'close happens-before the receive in main returns.', 'So the read of msg is ordered after the write — guaranteed visible.'],
      },
      mistakes: ['Busy-waiting on a plain bool (`for !done {}`) — may spin forever.', 'Publishing a pointer without synchronisation, then reading its fields.', 'Thinking a race on an int is "harmless".'],
      problems: [
        {
          id: 'm11-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'concept',
          title: 'Is it guaranteed?',
          prompt: 'Is "hello" guaranteed to print?',
          code: `var a string
var done bool

func setup() {
	a = "hello"
	done = true
}

func main() {
	go setup()
	for !done {
	}
	print(a)
}`,
          check: { options: ['No — it is a data race; it may print "" or loop forever', 'Yes — done is set after a', 'Yes on x86 only', 'It does not compile'], answerIndex: 0 },
          hints: ['Is there any synchronisation between the two goroutines?'],
          solution: 'No.',
          explanation: 'There is no happens-before edge. The compiler may hoist the read of done out of the loop (infinite loop), and even if main sees done=true it is not guaranteed to see a="hello". This exact example is in the Go memory model document. Fix with a channel, mutex or atomic.Bool.',
        },
        {
          id: 'm11-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Hot-reloadable routing table',
          story: 'A load balancer reads its routing table on every request (millions/s) and an admin endpoint replaces it occasionally.',
          prompt: 'Write `type Router struct` with `Route(host string) (backend string, ok bool)` that never takes a lock, and `Reload(table map[string]string)` that swaps in a new table safely. Explain the happens-before edge that makes it correct.',
          hints: ['`atomic.Pointer[map[string]string]`.', 'Treat each published map as immutable — never modify it after Store.'],
          solution: `type Router struct {
	table atomic.Pointer[map[string]string]
}

func NewRouter(t map[string]string) *Router {
	r := &Router{}
	r.Reload(t)
	return r
}

func (r *Router) Reload(t map[string]string) {
	cp := maps.Clone(t) // caller may keep mutating its map
	r.table.Store(&cp)
}

func (r *Router) Route(host string) (string, bool) {
	t := r.table.Load()
	b, ok := (*t)[host]
	return b, ok
}`,
          explanation: 'The writes that build cp happen-before Store (program order); Store synchronises-with the Load that observes it, so readers see a fully built map. Because the map is never mutated after publication, concurrent reads are safe without locks (copy-on-write).',
          complexity: { time: 'O(1) Route, O(n) Reload', space: 'O(n) per version; old versions are GC’d when no reader holds them' },
          variation: 'Readers sometimes need two lookups to be consistent (same table). How do you guarantee that?',
        },
        {
          id: 'm11-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'debug',
          title: 'Unsafe lazy init',
          prompt: 'The race detector flags this. Explain the failure scenario precisely and fix it.',
          code: `var instance *Client

func Get() *Client {
	if instance == nil {
		instance = &Client{conn: dial()}
	}
	return instance
}`,
          hints: ['Two goroutines can both see nil.', 'A reader may see the pointer before the conn field write is visible.'],
          solution: 'Two problems: (1) two goroutines can both observe nil and dial twice, one result lost (race condition); (2) unsynchronised publication: a goroutine may observe instance != nil and read instance.conn before that write is visible (data race → undefined behaviour).\n\nFix:\n\n```go\nvar Get = sync.OnceValue(func() *Client {\n\treturn &Client{conn: dial()}\n})\n```',
          explanation: 'sync.Once provides both mutual exclusion and the happens-before edge.',
        },
      ],
    },
  ],
}

export const MODULE_12: Module = {
  id: 'm12',
  number: 12,
  track: 'go',
  title: 'Generics',
  shortTitle: 'Generics',
  tagline: 'Type parameters, constraints, type sets with ~ and unions, and generic data structures.',
  topics: [
    {
      id: 'm12-t1',
      title: 'Type Parameters, any, comparable and Custom Constraints',
      summary: 'Writing one function for many types — safely.',
      concept: [
        'Functions and types can take type parameters in square brackets: `func Map[T, U any](s []T, f func(T) U) []U`. The compiler usually infers type arguments from the call.',
        'Each type parameter has a constraint — an interface describing allowed types and operations. `any` allows everything but only operations valid for all types (assignment, passing). `comparable` allows == and != (so it can be a map key).',
        '`comparable` does NOT allow `<` or `>`. For ordering use `cmp.Ordered` (integers, floats, strings). So `func Max[T comparable](a, b T) T` cannot be written with `>` — it needs `cmp.Ordered`.',
        'Custom constraints are interfaces with methods and/or type sets: `type Number interface { ~int | ~int64 | ~float64 }`.',
      ],
      why: 'Before generics you chose between duplicating code per type and losing type safety with interface{}. Generics give reusable, type-safe containers and algorithms.',
      whenToUse: ['Container types (Stack[T], Set[T], Cache[K,V])', 'Algorithms over slices/maps (Filter, Keys, Max)', 'When the code is identical for every type'],
      whenNotToUse: ['When an ordinary interface method expresses the behaviour (io.Reader).', 'To abstract over just one type “for the future”.'],
      syntax: `func Max[T cmp.Ordered](a, b T) T {
	if a > b { return a }
	return b
}

func Index[T comparable](s []T, v T) int {
	for i, x := range s {
		if x == v { return i }
	}
	return -1
}

type Number interface{ ~int | ~int64 | ~float64 }
func Sum[T Number](xs []T) T { var t T; for _, x := range xs { t += x }; return t }`,
      example: {
        code: `package main

import (
	"cmp"
	"fmt"
)

func Max[T cmp.Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}

type Rupees int

func main() {
	fmt.Println(Max(3, 7), Max("go", "rust"), Max(2.5, 1.5))
	fmt.Println(Max(Rupees(100), Rupees(40)))
}`,
        output: `7 rust 2.5
100`,
        notes: ['Type arguments are inferred: int, string, float64.', 'cmp.Ordered uses ~ so named types like Rupees (underlying int) qualify.', 'With `comparable` the `>` would fail to compile: "invalid operation: a > b (type parameter T is not ordered)".'],
      },
      mistakes: ['Using comparable when you need ordering.', 'Generic code that type-switches on T — usually a sign generics were the wrong tool.', 'Over-parameterising simple functions.'],
      problems: [
        {
          id: 'm12-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Is comparable enough?',
          prompt: 'The brief asks about `func Max[T comparable](a, b T) T`. What happens if the body uses `a > b`?',
          check: {
            options: [
              'Compile error: comparable only permits == and !=; use cmp.Ordered',
              'Works for all types',
              'Works but panics at runtime for strings',
              'Works only for integers',
            ],
            answerIndex: 0,
          },
          hints: ['What operations does the comparable type set guarantee?'],
          solution: 'Compile error — `comparable` permits == and != only. Use `cmp.Ordered`.',
          explanation: 'comparable includes structs, pointers, channels and interfaces, which have no ordering. cmp.Ordered is ~int | ~int8 | … | ~float64 | ~string.',
        },
        {
          id: 'm12-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Generic Set',
          story: 'Different services need sets of user IDs (int64), SKUs (string) and coordinates ([2]int).',
          prompt: 'Implement `type Set[T comparable] map[T]struct{}` with `Add`, `Has`, `Remove`, `Len`, `Union(other Set[T]) Set[T]`, `Intersect`. Add a constructor `NewSet[T comparable](items ...T) Set[T]`.',
          hints: ['Methods on a generic type use the type parameter in the receiver: `func (s Set[T]) Has(v T) bool`.', 'For Intersect iterate over the smaller set.'],
          solution: `type Set[T comparable] map[T]struct{}

func NewSet[T comparable](items ...T) Set[T] {
	s := make(Set[T], len(items))
	for _, it := range items {
		s.Add(it)
	}
	return s
}

func (s Set[T]) Add(v T)         { s[v] = struct{}{} }
func (s Set[T]) Remove(v T)      { delete(s, v) }
func (s Set[T]) Has(v T) bool    { _, ok := s[v]; return ok }
func (s Set[T]) Len() int        { return len(s) }

func (s Set[T]) Union(o Set[T]) Set[T] {
	out := make(Set[T], len(s)+len(o))
	for v := range s {
		out.Add(v)
	}
	for v := range o {
		out.Add(v)
	}
	return out
}

func (s Set[T]) Intersect(o Set[T]) Set[T] {
	small, big := s, o
	if len(big) < len(small) {
		small, big = big, small
	}
	out := make(Set[T])
	for v := range small {
		if big.Has(v) {
			out.Add(v)
		}
	}
	return out
}`,
          explanation: 'A map with empty-struct values uses no memory per value. Intersecting from the smaller set gives O(min(n, m)).',
          complexity: { time: 'Add/Has/Remove O(1) avg; Union O(n+m); Intersect O(min(n,m))', space: 'O(n)' },
          variation: 'Add `Items() []T` that returns elements sorted when T is cmp.Ordered — can you express that with a method? (Hint: methods cannot add constraints; write a function.)',
        },
        {
          id: 'm12-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Generic LRU-friendly Cache with TTL',
          story: 'A recommendation service caches results of type []Product keyed by userID, and another caches string → *Profile.',
          prompt: 'Write `type Cache[K comparable, V any]` with `Set(k K, v V, ttl time.Duration)`, `Get(k K) (V, bool)` that returns the zero V and false for missing OR expired entries, safe for concurrent use. Use an injectable clock `now func() time.Time` for testing.',
          hints: ['Store `entry[V]{val V; exp time.Time}`.', 'Return `var zero V` for misses.'],
          solution: `type entry[V any] struct {
	val V
	exp time.Time
}

type Cache[K comparable, V any] struct {
	mu   sync.RWMutex
	data map[K]entry[V]
	now  func() time.Time
}

func NewCache[K comparable, V any](now func() time.Time) *Cache[K, V] {
	if now == nil {
		now = time.Now
	}
	return &Cache[K, V]{data: make(map[K]entry[V]), now: now}
}

func (c *Cache[K, V]) Set(k K, v V, ttl time.Duration) {
	c.mu.Lock()
	c.data[k] = entry[V]{v, c.now().Add(ttl)}
	c.mu.Unlock()
}

func (c *Cache[K, V]) Get(k K) (V, bool) {
	c.mu.RLock()
	e, ok := c.data[k]
	c.mu.RUnlock()
	if !ok || c.now().After(e.exp) {
		var zero V
		return zero, false
	}
	return e.val, true
}`,
          explanation: 'Generic types carry their parameters through methods. Expired entries are treated as misses lazily; a background sweeper (or deleting on Get under a write lock) reclaims memory.',
          complexity: { time: 'O(1) avg', space: 'O(entries)' },
          variation: 'Add a max size with LRU eviction (container/list + map) — see the Production LRU problem.',
        },
      ],
    },
    {
      id: 'm12-t2',
      title: 'Type Sets, ~ Approximation, Unions and Generic Data Structures',
      summary: 'Constraints as sets of types, and building containers.',
      concept: [
        'A constraint interface defines a TYPE SET. `int | string` is the union of exactly those types. `~int` means "every type whose underlying type is int" (so `type UserID int` is included).',
        'Constraints with type sets (unions or ~) can only be used as constraints, not as ordinary variable types.',
        'Operators are allowed on T only if every type in the set supports them: `+` on `~int | ~string` is fine (both support +), `<` on `~int | ~[]byte` is not.',
        'Generic data structures declare parameters on the type: `type Stack[T any] struct { items []T }`. Methods cannot declare their own extra type parameters.',
      ],
      why: 'Type sets let library authors accept user-defined named types (Celsius, UserID) without losing operator support.',
      whenToUse: ['~ in numeric constraints so named numeric types work', 'Generic containers: Stack, Queue, Heap, Tree'],
      whenNotToUse: ['Union constraints that end up needing a type switch inside.'],
      syntax: `type Integer interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

type Stack[T any] struct{ items []T }
func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(s.items) == 0 { return zero, false }
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v, true
}`,
      example: {
        code: `package main

import "fmt"

type Integer interface{ ~int | ~int64 }

type UserID int64

func SumAll[T Integer](xs ...T) T {
	var t T
	for _, x := range xs {
		t += x
	}
	return t
}

func main() {
	fmt.Println(SumAll(1, 2, 3))
	fmt.Println(SumAll(UserID(10), UserID(20)))
}`,
        output: `6
30`,
        notes: ['UserID is accepted because its underlying type is int64 and the constraint uses ~int64.', 'Without ~, only exactly int or int64 would be allowed.'],
      },
      mistakes: ['Forgetting ~ and rejecting named types.', 'Trying to use a union constraint as a variable type.', 'Trying to add type parameters to a method.'],
      problems: [
        {
          id: 'm12-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Which calls compile?',
          prompt: 'Given `type Num interface{ int | float64 }` and `func Double[T Num](x T) T { return x * 2 }`, which call fails?',
          code: `type Meters float64
Double(3)          // A
Double(2.5)        // B
Double(Meters(4))  // C
Double[float64](1) // D`,
          check: { options: ['C', 'B', 'D', 'none'], answerIndex: 0 },
          hints: ['Is Meters in the type set {int, float64}?'],
          solution: '**C** fails.',
          explanation: 'Meters’ underlying type is float64, but the constraint lists exactly float64, not ~float64. Change to `~int | ~float64` to accept it.',
        },
        {
          id: 'm12-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Generic min-heap',
          story: 'A scheduler needs priority queues of jobs, of timestamps and of distances — one implementation.',
          prompt: 'Implement `type Heap[T any] struct` with a less function: `NewHeap[T any](less func(a, b T) bool) *Heap[T]`, `Push(T)`, `Pop() (T, bool)`, `Peek() (T, bool)`, `Len() int`. No container/heap.',
          hints: ['Push: append, then sift up while less(child, parent).', 'Pop: swap root with last, shrink, sift down choosing the smaller child.'],
          solution: `type Heap[T any] struct {
	items []T
	less  func(a, b T) bool
}

func NewHeap[T any](less func(a, b T) bool) *Heap[T] { return &Heap[T]{less: less} }

func (h *Heap[T]) Len() int { return len(h.items) }

func (h *Heap[T]) Push(v T) {
	h.items = append(h.items, v)
	i := len(h.items) - 1
	for i > 0 {
		p := (i - 1) / 2
		if !h.less(h.items[i], h.items[p]) {
			break
		}
		h.items[i], h.items[p] = h.items[p], h.items[i]
		i = p
	}
}

func (h *Heap[T]) Peek() (T, bool) {
	var zero T
	if len(h.items) == 0 {
		return zero, false
	}
	return h.items[0], true
}

func (h *Heap[T]) Pop() (T, bool) {
	var zero T
	n := len(h.items)
	if n == 0 {
		return zero, false
	}
	top := h.items[0]
	h.items[0] = h.items[n-1]
	h.items[n-1] = zero // release reference for GC
	h.items = h.items[:n-1]
	i, n := 0, n-1
	for {
		l, r, m := 2*i+1, 2*i+2, i
		if l < n && h.less(h.items[l], h.items[m]) {
			m = l
		}
		if r < n && h.less(h.items[r], h.items[m]) {
			m = r
		}
		if m == i {
			break
		}
		h.items[i], h.items[m] = h.items[m], h.items[i]
		i = m
	}
	return top, true
}`,
          explanation: 'Array-backed binary heap: parent (i−1)/2, children 2i+1 and 2i+2. A less func (rather than cmp.Ordered) lets you order structs by any field.',
          complexity: { time: 'Push/Pop O(log n), Peek O(1)', space: 'O(n)' },
          variation: 'Add `Fix(i int)` / `Remove(i int)` so priorities can change (needed for Dijkstra with decrease-key).',
        },
        {
          id: 'm12-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'concept',
          title: 'Generics vs interfaces',
          prompt: 'You need a function that writes any value to a log in its String() form. Should it be `func Log[T fmt.Stringer](v T)` or `func Log(v fmt.Stringer)`? When does the generic version actually win?',
          hints: ['Does the function need to return or store the concrete T?'],
          solution: 'Use the plain interface `func Log(v fmt.Stringer)`. The generic version adds nothing: the body only calls a method. Generics win when the concrete type must be preserved in the API (return T, []T, map[K]V), when you need operators (+, <) via type sets, or when avoiding interface boxing in a hot path measurably matters.',
          explanation: '"Write code, don’t design types" — reach for generics when you find yourself writing the same code for different types or losing type information.',
        },
      ],
    },
  ],
}

export const MODULE_13: Module = {
  id: 'm13',
  number: 13,
  track: 'go',
  title: 'Reflection',
  shortTitle: 'Reflection',
  tagline: 'reflect.Type and reflect.Value, struct tags, setting values, and why reflection should be your last resort.',
  topics: [
    {
      id: 'm13-t1',
      title: 'reflect.Type, reflect.Value, Struct Tags and Limits',
      summary: 'How encoding/json works under the hood.',
      concept: [
        '`reflect.TypeOf(x)` returns a Type (name, Kind, fields, methods). `reflect.ValueOf(x)` returns a Value holding the data. Kind is the underlying category (Struct, Ptr, Slice…); Type is the exact type.',
        'Struct tags are string metadata on fields: `json:"name,omitempty"`. Read them with `field.Tag.Get("json")`.',
        'To modify via reflection you need an addressable Value: pass a pointer and call `.Elem()`. `v.CanSet()` is false for unexported fields and for copies.',
        'Reflection is slow (allocations, no inlining), bypasses compile-time checks (errors become panics) and is hard to read. Use it for generic infrastructure (encoders, ORMs, validators), not business logic.',
      ],
      why: 'Some libraries must handle types they have never seen — JSON encoding, config loading, validation by tags.',
      whenToUse: ['Encoding/decoding libraries', 'Tag-driven validation or config binding', 'Debugging/diagnostic tools'],
      whenNotToUse: ['When generics or an interface would work.', 'Hot paths.', 'To access unexported fields of other packages.'],
      syntax: `t := reflect.TypeOf(u)
for i := 0; i < t.NumField(); i++ {
	f := t.Field(i)
	fmt.Println(f.Name, f.Type, f.Tag.Get("json"))
}
v := reflect.ValueOf(&u).Elem()
v.FieldByName("Name").SetString("new")`,
      example: {
        code: `package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Name  string \`json:"name" validate:"required"\`
	Age   int    \`json:"age"\`
	email string
}

func main() {
	u := User{Name: "Ana", Age: 30}
	t := reflect.TypeOf(u)
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		fmt.Printf("%s %s json=%q exported=%v\\n", f.Name, f.Type.Kind(), f.Tag.Get("json"), f.IsExported())
	}
	v := reflect.ValueOf(&u).Elem()
	v.FieldByName("Age").SetInt(31)
	fmt.Println(u.Age, v.FieldByName("email").CanSet())
}`,
        output: `Name string json="name" exported=true
Age int json="age" exported=true
email string json="" exported=false
31 false`,
        notes: ['Iterating the Type gives fields and tags.', 'Elem() of a pointer Value is addressable, so SetInt works.', 'Unexported fields can be read in limited ways but never set.'],
      },
      mistakes: ['Calling Set on a non-addressable Value → panic "reflect: reflect.Value.SetInt using unaddressable value".', 'Confusing Kind with Type.', 'Forgetting that ValueOf(nil) is the zero Value (IsValid false).'],
      problems: [
        {
          id: 'm13-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'Type vs Kind',
          prompt: 'What does this print?',
          code: `package main

import (
	"fmt"
	"reflect"
)

type Celsius float64

func main() {
	var c Celsius = 21.5
	t := reflect.TypeOf(c)
	fmt.Println(t.Name(), t.Kind())
	p := &c
	fmt.Println(reflect.TypeOf(p).Kind(), reflect.TypeOf(p).Elem().Name())
}`,
          check: { options: ['Celsius float64\nptr Celsius', 'float64 float64\nptr float64', 'Celsius Celsius\n*Celsius Celsius', 'main.Celsius float64\npointer Celsius'], answerIndex: 0 },
          hints: ['Name is the declared type name; Kind is the underlying category.', 'reflect.Ptr prints as "ptr".'],
          solution: '```text\nCelsius float64\nptr Celsius\n```',
          explanation: 'Name() of a named type is its unqualified name. Kind of a pointer prints "ptr"; Elem() gives the pointed-to type.',
        },
        {
          id: 'm13-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Tag-based validator',
          story: 'A booking API wants `validate:"required"` and `validate:"min=1"` tags on request structs.',
          prompt: 'Write `Validate(v any) []string` that accepts a struct or pointer to struct and returns messages for: string fields tagged required that are empty, and int fields tagged `min=N` below N.',
          hints: ['Use `reflect.Indirect(reflect.ValueOf(v))` to handle pointers.', 'Parse `min=` with strings.CutPrefix and strconv.Atoi.'],
          solution: `func Validate(v any) []string {
	rv := reflect.Indirect(reflect.ValueOf(v))
	if rv.Kind() != reflect.Struct {
		return []string{"not a struct"}
	}
	rt := rv.Type()
	var errs []string
	for i := 0; i < rt.NumField(); i++ {
		f := rt.Field(i)
		tag := f.Tag.Get("validate")
		if tag == "" || !f.IsExported() {
			continue
		}
		fv := rv.Field(i)
		for _, rule := range strings.Split(tag, ",") {
			switch {
			case rule == "required" && fv.Kind() == reflect.String && fv.String() == "":
				errs = append(errs, f.Name+" is required")
			case strings.HasPrefix(rule, "min="):
				n, err := strconv.Atoi(strings.TrimPrefix(rule, "min="))
				if err == nil && fv.CanInt() && fv.Int() < int64(n) {
					errs = append(errs, fmt.Sprintf("%s must be >= %d", f.Name, n))
				}
			}
		}
	}
	return errs
}`,
          explanation: 'Reflection reads tags and values generically. Parsing tags per call is slow; production validators cache per-type rule lists in a sync.Map keyed by reflect.Type.',
          complexity: { time: 'O(fields × rules)', space: 'O(errors)' },
          variation: 'Cache the parsed rules per reflect.Type and benchmark the speed-up.',
        },
        {
          id: 'm13-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'debug',
          title: 'reflect.Value.Set panic',
          prompt: 'Why does this panic and how do you fix it?',
          code: `func reset(x any) {
	v := reflect.ValueOf(x)
	v.Set(reflect.Zero(v.Type()))
}

func main() {
	n := 42
	reset(n)
}`,
          hints: ['Is the Value addressable?'],
          solution: 'Panics: "reflect: reflect.Value.Set using unaddressable value". ValueOf(n) wraps a COPY of n stored in the interface — setting it could never affect the caller.\n\nFix: pass a pointer and use Elem:\n\n```go\nfunc reset(x any) {\n\tv := reflect.ValueOf(x)\n\tif v.Kind() != reflect.Pointer || v.IsNil() {\n\t\tpanic("reset needs a non-nil pointer")\n\t}\n\te := v.Elem()\n\te.Set(reflect.Zero(e.Type()))\n}\nreset(&n)\n```\n\n(With generics: `func reset[T any](p *T) { var zero T; *p = zero }` — no reflection needed.)',
          explanation: 'Same rule as normal Go: you can only modify what you have a pointer to.',
        },
      ],
    },
  ],
}
