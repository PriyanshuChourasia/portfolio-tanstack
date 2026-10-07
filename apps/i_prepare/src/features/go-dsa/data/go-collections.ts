import type { Module } from '../types'

export const MODULE_04: Module = {
  id: 'm04',
  number: 4,
  track: 'go',
  title: 'Arrays and Slices',
  shortTitle: 'Slices',
  tagline: 'Value-semantics arrays, slice headers, len vs cap, append reallocation and shared backing arrays.',
  topics: [
    {
      id: 'm04-t1',
      title: 'Arrays and Value Semantics',
      summary: 'Fixed size is part of the type, and assignment copies everything.',
      concept: [
        'An array has a fixed length that is part of its type: `[3]int` and `[4]int` are different types. `len(a)` is a compile-time constant.',
        'Arrays are VALUES: assigning or passing an array copies every element. Arrays of comparable elements are themselves comparable with `==` and can be map keys.',
        'Multidimensional arrays are arrays of arrays: `var grid [3][4]int`. `[...]int{1, 2, 3}` lets the compiler count the length.',
      ],
      why: 'Fixed-size values are cheap to allocate on the stack and perfect as map keys (e.g. coordinates, hashes).',
      whenToUse: ['Fixed-size data: RGB `[3]uint8`, SHA-256 `[32]byte`, board `[8][8]Piece`', 'Composite map keys: `map[[2]int]bool`'],
      whenNotToUse: ['Variable-length collections — use slices.', 'Passing large arrays by value in hot paths — pass a slice or pointer.'],
      syntax: `var a [5]int                 // [0 0 0 0 0]
b := [3]string{"x", "y", "z"}
c := [...]int{2: 10, 4: 20}  // [0 0 10 0 20]
var grid [2][3]int
grid[1][2] = 7
same := b == [3]string{"x", "y", "z"} // true`,
      example: {
        code: `package main

import "fmt"

func zero(a [3]int)    { a[0] = 0 }
func zeroP(a *[3]int)  { a[0] = 0 }

func main() {
	a := [3]int{1, 2, 3}
	b := a
	b[1] = 99
	zero(a)
	fmt.Println(a, b)
	zeroP(&a)
	fmt.Println(a, a == [3]int{0, 2, 3})
}`,
        output: `[1 2 3] [1 99 3]
[0 2 3] true`,
        notes: ['`b := a` copies all 3 ints.', '`zero` gets a copy, so a is unchanged.', 'With a pointer the original is modified; arrays compare element-wise.'],
      },
      mistakes: ['Expecting a function to modify an array argument.', 'Mixing `[]int` and `[3]int` — different kinds of types.', 'Out-of-range constant index is a compile error; variable index panics at runtime.'],
      problems: [
        {
          id: 'm04-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Range copies arrays',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	arr := [3]int{1, 2, 3}
	for i, v := range arr {
		arr[2] = 100
		if i == 2 {
			fmt.Println(v)
		}
	}
	fmt.Println(arr[2])
}`,
          check: { options: ['3\n100', '100\n100', '3\n3', '100\n3'], answerIndex: 0 },
          hints: ['`range arr` over an ARRAY (not a slice, not a pointer) evaluates a copy of it.'],
          solution: '```text\n3\n100\n```',
          explanation: 'Ranging over an array value iterates a copy made before the loop, so v at i==2 is the original 3. The real array is modified, so arr[2] prints 100. Ranging over `arr[:]` or `&arr` would print 100 twice.',
        },
        {
          id: 'm04-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Tic-tac-toe winner',
          story: 'A multiplayer game server must validate every finished board.',
          prompt: 'Given `type Board [3][3]byte` with \'X\', \'O\' or 0, write `Winner(b Board) byte` returning the winner or 0. Check rows, columns and both diagonals.',
          hints: ['Write a helper `line(a, b, c byte) byte` that returns a if a != 0 && a == b && b == c.', 'Loop i over 0..2 for rows and columns.'],
          solution: `type Board [3][3]byte

func line(a, b, c byte) byte {
	if a != 0 && a == b && b == c {
		return a
	}
	return 0
}

func Winner(b Board) byte {
	for i := 0; i < 3; i++ {
		if w := line(b[i][0], b[i][1], b[i][2]); w != 0 {
			return w
		}
		if w := line(b[0][i], b[1][i], b[2][i]); w != 0 {
			return w
		}
	}
	if w := line(b[0][0], b[1][1], b[2][2]); w != 0 {
		return w
	}
	return line(b[0][2], b[1][1], b[2][0])
}`,
          explanation: 'The board is only 9 bytes, so passing it by value is cheap and keeps Winner side-effect free.',
          complexity: { time: 'O(1) (8 lines)', space: 'O(1)' },
          variation: 'Generalise to N×N with K-in-a-row and make it O(N²) using direction vectors.',
        },
        {
          id: 'm04-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Deduplicate GPS points with array keys',
          story: 'A fleet tracker receives points rounded to 4 decimals and wants unique visited cells.',
          prompt: 'Write `UniqueCells(points [][2]float64) int` that counts distinct cells after rounding each coordinate to 4 decimals. Use an array as the map key. Why can’t you use `[]float64` as a key?',
          hints: ['Convert to integers to avoid float equality issues: `int64(math.Round(lat*1e4))`.', '`map[[2]int64]struct{}` works because arrays are comparable.'],
          solution: `func UniqueCells(points [][2]float64) int {
	seen := make(map[[2]int64]struct{}, len(points))
	for _, p := range points {
		key := [2]int64{int64(math.Round(p[0] * 1e4)), int64(math.Round(p[1] * 1e4))}
		seen[key] = struct{}{}
	}
	return len(seen)
}`,
          explanation: 'Map keys must be comparable. Slices are not comparable (only to nil), so `[]float64` cannot be a key; fixed-size arrays are. Integer keys avoid NaN/−0.0 quirks of float keys.',
          complexity: { time: 'O(n) average', space: 'O(unique cells)' },
          variation: 'Return the cell visited most often and the order of first visits.',
        },
      ],
    },
    {
      id: 'm04-t2',
      title: 'Slice Internals: len, cap, append and Reallocation',
      summary: 'A slice is a 3-word header {ptr, len, cap} over a backing array.',
      concept: [
        'A slice is a descriptor: pointer to a backing array, length, and capacity. Copying a slice copies the header — both copies see the same elements.',
        '`s[low:high]` creates a new header over the same array with len = high−low and cap = cap(s)−low. The full form `s[low:high:max]` limits cap to max−low.',
        '`append(s, v)` writes into the backing array if len < cap (mutating shared memory!) and returns a header with len+1. If cap is exhausted it allocates a NEW, larger array (roughly 2× for small slices, ~1.25× for large), copies, and returns a header pointing there — the old slice is unaffected afterwards.',
        'Always use the result: `s = append(s, v)`. Pre-size with `make([]T, 0, n)` when you know n.',
      ],
      why: 'Slices give dynamic arrays with amortised O(1) append and zero-copy sub-slicing — but you must understand aliasing to avoid spooky bugs.',
      whenToUse: ['Almost every list in Go', '`make([]T, 0, n)` when the final size is known', 'Three-index slicing to protect callers from your appends'],
      whenNotToUse: ['Holding a tiny sub-slice of a huge array long-term (it pins the whole array — copy it).', 'Sharing a slice between goroutines without synchronisation.'],
      syntax: `s := make([]int, 3, 10) // len 3, cap 10
t := s[1:2]              // len 1, cap 9
u := s[1:2:3]            // len 1, cap 2
s = append(s, 4)         // len 4
fmt.Println(len(s), cap(s))`,
      example: {
        code: `package main

import "fmt"

func main() {
	a := []int{1, 2, 3}
	b := a[:2]
	b = append(b, 10)
	fmt.Println(a, b)

	b = append(b, 20)
	b[0] = 0
	fmt.Println(a, b)
}`,
        output: `[1 2 10] [1 2 10]
[1 2 10] [0 2 10 20]`,
        notes: [
          '`b := a[:2]` has len 2, cap 3 — same backing array.',
          'append fits within cap, so it overwrites a[2] with 10. a sees it!',
          'The next append exceeds cap 3 → new array. From now on b is independent; `b[0] = 0` does not touch a.',
        ],
      },
      mistakes: ['Ignoring append’s return value.', 'Assuming two slices are independent after slicing.', 'Appending to a sub-slice passed in by a caller (corrupts their data) — use `s[:len(s):len(s)]` or copy.'],
      problems: [
        {
          id: 'm04-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'The brief’s classic',
          prompt: 'What happens and WHY?',
          code: `package main

import "fmt"

func main() {
	a := []int{1, 2, 3}
	b := a[:2]
	b = append(b, 10)
	fmt.Println(a)
}`,
          check: { options: ['[1 2 10]', '[1 2 3]', '[1 2 3 10]', '[1 2 10 3]'], answerIndex: 0 },
          hints: ['What are len(b) and cap(b)?', 'Does the append need a new array?'],
          solution: '`[1 2 10]`',
          explanation: 'b has len 2 and cap 3 over a’s array. Appending one element fits in capacity, so it is written to index 2 of the shared array — a[2] becomes 10.',
          variation: 'Change line 2 to `b := a[:2:2]`. Now what prints, and why is this the defensive idiom?',
        },
        {
          id: 'm04-t2-p2',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'Append inside a function',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func add(s []int) {
	s = append(s, 4)
	s[0] = 100
}

func main() {
	s := make([]int, 3, 4)
	add(s)
	fmt.Println(s, len(s))
	t := []int{1, 2, 3}
	add(t)
	fmt.Println(t)
}`,
          check: { options: ['[100 0 0] 3\n[1 2 3]', '[100 0 0 4] 4\n[100 2 3 4]', '[0 0 0] 3\n[1 2 3]', '[100 0 0] 3\n[100 2 3]'], answerIndex: 0 },
          hints: ['The callee gets a copy of the header (len 3).', 'Case 1: cap 4 → no realloc. Case 2: cap 3 → realloc before `s[0] = 100`.'],
          solution: '```text\n[100 0 0] 3\n[1 2 3]\n```',
          explanation: 'First call: append writes 4 into slot 3 of the shared array (invisible to the caller, whose len is still 3), then s[0] = 100 writes the shared array → caller sees [100 0 0]. Second call: t has cap 3, so append allocates a new array; s[0] = 100 modifies the new array, so t is unchanged.',
        },
        {
          id: 'm04-t2-p3',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Batch events without aliasing',
          story: 'An event processor splits a stream into batches of size k and hands each batch to a goroutine that may append metadata to it.',
          prompt: 'Write `Batches[T any](events []T, k int) [][]T` that returns sub-slices WITHOUT copying the data, but such that an append on one batch can never overwrite the next batch. Panic-free for k <= 0 (return nil).',
          hints: ['Plain `events[i:j]` has cap extending to the end of events.', 'Use the full slice expression `events[i:j:j]`.'],
          solution: `func Batches[T any](events []T, k int) [][]T {
	if k <= 0 {
		return nil
	}
	out := make([][]T, 0, (len(events)+k-1)/k)
	for i := 0; i < len(events); i += k {
		j := min(i+k, len(events))
		out = append(out, events[i:j:j])
	}
	return out
}`,
          explanation: 'Capping each batch at j means its cap equals its len; any append must reallocate, so neighbouring batches stay intact. No element is copied up front.',
          complexity: { time: 'O(n/k) headers', space: 'O(n/k)', notes: 'Zero element copies; appends on a batch trigger a copy of that batch only.' },
          variation: 'Write `Chunk` as an iterator (`iter.Seq[[]T]`) so huge inputs never materialise the outer slice.',
        },
        {
          id: 'm04-t2-p4',
          tier: 'interview',
          level: 4,
          kind: 'concept',
          title: 'Amortised append',
          prompt: 'Explain why appending n elements one at a time to a nil slice is O(n) total even though some appends copy the whole slice. What would happen if Go grew capacity by +10 each time instead of multiplying?',
          hints: ['Sum the copy costs across all reallocations with geometric growth.', 'With additive growth, how many reallocations are there and how big is each copy?'],
          solution:
            'With doubling, reallocations happen at sizes 1, 2, 4, …, n. Total elements copied = 1 + 2 + 4 + … + n < 2n, so n appends cost O(n) total → amortised O(1) each.\n\nWith +10 growth there are n/10 reallocations copying 10, 20, 30, … n elements: sum ≈ n²/20 → O(n²) total, O(n) amortised per append.\n\n(Go actually grows 2× up to 256 elements, then smoothly toward 1.25×, rounded up to malloc size classes — still geometric.)',
          explanation: 'Geometric growth is what makes dynamic arrays efficient; the constant factor trades memory waste (up to 2×) for fewer copies.',
          complexity: { time: 'Amortised O(1) per append', space: 'Up to ~2× slack for small slices' },
        },
      ],
    },
    {
      id: 'm04-t3',
      title: 'copy, nil vs empty slices, and Slice Memory Gotchas',
      summary: 'copy returns min(len), nil and empty differ only at the edges, and sub-slices pin memory.',
      concept: [
        '`copy(dst, src)` copies min(len(dst), len(src)) elements and returns that count. It handles overlapping slices correctly. dst must already have length — copying into `make([]T, 0, n)` copies nothing.',
        'A nil slice (`var s []int`) has no backing array; an empty slice (`[]int{}` or `make([]int, 0)`) has one of size 0. Both have len 0, both work with append and range. Differences: `s == nil`, JSON encoding (`null` vs `[]`), and reflect.DeepEqual.',
        'Deleting element i: `s = append(s[:i], s[i+1:]...)` (shifts, O(n)) or `slices.Delete`. Order-insensitive delete: swap with last and truncate (O(1)).',
        'A small sub-slice of a big buffer keeps the whole buffer alive. Copy it (`slices.Clone`) to release memory.',
      ],
      why: 'Knowing these edges prevents silent data loss (copy into zero-length dst), API inconsistencies (null vs []) and memory leaks.',
      whenToUse: ['`var s []T` as the default empty value', '`slices.Clone` before retaining a sub-slice', 'swap-delete when order does not matter'],
      whenNotToUse: ['Do not return nil where an API contract promises `[]` in JSON — initialise with `[]T{}`.', 'Do not keep references into a reused buffer (bufio.Scanner.Bytes()).'],
      syntax: `dst := make([]int, len(src))
n := copy(dst, src)

var a []int      // nil
b := []int{}     // empty, non-nil
a == nil, b == nil // true, false

s = append(s[:i], s[i+1:]...) // ordered delete
s[i] = s[len(s)-1]; s = s[:len(s)-1] // fast delete`,
      example: {
        code: `package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var a []int
	b := []int{}
	ja, _ := json.Marshal(a)
	jb, _ := json.Marshal(b)
	fmt.Println(len(a), len(b), a == nil, b == nil, string(ja), string(jb))

	dst := make([]int, 0, 5)
	n := copy(dst, []int{1, 2, 3})
	fmt.Println(n, dst)
}`,
        output: `0 0 true false null []
0 []`,
        notes: ['Both have length 0 but encode differently in JSON.', 'copy uses len(dst) = 0, not cap, so nothing is copied.'],
      },
      mistakes: ['`copy` into a slice made with length 0.', 'Holding `buf[:8]` of a 100 MB file read.', 'Deleting from a slice while ranging forward over it (indexes shift).'],
      problems: [
        {
          id: 'm04-t3-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'copy overlaps',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	s := []int{1, 2, 3, 4, 5}
	n := copy(s[1:], s)
	fmt.Println(n, s)
}`,
          check: { options: ['4 [1 1 2 3 4]', '5 [1 1 1 1 1]', '4 [1 1 1 1 1]', '5 [1 2 3 4 5]'], answerIndex: 0 },
          hints: ['n = min(len(dst), len(src)) = min(4, 5).', 'copy behaves like memmove — correct for overlapping memory.'],
          solution: '`4 [1 1 2 3 4]`',
          explanation: 'copy copies 4 elements as if through a temporary buffer, shifting [1 2 3 4] one slot right. A naive forward loop would instead produce [1 1 1 1 1].',
        },
        {
          id: 'm04-t3-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Remove cancelled orders in place',
          story: 'An order book slice has 1M orders; cancelled ones must be removed every second without allocating.',
          prompt: 'Write `RemoveCancelled(orders []Order) []Order` that filters in place (preserving order) with zero allocations, and clears the tail so removed orders can be garbage collected. `type Order struct{ ID int; Cancelled bool; Meta *Details }`.',
          hints: ['Use a write index `w`; copy kept elements to `orders[w]`.', 'After the loop, zero `orders[w:]` (`clear(orders[w:])`) so pointers in the tail are released.'],
          solution: `func RemoveCancelled(orders []Order) []Order {
	w := 0
	for _, o := range orders {
		if !o.Cancelled {
			orders[w] = o
			w++
		}
	}
	clear(orders[w:])
	return orders[:w]
}`,
          explanation: 'The kept prefix reuses the same backing array. Without clearing, `Meta` pointers beyond len would keep Details objects alive (they are still reachable via the backing array).',
          complexity: { time: 'O(n)', space: 'O(1) extra, zero allocations' },
          variation: 'Equivalent stdlib: `slices.DeleteFunc`. Read its source and compare.',
        },
        {
          id: 'm04-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'The memory leak in the header parser',
          story: 'A service reads 10 MB uploads and keeps the first 16 bytes (magic header) of each in a cache. RSS grows to 40 GB.',
          prompt: 'Why does memory explode, and how do you fix it?',
          code: `var cache [][]byte

func remember(upload []byte) {
	cache = append(cache, upload[:16])
}`,
          hints: ['What does `upload[:16]` point to?'],
          solution: '`upload[:16]` is a header over the SAME 10 MB backing array, so each cached 16-byte slice keeps 10 MB alive.\n\nFix: copy the bytes you need.\n\n```go\nfunc remember(upload []byte) {\n\thead := make([]byte, 16)\n\tcopy(head, upload)\n\tcache = append(cache, head)\n}\n```\n\nor `bytes.Clone(upload[:16])`. Even better, store `[16]byte` values (arrays copy by value).',
          explanation: 'The GC tracks objects, not byte ranges: any pointer into an array keeps all of it reachable.',
        },
      ],
    },
  ],
}

export const MODULE_05: Module = {
  id: 'm05',
  number: 5,
  track: 'go',
  title: 'Maps',
  shortTitle: 'Maps',
  tagline: 'Hash maps, the comma-ok idiom, nil maps, random iteration order, comparable keys.',
  topics: [
    {
      id: 'm05-t1',
      title: 'Map Basics and the comma-ok Idiom',
      summary: 'Insert, lookup, delete — and how to tell "missing" from "zero".',
      concept: [
        'A map is a hash table from comparable keys to values: `map[K]V`. Create with `make(map[K]V)` or a literal. Insert/update with `m[k] = v`, delete with `delete(m, k)` (no-op if missing), size with `len(m)`.',
        'Reading a missing key returns the zero value of V. To distinguish, use comma-ok: `v, ok := m[k]` — `ok` is true iff the key is PRESENT in the map (even if its value is the zero value).',
        'Maps are reference-like: passing a map to a function lets it modify the caller’s map.',
      ],
      why: 'O(1) average lookup is the backbone of counting, caching, indexing and de-duplication.',
      whenToUse: ['Counting frequencies', 'Indexes by ID', 'Sets: `map[T]struct{}`', 'Memoisation'],
      whenNotToUse: ['When you need ordering — sort keys or use a slice.', 'Concurrent writes without a mutex (fatal error).', 'Small fixed key sets (a switch or array may be faster).'],
      syntax: `stock := map[string]int{"apple": 5}
stock["pear"] = 2
n := stock["kiwi"]          // 0
n, ok := stock["kiwi"]      // 0, false
delete(stock, "apple")
for k, v := range stock { _, _ = k, v }
set := map[string]struct{}{}
set["a"] = struct{}{}`,
      example: {
        code: `package main

import "fmt"

func main() {
	balance := map[string]int{"alice": 0, "bob": 50}
	for _, name := range []string{"alice", "carol"} {
		v, ok := balance[name]
		fmt.Printf("%s: %d present=%v\\n", name, v, ok)
	}
	balance["carol"]++
	fmt.Println(balance["carol"], len(balance))
}`,
        output: `alice: 0 present=true
carol: 0 present=false
1 3`,
        notes: ['alice exists with value 0 → ok true.', 'carol is missing → zero value and ok false.', '`m[k]++` on a missing key reads 0, writes 1 — the counting idiom.'],
      },
      mistakes: ['Using `if m[k] != 0` to test presence.', 'Writing to a nil map → panic: assignment to entry in nil map.', 'Taking the address of a map element `&m[k]` — not allowed (elements can move during growth).'],
      problems: [
        {
          id: 'm05-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'What exactly does ok mean?',
          prompt: 'Given `m := map[string]int{"a": 0}`, what are the results of `v1, ok1 := m["a"]` and `v2, ok2 := m["b"]`?',
          check: { options: ['0 true / 0 false', '0 false / 0 false', '0 true / nil false', 'panic on m["b"]'], answerIndex: 0 },
          hints: ['ok reports presence, not truthiness of the value.'],
          solution: '`v1 = 0, ok1 = true`; `v2 = 0, ok2 = false`.',
          explanation: 'ok is true exactly when the key exists in the map. Values never "are nil" for int; missing keys yield the zero value. Reading a missing key never panics.',
        },
        {
          id: 'm05-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Duplicate package IDs',
          story: 'A delivery company scans thousands of package IDs per warehouse shift. Duplicates mean a package was scanned twice — or cloned labels.',
          prompt: 'Write `Duplicates(ids []string) []string` returning each ID that appears more than once, in order of its SECOND appearance, each listed once.',
          hints: ['Count occurrences as you go.', 'Append when the count becomes exactly 2.'],
          solution: `func Duplicates(ids []string) []string {
	seen := make(map[string]int, len(ids))
	var dups []string
	for _, id := range ids {
		seen[id]++
		if seen[id] == 2 {
			dups = append(dups, id)
		}
	}
	return dups
}`,
          explanation: 'Appending exactly when the count hits 2 gives the second-appearance order and lists each duplicate once.',
          complexity: { time: 'O(n) average', space: 'O(n)', worst: 'O(n²) only under pathological hash collisions (Go uses randomised hashing to prevent this)' },
          variation: 'The IDs are 64-bit integers and there are 2 billion of them — they do not fit in a map. Sketch an external-sort or Bloom-filter + verification approach.',
        },
        {
          id: 'm05-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Group anagrams of product tags',
          story: 'A search engine wants to merge tags like "listen", "silent", "enlist".',
          prompt: 'Write `GroupAnagrams(words []string) [][]string` (lowercase ASCII). Use a fixed-size array key instead of sorting each word. State the complexity.',
          hints: ['Count letters into `[26]byte` (or [26]int) — arrays are comparable map keys.', '`map[[26]int][]string`.'],
          solution: `func GroupAnagrams(words []string) [][]string {
	groups := make(map[[26]int][]string)
	for _, w := range words {
		var key [26]int
		for i := 0; i < len(w); i++ {
			key[w[i]-'a']++
		}
		groups[key] = append(groups[key], w)
	}
	out := make([][]string, 0, len(groups))
	for _, g := range groups {
		out = append(out, g)
	}
	return out
}`,
          explanation: 'Anagrams share the same letter histogram. The array key avoids O(L log L) sorting per word.',
          complexity: { time: 'O(n·L)', space: 'O(n·L)', notes: 'Sorting-key version is O(n·L log L). Output group order is random (map iteration).' },
          variation: 'Make output deterministic: groups ordered by first occurrence, words within a group in input order.',
        },
      ],
    },
    {
      id: 'm05-t2',
      title: 'Nil Maps, Iteration Order, Keys and Map Memory',
      summary: 'Comparable keys, random order on purpose, maps never shrink.',
      concept: [
        'A nil map behaves like an empty map for reads, len, delete and range — but writing panics. Always `make` before writing.',
        'Iteration order is unspecified and deliberately randomised. Sort the keys (`slices.Sorted(maps.Keys(m))`) when you need determinism.',
        'Keys must be comparable: bool, numbers, strings, pointers, channels, interfaces, arrays and structs of comparable fields. Slices, maps and funcs cannot be keys. Interface keys can panic at runtime if the dynamic type is not comparable. NaN float keys are never equal to themselves.',
        'Maps grow but do not shrink after deletes; a map that once held 1M entries keeps its buckets. Recreate it to release memory. Deleting during range is safe; entries added during range may or may not be visited.',
      ],
      why: 'Randomised order prevents code from depending on an implementation detail; comparable-key rules make hashing well-defined.',
      whenToUse: ['Struct keys for composite indexes', 'Recreating maps after bulk deletes', 'clear(m) (Go 1.21) to empty a map in place'],
      whenNotToUse: ['Expecting stable output order in tests or JSON.', 'Concurrent access without sync.'],
      syntax: `var m map[string]int   // nil
_ = m["x"]             // ok, 0
// m["x"] = 1          // panic
type Key struct{ City string; Day int }
visits := map[Key]int{}
visits[Key{"Pune", 3}]++
keys := slices.Sorted(maps.Keys(visits))`,
      example: {
        code: `package main

import (
	"fmt"
	"maps"
	"slices"
)

func main() {
	m := map[string]int{"b": 2, "a": 1, "c": 3}
	for _, k := range slices.Sorted(maps.Keys(m)) {
		fmt.Print(k, "=", m[k], " ")
	}
	fmt.Println()
	var nilMap map[string]int
	fmt.Println(len(nilMap), nilMap["x"])
	delete(nilMap, "x")
}`,
        output: `a=1 b=2 c=3
0 0`,
        notes: ['maps.Keys returns an iterator; slices.Sorted collects and sorts it.', 'Reads and delete on a nil map are fine.'],
      },
      mistakes: ['Map in a struct field left nil, then written.', 'Golden tests that print maps in range order.', 'Using a map value struct field assignment: `m[k].Count++` does not compile for struct values — store pointers or reassign.'],
      problems: [
        {
          id: 'm05-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'debug',
          title: 'Compile error with struct values',
          prompt: 'Why does this not compile? Give two fixes.',
          code: `type Stats struct{ Hits int }

func main() {
	m := map[string]Stats{"home": {}}
	m["home"].Hits++
}`,
          hints: ['Map elements are not addressable.'],
          solution: 'Error: `cannot assign to struct field m["home"].Hits in map`. Map elements are not addressable (they may move when the map grows), so you cannot modify a field in place.\n\nFix 1 — read, modify, write back:\n\n```go\ns := m["home"]\ns.Hits++\nm["home"] = s\n```\n\nFix 2 — store pointers: `map[string]*Stats` then `m["home"].Hits++` works (beware nil for missing keys).',
          explanation: 'Value semantics: `m[k]` yields a copy.',
        },
        {
          id: 'm05-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Top K most shipped packages',
          story: 'The delivery company wants the K package IDs shipped most often this week, ties broken by ID ascending.',
          prompt: 'Write `TopK(ids []string, k int) []string`. Count with a map, then sort the unique IDs with `slices.SortFunc` using `cmp.Compare`.',
          hints: ['Collect unique keys into a slice.', 'Comparator: higher count first; if equal, `strings.Compare(a, b)`.'],
          solution: `func TopK(ids []string, k int) []string {
	count := make(map[string]int)
	for _, id := range ids {
		count[id]++
	}
	keys := make([]string, 0, len(count))
	for id := range count {
		keys = append(keys, id)
	}
	slices.SortFunc(keys, func(a, b string) int {
		if c := cmp.Compare(count[b], count[a]); c != 0 {
			return c
		}
		return strings.Compare(a, b)
	})
	return keys[:min(k, len(keys))]
}`,
          explanation: 'Sorting the U unique keys costs O(U log U). The explicit tie-breaker makes output deterministic despite random map order.',
          complexity: { time: 'O(n + U log U)', space: 'O(U)', notes: 'A size-k heap gives O(n + U log k); bucket sort by count gives O(n + U).' },
          variation: 'Do it in O(n + U log k) with container/heap, then in O(n) with bucket sort.',
        },
        {
          id: 'm05-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Interface keys that panic',
          prompt: 'This compiles. What happens at runtime and why?',
          code: `m := map[any]int{}
m[1] = 1
m["a"] = 2
m[[]int{1}] = 3`,
          hints: ['Is `[]int` comparable? When is this checked for interface keys?'],
          solution: 'The third assignment panics: `runtime error: hash of unhashable type []int`. The key type `any` is comparable at compile time, but the dynamic type []int is not, so hashing fails at runtime.',
          explanation: 'Interface comparison is only checked dynamically. Prefer concrete key types; if you must use `any`, validate keys or use `comparable` generics so the compiler enforces it.',
        },
      ],
    },
  ],
}
