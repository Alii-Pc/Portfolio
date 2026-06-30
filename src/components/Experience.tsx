import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import AmbientGlow from "./AmbientGlow";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28">
      <AmbientGlow color="var(--color-secondary)" size={360} className="-left-20 top-10" />

      <SectionHeading eyebrow="$ git log --experience" title="Experience" />

      <div className="relative">
        {/* center spine - desktop only */}
        <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 signal-line md:block">
          <span className="pulse-dot" style={{ animationDelay: "0s" }} />
          <span className="pulse-dot" style={{ animationDelay: "1.15s" }} />
          <span className="pulse-dot" style={{ animationDelay: "2.3s" }} />
        </div>

        {/* mobile spine */}
        <div className="absolute left-0 top-0 bottom-0 block w-px signal-line md:hidden" />

        <div className="space-y-14">
          {experience.map((role, i) => {
            const onRight = i % 2 === 1;
            return (
              <motion.div
                key={role.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-8 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
              >
                {/* node on the spine, vertically centered on this row */}
                <span
                  className="absolute left-0 top-1.5 h-3 w-3 -translate-x-[5px] rounded-full md:left-1/2 md:-translate-x-1/2"
                  style={{
                    background: "var(--color-secondary)",
                    boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-secondary) 20%, transparent)",
                  }}
                />

                <div className={`hidden md:block ${!onRight ? "md:pr-12 md:text-right" : ""}`}>
                  {!onRight && <ExperienceCard role={role} align="right" />}
                </div>
                <div className={`hidden md:block ${onRight ? "md:col-start-2 md:pl-12" : ""}`}>
                  {onRight && <ExperienceCard role={role} align="left" />}
                </div>

                {/* mobile: always render once, left-aligned */}
                <div className="md:hidden">
                  <ExperienceCard role={role} align="left" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  role,
  align,
}: {
  role: (typeof experience)[number];
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "md:flex md:flex-col md:items-end" : ""}>
      <p className="font-mono text-xs" style={{ color: "var(--color-secondary)" }}>
        {role.period}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold" style={{ color: "var(--color-text)" }}>
        {role.role}
      </h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {role.org}
      </p>
      <ul className={`mt-4 space-y-2 ${align === "right" ? "md:text-right" : ""}`}>
        {role.points.map((point) => (
          <li
            key={point}
            className={`flex gap-2 text-sm ${align === "right" ? "md:flex-row-reverse" : ""}`}
            style={{ color: "var(--color-text-muted)" }}
          >
            <span style={{ color: "var(--color-primary-soft)" }}>›</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
