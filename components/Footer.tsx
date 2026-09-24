'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ArrowUp, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  MessageSquare, 
  Compass, 
  Radio, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Church
} from 'lucide-react';
import { Subscriber } from '@/lib/types';

interface FooterProps {
  onSubscribe: (sub: Subscriber) => void;
  onPlanVisit: () => void;
}

export function Footer({ onSubscribe, onPlanVisit }: FooterProps) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'Weekly Devotional' | 'Event Announcements' | 'All Updates'>('Weekly Devotional');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [londonTime, setLondonTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLondonTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const sub: Subscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toLocaleDateString('en-GB'),
      frequency
    };

    onSubscribe(sub);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer id="site-footer" className="bg-[#141A16] text-[#F9F7F2] pt-16 sm:pt-20 lg:pt-24 pb-12 px-5 sm:px-8 lg:px-12 relative overflow-hidden font-sans border-t border-[#8A9A86]/20">
      
      <div className="max-w-7xl mx-auto relative z-10">

        {/* 1. TOP TELEMETRY & STATUS BAR */}
        <div className="pb-8 mb-14 border-b border-[#F9F7F2]/10 flex flex-wrap items-center justify-between gap-6 text-sm">
          
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-[#F9F7F2]/85">
            {/* Location */}
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
              <span className="text-[#F9F7F2] font-medium text-sm">Greater London &amp; Essex Region</span>
            </div>

            {/* London Local Clock */}
            <div className="flex items-center gap-2 text-[#8A9A86]">
              <Clock className="w-4 h-4 text-[#8A9A86] shrink-0" />
              <span className="font-mono text-sm text-[#F9F7F2]/90">
                {londonTime ? `${londonTime} GMT` : 'London GMT'}
              </span>
            </div>

            {/* Charity Registration */}
            <div className="flex items-center gap-2 text-sm text-[#D4A373]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-medium">Registered Charity No: 1148977</span>
            </div>
          </div>

          {/* Clean Structured Back-to-Top Button (No Pill Shapes) */}
          <button
            onClick={scrollToTop}
            type="button"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#F9F7F2]/5 hover:bg-[#F9F7F2]/15 border border-[#F9F7F2]/15 text-[#F9F7F2] text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4 text-[#D4A373] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 2. MAIN 2-COLUMN BALANCED FOOTER GRID WITH REASONABLE WHITESPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 border-b border-[#F9F7F2]/10">
          
          {/* COLUMN 1 (LEFT COLUMN - Span 6): Brand Identity, Mission, & Newsletter Fellowship */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Ministry Header & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2C3E2D] flex items-center justify-center text-[#D4A373] shadow-xs border border-[#8A9A86]/30 shrink-0">
                  <Church className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#F9F7F2] leading-none">
                    Vine House Ministries
                  </h3>
                  <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mt-1">
                    Contemporary Sanctuary &amp; Pastoral Ministry
                  </span>
                </div>
              </div>

              <p className="text-[#F9F7F2]/80 text-sm sm:text-base leading-relaxed max-w-xl">
                Vine House Ministries is an active Christian sanctuary and registered charity serving Greater London and Essex through thoughtful scripture exegesis, liturgical worship, authentic community, and compassionate outreach.
              </p>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="p-6 sm:p-7 bg-[#1A221C] rounded-xl border border-[#8A9A86]/25 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
                    The Weekly Vine Journal
                  </span>
                </div>
                <h4 className="font-anton text-xl sm:text-2xl uppercase tracking-tight text-[#F9F7F2]">
                  Stay Rooted In Scripture &amp; Grace
                </h4>
                <p className="text-xs sm:text-sm text-[#F9F7F2]/75 leading-relaxed">
                  Receive lectionary reflections, pastoral letters, and gathering updates every Thursday morning.
                </p>
              </div>

              {!isSubscribed ? (
                <form onSubmit={handleSubscribeSubmit} className="space-y-3.5 pt-1">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#141A16] rounded-lg text-sm text-[#F9F7F2] placeholder-[#F9F7F2]/45 border border-[#8A9A86]/30 focus:outline-none focus:border-[#D4A373] transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#D4A373] hover:bg-[#c69464] text-[#141A16] font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] cursor-pointer shadow-xs"
                    >
                      <span>Join Fellowship</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-xs font-sans text-[#F9F7F2]/75">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="footer-freq"
                        checked={frequency === 'Weekly Devotional'}
                        onChange={() => setFrequency('Weekly Devotional')}
                        className="accent-[#D4A373] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Weekly Reflections &amp; Sermons</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="footer-freq"
                        checked={frequency === 'Event Announcements'}
                        onChange={() => setFrequency('Event Announcements')}
                        className="accent-[#D4A373] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Key Gatherings Only</span>
                    </label>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-[#2C3E2D] rounded-lg border border-[#8A9A86]/40 flex items-center gap-3 text-[#F9F7F2]">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#D4A373]" />
                  <div className="font-sans text-xs sm:text-sm">
                    <strong className="block text-[#F9F7F2]">Welcome to Vine House Fellowship</strong>
                    <span className="text-[#F9F7F2]/85">Your email has been subscribed. Expect your first reflection this Thursday.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onPlanVisit}
                className="px-6 py-3 bg-[#D4A373] hover:bg-[#c69464] text-[#141A16] font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center gap-2 shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Plan Your Sunday Visit</span>
              </button>

              <Link
                href="/contact"
                className="px-6 py-3 bg-[#F9F7F2]/10 hover:bg-[#F9F7F2]/20 border border-[#F9F7F2]/20 text-[#F9F7F2] font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#D4A373]" />
                <span>Pastoral Care &amp; Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </Link>
            </div>

          </div>

          {/* COLUMN 2 (RIGHT COLUMN - Span 6): Liturgy Schedule, Directory & Sanctuary Details */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Top Sub-Grid: Gathering Times & Sanctuary Directory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Gathering Times Block */}
              <div className="space-y-4">
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block pb-1 border-b border-[#F9F7F2]/10">
                  Sanctuary Gatherings
                </span>
                
                <ul className="space-y-3 text-sm text-[#F9F7F2]/85">
                  <li className="p-3 bg-[#1A221C] rounded-lg border border-[#8A9A86]/20 space-y-0.5">
                    <strong className="block text-[#F9F7F2] font-bold text-sm">Sunday Liturgy &amp; Praise</strong>
                    <span className="text-xs text-[#D4A373] font-medium">10:00 AM • Sanctuary &amp; Live Stream</span>
                  </li>
                  <li className="p-3 bg-[#1A221C] rounded-lg border border-[#8A9A86]/20 space-y-0.5">
                    <strong className="block text-[#F9F7F2] font-bold text-sm">Sunday Midday Communion</strong>
                    <span className="text-xs text-[#D4A373] font-medium">12:00 PM • Worship &amp; Table</span>
                  </li>
                  <li className="p-3 bg-[#1A221C] rounded-lg border border-[#8A9A86]/20 space-y-0.5">
                    <strong className="block text-[#F9F7F2] font-bold text-sm">Midweek Scripture Lab</strong>
                    <span className="text-xs text-[#8A9A86] font-medium">Wednesday 7:00 PM • In-Person</span>
                  </li>
                  <li className="p-3 bg-[#1A221C] rounded-lg border border-[#8A9A86]/20 space-y-0.5">
                    <strong className="block text-[#F9F7F2] font-bold text-sm">Fellowship &amp; Youth Group</strong>
                    <span className="text-xs text-[#8A9A86] font-medium">Friday 7:30 PM • West Atrium</span>
                  </li>
                </ul>
              </div>

              {/* Navigation Links Block */}
              <div className="space-y-4">
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block pb-1 border-b border-[#F9F7F2]/10">
                  Explore Ministry
                </span>
                
                <ul className="space-y-2.5 text-sm text-[#F9F7F2]/85">
                  <li>
                    <Link href="/about" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>About Ministry &amp; Shepherd</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/sermons" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>Sermons &amp; Teachings Archive</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/gatherings" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>Ministry Pillars &amp; Liturgy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>Upcoming Events &amp; RSVP</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/visit" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>Plan Your Sunday Visit</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#D4A373] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                      <span>Contact Church Office</span>
                    </Link>
                  </li>
                </ul>

              </div>

            </div>

            {/* Sanctuary Location & Charity Details Footer Card */}
            <div className="p-5 sm:p-6 bg-[#1A221C] rounded-xl border border-[#8A9A86]/25 space-y-3 font-sans">
              <div className="flex items-center justify-between gap-2">
                <span className="font-anton text-base uppercase tracking-tight text-[#F9F7F2]">
                  Sanctuary Campus &amp; Office
                </span>
                <span className="text-xs text-[#D4A373] font-semibold">
                  Charity No: 1148977
                </span>
              </div>
              <p className="text-sm text-[#F9F7F2]/80 leading-relaxed">
                Greater London &amp; Essex Corridor • Step-free access &amp; free visitor parking on-site.
              </p>
              <div className="pt-2 border-t border-[#8A9A86]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#D4A373] font-mono text-xs">
                  enquiries@vinehouseministries.org.uk
                </span>
                <Link href="/visit" className="text-[#F9F7F2]/75 hover:text-[#D4A373] transition-colors underline underline-offset-4">
                  Directions &amp; Map Guide &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* 3. MONUMENTAL WORDMARK */}
        <div className="pt-14 sm:pt-18 pb-8 select-none overflow-hidden text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-anton text-[9vw] sm:text-[9.5vw] lg:text-[10vw] leading-none uppercase tracking-tighter text-[#F9F7F2] hover:text-[#D4A373] transition-colors duration-500 whitespace-nowrap cursor-default"
          >
            VINE HOUSE MINISTRIES
          </motion.h2>
        </div>

        {/* 4. COLOPHON & GOVERNANCE BAR */}
        <div className="pt-8 border-t border-[#F9F7F2]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#F9F7F2]/65">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} Vine House Ministries. Registered Charity in England &amp; Wales (No. 1148977). All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#F9F7F2]/80">
            <Link href="/contact" className="hover:text-[#D4A373] transition-colors">Safeguarding &amp; Governance</Link>
            <Link href="/visit" className="hover:text-[#D4A373] transition-colors">Plan A Visit</Link>
            <Link href="/contact" className="hover:text-[#D4A373] transition-colors">Pastoral Care</Link>
            <span className="text-[#8A9A86]">Greater London &amp; Essex</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
