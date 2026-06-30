import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import SectionHeading from "./SectionHeading";
import AmbientGlow from "./AmbientGlow";
import { stats } from "../data/content";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <AmbientGlow color="var(--color-secondary)" size={340} className="-right-16 top-0" />
      <SectionHeading eyebrow="$ cat about.md" title="About Me" />

      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div
            className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
          />
          <div className="glass relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
           <img
             src="profile1.png"
             alt="Ali Husnain"
             className="h-full w-full object-cover"
           />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-base leading-relaxed sm:text-lg" style={{ color: "var(--color-text-muted)" }}>
            I'm a BS Information Technology student with a strong interest in software
            development, web technologies, and mobile application development. I enjoy
            building real-world solutions, learning modern technologies, and continuously
            improving my programming skills — currently in my 6th semester, working
            toward graduation in 2027.
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: "var(--color-text-muted)" }}>
            Outside of coursework, I work as a Teaching Assistant, helping other students
            debug their code and build confidence with practical programming — which has
            sharpened how clearly I explain and structure my own projects.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <Counter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div>
      <p ref={ref} className="font-display text-3xl font-semibold" style={{ color: "var(--color-secondary)" }}>
        {display}+
      </p>
      <p className="mt-1 text-xs leading-snug" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
