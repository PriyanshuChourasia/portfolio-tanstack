import type { Module } from '../types'

export const MODULE_01: Module = {
  id: 'm01',
  number: 1,
  track: 'go',
  title: 'Go Fundamentals',
  shortTitle: 'Go Basics',
  tagline: 'Program structure, variables, types, strings, operators and pointers — the ground every other module stands on.',
  topics: [
    {
      id: 'm01-t1',
      title: 'Variables, Constants, Types, Zero Values, Type Inference and Type Conversion',
      summary: 'How Go names, stores and converts values — and why nothing is ever "undefined".',
      concept: [
        'A Go program is a set of packages. An executable lives in `package main` and starts at `func main()`. Every name you use is either declared in the file, imported, or predeclared (like `int`, `len`, `true`).',
        'Variables are declared with `var name Type = value`, `var name = value` (type inferred) or the short form `name := value` (only inside functions). Constants use `const` and are evaluated at compile time; untyped constants such as `const big = 1 << 40` have arbitrary precision until they are used.',
        'Every type has a zero value: `0` for numbers, `false` for bool, `""` for string, and `nil` for pointers, slices, maps, channels, functions and interfaces. Declaring a variable without a value always gives the zero value — Go has no uninitialised memory.',
        'Go never converts between types implicitly. `int` and `int64` are different types; you must write `int64(x)`. Conversions between numeric types can truncate (`int8(300)` wraps) and float → int drops the fraction.',
      ],
      why: 'Explicit types and guaranteed zero values remove a whole class of bugs (uninitialised reads, silent widening/narrowing) and make code readable without an IDE. The trade-off is a little more typing at conversion points.',
      whenToUse: [
        '`:=` for local variables initialised from a value — the idiomatic default inside functions.',
        '`var x T` when you want the zero value explicitly (e.g. `var total int`, `var buf bytes.Buffer`).',
        '`const` for values known at compile time: limits, enum-like iota sequences, unit sizes.',
      ],
      whenNotToUse: [
        '`:=` at package level — it is a compile error; use `var`.',
        '`:=` inside a nested block when you meant to assign to an outer variable — it creates a new, shadowing variable.',
        'Avoid conversions like `int32(len(s))` scattered everywhere; pick one type for a quantity and keep it.',
      ],
      syntax: `package main

import "fmt"

const MaxUsers = 100          // untyped constant
const Pi float64 = 3.14159    // typed constant

var debug bool                // package-level, zero value false

func main() {
	var count int             // zero value 0
	name := "gopher"          // inferred string
	var ratio = 0.75          // inferred float64
	x, y := 1, 2              // multiple
	f := float64(x) / 2       // explicit conversion
	fmt.Println(count, name, ratio, x, y, f, debug, MaxUsers)
}`,
      example: {
        code: `package main

import "fmt"

type Celsius float64

const (
	KB = 1 << (10 * (iota + 1)) // 1024
	MB                          // 1048576
)

func main() {
	var s string
	var p *int
	var m map[string]int
	fmt.Printf("%q %v %v\\n", s, p, m == nil)

	temp := Celsius(36.6)
	var raw float64 = float64(temp)
	fmt.Println(temp, raw, KB, MB)

	big, f := 300, 3.99
	fmt.Println(int8(big), int(f))
}`,
        output: `"" <nil> true
36.6 36.6 1024 1048576
44 3`,
        notes: [
          '`type Celsius float64` defines a NEW type; Celsius and float64 need explicit conversion.',
          '`iota` starts at 0 in each const block; repeated lines reuse the expression, so MB is 1 << 20.',
          'Zero values: string "" (printed quoted with %q), pointer <nil>, map nil (reading is safe, writing panics).',
          '`int8(300)` keeps only the low 8 bits: 300 − 256 = 44. Conversion of a *variable* wraps silently; `int8(300)` on a constant would be a compile error.',
          '`int(f)` truncates toward zero → 3. It never rounds. (`int(3.99)` on a constant does not compile: "constant truncated to integer".)',
        ],
      },
      mistakes: [
        'Unused local variables and unused imports are compile errors, not warnings.',
        'Shadowing with `:=` in an `if`/`for` block — the outer variable is never updated.',
        'Mixing `int` and `float64` in arithmetic without conversion → compile error "mismatched types".',
        'Assuming `int` is 32-bit: it is 64-bit on 64-bit platforms.',
      ],
      problems: [
        {
          id: 'm01-t1-p1',
          tier: 'foundation',
          level: 0,
          kind: 'predict',
          title: 'Zero values and inference',
          prompt: 'What does this program print? Explain each value.',
          code: `package main

import "fmt"

func main() {
	var a int
	var b float64
	var c string
	var d bool
	var e []int
	f := 10 / 4
	g := 10 / 4.0
	fmt.Println(a, b, c == "", d, e == nil, f, g)
}`,
          check: {
            options: ['0 0 true false true 2 2.5', '0 0.0 true false false 2.5 2.5', '0 0 false false true 2 2.5', 'compile error: unused variables'],
            answerIndex: 0,
          },
          hints: [
            'Every declared-but-unassigned variable gets its type’s zero value.',
            'Look at the types of the operands in `10 / 4` vs `10 / 4.0`. Untyped constants take a default type.',
          ],
          solution: '`0 0 true false true 2 2.5`',
          explanation:
            'Zero values: int 0, float64 0 (Println prints `0`, not `0.0`), string "", bool false, slice nil. `10 / 4` is integer division of two untyped integer constants → 2. In `10 / 4.0` one operand is a floating constant so the result is the untyped float 2.5. No variable is unused because all are passed to Println.',
          variation: 'What does `var h = 1 << 62; fmt.Println(h * 4)` print, and why does `const k = 1 << 62; fmt.Println(k * 4)` not compile?',
        },
        {
          id: 'm01-t1-p2',
          tier: 'practical',
          level: 1,
          kind: 'code',
          title: 'Temperature converter with named types',
          story: 'An IoT thermostat reports Celsius; the mobile app shows Fahrenheit. Mixing the two once cost the team a weekend.',
          prompt:
            'Define `type Celsius float64` and `type Fahrenheit float64`. Write `CToF(c Celsius) Fahrenheit` and `FToC(f Fahrenheit) Celsius`. In `main`, convert 100°C and -40°F and print both with 1 decimal place. Then show (in a comment) why `var c Celsius = Fahrenheit(212)` does not compile.',
          code: `package main

import "fmt"

type Celsius float64
type Fahrenheit float64

func CToF(c Celsius) Fahrenheit {
	// TODO
}

func FToC(f Fahrenheit) Celsius {
	// TODO
}

func main() {
	fmt.Printf("%.1f\\n", CToF(100))
	fmt.Printf("%.1f\\n", FToC(-40))
}`,
          hints: [
            'F = C × 9/5 + 32. Careful: `9/5` with integer constants… but here C is a float type, so the constant expression adapts. Still, writing `9.0/5` makes intent obvious.',
            'Return `Fahrenheit(c*9/5 + 32)` — the arithmetic on a Celsius gives a Celsius, so convert the result.',
          ],
          solution: `package main

import "fmt"

type Celsius float64
type Fahrenheit float64

func CToF(c Celsius) Fahrenheit { return Fahrenheit(c*9/5 + 32) }
func FToC(f Fahrenheit) Celsius { return Celsius((f - 32) * 5 / 9) }

func main() {
	fmt.Printf("%.1f\\n", CToF(100)) // 212.0
	fmt.Printf("%.1f\\n", FToC(-40)) // -40.0
	// var c Celsius = Fahrenheit(212) // compile error: cannot use Fahrenheit(212)
	//                                 // (value of type Fahrenheit) as Celsius value
}`,
          explanation:
            'Named types with the same underlying type are still distinct, so the compiler stops you from mixing units. Untyped constants (9, 5, 32) take on the type of the other operand, so `c*9/5 + 32` is a Celsius expression evaluated in floating point — no integer-division trap.',
          complexity: { time: 'O(1)', space: 'O(1)' },
          variation: 'Add a `Kelvin` type and a `String() string` method on each type so `fmt.Println(CToF(100))` prints `212.0°F`.',
        },
        {
          id: 'm01-t1-p3',
          tier: 'interview',
          level: 2,
          kind: 'debug',
          title: 'The variable that never changes',
          story: 'A billing job reports `total: 0` even though the logs show prices being read.',
          prompt: 'What is wrong with this program? Explain the exact rule that causes it and fix it.',
          code: `package main

import "fmt"

func main() {
	prices := []float64{9.99, 20, 5.01}
	total := 0.0
	for _, p := range prices {
		if p > 0 {
			total := total + p
			_ = total
		}
	}
	fmt.Println("total:", total)
}`,
          hints: ['Look closely at the operator used inside the `if` block.', 'A `:=` in an inner block declares a brand-new variable that shadows the outer one.'],
          solution:
            'The line `total := total + p` declares a NEW `total` scoped to the `if` block, initialised from the outer `total` (0) plus p. The outer variable is never assigned, so it prints `total: 0`. The `_ = total` line was added only to silence the "declared and not used" error — a red flag.\n\nFix: use assignment.\n\n```go\nif p > 0 {\n\ttotal += p\n}\n```\n\nPrints `total: 35`.',
          explanation:
            'Go is block-scoped. `:=` always declares at least one new variable in the CURRENT scope. `go vet -vettool=$(which shadow)` (the shadow analyzer) flags this pattern.',
          variation:
            'Predict: `x := 1; if x, err := strconv.Atoi("5"); err == nil { fmt.Println(x) }; fmt.Println(x)` — what prints and why?',
        },
        {
          id: 'm01-t1-p4',
          tier: 'advanced',
          level: 3,
          kind: 'predict',
          title: 'Constants, overflow and iota',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

type Weekday int

const (
	Sunday Weekday = iota
	Monday
	Tuesday
	_
	Thursday
)

func main() {
	var u uint8 = 255
	u++
	var i int8 = -128
	i--
	fmt.Println(Thursday, u, i)
}`,
          check: { options: ['4 0 127', '3 256 -129', '4 256 -129', 'compile error: constant overflow'], answerIndex: 0 },
          hints: ['`_` still consumes an iota value.', 'Arithmetic on typed *variables* wraps around; only constant expressions are checked at compile time.'],
          solution: '`4 0 127`',
          explanation:
            'iota increments per line: Sunday 0, Monday 1, Tuesday 2, _ 3, Thursday 4. `u++` on a uint8 holding 255 wraps to 0. `i--` on int8 −128 wraps to 127. Overflow of variables is defined (two’s complement wrap), never a panic.',
        },
      ],
    },
    {
      id: 'm01-t2',
      title: 'Program Structure, Packages, Imports and the Go Toolchain',
      summary: 'package, import, func main, GOPATH vs modules, and running your first program.',
      concept: [
        'Every .go file starts with `package <name>`. Files in the same directory form one package. `package main` with `func main()` builds an executable; any other name builds a library.',
        'Imports name packages by import path (`"fmt"`, `"net/http"`, `"github.com/x/y"`). You refer to them by package name (`http.Get`). Unused imports do not compile.',
        'Since Go 1.11, code lives in modules: a `go.mod` file declares the module path and dependencies. `go mod init example.com/app` creates it; `go run .` compiles and runs the package in the current directory.',
        '`go env` prints the environment (GOROOT = toolchain location, GOPATH = module cache + installed binaries, GOOS/GOARCH = target platform).',
      ],
      why: 'A single, opinionated layout (one package per directory, explicit imports, built-in toolchain) means any Go repo is navigable and buildable with zero configuration.',
      whenToUse: ['`go run .` while iterating', '`go build` to produce a binary', 'Grouped imports in parentheses, std lib first'],
      whenNotToUse: ['Do not put multiple package names in one directory (except `_test` packages).', 'Avoid dot-imports (`import . "fmt"`) — they hide where names come from.'],
      syntax: `package main

import (
	"fmt"
	"os"
	str "strings" // alias
)

func main() {
	fmt.Println(str.ToUpper("hi"), len(os.Args))
}`,
      example: {
        code: `$ mkdir hello && cd hello
$ go mod init example.com/hello
$ cat > main.go <<'EOF'
package main

import "fmt"

func main() { fmt.Println("hello, gopher") }
EOF
$ go run .
hello, gopher
$ go build -o hello && ./hello`,
        notes: [
          '`go mod init` writes go.mod with the module path and Go version.',
          '`go run .` builds into a temp dir and executes; nothing is left behind.',
          '`go build -o hello` produces a statically linked binary you can ship.',
        ],
      },
      mistakes: [
        'Calling a lowercase function from another package — only Capitalised names are exported.',
        'Leaving an unused import after refactoring (use goimports to manage them).',
        'Running `go run main.go` in a package with several files — use `go run .`.',
      ],
      problems: [
        {
          id: 'm01-t2-p1',
          tier: 'foundation',
          level: 0,
          kind: 'concept',
          title: 'What makes a program runnable?',
          prompt: 'Which of these files can be built into an executable with `go build`?',
          code: `// A
package app
func main() {}

// B
package main
func Main() {}

// C
package main
func main() {}

// D
package main
import "fmt"
func main() {}`,
          check: { options: ['Only C', 'A and C', 'C and D', 'B, C and D'], answerIndex: 0 },
          hints: ['Two requirements: the package name and the exact function name.', 'What happens to an import that is never used?'],
          solution: 'Only **C**.',
          explanation:
            'A is a library (package app). B has `Main`, not `main` — names are case-sensitive. D fails: `"fmt" imported and not used`. C is the minimal valid program.',
        },
        {
          id: 'm01-t2-p2',
          tier: 'practical',
          level: 1,
          kind: 'code',
          title: 'Command-line greeter',
          story: 'Your ops team wants a tiny binary: `greet Alice Bob` prints a greeting per name, or `Hello, world!` with no args.',
          prompt: 'Write `main.go` that reads `os.Args`, greets each name on its own line, and exits with code 0. Use `strings.TrimSpace` to skip blank names.',
          hints: ['`os.Args[0]` is the program name; names start at index 1.', 'Range over `os.Args[1:]`; if it is empty, print the default.'],
          solution: `package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	names := os.Args[1:]
	if len(names) == 0 {
		fmt.Println("Hello, world!")
		return
	}
	for _, name := range names {
		if name = strings.TrimSpace(name); name != "" {
			fmt.Printf("Hello, %s!\\n", name)
		}
	}
}`,
          explanation: 'Slicing `os.Args[1:]` is safe even when only the program name is present (it yields an empty slice). The `if init; cond` form keeps the trimmed value scoped to the check.',
          complexity: { time: 'O(n) over arguments', space: 'O(1) extra' },
          variation: 'Add a `-upper` flag using the `flag` package; flags must come before names.',
        },
        {
          id: 'm01-t2-p3',
          tier: 'interview',
          level: 2,
          kind: 'concept',
          title: 'Exported vs unexported',
          prompt:
            'Package `bank` declares `type account struct{ Balance int }` and `func NewAccount() *account`. From package `main`, can you call `bank.NewAccount()`? Can you read `.Balance`? Can you declare `var a bank.account`? Explain the visibility rule and why returning an unexported type is usually a code smell.',
          hints: ['Visibility is decided per identifier by its first letter.', 'Can you name a type you cannot refer to? Can you still use its exported fields?'],
          solution:
            'Yes, `bank.NewAccount()` is callable (exported). Yes, `.Balance` is readable/writable through the returned pointer because the *field* is exported. No, `var a bank.account` does not compile — `account` cannot be referred to outside `bank`.\n\nIt is a smell because callers cannot name the type in their own signatures (struct fields, function params), so they are forced into `:=`/inference. golint flags "exported func returns unexported type". Return an exported type or an interface instead.',
          explanation: 'An identifier is exported iff it starts with an uppercase Unicode letter. This applies independently to types, fields, methods, functions, constants and variables.',
        },
      ],
    },
    {
      id: 'm01-t3',
      title: 'Strings, Runes and Bytes',
      summary: 'UTF-8 under the hood: len counts bytes, range yields runes.',
      concept: [
        'A Go `string` is an immutable sequence of bytes, conventionally UTF-8. `len(s)` returns the number of BYTES, not characters. `s[i]` is a `byte` (alias for uint8).',
        'A `rune` (alias for int32) is a Unicode code point. `for i, r := range s` decodes UTF-8 and yields the byte offset and the rune. Converting `[]rune(s)` gives you indexable characters.',
        'Strings are immutable: to build one incrementally use `strings.Builder`; to mutate bytes convert to `[]byte` (which copies).',
      ],
      why: 'UTF-8 is the web’s encoding; making strings byte sequences keeps them cheap to slice and pass around while `range` gives correct Unicode iteration when you need it.',
      whenToUse: ['`[]byte` for I/O and in-place byte manipulation', '`[]rune` when you need character indexing (e.g. reversing user text)', '`strings.Builder` for concatenation in loops'],
      whenNotToUse: ['Don’t index `s[i]` expecting a character on non-ASCII text.', 'Don’t `+=` strings in a hot loop — O(n²) copying.'],
      syntax: `s := "héllo"
len(s)              // 6 bytes (é is 2 bytes)
s[1]                // byte 0xC3
[]rune(s)           // 5 runes
for i, r := range s { _ = i; _ = r } // r is rune
b := []byte(s)      // copy, mutable
var sb strings.Builder
sb.WriteString("x")`,
      example: {
        code: `package main

import "fmt"

func main() {
	s := "Go€"
	fmt.Println(len(s), len([]rune(s)))
	for i, r := range s {
		fmt.Printf("%d:%c ", i, r)
	}
	fmt.Println()
	fmt.Println(s[2], string(s[2]))
}`,
        output: `5 3
0:G 1:o 2:€
226 â`,
        notes: [
          '€ is 3 bytes in UTF-8 (E2 82 AC), so len is 5 but there are 3 runes.',
          'range jumps byte offsets 0,1,2 — the next index after € would be 5.',
          '`s[2]` is the first byte of € (226). `string(byte)` interprets 226 as code point U+00E2 → "â". This is why byte indexing breaks on Unicode.',
        ],
      },
      mistakes: [
        '`string(65)` gives "A", not "65" — use `strconv.Itoa`. `go vet` warns about this.',
        'Reversing a string byte-by-byte corrupts multi-byte characters.',
        'Comparing `len(s)` to a character limit for user names in non-English text.',
      ],
      problems: [
        {
          id: 'm01-t3-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Bytes vs runes',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	s := "naïve"
	count := 0
	for range s {
		count++
	}
	fmt.Println(len(s), count, s[2] == 'ï')
}`,
          check: { options: ['6 5 false', '5 5 true', '6 6 false', '5 6 true'], answerIndex: 0 },
          hints: ['How many bytes does ï take in UTF-8?', 'What type is s[2] and what value does it hold?'],
          solution: '`6 5 false`',
          explanation: 'ï (U+00EF) is 2 bytes, so len is 6. range iterates runes → 5. `s[2]` is the byte 0xC3, the first byte of ï, which is not the rune 0xEF.',
        },
        {
          id: 'm01-t3-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Unicode-safe reverse and palindrome',
          story: 'A messaging app shows "palindrome!" badges for usernames — and some users write in Hindi and emoji.',
          prompt: 'Write `Reverse(s string) string` that reverses by runes, and `IsPalindrome(s string) bool` that ignores case and non-letters (use `unicode.IsLetter`, `unicode.ToLower`). "A man, a plan, a canal: Panama" → true.',
          hints: ['Convert to `[]rune`, then swap with two indexes moving toward the middle.', 'For the palindrome, first build a []rune of lowercase letters only, then compare from both ends.'],
          solution: `package main

import (
	"fmt"
	"unicode"
)

func Reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}

func IsPalindrome(s string) bool {
	letters := make([]rune, 0, len(s))
	for _, r := range s {
		if unicode.IsLetter(r) {
			letters = append(letters, unicode.ToLower(r))
		}
	}
	for i, j := 0, len(letters)-1; i < j; i, j = i+1, j-1 {
		if letters[i] != letters[j] {
			return false
		}
	}
	return true
}

func main() {
	fmt.Println(Reverse("Go€👍"))
	fmt.Println(IsPalindrome("A man, a plan, a canal: Panama"))
}`,
          explanation: 'Working on runes keeps multi-byte characters intact. Pre-allocating `letters` with capacity len(s) (bytes ≥ runes) avoids regrowth.',
          complexity: { time: 'O(n)', space: 'O(n) for the rune slice', notes: 'A zero-allocation palindrome check is possible with two byte indexes and utf8.DecodeRuneInString / DecodeLastRuneInString.' },
          variation: 'Make IsPalindrome allocation-free using `utf8.DecodeRuneInString` from the front and `utf8.DecodeLastRuneInString` from the back.',
        },
        {
          id: 'm01-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Fast log-line builder',
          story: 'A logging pipeline joins 100k fields per second with `+=` and the profiler shows `runtime.concatstrings` at the top.',
          prompt: 'Write `JoinFields(fields []string, sep string) string` without using `strings.Join`. It must do at most one allocation for the result. Explain why `+=` in a loop is O(n²).',
          hints: ['Strings are immutable — each `+=` copies everything so far.', 'Compute the total length first, then `sb.Grow(n)` on a strings.Builder.'],
          solution: `func JoinFields(fields []string, sep string) string {
	if len(fields) == 0 {
		return ""
	}
	n := len(sep) * (len(fields) - 1)
	for _, f := range fields {
		n += len(f)
	}
	var sb strings.Builder
	sb.Grow(n)
	sb.WriteString(fields[0])
	for _, f := range fields[1:] {
		sb.WriteString(sep)
		sb.WriteString(f)
	}
	return sb.String()
}`,
          explanation: 'With `+=`, step k copies ~k·L bytes, summing to O(n²). The Builder writes into one pre-sized []byte and `String()` returns it without copying (it uses unsafe internally), so there is exactly one allocation.',
          complexity: { time: 'O(total length)', space: 'O(total length)', notes: 'One heap allocation (Grow). `+=` version: O(n²) time and n allocations.' },
          variation: 'Benchmark both versions with `testing.B` and `b.ReportAllocs()` for 1,000 fields.',
        },
      ],
    },
    {
      id: 'm01-t4',
      title: 'Operators: Arithmetic, Comparison, Logical, Bitwise, Assignment',
      summary: 'Integer division, short-circuiting, &^ and why ++ is a statement.',
      concept: [
        'Arithmetic: `+ - * / %`. Integer division truncates toward zero (−7/2 = −3) and `%` takes the sign of the dividend (−7%2 = −1). Division by a zero *variable* panics at runtime; by a zero *constant* fails to compile.',
        'Comparison `== != < <= > >=` yields an untyped bool. Logical `&& || !` short-circuit: the right side runs only if needed.',
        'Bitwise: `&` AND, `|` OR, `^` XOR (and unary NOT), `&^` AND NOT (bit clear), `<<` `>>` shifts. Assignment forms `+= -= *= /= %= &= |= ^= &^= <<= >>=`.',
        '`x++` and `x--` are statements, not expressions: `y := x++` does not compile, and there is no prefix `++x`.',
      ],
      why: 'Making ++ a statement and forbidding implicit conversions eliminates the classic C puzzles (`i = i++ + ++i`) and sign-extension surprises.',
      whenToUse: ['`&^` to clear flags', '`%` for wrap-around indexes (ring buffers)', 'Short-circuit to guard nil checks: `p != nil && p.ok`'],
      whenNotToUse: ['Don’t rely on `%` for negative numbers to give a positive index — use `((i % n) + n) % n`.', 'Don’t compare floats with `==` after arithmetic.'],
      syntax: `a, b := 7, 2
a / b    // 3
a % b    // 1
-a / b   // -3
a &^ b   // 0111 &^ 0010 = 0101 = 5
1 << 3   // 8
ok := a > b && b != 0`,
      example: {
        code: `package main

import "fmt"

func main() {
	const (
		Read  = 1 << iota // 1
		Write             // 2
		Exec              // 4
	)
	perm := Read | Write | Exec
	perm &^= Write
	fmt.Println(perm, perm&Write != 0, perm&Exec != 0)
	fmt.Println(-7/2, -7%2, 7>>1)
}`,
        output: `5 false true
-3 -1 3`,
        notes: ['Flags as powers of two via `1 << iota`.', '`perm &^= Write` clears the Write bit: 7 &^ 2 = 5.', 'Check a flag with `perm&Flag != 0` — `&` binds tighter than `!=` in Go (unlike C).'],
      },
      mistakes: ['`x = x++` does not compile.', 'Expecting `^x` to mean power — it is bitwise NOT for integers.', 'Shifting by a negative amount panics at runtime.'],
      problems: [
        {
          id: 'm01-t4-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Division and modulo signs',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	fmt.Println(-9/4, -9%4, 9%-4, 1<<4>>2, 6&^3)
}`,
          check: { options: ['-2 -1 1 4 4', '-3 3 -1 4 4', '-2 -1 -1 16 4', '-3 -1 1 4 5'], answerIndex: 0 },
          hints: ['Truncation is toward zero.', 'The sign of % follows the dividend (left operand).'],
          solution: '`-2 -1 1 4 4`',
          explanation: '−9/4 = −2.25 → −2. −9%4: −9 − (−2·4) = −1. 9%−4: 9 − (−2·−4) = 1. 1<<4 = 16, >>2 = 4. 6 &^ 3: 110 &^ 011 = 100 = 4.',
        },
        {
          id: 'm01-t4-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Feature-flag bitmask',
          story: 'A SaaS stores each tenant’s enabled features in a single uint32 column.',
          prompt: 'Declare flags `Billing, Reports, SSO, AuditLog` with iota. Write `Enable(f, flag uint32) uint32`, `Disable`, `Toggle`, `Has(f, flag) bool`, and `Count(f) int` (number of enabled features) without using math/bits.',
          hints: ['Enable = OR, Disable = AND NOT, Toggle = XOR.', 'Count: `f &= f - 1` clears the lowest set bit (Kernighan). Loop until zero.'],
          solution: `const (
	Billing uint32 = 1 << iota
	Reports
	SSO
	AuditLog
)

func Enable(f, flag uint32) uint32  { return f | flag }
func Disable(f, flag uint32) uint32 { return f &^ flag }
func Toggle(f, flag uint32) uint32  { return f ^ flag }
func Has(f, flag uint32) bool       { return f&flag != 0 }

func Count(f uint32) int {
	n := 0
	for f != 0 {
		f &= f - 1
		n++
	}
	return n
}`,
          explanation: '`f - 1` flips the lowest set bit and every bit below it; ANDing removes exactly that bit, so the loop runs once per set bit.',
          complexity: { time: 'O(1) per op; Count is O(set bits) ≤ 32', space: 'O(1)' },
          variation: 'Store per-tenant flags for 10 million tenants: compare a `map[int]uint32` with a `[]uint32` indexed by tenant ID in memory.',
        },
        {
          id: 'm01-t4-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'The ring buffer that panics',
          prompt: 'A ring buffer moves its read index backwards with `idx = (idx - 1) % size`. Under what input does this panic, and how do you fix it?',
          code: `func prev(buf []int, idx int) int {
	idx = (idx - 1) % len(buf)
	return buf[idx]
}`,
          hints: ['What is `(0 - 1) % 5` in Go?', 'Negative indexes panic.'],
          solution: 'When `idx == 0`, `(0-1) % 5 == -1` in Go, so `buf[-1]` panics: index out of range [-1].\n\nFix with a non-negative modulo:\n\n```go\nn := len(buf)\nidx = (idx - 1 + n) % n\n```\n\nor generally `((x % n) + n) % n`. Also guard `len(buf) == 0` (division by zero panic).',
          explanation: 'Go’s `%` is a remainder, not a mathematical modulo: its sign follows the dividend.',
        },
      ],
    },
    {
      id: 'm01-t5',
      title: 'Pointers, Addresses and Dereferencing',
      summary: '&x takes an address, *p reads through it — and Go still passes everything by value.',
      concept: [
        '`&x` yields a pointer `*T` to x. `*p` dereferences it. The zero value of a pointer is `nil`; dereferencing nil panics.',
        'Go passes every argument by VALUE. Passing a pointer copies the pointer, so the callee can modify the pointee but not the caller’s pointer variable.',
        'There is no pointer arithmetic (without `unsafe`). `new(T)` allocates a zeroed T and returns `*T`. Returning a pointer to a local variable is safe: escape analysis moves it to the heap.',
        'Struct fields can be accessed through a pointer without explicit dereferencing: `p.Name` is shorthand for `(*p).Name`.',
      ],
      why: 'Pointers let functions mutate shared state and avoid copying large structs, while the lack of arithmetic and the GC keep them memory-safe.',
      whenToUse: ['A function must modify its argument', 'Large structs passed frequently', 'Representing "optional" values (nil = absent)', 'Types with a mutex or other non-copyable state'],
      whenNotToUse: ['Small values (ints, small structs) — copying is cheaper than an indirection + GC pressure.', 'Slices/maps/channels already reference shared data; `*[]T` is rarely needed.'],
      syntax: `x := 10
p := &x      // p is *int
*p = 20      // x is now 20
q := new(int) // *int pointing to 0
var r *int   // nil
if r != nil { fmt.Println(*r) }`,
      example: {
        code: `package main

import "fmt"

func double(n int)      { n *= 2 }
func doublePtr(n *int)  { *n *= 2 }
func reset(p *int)      { p = nil }

func main() {
	v := 5
	double(v)
	fmt.Println(v)
	doublePtr(&v)
	fmt.Println(v)
	p := &v
	reset(p)
	fmt.Println(p != nil, *p)
}`,
        output: `5
10
true 10`,
        notes: [
          '`double` receives a copy; the caller’s v is untouched.',
          '`doublePtr` writes through the pointer, so v becomes 10.',
          '`reset` sets its LOCAL copy of the pointer to nil; the caller’s p still points to v.',
        ],
      },
      mistakes: ['Dereferencing a nil pointer → `panic: runtime error: invalid memory address or nil pointer dereference`.', 'Taking the address of a loop variable and storing it (pre-Go 1.22 all pointers aliased the same variable).', 'Using `*[]int` or `*map` when the reference-like type already shares data.'],
      problems: [
        {
          id: 'm01-t5-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Pointer to pointer',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	a := 1
	p := &a
	pp := &p
	**pp = 7
	b := *p
	b++
	fmt.Println(a, b, *p == a)
}`,
          check: { options: ['7 8 true', '1 8 false', '7 7 true', '8 8 true'], answerIndex: 0 },
          hints: ['`**pp` follows two pointers and lands on a.', '`b := *p` copies the int value.'],
          solution: '`7 8 true`',
          explanation: '`**pp = 7` writes to a. `b` is an independent copy of 7, incremented to 8. `*p` is a, which is 7.',
        },
        {
          id: 'm01-t5-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Swap and optional config',
          story: 'A config loader must distinguish "timeout not set" from "timeout set to 0".',
          prompt: 'Write `Swap(a, b *int)`. Then write `type Config struct{ Timeout *int }` and `EffectiveTimeout(c Config, def int) int` that returns def when Timeout is unset. Finally write a generic helper `Ptr[T any](v T) *T` so you can write `Config{Timeout: Ptr(0)}`.',
          hints: ['Swap: `*a, *b = *b, *a`.', '`Ptr` just returns `&v` — v escapes to the heap, which is fine.'],
          solution: `func Swap(a, b *int) { *a, *b = *b, *a }

type Config struct{ Timeout *int }

func EffectiveTimeout(c Config, def int) int {
	if c.Timeout == nil {
		return def
	}
	return *c.Timeout
}

func Ptr[T any](v T) *T { return &v }

// EffectiveTimeout(Config{}, 30)             == 30
// EffectiveTimeout(Config{Timeout: Ptr(0)}, 30) == 0`,
          explanation: 'A nil pointer encodes "absent"; a pointer to 0 encodes "explicitly zero". This is the standard pattern for optional fields in JSON/protobuf structs.',
          complexity: { time: 'O(1)', space: 'O(1); Ptr allocates one value on the heap' },
          variation: 'Swap two `*Node` pointers in a linked list given `**Node` (pointer to the next field). Why does that need a double pointer?',
        },
        {
          id: 'm01-t5-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Nil pointer in the account service',
          prompt: 'This compiles but crashes. Why, and what are two idiomatic fixes?',
          code: `type Account struct{ Balance int }

func find(id int) *Account {
	if id == 1 {
		return &Account{Balance: 100}
	}
	return nil
}

func main() {
	acc := find(2)
	acc.Balance += 50
	fmt.Println(acc.Balance)
}`,
          hints: ['What does find(2) return?', 'What does `acc.Balance` do when acc is nil?'],
          solution: '`find(2)` returns nil; `acc.Balance` dereferences it → nil pointer dereference panic.\n\nFix 1 — comma-ok/error return:\n\n```go\nfunc find(id int) (*Account, error) {\n\tif id == 1 { return &Account{Balance: 100}, nil }\n\treturn nil, fmt.Errorf("account %d: %w", id, ErrNotFound)\n}\n```\n\nFix 2 — check before use: `if acc == nil { ... }`. Returning an error is preferred: it forces the caller to handle absence.',
          explanation: 'Go has no null-safety in the type system; the convention `(T, error)` or `(T, bool)` makes absence explicit.',
        },
      ],
    },
  ],
}

