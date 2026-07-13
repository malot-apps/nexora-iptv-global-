"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IPTVChannel, IPTVPlaylist, DEFAULT_CHANNELS, DEFAULT_PLAYLISTS } from "./default-playlists";
import { WorldCupMatch } from "./match-data";

interface Settings {
  theme: "gold" | "cyan" | "violet" | "emerald" | "minimal";
  autoPlay: boolean;
  lowLatency: boolean;
  streamHealthCheck: boolean;
  aspectRatio: "16:9" | "4:3" | "2.35:1" | "cover";
  parentalControlPin: string;
  pingPermission: boolean;
}

interface AppContextType {
  playlists: IPTVPlaylist[];
  channels: IPTVChannel[];
  favorites: string[];
  recentlyWatched: IPTVChannel[];
  activeChannel: IPTVChannel | null;
  activeMatch: WorldCupMatch | null;
  selectedPlaylistId: string; // "all" or playlist ID
  selectedCategory: string; // "All" or category name
  searchQuery: string;
  settings: Settings;
  isLoading: boolean;
  streamStatuses: Record<string, "live" | "offline" | "checking" | "idle">;
  
  // Actions
  addPlaylist: (name: string, type: "m3u" | "xtream", channelsParsed: IPTVChannel[]) => string;
  deletePlaylist: (playlistId: string) => void;
  toggleFavorite: (channelId: string) => void;
  addToRecentlyWatched: (channel: IPTVChannel) => void;
  setActiveChannel: (channel: IPTVChannel | null) => void;
  setActiveMatch: (match: WorldCupMatch | null) => void;
  setSelectedPlaylistId: (id: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  checkChannelStatus: (channelId: string, url: string) => Promise<void>;
  
  // Automated Playlist Engine
  automatedUrls: string[];
  addAutomatedUrl: (url: string) => Promise<void>;
  deleteAutomatedUrl: (url: string) => Promise<void>;
  refreshAutomatedPlaylists: (urls?: string[], force?: boolean) => Promise<void>;
  isRefreshingAutomated: boolean;
}

const defaultSettings: Settings = {
  theme: "minimal",
  autoPlay: true,
  lowLatency: false,
  streamHealthCheck: true,
  aspectRatio: "16:9",
  parentalControlPin: "",
  pingPermission: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<IPTVPlaylist[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_playlists");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse playlists:", e);
      }
    }
    return DEFAULT_PLAYLISTS;
  });

  const [channels, setChannels] = useState<IPTVChannel[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_channels");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse channels:", e);
      }
    }
    return DEFAULT_CHANNELS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_favorites");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
    return [];
  });

  const [recentlyWatched, setRecentlyWatched] = useState<IPTVChannel[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_recently");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse recently watched:", e);
      }
    }
    return [];
  });

  const [automatedUrls, setAutomatedUrls] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_automated_urls");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse automated URLs:", e);
      }
    }
    return [
      "https://iptv-org.github.io/iptv/categories/sports.m3u",
      "https://iptv-org.github.io/iptv/languages/ben.m3u"
    ];
  });

  const [isRefreshingAutomated, setIsRefreshingAutomated] = useState<boolean>(false);

  const [activeChannel, setActiveChannelInternal] = useState<IPTVChannel | null>(() => {
    const list = (() => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("nexora_channels");
          if (stored) return JSON.parse(stored) as IPTVChannel[];
        } catch (e) {
          console.error("Failed to parse channels for active channel:", e);
        }
      }
      return DEFAULT_CHANNELS;
    })();
    return list.find(c => c.isFeatured) || list[0] || null;
  });

  const [activeMatch, setActiveMatch] = useState<WorldCupMatch | null>(null);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexora_settings");
        if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
    return defaultSettings;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mark hydration complete on mount
  useEffect(() => {
    const handle = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(handle);
  }, []);

  // Sync state to local storage when items change
  const addPlaylist = (name: string, type: "m3u" | "xtream", channelsParsed: IPTVChannel[]): string => {
    const newPlaylistId = `playlist-${Date.now()}`;
    const newPlaylist: IPTVPlaylist = {
      id: newPlaylistId,
      name,
      type,
      channelCount: channelsParsed.length,
      importedAt: new Date().toISOString()
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    const taggedChannels = channelsParsed.map(chan => ({
      ...chan,
      playlistId: newPlaylistId
    }));
    const updatedChannels = [...channels, ...taggedChannels];

    setPlaylists(updatedPlaylists);
    setChannels(updatedChannels);

    localStorage.setItem("nexora_playlists", JSON.stringify(updatedPlaylists));
    localStorage.setItem("nexora_channels", JSON.stringify(updatedChannels));

    return newPlaylistId;
  };

  const deletePlaylist = (playlistId: string) => {
    if (playlistId === "default") return; // cannot delete default playlist

    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    const updatedChannels = channels.filter(c => c.playlistId !== playlistId);
    
    setPlaylists(updatedPlaylists);
    setChannels(updatedChannels);
    
    // Reset selection if deleted active one
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId("all");
    }

    // Reset active channel if it was in the deleted playlist
    if (activeChannel && activeChannel.playlistId === playlistId) {
      const fallback = updatedChannels.find(c => c.playlistId === "default") || updatedChannels[0] || null;
      setActiveChannelInternal(fallback);
    }

    localStorage.setItem("nexora_playlists", JSON.stringify(updatedPlaylists));
    localStorage.setItem("nexora_channels", JSON.stringify(updatedChannels));
  };

  const toggleFavorite = (channelId: string) => {
    const isFav = favorites.includes(channelId);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter(id => id !== channelId);
    } else {
      updated = [...favorites, channelId];
    }
    setFavorites(updated);
    localStorage.setItem("nexora_favorites", JSON.stringify(updated));
  };

  const addToRecentlyWatched = (channel: IPTVChannel) => {
    // Avoid double entries, bring to front, limit to 20 streams
    const filtered = recentlyWatched.filter(c => c.id !== channel.id);
    const updated = [channel, ...filtered].slice(0, 20);
    setRecentlyWatched(updated);
    localStorage.setItem("nexora_recently", JSON.stringify(updated));
  };

  const setActiveChannel = (channel: IPTVChannel | null) => {
    setActiveChannelInternal(channel);
    if (channel) {
      addToRecentlyWatched(channel);
    }
  };

  const [streamStatuses, setStreamStatuses] = useState<Record<string, "live" | "offline" | "checking" | "idle">>({});

  const checkChannelStatus = async (channelId: string, url: string) => {
    // Avoid re-triggering if already checking
    if (streamStatuses[channelId] === "checking") return;

    setStreamStatuses(prev => ({ ...prev, [channelId]: "checking" }));

    try {
      const response = await fetch("/api/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setStreamStatuses(prev => ({
        ...prev,
        [channelId]: data.live ? "live" : "offline",
      }));
    } catch (e) {
      console.error(`Failed to ping channel ${channelId}:`, e);
      setStreamStatuses(prev => ({
        ...prev,
        [channelId]: "offline",
      }));
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("nexora_settings", JSON.stringify(updated));
  };

  const refreshAutomatedPlaylists = async (urlsToFetch?: string[], force?: boolean) => {
    const urls = urlsToFetch || automatedUrls;
    if (urls.length === 0) {
      const updatedPlaylists = playlists.filter(p => p.id !== "automated");
      const updatedChannels = channels.filter(c => c.playlistId !== "automated");
      setPlaylists(updatedPlaylists);
      setChannels(updatedChannels);
      localStorage.setItem("nexora_playlists", JSON.stringify(updatedPlaylists));
      localStorage.setItem("nexora_channels", JSON.stringify(updatedChannels));
      return;
    }

    setIsRefreshingAutomated(true);
    try {
      const res = await fetch("/api/playlist/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch automated playlists");
      }

      const data = await res.json();
      const parsedChannels: IPTVChannel[] = data.channels || [];

      const updatedPlaylists = playlists.filter(p => p.id !== "automated");
      const updatedChannels = channels.filter(c => c.playlistId !== "automated");

      const automatedPlaylist: IPTVPlaylist = {
        id: "automated",
        name: "Automated Aggregated Feed",
        type: "m3u",
        channelCount: parsedChannels.length,
        importedAt: new Date().toISOString(),
      };

      const finalPlaylists = [...updatedPlaylists, automatedPlaylist];
      const finalChannels = [...updatedChannels, ...parsedChannels];

      setPlaylists(finalPlaylists);
      setChannels(finalChannels);

      localStorage.setItem("nexora_playlists", JSON.stringify(finalPlaylists));
      localStorage.setItem("nexora_channels", JSON.stringify(finalChannels));
    } catch (err) {
      console.error("Failed to refresh automated playlists:", err);
    } finally {
      setIsRefreshingAutomated(false);
    }
  };

  const addAutomatedUrl = async (url: string) => {
    if (!url || automatedUrls.includes(url)) return;
    const updated = [...automatedUrls, url];
    setAutomatedUrls(updated);
    localStorage.setItem("nexora_automated_urls", JSON.stringify(updated));
    await refreshAutomatedPlaylists(updated, true);
  };

  const deleteAutomatedUrl = async (url: string) => {
    const updated = automatedUrls.filter(u => u !== url);
    setAutomatedUrls(updated);
    localStorage.setItem("nexora_automated_urls", JSON.stringify(updated));
    await refreshAutomatedPlaylists(updated, true);
  };

  // Auto-refresh on mount
  useEffect(() => {
    const autoRefresh = () => {
      refreshAutomatedPlaylists();
    };
    // Defer slightly to not block initial render
    const timer = setTimeout(autoRefresh, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        playlists,
        channels,
        favorites,
        recentlyWatched,
        activeChannel,
        activeMatch,
        selectedPlaylistId,
        selectedCategory,
        searchQuery,
        settings,
        isLoading,
        streamStatuses,
        addPlaylist,
        deletePlaylist,
        toggleFavorite,
        addToRecentlyWatched,
        setActiveChannel,
        setActiveMatch,
        setSelectedPlaylistId,
        setSelectedCategory,
        setSearchQuery,
        updateSettings,
        checkChannelStatus,
        automatedUrls,
        addAutomatedUrl,
        deleteAutomatedUrl,
        refreshAutomatedPlaylists,
        isRefreshingAutomated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
