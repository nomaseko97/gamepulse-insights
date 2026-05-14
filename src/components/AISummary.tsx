import { aiSummary } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";

export function AISummary() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-primary)", filter: "blur(60px)" }} />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-lg bg-primary/20 p-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">AI Moderation Summary</h3>
        </div>
        <p className="text-base font-medium leading-snug">{aiSummary.headline}</p>
        <ul className="mt-3 space-y-2">
          {aiSummary.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{aiSummary.generated}</p>
      </div>
    </div>
  );
}
