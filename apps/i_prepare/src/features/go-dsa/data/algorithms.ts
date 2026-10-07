import type { Module } from '../types'

export const MODULE_29: Module = {
  id: 'm29',
  number: 29,
  track: 'dsa',
  title: 'Searching and Sorting',
  shortTitle: 'Search & Sort',
  tagline: 'Binary search variants and search-on-answer; every classic sort with intuition, complexity, stability and real use.',
  topics: [
    {
      id: 'm29-t1',
      title: 'Binary Search, Lower/Upper Bound, Search on Answer',
      summary: 'Halve the search space with a monotonic predicate.',
      concept: [
        'Binary search works on any MONOTONIC predicate over an ordered domain: find the first index where pred(i) is true. Sorted-array search is the special case pred(i) = a[i] ≥ target.',
        'Lower bound = first index with a[i] ≥ x; upper bound = first index with a[i] > x. Count of x = upper − lower. Go: `sort.Search(n, pred)`, `slices.BinarySearch`.',
        'Search on answer: when the question is "minimum capacity/speed/time such that feasible(X)" and feasibility is monotonic, binary search X and test feasibility greedily.',
        'Use half-open [lo, hi) and `mid := lo + (hi-lo)/2` (no overflow); loop while lo < hi.',
      ],
      why: 'O(log n) instead of O(n), and a whole family of optimisation problems become "binary search + greedy check".',
      whenToUse: ['Sorted data lookups', 'Minimise the maximum / maximise the minimum', 'Finding thresholds (first bad version, capacity)'],
      whenNotToUse: ['Non-monotonic predicates.', 'Unsorted data searched once (linear is cheaper than sorting).'],
      syntax: `// first index i in [0, n) where pred(i) is true, or n
lo, hi := 0, n
for lo < hi {
	mid := lo + (hi-lo)/2
	if pred(mid) { hi = mid } else { lo = mid + 1 }
}
i := sort.Search(n, func(i int) bool { return a[i] >= x })`,
      example: {
        code: `a := []int{1, 3, 3, 3, 7}
lower := sort.SearchInts(a, 3)                                   // 1
upper := sort.Search(len(a), func(i int) bool { return a[i] > 3 }) // 4
fmt.Println(lower, upper, upper-lower)                           // 1 4 3`,
        notes: ['Both bounds are the same template with different predicates.', 'If x is absent, lower == upper == insertion point.'],
      },
      mistakes: ['`for lo <= hi` with half-open bounds (infinite loop or off-by-one).', '`(lo+hi)/2` overflow in fixed-width languages (habit worth keeping).', 'Non-monotonic feasibility functions.'],
      problems: [
        {
          id: 'm29-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'First bad deployment',
          story: 'Builds 1..n were deployed in order; at some point a bug was introduced and every later build is bad. `isBad(v)` is expensive.',
          prompt: 'Write `FirstBad(n int, isBad func(int) bool) int` with O(log n) calls.',
          hints: ['Predicate is monotonic: false…false true…true.'],
          solution: `func FirstBad(n int, isBad func(int) bool) int {
	lo, hi := 1, n
	for lo < hi {
		mid := lo + (hi-lo)/2
		if isBad(mid) {
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}`,
          explanation: 'Invariant: the first bad build is in [lo, hi]. Each step halves the interval.',
          complexity: { time: 'O(log n) calls', space: 'O(1)' },
        },
        {
          id: 'm29-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Truck capacity to ship in D days',
          story: 'Packages with weights must ship in order within D days; find the minimum truck capacity.',
          prompt: 'Write `MinCapacity(weights []int, days int) int` using search on answer.',
          hints: ['Answer is in [max(weights), sum(weights)].', 'feasible(c): greedily fill each day; count days needed ≤ days.'],
          solution: `func MinCapacity(weights []int, days int) int {
	lo, hi := 0, 0
	for _, w := range weights {
		lo = max(lo, w)
		hi += w
	}
	feasible := func(c int) bool {
		need, load := 1, 0
		for _, w := range weights {
			if load+w > c {
				need++
				load = 0
			}
			load += w
		}
		return need <= days
	}
	for lo < hi {
		mid := lo + (hi-lo)/2
		if feasible(mid) {
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}`,
          explanation: 'If capacity c works, any larger capacity works → monotonic, so binary search finds the minimum.',
          complexity: { time: 'O(n log(sum))', space: 'O(1)' },
          variation: 'Koko eating bananas / split array largest sum — same template, different feasibility check.',
        },
        {
          id: 'm29-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Search a rotated sorted log index',
          story: 'A circular log buffer stores timestamps sorted but rotated (e.g. [40 50 60 10 20 30]).',
          prompt: 'Write `SearchRotated(a []int, target int) int` (distinct values) in O(log n).',
          hints: ['At least one half [lo, mid] or [mid, hi] is sorted.', 'Check whether target lies inside the sorted half.'],
          solution: `func SearchRotated(a []int, target int) int {
	lo, hi := 0, len(a)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if a[mid] == target {
			return mid
		}
		if a[lo] <= a[mid] { // left half sorted
			if a[lo] <= target && target < a[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else { // right half sorted
			if a[mid] < target && target <= a[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
		}
	}
	return -1
}`,
          explanation: 'The sorted half can be tested with two comparisons; if target is not in it, it must be in the other half.',
          complexity: { time: 'O(log n)', space: 'O(1)', worst: 'O(n) if duplicates are allowed' },
        },
      ],
    },
    {
      id: 'm29-t2',
      title: 'Comparison Sorts: Bubble, Selection, Insertion, Merge, Quick, Heap',
      summary: 'Intuition, complexity, stability, in-place and when each is used.',
      concept: [
        'Bubble (swap adjacent out-of-order pairs; O(n²); stable; in place) and selection (pick min each pass; O(n²); not stable; minimal swaps) are teaching tools.',
        'Insertion sort: grow a sorted prefix by inserting each element — O(n²) worst, O(n) on nearly sorted data; stable; in place. Used inside hybrid sorts for small partitions.',
        'Merge sort: split, sort halves, merge — O(n log n) always; stable; O(n) extra space; great for linked lists and external sorting.',
        'Quick sort: partition around a pivot — O(n log n) average, O(n²) worst (bad pivots); in place; not stable. Heap sort: O(n log n) worst, in place, not stable, poor cache behaviour. Go’s slices.Sort uses pattern-defeating quicksort (pdqsort): introsort-like hybrid with insertion sort and heapsort fallback.',
      ],
      why: 'Sorting is a building block for search, dedup, scheduling and greedy algorithms — and stability/space trade-offs matter in real systems.',
      whenToUse: ['slices.Sort/SortFunc in practice', 'SortStableFunc when equal keys must keep order', 'Merge sort for linked lists/external data'],
      whenNotToUse: ['Hand-written O(n²) sorts on non-trivial input.', 'Quick sort with first-element pivot on sorted input.'],
      syntax: `func mergeSort(a []int) []int {
	if len(a) <= 1 { return a }
	mid := len(a) / 2
	l, r := mergeSort(a[:mid]), mergeSort(a[mid:])
	out := make([]int, 0, len(a))
	i, j := 0, 0
	for i < len(l) && j < len(r) {
		if l[i] <= r[j] { out = append(out, l[i]); i++ } else { out = append(out, r[j]); j++ }
	}
	out = append(out, l[i:]...)
	return append(out, r[j:]...)
}`,
      example: {
        code: `| Sort      | Best      | Average   | Worst     | Space    | Stable |
|-----------|-----------|-----------|-----------|----------|--------|
| Bubble    | n         | n²        | n²        | 1        | yes    |
| Selection | n²        | n²        | n²        | 1        | no     |
| Insertion | n         | n²        | n²        | 1        | yes    |
| Merge     | n log n   | n log n   | n log n   | n        | yes    |
| Quick     | n log n   | n log n   | n²        | log n    | no     |
| Heap      | n log n   | n log n   | n log n   | 1        | no     |`,
        notes: ['`<=` in merge keeps it stable (left element first on ties).', 'Quick sort’s O(log n) space is the recursion stack (with smaller-side-first recursion).'],
      },
      mistakes: ['Using `<` in merge (breaks stability).', 'Partition infinite loops with duplicates (use 3-way partition).', 'Assuming sort.Slice is stable.'],
      problems: [
        {
          id: 'm29-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Stable sort matters',
          prompt: 'Orders are first sorted by time. You now sort by customer and want each customer’s orders to remain in time order. What must the second sort be?',
          check: { options: ['Stable (e.g. slices.SortStableFunc / merge sort)', 'In-place', 'O(n) time', 'Recursive'], answerIndex: 0 },
          hints: ['What happens to equal keys?'],
          solution: 'Stable.',
          explanation: 'A stable sort preserves the relative order of equal keys, so the earlier time order survives within each customer.',
        },
        {
          id: 'm29-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Quick sort with 3-way partition',
          story: 'Sorting millions of product ratings (1–5 stars) — tons of duplicates kill naive quicksort.',
          prompt: 'Implement `QuickSort(a []int)` with random pivot and Dutch-flag 3-way partitioning (<, ==, >).',
          hints: ['lt, i, gt pointers.', 'Recurse on a[:lt] and a[gt+1:] only.'],
          solution: `func QuickSort(a []int) {
	for len(a) > 1 {
		p := a[rand.IntN(len(a))]
		lt, i, gt := 0, 0, len(a)-1
		for i <= gt {
			switch {
			case a[i] < p:
				a[lt], a[i] = a[i], a[lt]
				lt++
				i++
			case a[i] > p:
				a[i], a[gt] = a[gt], a[i]
				gt--
			default:
				i++
			}
		}
		// recurse into the smaller side, loop on the larger (bounded stack)
		if lt < len(a)-gt-1 {
			QuickSort(a[:lt])
			a = a[gt+1:]
		} else {
			QuickSort(a[gt+1:])
			a = a[:lt]
		}
	}
}`,
          explanation: 'Equal elements are grouped in the middle and never touched again — with 5 distinct values, total work is O(n·5). Random pivots make the O(n²) worst case astronomically unlikely; recursing on the smaller side bounds the stack at O(log n).',
          complexity: { time: 'O(n log n) expected', space: 'O(log n)', worst: 'O(n²) with adversarial luck', best: 'O(n) when all keys are equal' },
        },
        {
          id: 'm29-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Sort a linked list of transactions',
          prompt: 'Sort a singly linked list in O(n log n) time. Explain why merge sort fits linked lists better than quick sort or heap sort.',
          hints: ['Split with slow/fast pointers, sort halves, merge.'],
          solution: `func SortList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	slow, fast := head, head.Next
	for fast != nil && fast.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	right := slow.Next
	slow.Next = nil
	l, r := SortList(head), SortList(right)
	dummy := &ListNode{}
	t := dummy
	for l != nil && r != nil {
		if l.Val <= r.Val {
			t.Next, l = l, l.Next
		} else {
			t.Next, r = r, r.Next
		}
		t = t.Next
	}
	if l != nil {
		t.Next = l
	} else {
		t.Next = r
	}
	return dummy.Next
}`,
          explanation: 'Merging lists needs no extra array (just relinking), so merge sort is O(1) extra besides recursion. Quick/heap sort rely on random access, which lists lack.',
          complexity: { time: 'O(n log n)', space: 'O(log n) recursion' },
        },
      ],
    },
    {
      id: 'm29-t3',
      title: 'Non-Comparison Sorts: Counting, Radix, Bucket',
      summary: 'Beat n log n by exploiting the key structure.',
      concept: [
        'Comparison sorts need Ω(n log n) comparisons. If keys are small integers, counting sort runs in O(n + k): count occurrences, prefix-sum to positions, place stably.',
        'Radix sort applies a stable counting sort digit by digit (LSD): O(d·(n + base)) — great for fixed-width integers, IPs, fixed-length strings.',
        'Bucket sort distributes uniformly distributed values into buckets, sorts each, concatenates — O(n) expected.',
      ],
      why: 'Sorting 100M ages, ratings, IPv4 addresses or timestamps can be linear time.',
      whenToUse: ['Small key ranges', 'Fixed-width integer keys', 'Uniform floats'],
      whenNotToUse: ['Large sparse key ranges (k ≫ n wastes memory).', 'Arbitrary comparisons on complex types.'],
      syntax: `cnt := make([]int, k)
for _, v := range a { cnt[v]++ }
i := 0
for v, c := range cnt {
	for ; c > 0; c-- { a[i] = v; i++ }
}`,
      example: {
        code: `ages:   [31 22 22 45 31 18]
counts: 18:1 22:2 31:2 45:1
sorted: [18 22 22 31 31 45]`,
        notes: ['No comparisons between elements at all.'],
      },
      mistakes: ['Non-stable inner sort in radix (breaks correctness).', 'Negative numbers without offsetting.'],
      problems: [
        {
          id: 'm29-t3-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Sort customer ages',
          prompt: 'Write `SortAges(ages []int)` in O(n + 150) for ages 0..150.',
          hints: ['Count array of size 151.'],
          solution: `func SortAges(ages []int) {
	var cnt [151]int
	for _, a := range ages {
		cnt[a]++
	}
	i := 0
	for age, c := range cnt {
		for ; c > 0; c-- {
			ages[i] = age
			i++
		}
	}
}`,
          explanation: 'The key range is tiny, so counting dominates comparison sorting.',
          complexity: { time: 'O(n + k)', space: 'O(k)' },
        },
        {
          id: 'm29-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Radix sort IPv4 addresses',
          story: 'A firewall log has 50M IPv4 addresses (uint32) to sort for range compaction.',
          prompt: 'Write `RadixSort(a []uint32)` with 4 passes of byte-wise stable counting sort.',
          hints: ['For shift in 0, 8, 16, 24: count by (v >> shift) & 0xFF, prefix sum, place into buffer from the end or with running offsets.', 'Swap a and buf each pass.'],
          solution: `func RadixSort(a []uint32) {
	buf := make([]uint32, len(a))
	src, dst := a, buf
	for shift := 0; shift < 32; shift += 8 {
		var cnt [257]int
		for _, v := range src {
			cnt[(v>>shift)&0xFF+1]++
		}
		for i := 1; i < 257; i++ {
			cnt[i] += cnt[i-1]
		}
		for _, v := range src {
			b := (v >> shift) & 0xFF
			dst[cnt[b]] = v
			cnt[b]++
		}
		src, dst = dst, src
	}
	// after 4 passes the result is back in a
}`,
          explanation: 'Each pass is a stable counting sort on one byte, least significant first; after the most significant byte the order is total. Four passes = even, so data ends in the original slice.',
          complexity: { time: 'O(4 · (n + 256))', space: 'O(n)' },
        },
        {
          id: 'm29-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'When is O(n) sorting a trap?',
          prompt: 'Your colleague proposes counting sort for 10⁶ user IDs in the range 0..2⁶³. Respond.',
          hints: ['Look at k.'],
          solution: 'Counting sort is O(n + k) time and O(k) memory; k = 2⁶³ makes it impossible. Options: radix sort on 8 bytes (O(8·(n + 256))), or simply slices.Sort (n log n ≈ 2·10⁷ comparisons — fast). Non-comparison sorts win only when keys are small or fixed-width.',
          explanation: 'Big-O hides the key-range term; always check k.',
        },
      ],
    },
  ],
}

