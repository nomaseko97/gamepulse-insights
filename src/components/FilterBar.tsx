import { useFilters } from "@/lib/filter-context";
import { GAMES, GAME_TYPES, REGIONS } from "@/lib/mock-data";
import { Filter, X } from "lucide-react";

export function FilterBar() {
  const { filters, setFilter, resetFilters } = useFilters();
  const active = filters.game || filters.gameType || filters.region || filters.search;

  const selectClass =
    "rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary";

  return (
    <div className="glass-card flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        Filters
      </div>

      <select
        className={selectClass}
        value={filters.game}
        onChange={(e) => setFilter("game", e.target.value)}
        aria-label="Filter by game"
      >
        <option value="">All games</option>
        {GAMES.map((g) => (
          <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.gameType}
        onChange={(e) => setFilter("gameType", e.target.value)}
        aria-label="Filter by game type"
      >
        <option value="">All genres</option>
        {GAME_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.region}
        onChange={(e) => setFilter("region", e.target.value)}
        aria-label="Filter by region"
      >
        <option value="">All regions</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {active ? (
        <button
          onClick={resetFilters}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      ) : (
        <span className="ml-auto text-[11px] text-muted-foreground">Showing all data</span>
      )}
    </div>
  );
}
