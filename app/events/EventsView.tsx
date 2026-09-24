'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RsvpModal } from '@/components/RsvpModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Reveal } from '@/components/ui/Reveal';
import { ChurchEvent, RSVPRecord } from '@/lib/types';

const CATEGORIES = ['All', 'Worship', 'Fellowship', 'Outreach', 'Study', 'Youth'];
const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

function splitDate(date: string): { day: string; month: string } | null {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    day: parsed.toLocaleDateString('en-GB', { day: '2-digit' }),
    month: parsed.toLocaleDateString('en-GB', { month: 'short' }),
  };
}

/** The events page as a client island: search, category tabs and the booking modal over the list the server fetched. */
export function EventsView({ events: initialEvents }: { events: ChurchEvent[] }) {
  const router = useRouter();
  const [events, setEvents] = useState<ChurchEvent[]>(initialEvents);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [booking, setBooking] = useState<ChurchEvent | null>(null);

  const visible = events.filter((ev) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || [ev.title, ev.description, ev.location].some((f) => f.toLowerCase().includes(q));
    return matchesQuery && (category === 'All' || ev.category === category);
  });

  const confirm = (record: RSVPRecord) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === record.eventId ? { ...ev, rsvpdCount: ev.rsvpdCount + record.guestsCount } : ev))
    );
  };

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="Lectionary feasts & gatherings"
        crumb="Events"
        title="Sacred Seasons &"
        titleSecond="Community Events"
        lead="Candlelit acoustic vigils, seeker welcome brunches, theology workshops, and Saturday morning city mercy distributions. Book a place and we will keep you a seat."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Upcoming</dt>
            <dd className="text-ink">{events.length} events</dd>
            <dt>Booking</dt>
            <dd className="text-ink">Free · a pass code at the door</dd>
            <dt>Venue</dt>
            <dd className="text-ink">Sanctuary Hall unless noted</dd>
          </dl>
        }
      />

      <section className={`${CONTAINER} col-rules py-16 sm:py-24`}>
        <SectionHeader eyebrow="Calendar" title="What's coming" meta={`${visible.length} of ${events.length}`} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <SearchField
            className="lg:col-span-4"
            id="event-search"
            label="Search"
            placeholder="Title, description or venue"
            value={query}
            onChange={setQuery}
          />
          <div className="flex flex-wrap gap-x-7 gap-y-2 lg:col-span-8 lg:justify-end" role="tablist" aria-label="Category">
            {CATEGORIES.map((c) => (
              <button key={c} role="tab" aria-selected={category === c} onClick={() => setCategory(c)} className="tab">{c}</button>
            ))}
          </div>
        </div>

        <ol className="mt-12 divide-y divide-hairline border-t border-hairline">
          {visible.map((ev, idx) => {
            const date = splitDate(ev.date);
            const left = Math.max(0, ev.capacity - ev.rsvpdCount);
            const full = ev.capacity > 0 && left === 0;
            return (
              <Reveal key={ev.id} delay={idx * 0.05}>
                <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5 py-8 lg:grid-cols-[110px_180px_1fr_220px_auto] lg:items-center lg:gap-x-8">
                  <div className="flex items-baseline gap-2 lg:block">
                    {date ? (
                      <>
                        <span className="font-anton scale-step-h3 text-ink-strong">{date.day}</span>
                        <span className="eyebrow text-ink-muted lg:mt-1 lg:block">{date.month}</span>
                      </>
                    ) : (
                      <span className="meta text-ink">{ev.date}</span>
                    )}
                  </div>

                  <div className="relative hidden aspect-[4/3] overflow-hidden rounded-md bg-surface-deep lg:block">
                    <Image src={ev.imageUrl} alt="" fill sizes="180px" className="object-cover" referrerPolicy="no-referrer" />
                  </div>

                  <div className="min-w-0">
                    <p className="eyebrow text-accent">{ev.category}</p>
                    <h3 className="font-anton scale-step-h5 mt-1 text-ink-strong">{ev.title}</h3>
                    <p className="scale-step-body mt-2 line-clamp-2 max-w-[60ch] text-ink/85">{ev.description}</p>
                    {ev.highlights.length > 0 && (
                      <p className="meta mt-2 text-ink-muted">{ev.highlights.join(' · ')}</p>
                    )}
                  </div>

                  <dl className="meta col-span-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-muted lg:col-span-1">
                    <dt>Time</dt>
                    <dd className="text-ink">{ev.time}</dd>
                    <dt>Where</dt>
                    <dd className="text-ink">{ev.location} · {ev.room}</dd>
                    <dt>Host</dt>
                    <dd className="text-ink">{ev.host}</dd>
                    <dt>Places</dt>
                    <dd className={full ? 'text-accent' : 'text-ink'}>{ev.capacity > 0 ? (full ? 'Full — waitlist' : `${left} left`) : 'Open'}</dd>
                  </dl>

                  <div className="col-span-2 lg:col-span-1 lg:justify-self-end">
                    <button onClick={() => setBooking(ev)} className={`btn ${full ? 'btn-outline' : 'btn-primary'}`}>
                      <span>{full ? 'Join waitlist' : 'Book a place'}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>

        {visible.length === 0 && (
          <p className="meta py-16 text-center text-ink-muted">Nothing matches. Try another category or clear the search.</p>
        )}
      </section>

      <RsvpModal event={booking} onClose={() => setBooking(null)} onConfirmRsvp={confirm} />

      <Footer onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
