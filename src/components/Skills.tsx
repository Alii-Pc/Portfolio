import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skillCategories } from "../data/content";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading eyebrow="$ cat skills.json" title="Skills" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="glass rounded-2xl p-6"
          >
            <p className="font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
              {cat.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold" style={{ color: "var(--color-text)" }}>
              {cat.category}
            </h3>

            <div className="mt-5 space-y-4">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span style={{ color: "var(--color-text)" }}>{skill.name}</span>
                    <span className="font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--color-surface-2)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
