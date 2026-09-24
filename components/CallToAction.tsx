'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

/** The closing invitation: one giant line, one sentence, two ways in. */
export function CallToAction() {
  return (
    <section id="visit-cta" className="col-rules mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-40 lg:px-12">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="eyebrow flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          Plan a visit
          <span className="h-px w-8 bg-current" aria-hidden="true" />
        </p>
        <h2 className="font-anton scale-step-h1 mt-6 text-ink-strong">
          Have a Sunday in mind? Come and see.
        </h2>
        <p className="scale-step-lead mt-6 max-w-[40ch] text-ink/85">
          Whether it&rsquo;s your first church or your first in years, there is a seat, a welcome and no expectation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/visit" className="btn btn-primary">
            <span>Plan your visit</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn btn-outline">
            <span>Contact the office</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
