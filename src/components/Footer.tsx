import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind & Three.js.
        </p>
        <div className="flex items-center gap-4">
          <a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ color: "var(--color-text-muted)" }}>
            <FiGithub />
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: "var(--color-text-muted)" }}>
            <FiLinkedin />
          </a>
          <a href={profile.social.email} aria-label="Email" style={{ color: "var(--color-text-muted)" }}>
            <FiMail />
          </a>
        </div>
      </div>
    </footer>
  );
}
