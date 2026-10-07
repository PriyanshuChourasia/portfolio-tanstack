import type { Module } from '../types'

export const MODULE_22: Module = {
  id: 'm22',
  number: 22,
  track: 'dsa',
  title: 'Trees',
  shortTitle: 'Trees',
  tagline: 'Binary tree shapes and measures, every traversal (recursive and iterative), views, LCA, path sums, serialisation and construction.',
  topics: [
    {
      id: 'm22-t1',
      title: 'Binary Tree Basics: Types, Height, Depth, Diameter',
      summary: 'Full, complete, perfect, balanced — and the post-order "return info upward" pattern.',
      concept: [
        'A binary tree node has at most two children. Depth of a node = edges from the root; height of a tree = edges (or nodes, define it!) on the longest root-to-leaf path.',
        'Full: every node has 0 or 2 children. Complete: all levels full except possibly the last, filled left to right (heaps). Perfect: all internal nodes have 2 children and all leaves share a depth (2^(h+1) − 1 nodes). Balanced: for every node, subtree heights differ by ≤ 1.',
        'Most tree problems are solved by a recursive function that returns information about a subtree (height, sum, is-balanced) and combines children’s answers — a post-order pattern. Global answers (diameter) are updated along the way.',
      ],
      why: 'Trees model hierarchies (file systems, org charts, DOM, JSON) and power search structures (BSTs, heaps, tries).',
      whenToUse: ['Recursive decomposition for any "per subtree" property'],
      whenNotToUse: ['Recursion on extremely deep, degenerate trees (convert to iterative).'],
      syntax: `type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

func height(n *TreeNode) int {
	if n == nil { return 0 }
	return 1 + max(height(n.Left), height(n.Right))
}`,
      example: {
        code: `// Diameter: longest path (in edges) between any two nodes.
func diameter(root *TreeNode) int {
	best := 0
	var depth func(*TreeNode) int
	depth = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l, r := depth(n.Left), depth(n.Right)
		best = max(best, l+r)
		return 1 + max(l, r)
	}
	depth(root)
	return best
}`,
        notes: ['depth returns the height in nodes of each subtree.', 'The longest path through n uses l + r edges.', 'A closure captures best; declare `var depth func…` first so it can recurse.'],
      },
      mistakes: ['Mixing "height in nodes" and "height in edges".', 'Computing height repeatedly inside another recursion → O(n²).', 'Forgetting the nil base case.'],
      problems: [
        {
          id: 'm22-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Perfect tree node count',
          prompt: 'A perfect binary tree has height 4 (edges from root to each leaf). How many nodes and leaves?',
          check: { options: ['31 nodes, 16 leaves', '15 nodes, 8 leaves', '16 nodes, 8 leaves', '32 nodes, 16 leaves'], answerIndex: 0 },
          hints: ['Levels 0..4, level i has 2^i nodes.'],
          solution: '31 nodes, 16 leaves.',
          explanation: 'Sum 2^0..2^4 = 2^5 − 1 = 31; leaves at level 4 = 2^4 = 16. In general leaves = internal nodes + 1.',
        },
        {
          id: 'm22-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Is the org chart balanced?',
          story: 'An HR tool flags org charts (as binary trees) whose sub-teams differ too much in depth.',
          prompt: 'Write `IsBalanced(root *TreeNode) bool` in O(n) — single traversal.',
          hints: ['Return −1 from the helper to signal "unbalanced" and short-circuit.'],
          solution: `func IsBalanced(root *TreeNode) bool {
	var h func(*TreeNode) int
	h = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l := h(n.Left)
		if l < 0 {
			return -1
		}
		r := h(n.Right)
		if r < 0 || l-r > 1 || r-l > 1 {
			return -1
		}
		return 1 + max(l, r)
	}
	return h(root) >= 0
}`,
          explanation: 'Computing heights bottom-up once avoids the O(n²) "call height at every node" approach.',
          complexity: { time: 'O(n)', space: 'O(h) stack' },
        },
        {
          id: 'm22-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Network latency diameter',
          story: 'A tree-shaped network of routers: find the two routers with the longest hop distance (worst-case latency).',
          prompt: 'Write `Diameter(root *TreeNode) int` in edges. Then: how would you do it for a general tree given as an adjacency list (no root)?',
          hints: ['Post-order: best = max(best, left+right).', 'General tree: BFS from any node to the farthest node A, then BFS from A — farthest distance is the diameter.'],
          solution: `func Diameter(root *TreeNode) int {
	best := 0
	var depth func(*TreeNode) int
	depth = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l, r := depth(n.Left), depth(n.Right)
		best = max(best, l+r)
		return 1 + max(l, r)
	}
	depth(root)
	return best
}`,
          explanation: 'Every path has a highest node; at that node the path length is left depth + right depth. The double-BFS trick works on any unweighted tree.',
          complexity: { time: 'O(n)', space: 'O(h)' },
        },
      ],
    },
    {
      id: 'm22-t2',
      title: 'Traversals: Pre/In/Post-order, Level Order, Zigzag, Iterative',
      summary: 'Visit order determines what problems each traversal solves.',
      concept: [
        'Preorder (node, left, right): copying/serialising trees. Inorder (left, node, right): sorted order for BSTs. Postorder (left, right, node): deleting, computing subtree aggregates.',
        'Level order (BFS) uses a queue; process `len(queue)` nodes per level to know level boundaries. Zigzag alternates direction per level.',
        'Iterative DFS uses an explicit stack — required for very deep trees and asked in interviews. Iterative inorder: go left pushing, pop, visit, go right.',
      ],
      why: 'Choosing the right traversal often IS the solution.',
      whenToUse: ['Level order for "per level" answers (right view, averages)', 'Inorder for BST order', 'Postorder for bottom-up aggregates'],
      whenNotToUse: ['Recursion when depth may be ~10⁶.'],
      syntax: `func inorder(n *TreeNode, visit func(int)) {
	if n == nil { return }
	inorder(n.Left, visit)
	visit(n.Val)
	inorder(n.Right, visit)
}`,
      example: {
        code: `//        1
//       / \\
//      2   3
//     / \\
//    4   5
// pre:  1 2 4 5 3
// in:   4 2 5 1 3
// post: 4 5 2 3 1
// level: [1] [2 3] [4 5]`,
        notes: ['Memorise this small tree; use it to sanity-check every traversal you write.'],
      },
      mistakes: ['Not snapshotting the level size before the inner loop.', 'Iterative postorder ordering mistakes (use reversed modified preorder).'],
      problems: [
        {
          id: 'm22-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Which traversal?',
          prompt: 'For the tree above (1; 2,3; 4,5 under 2), what is the postorder?',
          check: { options: ['4 5 2 3 1', '4 2 5 1 3', '1 2 4 5 3', '4 5 3 2 1'], answerIndex: 0 },
          hints: ['Left subtree fully, right subtree fully, then the node.'],
          solution: '`4 5 2 3 1`',
          explanation: 'Post(2) = 4 5 2, Post(3) = 3, then 1.',
        },
        {
          id: 'm22-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Iterative inorder',
          prompt: 'Write `InorderIter(root *TreeNode) []int` without recursion.',
          hints: ['Push all left children; pop, record, move to right child.'],
          solution: `func InorderIter(root *TreeNode) []int {
	var out []int
	var st []*TreeNode
	cur := root
	for cur != nil || len(st) > 0 {
		for cur != nil {
			st = append(st, cur)
			cur = cur.Left
		}
		cur = st[len(st)-1]
		st = st[:len(st)-1]
		out = append(out, cur.Val)
		cur = cur.Right
	}
	return out
}`,
          explanation: 'The stack simulates the call stack: nodes wait until their left subtree is done.',
          complexity: { time: 'O(n)', space: 'O(h)' },
          variation: 'Morris traversal: inorder with O(1) extra space by temporarily threading right pointers.',
        },
        {
          id: 'm22-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Zigzag level order of a comment thread',
          story: 'A social app renders a comment tree level by level, alternating direction for a visual effect.',
          prompt: 'Write `Zigzag(root *TreeNode) [][]int`.',
          hints: ['Level-order BFS; reverse every other level (or fill by index).'],
          solution: `func Zigzag(root *TreeNode) [][]int {
	if root == nil {
		return nil
	}
	var out [][]int
	q := []*TreeNode{root}
	leftToRight := true
	for len(q) > 0 {
		n := len(q)
		level := make([]int, n)
		for i := 0; i < n; i++ {
			node := q[i]
			idx := i
			if !leftToRight {
				idx = n - 1 - i
			}
			level[idx] = node.Val
			if node.Left != nil {
				q = append(q, node.Left)
			}
			if node.Right != nil {
				q = append(q, node.Right)
			}
		}
		q = q[n:]
		out = append(out, level)
		leftToRight = !leftToRight
	}
	return out
}`,
          explanation: 'Placing values by computed index avoids an extra reverse.',
          complexity: { time: 'O(n)', space: 'O(width)' },
        },
      ],
    },
    {
      id: 'm22-t3',
      title: 'Views, LCA, Path Sums, Serialisation, Construction, Flattening',
      summary: 'The advanced tree toolkit.',
      concept: [
        'Views: right view = last node per level; left view = first; top/bottom view = first/last node per horizontal distance (BFS with column index); vertical order groups by column then row.',
        'Lowest common ancestor (binary tree): recurse; if a node is p or q return it; if both sides return non-nil, the current node is the LCA.',
        'Maximum path sum: post-order returns the best downward path; the global best considers left + node + right with negative branches clipped at 0.',
        'Serialisation: preorder with null markers is enough to rebuild. Construction from traversals: preorder gives roots, inorder splits left/right (use a value→index map).',
      ],
      why: 'These are the most frequent "hard" tree interview questions and appear in real systems (DOM diffing, org-chart queries, file trees).',
      whenToUse: ['LCA for hierarchy queries (common manager)', 'Serialisation for caching/transmitting trees'],
      whenNotToUse: ['Repeated LCA queries on a huge static tree — use binary lifting (O(log n) per query).'],
      syntax: `func lca(n, p, q *TreeNode) *TreeNode {
	if n == nil || n == p || n == q { return n }
	l, r := lca(n.Left, p, q), lca(n.Right, p, q)
	if l != nil && r != nil { return n }
	if l != nil { return l }
	return r
}`,
      example: {
        code: `// Right side view via BFS
func rightView(root *TreeNode) []int {
	var out []int
	q := []*TreeNode{}
	if root != nil {
		q = append(q, root)
	}
	for len(q) > 0 {
		n := len(q)
		out = append(out, q[n-1].Val)
		for _, node := range q[:n] {
			if node.Left != nil { q = append(q, node.Left) }
			if node.Right != nil { q = append(q, node.Right) }
		}
		q = q[n:]
	}
	return out
}`,
        notes: ['The last node in each level is visible from the right.'],
      },
      mistakes: ['LCA assuming both nodes exist when they might not.', 'Max path sum not clipping negative branches.', 'Serialising without null markers (ambiguous).'],
      problems: [
        {
          id: 'm22-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Common manager (LCA)',
          story: 'An HR system needs the lowest common manager of two employees in a binary org chart.',
          prompt: 'Write `LCA(root, p, q *TreeNode) *TreeNode` assuming both exist. Then state what changes if they might not.',
          hints: ['Return the node itself if it equals p or q.'],
          solution: `func LCA(root, p, q *TreeNode) *TreeNode {
	if root == nil || root == p || root == q {
		return root
	}
	l := LCA(root.Left, p, q)
	r := LCA(root.Right, p, q)
	switch {
	case l != nil && r != nil:
		return root
	case l != nil:
		return l
	default:
		return r
	}
}`,
          explanation: 'If p and q are in different subtrees, the current node is the split point. If one may be missing, track found-counts and only accept the answer if both were found.',
          complexity: { time: 'O(n)', space: 'O(h)' },
        },
        {
          id: 'm22-t3-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Serialize and deserialize a category tree',
          story: 'An e-commerce category tree is cached in Redis as a string.',
          prompt: 'Write `Serialize(root) string` and `Deserialize(s string) *TreeNode` using preorder with "#" for nil, comma-separated.',
          hints: ['Serialize: recursive preorder writing to a strings.Builder.', 'Deserialize: split, then a recursive builder consuming tokens with an index.'],
          solution: `func Serialize(root *TreeNode) string {
	var sb strings.Builder
	var walk func(*TreeNode)
	walk = func(n *TreeNode) {
		if n == nil {
			sb.WriteString("#,")
			return
		}
		sb.WriteString(strconv.Itoa(n.Val))
		sb.WriteByte(',')
		walk(n.Left)
		walk(n.Right)
	}
	walk(root)
	return sb.String()
}

func Deserialize(s string) *TreeNode {
	tokens := strings.Split(strings.TrimSuffix(s, ","), ",")
	i := 0
	var build func() *TreeNode
	build = func() *TreeNode {
		t := tokens[i]
		i++
		if t == "#" {
			return nil
		}
		v, _ := strconv.Atoi(t)
		n := &TreeNode{Val: v}
		n.Left = build()
		n.Right = build()
		return n
	}
	return build()
}`,
          explanation: 'Preorder with explicit nils uniquely determines the tree, and rebuilding consumes tokens in exactly the same order.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Make the format compact for a BST (no null markers needed — why?).',
        },
        {
          id: 'm22-t3-p3',
          tier: 'interview',
          level: 5,
          kind: 'code',
          title: 'Most profitable route (max path sum)',
          story: 'Each node in a road network tree has a toll profit (possibly negative). Find the best path between any two nodes.',
          prompt: 'Write `MaxPathSum(root *TreeNode) int` (path must contain at least one node).',
          hints: ['Helper returns the best downward path starting at the node.', 'Clip negative child contributions at 0.'],
          solution: `func MaxPathSum(root *TreeNode) int {
	best := math.MinInt
	var gain func(*TreeNode) int
	gain = func(n *TreeNode) int {
		if n == nil {
			return 0
		}
		l := max(gain(n.Left), 0)
		r := max(gain(n.Right), 0)
		best = max(best, n.Val+l+r)
		return n.Val + max(l, r)
	}
	gain(root)
	return best
}`,
          explanation: 'A path can bend once (at its highest node) — that is n.Val + l + r — but what is returned upward can use only one branch.',
          complexity: { time: 'O(n)', space: 'O(h)' },
        },
        {
          id: 'm22-t3-p4',
          tier: 'advanced',
          level: 5,
          kind: 'code',
          title: 'Build a tree from preorder and inorder',
          prompt: 'Write `BuildTree(pre, in []int) *TreeNode` (unique values) in O(n).',
          hints: ['pre[0] is the root; its index in inorder splits left/right sizes.', 'Use a map value→inorder index and a moving preorder pointer.'],
          solution: `func BuildTree(pre, in []int) *TreeNode {
	idx := make(map[int]int, len(in))
	for i, v := range in {
		idx[v] = i
	}
	p := 0
	var build func(lo, hi int) *TreeNode
	build = func(lo, hi int) *TreeNode {
		if lo > hi {
			return nil
		}
		v := pre[p]
		p++
		n := &TreeNode{Val: v}
		mid := idx[v]
		n.Left = build(lo, mid-1)
		n.Right = build(mid+1, hi)
		return n
	}
	return build(0, len(in)-1)
}`,
          explanation: 'Preorder visits roots in the same order the recursion creates them; inorder bounds tell each subtree’s extent.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Flatten the tree to a linked list in preorder, in place (right pointers), O(1) extra space.',
        },
      ],
    },
  ],
}

