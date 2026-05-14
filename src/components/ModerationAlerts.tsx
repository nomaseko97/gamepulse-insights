import { moderationAlerts, gameById, GAMES } from "@/lib/mock-data";
import { useFilters, matchesFilters } from "@/lib/filter-context";
import { AlertTriangle, Bell } from "lucide-react";

const sevColor = {
  high:   "border-l-toxic   bg-toxic/10",
  medium: "border-l-frustrated bg-frustrated/10",
  low:    "border-l-primary bg-primary/10",
} as const;

const gamesById = Object.fromEntries(GAMES.map((g) => [g.id, g]));

export function ModerationAlerts() {
  const { filters } = useFilters();
  const visible = moderationAlerts.filter((a) =>
    matchesFilters({ gameId: a.gameId, region: a.region, player: a.player, text: a.reason }, filters, gamesById),
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" />
          <h3 className="font-semibold">Moderation Alerts</h3>
        </div>
        <span className="rounded-full bg-toxic/15 px-2 py-0.5 text-xs font-medium text-toxic">
          {visible.filter((a) => a.severity === "high").length} high priority
        </span>
      </div>
      <div className="space-y-2">
        {visible.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No alerts match filters.</p>
        )}
        {visible.map((a) => {
          const game = gameById(a.gameId);
          return (
            <div
              key={a.id}
              className={`rounded-xl border-l-2 p-3 ${sevColor[a.severity]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-foreground/70" />
                  <div>
                    <p className="text-sm font-medium">{a.player}</p>
                    <p className="text-xs text-muted-foreground">{a.reason}</p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">{a.time}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 pl-6">
                <span className="rounded-full bg-background/50 px-2 py-0.5 text-[11px] text-foreground/80">
                  {a.action}
                </span>
                <span className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[11px]">
                  {game.emoji} {game.name}
                </span>
                <span className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {a.region}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
