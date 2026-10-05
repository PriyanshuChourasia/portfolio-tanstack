import type { MLModule } from '../types'

/** Module 4 — Exploratory Data Analysis. */
export const MODULE_04: MLModule = {
  id: 'm04',
  number: 4,
  title: 'Exploratory Data Analysis',
  shortTitle: 'EDA',
  tagline: 'Interrogate the dataset before you model it — interviewers love a candidate who looks first.',
  interviewGoal:
    'Describe a univariate/bivariate EDA workflow, name the plots and statistics you run first, and explain how EDA drives feature and model choices.',
  topics: [
    {
      id: 't04-01',
      title: 'Univariate Analysis',
      summary: 'One variable at a time: distributions, central tendency, spread, outliers.',
      lesson: [
        'Univariate analysis studies one column at a time. For numeric columns report centre (mean vs median — the median resists outliers), spread (std, IQR, range) and shape (skewness, modality). Histograms and box plots show the shape; KDE smooths it. For categorical columns use frequency tables and bar charts; cardinality matters for encoding later.',
        'Outliers deserve a sentence in every interview answer: detect them with IQR fences (below Q1 − 1.5·IQR or above Q3 + 1.5·IQR) or z-scores beyond ~3, then decide — data-entry error (fix or drop), genuine extreme (keep, maybe cap or log-transform), or a separate population (segment). Never delete silently.',
      ],
      intuition: 'Univariate EDA is the medical check-up for each column: pulse, temperature, blood pressure before diagnosing the patient.',
      keyPoints: [
        'Mean is pulled by outliers; median is robust',
        'IQR fences at 1.5×IQR define the classic outlier rule',
        'Skew hints at log/Box-Cox transforms',
        'Categorical cardinality drives encoding choices',
      ],
      exampleCode:
        'import pandas as pd\n\ndf = pd.read_csv("data.csv")\nprint(df["age"].describe())\nq1, q3 = df["age"].quantile([0.25, 0.75])\niqr = q3 - q1\noutliers = df[(df["age"] < q1 - 1.5 * iqr) | (df["age"] > q3 + 1.5 * iqr)]\nprint(len(outliers), "outliers by IQR fence")\nprint(df["city"].value_counts(normalize=True).head())',
      practiceExercise:
        'Pick any tabular dataset and profile five columns: three numeric (report mean, median, std, skew, count outliers via IQR) and two categorical (frequency table, cardinality). Write one sentence per column on what you would do about it.',
      codingTask:
        'Write univariate_report(series) returning count, mean, median, std, skew, IQR-fence outlier count and, for strings, the top-5 value counts and cardinality.',
    },
    {
      id: 't04-02',
      title: 'Bivariate & Multivariate Analysis',
      summary: 'Relationships: numeric vs numeric, numeric vs categorical, and the correlation trap.',
      lesson: [
        'Bivariate analysis asks how two variables move together. Numeric vs numeric: scatter plots plus Pearson correlation (linear) or Spearman (monotonic, rank-based, outlier-resistant). Numeric vs categorical: grouped box plots, or compare group means; ANOVA formalises it. Categorical vs categorical: cross-tabs, stacked bars, chi-square.',
        'The correlation matrix is the workhorse, but quote its limits in interviews: correlation is linear and symmetric, does not imply causation, and misses interactions. Multivariate tools — pair plots, correlation heatmaps, and dimensionality previews like PCA — reveal structure (clusters, multicollinearity) that pairwise views hint at.',
      ],
      intuition: 'Univariate checks each instrument in the band; bivariate listens for the harmonies and the clashes between them.',
      keyPoints: [
        'Pearson = linear, Spearman = monotonic and robust',
        'Correlation ≠ causation — say it before the interviewer does',
        'Heatmaps expose multicollinearity feeding linear models',
        'Grouped comparisons: box plots by category, then test',
      ],
      exampleCode:
        'import seaborn as sns\n\n    corr = df.select_dtypes("number").corr()\n    sns.heatmap(corr, annot=True, cmap="coolwarm")\n    sns.boxplot(data=df, x="city", y="price")\n    sns.scatterplot(data=df, x="size", y="price", hue="city")',
      practiceExercise:
        'On a real dataset: plot a correlation heatmap and list the two strongest pairs; draw three grouped box plots; write down one hypothesis each plot suggests and how you would test it.',
      codingTask:
        'Write top_correlations(df, k) that returns the k strongest absolute pairwise Pearson correlations (excluding self-pairs) with both column names.',
    },
    {
      id: 't04-03',
      title: 'Patterns, Anomalies & Distribution Analysis',
      summary: 'What EDA is for: finding leakage smells, drift risks and modelling hints before modelling.',
      lesson: [
        'Distribution analysis ties EDA together: compare feature distributions across the target (do classes separate?), across time (is there drift between periods?) and across splits (do train and test look alike?). A feature that separates classes perfectly is a leakage suspect; a feature whose distribution shifts by month is a drift risk for production.',
        'Anomaly detection at EDA stage is mostly unsupervised eyeballing plus simple rules: IQR fences, isolation forests for multivariate oddities, and duplicate/near-duplicate checks. Log the findings — EDA output is a modelling plan: which features to transform, which to drop, which model family fits (linear relationships → regularised linear; non-linear → trees), and which validation split respects time.',
      ],
      intuition: 'EDA is reconnaissance before the campaign: you would not invade with a map you never unrolled.',
      keyPoints: [
        'Too-perfect features smell of leakage',
        'Compare train vs test distributions for drift',
        'Isolation forest: multivariate anomaly default',
        'EDA ends in a modelling plan, not just plots',
      ],
      practiceExercise:
        'Take a dataset with a date column: split it by time and compare feature means and category frequencies across the two halves. Report any feature whose distribution moves materially, and say what you would do about it.',
      codingTask:
        'Write drift_report(train_df, test_df, cols) returning, per column, the mean shift (numeric) or top-category frequency shift (categorical), flagged when beyond a threshold.',
    },
  ],
}

