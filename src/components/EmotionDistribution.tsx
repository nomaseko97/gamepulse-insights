import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { EMOTIONS, emotionMeta } from "@/lib/mock-data";

const data = [
  { key: "positive",   value: 38 },
  { key: "excited",    value: 22 },
  { key: "neutral",    value: 18 },
  { key: "frustrated", value: 11 },
  { key: "negative",   value:  7 },
  { key: "toxic",      value:  4 },
].map((d) => ({ ...d, fill: emotionMeta[d.key as keyof typeof emotionMeta].color }));

export function EmotionDistribution() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Emotion Distribution</h3>
        <span className="text-xs text-muted-foreground">last 24h · 184k msgs</span>
      </div>
      <div className="relative">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 50]} tick={false} />
              <RadialBar background={{ fill: "oklch(0.27 0.04 265)" }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gradient">76%</span>
          <span className="text-xs text-muted-foreground">healthy sentiment</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {EMOTIONS.map((e) => {
          const meta = emotionMeta[e];
          const v = data.find((d) => d.key === e)?.value ?? 0;
          return (
            <div key={e} className="flex items-center justify-between rounded-lg bg-background/30 px-2 py-1.5">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                {meta.label}
              </span>
              <span className="font-medium tabular-nums">{v}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
