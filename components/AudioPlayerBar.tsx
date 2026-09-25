'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
const SKIP_SECONDS = 15;

const fmt = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${rest}` : `${m}:${rest}`;
};

/**
 * The docked player: a full-width slate bar with a hairline above it, over
 * one real audio element. The sermon's audio comes from WordPress (the
 * audio file on the sermon, or an external URL); every control drives the
 * element, and the timeline reads the element's own time and duration,
 * falling back to the length recorded in the CMS until the file is loaded.
 * Play state belongs to the page, so it survives across sections.
 */
export function AudioPlayerBar({ sermon, isPlaying, onTogglePlay, onClose, onSelectSermon, allSermons }: AudioPlayerBarProps) {
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [panel, setPanel] = useState<'notes' | 'episodes' | null>(null);
  const [shared, setShared] = useState<'copied' | null>(null);

  const src = sermon?.audioUrl ?? '';

  /* Play and pause follow the page's state. A refused play (no file, a
     browser autoplay rule) hands the state back so the button never lies. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) {
      audio.play().catch(() => {
        setStatus('error');
        onTogglePlay();
      });
    } else {
      audio.pause();
    }
    // onTogglePlay is a stable callback from the page; re-running on it would restart playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [rate, src]);

  /* Lock-screen and hardware controls. */
  useEffect(() => {
    if (!sermon || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: sermon.title,
      artist: sermon.speaker,
      album: sermon.series,
      artwork: sermon.imageUrl ? [{ src: sermon.imageUrl }] : [],
    });
    const audio = audioRef.current;
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => { if (!isPlaying) onTogglePlay(); }],
      ['pause', () => { if (isPlaying) onTogglePlay(); }],
      ['seekbackward', () => { if (audio) audio.currentTime = Math.max(0, audio.currentTime - SKIP_SECONDS); }],
      ['seekforward', () => { if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + SKIP_SECONDS); }],
    ];
    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        /* an action this browser does not support */
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* ignore */
        }
      }
    };
  }, [sermon, isPlaying, onTogglePlay]);

  const skip = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = audio.duration || duration || 0;
    audio.currentTime = Math.min(max, Math.max(0, audio.currentTime + delta));
    setCurrentTime(audio.currentTime);
  }, [duration]);

  if (!sermon) return null;

  const total = duration || sermon.audioDurationSeconds || 0;
  const unavailable = status === 'error' || !src;
  const index = allSermons.findIndex((s) => s.id === sermon.id);
  const next = index >= 0 ? allSermons[index + 1] : undefined;

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = value;
    setCurrentTime(value);
  };

  const cycleRate = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);

  /** The system share sheet where there is one; the clipboard where there is not. */
  const share = async () => {
    const url = `${window.location.origin}/sermons#${sermon.id}`;
    const data = { title: sermon.title, text: `${sermon.title} · ${sermon.speaker} · ${sermon.scripture}`, url };
    if (typeof navigator.share === 'function' && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* dismissed the sheet, or it failed: fall through to the clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared('copied');
      setTimeout(() => setShared(null), 2500);
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  const onEnded = () => {
    if (next) {
      onSelectSermon(next);
    } else if (isPlaying) {
      onTogglePlay();
    }
  };

  const panelMotion = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.25 } };

  return (
    <>
      <audio
        ref={audioRef}
        key={src}
        src={src || undefined}
        preload="metadata"
        onLoadStart={() => {
          setStatus(src ? 'loading' : 'error');
          setCurrentTime(0);
          setDuration(0);
        }}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d)) setDuration(d);
          setStatus('ready');
        }}
        onCanPlay={() => setStatus('ready')}
        onWaiting={() => setStatus('loading')}
        onPlaying={() => setStatus('ready')}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onError={() => {
          setStatus('error');
          if (isPlaying) onTogglePlay();
        }}
        onEnded={onEnded}
      />

      <motion.div
        id="docked-sermon-player"
        initial={reduceMotion ? false : { y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline-dark bg-surface-deep text-ink-on-dark"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-surface-dark outline-1 -outline-offset-1 outline-white/10 sm:size-12">
              {sermon.imageUrl && <Image src={sermon.imageUrl} alt="" fill sizes="48px" className="object-cover" referrerPolicy="no-referrer" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="eyebrow truncate text-accent-on-dark">
                {sermon.scripture} <span className="hidden text-ink-on-dark-muted sm:inline">· {sermon.series}</span>
              </p>
              <p className="font-anton scale-step-lead truncate text-ink-on-dark">{sermon.title}</p>
              <p className="meta hidden truncate text-ink-on-dark-muted sm:block" aria-live="polite">
                {unavailable ? 'Audio for this sermon is not available yet.' : status === 'loading' ? 'Loading…' : `${sermon.speaker} · ${sermon.date}`}
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => skip(-SKIP_SECONDS)}
                disabled={unavailable}
                className="inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark disabled:opacity-40 sm:size-10"
                aria-label={`Back ${SKIP_SECONDS} seconds`}
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                id="btn-player-play-pause"
                type="button"
                onClick={onTogglePlay}
                disabled={unavailable}
                className="flex size-11 items-center justify-center rounded-full bg-accent-on-dark text-ink transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-on-dark"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => skip(SKIP_SECONDS)}
                disabled={unavailable}
                className="inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark disabled:opacity-40 sm:size-10"
                aria-label={`Forward ${SKIP_SECONDS} seconds`}
              >
                <RotateCw className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button type="button" onClick={cycleRate} className="tab tab-on-dark tabular-nums" aria-label={`Playback speed, ${rate} times. Change speed`}>
                {rate}×
              </button>
              <button
                type="button"
                onClick={() => setPanel(panel === 'notes' ? null : 'notes')}
                className="tab tab-on-dark hidden sm:block"
                aria-expanded={panel === 'notes'}
                aria-controls="player-notes"
              >
                Notes
              </button>
              <button
                type="button"
                onClick={() => setPanel(panel === 'episodes' ? null : 'episodes')}
                className="tab tab-on-dark hidden md:block"
                aria-expanded={panel === 'episodes'}
                aria-controls="player-episodes"
              >
                Episodes
              </button>
              <button
                type="button"
                onClick={share}
                className="relative inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                aria-label="Share this sermon"
              >
                <Share2 className="size-4" />
                {shared && (
                  <span className="eyebrow absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-accent-on-dark" role="status">
                    Link copied
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                aria-label="Close player"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="meta w-12 text-right tabular-nums text-ink-on-dark-muted">{fmt(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(total))}
              step={1}
              value={Math.min(currentTime, total)}
              disabled={unavailable}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-hairline-dark accent-[#D4A373] disabled:cursor-default disabled:opacity-40"
              aria-label="Seek"
              aria-valuetext={`${fmt(currentTime)} of ${fmt(total)}`}
            />
            <span className="meta w-12 tabular-nums text-ink-on-dark-muted">{fmt(total)}</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {panel === 'notes' && (
          <motion.aside
            id="player-notes"
            {...panelMotion}
            className="fixed bottom-32 right-5 z-50 max-h-[65vh] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:right-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
              <div>
                <p className="font-anton scale-step-h5 text-balance text-ink-on-dark">{sermon.title}</p>
                <p className="meta mt-1 text-accent-on-dark">{sermon.scripture}</p>
              </div>
              <button type="button" onClick={() => setPanel(null)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-on-dark-muted hover:text-ink-on-dark" aria-label="Close notes">
                <X className="size-4" />
              </button>
            </div>
            <p className="scale-step-body mt-4 text-pretty text-ink-on-dark">{sermon.summary}</p>
            {sermon.keyTakeaways.length > 0 && (
              <ol className="mt-5 divide-y divide-hairline-dark border-y border-hairline-dark">
                {sermon.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="meta grid grid-cols-[2rem_1fr] gap-x-3 py-3 text-ink-on-dark">
                    <span className="tabular-nums text-ink-on-dark-muted">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-pretty">{point}</span>
                  </li>
                ))}
              </ol>
            )}
            {sermon.transcriptSnippet && (
              <blockquote className="meta mt-5 text-pretty text-ink-on-dark-muted">&ldquo;{sermon.transcriptSnippet}&rdquo;</blockquote>
            )}
          </motion.aside>
        )}

        {panel === 'episodes' && (
          <motion.aside
            id="player-episodes"
            {...panelMotion}
            className="fixed bottom-32 left-5 z-50 max-h-[60vh] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:left-8"
          >
            <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
              <p className="font-anton scale-step-lead text-ink-on-dark">Episodes</p>
              <button type="button" onClick={() => setPanel(null)} className="inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted hover:text-ink-on-dark" aria-label="Close episodes">
                <X className="size-4" />
              </button>
            </div>
            <ol className="divide-y divide-hairline-dark">
              {allSermons.map((s, idx) => {
                const current = s.id === sermon.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSermon(s);
                        setPanel(null);
                      }}
                      aria-current={current ? 'true' : undefined}
                      className="grid w-full grid-cols-[2rem_1fr] gap-x-3 py-3 text-left transition-opacity hover:opacity-80"
                    >
                      <span className="meta pt-0.5 tabular-nums text-ink-on-dark-muted">
                        {current ? <Play className="size-3 fill-current text-accent-on-dark" /> : String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className={`block font-sans text-sm font-semibold ${current ? 'text-accent-on-dark' : 'text-ink-on-dark'}`}>{s.title}</span>
                        <span className="meta block text-ink-on-dark-muted">
                          {s.speaker} · {s.duration}
                        </span>
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
