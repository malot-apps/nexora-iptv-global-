"use client";

import React, { useState } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { 
  LayoutDashboard, 
  PlayCircle, 
  Heart, 
  FolderLock, 
  SlidersHorizontal, 
  ListMusic, 
  Radio, 
  Tv2, 
  Bookmark, 
  History,
  Grid,
  Home,
  Trophy,
  Film,
  Newspaper,
  Search,
  CircleHelp,
  Info,
  X,
  Activity
} from "lucide-react";

interface SidebarProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
  className?: string;
}

export default function Sidebar({ onNavigate, currentTab, className = "" }: SidebarProps) {
  const { 
    channels, 
    favorites, 
    selectedCategory, 
    setSelectedCategory, 
    settings,
    recentlyWatched,
    searchQuery,
    setSearchQuery
  } = useApp();

  const theme = getThemeClasses(settings.theme);

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Compute categories and counts dynamically from channel list
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    channels.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [channels]);

  const uniqueCategories = React.useMemo(() => {
    return Object.keys(categoryCounts).sort();
  }, [categoryCounts]);

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "fifa", label: "FIFA World Cup 2026", icon: Trophy, badge: channels.filter(c => c.name.toLowerCase().includes("world cup") || c.name.toLowerCase().includes("fifa")).length || undefined },
    { id: "livetv", label: "Live TV", icon: Tv2 },
    { id: "sports", label: "Sports", icon: Activity },
    { id: "movies", label: "Movies", icon: Film },
    { id: "news", label: "News", icon: Newspaper },
    { id: "favorites", label: "Favorites", icon: Heart, badge: favorites.length || undefined },
    { id: "continue", label: "Continue Watching", icon: PlayCircle },
    { id: "history", label: "History", icon: History, badge: recentlyWatched.length || undefined },
    { id: "search", label: "Search", icon: Search },
    { id: "settings", label: "Settings", icon: SlidersHorizontal },
    { id: "help", label: "Help", icon: CircleHelp },
    { id: "about", label: "About", icon: Info }
  ];

  const getIsActive = (id: string) => {
    switch (id) {
      case "home":
        return currentTab === "dashboard" && selectedCategory === "All" && !searchQuery;
      case "fifa":
        return currentTab === "dashboard" && (searchQuery.toLowerCase().includes("world cup") || searchQuery.toLowerCase().includes("fifa"));
      case "livetv":
        return currentTab === "dashboard" && searchQuery === "Live";
      case "sports":
        return currentTab === "dashboard" && selectedCategory === "Sports & Adventure";
      case "movies":
        return currentTab === "dashboard" && selectedCategory === "Cinema & Animation";
      case "news":
        return currentTab === "dashboard" && selectedCategory === "News & Documentaries";
      case "favorites":
        return currentTab === "favorites";
      case "continue":
        return currentTab === "player" && !searchQuery;
      case "history":
        return false;
      case "settings":
        return currentTab === "settings";
      default:
        return false;
    }
  };

  const handleItemClick = (id: string) => {
    switch (id) {
      case "home":
        setSelectedCategory("All");
        setSearchQuery("");
        onNavigate("dashboard");
        break;
      case "fifa":
        setSelectedCategory("All");
        setSearchQuery("World Cup");
        onNavigate("dashboard");
        break;
      case "livetv":
        setSelectedCategory("All");
        setSearchQuery("Live");
        onNavigate("dashboard");
        break;
      case "sports":
        setSelectedCategory("Sports & Adventure");
        setSearchQuery("");
        onNavigate("dashboard");
        break;
      case "movies":
        setSelectedCategory("Cinema & Animation");
        setSearchQuery("");
        onNavigate("dashboard");
        break;
      case "news":
        setSelectedCategory("News & Documentaries");
        setSearchQuery("");
        onNavigate("dashboard");
        break;
      case "favorites":
        onNavigate("favorites");
        break;
      case "continue":
        onNavigate("player");
        break;
      case "history":
        onNavigate("player");
        break;
      case "search":
        onNavigate("dashboard");
        setTimeout(() => {
          const searchInput = document.getElementById("global-search-input") as HTMLInputElement | null;
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }, 120);
        break;
      case "settings":
        onNavigate("settings");
        break;
      case "help":
        setShowHelpModal(true);
        break;
      case "about":
        setShowAboutModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <aside className={`w-64 flex flex-col p-5 space-y-6 shrink-0 select-none overflow-y-auto scrollbar-none md:scrollbar-thin scrollbar-thumb-zinc-900 ${className}`}>
      
      {/* Primary Navigation */}
      <div className="space-y-1" id="sidebar-main-menu">
        <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold mb-2">
          Console
        </p>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = getIsActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition duration-150 group relative ${
                isActive 
                  ? `${theme.bgLight} ${theme.text} border border-white/5` 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              id={`sidebar-link-${item.id}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 transition-colors ${
                  isActive ? theme.text : "text-zinc-500 group-hover:text-zinc-300"
                }`} />
                <span>{item.label}</span>
              </div>

              {/* Decorative side bar for active items */}
              {isActive && (
                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${theme.bg}`} />
              )}

              {/* Badge Counter */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? `${theme.bg} text-black font-semibold` : "bg-zinc-850 text-zinc-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Stream Categories */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between px-3 mb-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold">
            Categories ({uniqueCategories.length})
          </p>
          <Grid className="h-3 w-3 text-zinc-600" />
        </div>

        <div 
          className="space-y-0.5"
          id="sidebar-categories"
        >
          {/* ALL CATEGORIES */}
          <button
            onClick={() => {
              setSelectedCategory("All");
              onNavigate("dashboard");
            }}
            className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === "All" && !searchQuery
                ? `bg-white/5 text-white border-l-2 border-indigo-500`
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Tv2 className="h-3.5 w-3.5 text-zinc-500" />
              <span>All Streams</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.2 rounded">
              {channels.length}
            </span>
          </button>

          {/* Dynamic ones */}
          {uniqueCategories.slice(0, 8).map(cat => {
            const isSelected = selectedCategory === cat && !searchQuery;
            
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onNavigate("dashboard");
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? `bg-white/5 text-white border-l-2 ${theme.borderActive}`
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-2.5 max-w-[170px] truncate">
                  <Radio className={`h-3.5 w-3.5 ${isSelected ? theme.text : "text-zinc-500"}`} />
                  <span className="truncate">{cat}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? `${theme.bgLight} ${theme.text}` : "text-zinc-500 bg-white/5"
                }`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Active Indicator Footer */}
      {recentlyWatched.length > 0 && (
        <div className="pt-3 border-t border-zinc-900/85 space-y-1.5">
          <div className="flex items-center space-x-1.5 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold mb-0.5">
            <History className="h-3 w-3" />
            <span>History ({recentlyWatched.length})</span>
          </div>
          <div className="space-y-1">
            {recentlyWatched.slice(0, 2).map((item, index) => (
              <div 
                key={item.id + index}
                onClick={() => {
                  setSelectedCategory("All");
                  onNavigate("player");
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-zinc-900/40 cursor-pointer transition text-zinc-400 hover:text-zinc-200"
              >
                <img 
                  src={item.logo} 
                  alt="" 
                  className="w-7 h-7 rounded bg-zinc-900 object-cover border border-zinc-800" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/100/100`;
                  }}
                />
                <div className="text-[11px] truncate flex-1 leading-tight">
                  <p className="font-medium text-zinc-300 truncate">{item.name}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" id="help-modal">
          <div className="bg-[#111114] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-3">
              <CircleHelp className={`h-6 w-6 ${theme.text}`} />
              <h3 className="text-lg font-bold text-white">Nexora Help & Support</h3>
            </div>
            <div className="space-y-3.5 text-zinc-300 text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-1">
                <p className="font-semibold text-zinc-100 font-mono text-[10px] uppercase tracking-wider">How to Add Playlists</p>
                <p>Navigate to <strong className="text-zinc-200">Manage Playlists</strong> in the menu, paste any valid M3U link or upload an M3U file, and click Add. Nexora will parse and index all channels instantly.</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-100 font-mono text-[10px] uppercase tracking-wider">Buffering or Offline Streams</p>
                <p>Nexora runs live latency and stream checking on streams. If a stream buffers or fails to play, check your connection or reload the playlist feed.</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-100 font-mono text-[10px] uppercase tracking-wider">Keyboard Shortcuts</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong className="text-zinc-200">Space</strong>: Play / Pause</li>
                  <li><strong className="text-zinc-200">F</strong>: Fullscreen</li>
                  <li><strong className="text-zinc-200">M</strong>: Mute / Unmute</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => setShowHelpModal(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition`}
            >
              Close Help Center
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" id="about-modal">
          <div className="bg-[#111114] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-3">
              <Info className={`h-6 w-6 ${theme.text}`} />
              <h3 className="text-lg font-bold text-white">About Nexora Live</h3>
            </div>
            <div className="space-y-3 text-zinc-300 text-xs leading-relaxed">
              <p>
                <strong className="text-white">Nexora</strong> is a next-generation high-fidelity IPTV aggregator and stream console crafted for seamless playback, live status checks, and playlist synchronization.
              </p>
              <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-zinc-400">
                <div>
                  <span className="block text-zinc-500">Core Version</span>
                  <span className="text-zinc-200">v2.4.0 (Stable)</span>
                </div>
                <div>
                  <span className="block text-zinc-500">Engine Build</span>
                  <span className="text-zinc-200">HLS Live Engine</span>
                </div>
                <div>
                  <span className="block text-zinc-500">UI Stack</span>
                  <span className="text-zinc-200">React + NextJS</span>
                </div>
                <div>
                  <span className="block text-zinc-500">Styling System</span>
                  <span className="text-zinc-200">Tailwind CSS</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 text-center pt-2">
                © 2026 Nexora Technologies. All rights reserved.
              </p>
            </div>
            <button 
              onClick={() => setShowAboutModal(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition`}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

    </aside>
  );
}