export const MODULE_02: Module = {
  id: 'm02',
  number: 2,
  track: 'go',
  title: 'Control Flow',
  shortTitle: 'Control Flow',
  tagline: 'if/else, switch (expression and type), fallthrough, for in all its forms, range, break/continue, labels and goto.',
  topics: [
    {
      id: 'm02-t1',
      title: 'if / else and switch (expression, type, fallthrough)',
      summary: 'Init statements, switch with no condition, type switches and why fallthrough is rare.',
      concept: [
        '`if` takes an optional init statement: `if v, err := f(); err != nil { ... }`. Variables declared there are scoped to the whole if/else chain.',
        '`switch` evaluates cases top to bottom and stops at the first match — there is NO implicit fallthrough. A case can list values: `case 1, 2, 3:`. `switch { case x > 0: ... }` (no tag) is a clean if/else-if chain.',
        '`fallthrough` transfers control to the NEXT case body unconditionally (without testing its condition). It must be the last statement in a case and is not allowed in type switches.',
        'A type switch `switch v := x.(type) { case int: ... case string: ... }` branches on the dynamic type of an interface; v has that type inside each single-type case.',
      ],
      why: 'No implicit fallthrough removes the most common C switch bug; tagless switch and init statements keep error handling and branching compact.',
      whenToUse: ['Tagless switch for 3+ conditions', 'Type switch to handle several concrete types behind an interface', 'if-init to scope `err` tightly'],
      whenNotToUse: ['`fallthrough` almost never — list values in one case instead.', 'Type switches as a replacement for a well-designed interface method.'],
      syntax: `if n := len(s); n == 0 {
	return
} else if n > 10 {
	s = s[:10]
}

switch day {
case "sat", "sun":
	weekend()
default:
	work()
}

switch v := x.(type) {
case int:    fmt.Println(v + 1)
case string: fmt.Println(len(v))
case nil:    fmt.Println("nil")
}`,
      example: {
        code: `package main

import "fmt"

func grade(score int) string {
	switch {
	case score >= 90:
		return "A"
	case score >= 75:
		return "B"
	default:
		return "C"
	}
}

func main() {
	switch n := 2; n {
	case 1:
		fmt.Println("one")
	case 2:
		fmt.Println("two")
		fallthrough
	case 3:
		fmt.Println("three")
	case 4:
		fmt.Println("four")
	}
	fmt.Println(grade(80))
}`,
        output: `two
three
B`,
        notes: ['Case 2 matches and prints "two".', '`fallthrough` jumps into case 3’s body without checking `n == 3`.', 'Case 4 is not reached: fallthrough moves only one case.'],
      },
      mistakes: ['Expecting C-style fallthrough and duplicating code across cases.', '`break` inside a switch inside a for loop breaks the switch, not the loop — use a label.', 'Declaring `err` in the if-init and then using it after the if block.'],
      problems: [
        {
          id: 'm02-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'fallthrough chain',
          prompt: 'What does this print?',
          code: `package main

import "fmt"

func main() {
	x := 5
	switch {
	case x > 3:
		fmt.Print("a")
		fallthrough
	case x > 10:
		fmt.Print("b")
	case x > 1:
		fmt.Print("c")
	default:
		fmt.Print("d")
	}
}`,
          check: { options: ['ab', 'ac', 'abc', 'a'], answerIndex: 0 },
          hints: ['fallthrough does NOT evaluate the next case’s condition.'],
          solution: '`ab`',
          explanation: 'x > 3 matches → "a". fallthrough runs case `x > 10`’s body unconditionally → "b". There is no further fallthrough, so the switch ends.',
        },
        {
          id: 'm02-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'HTTP status classifier',
          story: 'A monitoring dashboard colours API responses: 2xx green, 3xx blue, 4xx amber, 5xx red; 429 and 503 should page the on-call.',
          prompt: 'Write `Classify(code int) (class string, page bool)` using a tagless switch for the class and a value switch for paging. Invalid codes (<100 or >599) return "invalid", false.',
          hints: ['One switch on ranges, a second `switch code { case 429, 503: page = true }`.', 'Named results make the second switch easy to write.'],
          solution: `func Classify(code int) (class string, page bool) {
	switch {
	case code < 100 || code > 599:
		return "invalid", false
	case code < 300:
		class = "green"
	case code < 400:
		class = "blue"
	case code < 500:
		class = "amber"
	default:
		class = "red"
	}
	switch code {
	case 429, 503:
		page = true
	}
	return class, page
}`,
          explanation: 'Cases are evaluated in order, so each range only needs its upper bound. Multi-value cases replace fallthrough.',
          complexity: { time: 'O(1)', space: 'O(1)' },
          variation: '1xx should be "grey". Refactor so the ranges come from a table (`[]struct{max int; class string}`) — when is a table better than a switch?',
        },
        {
          id: 'm02-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Event payload router with a type switch',
          story: 'A webhook consumer receives `any` payloads: `OrderCreated`, `OrderCancelled`, `*Refund`, `string` (raw), or nil.',
          prompt: 'Write `Route(evt any) string` returning "create:<id>", "cancel:<id>", "refund:<amount>", "raw:<len>", "empty" for nil, and "unknown:<%T>" otherwise. Explain why `case OrderCreated, OrderCancelled:` would make `v` an `any` inside that case.',
          code: `type OrderCreated struct{ ID string }
type OrderCancelled struct{ ID string }
type Refund struct{ Amount int }`,
          hints: ['Use `switch v := evt.(type)`.', 'nil is its own case: `case nil:`. Use `%T` for the unknown type name.'],
          solution: `func Route(evt any) string {
	switch v := evt.(type) {
	case nil:
		return "empty"
	case OrderCreated:
		return "create:" + v.ID
	case OrderCancelled:
		return "cancel:" + v.ID
	case *Refund:
		return fmt.Sprintf("refund:%d", v.Amount)
	case string:
		return fmt.Sprintf("raw:%d", len(v))
	default:
		return fmt.Sprintf("unknown:%T", v)
	}
}`,
          explanation: 'In a single-type case v has that concrete type. In a multi-type case the compiler cannot pick one type, so v keeps the interface type (`any`). `*Refund` and `Refund` are different types — a `Refund` value would hit default.',
          complexity: { time: 'O(1)', space: 'O(1)' },
          variation: 'Replace the type switch with an `Event` interface (`Route() string`). Discuss open/closed trade-offs.',
        },
      ],
    },
    {
      id: 'm02-t2',
      title: 'for, range, break, continue, labels and goto',
      summary: 'Go’s only loop keyword, what range copies, and how to break out of nested loops.',
      concept: [
        '`for` is the only loop: `for i := 0; i < n; i++ {}` (C-style), `for cond {}` (while), `for {}` (infinite), `for i, v := range x {}`, and since Go 1.22 `for i := range 10 {}`.',
        '`range` over a slice/array yields index and a COPY of the element; over a string yields byte index and rune; over a map yields key and value in random order; over a channel yields values until it is closed.',
        'Since Go 1.22 each iteration has its own loop variable, so closures and `&v` capture per-iteration values. Before 1.22 the variable was shared.',
        '`break`/`continue` affect the innermost for/switch/select. A label (`outer:`) lets you `break outer` or `continue outer`. `goto` jumps to a label in the same function; it cannot jump over variable declarations or into blocks.',
      ],
      why: 'One loop keyword with a few forms keeps the language small; labelled break replaces most uses of flags and goto.',
      whenToUse: ['range for collections', 'labelled break for nested search', '`for {}` with select for event loops'],
      whenNotToUse: ['Modifying `v` from range expecting the slice to change — use `s[i]`.', '`goto` for normal control flow; it is mostly for generated code.'],
      syntax: `for i := 0; i < 3; i++ {}
for n > 0 { n-- }
for { break }
for i, v := range []string{"a"} { _, _ = i, v }
for k, v := range m {}
for i := range 5 {} // Go 1.22+

outer:
for _, row := range grid {
	for _, c := range row {
		if c == target { break outer }
	}
}`,
      example: {
        code: `package main

import "fmt"

type Item struct{ Qty int }

func main() {
	items := []Item{{1}, {2}}
	for _, it := range items {
		it.Qty *= 10
	}
	fmt.Println(items)
	for i := range items {
		items[i].Qty *= 10
	}
	fmt.Println(items)
}`,
        output: `[{1} {2}]
[{10} {20}]`,
        notes: ['`it` is a copy of each element; changing it does nothing to the slice.', 'Index into the slice to modify in place.'],
      },
      mistakes: ['Modifying the range copy.', 'Appending to a slice while ranging over it (range evaluates the slice once — new elements are not visited).', 'Plain `break` inside `select`/`switch` within a loop only exits the select/switch.'],
      problems: [
        {
          id: 'm02-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Range over a growing slice',
          prompt: 'Does this loop forever? What does it print?',
          code: `package main

import "fmt"

func main() {
	s := []int{1, 2, 3}
	for _, v := range s {
		s = append(s, v*10)
	}
	fmt.Println(len(s), s)
}`,
          check: { options: ['6 [1 2 3 10 20 30]', 'infinite loop', '3 [1 2 3]', '4 [1 2 3 10]'], answerIndex: 0 },
          hints: ['The range expression is evaluated once, before the loop starts.'],
          solution: '`6 [1 2 3 10 20 30]`',
          explanation: 'range captures the slice header (len 3) at the start, so it iterates exactly 3 times even though s grows.',
        },
        {
          id: 'm02-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Find the first faulty sensor in a grid',
          story: 'A warehouse has a grid of temperature sensors. The first one reading above a threshold triggers an alarm — stop scanning immediately.',
          prompt: 'Write `FirstHot(grid [][]float64, limit float64) (row, col int, ok bool)` using a labelled break (not a helper function, not a flag variable).',
          hints: ['Declare `row, col = -1, -1` and label the outer loop.', '`break scan` exits both loops; `ok` can be set just before.'],
          solution: `func FirstHot(grid [][]float64, limit float64) (row, col int, ok bool) {
	row, col = -1, -1
scan:
	for r, line := range grid {
		for c, t := range line {
			if t > limit {
				row, col, ok = r, c, true
				break scan
			}
		}
	}
	return row, col, ok
}`,
          explanation: 'A labelled break exits the named loop directly. (In real code a helper that `return`s is often clearer — know both.)',
          complexity: { time: 'O(R·C) worst case', space: 'O(1)' },
          variation: 'Return ALL hot sensors but skip the rest of a row once 3 hot sensors are found in it (use `continue outer`).',
        },
        {
          id: 'm02-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'The loop that never exits',
          prompt: 'A worker loop should stop on a "quit" message, but it never stops. Why? Fix it two ways.',
          code: `func run(msgs <-chan string) {
	for {
		select {
		case m := <-msgs:
			if m == "quit" {
				break
			}
			fmt.Println("got", m)
		}
	}
}`,
          hints: ['What does `break` apply to inside a select?'],
          solution: '`break` exits the innermost `select`, not the `for`, so the loop continues forever.\n\nFix 1 — label:\n\n```go\nloop:\n\tfor {\n\t\tselect {\n\t\tcase m := <-msgs:\n\t\t\tif m == "quit" { break loop }\n\t\t}\n\t}\n```\n\nFix 2 — `return` from the function. Also consider a closed channel: `m, ok := <-msgs; if !ok { return }` — otherwise a closed channel spins forever returning "".',
          explanation: 'break/continue bind to the innermost for, switch or select statement.',
        },
        {
          id: 'm02-t2-p4',
          tier: 'advanced',
          level: 3,
          kind: 'predict',
          title: 'Closures over loop variables (Go 1.22+)',
          prompt: 'Using Go 1.22 or later, what prints? What would Go 1.21 print?',
          code: `package main

import "fmt"

func main() {
	var fns []func()
	for i := 0; i < 3; i++ {
		fns = append(fns, func() { fmt.Print(i) })
	}
	for _, f := range fns {
		f()
	}
}`,
          check: { options: ['012 (1.22+); 333 (1.21)', '333 in both', '012 in both', '222 (1.22+); 333 (1.21)'], answerIndex: 0 },
          hints: ['Go 1.22 changed loop-variable semantics: one variable per iteration.'],
          solution: 'Go 1.22+: `012`. Go 1.21 and earlier: `333`.',
          explanation: 'Before 1.22 all closures captured the same `i`, which ended at 3. Since 1.22 (when go.mod says go ≥ 1.22) each iteration gets a fresh `i` copied from the previous one.',
        },
      ],
    },
  ],
}
