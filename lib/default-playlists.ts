export interface IPTVChannel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  groupTitle?: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  playlistId: string; // "default" or custom playlist id
  isFeatured?: boolean;
  quality?: string;
  language?: string;
  country?: string;
  views?: number;
  description?: string;
}

export interface IPTVPlaylist {
  id: string;
  name: string;
  url?: string;
  type: "m3u" | "xtream";
  channelCount: number;
  importedAt: string;
}

export const DEFAULT_CHANNELS: IPTVChannel[] = [
  {
    id: "nasa-public",
    name: "NASA TV Public HD",
    logo: "https://picsum.photos/seed/nasa-logo/300/200",
    url: "https://ntv1.nasatv.live/nasatv/ngasastream/playlist.m3u8",
    category: "Space & Science",
    groupTitle: "Space & Science",
    playlistId: "default",
    isFeatured: true,
    quality: "1080p",
    language: "English",
    views: 4520,
    description: "Official NASA Live Stream showing stunning live views of Earth from the ISS, astronaut missions, spacewalks, and deep space exploration programs."
  },
  {
    id: "sintel-movie",
    name: "Sintel (Open Cinematic)",
    logo: "https://picsum.photos/seed/sintel/300/200",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    category: "Cinema & Animation",
    groupTitle: "Cinema & Animation",
    playlistId: "default",
    isFeatured: true,
    quality: "4K UHD",
    language: "English",
    views: 9340,
    description: "A gorgeous, high-fidelity fantasy cinematic stream created by the Blender Foundation, showcasing breathtaking storytelling and rich orchestral arrangements."
  },
  {
    id: "big-buck-bunny",
    name: "Big Buck Bunny (Classic Movie)",
    logo: "https://picsum.photos/seed/bunny/300/200",
    url: "https://playertest.longtailvideo.com/adaptive/bbbunny/bbb.m3u8",
    category: "Cinema & Animation",
    groupTitle: "Cinema & Animation",
    playlistId: "default",
    isFeatured: false,
    quality: "1080p",
    language: "English",
    views: 12510,
    description: "The classic animation featuring a giant, friendly rabbit getting comedic revenge on three mischievous forest pests."
  },
  {
    id: "tears-of-steel",
    name: "Tears of Steel (Sci-Fi Cinema)",
    logo: "https://picsum.photos/seed/steel/300/200",
    url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    category: "Cinema & Animation",
    groupTitle: "Cinema & Animation",
    playlistId: "default",
    isFeatured: true,
    quality: "1080p",
    language: "English",
    views: 6810,
    description: "A high-concept science fiction movie tracking a group of scientists trying to prevent a futuristic AI and robotic apocalypse in Amsterdam."
  },
  {
    id: "france24-en",
    name: "France 24 Live (English)",
    logo: "https://picsum.photos/seed/f24/300/200",
    url: "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8",
    category: "News & Documentaries",
    groupTitle: "News & Documentaries",
    playlistId: "default",
    isFeatured: true,
    quality: "720p",
    language: "English",
    views: 14200,
    description: "International news channel broadcasting world news, documentaries, culture, and analysis from a French perspective."
  },
  {
    id: "dw-news-en",
    name: "DW News International",
    logo: "https://picsum.photos/seed/dwnews/300/200",
    url: "https://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8",
    category: "News & Documentaries",
    groupTitle: "News & Documentaries",
    playlistId: "default",
    isFeatured: false,
    quality: "1080p",
    language: "English",
    views: 8930,
    description: "Deutsche Welle international broadcast, covering deep global news, political analysis, scientific discoveries, and business updates."
  },
  {
    id: "lofi-music",
    name: "Lo-Fi Beats & Lounge",
    logo: "https://picsum.photos/seed/lofi/300/200",
    url: "https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8",
    category: "Chill & Lo-Fi Lounge",
    groupTitle: "Chill & Lo-Fi Lounge",
    playlistId: "default",
    isFeatured: false,
    quality: "HD",
    language: "Instrumental",
    views: 18450,
    description: "Relaxing, ambient instrumental soundtrack with calming scenic visuals of oceanic life, perfect for study, work, or pure relaxation."
  },
  {
    id: "sport-action-demo",
    name: "Adrenaline Sports Loop",
    logo: "https://picsum.photos/seed/sports/300/200",
    url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    category: "Sports & Adventure",
    groupTitle: "Sports & Adventure",
    playlistId: "default",
    isFeatured: true,
    quality: "1080p",
    language: "English",
    views: 22100,
    description: "Stunning active sports loop capturing snowboarding, paragliding, surfing, and downhill mountain biking feeds around the world."
  }
];

export const DEFAULT_PLAYLISTS: IPTVPlaylist[] = [
  {
    id: "default",
    name: "Nexora Premium Hub (Built-in)",
    type: "m3u",
    channelCount: DEFAULT_CHANNELS.length,
    importedAt: new Date("2026-01-01").toISOString()
  }
];
