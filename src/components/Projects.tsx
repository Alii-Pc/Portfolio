import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import { projects, type Project } from "../data/content";

const FILTERS = ["All", "Web", "Mobile", "Desktop"] as const;

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading eyebrow="$ ls ./projects" title="Projects" />

      <div className="mb-10 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-4 py-1.5 font-mono text-sm transition-colors"
            style={{
              background: filter === f ? "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" : "var(--color-surface)",
              color: filter === f ? "white" : "var(--color-text-muted)",
              border: filter === f ? "none" : "1px solid var(--color-border)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.button
              key={project.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              whileHover={{ y: -6 }}
              onClick={() => setActive(project)}
              className="glass group rounded-2xl p-6 text-left"
            >
              <div
                className="mb-5 flex h-36 w-full items-center justify-center rounded-xl font-display text-3xl font-semibold"
                style={{
                  background:
                    project.accent === "primary"
                      ? "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 35%, transparent), transparent)"
                      : "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 35%, transparent), transparent)",
                  color: "var(--color-text)",
                }}
              >
                {project.title
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>

              <p className="font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
                {project.category}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2.5 py-0.5 font-mono text-[11px]"
                    style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="font-mono text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-6"
      style={{ background: "color-mix(in srgb, var(--color-bg) 70%, transparent)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-lg rounded-2xl p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiX size={20} />
        </button>

        <p className="font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
          {project.category}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full px-3 py-1 font-mono text-xs"
              style={{ background: "var(--color-surface-2)", color: "var(--color-text)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            <FiGithub /> GitHub
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
            >
              <FiExternalLink /> Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
