import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiMoon, FiSun, FiDownload } from "react-icons/fi";
import { navLinks, profile } from "../data/content";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-mono text-lg font-medium" style={{ color: "var(--color-text)" }}>
          <span style={{ color: "var(--color-secondary)" }}>~/</span>
          {profile.name.split(" ")[0].toLowerCase()}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm transition-colors hover:text-[var(--color-secondary)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "var(--color-border)", color: "var(--color-secondary)" }}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
          >
            <FiDownload size={14} /> Resume
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="text-2xl md:hidden"
          style={{ color: "var(--color-text)" }}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-secondary)" }}
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
                  style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
                >
                  <FiDownload size={14} /> Resume
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
