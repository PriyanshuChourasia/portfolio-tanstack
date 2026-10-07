import type { Module } from '../types'

export const MODULE_32: Module = {
  id: 'm32',
  number: 32,
  track: 'dsa',
  title: 'Greedy Algorithms',
  shortTitle: 'Greedy',
  tagline: 'Interval scheduling, meeting rooms, merge intervals, platforms, fractional knapsack, job sequencing, Huffman — and WHY each greedy choice is valid.',
  topics: [
    {
      id: 'm32-t1',
      title: 'Interval Greedy: Activity Selection, Merge Intervals, Meeting Rooms, Platforms',
      summary: 'Sort by the right key, then make the locally best choice.',
      concept: [
        'A greedy algorithm commits to the locally best choice and never revisits it. It is correct only if you can prove the greedy choice is part of SOME optimal solution (exchange argument) and the remaining problem has the same structure.',
        'Activity selection / max non-overlapping intervals: sort by END time, take each interval that starts after the last taken ends. Exchange argument: the earliest-finishing interval leaves the most room; swapping it into any optimal solution keeps it optimal.',
        'Merge intervals: sort by start, extend the current block while the next starts ≤ current end.',
        'Meeting rooms / minimum platforms: sweep sorted start and end events; the max number of simultaneous intervals is the answer.',
      ],
      why: 'Calendars, train platforms, CPU reservations and ad slots are interval problems; greedy gives O(n log n) solutions.',
      whenToUse: ['Interval scheduling and covering', 'When an exchange argument proves the choice'],
      whenNotToUse: ['When a counterexample shows greedy fails (0/1 knapsack, coin change with arbitrary coins) — use DP.'],
      syntax: `slices.SortFunc(iv, func(a, b [2]int) int { return a[1] - b[1] }) // by end
count, lastEnd := 0, math.MinInt
for _, x := range iv {
	if x[0] >= lastEnd { count++; lastEnd = x[1] }
}`,
      example: {
        code: `intervals: [1,3] [2,4] [3,5] [6,7]
sorted by end: [1,3] [2,4] [3,5] [6,7]
take [1,3]; skip [2,4] (starts 2 < 3); take [3,5]; take [6,7] → 3`,
        notes: ['Sorting by START instead would pick [1,3] then… same here, but [1,10] [2,3] [4,5] breaks start-sorting.'],
      },
      mistakes: ['Sorting by the wrong key (start or length).', 'Touching intervals: is [1,3] then [3,5] overlapping? Define it.', 'Assuming greedy works without a proof.'],
      problems: [
        {
          id: 'm32-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Which sort key?',
          prompt: 'To maximise the number of non-overlapping talks scheduled in one hall, sort talks by…',
          check: { options: ['end time ascending', 'start time ascending', 'duration ascending', 'end time descending'], answerIndex: 0 },
          hints: ['Counterexample for duration: [1,5] [4,6] [5,10] — the shortest [4,6] blocks two others.'],
          solution: 'End time ascending.',
          explanation: 'Taking the talk that ends first leaves the maximum remaining time; any optimal schedule can swap its first talk for this one without losing a talk (exchange argument).',
        },
        {
          id: 'm32-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Merge maintenance windows',
          story: 'A cloud provider merges overlapping maintenance windows before notifying customers.',
          prompt: 'Write `Merge(windows [][2]int) [][2]int` (closed intervals; touching windows merge).',
          hints: ['Sort by start; compare each start with the last merged end.'],
          solution: `func Merge(w [][2]int) [][2]int {
	if len(w) == 0 {
		return nil
	}
	slices.SortFunc(w, func(a, b [2]int) int { return a[0] - b[0] })
	out := [][2]int{w[0]}
	for _, x := range w[1:] {
		last := &out[len(out)-1]
		if x[0] <= last[1] {
			last[1] = max(last[1], x[1])
		} else {
			out = append(out, x)
		}
	}
	return out
}`,
          explanation: 'After sorting by start, any interval overlapping the current block must start before the block ends. Taking a pointer to the last element updates it in place.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
          variation: 'Insert a new window into an already merged, sorted list in O(n) without re-sorting.',
        },
        {
          id: 'm32-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Minimum railway platforms',
          story: 'A station must know how many platforms it needs given arrival and departure times (a train departing at t frees the platform for a train arriving at t+1, not at t).',
          prompt: 'Write `Platforms(arr, dep []int) int` with the two-pointer sweep. Prove why it computes the maximum overlap.',
          hints: ['Sort arr and dep separately.', 'If next arrival ≤ next departure, a platform is needed; else one frees up.'],
          solution: `func Platforms(arr, dep []int) int {
	a, d := slices.Clone(arr), slices.Clone(dep)
	slices.Sort(a)
	slices.Sort(d)
	need, best, j := 0, 0, 0
	for i := 0; i < len(a); i++ {
		for j < len(d) && d[j] < a[i] {
			need--
			j++
		}
		need++
		best = max(best, need)
	}
	return best
}`,
          explanation: 'Processing events in time order, `need` equals the number of trains present; its maximum is the minimum platforms required — fewer would put two trains on one platform at that moment. Pairing of specific arrivals/departures does not matter, only counts.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
        },
      ],
    },
    {
      id: 'm32-t2',
      title: 'Exchange-Argument Greedy: Fractional Knapsack, Job Sequencing, Huffman Coding',
      summary: 'Ratios, deadlines and optimal prefix codes.',
      concept: [
        'Fractional knapsack: sort by value/weight descending and take as much as fits (fractions allowed). Valid because any unit of capacity is best spent on the highest-ratio item. (0/1 knapsack is NOT greedy-solvable.)',
        'Job sequencing with deadlines: sort jobs by profit descending; schedule each in the latest free slot ≤ its deadline (DSU makes slot finding fast).',
        'Huffman coding: repeatedly merge the two least frequent symbols (min-heap). Produces an optimal prefix-free code; exchange argument: the two rarest symbols can always be deepest siblings.',
      ],
      why: 'Compression (gzip/deflate uses Huffman), scheduling with deadlines and resource allocation.',
      whenToUse: ['Divisible resources', 'Unit-time jobs with deadlines', 'Building prefix codes'],
      whenNotToUse: ['Indivisible items with weights — use DP.'],
      syntax: `slices.SortFunc(items, func(a, b Item) int {
	return cmp.Compare(b.Value*a.Weight, a.Value*b.Weight) // ratio desc without division
})`,
      example: {
        code: `Huffman for freq a:5 b:9 c:12 d:13 e:16 f:45
merge a+b=14; c+d=25; 14+e=30; 25+30=55; f+55=100
codes: f=0, c=100, d=101, a=1100, b=1101, e=111`,
        notes: ['Frequent symbols get short codes; no code is a prefix of another.'],
      },
      mistakes: ['Float precision when comparing ratios (cross-multiply).', 'Applying fractional greedy to 0/1 problems.'],
      problems: [
        {
          id: 'm32-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Fill a tanker with the most valuable fuels',
          story: 'A tanker of capacity C can carry several fuel types (available volume, total value); partial loads are allowed.',
          prompt: 'Write `MaxValue(capacity float64, fuels []Fuel) float64` with `type Fuel struct{ Volume, Value float64 }`.',
          hints: ['Sort by Value/Volume descending.'],
          solution: `type Fuel struct{ Volume, Value float64 }

func MaxValue(capacity float64, fuels []Fuel) float64 {
	f := slices.Clone(fuels)
	slices.SortFunc(f, func(a, b Fuel) int {
		return cmp.Compare(b.Value/b.Volume, a.Value/a.Volume)
	})
	total := 0.0
	for _, x := range f {
		if capacity <= 0 {
			break
		}
		take := min(capacity, x.Volume)
		total += take * x.Value / x.Volume
		capacity -= take
	}
	return total
}`,
          explanation: 'Each unit of volume goes to the best remaining ratio; swapping any lower-ratio unit for a higher one never decreases value.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
        },
        {
          id: 'm32-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Ad slot sequencing with deadlines',
          story: 'Each ad takes one time slot, has a deadline slot and a payout. Maximise payout.',
          prompt: 'Write `MaxPayout(ads [][2]int) int` where ad = {deadline, profit}, deadlines ≥ 1. Use DSU to find the latest free slot.',
          hints: ['parent[t] points to the latest free slot ≤ t; slot 0 means none.', 'After using slot t, union t with t−1.'],
          solution: `func MaxPayout(ads [][2]int) int {
	slices.SortFunc(ads, func(a, b [2]int) int { return b[1] - a[1] })
	maxD := 0
	for _, a := range ads {
		maxD = max(maxD, a[0])
	}
	parent := make([]int, maxD+1)
	for i := range parent {
		parent[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if parent[x] != x {
			parent[x] = find(parent[x])
		}
		return parent[x]
	}
	total := 0
	for _, a := range ads {
		if slot := find(a[0]); slot > 0 {
			total += a[1]
			parent[slot] = slot - 1
		}
	}
	return total
}`,
          explanation: 'Taking the most profitable job first and placing it as LATE as possible keeps earlier slots free for jobs with tighter deadlines (exchange argument).',
          complexity: { time: 'O(n log n + n α(n))', space: 'O(max deadline)' },
        },
        {
          id: 'm32-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Huffman code lengths',
          story: 'A log compressor wants optimal code lengths per symbol.',
          prompt: 'Write `HuffmanCost(freq []int) int` returning the total encoded length (Σ freq·depth) using a min-heap: each merge adds (a + b) to the cost.',
          hints: ['Total cost = sum of all merged weights.'],
          solution: `func HuffmanCost(freq []int) int {
	if len(freq) == 1 {
		return freq[0] // a single symbol still needs 1 bit per occurrence
	}
	h := NewMinHeap(freq)
	cost := 0
	for len(h.a) > 1 {
		a, _ := h.Pop()
		b, _ := h.Pop()
		cost += a + b
		h.Push(a + b)
	}
	return cost
}`,
          explanation: 'Every merge pushes the merged symbols one level deeper, adding their combined frequency to the total bits — so summing merge weights equals Σ freq·depth.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
          variation: 'Produce the actual codes by building the tree (nodes with left/right) and DFS-ing.',
        },
      ],
    },
  ],
}

