import type { JavaQuestionInput } from '../types'

/** Generics + Exceptions domain bank. */
export const genericsExceptionsQuestions: JavaQuestionInput[] = [
  {
    id: 'gen-001',
    domain: 'Generics',
    level: 3,
    kind: 'mcq',
    prompt: 'What does type erasure mean for List<String> at runtime?',
    options: [
      'The JVM stores element types per list instance',
      'List<String> and List are the same class at runtime; generic info exists only at compile time',
      'Generic types are stored in the heap header',
      'The list stores a Class<T> token per instance',
    ],
    answerKey: 1,
    explanation:
      'Erasure replaces type parameters with their bounds (Object if unbounded), inserts bridge methods and checked casts. Consequences: no new T(), no instanceof List<String>, no generic exception classes, overloads differing only by generics clash.',
    followUps: ['How do super type tokens / Class<T> parameters recover type info?'],
    trap: '"Generics are runtime-enforced" is false — enforcement is compile-time only.',
  },
  {
    id: 'gen-002',
    domain: 'Generics',
    level: 3,
    kind: 'mcq',
    prompt: 'You need a method to copy elements FROM a list of T INTO a list of T. Which signatures follow PECS?',
    options: [
      'copy(List<? extends T> src, List<? extends T> dst)',
      'copy(List<? extends T> src, List<? super T> dst)',
      'copy(List<? super T> src, List<? extends T> dst)',
      'copy(List<T> src, List<T> dst) — wildcards never help',
    ],
    answerKey: 1,
    explanation:
      'Producer Extends, Consumer Super: src produces T values to read; dst consumes T values to write. This is exactly how Collections.copy is declared.',
    followUps: ['Why is List<? extends Object> not the same as List<Object>?'],
  },
  {
    id: 'gen-003',
    domain: 'Generics',
    level: 4,
    kind: 'output_prediction',
    prompt: 'What happens?',
    code: 'List<String> strings = new ArrayList<>();\nList raw = strings;\nraw.add(42);\nString s = strings.get(0);',
    options: [
      'Compilation error at raw.add(42)',
      'ClassCastException at strings.get(0)',
      'Prints 42',
      'ArrayStoreException',
    ],
    answerKey: 1,
    explanation:
      'Raw types bypass compile-time checks, so add(42) compiles with an unchecked warning; the compiler-inserted cast at get() fails at runtime. This is heap pollution via raw types.',
    followUps: ['Where does the @SuppressWarnings("unchecked") belong if this pattern is unavoidable?'],
    trap: 'The exception surfaces far from the bug — at the read, not the write.',
  },
  {
    id: 'gen-004',
    domain: 'Generics',
    level: 4,
    kind: 'short_answer',
    prompt: 'Explain bounded wildcards variance: why are Java generics invariant, and what problem do ? extends / ? super solve?',
    modelAnswer:
      'Invariance protects type safety: if List<String> were a List<Object>, code holding the Object view could insert an Integer into a String list. Arrays are covariant and pay for it with ArrayStoreException at runtime. ? extends T gives a covariant read-only view — the compiler forbids adding anything (except null) because it cannot prove which subtype the list actually holds. ? super T gives a contravariant write-only view — any supertype of T can hold a T; reading yields Object. PECS (Producer Extends, Consumer Super) turns this into API design guidance, e.g. Stream<? extends T> consumers and Collections.copy\u2019s src/dst declarations.',
    rubric: [
      'Why invariance exists (heap pollution argument)',
      'Arrays covariance contrast',
      'Correct add/get rules for both wildcard directions',
      'PECS applied to a real signature',
    ],
    explanation:
      'Variance separates mid from senior. The array-covariance hole is the evidence the interviewer wants.',
  },
  {
    id: 'exc-001',
    domain: 'Exceptions',
    level: 2,
    kind: 'mcq',
    prompt: 'Which hierarchy is correct?',
    options: [
      'Error and Exception both extend Throwable; RuntimeException extends Exception',
      'Exception extends Error',
      'RuntimeException extends Error',
      'Checked exceptions extend RuntimeException',
    ],
    answerKey: 0,
    explanation:
      'Throwable splits into Error (JVM-fatal: OutOfMemoryError, StackOverflowError — do not catch) and Exception; RuntimeException and subclasses are unchecked, all other Exception subclasses are checked.',
    followUps: ['When would you ever catch an Error? (rarely — e.g. OOM guard rails in batch loops)'],
  },
  {
    id: 'exc-002',
    domain: 'Exceptions',
    level: 3,
    kind: 'output_prediction',
    prompt: 'What is printed?',
    code: 'try (var in = new FakeResource()) {\n  throw new IllegalStateException("body");\n} catch (IllegalStateException e) {\n  System.out.println("caught: " + e.getMessage());\n  for (Throwable t : e.getSuppressed()) System.out.println("suppressed: " + t.getMessage());\n}\nclass FakeResource implements AutoCloseable {\n  public void close() { throw new IllegalStateException("close"); }\n}',
    options: [
      'caught: close',
      'caught: body / suppressed: close',
      'caught: body — the close failure is lost',
      'Two stack traces printed',
    ],
    answerKey: 1,
    explanation:
      'Try-with-resources adds the close() failure via addSuppressed() — the body exception wins and the close failure is visible in the stack trace. With a manual finally, the close exception would silently replace the body exception.',
    followUps: ['Why is finally-swallows-exception the reason try-with-resources exists?'],
  },
  {
    id: 'exc-003',
    domain: 'Exceptions',
    level: 3,
    kind: 'mcq',
    prompt: 'When does finally NOT run?',
    options: [
      'Only on System.exit()',
      'System.exit(), JVM crash, or the thread being killed at shutdown; a return inside finally also discards pending exceptions',
      'Never — finally always runs',
      'Only when an exception is in flight',
    ],
    answerKey: 1,
    explanation:
      'finally is skipped on System.exit(), JVM crash, daemon-thread death at shutdown. A return/break inside finally silently discards any pending exception and swallows returns — never put control flow in finally.',
    followUps: ['What does a return inside finally do to an in-flight exception?'],
  },
  {
    id: 'exc-004',
    domain: 'Exceptions',
    level: 4,
    kind: 'short_answer',
    prompt: 'What is the production-grade strategy for designing and handling exceptions in a service layer?',
    modelAnswer:
      'Design: a small hierarchy of domain exceptions (OrderNotFoundException extends RuntimeException) so callers are not polluted with checked boilerplate; reserve checked exceptions for genuinely recoverable, expected conditions. Handling: translate low-level exceptions into domain-meaningful ones while preserving the cause (new ServiceException("order lookup failed", e)) — never swallow, never e.printStackTrace(); log once at the boundary with context (MDC), let the framework map exceptions to HTTP responses (@ControllerAdvice). Discipline: never use exceptions for control flow (they are expensive and hide intent), never catch Throwable, validate inputs early to fail fast. Idempotent message handlers should distinguish retryable (transient) from non-retryable exceptions so retries do not duplicate side effects.',
    rubric: [
      'Checked vs unchecked judgement, not dogma',
      'Exception translation with cause preservation',
      'Log-once-at-boundary pattern',
      'Anti-patterns: control flow, swallowing, catching Throwable',
    ],
    explanation:
      'The senior marker is the retryable/non-retryable distinction — it connects exception design to distributed-system correctness.',
    followUps: ['How does this change for Kafka consumers deciding between retry and DLQ?'],
  },
  {
    id: 'exc-005',
    domain: 'Exceptions',
    level: 3,
    kind: 'mcq',
    prompt: 'What is wrong with catch (Exception e) { } around a whole request handler?',
    options: [
      'Nothing, if you log afterwards',
      'It swallows everything including bugs and InterruptedException — breaking cancellation and masking errors',
      'It only catches unchecked exceptions',
      'It makes the code faster',
    ],
    answerKey: 1,
    explanation:
      'Catching everything swallows programming bugs, hides InterruptedException (breaking thread-pool cancellation), and makes failure invisible. Catch what you can meaningfully handle; let the rest propagate.',
    followUps: ['Why does swallowing InterruptedException break ExecutorService shutdownNow()?'],
    trap: 'Restoring the interrupt flag (Thread.currentThread().interrupt()) is the detail interviewers listen for.',
  },
  {
    id: 'gen-005',
    domain: 'Generics',
    level: 5,
    kind: 'code_completion',
    prompt: 'Complete the method so it compiles and returns the first element or null.',
    code: 'static <T extends Comparable<? super T>> T firstOrNull(__________ list) {\n  return list.isEmpty() ? null : list.get(0);\n}',
    options: [
      'List<? extends Comparable<?>>',
      'List<T>',
      'List<T super Comparable>',
      'Collection<? extends T>',
    ],
    answerKey: 1,
    explanation:
      'The type parameter T is already bounded to Comparable<? super T>, so the parameter is simply List<T>. Wildcards here would break the bound relationship between T and the list\u2019s element type.',
    followUps: ['Why Comparable<? super T> rather than Comparable<T>? (so T can reuse a supertype\u2019s natural order)'],
  },
  {
    id: 'exc-006',
    domain: 'Exceptions',
    level: 4,
    kind: 'debugging',
    prompt:
      'This code intermittently loses the original failure cause in production logs. Why, and what is the fix?',
    code: 'try {\n  processOrder(order);\n} catch (Exception e) {\n  log.error("Order processing failed");\n  throw new RuntimeException("Order processing failed");\n}',
    modelAnswer:
      'Two faults: the original exception e is never logged (no stack trace, no cause) and the rethrow discards it as cause — the production log shows only the wrapper message, making diagnosis impossible. Fix: pass the cause and context: throw new OrderProcessingException("failed for order " + order.id(), e), and log once at the handling boundary with structured context (orderId, attempt). Never construct a message identical to the original — it suggests translation where none happened.',
    rubric: [
      'Missing cause chaining (new RuntimeException(msg, e))',
      'Log includes the exception object, not just a message',
      'Context (order id) added to the wrapper',
    ],
    explanation:
      'Cause-chaining is small but its absence burns entire on-call shifts — a favourite war-story question.',
  },
]
