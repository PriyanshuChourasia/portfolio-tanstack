import type { Module } from '../types'

export const MODULE_03: Module = {
  id: 'm03',
  number: 3,
  track: 'go',
  title: 'Functions',
  shortTitle: 'Functions',
  tagline: 'Multiple and named returns, variadics, closures, recursion and the stack, defer/panic/recover.',
  topics: [
    {
      id: 'm03-t1',
      title: 'Declarations, Multiple & Named Returns, Variadic Functions',
      summary: 'The (value, error) convention, naked returns, and how ...T really works.',
      concept: [
        'A function declares parameter and result types: `func div(a, b int) (int, error)`. Consecutive params of the same type can share it.',
        'Multiple results are idiomatic for returning a value plus an error or ok flag. Named results (`func f() (n int, err error)`) are pre-declared zero-valued variables; a bare `return` returns their current values.',
        'A variadic parameter `nums ...int` is received as a `[]int`. Callers pass individual values or spread a slice with `f(s...)` — spreading passes the SAME backing array, not a copy.',
      ],
      why: 'Multiple returns make errors explicit values instead of exceptions; variadics give printf-style APIs without overloading.',
      whenToUse: ['`(T, error)` for anything that can fail', 'Named results for documentation or when a deferred func must modify the result', 'Variadic for optional lists (`append`, `fmt.Println`, functional options)'],
      whenNotToUse: ['Naked returns in long functions — they hurt readability.', 'More than 3 results — return a struct.'],
      syntax: `func divmod(a, b int) (q, r int) {
	q, r = a/b, a%b
	return
}

func sum(nums ...int) int {
	t := 0
	for _, n := range nums { t += n }
	return t
}

sum()            // 0
sum(1, 2, 3)     // 6
xs := []int{4, 5}
sum(xs...)       // 9`,
      example: {
        code: `package main

import "fmt"

func bump(nums ...int) {
	for i := range nums {
		nums[i]++
	}
}

func main() {
	xs := []int{1, 2, 3}
	bump(xs...)
	fmt.Println(xs)
	bump(xs[0], xs[1])
	fmt.Println(xs)
}`,
        output: `[2 3 4]
[2 3 4]`,
        notes: ['`xs...` passes xs itself as the variadic slice — the function mutates the caller’s data.', 'Passing individual values builds a NEW slice, so the caller is unaffected.'],
      },
      mistakes: ['Ignoring the error result with `_` in production code.', 'Assuming `f(s...)` copies s.', 'Shadowing a named result inside an inner block and then using a bare return (compile error "result parameter shadowed").'],
      problems: [
        {
          id: 'm03-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Named results and bare return',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}

func main() {
	a, b := split(17)
	fmt.Println(a, b)
}`,
          check: { options: ['7 10', '0 0', '7.5 9.5', '8 9'], answerIndex: 0 },
          hints: ['Integer arithmetic, left to right: (17*4)/9.'],
          solution: '`7 10`',
          explanation: '17*4 = 68, 68/9 = 7 (integer division). y = 17 − 7 = 10. The bare return returns the named results.',
        },
        {
          id: 'm03-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Parse a transaction line',
          story: 'A bank ingests CSV lines like `TX123,deposit,250.50`. Bad lines must not crash the batch.',
          prompt: 'Write `ParseTx(line string) (id string, kind string, amount float64, err error)`. Validate 3 fields, kind ∈ {deposit, withdrawal}, amount > 0. Wrap strconv errors with context using `%w`.',
          hints: ['`strings.Split(line, ",")` and check `len(parts) != 3`.', '`strconv.ParseFloat(parts[2], 64)` returns an error you can wrap: `fmt.Errorf("amount %q: %w", parts[2], err)`.'],
          solution: `func ParseTx(line string) (id, kind string, amount float64, err error) {
	parts := strings.Split(strings.TrimSpace(line), ",")
	if len(parts) != 3 {
		return "", "", 0, fmt.Errorf("want 3 fields, got %d", len(parts))
	}
	id, kind = parts[0], parts[1]
	if kind != "deposit" && kind != "withdrawal" {
		return "", "", 0, fmt.Errorf("unknown kind %q", kind)
	}
	amount, err = strconv.ParseFloat(parts[2], 64)
	if err != nil {
		return "", "", 0, fmt.Errorf("amount %q: %w", parts[2], err)
	}
	if amount <= 0 {
		return "", "", 0, fmt.Errorf("amount must be positive, got %v", amount)
	}
	return id, kind, amount, nil
}`,
          explanation: 'Every failure path returns zero values plus a descriptive error; success returns nil error. Wrapping with %w keeps `errors.Is(err, strconv.ErrSyntax)` working.',
          complexity: { time: 'O(len(line))', space: 'O(fields)' },
          variation: 'Return a `Tx` struct and a typed `*ParseError{Line int; Field string; Err error}` so the batch can report line numbers.',
        },
        {
          id: 'm03-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Functional options',
          story: 'Your HTTP client constructor has grown 9 parameters, most with defaults.',
          prompt: 'Implement `NewClient(baseURL string, opts ...Option) *Client` with options `WithTimeout(d time.Duration)`, `WithRetries(n int)`, `WithHeader(k, v string)`. Defaults: 10s, 3 retries, no headers.',
          hints: ['`type Option func(*Client)`.', 'Set defaults on the struct first, then `for _, opt := range opts { opt(c) }`.'],
          solution: `type Client struct {
	baseURL string
	timeout time.Duration
	retries int
	headers map[string]string
}

type Option func(*Client)

func WithTimeout(d time.Duration) Option { return func(c *Client) { c.timeout = d } }
func WithRetries(n int) Option         { return func(c *Client) { c.retries = n } }
func WithHeader(k, v string) Option {
	return func(c *Client) { c.headers[k] = v }
}

func NewClient(baseURL string, opts ...Option) *Client {
	c := &Client{baseURL: baseURL, timeout: 10 * time.Second, retries: 3, headers: map[string]string{}}
	for _, opt := range opts {
		opt(c)
	}
	return c
}`,
          explanation: 'Variadic closures give named, optional, order-independent configuration with backward-compatible growth. The map is created before options run so WithHeader can write to it.',
          complexity: { time: 'O(options)', space: 'O(headers)' },
          variation: 'Make options able to fail (`type Option func(*Client) error`) and return the first error from NewClient.',
        },
      ],
    },
    {
      id: 'm03-t2',
      title: 'Function Values, Higher-Order Functions and Closures',
      summary: 'Functions are values; closures capture variables, not values.',
      concept: [
        'Functions are first-class: they can be assigned (`f := strings.ToUpper`), passed and returned. The zero value of a func type is nil; calling it panics.',
        'An anonymous function literal can reference variables from the enclosing scope — it is a closure. It captures the VARIABLE (by reference), so later changes are visible, and the variable lives as long as the closure (it escapes to the heap).',
        'Higher-order functions take or return functions: `slices.SortFunc(s, cmp)`, middleware `func(http.Handler) http.Handler`.',
      ],
      why: 'Closures let you package behaviour with state (counters, middleware, retry policies) without defining a type.',
      whenToUse: ['Callbacks and comparators', 'Middleware and decorators', 'Generators/iterators with private state'],
      whenNotToUse: ['When the state needs several operations — a struct with methods is clearer.', 'Capturing a loop variable in a goroutine on Go < 1.22.'],
      syntax: `type Op func(int, int) int

func apply(a, b int, op Op) int { return op(a, b) }

add := func(a, b int) int { return a + b }
apply(2, 3, add)

func counter() func() int {
	n := 0
	return func() int { n++; return n }
}`,
      example: {
        code: `package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	a, b := counter(), counter()
	fmt.Println(a(), a(), b(), a())
}`,
        output: `1 2 1 3`,
        notes: ['Each call to counter creates a new n.', 'a’s closure keeps its own n alive across calls (heap-allocated).', 'b is independent.'],
      },
      mistakes: ['Calling a nil func variable.', 'Expecting a closure to snapshot a value.', 'Comparing funcs with `==` (only comparison with nil is allowed).'],
      problems: [
        {
          id: 'm03-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Capture by reference',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	x := 1
	show := func() { fmt.Print(x, " ") }
	x = 2
	show()
	x++
	show()
}`,
          check: { options: ['2 3 ', '1 1 ', '1 2 ', '2 2 '], answerIndex: 0 },
          hints: ['Does the closure copy x when it is created?'],
          solution: '`2 3 `',
          explanation: 'The closure refers to the variable x itself. At each call it reads the current value.',
        },
        {
          id: 'm03-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Generic Map / Filter / Reduce',
          story: 'An e-commerce report must compute total revenue of orders over ₹500.',
          prompt: 'Write generic `Map[T, U any](s []T, f func(T) U) []U`, `Filter[T any](s []T, keep func(T) bool) []T`, `Reduce[T, A any](s []T, init A, f func(A, T) A) A`. Use them to sum `Amount` of orders > 500.',
          hints: ['Pre-size Map’s output with `make([]U, 0, len(s))`.', 'Filter can reuse capacity but beware of aliasing the input — allocate a new slice.'],
          solution: `func Map[T, U any](s []T, f func(T) U) []U {
	out := make([]U, 0, len(s))
	for _, v := range s {
		out = append(out, f(v))
	}
	return out
}

func Filter[T any](s []T, keep func(T) bool) []T {
	var out []T
	for _, v := range s {
		if keep(v) {
			out = append(out, v)
		}
	}
	return out
}

func Reduce[T, A any](s []T, init A, f func(A, T) A) A {
	acc := init
	for _, v := range s {
		acc = f(acc, v)
	}
	return acc
}

type Order struct{ Amount float64 }

func BigRevenue(orders []Order) float64 {
	big := Filter(orders, func(o Order) bool { return o.Amount > 500 })
	return Reduce(big, 0.0, func(acc float64, o Order) float64 { return acc + o.Amount })
}`,
          explanation: 'Higher-order functions separate iteration from logic. In idiomatic Go a plain loop is often clearer — use these when composition genuinely helps.',
          complexity: { time: 'O(n) each', space: 'O(n) for Map/Filter outputs' },
          variation: 'Write a lazy `iter.Seq[T]` version (Go 1.23 range-over-func) that filters without allocating an intermediate slice.',
        },
        {
          id: 'm03-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Logging + timing middleware',
          story: 'Every handler in an API needs request logging and latency measurement.',
          prompt: 'Write `Logging(next http.HandlerFunc) http.HandlerFunc` and `Timing(next http.HandlerFunc) http.HandlerFunc` and a `Chain(h http.HandlerFunc, m ...func(http.HandlerFunc) http.HandlerFunc) http.HandlerFunc` that applies middleware so the FIRST listed is the OUTERMOST.',
          hints: ['Each middleware returns a closure that does work, calls next, then does more work.', 'To make the first one outermost, wrap in reverse order.'],
          solution: `type Middleware func(http.HandlerFunc) http.HandlerFunc

func Logging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("-> %s %s", r.Method, r.URL.Path)
		next(w, r)
	}
}

func Timing(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next(w, r)
		log.Printf("%s took %v", r.URL.Path, time.Since(start))
	}
}

func Chain(h http.HandlerFunc, m ...Middleware) http.HandlerFunc {
	for i := len(m) - 1; i >= 0; i-- {
		h = m[i](h)
	}
	return h
}`,
          explanation: 'Wrapping from the last middleware to the first leaves m[0] as the outermost closure, so it runs first on the way in and last on the way out.',
          complexity: { time: 'O(m) to build; O(m) per request', space: 'O(m) closures' },
          variation: 'Add a `Recover` middleware that converts panics into HTTP 500 and logs the stack (`debug.Stack()`).',
        },
      ],
    },
    {
      id: 'm03-t3',
      title: 'Recursion and the Call Stack',
      summary: 'Base case, recursive case, stack frames, and when recursion is the wrong tool.',
      concept: [
        'A recursive function calls itself on a smaller input until it hits a base case. Each call pushes a stack frame (params, locals, return address).',
        'Goroutine stacks start small (a few KB) and grow dynamically up to a max (1 GB on 64-bit by default), so Go handles deep recursion better than C — but infinite recursion still ends in `fatal error: stack overflow`.',
        'Go has no tail-call optimisation. Recursion depth = memory. Convert deep linear recursion into loops or an explicit stack.',
      ],
      why: 'Recursion mirrors recursive data (trees, nested JSON, file systems) and divide-and-conquer algorithms, making them short and provably correct.',
      whenToUse: ['Trees and graphs (DFS)', 'Divide and conquer (merge sort, quick sort)', 'Backtracking'],
      whenNotToUse: ['Linear problems with huge depth (sum of 10M numbers).', 'Overlapping sub-problems without memoisation (naive Fibonacci is O(2ⁿ)).'],
      syntax: `func fact(n int) int {
	if n <= 1 { // base case
		return 1
	}
	return n * fact(n-1) // recursive case
}`,
      example: {
        code: `package main

import "fmt"

func countdown(n int) {
	if n == 0 {
		fmt.Println("go!")
		return
	}
	fmt.Println("push", n)
	countdown(n - 1)
	fmt.Println("pop", n)
}

func main() { countdown(2) }`,
        output: `push 2
push 1
go!
pop 1
pop 2`,
        notes: ['Code before the recursive call runs on the way down.', 'Code after it runs as frames unwind, in reverse order.'],
      },
      mistakes: ['Missing or unreachable base case.', 'Not shrinking the input (e.g. passing n instead of n-1).', 'Recomputing identical sub-problems.'],
      problems: [
        {
          id: 'm03-t3-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Trace the recursion',
          prompt: 'What does `f(3)` print?',
          code: `package main

import "fmt"

func f(n int) {
	if n == 0 {
		return
	}
	f(n - 1)
	fmt.Print(n)
	f(n - 1)
}

func main() { f(3) }`,
          check: { options: ['1213121', '3212', '123', '1121312'], answerIndex: 0 },
          hints: ['Write f(1) first, then f(2) = f(1) "2" f(1), then f(3).'],
          solution: '`1213121`',
          explanation: 'f(1) = "1". f(2) = f(1)+"2"+f(1) = "121". f(3) = "121"+"3"+"121". This is the Tower-of-Hanoi call pattern: 2ⁿ−1 prints.',
        },
        {
          id: 'm03-t3-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Total size of a folder tree',
          story: 'A cloud storage service bills by folder size. Folders contain files and sub-folders.',
          prompt: 'Given `type Node struct { Name string; Size int64; Children []*Node }` (files have no children, folders have Size 0), write recursive `TotalSize(n *Node) int64` and `MaxDepth(n *Node) int`. Handle nil.',
          hints: ['Base case: nil → 0.', 'Size = own size + sum of children sizes; Depth = 1 + max child depth.'],
          solution: `func TotalSize(n *Node) int64 {
	if n == nil {
		return 0
	}
	total := n.Size
	for _, c := range n.Children {
		total += TotalSize(c)
	}
	return total
}

func MaxDepth(n *Node) int {
	if n == nil {
		return 0
	}
	best := 0
	for _, c := range n.Children {
		best = max(best, MaxDepth(c))
	}
	return best + 1
}`,
          explanation: 'Each node is visited once; the recursion depth equals the tree height.',
          complexity: { time: 'O(N) nodes', space: 'O(H) stack, H = height', worst: 'O(N) stack for a degenerate chain' },
          variation: 'Rewrite TotalSize iteratively with an explicit stack ([]*Node) so a 1-million-deep chain cannot blow the stack.',
        },
        {
          id: 'm03-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Fast exponentiation',
          prompt: 'Write `Pow(base, exp, mod int64) int64` computing base^exp mod m in O(log exp) using recursion. Then explain the recursion depth and why naive recursion `base * Pow(base, exp-1)` is a bad idea for exp = 10¹⁸.',
          hints: ['x^n = (x^(n/2))² when n is even; x · x^(n−1) when odd.', 'Take `% mod` after each multiplication to avoid overflow (assume mod < 3·10⁹).'],
          solution: `func Pow(base, exp, mod int64) int64 {
	if exp == 0 {
		return 1 % mod
	}
	half := Pow(base, exp/2, mod)
	res := half * half % mod
	if exp%2 == 1 {
		res = res * (base % mod) % mod
	}
	return res
}`,
          explanation: 'Each call halves exp, so depth is ⌊log₂ exp⌋+1 ≈ 60 for 10¹⁸. The naive version recurses 10¹⁸ times — impossible in time and stack.',
          complexity: { time: 'O(log exp)', space: 'O(log exp) stack' },
          variation: 'Make it iterative (binary exponentiation by scanning bits) and handle mod up to 10¹⁸ using `math/bits.Mul64`.',
        },
      ],
    },
    {
      id: 'm03-t4',
      title: 'defer, panic and recover',
      summary: 'LIFO cleanup, argument evaluation time, and turning panics into errors.',
      concept: [
        '`defer f(args)` schedules f to run when the surrounding function returns (normally or by panic). Deferred calls run in LIFO order. The ARGUMENTS are evaluated immediately at the defer statement; the call happens later.',
        'Deferred closures can read and modify named results — the classic way to annotate or replace a returned error.',
        '`panic(v)` stops normal execution, runs deferred calls of each frame while unwinding, and crashes the program if not recovered. `recover()` returns the panic value only when called directly inside a deferred function; otherwise it returns nil.',
      ],
      why: 'defer keeps cleanup next to acquisition (open/close, lock/unlock), so every return path is covered. panic/recover handles truly exceptional states and protects servers from one bad request.',
      whenToUse: ['Closing files, unlocking mutexes, ending spans', 'Recovering in a goroutine or HTTP handler boundary', 'Modifying named results on the way out'],
      whenNotToUse: ['panic for expected errors (bad input, not found) — return an error.', 'defer inside a long loop — defers pile up until the function returns.'],
      syntax: `f, err := os.Open(name)
if err != nil { return err }
defer f.Close()

defer func() {
	if r := recover(); r != nil {
		err = fmt.Errorf("recovered: %v", r)
	}
}()`,
      example: {
        code: `package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		defer fmt.Print(i, " ")
	}
	x := 10
	defer fmt.Println("deferred x =", x)
	x = 20
	fmt.Println("x =", x)
}`,
        output: `x = 20
deferred x = 10
2 1 0 `,
        notes: ['Arguments are evaluated at defer time: x was 10.', 'Defers run LIFO: the Println registered last runs first, then 2, 1, 0.'],
      },
      mistakes: ['`defer f.Close()` before checking the Open error (f is nil).', 'Calling recover() outside a deferred function — always nil.', 'Ignoring the error from Close on writable files.'],
      problems: [
        {
          id: 'm03-t4-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'defer modifies the result',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func a() (n int) {
	defer func() { n *= 2 }()
	n = 3
	return n + 1
}

func b() int {
	n := 3
	defer func() { n *= 2 }()
	return n + 1
}

func main() { fmt.Println(a(), b()) }`,
          check: { options: ['8 4', '4 4', '8 8', '6 4'], answerIndex: 0 },
          hints: ['`return expr` first assigns to the result variable, THEN deferred funcs run.', 'In b the result is unnamed; the closure modifies a local, not the result.'],
          solution: '`8 4`',
          explanation: 'a: return sets n = 4, defer doubles n to 8, function returns 8. b: return copies 4 into an unnamed result; the defer doubles local n (to 6), which no longer matters.',
        },
        {
          id: 'm03-t4-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Safe job runner',
          story: 'A job queue runs user-supplied plugins. One panicking plugin must not take down the worker.',
          prompt: 'Write `SafeRun(job func() error) (err error)` that returns the job’s error, or converts a panic into an error containing the panic value. Then write a version that also captures the stack trace.',
          hints: ['Named result + deferred closure with recover().', '`runtime/debug.Stack()` returns the current goroutine’s stack as []byte.'],
          solution: `func SafeRun(job func() error) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("job panicked: %v\\n%s", r, debug.Stack())
		}
	}()
	return job()
}`,
          explanation: 'If job panics, the deferred closure runs during unwinding, recover stops the panic and assigns the named result. Note: recover only catches panics in the SAME goroutine — a goroutine started inside job that panics still crashes the process.',
          complexity: { time: 'O(1) overhead', space: 'O(stack size) when panicking' },
          variation: 'Add a timeout: run the job in a goroutine and return `context.DeadlineExceeded` if it runs longer than d. What happens to the leaked goroutine?',
        },
        {
          id: 'm03-t4-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'File handle leak',
          story: 'A log rotator processes 50,000 files and dies with "too many open files".',
          prompt: 'Find the bug and fix it.',
          code: `func process(paths []string) error {
	for _, p := range paths {
		f, err := os.Open(p)
		if err != nil {
			return err
		}
		defer f.Close()
		if err := scan(f); err != nil {
			return err
		}
	}
	return nil
}`,
          hints: ['When do deferred calls run?'],
          solution: 'Deferred calls run when `process` returns, not at the end of each iteration — all 50,000 files stay open.\n\nFix: move the body into a function so each defer runs per file.\n\n```go\nfunc processOne(p string) error {\n\tf, err := os.Open(p)\n\tif err != nil { return err }\n\tdefer f.Close()\n\treturn scan(f)\n}\n\nfunc process(paths []string) error {\n\tfor _, p := range paths {\n\t\tif err := processOne(p); err != nil {\n\t\t\treturn fmt.Errorf("%s: %w", p, err)\n\t\t}\n\t}\n\treturn nil\n}\n```',
          explanation: 'defer is function-scoped, not block-scoped.',
        },
        {
          id: 'm03-t4-p4',
          tier: 'advanced',
          level: 4,
          kind: 'predict',
          title: 'Panic, defer order and re-panic',
          prompt: 'What does this print (stdout only)?',
          code: `package main

import "fmt"

func main() {
	defer fmt.Println("1")
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("recovered:", r)
		}
	}()
	defer fmt.Println("2")
	panic("boom")
	fmt.Println("3")
}`,
          check: { options: ['2\nrecovered: boom\n1', '3\n2\n1', '1\n2\nrecovered: boom', '2\n1\npanic: boom'], answerIndex: 0 },
          hints: ['Code after panic never runs.', 'Defers still run in LIFO order during the panic.'],
          solution: '```text\n2\nrecovered: boom\n1\n```',
          explanation: 'panic unwinds: last defer ("2") runs first, then the recovering closure stops the panic, then "1". main then returns normally (exit code 0).',
        },
      ],
    },
  ],
}
