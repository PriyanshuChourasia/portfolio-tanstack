import type { Module } from '../types'

const DP_FRAME = `State      → what does dp[...] mean, in words?
Choice     → what decision is made at this state?
Transition → dp[state] = best over choices of (cost + dp[smaller state])
Base case  → smallest states with known answers
Order      → fill so dependencies are computed first
Memoize    → top-down recursion + cache
Tabulate   → bottom-up loops
Optimize   → keep only the rows/values the transition reads`

export const MODULE_31: Module = {
  id: 'm31',
  number: 31,
  track: 'dsa',
  title: 'Dynamic Programming',
  shortTitle: 'DP',
  tagline: 'State, transition, base case, choice; memoisation → tabulation → space optimisation. No formula memorising.',
  topics: [
    {
      id: 'm31-t1',
      title: 'Level 1: Fibonacci, Climbing Stairs, House Robber',
      summary: 'Overlapping subproblems and the DP frame.',
      concept: [
        'DP applies when a problem has optimal substructure (the answer is built from answers to smaller versions) and overlapping subproblems (the same smaller versions recur). Plain recursion recomputes them exponentially; caching makes it polynomial.',
        'Always write the frame BEFORE code: State, Choice, Transition, Base case, Order. Then pick memoisation (top-down) or tabulation (bottom-up), then optimise space.',
        'Level-1 problems are 1-D: dp[i] depends on a constant number of previous values, so space drops to O(1).',
      ],
      why: 'DP turns exponential searches into polynomial algorithms — pricing, routing, text diffing, resource allocation.',
      whenToUse: ['Counting ways, min/max cost, feasibility over sequences or choices', 'When brute-force recursion repeats calls'],
      whenNotToUse: ['When a greedy choice is provably optimal (simpler, faster).', 'When subproblems do not overlap (plain divide and conquer).'],
      syntax: DP_FRAME,
      example: {
        code: `// Climbing stairs: 1 or 2 steps at a time; ways to reach step n.
// State: ways(i) = number of ways to reach step i
// Choice: last move was 1 or 2 steps
// Transition: ways(i) = ways(i-1) + ways(i-2)
// Base: ways(0) = 1, ways(1) = 1
func climb(n int) int {
	a, b := 1, 1 // ways(i-2), ways(i-1)
	for i := 2; i <= n; i++ {
		a, b = b, a+b
	}
	return b
}`,
        notes: ['The comments ARE the solution; the code just transcribes them.', 'Only two previous values are read, so two variables replace the table.'],
      },
      mistakes: ['Writing code before defining the state in words.', 'Wrong base cases (ways(0) = 1 — the empty climb).', 'Memo maps with expensive keys when an array works.'],
      problems: [
        {
          id: 'm31-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Why is naive Fibonacci slow?',
          prompt: 'How many calls does naive recursive fib(n) make, roughly, and what does memoisation change?',
          check: { options: ['O(φⁿ) ≈ O(1.618ⁿ) calls → O(n) with memoisation', 'O(n²) → O(n)', 'O(n log n) → O(n)', 'O(n) either way'], answerIndex: 0 },
          hints: ['fib(n) calls fib(n−1) and fib(n−2), each of which branches again.'],
          solution: 'Exponential (~φⁿ) calls; memoisation computes each of the n+1 distinct states once → O(n).',
          explanation: 'There are only n+1 distinct subproblems; the exponential blow-up is pure repetition.',
        },
        {
          id: 'm31-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Rob houses on a street (no two adjacent)',
          story: 'A delivery driver can serve at most one of any two adjacent houses (parking rules); each house pays a tip. Maximise tips.',
          prompt: 'Write the DP frame in comments, then `MaxTips(tips []int) int` — memoised version first, then O(1) space.',
          hints: ['State: best(i) = max tips from houses 0..i.', 'Choice: skip house i (best(i−1)) or take it (tips[i] + best(i−2)).'],
          solution: `// State:      best(i) = max tips using houses 0..i
// Choice:     take house i or skip it
// Transition: best(i) = max(best(i-1), tips[i] + best(i-2))
// Base:       best(-1) = 0, best(-2) = 0

func MaxTipsMemo(tips []int) int {
	memo := make([]int, len(tips))
	for i := range memo {
		memo[i] = -1
	}
	var best func(i int) int
	best = func(i int) int {
		if i < 0 {
			return 0
		}
		if memo[i] >= 0 {
			return memo[i]
		}
		memo[i] = max(best(i-1), tips[i]+best(i-2))
		return memo[i]
	}
	return best(len(tips) - 1)
}

func MaxTips(tips []int) int {
	prev2, prev1 := 0, 0 // best(i-2), best(i-1)
	for _, t := range tips {
		prev2, prev1 = prev1, max(prev1, t+prev2)
	}
	return prev1
}`,
          explanation: 'The transition only reads two previous states, so two variables suffice.',
          complexity: { time: 'O(n)', space: 'Memo O(n); optimised O(1)' },
          variation: 'Houses are in a circle (first and last adjacent): run the linear DP on [0, n−2] and [1, n−1] and take the max.',
        },
        {
          id: 'm31-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Decode a numeric message',
          story: 'An SMS gateway receives digits where A=1 … Z=26; count the possible decodings of "226" (BZ, VF, BBF → 3).',
          prompt: 'Write the frame, then `Decodings(s string) int` in O(n) time, O(1) space. Handle zeros.',
          hints: ['ways(i) = ways for prefix of length i.', 'Single digit valid if s[i−1] != \'0\'; two digits valid if 10 ≤ value ≤ 26.'],
          solution: `// State:      ways(i) = decodings of s[:i]
// Choice:     last symbol used 1 digit or 2 digits
// Transition: ways(i) = [s[i-1] != '0'] * ways(i-1)
//                     + [10 <= s[i-2:i] <= 26] * ways(i-2)
// Base:       ways(0) = 1
func Decodings(s string) int {
	if len(s) == 0 {
		return 0
	}
	prev2, prev1 := 0, 1 // ways(i-2), ways(i-1) with i = 1 → prev1 = ways(0)
	for i := 1; i <= len(s); i++ {
		cur := 0
		if s[i-1] != '0' {
			cur += prev1
		}
		if i >= 2 {
			two := int(s[i-2]-'0')*10 + int(s[i-1]-'0')
			if two >= 10 && two <= 26 {
				cur += prev2
			}
		}
		prev2, prev1 = prev1, cur
	}
	return prev1
}`,
          explanation: '"10" and "20" are only decodable as two-digit symbols; a lone "0" kills that branch, which the indicator conditions encode.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
      ],
    },
    {
      id: 'm31-t2',
      title: 'Level 2: 0/1 Knapsack, Unbounded Knapsack, Coin Change, Subset Sum, Partition',
      summary: 'Capacity as a DP dimension.',
      concept: [
        '0/1 knapsack: State dp[i][w] = best value using the first i items with capacity w. Choice: skip item i or take it (if it fits). Transition dp[i][w] = max(dp[i−1][w], v_i + dp[i−1][w − w_i]).',
        'Space optimisation: one row, iterate w DOWNWARD for 0/1 (each item used once), UPWARD for unbounded (items reusable). Understand why the direction matters — do not memorise it.',
        'Coin change (min coins) is unbounded knapsack with min instead of max; counting combinations loops coins outside, amounts inside (to avoid counting permutations).',
        'Subset sum / equal partition: boolean knapsack — can we reach sum s?',
      ],
      why: 'Budget allocation, cargo loading, ad selection, change making — choose items under a capacity.',
      whenToUse: ['Capacity/budget constraints with integer weights of moderate size'],
      whenNotToUse: ['Huge capacities (10⁹) — DP table too big; consider meet-in-the-middle or branch and bound.', 'Fractional items — greedy works.'],
      syntax: DP_FRAME,
      example: {
        code: `// 0/1 knapsack, 1-D
dp := make([]int, W+1)
for _, it := range items {
	for w := W; w >= it.weight; w-- { // downward: dp[w-weight] is still the previous row
		dp[w] = max(dp[w], it.value+dp[w-it.weight])
	}
}`,
        notes: ['Downward iteration means dp[w − weight] has not yet been updated for this item → each item used at most once.', 'Upward iteration would let the same item be added repeatedly → unbounded knapsack.'],
      },
      mistakes: ['Wrong loop direction in 1-D knapsack.', 'Counting permutations instead of combinations in coin change.', 'Initialising min-DP with 0 instead of infinity.'],
      problems: [
        {
          id: 'm31-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Fewest coins for change',
          story: 'A vending machine must return change using the fewest coins from given denominations.',
          prompt: 'Write the frame, then `MinCoins(coins []int, amount int) int` (−1 if impossible).',
          hints: ['dp[a] = min coins for amount a; dp[0] = 0; others = inf.', 'dp[a] = min over c ≤ a of dp[a−c] + 1.'],
          solution: `// State:      dp[a] = fewest coins summing to a
// Choice:     which coin is used last
// Transition: dp[a] = min(dp[a-c] + 1) for c in coins, c <= a
// Base:       dp[0] = 0
func MinCoins(coins []int, amount int) int {
	const inf = math.MaxInt / 2
	dp := make([]int, amount+1)
	for a := 1; a <= amount; a++ {
		dp[a] = inf
		for _, c := range coins {
			if c <= a && dp[a-c]+1 < dp[a] {
				dp[a] = dp[a-c] + 1
			}
		}
	}
	if dp[amount] >= inf {
		return -1
	}
	return dp[amount]
}`,
          explanation: 'Greedy (largest coin first) fails for coins like {1, 3, 4} and amount 6 (greedy 4+1+1, optimal 3+3) — DP considers every last coin.',
          complexity: { time: 'O(amount · coins)', space: 'O(amount)' },
          variation: 'Count the number of combinations (not permutations) that make the amount.',
        },
        {
          id: 'm31-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Load the cargo plane (0/1 knapsack)',
          story: 'An air-freight planner picks parcels (weight, revenue) to maximise revenue within the plane’s weight limit.',
          prompt: 'Write `MaxRevenue(weights, values []int, limit int) int` with 1-D DP. Explain the loop direction in a comment.',
          hints: ['Iterate capacity downward for 0/1.'],
          solution: `func MaxRevenue(weights, values []int, limit int) int {
	dp := make([]int, limit+1) // dp[w] = best revenue with capacity w using items so far
	for i := range weights {
		// downward so dp[w-weights[i]] still refers to the state BEFORE item i (used at most once)
		for w := limit; w >= weights[i]; w-- {
			dp[w] = max(dp[w], values[i]+dp[w-weights[i]])
		}
	}
	return dp[limit]
}`,
          explanation: 'The 2-D table dp[i][w] collapses to one row because row i only reads row i−1.',
          complexity: { time: 'O(n · W)', space: 'O(W)', notes: 'Pseudo-polynomial: W in the complexity is a value, not an input size.' },
          variation: 'Also return which parcels were chosen (keep the 2-D table or a choice bitset, then backtrack).',
        },
        {
          id: 'm31-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Split invoices into two equal halves',
          story: 'Two co-founders want to split a set of invoices so both get exactly the same total.',
          prompt: 'Write `CanSplit(amounts []int) bool`. Use a boolean 1-D DP, then a math/big-free bitset trick with uint64 words or big shifts.',
          hints: ['Total must be even; target = total/2.', 'can[s] |= can[s − a], iterating s downward.'],
          solution: `func CanSplit(amounts []int) bool {
	total := 0
	for _, a := range amounts {
		total += a
	}
	if total%2 == 1 {
		return false
	}
	target := total / 2
	can := make([]bool, target+1)
	can[0] = true
	for _, a := range amounts {
		for s := target; s >= a; s-- {
			can[s] = can[s] || can[s-a]
		}
	}
	return can[target]
}`,
          explanation: 'Subset sum to total/2 is exactly equal partition. A bitset version (`bits |= bits << a`) processes 64 sums per instruction.',
          complexity: { time: 'O(n · total)', space: 'O(total)' },
        },
      ],
    },
    {
      id: 'm31-t3',
      title: 'Level 3: LCS, LIS, Edit Distance, Matrix Chain Multiplication',
      summary: 'Two-sequence and interval-shaped DP.',
      concept: [
        'LCS: dp[i][j] = LCS of a[:i] and b[:j]; if a[i−1] == b[j−1] then dp[i−1][j−1] + 1 else max(dp[i−1][j], dp[i][j−1]). Basis of diff tools.',
        'Edit distance: dp[i][j] = min edits turning a[:i] into b[:j] with insert, delete, replace (cost 0 if chars equal). Spell checkers, fuzzy matching.',
        'LIS: O(n²) DP (dp[i] = longest ending at i) or O(n log n) patience sorting: tails[k] = smallest tail of an increasing subsequence of length k+1, binary search to place each value.',
        'Matrix chain multiplication: interval DP — dp[i][j] = min over split k of dp[i][k] + dp[k+1][j] + cost(i,k,j). Fill by increasing interval length.',
      ],
      why: 'Text diffing, DNA alignment, autocorrect, version control and query optimisers rely on these.',
      whenToUse: ['Comparing/aligning two sequences', 'Optimal ordering of associative operations'],
      whenNotToUse: ['Very long sequences (10⁶ × 10⁶) — need Hirschberg or heuristics (Myers diff).'],
      syntax: DP_FRAME,
      example: {
        code: `// Edit distance "kitten" → "sitting" = 3
//      ""  s  i  t  t  i  n  g
// ""    0  1  2  3  4  5  6  7
// k     1  1  2  3  4  5  6  7
// i     2  2  1  2  3  4  5  6
// t     3  3  2  1  2  3  4  5
// t     4  4  3  2  1  2  3  4
// e     5  5  4  3  2  2  3  4
// n     6  6  5  4  3  3  2  3`,
        notes: ['Row 0/column 0 are the base cases (all inserts / all deletes).', 'Each cell reads its left, top and top-left neighbours.'],
      },
      mistakes: ['Off-by-one between string index and dp index.', 'Confusing subsequence (gaps allowed) with substring (contiguous).'],
      problems: [
        {
          id: 'm31-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Typo distance for search suggestions',
          story: 'A search engine suggests "Did you mean…?" when the edit distance to a known query is ≤ 2.',
          prompt: 'Write the frame, then `EditDistance(a, b string) int` using two rows.',
          hints: ['prev = row i−1, cur = row i; cur[0] = i.', 'cur[j] = prev[j−1] if equal else 1 + min(prev[j], cur[j−1], prev[j−1]).'],
          solution: `// State:      d(i, j) = edits to turn a[:i] into b[:j]
// Choice:     delete a[i-1], insert b[j-1], or replace/keep
// Transition: equal → d(i-1, j-1); else 1 + min(d(i-1,j), d(i,j-1), d(i-1,j-1))
// Base:       d(i, 0) = i, d(0, j) = j
func EditDistance(a, b string) int {
	prev := make([]int, len(b)+1)
	cur := make([]int, len(b)+1)
	for j := range prev {
		prev[j] = j
	}
	for i := 1; i <= len(a); i++ {
		cur[0] = i
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				cur[j] = prev[j-1]
			} else {
				cur[j] = 1 + min(prev[j], cur[j-1], prev[j-1])
			}
		}
		prev, cur = cur, prev
	}
	return prev[len(b)]
}`,
          explanation: 'Each row depends only on the previous row, so two rows suffice. Swapping slices avoids reallocation.',
          complexity: { time: 'O(n·m)', space: 'O(min(n, m)) if you put the shorter string in the columns' },
          variation: 'Early-exit when every value in a row exceeds 2 (bounded edit distance) — huge speed-up for suggestions.',
        },
        {
          id: 'm31-t3-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Longest growing streak of daily active users (LIS)',
          prompt: 'Write `LIS(a []int) int` in O(n log n) with patience sorting. Explain what tails[] means.',
          hints: ['For each x, find the first tail ≥ x (sort.SearchInts) and replace it, or append.'],
          solution: `func LIS(a []int) int {
	var tails []int // tails[k] = smallest tail of any strictly increasing subsequence of length k+1
	for _, x := range a {
		i := sort.SearchInts(tails, x)
		if i == len(tails) {
			tails = append(tails, x)
		} else {
			tails[i] = x
		}
	}
	return len(tails)
}`,
          explanation: 'Keeping the smallest possible tail for each length leaves the most room for future extensions; tails is always sorted, enabling binary search. tails itself is not an actual subsequence.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
          variation: 'Reconstruct an actual LIS (store predecessor indexes).',
        },
        {
          id: 'm31-t3-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Cheapest order to join query results (matrix chain)',
          story: 'A query optimiser multiplies matrices (join results) with dimensions d0×d1, d1×d2, …; the order changes cost dramatically.',
          prompt: 'Write the frame and `MatrixChain(d []int) int` (n = len(d)−1 matrices) — interval DP by increasing length.',
          hints: ['dp[i][j] = min cost for matrices i..j.', 'dp[i][j] = min over k in [i, j) of dp[i][k] + dp[k+1][j] + d[i]·d[k+1]·d[j+1].'],
          solution: `// State:      dp[i][j] = min scalar multiplications for matrices i..j
// Choice:     the last multiplication splits at k
// Transition: dp[i][j] = min_k dp[i][k] + dp[k+1][j] + d[i]*d[k+1]*d[j+1]
// Base:       dp[i][i] = 0
// Order:      by increasing interval length
func MatrixChain(d []int) int {
	n := len(d) - 1
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}
	for length := 2; length <= n; length++ {
		for i := 0; i+length-1 < n; i++ {
			j := i + length - 1
			dp[i][j] = math.MaxInt
			for k := i; k < j; k++ {
				cost := dp[i][k] + dp[k+1][j] + d[i]*d[k+1]*d[j+1]
				dp[i][j] = min(dp[i][j], cost)
			}
		}
	}
	return dp[0][n-1]
}`,
          explanation: 'Intervals depend only on shorter intervals, so filling by length guarantees dependencies are ready.',
          complexity: { time: 'O(n³)', space: 'O(n²)' },
        },
      ],
    },
    {
      id: 'm31-t4',
      title: 'Level 4: Tree DP, Interval DP, Bitmask DP, Digit DP, DP on Graphs',
      summary: 'When the state is a subtree, a subset, a digit position or a DAG node.',
      concept: [
        'Tree DP: compute per-node states from children in post-order (e.g. house robber on a tree: (take, skip) pair per node).',
        'Bitmask DP: state includes a subset of n ≤ ~20 items as an int mask — travelling salesman dp[mask][last] in O(2ⁿ·n²).',
        'Digit DP: count numbers ≤ N with a property, state (position, tight, …) walking digits from most significant.',
        'DP on DAGs: process nodes in topological order (longest path, number of paths). Shortest paths are DP on graphs too.',
      ],
      why: 'Routing with few stops, org-chart optimisation, numeric counting problems and dependency-graph analytics.',
      whenToUse: ['n ≤ 20 subset problems', 'Counting numbers in huge ranges', 'Optimisation over trees/DAGs'],
      whenNotToUse: ['Bitmask DP for n > ~25 (memory/time explode).'],
      syntax: DP_FRAME,
      example: {
        code: `// House robber on a tree: each node returns (best if taken, best if skipped)
func rob(n *TreeNode) (take, skip int) {
	if n == nil {
		return 0, 0
	}
	lt, ls := rob(n.Left)
	rt, rs := rob(n.Right)
	take = n.Val + ls + rs
	skip = max(lt, ls) + max(rt, rs)
	return
}`,
        notes: ['Multiple return values make 2-state tree DP natural in Go.'],
      },
      mistakes: ['Bitmask indices off by one.', 'Forgetting the "tight" flag in digit DP.', 'Applying DAG DP to graphs with cycles.'],
      problems: [
        {
          id: 'm31-t4-p1',
          tier: 'foundation',
          level: 4,
          kind: 'code',
          title: 'Party invitations in an org chart (tree DP)',
          story: 'Invite employees to maximise total "fun", but nobody attends with their direct manager.',
          prompt: '`type Emp struct{ Fun int; Reports []*Emp }`. Write `MaxFun(root *Emp) int` with (invite, skip) states.',
          hints: ['invite = Fun + Σ skip(child); skip = Σ max(invite(child), skip(child)).'],
          solution: `func MaxFun(root *Emp) int {
	var dfs func(*Emp) (int, int)
	dfs = func(e *Emp) (invite, skip int) {
		invite = e.Fun
		for _, r := range e.Reports {
			ri, rs := dfs(r)
			invite += rs
			skip += max(ri, rs)
		}
		return
	}
	i, s := dfs(root)
	return max(i, s)
}`,
          explanation: 'Each node’s optimal choice depends only on its children’s two states.',
          complexity: { time: 'O(n)', space: 'O(h)' },
        },
        {
          id: 'm31-t4-p2',
          tier: 'practical',
          level: 6,
          kind: 'code',
          title: 'Shortest tour for a field technician (bitmask TSP)',
          story: 'A technician must visit ≤ 15 sites starting and ending at the depot (site 0); travel times are known.',
          prompt: 'Write `TSP(dist [][]int) int` with dp[mask][last].',
          hints: ['dp[1][0] = 0.', 'dp[mask | 1<<nxt][nxt] = min(dp[mask][last] + dist[last][nxt]).'],
          solution: `func TSP(dist [][]int) int {
	n := len(dist)
	const inf = math.MaxInt / 2
	full := 1 << n
	dp := make([][]int, full)
	for m := range dp {
		dp[m] = make([]int, n)
		for j := range dp[m] {
			dp[m][j] = inf
		}
	}
	dp[1][0] = 0
	for mask := 1; mask < full; mask++ {
		if mask&1 == 0 {
			continue
		}
		for last := 0; last < n; last++ {
			cur := dp[mask][last]
			if cur >= inf || mask&(1<<last) == 0 {
				continue
			}
			for nxt := 0; nxt < n; nxt++ {
				if mask&(1<<nxt) != 0 {
					continue
				}
				nm := mask | 1<<nxt
				dp[nm][nxt] = min(dp[nm][nxt], cur+dist[last][nxt])
			}
		}
	}
	best := inf
	for last := 1; last < n; last++ {
		best = min(best, dp[full-1][last]+dist[last][0])
	}
	if n == 1 {
		return 0
	}
	return best
}`,
          explanation: 'The set of visited sites plus the current site fully determines the future; order within the set does not matter.',
          complexity: { time: 'O(2ⁿ · n²)', space: 'O(2ⁿ · n)', notes: 'n = 15 → ~7·10⁶ transitions: fast. n = 25 → impossible.' },
        },
        {
          id: 'm31-t4-p3',
          tier: 'interview',
          level: 6,
          kind: 'code',
          title: 'Count invoice numbers without the digit 4 (digit DP)',
          story: 'In some cultures 4 is unlucky; count how many invoice numbers in [1, N] contain no digit 4, for N up to 10¹⁸.',
          prompt: 'Write `CountNo4(n int64) int64` with digit DP over (position, tight).',
          hints: ['Walk digits from most significant. If not tight, every remaining position has 9 choices.', 'Count numbers in [0, N] then subtract 1 for zero.'],
          solution: `func CountNo4(n int64) int64 {
	digits := []byte(strconv.FormatInt(n, 10))
	var count int64
	tightOK := true
	for i, d := range digits {
		remaining := len(digits) - i - 1
		free := int64(1)
		for k := 0; k < remaining; k++ {
			free *= 9
		}
		// choose a digit smaller than d at position i (not 4), rest free
		for x := byte('0'); x < d; x++ {
			if x != '4' {
				count += free
			}
		}
		if d == '4' {
			tightOK = false
			break
		}
	}
	if tightOK {
		count++ // n itself
	}
	return count - 1 // exclude 0
}`,
          explanation: 'At each position, either match N’s digit (stay tight) or choose smaller (then the rest is unconstrained: 9 options each). A 4 on the tight path ends it.',
          complexity: { time: 'O(digits²) here (O(digits) with precomputed powers)', space: 'O(digits)' },
          variation: 'Count numbers in [1, N] whose digit sum is divisible by 7 — the state gains (sum mod 7).',
        },
      ],
    },
  ],
}
