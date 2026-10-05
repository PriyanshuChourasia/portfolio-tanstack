import type { MLModule } from '../types'

/** Module 7 — Classification. */
export const MODULE_07: MLModule = {
  id: 'm07',
  number: 7,
  title: 'Classification',
  shortTitle: 'Classification',
  tagline: 'Predicting which bucket, how sure, and when being wrong costs real money.',
  interviewGoal:
    'Explain logistic regression, decision boundaries and threshold tuning; narrate a binary classification recipe end to end.',
  topics: [
    {
      id: 't07-01',
      title: 'Classification Problems & the Sigmoid Function',
      summary: 'Why linear regression fails on labels, and the S-curve that fixes it.',
      lesson: [
        'Classification predicts a discrete class. Binary: spam/not-spam. Multiclass: digit 0–9 (handled natively by trees/NNs, or via one-vs-rest / one-vs-one wrappers for models like SVM). Output should be a calibrated probability, not just a hard label — the downstream threshold decides the label.',
        'Why not linear regression on 0/1 labels? Predictions escape [0, 1] and errors far from the boundary are under-weighted. Logistic regression instead passes the linear score through the sigmoid: σ(z) = 1/(1 + e^(−z)), squashing any real number into (0, 1) and reading it as P(y = 1 | x).',
        'The model is still linear — in the log-odds. log(p/(1−p)) = w·x + b. The decision boundary (where p = 0.5) is the hyperplane w·x = 0. Loss is log-loss/cross-entropy, not MSE: it punishes confident mistakes brutally, which gives nicer convex optimisation for classification.',
      ],
      intuition: 'The sigmoid is a probability dial: very negative score → 0, very positive → 1, zero score → exactly 50/50.',
      keyPoints: [
        'σ(z) = 1/(1+e^(−z)) maps scores to probabilities',
        'Linear in log-odds; boundary w·x = 0 where p = 0.5',
        'Trained with cross-entropy/log-loss, not MSE',
        'Multiclass: native (trees) or one-vs-rest wrappers',
      ],
      exampleCode:
        'from sklearn.linear_model import LogisticRegression\n\nclf = LogisticRegression(max_iter=1000).fit(X_train_s, y_train)\nproba = clf.predict_proba(X_test_s)[:, 1]  # P(class=1)\npred = (proba >= 0.5).astype(int)  # default threshold\nprint(clf.coef_)  # +weight raises log-odds of class 1',
      practiceExercise:
        'Plot σ(z) for z in [−6, 6]. Then fit LogisticRegression on any binary dataset, print predict_proba for five test rows alongside the hard labels, and interpret the largest positive coefficient.',
      codingTask:
        'Implement sigmoid(z) (numerically stable) and predict at threshold 0.5; verify probabilities match sklearn on a small dataset.',
    },
    {
      id: 't07-02',
      title: 'Decision Boundaries & Classification Thresholds',
      summary: 'Where the model draws the line — and how to move that line for business needs.',
      lesson: [
        'The decision boundary is where predicted probability equals the threshold. Logistic regression draws a straight boundary; trees draw axis-aligned boxes; SVMs draw maximum-margin lines; neural nets draw arbitrary curves. Plotting the boundary (2-D features) makes model families visually comparable — great interview whiteboard material.',
        'The 0.5 threshold is a default, not a law. Move it down (0.2) when missing positives is costly (cancer screening, fraud): more true positives, more false positives. Move it up (0.8) when false alarms are costly (spam filtering — never bury a real email). Threshold choice is a business decision expressed in numbers.',
        'The threshold–metrics dance: lowering the threshold raises recall and typically lowers precision; raising it does the reverse. Tune the threshold on the validation set using a precision-recall or ROC curve — never on test. Imbalanced data often needs threshold tuning more than a fancier model.',
      ],
      intuition:
        "The model sells probabilities; the threshold is where you cash them. The same classifier can be cautious or trigger-happy depending on where you set the cashier’s counter.",
      keyPoints: [
        'Boundary = where p equals the threshold; lowering raises recall, lowers precision',
        '0.5 is a default; move it by the cost of false positives vs false negatives',
        'Tune threshold on validation, never on test',
        'Imbalance often solved by threshold tuning before a fancier model',
      ],
      practiceExercise:
        'Fit a classifier, sweep thresholds 0.1 → 0.9, and tabulate precision/recall at each. Choose a threshold for (a) fraud capture and (b) spam filtering, justifying each with the cost of errors.',
      codingTask:
        'Write threshold_report(y_val, proba) returning a list of (threshold, precision, recall) pairs plus the threshold that maximises F1.',
    },
    {
      id: 't07-03',
      title: 'Building a Binary Classifier End to End',
      summary: 'The complete recipe you will be asked to narrate in practical rounds.',
      lesson: [
        'Recipe: load → inspect balance (value_counts) → split (stratify!) → preprocess (impute, encode, scale — fit on train only) → baseline (predict majority; beat it) → fit LogisticRegression → evaluate (accuracy alone is a trap with imbalance; use PR/ROC) → tune threshold → final test-set read once.',
        'Class imbalance tools in order of preference: class_weight="balanced" (cheap, effective), resampling (SMOTE/undersampling) — always inside the CV loop, not before, or you leak synthetic rows into validation. Collect more data on the rare class if you can.',
        'Interview narration pattern: state the metric first ("fraud: recall/PR-AUC, because positives are rare and misses are expensive"), then decisions in that light. Interviewers grade the reasoning chain, not the final accuracy number.',
      ],
      intuition:
        'A classifier project is a relay: data → split → preprocess → baseline → model → metric → threshold — and the baton (train-only statistics) must never touch the future.',
      keyPoints: [
        'Stratified split; preprocessing fit on train only (Pipeline!)',
        'Always build the dumb baseline first and beat it',
        'Imbalance: class_weight first, resampling inside CV only',
        'Report PR-AUC or recall at a threshold for rare positives',
      ],
      exampleCode:
        'from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score, classification_report\n\npipe = make_pipeline(StandardScaler(),\n                    LogisticRegression(class_weight="balanced", max_iter=1000))\npipe.fit(X_train, y_train)\nproba = pipe.predict_proba(X_val)[:, 1]\nprint(roc_auc_score(y_val, proba))\nprint(classification_report(y_val, proba >= 0.5))',
      practiceExercise:
        'Build the full recipe on an imbalanced binary dataset (e.g. credit default). Compare accuracy vs PR-AUC of the naive majority baseline against your model — and explain why accuracy lied.',
      codingTask:
        'Write run_baseline(X_tr, y_tr, X_val, y_val) that returns majority-class accuracy, logistic-regression accuracy and ROC-AUC as a dict — your reusable first attack on any binary problem.',
    },
  ],
}

