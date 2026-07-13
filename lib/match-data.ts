export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "penalty";
  team: "A" | "B";
  player: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
}

export interface WorldCupMatch {
  id: string;
  competition: string;
  stage: string;
  teamA: {
    name: string;
    logo: string;
    code: string;
    score: number;
    redCards: number;
    yellowCards: number;
    penalties: number;
  };
  teamB: {
    name: string;
    logo: string;
    code: string;
    score: number;
    redCards: number;
    yellowCards: number;
    penalties: number;
  };
  status: "live" | "upcoming" | "finished";
  minute?: number;
  kickoffTime: number; // UTC timestamp
  stadium: string;
  events: MatchEvent[];
  stats: MatchStats;
  highlightsUrl?: string;
}

// Generate matches dynamically relative to Date.now() so that:
// 1. There's always a Live match (started 45m ago)
// 2. There's always an upcoming match starting in 60s (to demo live transition)
// 3. There's always another upcoming match starting in 4 hours
// 4. There's always finished matches
export function getInitialMatches(): WorldCupMatch[] {
  const now = Date.now();

  return [
    {
      id: "wc-match-1",
      competition: "FIFA World Cup 2026",
      stage: "Group Stage • Group A",
      teamA: {
        name: "Argentina",
        logo: "https://flagcdn.com/w160/ar.png",
        code: "ARG",
        score: 2,
        redCards: 0,
        yellowCards: 1,
        penalties: 1
      },
      teamB: {
        name: "France",
        logo: "https://flagcdn.com/w160/fr.png",
        code: "FRA",
        score: 1,
        redCards: 0,
        yellowCards: 2,
        penalties: 0
      },
      status: "live",
      minute: 54,
      kickoffTime: now - 54 * 60 * 1000,
      stadium: "MetLife Stadium, New York/New Jersey",
      events: [
        { minute: 12, type: "goal", team: "A", player: "L. Messi (P)" },
        { minute: 28, type: "yellow", team: "B", player: "A. Tchouaméni" },
        { minute: 35, type: "goal", team: "A", player: "J. Álvarez" },
        { minute: 42, type: "yellow", team: "A", player: "R. De Paul" },
        { minute: 45, type: "goal", team: "B", player: "K. Mbappé" },
        { minute: 51, type: "yellow", team: "B", player: "T. Hernandez" }
      ],
      stats: {
        possession: [54, 46],
        shots: [11, 8],
        shotsOnTarget: [6, 3],
        fouls: [8, 11],
        corners: [4, 3]
      }
    },
    {
      id: "wc-match-2",
      competition: "FIFA World Cup 2026",
      stage: "Group Stage • Group B",
      teamA: {
        name: "Portugal",
        logo: "https://flagcdn.com/w160/pt.png",
        code: "POR",
        score: 0,
        redCards: 0,
        yellowCards: 0,
        penalties: 0
      },
      teamB: {
        name: "England",
        logo: "https://flagcdn.com/w160/gb-eng.png",
        code: "ENG",
        score: 0,
        redCards: 0,
        yellowCards: 0,
        penalties: 0
      },
      status: "upcoming",
      kickoffTime: now + 45 * 1000, // Starts in 45 seconds!
      stadium: "SoFi Stadium, Los Angeles",
      events: [],
      stats: {
        possession: [50, 50],
        shots: [0, 0],
        shotsOnTarget: [0, 0],
        fouls: [0, 0],
        corners: [0, 0]
      }
    },
    {
      id: "wc-match-3",
      competition: "FIFA World Cup 2026",
      stage: "Group Stage • Group C",
      teamA: {
        name: "Spain",
        logo: "https://flagcdn.com/w160/es.png",
        code: "ESP",
        score: 0,
        redCards: 0,
        yellowCards: 0,
        penalties: 0
      },
      teamB: {
        name: "Italy",
        logo: "https://flagcdn.com/w160/it.png",
        code: "ITA",
        score: 0,
        redCards: 0,
        yellowCards: 0,
        penalties: 0
      },
      status: "upcoming",
      kickoffTime: now + 4 * 60 * 60 * 1000, // Starts in 4 hours
      stadium: "Mercedes-Benz Stadium, Atlanta",
      events: [],
      stats: {
        possession: [50, 50],
        shots: [0, 0],
        shotsOnTarget: [0, 0],
        fouls: [0, 0],
        corners: [0, 0]
      }
    },
    {
      id: "wc-match-4",
      competition: "FIFA World Cup 2026",
      stage: "Group Stage • Group D",
      teamA: {
        name: "Morocco",
        logo: "https://flagcdn.com/w160/ma.png",
        code: "MAR",
        score: 2,
        redCards: 0,
        yellowCards: 1,
        penalties: 0
      },
      teamB: {
        name: "Croatia",
        logo: "https://flagcdn.com/w160/hr.png",
        code: "CRO",
        score: 1,
        redCards: 0,
        yellowCards: 0,
        penalties: 0
      },
      status: "finished",
      kickoffTime: now - 3 * 60 * 60 * 1000, // Started 3 hours ago
      stadium: "Hard Rock Stadium, Miami",
      events: [
        { minute: 18, type: "goal", team: "A", player: "H. Ziyech" },
        { minute: 44, type: "goal", team: "B", player: "A. Kramarić" },
        { minute: 73, type: "yellow", team: "A", player: "S. Amrabat" },
        { minute: 81, type: "goal", team: "A", player: "Y. En-Nesyri" }
      ],
      stats: {
        possession: [48, 52],
        shots: [12, 9],
        shotsOnTarget: [5, 4],
        fouls: [14, 10],
        corners: [3, 6]
      },
      highlightsUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    },
    {
      id: "wc-match-5",
      competition: "FIFA World Cup 2026",
      stage: "Group Stage • Group E",
      teamA: {
        name: "Brazil",
        logo: "https://flagcdn.com/w160/br.png",
        code: "BRA",
        score: 1,
        redCards: 0,
        yellowCards: 1,
        penalties: 0
      },
      teamB: {
        name: "Germany",
        logo: "https://flagcdn.com/w160/de.png",
        code: "GER",
        score: 3,
        redCards: 0,
        yellowCards: 2,
        penalties: 0
      },
      status: "finished",
      kickoffTime: now - 6 * 60 * 60 * 1000, // Started 6 hours ago
      stadium: "NRG Stadium, Houston",
      events: [
        { minute: 11, type: "goal", team: "B", player: "T. Müller" },
        { minute: 29, type: "goal", team: "B", player: "K. Havertz" },
        { minute: 55, type: "yellow", team: "B", player: "A. Rüdiger" },
        { minute: 67, type: "goal", team: "A", player: "Vinícius Jr." },
        { minute: 78, type: "yellow", team: "A", player: "Casemiro" },
        { minute: 85, type: "yellow", team: "B", player: "J. Kimmich" },
        { minute: 89, type: "goal", team: "B", player: "L. Sané" }
      ],
      stats: {
        possession: [56, 44],
        shots: [15, 12],
        shotsOnTarget: [5, 8],
        fouls: [9, 12],
        corners: [7, 4]
      },
      highlightsUrl: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
    }
  ];
}

