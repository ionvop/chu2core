import { Marquee } from "@/components/Marquee";
import { Stamps } from "@/components/Stamps";
import { WinCard, Control } from "@/components/WinCard";
import { Chat } from "@/components/Chat";
import { SOCIALS, MARQUEE_ITEMS } from "@/config/site";

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
        <Stamps count={4} width={72} className="-rotate-1" />
      </section>
    </div>
  );
}