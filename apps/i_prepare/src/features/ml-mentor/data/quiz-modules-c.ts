import type { InterviewQuestion, QuizQuestion } from '../types'

/** Module-test questions for modules 13–17. */
export const QUIZ_M13: QuizQuestion[] = [
  {
    id: 'm13-q01',
    moduleId: 'm13',
    topicId: 't13-01',
    prompt: 'What does 5-fold cross-validation do?',
    options: [
      'Trains 5 different model types',
      'Splits data into 5 folds, training 5 times with each fold held out once for validation',
      'Splits data into 5 test sets',
      'Trains on 20% of the data',
    ],
    answerIndex: 1,
    explanation: 'Every row is validated exactly once across the 5 fits; scores are averaged for a stabler estimate.',
  },
  {
    id: 'm13-q02',
    moduleId: 'm13',
    topicId: 't13-01',
    prompt: 'Which CV strategy fits time-ordered data correctly?',
    options: ['KFold with shuffle', 'TimeSeriesSplit (forward chaining)', 'Leave-one-out', 'StratifiedKFold with shuffle'],
    answerIndex: 1,
    explanation: 'Forward chaining always trains on the past and validates on the future — shuffle would leak the future.',
  },
  {
    id: 'm13-q03',
    moduleId: 'm13',
    topicId: 't13-01',
    prompt: 'Rows belonging to the same hospital must stay in the same fold. Use:',
    options: ['GroupKFold', 'StratifiedKFold', 'KFold', 'Holdout'],
    answerIndex: 0,
    explanation: 'GroupKFold keeps all rows of a group together, preventing patient-level leakage.',
  },
  {
    id: 'm13-q04',
    moduleId: 'm13',
    topicId: 't13-02',
    prompt: 'GridSearchCV with 5 values × 4 hyperparameters × 5 CV folds performs how many fits?',
    options: ['20', '100', '125', '625'],
    answerIndex: 2,
    explanation: '5 × 4 = 20 candidates × 5 folds = 100 fits per refit configuration... the standard count is 100 (plus optional refit).',
  },
  {
    id: 'm13-q05',
    moduleId: 'm13',
    topicId: 't13-02',
    prompt: 'Why does random search often beat grid search at equal budget?',
    options: [
      'It tries more values per parameter',
      'Important dimensions get more unique values explored when other dimensions barely matter',
      'It uses no cross-validation',
      'It always finds the exact optimum',
    ],
    answerIndex: 1,
    explanation: 'With low-effective-dimension spaces, random sampling covers the few important knobs far better than a rigid grid.',
  },
  {
    id: 'm13-q06',
    moduleId: 'm13',
    topicId: 't13-02',
    prompt: 'Hyperparameter ranges like C or learning_rate are best sampled:',
    options: ['Linearly', 'On a log scale', 'Randomly from 0 to 1 only', 'As integers only'],
    answerIndex: 1,
    explanation: 'These parameters act multiplicatively — loguniform(1e-3, 1e3) explores decades rather than clustering near the top.',
  },
  {
    id: 'm13-q07',
    moduleId: 'm13',
    topicId: 't13-03',
    prompt: 'Train score 0.95, validation score 0.70. First remedy?',
    options: [
      'Add more features',
      'Regularise / simplify the model (or add data)',
      'Train longer',
      'Lower the threshold',
    ],
    answerIndex: 1,
    explanation: 'A wide gap = variance. Regularisation, depth limits, bagging or more data close it; richer features would worsen it.',
  },
  {
    id: 'm13-q08',
    moduleId: 'm13',
    topicId: 't13-03',
    prompt: 'Which is the correct systematic improvement loop?',
    options: [
      'Change many hyperparameters at once and keep the best feeling',
      'Fix metric → CV baseline → error analysis → one hypothesis per experiment → tune → compare',
      'Try the most complex model first',
      'Tune only when the deadline is near',
    ],
    answerIndex: 1,
    explanation: 'Disciplined single-change experiments with honest comparisons beat random fiddling every time.',
  },
]

