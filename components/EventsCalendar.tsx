'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ChurchEvent } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

interface EventsCalendarProps {
  events: ChurchEvent[];
  onOpenRsvp: (event: ChurchEvent) => void;
}

const CATEGORIES = ['All', 'Worship', 'Fellowship', 'Study', 'Outreach', 'Youth'];

/** "Friday, August 28, 2026" → { day: "28", month: "Aug" }, or the raw string when unparseable. */
function splitDate(date: string): { day: string; month: string } | null {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    day: parsed.toLocaleDateString('en-GB', { day: '2-digit' }),
    month: parsed.toLocaleDateString('en-GB', { month: 'short' }),
  };
}

/**
 * Events as a ledger: one hairline row per event, the date set large in the
 * display face, the booking action at the row's end. A church calendar is
 * read down a column, not browsed as cards.
 */
export function EventsCalendar({ events, onOpenRsvp }: EventsCalendarProps) {
  const [category, setCategory] = useState('All');
  const visible = events.filter((e) => category === 'All' || e.category === category);

  return (
    <section id="events" className="col-rules mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="flex flex-col gap-6 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Upcoming events
          </p>
          <h2 className="font-anton scale-step-h2 mt-4 uppercase text-ink-strong">Sacred gatherings</h2>
        </div>
        <p className="meta text-ink-muted">Book a place / Sanctuary seating / 2026</p>
      </div>

      <div className="flex flex-wrap gap-x-7 gap-y-2 py-6" role="tablist" aria-label="Event category">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat)}
              className={`eyebrow border-b pb-1 transition-colors ${
                active ? 'border-ink-strong text-ink-strong' : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <ol className="divide-y divide-hairline border-t border-hairline">
        {visible.map((ev, idx) => {
          const date = splitDate(ev.date);
          const left = Math.max(0, ev.capacity - ev.rsvpdCount);
          const full = ev.capacity > 0 && left === 0;
          return (
            <Reveal key={ev.id} delay={idx * 0.05}>
              <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 py-7 sm:py-8 lg:grid-cols-[120px_1fr_220px_160px] lg:items-center lg:gap-x-10">
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

                <div className="min-w-0">
                  <p className="eyebrow text-ink-muted">{ev.category}</p>
                  <h3 className="font-anton scale-step-h5 mt-1 text-ink-strong">{ev.title}</h3>
                  <p className="scale-step-body mt-2 line-clamp-2 max-w-[60ch] text-ink/85">{ev.description}</p>
                </div>

                <dl className="meta col-span-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-muted lg:col-span-1">
                  <dt>Time</dt>
                  <dd className="text-ink">{ev.time}</dd>
                  <dt>Where</dt>
                  <dd className="text-ink">{ev.room}</dd>
                  <dt>Places</dt>
                  <dd className={full ? 'text-accent' : 'text-ink'}>
                    {ev.capacity > 0 ? (full ? 'Full — waitlist' : `${left} left`) : 'Open'}
                  </dd>
                </dl>

                <div className="col-span-2 lg:col-span-1 lg:justify-self-end">
                  <button onClick={() => onOpenRsvp(ev)} className={`btn ${full ? 'btn-outline' : 'btn-primary'}`}>
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
        <p className="meta py-16 text-center text-ink-muted">Nothing in this category at the moment.</p>
      )}
    </section>
  );
}
