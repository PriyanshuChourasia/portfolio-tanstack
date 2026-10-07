import type { Module } from '../types'

export const MODULE_14: Module = {
  id: 'm14',
  number: 14,
  track: 'go',
  title: 'Go Standard Library',
  shortTitle: 'Std Library',
  tagline: 'strings/strconv/bytes, sort/slices/maps/math/rand, time/os/io/bufio/filepath, encoding/json/csv, regexp and log.',
  topics: [
    {
      id: 'm14-t1',
      title: 'strings, strconv, bytes, regexp',
      summary: 'Text processing without reinventing wheels.',
      concept: [
        '`strings`: Split, Fields, Join, Contains, HasPrefix, Index, Replace, ToLower, TrimSpace, Cut (split once), EqualFold, Builder. `bytes` mirrors it for []byte plus bytes.Buffer.',
        '`strconv`: Atoi/Itoa, ParseInt(s, base, bits), ParseFloat, ParseBool, FormatInt, Quote. Errors are *strconv.NumError wrapping ErrSyntax or ErrRange.',
        '`regexp` uses RE2 syntax — guaranteed linear time, no backreferences. Compile once at package level with MustCompile; it is safe for concurrent use.',
      ],
      why: 'Most backend work is moving and validating text; the stdlib versions are fast, correct with UTF-8 and well-tested.',
      whenToUse: ['strings.Cut for "key=value"', 'strings.Fields for whitespace splitting', 'regexp only when simple functions do not suffice'],
      whenNotToUse: ['regexp in a hot loop when strings.Contains/HasPrefix works.', 'Compiling a regexp per request.'],
      syntax: `k, v, ok := strings.Cut("env=prod", "=")
n, err := strconv.Atoi("42")
f := strings.Fields("  a  b c ")      // [a b c]
var re = regexp.MustCompile(\`^[A-Z]{2}\\d{2}[A-Z]{2}\\d{4}$\`) // vehicle number`,
      example: {
        code: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	line := "  user=ana; age=31 ;city=Pune "
	data := map[string]string{}
	for _, part := range strings.Split(line, ";") {
		if k, v, ok := strings.Cut(strings.TrimSpace(part), "="); ok {
			data[k] = v
		}
	}
	age, err := strconv.Atoi(data["age"])
	fmt.Println(data["user"], age, err, strings.ToUpper(data["city"]))
	_, err = strconv.Atoi("3x")
	fmt.Println(err)
}`,
        output: `ana 31 <nil> PUNE
strconv.Atoi: parsing "3x": invalid syntax`,
        notes: ['Split on ";" then TrimSpace each part.', 'Cut splits once and reports whether the separator was found.', 'strconv errors include the function and input.'],
      },
      mistakes: ['strings.Split("", ",") returns [""] (len 1), not an empty slice.', 'Using `string(n)` instead of strconv.Itoa.', 'Using regexp lookarounds/backreferences (unsupported in RE2).'],
      problems: [
        {
          id: 'm14-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'predict',
          title: 'Split surprises',
          prompt: 'What does this print?',
          code: `package main

import (
	"fmt"
	"strings"
)

func main() {
	a := strings.Split("", ",")
	b := strings.Split("a,,b", ",")
	c := strings.Fields(" a  b ")
	fmt.Println(len(a), len(b), len(c))
}`,
          check: { options: ['1 3 2', '0 2 2', '0 3 2', '1 2 3'], answerIndex: 0 },
          hints: ['Split never returns an empty slice for a non-empty separator.', 'Fields collapses runs of whitespace.'],
          solution: '`1 3 2`',
          explanation: 'Split("", ",") → [""]. "a,,b" → ["a" "" "b"]. Fields → ["a" "b"].',
        },
        {
          id: 'm14-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Parse access-log lines',
          story: 'A search engine’s ops team wants request counts per status code from nginx logs.',
          prompt: 'Lines look like `127.0.0.1 - - [10/Oct/2026:13:55:36] "GET /search?q=go HTTP/1.1" 200 2326`. Write `ParseLine(line string) (method, path string, status int, err error)` using a precompiled regexp with named groups.',
          hints: ['Pattern: `"(?P<method>[A-Z]+) (?P<path>\\S+) [^"]*" (?P<status>\\d{3})`.', 'Use re.FindStringSubmatch and re.SubexpIndex.'],
          solution: `var logRe = regexp.MustCompile(\`"(?P<method>[A-Z]+) (?P<path>\\S+) [^"]*" (?P<status>\\d{3})\`)

func ParseLine(line string) (method, path string, status int, err error) {
	m := logRe.FindStringSubmatch(line)
	if m == nil {
		return "", "", 0, fmt.Errorf("unparseable line: %q", line)
	}
	status, err = strconv.Atoi(m[logRe.SubexpIndex("status")])
	if err != nil {
		return "", "", 0, err
	}
	return m[logRe.SubexpIndex("method")], m[logRe.SubexpIndex("path")], status, nil
}`,
          explanation: 'Compiled once at package init and shared across goroutines. Named groups make the code robust to reordering the pattern.',
          complexity: { time: 'O(len(line)) — RE2 is linear', space: 'O(groups)' },
          variation: 'Process a 20 GB log with bufio.Scanner and 8 worker goroutines; aggregate counts per status.',
        },
        {
          id: 'm14-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Strict integer parsing',
          prompt: 'Write `ParseQuantity(s string) (int, error)` accepting optional surrounding spaces and an optional "+" sign, rejecting values outside 1..10_000, and returning sentinel errors `ErrNotNumber` and `ErrOutOfRange` that callers detect with errors.Is — while preserving the original strconv error via wrapping.',
          hints: ['`fmt.Errorf("%w: %w", ErrNotNumber, err)` wraps two errors (Go 1.20+).', 'strconv.Atoi already accepts "+".'],
          solution: `var (
	ErrNotNumber  = errors.New("not a number")
	ErrOutOfRange = errors.New("quantity out of range")
)

func ParseQuantity(s string) (int, error) {
	n, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return 0, fmt.Errorf("%w: %w", ErrNotNumber, err)
	}
	if n < 1 || n > 10_000 {
		return 0, fmt.Errorf("%w: %d", ErrOutOfRange, n)
	}
	return n, nil
}`,
          explanation: 'Multiple %w verbs make the error match both the sentinel and the underlying *strconv.NumError.',
          complexity: { time: 'O(len(s))', space: 'O(1)' },
          variation: 'Accept "1,000" and "1_000" separators but reject "1,00".',
        },
      ],
    },
    {
      id: 'm14-t2',
      title: 'sort, slices, maps, math, math/rand, time',
      summary: 'Sorting and searching helpers, numeric utilities, randomness and time handling.',
      concept: [
        '`slices` (Go 1.21+): Sort, SortFunc, SortStableFunc, BinarySearch, Contains, Index, Insert, Delete, Reverse, Max, Min, Equal, Compact. `maps`: Keys, Values (iterators), Clone, Copy. `sort.Slice` is the older API.',
        '`math`: Inf, NaN, MaxInt64, Abs, Floor, Round, Sqrt, Hypot. `math/rand/v2`: rand.IntN, rand.N(duration), auto-seeded; use `crypto/rand` for secrets.',
        '`time`: time.Now, Duration arithmetic, Since/Until, Truncate, Format/Parse with the reference time `Mon Jan 2 15:04:05 MST 2006`, Timer/Ticker. Monotonic clock readings make time.Since immune to wall-clock jumps.',
      ],
      why: 'Correct sorting/search and time arithmetic are easy to get subtly wrong by hand.',
      whenToUse: ['slices.SortFunc + cmp.Compare for multi-key sorts', 'time.Duration for every timeout', 'UTC for storage'],
      whenNotToUse: ['math/rand for tokens or passwords.', 'Formatting dates with YYYY-MM-DD patterns (Go uses 2006-01-02).'],
      syntax: `slices.SortFunc(users, func(a, b User) int {
	return cmp.Or(cmp.Compare(a.Age, b.Age), strings.Compare(a.Name, b.Name))
})
i, found := slices.BinarySearch(sorted, 42)
t, err := time.Parse("2006-01-02", "2026-10-06")
deadline := time.Now().Add(30 * time.Second)`,
      example: {
        code: `package main

import (
	"fmt"
	"slices"
	"time"
)

func main() {
	xs := []int{5, 2, 8, 2, 9}
	slices.Sort(xs)
	xs = slices.Compact(xs)
	i, ok := slices.BinarySearch(xs, 8)
	fmt.Println(xs, i, ok)

	t, _ := time.Parse("2006-01-02 15:04", "2026-10-06 09:30")
	fmt.Println(t.Add(90*time.Minute).Format("Jan 2 15:04"), t.Weekday())
}`,
        output: `[2 5 8 9] 2 true
Oct 6 11:00 Tuesday`,
        notes: ['Compact removes consecutive duplicates — sort first.', 'BinarySearch returns the index and whether it was found.', 'Layouts use the reference date; 2026-10-06 is a Tuesday.'],
      },
      mistakes: ['`time.Sleep(5)` sleeps 5 ns — use 5*time.Second.', 'Comparing times with == (monotonic/location differences) — use t.Equal.', 'Using sort.Slice with an inconsistent less function.'],
      problems: [
        {
          id: 'm14-t2-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Go time layout',
          prompt: 'Which layout formats a time as `2026-10-06T14:05:09`?',
          check: { options: ['"2006-01-02T15:04:05"', '"YYYY-MM-DDThh:mm:ss"', '"2006-02-01T03:04:05"', '"%Y-%m-%dT%H:%M:%S"'], answerIndex: 0 },
          hints: ['The reference time is Mon Jan 2 15:04:05 MST 2006 — 01/02 03:04:05PM \'06.'],
          solution: '`"2006-01-02T15:04:05"` (or `time.DateTime`-style constants).',
          explanation: '01 = month, 02 = day, 15 = 24-hour, 03 = 12-hour, 04 = minute, 05 = second.',
        },
        {
          id: 'm14-t2-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Leaderboard ordering',
          story: 'A gaming backend ranks players by score desc, then fewer games played, then earliest join date.',
          prompt: 'Write `Rank(players []Player)` sorting in place with slices.SortFunc and cmp. `type Player struct{ Name string; Score, Games int; Joined time.Time }`.',
          hints: ['`cmp.Or` returns the first non-zero comparison.', 'Descending: compare b to a.'],
          solution: `func Rank(players []Player) {
	slices.SortFunc(players, func(a, b Player) int {
		return cmp.Or(
			cmp.Compare(b.Score, a.Score),
			cmp.Compare(a.Games, b.Games),
			a.Joined.Compare(b.Joined),
		)
	})
}`,
          explanation: 'cmp.Or chains tie-breakers cleanly. time.Time has its own Compare (Go 1.20).',
          complexity: { time: 'O(n log n)', space: 'O(log n) (pdqsort)' },
          variation: 'Keep the leaderboard sorted under constant score updates — what data structure would you use instead of re-sorting?',
        },
        {
          id: 'm14-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Business-hours SLA deadline',
          story: 'A support desk promises a reply within 8 business hours (Mon–Fri, 09:00–17:00, Asia/Kolkata).',
          prompt: 'Write `SLADeadline(start time.Time, hours int) time.Time`. Tickets created outside business hours start counting at the next opening.',
          hints: ['Load the location with time.LoadLocation("Asia/Kolkata").', 'Advance through days: use remaining minutes of today’s window, then jump to next business day 09:00.'],
          solution: `func SLADeadline(start time.Time, hours int) time.Time {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	t := start.In(loc)
	remaining := time.Duration(hours) * time.Hour
	for {
		open := time.Date(t.Year(), t.Month(), t.Day(), 9, 0, 0, 0, loc)
		closeAt := time.Date(t.Year(), t.Month(), t.Day(), 17, 0, 0, 0, loc)
		weekend := t.Weekday() == time.Saturday || t.Weekday() == time.Sunday
		if weekend || !t.Before(closeAt) {
			t = open.AddDate(0, 0, 1)
			continue
		}
		if t.Before(open) {
			t = open
		}
		if avail := closeAt.Sub(t); remaining <= avail {
			return t.Add(remaining)
		} else {
			remaining -= avail
			t = open.AddDate(0, 0, 1)
		}
	}
}`,
          explanation: 'Working in the business location avoids off-by-timezone errors; time.Date normalises day overflow. Each iteration consumes one day, so the loop runs O(days) times.',
          complexity: { time: 'O(hours / 8 + weekends)', space: 'O(1)' },
          variation: 'Add a holiday calendar (`map[string]bool` keyed by "2006-01-02").',
        },
      ],
    },
    {
      id: 'm14-t3',
      title: 'os, io, bufio, path/filepath, encoding/json, encoding/csv, log',
      summary: 'The Reader/Writer ecosystem and structured data formats.',
      concept: [
        '`io.Reader` / `io.Writer` are the universal streaming interfaces. Compose them: io.Copy, io.TeeReader, io.MultiWriter, io.LimitReader, gzip.NewReader(r).',
        '`bufio.Scanner` reads line by line (default max token 64 KB — call Buffer() for longer lines). `bufio.Writer` batches small writes; remember Flush.',
        '`encoding/json`: Marshal/Unmarshal with struct tags (`json:"name,omitempty"`, `json:"-"`), Decoder/Encoder for streams, json.RawMessage for deferred decoding. Unknown fields are ignored unless DisallowUnknownFields. `encoding/csv` reads/writes RFC 4180 records.',
        '`os`: Open/Create/ReadFile/WriteFile, Getenv, Exit. `path/filepath`: Join, Ext, Base, WalkDir (OS separators). `log` / `log/slog` (structured logging, Go 1.21).',
      ],
      why: 'Streaming interfaces let you process gigabytes with constant memory and plug any source/sink into any processor.',
      whenToUse: ['Accept io.Reader instead of filenames to make code testable', 'json.Decoder for request bodies', 'slog for structured logs'],
      whenNotToUse: ['os.ReadFile on multi-GB files.', 'Ignoring Scanner.Err() after the loop.'],
      syntax: `f, err := os.Open(path)
if err != nil { return err }
defer f.Close()
sc := bufio.NewScanner(f)
for sc.Scan() { line := sc.Text(); _ = line }
if err := sc.Err(); err != nil { return err }

var cfg Config
if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil { ... }`,
      example: {
        code: `package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Order struct {
	ID       string   \`json:"id"\`
	Amount   int      \`json:"amount"\`
	Coupon   string   \`json:"coupon,omitempty"\`
	Internal string   \`json:"-"\`
	Tags     []string \`json:"tags"\`
}

func main() {
	var o Order
	err := json.NewDecoder(strings.NewReader(\`{"id":"o1","amount":250,"extra":true}\`)).Decode(&o)
	fmt.Println(err, o.ID, o.Amount, o.Tags == nil)
	out, _ := json.Marshal(Order{ID: "o2", Amount: 10, Internal: "secret"})
	fmt.Println(string(out))
}`,
        output: `<nil> o1 250 true
{"id":"o2","amount":10,"tags":null}`,
        notes: ['Unknown field "extra" is ignored.', 'omitempty drops the empty coupon; "-" never serialises Internal.', 'A nil slice encodes as null — initialise to []string{} if clients expect [].'],
      },
      mistakes: ['Unexported struct fields are silently skipped by json.', 'Forgetting bufio.Writer.Flush.', 'Decoding numbers into `any` gives float64 (use Decoder.UseNumber for big IDs).'],
      problems: [
        {
          id: 'm14-t3-p1',
          tier: 'foundation',
          level: 2,
          kind: 'predict',
          title: 'JSON and unexported fields',
          prompt: 'What does this print?',
          code: `package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	Name  string
	email string
	Age   int \`json:"age,omitempty"\`
}

func main() {
	b, _ := json.Marshal(User{Name: "Ana", email: "a@x.io"})
	fmt.Println(string(b))
}`,
          check: { options: ['{"Name":"Ana"}', '{"Name":"Ana","email":"a@x.io","age":0}', '{"name":"Ana"}', '{"Name":"Ana","age":0}'], answerIndex: 0 },
          hints: ['json only sees exported fields.', 'omitempty skips zero values.'],
          solution: '`{"Name":"Ana"}`',
          explanation: 'email is unexported → skipped. Age is 0 with omitempty → skipped. Name has no tag → key "Name".',
        },
        {
          id: 'm14-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'CSV → JSON Lines converter',
          story: 'A bank exports transactions as CSV (id,account,amount); the data lake wants JSON Lines.',
          prompt: 'Write `Convert(r io.Reader, w io.Writer) (int, error)` that reads the CSV header, then streams each row as one JSON object per line, converting amount to int64. Use constant memory. Return rows written; report the line number on bad rows.',
          hints: ['csv.NewReader(r); first Read() is the header.', 'json.NewEncoder(bw) writes a newline after each value; wrap w in bufio.Writer and Flush.'],
          solution: `type Tx struct {
	ID      string \`json:"id"\`
	Account string \`json:"account"\`
	Amount  int64  \`json:"amount"\`
}

func Convert(r io.Reader, w io.Writer) (int, error) {
	cr := csv.NewReader(r)
	if _, err := cr.Read(); err != nil {
		return 0, fmt.Errorf("read header: %w", err)
	}
	bw := bufio.NewWriter(w)
	enc := json.NewEncoder(bw)
	n := 0
	for {
		rec, err := cr.Read()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return n, err
		}
		amt, err := strconv.ParseInt(rec[2], 10, 64)
		if err != nil {
			line, _ := cr.FieldPos(2)
			return n, fmt.Errorf("line %d: amount: %w", line, err)
		}
		if err := enc.Encode(Tx{rec[0], rec[1], amt}); err != nil {
			return n, err
		}
		n++
	}
	return n, bw.Flush()
}`,
          explanation: 'Reader → csv → struct → json encoder → buffered writer: constant memory regardless of file size. csv.Reader validates field counts per record automatically (FieldsPerRecord = header length).',
          complexity: { time: 'O(file size)', space: 'O(1) (one record at a time)' },
          variation: 'Gzip both sides (gzip.NewReader / gzip.NewWriter) and process 4 shards in parallel.',
        },
        {
          id: 'm14-t3-p3',
          tier: 'interview',
          level: 3,
          kind: 'debug',
          title: 'Scanner drops long lines',
          prompt: 'A log processor silently stops at a 100 KB line. Why, and how do you fix and detect it?',
          code: `sc := bufio.NewScanner(f)
for sc.Scan() {
	process(sc.Text())
}
return nil`,
          hints: ['Default max token size is 64 KB.', 'What happens to the error?'],
          solution: 'Scan returns false with `bufio.ErrTooLong` on a line > 64 KB and the loop ends; the code never checks `sc.Err()` so it reports success.\n\nFix:\n\n```go\nsc := bufio.NewScanner(f)\nsc.Buffer(make([]byte, 0, 64*1024), 4*1024*1024)\nfor sc.Scan() {\n\tprocess(sc.Text())\n}\nif err := sc.Err(); err != nil {\n\treturn fmt.Errorf("scan: %w", err)\n}\n```\n\nFor unbounded lines use bufio.Reader.ReadString / ReadSlice.',
          explanation: 'Always check Scanner.Err() after the loop.',
        },
      ],
    },
  ],
}