import { IPTVChannel } from "./default-playlists";

export function getBroadcastChannels(match: WorldCupMatch, userChannels: IPTVChannel[]): IPTVChannel[] {
  const sportsKeywords = [
    "sport", "bein", "espn", "tsports", "t sports", "sony", "supersport", "arena", 
    "sky", "fox", "astro", "bt", "star", "ten", "willow", "fanatiz", "premier", 
    "canal", "rai", "tf1", "live", "direct", "match", "world cup", "football"
  ];

  const discoveredSportsChannels = userChannels.filter(c => {
    const name = c.name.toLowerCase();
    const cat = c.category.toLowerCase();
    return sportsKeywords.some(keyword => name.includes(keyword) || cat.includes(keyword));
  });

  let rankedChannels: IPTVChannel[] = [...discoveredSportsChannels];

  if (rankedChannels.length === 0) {
    const virtualFeeds: IPTVChannel[] = [
      {
        id: `virtual-bein-1-${match.id}`,
        name: "beIN Sports HD 1",
        logo: "https://picsum.photos/seed/bein1/200/150",
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        category: "World Cup Broadcasts",
        quality: "1080p UHD",
        language: "English",
        country: "Global",
        playlistId: "automated",
        views: 12500
      },
      {
        id: `virtual-tsports-${match.id}`,
        name: "T Sports Live HD",
        logo: "https://picsum.photos/seed/tsports/200/150",
        url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
        category: "World Cup Broadcasts",
        quality: "1080p HD",
        language: "Bengali",
        country: "Bangladesh",
        playlistId: "automated",
        views: 9400
      },
      {
        id: `virtual-sony-${match.id}`,
        name: "Sony Sports Ten 1",
        logo: "https://picsum.photos/seed/sonyten/200/150",
        url: "https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8",
        category: "World Cup Broadcasts",
        quality: "720p HD",
        language: "English • Hindi",
        country: "India",
        playlistId: "automated",
        views: 5200
      },
      {
        id: `virtual-supersport-${match.id}`,
        name: "SuperSport Grandstand 4K",
        logo: "https://picsum.photos/seed/supersport/200/150",
        url: "https://ntv1.nasatv.live/nasatv/ngasastream/playlist.m3u8",
        category: "World Cup Broadcasts",
        quality: "4K Ultra",
        language: "English",
        country: "South Africa",
        playlistId: "automated",
        views: 18900
      }
    ];
    rankedChannels = virtualFeeds;
  }

  rankedChannels.sort((a, b) => {
    const qA = a.quality?.toLowerCase() || "";
    const qB = b.quality?.toLowerCase() || "";
    if (qA.includes("4k") && !qB.includes("4k")) return -1;
    if (!qA.includes("4k") && qB.includes("4k")) return 1;
    if (qA.includes("1080") && !qB.includes("1080")) return -1;
    if (!qA.includes("1080") && qB.includes("1080")) return 1;
    return (b.views || 0) - (a.views || 0);
  });

  return rankedChannels;
}
