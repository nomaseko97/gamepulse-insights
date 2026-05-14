export type Emotion = "positive" | "negative" | "neutral" | "frustrated" | "excited" | "toxic";

export const EMOTIONS: Emotion[] = ["positive", "excited", "neutral", "frustrated", "negative", "toxic"];

export const emotionMeta: Record<Emotion, { label: string; color: string; emoji: string }> = {
  positive:   { label: "Positive",   color: "var(--positive)",   emoji: "😊" },
  excited:    { label: "Excited",    color: "var(--excited)",    emoji: "🔥" },
  neutral:    { label: "Neutral",    color: "var(--neutral)",    emoji: "😐" },
  frustrated: { label: "Frustrated", color: "var(--frustrated)", emoji: "😤" },
  negative:   { label: "Negative",   color: "var(--negative)",   emoji: "😞" },
  toxic:      { label: "Toxic",      color: "var(--toxic)",      emoji: "☠️" },
};

const sampleMessages: { text: string; emotion: Emotion }[] = [
  { text: "GG team, that was a clean win!", emotion: "positive" },
  { text: "LETS GOOOO clutch of the century 🔥", emotion: "excited" },
  { text: "moving to B site", emotion: "neutral" },
  { text: "why does this lag every single round...", emotion: "frustrated" },
  { text: "we lost again, im done", emotion: "negative" },
  { text: "you're so bad uninstall the game", emotion: "toxic" },
  { text: "nice shot bro!!", emotion: "positive" },
  { text: "INSANE 1v4 ACE!!!", emotion: "excited" },
  { text: "rotating mid", emotion: "neutral" },
  { text: "this matchmaking is broken", emotion: "frustrated" },
  { text: "report the smurf in our team", emotion: "negative" },
  { text: "trash team, stop feeding noobs", emotion: "toxic" },
  { text: "thanks for the heal!", emotion: "positive" },
  { text: "POGGERS sick play", emotion: "excited" },
  { text: "need backup at A", emotion: "neutral" },
  { text: "lag spike again wtf", emotion: "frustrated" },
  { text: "ez game ez life", emotion: "toxic" },
  { text: "good luck have fun!", emotion: "positive" },
];

const players = ["NebulaWolf", "PixelRanger", "VoidHunter", "EchoSniper", "NovaBlitz", "ShadowFox", "KineticAce", "FrostByte", "SoloLeveler", "RogueSpec"];
const channels = ["Ranked #4291", "Casual EU", "Tournament A", "Squad Chat", "Voice Match"];

export interface ChatMessage {
  id: string;
  player: string;
  channel: string;
  text: string;
  emotion: Emotion;
  confidence: number;
  ts: number;
}

let counter = 0;
export function generateMessage(): ChatMessage {
  const sample = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  return {
    id: `msg-${Date.now()}-${counter++}`,
    player: players[Math.floor(Math.random() * players.length)],
    channel: channels[Math.floor(Math.random() * channels.length)],
    text: sample.text,
    emotion: sample.emotion,
    confidence: 0.78 + Math.random() * 0.21,
    ts: Date.now(),
  };
}

export const initialMessages: ChatMessage[] = Array.from({ length: 12 }, () => {
  const m = generateMessage();
  m.ts = Date.now() - Math.floor(Math.random() * 60_000);
  return m;
}).sort((a, b) => b.ts - a.ts);

export interface PlayerRep {
  name: string;
  reputation: number;
  trend: number;
  matches: number;
  toxicityRate: number;
  badge: "exemplary" | "trusted" | "watch" | "flagged";
}

export const playerReputations: PlayerRep[] = [
  { name: "NebulaWolf",   reputation: 94, trend:  2, matches: 1284, toxicityRate: 0.4,  badge: "exemplary" },
  { name: "KineticAce",   reputation: 88, trend:  1, matches:  912, toxicityRate: 1.2,  badge: "trusted" },
  { name: "FrostByte",    reputation: 82, trend: -1, matches:  656, toxicityRate: 2.1,  badge: "trusted" },
  { name: "ShadowFox",    reputation: 71, trend:  3, matches:  402, toxicityRate: 4.8,  badge: "trusted" },
  { name: "RogueSpec",    reputation: 58, trend: -4, matches:  788, toxicityRate: 9.6,  badge: "watch" },
  { name: "VoidHunter",   reputation: 41, trend: -2, matches:  331, toxicityRate: 14.2, badge: "watch" },
  { name: "SoloLeveler",  reputation: 22, trend: -8, matches:  117, toxicityRate: 28.4, badge: "flagged" },
];

export const trendData = Array.from({ length: 24 }, (_, i) => {
  const base = Math.sin(i / 3) * 8;
  return {
    hour: `${i.toString().padStart(2, "0")}:00`,
    positive: Math.round(45 + base + Math.random() * 6),
    excited:  Math.round(28 + base * 0.6 + Math.random() * 5),
    neutral:  Math.round(18 - base * 0.3 + Math.random() * 4),
    frustrated: Math.round(12 - base * 0.4 + Math.random() * 4),
    negative:   Math.round( 8 - base * 0.2 + Math.random() * 3),
    toxic:      Math.round( 4 + Math.random() * 3),
  };
});

export const heatmapRegions = [
  "NA-East", "NA-West", "EU-West", "EU-North", "SA", "OCE", "ASIA", "ME",
];

export const heatmapData = heatmapRegions.map((region) => ({
  region,
  hours: Array.from({ length: 24 }, () => Math.round(Math.random() * 100)),
}));

export const moderationAlerts = [
  { id: "a1", severity: "high",   player: "SoloLeveler", reason: "Repeated hate speech in Ranked #4291", time: "2m ago", action: "Auto-muted 24h" },
  { id: "a2", severity: "high",   player: "VoidHunter",  reason: "Threats detected toward teammate",      time: "7m ago", action: "Pending review" },
  { id: "a3", severity: "medium", player: "RogueSpec",   reason: "Toxicity score spiked +18% this hour",  time: "14m ago", action: "Warning issued" },
  { id: "a4", severity: "low",    player: "ShadowFox",   reason: "Frustration cluster after 3 losses",    time: "22m ago", action: "Cooldown suggested" },
];

export const aiSummary = {
  headline: "Community sentiment is up 12% — toxicity contained to a small cluster.",
  bullets: [
    "Positive and excited messages dominate Tournament A (+18% vs yesterday).",
    "Toxicity is concentrated in Ranked #4291 between 21:00–23:00 UTC.",
    "3 players account for 64% of flagged messages — recommend escalation.",
    "Frustration spikes correlate with 250+ms latency in EU-West region.",
  ],
  generated: "Updated 1 min ago by GamePulse AI",
};
