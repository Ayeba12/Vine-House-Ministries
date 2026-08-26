'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Clock, MapPin, X, Users, HeartHandshake, BookOpen, Compass } from 'lucide-react';
import { GatheringPillar } from '@/lib/types';
import { GATHERING_PILLARS } from '@/lib/data';

export function GatheringsGrid({ onPlanVisit }: { onPlanVisit: () => void }) {
  const [selectedPillar, setSelectedPillar] = useState<GatheringPillar | null>(null);

  return (
    <section 
      id="gatherings" 
      className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid font-sans"
    >
      {/* Section Header */}
      <div className="pb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
            Our Gatherings &amp; Ministry Pillars
          </span>
          <div className="flex-1 h-px bg-[#2C3E2D]/15"></div>
        </div>

        <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-[#2C3E2D]">
          FROM LITURGY TO LIFE
        </h2>
      </div>

      {/* Modular Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {GATHERING_PILLARS.map((pillar, idx) => (
          <motion.div
            key={pillar.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => setSelectedPillar(pillar)}
            className="group relative bg-white overflow-hidden rounded-xl border border-[#8A9A86]/30 transition-all duration-300 cursor-pointer min-h-[380px] flex flex-col justify-between shadow-2xs hover:shadow-xl hover:border-[#2C3E2D]"
          >
            {/* Image Banner Header */}
            {pillar.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-[#1E242B]">
                <Image
                  src={pillar.imageUrl}
                  alt={pillar.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none z-10" />
                
                {/* Monolithic Number Tag on Image */}
                <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-[#1E242B]/90 backdrop-blur-md rounded-lg text-[#D4A373] border border-white/10 font-anton text-lg sm:text-xl tracking-wider shadow-xs">
                  {pillar.number}
                </div>

                {/* Subtitle tag */}
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-md text-[#2C3E2D] font-sans font-bold text-xs uppercase tracking-wider shadow-2xs">
                  {pillar.subtitle}
                </div>
              </div>
            )}

            {/* Bottom info container */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
              <div>
                <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#D4A373] transition-colors leading-tight">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-[#1E242B]/80 line-clamp-2 leading-relaxed mt-2.5">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2C3E2D]/10">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-sans text-[#1E242B]/75 mb-3">
                  <Clock className="w-4 h-4 shrink-0 text-[#D4A373]" />
                  <span className="font-medium">{pillar.timing}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="group/link inline-flex items-center gap-1 text-xs font-sans font-bold uppercase tracking-wider text-[#2C3E2D] group-hover:text-[#D4A373] pb-0.5 border-b border-[#2C3E2D]/20 group-hover:border-[#D4A373] transition-all duration-200">
                    <span>Gathering Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#8A9A86] group-hover:text-[#D4A373] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0" />
                  </span>
                  <span className="text-xs font-sans text-[#8A9A86] bg-[#F3EFE6] px-2.5 py-1 rounded-md font-medium">
                    {pillar.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* 5th Architectural / Theological Reflection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 lg:col-span-2 relative overflow-hidden bg-[#2C3E2D] text-[#F9F7F2] p-8 sm:p-10 rounded-xl border border-[#D4A373]/30 flex flex-col justify-between shadow-xl"
        >
          {/* Subtle Background Pattern & Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,163,115,0.15),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-md bg-[#D4A373]"></span>
              <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
                Sanctuary Rhythm • Monolithic Liturgy • Greater London &amp; Essex
              </span>
            </div>

            <h4 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F9F7F2] max-w-2xl leading-tight">
              A Rhythm of Rest, Scripture &amp; Communal Hospitality
            </h4>

            <p className="font-sans text-sm sm:text-base text-[#F9F7F2]/85 leading-relaxed max-w-2xl">
              Every gathering at Vine House is curated without performative hype. From weekly communion 
              at the solid oak altar to quiet Wednesday scripture exegesis and neighborhood house tables, we honor historical Christian 
              faith practices within an architecturally serene, contemporary atmosphere.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-sans text-xs sm:text-sm text-[#F9F7F2]/80">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#D4A373] shrink-0" /> All Gatherings Free &amp; Open
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#D4A373] shrink-0" /> Vine Kids Sanctuary
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D4A373] shrink-0" /> Step-Free Accessible
              </span>
            </div>

            <button
              onClick={onPlanVisit}
              className="group px-6 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <span>Plan Your Visit</span>
              <ArrowUpRight className="w-4 h-4 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Gathering Detail Modal with Image Header */}
      <AnimatePresence>
        {selectedPillar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E242B]/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F9F7F2] text-[#1E242B] max-w-lg w-full rounded-2xl border border-[#8A9A86]/30 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Image Header */}
              {selectedPillar.imageUrl && (
                <div className="relative h-48 w-full bg-[#1E242B]">
                  <Image
                    src={selectedPillar.imageUrl}
                    alt={selectedPillar.title}
                    fill
                    className="object-cover brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B]/90 via-transparent to-transparent" />
                  
                  <button
                    onClick={() => setSelectedPillar(null)}
                    className="absolute top-4 right-4 p-2 bg-[#1E242B]/80 text-[#F9F7F2] hover:bg-[#D4A373] hover:text-[#1E242B] rounded-lg transition-colors z-10 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-4 left-6 right-6 text-[#F9F7F2]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-anton text-lg text-[#D4A373]">{selectedPillar.number}</span>
                      <span className="font-sans text-xs uppercase tracking-widest text-[#F9F7F2]/80 font-bold">
                        {selectedPillar.subtitle}
                      </span>
                    </div>
                    <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight leading-tight">
                      {selectedPillar.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/25 space-y-2 font-sans text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-[#1E242B]">
                    <Clock className="w-4 h-4 text-[#D4A373]" />
                    <span className="font-semibold">{selectedPillar.timing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1E242B]">
                    <MapPin className="w-4 h-4 text-[#2C3E2D]" />
                    <span>{selectedPillar.location} (Sanctuary Campus)</span>
                  </div>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#1E242B]/85 leading-relaxed">
                  {selectedPillar.description}
                </p>

                <div className="pt-2">
                  <span className="font-sans text-xs uppercase text-[#8A9A86] font-bold block mb-2">Focus Areas:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPillar.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 bg-[#8A9A86]/15 text-[#2C3E2D] rounded-md font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#2C3E2D]/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedPillar(null)}
                    className="px-5 py-2.5 bg-white border border-[#8A9A86]/35 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] text-[#2C3E2D] hover:text-[#F9F7F2] text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPillar(null);
                      onPlanVisit();
                    }}
                    className="group px-6 py-2.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <span>RSVP / Plan To Attend</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
