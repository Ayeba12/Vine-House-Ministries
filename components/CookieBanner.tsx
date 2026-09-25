'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { readConsent, subscribeConsent, writeConsent, type Consent } from '@/lib/consent';

/** On the server there is no cookie to read; 'unknown' keeps the banner out of the HTML until the browser has looked. */
const getSnapshot = () => readConsent() ?? 'none';
const getServerSnapshot = () => 'unknown' as const;

/**
 * The consent notice: a small raised panel at the foot of the page, shown
 * once until a choice is made. It floats over the page, so it takes the
 * one shadow the system allows for floating surfaces (DESIGN.md §4).
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
      className="fixed inset-x-4 bottom-4 z-[60] rounded-xl bg-surface-raised p-6 ring-1 ring-hairline shadow-[0_8px_24px_rgba(30,36,43,0.12)] sm:left-6 sm:right-auto sm:max-w-md"
    >
      <h2 className="font-anton scale-step-lead text-ink-strong">Cookies</h2>
      <p className="meta mt-2 text-pretty text-ink">
        This site sets one small cookie to remember your choice here, and nothing that tracks you. If we add
        visitor statistics later, they stay off unless you accept them.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => choose('all')} className="btn btn-primary px-4 py-2.5">
          Accept all
        </button>
        <button type="button" onClick={() => choose('essential')} className="btn btn-outline px-4 py-2.5">
          Essential only
        </button>
        <Link href="/cookies" className="link-arrow text-ink-muted sm:ms-auto">
          <span>Cookie policy</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
