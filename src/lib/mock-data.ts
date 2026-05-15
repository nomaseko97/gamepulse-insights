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

export type GameType = "FPS" | "MOBA" | "Battle Royale" | "Sports";
export interface Game { id: string; name: string; type: GameType; emoji: string }

export const GAMES: Game[] = [
  { id: "valorant",  name: "Valorant",        type: "FPS",            emoji: "🎯" },
  { id: "cs2",       name: "Counter-Strike 2",type: "FPS",            emoji: "💣" },
  { id: "apex",      name: "Apex Legends",    type: "Battle Royale",  emoji: "🪂" },
  { id: "fortnite",  name: "Fortnite",        type: "Battle Royale",  emoji: "🛠️" },
  { id: "lol",       name: "League of Legends", type: "MOBA",         emoji: "⚔️" },
  { id: "dota2",     name: "Dota 2",          type: "MOBA",           emoji: "🛡️" },
  { id: "fifa",      name: "EA FC 25",        type: "Sports",         emoji: "⚽" },
];

export const GAME_TYPES: GameType[] = ["FPS", "MOBA", "Battle Royale", "Sports"];
export const REGIONS = ["NA-East", "NA-West", "EU-West", "EU-North", "SA", "OCE", "ASIA", "ME"] as const;
export type Region = typeof REGIONS[number];

export function gameById(id: string) { return GAMES.find((g) => g.id === id)!; }

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
  gameId: string;
  region: Region;
}

let counter = 0;
export function generateMessage(): ChatMessage {
  const sample = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  return {
    id: `msg-${Date.now()}-${counter++}`,
    player: players[Math.floor(Math.random() * players.length)],
    channel: channels[Math.floor(Math.random() * channels.length)],
    text: sample.text,
    emotion: sample.emotion,
    confidence: 0.78 + Math.random() * 0.21,
    ts: Date.now(),
    gameId: game.id,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
  };
}

