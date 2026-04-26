"use client";

import { useEffect, useRef } from "react";

const CELL_SIZE = 10;
const ALIVE_PROBABILITY = 0.25;
const TICK_INTERVAL = 120; // ms between generations

function createGrid(cols: number, rows: number): Uint8Array {
  const grid = new Uint8Array(cols * rows);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < ALIVE_PROBABILITY ? 1 : 0;
  }
  return grid;
}

function nextGeneration(grid: Uint8Array, cols: number, rows: number): Uint8Array {
  const next = new Uint8Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = (row + dr + rows) % rows;
          const c = (col + dc + cols) % cols;
          neighbors += grid[r * cols + c];
        }
      }
      const alive = grid[row * cols + col];
      if (alive) {
        next[row * cols + col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        next[row * cols + col] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  return next;
}

export default function GameOfLifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = Math.ceil(window.innerWidth / CELL_SIZE);
    let rows = Math.ceil(window.innerHeight / CELL_SIZE);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let grid = createGrid(cols, rows);
    let animationId: number;
    let lastTick = 0;

    const handleResize = () => {
      cols = Math.ceil(window.innerWidth / CELL_SIZE);
      rows = Math.ceil(window.innerHeight / CELL_SIZE);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      grid = createGrid(cols, rows);
    };

    window.addEventListener("resize", handleResize);

    const render = (timestamp: number) => {
      animationId = requestAnimationFrame(render);

      if (timestamp - lastTick < TICK_INTERVAL) return;
      lastTick = timestamp;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (grid[row * cols + col]) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            // Subtle white cells with slight glow effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
            ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          }
        }
      }

      grid = nextGeneration(grid, cols, rows);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#050505] pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
