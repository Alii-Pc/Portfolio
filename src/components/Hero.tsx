import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";
import { profile } from "../data/content";

// Three.js + R3F are heavy — split them into their own chunk so the rest of
// the page can paint before the 3D scene finishes loading.
const HeroScene = lazy(() => import("./three/HeroScene"));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* readability gradient over the canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 62% at 28% 52%, color-mix(in srgb, var(--color-bg) 40%, transparent), var(--color-bg) 88%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-6xl px-6"
      >
        <motion.p
          variants={item}
          className="font-mono text-sm"
          style={{ color: "var(--color-secondary)" }}
        >
          $ whoami
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl"
          style={{ color: "var(--color-text)" }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 font-mono text-base sm:text-lg"
          style={{ color: "var(--color-primary-soft)" }}
        >
          {profile.role}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-base sm:text-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href={profile.resumeUrl}
            download
            className="rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
            style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
          >
            Download Resume
          </a>
          <a
            href="#contact"
            className="rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-secondary)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            Contact Me
          </a>
          <a
            href="#projects"
            className="px-2 py-3 text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: "var(--color-secondary)" }}
          >
            View Projects →
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex items-center gap-5">
          <SocialIcon href={profile.social.github} label="GitHub">
            <FiGithub />
          </SocialIcon>
          <SocialIcon href={profile.social.linkedin} label="LinkedIn">
            <FiLinkedin />
          </SocialIcon>
          <SocialIcon href={profile.social.email} label="Email">
            <FiMail />
          </SocialIcon>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ color: "var(--color-text-muted)" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FiArrowDown size={20} />
      </motion.a>
    </section>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full glass text-lg transition-transform hover:scale-110"
      style={{ color: "var(--color-text)" }}
    >
      {children}
    </a>
  );
}
