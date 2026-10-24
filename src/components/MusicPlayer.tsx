"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music, ChevronUp, ChevronDown } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist?: string;
  category: "CLASSIC" | "INSTRUMENTAL" | "PEACEFUL" | "FESTIVE" | "CUSTOM";
  source: "BUILTIN" | "UPLOADED";
  filePath?: string;
  melodyNotes?: { note: number; duration: number }[]; // For Web Audio synth
  sortOrder?: number;
}

// Built-in synthesized festive melodies (frequencies in Hz and durations in beats)
// 100% royalty-free public domain compositions
const JINGLE_BELLS_MELODY = [
  { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.5 },
  { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.5 },
  { note: 329.63, duration: 0.25 }, { note: 392.00, duration: 0.25 }, { note: 261.63, duration: 0.35 }, { note: 293.66, duration: 0.15 },
  { note: 329.63, duration: 1.0 },
  { note: 349.23, duration: 0.25 }, { note: 349.23, duration: 0.25 }, { note: 349.23, duration: 0.35 }, { note: 349.23, duration: 0.15 },
  { note: 349.23, duration: 0.25 }, { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.25 }, { note: 329.63, duration: 0.25 },
  { note: 392.00, duration: 0.25 }, { note: 392.00, duration: 0.25 }, { note: 349.23, duration: 0.25 }, { note: 293.66, duration: 0.25 },
  { note: 261.63, duration: 1.0 },
];

const SILENT_NIGHT_MELODY = [
  { note: 392.00, duration: 0.75 }, { note: 440.00, duration: 0.25 }, { note: 392.00, duration: 0.5 },
  { note: 329.63, duration: 1.5 },
  { note: 392.00, duration: 0.75 }, { note: 440.00, duration: 0.25 }, { note: 392.00, duration: 0.5 },
  { note: 329.63, duration: 1.5 },
  { note: 587.33, duration: 1.0 }, { note: 587.33, duration: 0.5 },
  { note: 493.88, duration: 1.5 },
  { note: 523.25, duration: 1.0 }, { note: 523.25, duration: 0.5 },
  { note: 392.00, duration: 1.5 },
];

const WE_WISH_YOU_MELODY = [
  { note: 261.63, duration: 0.5 },
  { note: 349.23, duration: 0.5 }, { note: 349.23, duration: 0.25 }, { note: 392.00, duration: 0.25 }, { note: 349.23, duration: 0.25 }, { note: 329.63, duration: 0.25 },
  { note: 293.66, duration: 0.5 }, { note: 293.66, duration: 0.5 }, { note: 293.66, duration: 0.5 },
  { note: 392.00, duration: 0.5 }, { note: 392.00, duration: 0.25 }, { note: 440.00, duration: 0.25 }, { note: 392.00, duration: 0.25 }, { note: 349.23, duration: 0.25 },
  { note: 329.63, duration: 0.5 }, { note: 261.63, duration: 0.5 }, { note: 261.63, duration: 0.5 },
  { note: 440.00, duration: 0.5 }, { note: 440.00, duration: 0.25 }, { note: 493.88, duration: 0.25 }, { note: 440.00, duration: 0.25 }, { note: 392.00, duration: 0.25 },
  { note: 349.23, duration: 0.5 }, { note: 293.66, duration: 0.5 }, { note: 261.63, duration: 0.25 }, { note: 261.63, duration: 0.25 },
  { note: 293.66, duration: 0.5 }, { note: 392.00, duration: 0.5 }, { note: 329.63, duration: 0.5 },
  { note: 349.23, duration: 1.0 },
];

const BUILTIN_TRACKS: Track[] = [
  {
    id: "builtin-1",
    title: "Jingle Bells (Chimes)",
    artist: "Traditional Carols",
    category: "CLASSIC",
    source: "BUILTIN",
    melodyNotes: JINGLE_BELLS_MELODY,
  },
  {
    id: "builtin-2",
    title: "Silent Night (Music Box)",
    artist: "Peaceful Carols",
    category: "PEACEFUL",
    source: "BUILTIN",
    melodyNotes: SILENT_NIGHT_MELODY,
  },
  {
    id: "builtin-3",
    title: "We Wish You a Merry Christmas",
    artist: "Holiday Brass",
    category: "FESTIVE",
    source: "BUILTIN",
    melodyNotes: WE_WISH_YOU_MELODY,
  },
];

