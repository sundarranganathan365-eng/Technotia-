import React, { useEffect, useState, useRef } from 'react';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CinematicTransitionProps {
  onComplete: () => void;
}

export function CinematicTransition({ onComplete }: CinematicTransitionProps) {
  const [currentStatus, setCurrentStatus] = useState('CREATING MINECRAFT WORLD...');
  const [progress, setProgress] = useState(5);
  const [flash, setFlash] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Step 1: Building Terrain (0.3s)
    const t1 = setTimeout(() => {
      sound.playPortalCharge(0.2);
      setCurrentStatus('GENERATING SEED & TERRAIN NOISE...');
      setProgress(30);
    }, 300);

    // Step 2: Preparing Spawns & Biomes (0.8s)
    const t2 = setTimeout(() => {
      sound.playPortalCharge(0.5);
      setCurrentStatus('PLACING BIOMES & SPAWNING CORE RELICS...');
      setProgress(65);
    }, 800);

    // Step 3: Loading chunks (1.4s)
    const t3 = setTimeout(() => {
      sound.playPortalCharge(0.85);
      setCurrentStatus('BUILDING CHUNKS & ANCHORING PRARAMBH MATRIX...');
      setProgress(90);
    }, 1400);

    // Step 4: Final 100% (2.0s)
    const t4 = setTimeout(() => {
      sound.playPortalCharge(1.0);
      setCurrentStatus('WORLD READY: LAUNCHING 211-FRAME SCROLL REVEAL...');
      setProgress(100);
    }, 2000);

    // Step 5: Portal Boom Flash (2.4s)
    const t5 = setTimeout(() => {
      sound.playPortalBoom();
      setFlash(true);
      setPortalOpen(true);
    }, 2400);

    // Step 6: Trigger Scroll Animation (3.0s)
    const t6 = setTimeout(() => {
      setFlash(false);
      onCompleteRef.current();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []); // Empty dependency array to prevent timer resets on parent re-renders!

  const handleSkip = () => {
    sound.playClick();
    onCompleteRef.current();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0c0c] bg-immersive-grid flex flex-col items-center justify-center p-6 select-none overflow-hidden font-mono text-[#f0f0f0]">
      {/* High-intensity Portal Particles */}
      <VoxelParticles type="portal" count={70} />

      {/* Dramatic Flash Effect */}
      {flash && (
        <div className="fixed inset-0 z-50 bg-[#3cff00] pointer-events-none animate-ping opacity-90" />
      )}

      {/* Central Portal Vortex Graphic */}
      <div className={`relative transition-transform duration-1000 ${portalOpen ? 'scale-150' : 'scale-90'} mb-8`}>
        <div className="w-36 h-36 sm:w-52 sm:h-52 rounded-full border-4 border-[#3cff00] bg-gradient-to-tr from-black via-[#1a2f10] to-[#0c0c0c] shadow-[0_0_80px_#3cff00] flex items-center justify-center animate-spin" style={{ animationDuration: '3.5s' }}>
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#3cff00]/30 blur-sm animate-pulse" />
        </div>
      </div>

      {/* Minecraft-Inspired World Creation Terminal Card */}
      <div className="w-full max-w-lg bg-[#1a1a1a] border-4 border-[#111] p-6 shadow-[12px_12px_0_0_#000] space-y-4 relative">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-zinc-700 pb-2 text-[11px] text-zinc-400">
          <span className="text-white font-bold tracking-wider">CREATING WORLD</span>
          <span className="text-[#3cff00] animate-pulse font-bold">● {progress}%</span>
        </div>

        {/* Current Generation Phase Message */}
        <div className="text-center py-2 min-h-[48px] flex items-center justify-center">
          <p className="text-xs sm:text-sm text-[#3cff00] font-bold tracking-wide uppercase">
            {currentStatus}
          </p>
        </div>

        {/* Retro Voxel Progress Bar */}
        <div className="w-full h-5 bg-black border-2 border-zinc-700 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
          <div
            className="h-full bg-[#3cff00] transition-all duration-300 ease-out shadow-[0_0_10px_#3cff00]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Minecraft Seed Metadata */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
          <span>SEED: [PRARAMBH_TECHNOTICA_2.0]</span>
          <span>MODE: ADVENTURE</span>
        </div>

        {/* Skip button for instant transition */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2.5 bg-[#3cff00] hover:bg-[#34dd00] text-black font-bold text-xs uppercase tracking-wider shadow-[0_4px_0_0_#2a8800] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>OPEN 211-FRAME SCROLL REVEAL NOW</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
