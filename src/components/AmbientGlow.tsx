export default function AmbientGlow({
  color = "var(--color-primary)",
  size = 420,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`ambient-glow ${className}`}
      style={{ width: size, height: size, background: color }}
    />
  );
}
