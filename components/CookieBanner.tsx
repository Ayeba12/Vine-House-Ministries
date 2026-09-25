'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { readConsent, subscribeConsent, writeConsent, type Consent } from '@/lib/consent';

/** On the server there is no cookie to read; 'unknown' keeps the banner out of the HTML until the browser has looked. */
const getSnapshot = () => readConsent() ?? 'none';
const getServerSnapshot = () => 'unknown' as const;

/**
 * The consent notice: a small olive panel at the foot of the page, in the
 * voice of the site's dark blocks, shown once until a choice is made. It
 * floats over the page, so it takes the one shadow the system allows for
 * floating surfaces (DESIGN.md §4), and it rises in once, from an
 * already-visible state under reduced motion.
 */
export function CookieBanner() {
  const consent = useSyncExternalStore(subscribeConsent, getSnapshot, getServerSnapshot);

  const choose = (value: Consent) => writeConsent(value);

  if (consent !== 'none') return null;

  return (
    <aside
      id="cookie-banner"
      role="region"
      aria-label="Cookie preferences"
      className="rise-in fixed inset-x-4 bottom-4 z-[60] rounded-xl bg-surface-dark p-6 text-ink-on-dark ring-1 ring-hairline-dark shadow-[0_8px_24px_rgba(30,36,43,0.24)] sm:left-6 sm:right-auto sm:w-[26rem] sm:p-7"
    >
      <h2 className="font-anton scale-step-h5 text-balance text-ink-on-dark">One small cookie.</h2>
      <p className="meta mt-3 max-w-[40ch] text-pretty text-ink-on-dark-muted">
        It remembers the choice you make here, and nothing that tracks you. If we add visitor statistics later,
        they stay off unless you accept them.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose('all')} className="btn btn-on-dark px-4 py-3">
          Accept all
        </button>
        <button type="button" onClick={() => choose('essential')} className="btn btn-outline-on-dark px-4 py-3">
          Essential only
        </button>
      </div>
      <Link href="/cookies" className="link-arrow mt-5 text-ink-on-dark-muted">
        <span>What it does</span>
        <ArrowUpRight className="size-3.5" />
      </Link>
    </aside>
  );
}
