import type { ReactNode } from "react";

interface WinCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  /** controls shown in the top-right corner */
  controls?: ReactNode;
}

/**
 * A candy-pastel Windows-95-style window used as a content card. Hand-rolled
 * beveled look (no react95 runtime) so the aesthetic stays but the bundle
 * stays small. Minimal per the plan — animecore leads, Win95 accents.
 */
export function WinCard({
  title,
  icon,
  children,
  className = "",
  controls,
}: WinCardProps) {
  return (
    <div className={`win-outset rounded-[2px] bg-blush/70 backdrop-blur-sm ${className}`}>
      <div className="win-titlebar font-pixel text-sm tracking-wide">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
        {controls && <span className="ml-auto flex shrink-0 gap-1">{controls}</span>}
      </div>
      <div className="px-4 py-5">{children}</div>
    </div>
  );
}

/** Little Win95 title-bar control button. */
export function Control({ glyph, label }: { glyph: string; label: string }) {
  return (
    <button type="button" className="win-control font-pixel" aria-label={label} title={label}>
      {glyph}
    </button>
  );
}