"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { WorldCupMatch, MatchEvent, getInitialMatches, getBroadcastChannels } from "../lib/match-data";
import { IPTVChannel } from "../lib/default-playlists";
import { 
  Tv, 
  Search, 
  RefreshCw, 
  Play, 
  Flame, 
  Calendar, 
  Award, 
  Clock, 
  ChevronRight, 
  Filter, 
  TrendingUp, 
  BarChart2, 
  X, 
  Activity, 
  Check,
  AlertCircle
} from "lucide-react";

// Bangladesh is BDT (UTC+6). Let's write a small helper to format local kickoff time in BDT
function formatBangladeshTime(timestamp: number): string {
  // BDT is UTC+6
  const date = new Date(timestamp);
  // We can format it manually or using toLocaleString with BDT timezone
  try {
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) + " (BDT)";
  } catch (e) {
    // Fallback if timezone not supported
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const bdtDate = new Date(utc + (3600000 * 6));
    const hours = bdtDate.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const mins = String(bdtDate.getMinutes()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[bdtDate.getMonth()]} ${bdtDate.getDate()}, ${formattedHours}:${mins} ${ampm} (BDT)`;
  }
}

export default function MatchCenter({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { 
    channels, 
    setActiveChannel, 
    settings,
    activeMatch,
    setActiveMatch
  } = useApp();
  
  const theme = getThemeClasses(settings.theme);

  // Match database state
  const [matches, setMatches] = useState<WorldCupMatch[]>(() => getInitialMatches());
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Live" | "Today" | "Tomorrow" | "This Week" | "Finished">("All");
  
  // Modal states
  const [selectedStatsMatch, setSelectedStatsMatch] = useState<WorldCupMatch | null>(null);
  
  // Toast overlay state for live events (like dynamic goals!)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic simulation for real-time scores, kickoff transitions, and match minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches => {
        return prevMatches.map(match => {
          const now = Date.now();

          // 1. Handle Upcoming -> Live transition
          if (match.status === "upcoming" && now >= match.kickoffTime) {
            setToastMessage(`🚨 KICKOFF! ${match.teamA.name} vs ${match.teamB.name} is now LIVE!`);
            setTimeout(() => setToastMessage(null), 5000);
            return {
              ...match,
              status: "live",
              minute: 1,
              kickoffTime: now // reset live clock anchor
            };
          }

          // 2. Handle Live match simulation (Increment minutes & generate goals/events)
          if (match.status === "live") {
            const nextMinute = (match.minute || 1) + 1;
            
            // If match reaches 90, finish it
            if (nextMinute > 90) {
              setToastMessage(`🏁 FULL TIME! ${match.teamA.name} ${match.teamA.score} - ${match.teamB.score} ${match.teamB.name}`);
              setTimeout(() => setToastMessage(null), 5000);
              return {
                ...match,
                status: "finished",
                minute: undefined
              };
            }

            // Simulate random sports events occasionally (e.g., 5% chance every 10 seconds)
            const roll = Math.random();
            let updatedTeamA = { ...match.teamA };
            let updatedTeamB = { ...match.teamB };
            let updatedEvents = [...match.events];
            let updatedStats = { ...match.stats };

            if (roll < 0.12) {
              // 12% chance of some event
              const eventRoll = Math.random();
              const isTeamA = Math.random() > 0.5;
              const activeTeam = isTeamA ? updatedTeamA : updatedTeamB;
              const opposingTeam = isTeamA ? updatedTeamB : updatedTeamA;
              const teamKey = isTeamA ? "A" : "B";

              if (eventRoll < 0.3) {
                // Goal!
                activeTeam.score += 1;
                const scorers = isTeamA 
                  ? ["L. Messi", "L. Martinez", "R. De Paul", "A. Di Maria", "E. Fernandez"] 
                  : ["K. Mbappé", "O. Dembélé", "A. Griezmann", "M. Thuram", "K. Coman"];
                const scorer = scorers[Math.floor(Math.random() * scorers.length)];
                
                const newEvent: MatchEvent = {
                  minute: nextMinute,
                  type: "goal",
                  team: teamKey,
                  player: scorer
                };
                
                updatedEvents.unshift(newEvent);
                
                // Update stats
                updatedStats.shots[isTeamA ? 0 : 1] += 1;
                updatedStats.shotsOnTarget[isTeamA ? 0 : 1] += 1;

                setToastMessage(`⚽ GOAL! ${activeTeam.name} scores! [${updatedTeamA.score} - ${updatedTeamB.score}]`);
                setTimeout(() => setToastMessage(null), 4000);

              } else if (eventRoll < 0.7) {
                // Yellow Card
                activeTeam.yellowCards += 1;
                const defenders = isTeamA 
                  ? ["N. Otamendi", "C. Romero", "N. Tagliafico", "G. Montiel"]
                  : ["D. Upamecano", "I. Konaté", "B. Pavard", "W. Saliba"];
                const defender = defenders[Math.floor(Math.random() * defenders.length)];

                const newEvent: MatchEvent = {
                  minute: nextMinute,
                  type: "yellow",
                  team: teamKey,
                  player: defender
                };
                updatedEvents.unshift(newEvent);
                updatedStats.fouls[isTeamA ? 0 : 1] += 1;

              } else if (eventRoll < 0.85) {
                // Corners or shots
                updatedStats.corners[isTeamA ? 0 : 1] += 1;
              } else {
                // Red Card (Rare!)
                activeTeam.redCards += 1;
                const players = isTeamA ? ["M. Acuña", "L. Paredes"] : ["K. Kolo Muani", "Y. Fofana"];
                const player = players[Math.floor(Math.random() * players.length)];
                
                const newEvent: MatchEvent = {
                  minute: nextMinute,
                  type: "red",
                  team: teamKey,
                  player: player
                };
                updatedEvents.unshift(newEvent);
                updatedStats.fouls[isTeamA ? 0 : 1] += 1;

                setToastMessage(`🟥 RED CARD! ${activeTeam.name} is down to ${11 - activeTeam.redCards} men!`);
                setTimeout(() => setToastMessage(null), 4000);
              }
            }

            // Slowly jitter possession and shots stats realistically
            if (Math.random() > 0.6) {
              const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
              const newA = Math.max(30, Math.min(70, updatedStats.possession[0] + shift));
              updatedStats.possession = [newA, 100 - newA];
            }

            return {
              ...match,
              minute: nextMinute,
              teamA: updatedTeamA,
              teamB: updatedTeamB,
              events: updatedEvents,
              stats: updatedStats
            };
          }

          return match;
        });
      });
    }, 10000); // Check and simulate progress every 10 seconds for ultra-responsiveness

    return () => clearInterval(interval);
  }, []);

  // Countdown timer calculation for upcoming matches
  const [timeNow, setTimeNow] = useState(0);
  useEffect(() => {
    setTimeNow(Date.now());
    const interval = setInterval(() => setTimeNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdownString = useCallback((kickoffTime: number) => {
    if (timeNow === 0) return "--:--:--";
    const diff = kickoffTime - timeNow;
    if (diff <= 0) return "00:00:00";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${String(hours).padStart(2, "0")}h`);
    parts.push(`${String(minutes).padStart(2, "0")}m`);
    parts.push(`${String(seconds).padStart(2, "0")}s`);

    return parts.join(" ");
  }, [timeNow]);

  // AUTO PLAYLIST STREAM MATCHING & WATCH LIVE ROUTER
  const handleWatchLive = useCallback((match: WorldCupMatch) => {
    const rankedChannels = getBroadcastChannels(match, channels);
    const bestStream = rankedChannels[0];

    // Store broadcast channels for the current match in context so player can show them below
    setActiveMatch(match);
    
    // Play in player
    setActiveChannel(bestStream);
    onNavigate("player");
  }, [channels, setActiveChannel, setActiveMatch, onNavigate]);

  // Match filtering logic
  const filteredMatches = useMemo(() => {
    let list = matches;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.teamA.name.toLowerCase().includes(q) ||
        m.teamB.name.toLowerCase().includes(q) ||
        m.competition.toLowerCase().includes(q) ||
        m.stadium.toLowerCase().includes(q)
      );
    }

    // Category Tabs
    if (activeFilter === "Live") {
      list = list.filter(m => m.status === "live");
    } else if (activeFilter === "Finished") {
      list = list.filter(m => m.status === "finished");
    } else if (activeFilter === "Today") {
      // Filter matches within next 24 hours
      const now = timeNow;
      list = list.filter(m => Math.abs(m.kickoffTime - now) < 24 * 60 * 60 * 1000 && m.status !== "finished");
    } else if (activeFilter === "Tomorrow") {
      const now = timeNow;
      const tomorrowStart = now + 24 * 60 * 60 * 1000;
      list = list.filter(m => m.kickoffTime >= tomorrowStart && m.kickoffTime < tomorrowStart + 24 * 60 * 60 * 1000);
    } else if (activeFilter === "This Week") {
      const now = timeNow;
      list = list.filter(m => Math.abs(m.kickoffTime - now) < 7 * 24 * 60 * 60 * 1000);
    }

    return list;
  }, [matches, searchQuery, activeFilter, timeNow]);

  return (
    <section className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden" id="world-cup-match-center">
      {/* Dynamic Event Notification Overlay Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-zinc-900 border-2 border-indigo-500/50 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-2xl animate-bounce backdrop-blur">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-sm tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* Decorative World Cup visual glows */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/5 blur-[60px] pointer-events-none" />

      {/* Header section with Title and Automatic Counter status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-amber-500/20 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-300 w-fit">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>FIFA World Cup Qatar & America • Live Match Center</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center space-x-2.5 tracking-tight">
            <span>NEXORA WORLD CUP MATCH CENTER</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time score updates, live stats comparisons, instant stream search routing, and local Bangladesh (BDT) kickoff mappings.
          </p>
        </div>

        {/* Real-time Indicator status */}
        <div className="flex items-center space-x-3 text-xs bg-zinc-900/60 px-4 py-2.5 rounded-2xl border border-white/5 font-mono self-start md:self-auto shadow-inner">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-zinc-400 font-semibold uppercase">Auto-Refresh Active</span>
          <span className="text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">30S Interval</span>
        </div>
      </div>

      {/* MATCH CENTER SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-zinc-900/20 p-4 rounded-2xl border border-white/5">
        
        {/* Tab Filters */}
        <div className="flex space-x-1 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {(["All", "Live", "Today", "Tomorrow", "This Week", "Finished"] as const).map(filter => {
            const isActive = activeFilter === filter;
            const count = matches.filter(m => {
              if (filter === "All") return true;
              if (filter === "Live") return m.status === "live";
              if (filter === "Finished") return m.status === "finished";
              const now = timeNow;
              if (filter === "Today") return Math.abs(m.kickoffTime - now) < 24 * 60 * 60 * 1000 && m.status !== "finished";
              if (filter === "Tomorrow") return m.kickoffTime >= now + 24 * 60 * 60 * 1000 && m.kickoffTime < now + 48 * 60 * 60 * 1000;
              return Math.abs(m.kickoffTime - now) < 7 * 24 * 60 * 60 * 1000;
            }).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center space-x-1.5 ${
                  isActive 
                    ? `${theme.bg} text-zinc-950 shadow-lg font-bold` 
                    : "text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                <span>{filter}</span>
                <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.2 ${
                  isActive ? "bg-zinc-950/20 text-zinc-950" : "bg-white/5 text-zinc-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search team, country, stadium..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition"
          />
        </div>
      </div>

      {/* MATCH CARDS FEED GRID */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-3xl text-center p-6">
          <AlertCircle className="h-10 w-10 text-zinc-700 mb-3" />
          <h4 className="text-zinc-400 font-semibold text-sm">No matches found</h4>
          <p className="text-zinc-600 text-xs mt-1 max-w-xs">
            We couldn&apos;t locate any World Cup matches matching your search or filter parameters right now. Try expanding your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatches.map(match => {
            const isLive = match.status === "live";
            const isFinished = match.status === "finished";
            const isUpcoming = match.status === "upcoming";

            return (
              <div 
                key={match.id}
                className={`relative bg-[#111114] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-zinc-800 hover:scale-[1.01] ${
                  isLive 
                    ? "border-indigo-500/30 bg-[#121218] shadow-[0_0_30px_rgba(99,102,241,0.03)]" 
                    : "border-white/5"
                }`}
                id={`match-card-${match.id}`}
              >
                
                {/* Top metadata row (Competition, stage, stadium) */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-2.5 mb-3.5">
                  <span className="font-bold uppercase tracking-wider text-amber-500/90">{match.competition}</span>
                  <span className="truncate max-w-[120px]">{match.stage}</span>
                </div>

                {/* Team logos & Scores Block */}
                <div className="flex items-center justify-between space-x-2 py-2">
                  
                  {/* Team A */}
                  <div className="flex flex-col items-center space-y-2 flex-1 text-center min-w-0">
                    <div className="relative h-12 w-16 flex items-center justify-center bg-zinc-950/40 rounded-xl p-1.5 border border-white/5">
                      <img 
                        src={match.teamA.logo} 
                        alt={match.teamA.name} 
                        className="max-h-full max-w-full object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(match.teamA.name)}/80/50`;
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-300 truncate w-full" title={match.teamA.name}>
                      {match.teamA.name}
                    </span>
                    {/* Live Penalties/Cards overlay */}
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-500">
                      {match.teamA.yellowCards > 0 && <span className="bg-yellow-500 text-black px-1 rounded-sm font-black">Y:{match.teamA.yellowCards}</span>}
                      {match.teamA.redCards > 0 && <span className="bg-red-600 text-white px-1 rounded-sm font-black">R:{match.teamA.redCards}</span>}
                    </div>
                  </div>

                  {/* SCORE CENTER DISPLAY */}
                  <div className="flex flex-col items-center justify-center space-y-1 px-4">
                    {isLive && (
                      <div className="flex items-center space-x-1 bg-red-950/30 border border-red-900/40 px-2 py-0.5 rounded-md mb-1 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        <span className="text-[9px] font-mono font-bold text-red-400 uppercase">Live {match.minute}&apos;</span>
                      </div>
                    )}
                    {isFinished && (
                      <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-md uppercase mb-1">
                        Finished
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase mb-1">
                        Upcoming
                      </span>
                    )}

                    {/* Numeric Score */}
                    {isUpcoming ? (
                      <div className="text-xs font-mono font-bold text-zinc-400 text-center leading-none">
                        VS
                      </div>
                    ) : (
                      <div className="text-2xl font-black font-mono text-white flex items-center space-x-3.5 tracking-tight">
                        <span>{match.teamA.score}</span>
                        <span className="text-zinc-600 text-lg">-</span>
                        <span>{match.teamB.score}</span>
                      </div>
                    )}

                    {/* Winner crown for finished matches */}
                    {isFinished && (
                      <div className="text-[9px] font-bold text-amber-500 flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span className="truncate max-w-[80px]">
                          {match.teamA.score > match.teamB.score ? match.teamA.name : match.teamB.score > match.teamA.score ? match.teamB.name : "Draw"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center space-y-2 flex-1 text-center min-w-0">
                    <div className="relative h-12 w-16 flex items-center justify-center bg-zinc-950/40 rounded-xl p-1.5 border border-white/5">
                      <img 
                        src={match.teamB.logo} 
                        alt={match.teamB.name} 
                        className="max-h-full max-w-full object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(match.teamB.name)}/80/50`;
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-300 truncate w-full" title={match.teamB.name}>
                      {match.teamB.name}
                    </span>
                    {/* Live Penalties/Cards overlay */}
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-500">
                      {match.teamB.yellowCards > 0 && <span className="bg-yellow-500 text-black px-1 rounded-sm font-black">Y:{match.teamB.yellowCards}</span>}
                      {match.teamB.redCards > 0 && <span className="bg-red-600 text-white px-1 rounded-sm font-black">R:{match.teamB.redCards}</span>}
                    </div>
                  </div>

                </div>

                {/* Stadium details */}
                <p className="text-[10px] text-zinc-500 font-medium text-center italic mt-2 truncate w-full">
                  📍 {match.stadium}
                </p>

                {/* Bottom interactive card footer block */}
                <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col space-y-3">
                  
                  {/* BDT Kickoff Display / Countdown Display */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                    <span>Kickoff (BDT):</span>
                    <span className="text-zinc-300 font-semibold">{formatBangladeshTime(match.kickoffTime)}</span>
                  </div>

                  {/* Countdown display for Upcoming matches */}
                  {isUpcoming && (
                    <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[10px] font-sans font-medium">Starts In:</span>
                      <span className="text-amber-400 font-extrabold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                        {getCountdownString(match.kickoffTime)}
                      </span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex space-x-2">
                    {isLive && (
                      <button
                        onClick={() => handleWatchLive(match)}
                        className="w-full flex items-center justify-center space-x-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/30 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <Play className="h-4 w-4 fill-white animate-pulse" />
                        <span className="tracking-wide uppercase font-black">▶ WATCH LIVE NOW</span>
                      </button>
                    )}

                    {isFinished && (
                      <div className="flex space-x-2 w-full">
                        {match.highlightsUrl && (
                          <button
                            onClick={() => {
                              // Directly open cinematic replay
                              setActiveChannel({
                                id: `highlights-${match.id}`,
                                name: `${match.teamA.name} vs ${match.teamB.name} Highlights`,
                                logo: match.teamA.logo,
                                url: match.highlightsUrl || "",
                                category: "FIFA World Cup Highlights",
                                quality: "1080p Replay",
                                playlistId: "highlights"
                              });
                              onNavigate("player");
                            }}
                            className="flex-1 flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-zinc-300 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            <span>Highlights</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStatsMatch(match)}
                          className="flex-1 flex items-center justify-center space-x-1.5 bg-zinc-900 hover:bg-zinc-850 text-white border border-white/5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <BarChart2 className="h-4 w-4 text-zinc-400" />
                          <span>Statistics</span>
                        </button>
                      </div>
                    )}

                    {isUpcoming && (
                      <button
                        disabled
                        className="w-full bg-zinc-900/60 border border-white/5 text-zinc-600 py-2.5 rounded-xl text-xs font-semibold cursor-not-allowed flex items-center justify-center space-x-1"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Stream Pending Kickoff</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* STATS & EVENTS MODAL OVERLAY FOR FINISHED MATCHES */}
      {selectedStatsMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="stats-viewer-modal">
          <div className="bg-[#111114] border border-white/5 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal header with countries */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 shrink-0">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cinematic Match Analyzer</h3>
              </div>
              <button 
                onClick={() => setSelectedStatsMatch(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
              
              {/* Scorecard Hero Banner inside modal */}
              <div className="bg-zinc-950/60 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex flex-col items-center space-y-1.5 flex-1 text-center">
                  <img src={selectedStatsMatch.teamA.logo} alt="" className="h-8 object-contain rounded" />
                  <span className="text-xs font-black text-white">{selectedStatsMatch.teamA.name}</span>
                </div>
                <div className="text-center px-4 shrink-0">
                  <div className="text-2xl font-black font-mono text-amber-500">
                    {selectedStatsMatch.teamA.score} - {selectedStatsMatch.teamB.score}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mt-1">Full Time</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 flex-1 text-center">
                  <img src={selectedStatsMatch.teamB.logo} alt="" className="h-8 object-contain rounded" />
                  <span className="text-xs font-black text-white">{selectedStatsMatch.teamB.name}</span>
                </div>
              </div>

              {/* Match Events timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-white/5 pb-1 flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span>Match Events Timeline</span>
                </h4>
                
                {selectedStatsMatch.events.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic">No events logged during this match.</p>
                ) : (
                  <div className="space-y-2.5 font-mono text-xs">
                    {selectedStatsMatch.events.map((event, idx) => {
                      const isTeamA = event.team === "A";
                      const team = isTeamA ? selectedStatsMatch.teamA : selectedStatsMatch.teamB;
                      
                      return (
                        <div 
                          key={idx}
                          className={`flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900/40 border border-white/3 ${
                            isTeamA ? "border-l-indigo-500" : "border-r-amber-500"
                          }`}
                        >
                          <span className="text-[10px] font-extrabold text-zinc-500 shrink-0 w-8 text-center">{event.minute}&apos;</span>
                          
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {event.type === "goal" && <span className="text-emerald-400 text-sm">⚽</span>}
                            {event.type === "yellow" && <span className="bg-yellow-500 text-black px-1 rounded-[2px] text-[8px] font-black leading-none">Y</span>}
                            {event.type === "red" && <span className="bg-red-600 text-white px-1 rounded-[2px] text-[8px] font-black leading-none">R</span>}
                            
                            <span className="text-zinc-200 font-bold truncate">{event.player}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-[10px] text-zinc-500 truncate">{team.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic comparison stats block */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 tracking-wider uppercase border-b border-white/5 pb-1 flex items-center space-x-1.5">
                  <TrendingUp className="h-4 w-4 text-zinc-500" />
                  <span>Team Statistics Comparison</span>
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Possession */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">{selectedStatsMatch.stats.possession[0]}%</span>
                      <span className="text-zinc-500 uppercase tracking-widest font-sans font-semibold text-[9px]">Ball Possession</span>
                      <span className="font-bold text-amber-500">{selectedStatsMatch.stats.possession[1]}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${selectedStatsMatch.stats.possession[0]}%` }}></div>
                      <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${selectedStatsMatch.stats.possession[1]}%` }}></div>
                    </div>
                  </div>

                  {/* Shots */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">{selectedStatsMatch.stats.shots[0]}</span>
                      <span className="text-zinc-500 uppercase tracking-widest font-sans font-semibold text-[9px]">Total Shots</span>
                      <span className="font-bold text-amber-500">{selectedStatsMatch.stats.shots[1]}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(selectedStatsMatch.stats.shots[0] / (selectedStatsMatch.stats.shots[0] + selectedStatsMatch.stats.shots[1] || 1)) * 100}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${(selectedStatsMatch.stats.shots[1] / (selectedStatsMatch.stats.shots[0] + selectedStatsMatch.stats.shots[1] || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Shots on Target */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">{selectedStatsMatch.stats.shotsOnTarget[0]}</span>
                      <span className="text-zinc-500 uppercase tracking-widest font-sans font-semibold text-[9px]">Shots On Target</span>
                      <span className="font-bold text-amber-500">{selectedStatsMatch.stats.shotsOnTarget[1]}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(selectedStatsMatch.stats.shotsOnTarget[0] / (selectedStatsMatch.stats.shotsOnTarget[0] + selectedStatsMatch.stats.shotsOnTarget[1] || 1)) * 100}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${(selectedStatsMatch.stats.shotsOnTarget[1] / (selectedStatsMatch.stats.shotsOnTarget[0] + selectedStatsMatch.stats.shotsOnTarget[1] || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Corners */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">{selectedStatsMatch.stats.corners[0]}</span>
                      <span className="text-zinc-500 uppercase tracking-widest font-sans font-semibold text-[9px]">Corner Kicks</span>
                      <span className="font-bold text-amber-500">{selectedStatsMatch.stats.corners[1]}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(selectedStatsMatch.stats.corners[0] / (selectedStatsMatch.stats.corners[0] + selectedStatsMatch.stats.corners[1] || 1)) * 100}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${(selectedStatsMatch.stats.corners[1] / (selectedStatsMatch.stats.corners[0] + selectedStatsMatch.stats.corners[1] || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Fouls */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">{selectedStatsMatch.stats.fouls[0]}</span>
                      <span className="text-zinc-500 uppercase tracking-widest font-sans font-semibold text-[9px]">Fouls Committed</span>
                      <span className="font-bold text-amber-500">{selectedStatsMatch.stats.fouls[1]}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(selectedStatsMatch.stats.fouls[0] / (selectedStatsMatch.stats.fouls[0] + selectedStatsMatch.stats.fouls[1] || 1)) * 100}%` }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: `${(selectedStatsMatch.stats.fouls[1] / (selectedStatsMatch.stats.fouls[0] + selectedStatsMatch.stats.fouls[1] || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
