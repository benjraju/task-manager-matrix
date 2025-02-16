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

    // Matrix colors
    const matrixGreen = '#0F1B0F'; // Very dark green for background
    const matrixBright = '#22FF22'; // Bright green for leading characters
    const matrixDim = '#003B00'; // Darker green for trailing characters

    const draw = () => {
      // Create a semi-transparent fade effect with very dark green
      ctx.fillStyle = `rgba(0, 5, 0, ${fadeStrength})`; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the characters
      for (let i = 0; i < drops.length; i++) {
        // Generate a random character from our character set
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Calculate position
        const x = i * charSize;
        const y = drops[i] * charSize;

        // Create gradient for each drop
        const gradient = ctx.createLinearGradient(x, y - charSize * 4, x, y);
        gradient.addColorStop(0, 'rgba(0, 59, 0, 0)'); // Fade to transparent
        gradient.addColorStop(0.4, 'rgba(0, 59, 0, 0.5)'); // Mid fade
        gradient.addColorStop(1, 'rgba(34, 255, 34, 0.8)'); // Brightest at bottom

        // Draw main character
        ctx.font = `${charSize}px monospace`;
        
        // Leading character (brighter)
        if (Math.random() < 0.1) { // 10% chance for bright character
          ctx.fillStyle = matrixBright;
          ctx.globalAlpha = 0.8;
        } else {
          ctx.fillStyle = matrixDim;
          ctx.globalAlpha = 0.5;
        }
        
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

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
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 0 }}
    />
  );
} 