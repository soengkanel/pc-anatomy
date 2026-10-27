// Data Structures & Algorithms course content: 8 chapters, each with
// a bilingual (English–Khmer) glossary and a 20-question practice quiz.
// Taught with Rust as the base language. Cambodia-flavoured examples
// (Angkor queues, ABA lookups, moto delivery routes, market searches).
// Data-only — consumed by LessonPack.tsx like the other courses.

import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome & Big-O
 * ────────────────────────────────────────────────────────────── */

const DSA_WELCOME: Lesson = {
  chapterNumber: "1",
  chapterTitle: "Welcome — Complexity & Big-O",
  chapterTitleKm: "សូមស្វាគមន៍ — ភាពស្មុគស្មាញ និង Big-O",
  terms: [
    { en: "Data structure", km: "រចនាសម្ព័ន្ធទិន្នន័យ", icon: "🧱", detail: "A way of organising data in memory so we can use it efficiently. Vec, HashMap, and BTreeMap in Rust are examples." },
    { en: "Algorithm", km: "អាល់ហ្គោរីត", icon: "🧭", detail: "A step-by-step procedure that solves a problem — like the recipe your mother uses to make amok every time." },
    { en: "Big-O notation", km: "សញ្ញា Big-O", icon: "📈", detail: "A way to describe how a program's cost grows with input size. O(n) doubles when input doubles. O(1) never changes." },
    { en: "Time complexity", km: "ភាពស្មុគស្មាញនៃពេលវេលា", icon: "⏱️", detail: "How the RUNNING TIME scales as data grows. Doubling ABA users — does the lookup take twice as long, or a million times longer?" },
    { en: "Space complexity", km: "ភាពស្មុគស្មាញនៃទំហំ", icon: "💾", detail: "How much MEMORY the algorithm needs as data grows. Big data on tiny devices demands O(1) or O(log n) space." },
    { en: "O(1) — constant", km: "O(1) — ថេរ", icon: "🎯", detail: "Same cost, no matter the size. Looking up your account balance by ID in a HashMap: one step." },
    { en: "O(log n) — logarithmic", km: "O(log n) — ឡូការីត", icon: "🔍", detail: "Cost grows very slowly. Binary search on a sorted list of 1M provinces: ~20 steps." },
    { en: "O(n) — linear", km: "O(n) — លីនេអ៊ែរ", icon: "➡️", detail: "Cost doubles when input doubles. Scanning every row of a rice-yield CSV. Common and usually fine." },
    { en: "O(n log n) — linearithmic", km: "O(n log n)", icon: "📊", detail: "The floor for comparison-based sorting. What merge sort and Rust's built-in sort achieve." },
    { en: "O(n²) — quadratic", km: "O(n²) — ការ៉េ", icon: "🐢", detail: "Nested loops over the same data. Fine for 100 items, ruinous for 100,000." },
    { en: "Rust", km: "Rust", icon: "🦀", detail: "A modern systems language with memory safety without garbage collection. Perfect for teaching DSA: fast, honest about ownership, catches bugs at compile time." },
    { en: "Vec<T>", km: "Vec<T>", icon: "📦", detail: "Rust's growable array — the everyday container. Index in O(1), push at the end in amortised O(1)." },
  ],
  quiz: [
    { q: "A data structure is?", options: ["A song", "A way of organising data in memory", "A CPU model", "A password"], answer: 1 },
    { q: "An algorithm is?", options: ["A recipe / step-by-step procedure", "A photo", "A password", "A brand"], answer: 0 },
    { q: "Big-O measures?", options: ["Colour of the code", "How cost grows with input size", "Only speed", "Only bugs"], answer: 1 },
    { q: "O(1) is called?", options: ["Linear", "Constant", "Quadratic", "Exponential"], answer: 1 },
    { q: "O(n) means when input doubles, cost?", options: ["Doubles", "Stays the same", "Quadruples", "Halves"], answer: 0 },
    { q: "O(n²) with n = 1,000 does roughly?", options: ["1,000 ops", "1 million ops", "1,000,000,000 ops", "10 ops"], answer: 1 },
    { q: "Binary search is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "Scanning every ABA account once is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2 },
    { q: "The best sort by comparisons is?", options: ["O(n²)", "O(n log n)", "O(1)", "O(2ⁿ)"], answer: 1 },
    { q: "Rust's advantage for DSA is?", options: ["No memory safety", "Memory safety without GC + fast", "Only interpretation", "Automatic bugs"], answer: 1 },
    { q: "Rust's growable array type is?", options: ["Vec<T>", "Array<T>", "List<T>", "Slice<T>"], answer: 0 },
    { q: "Space complexity measures?", options: ["CPU speed", "Memory usage as input grows", "Colour", "Bugs"], answer: 1 },
    { q: "O(1) space example: swap two variables?", options: ["Yes — constant space", "No — n space", "No — log space", "No — quadratic"], answer: 0 },
    { q: "Which is fastest for large n?", options: ["O(n²)", "O(n log n)", "O(log n)", "O(n)"], answer: 2 },
    { q: "Big-O ignores?", options: ["Constants and small terms", "The whole function", "The n term", "Everything"], answer: 0 },
    { q: "O(n) + O(n) = ?", options: ["O(n²)", "O(n)", "O(2)", "O(log n)"], answer: 1 },
    { q: "For a Cambodian phone-book with 20 million entries, best lookup is?", options: ["Linear scan O(n)", "HashMap O(1) or binary search O(log n)", "Nothing works", "Only paper"], answer: 1 },
    { q: "Constant factors matter?", options: ["Never in practice", "Yes — an O(n) with a huge constant can beat O(log n) for small n", "Only in Java", "Only for typos"], answer: 1 },
    { q: "'Amortised O(1)' means?", options: ["Always O(1)", "Average cost per operation is O(1) even if some are slow", "Never O(1)", "Impossible"], answer: 1 },
    { q: "First habit when reading a new algorithm is?", options: ["Guess the answer", "Ask: what's the Big-O of time AND space?", "Skip it", "Only run it"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — Arrays & Vectors
 * ────────────────────────────────────────────────────────────── */

const DSA_ARRAYS: Lesson = {
  chapterNumber: "2",
  chapterTitle: "Arrays & Vectors",
  chapterTitleKm: "អារ៉េ និង វេក្ទ័រ",
  terms: [
    { en: "Array", km: "អារ៉េ", icon: "📏", detail: "A fixed-length, contiguous block of same-typed elements. Rust: [i32; 5]. Fast indexing, size known at compile time." },
    { en: "Vector (Vec<T>)", km: "វេក្ទ័រ", icon: "📦", detail: "A growable, heap-allocated array. Rust's default 'list'. Push, pop, index — all fast in most cases." },
    { en: "Slice (&[T])", km: "ស្លាយ", icon: "🍰", detail: "A view into part of an array or vector. Cheap to pass around — no copy. E.g. &prices[0..5]." },
    { en: "Index", km: "លិបិក្រម", icon: "🔢", detail: "The position of an item, starting at 0. arr[0] is the first, arr[len - 1] is the last." },
    { en: "Contiguous memory", km: "អង្គចងាំបន្តគ្នា", icon: "🧱", detail: "Elements sit next to each other in RAM. Great for the CPU cache — the reason arrays are so fast." },
    { en: "Capacity vs length", km: "សមត្ថភាព ទល់នឹង ប្រវែង", icon: "📊", detail: "A Vec has length (items you added) and capacity (how many it can hold before reallocating)." },
    { en: "Push / pop", km: "Push / Pop", icon: "🎯", detail: "Add to or remove from the END of a Vec. Both are O(1) amortised — the cheap end." },
    { en: "Insert / remove at index", km: "បញ្ចូល / លុប នៅលិបិក្រម", icon: "✂️", detail: "Insert or remove ANYWHERE else — O(n) because everything after must shift." },
    { en: "Iteration", km: "ការឆ្លងកាត់", icon: "🔁", detail: "Walking every element in order: for x in &vec { … } — O(n). The workhorse loop." },
    { en: "Bounds check", km: "ការត្រួតពិនិត្យព្រំដែន", icon: "🛡️", detail: "Rust checks arr[i] at runtime and panics if i is out of range — safer than C's silent read of garbage." },
    { en: "Two-pointer technique", km: "បច្ចេកទេសពីរចង្អុរ", icon: "👉👈", detail: "Two indices moving through the array — front/back, fast/slow. Solves reverse, dedup, palindrome, sum-pairs." },
    { en: "Vec::with_capacity", km: "Vec::with_capacity", icon: "🏗️", detail: "Pre-allocate a Vec to avoid resizing. If you know you'll add 25 provinces, start with capacity 25." },
  ],
  quiz: [
    { q: "A Rust array [i32; 5] has?", options: ["Fixed length 5 at compile time", "Any length", "Zero items always", "String type"], answer: 0 },
    { q: "The default 'list' type in Rust is?", options: ["Array", "Vec<T>", "String", "&str"], answer: 1 },
    { q: "Indices in Rust arrays start at?", options: ["0", "1", "−1", "42"], answer: 0 },
    { q: "arr[0] returns the?", options: ["Length", "First element", "Last element", "Sum"], answer: 1 },
    { q: "Accessing arr[i] is?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 0 },
    { q: "Pushing at the end of a Vec is?", options: ["O(1) amortised", "O(n²)", "Impossible", "O(log n)"], answer: 0 },
    { q: "Inserting in the middle of a Vec is?", options: ["O(1)", "O(n) — items shift", "O(log n)", "Free"], answer: 1 },
    { q: "A slice &[T] represents?", options: ["A copy of the array", "A view into part of the array", "Only one element", "Nothing"], answer: 1 },
    { q: "If arr has 10 items, arr[15] causes?", options: ["Silent garbage", "A Rust panic — bounds check", "Zero", "Undefined behaviour"], answer: 1 },
    { q: "Vec::with_capacity(1000) does what?", options: ["Creates 1000 items", "Pre-allocates space for 1000 items (length still 0)", "Nothing", "Deletes the vec"], answer: 1 },
    { q: "'Contiguous memory' helps because?", options: ["It confuses the CPU", "It's cache-friendly and fast to scan", "It's slower", "It uses more RAM"], answer: 1 },
    { q: "Reversing a Vec in place uses which technique?", options: ["Recursion always", "Two pointers (start, end)", "A hash map", "A tree"], answer: 1 },
    { q: "for x in &vec { … } iterates?", options: ["Once per item — O(n)", "In O(1)", "Randomly", "Only the first"], answer: 0 },
    { q: "Iterating a Vec of 1M items visits how many?", options: ["1", "log₂(1M) ≈ 20", "1,000,000", "1,000,000,000,000"], answer: 2 },
    { q: "Between Vec and array, which grows?", options: ["Array", "Vec", "Both", "Neither"], answer: 1 },
    { q: "The last element of Vec 'v' can be popped with?", options: ["v.pop()", "v.push()", "v.reverse()", "v.clone()"], answer: 0 },
    { q: "Iterating with .iter().enumerate() gives?", options: ["(index, &item)", "Only item", "Only index", "Nothing"], answer: 0 },
    { q: "Finding a value in an unsorted Vec of 1M is best done in?", options: ["O(1)", "O(log n)", "O(n) — linear scan", "O(n²)"], answer: 2 },
    { q: "Finding a value in a SORTED Vec is best done in?", options: ["O(1)", "O(log n) — binary search", "O(n²)", "Impossible"], answer: 1 },
    { q: "The BEST first data structure to reach for is often?", options: ["A tree", "A graph", "Vec<T>", "Hash map"], answer: 2 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Linked Lists
 * ────────────────────────────────────────────────────────────── */

const DSA_LINKED: Lesson = {
  chapterNumber: "3",
  chapterTitle: "Linked Lists",
  chapterTitleKm: "បញ្ជីភ្ជាប់",
  terms: [
    { en: "Linked list", km: "បញ្ជីភ្ជាប់", icon: "🔗", detail: "A chain of nodes where each node holds a value and a pointer to the next node. Great for O(1) inserts at either end." },
    { en: "Node", km: "ថ្នាំង", icon: "🧿", detail: "One link in the chain: a value + a next pointer. In Rust: struct Node { value: T, next: Option<Box<Node<T>>> }." },
    { en: "Head", km: "ក្បាល", icon: "🎯", detail: "The first node — the entry point. Losing the head loses the whole list." },
    { en: "Tail", km: "កន្ទុយ", icon: "🐍", detail: "The last node. Its 'next' is None. Fast to add here if we keep a tail pointer." },
    { en: "Singly linked list", km: "បញ្ជីភ្ជាប់មួយផ្លូវ", icon: "➡️", detail: "Each node points to the next only. Simple, memory-light — but no O(1) go-back." },
    { en: "Doubly linked list", km: "បញ្ជីភ្ជាប់ពីរផ្លូវ", icon: "↔️", detail: "Each node also points to the previous. Enables O(1) removal given the node. Rust std lib: LinkedList<T>." },
    { en: "Box<T>", km: "Box<T>", icon: "📦", detail: "A heap-allocated owned pointer in Rust. Used for recursive types like linked-list nodes." },
    { en: "Option<T>", km: "Option<T>", icon: "🫙", detail: "Rust's 'maybe a value' enum: Some(x) or None. Perfect for a 'next' pointer that may or may not exist." },
    { en: "Traversal", km: "ការឆ្លងកាត់", icon: "🚶", detail: "Walking from head to tail one node at a time — O(n). No random access like arrays." },
    { en: "Ownership in a list", km: "ការកាន់កាប់ក្នុងបញ្ជី", icon: "🔐", detail: "Rust forces you to think: who owns each node? Box<Node> means the parent owns the child. Great teaching moment." },
    { en: "Insert / delete at head", km: "បញ្ចូល/លុប នៅក្បាល", icon: "🎩", detail: "The star trick of linked lists: O(1) at the head. Repoint head and you're done." },
    { en: "When to use", km: "ពេលណាត្រូវប្រើ", icon: "🤔", detail: "Rare in modern Rust. Vec beats it for most needs (cache-friendly). Use for undo stacks, deques, or when you learn ownership." },
  ],
  quiz: [
    { q: "A linked list is?", options: ["Contiguous block of memory", "Chain of nodes with 'next' pointers", "Only for numbers", "A tree"], answer: 1 },
    { q: "In Rust, a node's 'next' is typically?", options: ["Option<Box<Node<T>>>", "String", "u32", "None only"], answer: 0 },
    { q: "Why Option? Because the last 'next' is?", options: ["None", "Some(0)", "Panic", "Empty string"], answer: 0 },
    { q: "Why Box<Node>?", options: ["Speed only", "It's a recursive type — Rust needs heap indirection", "For fun", "Because Vec"], answer: 1 },
    { q: "Inserting at the HEAD is?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], answer: 0 },
    { q: "Accessing the k-th node is?", options: ["O(1)", "O(log n)", "O(k)", "O(n²)"], answer: 2 },
    { q: "A singly linked list can go?", options: ["Only forward", "Both directions", "Only random", "Backward only"], answer: 0 },
    { q: "A doubly linked list has?", options: ["Only 'next'", "Both 'next' and 'prev'", "No pointers", "Only head"], answer: 1 },
    { q: "Traversing 1M nodes takes about?", options: ["1 step", "1M steps", "log₂(1M) steps", "1M² steps"], answer: 1 },
    { q: "Linked lists are cache-friendly?", options: ["Very — much better than Vec", "No — nodes scatter in memory", "Only in Rust", "Only on Mondays"], answer: 1 },
    { q: "Best real-world use of a doubly linked list is?", options: ["A LRU cache queue", "Storing images", "Sorting", "Compilation"], answer: 0 },
    { q: "The head of an empty linked list is?", options: ["Some(box)", "None", "Panic", "42"], answer: 1 },
    { q: "Prepending 'Phnom Penh' to a list of provinces is?", options: ["O(1) — swap head", "O(n)", "Impossible", "O(n²)"], answer: 0 },
    { q: "Appending 'Kandal' to a singly linked list of 1M with no tail pointer is?", options: ["O(1)", "O(n) — walk to end", "O(log n)", "Free"], answer: 1 },
    { q: "Reversing a singly linked list is?", options: ["O(1)", "O(n) with 3 pointers", "O(n²)", "Impossible"], answer: 1 },
    { q: "Detecting a cycle uses?", options: ["Floyd's tortoise & hare (two pointers)", "Only recursion", "A hash", "Nothing works"], answer: 0 },
    { q: "Rust std's LinkedList<T> is?", options: ["Singly linked", "Doubly linked", "A tree", "A hash"], answer: 1 },
    { q: "In most Rust code today, prefer?", options: ["Linked list", "Vec — cache-friendly, simpler", "Only tree", "String"], answer: 1 },
    { q: "The main gain of linked lists is?", options: ["O(1) insert/delete at both ends (with pointers)", "Random access", "Compression", "Nothing"], answer: 0 },
    { q: "Rust teaches ownership beautifully with linked lists because?", options: ["Each node owns the next via Box", "Rust cheats", "It doesn't", "Only C teaches ownership"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Stacks & Queues
 * ────────────────────────────────────────────────────────────── */

const DSA_STACKS: Lesson = {
  chapterNumber: "4",
  chapterTitle: "Stacks & Queues",
  chapterTitleKm: "ជង់ និង ជួរ",
  terms: [
    { en: "Stack", km: "ជង់", icon: "📚", detail: "LIFO — Last In, First Out. Like plates: the last plate you put on is the first one you take off." },
    { en: "Queue", km: "ជួរ", icon: "🚶‍♂️🚶‍♀️", detail: "FIFO — First In, First Out. Like the Angkor ticket counter: first person in line gets served first." },
    { en: "Push (stack)", km: "ដាក់ចូល (ជង់)", icon: "⬆️", detail: "Add to the top of the stack. Rust: vec.push(x). O(1)." },
    { en: "Pop (stack)", km: "យកចេញ (ជង់)", icon: "⬇️", detail: "Remove the top of the stack. Rust: vec.pop() → Option<T>. O(1)." },
    { en: "Enqueue", km: "បញ្ចូលក្នុងជួរ", icon: "➡️", detail: "Add to the BACK of a queue. Rust: deque.push_back(x). O(1)." },
    { en: "Dequeue", km: "យកចេញពីជួរ", icon: "⬅️", detail: "Remove from the FRONT of a queue. Rust: deque.pop_front() → Option<T>. O(1)." },
    { en: "VecDeque<T>", km: "VecDeque<T>", icon: "🎢", detail: "Rust's double-ended queue. O(1) push/pop at BOTH ends. The right tool for queues, not Vec." },
    { en: "Call stack", km: "ជង់ហៅ", icon: "☎️", detail: "The stack the CPU uses to track function calls. Recursion deep enough → stack overflow." },
    { en: "Undo / redo", km: "Undo / Redo", icon: "↩️↪️", detail: "Classic stack use: your edits are pushed on undo; when you undo, they pop to a redo stack." },
    { en: "Balanced parentheses", km: "វង់ក្រចកសមតុល្យ", icon: "⚖️", detail: "A stack elegantly checks that ( [ { are matched — the exact algorithm compilers use." },
    { en: "Priority queue", km: "ជួរអាទិភាព", icon: "🎯", detail: "A queue where the highest-priority item comes out first. Rust: BinaryHeap<T> (max-heap by default)." },
    { en: "BinaryHeap<T>", km: "BinaryHeap<T>", icon: "🏔️", detail: "Rust std's heap-based priority queue. Push in O(log n), peek in O(1), pop in O(log n)." },
  ],
  quiz: [
    { q: "A stack is?", options: ["FIFO", "LIFO", "Random", "Sorted"], answer: 1 },
    { q: "A queue is?", options: ["FIFO", "LIFO", "Random", "Reversed"], answer: 0 },
    { q: "Pushing to a stack means?", options: ["Add to the top", "Remove from top", "Add to the bottom", "Nothing"], answer: 0 },
    { q: "Popping from a stack means?", options: ["Add to the top", "Remove from top", "Remove from bottom", "Duplicate"], answer: 1 },
    { q: "Angkor ticket counter is best modelled as?", options: ["Queue (FIFO)", "Stack (LIFO)", "Tree", "Hash"], answer: 0 },
    { q: "Undo history is best modelled as?", options: ["Stack (LIFO)", "Queue", "Graph", "Tree"], answer: 0 },
    { q: "In Rust, a stack is easily?", options: ["Vec — push/pop at the end", "HashMap", "String only", "Nothing"], answer: 0 },
    { q: "In Rust, a queue is best?", options: ["Vec — push_back/pop_front (bad!)", "VecDeque — O(1) both ends", "HashMap", "String"], answer: 1 },
    { q: "vec.pop() returns?", options: ["T", "Option<T>", "Nothing", "u32"], answer: 1 },
    { q: "Checking balanced ( [ { uses?", options: ["A stack", "A queue", "A tree", "A hash"], answer: 0 },
    { q: "Function calls use?", options: ["A queue", "The call stack", "A hash map", "A tree"], answer: 1 },
    { q: "A too-deep recursion causes?", options: ["Bug-free code", "Stack overflow", "Faster code", "Nothing"], answer: 1 },
    { q: "A priority queue lets you take out?", options: ["Random", "The 'best' (highest priority) first", "Only oldest", "Only newest"], answer: 1 },
    { q: "Rust's built-in priority queue is?", options: ["BinaryHeap<T>", "Vec<T>", "String", "HashMap<T>"], answer: 0 },
    { q: "BFS on a graph uses?", options: ["A stack", "A queue", "A hash", "Nothing"], answer: 1 },
    { q: "DFS on a graph uses?", options: ["A queue", "A stack (or recursion)", "Only hash", "Nothing"], answer: 1 },
    { q: "VecDeque supports what?", options: ["Only push_back", "push_back, push_front, pop_back, pop_front — all O(1)", "Only pop_back", "Only front"], answer: 1 },
    { q: "Reversing a string can use?", options: ["A stack", "Only a queue", "Only a tree", "Nothing"], answer: 0 },
    { q: "Print jobs on an office printer are?", options: ["A queue (usually FIFO)", "A stack", "A graph", "A tree"], answer: 0 },
    { q: "The right choice between stack and queue depends on?", options: ["What order you need items back", "Colour of screen", "Time of day", "Random pick"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Hash Maps & Sets
 * ────────────────────────────────────────────────────────────── */

const DSA_HASHMAPS: Lesson = {
  chapterNumber: "5",
  chapterTitle: "Hash Maps & Sets",
  chapterTitleKm: "Hash Maps & Sets",
  terms: [
    { en: "Hash map", km: "Hash map", icon: "🗺️", detail: "A key → value store with O(1) average lookup. Rust: HashMap<K, V>. The Swiss-army knife of DSA." },
    { en: "Hash function", km: "អនុគមន៍ hash", icon: "🧪", detail: "Turns a key (like 'Phnom Penh') into a bucket index. A good hash spreads keys evenly." },
    { en: "Bucket", km: "ធុង", icon: "🪣", detail: "A slot in the underlying array. All keys landing in the same bucket form a chain (or probe further)." },
    { en: "Collision", km: "ការប៉ះ", icon: "💥", detail: "Two different keys mapping to the same bucket. Resolved by chaining or open addressing." },
    { en: "Load factor", km: "ការផ្ទុក", icon: "📊", detail: "Items ÷ buckets. Rust's HashMap resizes when this passes about 0.875 to keep operations fast." },
    { en: "HashSet<T>", km: "HashSet<T>", icon: "🧺", detail: "A set of unique values. Insert / contains / remove in O(1) average. Great for de-duplication." },
    { en: "BTreeMap<K, V>", km: "BTreeMap<K, V>", icon: "🌳", detail: "A sorted key-value map. O(log n) but preserves order — useful when you need to iterate keys in order." },
    { en: "Entry API", km: "Entry API", icon: "🔑", detail: "Rust's ergonomic pattern: map.entry(key).or_insert(0). One lookup handles insert-or-update." },
    { en: "Ownership of keys", km: "ការកាន់កាប់សោ", icon: "🔐", detail: "HashMap<String, i32> owns the String keys. HashMap<&str, i32> borrows — beware lifetimes." },
    { en: "Hash + Eq", km: "Hash + Eq", icon: "⚖️", detail: "For a key type to work in HashMap, it must implement Hash and Eq — Rust checks at compile time." },
    { en: "Amortised O(1)", km: "អាមូទីស O(1)", icon: "🎯", detail: "Insert is 'usually' O(1). Occasionally a resize costs O(n), spread across many inserts." },
    { en: "When NOT to use", km: "កុំប្រើពេលណា", icon: "🚫", detail: "When you need sorted iteration, memory is tight, or n is tiny — a Vec pair search may win." },
  ],
  quiz: [
    { q: "A hash map stores?", options: ["Only integers", "Key-value pairs", "Only strings", "Only booleans"], answer: 1 },
    { q: "Average lookup in a HashMap is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0 },
    { q: "A hash function turns a key into?", options: ["A colour", "A bucket index", "A string", "Random noise"], answer: 1 },
    { q: "A collision is?", options: ["Two keys mapping to the same bucket", "A car accident", "Impossible", "Only in Java"], answer: 0 },
    { q: "Rust's HashMap resolves collisions by?", options: ["Ignoring them", "Chaining / probing", "Panic", "Deleting keys"], answer: 1 },
    { q: "For a key type to be used in HashMap, it needs?", options: ["Hash + Eq", "Only String", "Only integers", "Nothing"], answer: 0 },
    { q: "map.entry(k).or_insert(0) is what pattern?", options: ["Only for insert", "Insert-or-update in one lookup", "Only for remove", "For sorting"], answer: 1 },
    { q: "HashSet<T> stores?", options: ["Sorted values", "Unique values (no duplicates)", "Only integers", "Nothing"], answer: 1 },
    { q: "BTreeMap iterates keys in?", options: ["Insertion order", "Sorted order", "Random", "Reversed only"], answer: 1 },
    { q: "BTreeMap lookup is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "Counting how many times each province appears in a list uses?", options: ["HashMap<String, u32>", "String", "Vec of pairs", "Nothing"], answer: 0 },
    { q: "De-duplicating a Vec of ABA IDs is fastest with?", options: ["Two nested loops O(n²)", "A HashSet — O(n)", "A tree only", "Nothing"], answer: 1 },
    { q: "Load factor is items ÷ ?", options: ["Buckets", "Length", "Zero", "n log n"], answer: 0 },
    { q: "HashMap resizes when the load factor gets?", options: ["Very low", "High enough (~0.875 in std)", "Never", "Always"], answer: 1 },
    { q: "Amortised O(1) means?", options: ["Always O(1)", "Average O(1) even if some inserts trigger resize", "Never O(1)", "Impossible"], answer: 1 },
    { q: "Best structure to check 'has anyone this ID scanned in?' is?", options: ["Vec", "HashSet", "Sorted array", "Linked list"], answer: 1 },
    { q: "Iterating a HashMap in Rust yields?", options: ["Sorted order", "Random order (per run)", "Same order always", "Errors"], answer: 1 },
    { q: "If you need sorted keys, use?", options: ["HashMap", "BTreeMap", "String", "Only Vec"], answer: 1 },
    { q: "Worst-case HashMap lookup can be?", options: ["O(1) always", "O(n) — many collisions", "O(log n) always", "Impossible to bound"], answer: 1 },
    { q: "The BEST default for 'lookup by name' is often?", options: ["Vec pair search", "HashMap", "Linked list", "Tree"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Trees & BSTs
 * ────────────────────────────────────────────────────────────── */

const DSA_TREES: Lesson = {
  chapterNumber: "6",
  chapterTitle: "Trees & Binary Search Trees",
  chapterTitleKm: "មែកធាង និង BST",
  terms: [
    { en: "Tree", km: "មែកធាង", icon: "🌳", detail: "A hierarchy of nodes with one root and no cycles. Every node has one parent (except root) and zero or more children." },
    { en: "Root", km: "ឫស", icon: "🌱", detail: "The topmost node. Every tree traversal starts here." },
    { en: "Leaf", km: "ស្លឹក", icon: "🍃", detail: "A node with no children. The 'endpoints' of the tree." },
    { en: "Depth / height", km: "ជម្រៅ / កម្ពស់", icon: "📏", detail: "Depth of a node = distance from the root. Height of a tree = max depth. Balanced trees have log n height." },
    { en: "Binary tree", km: "មែកធាងគូ", icon: "🌲", detail: "Each node has at most TWO children — left and right. The base of BSTs, heaps, and expression trees." },
    { en: "Binary Search Tree (BST)", km: "BST", icon: "🔎", detail: "A binary tree where left < node < right, recursively. Search / insert / delete average O(log n). Worst O(n) if unbalanced." },
    { en: "Balanced tree", km: "មែកធាងសមតុល្យ", icon: "⚖️", detail: "Height is O(log n). AVL, Red-Black, and B-trees stay balanced automatically. Rust's BTreeMap uses a B-tree." },
    { en: "Pre-order traversal", km: "Pre-order", icon: "1️⃣2️⃣3️⃣", detail: "Visit: node → left → right. Good for cloning a tree or serialising it." },
    { en: "In-order traversal", km: "In-order", icon: "🔢", detail: "Visit: left → node → right. On a BST it yields values in SORTED order — a classic exam question." },
    { en: "Post-order traversal", km: "Post-order", icon: "🎯", detail: "Visit: left → right → node. Good for deleting a tree or computing sub-answers first." },
    { en: "Heap (min/max)", km: "Heap", icon: "🏔️", detail: "A binary tree stored in a Vec. Root is the smallest (min-heap) or largest (max-heap). Used for priority queues." },
    { en: "Trie", km: "Trie", icon: "🔠", detail: "A tree where each edge is a character. Fast prefix search — 'auto-complete for Khmer province names'." },
  ],
  quiz: [
    { q: "A tree has exactly?", options: ["One root", "Many roots", "No root", "A ring"], answer: 0 },
    { q: "A leaf is?", options: ["The root", "A node with no children", "A cycle", "A key"], answer: 1 },
    { q: "A binary tree has at most?", options: ["1 child per node", "2 children per node", "3 children", "Infinite"], answer: 1 },
    { q: "In a BST, for each node?", options: ["Left < node < Right", "All greater on the left", "All equal", "Randomly placed"], answer: 0 },
    { q: "Average BST search is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "Worst-case BST search (unbalanced) is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2 },
    { q: "A balanced BST has height?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "In-order traversal of a BST yields?", options: ["Random", "Sorted values", "Reversed only", "Only leaves"], answer: 1 },
    { q: "Pre-order visits?", options: ["Node → left → right", "Left → node → right", "Left → right → node", "Right only"], answer: 0 },
    { q: "Post-order visits?", options: ["Left → right → node", "Node → right → left", "Only node", "Only left"], answer: 0 },
    { q: "A heap is used for?", options: ["Random access", "Priority queues", "Sorted iteration only", "Only strings"], answer: 1 },
    { q: "In a min-heap, the root is?", options: ["The largest", "The smallest", "Random", "None"], answer: 1 },
    { q: "Insert into a heap is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "Rust std uses which tree in BTreeMap?", options: ["Red-Black", "B-tree", "Splay", "Trie"], answer: 1 },
    { q: "Auto-complete for Khmer names is best with?", options: ["Vec", "Trie", "Only hash", "Graph"], answer: 1 },
    { q: "Trees model?", options: ["File systems, org charts, DOM, family trees", "Only numbers", "Only cycles", "Only linear data"], answer: 0 },
    { q: "A binary tree with n nodes has height at least?", options: ["log₂(n+1) − 1", "n", "n²", "1"], answer: 0 },
    { q: "Deleting a node with two children in a BST requires?", options: ["Just remove", "Replace with in-order successor (or predecessor)", "Impossible", "Only remove root"], answer: 1 },
    { q: "In Rust, a tree node often uses?", options: ["Option<Box<Node>>", "Only integers", "String only", "Nothing"], answer: 0 },
    { q: "The BEST reason to pick a BST over a HashMap is?", options: ["Faster in general", "You need SORTED iteration or ordered range queries", "You hate hashing", "Random"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Graphs
 * ────────────────────────────────────────────────────────────── */

const DSA_GRAPHS: Lesson = {
  chapterNumber: "7",
  chapterTitle: "Graphs — BFS & DFS",
  chapterTitleKm: "ក្រាហ្វ — BFS & DFS",
  terms: [
    { en: "Graph", km: "ក្រាហ្វ", icon: "🕸️", detail: "A set of nodes (vertices) connected by edges. Roads between Cambodian towns, friends on a social app — all graphs." },
    { en: "Vertex / Node", km: "កំពូល / ថ្នាំង", icon: "🔵", detail: "A point in the graph. Provinces, ABA accounts, web pages — the 'things'." },
    { en: "Edge", km: "គែម", icon: "🔗", detail: "A connection between two vertices. Roads, transfers, hyperlinks." },
    { en: "Directed vs undirected", km: "មានទិស ទល់នឹង គ្មានទិស", icon: "↔️", detail: "Directed: edges have a direction (A → B). Undirected: both ways. Rivers vs friendships." },
    { en: "Weighted edge", km: "គែមមានទំងន់", icon: "⚖️", detail: "Each edge has a cost — distance, fare, time. Needed for shortest-path algorithms." },
    { en: "Adjacency list", km: "បញ្ជីស្រ", icon: "📋", detail: "Vec<Vec<usize>> or HashMap<Node, Vec<Node>> — for each node, list its neighbours. Compact for sparse graphs." },
    { en: "Adjacency matrix", km: "ម៉ាទ្រីស្រ", icon: "🔲", detail: "n × n matrix where cell (i, j) = 1 if edge exists. Fast lookup, but O(n²) memory even if empty." },
    { en: "BFS (Breadth-First Search)", km: "ការស្វែងរកតាមទទឹង", icon: "🌊", detail: "Explore level by level using a queue. Finds the shortest path in an UNWEIGHTED graph." },
    { en: "DFS (Depth-First Search)", km: "ការស្វែងរកតាមជម្រៅ", icon: "🕳️", detail: "Go deep before wide, using a stack or recursion. Great for cycle detection and topological sort." },
    { en: "Visited set", km: "សំណុំដែលទស្សនា", icon: "✅", detail: "A HashSet<Node> to avoid revisiting nodes — otherwise BFS/DFS on a cyclic graph loops forever." },
    { en: "Dijkstra's algorithm", km: "Dijkstra", icon: "🗺️", detail: "Shortest paths from one source in a WEIGHTED graph with non-negative weights. Uses a priority queue." },
    { en: "Topological sort", km: "តម្រៀបតាមទីតាំង", icon: "📚", detail: "Order the nodes of a DAG so every edge points forward. Used to plan classes: 'take Stats before ML'." },
  ],
  quiz: [
    { q: "A graph is?", options: ["Only a picture", "A set of nodes connected by edges", "Only a tree", "A hash"], answer: 1 },
    { q: "A tree is a graph that is?", options: ["Cyclic", "Connected AND acyclic (with n−1 edges)", "Fully connected", "Just linear"], answer: 1 },
    { q: "A directed edge means?", options: ["Both directions", "Only one direction A → B", "No direction", "Random"], answer: 1 },
    { q: "A weighted edge stores?", options: ["A colour", "A cost / distance / time", "Nothing", "Only 0"], answer: 1 },
    { q: "Adjacency list is best when the graph is?", options: ["Dense", "Sparse", "Empty", "Cyclic"], answer: 1 },
    { q: "Adjacency matrix uses memory?", options: ["O(n) always", "O(n²)", "O(1)", "O(log n)"], answer: 1 },
    { q: "BFS uses a?", options: ["Stack", "Queue", "Hash", "Nothing"], answer: 1 },
    { q: "DFS uses a?", options: ["Stack (or recursion)", "Queue", "Only hash", "Nothing"], answer: 0 },
    { q: "BFS on an UNWEIGHTED graph finds?", options: ["Shortest path in edges", "Longest cycle", "Random path", "Nothing useful"], answer: 0 },
    { q: "For weighted graphs, shortest path is?", options: ["BFS", "DFS", "Dijkstra (non-negative weights)", "Nothing"], answer: 2 },
    { q: "Dijkstra uses which structure?", options: ["A priority queue", "A stack", "Only hash", "Nothing"], answer: 0 },
    { q: "'Visited set' prevents?", options: ["Compiling", "Infinite loops on cyclic graphs", "Sorting", "Speed"], answer: 1 },
    { q: "Delivering to every neighbour before going further is?", options: ["BFS", "DFS", "Neither", "Both randomly"], answer: 0 },
    { q: "Going as deep as possible first is?", options: ["BFS", "DFS", "Only sort", "Nothing"], answer: 1 },
    { q: "A DAG is?", options: ["A directed graph with cycles", "A directed ACYCLIC graph", "A tree only", "A hash"], answer: 1 },
    { q: "Topological sort works on?", options: ["Any graph", "Only DAGs", "Only cyclic graphs", "Only trees"], answer: 1 },
    { q: "'Take Stats before ML' is a?", options: ["Cycle", "Topological dependency", "Nothing", "A bug"], answer: 1 },
    { q: "The road network of Cambodian provinces is best modelled as?", options: ["A tree only", "An undirected weighted graph", "A stack", "A hash only"], answer: 1 },
    { q: "Social 'friends' relation is usually?", options: ["Directed", "Undirected", "A tree", "A stack"], answer: 1 },
    { q: "The BEST first algorithm to try on a shortest-path (unweighted) problem is?", options: ["Dijkstra", "BFS", "DFS", "Bogosort"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Sorting & Searching
 * ────────────────────────────────────────────────────────────── */

const DSA_SORTING: Lesson = {
  chapterNumber: "8",
  chapterTitle: "Sorting & Searching",
  chapterTitleKm: "តម្រៀប និង ស្វែងរក",
  terms: [
    { en: "Sorting", km: "ការតម្រៀប", icon: "📊", detail: "Putting items into a defined order — ascending prices, alphabetical provinces, oldest transactions first." },
    { en: "Bubble sort", km: "Bubble sort", icon: "🫧", detail: "Repeatedly swap adjacent items out of order. Simple to teach, O(n²) time — never use in production." },
    { en: "Insertion sort", km: "Insertion sort", icon: "🎴", detail: "Build the sorted list one item at a time — like sorting a hand of cards. O(n²), but fast for small n." },
    { en: "Merge sort", km: "Merge sort", icon: "🔀", detail: "Divide the list, sort each half, merge. O(n log n) time, O(n) extra space. Stable and predictable." },
    { en: "Quick sort", km: "Quick sort", icon: "⚡", detail: "Pick a pivot, partition around it, recurse. O(n log n) average, O(n²) worst case. Fast in practice." },
    { en: "Radix sort", km: "Radix sort", icon: "🔢", detail: "Sort by digit or byte, bucket by bucket. O(n · k) — beats comparison-based sorts for fixed-width integers." },
    { en: "Stable sort", km: "តម្រៀបស្ថេរ", icon: "🎯", detail: "Preserves the relative order of equal keys. Rust's slice.sort() is stable; sort_unstable() is faster but doesn't guarantee it." },
    { en: "In-place sort", km: "តម្រៀបនៅនឹងកន្លែង", icon: "🏠", detail: "Uses O(1) or O(log n) extra memory — the sort happens inside the input array. Quick sort is; merge sort isn't." },
    { en: "Linear search", km: "ការស្វែងរកលីនេអ៊ែរ", icon: "👀", detail: "Walk every element until you find it. O(n). No preparation required." },
    { en: "Binary search", km: "ការស្វែងរកគូ", icon: "🎯", detail: "Halve the range each step. O(log n). Requires the input to be sorted. Rust: slice.binary_search(&x)." },
    { en: "sort() vs sort_unstable()", km: "sort() ទល់នឹង sort_unstable()", icon: "⚡", detail: "In Rust, sort() is stable (usually merge-sort variant). sort_unstable() is faster and uses less memory (quicksort variant)." },
    { en: "When to sort", km: "ពេលណាត្រូវតម្រៀប", icon: "🤔", detail: "Sort ONCE if you'll query many times, or if the data must be presented in order. Don't sort just to look at one item." },
  ],
  quiz: [
    { q: "Bubble sort has average time?", options: ["O(1)", "O(n log n)", "O(n²)", "O(log n)"], answer: 2 },
    { q: "Merge sort is?", options: ["O(n²)", "O(n log n)", "O(1)", "O(2ⁿ)"], answer: 1 },
    { q: "Quick sort AVERAGE is?", options: ["O(n²)", "O(n log n)", "O(1)", "O(log n)"], answer: 1 },
    { q: "Quick sort WORST case is?", options: ["O(n log n)", "O(n²)", "O(1)", "O(log log n)"], answer: 1 },
    { q: "Rust's slice.sort() is?", options: ["Unstable", "Stable — preserves order of equal keys", "Random", "O(n²)"], answer: 1 },
    { q: "For fixed-width integers, radix sort is?", options: ["Always slower", "Often faster — O(n · k)", "Impossible", "Only for strings"], answer: 1 },
    { q: "Linear search is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2 },
    { q: "Binary search is?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
    { q: "Binary search requires?", options: ["A sorted array", "A hash", "An unsorted list", "A tree"], answer: 0 },
    { q: "Best sort in most Rust code is?", options: ["Your own bubble sort", "slice.sort() or sort_unstable()", "Only hash", "Only reverse"], answer: 1 },
    { q: "'In-place' means?", options: ["Uses O(n) extra memory", "Uses O(1) (or O(log n)) extra memory", "Never runs", "Only quicksort"], answer: 1 },
    { q: "Merge sort's space complexity is?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 1 },
    { q: "Insertion sort is best when?", options: ["n is huge", "n is small (or nearly sorted)", "Never", "Only strings"], answer: 1 },
    { q: "Sorting once and searching many times is?", options: ["Wasteful", "Great — amortise the sort cost", "Impossible", "Bug"], answer: 1 },
    { q: "Sorting 10⁹ transactions with bubble sort would take?", options: ["Fine on a laptop", "About 10¹⁸ ops — millennia", "One second", "One minute"], answer: 1 },
    { q: "Rust's slice.binary_search returns?", options: ["Only usize", "Result<usize, usize>", "None", "A string"], answer: 1 },
    { q: "Which sort is used by default in most language stdlibs today?", options: ["Bubble", "Some Timsort / IntroSort variant — O(n log n) hybrid", "Bogosort", "Selection"], answer: 1 },
    { q: "'Stable' matters when?", options: ["Never", "You sort by one key but want the previous order kept for ties", "Only in Java", "Only for ints"], answer: 1 },
    { q: "For 20 items, the best sort is often?", options: ["Merge sort with all the machinery", "Insertion sort — simple and fast for small n", "Radix sort", "Nothing"], answer: 1 },
    { q: "The FIRST question before choosing a sort is?", options: ["Size of n, is it nearly sorted, is stability needed?", "The colour of the IDE", "Font size", "Coffee brand"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Master export — merged into LESSONS in lecture-data.ts
 * ────────────────────────────────────────────────────────────── */

export const DSA_LESSONS: Record<string, Lesson> = {
  "dsa-welcome": DSA_WELCOME,
  "dsa-arrays": DSA_ARRAYS,
  "dsa-linked": DSA_LINKED,
  "dsa-stacks": DSA_STACKS,
  "dsa-hashmaps": DSA_HASHMAPS,
  "dsa-trees": DSA_TREES,
  "dsa-graphs": DSA_GRAPHS,
  "dsa-sorting": DSA_SORTING,
};
