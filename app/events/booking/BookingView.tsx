'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SanctuaryPass } from '@/components/SanctuaryPass';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import type { Booking } from '@/lib/types';

export type BookingLookup =
  | { kind: 'found'; booking: Booking; sample: boolean }
  | { kind: 'no-token' }
  | { kind: 'missing' }
  | { kind: 'unreachable' };

interface BookingViewProps {
  lookup: BookingLookup;
  /** The event's date is behind us: the pass is a keepsake and there is nothing left to cancel. */
  isPast: boolean;
  officeEmail: string;
}

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

/** The words each state of a booking opens with. */
function heading(booking: Booking, isPast: boolean): { title: string; second: string; lead: string; status: string } {
  const first = booking.name.split(' ')[0] || 'Friend';
  if (booking.status === 'cancelled') {
    return {
      title: 'This Booking',
      second: 'Is Cancelled',
      lead: 'Your place has been released for someone else. If your plans change, you are welcome to book again while places remain.',
      status: 'Cancelled',
    };
  }
  if (isPast) {
    return {
      title: 'This Event',
      second: 'Has Passed',
      lead: `Thank you for being with us, ${first}. There is nothing left to manage on this booking.`,
      status: booking.checkedIn ? 'Attended' : 'Past',
    };
  }
  if (booking.status === 'waitlisted') {
    return {
      title: 'You Are On',
      second: 'The Waitlist',
      lead: 'This gathering is full. If a place opens we will email you at once, and this page will show your pass as confirmed.',
      status: 'Waitlisted',
    };
  }
  return {
    title: 'Your Place',
    second: 'Is Kept',
    lead: `${first}, we look forward to welcoming you. Show the pass code below at the sanctuary entrance; on your phone or written down, either is fine.`,
    status: booking.checkedIn ? 'Checked in' : 'Confirmed',
  };
}