/** Module 5 — Machine Learning Fundamentals. */
export const MODULE_05: MLModule = {
  id: 'm05',
  number: 5,
  title: 'Machine Learning Fundamentals',
  shortTitle: 'ML Fundamentals',
  tagline: 'The vocabulary every ML interview opens with — own it completely.',
  interviewGoal:
    'Define ML precisely, place AI/ML/DL relative to each other, classify learning paradigms, and explain splits, overfitting and leakage with examples.',
  topics: [
    {
      id: 't05-01',
      title: 'What is ML? AI vs ML vs Deep Learning',
      summary: 'Definitions with examples — the thirty-second answer that sets the tone.',
      lesson: [
        'Machine learning is the field where programs improve at a task T with experience E measured by performance P — learning patterns from data instead of hand-coded rules. AI is the broader ambition of intelligent behaviour (search, planning, rules); ML is one way to achieve it; deep learning is the subset of ML using multi-layer neural networks.',
        'Give one concrete example per ring in interviews: AI — a chess engine or route planner; classic ML — a gradient-boosted model scoring loan default from tabular features; DL — a CNN reading X-rays or a transformer translating text. The nested-circles picture (DL ⊂ ML ⊂ AI) plus examples is a complete answer.',
      ],
      intuition: 'AI is the continent, ML the country, DL the capital city — same map, different zoom levels.',
      keyPoints: [
        'ML = learning from data, not hand-coded rules',
        'Arthur Samuel framing: task T, experience E, performance P',
        'DL ⊂ ML ⊂ AI — nested, not competing',
        'One example per ring makes the answer concrete',
      ],
      practiceExercise:
        'Write your own 30-second definition of ML from memory, then classify eight systems you use daily (spam filter, GPS, recommendation feed, face unlock, autocomplete, chess app, chatbot, price predictor) into rules-based AI, classic ML or DL.',
    },
    {
      id: 't05-02',
      title: 'Supervised, Unsupervised & Semi-supervised Learning',
      summary: 'Paradigms classified by the feedback the data provides.',
      lesson: [
        'Supervised learning trains on labelled pairs (x, y): regression when y is continuous, classification when y is categorical. Unsupervised learning has no labels — it finds structure: clustering (k-means, hierarchical), dimensionality reduction (PCA), association rules. Self-supervised learning manufactures labels from the data itself (next-word prediction); semi-supervised mixes a little labelled data with a lot unlabelled; reinforcement learning learns actions from reward signals.',
        'Interviews probe the boundary cases: fraud detection with almost no labels (anomaly detection, semi-supervised), customer segmentation with no target (clustering, not classification), and churn prediction with last year labels (supervised binary classification). Naming the paradigm correctly signals you can scope a problem before modelling it.',
      ],
      intuition: 'Supervised = learning with an answer key; unsupervised = finding the shape of the cloud with no key; semi-supervised = a few answered pages among thousands.',
      keyPoints: [
        'Regression vs classification = continuous vs discrete y',
        'Clustering and PCA are unsupervised staples',
        'Self-supervision creates labels from raw data',
        'Name the paradigm first when scoping any problem',
      ],
      practiceExercise:
        'For six business problems (segment shoppers, predict house prices, detect novel fraud, group news articles, forecast demand, tag photos without labels) write the paradigm, the x and the y (or why there is no y).',
    },
    {
      id: 't05-03',
      title: 'Features, Labels & the Train/Validation/Test Split',
      summary: 'The atoms of a dataset and why three splits, not two.',
      lesson: [
        'A feature is an input variable (column) the model consumes; the label is the target it predicts; one row is one example. The train set fits parameters; the validation set tunes hyperparameters and compares models; the test set is touched once for the final honest estimate. Reporting test-set numbers repeatedly converts the test set into a validation set — a classic interview trap.',
        'Splitting strategy must respect structure: random splits for i.i.d. data, stratified splits to preserve class ratios, group splits when the same user/product must not straddle sets, and chronological splits for time-ordered data. State the split ratio you default to (70/15/15 or 80/20 with cross-validation on train) and why leakage-proof preprocessing (fit on train only) belongs to this conversation.',
      ],
      intuition: 'Training is studying, validation is the mock exam, test is the real exam — you would not grade yourself with the paper you studied from.',
      keyPoints: [
        'Train → fit; validation → tune; test → judge once',
        'Stratify by class; never split time-series randomly',
        'Group splits stop entity leakage between sets',
        'Refit on train+validation for deployment after model choice',
      ],
      practiceExercise:
        'For four datasets (balanced classification, 1%-fraud, user-level purchase history, daily sales) write the split you would use, the stratification/grouping/time rule, and one sentence on what leakage you are avoiding.',
      codingTask:
        'Write three_way_split(df, target) that returns stratified train/validation/test frames (70/15/15) using a fixed seed, and asserts no row appears twice.',
    },
    {
      id: 't05-04',
      title: 'Overfitting, Underfitting & the Bias–Variance Tradeoff',
      summary: 'The disease, the opposite disease, and the volume knob between them.',
      lesson: [
        'Overfitting: the model memorises training noise — low train error, high test error. Underfitting: too simple to capture the signal — high error on both. Expected error decomposes into bias² (systematic error from wrong assumptions), variance (sensitivity to the particular sample) and irreducible noise. Complexity is the knob: more capacity lowers bias and raises variance.',
        'Diagnose with learning curves: both curves high and converging → underfit (add features, richer model, less regularisation); train low but gap wide → overfit (more data, regularisation, simpler model, early stopping, bagging). In interviews always answer diagnosis before cure — say which regime the numbers indicate, then the fix.',
      ],
      intuition: 'A student who memorises past papers aces the mock but fails the real exam (overfit); one who skimmed the subject fails both (underfit). Complexity is the volume knob between the two.',
      keyPoints: [
        'High bias = underfit (bad on both) · High variance = overfit (train≫test)',
        'Error = bias² + variance + irreducible noise',
        'Fix variance: regularise, simplify, more data · Fix bias: richer model/features',
        'Learning curves tell you which cure to apply',
      ],
      exampleCode:
        'from sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_squared_error\n\nfor depth in [2, 5, None]:\n    m = DecisionTreeRegressor(max_depth=depth).fit(X_tr, y_tr)\n    tr = mean_squared_error(y_tr, m.predict(X_tr))\n    va = mean_squared_error(y_val, m.predict(X_val))\n    print(depth, round(tr, 3), round(va, 3), round(va - tr, 3))',
      practiceExercise:
        'Fit decision trees with max_depth 1, 3, 5, 10, None on a regression dataset. Tabulate train vs validation MSE, label each row underfit/good/overfit, and state one fix for each bad row.',
      codingTask:
        'Write bias_variance_report(model, X_tr, y_tr, X_val, y_val) returning train MSE, val MSE, the gap, and a label underfit/good/overfit using a gap threshold parameter.',
    },
    {
      id: 't05-05',
      title: 'Data Leakage',
      summary: 'The silent killer of ML projects — and the most common senior-level question.',
      lesson: [
        'Leakage = information from outside the training window sneaking into training, making validation look great and production terrible. Two kinds: feature leakage (a column that would not exist at prediction time — refund_issued predicting churn) and process leakage (fitting preprocessing on the full dataset before splitting).',
        'Classic vectors: scaling/imputing/encoding before the split; target encoding without cross-fitting; duplicate rows across splits; temporal leakage (training on 2024 to predict 2023); group leakage (same user in train and test). Detection heuristics: a feature suspiciously correlated with the target; validation performance collapsing when the leaky column is removed; performance that cannot be believed. Prevention is procedural: split first, fit every transformer on train only, use sklearn Pipelines so it cannot happen by accident.',
      ],
      intuition: 'Leakage is studying with next year exam paper: perfect marks, zero knowledge. The pipeline must never see the future.',
      keyPoints: [
        'Feature leakage: column unavailable at prediction time',
        'Process leakage: transformers fit on full data before the split',
        'Duplicates, groups, time — respect boundaries between splits',
        'Too-good-to-be-true performance = investigate leakage first',
      ],
      exampleCode:
        'from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\npipeline = make_pipeline(StandardScaler(), LogisticRegression())\npipeline.fit(X_train, y_train)  # scaler sees train only\n\ntrain = df[df.date < \'2025-01-01\']\ntest = df[df.date >= \'2025-01-01\']  # temporal split',
      practiceExercise:
        'Deliberately leak on any dataset: scale before splitting and add a post-outcome column. Measure validation accuracy with and without the leak, then write one paragraph on auditing a teammate notebook for leakage.',
      codingTask:
        'Write leakage_audit(df, target, split_date) flagging columns that perfectly predict the target, duplicate keys across the temporal split, and missing-value rates differing wildly between splits.',
    },
  ],
}

