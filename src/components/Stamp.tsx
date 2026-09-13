import type { CSSProperties, AnimationEventHandler } from "react";

interface StampProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** width in px */
  width?: number;
  title?: string;
  /** fired when a CSS animation on the stamp ends */
  onAnimationEnd?: AnimationEventHandler;
}

/**
 * A CHU² stamp — an in-game sticker ornament. Slight random-ish tilt, and it
 * wiggles on hover for that early-2000s webcore feel.
 */
export function Stamp({ src, alt, className = "", style, width = 96, title, onAnimationEnd }: StampProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={title ?? alt}
      loading="lazy"
      width={width}
      onAnimationEnd={onAnimationEnd}
      className={`sticker-shadow select-none transition-transform duration-200 ease-in-out hover:animate-wiggle ${className}`}
      style={{ ...style }}
    />
  );
}