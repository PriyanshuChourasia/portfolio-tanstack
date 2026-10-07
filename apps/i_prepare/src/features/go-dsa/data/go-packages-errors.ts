import type { Module } from '../types'

export const MODULE_08: Module = {
  id: 'm08',
  number: 8,
  track: 'go',
  title: 'Packages and Modules',
  shortTitle: 'Packages',
  tagline: 'Package design, exported names, init(), go.mod/go.sum, semantic versions, internal/ and real project layout.',
  topics: [
    {
      id: 'm08-t1',
      title: 'Packages, Visibility, Imports and init()',
      summary: 'One directory = one package; capital letters export; init runs before main.',
      concept: [
        'A package is all .go files in one directory sharing a `package` clause. Package names are short, lowercase, singular, no underscores: `http`, `user`, `order` — not `utils` or `common`.',
        'Exported identifiers start with an uppercase letter. Unexported ones are package-private. There is no "protected".',
        'Imports can be aliased (`pg "github.com/jackc/pgx/v5"`), blank (`_ "image/png"` to run its init only) or dot (avoid). Import cycles are compile errors — they force you to fix the dependency graph.',
        '`func init()` runs automatically after package-level variables are initialised, once per package, in dependency order, before main. A file can have several init funcs.',
      ],
      why: 'Directory-scoped packages and no cycles keep large codebases buildable in seconds and easy to reason about.',
      whenToUse: ['Packages organised by domain (`order`, `payment`)', 'Blank import for driver registration (`database/sql` drivers)', 'init for registering codecs/plugins'],
      whenNotToUse: ['init for heavy work, network calls or anything that can fail — do it explicitly in main.', '`utils` dumping-ground packages.', 'Package names that stutter (`user.UserService` → `user.Service`).'],
      syntax: `// file: internal/order/order.go
package order

type Order struct{ ID string }      // exported
func New(id string) *Order { return &Order{ID: id} }
func validate(o *Order) error { return nil } // unexported

var registry = map[string]int{}
func init() { registry["default"] = 1 }`,
      example: {
        code: `package main

import "fmt"

var a = initA()

func initA() int {
	fmt.Println("var a")
	return 1
}

func init() { fmt.Println("init 1") }
func init() { fmt.Println("init 2") }

func main() { fmt.Println("main", a) }`,
        output: `var a
init 1
init 2
main 1`,
        notes: ['Package-level vars initialise first.', 'Multiple init functions run in source order.', 'main runs last.'],
      },
      mistakes: ['Import cycles between packages that should be merged or split by interface.', 'Global mutable state set in init, making tests order-dependent.', 'Stuttering names.'],
      problems: [
        {
          id: 'm08-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Naming review',
          prompt: 'Which package/identifier pair follows Go naming conventions best?',
          check: {
            options: ['package user; func New() *User; type Service struct{}', 'package user_utils; func NewUserService()', 'package Users; type UserService struct{}', 'package common; func DoUserStuff()'],
            answerIndex: 0,
          },
          hints: ['Callers read `pkg.Name` — avoid repeating the package name.'],
          solution: '`package user` with `user.New()`, `user.User`, `user.Service`.',
          explanation: 'Lowercase single-word package names; identifiers do not repeat the package name (`user.Service`, not `user.UserService`). `common`/`utils` say nothing about what is inside.',
        },
        {
          id: 'm08-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Plugin registry with init',
          story: 'An image service supports codecs that register themselves, like image/png does.',
          prompt: 'In package `codec`, write `type Decoder func([]byte) (Image, error)`, `Register(name string, d Decoder)` that panics on duplicate names, and `Lookup(name string) (Decoder, bool)`. Show how a `codec/webp` package registers itself in init and how main enables it with a blank import.',
          hints: ['Registry map unexported in package codec.', 'webp: `func init() { codec.Register("webp", decode) }`. main: `import _ "example.com/app/codec/webp"`.'],
          solution: `package codec

type Image struct{ W, H int }
type Decoder func([]byte) (Image, error)

var decoders = map[string]Decoder{}

func Register(name string, d Decoder) {
	if _, dup := decoders[name]; dup {
		panic("codec: Register called twice for " + name)
	}
	decoders[name] = d
}

func Lookup(name string) (Decoder, bool) {
	d, ok := decoders[name]
	return d, ok
}

// --- package webp ---
package webp

import "example.com/app/codec"

func init() { codec.Register("webp", decode) }

func decode(b []byte) (codec.Image, error) { return codec.Image{}, nil }

// --- main ---
import _ "example.com/app/codec/webp"`,
          explanation: 'Panicking on duplicate registration is acceptable in init: it is a programmer error caught at startup. Registration happens at init time (single goroutine), so the map needs no lock as long as Register is only called from init.',
          complexity: { time: 'O(1) per op', space: 'O(codecs)' },
          variation: 'Allow registration at runtime from multiple goroutines — add a sync.RWMutex.',
        },
        {
          id: 'm08-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Breaking an import cycle',
          prompt: '`order` imports `payment` to charge; `payment` imports `order` to mark orders paid. The build fails with "import cycle not allowed". Describe two ways to fix it.',
          hints: ['Who should own the abstraction?', 'Could a third package or a callback break the loop?'],
          solution: '1. **Interface in the consumer**: `payment` defines `type OrderMarker interface { MarkPaid(id string) error }` and receives it as a dependency; `order` implements it implicitly. Now only order → payment.\n\n2. **Extract shared types / events** into a lower package (`domain` or `events`) that both import, or have payment publish a `PaymentSucceeded` event the order package subscribes to.\n\nMerging the packages is a third option if they are really one concept.',
          explanation: 'Cycles indicate tangled responsibilities; Go forces you to make the direction of dependencies explicit.',
        },
      ],
    },
    {
      id: 'm08-t2',
      title: 'Modules, go.mod, go.sum, Versions and Project Layout',
      summary: 'Semantic import versioning, tidy, internal/, cmd/ and a real repo structure.',
      concept: [
        '`go.mod` declares the module path, Go version and requirements. `go.sum` stores cryptographic hashes of every module version used, so builds are reproducible and tamper-evident — commit both.',
        'Versions follow semver vMAJOR.MINOR.PATCH. Go uses Minimal Version Selection: it picks the minimum version satisfying all requirements, not the latest. Major versions ≥2 change the import path: `github.com/x/y/v2`.',
        '`go get pkg@v1.4.0` adds/upgrades; `go mod tidy` adds missing and removes unused requirements; `go mod download` fills the module cache (useful in Docker layers). `replace` directives point to local forks.',
        'Packages under an `internal/` directory can only be imported by code rooted at internal’s parent — enforced by the compiler. Common layout: `cmd/<app>/main.go`, `internal/<domain>/`, `pkg/` only for code truly meant for others.',
      ],
      why: 'Modules give reproducible builds without a separate package manager; internal/ lets you refactor freely without breaking external users.',
      whenToUse: ['`go mod tidy` before every commit', '`internal/` for everything not intended as a public API', 'Workspaces (`go work`) for multi-module local development'],
      whenNotToUse: ['Committing `replace ../local/path` to a library.', 'Over-structuring a 500-line project into 15 directories.'],
      syntax: `module github.com/acme/shipments

go 1.23

require (
	github.com/google/uuid v1.6.0
	golang.org/x/sync v0.8.0
)

// layout
// cmd/api/main.go
// internal/shipment/service.go
// internal/shipment/repo_postgres.go
// internal/platform/httpx/`,
      example: {
        code: `$ go mod init github.com/acme/shipments
$ go get github.com/google/uuid@v1.6.0
$ go mod tidy
$ go list -m all          # every module in the build
$ go mod why golang.org/x/text
$ go mod download          # warm the cache (Dockerfile)`,
        notes: ['go get records the requirement in go.mod and hashes in go.sum.', 'tidy prunes what the code no longer imports.', '`go mod why` explains why a dependency is present.'],
      },
      mistakes: ['Not committing go.sum.', 'Importing `v2` of a module without the `/v2` suffix.', 'Putting everything in `pkg/` by default.'],
      problems: [
        {
          id: 'm08-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Which command?',
          prompt: 'You deleted the only file that imported `github.com/pkg/errors`. Which command removes it from go.mod?',
          check: { options: ['go mod tidy', 'go mod download', 'go get -u', 'go clean -modcache'], answerIndex: 0 },
          hints: ['One command reconciles go.mod with the imports actually used.'],
          solution: '`go mod tidy`',
          explanation: 'tidy adds missing and removes unused requirements and updates go.sum. download only fetches; `go get -u` upgrades; clean -modcache wipes the local cache.',
        },
        {
          id: 'm08-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'design',
          title: 'Lay out a shipments service',
          story: 'You are starting a logistics backend with an HTTP API, a worker that consumes Kafka events, and shared domain logic.',
          prompt: 'Propose a directory layout (cmd/, internal/…), name each package, and say which packages may import which. Justify where interfaces live.',
          hints: ['Two binaries → two `cmd/` directories.', 'Domain logic should not import transport (http/kafka) packages.'],
          solution: `shipments/
├── go.mod
├── cmd/
│   ├── api/main.go        // wires config, db, http server
│   └── worker/main.go     // wires config, db, kafka consumer
├── internal/
│   ├── shipment/          // domain: types, Service, Repo interface
│   │   ├── shipment.go
│   │   ├── service.go
│   │   └── service_test.go
│   ├── postgres/          // implements shipment.Repo
│   ├── httpapi/           // handlers → shipment.Service
│   ├── kafkaconsumer/     // consumer → shipment.Service
│   └── platform/config/   // env parsing
└── migrations/

Dependency direction: cmd → httpapi/kafkaconsumer/postgres → shipment.
shipment imports nothing from the others.`,
          explanation: 'Domain at the centre, adapters around it (hexagonal). The Repo interface lives in `shipment` (consumer-defined); `postgres` implements it. main does wiring only. Everything is under internal/ because nothing is a public library.',
          variation: 'Where would you put a shared `money` type used by shipments and invoices once invoices become a separate module?',
        },
        {
          id: 'm08-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Minimal Version Selection',
          prompt: 'Your module requires lib A v1.2.0 and lib B. B requires A v1.4.0. A v1.9.0 is the latest release. Which version of A is built, and why is this different from npm-style resolution?',
          check: { options: ['v1.4.0', 'v1.9.0', 'v1.2.0', 'Both v1.2.0 and v1.4.0'], answerIndex: 0 },
          hints: ['MVS picks the maximum of the minimums.'],
          solution: '**v1.4.0** — the highest version anyone explicitly requires.',
          explanation: 'MVS never picks a version nobody asked for, so builds are reproducible without a lock file and do not change when new releases appear. Only one minor version of a major version is used per build. Upgrades happen only when you run `go get`.',
        },
      ],
    },
  ],
}

