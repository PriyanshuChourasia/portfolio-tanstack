import type { MLModule } from '../types'

/**
 * Syllabus part E — Modules 13–14.
 */

export const MODULE_13: MLModule = {
  id: 'm13',
  number: 13,
  title: 'Model Improvement',
  shortTitle: 'Model Improvement',
  tagline: 'A systematic loop that beats random parameter fiddling.',
  interviewGoal:
    'Describe a principled improvement loop: cross-validation, error analysis, tuning strategy, regularisation and model comparison.',
  topics: [
    {
      id: 't13-01',
      title: 'Cross-Validation',
      summary: 'Trustworthy estimates from limited data — the referee of every comparison.',
      lesson: [
        'A single train/validation split gives one noisy number: a lucky split inflates scores, an unlucky one hides a good model. K-fold CV: split data into k folds, train k times, each time holding out a different fold for validation, then average — every row gets validated exactly once.',
        'Variants: StratifiedKFold (classification — preserves class ratios per fold, the default choice), GroupKFold (rows sharing a group — same user/patient — never split across folds), TimeSeriesSplit (forward-chaining: always train on the past, validate on the future), repeated CV for tiny datasets.',
        'Usage rules: CV for model selection and hyperparameter tuning; keep the test set untouched until the end. Cost: k fits per configuration — that is why k = 5 is the usual compromise. Nested CV (tune inside, evaluate outside) is the rigorous answer when interviewers push on “CV overfits too”.',
      ],
      intuition: 'One exam result can be luck; five exams from five different chapters is a transcript.',
      keyPoints: [
        '5-fold CV = 5 fits, every row validated once, average + std reported',
        'Stratify classification; GroupKFold for shared entities; TimeSeriesSplit for time',
        'Tune with CV, test once at the very end',
        'Report mean ± std — a huge std warns of instability',
      ],
      exampleCode:
        "from sklearn.model_selection import cross_val_score, StratifiedKFold, TimeSeriesSplit\n\ncv = StratifiedKFold(5, shuffle=True, random_state=42)\nscores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')\nprint(scores.mean(), '+/-', scores.std())\n\n# time-ordered: train always earlier than validate\ncv_t = TimeSeriesSplit(5)",
      practiceExercise:
        'Compare a single holdout score vs 5-fold CV mean ± std for the same model on the same data. Repeat with shuffle on/off for a time-ordered dataset and watch leakage appear in the scores.',
      codingTask:
        'Write cv_report(model, X, y, k=5) returning mean, std, min and max score plus a verdict string (“stable” if std < 0.02, else “unstable — investigate folds”).',
    },
    {
      id: 't13-02',
      title: 'Hyperparameter Tuning: Grid & Random Search',
      summary: 'Search spaces, budgets and why random search embarrasses grid search.',
      lesson: [
        'Hyperparameters are knobs set before training (max_depth, C, learning_rate) — unlike parameters, which training learns (weights). Tuning = choosing knobs to maximise CV score, always with the same folds across candidates so comparisons are fair.',
        'GridSearchCV: try every combination — exhaustive but exponential (5 values × 4 params = 625 fits). RandomizedSearchCV: sample n_iter combinations — covers wide spaces with a fixed budget and usually finds near-optimal configs; the math reason: most knobs matter little, and random search wastes no time re-testing the unimportant dimension (Bergstra & Bengio 2012).',
        'Practical strategy: sensible defaults → coarse random search (n_iter 30–60, log-scale ranges for C, lr, alpha) → local grid or Bayesian optimisation (Optuna) around the best region. Early stopping on boosting models is free tuning of n_estimators. Always refit the final model on the full training data with the best settings and evaluate once on test.',
      ],
      intuition: 'Grid search reads every page of a 1000-page menu; random search tastes 50 dishes chosen at random — in a huge menu, the second eater usually eats as well for 20× less effort.',
      keyPoints: [
        'Same CV folds for every candidate — fair comparison',
        'Random search beats grid on wide spaces with fixed budget',
        'Log-scale the ranges of C, learning_rate, alpha',
        'Coarse random → local refine → Optuna; early-stop boosting',
      ],
      exampleCode:
        "from sklearn.model_selection import RandomizedSearchCV\nfrom scipy.stats import loguniform, randint\n\nsearch = RandomizedSearchCV(\n    estimator=pipeline,\n    param_distributions={\n        'logisticregression__C': loguniform(1e-3, 1e3),\n        'logisticregression__penalty': ['l1', 'l2'],\n    },\n    n_iter=40, scoring='roc_auc', cv=cv, n_jobs=-1, random_state=42,\n).fit(X_train, y_train)\nprint(search.best_params_, search.best_score_)",
      practiceExercise:
        'Tune a RandomForest with RandomizedSearchCV (n_estimators, max_depth, min_samples_leaf, max_features — 40 iters). Then a small grid around the winner. Report CV scores and the final test score; count total fits to feel the budget.',
      codingTask:
        'Write coarse_to_fine(param_space, score_fn) that runs a random search then a grid search around the best point, returning both phases’ best scores — the tuning pattern as code.',
    },
    {
      id: 't13-03',
      title: 'Overfitting Reduction & Regularisation Recap',
      summary: 'The toolkit for closing the train–validation gap.',
      lesson: [
        'Diagnose first: train score high + validation low = variance (overfit); both low = bias (underfit). Only then apply the matching cure — random cures waste time.',
        'Variance cures: more data (or augmentation), regularisation (Ridge/Lasso, tree depth limits, boosting early stopping, neural dropout/weight decay), fewer/noisier features, bagging/ensembles, simpler model family. Bias cures: richer features, more complex model, less regularisation, boosting, longer training.',
        'The systematic loop to internalise: fix metric → CV baseline → error analysis (which rows fail? are they a segment?) → one hypothesis per experiment → tune → compare honestly. Interviewers ask “your model underperforms — walk me through your approach”; the loop IS the answer.',
      ],
      intuition: 'Regularisation is friction: the model can still move, but drama (noise-fitting) costs energy. Diagnose first — you cannot cool a house by turning off the heater if the windows are open.',
      keyPoints: [
        'Diagnose bias vs variance before touching anything',
        'Overfit: more data, regularise, simplify, ensemble',
        'Underfit: richer features/model, less regularisation',
        'One hypothesis per experiment; keep an experiment log',
      ],
      exampleCode:
        'from sklearn.model_selection import learning_curve\nimport numpy as np\n\nsizes, tr, va = learning_curve(model, X, y, cv=5, scoring="f1")\nprint(tr.mean(1), va.mean(1))   # gap at the largest size = verdict\n# gap wide & shrinking with n → more data helps\n# gap wide & flat → regularise / simplify instead',
      practiceExercise:
        'Take an overfit tree: apply (a) depth limit, (b) min_samples_leaf, (c) Lasso on features, (d) bagging. Record train/val for each. Which cured the gap with the least test-loss? Write a 3-line experiment log entry.',
      codingTask:
        'Write diagnose_gap(train_score, val_score, tolerance=0.05) returning "underfit" | "good" | "overfit" plus a recommended next action string from the cure list.',
    },
    {
      id: 't13-04',
      title: 'Model Comparison & Baselines',
      summary: 'Choosing the final model honestly — baselines, tests and pragmatics.',
      lesson: [
        'Every project starts with baselines: majority class / mean prediction (sanity), then a simple model (logistic/linear), then the candidates (RF, XGBoost…). A complex model that fails to beat the simple one is not worth its complexity — “beat the baseline” is the minimum bar, not the finish line.',
        'Compare with the same folds, same metric, and a paired view: per-fold differences, not just averages. For a formal check, McNemar’s test on test-set errors tells whether two classifiers differ significantly; in practice, mean ± std across folds plus the size of the gap usually suffices. Beware leaderboard noise: a 0.001 AUC win is not a decision.',
        'Pragmatics decide ties: inference latency, training cost, interpretability needs, maintenance burden. The endgame: refit the winner on train+validation with tuned settings, evaluate on test once, then freeze and document — model card, expected data ranges, known weaknesses.',
      ],
      intuition: 'Baselines are the floor of the building: logistic regression is the floor, XGBoost is the penthouse — no penthouse without a floor.',
      keyPoints: [
        'Baseline order: majority/mean → simple model → candidates',
        'Compare on identical folds + metric; look at per-fold deltas',
        'Tie-break with latency, cost, interpretability',
        'Final: refit on train+val, evaluate once, document and freeze',
      ],
      exampleCode:
        "from sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\nfor name, m in [('logreg', LogisticRegression(max_iter=1000)),\n                ('rf', RandomForestClassifier(300, random_state=42))]:\n    s = cross_val_score(m, X, y, cv=5, scoring='roc_auc')\n    print(f'{name}: {s.mean():.4f} ± {s.std():.4f}')",
      practiceExercise:
        'Run logistic regression, random forest and gradient boosting through the same 5-fold CV on a tabular dataset. Build a comparison table (mean, std, fit time, predict time). Pick a winner for (a) a batch nightly job and (b) a real-time API — the answers may differ.',
      codingTask:
        'Write compare_models(models, X, y, cv) returning a sorted list of (name, mean, std, fit_seconds) — your reusable experiment harness.',
    },
  ],
}