export const QUIZ_M14: QuizQuestion[] = [
  {
    id: 'm14-q01',
    moduleId: 'm14',
    topicId: 't14-01',
    prompt: 'Where in the workflow should the train/test split happen?',
    options: [
      'Before any preprocessing that fits statistics',
      'After scaling the full dataset',
      'After model training',
      'It does not matter',
    ],
    answerIndex: 0,
    explanation: 'Split first so imputers/scalers/encoders are fit on train only — or wrap everything in a Pipeline that enforces it.',
  },
  {
    id: 'm14-q02',
    moduleId: 'm14',
    topicId: 't14-01',
    prompt: 'What comes immediately BEFORE model training in a disciplined workflow?',
    options: ['Saving the model', 'A baseline model', 'Deployment', 'Feature deletion'],
    answerIndex: 1,
    explanation: 'The dumb baseline calibrates whether any complex model is earning its complexity.',
  },
  {
    id: 'm14-q03',
    moduleId: 'm14',
    topicId: 't14-01',
    prompt: 'joblib.dump of a fitted sklearn Pipeline saves:',
    options: [
      'Only the model weights',
      'The full preprocessing + model — the exact object needed to score new data',
      'The raw dataset',
      'Only hyperparameters',
    ],
    answerIndex: 1,
    explanation: 'The pipeline bundles transforms and estimator, so serving cannot accidentally re-fit or skip steps.',
  },
  {
    id: 'm14-q04',
    moduleId: 'm14',
    topicId: 't14-02',
    prompt: 'The best opening line when presenting an ML project is:',
    options: [
      '“I used XGBoost with 5000 trees”',
      '“The business problem was X, and we measured success by Y”',
      '“My accuracy was 94%”',
      '“The dataset had 500k rows”',
    ],
    answerIndex: 1,
    explanation: 'Interviewers grade problem framing and metric reasoning first; tools come later.',
  },
  {
    id: 'm14-q05',
    moduleId: 'm14',
    topicId: 't14-02',
    prompt: 'Volunteering your project’s limitations in an interview:',
    options: [
      'Weakens your position — hide them',
      'Builds trust and shows engineering maturity',
      'Is only for juniors',
      'Replaces the need for metrics',
    ],
    answerIndex: 1,
    explanation: 'Naming limitations and monitoring plans signals production thinking — a strong senior signal.',
  },
]

export const QUIZ_M15: QuizQuestion[] = [
  {
    id: 'm15-q01',
    moduleId: 'm15',
    topicId: 't15-01',
    prompt: 'In the house-price project, your baseline should be:',
    options: [
      'A deep neural network',
      'Predicting the median training price for every row',
      'A random guess',
      'XGBoost with tuned parameters',
    ],
    answerIndex: 1,
    explanation: 'The median (or mean) predictor is the floor any real model must beat.',
  },
  {
    id: 'm15-q02',
    moduleId: 'm15',
    topicId: 't15-02',
    prompt: 'For churn prediction where a retention offer is cheap but losing a customer is expensive, optimise:',
    options: ['Precision at all costs', 'Recall at an acceptable precision floor', 'Accuracy', 'Training time'],
    answerIndex: 1,
    explanation: 'Catching churners matters most; the precision floor stops blanket offers to everyone.',
  },
  {
    id: 'm15-q03',
    moduleId: 'm15',
    topicId: 't15-02',
    prompt: 'After K-Means, a good segmentation deliverable includes:',
    options: [
      'Only the cluster ids',
      'Cluster profiles with named personas and one caveat each',
      'The raw centroids in 20 dimensions',
      'A regression on cluster ids',
    ],
    answerIndex: 1,
    explanation: 'Business value comes from interpretable personas; cluster ids alone are meaningless to stakeholders.',
  },
  {
    id: 'm15-q04',
    moduleId: 'm15',
    topicId: 't15-03',
    prompt: 'The attrition project’s “insights memo” should contain:',
    options: [
      'The full hyperparameter grid',
      'Top drivers translated into actions with caveats and ethical considerations',
      'Every feature’s coefficient',
      'The confusion matrix only',
    ],
    answerIndex: 1,
    explanation: 'Stakeholders need decisions, not weights — plus honest limits like proxy-discrimination risk.',
  },
]

