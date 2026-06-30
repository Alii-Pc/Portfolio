import { motion } from "framer-motion";
import { FiDownload, FiEye } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import { profile } from "../data/content";

export default function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading eyebrow="$ open resume.pdf" title="Resume" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="glass flex flex-col items-center gap-8 rounded-2xl p-10 sm:flex-row"
      >
        <div
          className="flex h-40 w-32 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs"
          style={{
            background: "var(--color-surface-2)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          resume.pdf
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-display text-xl font-semibold" style={{ color: "var(--color-text)" }}>
            Want the full picture in one document?
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Grab a copy of my résumé for a quick, recruiter-friendly summary of my
            education, skills, and experience.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              <FiEye /> View Resume
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
            >
              <FiDownload /> Download PDF
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
