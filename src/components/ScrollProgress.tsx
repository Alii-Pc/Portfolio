import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))",
      }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]"
    />
  );
}
