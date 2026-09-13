import { useState } from "react";
import { Stamp } from "./Stamp";
import { STAMPS } from "@/config/site";

interface FallingStamp {
  id: number;
  src: string;
  alt: string;
  /** horizontal position as a % of the viewport width */
  left: number;
  /** width in px */
  width: number;
  /** rotation in degrees */
  rot: number;
  /** animation delay in seconds (staggered start) */
  delay: number;
}

const SHOWER_COUNT = 18;
const MIN_WIDTH = 48;
const MAX_WIDTH = 96;

let nextId = 1;

/** Random int in [min, max] inclusive. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * A fixed floating button (bottom-right) that, when clicked, showers a bunch
 * of CHU² stamps down from the top of the screen. Each stamp bounces a few
 * times on the bottom edge, then fades out and despawns. Pure client-side —
 * reuses the `STAMPS` data and the `Stamp` renderer.
 */
export function StampShower() {
  const [stamps, setStamps] = useState<FallingStamp[]>([]);

  function shower() {
    const batch: FallingStamp[] = [];
    for (let i = 0; i < SHOWER_COUNT; i++) {
      const stamp = STAMPS[randInt(0, STAMPS.length - 1)];
      batch.push({
        id: nextId++,
        src: stamp.src,
        alt: stamp.alt,
        left: Math.random() * 100,
        width: randInt(MIN_WIDTH, MAX_WIDTH),
        rot: randInt(-20, 20),
        delay: Math.random() * 0.9,
      });
    }
    setStamps((prev) => [...prev, ...batch]);
  }

  function despawn(id: number) {
    setStamps((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <>
      {/* falling stamps overlay */}
      <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
        {stamps.map((s) => (
          <Stamp
            key={s.id}
            src={s.src}
            alt={s.alt}
            width={s.width}
            className="absolute animate-stamp-shower"
            style={{
              left: `${s.left}%`,
              top: 0,
              animationDelay: `${s.delay}s`,
              ["--stamp-rot" as string]: `${s.rot}deg`,
            }}
            onAnimationEnd={() => despawn(s.id)}
          />
        ))}
      </div>

      {/* trigger button */}
      <button
        type="button"
        onClick={shower}
        className="win-button fixed bottom-4 right-4 z-50 font-kawaii text-sm font-bold"
        aria-label="Shower the page with stamps"
        title="stamp shower!"
      >
        ✧ stamp shower ✧
      </button>
    </>
  );
}