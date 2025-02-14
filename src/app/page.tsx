'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

// Matrix Digital Rain Effect Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = '01マトリックス';
    const characters = matrix.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#78A892';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full opacity-50 pointer-events-none"
    />
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-[#78A892] relative overflow-hidden">
      <MatrixRain />
      
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-[#78A892] font-mono">
              Matrix Flow
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <p className="text-lg leading-8 text-[#78A892] mb-10 font-mono">
                Are you caught in the Matrix of endless tasks? Break free from the illusion of chaos. 
                Our task matrix system is your red pill to clarity and control.
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/signin"
                className="rounded-xl bg-[#78A892] px-8 py-4 text-lg font-mono font-semibold text-black shadow-sm hover:bg-[#5C8B75] hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(120,168,146,0.5)]"
              >
                Take the Red Pill
              </Link>
              <Link
                href="/demo"
                className="text-lg font-mono font-semibold text-[#78A892] hover:text-[#5C8B75] transition-colors duration-300 group"
              >
                See How Deep the Rabbit Hole Goes{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16 text-[#78A892] font-mono">
              Tools to Break Free from the System
            </h2>
          </motion.div>

          <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl border border-[#78A892] p-8 hover:shadow-[0_0_15px_rgba(120,168,146,0.3)] transition-shadow duration-300 bg-black/30"
                >
                  <div className="text-[#78A892] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#78A892] mb-2 font-mono">
                    {feature.title}
                  </h3>
                  <p className="text-[#78A892]/80 font-mono">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate py-16 sm:py-24 lg:py-32 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center relative z-10"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#78A892] font-mono">
              Ready to Unplug?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#78A892]/80 font-mono">
              Join the resistance. Take control of your digital life and bend reality to your will.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Link
                href="/signin"
                className="rounded-xl bg-[#78A892] px-8 py-4 text-lg font-mono font-semibold text-black shadow-sm hover:bg-[#5C8B75] hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(120,168,146,0.5)]"
              >
                Free Your Mind
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: 'Neural Task Mapping',
    description: 'Like Neo seeing the Matrix, visualize your tasks in a way that reveals their true importance.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Time Manipulation',
    description: 'Like bullet time, slow down chaos and track every moment with precision focus.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Digital Enlightenment',
    description: 'See patterns in the chaos, predict outcomes, and make decisions with oracle-like clarity.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];
