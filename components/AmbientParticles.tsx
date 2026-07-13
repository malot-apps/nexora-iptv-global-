"use client";

import React, { useEffect, useRef } from "react";

interface AmbientParticlesProps {
  accentColor?: string;
  count?: number;
}

export default function AmbientParticles({ accentColor = "#a78bfa", count = 40 }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // If particle floats off the top, reset it to the bottom
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
          this.opacity = 0.1;
        }

        // Horizontal boundaries
        if (this.x < 0 || this.x > width) {
          this.speedX = -this.speedX;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = accentColor;
        context.shadowColor = accentColor;
        context.shadowBlur = 6;
        context.fill();
        context.restore();
      }
    }

    // Initialize particle array
    const particlesArray: Particle[] = Array.from({ length: count }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic rendering loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor, count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-screen"
      style={{ willChange: "transform" }}
    />
  );
}
