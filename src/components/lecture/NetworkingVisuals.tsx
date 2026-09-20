"use client";

// Realistic, richly-detailed illustrations for the Networking chapter.
// Each visual mimics real network hardware or software so students recognise
// what they see every day.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ═════════════════════════════════════════════════════════════════
 * 1 — Networks: four scale panels (PAN → LAN → MAN → WAN)
 * ═════════════════════════════════════════════════════════════ */

export function NetworksRealisticVisual() {
  const scales = [
    {
      key: "PAN",
      name: "PAN",
      long: "Personal",
      radius: "around you",
      color: "border-amber-400/60 bg-amber-400/10",
      textColor: "text-amber-200",
      content: (
        <div className="flex items-center justify-center gap-1">
          <div className="text-xl">📱</div>
          <div className="text-[9px]">↔</div>
          <div className="text-lg">⌚</div>
          <div className="text-[9px]">↔</div>
          <div className="text-lg">🎧</div>
        </div>
      ),
    },
    {
      key: "LAN",
      name: "LAN",
      long: "Local",
      radius: "one building",
      color: "border-emerald-400/60 bg-emerald-400/10",
      textColor: "text-emerald-200",
      content: (
        <div className="grid grid-cols-3 gap-0.5 text-lg">
          <div className="text-center">💻</div>
          <div className="flex items-center justify-center text-sm">📡</div>
          <div className="text-center">💻</div>
          <div className="text-center">📱</div>
          <div className="text-center">🖥️</div>
          <div className="text-center">🖨️</div>
        </div>
      ),
    },
    {
      key: "MAN",
      name: "MAN",
      long: "Metropolitan",
      radius: "one city",
      color: "border-accent/60 bg-accent/10",
      textColor: "text-sky-200",
      content: (
        <div className="flex items-end justify-center gap-1.5 text-lg">
          <div className="flex flex-col items-center">
            <span>🏢</span>
            <span className="text-[7px]">office</span>
          </div>
          <div className="flex flex-col items-center">
            <span>🏫</span>
            <span className="text-[7px]">school</span>
          </div>
          <div className="flex flex-col items-center">
            <span>🏥</span>
            <span className="text-[7px]">hospital</span>
          </div>
        </div>
      ),
    },
    {
      key: "WAN",
      name: "WAN",
      long: "Wide",
      radius: "the world",
      color: "border-purple-400/60 bg-purple-400/10",
      textColor: "text-purple-200",
      content: (
        <div className="flex items-center justify-center gap-1">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🌍
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <VisualFrame>
      <div className="grid h-full w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {scales.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`flex flex-col rounded-xl border-2 p-2 ${s.color}`}
          >
            <div className="mb-1 flex items-baseline justify-between">
              <div className={`text-lg font-black ${s.textColor}`}>{s.name}</div>
              <div className="text-[8px] text-neutral-400">{s.long}</div>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-md border border-white/10 bg-black/30 p-2">
              {s.content}
            </div>
            <div className="mt-1.5 text-center text-[9.5px] text-neutral-300">
              {s.radius}
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 2 — IP & MAC: a real network settings dialog + three locations
 * ═════════════════════════════════════════════════════════════ */

export function IpMacRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-4">
        {/* Fake laptop settings panel */}
        <div className="w-[280px] overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-neutral-800 px-2.5 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <div className="ml-2 text-[10px] font-semibold text-neutral-300">
              ⚙️ Network Settings
            </div>
          </div>
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="text-2xl">📶</div>
              <div>
                <div className="text-[11px] font-semibold text-white">
                  Wi-Fi · IDIC-Guest
                </div>
                <div className="text-[9px] text-emerald-400">Connected</div>
              </div>
            </div>

            {/* IP address row */}
            <div className="mb-2 rounded-lg border border-accent/40 bg-accent/10 p-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[9px] uppercase tracking-widest text-accent-bright">
                  IP address
                </div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[8px] text-accent-bright/70"
                >
                  can change
                </motion.div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0, 1, 0, 1] }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
                className="mt-1 font-mono text-sm font-bold text-white"
              >
                192.168.1.10
              </motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0, 0, 0] }}
                transition={{ duration: 6, repeat: Infinity, times: [0.25, 0.35, 0.5, 0.75, 1] }}
                className="-mt-4 font-mono text-sm font-bold text-white"
              >
                10.5.4.22
              </motion.div>
              <motion.div
                animate={{ opacity: [0, 0, 0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.6, 0.85, 1] }}
                className="-mt-4 font-mono text-sm font-bold text-white"
              >
                203.19.8.44
              </motion.div>
            </div>

            {/* MAC row */}
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-300">
                  MAC address
                </div>
                <div className="rounded-full bg-emerald-500/30 px-1.5 py-0.5 text-[8px] text-emerald-200">
                  🔒 permanent
                </div>
              </div>
              <div className="mt-1 font-mono text-[13px] font-bold text-white">
                A4:C3:F0:12:9B:5E
              </div>
            </div>
          </div>
        </div>

        {/* Three locations */}
        <div className="flex flex-col gap-2">
          {[
            { icon: "🏠", name: "Home", ip: "192.168.1.10", i: 0 },
            { icon: "🏫", name: "School", ip: "10.5.4.22", i: 1 },
            { icon: "☕", name: "Café", ip: "203.19.8.44", i: 2 },
          ].map((loc) => (
            <motion.div
              key={loc.name}
              animate={{
                opacity: [0.4, 0.4, 0.4, 0.4],
                scale: [1, 1, 1, 1],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2"
            >
              <div className="text-2xl">{loc.icon}</div>
              <div>
                <div className="text-[11px] font-semibold text-white">{loc.name}</div>
                <div className="font-mono text-[9px] text-neutral-400">{loc.ip}</div>
              </div>
              <motion.div
                animate={{
                  opacity: [0, 0, 0, 0, 0],
                  scale: [1, 1, 1, 1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times:
                    loc.i === 0
                      ? [0, 0.05, 0.2, 0.25, 1]
                      : loc.i === 1
                        ? [0, 0.3, 0.4, 0.5, 1]
                        : [0, 0.55, 0.65, 0.75, 1],
                }}
                className="absolute inset-0 rounded-lg border-2 border-accent-bright bg-accent/20"
                style={{ boxShadow: "0 0 20px rgba(77,141,255,0.5)" }}
              />
            </motion.div>
          ))}
          <div className="rounded-md bg-black/40 px-2 py-1 text-center text-[9px] text-neutral-400">
            IP changes 🔄 · MAC stays the same
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 3 — Switch & Router: real-looking network hardware
 * ═════════════════════════════════════════════════════════════ */

export function SwitchRouterRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-stretch gap-3">
        {/* SWITCH */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-300">
              Switch
            </div>
            <div className="text-[9px] text-neutral-400">connects local devices</div>
          </div>

          {/* Devices connected to switch */}
          <div className="flex justify-around">
            {["💻", "📱", "🖥️", "🖨️"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="text-lg">{d}</div>
                <div className="h-4 w-px bg-emerald-400/60" />
              </div>
            ))}
          </div>

          {/* Rackmount switch */}
          <div className="relative rounded-lg border-2 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-lg">
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-1">
                <div className="text-[10px]">🟢</div>
                <div className="font-mono text-[8px] text-emerald-400">PWR</div>
              </div>
              <div className="text-[8px] font-mono text-neutral-500">IDIC-SW-24</div>
            </div>
            {/* Ethernet ports with blinking activity LEDs */}
            <div className="flex justify-around border-t border-neutral-700 bg-neutral-900 px-1 py-1.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <motion.div
                    className="h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.6, delay: (i * 0.08) % 0.6, repeat: Infinity }}
                    style={{ filter: "drop-shadow(0 0 3px rgba(52,211,153,0.9))" }}
                  />
                  <div className="h-2.5 w-3 rounded-sm border border-neutral-700 bg-black" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-black/40 px-2 py-1 text-center text-[9.5px] text-emerald-200">
            same network · fast switching
          </div>
        </div>

        {/* ROUTER */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-sky-300">
              Router
            </div>
            <div className="text-[9px] text-neutral-400">connects to the internet</div>
          </div>

          {/* Router with antennas */}
          <div className="flex flex-col items-center">
            {/* Antennas */}
            <div className="flex gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  className="h-6 w-1 rounded-full bg-neutral-700"
                />
              ))}
            </div>

            {/* Router body */}
            <div className="relative w-full rounded-lg border-2 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-lg">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex flex-col gap-1">
                  {[
                    { l: "PWR", c: "text-emerald-400" },
                    { l: "WAN", c: "text-sky-400" },
                    { l: "WiFi", c: "text-amber-400" },
                  ].map((led, i) => (
                    <div key={led.l} className="flex items-center gap-1.5">
                      <motion.div
                        className={`h-1.5 w-1.5 rounded-full ${led.c.replace("text-", "bg-")}`}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
                      />
                      <span className={`font-mono text-[8.5px] ${led.c}`}>{led.l}</span>
                    </div>
                  ))}
                </div>
                <div className="text-3xl">📡</div>
                <div className="text-right">
                  <div className="font-mono text-[8px] text-neutral-500">IDIC-RT</div>
                  <div className="font-mono text-[7px] text-neutral-600">Wi-Fi 6</div>
                </div>
              </div>
            </div>

            {/* Wi-Fi waves + internet */}
            <div className="relative mt-2 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute h-8 w-8 rounded-full border-2 border-sky-400"
              />
              <span className="text-2xl">🌐</span>
            </div>
          </div>

          <div className="rounded-md bg-black/40 px-2 py-1 text-center text-[9.5px] text-sky-200">
            different networks · smart routing
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 4 — Ports & Protocols: server rack with numbered ports + services
 * ═════════════════════════════════════════════════════════════ */

export function PortsRealisticVisual() {
  const ports = [
    { n: 80, name: "HTTP", desc: "websites", icon: "🌐", color: "bg-sky-500/80" },
    { n: 443, name: "HTTPS", desc: "secure web", icon: "🔒", color: "bg-emerald-500/80" },
    { n: 22, name: "SSH", desc: "remote", icon: "🔧", color: "bg-purple-500/80" },
    { n: 25, name: "SMTP", desc: "email", icon: "✉️", color: "bg-amber-500/80" },
    { n: 53, name: "DNS", desc: "names", icon: "📖", color: "bg-pink-500/80" },
  ];

  return (
    <VisualFrame>
      <div className="flex items-center gap-4">
        {/* Server tower */}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            Server
          </div>
          <div className="relative w-40 overflow-hidden rounded-lg border-2 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-2xl">
            {/* Server header */}
            <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-2 py-1">
              <div className="flex items-center gap-1">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-mono text-[8px] text-emerald-400">ONLINE</span>
              </div>
              <span className="font-mono text-[8px] text-neutral-500">idic-srv-01</span>
            </div>

            {/* Ports as numbered doors */}
            <div className="divide-y divide-neutral-700">
              {ports.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 px-2 py-1.5"
                >
                  <div className={`flex h-6 w-8 items-center justify-center rounded ${p.color} font-mono text-[9px] font-black text-white`}>
                    :{p.n}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-white">{p.name}</div>
                    <div className="text-[8px] text-neutral-400">{p.desc}</div>
                  </div>
                  <div className="text-sm">{p.icon}</div>
                </motion.div>
              ))}
            </div>

            {/* Rack ventilation */}
            <div className="border-t border-neutral-700 bg-neutral-900 py-1">
              <div className="mx-auto grid h-1 w-14 grid-cols-14 gap-px opacity-30">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="bg-neutral-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Incoming packets */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            Requests
          </div>
          {ports.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.n}
              animate={{ x: [30, 0, 0, 0], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.9,
                repeat: Infinity,
                times: [0, 0.25, 0.7, 1],
              }}
              className="flex items-center gap-2"
            >
              <div className="flex h-6 items-center gap-1 rounded border border-white/10 bg-white/[0.05] px-1.5 font-mono text-[9px]">
                <span className="text-neutral-400">to</span>
                <span className={`font-bold ${
                  p.color === "bg-sky-500/80" ? "text-sky-300" :
                  p.color === "bg-emerald-500/80" ? "text-emerald-300" :
                  "text-purple-300"
                }`}>
                  :{p.n}
                </span>
              </div>
              <motion.div
                className="text-lg"
                animate={{ x: [0, -20] }}
                transition={{ duration: 3, delay: i * 0.9, repeat: Infinity, times: [0, 0.35] }}
              >
                ➡
              </motion.div>
            </motion.div>
          ))}
          <div className="mt-1 max-w-[120px] rounded-md bg-black/40 px-2 py-1 text-[9px] text-neutral-300">
            each door opens a different service
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 5 — Ping & Tracert: real terminal windows
 * ═════════════════════════════════════════════════════════════ */

