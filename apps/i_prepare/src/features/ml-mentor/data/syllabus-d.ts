import type { MLModule } from '../types'

/** Module 11 — Model Evaluation. */
export const MODULE_11: MLModule = {
  id: 'm11',
  number: 11,
  title: 'Model Evaluation',
  shortTitle: 'Model Evaluation',
  tagline: 'How to prove your model is good — and how to be honest about it.',
  interviewGoal:
    'Explain regression metrics, the confusion matrix family, ROC/PR and why imbalance needs different metrics.',
  topics: [
    {
      id: 't11-01',
      title: 'Regression Metrics: MAE, MSE, RMSE, R²',
      summary: 'Four numbers, four stories about your errors.',
      lesson: [
        'MAE = mean |error| — in target units, robust, treats all errors proportionally. MSE = mean squared error — punishes big mistakes hard (differentiable, used as the training loss). RMSE = √MSE — target units again but outlier-sensitive; still the most-quoted regression metric.',
        'R² = 1 − SSE/SST: how much variance the model explains vs predicting the mean. R² = 0 → no better than the mean; 1 → perfect; NEGATIVE → worse than predicting the mean (a model bug or wrong split). R² is not accuracy: 0.9 on noisy social data can be superb; 0.9 in physics can be embarrassing — compare with domain baselines.',
        'Choosing: outliers matter and errors should be linear in pain → MAE. Large errors disproportionately costly → RMSE. Talking to business → MAE in currency units usually communicates best. Always report at least one absolute-error metric alongside R².',
      ],
      intuition: 'MAE = average pain per prediction; RMSE = pain with a magnifying glass on disasters; R² = share of the story your model explains.',
      keyPoints: [
        'MAE robust/target units · RMSE outlier-sensitive/target units · MSE as loss',
        'R² = explained-variance fraction; negative R² = worse than the mean',
        'R² has no unit; it is relative to a mean baseline, not "accuracy"',
        'Pair R² with an absolute-error metric when talking to stakeholders',
      ],
      exampleCode:
        'from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score\n\nmae = mean_absolute_error(y_val, y_pred)\nrmse = mean_squared_error(y_val, y_pred, squared=False)\nr2 = r2_score(y_val, y_pred)\nprint(f"MAE {mae:.2f}, RMSE {rmse:.2f}, R² {r2:.3f}")',
      practiceExercise:
        'On a regression dataset, fit two models (e.g. mean baseline and linear regression). Report MAE, RMSE and R² for both and write one sentence where each metric would mislead a stakeholder.',
      codingTask:
        'Write regression_report(y_true, y_pred) returning MAE, MSE, RMSE, R² and a flag if R² < 0 (worse than the mean).',
    },
    {
      id: 't11-02',
      title: 'Confusion Matrix, Precision, Recall & F1',
      summary: 'The four cells that decide everything in classification.',
      lesson: [
        'Confusion matrix: TP (correctly flagged), TN (correctly cleared), FP (false alarm — type I), FN (missed case — type II). Every metric is arithmetic on these four cells; draw the 2×2 grid before answering any metric question.',
        'Precision = TP/(TP+FP): of everything I flagged, how much was real — guards against false alarms (spam, arrests). Recall = TP/(TP+FN): of everything real, how much I caught — guards against misses (cancer, fraud). F1 = harmonic mean: high only when both are high; punishes imbalance between them harder than the arithmetic mean.',
        'The scenario question is guaranteed: "Which matters more?" Cancer screening → recall (missing a patient is fatal; a follow-up test absorbs false positives). Spam → precision (burying a job offer is unacceptable; a little spam in inbox is fine). Fraud → depends on who pays for review vs loss. Answer with the cost of each error type, never with "F1 because balanced".',
      ],
      intuition: 'Precision protects the innocent; recall hunts the guilty. F1 refuses to let you sacrifice either entirely.',
      keyPoints: [
        'Precision = TP/(TP+FP) — cost of false alarms',
        'Recall = TP/(TP+FN) — cost of misses',
        'F1 harmonic mean — punishes imbalance between precision and recall',
        'Pick precision or recall by the cost of each error type, not by a default',
      ],
      exampleCode:
        'from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, classification_report\n\ncm = confusion_matrix(y_val, pred)\nprint(cm)\nprint(f"Precision {precision_score(y_val, pred):.3f}, Recall {recall_score(y_val, pred):.3f}, F1 {f1_score(y_val, pred):.3f}")\nprint(classification_report(y_val, pred))',
      practiceExercise:
        'Given TP=90, FP=10, FN=30, TN=870, compute accuracy, precision, recall, F1. Then rewrite the scenario: what changes if we double the cost of a false negative?',
      codingTask:
        'Write confusion_metrics(y_true, y_pred) returning TP/FP/FN/TN and precision, recall, F1 without any sklearn — just numpy arithmetic on the label arrays.',
    },
    {
      id: 't11-03',
      title: 'ROC, AUC & Class Imbalance',
      summary: 'Threshold-free evaluation — and the trap that imbalanced data sets.',
      lesson: [
        'ROC curve plots TPR (recall) vs FPR (false-alarm rate) across every threshold. AUC = area under it: 0.5 = coin flip, 0.7–0.8 fair, 0.8–0.9 good, >0.9 suspicious (check leakage!). AUC answers: "does the model rank a random positive above a random negative?" — it is threshold-independent.',
        'The imbalance trap: with 99:1 class ratio, predicting "always negative" scores 99% accuracy and catches nothing. Accuracy dies; ROC-AUC can also look rosy on heavy imbalance while precision is garbage. PR curve (precision vs recall) focuses only on the positive class — PR-AUC is the honest metric for rare positives (fraud, disease, churn).',
        'Imbalance remedies, in order: (1) use the right metric (PR-AUC, recall at fixed precision), (2) class_weight="balanced", (3) resampling (SMOTE/undersample) inside the CV pipeline only, (4) threshold tuning on validation, (5) collect more rare-class data. Never evaluate resampling before splitting — synthetic copies of test rows leaking into train is a self-inflicted wound.',
      ],
      intuition: 'Accuracy is a democracy that 99% of negative votes rig. PR-AUC only counts how well you find the 1% that matter.',
      keyPoints: [
        'ROC-AUC: ranking quality, threshold-independent — but can look fine under imbalance',
        'PR-AUC: the honest metric for rare positives (fraud, disease)',
        '99:1 → "always negative" = 99% accuracy and zero value',
        'Remedies in order: right metric → class_weight → resampling inside CV → threshold → more data',
      ],
      exampleCode:
        'from sklearn.metrics import roc_auc_score, roc_curve, precision_recall_curve, average_precision_score\n\nfpr, tpr, _ = roc_curve(y_val, proba)\nprint("ROC-AUC", roc_auc_score(y_val, proba))\nprec, rec, thr = precision_recall_curve(y_val, proba)\nprint("PR-AUC", average_precision_score(y_val, proba))',
      practiceExercise:
        'Generate 99:1 imbalance data. Compare accuracy, ROC-AUC and PR-AUC for a classifier that predicts the positive class at random. Show why ROC-AUC alone flatters sickness.',
      codingTask:
        'Write pr_curve_manual(y_true, proba, thresholds) returning lists of (precision, recall, threshold) without sklearn, including the edge where the classifier predicts all-negative.',
    },
  ],
}

