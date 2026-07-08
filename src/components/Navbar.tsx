import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiMoon, FiSun, FiDownload, FiLogOut, FiLogIn } from "react-icons/fi";
import { navLinks, profile } from "../data/content";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, setView } = useAuth();

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

        {/* Desktop Links */}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer"
            style={{ borderColor: "var(--color-border)", color: "var(--color-secondary)" }}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm" style={{ color: "var(--color-text)" }}>
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-mono font-medium transition-colors hover:bg-white/5 cursor-pointer"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                <FiLogOut size={12} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("login")}
                className="font-mono text-xs font-medium transition-colors hover:text-[var(--color-secondary)] cursor-pointer"
                style={{ color: "var(--color-text-muted)" }}
              >
                Login
              </button>
              <button
                onClick={() => setView("signup")}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
                style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
              >
                Sign Up
              </button>
            </div>
          )}

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
          className="text-2xl md:hidden cursor-pointer"
          style={{ color: "var(--color-text)" }}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
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
              
              <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm" style={{ color: "var(--color-text)" }}>
                      Logged in as: <strong>{user.name}</strong>
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-mono font-medium cursor-pointer"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                    >
                      <FiLogOut size={12} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setView("login");
                        setOpen(false);
                      }}
                      className="flex items-center gap-1.5 font-mono text-sm cursor-pointer"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <FiLogIn size={14} /> Login
                    </button>
                    <button
                      onClick={() => {
                        setView("signup");
                        setOpen(false);
                      }}
                      className="rounded-full px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
                      style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-full border cursor-pointer"
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
