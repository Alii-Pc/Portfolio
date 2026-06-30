import { useState } from "react";
import { FiAward } from "react-icons/fi";
import SectionHeading from "./SectionHeading";
import { certifications } from "../data/content";

export default function Certifications() {
  const [paused, setPaused] = useState(false);
  const track = [...certifications, ...certifications]; // duplicated for a seamless loop

  return (
    <section id="certifications" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="$ ls ./certifications" title="Certifications" />
      </div>

      <div
        className="relative overflow-hidden py-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className={`marquee-track flex w-max gap-8 ${paused ? "paused" : ""}`}>
          {track.map((cert, i) => (
            <HexBadge key={`${cert.title}-${i}`} title={cert.title} issuer={cert.issuer} />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
        hover to pause · {certifications.length} certifications
      </p>
    </section>
  );
}

function HexBadge({ title, issuer }: { title: string; issuer: string }) {
  const hex = "polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%)";
  return (
    <div
      className="flex h-44 w-44 flex-shrink-0 items-center justify-center p-[2px] transition-transform hover:scale-105"
      style={{
        clipPath: hex,
        background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
      }}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 px-5 text-center"
        style={{ clipPath: hex, background: "var(--color-surface)" }}
      >
        <FiAward style={{ color: "var(--color-secondary)" }} size={20} />
        <p className="font-display text-sm font-semibold leading-snug" style={{ color: "var(--color-text)" }}>
          {title}
        </p>
        <p className="font-mono text-[10px]" style={{ color: "var(--color-text-muted)" }}>
          {issuer}
        </p>
      </div>
    </div>
  );
}
