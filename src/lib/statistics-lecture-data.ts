// Statistics course content: 8 chapters, each with a bilingual
// (English–Khmer) glossary and a 20-question practice quiz.
// All datasets and worked examples are Cambodia-based (rice yields by
// province, tuk-tuk fares in Phnom Penh, Angkor ticket sales, ABA
// transfers, market prices, hospital wait times, election turnout).
// Data-only — consumed by LessonPack.tsx just like the IT, Rust, and ML courses.

import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome to Statistics
 * ────────────────────────────────────────────────────────────── */

const STAT_WELCOME: Lesson = {
  chapterNumber: "1",
  chapterTitle: "Welcome to Statistics",
  chapterTitleKm: "សូមស្វាគមន៍មកកាន់ ស្ថិតិ",
  terms: [
    { en: "Statistics", km: "ស្ថិតិ", icon: "📊", detail: "The science of collecting, organising, and making sense of numbers. It turns 'a lot of data' into 'here's what it means'." },
    { en: "Population", km: "ចំនួនប្រជាជនសរុប", icon: "🌏", detail: "Everyone or everything you want to learn about. E.g. every rice farmer in Cambodia, or every ABA account." },
    { en: "Sample", km: "គំរូ", icon: "🎯", detail: "A smaller group taken from the population. You cannot ask every farmer — you ask 500 and generalise carefully." },
    { en: "Descriptive Statistics", km: "ស្ថិតិពិពណ៌នា", icon: "📝", detail: "Summarising WHAT you have — averages, ranges, charts. No guessing about the wider world yet." },
    { en: "Inferential Statistics", km: "ស្ថិតិវិនិច្ឆ័យ", icon: "🔮", detail: "Using a sample to make claims about the whole population. Always with a stated confidence — never 100% sure." },
    { en: "Variable", km: "អថេរ", icon: "🎛️", detail: "One thing you measure — rainfall in mm, price in riel, blood pressure. Different rows can have different values." },
    { en: "Quantitative variable", km: "អថេរបរិមាណ", icon: "🔢", detail: "A number you can average. Rice yield (t/ha), age (years), moto price (USD)." },
    { en: "Qualitative variable", km: "អថេរគុណភាព", icon: "🏷️", detail: "A category — province name, blood type, moto brand. You can count how many, but you can't compute a mean of 'Honda'." },
    { en: "Data", km: "ទិន្នន័យ", icon: "🗂️", detail: "The raw measurements themselves. Numbers, labels, dates, text — before you have summarised anything." },
    { en: "Parameter", km: "ប៉ារ៉ាម៉ែត្រ", icon: "🏛️", detail: "A number describing the WHOLE population — often unknown. 'The true mean rice yield of all Cambodia' is a parameter." },
    { en: "Statistic", km: "តម្លៃស្ថិតិ", icon: "🧾", detail: "A number computed from a SAMPLE — the mean of your 500 farmers. Used to estimate the parameter." },
    { en: "Bias", km: "ភាពលំអៀង", icon: "⚖️", detail: "A systematic error that pushes results one way. Interviewing only Phnom Penh residents biases a nationwide poll." },
  ],
  quiz: [
    { q: "Statistics is the science of?", options: ["Guessing without data", "Collecting, organising, and making sense of data", "Only drawing charts", "Only doing algebra"], answer: 1 },
    { q: "In a survey of ALL rice farmers in Cambodia, the population is?", options: ["Only Battambang farmers", "Every rice farmer in Cambodia", "Only 100 farmers", "Only one province"], answer: 1 },
    { q: "A sample is?", options: ["The whole population", "A smaller group taken from the population", "Only one row", "The chart"], answer: 1 },
    { q: "Descriptive statistics does what?", options: ["Predicts the future", "Summarises the data you already have", "Only builds websites", "Uses only text"], answer: 1 },
    { q: "Inferential statistics does what?", options: ["Only draws pictures", "Uses a sample to make claims about the population", "Deletes data", "Renames columns"], answer: 1 },
    { q: "'Rice yield in tonnes/ha' is a?", options: ["Quantitative variable", "Qualitative variable", "Sample", "Population"], answer: 0 },
    { q: "'Province name (PP, SR, BB…)' is a?", options: ["Quantitative variable", "Qualitative (categorical) variable", "Parameter", "Bias"], answer: 1 },
    { q: "A parameter describes?", options: ["The whole population — usually unknown", "Only your sample", "Only the chart title", "Only the code"], answer: 0 },
    { q: "A statistic is computed from?", options: ["The whole population", "A sample", "The moon", "A wish"], answer: 1 },
    { q: "Interviewing ONLY Phnom Penh residents for a national poll causes?", options: ["No problem", "Bias — the sample doesn't represent the population", "Faster computers", "A win"], answer: 1 },
    { q: "You want the average income in Cambodia but only survey 300 city workers. Result is likely?", options: ["Unbiased", "Biased upward — city workers earn more than the rural average", "Perfect", "Zero"], answer: 1 },
    { q: "Statistics helps Cambodian farmers by?", options: ["Nothing", "Estimating expected yield, price, and risk from data", "Only writing songs", "Only cooking"], answer: 1 },
    { q: "A 'good' sample should be?", options: ["Random and representative of the population", "Just your friends", "Only Battambang", "Only weekends"], answer: 0 },
    { q: "The chart type that shows one number per bar is a?", options: ["Bar chart", "Chess board", "Emoji", "Kite"], answer: 0 },
    { q: "Numbers vs categories — the key rule is?", options: ["Compute means only on quantitative variables", "Compute means on categories too", "There is no rule", "Delete both"], answer: 0 },
    { q: "Statistics can lie when?", options: ["Never", "The sample is biased, or charts are drawn to mislead", "Only on Sundays", "Only in Khmer"], answer: 1 },
    { q: "A parameter is estimated by a?", options: ["Guess", "Statistic computed from a sample", "Photo", "Menu"], answer: 1 },
    { q: "The population of ABA users refers to?", options: ["Every ABA user in Cambodia", "Only branch staff", "Only the CEO", "Only Angkor visitors"], answer: 0 },
    { q: "The first step in any statistical study is?", options: ["Run to conclusions", "Define the question and the population clearly", "Buy a computer", "Delete data"], answer: 1 },
    { q: "The BEST attitude toward statistics is?", options: ["Trust every number blindly", "Ask HOW the data was collected before trusting it", "Ignore all numbers", "Only trust old numbers"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — Descriptive Statistics
 * ────────────────────────────────────────────────────────────── */

const STAT_DESCRIPTIVE: Lesson = {
  chapterNumber: "2",
  chapterTitle: "Descriptive Statistics",
  chapterTitleKm: "ស្ថិតិពិពណ៌នា",
  terms: [
    { en: "Mean (average)", km: "មធ្យម", icon: "➗", detail: "Add all values, divide by count. 5 rice yields (3.1, 2.9, 2.8, 3.3, 2.7) → mean = 2.96 t/ha." },
    { en: "Median", km: "តម្លៃកណ្តាល", icon: "🎯", detail: "The middle value when sorted. Robust to outliers — Phnom Penh moto-price median beats mean when a rare Ducati shows up." },
    { en: "Mode", km: "តម្លៃច្រើនបំផុត", icon: "🏆", detail: "The most common value. For 'favourite market' the mode might be Psar Thmei." },
    { en: "Range", km: "ជួរ", icon: "↔️", detail: "Max − min. Kampot durian prices range from 8,000 to 22,000 riel/kg → range = 14,000 riel." },
    { en: "Variance", km: "វ៉ារ្យង់", icon: "🌊", detail: "The average of squared distances from the mean. A big variance means the values are spread out." },
    { en: "Standard deviation (SD)", km: "គម្លាតគំរូ", icon: "📏", detail: "Square root of variance — in the same units as the data. 'Yield SD = 0.3 t/ha' is easy to interpret." },
    { en: "Percentile", km: "ភាគរយ", icon: "🎚️", detail: "The value below which a % of data falls. The 90th percentile of ABA transfers is the value only 10% exceed." },
    { en: "Quartile (Q1, Q2, Q3)", km: "គ្រាទី", icon: "📐", detail: "The 25th, 50th (median), and 75th percentiles. Split the data into four equal groups." },
    { en: "Interquartile range (IQR)", km: "ជួរ IQR", icon: "📊", detail: "Q3 − Q1 — the middle 50% of the data. A robust measure of spread." },
    { en: "Outlier", km: "តម្លៃខុសក្រុម", icon: "🚨", detail: "A value far from the rest. Rule of thumb: below Q1 − 1.5·IQR or above Q3 + 1.5·IQR." },
    { en: "Skewness", km: "ភាពទ្រេត", icon: "↗️", detail: "How asymmetric the distribution is. Cambodian income is right-skewed: many low, a long tail of high earners." },
    { en: "Frequency table", km: "តារាងបរិមាណ", icon: "📋", detail: "Counts how many rows fall into each category or bin. Foundation of a histogram." },
  ],
  quiz: [
    { q: "The mean of 4, 6, 8 is?", options: ["4", "6", "8", "18"], answer: 1 },
    { q: "The median of 1, 3, 100 is?", options: ["1", "3", "100", "34.67"], answer: 1 },
    { q: "The mode of 2, 2, 3, 5, 5, 5, 7 is?", options: ["2", "3", "5", "7"], answer: 2 },
    { q: "Median is preferred over mean when data has?", options: ["No values", "Extreme outliers", "Only integers", "Only text"], answer: 1 },
    { q: "Range = ?", options: ["Max − Min", "Sum ÷ N", "Median × 2", "SD²"], answer: 0 },
    { q: "Variance measures?", options: ["The average category", "Average squared distance from the mean", "Only integers", "The mode"], answer: 1 },
    { q: "Standard deviation is?", options: ["Half the mean", "Square root of variance", "The mode squared", "The count of rows"], answer: 1 },
    { q: "The 50th percentile equals the?", options: ["Mode", "Mean", "Median", "Range"], answer: 2 },
    { q: "Quartile Q3 is the?", options: ["25th percentile", "50th percentile", "75th percentile", "100th percentile"], answer: 2 },
    { q: "IQR = ?", options: ["Q3 − Q1", "Q3 + Q1", "Q2 only", "Q3 × Q1"], answer: 0 },
    { q: "A value of 999,999 riel/kg among durian prices of 8–15k is a?", options: ["Mean", "Outlier", "Median", "Mode"], answer: 1 },
    { q: "Cambodian household income is typically?", options: ["Right-skewed — a long tail of high earners", "Left-skewed", "Perfectly symmetric", "Constant"], answer: 0 },
    { q: "Which is UNIT-FREE?", options: ["Mean", "Standard deviation", "Skewness (dimensionless)", "Range"], answer: 2 },
    { q: "A histogram is built from a?", options: ["Frequency table of binned values", "Random photo", "A single number", "A tree"], answer: 0 },
    { q: "If SD = 0, the data is?", options: ["Random", "All the same value", "All zero always", "Missing"], answer: 1 },
    { q: "Adding one very large value pushes the MEAN?", options: ["Down", "Up", "Nowhere", "To zero"], answer: 1 },
    { q: "Adding one very large value pushes the MEDIAN?", options: ["Barely — median is robust", "Way up", "To infinity", "To zero"], answer: 0 },
    { q: "For 'moto brand', the useful centre is the?", options: ["Mean", "Median", "Mode", "SD"], answer: 2 },
    { q: "A boxplot uses which numbers?", options: ["Min, Q1, median, Q3, max", "Only mean", "Only mode", "Only sum"], answer: 0 },
    { q: "The BEST first step to summarise data is?", options: ["Just guess", "Look at central tendency AND spread", "Only mean", "Only max"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Data Visualisation
 * ────────────────────────────────────────────────────────────── */

const STAT_VISUALISATION: Lesson = {
  chapterNumber: "3",
  chapterTitle: "Data Visualisation",
  chapterTitleKm: "ការបង្ហាញទិន្នន័យ",
  terms: [
    { en: "Histogram", km: "អ៊ីស្តូក្រាម", icon: "📊", detail: "Bars that show how many values fall into each numeric range (bin). Great for spotting skew and outliers in rice yields." },
    { en: "Bar chart", km: "គំនូសបារ", icon: "📶", detail: "Bars for categories. Shows how many motos each brand (Honda, Yamaha, Suzuki) sold in Phnom Penh." },
    { en: "Line chart", km: "គំនូសបន្ទាត់", icon: "📈", detail: "Shows change over time. Perfect for monthly tourist arrivals to Angkor across 2018–2025." },
    { en: "Scatter plot", km: "គំនូសពង្រាយ", icon: "🔵", detail: "One dot per row using two variables — rainfall vs yield. Shows relationships you can eyeball." },
    { en: "Boxplot", km: "គំនូសប្រអប់", icon: "📦", detail: "Compact five-number summary (min, Q1, median, Q3, max) with dots for outliers." },
    { en: "Pie chart", km: "គំនូសពៃ", icon: "🥧", detail: "Slices of a total. Use sparingly — bars are usually easier to compare across categories." },
    { en: "Density plot", km: "គំនូសដង់ស៊ីតេ", icon: "🌊", detail: "A smooth version of a histogram — the curve of the distribution. Perfect for comparing two groups." },
    { en: "Heatmap", km: "ផែនទីកម្តៅ", icon: "🗺️", detail: "A colour grid — one square per cell of a table. Great for province × month rainfall." },
    { en: "Axis label", km: "ស្លាកអ័ក្ស", icon: "🏷️", detail: "Every axis must be labelled with units. 'Rainfall (mm)' — never leave it blank." },
    { en: "Legend", km: "នុយស៊ីនុយ", icon: "🔤", detail: "The little box that explains what each colour or shape means." },
    { en: "Chart junk", km: "អ្វីៗលើសនៅលើគំនូស", icon: "🗑️", detail: "3D, gradients, glitter — decoration that hides the data. Cut it. Show the numbers." },
    { en: "matplotlib / seaborn", km: "matplotlib / seaborn", icon: "🎨", detail: "The two most popular Python plotting libraries. matplotlib gives you power; seaborn gives you beauty by default." },
  ],
  quiz: [
    { q: "A histogram shows?", options: ["Categories", "How values are distributed across numeric bins", "One number only", "A photo"], answer: 1 },
    { q: "Comparing sales of Honda vs Yamaha in Phnom Penh — best chart?", options: ["Bar chart", "Scatter plot", "Boxplot", "Pie only"], answer: 0 },
    { q: "Angkor visitor count month-by-month is best shown as?", options: ["Line chart", "Pie chart", "Heatmap only", "Nothing"], answer: 0 },
    { q: "Relationship between rainfall and rice yield — best chart?", options: ["Scatter plot", "Pie", "Bar", "Single number"], answer: 0 },
    { q: "A boxplot shows?", options: ["Min, Q1, median, Q3, max + outliers", "Only mean", "Only median", "Only max"], answer: 0 },
    { q: "Pie charts should be used?", options: ["Everywhere", "Sparingly — bars usually compare better", "Never on Fridays", "Only for age"], answer: 1 },
    { q: "A density plot is like a smooth?", options: ["Histogram", "Bar chart", "Pie chart", "Scatter"], answer: 0 },
    { q: "Province × month rainfall is best shown as?", options: ["Line", "Heatmap", "Pie", "Bar of one province"], answer: 1 },
    { q: "Every axis MUST have?", options: ["Emoji", "A clear label with units", "A photo", "A price"], answer: 1 },
    { q: "The 'chart junk' rule says?", options: ["Add gradients", "Cut decoration that hides the data", "Use 3D everywhere", "Add glitter"], answer: 1 },
    { q: "matplotlib's basic line-plot function is?", options: ["plt.line()", "plt.plot(x, y)", "plt.bar(x, y)", "plt.pie(x)"], answer: 1 },
    { q: "seaborn's boxplot uses?", options: ["sns.boxplot(x=..., y=...)", "sns.pie(...)", "sns.tree(...)", "sns.map(...)"], answer: 0 },
    { q: "Colouring dots by 'province' on a scatter needs a?", options: ["Legend explaining each colour", "New computer", "A pie", "A row deletion"], answer: 0 },
    { q: "A histogram with too many bins looks?", options: ["Very smooth", "Very jagged and noisy", "Empty", "Blue only"], answer: 1 },
    { q: "A histogram with too few bins looks?", options: ["Perfect always", "Too smoothed — hides details", "Zero", "Red only"], answer: 1 },
    { q: "The correct chart to compare Cambodian rice yield distributions across 5 provinces is?", options: ["Boxplot or density plot", "One pie chart", "One number", "A photo"], answer: 0 },
    { q: "A stacked bar chart is useful for?", options: ["Showing composition within categories", "Showing single numbers", "Showing time series only", "Nothing"], answer: 0 },
    { q: "The BEST chart is the one that?", options: ["Uses the most colours", "Communicates the finding clearly", "Uses 3D", "Is animated"], answer: 1 },
    { q: "For a Cambodian election turnout by province — you'd pick?", options: ["A bar chart or a choropleth map", "A pie only", "A single number", "A tree"], answer: 0 },
    { q: "Before publishing a chart you should?", options: ["Add glitter", "Sanity-check labels, units, and axis ranges", "Delete the legend", "Remove all text"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Probability & Distributions
 * ────────────────────────────────────────────────────────────── */

const STAT_PROBABILITY: Lesson = {
  chapterNumber: "4",
  chapterTitle: "Probability & Distributions",
  chapterTitleKm: "ប្រូបាប៊ីលីតេ និង ការបែងចែក",
  terms: [
    { en: "Probability", km: "ប្រូបាប៊ីលីតេ", icon: "🎲", detail: "A number 0–1 that measures how likely something is. P = 0 impossible, P = 1 certain." },
    { en: "Event", km: "ព្រឹត្តិការណ៍", icon: "🎯", detail: "Something that can happen — 'the ABA transfer is fraud', 'it rains in Kampot tomorrow'." },
    { en: "Independent events", km: "ព្រឹត្តិការណ៍ឯករាជ្យ", icon: "🔗", detail: "The outcome of one does NOT affect the other. Two separate coin flips are independent." },
    { en: "Conditional probability", km: "ប្រូបាប៊ីលីតេលក្ខខណ្ឌ", icon: "🔀", detail: "P(A | B): the probability of A GIVEN that B happened. 'Fraud given transfer > $10,000'." },
    { en: "Bayes' theorem", km: "ទ្រឹស្តីបទ Bayes", icon: "⚖️", detail: "Update the probability of A after seeing evidence B. The backbone of medical tests and spam filters." },
    { en: "Random variable", km: "អថេរចៃដន្យ", icon: "🎰", detail: "A number whose value comes from a random process — tomorrow's tuk-tuk fare, an ABA transfer amount." },
    { en: "Discrete distribution", km: "ការបែងចែកដាច់ខាត", icon: "🔢", detail: "Values come from a countable list — number of ABA fraud alerts today. Binomial, Poisson live here." },
    { en: "Continuous distribution", km: "ការបែងចែកបន្តបន្ទាប់", icon: "📈", detail: "Values are along a number line — rainfall in mm. Normal, exponential live here." },
    { en: "Normal distribution", km: "ការបែងចែកធម្មតា", icon: "🔔", detail: "The bell curve. Symmetric around the mean. Rice-yield across many provinces often approximates one." },
    { en: "Binomial distribution", km: "ការបែងចែក Binomial", icon: "🪙", detail: "Count of successes in N yes/no trials — e.g. how many of 20 ABA transfers are flagged fraud." },
    { en: "Poisson distribution", km: "ការបែងចែក Poisson", icon: "⏱️", detail: "Count of events in a fixed time or space — tuk-tuks passing your street in 10 minutes." },
    { en: "Expected value", km: "តម្លៃរំពឹង", icon: "🎯", detail: "The long-run average — Σ (value × probability). What you'd average if you played the game forever." },
  ],
  quiz: [
    { q: "Probability is a number between?", options: ["0 and 1", "−1 and 1", "0 and 100 only", "Any number"], answer: 0 },
    { q: "P = 0 means?", options: ["Certain", "Impossible", "Half the time", "Only in dreams"], answer: 1 },
    { q: "P = 1 means?", options: ["Certain", "Impossible", "Sometimes", "Only in Khmer"], answer: 0 },
    { q: "Two independent coin flips: P(both heads) = ?", options: ["0.5", "0.25", "0.75", "1.0"], answer: 1 },
    { q: "P(A | B) reads as?", options: ["A only", "A given B", "B given A", "A and B"], answer: 1 },
    { q: "Bayes' theorem is used for?", options: ["Cooking", "Updating beliefs with new evidence", "Painting", "Nothing useful"], answer: 1 },
    { q: "A random variable is?", options: ["A fixed number", "A number from a random process", "A photo", "A menu"], answer: 1 },
    { q: "'How many ABA transfers today > $500' follows a?", options: ["Continuous distribution", "Discrete distribution", "Photo only", "Menu"], answer: 1 },
    { q: "'Amount of rainfall in mm tomorrow' is?", options: ["Discrete", "Continuous", "Only integer", "None"], answer: 1 },
    { q: "The bell curve is the?", options: ["Poisson", "Binomial", "Normal distribution", "Uniform"], answer: 2 },
    { q: "Binomial counts?", options: ["Successes in N trials", "Time between events", "Colour of chart", "Days per month"], answer: 0 },
    { q: "Poisson counts?", options: ["Successes in N trials", "Events per fixed interval (time/space)", "Categories", "Riel"], answer: 1 },
    { q: "Expected value = Σ (value × probability). It represents?", options: ["The long-run average", "The mode", "The mode only", "The IQR"], answer: 0 },
    { q: "In a fair 6-sided die, expected value = ?", options: ["3", "3.5", "4", "6"], answer: 1 },
    { q: "'One in a thousand ABA transfers is fraud' → P(fraud) = ?", options: ["0.1", "0.01", "0.001", "1.0"], answer: 2 },
    { q: "For a symmetric bell curve, mean equals?", options: ["Mode", "Median", "Both mean = median = mode", "Nothing"], answer: 2 },
    { q: "About what % of normal data lies within 1 SD of the mean?", options: ["50%", "68%", "95%", "100%"], answer: 1 },
    { q: "About what % lies within 2 SDs?", options: ["50%", "68%", "95%", "100%"], answer: 2 },
    { q: "Adding two independent random variables gives a mean equal to?", options: ["Sum of the means", "Difference", "Zero", "Only the first"], answer: 0 },
    { q: "The correct claim about probability is?", options: ["It always matches reality perfectly", "It quantifies uncertainty — always with assumptions", "It replaces data", "It is exact truth"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Sampling & Estimation
 * ────────────────────────────────────────────────────────────── */

const STAT_SAMPLING: Lesson = {
  chapterNumber: "5",
  chapterTitle: "Sampling & Estimation",
  chapterTitleKm: "ការគំរូ និង ការប៉ាន់ស្មាន",
  terms: [
    { en: "Simple random sampling", km: "ការគំរូចៃដន្យសាមញ្ញ", icon: "🎲", detail: "Every member of the population has an equal chance of being chosen. The gold standard." },
    { en: "Stratified sampling", km: "ការគំរូស្រទាប់", icon: "📚", detail: "Split the population into groups (e.g. provinces) and sample within each. Better representation for uneven groups." },
    { en: "Cluster sampling", km: "ការគំរូជាចង្កោម", icon: "🏘️", detail: "Pick whole clusters (e.g. villages), then everyone in the chosen villages. Cheap for field surveys." },
    { en: "Convenience sampling", km: "ការគំរូងាយស្រួល", icon: "☕", detail: "Ask whoever is nearby. Fast but biased — e.g. only your classmates. Rarely representative." },
    { en: "Sampling error", km: "កំហុសនៃការគំរូ", icon: "🎯", detail: "The natural difference between a sample statistic and the true parameter. Smaller samples = bigger error." },
    { en: "Point estimate", km: "តម្លៃប៉ាន់មួយ", icon: "📍", detail: "One number for the parameter — 'sample mean rice yield = 3.05 t/ha'." },
    { en: "Confidence interval (CI)", km: "ចន្លោះទំនុកចិត្ត", icon: "🎯", detail: "A range that probably contains the parameter. '95% CI: [2.9, 3.2] t/ha' — most methods land inside 95% of the time." },
    { en: "Confidence level", km: "កម្រិតទំនុកចិត្ត", icon: "🎚️", detail: "How often the method captures the truth — 90%, 95%, 99% are common." },
    { en: "Margin of error", km: "រង្វាស់កំហុស", icon: "±", detail: "Half the width of the CI. '3.05 ± 0.15 t/ha' says the true value is likely within 0.15." },
    { en: "Standard error (SE)", km: "កំហុសស្តង់ដារ", icon: "📏", detail: "The SD of the sampling distribution of a statistic — the 'wobble' of the estimator itself." },
    { en: "Central Limit Theorem (CLT)", km: "ទ្រឹស្តី CLT", icon: "🔔", detail: "As samples grow, the distribution of the sample MEAN becomes approximately normal — no matter the original shape." },
    { en: "Sample size (n)", km: "ទំហំសំណាក", icon: "🔢", detail: "How many rows in your sample. Bigger n → smaller SE → narrower CI. But cost also grows." },
  ],
  quiz: [
    { q: "Simple random sampling means?", options: ["Every member has an equal chance", "Only weekends", "Ask friends only", "Only Phnom Penh"], answer: 0 },
    { q: "Splitting Cambodia into 25 provinces then sampling within each is?", options: ["Convenience", "Stratified sampling", "Only survey", "Only census"], answer: 1 },
    { q: "Pick whole villages, then everyone in them — that's?", options: ["Stratified", "Cluster sampling", "Random", "Census"], answer: 1 },
    { q: "Asking only your classmates about national politics is?", options: ["Stratified", "Convenience — biased", "Random", "Cluster"], answer: 1 },
    { q: "Sampling error decreases when?", options: ["Sample gets larger", "Sample gets smaller", "You ignore data", "You add glitter"], answer: 0 },
    { q: "A single number estimate of a parameter is a?", options: ["Point estimate", "Confidence interval", "P-value", "Sample size"], answer: 0 },
    { q: "A confidence interval provides?", options: ["A range likely to contain the parameter", "Only one number", "A guarantee", "Nothing"], answer: 0 },
    { q: "A 95% CI means?", options: ["The parameter is inside 95% of the time in repeated sampling", "Exactly the parameter", "Impossible to compute", "Random garbage"], answer: 0 },
    { q: "Margin of error is?", options: ["The whole CI", "Half the CI width", "Zero always", "The mean"], answer: 1 },
    { q: "Standard error measures?", options: ["The wobble of an estimator", "The mean", "Only integer counts", "The colour"], answer: 0 },
    { q: "By CLT, the distribution of the sample MEAN is approximately?", options: ["Uniform", "Normal for large n", "Binomial", "Nothing"], answer: 1 },
    { q: "Bigger n gives?", options: ["Bigger SE", "Smaller SE — narrower CI", "No change", "Bias always"], answer: 1 },
    { q: "For a 95% CI on a mean, the margin of error is roughly?", options: ["1.96 × SE", "10 × SE", "0.5 × SE", "0"], answer: 0 },
    { q: "A 99% CI is _____ than a 95% CI?", options: ["Narrower", "Wider (more confidence, more width)", "Same", "Zero"], answer: 1 },
    { q: "Polling only Phnom Penh for national opinions causes?", options: ["No problem", "Bias — sample not representative", "Faster CPU", "Nothing"], answer: 1 },
    { q: "'The population mean is between 2.8 and 3.2 t/ha with 95% confidence' is a?", options: ["Point estimate", "CI statement", "Hypothesis", "Guess"], answer: 1 },
    { q: "The SE of the sample mean equals SD ÷ ?", options: ["n", "√n", "n²", "1"], answer: 1 },
    { q: "To halve SE, you need to?", options: ["Halve n", "Quadruple n (√4 = 2)", "Do nothing", "Change chart"], answer: 1 },
    { q: "A very small sample (n = 5) makes CIs?", options: ["Very narrow", "Very wide — uncertain estimate", "Zero", "Exact"], answer: 1 },
    { q: "The BEST sampling method for a national Cambodian survey is often?", options: ["Ask friends", "A stratified or multi-stage random sample", "Only capital city", "Only weekends"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Hypothesis Testing
 * ────────────────────────────────────────────────────────────── */

const STAT_HYPOTHESIS: Lesson = {
  chapterNumber: "6",
  chapterTitle: "Hypothesis Testing",
  chapterTitleKm: "ការសាកល្បងសម្មតិកម្ម",
  terms: [
    { en: "Null hypothesis (H₀)", km: "សម្មតិកម្មសូន្យ", icon: "0️⃣", detail: "The 'nothing new' claim we try to reject — 'the new rice seed gives the SAME yield as the old one'." },
    { en: "Alternative hypothesis (H₁)", km: "សម្មតិកម្មជំនួស", icon: "1️⃣", detail: "What we suspect is really happening — 'the new seed gives a DIFFERENT yield'." },
    { en: "Test statistic", km: "តម្លៃសាកល្បង", icon: "🧮", detail: "A number computed from the sample that summarises the evidence — t, z, χ², F." },
    { en: "P-value", km: "តម្លៃ p", icon: "🎯", detail: "The probability of seeing evidence at least this extreme IF H₀ is true. Small p → H₀ unlikely." },
    { en: "Significance level (α)", km: "កម្រិតអត្ថន័យ", icon: "🚨", detail: "The cutoff we set BEFORE looking — commonly 0.05. Reject H₀ when p < α." },
    { en: "Type I error", km: "កំហុសប្រភេទ I", icon: "🚫", detail: "Rejecting H₀ when it was actually TRUE — a false alarm. Probability = α." },
    { en: "Type II error", km: "កំហុសប្រភេទ II", icon: "😴", detail: "Failing to reject H₀ when it was actually FALSE — a missed effect. Probability = β." },
    { en: "Power (1 − β)", km: "កម្លាំង", icon: "💪", detail: "The chance the test correctly detects a real effect. Bigger n and bigger effects give more power." },
    { en: "t-test", km: "t-test", icon: "📐", detail: "Compare a sample mean to a value, or two sample means, when SD is estimated from data." },
    { en: "z-test", km: "z-test", icon: "🔔", detail: "Compare means using a KNOWN population SD — rare in practice but foundational." },
    { en: "Chi-square (χ²) test", km: "χ² test", icon: "🎲", detail: "Test associations between two categorical variables — e.g. province × preferred moto brand." },
    { en: "One-tailed vs two-tailed", km: "សាកល្បងម្ខាង / ពីរខាង", icon: "↔️", detail: "One-tailed only tests one direction (yield > old). Two-tailed tests any difference. Choose BEFORE looking." },
  ],
  quiz: [
    { q: "H₀ (null) usually claims?", options: ["A new effect exists", "No effect / no difference", "Only rain", "Only Battambang"], answer: 1 },
    { q: "H₁ (alternative) usually claims?", options: ["No difference", "There IS an effect / difference", "Only nulls", "Only medians"], answer: 1 },
    { q: "P-value is?", options: ["The probability H₀ is true", "P(data ≥ observed | H₀ true)", "Always 0.5", "Random"], answer: 1 },
    { q: "Common α cutoff is?", options: ["0.05", "0.5", "1.0", "10"], answer: 0 },
    { q: "If p < α you should?", options: ["Reject H₀", "Accept H₀", "Delete data", "Do nothing"], answer: 0 },
    { q: "If p ≥ α you should?", options: ["Reject H₀", "Fail to reject H₀ (not the same as 'prove H₀')", "Delete data", "Retire"], answer: 1 },
    { q: "Rejecting a true H₀ is a?", options: ["Type II error", "Type I error", "Both", "Neither"], answer: 1 },
    { q: "Failing to reject a false H₀ is a?", options: ["Type I error", "Type II error", "Zero error", "Type III"], answer: 1 },
    { q: "Power measures?", options: ["Chance of correctly detecting a real effect", "P(H₀ is true)", "Bias", "Nothing"], answer: 0 },
    { q: "To gain power you should?", options: ["Increase n and/or effect size", "Decrease n", "Change nothing", "Add glitter"], answer: 0 },
    { q: "A one-sample t-test compares?", options: ["A sample mean to a specific value", "Two categorical variables", "Two proportions only", "A photo"], answer: 0 },
    { q: "A two-sample t-test compares?", options: ["The means of two groups", "One mean to one number", "Two histograms", "Nothing"], answer: 0 },
    { q: "A chi-square test is for?", options: ["Continuous means", "Categorical associations", "Only bar charts", "Only counting rows"], answer: 1 },
    { q: "One-tailed vs two-tailed decision must be?", options: ["Made AFTER the results", "Made BEFORE looking, from the question", "Ignored", "Random"], answer: 1 },
    { q: "A very small p-value (say 0.001) means?", options: ["H₀ is proven", "Very strong evidence against H₀", "Data is fake", "Nothing"], answer: 1 },
    { q: "Testing a new rice seed vs old at α = 0.05, p = 0.02 → ?", options: ["Reject H₀ — seeds differ significantly", "Fail to reject", "Do nothing", "Delete"], answer: 0 },
    { q: "Statistical significance does NOT imply?", options: ["Practical importance — always ask 'is the effect big enough to matter?'", "Math", "P-values", "Any error"], answer: 0 },
    { q: "Repeating a test many times inflates?", options: ["The Type I error rate — multiple-comparison problem", "Bias only", "Nothing", "The mean"], answer: 0 },
    { q: "Testing 'is average ABA transfer bigger for Fridays vs Mondays' uses?", options: ["Two-sample t-test", "Chi-square", "Nothing", "A photo"], answer: 0 },
    { q: "The BEST practice around p-values is?", options: ["Report p AND effect size AND CI — don't over-rely on p alone", "Only p", "Ignore p", "Randomise"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Correlation & Regression
 * ────────────────────────────────────────────────────────────── */

const STAT_REGRESSION: Lesson = {
  chapterNumber: "7",
  chapterTitle: "Correlation & Regression",
  chapterTitleKm: "សំពាធ និង តំរែតំរង់",
  terms: [
    { en: "Correlation", km: "សំពាធ", icon: "🔗", detail: "How two variables move together. Positive: both go up. Negative: one up, one down. Zero: no linear link." },
    { en: "Pearson's r", km: "តម្លៃ Pearson r", icon: "📐", detail: "A number from −1 to 1 that measures the strength of a LINEAR relationship." },
    { en: "Spearman's ρ", km: "ρ Spearman", icon: "🪜", detail: "Correlation on RANKS — robust to outliers. Great for skewed Cambodian income data." },
    { en: "Covariance", km: "កូវ៉ារ្យង់", icon: "🤝", detail: "Signed measure of joint variation — like a scaled version of correlation, but unit-dependent." },
    { en: "Simple linear regression", km: "តំរែតំរង់លីនេអ៊ែរ", icon: "📏", detail: "Fit y = a + b·x. One input, one output. The classic 'rain → yield' model." },
    { en: "Multiple regression", km: "តំរែតំរង់ច្រើន", icon: "🎛️", detail: "y depends on many features: yield = a + b₁·rain + b₂·fertiliser + b₃·soil pH." },
    { en: "Slope (β)", km: "ចំណោត", icon: "↗️", detail: "How much y changes per 1-unit increase in x, holding others fixed." },
    { en: "Intercept (α)", km: "តម្លៃចាប់ផ្តើម", icon: "⚓", detail: "Where the line meets the y-axis: the predicted y when all x = 0." },
    { en: "Residual", km: "កំហុសសល់", icon: "📉", detail: "Observed y − predicted ŷ. Look at their pattern to check the model." },
    { en: "R²", km: "R²", icon: "🏆", detail: "Fraction of variance in y that the model explains, from 0 to 1. 0.8 means the model captures 80%." },
    { en: "Overfitting", km: "ការស៊ប់ជ្រៅ", icon: "🎯", detail: "Model memorises training quirks and fails on new data. Check with a held-out test set." },
    { en: "Correlation ≠ causation", km: "សំពាធមិនមែនហេតុ", icon: "⚠️", detail: "Two things moving together doesn't prove one CAUSED the other — Angkor visitors and durian sales both rise in dry season." },
  ],
  quiz: [
    { q: "Pearson's r ranges from?", options: ["0 to 1", "−1 to 1", "0 to 100", "−100 to 100"], answer: 1 },
    { q: "r = 0 means?", options: ["Perfect fit", "No linear relationship", "Certain causation", "Missing data"], answer: 1 },
    { q: "r = 1 means?", options: ["No relationship", "Perfect POSITIVE linear relationship", "Perfect negative", "Bias"], answer: 1 },
    { q: "r = −1 means?", options: ["No relationship", "Perfect POSITIVE", "Perfect NEGATIVE linear", "Zero variance"], answer: 2 },
    { q: "Spearman's ρ is robust because it uses?", options: ["Raw values", "Ranks — outliers matter less", "Only integers", "Only categories"], answer: 1 },
    { q: "Simple linear regression models?", options: ["y = a + b·x", "Only integers", "Only categories", "Nothing"], answer: 0 },
    { q: "In y = a + b·x, b is the?", options: ["Intercept", "Slope", "Residual", "R²"], answer: 1 },
    { q: "In y = a + b·x, a is the?", options: ["Intercept — value when x = 0", "Slope", "SE", "R²"], answer: 0 },
    { q: "A residual is?", options: ["y − ŷ (actual minus predicted)", "Only positive", "Only integer", "Nothing"], answer: 0 },
    { q: "R² = 0.85 means?", options: ["The model captures 85% of the variance in y", "85% probability", "The mean is 0.85", "Random"], answer: 0 },
    { q: "R² can be?", options: ["Negative on a test set (worse than mean)", "Always positive", "Only 1", "Only 0"], answer: 0 },
    { q: "Correlation implies causation?", options: ["Always", "Never necessarily — need experiment or careful reasoning", "Only on Fridays", "Only in Khmer"], answer: 1 },
    { q: "Angkor tourism and durian sales both spike in dry season → this is likely?", options: ["Direct causation", "Confounding by season", "Nothing", "Random"], answer: 1 },
    { q: "Multiple regression uses?", options: ["One feature only", "Many features together", "Zero features", "Only text"], answer: 1 },
    { q: "Overfitting means the model?", options: ["Fits training too well and fails on new data", "Fits nothing", "Only fits rain", "Uses no data"], answer: 0 },
    { q: "To detect overfitting you should?", options: ["Use a held-out test set", "Only look at training loss", "Ignore metrics", "Delete data"], answer: 0 },
    { q: "For a Cambodian moto-price model, features could be?", options: ["Year, km, brand, condition", "Only weather", "Only province", "Only name"], answer: 0 },
    { q: "Residual plots help you spot?", options: ["Non-linear patterns and outliers", "Nothing useful", "Only R²", "Only slope"], answer: 0 },
    { q: "A negative slope for 'km driven → resale price' means?", options: ["More km = higher price", "More km = LOWER price", "No relationship", "Random"], answer: 1 },
    { q: "The BEST habit for a good regression is?", options: ["Only run one metric", "Look at scatter, residuals, R², AND real-world sense", "Skip visualisation", "Randomise inputs"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Applied Statistics
 * ────────────────────────────────────────────────────────────── */

const STAT_APPLIED: Lesson = {
  chapterNumber: "8",
  chapterTitle: "Applied Statistics",
  chapterTitleKm: "ស្ថិតិអនុវត្តន៍",
  terms: [
    { en: "ANOVA (Analysis of Variance)", km: "ANOVA", icon: "📊", detail: "Compare the MEANS of 3+ groups at once — e.g. rice yield across Battambang, Kandal, Siem Reap, Kampot." },
    { en: "F-statistic", km: "F", icon: "🅵", detail: "The ratio of between-group variance to within-group variance in ANOVA. Big F → groups likely differ." },
    { en: "Chi-square test of independence", km: "សាកល្បង χ² ឯករាជ្យ", icon: "🎲", detail: "Are two categoricals related? E.g. does province depend on preferred moto brand?" },
    { en: "Goodness-of-fit", km: "ភាពសមស្រប", icon: "🎯", detail: "Compare observed counts to expected counts — do the six sides of a Cambodian market's die really appear equally?" },
    { en: "Non-parametric test", km: "សាកល្បងគ្មានប៉ារ៉ាម៉ែត្រ", icon: "🧵", detail: "Test that doesn't assume normality — Mann-Whitney, Wilcoxon, Kruskal-Wallis. Great for skewed Cambodian income data." },
    { en: "Bootstrapping", km: "ការធ្វើ Bootstrap", icon: "🥾", detail: "Resample your data WITH replacement to build a distribution of a statistic — CI without any formula." },
    { en: "A/B test", km: "សាកល្បង A/B", icon: "🅰️🅱️", detail: "Compare two versions of something (an app screen, a price) using a random split. The core of digital experimentation." },
    { en: "Time series", km: "កាលបរិច្ឆេទ", icon: "⏱️", detail: "Data measured over time — daily ABA transfers, monthly Angkor visitors. Special methods needed (trend, seasonality)." },
    { en: "Seasonality", km: "រដូវ", icon: "🌾", detail: "Repeating patterns tied to a calendar — Khmer New Year, Pchum Ben, dry vs wet season." },
    { en: "Effect size", km: "ទំហំឥទ្ធិពល", icon: "📐", detail: "How BIG the effect is (Cohen's d, r, odds ratio). Always report alongside p-values." },
    { en: "Reproducibility", km: "ភាពដដែល", icon: "🔁", detail: "Sharing data + code so another statistician can rerun and get the same answer. Trust needs it." },
    { en: "Ethics in statistics", km: "ក្រមសីលធម៌ស្ថិតិ", icon: "⚖️", detail: "Report honestly, respect privacy, admit uncertainty, avoid selective analysis, protect vulnerable groups." },
  ],
  quiz: [
    { q: "ANOVA compares?", options: ["Two proportions", "The means of 3+ groups at once", "Only one mean", "Categories only"], answer: 1 },
    { q: "Big F in ANOVA suggests?", options: ["Group means are likely different", "Perfect fit", "Zero effect", "Nothing"], answer: 0 },
    { q: "Chi-square of independence asks?", options: ["Are two categoricals related?", "What's the mean?", "What's R²?", "What is bias?"], answer: 0 },
    { q: "Testing 'do provinces differ in moto brand preference' uses?", options: ["Chi-square", "t-test", "Pearson", "Only mean"], answer: 0 },
    { q: "A non-parametric test doesn't assume?", options: ["Normality", "Randomness", "Rows", "Columns"], answer: 0 },
    { q: "Mann-Whitney is a non-parametric version of?", options: ["Two-sample t-test", "Chi-square", "ANOVA", "R²"], answer: 0 },
    { q: "Bootstrapping means?", options: ["Guessing", "Resampling your data with replacement", "Deleting rows", "Adding random rows"], answer: 1 },
    { q: "A/B test is best when?", options: ["Randomly assigning users to A or B", "Asking friends", "Only sunny days", "Non-random split"], answer: 0 },
    { q: "Time series data needs care for?", options: ["Trend and seasonality", "Nothing", "Colour", "Photos"], answer: 0 },
    { q: "Khmer New Year spikes in ABA transfers illustrate?", options: ["Seasonality", "Noise", "Bias", "R²"], answer: 0 },
    { q: "Effect size answers?", options: ["'How big is the effect?'", "'What is the mean of A?'", "'Is R² zero?'", "Only p"], answer: 0 },
    { q: "Reporting only p without effect size is?", options: ["Best practice", "Incomplete — the effect might be tiny in real life", "Fastest", "The rule"], answer: 1 },
    { q: "Reproducibility means?", options: ["Sharing data + code so others can rerun", "Keeping data secret", "Only PDFs", "Nothing"], answer: 0 },
    { q: "Selective analysis (p-hacking) is?", options: ["A trusted method", "Trying tests until you find p < 0.05 — unethical", "Required", "New computer"], answer: 1 },
    { q: "Statistical ethics includes?", options: ["Honesty, privacy, admitting uncertainty", "Only speed", "Only accuracy", "Ignoring users"], answer: 0 },
    { q: "A Cambodian hospital wait-time study should protect?", options: ["Patient privacy — never identify individuals", "Only budget", "Only the doctor", "Nobody"], answer: 0 },
    { q: "The BEST next step to master statistics is?", options: ["Practise on real Cambodian datasets — provinces, ABA, weather", "Only theory forever", "Skip practice", "Ignore code"], answer: 0 },
    { q: "A model performing well on training but poorly on new data suffers?", options: ["Overfitting", "Bias only", "Nothing", "Correct fit"], answer: 0 },
    { q: "Which pair should always be reported together?", options: ["Estimate + CI (or effect size)", "Only mean", "Only p", "Only max"], answer: 0 },
    { q: "The heart of good statistics is?", options: ["Fancy models", "Clear question, honest data, careful interpretation", "Only formulas", "Only Python"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Master export — merged into LESSONS in lecture-data.ts
 * ────────────────────────────────────────────────────────────── */

export const STATISTICS_LESSONS: Record<string, Lesson> = {
  "stat-welcome": STAT_WELCOME,
  "stat-descriptive": STAT_DESCRIPTIVE,
  "stat-visualisation": STAT_VISUALISATION,
  "stat-probability": STAT_PROBABILITY,
  "stat-sampling": STAT_SAMPLING,
  "stat-hypothesis": STAT_HYPOTHESIS,
  "stat-regression": STAT_REGRESSION,
  "stat-applied": STAT_APPLIED,
};
