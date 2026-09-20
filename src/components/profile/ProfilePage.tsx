"use client";

// A friendly, teacher-focused profile page.
// Designed to be shown to students at the start of the course as an introduction.

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Coffee,
  Cpu,
  GraduationCap,
  Globe,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

// lucide-react at this version doesn't ship a LinkedIn glyph, so use the
// official brand mark inline. Simple, and no extra dependency surface.
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0z" />
    </svg>
  );
}

const LINKEDIN_URL = "https://www.linkedin.com/in/kanel-soeng/";
const EMAIL = "soengkanel@gmail.com";

const TEACHES = [
  { emoji: "⚙️", label: "Hardware", icon: Cpu },
  { emoji: "🪄", label: "Software", icon: Sparkles },
  { emoji: "🌐", label: "Networking", icon: Network },
  { emoji: "🌍", label: "Web", icon: Globe },
  { emoji: "🛡️", label: "Cybersecurity", icon: ShieldCheck },
  { emoji: "🤖", label: "AI", icon: BrainCircuit },
];

const VALUES = [
  {
    emoji: "👀",
    title: "Learn by seeing",
    text: "Big pictures, small words. If you can picture it, you understand it.",
  },
  {
    emoji: "🙋",
    title: "No silly questions",
    text: "The question you're afraid to ask is usually the one everyone else has too.",
  },
  {
    emoji: "🛠️",
    title: "Build things",
    text: "You learn IT by touching keyboards, not by memorising slides.",
  },
  {
    emoji: "🤝",
    title: "Learn together",
    text: "We move at the pace of the class — nobody gets left behind.",
  },
];

const FUN_FACTS = [
  { emoji: "☕", text: "Runs on coffee and curiosity" },
  { emoji: "🧩", text: "Loves taking things apart to see how they work" },
  { emoji: "🎓", text: "Believes anyone can learn tech — really, anyone" },
  { emoji: "🇰🇭", text: "Proud to teach the next generation of Cambodian tech talent" },
];

