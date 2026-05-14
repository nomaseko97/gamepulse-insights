import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { AISummary } from "@/components/AISummary";
import { SentimentTrend } from "@/components/SentimentTrend";
import { ToxicityHeatmap } from "@/components/ToxicityHeatmap";
import { GAMES, gameById } from "@/lib/mock-data";
import { useFilters } from "@/lib/filter-context";
import { FileBarChart, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports — GamePulse" },
      { name: "description", content: "AI-generated reports on sentiment, toxicity and player behavior." },
    ],
  }),
});

const reports = [
  { id: "r1", title: "Weekly Toxicity Digest", scope: "All games", period: "Last 7 days", status: "Ready" },
  { id: "r2", title: "Tournament A Sentiment", scope: "Counter-Strike 2", period: "Yesterday",  status: "Ready" },
  { id: "r3", title: "EU-West Frustration Spike", scope: "Valorant",       period: "Last 24h",   status: "Ready" },
  { id: "r4", title: "MOBA Behavior Trends",      scope: "MOBA titles",    period: "Last 30 days", status: "Generating" },
];

function ReportsPage() {
  const { filters } = useFilters();
  const scope =
    filters.game ? gameById(filters.game)?.name :
    filters.gameType ? `${filters.gameType} titles` : "All games";

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1500px] space-y-5 px-6 py-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Reports</h2>
          <p className="text-sm text-muted-foreground">
            Scope: <span className="text-foreground">{scope}</span> · {filters.region || "all regions"}
          </p>
        </div>
        <FilterBar />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <SentimentTrend />
            <ToxicityHeatmap />
          </div>
          <div className="space-y-4">
            <AISummary />
            <div className="glass-card rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileBarChart className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Saved Reports</h3>
              </div>
              <div className="space-y-2">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-background/30 p-3">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.scope} · {r.period}</p>
                    </div>
                    <button
                      onClick={() => toast.success(`Downloading "${r.title}"`)}
                      disabled={r.status !== "Ready"}
                      className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/40 px-3 py-1 text-xs hover:text-foreground disabled:opacity-50"
                    >
                      <Download className="h-3 w-3" />
                      {r.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Sentiment by Game</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {GAMES.map((g) => {
              const positive = Math.round(50 + Math.random() * 30);
              const toxic = Math.round(2 + Math.random() * 12);
              return (
                <div key={g.id} className="rounded-xl bg-background/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <span>{g.emoji}</span>
                      <span className="truncate">{g.name}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{g.type}</span>
                  </div>
                  <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full bg-positive" style={{ width: `${positive}%` }} />
                    <div className="h-full bg-toxic" style={{ width: `${toxic}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>{positive}% positive</span>
                    <span>{toxic}% toxic</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