export const MODULE_15: Module = {
  id: 'm15',
  number: 15,
  track: 'go',
  title: 'File and Network Programming',
  shortTitle: 'Files & Net',
  tagline: 'Files and buffered I/O → TCP/UDP servers and clients → HTTP servers, clients and a REST API.',
  topics: [
    {
      id: 'm15-t1',
      title: 'Reading and Writing Files, Buffered I/O',
      summary: 'Safe writes, large files, directory walking.',
      concept: [
        'Small files: os.ReadFile / os.WriteFile. Large files: os.Open + bufio.Scanner/Reader for streaming.',
        'Safe writes: write to a temp file in the same directory, fsync, close, then os.Rename over the target — rename is atomic on POSIX, so readers never see half a file.',
        'Always check the error from Close on files you wrote (data may be flushed at close). filepath.WalkDir walks a tree efficiently.',
      ],
      why: 'Crashes mid-write corrupt config and state files unless you write atomically.',
      whenToUse: ['Atomic temp+rename for config/state', 'Streaming for anything that could be large'],
      whenNotToUse: ['ReadFile on unbounded user uploads.'],
      syntax: `tmp, err := os.CreateTemp(dir, ".state-*")
// write, tmp.Sync(), tmp.Close()
err = os.Rename(tmp.Name(), path)

filepath.WalkDir(root, func(p string, d fs.DirEntry, err error) error { ... })`,
      example: {
        code: `func WriteAtomic(path string, data []byte) (err error) {
	tmp, err := os.CreateTemp(filepath.Dir(path), ".tmp-*")
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			os.Remove(tmp.Name())
		}
	}()
	if _, err = tmp.Write(data); err != nil {
		tmp.Close()
		return err
	}
	if err = tmp.Sync(); err != nil {
		tmp.Close()
		return err
	}
	if err = tmp.Close(); err != nil {
		return err
	}
	return os.Rename(tmp.Name(), path)
}`,
        notes: ['Temp file in the same directory so Rename stays on one filesystem.', 'Sync forces data to disk before the rename makes it visible.', 'On any error the temp file is cleaned up via the deferred check of the named err.'],
      },
      mistakes: ['Ignoring Close errors on written files.', 'os.Rename across filesystems (fails with EXDEV).', 'Not closing files in loops.'],
      problems: [
        {
          id: 'm15-t1-p1',
          tier: 'foundation',
          level: 1,
          kind: 'concept',
          title: 'Why temp + rename?',
          prompt: 'Why is writing config via `os.WriteFile(path, data, 0644)` unsafe if the process can crash, and what does temp+rename guarantee?',
          check: {
            options: [
              'WriteFile truncates first, so a crash can leave a partial/empty file; rename atomically swaps old for complete new',
              'WriteFile is not thread-safe; rename locks the file',
              'WriteFile does not set permissions; rename does',
              'There is no difference',
            ],
            answerIndex: 0,
          },
          hints: ['What does WriteFile do to the existing file before writing?'],
          solution: 'WriteFile truncates then writes; a crash leaves a truncated file. Temp+fsync+rename means readers see either the complete old file or the complete new one.',
          explanation: 'POSIX rename within one filesystem is atomic.',
        },
        {
          id: 'm15-t1-p2',
          tier: 'practical',
          level: 2,
          kind: 'code',
          title: 'Disk usage by extension',
          story: 'A file-system cleanup tool reports which file types use the most space.',
          prompt: 'Write `UsageByExt(root string) (map[string]int64, error)` using filepath.WalkDir. Lowercase extensions; files without one go under "(none)". Skip unreadable directories instead of failing.',
          hints: ['In the callback, if err != nil and d is a dir, return fs.SkipDir.', 'd.Info() gives the size.'],
          solution: `func UsageByExt(root string) (map[string]int64, error) {
	usage := map[string]int64{}
	err := filepath.WalkDir(root, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			if d != nil && d.IsDir() {
				return fs.SkipDir
			}
			return nil
		}
		if d.IsDir() {
			return nil
		}
		info, err := d.Info()
		if err != nil {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(p))
		if ext == "" {
			ext = "(none)"
		}
		usage[ext] += info.Size()
		return nil
	})
	return usage, err
}`,
          explanation: 'WalkDir avoids an extra stat per entry compared with Walk; Info() stats only files we need.',
          complexity: { time: 'O(files)', space: 'O(extensions)' },
          variation: 'Parallelise with a worker pool per top-level directory and compare against the sequential version.',
        },
        {
          id: 'm15-t1-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'Tail the last N lines of a huge file',
          prompt: 'Write `Tail(path string, n int) ([]string, error)` that returns the last n lines of a 50 GB log without reading the whole file. Read backwards in 64 KB chunks with Seek/ReadAt.',
          hints: ['Start at size, read chunk [max(0, pos−64K), pos), count newlines.', 'Stop once you have seen n+1 newlines (or reached offset 0), then split the collected tail.'],
          solution: `func Tail(path string, n int) ([]string, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	st, err := f.Stat()
	if err != nil {
		return nil, err
	}
	const chunk = 64 << 10
	var buf []byte
	pos := st.Size()
	for pos > 0 && bytes.Count(buf, []byte{'\\n'}) <= n {
		start := max(0, pos-chunk)
		part := make([]byte, pos-start)
		if _, err := f.ReadAt(part, start); err != nil && !errors.Is(err, io.EOF) {
			return nil, err
		}
		buf = append(part, buf...)
		pos = start
	}
	lines := strings.Split(strings.TrimRight(string(buf), "\\n"), "\\n")
	if len(lines) > n {
		lines = lines[len(lines)-n:]
	}
	return lines, nil
}`,
          explanation: 'Only the last few chunks are read: O(bytes in the last n lines), independent of file size.',
          complexity: { time: 'O(size of last n lines)', space: 'O(size of last n lines)' },
          variation: 'Implement `tail -f`: keep reading as the file grows and handle log rotation (inode change).',
        },
      ],
    },
    {
      id: 'm15-t2',
      title: 'TCP and UDP: Servers, Clients and Concurrent Connections',
      summary: 'net.Listen, Accept loops, a goroutine per connection, deadlines.',
      concept: [
        'TCP server: `ln, _ := net.Listen("tcp", ":9000")`, loop `conn, err := ln.Accept()`, handle each conn in its own goroutine. net.Conn is an io.Reader + io.Writer.',
        'Clients: `net.Dial("tcp", addr)` or `net.DialTimeout`; better `(&net.Dialer{}).DialContext(ctx, …)`. Always set deadlines (`conn.SetReadDeadline`) — otherwise a silent peer holds a goroutine forever.',
        'TCP is a byte stream, not messages: you must frame messages (newline-delimited, length-prefixed). UDP (`net.ListenPacket("udp", …)`) preserves message boundaries but may drop, duplicate or reorder.',
        'Graceful shutdown: close the listener (Accept returns an error), signal handlers via ctx, wait for active connections.',
      ],
      why: 'Goroutine-per-connection with blocking I/O is simple to write and scales to tens of thousands of connections thanks to the netpoller.',
      whenToUse: ['Custom protocols, proxies, chat, IoT gateways', 'UDP for metrics/telemetry where loss is acceptable'],
      whenNotToUse: ['Building your own HTTP — use net/http.', 'Assuming one Read returns one whole message.'],
      syntax: `ln, err := net.Listen("tcp", ":9000")
for {
	conn, err := ln.Accept()
	if err != nil { return err }
	go handle(conn)
}

func handle(c net.Conn) {
	defer c.Close()
	sc := bufio.NewScanner(c)
	for sc.Scan() {
		fmt.Fprintf(c, "echo: %s\\n", sc.Text())
	}
}`,
      example: {
        code: `package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
	"time"
)

func handle(c net.Conn) {
	defer c.Close()
	sc := bufio.NewScanner(c)
	for {
		c.SetReadDeadline(time.Now().Add(2 * time.Minute))
		if !sc.Scan() {
			return
		}
		fmt.Fprintln(c, strings.ToUpper(sc.Text()))
	}
}

func main() {
	ln, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("echo server on :9000  (try: nc localhost 9000)")
	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Println("accept:", err)
			continue
		}
		go handle(conn)
	}
}`,
        notes: ['Each connection gets its own goroutine and Scanner.', 'The read deadline is refreshed per message: idle clients are dropped after 2 minutes.', 'Newline framing turns the byte stream into messages.'],
      },
      mistakes: ['No deadlines → leaked goroutines from dead peers.', 'Treating each Read as a full message.', 'Writing to a conn from multiple goroutines without serialising.'],
      problems: [
        {
          id: 'm15-t2-p1',
          tier: 'foundation',
          level: 2,
          kind: 'concept',
          title: 'Stream vs message',
          prompt: 'A client writes "HELLO\\n" then "WORLD\\n" with two Write calls. Without a Scanner, what can a single `n, _ := conn.Read(buf)` on the server return?',
          check: {
            options: ['Any prefix split: "HEL", "HELLO\\nWOR", "HELLO\\nWORLD\\n" …', 'Exactly "HELLO\\n"', 'Exactly "HELLO\\nWORLD\\n"', 'Always an error'],
            answerIndex: 0,
          },
          hints: ['TCP preserves order, not write boundaries.'],
          solution: 'Any contiguous chunk of the stream — writes may be split or merged.',
          explanation: 'Always frame messages and read with a buffered reader.',
        },
        {
          id: 'm15-t2-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'TCP chat server',
          story: 'A messaging startup wants a minimal chat room: every line a client sends is broadcast to all others, prefixed with the sender’s address.',
          prompt: 'Write a chat server with a single "hub" goroutine owning the client set (no mutex), channels for join/leave/broadcast, and per-client buffered outboxes so one slow client cannot block others (drop messages if its outbox is full).',
          hints: ['Hub: `for { select { case c := <-join: …; case c := <-leave: …; case m := <-broadcast: … } }`.', 'Each client has a writer goroutine draining its outbox channel.'],
          solution: `type client struct {
	conn net.Conn
	out  chan string
}

type message struct {
	from *client
	text string
}

func hub(join, leave chan *client, broadcast chan message) {
	clients := map[*client]bool{}
	for {
		select {
		case c := <-join:
			clients[c] = true
		case c := <-leave:
			if clients[c] {
				delete(clients, c)
				close(c.out)
			}
		case m := <-broadcast:
			for c := range clients {
				if c == m.from {
					continue
				}
				select {
				case c.out <- m.text:
				default: // slow client: drop
				}
			}
		}
	}
}

func serve(c *client, join, leave chan *client, broadcast chan message) {
	go func() { // writer
		for line := range c.out {
			fmt.Fprintln(c.conn, line)
		}
	}()
	join <- c
	sc := bufio.NewScanner(c.conn)
	for sc.Scan() {
		broadcast <- message{c, c.conn.RemoteAddr().String() + ": " + sc.Text()}
	}
	leave <- c
	c.conn.Close()
}

func main() {
	join, leave := make(chan *client), make(chan *client)
	broadcast := make(chan message)
	go hub(join, leave, broadcast)
	ln, err := net.Listen("tcp", ":9001")
	if err != nil {
		log.Fatal(err)
	}
	for {
		conn, err := ln.Accept()
		if err != nil {
			continue
		}
		go serve(&client{conn: conn, out: make(chan string, 32)}, join, leave, broadcast)
	}
}`,
          explanation: 'The hub serialises all access to the client map — "share memory by communicating". Non-blocking sends to bounded outboxes isolate slow consumers. Closing c.out ends the writer goroutine.',
          complexity: { time: 'O(clients) per broadcast', space: 'O(clients × outbox)' },
          variation: 'Add nicknames (/nick), rooms (/join #go) and graceful shutdown on SIGINT.',
        },
        {
          id: 'm15-t2-p3',
          tier: 'interview',
          level: 3,
          kind: 'code',
          title: 'UDP metrics collector',
          story: 'IoT sensors send `device_id:temp` datagrams. Losing some is fine; blocking is not.',
          prompt: 'Write `Collect(ctx context.Context, addr string, out chan<- Reading) error` using net.ListenPacket. Parse each datagram, drop malformed ones, stop when ctx is cancelled (unblock ReadFrom by closing the conn).',
          hints: ['`pc, err := net.ListenPacket("udp", addr)`.', 'A goroutine waits on ctx.Done() and calls pc.Close(); ReadFrom then returns an error.'],
          solution: `type Reading struct {
	Device string
	Temp   float64
}

func Collect(ctx context.Context, addr string, out chan<- Reading) error {
	pc, err := net.ListenPacket("udp", addr)
	if err != nil {
		return err
	}
	go func() {
		<-ctx.Done()
		pc.Close()
	}()
	buf := make([]byte, 1500)
	for {
		n, _, err := pc.ReadFrom(buf)
		if err != nil {
			if ctx.Err() != nil {
				return nil
			}
			return err
		}
		dev, val, ok := strings.Cut(string(buf[:n]), ":")
		if !ok {
			continue
		}
		t, err := strconv.ParseFloat(strings.TrimSpace(val), 64)
		if err != nil {
			continue
		}
		select {
		case out <- Reading{dev, t}:
		case <-ctx.Done():
			return nil
		}
	}
}`,
          explanation: 'Each ReadFrom returns exactly one datagram. Closing the PacketConn is the standard way to unblock a blocked read on cancel. 1500 bytes matches typical MTU.',
          complexity: { time: 'O(1) per datagram', space: 'O(1)' },
          variation: 'Aggregate per-device min/max/avg over 10-second windows and emit summaries instead of raw readings.',
        },
      ],
    },
    {
      id: 'm15-t3',
      title: 'HTTP Server, HTTP Client and a REST API',
      summary: 'net/http with Go 1.22 routing patterns, timeouts everywhere, JSON in and out.',
      concept: [
        'Server: `mux := http.NewServeMux()`; Go 1.22 patterns support methods and wildcards: `mux.HandleFunc("GET /orders/{id}", h)` and `r.PathValue("id")`. Handlers implement `ServeHTTP(w, r)`.',
        'Production servers set ReadHeaderTimeout/ReadTimeout/WriteTimeout/IdleTimeout and shut down gracefully with `srv.Shutdown(ctx)`.',
        'Client: never use http.DefaultClient without a Timeout. Reuse one *http.Client (it pools connections). Always close resp.Body (and drain it) so connections are reused. Use `http.NewRequestWithContext`.',
        'Each request runs in its own goroutine; shared state in handlers must be synchronised. r.Context() is cancelled when the client disconnects.',
      ],
      why: 'net/http is production-grade; knowing its timeouts and lifecycle avoids the classic outages (hung connections, exhausted file descriptors).',
      whenToUse: ['ServeMux for most APIs (no framework needed)', 'Middleware via handler wrapping', 'httptest for testing handlers'],
      whenNotToUse: ['http.Get in production code (no timeout).', 'Writing headers after the body has started (ignored).'],
      syntax: `mux := http.NewServeMux()
mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
})
srv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
log.Fatal(srv.ListenAndServe())

client := &http.Client{Timeout: 10 * time.Second}`,
      example: {
        code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

type Book struct {
	ID    string \`json:"id"\`
	Title string \`json:"title"\`
}

type Store struct {
	mu    sync.RWMutex
	books map[string]Book
}

func (s *Store) get(w http.ResponseWriter, r *http.Request) {
	s.mu.RLock()
	b, ok := s.books[r.PathValue("id")]
	s.mu.RUnlock()
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(b)
}

func (s *Store) create(w http.ResponseWriter, r *http.Request) {
	var b Book
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&b); err != nil || b.ID == "" {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	s.books[b.ID] = b
	s.mu.Unlock()
	w.WriteHeader(http.StatusCreated)
}

func main() {
	s := &Store{books: map[string]Book{}}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /books/{id}", s.get)
	mux.HandleFunc("POST /books", s.create)
	srv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	log.Fatal(srv.ListenAndServe())
}`,
        notes: ['Method + path patterns route without a framework (Go 1.22).', 'MaxBytesReader caps request bodies.', 'The RWMutex protects the map because handlers run concurrently.'],
      },
      mistakes: ['Not closing resp.Body → connection leak.', 'No server timeouts → Slowloris.', 'Calling w.WriteHeader after writing the body.'],
      problems: [
        {
          id: 'm15-t3-p1',
          tier: 'foundation',
          level: 2,
          kind: 'debug',
          title: 'The client that exhausts sockets',
          prompt: 'After a few hours this poller fails with "too many open files". Why? List every fix.',
          code: `func poll(url string) (int, error) {
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	return resp.StatusCode, nil
}`,
          hints: ['What happens to the body and its connection?', 'What timeout does http.Get use?'],
          solution: '1. resp.Body is never closed → the connection is never returned to the pool and the fd leaks.\n2. http.Get uses DefaultClient with no timeout → a hung server holds a goroutine and socket forever.\n\n```go\nvar client = &http.Client{Timeout: 10 * time.Second}\n\nfunc poll(ctx context.Context, url string) (int, error) {\n\treq, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)\n\tif err != nil { return 0, err }\n\tresp, err := client.Do(req)\n\tif err != nil { return 0, err }\n\tdefer resp.Body.Close()\n\tio.Copy(io.Discard, resp.Body) // drain so the conn can be reused\n\treturn resp.StatusCode, nil\n}\n```',
          explanation: 'Close + drain the body; one shared client with a timeout; ctx for cancellation.',
        },
        {
          id: 'm15-t3-p2',
          tier: 'practical',
          level: 3,
          kind: 'code',
          title: 'Test a handler with httptest',
          prompt: 'Write a table-driven test for the Store example’s `GET /books/{id}` route using httptest.NewRecorder and the real mux: cases for found (200 + JSON body) and missing (404).',
          hints: ['Build the mux in a helper so tests and main share routing.', '`req := httptest.NewRequest("GET", "/books/b1", nil); mux.ServeHTTP(rec, req)`.'],
          solution: `func newMux(s *Store) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /books/{id}", s.get)
	mux.HandleFunc("POST /books", s.create)
	return mux
}

func TestGetBook(t *testing.T) {
	s := &Store{books: map[string]Book{"b1": {ID: "b1", Title: "Go"}}}
	mux := newMux(s)
	tests := []struct {
		name     string
		path     string
		wantCode int
		wantBody string
	}{
		{"found", "/books/b1", http.StatusOK, \`{"id":"b1","title":"Go"}\`},
		{"missing", "/books/zz", http.StatusNotFound, ""},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rec := httptest.NewRecorder()
			mux.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, tc.path, nil))
			if rec.Code != tc.wantCode {
				t.Fatalf("code = %d, want %d", rec.Code, tc.wantCode)
			}
			if tc.wantBody != "" && strings.TrimSpace(rec.Body.String()) != tc.wantBody {
				t.Errorf("body = %s, want %s", rec.Body, tc.wantBody)
			}
		})
	}
}`,
          explanation: 'Routing through the real mux ensures PathValue is populated. No network sockets are opened.',
          complexity: { time: 'O(cases)', space: 'O(1)' },
          variation: 'Add a POST test that then GETs the created book, and run with -race and t.Parallel().',
        },
        {
          id: 'm15-t3-p3',
          tier: 'interview',
          level: 4,
          kind: 'code',
          title: 'Graceful shutdown',
          story: 'Kubernetes sends SIGTERM and gives the pod 30 seconds; in-flight payments must finish.',
          prompt: 'Write main() that starts the HTTP server, waits for SIGINT/SIGTERM via signal.NotifyContext, then calls Shutdown with a 25 s timeout, logging whether shutdown was clean.',
          hints: ['Run ListenAndServe in a goroutine; it returns http.ErrServerClosed after Shutdown.', 'Shutdown stops accepting, then waits for active requests until its ctx expires.'],
          solution: `func main() {
	srv := &http.Server{Addr: ":8080", Handler: newMux(), ReadHeaderTimeout: 5 * time.Second}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	errc := make(chan error, 1)
	go func() { errc <- srv.ListenAndServe() }()

	select {
	case err := <-errc:
		log.Fatalf("server failed: %v", err)
	case <-ctx.Done():
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("forced shutdown: %v", err)
		return
	}
	log.Println("clean shutdown")
}`,
          explanation: 'Shutdown closes listeners, closes idle connections, and waits for active handlers. The 25 s budget leaves headroom before Kubernetes’ SIGKILL at 30 s. Long-running handlers should watch r.Context() or use srv.RegisterOnShutdown.',
          complexity: { time: '≤ 25 s shutdown', space: 'O(1)' },
          variation: 'Also stop a background Kafka consumer and flush metrics, in the right order, within the same deadline.',
        },
      ],
    },
  ],
}