export function ProfilePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient background wash — matches the lecture page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% 10%, rgba(77, 141, 255, 0.14), transparent 60%)," +
            "radial-gradient(900px 600px at 85% 60%, rgba(125, 211, 252, 0.10), transparent 60%)," +
            "radial-gradient(700px 500px at 50% 100%, rgba(77, 141, 255, 0.08), transparent 60%)",
        }}
      />

      <TopBar />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-24 sm:px-8">
        <Hero />
        <About />
        <Teaches />
        <Values />
        <FunFacts />
        <NoteToStudents />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0a0d14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-neutral-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
        <Link
          href="/lecture"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-all hover:border-accent/50 hover:bg-white/10"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Go to lecture
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-md sm:p-10"
    >
      {/* Sparkle accents */}
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-accent via-sky-300 to-accent-bright opacity-70 blur-md" />
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white/15 bg-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:h-40 sm:w-40">
            {/* Placeholder avatar — swap /public/profile.jpg to use a real photo */}
            <Image
              src="/idic-logo.jpg"
              alt="Kanel Soeng"
              width={200}
              height={200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          {/* Small "hi" badge */}
          <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a0d14] bg-accent text-lg shadow-lg">
            👋
          </div>
        </motion.div>

        {/* Intro copy */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent-bright">
            <GraduationCap className="h-3.5 w-3.5" />
            IDIC · Instructor
          </div>

          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Hi class, I&rsquo;m <br className="hidden sm:block" />
            <span className="hero-gradient">Kanel Soeng.</span>
          </h1>

          <p className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-neutral-300 sm:text-base">
            I&rsquo;ll be your guide through the world of Information Technology — from
            the parts you can touch, all the way to the machines that learn. I&rsquo;m
            genuinely excited to teach you.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-neutral-400 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <MapPin className="h-3.5 w-3.5 text-accent-bright" />
              Phnom Penh, Cambodia
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <BookOpen className="h-3.5 w-3.5 text-accent-bright" />
              Introduction to IT
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <Users className="h-3.5 w-3.5 text-accent-bright" />
              IDIC students
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-accent/50 hover:bg-white/10"
            >
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-accent px-4 py-2 text-[13px] font-medium text-white shadow-[0_6px_20px_rgba(77,141,255,0.35)] transition-all hover:scale-[1.02] hover:bg-accent-bright"
            >
              <Mail className="h-4 w-4" />
              Say hi
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Section({
  title,
  eyebrow,
  icon: Icon,
  children,
}: {
  title: string;
  eyebrow?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 sm:mt-16"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-accent-bright">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          {eyebrow && (
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-neutral-500">
              {eyebrow}
            </div>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function About() {
  return (
    <Section eyebrow="A little about me" title="Who I am" icon={Heart}>
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 leading-relaxed text-neutral-300 sm:p-8">
        <p className="text-[15px]">
          I&rsquo;m a teacher, a lifelong tinkerer, and honestly still a student myself —
          technology moves fast and I love learning right alongside my classes.
          What started as curiosity about how computers actually work turned into
          a career of helping other people fall in love with the same questions.
        </p>
        <p className="mt-4 text-[15px]">
          At <span className="text-white">IDIC</span>, I teach{" "}
          <span className="text-white">Introduction to Information Technology</span> — a
          course designed for students who&rsquo;ve never opened a computer case
          before, and finish the semester talking confidently about CPUs,
          networks, and AI. My goal for every class: you leave less afraid of
          technology, and a little more excited by it.
        </p>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Teaches() {
  return (
    <Section eyebrow="What we'll cover together" title="What I teach" icon={BookOpen}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {TEACHES.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
                {t.emoji}
              </div>
              <div className="text-[15px] font-semibold text-white">{t.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Link
          href="/lecture"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white transition-all hover:border-accent/50 hover:bg-white/10"
        >
          Peek at the full outline
          <Send className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Values() {
  return (
    <Section eyebrow="How my class works" title="How I teach" icon={Lightbulb}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl leading-none">{v.emoji}</div>
              <div>
                <div className="text-[15px] font-semibold text-white">{v.title}</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-400">
                  {v.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function FunFacts() {
  return (
    <Section eyebrow="Off the clock" title="A few fun things" icon={Coffee}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FUN_FACTS.map((f, i) => (
          <motion.div
            key={f.text}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <span className="text-2xl">{f.emoji}</span>
            <span className="text-[13.5px] text-neutral-300">{f.text}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function NoteToStudents() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="mt-14 rounded-3xl border border-accent/30 bg-accent-soft p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent-bright">
        <MessageCircle className="h-4 w-4" />
        A little note to my class
      </div>
      <blockquote className="mt-4 text-balance text-lg italic leading-relaxed text-white sm:text-xl">
        &ldquo;You don&rsquo;t need to be a genius to understand computers. You just need
        someone to explain them clearly, patiently, and with pictures. That&rsquo;s my
        job — and I take it seriously. See you in class.&rdquo;
      </blockquote>
      <div className="mt-4 text-[13px] text-neutral-300">
        — Kanel
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Contact() {
  return (
    <Section eyebrow="Say hello" title="Get in touch" icon={Send}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.06]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0A66C2]/20 text-[#6ea6f0]">
            <LinkedinIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-white">LinkedIn</div>
            <div className="truncate text-[12.5px] text-neutral-400">
              linkedin.com/in/kanel-soeng
            </div>
          </div>
        </a>

        <a
          href={`mailto:${EMAIL}`}
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.06]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-accent-soft text-accent-bright">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-white">Email</div>
            <div className="truncate text-[12.5px] text-neutral-400">{EMAIL}</div>
          </div>
        </a>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-6 text-center text-[12.5px] text-neutral-500">
      Made with <span className="text-accent-bright">♥</span> for IDIC students —
      learn by seeing, not just reading.
    </footer>
  );
}
