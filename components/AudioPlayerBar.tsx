'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Play, Pause, RotateCcw, RotateCw, Share2, X } from 'lucide-react';
import { Sermon } from '@/lib/types';

interface AudioPlayerBarProps {
  sermon: Sermon | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onSelectSermon: (sermon: Sermon) => void;
  allSermons: Sermon[];
}

const RATES = [1, 1.25, 1.5, 2];

/**
 * The docked player: a full-width slate bar with a hairline above it.
 * Playback position is simulated with a timer until sermon audio is served
 * from WordPress; the controls, notes and episode list are real.
 */
export function AudioPlayerBar({ sermon, isPlaying, onTogglePlay, onClose, onSelectSermon, allSermons }: AudioPlayerBarProps) {
  const reduceMotion = useReducedMotion();
  const [currentTime, setCurrentTime] = useState(145);
  const [rate, setRate] = useState(1);
  const [panel, setPanel] = useState<'notes' | 'episodes' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isPlaying || !sermon) return;
    const id = setInterval(() => {
      setCurrentTime((t) => (t >= sermon.audioDurationSeconds ? 0 : t + 1));
    }, 1000 / rate);
    return () => clearInterval(id);
  }, [isPlaying, sermon, rate]);

  if (!sermon) return null;

  const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  const cycleRate = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);
  const share = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/sermons#${sermon.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const panelMotion = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.25 } };

  return (
    <>
      <motion.div
        id="docked-sermon-player"
        initial={reduceMotion ? false : { y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline-dark bg-surface-deep text-ink-on-dark"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-surface-dark sm:h-12 sm:w-12">
              <Image src={sermon.imageUrl} alt="" fill sizes="48px" className="object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="eyebrow truncate text-accent-on-dark">
                {sermon.scripture} <span className="hidden text-ink-on-dark-muted sm:inline">· {sermon.series}</span>
              </p>
              <p className="font-anton scale-step-lead truncate text-ink-on-dark">{sermon.title}</p>
              <p className="meta hidden truncate text-ink-on-dark-muted sm:block">
                {sermon.speaker} · {sermon.date}
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setCurrentTime((t) => Math.max(0, t - 15))} className="hidden p-2 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark sm:block" aria-label="Back 15 seconds">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                id="btn-player-play-pause"
                onClick={onTogglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-on-dark text-ink transition-transform hover:scale-105"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
              </button>
              <button onClick={() => setCurrentTime((t) => Math.min(sermon.audioDurationSeconds, t + 15))} className="hidden p-2 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark sm:block" aria-label="Forward 15 seconds">
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={cycleRate} className="tab tab-on-dark" aria-label={`Playback speed ${rate}x`}>
                {rate}×
              </button>
              <button onClick={() => setPanel(panel === 'notes' ? null : 'notes')} className="tab tab-on-dark hidden md:block" aria-selected={panel === 'notes'} role="tab">
                Notes
              </button>
              <button onClick={() => setPanel(panel === 'episodes' ? null : 'episodes')} className="tab tab-on-dark hidden lg:block" aria-selected={panel === 'episodes'} role="tab">
                Episodes
              </button>
              <button onClick={share} className="relative p-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark" aria-label="Copy link">
                <Share2 className="h-4 w-4" />
                {copied && <span className="eyebrow absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-accent-on-dark">Copied</span>}
              </button>
              <button onClick={onClose} className="p-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark" aria-label="Close player">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="meta w-10 text-right text-ink-on-dark-muted">{fmt(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={sermon.audioDurationSeconds}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-hairline-dark accent-[#D4A373]"
              aria-label="Seek"
            />
            <span className="meta w-10 text-ink-on-dark-muted">{fmt(sermon.audioDurationSeconds)}</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {panel === 'notes' && (
          <motion.aside {...panelMotion} className="fixed bottom-28 right-5 z-50 max-h-[65vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:right-8">
            <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
              <div>
                <p className="eyebrow text-accent-on-dark">Scripture &amp; study notes</p>
                <p className="font-anton scale-step-h5 mt-1 text-ink-on-dark">{sermon.title}</p>
              </div>
              <button onClick={() => setPanel(null)} className="p-1 text-ink-on-dark-muted hover:text-ink-on-dark" aria-label="Close notes">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="meta mt-4 text-accent-on-dark">{sermon.scripture}</p>
            <p className="scale-step-body mt-2 text-ink-on-dark/85">{sermon.summary}</p>
            <ol className="mt-5 divide-y divide-hairline-dark border-y border-hairline-dark">
              {sermon.keyTakeaways.map((point, idx) => (
                <li key={idx} className="meta grid grid-cols-[2rem_1fr] gap-x-3 py-3 text-ink-on-dark/90">
                  <span className="text-ink-on-dark-muted">0{idx + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <blockquote className="meta mt-5 text-ink-on-dark-muted">&ldquo;{sermon.transcriptSnippet}&rdquo;</blockquote>
          </motion.aside>
        )}

        {panel === 'episodes' && (
          <motion.aside {...panelMotion} className="fixed bottom-28 left-5 z-50 max-h-[60vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:left-8">
            <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
              <p className="eyebrow text-accent-on-dark">Episodes</p>
              <button onClick={() => setPanel(null)} className="p-1 text-ink-on-dark-muted hover:text-ink-on-dark" aria-label="Close episodes">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="divide-y divide-hairline-dark">
              {allSermons.map((s, idx) => {
                const current = s.id === sermon.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        onSelectSermon(s);
                        setPanel(null);
                      }}
                      className="grid w-full grid-cols-[2rem_1fr] gap-x-3 py-3 text-left transition-opacity hover:opacity-80"
                    >
                      <span className="meta pt-0.5 text-ink-on-dark-muted">{current ? <Play className="h-3 w-3 fill-current text-accent-on-dark" /> : `0${idx + 1}`}</span>
                      <span>
                        <span className={`block font-sans text-sm font-semibold ${current ? 'text-accent-on-dark' : 'text-ink-on-dark'}`}>{s.title}</span>
                        <span className="meta block text-ink-on-dark-muted">{s.speaker} · {s.duration}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
