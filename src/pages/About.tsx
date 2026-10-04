import { Marquee } from "@/components/Marquee";
import { Stamps } from "@/components/Stamps";
import { Gif } from "@/components/Gif";
import { Character } from "@/components/Character";
import { WinCard, Control } from "@/components/WinCard";
import avatar from "@/assets/avatar.webp";
import banner from "@/assets/banner.webp";
import {
  SITE,
  MARQUEE_ITEMS,
  ABOUT_TITLES,
  ABOUT_BIO,
  ABOUT_STACK,
  ABOUT_LAST_UPDATED,
  GIFS,
  type AboutLink,
} from "@/config/site";

/** Renders a string, turning any configured link text into an anchor. */
function InlineText({ text, links }: { text: string; links?: AboutLink[] }) {
  if (!links || links.length === 0) return <>{text}</>;

  const pattern = new RegExp(
    `(${links
      .map((link) => link.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "g",
  );

  return (
    <>
      {text.split(pattern).map((part, i) => {
        const link = links.find((candidate) => candidate.text === part);
        return link ? (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-rose-deep underline decoration-dotted underline-offset-2 hover:text-flamingo"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export function About() {
  return (
    <div className="relative flex flex-col gap-12">
      {/* ── header ── */}
      <section className="relative flex flex-col items-center gap-6 text-center">
        <Gif
          src={GIFS[0].src}
          alt={GIFS[0].alt}
          width={96}
          draggable
          className="absolute -left-4 top-2 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[1].src}
          alt={GIFS[1].alt}
          width={96}
          draggable
          className="absolute -right-4 top-2 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
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
        <Gif
          src={GIFS[2].src}
          alt={GIFS[2].alt}
          width={88}
          draggable
          className="absolute -left-3 top-6 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[3].src}
          alt={GIFS[3].alt}
          width={88}
          draggable
          className="absolute -right-3 top-6 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
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
              <ul className="flex flex-col items-center gap-3 text-center">
                {ABOUT_TITLES.map((title, index) => (
                  <li key={`${title.award}-${index}`} className="flex flex-col gap-0.5">
                    {title.institution && (
                      <span className="font-kawaii text-xs text-plum-muted">
                        {title.institution}
                      </span>
                    )}
                    {title.event && (
                      <span className="font-kawaii text-xs text-plum-muted">
                        {title.event}
                      </span>
                    )}
                    {title.category && (
                      <span className="font-kawaii text-xs text-plum">
                        {title.category}
                      </span>
                    )}
                    <span className="font-kawaii text-sm font-bold text-flamingo-deep">
                      ✦ {title.award}
                    </span>
                    {title.note && (
                      <span className="font-kawaii text-xs text-plum-muted">
                        <InlineText text={title.note} links={title.links} />
                      </span>
                    )}
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
              <p className="font-kawaii leading-relaxed text-plum">
                {ABOUT_BIO}
              </p>
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

      {/* ── tech stack windows ── */}
      <section className="relative">
        <Gif
          src={GIFS[6].src}
          alt={GIFS[6].alt}
          width={88}
          draggable
          className="absolute -left-3 top-0 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[7].src}
          alt={GIFS[7].alt}
          width={88}
          draggable
          className="absolute -right-3 top-0 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
        <h2 className="mb-5 text-center font-pixel text-3xl text-rose-deep pixel-shadow">
          my toolbox ✧
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ABOUT_STACK.map((card) => (
            <WinCard
              key={card.title}
              title={card.title}
              icon={<span className="text-base leading-none">{card.icon}</span>}
              className="transition-transform hover:-translate-y-1"
            >
              <p className="font-kawaii leading-relaxed text-plum">
                <InlineText text={card.body} links={card.links} />
              </p>
            </WinCard>
          ))}
        </div>
      </section>

      {/* ── my waifu window ── */}
      <section className="relative">
        <Gif
          src={GIFS[4].src}
          alt={GIFS[4].alt}
          width={88}
          draggable
          className="absolute -left-3 top-6 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[5].src}
          alt={GIFS[5].alt}
          width={88}
          draggable
          className="absolute -right-3 top-6 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
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
        <Gif
          src={GIFS[8].src}
          alt={GIFS[8].alt}
          width={88}
          draggable
          className="absolute -right-2 -top-4 z-10 hidden animate-bob rotate-3 sm:block"
        />
        <Stamps count={4} width={72} className="-rotate-1" />
      </section>
    </div>
  );
}