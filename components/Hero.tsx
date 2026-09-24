'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';
import { Sermon } from '@/lib/types';

interface HeroProps {
  onPlanVisit: () => void;
  onPlayFeaturedSermon?: () => void;
  featuredSermon?: Sermon;
}

export function Hero({ onPlanVisit, onPlayFeaturedSermon, featuredSermon }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const handlePlaySermon = () => {
    if (onPlayFeaturedSermon) onPlayFeaturedSermon();
    else document.getElementById('sermons')?.scrollIntoView({ behavior: 'smooth' });
  };

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero-sanctuary"
      className="col-rules relative mx-auto max-w-[1440px] overflow-hidden px-5 pb-12 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pt-44"
    >
      {/* Faint elevation drawing behind the headline, a drafting-sheet detail. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center text-ink-strong opacity-[0.045]"
      >
        <svg className="h-auto w-full max-w-5xl" viewBox="0 0 900 450" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="150" y="50" width="600" height="350" />
          <rect x="180" y="80" width="540" height="290" strokeDasharray="4 4" />
          <path d="M 350,50 C 350,150 550,150 550,50" />
          <circle cx="450" cy="120" r="16" />
          <line x1="450" y1="140" x2="450" y2="400" strokeWidth="1.5" />
          {[180, 220, 260, 300].map((y) => (
            <React.Fragment key={y}>
              <line x1="220" y1={y} x2="410" y2={y} />
              <line x1="490" y1={y} x2="680" y2={y} />
            </React.Fragment>
          ))}
          <line x1="150" y1="50" x2="750" y2="400" strokeDasharray="2 4" />
          <line x1="750" y1="50" x2="150" y2="400" strokeDasharray="2 4" />
        </svg>
      </div>

      {/* Top strip: small facts left, the one-word identity right. */}
      <motion.div {...rise(0)} className="relative grid grid-cols-2 gap-6 lg:grid-cols-4">
        <dl className="meta col-span-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-muted lg:col-span-2">
          <dt>Sanctuary</dt>
          <dd className="text-ink">Christian church &amp; registered charity</dd>
          <dt>Region</dt>
          <dd className="text-ink">Greater London &amp; Essex</dd>
          <dt>Sundays</dt>
          <dd className="text-ink">10:00 &amp; 12:00 · in person &amp; online</dd>
          <dt>Charity</dt>
          <dd className="text-ink">No. 1148977, England &amp; Wales</dd>
        </dl>
        <div className="col-span-2 lg:col-start-4">
          <p className="font-anton scale-step-h5 text-ink-strong">Sanctuary.</p>
          <p className="meta mt-2 max-w-[28ch] text-ink-muted">
            A contemporary church in the tradition of the True Vine — warm, reverent, and free of pretence.
          </p>
        </div>
      </motion.div>

      {/* The headline: second line pushed right, the way a plan sheet steps. */}
      <motion.h1
        {...rise(0.1)}
        className="font-anton scale-step-display relative mt-14 text-ink-strong sm:mt-20 lg:mt-24"
      >
        <span className="block">
          Structure <span className="text-ink-muted">&amp;</span>
        </span>
        <span className="block pl-[10%] text-ink sm:pl-[16%] lg:pl-[22%]">Deep Reverence</span>
      </motion.h1>

      {/* Bottom strip: overview left, actions right, one hairline above. */}
      <motion.div
        {...rise(0.2)}
        className="relative mt-14 grid grid-cols-1 gap-8 border-t border-hairline pt-8 sm:mt-20 lg:grid-cols-12 lg:items-end"
      >
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Overview
          </p>
          <p className="scale-step-lead mt-4 max-w-[38ch] text-ink">
            A welcoming Christian community in Greater London &amp; Essex — gathering for thoughtful scripture,
            contemplative worship, and authentic fellowship.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-6 lg:items-end">
          <p className="meta text-ink-muted">
            {featuredSermon
              ? `Latest message · ${featuredSermon.title} · ${featuredSermon.scripture}`
              : 'Built with intention · Est. Greater London & Essex'}
          </p>
          <div className="flex flex-wrap gap-3">
            <button id="btn-hero-plan-visit" onClick={onPlanVisit} className="btn btn-primary">
              <span>Plan a visit</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button id="btn-hero-play-sermon" onClick={handlePlaySermon} className="btn btn-outline">
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Listen to the message</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
