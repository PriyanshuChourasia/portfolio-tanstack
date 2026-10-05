import type { InterviewQuestion } from '../types'

/**
 * Cross-module interview questions (moduleId null) — scenario, coding and
 * statistics rounds that do not belong to a single module.
 */
export const INTERVIEW_CROSS: InterviewQuestion[] = [
  {
    id: 'iv-x-1',
    moduleId: null,
    category: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'Your model has 95% accuracy but performs badly in production. What would you investigate?',
    modelAnswer:
      'Systematically: (1) Leakage — did offline data contain information unavailable at prediction time? (2) Distribution drift — is live data different from training data (feature means/missing rates)? (3) Metric mismatch — is accuracy hiding class-imbalance failure? (4) Training-serving skew — are preprocessing steps identical in the serving path? (5) Label definition drift — did the business definition of the target change? I would reproduce the production input path offline and bisect the difference.',
    rubric: ['Leakage check', 'Drift check', 'Metric/imbalance check', 'Serving skew check'],
    followUp: 'What monitoring would have caught this on day one?',
  },
  {
    id: 'iv-x-2',
    moduleId: null,
    category: 'Coding',
    difficulty: 'Beginner',
    prompt: 'Write (in words or pseudocode) a function that computes the accuracy of predicted vs true labels.',
    modelAnswer:
      'def accuracy(y_true, y_pred): return sum(t == p for t, p in zip(y_true, y_pred)) / len(y_true). Mention edge cases: empty input (define or raise), and the imbalance caveat — always pair with per-class metrics.',
    rubric: ['Correct elementwise comparison', 'Division by total count', 'Mentions empty-input/imbalance caveat'],
    followUp: 'Extend it to return precision and recall for the positive class.',
  },
  {
    id: 'iv-x-3',
    moduleId: null,
    category: 'Coding',
    difficulty: 'Junior',
    prompt: 'Given a list of numbers, compute the mean and standard deviation without imports. Then explain what a large std tells you about a dataset.',
    modelAnswer:
      'mean = sum(xs)/len(xs); var = sum((x-mean)**2 for x in xs)/len(xs); std = var ** 0.5. A large std relative to the mean (high coefficient of variation) means values are widely dispersed — predictions will carry wide error bars, and distance-based models will need scaling.',
    rubric: ['Correct mean/variance/std formulas', 'Pure-python implementation', 'Interpretation of large std'],
    followUp: 'Why divide by n−1 for a sample instead of n?',
  },
  {
    id: 'iv-x-4',
    moduleId: null,
    category: 'Statistics',
    difficulty: 'Intermediate',
    prompt: 'What is the Central Limit Theorem and why does it matter in ML?',
    modelAnswer:
      'The distribution of sample means approaches a normal distribution as sample size grows, regardless of the population’s shape (finite variance). It matters because it justifies confidence intervals on metrics (AUC differences, AB tests), lets us treat averaged errors as normal, and underpins why repeated CV means are meaningful summaries.',
    rubric: ['Sample means → normal statement', 'Independent of population shape', 'ML link: CIs/AB tests/CV'],
    followUp: 'You run 30 CV folds and quote a mean. What assumption makes that mean trustworthy?',
  },
  {
    id: 'iv-x-5',
    moduleId: null,
    category: 'Scenario',
    difficulty: 'Advanced',
    prompt: 'You inherit a model retrained weekly on new data, and accuracy has slowly degraded for two months. Diagnose.',
    modelAnswer:
      'First separate data vs model causes. Data: check input drift (per-feature means/missing rates vs the original training snapshot), label drift, upstream pipeline changes (a renamed column silently nulling a feature). Model: check whether each retrain actually improved validation or merely ran (no guardrails), whether the training window is shrinking or being polluted by bad labels. Add monitoring: PSI on features, score distribution, rolling online metrics; add retrain gates on validation thresholds and a data-contract test on the pipeline.',
    rubric: ['Splits data vs model causes', 'Concrete drift checks', 'Monitoring + retrain guardrails'],
    followUp: 'Design the retraining policy: what triggers a retrain, what blocks one?',
  },
]
