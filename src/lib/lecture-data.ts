// Lesson content: bilingual (English–Khmer) key terms with teachable detail,
// plus 20-question quizzes per lesson.
// Data-only (no React). Consumed by LessonPack.tsx and quiz-pdf.ts.

export type Term = {
  en: string;
  km: string;
  /** Visual emoji shown in the term card and the modal. */
  icon: string;
  /** One or two teachable sentences the professor can read aloud. */
  detail: string;
};

export type QuizQuestion = {
  q: string;
  options: [string, string, string, string];
  /** Index (0-3) of the correct option. */
  answer: 0 | 1 | 2 | 3;
};

export type Lesson = {
  chapterNumber: string;
  chapterTitle: string;
  chapterTitleKm: string;
  terms: Term[];
  quiz: QuizQuestion[];
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome & Introduction
 * ────────────────────────────────────────────────────────────── */

const WELCOME: Lesson = {
  chapterNumber: "1",
  chapterTitle: "Welcome & Introduction",
  chapterTitleKm: "សូមស្វាគមន៍ និង សេចក្តីផ្តើម",
  terms: [
    { en: "Information Technology (IT)", km: "បច្ចេកវិទ្យាព័ត៌មាន", icon: "💡", detail: "Everything that uses computers and networks to store, send, or work with information." },
    { en: "Computer", km: "កុំព្យូទ័រ", icon: "💻", detail: "A machine that follows instructions to take input, do work, and give back an answer." },
    { en: "Hardware", km: "ផ្នែករឹង", icon: "⚙️", detail: "The parts of a computer you can TOUCH — CPU, screen, keyboard, mouse, cables." },
    { en: "Software", km: "ផ្នែកទន់", icon: "🪄", detail: "The instructions a computer follows — apps, games, operating systems, websites." },
    { en: "Data", km: "ទិន្នន័យ", icon: "🔢", detail: "Raw facts and numbers a computer works with — like 42, or the letter 'A'." },
    { en: "Information", km: "ព័ត៌មាន", icon: "📖", detail: "Data organised so it makes sense — like 'It is 42°C in Phnom Penh today.'" },
    { en: "User", km: "អ្នកប្រើប្រាស់", icon: "🙋", detail: "That's YOU — the person using the computer." },
    { en: "Digital", km: "ឌីជីថល", icon: "🔟", detail: "Made of 0s and 1s. Computers only truly understand these two numbers." },
    { en: "Input", km: "ធាតុចូល", icon: "⌨️", detail: "What you send TO the computer — typing, clicking, tapping, speaking." },
    { en: "Output", km: "ធាតុចេញ", icon: "🖨️", detail: "What the computer gives BACK — pictures on screen, sound, printed paper." },
    { en: "Program", km: "កម្មវិធី", icon: "📦", detail: "A set of instructions that tells the computer what to do." },
    { en: "Internet", km: "អ៊ីនធឺណិត", icon: "🌐", detail: "A giant global network connecting billions of computers together." },
  ],
  quiz: [
    { q: "IT stands for?", options: ["Internet Tech", "Information Technology", "Ideal Testing", "Input Terminal"], answer: 1 },
    { q: "A computer is a machine that?", options: ["Only shows videos", "Follows instructions on data", "Reads minds", "Grows food"], answer: 1 },
    { q: "Hardware is?", options: ["Something you touch", "Something you only imagine", "Just Wi-Fi", "A type of tea"], answer: 0 },
    { q: "Software is?", options: ["Plastic parts", "Instructions the computer follows", "Only cables", "A screen"], answer: 1 },
    { q: "Which is HARDWARE?", options: ["Chrome browser", "Windows 11", "The keyboard", "TikTok app"], answer: 2 },
    { q: "Which is SOFTWARE?", options: ["A monitor", "A mouse", "Microsoft Word", "A CPU"], answer: 2 },
    { q: "Computers ultimately understand only?", options: ["Words", "Pictures", "0 and 1", "Music"], answer: 2 },
    { q: "Typing on a keyboard is a form of?", options: ["Output", "Input", "Data storage", "Wi-Fi"], answer: 1 },
    { q: "Showing a picture on the screen is?", options: ["Input", "Output", "A folder", "A password"], answer: 1 },
    { q: "Raw facts and numbers are called?", options: ["Information", "Data", "Wi-Fi", "Cables"], answer: 1 },
    { q: "Data that is organised and useful becomes?", options: ["Junk", "Information", "Software", "Batteries"], answer: 1 },
    { q: "The Internet is?", options: ["One computer", "Many computers connected together", "A single wire", "A book"], answer: 1 },
    { q: "A program is?", options: ["A TV show only", "A set of instructions for the computer", "A password", "A type of screen"], answer: 1 },
    { q: "The person using a computer is called?", options: ["Boss", "User", "Server", "Robot"], answer: 1 },
    { q: "Which best describes a smartphone?", options: ["Only hardware", "Only software", "A small computer with hardware AND software", "Not a computer"], answer: 2 },
    { q: "Websites live on the?", options: ["Moon", "Internet", "Kitchen", "Bookshelf"], answer: 1 },
    { q: "A game on your phone is a kind of?", options: ["Hardware", "Software (app)", "Router", "Cable"], answer: 1 },
    { q: "Passwords help keep your account?", options: ["Fast", "Private", "Colorful", "Loud"], answer: 1 },
    { q: "Which is a good place to learn IT?", options: ["Only from movies", "By practising with computers", "Never", "By guessing"], answer: 1 },
    { q: "IT skills today are?", options: ["Not useful", "Useful in almost every job", "Only for engineers", "Only for gamers"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — Hardware
 * ────────────────────────────────────────────────────────────── */

const HARDWARE: Lesson = {
  chapterNumber: "2",
  chapterTitle: "Computer Hardware",
  chapterTitleKm: "ផ្នែករឹងកុំព្យូទ័រ",
  terms: [
    { en: "Hardware", km: "ផ្នែករឹង", icon: "⚙️", detail: "Every physical part of a computer — the things you can touch." },
    { en: "Processor (CPU)", km: "អង្គដំណើរការកណ្ដាល", icon: "🧠", detail: "The BRAIN of the computer. Runs billions of tiny steps every second." },
    { en: "GPU", km: "អង្គដំណើរការក្រាហ្វិក", icon: "🎮", detail: "Graphics chip. Handles pictures, videos, games, and modern AI." },
    { en: "Storage", km: "ការផ្ទុកទិន្នន័យ", icon: "💾", detail: "Where files live permanently — even when power is off." },
    { en: "Hard Disk (HDD)", km: "ថាសរឹង", icon: "🌀", detail: "Old-style storage with spinning metal platters. Cheap and big, but slow." },
    { en: "Solid State Drive (SSD)", km: "ថាសរឹងស្តាតូ", icon: "⚡", detail: "Modern flash storage. Much faster than HDD, no moving parts." },
    { en: "RAM", km: "អង្គចងចាំចៃដន្យ", icon: "🧮", detail: "Short-term memory. Holds what you are using RIGHT NOW. Forgets when power is off." },
    { en: "ROM", km: "អង្គចងចាំតែអាន", icon: "🔒", detail: "Permanent, read-only memory. Keeps startup instructions safe forever." },
    { en: "Cache", km: "ឃ្លាំងសម្ងាត់", icon: "🏎️", detail: "Tiny, super-fast memory inside the CPU. The CPU's own private notepad." },
    { en: "Motherboard", km: "ផ្ទាំងគោល", icon: "🧩", detail: "The main green board. Every part plugs into it and talks through it." },
    { en: "BIOS", km: "BIOS", icon: "🔌", detail: "The tiny program that wakes the computer up when you press power." },
    { en: "CMOS Battery", km: "ថ្ម CMOS", icon: "🔋", detail: "A coin-sized battery. Keeps the clock and BIOS settings alive when unplugged." },
    { en: "Clock Speed", km: "ល្បឿននាឡិកា", icon: "⏱️", detail: "How fast the CPU thinks — measured in GHz (billions per second)." },
    { en: "Port", km: "ច្រកភ្ជាប់", icon: "🔌", detail: "A hole on the computer where you plug things in — USB, HDMI, headphones." },
  ],
  quiz: [
    { q: "What is the 'brain' of a computer?", options: ["CPU", "RAM", "HDD", "GPU"], answer: 0 },
    { q: "CPU stands for?", options: ["Computer Personal Unit", "Central Processing Unit", "Central Program Unit", "Control Power Unit"], answer: 1 },
    { q: "CPU speed is measured in?", options: ["Bits", "Volts", "Gigahertz (GHz)", "Megabytes"], answer: 2 },
    { q: "What does SSD stand for?", options: ["Small Storage Drive", "Solid State Drive", "Speed System Disk", "Static Storage Disk"], answer: 1 },
    { q: "Which is faster?", options: ["HDD", "Floppy disk", "SSD", "CD-ROM"], answer: 2 },
    { q: "Which memory keeps data when power is OFF?", options: ["RAM", "Cache", "Storage (HDD/SSD)", "Registers"], answer: 2 },
    { q: "RAM stands for?", options: ["Read Access Memory", "Random Access Memory", "Rapid Automatic Memory", "Real-time Access Module"], answer: 1 },
    { q: "What happens to RAM when the computer turns off?", options: ["It saves data", "It loses everything", "It backs up to disk", "Nothing"], answer: 1 },
    { q: "More RAM makes a computer?", options: ["Smaller", "Louder", "Smoother when multi-tasking", "Cheaper"], answer: 2 },
    { q: "Where is Cache memory located?", options: ["On the hard disk", "Inside the CPU", "On the monitor", "In the power supply"], answer: 1 },
    { q: "Which is the fastest memory?", options: ["HDD", "SSD", "RAM", "Cache"], answer: 3 },
    { q: "ROM stands for?", options: ["Read-Only Memory", "Random Output Memory", "Rapid Object Module", "Restart Only Memory"], answer: 0 },
    { q: "What starts the computer when you press the power button?", options: ["Windows", "The browser", "BIOS/UEFI", "The user"], answer: 2 },
    { q: "Where is the BIOS stored?", options: ["On a floppy disk", "On the motherboard", "On the SSD", "In the RAM"], answer: 1 },
    { q: "What does the CMOS battery keep alive?", options: ["The screen", "The clock and BIOS settings", "The Wi-Fi", "The speakers"], answer: 1 },
    { q: "What connects every part of a computer together?", options: ["Cable", "Battery", "Motherboard", "Screen"], answer: 2 },
    { q: "The CPU plugs into a?", options: ["Socket on the motherboard", "USB port", "SATA cable", "Speaker"], answer: 0 },
    { q: "A GPU (graphics card) usually plugs into a?", options: ["USB port", "PCIe slot", "RAM slot", "Ethernet port"], answer: 1 },
    { q: "Which is a common motherboard size?", options: ["ATX", "USB", "HDMI", "MP4"], answer: 0 },
    { q: "1 TB (Terabyte) equals about?", options: ["10 GB", "100 GB", "1,000 GB", "1,000,000 GB"], answer: 2 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Software
 * ────────────────────────────────────────────────────────────── */

const SOFTWARE: Lesson = {
  chapterNumber: "3",
  chapterTitle: "Software Fundamentals",
  chapterTitleKm: "មូលដ្ឋានផ្នែកទន់",
  terms: [
    { en: "Software", km: "ផ្នែកទន់", icon: "🪄", detail: "The instructions that make a computer do useful things." },
    { en: "Program", km: "កម្មវិធី", icon: "📦", detail: "A set of instructions written by a programmer." },
    { en: "Operating System (OS)", km: "ប្រព័ន្ធប្រតិបត្តិការ", icon: "🖥️", detail: "The main software that runs the computer — Windows, macOS, Linux, Android, iOS." },
    { en: "Application", km: "កម្មវិធីប្រើប្រាស់", icon: "🎯", detail: "A program you actively use — browser, game, chat app, word processor." },
    { en: "File", km: "ឯកសារ", icon: "📄", detail: "A container for information saved on the computer — a photo, a song, a document." },
    { en: "Folder", km: "ថតឯកសារ", icon: "📁", detail: "A drawer that groups related files together." },
    { en: "Install", km: "ដំឡើង", icon: "⬇️", detail: "Add an app to your computer so you can use it." },
    { en: "Uninstall", km: "លុបចេញ", icon: "🗑️", detail: "Cleanly remove an app you don't want any more." },
    { en: "Update", km: "ធ្វើបច្ចុប្បន្នភាព", icon: "🔄", detail: "Newer version of an app that fixes bugs and closes security holes." },
    { en: "Open-source", km: "កូដបើកចំហ", icon: "🔓", detail: "Software whose recipe is free for anyone to read, change, and share." },
    { en: "License", km: "អាជ្ញាបណ្ណ", icon: "📜", detail: "The rules that say how you are allowed to use the software." },
    { en: "Kernel", km: "ខួរប្រព័ន្ធ", icon: "🌰", detail: "The innermost heart of an OS. Talks directly to the hardware." },
  ],
  quiz: [
    { q: "Software is?", options: ["Metal parts", "Instructions for the computer", "Screens and keyboards", "Wires"], answer: 1 },
    { q: "Which is system software?", options: ["A game", "The Operating System", "A music app", "A spreadsheet"], answer: 1 },
    { q: "Which is an application?", options: ["Windows", "Linux kernel", "Google Chrome", "BIOS"], answer: 2 },
    { q: "Windows is a?", options: ["Programming language", "Operating System", "Web browser", "Type of RAM"], answer: 1 },
    { q: "What manages the hardware for you?", options: ["A game", "The Operating System", "The keyboard", "The mouse"], answer: 1 },
    { q: "Linux is?", options: ["Owned by Microsoft", "Open-source", "Only for phones", "Only for gaming"], answer: 1 },
    { q: "macOS is made by?", options: ["Google", "Apple", "Microsoft", "Samsung"], answer: 1 },
    { q: "iOS runs on?", options: ["Windows PCs", "iPhones and iPads", "Android phones", "Chromebooks"], answer: 1 },
    { q: "Android runs on?", options: ["iPhones", "Most non-Apple phones", "Only laptops", "Only TVs"], answer: 1 },
    { q: "The heart of an Operating System is called?", options: ["Skin", "Kernel", "Cover", "Shell"], answer: 1 },
    { q: "The file system commonly used on Windows is?", options: ["ext4", "APFS", "NTFS", "FAT12"], answer: 2 },
    { q: "Which is best for a USB stick that works everywhere?", options: ["NTFS", "APFS", "exFAT/FAT32", "ext4"], answer: 2 },
    { q: "Files are organized into?", options: ["Cages", "Folders (directories)", "Bricks", "Sockets"], answer: 1 },
    { q: "Linux typically uses which file system?", options: ["NTFS", "ext4", "APFS", "FAT32"], answer: 1 },
    { q: "To add a new app you?", options: ["Delete files", "Install it", "Restart Wi-Fi", "Format the disk"], answer: 1 },
    { q: "Free software you can read and change is called?", options: ["Proprietary", "Freeware", "Open-source", "Shareware"], answer: 2 },
    { q: "SaaS means software that is?", options: ["Sold as a service (online)", "Silver-and-steel", "Stored on disk only", "Sold with a CD"], answer: 0 },
    { q: "Why should you update software?", options: ["To slow it down", "To fix bugs and security", "To use more storage", "It's not needed"], answer: 1 },
    { q: "Where do phones get most apps?", options: ["USB stick", "App Store / Play Store", "Email", "Web camera"], answer: 1 },
    { q: "Removing an app cleanly is called?", options: ["Uninstalling", "Downloading", "Streaming", "Copying"], answer: 0 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Networking & Internet
 * ────────────────────────────────────────────────────────────── */

const NETWORKING: Lesson = {
  chapterNumber: "4",
  chapterTitle: "Networking & Internet",
  chapterTitleKm: "បណ្តាញ និង អ៊ីនធឺណិត",
  terms: [
    { en: "Network", km: "បណ្តាញ", icon: "🕸️", detail: "Any group of computers that can share information with each other." },
    { en: "Internet", km: "អ៊ីនធឺណិត", icon: "🌐", detail: "The biggest network in the world — billions of computers connected." },
    { en: "LAN", km: "បណ្តាញតំបន់មូលដ្ឋាន", icon: "🏢", detail: "Local Area Network — one building or one classroom." },
    { en: "WAN", km: "បណ្តាញធំទូលាយ", icon: "🌍", detail: "Wide Area Network — covers cities, countries, or the whole world." },
    { en: "IP Address", km: "អាសយដ្ឋាន IP", icon: "🏠", detail: "The address of your device on a network. Example: 192.168.1.10" },
    { en: "MAC Address", km: "អាសយដ្ឋាន MAC", icon: "🆔", detail: "The permanent factory ID of a network card. Never changes." },
    { en: "Router", km: "រ៉ោតទ័រ", icon: "📡", detail: "Directs traffic between DIFFERENT networks — e.g. home ↔ internet." },
    { en: "Switch", km: "ស្វីច", icon: "🔀", detail: "Connects devices INSIDE one network — like computers in a school lab." },
    { en: "Port", km: "ច្រក", icon: "🚪", detail: "A numbered door on a computer. Different doors lead to different services." },
    { en: "Protocol", km: "ពិធីការ", icon: "🤝", detail: "The rules two computers agree on so they can understand each other." },
    { en: "Bandwidth", km: "បំពង់ទ្រនាប់", icon: "🚿", detail: "How much data your connection can carry per second. Fatter pipe = more speed." },
    { en: "VPN", km: "បណ្តាញឯកជននិម្មិត", icon: "🕶️", detail: "A secret encrypted tunnel through the internet. Hides where you are." },
    { en: "Cloud", km: "ពពក", icon: "☁️", detail: "Renting computers over the internet instead of owning them." },
    { en: "Ping", km: "ការសាកសួរ", icon: "📶", detail: "A small message asking 'are you there?' — measures speed and reach." },
  ],
  quiz: [
    { q: "A network is?", options: ["A single computer", "Computers that share information", "A game", "A folder"], answer: 1 },
    { q: "LAN stands for?", options: ["Long Area Network", "Local Area Network", "Large Access Network", "Little Access Node"], answer: 1 },
    { q: "The internet is a?", options: ["PAN", "MAN", "WAN", "USB"], answer: 2 },
    { q: "Wi-Fi is a?", options: ["Wired network", "Wireless LAN", "Type of monitor", "Kind of file"], answer: 1 },
    { q: "Which is a valid IP address?", options: ["A4:C3:F0:12:9B:5E", "192.168.1.10", "hello.com", "USB-3.0"], answer: 1 },
    { q: "Can your IP address change?", options: ["Yes, when you move to a new Wi-Fi", "No, it is permanent", "Only in Africa", "Only on Sundays"], answer: 0 },
    { q: "Does a MAC address change?", options: ["Yes, every day", "No, it is fixed", "Only if you paint it", "Only during storms"], answer: 1 },
    { q: "A ROUTER connects?", options: ["Two speakers", "Two networks (like home ↔ internet)", "The mouse to the keyboard", "The screen to the CPU"], answer: 1 },
    { q: "A SWITCH connects?", options: ["Two networks", "Devices inside the same network", "Batteries", "USB drives"], answer: 1 },
    { q: "HTTP uses port?", options: ["80", "22", "443", "3306"], answer: 0 },
    { q: "HTTPS (secure web) uses port?", options: ["80", "443", "25", "21"], answer: 1 },
    { q: "PING is used to?", options: ["Cook food", "Check if a computer is reachable", "Delete files", "Buy things online"], answer: 1 },
    { q: "TRACERT shows?", options: ["Your Wi-Fi password", "The path packets take to a destination", "Your phone number", "Your battery level"], answer: 1 },
    { q: "A VPN provides?", options: ["A fast printer", "An encrypted tunnel over the internet", "A new keyboard", "Free games"], answer: 1 },
    { q: "Bandwidth is measured in?", options: ["Kilograms", "Bits per second (bps)", "Centimeters", "Degrees"], answer: 1 },
    { q: "100 Mbps is about?", options: ["100 bits per second", "100 million bits per second", "100 megabytes per hour", "100 kilobytes total"], answer: 1 },
    { q: "Cloud computing means?", options: ["Storing data in the sky", "Using computers and services over the internet", "Only for weather apps", "A game genre"], answer: 1 },
    { q: "Gmail is an example of?", options: ["IaaS", "SaaS (Software as a Service)", "A firewall", "A router"], answer: 1 },
    { q: "TCP/IP is?", options: ["A brand of computer", "A set of rules that make the internet work", "A game", "A movie"], answer: 1 },
    { q: "Which is a WIDE Area Network?", options: ["Bluetooth headphones", "One classroom Wi-Fi", "The internet", "A USB cable"], answer: 2 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Web Technology
 * ────────────────────────────────────────────────────────────── */

const WEB: Lesson = {
  chapterNumber: "5",
  chapterTitle: "Web Technology",
  chapterTitleKm: "បច្ចេកវិទ្យាវេប",
  terms: [
    { en: "Website", km: "គេហទំព័រ", icon: "🌐", detail: "A collection of web pages living together at one address." },
    { en: "Web Page", km: "ទំព័រវេប", icon: "📄", detail: "A single page on a website — like one page in a book." },
    { en: "Browser", km: "កម្មវិធីរុករក", icon: "🧭", detail: "The app you use to view websites — Chrome, Safari, Firefox, Edge." },
    { en: "HTML", km: "HTML", icon: "🧱", detail: "The language that gives a page its STRUCTURE — headings, paragraphs, images." },
    { en: "CSS", km: "CSS", icon: "🎨", detail: "The language that gives a page its LOOK — colors, spacing, fonts." },
    { en: "JavaScript", km: "JavaScript", icon: "✨", detail: "The language that makes a page INTERACTIVE — buttons, forms, live updates." },
    { en: "Server", km: "ម៉ាស៊ីនមេ", icon: "🗄️", detail: "A powerful computer that sends web pages to visitors." },
    { en: "Client", km: "ម៉ាស៊ីនអតិថិជន", icon: "👤", detail: "Your device asking the server for a page." },
    { en: "Domain Name", km: "ឈ្មោះដែន", icon: "🏷️", detail: "The human-readable address of a website — like example.com." },
    { en: "Hosting", km: "សេវាទុកគេហទំព័រ", icon: "🏠", detail: "The service that stores a website's files and serves them online." },
    { en: "DNS", km: "ប្រព័ន្ធឈ្មោះដែន", icon: "📖", detail: "The phone book of the internet — turns names into IP addresses." },
    { en: "TCP/IP", km: "TCP/IP", icon: "📦", detail: "The two rules that make the internet work — packets and addresses." },
    { en: "TLD", km: "ដែនកម្រិតកំពូល", icon: "🔤", detail: "The last part of a domain — .com, .org, .kh, .edu." },
    { en: "HTTPS", km: "HTTPS", icon: "🔒", detail: "Secure HTTP. The padlock in the address bar means your data is encrypted." },
  ],
  quiz: [
    { q: "HTML is used for?", options: ["Making sounds", "The STRUCTURE of a web page", "Editing photos", "Sending SMS"], answer: 1 },
    { q: "CSS is used for?", options: ["Sending emails", "The DESIGN and colors of a page", "Making phone calls", "Building hardware"], answer: 1 },
    { q: "JavaScript usually runs in the?", options: ["Refrigerator", "Web browser", "Motherboard BIOS", "USB stick"], answer: 1 },
    { q: "PHP usually runs on the?", options: ["Screen", "Server", "Keyboard", "USB port"], answer: 1 },
    { q: "WordPress is a?", options: ["A CPU", "A tool to build websites (a CMS)", "A monitor brand", "A country"], answer: 1 },
    { q: "example.com is a?", options: ["Password", "Domain name", "USB port", "Emoji"], answer: 1 },
    { q: "Hosting stores?", options: ["Groceries", "The website's files", "Your body", "Batteries"], answer: 1 },
    { q: "DNS translates?", options: ["Colors to sounds", "A name (google.com) into an IP address", "Coffee to tea", "MB into GB"], answer: 1 },
    { q: ".com and .org are examples of?", options: ["Programming languages", "TLDs (Top-Level Domains)", "Screen sizes", "USB versions"], answer: 1 },
    { q: "Who oversees domain names worldwide?", options: ["Microsoft", "ICANN", "Apple", "Facebook"], answer: 1 },
    { q: "WHOIS tells you?", options: ["Who invented the internet", "Who owns a domain name", "How fast your Wi-Fi is", "Your battery level"], answer: 1 },
    { q: "TCP splits data into?", options: ["Songs", "Small packets", "Movies", "Colors"], answer: 1 },
    { q: "IP is responsible for?", options: ["Making coffee", "Addressing packets", "Painting walls", "Charging phones"], answer: 1 },
    { q: "The first step when opening a website is?", options: ["Print the page", "DNS lookup to find the IP", "Turn off Wi-Fi", "Empty the recycle bin"], answer: 1 },
    { q: "HTTPS is HTTP with?", options: ["Sound", "Encryption (a padlock 🔒)", "3D graphics", "Extra letters only"], answer: 1 },
    { q: "TLD means?", options: ["Top-Level Domain", "Total Long Data", "Tiny Little Disc", "Time Loop Delay"], answer: 0 },
    { q: "docs.example.com is a?", options: ["Password", "Subdomain", "Firewall", "MAC address"], answer: 1 },
    { q: "WordPress is written mostly in?", options: ["Java", "PHP", "C++", "Swift"], answer: 1 },
    { q: "Which HTML tag is a main heading?", options: ["<p>", "<h1>", "<div>", "<img>"], answer: 1 },
    { q: "In CSS, which property changes text color?", options: ["font-size", "color", "border", "margin"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Cybersecurity
 * ────────────────────────────────────────────────────────────── */

const SECURITY: Lesson = {
  chapterNumber: "6",
  chapterTitle: "Cybersecurity",
  chapterTitleKm: "សុវត្ថិភាពសាយប័រ",
  terms: [
    { en: "Cybersecurity", km: "សុវត្ថិភាពសាយប័រ", icon: "🛡️", detail: "Protecting people, data, and systems from digital attacks." },
    { en: "Hacking", km: "ការវាយចូល", icon: "⌨️", detail: "Making a system do something it wasn't designed for. Can be good or bad." },
    { en: "Hacker", km: "អ្នកវាយចូល", icon: "🎩", detail: "A person skilled at hacking. White hat = helper, Black hat = criminal." },
    { en: "Malware", km: "កម្មវិធីអាក្រក់", icon: "🦠", detail: "Any bad software — virus, worm, trojan, ransomware, spyware." },
    { en: "Virus", km: "មេរោគ", icon: "🧬", detail: "Malware that attaches to a program and spreads when the program runs." },
    { en: "Worm", km: "មេរោគដង្កូវ", icon: "🪱", detail: "Malware that copies itself across networks — no host program needed." },
    { en: "Trojan", km: "កម្មវិធីលួច", icon: "🐴", detail: "Malware that pretends to be a useful app but hides a bad payload." },
    { en: "Ransomware", km: "កម្មវិធីច្របាច់លុយ", icon: "💰", detail: "Malware that locks your files and demands money to unlock them." },
    { en: "Phishing", km: "ការនេសាទបោក", icon: "🎣", detail: "Fake emails or messages that trick you into giving up passwords." },
    { en: "Password", km: "ពាក្យសម្ងាត់", icon: "🔑", detail: "The secret string that proves you are you. Make it long and unique." },
    { en: "Firewall", km: "ជញ្ជាំងភ្លើង", icon: "🧱", detail: "A filter that blocks unwanted network traffic — a wall for your computer." },
    { en: "Encryption", km: "ការសម្ងាត់", icon: "🔐", detail: "Scrambling data so only the right person with the key can read it." },
    { en: "Backup", km: "ការចម្លងសម្រុះ", icon: "💾", detail: "A safety copy of your data — the only real cure for ransomware." },
    { en: "Two-Factor Auth (2FA)", km: "ការផ្ទៀងផ្ទាត់ពីរជាន់", icon: "🔒", detail: "Extra proof of identity — password + code from your phone." },
  ],
  quiz: [
    { q: "The 'CIA' triad in security stands for?", options: ["Country, Idea, Access", "Confidentiality, Integrity, Availability", "Cache, Internet, Antenna", "Code, Input, App"], answer: 1 },
    { q: "Confidentiality means?", options: ["Everyone can read it", "Only the right people can read it", "Fast speed", "Loud sound"], answer: 1 },
    { q: "Integrity means?", options: ["Data has NOT been secretly changed", "The disk is full", "You logged in", "Battery is charged"], answer: 0 },
    { q: "Availability means?", options: ["The service is UP when needed", "You bought new hardware", "You painted the walls", "You disabled the mouse"], answer: 0 },
    { q: "An ETHICAL hacker is usually called?", options: ["Black hat", "White hat", "Red hat", "Green hat"], answer: 1 },
    { q: "A CRIMINAL hacker is usually called?", options: ["White hat", "Black hat", "Sky hat", "Blue hat"], answer: 1 },
    { q: "A virus needs a?", options: ["Full moon", "Host program to attach to", "USB battery", "New keyboard"], answer: 1 },
    { q: "A worm spreads through?", options: ["Books", "Networks by itself", "Only USB sticks", "Voice messages"], answer: 1 },
    { q: "A Trojan pretends to be?", options: ["Something dangerous", "Something safe or useful", "A speaker", "A cable"], answer: 1 },
    { q: "Ransomware attackers usually?", options: ["Send flowers", "Encrypt your files and demand money", "Fix your PC for free", "Update Windows"], answer: 1 },
    { q: "DoS stands for?", options: ["Data on Screen", "Denial of Service", "Direct-Old System", "Double or Simple"], answer: 1 },
    { q: "A DDoS uses?", options: ["One attacker", "Many machines at once (a botnet)", "Only a printer", "A single mouse"], answer: 1 },
    { q: "SQL injection attacks?", options: ["The screen", "The database through form inputs", "The keyboard", "The BIOS"], answer: 1 },
    { q: "XSS means?", options: ["Extra Sunday Special", "Cross-Site Scripting", "X-Speed System", "Xtra Signal Source"], answer: 1 },
    { q: "PHISHING usually arrives by?", options: ["Fishing rod", "Fake emails or messages", "Rain", "Wind"], answer: 1 },
    { q: "VISHING is phishing by?", options: ["Voice / phone call", "Video only", "Book pages", "Braille"], answer: 0 },
    { q: "A strong password should be?", options: ["Short like '123'", "Long and unique", "Your birthday", "The word 'password'"], answer: 1 },
    { q: "2FA means?", options: ["Two Factory App", "Two-Factor Authentication", "Twice Full Access", "Two Free Apps"], answer: 1 },
    { q: "A firewall?", options: ["Cools your CPU", "Filters network traffic", "Sends emails", "Plays music"], answer: 1 },
    { q: "The BEST defense against ransomware is?", options: ["Delete all files", "Regular backups", "Restart the router", "Play more games"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Artificial Intelligence
 * ────────────────────────────────────────────────────────────── */

const AI: Lesson = {
  chapterNumber: "7",
  chapterTitle: "Artificial Intelligence",
  chapterTitleKm: "បញ្ញាសិប្បនិម្មិត",
  terms: [
    { en: "Artificial Intelligence", km: "បញ្ញាសិប្បនិម្មិត", icon: "🤖", detail: "Computers that do tasks we usually call 'intelligent' — read, write, see, decide." },
    { en: "Machine Learning", km: "ការរៀនរបស់ម៉ាស៊ីន", icon: "🎯", detail: "Instead of coding rules, we show the computer examples and it learns the pattern." },
    { en: "Deep Learning", km: "ការរៀនស៊ីជម្រៅ", icon: "🕸️", detail: "Machine learning built with many-layered neural networks. Powers today's biggest AI." },
    { en: "Neural Network", km: "បណ្តាញសរសៃប្រសាទ", icon: "🧠", detail: "Simple math cells connected together like neurons in a brain." },
    { en: "Algorithm", km: "ក្បួនដោះស្រាយ", icon: "📐", detail: "A step-by-step recipe for solving a problem." },
    { en: "Data", km: "ទិន្នន័យ", icon: "🔢", detail: "The examples we feed to an AI to teach it. More good data = smarter AI." },
    { en: "Model", km: "គំរូ", icon: "📊", detail: "The trained AI itself — what you get after showing it lots of examples." },
    { en: "Training", km: "ការបណ្ដុះបណ្ដាល", icon: "🏋️", detail: "The process of showing an AI examples so it learns." },
    { en: "NLP", km: "ដំណើរការភាសាធម្មជាតិ", icon: "💬", detail: "Natural Language Processing — teaching computers to read and write human languages." },
    { en: "Chatbot", km: "រ៉ូបូតឆាត", icon: "🗨️", detail: "An AI you can talk to — like ChatGPT, Claude, or Gemini." },
    { en: "Bias", km: "ភាពលំអៀង", icon: "⚖️", detail: "When AI makes unfair decisions because its training data was unfair." },
    { en: "Ethics", km: "ក្រមសីលធម៌", icon: "🕊️", detail: "The rules of right and wrong. AI is powerful — use it kindly." },
    { en: "Prompt", km: "សំណើ", icon: "❓", detail: "The question or request you type into an AI." },
    { en: "Computer Vision", km: "ការមើលឃើញរបស់កុំព្យូទ័រ", icon: "👁️", detail: "AI that understands images and video — face-unlock, medical scans, self-driving." },
  ],
  quiz: [
    { q: "AI stands for?", options: ["Auto Internet", "Artificial Intelligence", "Alternate Input", "Advanced Icons"], answer: 1 },
    { q: "NARROW AI does?", options: ["Every human task", "One specific task well", "Only art", "Only cooking"], answer: 1 },
    { q: "GENERAL AI (AGI) is?", options: ["Available in every phone today", "A hypothetical AI as smart as a human", "A game", "A network card"], answer: 1 },
    { q: "Machine Learning learns from?", options: ["Prayer", "Examples / data", "Magic", "Coffee"], answer: 1 },
    { q: "SUPERVISED learning uses?", options: ["No data", "Labeled examples", "Only pictures of cats", "Random guesses"], answer: 1 },
    { q: "UNSUPERVISED learning finds?", options: ["Nothing", "Hidden patterns in unlabeled data", "Passwords", "Weather"], answer: 1 },
    { q: "REINFORCEMENT learning uses?", options: ["Only text", "Rewards for good actions", "Only images", "USB sticks"], answer: 1 },
    { q: "Deep Learning is built on?", options: ["Coffee beans", "Neural networks (many layers)", "Old floppy disks", "Bluetooth"], answer: 1 },
    { q: "Neural networks are loosely inspired by?", options: ["The moon", "The human brain", "A camera lens", "A bicycle"], answer: 1 },
    { q: "GPUs are useful for AI because they?", options: ["Play music", "Do many math steps in parallel", "Cool the CPU", "Send emails"], answer: 1 },
    { q: "NLP stands for?", options: ["Nice Little Program", "Natural Language Processing", "Network Line Protocol", "New Login Page"], answer: 1 },
    { q: "ChatGPT and Claude are examples of?", options: ["Games", "Large Language Models (LLMs)", "Web browsers", "Speakers"], answer: 1 },
    { q: "Can AI be confidently WRONG?", options: ["Never", "Yes — always verify important answers", "Only on Sundays", "Only in French"], answer: 1 },
    { q: "AI bias mostly comes from?", options: ["Cables", "The training data", "The wall socket", "The battery"], answer: 1 },
    { q: "Should you paste PRIVATE data into a public AI?", options: ["Yes always", "No — it may be stored", "Only your name", "Only your address"], answer: 1 },
    { q: "Face-unlock uses which AI area?", options: ["Computer Vision", "Blockchain", "Word processing", "Cooking"], answer: 0 },
    { q: "Speech-to-text is part of?", options: ["NLP", "Neither", "Firewalls", "Cache memory"], answer: 0 },
    { q: "Best career approach with AI?", options: ["Ignore it", "Learn to USE it wisely", "Delete it", "Hide it"], answer: 1 },
    { q: "Google Translate is powered by?", options: ["NLP + Deep Learning", "Only humans", "A calculator", "A microphone"], answer: 0 },
    { q: "AI Ethics reminds us to?", options: ["Move fast, break things", "Think about fairness, privacy, and impact", "Skip testing", "Sell all data"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Conclusion & Final Review
 * ────────────────────────────────────────────────────────────── */

const CONCLUSION: Lesson = {
  chapterNumber: "8",
  chapterTitle: "Conclusion & Final Review",
  chapterTitleKm: "សេចក្តីសន្និដ្ឋាន និង ការពិនិត្យចុងក្រោយ",
  terms: [
    { en: "Digital Literacy", km: "អក្ខរកម្មឌីជីថល", icon: "📚", detail: "Being comfortable and safe using digital tools." },
    { en: "Critical Thinking", km: "គំនិតវិវេចនា", icon: "🤔", detail: "Asking 'is this true?' before believing what you see online." },
    { en: "Privacy", km: "ភាពឯកជន", icon: "🔒", detail: "The right to keep your personal information for yourself." },
    { en: "Netiquette", km: "សុជីវធម៌អ៊ីនធឺណិត", icon: "🙏", detail: "Being polite and kind when communicating online." },
    { en: "Career", km: "អាជីព", icon: "🎓", detail: "Your working life. IT skills open doors in almost every job today." },
    { en: "Innovation", km: "នវានុវត្តន៍", icon: "💡", detail: "Finding new and better ways to solve problems." },
    { en: "Certification", km: "វិញ្ញាបនប័ត្រ", icon: "🏆", detail: "An official document that proves you have completed a course." },
    { en: "Lifelong Learning", km: "ការសិក្សាពេញមួយជីវិត", icon: "♾️", detail: "Technology changes fast — keep learning your whole life." },
    { en: "Team Work", km: "ការងារជាក្រុម", icon: "🤝", detail: "IT projects almost always need people working together." },
    { en: "Problem Solving", km: "ការដោះស្រាយបញ្ហា", icon: "🧩", detail: "Breaking a big problem into small pieces you can handle." },
  ],
  quiz: [
    { q: "The brain of a computer is the?", options: ["RAM", "CPU", "GPU", "SSD"], answer: 1 },
    { q: "Which is faster?", options: ["HDD", "SSD", "Floppy disk", "CD"], answer: 1 },
    { q: "Software is?", options: ["Metal parts", "Instructions", "Cables", "Speakers"], answer: 1 },
    { q: "Windows and Linux are?", options: ["Games", "Operating Systems", "Browsers", "USB brands"], answer: 1 },
    { q: "IP address is?", options: ["A password", "The address of a device on a network", "A screen size", "A file type"], answer: 1 },
    { q: "A router connects?", options: ["Two speakers", "Two networks", "Two batteries", "Two chairs"], answer: 1 },
    { q: "HTTPS uses port?", options: ["80", "443", "25", "22"], answer: 1 },
    { q: "DNS translates?", options: ["Names to IP addresses", "MP3 to WAV", "USD to KHR", "Photos to text"], answer: 0 },
    { q: "HTML is used for?", options: ["Colors", "Structure of a web page", "Cooking", "Passwords"], answer: 1 },
    { q: "CSS is used for?", options: ["The look and feel", "Networking", "Storage", "USB drivers"], answer: 0 },
    { q: "JavaScript runs in the?", options: ["Refrigerator", "Web browser", "BIOS", "Speakers"], answer: 1 },
    { q: "A phishing email tries to?", options: ["Help you cook", "Trick you into giving passwords", "Update Windows", "Fix your Wi-Fi"], answer: 1 },
    { q: "Ransomware?", options: ["Cools the CPU", "Locks your files and demands money", "Sends emails", "Frees storage"], answer: 1 },
    { q: "Best defence against ransomware?", options: ["Backups", "Formatting", "Deleting Wi-Fi", "Buying a new screen"], answer: 0 },
    { q: "2FA means?", options: ["Two Free Apps", "Two-Factor Authentication", "Two Fast Actions", "Two Focus Alerts"], answer: 1 },
    { q: "Machine Learning learns from?", options: ["Random guesses", "Examples / data", "Magic", "Prayer"], answer: 1 },
    { q: "Deep Learning is built on?", options: ["USB sticks", "Neural networks", "Antennas", "Coffee"], answer: 1 },
    { q: "ChatGPT is an example of?", options: ["Firewall", "LLM (Large Language Model)", "Router", "USB drive"], answer: 1 },
    { q: "AI can be wrong?", options: ["Never", "Yes — always double-check", "Only on Sundays", "Only in poems"], answer: 1 },
    { q: "The best mindset for IT is?", options: ["Stop learning after school", "Keep learning your whole life", "Copy others only", "Guess randomly"], answer: 1 },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 * Master export
 * ────────────────────────────────────────────────────────────── */

import { RUST_LESSONS } from "@/lib/rust-lecture-data";
import { ML_LESSONS } from "@/lib/ml-lecture-data";

export const LESSONS: Record<string, Lesson> = {
  welcome: WELCOME,
  hardware: HARDWARE,
  software: SOFTWARE,
  networking: NETWORKING,
  web: WEB,
  security: SECURITY,
  ai: AI,
  conclusion: CONCLUSION,
  ...RUST_LESSONS,
  ...ML_LESSONS,
};
