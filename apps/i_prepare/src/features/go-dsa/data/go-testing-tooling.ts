import type { Module } from '../types'

export const MODULE_16: Module = {
  id: 'm16',
  number: 16,
  track: 'go',
  title: 'Testing',
  shortTitle: 'Testing',
  tagline: 'Table-driven tests, subtests, benchmarks, examples, coverage, fakes, the race detector and fuzzing.',
  topics: [
    {
      id: 'm16-t1',
      title: 'Unit Tests, Table-Driven Tests and Subtests',
      summary: 'The testing package idioms every Go reviewer expects.',
      concept: [
        'Tests live in `*_test.go` files, functions `func TestXxx(t *testing.T)`. `t.Errorf` records a failure and continues; `t.Fatalf` stops the test. Run with `go test ./...`.',
        'Table-driven tests: a slice of cases (often anonymous structs) looped with `t.Run(tc.name, …)` — each case becomes a named subtest you can run alone with `-run TestParse/negative`.',
        '`t.Helper()` makes failures report the caller’s line. `t.Cleanup` registers teardown. `t.Parallel()` runs subtests concurrently. `t.TempDir()` gives an auto-removed directory.',
        'Black-box tests use `package foo_test` and only the public API; white-box tests use `package foo`.',
      ],
      why: 'Tests are the executable spec; table tests make adding a case a one-line change.',
      whenToUse: ['Every pure function and every data structure', 'Regression test before fixing a bug'],
      whenNotToUse: ['Assertion libraries are optional — plain if + t.Errorf is idiomatic.', 'Testing private implementation details that make refactoring painful.'],
      syntax: `func TestAbs(t *testing.T) {
	tests := []struct {
		name string
		in, want int
	}{
		{"positive", 3, 3},
		{"negative", -3, 3},
		{"zero", 0, 0},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := Abs(tc.in); got != tc.want {
				t.Errorf("Abs(%d) = %d, want %d", tc.in, got, tc.want)
			}
		})
	}
}`,
      example: {
        code: `$ go test ./...
ok   example.com/shop/cart  0.012s
$ go test -run 'TestAbs/negative' -v ./mathx
=== RUN   TestAbs
=== RUN   TestAbs/negative
--- PASS: TestAbs (0.00s)
    --- PASS: TestAbs/negative (0.00s)
$ go test -cover ./...
ok   example.com/shop/cart  coverage: 87.5% of statements`,
        notes: ['-run takes a regex; slash separates subtest levels.', '-v shows each subtest.', '-cover reports statement coverage; -coverprofile + `go tool cover -html` shows it line by line.'],
      },
      mistakes: ['Error messages without got/want.', 't.Fatal from a goroutine other than the test goroutine.', 'Tests depending on map iteration order or wall-clock time.'],
      problems: [
        {
          id: 'm16-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Errorf vs Fatalf',
          prompt: 'In a table test, a case checks `err != nil` then dereferences the result. Which should you use for the err check and why?',
          check: { options: ['t.Fatalf — continuing would dereference a nil result and panic', 't.Errorf — always prefer Errorf', 'panic(err)', 'log.Fatal(err)'], answerIndex: 0 },
          hints: ['What happens on the next line if the result is nil?'],
          solution: '`t.Fatalf` (inside the subtest).',
          explanation: 'Fatal stops that (sub)test so later lines do not panic; Errorf is for independent checks where continuing gives more information. log.Fatal would kill the whole test binary.',
        },
        {
          id: 'm16-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Table test for ParseTx',
          prompt: 'Write a table-driven test for `ParseTx` from Module 3 (id, kind, amount, err). Cover: valid deposit, valid withdrawal, wrong field count, unknown kind, non-numeric amount (assert errors.Is strconv.ErrSyntax), negative amount.',
          hints: ['Add a `wantErr error` (sentinel to check with errors.Is) and `wantAnyErr bool` fields.', 'Use t.Run and report got/want.'],
          solution: `func TestParseTx(t *testing.T) {
	tests := []struct {
		name       string
		line       string
		wantID     string
		wantAmount float64
		wantErr    error
		anyErr     bool
	}{
		{"deposit", "TX1,deposit,250.50", "TX1", 250.50, nil, false},
		{"withdrawal", "TX2,withdrawal,10", "TX2", 10, nil, false},
		{"fields", "TX3,deposit", "", 0, nil, true},
		{"kind", "TX4,refund,5", "", 0, nil, true},
		{"syntax", "TX5,deposit,abc", "", 0, strconv.ErrSyntax, true},
		{"negative", "TX6,deposit,-5", "", 0, nil, true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			id, _, amt, err := ParseTx(tc.line)
			if tc.anyErr {
				if err == nil {
					t.Fatalf("ParseTx(%q) err = nil, want error", tc.line)
				}
				if tc.wantErr != nil && !errors.Is(err, tc.wantErr) {
					t.Fatalf("err = %v, want %v", err, tc.wantErr)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected err: %v", err)
			}
			if id != tc.wantID || amt != tc.wantAmount {
				t.Errorf("got (%s, %v), want (%s, %v)", id, amt, tc.wantID, tc.wantAmount)
			}
		})
	}
}`,
          explanation: 'Each row documents one behaviour; errors.Is verifies wrapping survived.',
          complexity: { time: 'O(cases)', space: 'O(1)' },
          variation: 'Make the subtests parallel and add a fuzz test that asserts ParseTx never panics.',
        },
        {
          id: 'm16-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Testing time-dependent code',
          story: 'A coupon expires 24 h after issue. The test currently sleeps for real.',
          prompt: 'Refactor `IsExpired(c Coupon) bool` (which calls time.Now) so it is testable deterministically, and write the test for "1 second before", "exactly at" and "after" expiry.',
          hints: ['Inject the clock: a `now func() time.Time` field or a parameter.', 'Define the boundary: is exactly-at expired?'],
          solution: `type Coupon struct{ IssuedAt time.Time }

const couponTTL = 24 * time.Hour

func IsExpired(c Coupon, now time.Time) bool {
	return !now.Before(c.IssuedAt.Add(couponTTL)) // expired at or after the boundary
}

func TestIsExpired(t *testing.T) {
	issued := time.Date(2026, 10, 6, 12, 0, 0, 0, time.UTC)
	c := Coupon{IssuedAt: issued}
	tests := []struct {
		name string
		now  time.Time
		want bool
	}{
		{"before", issued.Add(couponTTL - time.Second), false},
		{"exactly", issued.Add(couponTTL), true},
		{"after", issued.Add(couponTTL + time.Minute), true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := IsExpired(c, tc.now); got != tc.want {
				t.Errorf("IsExpired at %v = %v, want %v", tc.now, got, tc.want)
			}
		})
	}
}`,
          explanation: 'Passing time explicitly removes hidden dependencies; tests become instant and boundary cases explicit. (Go 1.25’s testing/synctest offers fake time for goroutine-heavy code.)',
          complexity: { time: 'O(1)', space: 'O(1)' },
          variation: 'Test a goroutine-based cache janitor that runs every minute, using testing/synctest.',
        },
      ],
    },
    {
      id: 'm16-t2',
      title: 'Benchmarks, Examples, Mocks, Race Detector and Fuzzing',
      summary: 'Measuring, documenting, isolating and hunting bugs automatically.',
      concept: [
        'Benchmarks: `func BenchmarkX(b *testing.B)` with `for b.Loop() { … }` (Go 1.24; older: `for i := 0; i < b.N; i++`). Run `go test -bench . -benchmem`; compare runs with benchstat.',
        'Examples: `func ExampleReverse() { fmt.Println(Reverse("go")) // Output: og }` — compiled, run as tests and shown in docs.',
        'Fakes/mocks: depend on small interfaces and pass hand-written fakes; generated mocks (gomock) for large interfaces. Prefer fakes with real behaviour over call-expectation mocks.',
        '`-race` instruments memory accesses to detect data races at runtime (only on paths executed). Fuzzing: `func FuzzX(f *testing.F)` with seed corpus; `go test -fuzz=FuzzX` generates inputs and saves crashers to testdata/fuzz.',
      ],
      why: 'Benchmarks prevent performance guesswork; race and fuzz tests find bugs humans miss.',
      whenToUse: ['-race in CI always', 'Fuzz parsers, decoders and anything taking untrusted input', 'Benchmarks before and after optimisations'],
      whenNotToUse: ['Benchmarks whose result the compiler can optimise away (use the result).', 'Mocking types you own when a real in-memory implementation is easy.'],
      syntax: `func BenchmarkJoin(b *testing.B) {
	parts := strings.Fields("a b c d e f")
	for b.Loop() {
		_ = strings.Join(parts, ",")
	}
}

func FuzzReverse(f *testing.F) {
	f.Add("hello")
	f.Fuzz(func(t *testing.T, s string) {
		if Reverse(Reverse(s)) != s && utf8.ValidString(s) {
			t.Errorf("double reverse changed %q", s)
		}
	})
}`,
      example: {
        code: `$ go test -bench=Join -benchmem
BenchmarkJoin-10      48212305     24.3 ns/op    16 B/op    1 allocs/op
$ go test -race ./...
WARNING: DATA RACE
Write at 0x00c0000b4010 by goroutine 8: ...
$ go test -fuzz=FuzzReverse -fuzztime=30s
fuzz: elapsed: 3s, execs: 410235 (136745/sec), new interesting: 12`,
        notes: ['ns/op, B/op and allocs/op are what you optimise.', 'Race reports show both conflicting accesses with stacks.', 'Failing fuzz inputs are saved and replayed by every future `go test`.'],
      },
      mistakes: ['Setup inside the timed loop (use b.ResetTimer or b.Loop which excludes setup).', 'Assuming -race finds races in code paths not executed.', 'Over-mocking until tests only test the mocks.'],
      problems: [
        {
          id: 'm16-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Reading benchmark output',
          prompt: '`BenchmarkA  2000000  610 ns/op  512 B/op  8 allocs/op` vs `BenchmarkB  9000000  130 ns/op  64 B/op  1 allocs/op`. What changed and what probably caused the speed-up?',
          hints: ['Look at allocations.'],
          solution: 'B is ~4.7× faster and allocates 7 fewer times per op (512 → 64 bytes). The speed-up most likely comes from removing allocations (pre-sizing a slice/builder, avoiding interface boxing or string concatenation), since allocation + GC dominate small ops. Confirm with a CPU profile and `-gcflags=-m`.',
          explanation: 'allocs/op is usually the first number to drive down in Go hot paths.',
        },
        {
          id: 'm16-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Fuzz a URL-slug function',
          story: 'A blogging platform’s `Slug(title string) string` crashed on an emoji title in production.',
          prompt: 'Write `FuzzSlug` asserting invariants: output is valid UTF-8, contains only [a-z0-9-], has no leading/trailing or double dashes, and Slug(Slug(x)) == Slug(x) (idempotent). Seed with a few titles.',
          hints: ['Invariants (properties) instead of exact expected outputs.', 'Use a regexp `^[a-z0-9]+(-[a-z0-9]+)*$` (allow empty).'],
          solution: `var slugRe = regexp.MustCompile(\`^([a-z0-9]+(-[a-z0-9]+)*)?$\`)

func FuzzSlug(f *testing.F) {
	for _, seed := range []string{"Hello, World!", "Go 1.25 — release 🚀", "", "--x--"} {
		f.Add(seed)
	}
	f.Fuzz(func(t *testing.T, title string) {
		s := Slug(title)
		if !utf8.ValidString(s) {
			t.Fatalf("invalid utf8 %q", s)
		}
		if !slugRe.MatchString(s) {
			t.Fatalf("Slug(%q) = %q has invalid shape", title, s)
		}
		if again := Slug(s); again != s {
			t.Fatalf("not idempotent: %q -> %q -> %q", title, s, again)
		}
	})
}`,
          explanation: 'Property-based assertions let the fuzzer explore millions of inputs without hand-computing expected outputs.',
          complexity: { time: 'Per input O(len)', space: 'O(len)' },
          variation: 'Write a Slug implementation that passes the fuzzer and transliterates common accented Latin letters (é → e).',
        },
        {
          id: 'm16-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Fake vs mock for a notifier',
          prompt: 'OrderService.Place must send exactly one notification on success and none on failure. Write a fake Notifier that records messages, and two tests. Explain why this fake beats a strict call-expectation mock.',
          hints: ['Fake: `type fakeNotifier struct{ sent []string; err error }`.', 'Assert on observable outcome (len(sent)) rather than call order.'],
          solution: `type Notifier interface{ Notify(ctx context.Context, msg string) error }

type fakeNotifier struct {
	mu   sync.Mutex
	sent []string
}

func (f *fakeNotifier) Notify(_ context.Context, msg string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.sent = append(f.sent, msg)
	return nil
}

func TestPlaceNotifiesOnSuccess(t *testing.T) {
	n := &fakeNotifier{}
	svc := NewService(NewMemRepo(), n)
	if err := svc.Place(context.Background(), Order{ID: "o1", Amount: 100}); err != nil {
		t.Fatal(err)
	}
	if len(n.sent) != 1 {
		t.Fatalf("sent %d notifications, want 1", len(n.sent))
	}
}

func TestPlaceNoNotifyOnFailure(t *testing.T) {
	n := &fakeNotifier{}
	svc := NewService(NewMemRepo(), n)
	_ = svc.Place(context.Background(), Order{ID: "o1", Amount: -1})
	if len(n.sent) != 0 {
		t.Fatalf("sent %d notifications on failure, want 0", len(n.sent))
	}
}`,
          explanation: 'The fake asserts on outcomes; strict mocks assert on interactions (exact calls/args/order), so harmless refactors break tests. Fakes are also reusable across many tests.',
          complexity: { time: 'O(1)', space: 'O(messages)' },
          variation: 'Make the fake return an error and decide (and test) whether Place should fail or just log when notification fails.',
        },
      ],
    },
  ],
}