export function PingTracertRealisticVisual() {
  const pingLines = [
    "$ ping google.com",
    "PING google.com (142.250.72.14): 56 bytes",
    "64 bytes from 142.250.72.14: time=12.4 ms",
    "64 bytes from 142.250.72.14: time=11.9 ms",
    "64 bytes from 142.250.72.14: time=13.1 ms",
    "64 bytes from 142.250.72.14: time=12.0 ms",
    "--- google.com ping statistics ---",
    "4 packets · 0% loss · avg 12.4 ms ✓",
  ];
  const tracertLines = [
    "$ tracert google.com",
    " 1  home-router   1.2 ms",
    " 2  isp-gateway   3.4 ms",
    " 3  core-router  11.7 ms",
    " 4  peering-01   12.1 ms",
    " 5  goog-edge    12.3 ms",
    " 6  142.250.72.14 12.4 ms ✓",
    "trace complete · 6 hops",
  ];

  return (
    <VisualFrame>
      <div className="flex w-full gap-3">
        {/* PING terminal */}
        <div className="flex-1 overflow-hidden rounded-lg border border-neutral-700 bg-black shadow-2xl">
          <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-900 px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="ml-2 font-mono text-[9px] text-neutral-500">
              ping · terminal
            </div>
          </div>
          <div className="p-2 font-mono text-[9px] leading-relaxed">
            {pingLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.4, duration: 0.05 }}
                className={
                  i === 0
                    ? "text-white"
                    : i === pingLines.length - 1
                      ? "text-emerald-400"
                      : "text-neutral-300"
                }
              >
                {line}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block h-3 w-1.5 bg-emerald-400"
            />
          </div>
        </div>

        {/* TRACERT terminal */}
        <div className="flex-1 overflow-hidden rounded-lg border border-neutral-700 bg-black shadow-2xl">
          <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-900 px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="ml-2 font-mono text-[9px] text-neutral-500">
              tracert · terminal
            </div>
          </div>
          <div className="p-2 font-mono text-[9px] leading-relaxed">
            {tracertLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4, duration: 0.05 }}
                className={
                  i === 0
                    ? "text-white"
                    : i === tracertLines.length - 1
                      ? "text-sky-400"
                      : "text-neutral-300"
                }
              >
                {line}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block h-3 w-1.5 bg-sky-400"
            />
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 6 — VPN: with vs without comparison
 * ═════════════════════════════════════════════════════════════ */

