"use client";

// Realistic, richly-detailed illustrations for the Cybersecurity chapter.
// Each visual mimics a real security tool — SIEM dashboards, terminal
// exploits, antivirus scanners, phishing email comparisons.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ═════════════════════════════════════════════════════════════════
 * 1 — Security Fundamentals: 3D-style CIA triad with metrics
 * ═════════════════════════════════════════════════════════════ */

export function CiaTriadRealisticVisual() {
  const pillars = [
    {
      letter: "C",
      title: "Confidentiality",
      meaning: "only right eyes see it",
      icon: "🔐",
      color: "from-sky-500 to-blue-700",
      metric: "AES-256",
      status: "encrypted",
    },
    {
      letter: "I",
      title: "Integrity",
      meaning: "data untampered",
      icon: "🛡️",
      color: "from-emerald-500 to-teal-700",
      metric: "SHA-256",
      status: "verified",
    },
    {
      letter: "A",
      title: "Availability",
      meaning: "up when you need it",
      icon: "⚡",
      color: "from-amber-500 to-orange-700",
      metric: "99.9% up",
      status: "online",
    },
  ];

  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
          The C-I-A Triad · pillars of every secure system
        </div>
        <div className="flex gap-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.letter}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Shield shape */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                className={`relative flex h-36 w-28 flex-col items-center justify-center bg-gradient-to-b ${p.color} p-2 shadow-2xl`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)",
                }}
              >
                {/* Shine */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%)",
                  }}
                />

                <div className="text-2xl">{p.icon}</div>
                <div className="mt-1 font-black text-white text-4xl leading-none">
                  {p.letter}
                </div>
                <div className="mt-1 text-[9px] font-bold text-white text-center">
                  {p.title}
                </div>
              </motion.div>

              {/* Status chip */}
              <div className="mt-2 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-1">
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  />
                  <span className="text-[9px] font-mono text-emerald-300">
                    {p.status}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-white">
                  {p.metric}
                </div>
                <div className="text-[7.5px] text-neutral-400">{p.meaning}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-center text-[10px] text-neutral-300">
          🎯 all three at the same time = real security
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 2 — Hacking: real penetration-testing terminal
 * ═════════════════════════════════════════════════════════════ */

export function HackingRealisticVisual() {
  const lines = [
    { text: "root@kali:~# nmap -sV target.com", cls: "text-emerald-400" },
    { text: "Scanning 203.19.8.44…", cls: "text-neutral-400" },
    { text: "PORT   STATE  SERVICE", cls: "text-sky-300" },
    { text: "22/tcp open   ssh    OpenSSH 7.6", cls: "text-neutral-200" },
    { text: "80/tcp open   http   Apache 2.4.29", cls: "text-neutral-200" },
    { text: "443/tcp open  https  Apache 2.4.29", cls: "text-neutral-200" },
    { text: "", cls: "" },
    { text: "root@kali:~# nikto -h http://target", cls: "text-emerald-400" },
    { text: "+ OSVDB-3268: /admin/: Directory indexing", cls: "text-amber-300" },
    { text: "+ CVE-2021-41773: outdated Apache", cls: "text-rose-400" },
    { text: "! WEAK POINT FOUND", cls: "text-rose-400" },
  ];

  return (
    <VisualFrame>
      <div className="flex w-full gap-3">
        {/* Terminal */}
        <div className="flex-1 overflow-hidden rounded-lg border border-neutral-800 bg-black shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-neutral-900 px-2.5 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <div className="ml-2 text-[10px] font-semibold text-neutral-400">
              💀 Kali · security scan
            </div>
          </div>
          <div className="relative h-40 overflow-hidden p-2 font-mono text-[9px] leading-tight">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.3 }}
                className={line.cls || "text-neutral-500"}
                style={{ minHeight: "1em" }}
              >
                {line.text}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="inline-block h-3 w-1.5 bg-emerald-400"
            />
          </div>
        </div>

        {/* Threat map */}
        <div className="flex w-32 flex-col gap-1.5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
            Findings
          </div>
          {[
            { name: "Open SSH", severity: "info", color: "bg-sky-500/70" },
            { name: "Outdated Apache", severity: "medium", color: "bg-amber-500/80" },
            { name: "CVE-2021", severity: "critical", color: "bg-rose-500/90" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.2 }}
              className={`rounded-md ${t.color} p-1.5 shadow`}
            >
              <div className="text-[8.5px] font-bold text-white">{t.name}</div>
              <div className="text-[7.5px] text-white/70 uppercase tracking-widest">
                {t.severity}
              </div>
            </motion.div>
          ))}
          <div className="mt-1 rounded-md bg-black/40 px-1.5 py-1 text-center text-[8px] text-neutral-400">
            found before criminals do
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 3 — Hackers: three persona ID-badge cards
 * ═════════════════════════════════════════════════════════════ */

