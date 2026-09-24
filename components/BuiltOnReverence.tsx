'use client';

import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The manifesto: the site's first dark monolith. A giant statement, a short
 * paragraph in the opposite column, one full-bleed photograph, a closing
 * word from the pastor. Nothing to click.
 */
export function BuiltOnReverence({}: { onPlanVisit: () => void }) {
  return (
    <section id="about" className="bg-surface-dark text-ink-on-dark">
      <div className="col-rules-dark mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <p className="eyebrow text-center text-accent-on-dark">About Vine House</p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2 className="font-anton scale-step-h1 text-ink-on-dark">Built on Reverence.</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-4">
            <p className="scale-step-body max-w-[46ch] text-ink-on-dark/90">
              We are a sanctuary that believes great faith is honest. No excess, no pretence — just space,
              scripture, and people working together in holy alignment. Every gathering we host is a commitment
              to spiritual grounding.
            </p>
            <p className="meta mt-5 text-ink-on-dark-muted">
              The spiritual truth is found in the removal of the unnecessary.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 sm:mt-20">
          <figure className="relative overflow-hidden rounded-xl bg-surface-deep">
            <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
              <Image
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1800&q=80"
                alt="Vineyard rows in evening light, the True Vine of John 15"
                fill
                sizes="(min-width: 1440px) 1344px, 100vw"
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-transparent to-transparent" />
            </div>
            <figcaption className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3 sm:bottom-8 sm:left-8 sm:right-8">
              <span className="font-anton scale-step-h5 text-ink-on-dark">The True Vine</span>
              <span className="meta text-ink-on-dark-muted">Christ &amp; his branches · John 15:5</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 sm:mt-20">
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <blockquote>
              <p className="scale-step-body max-w-[46ch] text-ink-on-dark/90">
                &ldquo;Our approach prioritises clarity over complexity. This ensures that every element serves a
                distinct spiritual function, resulting in a cohesive and enduring faith.&rdquo;
              </p>
              <footer className="eyebrow mt-5 text-accent-on-dark">— Mercy Yerifor, Lead Pastor</footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
