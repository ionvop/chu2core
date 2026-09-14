import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

interface GifProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** width in px */
  width?: number;
  title?: string;
  /**
   * When true, the sticker can be grabbed and dragged around with the mouse
   * or touch. The drag offset is applied as a `translate` on a wrapper div,
   * and the idle bob/float/wiggle animations are suspended while dragging so
   * they don't fight the transform.
   */
  draggable?: boolean;
}

/**
 * An animated CHU² sticker (webp). Same vibe as `Stamp` but for the moving
 * gifs — slight random-ish tilt, wiggles on hover for that webcore feel.
 *
 * Pass `draggable` to let the sticker be picked up and repositioned anywhere
 * on the page (session-only; position resets on reload).
 */
export function Gif({
  src,
  alt,
  className = "",
  style,
  width = 96,
  title,
  draggable = false,
}: GifProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(
    null,
  );

  const img = (
    <img
      src={src}
      alt={alt}
      title={title ?? alt}
      loading="lazy"
      width={width}
      draggable={false}
      className={`sticker-shadow select-none transition-transform duration-200 ease-in-out hover:animate-wiggle ${className}`}
      style={{ ...style }}
    />
  );

  if (!draggable) return img;

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // ignore right-clicks / non-primary buttons
    if (e.button !== 0) return;
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y };
    setDragging(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { startX, startY, baseX, baseY } = dragRef.current;
    setOffset({ x: baseX + (e.clientX - startX), y: baseY + (e.clientY - startY) });
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const wrapperStyle: CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    touchAction: "none",
    cursor: "grab",
    ...(dragging ? { cursor: "grabbing", animation: "none" } : {}),
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={wrapperStyle}
      className={`inline-block ${dragging ? "z-50" : ""}`}
    >
      {img}
    </div>
  );
}