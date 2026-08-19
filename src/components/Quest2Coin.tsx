import React, { useState } from 'react';
import { GoldCoin, MinecraftChest } from './VoxelBlocks';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { Sparkles, Search, CheckCircle2, Box, Pickaxe } from 'lucide-react';

interface Quest2CoinProps {
  onComplete: () => void;
}

export function Quest2Coin({ onComplete }: Quest2CoinProps) {
  const [found, setFound] = useState(false);
  const [inspectionMsg, setInspectionMsg] = useState('Explore the mine shafts and inspect containers to locate the ancient gold coin.');
  const [openedChest, setOpenedChest] = useState(false);

  const handleInspectObject = (name: string, isCoin = false) => {
    if (found) return;

    if (isCoin) {
      sound.playCoin();
      sound.playXpGain();
      setFound(true);
      setInspectionMsg('✨ GOLD COIN DISCOVERED! Ancient relic acquired!');
      setTimeout(() => {
        onComplete();
      }, 1800);
    } else {
      sound.playClick();
      const messages: Record<string, string> = {
        barrel_1: '📦 A wooden barrel... contains only cobwebs and sawdust.',
        barrel_2: '📦 An old storage barrel... empty.',
        coal_ore: '⛏️ Coal Ore vein embedded in the wall. Valuable for torches.',
        iron_ore: '⛏️ Raw Iron Ore deposit. Sturdy metal!',
        stone_rubble: '🪨 A pile of loose cobblestone. Nothing beneath it.',
        minecart: '🛒 A rusty abandoned minecart. The wheels are squeaky.',
        torch: '🔥 The torch flame flickers softly in the underground draft.',
        chest: '📦 Inspecting the ancient chest...',
      };
      setInspectionMsg(messages[name] || `Inspected ${name}. Keep searching!`);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0c0c0c] bg-immersive-grid text-[#f0f0f0] font-mono flex flex-col items-center justify-center p-4 pt-16 pb-20 select-none overflow-hidden">
      <VoxelParticles type={found ? 'celebration' : 'ambient'} count={found ? 40 : 25} />

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

          <div className="mb-5 text-center">
            <h3 className="text-xl text-[#3cff00] mb-2 uppercase tracking-widest font-bold">
              LOST RELIC DETECTED
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              A gleaming ancient gold coin is hidden within this forgotten shaft. Search the containers to retrieve it.
            </p>
          </div>

          {/* Interactive Minefield Scene Layout */}
          <div className="relative w-full h-[260px] sm:h-[300px] bg-[#1a1a1a] border-2 border-zinc-700 p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between overflow-hidden">
            
            {/* Upper Rail Track */}
            <div className="w-full h-4 border-b border-dashed border-zinc-700 flex justify-between px-2 text-[10px] text-zinc-500 font-mono">
              <span>══ RAIL TUNNEL 02 ══</span>
              <span>══ SHAFT SECTOR B ══</span>
            </div>

            {/* Middle Exploratory Items Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 items-end justify-items-center py-2 z-20">
              
              {/* Item 1: Barrel 1 */}
              <button
                id="mine-item-barrel-1"
                type="button"
                onClick={() => handleInspectObject('barrel_1')}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-12 h-14 bg-[#5c3a21] border-2 border-[#2b1809] flex flex-col justify-between p-1 shadow-[2px_2px_0_0_#000] group-hover:border-[#ffaa00]">
                  <div className="w-full h-1 bg-[#2b1809]" />
                  <div className="w-full h-1 bg-[#7d502f]" />
                  <div className="w-full h-1 bg-[#2b1809]" />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">Barrel</span>
              </button>

              {/* Item 2: Coal Deposit */}
              <button
                id="mine-item-coal"
                type="button"
                onClick={() => handleInspectObject('coal_ore')}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 bg-[#27272a] border-2 border-black p-1 shadow-[2px_2px_0_0_#000] group-hover:border-zinc-400">
                  <div className="w-3 h-3 bg-black border border-zinc-700" />
                  <div className="w-2 h-2 bg-black ml-auto mt-1" />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">Coal</span>
              </button>

              {/* Item 3: Minecart */}
              <button
                id="mine-item-cart"
                type="button"
                onClick={() => handleInspectObject('minecart')}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-16 h-10 bg-[#3f3f46] border-2 border-black flex items-center justify-center relative shadow-[2px_2px_0_0_#000] group-hover:border-zinc-300">
                  <div className="w-full h-2 bg-[#18181b] absolute top-0" />
                  <span className="text-[9px] font-mono text-zinc-300">CART</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">Cart</span>
              </button>

              {/* Item 4: Iron Ore */}
              <button
                id="mine-item-iron"
                type="button"
                onClick={() => handleInspectObject('iron_ore')}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 bg-[#52525b] border-2 border-black p-1 shadow-[2px_2px_0_0_#000] group-hover:border-orange-300">
                  <div className="w-3 h-3 bg-[#e2b391] border border-[#f5d0b5]" />
                  <div className="w-2 h-2 bg-[#d99f79] ml-2 mt-1" />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">Iron</span>
              </button>

              {/* Item 5: Ancient Chest with Hidden Coin */}
              <div className="flex flex-col items-center relative">
                <button
                  id="mine-item-chest"
                  type="button"
                  onClick={() => {
                    setOpenedChest(true);
                    handleInspectObject('chest');
                  }}
                  className="group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <MinecraftChest open={openedChest || found} />
                  <span className="text-[9px] font-mono text-zinc-400 mt-1 block text-center">
                    Chest
                  </span>
                </button>

                {/* The Hidden Gold Coin reveals when chest is opened OR directly clickable */}
                {(openedChest || found) && (
                  <button
                    id="lost-gold-coin-target"
                    type="button"
                    onClick={() => handleInspectObject('gold_coin', true)}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 cursor-pointer animate-bounce hover:scale-125 transition-transform"
                    title="Click to take the Gold Coin!"
                  >
                    <GoldCoin />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#ffaa00] text-black font-mono text-[9px] px-1.5 py-0.5 whitespace-nowrap font-bold shadow-[2px_2px_0_0_#000]">
                      TAKE COIN!
                    </span>
                  </button>
                )}
              </div>

              {/* Item 6: Barrel 2 */}
              <button
                id="mine-item-barrel-2"
                type="button"
                onClick={() => {
                  if (!openedChest) setOpenedChest(true);
                  handleInspectObject('barrel_2');
                }}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="w-12 h-14 bg-[#4a2e16] border-2 border-[#2b1809] flex flex-col justify-between p-1 shadow-[2px_2px_0_0_#000] group-hover:border-[#ffaa00]">
                  <div className="w-full h-1 bg-[#2b1809]" />
                  <div className="w-full h-1 bg-[#6d4422]" />
                  <div className="w-full h-1 bg-[#2b1809]" />
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">Barrel</span>
              </button>

            </div>

            {/* Bottom Floor Bedrock Strip */}
            <div className="w-full h-5 bg-black border-t border-zinc-800 flex items-center justify-between px-3 text-[9px] font-mono text-zinc-500">
              <span>TUNNEL BEDROCK Y: -32</span>
              <span>LIGHT LEVEL: 14</span>
            </div>

          </div>

          {/* Discovery / Inspection Feedback Console */}
          <div className="mt-4 p-3 bg-black border-2 border-zinc-800 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Search size={14} className="shrink-0 text-[#ffaa00]" />
              <span>{inspectionMsg}</span>
            </div>

            {found && (
              <div className="shrink-0 px-3 py-1 bg-[#3cff00] text-black font-mono text-xs font-bold shadow-[2px_2px_0_0_#000]">
                +150 XP!
              </div>
            )}
          </div>

        </div>

        {/* Inventory & Environmental Log */}
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <div className="bg-[#222] p-3 border-2 border-[#333] w-48 text-left shadow-[4px_4px_0_0_#000]">
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Inventory</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-yellow-500 text-sm">
                {found ? '🪙' : '📜'}
              </div>
              <div className="w-8 h-8 bg-black/40 border border-zinc-800 flex items-center justify-center text-sm">
                ⛏️
              </div>
              <div className="w-8 h-8 bg-black/40 border border-zinc-800" />
            </div>
          </div>

          <div className="flex flex-col justify-center text-left max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#3cff00]">
              Environmental Log
            </span>
            <p className="text-xs text-zinc-500 italic">
              "Echoes of pickaxes bounce off the subterranean walls..."
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

