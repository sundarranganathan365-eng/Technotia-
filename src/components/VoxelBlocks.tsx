import React from 'react';

export function TorchBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Immersive UI Torch Pixel Block */}
      <div className="w-8 h-8 bg-[#ffaa00] shadow-[0_0_15px_#ffaa00] flex items-center justify-center border-2 border-black animate-torch">
        <div className="w-2 h-4 bg-orange-900 shadow-inner" />
      </div>
      {/* Wooden Mount */}
      <div className="w-2.5 h-6 bg-[#3d2314] border-x-2 border-black flex flex-col justify-between">
        <div className="w-full h-1 bg-[#1a0f08]" />
        <div className="w-full h-1 bg-[#5c371e]" />
      </div>
    </div>
  );
}

export function PixelHeart({ filled = true }: { filled?: boolean; key?: React.Key }) {
  return (
    <div className="w-6 h-6 relative inline-block transition-transform duration-200 hover:scale-110">
      {filled ? (
        <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-md">
          {/* Black pixel outline */}
          <path
            d="M2 3h4v1h1v1h2V4h1V3h4v4h-1v2h-1v2h-2v2h-2v2H7v-2H5v-2H3V9H2V7H1V3h1z"
            fill="#000000"
          />
          {/* Red fill */}
          <path
            d="M2 4h4v1h1v1h2V5h1V4h4v3h-1v2h-1v2h-2v2h-2v2H7v-2H5v-2H3V9H2V7H2V4z"
            fill="#e11d48"
          />
          {/* Highlight pixel */}
          <rect x="3" y="4" width="2" height="2" fill="#fda4af" />
          <rect x="9" y="4" width="2" height="2" fill="#fda4af" />
          {/* Dark shade */}
          <rect x="4" y="9" width="2" height="2" fill="#9f1239" />
          <rect x="6" y="11" width="2" height="2" fill="#9f1239" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="w-full h-full opacity-40">
          <path
            d="M2 3h4v1h1v1h2V4h1V3h4v4h-1v2h-1v2h-2v2h-2v2H7v-2H5v-2H3V9H2V7H1V3h1z"
            fill="#000000"
          />
          <path
            d="M2 4h4v1h1v1h2V5h1V4h4v3h-1v2h-1v2h-2v2h-2v2H7v-2H5v-2H3V9H2V7H2V4z"
            fill="#334155"
          />
        </svg>
      )}
    </div>
  );
}

