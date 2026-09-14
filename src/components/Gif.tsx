import type { CSSProperties } from "react";

interface GifProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** width in px */
  width?: number;
  title?: string;
}

/**
 * An animated CHU² sticker (webp). Same vibe as `Stamp` but for the moving
 * gifs — slight random-ish tilt, wiggles on hover for that webcore feel.
 */
export function Gif({ src, alt, className = "", style, width = 96, title }: GifProps) {
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