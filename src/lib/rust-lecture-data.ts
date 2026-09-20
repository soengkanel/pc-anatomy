// Rust course content: 8 chapters, each with a bilingual (English–Khmer)
// glossary and a 20-question practice quiz. Data-only, consumed by
// LessonPack.tsx just like the IT course lessons.

import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome to Rust
 * ────────────────────────────────────────────────────────────── */

const RUST_WELCOME: Lesson = {
  chapterNumber: "1",
  chapterTitle: "Welcome to Rust",
  chapterTitleKm: "សូមស្វាគមន៍មកកាន់ Rust",
  terms: [
    { en: "Rust", km: "ភាសា Rust", icon: "🦀", detail: "A programming language that is FAST like C++ but SAFE from memory bugs — no crashes, no data races, and no garbage collector." },
    { en: "Systems Language", km: "ភាសាប្រព័ន្ធ", icon: "🏗️", detail: "A language you can use to build the deepest parts of a computer — the operating system, browsers, and databases." },
    { en: "Compile", km: "កំពែល", icon: "⚒️", detail: "Turn your text code into a small program the computer can actually run — Rust does this once, before running." },
    { en: "Compiler", km: "កម្មវិធីកំពែល", icon: "🤖", detail: "The tool that checks your Rust code and turns it into a runnable program. In Rust, it is also your patient teacher." },
    { en: "Memory Safety", km: "សុវត្ថិភាពនៃការចងចាំ", icon: "🛡️", detail: "The guarantee that your program will not crash because it read or wrote the wrong slot of memory." },
    { en: "Performance", km: "ដំណើរការល្បឿនលឿន", icon: "⚡", detail: "How fast a program runs. Rust programs are as fast as any language on Earth." },
    { en: "Zero-cost abstractions", km: "ការសង្ខេបគ្មានតម្លៃ", icon: "🎯", detail: "You can write beautiful, high-level code and the compiler turns it into the fastest possible machine code — no penalty." },
    { en: "Cargo", km: "Cargo", icon: "📦", detail: "Rust's toolbox: creates projects, downloads libraries, builds, tests, and runs your code — all in one." },
    { en: "Crate", km: "កញ្ចប់កូដ", icon: "🍱", detail: "A package of Rust code. Every Rust project is a crate, and you can add other people's crates to yours." },
    { en: "crates.io", km: "crates.io", icon: "🌐", detail: "The public library where the whole Rust community shares crates for free. Like an app store for code." },
    { en: "Open Source", km: "កូដបើកចំហ", icon: "🔓", detail: "The whole language is free — anyone can read it, use it, and improve it." },
    { en: "Rustacean", km: "អ្នកប្រើ Rust", icon: "🦞", detail: "The nickname for people who love writing Rust. You are about to become one." },
  ],
  quiz: [
    { q: "Rust is a programming language known for being?", options: ["Slow but easy", "Fast and safe", "Only for websites", "Only for phones"], answer: 1 },
    { q: "The Rust mascot is a?", options: ["Cat", "Crab", "Robot", "Dragon"], answer: 1 },
    { q: "Rust programs are?", options: ["Interpreted line by line", "Compiled ahead of time", "Written in emoji", "Only for the cloud"], answer: 1 },
    { q: "The tool that turns your Rust code into a program is called?", options: ["Cargo runner", "The compiler", "The linker", "The debugger"], answer: 1 },
    { q: "Cargo is Rust's?", options: ["Web browser", "Package manager and build tool", "Text editor", "Operating system"], answer: 1 },
    { q: "You can find community Rust libraries on?", options: ["rust-libraries.net", "crates.io", "npmjs.com", "pypi.org"], answer: 1 },
    { q: "A package of Rust code is called a?", options: ["Bundle", "Crate", "Pack", "Barrel"], answer: 1 },
    { q: "Is Rust open source?", options: ["No, it costs money", "Yes, completely free", "Only for students", "Only for companies"], answer: 1 },
    { q: "Rust programs are?", options: ["Slower than Python", "As fast as C or C++", "Only for math", "Only for games"], answer: 1 },
    { q: "'Memory safety' in Rust means?", options: ["Programs use less RAM", "Programs will not crash from bad memory access", "Programs never sleep", "Programs remember your name"], answer: 1 },
    { q: "Which is a real project written in Rust?", options: ["Only nothing yet", "Parts of Firefox and Linux", "Only Microsoft Word", "Only email"], answer: 1 },
    { q: "Rustaceans are?", options: ["Sea creatures", "People who love writing Rust", "Rust bugs", "Old Rust versions"], answer: 1 },
    { q: "Rust catches most bugs?", options: ["Never", "At compile time, before you run", "Only in production", "Only when it feels like it"], answer: 1 },
    { q: "Compared to C++, Rust is?", options: ["Slower and more dangerous", "About as fast, but much safer", "Only for websites", "Only slower"], answer: 1 },
    { q: "Zero-cost abstractions mean?", options: ["Nice code with no performance penalty", "Free hosting", "Free courses", "No memory used"], answer: 0 },
    { q: "The Rust compiler is famous for?", options: ["Being rude", "Helpful, teaching-quality error messages", "Silence", "Only saying yes"], answer: 1 },
    { q: "Is Rust good for beginners?", options: ["No, only geniuses can learn it", "Yes — patient, careful learners do well", "Only for children", "Only for professors"], answer: 1 },
    { q: "Every Rust project starts by running?", options: ["cargo new my-project", "python start", "make begin", "rust go"], answer: 0 },
    { q: "The first program in every language is usually?", options: ["A game", "Hello, world!", "A website", "A calculator"], answer: 1 },
    { q: "Learning Rust helps you understand?", options: ["Only Rust", "How computers actually work", "Only websites", "Only phones"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — First Program
 * ────────────────────────────────────────────────────────────── */

const RUST_FIRST_PROGRAM: Lesson = {
  chapterNumber: "2",
  chapterTitle: "Your First Program",
  chapterTitleKm: "កម្មវិធីដំបូងរបស់អ្នក",
  terms: [
    { en: "rustup", km: "rustup", icon: "🧰", detail: "The tool that installs Rust on your computer and keeps it up to date." },
    { en: "cargo new", km: "cargo new", icon: "🌱", detail: "The command that creates a brand new Rust project with all the folders and files ready." },
    { en: "cargo run", km: "cargo run", icon: "▶️", detail: "The command that compiles your program AND runs it in one step." },
    { en: "cargo build", km: "cargo build", icon: "🔨", detail: "The command that only compiles the program (does not run it)." },
    { en: "main.rs", km: "main.rs", icon: "📜", detail: "The main source file of a Rust program — where your code lives." },
    { en: "Cargo.toml", km: "Cargo.toml", icon: "📋", detail: "The recipe card of your project — its name, version, and which libraries to include." },
    { en: "fn main()", km: "fn main()", icon: "🎬", detail: "The starting point. Every Rust program begins here — the very first line to run." },
    { en: "println!", km: "println!", icon: "🖨️", detail: "The command that prints a line of text to the screen. The ! means it is a macro." },
    { en: "Macro", km: "ម៉ាក្រូ", icon: "✨", detail: "Code that writes more code for you. In Rust, macros end with an exclamation mark, like println!" },
    { en: "Semicolon (;)", km: "ចុច ;", icon: "❕", detail: "The period at the end of a Rust statement — tells the compiler 'this instruction is finished'." },
    { en: "Comment", km: "សេចក្តីអត្ថាធិប្បាយ", icon: "💬", detail: "A note for humans that the compiler ignores. Two slashes // start a comment." },
    { en: "Target folder", km: "ថតគោលដៅ", icon: "📂", detail: "Where Cargo puts the compiled program. You can safely delete it — Cargo will rebuild." },
  ],
  quiz: [
    { q: "The tool that installs Rust is?", options: ["rustpkg", "rustup", "cargo-install", "brew"], answer: 1 },
    { q: "To create a new project, you type?", options: ["cargo start", "cargo new hello", "make hello", "rust new hello"], answer: 1 },
    { q: "To compile AND run your program, you type?", options: ["cargo run", "cargo start", "rust go", "run cargo"], answer: 0 },
    { q: "The source file where your code goes is called?", options: ["main.rust", "main.rs", "index.rs", "app.rs"], answer: 1 },
    { q: "The project recipe file is called?", options: ["package.json", "Cargo.toml", "rust.config", "Makefile"], answer: 1 },
    { q: "Every Rust program starts running at?", options: ["start()", "fn main()", "begin()", "run()"], answer: 1 },
    { q: "To print 'Hello' to the screen you use?", options: ["print(\"Hello\")", "println!(\"Hello\")", "echo Hello", "console.log(\"Hello\")"], answer: 1 },
    { q: "The ! at the end of println! means it is a?", options: ["Function", "Macro", "Variable", "Class"], answer: 1 },
    { q: "Every Rust statement usually ends with?", options: ["A comma", "A semicolon (;)", "A slash", "A dot"], answer: 1 },
    { q: "A comment that the compiler ignores starts with?", options: ["#", "//", "--", "**"], answer: 1 },
    { q: "To only compile (not run) you use?", options: ["cargo build", "cargo make", "cargo pack", "cargo test"], answer: 0 },
    { q: "The compiled program is placed in?", options: ["src/", "bin/", "target/", "out/"], answer: 2 },
    { q: "If the compiler shows an error, you should?", options: ["Ignore it", "Read it carefully — it explains the fix", "Delete your code", "Reinstall Rust"], answer: 1 },
    { q: "Which is a valid Rust hello-world body?", options: ["println!(\"Hi\");", "print(\"Hi\")", "console.log(\"Hi\")", "echo(\"Hi\")"], answer: 0 },
    { q: "How do you check your Rust version?", options: ["rustc --version", "rust --v", "cargo about", "check rust"], answer: 0 },
    { q: "Which of these is a MACRO?", options: ["main", "let", "println!", "fn"], answer: 2 },
    { q: "Which command creates a library project instead of a program?", options: ["cargo new --lib mylib", "cargo make library", "cargo build lib", "rust lib mylib"], answer: 0 },
    { q: "Where do library dependencies go in Cargo.toml?", options: ["[libs]", "[dependencies]", "[imports]", "[packages]"], answer: 1 },
    { q: "The Rust playground on the web lets you?", options: ["Play Rust games", "Try Rust code without installing anything", "Buy Rust merch", "Chat with Rustaceans"], answer: 1 },
    { q: "To share your project you usually put it on?", options: ["A CD", "GitHub", "A USB stick", "Email only"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Values & Flow
 * ────────────────────────────────────────────────────────────── */

const RUST_VALUES: Lesson = {
  chapterNumber: "3",
  chapterTitle: "Values & Flow",
  chapterTitleKm: "តម្លៃ និង លំហូរ",
  terms: [
    { en: "Variable", km: "អថេរ", icon: "🏷️", detail: "A named box that holds a value. `let name = \"Kanel\";` — the box is 'name'." },
    { en: "let", km: "let", icon: "📥", detail: "The keyword you use to introduce a new variable. `let x = 5;`" },
    { en: "mut", km: "mut", icon: "✏️", detail: "Short for 'mutable'. Add it after let when you want to change the value later. `let mut x = 5; x = 6;`" },
    { en: "Immutable", km: "មិនអាចប្តូរបាន", icon: "🔒", detail: "Cannot be changed. In Rust, variables are immutable BY DEFAULT — this prevents bugs." },
    { en: "Integer", km: "ចំនួនគត់", icon: "🔢", detail: "A whole number, like 1, 42, -7. Common Rust type: i32 (32-bit integer)." },
    { en: "Float", km: "ចំនួនទសភាគ", icon: "🌊", detail: "A number with a decimal point, like 3.14. Common Rust type: f64." },
    { en: "Boolean", km: "ប៊ូលៀន", icon: "✅", detail: "Only two possible values: true or false. The type is called `bool`." },
    { en: "String", km: "ខ្សែអក្សរ", icon: "🧵", detail: "Text — a sequence of characters. Rust has `String` (owned) and `&str` (borrowed)." },
    { en: "if / else", km: "if / else", icon: "🔀", detail: "Choose between two paths based on a condition. `if age >= 18 { \"adult\" } else { \"child\" }`" },
    { en: "loop", km: "រង្វិលជុំ", icon: "🔁", detail: "Repeat forever, until you `break` out. `loop { println!(\"hi\"); }`" },
    { en: "for loop", km: "រង្វិលជុំ for", icon: "➡️", detail: "Repeat once per item in a collection. `for x in 1..5 { println!(\"{x}\"); }`" },
    { en: "match", km: "match", icon: "🎯", detail: "A pattern-matching expression — like a super-powered `switch` that returns a value and must cover every possible case." },
  ],
  quiz: [
    { q: "To create a variable in Rust you use?", options: ["var", "let", "make", "define"], answer: 1 },
    { q: "By default, Rust variables are?", options: ["Mutable", "Immutable", "Random", "Empty"], answer: 1 },
    { q: "To allow a variable to change, you write?", options: ["let mut x = 5", "let x* = 5", "mut let x = 5", "change x = 5"], answer: 0 },
    { q: "Which is a valid Rust integer type?", options: ["int32", "i32", "num", "integer"], answer: 1 },
    { q: "Which is a Rust float type?", options: ["float", "double", "f64", "dec"], answer: 2 },
    { q: "A boolean in Rust can be?", options: ["true or false", "0 or 1 only", "yes or no", "any number"], answer: 0 },
    { q: "What is the value of `2 + 3` in Rust?", options: ["5", "23", "\"5\"", "error"], answer: 0 },
    { q: "Which prints x's value?", options: ["print(x)", "println!(\"{}\", x)", "echo x", "show x"], answer: 1 },
    { q: "`if` in Rust is a?", options: ["Statement only", "Expression — returns a value", "A macro", "A function name"], answer: 1 },
    { q: "Which is a valid `if` in Rust?", options: ["if (x > 0) { ... }", "if x > 0 { ... }", "if x > 0: ...", "if x > 0 then ..."], answer: 1 },
    { q: "`loop { ... }` runs?", options: ["Once", "Zero times", "Forever until break", "Twice"], answer: 2 },
    { q: "Which loop runs a fixed number of times over a range?", options: ["while", "for", "loop", "match"], answer: 1 },
    { q: "`1..5` in Rust means?", options: ["From 1 to 5 inclusive", "From 1 to 5 exclusive (1,2,3,4)", "One or five", "Error"], answer: 1 },
    { q: "`1..=5` means?", options: ["1 through 5, inclusive", "1 or 5 only", "1 to 5 excluding 5", "Nothing"], answer: 0 },
    { q: "`match` in Rust MUST?", options: ["Only handle one case", "Cover every possible case", "Return a String", "Run in a loop"], answer: 1 },
    { q: "`while x < 10 { ... }` is a?", options: ["Conditional loop", "One-shot statement", "A comment", "An error"], answer: 0 },
    { q: "Adding two different number types (i32 + f64) in Rust?", options: ["Just works silently", "Requires an explicit cast", "Adds a random number", "Panics"], answer: 1 },
    { q: "The value `\"hello\"` written in code is a?", options: ["String", "&str (string slice)", "i32", "bool"], answer: 1 },
    { q: "Everything in Rust is an?", options: ["Object", "Expression (has a value)", "Class", "Interface"], answer: 1 },
    { q: "To break out of a `loop` early you use?", options: ["exit", "stop", "break", "return"], answer: 2 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Memory & Pointers (the prelude to Ownership)
 * ────────────────────────────────────────────────────────────── */

const RUST_MEMORY: Lesson = {
  chapterNumber: "4",
  chapterTitle: "Memory & Pointers",
  chapterTitleKm: "អង្គចងចាំ និង Pointer",
  terms: [
    { en: "Memory (RAM)", km: "អង្គចងចាំ", icon: "🧠", detail: "Where a running program keeps its data. Imagine a long street of tiny houses, each with an address." },
    { en: "Memory Address", km: "អាសយដ្ឋានអង្គចងចាំ", icon: "🏷️", detail: "The house number of a value in RAM — usually written in hex, like 0x7ffee4a3." },
    { en: "Stack", km: "Stack", icon: "📚", detail: "Fast, orderly memory for local variables. LIFO — last in, first out. Auto-cleaned when a function returns." },
    { en: "Heap", km: "Heap", icon: "🛒", detail: "Flexible memory for values whose size can grow. Slower than stack. In C you must free it yourself; in Rust it&rsquo;s automatic." },
    { en: "Pointer", km: "Pointer", icon: "👉", detail: "A variable whose value IS an address. A sticky note that says 'the real data lives over there.'" },
    { en: "Dereferencing (*)", km: "ការឈូសចេញ", icon: "🎯", detail: "Following a pointer to read/write the value it points to. Written `*p` in both C and Rust." },
    { en: "Null pointer", km: "Null pointer", icon: "🕳️", detail: "A pointer that points to nothing. Dereferencing one crashes your program. Rust has no null — it uses `Option` instead." },
    { en: "Dangling pointer", km: "Pointer ព្យួរ", icon: "🏚️", detail: "A pointer to memory that has already been freed. Reading it is undefined behavior. Rust prevents this at compile time." },
    { en: "Use-after-free", km: "ប្រើក្រោយពេលលុប", icon: "💀", detail: "Reading through a dangling pointer. One of the most common C/C++ security bugs. Rust makes this impossible." },
    { en: "Smart Pointer", km: "Pointer ឆ្លាតវៃ", icon: "✨", detail: "A pointer wrapped in a type that cleans up automatically when it goes out of scope. Box, Rc, Arc are Rust&rsquo;s smart pointers." },
    { en: "Box<T>", km: "Box<T>", icon: "📦", detail: "Puts one value on the heap with a single owner. Cleaned up automatically when the Box is dropped." },
    { en: "Rc<T> / Arc<T>", km: "Rc / Arc", icon: "🎈", detail: "Reference-counted smart pointers. Many owners share one value; when the last one drops, the value is cleaned up. Arc is the thread-safe version." },
  ],
  quiz: [
    { q: "The memory of a running program is called?", options: ["ROM", "RAM", "Disk", "Cache"], answer: 1 },
    { q: "Every value in memory has?", options: ["A colour", "An address (a house number)", "A password", "A serial number only"], answer: 1 },
    { q: "Local variables in a function usually live on?", options: ["The stack", "The heap", "The disk", "The network"], answer: 0 },
    { q: "Values whose size changes at runtime (like Strings, Vecs) live on?", options: ["The stack", "The heap", "ROM", "The GPU"], answer: 1 },
    { q: "The stack is?", options: ["Slow but flexible", "Fast but fixed size", "Impossible to use", "Only for the CPU"], answer: 1 },
    { q: "In C, who cleans up heap memory?", options: ["The compiler", "You must call free() yourself", "The OS on shutdown", "It cleans itself"], answer: 1 },
    { q: "In Rust, who cleans up heap memory?", options: ["You call free()", "A garbage collector at random", "Rust does it automatically at end of scope", "Nobody"], answer: 2 },
    { q: "A pointer is best described as?", options: ["A copy of a value", "A variable holding an address", "A function", "A type"], answer: 1 },
    { q: "Dereferencing a pointer means?", options: ["Copying it", "Following it to read/write the value there", "Deleting it", "Renaming it"], answer: 1 },
    { q: "In C, what happens if you dereference NULL?", options: ["Nothing", "Program crashes (segfault)", "Prints a warning", "Recompiles"], answer: 1 },
    { q: "Rust represents 'no value' with?", options: ["null", "None (in Option)", "0", "\"\""], answer: 1 },
    { q: "A dangling pointer is one that?", options: ["Is very slow", "Points to freed memory", "Is very long", "Is thread-safe"], answer: 1 },
    { q: "In C, using a dangling pointer is?", options: ["Fine", "Undefined behavior — anything can happen", "Automatically caught", "Slower but safe"], answer: 1 },
    { q: "Rust catches dangling references?", options: ["Never", "Only at runtime", "At COMPILE time — before you run", "Only in test mode"], answer: 2 },
    { q: "Box<T> puts a value on?", options: ["The heap, with one owner", "The stack only", "Disk", "Nowhere"], answer: 0 },
    { q: "Rc<T> allows?", options: ["Only one owner", "Many owners; auto-cleaned when the last drops", "Zero owners", "Only threads"], answer: 1 },
    { q: "Rc<T> is safe to use across threads?", options: ["Yes always", "No — use Arc<T> for multi-threading", "Only on Linux", "Only on Windows"], answer: 1 },
    { q: "Double-free (freeing the same memory twice) in Rust is?", options: ["A runtime crash", "Prevented at compile time in safe code", "Only a warning", "Encouraged"], answer: 1 },
    { q: "Compared to a garbage-collected language, Rust&rsquo;s cleanup happens?", options: ["Randomly", "At predictable, known points (end of scope)", "Only at program exit", "Never"], answer: 1 },
    { q: "Rust&rsquo;s memory safety costs?", options: ["A lot of runtime speed", "Basically zero at runtime — enforced at compile time", "Extra RAM only", "It doesn&rsquo;t exist"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Ownership (the star of the show)
 * ────────────────────────────────────────────────────────────── */

const RUST_OWNERSHIP: Lesson = {
  chapterNumber: "5",
  chapterTitle: "Ownership",
  chapterTitleKm: "ភាពជាកម្មសិទ្ធិ",
  terms: [
    { en: "Ownership", km: "ភាពជាកម្មសិទ្ធិ", icon: "🖊️", detail: "Rust's biggest idea: every value has EXACTLY ONE owner at any moment. When the owner disappears, the value is cleaned up." },
    { en: "Move", km: "ការផ្ទេរ", icon: "📦", detail: "When you assign or pass a value, ownership MOVES to the new variable. The old one can no longer use it." },
    { en: "Copy", km: "ការចម្លង", icon: "🖨️", detail: "Some small values (numbers, bools) are cheap to duplicate — Rust silently copies them instead of moving." },
    { en: "Clone", km: "ក្លូន", icon: "👥", detail: "An EXPLICIT deep copy. `.clone()` makes an independent duplicate of a value like a String or Vec." },
    { en: "Reference (&)", km: "ការយោង (&)", icon: "👉", detail: "A pointer that lets you LOOK AT a value without owning it. Like reading a friend's book instead of taking it home." },
    { en: "Borrow", km: "ការខ្ចី", icon: "📚", detail: "Making a reference is called 'borrowing'. Multiple people can borrow the same value at once — as long as no one is editing." },
    { en: "Mutable Reference (&mut)", km: "ការយោងអាចប្តូរបាន", icon: "✍️", detail: "A special borrow that also allows changing the value. Only ONE mutable borrow allowed at a time." },
    { en: "Borrow Checker", km: "អ្នកត្រួតពិនិត្យការខ្ចី", icon: "🕵️", detail: "The part of the compiler that enforces all the rules. It sounds strict but saves you from horrible bugs." },
    { en: "Lifetime", km: "រយៈពេលនៃការរស់នៅ", icon: "⏳", detail: "How long a reference is valid. Rust makes sure you never look at a value that no longer exists." },
    { en: "Dangling Reference", km: "ការយោងព្យួរ", icon: "🚫", detail: "A reference to a value that has already been cleaned up. Rust prevents these AT COMPILE TIME." },
    { en: "Scope", km: "វិសាលភាព", icon: "🎪", detail: "The region where a variable is alive — from `let` to the closing `}` of its block." },
    { en: "Drop", km: "ការលុប", icon: "🗑️", detail: "When a value's owner leaves scope, Rust automatically drops (frees) the value — no garbage collector needed." },
  ],
  quiz: [
    { q: "In Rust, every value has how many owners at a time?", options: ["Zero", "Exactly one", "Two", "As many as needed"], answer: 1 },
    { q: "When you assign `let b = a;` where a is a String, what happens?", options: ["a and b both own the string", "Ownership moves to b, a is no longer usable", "b is a copy", "It's an error"], answer: 1 },
    { q: "Simple numbers like i32 have which behavior?", options: ["Move", "Copy", "Clone", "Drop"], answer: 1 },
    { q: "To make an explicit deep copy of a String you call?", options: [".dup()", ".copy()", ".clone()", ".move()"], answer: 2 },
    { q: "A reference is created with which symbol?", options: ["*", "&", "@", "#"], answer: 1 },
    { q: "'Borrowing' means?", options: ["Taking ownership permanently", "Making a reference to look at a value", "Deleting the value", "Renting for money"], answer: 1 },
    { q: "How many mutable references (&mut) can exist at once?", options: ["Only one", "Two", "Ten", "Unlimited"], answer: 0 },
    { q: "How many immutable references (&) can exist at once?", options: ["Only one", "Only two", "Many — as long as no &mut exists", "Zero"], answer: 2 },
    { q: "The 'borrow checker' is?", options: ["A bank employee", "A part of the Rust compiler that enforces borrow rules", "A library", "An IDE"], answer: 1 },
    { q: "A dangling reference is?", options: ["A reference to a value that no longer exists", "A slow reference", "A reference on a phone", "A copy"], answer: 0 },
    { q: "Rust catches dangling references?", options: ["Never", "At compile time — before you run", "Only in production", "Only sometimes"], answer: 1 },
    { q: "When a value's owner leaves scope, Rust?", options: ["Leaks the memory", "Automatically drops (cleans up) the value", "Sends an email", "Prints a warning"], answer: 1 },
    { q: "Which is safe in Rust?", options: ["Two &mut at once", "One &mut + several &", "Many & (immutable) at once", "Two owners"], answer: 2 },
    { q: "You want to read a String in a function without giving up ownership. You pass?", options: ["The String itself", "A reference (&String or &str)", "A copy", "Nothing"], answer: 1 },
    { q: "In `fn greet(name: &str)`, what is name?", options: ["An owned String", "A borrowed string slice", "A number", "A macro"], answer: 1 },
    { q: "'Lifetime' in Rust describes?", options: ["How long a program runs", "How long a reference stays valid", "How old the code is", "The compile time"], answer: 1 },
    { q: "Rust manages memory using?", options: ["A garbage collector", "Ownership rules — no GC needed", "Manual free() calls only", "Nothing"], answer: 1 },
    { q: "After `let s2 = s1;` where s1 is a String, using `s1` gives?", options: ["Nothing wrong", "A compile error — s1 was moved", "A runtime crash", "A warning only"], answer: 1 },
    { q: "To avoid the move above, you would?", options: ["Use let s2 = &s1;", "Use let s2 = s1.clone();", "Both A and B are valid, depending on need", "Delete s1"], answer: 2 },
    { q: "Why does Rust have ownership rules?", options: ["To be annoying", "To guarantee memory safety with zero runtime cost", "Because the author was bored", "Only for style"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Shaping Data (struct, enum, Option, Result)
 * ────────────────────────────────────────────────────────────── */

const RUST_DATA: Lesson = {
  chapterNumber: "6",
  chapterTitle: "Shaping Data",
  chapterTitleKm: "រូបរាងទិន្នន័យ",
  terms: [
    { en: "Struct", km: "ស្ត្រុក", icon: "📇", detail: "A custom data shape you invent — like a form with named fields. `struct Student { name: String, grade: u8 }`" },
    { en: "Field", km: "វាល", icon: "📝", detail: "One named slot inside a struct. `student.name` reads the 'name' field." },
    { en: "Enum", km: "អ៊ីនុំ", icon: "🎨", detail: "A type that can be ONE of several named variants. `enum Traffic { Red, Yellow, Green }`" },
    { en: "Variant", km: "ប្រភេទ", icon: "🎯", detail: "One of the possible values of an enum. `Traffic::Red` is a variant of Traffic." },
    { en: "Option<T>", km: "Option<T>", icon: "🎁", detail: "An enum built into Rust: `Some(value)` or `None`. Rust's answer to 'null' — safe by design." },
    { en: "Some / None", km: "Some / None", icon: "📮", detail: "The two variants of Option. `Some(3)` means 'a value is here'; `None` means 'nothing'." },
    { en: "Result<T, E>", km: "Result<T, E>", icon: "📬", detail: "An enum for operations that might fail: `Ok(value)` on success, `Err(error)` on failure." },
    { en: "Ok / Err", km: "Ok / Err", icon: "📨", detail: "The two variants of Result. `Ok(42)` means success; `Err(\"file missing\")` means it failed." },
    { en: "Pattern Matching", km: "ការផ្គូផ្គងគំរូ", icon: "🧩", detail: "Using `match` to destructure and handle every possible variant. The compiler forces you to cover every case." },
    { en: "Tuple", km: "ចង្កោម", icon: "🎒", detail: "A fixed group of values, possibly of different types. `let point = (3, 4.5, \"origin\");`" },
    { en: "Method", km: "វិធីសាស្ត្រ", icon: "🛠️", detail: "A function attached to a type. `student.greet()` — `greet` is a method on Student." },
    { en: "impl block", km: "impl block", icon: "🏗️", detail: "Where you define methods for a type. `impl Student { fn greet(&self) { ... } }`" },
  ],
  quiz: [
    { q: "A custom shape with named fields is called a?", options: ["Class", "Struct", "Object", "Bundle"], answer: 1 },
    { q: "Fields inside a struct are separated by?", options: ["Semicolons", "Commas", "Slashes", "Nothing"], answer: 1 },
    { q: "To access a field of struct s named 'age' you write?", options: ["s->age", "s.age", "s::age", "s[age]"], answer: 1 },
    { q: "An enum lets a value be?", options: ["Only a number", "One of several named variants", "Always None", "A String only"], answer: 1 },
    { q: "Which is a valid enum variant syntax?", options: ["Color::Red", "Red@Color", "Red.Color", "color.red"], answer: 0 },
    { q: "Rust does NOT have `null`. Instead it uses?", options: ["Option<T>", "Void", "Nil", "Undefined"], answer: 0 },
    { q: "`Some(5)` and `None` are variants of?", options: ["Result", "Option", "Vec", "String"], answer: 1 },
    { q: "For an operation that can fail, use?", options: ["Option", "Result", "Vec", "Tuple"], answer: 1 },
    { q: "`Ok(v)` and `Err(e)` are variants of?", options: ["Option", "Result", "Enum", "Try"], answer: 1 },
    { q: "To handle every variant of an enum, use?", options: ["if", "match", "while", "for"], answer: 1 },
    { q: "`match` forces you to cover?", options: ["Only one variant", "Every possible variant (exhaustive)", "Two variants max", "Nothing"], answer: 1 },
    { q: "A tuple `(1, 'a', 3.14)` has how many elements?", options: ["1", "2", "3", "4"], answer: 2 },
    { q: "To read the first element of tuple t you write?", options: ["t[0]", "t.0", "t->0", "t::0"], answer: 1 },
    { q: "A method is a function attached to?", options: ["A macro", "A type", "A file", "A folder"], answer: 1 },
    { q: "Methods live inside an?", options: ["impl block", "fn block", "type block", "match block"], answer: 0 },
    { q: "The first parameter of a method is usually?", options: ["&self", "this", "self*", "me"], answer: 0 },
    { q: "`&self` means the method?", options: ["Owns self", "Borrows self immutably", "Copies self", "Deletes self"], answer: 1 },
    { q: "`&mut self` means the method?", options: ["Owns self", "Borrows self mutably (can change it)", "Copies self", "Ignores self"], answer: 1 },
    { q: "Structs and enums together let you model?", options: ["Only numbers", "Almost any real-world data", "Only strings", "Only errors"], answer: 1 },
    { q: "The Rust compiler will complain if a `match` on an enum?", options: ["Handles too many variants", "Misses a variant", "Uses commas", "Has more than two arms"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Collections & Iterators
 * ────────────────────────────────────────────────────────────── */

const RUST_COLLECTIONS: Lesson = {
  chapterNumber: "7",
  chapterTitle: "Collections & Iterators",
  chapterTitleKm: "សម្រាំង និង Iterator",
  terms: [
    { en: "Vec<T>", km: "Vec (បញ្ជីអាចរីកបាន)", icon: "📚", detail: "A growable list of items, all the same type. `let mut list = vec![1, 2, 3];` — add with `list.push(4)`." },
    { en: "String", km: "String", icon: "🧵", detail: "An owned, growable text buffer. Made of UTF-8 bytes, so it handles Khmer, emoji, everything." },
    { en: "&str", km: "&str (ខ្សែអក្សរខ្ចី)", icon: "🎗️", detail: "A borrowed view into some text. Written literals like `\"hello\"` are &str." },
    { en: "HashMap<K, V>", km: "HashMap (គូតម្លៃ)", icon: "📖", detail: "A phone-book: look up a value by its key. `map.get(\"Kanel\")` returns the number stored under \"Kanel\"." },
    { en: "Iterator", km: "Iterator", icon: "🎞️", detail: "Anything you can walk through one item at a time. A conveyor belt of values." },
    { en: ".iter()", km: ".iter()", icon: "▶️", detail: "Turns a collection into an iterator of references — for reading, not moving." },
    { en: ".map()", km: ".map()", icon: "🔄", detail: "Transform every item with a function. `v.iter().map(|x| x * 2)`" },
    { en: ".filter()", km: ".filter()", icon: "🧲", detail: "Keep only items that match a rule. `v.iter().filter(|x| *x > 0)`" },
    { en: ".collect()", km: ".collect()", icon: "🪣", detail: "Turn an iterator BACK into a collection like Vec or HashMap." },
    { en: ".sum() / .count()", km: ".sum() / .count()", icon: "🧮", detail: "Consume the iterator and give one final answer — the total, or the number of items." },
    { en: "Closure", km: "បិទ", icon: "🎁", detail: "A tiny nameless function that can capture variables from its surroundings. Written `|x| x * 2`, handed to methods like map or filter." },
    { en: "for ... in", km: "for ... in", icon: "➡️", detail: "The friendliest way to walk through anything: `for item in list { println!(\"{item}\"); }`" },
  ],
  quiz: [
    { q: "A growable list in Rust is called a?", options: ["Array", "Vec", "List", "Set"], answer: 1 },
    { q: "You create one quickly with?", options: ["Vec::new()", "vec![1, 2, 3]", "Both A and B are valid", "[1, 2, 3]"], answer: 2 },
    { q: "To add to the end of a Vec, use?", options: [".add()", ".push()", ".append()", ".insert()"], answer: 1 },
    { q: "To remove and return the last item, use?", options: [".pop()", ".delete()", ".last()", ".remove()"], answer: 0 },
    { q: "A key-to-value lookup uses?", options: ["Vec", "HashMap", "String", "Tuple"], answer: 1 },
    { q: "To insert into a HashMap you use?", options: [".push()", ".insert(k, v)", ".add()", ".set()"], answer: 1 },
    { q: "`map.get(\"Kanel\")` returns a?", options: ["Value directly", "Option<&V>", "Result<V, E>", "String"], answer: 1 },
    { q: "Rust Strings store text as?", options: ["ASCII bytes only", "UTF-8 bytes", "UTF-16", "Random"], answer: 1 },
    { q: "A literal like `\"hi\"` is of type?", options: ["String", "&str", "char", "text"], answer: 1 },
    { q: "To go through every item of a Vec, use?", options: ["for x in v", "iterate(v)", "each(v)", "loop v"], answer: 0 },
    { q: "An 'iterator' is?", options: ["A hardware device", "Something you can walk through one item at a time", "A macro", "A style"], answer: 1 },
    { q: "To double every number in a list, chain?", options: [".iter().map(|x| x * 2)", ".double()", ".x2()", ".iter().times(2)"], answer: 0 },
    { q: "To keep only even numbers, use?", options: [".filter()", ".skip()", ".keep()", ".only()"], answer: 0 },
    { q: "A closure like `|x| x + 1` is?", options: ["A macro", "A small inline function", "A struct", "A field"], answer: 1 },
    { q: "To turn an iterator back into a Vec, call?", options: [".collect()", ".gather()", ".finish()", ".back()"], answer: 0 },
    { q: "To sum an iterator of numbers, call?", options: [".sum()", ".total()", ".add()", ".+()"], answer: 0 },
    { q: "Iterators in Rust are?", options: ["Slow", "Zero-cost — as fast as hand-written loops", "Only for small lists", "Only for numbers"], answer: 1 },
    { q: "`.iter()` gives you?", options: ["Owned values", "References (&T)", "Copies", "Nothing"], answer: 1 },
    { q: "`.into_iter()` gives you?", options: ["References", "Owned values (consumes the collection)", "Errors", "Slices"], answer: 1 },
    { q: "Iterators are ______ until you consume them.", options: ["Lazy", "Eager", "Broken", "Recursive"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Traits & Modules
 * ────────────────────────────────────────────────────────────── */

const RUST_TRAITS: Lesson = {
  chapterNumber: "8",
  chapterTitle: "Traits & Modules",
  chapterTitleKm: "លក្ខណៈពិសេស និង ម៉ូឌុល",
  terms: [
    { en: "Trait", km: "លក្ខណៈពិសេស", icon: "🎫", detail: "A promise a type makes: 'I can do these things.' Like a driver's licence. Example: `Display` means 'I can be printed.'" },
    { en: "impl Trait for Type", km: "impl Trait for Type", icon: "✅", detail: "Where you actually DELIVER on the promise — writing the methods the trait requires." },
    { en: "Generic <T>", km: "ទូទៅ <T>", icon: "🖼️", detail: "Code that works with ANY type. Like a photo frame that fits any picture. `fn biggest<T: Ord>(a: T, b: T) -> T`" },
    { en: "Trait bound", km: "ព្រំដែនលក្ខណៈពិសេស", icon: "🎯", detail: "A rule on a generic saying 'T must implement this trait'. Written as `T: Display` or `<T: Ord>`." },
    { en: "Derive", km: "ការទាញយក", icon: "✨", detail: "A shortcut that tells Rust: 'auto-generate this trait for me'. `#[derive(Debug, Clone)]`" },
    { en: "Debug trait", km: "លក្ខណៈពិសេស Debug", icon: "🔎", detail: "Lets a value be printed with `{:?}` — great for troubleshooting." },
    { en: "Display trait", km: "លក្ខណៈពិសេស Display", icon: "🎭", detail: "Lets a value be printed nicely with `{}` — the user-friendly version." },
    { en: "Module", km: "ម៉ូឌុល", icon: "🗂️", detail: "A named box of code inside your project. Made with `mod name { ... }` or a `name.rs` file." },
    { en: "pub (public)", km: "pub (សាធារណៈ)", icon: "🔓", detail: "Marks a thing as visible OUTSIDE its module. Everything is private by default." },
    { en: "use", km: "use", icon: "📎", detail: "Bring a name into scope so you don't have to write the full path. `use std::collections::HashMap;`" },
    { en: "Crate", km: "កញ្ចប់កូដ", icon: "📦", detail: "A whole Rust package (your project, or a library from crates.io)." },
    { en: "cargo add", km: "cargo add", icon: "➕", detail: "Adds a dependency from crates.io to your Cargo.toml. `cargo add serde` — done." },
  ],
  quiz: [
    { q: "A 'trait' in Rust is like?", options: ["A driver's licence — a promise you can do certain things", "A number", "A folder", "A screen"], answer: 0 },
    { q: "You DEFINE a trait using?", options: ["struct", "trait", "type", "interface"], answer: 1 },
    { q: "You DELIVER a trait for a type with?", options: ["def", "impl Trait for Type", "extends", "override"], answer: 1 },
    { q: "A generic type parameter is written?", options: ["<T>", "[T]", "{T}", "(T)"], answer: 0 },
    { q: "In `fn largest<T: Ord>(...)`, `T: Ord` is a?", options: ["Trait bound", "Comment", "Generic name", "Macro"], answer: 0 },
    { q: "To auto-implement Debug you write?", options: ["#[derive(Debug)] above the type", "impl Debug for Type manually", "Both A and B (A is the shortcut)", "Nothing"], answer: 2 },
    { q: "To print a struct with `{:?}` its type needs?", options: ["Display", "Debug", "Copy", "Clone"], answer: 1 },
    { q: "To print a value with `{}` its type needs?", options: ["Debug", "Display", "PartialEq", "Hash"], answer: 1 },
    { q: "A module organises?", options: ["Files only", "Related code into a named box", "Comments only", "Numbers"], answer: 1 },
    { q: "By default in Rust, things are?", options: ["Public", "Private to the module", "Deleted", "Random"], answer: 1 },
    { q: "To make an item usable outside its module, mark it?", options: ["shared", "pub", "public", "export"], answer: 1 },
    { q: "`use std::collections::HashMap;` does what?", options: ["Downloads a library", "Brings HashMap into scope", "Prints HashMap", "Deletes it"], answer: 1 },
    { q: "A whole Rust package is called a?", options: ["Crate", "Bundle", "Module", "Trait"], answer: 0 },
    { q: "Community libraries live on?", options: ["crates.io", "npmjs.com", "github.io", "google.com"], answer: 0 },
    { q: "To add a dependency you run?", options: ["cargo add name", "npm i name", "pip install name", "cargo new name"], answer: 0 },
    { q: "After adding a dependency, `use` brings it into?", options: ["Scope", "The disk", "The internet", "Nothing"], answer: 0 },
    { q: "Traits let you write code that works?", options: ["Only with numbers", "With any type that implements the trait", "Only with Strings", "Never"], answer: 1 },
    { q: "Rust supports?", options: ["Inheritance like Java", "Composition + traits (no inheritance)", "Only classes", "Only functions"], answer: 1 },
    { q: "Generics with trait bounds give you?", options: ["Slow code", "Reusable code with zero runtime cost", "Random behavior", "Only errors"], answer: 1 },
    { q: "A file `math.rs` in your project is automatically?", options: ["Ignored", "A module named math", "A binary", "A test"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 9 — Build Something Real
 * ────────────────────────────────────────────────────────────── */

const RUST_PROJECT: Lesson = {
  chapterNumber: "9",
  chapterTitle: "Build Something Real",
  chapterTitleKm: "ស្ថាបនាកម្មវិធីពិត",
  terms: [
    { en: "CLI tool", km: "ឧបករណ៍ CLI", icon: "⌨️", detail: "A program you run from the terminal by typing commands, like `todo add \"buy milk\"`." },
    { en: "std::env::args", km: "std::env::args", icon: "📥", detail: "Rust's built-in way to read the arguments a user typed when running your program." },
    { en: "std::fs", km: "std::fs", icon: "📁", detail: "The standard library module for reading and writing files on the disk." },
    { en: "read_to_string", km: "read_to_string", icon: "📖", detail: "Load a whole text file into a String in one line: `fs::read_to_string(\"todo.txt\")?`" },
    { en: "write", km: "write", icon: "💾", detail: "Save a String (or bytes) into a file: `fs::write(\"todo.txt\", contents)?`" },
    { en: "? operator", km: "សញ្ញា ?", icon: "❓", detail: "Short for 'return the error if there was one; otherwise unwrap the value'. Makes error handling one keystroke." },
    { en: "unwrap()", km: "unwrap()", icon: "🎁", detail: "Take the value out of Some or Ok. If it's None or Err, the program panics — use only when you're sure." },
    { en: "expect(msg)", km: "expect(msg)", icon: "📣", detail: "Like unwrap but with a friendly message on failure. `port.parse().expect(\"port must be a number\")`" },
    { en: "panic!", km: "panic!", icon: "💥", detail: "Stop the program with an error message. Rust's 'this can't continue' button." },
    { en: "String split", km: "ការបំបែក String", icon: "✂️", detail: "Break a String into parts: `\"a,b,c\".split(',')` gives you \"a\", \"b\", \"c\"." },
    { en: "trim()", km: "trim()", icon: "🧹", detail: "Remove whitespace from both ends of a String — the classic 'clean-up' step." },
    { en: "cargo test", km: "cargo test", icon: "🧪", detail: "Runs every function marked with #[test] in your project. Automated proofs that your code works." },
  ],
  quiz: [
    { q: "A CLI tool is used from the?", options: ["Terminal (command line)", "Only from a website", "Only from a phone", "Only from a game"], answer: 0 },
    { q: "To read the arguments passed on the command line use?", options: ["std::env::args", "std::io::input", "std::args::get", "console::args"], answer: 0 },
    { q: "To read an entire file as text use?", options: ["fs::read_to_string(path)", "fs::open(path)", "std::io::read(path)", "file::load(path)"], answer: 0 },
    { q: "To write a String to disk use?", options: ["fs::write(path, contents)", "fs::save(path, contents)", "file::write(path, contents)", "io::write(path, contents)"], answer: 0 },
    { q: "The `?` operator?", options: ["Prints a question mark", "Returns the error if one occurred, else unwraps the value", "Deletes the value", "Panics"], answer: 1 },
    { q: "`.unwrap()` on an `Err` value will?", options: ["Do nothing", "Panic (crash the program)", "Return None", "Retry"], answer: 1 },
    { q: "`.expect(\"reason\")` is like unwrap but?", options: ["Slower", "Adds a helpful message on failure", "Never panics", "Runs in loop"], answer: 1 },
    { q: "`panic!(\"boom\")` will?", options: ["Do nothing", "Immediately stop the program with the message", "Log to a file", "Continue with default"], answer: 1 },
    { q: "To split a String on commas you call?", options: [".split(',')", ".break(',')", ".cut(',')", ".chop(',')"], answer: 0 },
    { q: "`.trim()` on a String does?", options: ["Cuts it in half", "Removes leading and trailing whitespace", "Deletes it", "Reverses it"], answer: 1 },
    { q: "Testing in Rust is built in and runs with?", options: ["cargo test", "cargo check", "cargo run --test", "test cargo"], answer: 0 },
    { q: "A test function is marked with?", options: ["#[test]", "@test", "// test", "test!"], answer: 0 },
    { q: "To build an optimised release version you run?", options: ["cargo build --release", "cargo release", "cargo optimise", "cargo prod"], answer: 0 },
    { q: "After `cargo build --release`, the program is in?", options: ["target/debug/", "target/release/", "src/release/", "release/"], answer: 1 },
    { q: "Which is a good next step after this course?", options: ["Never write code again", "Build a small project of your own", "Only read books", "Delete Rust"], answer: 1 },
    { q: "A great source for well-written Rust example projects is?", options: ["Only textbooks", "The 'Rust by Example' website", "TV commercials", "Song lyrics"], answer: 1 },
    { q: "Cargo can also?", options: ["Run tests, format code, check for errors", "Only compile", "Only download", "Only clean"], answer: 0 },
    { q: "Sharing your code with others is easiest via?", options: ["Emailing a ZIP", "GitHub", "Fax", "Print-out"], answer: 1 },
    { q: "A well-tested small program is usually?", options: ["A waste of time", "More reliable than a big untested one", "Slower", "Broken"], answer: 1 },
    { q: "The best way to learn Rust is to?", options: ["Watch videos only", "Write small programs and read errors patiently", "Guess", "Skip errors"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Master export — plugged into LESSONS in lecture-data.ts
 * ────────────────────────────────────────────────────────────── */

export const RUST_LESSONS: Record<string, Lesson> = {
  "rust-welcome": RUST_WELCOME,
  "rust-first-program": RUST_FIRST_PROGRAM,
  "rust-values": RUST_VALUES,
  "rust-memory": RUST_MEMORY,
  "rust-ownership": RUST_OWNERSHIP,
  "rust-data": RUST_DATA,
  "rust-collections": RUST_COLLECTIONS,
  "rust-traits": RUST_TRAITS,
  "rust-project": RUST_PROJECT,
};
