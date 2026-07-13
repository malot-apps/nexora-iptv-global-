"use client";

import React, { useEffect } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { Heart, Play, Trash2, Tv } from "lucide-react";
import { IPTVChannel } from "../lib/default-playlists";

interface FavoriteChannelCardProps {
  chan: IPTVChannel;
  theme: any;
  toggleFavorite: (id: string) => void;
  handlePlay: (chan: IPTVChannel) => void;
  streamStatuses: Record<string, "live" | "offline" | "checking" | "idle">;
  checkChannelStatus: (id: string, url: string) => Promise<void>;
  pingPermission: boolean;
}

function FavoriteChannelCard({
  chan,
  theme,
  toggleFavorite,
  handlePlay,
  streamStatuses,
  checkChannelStatus,
  pingPermission
}: FavoriteChannelCardProps) {
  const status = streamStatuses[chan.id] || "idle";

  useEffect(() => {
    if (pingPermission && status === "idle") {
      checkChannelStatus(chan.id, chan.url);
    }
  }, [pingPermission, status, chan.id, chan.url, checkChannelStatus]);

  return (
    <div
      className="group relative bg-[#111114] border border-white/5 rounded-2xl overflow-hidden p-3 hover:border-indigo-500/50 hover:bg-[#1A1A1F] hover:scale-[1.02] transition duration-200"
      id={`favorite-card-${chan.id}`}
    >
      {/* Image Wrap */}
      <div 
        onClick={() => handlePlay(chan)}
        className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-900 cursor-pointer"
      >
        <img 
          src={chan.logo} 
          alt="" 
          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(chan.name)}/320/180`;
          }}
        />
        
        {/* Overlay details */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-black/60 backdrop-blur px-2 py-0.8 rounded-md border border-white/5 text-[9px] font-mono font-semibold text-emerald-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE</span>
        </div>

        <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
          <div className={`h-11 w-11 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-lg transform translate-y-1 group-hover:translate-y-0 transition duration-200`}>
            <Play className="h-4.5 w-4.5 fill-current translate-x-0.2 text-white" />
          </div>
        </div>
      </div>

      {/* Title and Action */}
      <div className="flex items-start justify-between space-x-2">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handlePlay(chan)}>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center space-x-1.5 min-w-0">
              <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                {chan.name}
              </h3>
              {pingPermission && (
                <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase shrink-0 ${
                  status === "live"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : status === "offline"
                      ? "bg-red-500/15 text-red-400 border border-red-500/20"
                      : status === "checking"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse"
                        : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                }`}>
                  {status === "live" ? "Live" : status === "offline" ? "Offline" : status === "checking" ? "Checking" : "Pending"}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-medium truncate">
              {chan.category}
            </p>
          </div>
        </div>

        {/* Remove from favorites action */}
        <button
          onClick={() => toggleFavorite(chan.id)}
          className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-red-500 hover:text-red-400 transition"
          title="Remove from bookmarks"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>

      {/* Specs info */}
      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600 border-t border-white/5 mt-3 pt-2.5">
        <span>{chan.quality || "HD"}</span>
        <span>{(chan.views || 240).toLocaleString()} viewers</span>
      </div>
    </div>
  );
}

interface FavoritesViewProps {
  onNavigate: (tab: string) => void;
}

export default function FavoritesView({ onNavigate }: FavoritesViewProps) {
  const { 
    channels, 
    favorites, 
    toggleFavorite, 
    setActiveChannel, 
    settings,
    streamStatuses,
    checkChannelStatus 
  } = useApp();
  const theme = getThemeClasses(settings.theme);

  const favoritedChannels = React.useMemo(() => {
    return channels.filter(c => favorites.includes(c.id));
  }, [channels, favorites]);

  const handlePlay = (chan: any) => {
    setActiveChannel(chan);
    onNavigate("player");
  };

  return (
    <div className="space-y-8 pb-10" id="favorites-view-wrapper">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
          <Heart className={`h-6 w-6 text-red-500 fill-current`} />
          <span>My Favorites Hub</span>
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Instant access to your bookmarked live channels and entertainment.
        </p>
      </div>

      {/* Empty State */}
      {favoritedChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#111114] rounded-2xl text-center p-6" id="empty-favorites-state">
          <Heart className="h-14 w-14 text-zinc-800 mb-4" />
          <h3 className="text-sm font-semibold text-zinc-400">Your Bookmarks are Empty</h3>
          <p className="text-zinc-600 text-xs mt-1 max-w-sm leading-relaxed">
            Mark your top channels with the heart icon while exploring the dashboard to list them in this quick access room.
          </p>
          <button
            onClick={() => onNavigate("dashboard")}
            className={`mt-6 px-5 py-2.5 rounded-xl text-xs font-bold ${theme.bg} text-white hover:brightness-110 active:scale-95 transition cursor-pointer`}
          >
            Go Explore Channels
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" id="favorites-grid">
          {favoritedChannels.map(chan => (
            <FavoriteChannelCard
              key={chan.id}
              chan={chan}
              theme={theme}
              toggleFavorite={toggleFavorite}
              handlePlay={handlePlay}
              streamStatuses={streamStatuses}
              checkChannelStatus={checkChannelStatus}
              pingPermission={settings.pingPermission}
            />
          ))}
        </div>
      )}

    </div>
  );
}
