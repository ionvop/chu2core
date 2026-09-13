import { useEffect, useRef, useState } from "react";
import { Character } from "./Character";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = "/api/chat";
const STORAGE_KEY = "ionvop.chat.key";

/**
 * The CHU²-powered contact assistant. Talks to the same-origin PHP chat API
 * (`public/api/chat`), persists the session key in localStorage so the
 * conversation survives a page refresh, and renders the history on mount.
 */
export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  );
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load existing history on mount if we already have a session key.
  useEffect(() => {
    if (!sessionKey) return;
    let cancelled = false;

    fetch(`${API_BASE}?key=${encodeURIComponent(sessionKey)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't load the chat history.");
        return res.json();
      })
      .then((data: { messages?: ChatMessage[] }) => {
        if (!cancelled && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // A stale key (e.g. DB reset) just means we start fresh.
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setSessionKey(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (content === "" || loading) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The API tunnels the real verb through `_method` (InfinityFree only
        // allows GET + POST), so we must declare "POST" explicitly.
        body: JSON.stringify({ _method: "POST", key: sessionKey, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Something went wrong. Try again!");
      }

      if (data.key) {
        localStorage.setItem(STORAGE_KEY, data.key);
        setSessionKey(data.key);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── message log ── */}
      <div
        ref={scrollRef}
        className="win-inset h-80 overflow-y-auto rounded-[2px] bg-cream/90 px-3 py-3"
        aria-live="polite"
      >
        {messages.length === 0 && !loading ? (
          <div className="flex items-center gap-3">
            <Character variant="live" float={false} className="w-14 shrink-0" />
            <p className="font-kawaii text-sm leading-relaxed text-plum">
              hi hi! ♡ I'm CHU² — ionvop's lil contact assistant. ask me anything,
              or just say hi! ✧
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <Character
                    variant="live"
                    float={false}
                    className="w-10 shrink-0 select-none"
                  />
                )}
                <div
                  className={`win-outset max-w-[75%] rounded-[2px] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-plum text-cream"
                      : "bg-blush/80 text-plum"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── typing indicator ── */}
        {loading && (
          <div className="mt-3 flex items-center gap-2">
            <Character
              variant="live"
              float={false}
              className="w-10 shrink-0 select-none"
            />
            <span className="animate-bob text-2xl leading-none" aria-label="CHU² is typing">
              💭
            </span>
            <span className="font-kawaii text-sm text-plum-muted">
              chu² is thinking...
            </span>
          </div>
        )}
      </div>

      {/* ── error line ── */}
      {error && (
        <p className="font-kawaii text-xs text-flamingo-deep" role="alert">
          ⚠ {error}
        </p>
      )}

      {/* ── composer ── */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="write a reply..."
          aria-label="Write a message to CHU²"
          className="win-input min-w-0 flex-1 text-sm"
          disabled={loading}
        />
        <button
          type="button"
          onClick={send}
          disabled={input.trim() === "" || loading}
          className="win-button font-kawaii text-sm font-bold"
        >
          ✉ send
        </button>
      </div>
    </div>
  );
}