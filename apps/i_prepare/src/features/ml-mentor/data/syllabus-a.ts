import type { MLModule } from '../types'

/**
 * Syllabus part A — Modules 01–03.
 * Content is deliberately concise: each topic teaches one interview-ready idea.
 */

export const MODULE_01: MLModule = {
  id: 'm01',
  number: 1,
  title: 'Python Foundations for ML',
  shortTitle: 'Python Foundations',
  tagline: 'The language every ML interview starts with.',
  interviewGoal:
    'Write clean Python on a whiteboard, manipulate arrays and DataFrames fluently, and explain Python-for-ML idioms.',
  topics: [
    {
      id: 't01-01',
      title: 'Python Syntax, Variables & Data Types',
      summary: 'Everything in Python is an object with a dynamic type — interviewers test this constantly.',
      lesson: [
        'Python is dynamically typed: a name is bound to a value, and the value carries the type. `x = 5` then `x = "hi"` is legal because the name simply re-binds. Types you use daily: int, float, str, bool, NoneType.',
        'Key syntax facts: indentation (4 spaces) defines blocks instead of braces; comments start with #; f-strings (`f"{name} scored {score:.2f}"`) format values; `type(x)` inspects a type, `isinstance(x, int)` checks membership — isinstance is preferred because it respects inheritance.',
        'Mutable vs immutable is the classic interview trap. int, float, str, tuple, bool are immutable (cannot be changed in place); list, dict, set are mutable. Assigning a mutable object to two names makes both names point at the same object.',
      ],
      intuition: 'Think of a variable as a sticky note with a name on an object, not a box that contains it. Two notes can stick to the same box.',
      keyPoints: [
        'Dynamic typing: names have no type; values do',
        'Immutable: int, float, str, tuple · Mutable: list, dict, set',
        'a = b copies the reference, never the object',
        'f-strings for formatting; isinstance() over type() for checks',
      ],
      exampleCode:
        "a = [1, 2, 3]\nb = a          # same object!\nb.append(4)\nprint(a)        # [1, 2, 3, 4]\n\nc = a.copy()    # shallow copy — new outer list\nc.append(5)\nprint(a)        # still [1, 2, 3, 4]\nprint(f\"{3.14159:.2f}\")  # 3.14",
      practiceExercise:
        'Open a Python shell. Predict the output of: a = [1,2]; b = a; b += [3]; print(a). Then write one line each that creates a str, int, float, bool, list, dict, set and tuple, and print type() of each.',
      codingTask:
        'Write swap(a, b) that returns the swapped pair using tuple unpacking, and demo(a) that prints the type and mutability of a given value.',
    },
    {
      id: 't01-02',
      title: 'Conditions & Loops',
      summary: 'for/while, range, and the truthiness rules that decide whether an if fires.',
      lesson: [
        'if / elif / else branch on truthiness. Falsy values: 0, 0.0, "", [], {}, set(), tuple(), None, False. Everything else is truthy — so `if items:` is the idiomatic empty check.',
        'for iterates over any iterable: lists, strings, dicts, files, generators. `range(start, stop, step)` produces numbers lazily. `enumerate(seq)` gives (index, value) pairs; `zip(a, b)` pairs two sequences element-wise. Both are constant interview favourites.',
        'while repeats until its condition turns falsy — use it when the number of iterations is unknown. break exits the loop, continue skips to the next iteration, and for/else runs the else block only if no break happened (a genuinely distinctive Python feature).',
      ],
      intuition: 'A for loop is "for each item in this container"; a while loop is "keep going while this statement is true".',
      keyPoints: [
        'Falsy: 0, "", [], {}, None, False — `if not lst:` is idiomatic',
        'enumerate() for index+value, zip() for parallel sequences',
        'break exits, continue skips, for/else runs when no break',
        'range(5) → 0,1,2,3,4 (stop is exclusive)',
      ],
      exampleCode:
        'scores = [72, 91, 55]\nfor i, s in enumerate(scores):\n    if s >= 90:\n        print(f"{i}: excellent")\n    elif s >= 60:\n        print(f"{i}: pass")\n    else:\n        print(f"{i}: retry")\n\nnames = ["Ada", "Alan"]\nfor name, score in zip(names, scores):\n    print(name, score)',
      practiceExercise:
        'Write a loop that classifies a list of numbers into "positive", "negative", "zero" buckets and prints the three buckets. Rewrite it using continue to skip zeros.',
      codingTask:
        'Implement fizzbuzz(n) returning a list: multiples of 3 → "Fizz", of 5 → "Buzz", both → "FizzBuzz", else the number.',
    },
    {
      id: 't01-03',
      title: 'Functions',
      summary: 'def, arguments, *args/**kwargs, default-value pitfalls and scope — the LEGB rule.',
      lesson: [
        'Functions are defined with def, may return any object (or a tuple for multiple returns), and are first-class: you can pass them around, store them in lists, return them. A function without an explicit return gives back None.',
        'Parameters: positional, keyword, defaults, *args (extra positional as a tuple), **kwargs (extra keyword as a dict). Interview trap: a mutable default (`def f(x, acc=[])`) is created once and shared across calls — the standard fix is `acc=None` then create inside.',
        'Scope follows LEGB: Local → Enclosing → Global → Built-in. Assigning inside a function creates a local unless you declare global/nonlocal. Closures remember enclosing variables — that is how decorators work.',
      ],
      intuition: 'A function is a machine: inputs (parameters) go in, one object comes out (return). Default parameter values are built once, when the machine is built — not on each use.',
      keyPoints: [
        'def f(a, b=2, *args, **kwargs) covers all argument styles',
        'Mutable default arguments are evaluated once — classic bug/interview question',
        'LEGB: Local, Enclosing, Global, Built-in scope lookup',
        'Functions are objects: they can be passed, returned, stored',
      ],
      exampleCode:
        "def summarize(values, prefix='mean', **stats):\n    result = {prefix: sum(values) / len(values)}\n    result.update(stats)\n    return result\n\ndef bad_append(item, acc=[]):     # shared between calls!\n    acc.append(item)\n    return acc\n\ndef good_append(item, acc=None):\n    if acc is None:\n        acc = []\n    acc.append(item)\n    return acc",
      practiceExercise:
        'Call summarize([1,2,3], prefix="median", max=3, min=1) and predict the dict. Then run bad_append three times and explain why the list grows across calls.',
      codingTask:
        'Write mean_std(values, ddof=0) returning (mean, std) in one pass without imports, plus a docstring.',
    },
    {
      id: 't01-04',
      title: 'Lists, Tuples, Sets & Dictionaries',
      summary: 'The four core collections — when to use which is a guaranteed interview question.',
      lesson: [
        'List: ordered, mutable, indexable, allows duplicates — the default sequence. Tuple: ordered, immutable, hashable (usable as dict keys) — use for fixed records like (row, col). Set: unordered, mutable, unique elements, O(1) membership tests and algebra (&, |, -, ^). Dict: insertion-ordered (3.7+) key→value map, O(1) lookup, keys must be hashable.',
        'Core operations: list.append/pop/sort/slice (s[i:j:step]); dict.get(key, default), .items(), .values(), .setdefault(); set.add, .discard. Slicing never raises IndexError — it clips silently, another favourite gotcha.',
        'Choosing: need order + edits → list; fixed shape or dict key → tuple; membership/uniqueness → set; lookups by key → dict. Complexity: list membership is O(n), set/dict membership is O(1) — that answer alone impresses.',
      ],
      intuition: 'List = shopping list (order matters, can change). Tuple = coordinate (fixed). Set = guest list (no duplicates). Dict = phone book (look up by name).',
      keyPoints: [
        'List mutable & ordered; tuple immutable & hashable',
        'Set: unique elements, O(1) membership, supports & | - ^',
        'Dict: insertion-ordered, O(1) get, keys must be hashable',
        'list `in` is O(n); set/dict `in` is O(1)',
      ],
      exampleCode:
        "rows = [('a', 1), ('b', 2)]\nlookup = dict(rows)          # {'a': 1, 'b': 2}\nlookup.get('c', 0)           # 0, no KeyError\n\nids = [1, 2, 2, 3]\nunique = set(ids)            # {1, 2, 3}\ncommon = {1, 2} & unique     # {1, 2}\n\npoint = (3, 4)\ncoords = {point: 'origin-ish'}  # tuple as dict key works",
      practiceExercise:
        'Given two lists of student ids (attended, passed), compute: who attended but not passed (set difference), who did both (intersection), and the count of unique attendees — using sets only.',
      codingTask:
        'Implement word_counts(text) returning a dict word → count, then top_k(counts, k) returning the k most common words.',
    },
    {
      id: 't01-05',
      title: 'List Comprehensions & Generators',
      summary: 'The Pythonic way to transform data — and the memory story interviewers probe.',
      lesson: [
        'A comprehension builds a list in one expression: [expr for x in seq if cond]. Dict and set comprehensions exist too. They replace map/filter chains and are the idiomatic way to clean columns or build features.',
        'A generator expression uses parentheses instead of brackets: (x*x for x in seq). It is lazy — values are produced one at a time, so it handles huge streams with O(1) memory. Use it when you consume once; use a list when you need the data repeatedly.',
        'yield turns a function into a generator function: each yield pauses and resumes state on the next call. Interview angle: sum(x for x in ...) vs sum([...]) — same result, very different memory profile on millions of rows.',
      ],
      intuition: 'A list comprehension builds the whole warehouse before you shop; a generator hands you items from a conveyor belt one at a time.',
      keyPoints: [
        '[expr for x in seq if cond] — read as "collect expr for each x where cond"',
        '() generator expression is lazy and memory-efficient',
        'yield creates a generator function; state resumes between calls',
        'Comprehensions are usually faster and clearer than loops that append',
      ],
      exampleCode:
        "nums = range(10)\nsquares = [n * n for n in nums if n % 2 == 0]  # [0, 4, 16, 36, 64]\nlabels = {n: ('even' if n % 2 == 0 else 'odd') for n in range(4)}\n\nstream = (n * n for n in nums)   # nothing computed yet\nfirst_two = [next(stream), next(stream)]  # 0, 1\n\ndef countdown(k):\n    while k > 0:\n        yield k\n        k -= 1",
      practiceExercise:
        'Convert a loop that appends cleaned strings (strip + lower + skip empty) into a comprehension. Then rewrite the same logic as a generator and print only the first item to prove laziness.',
      codingTask:
        'Write moving_average(values, window) as a generator yielding each average without building an intermediate list.',
    },
    {
      id: 't01-06',
      title: 'Exception Handling & Files',
      summary: 'try/except/finally, raising, and the with-statement for files — robustness questions.',
      lesson: [
        'Wrap risky code in try, catch specific exceptions in except (ValueError, KeyError, ZeroDivisionError, TypeError…), run cleanup in finally. Catching bare `except:` hides bugs — always catch the narrowest type that you can actually handle.',
        'raise creates errors (`raise ValueError(f"bad shape {shape}")`). Validation failures in data pipelines should fail loudly with a clear message rather than silently producing garbage — interviewers love hearing "fail fast".',
        'with open(path) as f: closes the file even if an exception occurs — the context-manager protocol. Modes: "r" read, "w" truncate-write, "a" append. For ML work you mostly read CSVs via pandas, but knowing with-blocks signals production maturity.',
      ],
      intuition: 'try/except is a safety net around a tightrope: catch only the falls you can survive, and always close the door behind you (finally / with).',
      keyPoints: [
        'Catch specific exceptions; bare except swallows real bugs',
        'finally always runs — put cleanup there',
        'with open(...) guarantees the file handle closes',
        'raise early with clear messages: fail fast on bad data',
      ],
      exampleCode:
        'def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n    finally:\n        pass  # cleanup would go here\n\ntry:\n    with open("scores.txt") as f:\n        lines = [line.strip() for line in f if line.strip()]\nexcept FileNotFoundError:\n    lines = []',
      practiceExercise:
        'Write a function read_ints(path) that returns a list of integers from a file, returning [] when the file is missing and skipping malformed lines. Test it on a missing file and a file containing "3, x, 5".',
      codingTask:
        'Write parse_number(value) that converts strings to float and raises ValueError with an informative message for invalid input.',
    },
    {
      id: 't01-07',
      title: 'Basic OOP, Modules & Packages',
      summary: 'Classes you may write in ML code: a Model wrapper, a Pipeline step — plus how imports work.',
      lesson: [
        'A class bundles data (attributes) and behaviour (methods). __init__ sets up state on self. Inheritance lets a subclass reuse and extend a parent; you will mostly read it in sklearn (all estimators share fit/predict). Dunder methods (__repr__, __len__, __call__) make objects feel native to Python.',
        'In ML code you write small classes for pipelines: a class holding fitted state (like a scaler remembering min/max). Module = one .py file; package = a folder of modules. Imports: `import numpy as np` for speed of typing; `from sklearn.linear_model import LinearRegression` for direct use.',
        'Interview angle: why does sklearn expose .fit()/.predict() on every model? Because a consistent interface lets you swap estimators — the same OOP idea: program to the interface, not the implementation.',
      ],
      intuition: 'A class is a blueprint; each instance is a fitted model with its own learned parameters stored on self.',
      keyPoints: [
        '__init__(self, ...) initialises state; methods take self explicitly',
        'Inheritance shares behaviour; duck typing cares only about methods present',
        'Module = file, package = folder; import via import x / from x import y',
        'Common interface (fit/predict) is why sklearn models are interchangeable',
      ],
      exampleCode:
        'class MeanModel:\n    """Predicts the training mean — the simplest baseline."""\n\n    def __init__(self):\n        self.mean_ = None\n\n    def fit(self, y):\n        self.mean_ = sum(y) / len(y)\n        return self\n\n    def predict(self, n):\n        return [self.mean_] * n\n\nmodel = MeanModel().fit([2, 4, 6])\nprint(model.predict(2))  # [4.0, 4.0]',
      practiceExercise:
        'Extend MeanModel with a score(y_true, y_pred) method computing accuracy of "within ±10% of the mean". Instantiate, fit and score it.',
      codingTask:
        'Implement a Standardizer class with fit(X) storing per-column mean/std and transform(X) applying (x-mean)/std, plus fit_transform().',
    },
    {
      id: 't01-08',
      title: 'NumPy Basics',
      summary: 'ndarray, vectorisation and broadcasting — the vocabulary underneath every ML library.',
      lesson: [
        'np.array wraps a grid of one dtype; .shape is (rows, cols). Vectorised operations apply element-wise in compiled C — np.mean(arr) beats a Python loop by orders of magnitude. This is the single most important Python-for-ML performance idea.',
        'Indexing: arr[rows, cols] with slices, boolean masks (arr[arr > 0]), fancy indexing (arr[[0, 2], :]). Axis semantics: np.sum(arr, axis=0) collapses rows (column sums), axis=1 collapses columns — expect an interview question here.',
        'Broadcasting lets arrays of compatible shapes combine without copying: (n,1) + (1,m) → (n,m). Rules align shapes from the right; a dimension of 1 stretches. Reshape (-1 infers), concatenate and stack build your matrices.',
      ],
      intuition: 'A NumPy array is a spreadsheet you operate on with one formula for every cell at once — the formula is compiled, not interpreted.',
      keyPoints: [
        'Vectorise: replace Python loops with whole-array operations',
        'Boolean masking: arr[arr > mean] filters in one line',
        'axis=0 → down the rows (per-column result); axis=1 → across the row',
        'Broadcasting aligns shapes from the right; size-1 dims stretch',
      ],
      exampleCode:
        "import numpy as np\n\nX = np.array([[1., 2.], [3., 4.], [5., 6.]])\nprint(X.shape)                 # (3, 2)\nprint(X.mean(axis=0))          # per-column mean [3., 4.]\n\nstandardized = (X - X.mean(axis=0)) / X.std(axis=0)\nmask = X[:, 1] > 3             # boolean mask on column 1\nprint(X[mask])                 # rows where col1 > 3\n\ndist = np.sqrt(((X - X[0]) ** 2).sum(axis=1))  # broadcast to (3,2)",
      practiceExercise:
        'Create a (5, 3) array of random grades. Compute per-student averages (axis?), per-subject averages, and select rows where the average exceeds the class mean — using masks, not loops.',
      codingTask:
        'Implement euclidean_distances(A, B) for shapes (n,d), (m,d) returning (n,m) using only broadcasting and np.sqrt — no loops.',
    },
    {
      id: 't01-09',
      title: 'Pandas Basics',
      summary: 'Series, DataFrame, selection, groupby and merge — the daily-driver tool of every ML engineer.',
      lesson: [
        'A DataFrame is a table of named Series (columns). Build from dicts or read_csv. df.head/info/describe are the first commands on any new dataset — expect to say them in every practical interview.',
        'Selection: df[\"col\"] → Series; df[[\"a\", \"b\"]] → DataFrame; boolean filtering df[df[\"age\"] > 30]; loc is label-based, iloc position-based. Assigning new columns: df[\"ratio\"] = df[\"a\"] / df[\"b\"].',
        'groupby follows split-apply-combine: df.groupby(\"city\")[\"sales\"].mean(). merge joins tables on keys (like SQL JOIN); concat stacks them. value_counts() and sort_values() close most quick analyses.',
      ],
      intuition: 'A DataFrame is a dictionary of columns. groupby asks each group the same question and stacks the answers.',
      keyPoints: [
        'df.head/info/describe = first three commands on any dataset',
        'loc → labels, iloc → positions; boolean masks filter rows',
        'groupby(col)[col2].agg() is split-apply-combine',
        'merge = SQL join; concat = stack tables',
      ],
      exampleCode:
        "import pandas as pd\n\ndf = pd.DataFrame({\n    'city': ['Pune', 'Pune', 'Delhi', 'Delhi'],\n    'sales': [100, 150, 200, 50],\n    'visits': [10, 12, 30, 9],\n})\ndf['conv'] = df['sales'] / df['visits']\nprint(df[df['sales'] > 100])\nprint(df.groupby('city')['sales'].agg(['mean', 'sum']))\nprint(df.sort_values('conv', ascending=False).head(2))",
      practiceExercise:
        'Load any CSV (e.g. Titanic). Print shape, dtypes, missing counts (df.isna().sum()) and the mean of one numeric column grouped by one categorical column.',
      codingTask:
        'Implement top_city(df) that returns the city with the highest mean conversion, handling a df with zero rows by returning None.',
    },
    {
      id: 't01-10',
      title: 'Matplotlib Basics',
      summary: 'The plots that carry an EDA story: histogram, scatter, bar — and how to label them properly.',
      lesson: [
        'Two interfaces exist: the pyplot state machine (plt.plot) and the object-oriented API (fig, ax = plt.subplots(); ax.plot). Prefer the OO API — multiple subplots and cleaner code. Always label axes and title the figure; unlabelled plots read as unfinished work in interviews.',
        'Core chart set: ax.hist(x, bins=20) for distributions, ax.scatter(x, y) for relationships, ax.bar(labels, heights) for category comparison, ax.boxplot for spread/outliers, ax.plot for trends. plt.tight_layout() fixes cramped subplots.',
        'Interview angle: choosing the plot is the answer. Distribution → histogram; relationship between two numerics → scatter; category vs numeric → bar/box; time → line. Saying "I would plot X because it answers question Y" is exactly what examiners want.',
      ],
      intuition: 'Charts are sentences: the chart type is the verb (compare, distribute, relate), the axes are the nouns.',
      keyPoints: [
        'fig, ax = plt.subplots(figsize=(8, 4)) — the OO pattern',
        'hist → distribution · scatter → relationship · bar → compare',
        'Always set ax.set_xlabel / ylabel / title',
        'plt.tight_layout() and plt.show() to finish',
      ],
      exampleCode:
        'import matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 2, figsize=(10, 4))\naxes[0].hist(df["sales"], bins=10, color="#4f9cf9")\naxes[0].set(title="Sales distribution", xlabel="Sales")\naxes[1].scatter(df["visits"], df["sales"])\naxes[1].set(title="Visits vs sales", xlabel="Visits", ylabel="Sales")\nplt.tight_layout()\nplt.show()',
      practiceExercise:
        'For any numeric column: draw a histogram, a boxplot, and a scatter of it against another column in one figure with three subplots, each labelled.',
      codingTask:
        'Write plot_series(ax, y, title) that draws a line chart with grid and labels — designed for reuse across subplots.',
    },
  ],
}

