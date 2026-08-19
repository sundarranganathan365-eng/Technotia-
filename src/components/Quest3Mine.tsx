import React, { useState } from 'react';
import { VoxelBlock } from './VoxelBlocks';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { Pickaxe, Sparkles, Gem, CheckCircle, Search } from 'lucide-react';

interface Quest3MineProps {
  onComplete: () => void;
}

interface TerrainBlock {
  id: number;
  initialType: 'dirt' | 'stone';
  label: string;
  isTarget: boolean;
  hint: string;
}

export function Quest3Mine({ onComplete }: Quest3MineProps) {
  // Game phases: 'search' -> 'ore_formed' -> 'mining' -> 'gem_ready' -> 'claimed'
  const [phase, setPhase] = useState<'search' | 'ore_formed' | 'mining' | 'gem_ready' | 'claimed'>('search');
  const [minedIds, setMinedIds] = useState<Record<number, boolean>>({});
  const [crackStage, setCrackStage] = useState(0);
  const [feedback, setFeedback] = useState('Inspect the subterranean terrain and mine the blocks to uncover the hidden Diamond Ore.');
  const [feedbackType, setFeedbackType] = useState<'info' | 'wrong' | 'success'>('info');

  // Initial grid composed strictly of grass/dirt and stone blocks
  const terrainBlocks: TerrainBlock[] = [
    { id: 1, initialType: 'dirt', label: 'Overgrown Grass', isTarget: false, hint: 'Mined surface grass and soil. No minerals detected here.' },
    { id: 2, initialType: 'stone', label: 'Granite Stone', isTarget: false, hint: 'Standard gray stone. Echoes suggest minerals are deeper.' },
    { id: 3, initialType: 'dirt', label: 'Verdant Turf', isTarget: false, hint: 'Just loose dirt and roots. Keep exploring the fissure.' },
    { id: 4, initialType: 'stone', label: 'Deep Bedrock', isTarget: true, hint: 'VIBRATIONS DETECTED! A deep Diamond Ore vein is forming!' },
    { id: 5, initialType: 'stone', label: 'Cobblestone', isTarget: false, hint: 'Cracked cobblestone deposit. Only loose rubble found.' },
    { id: 6, initialType: 'dirt', label: 'Mossy Earth', isTarget: false, hint: 'Moist cavern soil. Nothing valuable inside.' },
  ];

  const handleBlockClick = (block: TerrainBlock) => {
    if (phase === 'mining' || phase === 'gem_ready' || phase === 'claimed') return;

    // Search Phase
    if (phase === 'search') {
      sound.playMineCrack();
      setMinedIds((prev) => ({ ...prev, [block.id]: true }));

      if (!block.isTarget) {
        sound.playBlockBreak();
        setFeedback(block.hint);
        setFeedbackType('wrong');
        return;
      }

      // Found the target deposit! Form the Diamond Ore!
      sound.playPortalCharge(0.7);
      sound.playXpGain();
      setPhase('ore_formed');
      setFeedbackType('success');
      setFeedback('💎 CRYSTALLINE SURGE! DIAMOND ORE HAS FORMED! Strike it with your pickaxe!');
      return;
    }

    // Ore Formed Phase - clicking the Diamond Ore triggers multi-strike mining
    if (phase === 'ore_formed' && block.isTarget) {
      setPhase('mining');
      setFeedbackType('success');
      setFeedback('⛏️ STRIKING DIAMOND ORE: CRACKING BEDROCK...');

      sound.playMineCrack();
      setCrackStage(1);

      setTimeout(() => {
        sound.playMineCrack();
        setCrackStage(2);
        setFeedback('⛏️ CRACK... CRACK... FAULT LINE EXPANDING...');
      }, 450);

      setTimeout(() => {
        sound.playMineCrack();
        setCrackStage(3);
        setFeedback('⛏️ ORE SHATTERING...');
      }, 900);

      setTimeout(() => {
        sound.playBlockBreak();
        sound.playXpGain();
        setCrackStage(4);
        setPhase('gem_ready');
        setFeedback('✨ DIAMOND EXTRACTED! CLICK BELOW TO CLAIM YOUR GEM!');
      }, 1400);
    }
  };

  const handleClaimDiamond = () => {
    if (phase !== 'gem_ready') return;
    sound.playXpGain();
    setPhase('claimed');
    setFeedback('🎉 DIAMOND CLAIMED! +250 XP ADDED TO INVENTORY!');

    setTimeout(() => {
      onComplete();
    }, 1600);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0c0c0c] bg-immersive-grid text-[#f0f0f0] font-mono flex flex-col items-center justify-center p-4 pt-16 pb-20 select-none overflow-hidden">
      <VoxelParticles type={phase === 'gem_ready' || phase === 'claimed' ? 'portal' : 'ambient'} count={35} />

      {/* Hazard Corner Accents */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 bg-hazard-stripes pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rotate-180 bg-hazard-stripes pointer-events-none" />

      {/* Main Quest Container */}
      <main className="z-20 max-w-2xl w-full mx-auto my-auto flex flex-col items-center gap-5 text-center">
        
        {/* Branding Hierarchy */}
        <div className="mb-2 space-y-1">
          <h2 className="text-zinc-500 text-sm tracking-[0.3em] uppercase">PRARAMBH presents</h2>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white drop-shadow-[4px_4px_0_#333]">
            TECHNOTICA 2.0
          </h1>
        </div>

        {/* Immersive Main Card */}
        <div className="w-full bg-[#2a2a2a] border-4 border-[#1a1a1a] p-6 sm:p-8 shadow-[12px_12px_0_0_#000] relative">
          
          {/* Immersive Corner Torches */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black">
            <div className="w-2 h-4 bg-orange-900" />
          </div>

          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-zinc-700 text-[#3cff00] text-[11px] uppercase tracking-wider mb-2 shadow-[2px_2px_0_0_#000]">
              <Search size={13} className="text-[#3cff00]" />
              <span>QUEST 3 • SUBTERRANEAN EXPEDITION</span>
            </div>
            <h3 className="text-xl sm:text-2xl text-white uppercase tracking-wider font-bold">
              THE MINING TEST
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              Mine through the grass & stone terrain to uncover the diamond vein, then claim your gem.
            </p>
          </div>

          {/* Pickaxe Tool Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border-2 border-zinc-700 text-xs font-mono text-zinc-300 shadow-[2px_2px_0_0_#000] mb-4">
            <Pickaxe size={14} className={`text-[#3cff00] ${phase === 'mining' ? 'animate-bounce' : ''}`} />
            <span>TOOL: ENCHANTED DIAMOND PICKAXE</span>
          </div>

          {/* Block Selection Grid: All Grass & Stone initially */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 items-center justify-center py-4 bg-[#1a1a1a] border-2 border-zinc-700 p-4 shadow-[4px_4px_0_0_#000]">
            {terrainBlocks.map((b) => {
              const isMined = minedIds[b.id];
              const isTargetDeposit = b.isTarget;

              // If gem is extracted on target block
              if (isTargetDeposit && (phase === 'gem_ready' || phase === 'claimed')) {
                return (
                  <div
                    key={b.id}
                    onClick={handleClaimDiamond}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex flex-col items-center justify-center bg-black border-4 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.8)] p-2 relative cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-10 h-10 bg-cyan-400 border-2 border-white rotate-45 flex items-center justify-center animate-bounce">
                      <Gem size={18} className="text-black -rotate-45" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-300 mt-1 font-bold tracking-wider">
                      {phase === 'claimed' ? 'CLAIMED!' : 'CLICK TO CLAIM'}
                    </span>
                  </div>
                );
              }

              // If target deposit has formed into Diamond Ore
              if (isTargetDeposit && (phase === 'ore_formed' || phase === 'mining')) {
                return (
                  <div key={b.id} className="flex flex-col items-center gap-1 animate-pulse">
                    <VoxelBlock
                      type="diamond"
                      crackStage={crackStage}
                      selected={true}
                      onClick={() => handleBlockClick(b)}
                      id={`mine-test-diamond-ore-${b.id}`}
                    />
                  </div>
                );
              }

              // Mined empty normal block
              if (isMined && !isTargetDeposit) {
                return (
                  <div
                    key={b.id}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex flex-col items-center justify-center bg-black/80 border-2 border-zinc-800 opacity-60"
                  >
                    <span className="text-xl">🪨</span>
                    <span className="text-[8px] text-zinc-600 uppercase font-mono mt-1">DUG OUT</span>
                  </div>
                );
              }

              // Default unmined Grass/Stone block
              return (
                <div key={b.id} className="flex flex-col items-center gap-1">
                  <VoxelBlock
                    type={b.initialType}
                    crackStage={0}
                    selected={false}
                    onClick={() => handleBlockClick(b)}
                    id={`mine-test-block-${b.id}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Dynamic Feedback Console */}
          <div className={`mt-4 w-full p-3 border-2 text-center text-xs font-mono transition-colors shadow-[2px_2px_0_0_#000] ${
            feedbackType === 'wrong'
              ? 'bg-red-950/40 border-red-600 text-red-400'
              : feedbackType === 'success'
              ? 'bg-black border-[#3cff00] text-[#3cff00]'
              : 'bg-black border-zinc-800 text-zinc-400'
          }`}>
            {feedback}
          </div>

          {/* Interactive Claim Button when Gem is Ready */}
          {phase === 'gem_ready' && (
            <div className="mt-4 animate-bounce">
              <button
                id="claim-diamond-btn"
                type="button"
                onClick={handleClaimDiamond}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase tracking-widest text-sm sm:text-base border-2 border-white shadow-[0_6px_0_0_#0284c7] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Gem size={18} />
                <span>[ CLAIM DIAMOND GEM (+250 XP) ]</span>
              </button>
            </div>
          )}

        </div>

        {/* Inventory & Environmental Log */}
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <div className="bg-[#222] p-3 border-2 border-[#333] w-48 text-left shadow-[4px_4px_0_0_#000]">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Inventory</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-yellow-500 text-sm">
                🪙
              </div>
              <div className={`w-8 h-8 bg-black/40 border flex items-center justify-center text-sm ${phase === 'claimed' ? 'border-cyan-400 text-cyan-300' : 'border-zinc-800 text-zinc-600'}`}>
                {phase === 'claimed' ? '💎' : '⛏️'}
              </div>
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                ⚡
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-left max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#3cff00]">
              Environmental Log
            </span>
            <p className="text-xs text-zinc-500 italic">
              "Dense crystalline pressure detected deep within the fissure."
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}


