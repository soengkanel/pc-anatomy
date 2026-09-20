// End-of-chapter "Key Learning" data — a compact mindmap of the chapter's
// main branches plus a short takeaways list students should be able to
// recall after the lesson. Rendered by <KeyLearning> and picked up as the
// last slide of every chapter's PDF deck.

export type MindmapBranch = {
  /** Short branch title (2-3 words). */
  label: string;
  /** One-word hint under the label so the branch reads like a mini-flashcard. */
  hint: string;
};

export type ChapterSummary = {
  emoji: string;
  /** Short chapter name for the mindmap centre (usually 1-2 words). */
  title: string;
  /** Central-node color hint — one of the tailwind accent classes we already use. */
  accent: "sky" | "amber" | "emerald" | "violet" | "rose" | "fuchsia";
  /** 4–8 mindmap spokes around the centre node. */
  branches: MindmapBranch[];
  /** 5–7 short one-liners the student should be able to recite. */
  takeaways: string[];
};

/* ─────────────────────────────────────────────────────────────────
 * Chapter summaries
 * Cambodian context is preserved in the takeaways where it fits
 * naturally (Wing, ABA, riel, monsoon, tuk-tuk, kuy teav).
 * ────────────────────────────────────────────────────────────── */

export const CHAPTER_SUMMARIES: Record<string, ChapterSummary> = {
  hardware: {
    emoji: "⚙️",
    title: "Hardware",
    accent: "sky",
    branches: [
      { label: "CPU", hint: "the brain" },
      { label: "RAM", hint: "short memory" },
      { label: "Storage", hint: "long memory" },
      { label: "Cache & ROM", hint: "helpers" },
      { label: "BIOS & CMOS", hint: "wake-up" },
      { label: "Motherboard", hint: "the highway" },
    ],
    takeaways: [
      "Hardware = anything you can TOUCH inside a computer.",
      "The CPU does the thinking; RAM holds what's open right now.",
      "Storage keeps your files; RAM forgets them at power-off.",
      "The motherboard is the shared highway between every part.",
      "BIOS runs first, then hands control to the operating system.",
      "More RAM is the cheapest laptop speed-up you can buy in Phnom Penh.",
    ],
  },

  software: {
    emoji: "🪄",
    title: "Software",
    accent: "violet",
    branches: [
      { label: "Apps", hint: "layer 3" },
      { label: "Operating System", hint: "layer 2" },
      { label: "Hardware", hint: "layer 1" },
      { label: "Files & Folders", hint: "your work" },
      { label: "Install", hint: "trusted stores" },
      { label: "Update", hint: "safety" },
    ],
    takeaways: [
      "Software = the instructions running on top of hardware.",
      "Three layers: apps sit on the OS, the OS sits on the machine.",
      "The OS manages files, memory, and every running app.",
      "Files live in folders inside folders — one clear home each.",
      "Only install from trusted stores; auto-updates fix security holes.",
      "Software changes; hardware stays put. Same laptop, thousands of jobs.",
    ],
  },

  networking: {
    emoji: "🌐",
    title: "Networking",
    accent: "emerald",
    branches: [
      { label: "PAN → WAN", hint: "sizes" },
      { label: "IP & MAC", hint: "IDs" },
      { label: "Switch & Router", hint: "movers" },
      { label: "Ports & Protocols", hint: "doors" },
      { label: "Ping & Tracert", hint: "diagnose" },
      { label: "VPN", hint: "encrypt" },
      { label: "Cloud", hint: "rented" },
    ],
    takeaways: [
      "Networks scale from PAN (body) through LAN, MAN, up to WAN (world).",
      "IP changes with each Wi-Fi; MAC is fixed at the factory.",
      "A switch handles local traffic; a router links to the internet.",
      "Ports are numbered doors — 80/443 for web, 22 for SSH.",
      "ping asks 'are you there?'; tracert shows every stop on the way.",
      "A VPN encrypts traffic so café Wi-Fi in PP is safe to use.",
      "Cloud = renting someone else's computer by the second.",
    ],
  },

  web: {
    emoji: "🌍",
    title: "The Web",
    accent: "sky",
    branches: [
      { label: "HTML & CSS", hint: "page" },
      { label: "JS & PHP", hint: "logic" },
      { label: "WordPress", hint: "40% of web" },
      { label: "Domain & Hosting", hint: "name + place" },
      { label: "DNS", hint: "phone book" },
      { label: "TCP/IP", hint: "shared tongue" },
      { label: "6-step journey", hint: "200 ms" },
    ],
    takeaways: [
      "HTML = structure, CSS = style, JavaScript = interaction.",
      "PHP runs on the server; JavaScript runs in your browser.",
      "You rent a domain (name) and a hosting server (files).",
      "DNS turns idic.edu.kh into an IP in about 30 milliseconds.",
      "TCP/IP is the language every device on Earth agreed on.",
      "A page loads in ~200 ms across 6 predictable steps.",
    ],
  },

  security: {
    emoji: "🛡️",
    title: "Cybersecurity",
    accent: "rose",
    branches: [
      { label: "CIA Triad", hint: "big 3" },
      { label: "Hackers", hint: "3 motives" },
      { label: "Malware", hint: "bad code" },
      { label: "DoS / DDoS", hint: "floods" },
      { label: "Phishing", hint: "fake urgency" },
      { label: "Defenses", hint: "layers" },
    ],
    takeaways: [
      "Every safe system balances Confidentiality, Integrity, Availability.",
      "White / grey / black hats — separated by motive, not skill.",
      "Antivirus catches most malware; keep it updated.",
      "DDoS floods a service with fake traffic to lock real users out.",
      "Phishing exploits urgency — check the sender before you click.",
      "One habit — 2FA on every important account — stops 99% of takeovers.",
      "Pirated software is where most malware hides in Cambodia.",
    ],
  },

  ai: {
    emoji: "🤖",
    title: "AI",
    accent: "fuchsia",
    branches: [
      { label: "Machine Learning", hint: "patterns" },
      { label: "Deep Learning", hint: "layers" },
      { label: "NLP", hint: "language" },
      { label: "Ethics", hint: "before code" },
      { label: "Future", hint: "your part" },
    ],
    takeaways: [
      "AI = trained from thousands of examples, not magic.",
      "Machine learning finds patterns in labelled data.",
      "Deep learning stacks many hidden 'thinking' layers.",
      "NLP is behind Khmer voice assistants and Google Translate.",
      "Verify AI answers before you paste them into your homework.",
      "The valuable skill is knowing what AI SHOULD do — for Cambodia.",
    ],
  },
};
