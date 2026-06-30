import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "loading assets...",
  "compiling components...",
  "initializing scene...",
  "ready.",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 18 + 6, 100);
        if (next >= 100) clearInterval(interval);
        return next;
      });
    }, 140);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const step = Math.floor((progress / 100) * BOOT_LINES.length);
    setLineIndex(Math.min(step, BOOT_LINES.length - 1));
    if (progress >= 100) {
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "var(--color-bg)" }}
        >
          <div className="w-64 font-mono text-sm" style={{ color: "var(--color-text-muted)" }}>
            <p style={{ color: "var(--color-secondary)" }}>
              $ ./portfolio --boot
              <span className="animate-blink">_</span>
            </p>
            <p className="mt-2 h-4">{BOOT_LINES[lineIndex]}</p>
            <div
              className="mt-3 h-1 w-full overflow-hidden rounded-full"
              style={{ background: "var(--color-surface-2)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
            <p className="mt-2 text-right">{Math.floor(progress)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
