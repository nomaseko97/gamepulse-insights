import { Activity, Bell, Search, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl glow-primary" style={{ background: "var(--gradient-primary)" }}>
            <Activity className="h-5 w-5 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              Game<span className="text-gradient">Pulse</span>
            </h1>
            <p className="text-[11px] text-muted-foreground">AI sentiment & moderation control center</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-border/50 bg-card/50 p-1 text-sm md:flex">
          {["Overview", "Players", "Channels", "Reports"].map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-4 py-1.5 transition ${i === 0 ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm text-muted-foreground md:flex">
            <Search className="h-3.5 w-3.5" />
            <span>Search players, channels…</span>
          </div>
          <button className="relative rounded-full border border-border/50 bg-card/50 p-2 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-toxic pulse-dot" />
          </button>
          <button
            className="hidden items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-background md:flex"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Run AI Sweep
          </button>
        </div>
      </div>
    </header>
  );
}
