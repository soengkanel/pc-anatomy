"use client";

// KeyDifferences.tsx: A modal shown on the Explore page that lists the
// component pairs students most often confuse (CPU vs GPU, RAM vs Storage,
// HDD vs SSD vs M.2 NVMe, and so on). Each card gives a side-by-side
// comparison plus a plain-language analogy so the distinction sticks.
import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Cable,
  CalendarClock,
  Cpu,
  Database,
  Gauge,
  GitCompareArrows,
  Globe,
  HardDrive,
  HelpCircle,
  Lightbulb,
  MemoryStick,
  Monitor,
  Network,
  Plug,
  Radio,
  Router,
  Shield,
  Signal,
  Sparkles,
  Usb,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DiffColumn = {
  title: string;
  subtitle: string;
  points: string[];
  tone: "blue" | "amber" | "violet";
  // Optional reference photo shown at the top of the column. URLs use
  // Wikimedia Commons' Special:FilePath (stable, follows any rename).
  image?: {
    url: string;
    alt: string;
    credit: string; // "Author, License"
  };
  // Short "why we need this option" (1 sentence) and "when to pick it"
  // (1 sentence) shown in a side-by-side grid at the bottom of the card so
  // students can compare choices directly.
  why?: string;
  when?: string;
};

type DiffCard = {
  id: string;
  category: string;
  question: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  columns: DiffColumn[];
  analogy: string;
  remember: string;
};

