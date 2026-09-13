import { Stamp } from "./Stamp";
import { STAMPS } from "@/config/site";

interface StampsProps {
  /** how many to show */
  count?: number;
  className?: string;
  width?: number;
}

/**
 * A little row of CHU² stamps plastered around the page.
 */
export function Stamps({ count = 5, className = "", width = 88 }: StampsProps) {
  const picked = STAMPS.slice(0, count);
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {picked.map((stamp, i) => (
        <Stamp
          key={stamp.alt}
          src={stamp.src}
          alt={stamp.alt}
          title={stamp.alt}
          width={width}
          className={`relative ${
            i % 2 === 0 ? "-rotate-6" : i % 3 === 0 ? "rotate-3" : "rotate-[-1deg]"
          }`}
        />
      ))}
    </div>
  );
}