/** Module 8 — Decision Trees. */
export const MODULE_08: MLModule = {
  id: 'm08',
  number: 8,
  title: 'Decision Trees',
  shortTitle: 'Decision Trees',
  tagline: 'Twenty questions played by a machine — and the root of every ensemble model.',
  interviewGoal:
    'Explain splitting with entropy/Gini, overfitting via depth, pruning and hyperparameters; build a tree classifier.',
  topics: [
    {
      id: 't08-01',
      title: 'Tree Intuition: Nodes, Splits & Purity',
      summary: 'Recursive partitioning into purer and purer regions.',
      lesson: [
        'A decision tree asks yes/no questions about features, splitting data into branches. Root = first question; internal nodes = further questions; leaves = predictions (majority class, or mean value for regression). Prediction = walk from root to leaf following your feature values.',
        'Choosing each split: try every feature × threshold, pick the split that maximally purifies the children. Purity is measured by entropy (H = −Σp·log₂p; 0 = pure, 1 = max impurity for binary) or Gini impurity (G = 1 − Σp²; faster to compute, nearly identical trees). Information gain = parent impurity − weighted child impurity.',
        'Example worth memorising: node with [9 yes, 5 no] → entropy ≈ 0.94. Splitting into [6y, 2n] and [3y, 3n]: gain = 0.94 − (8/10·0.81 + 2/10·1.0) ≈ 0.19. The algorithm greedily takes the best gain at each node — no lookahead, which is why trees can miss globally better structures.',
      ],
      intuition: 'Each split is the best "twenty questions" move: divide the room so each half is closer to a single answer.',
      keyPoints: [
        'Root → internal splits → leaf predictions',
        'Entropy −Σp log₂p · Gini 1−Σp² · gain = parent − weighted children',
        'Greedy best-split search over features × thresholds',
        'Regression trees predict leaf means; minimise variance instead',
      ],
      exampleCode:
        'import numpy as np\n\ndef entropy(labels):\n    _, counts = np.unique(labels, return_counts=True)\n    p = counts / counts.sum()\n    return -(p * np.log2(p)).sum()\n\nprint(entropy([1]*9 + [0]*5))   # ≈ 0.940',
      practiceExercise:
        'Hand-compute entropy and Gini for [8y, 2n], then for the split [5y, 1n] / [3y, 1n]. Verify in numpy; state which split gains more.',
      codingTask:
        'Implement best_split_1d(X_col, y) that scans candidate thresholds and returns the one maximising information gain.',
    },
    {
      id: 't08-02',
      title: 'Overfitting, Depth & Pruning',
      summary: 'Unpruned trees memorise noise; hyperparameters are the leash.',
      lesson: [
        'An unconstrained tree keeps splitting until leaves are pure — i.e. until every training row is memorised. Train accuracy 100%, test accuracy 70%: the textbook overfit signature. Trees are high-variance: changing a few rows can rebuild the whole tree differently.',
        'Pre-pruning hyperparameters: max_depth (the big one), min_samples_split, min_samples_leaf (leaves must hold n rows — smooths noisy splits), max_features, min_impurity_decrease. Post-pruning: grow fully, then cost-complexity-prune using ccp_alpha (sklearn) — cut branches whose removal costs little accuracy.',
        'Interview angle: "Why do trees overfit so easily?" — the hypothesis space is enormous (every possible question tree) and greedy splitting never stops unless told. "How do you find the right depth?" — validation curve/cross-validation, not vibes; plot test score vs depth and take the elbow.',
      ],
      intuition: "An unpruned tree is a paranoid secretary filing one folder per customer; pruning rules say 'at least five people per folder'.",
      keyPoints: [
        'Deep tree = high variance, memorised noise',
        'max_depth, min_samples_leaf = first levers to turn',
        'ccp_alpha: cost-complexity post-pruning in sklearn',
        'Plot test score vs depth and take the elbow',
      ],
      exampleCode:
        'from sklearn.tree import DecisionTreeClassifier\n\nfor depth in [None, 3, 5, 10]:\n    tree = DecisionTreeClassifier(max_depth=depth).fit(X_tr, y_tr)\n    print(depth, tree.score(X_tr, y_tr), tree.score(X_val, y_val))',
      practiceExercise:
        'Train trees at depths 1, 3, 5, 10, None. Plot train vs validation accuracy; pick the depth where validation peaks and explain why deeper stopped helping.',
      codingTask:
        'Write depth_tuner(X_tr, y_tr, X_val, y_val, depths) returning, for each depth, train/val accuracy and the recommended depth by validation peak.',
    },
    {
      id: 't08-03',
      title: 'Building a Tree Classifier & Feature Importance',
      summary: 'Fit, inspect, interpret — and why single trees are rarely the final model.',
      lesson: [
        'Trees handle mixed feature types, need no scaling, and natively support multiclass. They capture non-linearities and interactions automatically — no feature engineering needed for monotone transforms.',
        'feature_importances_ = total impurity reduction attributed to each feature, normalised. Useful for a first read, but biased toward high-cardinality/continuous features and unstable across resamples — one reason ensembles (Module 9) average many trees.',
        'Interpretability is the tree’s superpower: plot_tree shows the exact rules. In interviews, narrate the top two splits in business terms ("income > ₹50k dominates the first split") — that is stakeholder-friendly ML.',
      ],
      intuition: 'A single tree is a brilliant but jittery witness; ask a forest of them and average the testimony (that is Module 9).',
      keyPoints: [
        'No scaling needed; mixed types and multiclass native',
        'plot_tree for rules; feature_importances_ with caveats',
        'Axis-aligned boundaries only → struggle on diagonal structure',
        'Single trees → high variance; ensembles fix it',
      ],
      exampleCode:
        "from sklearn.tree import DecisionTreeClassifier, plot_tree\n\ntree = DecisionTreeClassifier(max_depth=3).fit(X_tr, y_tr)\nplot_tree(tree, feature_names=feature_names, class_names=True, filled=True)\ntop = sorted(zip(feature_names, tree.feature_importances_),\n             key=lambda t: -t[1])[:3]",
      practiceExercise:
        "Train a depth-3 tree, export plot_tree, and narrate two paths in plain English ('if income > 50k and age > 30 → approve'). Check feature_importances_ and name the caveat.",
      codingTask:
        'Write tree_rules(tree, feature_names) returning a list of human-readable if-then rules from the top three leaves by row count.',
    },
  ],
}

