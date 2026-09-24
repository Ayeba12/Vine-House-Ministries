'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BuiltOnReverence } from '@/components/BuiltOnReverence';
import { SermonArchive } from '@/components/SermonArchive';
import { GatheringsGrid } from '@/components/GatheringsGrid';
import { EventsCalendar } from '@/components/EventsCalendar';
import { AboutLeadership } from '@/components/AboutLeadership';
import { VoicesSection } from '@/components/VoicesSection';
import { CallToAction } from '@/components/CallToAction';
import { Footer } from '@/components/Footer';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { RsvpModal } from '@/components/RsvpModal';

import { INITIAL_SERMONS, INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_SUBSCRIBERS } from '@/lib/data';
import { Sermon, ChurchEvent, RSVPRecord, Subscriber } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();

  // Content. Moves to WordPress in migration phase 3.
  const [sermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [, setRsvps] = useState<RSVPRecord[]>(INITIAL_RSVPS);
  const [, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [noticeBanner] = useState<string>(
    'Sunday Sanctuary Gathering: 10:00 AM & 12:00 PM • In-Person & Broadcast Live'
  );

  // The docked player persists across the whole page.
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(INITIAL_SERMONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<ChurchEvent | null>(null);

  const handlePlaySermon = (sermon: Sermon) => {
    if (activeSermon?.id === sermon.id) {
      setIsPlayingAudio((playing) => !playing);
    } else {
      setActiveSermon(sermon);
      setIsPlayingAudio(true);
    }
  };

  const handleTogglePlay = () => setIsPlayingAudio((playing) => !playing);

  const handleClosePlayer = () => {
    setIsPlayingAudio(false);
    setActiveSermon(null);
  };

  const handleConfirmRsvp = (newRsvp: RSVPRecord) => {
    setRsvps((prev) => [newRsvp, ...prev]);
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === newRsvp.eventId ? { ...ev, rsvpdCount: ev.rsvpdCount + newRsvp.guestsCount } : ev
      )
    );
  };

  const handleSubscribe = (sub: Subscriber) => setSubscribers((prev) => [sub, ...prev]);

  const goToVisit = () => router.push('/visit');

  return (
    <main className="min-h-screen bg-surface pb-24 text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar
        noticeBanner={noticeBanner}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleTogglePlay}
        activeSermonTitle={activeSermon?.title}
        onPlanVisit={goToVisit}
      />

      <Hero
        onPlanVisit={goToVisit}
        onPlayFeaturedSermon={() => {
          if (sermons.length > 0) handlePlaySermon(sermons[0]);
        }}
        featuredSermon={sermons[0]}
      />

      <BuiltOnReverence onPlanVisit={goToVisit} />

      <SermonArchive
        sermons={sermons}
        activeSermon={activeSermon}
        isPlaying={isPlayingAudio}
        onPlaySermon={handlePlaySermon}
      />

      <GatheringsGrid onPlanVisit={goToVisit} />

      <EventsCalendar events={events} onOpenRsvp={(event) => setSelectedEventForRsvp(event)} />

      <AboutLeadership onPlanVisit={goToVisit} />

      <VoicesSection />

      <CallToAction />

      <Footer onSubscribe={handleSubscribe} onPlanVisit={goToVisit} />

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

      <RsvpModal
        event={selectedEventForRsvp}
        onClose={() => setSelectedEventForRsvp(null)}
        onConfirmRsvp={handleConfirmRsvp}
      />
    </main>
  );
}
