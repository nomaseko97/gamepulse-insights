import { playerReputations } from "@/lib/mock-data";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

const badgeMap = {
  exemplary: { icon: ShieldCheck, color: "text-positive", bg: "bg-positive/15" },
  trusted:   { icon: Shield,      color: "text-primary",  bg: "bg-primary/15" },
  watch:     { icon: ShieldAlert, color: "text-frustrated", bg: "bg-frustrated/15" },
  flagged:   { icon: ShieldX,     color: "text-toxic",    bg: "bg-toxic/15" },
} as const;

export function PlayerReputation() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-semibold">Player Reputation Scores</h3>
          <p className="text-xs text-muted-foreground">AI-weighted behavior across recent matches</p>
        </div>
      </div>
      <div className="space-y-2">
        {playerReputations.map((p) => {
          const Badge = badgeMap[p.badge];
          const Icon = Badge.icon;
          return (
            <div key={p.name} className="flex items-center gap-3 rounded-xl bg-background/30 p-3">
              <div className={`rounded-lg p-2 ${Badge.bg} ${Badge.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="font-semibold tabular-nums">{p.reputation}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.reputation}%`,
                      background:
                        p.reputation > 75 ? "var(--positive)" :
                        p.reputation > 50 ? "var(--primary)" :
                        p.reputation > 30 ? "var(--frustrated)" : "var(--toxic)",
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{p.matches.toLocaleString()} matches · {p.toxicityRate}% toxic</span>
                  <span className={p.trend >= 0 ? "text-positive" : "text-negative"}>
                    {p.trend >= 0 ? "▲" : "▼"} {Math.abs(p.trend)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
