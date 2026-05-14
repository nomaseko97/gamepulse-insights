import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { AISummaryT, aiSummary as defaultSummary, generateAISummary } from "./mock-data";

export interface Filters {
  game: string; // "" = all
  gameType: string; // "" = all
  region: string; // "" = all
  search: string;
}

interface Ctx {
  filters: Filters;
  setFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  resetFilters: () => void;
  summary: AISummaryT;
  sweeping: boolean;
  runSweep: () => void;
}

const FilterContext = createContext<Ctx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({ game: "", gameType: "", region: "", search: "" });
  const [summary, setSummary] = useState<AISummaryT>(defaultSummary);
  const [sweeping, setSweeping] = useState(false);

  const value = useMemo<Ctx>(() => ({
    filters,
    setFilter: (k, v) => setFilters((f) => ({ ...f, [k]: v })),
    resetFilters: () => setFilters({ game: "", gameType: "", region: "", search: "" }),
    summary,
    sweeping,
    runSweep: () => {
      setSweeping(true);
      setTimeout(() => {
        setSummary(generateAISummary(filters));
        setSweeping(false);
      }, 1400);
    },
  }), [filters, summary, sweeping]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}

export function matchesFilters(
  item: { gameId?: string; region?: string; player?: string; channel?: string; text?: string },
  filters: Filters,
  gamesById: Record<string, { type: string }>,
) {
  if (filters.game && item.gameId !== filters.game) return false;
  if (filters.region && item.region !== filters.region) return false;
  if (filters.gameType && item.gameId && gamesById[item.gameId]?.type !== filters.gameType) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const hay = `${item.player ?? ""} ${item.channel ?? ""} ${item.text ?? ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}
