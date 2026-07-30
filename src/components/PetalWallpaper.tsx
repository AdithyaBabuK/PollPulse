import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Wind, Sliders, Sparkles } from 'lucide-react';

const bgImage = new URL('../assets/images/mystic_red_tree_1785428703563.jpg', import.meta.url).href;

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  step: number;
  color: string;
  opacity: number;
  flipSpeed: number;
  flipAngle: number;
}

interface Ember {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulseSpeed: number;
  pulse: number;
  color: string;
}

interface PetalWallpaperProps {
  petalDensity?: number; // default ~70
  speedMultiplier?: number;
}

const PETAL_COLORS = [
  '#ff2d55', // Vivid Crimson
  '#ff4d79', // Neon Rose
  '#e6004c', // Deep Cherry Red
  '#ff8099', // Glowing Pink
  '#ff1a40', // Bright Red
  '#d90429', // Ruby Red
];

const EMBER_COLORS = [
  '#ff3366',
  '#ff6688',
  '#ff99aa',
  '#ffcc00',
];

export const PetalWallpaper: React.FC<PetalWallpaperProps> = ({
  petalDensity = 80,
  speedMultiplier = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [density, setDensity] = useState<number>(petalDensity);
  const [windIntensity, setWindIntensity] = useState<number>(1.2);
  const [showControls, setShowControls] = useState<boolean>(false);

  const mousePosRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mousePosRef.current.x;
      const prevY = mousePosRef.current.y;
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      mousePosRef.current.vx = (e.clientX - prevX) * 0.05;
      mousePosRef.current.vy = (e.clientY - prevY) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Petals
    const createPetal = (initialYRandom = true): Petal => {
      const size = Math.random() * 8 + 6;
      return {
        x: Math.random() * (width + 200) - 100,
        y: initialYRandom ? Math.random() * height : -30,
        size,
        speedY: (Math.random() * 1.2 + 0.8) * speedMultiplier,
        speedX: (Math.random() * 0.8 - 0.2) * speedMultiplier,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        oscillationSpeed: Math.random() * 0.03 + 0.01,
        oscillationDistance: Math.random() * 25 + 10,
        step: Math.random() * Math.PI * 2,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: Math.random() * 0.4 + 0.5,
        flipSpeed: Math.random() * 0.05 + 0.01,
        flipAngle: Math.random() * Math.PI,
      };
    };

    // Initialize Embers
    const createEmber = (): Ember => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.04 + 0.01,
      pulse: Math.random() * Math.PI,
      color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    });

    let petals: Petal[] = Array.from({ length: density }, () => createPetal(true));
    let embers: Ember[] = Array.from({ length: 40 }, () => createEmber());

    // Draw single stylized petal
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.flipAngle), 1); // 3D flip effect

      ctx.beginPath();
      // Draw smooth petal curves using bezier
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.9, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      // Glow shadow for petals
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      ctx.fill();
      ctx.restore();
    };

    // Draw ember particle
    const drawEmber = (e: Ember) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      const alpha = Math.abs(Math.sin(e.pulse)) * e.opacity;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        // Update & Render Embers
        embers.forEach((ember) => {
          ember.y += ember.speedY;
          ember.x += ember.speedX + Math.sin(ember.pulse) * 0.2;
          ember.pulse += ember.pulseSpeed;

          if (ember.y < -10) {
            ember.y = height + 10;
            ember.x = Math.random() * width;
          }

          drawEmber(ember);
        });

        // Mouse influence decay
        const mouseVx = mousePosRef.current.vx;
        const mouseVy = mousePosRef.current.vy;
        mousePosRef.current.vx *= 0.92;
        mousePosRef.current.vy *= 0.92;

        // Update & Render Petals
        petals.forEach((p) => {
          p.step += p.oscillationSpeed;
          p.flipAngle += p.flipSpeed;
          p.rotation += p.rotationSpeed;

          // Natural sway + base wind
          const sway = Math.sin(p.step) * (p.oscillationDistance * 0.05);
          p.x += p.speedX + sway + windIntensity + mouseVx;
          p.y += p.speedY + mouseVy;

          // Proximity to mouse displacement
          const dx = p.x - mousePosRef.current.x;
          const dy = p.y - mousePosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 4;
            p.y += (dy / dist) * force * 4;
          }

          // Screen reset wrapping
          if (p.y > height + 30) {
            Object.assign(p, createPetal(false));
          }
          if (p.x > width + 100) {
            p.x = -50;
          } else if (p.x < -100) {
            p.x = width + 50;
          }

          drawPetal(p);
        });
      } else {
        // Paused state still draws last static snapshot
        embers.forEach(drawEmber);
        petals.forEach(drawPetal);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, density, windIntensity, speedMultiplier]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(0.85) contrast(1.15) saturate(1.2)',
        }}
      />

      {/* Dark Ambient Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 backdrop-blur-[0.5px]" />

      {/* Animated Petals & Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle Floating Wallpaper Controls Widget */}
      <div className="absolute bottom-4 left-4 z-40 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/10 backdrop-blur-md shadow-xl transition-all duration-200"
          title="Wallpaper Animation Settings"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="hidden sm:inline">Live Wallpaper</span>
        </button>

        {showControls && (
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-xl text-white text-xs shadow-2xl animate-fadeIn">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isPlaying ? 'Pause Wallpaper' : 'Play Wallpaper'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
              <Wind className="w-3.5 h-3.5 text-rose-400" />
              <label className="text-[10px] text-slate-300 font-semibold">Wind:</label>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={windIntensity}
                onChange={(e) => setWindIntensity(parseFloat(e.target.value))}
                className="w-16 accent-rose-500 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <label className="text-[10px] text-slate-300 font-semibold">Petals:</label>
              <input
                type="range"
                min="30"
                max="180"
                step="10"
                value={density}
                onChange={(e) => setDensity(parseInt(e.target.value, 10))}
                className="w-16 accent-rose-500 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
