import React, { useEffect, useRef } from 'react';

interface BackgroundWaveProps {
  glowAccent?: 'green' | 'violet' | 'neutral';
}

export const BackgroundWave: React.FC<BackgroundWaveProps> = ({ glowAccent = 'neutral' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
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

    let t = 0;

    const render = () => {
      t += 0.007;
      ctx.clearRect(0, 0, width, height);

      // Gradient color based on active state
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      if (glowAccent === 'green') {
        gradient.addColorStop(0, 'rgba(118, 185, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(118, 185, 0, 0.25)');
        gradient.addColorStop(0.7, 'rgba(118, 185, 0, 0.45)');
        gradient.addColorStop(1, 'rgba(118, 185, 0, 0)');
      } else if (glowAccent === 'violet') {
        gradient.addColorStop(0, 'rgba(139, 124, 255, 0)');
        gradient.addColorStop(0.4, 'rgba(139, 124, 255, 0.35)');
        gradient.addColorStop(0.7, 'rgba(118, 185, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(139, 124, 255, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.3, 'rgba(118, 185, 0, 0.18)');
        gradient.addColorStop(0.7, 'rgba(139, 124, 255, 0.18)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      // Draw subtle background harmonic wave 1
      ctx.beginPath();
      const centerY = height * 0.58;

      ctx.lineWidth = 1;
      ctx.strokeStyle = gradient;

      for (let x = 0; x <= width; x += 4) {
        // Multi-frequency organic sine wave
        const y =
          centerY +
          Math.sin(x * 0.0025 + t) * 45 +
          Math.sin(x * 0.006 - t * 0.8) * 20 +
          Math.cos(x * 0.0012 + t * 0.4) * 35;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Soft glow pass
      ctx.shadowColor = glowAccent === 'green' ? 'rgba(118, 185, 0, 0.5)' : 'rgba(255, 255, 255, 0.25)';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw secondary faint echo wave
      ctx.beginPath();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';

      for (let x = 0; x <= width; x += 6) {
        const y =
          centerY +
          Math.sin(x * 0.002 - t * 0.6) * 35 +
          Math.sin(x * 0.0045 + t * 0.5) * 15;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [glowAccent]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
