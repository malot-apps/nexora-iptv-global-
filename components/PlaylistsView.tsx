"use client";

import React, { useState } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import PlaylistImporter from "./PlaylistImporter";
import { 
  FolderLock, 
  Trash2, 
  Calendar, 
  Tv, 
  Grid, 
  Plus, 
  Sparkles, 
  FolderLock as LibraryIcon 
} from "lucide-react";

export default function PlaylistsView() {
  const { playlists, deletePlaylist, settings } = useApp();
  const theme = getThemeClasses(settings.theme);

  const [showImporter, setShowImporter] = useState(false);

  return (
    <div className="space-y-8 pb-10" id="playlists-view-wrapper">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
            <FolderLock className={`h-6 w-6 ${theme.text}`} />
            <span>Playlist Providers Hub</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your imported M3U lists, local feeds, and Xtream panels here.
          </p>
        </div>

        <button
          onClick={() => setShowImporter(!showImporter)}
          className={`flex items-center justify-center space-x-2 py-2.5 px-5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
            showImporter 
              ? "bg-white/5 border border-white/10 text-zinc-300 hover:text-white" 
              : `${theme.bg} text-white ${theme.glow} hover:brightness-110`
          }`}
          id="toggle-importer-btn"
        >
          {showImporter ? (
            <span>Return to Playlists</span>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Import New Playlist</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Importer View */}
      {showImporter ? (
        <div className="animate-fade-in">
          <PlaylistImporter onSuccess={() => setShowImporter(false)} />
        </div>
      ) : (
        /* Playlist cards listing */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="playlists-grid">
          {playlists.map(pl => {
            const isDefault = pl.id === "default";
            
            return (
              <div
                key={pl.id}
                className="group relative bg-[#111114] border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-indigo-500/50 hover:bg-[#1A1A1F] hover:scale-[1.01] transition duration-150 flex flex-col justify-between"
                id={`playlist-card-${pl.id}`}
              >
                <div>
                  {/* Decorative badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                      isDefault 
                        ? `${theme.bgLight} ${theme.text} border border-white/5` 
                        : "bg-white/5 text-zinc-400"
                    }`}>
                      {pl.type === "xtream" ? "Xtream Codes API" : "M3U Playlist"}
                    </span>

                    {isDefault && (
                      <span className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-500">
                        <Sparkles className={`h-3 w-3 ${theme.text}`} />
                        <span>System Curated</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 group-hover:text-white truncate">
                    {pl.name}
                  </h3>

                  <div className="mt-5 space-y-2 text-xs font-mono text-zinc-500">
                    <p className="flex items-center space-x-2">
                      <Tv className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Streams: <strong className="text-zinc-300 font-semibold">{pl.channelCount} Channels</strong></span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                      <span>Imported: <span className="text-zinc-400">{new Date(pl.importedAt).toLocaleDateString()}</span></span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-600 font-mono">
                    ID: {pl.id.substring(0, 15)}...
                  </div>

                  {!isDefault ? (
                    <button
                      onClick={() => deletePlaylist(pl.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-red-950/10 hover:bg-red-950/20 text-red-500 hover:text-red-400 text-xs font-semibold transition cursor-pointer"
                      title="Delete Playlist Provider"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono italic">
                      Protected Provider
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary guidelines if playlist count is minimal */}
      {!showImporter && playlists.length === 1 && (
        <div className="rounded-2xl border border-white/5 bg-[#111114] p-5 text-center flex flex-col items-center">
          <LibraryIcon className="h-10 w-10 text-zinc-700 mb-3" />
          <h4 className="text-sm font-semibold text-zinc-300">Expand your stream channels</h4>
          <p className="text-xs text-zinc-500 mt-1 max-w-md">
            Import extra live feeds by adding your IPTV distributor&apos;s links or Xtream Codes. Rest assured your data remains saved locally on your device.
          </p>
          <button
            onClick={() => setShowImporter(true)}
            className={`mt-4 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition cursor-pointer`}
          >
            Get Started
          </button>
        </div>
      )}

    </div>
  );
}
