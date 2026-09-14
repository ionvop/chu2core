import { Link } from "react-router-dom";
import { Stamp } from "./Stamp";
import { Gif } from "./Gif";
import { STAMPS, GIFS } from "@/config/site";

interface UnderConstructionProps {
  /** e.g. "about" */
  pageName: string;
}

/**
 * Stub content for not-yet-built pages.
 */
export function UnderConstruction({ pageName }: UnderConstructionProps) {
  const stamp = STAMPS.find((s) => s.alt === "not to be underestimated");
  return (
    <div className="relative flex flex-col items-center gap-6 py-16 text-center">
      <Gif
        src={GIFS[0].src}
        alt={GIFS[0].alt}
        width={96}
        className="pointer-events-none absolute -left-4 top-4 z-10 hidden animate-bob -rotate-6 sm:block"
      />
      <Gif
        src={GIFS[1].src}
        alt={GIFS[1].alt}
        width={96}
        className="pointer-events-none absolute -right-4 top-4 z-10 hidden animate-float-slow rotate-6 sm:block"
      />
      <Gif
        src={GIFS[2].src}
        alt={GIFS[2].alt}
        width={88}
        className="pointer-events-none absolute -bottom-4 left-2 z-10 hidden animate-bob -rotate-3 sm:block"
      />
      <Gif
        src={GIFS[3].src}
        alt={GIFS[3].alt}
        width={88}
        className="pointer-events-none absolute -bottom-4 right-2 z-10 hidden animate-float-slow rotate-3 sm:block"
      />
      {stamp && (
        <Stamp
          src={stamp.src}
          alt={stamp.alt}
          width={150}
          className="animate-bob rotate-3"
        />
      )}

      <h1 className="font-pixel text-4xl text-flamingo-deep pixel-shadow">
        🚧 under construction! 🚧
      </h1>
      <p className="max-w-md font-kawaii text-lg text-plum-muted">
        The <span className="font-pixel text-rose">{pageName}</span> page isn't built
        yet — I'm busy being simping for CHU², probably. Come back soon! ✧
      </p>
      <p className="max-w-sm text-sm font-kawaii text-plum-muted">
        ...or make yourself at home and check out the{" "}
        <Link
          to="/"
          className="font-bold text-salmon underline decoration-wavy decoration-flamingo underline-offset-4 hover:text-flamingo"
        >
          homepage
        </Link>{" "}
        meanwhile. ♡
      </p>
    </div>
  );
}