export const MODULE_09: Module = {
  id: 'm09',
  number: 9,
  track: 'go',
  title: 'Error Handling',
  shortTitle: 'Errors',
  tagline: 'Errors are values: sentinels, custom types, wrapping with %w, errors.Is / errors.As, and propagation patterns.',
  topics: [
    {
      id: 'm09-t1',
      title: 'error, errors.New, Sentinel and Custom Errors',
      summary: 'The error interface, when to use sentinels, when to use types.',
      concept: [
        '`error` is a built-in interface: `type error interface { Error() string }`. Functions return it as the last result; nil means success.',
        'Sentinel errors are package-level values: `var ErrNotFound = errors.New("not found")`. Callers compare with `errors.Is`. They are part of your API — export them deliberately.',
        'Custom error types carry structured data: `type ValidationError struct { Field, Msg string }`. Callers extract them with `errors.As`.',
        'Error strings are lowercase with no trailing punctuation, because they get wrapped: "open config: permission denied".',
      ],
      why: 'Explicit error values make every failure path visible in the code and testable without exceptions.',
      whenToUse: ['Sentinel when callers branch on a specific condition (not found, EOF)', 'Custom type when callers need details (field, retry-after)', '`fmt.Errorf` for one-off descriptive errors'],
      whenNotToUse: ['Comparing `err.Error()` strings.', 'panic for expected failures.', 'Exporting a sentinel for every internal failure.'],
      syntax: `var ErrNotFound = errors.New("user not found")

type RateLimitError struct{ RetryAfter time.Duration }
func (e *RateLimitError) Error() string {
	return fmt.Sprintf("rate limited, retry after %v", e.RetryAfter)
}`,
      example: {
        code: `package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

type ValidationError struct{ Field string }

func (e *ValidationError) Error() string { return e.Field + " is invalid" }

func find(id int) error {
	switch {
	case id < 0:
		return &ValidationError{Field: "id"}
	case id > 100:
		return ErrNotFound
	}
	return nil
}

func main() {
	for _, id := range []int{-1, 500, 5} {
		err := find(id)
		var ve *ValidationError
		switch {
		case errors.As(err, &ve):
			fmt.Println("bad field:", ve.Field)
		case errors.Is(err, ErrNotFound):
			fmt.Println("missing")
		default:
			fmt.Println("ok:", err)
		}
	}
}`,
        output: `bad field: id
missing
ok: <nil>`,
        notes: ['errors.As finds a *ValidationError in the chain and assigns it to ve.', 'errors.Is compares with the sentinel.', 'A nil error prints <nil>.'],
      },
      mistakes: ['`if err.Error() == "not found"`.', 'Capitalised error strings with periods.', 'Returning a typed nil pointer as error (see Module 7).'],
      problems: [
        {
          id: 'm09-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Sentinel or type?',
          prompt: 'An HTTP client must tell callers (a) the resource does not exist, and (b) they were rate limited and should retry after N seconds. What should each be?',
          check: {
            options: ['(a) sentinel ErrNotFound, (b) custom type with RetryAfter field', '(a) custom type, (b) sentinel', 'both strings via fmt.Errorf', 'both panics recovered by the caller'],
            answerIndex: 0,
          },
          hints: ['Does the caller need extra data?'],
          solution: '(a) a sentinel `ErrNotFound`; (b) a `*RateLimitError{RetryAfter time.Duration}` type.',
          explanation: 'Sentinels suit yes/no conditions; types carry data the caller needs (retry delay).',
        },
        {
          id: 'm09-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Multi-field validation error',
          story: 'A user-signup API should return ALL invalid fields at once, not one per request.',
          prompt: 'Write `type FieldError struct{ Field, Msg string }` and `type ValidationErrors []FieldError` implementing `error` (joined messages). Write `ValidateUser(name, email string, age int) error` that returns nil if valid (NOT an empty ValidationErrors!).',
          hints: ['Collect into a local ValidationErrors, return nil if len == 0.', 'Error(): join "field: msg" with "; ".'],
          solution: `type FieldError struct{ Field, Msg string }

type ValidationErrors []FieldError

func (v ValidationErrors) Error() string {
	parts := make([]string, len(v))
	for i, e := range v {
		parts[i] = e.Field + ": " + e.Msg
	}
	return strings.Join(parts, "; ")
}

func ValidateUser(name, email string, age int) error {
	var errs ValidationErrors
	if strings.TrimSpace(name) == "" {
		errs = append(errs, FieldError{"name", "required"})
	}
	if !strings.Contains(email, "@") {
		errs = append(errs, FieldError{"email", "must contain @"})
	}
	if age < 13 {
		errs = append(errs, FieldError{"age", "must be at least 13"})
	}
	if len(errs) == 0 {
		return nil
	}
	return errs
}`,
          explanation: 'Returning `errs` when empty would produce a non-nil error interface holding a nil slice — the typed-nil trap again. Callers can `errors.As(err, &ve)` with `var ve ValidationErrors` to render per-field messages.',
          complexity: { time: 'O(fields)', space: 'O(errors)' },
          variation: 'Use Go 1.20 `errors.Join` instead and compare the ergonomics for callers.',
        },
        {
          id: 'm09-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Comparing errors by string',
          prompt: 'This works today. Why will it break, and what is the fix?',
          code: `_, err := repo.Find(ctx, id)
if err != nil && err.Error() == "sql: no rows in result set" {
	return nil, ErrNotFound
}`,
          hints: ['What happens when another layer wraps err with context?'],
          solution: 'As soon as any layer wraps it (`fmt.Errorf("find %d: %w", id, err)`), the string changes and the comparison silently fails. Message text is not an API.\n\nFix: `if errors.Is(err, sql.ErrNoRows) { return nil, ErrNotFound }`.',
          explanation: 'errors.Is walks the wrap chain comparing values, so it survives wrapping.',
        },
      ],
    },
    {
      id: 'm09-t2',
      title: 'Wrapping with %w, errors.Is / errors.As and Propagation Patterns',
      summary: 'Add context at each layer without losing the original cause.',
      concept: [
        '`fmt.Errorf("load user %d: %w", id, err)` wraps err: the new error’s Unwrap() returns err. `%v` would only copy the text and break the chain.',
        '`errors.Is(err, target)` walks the chain comparing with == (or a custom Is method). `errors.As(err, &target)` walks the chain looking for an error assignable to target’s type and sets it.',
        'Propagation: add context describing WHAT you were doing ("open config"), not "error occurred". Handle each error once — either log it or return it, not both.',
        '`errors.Join(e1, e2)` (Go 1.20) combines errors; Is/As check all of them.',
      ],
      why: 'Wrapping produces messages like "checkout: charge card: gateway: timeout" while still letting code detect the timeout.',
      whenToUse: ['%w when callers may need the cause', '%v deliberately to hide implementation details at API boundaries', 'errors.Join for cleanup errors (close after write)'],
      whenNotToUse: ['Logging AND returning the same error (duplicate logs).', 'Wrapping with no new information.'],
      syntax: `if err != nil {
	return fmt.Errorf("charge order %s: %w", id, err)
}
if errors.Is(err, context.DeadlineExceeded) { retry() }
var rl *RateLimitError
if errors.As(err, &rl) { time.Sleep(rl.RetryAfter) }`,
      example: {
        code: `package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
)

func loadConfig(path string) error {
	_, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}
	return nil
}

func main() {
	err := loadConfig("/nope.yaml")
	fmt.Println(err)
	fmt.Println(errors.Is(err, fs.ErrNotExist))
	var pe *fs.PathError
	fmt.Println(errors.As(err, &pe), pe.Op)
}`,
        output: `load config: open /nope.yaml: no such file or directory
true
true open`,
        notes: ['The message accumulates context.', 'errors.Is sees through the wrap to the PathError, whose Unwrap is ENOENT, which Is fs.ErrNotExist.', 'errors.As extracts the *fs.PathError.'],
      },
      mistakes: ['Using %v and then expecting errors.Is to work.', 'Passing a non-pointer to errors.As (panics).', 'Swallowing errors with `_`.'],
      problems: [
        {
          id: 'm09-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: '%w vs %v',
          prompt: 'What does this print?',
          code: `package main

import (
	"errors"
	"fmt"
)

var ErrDown = errors.New("db down")

func main() {
	a := fmt.Errorf("query: %w", ErrDown)
	b := fmt.Errorf("query: %v", ErrDown)
	c := fmt.Errorf("handler: %w", a)
	fmt.Println(errors.Is(a, ErrDown), errors.Is(b, ErrDown), errors.Is(c, ErrDown))
	fmt.Println(c)
}`,
          check: { options: ['true false true\nhandler: query: db down', 'true true true\nhandler: query: db down', 'true false false\nhandler: db down', 'false false false\nquery: db down'], answerIndex: 0 },
          hints: ['%v copies the text only.', 'Is walks multiple levels.'],
          solution: '```text\ntrue false true\nhandler: query: db down\n```',
          explanation: 'a wraps ErrDown. b only contains the text. c wraps a, which wraps ErrDown — Is walks both levels.',
        },
        {
          id: 'm09-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Retry only temporary failures',
          story: 'A shipment-tracking client calls a courier API that fails transiently (timeouts, 503) and permanently (404, invalid key).',
          prompt: 'Define `var ErrTemporary = errors.New("temporary")`. Write `Retry(ctx context.Context, attempts int, base time.Duration, op func() error) error` that retries only when `errors.Is(err, ErrTemporary)`, with exponential backoff (base, 2·base, 4·base…), stops on ctx cancellation, and returns the last error wrapped with the attempt count.',
          hints: ['Use `select { case <-time.After(d): case <-ctx.Done(): return ctx.Err() }`.', 'Permanent error → return immediately.'],
          solution: `var ErrTemporary = errors.New("temporary")

func Retry(ctx context.Context, attempts int, base time.Duration, op func() error) error {
	var err error
	delay := base
	for i := 1; i <= attempts; i++ {
		if err = op(); err == nil {
			return nil
		}
		if !errors.Is(err, ErrTemporary) {
			return err
		}
		if i == attempts {
			break
		}
		select {
		case <-time.After(delay):
			delay *= 2
		case <-ctx.Done():
			return fmt.Errorf("retry cancelled after %d attempts: %w", i, errors.Join(ctx.Err(), err))
		}
	}
	return fmt.Errorf("after %d attempts: %w", attempts, err)
}`,
          explanation: 'Classifying by sentinel keeps the retry policy independent of the client. Wrapping with %w lets callers still detect ErrTemporary or ctx errors.',
          complexity: { time: 'O(attempts) calls; total sleep base·(2^(attempts−1)−1)', space: 'O(1)' },
          variation: 'Add full jitter (`rand.N(delay)`) and a max delay cap. Why does jitter matter when 10,000 clients retry at once?',
        },
        {
          id: 'm09-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Double logging',
          prompt: 'An incident shows the same error logged 4 times with different prefixes. What pattern causes it and what is the rule?',
          code: `func repoGet(id string) error {
	err := db.QueryRow(...).Scan(...)
	if err != nil {
		log.Printf("repo error: %v", err)
		return err
	}
	return nil
}

func serviceGet(id string) error {
	if err := repoGet(id); err != nil {
		log.Printf("service error: %v", err)
		return err
	}
	return nil
}`,
          hints: ['Each layer both logs and returns.'],
          solution: 'Every layer logs AND returns, so one failure produces N log lines without context linking them.\n\nRule: handle an error exactly once. Lower layers wrap and return (`return fmt.Errorf("get user %s: %w", id, err)`); only the top (HTTP handler, worker loop) logs it once with the full chain — or decides to recover from it.',
          explanation: 'Wrapping builds a single, readable causal chain instead of scattered log lines.',
        },
      ],
    },
  ],
}
