import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { GAMES, gameById } from "@/lib/mock-data";
import { useFilters } from "@/lib/filter-context";
import { Hash, Mic, Users } from "lucide-react";

export const Route = createFileRoute("/channels")({
  component: ChannelsPage,
  head: () => ({
    meta: [
      { title: "Channels — GamePulse" },
      { name: "description", content: "Live channel sentiment health across games and regions." },
    ],
  }),
});

const baseChannels = [
  { name: "Ranked #4291",   type: "text",  game: "valorant", region: "EU-West",  health: 38, msgs: 12_804, toxic: 8.4 },
  { name: "Tournament A",   type: "text",  game: "cs2",      region: "NA-East",  health: 92, msgs: 9_421,  toxic: 1.1 },
  { name: "Squad Chat",     type: "voice", game: "apex",     region: "NA-West",  health: 78, msgs: 4_122,  toxic: 3.2 },
  { name: "Casual EU",      type: "text",  game: "fortnite", region: "EU-North", health: 84, msgs: 7_845,  toxic: 2.0 },
  { name: "Voice Match",    type: "voice", game: "lol",      region: "ASIA",     health: 61, msgs: 5_233,  toxic: 5.6 },
  { name: "Pro League",     type: "text",  game: "dota2",    region: "EU-North", health: 70, msgs: 3_120,  toxic: 4.0 },
  { name: "Pickup Lobby",   type: "voice", game: "fifa",     region: "SA",       health: 55, msgs: 1_980,  toxic: 7.2 },
  { name: "Late Night",     type: "text",  game: "valorant", region: "OCE",      health: 48, msgs: 2_640,  toxic: 9.8 },
];

function ChannelsPage() {
  const { filters } = useFilters();
  const channels = baseChannels.filter((c) => {
    if (filters.game && c.game !== filters.game) return false;
    if (filters.region && c.region !== filters.region) return false;
    if (filters.gameType && GAMES.find((g) => g.id === c.game)?.type !== filters.gameType) return false;
    if (filters.search && !`${c.name} ${c.region}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1500px] space-y-5 px-6 py-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Channels</h2>
          <p className="text-sm text-muted-foreground">Sentiment health across {channels.length} live channels.</p>
        </div>
        <FilterBar />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {channels.map((c) => {
            const g = gameById(c.game);
            const tone = c.health > 75 ? "var(--positive)" : c.health > 50 ? "var(--primary)" : c.health > 30 ? "var(--frustrated)" : "var(--toxic)";
            const Icon = c.type === "voice" ? Mic : Hash;
            return (
              <div key={c.name} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/15 p-2 text-primary"><Icon className="h-4 w-4" /></div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{g.emoji} {g.name} · {c.region}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-semibold tabular-nums" style={{ color: tone }}>{c.health}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                  <div className="h-full rounded-full" style={{ width: `${c.health}%`, background: tone }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.msgs.toLocaleString()} msgs / 24h</span>
                  <span>{c.toxic}% toxic</span>
                </div>
              </div>
            );
          })}
          {channels.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No channels match your filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}
