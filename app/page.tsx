"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AmbientParticles from "../components/AmbientParticles";

// Code splitting / Lazy loading of sub-views for high bundle optimization & Lighthouse performance
const DashboardView = dynamic(() => import("../components/DashboardView"), {
  loading: () => (
    <div className="animate-pulse h-[500px] bg-zinc-950/40 border border-white/5 rounded-3xl flex items-center justify-center">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Loading View...</span>
    </div>
  )
});

const VideoPlayer = dynamic(() => import("../components/VideoPlayer"), {
  loading: () => (
    <div className="animate-pulse h-[400px] bg-zinc-950/40 border border-white/5 rounded-3xl flex items-center justify-center">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Initializing Video Engine...</span>
    </div>
  )
});

const FavoritesView = dynamic(() => import("../components/FavoritesView"), {
  loading: () => (
    <div className="animate-pulse h-[400px] bg-zinc-950/40 border border-white/5 rounded-3xl flex items-center justify-center">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Fetching Bookmarks...</span>
    </div>
  )
});

const PlaylistsView = dynamic(() => import("../components/PlaylistsView"), {
  loading: () => (
    <div className="animate-pulse h-[400px] bg-zinc-950/40 border border-white/5 rounded-3xl flex items-center justify-center">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Loading Playlist Manager...</span>
    </div>
  )
});

const SettingsView = dynamic(() => import("../components/SettingsView"), {
  loading: () => (
    <div className="animate-pulse h-[400px] bg-zinc-950/40 border border-white/5 rounded-3xl flex items-center justify-center">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Opening Preferences...</span>
    </div>
  )
});

import { 
  Menu, 
  X, 
  Tv, 
  SlidersHorizontal, 
  FolderLock, 
  Heart, 
  LayoutDashboard,
  PlayCircle
} from "lucide-react";

export default function Home() {
  const { isLoading, settings } = useApp();
  const theme = getThemeClasses(settings.theme);

  // Tab navigation: "dashboard" | "player" | "favorites" | "playlists" | "settings"
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false); // Close mobile drawer if open
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 font-sans relative overflow-hidden" id="app-loading-state">
        {/* Decorative subtle ambient lights */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] animate-aurora" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] animate-aurora" />
        
        {/* Holographic 3D Concentric Ring Loader */}
        <div className="relative flex h-48 w-48 items-center justify-center perspective-1000 transform-style-3d">
          
          {/* Outer Spin Ring */}
          <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-spin-slow" />
          
          {/* Rotating 3D Ring 1 */}
          <div 
            className={`absolute h-40 w-40 border-t-2 border-b-2 ${theme.text} border-l-2 border-r-transparent rounded-full animate-spin`}
            style={{ 
              transform: "rotateX(60deg) rotateY(20deg) rotateZ(0deg)", 
              animationDuration: "2s" 
            }}
          />
          
          {/* Rotating 3D Counter-Ring 2 */}
          <div 
            className="absolute h-32 w-32 border-l-2 border-r-2 border-white/25 border-t-2 border-b-transparent rounded-full animate-spin"
            style={{ 
              transform: "rotateX(25deg) rotateY(-50deg) rotateZ(0deg)", 
              animationDuration: "1.5s",
              animationDirection: "reverse"
            }}
          />

          {/* Core Central Glow Orb with Logo */}
          <div className="relative h-20 w-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] z-10 animate-float">
            <Tv className={`h-8 w-8 ${theme.text} animate-pulse`} />
            <div className={`absolute inset-0 rounded-full ${theme.bgLight} blur-md -z-10 animate-glow-pulse`} />
          </div>
        </div>

        <div className="z-10 text-center space-y-2 mt-6">
          <h2 className="text-white text-md font-black tracking-widest uppercase">NEXORA CORE ENGINE</h2>
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">Hydrating playlist stores...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-slate-200 font-sans selection:bg-indigo-600/20 selection:text-indigo-200 relative overflow-hidden">
      
      {/* Cinematic Ambient Drifting Lights */}
      <div className="absolute top-[-10%] left-[-10%] h-[45vw] w-[45vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-aurora -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-aurora -z-10" style={{ animationDelay: "-8s" }} />
      <div className="absolute top-[40%] left-[50%] h-[35vw] w-[35vw] rounded-full bg-purple-500/3 blur-[140px] pointer-events-none animate-aurora -z-10" style={{ animationDelay: "-16s" }} />

      {/* GPU-Accelerated Fluid Particle Engine */}
      <AmbientParticles accentColor={theme.accentColor} count={35} />

      {/* Dynamic Top Header */}
      <Navbar onNavigate={handleNavigate} currentTab={currentTab} />

      {/* Main Core Viewport layout */}
      <div className="flex flex-1 relative max-w-7xl w-full mx-auto">
        
        {/* Left Side Navigation (Desktop Only) */}
        <Sidebar onNavigate={handleNavigate} currentTab={currentTab} />

        {/* Right Main Content Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-zinc-900">
          
          {/* MOBILE NAVIGATION TRIGGERS */}
          <div className="md:hidden flex items-center justify-between mb-5 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-3.5" id="mobile-controls-bar">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center space-x-2 text-zinc-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs font-semibold">Categories & Menu</span>
            </button>
            
            <div className="flex items-center space-x-1">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "Home" },
                { id: "player", icon: PlayCircle, label: "Player" },
                { id: "favorites", icon: Heart, label: "Favs" },
                { id: "playlists", icon: FolderLock, label: "Lists" },
                { id: "settings", icon: SlidersHorizontal, label: "Config" }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={`p-2 rounded-xl border transition ${
                      isSelected 
                        ? `${theme.bgLight} ${theme.text} border-zinc-800` 
                        : "border-transparent text-zinc-500"
                    }`}
                    title={tab.label}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE VIEW TAB DISPATCHER */}
          <div id="view-dispatcher-container">
            {currentTab === "dashboard" && <DashboardView onNavigate={handleNavigate} />}
            {currentTab === "player" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
                    <PlayCircle className={`h-6 w-6 ${theme.text}`} />
                    <span>Cinematic Player Suite</span>
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Lossless live stream aggregation, buffering analytics, and customizable aspect controls.
                  </p>
                </div>
                <VideoPlayer />
              </div>
            )}
            {currentTab === "favorites" && <FavoritesView onNavigate={handleNavigate} />}
            {currentTab === "playlists" && <PlaylistsView />}
            {currentTab === "settings" && <SettingsView />}
          </div>

        </main>
      </div>

      {/* MOBILE FLOATING SLIDE-OUT DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mobile-sidebar-drawer">
          {/* Blackout click backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />
          
          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-col bg-zinc-950 border-r border-zinc-900 p-6 shadow-2xl h-full animate-slide-in">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
              <span className="text-lg font-extrabold text-white">NEX<span className={theme.text}>ORA</span></span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Inline Sidebar navigation for mobile scroll */}
            <div className="flex-1 overflow-y-auto pr-1">
              <Sidebar onNavigate={handleNavigate} currentTab={currentTab} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
