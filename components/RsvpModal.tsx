'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Download, 
  Share2, 
  User, 
  Mail, 
  Phone, 
  Users
} from 'lucide-react';
import { ChurchEvent, RSVPRecord } from '@/lib/types';

interface RsvpModalProps {
  event: ChurchEvent | null;
  onClose: () => void;
  onConfirmRsvp: (rsvp: RSVPRecord) => void;
}

export function RsvpModal({ event, onClose, onConfirmRsvp }: RsvpModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestsCount: 1,
    isFirstTimeVisitor: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<RSVPRecord | null>(null);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const passId = `VH-${Math.floor(1000 + Math.random() * 9000)}-${event.category.toUpperCase().slice(0, 3)}`;
      const newRsvp: RSVPRecord = {
        id: `rsvp-${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'N/A',
        guestsCount: Number(formData.guestsCount),
        isFirstTimeVisitor: formData.isFirstTimeVisitor,
        notes: formData.notes,
        createdAt: new Date().toLocaleString(),
        qrPassCode: passId,
        checkedIn: false
      };

      onConfirmRsvp(newRsvp);
      setConfirmedPass(newRsvp);
      setIsSubmitting(false);
    }, 600);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vine House Ministries//Contemporary Sanctuary//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\nHost: ${event.host}
LOCATION:${event.location} - ${event.room}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#F9F7F2] text-[#1E242B] max-w-xl w-full rounded-2xl border border-[#8A9A86]/30 p-6 sm:p-8 shadow-2xl relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#1E242B]/60 hover:text-[#1E242B] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedPass ? (
          <div>
            {/* Header & Event Overview */}
            <div className="mb-6">
              <span className="font-sans text-xs uppercase tracking-widest text-[#F9F7F2] font-bold bg-[#2C3E2D] px-3 py-1 rounded-md inline-block">
                Event RSVP Registration
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D] mt-2.5 leading-tight">
                {event.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#1E242B]/75 mt-1">
                Hosted by {event.host}
              </p>
            </div>

            {/* Event Time & Room Box */}
            <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="text-[#1E242B] font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="text-[#1E242B] font-medium">{event.time}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2 text-[#1E242B]/85">
                <MapPin className="w-4 h-4 text-[#2C3E2D] shrink-0" />
                <span>{event.location} • {event.room}</span>
              </div>
            </div>

            {/* RSVP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adebayo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+44 7700 900077"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                    Number of Attendees
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-xs sm:text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    >
                      <option value={1}>1 Person (Just Me)</option>
                      <option value={2}>2 People</option>
                      <option value={3}>3 People (Small Family)</option>
                      <option value={4}>4 People</option>
                      <option value={5}>5+ People</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center pt-5 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-sans text-[#1E242B]">
                    <input
                      type="checkbox"
                      checked={formData.isFirstTimeVisitor}
                      onChange={(e) => setFormData({ ...formData, isFirstTimeVisitor: e.target.checked })}
                      className="w-4 h-4 rounded-md border-gray-300 text-[#2C3E2D] focus:ring-[#2C3E2D]"
                    />
                    <span>This is my first time visiting</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                  Special Notes or Prayer Request (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Need wheelchair access, bringing children, or prayer..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-xs sm:text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-sans font-bold text-[#1E242B]/70 hover:text-[#1E242B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#D4A373] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#c69464] transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? 'Confirming RSVP...' : 'COMPLETE RSVP REGISTRATION'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation & Digital Sanctuary Pass */
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-xl bg-[#8A9A86]/20 text-[#2C3E2D] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <span className="text-xs font-sans uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
              RSVP Confirmed &amp; Reserved
            </span>
            <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
              We Look Forward To Welcoming You
            </h3>
            <p className="font-sans text-sm text-[#1E242B]/80 mt-1 max-w-md mx-auto">
              A confirmation email has been dispatched to <strong className="text-[#2C3E2D]">{confirmedPass.email}</strong>.
            </p>

            {/* Digital Pass Card */}
            <div className="my-6 p-6 bg-white rounded-xl border-2 border-dashed border-[#2C3E2D]/30 text-left relative overflow-hidden shadow-xs">
              <div className="flex justify-between items-start border-b border-[#2C3E2D]/10 pb-3 mb-3">
                <div>
                  <span className="font-anton text-lg uppercase text-[#2C3E2D]">Vine House Ministries</span>
                  <span className="block font-sans text-xs text-[#8A9A86]">Contemporary Sanctuary Pass</span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xs font-bold text-[#D4A373]">{confirmedPass.qrPassCode}</span>
                  <span className="block font-sans text-xs text-[#1E242B]/60">{confirmedPass.guestsCount} Guest(s)</span>
                </div>
              </div>

              <div className="space-y-1 font-sans text-xs sm:text-sm text-[#1E242B]/85">
                <p><strong className="font-sans text-xs text-[#8A9A86] uppercase block font-bold">Event:</strong> {event.title}</p>
                <p><strong className="font-sans text-xs text-[#8A9A86] uppercase block font-bold">Date &amp; Time:</strong> {event.date} • {event.time}</p>
                <p><strong className="font-sans text-xs text-[#8A9A86] uppercase block font-bold">Attendee:</strong> {confirmedPass.name}</p>
              </div>

              {/* QR Code Graphic */}
              <div className="mt-4 pt-3 border-t border-[#2C3E2D]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#2C3E2D] text-[#F9F7F2] rounded-lg flex items-center justify-center p-1">
                    <QrCode className="w-full h-full" />
                  </div>
                  <span className="text-xs font-sans text-[#8A9A86]">Scan at Sanctuary Entrance</span>
                </div>
                <span className="text-xs font-sans text-[#2C3E2D] font-bold uppercase">Ready for Check-in</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadCalendar}
                className="px-4 py-2.5 bg-[#F3EFE6] hover:bg-[#8A9A86]/20 text-[#2C3E2D] font-sans text-xs rounded-lg flex items-center gap-2 transition-colors font-bold active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D4A373]" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#2C3E2D] text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#1E242B] transition-colors active:scale-95 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
