import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
    >
      <span className="font-mono text-sm text-secondary tracking-wide" style={{ color: "var(--color-secondary)" }}>
        {eyebrow}
      </span>
      <h2
        className="mt-3 font-display text-3xl sm:text-4xl font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h2>
      <div
        className={`mt-4 h-px w-16 ${align === "center" ? "mx-auto" : ""}`}
        style={{ background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))" }}
      />
    </motion.div>
  );
}
