'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';

export function VoicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section 
      id="voices" 
      className="py-24 sm:py-36 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid overflow-hidden text-center font-sans"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto pb-12 sm:pb-16 border-b border-[#2C3E2D]/15">
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#2C3E2D]">
          WHAT ARE
        </h2>
        <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold my-2 sm:my-0">
          — Sanctuary Reflections &amp; Voices —
        </span>
        <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#2C3E2D]">
          THEY SAYING?
        </h2>
      </div>

      {/* Main Testimonial Carousel Card */}
      <div className="max-w-4xl mx-auto py-12 sm:py-16 relative">
        <div className="w-12 h-12 rounded-xl bg-[#2C3E2D] text-[#D4A373] flex items-center justify-center mx-auto mb-8 shadow-md">
          <Quote className="w-5 h-5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="font-sans text-xl sm:text-3xl md:text-4xl text-[#1E242B] font-normal leading-relaxed max-w-3xl mx-auto">
              &ldquo;{current.quote}&rdquo;
            </p>

            <div className="pt-6 flex flex-col items-center justify-center gap-3">
              {current.avatarUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#D4A373] shadow-md">
                  <Image
                    src={current.avatarUrl}
                    alt={current.author}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div>
                <span className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-[#2C3E2D] block">
                  {current.author}
                </span>
                <span className="font-sans text-xs sm:text-sm text-[#8A9A86] font-medium">
                  {current.role} • <span className="text-[#D4A373] font-bold">{current.tag}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation (No pill shapes) */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-lg bg-white border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2 items-center">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-sm transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#2C3E2D]' : 'w-3 bg-[#8A9A86]/30 hover:bg-[#8A9A86]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-lg bg-white border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
            aria-label="Next quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
