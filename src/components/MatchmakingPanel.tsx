import { Users, Zap } from "lucide-react";

const lobbies = [
  { id: 1, name: "Lobby Alpha", quality: 96, players: 10, profile: "Cooperative · Low-toxicity squad", tone: "positive" },
  { id: 2, name: "Lobby Bravo", quality: 88, players: 10, profile: "Competitive · Trusted ranks", tone: "primary" },
  { id: 3, name: "Lobby Echo",  quality: 64, players:  8, profile: "Mixed · Frustration trending up", tone: "frustrated" },
  { id: 4, name: "Lobby Zulu",  quality: 31, players:  6, profile: "Quarantined · 2 flagged players", tone: "toxic" },
] as const;

const toneColor: Record<string, string> = {
  positive: "var(--positive)",
  primary: "var(--primary)",
  frustrated: "var(--frustrated)",
  toxic: "var(--toxic)",
};

export function MatchmakingPanel() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Smart Matchmaking</h3>
        </div>
        <span className="text-xs text-muted-foreground">behavior-aware queue</span>
      </div>
      <div className="space-y-2">
        {lobbies.map((l) => (
          <div key={l.id} className="rounded-xl bg-background/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {l.name}
                  <span className="text-xs text-muted-foreground">· {l.players}/10</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.profile}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold tabular-nums" style={{ color: toneColor[l.tone] }}>
                  {l.quality}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">match score</div>
              </div>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full rounded-full" style={{ width: `${l.quality}%`, background: toneColor[l.tone] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