export const initialMessages: ChatMessage[] = Array.from({ length: 18 }, () => {
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
  mainGame: string;
  region: Region;
}

export const playerReputations: PlayerRep[] = [
  { name: "NebulaWolf",  reputation: 94, trend:  2, matches: 1284, toxicityRate: 0.4,  badge: "exemplary", mainGame: "valorant", region: "EU-West" },
  { name: "KineticAce",  reputation: 88, trend:  1, matches:  912, toxicityRate: 1.2,  badge: "trusted",   mainGame: "cs2",      region: "NA-East" },
  { name: "FrostByte",   reputation: 82, trend: -1, matches:  656, toxicityRate: 2.1,  badge: "trusted",   mainGame: "apex",     region: "NA-West" },
  { name: "ShadowFox",   reputation: 71, trend:  3, matches:  402, toxicityRate: 4.8,  badge: "trusted",   mainGame: "lol",      region: "ASIA" },
  { name: "RogueSpec",   reputation: 58, trend: -4, matches:  788, toxicityRate: 9.6,  badge: "watch",     mainGame: "dota2",    region: "EU-North" },
  { name: "VoidHunter",  reputation: 41, trend: -2, matches:  331, toxicityRate: 14.2, badge: "watch",     mainGame: "fortnite", region: "SA" },
  { name: "SoloLeveler", reputation: 22, trend: -8, matches:  117, toxicityRate: 28.4, badge: "flagged",   mainGame: "valorant", region: "ME" },
  { name: "PixelRanger", reputation: 79, trend:  4, matches:  540, toxicityRate: 3.2,  badge: "trusted",   mainGame: "fifa",     region: "EU-West" },
  { name: "EchoSniper",  reputation: 66, trend:  0, matches:  221, toxicityRate: 6.0,  badge: "trusted",   mainGame: "cs2",      region: "OCE" },
  { name: "NovaBlitz",   reputation: 51, trend: -3, matches:  410, toxicityRate: 11.0, badge: "watch",     mainGame: "apex",     region: "NA-East" },
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

export const heatmapRegions = [...REGIONS];

// Deterministic pseudo-random so SSR and client render the same heatmap.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
export const heatmapData = heatmapRegions.map((region, ri) => {
  const rand = seeded(ri * 9973 + 7);
  return {
    region,
    hours: Array.from({ length: 24 }, () => Math.round(rand() * 100)),
  };
});

export interface ModAlert {
  id: string;
  severity: "high" | "medium" | "low";
  player: string;
  reason: string;
  time: string;
  action: string;
  gameId: string;
  region: Region;
}

export const moderationAlerts: ModAlert[] = [
  { id: "a1", severity: "high",   player: "SoloLeveler", reason: "Repeated hate speech in Ranked #4291", time: "2m ago", action: "Auto-muted 24h",      gameId: "valorant", region: "ME" },
  { id: "a2", severity: "high",   player: "VoidHunter",  reason: "Threats detected toward teammate",      time: "7m ago", action: "Pending review",      gameId: "fortnite", region: "SA" },
  { id: "a3", severity: "medium", player: "RogueSpec",   reason: "Toxicity score spiked +18% this hour",  time: "14m ago", action: "Warning issued",     gameId: "dota2",    region: "EU-North" },
  { id: "a4", severity: "low",    player: "ShadowFox",   reason: "Frustration cluster after 3 losses",    time: "22m ago", action: "Cooldown suggested", gameId: "lol",      region: "ASIA" },
  { id: "a5", severity: "medium", player: "NovaBlitz",   reason: "Trash-talk burst in voice chat",        time: "31m ago", action: "Voice muted 1h",     gameId: "apex",     region: "NA-East" },
  { id: "a6", severity: "low",    player: "EchoSniper",  reason: "Frustration after disconnect",          time: "48m ago", action: "No action",          gameId: "cs2",      region: "OCE" },
];

export interface AISummaryT {
  headline: string;
  bullets: string[];
  generated: string;
}

export const aiSummary: AISummaryT = {
  headline: "Community sentiment is up 12% — toxicity contained to a small cluster.",
  bullets: [
    "Positive and excited messages dominate Tournament A (+18% vs yesterday).",
    "Toxicity is concentrated in Ranked #4291 between 21:00–23:00 UTC.",
    "3 players account for 64% of flagged messages — recommend escalation.",
    "Frustration spikes correlate with 250+ms latency in EU-West region.",
  ],
  generated: "Updated 1 min ago by GamePulse AI",
};

export function generateAISummary(opts: { game?: string; region?: string; gameType?: string }): AISummaryT {
  const scope =
    opts.game ? gameById(opts.game)?.name :
    opts.gameType ? `${opts.gameType} titles` :
    "all games";
  const reg = opts.region ?? "all regions";
  const headlines = [
    `Sentiment in ${scope} (${reg}) trending +${(Math.random() * 14 + 3).toFixed(1)}% over the last hour.`,
    `${scope} chat is mostly positive — toxicity isolated to ${Math.floor(Math.random() * 4 + 2)} hotspots in ${reg}.`,
    `Frustration rising in ${scope} (${reg}); recommend tighter matchmaking thresholds.`,
    `${scope} voice and text channels look healthy across ${reg}.`,
  ];
  const allBullets = [
    `Excited messages spike during late-night sessions in ${reg}.`,
    `Toxicity rate down ${(Math.random() * 8 + 1).toFixed(1)}% week-over-week in ${scope}.`,
    `Top 5 flagged players generate ${Math.floor(Math.random() * 30 + 40)}% of negative chat.`,
    `Frustration correlates with ${Math.floor(Math.random() * 150 + 120)}+ms latency.`,
    `Auto-moderation handled ${Math.floor(Math.random() * 800 + 200)} cases in the last 24h.`,
    `Smart matchmaking improved lobby quality by ${(Math.random() * 12 + 4).toFixed(1)}%.`,
  ];
  return {
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    bullets: allBullets.sort(() => Math.random() - 0.5).slice(0, 4),
    generated: `Updated just now by GamePulse AI · scope: ${scope} · ${reg}`,
  };
}
