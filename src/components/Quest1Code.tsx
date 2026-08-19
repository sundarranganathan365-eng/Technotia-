import React, { useState } from 'react';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { KeyRound, Lock, Unlock, Eye, Sparkles, ScrollText, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Quest1CodeProps {
  onComplete: () => void;
  onClueInspect: (clueId: 'tablet' | 'chest' | 'torch') => void;
}

export function Quest1Code({ onComplete, onClueInspect }: Quest1CodeProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [inspectedClues, setInspectedClues] = useState<Record<string, boolean>>({
    tablet: false,
    chest: false,
    torch: false,
  });
  const [activeModalClue, setActiveModalClue] = useState<null | {
    id: 'tablet' | 'chest' | 'torch';
    title: string;
    text: string;
    symbol: string;
    hint: string;
  }>(null);

  const clues = [
    {
      id: 'tablet' as const,
      title: 'CLUE 01: ANCIENT RUNESTONE',
      symbol: '⚡',
      label: 'Energy Ore',
      text: 'An etched tablet describes the glowing ruby-colored dust that powers all Minecraft circuits.',
      hint: 'First half: The color of rubies and power wires.',
      icon: ScrollText,
    },
    {
      id: 'chest' as const,
      title: 'CLUE 02: MINER’S CHEST',
      symbol: '🧱',
      label: 'Foundation Block',
      text: 'Inside the chest lies the universal gray bedrock material found all across the subterranean world.',
      hint: 'Second half: The basic gray mineral mined underground.',
      icon: Lock,
    },
    {
      id: 'torch' as const,
      title: 'CLUE 03: WALL ENGRAVING',
      symbol: '🔗',
      label: 'Fusion Glyph',
      text: 'Engraved beside the torch: "Join the energy color + the gray mineral without spaces."',
      hint: 'Combine both parts into one 8-letter word.',
      icon: Flame,
    },
  ];

  const handleInspect = (clue: (typeof clues)[0]) => {
    sound.playClick();
    setInspectedClues((prev) => ({ ...prev, [clue.id]: true }));
    setActiveModalClue(clue);
    onClueInspect(clue.id);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/[\s-_]/g, '');

    // Accept REDSTONE and friendly variations
    if (
      cleanCode === 'REDSTONE' ||
      cleanCode === 'TECHNOTICA' ||
      cleanCode === 'PRARAMBH' ||
      cleanCode === 'REDSTONE2'
    ) {
      sound.playDoorOpen();
      sound.playXpGain();
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        onComplete();
      }, 1600);
    } else {
      sound.playError();
      setError(true);
      setErrorMessage('ACCESS DENIED: CIPHER MISMATCH (HINT: 8 LETTERS)');
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0c0c0c] bg-immersive-grid text-[#f0f0f0] font-mono flex flex-col items-center justify-center p-4 pt-16 pb-20 select-none overflow-hidden">
      <VoxelParticles type="ambient" count={25} />

      {/* Hazard Corner Accents from Immersive UI */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 bg-hazard-stripes pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rotate-180 bg-hazard-stripes pointer-events-none" />

      {/* Main Quest Container */}
      <main className="z-20 max-w-2xl w-full mx-auto my-auto flex flex-col items-center justify-center text-center">
        
        {/* Branding Hierarchy */}
        <div className="mb-4 space-y-1">
          <h2 className="text-zinc-500 text-sm tracking-[0.3em] uppercase">PRARAMBH presents</h2>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white drop-shadow-[4px_4px_0_#333]">
            TECHNOTICA 2.0
          </h1>
        </div>

        {/* Immersive Main Card */}
        <div className="w-full max-w-2xl bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 sm:p-10 shadow-[12px_12px_0_0_#000] relative">
          
          {/* Immersive Corner Torches */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>

          <div className="mb-6">
            <h3 className="text-xl text-[#3cff00] mb-2 uppercase tracking-widest font-bold">
              {success ? 'ACCESS GRANTED' : 'QUEST 1: CRACK THE VAULT CIPHER'}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
              A sealed subterranean vault blocks the tunnel. Inspect the 3 clue stones below to deduce the secret key.
            </p>
          </div>

          {/* 3 Clues Display Grid - No direct keyword spoilers on front */}
          <div className="flex gap-3 sm:gap-4 justify-center mb-6">
            {clues.map((clue, idx) => {
              const isFound = inspectedClues[clue.id];
              return (
                <button
                  key={clue.id}
                  id={`clue-inspect-btn-${idx + 1}`}
                  type="button"
                  onClick={() => handleInspect(clue)}
                  className={`w-24 sm:w-28 h-24 sm:h-28 bg-[#1a1a1a] border-2 transition-all flex flex-col items-center justify-center cursor-pointer shadow-[4px_4px_0_0_#000] active:translate-y-0.5 p-2 ${
                    isFound ? 'border-[#3cff00] bg-zinc-900' : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <span className="text-lg sm:text-xl mb-1">{clue.symbol}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-300 truncate max-w-full">
                    {isFound ? clue.label : `CLUE #${idx + 1}`}
                  </span>
                  <span className={`text-[9px] mt-1 uppercase font-bold ${isFound ? 'text-[#3cff00]' : 'text-zinc-500'}`}>
                    {isFound ? '✓ READ' : 'INSPECT'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Input or Success State */}
          {success ? (
            <div className="py-4 space-y-2 animate-bounce">
              <div className="text-xl sm:text-2xl font-bold text-[#3cff00] tracking-widest">
                CIPHER VERIFIED • VAULT OPENED!
              </div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">
                Advancing to the Next Chamber (+100 XP)...
              </p>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4">
              <div className="w-full relative">
                <input
                  id="quest1-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(false);
                  }}
                  placeholder="TYPE SECRET CIPHER (8 LETTERS)..."
                  className={`w-full bg-black border-2 p-4 text-center text-base sm:text-lg tracking-[0.3em] focus:outline-none transition-colors placeholder:text-zinc-700 uppercase font-mono ${
                    error ? 'border-red-600 text-red-400' : 'border-zinc-700 focus:border-[#3cff00] text-[#3cff00]'
                  }`}
                  autoComplete="off"
                  maxLength={20}
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-red-500 font-mono text-xs animate-pulse">
                  <ShieldAlert size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                id="unlock-chamber-btn"
                type="submit"
                className="w-full bg-[#3cff00] hover:bg-[#34dd00] text-black font-bold py-4 shadow-[0_6px_0_0_#2a8800] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-base sm:text-lg cursor-pointer"
              >
                UNLOCK VAULT
              </button>
            </form>
          )}

        </div>

        {/* Mini Inventory & Environmental Log */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center items-center">
          <div className="bg-[#222] p-3 sm:p-4 border-2 border-[#333] w-48 text-left shadow-[4px_4px_0_0_#000]">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Clues Found</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className={`w-8 h-8 bg-black/40 border flex items-center justify-center text-sm ${inspectedClues.tablet ? 'border-[#3cff00] text-[#3cff00]' : 'border-zinc-800 text-zinc-700'}`}>
                ⚡
              </div>
              <div className={`w-8 h-8 bg-black/40 border flex items-center justify-center text-sm ${inspectedClues.chest ? 'border-[#3cff00] text-[#3cff00]' : 'border-zinc-800 text-zinc-700'}`}>
                🧱
              </div>
              <div className={`w-8 h-8 bg-black/40 border flex items-center justify-center text-sm ${inspectedClues.torch ? 'border-[#3cff00] text-[#3cff00]' : 'border-zinc-800 text-zinc-700'}`}>
                🔗
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-left max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#3cff00]">
              Environmental Log
            </span>
            <p className="text-xs text-zinc-500 italic">
              "Inspect all 3 glyphs to deduce the compound Minecraft keyword."
            </p>
          </div>
        </div>

      </main>

      {/* Clue Inspector Modal */}
      {activeModalClue && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 max-w-md w-full shadow-[12px_12px_0_0_#000] relative space-y-4 text-center">
            
            <div className="flex items-center justify-between border-b-2 border-zinc-700 pb-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#3cff00]">
                {activeModalClue.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalClue(null)}
                className="text-zinc-400 hover:text-white font-mono text-sm px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-black border-2 border-zinc-800 text-center space-y-3">
              <div className="text-3xl font-bold text-white tracking-widest">
                {activeModalClue.symbol}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {activeModalClue.text}
              </p>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#3cff00] text-left flex items-start gap-2">
                <span className="text-sm">💡</span>
                <span>{activeModalClue.hint}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModalClue(null)}
              className="w-full py-3 bg-[#3cff00] hover:bg-[#34dd00] text-black font-bold text-xs uppercase tracking-widest shadow-[0_4px_0_0_#2a8800] active:translate-y-0.5 cursor-pointer"
            >
              [ CLOSE CLUE ]
            </button>

          </div>
        </div>
      )}

    </div>
  );
}


