import { Link } from "react-router-dom";
import { Stamp } from "./Stamp";
import { STAMPS } from "@/config/site";

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
    <div className="flex flex-col items-center gap-6 py-16 text-center">
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