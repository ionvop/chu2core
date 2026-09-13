import type { CSSProperties } from "react";

interface StampProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** width in px */
  width?: number;
  title?: string;
}

/**
 * A CHU² stamp — an in-game sticker ornament. Slight random-ish tilt, and it
 * wiggles on hover for that early-2000s webcore feel.
 */
export function Stamp({ src, alt, className = "", style, width = 96, title }: StampProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={title ?? alt}
      loading="lazy"
      width={width}
      className={`sticker-shadow select-none transition-transform duration-200 ease-in-out hover:animate-wiggle ${className}`}
      style={{ ...style }}
    />
  );
}