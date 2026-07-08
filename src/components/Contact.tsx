import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiCheck } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import AmbientGlow from "./AmbientGlow";
import { profile } from "../data/content";

type FormState = { name: string; email: string; subject: string; message: string };
type Errors = Partial<FormState>;

const initialForm: FormState = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(values: FormState): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "That email doesn't look right.";
    if (!values.subject.trim()) next.subject = "Please add a subject.";
    if (!values.message.trim()) next.message = "Please write a message.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSent(false);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSent(true);
        setForm(initialForm);
        setTimeout(() => setSent(false), 5000);
      } else {
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrorMessage("Network error: Could not connect to the server. Please verify the backend is running.");
    }
  }

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28">
      <AmbientGlow color="var(--color-primary)" size={360} className="-left-16 bottom-0" />
      <SectionHeading eyebrow="$ ./contact --send" title="Get In Touch" />

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <ContactRow icon={<FiMail />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactRow icon={<FiPhone />} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
          <ContactRow icon={<FiGithub />} label="GitHub" value="View profile" href={profile.social.github} />
          <ContactRow icon={<FiLinkedin />} label="LinkedIn" value="View profile" href={profile.social.linkedin} />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass relative rounded-2xl p-8"
        >
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: errors.name ? "#EF4444" : "var(--color-border)", color: "var(--color-text)" }}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: errors.email ? "#EF4444" : "var(--color-border)", color: "var(--color-text)" }}
                placeholder="you@example.com"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Subject" error={errors.subject}>
              <input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: errors.subject ? "#EF4444" : "var(--color-border)", color: "var(--color-text)" }}
                placeholder="What's this about?"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                disabled={loading}
                rows={5}
                className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: errors.message ? "#EF4444" : "var(--color-border)", color: "var(--color-text)" }}
                placeholder="Tell me a bit about what you have in mind..."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white sm:w-auto cursor-pointer disabled:opacity-50"
            style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Send Message"
            )}
          </button>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center gap-2 text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                <FiCheck /> Message sent — I'll get back to you soon.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-xl p-4">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--color-surface-2)", color: "var(--color-secondary)" }}
      >
        {icon}
      </span>
      <span>
        <span className="block text-xs" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
        <span className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
          {value}
        </span>
      </span>
    </a>
  );
}