export const MODULE_02: MLModule = {
  id: 'm02',
  number: 2,
  title: 'Mathematics for Machine Learning',
  shortTitle: 'Mathematics',
  tagline: 'Just enough stats, linear algebra and calculus to reason — not to suffer.',
  interviewGoal:
    'Explain variance, probability, the normal distribution, dot products and gradient descent in plain words with small numeric examples.',
  topics: [
    {
      id: 't02-01',
      title: 'Mean, Median, Mode & Range',
      summary: 'Three measures of centre — and when each one lies.',
      lesson: [
        'Mean = sum / count. It uses every value but is dragged by outliers: one billionaire in the room raises the average income enormously. Median = the middle value when sorted; robust to outliers, which is why house prices are reported as medians. Mode = most frequent value; the only centre for categories (most common city).',
        'Range = max − min, the crudest spread measure — a single typo (35000 → 350000) explodes it. For skewed data (income, prices), median + IQR tells the true story; for roughly symmetric data, mean ± std is fine. “Which measure would you use for this column?” is a real interview question.',
      ],
      intuition: 'Mean shares the total equally; median stands at the middle of the queue; mode is the most popular kid.',
      keyPoints: [
        'Mean sensitive to outliers; median robust; mode for categories',
        'Skewed distribution → report median, not mean',
        'Range collapses with one bad value — check min/max first',
        'Always visualise (histogram) before quoting a centre',
      ],
      exampleCode:
        'import numpy as np\n\nsalaries = np.array([30, 32, 35, 38, 250])  # one outlier\nprint(salaries.mean())   # 77.0 — misleading\nprint(np.median(salaries))  # 35.0 — realistic\n\nfrom scipy import stats\nprint(stats.mode([1, 2, 2, 3]).mode)  # 2',
      practiceExercise:
        'Take the column of any real dataset. Compute mean, median, mode and range. Decide which centre represents it best and justify in one sentence based on skew.',
      codingTask:
        'Write centre_report(values) returning (mean, median, mode, range) with pure Python (no imports) and handle an empty list.',
    },
    {
      id: 't02-02',
      title: 'Variance, Standard Deviation & Percentiles',
      summary: 'How spread out the data is — and why ML normalisation divides by std.',
      lesson: [
        'Variance = mean of squared deviations from the mean. Squaring kills signs and punishes big deviations hard. Standard deviation = √variance, bringing units back to the original scale — “scores vary by ±12 points”.',
        'Population variance divides by N; sample variance divides by N−1 (Bessel’s correction) because samples underestimate spread. numpy defaults to ddof=0; pandas .std() defaults to ddof=1 — a subtle real-world bug source worth mentioning in interviews.',
        'Percentiles locate values in the sorted order: the 25th/50th/75th percentiles are the quartiles; IQR = p75 − p25. The boxplot’s whisker rule flags outliers as points beyond 1.5×IQR from the quartiles. z-score = (x − mean)/std expresses a value in std units.',
      ],
      intuition: 'Variance is the average squared distance from centre; std is that distance in human units. Percentiles answer “how far up the queue is this value?”',
      keyPoints: [
        'std = √variance; same units as the data',
        'Sample variance uses N−1 (ddof) — numpy 0, pandas 1',
        'IQR = p75 − p25; 1.5×IQR rule flags outliers',
        'z-score = (x − mean) / std → standardisation',
      ],
      exampleCode:
        'import numpy as np\n\ns = np.array([2, 4, 4, 4, 5, 5, 7, 9])\nprint(s.var())             # 4.0 (population)\nprint(s.std())             # 2.0\nprint(np.percentile(s, [25, 50, 75]))  # [4., 4.5, 5.75]\n\niqr = np.percentile(s, 75) - np.percentile(s, 25)\nlow, high = np.percentile(s, 25) - 1.5 * iqr, np.percentile(s, 75) + 1.5 * iqr\nprint(s[(s < low) | (s > high)])  # outliers by boxplot rule',
      practiceExercise:
        'Compute std of a column with numpy (ddof=0) and pandas (default) and explain the difference in one sentence. Then find outliers in any column using the 1.5×IQR rule.',
      codingTask:
        'Implement variance_and_std(values, sample=False) without imports, returning both, and verify against numpy.',
    },
    {
      id: 't02-03',
      title: 'Probability Basics',
      summary: 'From P(A) to independence — the language every ML statement is written in.',
      lesson: [
        'Probability = favourable outcomes / total outcomes, in [0, 1]. The complement rule P(not A) = 1 − P(A) and the addition rule P(A or B) = P(A) + P(B) − P(A and B) solve most counting problems. Expected value = Σ x·P(x) — the long-run average.',
        'Independent events: P(A and B) = P(A)·P(B) — coin flips don’t remember. Mutually exclusive events cannot co-occur: P(A and B) = 0, so P(A or B) = P(A) + P(B). Confusing “independent” with “mutually exclusive” is a classic interview trap.',
        'ML connection: every classifier outputs probabilities; Naive Bayes multiplies them; expected value underlies loss functions. Interviewers ask dice/card questions to see if you reason systematically rather than memorise.',
      ],
      intuition: 'Probability is a 0-to-1 confidence dial. Independent events dial separately; exclusive events can never both point at “yes”.',
      keyPoints: [
        'P ∈ [0,1]; P(not A) = 1 − P(A)',
        'P(A or B) = P(A) + P(B) − P(A and B)',
        'Independent: P(A∩B) = P(A)P(B) · Exclusive: P(A∩B) = 0',
        'Expected value = Σ x · P(x)',
      ],
      exampleCode:
        '# Two dice: probability the sum is 7?\nfavourable = sum(1 for a in range(1, 7) for b in range(1, 7) if a + b == 7)\nprint(favourable / 36)  # 0.1667\n\n# Expected value of a fair die\nprint(sum(x / 6 for x in range(1, 7)))  # 3.5',
      practiceExercise:
        'Compute by enumeration: P(two heads in 3 flips of a fair coin), P(sum ≥ 10 with two dice), and the expected value of a game paying ₹10 on rolling a 6 (cost ₹2 to play) — is it profitable?',
      codingTask:
        'Write prob_sum_seven(n_trials) simulating two dice n times with random.randint and returning the empirical P(sum=7); compare with 6/36.',
    },
    {
      id: 't02-04',
      title: 'Conditional Probability & Bayes’ Theorem',
      summary: 'P(A | B) updates belief when evidence arrives — the heart of Naive Bayes.',
      lesson: [
        'P(A | B) = P(A and B) / P(B) — the probability of A restricted to the world where B happened. Spam filtering is the canonical example: P(spam | contains “FREE”) is far higher than P(spam) because the evidence reshapes the sample space.',
        'Bayes’ theorem flips the conditioning: P(H | E) = P(E | H)·P(H) / P(E). P(H) is the prior, P(E | H) the likelihood, P(H | E) the posterior. False-positive paradox: a 99%-accurate test for a 1-in-1000 disease still yields mostly false positives — do the arithmetic; interviewers adore this.',
        'In ML: Naive Bayes applies Bayes with a “naive” independence assumption between features. Precision/recall trade-offs and base-rate neglect in imbalanced problems are all conditional-probability reasoning.',
      ],
      intuition: 'Conditioning shrinks the universe to the rows where the evidence is true, then renormalises.',
      keyPoints: [
        'P(A | B) = P(A∩B) / P(B)',
        'Bayes: posterior = likelihood × prior / evidence',
        'Rare diseases + accurate tests → mostly false positives (base rates matter)',
        'Naive Bayes = Bayes + naive feature independence',
      ],
      exampleCode:
        '# Disease test: 99% sensitivity, 95% specificity, prevalence 0.1%\nprev, sens, spec = 0.001, 0.99, 0.95\np_pos = sens * prev + (1 - spec) * (1 - prev)\nposterior = sens * prev / p_pos\nprint(posterior)  # ~0.019 — under 2% despite the “99% accurate” test',
      practiceExercise:
        'A deck: what is P(king | face card)? Compute directly and via the conditional formula. Then redo the disease-test calculation with prevalence 10% and watch the posterior jump.',
      codingTask:
        'Write bayes(prior, likelihood, evidence) returning the posterior, plus a simulation with random numbers that verifies it empirically.',
    },
    {
      id: 't02-05',
      title: 'Distributions & the Normal Distribution',
      summary: 'Shapes data takes — uniform, binomial, normal — and the 68-95-99.7 rule.',
      lesson: [
        'A distribution lists values and their probabilities. Uniform: all equally likely. Binomial: count of successes in n independent yes/no trials (coin flips, conversions). Poisson: counts of events per interval (calls per hour). Normal: the bell curve from summing many small independent effects.',
        'Normal distribution N(μ, σ²) is fully described by mean and std. The empirical rule: 68% of data within ±1σ, 95% within ±2σ, 99.7% within ±3σ. Standardising (z-scores) turns any normal into N(0,1), letting you compare heights and exam scores on one scale.',
        'Central Limit Theorem: averages of many samples are approximately normal regardless of the source shape — why confidence intervals and significance tests exist. In ML, residuals of a good linear model should look roughly normal; strong skew hints at log-transforming the feature/target.',
      ],
      intuition: 'Many small independent nudges pile up into a bell. The bell is so common that ±2σ covers ~95% of everything.',
      keyPoints: [
        'Normal N(μ, σ²): 68 / 95 / 99.7 within 1σ / 2σ / 3σ',
        'z = (x − μ)/σ standardises to N(0, 1)',
        'CLT: sample means → normal, whatever the population shape',
        'Skewed feature? Try a log transform before modelling',
      ],
      exampleCode:
        'import numpy as np\n\nheights = np.random.normal(170, 8, 100000)\nwithin1 = np.mean(np.abs(heights - 170) < 8)     # ~0.68\nwithin2 = np.mean(np.abs(heights - 170) < 16)    # ~0.95\nprint(within1, within2)\n\nz = (180 - 170) / 8   # 1.25 → taller than ~89% of people',
      practiceExercise:
        'Simulate 100k draws from N(100, 15). Verify the 68/95/99.7 rule empirically, then compute the z-score of 130 and state what fraction of people score below it (≈97.7%).',
      codingTask:
        'Write empirical_rule_check(mu, sigma) that samples and returns the three coverage fractions, asserting they are within 0.01 of 0.68/0.95/0.997 on 1M samples.',
    },
    {
      id: 't02-06',
      title: 'Linear Algebra: Vectors, Matrices & the Dot Product',
      summary: 'Data is matrices and models are matrix operations — speak this language fluently.',
      lesson: [
        'A scalar is one number; a vector is an ordered list (a data row); a matrix is a grid (a dataset); a tensor stacks matrices (images). A dataset X of n samples and d features is an (n, d) matrix — this single sentence connects linear algebra to ML.',
        'Operations: addition element-wise; scalar multiplication scales; matrix multiplication (n,k) @ (k,m) → (n,m) composes linear maps. Shape rules rule everything: “can I multiply these?” is a shape question, and shape mismatches are the most common beginner bug.',
        'Dot product a·b = Σ aᵢbᵢ measures alignment: large when vectors point the same way, zero when perpendicular. Prediction in linear regression is literally a dot product: ŷ = w·x + b. Cosine similarity (dot product of normalised vectors) powers search and embeddings.',
      ],
      intuition: 'A dot product is “how much do these two arrows agree?” — it is the atomic operation inside every neural network layer.',
      keyPoints: [
        'Dataset = matrix (n samples × d features)',
        'Matmul shapes: (n,k) @ (k,m) → (n,m); inner dims must match',
        'Dot product: similarity + the core of ŷ = w·x',
        'Transpose T flips rows/columns; XᵀX appears in normal equations',
      ],
      exampleCode:
        "import numpy as np\n\nw = np.array([2.0, -1.0])\nx = np.array([3.0, 4.0])\nprint(w @ x)              # 2*3 + (-1)*4 = 2 → the prediction\n\nX = np.array([[1, 2], [3, 4]])\nprint(X @ X.T)            # (2,2) @ (2,2)\nprint(np.dot(w, x) / (np.linalg.norm(w) * np.linalg.norm(x)))  # cosine",
      practiceExercise:
        'Given w = (2, −1) and three row vectors, compute all predictions in one matmul (X @ w). Then compute cosine similarity between two of the rows and interpret the sign.',
      codingTask:
        'Implement matmul(A, B) with triple loops, then verify against A @ B on (2,3)@(3,2) — feel why vectorised libraries matter.',
    },
    {
      id: 't02-07',
      title: 'Derivatives, Gradients & Gradient Descent',
      summary: 'The optimisation engine that trains nearly every ML model — explained with a hill.',
      lesson: [
        'The derivative dy/dx is the slope — how y responds to a tiny nudge in x. Positive slope → y grows with x; negative → y shrinks. A gradient generalises slope to many variables: it is the vector of partial derivatives, pointing in the direction of steepest increase.',
        'Gradient descent: start anywhere, compute the gradient of the loss, step against it: w ← w − η·∇L. The learning rate η is the step size: too small → crawling; too large → overshooting and diverging. Repeat until the loss stops improving — that is a (local) minimum.',
        'Variants matter in interviews: batch GD uses all data per step (stable, slow); stochastic GD one sample (noisy, fast); mini-batch in between — the default in practice. Learning-rate schedules and momentum fix convergence problems. Every deep network, linear model and logistic regression trains with some form of this loop.',
      ],
      intuition: 'Standing on a foggy hillside, feel the slope under your feet (gradient) and step downhill (minus gradient × step size). The step size is your learning rate.',
      keyPoints: [
        'Gradient = vector of partial derivatives → steepest ascent direction',
        'Update rule: w ← w − η · ∇L(w)',
        'Learning rate: too big diverges, too small crawls',
        'batch vs stochastic vs mini-batch trade-off: stability vs speed',
      ],
      exampleCode:
        '# Descent on L(w) = (w - 4)^2, gradient 2(w - 4)\nw, lr = 0.0, 0.1\nfor step in range(50):\n    grad = 2 * (w - 4)\n    w = w - lr * grad\nprint(round(w, 4))  # ≈ 4.0 — found the minimum\n\n# lr = 1.1 diverges: try it and watch w explode',
      practiceExercise:
        'Run the descent above with lr = 0.1, 0.9 and 1.1 for 50 steps and describe what happens each time. Then minimise L(w) = w² − 6w + 9 analytically first, and confirm with your loop.',
      codingTask:
        'Write gradient_descent(grad_fn, start, lr, steps) returning the final w, and use it to fit a simple linear regression on 20 synthetic points by descending MSE with numerical gradients.',
    },
  ],
}

