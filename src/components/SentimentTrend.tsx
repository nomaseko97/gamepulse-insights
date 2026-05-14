import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { trendData, emotionMeta } from "@/lib/mock-data";

const series: { key: keyof typeof emotionMeta; label: string }[] = [
  { key: "positive", label: "Positive" },
  { key: "excited", label: "Excited" },
  { key: "frustrated", label: "Frustrated" },
  { key: "toxic", label: "Toxic" },
];

export function SentimentTrend() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-semibold">Sentiment Over Time</h3>
          <p className="text-xs text-muted-foreground">Hourly volume across all channels (UTC)</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-3 rounded-sm" style={{ background: emotionMeta[s.key].color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={emotionMeta[s.key].color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={emotionMeta[s.key].color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="oklch(0.3 0.04 265)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" stroke="oklch(0.6 0.03 255)" fontSize={11} tickLine={false} axisLine={false} interval={3} />
            <YAxis stroke="oklch(0.6 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "oklch(0.21 0.035 265)",
                border: "1px solid oklch(0.3 0.04 265)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={emotionMeta[s.key].color}
                fill={`url(#g-${s.key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
