"use client";

// Realistic, richly-detailed illustrations for the Web Technology chapter.
// Each visual mimics a real developer tool — code editors, browser windows,
// terminal output — so students immediately recognise what they see.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * Tiny shared window chrome
 * ────────────────────────────────────────────────────────────── */

function WindowFrame({
  title,
  variant = "editor",
  children,
  className = "",
}: {
  title: string;
  variant?: "editor" | "browser" | "terminal";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border shadow-2xl ${
        variant === "terminal"
          ? "border-neutral-800 bg-black"
          : variant === "browser"
            ? "border-neutral-600 bg-neutral-950"
            : "border-neutral-700 bg-neutral-900"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-1.5 border-b px-2.5 py-1.5 ${
          variant === "terminal"
            ? "border-neutral-800 bg-neutral-900"
            : "border-neutral-700 bg-neutral-800"
        }`}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        {variant === "browser" ? (
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[9px] text-neutral-400">
            🔒 <span>{title}</span>
          </div>
        ) : (
          <div className="ml-2 text-[10px] font-semibold text-neutral-300">
            {title}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 1 — HTML & CSS: code editor split with live rendered preview
 * ═════════════════════════════════════════════════════════════ */

export function HtmlCssRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full max-w-[560px] gap-2">
        {/* Editor */}
        <WindowFrame title="index.html · style.css" className="flex-1">
          <div className="p-2 font-mono text-[9.5px] leading-relaxed">
            <div className="text-[8px] text-neutral-500">index.html</div>
            <div className="text-neutral-300">
              <span className="text-pink-400">&lt;h1</span>{" "}
              <span className="text-sky-300">class</span>
              <span className="text-white">=</span>
              <span className="text-emerald-300">&quot;title&quot;</span>
              <span className="text-pink-400">&gt;</span>
            </div>
            <div className="pl-3 text-neutral-200">Hello, class!</div>
            <div className="text-neutral-300">
              <span className="text-pink-400">&lt;/h1&gt;</span>
            </div>
            <div className="text-neutral-300">
              <span className="text-pink-400">&lt;p&gt;</span>Welcome to IT
              <span className="text-pink-400">&lt;/p&gt;</span>
            </div>

            <div className="mt-1.5 text-[8px] text-neutral-500">style.css</div>
            <div>
              <span className="text-emerald-300">.title</span>{" "}
              <span className="text-neutral-400">{"{"}</span>
            </div>
            <div className="pl-3">
              <span className="text-sky-300">color</span>
              <span className="text-white">:</span>{" "}
              <span className="text-amber-300">#4d8dff</span>
              <span className="text-neutral-500">;</span>
            </div>
            <div className="pl-3">
              <span className="text-sky-300">font-size</span>
              <span className="text-white">:</span>{" "}
              <span className="text-amber-300">28px</span>
              <span className="text-neutral-500">;</span>
            </div>
            <div className="pl-3">
              <span className="text-sky-300">font-weight</span>
              <span className="text-white">:</span>{" "}
              <span className="text-amber-300">bold</span>
              <span className="text-neutral-500">;</span>
            </div>
            <div className="text-neutral-400">{"}"}</div>
          </div>
        </WindowFrame>

        {/* Arrow */}
        <div className="flex items-center">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-2xl text-accent-bright"
          >
            →
          </motion.div>
        </div>

        {/* Live browser */}
        <WindowFrame title="idic.edu" variant="browser" className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4"
          >
            <div className="text-[9px] text-neutral-500">✨ Live page</div>
            <h1
              className="mt-2 font-bold"
              style={{ color: "#4d8dff", fontSize: "18px" }}
            >
              Hello, class!
            </h1>
            <p className="mt-1 text-[11px]" style={{ color: "#5c6b83" }}>
              Welcome to IT
            </p>
          </motion.div>
        </WindowFrame>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 2 — JavaScript & PHP: browser (client) vs server (backend)
 * ═════════════════════════════════════════════════════════════ */

export function JsPhpRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full max-w-[560px] items-stretch gap-2">
        {/* Browser */}
        <div className="flex-1">
          <WindowFrame title="app.js · client" variant="browser">
            <div className="p-2">
              <div className="mb-1.5 flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[9px] font-mono text-accent-bright">
                🌐 runs on YOUR device
              </div>
              <div className="rounded bg-black/40 p-1.5 font-mono text-[9px]">
                <div>
                  <span className="text-pink-400">const</span>{" "}
                  <span className="text-sky-300">btn</span> ={" "}
                  <span className="text-amber-300">$(&quot;#buy&quot;)</span>;
                </div>
                <div>
                  <span className="text-sky-300">btn</span>
                  <span className="text-neutral-400">.on</span>(
                  <span className="text-emerald-300">&quot;click&quot;</span>,{" "}
                  <span className="text-pink-400">() =&gt;</span> {"{"}
                </div>
                <div className="pl-3">
                  <span className="text-neutral-400">alert</span>(
                  <span className="text-emerald-300">&quot;thanks!&quot;</span>);
                </div>
                <div>{"});"}</div>
              </div>

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="mt-2 rounded-md bg-accent px-3 py-1.5 text-center text-[10px] font-bold text-white"
              >
                🛒 Buy now
              </motion.div>
              <div className="mt-1 text-[8.5px] text-neutral-400">
                instant · no page reload
              </div>
            </div>
          </WindowFrame>
        </div>

        {/* Middle: HTTP arrow */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-[8px] font-mono text-neutral-500">HTTP</div>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, delay: i * 0.6, repeat: Infinity }}
              className="text-lg text-accent-bright"
            >
              ⇄
            </motion.div>
          ))}
        </div>

        {/* Server */}
        <div className="flex-1">
          <WindowFrame title="index.php · server">
            <div className="p-2">
              <div className="mb-1.5 flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-mono text-purple-300">
                🗄️ runs on the SERVER
              </div>
              <div className="rounded bg-black/40 p-1.5 font-mono text-[9px]">
                <div className="text-purple-300">&lt;?php</div>
                <div>
                  <span className="text-pink-400">$user</span> ={" "}
                  <span className="text-amber-300">db</span>-&gt;
                  <span className="text-neutral-400">find</span>(
                  <span className="text-emerald-300">&quot;42&quot;</span>);
                </div>
                <div>
                  <span className="text-pink-400">echo</span>{" "}
                  <span className="text-emerald-300">&quot;Hi &quot;</span>.
                  <span className="text-pink-400">$user</span>-&gt;name;
                </div>
                <div className="text-purple-300">?&gt;</div>
              </div>

              <div className="mt-2 flex items-center gap-1 rounded bg-white/[0.03] p-1.5 text-[9px]">
                <div className="text-lg">🗃️</div>
                <div>
                  <div className="font-mono text-purple-300">database</div>
                  <div className="text-neutral-500">users · orders</div>
                </div>
              </div>
              <div className="mt-1 text-[8.5px] text-neutral-400">
                talks to the database · sends HTML back
              </div>
            </div>
          </WindowFrame>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 3 — WordPress: real admin dashboard with block editor
 * ═════════════════════════════════════════════════════════════ */

export function WordpressRealisticVisual() {
  return (
    <VisualFrame>
      <WindowFrame title="mysite.com/wp-admin" variant="browser" className="w-full max-w-[560px]">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-24 border-r border-neutral-700 bg-neutral-900 py-1">
            {[
              { icon: "📊", label: "Dashboard" },
              { icon: "📝", label: "Posts" },
              { icon: "🖼️", label: "Media" },
              { icon: "📄", label: "Pages", active: true },
              { icon: "🎨", label: "Appearance" },
              { icon: "🧩", label: "Plugins" },
            ].map((s) => (
              <div
                key={s.label}
                className={`flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] ${
                  s.active
                    ? "bg-accent text-white"
                    : "text-neutral-400 hover:bg-white/5"
                }`}
              >
                <span className="text-[9px]">{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 bg-white p-2">
            {/* Toolbar */}
            <div className="mb-1.5 flex items-center gap-1 border-b border-neutral-200 pb-1">
              <button className="rounded bg-neutral-900 px-2 py-0.5 text-[8px] font-semibold text-white">
                + Add block
              </button>
              <div className="ml-auto flex items-center gap-1">
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700">
                  Saved
                </span>
                <span className="rounded bg-accent px-2 py-0.5 text-[8px] font-semibold text-white">
                  Publish
                </span>
              </div>
            </div>

            {/* Blocks being edited */}
            <div className="space-y-1">
              {[
                { type: "Heading", content: "Welcome to my class", cls: "text-sm font-bold text-neutral-800" },
                { type: "Paragraph", content: "This is an IT course for beginners.", cls: "text-[9px] text-neutral-600" },
                { type: "Image", content: "🖼️  featured.jpg", cls: "text-[9px] text-neutral-500" },
                { type: "Button", content: "Enroll now", cls: "inline-block rounded bg-accent px-2 py-0.5 text-[8px] font-semibold text-white" },
              ].map((b, i) => (
                <motion.div
                  key={b.type}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="group rounded border border-dashed border-neutral-300 p-1.5 hover:border-accent"
                >
                  <div className="text-[7px] uppercase tracking-widest text-neutral-400">
                    {b.type} block
                  </div>
                  <div className={`mt-0.5 ${b.cls}`}>{b.content}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-1.5 rounded-md bg-accent-soft px-1.5 py-1 text-center text-[9px] text-accent-bright">
              drag &amp; drop blocks · no coding
            </div>
          </div>
        </div>
      </WindowFrame>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 4 — Domains & Hosting: registrar panel → hosting rack
 * ═════════════════════════════════════════════════════════════ */

export function DomainHostingRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-stretch gap-3">
        {/* Domain registrar panel */}
        <div className="flex-1">
          <WindowFrame title="Domain Manager" variant="browser">
            <div className="p-2">
              <div className="mb-1 text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                Domain
              </div>
              <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-2">
                <div className="font-mono text-base font-black text-white">
                  idic.<span className="text-amber-300">edu</span>
                </div>
                <div className="mt-0.5 text-[9px] text-amber-200/70">
                  registered 2024 · renews 2027
                </div>
              </div>

              <div className="mt-2 rounded-md bg-black/30 p-1.5">
                <div className="mb-1 text-[8.5px] font-mono text-neutral-500">
                  DNS record
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px]">
                  <span className="rounded bg-accent-soft px-1 text-accent-bright">A</span>
                  <span className="text-neutral-400">idic.edu →</span>
                  <span className="text-white">203.19.8.44</span>
                </div>
              </div>
              <div className="mt-1.5 text-center text-[9px] text-neutral-400">
                📛 the ADDRESS
              </div>
            </div>
          </WindowFrame>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="font-mono text-[8px] text-neutral-500">points to</div>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-accent-bright"
          >
            →
          </motion.div>
        </div>

        {/* Hosting rack */}
        <div className="flex flex-1 flex-col items-center">
          <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
            Hosting
          </div>
          <div className="mt-1 w-full overflow-hidden rounded-lg border-2 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-2 py-1">
              <motion.div
                className="flex items-center gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[8px] text-emerald-400">ONLINE</span>
              </motion.div>
              <span className="font-mono text-[8px] text-neutral-500">
                203.19.8.44
              </span>
            </div>
            <div className="space-y-1 p-1.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-sm bg-neutral-800 px-2 py-1"
                >
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="h-1 w-1 rounded-full bg-emerald-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                    />
                    <span className="font-mono text-[8px] text-neutral-300">
                      idic-web-0{i + 1}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="h-1 w-0.5 rounded-sm bg-neutral-600" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1 text-center text-[9px] text-neutral-400">
            🏠 the HOUSE where files live
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 5 — DNS: real `dig` terminal output showing resolution
 * ═════════════════════════════════════════════════════════════ */

export function DnsRealisticVisual() {
  const lines = [
    { text: "$ dig idic.edu", cls: "text-white" },
    { text: "", cls: "" },
    { text: "; <<>> DiG 9.18 <<>> idic.edu", cls: "text-neutral-500" },
    { text: ";; QUESTION SECTION:", cls: "text-amber-300" },
    { text: ";idic.edu.        IN    A", cls: "text-neutral-300" },
    { text: "", cls: "" },
    { text: ";; ANSWER SECTION:", cls: "text-emerald-400" },
    { text: "idic.edu.  3600 IN A  203.19.8.44", cls: "text-white" },
    { text: "", cls: "" },
    { text: ";; Query time: 22 msec ✓", cls: "text-sky-400" },
  ];

  return (
    <VisualFrame>
      <div className="flex w-full max-w-[540px] items-stretch gap-3">
        <WindowFrame title="dig · terminal" variant="terminal" className="flex-1">
          <div className="p-2 font-mono text-[9px] leading-relaxed">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.25 }}
                className={line.cls || "text-neutral-300"}
                style={{ minHeight: "1em" }}
              >
                {line.text}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block h-3 w-1.5 bg-emerald-400"
            />
          </div>
        </WindowFrame>

        {/* Visual translation */}
        <div className="flex flex-col justify-center gap-2">
          <div className="rounded-lg border border-accent/40 bg-accent-soft p-2 font-mono text-[10px]">
            <div className="text-[8px] text-accent-bright">you type</div>
            <div className="text-white">idic.edu</div>
          </div>
          <div className="flex justify-center text-lg">
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              📖
            </motion.span>
          </div>
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-2 font-mono text-[10px]">
            <div className="text-[8px] text-emerald-300">DNS answers</div>
            <div className="text-white">203.19.8.44</div>
          </div>
          <div className="text-center text-[9px] text-neutral-400">
            the phone book<br />of the internet
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 6 — ICANN & IANA: root DNS servers on a world map + hierarchy
 * ═════════════════════════════════════════════════════════════ */

export function IcannIanaRealisticVisual() {
  const rootServers = [
    { name: "A", city: "New York", x: 25, y: 40 },
    { name: "B", city: "Los Angeles", x: 18, y: 45 },
    { name: "F", city: "London", x: 48, y: 30 },
    { name: "I", city: "Stockholm", x: 52, y: 25 },
    { name: "K", city: "Amsterdam", x: 50, y: 32 },
    { name: "L", city: "Frankfurt", x: 50, y: 35 },
    { name: "M", city: "Tokyo", x: 82, y: 42 },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full gap-3">
        {/* World map with root servers */}
        <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#0a1428]">
          <svg viewBox="0 0 100 60" className="h-full w-full">
            {/* Simple continent shapes */}
            <path
              d="M 5 30 Q 10 25 20 26 L 30 30 L 32 40 L 25 50 L 12 48 L 8 40 Z"
              fill="rgba(77,141,255,0.15)"
              stroke="rgba(77,141,255,0.3)"
              strokeWidth="0.3"
            />
            <path
              d="M 40 25 Q 48 22 55 25 L 60 32 L 55 42 L 45 40 L 42 32 Z"
              fill="rgba(77,141,255,0.15)"
              stroke="rgba(77,141,255,0.3)"
              strokeWidth="0.3"
            />
            <path
              d="M 55 30 Q 65 28 78 32 L 85 40 Q 82 48 75 50 L 62 46 L 58 38 Z"
              fill="rgba(77,141,255,0.15)"
              stroke="rgba(77,141,255,0.3)"
              strokeWidth="0.3"
            />
            <path
              d="M 78 40 Q 88 42 92 48 L 88 55 L 82 55 L 78 48 Z"
              fill="rgba(77,141,255,0.15)"
              stroke="rgba(77,141,255,0.3)"
              strokeWidth="0.3"
            />
            <path
              d="M 20 48 Q 25 46 30 48 L 28 55 L 22 55 Z"
              fill="rgba(77,141,255,0.15)"
              stroke="rgba(77,141,255,0.3)"
              strokeWidth="0.3"
            />

            {/* Root servers */}
            {rootServers.map((s, i) => (
              <g key={s.name}>
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r="1.5"
                  fill="#fbbf24"
                  animate={{ r: [1, 2, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  style={{ filter: "drop-shadow(0 0 3px rgba(251,191,36,1))" }}
                />
                <text
                  x={s.x}
                  y={s.y - 2.5}
                  fontSize="2"
                  fill="#fde68a"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="700"
                >
                  {s.name}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-amber-300">
            🌐 13 root DNS servers
          </div>
        </div>

        {/* Governance hierarchy */}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            Governance
          </div>
          {[
            { name: "ICANN", role: "oversees names", color: "bg-accent/25 border-accent/50", size: "w-full" },
            { name: "IANA", role: "assigns numbers", color: "bg-sky-500/20 border-sky-400/50", size: "w-11/12" },
            { name: "Registry", role: ".com · .org · .kh", color: "bg-emerald-500/20 border-emerald-400/50", size: "w-10/12" },
            { name: "Registrar", role: "you buy from", color: "bg-amber-500/20 border-amber-400/50", size: "w-9/12" },
            { name: "You", role: "the domain owner", color: "bg-purple-500/20 border-purple-400/50", size: "w-8/12" },
          ].map((row, i) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-md border ${row.color} ${row.size} px-2 py-1`}
            >
              <div className="text-[10px] font-bold text-white">{row.name}</div>
              <div className="text-[8.5px] text-neutral-300">{row.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 7 — WHOIS: real `whois` command output
 * ═════════════════════════════════════════════════════════════ */

export function WhoisRealisticVisual() {
  const rows = [
    { label: "Domain Name", value: "IDIC.EDU" },
    { label: "Registrar", value: "IDIC Registry Ltd" },
    { label: "Created", value: "2024-08-15" },
    { label: "Expires", value: "2027-08-15" },
    { label: "Registrant", value: "REDACTED (privacy)" },
    { label: "Country", value: "Cambodia (KH)" },
    { label: "Name Server 1", value: "ns1.idic.edu" },
    { label: "Name Server 2", value: "ns2.idic.edu" },
    { label: "Status", value: "clientTransferProhibited" },
    { label: "DNSSEC", value: "signed ✓" },
  ];
  return (
    <VisualFrame>
      <WindowFrame title="whois · terminal" variant="terminal" className="w-full max-w-[540px]">
        <div className="relative p-2 font-mono text-[9.5px] leading-relaxed">
          <div className="text-white">$ whois idic.edu</div>
          <div className="mt-1 text-neutral-500">
            [ Querying whois.iana.org ]
          </div>
          <div className="text-neutral-500">[ redirected to whois.idic.edu ]</div>
          <div className="mt-1.5 space-y-0.5">
            {rows.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex gap-2"
              >
                <span className="w-24 shrink-0 text-sky-300">{r.label}:</span>
                <span className="flex-1 text-neutral-200">{r.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ x: [-40, 320, -40], y: [10, 30, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute text-2xl"
          >
            🔍
          </motion.div>
        </div>
      </WindowFrame>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 8 — TCP/IP: 4-layer stack with packet encapsulation
 * ═════════════════════════════════════════════════════════════ */

export function TcpIpRealisticVisual() {
  const layers = [
    {
      name: "Application",
      protos: "HTTP · DNS · SMTP",
      color: "bg-sky-500/25 border-sky-400/60",
      textColor: "text-sky-200",
    },
    {
      name: "Transport",
      protos: "TCP · UDP",
      color: "bg-accent/25 border-accent/60",
      textColor: "text-blue-200",
    },
    {
      name: "Internet",
      protos: "IP · ICMP",
      color: "bg-emerald-500/25 border-emerald-400/60",
      textColor: "text-emerald-200",
    },
    {
      name: "Link",
      protos: "Wi-Fi · Ethernet",
      color: "bg-amber-500/25 border-amber-400/60",
      textColor: "text-amber-200",
    },
  ];

  return (
    <VisualFrame>
      <div className="flex w-full max-w-[560px] gap-4">
        {/* Stack */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            TCP/IP · 4 layers
          </div>
          {layers.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between rounded-md border-2 ${l.color} px-2.5 py-1.5`}
            >
              <div>
                <div className={`text-[11px] font-bold ${l.textColor}`}>{l.name}</div>
                <div className="font-mono text-[8.5px] text-white/70">{l.protos}</div>
              </div>
              <div className="font-mono text-[9px] text-white/50">L{4 - i}</div>
            </motion.div>
          ))}
          <div className="mt-1 text-center text-[9px] text-neutral-400">
            each layer wraps the one above
          </div>
        </div>

        {/* Packet nesting */}
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-lg border-2 border-amber-400/60 bg-amber-400/5 p-2"
          >
            <div className="text-[8px] font-mono text-amber-300">Link header</div>
            <div className="mt-1 rounded border-2 border-emerald-400/60 bg-emerald-400/5 p-2">
              <div className="text-[8px] font-mono text-emerald-300">IP header</div>
              <div className="mt-1 rounded border-2 border-accent/60 bg-accent/5 p-2">
                <div className="text-[8px] font-mono text-blue-200">TCP header</div>
                <div className="mt-1 rounded border-2 border-sky-400/60 bg-sky-400/5 p-2">
                  <div className="text-[8px] font-mono text-sky-200">HTTP data</div>
                  <div className="mt-0.5 rounded bg-black/40 p-1 font-mono text-[7px] text-white">
                    GET /home
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 9 — How the Internet Works: end-to-end flow
 * ═════════════════════════════════════════════════════════════ */

export function InternetJourneyRealisticVisual() {
  const stops = [
    { emoji: "💻", label: "Browser", desc: "you type URL", color: "border-accent/50 bg-accent/10" },
    { emoji: "📖", label: "DNS", desc: "look up IP", color: "border-emerald-400/50 bg-emerald-400/10" },
    { emoji: "🔒", label: "TLS", desc: "encrypt", color: "border-amber-400/50 bg-amber-400/10" },
    { emoji: "📡", label: "Routers", desc: "hop, hop, hop", color: "border-sky-400/50 bg-sky-400/10" },
    { emoji: "🗄️", label: "Server", desc: "sends HTML", color: "border-purple-400/50 bg-purple-400/10" },
    { emoji: "🖥️", label: "Screen", desc: "pixels drawn", color: "border-pink-400/50 bg-pink-400/10" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col gap-2">
        <div className="text-center text-[10px] font-mono uppercase tracking-widest text-accent-bright">
          What happens when you open idic.edu
        </div>
        <div className="flex items-center justify-between gap-1">
          {stops.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className={`flex flex-col items-center gap-0.5 rounded-lg border-2 ${s.color} px-1.5 py-1`}
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="text-[9.5px] font-bold text-white">
                  {i + 1}. {s.label}
                </div>
                <div className="text-[8px] text-neutral-300">{s.desc}</div>
              </motion.div>
              {i < stops.length - 1 && (
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
                  className="text-[10px] text-neutral-500"
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Live packet */}
        <div className="relative h-2 rounded-full bg-white/5">
          <motion.div
            className="absolute -top-1 h-4 w-4 rounded-full bg-accent-bright shadow-[0_0_10px_rgba(77,141,255,0.9)]"
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Summary chips */}
        <div className="flex justify-center gap-2 text-[9px]">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-neutral-300">
            🕒 finishes in ~200 ms
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-neutral-300">
            🌏 travels around the world
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
