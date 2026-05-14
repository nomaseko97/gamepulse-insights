import { useEffect, useMemo, useState } from "react";
import { ChatMessage, emotionMeta, gameById, GAMES, generateMessage, initialMessages } from "@/lib/mock-data";
import { useFilters, matchesFilters } from "@/lib/filter-context";
import { Radio } from "lucide-react";

const gamesById = Object.fromEntries(GAMES.map((g) => [g.id, g]));

export function LiveChatFeed() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const { filters } = useFilters();

  useEffect(() => {
    const id = setInterval(() => {
      setMessages((prev) => [generateMessage(), ...prev].slice(0, 40));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(
    () => messages.filter((m) => matchesFilters(m, filters, gamesById)),
    [messages, filters],
  );

  return (
    <div className="glass-card flex h-full flex-col rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Live Chat Stream</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-positive" />
          {visible.length}/{messages.length} shown
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3" style={{ maxHeight: 420 }}>
        {visible.length === 0 && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No messages match current filters.
          </p>
        )}
        {visible.map((m) => {
          const meta = emotionMeta[m.emotion];
          const game = gameById(m.gameId);
          return (
            <div key={m.id} className="slide-up rounded-xl border border-border/40 bg-background/30 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{m.player}</span>
                  <span>·</span>
                  <span>{m.channel}</span>
                </div>
                <span>{Math.max(0, Math.round((Date.now() - m.ts) / 1000))}s</span>
              </div>
              <p className="mt-1.5 text-sm">{m.text}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 18%, transparent)`, color: meta.color }}
                >
                  <span>{meta.emoji}</span> {meta.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[11px] text-foreground/80">
                  {game.emoji} {game.name}
                </span>
                <span className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {m.region}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(m.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
