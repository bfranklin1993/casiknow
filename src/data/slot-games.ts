export interface SlotGame {
  id: string;
  name: string;
  manufacturer: string;
  rtpRange: [number, number];
  volatility: "low" | "medium-low" | "medium" | "medium-high" | "high";
  typicalDenomination: string;
  paylines: string;
  maxBet: string;
  bonusFeatures: string[];
  description: string;
  tip: string;
  category: "classic" | "video" | "progressive" | "megaways" | "branded";
  popularity: number;
  rtpSource: string;
}

// RTP ranges are manufacturer-stated theoretical ranges from PAR sheets and UK regulatory disclosures.
// Individual machines may be configured differently by the casino within these ranges.
export const SLOT_GAMES: SlotGame[] = [
  // ---- ARISTOCRAT ----
  {
    id: "buffalo",
    name: "Buffalo",
    manufacturer: "Aristocrat",
    rtpRange: [0.9475, 0.9530],
    volatility: "high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "1024 ways",
    maxBet: "$4.00 typical",
    bonusFeatures: ["Free Spins", "Multipliers"],
    description:
      "The granddaddy of the Aristocrat lineup. Buffalo pioneered the 1024-ways format and remains one of the most-played games on the floor due to its iconic free spin bonus with coin stacking.",
    tip: "The free spin bonus is where value is made. Bet enough that you can sustain 30–50 spins to hit the bonus — minimum bets on Buffalo often under-fund the payoff.",
    category: "video",
    popularity: 10,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "buffalo-gold",
    name: "Buffalo Gold",
    manufacturer: "Aristocrat",
    rtpRange: [0.9400, 0.9600],
    volatility: "high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "1024 ways",
    maxBet: "$4.00–$8.00 typical",
    bonusFeatures: ["Free Spins", "Gold Head Collect", "Multipliers"],
    description:
      "The evolution of the original Buffalo. Gold heads accumulate during the free spin bonus for massive multiplied payouts. Consistently among the top 10 most-played games in Nevada.",
    tip: "Collecting all buffalo gold heads (15) during free spins can yield a 300x+ multiplier. When the bonus triggers with few gold heads visible on the reels, it's often a lower-value round.",
    category: "video",
    popularity: 10,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "lightning-link",
    name: "Lightning Link",
    manufacturer: "Aristocrat",
    rtpRange: [0.8700, 0.9200],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "50 lines",
    maxBet: "$2.50–$5.00 typical",
    bonusFeatures: ["Hold & Spin", "Mini/Minor/Major/Grand Progressive"],
    description:
      "Lightning Link's Hold & Spin mechanic set the template for a generation of casino slots. Collect 6+ coin symbols to trigger the feature — then spin to fill the board for the Grand jackpot.",
    tip: "On penny denomination, you're often playing 50–100 lines. The Grand jackpot typically requires filling all 15 holds. RTP includes the jackpot contribution — if the Grand hasn't hit recently, the meter may be elevated.",
    category: "progressive",
    popularity: 9,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "dragon-link",
    name: "Dragon Link",
    manufacturer: "Aristocrat",
    rtpRange: [0.8700, 0.9200],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "50 lines",
    maxBet: "$2.50–$5.00 typical",
    bonusFeatures: ["Hold & Spin", "Mini/Minor/Major/Grand Progressive", "Prosperity Link"],
    description:
      "Aristocrat's Asian-themed spiritual successor to Lightning Link. Four variants (Golden Century, Happy & Prosperous, Autumn Moon, Pearl River) share the same jackpot network and Hold & Spin mechanic.",
    tip: "All four Dragon Link variants feed the same progressive pool in most casinos. If the Grand is elevated on one variant, it applies to all four — find the one with the lowest denominator bet to access the same jackpot.",
    category: "progressive",
    popularity: 8,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "5-dragons",
    name: "5 Dragons",
    manufacturer: "Aristocrat",
    rtpRange: [0.9490, 0.9560],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "243 ways",
    maxBet: "$3.75 typical",
    bonusFeatures: ["Free Spins", "Multipliers", "Wild Dragons"],
    description:
      "5 Dragons is one of Aristocrat's oldest still-floor titles. Its simple 243-ways format and modest multipliers make it a comfortable, mid-volatility play for sessions focused on sustainability.",
    tip: "The 5 free games with all multipliers active is a modest bonus. This game is best treated as a playtime machine — the low volatility means you'll stay alive longer, not hit big.",
    category: "video",
    popularity: 6,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "wheres-the-gold",
    name: "Where's the Gold",
    manufacturer: "Aristocrat",
    rtpRange: [0.9470, 0.9530],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "25 lines",
    maxBet: "$2.50 typical",
    bonusFeatures: ["Free Spins", "Gold Collect Feature"],
    description:
      "An Aristocrat classic still popular in Australian-themed casinos. Features a gold nugget collection mechanic during free spins and a charming mining aesthetic that resonates with regulars.",
    tip: "Collecting more gold during the bonus unlocks extra free spin rounds. Triggering with 3 picks is common — aim for sessions where you can play 200+ spins to hit the feature multiple times.",
    category: "video",
    popularity: 5,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "more-chilli",
    name: "More Chilli",
    manufacturer: "Aristocrat",
    rtpRange: [0.9475, 0.9545],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.25",
    paylines: "25 lines",
    maxBet: "$2.50 typical",
    bonusFeatures: ["Free Spins", "Wild Multipliers"],
    description:
      "More Chilli is beloved for its punchy free spin bonus with stacked wild peppers that can trigger massive line wins. A staple in both land casinos and online platforms.",
    tip: "The free spins retrigger frequently but small. The real money is when stacked wild peppers land on multiple reels simultaneously — patience through dry spins is required.",
    category: "video",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },

  // ---- IGT ----
  {
    id: "double-diamond",
    name: "Double Diamond",
    manufacturer: "IGT",
    rtpRange: [0.9500, 0.9700],
    volatility: "medium",
    typicalDenomination: "$1.00–$5.00",
    paylines: "1 line (3-reel classic)",
    maxBet: "$3.00–$15.00 typical",
    bonusFeatures: ["Wild Multiplier (2x, 4x)"],
    description:
      "IGT's timeless 3-reel classic. Double Diamond symbols act as wilds and double the pay of any winning combination they complete. A staple for players who want straightforward, no-frills action.",
    tip: "Classic 3-reel games like Double Diamond have among the best RTPs on the floor at dollar+ denominations. If you want simplicity and the best odds, these beat most video slots.",
    category: "classic",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "triple-diamond",
    name: "Triple Diamond",
    manufacturer: "IGT",
    rtpRange: [0.9500, 0.9700],
    volatility: "medium",
    typicalDenomination: "$1.00–$5.00",
    paylines: "1 line (3-reel classic)",
    maxBet: "$3.00–$15.00 typical",
    bonusFeatures: ["Wild Multiplier (3x, 9x)"],
    description:
      "The big brother to Double Diamond with a 3x multiplier. Three Triple Diamond symbols on a max-bet dollar machine can pay 1,000 credits — one of the most satisfying hits in classic slots.",
    tip: "Playing max bet is essential on Triple Diamond — the 3-credit payout table is vastly better than 1 or 2 credits. The 9x multiplier (two Triple Diamonds in the win) only applies at max bet.",
    category: "classic",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    manufacturer: "IGT",
    rtpRange: [0.9200, 0.9600],
    volatility: "medium-high",
    typicalDenomination: "$0.25–$1.00",
    paylines: "1–5 lines",
    maxBet: "$3.00 typical",
    bonusFeatures: ["Wheel Spin Bonus", "Jackpot Network"],
    description:
      "One of the most recognizable slot brands in the world. The Wheel spin bonus is triggered by lining up the wheel symbols — the wheel itself can award large multipliers or jackpot awards.",
    tip: "RTP varies significantly by the jackpot configuration. Standalone (non-linked) machines typically return more than linked progressives. The Wheel bonus wheel outcome is weighted — most stops are modest.",
    category: "branded",
    popularity: 9,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "cleopatra",
    name: "Cleopatra",
    manufacturer: "IGT",
    rtpRange: [0.9476, 0.9500],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "20 lines",
    maxBet: "$3.00 typical",
    bonusFeatures: ["Free Spins (15) with 3x Multiplier"],
    description:
      "Cleopatra is IGT's most successful video slot globally. Its 15-free-spin bonus with a 3x multiplier and Cleopatra wilds can produce big multiplied wins on a relatively modest bet.",
    tip: "The 3x multiplier applies to all wins during free spins, including Cleopatra-wild wins which pay double. A Cleopatra wild completing a line pay during free spins = 6x the base line pay.",
    category: "video",
    popularity: 8,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "texas-tea",
    name: "Texas Tea",
    manufacturer: "IGT",
    rtpRange: [0.9450, 0.9520],
    volatility: "medium",
    typicalDenomination: "$0.25–$1.00",
    paylines: "15 lines",
    maxBet: "$3.75 typical",
    bonusFeatures: ["Pick Bonus (Oil Wells)", "Free Spins"],
    description:
      "Texas Tea's iconic oil-pumping pick bonus has made it a cult favorite. The bonus presents oil wells to pick from, each revealing multiplied credits. Simple but deeply satisfying when it hits.",
    tip: "The oil pick bonus is entirely skill-free — all outcomes are predetermined when the bonus triggers. Some players believe certain wells are 'hotter' but outcomes are random.",
    category: "video",
    popularity: 6,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "lobstermania",
    name: "Lobstermania",
    manufacturer: "IGT",
    rtpRange: [0.9450, 0.9540],
    volatility: "medium",
    typicalDenomination: "$0.01–$1.00",
    paylines: "30 lines",
    maxBet: "$3.00–$6.00 typical",
    bonusFeatures: ["Lobster Pick Bonus", "Free Spins", "Buoy Bonus"],
    description:
      "Lobstermania's cheerful theme and dual bonus structure have made it a long-running IGT hit. The lobster pick bonus and buoy bonus both offer strong free credits with an unpredictable distribution.",
    tip: "The Buoy Bonus can be very large relative to bet if multiple buoys award during the feature. On lower denominations, the total bonus payout in credits can be outsized.",
    category: "video",
    popularity: 6,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "megabucks",
    name: "Megabucks",
    manufacturer: "IGT",
    rtpRange: [0.8700, 0.9000],
    volatility: "high",
    typicalDenomination: "$1.00 (3-coin max)",
    paylines: "1 line (3-reel)",
    maxBet: "$3.00",
    bonusFeatures: ["Statewide Progressive Jackpot"],
    description:
      "Megabucks is the world-record progressive, the only slot where a $3 bet has paid out over $39 million. Its RTP is low because the progressive contribution eats significantly into the return — you're buying a lottery ticket.",
    tip: "Megabucks RTP is among the lowest on the floor. Treat it as a small lottery ticket: $3 max bet, one pull, walk away. Playing extended sessions on Megabucks is the worst value in the casino.",
    category: "progressive",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },

  // ---- LIGHT & WONDER (SG) ----
  {
    id: "88-fortunes",
    name: "88 Fortunes",
    manufacturer: "Light & Wonder",
    rtpRange: [0.9300, 0.9600],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.05",
    paylines: "243 ways",
    maxBet: "$8.00 typical",
    bonusFeatures: ["Free Spins", "Mini/Minor/Major/Grand Progressive", "Wheel Bonus"],
    description:
      "88 Fortunes pioneered the linked-progressive model that Lightning Link later perfected. Its wheel bonus awards one of four progressive tiers. The feng shui theme and crimson design make it one of the most recognizable games on the floor.",
    tip: "The Grand jackpot on 88 Fortunes is awarded randomly after a wheel spin — any bet qualifies. Smaller bets still have Grand jackpot eligibility, making this one of the few games where max bet isn't strictly required.",
    category: "progressive",
    popularity: 9,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "dancing-drums",
    name: "Dancing Drums",
    manufacturer: "Light & Wonder",
    rtpRange: [0.9300, 0.9600],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "243 ways",
    maxBet: "$8.00 typical",
    bonusFeatures: ["Free Spins", "Progressive Jackpots", "Drumming Wilds"],
    description:
      "Dancing Drums is a follow-up to 88 Fortunes with added energy — drumming animations trigger random events including instant jackpot awards. A consistent top-10 floor performer.",
    tip: "The random drum feature can award any of the four jackpot levels during base game. Watching for drum symbols on screen can signal an imminent drumming wild or jackpot event.",
    category: "progressive",
    popularity: 8,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "fu-dai-lian-lian",
    name: "Fu Dai Lian Lian",
    manufacturer: "Light & Wonder",
    rtpRange: [0.9200, 0.9500],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "243 ways",
    maxBet: "$6.00 typical",
    bonusFeatures: ["Free Spins", "Expanding Wilds", "Symbol Upgrade"],
    description:
      "Fu Dai Lian Lian (Panda, Crane, Koi, Tortoise variants) brings a symbol upgrade mechanic to the Asian slot genre. During the bonus, lower-value symbols can transform into premium symbols, dramatically improving pay distribution.",
    tip: "Symbol upgrades during free spins stack — if the upgrade converts three card suits to the same premium symbol, the win can be many times the average bonus. High variance within an already volatile feature.",
    category: "video",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "quick-hit",
    name: "Quick Hit",
    manufacturer: "Light & Wonder",
    rtpRange: [0.9300, 0.9600],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "30 lines",
    maxBet: "$3.00–$5.00 typical",
    bonusFeatures: ["Quick Hit Scatter Jackpot", "Free Spins"],
    description:
      "Quick Hit's signature feature is the scatter pay — three or more Quick Hit symbols anywhere on screen pay instantly. The more scatters, the bigger the award. Multiple variants (Platinum, Ultra, Black Gold) share this core mechanic.",
    tip: "On Quick Hit, scatter symbols pay regardless of line position. Playing more lines increases your exposure to scatter pays. Max lines is strongly recommended even if you reduce credits per line.",
    category: "video",
    popularity: 8,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "monopoly",
    name: "Monopoly",
    manufacturer: "Light & Wonder",
    rtpRange: [0.9350, 0.9600],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "20–40 lines",
    maxBet: "$4.00 typical",
    bonusFeatures: ["Boardwalk Bonus", "Free Spins", "Instant Win"],
    description:
      "The Monopoly branded slot line spans multiple game variants, all featuring the iconic board game elements. The board bonus moves the player token around the Monopoly board for credit awards.",
    tip: "The board bonus can award multiple laps and Boardwalk/Park Place properties. More laps = more chances to land on higher-value squares. Short board bonuses are common but multi-lap rounds are where big pays occur.",
    category: "branded",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },

  // ---- KONAMI ----
  {
    id: "china-shores",
    name: "China Shores",
    manufacturer: "Konami",
    rtpRange: [0.9450, 0.9570],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "243 ways",
    maxBet: "$3.75 typical",
    bonusFeatures: ["Free Spins", "Stacked Wild Reels"],
    description:
      "China Shores is one of Konami's most enduring titles. Free spins feature entirely stacked wild reels that can deliver massive simultaneous wins across all 243 ways. Beloved by players who like big-hit potential on modest bets.",
    tip: "Free spins on China Shores are all-or-nothing — a single stacked wild reel converts the entire reel to wild, resulting in 243-way wins. Two stacked wild reels simultaneously is a life-changing event on any denomination.",
    category: "video",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "chili-chili-fire",
    name: "Chili Chili Fire",
    manufacturer: "Konami",
    rtpRange: [0.9300, 0.9570],
    volatility: "high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "243 ways",
    maxBet: "$4.00 typical",
    bonusFeatures: ["Free Spins", "Hold & Spin", "Stacked Pepper Wilds"],
    description:
      "Konami's answer to the Hold & Spin craze, Chili Chili Fire stacks fiery pepper wilds and links a four-tier progressive. High volatility with infrequent but explosive free spin rounds.",
    tip: "Chili Chili Fire's base game hits infrequently — budget for 100+ spins between meaningful wins at typical bet sizes. The free spins bonus with multiple stacked reels is where the game pays.",
    category: "video",
    popularity: 6,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "lotus-land",
    name: "Lotus Land",
    manufacturer: "Konami",
    rtpRange: [0.9450, 0.9550],
    volatility: "medium",
    typicalDenomination: "$0.01–$0.25",
    paylines: "30 lines",
    maxBet: "$3.00 typical",
    bonusFeatures: ["Free Spins", "Expanding Lotus Wilds"],
    description:
      "Lotus Land brings a serene aesthetic and expanding wild feature. During free spins, lotus wilds expand to cover full reels, creating multiple-reel wild combinations. A solid mid-volatility option.",
    tip: "The lotus expanding wild during free spins is more likely to be impactful when it lands on reels 2 or 3 — center-reel wilds complete more combinations than edge-reel wilds.",
    category: "video",
    popularity: 5,
    rtpSource: "Manufacturer theoretical range",
  },

  // ---- EVERI / OTHER ----
  {
    id: "blazing-7s",
    name: "Blazing 7s",
    manufacturer: "Bally (Light & Wonder)",
    rtpRange: [0.9500, 0.9700],
    volatility: "medium",
    typicalDenomination: "$0.25–$5.00",
    paylines: "1–3 lines (classic)",
    maxBet: "$3.00–$15.00 typical",
    bonusFeatures: ["Progressive Jackpot Tiers"],
    description:
      "Blazing 7s is one of the most recognized classic slot brands, with 7-symbol combinations paying progressively higher for matching 7s. The triple-blazing-7s jackpot is a floor staple on dollar and five-dollar machines.",
    tip: "Blazing 7s at $1+ denomination offers strong RTP with the simplicity of a 3-reel game. Max bet is required to qualify for the top Blazing 7s jackpot tier — never play 1 credit on these machines.",
    category: "classic",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "lock-it-link",
    name: "Lock It Link",
    manufacturer: "SG (Light & Wonder)",
    rtpRange: [0.8800, 0.9200],
    volatility: "medium-high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "40 lines",
    maxBet: "$4.00 typical",
    bonusFeatures: ["Lock It Link Hold & Spin", "Mini/Minor/Major/Grand Progressive"],
    description:
      "Lock It Link pioneered the Hold & Spin format before Lightning Link popularized it. Coin symbols lock in place for re-spins; filling the board pays the Grand jackpot. Multiple variants (Night Life, Diamonds, Cats, Hoot Loot).",
    tip: "All Lock It Link variants share a jackpot bank in most casinos. The Grand jackpot seeds at $1,000 and typically hits between $10,000–$50,000. Observe meter levels across variants before choosing your machine.",
    category: "progressive",
    popularity: 7,
    rtpSource: "Manufacturer theoretical range",
  },
  {
    id: "cash-machine",
    name: "Cash Machine",
    manufacturer: "Everi",
    rtpRange: [0.9000, 0.9400],
    volatility: "high",
    typicalDenomination: "$0.01–$0.05",
    paylines: "50 lines",
    maxBet: "$5.00 typical",
    bonusFeatures: ["Hold & Spin", "Cash Collect", "Progressive Jackpots"],
    description:
      "Cash Machine by Everi applies the Hold & Spin formula with a distinctive bill-stacking theme. Popular in regional casinos as an alternative to Aristocrat's lightning series.",
    tip: "Cash Machine has a high hit frequency for small coin collects during base game, but the Grand requires filling 15+ positions during Hold & Spin. Bank your session expectations on the Hold & Spin feature, not base game.",
    category: "progressive",
    popularity: 6,
    rtpSource: "Manufacturer theoretical range",
  },
];

