import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { Sparkles, Trophy, Award, Zap, RotateCcw, Share2, Camera, Compass } from 'lucide-react';

interface RevealScreenProps {
  elapsedSeconds: number;
  xp: number;
  onRestart: () => void;
}

export function RevealScreen({ elapsedSeconds, xp, onRestart }: RevealScreenProps) {
  useEffect(() => {
    sound.playFanfare();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3cff00', '#ffaa00', '#ffffff', '#22c55e', '#38bdf8'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 700);

      return () => clearTimeout(timer);
    } catch {
      // Fallback safe
    }
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0c0c0c] bg-immersive-grid text-[#f0f0f0] font-mono flex flex-col items-center justify-between p-4 py-8 select-none overflow-hidden">
      <VoxelParticles type="celebration" count={45} />

      {/* Hazard Corner Accents */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 bg-hazard-stripes pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rotate-180 bg-hazard-stripes pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="z-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] border-2 border-zinc-700 text-[#3cff00] text-xs font-mono tracking-widest shadow-[2px_2px_0_0_#000]">
          <Trophy size={14} className="text-[#ffaa00]" />
          <span>ALL 4 QUESTS COMPLETE • CORE SYNCHRONIZED</span>
        </div>
      </div>

      {/* Main Center Reveal Content */}
      <main className="z-20 max-w-2xl w-full mx-auto my-auto text-center flex flex-col items-center gap-6 py-4">
        
        {/* Branding Hierarchy */}
        <div className="space-y-1 animate-fadeIn">
          <h2 className="text-zinc-500 text-sm sm:text-base tracking-[0.3em] uppercase font-bold">
            PRARAMBH presents
          </h2>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white drop-shadow-[4px_4px_0_#333]">
            TECHNOTICA 2.0
          </h1>
        </div>

        {/* Cinematic Announcement Card */}
        <div className="w-full bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 sm:p-8 shadow-[12px_12px_0_0_#000] relative space-y-6">
          
          {/* Immersive Corner Torches */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>

          <div className="space-y-2 border-b border-zinc-700 pb-4 text-center">
            <p className="text-sm font-mono text-[#3cff00] tracking-wider uppercase font-bold">
              PORTAL DIMENSION UNLOCKED
            </p>
            <p className="text-lg sm:text-xl font-bold text-white tracking-wide">
              WELCOME TO TECHNOTICA 2.0
            </p>
            <div className="text-xs text-zinc-400">
              PRARAMBH × TECHNOTICA • TECHNICAL FESTIVAL
            </div>
          </div>

          {/* Participant Achievement Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#1a1a1a] border-2 border-zinc-700 shadow-[2px_2px_0_0_#000] flex flex-col items-center">
              <span className="text-[10px] text-zinc-400 uppercase">Total XP</span>
              <span className="text-base sm:text-lg text-[#3cff00] font-bold mt-1">
                {xp} XP
              </span>
            </div>

            <div className="p-3 bg-[#1a1a1a] border-2 border-zinc-700 shadow-[2px_2px_0_0_#000] flex flex-col items-center">
              <span className="text-[10px] text-zinc-400 uppercase">Clear Time</span>
              <span className="text-base sm:text-lg text-[#ffaa00] font-bold mt-1">
                {formatTime(elapsedSeconds)}
              </span>
            </div>

            <div className="p-3 bg-[#1a1a1a] border-2 border-zinc-700 shadow-[2px_2px_0_0_#000] flex flex-col items-center">
              <span className="text-[10px] text-zinc-400 uppercase">Quests</span>
              <span className="text-base sm:text-lg text-cyan-400 font-bold mt-1">
                04 / 04
              </span>
            </div>

            <div className="p-3 bg-[#1a1a1a] border-2 border-zinc-700 shadow-[2px_2px_0_0_#000] flex flex-col items-center">
              <span className="text-[10px] text-zinc-400 uppercase">Rank</span>
              <span className="text-xs sm:text-sm text-purple-400 font-bold mt-1">
                DIAMOND S
              </span>
            </div>
          </div>

          {/* Photo Moment & Booth Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-300 bg-black/60 p-2.5 border border-zinc-800">
            <Camera size={15} className="text-[#3cff00]" />
            <span>📸 Snap a picture of this victory screen at the event booth!</span>
          </div>

          {/* Play Again Button for instant next booth participant */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="play-again-btn"
              type="button"
              onClick={onRestart}
              className="w-full sm:w-auto px-10 py-4 bg-[#3cff00] hover:bg-[#34dd00] text-black font-mono font-bold text-sm tracking-wider cursor-pointer border-b-4 border-[#2a8800] active:translate-y-1 shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-2 uppercase"
            >
              <RotateCcw size={16} />
              <span>[ PLAY AGAIN ]</span>
            </button>
          </div>

        </div>

      </main>

      {/* Footer credits */}
      <footer className="z-20 text-center text-[10px] font-mono text-zinc-500">
        PRARAMBH TECH FEST • TECHNOTICA 2.0 EDITION
      </footer>

    </div>
  );
}

