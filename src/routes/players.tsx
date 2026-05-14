import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { PlayerReputation } from "@/components/PlayerReputation";
import { playerReputations, gameById, GAMES } from "@/lib/mock-data";
import { useFilters, matchesFilters } from "@/lib/filter-context";

export const Route = createFileRoute("/players")({
  component: PlayersPage,
  head: () => ({
    meta: [
      { title: "Players — GamePulse" },
      { name: "description", content: "Browse player reputation, behavior trends and toxicity rates across games." },
    ],
  }),
});

const gamesById = Object.fromEntries(GAMES.map((g) => [g.id, g]));

function PlayersPage() {
  const { filters } = useFilters();
  const visible = playerReputations.filter((p) =>
    matchesFilters({ gameId: p.mainGame, region: p.region, player: p.name }, filters, gamesById),
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1500px] space-y-5 px-6 py-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Players</h2>
          <p className="text-sm text-muted-foreground">{visible.length} of {playerReputations.length} players match your filters.</p>
        </div>
        <FilterBar />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlayerReputation />
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Roster Detail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">Player</th>
                    <th>Game</th>
                    <th>Region</th>
                    <th>Matches</th>
                    <th className="text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => {
                    const g = gameById(p.mainGame);
                    return (
                      <tr key={p.name} className="border-t border-border/40">
                        <td className="py-2 font-medium">{p.name}</td>
                        <td>{g.emoji} {g.name}</td>
                        <td className="text-muted-foreground">{p.region}</td>
                        <td className="text-muted-foreground">{p.matches.toLocaleString()}</td>
                        <td className="text-right font-semibold tabular-nums">{p.reputation}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
