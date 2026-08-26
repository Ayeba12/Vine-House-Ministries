'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  Search, 
  BookOpen, 
  Radio, 
  Clock, 
  Calendar, 
  User, 
  FileText, 
  Tag, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  ChevronRight,
  Download,
  Share2,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { MinistryCmsDrawer } from '@/components/MinistryCmsDrawer';
import { INITIAL_SERMONS, INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_SUBSCRIBERS } from '@/lib/data';
import { Sermon } from '@/lib/types';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  // Audio Player State
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(INITIAL_SERMONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Expanded Transcript Modal / Drawer
  const [readingSermon, setReadingSermon] = useState<Sermon | null>(null);
  
  // CMS Drawer State
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Extract unique series and tags
  const allSeries = ['All', ...Array.from(new Set(sermons.map((s) => s.series)))];
  const allTags = ['All', ...Array.from(new Set(sermons.flatMap((s) => s.tags)))];

  // Filter logic
  const filteredSermons = sermons.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeries = selectedSeries === 'All' || s.series === selectedSeries;
    const matchesTag = selectedTag === 'All' || s.tags.includes(selectedTag);

    return matchesSearch && matchesSeries && matchesTag;
  });

  const handlePlaySermon = (sermon: Sermon) => {
    if (activeSermon?.id === sermon.id) {
      setIsPlayingAudio(!isPlayingAudio);
    } else {
      setActiveSermon(sermon);
      setIsPlayingAudio(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      {/* Top Navigation */}
      <Navbar 
        onOpenCms={() => setIsCmsOpen(true)}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        activeSermonTitle={activeSermon?.title}
      />

      {/* Hero Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">Sermon &amp; Liturgy Archive</span>
        </div>

        {/* Monumental Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Radio className="w-4 h-4 text-[#D4A373]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              The Living Word &amp; Lectionary
            </span>
          </div>

          <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
            Spoken Truth &amp; <br />
            <span className="text-[#1E242B]">Scripture Exegesis</span>
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            Listen to weekly pastoral teachings from Pastor Mercy Yerifor and ministry guests. Grounded in original biblical languages, historical theology, and contemplative practice.
          </p>
        </motion.div>

        {/* Search & Filter Bar Suite */}
        <div className="mt-10 p-4 sm:p-6 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, scripture, keyword, or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] placeholder-[#1E242B]/50 focus:outline-none focus:border-[#2C3E2D] transition-colors"
              />
            </div>

            {/* Series Dropdown Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-sans font-semibold text-[#8A9A86] shrink-0">Series:</label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="px-3 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans font-semibold text-[#2C3E2D] focus:outline-none focus:border-[#2C3E2D]"
              >
                {allSeries.map((ser) => (
                  <option key={ser} value={ser}>{ser}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-sans font-semibold text-[#8A9A86] shrink-0">Topic:</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans font-semibold text-[#2C3E2D] focus:outline-none focus:border-[#2C3E2D]"
              >
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters / Result Counter */}
          <div className="flex items-center justify-between text-xs font-sans text-[#8A9A86] pt-2 border-t border-[#8A9A86]/15">
            <span>Showing <strong>{filteredSermons.length}</strong> message{filteredSermons.length !== 1 ? 's' : ''}</span>
            {(searchQuery || selectedSeries !== 'All' || selectedTag !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSeries('All');
                  setSelectedTag('All');
                }}
                className="text-[#2C3E2D] font-bold underline hover:text-[#D4A373]"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Featured Latest Sermon Spotlight Card */}
        {sermons.length > 0 && !searchQuery && selectedSeries === 'All' && selectedTag === 'All' && (
          <div className="mt-8 bg-[#2C3E2D] text-[#F9F7F2] rounded-2xl border border-[#D4A373]/30 shadow-md relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Content Area */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#D4A373] text-[#1E242B] font-sans font-bold text-[10px] uppercase tracking-wider rounded">
                    Featured Latest Teaching
                  </span>
                  <span className="font-sans text-xs text-[#F9F7F2]/75">
                    {sermons[0].date} • {sermons[0].duration}
                  </span>
                </div>

                <h3 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F9F7F2] leading-[0.98]">
                  {sermons[0].title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#F9F7F2]/85 leading-relaxed">
                  {sermons[0].summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#D4A373] pt-1">
                  <span><strong>Scripture:</strong> {sermons[0].scripture}</span>
                  <span>•</span>
                  <span><strong>Speaker:</strong> {sermons[0].speaker}</span>
                </div>
              </div>

              {/* Play / Listen Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handlePlaySermon(sermons[0])}
                  className="group px-6 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {activeSermon?.id === sermons[0].id && isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Listen to Message</span>
                    </>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </button>

                <button
                  onClick={() => setReadingSermon(sermons[0])}
                  className="group px-5 py-3.5 bg-white/10 hover:bg-white/20 text-[#F9F7F2] border border-white/25 hover:border-white/40 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Read Transcript</span>
                </button>
              </div>
            </div>

            {/* Right Image Cover Area */}
            <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[280px] lg:min-h-full w-full bg-[#1E242B]">
              <Image
                src={sermons[0].imageUrl || "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80"}
                alt={sermons[0].title}
                fill
                className="object-cover brightness-90 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2C3E2D] via-[#2C3E2D]/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white font-sans text-xs flex items-center justify-between">
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[10px] uppercase font-bold text-[#D4A373]">
                  {sermons[0].series}
                </span>
                <span className="text-[11px] text-white/80 font-medium">
                  {sermons[0].speakerRole}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sermons Archive Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSermons.map((sermon) => {
            const isActive = activeSermon?.id === sermon.id;
            const isPlayingThis = isActive && isPlayingAudio;

            return (
              <div 
                key={sermon.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group ${
                  isActive 
                    ? 'border-[#2C3E2D] shadow-md ring-2 ring-[#2C3E2D]/20' 
                    : 'border-[#8A9A86]/25 shadow-2xs hover:border-[#2C3E2D]'
                }`}
              >
                {/* Visual Image Header */}
                <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
                  <Image
                    src={sermon.imageUrl || "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80"}
                    alt={sermon.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Floating Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#2C3E2D]/90 backdrop-blur-xs text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                      {sermon.series}
                    </span>
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-sans font-medium rounded flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4A373]" />
                      <span>{sermon.duration}</span>
                    </span>
                  </div>

                  {/* Floating Bottom Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white font-sans text-xs flex items-center justify-between">
                    <span className="text-[11px] text-[#D4A373] font-bold">
                      {sermon.scripture}
                    </span>
                    <span className="text-[10px] text-white/80">
                      {sermon.date}
                    </span>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors">
                      {sermon.title}
                    </h4>

                    <div className="mt-1 font-sans text-xs text-[#8A9A86] font-semibold flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{sermon.speaker} ({sermon.speakerRole})</span>
                    </div>

                    <p className="mt-3 font-sans text-xs text-[#1E242B]/80 leading-relaxed">
                      {sermon.summary}
                    </p>

                    {/* Key Takeaways Pills */}
                    {sermon.keyTakeaways && (
                      <div className="mt-4 pt-3 border-t border-[#8A9A86]/15 space-y-1.5 font-sans text-xs">
                        <span className="text-[10px] uppercase font-bold text-[#8A9A86] block">Core Insights:</span>
                        {sermon.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#1E242B]/75 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-[#D4A373] mt-0.5 shrink-0" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-[#8A9A86]/15 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlaySermon(sermon)}
                      className={`group/btn px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#2C3E2D] text-[#F9F7F2] border border-[#2C3E2D]'
                          : 'bg-[#F3EFE6] text-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] border border-[#2C3E2D]/20'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-[#D4A373] group-hover/btn:text-[#D4A373]" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setReadingSermon(sermon)}
                      className="group/link text-xs font-sans font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1.5 transition-all duration-200 relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4A373] after:transition-all after:duration-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#8A9A86] group-hover/link:text-[#D4A373] transition-colors" />
                      <span>Study Transcript</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3E2D] group-hover/link:text-[#D4A373] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSermons.length === 0 && (
          <div className="py-16 text-center bg-white rounded-xl border border-[#8A9A86]/25 mt-8">
            <BookOpen className="w-8 h-8 text-[#8A9A86] mx-auto mb-2" />
            <h4 className="font-anton text-xl uppercase text-[#2C3E2D]">No Teachings Found</h4>
            <p className="font-sans text-xs text-[#1E242B]/70 mt-1">
              Try adjusting your search keywords, series selector, or topic filters.
            </p>
          </div>
        )}
      </section>

      {/* Transcript / Scripture Reader Modal */}
      {readingSermon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F9F7F2] max-w-2xl w-full max-h-[85vh] rounded-2xl border border-[#2C3E2D]/20 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-[#2C3E2D] text-[#F9F7F2] flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#D4A373] font-bold block">
                  Study Guide &amp; Transcript
                </span>
                <h3 className="font-anton text-2xl uppercase tracking-tight text-[#F9F7F2]">
                  {readingSermon.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingSermon(null)}
                className="text-[#F9F7F2]/70 hover:text-[#F9F7F2] text-sm font-sans font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 font-sans text-xs sm:text-sm text-[#1E242B]/85 leading-relaxed">
              <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/25">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Speaker:</strong> {readingSermon.speaker}</div>
                  <div><strong>Scripture:</strong> {readingSermon.scripture}</div>
                  <div><strong>Series:</strong> {readingSermon.series}</div>
                  <div><strong>Date:</strong> {readingSermon.date}</div>
                </div>
              </div>

              <div>
                <h5 className="font-anton text-lg uppercase text-[#2C3E2D] mb-2">Exegesis Transcript</h5>
                <p className="whitespace-pre-line text-[#1E242B]/90 font-serif italic text-sm sm:text-base leading-relaxed bg-white p-5 rounded-xl border border-[#8A9A86]/20">
                  &ldquo;{readingSermon.transcriptSnippet}&rdquo;
                </p>
              </div>

              {readingSermon.keyTakeaways && (
                <div>
                  <h5 className="font-anton text-lg uppercase text-[#2C3E2D] mb-2">Key Takeaways</h5>
                  <ul className="space-y-2">
                    {readingSermon.keyTakeaways.map((k, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-white border-t border-[#8A9A86]/20 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handlePlaySermon(readingSermon);
                  setReadingSermon(null);
                }}
                className="group px-5 py-2.5 bg-[#2C3E2D] hover:bg-[#1E242B] text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#D4A373]" />
                <span>Listen to Audio Now</span>
              </button>
              <button
                onClick={() => setReadingSermon(null)}
                className="px-4 py-2.5 bg-white border border-[#8A9A86]/35 hover:border-[#2C3E2D] text-[#1E242B] hover:text-[#2C3E2D] text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Docked Audio Player */}
      <AudioPlayerBar
        sermon={activeSermon}
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
        onClose={() => {
          setIsPlayingAudio(false);
          setActiveSermon(null);
        }}
        onSelectSermon={(s) => {
          setActiveSermon(s);
          setIsPlayingAudio(true);
        }}
        allSermons={sermons}
      />

      {/* Footer */}
      <Footer 
        onSubscribe={() => {}}
        onOpenCms={() => setIsCmsOpen(true)}
        onPlanVisit={() => {}}
      />

      {/* CMS Drawer */}
      <MinistryCmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        sermons={sermons}
        onAddSermon={(newS) => setSermons([newS, ...sermons])}
        onDeleteSermon={(id) => setSermons(sermons.filter((s) => s.id !== id))}
        events={INITIAL_EVENTS}
        onAddEvent={() => {}}
        rsvps={INITIAL_RSVPS}
        onToggleCheckIn={() => {}}
        subscribers={INITIAL_SUBSCRIBERS}
      />
    </main>
  );
}