export const MODULE_23: Module = {
  id: 'm23',
  number: 23,
  track: 'dsa',
  title: 'Binary Search Tree',
  shortTitle: 'BST',
  tagline: 'Search, insert, delete, validate; successor/predecessor, k-th smallest, LCA and why balancing matters.',
  topics: [
    {
      id: 'm23-t1',
      title: 'BST Operations and Validation',
      summary: 'Left < node < right — for the whole subtree, not just children.',
      concept: [
        'BST invariant: every key in the left subtree < node < every key in the right subtree. Inorder traversal yields sorted order.',
        'Search/insert/delete are O(h): O(log n) if balanced, O(n) if degenerate (sorted inserts produce a linked list). Balanced variants: AVL, red-black trees, B-trees (databases), treaps, skip lists as an alternative.',
        'Delete has three cases: leaf (remove), one child (splice), two children (replace with inorder successor — the minimum of the right subtree — then delete that).',
        'Validation must pass min/max bounds down the recursion; checking only parent-child pairs is wrong.',
      ],
      why: 'Ordered maps (range queries, floor/ceiling, rank) need tree structure; hash maps cannot do them.',
      whenToUse: ['Ordered iteration, range queries, nearest key', 'Leaderboards, interval scheduling'],
      whenNotToUse: ['Pure key lookup (hash map is faster).', 'Unbalanced BST on adversarial/sorted input.'],
      syntax: `func insert(n *TreeNode, v int) *TreeNode {
	if n == nil { return &TreeNode{Val: v} }
	if v < n.Val { n.Left = insert(n.Left, v) } else if v > n.Val { n.Right = insert(n.Right, v) }
	return n
}`,
      example: {
        code: `func isValidBST(root *TreeNode) bool {
	var ok func(n *TreeNode, lo, hi *int) bool
	ok = func(n *TreeNode, lo, hi *int) bool {
		if n == nil {
			return true
		}
		if (lo != nil && n.Val <= *lo) || (hi != nil && n.Val >= *hi) {
			return false
		}
		return ok(n.Left, lo, &n.Val) && ok(n.Right, &n.Val, hi)
	}
	return ok(root, nil, nil)
}`,
        notes: ['Pointers express "no bound" without sentinel values that could collide with real keys (math.MinInt).', 'Every node is checked against all its ancestors’ constraints.'],
      },
      mistakes: ['Validating only immediate children.', 'Forgetting to reattach the returned subtree in recursive insert/delete.', 'Duplicate-key policy not defined.'],
      problems: [
        {
          id: 'm23-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Is this a valid BST?',
          prompt: 'Root 10, left child 5, right child 15; 15 has left child 6 and right child 20. Valid BST?',
          check: { options: ['No — 6 is in the right subtree of 10 but less than 10', 'Yes — every parent/child pair is ordered', 'No — 20 is too large', 'Yes — inorder is sorted'], answerIndex: 0 },
          hints: ['Check 6 against ALL ancestors.'],
          solution: 'No.',
          explanation: '6 < 15 (fine locally) but 6 < 10 while being in 10’s right subtree. Inorder is 5 10 6 15 20 — not sorted.',
        },
        {
          id: 'm23-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Delete a product SKU from a BST index',
          prompt: 'Write `Delete(root *TreeNode, key int) *TreeNode` handling all three cases.',
          hints: ['Two children: copy successor’s value into the node, then delete the successor from the right subtree.'],
          solution: `func Delete(n *TreeNode, key int) *TreeNode {
	if n == nil {
		return nil
	}
	switch {
	case key < n.Val:
		n.Left = Delete(n.Left, key)
	case key > n.Val:
		n.Right = Delete(n.Right, key)
	default:
		if n.Left == nil {
			return n.Right
		}
		if n.Right == nil {
			return n.Left
		}
		succ := n.Right
		for succ.Left != nil {
			succ = succ.Left
		}
		n.Val = succ.Val
		n.Right = Delete(n.Right, succ.Val)
	}
	return n
}`,
          explanation: 'The successor has no left child, so deleting it is one of the easy cases.',
          complexity: { time: 'O(h)', space: 'O(h) recursion', worst: 'O(n) for a degenerate tree' },
        },
        {
          id: 'm23-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Why balance?',
          prompt: 'You insert user IDs 1, 2, 3, …, 1,000,000 in order into a plain BST. What is the height and lookup cost? Name two structures that fix it and what Go offers.',
          hints: ['Each insert goes right.'],
          solution: 'The tree degenerates into a linked list: height ≈ 10⁶, lookups O(n), and recursive operations overflow deep stacks. Self-balancing trees (AVL, red-black) keep height O(log n) via rotations; B-trees keep height tiny with high fan-out (databases). Skip lists and treaps give expected O(log n). Go’s stdlib has no ordered map: use a sorted slice + slices.BinarySearch for mostly-static data, or a library (e.g. github.com/google/btree).',
          explanation: 'BST complexity is O(h); balancing is what makes h = O(log n).',
        },
      ],
    },
    {
      id: 'm23-t2',
      title: 'Successor, Predecessor, K-th Smallest/Largest, BST LCA',
      summary: 'Exploiting order to answer rank and neighbour queries.',
      concept: [
        'Inorder successor of key k: the smallest key > k. Walk from the root: if node > k, it is a candidate — go left; otherwise go right. Predecessor is symmetric. O(h), no parent pointers needed.',
        'K-th smallest: iterative inorder stopping at the k-th visit — O(h + k). With subtree sizes stored in nodes (order-statistic tree) it is O(h).',
        'BST LCA: walk from the root; if both keys are smaller go left, both larger go right, else the current node splits them.',
      ],
      why: 'Rank, floor/ceiling and nearest-neighbour queries are what ordered structures are for (leaderboards, time-series lookups).',
      whenToUse: ['"Next scheduled event after t"', '"k-th best score"'],
      whenNotToUse: ['When only membership is needed.'],
      syntax: `func successor(root *TreeNode, k int) *TreeNode {
	var cand *TreeNode
	for n := root; n != nil; {
		if n.Val > k { cand, n = n, n.Left } else { n = n.Right }
	}
	return cand
}`,
      example: {
        code: `// BST: 20 (8 (4, 12 (10, 14)), 22)
// successor(8)  = 10
// successor(14) = 20
// kth smallest k=3 → 10`,
        notes: ['Successor of 14 has no right subtree, so it is the lowest ancestor for which 14 is in the left subtree: 20.'],
      },
      mistakes: ['Returning the right child instead of the leftmost node of the right subtree.', 'Not handling "no successor" (nil).'],
      problems: [
        {
          id: 'm23-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Next available appointment',
          story: 'A clinic stores booked slot start times (minutes) in a BST. Find the next booked slot strictly after time t.',
          prompt: 'Write `Successor(root *TreeNode, t int) (int, bool)` in O(h).',
          hints: ['Track the last node where you went left.'],
          solution: `func Successor(root *TreeNode, t int) (int, bool) {
	var cand *TreeNode
	for n := root; n != nil; {
		if n.Val > t {
			cand, n = n, n.Left
		} else {
			n = n.Right
		}
	}
	if cand == nil {
		return 0, false
	}
	return cand.Val, true
}`,
          explanation: 'Every time we go left, the current node is a candidate larger than t; the last one recorded is the smallest such.',
          complexity: { time: 'O(h)', space: 'O(1)' },
        },
        {
          id: 'm23-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'K-th highest scorer',
          story: 'A game leaderboard stored as a BST of scores needs the k-th highest.',
          prompt: 'Write `KthLargest(root *TreeNode, k int) (int, bool)` with reverse inorder, stopping early.',
          hints: ['Reverse inorder: right, node, left — iteratively with a stack.'],
          solution: `func KthLargest(root *TreeNode, k int) (int, bool) {
	var st []*TreeNode
	cur := root
	for cur != nil || len(st) > 0 {
		for cur != nil {
			st = append(st, cur)
			cur = cur.Right
		}
		cur = st[len(st)-1]
		st = st[:len(st)-1]
		k--
		if k == 0 {
			return cur.Val, true
		}
		cur = cur.Left
	}
	return 0, false
}`,
          explanation: 'Reverse inorder visits keys in descending order; stopping at k avoids walking the whole tree.',
          complexity: { time: 'O(h + k)', space: 'O(h)' },
          variation: 'Support k-th queries in O(log n) under inserts by augmenting nodes with subtree size.',
        },
        {
          id: 'm23-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Two-sum in a BST',
          prompt: 'Return true if two distinct nodes sum to target, in O(n) time and O(h) space (no hash set).',
          hints: ['Two iterators: ascending (inorder) and descending (reverse inorder), like two pointers on a sorted array.'],
          solution: `type bstIter struct {
	st      []*TreeNode
	forward bool
}

func (it *bstIter) pushAll(n *TreeNode) {
	for n != nil {
		it.st = append(it.st, n)
		if it.forward {
			n = n.Left
		} else {
			n = n.Right
		}
	}
}

func (it *bstIter) next() *TreeNode {
	n := it.st[len(it.st)-1]
	it.st = it.st[:len(it.st)-1]
	if it.forward {
		it.pushAll(n.Right)
	} else {
		it.pushAll(n.Left)
	}
	return n
}

func FindTarget(root *TreeNode, target int) bool {
	if root == nil {
		return false
	}
	lo, hi := &bstIter{forward: true}, &bstIter{}
	lo.pushAll(root)
	hi.pushAll(root)
	a, b := lo.next(), hi.next()
	for a != b {
		switch s := a.Val + b.Val; {
		case s == target:
			return true
		case s < target:
			a = lo.next()
		default:
			b = hi.next()
		}
	}
	return false
}`,
          explanation: 'Two lazy iterators give sorted access from both ends with O(h) memory each; the loop ends when they meet.',
          complexity: { time: 'O(n)', space: 'O(h)' },
        },
      ],
    },
  ],
}

