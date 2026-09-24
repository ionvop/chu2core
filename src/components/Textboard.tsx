import { WinCard, Control } from "@/components/WinCard";
import { useTextboard } from "@/components/TextboardContext";

/**
 * The global textboard, shown in its own Win95-style window.
 *
 * Reads the single global text blob (`public/api/board`) shared by every
 * visitor. The board is written only by the AI (CHU²) acting as an
 * intermediary, so this window is read-only — it just displays whatever the
 * board currently holds. The content is owned by `TextboardProvider`, which
 * `Chat` updates with the latest board returned on each reply.
 */
export function Textboard() {
  const { board, boardError } = useTextboard();

  return (
    <WinCard
      title="textboard.exe"
      icon={<span className="text-base leading-none">✦</span>}
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
        one shared board for every visitor — ask CHU² to write something! ♡
      </p>
      <div className="win-inset rounded-[2px] bg-cream/90 px-3 py-2">
        <p className="mb-1 font-kawaii text-xs font-bold text-plum-muted">
          ✦ global textboard ✦
        </p>
        {boardError ? (
          <p className="font-kawaii text-xs text-flamingo-deep">
            ⚠ {boardError}
          </p>
        ) : board.trim() === "" ? (
          <p className="font-kawaii text-xs italic text-plum-muted">
            the board is empty — ask CHU² to write something! ♡
          </p>
        ) : (
          <p className="whitespace-pre-wrap font-kawaii text-sm leading-relaxed text-plum">
            {board}
          </p>
        )}
      </div>
    </WinCard>
  );
}