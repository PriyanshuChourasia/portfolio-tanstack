import type { QuizQuestion } from '../types'

/**
 * Baseline assessment — 10 questions probing aptitude + prior exposure.
 * Deliberately spans maths, logic and light programming so the mentor can place
 * the learner at a starting module without teaching anything first.
 */

export const BASELINE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'base-01',
    moduleId: 'm02',
    topicId: 't02-01',
    prompt:
      'A dataset of 9 salaries is ₹30k, ₹32k, ₹35k, ₹38k, ₹40k, ₹42k, ₹45k, ₹48k and ₹1,00,000. Which measure of central tendency best represents a "typical" salary here, and why?',
    options: [
      'Mean, because it uses all the values',
      'Median, because the ₹1,00,000 outlier drags the mean upward',
      'Mode, because it is the most frequent value',
      'Range, because it captures the full spread',
    ],
    answerIndex: 1,
    explanation:
      'One large outlier pulls the mean up, so the median (₹40k) represents the typical salary better. The mode is usually for categorical data and the range measures spread, not a centre.',
  },
  {
    id: 'base-02',
    moduleId: 'm02',
    topicId: 't02-03',
    prompt: 'A fair coin is flipped twice. What is the probability of getting exactly one head?',
    options: ['1/4', '1/3', '1/2', '3/4'],
    answerIndex: 2,
    explanation:
      'Four equally likely outcomes: HH, HT, TH, TT. Exactly one head occurs in two of them (HT, TH) → 2/4 = 1/2.',
  },
  {
    id: 'base-03',
    moduleId: 'm01',
    topicId: 't01-01',
    prompt: 'In Python, what does the following print?\n\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)',
    options: ['[1, 2, 3]', '[1, 2, 3, 4]', 'Error', 'None'],
    answerIndex: 1,
    explanation:
      'Assignment copies the reference, not the list. a and b point at the same object, so appending through b is visible through a.',
  },
  {
    id: 'base-04',
    moduleId: 'm01',
    topicId: 't01-04',
    prompt:
      'You need to check whether a value exists in a collection of 1,000,000 items, and you will do this check millions of times. Which Python collection is the right choice?',
    options: ['List', 'Tuple', 'Set', 'String'],
    answerIndex: 2,
    explanation:
      'Set membership is O(1) on average thanks to hashing, while list membership is O(n) — for a million items checked millions of times, the set is dramatically faster.',
  },
  {
    id: 'base-05',
    moduleId: 'm05',
    topicId: 't05-02',
    prompt:
      'You have 10,000 customer records where each row is already labelled "churned" or "stayed", and you must predict churn for new customers. What kind of problem is this?',
    options: [
      'Unsupervised learning — clustering',
      'Supervised learning — binary classification',
      'Supervised learning — regression',
      'Reinforcement learning',
    ],
    answerIndex: 1,
    explanation:
      'Labelled data + a discrete two-valued target = supervised binary classification. Regression would apply if the target were continuous (like revenue).',
  },
  {
    id: 'base-06',
    moduleId: 'm05',
    topicId: 't05-04',
    prompt:
      'A model scores 99% on its training data but only 65% on new, unseen data. What is happening, and what is one reasonable fix?',
    options: [
      'Underfitting — use a more complex model',
      'Overfitting — simplify/regularise the model or get more data',
      'Data leakage — remove the test set',
      'Nothing wrong — training accuracy is what matters',
    ],
    answerIndex: 1,
    explanation:
      'A large train-vs-test gap is the classic overfitting signature: the model memorised training noise. Fixes include regularisation, limiting complexity (e.g. max_depth), and collecting more data.',
  },
  {
    id: 'base-07',
    moduleId: 'm03',
    topicId: 't03-02',
    prompt:
      'A numeric column has 5% missing values and a heavily skewed distribution (a few very large values). What is the most sensible simple imputation?',
    options: [
      'Fill with the mean',
      'Fill with the median',
      'Fill with 0',
      'Delete the entire column',
    ],
    answerIndex: 1,
    explanation:
      'With skew, the mean is dragged by the large values; the median is robust. (Also remember: compute the median on the training split only, and consider a missing-indicator column.)',
  },
  {
    id: 'base-08',
    moduleId: 'm02',
    topicId: 't02-07',
    prompt: 'In gradient descent, what does the learning rate control, and what goes wrong when it is too large?',
    options: [
      'The number of features — too large means overfitting',
      'The step size per update — too large makes the search overshoot and possibly diverge',
      'The depth of the model — too large means slow training',
      'The amount of data used per step — too large means memory errors',
    ],
    answerIndex: 1,
    explanation:
      'The learning rate scales the step taken against the gradient. Too large and the optimiser overshoots the minimum, bouncing or diverging; too small and training crawls.',
  },
  {
    id: 'base-09',
    moduleId: 'm11',
    topicId: 't11-02',
    prompt:
      'A fraud model flags 1% of transactions. Precision is 80%, recall is 40%. What does the recall number tell you?',
    options: [
      '80% of flagged transactions are truly fraudulent',
      '40% of all fraudulent transactions are caught by the model',
      'The model is wrong 40% of the time',
      '40% of all transactions are fraudulent',
    ],
    answerIndex: 1,
    explanation:
      'Recall = TP / (TP + FN): the fraction of all real positives the model catches. Precision 80% is the first statement (of flagged items, 80% are real).',
  },
  {
    id: 'base-10',
    moduleId: 'm04',
    topicId: 't04-02',
    prompt:
      'Two features, "size of house" and "price of house", have a correlation of 0.92. What is the safest interpretation?',
    options: [
      'Bigger houses cause higher prices — proven',
      'The two features move together strongly; size may be useful for predicting price, but causation is not established',
      'Correlation above 0.9 means the columns are identical',
      'The correlation must be a data error',
    ],
    answerIndex: 1,
    explanation:
      'A high correlation means a strong linear association — useful for prediction — but correlation alone never establishes causation, and 0.92 is not identity.',
  },
]