export const QUIZ_M16: QuizQuestion[] = [
  {
    id: 'm16-q01',
    moduleId: 'm16',
    topicId: 't16-01',
    prompt: 'Which answer best defines machine learning in an interview?',
    options: [
      'Programming computers to follow if-else rules',
      'Systems that improve at a task by learning patterns from data rather than explicit rules',
      'Any program using GPUs',
      'Storing data in databases',
    ],
    answerIndex: 1,
    explanation: 'Data-driven improvement vs hand-coded rules — Mitchell’s E/T/P framing makes it sharper.',
  },
  {
    id: 'm16-q02',
    moduleId: 'm16',
    topicId: 't16-02',
    prompt: 'Sampling 100 balls WITH replacement from a bag is an example of:',
    options: ['The bootstrap', 'Stratification', 'Regularisation', 'Binning'],
    answerIndex: 0,
    explanation: 'Sampling with replacement = bootstrap — the foundation of bagging and OOB estimates.',
  },
  {
    id: 'm16-q03',
    moduleId: 'm16',
    topicId: 't16-03',
    prompt: 'Which model handles non-linear boundaries natively without feature engineering?',
    options: ['Linear regression', 'Logistic regression', 'Decision tree / RBF-SVM / KNN', 'Ridge regression'],
    answerIndex: 2,
    explanation: 'Trees, kernel SVMs and KNN draw non-linear boundaries; linear/logistic need feature help.',
  },
  {
    id: 'm16-q04',
    moduleId: 'm16',
    topicId: 't16-04',
    prompt: 'Your model performs well offline but poorly in production. FIRST thing to check:',
    options: [
      'Rewrite in C++ for speed',
      'Training–serving skew: distribution drift, leakage that existed offline, or preprocessing mismatch',
      'Change the metric',
      'Collect more labels immediately',
    ],
    answerIndex: 1,
    explanation: 'Offline/online gaps come from drift, leakage or skew between training and serving pipelines.',
  },
]

export const QUIZ_M17: QuizQuestion[] = [
  {
    id: 'm17-q01',
    moduleId: 'm17',
    topicId: 't17-01',
    prompt: 'In a mock interview, the best response when you do not know an answer is:',
    options: [
      'Guess confidently and move on',
      'Reason aloud from first principles and state clearly what you are unsure about',
      'Stay silent',
      'Change the topic',
    ],
    answerIndex: 1,
    explanation: 'Interviewers grade reasoning under uncertainty — thinking aloud is the professional move.',
  },
  {
    id: 'm17-q02',
    moduleId: 'm17',
    topicId: 't17-01',
    prompt: 'A strong behavioural structure for describing a project is:',
    options: ['Random order', 'Problem → data → metric → approach → result → caveat', 'Only the final accuracy', 'Only the code'],
    answerIndex: 1,
    explanation: 'The narrative arc keeps interviewers oriented and invites the follow-ups you are prepared for.',
  },
]

/** Interview questions for modules 01–06 (used by module view + practice mode). */
export const INTERVIEW_M01: InterviewQuestion[] = [
  {
    id: 'iv-m01-1',
    moduleId: 'm01',
    category: 'Coding',
    difficulty: 'Beginner',
    prompt: 'What is the difference between a list and a tuple in Python? When would you use each in an ML script?',
    modelAnswer:
      'Lists are mutable and tuples immutable. Use tuples for fixed records and dict keys (e.g. a (row, col) coordinate) and lists for collections you append/sort (e.g. accumulating batch losses). Tuples being hashable means they can be dict keys or set members; lists cannot.',
    rubric: ['Mutability difference', 'Tuple hashable → dict key', 'Concrete ML-context example of each'],
    followUp: 'What happens if you use a list as a dictionary key?',
  },
  {
    id: 'iv-m01-2',
    moduleId: 'm01',
    category: 'Coding',
    difficulty: 'Beginner',
    prompt: 'Explain the difference between a list comprehension and a generator expression, and when memory matters.',
    modelAnswer:
      '[x*2 for x in seq] builds the entire list in memory immediately; (x*2 for x in seq) produces items lazily one at a time. Memory matters with large streams (reading big files, streaming predictions): the generator is O(1) memory. Use a list when you need to iterate multiple times or index.',
    rubric: ['Both syntaxes', 'Laziness of generators', 'O(1) vs O(n) memory and single-use caveat'],
    followUp: 'How would you compute the sum of squares of a 10-GB file’s numbers without loading it?',
  },
  {
    id: 'iv-m01-3',
    moduleId: 'm01',
    category: 'Practical',
    difficulty: 'Junior',
    prompt: 'Your pandas groupby aggregation runs in 40 seconds on 5M rows. How do you speed it up?',
    modelAnswer:
      'Options in order: ensure dtypes are category for the grouping key (huge win), aggregate on numpy arrays or use df.groupby(...).agg with built-ins instead of apply with Python lambdas, drop unneeded columns before grouping, consider sort=False. If still slow, move to polars/dask or push the aggregation into the database/warehouse.',
    rubric: ['Category dtypes for keys', 'Avoid Python-level apply/lambdas', 'Escalation path (polars/dask/SQL)'],
    followUp: 'Why is df.apply with a lambda often much slower than vectorised alternatives?',
  },
]

