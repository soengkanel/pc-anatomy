// Coding challenges per chapter. Each challenge asks the student to write
// code — starter code has `// TODO` markers, and the solution is hidden
// until they click "Show solution".

import type { Challenge } from "@/components/rust/CodingChallenge";

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome. Just one warm-up: get everything running.
 * ────────────────────────────────────────────────────────────── */

const WELCOME_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 1.1",
    title: "Say hello to yourself",
    difficulty: "easy",
    prompt:
      "Modify the program below to print a greeting with YOUR OWN name on one line, then your favourite programming language on the next.",
    requirements: [
      "Use two separate `println!` calls",
      "The output must be exactly two lines",
    ],
    starter: `fn main() {
    // TODO: replace with your name
    println!("Hi, my name is ___.");
    // TODO: print your favourite language
}`,
    sampleOutput: `Hi, my name is Kanel.
My favourite language is Rust.`,
    solution: `fn main() {
    println!("Hi, my name is Kanel.");
    println!("My favourite language is Rust.");
}`,
    hint: "Just replace the ___ with your real name and add a second `println!(\"...\");` line.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — First Program.
 * ────────────────────────────────────────────────────────────── */

const FIRST_PROGRAM_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 2.1",
    title: "Personal profile",
    difficulty: "easy",
    prompt:
      "Print a small personal profile on 3 lines: name, age, and favourite subject. Use string interpolation with `{name}` style — not string concatenation.",
    requirements: [
      "3 `println!` calls",
      "Variables: `name`, `age`, `subject`",
      "Use `{variable}` interpolation, not `+` or format strings with args",
    ],
    starter: `fn main() {
    // TODO: create three variables
    // TODO: print them out with {variable} interpolation
}`,
    sampleOutput: `Name: Kanel
Age: 24
Favourite subject: Rust`,
    solution: `fn main() {
    let name = "Kanel";
    let age = 24;
    let subject = "Rust";

    println!("Name: {name}");
    println!("Age: {age}");
    println!("Favourite subject: {subject}");
}`,
    hint: "Inside a string literal, `{name}` becomes the value of the variable named `name`. This is the modern (Rust 2021+) way.",
  },
  {
    number: "Challenge 2.2",
    title: "Fix the compiler error",
    difficulty: "easy",
    prompt:
      "This program does not compile. Read the error the compiler will give you, then fix the code so it prints `Total: 30`.",
    requirements: [
      "Only touch line 3 — the `let total = ...` line",
      "The final output must be exactly `Total: 30`",
    ],
    starter: `fn main() {
    let apples = 12
    let oranges = 18
    let total = apples + oranges
    println!("Total: {total}");
}`,
    sampleOutput: `Total: 30`,
    solution: `fn main() {
    let apples = 12;
    let oranges = 18;
    let total = apples + oranges;
    println!("Total: {total}");
}`,
    hint: "Every statement in Rust ends with a semicolon `;`. Three statements are missing theirs.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Values & Flow.
 * ────────────────────────────────────────────────────────────── */

const VALUES_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 3.1",
    title: "Celsius to Fahrenheit",
    difficulty: "easy",
    prompt:
      "Convert a temperature from Celsius to Fahrenheit using the formula `F = C * 9/5 + 32`, then print the result.",
    requirements: [
      "Store 30.0 in a variable called `celsius`",
      "Compute `fahrenheit` from it",
      "Print in the form `30 °C = 86 °F`",
    ],
    starter: `fn main() {
    let celsius: f64 = 30.0;
    // TODO: compute fahrenheit
    // TODO: print like "30 °C = 86 °F"
}`,
    sampleOutput: `30 °C = 86 °F`,
    solution: `fn main() {
    let celsius: f64 = 30.0;
    let fahrenheit = celsius * 9.0 / 5.0 + 32.0;
    println!("{celsius} °C = {fahrenheit} °F");
}`,
    hint: "Use `f64` numbers throughout (e.g. `9.0` not `9`) so the compiler doesn't complain about mixing int and float.",
  },
  {
    number: "Challenge 3.2",
    title: "Even or odd?",
    difficulty: "easy",
    prompt:
      "Given a number, print `\"even\"` or `\"odd\"` using an `if` expression. Test with several values.",
    requirements: [
      "Use `if/else` as an expression (returns a value)",
      "Store the result in a `let` binding, then print it",
    ],
    starter: `fn describe(n: i32) -> &'static str {
    // TODO: return "even" or "odd"
}

fn main() {
    for n in [2, 7, 100, 15] {
        println!("{n} is {}", describe(n));
    }
}`,
    sampleOutput: `2 is even
7 is odd
100 is even
15 is odd`,
    solution: `fn describe(n: i32) -> &'static str {
    if n % 2 == 0 { "even" } else { "odd" }
}

fn main() {
    for n in [2, 7, 100, 15] {
        println!("{n} is {}", describe(n));
    }
}`,
    hint: "In Rust, `if` is an expression — the last thing inside the `{ }` is what the branch returns. No `return` needed here.",
  },
  {
    number: "Challenge 3.3",
    title: "FizzBuzz",
    difficulty: "medium",
    prompt:
      "Print numbers 1 to 15, but replace multiples of 3 with `Fizz`, multiples of 5 with `Buzz`, and multiples of both with `FizzBuzz`.",
    requirements: [
      "Use a `for` loop with the range 1..=15",
      "Use `match` (not just `if`) — cleaner Rust style",
    ],
    starter: `fn main() {
    for n in 1..=15 {
        // TODO: print n, or "Fizz", "Buzz", or "FizzBuzz"
    }
}`,
    sampleOutput: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz`,
    solution: `fn main() {
    for n in 1..=15 {
        match (n % 3, n % 5) {
            (0, 0) => println!("FizzBuzz"),
            (0, _) => println!("Fizz"),
            (_, 0) => println!("Buzz"),
            _      => println!("{n}"),
        }
    }
}`,
    hint: "The trick: `match` on the TUPLE `(n % 3, n % 5)`. Each arm covers one case; `_` means 'anything'.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Memory & Pointers.
 * ────────────────────────────────────────────────────────────── */

const MEMORY_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 4.1",
    title: "Peek at an address",
    difficulty: "easy",
    prompt:
      "Print the memory address of a variable using the `{:p}` format specifier. Watch the address change each time you run — that&rsquo;s the OS placing your program in different memory each run.",
    requirements: [
      "Use `{:p}` in a println!",
      "Print the value AND the address of an i32",
    ],
    starter: `fn main() {
    let x: i32 = 42;
    // TODO: print x and its address using {:p}
    // Hint: {:p} needs a reference, so pass &x
}`,
    sampleOutput: `x = 42 lives at 0x7ffee4a3c2fc     (yours will differ)`,
    solution: `fn main() {
    let x: i32 = 42;
    println!("x = {} lives at {:p}", x, &x);
}`,
    hint: "`{:p}` expects a pointer (a reference in Rust). Pass `&x`, not `x`.",
  },
  {
    number: "Challenge 4.2",
    title: "Box a value on the heap",
    difficulty: "easy",
    prompt:
      "Put an i32 on the heap using `Box::new`. Then dereference it with `*` to read the value back.",
    requirements: [
      "Use `Box::new(...)` to allocate on the heap",
      "Dereference with `*` to get the number back",
      "Print both the Box (which shows the value) AND the dereferenced value",
    ],
    starter: `fn main() {
    let b = Box::new(5);
    // TODO: print b directly and print *b
}`,
    sampleOutput: `b  = 5
*b = 5`,
    solution: `fn main() {
    let b = Box::new(5);
    println!("b  = {}", b);
    println!("*b = {}", *b);
}`,
    hint: "`Box<T>` implements Display for T's Display, so `println!(\"{}\", b)` works. But `*b` explicitly follows the pointer.",
  },
  {
    number: "Challenge 4.3",
    title: "Share ownership with Rc",
    difficulty: "medium",
    prompt:
      "Wrap a String in `Rc` (reference counted). Clone the Rc twice, print the count, then drop one and print the count again.",
    requirements: [
      "Use `Rc::new` to wrap the String",
      "Use `Rc::clone(&a)` to make additional owners",
      "Print `Rc::strong_count(&a)` before and after a drop",
    ],
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    // TODO: make two more owners: b and c
    // TODO: print the strong count (should be 3)

    // TODO: drop c
    // TODO: print the strong count again (should be 2)
}`,
    sampleOutput: `count = 3
count = 2`,
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a);
    let c = Rc::clone(&a);
    println!("count = {}", Rc::strong_count(&a));

    let _ = b;   // keep b alive; explicit drop for c below
    drop(c);
    println!("count = {}", Rc::strong_count(&a));
}`,
    hint: "`Rc::clone(&a)` is CHEAP — it just bumps the count. It does NOT copy the underlying String.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Ownership. Extra care — this is where students learn.
 * ────────────────────────────────────────────────────────────── */

const OWNERSHIP_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 5.1",
    title: "Explain the error",
    difficulty: "easy",
    prompt:
      "This program will not compile. Write down (in a comment) WHY it fails, then change ONE thing to make it compile — and print `Hello, Kanel! Hello, Kanel!`.",
    requirements: [
      "Add a comment on line 2 explaining the error",
      "Change only one small thing to fix it (do NOT add clone unless you must!)",
    ],
    starter: `fn main() {
    // TODO: explain the error here in a comment
    let name = String::from("Kanel");
    let copy = name;
    println!("Hello, {name}!");
    println!("Hello, {copy}!");
}`,
    sampleOutput: `Hello, Kanel! Hello, Kanel!`,
    solution: `fn main() {
    // \`let copy = name;\` MOVES ownership from name → copy.
    // After that, name is no longer usable — so the first println! fails.
    // Fix: borrow instead of move by using &name (a reference), or clone.
    let name = String::from("Kanel");
    let copy = &name;                       // borrow, don't move
    println!("Hello, {name}! Hello, {copy}!");
}`,
    hint: "Adding an `&` in the right place turns a MOVE into a BORROW. The original stays usable.",
  },
  {
    number: "Challenge 5.2",
    title: "Write a length function",
    difficulty: "medium",
    prompt:
      "Write a function `length` that takes a string by REFERENCE and returns its length. The caller must still own the String after the call.",
    requirements: [
      "Signature: `fn length(s: &str) -> usize`",
      "Do NOT use `.clone()`",
      "The main function must print both the length AND the original string",
    ],
    starter: `// TODO: define fn length(...) -> usize

fn main() {
    let msg = String::from("Rustaceans");
    let n = length(&msg);
    println!("length = {n}");
    println!("message = {msg}");   // this line must still work!
}`,
    sampleOutput: `length = 10
message = Rustaceans`,
    solution: `fn length(s: &str) -> usize {
    s.len()
}

fn main() {
    let msg = String::from("Rustaceans");
    let n = length(&msg);
    println!("length = {n}");
    println!("message = {msg}");
}`,
    hint: "Take `&str` (not `&String`) — it's the idiomatic borrow for read-only text and also accepts string literals. Rust auto-converts `&String` to `&str` at the call site. If you took `String` (no ampersand), `msg` would be moved and the last print would fail.",
  },
  {
    number: "Challenge 5.3",
    title: "Append through a mutable reference",
    difficulty: "medium",
    prompt:
      "Write a function `add_smiley` that takes a mutable reference to a String and appends a smiley 😊 to it. Then use it to grow a greeting.",
    requirements: [
      "Signature: `fn add_smiley(s: &mut String)`",
      "The main function must declare its String with `let mut`",
      "Call the function TWICE and print the final result",
    ],
    starter: `// TODO: fn add_smiley(...)

fn main() {
    let mut greeting = String::from("Hi");
    // TODO: call add_smiley twice
    println!("{greeting}");
}`,
    sampleOutput: `Hi😊😊`,
    solution: `fn add_smiley(s: &mut String) {
    s.push('😊');
}

fn main() {
    let mut greeting = String::from("Hi");
    add_smiley(&mut greeting);
    add_smiley(&mut greeting);
    println!("{greeting}");
}`,
    hint: "Two `mut` are needed: `let mut greeting` on the variable AND `&mut greeting` at the call site. Both locks must be open.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Shaping Data.
 * ────────────────────────────────────────────────────────────── */

const DATA_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 6.1",
    title: "Model a Book",
    difficulty: "easy",
    prompt:
      "Define a `Book` struct with `title` (String), `author` (String), and `pages` (u32). Create one and print it in the form `\"1984\" by George Orwell (328 pages)`.",
    requirements: [
      "Define the `Book` struct",
      "Create an instance for `1984` by George Orwell, 328 pages",
      "Print in the exact format above",
    ],
    starter: `// TODO: define struct Book

fn main() {
    // TODO: create one Book
    // TODO: print it in the required format
}`,
    sampleOutput: `"1984" by George Orwell (328 pages)`,
    solution: `struct Book {
    title: String,
    author: String,
    pages: u32,
}

fn main() {
    let book = Book {
        title: String::from("1984"),
        author: String::from("George Orwell"),
        pages: 328,
    };
    println!("\\"{}\\" by {} ({} pages)", book.title, book.author, book.pages);
}`,
    hint: "To print a literal `\"` inside a string, escape it: `\\\"`. Field access uses `book.title`.",
  },
  {
    number: "Challenge 6.2",
    title: "Shape area with enum + match",
    difficulty: "medium",
    prompt:
      "Define an enum `Shape` with variants `Circle(f64)` (holding radius) and `Square(f64)` (holding side). Write a function `area` that returns the area using `match`.",
    requirements: [
      "Variants carry their data: `Circle(f64)`, `Square(f64)`",
      "`area(&Shape) -> f64`",
      "π ≈ 3.14159",
    ],
    starter: `// TODO: define enum Shape

fn area(s: &Shape) -> f64 {
    // TODO: match on s
}

fn main() {
    let c = Shape::Circle(2.0);
    let s = Shape::Square(3.0);
    println!("circle: {:.2}", area(&c));
    println!("square: {:.2}", area(&s));
}`,
    sampleOutput: `circle: 12.57
square: 9.00`,
    solution: `enum Shape {
    Circle(f64),
    Square(f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Square(side) => side * side,
    }
}

fn main() {
    let c = Shape::Circle(2.0);
    let s = Shape::Square(3.0);
    println!("circle: {:.2}", area(&c));
    println!("square: {:.2}", area(&s));
}`,
    hint: "In the match arms, `Shape::Circle(r)` DESTRUCTURES — it pulls the inner `f64` out and names it `r`.",
  },
  {
    number: "Challenge 6.3",
    title: "Safe parse",
    difficulty: "medium",
    prompt:
      "Write a function `to_number` that takes a `&str` and returns an `Option<i32>`: `Some(n)` if it parses as an integer, `None` otherwise.",
    requirements: [
      "Use `.parse::<i32>()` — it returns a `Result`",
      "Convert Result → Option (use `.ok()`)",
      "In main, test with `\"42\"` and `\"hello\"`",
    ],
    starter: `fn to_number(s: &str) -> Option<i32> {
    // TODO
}

fn main() {
    println!("{:?}", to_number("42"));
    println!("{:?}", to_number("hello"));
}`,
    sampleOutput: `Some(42)
None`,
    solution: `fn to_number(s: &str) -> Option<i32> {
    s.parse::<i32>().ok()
}

fn main() {
    println!("{:?}", to_number("42"));
    println!("{:?}", to_number("hello"));
}`,
    hint: "`.ok()` is a handy method on `Result` that throws away the error and gives you `Some(v)` on success or `None` on failure.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Collections.
 * ────────────────────────────────────────────────────────────── */

const COLLECTIONS_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 7.1",
    title: "Sum of squares",
    difficulty: "easy",
    prompt:
      "Given the numbers 1..=5, compute the sum of their squares (1 + 4 + 9 + 16 + 25 = 55) using iterator chaining.",
    requirements: [
      "Use `.iter()` / `.map()` / `.sum()`",
      "No explicit `for` loop",
    ],
    starter: `fn main() {
    let nums = [1, 2, 3, 4, 5];
    // TODO: compute the sum of squares using iterators
    // let total: i32 = ...
    // println!("total = {total}");
}`,
    sampleOutput: `total = 55`,
    solution: `fn main() {
    let nums = [1, 2, 3, 4, 5];
    let total: i32 = nums.iter().map(|x| x * x).sum();
    println!("total = {total}");
}`,
    hint: "The chain reads left-to-right: iterate → transform each → collapse to one total. `.map(|x| x * x)` squares each element.",
  },
  {
    number: "Challenge 7.2",
    title: "Filter and collect",
    difficulty: "medium",
    prompt:
      "From the given list of names, keep only those with 5 or fewer letters and collect them into a new `Vec<&str>`.",
    requirements: [
      "Use `.filter()` and `.collect()`",
      "Do not mutate the original vec",
    ],
    starter: `fn main() {
    let names = vec!["Kanel", "Chanthou", "Bora", "Sopheak", "An"];
    // TODO: keep names with len() <= 5
    // let short: Vec<&str> = ...
    // println!("{:?}", short);
}`,
    sampleOutput: `["Kanel", "Bora", "An"]`,
    solution: `fn main() {
    let names = vec!["Kanel", "Chanthou", "Bora", "Sopheak", "An"];
    let short: Vec<&str> = names.iter().copied().filter(|n| n.len() <= 5).collect();
    println!("{:?}", short);
}`,
    hint: "`.iter()` gives `&&str`; `.copied()` unwraps one layer so you get `&str`. That way the final collection is `Vec<&str>` — the type you'd naturally expect.",
  },
  {
    number: "Challenge 7.3",
    title: "Word count",
    difficulty: "hard",
    prompt:
      "Count how many times each word appears in the sentence `\"one two two three three three\"`. Use a `HashMap<&str, i32>`.",
    requirements: [
      "Split on spaces with `.split(' ')`",
      "Use `HashMap` — increment the count for each word",
      "Print each word and its count",
    ],
    starter: `use std::collections::HashMap;

fn main() {
    let sentence = "one two two three three three";
    // TODO: build a HashMap<&str, i32> of counts
    // TODO: print each entry
}`,
    sampleOutput: `one: 1
two: 2
three: 3    (order may vary — HashMap is unordered)`,
    solution: `use std::collections::HashMap;

fn main() {
    let sentence = "one two two three three three";
    let mut counts: HashMap<&str, i32> = HashMap::new();

    for word in sentence.split(' ') {
        *counts.entry(word).or_insert(0) += 1;
    }

    for (word, n) in &counts {
        println!("{word}: {n}");
    }
}`,
    hint: "`counts.entry(word).or_insert(0)` gives you a mutable reference to the count — either the existing one, or a new 0. The `*` dereferences to add 1.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Traits & Modules.
 * ────────────────────────────────────────────────────────────── */

const TRAITS_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 8.1",
    title: "Speak trait",
    difficulty: "medium",
    prompt:
      "Define a trait `Speak` with one method `speak(&self) -> String`. Implement it for `Dog` and `Cat` structs. In main, put both animals in a Vec and call speak on each.",
    requirements: [
      "One trait with method `speak(&self) -> String`",
      "Two structs: `Dog` and `Cat`",
      "Store trait objects in a `Vec<Box<dyn Speak>>` to loop over them",
    ],
    starter: `trait Speak {
    // TODO: fn speak(...) -> String;
}

struct Dog;
struct Cat;

// TODO: impl Speak for Dog
// TODO: impl Speak for Cat

fn main() {
    let animals: Vec<Box<dyn Speak>> = vec![
        Box::new(Dog),
        Box::new(Cat),
    ];
    for a in &animals {
        println!("{}", a.speak());
    }
}`,
    sampleOutput: `Woof!
Meow!`,
    solution: `trait Speak {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

impl Speak for Dog {
    fn speak(&self) -> String { String::from("Woof!") }
}

impl Speak for Cat {
    fn speak(&self) -> String { String::from("Meow!") }
}

fn main() {
    let animals: Vec<Box<dyn Speak>> = vec![
        Box::new(Dog),
        Box::new(Cat),
    ];
    for a in &animals {
        println!("{}", a.speak());
    }
}`,
    hint: "`Box<dyn Speak>` is a heap-allocated trait object — it lets you store DIFFERENT concrete types (Dog, Cat) in the SAME Vec.",
  },
  {
    number: "Challenge 8.2",
    title: "Generic max",
    difficulty: "medium",
    prompt:
      "Write a generic function `max_of` that takes a slice and returns a reference to the largest element. It should work for numbers AND strings.",
    requirements: [
      "Signature: `fn max_of<T: PartialOrd>(items: &[T]) -> &T`",
      "Iterate over the slice; keep track of the current max",
      "Test it with an i32 slice AND a &str slice",
    ],
    starter: `fn max_of<T: PartialOrd>(items: &[T]) -> &T {
    // TODO
}

fn main() {
    let nums = [3, 7, 2, 9, 5];
    let words = ["cat", "banana", "apple"];
    println!("max num  = {}", max_of(&nums));
    println!("max word = {}", max_of(&words));
}`,
    sampleOutput: `max num  = 9
max word = cat`,
    solution: `fn max_of<T: PartialOrd>(items: &[T]) -> &T {
    let mut best = &items[0];
    for item in &items[1..] {
        if item > best {
            best = item;
        }
    }
    best
}

fn main() {
    let nums = [3, 7, 2, 9, 5];
    let words = ["cat", "banana", "apple"];
    println!("max num  = {}", max_of(&nums));
    println!("max word = {}", max_of(&words));
}`,
    hint: "The `PartialOrd` bound lets Rust use `>` on the values. For strings, `>` compares them alphabetically.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Chapter 9 — Build Real. Real projects, real problems.
 * ────────────────────────────────────────────────────────────── */

const PROJECT_CHALLENGES: Challenge[] = [
  {
    number: "Challenge 9.1",
    title: "Echo the args",
    difficulty: "easy",
    prompt:
      "Read every command-line argument (except the program name) and print each one on its own line, prefixed with its 1-based index.",
    requirements: [
      "Skip args[0] — that's the program itself",
      "Use `.enumerate()` for numbering",
    ],
    starter: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    // TODO: print each user arg with its 1-based index
}`,
    sampleOutput: `# run:  cargo run -- hello world rust
1: hello
2: world
3: rust`,
    solution: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    for (i, a) in args.iter().skip(1).enumerate() {
        println!("{}: {}", i + 1, a);
    }
}`,
    hint: "`.skip(1)` throws away the first item (the program path). `.enumerate()` pairs each item with its 0-based index — add 1 for 1-based.",
  },
  {
    number: "Challenge 9.2",
    title: "Read → transform → write",
    difficulty: "medium",
    prompt:
      "Write a program that reads `input.txt`, uppercases the whole contents, and writes it back to `output.txt`.",
    requirements: [
      "Use `fs::read_to_string` and `fs::write`",
      "Use `.to_uppercase()` on the String",
      "Return `std::io::Result<()>` from main so you can use `?`",
    ],
    starter: `use std::fs;

fn main() -> std::io::Result<()> {
    // TODO: read input.txt
    // TODO: uppercase it
    // TODO: write to output.txt
    Ok(())
}`,
    sampleOutput: `# (no console output — check output.txt)
# input.txt: "hello, rust!"
# output.txt: "HELLO, RUST!"`,
    solution: `use std::fs;

fn main() -> std::io::Result<()> {
    let input = fs::read_to_string("input.txt")?;
    let upper = input.to_uppercase();
    fs::write("output.txt", upper)?;
    Ok(())
}`,
    hint: "The `?` operator does the heavy lifting: on error, it returns early. On success, it hands you the unwrapped value.",
  },
  {
    number: "Challenge 9.3",
    title: "Write a test",
    difficulty: "medium",
    prompt:
      "Given the function `add(a, b)`, write TWO tests: one that checks 2 + 2 = 4, and one that checks -1 + 1 = 0. Then `cargo test`.",
    requirements: [
      "Two functions marked with `#[test]`",
      "Use `assert_eq!(expected, actual)`",
      "The tests must PASS",
    ],
    starter: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

// TODO: #[test] fn two_plus_two() { ... }
// TODO: #[test] fn negatives_cancel() { ... }`,
    sampleOutput: `running 2 tests
test negatives_cancel ... ok
test two_plus_two ... ok

test result: ok. 2 passed; 0 failed`,
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn two_plus_two() {
    assert_eq!(add(2, 2), 4);
}

#[test]
fn negatives_cancel() {
    assert_eq!(add(-1, 1), 0);
}`,
    hint: "`assert_eq!(a, b)` panics with a nice message if `a != b`. Run `cargo test` (not `cargo run`) to execute tests.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * Master export — keyed like RUST_LESSONS so the page can pick per-chapter.
 * ────────────────────────────────────────────────────────────── */

export const RUST_CHALLENGES: Record<string, Challenge[]> = {
  "rust-welcome": WELCOME_CHALLENGES,
  "rust-first-program": FIRST_PROGRAM_CHALLENGES,
  "rust-values": VALUES_CHALLENGES,
  "rust-memory": MEMORY_CHALLENGES,
  "rust-ownership": OWNERSHIP_CHALLENGES,
  "rust-data": DATA_CHALLENGES,
  "rust-collections": COLLECTIONS_CHALLENGES,
  "rust-traits": TRAITS_CHALLENGES,
  "rust-project": PROJECT_CHALLENGES,
};
