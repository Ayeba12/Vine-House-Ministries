import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/wordpress';
import { readFromWordPress, wpConfigured } from '@/lib/wp-rest';
import type { Booking } from '@/lib/types';
import { BookingView, type BookingLookup } from './BookingView';

// The address carries the booking's private token: never cached, never indexed, never sent on as a referrer.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your booking — Vine House Ministries',
  description: 'See your booking, your pass code and the event details, or release your place.',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const TOKEN = /^[a-f0-9]{32}$/;

/** Today's date in the church's timezone, as YYYY-MM-DD, to compare with an event date. */
function londonToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
}

/** Without WordPress credentials there is nothing to look up; show a sample so the page can still be seen. */
function sampleBooking(token: string): Booking {
  return {
    id: 0,
    status: 'confirmed',
    passCode: 'VH-SAMPLE',
    token,
    name: 'Samuel Adebayo',
    guests: 2,
    checkedIn: false,
    event: {
      id: 0,
      title: 'Night of Sacred Ascent & Acoustic Worship',
      when: 'Friday, 9 October 2026, 7:30 pm – 9:30 pm',
      eventDate: '2099-10-09',
      startTime: '19:30',
      endTime: '21:30',
      location: 'Main Sanctuary Hall',
      room: 'Ground floor',
      remaining: 40,
    },
  };
}

async function lookUp(token: string): Promise<BookingLookup> {
  if (!token) return { kind: 'no-token' };
  if (!TOKEN.test(token)) return { kind: 'missing' };
  if (!wpConfigured) return { kind: 'found', booking: sampleBooking(token), sample: true };

  const { status, data } = await readFromWordPress<Booking>(`bookings/${token}`);
  if (status === 200 && data) return { kind: 'found', booking: data, sample: false };
  if (status === 404 || status === 400) return { kind: 'missing' };
  return { kind: 'unreachable' };
}

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const params = await searchParams;
  const token = (Array.isArray(params.token) ? params.token[0] : params.token ?? '').trim().toLowerCase();
  const [lookup, settings] = await Promise.all([lookUp(token), getSiteSettings()]);
  const isPast = lookup.kind === 'found' && lookup.booking.event.eventDate !== '' && lookup.booking.event.eventDate < londonToday();

  return <BookingView lookup={lookup} isPast={isPast} officeEmail={settings.officeEmail} />;
}
