import type { MLModule } from '../types'

/**
 * Syllabus part F — Module 15 (Projects).
 * Projects are work-first: each gives requirements + hints; the learner builds.
 */

export const MODULE_15: MLModule = {
  id: 'm15',
  number: 15,
  title: 'ML Projects',
  shortTitle: 'ML Projects',
  tagline: 'Progressively harder builds — you write the code, the mentor reviews.',
  interviewGoal:
    'Discuss eight portfolio projects end to end: data decisions, model choice, metrics and improvements.',
  topics: [
    {
      id: 't15-01',
      title: 'Beginner Projects: House Price & Student Score Prediction',
      summary: 'Two regression builds that exercise Modules 3–6 and 11.',
      lesson: [
        'House Price Prediction (regression): dataset like Kaggle Housing/Ames. Requirements — EDA with 3 findings; handle missing values with justified strategies; encode categoricals; feature-engineer at least two (price-per-sqft is off-limits — leakage-adjacent; try age = year_sold − year_built); baseline = median price; models = LinearRegression then RandomForest; metrics MAE + RMSE + R²; error analysis on the 10 worst predictions.',
        'Student Score Prediction (regression): hours-studied + attendance + past scores → final score. Requirements — visualise relationships first; simple linear regression on the strongest feature; then multiple regression; interpret each coefficient in plain words; report MAE in score points and R²; discuss what a ±5-point error means for a real student.',
        'Do-it-yourself contract: attempt the full build before requesting the mentor solution; the mentor reviews YOUR notebook/code and returns a scored rubric (data handling, modelling, evaluation, communication) plus two concrete improvements.',
      ],
      intuition: 'Beginner projects are where the workflow becomes muscle memory: inspect → clean → split → baseline → model → evaluate → explain.',
      keyPoints: [
        'Baseline first (median/mean), always',
        'Two engineered features minimum, each with a hypothesis',
        'Report MAE + RMSE + R² and interpret in plain language',
        'Error analysis: your ten worst predictions tell the next step',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Build the House Price project fully. Self-review with the rubric: data handling (did you split before imputing?), modelling (baseline beaten by how much?), evaluation (metrics interpreted in rupees?), communication (can a non-tech person follow?). Then build Student Scores.',
      codingTask:
        'Produce a single notebook/script per project that runs top-to-bottom (restart-and-run-all clean) — the portfolio bar interviewers actually test.',
    },
    {
      id: 't15-02',
      title: 'Intermediate Projects: Churn, Loan Approval, Spam, Segmentation',
      summary: 'Four builds covering imbalanced classification and unsupervised work.',
      lesson: [
        'Customer Churn (classification, imbalanced): Telco churn dataset. Requirements — target balance analysis; metric = recall at precision ≥ 0.3 or PR-AUC (justify via offer costs); LogisticRegression baseline, then XGBoost with early stopping; threshold tuned on validation; feature importance review with business naming (“month-to-month contract users churn 3× more”).',
        'Loan Approval (classification + fairness lens): requirements — handle missing employment fields deliberately; encoding choices per column; class_weight or SMOTE inside the pipeline; confusion matrix with cost matrix (FP = lost interest, FN = defaulted principal — which costs more?); one fairness check: approval-rate gap across a demographic group.',
        'Spam Detection (text): TF-IDF + MultinomialNB vs LogisticRegression; precision-first metric (never bury real mail); error read-out of 10 false positives and 10 false negatives; top-indicating-words table.',
        'Customer Segmentation (unsupervised): mall/customers dataset — scale, K-Means with elbow + silhouette; profile clusters into named personas; one caveat sentence per persona; optionally feed cluster distance as a feature into a supervised model and report the lift.',
      ],
      intuition: 'Intermediate projects add the two real-world dimensions: imbalance (who pays for which error) and unsupervised ambiguity (naming what the data found).',
      keyPoints: [
        'Churn/loan: metric from cost matrix; resample inside the pipeline only',
        'Spam: precision-first; read 20 errors before believing the score',
        'Segmentation: elbow + silhouette, then persona names with caveats',
        'Every project: one fairness or robustness check',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Choose two of the four projects and complete them end to end. For churn or loan, write the cost matrix in currency and derive your metric from it — that table is your interview story.',
      codingTask:
        'For segmentation: write segment_profile(df, labels) returning per-cluster means + counts and an auto-generated one-line persona per cluster.',
    },
    {
      id: 't15-03',
      title: 'Interview-Level Projects: Employee Attrition & End-to-End Business Problem',
      summary: 'Portfolio anchors that survive senior-level interrogation.',
      lesson: [
        'Employee Attrition Prediction (HR dataset): requirements — full Module 14 workflow with an explicit split-before-preprocessing pipeline; class imbalance handled via class_weight; SHAP or permutation importance for the top-5 drivers; a one-page “insights for HR” memo translating model outputs into actions with caveats; discussion of ethical risks (feedback loops, proxy discrimination).',
        'End-to-end business problem (your pick: delivery ETA, ad conversion, demand forecast): requirements — frame the business question and money metric first; collect/join data; temporal split with justification; baseline → 2–3 model families; hyperparameter tuning with a documented budget; final test evaluation once; save artifact + metadata (feature list, training date, data ranges); write the deployment plan: monitoring (drift on inputs + score), retraining trigger, fallback policy.',
        'Both projects conclude with the interview defence: 2-minute walkthrough + answers to the ten standard follow-ups (leakage audit, why this metric, what breaks at 10× scale, what you would cut with half the time…). Practise out loud — the defence is a skill separate from the build.',
      ],
      intuition: 'Interview-level projects are graded on judgement: cost-aware metrics, leakage-proof plumbing, honest limits, and a deployment story.',
      keyPoints: [
        'Split-before-preprocess as a Pipeline, stated explicitly',
        'Explainable importance (SHAP/permutation) + business translation',
        'Deployment plan: monitor inputs and scores, define retraining triggers',
        'Rehearse the 2-minute defence and the ten follow-ups',
      ],
      exampleCode: undefined,
      practiceExercise:
        'Complete one of the two projects including the memo/plan artifacts. Then run the defence: record a 2-minute walkthrough and answer three follow-ups of your weakest expectation — have a peer or the mentor grill you.',
      codingTask:
        'Write save_model_artifact(model, metrics, feature_names, path) dumping the model plus a JSON metadata card (features, metrics, training date, data ranges) — the professional way to ship.',
    },
  ],
}
