import { Gif } from "./Gif";
import { GIFS } from "@/config/site";

interface GifsProps {
  /** how many to show */
  count?: number;
  className?: string;
  width?: number;
  /** start index into GIFS so different sections show different stickers */
  offset?: number;
}

/**
 * A little row of animated CHU² stickers plastered around the page.
 *
 * These are `draggable` — grab one and fling it around the page for that
 * early-2000s "stickers everywhere" webcore feel. Positions are session-only
 * and reset on reload.
 */
export function Gifs({
  count = 5,
  className = "",
  width = 88,
  offset = 0,
}: GifsProps) {
  const picked = Array.from({ length: count }, (_, i) => GIFS[(offset + i) % GIFS.length]);
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {picked.map((gif, i) => (
        <Gif
          key={gif.alt}
          src={gif.src}
          alt={gif.alt}
          title={gif.alt}
          width={width}
          draggable
          className={`relative ${
            i % 2 === 0 ? "-rotate-6" : i % 3 === 0 ? "rotate-3" : "rotate-[-1deg]"
          }`}
        />
      ))}
    </div>
  );
}