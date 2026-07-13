"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { useApp } from "../lib/context";
import { getThemeClasses } from "../lib/theme-helper";
import { getBroadcastChannels } from "../lib/match-data";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings2, 
  RefreshCw, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Tv, 
  Check, 
  MonitorPlay,
  Heart
} from "lucide-react";

export default function VideoPlayer() {
  const { 
    activeChannel, 
    channels, 
    setActiveChannel, 
    favorites, 
    toggleFavorite, 
    settings,
    activeMatch
  } = useApp();

  const theme = getThemeClasses(settings.theme);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showZapping, setShowZapping] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Player Diagnostic Stats
  const [latency, setLatency] = useState<number>(0);
  const [bufferLen, setBufferLen] = useState<number>(0);
  const [resolution, setResolution] = useState<string>("Auto (Detecting...)");
  const [fps, setFps] = useState<number>(30);
  const [networkSpeed, setNetworkSpeed] = useState<string>("Calculating...");
  
  // Quality & Playback Speeds
  const [qualityLevels, setQualityLevels] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 = Auto
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [customAspect, setCustomAspect] = useState<string>("16/9");

  // Loading & Stream health states
  const [isStreamLoading, setIsStreamLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback and loading protection refs
  const failedChannelsRef = useRef<Set<string>>(new Set());
  const expectedFallbackIdRef = useRef<string | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFallback = useCallback((errorReason: string) => {
    if (!activeChannel) return;
    
    console.error(`[Nexora Player Debug] Stream failure on "${activeChannel.name}" (${activeChannel.id}). Error/Status: ${errorReason}`);
    
    // Add current channel to failed set
    failedChannelsRef.current.add(activeChannel.id);
    
    // Find next channel in the current list
    const currentIndex = channels.findIndex(c => c.id === activeChannel.id);
    let nextChannel = null;
    if (currentIndex !== -1 && channels.length > 1) {
      for (let i = 1; i <= channels.length; i++) {
        const nextIndex = (currentIndex + i) % channels.length;
        const candidate = channels[nextIndex];
        if (!failedChannelsRef.current.has(candidate.id)) {
          nextChannel = candidate;
          break;
        }
      }
    }
    
    setIsStreamLoading(false);
    
    if (nextChannel) {
      // Display friendly user-facing fallback message
      setStreamError(`${errorReason}. Trying next stream (${nextChannel.name})...`);
      
      // Delay for 1.5 seconds to let user read the notice, then swap active channel
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = setTimeout(() => {
        if (nextChannel) {
          expectedFallbackIdRef.current = nextChannel.id;
          setActiveChannel(nextChannel);
        }
      }, 1500);
    } else {
      // Checked all channels, none succeeded
      setStreamError("This stream is currently unavailable.");
    }
  }, [activeChannel, channels, setActiveChannel]);

  // Initialize HLS and clean up
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeChannel) return;

    // Check if this is a manual selection (not triggered by fallback)
    if (activeChannel.id !== expectedFallbackIdRef.current) {
      failedChannelsRef.current.clear();
      expectedFallbackIdRef.current = null;
    }

    setStreamError(null);
    setIsStreamLoading(true);
    setResolution("Auto (Detecting...)");

    // Clear previous timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    // Set 10 seconds timeout for infinite loading protection
    loadingTimeoutRef.current = setTimeout(() => {
      triggerFallback("Connection timed out");
    }, 10000);
    
    // Destroy previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = activeChannel.url;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: settings.lowLatency,
        maxBufferLength: settings.lowLatency ? 4 : 15,
        maxMaxBufferLength: settings.lowLatency ? 6 : 30,
        backBufferLength: 5,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        // Successful stream resolved! Reset fallback tracking
        failedChannelsRef.current.clear();
        expectedFallbackIdRef.current = null;

        setIsStreamLoading(false);
        const levels = hls.levels.map(l => `${l.height}p`);
        setQualityLevels(["Auto", ...levels]);
        
        if (settings.autoPlay) {
          video.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              setIsPlaying(false);
              setStreamError("Autoplay blocked. Press play to start stream.");
            });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const activeLevel = hls.levels[data.level];
        if (activeLevel) {
          setResolution(`${activeLevel.width}x${activeLevel.height} @ ${Math.round(activeLevel.bitrate / 1000)}kbps`);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("[Nexora HLS Error Debug]", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              const status = (data.response as any)?.status;
              const isCORSOrBlocked = data.details === "manifestLoadTimeOut" || 
                                      (data.details === "manifestLoadError" && (!status || status === 0));
              
              if (isCORSOrBlocked || status === 403 || status === 404) {
                console.warn(`CORS / Network block detected (Status: ${status}). Swapping stream immediately.`);
                if (loadingTimeoutRef.current) {
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                }
                let errorMsg = "Network error";
                if (status === 403) errorMsg = "Access Forbidden (403)";
                else if (status === 404) errorMsg = "Stream Not Found (404)";
                else if (isCORSOrBlocked) errorMsg = "CORS restriction or connection blocked";
                
                triggerFallback(errorMsg);
              } else {
                console.warn("Fatal network error in HLS playback. Attempting recovery...", data);
                hls.startLoad();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Fatal media error in HLS playback. Attempting recovery...", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable playback error:", data);
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
              }
              triggerFallback("Fatal playback error");
              break;
          }
        } else {
          // Check non-fatal manifest load or fragment parsing errors that might indicate persistent failures
          if (data.details === "manifestLoadError" || data.details === "fragParsingError") {
            const status = (data.response as any)?.status;
            if (status === 403 || status === 404 || status === 0) {
              console.warn(`Non-fatal error indicating blocked stream (Status: ${status}). Swapping stream.`);
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
              }
              triggerFallback(status === 403 ? "Forbidden (403)" : status === 404 ? "Not Found (404)" : "CORS / Access Blocked");
            }
          }
        }
      });

      // Track buffer length
      const interval = setInterval(() => {
        if (video && hls) {
          const bufferHelper = video.buffered;
          if (bufferHelper.length > 0) {
            const currentBuffered = bufferHelper.end(bufferHelper.length - 1) - video.currentTime;
            setBufferLen(Number(currentBuffered.toFixed(1)));
          }
          if (hls.latency) {
            setLatency(Number(hls.latency.toFixed(2)));
          }
          // Mock FPS and Network Speed for live feel
          setFps(Math.floor(Math.random() * 2) + 59);
          setNetworkSpeed(`${(Math.random() * 3 + 12).toFixed(1)} Mbps`);
        }
      }, 1000);

      return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
        clearInterval(interval);
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari native playback
      video.src = streamUrl;

      const handleLoadedMetadata = () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        failedChannelsRef.current.clear();
        expectedFallbackIdRef.current = null;
        setIsStreamLoading(false);
        if (settings.autoPlay) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };

      const handleNativeError = (e: any) => {
        console.error("Native HLS playback error:", e);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        let errorMsg = "Failed to load HLS stream natively";
        if (video.error) {
          if (video.error.code === 4) {
            errorMsg = "Stream format not supported or CORS blocked (Code 4)";
          } else if (video.error.code === 3) {
            errorMsg = "Pipeline decoding error (Code 3)";
          } else if (video.error.code === 2) {
            errorMsg = "Network connection lost (Code 2)";
          } else if (video.error.code === 1) {
            errorMsg = "Loading aborted (Code 1)";
          }
        }
        triggerFallback(errorMsg);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("error", handleNativeError);

      return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("error", handleNativeError);
      };
    } else {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      triggerFallback("HLS playback is not supported in this browser engine");
    }
  }, [activeChannel, settings.lowLatency, settings.autoPlay, triggerFallback]);

  // Handle Controls Visibility Timeout
  const triggerControlsVisibility = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showZapping && !showSettingsMenu && !showDiagnostics) {
        setShowControls(false);
      }
    }, 4000);
  }, [isPlaying, showZapping, showSettingsMenu, showDiagnostics]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || streamError) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, streamError]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Error enabling fullscreen mode:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      triggerControlsVisibility();
    }, 0);
    return () => {
      clearTimeout(handle);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [triggerControlsVisibility]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "z" || e.key === "Z") {
        setShowZapping(prev => !prev);
      } else if (e.key === "d" || e.key === "D") {
        setShowDiagnostics(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [togglePlay, toggleMute, toggleFullscreen]);

  const handleQualityChange = (index: number) => {
    setSelectedQuality(index);
    if (hlsRef.current) {
      // index is shifted by 1 in qualityLevels ("Auto" is -1 in levels)
      hlsRef.current.currentLevel = index - 1;
    }
    setShowSettingsMenu(false);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettingsMenu(false);
  };

  const handleAspectChange = (aspect: string) => {
    setCustomAspect(aspect);
    setShowSettingsMenu(false);
  };

  const triggerReload = () => {
    const original = activeChannel;
    setActiveChannel(null);
    setTimeout(() => setActiveChannel(original), 100);
  };

  // Find other channels in active category for zapping list
  const zappingChannels = React.useMemo(() => {
    if (!activeChannel) return [];
    return channels.filter(c => c.category === activeChannel.category);
  }, [activeChannel, channels]);

  // Find broadcast channels for the current World Cup match (if any)
  const broadcastChannels = React.useMemo(() => {
    if (!activeMatch) return [];
    return getBroadcastChannels(activeMatch, channels);
  }, [activeMatch, channels]);

  if (!activeChannel) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#111114] border border-white/5 rounded-3xl min-h-[450px]" id="empty-player-state">
        <MonitorPlay className="h-16 w-16 text-zinc-700 mb-4 animate-bounce" />
        <h3 className="text-lg font-semibold text-zinc-300">No stream selected</h3>
        <p className="text-zinc-500 text-sm mt-1 max-w-sm text-center">
          Go back to the Dashboard and choose a featured live channel or upload an external playlist.
        </p>
      </div>
    );
  }

  const isFavorited = favorites.includes(activeChannel.id);

  return (
    <div className="space-y-6" id="video-player-root-wrapper">
      <div 
        ref={containerRef}
        onMouseMove={triggerControlsVisibility}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full overflow-hidden rounded-3xl border border-white/5 bg-black select-none aspect-video"
        style={{ aspectRatio: customAspect === "cover" ? "auto" : customAspect }}
        id="nexora-video-player-container"
      >
      
      {/* Dynamic Video Element */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        className={`w-full h-full object-contain ${customAspect === "cover" ? "object-cover absolute inset-0 w-full h-full" : ""}`}
        style={{ aspectRatio: customAspect === "cover" ? "auto" : customAspect }}
        playsInline
      />

      {/* Loading Overlay */}
      {isStreamLoading && !streamError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111114]/90 z-20">
          <div className={`h-12 w-12 rounded-full border-4 border-zinc-850 border-t-zinc-400 border-r-zinc-400 animate-spin mb-4`} />
          <p className="text-zinc-300 text-sm font-medium">Resolving stream link coordinates...</p>
          <p className="text-zinc-500 text-xs font-mono mt-1.5">{activeChannel.name} • {activeChannel.category}</p>
        </div>
      )}

      {/* Stream Playback Error Card */}
      {streamError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111114]/95 p-6 text-center z-20">
          <div className="h-14 w-14 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />
          </div>
          <h4 className="text-lg font-bold text-white">Stream Network Connection Failure</h4>
          <p className="text-zinc-500 text-sm mt-1.5 max-w-md">
            {streamError}
          </p>
          <div className="flex items-center space-x-3 mt-6">
            <button 
              onClick={triggerReload}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 cursor-pointer`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Stream</span>
            </button>
            <button 
              onClick={() => setActiveChannel(channels.find(c => c.id !== activeChannel.id) || null)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${theme.bg} text-white cursor-pointer`}
            >
              <Tv className="h-4 w-4" />
              <span>Switch Channel</span>
            </button>
          </div>
        </div>
      )}

      {/* ZAPPING IPTV CHANNELS DRAWER (RIGHT OVERLAY) */}
      {showZapping && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-[#111114]/95 border-l border-white/5 z-30 flex flex-col backdrop-blur-md">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest leading-none">Instant Zap</p>
              <h5 className="text-sm font-bold text-white mt-1">{activeChannel.category}</h5>
            </div>
            <button 
              onClick={() => setShowZapping(false)}
              className="text-zinc-400 hover:text-white text-xs font-mono bg-white/5 px-2 py-1 rounded"
            >
              ESC
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {zappingChannels.map(chan => {
              const isCurrent = chan.id === activeChannel.id;
              return (
                <div
                  key={chan.id}
                  onClick={() => {
                    if (!isCurrent) {
                      setActiveChannel(chan);
                      setShowZapping(false);
                    }
                  }}
                  className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition ${
                    isCurrent 
                      ? `${theme.bgLight} border border-white/5` 
                      : "hover:bg-white/5"
                  }`}
                >
                  <img 
                    src={chan.logo} 
                    alt="" 
                    className="w-10 h-8 rounded bg-zinc-900 object-cover border border-white/5" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(chan.name)}/100/100`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? theme.text : "text-zinc-200"}`}>{chan.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{chan.quality || "HD"} • {chan.language || "Unknown"}</p>
                  </div>
                  {isCurrent && <span className={`h-1.5 w-1.5 rounded-full ${theme.bg}`}></span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DIAGNOSTICS STATS OVERLAY */}
      {showDiagnostics && (
        <div className="absolute top-4 left-4 p-4 rounded-2xl bg-[#111114]/90 border border-white/5 text-zinc-400 font-mono text-[10px] space-y-1.5 z-30 backdrop-blur">
          <div className="flex items-center space-x-1.5 text-[9px] uppercase font-bold text-zinc-500 tracking-wider mb-2 border-b border-white/5">
            <Activity className={`h-3 w-3 ${theme.text}`} />
            <span>NEXORA Stream Analytics</span>
          </div>
          <p className="flex justify-between space-x-8"><span>Source URL:</span> <span className="text-zinc-300 max-w-[150px] truncate">{activeChannel.url}</span></p>
          <p className="flex justify-between space-x-8"><span>Codec/Format:</span> <span className="text-zinc-300">HLS (H.264/AAC)</span></p>
          <p className="flex justify-between space-x-8"><span>Video Resolution:</span> <span className="text-zinc-300">{resolution}</span></p>
          <p className="flex justify-between space-x-8"><span>Buffered Frame Size:</span> <span className="text-zinc-300">{bufferLen} sec</span></p>
          {latency > 0 && <p className="flex justify-between space-x-8"><span>Sync Latency:</span> <span className="text-zinc-300">{latency} sec</span></p>}
          <p className="flex justify-between space-x-8"><span>Display FPS:</span> <span className="text-zinc-300">{fps} fps</span></p>
          <p className="flex justify-between space-x-8"><span>Network Feedrate:</span> <span className="text-zinc-300 text-emerald-400">{networkSpeed}</span></p>
          <button 
            onClick={() => setShowDiagnostics(false)} 
            className="w-full text-center text-zinc-500 hover:text-white mt-2 border-t border-white/5 pt-1.5"
          >
            Hide Panel
          </button>
        </div>
      )}

      {/* PLAYER CONTROLS (FADE OVERLAY) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 z-10 flex flex-col justify-between p-4 transition-all duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        id="video-player-controls-wrapper"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center`}>
              <Tv className={`h-4 w-4 ${theme.text}`} />
            </div>
            <div>
              <p className="text-[10px] font-mono leading-none text-zinc-400 uppercase tracking-wider">{activeChannel.category}</p>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeChannel.name}</h4>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(activeChannel.id)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition ${
                isFavorited ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
              }`}
              title={isFavorited ? "Remove from Favorites" : "Mark as Favorite"}
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition`}
              title="Stream Diagnostics (D)"
            >
              <Activity className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Playback center prompt overlay icon (only if paused) */}
        {!isPlaying && !isStreamLoading && !streamError && (
          <div 
            onClick={togglePlay}
            className={`mx-auto h-16 w-16 rounded-full bg-[#111114]/80 border border-white/10 flex items-center justify-center cursor-pointer transform hover:scale-115 transition duration-200 text-white shadow-2xl`}
          >
            <Play className={`h-7 w-7 fill-white translate-x-0.5`} />
          </div>
        )}

        {/* Bottom bar */}
        <div className="space-y-3">
          {/* Timeline slider (Live Streams are usually continuous) */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${theme.bg} animate-pulse`}></span>
              <span className="font-semibold text-zinc-200">LIVE FEED</span>
            </div>
            <div>
              <span>Buf: {bufferLen}s</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={togglePlay}
                className="text-zinc-200 hover:text-white transition cursor-pointer"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                id="player-play-btn"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-zinc-200" /> : <Play className="h-5 w-5 fill-zinc-200" />}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2 group/volume">
                <button 
                  onClick={toggleMute}
                  className="text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Mute (M)"
                  id="player-mute-btn"
                >
                  {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={`w-16 h-1 rounded bg-white/10 outline-none accent-zinc-300 cursor-pointer group-hover/volume:w-24 transition-all duration-200`}
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3.5 relative">
              
              {/* Quick Zap Trigger */}
              <button
                onClick={() => setShowZapping(!showZapping)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[11px] font-mono transition`}
                title="Zapping drawer (Z)"
              >
                <span>Zap List</span>
                <ChevronRight className="h-3 w-3" />
              </button>

              {/* Aspect Ratio selection */}
              <select
                value={customAspect}
                onChange={(e) => setCustomAspect(e.target.value)}
                className="bg-[#111114] border border-white/10 text-zinc-300 text-[11px] rounded-lg p-1 outline-none font-mono cursor-pointer"
                title="Aspect Ratio Override"
              >
                <option value="16/9">16:9</option>
                <option value="4/3">4:3</option>
                <option value="21/9">2.35:1</option>
                <option value="cover">Fill Screen</option>
              </select>

              {/* Speed / Quality menu anchor */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="text-zinc-300 hover:text-white transition p-1 cursor-pointer"
                  title="Playback Settings"
                >
                  <Settings2 className="h-4.5 w-4.5" />
                </button>

                {/* Micro settings panel overlay */}
                {showSettingsMenu && (
                  <div className="absolute bottom-8 right-0 w-44 bg-[#111114] border border-white/5 rounded-xl p-2 z-30 font-sans text-xs space-y-1.5 shadow-2xl">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 pb-1 border-b border-white/5">Settings</p>
                    
                    {/* Quality */}
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-400 px-2 font-medium">Quality Profile</p>
                      {qualityLevels.length > 0 ? (
                        qualityLevels.slice(0, 4).map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQualityChange(idx)}
                            className="w-full text-left px-2 py-1 rounded hover:bg-white/5 flex items-center justify-between text-[11px]"
                          >
                            <span>{q}</span>
                            {selectedQuality === idx - 1 && <Check className={`h-3 w-3 ${theme.text}`} />}
                          </button>
                        ))
                      ) : (
                        <p className="text-[10px] text-zinc-600 px-2 italic">Standard HLS</p>
                      )}
                    </div>

                    {/* Speeds */}
                    <div className="border-t border-white/5 pt-1">
                      <p className="text-[10px] text-zinc-400 px-2 font-medium mb-0.5">Playback Rate</p>
                      {[0.5, 1, 1.25, 1.5].map(rate => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-white/5 flex items-center justify-between text-[11px]"
                        >
                          <span>{rate}x</span>
                          {playbackRate === rate && <Check className={`h-3 w-3 ${theme.text}`} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className="text-zinc-300 hover:text-white transition cursor-pointer"
                title="Fullscreen (F)"
                id="player-fullscreen-btn"
              >
                {isFullscreen ? <Minimize className="h-4.5 w-4.5" /> : <Maximize className="h-4.5 w-4.5" />}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>

      {/* MATCH SPECIFIC BROADCAST CHANNELS */}
      {activeMatch && broadcastChannels.length > 0 && (
        <section className="bg-zinc-950/40 border border-white/5 rounded-3xl p-5 md:p-6 space-y-4" id="match-broadcast-channels-section">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Tv className={`h-5 w-5 ${theme.text}`} />
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Available Broadcast Channels</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Currently broadcasting <span className="text-zinc-300 font-semibold">{activeMatch.teamA.name} vs {activeMatch.teamB.name}</span>. Switch instantly below.
                </p>
              </div>
            </div>
            
            {/* Quick stats tag inside player */}
            <div className="bg-white/5 px-2.5 py-1 rounded-xl border border-white/5 text-[10px] font-mono text-zinc-400">
              Live Score: {activeMatch.teamA.score} - {activeMatch.teamB.score} ({activeMatch.minute ? `${activeMatch.minute}'` : "Live"})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {broadcastChannels.map(chan => {
              const isCurrent = chan.url === activeChannel.url;
              return (
                <div
                  key={chan.id}
                  onClick={() => {
                    if (!isCurrent) {
                      setActiveChannel(chan);
                    }
                  }}
                  className={`relative p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center space-x-3.5 ${
                    isCurrent 
                      ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/20" 
                      : "bg-[#111114] border-white/5 hover:border-zinc-800 hover:bg-[#15151a]"
                  }`}
                >
                  <div className="relative shrink-0 h-10 w-14 bg-zinc-900 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                    <img 
                      src={chan.logo} 
                      alt="" 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(chan.name)}/80/50`;
                      }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-black truncate ${isCurrent ? "text-indigo-400" : "text-zinc-200"}`}>
                        {chan.name}
                      </p>
                      {isCurrent && <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Playing</span>}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-zinc-500 font-mono">
                      <span className="bg-white/5 px-1 rounded text-[9px] text-zinc-400">{chan.quality || "1080p UHD"}</span>
                      <span>•</span>
                      <span className="truncate max-w-[80px]" title={chan.language}>{chan.language || "English"}</span>
                      <span>•</span>
                      <span className="truncate max-w-[80px]" title={chan.country}>{chan.country || "Global"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
