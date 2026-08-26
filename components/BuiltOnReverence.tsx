'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Leaf } from 'lucide-react';

export function BuiltOnReverence({ onPlanVisit }: { onPlanVisit: () => void }) {
  const [lightingMode, setLightingMode] = useState<'daylight' | 'vigil'>('daylight');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const sanctuaryImage = lightingMode === 'daylight' 
    ? 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80' // golden hour vineyard rows
    : 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80'; // contemplative vineyard twilight

  const hotspots = [
    {
      id: 'cross',
      x: '50%',
      y: '45%',
      title: 'The Cross of Christ',
      desc: 'The enduring emblem of redemption, standing firmly in the midst of the living vine (John 15:5).'
    },
    {
      id: 'vines',
      x: '25%',
      y: '68%',
      title: 'Living Vineyards & Branches',
      desc: 'Reflecting Christ as the True Vine and believers as the branches bearing good fruit.'
    },
    {
      id: 'harvest',
      x: '78%',
      y: '60%',
      title: 'Communion Harvest',
      desc: 'The fruit of the vine representing the new covenant cup shared during weekly communion.'
    }
  ];

  return (
    <section 
      id="about" 
      className="bg-[#2C3E2D] text-[#F9F7F2] py-24 sm:py-32 px-5 sm:px-8 lg:px-12 border-t border-[#1E242B]/40 transition-colors duration-500 relative overflow-hidden font-sans"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 arch-grid-dark opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[#D4A373]/60"></div>
          <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-semibold">
            About Vine House
          </span>
        </div>

        {/* Monolithic Statement Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight text-[#F9F7F2] leading-none">
            Built on Reverence.
          </h2>

          <div className="mt-8 max-w-3xl space-y-4">
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-[#F9F7F2]/90 leading-relaxed font-normal">
              We are a sanctuary that believes great faith is honest. No excess, no pretence — just space, 
              scripture, and people working together in holy alignment. Every gathering we host is a commitment 
              to spiritual grounding.
            </p>
            <p className="font-sans text-sm sm:text-base text-[#8A9A86]">
              The spiritual truth is found in the removal of the unnecessary.
            </p>
          </div>
        </motion.div>

        {/* Interactive Sanctuary Visualizer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative rounded-2xl overflow-hidden border border-[#8A9A86]/30 bg-[#1E242B] shadow-2xl group"
        >
          {/* Main Sanctuary Showcase Image */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full min-h-[360px] sm:min-h-[480px]">
            <Image
              src={sanctuaryImage}
              alt="Vineyard with the Cross of Jesus Christ"
              fill
              className="object-cover transition-all duration-700 brightness-90 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B]/90 via-transparent to-[#2C3E2D]/30" />

            {/* Sacred Cross Centerpiece Silhouette with Holy Radiance */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative flex flex-col items-center justify-center">
                {/* Soft warm golden radiance behind the cross */}
                <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-2xl bg-[#D4A373]/25 blur-2xl animate-pulse pointer-events-none" />
                
                {/* Cross Vector Structure */}
                <svg
                  viewBox="0 0 100 140"
                  className="w-20 h-28 sm:w-28 sm:h-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter transition-transform duration-700 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Timber texture & shadow */}
                  <defs>
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A3525" />
                      <stop offset="50%" stopColor="#2E1F14" />
                      <stop offset="100%" stopColor="#1A110B" />
                    </linearGradient>
                    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#D4A373" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#D4A373" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Vertical Beam */}
                  <rect x="44" y="6" width="12" height="128" rx="2" fill="url(#woodGradient)" stroke="#D4A373" strokeWidth="1" strokeOpacity="0.4" />
                  
                  {/* Horizontal Beam */}
                  <rect x="18" y="38" width="64" height="12" rx="2" fill="url(#woodGradient)" stroke="#D4A373" strokeWidth="1" strokeOpacity="0.4" />

                  {/* Sacred Cross Center Intersection Accent */}
                  <circle cx="50" cy="44" r="3.5" fill="#D4A373" fillOpacity="0.8" />
                  
                  {/* Radiant subtle aura rays */}
                  <line x1="50" y1="2" x2="50" y2="0" stroke="url(#goldGlow)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="14" y1="44" x2="12" y2="44" stroke="url(#goldGlow)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="86" y1="44" x2="88" y2="44" stroke="url(#goldGlow)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Interactive Hotspots (Refined rectangular badges, no pill shapes) */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.y, left: spot.x }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => setSelectedHotspot(selectedHotspot === spot.id ? null : spot.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    selectedHotspot === spot.id 
                      ? 'bg-[#D4A373] text-[#1E242B] ring-2 ring-[#D4A373]/60 scale-110 font-bold' 
                      : 'bg-[#1E242B]/85 backdrop-blur-md text-[#F9F7F2] border border-[#8A9A86]/60 hover:bg-[#D4A373] hover:text-[#1E242B]'
                  }`}
                  title={spot.title}
                >
                  <span className="text-sm font-sans font-bold leading-none">+</span>
                </button>

                {/* Popover Card */}
                <AnimatePresence>
                  {selectedHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 p-4 bg-[#1E242B] border border-[#D4A373]/40 rounded-xl shadow-2xl text-left z-30 pointer-events-auto"
                    >
                      <h4 className="font-anton text-base uppercase text-[#D4A373] tracking-wide">{spot.title}</h4>
                      <p className="font-sans text-xs sm:text-sm text-[#F9F7F2]/90 mt-1.5 leading-relaxed">{spot.desc}</p>
                      <button 
                        onClick={() => setSelectedHotspot(null)}
                        className="mt-3 text-xs font-sans font-bold text-[#8A9A86] hover:text-[#F9F7F2] cursor-pointer"
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Bottom Visualizer Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-4 bg-[#1E242B]/90 backdrop-blur-md rounded-xl border border-[#8A9A86]/30 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#D4A373] shrink-0" />
              <span className="font-sans text-xs sm:text-sm text-[#F9F7F2]/90">The True Vine • Christ &amp; His Branches</span>
            </div>

            {/* Lighting Mode Selector */}
            <div className="flex items-center gap-1.5 bg-[#2C3E2D]/80 border border-[#8A9A86]/30 p-1.5 rounded-lg">
              <button
                onClick={() => setLightingMode('daylight')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  lightingMode === 'daylight' 
                    ? 'bg-[#D4A373] text-[#1E242B] font-bold shadow-xs' 
                    : 'text-[#F9F7F2]/70 hover:text-[#F9F7F2]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Daylight Service</span>
              </button>
              <button
                onClick={() => setLightingMode('vigil')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  lightingMode === 'vigil' 
                    ? 'bg-[#D4A373] text-[#1E242B] font-bold shadow-xs' 
                    : 'text-[#F9F7F2]/70 hover:text-[#F9F7F2]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Evening Vigil</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Philosophy Footnote Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p className="font-sans text-base sm:text-lg text-[#F9F7F2]/85 italic leading-relaxed">
            &ldquo;Our approach prioritizes clarity over complexity. This ensures that every element serves a distinct spiritual function, resulting in a cohesive and enduring faith.&rdquo;
          </p>
          <span className="block mt-2 font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
            — Mercy Yerifor, Lead Pastor
          </span>
        </motion.div>

      </div>
    </section>
  );
}
