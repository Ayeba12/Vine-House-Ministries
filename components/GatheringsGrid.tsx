'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GATHERING_PILLARS } from '@/lib/data';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The four gathering rhythms as numbered tiles — the one place on the site
 * where the numbers carry real order, Sunday to Saturday.
 */
export function GatheringsGrid({ onPlanVisit }: { onPlanVisit: () => void }) {
  return (
    <section id="gatherings" className="col-rules mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="border-b border-hairline pb-8">
        <p className="eyebrow flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          Our gatherings
        </p>
        <h2 className="font-anton scale-step-h2 mt-4 uppercase text-ink-strong">From liturgy to life</h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          {GATHERING_PILLARS.map((pillar, idx) => (
            <Reveal key={pillar.number} delay={idx * 0.06}>
              <Link
                href="/gatherings"
                className="group flex h-full min-h-[240px] flex-col justify-between rounded-xl border border-transparent bg-surface-tint p-6 transition-colors hover:border-ink-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-ink-muted">{pillar.subtitle}</p>
                    <h3 className="font-anton scale-step-h5 mt-2 text-ink-strong">{pillar.title}</h3>
                  </div>
                  <span className="font-anton scale-step-h5 text-ink-muted">{pillar.number}</span>
                </div>
                <dl className="meta mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-muted">
                  <dt>When</dt>
                  <dd className="text-ink">{pillar.timing}</dd>
                  <dt>Where</dt>
                  <dd className="text-ink">{pillar.location}</dd>
                </dl>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="flex flex-col justify-between gap-8 lg:col-span-4 lg:pl-6">
          <p className="scale-step-body max-w-[42ch] text-ink">
            Every gathering at Vine House is curated without performative hype. From weekly communion at the solid
            oak altar to quiet Wednesday scripture exegesis and neighbourhood house tables, we honour historical
            Christian faith practices within an architecturally serene, contemporary atmosphere.
          </p>
          <div className="flex flex-col gap-5">
            <ul className="meta flex flex-col gap-1.5 text-ink-muted">
              <li>All gatherings free and open</li>
              <li>Vine Kids sanctuary on Sundays</li>
              <li>Step-free access throughout</li>
            </ul>
            <button onClick={onPlanVisit} className="link-arrow self-start text-ink-strong">
              <span>Plan your visit</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
