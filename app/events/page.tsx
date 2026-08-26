'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  Search, 
  Tag, 
  Calendar as CalendarIcon,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RsvpModal } from '@/components/RsvpModal';
import { MinistryCmsDrawer } from '@/components/MinistryCmsDrawer';
import { INITIAL_SERMONS, INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_SUBSCRIBERS } from '@/lib/data';
import { ChurchEvent, RSVPRecord } from '@/lib/types';

export default function EventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(INITIAL_RSVPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // RSVP Modal State
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<ChurchEvent | null>(null);
  
  // CMS Drawer State
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  const categories = ['All', 'Worship', 'Fellowship', 'Formation', 'Outreach'];

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleConfirmRsvp = (newRsvp: RSVPRecord) => {
    setRsvps([newRsvp, ...rsvps]);
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === newRsvp.eventId ? { ...ev, rsvpdCount: ev.rsvpdCount + newRsvp.guestsCount } : ev
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      {/* Top Navigation */}
      <Navbar 
        onOpenCms={() => setIsCmsOpen(true)}
      />

      {/* Hero Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">Sacred Events Calendar</span>
        </div>

        {/* Monumental Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <CalendarDays className="w-4 h-4 text-[#D4A373]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              Lectionary Feasts &amp; Gatherings
            </span>
          </div>

          <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
            Sacred Seasons &amp; <br />
            <span className="text-[#1E242B]">Community Events</span>
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            Join us for candlelit acoustic vigils, seeker welcome brunches, theology workshops, and Saturday morning city mercy distributions.
          </p>
        </motion.div>

        {/* Search & Category Filter Suite */}
        <div className="mt-10 p-4 sm:p-6 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] placeholder-[#1E242B]/50 focus:outline-none focus:border-[#2C3E2D]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                      : 'bg-white/90 border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:text-[#2C3E2D] hover:bg-white shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mt-8 space-y-6">
          {filteredEvents.map((event) => {
            const spotsRemaining = event.capacity - event.rsvpdCount;
            const percentFilled = Math.min(100, Math.round((event.rsvpdCount / event.capacity) * 100));

            return (
              <div 
                key={event.id}
                className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs hover:border-[#2C3E2D] transition-all grid grid-cols-1 lg:grid-cols-12 overflow-hidden group"
              >
                {/* Event Cover Image */}
                {event.imageUrl && (
                  <div className="lg:col-span-4 relative min-h-[200px] lg:min-h-full w-full bg-[#1E242B] overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1E242B]/85 backdrop-blur-md text-[#D4A373] text-[10px] font-sans font-bold uppercase tracking-wider rounded">
                      {event.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white font-sans text-xs flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span className="font-bold">{event.date}</span>
                    </div>
                  </div>
                )}

                {/* Event Metadata & Details */}
                <div className={`${event.imageUrl ? 'lg:col-span-5' : 'lg:col-span-8'} p-6 sm:p-8 space-y-3 flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#D4A373] transition-colors leading-tight">
                      {event.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-[#8A9A86]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>{event.location} • {event.room}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    {event.highlights && (
                      <div className="flex flex-wrap gap-1.5">
                        {event.highlights.map((h, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#F9F7F2] text-[#1E242B]/75 border border-[#8A9A86]/20 rounded text-[10px] font-sans">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RSVP Action & Capacity Meter */}
                <div className="lg:col-span-3 p-6 bg-[#F9F7F2] border-t lg:border-t-0 lg:border-l border-[#8A9A86]/20 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                      <span className="text-[#8A9A86]">Sanctuary Capacity:</span>
                      <span className="font-bold text-[#2C3E2D]">{spotsRemaining} seats left</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#8A9A86]/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2C3E2D] rounded-full transition-all duration-500" 
                        style={{ width: `${percentFilled}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEventForRsvp(event)}
                    className="group w-full py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Reserve RSVP Pass</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                  </button>

                  <div className="text-center font-sans text-[10px] text-[#8A9A86]">
                    Host: {event.host}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center bg-white rounded-xl border border-[#8A9A86]/25 mt-8">
            <CalendarIcon className="w-8 h-8 text-[#8A9A86] mx-auto mb-2" />
            <h4 className="font-anton text-xl uppercase text-[#2C3E2D]">No Events Found</h4>
            <p className="font-sans text-xs text-[#1E242B]/70 mt-1">
              Try choosing another category or clearing your search term.
            </p>
          </div>
        )}
      </section>

      {/* RSVP Modal */}
      <RsvpModal
        event={selectedEventForRsvp}
        onClose={() => setSelectedEventForRsvp(null)}
        onConfirmRsvp={handleConfirmRsvp}
      />

      {/* Footer */}
      <Footer 
        onSubscribe={() => {}}
        onOpenCms={() => setIsCmsOpen(true)}
        onPlanVisit={() => {}}
      />

      {/* CMS Drawer */}
      <MinistryCmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        sermons={INITIAL_SERMONS}
        onAddSermon={() => {}}
        onDeleteSermon={() => {}}
        events={events}
        onAddEvent={(newEv) => setEvents([newEv, ...events])}
        rsvps={rsvps}
        onToggleCheckIn={() => {}}
        subscribers={INITIAL_SUBSCRIBERS}
      />
    </main>
  );
}
