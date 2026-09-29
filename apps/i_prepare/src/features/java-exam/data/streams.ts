import type { JavaQuestionInput } from '../types'

/** Streams & FP domain bank: lambdas, stream pipeline semantics, collectors, Optional, parallelism. */
export const streamsQuestions: JavaQuestionInput[] = [
  {
    id: 'str-001',
    domain: 'Streams & FP',
    level: 2,
    kind: 'mcq',
    prompt: 'What makes a functional interface, and what can it contain?',
    options: [
      'Any interface in java.util.function',
      'Exactly one abstract method; it may also have default and static methods',
      'An interface with only default methods',
      'An interface annotated @Interface',
    ],
    answerKey: 1,
    explanation:
      'A functional interface has exactly one abstract method (SAM). @FunctionalInterface is documentation + compile-time check, not required. Comparators and Runnable qualify; the abstract count ignores Object methods.',
    followUps: ['Why do equals/hashCode from Object not break the SAM rule?'],
  },
  {
    id: 'str-002',
    domain: 'Streams & FP',
    level: 3,
    kind: 'output_prediction',
    prompt: 'What does this print?',
    code: 'Stream<Integer> s = Stream.of(1, 2, 3);\ns.filter(i -> { System.out.println("f" + i); return true; });\nSystem.out.println("end");',
    options: ['f1 f2 f3 end', 'end', 'end f1 f2 f3', 'Nothing — infinite loop'],
    answerKey: 1,
    explanation:
      'Streams are lazy: no terminal operation means no work. filter is intermediate and only runs when a terminal (collect, forEach…) pulls elements. The output is just "end".',
    followUps: ['How does laziness enable short-circuiting with findFirst/limit?'],
    trap: 'Forgetting a terminal operation is a real production bug — the pipeline silently does nothing.',
  },
  {
    id: 'str-003',
    domain: 'Streams & FP',
    level: 3,
    kind: 'output_prediction',
    prompt: 'What is the result?',
    code: 'Stream<String> s = Stream.of("a", "b", "c");\ns.forEach(System.out::print);\ns.forEach(System.out::print);',
    options: ['abcabc', 'abc then IllegalStateException', 'Compilation error', 'abc'],
    answerKey: 1,
    explanation:
      'A stream is consumed once — a second terminal operation throws IllegalStateException: stream has already been operated upon or closed.',
    followUps: ['How do suppliers (Stream.generate/supplier.get()) avoid this in reusable pipelines?'],
  },
  {
    id: 'str-004',
    domain: 'Streams & FP',
    level: 3,
    kind: 'mcq',
    prompt: 'map vs flatMap — which is correct?',
    options: [
      'flatMap flattens nested streams/collections into one; map applies 1-to-1',
      'map flattens; flatMap is 1-to-1',
      'They are interchangeable for collections',
      'flatMap only works on numeric streams',
    ],
    answerKey: 0,
    explanation:
      'map: T → R (one out per element). flatMap: T → Stream<R> then flattens — for lists-of-lists, Optional unwrapping in chains, or line → words text processing.',
    followUps: ['What is mapMulti (Java 16+) and when does it beat flatMap? (avoids per-element stream allocation)'],
  },
  {
    id: 'str-005',
    domain: 'Streams & FP',
    level: 4,
    kind: 'mcq',
    prompt: 'Why can parallelStream() make performance worse?',
    options: [
      'It never does — more threads are always faster',
      'Split/merge overhead, shared FJ pool contention, and poor spliterator splitting can swamp the gains on small or I/O-bound work',
      'It disables JIT compilation',
      'It forces full GC on each operation',
    ],
    answerKey: 1,
    explanation:
      'parallelStream runs on the shared ForkJoinPool.commonPool: small datasets pay more for splitting/merging than they save; blocking I/O inside parallel tasks starves the common pool for the whole JVM; stateful lambdas with side effects race. Measure with JMH; parallelise only CPU-bound work on large, cheaply-splittable data.',
    followUps: ['How do you isolate blocking work from the common pool? (dedicated ForkJoinPool submission)',
      'Why is boxing bad for parallel IntStream performance?'],
    trap: 'The "just add parallel()" habit is the bug — a blocking call inside parallelStream can freeze unrelated features.',
  },
  {
    id: 'str-006',
    domain: 'Streams & FP',
    level: 4,
    kind: 'coding',
    prompt:
      'Given List<Order> where each Order has List<Item>, produce a Map<String, Double> of product name → total revenue, sorted by revenue descending. Assume getters exist.',
    modelAnswer:
      'orders.stream()\n  .flatMap(o -> o.getItems().stream())\n  .collect(groupingBy(Item::getName,\n           TreeMap::new,\n           collectingInfos… — canonical version: Collectors.groupingBy(Item::getName, Collectors.summingDouble(i -> i.getPrice() * i.getQuantity()))))\nthen wrap into a LinkedHashMap sorted by value: .entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).collect(toMap(k, v, (a,b)->a, LinkedHashMap::new)). Key points: flatMap to a single item stream; groupingBy + summingDouble for the aggregation; LinkedHashMap downstream for order preservation; note double rounding — use BigDecimal or long cents in production.',
    rubric: [
      'flatMap to items',
      'groupingBy with a summing collector',
      'Value-sorted map with LinkedHashMap',
      'Mentions monetary precision (BigDecimal/cents)',
    ],
    explanation:
      'A realistic aggregation test: pipeline composition plus the floating-point money trap.',
    followUps: ['How would you do the same without streams for 50M rows? (DB GROUP BY, not JVM)'],
  },
  {
    id: 'str-007',
    domain: 'Streams & FP',
    level: 3,
    kind: 'mcq',
    prompt: 'orElse(x) vs orElseGet(() -> x) — why does it matter?',
    options: [
      'They are identical',
      'orElse evaluates x eagerly even when the Optional has a value; orElseGet is lazy',
      'orElseGet caches the result',
      'orElse throws if the Optional is empty',
    ],
    answerKey: 1,
    explanation:
      'orElse(compute()) calls compute() every time — a real cost if it is a DB call or allocation. orElseGet takes a Supplier and runs only when empty.',
    followUps: ['When is orElse the right choice? (already-computed constants)'],
    trap: 'orElse with an expensive default is a silent production performance bug.',
  },
  {
    id: 'str-008',
    domain: 'Streams & FP',
    level: 2,
    kind: 'true_false',
    prompt: 'Optional is intended as a return type to express "may be absent" — not as a field type or method parameter.',
    options: ['True', 'False'],
    answerKey: 0,
    explanation:
      'The JDK designers intended Optional for return types. Fields add an allocation/box layer; parameters add ambiguity — overloads or @Nullable contracts are clearer. Serialising Optional fields also fails.',
    followUps: ['How do you express optional input then? (overloads, builder, @Nullable)'],
  },
  {
    id: 'str-009',
    domain: 'Streams & FP',
    level: 4,
    kind: 'output_prediction',
    prompt: 'What does this print?',
    code: 'List<Integer> list = new ArrayList<>(List.of(1, 2, 3));\nlist.stream().peek(i -> list.add(i * 10)).forEach(System.out::print);',
    options: ['123', '123 then the added tens', 'Undefined / likely ConcurrentModificationException', 'Compilation error'],
    answerKey: 2,
    explanation:
      'Mutating the source list inside the pipeline is undefined behaviour — peek here usually throws CME or produces surprising results. Streams assume non-interference; side effects on the source break that contract.',
    followUps: ['What does the spec say about stateful vs stateless behavioural parameters?'],
    trap: 'peek exists for debugging — abusing it for mutation is exactly the trap being tested.',
  },
  {
    id: 'str-010',
    domain: 'Streams & FP',
    level: 5,
    kind: 'short_answer',
    prompt: 'When are method references clearer than lambdas, and when are lambdas clearer? Give one case where a method reference changes behaviour (not just readability).',
    modelAnswer:
      'Method references are clearer for a plain call with the parameter as the sole argument (Order::getName, System.out::println, String::equalsIgnoreCase with two args). Lambdas are clearer when arguments are reordered, composed, or partially applied: (a, b) -> a.price(b.quantity) has no clean reference. Behaviour difference cases: this::method binds the receiver at reference-creation time (unlike a lambda capturing a mutable variable later); String::new as a constructor reference is a Supplier of fresh instances where a lambda could accidentally share one; and a method reference to an instance method of an unbound receiver (String::length) works where the equivalent lambda would need to capture the element type explicitly. Also: method references to overloaded methods resolve by target type — a lambda can be more precise when overloads are ambiguous.',
    rubric: [
      'Clear criteria for both directions',
      'At least one genuine behavioural difference (binding time, overload resolution)',
    ],
    explanation:
      'Staff-level candidates know this is mostly readability — and can still name the edge where semantics differ.',
  },
  {
    id: 'str-011',
    domain: 'Streams & FP',
    level: 3,
    kind: 'multiple_select',
    prompt: 'Which operations are terminal (select all)?',
    options: ['peek', 'collect', 'anyMatch', 'map'],
    answerKey: [1, 2],
    explanation:
      'collect and anyMatch are terminal (anyMatch short-circuits). peek and map are intermediate/lazy.',
    followUps: ['Which two terminal operations short-circuit? (anyMatch/allMatch/noneMatch, findFirst/findAny, limit in chains)'],
  },
  {
    id: 'str-012',
    domain: 'Streams & FP',
    level: 4,
    kind: 'debugging',
    prompt:
      'This grouping reports wrong totals for some product names. Why?',
    code: 'Map<String, Double> revenue = items.stream()\n  .collect(Collectors.groupingBy(\n    i -> i.getName().toUpperCase(),\n    Collectors.summingDouble(Item::getPrice)));\n// Later: revenue.merge(name, amount, Double::sum)',
    modelAnswer:
      'Two issues: (1) summingDouble accumulates binary floating point — repeated addition drifts (0.1-style error), so totals differ from expectations; use long cents or BigDecimal with a custom collector (Collectors.reducing with BigDecimal::add). (2) The merge afterwards applies a different key normalisation than the grouping key (raw name vs upper-cased) — entries silently fork into two keys. Fix: normalise once (extract a canonical key function) and keep money in minor units.',
    rubric: [
      'Floating-point accumulation error',
      'Key-normalisation mismatch causing forked entries',
    ],
    explanation:
      'The double-bug composition is realistic — monetary drift plus key mismatch is exactly what code review of stream aggregations should catch.',
  },
]