export const MODULE_24: Module = {
  id: 'm24',
  number: 24,
  track: 'dsa',
  title: 'Heap / Priority Queue',
  shortTitle: 'Heap',
  tagline: 'Min/max heaps from scratch, heapify, heap sort, container/heap, top-K, merge K, median of a stream, scheduling.',
  topics: [
    {
      id: 'm24-t1',
      title: 'Heaps from Scratch, Heapify, Heap Sort, container/heap',
      summary: 'A complete binary tree stored in a slice.',
      concept: [
        'A binary min-heap is a complete binary tree where each parent ≤ its children. Stored in a slice: children of i are 2i+1 and 2i+2, parent is (i−1)/2.',
        'Push: append then sift up — O(log n). Pop min: move last to root then sift down — O(log n). Peek: O(1).',
        'Heapify (build a heap from n items) by sifting down from the last parent to the root is O(n), not O(n log n). Heap sort: heapify then repeatedly swap root to the end — O(n log n), in place, not stable.',
        'Go’s container/heap works with any type implementing heap.Interface (Len, Less, Swap, Push, Pop). Note Push/Pop on your type are called BY the heap package — you call heap.Push(h, x).',
      ],
      why: 'Whenever you repeatedly need the smallest/largest of a changing set, a heap gives O(log n) updates.',
      whenToUse: ['Priority queues, schedulers, Dijkstra', 'Top-K over a stream', 'Merging sorted sources'],
      whenNotToUse: ['Searching for arbitrary elements (O(n)).', 'Need of full sorted order repeatedly — sort once.'],
      syntax: `type IntHeap []int
func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
	old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x
}
h := &IntHeap{5, 2, 8}
heap.Init(h)
heap.Push(h, 1)
min := heap.Pop(h).(int) // 1`,
      example: {
        code: `func heapSort(a []int) {
	n := len(a)
	down := func(i, n int) {
		for {
			l, big := 2*i+1, i
			if l < n && a[l] > a[big] { big = l }
			if r := l + 1; r < n && a[r] > a[big] { big = r }
			if big == i { return }
			a[i], a[big] = a[big], a[i]
			i = big
		}
	}
	for i := n/2 - 1; i >= 0; i-- { down(i, n) } // heapify (max-heap)
	for end := n - 1; end > 0; end-- {
		a[0], a[end] = a[end], a[0]
		down(0, end)
	}
}`,
        notes: ['Build a MAX-heap so the largest goes to the end each round → ascending order.', 'Leaves (index ≥ n/2) are already heaps; start at n/2 − 1.'],
      },
      mistakes: ['Calling h.Push directly instead of heap.Push (no sift-up).', 'Less reversed for a max-heap and forgetting it elsewhere.', 'Assuming the heap slice is sorted.'],
      problems: [
        {
          id: 'm24-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Heapify complexity',
          prompt: 'Why is building a heap bottom-up O(n) while inserting n items one by one is O(n log n)?',
          check: {
            options: [
              'Most nodes are near the bottom and sift down only a few levels; the sum Σ nodes·height converges to O(n)',
              'Heapify skips half the elements entirely',
              'Heapify uses a hash map',
              'It is not — both are O(n log n)',
            ],
            answerIndex: 0,
          },
          hints: ['Half the nodes are leaves (cost 0), a quarter sift at most 1 level…'],
          solution: 'Σ (n / 2^(h+1)) · h over heights h is ≤ n · Σ h/2^(h+1) = O(n).',
          explanation: 'Sift-down cost is proportional to a node’s height, and few nodes are tall. Sift-up insertion costs proportional to depth, and most nodes are deep.',
        },
        {
          id: 'm24-t1-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Hospital triage queue',
          story: 'Patients arrive with a severity (higher = more urgent); ties go to whoever arrived first.',
          prompt: 'Implement a priority queue with container/heap: `Admit(name string, severity int)`, `Next() (string, bool)`. Use an arrival counter for stable tie-breaking.',
          hints: ['Item{name, severity, seq}. Less: higher severity first, then lower seq.'],
          solution: `type patient struct {
	name     string
	severity int
	seq      int
}

type triageHeap []patient

func (h triageHeap) Len() int { return len(h) }
func (h triageHeap) Less(i, j int) bool {
	if h[i].severity != h[j].severity {
		return h[i].severity > h[j].severity
	}
	return h[i].seq < h[j].seq
}
func (h triageHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }
func (h *triageHeap) Push(x any)   { *h = append(*h, x.(patient)) }
func (h *triageHeap) Pop() any {
	old := *h
	p := old[len(old)-1]
	*h = old[:len(old)-1]
	return p
}

type Triage struct {
	h   triageHeap
	seq int
}

func (t *Triage) Admit(name string, severity int) {
	t.seq++
	heap.Push(&t.h, patient{name, severity, t.seq})
}

func (t *Triage) Next() (string, bool) {
	if t.h.Len() == 0 {
		return "", false
	}
	return heap.Pop(&t.h).(patient).name, true
}`,
          explanation: 'Heaps are not stable; the sequence number makes ordering deterministic for equal severities.',
          complexity: { time: 'Admit/Next O(log n)', space: 'O(n)' },
          variation: 'Severity can change while waiting: store indexes in items and use heap.Fix.',
        },
        {
          id: 'm24-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Min-heap from scratch',
          prompt: 'Implement `MinHeap` over ints with Push, Pop, Peek and a `NewMinHeap(a []int)` that heapifies in O(n). No container/heap.',
          hints: ['siftUp(i) and siftDown(i, n) helpers.', 'Heapify: for i := n/2−1 down to 0, siftDown(i).'],
          solution: `type MinHeap struct{ a []int }

func NewMinHeap(a []int) *MinHeap {
	h := &MinHeap{a: slices.Clone(a)}
	for i := len(h.a)/2 - 1; i >= 0; i-- {
		h.down(i)
	}
	return h
}

func (h *MinHeap) up(i int) {
	for i > 0 {
		p := (i - 1) / 2
		if h.a[p] <= h.a[i] {
			return
		}
		h.a[p], h.a[i] = h.a[i], h.a[p]
		i = p
	}
}

func (h *MinHeap) down(i int) {
	n := len(h.a)
	for {
		l, m := 2*i+1, i
		if l < n && h.a[l] < h.a[m] {
			m = l
		}
		if r := l + 1; r < n && h.a[r] < h.a[m] {
			m = r
		}
		if m == i {
			return
		}
		h.a[i], h.a[m] = h.a[m], h.a[i]
		i = m
	}
}

func (h *MinHeap) Push(v int) { h.a = append(h.a, v); h.up(len(h.a) - 1) }

func (h *MinHeap) Peek() (int, bool) {
	if len(h.a) == 0 {
		return 0, false
	}
	return h.a[0], true
}

func (h *MinHeap) Pop() (int, bool) {
	if len(h.a) == 0 {
		return 0, false
	}
	top := h.a[0]
	last := len(h.a) - 1
	h.a[0] = h.a[last]
	h.a = h.a[:last]
	h.down(0)
	return top, true
}`,
          explanation: 'Cloning the input avoids mutating the caller’s slice.',
          complexity: { time: 'Build O(n); Push/Pop O(log n); Peek O(1)', space: 'O(n)' },
        },
      ],
    },
    {
      id: 'm24-t2',
      title: 'Top-K, Merge K, Median of a Stream, Scheduling',
      summary: 'The heap patterns that show up everywhere.',
      concept: [
        'Top-K largest: keep a MIN-heap of size K; push each item and pop when size > K. The heap root is the K-th largest. O(n log K) and O(K) memory — works on streams.',
        'Median of a stream: a max-heap for the lower half and a min-heap for the upper half, kept balanced in size (differ by ≤ 1).',
        'Merge K sorted arrays/lists: heap of the current head of each source.',
        'Scheduling: heap ordered by next-available time or priority; meeting rooms = min-heap of end times.',
      ],
      why: 'Bounded-memory selection and ordering over streams is a staple of backend analytics.',
      whenToUse: ['K ≪ n top-K', 'Online median', 'Event simulation ordered by time'],
      whenNotToUse: ['Static top-K where quickselect (average O(n)) is enough.'],
      syntax: `// two heaps for median
lo := maxHeap // lower half
hi := minHeap // upper half
// invariant: len(lo) == len(hi) or len(lo) == len(hi)+1`,
      example: {
        code: `stream: 5, 15, 1, 3
after 5:  lo=[5]       hi=[]      median 5
after 15: lo=[5]       hi=[15]    median 10
after 1:  lo=[5 1]     hi=[15]    median 5
after 3:  lo=[3 1]     hi=[5 15]  median 4`,
        notes: ['Push to lo, move lo’s max to hi, then rebalance if hi got bigger.'],
      },
      mistakes: ['Using a max-heap of all n items for top-K (O(n) memory).', 'Integer division when averaging two middles.'],
      problems: [
        {
          id: 'm24-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'K most expensive orders from a stream',
          story: 'An e-commerce event stream never ends; finance wants the 100 largest orders so far, in O(K) memory.',
          prompt: 'Write `type TopK struct` with `Add(amount int)` and `Items() []int` (descending). Use a min-heap of size K (your MinHeap or container/heap).',
          hints: ['If heap size < K push; else if amount > root, replace root and sift down.'],
          solution: `type TopK struct {
	k int
	h *MinHeap
}

func NewTopK(k int) *TopK { return &TopK{k: k, h: NewMinHeap(nil)} }

func (t *TopK) Add(amount int) {
	if len(t.h.a) < t.k {
		t.h.Push(amount)
		return
	}
	if amount > t.h.a[0] {
		t.h.a[0] = amount
		t.h.down(0)
	}
}

func (t *TopK) Items() []int {
	out := slices.Clone(t.h.a)
	slices.SortFunc(out, func(a, b int) int { return b - a })
	return out
}`,
          explanation: 'The root is the smallest of the current top-K; anything not larger cannot enter. Replace-root + sift-down is cheaper than pop + push.',
          complexity: { time: 'O(log K) per Add; Items O(K log K)', space: 'O(K)' },
        },
        {
          id: 'm24-t2-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Median latency of a live stream',
          story: 'An APM agent reports the running median request latency.',
          prompt: 'Implement `MedianFinder` with `Add(x int)` O(log n) and `Median() float64` O(1).',
          hints: ['Max-heap via negated values in a min-heap works.', 'Push into lo, move lo-top to hi, rebalance if len(hi) > len(lo).'],
          solution: `type MedianFinder struct {
	lo *MinHeap // stores negated values → acts as a max-heap
	hi *MinHeap
}

func NewMedianFinder() *MedianFinder {
	return &MedianFinder{lo: NewMinHeap(nil), hi: NewMinHeap(nil)}
}

func (m *MedianFinder) Add(x int) {
	m.lo.Push(-x)
	top, _ := m.lo.Pop()
	m.hi.Push(-top)
	if len(m.hi.a) > len(m.lo.a) {
		v, _ := m.hi.Pop()
		m.lo.Push(-v)
	}
}

func (m *MedianFinder) Median() float64 {
	if len(m.lo.a) == 0 {
		return 0
	}
	if len(m.lo.a) > len(m.hi.a) {
		return float64(-m.lo.a[0])
	}
	return (float64(-m.lo.a[0]) + float64(m.hi.a[0])) / 2
}`,
          explanation: 'Routing every value through lo then hi guarantees all of lo ≤ all of hi; rebalancing keeps sizes within one.',
          complexity: { time: 'Add O(log n), Median O(1)', space: 'O(n)' },
          variation: 'Sliding-window median (remove old values) — use two heaps with lazy deletion or an ordered multiset.',
        },
        {
          id: 'm24-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Meeting rooms needed',
          story: 'A booking system must know the minimum number of conference rooms for a day’s meetings.',
          prompt: 'Given intervals [start, end), write `MinRooms(meetings [][2]int) int` in O(n log n).',
          hints: ['Sort by start; min-heap of end times of rooms in use.', 'If the earliest-ending room is free (end ≤ start), reuse it.'],
          solution: `func MinRooms(meetings [][2]int) int {
	slices.SortFunc(meetings, func(a, b [2]int) int { return a[0] - b[0] })
	ends := NewMinHeap(nil)
	for _, m := range meetings {
		if e, ok := ends.Peek(); ok && e <= m[0] {
			ends.Pop()
		}
		ends.Push(m[1])
	}
	return len(ends.a)
}`,
          explanation: 'The heap size is the number of rooms simultaneously in use; it only grows when no room has freed up.',
          complexity: { time: 'O(n log n)', space: 'O(n)' },
          variation: 'Sweep-line alternative: sort starts and ends separately and walk two pointers. Prove both give the max overlap.',
        },
      ],
    },
  ],
}
