'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Play, Volume2, Search, BookOpen } from 'lucide-react';
import { Sermon } from '@/lib/types';

interface SermonArchiveProps {
  sermons: Sermon[];
  activeSermon: Sermon | null;
  isPlaying: boolean;
  onPlaySermon: (sermon: Sermon) => void;
}

export function SermonArchive({
  sermons,
  activeSermon,
  isPlaying,
  onPlaySermon
}: SermonArchiveProps) {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const seriesList = ['All', 'The True Vine Series', 'Quiet Wilderness', 'Grounded Grace', 'Modern Faith'];

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSeries = selectedSeries === 'All' || sermon.series === selectedSeries;
    const matchesSearch = 
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSeries && matchesSearch;
  });

  return (
    <section 
      id="sermons" 
      className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid font-sans"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-8 border-b border-[#2C3E2D]/15">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#8A9A86]"></div>
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
              Selected Sermons &amp; Teachings
            </span>
          </div>
          <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-[#2C3E2D]">
            MESSAGES THAT ANCHOR US
          </h2>
        </div>

        <div className="font-sans text-xs sm:text-sm text-[#8A9A86] self-start md:self-end">
          <span>Archive Library / Audio Podcast / 2026</span>
        </div>
      </div>

      {/* Series Filter & Search Toolbar */}
      <div className="py-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Buttons (No pill shapes) */}
        <div className="flex flex-wrap items-center gap-2">
          {seriesList.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-4 py-2.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedSeries === series
                  ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                  : 'bg-white/90 border border-[#8A9A86]/35 text-[#1E242B] hover:border-[#2C3E2D] hover:text-[#2C3E2D] hover:bg-white shadow-2xs'
              }`}
            >
              {series}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A9A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scripture, title, speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#8A9A86]/35 rounded-lg text-xs sm:text-sm font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D] transition-colors"
          />
        </div>
      </div>

      {/* Sermon Cards Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {filteredSermons.map((sermon, idx) => {
          const isCurrentActive = activeSermon?.id === sermon.id;
          const isCurrentlyPlaying = isCurrentActive && isPlaying;

          return (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group bg-white border rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                isCurrentActive ? 'border-[#2C3E2D] ring-2 ring-[#2C3E2D]/15' : 'border-[#8A9A86]/25'
              }`}
            >
              {/* Image Preview Area with Hover Play Trigger */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-[#1E242B]">
                <Image
                  src={sermon.imageUrl}
                  alt={sermon.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B]/85 via-[#2C3E2D]/20 to-transparent" />

                {/* Series Badge & Duration */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-[#2C3E2D]/90 backdrop-blur-md text-[#F9F7F2] text-xs font-sans uppercase tracking-wider rounded-md border border-white/10 font-bold">
                    {sermon.series}
                  </span>
                  <span className="px-3 py-1 bg-[#1E242B]/90 backdrop-blur-md text-[#F9F7F2] text-xs font-sans rounded-md border border-white/10">
                    {sermon.duration}
                  </span>
                </div>

                {/* Play Button Overlay (Crisp soft-cornered control, no pill) */}
                <button
                  onClick={() => onPlaySermon(sermon)}
                  className={`absolute inset-0 m-auto w-14 h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isCurrentlyPlaying 
                      ? 'bg-[#D4A373] text-[#1E242B] ring-4 ring-[#D4A373]/40 scale-105' 
                      : 'bg-[#D4A373] text-[#1E242B] hover:bg-[#c69464] hover:scale-105 shadow-xl'
                  }`}
                  title={isCurrentlyPlaying ? 'Pause sermon' : 'Play sermon podcast'}
                >
                  {isCurrentlyPlaying ? (
                    <Volume2 className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Play className="w-6 h-6 fill-[#1E242B] ml-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Metadata Grid */}
              <div className="p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors leading-tight">
                    {sermon.title}
                  </h3>
                  <p className="mt-2.5 font-sans text-sm sm:text-base text-[#1E242B]/80 leading-relaxed line-clamp-2">
                    {sermon.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {sermon.tags.map(tag => (
                      <span key={tag} className="text-xs font-sans px-2.5 py-1 bg-[#8A9A86]/15 text-[#2C3E2D] font-semibold rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Technical Specs */}
                <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-[#2C3E2D]/10 pt-3 sm:pt-0 sm:pl-5 font-sans text-xs sm:text-sm text-[#1E242B]/75 flex flex-col gap-1.5 w-full sm:w-auto">
                  <div>
                    <span className="text-[#8A9A86] uppercase text-xs font-bold block">Passage</span>
                    <span className="font-semibold text-[#2C3E2D]">{sermon.scripture}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9A86] uppercase text-xs font-bold block">Speaker</span>
                    <span className="text-[#1E242B]">{sermon.speaker}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9A86] uppercase text-xs font-bold block">Date</span>
                    <span className="text-[#1E242B]/70">{sermon.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSermons.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#8A9A86]/20 rounded-xl">
          <BookOpen className="w-8 h-8 text-[#8A9A86] mx-auto mb-2" />
          <p className="font-sans text-sm text-[#1E242B]/75">No sermons found matching your search.</p>
          <button 
            onClick={() => { setSelectedSeries('All'); setSearchQuery(''); }}
            className="mt-4 px-5 py-2.5 bg-white border border-[#2C3E2D]/30 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] text-[#2C3E2D] hover:text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