export const MODULE_33: Module = {
  id: 'm33',
  number: 33,
  track: 'dsa',
  title: 'Bit Manipulation',
  shortTitle: 'Bits',
  tagline: '& | ^ << >> &^ in Go; set/clear/toggle, popcount, powers of two, XOR tricks and subsets via masks.',
  topics: [
    {
      id: 'm33-t1',
      title: 'Bitwise Operators, Tricks and Bitmask Subsets',
      summary: 'Treat integers as arrays of booleans.',
      concept: [
        'Go operators: `&` AND, `|` OR, `^` XOR (binary) / NOT (unary), `&^` AND NOT (bit clear — unique to Go), `<<` `>>` shifts (>> is arithmetic for signed, logical for unsigned).',
        'Idioms: test bit i: `x>>i&1 == 1` or `x&(1<<i) != 0`; set: `x |= 1<<i`; clear: `x &^= 1<<i`; toggle: `x ^= 1<<i`; lowest set bit: `x & -x`; clear lowest: `x & (x-1)`; power of two: `x > 0 && x&(x-1) == 0`.',
        'XOR: a^a = 0, a^0 = a, commutative/associative → finds the unique element, swaps without temp, detects differences.',
        '`math/bits`: OnesCount, LeadingZeros, TrailingZeros, Len, RotateLeft — compiled to single CPU instructions.',
        'Subsets of n items ↔ integers 0..2ⁿ−1; iterate submasks of m with `for s := m; s > 0; s = (s - 1) & m`.',
      ],
      why: 'Compact flags, fast set operations, hashing, permissions, network masks, and many O(1)-space tricks.',
      whenToUse: ['Flags and permissions', 'Small sets (≤ 64 elements) as uint64', 'Low-level protocols and hashing'],
      whenNotToUse: ['When clarity matters more than nanoseconds — a []bool or map is more readable.'],
      syntax: `x := uint8(0b1011_0010)
x&1            // 0 → even
x |= 1 << 0    // set bit 0
x &^= 1 << 4   // clear bit 4
x ^= 1 << 7    // toggle bit 7
bits.OnesCount8(x)`,
      example: {
        code: `package main

import (
	"fmt"
	"math/bits"
)

func main() {
	x := uint8(0b0110_1000)
	fmt.Println(x&-x, x&(x-1), bits.OnesCount8(x), bits.TrailingZeros8(x))
	fmt.Printf("%08b %08b\\n", x&^0b0100_0000, ^x)
	fmt.Println(-8>>1, uint8(248)>>1)
}`,
        output: `8 96 3 3
00101000 10010111
-4 124`,
        notes: ['x & −x isolates the lowest set bit (8 = 0b1000).', 'x & (x−1) clears it → 0b0110_0000 = 96.', '&^ clears bit 6; unary ^ flips all bits.', '>> on a negative int is arithmetic (sign-extending): −8 >> 1 = −4; on uint8 it is logical.'],
      },
      mistakes: ['Precedence: in Go `x&1 == 0` parses as `(x&1) == 0` (unlike C) — still, parenthesise for readers.', 'Shifting signed negatives expecting logical shifts.', 'Overflow when shifting 1 << 63 on int (use uint64).'],
      problems: [
        {
          id: 'm33-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Bit tricks output',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	n := 12 // 1100
	fmt.Println(n&1 == 0, n&(n-1), n&-n, n|1, n^5, n&^4)
}`,
          check: { options: ['true 8 4 13 9 8', 'false 8 4 13 9 8', 'true 11 4 13 9 12', 'true 8 2 13 15 8'], answerIndex: 0 },
          hints: ['12 = 1100. 5 = 0101. 4 = 0100.'],
          solution: '`true 8 4 13 9 8`',
          explanation: '12 is even. 12 & 11 = 1000 = 8. Lowest set bit = 4. 12 | 1 = 13. 1100 ^ 0101 = 1001 = 9. 1100 &^ 0100 = 1000 = 8.',
        },
        {
          id: 'm33-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Power of two and bit counts',
          story: 'A memory allocator only accepts power-of-two sizes and needs the next power ≥ a requested size.',
          prompt: 'Write `IsPow2(x uint64) bool`, `NextPow2(x uint64) uint64` (x ≥ 1) and `CountBits(n int) []int` returning popcounts for 0..n in O(n) using dp[i] = dp[i>>1] + i&1.',
          hints: ['NextPow2: 1 << bits.Len64(x−1).'],
          solution: `func IsPow2(x uint64) bool { return x != 0 && x&(x-1) == 0 }

func NextPow2(x uint64) uint64 {
	if x <= 1 {
		return 1
	}
	return 1 << bits.Len64(x-1)
}

func CountBits(n int) []int {
	dp := make([]int, n+1)
	for i := 1; i <= n; i++ {
		dp[i] = dp[i>>1] + i&1
	}
	return dp
}`,
          explanation: 'A power of two has exactly one set bit, which x−1 turns into all lower bits. i>>1 drops the last bit, whose popcount is already known (DP).',
          complexity: { time: 'O(1), O(1), O(n)', space: 'O(n) for CountBits' },
        },
        {
          id: 'm33-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Two missing sensors (XOR partition)',
          story: 'Sensors 1..n report in, but two never did. Find both IDs in O(n) time and O(1) space.',
          prompt: 'Write `TwoMissing(ids []int, n int) (int, int)`.',
          hints: ['XOR of everything gives a ^ b.', 'Pick any set bit of a ^ b; partition all numbers by that bit and XOR each group.'],
          solution: `func TwoMissing(ids []int, n int) (int, int) {
	x := 0
	for i := 1; i <= n; i++ {
		x ^= i
	}
	for _, v := range ids {
		x ^= v
	}
	bit := x & -x // a and b differ here
	a := 0
	for i := 1; i <= n; i++ {
		if i&bit != 0 {
			a ^= i
		}
	}
	for _, v := range ids {
		if v&bit != 0 {
			a ^= v
		}
	}
	return a, x ^ a
}`,
          explanation: 'Everything present cancels within its group; each group contains exactly one missing number because they differ on `bit`.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
        {
          id: 'm33-t1-p4',
          tier: 'advanced',
          level: 4,
          kind: 'code',
          title: 'All feature bundles under a budget (subset masks)',
          story: 'A SaaS pricing page lists ≤ 20 add-ons with prices; enumerate every bundle whose price ≤ budget.',
          prompt: 'Write `Bundles(prices []int, budget int) []uint32` returning masks. Then explain how to iterate all submasks of a given mask.',
          hints: ['For mask in 0..1<<n − 1, sum prices of set bits (or build sums incrementally: sum[mask] = sum[mask & (mask−1)] + price[lowest bit]).'],
          solution: `func Bundles(prices []int, budget int) []uint32 {
	n := len(prices)
	sum := make([]int, 1<<n)
	var out []uint32
	for mask := 1; mask < 1<<n; mask++ {
		low := bits.TrailingZeros(uint(mask))
		sum[mask] = sum[mask&(mask-1)] + prices[low]
		if sum[mask] <= budget {
			out = append(out, uint32(mask))
		}
	}
	return out
}

// submasks of m (excluding 0):
// for s := m; s > 0; s = (s - 1) & m { ... }`,
          explanation: 'Each mask’s sum reuses the sum of the mask without its lowest bit — O(1) per mask. Iterating submasks of every mask costs O(3ⁿ) overall.',
          complexity: { time: 'O(2ⁿ)', space: 'O(2ⁿ)' },
          variation: 'n = 40 add-ons: meet-in-the-middle — split into two halves of 20, sort one side’s sums and binary search.',
        },
      ],
    },
  ],
}
