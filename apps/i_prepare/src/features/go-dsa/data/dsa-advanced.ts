import type { Module } from '../types'

export const MODULE_28: Module = {
  id: 'm28',
  number: 28,
  track: 'dsa',
  title: 'Advanced Data Structures',
  shortTitle: 'Advanced DS',
  tagline: 'Use case first: segment trees, Fenwick trees, sparse tables, interval trees, LFU, skip lists, Bloom filters and consistent hashing.',
  topics: [
    {
      id: 'm28-t1',
      title: 'Range Query Structures: Segment Tree, Fenwick Tree, Sparse Table',
      summary: 'When the data changes AND you need range answers fast.',
      concept: [
        'Use case: an array that receives point updates and range queries (sum/min/max) interleaved. Prefix sums give O(1) queries but O(n) updates; these structures give O(log n) for both.',
        'Fenwick tree (Binary Indexed Tree): an array where tree[i] covers a range ending at i of length lowbit(i) = i & −i. Prefix sum and point add in O(log n), tiny code. Works for invertible operations (sum, xor).',
        'Segment tree: a binary tree over ranges; each node stores the aggregate of its range. Supports any associative operation (min, max, gcd), range updates with lazy propagation. O(log n) per op, 2–4n memory.',
        'Sparse table: for STATIC arrays and idempotent operations (min, max, gcd) — O(n log n) build, O(1) query by overlapping two power-of-two ranges.',
      ],
      why: 'Live dashboards, order books, leaderboards with rank queries and time-series analytics all mix updates with range questions.',
      whenToUse: ['Fenwick for prefix sums/counts with updates (also counting inversions)', 'Segment tree for min/max or range updates', 'Sparse table for static RMQ'],
      whenNotToUse: ['Static sums (prefix sums suffice).', 'Very few queries (just scan).'],
      syntax: `type Fenwick []int // 1-indexed, size n+1
func (f Fenwick) Add(i, d int) { for i++; i < len(f); i += i & -i { f[i] += d } }
func (f Fenwick) Prefix(i int) int { // sum of [0, i]
	s := 0
	for i++; i > 0; i -= i & -i { s += f[i] }
	return s
}`,
      example: {
        code: `// Segment tree for range minimum (iterative, size 2n)
type SegMin struct {
	n int
	t []int
}

func NewSegMin(a []int) *SegMin {
	n := len(a)
	t := make([]int, 2*n)
	copy(t[n:], a)
	for i := n - 1; i > 0; i-- {
		t[i] = min(t[2*i], t[2*i+1])
	}
	return &SegMin{n, t}
}

func (s *SegMin) Set(i, v int) {
	i += s.n
	s.t[i] = v
	for i > 1 {
		i /= 2
		s.t[i] = min(s.t[2*i], s.t[2*i+1])
	}
}

// Query min over [l, r)
func (s *SegMin) Query(l, r int) int {
	res := math.MaxInt
	for l, r = l+s.n, r+s.n; l < r; l, r = l/2, r/2 {
		if l&1 == 1 {
			res = min(res, s.t[l])
			l++
		}
		if r&1 == 1 {
			r--
			res = min(res, s.t[r])
		}
	}
	return res
}`,
        notes: ['Leaves live at t[n:2n]; internal node i covers children 2i and 2i+1.', 'Query climbs from both ends, taking boundary nodes that are fully inside [l, r).'],
      },
      mistakes: ['Mixing 0- and 1-indexing in Fenwick trees.', 'Sparse tables for sum (overlap double-counts — only for idempotent ops).', 'Forgetting to push lazy tags before descending.'],
      problems: [
        {
          id: 'm28-t1-p1',
          tier: 'foundation',
          level: 3,
          kind: 'concept',
          title: 'Pick the structure',
          prompt: 'A stock exchange array of 10⁶ prices receives 10⁵ price updates and 10⁵ "minimum price in [l, r]" queries per second. Which structure?',
          check: { options: ['Segment tree', 'Prefix sums', 'Sparse table', 'Fenwick tree for min'], answerIndex: 0 },
          hints: ['Updates rule out static structures.', 'Min is not invertible.'],
          solution: 'A segment tree.',
          explanation: 'Prefix sums and sparse tables need O(n) or O(n log n) rebuilds on updates. Fenwick trees need invertible operations for range queries (min is not). Segment tree: O(log n) for both.',
        },
        {
          id: 'm28-t1-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Live sales rank with a Fenwick tree',
          story: 'A flash-sale dashboard tracks units sold per product ID (0..n−1) and answers "units sold for products in [l, r]".',
          prompt: 'Implement `type Sales struct` with `Add(id, units int)` and `Range(l, r int) int` (inclusive) using a Fenwick tree.',
          hints: ['Range(l, r) = Prefix(r) − Prefix(l−1).'],
          solution: `type Sales struct{ f []int }

func NewSales(n int) *Sales { return &Sales{f: make([]int, n+1)} }

func (s *Sales) Add(id, units int) {
	for i := id + 1; i < len(s.f); i += i & -i {
		s.f[i] += units
	}
}

func (s *Sales) prefix(id int) int {
	sum := 0
	for i := id + 1; i > 0; i -= i & -i {
		sum += s.f[i]
	}
	return sum
}

func (s *Sales) Range(l, r int) int {
	if l > r {
		return 0
	}
	return s.prefix(r) - s.prefix(l-1)
}`,
          explanation: 'i & −i isolates the lowest set bit — the length of the range node i covers. prefix(−1) correctly returns 0 (loop never runs).',
          complexity: { time: 'O(log n) both', space: 'O(n)' },
          variation: 'Count inversions in an array with a Fenwick tree over compressed values (O(n log n)).',
        },
        {
          id: 'm28-t1-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Static range-minimum with a sparse table',
          story: 'A historical market-data API answers billions of "lowest price between day l and r" queries over immutable data.',
          prompt: 'Implement `NewSparse(a []int)` and `Min(l, r int) int` (inclusive) with O(1) query.',
          hints: ['st[k][i] = min of a[i : i+2^k].', 'Query: k = floor(log2(r−l+1)); min(st[k][l], st[k][r−2^k+1]).'],
          solution: `type Sparse struct{ st [][]int }

func NewSparse(a []int) *Sparse {
	n := len(a)
	levels := bits.Len(uint(n))
	st := make([][]int, levels)
	st[0] = slices.Clone(a)
	for k := 1; k < levels; k++ {
		size := n - (1 << k) + 1
		st[k] = make([]int, size)
		for i := 0; i < size; i++ {
			st[k][i] = min(st[k-1][i], st[k-1][i+(1<<(k-1))])
		}
	}
	return &Sparse{st}
}

func (s *Sparse) Min(l, r int) int {
	k := bits.Len(uint(r-l+1)) - 1
	return min(s.st[k][l], s.st[k][r-(1<<k)+1])
}`,
          explanation: 'Two overlapping power-of-two windows cover [l, r]; overlap is harmless because min is idempotent.',
          complexity: { time: 'Build O(n log n), query O(1)', space: 'O(n log n)' },
        },
      ],
    },
    {
      id: 'm28-t2',
      title: 'Caches and Ordered Structures: LFU, Interval Tree, Skip List',
      summary: 'Frequency-based eviction, overlapping intervals, probabilistic balancing.',
      concept: [
        'LFU cache evicts the least frequently used key (ties → least recently used). O(1) design: key → node, frequency → doubly linked list of nodes, and a minFreq pointer.',
        'Interval tree / sorted interval set: answer "which intervals overlap [a, b]?" — BST keyed by start with max-end augmentation, or a sorted slice for mostly-static data.',
        'Skip list: sorted linked list with randomly promoted "express lanes"; expected O(log n) search/insert/delete with simple concurrent-friendly code (Redis sorted sets use it).',
      ],
      why: 'Production caches, calendars/booking systems and ordered indexes need these beyond the basics.',
      whenToUse: ['LFU when popularity matters more than recency', 'Interval structures for bookings and IP ranges', 'Skip lists as an ordered map alternative'],
      whenNotToUse: ['LFU where access patterns shift quickly (old popular items linger — consider decay or W-TinyLFU).'],
      syntax: `type lfu struct {
	cap, minFreq int
	nodes  map[int]*list.Element      // key → element
	freqs  map[int]*list.List         // freq → list of entries (front = most recent)
}`,
      example: {
        code: `Skip list levels (express lanes):
L2: 1 ─────────────── 9
L1: 1 ──── 4 ──────── 9 ── 12
L0: 1 ─ 3 ─ 4 ─ 6 ─ 8 ─ 9 ─ 12
search 8: L2 1→(9 too big)↓ L1 1→4→(9 too big)↓ L0 4→6→8 ✓`,
        notes: ['Each node is promoted to the next level with probability 1/2, giving ~log n levels.'],
      },
      mistakes: ['LFU forgetting to bump minFreq when the min list empties.', 'Interval overlap off-by-one ([a, b) vs [a, b]).'],
      problems: [
        {
          id: 'm28-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Can this meeting be booked?',
          story: 'A calendar stores non-overlapping bookings [start, end); a new request must not overlap any.',
          prompt: 'Implement `Calendar.Book(start, end int) bool` in O(log n) search using a sorted slice and binary search (insertion O(n) is acceptable).',
          hints: ['Find the first booking with start ≥ new start; check it and the previous one for overlap.'],
          solution: `type Calendar struct{ b [][2]int }

func (c *Calendar) Book(start, end int) bool {
	i, _ := slices.BinarySearchFunc(c.b, start, func(x [2]int, t int) int { return x[0] - t })
	if i < len(c.b) && c.b[i][0] < end {
		return false
	}
	if i > 0 && c.b[i-1][1] > start {
		return false
	}
	c.b = slices.Insert(c.b, i, [2]int{start, end})
	return true
}`,
          explanation: 'Because existing bookings never overlap, only the neighbours around the insertion point can conflict.',
          complexity: { time: 'O(log n) check, O(n) insert', space: 'O(n)', notes: 'A balanced BST/skip list makes insert O(log n) too.' },
        },
        {
          id: 'm28-t2-p2',
          tier: 'practical',
          level: 5,
          kind: 'code',
          title: 'LFU cache',
          story: 'A CDN edge cache keeps the most frequently requested assets.',
          prompt: 'Implement `LFU` with O(1) `Get(key) (int, bool)` and `Put(key, val)` using container/list per frequency.',
          hints: ['entry{key, val, freq}; touch(e): remove from freqs[f], push front to freqs[f+1], update minFreq if freqs[f] became empty and f == minFreq.', 'Evict from the BACK of freqs[minFreq].'],
          solution: `type lfuEntry struct{ key, val, freq int }

type LFU struct {
	cap, minFreq int
	nodes        map[int]*list.Element
	freqs        map[int]*list.List
}

func NewLFU(capacity int) *LFU {
	return &LFU{cap: capacity, nodes: map[int]*list.Element{}, freqs: map[int]*list.List{}}
}

func (c *LFU) touch(el *list.Element) {
	e := el.Value.(*lfuEntry)
	old := c.freqs[e.freq]
	old.Remove(el)
	if old.Len() == 0 {
		delete(c.freqs, e.freq)
		if c.minFreq == e.freq {
			c.minFreq++
		}
	}
	e.freq++
	c.push(e)
}

func (c *LFU) push(e *lfuEntry) {
	l, ok := c.freqs[e.freq]
	if !ok {
		l = list.New()
		c.freqs[e.freq] = l
	}
	c.nodes[e.key] = l.PushFront(e)
}

func (c *LFU) Get(key int) (int, bool) {
	el, ok := c.nodes[key]
	if !ok {
		return 0, false
	}
	c.touch(el)
	return c.nodes[key].Value.(*lfuEntry).val, true
}

func (c *LFU) Put(key, val int) {
	if c.cap == 0 {
		return
	}
	if el, ok := c.nodes[key]; ok {
		el.Value.(*lfuEntry).val = val
		c.touch(el)
		return
	}
	if len(c.nodes) == c.cap {
		l := c.freqs[c.minFreq]
		victim := l.Remove(l.Back()).(*lfuEntry)
		if l.Len() == 0 {
			delete(c.freqs, c.minFreq)
		}
		delete(c.nodes, victim.key)
	}
	c.minFreq = 1
	c.push(&lfuEntry{key: key, val: val, freq: 1})
}`,
          explanation: 'Each frequency bucket is LRU-ordered, so the back of the min-frequency bucket is the correct victim. New keys always have frequency 1, resetting minFreq.',
          complexity: { time: 'O(1) Get/Put', space: 'O(capacity)' },
        },
        {
          id: 'm28-t2-p3',
          tier: 'interview',
          level: 5,
          kind: 'concept',
          title: 'Skip list vs balanced BST',
          prompt: 'Why might a database (e.g. Redis sorted sets, LevelDB memtables) choose a skip list over a red-black tree? Give the expected complexities and one downside.',
          hints: ['Think about implementation complexity, range scans and concurrency.'],
          solution: 'Expected O(log n) search/insert/delete with far simpler code (no rotations). Range scans are natural — find the start then walk level 0. Lock-free/concurrent variants are easier because inserts only modify a few forward pointers locally. Downsides: guarantees are probabilistic (bad luck → O(n)), and extra pointers per node cost memory and cache locality compared with B-trees.',
          explanation: 'Engineering trade-offs, not just big-O, decide production data structures.',
        },
      ],
    },
    {
      id: 'm28-t3',
      title: 'Probabilistic and Distributed: Bloom Filters, Consistent Hashing, Hash Rings',
      summary: 'Approximate membership and stable key placement across servers.',
      concept: [
        'Bloom filter: a bit array of m bits and k hash functions. Add sets k bits; MightContain checks all k. No false negatives, tunable false positives ≈ (1 − e^(−kn/m))^k. Cannot delete (counting Bloom filters can).',
        'Consistent hashing: place servers on a hash ring; a key goes to the first server clockwise from hash(key). Adding/removing a server moves only ~1/N of keys (vs almost all with hash mod N).',
        'Virtual nodes: each server appears at many ring positions to smooth load. Used by DynamoDB, Cassandra, CDNs, memcached clients.',
      ],
      why: 'At scale you avoid expensive lookups (Bloom: "definitely not on disk") and avoid reshuffling all data when the cluster changes.',
      whenToUse: ['Bloom before expensive disk/network lookups', 'Consistent hashing for sharded caches and partitioning'],
      whenNotToUse: ['Bloom when false positives are unacceptable without a fallback check.', 'Consistent hashing with tiny, fixed server counts (mod is fine).'],
      syntax: `func (b *Bloom) positions(key string) []uint64 {
	h := fnv.New64a()
	h.Write([]byte(key))
	h1 := h.Sum64()
	h2 := h1>>33 | h1<<31
	pos := make([]uint64, b.k)
	for i := range pos {
		pos[i] = (h1 + uint64(i)*h2) % b.m // double hashing
	}
	return pos
}`,
      example: {
        code: `servers A, B, C at ring positions 100, 400, 800 (ring size 1000)
key hash 350 → B (first ≥ 350)
key hash 900 → A (wraps around)
add D at 600 → only keys in (400, 600] move from C to D`,
        notes: ['Removing a server hands its keys to its clockwise successor only.'],
      },
      mistakes: ['Using k independent expensive hashes instead of double hashing.', 'Too few virtual nodes → hotspots.', 'Forgetting wrap-around on the ring.'],
      problems: [
        {
          id: 'm28-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'concept',
          title: 'Bloom filter answers',
          prompt: 'A Bloom filter says "might contain" for username "gopher42". What do you know?',
          check: {
            options: ['It may or may not be present — check the database', 'It is definitely present', 'It is definitely absent', 'The filter is corrupt'],
            answerIndex: 0,
          },
          hints: ['Which error type do Bloom filters allow?'],
          solution: 'Possibly present — verify with the source of truth. A "no" would have been definitive.',
          explanation: 'Bloom filters have false positives but no false negatives.',
        },
        {
          id: 'm28-t3-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Bloom filter for "username taken?"',
          story: 'A signup page checks username availability on every keystroke; the database cannot take that load.',
          prompt: 'Implement `NewBloom(n int, fpRate float64)` computing m = −n·ln(p)/(ln 2)² and k = (m/n)·ln 2, with `Add(s)` and `MightContain(s) bool` using FNV-1a double hashing over a []uint64 bitset.',
          hints: ['Bit i: words[i/64] |= 1 << (i%64).'],
          solution: `type Bloom struct {
	bits []uint64
	m, k uint64
}

func NewBloom(n int, p float64) *Bloom {
	m := uint64(math.Ceil(-float64(n) * math.Log(p) / (math.Ln2 * math.Ln2)))
	k := uint64(math.Max(1, math.Round(float64(m)/float64(n)*math.Ln2)))
	return &Bloom{bits: make([]uint64, (m+63)/64), m: m, k: k}
}

func (b *Bloom) hashes(s string) (uint64, uint64) {
	h := fnv.New64a()
	h.Write([]byte(s))
	h1 := h.Sum64()
	return h1, h1>>33 | h1<<31 | 1
}

func (b *Bloom) Add(s string) {
	h1, h2 := b.hashes(s)
	for i := uint64(0); i < b.k; i++ {
		pos := (h1 + i*h2) % b.m
		b.bits[pos/64] |= 1 << (pos % 64)
	}
}

func (b *Bloom) MightContain(s string) bool {
	h1, h2 := b.hashes(s)
	for i := uint64(0); i < b.k; i++ {
		pos := (h1 + i*h2) % b.m
		if b.bits[pos/64]&(1<<(pos%64)) == 0 {
			return false
		}
	}
	return true
}`,
          explanation: 'Kirsch–Mitzenmacher double hashing simulates k hash functions from two. For n = 10⁷ and p = 1%, m ≈ 96 Mbit ≈ 12 MB with k = 7.',
          complexity: { time: 'O(k) per op', space: 'O(m) bits' },
        },
        {
          id: 'm28-t3-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Consistent hash ring with virtual nodes',
          story: 'A session-cache cluster must route user IDs to servers and survive scaling events with minimal cache misses.',
          prompt: 'Implement `Ring` with `NewRing(replicas int)`, `Add(server string)`, `Remove(server string)` and `Get(key string) string` using crc32 and a sorted []uint32 of virtual node hashes.',
          hints: ['Virtual node i of server s hashes "s#i".', 'Get: binary search the first hash ≥ hash(key), wrap to 0.'],
          solution: `type Ring struct {
	replicas int
	hashes   []uint32
	owner    map[uint32]string
}

func NewRing(replicas int) *Ring { return &Ring{replicas: replicas, owner: map[uint32]string{}} }

func (r *Ring) Add(server string) {
	for i := 0; i < r.replicas; i++ {
		h := crc32.ChecksumIEEE([]byte(fmt.Sprintf("%s#%d", server, i)))
		r.owner[h] = server
		r.hashes = append(r.hashes, h)
	}
	slices.Sort(r.hashes)
}

func (r *Ring) Remove(server string) {
	r.hashes = slices.DeleteFunc(r.hashes, func(h uint32) bool {
		if r.owner[h] == server {
			delete(r.owner, h)
			return true
		}
		return false
	})
}

func (r *Ring) Get(key string) string {
	if len(r.hashes) == 0 {
		return ""
	}
	h := crc32.ChecksumIEEE([]byte(key))
	i, _ := slices.BinarySearch(r.hashes, h)
	if i == len(r.hashes) {
		i = 0
	}
	return r.owner[r.hashes[i]]
}`,
          explanation: 'Each server owns many small arcs, so load is even and a removed server’s keys spread across many successors rather than one.',
          complexity: { time: 'Get O(log(N·R)); Add/Remove O(N·R log(N·R))', space: 'O(N·R)' },
          variation: 'Make it safe for concurrent reads during Add/Remove (copy-on-write with atomic.Pointer). Discuss hash collisions between virtual nodes.',
        },
      ],
    },
  ],
}
