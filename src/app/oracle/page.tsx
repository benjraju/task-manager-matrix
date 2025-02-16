'use client';

import MatrixRain from '../components/MatrixRain'
import MorpheusChat from '../components/MorpheusChat'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'

const glitchVariants: Variants = {
  animate: {
    textShadow: [
      "0 0 4px #78A892",
      "2px 2px 4px #78A892",
      "-2px -2px 4px #78A892",
      "0 0 4px #78A892"
    ],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};

export default function OraclePage() {
  return (
    <div className="min-h-screen bg-black text-[#78A892] relative">
      <MatrixRain />
      
      {/* Glowing circuit lines in the background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-px h-1/3 bg-gradient-to-b from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-1/3 bg-gradient-to-b from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-px h-1/3 bg-gradient-to-t from-transparent via-[#78A892]/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-px h-1/3 bg-gradient-to-t from-transparent via-[#78A892]/30 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <motion.h1 
              className="text-4xl font-bold mb-2 font-mono relative"
              variants={glitchVariants}
              animate="animate"
            >
              Matrix Oracle System
            </motion.h1>
            <motion.p 
              className="text-[#78A892]/80 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Seek wisdom. Find guidance. Choose your path.
            </motion.p>
            
            {/* Decorative elements */}
            <motion.div
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-12 bg-[#78A892]/20"
              animate={{ 
                height: ["48px", "24px", "48px"],
                opacity: [0.2, 0.5, 0.2] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-[#78A892]/20 
                       text-[#78A892] font-mono hover:bg-[#78A892]/10 transition-all duration-300
                       hover:border-[#78A892]/40 hover:scale-105 relative group"
            >
              <motion.span
                className="absolute inset-0 bg-[#78A892]/5 rounded-xl"
                animate={{
                  background: [
                    "rgba(120, 168, 146, 0.05)",
                    "rgba(120, 168, 146, 0.1)",
                    "rgba(120, 168, 146, 0.05)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <svg 
                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Return to System
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#78A892]/30" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#78A892]/30" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#78A892]/30" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#78A892]/30" />
          
          <MorpheusChat />
        </motion.div>
      </div>
    </div>
  );
} 