'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (using a mix of characters that look techy)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charSize = 14;
    const columns = canvas.width / charSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Animation settings
    const fadeStrength = 0.05; // Controls the fade effect (0-1)
    const dropSpeed = 0.8; // Controls how fast the characters fall
    const spawnRate = 0.02; // Controls how often new drops are created (0-1)

    const draw = () => {
      // Create a semi-transparent fade effect
      ctx.fillStyle = `rgba(15, 23, 42, ${fadeStrength})`; // Using the background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set the character style
      ctx.fillStyle = '#78A892'; // Main color matching your theme
      ctx.font = `${charSize}px monospace`;

      // Draw the characters
      for (let i = 0; i < drops.length; i++) {
        // Generate a random character from our character set
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Calculate position
        const x = i * charSize;
        const y = drops[i] * charSize;

        // Draw the character with a gradient effect
        const gradient = ctx.createLinearGradient(x, y - charSize * 4, x, y);
        gradient.addColorStop(0, 'rgba(120, 168, 146, 0)'); // Fade out at the top
        gradient.addColorStop(0.4, 'rgba(120, 168, 146, 0.5)'); // Mid fade
        gradient.addColorStop(1, 'rgba(120, 168, 146, 1)'); // Full strength at the bottom
        ctx.fillStyle = gradient;
        ctx.fillText(char, x, y);

        // Reset drop when it reaches bottom or randomly
        if (y > canvas.height || Math.random() > 0.98) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i] += dropSpeed;
      }

      // Randomly create new drops
      for (let i = 0; i < drops.length; i++) {
        if (drops[i] <= 0 && Math.random() < spawnRate) {
          drops[i] = 0;
        }
      }

      requestAnimationFrame(draw);
    };

    const animationFrame = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
} 