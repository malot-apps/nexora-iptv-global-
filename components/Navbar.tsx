"use client";

import React from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { Tv, Search, Settings, Sliders, Play, Plus, Activity } from "lucide-react";

interface NavbarProps {
  onNavigate: (tab: string) => void;
  currentTab: string;
}

export default function Navbar({ onNavigate, currentTab }: NavbarProps) {
  const { 
    channels, 
    playlists, 
    searchQuery, 
    setSearchQuery, 
    settings, 
    activeChannel 
  } = useApp();
  
  const theme = getThemeClasses(settings.theme);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate("dashboard")} 
          className="flex cursor-pointer items-center space-x-2.5 transition active:scale-95"
          id="nav-logo"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Tv className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              NEX<span className={theme.text}>ORA</span>
            </span>
            <div className="flex items-center space-x-1 text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Engine</span>
            </div>
          </div>
        </div>

        {/* Global Filter & Search Bar */}
        <div className="hidden max-w-md flex-1 px-12 md:block">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search streams, movies, or channel numbers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== "dashboard") {
                  onNavigate("dashboard");
                }
              }}
              className={`block w-full rounded-full border border-white/10 bg-[#16161A] py-1.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-indigo-500/50 focus:bg-zinc-900/40 ${theme.focus} focus:ring-1`}
              id="global-search-input"
            />
          </div>
        </div>

        {/* Right Actions & Stats Info */}
        <div className="flex items-center space-x-4">
          
          {/* Active Player Status */}
          {activeChannel && (
            <div 
              onClick={() => onNavigate("player")}
              className={`hidden lg:flex items-center space-x-2 rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors duration-150`}
              id="active-player-pill"
            >
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.bg} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.bg}`}></span>
              </div>
              <span className="text-[11px] font-medium text-zinc-300 max-w-[120px] truncate">
                Now Playing: {activeChannel.name}
              </span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="hidden sm:flex items-center space-x-3.5 border-r border-white/5 pr-4 text-zinc-400">
            <div className="text-right">
              <span className="block text-[10px] font-mono leading-none text-zinc-500 uppercase tracking-wider">Streams</span>
              <span className="text-sm font-semibold text-zinc-200">{channels.length}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-mono leading-none text-zinc-500 uppercase tracking-wider">Playlists</span>
              <span className="text-sm font-semibold text-zinc-200">{playlists.length}</span>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onNavigate("playlists")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition duration-150`}
              title="Import Playlist"
              id="import-btn"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
            
            <button
              onClick={() => onNavigate("settings")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition duration-150 ${currentTab === "settings" ? `${theme.text} border-indigo-500/50 bg-white/10` : ""}`}
              title="Global Settings"
              id="settings-btn"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
