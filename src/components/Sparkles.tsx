import type { CSSProperties } from "react";

interface SparklesProps {
  className?: string;
  style?: CSSProperties;
  count?: number;
}

/**
 * A decorative field of twinkling sparkle glyphs — pure CSS animation, no
 * extra deps needed. Absolutely positioned; place inside a relative parent.
 */
export function Sparkles({ className = "", style, count = 12 }: SparklesProps) {
  const glyphs = ["✦", "✧", "♡", "★", "✿", "✦"];
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37 + 13) % 100;
        const top = (i * 53 + 7) % 100;
        const delay = (i % 6) * 0.4;
        const size = 12 + (i % 4) * 6;
        return (
          <span
            key={i}
            className="animate-sparkle absolute select-none text-flamingo/70"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${size}px`,
              animationDelay: `${delay}s`,
            }}
          >
            {glyphs[i % glyphs.length]}
          </span>
        );
      })}
    </div>
  );
}