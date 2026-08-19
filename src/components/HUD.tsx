import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GameStage } from '../types';

interface HUDProps {
  stage: GameStage;
  xp: number;
  hearts: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
}

export function HUD({
  stage,
  xp,
  hearts,
  soundEnabled,
  onToggleSound,
  onRestart,
}: HUDProps) {
  // Map stage to Quest number (01 to 04)
  const getQuestNumber = () => {
    switch (stage) {
      case 'quest1_code':
        return 'QUEST 01:';
      case 'quest2_coin':
        return 'QUEST 02:';
      case 'quest3_mine':
        return 'QUEST 03:';
      case 'quest4_core':
        return 'FINAL QUEST:';
      default:
        return 'QUEST:';
    }
  };

  const getQuestTitle = () => {
    switch (stage) {
      case 'quest1_code':
        return 'THE SECRET CODE';
      case 'quest2_coin':
        return 'FIND THE LOST COIN';
      case 'quest3_mine':
        return 'THE MINING TEST';
      case 'quest4_core':
        return 'ACTIVATE ANCIENT CORE';
      default:
        return 'EXPLORATION';
    }
  };

  const getLevelLabel = () => {
    if (xp >= 500) return 'Master Core Engineer';
    if (xp >= 250) return 'Diamond Prospector';
    if (xp >= 100) return 'Cavern Explorer';
    return 'Level 1 Initiate';
  };

  // Max XP is 500
  const xpPercent = Math.min(100, Math.round((xp / 500) * 100));

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 flex justify-between items-center pointer-events-none select-none">
        
        {/* Left: 5 Red Hearts */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl sm:text-3xl transition-transform hover:scale-110 drop-shadow-[2px_2px_0_#000] select-none ${
                i < hearts ? 'text-red-600' : 'text-zinc-800 opacity-40'
              }`}
            >
              ❤
            </span>
          ))}
        </div>

        {/* Right: Current Objective Pill & Quick Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-mono">
              Current Objective
            </div>
            <div className="bg-zinc-900 border-2 border-zinc-700 px-4 py-1.5 shadow-[4px_4px_0_0_#000] font-mono text-xs text-white">
              <span className="text-[#3cff00] font-bold mr-1.5">{getQuestNumber()}</span>
              <span>{getQuestTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              id="hud-sound-toggle"
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              title={soundEnabled ? 'Mute Sound [M]' : 'Enable Sound [M]'}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-[#3cff00] text-zinc-300 hover:text-[#3cff00] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer active:translate-y-0.5"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-500" />}
            </button>

            {/* Booth Restart */}
            <button
              id="hud-restart-btn"
              type="button"
              onClick={onRestart}
              aria-label="Restart Quest"
              title="Restart Experience [R]"
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 hover:border-[#ffaa00] text-zinc-300 hover:text-[#ffaa00] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer active:translate-y-0.5"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

      </nav>

      {/* Bottom Floating XP Progression HUD */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 flex flex-col items-center gap-1.5 pointer-events-none select-none">
        <div className="w-full max-w-2xl flex justify-between text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono">
          <span className="text-zinc-400">{getLevelLabel()}</span>
          <span className="text-[#3cff00]">{xp} / 500 XP</span>
        </div>
        
        <div className="w-full max-w-2xl h-4 sm:h-5 bg-[#1a1a1a] border-2 border-white/10 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
          <div
            className="h-full bg-[#3cff00] shadow-[0_0_12px_#3cff00] transition-all duration-500 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="flex gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-mono mt-0.5">
          <span>[M] Mute</span>
          <span>[R] Restart</span>
          <span>PRARAMBH × TECHNOTICA 2.0</span>
        </div>
      </footer>
    </>
  );
}

