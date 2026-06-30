import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import AmbientGlow from "./AmbientGlow";
import { education } from "../data/content";

export default function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-6xl px-6 py-28">
      <AmbientGlow color="var(--color-primary)" size={380} className="-right-24 bottom-0" />

      <SectionHeading eyebrow="$ cat education.log" title="Education" />

      <div className="space-y-16">
        {education.map((edu) => {
          const pct = Math.round((edu.currentSemester / edu.totalSemesters) * 100);
          return (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
                    {edu.period}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
                    {edu.degree}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {edu.institute} · {edu.detail}
                  </p>
                </div>
                <p
                  className="font-display text-3xl font-semibold"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {pct}%
                </p>
              </div>

              {/* semester milestone track */}
              <div className="relative mt-10 pb-2">
                <div
                  className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
                  style={{ background: "var(--color-border)" }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((edu.currentSemester - 1) / (edu.totalSemesters - 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-1/2 h-px -translate-y-1/2"
                  style={{ background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))" }}
                />

                <div className="relative flex justify-between">
                  {Array.from({ length: edu.totalSemesters }, (_, i) => {
                    const sem = i + 1;
                    const done = sem <= edu.currentSemester;
                    const isCurrent = sem === edu.currentSemester;
                    return (
                      <div key={sem} className="flex flex-col items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px]"
                          style={{
                            background: done ? "var(--color-secondary)" : "var(--color-surface)",
                            color: done ? "#06121A" : "var(--color-text-muted)",
                            border: done ? "none" : "1px solid var(--color-border)",
                            boxShadow: isCurrent
                              ? "0 0 0 4px color-mix(in srgb, var(--color-secondary) 25%, transparent)"
                              : "none",
                          }}
                        >
                          {sem}
                        </span>
                        {isCurrent && (
                          <span className="font-mono text-[10px]" style={{ color: "var(--color-secondary)" }}>
                            now
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {edu.coursework.map((course) => (
                  <span
                    key={course}
                    className="rounded-full px-3 py-1 font-mono text-xs"
                    style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