/** Module 9 — Ensemble Learning. */
export const MODULE_09: MLModule = {
  id: 'm09',
  number: 9,
  title: 'Ensemble Learning',
  shortTitle: 'Ensemble Learning',
  tagline: 'Averaging diverse models cancels their independent errors.',
  interviewGoal:
    'Explain bagging vs boosting, RF vs XGBoost, and why ensembles are the default for tabular data.',
  topics: [
    {
      id: 't09-01',
      title: 'Ensembles, Bagging & Random Forest',
      summary: 'Averaging diverse models cancels their independent errors.',
      lesson: [
        'Ensemble learning combines many models so their errors cancel. Works when models are: (a) individually better than chance, (b) diverse — making different mistakes. If all models err identically, averaging changes nothing.',
        'Bagging (bootstrap aggregating): train each model on a random sample with replacement, then average (regression) or vote (classification). Averaging reduces variance — that is the whole point; bias stays. Random Forest = bagged trees + random feature subsets per split (max_features ≈ √d for classification), forcing trees to decorrelate.',
        'Extra perks: out-of-bag (OOB) score — each tree never saw ~37% of rows, so those rows form a free validation set. Random Forests are strong out-of-the-box, robust to defaults, need no scaling, and give usable feature importances. Weakness: slower to predict than boosted trees, less interpretable than a single tree.',
      ],
      intuition: 'Asking 1,000 slightly-drunk independent witnesses and averaging beats interviewing one sober witness three times — repetition does not cancel bias, independence cancels variance.',
      keyPoints: [
        'Bagging = bootstrap samples + vote/average → variance ↓',
        'Random Forest adds random feature subsets to decorrelate trees',
        'OOB score: free validation set from ~37% unseen rows',
        'RF no scaling, robust defaults; slower and less interpretable than a single tree',
      ],
      exampleCode:
        'from sklearn.ensemble import RandomForestClassifier\n\nrf = RandomForestClassifier(\n    n_estimators=300, max_features="sqrt",\n    min_samples_leaf=2, oob_score=True, n_jobs=-1,\n    random_state=42).fit(X_tr, y_tr)\nprint(rf.oob_score_)          # free validation\nprint(rf.score(X_val, y_val))\nprint(sorted(zip(X.columns, rf.feature_importances_), key=lambda t: -t[1])[:5])',
      practiceExercise:
        'Compare one deep tree vs a 300-tree forest on the same data. Report train/val accuracy for both and explain the variance reduction using the numbers. Toggle max_features=1.0 vs "sqrt" and note the gap.',
      codingTask:
        'Write oob_curve(X, y, sizes) returning OOB score for n_estimators in sizes — plot how the forest saturates.',
    },
    {
      id: 't09-02',
      title: 'Boosting & Gradient Boosting',
      summary: 'Sequential learners that each fix their predecessor’s mistakes.',
      lesson: [
        'Boosting trains models sequentially; each new model focuses on what the ensemble still gets wrong. AdaBoost reweights misclassified rows; gradient boosting is more general: each new tree fits the residual errors (the negative gradient of the loss) of the current ensemble. Prediction = sum of all trees scaled by learning_rate.',
        'Gradient boosting reduces bias (each tree corrects remaining error) while shallow trees per stage keep variance in check. Key hyperparameters: n_estimators (stages), learning_rate (step size — small LR + more trees usually wins), max_depth (3–6 typical), subsample (stochastic boosting, adds diversity).',
        'Gradient boosting reduces bias (each tree corrects remaining error) while shallow trees per stage keep variance in check. Key hyperparameters: n_estimators (stages), learning_rate (step size — small LR + more trees usually wins), max_depth (3–6 typical), subsample (stochastic boosting, adds diversity).',
      ],
      intuition: 'A succession of specialists: each one studies the previous committee’s remaining mistakes and fixes exactly those. Slow, focused, relentless.',
      keyPoints: [
        'Boosting = sequential, each model fits previous residuals → bias ↓',
        'Prediction = Σ learning_rate · tree predictions',
        'learning_rate ↓ with n_estimators ↑ = the standard tradeoff',
        'Shallow trees per stage keep variance manageable',
      ],
      exampleCode:
        'from sklearn.ensemble import GradientBoostingClassifier\n\ngb = GradientBoostingClassifier(\n    n_estimators=300, learning_rate=0.05,\n    max_depth=3, subsample=0.8, random_state=42,\n    loss="log_loss").fit(X_tr, y_tr)\nprint(gb.score(X_val, y_val))',
      practiceExercise:
        'Train two gradient-boosted models — one with learning_rate 0.2/n_estimators 50, another with 0.05/n_estimators 300 — and report validation scores. Explain why the smaller step with more stages usually won.',
      codingTask:
        'Implement residual_boost_1d(X, y, n_rounds) that fits DecisionTreeRegressor(max_depth=2) on residuals each round and returns the ensemble predictions — hand-rolled gradient boosting.',
    },
    {
      id: 't09-03',
      title: 'XGBoost Basics & the Boosting Family',
      summary: 'The production-grade gradient boosting library every tabular interview mentions.',
      lesson: [
        'XGBoost = gradient boosting engineered: second-order gradients (uses curvature, not just slope), regularised objectives (L1/L2 on leaf weights — overfitting control built in), histogram-based splits, and native handling of missing values (learns a default direction per split).',
        'Key parameters: n_estimators, learning_rate (eta), max_depth, subsample, colsample_bytree (feature bagging per tree), reg_lambda/reg_alpha (L2/L1), early_stopping_rounds with an eval_set — stops training when validation stops improving. LightGBM: faster, leaf-wise growth. CatBoost: native categorical features, strong out of the box.',
        'Interview angle: "RF vs XGBoost — when?" RF: fast baseline, robust, little tuning. XGBoost/LightGBM: squeezing the last 2–5% accuracy on tabular data, needs tuning + early stopping. Both are the top two entries on any tabular leaderboard.',
      ],
      intuition: 'XGBoost is gradient boosting with seatbelts (regularisation) and a turbo (histogram tricks, early stopping) — the sports car of tabular ML.',
      keyPoints: [
        'Second-order gradients + regularised leaves + missing-value handling',
        'early_stopping_rounds + eval_set = built-in overfit protection',
        'LightGBM: faster; CatBoost: native categorical handling',
        'RF vs XGBoost: RF for baseline, XGBoost for the last percent',
      ],
      exampleCode:
        'from xgboost import XGBClassifier\n\nxgb = XGBClassifier(\n    n_estimators=500, learning_rate=0.03,\n    max_depth=5, subsample=0.8, colsample_bytree=0.8,\n    reg_lambda=1.0, eval_metric="logloss",\n    early_stopping_rounds=30).fit(\n    X_tr, y_tr, eval_set=[(X_val, y_val)], verbose=False)\nprint(xgb.best_iteration, xgb.score(X_val, y_val))',
      practiceExercise:
        'On a medium tabular dataset, train a Random Forest, a GradientBoosting and an XGBClassifier (with early stopping). Tabulate val accuracy and training time; write two sentences on the tradeoff each model makes.',
      codingTask:
        'Write a generic early-stopped booster wrapper: given any sklearn-style gradient booster with partial_fit or an eval_set API, fit with early stopping and return the best model + best iteration.',
    },
  ],
}

