import type { InterviewQuestion } from '../types'

/** Interview questions for modules 07–14. */
export const INTERVIEW_M07: InterviewQuestion[] = [
  {
    id: 'iv-m07-1',
    moduleId: 'm07',
    category: 'Algorithms',
    difficulty: 'Beginner',
    prompt: 'Why use logistic regression instead of linear regression for classification?',
    modelAnswer:
      'Linear regression on 0/1 labels produces unbounded outputs outside [0,1] and treats far-away errors linearly. Logistic regression passes the linear score through the sigmoid, giving a valid probability, and is trained with log-loss, which punishes confident mistakes sharply and stays convex.',
    rubric: ['Unbounded outputs problem', 'Sigmoid → probability', 'Log-loss vs MSE'],
    followUp: 'Is logistic regression a linear model? Explain.',
  },
  {
    id: 'iv-m07-2',
    moduleId: 'm07',
    category: 'Practical',
    difficulty: 'Intermediate',
    prompt: 'How do you choose the classification threshold for a fraud model?',
    modelAnswer:
      'From the cost structure: a missed fraud costs the transaction amount, a false alarm costs a review. I plot precision/recall (or the ROC) on validation, pick the threshold maximising expected value under those costs (e.g. recall ≥ 0.8 at acceptable precision), and monitor it in production. The threshold is a business decision, not 0.5 by default.',
    rubric: ['Error costs framing', 'PR/ROC curve on validation', 'Explicit operating point'],
    followUp: 'The business doubles its review budget — how does the threshold move?',
  },
]

export const INTERVIEW_M08: InterviewQuestion[] = [
  {
    id: 'iv-m08-1',
    moduleId: 'm08',
    category: 'Algorithms',
    difficulty: 'Beginner',
    prompt: 'How does a decision tree decide where to split?',
    modelAnswer:
      'At each node it scans every feature and candidate threshold, computing the impurity reduction (information gain with entropy, or Gini) of each candidate split, then takes the best. Entropy H = −Σp·log₂p, Gini = 1 − Σp²; gain = parent impurity − weighted child impurity. The search is greedy — no lookahead.',
    rubric: ['Candidate scan features × thresholds', 'Entropy/Gini formulas', 'Greedy maximisation of gain'],
    followUp: 'Why can greedy splitting miss a globally better tree?',
  },
  {
    id: 'iv-m08-2',
    moduleId: 'm08',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    prompt: 'How do you control overfitting in decision trees?',
    modelAnswer:
      'Pre-pruning: max_depth, min_samples_split, min_samples_leaf, min_impurity_decrease, max_features. Post-pruning: cost-complexity pruning via ccp_alpha chosen by cross-validation. I diagnose with a validation curve on depth — validation peaks then falls while train keeps rising — and set limits around the peak. Ensembling (Random Forest) is often the practical answer.',
    rubric: ['Pre-pruning hyperparameters', 'ccp_alpha post-pruning', 'Validation-curve diagnosis'],
    followUp: 'Why does min_samples_leaf help with noisy data?',
  },
]

export const INTERVIEW_M09: InterviewQuestion[] = [
  {
    id: 'iv-m09-1',
    moduleId: 'm09',
    category: 'Fundamentals',
    difficulty: 'Junior',
    prompt: 'Why can combining many models beat a single model? What condition must hold?',
    modelAnswer:
      'If each model is better than chance and their errors are decorrelated, averaging cancels independent mistakes — variance drops with little bias change. That is the condition: diversity. Bagging manufactures diversity via bootstrap samples (Random Forest adds feature subsampling); boosting manufactures it sequentially by fitting previous errors. If all members make identical mistakes, averaging changes nothing.',
    rubric: ['Variance reduction mechanism', 'Decorrelation/diversity condition', 'Bagging vs boosting sources of diversity'],
    followUp: 'Why do bagged trees need feature subsampling to fully benefit?',
  },
  {
    id: 'iv-m09-2',
    moduleId: 'm09',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    prompt: 'Random Forest vs Gradient Boosting — compare and say when you would pick each.',
    modelAnswer:
      'RF: parallel, robust to defaults, low tuning burden, OOB validation — the strong baseline. GBM (XGBoost/LightGBM): sequential bias reduction, usually higher accuracy on tabular data, but needs learning_rate/depth tuning and early stopping, and overfits more easily. I pick RF for quick baselines and low-maintenance production; GBM when squeezing accuracy matters and I can tune with proper validation.',
    rubric: ['Parallel vs sequential', 'Accuracy vs tuning/overfitting trade', 'Concrete when-to-use for each'],
    followUp: 'What does early stopping protect against in GBMs?',
  },
]

