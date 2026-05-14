import { Activity, Bell, Search, Sparkles, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useFilters } from "@/lib/filter-context";
import { toast } from "sonner";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/players", label: "Players" },
  { to: "/channels", label: "Channels" },
  { to: "/reports", label: "Reports" },
] as const;

export function Header() {
  const { filters, setFilter, runSweep, sweeping } = useFilters();

  const handleSweep = () => {
    if (sweeping) return;
    toast.loading("Running AI sweep across live chat…", { id: "ai-sweep" });
    runSweep();
    setTimeout(() => {
      toast.success("AI sweep complete — moderation summary refreshed", { id: "ai-sweep" });
    }, 1450);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl glow-primary" style={{ background: "var(--gradient-primary)" }}>
            <Activity className="h-5 w-5 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              Game<span className="text-gradient">Pulse</span>
            </h1>
            <p className="text-[11px] text-muted-foreground">Understanding the Emotion Behind Every Match</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/50 bg-card/50 p-1 text-sm md:flex">
          {navItems.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "rounded-full bg-primary/20 px-4 py-1.5 text-primary" }}
              inactiveProps={{ className: "rounded-full px-4 py-1.5 text-muted-foreground hover:text-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm md:flex">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search players, channels, messages…"
              className="w-56 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            className="relative rounded-full border border-border/50 bg-card/50 p-2 text-muted-foreground hover:text-foreground"
            onClick={() => toast("3 new high-priority moderation alerts")}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-toxic pulse-dot" />
          </button>
          <button
            onClick={handleSweep}
            disabled={sweeping}
            className="hidden items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-background transition disabled:opacity-70 md:flex"
            style={{ background: "var(--gradient-primary)" }}
          >
            {sweeping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {sweeping ? "Sweeping…" : "Run AI Sweep"}
          </button>
        </div>
      </div>
    </header>
  );
}
