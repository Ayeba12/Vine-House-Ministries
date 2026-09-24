'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Car, 
  Train, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  HelpCircle,
  Compass
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SanctuaryInteractiveMap } from '@/components/SanctuaryInteractiveMap';

export default function VisitPage() {
  
  // Custom Visitor Pass Generator State
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorDate] = useState('Sunday, August 30, 2026');
  const [visitorService, setVisitorService] = useState('10:00 AM Sanctuary Liturgy');
  const [guestsCount, setGuestsCount] = useState('1');
  const [hasKids, setHasKids] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<{
    passId: string;
    name: string;
    service: string;
    date: string;
    guests: string;
    conciergeHost: string;
  } | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What should I wear to Vine House?',
      a: 'There is no dress code. Our community dresses across the spectrum—from casual denim and sweaters to thoughtful Sunday attire. Come as you are, comfortably and authentically.'
    },
    {
      q: 'What is the Sunday service format and length?',
      a: 'Our services last approximately 75 minutes. The liturgy follows a historic four-fold rhythm: Gathering & Call to Worship, Word & Scriptural Exegesis, Table Communion & Prayers of Intercession, and the Sending Benediction.'
    },
    {
      q: 'Who can take communion at Vine House?',
      a: 'We practice an Open Table. All baptized followers of Jesus, regardless of denominational heritage, and all who are seeking God’s grace in sincerity are welcome to receive the bread and the cup.'
    },
    {
      q: 'What is available for children and toddlers?',
      a: 'We provide Vine NextGen children’s liturgy for infants through 5th graders during both the 10:00 AM and 12:00 PM services. All caregivers undergo background checks and trauma-informed safety training.'
    },
    {
      q: 'Is the sanctuary wheelchair accessible?',
      a: 'Yes, 428 Sanctuary Blvd features street-level step-free entrances, an elevator to all levels, accessible restrooms on every floor, and designated seating with acoustic hearing loops in the main sanctuary hall.'
    }
  ];

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;

    setGeneratedPass({
      passId: `VH-VISIT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: visitorName,
      service: visitorService,
      date: visitorDate,
      guests: guestsCount,
      conciergeHost: 'Elena Vance (Welcome Team Lead)'
    });
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">Plan Your Visit</span>
        </div>

        {/* Monumental Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Compass className="w-4 h-4 text-[#D4A373]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              Sunday Sanctuary Guide
            </span>
          </div>

          <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
            Enter Into <br />
            <span className="text-[#1E242B]">Sacred Space</span>
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            Every Sunday at 10:00 AM &amp; 12:00 PM GMT. Serving Greater London &amp; Essex (Registered Charity in England &amp; Wales No: 1148977). Here is everything you need to feel at peace for your first gathering.
          </p>
        </motion.div>

        {/* 4-Step Sunday Experience Walkthrough */}
        <div className="mt-12 pt-10 border-t border-[#2C3E2D]/15">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              Sunday Morning Rhythm
            </span>
            <div className="flex-1 h-px bg-[#2C3E2D]/15"></div>
          </div>

          <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#2C3E2D] mb-8">
            The Sunday Journey: What to Expect
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
              <div className="relative h-36 w-full bg-[#1E242B] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                  alt="Coffee Commons"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 bg-[#1E242B]/85 text-[#D4A373] text-[10px] font-anton tracking-wider rounded">
                  01 • ARRIVAL
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D]">
                  Arrival &amp; Coffee Commons
                </h5>
                <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                  Doors open 30 minutes early. Enjoy complimentary artisanal pour-over coffee and fresh sourdough pastries in our glass atrium.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
              <div className="relative h-36 w-full bg-[#1E242B] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80"
                  alt="Acoustic Liturgy"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 bg-[#1E242B]/85 text-[#D4A373] text-[10px] font-anton tracking-wider rounded">
                  02 • LITURGY
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D]">
                  Acoustic Liturgy &amp; Word
                </h5>
                <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                  Take a seat in our oak pews. Services begin with choral chant and hymns, followed by thoughtful, verse-by-verse scripture exegesis.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
              <div className="relative h-36 w-full bg-[#1E242B] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80"
                  alt="Eucharist & Prayer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 bg-[#1E242B]/85 text-[#D4A373] text-[10px] font-anton tracking-wider rounded">
                  03 • EUCHARIST
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D]">
                  Eucharist &amp; Quiet Prayer
                </h5>
                <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                  We take open communion every Sunday. Pastoral prayer teams are available quietly in the side alcoves for anyone desiring healing or intercession.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
              <div className="relative h-36 w-full bg-[#1E242B] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80"
                  alt="Courtyard Fellowship"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 bg-[#1E242B]/85 text-[#D4A373] text-[10px] font-anton tracking-wider rounded">
                  04 • FELLOWSHIP
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E2D]">
                  Courtyard Fellowship
                </h5>
                <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                  Stick around in the courtyard garden afterwards to meet Pastor Mercy, connect with church members, and ask questions.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Transit & Sanctuary Location Guide */}
        <div className="mt-12 bg-[#2C3E2D] text-[#F9F7F2] rounded-2xl border border-[#8A9A86]/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
                  Location &amp; Transit Details
                </span>
              </div>

              <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#F9F7F2]">
                Sanctuary Hall, Greater London &amp; Essex
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#F9F7F2]/80 leading-relaxed">
                Conveniently located in the Greater London &amp; Essex corridor, easily accessible via rail, Elizabeth Line, London Underground, and bus connections with dedicated on-site parking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-xs">
              <div className="p-3.5 bg-white/10 rounded-lg border border-white/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[#D4A373] font-bold">
                  <Train className="w-3.5 h-3.5" />
                  <span>Rail &amp; Underground</span>
                </div>
                <p className="text-[#F9F7F2]/75">
                  Direct connections via <strong>Elizabeth Line</strong>, <strong>Central Line</strong>, and regional buses with step-free access.
                </p>
              </div>

              <div className="p-3.5 bg-white/10 rounded-lg border border-white/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[#D4A373] font-bold">
                  <Car className="w-3.5 h-3.5" />
                  <span>On-Site Free Parking</span>
                </div>
                <p className="text-[#F9F7F2]/75">
                  Complimentary on-site church parking structure with dedicated hospitality wardens assisting families on arrival.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-full w-full bg-[#1E242B]">
            <Image
              src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1000&q=80"
              alt="Sanctuary Hall Arrival & Atrium"
              fill
              className="object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2C3E2D] via-[#2C3E2D]/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-[#8A9A86]/30 text-[#1E242B] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-anton text-lg uppercase tracking-tight text-[#2C3E2D]">
                  Sunday Liturgy Times
                </h4>
                <span className="px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[9px] font-sans font-bold uppercase rounded">
                  Every Sunday
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                <div className="p-2 bg-[#F9F7F2] rounded border border-[#8A9A86]/20">
                  <strong className="block text-[#2C3E2D]">10:00 AM</strong>
                  <span className="text-[10px] text-[#8A9A86]">Morning Liturgy</span>
                </div>
                <div className="p-2 bg-[#F9F7F2] rounded border border-[#8A9A86]/20">
                  <strong className="block text-[#2C3E2D]">12:00 PM</strong>
                  <span className="text-[10px] text-[#8A9A86]">Noon Gathering</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Map Component */}
        <div className="mt-8">
          <SanctuaryInteractiveMap showTransitGuide={false} />
        </div>

        {/* First-Timer Visitor Pass Generator */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-2xl border border-[#8A9A86]/30 shadow-xs">
          {!generatedPass ? (
            <form onSubmit={handleGeneratePass} className="space-y-4">
              <div>
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
                  VIP Welcome Concierge
                </span>
                <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                  Reserve Your Visitor Welcome Pass
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#1E242B]/75 mt-1">
                  Let our hospitality team know you are coming. We will have a welcome guide meet you at the door, save you seats, and hand you our welcome packet and gift.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Mitchell"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@example.com"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Select Sunday Liturgy</label>
                  <select
                    value={visitorService}
                    onChange={(e) => setVisitorService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#2C3E2D] font-semibold focus:outline-none focus:border-[#2C3E2D]"
                  >
                    <option value="10:00 AM Sanctuary Liturgy">10:00 AM Morning Gathering</option>
                    <option value="12:00 PM Sanctuary Liturgy">12:00 PM Noon Gathering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Number of People in Your Group</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#2C3E2D] font-semibold focus:outline-none focus:border-[#2C3E2D]"
                  >
                    <option value="1">1 Person (Just Me)</option>
                    <option value="2">2 People (Couple / Friends)</option>
                    <option value="3">3 People</option>
                    <option value="4+">4+ People (Family Group)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-sans text-[#1E242B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasKids}
                    onChange={(e) => setHasKids(e.target.checked)}
                    className="accent-[#2C3E2D]"
                  />
                  <span>I am bringing children who will need nursery or NextGen kids liturgy check-in</span>
                </label>
              </div>

              <button
                type="submit"
                className="group w-full sm:w-auto px-8 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>Generate Digital Sanctuary Pass</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
              </button>
            </form>
          ) : (
            <div className="p-6 bg-[#F9F7F2] rounded-xl border border-[#2C3E2D]/20 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#2C3E2D]/15">
                <div>
                  <span className="px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                    Official Sanctuary Digital Pass
                  </span>
                  <h4 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D] mt-1">
                    Welcome to Vine House, {generatedPass.name}
                  </h4>
                </div>
                <div className="text-center sm:text-right font-sans">
                  <span className="text-[10px] text-[#8A9A86] block">Pass Code</span>
                  <span className="font-bold text-sm text-[#2C3E2D]">{generatedPass.passId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="p-3 bg-white rounded-lg border border-[#8A9A86]/20">
                  <span className="text-[10px] text-[#8A9A86] block font-bold uppercase">Gathering</span>
                  <strong className="text-[#2C3E2D]">{generatedPass.service}</strong>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#8A9A86]/20">
                  <span className="text-[10px] text-[#8A9A86] block font-bold uppercase">Reserved Party</span>
                  <strong className="text-[#2C3E2D]">{generatedPass.guests} Guest(s)</strong>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#8A9A86]/20">
                  <span className="text-[10px] text-[#8A9A86] block font-bold uppercase">Welcome Host</span>
                  <strong className="text-[#2C3E2D]">{generatedPass.conciergeHost}</strong>
                </div>
              </div>

              <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                Present this screen at the Welcome Table in the Atrium upon arrival. Your host will have your welcome gift package ready and will escort you to reserved seating.
              </p>

              <button
                onClick={() => setGeneratedPass(null)}
                className="px-5 py-2.5 bg-white border border-[#2C3E2D]/30 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] text-[#2C3E2D] hover:text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                Create Another Pass
              </button>
            </div>
          )}
        </div>

        {/* Visitor FAQ Accordion */}
        <div className="mt-12 pt-10 border-t border-[#2C3E2D]/15 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-[#D4A373]" />
            <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-sans font-bold text-xs sm:text-sm text-[#2C3E2D] flex items-center justify-between gap-4 hover:bg-[#F9F7F2]/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-[#8A9A86] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A9A86] shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 font-sans text-xs text-[#1E242B]/80 leading-relaxed border-t border-[#8A9A86]/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Footer */}
      <Footer 
        onSubscribe={() => {}}
        onPlanVisit={() => {}}
      />

    </main>
  );
}