const CARDS: DiffCard[] = [
  {
    id: "cpu-vs-gpu",
    category: "Processing",
    question: "CPU vs GPU — both process, so what's different?",
    icon: Cpu,
    columns: [
      {
        title: "CPU",
        subtitle: "Central Processing Unit",
        tone: "blue",
        points: [
          "A few very powerful cores (4–24).",
          "Runs one heavy task at a time, extremely fast.",
          "General-purpose: OS, apps, logic, decisions.",
          "Optimised for latency (finish one job quickly).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Intel_i9-14900KF_CPU.jpg",
          alt: "An Intel Core i9-14900KF processor",
          credit: "Pstrahl / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Runs the OS, apps, and logic that make the computer usable.",
        when: "The PC feels slow at general tasks or you're compiling / running apps.",
      },
      {
        title: "GPU",
        subtitle: "Graphics Processing Unit",
        tone: "violet",
        points: [
          "Thousands of small, simple cores.",
          "Runs many tiny tasks in parallel.",
          "Specialised: graphics, video, AI, physics.",
          "Optimised for throughput (finish many jobs).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/RTX_5080.png",
          alt: "An NVIDIA GeForce RTX 5080 graphics card",
          credit: "XD7006 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Draws graphics and does the parallel math for games and AI.",
        when: "Gaming, video editing, 3D modelling, or AI/ML workloads.",
      },
    ],
    analogy:
      "CPU is one professor solving one hard problem quickly. GPU is a stadium of students each solving one easy problem at the same time.",
    remember: "CPU = brain. GPU = muscle. You need both.",
  },
  {
    id: "ram-vs-storage",
    category: "Memory",
    question: "RAM vs Storage — aren't they both memory?",
    icon: MemoryStick,
    columns: [
      {
        title: "RAM",
        subtitle: "Random Access Memory (Primary)",
        tone: "blue",
        points: [
          "Volatile — everything is lost when power is off.",
          "Extremely fast (ns access), small (8–64 GB).",
          "Temporary workspace the CPU is actively using.",
          "Measured in GB.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
          alt: "A 16 GiB DDR4 RAM DIMM stick",
          credit: "PantheraLeo1359531 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Fast temporary workspace the CPU holds live data in.",
        when: "You run many apps at once or work with large files.",
      },
      {
        title: "Storage (SSD / HDD)",
        subtitle: "Secondary Storage",
        tone: "amber",
        points: [
          "Non-volatile — keeps data with the power off.",
          "Slower than RAM, much larger (256 GB – 8 TB).",
          "Permanent home for files, apps, and the OS.",
          "Measured in GB or TB.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_870_QVO_8TB_SATA_2,5_Zoll_Internes_Solid_State_Drive_(SSD)_(MZ-77Q8T0BW)_20211008_SSD023_corr.png",
          alt: "A Samsung 870 QVO 8TB 2.5-inch SATA SSD",
          credit: "PantheraLeo1359531 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Permanent home for the OS, apps, and files across reboots.",
        when: "Anything you want to keep long-term — always required.",
      },
    ],
    analogy:
      "RAM is your desk — what you are working on right now. Storage is the filing cabinet — where everything lives when you leave the office.",
    remember: "More RAM = more open tabs. More storage = more files.",
  },
  {
    id: "hdd-vs-ssd-vs-nvme",
    category: "Storage",
    question: "HDD vs SATA SSD vs M.2 NVMe SSD",
    icon: HardDrive,
    columns: [
      {
        title: "HDD",
        subtitle: "Hard Disk Drive",
        tone: "amber",
        points: [
          "Mechanical — spinning magnetic platters.",
          "~80–160 MB/s. Loud, heavy, fragile.",
          "Cheapest per TB — great for bulk storage.",
          "SATA cable + power cable.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hatachi_500_GB_hard_drive,_2011.jpg",
          alt: "A Hitachi 500 GB 3.5-inch hard disk drive",
          credit: "Bubba73 / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Cheapest per TB — for bulk cold data you rarely open.",
        when: "Movie/photo libraries, backups, archive drives.",
      },
      {
        title: "SATA SSD",
        subtitle: "2.5\" Solid State Drive",
        tone: "blue",
        points: [
          "Flash memory — no moving parts.",
          "~550 MB/s (limited by the SATA cable).",
          "Silent, shock-resistant, uses less power.",
          "SATA cable + power cable.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_870_QVO_8TB_SATA_2,5_Zoll_Internes_Solid_State_Drive_(SSD)_(MZ-77Q8T0BW)_20211008_SSD023_corr.png",
          alt: "A Samsung 870 QVO 8TB 2.5-inch SATA SSD",
          credit: "PantheraLeo1359531 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Modernises old PCs and laptops with a straight cable swap.",
        when: "Upgrading a system that has no M.2 slot.",
      },
      {
        title: "M.2 NVMe SSD",
        subtitle: "Gumstick-shaped SSD on PCIe",
        tone: "violet",
        points: [
          "Flash memory over the PCIe bus.",
          "~3,500–14,000 MB/s (6–25× a SATA SSD).",
          "Plugs directly into the motherboard, no cables.",
          "Best for OS, games, video editing.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg",
          alt: "A Samsung 980 Pro PCIe 4.0 NVMe M.2 SSD",
          credit: "D-Kuru / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Fastest common storage — best boot and load times.",
        when: "OS drive, huge games, video editing scratch disks.",
      },
    ],
    analogy:
      "HDD is a vinyl record player, SATA SSD is a CD player, M.2 NVMe is a streaming service — same music, wildly different speed.",
    remember:
      "M.2 is the SHAPE (the slot). NVMe is the PROTOCOL (the speed). SATA is the SLOW protocol some M.2 drives still use.",
  },
  {
    id: "m2-sata-vs-nvme",
    category: "Storage",
    question: "M.2 SATA vs M.2 NVMe — they look identical!",
    icon: Database,
    columns: [
      {
        title: "M.2 SATA",
        subtitle: "M.2 form factor, SATA protocol",
        tone: "amber",
        points: [
          "Uses the SATA bus (~550 MB/s ceiling).",
          "Has TWO notches (B+M key).",
          "Same speed as a 2.5\" SATA SSD.",
          "Cheaper, older.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/SAMSUNG_M.2_SATA_SSD_PM871a_256GB.jpg",
          alt: "A Samsung M.2 SATA SSD with two notches (B+M key)",
          credit: "Dinkun Chen / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Same speed as a 2.5\" SATA SSD in a cleaner M.2 form factor.",
        when: "Cheaper M.2 upgrade on older boards without NVMe support.",
      },
      {
        title: "M.2 NVMe",
        subtitle: "M.2 form factor, PCIe/NVMe protocol",
        tone: "violet",
        points: [
          "Uses PCIe lanes (thousands of MB/s).",
          "Has ONE notch (M key only).",
          "Up to 25× faster than M.2 SATA.",
          "Standard on modern builds.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg",
          alt: "A Samsung 980 Pro M.2 NVMe SSD with a single notch (M key)",
          credit: "D-Kuru / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Full PCIe speed — up to 25× faster than M.2 SATA.",
        when: "Modern build where boot and load speed matter.",
      },
    ],
    analogy:
      "Two cars the same shape — one has a lawn-mower engine, the other has a jet engine. The badge (SATA vs NVMe) tells you which.",
    remember: "Count the notches: 2 notches = SATA (slow), 1 notch = NVMe (fast).",
  },
  {
    id: "ram-vs-rom",
    category: "Memory",
    question: "RAM vs ROM",
    icon: Brain,
    columns: [
      {
        title: "RAM",
        subtitle: "Random Access Memory",
        tone: "blue",
        points: [
          "Read AND write freely.",
          "Volatile — cleared on shutdown.",
          "Holds the running OS, apps, and open files.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
          alt: "A 16 GiB DDR4 RAM DIMM stick",
          credit: "PantheraLeo1359531 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Holds the OS and apps while they are running.",
        when: "Every time the PC boots — more of it = more open apps.",
      },
      {
        title: "ROM",
        subtitle: "Read-Only Memory",
        tone: "amber",
        points: [
          "Read-only in normal use (fixed at manufacture).",
          "Non-volatile — keeps data with no power.",
          "Holds firmware like BIOS/UEFI that boots the PC.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/PokemonSilverBoard.jpg",
          alt: "A ROM chip on a Pokémon Silver cartridge PCB",
          credit: "Simon A. Eugster / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Stores the firmware (BIOS/UEFI) that starts the PC.",
        when: "Built-in — you only touch it during a BIOS update.",
      },
    ],
    analogy:
      "RAM is a whiteboard you erase every day. ROM is the sign on the building — permanent, always there.",
    remember: "RAM forgets. ROM remembers.",
  },
  {
    id: "cache-vs-ram",
    category: "Memory",
    question: "Cache vs RAM",
    icon: Zap,
    columns: [
      {
        title: "Cache (L1/L2/L3)",
        subtitle: "On-CPU memory",
        tone: "blue",
        points: [
          "Built INTO the CPU chip.",
          "Tiny (KB to a few MB) but the fastest memory.",
          "Holds data the CPU is about to reuse.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Pentium_P54C_Die.jpg",
          alt: "A Pentium P54C die shot showing on-chip cache blocks",
          credit: "Appaloosa / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Feeds the CPU data faster than RAM — reduces stalls.",
        when: "Larger cache pays off in games and code compilation.",
      },
      {
        title: "RAM",
        subtitle: "System memory (DIMM sticks)",
        tone: "violet",
        points: [
          "Separate sticks on the motherboard.",
          "Much bigger (GB) but ~100× slower than L1 cache.",
          "Feeds the cache when it misses.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
          alt: "A 16 GiB DDR4 RAM DIMM stick",
          credit: "PantheraLeo1359531 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Backs the cache with lots of workspace for open apps.",
        when: "Multitasking, big files, virtual machines.",
      },
    ],
    analogy:
      "Cache is the notes in your hand. RAM is the textbook on the desk. Storage is the library downstairs.",
    remember: "Closer to the CPU = smaller and faster.",
  },
  {
    id: "cores-vs-clock",
    category: "Processing",
    question: "Cores vs Clock Speed — which matters more?",
    icon: Cpu,
    columns: [
      {
        title: "Cores (& Threads)",
        subtitle: "How many jobs at once",
        tone: "blue",
        points: [
          "More cores = more tasks in parallel.",
          "Helps video editing, streaming, compiling, multitasking.",
          "Threads let one core juggle two tasks (Hyper-Threading / SMT).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Dual_Core_Generic.svg",
          alt: "A generic diagram of a dual-core processor",
          credit: "Dennis Schmitz / Public Domain · Wikimedia Commons",
        },
        why: "More parallel work — encoding, compiling, streaming.",
        when: "Content creation, servers, heavy multitasking.",
      },
      {
        title: "Clock Speed (GHz)",
        subtitle: "How fast each job runs",
        tone: "violet",
        points: [
          "More GHz = each single task finishes faster.",
          "Helps games, office apps, single-threaded work.",
          "Boost clock is the short-burst peak, base clock is the sustained floor.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Intel_i9-14900KF_CPU.jpg",
          alt: "An Intel Core i9-14900KF CPU (high clock speed)",
          credit: "Pstrahl / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Each single task finishes faster.",
        when: "Gaming, office apps, single-threaded work.",
      },
    ],
    analogy:
      "Cores = number of cashiers. Clock speed = how fast each cashier scans items. A long queue needs more cashiers; a quick errand needs a fast one.",
    remember:
      "Gaming loves GHz. Editing and rendering love cores. Modern CPUs give you both.",
  },
  {
    id: "igpu-vs-dgpu",
    category: "Graphics",
    question: "Integrated GPU vs Dedicated GPU",
    icon: Monitor,
    columns: [
      {
        title: "Integrated GPU (iGPU)",
        subtitle: "Built inside the CPU",
        tone: "amber",
        points: [
          "Shares system RAM — no extra card.",
          "Low power, silent, cheaper.",
          "Fine for browsing, video, light gaming.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/AMD_A10-4600M_(AM4600DEC44HJ)_APU-top_PNr%C2%B00811.jpg",
          alt: "An AMD A10-4600M APU (CPU with integrated graphics)",
          credit: "D-Kuru / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Free graphics that come with the CPU — enough for basics.",
        when: "Office PCs, media playback, budget builds, laptops.",
      },
      {
        title: "Dedicated GPU (dGPU)",
        subtitle: "Separate graphics card",
        tone: "violet",
        points: [
          "Has its own fast VRAM (GDDR6/GDDR6X).",
          "Uses lots of power, needs cooling.",
          "Required for serious gaming, 3D, AI, video work.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/RTX_5080.png",
          alt: "An NVIDIA GeForce RTX 5080 discrete graphics card",
          credit: "XD7006 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Dedicated card with its own VRAM for real graphics work.",
        when: "Modern gaming, video / 3D editing, AI / ML.",
      },
    ],
    analogy:
      "iGPU is the built-in camera on your phone. dGPU is a full DSLR — bigger, hungrier, dramatically better output.",
    remember: "If a PC has no dGPU, the CPU's iGPU is doing all the drawing.",
  },
  {
    id: "psu-watts-efficiency",
    category: "Power",
    question: "PSU Wattage vs 80+ Efficiency Rating",
    icon: Plug,
    columns: [
      {
        title: "Wattage (W)",
        subtitle: "How much power it can deliver",
        tone: "blue",
        points: [
          "The MAX power the PSU can supply (e.g., 650 W).",
          "Must exceed what the CPU + GPU + rest actually draw.",
          "Too small = shutdowns under load.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/PSU-Open1.jpg",
          alt: "An opened ATX PC power supply unit (PSU)",
          credit: "mboverload / Public Domain · Wikimedia Commons",
        },
        why: "Sizes the PSU to your components' actual power draw.",
        when: "Adding a hungrier GPU or CPU, or building a new PC.",
      },
      {
        title: "80+ Rating",
        subtitle: "How efficiently it converts power",
        tone: "amber",
        points: [
          "Bronze < Gold < Platinum < Titanium.",
          "Higher = less energy wasted as heat.",
          "Does NOT mean more power, just cleaner conversion.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/80_Plus_Gold.svg",
          alt: "The 80 Plus Gold efficiency certification badge",
          credit: "Ecos Consulting / Trademark · Wikimedia Commons",
        },
        why: "Higher rating = less waste heat, lower bills, cooler PSU.",
        when: "Buying a PSU you'll keep for many years.",
      },
    ],
    analogy:
      "Wattage = size of the fuel tank. 80+ rating = miles per gallon. A big tank with poor MPG is not the same as a modest tank sipping fuel.",
    remember: "Buy the wattage you need, then pick the best rating you can afford.",
  },
  {
    id: "bit-vs-byte",
    category: "Units",
    question: "Bit vs Byte — and MB/s vs Mbps",
    icon: GitCompareArrows,
    columns: [
      {
        title: "bit (b)",
        subtitle: "smallest unit — 0 or 1",
        tone: "amber",
        points: [
          "Lowercase b.",
          "Network speeds use bits: Mbps (megabits/sec).",
          "Your 100 Mbps internet = 100 megabits per second.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Binaryvdecimal.svg",
          alt: "A diagram comparing binary and decimal number systems",
          credit: "Ryoushi19 / Public Domain · Wikimedia Commons",
        },
        why: "Smallest unit — used for network speed (Mbps).",
        when: "Reading internet plans or Wi-Fi specs.",
      },
      {
        title: "Byte (B)",
        subtitle: "8 bits — one character",
        tone: "blue",
        points: [
          "Uppercase B.",
          "File sizes and disk speeds use bytes: MB/s.",
          "A 100 MB/s SSD moves 800 Mbps of data.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/ASCII-Table-wide.svg",
          alt: "The ASCII character table — each character stored in one Byte",
          credit: "ZZT32 et al. / Public Domain · Wikimedia Commons",
        },
        why: "Group of 8 bits — used for file sizes and disk speed (MB/s).",
        when: "Checking storage sizes or app download progress.",
      },
    ],
    analogy:
      "1 Byte = 8 bits, always. That is why a 1 Gbps internet plan downloads at ~125 MB/s, not 1,000.",
    remember: "Lowercase b = bit (small). Uppercase B = Byte (8× bigger).",
  },
  {
    id: "motherboard-vs-chipset",
    category: "Board",
    question: "Motherboard vs Chipset",
    icon: Network,
    columns: [
      {
        title: "Motherboard",
        subtitle: "The whole board",
        tone: "blue",
        points: [
          "The physical PCB holding every component.",
          "Provides sockets, slots, ports, and power delivery.",
          "Form factors: ATX, mATX, ITX.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/2023_P%C5%82yta_g%C5%82%C3%B3wna_Asus_ROG_STRIX_Z690-A_GAMING_WIFI.jpg",
          alt: "An ASUS ROG STRIX Z690-A GAMING WIFI ATX motherboard",
          credit: "Jacek Halicki / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "The board every component plugs into.",
        when: "Building or upgrading — pick this first.",
      },
      {
        title: "Chipset",
        subtitle: "The traffic controller chip",
        tone: "violet",
        points: [
          "A chip ON the motherboard (e.g., Intel Z790, AMD X670).",
          "Decides how many USB / PCIe / SATA lanes are available.",
          "Determines whether you can overclock, use fast RAM, etc.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Pentium_E2220_with_Intel_i945GC_Chipset.jpg",
          alt: "An Intel i945GC chipset chip on a motherboard",
          credit: "JulianVilla26 / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Decides which USB / PCIe / overclock features the board supports.",
        when: "Comparing two boards with the same socket.",
      },
    ],
    analogy:
      "Motherboard is the city. Chipset is the traffic control tower that decides how data flows through it.",
    remember: "Two boards can look identical yet behave very differently because of the chipset.",
  },
  {
    id: "bits-32-64",
    category: "Architecture",
    question: "32-bit vs 64-bit",
    icon: Sparkles,
    columns: [
      {
        title: "32-bit",
        subtitle: "Older architecture",
        tone: "amber",
        points: [
          "Can address at most ~4 GB of RAM.",
          "Runs 32-bit software only.",
          "Mostly obsolete on modern desktops.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Pentium_P54C_Die.jpg",
          alt: "An Intel Pentium P54C die — a 32-bit x86 processor",
          credit: "Appaloosa / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Runs legacy software; only sees up to ~4 GB RAM.",
        when: "Old industrial or embedded systems.",
      },
      {
        title: "64-bit",
        subtitle: "Modern architecture",
        tone: "blue",
        points: [
          "Can address terabytes of RAM.",
          "Runs both 64-bit and 32-bit software.",
          "Standard on every modern CPU and OS.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/AMD_Opteron_146_Venus,_2005.jpg",
          alt: "An AMD Opteron 146 — the first x86-64 (64-bit) processor family",
          credit: "Konstantin Lanzet / CC BY 3.0 · Wikimedia Commons",
        },
        why: "Standard modern architecture — huge RAM, faster math.",
        when: "Every new PC and OS.",
      },
    ],
    analogy:
      "32-bit is a 4-lane road, 64-bit is a 16-billion-lane highway. Same journey, wildly different capacity.",
    remember: "If a PC has more than 4 GB of RAM, it must run a 64-bit OS to use it.",
  },
  // --- Ports ---
  {
    id: "usb-a-b-c",
    category: "Ports",
    question: "USB-A vs USB-B vs USB-C — the three shapes",
    icon: Usb,
    columns: [
      {
        title: "USB-A",
        subtitle: "The classic flat rectangle",
        tone: "amber",
        points: [
          "The port on almost every PC, TV, and charger.",
          "Only fits one way (the famous \"flip it 3 times\" port).",
          "Used for mice, keyboards, flash drives.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/USB-A_receptacle.webp",
          alt: "A USB Type-A receptacle port",
          credit: "Wikideas1 / CC0 · Wikimedia Commons",
        },
        why: "The universal host port — on computers, TVs, chargers.",
        when: "Connecting a mouse, keyboard, or flash drive.",
      },
      {
        title: "USB-B",
        subtitle: "Squarish, on peripherals",
        tone: "violet",
        points: [
          "Found on printers, scanners, audio interfaces.",
          "One end of the cable is USB-A, the other is USB-B.",
          "Variants: Mini-B (old cameras), Micro-B (older phones).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/SuperSpeed_USB_Male_Plug_Type_B.jpg",
          alt: "A USB Type-B plug (SuperSpeed variant)",
          credit: "Ben Franske / CC BY-SA · Wikimedia Commons",
        },
        why: "The device end of older peripherals like printers and scanners.",
        when: "Connecting a printer, scanner, or audio interface.",
      },
      {
        title: "USB-C",
        subtitle: "Small oval, fully reversible",
        tone: "blue",
        points: [
          "Plugs in either way up — no fumbling.",
          "Carries power, data, video, and audio on one cable.",
          "Standard on modern phones, laptops, and accessories.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Two_USB-C_connectors_being_held.jpg",
          alt: "Two USB Type-C connectors",
          credit: "Logant547 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "The modern do-everything connector — reversible and fast.",
        when: "Any new phone, laptop, or accessory.",
      },
    ],
    analogy:
      "USB-A goes into the computer, USB-B into the device, USB-C into everything. Same USB standard, three connector shapes.",
    remember:
      "Shape ≠ speed. A USB-C port can be slow (USB 2.0) or a full Thunderbolt 4 pipe — check the label next to it.",
  },
  {
    id: "usb-generations",
    category: "Ports",
    question: "USB 2.0 vs 3.x vs USB4 — the speeds",
    icon: Gauge,
    columns: [
      {
        title: "USB 2.0",
        subtitle: "Legacy",
        tone: "amber",
        points: [
          "480 Mbps (~60 MB/s).",
          "Black plastic inside the USB-A port.",
          "Fine for keyboards, mice, printers.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Certified_Hi-Speed_USB.svg",
          alt: "The Certified Hi-Speed USB 2.0 logo",
          credit: "USB-IF / Trademark · Wikimedia Commons",
        },
        why: "Cheap and plenty for slow devices.",
        when: "Mice, keyboards, dongles, printers.",
      },
      {
        title: "USB 3.x",
        subtitle: "3.0 / 3.1 / 3.2 (aka SuperSpeed)",
        tone: "blue",
        points: [
          "5 Gbps (3.0), 10 Gbps (3.1), 20 Gbps (3.2).",
          "Blue plastic inside a USB-A port often signals 3.0+.",
          "Good for external SSDs and video capture.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Certified_SuperSpeed_USB_Logo.svg",
          alt: "The Certified SuperSpeed USB 3.0 logo",
          credit: "USB-IF / Trademark · Wikimedia Commons",
        },
        why: "10× faster — good for external drives and video capture.",
        when: "Portable SSDs, docking stations, webcams.",
      },
      {
        title: "USB4",
        subtitle: "Built on Thunderbolt",
        tone: "violet",
        points: [
          "20 or 40 Gbps, USB-C only.",
          "Supports display + data + power in one cable.",
          "Backward compatible with older USB and Thunderbolt 3.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Certified_USB4_40Gbps_Logo.svg",
          alt: "The Certified USB4 40 Gbps logo",
          credit: "USB-IF / Trademark · Wikimedia Commons",
        },
        why: "Fastest USB — display + data + power in one cable.",
        when: "Docking a laptop into an eGPU or 4K monitor.",
      },
    ],
    analogy:
      "Same USB \"road,\" but each generation widens the lanes. USB4 moves 80× more data per second than USB 2.0.",
    remember:
      "Port colour is a hint, not a guarantee. The generation is what sets the real speed.",
  },
  {
    id: "usbc-vs-thunderbolt",
    category: "Ports",
    question: "USB-C vs Thunderbolt — identical shape, different power",
    icon: Zap,
    columns: [
      {
        title: "USB-C (plain)",
        subtitle: "Just the connector",
        tone: "amber",
        points: [
          "Might be USB 2.0, 3.x, or USB4 internally.",
          "May or may not carry video (DisplayPort Alt Mode).",
          "Power delivery varies from 15 W to 240 W.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Two_USB-C_connectors_being_held.jpg",
          alt: "Two USB Type-C connectors",
          credit: "Logant547 / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Fits everywhere but speed depends on the specific port.",
        when: "General USB devices, phones, charging.",
      },
      {
        title: "Thunderbolt 3 / 4",
        subtitle: "Premium USB-C",
        tone: "violet",
        points: [
          "40 Gbps guaranteed, on every port.",
          "Drives up to two 4K displays from one cable.",
          "Marked with a small ⚡ lightning icon.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Thunderbolt_3_interface_USB-C_ports.jpg",
          alt: "Thunderbolt USB-C ports on a laptop, marked with a lightning icon",
          credit: "Amin / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Guaranteed 40 Gbps and can drive dual 4K displays.",
        when: "High-end docks, external GPUs, pro video work.",
      },
    ],
    analogy:
      "Every Thunderbolt port is a USB-C port, but not every USB-C port is Thunderbolt. Same plug, very different capability.",
    remember: "Look for the ⚡ icon next to the port — that is your Thunderbolt confirmation.",
  },
  {
    id: "video-ports",
    category: "Ports",
    question: "HDMI vs DisplayPort vs DVI vs VGA",
    icon: Monitor,
    columns: [
      {
        title: "VGA",
        subtitle: "Blue trapezoid, 15 pins",
        tone: "amber",
        points: [
          "Analog signal — old and fuzzy at high resolutions.",
          "Video only, no audio.",
          "Legacy — mostly projectors and older monitors.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Vga-cable.jpg",
          alt: "A VGA cable connector",
          credit: "Evan-Amos / Public Domain · Wikimedia Commons",
        },
        why: "Only choice for very old projectors and monitors.",
        when: "Legacy equipment you can't replace.",
      },
      {
        title: "DVI",
        subtitle: "White, chunky, many pins",
        tone: "amber",
        points: [
          "Digital (mostly). Bridge between VGA and HDMI eras.",
          "Video only — no audio, no modern features.",
          "Fading out — still on some older monitors.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Dvi-cable.jpg",
          alt: "A DVI cable connector",
          credit: "Evan-Amos / Public Domain · Wikimedia Commons",
        },
        why: "Digital bridge between the VGA and HDMI eras.",
        when: "Older monitors that predate HDMI.",
      },
      {
        title: "HDMI / DisplayPort",
        subtitle: "Modern digital video",
        tone: "blue",
        points: [
          "Both carry high-res video + audio digitally.",
          "HDMI dominates TVs and consoles.",
          "DisplayPort dominates PC gaming (higher refresh, daisy-chain).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/HDMI-Connector.jpg",
          alt: "An HDMI connector",
          credit: "Evan-Amos / Public Domain · Wikimedia Commons",
        },
        why: "Modern digital video + audio in one cable.",
        when: "Every new TV, monitor, console, and PC.",
      },
    ],
    analogy:
      "VGA is a landline. DVI is a flip phone. HDMI and DisplayPort are smartphones — you want a smartphone.",
    remember: "For PC gaming, prefer DisplayPort. For TVs and consoles, HDMI. VGA and DVI are last resorts.",
  },
  {
    id: "rj45-vs-rj11",
    category: "Ports",
    question: "RJ45 (Ethernet) vs RJ11 (Phone)",
    icon: Cable,
    columns: [
      {
        title: "RJ45",
        subtitle: "Ethernet jack — 8 pins",
        tone: "blue",
        points: [
          "Wider connector, 8 wires.",
          "Carries network data at 100 Mbps – 10 Gbps.",
          "Plugs into router / switch / PC network port.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/RJ45_female_connector.jpg",
          alt: "An RJ45 Ethernet female connector (network jack)",
          credit: "Keministi / CC0 · Wikimedia Commons",
        },
        why: "Carries fast network data — Ethernet.",
        when: "Connecting to a router or switch for internet.",
      },
      {
        title: "RJ11",
        subtitle: "Phone jack — 4 or 6 pins",
        tone: "amber",
        points: [
          "Narrower connector, 2–4 wires.",
          "Carries analog voice (or DSL) at very low speed.",
          "Plugs into a wall phone socket or modem.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Conector_RJ11.jpg",
          alt: "An RJ11 phone connector",
          credit: "Diegoescuela / CC BY 3.0 · Wikimedia Commons",
        },
        why: "Carries slow voice / DSL signals — telephone.",
        when: "Wall phones, fax machines, DSL modems.",
      },
    ],
    analogy:
      "RJ45 is the highway (8 lanes of network traffic). RJ11 is the bike path (2 wires of phone signal).",
    remember: "RJ45 is BIGGER and used for INTERNET. RJ11 is smaller and used for PHONES.",
  },
  // --- Networking ---
  {
    id: "modem-vs-router-vs-switch",
    category: "Networking",
    question: "Modem vs Router vs Switch — three different jobs",
    icon: Router,
    columns: [
      {
        title: "Modem",
        subtitle: "Talks to the internet provider",
        tone: "amber",
        points: [
          "Converts your ISP's signal (cable / fibre / DSL) into Ethernet.",
          "Gives you ONE public IP address.",
          "Without a router, only one device can connect.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBN_CG3368_cable_modem.jpg",
          alt: "A cable modem",
          credit: "Kuohuanhuan / CC BY 4.0 · Wikimedia Commons",
        },
        why: "Translates the ISP signal into internet.",
        when: "You have exactly one incoming line from your provider.",
      },
      {
        title: "Router",
        subtitle: "Shares one connection with many devices",
        tone: "blue",
        points: [
          "Creates your home network (LAN + Wi-Fi).",
          "Hands out private IPs (DHCP) and does NAT.",
          "Adds firewall, port forwarding, parental controls.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/D-Link_DI-524.jpg",
          alt: "A consumer home Wi-Fi router (D-Link DI-524)",
          credit: "Weihao Chiu / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Shares one internet feed with many devices.",
        when: "Every home or office network.",
      },
      {
        title: "Switch",
        subtitle: "Adds more wired ports",
        tone: "violet",
        points: [
          "Extra Ethernet ports for the LAN.",
          "Does NOT connect to the internet on its own.",
          "Used when a router runs out of ports.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/2550T-PWR-Front.jpg",
          alt: "An Ethernet network switch (HP ProCurve 2550T-PWR)",
          credit: "Geek2003 / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Adds more wired Ethernet ports to the LAN.",
        when: "You've run out of ports on the router.",
      },
    ],
    analogy:
      "Modem = the front door to the internet. Router = the receptionist directing traffic inside the office. Switch = extra desks with network cables.",
    remember:
      "Modem talks to the ISP, Router shares that signal, Switch just adds more ports.",
  },
  {
    id: "lan-vs-wan",
    category: "Networking",
    question: "LAN vs WAN",
    icon: Network,
    columns: [
      {
        title: "LAN",
        subtitle: "Local Area Network",
        tone: "blue",
        points: [
          "Devices inside one home, office, or school.",
          "Very fast (1–10 Gbps) and free to use.",
          "Uses private IPs (192.168.x.x, 10.x.x.x).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/LAN_topology.svg",
          alt: "A diagram of a Local Area Network (LAN) topology",
          credit: "Retraza / CC0 · Wikimedia Commons",
        },
        why: "Fast, free network inside one building.",
        when: "Sharing files, printers, or gaming with people nearby.",
      },
      {
        title: "WAN",
        subtitle: "Wide Area Network",
        tone: "violet",
        points: [
          "Spans cities, countries, or the whole world — the internet is a WAN.",
          "Slower and costs money (paid to an ISP).",
          "Uses public IPs, routed globally.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/LAN_WAN_scheme.svg",
          alt: "A diagram showing how LANs connect through a WAN",
          credit: "Ggia / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Global network — the internet itself.",
        when: "Any time you go online.",
      },
    ],
    analogy:
      "LAN is the roads inside your neighbourhood. WAN is the highway system connecting every neighbourhood on Earth.",
    remember: "L = Local (your building). W = Wide (the whole world).",
  },
  {
    id: "wifi-vs-ethernet",
    category: "Networking",
    question: "Wi-Fi vs Ethernet",
    icon: Wifi,
    columns: [
      {
        title: "Wi-Fi",
        subtitle: "Wireless radio waves",
        tone: "amber",
        points: [
          "No cable — connect from anywhere in range.",
          "Slower and less stable (walls, interference, distance).",
          "Higher latency and jitter than a cable.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/D-Link_DI-524.jpg",
          alt: "A home Wi-Fi router broadcasting a wireless network",
          credit: "Weihao Chiu / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Convenience — connect from anywhere in range.",
        when: "Phones, tablets, laptops on the go.",
      },
      {
        title: "Ethernet",
        subtitle: "Wired connection (RJ45 cable)",
        tone: "blue",
        points: [
          "Rock-solid, predictable speed.",
          "Lowest latency — best for gaming and video calls.",
          "Requires a cable run to the router.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/10baseT_cable.jpeg",
          alt: "An Ethernet cable with an RJ45 connector",
          credit: "Dflock / Public Domain · Wikimedia Commons",
        },
        why: "Rock-solid, low latency, no interference.",
        when: "Gaming, streaming, video calls, servers.",
      },
    ],
    analogy:
      "Wi-Fi is speaking across a room — convenient but the message can drop. Ethernet is a phone cable in your hand — every word arrives.",
    remember: "When it MUST work — gaming, streaming, calls — plug in the cable.",
  },
  {
    id: "wifi-2-4-vs-5",
    category: "Networking",
    question: "2.4 GHz vs 5 GHz Wi-Fi",
    icon: Radio,
    columns: [
      {
        title: "2.4 GHz",
        subtitle: "Long range, slower",
        tone: "amber",
        points: [
          "Reaches farther, passes through walls better.",
          "Crowded — shares space with microwaves, Bluetooth, baby monitors.",
          "Max ~150–450 Mbps in practice.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/2.4_GHz_Wi-Fi_channels_(802.11b,g_WLAN).svg",
          alt: "The 2.4 GHz Wi-Fi channel plan (802.11b/g)",
          credit: "Michael Gauthier / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Reaches farther and through more walls.",
        when: "Far rooms, IoT devices, wearable trackers.",
      },
      {
        title: "5 GHz",
        subtitle: "Short range, faster",
        tone: "blue",
        points: [
          "Much faster (500 Mbps – 1+ Gbps).",
          "Less interference — cleaner spectrum.",
          "Weakens quickly through walls and floors.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/D-Link_DI-524.jpg",
          alt: "A dual-band Wi-Fi router that also serves the 5 GHz band",
          credit: "Weihao Chiu / CC BY-SA 3.0 · Wikimedia Commons",
        },
        why: "Much faster, with less interference.",
        when: "Streaming, gaming, or working close to the router.",
      },
    ],
    analogy:
      "2.4 GHz is a loud AM radio — reaches far, poor quality. 5 GHz is FM — beautiful sound, but only nearby.",
    remember: "Close to the router → 5 GHz. Far away or many walls → 2.4 GHz.",
  },
  {
    id: "wifi-generations",
    category: "Networking",
    question: "Wi-Fi 5 vs Wi-Fi 6 vs Wi-Fi 7",
    icon: Signal,
    columns: [
      {
        title: "Wi-Fi 5",
        subtitle: "802.11ac (2013)",
        tone: "amber",
        points: [
          "5 GHz only. Up to ~3.5 Gbps in theory.",
          "Handles a few devices well.",
          "Standard on older laptops and phones.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Wi-Fi_5_%E2%80%93_Generational_Wi-Fi_UI_Visual.svg",
          alt: "The Wi-Fi 5 generation logo",
          credit: "Wi-Fi Alliance / CC0 · Wikimedia Commons",
        },
        why: "Widely supported and cheap.",
        when: "Basic home Wi-Fi with older devices.",
      },
      {
        title: "Wi-Fi 6 / 6E",
        subtitle: "802.11ax",
        tone: "blue",
        points: [
          "Up to ~9.6 Gbps and much better in crowded homes.",
          "6E adds a clean new 6 GHz band.",
          "Longer battery life on phones (Target Wake Time).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Wi-Fi_6_%E2%80%93_Generational_Wi-Fi_UI_Visual.svg",
          alt: "The Wi-Fi 6 generation logo",
          credit: "Wi-Fi Alliance / CC0 · Wikimedia Commons",
        },
        why: "Handles crowded networks better; saves phone battery.",
        when: "Many devices in one home, apartments, offices.",
      },
      {
        title: "Wi-Fi 7",
        subtitle: "802.11be",
        tone: "violet",
        points: [
          "Up to ~46 Gbps in theory.",
          "Uses 2.4, 5, and 6 GHz at the same time (MLO).",
          "Cutting-edge — new routers and phones only.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Wi-Fi_7_%E2%80%93_Generational_Wi-Fi_UI_Visual.svg",
          alt: "The Wi-Fi 7 generation logo",
          credit: "Wi-Fi Alliance / CC0 · Wikimedia Commons",
        },
        why: "Cutting-edge speed with lower latency.",
        when: "New builds with Wi-Fi 7 capable devices.",
      },
    ],
    analogy:
      "Each generation of Wi-Fi is like a wider, smarter highway with better traffic control.",
    remember: "New Wi-Fi routers help even old devices — but new devices are needed to hit the top speeds.",
  },
  {
    id: "ipv4-vs-ipv6",
    category: "Networking",
    question: "IPv4 vs IPv6",
    icon: Globe,
    columns: [
      {
        title: "IPv4",
        subtitle: "32-bit addresses",
        tone: "amber",
        points: [
          "Looks like 192.168.1.10.",
          "~4.3 billion addresses — the internet ran out.",
          "Still the most common address in daily use.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/IPv4_Packet-en.svg",
          alt: "An IPv4 packet header diagram",
          credit: "Michel Bakni / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "The address format that runs today's internet.",
        when: "Every current router, phone, and PC.",
      },
      {
        title: "IPv6",
        subtitle: "128-bit addresses",
        tone: "blue",
        points: [
          "Looks like 2001:0db8:85a3::7334.",
          "340 undecillion addresses — practically unlimited.",
          "Built-in features for modern mobile / IoT networks.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/IPv6_Logo.svg",
          alt: "The IPv6 logo",
          credit: "Ihavebeenknowing / CC0 · Wikimedia Commons",
        },
        why: "Fixes the address shortage — enough IPs forever.",
        when: "Modern ISPs, mobile networks, IoT at scale.",
      },
    ],
    analogy:
      "IPv4 is a small town with 4 billion house numbers. IPv6 gives every grain of sand on Earth its own address, with room to spare.",
    remember: "IPv4 = dots and short. IPv6 = colons and long. Both work together during the transition.",
  },
  {
    id: "tcp-vs-udp",
    category: "Networking",
    question: "TCP vs UDP",
    icon: Cable,
    columns: [
      {
        title: "TCP",
        subtitle: "Reliable, ordered",
        tone: "blue",
        points: [
          "Confirms every packet arrived, in order.",
          "Slower — retransmits anything that gets lost.",
          "Used by websites, email, file transfer, SSH.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/TCP_connection_establishment.svg",
          alt: "A TCP three-way handshake diagram",
          credit: "Adielbm / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Guarantees the data arrives correctly and in order.",
        when: "Web pages, email, file downloads, SSH.",
      },
      {
        title: "UDP",
        subtitle: "Fast, no guarantees",
        tone: "amber",
        points: [
          "Fires packets and does not wait for confirmation.",
          "Lower latency — losses are simply accepted.",
          "Used by video calls, live streams, online games, DNS.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Header_of_UDP.svg",
          alt: "A UDP packet header diagram",
          credit: "DnaX / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Speed over reliability — a few lost packets are fine.",
        when: "Video calls, live streams, online games, DNS.",
      },
    ],
    analogy:
      "TCP is a registered letter with tracking — always delivered, always in order. UDP is shouting across a crowded room — fast, but some words may be missed.",
    remember: "Correct data → TCP. Real-time data → UDP.",
  },
  {
    id: "mac-vs-ip",
    category: "Networking",
    question: "MAC address vs IP address",
    icon: Shield,
    columns: [
      {
        title: "MAC address",
        subtitle: "Hardware identity",
        tone: "amber",
        points: [
          "Burned into the network card at the factory.",
          "Never changes (48-bit, e.g. 00:1A:2B:3C:4D:5E).",
          "Only used inside the local network.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/UMTS_Router_Surf@home_II,_o2-0017.jpg",
          alt: "A router label showing its MAC address",
          credit: "Raimond Spekking / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Identifies the physical device on the local network.",
        when: "Configuring Wi-Fi filters or DHCP reservations.",
      },
      {
        title: "IP address",
        subtitle: "Network location",
        tone: "blue",
        points: [
          "Assigned by the router or ISP — can change any time.",
          "Used to route traffic across the whole internet.",
          "Two forms: private (LAN) and public (WAN).",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/IPv4_Packet-en.svg",
          alt: "An IPv4 packet header showing source and destination IP addresses",
          credit: "Michel Bakni / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Locates the device across the whole internet.",
        when: "Any online communication.",
      },
    ],
    analogy:
      "MAC is your passport number — permanent, tied to you. IP is your current mailing address — depends on where you are staying.",
    remember: "MAC identifies the DEVICE. IP identifies WHERE it is on the network.",
  },
  {
    id: "bandwidth-vs-latency",
    category: "Networking",
    question: "Bandwidth vs Latency",
    icon: Gauge,
    columns: [
      {
        title: "Bandwidth",
        subtitle: "How much (Mbps / Gbps)",
        tone: "blue",
        points: [
          "The maximum amount of data that fits per second.",
          "Higher = faster downloads and 4K streaming.",
          "What ISPs sell you (\"500 Mbps plan\").",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Speedometer.svg",
          alt: "A speedometer representing bandwidth (throughput)",
          credit: "Robertbeers / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Determines how much data you can move per second.",
        when: "Big downloads, 4K streaming, cloud backups.",
      },
      {
        title: "Latency",
        subtitle: "How fast (ms — ping)",
        tone: "violet",
        points: [
          "Time for a single packet to travel there and back.",
          "Lower = snappier games, calls, and page loads.",
          "Distance and hops matter more than bandwidth.",
        ],
        image: {
          url: "https://commons.wikimedia.org/wiki/Special:FilePath/Stopwatch.jpg",
          alt: "A stopwatch representing latency (response time)",
          credit: "Srini297 / CC BY-SA 4.0 · Wikimedia Commons",
        },
        why: "Determines how snappy the connection feels.",
        when: "Gaming, video calls, remote desktop, trading.",
      },
    ],
    analogy:
      "Bandwidth is the WIDTH of a highway. Latency is the SPEED LIMIT. A 20-lane road with a 10 km/h limit still feels awful.",
    remember: "You feel latency (lag). You measure bandwidth (throughput).",
  },
];

const TONE_STYLES: Record<DiffColumn["tone"], { chip: string; border: string; bg: string; dot: string }> = {
  blue: {
    chip: "text-accent",
    border: "border-accent/30",
    bg: "bg-accent-soft",
    dot: "bg-accent",
  },
  amber: {
    chip: "text-amber-300",
    border: "border-amber-400/25",
    bg: "bg-amber-400/[0.08]",
    dot: "bg-amber-300",
  },
  violet: {
    chip: "text-violet-300",
    border: "border-violet-400/25",
    bg: "bg-violet-400/[0.08]",
    dot: "bg-violet-300",
  },
};

export function KeyDifferences({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Dimmed backdrop; clicking it closes the modal. */}
          <motion.button
            type="button"
            aria-label="Close key differences"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
          />

          {/* Modal panel. */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="key-differences-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-4 border-b border-line bg-linear-to-b from-surface-2 to-surface px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent">
                  <GitCompareArrows className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="flex flex-col gap-1">
                  <h2
                    id="key-differences-title"
                    className="text-[18px] font-semibold leading-tight tracking-tight text-foreground sm:text-[20px]"
                  >
                    Key Differences — Commonly Confused
                  </h2>
                  <p className="text-[12px] leading-snug text-muted sm:text-[13px]">
                    The comparisons students mix up on exams. Read the analogy, remember
                    the one-liner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </header>

            {/* Scrollable list of comparison cards. */}
            <div className="thin-scroll flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {CARDS.map((card) => (
                  <DiffCardView key={card.id} card={card} />
                ))}
              </div>

              {/* Closing "key learning" summary. */}
              <div className="mt-6 rounded-2xl border border-accent/25 bg-accent-soft p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.8} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    Key Learning of PC Anatomy
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-2 text-[13px] leading-relaxed text-foreground/90 sm:grid-cols-2">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Every component has one job — the value comes from how well they
                    cooperate.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Memory forms a pyramid: cache → RAM → SSD → HDD. Closer to the CPU is
                    smaller and faster.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Speed comes from parallelism (more cores/lanes) AND frequency (higher
                    clocks) — you need both.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Volatile memory (RAM) forgets when unplugged. Non-volatile (SSD/HDD)
                    remembers.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Form factor (M.2, ATX, LGA1700) is the SHAPE. Protocol (NVMe, PCIe,
                    DDR5) is the SPEED.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    A PC is only as fast as its slowest bottleneck — balance beats raw
                    numbers.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DiffCardView({ card }: { card: DiffCard }) {
  const Icon = card.icon;
  return (
    <article className="rounded-2xl border border-line bg-surface-2/50 p-4 sm:p-5">
      {/* Card header: category chip + question. */}
      <header className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-3 text-accent">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-2">
            {card.category}
          </span>
          <h3 className="text-[15px] font-semibold leading-snug text-foreground sm:text-[16px]">
            {card.question}
          </h3>
        </div>
      </header>

      {/* Comparison columns. */}
      <div
        className={cn(
          "grid gap-3",
          card.columns.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        )}
      >
        {card.columns.map((col) => {
          const tone = TONE_STYLES[col.tone];
          return (
            <div
              key={col.title}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-3 sm:p-3.5",
                tone.border,
                tone.bg
              )}
            >
              {/* Optional reference photograph (Wikimedia Commons). */}
              {col.image && (
                <figure className="flex flex-col gap-1">
                  <div className="relative h-28 w-full overflow-hidden rounded-lg border border-line bg-white/95 sm:h-32">
                    <Image
                      src={col.image.url}
                      alt={col.image.alt}
                      fill
                      sizes="(min-width: 640px) 240px, 100vw"
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                  <figcaption className="truncate text-[9.5px] leading-tight text-muted-2">
                    {col.image.credit}
                  </figcaption>
                </figure>
              )}
              <div>
                <p className={cn("text-[13.5px] font-semibold leading-tight", tone.chip)}>
                  {col.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-2">
                  {col.subtitle}
                </p>
              </div>
              <ul className="mt-1 space-y-1.5">
                {col.points.map((p) => (
                  <li key={p} className="flex gap-2 text-[12.5px] leading-snug text-foreground/90">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Analogy + one-line reminder. */}
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-3/60 px-3.5 py-2.5">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" strokeWidth={1.8} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-2">
              Analogy
            </span>
            <p className="text-[12.5px] leading-relaxed text-foreground/90">{card.analogy}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent-soft px-3.5 py-2.5">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.8} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              Remember
            </span>
            <p className="text-[12.5px] leading-relaxed text-foreground/90">{card.remember}</p>
          </div>
        </div>
      </div>

      {/* Why & When to choose — one compact row per column, so students can see
          each option's purpose and buying trigger side by side. */}
      {card.columns.some((c) => c.why || c.when) && (
        <div className="mt-3 rounded-xl border border-line bg-surface-3/40 p-3 sm:p-3.5">
          <div className="mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent">
              Why &amp; When to Choose
            </span>
          </div>
          <div
            className={cn(
              "grid gap-2.5",
              card.columns.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
            )}
          >
            {card.columns.map((col) => {
              const tone = TONE_STYLES[col.tone];
              return (
                <div
                  key={`ww-${col.title}`}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border bg-surface-2/40 p-2.5",
                    tone.border
                  )}
                >
                  <p className={cn("text-[12px] font-semibold leading-tight", tone.chip)}>
                    {col.title}
                  </p>
                  {col.why && (
                    <div className="flex items-start gap-1.5">
                      <HelpCircle className="mt-0.5 h-3 w-3 shrink-0 text-muted-2" strokeWidth={1.8} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                          Why we need it
                        </span>
                        <p className="text-[11.5px] leading-snug text-foreground/85">
                          {col.why}
                        </p>
                      </div>
                    </div>
                  )}
                  {col.when && (
                    <div className="flex items-start gap-1.5">
                      <CalendarClock className="mt-0.5 h-3 w-3 shrink-0 text-muted-2" strokeWidth={1.8} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                          When to pick it
                        </span>
                        <p className="text-[11.5px] leading-snug text-foreground/85">
                          {col.when}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
