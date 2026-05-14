import { Sparkles, Loader2 } from "lucide-react";
import { useFilters } from "@/lib/filter-context";

export function AISummary() {
  const { summary, runSweep, sweeping } = useFilters();
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-primary)", filter: "blur(60px)" }} />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-1.5 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">AI Moderation Summary</h3>
          </div>
          <button
            onClick={runSweep}
            disabled={sweeping}
            className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/40 px-2.5 py-1 text-[11px] hover:text-foreground disabled:opacity-60"
          >
            {sweeping ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {sweeping ? "Sweeping…" : "Regenerate"}
          </button>
        </div>
        <p className="text-base font-medium leading-snug">{summary.headline}</p>
        <ul className="mt-3 space-y-2">
          {summary.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{summary.generated}</p>
      </div>
    </div>
  );
}
