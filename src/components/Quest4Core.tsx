import React, { useState, useCallback } from 'react';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { Zap, Activity, Target, Compass, Sparkles } from 'lucide-react';

interface Quest4CoreProps {
  onComplete: () => void;
}

export function Quest4Core({ onComplete }: Quest4CoreProps) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [rotation, setRotation] = useState(0);
  const [statusMessage, setStatusMessage] = useState('HINT: The initialization button is unstable! Move cursor over it to catch it.');

  const dialogues = [
    'HINT: The initialization button is unstable! Move cursor over it to catch it.',
    '💨 INITIALIZER GLIDED AWAY! "Calculating seed offset..."',
    '🌀 DARTED ACROSS THE CHAMBER! "Sampling voxel noise frequency..."',
    '⚡ GLIDING TO FAR CORNER! "Simulating world generation..."',
    '🛡️ DEFLECTING CURSOR! "Stabilizing subterranean bedrock..."',
    '🔋 CALIBRATING MATRIX! "Almost pinned down..."',
    '🎯 TARGET LOCKED! CLICK NOW TO GENERATE THE MINECRAFT WORLD!',
  ];

  const handleEvade = useCallback(() => {
    if (locked) return;

    const nextDodge = dodgeCount + 1;
    sound.playTeleport();

    if (nextDodge < 6) {
      setDodgeCount(nextDodge);
      setStatusMessage(dialogues[nextDodge]);
      
      // Calculate wide, high-entropy random coordinates across the expanded chamber
      let newTopNum = Math.floor(Math.random() * 70 + 15);
      let newLeftNum = Math.floor(Math.random() * 74 + 13);
      
      // Ensure it jumps a noticeable distance from current position
      const currentTopNum = parseInt(position.top, 10) || 50;
      const currentLeftNum = parseInt(position.left, 10) || 50;
      if (Math.abs(newTopNum - currentTopNum) < 25) {
        newTopNum = (newTopNum + 35) % 70 + 15;
      }
      if (Math.abs(newLeftNum - currentLeftNum) < 25) {
        newLeftNum = (newLeftNum + 40) % 74 + 13;
      }

      const randomRot = Math.floor(Math.random() * 12 - 6); // -6deg to +6deg
      setRotation(randomRot);
      setPosition({ top: `${newTopNum}%`, left: `${newLeftNum}%` });
    } else {
      // 6th dodge completes chase, locks in center for single click
      setDodgeCount(6);
      setLocked(true);
      setRotation(0);
      setPosition({ top: '50%', left: '50%' });
      setStatusMessage(dialogues[6]);
      sound.playXpGain();
    }
  }, [dodgeCount, locked, dialogues, position]);

  const handleButtonClick = () => {
    if (!locked) {
      handleEvade();
      return;
    }

    sound.playPortalBoom();
    onComplete();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0c0c0c] bg-immersive-grid text-[#f0f0f0] font-mono flex flex-col items-center justify-center p-4 pt-16 pb-20 select-none overflow-hidden">
      <VoxelParticles type="portal" count={40} />

      {/* Hazard Corner Accents */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 bg-hazard-stripes pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rotate-180 bg-hazard-stripes pointer-events-none" />

      {/* Main Container with Wider Max Width */}
      <main className="z-20 max-w-3xl w-full mx-auto my-auto flex flex-col items-center gap-5 text-center">
        
        {/* Branding Hierarchy */}
        <div className="mb-2 space-y-1">
          <h2 className="text-zinc-500 text-sm tracking-[0.3em] uppercase">PRARAMBH presents</h2>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white drop-shadow-[4px_4px_0_#333]">
            TECHNOTICA 2.0
          </h1>
        </div>

        {/* Spacious Portal Core Chamber Card */}
        <div className="w-full bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 sm:p-8 shadow-[12px_12px_0_0_#000] relative min-h-[520px] sm:min-h-[580px] flex flex-col items-center justify-between overflow-hidden">
          
          {/* Immersive Corner Torches */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>

          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-zinc-700 text-[#3cff00] text-[11px] uppercase tracking-wider mb-2 shadow-[2px_2px_0_0_#000]">
              <Target size={13} className="text-[#3cff00]" />
              <span>FINAL QUEST • CORE INITIALIZATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl text-white uppercase tracking-wider font-bold">
              ACTIVATE THE ANCIENT CORE
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Capture the elusive initializer button to begin generating the TECHNOTICA world.
            </p>
          </div>

          {/* Giant Ancient Core Monument in Center */}
          <div className="relative flex flex-col items-center justify-center my-auto pointer-events-none">
            <div className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-dashed ${
              locked ? 'border-[#3cff00] animate-spin shadow-[0_0_40px_#3cff00]' : 'border-zinc-700 animate-pulse'
            } flex items-center justify-center`} style={{ animationDuration: '5s' }}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1a1a1a] border-4 border-black flex flex-col items-center justify-center relative shadow-[4px_4px_0_0_#000]">
                <Zap size={36} className={`${locked ? 'text-[#3cff00] animate-bounce' : 'text-zinc-400 animate-pulse'}`} />
                <span className="text-[9px] font-mono text-zinc-400 mt-1 uppercase font-bold">
                  {locked ? 'ONLINE' : 'DORMANT'}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Dialogue Bar */}
          <div className="w-full p-3 bg-black border-2 border-zinc-800 text-center text-xs font-mono text-zinc-300 z-10 flex items-center justify-center gap-2 shadow-[2px_2px_0_0_#000]">
            <Activity size={14} className="text-[#3cff00] shrink-0" />
            <span className={locked ? 'text-[#3cff00] font-bold' : 'text-zinc-300'}>{statusMessage}</span>
          </div>

          {/* Wide-Area Escaping / Locked Initialize Button */}
          <div className="absolute inset-0 z-20 pointer-events-none p-6 sm:p-10">
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out pointer-events-auto"
              style={{
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
            >
              <button
                id="initialize-core-btn"
                type="button"
                onMouseEnter={handleEvade}
                onTouchStart={handleEvade}
                onClick={handleButtonClick}
                className={`px-6 sm:px-8 py-3 sm:py-4 font-mono font-bold text-xs sm:text-sm tracking-widest uppercase cursor-pointer transition-all ${
                  locked
                    ? 'bg-[#3cff00] hover:bg-[#34dd00] text-black shadow-[0_6px_0_0_#2a8800] animate-bounce scale-110 border-2 border-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-2 border-[#3cff00] text-[#3cff00] shadow-[4px_4px_0_0_#000] active:scale-95'
                }`}
              >
                {locked ? '⚡ [ CLICK TO GENERATE WORLD ] ⚡' : 'INITIALIZE CORE'}
              </button>
            </div>
          </div>

        </div>

        {/* Inventory & Log */}
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <div className="bg-[#222] p-3 border-2 border-[#333] w-48 text-left shadow-[4px_4px_0_0_#000]">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Inventory</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-yellow-500 text-sm">
                🪙
              </div>
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-cyan-400 text-sm">
                💎
              </div>
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-[#3cff00] text-sm">
                ⚡
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-left max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#3cff00]">
              Environmental Log
            </span>
            <p className="text-xs text-zinc-500 italic">
              "Catch the escaping initialize trigger to build the Minecraft world."
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}


