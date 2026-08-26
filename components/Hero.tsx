'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Play, 
  Clock, 
  BookOpen, 
  MapPin, 
  Compass, 
  Radio, 
  Church,
  CheckCircle2,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Sermon } from '@/lib/types';

interface HeroProps {
  onPlanVisit: () => void;
  onPlayFeaturedSermon?: () => void;
  onExploreEvents?: () => void;
  featuredSermon?: Sermon;
}

export function Hero({ 
  onPlanVisit, 
  onPlayFeaturedSermon, 
  onExploreEvents,
  featuredSermon 
}: HeroProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handlePlaySermon = () => {
    if (onPlayFeaturedSermon) onPlayFeaturedSermon();
    else {
      const el = document.getElementById('sermons');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreEvents = () => {
    if (onExploreEvents) onExploreEvents();
    else {
      const el = document.getElementById('events');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText('Vine House Ministries, Greater London & Essex, UK (Charity No: 1148977)');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section 
      id="hero-sanctuary" 
      className="relative min-h-[94vh] flex flex-col justify-between pt-28 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/15 overflow-hidden"
    >
      {/* Precision Corner Crosshairs (Architectural Drafting Detail) */}
      <div className="absolute top-4 left-4 text-[#8A9A86]/50 font-sans text-xs select-none pointer-events-none">+</div>
      <div className="absolute top-4 right-4 text-[#8A9A86]/50 font-sans text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 left-4 text-[#8A9A86]/50 font-sans text-xs select-none pointer-events-none">+</div>
      <div className="absolute bottom-4 right-4 text-[#8A9A86]/50 font-sans text-xs select-none pointer-events-none">+</div>

      {/* Main Center Content Section */}
      <div className="relative my-auto py-10 sm:py-16 lg:py-20 text-center">
        
        {/* Architectural Sanctuary Floor Elevation Wireframe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none text-[#2C3E2D]">
          <svg className="w-full max-w-5xl h-auto" viewBox="0 0 900 450" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="150" y="50" width="600" height="350" rx="4" />
            <rect x="180" y="80" width="540" height="290" strokeDasharray="4 4" />
            <path d="M 350,50 C 350,150 550,150 550,50" />
            <circle cx="450" cy="120" r="16" />
            <line x1="450" y1="140" x2="450" y2="400" strokeWidth="1.5" />
            <line x1="220" y1="180" x2="410" y2="180" />
            <line x1="490" y1="180" x2="680" y2="180" />
            <line x1="220" y1="220" x2="410" y2="220" />
            <line x1="490" y1="220" x2="680" y2="220" />
            <line x1="220" y1="260" x2="410" y2="260" />
            <line x1="490" y1="260" x2="680" y2="260" />
            <line x1="220" y1="300" x2="410" y2="300" />
            <line x1="490" y1="300" x2="680" y2="300" />
            <line x1="150" y1="50" x2="750" y2="400" strokeDasharray="2 4" />
            <line x1="750" y1="50" x2="150" y2="400" strokeDasharray="2 4" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Monumental Hero Headline */}
          <h1 className="font-anton text-[3.5rem] xs:text-[4rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] select-none break-words">
            Structure <span className="text-[#8A9A86]">&amp;</span>
            <br />
            <span className="text-[#1E242B]">Deep Reverence</span>
          </h1>

          {/* Mission Subtitle with High Legibility */}
          <p className="mt-6 sm:mt-8 max-w-2xl mx-auto font-sans text-base sm:text-lg md:text-xl text-[#1E242B]/85 leading-relaxed text-center px-4">
            A welcoming Christian community in Greater London &amp; Essex—gathering for thoughtful scripture, contemplative worship, and authentic fellowship.
          </p>
        </motion.div>

        {/* Primary Action Buttons Suite (Clean architectural borders, no pill shapes) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 sm:mt-12 flex flex-row items-center justify-center gap-3 sm:gap-4 relative z-10 w-full max-w-lg mx-auto"
        >
          {/* Primary CTA: Plan a Visit */}
          <button
            id="btn-hero-plan-visit"
            onClick={onPlanVisit}
            className="group flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 sm:py-4 bg-[#D4A373] text-[#1E242B] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg hover:bg-[#c69464] transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <span>PLAN A VISIT</span>
            <ArrowUpRight className="w-4 h-4 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0" />
          </button>

          {/* Secondary CTA: Listen to Message */}
          <button
            id="btn-hero-play-sermon"
            onClick={handlePlaySermon}
            className="group flex-1 sm:flex-initial px-5 sm:px-7 py-3.5 sm:py-4 bg-white/95 border border-[#2C3E2D]/35 text-[#2C3E2D] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-2xs hover:shadow-xs whitespace-nowrap cursor-pointer"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#2C3E2D] text-[#D4A373] group-hover:bg-[#D4A373] group-hover:text-[#1E242B] flex items-center justify-center transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5" />
            </div>
            <span>LISTEN TO MESSAGE</span>
          </button>
        </motion.div>
      </div>

      {/* Hero Interactive Status Bento Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="relative z-10 pt-10 border-t border-[#2C3E2D]/15 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
      >
        {/* Bento Card 1: Next Gathering */}
        <div className="p-6 bg-white rounded-xl border border-[#8A9A86]/30 shadow-2xs flex flex-col justify-between group hover:border-[#2C3E2D] transition-colors space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-xs uppercase font-bold text-[#D4A373] tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4A373] shrink-0" />
                Next Liturgy
              </span>
              <span className="font-sans text-xs text-[#8A9A86] bg-[#F3EFE6] px-2.5 py-0.5 rounded-md font-medium">Hall A</span>
            </div>
            <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-tight text-[#2C3E2D] leading-tight">
              Sunday Morning Worship &amp; Communion
            </h4>
            <p className="text-[#1E242B]/80 text-sm leading-relaxed">
              10:00 AM Liturgy &amp; 12:00 PM Service • In-Person &amp; Live Stream
            </p>
          </div>

          <div className="pt-4 border-t border-[#8A9A86]/15 flex items-center justify-between">
            <span className="font-sans text-xs text-[#8A9A86]">Sanctuary &amp; Childcare Open</span>
            <button 
              onClick={onPlanVisit}
              className="group inline-flex items-center gap-1 font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D] hover:text-[#D4A373] transition-colors relative pb-0.5 border-b border-[#2C3E2D]/20 hover:border-[#D4A373] cursor-pointer"
            >
              <span>RSVP Pass</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8A9A86] group-hover:text-[#D4A373] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Bento Card 2: Current Teaching Series Spotlight */}
        <div className="p-6 bg-white rounded-xl border border-[#8A9A86]/30 shadow-2xs flex flex-col justify-between group hover:border-[#2C3E2D] transition-colors space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-xs uppercase font-bold text-[#2C3E2D] tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#D4A373]" />
                Current Teaching Series
              </span>
              <span className="font-sans text-xs text-[#8A9A86] bg-[#F3EFE6] px-2.5 py-0.5 rounded-md font-medium">Ep. 01</span>
            </div>
            <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-tight text-[#2C3E2D] leading-tight">
              {featuredSermon?.title || 'Abiding in the Sacred Vine'}
            </h4>
            <p className="text-[#1E242B]/80 font-sans text-sm leading-relaxed">
              {featuredSermon?.scripture || 'John 15:1–8'} • {featuredSermon?.speaker || 'Pastor Mercy Yerifor'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#8A9A86]/15 flex items-center justify-between">
            <span className="font-sans text-xs text-[#8A9A86]">{featuredSermon?.duration || '38 mins'} • Audio &amp; Study</span>
            <button 
              onClick={handlePlaySermon}
              className="group px-3.5 py-1.5 bg-[#2C3E2D] hover:bg-[#1E242B] border border-[#2C3E2D] text-[#F9F7F2] rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current text-[#D4A373] group-hover:scale-110 transition-transform" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Bento Card 3: Scripture Anchor & Sanctuary Transit */}
        <div className="p-6 bg-white rounded-xl border border-[#8A9A86]/30 shadow-2xs flex flex-col justify-between group hover:border-[#2C3E2D] transition-colors space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-xs uppercase font-bold text-[#8A9A86] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2C3E2D]" />
                Scripture Anchor
              </span>
              <span className="font-sans text-xs text-[#8A9A86] bg-[#F3EFE6] px-2.5 py-0.5 rounded-md font-medium">1 Peter 2:5</span>
            </div>
            <p className="font-sans italic text-[#1E242B]/85 text-sm leading-relaxed pt-1">
              &ldquo;You also, like living stones, are being built into a spiritual house to be a holy priesthood...&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-[#8A9A86]/15 flex items-center justify-between">
            <button 
              onClick={handleCopyAddress}
              className="font-sans text-xs text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to copy address"
            >
              <MapPin className="w-4 h-4 text-[#D4A373]" />
              <span>{copiedAddress ? 'Address Copied!' : 'London & Essex (UK)'}</span>
            </button>
            <button 
              onClick={onPlanVisit}
              className="group inline-flex items-center gap-1 font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D] hover:text-[#D4A373] transition-colors relative pb-0.5 border-b border-[#2C3E2D]/20 hover:border-[#D4A373] cursor-pointer"
            >
              <span>Transit Guide</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8A9A86] group-hover:text-[#D4A373] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