export const MODULE_30: Module = {
  id: 'm30',
  number: 30,
  track: 'dsa',
  title: 'Recursion and Backtracking',
  shortTitle: 'Backtracking',
  tagline: 'Recursion trees, state and choices; subsets, permutations, combinations, N-Queens, Sudoku, mazes, word search, palindrome partitioning.',
  topics: [
    {
      id: 'm30-t1',
      title: 'Subsets, Permutations, Combinations',
      summary: 'Choose → explore → un-choose.',
      concept: [
        'Backtracking explores a decision tree: at each level make a choice, recurse, then undo it. The template: `func bt(state) { if done { record; return }; for each choice { apply; bt(next); undo } }`.',
        'Subsets: include/exclude each element (2ⁿ leaves). Permutations: pick any unused element per position (n! leaves). Combinations: choose increasing indexes to avoid duplicates.',
        'Duplicates in input: sort first and skip equal siblings at the same depth.',
        'In Go, append to a shared path slice and COPY it when recording (`slices.Clone(path)`) — otherwise later mutations corrupt stored results.',
      ],
      why: 'Configuration generation, test-case enumeration, scheduling options and puzzle solving are backtracking.',
      whenToUse: ['Enumerate all valid configurations', 'Constraint satisfaction with pruning'],
      whenNotToUse: ['When only a count or an optimum is needed and subproblems overlap (DP).'],
      syntax: `var res [][]int
var path []int
var bt func(start int)
bt = func(start int) {
	res = append(res, slices.Clone(path))
	for i := start; i < len(nums); i++ {
		path = append(path, nums[i])
		bt(i + 1)
		path = path[:len(path)-1]
	}
}
bt(0)`,
      example: {
        code: `nums = [1 2 3] → subsets:
[] [1] [1 2] [1 2 3] [1 3] [2] [2 3] [3]`,
        notes: ['Each node of the recursion tree is a subset (recorded on entry).'],
      },
      mistakes: ['Appending `path` without cloning (all results alias one array).', 'Forgetting to undo.', 'Generating duplicates for inputs with repeated values.'],
      problems: [
        {
          id: 'm30-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'The aliasing bug',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	var res [][]int
	path := make([]int, 0, 4)
	for i := 1; i <= 3; i++ {
		path = append(path, i)
		res = append(res, path)
	}
	path[0] = 9
	fmt.Println(res)
}`,
          check: { options: ['[[9] [9 2] [9 2 3]]', '[[1] [1 2] [1 2 3]]', '[[9 2 3] [9 2 3] [9 2 3]]', '[[1] [9 2] [9 2 3]]'], answerIndex: 0 },
          hints: ['Every stored slice header points to the same backing array (cap 4, no realloc).'],
          solution: '`[[9] [9 2] [9 2 3]]`',
          explanation: 'The three results share one array; changing path[0] changes all of them. In backtracking, the undo steps overwrite the shared array even more — always clone when recording.',
        },
        {
          id: 'm30-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Promo code combinations with duplicates',
          story: 'A marketing tool lists every distinct combination of coupons whose values sum to a target; coupons can repeat in the input but each can be used once.',
          prompt: 'Write `CombinationSum2(coupons []int, target int) [][]int` with no duplicate combinations.',
          hints: ['Sort; skip `i > start && a[i] == a[i-1]`.', 'Prune when a[i] > remaining (sorted, so break).'],
          solution: `func CombinationSum2(a []int, target int) [][]int {
	slices.Sort(a)
	var res [][]int
	var path []int
	var bt func(start, remain int)
	bt = func(start, remain int) {
		if remain == 0 {
			res = append(res, slices.Clone(path))
			return
		}
		for i := start; i < len(a); i++ {
			if i > start && a[i] == a[i-1] {
				continue
			}
			if a[i] > remain {
				break
			}
			path = append(path, a[i])
			bt(i+1, remain-a[i])
			path = path[:len(path)-1]
		}
	}
	bt(0, target)
	return res
}`,
          explanation: 'Skipping equal siblings at the same depth prevents duplicate combinations while still allowing duplicates along one path.',
          complexity: { time: 'O(2ⁿ) worst', space: 'O(n) recursion' },
          variation: 'Unlimited reuse of each coupon (recurse with i instead of i+1).',
        },
        {
          id: 'm30-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'All delivery orderings (permutations)',
          story: 'A courier with ≤ 8 stops wants to enumerate every visiting order to evaluate them.',
          prompt: 'Write `Permutations(stops []string) [][]string` using in-place swapping (no used[] array).',
          hints: ['At depth k swap a[k] with each a[i], i ≥ k, recurse k+1, swap back.'],
          solution: `func Permutations(a []string) [][]string {
	var res [][]string
	var bt func(k int)
	bt = func(k int) {
		if k == len(a) {
			res = append(res, slices.Clone(a))
			return
		}
		for i := k; i < len(a); i++ {
			a[k], a[i] = a[i], a[k]
			bt(k + 1)
			a[k], a[i] = a[i], a[k]
		}
	}
	bt(0)
	return res
}`,
          explanation: 'Position k is fixed by trying each remaining element there; swapping back restores the state for the next choice.',
          complexity: { time: 'O(n · n!)', space: 'O(n) recursion + output' },
          variation: '8 stops is 40,320 orders; 15 stops is 1.3 trillion. What approach replaces brute force? (bitmask DP — Module 31.)',
        },
      ],
    },
    {
      id: 'm30-t2',
      title: 'Constraint Backtracking: N-Queens, Sudoku, Mazes, Word Search, Palindrome Partitioning',
      summary: 'Prune early with fast validity checks.',
      concept: [
        'Constraint problems fill positions one at a time and abandon a branch the moment a constraint breaks. Pruning quality determines speed.',
        'Keep O(1) validity checks: N-Queens uses booleans for columns and both diagonals (r+c, r−c+n−1); Sudoku uses row/col/box bitmasks.',
        'Grid search (mazes, word search) marks cells visited on the way in and unmarks on the way out.',
        'Palindrome partitioning: try every prefix that is a palindrome, recurse on the rest; precompute isPal[i][j] to avoid repeated checks.',
      ],
      why: 'Scheduling, puzzle solvers, layout engines and configuration validators are constraint search.',
      whenToUse: ['Exact solutions to small constraint problems', 'When pruning cuts most branches'],
      whenNotToUse: ['Large instances — use SAT/ILP solvers or heuristics.'],
      syntax: `var cols, d1, d2 []bool
var place func(r int)
place = func(r int) {
	if r == n { count++; return }
	for c := 0; c < n; c++ {
		if cols[c] || d1[r+c] || d2[r-c+n-1] { continue }
		cols[c], d1[r+c], d2[r-c+n-1] = true, true, true
		place(r + 1)
		cols[c], d1[r+c], d2[r-c+n-1] = false, false, false
	}
}`,
      example: {
        code: `N-Queens solutions: n=4 → 2, n=8 → 92`,
        notes: ['One queen per row means only columns and diagonals need checking.'],
      },
      mistakes: ['O(n) validity scans per placement.', 'Forgetting to unmark visited cells.', 'Not stopping after the first solution when only one is needed.'],
      problems: [
        {
          id: 'm30-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Count N-Queens placements',
          prompt: 'Write `NQueens(n int) int` with O(1) checks per placement.',
          hints: ['Three boolean slices.'],
          solution: `func NQueens(n int) int {
	cols := make([]bool, n)
	d1 := make([]bool, 2*n-1)
	d2 := make([]bool, 2*n-1)
	count := 0
	var place func(r int)
	place = func(r int) {
		if r == n {
			count++
			return
		}
		for c := 0; c < n; c++ {
			if cols[c] || d1[r+c] || d2[r-c+n-1] {
				continue
			}
			cols[c], d1[r+c], d2[r-c+n-1] = true, true, true
			place(r + 1)
			cols[c], d1[r+c], d2[r-c+n-1] = false, false, false
		}
	}
	place(0)
	return count
}`,
          explanation: 'All cells on a "/" diagonal share r+c; on a "\\" diagonal they share r−c.',
          complexity: { time: 'O(n!) upper bound, heavily pruned', space: 'O(n)' },
          variation: 'Use bitmasks (uint64) instead of bool slices — typically 5–10× faster.',
        },
        {
          id: 'm30-t2-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Find a product name on a letter board',
          story: 'A puzzle game asks whether a word can be traced on the board through adjacent cells without reusing a cell.',
          prompt: 'Write `Exist(board [][]byte, word string) bool`.',
          hints: ['DFS from each cell; temporarily overwrite the cell with \'#\' as visited.'],
          solution: `func Exist(board [][]byte, word string) bool {
	R, C := len(board), len(board[0])
	var dfs func(r, c, i int) bool
	dfs = func(r, c, i int) bool {
		if i == len(word) {
			return true
		}
		if r < 0 || r >= R || c < 0 || c >= C || board[r][c] != word[i] {
			return false
		}
		saved := board[r][c]
		board[r][c] = '#'
		found := dfs(r+1, c, i+1) || dfs(r-1, c, i+1) || dfs(r, c+1, i+1) || dfs(r, c-1, i+1)
		board[r][c] = saved
		return found
	}
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			if dfs(r, c, 0) {
				return true
			}
		}
	}
	return false
}`,
          explanation: 'In-place marking avoids a separate visited grid; restoring keeps the board intact for other starts.',
          complexity: { time: 'O(R·C·3^L)', space: 'O(L) recursion' },
        },
        {
          id: 'm30-t2-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Sudoku solver',
          prompt: 'Write `SolveSudoku(b *[9][9]byte) bool` (\'.\' = empty) using bitmasks for rows, columns and boxes, choosing the empty cell with the FEWEST candidates at each step.',
          hints: ['rows[r], cols[c], boxes[r/3*3+c/3] are uint16 masks of used digits.', 'Candidates = ^ (rows|cols|box) & 0x3FE (bits 1..9); bits.OnesCount16 counts them.'],
          solution: `func SolveSudoku(b *[9][9]byte) bool {
	var rows, cols, boxes [9]uint16
	var empty [][2]int
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			if b[r][c] == '.' {
				empty = append(empty, [2]int{r, c})
				continue
			}
			bit := uint16(1) << (b[r][c] - '0')
			rows[r] |= bit
			cols[c] |= bit
			boxes[r/3*3+c/3] |= bit
		}
	}
	var solve func(left int) bool
	solve = func(left int) bool {
		if left == 0 {
			return true
		}
		best, bestCount := -1, 10
		for i := 0; i < left; i++ {
			r, c := empty[i][0], empty[i][1]
			cand := ^(rows[r] | cols[c] | boxes[r/3*3+c/3]) & 0x3FE
			if n := bits.OnesCount16(cand); n < bestCount {
				best, bestCount = i, n
			}
		}
		empty[best], empty[left-1] = empty[left-1], empty[best]
		r, c := empty[left-1][0], empty[left-1][1]
		box := r/3*3 + c/3
		cand := ^(rows[r] | cols[c] | boxes[box]) & 0x3FE
		for cand != 0 {
			bit := cand & -cand
			cand &^= bit
			rows[r] |= bit
			cols[c] |= bit
			boxes[box] |= bit
			b[r][c] = byte('0' + bits.TrailingZeros16(bit))
			if solve(left - 1) {
				return true
			}
			rows[r] &^= bit
			cols[c] &^= bit
			boxes[box] &^= bit
			b[r][c] = '.'
		}
		empty[best], empty[left-1] = empty[left-1], empty[best]
		return false
	}
	return solve(len(empty))
}`,
          explanation: 'The minimum-remaining-values heuristic fails fast on dead ends; bitmasks make candidate computation a few instructions.',
          complexity: { time: 'Exponential worst case; milliseconds in practice', space: 'O(81)' },
        },
        {
          id: 'm30-t2-p4',
          tier: 'advanced',
          level: 4,
          kind: 'code',
          title: 'Palindrome partitioning of a hashtag',
          prompt: 'Return all ways to split s into palindromic substrings. Precompute isPal in O(n²).',
          hints: ['isPal[i][j] = s[i]==s[j] && (j−i < 2 || isPal[i+1][j−1]), filled for i from n−1 down.'],
          solution: `func Partition(s string) [][]string {
	n := len(s)
	isPal := make([][]bool, n)
	for i := range isPal {
		isPal[i] = make([]bool, n)
	}
	for i := n - 1; i >= 0; i-- {
		for j := i; j < n; j++ {
			isPal[i][j] = s[i] == s[j] && (j-i < 2 || isPal[i+1][j-1])
		}
	}
	var res [][]string
	var path []string
	var bt func(start int)
	bt = func(start int) {
		if start == n {
			res = append(res, slices.Clone(path))
			return
		}
		for end := start; end < n; end++ {
			if isPal[start][end] {
				path = append(path, s[start:end+1])
				bt(end + 1)
				path = path[:len(path)-1]
			}
		}
	}
	bt(0)
	return res
}`,
          explanation: 'Precomputation makes each palindrome check O(1); the backtracking enumerates prefixes.',
          complexity: { time: 'O(n · 2ⁿ) worst', space: 'O(n²)' },
          variation: 'Minimum number of cuts (DP, O(n²)).',
        },
      ],
    },
  ],
}
