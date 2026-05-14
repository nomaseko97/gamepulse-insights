import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "positive" | "toxic";
}

const toneMap = {
  primary:  "from-primary/30 to-primary/0 text-primary",
  accent:   "from-accent/30 to-accent/0 text-accent",
  positive: "from-positive/30 to-positive/0 text-positive",
  toxic:    "from-toxic/30 to-toxic/0 text-toxic",
};

export function StatCard({ label, value, sub, delta, icon: Icon, tone = "primary" }: Props) {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className={`absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br opacity-60 blur-2xl ${toneMap[tone]}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={`rounded-xl bg-background/40 p-2 ${toneMap[tone].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta !== undefined && (
        <div className="relative mt-3 flex items-center gap-1 text-xs">
          <span className={delta >= 0 ? "text-positive" : "text-negative"}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">vs last 24h</span>
        </div>
      )}
    </div>
  );
}
