import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Settings, Trophy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { VoxelParticles } from './VoxelParticles';
import bgImage from '../assets/images/minecraft_world_bg_1787155108353.jpg';

interface IntroScreenProps {
  onStartQuest: () => void;
}

export function IntroScreen({ onStartQuest }: IntroScreenProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Splash quote in iconic Minecraft yellow
  const splashQuote = "The world of technology is awaited";

  const handleStart = () => {
    sound.playClick();
    sound.playDoorOpen();
    sound.startMusic();
    onStartQuest();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0a0f14] select-none font-pixel">
      {/* Minecraft Isometric 3D Aerial World Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-1000 scale-100"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center 40%',
        }}
      />

      {/* Atmospheric Soft Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] pointer-events-none" />

      {/* Floating Voxel atmospheric motes */}
      <VoxelParticles type="ambient" count={20} />

      {/* Top Header & Launcher Alerts */}
      <header className="z-20 w-full pt-4 px-4 sm:px-6 flex justify-between items-start text-[10px] text-white/90">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 border border-zinc-700 shadow-[2px_2px_0_#000]">
          <span className="w-2 h-2 bg-[#3cff00] border border-black animate-pulse" />
          <span className="text-zinc-200">PRARAMBH 2026 • BOOTH PORTAL</span>
        </div>

        {/* Top-Right Launcher Notification / Sound */}
        <div className="flex flex-col items-end gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 backdrop-blur-xs border border-emerald-500/60 px-3 py-1.5 text-[10px] text-emerald-300 shadow-[2px_2px_0_#000]">
            <ShieldCheck size={13} className="text-[#3cff00]" />
            <span>SERVER: TECHNOTICA 2.0 ONLINE</span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black/75 hover:bg-black border border-zinc-600 text-zinc-300 text-[10px] cursor-pointer transition-colors shadow-[2px_2px_0_#000]"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={12} className="text-[#3cff00]" /> : <VolumeX size={12} className="text-red-400" />}
            <span>{soundEnabled ? 'SFX: ON' : 'SFX: MUTED'}</span>
          </button>
        </div>
      </header>

      {/* Center Minecraft Launcher Login Card */}
      <main className="z-20 flex-1 flex flex-col items-center justify-center px-4 max-w-xl mx-auto w-full my-auto py-4">
        
        {/* Launcher Box Modal */}
        <div className="w-full bg-[#27282a]/95 border-4 border-[#18191a] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08)] relative backdrop-blur-xs text-center">
          
          {/* PRARAMBH 3D Minecraft Stone Logo - Centered & Larger */}
          <div className="w-full mb-8 pt-2 flex flex-col items-center justify-center select-none cursor-default">
            <div className="relative inline-flex flex-col items-center justify-center">
              {/* Front 3D Stone Title - Bigger Size */}
              <h1 
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase text-center m-0 p-0 tracking-tight"
                style={{
                  fontFamily: `'Press Start 2P', monospace, sans-serif`,
                  color: '#d6d6d6',
                  backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #c4c4c4 40%, #8c8c8c 60%, #484848 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 3px 0 #333) drop-shadow(0 6px 0 #1a1a1a) drop-shadow(0 10px 0 #000)',
                }}
              >
                PRARAMBH
              </h1>

              {/* Pulsing Yellow Splash Text - Lower Right Side of PRARAMBH Logo */}
              <div className="absolute -bottom-5 sm:-bottom-6 right-0 sm:-right-4 md:-right-6 transform -rotate-12 origin-top-left animate-bounce z-30 pointer-events-none">
                <span 
                  className="inline-block text-[9px] sm:text-xs md:text-sm font-bold text-[#ffff00] whitespace-nowrap tracking-wider"
                  style={{
                    textShadow: '2px 2px 0 #3f3f00, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                  }}
                >
                  {splashQuote}
                </span>
              </div>
            </div>
          </div>

          {/* Minecraft Launcher Green Buttons */}
          <div className="w-full space-y-3 pt-3">
            
            {/* Primary Action Button: TECHNOTICA 2.0 LOGIN */}
            <button
              id="technotica-main-btn"
              type="button"
              onClick={handleStart}
              className="w-full py-4 px-4 bg-[#3c8527] hover:bg-[#4ea634] active:bg-[#2d661d] border-t-2 border-l-2 border-white/40 border-b-4 border-r-4 border-black text-white hover:text-[#ffffa0] text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_0_0_#1d4512] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Zap size={16} className="text-yellow-300 group-hover:scale-110 transition-transform" />
              <span className="drop-shadow-[2px_2px_0_#000] font-bold">TECHNOTICA 2.0 LOGIN</span>
            </button>



            {/* Secondary Button: BOOTH QUEST BRIEFING */}
            <button
              id="menu-guide-btn"
              type="button"
              onClick={() => {
                sound.playClick();
                setShowInfoModal(true);
              }}
              className="w-full py-3 px-4 bg-[#3c8527] hover:bg-[#4ea634] active:bg-[#2d661d] border-t-2 border-l-2 border-white/40 border-b-4 border-r-4 border-black text-white hover:text-[#ffffa0] text-xs tracking-wider uppercase shadow-[0_4px_0_0_#1d4512] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy size={14} className="text-yellow-300" />
              <span className="drop-shadow-[2px_2px_0_#000] font-bold">HOW TO PLAY & QUESTS</span>
            </button>

          </div>

          {/* Direct Launch Link under buttons */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={handleStart}
              className="text-[11px] text-zinc-300 hover:text-white underline decoration-zinc-500 hover:decoration-white inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Begin Secret Subterranean Quest</span>
              <ExternalLink size={12} />
            </button>
          </div>

        </div>

      </main>

      {/* Launcher Bottom Banner */}
      <footer className="z-20 w-full px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/80 drop-shadow-[2px_2px_0_#000] gap-1.5 select-none bg-black/60 backdrop-blur-xs border-t border-zinc-800">
        <div>PRARAMBH 2.0 (Minecraft Quest Edition)</div>
        <div className="text-zinc-400">Presents TECHNOTICA 2.0 • 2-4 Min Interactive Booth Challenge</div>
      </footer>

      {/* Info / How to Play Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 max-w-md w-full shadow-[12px_12px_0_0_#000] relative space-y-4 text-center">
            <h3 className="text-sm uppercase tracking-wider text-[#3cff00] drop-shadow-[2px_2px_0_#000]">
              TECHNOTICA 2.0 • QUEST BRIEFING
            </h3>
            <div className="text-left text-[11px] text-zinc-300 space-y-2.5 bg-black/70 p-4 border-2 border-zinc-800 leading-relaxed font-mono">
              <p>⚡ <strong className="text-white">Quest 1:</strong> Decode the 3 clue stones to unlock the subterranean vault.</p>
              <p>🪙 <strong className="text-white">Quest 2:</strong> Match Minecraft memory glyphs to gather ancient coins.</p>
              <p>⛏️ <strong className="text-white">Quest 3:</strong> Mine through the grass & stone to uncover the Diamond Ore.</p>
              <p>🔥 <strong className="text-white">Quest 4:</strong> Catch the evasive core switch to ignite TECHNOTICA 2.0!</p>
            </div>
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full py-3 bg-[#3c8527] hover:bg-[#4ea634] text-white font-bold text-xs uppercase tracking-widest border-2 border-black shadow-[0_4px_0_0_#1d4512] active:translate-y-0.5 cursor-pointer font-pixel"
            >
              [ BACK TO LOGIN ]
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
