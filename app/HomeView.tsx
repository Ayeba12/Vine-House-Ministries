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

import { Sermon, ChurchEvent, RSVPRecord, GatheringPillar, Testimonial, SiteSettings } from '@/lib/types';

/** How many of the newest entries each home section shows; the full lists live on /sermons and /events. */
const SECTION_LIMIT = 4;

export interface HomeViewProps {
  sermons: Sermon[];
  events: ChurchEvent[];
  gatherings: GatheringPillar[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}

/** The home page as a client island: the docked player and the booking modal hold state across every section. */
export function HomeView({ sermons, events: initialEvents, gatherings, testimonials, settings }: HomeViewProps) {
  const router = useRouter();

  const [events, setEvents] = useState<ChurchEvent[]>(initialEvents);
  const noticeBanner = settings.noticeBanner ?? undefined;

  // The docked player persists across the whole page.
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(sermons[0] ?? null);
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
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === newRsvp.eventId ? { ...ev, rsvpdCount: ev.rsvpdCount + newRsvp.guestsCount } : ev
      )
    );
  };

  const goToVisit = () => router.push('/visit');

  // Sermons arrive newest first and events soonest first; each section takes the top of its list.
  const latestSermons = sermons.slice(0, SECTION_LIMIT);
  const nextEvents = events.slice(0, SECTION_LIMIT);

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
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
        sermons={latestSermons}
        activeSermon={activeSermon}
        isPlaying={isPlayingAudio}
        onPlaySermon={handlePlaySermon}
      />

      <GatheringsGrid pillars={gatherings} onPlanVisit={goToVisit} />

      <EventsCalendar events={nextEvents} onOpenRsvp={(event) => setSelectedEventForRsvp(event)} />

      <AboutLeadership onPlanVisit={goToVisit} />

      <VoicesSection testimonials={testimonials} />

      <CallToAction />

      <Footer onPlanVisit={goToVisit} gather={settings.serviceTimes} />

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
