'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GatheringPillar } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The four gathering rhythms as numbered tiles — the one place on the site
 * where the numbers carry real order, Sunday to Saturday.
 */
export function GatheringsGrid({ pillars, onPlanVisit }: { pillars: GatheringPillar[]; onPlanVisit: () => void }) {
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
          {pillars.map((pillar, idx) => (
            <Reveal key={pillar.number} delay={idx * 0.06}>
              {/* Every field the editor fills in WordPress is on the tile: title, subtitle, the description, when, where, tags. */}
              <article className="flex h-full flex-col rounded-xl bg-surface-tint p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-anton scale-step-h5 text-balance text-ink-strong">{pillar.title}</h3>
                    {pillar.subtitle && <p className="meta mt-1 text-ink-muted">{pillar.subtitle}</p>}
                  </div>
                  <span className="font-anton scale-step-h5 tabular-nums text-ink-muted">{pillar.number}</span>
                </div>
                {pillar.description && (
                  <p className="scale-step-body mt-4 line-clamp-3 text-pretty text-ink">{pillar.description}</p>
                )}
                <dl className="meta mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pt-6 text-ink-muted">
                  <dt>When</dt>
                  <dd className="text-ink">{pillar.timing}</dd>
                  <dt>Where</dt>
                  <dd className="text-ink">{pillar.location}</dd>
                </dl>
                {pillar.tags.length > 0 && <p className="meta mt-4 text-pretty text-ink-muted">{pillar.tags.join(' · ')}</p>}
              </article>
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