export const INTERVIEW_M02: InterviewQuestion[] = [
  {
    id: 'iv-m02-1',
    moduleId: 'm02',
    category: 'Statistics',
    difficulty: 'Beginner',
    prompt: 'When would you report the median instead of the mean?',
    modelAnswer:
      'When the distribution is skewed or has outliers — income, house prices, response times. The mean chases extreme values while the median stays at the middle of the order. I would also report IQR or percentiles for spread rather than std in those cases.',
    rubric: ['Skew/outlier reasoning', 'Concrete examples (income, prices)', 'Mentions IQR for spread'],
    followUp: 'A mean and median are almost equal for a column. What does that suggest?',
  },
  {
    id: 'iv-m02-2',
    moduleId: 'm02',
    category: 'Statistics',
    difficulty: 'Junior',
    prompt: 'Explain the 68-95-99.7 rule and one way you would use it in practice.',
    modelAnswer:
      'For a normal distribution, ~68% of values lie within ±1σ, 95% within ±2σ, 99.7% within ±3σ of the mean. Practical use: quick anomaly flagging (|z| > 3 is suspiciously rare under normality) or sanity-checking scaled data — after standardisation, most values should sit within ±3.',
    rubric: ['The three percentages', 'z-score connection', 'Concrete application'],
    followUp: 'When would this rule mislead you?',
  },
  {
    id: 'iv-m02-3',
    moduleId: 'm02',
    category: 'Statistics',
    difficulty: 'Intermediate',
    prompt: 'A disease test is 99% sensitive and 95% specific; prevalence is 0.1%. A random person tests positive. Roughly what is the chance they have the disease, and why is it so low?',
    modelAnswer:
      'About 2%. With 0.1% prevalence, per 10,000 people: 10 true cases → ~9.9 detected; 9,990 healthy → ~500 false positives. Posterior ≈ 9.9/509.9 ≈ 1.9%. The tiny prior dwarfs the accuracy: false positives from the huge healthy population outnumber true positives. This is Bayes’ theorem and base-rate neglect in one.',
    rubric: ['Bayes/base-rate calculation or a frequency table', 'Numbers ≈ 2%', 'Names base-rate neglect'],
    followUp: 'How would you improve the screening pipeline given these numbers?',
  },
]

export const INTERVIEW_M03: InterviewQuestion[] = [
  {
    id: 'iv-m03-1',
    moduleId: 'm03',
    category: 'Practical',
    difficulty: 'Beginner',
    prompt: 'You get a dataset with 30% missing values in a numeric column. Walk me through your decision process.',
    modelAnswer:
      'First diagnose the missingness pattern: is it random, or correlated with other columns/target (check missingness rate per segment)? If a few % MCAR, median-impute (train-only statistic) or drop rows if data is plentiful. If a large chunk, add a missing-indicator column — the missingness itself is often predictive — then impute. If MNAR is suspected, discuss with domain owners. Everything goes inside a pipeline fitted on train only.',
    rubric: ['Diagnose pattern first (MCAR/MAR/MNAR)', 'Median + indicator column', 'Train-only fitting / pipeline'],
    followUp: 'When would you drop the entire column instead?',
  },
  {
    id: 'iv-m03-2',
    moduleId: 'm03',
    category: 'Practical',
    difficulty: 'Junior',
    prompt: 'One-hot vs label encoding vs target encoding — how do you choose for a 50-category column feeding a logistic regression?',
    modelAnswer:
      'Logistic regression multiplies a single coefficient by the encoded value, so label encoding invents a fake order — reject it. 50 one-hot columns is fine (drop one level to avoid collinearity, or regularise). If cardinality were in the hundreds/thousands, I would use frequency encoding or cross-fitted smoothed target encoding, grouping rare levels into "other" and defining an unseen-category policy for serving.',
    rubric: ['Rejects label encoding for linear models', 'One-hot fine at 50 levels', 'High-cardinality alternatives + unseen policy'],
    followUp: 'What changes if the model is a Random Forest?',
  },
]

