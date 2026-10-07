import type { Module } from '../types'

export const MODULE_25: Module = {
  id: 'm25',
  number: 25,
  track: 'dsa',
  title: 'Graphs',
  shortTitle: 'Graphs',
  tagline: 'Representations, BFS/DFS, components, cycles, bipartite, topological sort, shortest paths, MST, bridges, SCCs and grid graphs.',
  topics: [
    {
      id: 'm25-t1',
      title: 'Representations, BFS, DFS and Connected Components',
      summary: 'Adjacency lists in Go, the two traversals, and counting islands.',
      concept: [
        'Representations: adjacency matrix ([][]bool, O(V²) memory, O(1) edge check), adjacency list ([][]int or map[string][]string, O(V+E)), edge list ([][3]int{u, v, w} — handy for Kruskal/Bellman-Ford).',
        'BFS (queue) visits by distance — shortest path in unweighted graphs. DFS (recursion/stack) goes deep — reachability, components, cycle detection, topological order.',
        'Mark visited when you ENQUEUE/PUSH, not when you pop, to avoid duplicates. Connected components: run BFS/DFS from every unvisited node; each run is one component.',
        'Grids are implicit graphs: cells are nodes, neighbours via direction vectors.',
      ],
      why: 'Networks, dependencies, maps, social graphs — graphs model relationships, and BFS/DFS are the primitives everything builds on.',
      whenToUse: ['Adjacency lists for sparse graphs (almost always)', 'BFS for fewest hops', 'DFS for exhaustive exploration'],
      whenNotToUse: ['Adjacency matrix for 10⁵+ nodes.', 'BFS for weighted shortest paths.'],
      syntax: `adj := make([][]int, n)
for _, e := range edges {
	adj[e[0]] = append(adj[e[0]], e[1])
	adj[e[1]] = append(adj[e[1]], e[0]) // undirected
}
dist := make([]int, n)
for i := range dist { dist[i] = -1 }
dist[src] = 0
q := []int{src}
for len(q) > 0 {
	u := q[0]; q = q[1:]
	for _, v := range adj[u] {
		if dist[v] == -1 { dist[v] = dist[u] + 1; q = append(q, v) }
	}
}`,
      example: {
        code: `func countIslands(grid [][]byte) int {
	R, C := len(grid), len(grid[0])
	var sink func(r, c int)
	sink = func(r, c int) {
		if r < 0 || r >= R || c < 0 || c >= C || grid[r][c] != '1' {
			return
		}
		grid[r][c] = '0'
		sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1)
	}
	count := 0
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			if grid[r][c] == '1' {
				count++
				sink(r, c)
			}
		}
	}
	return count
}`,
        notes: ['Each DFS from an unvisited land cell floods one whole island.', 'Mutating the grid serves as the visited set (mention it — or copy).'],
      },
      mistakes: ['Marking visited on dequeue (exponential duplicates in dense graphs).', 'Forgetting both directions for undirected edges.', 'Deep recursion on 10⁶-cell grids (use iterative BFS).'],
      problems: [
        {
          id: 'm25-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Degrees of separation',
          story: 'A social network shows "2nd-degree connection" badges — the fewest friendship hops between two users.',
          prompt: 'Write `Hops(friends map[string][]string, from, to string) int` (−1 if unreachable) using BFS.',
          hints: ['dist map doubles as visited.'],
          solution: `func Hops(friends map[string][]string, from, to string) int {
	if from == to {
		return 0
	}
	dist := map[string]int{from: 0}
	q := []string{from}
	for len(q) > 0 {
		u := q[0]
		q = q[1:]
		for _, v := range friends[u] {
			if _, seen := dist[v]; seen {
				continue
			}
			dist[v] = dist[u] + 1
			if v == to {
				return dist[v]
			}
			q = append(q, v)
		}
	}
	return -1
}`,
          explanation: 'BFS reaches every node first via a shortest path, so we can return as soon as `to` is discovered.',
          complexity: { time: 'O(V + E)', space: 'O(V)' },
          variation: 'Bidirectional BFS from both ends — why does it explore far fewer nodes on social graphs?',
        },
        {
          id: 'm25-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Communities in a friend graph',
          story: 'Group users into communities (connected components) for targeted recommendations.',
          prompt: 'Given n users and friendship pairs, write `Communities(n int, pairs [][2]int) [][]int` with iterative DFS.',
          hints: ['Adjacency list; explicit stack; mark when pushing.'],
          solution: `func Communities(n int, pairs [][2]int) [][]int {
	adj := make([][]int, n)
	for _, p := range pairs {
		adj[p[0]] = append(adj[p[0]], p[1])
		adj[p[1]] = append(adj[p[1]], p[0])
	}
	seen := make([]bool, n)
	var out [][]int
	for s := 0; s < n; s++ {
		if seen[s] {
			continue
		}
		seen[s] = true
		st := []int{s}
		var comp []int
		for len(st) > 0 {
			u := st[len(st)-1]
			st = st[:len(st)-1]
			comp = append(comp, u)
			for _, v := range adj[u] {
				if !seen[v] {
					seen[v] = true
					st = append(st, v)
				}
			}
		}
		out = append(out, comp)
	}
	return out
}`,
          explanation: 'Every node and edge is processed once across all components.',
          complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        },
        {
          id: 'm25-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Shortest path for a delivery robot in a warehouse grid',
          story: 'A robot moves up/down/left/right through a warehouse grid (\'#\' = shelf). It may break through at most k shelves.',
          prompt: 'Write `ShortestPath(grid []string, k int) int` from top-left to bottom-right, −1 if impossible.',
          hints: ['State = (r, c, breaksLeft).', 'BFS over states; visited[r][c][b].'],
          solution: `func ShortestPath(grid []string, k int) int {
	R, C := len(grid), len(grid[0])
	type state struct{ r, c, left int }
	seen := make([][][]bool, R)
	for r := range seen {
		seen[r] = make([][]bool, C)
		for c := range seen[r] {
			seen[r][c] = make([]bool, k+1)
		}
	}
	q := []state{{0, 0, k}}
	seen[0][0][k] = true
	dirs := [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for steps := 0; len(q) > 0; steps++ {
		next := []state{}
		for _, s := range q {
			if s.r == R-1 && s.c == C-1 {
				return steps
			}
			for _, d := range dirs {
				r, c := s.r+d[0], s.c+d[1]
				if r < 0 || r >= R || c < 0 || c >= C {
					continue
				}
				left := s.left
				if grid[r][c] == '#' {
					left--
				}
				if left >= 0 && !seen[r][c][left] {
					seen[r][c][left] = true
					next = append(next, state{r, c, left})
				}
			}
		}
		q = next
	}
	return -1
}`,
          explanation: 'Adding the resource left to the state turns a constrained path problem into plain BFS over a bigger graph.',
          complexity: { time: 'O(R·C·k)', space: 'O(R·C·k)' },
        },
      ],
    },
    {
      id: 'm25-t2',
      title: 'Cycle Detection, Bipartite Graphs, Topological Sort (Kahn and DFS)',
      summary: 'Ordering dependencies and detecting impossible ones.',
      concept: [
        'Undirected cycle: during DFS, reaching a visited node that is not the parent means a cycle (or use DSU). Directed cycle: DFS with three colours — white (unvisited), grey (on the current path), black (done); an edge to a grey node is a back edge → cycle.',
        'Bipartite: 2-colour with BFS/DFS; an edge between same colours means not bipartite (odd cycle).',
        'Topological sort orders a DAG so every edge u→v has u before v. Kahn’s algorithm: repeatedly take nodes with in-degree 0; if not all nodes are taken, there is a cycle. DFS version: post-order then reverse.',
      ],
      why: 'Build systems, package managers, course prerequisites, task schedulers and spreadsheet recalculation all need topological order and cycle detection.',
      whenToUse: ['Kahn for "can all tasks finish?" and level-by-level parallel scheduling', 'Colouring for conflict/partition problems'],
      whenNotToUse: ['Topological sort on graphs with cycles (detect and report instead).'],
      syntax: `indeg := make([]int, n)
for u := range adj { for _, v := range adj[u] { indeg[v]++ } }
var q, order []int
for v := range indeg { if indeg[v] == 0 { q = append(q, v) } }
for len(q) > 0 {
	u := q[0]; q = q[1:]
	order = append(order, u)
	for _, v := range adj[u] {
		if indeg[v]--; indeg[v] == 0 { q = append(q, v) }
	}
}
hasCycle := len(order) < n`,
      example: {
        code: `Courses: 0→1, 0→2, 1→3, 2→3
indegree: [0 1 1 2]
Kahn: take 0 → indeg [_,0,0,2] → take 1, 2 → indeg 3 = 0 → take 3
order: 0 1 2 3`,
        notes: ['Several valid orders may exist (0 2 1 3 too).'],
      },
      mistakes: ['Using undirected cycle logic on directed graphs.', 'Forgetting disconnected parts (start from every node).', 'Recursion depth on long dependency chains.'],
      problems: [
        {
          id: 'm25-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Build order for microservices',
          story: 'A deploy tool must start services after their dependencies; circular dependencies must be reported.',
          prompt: 'Write `BuildOrder(services []string, deps map[string][]string) ([]string, error)` where deps[a] lists services a depends on. Use Kahn’s algorithm.',
          hints: ['Edge dep → service. In-degree = number of deps.', 'If the result is shorter than services, return an error listing the stuck ones.'],
          solution: `func BuildOrder(services []string, deps map[string][]string) ([]string, error) {
	indeg := make(map[string]int, len(services))
	users := map[string][]string{}
	for _, s := range services {
		indeg[s] += 0
		for _, d := range deps[s] {
			indeg[s]++
			users[d] = append(users[d], s)
		}
	}
	var q, order []string
	for _, s := range services {
		if indeg[s] == 0 {
			q = append(q, s)
		}
	}
	for len(q) > 0 {
		s := q[0]
		q = q[1:]
		order = append(order, s)
		for _, u := range users[s] {
			indeg[u]--
			if indeg[u] == 0 {
				q = append(q, u)
			}
		}
	}
	if len(order) < len(services) {
		var stuck []string
		for _, s := range services {
			if indeg[s] > 0 {
				stuck = append(stuck, s)
			}
		}
		return nil, fmt.Errorf("dependency cycle among %v", stuck)
	}
	return order, nil
}`,
          explanation: 'Nodes left with positive in-degree are on (or downstream of) a cycle.',
          complexity: { time: 'O(V + E)', space: 'O(V + E)' },
          variation: 'Return deploy "waves" — services that can start in parallel at each step.',
        },
        {
          id: 'm25-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Two-team split',
          story: 'A game matchmaker must split players into two teams so that no two rivals are on the same team.',
          prompt: 'Write `CanSplit(n int, rivals [][2]int) bool` with BFS 2-colouring.',
          hints: ['color[v] = −1 unvisited; neighbours get 1 − color[u].'],
          solution: `func CanSplit(n int, rivals [][2]int) bool {
	adj := make([][]int, n)
	for _, e := range rivals {
		adj[e[0]] = append(adj[e[0]], e[1])
		adj[e[1]] = append(adj[e[1]], e[0])
	}
	color := make([]int, n)
	for i := range color {
		color[i] = -1
	}
	for s := 0; s < n; s++ {
		if color[s] != -1 {
			continue
		}
		color[s] = 0
		q := []int{s}
		for len(q) > 0 {
			u := q[0]
			q = q[1:]
			for _, v := range adj[u] {
				if color[v] == -1 {
					color[v] = 1 - color[u]
					q = append(q, v)
				} else if color[v] == color[u] {
					return false
				}
			}
		}
	}
	return true
}`,
          explanation: 'A graph is bipartite iff it has no odd cycle, which BFS colouring detects as a same-colour edge.',
          complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        },
        {
          id: 'm25-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Detect deadlock in a wait-for graph',
          story: 'A database lock manager builds a wait-for graph (transaction A waits for B). A cycle means deadlock — report one cycle so a victim can be chosen.',
          prompt: 'Write `FindCycle(adj map[int][]int) []int` returning the nodes of one cycle (in order), or nil. Use three-colour DFS with a parent map.',
          hints: ['On an edge to a GREY node, walk parents back from u to that node.'],
          solution: `func FindCycle(adj map[int][]int) []int {
	const (
		white = iota
		grey
		black
	)
	color := map[int]int{}
	parent := map[int]int{}
	var cycle []int
	var dfs func(u int) bool
	dfs = func(u int) bool {
		color[u] = grey
		for _, v := range adj[u] {
			switch color[v] {
			case white:
				parent[v] = u
				if dfs(v) {
					return true
				}
			case grey:
				cycle = []int{v}
				for x := u; x != v; x = parent[x] {
					cycle = append(cycle, x)
				}
				slices.Reverse(cycle[1:])
				return true
			}
		}
		color[u] = black
		return false
	}
	for u := range adj {
		if color[u] == white && dfs(u) {
			return cycle
		}
	}
	return nil
}`,
          explanation: 'Grey nodes are exactly the current DFS path, so an edge to one closes a cycle along that path.',
          complexity: { time: 'O(V + E)', space: 'O(V)' },
        },
      ],
    },
    {
      id: 'm25-t3',
      title: 'Shortest Paths: Dijkstra, Bellman-Ford, Floyd-Warshall',
      summary: 'Choosing the algorithm by edge weights and query pattern.',
      concept: [
        'Dijkstra (non-negative weights): min-heap of (dist, node); pop the closest, relax its edges; skip stale heap entries. O((V + E) log V).',
        'Bellman-Ford handles negative weights: relax all edges V−1 times; a further improvement means a negative cycle. O(V·E). Also answers "shortest path with at most k edges".',
        'Floyd-Warshall: all-pairs shortest paths with DP over intermediate nodes: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). O(V³) — fine for V ≤ ~400.',
        '0-1 BFS (deque) handles weights 0/1 in O(V + E).',
      ],
      why: 'Routing, network latency, logistics cost, currency arbitrage (negative cycles) — weighted paths are everywhere.',
      whenToUse: ['Dijkstra for maps/routing', 'Bellman-Ford for negative edges or hop limits', 'Floyd-Warshall for small dense all-pairs'],
      whenNotToUse: ['Dijkstra with negative edges (wrong answers).', 'Floyd-Warshall on large graphs.'],
      syntax: `type item struct{ node, dist int }
// heap ordered by dist; dist[] initialised to math.MaxInt
for h.Len() > 0 {
	it := heap.Pop(h).(item)
	if it.dist > dist[it.node] { continue } // stale
	for _, e := range adj[it.node] {
		if nd := it.dist + e.w; nd < dist[e.to] {
			dist[e.to] = nd
			heap.Push(h, item{e.to, nd})
		}
	}
}`,
      example: {
        code: `A -1-> B -2-> C
A -4-> C
Dijkstra from A: pop A(0) → B=1, C=4; pop B(1) → C=3; pop C(3); stale C(4) skipped.
dist = {A:0, B:1, C:3}`,
        notes: ['The stale-entry check replaces decrease-key.'],
      },
      mistakes: ['Not skipping stale entries (still correct but slower).', 'Overflow adding to math.MaxInt.', 'Using Dijkstra with negative weights.'],
      problems: [
        {
          id: 'm25-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Fastest delivery route',
          story: 'A logistics company has hubs connected by roads with travel times; compute the fastest time from the depot to every hub.',
          prompt: 'Write `Dijkstra(n int, edges [][3]int, src int) []int` (−1 for unreachable), directed edges {u, v, w}, w ≥ 0, using container/heap.',
          hints: ['Adjacency list of {to, w}.', 'Skip popped entries whose dist is larger than the recorded one.'],
          solution: `type edge struct{ to, w int }
type qItem struct{ node, dist int }
type pq []qItem

func (p pq) Len() int            { return len(p) }
func (p pq) Less(i, j int) bool  { return p[i].dist < p[j].dist }
func (p pq) Swap(i, j int)       { p[i], p[j] = p[j], p[i] }
func (p *pq) Push(x any)         { *p = append(*p, x.(qItem)) }
func (p *pq) Pop() any           { o := *p; x := o[len(o)-1]; *p = o[:len(o)-1]; return x }

func Dijkstra(n int, edges [][3]int, src int) []int {
	adj := make([][]edge, n)
	for _, e := range edges {
		adj[e[0]] = append(adj[e[0]], edge{e[1], e[2]})
	}
	dist := make([]int, n)
	for i := range dist {
		dist[i] = math.MaxInt
	}
	dist[src] = 0
	h := &pq{{src, 0}}
	for h.Len() > 0 {
		it := heap.Pop(h).(qItem)
		if it.dist > dist[it.node] {
			continue
		}
		for _, e := range adj[it.node] {
			if nd := it.dist + e.w; nd < dist[e.to] {
				dist[e.to] = nd
				heap.Push(h, qItem{e.to, nd})
			}
		}
	}
	for i := range dist {
		if dist[i] == math.MaxInt {
			dist[i] = -1
		}
	}
	return dist
}`,
          explanation: 'With non-negative weights, the first time a node is popped its distance is final (greedy choice).',
          complexity: { time: 'O((V + E) log V)', space: 'O(V + E)' },
          variation: 'Also return the path to a target (parent array) and stop early when the target is popped.',
        },
        {
          id: 'm25-t3-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Cheapest flight with at most k stops',
          story: 'A travel site wants the cheapest fare from A to B with at most k layovers.',
          prompt: 'Write `CheapestWithStops(n int, flights [][3]int, src, dst, k int) int` using Bellman-Ford limited to k+1 rounds.',
          hints: ['Each round relaxes edges using a COPY of the previous round’s distances (so you only extend paths by one edge per round).'],
          solution: `func CheapestWithStops(n int, flights [][3]int, src, dst, k int) int {
	const inf = math.MaxInt / 2
	dist := make([]int, n)
	for i := range dist {
		dist[i] = inf
	}
	dist[src] = 0
	for round := 0; round <= k; round++ {
		next := slices.Clone(dist)
		for _, f := range flights {
			u, v, w := f[0], f[1], f[2]
			if dist[u]+w < next[v] {
				next[v] = dist[u] + w
			}
		}
		dist = next
	}
	if dist[dst] >= inf {
		return -1
	}
	return dist[dst]
}`,
          explanation: 'After round r, dist holds the cheapest cost using ≤ r+1 edges. Reading from the previous array prevents chaining multiple edges within one round. inf = MaxInt/2 avoids overflow on addition.',
          complexity: { time: 'O(k · E)', space: 'O(V)' },
        },
        {
          id: 'm25-t3-p3',
          tier: 'interview',
          level: 4,
          kind: 'concept',
          title: 'Pick the algorithm',
          prompt: 'For each: (a) city road network, 10⁶ nodes, travel times, one query from the user’s location; (b) currency exchange with log-transformed rates, detect arbitrage; (c) 200 data centres, latency between every pair, recomputed nightly; (d) grid where moving costs 0 along conveyor belts and 1 otherwise.',
          check: {
            options: ['(a) Dijkstra (b) Bellman-Ford (c) Floyd-Warshall (d) 0-1 BFS', '(a) BFS (b) Dijkstra (c) Dijkstra (d) DFS', '(a) Floyd-Warshall (b) BFS (c) Bellman-Ford (d) Dijkstra', 'Dijkstra for all four'],
            answerIndex: 0,
          },
          hints: ['Negative cycle detection needs Bellman-Ford.', '200³ = 8·10⁶ is cheap.'],
          solution: '(a) Dijkstra (or A*). (b) Bellman-Ford — −log(rate) edges; a negative cycle is arbitrage. (c) Floyd-Warshall. (d) 0-1 BFS with a deque.',
          explanation: 'Match the algorithm to weight sign, graph size and single- vs all-pairs.',
        },
      ],
    },
    {
      id: 'm25-t4',
      title: 'Minimum Spanning Trees (Prim, Kruskal) and Bridges/Articulation Points/SCCs',
      summary: 'Cheapest connected network, single points of failure, and strongly connected groups.',
      concept: [
        'MST connects all nodes with minimum total weight. Kruskal: sort edges, add each edge that joins two different DSU components. Prim: grow from a node using a min-heap of crossing edges. Both O(E log E) / O(E log V).',
        'Bridges (edges) and articulation points (nodes) whose removal disconnects the graph: Tarjan’s low-link DFS — low[v] = smallest discovery time reachable from v’s subtree with one back edge. Edge (u,v) is a bridge if low[v] > disc[u].',
        'Strongly connected components (directed): Kosaraju (DFS order, then DFS on the reversed graph) or Tarjan (one DFS with a stack). Condensing SCCs gives a DAG.',
      ],
      why: 'Network design (cheapest cabling), resilience analysis (single points of failure), and dependency cycles grouping.',
      whenToUse: ['MST for minimum-cost connectivity', 'Bridges for reliability audits', 'SCC for strongly connected service clusters'],
      whenNotToUse: ['MST is not the shortest-path tree — different objective.'],
      syntax: `slices.SortFunc(edges, func(a, b [3]int) int { return a[2] - b[2] })
d := NewDSU(n)
total := 0
for _, e := range edges {
	if d.Union(e[0], e[1]) { total += e[2] }
}`,
      example: {
        code: `Edges: (0-1,1) (1-2,2) (0-2,3) (2-3,4)
Kruskal: take 0-1(1), 1-2(2), skip 0-2(3) (same component), take 2-3(4)
MST weight = 7`,
        notes: ['Cut property: the lightest edge crossing any cut belongs to some MST.'],
      },
      mistakes: ['Forgetting the graph may be disconnected (MST forest).', 'Bridges with parallel edges (skip parent by edge id, not node).'],
      problems: [
        {
          id: 'm25-t4-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Cheapest fibre network',
          story: 'An ISP must connect n towns with fibre; each possible link has a cost.',
          prompt: 'Write `MinCableCost(n int, links [][3]int) (int, bool)` using Kruskal (with the DSU from Module 27, or an inline one). Return false if the towns cannot all be connected.',
          hints: ['Count edges added; a spanning tree has n−1.'],
          solution: `func MinCableCost(n int, links [][3]int) (int, bool) {
	parent := make([]int, n)
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
	slices.SortFunc(links, func(a, b [3]int) int { return a[2] - b[2] })
	total, used := 0, 0
	for _, l := range links {
		a, b := find(l[0]), find(l[1])
		if a == b {
			continue
		}
		parent[a] = b
		total += l[2]
		used++
	}
	return total, used == n-1
}`,
          explanation: 'Greedy by weight is optimal by the cut property; DSU rejects edges that would form a cycle.',
          complexity: { time: 'O(E log E)', space: 'O(V)' },
        },
        {
          id: 'm25-t4-p2',
          tier: 'practical',
          level: 5,
          kind: 'code',
          title: 'Critical links in a data-centre network',
          story: 'Find every cable whose failure would split the network.',
          prompt: 'Write `Bridges(n int, edges [][2]int) [][2]int` with Tarjan’s low-link DFS.',
          hints: ['disc[u] = timer; low[u] = min(low[u], disc[v]) for back edges, low[u] = min(low[u], low[v]) after visiting child v.', 'Skip the edge you came from by edge index.'],
          solution: `func Bridges(n int, edges [][2]int) [][2]int {
	type arc struct{ to, id int }
	adj := make([][]arc, n)
	for i, e := range edges {
		adj[e[0]] = append(adj[e[0]], arc{e[1], i})
		adj[e[1]] = append(adj[e[1]], arc{e[0], i})
	}
	disc := make([]int, n)
	low := make([]int, n)
	timer := 0
	var out [][2]int
	var dfs func(u, parentEdge int)
	dfs = func(u, parentEdge int) {
		timer++
		disc[u], low[u] = timer, timer
		for _, a := range adj[u] {
			if a.id == parentEdge {
				continue
			}
			if disc[a.to] == 0 {
				dfs(a.to, a.id)
				low[u] = min(low[u], low[a.to])
				if low[a.to] > disc[u] {
					out = append(out, [2]int{u, a.to})
				}
			} else {
				low[u] = min(low[u], disc[a.to])
			}
		}
	}
	for u := 0; u < n; u++ {
		if disc[u] == 0 {
			dfs(u, -1)
		}
	}
	return out
}`,
          explanation: 'If v’s subtree cannot reach u or above except through (u, v), removing that edge disconnects it. Skipping by edge id handles parallel cables correctly.',
          complexity: { time: 'O(V + E)', space: 'O(V + E)' },
          variation: 'Articulation points: u (non-root) is one if some child has low[v] ≥ disc[u]; root if it has ≥ 2 DFS children.',
        },
        {
          id: 'm25-t4-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Mutually reachable services (Kosaraju)',
          story: 'In a microservice call graph, services that can all call each other (directly or indirectly) must be deployed together.',
          prompt: 'Write `SCCs(n int, adj [][]int) [][]int` with Kosaraju’s two-pass algorithm.',
          hints: ['Pass 1: DFS, push nodes in finish order.', 'Pass 2: on the reversed graph, DFS in reverse finish order; each tree is an SCC.'],
          solution: `func SCCs(n int, adj [][]int) [][]int {
	seen := make([]bool, n)
	var order []int
	var dfs1 func(int)
	dfs1 = func(u int) {
		seen[u] = true
		for _, v := range adj[u] {
			if !seen[v] {
				dfs1(v)
			}
		}
		order = append(order, u)
	}
	for u := 0; u < n; u++ {
		if !seen[u] {
			dfs1(u)
		}
	}
	radj := make([][]int, n)
	for u := range adj {
		for _, v := range adj[u] {
			radj[v] = append(radj[v], u)
		}
	}
	comp := make([]int, n)
	for i := range comp {
		comp[i] = -1
	}
	var out [][]int
	var dfs2 func(u, c int)
	dfs2 = func(u, c int) {
		comp[u] = c
		out[c] = append(out[c], u)
		for _, v := range radj[u] {
			if comp[v] == -1 {
				dfs2(v, c)
			}
		}
	}
	for i := n - 1; i >= 0; i-- {
		if u := order[i]; comp[u] == -1 {
			out = append(out, nil)
			dfs2(u, len(out)-1)
		}
	}
	return out
}`,
          explanation: 'The node finishing last lies in a "source" SCC of the condensation; in the reversed graph, DFS from it cannot leak into other SCCs.',
          complexity: { time: 'O(V + E)', space: 'O(V + E)' },
        },
      ],
    },
  ],
}

