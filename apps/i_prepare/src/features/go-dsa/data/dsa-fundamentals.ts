import type { Module } from '../types'

export const MODULE_18: Module = {
  id: 'm18',
  number: 18,
  track: 'dsa',
  title: 'DSA Fundamentals',
  shortTitle: 'DSA Basics',
  tagline: 'Arrays, strings, matrices, prefix sums, two pointers, sliding window and hashing — the patterns behind half of all interview problems.',
  topics: [
    {
      id: 'm18-t1',
      title: 'Arrays',
      summary: 'Contiguous memory, O(1) indexing, in-place transformations.',
      concept: [
        'An array stores elements contiguously, so element i is at base + i·size: O(1) random access and excellent cache locality. Insert/delete in the middle is O(n) (shifting).',
        'Core techniques: single pass with running state (max so far, best profit), in-place rewriting with a write index, reversal tricks (rotate = reverse three times), and index-as-hash when values are in [1, n].',
        'Always ask: sorted? duplicates? negatives? range of values? — they unlock different techniques.',
      ],
      why: 'Arrays (Go slices) are the default data structure; most "hard" problems are an array plus the right invariant.',
      whenToUse: ['Indexed access, iteration, cache-friendly scans', 'Fixed or append-mostly data'],
      whenNotToUse: ['Frequent inserts/deletes in the middle (consider linked list, balanced tree, or gap buffer).', 'Membership queries over large data (use a set).'],
      syntax: `best, minSoFar := 0, prices[0]
for _, p := range prices[1:] {
	best = max(best, p-minSoFar)
	minSoFar = min(minSoFar, p)
}`,
      example: {
        code: `// Rotate right by k in place, O(n) time, O(1) space.
func rotate(a []int, k int) {
	n := len(a)
	if n == 0 {
		return
	}
	k %= n
	slices.Reverse(a)
	slices.Reverse(a[:k])
	slices.Reverse(a[k:])
}
// [1 2 3 4 5], k=2 → reverse all [5 4 3 2 1] → [4 5 | 1 2 3]`,
        notes: ['k %= n handles k ≥ n.', 'Reversing the whole array puts the last k elements first (but reversed).', 'Reversing each part restores their internal order.'],
      },
      mistakes: ['Off-by-one on bounds.', 'Forgetting empty input.', 'Modifying a slice while iterating with indexes that shift.'],
      problems: [
        {
          id: 'm18-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Best day to sell stock',
          story: 'A trading app shows "best profit you could have made this month" from daily closing prices.',
          prompt: 'Write `MaxProfit(prices []int) int` — one buy then one sell later. Return 0 if no profit is possible.',
          hints: ['Track the minimum price seen so far.', 'At each day, profit = price − minSoFar.'],
          solution: `func MaxProfit(prices []int) int {
	if len(prices) == 0 {
		return 0
	}
	best, low := 0, prices[0]
	for _, p := range prices[1:] {
		best = max(best, p-low)
		low = min(low, p)
	}
	return best
}`,
          explanation: 'The best sell at day i pairs with the cheapest earlier day, which the running minimum tracks.',
          complexity: { time: 'O(n)', space: 'O(1)', best: 'O(n)', worst: 'O(n)' },
          variation: 'Unlimited transactions (sum of every positive day-to-day difference); then at most 2 transactions (state machine DP).',
        },
        {
          id: 'm18-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Move zero-stock items to the end',
          story: 'A warehouse dashboard lists SKU stock counts; out-of-stock (0) items must move to the end, keeping the order of the rest — in place.',
          prompt: 'Write `MoveZeros(a []int)` with O(n) time and O(1) space, minimising writes.',
          hints: ['Write index w for the next non-zero position.', 'Swap a[i] with a[w] when a[i] != 0 — zeros naturally drift right.'],
          solution: `func MoveZeros(a []int) {
	w := 0
	for i, v := range a {
		if v != 0 {
			if i != w {
				a[i], a[w] = a[w], a[i]
			}
			w++
		}
	}
}`,
          explanation: 'Invariant: a[:w] holds the non-zeros seen so far in order; a[w:i] are all zeros.',
          complexity: { time: 'O(n)', space: 'O(1)' },
          variation: 'Dutch national flag: partition into <pivot, ==pivot, >pivot in one pass.',
        },
        {
          id: 'm18-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Missing parcel number',
          story: 'Parcels in a batch are numbered 1..n+1 but one never arrived. The scanner gives you the n received numbers in random order.',
          prompt: 'Write `Missing(nums []int) int` in O(n) time, O(1) space. Give two approaches and say which is overflow-safe.',
          hints: ['Expected sum minus actual sum.', 'XOR all indexes 1..n+1 and all numbers — pairs cancel.'],
          solution: `func Missing(nums []int) int {
	x := 0
	for i, v := range nums {
		x ^= (i + 1) ^ v
	}
	return x ^ (len(nums) + 1)
}`,
          explanation: 'XOR cancels every number that appears in both the full range and the input, leaving the missing one. The sum approach n(n+1)/2 − Σ works too but can overflow for huge n in fixed-width ints; XOR cannot.',
          complexity: { time: 'O(n)', space: 'O(1)' },
          variation: 'Two parcels are missing. Find both in O(n), O(1) (XOR, then split by a set bit).',
        },
        {
          id: 'm18-t1-p4',
          tier: 'advanced',
          level: 4,
          kind: 'code',
          title: 'First missing positive ticket',
          prompt: 'Given an unsorted array (can contain negatives, duplicates, huge values), return the smallest missing positive integer in O(n) time and O(1) extra space.',
          hints: ['The answer is in [1, n+1].', 'Place each value v in [1, n] at index v−1 by swapping (cyclic sort).'],
          solution: `func FirstMissingPositive(a []int) int {
	n := len(a)
	for i := 0; i < n; i++ {
		for a[i] > 0 && a[i] <= n && a[a[i]-1] != a[i] {
			a[i], a[a[i]-1] = a[a[i]-1], a[i]
		}
	}
	for i, v := range a {
		if v != i+1 {
			return i + 1
		}
	}
	return n + 1
}`,
          explanation: 'Each swap places at least one value permanently, so the inner loop runs O(n) times overall. The duplicate check `a[a[i]-1] != a[i]` prevents infinite loops.',
          complexity: { time: 'O(n) amortised', space: 'O(1)', notes: 'Mutates the input — mention this to the interviewer.' },
        },
      ],
    },
    {
      id: 'm18-t2',
      title: 'Strings',
      summary: 'Counting, building, comparing — with UTF-8 awareness in Go.',
      concept: [
        'String problems are usually array problems over bytes or runes: frequency counts ([26]int or map[rune]int), two pointers (palindromes), sliding windows (substrings), hashing (anagrams).',
        'In Go, index bytes for ASCII inputs (fast) and convert to []rune for Unicode. Build results with strings.Builder.',
        'Comparison is O(min(len)) — hashing substrings (rolling hash / Rabin-Karp) makes repeated comparisons O(1).',
      ],
      why: 'Text processing — search, validation, parsing — is everywhere in backend systems.',
      whenToUse: ['[26]int counts for lowercase ASCII', 'Builder for output', 'Rolling hash for many substring comparisons'],
      whenNotToUse: ['Repeated `s[i:j]` comparisons in a nested loop when a hash or window works.'],
      syntax: `var cnt [26]int
for i := 0; i < len(s); i++ { cnt[s[i]-'a']++ }
var sb strings.Builder
sb.WriteByte('x')`,
      example: {
        code: `// Run-length encode "aaabccdddd" → "a3b1c2d4"
func RLE(s string) string {
	var sb strings.Builder
	for i := 0; i < len(s); {
		j := i
		for j < len(s) && s[j] == s[i] {
			j++
		}
		sb.WriteByte(s[i])
		sb.WriteString(strconv.Itoa(j - i))
		i = j
	}
	return sb.String()
}`,
        notes: ['Outer loop jumps i to the end of each run.', 'Every character is visited once overall → O(n).'],
      },
      mistakes: ['Byte indexing on Unicode input.', 'O(n²) concatenation.', 'Forgetting case-insensitivity requirements.'],
      problems: [
        {
          id: 'm18-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Is it an anagram?',
          story: 'A word game validates that the player’s word uses exactly the letters of the puzzle.',
          prompt: 'Write `IsAnagram(a, b string) bool` for lowercase ASCII in O(n) time with a fixed-size array.',
          hints: ['Lengths differ → false.', 'Increment for a, decrement for b, then all counts must be 0.'],
          solution: `func IsAnagram(a, b string) bool {
	if len(a) != len(b) {
		return false
	}
	var cnt [26]int
	for i := 0; i < len(a); i++ {
		cnt[a[i]-'a']++
		cnt[b[i]-'a']--
	}
	return cnt == [26]int{}
}`,
          explanation: 'Arrays are comparable in Go, so the final check is a single ==.',
          complexity: { time: 'O(n)', space: 'O(1) (26 counters)' },
          variation: 'Support full Unicode with map[rune]int and case folding.',
        },
        {
          id: 'm18-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Longest common prefix of routes',
          story: 'An API gateway groups routes like /api/v1/users, /api/v1/orders under their common prefix.',
          prompt: 'Write `CommonPrefix(paths []string) string`.',
          hints: ['Start with the first string as the candidate.', 'Shrink it while the next string does not start with it (strings.HasPrefix).'],
          solution: `func CommonPrefix(paths []string) string {
	if len(paths) == 0 {
		return ""
	}
	prefix := paths[0]
	for _, p := range paths[1:] {
		for !strings.HasPrefix(p, prefix) {
			prefix = prefix[:len(prefix)-1]
		}
		if prefix == "" {
			break
		}
	}
	return prefix
}`,
          explanation: 'The prefix only ever shrinks, so total work is bounded by the sum of lengths.',
          complexity: { time: 'O(total characters)', space: 'O(1) (prefix is a sub-slice)' },
          variation: 'Return the common prefix aligned to "/" segments (so /api/v1/u and /api/v1/o → /api/v1/).',
        },
        {
          id: 'm18-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Compress a chat message',
          story: 'A messaging app compresses repeated characters ("heyyyyy" → "hey5") but only if the result is shorter.',
          prompt: 'Write `Compress(s string) string`: runs of length ≥ 2 become char+count; return the original if not shorter. ASCII input. Single pass, one allocation.',
          hints: ['Scan runs like RLE.', 'Pre-size the builder with sb.Grow(len(s)) and abort early once it reaches len(s).'],
          solution: `func Compress(s string) string {
	var sb strings.Builder
	sb.Grow(len(s))
	for i := 0; i < len(s); {
		j := i
		for j < len(s) && s[j] == s[i] {
			j++
		}
		sb.WriteByte(s[i])
		if j-i > 1 {
			sb.WriteString(strconv.Itoa(j - i))
		}
		if sb.Len() >= len(s) {
			return s
		}
		i = j
	}
	return sb.String()
}`,
          explanation: 'Early exit avoids wasted work; Grow means one allocation.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Write the decompressor and handle digits in the original text (escape scheme).',
        },
      ],
    },
    {
      id: 'm18-t3',
      title: 'Matrix',
      summary: '2D traversal patterns: spiral, rotation, search in sorted matrix.',
      concept: [
        'In Go, a matrix is `[][]T` (rows can differ in length — validate) or a flat `[]T` with index r*cols+c (one allocation, cache-friendly).',
        'Patterns: boundary shrinking (spiral), transpose+reverse (rotate 90°), staircase search in row/column-sorted matrices, direction vectors for neighbours.',
        'Grid problems are often graph problems in disguise (Module 25).',
      ],
      why: 'Images, game boards, maps, spreadsheets and DP tables are all matrices.',
      whenToUse: ['Flat slices for large fixed grids', 'Direction arrays `dirs := [4][2]int{{0,1},{1,0},{0,-1},{-1,0}}`'],
      whenNotToUse: ['Dense matrices for sparse data (use a map of coordinates).'],
      syntax: `grid := make([][]int, rows)
for i := range grid { grid[i] = make([]int, cols) }
dirs := [4][2]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}`,
      example: {
        code: `// Rotate n×n matrix 90° clockwise in place.
func rotate(m [][]int) {
	n := len(m)
	for i := 0; i < n; i++ { // transpose
		for j := i + 1; j < n; j++ {
			m[i][j], m[j][i] = m[j][i], m[i][j]
		}
	}
	for _, row := range m { // reverse each row
		slices.Reverse(row)
	}
}`,
        notes: ['Transpose swaps across the main diagonal (j starts at i+1 so each pair swaps once).', 'Reversing rows completes a clockwise rotation.'],
      },
      mistakes: ['Confusing rows/cols (m[r][c]).', 'Assuming non-empty matrix.', 'Transposing with j from 0 (swaps twice → no change).'],
      problems: [
        {
          id: 'm18-t3-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Spiral order of a seating chart',
          prompt: 'Write `Spiral(m [][]int) []int` returning elements in clockwise spiral order.',
          hints: ['Keep top, bottom, left, right bounds.', 'After each side, shrink the bound and check it has not crossed.'],
          solution: `func Spiral(m [][]int) []int {
	if len(m) == 0 {
		return nil
	}
	top, bottom, left, right := 0, len(m)-1, 0, len(m[0])-1
	out := make([]int, 0, len(m)*len(m[0]))
	for top <= bottom && left <= right {
		for c := left; c <= right; c++ {
			out = append(out, m[top][c])
		}
		top++
		for r := top; r <= bottom; r++ {
			out = append(out, m[r][right])
		}
		right--
		if top <= bottom {
			for c := right; c >= left; c-- {
				out = append(out, m[bottom][c])
			}
			bottom--
		}
		if left <= right {
			for r := bottom; r >= top; r-- {
				out = append(out, m[r][left])
			}
			left++
		}
	}
	return out
}`,
          explanation: 'The two inner checks prevent re-visiting a single remaining row or column.',
          complexity: { time: 'O(R·C)', space: 'O(1) extra besides output' },
        },
        {
          id: 'm18-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Find a price in a sorted price grid',
          story: 'A flight search caches a fare grid where each row (departure day) and each column (return day) is sorted ascending.',
          prompt: 'Write `Search(m [][]int, target int) bool` in O(R + C).',
          hints: ['Start at the top-right corner.', 'If value > target move left; if < target move down.'],
          solution: `func Search(m [][]int, target int) bool {
	if len(m) == 0 {
		return false
	}
	r, c := 0, len(m[0])-1
	for r < len(m) && c >= 0 {
		switch v := m[r][c]; {
		case v == target:
			return true
		case v > target:
			c--
		default:
			r++
		}
	}
	return false
}`,
          explanation: 'From the top-right, each comparison eliminates a whole row or column.',
          complexity: { time: 'O(R + C)', space: 'O(1)' },
          variation: 'Count how many fares are ≤ target in O(R + C) (basis for k-th smallest in a sorted matrix).',
        },
        {
          id: 'm18-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Zero out faulty sensor rows and columns',
          story: 'In a sensor grid, if any sensor reads 0 (failed), its entire row and column must be invalidated.',
          prompt: 'Write `SetZeroes(m [][]int)` in place with O(1) extra space.',
          hints: ['Use the first row and first column as marker storage.', 'Remember separately whether the first row/col themselves had a zero.'],
          solution: `func SetZeroes(m [][]int) {
	R, C := len(m), len(m[0])
	firstRow, firstCol := false, false
	for c := 0; c < C; c++ {
		if m[0][c] == 0 { firstRow = true }
	}
	for r := 0; r < R; r++ {
		if m[r][0] == 0 { firstCol = true }
	}
	for r := 1; r < R; r++ {
		for c := 1; c < C; c++ {
			if m[r][c] == 0 {
				m[r][0], m[0][c] = 0, 0
			}
		}
	}
	for r := 1; r < R; r++ {
		for c := 1; c < C; c++ {
			if m[r][0] == 0 || m[0][c] == 0 {
				m[r][c] = 0
			}
		}
	}
	if firstRow {
		for c := 0; c < C; c++ { m[0][c] = 0 }
	}
	if firstCol {
		for r := 0; r < R; r++ { m[r][0] = 0 }
	}
}`,
          explanation: 'The first row/column become the O(R+C) marker arrays for free; two booleans save their own state.',
          complexity: { time: 'O(R·C)', space: 'O(1)' },
        },
      ],
    },
    {
      id: 'm18-t4',
      title: 'Prefix Sum',
      summary: 'Precompute once, answer range queries in O(1).',
      concept: [
        'prefix[i] = a[0] + … + a[i−1] (with prefix[0] = 0). Then sum(a[l..r]) = prefix[r+1] − prefix[l].',
        'Prefix sum + hash map counts subarrays with a given sum: a subarray (i, j] sums to k iff prefix[j] − prefix[i] = k.',
        '2D prefix sums answer rectangle sums in O(1): P[r+1][c+1] = a[r][c] + P[r][c+1] + P[r+1][c] − P[r][c]. Difference arrays do the reverse: O(1) range updates, then one prefix pass.',
      ],
      why: 'Turns repeated O(n) range sums into O(1) each — the difference between timing out and passing.',
      whenToUse: ['Many range-sum queries on static data', 'Subarray sum = k problems', 'Batch range increments (difference array)'],
      whenNotToUse: ['Data that changes between queries (use Fenwick/segment tree).'],
      syntax: `p := make([]int, len(a)+1)
for i, v := range a { p[i+1] = p[i] + v }
sum := p[r+1] - p[l]`,
      example: {
        code: `a := []int{3, 1, 4, 1, 5}
p := []int{0, 3, 4, 8, 9, 14}
// sum of a[1..3] = 1+4+1 = p[4]-p[1] = 9-3 = 6`,
        notes: ['The extra leading 0 removes special cases for l = 0.'],
      },
      mistakes: ['Off-by-one between inclusive/exclusive indexes.', 'Overflow on large sums (use int64).', 'Forgetting count[0] = 1 in the hash-map technique.'],
      problems: [
        {
          id: 'm18-t4-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Daily revenue range queries',
          story: 'A finance dashboard answers thousands of "revenue between day l and day r" queries per second over a fixed year of data.',
          prompt: 'Write `type Revenue struct` with `NewRevenue(daily []int64) *Revenue` and `Sum(l, r int) int64` (inclusive) in O(1).',
          hints: ['Store the prefix array.'],
          solution: `type Revenue struct{ p []int64 }

func NewRevenue(daily []int64) *Revenue {
	p := make([]int64, len(daily)+1)
	for i, v := range daily {
		p[i+1] = p[i] + v
	}
	return &Revenue{p}
}

func (r *Revenue) Sum(l, rr int) int64 { return r.p[rr+1] - r.p[l] }`,
          explanation: 'O(n) preprocessing, O(1) per query.',
          complexity: { time: 'Build O(n), query O(1)', space: 'O(n)' },
        },
        {
          id: 'm18-t4-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Count transaction windows summing to K',
          story: 'Fraud analysts look for contiguous sequences of transactions that sum exactly to a laundering threshold K (amounts can be negative — refunds).',
          prompt: 'Write `CountSubarrays(a []int, k int) int` in O(n).',
          hints: ['Running prefix sum s; you need earlier prefixes equal to s − k.', 'Map from prefix value → how many times seen; start with {0: 1}.'],
          solution: `func CountSubarrays(a []int, k int) int {
	seen := map[int]int{0: 1}
	s, count := 0, 0
	for _, v := range a {
		s += v
		count += seen[s-k]
		seen[s]++
	}
	return count
}`,
          explanation: 'Each earlier prefix equal to s−k marks a start where the window to here sums to k. Negatives break sliding window, but not this.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Return the longest such window instead of the count (store first index of each prefix).',
        },
        {
          id: 'm18-t4-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Hotel booking occupancy (difference array)',
          story: 'A booking system has m reservations [checkIn, checkOut) over n days and must report occupancy per day.',
          prompt: 'Write `Occupancy(n int, bookings [][2]int) []int` in O(n + m).',
          hints: ['diff[in]++, diff[out]-- for each booking.', 'Prefix-sum diff to get occupancy.'],
          solution: `func Occupancy(n int, bookings [][2]int) []int {
	diff := make([]int, n+1)
	for _, b := range bookings {
		diff[b[0]]++
		diff[b[1]]--
	}
	occ := make([]int, n)
	run := 0
	for d := 0; d < n; d++ {
		run += diff[d]
		occ[d] = run
	}
	return occ
}`,
          explanation: 'Each booking is two O(1) updates; one pass materialises all days.',
          complexity: { time: 'O(n + m)', space: 'O(n)' },
          variation: 'Days span 10⁹ (sparse): use coordinate compression or a sorted sweep of events.',
        },
      ],
    },
    {
      id: 'm18-t5',
      title: 'Two Pointers',
      summary: 'Two indexes moving with an invariant replace a nested loop.',
      concept: [
        'Opposite ends: on sorted data, move left/right inward based on a comparison (pair sum, container with most water, palindromes).',
        'Same direction (fast/slow): a read pointer scans, a write pointer builds the result in place (dedupe, filter), or a fast pointer detects cycles.',
        'The key is the invariant that justifies discarding candidates when a pointer moves.',
      ],
      why: 'Turns O(n²) pair searches into O(n) with O(1) memory.',
      whenToUse: ['Sorted arrays (or sort first, O(n log n))', 'In-place compaction', 'Merging two sorted sequences'],
      whenNotToUse: ['Unsorted data where you need original indexes and can’t sort (use a hash map).'],
      syntax: `l, r := 0, len(a)-1
for l < r {
	switch s := a[l] + a[r]; {
	case s == target: return l, r
	case s < target: l++
	default: r--
	}
}`,
      example: {
        code: `// Remove duplicates from sorted slice in place; return new length.
func dedupe(a []int) int {
	if len(a) == 0 {
		return 0
	}
	w := 1
	for r := 1; r < len(a); r++ {
		if a[r] != a[w-1] {
			a[w] = a[r]
			w++
		}
	}
	return w
}`,
        notes: ['a[:w] always holds unique values.', 'Compare with the last written value, not the previous read value.'],
      },
      mistakes: ['Using two pointers on unsorted input when the logic assumes order.', 'Infinite loops when neither pointer moves.', 'Skipping duplicates incorrectly in 3-sum.'],
      problems: [
        {
          id: 'm18-t5-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Two gift cards',
          story: 'A shopper has a list of gift card values sorted ascending and wants exactly two cards summing to the cart total.',
          prompt: 'Write `PairSum(cards []int, total int) (int, int, bool)` returning indexes, O(n), O(1).',
          hints: ['Start at both ends.', 'Sum too small → move left up; too big → move right down.'],
          solution: `func PairSum(cards []int, total int) (int, int, bool) {
	l, r := 0, len(cards)-1
	for l < r {
		s := cards[l] + cards[r]
		switch {
		case s == total:
			return l, r, true
		case s < total:
			l++
		default:
			r--
		}
	}
	return -1, -1, false
}`,
          explanation: 'If s < total, cards[l] cannot pair with anything ≤ cards[r], so l is discarded; symmetric for r.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
        {
          id: 'm18-t5-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Three-party settlement (3-sum)',
          story: 'A payments network looks for triples of balance adjustments that net to zero to settle together.',
          prompt: 'Write `ThreeSum(a []int) [][3]int` returning all unique triples summing to 0.',
          hints: ['Sort, fix i, then two-pointer on the rest.', 'Skip duplicate values for i, and for l/r after a match.'],
          solution: `func ThreeSum(a []int) [][3]int {
	slices.Sort(a)
	var out [][3]int
	for i := 0; i < len(a)-2; i++ {
		if i > 0 && a[i] == a[i-1] {
			continue
		}
		l, r := i+1, len(a)-1
		for l < r {
			s := a[i] + a[l] + a[r]
			switch {
			case s < 0:
				l++
			case s > 0:
				r--
			default:
				out = append(out, [3]int{a[i], a[l], a[r]})
				for l < r && a[l] == a[l+1] { l++ }
				for l < r && a[r] == a[r-1] { r-- }
				l++
				r--
			}
		}
	}
	return out
}`,
          explanation: 'Sorting enables both the two-pointer scan and duplicate skipping.',
          complexity: { time: 'O(n²)', space: 'O(1) extra (sort in place)' },
          variation: 'k-sum generalisation with recursion down to 2-sum.',
        },
        {
          id: 'm18-t5-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Largest water tank between towers',
          prompt: 'Given heights of vertical walls, pick two walls forming the container with the most water: `MaxArea(h []int) int` in O(n). Prove why moving the shorter wall is safe.',
          hints: ['Area = (r − l) · min(h[l], h[r]).', 'Moving the taller wall can never increase min height but always shrinks width.'],
          solution: `func MaxArea(h []int) int {
	l, r, best := 0, len(h)-1, 0
	for l < r {
		best = max(best, (r-l)*min(h[l], h[r]))
		if h[l] < h[r] {
			l++
		} else {
			r--
		}
	}
	return best
}`,
          explanation: 'Any container using the shorter wall l with some r\' < r has smaller width and height ≤ h[l], so it cannot beat the current one — l can be discarded.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
      ],
    },
    {
      id: 'm18-t6',
      title: 'Sliding Window',
      summary: 'Maintain a window [l, r) and update incrementally.',
      concept: [
        'Fixed-size window: add the entering element, remove the leaving one — O(1) per step instead of recomputing.',
        'Variable-size window: expand r; while the window violates the constraint, shrink l. Works when the constraint is monotonic (adding elements can only make it "more violated").',
        'Track window state with counts (map/array), a running sum, or a deque (for max/min — Module 21).',
      ],
      why: 'Substring/subarray problems with a constraint become O(n).',
      whenToUse: ['Longest/shortest subarray satisfying a monotonic condition', 'Rolling averages, rate limits'],
      whenNotToUse: ['Negative numbers with sum constraints (window shrink logic breaks — use prefix sums).'],
      syntax: `l := 0
for r := 0; r < len(s); r++ {
	add(s[r])
	for invalid() {
		remove(s[l])
		l++
	}
	best = max(best, r-l+1)
}`,
      example: {
        code: `// Max sum of any k consecutive days.
func maxK(a []int, k int) int {
	sum := 0
	for i := 0; i < k; i++ {
		sum += a[i]
	}
	best := sum
	for r := k; r < len(a); r++ {
		sum += a[r] - a[r-k]
		best = max(best, sum)
	}
	return best
}`,
        notes: ['Initial window [0, k).', 'Each step adds a[r] and drops a[r−k].'],
      },
      mistakes: ['Not shrinking enough (if vs while).', 'Off-by-one window length.', 'Using it when the constraint is not monotonic.'],
      problems: [
        {
          id: 'm18-t6-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Longest session without repeated pages',
          story: 'Analytics wants the longest streak of page visits in which no page repeats.',
          prompt: 'Write `LongestUnique(pages []string) int` in O(n).',
          hints: ['Map page → last index seen.', 'If a page was seen inside the window, jump l past it.'],
          solution: `func LongestUnique(pages []string) int {
	last := map[string]int{}
	best, l := 0, 0
	for r, p := range pages {
		if i, ok := last[p]; ok && i >= l {
			l = i + 1
		}
		last[p] = r
		best = max(best, r-l+1)
	}
	return best
}`,
          explanation: 'Jumping l directly (instead of shrinking one by one) keeps it O(n); the `i >= l` check ignores occurrences already outside the window.',
          complexity: { time: 'O(n)', space: 'O(distinct pages)' },
        },
        {
          id: 'm18-t6-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Shortest burst over a spend limit',
          story: 'Card fraud rule: find the shortest run of consecutive (positive) transactions whose total ≥ limit.',
          prompt: 'Write `MinLenAtLeast(a []int, limit int) int` (0 if none), O(n). Amounts are positive.',
          hints: ['Expand r, add to sum; while sum ≥ limit record length and shrink.'],
          solution: `func MinLenAtLeast(a []int, limit int) int {
	best, sum, l := 0, 0, 0
	for r, v := range a {
		sum += v
		for sum >= limit {
			if best == 0 || r-l+1 < best {
				best = r - l + 1
			}
			sum -= a[l]
			l++
		}
	}
	return best
}`,
          explanation: 'With positive values, shrinking only decreases the sum — the monotonic property sliding window needs.',
          complexity: { time: 'O(n) (each index enters and leaves once)', space: 'O(1)' },
          variation: 'Amounts can be negative (refunds). Why does this break, and what O(n log n) approach works? (prefix sums + monotonic deque)',
        },
        {
          id: 'm18-t6-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Minimum window containing all required items',
          story: 'A grocery delivery picker walks an aisle sequence and needs the shortest contiguous stretch containing every item on the order (with multiplicities).',
          prompt: 'Write `MinWindow(s, t string) string` (ASCII) in O(|s| + |t|).',
          hints: ['need[c] counts from t; `missing` = len(t).', 'Expand r decrementing need; when missing == 0, shrink l while the window stays valid.'],
          solution: `func MinWindow(s, t string) string {
	if len(t) == 0 || len(t) > len(s) {
		return ""
	}
	var need [128]int
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}
	missing, l, bestL, bestLen := len(t), 0, 0, -1
	for r := 0; r < len(s); r++ {
		if need[s[r]] > 0 {
			missing--
		}
		need[s[r]]--
		for missing == 0 {
			if bestLen == -1 || r-l+1 < bestLen {
				bestL, bestLen = l, r-l+1
			}
			need[s[l]]++
			if need[s[l]] > 0 {
				missing++
			}
			l++
		}
	}
	if bestLen == -1 {
		return ""
	}
	return s[bestL : bestL+bestLen]
}`,
          explanation: 'need[c] < 0 means surplus copies in the window; a character only becomes "missing" again when its count goes back above 0.',
          complexity: { time: 'O(|s| + |t|)', space: 'O(1) (128 counters)' },
        },
      ],
    },
    {
      id: 'm18-t7',
      title: 'Hashing and Hash Maps',
      summary: 'O(1) average lookup; how hash tables work and fail.',
      concept: [
        'A hash table maps keys to buckets via a hash function; collisions are resolved by chaining or open addressing. Average O(1) insert/lookup/delete; worst O(n) with many collisions. Load factor triggers resizing (amortised O(1)).',
        'Go maps use randomised seeds (prevents hash-flooding attacks) and, since Go 1.24, a Swiss-table design.',
        'Patterns: complement lookup (two-sum), frequency counting, first-unique, grouping by canonical key, de-duplication, memoisation.',
      ],
      why: 'Trading memory for time: most O(n²) brute forces become O(n) with a map.',
      whenToUse: ['Membership, counting, indexing by key', 'Caching computed results'],
      whenNotToUse: ['Ordered iteration or range queries (use sorted slice / tree).', 'Tiny datasets where a linear scan is faster.'],
      syntax: `idx := make(map[int]int, len(a))
for i, v := range a {
	if j, ok := idx[target-v]; ok { return j, i }
	idx[v] = i
}`,
      example: {
        code: `// First non-repeating character index.
func firstUnique(s string) int {
	var cnt [26]int
	for i := 0; i < len(s); i++ {
		cnt[s[i]-'a']++
	}
	for i := 0; i < len(s); i++ {
		if cnt[s[i]-'a'] == 1 {
			return i
		}
	}
	return -1
}`,
        notes: ['Two passes: count, then find the first with count 1.', 'An array is a perfect hash when keys are small integers.'],
      },
      mistakes: ['Assuming map iteration order.', 'Using floats as keys.', 'Forgetting the worst case when keys are attacker-controlled (in custom hash tables).'],
      problems: [
        {
          id: 'm18-t7-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Package that appears only once',
          story: 'Every package in a warehouse is scanned exactly twice (in and out) — except one that never left.',
          prompt: 'Write `Single(ids []int) int` two ways: with a map, and in O(1) space.',
          hints: ['Map: count and find count 1.', 'O(1): XOR all values — pairs cancel.'],
          solution: `func SingleMap(ids []int) int {
	cnt := map[int]int{}
	for _, id := range ids {
		cnt[id]++
	}
	for id, c := range cnt {
		if c == 1 {
			return id
		}
	}
	return -1
}

func Single(ids []int) int {
	x := 0
	for _, id := range ids {
		x ^= id
	}
	return x
}`,
          explanation: 'a ^ a = 0 and XOR is commutative/associative, so all paired IDs cancel.',
          complexity: { time: 'O(n) both', space: 'Map O(n); XOR O(1)' },
        },
        {
          id: 'm18-t7-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Duplicate transaction detector',
          story: 'A bank receives transactions (accountID, amount, timestamp). Two with the same account and amount within 60 seconds are duplicates.',
          prompt: 'Write `Duplicates(txs []Tx) []int` returning indexes of duplicates (the later one), txs sorted by time. O(n).',
          hints: ['Key = struct{account string; amount int64}.', 'Map key → last timestamp seen.'],
          solution: `type Tx struct {
	Account string
	Amount  int64
	At      time.Time
}

func Duplicates(txs []Tx) []int {
	type key struct {
		account string
		amount  int64
	}
	last := make(map[key]time.Time, len(txs))
	var dups []int
	for i, tx := range txs {
		k := key{tx.Account, tx.Amount}
		if t, ok := last[k]; ok && tx.At.Sub(t) <= time.Minute {
			dups = append(dups, i)
		}
		last[k] = tx.At
	}
	return dups
}`,
          explanation: 'Struct keys make composite hashing trivial in Go. Storing only the last timestamp suffices because input is time-ordered.',
          complexity: { time: 'O(n)', space: 'O(distinct keys)', notes: 'For an unbounded stream, evict keys older than 60 s (e.g. with a time-bucketed ring) to bound memory.' },
          variation: 'Make it streaming with bounded memory over millions of accounts.',
        },
        {
          id: 'm18-t7-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Longest consecutive order-ID streak',
          prompt: 'Given unsorted order IDs, return the length of the longest run of consecutive integers (e.g. 100, 4, 200, 1, 3, 2 → 4) in O(n).',
          hints: ['Put everything in a set.', 'Only start counting from numbers whose predecessor is NOT in the set.'],
          solution: `func LongestStreak(ids []int) int {
	set := make(map[int]struct{}, len(ids))
	for _, v := range ids {
		set[v] = struct{}{}
	}
	best := 0
	for v := range set {
		if _, hasPrev := set[v-1]; hasPrev {
			continue
		}
		n := 1
		for {
			if _, ok := set[v+n]; !ok {
				break
			}
			n++
		}
		best = max(best, n)
	}
	return best
}`,
          explanation: 'Each number is visited by the inner loop only from its run’s start, so total work is O(n) despite the nested loop.',
          complexity: { time: 'O(n) average', space: 'O(n)' },
        },
      ],
    },
  ],
}
