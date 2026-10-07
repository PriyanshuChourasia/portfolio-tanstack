import type { Module } from '../types'

export const MODULE_06: Module = {
  id: 'm06',
  number: 6,
  track: 'go',
  title: 'Structs',
  shortTitle: 'Structs',
  tagline: 'Modelling real entities: initialisation styles, comparison, embedding, anonymous structs, pointers to structs.',
  topics: [
    {
      id: 'm06-t1',
      title: 'Struct Declaration, Initialisation and Comparison',
      summary: 'Named vs positional literals, zero-value structs, == on structs, anonymous structs.',
      concept: [
        'A struct groups typed fields: `type User struct { ID int; Name string }`. Its zero value has every field zeroed — design types so the zero value is useful.',
        'Literals: named `User{ID: 1, Name: "a"}` (preferred; robust to field reordering) or positional `User{1, "a"}` (must list all fields in order). `&User{...}` allocates and returns a pointer.',
        'Structs are values: assignment copies all fields (shallow — pointers/slices/maps inside are shared). Structs are comparable with `==` iff all fields are comparable.',
        'Anonymous structs `struct{ X, Y int }{1, 2}` are handy for one-off data such as table-driven test cases and JSON payloads.',
      ],
      why: 'Structs are how Go models data; value semantics make copies explicit and predictable.',
      whenToUse: ['Domain entities: User, Order, Vehicle', 'Grouping return values', 'Test tables with anonymous structs'],
      whenNotToUse: ['Positional literals for structs from other packages (breaks when fields are added).', 'Comparing structs containing floats from computations with ==.'],
      syntax: `type Location struct {
	Lat, Lng float64
}
type Vehicle struct {
	ID    string
	Pos   Location
	Tags  []string
}
v := Vehicle{ID: "KA01", Pos: Location{12.9, 77.6}}
p := &v
p.Pos.Lat = 13.0
tests := []struct{ in, want int }{{1, 2}, {2, 4}}`,
      example: {
        code: `package main

import "fmt"

type Point struct{ X, Y int }
type Shape struct {
	Name string
	Pts  []Point
}

func main() {
	a := Point{1, 2}
	b := Point{Y: 2, X: 1}
	fmt.Println(a == b)

	s1 := Shape{Name: "tri", Pts: []Point{{0, 0}}}
	s2 := s1
	s2.Name = "copy"
	s2.Pts[0].X = 9
	fmt.Println(s1.Name, s1.Pts[0].X)
}`,
        output: `true
tri 9`,
        notes: ['Field order in named literals does not matter.', 's2 := s1 copies the struct — Name is independent…', '…but Pts is a slice header pointing to the same array, so the change is visible through s1 (shallow copy).'],
      },
      mistakes: ['Comparing structs that contain slices/maps → compile error.', 'Expecting a struct copy to deep-copy slices.', 'Exporting fields you did not mean to (capitalisation).'],
      problems: [
        {
          id: 'm06-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Which comparisons compile?',
          prompt: 'Which of these struct types can be compared with `==`?',
          code: `type A struct{ ID int; Name string }
type B struct{ ID int; Tags []string }
type C struct{ ID int; Loc *Location }
type D struct{ Meta map[string]string }`,
          check: { options: ['A and C', 'Only A', 'A, B and C', 'All of them'], answerIndex: 0 },
          hints: ['A struct is comparable iff every field type is comparable.', 'Pointers are comparable (by address).'],
          solution: '**A and C**.',
          explanation: 'Slices (B) and maps (D) are not comparable, so their structs are not. Pointers compare by address — C compiles, but two different *Location with equal coordinates are not equal.',
        },
        {
          id: 'm06-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Model a bank account',
          story: 'A neobank needs an account type that can never go negative and records every transaction.',
          prompt: 'Define `Transaction{Amount int64; Kind string; At time.Time}` and `BankAccount{ID string; Owner string; balance int64; history []Transaction}`. Write `NewAccount`, `(a *BankAccount) Deposit(amount int64) error`, `Withdraw`, `Balance() int64`, `History() []Transaction` (returning a copy). Amounts in paise (int64), never float.',
          hints: ['Keep balance unexported so callers cannot bypass validation.', 'Return `slices.Clone(a.history)` so callers cannot mutate your log.'],
          solution: `var ErrInvalidAmount = errors.New("amount must be positive")
var ErrInsufficientFunds = errors.New("insufficient funds")

type Transaction struct {
	Amount int64
	Kind   string
	At     time.Time
}

type BankAccount struct {
	ID      string
	Owner   string
	balance int64
	history []Transaction
}

func NewAccount(id, owner string) *BankAccount {
	return &BankAccount{ID: id, Owner: owner}
}

func (a *BankAccount) Deposit(amount int64) error {
	if amount <= 0 {
		return ErrInvalidAmount
	}
	a.balance += amount
	a.history = append(a.history, Transaction{amount, "deposit", time.Now()})
	return nil
}

func (a *BankAccount) Withdraw(amount int64) error {
	if amount <= 0 {
		return ErrInvalidAmount
	}
	if amount > a.balance {
		return fmt.Errorf("withdraw %d from %s: %w", amount, a.ID, ErrInsufficientFunds)
	}
	a.balance -= amount
	a.history = append(a.history, Transaction{-amount, "withdrawal", time.Now()})
	return nil
}

func (a *BankAccount) Balance() int64            { return a.balance }
func (a *BankAccount) History() []Transaction    { return slices.Clone(a.history) }`,
          explanation: 'Encapsulation via unexported fields + pointer-receiver methods keeps invariants. Integer minor units avoid float rounding errors in money.',
          complexity: { time: 'O(1) amortised per op; History O(n)', space: 'O(n) transactions' },
          variation: 'Make it safe for concurrent use and add `Transfer(from, to *BankAccount, amt int64)` without deadlocks (lock ordering by ID).',
        },
        {
          id: 'm06-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Struct size and field ordering',
          prompt: 'On 64-bit, what is `unsafe.Sizeof` of A and B? Why are they different, and when does this matter?',
          code: `type A struct {
	a bool
	b int64
	c bool
}
type B struct {
	b int64
	a bool
	c bool
}`,
          check: { options: ['A=24, B=16', 'A=10, B=10', 'A=16, B=16', 'A=24, B=24'], answerIndex: 0 },
          hints: ['int64 must be 8-byte aligned.', 'The struct size is rounded up to its largest alignment.'],
          solution: 'A = 24 bytes, B = 16 bytes.',
          explanation: 'A: bool(1) + 7 padding + int64(8) + bool(1) + 7 tail padding = 24. B: int64(8) + bool + bool + 6 padding = 16. It matters when you hold millions of structs (a 33% memory saving) or care about cache lines. Tools: `fieldalignment` analyzer.',
        },
      ],
    },
    {
      id: 'm06-t2',
      title: 'Embedding, Nested Structs and Pointers to Structs',
      summary: 'Composition over inheritance: promoted fields and methods.',
      concept: [
        'Embedding a type (field with no name) promotes its fields and methods to the outer struct: `type Employee struct { Person; Salary int }` lets you write `e.Name` and call Person’s methods on e.',
        'Embedding is composition, not inheritance: there is no polymorphism over the embedder. The embedded value is still a field (`e.Person`), and a promoted method’s receiver is the inner value.',
        'If two embedded types promote the same name at the same depth, accessing it is ambiguous (compile error only when used). The outer type can shadow promoted names.',
        'Pointers to structs: `p := &User{}`; `p.Name` auto-dereferences. Use pointers when you need shared mutation or the struct is large.',
      ],
      why: 'Embedding reuses behaviour and satisfies interfaces automatically without class hierarchies.',
      whenToUse: ['Reusing common fields (audit timestamps)', 'Embedding sync.Mutex in a small private type', 'Wrapping an interface to override one method (decorator)'],
      whenNotToUse: ['To fake inheritance hierarchies.', 'Embedding a mutex in an exported type (exposes Lock/Unlock in your API).'],
      syntax: `type Audit struct{ CreatedAt, UpdatedAt time.Time }
type Product struct {
	Audit
	SKU   string
	Price int64
}
p := Product{SKU: "X1"}
p.CreatedAt = time.Now() // promoted`,
      example: {
        code: `package main

import "fmt"

type Animal struct{ Name string }

func (a Animal) Speak() string { return a.Name + " makes a sound" }
func (a Animal) Intro() string { return "I am " + a.Name + ": " + a.Speak() }

type Dog struct{ Animal }

func (d Dog) Speak() string { return d.Name + " barks" }

func main() {
	d := Dog{Animal{"Rex"}}
	fmt.Println(d.Speak())
	fmt.Println(d.Intro())
}`,
        output: `Rex barks
I am Rex: Rex makes a sound`,
        notes: ['Dog.Speak shadows Animal.Speak when called on d.', 'Intro is promoted from Animal; inside it the receiver is the Animal, so it calls Animal.Speak — no virtual dispatch.', 'This is the key difference from inheritance.'],
      },
      mistakes: ['Expecting embedded methods to call the outer type’s overrides.', 'Copying a struct that embeds sync.Mutex (go vet: copylocks).', 'Ambiguous selectors from two embedded types.'],
      problems: [
        {
          id: 'm06-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'Promoted fields and shadowing',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

type Base struct{ ID int }

func (b *Base) SetID(id int) { b.ID = id }

type User struct {
	Base
	ID string
}

func main() {
	u := User{}
	u.SetID(7)
	u.ID = "u-1"
	fmt.Println(u.ID, u.Base.ID)
}`,
          check: { options: ['u-1 7', '7 7', 'compile error: ambiguous selector', 'u-1 0'], answerIndex: 0 },
          hints: ['The shallower field wins: User.ID (depth 0) shadows Base.ID (depth 1).', 'SetID is promoted; its receiver is &u.Base.'],
          solution: '`u-1 7`',
          explanation: 'u.SetID(7) is (&u.Base).SetID(7), setting Base.ID. u.ID refers to User’s own string field.',
        },
        {
          id: 'm06-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Counting writer via embedding',
          story: 'A file-upload service needs to know how many bytes it wrote to S3 without changing the uploader.',
          prompt: 'Write `type CountingWriter struct { io.Writer; N int64 }` that overrides Write to count bytes and delegates to the embedded writer. Use it with `io.Copy`.',
          hints: ['Embed the interface; define `func (c *CountingWriter) Write(p []byte) (int, error)`.', 'Call `c.Writer.Write(p)` and add the returned n (not len(p)).'],
          solution: `type CountingWriter struct {
	io.Writer
	N int64
}

func (c *CountingWriter) Write(p []byte) (int, error) {
	n, err := c.Writer.Write(p)
	c.N += int64(n)
	return n, err
}

// usage:
// cw := &CountingWriter{Writer: os.Stdout}
// _, _ = io.Copy(cw, strings.NewReader("hello"))
// fmt.Println(cw.N) // 5`,
          explanation: 'Embedding an interface gives the struct the whole method set; overriding Write intercepts just that method. Count n, because short writes are possible.',
          complexity: { time: 'O(bytes)', space: 'O(1)' },
          variation: 'Write a `LimitedWriter` that returns an error once more than Max bytes are written.',
        },
        {
          id: 'm06-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'The copied mutex',
          prompt: 'Why does `go vet` complain, and what race does it hide?',
          code: `type Counter struct {
	sync.Mutex
	n int
}

func (c Counter) Inc() {
	c.Lock()
	c.n++
	c.Unlock()
}`,
          hints: ['Value receiver = copy of the whole struct, including the mutex.'],
          solution: 'vet: "Inc passes lock by value: Counter contains sync.Mutex". The value receiver copies the Counter, so each call locks its OWN copy of the mutex and increments a copy of n — the original never changes, and the lock protects nothing.\n\nFix: pointer receiver `func (c *Counter) Inc()`; also prefer an unexported named field `mu sync.Mutex` instead of embedding, so Lock/Unlock are not part of Counter’s API.',
          explanation: 'Types containing locks must never be copied after first use.',
        },
      ],
    },
  ],
}

