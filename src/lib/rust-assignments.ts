// Weekly assignments — one capstone project per chapter.
// Each assignment ties together the chapter's concepts into a small,
// runnable program students build themselves.

import type { WeeklyAssignment } from "@/components/rust/WeeklyAssignment";

export const RUST_ASSIGNMENTS: Record<string, WeeklyAssignment> = {
  /* ─────────────────────────────────────────────────────────────── */
  "rust-welcome": {
    week: 1,
    title: "Say hello to Rust, the real way",
    estimatedTime: "20 minutes",
    scenario:
      "You just installed Rust. Time to make your first program actually yours — not a generic 'Hello, world!'. You'll create a new cargo project, introduce yourself in code, and confirm your toolchain works end to end.",
    learningGoals: ["`cargo new`", "`cargo run`", "`println!`", "multi-line output"],
    tasks: [
      "In a terminal, run `cargo new week1-hello` and `cd` into the new folder.",
      "Open `src/main.rs` and delete the default `Hello, world!` line.",
      "Print at least FOUR lines: your name, your city, one hobby, and one thing you hope to build in Rust.",
      "Run the program with `cargo run` and confirm all four lines appear.",
      "Add a `// comment` at the top of the file explaining what the program does.",
    ],
    sampleOutput: `Hi, I'm Kanel.
I live in Phnom Penh.
I love photography.
I want to build a fast CLI tool in Rust.`,
    solution: `// A quick introduction program. Week 1 assignment.
fn main() {
    println!("Hi, I'm Kanel.");
    println!("I live in Phnom Penh.");
    println!("I love photography.");
    println!("I want to build a fast CLI tool in Rust.");
}`,
    stretch: [
      "Add an ASCII-art banner above your intro using multi-line `println!`.",
      "Use `println!(\"{name}\")` interpolation with a `let name = ...;` on top.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-first-program": {
    week: 2,
    title: "Print your business card",
    estimatedTime: "30 minutes",
    scenario:
      "You want a Rust program that prints a properly formatted business card to the terminal — with borders, sections, and consistent spacing. This is your first exercise in using `println!` to shape text carefully.",
    learningGoals: ["`fn main`", "`println!` formatting", "escape characters", "comments"],
    tasks: [
      "Create a new project called `week2-card` with `cargo new`.",
      "Print a top border made of at least 40 `=` characters.",
      "Print your name on its own line, in ALL CAPS.",
      "Print a divider of `-` characters.",
      "Print three info lines: `Email:`, `City:`, and `Role:` — align the values so they line up.",
      "Print another `-` divider, then a `Skills:` header, then three bullet lines (`  • Rust`, etc.).",
      "Print a bottom border of `=` characters. Run it with `cargo run` and admire your card.",
    ],
    sampleOutput: `========================================
                KANEL SOENG
----------------------------------------
  Email:  soengkanel@gmail.com
  City:   Phnom Penh
  Role:   Founder, IDIC
----------------------------------------
  Skills:
    • Rust
    • Photography
    • Teaching
========================================`,
    solution: `fn main() {
    println!("========================================");
    println!("                KANEL SOENG");
    println!("----------------------------------------");
    println!("  Email:  soengkanel@gmail.com");
    println!("  City:   Phnom Penh");
    println!("  Role:   Founder, IDIC");
    println!("----------------------------------------");
    println!("  Skills:");
    println!("    • Rust");
    println!("    • Photography");
    println!("    • Teaching");
    println!("========================================");
}`,
    stretch: [
      "Put the values in `let` variables at the top of `main` and use `{}` interpolation.",
      "Try `\\n` inside a single `println!` to combine two lines.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-values": {
    week: 3,
    title: "Report card generator",
    estimatedTime: "45 minutes",
    scenario:
      "A teacher has five scores from a single class. Write a Rust program that reports each student's letter grade, tracks the running total, and announces whether the class as a whole passed (average ≥ 60).",
    learningGoals: [
      "`let` / `let mut`",
      "arrays & `for` loops",
      "`match` on number ranges",
      "`if` / `else`",
    ],
    tasks: [
      "Declare an array of five `i32` scores, e.g. `[92, 78, 65, 58, 84]`.",
      "Declare `let mut total = 0` — this will accumulate the sum.",
      "Use a `for score in scores.iter()` loop. Inside, use `match` with range patterns to turn each score into a letter grade (`A`, `B`, `C`, `D`, `F`).",
      "Inside the loop, add each score to `total` and print `\"Score {score} → grade {grade}\"`.",
      "After the loop, compute `let average = total / scores.len() as i32;` (or use `f64` if you prefer).",
      "Print the class average. Use an `if` to print `\"Class PASSED\"` or `\"Class FAILED\"` depending on whether the average is ≥ 60.",
    ],
    sampleOutput: `Score 92 -> grade A
Score 78 -> grade C
Score 65 -> grade D
Score 58 -> grade F
Score 84 -> grade B
Class average: 75
Class PASSED`,
    solution: `fn main() {
    let scores = [92, 78, 65, 58, 84];
    let mut total = 0;

    for score in scores.iter() {
        let grade = match score {
            90..=100 => "A",
            80..=89  => "B",
            70..=79  => "C",
            60..=69  => "D",
            _        => "F",
        };
        total += score;
        println!("Score {score} -> grade {grade}");
    }

    let average = total / scores.len() as i32;
    println!("Class average: {average}");

    if average >= 60 {
        println!("Class PASSED");
    } else {
        println!("Class FAILED");
    }
}`,
    stretch: [
      "Also print the highest score. (Hint: `let mut best = i32::MIN;` inside the loop.)",
      "Compute the average as `f64` so you get a decimal (`75.4` instead of `75`).",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-memory": {
    week: 4,
    title: "Where do things live?",
    estimatedTime: "30 minutes",
    scenario:
      "Rust doesn't hide memory from you — it just makes it safe. Write a small investigation program that PROVES which variables live on the stack vs. the heap by printing their sizes and memory addresses.",
    learningGoals: [
      "`std::mem::size_of_val`",
      "`{:p}` address formatting",
      "`Box<T>` and heap allocation",
      "the stack vs. the heap",
    ],
    tasks: [
      "Declare four values: `let n: i32 = 42;`, `let pi: f64 = 3.14;`, `let s: String = String::from(\"hi\");`, and `let b: Box<i32> = Box::new(100);`.",
      "For each variable, print its `size_of_val` in bytes.",
      "For each variable, print its address with `{:p}` (you need `&value` to pass a reference).",
      "Add a `//` comment next to each address line predicting whether it's on the stack or the heap.",
      "Run the program twice — notice how stack addresses change every run but relative distances stay small.",
    ],
    sampleOutput: `n:  size = 4 bytes,  addr = 0x7ffee5a1b8bc   // stack
pi: size = 8 bytes,  addr = 0x7ffee5a1b8b0   // stack
s:  size = 24 bytes, addr = 0x7ffee5a1b898   // struct on stack, chars on heap
b:  size = 8 bytes,  addr = 0x7ffee5a1b880   // pointer on stack, i32 on heap`,
    solution: `fn main() {
    let n: i32 = 42;
    let pi: f64 = 3.14;
    let s: String = String::from("hi");
    let b: Box<i32> = Box::new(100);

    println!("n:  size = {} bytes,  addr = {:p}",
        std::mem::size_of_val(&n), &n);
    println!("pi: size = {} bytes,  addr = {:p}",
        std::mem::size_of_val(&pi), &pi);
    println!("s:  size = {} bytes, addr = {:p}",
        std::mem::size_of_val(&s), &s);
    println!("b:  size = {} bytes,  addr = {:p}",
        std::mem::size_of_val(&b), &b);
}`,
    stretch: [
      "Add a `Vec<i32>` and observe that its size is 24 bytes — same as `String` (both are 3-word structs).",
      "Print the address of `*b` — the ACTUAL i32 on the heap. It should be far from the stack addresses.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-ownership": {
    week: 5,
    title: "Fix the broken library",
    estimatedTime: "45 minutes",
    scenario:
      "A junior developer wrote three helper functions that don't compile. Your job is to read the compiler errors and fix each one — deciding when to take ownership, when to borrow with `&`, when to borrow mutably with `&mut`, and when (rarely) to `.clone()`.",
    learningGoals: [
      "reading borrow-checker errors",
      "`&` vs `&mut` vs owned",
      "when to `.clone()` (spoiler: rarely)",
      "keeping the caller's ownership intact",
    ],
    tasks: [
      "Copy the starter code into `src/main.rs`. Try `cargo run` and read the errors CAREFULLY — the compiler will name each mistake.",
      "Fix `print_twice`: it should print the same String twice. Currently it takes ownership, so the second call fails. Change the signature so it borrows.",
      "Fix `append_exclaim`: it should ADD `!` to the end of the String in place. Change the signature so it takes a mutable borrow, and update the caller.",
      "Fix `first_word`: it should return the first word of a String without cloning. Change both the parameter and the return type so no data is copied.",
      "The final program must compile cleanly and produce the sample output.",
    ],
    starter: `fn print_twice(s: String) {
    println!("{s}");
    println!("{s}");
}

fn append_exclaim(s: String) {
    s.push_str("!");
}

fn first_word(s: String) -> String {
    let end = s.find(' ').unwrap_or(s.len());
    s[..end].to_string()
}

fn main() {
    let greeting = String::from("hello world");
    print_twice(greeting);
    print_twice(greeting);        // error: value used after move

    let mut msg = String::from("hi");
    append_exclaim(msg);
    println!("{msg}");            // error: value moved

    let sentence = String::from("Rust is great");
    let word = first_word(sentence);
    println!("first word = {word}");
}`,
    sampleOutput: `hello world
hello world
hello world
hello world
hi!
first word = Rust`,
    solution: `fn print_twice(s: &str) {
    println!("{s}");
    println!("{s}");
}

fn append_exclaim(s: &mut String) {
    s.push_str("!");
}

fn first_word(s: &str) -> &str {
    let end = s.find(' ').unwrap_or(s.len());
    &s[..end]
}

fn main() {
    let greeting = String::from("hello world");
    print_twice(&greeting);
    print_twice(&greeting);

    let mut msg = String::from("hi");
    append_exclaim(&mut msg);
    println!("{msg}");

    let sentence = String::from("Rust is great");
    let word = first_word(&sentence);
    println!("first word = {word}");
}`,
    stretch: [
      "Add a fourth broken function that returns a dangling reference — try it, watch the compiler refuse.",
      "Write the same program using only `.clone()` instead of borrows. Compare readability and note how much extra allocation happens.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-data": {
    week: 6,
    title: "Student record card",
    estimatedTime: "60 minutes",
    scenario:
      "Build a tiny student-management module. Each student has a name and age, and MAYBE a grade — some have been graded, others haven't. Use `struct`, `impl`, and `Option` to model the world honestly.",
    learningGoals: [
      "`struct` with fields",
      "`impl` blocks and methods",
      "`Option<T>` — `Some` vs `None`",
      "`match` on enum variants",
    ],
    tasks: [
      "Define `struct Student { name: String, age: u8, grade: Option<f64> }`.",
      "In an `impl Student` block, add `fn new(name: &str, age: u8) -> Student` — starts with `grade: None`.",
      "Add `fn set_grade(&mut self, score: f64)` — stores `Some(score)`.",
      "Add `fn describe(&self)` — uses `match self.grade { Some(g) => ..., None => ... }` to print either the grade or `\"not yet graded\"`.",
      "In `main`, create three students. Grade two of them, leave one ungraded. Call `describe()` on all three.",
    ],
    sampleOutput: `Kanel, 24 - not yet graded
Bora, 22 - graded 85.0
An, 19 - graded 72.5`,
    solution: `struct Student {
    name: String,
    age: u8,
    grade: Option<f64>,
}

impl Student {
    fn new(name: &str, age: u8) -> Student {
        Student {
            name: name.to_string(),
            age,
            grade: None,
        }
    }

    fn set_grade(&mut self, score: f64) {
        self.grade = Some(score);
    }

    fn describe(&self) {
        match self.grade {
            Some(g) => println!("{}, {} - graded {}", self.name, self.age, g),
            None    => println!("{}, {} - not yet graded", self.name, self.age),
        }
    }
}

fn main() {
    let kanel = Student::new("Kanel", 24);
    let mut bora = Student::new("Bora", 22);
    bora.set_grade(85.0);
    let mut an = Student::new("An", 19);
    an.set_grade(72.5);

    kanel.describe();
    bora.describe();
    an.describe();
}`,
    stretch: [
      "Add a method `letter_grade(&self) -> Option<char>` that maps a `Some(score)` to `Some('A')`, `Some('B')`, etc., and `None` to `None`.",
      "Put students in a `Vec<Student>` and loop through with a single `for s in &students { s.describe(); }`.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-collections": {
    week: 7,
    title: "Word frequency counter",
    estimatedTime: "60 minutes",
    scenario:
      "Given a paragraph of text, count how many times each word appears. This is a real building block — search engines, spam filters, and NLP pipelines all start here.",
    learningGoals: [
      "`Vec<T>` and iteration",
      "`HashMap<K, V>` with `entry().or_insert()`",
      "iterator chains: `split → filter → count`",
      "finding the max with `.iter().max_by_key(...)`",
    ],
    tasks: [
      "Given the sentence `\"the quick brown fox jumps over the lazy dog the fox is quick\"`, split it into words with `.split(' ')`.",
      "Build a `HashMap<&str, i32>` — for each word, increment its count. Hint: `*counts.entry(word).or_insert(0) += 1;`.",
      "Print the total number of words.",
      "Print each unique word and its count.",
      "Find and print the most-frequent word using `.iter().max_by_key(|(_, count)| *count)`.",
    ],
    sampleOutput: `Total words: 12
brown: 1
dog: 1
fox: 2
is: 1
jumps: 1
lazy: 1
over: 1
quick: 2
the: 3
Most frequent: "the" (3 times)`,
    solution: `use std::collections::HashMap;

fn main() {
    let sentence = "the quick brown fox jumps over the lazy dog the fox is quick";
    let words: Vec<&str> = sentence.split(' ').collect();

    let mut counts: HashMap<&str, i32> = HashMap::new();
    for word in &words {
        *counts.entry(*word).or_insert(0) += 1;
    }

    println!("Total words: {}", words.len());

    let mut pairs: Vec<(&&str, &i32)> = counts.iter().collect();
    pairs.sort_by_key(|(w, _)| *w);
    for (word, count) in &pairs {
        println!("{word}: {count}");
    }

    if let Some((word, count)) = counts.iter().max_by_key(|(_, c)| *c) {
        println!("Most frequent: \\"{word}\\" ({count} times)");
    }
}`,
    stretch: [
      "Read the sentence from standard input instead of hard-coding it. (Hint: `std::io::stdin().read_line(&mut buf)`.)",
      "Print only words that appear MORE than once.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-traits": {
    week: 8,
    title: "Shape gallery with traits",
    estimatedTime: "60 minutes",
    scenario:
      "Define a `Shape` trait, implement it for three different structs, then write ONE generic function that works with all of them. This is the pattern behind most reusable Rust libraries.",
    learningGoals: [
      "declaring a trait",
      "`impl Trait for Type` for multiple types",
      "generics with trait bounds (`<S: Shape>`)",
      "`#[derive(Debug)]` and `{:?}` printing",
    ],
    tasks: [
      "Define `trait Shape { fn area(&self) -> f64; fn name(&self) -> &str; }`.",
      "Define three structs: `Circle { radius: f64 }`, `Rectangle { width: f64, height: f64 }`, `Triangle { base: f64, height: f64 }`. Add `#[derive(Debug)]` to each.",
      "Implement `Shape` for each struct. Circle area = π·r² (use `std::f64::consts::PI`), triangle area = 0.5·base·height.",
      "Write a generic function `fn describe<S: Shape>(s: &S) { println!(\"{} has area {:.2}\", s.name(), s.area()); }`.",
      "In `main`, create one of each shape and call `describe(&shape)` for all three.",
    ],
    sampleOutput: `Circle has area 78.54
Rectangle has area 24.00
Triangle has area 10.00`,
    solution: `use std::f64::consts::PI;

trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> &str;
}

#[derive(Debug)]
struct Circle { radius: f64 }

#[derive(Debug)]
struct Rectangle { width: f64, height: f64 }

#[derive(Debug)]
struct Triangle { base: f64, height: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 { PI * self.radius * self.radius }
    fn name(&self) -> &str { "Circle" }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 { self.width * self.height }
    fn name(&self) -> &str { "Rectangle" }
}

impl Shape for Triangle {
    fn area(&self) -> f64 { 0.5 * self.base * self.height }
    fn name(&self) -> &str { "Triangle" }
}

fn describe<S: Shape>(s: &S) {
    println!("{} has area {:.2}", s.name(), s.area());
}

fn main() {
    let c = Circle { radius: 5.0 };
    let r = Rectangle { width: 6.0, height: 4.0 };
    let t = Triangle { base: 5.0, height: 4.0 };

    describe(&c);
    describe(&r);
    describe(&t);
}`,
    stretch: [
      "Put the shapes in a `Vec<Box<dyn Shape>>` and loop through them — dynamic dispatch instead of generics.",
      "Add `fn perimeter(&self) -> f64` to the trait and implement it everywhere.",
    ],
  },

  /* ─────────────────────────────────────────────────────────────── */
  "rust-project": {
    week: 9,
    title: "Command-line to-do list",
    estimatedTime: "90 minutes",
    scenario:
      "Put it all together and build a small but REAL command-line to-do app. It reads and writes a plain text file, so your tasks survive restarts. This is the graduation project — collections, ownership, error handling, and file I/O in one program.",
    learningGoals: [
      "reading command-line args with `std::env::args`",
      "reading & writing files with `std::fs`",
      "`Vec<String>`, `enumerate`, `for`",
      "handling errors with `Result` and `?`",
    ],
    tasks: [
      "Read all lines from `todos.txt` into a `Vec<String>`. If the file doesn't exist, start with an empty vec — don't crash.",
      "Read the command from `std::env::args().nth(1)`.",
      "If the command is `list`, print each task numbered starting at 1.",
      "If the command is `add`, take the rest of the args, join them with spaces, and append to the vec. Then save the file.",
      "If the command is `done`, take the next arg as a number `n`, and prefix task #n with `\"[x] \"`. Save.",
      "If the command is anything else (or missing), print a short usage message.",
    ],
    sampleOutput: `$ cargo run -- add Buy milk
Added: Buy milk

$ cargo run -- add Call Mom
Added: Call Mom

$ cargo run -- list
1. Buy milk
2. Call Mom

$ cargo run -- done 1
Marked done: Buy milk

$ cargo run -- list
1. [x] Buy milk
2. Call Mom`,
    solution: `use std::env;
use std::fs;

const FILE: &str = "todos.txt";

fn load() -> Vec<String> {
    match fs::read_to_string(FILE) {
        Ok(text) => text.lines().map(|l| l.to_string()).collect(),
        Err(_)   => Vec::new(),   // file doesn't exist yet
    }
}

fn save(todos: &[String]) {
    let contents = todos.join("\\n");
    fs::write(FILE, contents).expect("failed to write todos.txt");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut todos = load();

    let cmd = args.get(1).map(|s| s.as_str()).unwrap_or("help");

    match cmd {
        "list" => {
            if todos.is_empty() {
                println!("No tasks yet. Try: cargo run -- add Buy milk");
            }
            for (i, t) in todos.iter().enumerate() {
                println!("{}. {}", i + 1, t);
            }
        }
        "add" => {
            let task = args[2..].join(" ");
            println!("Added: {task}");
            todos.push(task);
            save(&todos);
        }
        "done" => {
            let n: usize = args[2].parse().expect("done needs a number");
            let idx = n - 1;
            if idx < todos.len() && !todos[idx].starts_with("[x] ") {
                todos[idx] = format!("[x] {}", todos[idx]);
                println!("Marked done: {}", &todos[idx][4..]);
                save(&todos);
            }
        }
        _ => {
            println!("Usage:");
            println!("  cargo run -- list");
            println!("  cargo run -- add <task words>");
            println!("  cargo run -- done <n>");
        }
    }
}`,
    stretch: [
      "Add a `remove <n>` command that deletes task n.",
      "Write a unit test for `load()` when the file doesn't exist. (Add a `#[cfg(test)] mod tests` block.)",
      "Add colours: print `[x]` tasks in green and unfinished tasks in white using ANSI escape codes.",
    ],
  },
};
