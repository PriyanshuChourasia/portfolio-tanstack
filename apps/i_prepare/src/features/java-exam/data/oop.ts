import type { JavaQuestionInput } from '../types'

/** OOP domain: classes, inheritance, polymorphism, interfaces, Object contract, LLD patterns. */
export const oopQuestions: JavaQuestionInput[] = [
  {
    id: 'oop-001',
    domain: 'OOP',
    level: 1,
    kind: 'mcq',
    prompt: 'Which are the four pillars of OOP?',
    options: [
      'Encapsulation, Inheritance, Polymorphism, Abstraction',
      'Classes, Objects, Methods, Fields',
      'Composition, Aggregation, Association, Dependency',
      'Overloading, Overriding, Hiding, Shadowing',
    ],
    answerKey: 0,
    explanation:
      'Encapsulation (hide state), inheritance (reuse/extension), polymorphism (one interface, many behaviours) and abstraction (expose what, hide how).',
    followUps: ['Which pillar does the Strategy pattern primarily exercise?'],
  },
  {
    id: 'oop-002',
    domain: 'OOP',
    level: 2,
    kind: 'output_prediction',
    prompt: 'What is the output?',
    code: 'class Base {\n  void hook() { System.out.println("base"); }\n  Base() { hook(); }\n}\nclass Child extends Base {\n  int x = 42;\n  @Override void hook() { System.out.println(x); }\n}\nnew Child();',
    options: ['42', '0', 'base', 'NullPointerException'],
    answerKey: 1,
    explanation:
      'Base\u2019s constructor runs before Child\u2019s field initializers, so x still holds its default 0 when the overridden hook() is invoked from the superclass constructor.',
    followUps: ['How do you fix this design? (final/private hook, or eager initialisation)'],
    trap: 'Calling overridable methods from constructors is a bug factory — this is a top-3 trick question.',
  },
  {
    id: 'oop-003',
    domain: 'OOP',
    level: 3,
    kind: 'mcq',
    prompt: 'Parent p = new Child(); p.staticM(); — which method runs?',
    options: [
      'Child.staticM() — runtime polymorphism',
      'Parent.staticM() — static dispatch on the reference type',
      'Compilation error',
      'Depends on whether staticM is annotated @Override',
    ],
    answerKey: 1,
    explanation:
      'Static methods are hidden, not overridden: the call binds statically to the reference type (Parent). Instance methods dispatch on the actual object class via the vtable.',
    followUps: ['What about fields — are they polymorphic?'],
  },
  {
    id: 'oop-004',
    domain: 'OOP',
    level: 3,
    kind: 'mcq',
    prompt: 'A class implements two interfaces that both define default void test() with the same signature. What must the class do?',
    options: [
      'Nothing — the first interface wins',
      'Override test() or explicitly delegate via InterfaceName.super.test()',
      'The compiler picks alphabetically',
      'This is a runtime conflict',
    ],
    answerKey: 1,
    explanation:
      'Diamond conflict on default methods: the compiler forces the class to override, optionally delegating to one or both via InterfaceName.super.test().',
    followUps: ['What if one interface is a subinterface of the other? (the more specific wins)'],
  },
  {
    id: 'oop-005',
    domain: 'OOP',
    level: 3,
    kind: 'short_answer',
    prompt: 'Composition over inheritance — explain the trade-off and give a concrete example where you would choose each.',
    modelAnswer:
      'Inheritance is the strongest coupling in Java: the subclass depends on superclass internals (fragile base class, constructor-hook traps, broken encapsulation across packages). Composition forwards calls to an injected collaborator, stays loosely coupled, is swappable at runtime and is trivially testable with mocks. Choose inheritance only for true is-a with stable parent contracts inside the same module — e.g. abstract BaseRepository in your own framework layer. Prefer composition for behaviour reuse — e.g. java.io decorator streams (BufferedInputStream wraps InputStream) or a PaymentProcessor strategy family. Rule of thumb: model capability with composition, model a type hierarchy only when substitutability (LSP) genuinely holds.',
    rubric: [
      'Fragile base class / tight coupling argument',
      'Runtime flexibility and testability of composition',
      'Concrete valid example for each side',
      'Mentions LSP or substitutability',
    ],
    explanation:
      'The interviewer is testing design judgement, not vocabulary — cite java.io or Spring\u2019s composition-heavy design as evidence.',
    followUps: ['How does this relate to the Decorator pattern?'],
  },
  {
    id: 'oop-006',
    domain: 'OOP',
    level: 3,
    kind: 'mcq',
    prompt: 'Which contract must equals() and hashCode() uphold?',
    options: [
      'Equal objects may have different hashCodes if they are in different collections',
      'Equal objects must have equal hashCodes; hashCode must be consistent across calls',
      'hashCode must be unique per object',
      'equals must compare getClass() exactly',
    ],
    answerKey: 1,
    explanation:
      'The contract: equal objects must have equal hashCodes; hashCode must return the same value across invocations within a JVM run. Breaking it scatters HashMap entries — silent corruption, no exception.',
    followUps: ['instanceof vs getClass() in equals — trade-offs?'],
    trap: 'The failure is silent: lookups return null, duplicates appear — nothing crashes.',
  },
  {
    id: 'oop-007',
    domain: 'OOP',
    level: 4,
    kind: 'output_prediction',
    prompt: 'A mutable Point is used as a HashMap key, then mutated. What does map.get(point) return?',
    code: 'class Point { int x; int y;\n  Point(int x, int y) { this.x = x; this.y = y; }\n  @Override public boolean equals(Object o) { return o instanceof Point p && p.x == x && p.y == y; }\n  @Override public int hashCode() { return 31 * x + y; }\n}\nvar map = new HashMap<Point, String>();\nvar p = new Point(1, 2);\nmap.put(p, "A");\np.x = 9;\nSystem.out.println(map.get(p));',
    options: ['A', 'null', 'Throws ConcurrentModificationException', 'Undefined'],
    answerKey: 1,
    explanation:
      'The bucket index was computed at insertion. After mutation, get() hashes the new state and searches a different bucket — the entry is stranded, returning null. Use immutable keys.',
    followUps: ['How do you recover the stranded entry?'],
  },
  {
    id: 'oop-008',
    domain: 'OOP',
    level: 4,
    kind: 'coding',
    prompt:
      'Design an immutable Money class (amount + currency) that is safe to use as a map key and share across threads. State the rules you applied.',
    modelAnswer:
      'final class Money { private final BigDecimal amount; private final Currency currency; } — rules: final class (or final methods), all fields private final, no setters, constructor validates invariants (amount non-null, scale fixed), BigDecimal is itself immutable so no defensive copy needed for the amount, but if a mutable field existed (e.g. Date, List) you would deep-copy on the way in and out. Derive equals/hashCode from amount+currency (or use a record). Never leak this from the constructor.',
    rubric: [
      'final class + final fields, no mutators',
      'Constructor validation of invariants',
      'Correct handling of mutable fields (defensive copies) or justification why not needed',
      'Mentions thread-safety for free via immutability',
    ],
    explanation:
      'Immutability is the concurrency strategy — safe publication without synchronisation is the senior-level point.',
    followUps: ['How does BigDecimal scale/rounding affect equals? (2.0 vs 2.00)'],
    trap: 'BigDecimal.equals compares scale too — 2.0 != 2.00; use compareTo for value comparison.',
  },
  {
    id: 'oop-009',
    domain: 'OOP',
    level: 2,
    kind: 'mcq',
    prompt: 'Which statement about abstract classes is true?',
    options: [
      'They cannot have constructors',
      'They can hold state and constructors; interfaces (still) cannot hold instance state',
      'They are implicitly final',
      'They cannot implement interfaces',
    ],
    answerKey: 1,
    explanation:
      'Abstract classes carry state (fields, constructors) and template logic for an is-a family. Interfaces define can-do contracts; even with default methods they cannot hold instance state.',
    followUps: ['Map Template Method to abstract classes.'],
  },
  {
    id: 'oop-010',
    domain: 'OOP',
    level: 4,
    kind: 'system_design',
    prompt:
      'Design the class model (LLD) for a Parking Lot: entities, responsibilities, key interfaces, and concurrency handling for spot availability.',
    modelAnswer:
      'Entities: Vehicle (abstract; Car/Bike/Truck with spot-size needs), ParkingSpot (type, occupancy state), ParkingFloor (spot registry, display board), ParkingLot (facade: issueTicket, vacate), Ticket (entry time, spot, vehicle), PricingStrategy (interface — flat, hourly, surge), SpotAssignmentStrategy (nearest, first-fit). Patterns: Strategy for pricing/assignment, Factory for ticket creation, State or simple enum for spot occupancy, Observer for display boards. Concurrency: spot availability lives in a thread-safe structure — per-floor ConcurrentHashMap<SpotId, Spot> plus atomic reservation (computeIfAbsent / synchronized tryPark) so two cars never get the same spot; ticket issuance must be atomic (AtomicLong counter or DB sequence in a real system). Extensibility: new vehicle types plug in without touching the lot logic (Open/Closed).',
    rubric: [
      'Core entities and responsibilities',
      'At least two design patterns correctly placed',
      'Thread-safe spot reservation',
      'Extensibility argument (adding EV charging, new vehicle types)',
    ],
    explanation:
      'This is the classic LLD screen. The differentiator is the concurrency discussion and OCP reasoning, not the entity list.',
    followUps: ['Where does the state move if we persist tickets to a database?', 'How would you handle peak-hour pricing?'],
  },
  {
    id: 'oop-011',
    domain: 'OOP',
    level: 3,
    kind: 'mcq',
    prompt: 'What does the final keyword NOT prevent?',
    options: [
      'Overriding a final method',
      'Subclassing a final class',
      'Mutating an object referenced by a final field',
      'Reassigning a final local variable',
    ],
    answerKey: 2,
    explanation:
      'final on a reference prevents reassignment only — the referenced object stays mutable. Immutability requires the object itself to be designed immutable.',
    followUps: ['What about final collections created with List.of()?'],
  },
  {
    id: 'oop-012',
    domain: 'OOP',
    level: 5,
    kind: 'architecture',
    prompt:
      'A legacy codebase has a 5-level inheritance hierarchy for its domain entities with duplicated logic at each level. As senior engineer, how do you refactor it?',
    modelAnswer:
      'Strategy: replace deep inheritance with composition plus interfaces, incrementally. 1) Characterise behaviour with tests (mutation testing helps find what actually depends on overrides). 2) Identify orthogonal behaviours buried in subclasses — extract them as Strategy objects (e.g. PricingBehaviour, AuditBehaviour) injected via constructor. 3) Collapse the hierarchy toward one concrete class parameterised by strategies; keep the old public API via an adapter during migration. 4) Apply the Template Method only where a stable, narrow skeleton genuinely exists. 5) Guard with architecture tests (ArchUnit) forbidding new subclasses of the remaining base classes. Move module by module behind the seams; never big-bang.',
    rubric: [
      'Test-first / characterisation safety net',
      'Composition/Strategy extraction, not just flattening',
      'Incremental migration with an adapter seam',
      'Guardrails to prevent regression (ArchUnit or similar)',
    ],
    explanation:
      'Staff-level answers sequence the refactor, name the safety net, and leave the codebase with enforceable rules.',
    followUps: ['When is deep inheritance actually the right call?'],
  },
]
