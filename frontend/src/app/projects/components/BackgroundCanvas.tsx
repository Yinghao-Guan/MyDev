// frontend/src/app/projects/components/BackgroundCanvas.tsx
"use client";
import React, { useEffect, useRef } from 'react';
import styles from './Realibuddy.module.css';

export default function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 关键修改：获取父容器的尺寸，而不是 window 的尺寸
        const parent = canvas.parentElement;
        if (!parent) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let time = 0;
        let mousePos = { x: 0, y: 0 };

        // Resize handler function
        const handleResize = () => {
            width = canvas.width = parent.clientWidth;
            height = canvas.height = parent.clientHeight;
            mousePos = { x: width/2, y: height/2 };
        };

        // Initial sizing
        handleResize();
        // Listen to window resize to trigger container resize recalc
        window.addEventListener('resize', handleResize);

        const config = {
            particleCount: 50,
            maxDistance: 150,
            colors: {
                primary: 'rgba(59, 130, 246, ',
                white: 'rgba(255, 255, 255, '
            }
        };

        const particles: any[] = [];
        const initParticles = () => {
             particles.length = 0; // clear
             for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        };
        initParticles();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        // Use parent for mouse events so it's relative to the component
        parent.addEventListener('mousemove', handleMouseMove as any);

        let animationFrameId: number;

        const animate = () => {
            time++;
            ctx.clearRect(0, 0, width, height);

            // Draw Waves
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                const yBase = height * (0.3 + i * 0.2);
                ctx.moveTo(0, yBase);
                for(let x=0; x<=width; x+=10) {
                     ctx.lineTo(x, yBase + Math.sin(x*0.01 - i*0.002 + time*(0.02+i*0.01)) * (30+i*10));
                }
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                const gradient = ctx.createLinearGradient(0, yBase, 0, height);
                gradient.addColorStop(0, config.colors.primary + (0.1 - i*0.02) + ')');
                gradient.addColorStop(1, config.colors.primary + '0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Draw Particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if(p.x < 0 || p.x > width) p.vx *= -1;
                if(p.y < 0 || p.y > height) p.vy *= -1;

                const dx = mousePos.x - p.x;
                const dy = mousePos.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 200) {
                    p.x += dx/dist * 0.5;
                    p.y += dy/dist * 0.5;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
                const pulse = Math.sin(time*0.05 + p.pulsePhase)*0.5 + 0.5;
                ctx.fillStyle = config.colors.white + (0.3 + pulse*0.3) + ')';
                ctx.fill();

                for(let j=0; j<particles.length; j++) {
                    const p2 = particles[j];
                    const pdx = p.x - p2.x;
                    const pdy = p.y - p2.y;
                    const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
                    if(pdist < config.maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = config.colors.primary + (1 - pdist/config.maxDistance)*0.2 + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if(parent) parent.removeEventListener('mousemove', handleMouseMove as any);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.animatedBgContainer} />;
}