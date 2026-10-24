"use client";

import { useEffect, useRef, useState } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  density: number;
  alpha: number;
  speed: number;
}

export function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Respect system reduced-motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setEnabled(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const flakesCount = Math.min(50, Math.floor(width / 25));
    const flakes: Snowflake[] = [];

    for (let i = 0; i < flakesCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        density: Math.random() * flakesCount,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.8 + 0.4,
      });
    }

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      angle += 0.01;

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speed;
        f.x += Math.sin(angle + f.density) * 0.5;

        // Reset if off-screen
        if (f.y > height) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        if (f.x > width) {
          f.x = 0;
        } else if (f.x < 0) {
          f.x = width;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 248, 255, ${f.alpha})`;
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
