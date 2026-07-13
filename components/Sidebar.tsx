"use client";

import React from "react";
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
  Grid
} from "lucide-react";

interface SidebarProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
}

export default function Sidebar({ onNavigate, currentTab }: SidebarProps) {
  const { 
    channels, 
    favorites, 
    selectedCategory, 
    setSelectedCategory, 
    settings,
    recentlyWatched 
  } = useApp();

  const theme = getThemeClasses(settings.theme);

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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "player", label: "Cinematic Player", icon: PlayCircle },
    { id: "favorites", label: "Favorites Hub", icon: Heart, badge: favorites.length },
    { id: "playlists", label: "Manage Playlists", icon: FolderLock },
    { id: "settings", label: "System Preferences", icon: SlidersHorizontal }
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-white/5 bg-[#111114] p-5 space-y-7 shrink-0 select-none">
      
      {/* Primary Navigation */}
      <div className="space-y-1.5" id="sidebar-main-menu">
        <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold mb-3">
          Console
        </p>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 group relative ${
                isActive 
                  ? `${theme.bgLight} ${theme.text} border border-white/5` 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              id={`sidebar-link-${item.id}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4.5 w-4.5 transition-colors ${
                  isActive ? theme.text : "text-zinc-500 group-hover:text-zinc-300"
                }`} />
                <span>{item.label}</span>
              </div>

              {/* Decorative side bar for active items */}
              {isActive && (
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${theme.bg}`} />
              )}

              {/* Badge Counter */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? `${theme.bg} text-black font-semibold` : "bg-zinc-800 text-zinc-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Stream Categories */}
      <div className="flex-1 flex flex-col min-h-0 space-y-2">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold">
            Categories ({uniqueCategories.length})
          </p>
          <Grid className="h-3.5 w-3.5 text-zinc-600" />
        </div>

        <div 
          className="flex-1 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800"
          id="sidebar-categories"
        >
          {/* ALL CATEGORIES */}
          <button
            onClick={() => {
              setSelectedCategory("All");
              onNavigate("dashboard");
            }}
            className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === "All"
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
          {uniqueCategories.map(cat => {
            const isSelected = selectedCategory === cat;
            
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onNavigate("dashboard");
                }}
                className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
        <div className="pt-3 border-t border-zinc-900/80 space-y-1.5">
          <div className="flex items-center space-x-1.5 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold mb-1">
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

    </aside>
  );
}
