import { heatmapData } from "@/lib/mock-data";
import { useFilters } from "@/lib/filter-context";

function cellColor(v: number) {
  // 0 -> background, 100 -> toxic
  const alpha = 0.05 + (v / 100) * 0.85;
  return `color-mix(in oklab, var(--toxic) ${alpha * 100}%, transparent)`;
}

export function ToxicityHeatmap() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-semibold">Toxicity Heatmap</h3>
          <p className="text-xs text-muted-foreground">Region × hour intensity</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>low</span>
          <div className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(to right, color-mix(in oklab, var(--toxic) 5%, transparent), var(--toxic))" }} />
          <span>high</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="mb-1 grid" style={{ gridTemplateColumns: "80px repeat(24, minmax(0,1fr))" }}>
            <div />
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center text-[10px] text-muted-foreground">
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>
          {heatmapData.map((row) => (
            <div key={row.region} className="mb-1 grid items-center gap-px" style={{ gridTemplateColumns: "80px repeat(24, minmax(0,1fr))" }}>
              <div className="text-xs text-muted-foreground">{row.region}</div>
              {row.hours.map((v, i) => (
                <div
                  key={i}
                  title={`${row.region} ${i}:00 — ${v}`}
                  className="h-6 rounded-[3px] transition-transform hover:scale-110"
                  style={{ background: cellColor(v) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