export const INTERVIEW_M10: InterviewQuestion[] = [
  {
    id: 'iv-m10-1',
    moduleId: 'm10',
    category: 'Algorithms',
    difficulty: 'Beginner',
    prompt: 'Explain KNN and its biggest practical weaknesses.',
    modelAnswer:
      'KNN stores training data and classifies a query by majority vote of its k nearest points (distance-weighted optional). Weaknesses: prediction cost O(n·d) per query — slow at scale; requires feature scaling; suffers the curse of dimensionality where distances lose meaning in high dimensions (mitigate with PCA/selection); k must be tuned. Strengths: zero training, simple, non-linear, natural multiclass.',
    rubric: ['Lazy/mechanism', 'O(n·d) prediction cost', 'Scaling + curse of dimensionality'],
    followUp: 'How would you make KNN faster for a million rows?',
  },
  {
    id: 'iv-m10-2',
    moduleId: 'm10',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    prompt: 'When would you choose Naive Bayes over logistic regression for text, and why?',
    modelAnswer:
      'When I need a fast baseline on limited data: NB trains in one pass, handles high-dimensional sparse word features well, and is surprisingly strong for spam/topic classification. Choose logistic regression when calibrated probabilities or feature interactions matter, or when I have abundant data — it usually edges out NB given enough examples. NB probabilities are miscalibrated because of the independence assumption.',
    rubric: ['Speed/data-size advantage of NB', 'Independence assumption → miscalibration', 'When LR wins'],
    followUp: 'What is Laplace smoothing for?',
  },
  {
    id: 'iv-m10-3',
    moduleId: 'm10',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    prompt: 'What does PCA do, and give a concrete case where you would and would not use it.',
    modelAnswer:
      'PCA finds orthogonal directions of maximum variance and projects data onto them, giving denoised, decorrelated, compressed features. Use it: 2-D visualisation of high-dim data, collinearity removal before KNN/linear models, compression. Avoid it: before tree models (indifferent to collinearity) and when stakeholders need interpretable features — components are blends with little business meaning. Always standardise first.',
    rubric: ['Variance-direction projection', 'Use cases (viz, collinearity, compression)', 'Avoid cases + standardisation'],
    followUp: 'How do you choose the number of components?',
  },
]

export const INTERVIEW_M11: InterviewQuestion[] = [
  {
    id: 'iv-m11-1',
    moduleId: 'm11',
    category: 'Practical',
    difficulty: 'Beginner',
    prompt: 'Precision vs recall — explain both and when each matters more.',
    modelAnswer:
      'Precision = TP/(TP+FP): of flagged items, the real share — matters when false alarms are expensive (spam, arrests, offers). Recall = TP/(TP+FN): of real positives, the caught share — matters when misses are expensive (cancer, fraud, safety). F1 balances them. The choice comes from pricing each error type in the business context.',
    rubric: ['Both formulas', 'Cost-based examples for each', 'F1 as harmonic balance'],
    followUp: 'How do you raise recall without wrecking precision?',
  },
  {
    id: 'iv-m11-2',
    moduleId: 'm11',
    category: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'Your churn model shows 95% accuracy on a 95:5 imbalanced dataset. Convince me it might be useless.',
    modelAnswer:
      'Predicting “no churn” for everyone achieves 95% accuracy while catching zero churners. I would show the confusion matrix and the majority baseline; if recall/PR-AUC on the churn class is near zero, the model is worthless regardless of accuracy. Honest metrics for this problem: recall at a precision floor, PR-AUC, and lift in the top decile.',
    rubric: ['Majority-class baseline trick', 'Confusion matrix evidence', 'Proposes PR-AUC/recall/lift'],
    followUp: 'Which remedies would you apply, in what order?',
  },
  {
    id: 'iv-m11-3',
    moduleId: 'm11',
    category: 'Fundamentals',
    difficulty: 'Junior',
    prompt: 'What is ROC-AUC measuring, and when can it mislead?',
    modelAnswer:
      'AUC is the probability the model ranks a random positive above a random negative — a threshold-free measure of ranking quality (0.5 = random, 1.0 = perfect). It misleads under heavy class imbalance: ROC uses FPR (fed by the huge negative class), so AUC can look strong while precision on the rare class is terrible. For rare positives, PR-AUC is the honest lens.',
    rubric: ['Ranking-probability definition', 'Threshold-free', 'FPR imbalance blind spot → PR-AUC'],
    followUp: 'Why does FPR become meaningless at 99:1 imbalance?',
  },
]

