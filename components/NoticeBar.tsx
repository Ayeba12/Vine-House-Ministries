'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Ticker } from '@/components/ui/Ticker';

interface NoticeBarProps {
  text: string;
  onDismiss: () => void;
}

/**
 * The notice above the navigation. A short notice sits still; one longer
 * than the space it has scrolls as a ticker (see Ticker for the rules).
 */
export function NoticeBar({ text, onDismiss }: NoticeBarProps) {
  return (
    <aside
      id="top-sanctuary-notice-bar"
      aria-label="Sanctuary notice"
      className="relative z-50 border-b border-hairline-dark bg-surface-dark text-ink-on-dark"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:px-12">
        <span className="eyebrow shrink-0 py-2 text-accent-on-dark">Live</span>
        <span className="h-4 w-px shrink-0 bg-hairline-dark" aria-hidden="true" />
        <div className="min-w-0 flex-1 py-2">
          <Ticker text={text} className="meta" overflow="wrap" />
        </div>
        <button
          id="btn-dismiss-notice-banner"
          type="button"
          onClick={onDismiss}
          className="-me-2 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-on-dark-muted transition-colors hover:text-ink-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-on-dark"
          aria-label="Dismiss notice"
        >
          <X className="size-4" />
        </button>
      </div>
    </aside>
  );
}
