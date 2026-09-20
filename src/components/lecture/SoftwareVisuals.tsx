"use client";

// Realistic, richly-detailed illustrations for the Software chapter.
// Each visual mimics real UI so students recognise what they use every day.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ═════════════════════════════════════════════════════════════════
 * 1 — Software Stack (Apps → OS → Hardware)
 *     A cross-section of a running computer with actual UI at the top,
 *     an OS "manager" band in the middle, and real hardware at the bottom.
 * ═════════════════════════════════════════════════════════════ */

export function SoftwareStackRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full flex-col gap-2">
        {/* ── APPS layer ─────────────────────────────────── */}
        <div className="relative rounded-xl border border-sky-400/40 bg-gradient-to-b from-sky-500/15 to-sky-500/5 p-2.5 backdrop-blur-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-sky-300">
              LAYER 3 · APPLICATIONS
            </div>
            <div className="text-[9px] text-sky-200/70">what you use</div>
          </div>
          <div className="flex gap-2">
            {[
              { icon: "🌐", name: "Chrome", color: "bg-blue-500" },
              { icon: "📝", name: "Word", color: "bg-blue-600" },
              { icon: "🎵", name: "Music", color: "bg-pink-500" },
              { icon: "🎮", name: "Game", color: "bg-purple-500" },
              { icon: "💬", name: "Chat", color: "bg-emerald-500" },
              { icon: "📷", name: "Photos", color: "bg-amber-500" },
            ].map((a, i) => (
              <motion.div
                key={a.name}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
                className={`flex h-11 w-11 flex-col items-center justify-center rounded-lg ${a.color}/80 border border-white/20 shadow-lg`}
              >
                <div className="text-lg leading-none">{a.icon}</div>
                <div className="mt-0.5 text-[7.5px] font-semibold text-white">{a.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Down arrow */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-accent-bright"
          >
            ↓
          </motion.span>
          <span>apps talk to the system</span>
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
            className="text-accent-bright"
          >
            ↓
          </motion.span>
        </div>

        {/* ── OS layer ───────────────────────────────────── */}
        <div className="relative rounded-xl border border-accent/40 bg-gradient-to-b from-accent/15 to-accent/5 p-2.5 backdrop-blur-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-accent-bright">
              LAYER 2 · OPERATING SYSTEM
            </div>
            <div className="text-[9px] text-accent-bright/70">the manager</div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1.5">
            {/* Fake OS window "task manager" */}
            <div className="flex gap-1">
              {["CPU", "RAM", "Disk", "Net", "GPU"].map((label, i) => (
                <div key={label} className="w-10 rounded bg-black/50 p-1 text-center">
                  <div className="text-[7px] font-mono text-neutral-400">{label}</div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded bg-white/10">
                    <motion.div
                      className={`h-full ${i % 2 ? "bg-accent" : "bg-emerald-400"}`}
                      animate={{ width: [`${20 + i * 10}%`, `${60 + i * 5}%`, `${20 + i * 10}%`] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                    />
                  </div>
                  <div className="mt-0.5 font-mono text-[7px] text-white">{20 + i * 12}%</div>
                </div>
              ))}
            </div>
            <div className="ml-auto flex flex-col gap-0.5 text-[7.5px] font-mono">
              <div className="text-emerald-400">✓ manages apps</div>
              <div className="text-sky-300">✓ shares hardware</div>
              <div className="text-amber-300">✓ keeps files safe</div>
            </div>
          </div>
        </div>

        {/* Down arrow */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.15 }}
            className="text-emerald-400"
          >
            ↓
          </motion.span>
          <span>system drives the hardware</span>
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.45 }}
            className="text-emerald-400"
          >
            ↓
          </motion.span>
        </div>

        {/* ── HARDWARE layer ─────────────────────────────── */}
        <div className="relative rounded-xl border border-emerald-400/40 bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 p-2.5 backdrop-blur-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-emerald-300">
              LAYER 1 · HARDWARE
            </div>
            <div className="text-[9px] text-emerald-300/70">the physical machine</div>
          </div>
          <div className="flex gap-1.5">
            {[
              { label: "CPU", color: "bg-neutral-500" },
              { label: "RAM", color: "bg-red-500" },
              { label: "SSD", color: "bg-blue-500" },
              { label: "GPU", color: "bg-purple-500" },
              { label: "NET", color: "bg-emerald-500" },
            ].map((h, i) => (
              <motion.div
                key={h.label}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                className={`flex h-8 flex-1 items-center justify-center rounded ${h.color}/70 border border-white/20`}
              >
                <span className="font-mono text-[9px] font-bold text-white">{h.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 2 — Operating Systems: Five mini-desktops with characteristic UI
 * ═════════════════════════════════════════════════════════════ */

export function OSFamilyRealisticVisual() {
  return (
    <VisualFrame>
      <div className="grid h-full w-full grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniOs
          name="Windows"
          bgClass="bg-gradient-to-br from-blue-600 to-blue-800"
          taskbarClass="bg-blue-950"
          logo="🪟"
          logoColor="text-blue-400"
          desktop={
            <div className="grid grid-cols-3 gap-1 p-1">
              {["📁", "📄", "🌐"].map((e, i) => (
                <div key={i} className="flex flex-col items-center text-[6px] text-white">
                  <div className="text-[10px]">{e}</div>
                </div>
              ))}
            </div>
          }
        />

        <MiniOs
          name="macOS"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-900"
          taskbarClass="bg-white/10 backdrop-blur"
          logo="🍎"
          logoColor="text-white"
          hideTaskbarLogo
          topBar
          desktop={
            <div className="flex h-full items-end justify-center p-1">
              <div className="flex gap-0.5 rounded bg-white/15 px-1 py-0.5 backdrop-blur">
                {["🌐", "📁", "🎵", "📷"].map((e, i) => (
                  <div key={i} className="text-[8px]">{e}</div>
                ))}
              </div>
            </div>
          }
        />

        <MiniOs
          name="Linux"
          bgClass="bg-gradient-to-br from-neutral-900 to-black"
          taskbarClass="bg-black/60"
          logo="🐧"
          logoColor="text-orange-400"
          desktop={
            <div className="m-1 rounded border border-white/10 bg-black p-1 font-mono text-[6px] text-emerald-400">
              <div>$ ls /home/</div>
              <div className="opacity-70">docs music code</div>
              <div>$ echo hi</div>
              <div className="opacity-70">hi</div>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                _
              </motion.span>
            </div>
          }
        />

        <MiniOs
          name="Android"
          bgClass="bg-gradient-to-br from-emerald-600 to-emerald-900"
          taskbarClass="bg-black/70"
          logo="🤖"
          logoColor="text-emerald-400"
          statusBar
          desktop={
            <div className="grid grid-cols-3 gap-1 p-1">
              {["📱", "💬", "🌐", "📷", "🎵", "🎮"].map((e, i) => (
                <div key={i} className="flex items-center justify-center rounded bg-white/10 text-[7px]">
                  {e}
                </div>
              ))}
            </div>
          }
        />

        <MiniOs
          name="iOS"
          bgClass="bg-gradient-to-br from-slate-600 to-slate-800"
          taskbarClass="bg-black/70"
          logo="🍎"
          logoColor="text-white"
          hideTaskbarLogo
          statusBar
          desktop={
            <div className="grid grid-cols-3 gap-1 p-1">
              {["🌐", "💬", "📷", "🎵", "🗺️", "⚙️"].map((e, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                  className="flex items-center justify-center rounded-md bg-gradient-to-br from-white/30 to-white/5 text-[7px]"
                >
                  {e}
                </motion.div>
              ))}
            </div>
          }
        />

        {/* HarmonyOS — Huawei's cross-device OS. Common on Huawei phones
            (still widely sold in Cambodia). Represented by a petal/flower
            grid mirroring HarmonyOS's default launcher. */}
        <MiniOs
          name="HarmonyOS"
          bgClass="bg-gradient-to-br from-rose-500 to-rose-800"
          taskbarClass="bg-black/60"
          logo="🌸"
          logoColor="text-rose-200"
          statusBar
          desktop={
            <div className="grid grid-cols-3 gap-1 p-1">
              {["🌸", "📞", "💬", "📷", "🎵", "🛒"].map((e, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity }}
                  className="flex items-center justify-center rounded-full bg-white/15 text-[7px]"
                >
                  {e}
                </motion.div>
              ))}
            </div>
          }
        />

        {/* ChromeOS — the OS behind Chromebooks. Widely used in schools;
            web-app first. Shown as a shelf with a browser tile. */}
        <MiniOs
          name="ChromeOS"
          bgClass="bg-gradient-to-br from-sky-500 to-blue-700"
          taskbarClass="bg-white/15 backdrop-blur"
          logo="🌐"
          logoColor="text-red-300"
          desktop={
            <div className="flex h-full flex-col p-1">
              <div className="flex-1 rounded bg-white/20 p-1">
                <div className="mb-0.5 flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-red-400" />
                  <div className="h-1 w-1 rounded-full bg-amber-400" />
                  <div className="h-1 w-1 rounded-full bg-green-400" />
                </div>
                <div className="rounded bg-white/40 px-1 py-0.5 text-[5px] text-neutral-700">
                  google.com
                </div>
              </div>
            </div>
          }
        />

        {/* KaiOS — the T9-keypad smart-feature-phone OS from Nokia's
            "banana phones" (very popular across developing markets).
            Grid of tiny app tiles like a Nokia 8110. */}
        <MiniOs
          name="KaiOS"
          bgClass="bg-gradient-to-br from-amber-500 to-orange-700"
          taskbarClass="bg-black/70"
          logo="📱"
          logoColor="text-amber-300"
          statusBar
          desktop={
            <div className="grid grid-cols-3 gap-0.5 p-1">
              {["📞", "💬", "📷", "🎵", "📶", "⏰", "🎮", "⚙️", "🌐"].map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded bg-white/10 text-[6px]"
                >
                  {e}
                </div>
              ))}
            </div>
          }
        />
      </div>
    </VisualFrame>
  );
}

function MiniOs({
  name,
  bgClass,
  taskbarClass,
  logo,
  logoColor,
  desktop,
  topBar,
  statusBar,
  hideTaskbarLogo,
}: {
  name: string;
  bgClass: string;
  taskbarClass: string;
  logo: string;
  logoColor: string;
  desktop: React.ReactNode;
  topBar?: boolean;
  statusBar?: boolean;
  hideTaskbarLogo?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Brand chip: prominent logo badge + OS name so students recognise
          each tile at a glance instead of squinting at a 7px taskbar
          glyph. Sits above the mini-desktop mockup. */}
      <div className="flex w-full items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold leading-none ${logoColor}`}
          aria-hidden="true"
        >
          {logo || "•"}
        </span>
        <span className="min-w-0 flex-1 truncate text-[10.5px] font-semibold text-white">
          {name}
        </span>
      </div>

      <div
        className={`relative overflow-hidden rounded-lg border-2 border-neutral-700 shadow-xl ${bgClass}`}
        style={{ width: "100%", aspectRatio: "3/4" }}
      >
        {/* Top bar (macOS) or Status bar (mobile) */}
        {topBar && (
          <div className="flex h-3 items-center gap-0.5 border-b border-white/10 bg-white/10 px-1 backdrop-blur">
            <div className="h-1 w-1 rounded-full bg-red-400" />
            <div className="h-1 w-1 rounded-full bg-amber-400" />
            <div className="h-1 w-1 rounded-full bg-green-400" />
            <div className="ml-auto text-[5px] text-white/70">12:00</div>
          </div>
        )}
        {statusBar && (
          <div className="flex h-2.5 items-center justify-between px-1 text-[5px] text-white/80">
            <span>12:00</span>
            <div className="flex gap-0.5">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
        )}

        {/* Desktop area */}
        <div className="h-full">{desktop}</div>

        {/* Bottom taskbar */}
        {!topBar && (
          <div className={`absolute bottom-0 left-0 right-0 flex h-3 items-center gap-1 px-1 ${taskbarClass}`}>
            {!hideTaskbarLogo && (
              <span className={`text-[7px] font-bold ${logoColor}`}>{logo}</span>
            )}
            <motion.div
              className="ml-auto h-0.5 w-1 rounded-full bg-white/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 2b — OS Family Tree
 *      Shows the ancestral lineage: UNIX at the root, then BSD /
 *      System V / Linux branches, then the modern OSes that descend
 *      from each. Teaching value: explains why iOS + macOS behave
 *      similarly (same Darwin/BSD base), and why Android + ChromeOS
 *      share Linux DNA.
 * ═════════════════════════════════════════════════════════════ */

type FamilyChild = {
  name: string;
  year?: string;
  /** Emoji glyph shown as the pill's icon. */
  glyph: string;
  /** Tailwind class(es) coloring the pill. */
  color: string;
  /** Descendants drawn one level below (indented). */
  children?: FamilyChild[];
};

const OS_FAMILY: {
  name: string;
  year: string;
  desc: string;
  glyph: string;
  color: string;
  children: FamilyChild[];
}[] = [
  {
    name: "UNIX",
    year: "1969",
    desc: "The great-grandparent. Written at Bell Labs. Shaped almost every OS you use today.",
    glyph: "🧬",
    color: "border-amber-400/40 bg-amber-500/10 text-amber-200",
    children: [
      {
        name: "BSD",
        year: "1977",
        glyph: "🌿",
        color: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
        children: [
          { name: "FreeBSD", glyph: "😈", color: "border-emerald-400/30 bg-emerald-500/5 text-emerald-100" },
          {
            name: "Darwin",
            year: "2000",
            glyph: "🐕",
            color: "border-slate-400/40 bg-slate-500/10 text-slate-200",
            children: [
              { name: "macOS", glyph: "🍎", color: "border-slate-400/30 bg-slate-500/5 text-slate-100" },
              { name: "iOS", glyph: "🍎", color: "border-slate-400/30 bg-slate-500/5 text-slate-100" },
              { name: "iPadOS", glyph: "🍎", color: "border-slate-400/30 bg-slate-500/5 text-slate-100" },
              { name: "watchOS", glyph: "⌚", color: "border-slate-400/30 bg-slate-500/5 text-slate-100" },
            ],
          },
        ],
      },
      {
        name: "System V",
        year: "1983",
        glyph: "🏛️",
        color: "border-orange-400/40 bg-orange-500/10 text-orange-200",
        children: [
          { name: "Solaris", glyph: "☀️", color: "border-orange-400/30 bg-orange-500/5 text-orange-100" },
          { name: "AIX", glyph: "🖥️", color: "border-orange-400/30 bg-orange-500/5 text-orange-100" },
          { name: "HP-UX", glyph: "🖥️", color: "border-orange-400/30 bg-orange-500/5 text-orange-100" },
        ],
      },
    ],
  },
  {
    name: "Linux (UNIX-like)",
    year: "1991",
    desc: "Not descended from UNIX code, but built to work the same way. Free and open-source. Runs almost every server and phone on Earth.",
    glyph: "🐧",
    color: "border-sky-400/40 bg-sky-500/10 text-sky-200",
    children: [
      {
        name: "Debian",
        year: "1993",
        glyph: "🌀",
        color: "border-rose-400/40 bg-rose-500/10 text-rose-200",
        children: [
          { name: "Ubuntu", glyph: "🟠", color: "border-orange-400/30 bg-orange-500/5 text-orange-100" },
          { name: "Linux Mint", glyph: "🌱", color: "border-emerald-400/30 bg-emerald-500/5 text-emerald-100" },
        ],
      },
      {
        name: "Red Hat",
        year: "1994",
        glyph: "🎩",
        color: "border-red-400/40 bg-red-500/10 text-red-200",
        children: [
          { name: "Fedora", glyph: "🎓", color: "border-blue-400/30 bg-blue-500/5 text-blue-100" },
          { name: "CentOS", glyph: "🏢", color: "border-purple-400/30 bg-purple-500/5 text-purple-100" },
          { name: "RHEL", glyph: "🏢", color: "border-red-400/30 bg-red-500/5 text-red-100" },
        ],
      },
      { name: "Arch Linux", year: "2002", glyph: "🏹", color: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200" },
      { name: "Android", year: "2008", glyph: "🤖", color: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" },
      { name: "ChromeOS", year: "2011", glyph: "🌐", color: "border-red-400/40 bg-red-500/10 text-red-200" },
      { name: "HarmonyOS", year: "2019", glyph: "🌸", color: "border-rose-400/40 bg-rose-500/10 text-rose-200" },
    ],
  },
  {
    name: "Windows NT",
    year: "1993",
    desc: "A different family. Microsoft's own kernel — no UNIX ancestry. Powers every modern Windows.",
    glyph: "🪟",
    color: "border-blue-400/40 bg-blue-500/10 text-blue-200",
    children: [
      { name: "Windows 10", glyph: "🪟", color: "border-blue-400/30 bg-blue-500/5 text-blue-100" },
      { name: "Windows 11", glyph: "🪟", color: "border-blue-400/30 bg-blue-500/5 text-blue-100" },
      { name: "Windows Server", glyph: "🖥️", color: "border-blue-400/30 bg-blue-500/5 text-blue-100" },
      { name: "Xbox OS", glyph: "🎮", color: "border-emerald-400/30 bg-emerald-500/5 text-emerald-100" },
    ],
  },
];

function FamilyPill({ node, small }: { node: FamilyChild; small?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${node.color} ${
        small ? "text-[10.5px]" : "text-[11.5px]"
      }`}
    >
      <span aria-hidden className="text-[13px] leading-none">
        {node.glyph}
      </span>
      <span className="font-semibold">{node.name}</span>
      {node.year && (
        <span className="ml-0.5 font-mono text-[9.5px] opacity-70">{node.year}</span>
      )}
    </div>
  );
}

function FamilySubtree({ nodes, depth = 0 }: { nodes: FamilyChild[]; depth?: number }) {
  return (
    <div
      className={`flex flex-col gap-1.5 border-l ${
        depth === 0 ? "border-white/15" : "border-white/10"
      } pl-3 ${depth > 0 ? "ml-2" : ""}`}
    >
      {nodes.map((child) => (
        <div key={child.name} className="flex flex-col gap-1.5">
          <FamilyPill node={child} small />
          {child.children && child.children.length > 0 && (
            <FamilySubtree nodes={child.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export function OSFamilyTreeVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-1">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-accent-bright">
            OS Family Tree · មរតកប្រព័ន្ធប្រតិបត្តិការ
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] text-neutral-500">who came from whom</span>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {OS_FAMILY.map((root) => (
            <motion.div
              key={root.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"
            >
              {/* Root node */}
              <div className="mb-2 flex items-start gap-2">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg ${root.color}`}
                >
                  {root.glyph}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-bold text-white">{root.name}</span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      · {root.year}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-neutral-400">
                    {root.desc}
                  </p>
                </div>
              </div>

              {/* Descendants */}
              <FamilySubtree nodes={root.children} />
            </motion.div>
          ))}
        </div>

        <p className="mt-1 text-center text-[10px] text-neutral-500">
          Sibling OSes share a base — that&rsquo;s why they feel similar (same
          shell, same file layout, same tools).
        </p>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 3 — File System: Realistic file explorer window
 * ═════════════════════════════════════════════════════════════ */

export function FileSystemRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full max-w-[540px] flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-neutral-800 px-2.5 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <div className="ml-2 text-[11px] font-semibold text-neutral-300">📁 File Explorer</div>
          <div className="ml-auto flex items-center gap-1 rounded bg-neutral-700 px-1.5 py-0.5 text-[9px] text-neutral-400">
            🔍 <span>search…</span>
          </div>
        </div>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1 border-b border-neutral-700 bg-neutral-850 px-3 py-1 font-mono text-[10px] text-neutral-400">
          <motion.span
            animate={{ color: ["#93a3bc", "#7dd3fc", "#93a3bc"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}
          >
            🖥️ MyPC
          </motion.span>
          <span className="text-neutral-600">›</span>
          <motion.span
            animate={{ color: ["#93a3bc", "#7dd3fc", "#93a3bc"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.6, 1] }}
          >
            💾 C:
          </motion.span>
          <span className="text-neutral-600">›</span>
          <motion.span
            animate={{ color: ["#93a3bc", "#7dd3fc", "#93a3bc"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.7, 1] }}
          >
            👤 Users
          </motion.span>
          <span className="text-neutral-600">›</span>
          <motion.span
            animate={{ color: ["#93a3bc", "#7dd3fc", "#93a3bc"] }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 1] }}
            className="font-semibold"
          >
            Student
          </motion.span>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-32 border-r border-neutral-700 bg-neutral-850 py-2 text-[10.5px]">
            {[
              { icon: "🏠", label: "Home" },
              { icon: "📄", label: "Documents", active: true },
              { icon: "⬇️", label: "Downloads" },
              { icon: "🖼️", label: "Pictures" },
              { icon: "🎵", label: "Music" },
              { icon: "🎥", label: "Videos" },
              { icon: "💾", label: "This PC" },
            ].map((s) => (
              <div
                key={s.label}
                className={`flex items-center gap-1.5 px-2 py-1 ${
                  s.active
                    ? "bg-accent/20 border-l-2 border-accent text-white"
                    : "text-neutral-400 hover:bg-neutral-800"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Main pane — icon grid */}
          <div className="flex-1 p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "📁", name: "Photos" },
                { icon: "📁", name: "Music" },
                { icon: "📁", name: "School" },
                { icon: "📁", name: "Backup" },
                { icon: "📄", name: "essay.docx" },
                { icon: "📊", name: "grades.xlsx" },
                { icon: "🖼️", name: "family.jpg" },
                { icon: "🎵", name: "song.mp3" },
              ].map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col items-center gap-0.5 rounded p-1.5 ${
                    i === 0 ? "bg-accent/25" : "hover:bg-neutral-800"
                  }`}
                >
                  <div className="text-2xl">{f.icon}</div>
                  <div className="text-center text-[8.5px] text-neutral-200">{f.name}</div>
                </motion.div>
              ))}
            </div>

            {/* Fake cursor */}
            <motion.div
              className="pointer-events-none absolute text-lg"
              animate={{
                x: [10, 60, 110, 60, 10],
                y: [10, 40, 20, 60, 10],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              🖱️
            </motion.div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-neutral-700 bg-neutral-800 px-3 py-1 text-[9px] text-neutral-400">
          <span>8 items · 4 folders · 4 files</span>
          <span className="text-neutral-500">NTFS · C:\Users\Student</span>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 4 — Software Management: real installer with cycling states
 * ═════════════════════════════════════════════════════════════ */

export function SoftwareInstallRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-4">
        {/* Installer window */}
        <div className="w-[280px] overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-neutral-800 px-2.5 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <div className="ml-2 text-[10px] font-semibold text-neutral-300">Setup Wizard</div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-sky-500 text-3xl shadow-lg"
              >
                📦
              </motion.div>
              <div>
                <div className="text-sm font-bold text-white">Idic Study App</div>
                <div className="text-[10px] text-neutral-400">version 2.0.4 · 84 MB</div>
              </div>
            </div>

            {/* Phase indicator */}
            <div className="mt-3 space-y-1.5">
              {[
                { label: "Downloading", stage: 0 },
                { label: "Installing", stage: 1 },
                { label: "Ready to use", stage: 2 },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <motion.div
                    className="flex h-3 w-3 items-center justify-center rounded-full border text-[8px]"
                    animate={{
                      backgroundColor: [
                        "rgba(255,255,255,0.05)",
                        i === 2 ? "rgba(52,211,153,0.9)" : "rgba(77,141,255,0.9)",
                        "rgba(255,255,255,0.05)",
                      ],
                      borderColor: [
                        "rgba(255,255,255,0.15)",
                        i === 2 ? "rgba(52,211,153,1)" : "rgba(77,141,255,1)",
                        "rgba(255,255,255,0.15)",
                      ],
                    }}
                    transition={{
                      duration: 6,
                      times: [i * 0.33, i * 0.33 + 0.05, i * 0.33 + 0.32],
                      repeat: Infinity,
                    }}
                  >
                    <motion.span
                      className="text-white"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 6,
                        times: [i * 0.33 + 0.05, i * 0.33 + 0.2, i * 0.33 + 0.32],
                        repeat: Infinity,
                      }}
                    >
                      ✓
                    </motion.span>
                  </motion.div>
                  <div className="flex-1 text-[11px] text-neutral-300">{step.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent via-sky-400 to-emerald-400"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-neutral-500">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 6, times: [0, 0.15, 0.35], repeat: Infinity }}
                >
                  Downloading… 45%
                </motion.span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-3 flex items-center justify-between rounded-md bg-white/[0.03] px-2 py-1.5 text-[9.5px]">
              <span className="text-neutral-400">from</span>
              <span className="font-mono text-accent-bright">store.idic.edu</span>
            </div>
          </div>
        </div>

        {/* Little "what you did" checklist */}
        <div className="flex max-w-[180px] flex-col gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent-bright">
              💡 3 golden rules
            </div>
            <ul className="space-y-1 text-[11px] text-neutral-200">
              <li>✅ Only install from trusted stores</li>
              <li>🔄 Keep apps updated</li>
              <li>🗑️ Uninstall what you don&rsquo;t use</li>
            </ul>
          </div>

          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 6, times: [0.6, 0.75, 0.95], repeat: Infinity }}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-2.5 text-center"
          >
            <div className="text-lg">🎉</div>
            <div className="text-[11px] font-semibold text-emerald-200">Installed!</div>
            <div className="text-[9px] text-emerald-300/70">ready to open</div>
          </motion.div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 5 — Popular Apps & Games
 *     A grid of tiles that look like the app icons students see
 *     every day on their phones / laptops. Not the official logos
 *     (avoid trademark issues) but same colour language, so students
 *     recognise them instantly.
 * ═════════════════════════════════════════════════════════════ */

type AppTile = {
  name: string;
  /** Single letter or short glyph that reads like the real logo. */
  glyph: string;
  /** Background gradient for the tile. */
  bg: string;
  /** Color for the glyph text. */
  fg?: string;
  /** Extra label under the name (e.g. category). */
  hint?: string;
};

const PRODUCTIVITY_APPS: AppTile[] = [
  { name: "Word",       glyph: "W",  bg: "bg-gradient-to-br from-blue-600 to-blue-800",   hint: "documents" },
  { name: "Excel",      glyph: "X",  bg: "bg-gradient-to-br from-emerald-600 to-emerald-800", hint: "spreadsheets" },
  { name: "PowerPoint", glyph: "P",  bg: "bg-gradient-to-br from-orange-500 to-red-600",  hint: "slides" },
  { name: "Outlook",    glyph: "✉",  bg: "bg-gradient-to-br from-sky-500 to-blue-700",    hint: "email" },
  { name: "OneNote",    glyph: "N",  bg: "bg-gradient-to-br from-purple-600 to-fuchsia-700", hint: "notes" },
  { name: "Teams",      glyph: "T",  bg: "bg-gradient-to-br from-indigo-500 to-purple-700", hint: "meetings" },
  { name: "QuickBooks", glyph: "Q",  bg: "bg-gradient-to-br from-green-500 to-emerald-700", hint: "accounting" },
  { name: "Photoshop",  glyph: "Ps", bg: "bg-gradient-to-br from-slate-800 to-blue-950",  fg: "text-sky-300", hint: "photo edit" },
  { name: "Illustrator",glyph: "Ai", bg: "bg-gradient-to-br from-neutral-900 to-amber-900", fg: "text-orange-400", hint: "vector" },
  { name: "Canva",      glyph: "C",  bg: "bg-gradient-to-br from-cyan-400 to-purple-500", hint: "graphics" },
  { name: "Chrome",     glyph: "◉",  bg: "bg-gradient-to-br from-red-500 to-yellow-400",  hint: "browser" },
  { name: "Zoom",       glyph: "Z",  bg: "bg-gradient-to-br from-sky-500 to-blue-600",    hint: "video call" },
];

const GAMES: AppTile[] = [
  { name: "Roblox",       glyph: "R",  bg: "bg-gradient-to-br from-red-500 to-red-800",           hint: "build-a-world" },
  { name: "PUBG",         glyph: "◤",  bg: "bg-gradient-to-br from-yellow-400 to-amber-700",     fg: "text-neutral-900", hint: "battle royale" },
  { name: "Free Fire",    glyph: "🔥",bg: "bg-gradient-to-br from-orange-500 to-red-700",         hint: "battle royale" },
  { name: "Mobile Legends", glyph: "ML", bg: "bg-gradient-to-br from-blue-500 to-indigo-800",     hint: "MOBA" },
  { name: "Minecraft",    glyph: "⛏",  bg: "bg-gradient-to-br from-emerald-500 to-green-800",    hint: "sandbox" },
  { name: "Fortnite",     glyph: "F",  bg: "bg-gradient-to-br from-purple-500 to-fuchsia-800",    hint: "battle royale" },
  { name: "Genshin",      glyph: "✦",  bg: "bg-gradient-to-br from-cyan-500 to-purple-700",      hint: "RPG" },
  { name: "Clash Royale", glyph: "♛",  bg: "bg-gradient-to-br from-amber-500 to-yellow-700",     hint: "cards" },
];

function AppGrid({ apps }: { apps: AppTile[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {apps.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.4, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, scale: 1.05 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${a.bg}`}
          >
            <span
              className={`text-2xl font-black leading-none ${a.fg ?? "text-white"}`}
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {a.glyph}
            </span>
          </div>
          <div className="text-center leading-tight">
            <div className="text-[10.5px] font-semibold text-white">{a.name}</div>
            {a.hint && (
              <div className="text-[8.5px] text-neutral-400">{a.hint}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function PopularAppsRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-1">
        {/* Productivity block */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
              Everyday apps · កម្មវិធីធម្មតា
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-neutral-500">work · study · create</span>
          </div>
          <AppGrid apps={PRODUCTIVITY_APPS} />
        </div>

        {/* Games block */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300">
              Games · ហ្គេម
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-neutral-500">play · compete · connect</span>
          </div>
          <AppGrid apps={GAMES} />
        </div>
      </div>
    </VisualFrame>
  );
}