export function GoldCoin({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-12 h-12 flex items-center justify-center animate-float-bob ${className}`}>
      {/* Outer aura */}
      <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-sm animate-pulse" />
      
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_4px_10px_rgba(234,179,8,0.7)]">
        {/* Pixel Coin Body */}
        <rect x="6" y="2" width="12" height="20" fill="#000" />
        <rect x="4" y="4" width="16" height="16" fill="#000" />
        <rect x="2" y="6" width="20" height="12" fill="#000" />

        {/* Gold base */}
        <rect x="6" y="3" width="12" height="18" fill="#ca8a04" />
        <rect x="4" y="5" width="16" height="14" fill="#eab308" />
        <rect x="3" y="6" width="18" height="12" fill="#facc15" />

        {/* Shading */}
        <rect x="5" y="5" width="2" height="3" fill="#fef08a" />
        <rect x="7" y="4" width="3" height="2" fill="#fef08a" />
        
        {/* Inner Crest (T for Technotica / Star) */}
        <rect x="10" y="8" width="4" height="2" fill="#a16207" />
        <rect x="11" y="10" width="2" height="6" fill="#a16207" />
        <rect x="10" y="9" width="4" height="1" fill="#713f12" />
      </svg>
    </div>
  );
}

export function MinecraftChest({ open = false }: { open?: boolean }) {
  return (
    <div className="w-16 h-16 relative">
      <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-lg">
        {/* Outline */}
        <rect x="2" y="4" width="28" height="24" fill="#000" />
        
        {/* Wood main body */}
        <rect x="3" y="5" width="26" height="22" fill="#8d5b28" />
        
        {/* Wood Grain details */}
        <rect x="5" y="7" width="22" height="18" fill="#a97138" />
        <rect x="4" y="6" width="24" height="2" fill="#bc8345" />
        <rect x="4" y="24" width="24" height="2" fill="#693f18" />
        
        {/* Metal banding */}
        <rect x="3" y="12" width="26" height="3" fill="#2d2d2d" />
        <rect x="3" y="13" width="26" height="1" fill="#4a4a4a" />
        
        {/* Lock Latch */}
        <rect x="14" y="10" width="4" height="7" fill="#111" />
        <rect x="15" y="11" width="2" height="5" fill="#d1d5db" />
        <rect x="15" y="13" width="2" height="2" fill="#9ca3af" />
      </svg>
      {open && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-[9px] font-pixel px-1 py-0.5 rounded text-black font-bold whitespace-nowrap animate-bounce">
          OPENED!
        </div>
      )}
    </div>
  );
}

interface VoxelBlockProps {
  type: 'stone' | 'dirt' | 'coal' | 'iron' | 'diamond' | 'wood' | 'core_obsidian';
  crackStage?: number; // 0: clean, 1: light, 2: mid, 3: heavy
  selected?: boolean;
  onClick?: () => void;
  id?: string;
}

export function VoxelBlock({ type, crackStage = 0, selected = false, onClick, id }: VoxelBlockProps) {
  const getBlockStyles = () => {
    switch (type) {
      case 'dirt':
        return {
          bg: 'bg-[#5c3a21]',
          border: 'border-[#3f2715]',
          label: 'Dirt',
          color: '#5c3a21',
          topBorder: 'border-t-8 border-t-[#3b8526]', // grass top!
        };
      case 'coal':
        return {
          bg: 'bg-[#3b404d]',
          border: 'border-[#22252c]',
          label: 'Coal Ore',
          color: '#3b404d',
          accent: '#111827',
        };
      case 'iron':
        return {
          bg: 'bg-[#474d5c]',
          border: 'border-[#292d36]',
          label: 'Iron Ore',
          color: '#474d5c',
          accent: '#e2b391',
        };
      case 'diamond':
        return {
          bg: 'bg-[#3b4759]',
          border: 'border-[#1e2530]',
          label: 'Diamond Ore',
          color: '#3b4759',
          accent: '#38bdf8',
          glow: 'shadow-[0_0_20px_rgba(56,189,248,0.6)] border-cyan-400',
        };
      case 'wood':
        return {
          bg: 'bg-[#825329]',
          border: 'border-[#4e2f13]',
          label: 'Oak Wood',
          color: '#825329',
        };
      case 'core_obsidian':
        return {
          bg: 'bg-[#100c1e]',
          border: 'border-[#2e1065]',
          label: 'Ancient Obsidian',
          color: '#100c1e',
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.7)]',
        };
      case 'stone':
      default:
        return {
          bg: 'bg-[#4b5261]',
          border: 'border-[#2d313a]',
          label: 'Stone',
          color: '#4b5261',
        };
    }
  };

  const style = getBlockStyles();

  return (
    <button
      id={id || `block-${type}`}
      onClick={onClick}
      type="button"
      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-none border-4 transition-transform cursor-pointer hover:scale-105 active:scale-95 group focus:outline-hidden ${style.bg} ${style.border} ${style.topBorder || ''} ${style.glow || ''} ${selected ? 'ring-4 ring-cyan-400 scale-105' : ''}`}
      style={{
        boxShadow: 'inset 3px 3px 0 rgba(255,255,255,0.2), inset -3px -3px 0 rgba(0,0,0,0.4)',
      }}
    >
      {/* Voxel texture details */}
      <div className="absolute inset-1 grid grid-cols-4 grid-rows-4 gap-0.5 opacity-80 pointer-events-none">
        {type === 'diamond' && (
          <>
            <div className="col-start-2 row-start-2 w-3 h-3 bg-cyan-300 border border-cyan-100 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <div className="col-start-3 row-start-3 w-4 h-3 bg-cyan-400 border border-cyan-200 shadow-[0_0_8px_#38bdf8]" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <div className="col-start-4 row-start-1 w-2.5 h-3 bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
          </>
        )}
        {type === 'coal' && (
          <>
            <div className="col-start-2 row-start-2 w-4 h-4 bg-black border border-neutral-700" />
            <div className="col-start-3 row-start-3 w-3 h-3 bg-neutral-900" />
            <div className="col-start-1 row-start-4 w-3 h-2 bg-black" />
          </>
        )}
        {type === 'iron' && (
          <>
            <div className="col-start-2 row-start-2 w-3.5 h-3 bg-[#e2b391] border border-[#f5d0b5]" />
            <div className="col-start-3 row-start-3 w-4 h-3.5 bg-[#d99f79]" />
            <div className="col-start-1 row-start-1 w-3 h-2 bg-[#e2b391]" />
          </>
        )}
        {type === 'wood' && (
          <div className="col-span-4 row-span-4 border-y-2 border-[#5c3717] flex flex-col justify-around py-1">
            <div className="w-full h-1 bg-[#613b18]" />
            <div className="w-full h-1 bg-[#9c6636]" />
            <div className="w-full h-1 bg-[#613b18]" />
          </div>
        )}
        {type === 'dirt' && !style.topBorder && (
          <>
            <div className="col-start-2 row-start-1 w-2 h-2 bg-[#784c2a]" />
            <div className="col-start-3 row-start-3 w-2 h-2 bg-[#422915]" />
          </>
        )}
      </div>

      {/* Break Cracks Overlay */}
      {crackStage > 0 && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
            {crackStage >= 1 && (
              <path
                d="M50 50 L30 20 M50 50 L70 30 M50 50 L40 80 M50 50 L80 70"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="square"
              />
            )}
            {crackStage >= 2 && (
              <path
                d="M30 20 L15 10 M70 30 L90 20 M40 80 L20 90 M80 70 L95 85 M50 50 L20 50 M50 50 L50 20 M50 50 L80 50"
                stroke="#111"
                strokeWidth="5"
                strokeLinecap="square"
              />
            )}
            {crackStage >= 3 && (
              <path
                d="M0 0 L100 100 M100 0 L0 100 M20 50 L80 50 M50 20 L50 80"
                stroke="#000"
                strokeWidth="6"
                strokeLinecap="square"
              />
            )}
          </svg>
        </div>
      )}

      {/* Block Type Tag on Hover */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-[10px] font-pixel px-2 py-0.5 rounded text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-neutral-700 z-30">
        {style.label}
      </div>
    </button>
  );
}
