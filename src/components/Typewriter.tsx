import { useEffect, useState } from "react";

interface TypewriterProps {
  /** the full text to reveal */
  text: string;
  /** ms between each character */
  speed?: number;
  /** ms to wait before typing starts */
  startDelay?: number;
  className?: string;
  /** called once the whole string has been revealed */
  onDone?: () => void;
}

/**
 * Reveals `text` one character at a time for that dramatic "CHU² is scolding
 * you" feel. Respects `prefers-reduced-motion` by showing the full text
 * instantly, and restarts cleanly whenever `text` changes.
 */
export function Typewriter({
  text,
  speed = 28,
  startDelay = 250,
  className = "",
  onDone,
}: TypewriterProps) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setShown(text);
      onDone?.();
      return;
    }

    setShown("");
    let i = 0;
    let interval: number | undefined;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          if (interval) window.clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      {shown.length < text.length && (
        <span className="animate-pulse" aria-hidden>
          ▌
        </span>
      )}
    </span>
  );
}
