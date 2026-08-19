import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VoxelParticles } from './VoxelParticles';
import { sound } from '../utils/audio';
import { ChevronDown, RotateCcw, Home } from 'lucide-react';

interface ScrollAnimationScreenProps {
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const TOTAL_FRAMES = 211;

export function ScrollAnimationScreen({
  onRestart,
  soundEnabled,
  onToggleSound,
}: ScrollAnimationScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Preload all 211 frames into memory
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumStr = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNumStr}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        count++;
        loadedImages[i - 1] = img;
        setLoadedCount(count);

        if (count === TOTAL_FRAMES) {
          imagesRef.current = loadedImages;
          setIsPreloaded(true);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          imagesRef.current = loadedImages;
          setIsPreloaded(true);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Render a specific frame index on the HTML5 Canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete) return;

    ctx.fillStyle = '#0a0f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Maintain aspect ratio cover fill
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Handle window resizing & initial canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrame);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, renderFrame]);

  // Initial draw when preloaded
  useEffect(() => {
    if (isPreloaded) {
      renderFrame(1);
    }
  }, [isPreloaded, renderFrame]);

  // Handle scroll events to scrub through frames
  useEffect(() => {
    if (!isPreloaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = container.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);

      const targetFrame = Math.min(
        Math.max(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1, 1),
        TOTAL_FRAMES
      );

      if (targetFrame !== currentFrame) {
        setCurrentFrame(targetFrame);
        renderFrame(targetFrame);

        // Subtle audio tick on frame shifts
        if (targetFrame % 15 === 0 && soundEnabled) {
          sound.playClick();
        }
      }

      // Mark finished when we reach the last frame
      if (targetFrame >= TOTAL_FRAMES && !isFinished) {
        setIsFinished(true);
        sound.playFanfare();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPreloaded, currentFrame, renderFrame, soundEnabled, isFinished]);

  const handleTryAgain = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    onRestart();
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-[500vh] bg-[#0a0f14] font-mono select-none">

      {/* Fixed Sticky Viewport for Canvas Animation */}
      <div className="fixed inset-0 z-10 w-full h-full overflow-hidden flex flex-col">

        {/* HTML5 Canvas Surface */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Voxel Overlay */}
        <VoxelParticles type="portal" count={20} />

        {/* Initial Loading Modal overlay until preloaded */}
        {!isPreloaded && (
          <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-[#1a1a1a] border-4 border-zinc-800 p-8 max-w-md w-full shadow-[12px_12px_0_0_#000] text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#3cff00] border-t-transparent animate-spin mx-auto" />
              <h3 className="text-sm uppercase tracking-widest text-[#3cff00] font-bold">
                PRELOADING 211 HIGH-DEF FRAMES...
              </h3>
              <p className="text-xs text-zinc-400">
                Caching animation sequence into memory for smooth scroll performance.
              </p>
              <div className="w-full bg-black border-2 border-zinc-700 h-4 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                <div
                  className="bg-[#3cff00] h-full transition-all duration-150"
                  style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {loadedCount} / {TOTAL_FRAMES} FRAMES READY ({Math.floor((loadedCount / TOTAL_FRAMES) * 100)}%)
              </div>
            </div>
          </div>
        )}

        {/* Center Scroll Prompt (Fades out once scrolled) */}
        {isPreloaded && scrollProgress < 0.05 && !isFinished && (
          <div className="z-30 mx-auto my-auto text-center animate-bounce pointer-events-none">
            <div className="bg-black/80 backdrop-blur-sm border-2 border-[#3cff00] px-6 py-3 shadow-[6px_6px_0_0_#000] space-y-1">
              <div className="text-[#3cff00] font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                <ChevronDown size={18} className="animate-pulse" />
                <span>SCROLL DOWN TO ANIMATE WORLD</span>
                <ChevronDown size={18} className="animate-pulse" />
              </div>
              <p className="text-[10px] text-zinc-400 uppercase">
                Use mouse wheel or touch swipe
              </p>
            </div>
          </div>
        )}

        {/* "Try Again" button appears at bottom once animation completes */}
        {isFinished && (
          <div className="z-30 mt-auto mb-10 mx-auto text-center">
            <button
              type="button"
              onClick={handleTryAgain}
              className="px-10 py-4 bg-[#3cff00] hover:bg-[#34dd00] text-black font-mono font-bold text-sm tracking-wider cursor-pointer border-b-4 border-[#2a8800] active:translate-y-1 shadow-[4px_4px_0_0_#000] flex items-center justify-center gap-2 uppercase"
            >
              <Home size={16} />
              <span>[ TRY AGAIN ]</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