export const MODULE_17: Module = {
  id: 'm17',
  number: 17,
  track: 'go',
  title: 'Go Tooling',
  shortTitle: 'Tooling',
  tagline: 'go run/build/test/vet/fmt, modules commands, go list/env/doc — what each does and when to use it.',
  topics: [
    {
      id: 'm17-t1',
      title: 'The go Command',
      summary: 'One binary for building, testing, formatting, vetting and documentation.',
      concept: [
        '`go run .` compile+run (no artifact). `go build` produce a binary (`-o name`, cross-compile with `GOOS=linux GOARCH=amd64`, `-ldflags "-s -w -X main.version=1.2"`). `go install pkg@version` installs tools into GOBIN.',
        '`go test ./...` all packages (flags: -run, -v, -count=1 to bypass cache, -race, -cover, -bench, -fuzz). `go vet ./...` static checks for likely bugs (printf args, copylocks, unreachable code, lost cancel).',
        '`gofmt -l -w .` / `go fmt ./...` canonical formatting — non-negotiable in Go codebases. `goimports` also fixes imports.',
        '`go mod init|tidy|download|why|graph`, `go get pkg@v`, `go list -m all` (modules) / `go list ./...` (packages), `go env` (GOPATH, GOOS, GOFLAGS…), `go doc net/http.Client` documentation in the terminal. `go tool pprof` for profiles.',
      ],
      why: 'A standard toolchain means every Go project builds, tests and formats the same way — no build-system bikeshedding.',
      whenToUse: ['CI: gofmt check, go vet, go test -race, staticcheck', 'go doc instead of a browser', 'go env -w for persistent settings (e.g. GOPRIVATE)'],
      whenNotToUse: ['`go get` to install binaries (deprecated outside modules) — use go install.', '`-count=1` everywhere locally (the test cache is your friend).'],
      syntax: `go run .
go build -o bin/api ./cmd/api
GOOS=linux GOARCH=arm64 go build ./cmd/api
go test -race -count=1 ./...
go vet ./...
gofmt -l .
go mod tidy
go list -m -u all    # available upgrades
go env GOPATH
go doc strings.Cut`,
      example: {
        code: `$ go vet ./...
./main.go:12:2: fmt.Printf format %d has arg name of wrong type string
./cache.go:30:9: Get passes lock by value: Cache contains sync.RWMutex
$ go build -ldflags "-X main.version=$(git describe --tags)" -o api ./cmd/api
$ ./api -version
v1.4.2`,
        notes: ['vet catches real bugs the compiler accepts.', '-X injects a string variable at link time — common for version info.'],
      },
      mistakes: ['Skipping go vet in CI.', 'Committing unformatted code.', 'Building with CGO accidentally enabled for static containers (set CGO_ENABLED=0).'],
      problems: [
        {
          id: 'm17-t1-p1',
          tier: 'foundation',
          level: 0,
          kind: 'concept',
          title: 'Match the command',
          prompt: 'Which command finds `fmt.Printf("%d", "abc")` before runtime?',
          check: { options: ['go vet', 'go fmt', 'go mod tidy', 'go build'], answerIndex: 0 },
          hints: ['The compiler accepts any args to a variadic ...any function.'],
          solution: '`go vet` (printf analyzer).',
          explanation: 'go build compiles it fine; vet checks format verbs against argument types. go test runs a subset of vet automatically.',
        },
        {
          id: 'm17-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'design',
          title: 'Write a CI pipeline',
          prompt: 'Write the shell steps for a Go CI job: verify formatting (fail if any file is unformatted), verify go.mod/go.sum are tidy, vet, run tests with race detector and coverage, build a static linux/amd64 binary.',
          hints: ['`test -z "$(gofmt -l .)"` fails if output is non-empty.', 'Tidy check: run `go mod tidy` then `git diff --exit-code go.mod go.sum`.'],
          solution: `set -euo pipefail
test -z "$(gofmt -l .)" || { gofmt -l .; echo "run gofmt"; exit 1; }
go mod tidy
git diff --exit-code go.mod go.sum
go vet ./...
go test -race -coverprofile=cover.out ./...
go tool cover -func=cover.out | tail -1
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o bin/api ./cmd/api`,
          explanation: 'Each step fails fast. -trimpath removes local paths from the binary; CGO_ENABLED=0 produces a static binary for scratch/distroless images.',
          variation: 'Add staticcheck and govulncheck, and cache the module download between CI runs.',
        },
        {
          id: 'm17-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'concept',
          title: 'Test caching',
          prompt: 'You run `go test ./...` twice and the second run prints `(cached)` instantly — but the test reads a file in testdata/ that you edited. Will the cache serve a stale result? When is caching bypassed?',
          hints: ['The go command tracks files opened and env vars read by tests.'],
          solution: 'No — the cache key includes the test binary plus the files and environment variables the test accessed (recorded via the runtime’s test log), so editing a file under testdata/ that the test opened invalidates the entry. Caching applies only in package-list mode (`./...` or named packages) and when every test flag is in the cacheable set (-run, -v, -short, -timeout, -cpu, -parallel, -failfast…). Build flags such as -race or -cover just produce a different binary (separately cached). `-count=1` is the idiomatic way to bypass it. Tests that depend on state the go command cannot see (network, databases, files outside the module opened by other processes) can return stale results — run those with -count=1.',
          explanation: 'Know when the cache is safe so you neither distrust it nor get fooled by it.',
        },
      ],
    },
  ],
}