export const MODULE_03: MLModule = {
  id: 'm03',
  number: 3,
  title: 'Data Analysis & Preprocessing',
  shortTitle: 'Data Preprocessing',
  tagline: 'Models are only as good as the data you feed them.',
  interviewGoal:
    'Inspect a raw dataset, fix missing/duplicate/outlier problems, encode categoricals and scale features — narrating each decision.',
  topics: [
    {
      id: 't03-01',
      title: 'Understanding Datasets & Data Types',
      summary: 'The first ten minutes with any dataset — what to run and what to ask.',
      lesson: [
        'Every dataset inspection starts with: df.shape (how big?), df.head() (what does a row look like?), df.info() (dtypes + missing counts), df.describe() (ranges, spread, suspicious min/max), df.duplicated().sum(), df.isna().sum(). Then ask: what is one row? What is the target? Which columns are identifiers vs features?',
        'Data types matter because operations differ: numeric (mean, corr), categorical (mode, encoding), datetime (extract month/hour), text (tokenise), boolean. Pandas `object` often hides strings or mixed types — convert with astype or pd.to_numeric(errors="coerce") to surface problems.',
        'Interview framing: “Tell me how you approach a new dataset” — answer with this exact routine, then mention target balance (value_counts on the label). It shows systematic thinking, which is what practical rounds grade.',
      ],
      intuition: 'Treat the dataset like a stranger at a party: size them up (shape), hear their story (head), check their papers (info), then ask real questions (describe).',
      keyPoints: [
        'shape → head → info → describe → isna/duplicated: the opening routine',
        'One row = one observation; identify the target early',
        '`object` dtype often hides messy mixed types — coerce and re-check',
        'Check target balance before choosing metrics',
      ],
      exampleCode:
        "import pandas as pd\n\ndf = pd.read_csv('data.csv')\nprint(df.shape)\nprint(df.head(3))\nprint(df.info())\nprint(df.describe(include='all').T)  # transpose reads better\nprint(df.isna().sum())\nprint(df.duplicated().sum())",
      practiceExercise:
        'Take a raw CSV (Titanic or a Kaggle tabular set). Run the full opening routine and write three sentences: what one row means, the target, and the two columns that worry you most and why.',
      codingTask:
        'Write dataset_report(df) returning a dict with n_rows, n_cols, missing_by_column, n_duplicates and dtype counts — reusable on any DataFrame.',
    },
    {
      id: 't03-02',
      title: 'Missing Values',
      summary: 'Why data goes missing, why it matters, and the drop-vs-impute decision.',
      lesson: [
        'Missingness comes in three flavours: MCAR (missing completely at random — no pattern), MAR (missing depends on other columns — income missing more for older respondents), MNAR (missing depends on itself — very high salaries hidden). The flavour decides the fix; MNAR can silently bias a model.',
        'Options: drop rows (few rows missing, plenty of data), drop columns (mostly empty), impute with mean/median (numeric — median if skewed), mode (categorical), model-based (KNN/iterative imputation), or flag-and-fill (add a was_missing column — often genuinely predictive).',
        'Interview traps: never impute before the train/test split (compute statistics on train only) — that is data leakage. And dropping rows silently can delete a whole segment (e.g. all rows from one region) — check the pattern before you drop.',
      ],
      intuition: 'Missing data is a hole in the story: fill it with a sensible guess (impute), tear out the page (drop), or mark the hole (flag) — but never peek at the future (test set) to fill it.',
      keyPoints: [
        'MCAR / MAR / MNAR — diagnose before fixing',
        'Median for skewed numerics, mode for categoricals',
        'Missing-indicator columns can be predictive features',
        'Fit imputers on train only — imputing before the split leaks',
      ],
      exampleCode:
        "df['age_missing'] = df['age'].isna()          # flag first\nmedian_age = df.loc[df.split == 'train', 'age'].median()\ndf['age'] = df['age'].fillna(median_age)      # train-only statistic\n\ndf['city'] = df['city'].fillna(df['city'].mode()[0])\ndf = df.dropna(subset=['target'])             # never impute the label",
      practiceExercise:
        'Load a dataset with missing values. Compute % missing per column, decide and justify per column: drop, impute (which statistic?), or flag. Apply the fixes after a train/test split.',
      codingTask:
        'Implement impute_numeric(train, test, col) that fills both with the train median and returns a missing-flag DataFrame — demonstrating leakage-safe imputation.',
    },
    {
      id: 't03-03',
      title: 'Duplicates & Outliers',
      summary: 'Copy-paste rows and impossible values — find them, then decide with intent.',
      lesson: [
        'Duplicates: df.duplicated() flags fully-identical rows; df.drop_duplicates() removes them. Careful with partial duplicates — same customer, two purchases is legitimate; dedupe on a key (drop_duplicates(subset=["customer_id"])) only when the key should be unique.',
        'Outlier = a value far from the rest. Detection: IQR rule (outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR]), z-score (|z| > 3), or visual (boxplot, scatter). Detection is easy; the decision is the interview question.',
        'Handling: fix it (typo, unit error), keep it (a real ₹50 crore house is real information — maybe log-transform instead), cap it (winsorise for robust models), or drop it (data-entry error). Never delete silently: every removal must be reproducible and justified, because outliers sometimes ARE the signal — fraud detection lives on them.',
      ],
      intuition: 'Duplicates are photocopies in your filing cabinet; outliers are odd-shaped papers — one is always trash, the other might be the treasure.',
      keyPoints: [
        'drop_duplicates() / subset=[key] — know which duplication you are removing',
        'IQR rule and |z| > 3 are the standard detectors',
        'Decide per case: fix, keep (+transform), cap, or drop — and log it',
        'In fraud/anomaly problems, outliers are the target signal',
      ],
      exampleCode:
        "q1, q3 = df['income'].quantile([0.25, 0.75])\niqr = q3 - q1\nlo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\noutliers = df[(df['income'] < lo) | (df['income'] > hi)]\n\ndf = df.drop_duplicates()\ndf = df.drop_duplicates(subset=['customer_id'], keep='last')  # latest record\n\ndf['income_log'] = np.log1p(df['income'])  # keep outliers, tame the scale",
      practiceExercise:
        'Find duplicates and IQR-outliers in a dataset of your choice. For one outlier column, justify keep/cap/drop in two sentences; visualise with a boxplot before and after.',
      codingTask:
        'Write iqr_bounds(series, k=1.5) returning (lo, hi) and flag_outliers(df, cols) adding boolean columns — without touching the original rows.',
    },
    {
      id: 't03-04',
      title: 'Encoding Categorical Variables',
      summary: 'Turning categories into numbers without inventing fake order.',
      lesson: [
        'One-hot encoding (pd.get_dummies / OneHotEncoder) makes a binary column per category — safe for nominal data (city, colour) and required for linear models, but explodes width on high-cardinality columns.',
        'Label encoding maps categories to integers — fine for tree models (they can split anywhere), wrong for linear models on nominal data (it invents an order: city 2 > city 1). Ordinal encoding is legitimate when real order exists (low < medium < high).',
        'High-cardinality strategies: frequency encoding (replace with counts), target encoding (replace with mean-target per category — must be done with cross-fitting to avoid leakage), or grouping rare levels into "other". Interview question: "You have 500 cities — one-hot will not work. What now?"',
      ],
      intuition: 'One-hot = badge per category; label encoding = jersey numbers (only fair if the numbers mean something); frequency/target = summaries learned from data (with care).',
      keyPoints: [
        'One-hot: nominal + linear models; width explodes with cardinality',
        'Label/ordinal: trees tolerate it; only use when order is real',
        'High cardinality → frequency, target (cross-fitted), or rare-level grouping',
        'Fit encoders on train only; handle unseen categories gracefully',
      ],
      exampleCode:
        "df = pd.get_dummies(df, columns=['city'], drop_first=True)  # nominal\n\nsize_map = {'low': 0, 'medium': 1, 'high': 2}\ndf['size_ord'] = df['size'].map(size_map)                    # ordinal\n\nfreq = df['country'].value_counts(normalize=True)\ndf['country_freq'] = df['country'].map(freq)                 # frequency",
      practiceExercise:
        'Take a dataset with a nominal, an ordinal and a high-cardinality categorical column. Apply one-hot, ordinal mapping and frequency encoding respectively; print resulting shapes and justify each choice.',
      codingTask:
        'Implement frequency_encode(train, test, col) mapping both frames with train frequencies and an explicit fallback for unseen categories.',
    },
    {
      id: 't03-05',
      title: 'Feature Scaling: Normalisation & Standardisation',
      summary: 'Why distance-based and gradient-based models care about units — and trees do not.',
      lesson: [
        'Standardisation (z-score) rescales to mean 0, std 1: x′ = (x − μ)/σ. Keeps relative outliers, no fixed bounds — the default for linear/logistic regression, SVM, KNN, PCA and any gradient-descent-trained model.',
        'Min-max normalisation squeezes into [0, 1]: x′ = (x − min)/(max − min). Bounded output suits neural nets and image pixels, but one extreme value squashes everyone else. Robust scaling uses median/IQR when outliers must survive.',
        'Critical interview facts: trees (decision tree, random forest, boosting) are scale-invariant — splits compare thresholds, not distances, so they need no scaling. And scaling must be fit on train only, then applied to test (fit_transform on train, transform on test) — classic leakage question.',
      ],
      intuition: 'Comparing salary (₹50,000) with age (25) in a distance is like weighing an elephant and a sandwich on one scale. Scaling puts both on the same ruler — but trees never weigh anything, so they are immune.',
      keyPoints: [
        'Standardise: (x−μ)/σ — default choice, robust-ish, unbounded',
        'Normalise: min-max [0,1] — bounded, outlier-sensitive',
        'Trees: no scaling needed · Distance/gradient models: always scale',
        'fit on train, transform on test — leakage question in disguise',
      ],
      exampleCode:
        "from sklearn.preprocessing import StandardScaler, MinMaxScaler\n\nsc = StandardScaler()\nX_train_s = sc.fit_transform(X_train)   # learn μ, σ here only\nX_test_s = sc.transform(X_test)         # apply the SAME μ, σ\n\nmm = MinMaxScaler(feature_range=(0, 1))\nX_img = mm.fit_transform(pixels)        # e.g. neural-net inputs",
      practiceExercise:
        'Standardise two wildly-different-scale columns, then run KNN with and without scaling and report the accuracy gap. Fit the scaler on train only and explain what would happen if you fit on the full data.',
      codingTask:
        'Implement standardise(train, test) with numpy only: return scaled copies plus (μ, σ) from train, and assert test is never used in the statistics.',
    },
  ],
}
