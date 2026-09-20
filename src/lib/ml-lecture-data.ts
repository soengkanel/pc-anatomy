// Machine Learning course content: 8 chapters, each with a bilingual
// (English–Khmer) glossary and a 20-question practice quiz.
// All datasets and worked examples are Cambodia-based (rice yields by
// province, tuk-tuk fares in Phnom Penh, Angkor ticket sales, ABA
// transaction fraud, Khmer text, etc.). Data-only — consumed by
// LessonPack.tsx just like the IT and Rust course lessons.

import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome to Machine Learning
 * ────────────────────────────────────────────────────────────── */

const ML_WELCOME: Lesson = {
  chapterNumber: "1",
  chapterTitle: "Welcome to Machine Learning",
  chapterTitleKm: "សូមស្វាគមន៍មកកាន់ Machine Learning",
  terms: [
    { en: "Machine Learning (ML)", km: "ការរៀនដោយម៉ាស៊ីន", icon: "🤖", detail: "Teaching a computer to find patterns in data instead of writing every rule by hand. Give it examples — it figures out the rule." },
    { en: "Artificial Intelligence (AI)", km: "បញ្ញាសិប្បនិមិត្ត", icon: "🧠", detail: "The big umbrella. Any computer program that seems 'smart'. ML is the most popular way to build AI today." },
    { en: "Model", km: "ម៉ូដែល", icon: "🏗️", detail: "The rule the computer LEARNED from data. Like a recipe it wrote for itself after tasting many dishes." },
    { en: "Training", km: "ការបង្វឹក", icon: "🏋️", detail: "The process of showing many examples to the computer so it can learn. Like teaching a child by showing pictures." },
    { en: "Prediction", km: "ការទស្សន៍ទាយ", icon: "🔮", detail: "What the trained model outputs for a NEW example it hasn't seen. 'This rice field will yield 3.2 tonnes.'" },
    { en: "Dataset", km: "សំណុំទិន្នន័យ", icon: "📊", detail: "A collection of examples to learn from. E.g. rainfall + yield for every province in Cambodia for the last 10 years." },
    { en: "Feature", km: "លក្ខណៈ", icon: "🎛️", detail: "One measurable input. For a moto price predictor: brand, year, km driven. Each is one feature." },
    { en: "Label", km: "ស្លាក", icon: "🏷️", detail: "The answer we want the model to predict. For rice yield, the label is 'tonnes per hectare'." },
    { en: "Supervised Learning", km: "ការរៀនមានការណែនាំ", icon: "👨‍🏫", detail: "Learning from examples where the answer is given — like a teacher showing correct solutions. Most Cambodian ML use-cases are this." },
    { en: "Unsupervised Learning", km: "ការរៀនគ្មានការណែនាំ", icon: "🕵️", detail: "Learning WITHOUT answers — the model finds groupings by itself. Example: grouping ACLEDA customers who behave similarly." },
    { en: "Python", km: "Python", icon: "🐍", detail: "The most popular programming language for ML. Simple to read, and every major ML library speaks Python." },
    { en: "scikit-learn", km: "scikit-learn", icon: "🧪", detail: "The friendly Python library for classical ML — regression, classification, clustering. Perfect for beginners." },
  ],
  quiz: [
    { q: "Machine Learning is about?", options: ["Fixing broken machines", "Teaching a computer to find patterns in data", "Building robots only", "Repairing engines"], answer: 1 },
    { q: "AI is?", options: ["The same as ML exactly", "The big umbrella; ML is one way to build AI", "Only for games", "Something from science fiction only"], answer: 1 },
    { q: "A 'model' in ML is?", options: ["A fashion model", "The rule the computer learned from data", "A 3D shape", "A student"], answer: 1 },
    { q: "Training a model means?", options: ["Running it in a gym", "Showing it many examples so it learns", "Deleting it", "Renaming it"], answer: 1 },
    { q: "A dataset is?", options: ["A folder of games", "A collection of examples for the model to learn from", "A phone app", "A book"], answer: 1 },
    { q: "In predicting Battambang rice yield, 'rainfall' is a?", options: ["Label", "Feature (input)", "Model", "Dataset"], answer: 1 },
    { q: "In predicting Battambang rice yield, 'tonnes per hectare' is the?", options: ["Feature", "Label (answer)", "Bias", "Loss"], answer: 1 },
    { q: "Supervised learning uses?", options: ["Data with answers included", "Random noise only", "Only images", "No data"], answer: 0 },
    { q: "Unsupervised learning uses?", options: ["Answers on every row", "Data WITHOUT answers — model finds groupings", "Only text", "Only sound"], answer: 1 },
    { q: "The most common language for ML is?", options: ["Khmer script", "Python", "Assembly", "HTML"], answer: 1 },
    { q: "scikit-learn is a?", options: ["Museum in Phnom Penh", "Python library for classical ML", "TV channel", "Type of chip"], answer: 1 },
    { q: "Grouping ACLEDA customers with similar spending is?", options: ["Supervised learning", "Unsupervised learning (clustering)", "Not ML", "Only rules"], answer: 1 },
    { q: "Predicting whether an ABA transaction is fraud IS?", options: ["Supervised learning", "Only art", "Not ML", "Only physics"], answer: 0 },
    { q: "ML works best when?", options: ["You have very little data", "You have LOTS of relevant examples", "You have zero data", "The dataset is corrupt"], answer: 1 },
    { q: "A model that has NOT been trained yet is?", options: ["Ready to predict", "Basically useless", "Best in class", "Called 'expert'"], answer: 1 },
    { q: "In Cambodia, ML is used for?", options: ["Only nothing", "Rice yield forecast, mobile banking fraud, tourism demand, Khmer OCR", "Only cooking", "Only Angkor tours"], answer: 1 },
    { q: "ML predictions are always?", options: ["100% correct", "Estimates with some error — always verify important ones", "Random guesses", "Slower than humans"], answer: 1 },
    { q: "A feature vector for a durian sale might include?", options: ["Nothing", "Weight (kg), variety, market (PP/SR), month", "Only the price", "Only the buyer's name"], answer: 1 },
    { q: "The final goal of training is a model that?", options: ["Memorises the training data", "Generalises well to NEW, unseen examples", "Runs slowly", "Is very large"], answer: 1 },
    { q: "The first step in any ML project is?", options: ["Buy a GPU", "Understand the problem and gather good data", "Deploy immediately", "Write a paper"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — Data & Features
 * ────────────────────────────────────────────────────────────── */

const ML_DATA: Lesson = {
  chapterNumber: "2",
  chapterTitle: "Data & Features",
  chapterTitleKm: "ទិន្នន័យ និង លក្ខណៈ",
  terms: [
    { en: "Row (sample)", km: "ជួរដេក (គំរូ)", icon: "➡️", detail: "One example in the dataset. One row could be 'Battambang, 1420 mm rain, 3.1 tonnes/ha rice yield in 2024.'" },
    { en: "Column (feature)", km: "ជួរឈរ (លក្ខណៈ)", icon: "⬇️", detail: "One property measured across all rows. Every rice-yield row has a 'rainfall' column." },
    { en: "Numerical feature", km: "លក្ខណៈជាលេខ", icon: "🔢", detail: "A number the model can add and compare. Rainfall in mm, price in riel, distance in km." },
    { en: "Categorical feature", km: "លក្ខណៈជាប្រភេទ", icon: "🏷️", detail: "A choice from a list — not a number. Province (Phnom Penh, Siem Reap, Kampot…) or moto brand (Honda, Yamaha, Suzuki)." },
    { en: "One-hot encoding", km: "One-hot encoding", icon: "🎯", detail: "Turn a category into columns of 0/1. 'Province = Siem Reap' becomes: PP=0, SR=1, BB=0, KP=0…" },
    { en: "Missing value", km: "តម្លៃខ្វះ", icon: "❓", detail: "A cell with no answer — the survey person skipped rainfall for Ratanakiri in 2019. Must be handled before training." },
    { en: "Outlier", km: "តម្លៃខុសក្រុម", icon: "🚨", detail: "A row way off from the rest — a durian marked '999,999 riel/kg' when everything else is 8–15k. Usually a typo." },
    { en: "Normalisation", km: "ការធ្វើឱ្យធម្មតា", icon: "📏", detail: "Rescale features to the same range (e.g. 0 – 1) so 'rainfall in mm' doesn't dwarf 'temperature in °C' in the math." },
    { en: "DataFrame", km: "DataFrame", icon: "📋", detail: "A table in Python (from pandas). Rows = samples, columns = features. The workhorse of ML data work." },
    { en: "pandas", km: "pandas", icon: "🐼", detail: "Python library for tables — reads CSV, filters rows, groups by province, joins datasets. Every ML project starts with pandas." },
    { en: "Exploratory Data Analysis (EDA)", km: "ការស្វែងយល់ទិន្នន័យ", icon: "🔍", detail: "The step before modelling: plot histograms, look at averages, spot mistakes. Never skip it." },
    { en: "Data leakage", km: "ការលេចធ្លាយទិន្នន័យ", icon: "💧", detail: "When info about the answer sneaks into the features. Makes the model look great in training but fail in real life." },
  ],
  quiz: [
    { q: "In a rice-yield table, ONE ROW represents?", options: ["One province in one year", "The whole country", "One farmer's life story", "A season only"], answer: 0 },
    { q: "In the same table, ONE COLUMN represents?", options: ["Only Battambang", "One property (like 'rainfall') across all rows", "One family", "A photo"], answer: 1 },
    { q: "'Rainfall (mm)' is a?", options: ["Numerical feature", "Categorical feature", "Label only", "A photo"], answer: 0 },
    { q: "'Province' (PP, SR, BB, …) is a?", options: ["Numerical feature", "Categorical feature", "Missing value", "Outlier"], answer: 1 },
    { q: "'One-hot encoding' turns 'province' into?", options: ["A single big number", "One column per province, with 1 for that row's province", "A photo", "An emoji"], answer: 1 },
    { q: "A cell showing '?' or NaN is a?", options: ["Feature", "Missing value", "Model", "Label"], answer: 1 },
    { q: "A durian price of '999,999 riel/kg' among 8–15k rows is a?", options: ["Outlier", "Normal value", "A feature", "A label"], answer: 0 },
    { q: "Normalisation rescales features to?", options: ["A tiny range like 0–1", "10× larger", "Only integers", "Text"], answer: 0 },
    { q: "The Python table library is called?", options: ["numpy", "pandas", "matplotlib", "flask"], answer: 1 },
    { q: "A pandas 'DataFrame' is?", options: ["A picture", "A table with rows and columns", "A model", "A folder"], answer: 1 },
    { q: "Reading a CSV file with pandas uses?", options: ["pd.read_csv('file.csv')", "pd.open('file.csv')", "pd.load('file.csv')", "pd.get('file.csv')"], answer: 0 },
    { q: "EDA stands for?", options: ["Excellent Data Analytics", "Exploratory Data Analysis", "Extreme Data Access", "Empty Data Attempt"], answer: 1 },
    { q: "A histogram of Kandal rice yields shows?", options: ["The distribution of values", "One row only", "Colours only", "Coordinates on a map"], answer: 0 },
    { q: "'Data leakage' means?", options: ["Water on the disk", "Answer info accidentally in the features", "Data is wet", "The file is broken"], answer: 1 },
    { q: "Including 'total rice harvested' as a feature to predict 'total rice harvested' is?", options: ["Fine", "Data leakage — the model will cheat", "Encouraged", "Required"], answer: 1 },
    { q: "For 'moto brand: Honda / Yamaha / Suzuki' the correct encoding is?", options: ["Honda=1, Yamaha=2, Suzuki=3 as-is", "One-hot (three 0/1 columns)", "Delete the column", "Use only Honda"], answer: 1 },
    { q: "Dropping rows with missing values is?", options: ["Always the best choice", "Sometimes OK, but you lose data", "Illegal", "Slower than training"], answer: 1 },
    { q: "Filling missing rainfall with the province's mean is called?", options: ["Imputation", "Deletion", "Prediction", "Prophecy"], answer: 0 },
    { q: "Cambodian provinces range 25 provinces + PP capital. Best to encode?", options: ["Single integer 1–26", "One-hot with 26 columns (or embedding for many)", "Random values", "Text as-is into the model"], answer: 1 },
    { q: "The very first thing to do with a new dataset is?", options: ["Train immediately", "Look at it — .head(), .describe(), plots", "Delete missing rows blindly", "Publish it"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Regression: Predicting Numbers
 * ────────────────────────────────────────────────────────────── */

const ML_REGRESSION: Lesson = {
  chapterNumber: "3",
  chapterTitle: "Regression",
  chapterTitleKm: "តំរែតំរង់",
  terms: [
    { en: "Regression", km: "តំរែតំរង់", icon: "📈", detail: "ML that predicts a NUMBER — rice yield in tonnes, moto price in USD, tuk-tuk fare in riel. Answers 'how much?'" },
    { en: "Linear Regression", km: "តំរែតំរង់លីនេអ៊ែរ", icon: "📏", detail: "The simplest regression: fit a straight line through the data. Great starter model — cheap and interpretable." },
    { en: "Slope (weight)", km: "ចំណោត", icon: "↗️", detail: "How much the answer changes when the feature changes by 1. 'Every extra 100 mm of rain adds 0.2 tonnes/ha of rice.'" },
    { en: "Intercept (bias)", km: "តម្លៃចាប់ផ្តើម", icon: "⚓", detail: "Where the line crosses the y-axis. The predicted yield when every feature is zero — often just a baseline." },
    { en: "Prediction (ŷ)", km: "តម្លៃទស្សន៍ទាយ", icon: "🎯", detail: "What the model OUTPUTS for a row. Read 'y-hat'. The true answer is called y." },
    { en: "Residual (error)", km: "កំហុស", icon: "📐", detail: "The difference y − ŷ for one row. If Kampot predicted 3.0 t/ha but got 2.7 t/ha, residual is −0.3." },
    { en: "Mean Squared Error (MSE)", km: "MSE", icon: "🧮", detail: "Average of the squared residuals — the score we try to make SMALL. Squaring punishes big misses harder." },
    { en: "Root MSE (RMSE)", km: "RMSE", icon: "📊", detail: "Square root of MSE. In the same unit as the label — e.g. 'RMSE = 0.28 tonnes/ha' is easy to interpret." },
    { en: "R² (coefficient of determination)", km: "R²", icon: "🏆", detail: "How much of the variation the model explains, from 0 to 1. 0.85 means the model captures 85 % of the pattern." },
    { en: "Polynomial regression", km: "តំរែតំរង់ Polynomial", icon: "🌀", detail: "Fit a curve, not a line, by adding x², x³ features. Good for tuk-tuk fare that grows non-linearly with distance." },
    { en: "Multivariate regression", km: "តំរែតំរង់ច្រើនអថេរ", icon: "🎛️", detail: "Predict from MANY features at once — rainfall + fertiliser + province + variety → yield. The realistic case." },
    { en: "Feature scaling", km: "ការធ្វើមាត្រដ្ឋាន", icon: "⚖️", detail: "Bring rainfall (100–3000 mm) and temperature (25–35 °C) onto the same scale before training. Regression is sensitive to units." },
  ],
  quiz: [
    { q: "Regression predicts?", options: ["A category (yes/no)", "A number (like tonnes or riel)", "An image", "A song"], answer: 1 },
    { q: "Predicting tomorrow's Angkor ticket-sale COUNT is?", options: ["Classification", "Regression", "Clustering", "Reinforcement learning"], answer: 1 },
    { q: "Predicting whether an ABA transaction is 'fraud' or 'legit' is?", options: ["Regression", "Classification", "Clustering", "Not ML"], answer: 1 },
    { q: "The simplest regression model is?", options: ["Deep neural net", "Linear regression", "Random forest", "Transformer"], answer: 1 },
    { q: "In `yield = 0.002 × rain + 1.5`, the SLOPE is?", options: ["1.5", "0.002", "yield", "rain"], answer: 1 },
    { q: "In the same equation, the INTERCEPT is?", options: ["0.002", "1.5", "rain", "yield"], answer: 1 },
    { q: "'ŷ' (y-hat) means?", options: ["The true answer", "The model's prediction", "The error", "A hat"], answer: 1 },
    { q: "'Residual' means?", options: ["Leftover money", "Difference between actual and predicted (y − ŷ)", "The last row", "Trash"], answer: 1 },
    { q: "MSE is the average of?", options: ["The residuals", "The SQUARED residuals", "The features", "The labels"], answer: 1 },
    { q: "We SQUARE the residuals so that?", options: ["It looks nicer", "Big misses are punished harder & signs don't cancel", "It runs faster", "Random reason"], answer: 1 },
    { q: "RMSE is in the same units as?", options: ["The features only", "The label — easy to interpret", "Nothing", "Money always"], answer: 1 },
    { q: "R² = 1 means?", options: ["The model explains everything perfectly", "The model is broken", "R² is wrong", "You should retrain"], answer: 0 },
    { q: "R² = 0 means?", options: ["Perfect model", "The model is no better than predicting the mean", "Amazing model", "R² is broken"], answer: 1 },
    { q: "For fare vs distance in Phnom Penh tuk-tuks that curves, better to use?", options: ["Only intercept", "Polynomial or non-linear regression", "No model", "Only Kampot data"], answer: 1 },
    { q: "Adding features like fertiliser, province, variety to the yield model is?", options: ["Illegal", "Multivariate regression — usually improves accuracy", "Cheating", "Overfitting always"], answer: 1 },
    { q: "In scikit-learn, linear regression is imported from?", options: ["sklearn.linear_model", "sklearn.data", "sklearn.plots", "sklearn.regress"], answer: 0 },
    { q: "You call `.fit(X, y)` to?", options: ["Predict", "Train the model on data X with labels y", "Delete the model", "Save it"], answer: 1 },
    { q: "You call `.predict(X_new)` to?", options: ["Retrain", "Get ŷ for new data", "Compute R²", "Draw a plot"], answer: 1 },
    { q: "Comparing rainfall in mm (0–3000) and pH (5.5–7.5) — you should?", options: ["Ignore units", "Scale features so both are comparable", "Delete pH", "Delete rainfall"], answer: 1 },
    { q: "A model that fits training perfectly but predicts new Kampot data badly is?", options: ["Underfitting", "Overfitting", "Perfect", "Broken hardware"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Classification: Predicting Categories
 * ────────────────────────────────────────────────────────────── */

const ML_CLASSIFICATION: Lesson = {
  chapterNumber: "4",
  chapterTitle: "Classification",
  chapterTitleKm: "ការចាត់ថ្នាក់",
  terms: [
    { en: "Classification", km: "ការចាត់ថ្នាក់", icon: "🗂️", detail: "ML that picks a CATEGORY. 'Is this ABA transaction fraud or legit?' 'Is this photo an amok or lok lak?'" },
    { en: "Binary classification", km: "ការចាត់ថ្នាក់ជាពីរ", icon: "⚖️", detail: "Exactly two classes: fraud vs legit, tourist vs local, spam vs real. The most common case." },
    { en: "Multi-class classification", km: "ការចាត់ថ្នាក់ច្រើន", icon: "🌈", detail: "Three or more classes — e.g. classifying a photo as amok, kuy teav, num banh chok, or bai sach chrouk." },
    { en: "Logistic regression", km: "តំរែតំរង់ Logistic", icon: "📈", detail: "Despite the name, this is a CLASSIFIER. Outputs a probability between 0 and 1 — great baseline for fraud detection." },
    { en: "Decision Tree", km: "ដើមឈើសម្រេចចិត្ត", icon: "🌳", detail: "A chain of yes/no questions. 'Amount > $500? → Time between 2–4 am? → Location outside Cambodia? → fraud.' Very interpretable." },
    { en: "Random Forest", km: "ព្រៃចៃដន្យ", icon: "🌲", detail: "A team of hundreds of decision trees that vote. Robust, accurate, easy — the workhorse of tabular ML." },
    { en: "Accuracy", km: "ភាពត្រឹមត្រូវ", icon: "✅", detail: "% of predictions that were right. Simple, but misleading when classes are imbalanced (very few frauds vs many legits)." },
    { en: "Precision", km: "ភាពជាក់លាក់", icon: "🎯", detail: "Of the transactions the model FLAGGED as fraud, how many really were? High precision = few false alarms." },
    { en: "Recall", km: "ការចាប់ភ្ជាប់", icon: "🕵️", detail: "Of the ACTUAL frauds, how many did we catch? High recall = few frauds slip through." },
    { en: "F1 score", km: "ពិន្ទុ F1", icon: "🏅", detail: "The harmonic mean of precision and recall. One number that balances both — the standard for imbalanced data." },
    { en: "Confusion Matrix", km: "តារាងច្រឡំ", icon: "🧾", detail: "A 2×2 table: correct-frauds, false-alarms, missed-frauds, correct-legits. Everything you need to understand a classifier." },
    { en: "Class imbalance", km: "អតុល្យភាពថ្នាក់", icon: "🎣", detail: "When one class is much rarer (fraud is <0.5 % of ABA transactions). Needs special handling — accuracy alone lies here." },
  ],
  quiz: [
    { q: "Classification predicts?", options: ["A number", "A category", "A colour only", "A song"], answer: 1 },
    { q: "'Fraud vs legit' is?", options: ["Regression", "Binary classification", "Multi-class classification", "Unsupervised"], answer: 1 },
    { q: "Classifying a food photo as amok, kuy teav, or lok lak is?", options: ["Binary classification", "Multi-class classification", "Regression", "Clustering"], answer: 1 },
    { q: "Despite the name, 'logistic regression' is a?", options: ["Regression model", "Classifier that outputs probabilities", "Clustering method", "Neural net only"], answer: 1 },
    { q: "A decision tree makes decisions by?", options: ["Random guessing", "Chained yes/no questions", "Voting on colours", "Reading tea leaves"], answer: 1 },
    { q: "A random forest is?", options: ["A single tree", "Many decision trees voting together", "A neural network", "A database"], answer: 1 },
    { q: "Accuracy = ?", options: ["Correct predictions / total predictions", "Total data / features", "Correct predictions × 100", "Correct labels only"], answer: 0 },
    { q: "If 99.5 % of ABA transactions are legit, a model that says 'legit' for EVERY row has accuracy?", options: ["99.5 % but catches zero fraud", "0 %", "100 % perfect", "Undefined"], answer: 0 },
    { q: "Precision asks?", options: ["Of my flagged frauds, how many were real?", "Of all frauds, how many did I catch?", "Total rows", "Total money"], answer: 0 },
    { q: "Recall asks?", options: ["Of the frauds that exist, how many did I catch?", "Total predictions", "Total legits", "Total customers"], answer: 0 },
    { q: "F1 score balances?", options: ["Precision and recall", "Accuracy and speed", "Speed and memory", "Age and score"], answer: 0 },
    { q: "A confusion matrix shows?", options: ["Randomness only", "TP, FP, FN, TN counts", "Feature averages", "Row counts only"], answer: 1 },
    { q: "'False Negative' in fraud detection is?", options: ["A fraud we MISSED", "A legit we flagged wrongly", "Nothing", "A refund"], answer: 0 },
    { q: "'False Positive' in fraud detection is?", options: ["A legit we WRONGLY flagged as fraud", "A fraud we missed", "A perfect prediction", "Nothing"], answer: 0 },
    { q: "For rare-fraud detection, ACCURACY alone is?", options: ["The gold standard", "Misleading — use precision/recall/F1", "Impossible to compute", "The same as recall"], answer: 1 },
    { q: "To classify Khmer characters (35+ consonants), you need a?", options: ["Binary classifier", "Multi-class classifier", "Regression model", "No model"], answer: 1 },
    { q: "In scikit-learn, `RandomForestClassifier` lives in?", options: ["sklearn.ensemble", "sklearn.linear_model", "sklearn.data", "sklearn.forest"], answer: 0 },
    { q: "You measure model quality with?", options: ["Only accuracy always", "The right metric for your problem (F1 for imbalanced, accuracy when balanced)", "None", "Only speed"], answer: 1 },
    { q: "A decision tree is loved because it is?", options: ["Slow", "Interpretable — you can read the rules", "Random", "Encrypted"], answer: 1 },
    { q: "You should evaluate a classifier on?", options: ["The same data you trained on", "NEW, held-out data (test set)", "No data", "Any data"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — How Models Learn (Loss & Gradient Descent)
 * ────────────────────────────────────────────────────────────── */

const ML_TRAINING: Lesson = {
  chapterNumber: "5",
  chapterTitle: "How Models Learn",
  chapterTitleKm: "របៀបដែលម៉ូដែលរៀន",
  terms: [
    { en: "Loss function", km: "អនុគមន៍ខាតបង់", icon: "📉", detail: "A single number that says how bad the model's predictions are. Training = making this number smaller and smaller." },
    { en: "Gradient", km: "ជម្រាល", icon: "🏔️", detail: "The direction and steepness of the loss surface. Tells the model WHICH way to change its weights to lower the loss." },
    { en: "Gradient descent", km: "ការធ្លាក់ចុះជម្រាល", icon: "🎿", detail: "Walk downhill on the loss surface, one small step at a time — like a durian rolling down a Kirirom slope until it settles." },
    { en: "Learning rate", km: "អត្រារៀន", icon: "🚶", detail: "How big each step is. Too small = training crawls; too big = you overshoot and never settle. Usually 0.1, 0.01, or 0.001." },
    { en: "Epoch", km: "រង្វិលបង្វឹក", icon: "🔁", detail: "One full pass through the ENTIRE training dataset. Most training runs multiple epochs — 10, 100, or more." },
    { en: "Batch", km: "ក្រុមតូច", icon: "📦", detail: "A small chunk of the training data used for ONE update. Batches of 32 or 64 rows are common." },
    { en: "Stochastic Gradient Descent (SGD)", km: "SGD", icon: "🎲", detail: "Gradient descent that updates weights after each mini-batch instead of the whole dataset. Faster, and the noise helps escape bad spots." },
    { en: "Convergence", km: "ការបញ្ជូនគ្នា", icon: "🎯", detail: "The loss stops going down — the model has settled. Training is basically done." },
    { en: "Weights (parameters)", km: "ទម្ងន់", icon: "⚖️", detail: "The knobs the model turns while learning. In linear regression, slope + intercept ARE the weights." },
    { en: "Optimizer", km: "អ្នកបង្កើនប្រសិទ្ធភាព", icon: "🛠️", detail: "The algorithm that adjusts the weights each step. SGD, Adam, RMSprop — Adam is the default for deep learning." },
    { en: "Overfitting", km: "ការតំរូវតឹងពេក", icon: "🕸️", detail: "The model memorised the training data (including its quirks) and fails on new data. Like memorising past quiz answers, not the concept." },
    { en: "Underfitting", km: "ការតំរូវរលុងពេក", icon: "🥱", detail: "The model is too simple — it can't even fit the training data. A straight line trying to describe a curve." },
  ],
  quiz: [
    { q: "The loss function measures?", options: ["How good the food is", "How bad the model's predictions are", "How fast the CPU runs", "How much RAM is used"], answer: 1 },
    { q: "Training aims to make the loss?", options: ["Larger", "Smaller", "The same", "Random"], answer: 1 },
    { q: "Gradient descent walks?", options: ["Uphill", "Downhill on the loss surface", "Sideways only", "In circles"], answer: 1 },
    { q: "Learning rate controls?", options: ["The step size", "How many features", "How many rows", "The colour"], answer: 0 },
    { q: "A learning rate TOO BIG usually?", options: ["Trains too slowly", "Overshoots the minimum — loss oscillates", "Fixes everything", "Has no effect"], answer: 1 },
    { q: "A learning rate TOO SMALL usually?", options: ["Overshoots wildly", "Trains extremely slowly", "Crashes the computer", "Ignores data"], answer: 1 },
    { q: "One epoch means?", options: ["One row", "One full pass through ALL training data", "One second", "Ten steps"], answer: 1 },
    { q: "A batch is?", options: ["A small chunk of the dataset used per update", "All the data at once", "Only one row", "The whole test set"], answer: 0 },
    { q: "SGD stands for?", options: ["Sudden Global Drop", "Stochastic Gradient Descent", "Small Grade Difference", "Simple Grid Design"], answer: 1 },
    { q: "'Weights' in a model are?", options: ["Kilograms of rice", "The knobs the model tunes to learn", "The labels", "The features"], answer: 1 },
    { q: "In linear regression y = w × x + b, w and b are?", options: ["Features", "Weights (learned parameters)", "Rows", "Data types"], answer: 1 },
    { q: "The optimizer is?", options: ["A hardware chip", "The algorithm that updates the weights (e.g. Adam)", "A dataset", "A metric"], answer: 1 },
    { q: "Convergence means?", options: ["Loss stops decreasing — training is done", "Losing all data", "Server crashed", "Prediction is wrong"], answer: 0 },
    { q: "Overfitting looks like?", options: ["High train error, high test error", "LOW train error, HIGH test error", "Zero error everywhere", "No error only"], answer: 1 },
    { q: "Underfitting looks like?", options: ["High train error AND high test error", "Zero training error", "Only test error", "Random behaviour"], answer: 0 },
    { q: "Which usually reduces overfitting?", options: ["More training data, simpler model, regularisation", "Adding random noise labels", "Deleting the test set", "More features always"], answer: 0 },
    { q: "Which usually fixes underfitting?", options: ["A more powerful model, better features", "Fewer training rows", "Random labels", "Deleting features always"], answer: 0 },
    { q: "The default optimizer in Keras / PyTorch beginners use?", options: ["Adam", "Grid search", "Random", "Numpy"], answer: 0 },
    { q: "A loss vs epoch plot going down means?", options: ["Training is failing", "Training is working — loss is decreasing", "The model is broken", "Data corrupted"], answer: 1 },
    { q: "A loss vs epoch plot going FLAT for many epochs means?", options: ["Learning is fine, keep going", "You've likely converged — stop or tune", "Delete all data", "Reinstall Python"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Evaluation: Train / Test & Cross-Validation
 * ────────────────────────────────────────────────────────────── */

const ML_EVAL: Lesson = {
  chapterNumber: "6",
  chapterTitle: "Evaluation",
  chapterTitleKm: "ការវាយតម្លៃ",
  terms: [
    { en: "Train set", km: "សំណុំបង្វឹក", icon: "🏋️", detail: "The rows the model LEARNS from. Usually 70–80 % of your data." },
    { en: "Test set", km: "សំណុំសាកល្បង", icon: "🎓", detail: "Held-out rows the model NEVER sees during training. The 'final exam' — the only honest way to judge performance." },
    { en: "Validation set", km: "សំណុំសាកសម", icon: "🩺", detail: "A middle set used to tune choices (which model, which learning rate) WITHOUT peeking at the test set." },
    { en: "train_test_split", km: "train_test_split", icon: "✂️", detail: "The scikit-learn helper that splits X and y into train and test parts — usually 80/20." },
    { en: "Cross-validation", km: "Cross-validation", icon: "🔄", detail: "Split data into K parts (say 5). Train on 4, test on 1, repeat rotating — every row is tested once. Robust score." },
    { en: "k-fold CV", km: "k-fold CV", icon: "🎯", detail: "The most common cross-validation. K=5 or K=10. Averages the K test scores for a stable estimate." },
    { en: "Baseline model", km: "ម៉ូដែលមូលដ្ឋាន", icon: "📏", detail: "The dumbest sensible model (always predict the mean, or the majority class). Any real model MUST beat this." },
    { en: "Generalisation", km: "ការធ្វើឱ្យទូទៅ", icon: "🌍", detail: "How well the model does on data it has never seen. The whole point of ML — memorising training data isn't learning." },
    { en: "Learning curve", km: "ខ្សែកោងនៃការរៀន", icon: "📈", detail: "A plot of train vs test error as you add more data. Tells you if more data would help or if you need a different model." },
    { en: "Regularisation", km: "ការធ្វើនិយ័ត", icon: "🎚️", detail: "A penalty that stops weights from getting too large. Reduces overfitting. L1 (lasso), L2 (ridge) are the classics." },
    { en: "Hyperparameter", km: "Hyperparameter", icon: "🎛️", detail: "A setting you choose BEFORE training — learning rate, tree depth, number of neighbours. Contrast with 'weights' which are learned." },
    { en: "Grid search / Random search", km: "Grid / Random search", icon: "🔍", detail: "Automated ways to find good hyperparameters. Grid tries every combination, random samples them." },
  ],
  quiz: [
    { q: "The training set is used to?", options: ["Test the model", "Make the model learn", "Grade the students", "Nothing"], answer: 1 },
    { q: "The test set is used to?", options: ["Train the model", "Judge the FINAL model on new data", "Choose features", "Fix bugs"], answer: 1 },
    { q: "A validation set is used to?", options: ["Tune choices without touching the test set", "Train the model", "Add noise", "Nothing useful"], answer: 0 },
    { q: "A common train/test split ratio is?", options: ["100/0", "50/50 always", "80/20 or 70/30", "0/100"], answer: 2 },
    { q: "scikit-learn's split helper is?", options: ["train_test_split", "cut_data", "divide_rows", "half_pandas"], answer: 0 },
    { q: "5-fold cross-validation does?", options: ["One split only", "Trains and tests 5 times, rotating the held-out fold", "Never trains", "Uses 5 datasets"], answer: 1 },
    { q: "A 'baseline' model is?", options: ["The best model possible", "The dumbest sensible model to beat", "A photo", "A person"], answer: 1 },
    { q: "For a rice-yield regression baseline you could?", options: ["Always predict the mean yield", "Predict yield = 0", "Predict yield = 999", "Skip predictions"], answer: 0 },
    { q: "Generalisation is the model's ability to?", options: ["Memorise training", "Do well on NEW data", "Run fast", "Save disk"], answer: 1 },
    { q: "If train error is low but test error is high, the model is?", options: ["Underfitting", "Overfitting", "Perfect", "Untrained"], answer: 1 },
    { q: "If BOTH train and test errors are high, the model is?", options: ["Underfitting", "Overfitting", "Perfect", "Random"], answer: 0 },
    { q: "A learning curve compares train and test error as?", options: ["Data grows", "Colours change", "CPU load changes", "Weather changes"], answer: 0 },
    { q: "Regularisation adds a penalty on?", options: ["Small weights", "Large weights (to prevent overfitting)", "Rows", "Features"], answer: 1 },
    { q: "L2 regularisation is also called?", options: ["Lasso", "Ridge", "Elastic", "Root"], answer: 1 },
    { q: "L1 regularisation is also called?", options: ["Ridge", "Lasso", "Softmax", "Sigmoid"], answer: 1 },
    { q: "A hyperparameter is?", options: ["Learned by the model", "Set BEFORE training (e.g. tree depth, learning rate)", "The label", "The output"], answer: 1 },
    { q: "Grid search tries?", options: ["One value", "Every combination of a preset grid of hyperparameters", "Random labels", "Nothing"], answer: 1 },
    { q: "Random search is often preferred because?", options: ["It's fancier", "It finds good hyperparameters faster than grid in high dimensions", "Grid is illegal", "No reason"], answer: 1 },
    { q: "If your dataset is TINY (say 60 rows of Cambodian province data), best is?", options: ["Big deep network", "Simple model + cross-validation", "No model", "Buy more GPUs"], answer: 1 },
    { q: "Judging a model on the SAME data it trained on is?", options: ["Fine", "Cheating — score will look great, real performance unknown", "Standard practice", "Mandatory"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Neural Networks & Deep Learning
 * ────────────────────────────────────────────────────────────── */

const ML_NN: Lesson = {
  chapterNumber: "7",
  chapterTitle: "Neural Networks",
  chapterTitleKm: "បណ្តាញសរសៃប្រសាទ",
  terms: [
    { en: "Neuron (unit)", km: "កោសិកា", icon: "🧬", detail: "A tiny computing unit: multiplies inputs by weights, adds a bias, passes through an activation function. Loosely inspired by brain cells." },
    { en: "Neural Network", km: "បណ្តាញសរសៃប្រសាទ", icon: "🕸️", detail: "Layers of neurons stacked together. Each layer transforms the data a bit until the last layer produces the answer." },
    { en: "Layer", km: "ស្រទាប់", icon: "🥞", detail: "A group of neurons that all take the previous layer's output as input. Input layer → hidden layers → output layer." },
    { en: "Activation function", km: "អនុគមន៍សកម្មភាព", icon: "⚡", detail: "The non-linear squisher inside a neuron. ReLU, sigmoid, tanh. Without it the network is just a linear model." },
    { en: "ReLU", km: "ReLU", icon: "📐", detail: "Rectified Linear Unit: max(0, x). Simple and fast — the default activation in modern deep learning." },
    { en: "Softmax", km: "Softmax", icon: "🎯", detail: "Turns raw scores into a probability distribution across classes. Used at the last layer of a multi-class classifier — the 35 Khmer consonants, say." },
    { en: "Deep learning", km: "ការរៀនស៊ីជម្រៅ", icon: "🌊", detail: "Neural networks with MANY hidden layers. Learns rich features on its own — the tech behind ChatGPT and image recognition." },
    { en: "Backpropagation", km: "Backpropagation", icon: "🔙", detail: "The clever algorithm that computes how much each weight contributed to the loss, so gradient descent knows what to tweak." },
    { en: "Convolutional NN (CNN)", km: "CNN", icon: "🖼️", detail: "A neural net specialised for IMAGES. Perfect for Angkor drone photos, Khmer character images, or satellite views of rice fields." },
    { en: "Recurrent NN (RNN)", km: "RNN", icon: "🔁", detail: "A neural net specialised for SEQUENCES — Khmer text, time-series rice yields. Reads one token at a time, keeps a memory." },
    { en: "Transformer", km: "Transformer", icon: "🤖", detail: "The modern winner. Reads all tokens at once via 'attention'. The T in GPT — powers today's biggest AI models." },
    { en: "PyTorch / TensorFlow", km: "PyTorch / TensorFlow", icon: "🔥", detail: "The two big Python libraries for building neural nets. PyTorch is researcher-friendly; TensorFlow is production-friendly. Both are excellent." },
  ],
  quiz: [
    { q: "A 'neuron' in a neural net is?", options: ["A brain cell", "A tiny math unit that multiplies inputs by weights + activation", "A row of data", "A GPU"], answer: 1 },
    { q: "A neural network is built by stacking?", options: ["Files", "Layers of neurons", "GPUs only", "Databases"], answer: 1 },
    { q: "Every layer takes as input?", options: ["The raw data always", "The previous layer's output", "Random noise", "The label"], answer: 1 },
    { q: "The purpose of an activation function is to?", options: ["Add non-linearity", "Make training slower", "Colour the plot", "Delete rows"], answer: 0 },
    { q: "Without activation functions, a deep network becomes?", options: ["Even more powerful", "Just a linear model", "Random", "Untrainable"], answer: 1 },
    { q: "ReLU = ?", options: ["min(0, x)", "max(0, x)", "sin(x)", "x²"], answer: 1 },
    { q: "Softmax is used?", options: ["At the last layer of a multi-class classifier", "Everywhere", "In regression only", "Nowhere useful"], answer: 0 },
    { q: "Deep learning means neural networks with?", options: ["Just one neuron", "MANY hidden layers", "Zero layers", "Only a bias"], answer: 1 },
    { q: "Backpropagation computes?", options: ["Gradients of the loss w.r.t. every weight", "The label", "The features", "The dataset size"], answer: 0 },
    { q: "A CNN is best for?", options: ["Text only", "Images (Angkor photos, Khmer OCR)", "Databases", "Speech only"], answer: 1 },
    { q: "An RNN is best for?", options: ["Sequences (text, time series)", "Only tables", "Only pictures", "Nothing"], answer: 0 },
    { q: "Transformers use a mechanism called?", options: ["Convolution", "Attention", "Recursion", "Rotation"], answer: 1 },
    { q: "GPT stands for?", options: ["Great Python Trainer", "Generative Pre-trained Transformer", "Grand Prix Tour", "Global Population Table"], answer: 1 },
    { q: "PyTorch and TensorFlow are?", options: ["Games", "The two dominant deep-learning libraries", "Cambodian tea brands", "Datasets"], answer: 1 },
    { q: "Training a neural net updates its?", options: ["Weights (via backprop + gradient descent)", "Rows", "GPU", "Filename"], answer: 0 },
    { q: "For 60 rows of Cambodian farm data, a deep neural net is?", options: ["Perfect", "Overkill — usually random forest / linear beats it", "Impossible to write", "Required"], answer: 1 },
    { q: "For millions of Khmer text messages to classify sentiment, deep learning is?", options: ["Overkill", "A good fit", "Illegal", "The same as regression"], answer: 1 },
    { q: "A network with 100+ hidden layers is?", options: ["A very deep network", "Impossible", "Always worse", "A shallow one"], answer: 0 },
    { q: "Training deep networks usually needs a?", options: ["GPU or TPU", "Small phone", "Only CPU always", "Nothing extra"], answer: 0 },
    { q: "'Transfer learning' means?", options: ["Sending files", "Reusing a pre-trained model and fine-tuning it on YOUR data", "Deleting weights", "Retraining from zero"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Modern ML & Real-World Deployment
 * ────────────────────────────────────────────────────────────── */

const ML_MODERN: Lesson = {
  chapterNumber: "8",
  chapterTitle: "Modern ML in the Wild",
  chapterTitleKm: "ML ទំនើបនៅក្នុងជីវិតពិត",
  terms: [
    { en: "Large Language Model (LLM)", km: "LLM", icon: "💬", detail: "A huge transformer trained on a lot of text. Can write Khmer poems, translate, summarise ACLEDA reports, answer questions. ChatGPT, Claude, Gemini." },
    { en: "Prompt", km: "សំណួរណែនាំ", icon: "📝", detail: "The instructions you give an LLM. Good prompts are specific: 'Translate this Khmer news headline into English.' Learn to write them well." },
    { en: "Fine-tuning", km: "ការកែសម្រួល", icon: "🎛️", detail: "Continue training a pre-trained model on your OWN data — e.g. adapt an LLM to answer questions about Angkor tour packages." },
    { en: "Embedding", km: "Embedding", icon: "🧭", detail: "A number-vector that represents a word, sentence, or image. Similar meanings sit close in vector space — the basis of semantic search." },
    { en: "RAG (Retrieval-Augmented Generation)", km: "RAG", icon: "📚", detail: "Give an LLM extra documents at question time (like a Cambodian tax law PDF) so it can cite them. Reduces hallucination." },
    { en: "Bias in ML", km: "ការលំអៀង", icon: "⚠️", detail: "When a model treats groups unfairly. E.g. a fraud model that flags certain provinces more. Always audit before deploying." },
    { en: "Hallucination", km: "ការស្រមើលស្រមៃ", icon: "🌫️", detail: "When an LLM confidently makes up a fact. Never trust ML output for high-stakes decisions without verifying it." },
    { en: "Inference", km: "ការទាយ", icon: "⚡", detail: "Running a trained model on new inputs (in production). Contrast with 'training'. Inference must be fast and cheap." },
    { en: "Model deployment", km: "ការចាប់ផ្តើមប្រើ", icon: "🚀", detail: "Putting the trained model behind an API or in an app so real users (ABA customers, tuk-tuk apps) can call it." },
    { en: "MLOps", km: "MLOps", icon: "🔧", detail: "The engineering discipline of building, monitoring, and retraining ML systems in production. Like DevOps, but for models." },
    { en: "Data drift", km: "Data drift", icon: "🌊", detail: "When real-world data slowly stops looking like your training data — e.g. new moto models on the market. Models age; monitor and retrain." },
    { en: "Ethical ML", km: "ML មានក្រមសីលធម៌", icon: "🕊️", detail: "Being honest about limits, avoiding harm, respecting privacy, and making sure your model helps people — including the poorest and most rural." },
  ],
  quiz: [
    { q: "An LLM is a?", options: ["Small model on your phone only", "Large Language Model — huge transformer trained on text", "Local Land Manager", "Long Lecture Machine"], answer: 1 },
    { q: "Examples of LLMs include?", options: ["ChatGPT, Claude, Gemini", "Excel and Word", "MySQL", "MS Paint"], answer: 0 },
    { q: "A 'prompt' is?", options: ["A song", "The instructions you type to an LLM", "A GPU", "A weight"], answer: 1 },
    { q: "Fine-tuning is?", options: ["Continuing training on YOUR data to specialise the model", "Deleting the model", "Random search", "A new model from scratch"], answer: 0 },
    { q: "An embedding is?", options: ["A short piece of embroidered cloth", "A vector representing a word, sentence, or image", "A dataset only", "A file format"], answer: 1 },
    { q: "RAG stands for?", options: ["Retrieval-Augmented Generation", "Random Angkor Guide", "Rice And Grain", "Ratanakiri Agricultural Group"], answer: 0 },
    { q: "RAG helps LLMs by?", options: ["Deleting weights", "Giving them extra reference docs at question time", "Adding noise", "Slowing them down"], answer: 1 },
    { q: "Bias in ML means?", options: ["The model is fast", "The model treats groups unfairly", "The model is small", "Nothing"], answer: 1 },
    { q: "A hallucination is?", options: ["A model saying something confidently but wrong", "A perfect answer", "A GPU error", "A file"], answer: 0 },
    { q: "Inference (in ML) means?", options: ["Training", "Running a trained model on new inputs", "Deleting a model", "Renaming a model"], answer: 1 },
    { q: "Model deployment is?", options: ["Putting the model behind an API/app so users can use it", "Deleting the model", "A new algorithm", "The training loss"], answer: 0 },
    { q: "MLOps is?", options: ["A Cambodian company", "The engineering discipline of running ML in production", "A dataset", "A GPU"], answer: 1 },
    { q: "Data drift means?", options: ["The disk is broken", "Real-world data slowly stops looking like your training data", "The GPU overheats", "The label is missing"], answer: 1 },
    { q: "To fight data drift you should?", options: ["Ignore it", "Monitor and retrain periodically with new data", "Delete the app", "Nothing"], answer: 1 },
    { q: "For LLMs deployed in Khmer, which is important?", options: ["Test on Khmer text — many models are English-heavy", "Only use English", "Skip testing", "Use only images"], answer: 0 },
    { q: "Ethical ML includes?", options: ["Privacy, fairness, transparency, honesty about limits", "Only speed", "Only accuracy", "Ignoring rural users"], answer: 0 },
    { q: "A Cambodian rice-yield model trained only on Battambang data will likely?", options: ["Work perfectly everywhere", "Be biased toward Battambang conditions — needs broader data", "Refuse to run", "Only work on desktop"], answer: 1 },
    { q: "Before deploying a fraud model, you should?", options: ["Test it on real data, audit for bias, monitor errors", "Deploy immediately", "Encrypt the code only", "Send to marketing"], answer: 0 },
    { q: "The BEST way to learn ML further is?", options: ["Only videos", "Build small Cambodian projects (predict rice, classify Khmer letters, cluster ABA customers)", "Only read", "Skip practice"], answer: 1 },
    { q: "ML in Cambodia can help?", options: ["Nobody", "Farmers, banks, hospitals, students, tourism — many sectors", "Only foreigners", "Only Phnom Penh"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Master export — merged into LESSONS in lecture-data.ts
 * ────────────────────────────────────────────────────────────── */

export const ML_LESSONS: Record<string, Lesson> = {
  "ml-welcome": ML_WELCOME,
  "ml-data": ML_DATA,
  "ml-regression": ML_REGRESSION,
  "ml-classification": ML_CLASSIFICATION,
  "ml-training": ML_TRAINING,
  "ml-eval": ML_EVAL,
  "ml-nn": ML_NN,
  "ml-modern": ML_MODERN,
};