export const MODULE_14: MLModule = {
  id: 'm14',
  number: 14,
  title: 'End-to-End Machine Learning',
  shortTitle: 'End-to-End ML',
  tagline: 'The full workflow — every step must survive the question “why?”.',
  interviewGoal:
    'Narrate the complete ML lifecycle and defend each step’s decisions in a take-home-style walkthrough.',
  topics: [
    {
      id: 't14-01',
      title: 'The Complete ML Workflow',
      summary: 'Business problem → prediction — the fourteen steps interviewers ask you to narrate.',
      lesson: [
        'The chain: business problem (what decision does this improve? what is the metric in money?) → data collection (sources, joins, the “would we have it at prediction time” audit) → data understanding (the Module 3 opening routine) → cleaning (missing, duplicates, outliers, logged decisions) → EDA (Module 4) → feature engineering (Module 12) → split (before any fitting!) → baseline (dumbest thing that could work) → model training (start simple, scale up) → evaluation (Module 11 metrics chosen by business cost) → tuning (Module 13) → final model → save (joblib/pickle + metadata) → prediction (serving, monitoring, retraining triggers).',
        'The split position matters: splitting happens BEFORE preprocessing so every fitted statistic (scaler means, imputer medians, encoders) is train-only. In practice you wrap everything in one sklearn Pipeline so leakage is structurally impossible — this ordering detail is a favourite senior-level probe.',
        'Every step needs its one-line justification: why this metric (cost of errors), why this split (time? groups?), why this model (baseline gap vs complexity), why this threshold (precision/recall economics). “Explain your end-to-end project” is answered by walking the chain with decisions, not tools.',
      ],
      intuition: 'An ML project is an assembly line: raw material in, decision-ready predictions out — and quality control (validation) sits after every station.',
      keyPoints: [
        'Split before any fitted preprocessing; Pipelines enforce it',
        'Baseline first, then climb complexity only if it pays',
        'Metric and threshold come from business error costs',
        'Deployed models need monitoring, not just saving',
      ],
      exampleCode:
        'from sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nimport joblib\n\npre = ColumnTransformer([\n    ("num", make_pipeline(SimpleImputer(median), StandardScaler()), num_cols),\n    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),\n])\npipe = Pipeline([("pre", pre), ("model", LogisticRegression())])\npipe.fit(X_train, y_train)\njoblib.dump(pipe, "model.joblib")  # artifacts + preprocessing travel together',
      practiceExercise:
        'Take a Kaggle dataset and produce the workflow skeleton on paper: for each of the 14 steps write one sentence of what you will do and one sentence of why. Then execute just steps 1–5 and record findings.',
      codingTask:
        'Write build_pipeline(num_cols, cat_cols, model) returning a leakage-proof sklearn Pipeline with median impute + scale for numerics and one-hot (ignore unknown) for categoricals.',
    },
    {
      id: 't14-02',
      title: 'Explaining Your Project in an Interview',
      summary: 'The STAR-shaped ML walkthrough that survives follow-up questions.',
      lesson: [
        'Structure: (1) Problem & business value — one sentence (“reduce churn by catching likely quitters for a ₹X retention offer”). (2) Data — sources, size, one row = one customer-month. (3) Metric & why — recall at precision ≥ 0.3, because a miss costs a customer and an offer costs ₹X. (4) Approach — baseline, final model, key features. (5) Result & caveat — offline vs expected online lift, monitoring plan.',
        'Expect the follow-ups: biggest data problem and fix; why this model over alternatives; how you validated (folds, leakage); what you would do with 10× data or one more week; how you would deploy and monitor (drift, retraining trigger). Practise a 2-minute version and a 10-minute version.',
        'Honesty scores points: name limitations (“validation PR-AUC 0.61 is moderate; the feature with the biggest lift is suspiciously post-outcome, so I excluded it”). Interviewers trust engineers who volunteer weaknesses over those who oversell.',
      ],
      intuition: 'Tell your project like a case study: tension (problem), investigation (data/EDA), decision (model/metric), resolution (result), sequel (monitoring).',
      keyPoints: [
        'Problem → data → metric-why → approach → result-caveat',
        'Have 2-minute and 10-minute versions rehearsed',
        'Pre-answered: biggest data problem, why this model, deploy plan',
        'Volunteer limitations — it builds trust, not doubt',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Write your 2-minute walkthrough for any project you have built (or the Module 6 house-price one), record yourself, then answer these follow-ups in writing: biggest data problem? why this model? how deployed? what would 10× data change?',
      codingTask: undefined,
    },
  ],
}
