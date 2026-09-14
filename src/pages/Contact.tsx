import { Marquee } from "@/components/Marquee";
import { Stamps } from "@/components/Stamps";
import { Gif } from "@/components/Gif";
import { WinCard, Control } from "@/components/WinCard";
import { Chat } from "@/components/Chat";
import { SOCIALS, MARQUEE_ITEMS, GIFS } from "@/config/site";

// emoji stand-ins for each platform's logo (tiny + no runtime cost)
const socialIconMap: Record<string, string> = {
  discord: "💬",
  github: "🐙",
  youtube: "▶",
};

export function Contact() {
  return (
    <div className="relative flex flex-col gap-12">
      {/* ── header ── */}
      <section className="relative flex flex-col items-center gap-6 text-center">
        <Gif
          src={GIFS[0].src}
          alt={GIFS[0].alt}
          width={96}
          className="pointer-events-none absolute -left-4 top-2 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[1].src}
          alt={GIFS[1].alt}
          width={96}
          className="pointer-events-none absolute -right-4 top-2 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
        <Stamps count={3} width={80} className="-mb-2" />

        <h1 className="font-pixel text-6xl leading-none text-flamingo-deep pixel-shadow sm:text-7xl">
          contact <span className="text-rose">me</span>
        </h1>
        <p className="font-kawaii text-2xl text-plum sm:text-3xl">
          ♡ say hi, I don't bite ♡
        </p>
      </section>

      {/* ── socials window ── */}
      <section className="relative">
        <Gif
          src={GIFS[2].src}
          alt={GIFS[2].alt}
          width={88}
          className="pointer-events-none absolute -left-3 top-6 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[3].src}
          alt={GIFS[3].alt}
          width={88}
          className="pointer-events-none absolute -right-3 top-6 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
        <WinCard
          title="socials.exe"
          icon={<span className="text-base leading-none">📡</span>}
          controls={
            <>
              <Control glyph="–" label="Minimize" />
              <Control glyph="□" label="Maximize" />
              <Control glyph="✕" label="Close" />
            </>
          }
          className="transition-transform hover:-translate-y-1"
        >
          <p className="mb-5 font-kawaii text-sm text-plum-muted">
            you can find me on these platforms ✧
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                title={`${social.label} — ${social.handle}`}
                aria-label={`${social.label}: ${social.handle}`}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className="win-outset grid h-16 w-16 place-items-center rounded-full text-2xl leading-none transition-transform group-hover:scale-110"
                  style={{ backgroundColor: social.color }}
                >
                  {socialIconMap[social.key]}
                </span>
                <span className="font-kawaii text-xs text-plum-muted">
                  {social.handle}
                </span>
              </a>
            ))}
          </div>
        </WinCard>
      </section>

      {/* ── marquee splitter ── */}
      <Marquee
        className="candy-stripes py-2 font-pixel tracking-widest text-plum"
        reverse
        ariaLabel="Contact ticker"
      >
        {MARQUEE_ITEMS.slice(0, 3).map((item) => (
          <span key={item} className="px-4">
            ✦ {item}
          </span>
        ))}
      </Marquee>

      {/* ── chat assistant window ── */}
      <section className="relative">
        <Gif
          src={GIFS[4].src}
          alt={GIFS[4].alt}
          width={88}
          className="pointer-events-none absolute -left-3 top-6 z-10 hidden animate-bob -rotate-6 sm:block"
        />
        <Gif
          src={GIFS[5].src}
          alt={GIFS[5].alt}
          width={88}
          className="pointer-events-none absolute -right-3 top-6 z-10 hidden animate-float-slow rotate-6 sm:block"
        />
        <WinCard
          title="contact.exe"
          icon={<span className="text-base leading-none">💬</span>}
          controls={
            <>
              <Control glyph="–" label="Minimize" />
              <Control glyph="□" label="Maximize" />
              <Control glyph="✕" label="Close" />
            </>
          }
          className="transition-transform hover:-translate-y-1"
        >
          <p className="mb-4 font-kawaii text-sm text-plum-muted">
            my assistant CHU² will pass your message along ♡
          </p>
          <Chat />
        </WinCard>
      </section>

      {/* ── closing stamps ── */}
      <section className="-mt-2 flex justify-center">
        <Gif
          src={GIFS[6].src}
          alt={GIFS[6].alt}
          width={88}
          className="pointer-events-none absolute -right-2 -top-4 z-10 hidden animate-bob rotate-3 sm:block"
        />
        <Stamps count={4} width={72} className="-rotate-1" />
      </section>
    </div>
  );
}