// Helper: get games matching a denomination string
export function getGamesByDenomination(denomLabel: string): SlotGame[] {
  const denomValue = parseFloat(denomLabel.replace("$", ""));
  return SLOT_GAMES.filter((game) => {
    const parts = game.typicalDenomination
      .replace(/\$/g, "")
      .split("–")
      .map((s) => parseFloat(s.trim()));
    const low = parts[0];
    const high = parts.length > 1 ? parts[1] : parts[0];
    return denomValue >= low && denomValue <= high;
  }).sort((a, b) => b.popularity - a.popularity);
}

export const VOLATILITY_ORDER = {
  low: 1,
  "medium-low": 2,
  medium: 3,
  "medium-high": 4,
  high: 5,
};

export const VOLATILITY_LABELS: Record<SlotGame["volatility"], string> = {
  low: "LOW",
  "medium-low": "MED-LOW",
  medium: "MED",
  "medium-high": "MED-HIGH",
  high: "HIGH",
};

export const VOLATILITY_COLORS: Record<SlotGame["volatility"], string> = {
  low: "text-ck-good border-ck-good",
  "medium-low": "text-ck-good border-ck-good",
  medium: "text-ck-caution border-ck-caution",
  "medium-high": "text-ck-bad border-ck-bad",
  high: "text-ck-bad border-ck-bad",
};

export type SortOption = "popularity" | "rtp" | "volatility";
export type CategoryFilter = "all" | SlotGame["category"];
