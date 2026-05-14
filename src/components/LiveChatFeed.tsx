import { useEffect, useState } from "react";
import { ChatMessage, emotionMeta, generateMessage, initialMessages } from "@/lib/mock-data";
import { Radio } from "lucide-react";

export function LiveChatFeed() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    const id = setInterval(() => {
      setMessages((prev) => [generateMessage(), ...prev].slice(0, 30));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card flex h-full flex-col rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Live Chat Stream</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-positive" />
          Real-time AI classification
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => {
          const meta = emotionMeta[m.emotion];
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
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 18%, transparent)`, color: meta.color }}
                >
                  <span>{meta.emoji}</span> {meta.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  confidence {(m.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
