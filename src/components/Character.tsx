import type { CSSProperties } from "react";
import { CHARACTERS } from "@/config/site";

type Variant = "casual" | "live";

interface CharacterProps {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  /** animate float or not */
  float?: boolean;
}

/**
 * A full-body standing CHU² to use as a left/right vertical banner foreground,
 * with a gentle float animation.
 */
export function Character({
  variant = "casual",
  className = "",
  style,
  float = true,
}: CharacterProps) {
  const src = variant === "casual" ? CHARACTERS.casual : CHARACTERS.live;

  return (
    <img
      src={src}
      alt={variant === "casual" ? "CHU² in her casual outfit" : "CHU² ready for the live"}
      loading="lazy"
      className={`${float ? "animate-float" : ""} select-none object-contain ${
        variant === "live" ? "[--float-rot:-2deg]" : "[--float-rot:2deg]"
      } ${className}`}
      style={{ ...style }}
    />
  );
}