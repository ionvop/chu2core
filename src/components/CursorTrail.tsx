import { useEffect, useRef } from "react";

interface TrailDot {
  el: HTMLSpanElement;
  life: number;
  born: number;
}

/**
 * A sparkle/pixel cursor trail. Every mousemove spawns a little star at the
 * pointer that fades and shrinks away — a classic webcore flourish.
 */
export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dots: TrailDot[] = [];
    const GLYPHS = ["✦", "✧", "✦", "✿", "♡"];
    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      // throttle spawn rate so we don't spew particles
      if (now - lastSpawn < 70) return;
      lastSpawn = now;

      const el = document.createElement("span");
      el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      el.style.position = "fixed";
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.pointerEvents = "none";
      el.style.zIndex = "9999";
      el.style.fontSize = `${12 + Math.random() * 10}px`;
      el.style.color = ["#ff5a4e", "#ff9ec4", "#fa8072", "#d45d79", "#ffd9e8"][
        Math.floor(Math.random() * 5)
      ];
      el.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
      el.style.transform = "translate(0,0) scale(1)";
      container.appendChild(el);

      dots.push({ el, life: 750, born: now });

      requestAnimationFrame(() => {
        el.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${
          (Math.random() - 0.5) * 40
        }px) scale(0.1)`;
        el.style.opacity = "0";
      });
    };

    const tick = () => {
      const now = performance.now();
      for (let i = dots.length - 1; i >= 0; i--) {
        if (now - dots[i].born > dots[i].life) {
          dots[i].el.remove();
          dots.splice(i, 1);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden />;
}