export const MODULE_07: Module = {
  id: 'm07',
  number: 7,
  track: 'go',
  title: 'Methods and Interfaces',
  shortTitle: 'Interfaces',
  tagline: 'Value vs pointer receivers, method sets, implicit interfaces, assertions, typed nil, dependency inversion.',
  topics: [
    {
      id: 'm07-t1',
      title: 'Methods, Value vs Pointer Receivers, Method Sets',
      summary: 'Which receiver to pick and why *T satisfies more interfaces than T.',
      concept: [
        'A method is a function with a receiver: `func (a *Account) Deposit(n int)`. Methods can be declared on any named type defined in the same package.',
        'Value receiver `(t T)` works on a copy; pointer receiver `(t *T)` can mutate and avoids copying. Go auto-takes `&v` for addressable values when calling pointer methods, and auto-dereferences pointers for value methods.',
        'Method sets: the method set of T contains only value-receiver methods; the method set of *T contains both. Interface satisfaction uses method sets — so if any method has a pointer receiver, only *T implements the interface.',
        'Rule of thumb: if any method needs a pointer receiver, make all of them pointer receivers for consistency.',
      ],
      why: 'Explicit receiver choice makes mutation and copying visible at the declaration site.',
      whenToUse: ['Pointer receivers: mutation, large structs, types with locks', 'Value receivers: small immutable types (time.Time, Point)'],
      whenNotToUse: ['Mixing receiver kinds on one type without reason.', 'Value receivers on types containing a mutex.'],
      syntax: `type Counter struct{ n int }
func (c *Counter) Inc()       { c.n++ }
func (c Counter) Value() int  { return c.n }

var c Counter
c.Inc()          // (&c).Inc()
p := &c
p.Value()        // (*p).Value()`,
      example: {
        code: `package main

import "fmt"

type Shape interface{ Area() float64 }

type Square struct{ S float64 }

func (q *Square) Area() float64 { return q.S * q.S }

func main() {
	q := Square{3}
	fmt.Println(q.Area())
	var s Shape = &q
	fmt.Println(s.Area())
	// var t Shape = q // compile error: Square does not implement Shape (method Area has pointer receiver)
}`,
        output: `9
9`,
        notes: ['`q.Area()` works because q is addressable — Go rewrites it to (&q).Area().', 'Only *Square is in the method set that includes Area, so only &q satisfies Shape.'],
      },
      mistakes: ['Assigning a T to an interface when methods are on *T.', 'Calling a pointer method on a non-addressable value: `Square{3}.Area()` or `m["k"].Area()` → compile error.', 'Value receiver methods that try to mutate.'],
      problems: [
        {
          id: 'm07-t1-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'Value receiver mutation',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

type Cart struct{ Items int }

func (c Cart) AddValue()    { c.Items++ }
func (c *Cart) AddPointer() { c.Items++ }

func main() {
	c := Cart{}
	c.AddValue()
	c.AddPointer()
	p := &c
	p.AddValue()
	p.AddPointer()
	fmt.Println(c.Items)
}`,
          check: { options: ['2', '4', '0', '3'], answerIndex: 0 },
          hints: ['Only pointer-receiver calls change c, whether called on c or p.'],
          solution: '`2`',
          explanation: 'AddValue always operates on a copy, even through p (Go dereferences p and copies). The two AddPointer calls each increment c.',
        },
        {
          id: 'm07-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Money type with methods',
          story: 'An e-commerce checkout keeps mixing rupees and paise.',
          prompt: 'Define `type Money int64` (paise). Add value-receiver methods `Add(Money) Money`, `MulPercent(p int) Money` (rounded half-up), and `String() string` that prints "₹12.34". Why are value receivers right here?',
          hints: ['Money is a small immutable value — return new values instead of mutating.', 'Half-up rounding for positive values: (m*p + 50) / 100.'],
          solution: `type Money int64

func (m Money) Add(o Money) Money       { return m + o }
func (m Money) MulPercent(p int) Money  { return (m*Money(p) + 50) / 100 }
func (m Money) String() string {
	sign := ""
	if m < 0 {
		sign, m = "-", -m
	}
	return fmt.Sprintf("%s₹%d.%02d", sign, m/100, m%100)
}`,
          explanation: 'Small value types behave like numbers: copies are cheap and immutability prevents aliasing bugs. Implementing String() makes fmt print it nicely (fmt.Stringer).',
          complexity: { time: 'O(1)', space: 'O(1)' },
          variation: 'Add banker’s rounding (half-to-even) and handle negative amounts correctly in MulPercent.',
        },
        {
          id: 'm07-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Does not implement',
          prompt: 'Explain the compile error and give two fixes. Which is better?',
          code: `type Notifier interface{ Notify(msg string) error }

type Email struct{ sent int }

func (e *Email) Notify(msg string) error { e.sent++; return nil }

func broadcast(ns []Notifier, msg string) {}

func main() {
	broadcast([]Notifier{Email{}}, "hi")
}`,
          hints: ['Method set of Email vs *Email.'],
          solution: 'Error: `Email does not implement Notifier (method Notify has pointer receiver)`. The method set of the value type Email does not include Notify.\n\nFix 1 (better): pass a pointer `[]Notifier{&Email{}}` — Notify mutates `sent`, so it must use a pointer and the stored value must be a pointer.\n\nFix 2: change to a value receiver — compiles, but `sent++` would modify a copy and be lost.',
          explanation: 'Interface values store a copy of what you put in them; storing a T would make pointer methods unable to mutate the original, so Go forbids it.',
        },
      ],
    },
    {
      id: 'm07-t2',
      title: 'Interfaces, any, Type Assertions and Composition',
      summary: 'Implicit satisfaction, small interfaces, comma-ok assertions, embedding interfaces.',
      concept: [
        'An interface type lists method signatures. Any type with those methods satisfies it implicitly — no `implements` keyword. This lets you define interfaces in the CONSUMER package.',
        'An interface value is a pair (dynamic type, dynamic value). `any` (= `interface{}`) is satisfied by every type.',
        'Type assertion `v := x.(T)` panics if x does not hold a T; `v, ok := x.(T)` returns ok=false instead. T can also be another interface ("does it also implement io.Closer?").',
        'Interfaces compose by embedding: `type ReadWriter interface { Reader; Writer }`. Prefer small interfaces (1–3 methods): io.Reader, fmt.Stringer, error.',
      ],
      why: 'Implicit, small interfaces decouple packages: code depends on behaviour, not concrete types, and tests can substitute fakes trivially.',
      whenToUse: ['Accepting behaviour (io.Reader) in function parameters', 'Plugging in fakes for tests', 'Optional capability checks via assertion'],
      whenNotToUse: ['Defining an interface before you have two implementations ("interface pollution").', 'Returning interfaces from constructors — "accept interfaces, return structs".', '`any` where generics or a concrete type would do.'],
      syntax: `type Store interface {
	Get(id string) (Item, error)
	Put(it Item) error
}

var r io.Reader = os.Stdin
if c, ok := r.(io.Closer); ok {
	defer c.Close()
}`,
      example: {
        code: `package main

import (
	"fmt"
	"strings"
)

type Stringer interface{ String() string }

type ID int

func (i ID) String() string { return fmt.Sprintf("ID-%04d", int(i)) }

func describe(v any) string {
	if s, ok := v.(Stringer); ok {
		return s.String()
	}
	return strings.ToUpper(fmt.Sprint(v))
}

func main() {
	fmt.Println(describe(ID(7)), describe("abc"), describe(3.5))
}`,
        output: `ID-0007 ABC 3.5`,
        notes: ['ID implements Stringer implicitly.', 'The comma-ok assertion to an interface type checks capability at runtime.', 'Non-Stringers fall back to fmt.Sprint.'],
      },
      mistakes: ['Single-value assertion `x.(T)` on untrusted data → panic.', 'Huge interfaces that no second type will ever implement.', 'Asserting to a concrete type when you should be asserting to a behaviour.'],
      problems: [
        {
          id: 'm07-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'Assertions that panic',
          prompt: 'Which line panics?',
          code: `var x any = "42"
a, ok := x.(int)     // line 1
b := x.(string)      // line 2
c, ok2 := x.(fmt.Stringer) // line 3
d := x.(int)         // line 4`,
          check: { options: ['line 4', 'line 1', 'line 3', 'none'], answerIndex: 0 },
          hints: ['Only the single-result form panics on failure.', 'Does string have a String() method?'],
          solution: 'Line 4 panics: `interface conversion: interface {} is string, not int`.',
          explanation: 'Line 1: a=0, ok=false. Line 2: b="42". Line 3: string has no methods → c=nil, ok2=false. Line 4: single-value assertion to the wrong type panics.',
        },
        {
          id: 'm07-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Pluggable payment gateways',
          story: 'A booking system must support Razorpay today and Stripe tomorrow without touching checkout logic.',
          prompt: 'Define `type PaymentGateway interface { Charge(ctx context.Context, userID string, amount int64) (txID string, err error) }`. Write a `Checkout` struct that depends on the interface, and a `FakeGateway` for tests that records calls and can be configured to fail.',
          hints: ['Checkout holds `gw PaymentGateway` injected through `NewCheckout(gw PaymentGateway)`.', 'FakeGateway: `Calls []int64; Err error`.'],
          solution: `type PaymentGateway interface {
	Charge(ctx context.Context, userID string, amount int64) (string, error)
}

type Checkout struct{ gw PaymentGateway }

func NewCheckout(gw PaymentGateway) *Checkout { return &Checkout{gw: gw} }

func (c *Checkout) Pay(ctx context.Context, userID string, amount int64) (string, error) {
	if amount <= 0 {
		return "", errors.New("invalid amount")
	}
	tx, err := c.gw.Charge(ctx, userID, amount)
	if err != nil {
		return "", fmt.Errorf("charge %s: %w", userID, err)
	}
	return tx, nil
}

type FakeGateway struct {
	Calls []int64
	Err   error
}

func (f *FakeGateway) Charge(_ context.Context, _ string, amount int64) (string, error) {
	f.Calls = append(f.Calls, amount)
	if f.Err != nil {
		return "", f.Err
	}
	return fmt.Sprintf("tx-%d", len(f.Calls)), nil
}`,
          explanation: 'Checkout depends on behaviour; Razorpay/Stripe adapters and the fake all satisfy the interface implicitly. This is dependency inversion in Go.',
          complexity: { time: 'O(1) per call', space: 'O(calls) in the fake' },
          variation: 'Add a `RetryingGateway` decorator that wraps any PaymentGateway and retries on a sentinel `ErrTemporary` with backoff.',
        },
        {
          id: 'm07-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Compile-time interface checks',
          prompt: 'What does `var _ PaymentGateway = (*StripeGateway)(nil)` do, and why do libraries write it?',
          hints: ['It allocates nothing at runtime.'],
          solution: 'It is a compile-time assertion that *StripeGateway implements PaymentGateway. Converting nil to *StripeGateway costs nothing and `_` discards it. If someone changes a method signature, the build fails at this line with a clear message instead of somewhere far away (or never, if no code assigns it yet).',
          explanation: 'Implicit interfaces have no declaration site; this idiom recreates one when you want it.',
        },
      ],
    },
    {
      id: 'm07-t3',
      title: 'Nil Interfaces, Typed nil and Dependency Inversion',
      summary: 'Why an interface holding a nil pointer is not nil.',
      concept: [
        'An interface value is nil only when BOTH its type and value are nil. Storing a nil *T in an interface gives (type=*T, value=nil), which is != nil.',
        'The classic bug: a function returns a typed nil pointer as an `error`; the caller’s `err != nil` is true.',
        'Methods with pointer receivers can be called on nil pointers (the receiver is just nil), which is how some types make nil useful.',
        'Dependency inversion: high-level code defines the interface it needs; low-level code implements it. In Go, define interfaces where they are used, keep them small, and pass dependencies explicitly (constructor injection).',
      ],
      why: 'Understanding the (type, value) pair explains a whole family of "impossible" nil bugs.',
      whenToUse: ['Return literal `nil` for errors', 'Nil-receiver-safe methods for optional components (e.g. a nil *Logger that discards)'],
      whenNotToUse: ['Returning a concrete error pointer type from functions — return `error`.'],
      syntax: `var p *MyErr = nil
var err error = p
fmt.Println(p == nil, err == nil) // true false`,
      example: {
        code: `package main

import "fmt"

type MyErr struct{}

func (*MyErr) Error() string { return "boom" }

func mayFail(fail bool) error {
	var e *MyErr
	if fail {
		e = &MyErr{}
	}
	return e
}

func main() {
	err := mayFail(false)
	fmt.Println(err == nil)
	fmt.Printf("%T %v\\n", err, err)
}`,
        output: `false
*main.MyErr boom`,
        notes: ['e is a nil *MyErr, but returning it as `error` yields a non-nil interface (type *MyErr).', 'Printing calls Error() on the nil pointer — it works because Error does not dereference.', 'Fix: `if fail { return &MyErr{} }; return nil`.'],
      },
      mistakes: ['Returning a typed nil as error.', 'Checking `if x == nil` on an interface that wraps a nil pointer.', 'Defining interfaces in the producer package "just in case".'],
      problems: [
        {
          id: 'm07-t3-p1',
          tier: 'foundation',
          level: 3,
          kind: 'predict',
          title: 'The brief’s typed-nil question',
          prompt: 'What does this print, and why?',
          code: `package main

import "fmt"

type User struct{}

func main() {
	var x interface{} = (*User)(nil)
	fmt.Println(x == nil)
	var u *User
	fmt.Println(u == nil)
}`,
          check: { options: ['false\ntrue', 'true\ntrue', 'false\nfalse', 'compile error'], answerIndex: 0 },
          hints: ['An interface is nil only if its dynamic TYPE is also nil.'],
          solution: '```text\nfalse\ntrue\n```',
          explanation: 'x holds (type *User, value nil) — the type slot is set, so x != nil. u is a plain pointer, which is nil.',
        },
        {
          id: 'm07-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'debug',
          title: 'Validation that always fails',
          story: 'Every signup returns "validation failed" even with perfect input.',
          prompt: 'Find the bug and fix it.',
          code: `type ValidationError struct{ Field string }

func (v *ValidationError) Error() string { return v.Field + " invalid" }

func validate(email string) *ValidationError {
	if !strings.Contains(email, "@") {
		return &ValidationError{"email"}
	}
	return nil
}

func Signup(email string) error {
	err := validate(email)
	return err
}

// caller: if err := Signup("a@b.c"); err != nil { log.Fatal("validation failed") }`,
          hints: ['What is the static type of err inside Signup?'],
          solution: '`validate` returns a nil `*ValidationError`; `Signup` returns it as `error`, producing a non-nil interface with a nil pointer inside.\n\nFix: return the `error` interface from validate, or convert explicitly:\n\n```go\nfunc validate(email string) error {\n\tif !strings.Contains(email, "@") {\n\t\treturn &ValidationError{"email"}\n\t}\n\treturn nil\n}\n```',
          explanation: 'Functions should declare `error` as their result type, never a concrete error pointer.',
        },
        {
          id: 'm07-t3-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Invert the database dependency',
          story: 'An order service calls `postgres.InsertOrder` directly; unit tests need a real database and take 4 minutes.',
          prompt: 'Refactor: define a minimal `OrderRepo` interface IN the service package, have `OrderService` depend on it, write an in-memory implementation for tests, and show a test that runs without a DB. Use `errors.Is` for a sentinel `ErrDuplicate`.',
          hints: ['Interface: `Save(ctx, Order) error` and `ByID(ctx, id) (Order, error)` — only what the service uses.', 'In-memory repo: map + mutex.'],
          solution: `package order

var ErrDuplicate = errors.New("duplicate order")
var ErrNotFound = errors.New("order not found")

type Order struct {
	ID     string
	Amount int64
}

type OrderRepo interface {
	Save(ctx context.Context, o Order) error
	ByID(ctx context.Context, id string) (Order, error)
}

type Service struct{ repo OrderRepo }

func NewService(r OrderRepo) *Service { return &Service{repo: r} }

func (s *Service) Place(ctx context.Context, o Order) error {
	if o.Amount <= 0 {
		return errors.New("amount must be positive")
	}
	if err := s.repo.Save(ctx, o); err != nil {
		return fmt.Errorf("place %s: %w", o.ID, err)
	}
	return nil
}

type MemRepo struct {
	mu     sync.Mutex
	orders map[string]Order
}

func NewMemRepo() *MemRepo { return &MemRepo{orders: map[string]Order{}} }

func (m *MemRepo) Save(_ context.Context, o Order) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, ok := m.orders[o.ID]; ok {
		return ErrDuplicate
	}
	m.orders[o.ID] = o
	return nil
}

func (m *MemRepo) ByID(_ context.Context, id string) (Order, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	o, ok := m.orders[id]
	if !ok {
		return Order{}, ErrNotFound
	}
	return o, nil
}

// order_test.go
func TestPlaceDuplicate(t *testing.T) {
	s := NewService(NewMemRepo())
	ctx := context.Background()
	if err := s.Place(ctx, Order{"o1", 100}); err != nil {
		t.Fatal(err)
	}
	if err := s.Place(ctx, Order{"o1", 100}); !errors.Is(err, ErrDuplicate) {
		t.Fatalf("want ErrDuplicate, got %v", err)
	}
}`,
          explanation: 'The service owns the abstraction it needs; Postgres and memory implementations depend on it. %w wrapping keeps sentinel errors detectable across layers.',
          complexity: { time: 'O(1) average per op', space: 'O(orders)' },
          variation: 'Add a Postgres implementation that maps the unique-violation error code 23505 to ErrDuplicate.',
        },
      ],
    },
  ],
}
