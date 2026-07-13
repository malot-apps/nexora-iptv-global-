"use client";

import React, { useState } from "react";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { 
  SlidersHorizontal, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Check, 
  Info, 
  AlertCircle 
} from "lucide-react";

export default function SettingsView() {
  const { settings, updateSettings } = useApp();
  const theme = getThemeClasses(settings.theme);

  // Local state for Parental PIN editing
  const [pinInput, setPinInput] = useState(settings.parentalControlPin || "");
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  const themeOptions = [
    { id: "minimal", name: "Clean Minimalism", color: "bg-indigo-600 text-white", border: "border-indigo-500/40" },
    { id: "gold", name: "Premium Gold", color: "bg-amber-500 text-black", border: "border-amber-500/40" },
    { id: "cyan", name: "Neon Cyan", color: "bg-cyan-500 text-black", border: "border-cyan-500/40" },
    { id: "violet", name: "Cosmic Violet", color: "bg-violet-500 text-white", border: "border-violet-500/40" },
    { id: "emerald", name: "Emerald Tech", color: "bg-emerald-500 text-black", border: "border-emerald-500/40" }
  ];

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length > 0 && pinInput.length < 4) {
      setPinFeedback("PIN must be at least 4 digits.");
      return;
    }
    updateSettings({ parentalControlPin: pinInput });
    setPinFeedback("Parental control PIN updated successfully.");
    setTimeout(() => setPinFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 pb-10" id="settings-view-wrapper">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
          <SlidersHorizontal className={`h-6 w-6 ${theme.text}`} />
          <span>System Preferences</span>
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Customize the Nexora stream engine performance, visual skins, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THEME & INTERFACE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* THEMES */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-zinc-500" />
              <span>UI Branding Visual Skin</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Select an accent profile to skin buttons, icons, borders, and glowing stream backdrops.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {themeOptions.map(opt => {
                const isSelected = settings.theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateSettings({ theme: opt.id as any })}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left duration-150 cursor-pointer ${
                      isSelected 
                        ? `bg-zinc-900 ${opt.border} shadow-lg` 
                        : "bg-zinc-900/30 border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`h-4 w-4 rounded-full ${opt.color} flex items-center justify-center text-[8px] font-bold`}>
                        {isSelected && "✓"}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200">{opt.name}</span>
                    </div>
                    {isSelected && (
                      <span className={`text-[10px] font-mono ${theme.text} font-bold`}>
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STREAM ENGINE SETTINGS */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-zinc-500" />
              <span>HLS Core Playback Parameters</span>
            </h3>
            
            <div className="space-y-4 pt-1">
              
              {/* Autoplay Toggle */}
              <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-900">
                <div className="space-y-1 pr-6">
                  <h4 className="text-xs font-bold text-zinc-200">Instant Stream Autoplay</h4>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    When active, streams will begin playing immediately upon channel selection without manual clicks.
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ autoPlay: !settings.autoPlay })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.autoPlay ? theme.bg : "bg-zinc-800"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoPlay ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Low Latency Mode */}
              <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-900">
                <div className="space-y-1 pr-6">
                  <h4 className="text-xs font-bold text-zinc-200">Ultra-Low Latency Mode (Sports)</h4>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Decreases internal HTML5 video buffering sizes to deliver feeds with minimal sync latency. Recommended for live sports and active events.
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ lowLatency: !settings.lowLatency })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.lowLatency ? theme.bg : "bg-zinc-800"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.lowLatency ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Live Health Check */}
              <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-900">
                <div className="space-y-1 pr-6">
                  <h4 className="text-xs font-bold text-zinc-200">Continuous Stream Connectivity Check</h4>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Background testing of feed integrity to show green &quot;ONLINE&quot; status markers in explore grids.
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ streamHealthCheck: !settings.streamHealthCheck })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    settings.streamHealthCheck ? theme.bg : "bg-zinc-800"
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.streamHealthCheck ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SECURITY PIN & SPECS */}
        <div className="space-y-6">
          
          {/* PARENTAL CONTROLS PIN */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <ShieldCheck className="h-4.5 w-4.5 text-zinc-500" />
              <span>Parental Protection Locks</span>
            </h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Establish a digits-only passcode to lock edits, stream imports, and playlist purges.
            </p>

            <form onSubmit={handleSavePin} className="space-y-3 pt-1">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="PIN (4-6 digits)"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 font-mono tracking-widest text-center"
              />
              
              <button
                type="submit"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition duration-150 ${theme.bg} text-zinc-950 cursor-pointer hover:brightness-110`}
              >
                Save Lock PIN
              </button>
            </form>

            {pinFeedback && (
              <div className="flex items-start space-x-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                <AlertCircle className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                <p>{pinFeedback}</p>
              </div>
            )}
          </div>

          {/* TECH SPECS */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <Info className="h-4.5 w-4.5 text-zinc-500" />
              <span>Device System Diagnostics</span>
            </h3>

            <div className="space-y-2.5 pt-1 text-[11px] font-mono text-zinc-500">
              <p className="flex justify-between"><span>Host Platform:</span> <span className="text-zinc-400 font-semibold">Web Container</span></p>
              <p className="flex justify-between"><span>HLS Library:</span> <span className="text-zinc-400">hls.js v1.5.0</span></p>
              <p className="flex justify-between"><span>Runtime Shell:</span> <span className="text-zinc-400">Next.js 15.4</span></p>
              <p className="flex justify-between"><span>Storage Layer:</span> <span className="text-zinc-400">localStorage</span></p>
              <p className="flex justify-between"><span>Sandbox Port:</span> <span className="text-zinc-400">3000 (Proxy)</span></p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
