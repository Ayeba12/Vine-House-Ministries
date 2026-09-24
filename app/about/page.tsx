'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Church, 
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'mission' | 'theology' | 'leadership' | 'architecture'>('mission');

  const theologicalAnchors = [
    {
      num: '01',
      title: 'Christocentricity',
      scripture: 'Colossians 1:15–20',
      description: 'Jesus Christ is the living center of all scripture, all liturgy, and all fellowship. We do not preach self-help or cultural trend; we proclaim Christ crucified, resurrected, and reigning in mercy.'
    },
    {
      num: '02',
      title: 'Contemplative Reverence',
      scripture: 'Psalm 46:10 • 1 Kings 19:12',
      description: 'In a culture saturated with hurried noise, we create sanctuary for holy silence, sacred liturgy, deep exegesis, and stillness where God speaks in sheer stillness.'
    },
    {
      num: '03',
      title: 'Unconditional Grace & Open Table',
      scripture: 'Romans 8:38–39 • Luke 14:12–14',
      description: 'We welcome seekers, skeptics, and believers alike without religious pretense. The table of communion is not earned by moral performance; it is a gift offered to all who thirst.'
    },
    {
      num: '04',
      title: 'Regional Mercy & Active Solidarity',
      scripture: 'Micah 6:8 • Jeremiah 29:7',
      description: 'Vine House Ministries does not exist in an enclave. As a registered charity in England & Wales (No. 1148977), we seek the peace and tangible flourishing of Greater London and Essex through community food solidarity and compassionate care.'
    },
    {
      num: '05',
      title: 'Scriptural Authority & Honest Inquiry',
      scripture: '2 Timothy 3:16 • Acts 17:11',
      description: 'We honor the living Word of God with intellectual rigor and historical context, welcoming honest questions and wrestling as genuine expressions of developing faith.'
    }
  ];

  const leadershipTeam = [
    {
      name: 'Pastor Mercy Yerifor',
      role: 'Lead Pastor & Spiritual Director',
      bio: 'Pastor Mercy Yerifor is the visionary lead pastor of Vine House Ministries. Combining rich contemplative and sacramental traditions with warm gospel vitality, she has for over 16 years guided seekers and believers into deep scripture immersion, prayer, and quiet spiritual formation across Greater London and Essex.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      education: 'Theological & Ministerial Leadership • London & International Studies'
    },
    {
      name: 'Minister David K. Sterling',
      role: 'Associate Minister of Liturgy & Teaching',
      bio: 'David oversees the liturgical rhythm, weekly exegesis research, and adult discipleship at Vine House Ministries. His passion lies at the intersection of historical church liturgy and contemporary UK community life.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      education: 'M.T.S. Applied Theology & Liturgy'
    },
    {
      name: 'Elena Rostova',
      role: 'Director of Sacred Music & Choral Arts',
      bio: 'An accomplished choral director and musician, Elena curates our acoustic worship experiences, weaving historical hymns, contemporary psalms, and acoustic reflection into Sunday worship.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
      education: 'M.M. Choral Conducting & Sacred Arts'
    },
    {
      name: 'Marcus Thorne',
      role: 'Director of Community Mercy & Charity Outreach',
      bio: 'Marcus coordinates our charity initiatives, food solidarity distributions, community partnerships, and family outreach programs across Greater London and Essex.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      education: 'B.Sc. Community Development & Social Action'
    }
  ];

  const milestones = [
    {
      year: '2012',
      tag: 'FOUNDATION',
      title: 'Charity Commission Registration',
      category: 'Constitutional Charter',
      desc: 'Vine House Ministries is formally constituted and registered as a charity in England & Wales under Charity Commission Registered Number 1148977, establishing our spiritual charter.'
    },
    {
      year: '2016',
      tag: 'EXPANSION',
      title: 'Greater London & Essex Rhythms',
      category: 'Fellowship Cohorts',
      desc: 'The ministry establishes regular gatherings, lectionary teaching cohorts, and neighborhood prayer tables serving families across East London and the Essex regional corridor.'
    },
    {
      year: '2021',
      tag: 'LITURGY',
      title: 'Contemplative Sunday Liturgies',
      category: 'Sacred Sanctuary',
      desc: 'Vine House launches dedicated Sunday morning liturgies combining acoustic hymnody, contemplative silence, lectionary scripture readings, and intentional table communion.'
    },
    {
      year: '2026',
      tag: 'COMMUNITY',
      title: 'Flourishing Ministry & Mercy Action',
      category: 'Regional Flourishing',
      desc: 'Today, Vine House Ministries welcomes hundreds of worshippers weekly, operates neighborhood fellowship tables, and leads ongoing community outreach throughout London and Essex.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb / Section Label */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">About Vine House</span>
        </div>

        {/* Monumental Header with Architectural Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
                Our Genesis &amp; Convictions
              </span>
            </div>

            <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
              Ancient Liturgy <br />
              <span className="text-[#1E242B]">Modern Sanctuary</span>
            </h1>

            <p className="mt-6 font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
              Vine House Ministries is registered as a charity in England &amp; Wales (Charity Commission Registered Number: 1148977). We exist as a sanctuary of spiritual depth in Greater London &amp; Essex where timeless Christian liturgy, thoughtful scripture exegesis, and radical hospitality converge.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#8A9A86]/30 shadow-md group"
          >
            <Image
              src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1000&q=80"
              alt="Vine House Sanctuary Interior"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white font-sans">
              <span className="px-2 py-0.5 bg-[#D4A373] text-[#1E242B] text-[10px] font-bold uppercase rounded inline-block mb-1">
                Sanctuary Hall
              </span>
              <h4 className="font-anton text-xl uppercase tracking-tight">
                A Clearing for Contemplation &amp; Prayer
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                Greater London &amp; Essex Region • England &amp; Wales
              </p>
            </div>
          </motion.div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#2C3E2D]/15 pb-4">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'mission'
                ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                : 'bg-white/80 text-[#1E242B]/75 hover:text-[#2C3E2D] border border-[#2C3E2D]/10'
            }`}
          >
            01. Mission &amp; Story
          </button>
          <button
            onClick={() => setActiveTab('theology')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'theology'
                ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                : 'bg-white/80 text-[#1E242B]/75 hover:text-[#2C3E2D] border border-[#2C3E2D]/10'
            }`}
          >
            02. Statement of Faith
          </button>
          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'leadership'
                ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                : 'bg-white/80 text-[#1E242B]/75 hover:text-[#2C3E2D] border border-[#2C3E2D]/10'
            }`}
          >
            03. Pastoral Leadership
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                : 'bg-white/80 text-[#1E242B]/75 hover:text-[#2C3E2D] border border-[#2C3E2D]/10'
            }`}
          >
            04. Sacred Space
          </button>
        </div>

        {/* Tab 1: Mission & Story */}
        {activeTab === 'mission' && (
          <div className="py-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4 font-sans text-sm text-[#1E242B]/85 leading-relaxed">
                <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                  A Church Without Noise Or Pretension
                </h3>
                <p>
                  In a restless metropolis where attention is constantly commodified, Vine House stands as a deliberate counter-culture. We do not construct religious spectacles. Instead, we create a holy clearing where tired souls can rest, listen, pray, and encounter the transcendent presence of the Living God.
                </p>
                <p>
                  Named after Christ’s teaching in John 15 (&ldquo;I am the vine; you are the branches&rdquo;), we believe that spiritual vitality is not achieved through exhausted human striving, but received through intimate connection to Jesus Christ.
                </p>
              </div>

              <div className="md:col-span-5 bg-white p-6 rounded-xl border border-[#8A9A86]/25 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-[#2C3E2D]">
                  <Church className="w-5 h-5 text-[#D4A373]" />
                  <h4 className="font-anton text-xl uppercase tracking-tight">Our Core Rhythm</h4>
                </div>
                <ul className="space-y-3 font-sans text-xs text-[#1E242B]/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2C3E2D] mt-0.5 shrink-0" />
                    <span><strong>Word &amp; Sacrament:</strong> Every service centers on deep scripture exegesis and weekly open communion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2C3E2D] mt-0.5 shrink-0" />
                    <span><strong>Silence &amp; Song:</strong> Moments of contemplative stillness woven with acoustic choral hymnody.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2C3E2D] mt-0.5 shrink-0" />
                    <span><strong>Table &amp; City:</strong> Moving from sacred worship into radical hospitality and city mercy.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Historical Milestones Timeline */}
            <div className="pt-10 border-t border-[#2C3E2D]/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#D4A373]" />
                    <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
                      Historical Heritage &amp; Spiritual Roots
                    </span>
                  </div>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                    Our Journey &amp; Milestones
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#1E242B]/75 max-w-sm">
                  Tracing over a decade of continuous liturgical worship, community care, and spiritual life across Greater London &amp; Essex.
                </p>
              </div>

              {/* Enhanced Milestones Grid with Connected Line Motif */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {milestones.map((m, idx) => (
                  <div 
                    key={m.year} 
                    className="group relative p-6 bg-white rounded-2xl border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden"
                  >
                    {/* Subtle aesthetic gradient background accent */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#D4A373]/10 via-[#2C3E2D]/5 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                    <div className="space-y-4 relative z-10">
                      {/* Top Meta Bar */}
                      <div className="flex items-center justify-between">
                        <div className="px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] font-anton text-xl uppercase tracking-tight rounded-lg shadow-xs group-hover:bg-[#1E242B] group-hover:scale-105 transition-all duration-300">
                          {m.year}
                        </div>
                        <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#2C3E2D] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#2C3E2D]/10">
                          0{idx + 1} / {m.tag}
                        </span>
                      </div>

                      {/* Header & Sub-Category */}
                      <div>
                        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#D4A373] block mb-1">
                          {m.category}
                        </span>
                        <h5 className="font-anton text-lg sm:text-xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors leading-snug">
                          {m.title}
                        </h5>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    {/* Card Footer Indicator */}
                    <div className="pt-3.5 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs font-sans relative z-10">
                      <span className="text-[#8A9A86] font-medium flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                        <span>Chapter 0{idx + 1}</span>
                      </span>
                      <span className="font-bold text-[#2C3E2D] group-hover:text-[#D4A373] transition-colors flex items-center gap-0.5">
                        <span>Heritage</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Statement of Faith */}
        {activeTab === 'theology' && (
          <div className="py-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#2C3E2D]">
                  Theological Foundations &amp; Anchors
                </h3>
                <p className="mt-2 font-sans text-sm text-[#1E242B]/80 max-w-2xl">
                  Rooted in historical Christian orthodoxy, the Nicene Creed, and the historic Protestant tradition, these five anchors guide our preaching, community life, and pastoral care.
                </p>
              </div>

              <div className="lg:col-span-4 relative h-40 w-full rounded-xl overflow-hidden border border-[#8A9A86]/25 shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                  alt="Holy Scripture & Lectern"
                  fill
                  className="object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-sans font-medium">
                  &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {theologicalAnchors.map((item) => (
                <div 
                  key={item.num} 
                  className="p-5 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs hover:border-[#2C3E2D] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] font-sans font-bold text-xs rounded">
                        {item.num}
                      </span>
                      <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                        {item.title}
                      </h4>
                    </div>
                    <span className="font-sans text-xs text-[#8A9A86] font-bold">
                      {item.scripture}
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 leading-relaxed pl-0 sm:pl-10">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pastoral Leadership */}
        {activeTab === 'leadership' && (
          <div className="py-10 space-y-8">
            <div>
              <h3 className="font-anton text-3xl uppercase tracking-tight text-[#2C3E2D]">
                Pastoral Leadership &amp; Shepherds
              </h3>
              <p className="mt-2 font-sans text-sm text-[#1E242B]/80 max-w-2xl">
                Led by Pastor Mercy Yerifor, our leadership team is dedicated to rigorous biblical scholarship, empathetic pastoral care, and deep spiritual direction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadershipTeam.map((leader) => (
                <div 
                  key={leader.name}
                  className="p-6 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs flex flex-col justify-between group hover:border-[#2C3E2D] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {/* Avatar Image */}
                      <Image 
                        src={leader.image} 
                        alt={leader.name}
                        width={64}
                        height={64}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#2C3E2D]/20 shadow-2xs group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                          {leader.name}
                        </h4>
                        <span className="font-sans text-xs font-bold text-[#D4A373] block">
                          {leader.role}
                        </span>
                      </div>
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 leading-relaxed mb-4">
                      {leader.bio}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#8A9A86]/15 font-sans text-[11px] text-[#8A9A86]">
                    <strong>Education:</strong> {leader.education}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Sacred Space */}
        {activeTab === 'architecture' && (
          <div className="py-10 space-y-8">
            <div>
              <h3 className="font-anton text-3xl uppercase tracking-tight text-[#2C3E2D]">
                The Sanctuary Architecture
              </h3>
              <p className="mt-2 font-sans text-sm text-[#1E242B]/80 max-w-2xl">
                Designed in collaboration with minimalist liturgical architects, our sanctuary at 428 Sanctuary Blvd was intentionally crafted to shape the human heart through material truth and light.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
                <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80"
                    alt="Raw Materials White Oak"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                    Material Craft
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h5 className="font-anton text-xl uppercase text-[#2C3E2D]">Raw Materials</h5>
                  <p className="text-xs text-[#1E242B]/80 leading-relaxed">
                    Constructed with white American oak pews, polished natural concrete, and hand-cut limestone. No synthetic veneers or disposable plastics.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
                <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80"
                    alt="Acoustic Stone Architecture"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                    Harmonics
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h5 className="font-anton text-xl uppercase text-[#2C3E2D]">Acoustic Clarity</h5>
                  <p className="text-xs text-[#1E242B]/80 leading-relaxed">
                    Tuned for warm unamplified choral singing and clear speech comprehension, fostering an intimate dialogue between scripture reader and congregation.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
                <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80"
                    alt="Natural Clerestory Lightwells"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                    Sacred Light
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h5 className="font-anton text-xl uppercase text-[#2C3E2D]">Natural Skylights</h5>
                  <p className="text-xs text-[#1E242B]/80 leading-relaxed">
                    Three high clerestory light wells illuminate the central communion table and altar, marking the sacred transit of daylight across the sanctuary during liturgy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Pastoral Call to Action Banner */}
      <section className="py-14 bg-[#2C3E2D] text-[#F9F7F2] px-4 sm:px-6 lg:px-8 border-t border-[#8A9A86]/20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
            JOIN US THIS SUNDAY
          </span>
          <h2 className="font-anton text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-[#F9F7F2] break-words">
            Experience Sacred Liturgy in London &amp; Essex
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#F9F7F2]/80 max-w-xl mx-auto leading-relaxed">
            Whether you are stepping into church for the first time in years or searching for a deeper contemplative spiritual home, our doors and tables are open.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/visit"
              className="px-6 py-3 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-xs"
            >
              Plan Your Visit
            </Link>
            <Link
              href="/sermons"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#F9F7F2] border border-white/20 font-sans font-bold text-xs uppercase tracking-wider rounded-md transition-all"
            >
              Explore Teachings
            </Link>
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
