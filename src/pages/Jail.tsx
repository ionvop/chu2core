import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Marquee } from "@/components/Marquee";
import { Sparkles } from "@/components/Sparkles";
import { Gif } from "@/components/Gif";
import { Stamp } from "@/components/Stamp";
import { Typewriter } from "@/components/Typewriter";
import { WinCard, Control } from "@/components/WinCard";
import {
  JAIL_TYPES,
  JAIL_DEFAULT_REASON,
  JAIL_MARQUEE_ITEMS,
  JAIL_STORAGE_KEY,
  STAMPS,
  GIFS,
  type TimeoutType,
} from "@/config/site";

interface JailDirective {
  timeoutType: TimeoutType;
  reason: string;
}

/**
 * Reads the timeout directive the chat handed off via sessionStorage. Falls
 * back to a generic timeout when the page is opened directly (or the stored
 * value is malformed), so the corner always renders something sensible.
 */
function readDirective(): JailDirective {
  try {
    const raw = sessionStorage.getItem(JAIL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<JailDirective>;
      const type = parsed.timeoutType;
      if (type && type in JAIL_TYPES) {
        return {
          timeoutType: type,
          reason:
            typeof parsed.reason === "string" && parsed.reason.trim() !== ""
              ? parsed.reason
              : JAIL_DEFAULT_REASON,
        };
      }
    }
  } catch {
    /* malformed / unavailable storage — fall through to the default */
  }
  return { timeoutType: "general", reason: JAIL_DEFAULT_REASON };
}

/**
 * The naughty corner. A standalone, full-screen timeout page CHU² redirects
 * users to when they misbehave. The centerpiece GIF, headline, and accent
 * color are all driven by the `timeoutType` from the API response, and the
 * user must wait out a countdown before they can leave.
 */
export function Jail() {
  const directive = useMemo(readDirective, []);
  const config = JAIL_TYPES[directive.timeoutType];

  const [remaining, setRemaining] = useState(config.seconds);
  const [reasonDone, setReasonDone] = useState(false);
  const unlocked = remaining <= 0;

  // Tick the countdown down to zero.
  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining]);

  // Clear the directive once it has been consumed so a later refresh of /jail
  // doesn't replay a stale timeout.
  useEffect(() => {
    return () => sessionStorage.removeItem(JAIL_STORAGE_KEY);
  }, []);

  const stamp = STAMPS.find((s) => s.alt === "not to be underestimated");

  return (
    <div className="jail-backdrop relative flex min-h-screen flex-col overflow-x-hidden">
      <Sparkles count={16} />

      {/* ── scolding ticker ── */}
      <Marquee
        className="candy-stripes py-2 font-pixel text-sm tracking-wider text-plum"
        ariaLabel="Naughty corner announcements"
      >
        {JAIL_MARQUEE_ITEMS.map((item) => (
          <span key={item} className="px-3">
            {item}
          </span>
        ))}
      </Marquee>

      {/* ── the corner ── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        {/* floating stickers plastered around the corner */}
        <Gif
          src={GIFS[0].src}
          alt={GIFS[0].alt}
          width={88}
          draggable
          className="absolute left-2 top-6 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[1].src}
          alt={GIFS[1].alt}
          width={88}
          draggable
          className="absolute right-2 top-6 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
        <Gif
          src={GIFS[2].src}
          alt={GIFS[2].alt}
          width={80}
          draggable
          className="absolute bottom-6 left-4 z-10 hidden animate-float-slow -rotate-3 sm:block"
        />
        <Gif
          src={GIFS[3].src}
          alt={GIFS[3].alt}
          width={80}
          draggable
          className="absolute bottom-6 right-4 z-10 hidden animate-bob rotate-3 sm:block"
        />

        <WinCard
          title="timeout.exe - naughty corner"
          icon={<span className="text-base leading-none">🚧</span>}
          controls={
            <>
              <Control glyph="–" label="Minimize" />
              <Control glyph="□" label="Maximize" />
              <Control glyph="✕" label="Close" />
            </>
          }
          className="w-full max-w-2xl animate-pop"
        >
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="font-pixel text-xs tracking-widest text-plum-muted">
              ✖ CHU² HAS SENT YOU TO THE NAUGHTY CORNER ✖
            </p>

            {/* centerpiece GIF driven by timeoutType */}
            <Gif
              src={config.gif}
              alt={config.gifAlt}
              width={220}
              className="animate-bob"
            />

            <h1
              className="font-pixel text-4xl leading-none pixel-shadow sm:text-5xl"
              style={{ color: config.accent }}
            >
              {config.headline}
            </h1>
            <p className="font-kawaii text-lg text-plum-muted">
              {config.subtext}
            </p>

            {/* CHU²'s reason, typewritten for drama */}
            <div className="win-inset w-full rounded-[2px] bg-cream/90 px-4 py-3 text-left">
              <p className="mb-1 font-kawaii text-xs font-bold text-plum-muted">
                ✦ CHU² says:
              </p>
              <p className="min-h-[3rem] font-kawaii leading-relaxed text-plum">
                <Typewriter
                  text={directive.reason}
                  onDone={() => setReasonDone(true)}
                />
              </p>
            </div>

            {/* countdown + exit */}
            <div className="flex flex-col items-center gap-3">
              {unlocked ? (
                <p
                  className="font-pixel text-lg"
                  style={{ color: config.accent }}
                >
                  ♡ okay, you can leave now ♡
                </p>
              ) : (
                <p className="font-kawaii text-sm text-plum-muted">
                  stand here for{" "}
                  <span
                    className="font-pixel text-lg"
                    style={{ color: config.accent }}
                  >
                    {remaining}s
                  </span>{" "}
                  and think about what you've done...
                </p>
              )}

              <Link
                to="/"
                aria-disabled={!unlocked}
                tabIndex={unlocked ? undefined : -1}
                onClick={(e) => {
                  if (!unlocked) e.preventDefault();
                }}
                className={`win-button font-kawaii text-sm font-bold ${
                  unlocked
                    ? "text-flamingo-deep"
                    : "pointer-events-none opacity-50"
                }`}
              >
                {unlocked ? "✦ i've thought about it" : "🔒 not yet..."}
              </Link>

              {!reasonDone && (
                <p className="font-kawaii text-xs text-plum-muted">
                  ...listen to CHU² first ♡
                </p>
              )}
            </div>

            {stamp && (
              <Stamp
                src={stamp.src}
                alt={stamp.alt}
                width={120}
                className="animate-wiggle rotate-3"
              />
            )}
          </div>
        </WinCard>
      </main>

      <p className="relative z-10 pb-6 text-center font-kawaii text-xs text-plum-muted">
        <span className="mr-1">💗</span> be good, or CHU² will send you back here
      </p>
    </div>
  );
}