export const INTERVIEW_M04: InterviewQuestion[] = [
  {
    id: 'iv-m04-1',
    moduleId: 'm04',
    category: 'Practical',
    difficulty: 'Beginner',
    prompt: '“Tell me about your EDA process on a new dataset.” Structure your answer.',
    modelAnswer:
      'Start with the frame questions: what is one row, what is the target, how many rows/columns. Then univariate: distributions (skew? outliers? near-constant columns?), target balance. Bivariate: feature-target relationships (grouped boxplots, scatter), feature-feature correlations (redundancy). Then anomalies and leakage checks. I finish with decisions: the preprocessing and modelling choices each finding triggers. EDA is about decisions, not charts.',
    rubric: ['Frame questions (row meaning, target)', 'Univariate → bivariate flow', 'Every finding maps to a decision'],
    followUp: 'Give an example of an EDA finding that changed your model choice.',
  },
]

export const INTERVIEW_M05: InterviewQuestion[] = [
  {
    id: 'iv-m05-1',
    moduleId: 'm05',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    prompt: 'Explain the bias-variance tradeoff like I am a product manager.',
    modelAnswer:
      'A model can be too rigid or too wobbly. Too rigid (high bias): it misses real patterns — bad everywhere. Too wobbly (high variance): it memorises training quirks — great on the data it saw, poor on new data. Making a model more flexible reduces rigidity but adds wobble; the art is tuning flexibility (depth, regularisation, data size) so total error is minimised. I diagnose which one I have by comparing train vs validation performance and adjust accordingly.',
    rubric: ['Rigid vs wobbly framing', 'Complexity dial', 'Diagnosis via train/validation gap'],
    followUp: 'Your model underfits. Name three things you would try.',
  },
  {
    id: 'iv-m05-2',
    moduleId: 'm05',
    category: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'Your validation accuracy is 96%, but the product team says the model is useless in production. What do you investigate?',
    modelAnswer:
      'In order: (1) leakage — was any training-time information (post-outcome columns, fit-on-full-data preprocessing, duplicates across splits) inflating validation? (2) distribution shift — is production data different from training data (check feature drift)? (3) metric mismatch — is accuracy the wrong lens (imbalance) or is the label definition offline different from the online one? (4) preprocessing/serving skew — does production apply the exact same transformations? I would reproduce the production path offline first; the delta usually reveals the culprit.',
    rubric: ['Leakage first', 'Distribution drift', 'Metric/label mismatch + serving skew', 'Systematic order'],
    followUp: 'How would you set up monitoring to catch this earlier next time?',
  },
]

export const INTERVIEW_M06: InterviewQuestion[] = [
  {
    id: 'iv-m06-1',
    moduleId: 'm06',
    category: 'Algorithms',
    difficulty: 'Beginner',
    prompt: 'Explain linear regression to a first-year student, including how it is fit.',
    modelAnswer:
      'We model the target as a weighted sum of features plus an intercept: ŷ = w·x + b. Fitting means choosing the weights that minimise the average squared error (MSE) between predictions and true values. Because that surface is a convex bowl, we can find the bottom either exactly with the normal equation or iteratively with gradient descent: repeatedly step the weights against the gradient, scaled by a learning rate.',
    rubric: ['Model equation', 'MSE objective', 'Normal equation vs gradient descent'],
    followUp: 'What happens with a learning rate that is too large?',
  },
  {
    id: 'iv-m06-2',
    moduleId: 'm06',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    prompt: 'Why does multicollinearity matter for linear regression interpretation, and how do you detect and treat it?',
    modelAnswer:
      'With correlated features, the model cannot attribute shared effect to one column, so coefficient estimates get large variance — signs can flip, and “+₹35k per bedroom” becomes untrustworthy even when predictions are fine. Detection: correlation matrix plus VIF (VIF > 10 is a red flag). Treatment: drop or combine redundant features, use PCA for compression, or use Ridge which stabilises coefficients through L2 penalty; report predictions as primary output when interpretation is required.',
    rubric: ['Interpretation instability, predictions may survive', 'VIF/correlation detection', 'Drop/combine/Ridge treatment'],
    followUp: 'Why does Ridge help — what is the intuition?',
  },
]