export const MODULE_26: Module = {
  id: 'm26',
  number: 26,
  track: 'dsa',
  title: 'Trie',
  shortTitle: 'Trie',
  tagline: 'Prefix trees for autocomplete, dictionaries, wildcard search and word search on boards.',
  topics: [
    {
      id: 'm26-t1',
      title: 'Trie Insert, Search, Prefix, Autocomplete and Wildcards',
      summary: 'One node per character; shared prefixes share paths.',
      concept: [
        'A trie stores strings as paths from the root; each node has children (array [26]*Node for lowercase, or map[rune]*Node) and an end-of-word flag.',
        'Insert/search/startsWith are O(L) — independent of how many words are stored.',
        'Autocomplete: walk to the prefix node, then DFS to collect words (store counts or top-K per node for ranking). Wildcard ".": branch to all children at that position.',
        'Word search on a board: put the dictionary in a trie and DFS the grid, pruning when the path is not a prefix.',
      ],
      why: 'Search boxes, routing tables (longest-prefix match), spell checkers and IP lookup need fast prefix queries.',
      whenToUse: ['Many prefix queries over a large dictionary', 'Longest-prefix match'],
      whenNotToUse: ['Exact-match only (hash set is simpler and smaller).', 'Huge alphabets with array children (memory blow-up — use maps or compressed radix trees).'],
      syntax: `type Trie struct {
	children [26]*Trie
	end      bool
}
func (t *Trie) Insert(w string) {
	n := t
	for i := 0; i < len(w); i++ {
		c := w[i] - 'a'
		if n.children[c] == nil { n.children[c] = &Trie{} }
		n = n.children[c]
	}
	n.end = true
}`,
      example: {
        code: `insert: car, cart, cat
root
 └ c
   └ a
     ├ r (end)
     │ └ t (end)
     └ t (end)
startsWith("ca") → true; search("ca") → false`,
        notes: ['"car" and "cart" share 3 nodes.', 'search needs end == true; startsWith only needs the path.'],
      },
      mistakes: ['Confusing search and startsWith.', 'Array children for Unicode input.', 'Collecting autocomplete results without a limit.'],
      problems: [
        {
          id: 'm26-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Product search trie',
          prompt: 'Implement `Trie` with `Insert(w)`, `Search(w) bool`, `StartsWith(p) bool` for lowercase words.',
          hints: ['A shared `walk(s) *Trie` helper returns the node at the end of s or nil.'],
          solution: `type Trie struct {
	children [26]*Trie
	end      bool
}

func (t *Trie) Insert(w string) {
	n := t
	for i := 0; i < len(w); i++ {
		c := w[i] - 'a'
		if n.children[c] == nil {
			n.children[c] = &Trie{}
		}
		n = n.children[c]
	}
	n.end = true
}

func (t *Trie) walk(s string) *Trie {
	n := t
	for i := 0; i < len(s) && n != nil; i++ {
		n = n.children[s[i]-'a']
	}
	return n
}

func (t *Trie) Search(w string) bool     { n := t.walk(w); return n != nil && n.end }
func (t *Trie) StartsWith(p string) bool { return t.walk(p) != nil }`,
          explanation: 'All three operations follow one path of length L.',
          complexity: { time: 'O(L) per op', space: 'O(total characters × 26 pointers) worst case' },
        },
        {
          id: 'm26-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Autocomplete top suggestions',
          story: 'A search engine suggests up to 5 completions in lexicographic order as the user types.',
          prompt: 'Add `Suggest(prefix string, limit int) []string` to the Trie, returning words in lexicographic order, stopping after limit.',
          hints: ['Walk to the prefix node; DFS children 0..25 in order; prune when len(out) == limit.', 'Carry the current word in a []byte buffer.'],
          solution: `func (t *Trie) Suggest(prefix string, limit int) []string {
	n := t.walk(prefix)
	if n == nil {
		return nil
	}
	var out []string
	buf := []byte(prefix)
	var dfs func(*Trie)
	dfs = func(node *Trie) {
		if len(out) == limit {
			return
		}
		if node.end {
			out = append(out, string(buf))
		}
		for c, child := range node.children {
			if child != nil {
				buf = append(buf, byte('a'+c))
				dfs(child)
				buf = buf[:len(buf)-1]
			}
		}
	}
	dfs(n)
	return out
}`,
          explanation: 'Visiting children in index order yields lexicographic output; the early return bounds work by the limit.',
          complexity: { time: 'O(L + nodes visited until limit)', space: 'O(depth)' },
          variation: 'Rank by popularity: store per-node the top-5 words by search count, updated on insert — O(L) query.',
        },
        {
          id: 'm26-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Wildcard dictionary',
          prompt: 'Implement `WordDictionary` with `Add(word)` and `Match(pattern) bool` where "." matches any one letter.',
          hints: ['Recursive match(node, i): on "." try every non-nil child.'],
          solution: `type WordDictionary struct{ root Trie }

func (d *WordDictionary) Add(w string) { d.root.Insert(w) }

func (d *WordDictionary) Match(p string) bool {
	var match func(n *Trie, i int) bool
	match = func(n *Trie, i int) bool {
		if n == nil {
			return false
		}
		if i == len(p) {
			return n.end
		}
		if p[i] == '.' {
			for _, child := range n.children {
				if match(child, i+1) {
					return true
				}
			}
			return false
		}
		return match(n.children[p[i]-'a'], i+1)
	}
	return match(&d.root, 0)
}`,
          explanation: 'Without wildcards it is a single path; each "." multiplies branches by up to 26.',
          complexity: { time: 'O(L) without dots; O(26^dots · L) worst case', space: 'O(L) recursion' },
          variation: 'Word Search II: find all dictionary words on a letter board using a trie + DFS with pruning and removing found words from the trie.',
        },
      ],
    },
  ],
}