/** Module 6 — Linear Regression. */
export const MODULE_06: MLModule = {
  id: 'm06',
  number: 6,
  title: 'Linear Regression',
  shortTitle: 'Linear Regression',
  tagline: 'The first model every interviewer asks you to derive, critique and regularise.',
  interviewGoal:
    'Explain the linear model and MSE objective, derive the fit conceptually, enumerate the assumptions, and connect Ridge/Lasso to bias–variance.',
  topics: [
    {
      id: 't06-01',
      title: 'Simple & Multiple Linear Regression',
      summary: 'Fitting a hyperplane: y = w·x + b, and what each coefficient means.',
      lesson: [
        'Simple linear regression models one predictor: y = b0 + b1·x. Multiple linear regression extends to a hyperplane: y = b0 + b1·x1 + … + bk·xk. Each coefficient is the expected change in y per unit change in that feature holding the others fixed — the ceteris paribus clause is what interviewers listen for. The model is linear in the parameters, so polynomial terms on x still count as linear regression.',
        'Fitting chooses coefficients minimising a loss — ordinary least squares picks the line through the conditional mean. Closed-form solutions exist via the normal equation; gradient descent generalises when the closed form is expensive. Linear regression is the interpretability baseline: report coefficients, trust it on tabular data, and use it to sanity-check fancier models.',
      ],
      intuition: 'Fitting a line through a scatter of points is the simplest honest summary of a trend; multiple regression is the same idea in higher dimensions.',
      keyPoints: [
        'Coefficient = effect on y holding other features fixed',
        'Linearity is in the parameters, not the raw features',
        'OLS minimises squared errors; normal equation is the closed form',
        'The interpretability baseline every model must beat or justify',
      ],
      practiceExercise:
        'Fit simple linear regression on one feature, then add a second. Interpret each coefficient in plain English, including what holding-the-other-fixed means for correlated features.',
    },
    {
      id: 't06-02',
      title: 'Cost Function: MSE & Optimisation',
      summary: 'Why squared errors, what the loss surface looks like, and how descent finds the bottom.',
      lesson: [
        'Mean squared error averages the squared residuals: MSE = (1/n) Σ(yᵢ − ŷᵢ)². Squaring penalises large errors disproportionately, is differentiable everywhere, and yields a convex bowl for linear models — one global minimum, so gradient descent cannot get stuck. The normal equation solves ∇MSE = 0 analytically: w = (XᵀX)⁻¹Xᵀy.',
        'Gradient descent iterates w ← w − η·∇MSE. Learning rate η is the step size: too small crawls, too large diverges. Variants trade speed for memory: batch (all rows per step), stochastic (one row, noisy but cheap), mini-batch (the practical default). Feature scaling speeds convergence because unscaled features stretch the bowl into an elongated valley.',
      ],
      intuition: 'MSE is a smooth valley; gradient descent is a hiker feeling the slope and stepping downhill. Scaling the features makes the valley round, so fewer steps reach the bottom.',
      keyPoints: [
        'MSE punishes big errors quadratically and is convex here',
        'Normal equation: closed form, O(k²·n) cost, no iterations',
        'Learning rate too big → divergence; too small → crawling',
        'Scale features before gradient descent',
      ],
      exampleCode:
        'import numpy as np\n\ndef mse(y, yhat):\n    return float(np.mean((y - yhat) ** 2))\n\ndef grad_descent(X, y, lr=0.05, epochs=2000):\n    w = np.zeros(X.shape[1])\n    for _ in range(epochs):\n        grad = X.T @ (X @ w - y) / len(y)\n        w -= lr * grad\n    return w',
      practiceExercise:
        'Implement MSE and batch gradient descent for one-dimensional data; plot loss vs epoch for learning rates 0.001, 0.05 and 0.5 and describe each curve in one sentence.',
      codingTask:
        'Write fit_linear(X, y) using the normal equation and another fit_linear_gd(X, y) using gradient descent; assert both return coefficients within 1e-6 of each other on standardised data.',
    },
    {
      id: 't06-03',
      title: 'Assumptions of Linear Regression',
      summary: 'Linearity, independence, homoscedasticity, normality, no multicollinearity — and the fixes.',
      lesson: [
        'The classical assumptions: (1) linearity — the mean of y is linear in the features; (2) independence of errors; (3) homoscedasticity — constant error variance; (4) normality of errors — needed for inference, not for prediction; (5) no perfect multicollinearity among features. Violations do not stop predictions; they distort coefficients, standard errors and extrapolations.',
        'Diagnosis is visual and statistical: residuals-vs-fitted for linearity and homoscedasticity (funnel shape = heteroscedasticity), Q-Q plot for normality, VIF (>10 = trouble) for multicollinearity. Fixes: transform features or target (log for skew, Box-Cox), robust or weighted regression for heteroscedasticity, drop/combine/regularise collinear features, and time-series models when errors are autocorrelated.',
      ],
      intuition: 'Assumptions are the warranty conditions: the model still runs outside them, but you cannot trust the printed coefficient labels.',
      keyPoints: [
        'Residual plots beat memorised tests — read patterns',
        'Funnel-shaped residuals → heteroscedasticity → log or weights',
        'VIF above 10 flags destructive multicollinearity',
        'Normal errors matter for confidence intervals, not for point predictions',
      ],
      practiceExercise:
        'Fit a regression on a skewed target: plot residuals-vs-fitted and a Q-Q plot before and after a log transform of y. Write which assumption each plot checks and what changed.',
      codingTask:
        'Write assumption_check(model, X, y) returning VIF per feature, a heteroscedasticity flag from residual spread across fitted-value quartiles, and the residual skew.',
    },
    {
      id: 't06-04',
      title: 'Regularisation Intuition: Ridge & Lasso',
      summary: 'Adding a penalty to the loss: L2 shrinks, L1 selects.',
      lesson: [
        'Regularisation adds a penalty on coefficient size to the loss. Ridge (L2) adds λΣw² — shrinks all coefficients smoothly toward zero, handles multicollinearity by distributing weight, keeps every feature. Lasso (L1) adds λΣ|w| — its diamond-shaped penalty has corners, driving some coefficients to exactly zero, so it performs feature selection. Elastic Net mixes both.',
        'λ is the complexity dial: 0 recovers OLS; as λ grows, bias rises and variance falls — the bias–variance tradeoff in one hyperparameter. Always scale features first (penalties are scale-sensitive) and choose λ by cross-validation on the validation folds. Interview sound bite: Ridge when many small effects exist, Lasso when you believe few features matter.',
      ],
      intuition: 'Ridge squeezes the whole team equally; Lasso fires the least useful players outright — zeroing them from the roster.',
      keyPoints: [
        'Ridge = L2, shrinks; Lasso = L1, selects (exact zeros)',
        'L1 corners produce sparsity; L2 never zeroes coefficients',
        'Scale features before any penalised fit',
        'Choose λ by cross-validation, not by hope',
      ],
      exampleCode:
        'from sklearn.linear_model import RidgeCV, LassoCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nridge = make_pipeline(StandardScaler(), RidgeCV(alphas=[0.01, 0.1, 1, 10]))\nlasso = make_pipeline(StandardScaler(), LassoCV(cv=5))\nridge.fit(X_tr, y_tr)\nlasso.fit(X_tr, y_tr)\nprint(sum(lasso[-1].coef_ == 0), "features zeroed by Lasso")',
      practiceExercise:
        'On a dataset with 30 features (inject some noise columns), fit Ridge and Lasso over a λ grid with cross-validation. Plot validation error vs λ and count how many coefficients Lasso zeroes at its best λ.',
      codingTask:
        'Write regularisation_compare(X_tr, y_tr, X_val, y_val) fitting OLS, Ridge and Lasso, returning val MSE for each plus the zero-coefficient count for Lasso.',
    },
  ],
}