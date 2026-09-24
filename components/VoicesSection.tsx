'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/lib/data';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Testimonials laid out the way a reader's eye moves: the heading split to
 * the two margins, each quote a small card stepping across the page.
 */
export function VoicesSection() {
  const offsets = ['lg:col-start-4', 'lg:col-start-6', 'lg:col-start-2'];

  return (
    <section id="voices" className="col-rules mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="flex flex-col gap-2 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-anton scale-step-h2 uppercase text-ink-strong">What they</h2>
        <p className="eyebrow text-ink-muted sm:pb-3">Sanctuary voices</p>
        <h2 className="font-anton scale-step-h2 uppercase text-ink-strong">Have said</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-y-12">
        {TESTIMONIALS.map((t, idx) => (
          <Reveal key={t.id} delay={idx * 0.08} className={`lg:col-span-6 ${offsets[idx % offsets.length]}`}>
            <figure className="flex h-full flex-col gap-6 rounded-xl border border-hairline bg-surface-raised p-6 sm:p-8">
              <p className="eyebrow text-accent">{t.tag}</p>
              <blockquote className="scale-step-lead text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto flex items-center gap-4">
                {t.avatarUrl && (
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-tint">
                    <Image src={t.avatarUrl} alt="" fill sizes="44px" className="object-cover" referrerPolicy="no-referrer" />
                  </span>
                )}
                <span className="flex flex-col">
                  <span className="font-sans text-sm font-semibold text-ink-strong">{t.author}</span>
                  <span className="meta text-ink-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