export function HackerCardsRealisticVisual() {
  const hats = [
    {
      hat: "🎩",
      title: "White Hat",
      role: "ETHICAL",
      motive: "hired to defend",
      tools: ["Nmap", "Burp Suite", "Metasploit"],
      color: "border-emerald-400 bg-emerald-400/10",
      chipColor: "bg-emerald-500 text-white",
    },
    {
      hat: "🎩",
      title: "Grey Hat",
      role: "UNPREDICTABLE",
      motive: "breaks rules · usually discloses",
      tools: ["scanners", "researcher tools"],
      color: "border-neutral-400 bg-neutral-400/10",
      chipColor: "bg-neutral-500 text-white",
    },
    {
      hat: "🎩",
      title: "Black Hat",
      role: "CRIMINAL",
      motive: "attacks for money / damage",
      tools: ["ransomware kits", "botnets"],
      color: "border-rose-500 bg-rose-500/10",
      chipColor: "bg-rose-600 text-white",
    },
  ];

  return (
    <VisualFrame>
      <div className="grid w-full grid-cols-3 gap-3">
        {hats.map((h, i) => (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`flex flex-col overflow-hidden rounded-xl border-2 ${h.color} shadow-lg`}
          >
            {/* ID header */}
            <div className={`flex items-center justify-between ${h.chipColor} px-2 py-1`}>
              <div className="font-mono text-[8px] font-bold uppercase tracking-widest">
                {h.role}
              </div>
              <div className="font-mono text-[8px] opacity-80">ID-{i + 1}</div>
            </div>

            {/* Silhouette + hat */}
            <div className="flex flex-col items-center gap-1 py-2">
              <motion.div
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
                className="text-4xl"
              >
                {h.hat}
              </motion.div>
              <div className="text-3xl">👤</div>
              <div className="text-[11px] font-bold text-white">{h.title}</div>
            </div>

            {/* Details */}
            <div className="border-t border-white/10 bg-black/30 p-1.5">
              <div className="font-mono text-[7.5px] uppercase tracking-widest text-neutral-400">
                Motive
              </div>
              <div className="text-[10px] text-white">{h.motive}</div>

              <div className="mt-1.5 font-mono text-[7.5px] uppercase tracking-widest text-neutral-400">
                Tools
              </div>
              <div className="mt-0.5 flex flex-wrap gap-0.5">
                {h.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[8px] text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 4 — Malware: antivirus quarantine scanner
 * ═════════════════════════════════════════════════════════════ */

export function MalwareScannerRealisticVisual() {
  const threats = [
    { name: "trojan.exe", type: "Trojan", icon: "🐴", color: "text-rose-400" },
    { name: "worm.js", type: "Worm", icon: "🪱", color: "text-amber-400" },
    { name: "crypt-o-lock", type: "Ransomware", icon: "💰", color: "text-purple-400" },
    { name: "keylog.dll", type: "Spyware", icon: "👁️", color: "text-sky-400" },
    { name: "adload.zip", type: "Adware", icon: "📣", color: "text-emerald-400" },
  ];

  return (
    <VisualFrame>
      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-700 bg-gradient-to-r from-neutral-800 to-neutral-850 px-3 py-2">
          <div className="text-xl">🛡️</div>
          <div>
            <div className="text-[11px] font-bold text-white">IDIC Antivirus</div>
            <div className="text-[9px] text-neutral-400">Real-time protection</div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="ml-auto flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] font-semibold text-rose-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            SCANNING
          </motion.div>
        </div>

        <div className="p-3">
          {/* Live scan bar */}
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-[9px]">
              <span className="text-neutral-400">Scanning system…</span>
              <motion.span
                animate={{ opacity: [1] }}
                className="font-mono text-emerald-300"
              >
                <motion.span
                  key="count"
                  animate={{ opacity: [1] }}
                >
                  8,204 files
                </motion.span>
              </motion.span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-rose-400"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Threats list */}
          <div className="text-[9px] font-mono uppercase tracking-widest text-rose-300">
            ⚠ THREATS FOUND · quarantined
          </div>
          <div className="mt-1 space-y-1">
            {threats.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.35 }}
                className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-2 py-1"
              >
                <div className="text-lg">{t.icon}</div>
                <div className="flex-1">
                  <div className="font-mono text-[9.5px] text-white">{t.name}</div>
                  <div className={`text-[8px] ${t.color}`}>{t.type}</div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  className="rounded-full bg-rose-500 px-2 py-0.5 text-[8px] font-bold text-white"
                >
                  🔒 quarantined
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-center text-[9px] text-emerald-300">
            ✓ 5 threats stopped · your system is safe
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 5 — DoS/DDoS: server monitor under attack
 * ═════════════════════════════════════════════════════════════ */

export function DdosRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-stretch gap-3">
        {/* Attacker sources */}
        <div className="flex w-24 flex-col justify-around">
          <div className="text-[9px] font-mono uppercase tracking-widest text-rose-300">
            🤖 Botnet
          </div>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1 rounded bg-rose-500/10 px-1 py-0.5 text-[8px] text-rose-200"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
            >
              <span>💻</span>
              <span className="font-mono">bot-{i}</span>
            </motion.div>
          ))}
          <div className="text-center text-[8px] text-rose-300">+ 100k more</div>
        </div>

        {/* Attack packets in flight */}
        <div className="relative flex-1 self-stretch">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-rose-400"
              style={{
                top: `${(i * 13) % 100}%`,
                left: 0,
                filter: "drop-shadow(0 0 3px rgba(244,63,94,0.8))",
              }}
              animate={{ x: ["0px", "180px"], opacity: [0, 1, 0] }}
              transition={{
                duration: 1,
                delay: (i * 0.06) % 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Server monitor */}
        <div className="flex-1 overflow-hidden rounded-lg border border-rose-400/40 bg-neutral-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <motion.div
                className="h-2 w-2 rounded-full bg-rose-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <div className="text-[10px] font-semibold text-white">
                Server Status
              </div>
            </div>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="rounded-full bg-rose-500 px-2 py-0.5 font-mono text-[8px] font-bold text-white"
            >
              🚨 UNDER ATTACK
            </motion.div>
          </div>

          <div className="p-2">
            <div className="mb-2 grid grid-cols-2 gap-1.5">
              {[
                { label: "Requests/sec", value: "1.2M", color: "text-rose-300" },
                { label: "CPU", value: "100%", color: "text-rose-300" },
                { label: "Memory", value: "98%", color: "text-amber-300" },
                { label: "Response", value: "TIMEOUT", color: "text-rose-400" },
              ].map((m) => (
                <div key={m.label} className="rounded-md bg-black/50 px-1.5 py-1">
                  <div className="text-[8px] uppercase tracking-widest text-neutral-500">
                    {m.label}
                  </div>
                  <div className={`font-mono text-[11px] font-bold ${m.color}`}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Live traffic graph */}
            <div className="rounded-md bg-black/50 p-1.5">
              <div className="mb-1 text-[8px] font-mono text-neutral-500">
                traffic (last 30 s)
              </div>
              <svg viewBox="0 0 200 30" className="h-8 w-full">
                <motion.path
                  d="M 0 25 L 20 24 L 40 22 L 60 20 L 80 5 L 100 8 L 120 3 L 140 5 L 160 2 L 180 4 L 200 3"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                {/* Baseline */}
                <line x1="0" x2="200" y1="25" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" strokeDasharray="2 2" />
                <text x="2" y="24" fontSize="4" fill="#666" fontFamily="ui-monospace, monospace">normal</text>
              </svg>
            </div>

            <div className="mt-1.5 text-center text-[8.5px] text-rose-300">
              ⚠ real users can&rsquo;t reach the site
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 6 — Common Attacks: attack + defense pairs
 * ═════════════════════════════════════════════════════════════ */

export function AttacksRealisticVisual() {
  const attacks = [
    {
      icon: "💉",
      name: "SQL Injection",
      example: `' OR 1=1--`,
      defense: "prepared statements",
    },
    {
      icon: "🎣",
      name: "Phishing",
      example: "fake bank email",
      defense: "verify sender",
    },
    {
      icon: "🕵️",
      name: "MITM",
      example: "café Wi-Fi spy",
      defense: "HTTPS · VPN",
    },
    {
      icon: "🔨",
      name: "Brute Force",
      example: "password: 12345",
      defense: "long unique + 2FA",
    },
  ];

  return (
    <VisualFrame>
      <div className="w-full max-w-[560px]">
        <div className="mb-2 text-center text-[10px] font-mono uppercase tracking-widest text-accent-bright">
          🎯 Attack vs 🛡️ Defense
        </div>
        <div className="grid grid-cols-2 gap-2">
          {attacks.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]"
            >
              {/* Attack side */}
              <div className="border-b border-white/10 bg-rose-500/10 p-2">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{a.icon}</div>
                  <div>
                    <div className="font-mono text-[7.5px] uppercase tracking-widest text-rose-300">
                      Attack
                    </div>
                    <div className="text-[11px] font-bold text-white">{a.name}</div>
                  </div>
                </div>
                <div className="mt-1 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[8.5px] text-rose-100">
                  {a.example}
                </div>
              </div>
              {/* Defense side */}
              <div className="flex items-center gap-1.5 bg-emerald-500/10 p-2">
                <div className="text-sm">🛡️</div>
                <div>
                  <div className="font-mono text-[7.5px] uppercase tracking-widest text-emerald-300">
                    Defense
                  </div>
                  <div className="text-[10px] font-semibold text-white">
                    {a.defense}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 7 — Phishing: real vs fake email side-by-side
 * ═════════════════════════════════════════════════════════════ */

export function PhishingRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full max-w-[600px] gap-2">
        {/* REAL email */}
        <div className="flex-1 overflow-hidden rounded-lg border-2 border-emerald-400/50 bg-neutral-900 shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-emerald-500/10 px-2 py-1">
            <div className="text-lg">✅</div>
            <div className="text-[10px] font-bold text-emerald-300">Real email</div>
          </div>
          <div className="p-2 text-[9.5px] text-white">
            <div className="rounded bg-black/40 px-1.5 py-1 font-mono text-[9px]">
              <div className="text-neutral-400">
                <span className="text-neutral-500">from:</span>{" "}
                <span className="text-emerald-300">no-reply@bank.com</span>
              </div>
              <div className="text-neutral-400">
                <span className="text-neutral-500">subject:</span> Your monthly statement
              </div>
            </div>
            <div className="mt-1.5 leading-relaxed">
              Hello Sarah,<br />
              Your July statement is ready. You can view it by signing in to your account.
            </div>
            <button className="mt-1.5 rounded bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">
              Sign in
            </button>
            <div className="mt-1 text-[7.5px] text-neutral-500">
              Bank of IDIC · Phnom Penh
            </div>
          </div>
        </div>

        {/* FAKE (phishing) email */}
        <div className="flex-1 overflow-hidden rounded-lg border-2 border-rose-500/50 bg-neutral-900 shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-rose-500/10 px-2 py-1">
            <div className="text-lg">🎣</div>
            <div className="text-[10px] font-bold text-rose-300">Phishing email</div>
          </div>
          <div className="p-2 text-[9.5px] text-white">
            <div className="rounded bg-black/40 px-1.5 py-1 font-mono text-[9px]">
              <div className="text-neutral-400">
                <span className="text-neutral-500">from:</span>{" "}
                <motion.span
                  animate={{ color: ["#fca5a5", "#f43f5e", "#fca5a5"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  bank-security@b4nk.co
                </motion.span>
                <span className="ml-1 text-[7.5px] text-rose-400">← wrong!</span>
              </div>
              <div className="text-neutral-400">
                <span className="text-neutral-500">subject:</span>{" "}
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-rose-300"
                >
                  🚨 URGENT: account will close!
                </motion.span>
              </div>
            </div>
            <div className="mt-1.5 leading-relaxed">
              Dear Customer,<br />
              We need to verify your{" "}
              <span className="underline decoration-rose-400 decoration-wavy">
                password
              </span>{" "}
              NOW or your account will be closed in 24 hours!
            </div>
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-1.5 rounded bg-rose-600 px-2 py-0.5 text-[9px] font-bold text-white"
            >
              CLICK HERE NOW
            </motion.button>
            <div className="mt-1 text-[7.5px] text-rose-400">
              bit.ly/x92k7 ← suspicious link
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 7.5 — Stuxnet: the perfect attack, as a 7-step kill-chain
 * ═════════════════════════════════════════════════════════════ */

export function StuxnetRealisticVisual() {
  const steps = [
    { n: 1, icon: "🔌", title: "Hide in a USB", detail: "A worker plugs it in. The virus wakes up.", color: "text-amber-300", dot: "bg-amber-400" },
    { n: 2, icon: "🪟", title: "Sneak into Windows", detail: "Uses 4 secret bugs nobody has fixed yet.", color: "text-rose-300", dot: "bg-rose-400" },
    { n: 3, icon: "📜", title: "Fake ID", detail: "Signed with a stolen company badge.", color: "text-fuchsia-300", dot: "bg-fuchsia-400" },
    { n: 4, icon: "🕸️", title: "Spread quietly", detail: "Jumps PC to PC. Only wakes up at the target.", color: "text-sky-300", dot: "bg-sky-400" },
    { n: 5, icon: "🧠", title: "Find the machine", detail: "Looks for the chip that spins centrifuges.", color: "text-emerald-300", dot: "bg-emerald-400" },
    { n: 6, icon: "🌀", title: "Spin too fast", detail: "Shakes the machines until they break.", color: "text-orange-300", dot: "bg-orange-400" },
    { n: 7, icon: "🎭", title: "Lie to the screen", detail: "Workers see 'all normal' while machines break.", color: "text-violet-300", dot: "bg-violet-400" },
  ];

  return (
    <VisualFrame>
      <div className="flex h-full w-full flex-col gap-2">
        {/* Top banner */}
        <div className="flex items-center justify-between rounded-md border border-rose-400/30 bg-rose-500/5 px-3 py-1.5">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-rose-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <div className="text-[10px] font-mono uppercase tracking-widest text-rose-200">
              Case file · stuxnet.worm
            </div>
          </div>
          <div className="flex gap-1.5 font-mono text-[9px]">
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-neutral-300">where: Iran nuclear factory</span>
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-neutral-300">when: 2010</span>
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-neutral-300">size: tiny · 500 KB</span>
          </div>
        </div>

        {/* Attack chain */}
        <div className="relative flex flex-1 items-stretch gap-1.5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="relative flex flex-1 flex-col rounded-lg border border-white/10 bg-black/40 p-1.5"
            >
              {/* Phase pill */}
              <div className="mb-1 flex items-center justify-between">
                <div className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-neutral-400">
                  phase {s.n}
                </div>
                <motion.div
                  className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}
                />
              </div>

              <div className="text-2xl leading-none">{s.icon}</div>
              <div className={`mt-1 text-[11px] font-bold ${s.color}`}>{s.title}</div>
              <div className="mt-0.5 text-[9px] leading-tight text-neutral-400">
                {s.detail}
              </div>

              {/* Arrow to next card */}
              {i < steps.length - 1 && (
                <motion.div
                  className="pointer-events-none absolute -right-2 top-1/2 z-10 -translate-y-1/2 text-xs text-rose-300"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                >
                  ▶
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom result readout */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { k: "machines broken", v: "~1,000", color: "text-rose-300" },
            { k: "set Iran back by", v: "2+ years", color: "text-amber-300" },
            { k: "secret bugs used", v: "4", color: "text-fuchsia-300" },
            { k: "hidden for", v: "17 months", color: "text-violet-300" },
          ].map((m) => (
            <div key={m.k} className="rounded-md border border-white/10 bg-black/50 px-2 py-1">
              <div className="text-[8px] uppercase tracking-widest text-neutral-500">
                {m.k}
              </div>
              <div className={`font-mono text-[12px] font-bold ${m.color}`}>
                {m.v}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-[9.5px] italic text-neutral-400">
          First virus in history to break <span className="text-white">real machines</span> — not just computers.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 8 — Defenses: multi-layer security stack diagram
 * ═════════════════════════════════════════════════════════════ */

export function DefensesRealisticVisual() {
  const layers = [
    { name: "You", icon: "👤", color: "bg-purple-500/40 border-purple-400", inner: true },
    { name: "Strong Password", icon: "🔑", color: "bg-emerald-500/30 border-emerald-400" },
    { name: "Two-Factor Auth (2FA)", icon: "📱", color: "bg-sky-500/30 border-sky-400" },
    { name: "Encryption (HTTPS)", icon: "🔒", color: "bg-accent/30 border-accent" },
    { name: "Firewall", icon: "🧱", color: "bg-amber-500/30 border-amber-400" },
    { name: "Antivirus + Updates", icon: "🛡️", color: "bg-pink-500/30 border-pink-400" },
    { name: "Backups (safety net)", icon: "💾", color: "bg-neutral-500/30 border-neutral-400" },
  ];

  return (
    <VisualFrame>
      <div className="flex w-full items-center gap-4">
        {/* Nested shields */}
        <div className="relative flex h-56 w-56 items-center justify-center">
          {layers.map((l, i) => {
            const size = 220 - i * 22;
            return (
              <motion.div
                key={l.name}
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`absolute flex items-start justify-center rounded-full border-2 ${l.color}`}
                style={{
                  width: size,
                  height: size,
                }}
              >
                {!l.inner && (
                  <div className="-mt-1 rounded-full bg-black/70 px-1.5 py-0.5 backdrop-blur">
                    <div className="flex items-center gap-1 text-[8.5px] text-white">
                      <span>{l.icon}</span>
                      <span className="font-semibold">{l.name}</span>
                    </div>
                  </div>
                )}
                {l.inner && <div className="relative z-10 self-center text-3xl">{l.icon}</div>}
              </motion.div>
            );
          })}
          {/* Attacker */}
          <motion.div
            className="absolute -left-6 -top-6 text-3xl"
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [0, 5, 0, -5, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🥷
          </motion.div>
        </div>

        {/* Layer labels + explanation */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            Layered defense
          </div>
          <div className="text-[10px] text-neutral-300">
            No single wall stops everything. Stack many small walls — an
            attacker has to break every one.
          </div>
          <div className="mt-2 space-y-0.5">
            {layers
              .slice()
              .reverse()
              .map((l) => (
                <div key={l.name} className="flex items-center gap-1.5 rounded bg-white/[0.03] px-1.5 py-0.5">
                  <span className="text-[10px]">{l.icon}</span>
                  <span className="text-[9px] text-neutral-200">{l.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
