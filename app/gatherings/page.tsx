'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  ChevronRight, 
  Send, 
  BookOpen, 
  Church, 
  Coffee, 
  ArrowUpRight 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function GatheringsPage() {
  const [selectedBorough, setSelectedBorough] = useState<'All' | 'Greater London' | 'Essex' | 'East London'>('All');
  
  // House group interest form state
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    neighborhood: 'Ilford / Redbridge & Essex',
    lifeStage: 'Young Adults & Professionals',
    notes: ''
  });

  const houseGroups = [
    {
      id: 'hg-01',
      name: 'Ilford & Redbridge Contemplative Table',
      borough: 'Essex',
      neighborhood: 'Ilford / Redbridge',
      day: 'Every Tuesday Evening',
      time: '7:00 PM – 8:30 PM GMT',
      hosts: 'Marcus & Rachel Vance',
      description: 'A quiet gathering around a shared meal, contemplative silent prayer of examen, and lectionary discussion.',
      spotsOpen: 4
    },
    {
      id: 'hg-02',
      name: 'Stratford & Newham Fellowship House',
      borough: 'East London',
      neighborhood: 'Stratford / Olympic Park',
      day: 'Every Wednesday Evening',
      time: '7:30 PM – 9:00 PM GMT',
      hosts: 'Julian & Sarah Chen',
      description: 'Focused on young creatives, professionals, and seekers exploring Christian theology and community vocation.',
      spotsOpen: 6
    },
    {
      id: 'hg-03',
      name: 'Central London Liturgy Circle',
      borough: 'Greater London',
      neighborhood: 'City / Central London',
      day: 'Every Thursday Evening',
      time: '6:30 PM – 8:00 PM GMT',
      hosts: 'Dr. Aaron & Hannah Miller',
      description: 'Dinner with scripture reflections, shared prayer requests, and mutual support for city professionals.',
      spotsOpen: 3
    },
    {
      id: 'hg-04',
      name: 'Brentwood & Chelmsford Table of Peace',
      borough: 'Essex',
      neighborhood: 'Brentwood & Mid-Essex',
      day: 'Alternate Thursday Evenings',
      time: '7:00 PM – 8:45 PM GMT',
      hosts: 'Elena & Mateo Rostova',
      description: 'A warm hospitality table with acoustic worship, scripture lectio divina, and intercession.',
      spotsOpen: 5
    },
    {
      id: 'hg-05',
      name: 'Greenwich & South London Seekers',
      borough: 'Greater London',
      neighborhood: 'Greenwich / Canary Wharf Area',
      day: 'Every Monday Evening',
      time: '7:15 PM – 8:45 PM GMT',
      hosts: 'Minister David K. Sterling',
      description: 'An open dialogue space for questions, historical apologetics, and deep philosophical wrestling with faith.',
      spotsOpen: 8
    }
  ];

  const filteredGroups = houseGroups.filter((g) => 
    selectedBorough === 'All' ? true : g.borough === selectedBorough
  );

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setInterestSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">Gatherings &amp; Community Pillars</span>
        </div>

        {/* Monumental Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Users className="w-4 h-4 text-[#D4A373]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              The Body &amp; The Table
            </span>
          </div>

          <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
            Gatherings of Reverence <br />
            <span className="text-[#1E242B]">&amp; Table Communion</span>
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            Vine House gathers not merely in a central sanctuary on Sundays, but across living rooms, kitchen tables, and community fellowship spaces throughout Greater London and Essex.
          </p>
        </motion.div>

        {/* 4 Core Pillars Overview with Imagery */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pillar 01: Sunday Liturgy */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
            <div className="relative h-48 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80"
                alt="Sunday Liturgy"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Pillar 01 • Sanctuary Central
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h3 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                Sunday Liturgy &amp; Eucharist
              </h3>
              <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                Our central weekly corporate gathering at Sanctuary Hall. Featuring acoustic choral worship, deep biblical exegesis, moments of silent prayer, and open table communion.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs font-sans">
                <span className="text-[#8A9A86] font-medium">10:00 AM &amp; 12:00 PM</span>
                <Link 
                  href="/visit" 
                  className="group/link font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-all duration-200 relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4A373] after:transition-all after:duration-200"
                >
                  <span>Plan Visit</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3E2D] group-hover/link:text-[#D4A373] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pillar 02: The Contemplative Table */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
            <div className="relative h-48 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80"
                alt="The Contemplative Table"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Pillar 02 • Neighborhoods
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h3 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                The Contemplative Table
              </h3>
              <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                Intimate midweek house fellowships of 8–14 people meeting in homes across Greater London &amp; Essex for shared home-cooked meals, lectio divina, and deep mutual care.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs font-sans">
                <span className="text-[#8A9A86] font-medium">Midweek Evenings</span>
                <a 
                  href="#neighborhood-groups" 
                  className="group/link font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-all duration-200 relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4A373] after:transition-all after:duration-200"
                >
                  <span>Find a Group</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3E2D] group-hover/link:text-[#D4A373] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Pillar 03: NextGen & Youth */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
            <div className="relative h-48 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="Vine NextGen & Kids"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Pillar 03 • Ages 0–18
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h3 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                Vine NextGen &amp; Kids Sanctuary
              </h3>
              <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                A safe, joyful space for children and youth to explore scripture through Montessori-inspired Godly Play curriculum, creative art, and loving pastoral mentorship.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs font-sans">
                <span className="text-[#8A9A86] font-medium">Sundays during Services</span>
                <Link 
                  href="/visit" 
                  className="group/link font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-all duration-200 relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4A373] after:transition-all after:duration-200"
                >
                  <span>Kids Check-in Info</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3E2D] group-hover/link:text-[#D4A373] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pillar 04: Regional Mercy */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-[#2C3E2D] transition-all">
            <div className="relative h-48 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                alt="Community Mercy"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Pillar 04 • London &amp; Essex
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h3 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                Community Mercy &amp; Food Solidarity
              </h3>
              <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                Every Saturday morning, our registered charity outreach teams prepare and distribute warm meals and care packages for families and vulnerable neighbors across Greater London and Essex.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs font-sans">
                <span className="text-[#8A9A86] font-medium">Saturdays 9:00 AM GMT</span>
                <Link 
                  href="/events" 
                  className="group/link font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-all duration-200 relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4A373] after:transition-all after:duration-200"
                >
                  <span>Volunteer Roster</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3E2D] group-hover/link:text-[#D4A373] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Midweek House Groups Directory */}
        <div id="neighborhood-groups" className="mt-16 pt-12 border-t border-[#2C3E2D]/15">
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl border border-[#8A9A86]/25 shadow-2xs">
            <div className="lg:col-span-7 space-y-3">
              <span className="px-2.5 py-0.5 bg-[#F3EFE6] text-[#2C3E2D] font-sans font-bold text-[10px] uppercase tracking-wider rounded inline-block">
                Midweek Table Fellowship
              </span>
              <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#2C3E2D]">
                Neighborhood House Groups
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 leading-relaxed">
                Church is not confined to Sunday morning. Across Greater London and Essex, our members gather in living rooms for shared supper, scripture reflection, and mutual encouragement.
              </p>
              
              {/* Borough Selector Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {(['All', 'Greater London', 'Essex', 'East London'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBorough(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      selectedBorough === b
                        ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                        : 'bg-white/90 border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:text-[#2C3E2D] hover:bg-white shadow-2xs'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative h-52 sm:h-60 w-full rounded-xl overflow-hidden border border-[#8A9A86]/20">
              <Image
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
                alt="House Group Dinner & Prayer"
                fill
                className="object-cover brightness-95 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white font-sans text-xs">
                <span className="font-bold text-[#D4A373] block">Intimate Hospitality</span>
                <span className="text-[11px] text-white/85">Dinner, prayer, &amp; study in neighborhood homes</span>
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div 
                key={group.id}
                className="p-5 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs hover:border-[#2C3E2D] transition-colors flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#F3EFE6] text-[#2C3E2D] font-sans font-bold text-[10px] uppercase rounded">
                      {group.borough} • {group.neighborhood}
                    </span>
                    <span className="font-sans text-xs text-[#8A9A86]">
                      Hosts: {group.hosts}
                    </span>
                  </div>

                  <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                    {group.name}
                  </h4>

                  <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                    {group.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-sans text-[#8A9A86] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                      {group.day} • {group.time}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#8A9A86]/15">
                  <span className="text-[11px] font-sans text-[#8A9A86]">
                    <strong>{group.spotsOpen}</strong> seats open
                  </span>
                  <a
                    href="#interest-form"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        neighborhood: `${group.borough} - ${group.neighborhood}`
                      }));
                    }}
                    className="group px-4 py-2.5 bg-[#2C3E2D] hover:bg-[#1E242B] text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Request to Join</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Interest Connection Form */}
        <div id="interest-form" className="mt-16 p-6 sm:p-8 bg-white rounded-2xl border border-[#8A9A86]/30 shadow-xs">
          {!interestSubmitted ? (
            <form onSubmit={handleSubmitInterest} className="space-y-4">
              <div>
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
                  Connect With A Shepherd
                </span>
                <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                  Find Your Midweek Table
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#1E242B]/75 mt-1">
                  Fill out this brief form and our community director will personally introduce you to host shepherds in your neighborhood.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Adams"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Phone (Optional for SMS)</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Preferred Neighborhood</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">Questions or Dietary / Childcare Notes</label>
                <textarea
                  rows={2}
                  placeholder="Share anything that will help us connect you to the right host..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                />
              </div>

              <button
                type="submit"
                className="group w-full sm:w-auto px-8 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>Submit Connection Request</span>
                <Send className="w-3.5 h-3.5 text-[#1E242B] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#D4A373] mx-auto" />
              <h4 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                Connection Request Received
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. A host shepherd from {formData.neighborhood} will reach out to you at <strong>{formData.email}</strong> within 48 hours.
              </p>
              <button
                onClick={() => setInterestSubmitted(false)}
                className="mt-4 px-5 py-2.5 bg-white border border-[#2C3E2D]/30 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] text-[#2C3E2D] hover:text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          )}
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
