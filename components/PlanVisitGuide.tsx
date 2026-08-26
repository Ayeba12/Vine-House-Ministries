'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Car, 
  Train, 
  Coffee, 
  Baby, 
  Smile, 
  CheckCircle2, 
  Navigation, 
  Send,
  ArrowUpRight
} from 'lucide-react';
import { SanctuaryInteractiveMap } from './SanctuaryInteractiveMap';

export function PlanVisitGuide() {
  const [selectedTransit, setSelectedTransit] = useState<'car' | 'subway' | 'walk'>('car');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceDate: 'Upcoming Sunday (10:00 AM)',
    partySize: '1',
    hasChildren: false,
    requestWelcomeHost: true,
    prayerRequest: ''
  });

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.name || !visitForm.email) return;
    setFormSubmitted(true);
  };

  return (
    <section 
      id="visit" 
      className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid font-sans"
    >
      {/* Header */}
      <div className="pb-10 border-b border-[#2C3E2D]/15">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
            Visitor Experience &amp; Location
          </span>
          <div className="flex-1 h-px bg-[#2C3E2D]/15"></div>
        </div>

        <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-[#2C3E2D]">
          PLAN YOUR VISIT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 pt-12 items-start">
        
        {/* Left 6 Columns: Interactive Sanctuary Guide & Transit */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Quick Schedule Card with Photography Header */}
          <div className="bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden">
            <div className="relative h-48 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80"
                alt="Sanctuary Atrium & Liturgy Hall"
                fill
                className="object-cover brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-[#1E242B]/90 backdrop-blur-md rounded-md text-[#D4A373] text-xs font-sans font-bold uppercase tracking-wider">
                Sanctuary Campus • Greater London &amp; Essex
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
                Sunday Sanctuary Services
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                Gathering Hours &amp; Location
              </h3>

              <div className="mt-4 space-y-3 font-sans text-sm text-[#1E242B]">
                <div className="flex items-start gap-3.5 p-4 bg-[#F3EFE6]/50 rounded-xl border border-[#8A9A86]/15">
                  <Clock className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm sm:text-base font-sans font-bold text-[#2C3E2D]">First Liturgy: 10:00 AM – 11:15 AM</strong>
                    <span className="text-[#1E242B]/75 font-sans text-xs sm:text-sm">Reverent praise, pastoral message &amp; Vine Kids ministry.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-[#F3EFE6]/50 rounded-xl border border-[#8A9A86]/15">
                  <Clock className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm sm:text-base font-sans font-bold text-[#2C3E2D]">Second Liturgy: 12:00 PM – 1:15 PM</strong>
                    <span className="text-[#1E242B]/75 font-sans text-xs sm:text-sm">Contemplative worship, communion table &amp; hospitality brunch.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-[#F3EFE6]/50 rounded-xl border border-[#8A9A86]/15">
                  <MapPin className="w-5 h-5 text-[#2C3E2D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm sm:text-base font-sans font-bold text-[#2C3E2D]">Sanctuary Hall • Greater London &amp; Essex</strong>
                    <span className="text-[#1E242B]/75 font-sans text-xs sm:text-sm">England &amp; Wales • Charity No: 1148977 • Free On-Site Parking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Transit & Parking Tab */}
          <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="font-anton text-lg sm:text-xl uppercase tracking-tight text-[#2C3E2D]">
                  Directions &amp; Transit
                </span>
              </div>
              <div className="grid grid-cols-3 sm:flex gap-1.5 bg-[#F3EFE6] p-1 rounded-lg text-xs w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTransit('car')}
                  className={`px-3 py-2 rounded-md font-sans font-medium flex items-center justify-center gap-1.5 transition-all text-xs whitespace-nowrap min-h-[38px] cursor-pointer ${
                    selectedTransit === 'car' ? 'bg-[#2C3E2D] shadow-2xs text-[#F9F7F2] font-semibold' : 'text-[#1E242B]/75 hover:text-[#2C3E2D]'
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>Driving</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTransit('subway')}
                  className={`px-3 py-2 rounded-md font-sans font-medium flex items-center justify-center gap-1.5 transition-all text-xs whitespace-nowrap min-h-[38px] cursor-pointer ${
                    selectedTransit === 'subway' ? 'bg-[#2C3E2D] shadow-2xs text-[#F9F7F2] font-semibold' : 'text-[#1E242B]/75 hover:text-[#2C3E2D]'
                  }`}
                >
                  <Train className="w-4 h-4 shrink-0" />
                  <span>Transit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTransit('walk')}
                  className={`px-3 py-2 rounded-md font-sans font-medium flex items-center justify-center gap-1.5 transition-all text-xs whitespace-nowrap min-h-[38px] cursor-pointer ${
                    selectedTransit === 'walk' ? 'bg-[#2C3E2D] shadow-2xs text-[#F9F7F2] font-semibold' : 'text-[#1E242B]/75 hover:text-[#2C3E2D]'
                  }`}
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Walking</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#F3EFE6]/60 rounded-lg text-xs sm:text-sm font-sans text-[#1E242B]/85 leading-relaxed border border-[#8A9A86]/20">
              {selectedTransit === 'car' && (
                <p>
                  <strong className="text-[#2C3E2D]">Dedicated On-Site Parking:</strong> Free, secure parking is available directly within the sanctuary campus. Our welcome parking team will guide you straight to the main atrium entrance.
                </p>
              )}
              {selectedTransit === 'subway' && (
                <p>
                  <strong className="text-[#2C3E2D]">Public Rail &amp; Tube:</strong> Direct access via Greater London &amp; Essex transport links (Elizabeth Line, London Underground &amp; regional bus lines). We are an easy, step-free 3-minute walk from the station.
                </p>
              )}
              {selectedTransit === 'walk' && (
                <p>
                  <strong className="text-[#2C3E2D]">Courtyard Pedestrian Entrance:</strong> The main pedestrian access gate is through the landscaped West Courtyard with wide, gentle step-free ramps.
                </p>
              )}
            </div>

            {/* What to Expect Badges */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              <div className="flex items-center sm:flex-col sm:text-center gap-3 sm:gap-1.5 p-3.5 bg-[#8A9A86]/10 rounded-lg border border-[#8A9A86]/20">
                <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-md bg-[#D4A373]/15 sm:bg-transparent flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-[#D4A373]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs sm:text-sm text-[#2C3E2D]">Pour-Over Bar</span>
                  <span className="text-xs text-[#1E242B]/75 leading-tight block">Free Artisan Coffee</span>
                </div>
              </div>
              <div className="flex items-center sm:flex-col sm:text-center gap-3 sm:gap-1.5 p-3.5 bg-[#8A9A86]/10 rounded-lg border border-[#8A9A86]/20">
                <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-md bg-[#2C3E2D]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                  <Baby className="w-4 h-4 text-[#2C3E2D]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs sm:text-sm text-[#2C3E2D]">Vine Kids</span>
                  <span className="text-xs text-[#1E242B]/75 leading-tight block">Secure Child Check-In</span>
                </div>
              </div>
              <div className="flex items-center sm:flex-col sm:text-center gap-3 sm:gap-1.5 p-3.5 bg-[#8A9A86]/10 rounded-lg border border-[#8A9A86]/20">
                <div className="w-8 h-8 sm:w-auto sm:h-auto rounded-md bg-[#D4A373]/15 sm:bg-transparent flex items-center justify-center shrink-0">
                  <Smile className="w-4 h-4 text-[#D4A373]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs sm:text-sm text-[#2C3E2D]">Come As You Are</span>
                  <span className="text-xs text-[#1E242B]/75 leading-tight block">Warm &amp; Modern</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 6 Columns: Schedule a Welcome Host Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-[#8A9A86]/25 shadow-md">
          {!formSubmitted ? (
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold block mb-1">
                First-Time Visitor Concierge
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                Schedule a Welcome Host
              </h3>
              <p className="font-sans text-sm text-[#1E242B]/80 mt-1 mb-6 leading-relaxed">
                Let us know you&apos;re coming! A friendly member of our hospitality team will meet you at the door, 
                show you around, save you a seat, and buy you a coffee.
              </p>

              <form onSubmit={handleVisitSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adebayo"
                    value={visitForm.name}
                    onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={visitForm.email}
                      onChange={(e) => setVisitForm({ ...visitForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 7700 900077"
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                      Service You Plan to Attend
                    </label>
                    <select
                      value={visitForm.serviceDate}
                      onChange={(e) => setVisitForm({ ...visitForm, serviceDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-xs sm:text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    >
                      <option value="Sunday 10:00 AM">Sunday Morning (10:00 AM)</option>
                      <option value="Sunday 12:00 PM">Sunday Midday (12:00 PM)</option>
                      <option value="Wednesday 7:00 PM">Midweek Scripture Lab (Wed 7:00 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                      Party Size
                    </label>
                    <select
                      value={visitForm.partySize}
                      onChange={(e) => setVisitForm({ ...visitForm, partySize: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-[#8A9A86]/30 rounded-lg text-xs sm:text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    >
                      <option value="1">1 Person (Just me)</option>
                      <option value="2">2 People</option>
                      <option value="3">3-4 People (Family)</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-sans text-[#1E242B]">
                    <input
                      type="checkbox"
                      checked={visitForm.hasChildren}
                      onChange={(e) => setVisitForm({ ...visitForm, hasChildren: e.target.checked })}
                      className="w-4 h-4 rounded-md border-gray-300 text-[#2C3E2D] focus:ring-[#2C3E2D]"
                    />
                    <span>I will be bringing children (Need Vine Kids check-in info)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-sans text-[#1E242B]">
                    <input
                      type="checkbox"
                      checked={visitForm.requestWelcomeHost}
                      onChange={(e) => setVisitForm({ ...visitForm, requestWelcomeHost: e.target.checked })}
                      className="w-4 h-4 rounded-md border-gray-300 text-[#2C3E2D] focus:ring-[#2C3E2D]"
                    />
                    <span>Pair me with a friendly Welcome Host when I arrive</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#1E242B]/80 font-semibold mb-1">
                    Questions or Prayer Request (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Anything you'd like our hospitality team to know..."
                    value={visitForm.prayerRequest}
                    onChange={(e) => setVisitForm({ ...visitForm, prayerRequest: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#8A9A86]/30 rounded-lg text-xs sm:text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D4A373] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#c69464] transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>CONFIRM VISIT PLAN</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-[#8A9A86]/20 text-[#2C3E2D] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
                Visit Scheduled
              </span>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                See You This Sunday, {visitForm.name}!
              </h3>
              <p className="font-sans text-sm text-[#1E242B]/80 mt-2 max-w-sm mx-auto leading-relaxed">
                Your Welcome Host has been notified for the {visitForm.serviceDate} service. 
                We will have a warm drink ready for you at the welcome desk.
              </p>

              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-6 px-5 py-2.5 bg-[#F3EFE6] hover:bg-[#8A9A86]/20 text-[#2C3E2D] text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-colors active:scale-95 cursor-pointer"
              >
                Schedule Another Visit
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Sanctuary Campus Map & Transit Visualizer */}
      <div className="mt-14 pt-12 border-t border-[#2C3E2D]/15">
        <SanctuaryInteractiveMap />
      </div>
    </section>
  );
}
