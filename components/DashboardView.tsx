"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { IPTVChannel } from "../lib/default-playlists";
import MatchCenter from "./MatchCenter";
import { 
  Play, 
  Heart, 
  Tv, 
  Search, 
  Flame, 
  Radio, 
  Sparkles, 
  Compass, 
  PlusCircle, 
  Clock 
} from "lucide-react";

interface ChannelCardProps {
  chan: IPTVChannel;
  theme: any;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  handleWatch: (chan: IPTVChannel) => void;
  streamStatuses: Record<string, "live" | "offline" | "checking" | "idle">;
  checkChannelStatus: (id: string, url: string) => Promise<void>;
  pingPermission: boolean;
}

function ChannelCard({
  chan,
  theme,
  favorites,
  toggleFavorite,
  handleWatch,
  streamStatuses,
  checkChannelStatus,
  pingPermission
}: ChannelCardProps) {
  const isFav = favorites.includes(chan.id);
  const status = streamStatuses[chan.id] || "idle";

  useEffect(() => {
    if (pingPermission && status === "idle") {
      checkChannelStatus(chan.id, chan.url);
    }
  }, [pingPermission, status, chan.id, chan.url, checkChannelStatus]);

  return (
    <div
      className="group relative bg-[#111114] border border-white/5 rounded-2xl overflow-hidden p-3 hover:border-indigo-500/50 hover:bg-[#1A1A1F] hover:scale-[1.02] transition duration-200"
      id={`channel-card-${chan.id}`}
    >
      {/* Image Wrap */}
      <div 
        onClick={() => handleWatch(chan)}
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
        {/* Glowing Streaming Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-black/60 backdrop-blur px-2 py-0.8 rounded-md border border-white/5 text-[9px] font-mono font-semibold tracking-wider text-emerald-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>ONLINE</span>
        </div>

        {/* Quality Overlay Badge */}
        <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[8px] font-mono text-zinc-300 font-bold border border-white/5">
          {chan.quality || "HD"}
        </span>

        {/* Center Play Button Hover state */}
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-250">
          <div className={`h-11 w-11 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition duration-300`}>
            <Play className="h-4.5 w-4.5 fill-current translate-x-0.2 text-white" />
          </div>
        </div>
      </div>

      {/* Info and action line */}
      <div className="flex items-start justify-between space-x-2">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleWatch(chan)}>
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

        {/* Actions (Favorites Toggle) */}
        <button
          onClick={() => toggleFavorite(chan.id)}
          className={`h-7 w-7 shrink-0 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition ${
            isFav ? "text-red-500 hover:bg-red-950/10" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current text-red-500" : ""}`} />
        </button>
      </div>

      {/* Additional metrics */}
      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600 border-t border-white/5 mt-3 pt-2.5">
        <span className="truncate max-w-[140px]" title={chan.country && chan.country !== "Global" ? `${chan.country} • ${chan.language || "Multi"}` : chan.language || "Multi"}>
          {chan.country && chan.country !== "Global" ? `${chan.country} • ${chan.language || "Multi"}` : chan.language || "Multi"}
        </span>
        <span>{(chan.views || 250).toLocaleString()} viewers</span>
      </div>
    </div>
  );
}

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const {
    channels,
    favorites,
    toggleFavorite,
    recentlyWatched,
    setActiveChannel,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    streamStatuses,
    checkChannelStatus,
    updateSettings
  } = useApp();

  const theme = getThemeClasses(settings.theme);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleTogglePingPermission = () => {
    if (!settings.pingPermission) {
      setShowConsentModal(true);
    } else {
      updateSettings({ pingPermission: false });
    }
  };

  const handleGrantPermission = () => {
    updateSettings({ pingPermission: true });
    setShowConsentModal(false);
  };

  // Filter channels based on search and selected category
  const filteredChannels = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return channels.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(q) || 
                            c.category.toLowerCase().includes(q) ||
                            (c.country && c.country.toLowerCase().includes(q)) ||
                            (c.language && c.language.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchQuery, selectedCategory]);

  // Find a highly engaging featured channel as the Hero
  const featuredChannel = React.useMemo(() => {
    return channels.find(c => c.isFeatured) || channels[0];
  }, [channels]);

  const handleWatch = (chan: IPTVChannel) => {
    setActiveChannel(chan);
    onNavigate("player");
  };

  // Interactive 3D mouse tilt states for Cinematic Hero Banner
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth 3D tilt calculation (up to 8 degrees)
    const rX = ((centerY - y) / centerY) * 8;
    const rY = ((x - centerX) / centerX) * 8;
    
    setRotateX(rX);
    setRotateY(rY);

    // Dynamic shimmer position percentage
    const pX = (x / rect.width) * 100;
    const pY = (y / rect.height) * 100;
    setGlowX(pX);
    setGlowY(pY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="space-y-8 pb-10" id="dashboard-view-wrapper">
      
      {/* 1. CINEMATIC 3D PARALLAX HERO BANNER */}
      {featuredChannel && !searchQuery && selectedCategory === "All" && (
        <section 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`,
            background: `radial-gradient(circle 500px at ${glowX}% ${glowY}%, rgba(255,255,255,0.05) 0%, rgba(17,17,20,0.9) 70%)`,
            transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), background 0.15s ease",
            willChange: "transform, background",
          }}
          className="relative rounded-3xl overflow-hidden border border-white/5 aspect-[21/9] sm:aspect-[2.35/1] flex flex-col justify-end p-6 sm:p-10 shadow-2xl group cursor-default transform-style-3d"
          id="hero-banner-section"
        >
          {/* Backdrop Image Parallax layer */}
          <div 
            className="absolute inset-0 -z-10 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              transform: `translate3d(${rotateY * -1.5}px, ${rotateX * 1.5}px, 0px) scale(1.02)`,
              willChange: "transform"
            }}
          >
            <img 
              src={featuredChannel.logo} 
              alt="" 
              className="w-full h-full object-cover opacity-35 filter brightness-[0.4]"
            />
            {/* Visual bottom-left heavy dark vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090B]/95 via-transparent to-transparent" />
          </div>

          {/* Glowing cursor flash overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-5"
            style={{
              background: `radial-gradient(circle 350px at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.04), transparent 80%)`
            }}
          />

          <div 
            className="relative max-w-2xl space-y-3.5 z-10 transition-transform duration-500 transform-style-3d"
            style={{
              transform: `translate3d(${rotateY * 0.8}px, ${rotateX * -0.8}px, 20px)`,
            }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-zinc-300 font-mono animate-pulse">
              <Sparkles className={`h-3.5 w-3.5 ${theme.text}`} />
              <span>Premium Featured Channel</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {featuredChannel.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
              {featuredChannel.description || "Stream premium global entertainment, live broadcasts, news networks, and cinematic streams natively inside Nexora."}
            </p>

            <div className="flex items-center space-x-4 pt-3 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center space-x-1.5 bg-zinc-900/60 px-2 py-1 rounded">
                <Radio className={`h-3.5 w-3.5 ${theme.text}`} />
                <span>{featuredChannel.category}</span>
              </span>
              <span>{featuredChannel.quality || "4K UHD"}</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center space-x-1">
                <Flame className="h-3.5 w-3.5 text-orange-500 animate-bounce" style={{ animationDuration: "2s" }} />
                <span>{(featuredChannel.views || 400).toLocaleString()} Active Viewers</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-5">
              <button
                onClick={() => handleWatch(featuredChannel)}
                className={`flex items-center space-x-2 py-3 px-6 sm:px-8 rounded-xl font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-100 transition active:scale-95 cursor-pointer shadow-lg shadow-black/40`}
                id="hero-watch-btn"
              >
                <Play className="h-4 w-4 fill-zinc-950" />
                <span>WATCH STREAM LIVE</span>
              </button>
              
              <button
                onClick={() => toggleFavorite(featuredChannel.id)}
                className="flex items-center justify-center p-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-red-500 hover:bg-white/10 transition active:scale-95 cursor-pointer"
                title="Save to Favorites"
              >
                <Heart className={`h-5 w-5 ${favorites.includes(featuredChannel.id) ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* NEXORA FIFA WORLD CUP MATCH CENTER */}
      {selectedCategory === "All" && !searchQuery && (
        <MatchCenter onNavigate={onNavigate} />
      )}

      {/* 2. CONTINUE WATCHING (RECENTLY WATCHED) */}
      {recentlyWatched.length > 0 && !searchQuery && (
        <section className="space-y-4" id="continue-watching-section">
          <div className="flex items-center space-x-2">
            <Clock className="h-4.5 w-4.5 text-zinc-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">Continue Watching</h2>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {recentlyWatched.map((chan, idx) => (
              <div 
                key={chan.id + idx}
                onClick={() => handleWatch(chan)}
                className="w-48 shrink-0 bg-[#111114] border border-white/5 rounded-2xl overflow-hidden p-3 cursor-pointer group hover:border-indigo-500/50 hover:bg-[#1A1A1F] transition-all duration-150 relative hover:scale-[1.02]"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 bg-zinc-900">
                  <img 
                    src={chan.logo} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(chan.name)}/200/120`;
                    }}
                  />
                  {/* Floating duration/resume handle */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-8 w-8 rounded-full bg-white/95 flex items-center justify-center">
                      <Play className="h-3.5 w-3.5 fill-black text-black translate-x-0.2" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white">{chan.name}</h4>
                <p className="text-[10px] text-zinc-500 mt-1 truncate">{chan.category}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. DYNAMIC CATEGORY PILL SELECTOR FOR TABLET & MOBILE RESPONSIVENESS */}
      <section className="md:hidden flex space-x-2 overflow-x-auto py-1 scrollbar-none" id="mobile-categories-bar">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
            selectedCategory === "All"
              ? `${theme.bg} text-zinc-950 font-bold`
              : "bg-zinc-900 text-zinc-400"
          }`}
        >
          All Streams
        </button>
        {Array.from(new Set(channels.map(c => c.category))).sort().map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
              selectedCategory === cat
                ? `${theme.bg} text-zinc-950 font-bold`
                : "bg-zinc-900 text-zinc-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 4. CHANNELS FEED GRID */}
      <section className="space-y-4" id="all-channels-section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Compass className="h-4.5 w-4.5 text-zinc-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              {selectedCategory === "All" ? "Explore Live Feeds" : selectedCategory} 
              <span className="text-xs font-mono text-zinc-500 ml-2">({filteredChannels.length})</span>
            </h2>
          </div>
          
          {/* Status Check Switch */}
          <div className="flex items-center space-x-2 bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/5 self-start sm:self-auto">
            <span className="text-xs text-zinc-400 font-medium">Real-time Stream Pings:</span>
            <button
              onClick={handleTogglePingPermission}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.pingPermission ? theme.bg : "bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.pingPermission ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-900 bg-zinc-950/20 rounded-2xl text-center p-6" id="empty-channels-state">
            <Tv className="h-12 w-12 text-zinc-800 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-400">No channels found</h3>
            <p className="text-zinc-600 text-xs mt-1 max-w-sm">
              We couldn&apos;t find any stream matching &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;. Add more playlists or clear your query parameters.
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-400 hover:text-white transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" id="channels-grid">
          {filteredChannels.map(chan => (
            <ChannelCard
              key={chan.id}
              chan={chan}
              theme={theme}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              handleWatch={handleWatch}
              streamStatuses={streamStatuses}
              checkChannelStatus={checkChannelStatus}
              pingPermission={settings.pingPermission}
            />
          ))}
        </div>
      </section>

      {/* Real-time Stream Checking Consent Dialog */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="stream-ping-consent-modal">
          <div className="bg-[#111114] border border-white/5 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-semibold text-white">Authorize Real-time Stream Status?</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enabling this feature will allow Nexora to ping the stream URLs in the background to verify whether channels are <strong>Live</strong> or <strong>Offline</strong>. 
                </p>
                <div className="text-[10.5px] text-zinc-500 leading-relaxed font-mono bg-black/30 p-2 rounded-lg border border-white/5 space-y-1">
                  <p>• Performs lightweight HTTP GET requests through a secure server proxy.</p>
                  <p>• Can be toggled off at any time using the switch or in Settings.</p>
                  <p>• Only pings streams that are currently visible on your screen.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition cursor-pointer"
              >
                No, Keep Offline
              </button>
              <button
                onClick={handleGrantPermission}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.bg} text-white hover:brightness-110 active:scale-95 transition cursor-pointer`}
              >
                Yes, Authorize Pings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