export function VpnRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col gap-3">
        {/* Without VPN */}
        <div className="rounded-xl border-2 border-rose-400/40 bg-rose-500/5 p-2.5">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="rounded-full bg-rose-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-200">
              WITHOUT VPN
            </div>
            <div className="text-[9px] text-rose-300/80">
              a spy can see everything
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">💻</div>
            <div className="relative flex flex-1 items-center">
              <div className="h-2 flex-1 rounded-full bg-rose-500/30" />
              {["email", "password", "photos"].map((data, i) => (
                <motion.div
                  key={data}
                  className="absolute font-mono text-[8.5px] font-bold text-rose-100"
                  animate={{ x: [0, 240], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 3,
                    delay: i * 0.9,
                    repeat: Infinity,
                    times: [0, 0.1, 0.7, 1],
                  }}
                >
                  📄 {data}
                </motion.div>
              ))}
              <motion.div
                className="absolute top-3 text-lg"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ left: "40%" }}
              >
                👀
              </motion.div>
            </div>
            <div className="text-2xl">🌐</div>
          </div>
        </div>

        {/* With VPN */}
        <div className="rounded-xl border-2 border-emerald-400/50 bg-emerald-500/5 p-2.5">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-200">
              WITH VPN 🔒
            </div>
            <div className="text-[9px] text-emerald-300/80">
              everything is encrypted
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">💻</div>
            {/* Tunnel */}
            <div className="relative flex flex-1 items-center">
              <div className="h-4 flex-1 overflow-hidden rounded-full border border-emerald-400/60 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20" />
              {["#x9k", "#p2m", "#a7f"].map((data, i) => (
                <motion.div
                  key={data}
                  className="absolute font-mono text-[8.5px] font-bold text-emerald-100"
                  animate={{ x: [0, 240], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 3,
                    delay: i * 0.9,
                    repeat: Infinity,
                    times: [0, 0.1, 0.7, 1],
                  }}
                >
                  🔒 {data}
                </motion.div>
              ))}
              <motion.div
                className="absolute top-4 text-lg opacity-40"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ left: "40%" }}
              >
                👀
              </motion.div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-1.5 py-0.5 font-mono text-[8px] text-white">
                encrypted tunnel
              </div>
            </div>
            <div className="text-2xl">🌐</div>
          </div>
          <div className="mt-1 text-center text-[9px] text-emerald-300/70">
            same internet — but nobody can read what&rsquo;s inside
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 7 — Bandwidth: real speed-test dashboard
 * ═════════════════════════════════════════════════════════════ */

