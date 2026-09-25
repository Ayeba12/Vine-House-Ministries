'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useDragControls, useReducedMotion } from 'motion/react';
import { ChevronDown, Play, Pause, RotateCcw, RotateCw, Share2, X } from 'lucide-react';
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

type Panel = 'notes' | 'episodes' | 'share' | null;

/**
 * The sermon player over one real audio element whose source comes from
 * WordPress (the audio file on the sermon, or an external URL).
 *
 * From the md breakpoint up it is the docked slate bar with its floating
 * notes, episodes and share panels. Below it, it is a compact bar carrying
 * only the title, speaker, series, length and the play button; touching the
 * bar opens a drawer from the bottom with the photograph, the details, the
 * timeline, the transport, and notes, share and episodes as sections inside
 * it. Both are the same element, so opening or closing the drawer never
 * interrupts playback. Play state belongs to the page.
 */
export function AudioPlayerBar({ sermon, isPlaying, onTogglePlay, onClose, onSelectSermon, allSermons }: AudioPlayerBarProps) {
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const desktopBarRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [panel, setPanel] = useState<Panel>(null);
  const [drawer, setDrawer] = useState(false);
  const [section, setSection] = useState<Panel>(null);
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

  /* The file's own length. On a server-rendered page the browser can finish
     reading the metadata before React attaches the event handlers, so the
     element is read directly as well as listened to. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    const sync = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
      if (audio.readyState >= 1) setStatus((current) => (current === 'error' ? current : 'ready'));
    };
    audio.addEventListener('loadedmetadata', sync);
    audio.addEventListener('durationchange', sync);
    if (audio.readyState >= 1) queueMicrotask(sync);
    return () => {
      audio.removeEventListener('loadedmetadata', sync);
      audio.removeEventListener('durationchange', sync);
    };
  }, [src]);

  /* The page reserves exactly the visible bar's height at its foot while a
     bar is on screen (globals.css reads --docked-player-height), so the
     footer sits flush against the player at every width. */
  useEffect(() => {
    const bars = [desktopBarRef.current, mobileBarRef.current].filter((el): el is HTMLDivElement => Boolean(el));
    if (!bars.length) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      const height = Math.max(...bars.map((el) => el.offsetHeight));
      root.style.setProperty('--docked-player-height', `${Math.ceil(height)}px`);
    });
    bars.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.style.removeProperty('--docked-player-height');
    };
  }, [sermon]);

  /* Escape closes whichever panel or drawer is open; the page does not scroll behind the drawer. */
  useEffect(() => {
    if (!panel && !drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanel(null);
        setDrawer(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel, drawer]);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawer]);

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
  const progress = total > 0 ? Math.min(100, (currentTime / total) * 100) : 0;
  const statusLine = unavailable ? 'Audio for this sermon is not available yet.' : status === 'loading' ? 'Loading…' : null;

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = value;
    setCurrentTime(value);
  };

  const cycleRate = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);

  const shareUrl = typeof window === 'undefined' ? '' : `${window.location.origin}/sermons#${sermon.id}`;
  const shareText = `${sermon.title} · ${sermon.speaker} · ${sermon.scripture}`;

  /** The system share sheet where the browser has one; the site's own share list where it does not. */
  const share = async (where: 'desktop' | 'drawer') => {
    const data = { title: sermon.title, text: shareText, url: shareUrl };
    if (typeof navigator.share === 'function' && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return; // the sheet was dismissed
      }
    }
    if (where === 'desktop') setPanel(panel === 'share' ? null : 'share');
    else setSection(section === 'share' ? null : 'share');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared('copied');
      setTimeout(() => setShared(null), 2500);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
    setPanel(null);
  };

  const shareTargets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(sermon.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}` },
  ];

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

  const sheetMotion = reduceMotion
    ? {}
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } };

  const iconButton = 'inline-flex size-9 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark disabled:opacity-40';
  const playButton =
    'flex items-center justify-center rounded-full bg-accent-on-dark text-ink transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-on-dark';

  const shareList = (onDone: () => void) => (
    <ul className="divide-y divide-hairline-dark">
      {shareTargets.map((target) => (
        <li key={target.label}>
          <a
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDone}
            className="flex items-center justify-between gap-4 py-3 font-sans text-sm text-ink-on-dark transition-opacity hover:opacity-80"
          >
            <span>{target.label}</span>
            <span className="meta text-ink-on-dark-muted">Opens {target.label === 'Email' ? 'your mail app' : 'in a new tab'}</span>
          </a>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => {
            copyLink();
            onDone();
          }}
          className="flex w-full items-center justify-between gap-4 py-3 text-left font-sans text-sm text-ink-on-dark transition-opacity hover:opacity-80"
        >
          <span>Copy link</span>
          <span className="meta truncate text-ink-on-dark-muted">{shareUrl.replace(/^https?:\/\//, '')}</span>
        </button>
      </li>
    </ul>
  );

  const notesBody = (
    <>
      <p className="scale-step-body text-pretty text-ink-on-dark">{sermon.summary}</p>
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
    </>
  );

  const episodeList = (onPick: () => void) => (
    <ol className="divide-y divide-hairline-dark">
      {allSermons.map((s, idx) => {
        const current = s.id === sermon.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                onSelectSermon(s);
                onPick();
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
  );

  const timeline = (idSuffix: string) => (
    <div className="flex items-center gap-3">
      <span className="meta w-12 text-right tabular-nums text-ink-on-dark-muted">{fmt(currentTime)}</span>
      <input
        id={`player-seek-${idSuffix}`}
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
  );

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

      {/* ---- md and up: the docked bar ------------------------------------- */}
      <motion.div
        ref={desktopBarRef}
        id="docked-sermon-player"
        initial={reduceMotion ? false : { y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-hairline-dark bg-surface-deep text-ink-on-dark md:block"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-dark outline-1 -outline-offset-1 outline-white/10">
              {sermon.imageUrl && <Image src={sermon.imageUrl} alt="" fill sizes="48px" className="object-cover" referrerPolicy="no-referrer" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="eyebrow truncate text-accent-on-dark">
                {sermon.scripture} <span className="text-ink-on-dark-muted">· {sermon.series}</span>
              </p>
              <p className="font-anton scale-step-lead truncate text-ink-on-dark">{sermon.title}</p>
              <p className="meta truncate text-ink-on-dark-muted" aria-live="polite">
                {statusLine ?? `${sermon.speaker} · ${sermon.date}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => skip(-SKIP_SECONDS)} disabled={unavailable} className={`${iconButton} size-10`} aria-label={`Back ${SKIP_SECONDS} seconds`}>
                <RotateCcw className="size-4" />
              </button>
              <button id="btn-player-play-pause" type="button" onClick={onTogglePlay} disabled={unavailable} className={`${playButton} size-11`} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
              </button>
              <button type="button" onClick={() => skip(SKIP_SECONDS)} disabled={unavailable} className={`${iconButton} size-10`} aria-label={`Forward ${SKIP_SECONDS} seconds`}>
                <RotateCw className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-5">
              <button type="button" onClick={cycleRate} className="tab tab-on-dark tabular-nums" aria-label={`Playback speed, ${rate} times. Change speed`}>
                {rate}×
              </button>
              <button type="button" onClick={() => setPanel(panel === 'notes' ? null : 'notes')} className="tab tab-on-dark" aria-expanded={panel === 'notes'} aria-controls="player-notes">
                Notes
              </button>
              <button type="button" onClick={() => setPanel(panel === 'episodes' ? null : 'episodes')} className="tab tab-on-dark" aria-expanded={panel === 'episodes'} aria-controls="player-episodes">
                Episodes
              </button>
              <button
                type="button"
                onClick={() => share('desktop')}
                className={`relative ${iconButton} ${panel === 'share' ? 'text-ink-on-dark' : ''}`}
                aria-label="Share this sermon"
                aria-expanded={panel === 'share'}
                aria-controls="player-share"
              >
                <Share2 className="size-4" />
                {shared && (
                  <span className="eyebrow absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-accent-on-dark" role="status">
                    Link copied
                  </span>
                )}
              </button>
              <button type="button" onClick={onClose} className={iconButton} aria-label="Close player">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {timeline('desktop')}
        </div>
      </motion.div>

      {/* ---- below md: the compact bar ------------------------------------ */}
      <motion.div
        ref={mobileBarRef}
        id="compact-sermon-player"
        initial={reduceMotion ? false : { y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline-dark bg-surface-deep text-ink-on-dark md:hidden"
      >
        {/* Progress along the top edge: movement without controls. */}
        <div className="h-0.5 w-full bg-hairline-dark" aria-hidden="true">
          <div className="h-full bg-accent-on-dark" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3 px-5 py-3">
          <button type="button" onClick={() => setDrawer(true)} className="min-w-0 flex-1 text-left" aria-label="Open the player" aria-expanded={drawer} aria-controls="sermon-drawer">
            <span className="font-anton scale-step-lead block truncate text-ink-on-dark">{sermon.title}</span>
            <span className="meta block truncate text-ink-on-dark-muted" aria-live="polite">
              {statusLine ?? `${sermon.speaker} · ${sermon.series} · ${fmt(total)}`}
            </span>
          </button>
          <button id="btn-player-play-pause-compact" type="button" onClick={onTogglePlay} disabled={unavailable} className={`${playButton} size-11 shrink-0`} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </button>
          <button type="button" onClick={onClose} className={`${iconButton} -me-2 shrink-0`} aria-label="Close player">
            <X className="size-4" />
          </button>
        </div>
      </motion.div>

      {/* ---- below md: the drawer ---------------------------------------- */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            key="drawer"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] md:hidden"
          >
            <button type="button" onClick={() => setDrawer(false)} className="absolute inset-0 bg-surface-deep/80" aria-label="Close the player drawer" />
            <motion.div
              id="sermon-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={`Now playing: ${sermon.title}`}
              {...sheetMotion}
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 600) setDrawer(false);
              }}
              className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-xl bg-surface-deep text-ink-on-dark ring-1 ring-hairline-dark"
            >
              {/* The handle: drag it down to close. */}
              <div onPointerDown={(e) => dragControls.start(e)} className="flex shrink-0 touch-none items-center justify-between px-5 pt-3">
                <span className="w-9" aria-hidden="true" />
                <span className="h-1 w-10 rounded-full bg-hairline-dark" aria-hidden="true" />
                <button type="button" onClick={() => setDrawer(false)} className={iconButton} aria-label="Close the player drawer">
                  <ChevronDown className="size-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg bg-surface-dark outline-1 -outline-offset-1 outline-white/10">
                  {sermon.imageUrl && <Image src={sermon.imageUrl} alt="" fill sizes="(max-width: 767px) 100vw, 384px" className="object-cover" referrerPolicy="no-referrer" />}
                </div>

                <h2 className="font-anton scale-step-h4 mt-6 text-balance text-ink-on-dark">{sermon.title}</h2>
                <p className="meta mt-2 text-ink-on-dark">
                  {sermon.speaker}
                  {sermon.speakerRole && <span className="text-ink-on-dark-muted"> · {sermon.speakerRole}</span>}
                </p>
                <p className="meta text-ink-on-dark-muted">
                  {sermon.series} · {sermon.scripture} · {sermon.date}
                </p>
                {statusLine && (
                  <p className="meta mt-2 text-accent-on-dark" aria-live="polite">
                    {statusLine}
                  </p>
                )}

                <div className="mt-6">{timeline('drawer')}</div>

                <div className="mt-5 flex items-center justify-center gap-6">
                  <button type="button" onClick={() => skip(-SKIP_SECONDS)} disabled={unavailable} className={`${iconButton} size-12`} aria-label={`Back ${SKIP_SECONDS} seconds`}>
                    <RotateCcw className="size-6" />
                  </button>
                  <button type="button" onClick={onTogglePlay} disabled={unavailable} className={`${playButton} size-16`} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <Pause className="size-6 fill-current" /> : <Play className="ml-1 size-6 fill-current" />}
                  </button>
                  <button type="button" onClick={() => skip(SKIP_SECONDS)} disabled={unavailable} className={`${iconButton} size-12`} aria-label={`Forward ${SKIP_SECONDS} seconds`}>
                    <RotateCw className="size-6" />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-7">
                  <button type="button" onClick={cycleRate} className="tab tab-on-dark tabular-nums" aria-label={`Playback speed, ${rate} times. Change speed`}>
                    {rate}×
                  </button>
                  <button type="button" onClick={() => setSection(section === 'notes' ? null : 'notes')} className={`tab tab-on-dark ${section === 'notes' ? 'text-ink-on-dark' : ''}`} aria-expanded={section === 'notes'} aria-controls="drawer-notes">
                    Notes
                  </button>
                  <button type="button" onClick={() => share('drawer')} className={`tab tab-on-dark ${section === 'share' ? 'text-ink-on-dark' : ''}`} aria-expanded={section === 'share'} aria-controls="drawer-share">
                    Share
                  </button>
                </div>

                {section === 'notes' && (
                  <section id="drawer-notes" className="mt-6 border-t border-hairline-dark pt-5">
                    {notesBody}
                  </section>
                )}
                {section === 'share' && (
                  <section id="drawer-share" className="mt-6 border-t border-hairline-dark pt-2">
                    {shareList(() => setSection(null))}
                    {shared && (
                      <p className="meta pt-3 text-accent-on-dark" role="status">
                        Link copied
                      </p>
                    )}
                  </section>
                )}

                {/* Episodes: a collapsed section at the foot. */}
                <section className="mt-8 border-t border-hairline-dark">
                  <button
                    type="button"
                    onClick={() => setSection(section === 'episodes' ? null : 'episodes')}
                    className="flex w-full items-center justify-between py-4"
                    aria-expanded={section === 'episodes'}
                    aria-controls="drawer-episodes"
                  >
                    <span className="font-anton scale-step-lead text-ink-on-dark">Episodes</span>
                    <span className="meta flex items-center gap-2 text-ink-on-dark-muted">
                      {allSermons.length}
                      <ChevronDown className={`size-4 transition-transform duration-200 ${section === 'episodes' ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </span>
                  </button>
                  {section === 'episodes' && <div id="drawer-episodes">{episodeList(() => undefined)}</div>}
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- md and up: the floating panels -------------------------------- */}
      <AnimatePresence>
        {panel === 'share' && (
          <motion.aside
            id="player-share"
            {...panelMotion}
            aria-label="Share this sermon"
            className="fixed bottom-32 right-5 z-50 hidden w-[calc(100%-2.5rem)] max-w-xs rounded-xl bg-surface-dark p-5 text-ink-on-dark ring-1 ring-hairline-dark sm:right-8 md:block"
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-3">
              <div className="min-w-0">
                <p className="font-anton scale-step-lead text-ink-on-dark">Share</p>
                <p className="meta truncate text-ink-on-dark-muted">{sermon.title}</p>
              </div>
              <button type="button" onClick={() => setPanel(null)} className={`${iconButton} shrink-0`} aria-label="Close share">
                <X className="size-4" />
              </button>
            </div>
            {shareList(() => setPanel(null))}
          </motion.aside>
        )}

        {panel === 'notes' && (
          <motion.aside
            id="player-notes"
            {...panelMotion}
            className="fixed bottom-32 right-5 z-50 hidden max-h-[65vh] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:right-8 md:block"
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
              <div>
                <p className="font-anton scale-step-h5 text-balance text-ink-on-dark">{sermon.title}</p>
                <p className="meta mt-1 text-accent-on-dark">{sermon.scripture}</p>
              </div>
              <button type="button" onClick={() => setPanel(null)} className={`${iconButton} shrink-0`} aria-label="Close notes">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4">{notesBody}</div>
          </motion.aside>
        )}

        {panel === 'episodes' && (
          <motion.aside
            id="player-episodes"
            {...panelMotion}
            className="fixed bottom-32 left-5 z-50 hidden max-h-[60vh] w-[calc(100%-2.5rem)] max-w-md overflow-y-auto rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark sm:left-8 md:block"
          >
            <div className="flex items-center justify-between border-b border-hairline-dark pb-4">
              <p className="font-anton scale-step-lead text-ink-on-dark">Episodes</p>
              <button type="button" onClick={() => setPanel(null)} className={iconButton} aria-label="Close episodes">
                <X className="size-4" />
              </button>
            </div>
            {episodeList(() => setPanel(null))}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
