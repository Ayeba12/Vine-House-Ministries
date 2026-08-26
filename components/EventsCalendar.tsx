'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, ArrowUpRight, CheckCircle2, Ticket } from 'lucide-react';
import { ChurchEvent } from '@/lib/types';

interface EventsCalendarProps {
  events: ChurchEvent[];
  onOpenRsvp: (event: ChurchEvent) => void;
}

export function EventsCalendar({ events, onOpenRsvp }: EventsCalendarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Worship', 'Fellowship', 'Study', 'Outreach'];

  const filteredEvents = events.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  return (
    <section 
      id="events" 
      className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid font-sans"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-8 border-b border-[#2C3E2D]/15">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#8A9A86]"></div>
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              Community Calendar &amp; Registrations
            </span>
          </div>
          <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-[#2C3E2D]">
            SACRED GATHERINGS
          </h2>
        </div>

        <div className="font-sans text-xs sm:text-sm text-[#8A9A86]">
          <span>Automated RSVP / Sanctuary Seating / 2026</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                  : 'bg-white/90 border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:text-[#2C3E2D] hover:bg-white shadow-2xs'
              }`}
            >
              {cat === 'All' ? 'All Gatherings' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs sm:text-sm font-sans text-[#8A9A86]">
          Showing {filteredEvents.length} upcoming programs
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        {filteredEvents.map((ev, idx) => {
          const seatsLeft = ev.capacity - ev.rsvpdCount;
          const percentageFilled = Math.round((ev.rsvpdCount / ev.capacity) * 100);

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#8A9A86]/25 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Event Image Banner */}
              <div className="relative aspect-16/8 sm:aspect-21/9 w-full overflow-hidden bg-[#1E242B]">
                <Image
                  src={ev.imageUrl}
                  alt={ev.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B]/90 via-[#2C3E2D]/30 to-transparent" />

                {/* Category & Status Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-[#F9F7F2] text-[#2C3E2D] text-xs font-sans font-bold uppercase tracking-wider rounded-md shadow-xs">
                    {ev.category}
                  </span>
                  <span className="px-3 py-1 bg-[#1E242B]/90 backdrop-blur-md text-[#F9F7F2] text-xs font-sans rounded-md border border-white/15">
                    {seatsLeft > 0 ? `${seatsLeft} Seats Available` : 'Sold Out / Waitlist'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-[#F9F7F2] z-10">
                  <span className="font-sans text-xs text-[#D4A373] font-bold block mb-1">{ev.date}</span>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight line-clamp-1 leading-tight">
                    {ev.title}
                  </h3>
                </div>
              </div>

              {/* Event Body Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-sans text-[#1E242B]/80 pb-4 border-b border-[#2C3E2D]/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2C3E2D] shrink-0" />
                      <span className="truncate">{ev.room}</span>
                    </div>
                  </div>

                  <p className="mt-4 font-sans text-sm sm:text-base text-[#1E242B]/85 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4">
                    <span className="text-xs font-sans text-[#8A9A86] font-bold uppercase block mb-1.5">What to expect:</span>
                    <div className="flex flex-wrap gap-2">
                      {ev.highlights.map((h) => (
                        <span key={h} className="text-xs font-sans px-2.5 py-1 bg-[#8A9A86]/15 text-[#2C3E2D] font-medium rounded-md">
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capacity Bar & RSVP CTA Button */}
                <div className="pt-4 border-t border-[#2C3E2D]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Capacity progress */}
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-sans text-[#1E242B]/75 mb-1.5">
                      <span>{ev.rsvpdCount} Registered</span>
                      <span>{percentageFilled}% Full</span>
                    </div>
                    <div className="w-full h-2 bg-[#8A9A86]/20 rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-[#2C3E2D] rounded-md transition-all duration-500"
                        style={{ width: `${Math.min(100, percentageFilled)}%` }}
                      />
                    </div>
                  </div>

                  {/* RSVP Trigger */}
                  <button
                    onClick={() => onOpenRsvp(ev)}
                    className="group px-6 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs hover:shadow-md shrink-0 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-[#1E242B]" />
                    <span>RSVP FOR EVENT</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
