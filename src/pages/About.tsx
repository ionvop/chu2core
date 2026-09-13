import { Marquee } from "@/components/Marquee";
import { Stamps } from "@/components/Stamps";
import { Character } from "@/components/Character";
import { WinCard, Control } from "@/components/WinCard";
import avatar from "@/assets/avatar.png";
import banner from "@/assets/banner.png";
import {
  SITE,
  MARQUEE_ITEMS,
  ABOUT_TITLES,
  ABOUT_BIO,
  ABOUT_LAST_UPDATED,
} from "@/config/site";

export function About() {
  return (
    <div className="relative flex flex-col gap-12">
      {/* ── header ── */}
      <section className="relative flex flex-col items-center gap-6 text-center">
        <Stamps count={3} width={80} className="-mb-2" />

        <h1 className="font-pixel text-6xl leading-none text-flamingo-deep pixel-shadow sm:text-7xl">
          about <span className="text-rose">me</span>
        </h1>
        <p className="font-kawaii text-2xl text-plum sm:text-3xl">
          ♡ a little window into my world ♡
        </p>
      </section>

      {/* ── profile window ── */}
      <section className="relative">
        <WinCard
          title="profile.exe"
          icon={<span className="text-base leading-none">🖥</span>}
          controls={
            <>
              <Control glyph="–" label="Minimize" />
              <Control glyph="□" label="Maximize" />
              <Control glyph="✕" label="Close" />
            </>
          }
          className="transition-transform hover:-translate-y-1"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-start">
            {/* left column: avatar + name + titles */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={avatar}
                alt={`${SITE.name} avatar`}
                loading="lazy"
                className="win-outset h-28 w-28 rounded-full object-cover select-none sm:h-36 sm:w-36"
              />
              <p className="font-pixel text-2xl text-rose-deep pixel-shadow">
                {SITE.name}
              </p>
              <ul className="flex flex-col items-center gap-1 text-center">
                {ABOUT_TITLES.map((title) => (
                  <li
                    key={title}
                    className="font-kawaii text-sm text-plum-muted"
                  >
                    {title}
                  </li>
                ))}
              </ul>
            </div>

            {/* right column: banner + bio */}
            <div className="min-w-0">
              <img
                src={banner}
                alt={`${SITE.name} banner`}
                loading="lazy"
                className="win-outset mb-4 w-full rounded-[2px] object-cover select-none"
              />
              <p className="mb-4 font-kawaii text-sm font-bold text-flamingo-deep">
                ✦ About Me
              </p>
              <p className="mb-6 font-kawaii text-xs text-plum-muted">
                last updated: {ABOUT_LAST_UPDATED}
              </p>
              <div className="flex flex-col gap-4">
                {ABOUT_BIO.map((para) => (
                  <p key={para} className="font-kawaii leading-relaxed text-plum">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </WinCard>
      </section>

      {/* ── marquee splitter ── */}
      <Marquee
        className="candy-stripes py-2 font-pixel tracking-widest text-plum"
        reverse
        ariaLabel="About ticker"
      >
        {MARQUEE_ITEMS.slice(0, 3).map((item) => (
          <span key={item} className="px-4">
            ✦ {item}
          </span>
        ))}
      </Marquee>

      {/* ── my waifu window ── */}
      <section className="relative">
        <WinCard
          title="waifu.exe"
          icon={<span className="text-base leading-none">💗</span>}
          className="transition-transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center gap-4">
            <p className="font-kawaii text-lg text-plum-muted">
              my waifu &darr;&darr;&darr;
            </p>
            <Character variant="live" className="w-32 sm:w-40" />
            <p className="font-kawaii text-sm text-plum-muted">
              CHU² — the sole reason I keep going forward in life ♡
            </p>
          </div>
        </WinCard>
      </section>

      {/* ── closing stamps ── */}
      <section className="-mt-2 flex justify-center">
        <Stamps count={4} width={72} className="-rotate-1" />
      </section>
    </div>
  );
}