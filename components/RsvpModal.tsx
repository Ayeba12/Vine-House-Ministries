'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { ChurchEvent, RSVPRecord } from '@/lib/types';
import { Select } from '@/components/ui/Select';

interface RsvpModalProps {
  event: ChurchEvent | null;
  onClose: () => void;
  onConfirmRsvp: (rsvp: RSVPRecord) => void;
}

interface BookingReply {
  id?: number;
  status?: string;
  passCode?: string;
  guests?: number;
  existing?: boolean;
  message?: string;
  field?: string;
}

/**
 * Booking a place: a dark header carrying the event, an underline form, and
 * on confirmation the pass itself, set large enough to read at the door.
 * The site's route handler passes the booking to Vine House Events, which
 * holds the capacity line and issues the pass code shown here.
 */
export function RsvpModal({ event, onClose, onConfirmRsvp }: RsvpModalProps) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guestsCount: 1,
    isFirstTimeVisitor: false,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<RSVPRecord | null>(null);
  const [waitlisted, setWaitlisted] = useState(false);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(event.id)}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          guestsCount: Number(form.guestsCount),
          isFirstTimeVisitor: form.isFirstTimeVisitor,
          notes: form.notes,
        }),
      });
      const reply = (await res.json().catch(() => ({}))) as BookingReply;
      if (!res.ok) {
        setError(reply.message ?? 'That did not go through. Please try again.');
        return;
      }
      const record: RSVPRecord = {
        id: `rsvp-${reply.id ?? Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        name: form.name,
        email: form.email,
        phone: form.phone || 'N/A',
        guestsCount: reply.guests ?? Number(form.guestsCount),
        isFirstTimeVisitor: form.isFirstTimeVisitor,
        notes: form.notes,
        createdAt: new Date().toLocaleString(),
        qrPassCode: reply.passCode ?? 'Pending',
        checkedIn: false,
      };
      setWaitlisted(reply.status === 'waitlisted');
      if (!reply.existing && reply.status !== 'waitlisted') onConfirmRsvp(record);
      setConfirmed(record);
    } catch {
      setError('The church office could not be reached. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCalendar = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vine House Ministries//Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}\\nHost: ${event.host}`,
      `LOCATION:${event.location} - ${event.room}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8;' }));
    link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-surface-deep/80 p-4 backdrop-blur-sm sm:items-center sm:p-6">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-6 w-full max-w-2xl rounded-xl bg-surface text-ink"
      >
        <div className="rounded-t-xl bg-surface-dark p-6 text-ink-on-dark sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="eyebrow text-accent-on-dark">{confirmed ? (waitlisted ? 'On the waitlist' : 'Confirmed') : 'Book a place'}</p>
          <h2 id="rsvp-title" className="font-anton scale-step-h4 mt-2 pr-10 text-ink-on-dark">
            {event.title}
          </h2>
          <dl className="meta mt-4 flex flex-wrap gap-x-6 gap-y-1 text-ink-on-dark-muted">
            <div className="flex gap-2"><dt className="sr-only">Date</dt><dd className="text-ink-on-dark">{event.date}</dd></div>
            <div className="flex gap-2"><dt className="sr-only">Time</dt><dd>{event.time}</dd></div>
            <div className="flex gap-2"><dt className="sr-only">Place</dt><dd>{event.location} · {event.room}</dd></div>
            <div className="flex gap-2"><dt className="sr-only">Host</dt><dd>Hosted by {event.host}</dd></div>
          </dl>
        </div>

        <div className="p-6 sm:p-8">
          {confirmed ? (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-anton scale-step-h5 text-ink-strong">
                  {waitlisted ? 'You are on the waitlist.' : 'We look forward to welcoming you.'}
                </h3>
                <p className="scale-step-body mt-2 text-ink">
                  {waitlisted
                    ? 'This gathering is full. If a place opens we will email you at once.'
                    : 'A confirmation is on its way to '}
                  {!waitlisted && <strong>{confirmed.email}</strong>}
                  {!waitlisted && '.'}
                </p>
              </div>

              <div className="rounded-xl bg-surface-dark p-6 text-ink-on-dark">
                <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
                  <div>
                    <p className="font-anton scale-step-lead text-ink-on-dark">Vine House Ministries</p>
                    <p className="meta text-ink-on-dark-muted">Sanctuary pass</p>
                  </div>
                  <p className="meta text-ink-on-dark-muted">{confirmed.guestsCount} guest{confirmed.guestsCount === 1 ? '' : 's'}</p>
                </div>
                <p className="font-anton scale-step-h3 mt-5 text-accent-on-dark">{confirmed.qrPassCode}</p>
                <dl className="meta mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-on-dark-muted">
                  <dt>Event</dt><dd className="text-ink-on-dark">{event.title}</dd>
                  <dt>When</dt><dd className="text-ink-on-dark">{event.date} · {event.time}</dd>
                  <dt>Attendee</dt><dd className="text-ink-on-dark">{confirmed.name}</dd>
                </dl>
                <p className="meta mt-5 border-t border-hairline-dark pt-4 text-ink-on-dark-muted">
                  Show this at the sanctuary entrance. On your phone or written down — either is fine.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button onClick={downloadCalendar} className="link-arrow text-ink-strong">
                  <span>Add to calendar</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button onClick={onClose} className="btn btn-primary">
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="rsvp-name" className="field-label">Full name</label>
                <input id="rsvp-name" type="text" required placeholder="Samuel Adebayo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
              </div>
              <div>
                <label htmlFor="rsvp-email" className="field-label">Email address</label>
                <input id="rsvp-email" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
              </div>
              <div>
                <label htmlFor="rsvp-phone" className="field-label">Phone (optional)</label>
                <input id="rsvp-phone" type="tel" placeholder="07700 900077" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
              </div>
              <Select
                id="rsvp-guests"
                label="Guests"
                value={String(form.guestsCount)}
                onChange={(v) => setForm({ ...form, guestsCount: Number(v) })}
                options={[
                  { value: '1', label: '1 — just me' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5 or more' },
                ]}
              />
              <label className="meta flex cursor-pointer items-center gap-3 self-end pb-3 text-ink">
                <input type="checkbox" checked={form.isFirstTimeVisitor} onChange={(e) => setForm({ ...form, isFirstTimeVisitor: e.target.checked })} className="h-4 w-4 accent-[#2C3E2D]" />
                This is my first visit
              </label>
              <div className="sm:col-span-2">
                <label htmlFor="rsvp-notes" className="field-label">Notes or prayer request (optional)</label>
                <textarea id="rsvp-notes" rows={2} placeholder="Wheelchair access, bringing children, or anything we should know" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="field" />
              </div>
              {error && (
                <p className="meta text-accent sm:col-span-2" role="alert">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                <button type="button" onClick={onClose} className="link-arrow text-ink-muted">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary disabled:opacity-60">
                  <span>{submitting ? 'Confirming…' : 'Confirm my place'}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
