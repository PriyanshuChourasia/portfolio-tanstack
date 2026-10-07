import type { Module } from '../types'

export const MODULE_19: Module = {
  id: 'm19',
  number: 19,
  track: 'dsa',
  title: 'Linked Lists',
  shortTitle: 'Linked Lists',
  tagline: 'Singly, doubly and circular lists; reversal, cycles, merging, cloning and the LRU cache.',
  topics: [
    {
      id: 'm19-t1',
      title: 'Singly Linked Lists',
      summary: 'Nodes and pointers, dummy heads, reversal.',
      concept: [
        'A singly linked list is a chain of nodes `type Node struct { Val int; Next *Node }`. Insert/delete after a known node is O(1); finding the k-th node is O(k). No random access, poor cache locality.',
        'A dummy (sentinel) head node removes special cases when the real head might change (deletions, merges).',
        'Reversal is the core skill: walk with prev/curr pointers, flipping Next one node at a time.',
      ],
      why: 'Linked structures underlie LRU caches, free lists, adjacency lists, and teach pointer manipulation that interviews love.',
      whenToUse: ['O(1) splicing when you already hold the node', 'Unknown size with frequent head inserts', 'Building blocks for LRU/LFU'],
      whenNotToUse: ['General-purpose lists in Go — slices are faster for almost everything.', 'Random access or binary search.'],
      syntax: `type ListNode struct {
	Val  int
	Next *ListNode
}

func reverse(head *ListNode) *ListNode {
	var prev *ListNode
	for curr := head; curr != nil; {
		next := curr.Next
		curr.Next = prev
		prev, curr = curr, next
	}
	return prev
}`,
      example: {
        code: `// Remove all nodes with value v using a dummy head.
func removeAll(head *ListNode, v int) *ListNode {
	dummy := &ListNode{Next: head}
	for p := dummy; p.Next != nil; {
		if p.Next.Val == v {
			p.Next = p.Next.Next
		} else {
			p = p.Next
		}
	}
	return dummy.Next
}`,
        notes: ['dummy.Next is the (possibly new) head.', 'Only advance p when you did NOT delete — otherwise consecutive matches are skipped.'],
      },
      mistakes: ['Losing the rest of the list by overwriting Next before saving it.', 'Nil dereference at the tail.', 'Forgetting to return the new head.'],
      problems: [
        {
          id: 'm19-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'code',
          title: 'Reverse the delivery route',
          story: 'A courier’s stops are a linked list; the return trip visits them in reverse.',
          prompt: 'Write `Reverse(head *ListNode) *ListNode` iteratively, then recursively. Compare their space.',
          hints: ['Iterative: prev, curr, next.', 'Recursive: reverse the rest, then head.Next.Next = head; head.Next = nil.'],
          solution: `func Reverse(head *ListNode) *ListNode {
	var prev *ListNode
	for head != nil {
		head.Next, prev, head = prev, head, head.Next
	}
	return prev
}

func ReverseRec(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	newHead := ReverseRec(head.Next)
	head.Next.Next = head
	head.Next = nil
	return newHead
}`,
          explanation: 'Go’s parallel assignment evaluates all right-hand sides first, so the one-liner is safe. Recursion uses O(n) stack.',
          complexity: { time: 'O(n)', space: 'Iterative O(1); recursive O(n) stack' },
          variation: 'Reverse only positions m..n (1-indexed) in one pass.',
        },
        {
          id: 'm19-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Middle stop and k-th from end',
          prompt: 'Write `Middle(head) *ListNode` (second middle for even length) and `KthFromEnd(head, k) *ListNode` — each in one pass with O(1) space.',
          hints: ['Slow moves 1, fast moves 2.', 'For k-th from end, advance a lead pointer k steps first.'],
          solution: `func Middle(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	return slow
}

func KthFromEnd(head *ListNode, k int) *ListNode {
	lead := head
	for i := 0; i < k; i++ {
		if lead == nil {
			return nil
		}
		lead = lead.Next
	}
	trail := head
	for lead != nil {
		lead, trail = lead.Next, trail.Next
	}
	return trail
}`,
          explanation: 'Keeping a fixed gap of k between two pointers means when lead hits nil, trail is k from the end.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
        {
          id: 'm19-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Palindrome playlist',
          prompt: 'Write `IsPalindrome(head *ListNode) bool` in O(n) time and O(1) space, restoring the list afterwards.',
          hints: ['Find the middle, reverse the second half, compare, reverse it back.'],
          solution: `func IsPalindrome(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return true
	}
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	second := Reverse(slow.Next)
	ok := true
	for p, q := head, second; q != nil; p, q = p.Next, q.Next {
		if p.Val != q.Val {
			ok = false
			break
		}
	}
	slow.Next = Reverse(second) // restore
	return ok
}`,
          explanation: 'slow ends at the end of the first half; restoring keeps the function side-effect free for callers.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
      ],
    },
    {
      id: 'm19-t2',
      title: 'Doubly and Circular Linked Lists, Cycles',
      summary: 'Prev pointers, sentinel rings, Floyd’s cycle detection.',
      concept: [
        'Doubly linked nodes have Prev and Next, enabling O(1) removal of a node you hold. A circular sentinel (root.Next = first, root.Prev = last, empty list = root pointing to itself) eliminates nil checks — this is how container/list works.',
        'Circular singly lists model round-robin scheduling and ring buffers of nodes.',
        'Floyd’s tortoise and hare detects a cycle in O(1) space: if fast meets slow there is a cycle; then moving one pointer to head and stepping both by 1 meets at the cycle start.',
      ],
      why: 'LRU caches, schedulers and undo histories need O(1) removal from the middle; cycle detection appears in linked data, graphs and even number sequences.',
      whenToUse: ['container/list for O(1) moves and removals', 'Circular lists for round-robin'],
      whenNotToUse: ['When a slice + index would do — doubly lists cost 2 pointers per node and lots of allocations.'],
      syntax: `type DNode struct {
	Key, Val   int
	Prev, Next *DNode
}
// unlink
n.Prev.Next = n.Next
n.Next.Prev = n.Prev`,
      example: {
        code: `func detectCycleStart(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
		if slow == fast {
			for p := head; ; p, slow = p.Next, slow.Next {
				if p == slow {
					return p
				}
			}
		}
	}
	return nil
}`,
        notes: ['If head→start is a and meeting point is b into the cycle of length c, then a ≡ c − b (mod c).', 'So walking a steps from head and from the meeting point lands both on the start.'],
      },
      mistakes: ['Forgetting to update both Prev and Next.', 'Infinite loops when traversing circular lists without a stop condition.', 'Comparing node values instead of node identity in cycle detection.'],
      problems: [
        {
          id: 'm19-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Does the route loop?',
          story: 'A GPS route is stored as linked waypoints; a bug sometimes links a waypoint back to an earlier one.',
          prompt: 'Write `HasCycle(head *ListNode) bool` in O(1) space.',
          hints: ['Two pointers at different speeds.'],
          solution: `func HasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}`,
          explanation: 'In a cycle, fast gains one node per step on slow, so they must meet within one lap.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
        {
          id: 'm19-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Browser history (doubly linked)',
          story: 'Implement back/forward navigation for a browser tab.',
          prompt: 'Implement `BrowserHistory` with `Visit(url)` (drops forward history), `Back(steps) string`, `Forward(steps) string` using a doubly linked list.',
          hints: ['Keep a pointer to the current node.', 'Visit: create node after current and cut its Next.'],
          solution: `type page struct {
	url        string
	prev, next *page
}

type BrowserHistory struct{ cur *page }

func NewBrowserHistory(home string) *BrowserHistory {
	return &BrowserHistory{cur: &page{url: home}}
}

func (b *BrowserHistory) Visit(url string) {
	p := &page{url: url, prev: b.cur}
	b.cur.next = p // forward history becomes garbage
	b.cur = p
}

func (b *BrowserHistory) Back(steps int) string {
	for ; steps > 0 && b.cur.prev != nil; steps-- {
		b.cur = b.cur.prev
	}
	return b.cur.url
}

func (b *BrowserHistory) Forward(steps int) string {
	for ; steps > 0 && b.cur.next != nil; steps-- {
		b.cur = b.cur.next
	}
	return b.cur.url
}`,
          explanation: 'Overwriting cur.next detaches the forward chain; the GC reclaims it.',
          complexity: { time: 'Visit O(1); Back/Forward O(steps)', space: 'O(pages)' },
          variation: 'Make Back/Forward O(1) using a slice and an index instead — why is that better in Go?',
        },
        {
          id: 'm19-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Where do two conveyor lines merge?',
          prompt: 'Two singly linked lists may merge into a common tail. Return the first shared node in O(n + m) time, O(1) space.',
          hints: ['When a pointer reaches the end, redirect it to the OTHER list’s head.', 'Both travel a + b + c total and meet at the junction (or both nil).'],
          solution: `func Intersection(a, b *ListNode) *ListNode {
	p, q := a, b
	for p != q {
		if p == nil {
			p = b
		} else {
			p = p.Next
		}
		if q == nil {
			q = a
		} else {
			q = q.Next
		}
	}
	return p
}`,
          explanation: 'Switching heads equalises path lengths; if there is no intersection both become nil simultaneously and the loop ends.',
          complexity: { time: 'O(n + m)', space: 'O(1)' },
        },
      ],
    },
    {
      id: 'm19-t3',
      title: 'Advanced: Merge, K-Group Reversal, Random Pointers, LRU',
      summary: 'The classic hard list problems.',
      concept: [
        'Merging sorted lists uses a dummy tail and splices nodes — no allocation. Merging K lists uses a min-heap of list heads: O(N log K).',
        'Reversing in groups of k: count k nodes ahead, reverse that segment, reconnect, repeat.',
        'Copying a list with random pointers: map old→new (O(n) space) or interleave copies inside the original list (O(1) extra).',
        'LRU cache = hash map (key → node) + doubly linked list ordered by recency: O(1) get/put.',
      ],
      why: 'These combine every pointer skill and appear constantly in interviews; LRU is also real production code.',
      whenToUse: ['k-way merge for external sorting and log merging', 'LRU for bounded caches'],
      whenNotToUse: ['Hand-rolled lists when container/list or a library LRU suffices in production.'],
      syntax: `func mergeTwo(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	t := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val { t.Next, a = a, a.Next } else { t.Next, b = b, b.Next }
		t = t.Next
	}
	if a != nil { t.Next = a } else { t.Next = b }
	return dummy.Next
}`,
      example: {
        code: `// LRU skeleton with container/list
type entry struct{ key, val int }
type LRU struct {
	cap   int
	ll    *list.List
	items map[int]*list.Element
}`,
        notes: ['Front of the list = most recently used.', 'On get: MoveToFront. On put over capacity: remove Back() and delete its key.'],
      },
      mistakes: ['Using < instead of <= and losing stability in merge.', 'Forgetting to delete the evicted key from the map.', 'Reconnecting group boundaries incorrectly in k-group reversal.'],
      problems: [
        {
          id: 'm19-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Merge K sorted shipment feeds',
          story: 'Ten warehouses each stream shipments sorted by timestamp; build one global sorted list.',
          prompt: 'Write `MergeK(lists []*ListNode) *ListNode` with container/heap in O(N log K).',
          hints: ['Heap of non-nil heads ordered by Val.', 'Pop min, append to tail, push its Next if non-nil.'],
          solution: `type nodeHeap []*ListNode

func (h nodeHeap) Len() int           { return len(h) }
func (h nodeHeap) Less(i, j int) bool { return h[i].Val < h[j].Val }
func (h nodeHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *nodeHeap) Push(x any)        { *h = append(*h, x.(*ListNode)) }
func (h *nodeHeap) Pop() any {
	old := *h
	n := old[len(old)-1]
	*h = old[:len(old)-1]
	return n
}

func MergeK(lists []*ListNode) *ListNode {
	h := &nodeHeap{}
	for _, l := range lists {
		if l != nil {
			*h = append(*h, l)
		}
	}
	heap.Init(h)
	dummy := &ListNode{}
	tail := dummy
	for h.Len() > 0 {
		n := heap.Pop(h).(*ListNode)
		tail.Next, tail = n, n
		if n.Next != nil {
			heap.Push(h, n.Next)
		}
	}
	return dummy.Next
}`,
          explanation: 'The heap always holds at most K candidates — the smallest unmerged element is among them.',
          complexity: { time: 'O(N log K)', space: 'O(K)' },
          variation: 'Divide and conquer: merge pairs of lists recursively — same O(N log K) without a heap.',
        },
        {
          id: 'm19-t3-p2',
          tier: 'practical',
          level: 4,
          kind: 'code',
          title: 'Reverse in groups of k',
          prompt: 'Write `ReverseKGroup(head *ListNode, k int) *ListNode`; a final group shorter than k stays as is. O(1) extra space.',
          hints: ['Use a dummy; groupPrev points before the group.', 'Find the k-th node; if missing, stop. Reverse between, then reconnect.'],
          solution: `func ReverseKGroup(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy
	for {
		kth := groupPrev
		for i := 0; i < k && kth != nil; i++ {
			kth = kth.Next
		}
		if kth == nil {
			return dummy.Next
		}
		groupNext := kth.Next
		prev, curr := groupNext, groupPrev.Next
		for curr != groupNext {
			curr.Next, prev, curr = prev, curr, curr.Next
		}
		first := groupPrev.Next // becomes the group's tail
		groupPrev.Next = kth
		groupPrev = first
	}
}`,
          explanation: 'Initialising prev to groupNext makes the reversed group’s tail point straight to the rest of the list.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
        {
          id: 'm19-t3-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'LRU cache',
          story: 'A product-details service caches the 10,000 most recently viewed products.',
          prompt: 'Implement `LRU` with `Get(key int) (int, bool)` and `Put(key, val int)` in O(1), evicting the least recently used. Use your own doubly linked list with sentinel nodes (no container/list).',
          hints: ['Sentinels head and tail; most recent right after head.', 'Helpers: remove(n), pushFront(n).'],
          solution: `type lruNode struct {
	key, val   int
	prev, next *lruNode
}

type LRU struct {
	cap        int
	items      map[int]*lruNode
	head, tail *lruNode
}

func NewLRU(capacity int) *LRU {
	h, t := &lruNode{}, &lruNode{}
	h.next, t.prev = t, h
	return &LRU{cap: capacity, items: make(map[int]*lruNode, capacity), head: h, tail: t}
}

func (c *LRU) remove(n *lruNode) { n.prev.next, n.next.prev = n.next, n.prev }

func (c *LRU) pushFront(n *lruNode) {
	n.prev, n.next = c.head, c.head.next
	c.head.next.prev = n
	c.head.next = n
}

func (c *LRU) Get(key int) (int, bool) {
	n, ok := c.items[key]
	if !ok {
		return 0, false
	}
	c.remove(n)
	c.pushFront(n)
	return n.val, true
}

func (c *LRU) Put(key, val int) {
	if n, ok := c.items[key]; ok {
		n.val = val
		c.remove(n)
		c.pushFront(n)
		return
	}
	if len(c.items) == c.cap {
		lru := c.tail.prev
		c.remove(lru)
		delete(c.items, lru.key)
	}
	n := &lruNode{key: key, val: val}
	c.items[key] = n
	c.pushFront(n)
}`,
          explanation: 'The map finds the node in O(1); the list gives O(1) reordering and eviction. Storing the key in the node lets eviction delete from the map.',
          complexity: { time: 'O(1) Get/Put', space: 'O(capacity)' },
          variation: 'Make it concurrency-safe and generic (`LRU[K comparable, V any]`). Then add TTL per entry.',
          followUps: ['Why is a mutex needed even for Get?', 'How would you shard it for high contention?', 'LFU instead of LRU — what changes?'],
        },
        {
          id: 'm19-t3-p4',
          tier: 'advanced',
          level: 5,
          kind: 'code',
          title: 'Clone a list with random pointers',
          prompt: '`type RNode struct { Val int; Next, Random *RNode }`. Deep-copy the list in O(n) time and O(1) extra space (besides the copy).',
          hints: ['Interleave: A → A\' → B → B\' …', 'Set A\'.Random = A.Random.Next, then separate the lists.'],
          solution: `func CopyRandomList(head *RNode) *RNode {
	for p := head; p != nil; p = p.Next.Next {
		p.Next = &RNode{Val: p.Val, Next: p.Next}
	}
	for p := head; p != nil; p = p.Next.Next {
		if p.Random != nil {
			p.Next.Random = p.Random.Next
		}
	}
	dummy := &RNode{}
	t := dummy
	for p := head; p != nil; p = p.Next {
		c := p.Next
		p.Next = c.Next
		t.Next, t = c, c
	}
	return dummy.Next
}`,
          explanation: 'Each copy sits right after its original, so original.Random.Next is the copy of the random target — no map needed.',
          complexity: { time: 'O(n)', space: 'O(1) extra' },
        },
      ],
    },
  ],
}

export const MODULE_20: Module = {
  id: 'm20',
  number: 20,
  track: 'dsa',
  title: 'Stack',
  shortTitle: 'Stack',
  tagline: 'LIFO with slices, linked lists; balanced brackets, min/max stack, monotonic stacks and histograms.',
  topics: [
    {
      id: 'm20-t1',
      title: 'Stack Implementations, Balanced Parentheses, Min/Max Stack',
      summary: 'Push/pop at one end; augmenting a stack with extra state.',
      concept: [
        'A stack is LIFO: push and pop at the top in O(1). In Go a slice is the natural stack: `s = append(s, v)`, `v := s[len(s)-1]; s = s[:len(s)-1]`. A linked-list stack pushes/pops at the head.',
        'Stacks model nesting and "most recent unmatched" problems: brackets, undo, function calls, DFS.',
        'Min stack: store (value, minSoFar) pairs so GetMin is O(1). Max stack is symmetric.',
      ],
      why: 'Whenever the most recent item determines what happens next, a stack is the structure.',
      whenToUse: ['Matching/nesting', 'Undo history', 'Iterative DFS', 'Expression evaluation'],
      whenNotToUse: ['FIFO processing (use a queue).'],
      syntax: `type Stack[T any] struct{ items []T }
func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(s.items) == 0 { return zero, false }
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v, true
}`,
      example: {
        code: `func balanced(s string) bool {
	pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}
	var st []rune
	for _, c := range s {
		switch c {
		case '(', '[', '{':
			st = append(st, c)
		case ')', ']', '}':
			if len(st) == 0 || st[len(st)-1] != pairs[c] {
				return false
			}
			st = st[:len(st)-1]
		}
	}
	return len(st) == 0
}`,
        notes: ['Openers push; closers must match the most recent opener.', 'Leftover openers at the end mean unbalanced.'],
      },
      mistakes: ['Popping an empty stack (index out of range).', 'Forgetting the final emptiness check.', 'Not zeroing popped pointer elements in long-lived stacks (memory retention).'],
      problems: [
        {
          id: 'm20-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Stack trace',
          prompt: 'Push 1, push 2, pop, push 3, push 4, pop, pop. What remains (bottom→top) and which values were popped (in order)?',
          check: { options: ['[1]; popped 2, 4, 3', '[1 3]; popped 2, 4', '[]; popped 2, 4, 3, 1', '[1]; popped 2, 3, 4'], answerIndex: 0 },
          hints: ['Simulate step by step.'],
          solution: 'Remaining `[1]`; popped 2, 4, 3.',
          explanation: '[1]→[1 2]→pop 2→[1 3]→[1 3 4]→pop 4→pop 3→[1].',
        },
        {
          id: 'm20-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Min stack for price tracking',
          story: 'A trading UI keeps a stack of price snapshots with undo, and must show the lowest price currently in the stack instantly.',
          prompt: 'Implement `MinStack` with Push, Pop, Top and GetMin all O(1).',
          hints: ['Store pairs {val, min}.'],
          solution: `type MinStack struct{ items [][2]int }

func (s *MinStack) Push(v int) {
	m := v
	if n := len(s.items); n > 0 {
		m = min(m, s.items[n-1][1])
	}
	s.items = append(s.items, [2]int{v, m})
}
func (s *MinStack) Pop()        { s.items = s.items[:len(s.items)-1] }
func (s *MinStack) Top() int    { return s.items[len(s.items)-1][0] }
func (s *MinStack) GetMin() int { return s.items[len(s.items)-1][1] }`,
          explanation: 'Each entry remembers the minimum of everything below it, which never changes while the entry is on the stack.',
          complexity: { time: 'O(1) all ops', space: 'O(n)' },
          variation: 'Max stack that also supports PopMax() in O(log n) (needs a heap or ordered map + lazy deletion).',
        },
        {
          id: 'm20-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Evaluate a pricing rule (RPN)',
          story: 'A promotions engine stores rules in Reverse Polish Notation: ["base","2","*","discount","-"].',
          prompt: 'Write `EvalRPN(tokens []string, vars map[string]int) (int, error)` supporting + - * / and variables. Return errors for unknown tokens, division by zero and malformed expressions.',
          hints: ['Numbers/vars push; operators pop two (b first, then a) and push a op b.', 'At the end exactly one value must remain.'],
          solution: `func EvalRPN(tokens []string, vars map[string]int) (int, error) {
	var st []int
	pop := func() (int, error) {
		if len(st) == 0 {
			return 0, errors.New("malformed expression")
		}
		v := st[len(st)-1]
		st = st[:len(st)-1]
		return v, nil
	}
	for _, t := range tokens {
		switch t {
		case "+", "-", "*", "/":
			b, err := pop()
			if err != nil {
				return 0, err
			}
			a, err := pop()
			if err != nil {
				return 0, err
			}
			switch t {
			case "+":
				st = append(st, a+b)
			case "-":
				st = append(st, a-b)
			case "*":
				st = append(st, a*b)
			case "/":
				if b == 0 {
					return 0, errors.New("division by zero")
				}
				st = append(st, a/b)
			}
		default:
			if n, err := strconv.Atoi(t); err == nil {
				st = append(st, n)
			} else if v, ok := vars[t]; ok {
				st = append(st, v)
			} else {
				return 0, fmt.Errorf("unknown token %q", t)
			}
		}
	}
	if len(st) != 1 {
		return 0, errors.New("malformed expression")
	}
	return st[0], nil
}`,
          explanation: 'Operand order matters for - and /: the second pop is the left operand.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Convert infix "base * 2 - discount" to RPN with the shunting-yard algorithm.',
        },
      ],
    },
    {
      id: 'm20-t2',
      title: 'Monotonic Stack: Next/Previous Greater, Histograms',
      summary: 'Keep the stack sorted; each element is pushed and popped once.',
      concept: [
        'A monotonic stack keeps elements (usually indexes) in increasing or decreasing order of value. When a new element breaks the order, pop until it fits — each popped element has just found its "next greater/smaller".',
        'Every index is pushed and popped at most once → O(n) total, even though there is a nested loop.',
        'Uses: next greater element, stock span, daily temperatures, largest rectangle in histogram, trapping rain water, sum of subarray minimums.',
      ],
      why: 'Turns "for each element, scan right until…" O(n²) problems into O(n).',
      whenToUse: ['"Next/previous greater/smaller" questions', 'Span/width bounded by smaller elements'],
      whenNotToUse: ['Sliding-window max with a moving left edge — use a monotonic deque.'],
      syntax: `next := make([]int, n)
for i := range next { next[i] = -1 }
var st []int // indexes, values decreasing
for i, v := range a {
	for len(st) > 0 && a[st[len(st)-1]] < v {
		next[st[len(st)-1]] = v
		st = st[:len(st)-1]
	}
	st = append(st, i)
}`,
      example: {
        code: `a    = [2 1 2 4 3]
next = [4 2 4 -1 -1]
// i=3 (4): pops 2(i=2), 1(i=1), 2(i=0) → all get 4`,
        notes: ['Indexes stay on the stack until something bigger arrives.', 'What remains at the end has no greater element (−1).'],
      },
      mistakes: ['Storing values instead of indexes when you need distances.', 'Using < vs <= incorrectly with duplicates.', 'Forgetting to flush the stack at the end (histogram needs a sentinel 0).'],
      problems: [
        {
          id: 'm20-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Days until a warmer day',
          story: 'A weather app shows "warmer in N days" under each forecast day.',
          prompt: 'Write `DaysUntilWarmer(temps []int) []int` (0 if never) in O(n).',
          hints: ['Monotonic decreasing stack of indexes.', 'When popping index j at day i, answer[j] = i − j.'],
          solution: `func DaysUntilWarmer(temps []int) []int {
	ans := make([]int, len(temps))
	var st []int
	for i, t := range temps {
		for len(st) > 0 && temps[st[len(st)-1]] < t {
			j := st[len(st)-1]
			st = st[:len(st)-1]
			ans[j] = i - j
		}
		st = append(st, i)
	}
	return ans
}`,
          explanation: 'Each day waits on the stack until the first warmer day pops it.',
          complexity: { time: 'O(n) amortised', space: 'O(n)' },
        },
        {
          id: 'm20-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Stock span',
          story: 'For each trading day, the span is the number of consecutive days up to today with price ≤ today’s.',
          prompt: 'Implement `StockSpanner.Next(price int) int` in amortised O(1).',
          hints: ['Stack of (price, span) with decreasing prices.', 'Pop all ≤ price, summing their spans.'],
          solution: `type StockSpanner struct{ st [][2]int }

func (s *StockSpanner) Next(price int) int {
	span := 1
	for len(s.st) > 0 && s.st[len(s.st)-1][0] <= price {
		span += s.st[len(s.st)-1][1]
		s.st = s.st[:len(s.st)-1]
	}
	s.st = append(s.st, [2]int{price, span})
	return span
}`,
          explanation: 'A popped day is covered by today’s span forever, so it never needs to be seen again.',
          complexity: { time: 'O(1) amortised per call', space: 'O(n)' },
        },
        {
          id: 'm20-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Largest billboard in a skyline (histogram)',
          story: 'Building heights along a street form a histogram; find the largest rectangular billboard that fits.',
          prompt: 'Write `LargestRectangle(h []int) int` in O(n).',
          hints: ['Increasing stack of indexes; append a 0 sentinel to flush.', 'When popping height H at index j, its width spans from the new stack top + 1 to i − 1.'],
          solution: `func LargestRectangle(h []int) int {
	best := 0
	var st []int
	for i := 0; i <= len(h); i++ {
		cur := 0
		if i < len(h) {
			cur = h[i]
		}
		for len(st) > 0 && h[st[len(st)-1]] >= cur {
			height := h[st[len(st)-1]]
			st = st[:len(st)-1]
			left := -1
			if len(st) > 0 {
				left = st[len(st)-1]
			}
			best = max(best, height*(i-left-1))
		}
		st = append(st, i)
	}
	return best
}`,
          explanation: 'When a bar is popped, the current i is the first smaller bar to its right and the new top is the first smaller to its left — so it is the limiting height of a rectangle of width i−left−1.',
          complexity: { time: 'O(n)', space: 'O(n)' },
          variation: 'Maximal rectangle of 1s in a binary matrix: run this per row on accumulated heights — O(R·C).',
        },
        {
          id: 'm20-t2-p4',
          tier: 'advanced',
          level: 5,
          kind: 'code',
          title: 'Trapping rain water on a terrain profile',
          prompt: 'Given elevation bars, compute trapped water. Give the monotonic-stack solution and the two-pointer O(1)-space solution.',
          hints: ['Water at i = min(maxLeft, maxRight) − h[i].', 'Two pointers: move the side with the smaller max, since it bounds the water.'],
          solution: `func Trap(h []int) int {
	l, r := 0, len(h)-1
	leftMax, rightMax, water := 0, 0, 0
	for l < r {
		if h[l] < h[r] {
			leftMax = max(leftMax, h[l])
			water += leftMax - h[l]
			l++
		} else {
			rightMax = max(rightMax, h[r])
			water += rightMax - h[r]
			r--
		}
	}
	return water
}`,
          explanation: 'If h[l] < h[r], the right side has a wall at least as tall as leftMax eventually, so water at l is determined by leftMax alone.',
          complexity: { time: 'O(n)', space: 'O(1)' },
        },
      ],
    },
  ],
}

export const MODULE_21: Module = {
  id: 'm21',
  number: 21,
  track: 'dsa',
  title: 'Queue',
  shortTitle: 'Queue',
  tagline: 'FIFO queues, circular buffers, deques, monotonic queues, BFS and scheduling.',
  topics: [
    {
      id: 'm21-t1',
      title: 'Queue, Circular Queue and Deque',
      summary: 'FIFO in Go without leaking memory.',
      concept: [
        'A queue is FIFO: enqueue at the back, dequeue from the front, both O(1). A naive Go slice queue (`q = q[1:]`) never reuses the front space and keeps the backing array alive.',
        'A circular buffer (ring) uses a fixed array with head index and size; positions wrap with modulo — no allocation after creation, ideal for bounded queues.',
        'A deque supports push/pop at both ends — implement as a ring buffer that grows.',
        'Channels are concurrent bounded FIFO queues; for single-goroutine code a ring buffer is cheaper.',
      ],
      why: 'Queues decouple producers from consumers and drive BFS, schedulers and rate limiters.',
      whenToUse: ['BFS', 'Task buffers', 'Bounded recent-history (ring)'],
      whenNotToUse: ['When priority matters — use a heap.'],
      syntax: `type Ring[T any] struct {
	buf        []T
	head, size int
}
func (r *Ring[T]) Push(v T) bool {
	if r.size == len(r.buf) { return false }
	r.buf[(r.head+r.size)%len(r.buf)] = v
	r.size++
	return true
}`,
      example: {
        code: `q := []int{}
q = append(q, 1, 2, 3)  // enqueue
front := q[0]
q = q[1:]                // dequeue — OK for short-lived BFS queues
_ = front`,
        notes: ['Fine for local BFS where the queue is discarded at the end.', 'For long-lived queues use a ring buffer or reset when empty.'],
      },
      mistakes: ['Long-lived `q = q[1:]` queues (memory never reclaimed, unbounded growth).', 'Off-by-one between full and empty in rings (track size explicitly).', 'Using a channel as a queue in single-threaded code.'],
      problems: [
        {
          id: 'm21-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'code',
          title: 'Circular buffer for recent GPS fixes',
          story: 'A vehicle keeps only its last N GPS fixes for smoothing.',
          prompt: 'Implement `Ring[T]` with `NewRing(n)`, `Push(v)` that OVERWRITES the oldest when full, `Items() []T` oldest→newest, and `Len()`.',
          hints: ['When full, write at head and advance head.', 'Items: for i in 0..size, buf[(head+i)%cap].'],
          solution: `type Ring[T any] struct {
	buf        []T
	head, size int
}

func NewRing[T any](n int) *Ring[T] { return &Ring[T]{buf: make([]T, n)} }

func (r *Ring[T]) Len() int { return r.size }

func (r *Ring[T]) Push(v T) {
	if r.size < len(r.buf) {
		r.buf[(r.head+r.size)%len(r.buf)] = v
		r.size++
		return
	}
	r.buf[r.head] = v
	r.head = (r.head + 1) % len(r.buf)
}

func (r *Ring[T]) Items() []T {
	out := make([]T, r.size)
	for i := range out {
		out[i] = r.buf[(r.head+i)%len(r.buf)]
	}
	return out
}`,
          explanation: 'head always points at the oldest element; when full, the oldest slot is overwritten and head advances.',
          complexity: { time: 'Push O(1), Items O(n)', space: 'O(n) fixed' },
        },
        {
          id: 'm21-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'First non-repeating character in a stream',
          story: 'A live chat moderator view shows the first character (or user) that has appeared exactly once so far.',
          prompt: 'Implement `Stream` with `Add(c byte)` and `FirstUnique() (byte, bool)` — amortised O(1).',
          hints: ['Counts array + queue of candidates.', 'Lazily pop from the front while the front’s count > 1.'],
          solution: `type Stream struct {
	cnt [256]int
	q   []byte
}

func (s *Stream) Add(c byte) {
	s.cnt[c]++
	if s.cnt[c] == 1 {
		s.q = append(s.q, c)
	}
}

func (s *Stream) FirstUnique() (byte, bool) {
	for len(s.q) > 0 && s.cnt[s.q[0]] > 1 {
		s.q = s.q[1:]
	}
	if len(s.q) == 0 {
		return 0, false
	}
	return s.q[0], true
}`,
          explanation: 'Each character enters the queue once and leaves once — lazy deletion keeps operations amortised O(1).',
          complexity: { time: 'Amortised O(1)', space: 'O(alphabet)' },
        },
        {
          id: 'm21-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Hit counter for the last 5 minutes',
          story: 'An API gateway shows requests in the last 300 seconds per endpoint.',
          prompt: 'Implement `HitCounter` with `Hit(ts int)` and `Count(ts int) int` (timestamps in seconds, non-decreasing). Make memory O(300) regardless of traffic.',
          hints: ['Two arrays of size 300: bucket timestamp and bucket count, indexed by ts % 300.', 'If the stored timestamp in a bucket differs, reset it.'],
          solution: `type HitCounter struct {
	times  [300]int
	counts [300]int
}

func (h *HitCounter) Hit(ts int) {
	i := ts % 300
	if h.times[i] != ts {
		h.times[i], h.counts[i] = ts, 0
	}
	h.counts[i]++
}

func (h *HitCounter) Count(ts int) int {
	total := 0
	for i := 0; i < 300; i++ {
		if ts-h.times[i] < 300 {
			total += h.counts[i]
		}
	}
	return total
}`,
          explanation: 'Circular buckets bound memory; stale buckets are ignored by timestamp. A queue of timestamps would be O(hits).',
          complexity: { time: 'Hit O(1), Count O(300)', space: 'O(300)' },
          variation: 'Make it concurrency-safe and support millisecond precision with a sliding-window approximation.',
        },
      ],
    },
    {
      id: 'm21-t2',
      title: 'Monotonic Queue, BFS and Scheduling',
      summary: 'Sliding window maximum, multi-source BFS, round-robin and cooldown scheduling.',
      concept: [
        'A monotonic deque keeps indexes whose values are decreasing; the front is the current window maximum. Pop the back while it is smaller than the new value; pop the front when it leaves the window. O(n) total.',
        'BFS explores level by level using a queue — shortest paths in unweighted graphs and grids. Multi-source BFS starts with all sources in the queue.',
        'Scheduling with cooldowns: greedy by frequency, often with a heap + queue of cooling tasks.',
      ],
      why: 'Many "streaming window" and "nearest/shortest" problems are queues in disguise.',
      whenToUse: ['Window max/min', 'Unweighted shortest path', 'Level-order processing'],
      whenNotToUse: ['Weighted shortest paths (use Dijkstra).'],
      syntax: `var dq []int // indexes, values decreasing
for i, v := range a {
	for len(dq) > 0 && a[dq[len(dq)-1]] <= v { dq = dq[:len(dq)-1] }
	dq = append(dq, i)
	if dq[0] <= i-k { dq = dq[1:] }
	if i >= k-1 { out = append(out, a[dq[0]]) }
}`,
      example: {
        code: `a = [1 3 -1 -3 5 3 6 7], k = 3
max per window = [3 3 5 5 6 7]`,
        notes: ['Smaller elements behind a bigger newcomer can never be a future max — drop them.'],
      },
      mistakes: ['Storing values instead of indexes (cannot tell when they leave the window).', 'Marking BFS nodes visited on dequeue instead of enqueue (duplicates explode).'],
      problems: [
        {
          id: 'm21-t2-p1',
          tier: 'foundation',
          level: 3,
          kind: 'code',
          title: 'Peak CPU in each 5-minute window',
          story: 'A monitoring system reports the max CPU reading for every sliding window of k samples.',
          prompt: 'Write `WindowMax(a []int, k int) []int` in O(n).',
          hints: ['Monotonic decreasing deque of indexes.'],
          solution: `func WindowMax(a []int, k int) []int {
	if k <= 0 || k > len(a) {
		return nil
	}
	out := make([]int, 0, len(a)-k+1)
	var dq []int
	for i, v := range a {
		for len(dq) > 0 && a[dq[len(dq)-1]] <= v {
			dq = dq[:len(dq)-1]
		}
		dq = append(dq, i)
		if dq[0] <= i-k {
			dq = dq[1:]
		}
		if i >= k-1 {
			out = append(out, a[dq[0]])
		}
	}
	return out
}`,
          explanation: 'Each index is pushed and popped at most once.',
          complexity: { time: 'O(n)', space: 'O(k)' },
        },
        {
          id: 'm21-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Rotting packages (multi-source BFS)',
          story: 'In a cold-storage grid, spoiled packages (2) spoil fresh neighbours (1) every hour. Empty cells are 0.',
          prompt: 'Write `HoursToSpoil(grid [][]int) int` returning hours until all fresh packages spoil, or −1 if some never do.',
          hints: ['Start BFS with ALL spoiled cells at time 0.', 'Process level by level; count remaining fresh.'],
          solution: `func HoursToSpoil(grid [][]int) int {
	R, C := len(grid), len(grid[0])
	var q [][2]int
	fresh := 0
	for r := 0; r < R; r++ {
		for c := 0; c < C; c++ {
			switch grid[r][c] {
			case 2:
				q = append(q, [2]int{r, c})
			case 1:
				fresh++
			}
		}
	}
	dirs := [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	hours := 0
	for len(q) > 0 && fresh > 0 {
		next := q[:0:0]
		for _, p := range q {
			for _, d := range dirs {
				r, c := p[0]+d[0], p[1]+d[1]
				if r >= 0 && r < R && c >= 0 && c < C && grid[r][c] == 1 {
					grid[r][c] = 2
					fresh--
					next = append(next, [2]int{r, c})
				}
			}
		}
		q = next
		hours++
	}
	if fresh > 0 {
		return -1
	}
	return hours
}`,
          explanation: 'Multi-source BFS computes, for every cell, the distance to the nearest source in one pass. Marking on enqueue prevents double counting.',
          complexity: { time: 'O(R·C)', space: 'O(R·C)' },
        },
        {
          id: 'm21-t2-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'CPU task scheduler with cooldown',
          story: 'A job runner executes tasks labelled A–Z; the same label must wait n time units before running again. Idle slots are allowed.',
          prompt: 'Write `LeastInterval(tasks []byte, n int) int` returning the minimum total time. Explain the formula approach.',
          hints: ['Let maxF be the highest frequency and k how many labels have it.', 'Answer = max(len(tasks), (maxF−1)·(n+1) + k).'],
          solution: `func LeastInterval(tasks []byte, n int) int {
	var cnt [26]int
	maxF := 0
	for _, t := range tasks {
		cnt[t-'A']++
		maxF = max(maxF, cnt[t-'A'])
	}
	k := 0
	for _, c := range cnt {
		if c == maxF {
			k++
		}
	}
	return max(len(tasks), (maxF-1)*(n+1)+k)
}`,
          explanation: 'The most frequent task forces maxF−1 full frames of length n+1 plus a final partial frame holding the k tied tasks. If other tasks overflow the idle slots, no idling is needed and the answer is just len(tasks).',
          complexity: { time: 'O(n)', space: 'O(1)' },
          variation: 'Return the actual schedule using a max-heap + cooldown queue.',
        },
      ],
    },
  ],
}
