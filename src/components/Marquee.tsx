import type { CSSProperties } from "react";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** litreally the speed/direction of the ticker flip */
  reverse?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
}

/**
 * A <marquee>-style looping ticker. Renders the list twice and slides it by
 * 50% so the loop is seamless. Respects prefers-reduced-motion via CSS.
 */
export function Marquee({
  children,
  className = "",
  reverse = false,
  style,
  ariaLabel,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none ${className}`}
      style={style}
      role="marquee"
      aria-label={ariaLabel}
    >
      <div
        className={`inline-flex items-center gap-8 pr-8 animate-marquee ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}