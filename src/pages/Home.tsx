import { Marquee } from "@/components/Marquee";
import { Stamps } from "@/components/Stamps";
import { Character } from "@/components/Character";
import { WinCard } from "@/components/WinCard";
import {
  SITE,
  HERO_CARDS,
  SITE_PROJECTS,
  MARQUEE_ITEMS,
} from "@/config/site";

type Glyph = "code" | "game" | "heart";

// emoji stand-ins for the classic Win95 icon vibe (tiny + no runtime cost)
const cardIconMap: Record<Glyph, React.ReactNode> = {
  code: <span className="text-lg leading-none">💾</span>,
  game: <span className="text-lg leading-none">🕹</span>,
  heart: <span className="text-lg leading-none">💗</span>,
};

export function Home() {
  return (
    <div className="relative flex flex-col gap-12">
      {/* ── HERO section ── */}
      <section className="relative flex flex-col items-center gap-6 text-center">
        <Stamps count={3} width={80} className="-mb-2" />

        <h1 className="font-pixel text-6xl leading-none text-flamingo-deep pixel-shadow sm:text-7xl">
          Hi! I'm <span className="text-rose">{SITE.name}</span>
        </h1>
        <p className="font-kawaii text-2xl text-plum sm:text-3xl">
          ♡ Welcome to my website ♡
        </p>

        {/* side-by-side characters flanking a message frame */}
        <div className="relative flex w-full items-end justify-center gap-4">
          <Character variant="casual" className="w-28 sm:w-36" />
          <div className="flex flex-col items-center gap-3">
            <Stamps count={5} width={64} />
            <div className="win-outset rounded-[2px] bg-white/90">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="text-lg leading-none">💬</span>
                <input
                  type="text"
                  placeholder="send me a message!"
                  className="win-input min-w-0 flex-1 text-sm"
                  aria-label="Send a message"
                />
                <button type="button" className="win-button font-kawaii text-sm font-bold">
                  ✉ send
                </button>
              </div>
            </div>
          </div>
          <Character variant="live" className="w-28 sm:w-36" />
        </div>
      </section>

      {/* ── marquee splitter ── */}
      <Marquee
        className="bg-rose-deep py-2 font-pixel tracking-widest text-cream"
        reverse
        ariaLabel="About ticker"
      >
        {MARQUEE_ITEMS.slice(0, 3).map((item) => (
          <span key={item} className="px-4">
            ✦ {item}
          </span>
        ))}
      </Marquee>

      {/* ── the three about cards ── */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {HERO_CARDS.map((card) => (
          <WinCard
            key={card.title}
            title={card.title}
            icon={cardIconMap[card.icon]}
            className="transition-transform hover:-translate-y-1"
          >
            <p className="font-kawaii leading-relaxed text-plum">{card.body}</p>
          </WinCard>
        ))}
      </section>

      {/* ── sites / projects ── */}
      <section className="relative">
        <h2 className="mb-5 text-center font-pixel text-3xl text-rose-deep pixel-shadow">
          my little sites ✧
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SITE_PROJECTS.map((proj) => (
            <WinCard
              key={proj.slug}
              title={proj.name}
              className="transition-transform hover:-translate-y-1"
            >
              <p className="mb-1 font-kawaii text-sm font-bold text-flamingo-deep">
                ✦ {proj.tagline}
              </p>
              <p className="font-kawaii leading-relaxed text-plum">
                {proj.description}
              </p>
            </WinCard>
          ))}
        </div>
      </section>

      {/* ── closing stamps ── */}
      <section className="-mt-2 flex justify-center">
        <Stamps count={4} width={72} className="-rotate-1" />
      </section>
    </div>
  );
}