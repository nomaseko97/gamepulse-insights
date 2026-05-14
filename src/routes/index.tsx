import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { LiveChatFeed } from "@/components/LiveChatFeed";
import { EmotionDistribution } from "@/components/EmotionDistribution";
import { SentimentTrend } from "@/components/SentimentTrend";
import { ToxicityHeatmap } from "@/components/ToxicityHeatmap";
import { PlayerReputation } from "@/components/PlayerReputation";
import { ModerationAlerts } from "@/components/ModerationAlerts";
import { AISummary } from "@/components/AISummary";
import { MatchmakingPanel } from "@/components/MatchmakingPanel";
import { FilterBar } from "@/components/FilterBar";
import { MessageCircle, ShieldAlert, Smile, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "GamePulse — AI Gaming Sentiment Analysis" },
      { name: "description", content: "Real-time AI sentiment analysis, toxicity detection, behavior trends, and smart moderation for online games." },
    ],
  }),
});

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1500px] space-y-5 px-6 py-6">
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-positive" />
            Live · 184,302 messages classified in the last 24h across 38 servers
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Sentiment Control Center</h2>
        </section>

        <FilterBar />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Healthy Sentiment" value="76%" sub="Positive + Excited + Neutral" delta={4} icon={Smile} tone="positive" />
          <StatCard label="Active Players" value="42,189" sub="across 38 servers" delta={2} icon={Users} tone="primary" />
          <StatCard label="Messages / min" value="3,240" sub="peak at 21:00 UTC" delta={12} icon={MessageCircle} tone="accent" />
          <StatCard label="Toxicity Rate" value="3.8%" sub="contained to 7 hotspots" delta={-6} icon={ShieldAlert} tone="toxic" />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <SentimentTrend />
            <ToxicityHeatmap />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ModerationAlerts />
              <MatchmakingPanel />
            </div>
          </div>
          <div className="space-y-4">
            <AISummary />
            <EmotionDistribution />
            <LiveChatFeed />
            <PlayerReputation />
          </div>
        </section>

        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          GamePulse · Powered by real-time NLP · Demo data shown for visualization
        </footer>
      </main>
    </div>
  );
}
