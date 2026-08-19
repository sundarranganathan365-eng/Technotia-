import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'square' | 'circle';
}

interface VoxelParticlesProps {
  type?: 'ambient' | 'fire' | 'portal' | 'celebration';
  count?: number;
}

export function VoxelParticles({ type = 'ambient', count = 35 }: VoxelParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const getColors = () => {
      switch (type) {
        case 'fire':
          return ['#f59e0b', '#ef4444', '#fcd34d', '#ea580c'];
        case 'portal':
          return ['#38bdf8', '#818cf8', '#c084fc', '#06b6d4', '#e879f9'];
        case 'celebration':
          return ['#22c55e', '#38bdf8', '#eab308', '#f43f5e', '#a855f7'];
        case 'ambient':
        default:
          return ['#64748b', '#94a3b8', '#38bdf8', '#ca8a04', '#475569'];
      }
    };

    const colors = getColors();

    const particles: Particle[] = Array.from({ length: count }, () => {
      const maxLife = 80 + Math.random() * 120;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (type === 'celebration' ? 3 : 0.8),
        vy: type === 'portal' || type === 'fire' 
          ? -(0.5 + Math.random() * 1.5) 
          : (Math.random() - 0.5) * 0.8,
        size: Math.floor(Math.random() * 4) + 3, // pixelated square sizes (3px to 6px)
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.7,
        life: Math.random() * maxLife,
        maxLife,
        shape: 'square',
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        if (p.life > p.maxLife || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width;
          p.y = type === 'fire' || type === 'portal' ? height + 10 : Math.random() * height;
          p.life = 0;
          p.alpha = 0.3 + Math.random() * 0.7;
        }

        ctx.save();
        ctx.globalAlpha = Math.sin((p.life / p.maxLife) * Math.PI) * p.alpha;
        ctx.fillStyle = p.color;
        // Draw crisp pixel square
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