export function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>(BUILTIN_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const isPlayingSynthRef = useRef(false);
  const hasStartedPlayingRef = useRef(false);

  // References for autoplay on first interaction
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const currentTrackIndexRef = useRef(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Stop synthetic audio playback
  const stopSynth = useCallback(() => {
    isPlayingSynthRef.current = false;
    if (synthTimerRef.current) {
      window.clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.suspend();
      } catch {
        // Ignore
      }
    }
  }, []);

  // Web Audio chime note generator
  const playChimeNote = useCallback((freq: number, durationSeconds: number, gainNode: GainNode, ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Use bell/chime harmonic combination (sine wave with exponential decay)
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const effectiveVol = isMuted ? 0 : volume;
    noteGain.gain.setValueAtTime(0.3 * effectiveVol, ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds * 1.5);

    osc.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start();
    osc.stop(ctx.currentTime + durationSeconds * 1.5);
  }, [isMuted, volume]);

  // Start synthetic playback loop
  const startSynth = useCallback((melody: { note: number; duration: number }[]) => {
    stopSynth();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    isPlayingSynthRef.current = true;
    let noteIdx = 0;
    const tempo = 1.6; // beats per second

    function step() {
      if (!isPlayingSynthRef.current) return;

      const item = melody[noteIdx];
      const durSec = item.duration / tempo;

      playChimeNote(item.note, durSec, masterGain, ctx);

      noteIdx = (noteIdx + 1) % melody.length;
      synthTimerRef.current = window.setTimeout(step, durSec * 1000);
    }

    step();
  }, [isMuted, volume, stopSynth, playChimeNote]);

  // Core play function for any track
  const playTrack = useCallback(
    (track: Track) => {
      if (!track) return;
      hasStartedPlayingRef.current = true;
      setIsPlaying(true);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("christmas_user_paused");
      }

      if (track.source === "UPLOADED" && track.filePath) {
        stopSynth();
        if (audioRef.current) {
          const currentSrc = audioRef.current.src;
          if (!currentSrc.endsWith(track.filePath)) {
            audioRef.current.src = track.filePath;
          }
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.play().catch(() => {
            setIsPlaying(false);
          });
        }
      } else if (track.melodyNotes) {
        if (audioRef.current) audioRef.current.pause();
        startSynth(track.melodyNotes);
      }
    },
    [isMuted, volume, stopSynth, startSynth]
  );

  // Fetch custom tracks from backend
  useEffect(() => {
    async function loadTracks() {
      try {
        const res = await fetch("/api/music");
        if (res.ok) {
          const customTracks = await res.json();
          if (Array.isArray(customTracks) && customTracks.length > 0) {
            // Sort custom tracks: tracks with sortOrder < 0 (designated default) come first
            const sortedCustom = [...customTracks].sort(
              (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
            );
            // Place custom tracks first ahead of built-in synth tracks
            const allTracks = [...sortedCustom, ...BUILTIN_TRACKS];
            setTracks(allTracks);

            // Restore user's saved track preference if available
            const savedTrackId = localStorage.getItem("christmas_track_id");
            let targetIdx = 0;
            if (savedTrackId) {
              const savedIdx = allTracks.findIndex((t) => t.id === savedTrackId);
              if (savedIdx !== -1) {
                targetIdx = savedIdx;
              }
            }
            setCurrentTrackIndex(targetIdx);

            // If user already interacted and music was started with synth placeholder,
            // seamlessly switch to default custom track
            if (hasStartedPlayingRef.current && isPlayingRef.current) {
              const targetTrack = allTracks[targetIdx];
              if (targetTrack) {
                playTrack(targetTrack);
              }
            }
          }
        }
      } catch {
        // Fallback to built-in tracks
      }
    }
    loadTracks();

    // Load saved volume
    const savedVol = localStorage.getItem("christmas_volume");
    if (savedVol) {
      setVolume(parseFloat(savedVol));
    }
  }, [playTrack]);

  // Autoplay on first user interaction anywhere on the page
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user previously paused music in this session
    if (sessionStorage.getItem("christmas_user_paused") === "true") return;

    const handleFirstInteraction = () => {
      // Remove listeners right away so it only triggers once
      ["pointerdown", "click", "touchstart", "keydown"].forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction);
      });

      if (sessionStorage.getItem("christmas_user_paused") === "true") return;
      if (isPlayingRef.current) return;

      const track = tracksRef.current[currentTrackIndexRef.current] || tracksRef.current[0];
      if (track) {
        playTrack(track);
      }
    };

    ["pointerdown", "click", "touchstart", "keydown"].forEach((evt) => {
      window.addEventListener(evt, handleFirstInteraction, { passive: true });
    });

    return () => {
      ["pointerdown", "click", "touchstart", "keydown"].forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction);
      });
    };
  }, [playTrack]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      hasStartedPlayingRef.current = false;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("christmas_user_paused", "true");
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynth();
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("christmas_user_paused");
      }
      playTrack(currentTrack);
    }
  };

  const selectTrack = (idx: number) => {
    setCurrentTrackIndex(idx);
    const selected = tracks[idx];
    if (selected) {
      localStorage.setItem("christmas_track_id", selected.id);
    }
    if (isPlaying) {
      playTrack(selected);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    const nextTrack = tracks[nextIdx];
    if (nextTrack) {
      localStorage.setItem("christmas_track_id", nextTrack.id);
      if (isPlaying) {
        playTrack(nextTrack);
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    const prevTrack = tracks[prevIdx];
    if (prevTrack) {
      localStorage.setItem("christmas_track_id", prevTrack.id);
      if (isPlaying) {
        playTrack(prevTrack);
      }
    }
  };

  // Adjust volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem("christmas_volume", newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, [stopSynth]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        onEnded={handleNext}
        onError={() => setIsPlaying(false)}
      />

      {/* Floating Pill Player */}
      <div className="bg-[#144534]/95 border border-[#d4af37]/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100 transition-all duration-300 max-w-xs md:max-w-sm">
        {/* Header / Mini bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#1d5943] bg-[#0b2b20]/60">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-xs text-[#f3c053] hover:text-[#d4af37] font-medium"
            title="Toggle music player details"
            aria-expanded={isExpanded}
          >
            <Music className="w-4 h-4 text-[#d4af37] animate-pulse" />
            <span className="truncate max-w-[150px]">{currentTrack?.title || "Christmas Music"}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-[#d4af37] text-[#0b2b20] hover:bg-[#f3c053] transition"
              aria-label={isPlaying ? "Pause Christmas music" : "Play Christmas music"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="p-3 space-y-3 text-xs">
            <div className="text-center">
              <div className="font-semibold text-slate-100 text-sm">{currentTrack?.title}</div>
              <div className="text-[11px] text-[#f3c053]">{currentTrack?.artist || currentTrack?.category}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrev}
                className="p-1 hover:text-[#f3c053] transition"
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-[#d4af37] text-[#0b2b20] hover:bg-[#f3c053] transition shadow-md"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1 hover:text-[#f3c053] transition"
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2 pt-1 border-t border-[#1d5943]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-[#f3c053]"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#1d5943] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                aria-label="Volume slider"
              />
            </div>

            {/* Track Selector Dropdown */}
            {tracks.length > 1 && (
              <div className="pt-1">
                <label htmlFor="trackSelect" className="sr-only">Choose Track</label>
                <select
                  id="trackSelect"
                  value={currentTrackIndex}
                  onChange={(e) => selectTrack(parseInt(e.target.value, 10))}
                  className="w-full bg-[#0b2b20] border border-[#1d5943] text-[#f3c053] text-[11px] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#d4af37] truncate"
                >
                  {tracks.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {t.sortOrder !== undefined && t.sortOrder < 0 ? "⭐ " : ""}{t.title} {t.artist ? `— ${t.artist}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
