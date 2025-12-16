"use client";
import React, { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Configuration from original background-animation.js
        const gridSize = 40;
        const points: {x: number, y: number, originX: number, originY: number}[] = [];

        // Initialize grid points
        for(let x = 0; x <= width + gridSize; x += gridSize) {
            for(let y = 0; y <= height + gridSize; y += gridSize) {
                points.push({
                    x: x, y: y,
                    originX: x, originY: y
                });
            }
        }

        let frameId = 0;
        let time = 0;

        const animate = () => {
            time += 0.05;
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
            ctx.lineWidth = 1;

            // Update points (Wave effect)
            points.forEach(p => {
                const dist = Math.sqrt((p.originX - width/2)**2 + (p.originY - height/2)**2);
                const angle = dist * 0.003 - time;
                // Simple sine wave offset
                p.x = p.originX + Math.sin(angle) * 10;
                p.y = p.originY + Math.cos(angle) * 10;
            });

            // Draw Grid Lines
            ctx.beginPath();
            // Horizontal lines logic simplified for performance
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                // Connect to right neighbor
                if (i + 1 < points.length && points[i+1].originX > p.originX) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(points[i+1].x, points[i+1].y);
                }
                // Connect to bottom neighbor (approximate based on grid calc)
                const bottomIndex = points.findIndex(bp => Math.abs(bp.originX - p.originX) < 1 && bp.originY > p.originY);
                if (bottomIndex !== -1 && Math.abs(points[bottomIndex].originY - p.originY - gridSize) < 5) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(points[bottomIndex].x, points[bottomIndex].y);
                }
            }
            ctx.stroke();

            frameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Re-init points logic usually goes here, but skipping for simplicity
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{position: 'absolute', top:0, left:0, width:'100%', height:'100%', opacity: 0.2, pointerEvents: 'none'}} />;
}