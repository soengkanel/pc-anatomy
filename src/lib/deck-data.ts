// Lecture slide-deck data for each chapter.
//
// The on-screen /lecture page uses animated React visuals for each subtopic;
// the printable slide deck can't ship those, so this module holds a text-only
// mirror of the subtopic content (title / caption / bullets / why-it-matters)
// plus a cover tagline, agenda, and closing summary per chapter. Consumed by
// deck-pdf.ts.
//
// Every subtopic ends with a "Why this matters to you" line — one concrete
// sentence connecting the concept back to a Cambodian student's daily life.
// That callout fills the bottom half of each printed slide so the deck is
// paced for a real lecture hall, not a study reference.

export type DeckSlide = {
  title: string;
  /** One-line teaching caption shown just under the title. */
  caption: string;
  /** 2-4 bullet points spoken through by the lecturer. */
  bullets: string[];
  /** Bottom callout — one concrete sentence tying the concept to a student's life. */
  whyItMatters: string;
};

export type ChapterDeck = {
  /** Matches a key in LESSONS so we can pull the chapter title from one source. */
  lessonKey: string;
  chapterNumber: string;
  /** Short hook shown on the cover slide, below the chapter title. */
  hook: string;
  /** Slide 2 — what we'll cover today. */
  agenda: string[];
  /** Main body slides — one per subtopic. */
  subtopics: DeckSlide[];
  /**
   * DOM element ids on the /lecture page (SubTopic anchors) to snapshot for
   * each subtopic slide. Same length + order as `subtopics`. Undefined when
   * the chapter has no per-topic visuals (Welcome, Conclusion).
   */
  visualIds?: string[];
  /**
   * One-line labels for the "putting it all together" flow slide added after
   * the last subtopic. Same order as `subtopics`, but written shorter so
   * they fit inside a flow-diagram box.
   */
  flowSteps?: string[];
  /** Final wrap-up slide. */
  closing: {
    headline: string;
    body: string;
    bullets: string[];
    /** One-sentence charge to the students. */
    charge: string;
  };
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 1 — Welcome
 * ────────────────────────────────────────────────────────────── */

const WELCOME: ChapterDeck = {
  lessonKey: "welcome",
  chapterNumber: "1",
  hook: "Eight chapters. Simple words. Lots of pictures. By the end, technology will feel less like magic.",
  agenda: [
    "What is Information Technology?",
    "How this course is organised",
    "Four things you'll be able to do by December",
    "How to study — the honest version",
  ],
  subtopics: [
    {
      title: "What is IT, really?",
      caption: "The tools and ideas we use to store, send, and work with information.",
      bullets: [
        "Every phone, ATM, and Wing transfer is IT quietly doing its job.",
        "IT is hardware you can touch, plus software that tells it what to do.",
        "You already use it every day — this course just names the parts.",
      ],
      whyItMatters:
        "The apps you tap every day — ABA, Wing, TikTok — are all IT. You're already fluent; we're just teaching you the vocabulary.",
    },
    {
      title: "How this course is built",
      caption: "Eight short chapters. Each one leans on pictures before words.",
      bullets: [
        "Chapters 2–3 — the machine (hardware + software).",
        "Chapters 4–5 — how it connects (networking + web).",
        "Chapters 6–7 — how to stay safe, and where AI fits.",
        "Chapter 8 — you look back at how far you came.",
      ],
      whyItMatters:
        "You'll finish able to explain any chapter to a friend over kuy teav — without needing a dictionary.",
    },
    {
      title: "Four things you'll be able to do",
      caption: "The practical outcomes we care about.",
      bullets: [
        "Open a computer and name every major part.",
        "Trace a message from your phone to a server in Singapore.",
        "Spot phishing SMS and choose strong passwords.",
        "Talk about AI honestly — no hype, no fear.",
      ],
      whyItMatters:
        "These four skills already put you ahead of most graduates applying for junior IT roles in Phnom Penh.",
    },
    {
      title: "How to actually study this",
      caption: "Little and often beats one long cram session.",
      bullets: [
        "Read the chapter, then attempt the quiz — every question.",
        "If you miss one, look it up before the next class.",
        "Use the bilingual glossary to link English words to Khmer.",
      ],
      whyItMatters:
        "Twenty focused minutes each day beats four hours the night before. Every professional IT engineer learned this the hard way.",
    },
  ],
  closing: {
    headline: "Ready to start",
    body: "Next class, we open the computer and look at each part — the same parts that power every phone in Phnom Penh.",
    bullets: [
      "Bring your questions to Chapter 2.",
      "Try the Welcome quiz online — the PDF version is for offline practice.",
    ],
    charge:
      "You don't need to be a genius. You need to be curious for one hour a day. That's it.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 2 — Hardware
 * ────────────────────────────────────────────────────────────── */

const HARDWARE: ChapterDeck = {
  lessonKey: "hardware",
  chapterNumber: "2",
  hook: "Hardware is anything you can touch inside a computer. Let's look at the parts, one by one.",
  agenda: [
    "Processor — the brain",
    "Storage — permanent memory",
    "RAM — short-term memory",
    "Cache & ROM",
    "CMOS & BIOS — the wake-up program",
    "Motherboard — how it all connects",
  ],
  visualIds: ["processor", "storage", "ram", "cache-rom", "cmos-bios", "motherboard"],
  flowSteps: [
    "BIOS wakes the machine",
    "CPU starts thinking",
    "RAM holds what's open",
    "Cache speeds up the CPU",
    "Storage keeps files safe",
    "Motherboard connects it all",
  ],
  subtopics: [
    {
      title: "Processor (CPU)",
      caption: "The brain of the computer. It thinks.",
      bullets: [
        "Also called the CPU — Central Processing Unit.",
        "Runs billions of tiny steps every second.",
        "Speed is measured in GHz (giga-hertz).",
      ],
      whyItMatters:
        "Every second your Vivo phone runs a billion tiny thinking steps — that's the CPU quietly doing its job while you scroll TikTok.",
    },
    {
      title: "Storage",
      caption: "Keeps your files, even when the power is off.",
      bullets: [
        "SSD — modern, fast, no moving parts.",
        "HDD — older, bigger, cheaper, slower.",
        "Everything survives a reboot: photos, apps, homework.",
      ],
      whyItMatters:
        "This is why your Angkor Wat holiday photos are still there after your phone battery dies. Storage remembers; RAM forgets.",
    },
    {
      title: "RAM",
      caption: "Fast short-term memory. It forgets when the power goes off.",
      bullets: [
        "Holds only what you're using RIGHT NOW.",
        "More RAM means more apps at once without lag.",
        "A typical laptop today has 8–16 GB.",
      ],
      whyItMatters:
        "Adding RAM is the cheapest laptop speed-up you can buy in Phnom Penh — often under $30 and worth every riel.",
    },
    {
      title: "Cache & ROM",
      caption: "Two helpers: one for speed, one for memory that never forgets.",
      bullets: [
        "Cache — a tiny super-fast notepad inside the CPU.",
        "ROM — read-only memory that keeps startup instructions safe forever.",
        "You never manage these directly; the system uses them for you.",
      ],
      whyItMatters:
        "You'll never touch these directly, but they're the reason your PC boots the same way every morning at IDIC — reliably, in seconds.",
    },
    {
      title: "CMOS & BIOS",
      caption: "The tiny program that wakes the computer up when you press power.",
      bullets: [
        "BIOS checks every part — CPU, RAM, keyboard, disk.",
        "Then it hands over to the operating system.",
        "A coin-sized CMOS battery keeps the clock alive when unplugged.",
      ],
      whyItMatters:
        "When your PC's clock is wrong after a power cut, it's the CMOS battery that needs replacing — a two-dollar fix, not a new computer.",
    },
    {
      title: "Motherboard",
      caption: "The big green board that connects every part together.",
      bullets: [
        "Input — keyboard, mouse, touchscreen.",
        "Processing — CPU + RAM sit right on the board.",
        "Output — screen and speakers plug in at the edges.",
      ],
      whyItMatters:
        "When you type your name in class, it travels this exact path — key, cable, motherboard, CPU, screen — in under one millisecond.",
    },
  ],
  closing: {
    headline: "Six parts you can now name",
    body: "Open a computer at the IDIC lab this week and recognise every major component we covered today.",
    bullets: [
      "CPU, RAM, storage, cache/ROM, BIOS, motherboard.",
      "Next chapter — the software that runs on top of these parts.",
    ],
    charge:
      "Any IT job interview in Cambodia will test hardware first. You just passed the hardest part.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 3 — Software
 * ────────────────────────────────────────────────────────────── */

const SOFTWARE: ChapterDeck = {
  lessonKey: "software",
  chapterNumber: "3",
  hook: "If hardware is the body, software is the thinking. It tells the machine what to do.",
  agenda: [
    "The three software layers",
    "Operating systems (Windows, macOS, Android, iOS)",
    "File systems — how files are organised",
    "Installing, updating, and removing apps",
  ],
  visualIds: ["software", "operating-systems", "file-systems", "software-management"],
  flowSteps: [
    "Software sits in layers",
    "The OS runs on the hardware",
    "Files live in folders",
    "You install / update / remove apps",
  ],
  subtopics: [
    {
      title: "The software stack",
      caption: "Apps run on the operating system. The operating system runs on the hardware.",
      bullets: [
        "Layer 3 — apps (Facebook, Chrome, Word).",
        "Layer 2 — the system (Windows, Android).",
        "Layer 1 — the machine (CPU, RAM, storage).",
      ],
      whyItMatters:
        "This is why the same laptop can be a study tool one hour and a game console the next — software changes, hardware stays put.",
    },
    {
      title: "Operating Systems",
      caption: "Every device you touch has one — each looks different, but does the same job.",
      bullets: [
        "Desktop — Windows, macOS, Linux.",
        "Phone — Android, iOS.",
        "The OS manages files, memory, and every running app.",
      ],
      whyItMatters:
        "Windows at IDIC and Android on your phone are the same idea in different clothes. Learn one well and you already understand the others.",
    },
    {
      title: "File Systems",
      caption: "Files live in folders. Folders live inside other folders.",
      bullets: [
        "Each file has one clear home — no duplicates.",
        "Folders group related work: 'IDIC / Semester 1 / IT / Chapter 3'.",
        "Double-click a file, and the OS opens it with the right app.",
      ],
      whyItMatters:
        "Good folder habits now = you never lose an assignment, a wedding photo, or a job application PDF again.",
    },
    {
      title: "Managing apps",
      caption: "Install once. Update often. Remove what you don't need.",
      bullets: [
        "Install only from trusted stores — Play Store, App Store, Microsoft Store.",
        "Updates fix security holes. Turn on auto-update.",
        "Uninstall old apps to save storage and reduce risk.",
      ],
      whyItMatters:
        "Most malware caught in Cambodia hides inside pirated or outdated apps. Buying real software is the cheapest security investment you'll make.",
    },
  ],
  closing: {
    headline: "Software = the instructions",
    body: "You now know why the same laptop can do a thousand things — hardware stays, software swaps.",
    bullets: [
      "Try tidying your Downloads folder this week — put every file in a real home.",
      "Next chapter — how these machines talk to each other.",
    ],
    charge:
      "The tidiest phone in the class is often the fastest, cheapest, and safest one. That's your project this week.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 4 — Networking & Internet
 * ────────────────────────────────────────────────────────────── */

const NETWORKING: ChapterDeck = {
  lessonKey: "networking",
  chapterNumber: "4",
  hook: "How computers talk — from the phone in your pocket to a server on the other side of the world.",
  agenda: [
    "Networks by size (PAN → LAN → MAN → WAN)",
    "IP and MAC addresses",
    "Switches and routers",
    "Ports and protocols",
    "Ping and Tracert",
    "VPN and bandwidth",
    "Cloud computing",
    "Live demo: home → global",
    "Live demo: OSI 7 layers",
  ],
  visualIds: [
    "networks",
    "ip-mac",
    "switches-routers",
    "ports-protocols",
    "ping-tracert",
    "vpn",
    "bandwidth",
    "cloud",
    "internet-flow",
    "osi-model",
  ],
  flowSteps: [
    "Networks come in sizes",
    "Each device has an IP + MAC",
    "Switches / routers move data",
    "Doors = ports, rules = protocols",
    "Ping + tracert to diagnose",
    "VPN + bandwidth shape UX",
    "Cloud puts servers everywhere",
    "The whole trip in 200 ms",
    "The OSI 7 layers, wrapped",
  ],
  subtopics: [
    {
      title: "Networks by size",
      caption: "Networks are grouped by how far they reach.",
      bullets: [
        "PAN — around your body (phone <-> earbuds).",
        "LAN — a building (IDIC campus Wi-Fi).",
        "MAN — a city (Phnom Penh fibre backbone).",
        "WAN — the whole world (the Internet itself).",
      ],
      whyItMatters:
        "Your phone is part of a PAN, LAN, MAN, and WAN all at the same time — right now. That's normal, not magic.",
    },
    {
      title: "IP & MAC Addresses",
      caption: "Your device has two IDs — one changes, one never does.",
      bullets: [
        "IP — where you are RIGHT NOW; changes with each Wi-Fi.",
        "MAC — burned into the network card at the factory; never changes.",
        "Together, they tell the network exactly where to deliver data.",
      ],
      whyItMatters:
        "This is how a Wing transfer reaches the right phone in Kampong Cham and not your neighbour's — precise addressing at every hop.",
    },
    {
      title: "Switches & Routers",
      caption: "A switch links devices inside a building. A router links networks together.",
      bullets: [
        "Switch — local traffic between office computers.",
        "Router — connects your LAN to the wider Internet.",
        "Home Wi-Fi boxes are actually both devices in one.",
      ],
      whyItMatters:
        "That's why a home Wi-Fi box costs more than a plain switch — you're paying for two devices in one plastic shell.",
    },
    {
      title: "Ports & Protocols",
      caption: "A server has many numbered doors — different services listen on different ports.",
      bullets: [
        "Port 80 — regular websites (HTTP).",
        "Port 443 — secure websites (HTTPS).",
        "Port 22 — remote login (SSH).",
      ],
      whyItMatters:
        "When you open Facebook (443) and SSH into a Raspberry Pi (22), you're knocking on different doors of the same building.",
    },
    {
      title: "Ping & Tracert",
      caption: "Two small tools every IT student should know.",
      bullets: [
        "ping — 'Are you there?' Returns time in milliseconds.",
        "tracert — shows every stop on the way.",
        "Both work in the Windows and macOS terminal, no install needed.",
      ],
      whyItMatters:
        "Two minutes with ping and tracert can prove that a slow-loading site is your ISP's fault, not the website's — and save you an argument.",
    },
    {
      title: "VPN",
      caption: "Encrypts your connection so no one in the middle can read it.",
      bullets: [
        "Useful on café or airport Wi-Fi.",
        "Hides your traffic even from the network owner.",
        "The VPN provider can still see your data — pick a trusted one.",
      ],
      whyItMatters:
        "Free café Wi-Fi is a gift. Without a VPN, it can also be a trap — and coffee shops in Phnom Penh don't audit their networks.",
    },
    {
      title: "Bandwidth",
      caption: "How much data your connection carries per second.",
      bullets: [
        "Download — data coming to you (streaming, browsing).",
        "Upload — data going from you (video calls, backups).",
        "Ping — reaction time; low ping matters for gaming and calls.",
      ],
      whyItMatters:
        "This is why 10 Mbps is fine for Netflix but painful for a Zoom class. Upload matters as much as download in modern life.",
    },
    {
      title: "Cloud Computing",
      caption: "Someone else's computer, rented by the second, from a datacentre.",
      bullets: [
        "Gmail, Google Docs, and Netflix all run in the cloud.",
        "Your files stay safe if your phone breaks.",
        "You pay only for what you use.",
      ],
      whyItMatters:
        "Your Google Docs homework isn't on your laptop — it's on a Google server in Singapore, safe even if your laptop drowns in a monsoon.",
    },
  ],
  closing: {
    headline: "You can trace a message end-to-end",
    body: "From your phone in Siem Reap to a friend in Phnom Penh, you understand every hop the message takes.",
    bullets: [
      "Try 'tracert google.com' after class — count the hops.",
      "Next chapter — what actually lives on those servers.",
    ],
    charge:
      "Every IT support job in Cambodia starts with 'the Wi-Fi is slow.' You now have four tools to actually answer that question.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 5 — Web Technology
 * ────────────────────────────────────────────────────────────── */

const WEB: ChapterDeck = {
  lessonKey: "web",
  chapterNumber: "5",
  hook: "Websites, browsers, and everything that makes the web work.",
  agenda: [
    "HTML & CSS — pages and style",
    "JavaScript & PHP — client and server",
    "WordPress — 40% of the web",
    "Domains, hosting, DNS",
    "ICANN, IANA, WHOIS",
    "TCP/IP and the whole journey",
  ],
  visualIds: [
    "html-css",
    "js-php",
    "wordpress",
    "domains-hosting",
    "dns",
    "icann-iana",
    "whois",
    "tcp-ip",
    "how-internet-works",
  ],
  flowSteps: [
    "HTML + CSS paint the page",
    "JS + PHP make it dynamic",
    "WordPress adds a UI on top",
    "You rent a domain + hosting",
    "DNS turns names into IPs",
    "ICANN keeps names unique",
    "WHOIS is the domain's card",
    "TCP/IP is the shared tongue",
    "The full journey, 200 ms",
  ],
  subtopics: [
    {
      title: "HTML & CSS",
      caption: "HTML gives a page its structure. CSS gives it colour and style.",
      bullets: [
        "HTML — headings, paragraphs, images, links.",
        "CSS — fonts, colours, spacing, layout.",
        "The browser reads both and paints the page.",
      ],
      whyItMatters:
        "Every Cambodian news site — Khmer Times, Phnom Penh Post, KhmerLoad — is HTML for structure plus CSS for style. Just those two.",
    },
    {
      title: "JavaScript & PHP",
      caption: "JavaScript runs in the browser. PHP runs on the server.",
      bullets: [
        "JavaScript — makes pages interactive (clicks, animations).",
        "PHP — reads a database and sends HTML back.",
        "Together they build every dynamic site you use.",
      ],
      whyItMatters:
        "Every Facebook 'like' you tap is JavaScript on your phone plus PHP on a server 8000 km away — running in under 200 ms.",
    },
    {
      title: "WordPress",
      caption: "A drag-and-drop dashboard for building websites.",
      bullets: [
        "About 40% of the whole web runs on it.",
        "Blocks, themes, and plugins — no coding needed for the basics.",
        "Small Cambodian businesses run WordPress by the thousands.",
      ],
      whyItMatters:
        "Most cafés, tour operators, and garment shops in Phnom Penh have WordPress sites. You can build the next one — with skills you'll have by December.",
    },
    {
      title: "Domains & Hosting",
      caption: "You rent a name (the domain) and a place for the files (hosting).",
      bullets: [
        "Domain — the address, e.g. idic.edu.kh.",
        "Hosting — the actual machine that stores the files.",
        "The domain points at the hosting server's IP.",
      ],
      whyItMatters:
        "For about $10 a year you can register your-name.com and run a real portfolio site — the same setup a business would use.",
    },
    {
      title: "DNS",
      caption: "The phone book of the internet.",
      bullets: [
        "Type a name — DNS returns an IP address.",
        "Answers are cached everywhere for speed.",
        "A typical lookup takes only 20–30 milliseconds.",
      ],
      whyItMatters:
        "If DNS breaks, the whole internet feels broken. This is often what's actually happening on those 'bad Wi-Fi' days.",
    },
    {
      title: "ICANN & IANA",
      caption: "Who keeps every domain and IP number unique across the planet.",
      bullets: [
        "ICANN oversees the naming system.",
        "IANA assigns number blocks to each region.",
        "13 root DNS server clusters anchor the whole system.",
      ],
      whyItMatters:
        "No two websites in the world share the same name — a quietly beautiful system that just works, everywhere, every day.",
    },
    {
      title: "WHOIS",
      caption: "Public database showing who registered a domain.",
      bullets: [
        "Shows the registrant, registrar, and dates.",
        "'Business card' for every domain name.",
        "Run 'whois idic.edu.kh' in a terminal to try it.",
      ],
      whyItMatters:
        "Before you buy a domain someone else parked, WHOIS tells you when it expires. A small trick that saves real money.",
    },
    {
      title: "TCP/IP",
      caption: "Data travels through four layers — envelopes inside envelopes.",
      bullets: [
        "Application — HTTP, FTP, DNS.",
        "Transport — TCP or UDP, cuts data into packets.",
        "Internet — IP, routes each packet.",
        "Link — cables and Wi-Fi hardware.",
      ],
      whyItMatters:
        "This is the shared language every device on the planet agreed on — no exceptions, since the 1980s. Learn it once and it never changes.",
    },
    {
      title: "How the Internet Works",
      caption: "Six steps between typing a URL and seeing the page.",
      bullets: [
        "Browser -> DNS lookup -> TLS handshake.",
        "Routers relay packets across the world.",
        "Server responds -> screen paints — all in ~200 ms.",
      ],
      whyItMatters:
        "You now know what happens in the 0.2 seconds between pressing Enter and seeing Facebook. Most people never will.",
    },
  ],
  closing: {
    headline: "You understand the whole journey",
    body: "From typing idic.edu.kh to seeing the page load — every step now has a name you know.",
    bullets: [
      "Inspect any Cambodian news site with your browser's dev tools.",
      "Next chapter — how to keep all of this safe.",
    ],
    charge:
      "Anyone in Cambodia who can build and ship a real website has a career. You are three chapters away from being that person.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 6 — Cybersecurity
 * ────────────────────────────────────────────────────────────── */

const SECURITY: ChapterDeck = {
  lessonKey: "security",
  chapterNumber: "6",
  hook: "Keeping your data, your money, and your identity safe online.",
  agenda: [
    "The CIA triad (Confidentiality, Integrity, Availability)",
    "Ethical hacking vs criminal hacking",
    "The three hacker personas",
    "Malware and DoS attacks",
    "Common attacks and their defenses",
    "Phishing — spot the red flags",
    "Layered defenses",
  ],
  visualIds: [
    "security-fundamentals",
    "hacking",
    "hackers",
    "malware",
    "dos",
    "common-attacks",
    "phishing-vishing",
    "defenses",
  ],
  flowSteps: [
    "Start with the CIA triad",
    "Understand hacking as a skill",
    "Know the 3 hacker types",
    "Recognise malware families",
    "Learn DoS / DDoS attacks",
    "Memorise common attack fixes",
    "Spot phishing red flags",
    "Layer many defenses",
  ],
  subtopics: [
    {
      title: "The CIA Triad",
      caption: "Every safe system tries to protect three things at once.",
      bullets: [
        "Confidentiality — only the right people see the data.",
        "Integrity — the data isn't tampered with.",
        "Availability — the service is up when users need it.",
      ],
      whyItMatters:
        "Every real security decision — banking, hospital records, exam papers — is a trade-off between these three. Not four. Not two.",
    },
    {
      title: "Hacking",
      caption: "Finding creative ways to make a system do something new.",
      bullets: [
        "Ethical hackers scan for weaknesses, then report them.",
        "Tools — nmap, Wireshark, vulnerability scanners.",
        "Responsible disclosure — tell the owner, give them time to fix.",
      ],
      whyItMatters:
        "Ethical hacking is a well-paid path in Cambodia — several banks in Phnom Penh now run bug bounties that pay in USD.",
    },
    {
      title: "Types of Hackers",
      caption: "Separated not by skill but by motive.",
      bullets: [
        "White hat — helper; works for the defenders.",
        "Grey hat — motives unclear; may hack without permission.",
        "Black hat — criminal; steals data or money.",
      ],
      whyItMatters:
        "The tools are the same. Only the motive changes. That's why the world needs strong laws AND strong ethics — one alone isn't enough.",
    },
    {
      title: "Malware",
      caption: "Bad software that steals, spies, or locks your files.",
      bullets: [
        "Virus, Worm, Trojan — different ways of spreading.",
        "Ransomware locks your files until you pay.",
        "Antivirus catches most of it and puts it in quarantine.",
      ],
      whyItMatters:
        "Most malware in Cambodia hides in pirated Windows and cracked software. Legal software is the cheapest security you'll ever buy.",
    },
    {
      title: "DoS & DDoS Attacks",
      caption: "Flooding a site with fake requests so real users can't get in.",
      bullets: [
        "DoS — one attacker; DDoS — thousands of hijacked machines.",
        "Botnets can send millions of requests per second.",
        "Defended with rate limits, filtering, and cloud shields.",
      ],
      whyItMatters:
        "When a Cambodian bank goes offline for 'maintenance' during a busy afternoon, it's often a DDoS. Real customers can't pay their bills for hours.",
    },
    {
      title: "Common Attacks",
      caption: "Four attacks every developer must know — each has a one-line defense.",
      bullets: [
        "SQL injection — always use parameterised queries.",
        "XSS — escape user input before rendering it.",
        "CSRF — use CSRF tokens.",
        "Password reuse — use a password manager.",
      ],
      whyItMatters:
        "Every junior developer interview in Phnom Penh asks about at least two of these. Memorise the defense line — that's what gets you hired.",
    },
    {
      title: "Phishing",
      caption: "Fake emails or messages that trick you into clicking.",
      bullets: [
        "Check the sender's real email address, not just the display name.",
        "Urgent tone ('act NOW!') = suspicious.",
        "Never click bit.ly-style shortened links in bank emails.",
      ],
      whyItMatters:
        "The 'ABA account verification' SMS is almost always a scam. Real banks never text you links. Teach your parents this — they'll thank you.",
    },
    {
      title: "Defenses in Depth",
      caption: "No single wall stops everything — layer many small defenses.",
      bullets: [
        "Strong password + 2FA on every important account.",
        "Encryption for data in motion (HTTPS) and at rest.",
        "Firewalls, updates, and regular backups.",
      ],
      whyItMatters:
        "Turning on 2FA everywhere is a five-minute habit that stops 99% of account takeovers. Start today with your Wing account.",
    },
  ],
  closing: {
    headline: "Security is a habit, not a product",
    body: "One weekly check — passwords, backups, updates — protects more than any single tool ever will.",
    bullets: [
      "Turn on 2FA for your ABA or Wing account this week.",
      "Next chapter — the AI systems that are now part of security too.",
    ],
    charge:
      "You are now the family expert. When Ma or Pa gets a fishy SMS, they'll ask you first. Don't take that lightly.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 7 — Artificial Intelligence
 * ────────────────────────────────────────────────────────────── */

const AI: ChapterDeck = {
  lessonKey: "ai",
  chapterNumber: "7",
  hook: "Machines that learn from examples — the same idea behind ChatGPT, Google Translate, and face unlock.",
  agenda: [
    "What AI is (and isn't)",
    "Machine learning basics",
    "Deep learning and neural networks",
    "Natural Language Processing (NLP)",
    "AI ethics",
    "The future — your part in it",
  ],
  visualIds: [
    "ai",
    "machine-learning",
    "deep-learning",
    "nlp",
    "ai-ethics",
    "future-of-ai",
  ],
  flowSteps: [
    "AI = trained from examples",
    "Machine learning finds patterns",
    "Deep learning stacks layers",
    "NLP handles language",
    "Ethics comes before code",
    "The future is yours to build",
  ],
  subtopics: [
    {
      title: "What is AI?",
      caption: "Computers that read, write, see, and decide — a little like a person.",
      bullets: [
        "Not magic — trained from millions of examples.",
        "Best at narrow tasks (translate, classify, transcribe).",
        "Still makes mistakes — always double-check important answers.",
      ],
      whyItMatters:
        "The Khmer voice assistant on your phone is AI. So is your camera's face unlock. It's not the future — it's already in your pocket.",
    },
    {
      title: "Machine Learning",
      caption: "Show the computer many examples. It learns the pattern.",
      bullets: [
        "Feed it 10,000 photos labelled 'cat' or 'dog'.",
        "It learns which pixels are cat-ish and which are dog-ish.",
        "Then it can guess new photos it has never seen.",
      ],
      whyItMatters:
        "This is why Google Photos can find every picture of your grandmother in seconds — it learned her face from your gallery.",
    },
    {
      title: "Deep Learning",
      caption: "Layers of tiny math cells connected like a brain.",
      bullets: [
        "Input -> hidden layers of 'thinking' -> answer.",
        "More layers = deeper = harder problems (voice, vision).",
        "Powers Khmer voice apps, medical imaging, self-driving cars.",
      ],
      whyItMatters:
        "The next wave of Cambodian medical apps — TB screening, malaria detection, dental x-ray — will run on this exact idea.",
    },
    {
      title: "Language (NLP)",
      caption: "Teaching AI to understand and write like a person.",
      bullets: [
        "Google Translate — English <-> Khmer with growing accuracy.",
        "ChatGPT — answers questions and drafts text.",
        "Voice assistants transcribe your Khmer speech into commands.",
      ],
      whyItMatters:
        "AI Khmer translation is still rough. Knowing how it works helps you spot when it's wrong — before you submit that translated homework.",
    },
    {
      title: "AI Ethics",
      caption: "AI is powerful — use it kindly, honestly, carefully.",
      bullets: [
        "Never paste private data (IDs, passwords) into a chatbot.",
        "Verify AI answers before quoting them in your homework.",
        "Ask — who benefits, and who could be harmed, by this AI?",
      ],
      whyItMatters:
        "AI can sound confident and still be wrong. Verify first, trust second — otherwise the AI's mistake becomes your exam grade.",
    },
    {
      title: "The Future",
      caption: "AI is only just beginning — your generation will shape it.",
      bullets: [
        "Cambodian voice, farm imagery, garment factories — fresh problems for AI.",
        "Learn to use AI as a tool, not a replacement for your thinking.",
        "Stay curious, keep learning.",
      ],
      whyItMatters:
        "The most valuable skill in five years won't be knowing what AI can do. It'll be knowing what it SHOULD do — for Cambodia, for people, for you.",
    },
  ],
  closing: {
    headline: "AI is a tool, not a person",
    body: "The best future belongs to people who understand both the AI and the problem it's solving in their own community.",
    bullets: [
      "Try a Khmer <-> English translation and note where AI gets it wrong.",
      "Next chapter — put everything together and celebrate.",
    ],
    charge:
      "Be the person in Cambodia who understands both sides — the technology AND the people it serves. That's rare. That's you, if you keep going.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter 8 — Conclusion
 * ────────────────────────────────────────────────────────────── */

const CONCLUSION: ChapterDeck = {
  lessonKey: "conclusion",
  chapterNumber: "8",
  hook: "You started with parts you could touch and finished with machines that learn. Not bad for one course.",
  agenda: [
    "What you can now do",
    "The four big skills you've earned",
    "How to keep learning after IDIC",
    "Your certificate",
  ],
  subtopics: [
    {
      title: "You know the parts",
      caption: "Every major hardware component has a name and a job you can explain.",
      bullets: [
        "CPU, RAM, storage, motherboard, BIOS.",
        "You can open a laptop and identify each piece.",
        "You know why more RAM helps, and why a faster CPU helps more.",
      ],
      whyItMatters:
        "Most Cambodians can't name what's inside their own laptop. You can. That's the first difference between a user and a professional.",
    },
    {
      title: "You know the internet",
      caption: "From typing a URL to the page rendering, every step has a name.",
      bullets: [
        "DNS -> TLS -> routers -> server -> browser.",
        "You understand ports, protocols, and how a VPN protects you.",
        "You can trace a real request with tracert.",
      ],
      whyItMatters:
        "Every IT support role in Cambodia starts with 'why is the internet slow?' You can now actually answer that — with a tool, not a guess.",
    },
    {
      title: "You know how to stay safe",
      caption: "You can spot phishing, use 2FA, and pick strong passwords.",
      bullets: [
        "You know the CIA triad and the four common attacks.",
        "You back up your work and update your software.",
        "You never share private data with a chatbot.",
      ],
      whyItMatters:
        "You are now the family expert. That role will follow you for life — take it seriously and it becomes a career.",
    },
    {
      title: "You met AI",
      caption: "You can explain machine learning without hype or fear.",
      bullets: [
        "You know why AI needs a lot of examples.",
        "You understand the ethical questions before the technical ones.",
        "You see AI as a helpful tool, not a magic answer.",
      ],
      whyItMatters:
        "In five years, being calm and clear about AI will be as important as knowing English is today. You're ahead already.",
    },
    {
      title: "Keep learning",
      caption: "This course is a foundation, not a finish line.",
      bullets: [
        "Pick one topic you loved and go deeper (networking? AI? security?).",
        "Build a small project — even a personal website teaches everything.",
        "Ask 'how does that work?' every single day.",
      ],
      whyItMatters:
        "One deep skill beats ten shallow ones. Pick your favourite chapter this week and spend one year with it — you'll be an expert by graduation.",
    },
  ],
  closing: {
    headline: "Congratulations, class",
    body: "You've completed the IDIC Introduction to Information Technology course. The next step is yours to take.",
    bullets: [
      "Print your certificate from the online page.",
      "Come back to any chapter's deck whenever you need a refresher.",
    ],
    charge:
      "Cambodia needs people who understand technology AND their community. That's you now — go build something that matters.",
  },
};

/* ─────────────────────────────────────────────────────────────────
 * Export
 * ────────────────────────────────────────────────────────────── */

export const DECKS: Record<string, ChapterDeck> = {
  welcome: WELCOME,
  hardware: HARDWARE,
  software: SOFTWARE,
  networking: NETWORKING,
  web: WEB,
  security: SECURITY,
  ai: AI,
  conclusion: CONCLUSION,
};