export function BandwidthRealisticVisual() {
  return (
    <VisualFrame>
      <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-neutral-700 bg-neutral-800 px-3 py-2">
          <div className="text-lg">📶</div>
          <div>
            <div className="text-[11px] font-bold text-white">Speed Test</div>
            <div className="text-[9px] text-neutral-400">idic-speed.test · Wi-Fi</div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="ml-auto flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            testing…
          </motion.div>
        </div>

        <div className="p-4">
          {/* Big gauge */}
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  strokeDasharray="197 100"
                  strokeDashoffset="0"
                  transform="rotate(135 50 50)"
                />
                {/* Progress */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#speedGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="197 400"
                  animate={{ strokeDashoffset: [197, 30, 60, 30, 197] }}
                  transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.6, 0.8, 1] }}
                  transform="rotate(135 50 50)"
                />
                <defs>
                  <linearGradient id="speedGrad">
                    <stop offset="0" stopColor="#34d399" />
                    <stop offset="0.5" stopColor="#7dd3fc" />
                    <stop offset="1" stopColor="#4d8dff" />
                  </linearGradient>
                </defs>
                {/* Ticks */}
                {[0, 25, 50, 75, 100].map((v, i) => {
                  const angle = 135 + (i / 4) * 270;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 50 + Math.cos(rad) * 36;
                  const y1 = 50 + Math.sin(rad) * 36;
                  const x2 = 50 + Math.cos(rad) * 30;
                  const y2 = 50 + Math.sin(rad) * 30;
                  return (
                    <g key={v}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                      <text
                        x={50 + Math.cos(rad) * 24}
                        y={50 + Math.sin(rad) * 24 + 1.5}
                        textAnchor="middle"
                        fontSize="4.5"
                        fill="rgba(255,255,255,0.5)"
                        fontFamily="ui-monospace, monospace"
                      >
                        {v}
                      </text>
                    </g>
                  );
                })}
              </svg>
              {/* Center readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ opacity: [0, 1, 1, 1, 0.8] }}
                  transition={{ duration: 5, times: [0, 0.2, 0.4, 0.8, 1], repeat: Infinity }}
                  className="font-mono text-2xl font-black text-white"
                >
                  <motion.span
                    animate={{ opacity: [1] }}
                  >
                    87.4
                  </motion.span>
                </motion.div>
                <div className="font-mono text-[9px] text-neutral-400">Mbps</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-1 flex-col gap-2">
              {[
                { icon: "⬇️", label: "Download", value: "87.4 Mbps", color: "text-emerald-300" },
                { icon: "⬆️", label: "Upload", value: "42.1 Mbps", color: "text-sky-300" },
                { icon: "📡", label: "Ping", value: "12 ms", color: "text-amber-300" },
                { icon: "📊", label: "Jitter", value: "2 ms", color: "text-neutral-300" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1">
                  <div className="text-sm">{s.icon}</div>
                  <div className="text-[10px] text-neutral-400">{s.label}</div>
                  <div className={`ml-auto font-mono text-[11px] font-bold ${s.color}`}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-md bg-black/40 p-2 text-center text-[10px] text-neutral-400">
            bigger pipe · more data at once
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 * 8 — Cloud Computing: datacenters + connected users
 * ═════════════════════════════════════════════════════════════ */

export function CloudRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center gap-3">
        {/* Users on left */}
        <div className="flex flex-col gap-1.5">
          {[
            { icon: "💻", label: "You" },
            { icon: "📱", label: "Friend" },
            { icon: "🖥️", label: "Office" },
            { icon: "📺", label: "TV" },
          ].map((u) => (
            <div key={u.label} className="flex items-center gap-1.5 rounded bg-white/[0.03] px-1.5 py-0.5">
              <span className="text-base">{u.icon}</span>
              <span className="text-[9px] text-neutral-300">{u.label}</span>
            </div>
          ))}
        </div>

        {/* Animated connection lines */}
        <div className="relative h-32 w-16">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 w-full origin-left"
              style={{
                top: 8 + i * 26,
                background:
                  "linear-gradient(90deg, transparent, rgba(77,141,255,0.7), transparent)",
              }}
              animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Cloud with datacenters */}
        <div className="relative flex-1">
          {/* Cloud shape */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative rounded-[80px] border-2 border-accent/40 bg-gradient-to-b from-accent/15 to-sky-500/5 p-4 shadow-[0_0_50px_rgba(77,141,255,0.25)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-2xl">☁️</div>
              <div className="font-mono text-[9px] text-accent-bright">CLOUD</div>
            </div>

            {/* Server racks inside the cloud */}
            <div className="grid grid-cols-3 gap-1.5">
              {["us-east", "eu-west", "ap-south"].map((region, i) => (
                <div
                  key={region}
                  className="overflow-hidden rounded border border-white/10 bg-black/40 shadow-inner"
                >
                  <div className="border-b border-white/10 bg-white/[0.03] px-1 py-0.5">
                    <div className="font-mono text-[7px] text-accent-bright">{region}</div>
                  </div>
                  <div className="p-1">
                    {[0, 1, 2, 3].map((rack) => (
                      <motion.div
                        key={rack}
                        className="mt-0.5 flex h-1.5 items-center justify-between rounded-sm bg-neutral-800 px-0.5"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 0.8,
                          delay: (rack * 0.1 + i * 0.15) % 0.8,
                          repeat: Infinity,
                        }}
                      >
                        <div className="h-0.5 w-0.5 rounded-full bg-emerald-400" />
                        <div className="h-0.5 w-2 rounded-sm bg-white/20" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Services around the cloud */}
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {[
                { icon: "📧", name: "Gmail" },
                { icon: "📁", name: "Drive" },
                { icon: "🎬", name: "Netflix" },
                { icon: "🤖", name: "AI" },
              ].map((s, i) => (
                <motion.div
                  key={s.name}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                  className="flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-1.5 py-0.5 backdrop-blur"
                >
                  <span className="text-[10px]">{s.icon}</span>
                  <span className="text-[8.5px] text-white">{s.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </VisualFrame>
  );
}
