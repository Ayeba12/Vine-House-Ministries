'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BuiltOnReverence } from '@/components/BuiltOnReverence';
import { SermonArchive } from '@/components/SermonArchive';
import { GatheringsGrid } from '@/components/GatheringsGrid';
import { EventsCalendar } from '@/components/EventsCalendar';
import { AboutLeadership } from '@/components/AboutLeadership';
import { VoicesSection } from '@/components/VoicesSection';
import { PlanVisitGuide } from '@/components/PlanVisitGuide';
import { Footer } from '@/components/Footer';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { RsvpModal } from '@/components/RsvpModal';

import { INITIAL_SERMONS, INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_SUBSCRIBERS } from '@/lib/data';
import { Sermon, ChurchEvent, RSVPRecord, Subscriber } from '@/lib/types';

export default function HomePage() {
  // Global State
  const [sermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(INITIAL_RSVPS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  
  // Notice Banner Text
  const [noticeBanner] = useState<string>(
    'Sunday Sanctuary Gathering: 10:00 AM & 12:00 PM • In-Person & Broadcast Live'
  );

  // Audio Podcast Player State
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(INITIAL_SERMONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // RSVP Modal State
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<ChurchEvent | null>(null);


  // Handlers
  const handlePlaySermon = (sermon: Sermon) => {
    if (activeSermon?.id === sermon.id) {
      setIsPlayingAudio(!isPlayingAudio);
    } else {
      setActiveSermon(sermon);
      setIsPlayingAudio(true);
    }
  };

  const handleTogglePlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleClosePlayer = () => {
    setIsPlayingAudio(false);
    setActiveSermon(null);
  };

  const handleConfirmRsvp = (newRsvp: RSVPRecord) => {
    setRsvps([newRsvp, ...rsvps]);
    // Increment event registration count
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === newRsvp.eventId ? { ...ev, rsvpdCount: ev.rsvpdCount + newRsvp.guestsCount } : ev
      )
    );
  };

  const handleSubscribe = (newSub: Subscriber) => {
    setSubscribers([newSub, ...subscribers]);
  };

  const scrollToPlanVisit = () => {
    const el = document.getElementById('visit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      
      {/* Top Navigation */}
      <Navbar 
        noticeBanner={noticeBanner} 
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleTogglePlay}
        activeSermonTitle={activeSermon?.title}
        onPlanVisit={scrollToPlanVisit}
      />

      {/* Hero Section */}
      <Hero 
        onPlanVisit={scrollToPlanVisit} 
        onPlayFeaturedSermon={() => {
          if (sermons.length > 0) {
            handlePlaySermon(sermons[0]);
          }
        }}
        featuredSermon={sermons[0]}
      />

      {/* Dark Monolithic Architectural Statement (Osvald "Built on Rawness" homage) */}
      <BuiltOnReverence onPlanVisit={scrollToPlanVisit} />

      {/* Sermon & Podcast Archive (Osvald "WORKS THAT DEFINE US" grid homage) */}
      <SermonArchive
        sermons={sermons}
        activeSermon={activeSermon}
        isPlaying={isPlayingAudio}
        onPlaySermon={handlePlaySermon}
      />

      {/* Gatherings & Ministry Pillars (Osvald 01-04 Modular Boxes) */}
      <GatheringsGrid onPlanVisit={scrollToPlanVisit} />

      {/* Sacred Events Calendar with Automated RSVP Pass Generator */}
      <EventsCalendar
        events={events}
        onOpenRsvp={(event) => setSelectedEventForRsvp(event)}
      />

      {/* Pastoral Leadership & Theological Anchors */}
      <AboutLeadership onPlanVisit={scrollToPlanVisit} />

      {/* Sanctuary Testimonials & Voices */}
      <VoicesSection />

      {/* Plan Your Visit, Transit Directions & Welcome Host Concierge */}
      <PlanVisitGuide />

      {/* Monolithic Footer with Newsletter & Giving Modal */}
      <Footer
        onSubscribe={handleSubscribe}
        onPlanVisit={scrollToPlanVisit}
      />

      {/* Persistent Docked Audio Player */}
      <AudioPlayerBar
        sermon={activeSermon}
        isPlaying={isPlayingAudio}
        onTogglePlay={handleTogglePlay}
        onClose={handleClosePlayer}
        onSelectSermon={(s) => {
          setActiveSermon(s);
          setIsPlayingAudio(true);
        }}
        allSermons={sermons}
      />

      {/* RSVP Modal */}
      <RsvpModal
        event={selectedEventForRsvp}
        onClose={() => setSelectedEventForRsvp(null)}
        onConfirmRsvp={handleConfirmRsvp}
      />


    </main>
  );
}