export const INTERVIEW_M12: InterviewQuestion[] = [
  {
    id: 'iv-m12-1',
    moduleId: 'm12',
    category: 'Practical',
    difficulty: 'Junior',
    prompt: 'Give three feature-engineering moves you would try for a datetime column in a demand-forecasting problem.',
    modelAnswer:
      'Decompose: hour, day-of-week, month, is-weekend, is-holiday — cyclical patterns matter for demand. Encode cyclicity with sin/cos transforms of hour and day-of-week so 23:00 and 00:00 are neighbours. Add lag and rolling-window features (demand last week, 7-day rolling mean) — making sure lags are computed within the temporal split to avoid leakage.',
    rubric: ['Calendar decompositions', 'Sin/cos cyclical encoding', 'Lag/rolling with leakage warning'],
    followUp: 'Why is a lag feature risky if you split randomly?',
  },
  {
    id: 'iv-m12-2',
    moduleId: 'm12',
    category: 'Practical',
    difficulty: 'Intermediate',
    prompt: 'How does target encoding leak, and how do you use it safely?',
    modelAnswer:
      'Plain target encoding replaces a category with the mean target of its rows — including the row being encoded — so the label flows straight into the feature. Safe usage: cross-fitting, where each CV fold is encoded using out-of-fold statistics only; add smoothing (n·mean + m·global)/(n + m) so rare categories shrink toward the global mean; fit the final encoder on train only and define an unseen-category fallback for serving.',
    rubric: ['Names the leak (own label in the mean)', 'Out-of-fold/cross-fitting fix', 'Smoothing + unseen policy'],
    followUp: 'Why does smoothing help rare categories?',
  },
]

export const INTERVIEW_M13: InterviewQuestion[] = [
  {
    id: 'iv-m13-1',
    moduleId: 'm13',
    category: 'Practical',
    difficulty: 'Junior',
    prompt: 'Why use cross-validation instead of a single train/validation split?',
    modelAnswer:
      'A single split gives one noisy estimate — it can be lucky or unlucky. K-fold CV validates every row exactly once and averages, giving a mean and std that reflect stability. It is essential for fair model/hyperparameter comparison (same folds for every candidate). Costs: k training fits; variants matter — stratified for classification, GroupKFold for shared entities, TimeSeriesSplit for temporal data. The test set still stays untouched until the end.',
    rubric: ['Noisiness of single split', 'Every row validated once; mean ± std', 'Same folds for fair comparison + variants'],
    followUp: 'When would you prefer a single holdout even with enough data?',
  },
  {
    id: 'iv-m13-2',
    moduleId: 'm13',
    category: 'Practical',
    difficulty: 'Intermediate',
    prompt: 'Your model overfits. Walk me through your systematic improvement plan.',
    modelAnswer:
      'First confirm the diagnosis: train high, validation low, and check learning curves — is the gap closing with more data? Then, in order of cost: add data or augmentation; strengthen regularisation (depth limits, L2, early stopping, dropout); reduce features via selection; switch to an ensemble (bagging) or simpler family. Each change is one experiment with the same CV folds, logged and compared. I avoid changing multiple knobs at once so I can attribute the improvement.',
    rubric: ['Diagnosis before treatment', 'Ordered remedies (data → regularise → simplify → ensemble)', 'One-change-per-experiment discipline'],
    followUp: 'How do you decide between “get more data” and “regularise”?',
  },
]

export const INTERVIEW_M14: InterviewQuestion[] = [
  {
    id: 'iv-m14-1',
    moduleId: 'm14',
    category: 'Scenario',
    difficulty: 'Intermediate',
    prompt: 'Describe your complete end-to-end ML workflow for a churn-prediction request from the business.',
    modelAnswer:
      'Frame: what decision does this inform (retention offers) and what is the money metric. Data: join sources, audit features for prediction-time availability. Understanding/cleaning/EDA: missingness, outliers, target balance, leakage scan. Split: temporal or stratified, before preprocessing; pipeline imputation/encoding/scaling. Baseline: majority class, then logistic regression. Model: start simple, then XGBoost with early stopping. Evaluate with recall-at-precision or PR-AUC; tune threshold on validation; tune hyperparameters with CV. Save the fitted pipeline with metadata; plan monitoring for drift and retraining triggers.',
    rubric: ['Business framing first', 'Split-before-preprocess pipeline', 'Baseline → model → metric → threshold chain', 'Deployment/monitoring mention'],
    followUp: 'Which single step do teams most often get wrong, and why?',
  },
]