export const MODULE_27: Module = {
  id: 'm27',
  number: 27,
  track: 'dsa',
  title: 'Disjoint Set Union',
  shortTitle: 'DSU',
  tagline: 'Union-Find with path compression and union by rank/size — near-constant connectivity.',
  topics: [
    {
      id: 'm27-t1',
      title: 'Union-Find: Find, Union, Path Compression, Rank/Size',
      summary: 'Track which elements are connected as edges arrive.',
      concept: [
        'DSU keeps a parent array; each set is a tree whose root is its representative. Find follows parents to the root; Union links one root under another.',
        'Path compression (point nodes directly at the root during Find) + union by rank/size (attach the smaller tree under the larger) give amortised O(α(n)) per operation — effectively constant.',
        'Uses: connected components under edge additions, cycle detection in undirected graphs (union of already-connected endpoints), Kruskal’s MST, grouping equivalent accounts/emails.',
        'DSU cannot efficiently delete edges (offline tricks or link-cut trees are needed).',
      ],
      why: 'Answers "are a and b connected?" while edges keep arriving, faster than re-running BFS.',
      whenToUse: ['Dynamic connectivity with only unions', 'Kruskal', 'Merging duplicate entities'],
      whenNotToUse: ['When edges are removed.', 'When you need the actual path between nodes (use BFS).'],
      syntax: `type DSU struct{ parent, size []int }
func NewDSU(n int) *DSU {
	d := &DSU{make([]int, n), make([]int, n)}
	for i := range d.parent { d.parent[i], d.size[i] = i, 1 }
	return d
}
func (d *DSU) Find(x int) int {
	for d.parent[x] != x {
		d.parent[x] = d.parent[d.parent[x]] // path halving
		x = d.parent[x]
	}
	return x
}
func (d *DSU) Union(a, b int) bool {
	a, b = d.Find(a), d.Find(b)
	if a == b { return false }
	if d.size[a] < d.size[b] { a, b = b, a }
	d.parent[b] = a
	d.size[a] += d.size[b]
	return true
}`,
      example: {
        code: `d := NewDSU(5)
d.Union(0, 1)   // true
d.Union(3, 4)   // true
d.Union(1, 0)   // false — already connected (would be a cycle)
d.Find(0) == d.Find(1) // true
d.Find(1) == d.Find(3) // false`,
        notes: ['Union returning false is exactly undirected cycle detection.', 'Path halving is an iterative form of path compression.'],
      },
      mistakes: ['Union without Find (linking non-roots).', 'Recursive Find on huge inputs without compression (deep chains).', 'Counting components without decrementing on successful unions.'],
      problems: [
        {
          id: 'm27-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Count network components',
          prompt: 'Using DSU, write `Components(n int, links [][2]int) int`.',
          hints: ['Start with n; each successful Union reduces by 1.'],
          solution: `func Components(n int, links [][2]int) int {
	d := NewDSU(n)
	count := n
	for _, l := range links {
		if d.Union(l[0], l[1]) {
			count--
		}
	}
	return count
}`,
          explanation: 'Each union of two different sets merges two components into one.',
          complexity: { time: 'O((n + m) α(n))', space: 'O(n)' },
        },
        {
          id: 'm27-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Redundant cable',
          story: 'A tree network got one extra cable added, creating a cycle. Find the cable that can be removed (the last one in input order that closes a cycle).',
          prompt: 'Write `Redundant(edges [][2]int) [2]int` (nodes 1..n).',
          hints: ['The first edge whose Union returns false closes the cycle.'],
          solution: `func Redundant(edges [][2]int) [2]int {
	d := NewDSU(len(edges) + 1)
	for _, e := range edges {
		if !d.Union(e[0], e[1]) {
			return e
		}
	}
	return [2]int{}
}`,
          explanation: 'Processing edges in order, the edge that connects two already-connected nodes is the latest edge on the unique cycle.',
          complexity: { time: 'O(n α(n))', space: 'O(n)' },
        },
        {
          id: 'm27-t1-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Merge customer accounts',
          story: 'A bank has customer records [name, email1, email2, …]; records sharing any email belong to the same person.',
          prompt: 'Write `MergeAccounts(accounts [][]string) [][]string` returning [name, sorted emails…] per person. Use DSU over email indexes.',
          hints: ['Map each email to an id; union all emails within a record.', 'Group emails by root, then sort.'],
          solution: `func MergeAccounts(accounts [][]string) [][]string {
	id := map[string]int{}
	owner := map[string]string{}
	for _, acc := range accounts {
		for _, e := range acc[1:] {
			if _, ok := id[e]; !ok {
				id[e] = len(id)
			}
			owner[e] = acc[0]
		}
	}
	d := NewDSU(len(id))
	for _, acc := range accounts {
		for _, e := range acc[2:] {
			d.Union(id[acc[1]], id[e])
		}
	}
	groups := map[int][]string{}
	for e, i := range id {
		r := d.Find(i)
		groups[r] = append(groups[r], e)
	}
	var out [][]string
	for _, emails := range groups {
		slices.Sort(emails)
		out = append(out, append([]string{owner[emails[0]]}, emails...))
	}
	return out
}`,
          explanation: 'Emails are the nodes; a record is a set of edges connecting them. Components are people.',
          complexity: { time: 'O(E log E) dominated by sorting', space: 'O(E)' },
          variation: 'Process records as a stream and answer "same person?" queries online.',
        },
      ],
    },
  ],
}