/** Module 12 — Feature Engineering. */
export const MODULE_12: MLModule = {
  id: 'm12',
  number: 12,
  title: 'Feature Engineering',
  shortTitle: 'Feature Engineering',
  tagline: 'Shaping raw data into the inputs that models can actually use.',
  interviewGoal:
    'Describe scaling, transforms, encoding, high-cardinality handling and feature selection — with the leakage rule repeated until it sticks.',
  topics: [
    {
      id: 't12-01',
      title: 'Feature Transformation: Scaling, Log & Binning',
      summary: 'Reshaping features so models can use them.',
      lesson: [
        'Scaling (standardise/min-max) — needed by distance and gradient models, ignored by trees (Module 3 recap). Log transform np.log1p handles right-skewed positives (income, price, counts): tames outliers and linearises multiplicative relationships (log(price) = linear in log(features)).',
        'Binning converts continuous → categories: equal-width (simple, outlier-brittle), equal-frequency/quantile (balanced bins), custom domain bins (age groups 18–25/26–40…). Binning helps simple models and stakeholder-readable rules, but throws away resolution — trees rarely need it.',
        'Polynomial/interaction features (x², x₁·x₂) let linear models fit curves and interactions. Beware dimensionality explosion with many features; trees and boosted models discover interactions themselves, so save the effort for linear models.',
      ],
      intuition: 'Transformation is shaping raw material to the tool: a saw wants straight grain (linearity), a hammer does not care (trees).',
      keyPoints: [
        'log1p for skewed positives — check the histogram first',
        'Quantile binning beats equal-width when outliers exist',
        'Interactions for linear models; trees find their own',
        'Fit every transform on train only (leakage rule again)',
      ],
      exampleCode:
        'import numpy as np\n\ndf["income_log"] = np.log1p(df["income"])\ndf["income_band"] = pd.qcut(df["income"], q=4, labels=["low", "mid", "high", "top"])\ndf["debt_ratio"] = df["debt"] / (df["income"] + 1)',
      practiceExercise:
        'Take a skewed numeric column: plot before/after log transform. Bin a continuous column three ways (equal-width, quantile, domain) and compare the bin counts. Create one ratio feature and just one polynomial feature; say which would help a linear model more.',
      codingTask:
        'Write transform_report(series) returning skewness before/after log1p and recommended bin edges by quantile — a reusable skew-tamer.',
    },
    {
      id: 't12-02',
      title: 'Encoding & High-Cardinality Features',
      summary: 'Categorical survival skills at scale.',
      lesson: [
        'Recap from Module 3, now with engineering judgement: one-hot for low-cardinality nominals with linear models; label/ordinal only for real order or tree models; frequency and target encoding for high cardinality.',
        'Target encoding: replace category with mean-target of that category — powerful for 500-city columns, but plain mapping leaks the target. Correct form: cross-fitting — encode each CV fold using out-of-fold statistics, or use category_encoders’ TargetEncoder within a pipeline. Add smoothing: (n·mean + m·global)/(n + m) so rare categories shrink toward the global mean.',
        'Rare-level handling: group levels below a frequency threshold into "other" (reduces overfit and surprises at serving time). Always define an unseen-category policy for production: map to "other"/global mean, never crash.',
      ],
      intuition:
        'High-cardinality columns are rich but gossipy: summarise them (frequency, smoothed target means) instead of giving each of 500 cities its own megaphone.',
      keyPoints: [
        'High cardinality → frequency or smoothed cross-fitted target encoding',
        'Plain target encoding leaks — always out-of-fold',
        'Group rare levels into "other" + define unseen-category policy',
        'Smoothing pulls rare categories toward the global mean',
      ],
      exampleCode:
        'import category_encoders as ce\n\nenc = ce.TargetEncoder(cols=["city"], smoothing=0.5)\n# inside CV: enc.fit(X_train_fold, y_train_fold) per fold — out-of-fold stats\nfreq_top = df["city"].value_counts(normalize=True).head(10)\ndf["city_rare"] = df["city"].where(df["city"].map(df["city"].value_counts()) >= 50, "other")',
      practiceExercise:
        "Take a column with >100 unique values: one-hot it (watch the shape), then frequency-encode, then target-encode inside a cross-fit. Compare validation scores and explain the leakage risk of the plain mapping.",
      codingTask:
        'Write crossfit_target_encode(train_df, test_df, col, target) returning the train column replaced with out-of-fold target means and the test column replaced with global target means — the leakage-safe version.',
    },
    {
      id: 't12-03',
      title: 'Feature Selection & Extraction',
      summary: 'Fewer, better features: removing noise, redundancy and leakage risk.',
      lesson: [
        'Why select at all: irrelevant features add noise (overfitting), redundant ones add instability (multicollinearity), and every column is a production cost and a leakage opportunity. "More features" is not "more information".',
        'Selection methods: filter (fast, model-free — correlation with target, variance threshold, chi² for categorical), wrapper (search with the model — RFE: fit, drop weakest, repeat), embedded (model does it — Lasso zeros coefficients, tree/boosting importances). Practical recipe: variance → correlation → model importance → domain sanity.',
        'Extraction vs selection: PCA creates new combined features (Module 10); selection keeps originals. Extraction buys compression at the price of interpretability. Interview framing: "How do you decide which features to drop?" — answer with the three method families and the caveat that importances from correlated features split credit among themselves.',
      ],
      intuition:
        'Feature selection is decluttering before moving house: keep what earns its box, drop duplicates, and remember the movers (models) charge per box.',
      keyPoints: [
        'Filter (correlation/chi²) → wrapper (RFE) → embedded (Lasso/importance)',
        'Correlated features split importance credit — do not over-interpret one importance number',
        'Variance threshold: near-constant columns add nothing',
        'PCA = extraction (new features, less interpretability); selection = keeps originals',
      ],
      exampleCode:
        'from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif, RFE\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\n\nvt = VarianceThreshold(threshold=0.01).fit(X)\nprint("dropped", sum(vt.variances_ < 0.01), "near-constant features")\nskb = SelectKBest(f_classif, k="all").fit(X, y).scores_\ntop = X.columns[skb.argsort()[-5:]]',
      practiceExercise:
        'On a dataset with a few near-constant columns and some correlated pairs: apply a variance threshold, then report the top features by a linear model importance and by a tree’s importance; note where the two disagree and why.',
      codingTask:
        'Write feature_selector_rfe(X, y, model, max_features) returning the selected column names by recursive feature elimination with the given model as the scorer — no sklearn RFE, just the loop.',
    },
  ],
}

export const ML_MODULES_WITH_D = [MODULE_11, MODULE_12]
