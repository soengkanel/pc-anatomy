// This file contains all the information about the computer components shown in the app:
// the 3D models to display, the text for each part, specs, common problems, and more.

// A single row in a component's spec list (e.g. "Speed" -> "3.7 – 5.2 GHz").
export type SpecRow = { label: string; value: string };

// The shape of all the data stored for one component (CPU, GPU, RAM, etc.).
export type ComponentInfo = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  short: string;
  icon: string;
  overview: {
    description: string;
    realWorld: string;
    fact: string;
  };
  specs: SpecRow[];
  functions: string[];
  issues: string[];
  // Why the component matters and when a student would need to think about it
  // (e.g. buying, upgrading, or spec'ing a build). Displayed in the "Why & When"
  // tab of the detail panel.
  whyWhen: {
    why: string;
    when: string[];
  };
  focus: {
    at: [number, number, number];
    from: [number, number, number];
  };
  model?: string;
  credits?: string;
};

// The 3D model file used for the System Unit, and the model used when no other model exists.
export const SYSTEM_UNIT_MODEL = "/models/system_unit_update.glb";
export const FALLBACK_MODEL = SYSTEM_UNIT_MODEL;

// The full list of components that can be explored in the app.
export const COMPONENTS: ComponentInfo[] = [
  // --- PC Case (the computer case / system unit) ---
  {
    id: "pc-case",
    index: "01",
    name: "PC Case",
    tagline: "The Complete System Chassis",
    short: "The shell that houses, cools, and protects every internal component.",
    icon: "Box",
    overview: {
      description:
        "The PC case (also called the system unit or chassis) is the structural home of the computer. Beyond looks, it provides mounting for every component, guided airflow, cable management, and protection from dust, static, and physical damage.",
      realWorld:
        "Chassis choice shapes the whole build: an airy mesh front feeds the fans, tempered glass shows off the interior, and drive bays determine how much storage you can install.",
      fact:
        "Some enthusiast cases are designed with negative-pressure layouts and dedicated channels for motherboard cable routing to keep airflow entirely unobstructed.",
    },
    specs: [
      { label: "Form Factor", value: "Mid-Tower" },
      { label: "Motherboard Support", value: "ATX / mATX / ITX" },
      { label: "GPU Clearance", value: "360 mm" },
      { label: "Fan Mounts", value: "Up to 6× 120 mm" },
      { label: "Drive Bays", value: "2× 3.5\" + 3× 2.5\"" },
    ],
    functions: [
      "Mount the motherboard, PSU, drives, and fans.",
      "Direct airflow from intake to exhaust.",
      "Route and hide cables for clean, cool builds.",
      "Protect components from dust, ESD, and damage.",
    ],
    issues: [
      "Restrictive front panels suffocating intake fans.",
      "Dust filters clogging and reducing airflow.",
      "Standoff misalignment shorting the motherboard.",
      "Insufficient clearance for oversized GPUs or coolers.",
    ],
    whyWhen: {
      why:
        "The case is the skeleton and shield of the whole PC. Without it every part would sit exposed to dust, static, and knocks — and there would be nothing to mount the motherboard, drives, and fans together in one airflow path.",
      when: [
        "Building a new PC from parts.",
        "Upgrading to a bigger motherboard (ATX) or a longer GPU that doesn't fit the old case.",
        "You want a quieter build or better airflow for a hot CPU/GPU.",
        "The current case has no room for extra drives, fans, or a radiator.",
      ],
    },
    focus: { at: [0, 0, 0], from: [0, 0.45, 3.4] },
    model: SYSTEM_UNIT_MODEL,
    credits:
      "\"Dream Computer Setup\" (https://skfb.ly/6QW96) by Daniel Cardona is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- CPU (Central Processing Unit) ---
  {
    id: "cpu",
    index: "02",
    name: "CPU",
    tagline: "Central Processing Unit",
    short: "The brain of the computer — executes instructions and coordinates every task.",
    icon: "Cpu",
    overview: {
      description:
        "The Central Processing Unit is the silicon brain of the computer. It decodes and executes billions of instructions every second, from arithmetic to logic and memory access, orchestrating everything your operating system and applications ask it to do.",
      realWorld:
        "Inside your laptop or phone, the CPU decides how smoothly your apps respond. When you press a key or open a browser tab, the CPU schedules the work, checks the data, and delegates rendering to the GPU — all within microseconds.",
      fact:
        "A modern CPU contains more than 8 billion transistors packed into a chip smaller than a postage stamp. The first Intel 4004 from 1971 had just 2,300.",
    },
    specs: [
      { label: "Socket", value: "LGA 1700 / AM5" },
      { label: "Cores", value: "8" },
      { label: "Threads", value: "16" },
      { label: "Clock Speed", value: "3.7 – 5.2 GHz" },
      { label: "Cache", value: "24 MB L3" },
    ],
    functions: [
      "Fetch, decode, and execute instructions from RAM.",
      "Perform arithmetic and logic operations (ALU).",
      "Coordinate data flow between memory, storage, and peripherals.",
      "Manage scheduling of tasks across cores and threads.",
    ],
    issues: [
      "Overheating under sustained load without adequate cooling.",
      "Bent pins or damaged socket contacts preventing boot.",
      "Degraded or incorrectly applied thermal paste.",
      "Silicon degradation from excessive overclocking voltages.",
    ],
    whyWhen: {
      why:
        "The CPU decides how fast every task on the computer runs. Every keystroke, click, calculation, and app instruction flows through it — a slow CPU means the whole PC feels sluggish no matter what other parts are upgraded.",
      when: [
        "Apps take a long time to open, compile, or export.",
        "You want higher FPS in CPU-bound games (strategy, simulation, MMO).",
        "You do video editing, 3D rendering, or run virtual machines.",
        "The motherboard supports a much newer CPU generation.",
      ],
    },
    focus: { at: [-0.16, 0.3, -0.3], from: [-0.45, 0.55, 1.0] },
    model: "/models/cpu.glb",
    credits:
      "\"CPU Ryzen 5 3600\" (https://skfb.ly/on9Ao) by Fochdog is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- Motherboard ---
  {
    id: "motherboard",
    index: "03",
    name: "Motherboard",
    tagline: "The Main System Board",
    short: "The backbone that connects every component into one working computer.",
    icon: "CircuitBoard",
    overview: {
      description:
        "The motherboard is the main printed circuit board that physically and electrically connects every component. Power, data, and signals all travel through its traces, slots, and headers, making it the nervous system of the PC.",
      realWorld:
        "Choosing a motherboard determines which CPU, RAM, and storage you can install — its socket and chipset define your upgrade path. Builders match boards to cases so ports and standoffs line up.",
      fact:
        "A motherboard can contain over a dozen layers of copper traces stacked like a sandwich, all engineered so signals arrive within picoseconds of each other.",
    },
    specs: [
      { label: "Form Factor", value: "ATX / mATX / ITX" },
      { label: "CPU Socket", value: "LGA 1700 / AM5" },
      { label: "Chipset", value: "Z790 / B650" },
      { label: "RAM Slots", value: "4 × DDR5" },
      { label: "Expansion Slots", value: "PCIe 5.0 ×16" },
    ],
    functions: [
      "Distribute power from the PSU to every component.",
      "Route data between CPU, RAM, GPU, and storage.",
      "Host expansion slots, ports, and headers.",
      "Report system status and manage power states via the BIOS.",
    ],
    issues: [
      "Failed BIOS updates leaving the board unable to boot.",
      "Bent CPU socket pins or damaged traces.",
      "Capacitor swelling or VRM overheating on budget boards.",
      "Standoff shorts when the board is mounted incorrectly.",
    ],
    whyWhen: {
      why:
        "The motherboard is the highway system that connects the CPU, RAM, GPU, storage, and every port. It also decides which CPUs will fit, how fast the RAM can run, and how many drives and expansion cards can be installed.",
      when: [
        "Upgrading to a new CPU generation with a different socket.",
        "You need more M.2 slots, USB-C ports, or PCIe lanes.",
        "The current board doesn't support the RAM speed or Wi-Fi standard you want.",
        "Building a new PC — pick the motherboard first; everything else plugs into it.",
      ],
    },
    focus: { at: [0.0, 0.15, -0.15], from: [0.0, 0.7, 1.15] },
    model: "/models/motherboard.glb",
    credits:
      "\"PC motherboard ASUS Prime H510M-K\" (https://skfb.ly/oFrRt) by zhigulinsky is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- RAM (working memory) ---
  {
    id: "ram",
    index: "04",
    name: "RAM",
    tagline: "Random Access Memory",
    short: "High-speed working memory that holds data the CPU is actively using.",
    icon: "MemoryStick",
    overview: {
      description:
        "RAM is the computer's short-term working memory. It stores the data and instructions the CPU needs right now, trading capacity for speed so that the processor never has to wait for slower storage.",
      realWorld:
        "When you edit a document, it lives in RAM until you save it to the SSD. More RAM lets you keep dozens of browser tabs and heavy applications open at once without slowdown.",
      fact:
        "RAM is volatile — everything stored in it vanishes the instant power is cut. That's why you can lose unsaved work on a sudden shutdown.",
    },
    specs: [
      { label: "Type", value: "DDR5" },
      { label: "Capacity", value: "16 – 32 GB" },
      { label: "Speed", value: "5600 MT/s" },
      { label: "Latency", value: "CL36" },
      { label: "Channels", value: "Dual" },
    ],
    functions: [
      "Hold active programs and data for instant CPU access.",
      "Act as the high-speed staging area between CPU and storage.",
      "Support multitasking by keeping many processes resident.",
      "Provide memory for shared GPU access (shared VRAM setups).",
    ],
    issues: [
      "Incorrectly seated modules causing no-post beeps.",
      "Mixing incompatible speeds forcing slower operation.",
      "Failing DIMMs producing random crashes and blue screens.",
      "Dust or corrosion on the gold contacts.",
    ],
    whyWhen: {
      why:
        "RAM is where the CPU keeps everything it is actively working on. Not enough of it and the PC has to swap to slow storage — apps freeze, tabs reload, and games stutter. Faster RAM also lifts CPU performance in gaming.",
      when: [
        "Chrome tabs constantly reload or the system feels laggy under load.",
        "You run VMs, big spreadsheets, Photoshop/video editors, or modern AAA games.",
        "Task Manager shows memory usage above ~80% while working.",
        "You want more single-thread performance in games (esp. on AMD Ryzen).",
      ],
    },
    focus: { at: [0.22, 0.28, -0.05], from: [0.85, 0.45, 0.55] },
    model: "/models/ram.glb",
    credits:
      "\"[RAM DDR4] G.Skill Trident Z NEO\" (https://skfb.ly/6WOrn) by Zon Digital is licensed under CC Attribution-NonCommercial-NoDerivs (http://creativecommons.org/licenses/by-nc-nd/4.0/).",
  },
  // --- GPU (graphics card) ---
  {
    id: "gpu",
    index: "05",
    name: "GPU",
    tagline: "Graphics Processing Unit",
    short: "The parallel powerhouse that renders visuals and accelerates AI workloads.",
    icon: "Layers",
    overview: {
      description:
        "The Graphics Processing Unit is a massively parallel processor designed for graphics and compute. It renders frames for your display and accelerates workloads like machine learning and video encoding using thousands of small cores.",
      realWorld:
        "Every image on your screen is computed by the GPU — from a 3D game at 240 fps to scrolling a webpage. Modern GPUs also power the AI features in apps and games through tensor and ray-tracing hardware.",
      fact:
        "A flagship GPU can have over 16,000 cores and perform more than 80 trillion floating-point operations per second — roughly a million times a 1980s supercomputer.",
    },
    specs: [
      { label: "VRAM", value: "16 GB" },
      { label: "Memory Type", value: "GDDR6X" },
      { label: "Compute Cores", value: "16,384" },
      { label: "Boost Clock", value: "2.6 GHz" },
      { label: "Power Draw", value: "320 W" },
    ],
    functions: [
      "Render 3D scenes, UI, and video at high frame rates.",
      "Offload parallel compute for AI and scientific workloads.",
      "Encode and decode video streams with dedicated hardware.",
      "Drive multiple displays simultaneously.",
    ],
    issues: [
      "Overheating from dried-out thermal pads on the heatsink.",
      "GPU sag stressing the PCIe slot over time.",
      "Power connector seating failures under high load.",
      "Driver conflicts causing crashes or artifacts.",
    ],
    whyWhen: {
      why:
        "The GPU turns numbers into the pixels you see on screen and does the parallel math for AI and video encoding. For gaming, 3D, ML, or heavy video work it usually matters more than the CPU.",
      when: [
        "You want to play modern games at higher settings or higher FPS.",
        "You do 3D modeling, video editing, or run AI/ML workloads.",
        "You drive multiple monitors or a high-refresh / 4K display.",
        "The current card is 2+ generations old and struggles with new titles.",
      ],
    },
    focus: { at: [0.0, -0.18, -0.18], from: [0.5, 0.05, 1.0] },
    model: "/models/gpu.glb",
    credits:
      "\"MSI GeForce RTX 3080 Gaming X Trio | Now Free!\" (https://skfb.ly/ow8HY) by M E U is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- SSD (SATA solid state drive) ---
  {
    id: "ssd",
    index: "06",
    name: "SSD",
    tagline: "2.5\" SATA Solid State Drive",
    short: "Silent, lightning-fast storage with no moving parts, over a SATA link.",
    icon: "HardDrive",
    overview: {
      description:
        "A Solid State Drive stores data on flash memory chips instead of spinning disks. With no moving parts, it delivers near-instant boot times, snappy application loading, and extreme durability against drops.",
      realWorld:
        "The classic 2.5-inch SATA SSD is the go-to upgrade for laptops and older desktops — it drops into any drive bay and over the same cable as a hard drive while being dramatically faster and quieter.",
      fact:
        "A 2.5\" SATA SSD tops out at about 550 MB/s, roughly ten times faster than a spinning hard drive — yet still trails the fastest NVMe drives.",
    },
    specs: [
      { label: "Interface", value: "SATA III" },
      { label: "Form Factor", value: "2.5 inch" },
      { label: "Capacity", value: "1 TB" },
      { label: "Read Speed", value: "550 MB/s" },
      { label: "Write Speed", value: "520 MB/s" },
    ],
    functions: [
      "Persist the operating system, programs, and files.",
      "Provide fast random access with no moving parts.",
      "Dramatically speed up aging systems in a straight swap.",
      "Operate silently and resist shock and vibration.",
    ],
    issues: [
      "Firmware bugs causing drives to drop offline.",
      "Trim not enabled, degrading write performance.",
      "SATA bandwidth capping performance below NVMe.",
      "NAND wear on heavily written budget drives.",
    ],
    whyWhen: {
      why:
        "A SATA SSD makes the whole computer feel modern — boot times, app launches, and file access are 5–10× faster than a spinning hard drive, plus it's silent and shock-resistant.",
      when: [
        "You still boot from a mechanical HDD.",
        "You need more room for the OS, apps, or a growing game library.",
        "You're upgrading an older PC whose motherboard has no M.2 slot.",
        "You want a durable drive for a laptop or a PC that travels.",
      ],
    },
    focus: { at: [-0.24, -0.28, 0.42], from: [-0.8, -0.3, 1.05] },
    model: "/models/ssd_solid_state_drive.glb",
    credits:
      "\"(SSD) Solid State Drive\" (https://skfb.ly/otSKU) by MarkCP is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- M.2 SSD (NVMe solid state drive) ---
  {
    id: "m2-ssd",
    index: "07",
    name: "M.2 SSD",
    tagline: "NVMe Solid State Drive",
    short: "A gumstick-sized NVMe drive that mounts directly onto the motherboard.",
    icon: "MemoryStick",
    overview: {
      description:
        "The M.2 SSD is a slim, board-mounted solid state drive. It plugs straight into a slot on the motherboard and connects over PCIe lanes, bypassing SATA to reach multi-gigabyte-per-second speeds.",
      realWorld:
        "M.2 NVMe drives are why modern PCs boot in seconds and games load in the blink of an eye — no cables, no drive bays, just a tiny screw and the fastest consumer storage available.",
      fact:
        "A top NVMe M.2 drive can read over 7 GB/s — fast enough to copy a full-length 4K movie in under a second.",
    },
    specs: [
      { label: "Interface", value: "PCIe 4.0 NVMe" },
      { label: "Form Factor", value: "M.2 2280" },
      { label: "Capacity", value: "1 TB" },
      { label: "Read Speed", value: "7,000 MB/s" },
      { label: "Write Speed", value: "5,000 MB/s" },
    ],
    functions: [
      "Host the operating system for near-instant boot.",
      "Transfer data over dedicated PCIe lanes.",
      "Provide extreme random and sequential throughput.",
      "Mount flush on the board with a single screw.",
    ],
    issues: [
      "Overheating throttling on high-speed M.2 drives.",
      "Slot and drive key mismatches (M vs B+M).",
      "Bandwidth sharing with the GPU on some boards.",
      "Firmware bugs causing drives to drop offline.",
    ],
    whyWhen: {
      why:
        "An M.2 NVMe SSD is the fastest common storage — up to 25× quicker than a SATA SSD. It plugs straight into the motherboard so there are no cables, and it's the best home for the OS and games with huge worlds.",
      when: [
        "Loading massive game maps, video projects, or CAD assemblies.",
        "Building a clean, cable-free PC.",
        "Boot and app-launch speed is your top priority.",
        "The motherboard has an unused M.2 slot doing nothing.",
      ],
    },
    focus: { at: [0, 0.1, 0], from: [0, 0.4, 0.9] },
    model: "/models/m.2.glb",
    credits:
      "\"M.2 SSD (Free)\" (https://skfb.ly/pJZv8) by PolyDavid is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- HDD (hard disk drive) ---
  {
    id: "hdd",
    index: "08",
    name: "HDD",
    tagline: "Hard Disk Drive",
    short: "High-capacity magnetic storage built from spinning platters.",
    icon: "Disc3",
    overview: {
      description:
        "The Hard Disk Drive stores data magnetically on spinning platters, read by a tiny arm moving over the surface. It offers the lowest cost per gigabyte, making it ideal for archives and bulk storage.",
      realWorld:
        "HDDs keep the world's archives alive — NAS boxes, surveillance recorders, and backup servers still rely on them for terabytes of cheap, dependable storage that SSDs would make prohibitively expensive.",
      fact:
        "Platters spin at up to 7,200 RPM, and the read arm hovers mere nanometers above the surface — thinner than a single wavelength of light.",
    },
    specs: [
      { label: "Interface", value: "SATA III" },
      { label: "Form Factor", value: "3.5 inch" },
      { label: "Capacity", value: "4 TB" },
      { label: "Speed", value: "7,200 RPM" },
      { label: "Cache", value: "256 MB" },
    ],
    functions: [
      "Store large amounts of data at low cost.",
      "Persist files across power cycles.",
      "Serve as backup and archival tiers in storage systems.",
      "Buffer and batch writes for efficiency.",
    ],
    issues: [
      "Physical shock causing head crashes and data loss.",
      "Mechanical wear from continuous spinning.",
      "Bad sectors appearing as the platters age.",
      "Vibration degrading performance in multi-drive setups.",
    ],
    whyWhen: {
      why:
        "The HDD is the cheapest way to store a lot of data. It's slow, but for movies, backups, and archives that you rarely open, it costs a fraction of an SSD per terabyte.",
      when: [
        "Bulk media storage — movies, music, photo libraries, recordings.",
        "System backups, NAS drives, or archive volumes.",
        "Budget builds where every dollar matters.",
        "Secondary drive so the SSD stays free for the OS and games.",
      ],
    },
    focus: { at: [-0.24, -0.28, 0.42], from: [-0.9, -0.25, 1.0] },
    model: "/models/hdd.glb",
    credits:
      "\"WD Green 1TB Hard Disk HDD\" (https://skfb.ly/oESOn) by MajdyModels is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- PSU (power supply unit) ---
  {
    id: "power-supply",
    index: "09",
    name: "PSU",
    tagline: "Power Supply Unit",
    short: "Converts wall power into clean, regulated DC for every component.",
    icon: "Zap",
    overview: {
      description:
        "The Power Supply Unit takes mains AC power and converts it into stable, low-voltage DC for the system. Its quality determines not just wattage, but how safely and quietly your entire PC runs.",
      realWorld:
        "A good PSU delivers consistent power under load spikes — critical when a GPU transitions from idle to full 3D load in milliseconds. Budget units fail under these transients and can take other parts with them.",
      fact:
        "A high-end 80+ Titanium PSU is over 94% efficient, wasting less than 6 watts of heat for every 100 watts delivered.",
    },
    specs: [
      { label: "Wattage", value: "850 W" },
      { label: "Efficiency", value: "80+ Gold" },
      { label: "Modularity", value: "Fully Modular" },
      { label: "Rails", value: "Single +12V" },
      { label: "Form Factor", value: "ATX" },
    ],
    functions: [
      "Convert AC mains power to regulated DC voltages.",
      "Protect components with OVP, OCP, and short-circuit safeguards.",
      "Deliver clean, stable power during load transients.",
      "Power devices when the PC is asleep or off (standby rail).",
    ],
    issues: [
      "Capacitor aging reducing delivered wattage over years.",
      "Insufficient wattage causing random shutdowns under load.",
      "Fan bearing noise and dust build-up restricting airflow.",
      "Poor transient response on budget power supplies.",
    ],
    whyWhen: {
      why:
        "Every other component runs on power the PSU delivers. A weak or unreliable PSU causes random shutdowns, damaged hardware, and even fires — it's the one part you should never cheap out on.",
      when: [
        "Adding a new GPU that draws more power than the old one.",
        "Upgrading to a higher-end CPU or planning to overclock.",
        "The PSU is old, buzzing, or its fan has stopped spinning.",
        "Building a new PC — pick wattage with 20–30% headroom for future upgrades.",
      ],
    },
    focus: { at: [0.12, -0.62, -0.35], from: [0.75, -0.35, 1.05] },
    model: "/models/psu.glb",
    credits:
      "\"PSU Power Supply Unit\" (https://skfb.ly/oBPC9) by Groovex is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- CPU cooler ---
  {
    id: "cpu-cooler",
    index: "10",
    name: "CPU Cooler",
    tagline: "Thermal Management for the CPU",
    short: "Keeps the processor in its safe operating window under any load.",
    icon: "Fan",
    overview: {
      description:
        "The CPU cooler removes the immense heat generated by the processor, transferring it from the silicon through a base plate and heat pipes into a heatsink, where fans push it out of the case.",
      realWorld:
        "Air towers and liquid AIO coolers both let CPUs sustain boost clocks for hours of gaming. Without them, a modern chip would throttle within seconds — or shut down to protect itself.",
      fact:
        "A CPU can generate over 250 W of heat — enough to boil water — and coolers move that energy through heat pipes using the same physics as a refrigerator.",
    },
    specs: [
      { label: "Type", value: "Tower Air" },
      { label: "Fan Size", value: "120 mm" },
      { label: "Socket Support", value: "LGA / AM5" },
      { label: "TDP Rating", value: "220 W" },
      { label: "Noise", value: "≤ 28 dBA" },
    ],
    functions: [
      "Transfer heat from the CPU die to a large surface area.",
      "Dissipate heat into the case airflow via fans.",
      "Let the CPU sustain high clocks without throttling.",
      "Keep temperatures safe for years of operation.",
    ],
    issues: [
      "Dried-out thermal paste cracking and losing conductivity.",
      "Dust clogging fins and blocking airflow.",
      "Pump failures on liquid coolers causing instant spikes.",
      "Incorrect mounting pressure warping or overheating.",
    ],
    whyWhen: {
      why:
        "The cooler keeps the CPU below the temperature where it starts to throttle (slow itself down to protect itself). A better cooler means sustained speed under long loads and a much quieter PC.",
      when: [
        "CPU temperatures cross 85–90 °C under load.",
        "You want to overclock or use a K/X-series unlocked chip.",
        "The stock cooler is loud even at idle.",
        "Building in a hot climate or a small case with limited airflow.",
      ],
    },
    focus: { at: [-0.05, 0.42, -0.42], from: [-0.25, 0.95, 0.85] },
    model: "/models/cpu_fan.glb",
    credits:
      "\"(Free) AMD Wraith Stealth CPU Cooler\" (https://skfb.ly/pJXNM) by PolyDavid is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- Case fans ---
  {
    id: "case-fans",
    index: "11",
    name: "Case Fans",
    tagline: "Airflow Management",
    short: "Pull cool air in and push hot air out to regulate case temperature.",
    icon: "Wind",
    overview: {
      description:
        "Case fans establish airflow through the chassis — pulling cool air over components and exhausting heat. Balanced positive and negative pressure keeps dust out and temperatures in check.",
      realWorld:
        "Modern cases use front intake fans feeding cool air straight to the CPU and GPU, with a rear or top exhaust completing the loop. Good airflow often matters more than an expensive cooler.",
      fact:
        "A single 140 mm fan moves almost twice the air of a 120 mm fan at the same noise level, which is why large, slow fans are quieter.",
    },
    specs: [
      { label: "Size", value: "120 mm" },
      { label: "Bearing", value: "Fluid Dynamic" },
      { label: "RPM", value: "500 – 1,800" },
      { label: "Airflow", value: "62 CFM" },
      { label: "Noise", value: "≤ 26 dBA" },
    ],
    functions: [
      "Draw cool air into the chassis from the front.",
      "Exhaust warm air from the rear and top.",
      "Maintain pressure balance to deter dust.",
      "Target airflow toward the CPU and GPU intakes.",
    ],
    issues: [
      "Bearing wear causing grinding or rattle noise.",
      "Dust accumulation unbalancing fan blades.",
      "Loose screws transferring vibration to the case.",
      "Failing to connect to fan headers, leaving them silent.",
    ],
    whyWhen: {
      why:
        "Case fans move hot air out and cool air in. Without enough airflow, even the best CPU cooler and GPU heatsink overheat because they're just breathing the same recycled hot air.",
      when: [
        "GPU or CPU temps climb into the throttling range under load.",
        "The case has only one intake or exhaust — most builds want 3–6 fans total.",
        "You want a positive-pressure (dust-reducing) setup.",
        "Silent PC build — swap small fast fans for large slow ones.",
      ],
    },
    focus: { at: [0.0, 0.45, 1.08], from: [0.15, 0.55, 2.1] },
    model: "/models/case_fans.glb",
    credits:
      "\"CPU_fan SOGUTUCU\" (https://skfb.ly/6S8JV) by sinemmbagcioglu is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- Keyboard ---
  {
    id: "keyboard",
    index: "12",
    name: "Keyboard",
    tagline: "Primary Input Device",
    short: "The main way you type, command, and control your computer.",
    icon: "Keyboard",
    overview: {
      description:
        "The keyboard is the primary text and command input device. Each key press closes a switch that the keyboard controller converts into a scancode, which the operating system translates into characters, shortcuts, and actions.",
      realWorld:
        "From writing documents to controlling games, the keyboard is where most computer work begins. Mechanical boards offer tactile feedback, while low-profile membranes keep laptops thin and quiet.",
      fact:
        "A mechanical keyboard can register over 100 simultaneous key presses — known as full N-key rollover — which is why gamers and typists prefer them for speed and accuracy.",
    },
    specs: [
      { label: "Layout", value: "Full / TKL / 75%" },
      { label: "Switch Type", value: "Mechanical" },
      { label: "Connection", value: "USB-C / 2.4 GHz / BT" },
      { label: "Backlight", value: "Per-key RGB" },
      { label: "Key Count", value: "104" },
    ],
    functions: [
      "Enter text and characters through key presses.",
      "Trigger shortcuts and macros for speed.",
      "Provide input for gaming and navigation.",
      "Support accessibility features like sticky keys and remapping.",
    ],
    issues: [
      "Sticky or unresponsive switches from dust and debris.",
      "Failed key switches on high-use letters.",
      "Wireless input lag or dropped connections.",
      "Liquid spills shorting the controller circuit.",
    ],
    whyWhen: {
      why:
        "The keyboard is your primary input device. A good one improves typing speed, comfort during long sessions, and reaction time in games — a bad one causes wrist pain and typos.",
      when: [
        "You type all day for work or study.",
        "You play competitive games where key response matters.",
        "You experience wrist strain — consider ergonomic or split layouts.",
        "The current keyboard has failing keys or feels mushy.",
      ],
    },
    focus: { at: [0.0, 0.05, 0.0], from: [0.0, 1.0, 1.6] },
    model: "/models/keyboard.glb",
    credits:
      "\"keyboard\" (https://skfb.ly/6UFI8) by 45P3R4 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- Mouse ---
  {
    id: "mouse",
    index: "13",
    name: "Mouse",
    tagline: "Pointing & Cursor Control",
    short: "The precision tool that moves your cursor and drives interactions.",
    icon: "MousePointer2",
    overview: {
      description:
        "The mouse translates hand motion into cursor movement. An optical sensor captures surface movement thousands of times per second, while buttons and the scroll wheel trigger clicks, drags, and navigation.",
      realWorld:
        "The mouse is the natural way to point, select, and navigate. High-DPI sensors track tiny wrist movements for precise aim in games and pixel-level work in design tools.",
      fact:
        "Modern gaming mice report position at up to 8,000 times per second and can track speeds of 650 inches per second without losing accuracy.",
    },
    specs: [
      { label: "Sensor", value: "Optical" },
      { label: "DPI", value: "400 – 26,000" },
      { label: "Buttons", value: "6" },
      { label: "Connection", value: "2.4 GHz / BT / USB" },
      { label: "Weight", value: "58 g" },
    ],
    functions: [
      "Move the cursor with optical tracking.",
      "Select, click, and drag with primary and secondary buttons.",
      "Scroll through pages and documents.",
      "Switch sensitivity on the fly for precision tasks.",
    ],
    issues: [
      "Dust on the sensor causing erratic cursor jumps.",
      "Double-clicking from worn micro switches.",
      "Worn skates dragging on the mousepad.",
      "Wireless interference causing lag or disconnects.",
    ],
    whyWhen: {
      why:
        "The mouse controls where you look and click. Precision, comfort, and click feel decide how fast you can navigate, design, or aim in games — a cheap mouse causes fatigue and misclicks.",
      when: [
        "You do design, CAD, or photo editing — need a precise, adjustable-DPI sensor.",
        "You game competitively — need a high polling rate and low-latency sensor.",
        "You feel wrist or thumb strain with the current mouse.",
        "You added a high-resolution or multi-monitor setup.",
      ],
    },
    focus: { at: [0.0, 0.02, 0.0], from: [0.0, 0.9, 1.4] },
    model: "/models/mouse.glb",
    credits:
      "\"Low poly - Computer Mouse [FREE] Download\" (https://skfb.ly/pM8xn) by IQINISO is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- Monitor ---
  {
    id: "monitor",
    index: "14",
    name: "Monitor",
    tagline: "Visual Output Display",
    short: "The display that turns rendered frames into the images you see.",
    icon: "Monitor",
    overview: {
      description:
        "The monitor is the computer's visual output. The GPU renders a frame, the display panel refreshes millions of pixels in sync, and what you see is the final product of everything the system computes.",
      realWorld:
        "Refresh rate, resolution, and panel type define how smooth and sharp your experience is. A 144 Hz panel redraws twice as often as a standard 60 Hz screen, making motion feel dramatically smoother.",
      fact:
        "An 8K display contains roughly 33 million individually addressable pixels, each of which must update up to 144 times every second without visible tearing.",
    },
    specs: [
      { label: "Panel", value: "IPS" },
      { label: "Resolution", value: "2560 × 1440" },
      { label: "Refresh Rate", value: "144 Hz" },
      { label: "Response Time", value: "1 ms" },
      { label: "Ports", value: "HDMI 2.1 / DP 1.4 / USB-C" },
    ],
    functions: [
      "Display the frames rendered by the GPU.",
      "Present color-accurate images for design and media.",
      "Support adaptive sync to eliminate tearing.",
      "Act as a hub for USB and video connections.",
    ],
    issues: [
      "Dead or stuck pixels from manufacturing defects.",
      "Backlight bleed around the panel edges.",
      "Input lag from heavy image processing.",
      "Screen burn-in on OLED panels from static content.",
    ],
    whyWhen: {
      why:
        "The monitor is the only part of the PC you actually look at — hardware quality is worthless if you can't see it clearly. Refresh rate, colour accuracy, and size decide how enjoyable and productive the whole PC feels.",
      when: [
        "Eye strain from long hours on a small or low-resolution screen.",
        "Gaming — a higher refresh (144 Hz+) feels dramatically smoother.",
        "Colour, photo, or video work — need an sRGB or wide-gamut display.",
        "Productivity — dual monitors or one big ultrawide saves hours per week.",
      ],
    },
    focus: { at: [0.0, 0.1, 0.0], from: [0.0, 1.2, 2.2] },
    model: "/models/monitor.glb",
    credits:
      "\"Acer monitor\" (https://skfb.ly/o8vT7) by Turtle_Flipper is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- UPS (uninterruptible power supply) ---
  {
    id: "ups",
    index: "15",
    name: "UPS",
    tagline: "Uninterruptible Power Supply",
    short: "Battery backup that keeps your PC alive through outages and power dips.",
    icon: "BatteryCharging",
    overview: {
      description:
        "An Uninterruptible Power Supply sits between your wall socket and your PC. Its battery constantly monitors the incoming mains and switches to battery power the instant the grid drops, giving you time to save work and shut down cleanly.",
      realWorld:
        "A UPS also cleans the power feeding your hardware, clamping surges and filtering brownouts — the dirty power that silently stresses PSUs, boards, and drives. For anyone working on documents or running servers, it's the cheapest insurance in computing.",
      fact:
        "A UPS can switch to battery in under 10 milliseconds — far faster than a PC would even notice, and the reason your screen never flickers during a blip.",
    },
    specs: [
      { label: "Capacity", value: "700 VA / 420 W" },
      { label: "Battery", value: "12 V, 7 Ah" },
      { label: "Runtime", value: "~10 min at full load" },
      { label: "Outlets", value: "8 × C13" },
      { label: "Surge Protection", value: "480 J" },
    ],
    functions: [
      "Bridge power gaps so the PC never drops mid-write.",
      "Clamp surges and filter noise from the mains.",
      "Give time to save work and shut down safely.",
      "Regulate voltage for equipment in unstable grids.",
    ],
    issues: [
      "Aging batteries losing runtime over 2–3 years.",
      "Rechargeable cells overheating if the vents are blocked.",
      "UPS click-over failures during rapid power cycling.",
      "Passive units letting brownouts through to the PSU.",
    ],
    whyWhen: {
      why:
        "A UPS is a battery that keeps the PC running for a few minutes after a power cut, so you can save work and shut down safely. Without one, a blackout mid-write can corrupt files or damage drives.",
      when: [
        "You live in an area with frequent power cuts or brownouts.",
        "You run a home server, streaming rig, or important workstation.",
        "You do long tasks (renders, exports, downloads) you can't afford to restart.",
        "You are protecting a NAS, security DVR, or network gear from data loss.",
      ],
    },
    focus: { at: [0, 0.05, 0], from: [0.35, 0.6, 1.6] },
    model: "/models/ups.glb",
    credits:
      "\"APC Battery Backup UPS\" (https://sketchfab.com/3d-models/apc-battery-backup-ups-b5c5af44c00848d3bad02327e3cec236) by Graham Rust is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
  // --- AVR (automatic voltage regulator) ---
  {
    id: "avr",
    index: "16",
    name: "AVR",
    tagline: "Automatic Voltage Regulator",
    short: "Smooths unstable mains voltage to protect your PC from dips and spikes.",
    icon: "Zap",
    overview: {
      description:
        "An Automatic Voltage Regulator sits between the wall outlet and your PC, constantly monitoring the incoming mains. When voltage sags or surges, it corrects the supply in real time so your hardware always receives clean, stable power — no matter how rough the grid is.",
      realWorld:
        "In areas with fluctuating power, an AVR is the first line of defense for a desktop. Brownouts and voltage spikes quietly stress PSUs, motherboards, and drives — an AVR smooths those swings so the PSU only ever has to handle well-behaved input.",
      fact:
        "Unlike a UPS, an AVR does not supply backup power — it only stabilizes voltage. It corrects over a typical range of ±25% and reacts within milliseconds, far faster than a human would notice a flicker.",
    },
    specs: [
      { label: "Input Voltage", value: "140 – 280 VAC" },
      { label: "Output Voltage", value: "220 V ± 8%" },
      { label: "Capacity", value: "1,000 VA / 600 W" },
      { label: "Outlets", value: "6 × Universal" },
      { label: "Surge Protection", value: "Built-in" },
    ],
    functions: [
      "Regulate incoming voltage during brownouts and surges.",
      "Clamp voltage spikes before they reach your components.",
      "Deliver stable power to the PSU under unstable grids.",
      "Protect against polarity and phase irregularities.",
    ],
    issues: [
      "Worn relays clicking repeatedly during voltage swings.",
      "Overheating when operating at the edge of its range.",
      "Output sag under high continuous load.",
      "Worn contacts reducing surge protection over time.",
    ],
    whyWhen: {
      why:
        "An AVR smooths spikes and drops from an unstable electrical supply, so the PSU sees a steady voltage. It protects sensitive electronics in areas where the grid delivers 180–260 V instead of a clean 220 V.",
      when: [
        "The mains voltage fluctuates a lot (lights dim or brighten randomly).",
        "You've had power surges damage electronics before.",
        "You use expensive equipment — workstations, servers, medical, audio.",
        "You live somewhere with an unreliable grid — pair with a UPS for full protection.",
      ],
    },
    focus: { at: [0, 0.05, 0], from: [0.35, 0.6, 1.6] },
    model: "/models/avr.glb",
    credits:
      "\"Automatic Voltage Regulator (AVR)\" (https://skfb.ly/oMqpy) by seiippai is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
  },
];

// Look up a single component by its id. Returns undefined if no matching component exists.
export function getComponent(id: string): ComponentInfo | undefined {
  return COMPONENTS.find((c) => c.id === id);
}
