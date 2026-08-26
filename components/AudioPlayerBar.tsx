'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  FileText, 
  Download, 
  Share2, 
  X,
  ListOrdered
} from 'lucide-react';
import { Sermon } from '@/lib/types';

interface AudioPlayerBarProps {
  sermon: Sermon | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onSelectSermon: (sermon: Sermon) => void;
  allSermons: Sermon[];
}

export function AudioPlayerBar({
  sermon,
  isPlaying,
  onTogglePlay,
  onClose,
  onSelectSermon,
  allSermons
}: AudioPlayerBarProps) {
  const [currentTime, setCurrentTime] = useState(145);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadedNote, setDownloadedNote] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && sermon) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= sermon.audioDurationSeconds) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sermon, playbackRate]);

  if (!sermon) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const togglePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#sermons-${sermon.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadNotes = () => {
    setDownloadedNote(true);
    setTimeout(() => setDownloadedNote(false), 3000);
  };

  return (
    <>
      {/* Persistent Docked Audio Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        id="docked-sermon-player"
        className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-7xl mx-auto z-50 bg-[#1E242B] text-[#F9F7F2] rounded-xl border border-[#8A9A86]/30 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl font-sans"
      >
        <div className="flex flex-col gap-2">
          
          {/* Top Row: Sermon info & Main controls */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-[#2C3E2D] shrink-0 border border-white/10">
                <Image 
                  src={sermon.imageUrl} 
                  alt={sermon.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                    <span className="w-1 h-3 bg-[#D4A373] animate-pulse" />
                    <span className="w-1 h-5 bg-[#D4A373] animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-[#D4A373] animate-pulse delay-150" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans uppercase tracking-wider text-[#D4A373] bg-[#D4A373]/15 px-2 py-0.5 rounded-md border border-[#D4A373]/30 font-bold">
                    {sermon.scripture}
                  </span>
                  <span className="text-xs font-sans text-[#F9F7F2]/60 hidden md:inline">
                    {sermon.series}
                  </span>
                </div>
                <h4 className="font-anton text-base sm:text-lg uppercase text-[#F9F7F2] truncate tracking-wide mt-0.5">
                  {sermon.title}
                </h4>
                <p className="text-xs font-sans text-[#F9F7F2]/75 truncate hidden sm:block">
                  {sermon.speaker} • {sermon.date}
                </p>
              </div>
            </div>

            {/* Center: Playback buttons (No pill shapes) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Skip -15s */}
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 15))}
                className="p-2 text-[#F9F7F2]/70 hover:text-[#F9F7F2] hover:bg-white/10 rounded-lg transition-colors hidden sm:block cursor-pointer"
                title="Rewind 15 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Main Play/Pause */}
              <button
                id="btn-player-play-pause"
                onClick={onTogglePlay}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D4A373] text-[#1E242B] flex items-center justify-center hover:bg-[#c69464] active:scale-95 transition-all shadow-md cursor-pointer"
                aria-label={isPlaying ? 'Pause sermon' : 'Play sermon'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-[#1E242B]" />
                ) : (
                  <Play className="w-5 h-5 fill-[#1E242B] ml-0.5" />
                )}
              </button>

              {/* Skip +15s */}
              <button
                onClick={() => setCurrentTime(Math.min(sermon.audioDurationSeconds, currentTime + 15))}
                className="p-2 text-[#F9F7F2]/70 hover:text-[#F9F7F2] hover:bg-white/10 rounded-lg transition-colors hidden sm:block cursor-pointer"
                title="Forward 15 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Auxiliary tools */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Playback speed toggle */}
              <button
                onClick={togglePlaybackRate}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#F9F7F2] rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer"
                title="Toggle playback speed"
              >
                {playbackRate}x
              </button>

              {/* Transcript Drawer Button */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-2 rounded-lg transition-colors hidden md:flex items-center gap-1 text-xs font-sans cursor-pointer ${
                  showTranscript ? 'bg-[#D4A373] text-[#1E242B] font-bold' : 'bg-white/10 hover:bg-white/20 text-[#F9F7F2]'
                }`}
                title="View Scripture Notes & Transcript"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>

              {/* Playlist drawer toggle */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-2 rounded-lg transition-colors hidden lg:flex items-center gap-1 text-xs font-sans cursor-pointer ${
                  showPlaylist ? 'bg-[#D4A373] text-[#1E242B] font-bold' : 'bg-white/10 hover:bg-white/20 text-[#F9F7F2]'
                }`}
                title="More Sermon Episodes"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Episodes</span>
              </button>

              {/* Share Sermon */}
              <button
                onClick={handleShare}
                className="p-2 text-[#F9F7F2]/70 hover:text-[#F9F7F2] hover:bg-white/10 rounded-lg transition-colors relative cursor-pointer"
                title="Share this sermon"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#D4A373] text-[#1E242B] font-bold text-xs px-2 py-0.5 rounded shadow whitespace-nowrap font-sans">
                    Link Copied!
                  </span>
                )}
              </button>

              {/* Close Bar */}
              <button
                onClick={onClose}
                className="p-2 text-[#F9F7F2]/50 hover:text-[#F9F7F2] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Scrubber Timeline */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs font-sans text-[#F9F7F2]/60 w-10 text-right">
              {formatSeconds(currentTime)}
            </span>

            {/* Custom Range Scrubber */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min={0}
                max={sermon.audioDurationSeconds}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#8A9A86]/30 rounded-lg appearance-none cursor-pointer accent-[#D4A373] hover:h-2 transition-all"
              />
            </div>

            <span className="text-xs font-sans text-[#F9F7F2]/60 w-10">
              {formatSeconds(sermon.audioDurationSeconds)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Transcript & Scripture Notes Slide-Over Drawer */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 max-w-lg w-full max-h-[70vh] bg-[#1E242B] text-[#F9F7F2] rounded-xl border border-[#8A9A86]/30 p-6 shadow-2xl z-50 overflow-y-auto font-sans"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#8A9A86]/20 mb-4">
              <div>
                <span className="text-xs font-sans text-[#D4A373] uppercase tracking-widest block font-bold">
                  Scripture &amp; Study Notes
                </span>
                <h3 className="font-anton text-xl uppercase tracking-wide text-[#F9F7F2]">{sermon.title}</h3>
              </div>
              <button 
                onClick={() => setShowTranscript(false)}
                className="p-1.5 text-[#F9F7F2]/60 hover:text-[#F9F7F2] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#F9F7F2]/85 font-sans">
              <div className="p-4 rounded-lg bg-[#2C3E2D]/60 border border-[#8A9A86]/30">
                <span className="font-sans text-xs text-[#D4A373] uppercase block mb-1 font-bold">Key Biblical Anchor</span>
                <p className="text-[#F9F7F2] font-medium italic">{sermon.scripture}</p>
                <p className="mt-2 text-xs sm:text-sm text-[#F9F7F2]/80 leading-relaxed">{sermon.summary}</p>
              </div>

              <div>
                <h4 className="text-xs font-sans uppercase tracking-wider text-[#D4A373] font-bold mb-2">Key Pastoral Takeaways:</h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {sermon.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D4A373] font-sans font-bold">0{idx + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-sans uppercase tracking-wider text-[#D4A373] font-bold mb-1">Message Transcript Snippet:</h4>
                <p className="text-xs sm:text-sm text-[#F9F7F2]/85 italic bg-black/25 p-3.5 rounded-lg border border-white/10 leading-relaxed">
                  &ldquo;{sermon.transcriptSnippet}&rdquo;
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleDownloadNotes}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#D4A373] text-[#1E242B] rounded-lg text-xs font-bold hover:bg-[#c69464] transition-colors active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadedNote ? 'Study Guide Downloaded!' : 'Download Study Guide PDF'}</span>
                </button>
                <span className="text-xs font-sans text-[#8A9A86]">Vine House Media</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 sm:bottom-28 left-4 sm:left-8 max-w-md w-full max-h-[60vh] bg-[#1E242B] text-[#F9F7F2] rounded-xl border border-[#8A9A86]/30 p-5 shadow-2xl z-50 overflow-y-auto font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#8A9A86]/20 mb-3">
              <span className="font-anton text-lg uppercase tracking-wide text-[#F9F7F2]">Sermon Episodes</span>
              <button 
                onClick={() => setShowPlaylist(false)}
                className="p-1 text-[#F9F7F2]/60 hover:text-[#F9F7F2] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {allSermons.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSermon(s);
                    setShowPlaylist(false);
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                    s.id === sermon.id ? 'bg-[#2C3E2D] border border-[#D4A373]/40' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-md bg-[#2C3E2D] flex items-center justify-center text-xs font-sans font-bold shrink-0 text-[#D4A373]">
                    {s.id === sermon.id ? <Play className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" /> : 'EP'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-anton uppercase text-[#F9F7F2] truncate">{s.title}</p>
                    <p className="text-xs text-[#F9F7F2]/60 font-sans">{s.speaker} • {s.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