/** Module 10 — Other Important ML Algorithms. */
export const MODULE_10: MLModule = {
  id: 'm10',
  number: 10,
  title: 'Other Important ML Algorithms',
  shortTitle: 'Other Algorithms',
  tagline: 'The rest of the toolbox: neighbours, Bayes, margins, clusters and dimensions.',
  interviewGoal:
    'Describe KNN, Naive Bayes, SVM, k-means and PCA — how each works, when to use it, and its one great weakness.',
  topics: [
    {
      id: 't10-01',
      title: 'K-Nearest Neighbors (KNN)',
      summary: 'You are the average of your k nearest neighbours — lazy learning.',
      lesson: [
        'Problem: classify (or regress) a point by looking at its k closest training points. Intuition: nearby points behave alike. How it works: store the training data (no training at all — "lazy"), compute distances at prediction time, take majority vote (classification) or mean (regression).',
        'Important parameters: k (small → wiggly, overfit; large → smooth, underfit; odd k avoids ties in binary), distance metric (Euclidean default; Manhattan for high-dim; weight by 1/distance to make closer neighbours louder).',
        'Pros: zero training, simple, naturally multiclass, non-linear boundaries. Cons: prediction is O(n·d) per query (slow at scale), needs feature scaling (distances!), curses of dimensionality (distances become meaningless in high dimensions — do dimensionality reduction first). When to use: small data, low dimensions, irregular boundaries, quick baseline. Not for: big data, high dimensions, low-latency serving.',
      ],
      intuition: 'Birds of a feather: the classification committee is whoever lives on your street.',
      keyPoints: [
        'Lazy learner: no fit phase, all work at predict time',
        'k small → overfit · k large → underfit · odd k for binary',
        'MUST scale features; curse of dimensionality destroys distance meaning',
        'Good for small/low-dim/irregular-boundary data; bad for big/high-dim/slow serving',
      ],
      exampleCode:
        'from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nknn = make_pipeline(StandardScaler(),\n                    KNeighborsClassifier(n_neighbors=7, weights="distance"))\nknn.fit(X_tr, y_tr)\nprint(knn.score(X_val, y_val))',
      practiceExercise:
        'Train KNN for k = 1, 3, 5, 11, 21 on a scaled dataset; plot train/val accuracy vs k and explain the bias–variance picture each point represents.',
      codingTask:
        'Implement knn_predict(train_X, train_y, x, k=5, weighted=False) using Euclidean distance without any library except numpy — no KD-tree shortcuts.',
    },
    {
      id: 't10-02',
      title: 'Naive Bayes',
      summary: 'Bayes’ theorem with a brave independence assumption — the text classic.',
      lesson: [
        'Problem: fast probabilistic classification, especially text. How it works: Bayes rule picks the class maximising P(class)·Π P(featureᵢ | class) — assuming features are independent given the class ("naive"). Variants: Multinomial NB (word counts — spam/ham, documents), Bernoulli NB (binary features), Gaussian NB (continuous features modelled per class).',
        'Laplace smoothing (add-α) stops zero probabilities from zeroing the whole product when a word never appeared in a class. Key parameter: alpha.',
        'Pros: trains in one pass (O(n·d)), works with tiny data, handles high-dimensional sparse text superbly, interpretable via per-word likelihoods. Cons: independence is usually false → miscalibrated probabilities, correlations between features are wasted. When to use: text classification baseline, real-time scoring, little training data. Not when: calibrated probabilities or feature interactions matter (use logistic regression or boosting).',
      ],
      intuition: 'Every word votes independently for each class using its own frequency table; multiply all votes, pick the loudest choir.',
      keyPoints: [
        'P(class | features) ∝ P(class) · Π P(feature | class)',
        'Multinomial for counts, Bernoulli for binary, Gaussian for continuous',
        'Laplace smoothing (alpha) keeps zero-probabilities from nuking the product',
        'Fast, tiny-data-friendly, text-classic baseline — but miscalibrated probabilities',
      ],
      exampleCode:
        'from sklearn.naive_bayes import MultinomialNB\nfrom sklearn.feature_extraction.text import CountVectorizer\n\nX = CountVectorizer().fit_transform(documents)\nnb = MultinomialNB(alpha=1.0).fit(X, labels)\nprint(nb.classes_, nb.predict_proba(Vectorizer.transform(["free money now"])).ravel())\nprint(sorted(zip(Countvectorizer.get_feature_names_out(), nb.feature_log_prob_[0]), key=lambda t: -t[1])[:5])',
      practiceExercise:
        "Build a spam classifier from a raw text dataset: CountVectorizer → MultinomialNB → classify five test messages. Print the five words most associated with spam and explain why smoothing mattered.",
      codingTask:
        'Implement naive_bayes_train(X_counts, y) and naive_bayes_predict(model, X_counts) from scratch with log-space computation and Laplace smoothing — no sklearn.',
    },
    {
      id: 't10-03',
      title: 'Support Vector Machines (SVM)',
      summary: 'Maximum-margin classification with the kernel trick for non-linearity.',
      lesson: [
        'Problem: find the separating boundary with the widest margin — the street between the two classes with the biggest empty pavement. How it works: support vectors (the closest points) define the hyperplane; interior points could vanish without changing anything. C controls the tolerance for margin violations: small C → wide soft street (regularised), large C → narrow, obedient street (overfit risk).',
        'Kernels: when a straight line cannot separate, the kernel trick implicitly maps data to higher dimensions where it can — without computing the mapping. RBF kernel (gamma) is the default: small gamma → smooth wide influence, large gamma → spiky islands around each point (overfit).',
        'Pros: effective in high dimensions, memory-efficient (only support vectors matter), versatile via kernels, strong on medium-sized clean datasets. Cons: scales badly (O(n²)–O(n³)) — not for very large n; needs scaling; probabilities need extra calibration; choosing C/gamma needs a grid search. When to use: small-to-medium data, high-dimensional (text), clear margin. Not: huge n, noisy overlapping classes at scale, need for fast retraining.',
      ],
      intuition: 'The widest street principle: maximise the distance between the two classes; the data points hugging the curb (support vectors) are the only ones that matter.',
      keyPoints: [
        'Max-width-margin hyperplane; C controls violation tolerance',
        'RBF kernel gamma: small = smooth/wide, large = spiky/overfit',
        'Only support vectors matter — memory-efficient at serving time',
        'Needs scaling; grid-search C/gamma; slow at large n; needs calibration for probabilities',
      ],
      exampleCode:
        'from sklearn.svm import SVC\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import GridSearchCV\n\npipe = make_pipeline(StandardScaler(), SVC())\ngrid = GridSearchCV(pipe, {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.1, 0.01]},\n                    cv=5, n_jobs=-1)\ngrid.fit(X_tr, y_tr)\nprint(grid.best_params_, grid.best_score_)',
      practiceExercise:
        'Train a linear SVM and an RBF SVM on a non-linear synthetic dataset. Plot the RBF boundary for two gamma values (small vs large) and describe which overfits.',
      codingTask:
        'Write a dual nearest-centres classifier (a simplified SVM intuition): assign new points to the class whose centroid is nearest — compare its boundary to a full SVC on the same data.',
    },
    {
      id: 't10-04',
      title: 'K-Means Clustering',
      summary: 'Grouping without labels — the workhorse of unsupervised segmentation.',
      lesson: [
        'Problem: partition data into k groups with no labels. How it works: (1) place k centroids randomly (k-means++ makes this smart), (2) assign each point to the nearest centroid, (3) move each centroid to its cluster mean, (4) repeat until stable. Minimises within-cluster sum of squares (inertia).',
        'Important parameters: k (choose by the elbow method on inertia, or silhouette score 0–1 where higher = better-separated clusters), n_init (multiple random restarts, keep best), max_iter. Features must be scaled — distances again.',
        'Pros: fast, scales well, simple to interpret (centroid = prototype customer). Cons: you must pick k; assumes spherical, similar-size clusters — fails on moons/elongated shapes; sensitive to initialisation and outliers; every point is forced into a cluster. When to use: customer segmentation, topic grouping, as a feature step (cluster distance as a feature). Not: irregular shapes (DBSCAN), unknown number of groups with no elbow, heavy outliers.',
      ],
      intuition: 'Lighthouses and ships: each ship sails to the nearest lighthouse, then each lighthouse walks to the middle of its fleet. Repeat until everyone settles.',
      keyPoints: [
        'Loop: assign → update means → repeat; minimises inertia',
        'k by elbow / silhouette; n_init for robustness; scale features',
        'Spherical, similar-size clusters; fails on moons and outliers',
        'Use for segmentation / topic grouping / as a distance feature',
      ],
      exampleCode:
        'from sklearn.cluster import KMeans\n\nkm = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X_scaled)\nlabels = km.labels_\ninertia = km.inertia_\ncenters = km.cluster_centers_  # prototype of each cluster',
      practiceExercise:
        'Generate two shapes: blobs and moons. Run k-means on each for k=2 and report inertia and the resulting boundaries; explain why moons defeat it.',
      codingTask:
        'Implement kmeans_one_dim(X, k=2) on 1-D data (no library): initialise with k-means++, run 20 iterations, return centroids — let a circle hand-roll the algorithm.',
    },
    {
      id: 't10-05',
      title: 'PCA Basics',
      summary: 'Compressing dimensions along directions of maximum variance.',
      lesson: [
        'Problem: many correlated features — visualise, denoise, or speed up models. How it works: PCA finds orthogonal directions (principal components) of maximum variance; project data onto the first few. PC1 = direction of greatest spread; each next PC is perpendicular to the last and captures the most remaining variance.',
        'Procedure: standardise (PCA is variance-based — unscaled big units dominate), fit, inspect explained_variance_ratio_, choose components for a cumulative threshold (e.g. 95%) or for 2-D visualisation. n_components is the key parameter.',
        'Pros: removes correlation, compresses, kills some noise, enables 2-D plots of high-dim data. Cons: components are linear mixes of features — interpretability dies; it is unsupervised (variance ≠ target relevance); variance direction can be irrelevant to the task. When to use: visualisation, collinear features before linear models, dimensionality before KNN/clustering, noise reduction. Not: tree models (they do not care about collinearity) or when you need to explain features to stakeholders.',
      ],
      intuition: 'Rotating a cloud of points to find its longest shadow: PC1 is where the cloud stretches most — project and drop the flat directions.',
      keyPoints: [
        'PC = orthogonal directions of max variance; PC1 = longest spread',
        'Standardise first; choose components by explained variance ratio',
        'Removes correlation/noise; enables 2-D plots of high-dim data',
        'Unsupervised variance ≠ target relevance; kills interpretability; trees do not need it',
      ],
      exampleCode:
        "from sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\n\nX_scaled = StandardScaler().fit_transform(X)\npca = PCA(n_components=0.95).fit(X_scaled)\nprint(pca.n_components_, 'components keep 95% of variance')\nprint(pca.explained_variance_ratio_)",
      practiceExercise:
        'Take a 20-column dataset: run PCA, plot cumulative explained variance vs components, and pick the number that keeps 95%. Then ask: would a tree model care about these 20 columns being correlated?',
      codingTask:
        'Implement pca_on_rows(X, k=2) for mean-centred data via SVD (numpy.linalg.svd) — project onto the first two singular vectors and return the 2-D projection + reconstruction error.',
    },
  ],
}

export const ML_MODULES_WITH_C = [MODULE_07, MODULE_08, MODULE_09, MODULE_10]