/** An .ics file for the event, in the church's timezone. Two hours when the event gives no end time. */
function downloadCalendar(booking: Booking) {
  const { event } = booking;
  const day = event.eventDate.replace(/-/g, '');
  const clock = (time: string) => `${time.replace(':', '')}00`;
  const start = event.startTime || '10:00';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vine House Ministries//Events//EN',
    'BEGIN:VEVENT',
    `UID:booking-${booking.id}@vinehouseministeries.co.uk`,
    `SUMMARY:${event.title}`,
    `DTSTART;TZID=Europe/London:${day}T${clock(start)}`,
    event.endTime ? `DTEND;TZID=Europe/London:${day}T${clock(event.endTime)}` : 'DURATION:PT2H',
    `LOCATION:${[event.location, event.room].filter(Boolean).join(' - ')}`,
    `DESCRIPTION:Pass code ${booking.passCode}. ${booking.guests} guest${booking.guests === 1 ? '' : 's'}.`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8;' }));
  link.download = `${event.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/** Manage my booking: the pass, the event's facts, and the way to release the place. Opened from the confirmation email. */
export function BookingView({ lookup, isPast, officeEmail }: BookingViewProps) {
  // A cancellation made on this page replaces the booking the server looked up.
  const [updated, setUpdated] = useState<Booking | null>(null);
  const [step, setStep] = useState<'idle' | 'confirming' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);

  const found = lookup.kind === 'found' ? lookup : null;
  const booking = updated ?? found?.booking ?? null;

  const cancel = async () => {
    if (!booking || step === 'submitting') return;
    setStep('submitting');
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.token}/cancel`, { method: 'POST' });
      const reply = (await res.json().catch(() => ({}))) as Partial<Booking> & { message?: string };
      if (!res.ok) {
        setError(reply.message ?? 'That did not go through. Please try again.');
        setStep('confirming');
        return;
      }
      setUpdated({ ...booking, ...reply, status: 'cancelled', event: { ...booking.event, ...(reply.event ?? {}) } });
      setStep('idle');
    } catch {
      setError('The church office could not be reached. Please try again in a moment.');
      setStep('confirming');
    }
  };

  const office = officeEmail ? (
    <a href={`mailto:${officeEmail}${booking ? `?subject=${encodeURIComponent(`Booking ${booking.passCode}`)}` : ''}`} className="link-arrow text-ink-strong">
      <span className="break-all">{officeEmail}</span>
      <ArrowUpRight className="size-3.5 shrink-0" />
    </a>
  ) : null;

  // ---- no booking to show ---------------------------------------------------
  if (!booking) {
    const copy =
      lookup.kind === 'unreachable'
        ? {
            title: 'One Moment',
            second: 'Please',
            lead: 'We could not reach the church office just now. Your booking is safe; please open this link again in a few minutes.',
          }
        : {
            title: 'Booking',
            second: 'Not Found',
            lead:
              lookup.kind === 'no-token'
                ? 'This page opens from the “Manage my booking” link in your confirmation email.'
                : 'That link does not match a booking. It may have been cut short when it was copied; open it again from your confirmation email.',
          };
    return (
      <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
        <Navbar />
        <PageHeader eyebrow="Your booking" crumb="Booking" title={copy.title} titleSecond={copy.second} lead={copy.lead} />
        <section className={`${CONTAINER} col-rules pb-24 pt-8 sm:pb-32`}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link href="/events" className="btn btn-primary">
              <span>See upcoming events</span>
              <ArrowUpRight className="size-4" />
            </Link>
            {office}
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ---- the booking ----------------------------------------------------------
  const words = heading(booking, isPast);
  const cancelled = booking.status === 'cancelled';
  const waitlisted = booking.status === 'waitlisted';
  const manageable = !cancelled && !isPast;
  const guests = `${booking.guests} guest${booking.guests === 1 ? '' : 's'}`;
  const where = [booking.event.location, booking.event.room].filter(Boolean).join(' · ');

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="Your booking"
        crumb="Booking"
        title={words.title}
        titleSecond={words.second}
        lead={words.lead}
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Status</dt>
            <dd className={cancelled ? 'text-accent' : 'text-ink'} aria-live="polite">{words.status}</dd>
            <dt>Booked for</dt>
            <dd className="text-ink">{booking.name}</dd>
            <dt>Party</dt>
            <dd className="text-ink">{guests}</dd>
          </dl>
        }
      />

      <section className={`${CONTAINER} col-rules pb-24 pt-8 sm:pb-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            {found?.sample && (
              <p className="meta mb-4 text-ink-muted">A sample booking: WordPress is not connected in this environment.</p>
            )}
            <SanctuaryPass
              code={booking.passCode}
              guests={booking.guests}
              status={cancelled ? 'Cancelled' : waitlisted ? 'Waitlist' : undefined}
              released={cancelled}
              rows={[
                { label: 'Event', value: booking.event.title },
                { label: 'When', value: booking.event.when },
                ...(where ? [{ label: 'Where', value: where }] : []),
                { label: 'Attendee', value: booking.name },
              ]}
              note={
                cancelled
                  ? 'This pass is no longer valid. A confirmation of the cancellation has been emailed to you.'
                  : waitlisted
                    ? 'This code becomes your pass the moment a place opens. We will email you.'
                    : 'Show this at the sanctuary entrance. On your phone or written down — either is fine.'
              }
            />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Manage
            </p>
            <h2 className="font-anton scale-step-h4 mt-4 text-ink-strong">
              {manageable ? 'Changes to this booking' : cancelled ? 'Changed your mind?' : 'Until next time'}
            </h2>

            <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
              {manageable && (
                <li className="flex flex-col gap-3 py-5">
                  <p className="scale-step-body text-ink">Keep the date, time and your pass code in your calendar.</p>
                  <button type="button" onClick={() => downloadCalendar(booking)} className="link-arrow self-start text-ink-strong">
                    <span>Add to calendar</span>
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </li>
              )}

              {manageable && office && (
                <li className="flex flex-col gap-3 py-5">
                  <p className="scale-step-body text-ink">
                    Bringing more or fewer people, or need step-free seating? Write to the office and we will amend it for you.
                  </p>
                  {office}
                </li>
              )}

              {manageable && (
                <li className="flex flex-col gap-4 py-5">
                  {step === 'idle' ? (
                    <>
                      <p className="scale-step-body text-ink">
                        Can no longer come? Releasing your place lets someone on the waitlist take it.
                      </p>
                      <button type="button" onClick={() => setStep('confirming')} className="btn btn-outline self-start">
                        <span>Cancel this booking</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="scale-step-body text-ink-strong">
                        Release your place for {guests}? Your pass code will stop working. You can book again while places remain.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <button type="button" onClick={cancel} disabled={step === 'submitting'} className="btn btn-primary">
                          <span>{step === 'submitting' ? 'Releasing your place' : 'Yes, release my place'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('idle');
                            setError(null);
                          }}
                          disabled={step === 'submitting'}
                          className="link-arrow text-ink-muted"
                        >
                          Keep my place
                        </button>
                      </div>
                    </>
                  )}
                  {error && (
                    <p role="alert" className="meta text-accent">
                      {error}
                    </p>
                  )}
                </li>
              )}

              {!manageable && (
                <li className="flex flex-col gap-4 py-5">
                  <p className="scale-step-body text-ink">
                    {cancelled
                      ? 'Places are released in the order they come back. If there is still room, booking again takes a minute.'
                      : 'The calendar has more gatherings coming. You would be very welcome.'}
                  </p>
                  <Link href="/events" className="btn btn-primary self-start">
                    <span>{cancelled ? 'Book again' : 'See upcoming events'}</span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </li>
              )}

              {!manageable && office && (
                <li className="flex flex-col gap-3 py-5">
                  <p className="scale-step-body text-ink">Questions about this booking? The office will help.</p>
                  {office}
                </li>
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
