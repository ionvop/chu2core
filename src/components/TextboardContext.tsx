import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Relative so it resolves under the current subdirectory (e.g. /home/api/board).
const BOARD_API = "api/board";

interface TextboardContextValue {
  /** The current global textboard content. */
  board: string;
  /** A human-readable error when the board couldn't be loaded, else null. */
  boardError: string | null;
  /** Replaces the locally-held board content (e.g. from a CHU² reply). */
  setBoard: (content: string) => void;
}

const TextboardContext = createContext<TextboardContextValue | null>(null);

/**
 * Shares the single global textboard between the chat and the textboard window.
 *
 * The board is written only by the AI (CHU²) acting as an intermediary, so this
 * provider owns the read side: it loads the board once on mount and exposes a
 * setter so `Chat` can push the latest content returned with each reply.
 */
export function TextboardProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<string>("");
  const [boardError, setBoardError] = useState<string | null>(null);

  // Load the global textboard on mount.
  useEffect(() => {
    let cancelled = false;

    fetch(BOARD_API)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't load the textboard.");
        return res.json();
      })
      .then((data: { content?: string }) => {
        if (!cancelled && typeof data.content === "string") {
          setBoard(data.content);
        }
      })
      .catch(() => {
        if (!cancelled) setBoardError("textboard unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TextboardContext.Provider value={{ board, boardError, setBoard }}>
      {children}
    </TextboardContext.Provider>
  );
}

/** Accesses the shared textboard state. Must be used within a `TextboardProvider`. */
export function useTextboard(): TextboardContextValue {
  const context = useContext(TextboardContext);
  if (context === null) {
    throw new Error("useTextboard must be used within a TextboardProvider.");
  }
  return context;
}
