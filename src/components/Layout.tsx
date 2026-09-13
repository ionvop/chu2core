import type { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { Frame, TitleBar, Button } from "@react95/core";
import { User, Computer } from "@react95/icons";
import { Marquee } from "./Marquee";
import { Sparkles } from "./Sparkles";
import { NAV, SITE, COPYRIGHT_YEAR, MARQUEE_ITEMS } from "@/config/site";

interface LayoutProps {
  children: ReactNode;
}

const isActive = (to: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive;

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-pastel">
      {/* background texture */}
      <div className="bg-sparkle-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <Sparkles count={14} />

      {/* marquee ribbon topper */}
      <Marquee
        className="candy-stripes py-2 text-plum font-pixel tracking-wider text-sm"
        ariaLabel="Site announcements"
      >
        {MARQUEE_ITEMS.map((item) => (
          <span key={item} className="px-3">
            {item}
          </span>
        ))}
      </Marquee>

      {/* ── nav header as a Win95 window ── */}
      <header className="relative z-10 px-4 pt-4 sm:px-6">
        <Frame boxShadow="out" className="mx-auto max-w-5xl bg-blush/80 backdrop-blur-md">
          <TitleBar title={`${SITE.name}.exe - ${SITE.tagline}`} icon={<Computer />} className="items-center py-0.5">
            <TitleBar.OptionsBox className="ml-auto self-center">
              <TitleBar.Minimize />
              <TitleBar.Maximize />
              <TitleBar.Close />
            </TitleBar.OptionsBox>
          </TitleBar>

          <nav className="flex flex-wrap items-center gap-1 px-3 py-3 sm:px-4">
            <Link
              to="/"
              className="mr-2 font-pixel text-2xl text-rose-deep pixel-shadow hover:animate-wiggle inline-block"
              aria-label={`${SITE.name} home`}
            >
              {SITE.name}
            </Link>
            <span className="mr-2 hidden font-kawaii text-sm text-plum-muted sm:inline">
              ✧ {SITE.tagline}
            </span>
            <div className="ml-auto flex flex-wrap gap-1">
              {NAV.map((nav) => (
                <NavLink key={nav.to} to={nav.to} end={nav.to === "/"} className={isActive(nav.to)}>
                  {({ isActive }) => (
                    <Button
                      className={`px-3 py-1 font-kawaii text-sm ${
                        isActive ? "text-flamingo-deep font-bold" : "text-plum"
                      }`}
                    >
                      {isActive ? "★ " : ""}
                      {nav.label}
                    </Button>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </Frame>
      </header>

      {/* main content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        {children}
      </main>

      {/* ── footer ── */}
      <footer className="relative z-10 px-4 pb-8 sm:px-6">
        <Frame boxShadow="out" className="mx-auto max-w-5xl bg-blush/80">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="font-pixel text-sm text-plum">
              © {COPYRIGHT_YEAR} {SITE.name} — made with ♡ &amp; too much CHU²
            </p>
            <div className="flex items-center gap-4 font-kawaii text-sm">
              {NAV.map((nav) => (
                <NavLink key={nav.to} to={nav.to} end={nav.to === "/"}>
                  {({ isActive }) => (
                    <span
                      className={`hover:text-flamingo ${
                        isActive ? "text-flamingo-deep font-bold" : "text-plum-muted"
                      }`}
                    >
                      {nav.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 border-t-2 border-blush py-2">
            <span className="animate-bob text-salmon">✦</span>
            <span className="font-gothic text-xs text-plum-muted inline-block">
              もえもえ きゅん きゅん ☆
            </span>
            <span className="animate-bob text-flamingo">✦</span>
          </div>
        </Frame>
        <p className="mt-3 text-center font-kawaii text-xs text-plum-muted">
          <User className="mr-1 inline-block" width={12} height={12} /> blessed by Hatsune Pinku
        </p>
      </footer>
    </div>
  );
}