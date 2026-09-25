'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/** How long the loading line runs before the next batch lands: long enough to read as work, short enough not to feel slow. */
const LOAD_DELAY_MS = 450;

/**
 * Pages a list already in memory: the first `pageSize` items show at once and
 * each call to `loadMore` reveals the next batch. `resetKey` is the current
 * filter state; when it changes the list starts again from the first page,
 * with no effect needed.
 */
export function useLoadMore<T>(items: T[], pageSize: number, resetKey: string) {
  const [state, setState] = useState({ key: resetKey, pages: 1, pending: false });
  const timer = useRef<number | null>(null);

  const pages = state.key === resetKey ? state.pages : 1;
  const pending = state.key === resetKey && state.pending;
  const shown = items.slice(0, pages * pageSize);
  const hasMore = shown.length < items.length;

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const loadMore = useCallback(() => {
    if (timer.current) return;
    setState((s) => ({ key: resetKey, pages: s.key === resetKey ? s.pages : 1, pending: true }));
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setState((s) => ({ key: resetKey, pages: (s.key === resetKey ? s.pages : 1) + 1, pending: false }));
    }, LOAD_DELAY_MS);
  }, [resetKey]);

  return { shown, hasMore, pending, loadMore };
}

interface LoadMoreProps {
  hasMore: boolean;
  pending: boolean;
  onMore: () => void;
  /** How many are on the page now, and how many there are in all. */
  shown: number;
  total: number;
  /** The plural noun for the count line: "sermons", "events". */
  noun: string;
}

/**
 * The foot of a paged list. Scrolling to it loads the next batch; the button
 * does the same for keyboards and for browsers without IntersectionObserver.
 * While a batch is on its way a gold sweep runs along a hairline, and once
 * everything is on the page the line says so.
 */
export function LoadMore({ hasMore, pending, onMore, shown, total, noun }: LoadMoreProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onMore();
      },
      { rootMargin: '0px 0px 240px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onMore]);

  return (
    <div ref={ref} className="mt-12 flex flex-col items-center gap-5 border-t border-hairline pt-10" aria-live="polite">
      {hasMore ? (
        <>
          <span className="load-more-track" data-pending={pending ? 'true' : 'false'} aria-hidden="true">
            <span />
          </span>
          <p className="meta tabular-nums text-ink-muted">
            {pending ? `Loading more ${noun}` : `${shown} of ${total} ${noun}`}
          </p>
          <button type="button" onClick={onMore} disabled={pending} className="btn btn-outline">
            <span>Load more</span>
          </button>
        </>
      ) : (
        <p className="meta tabular-nums text-ink-muted">
          All {total} {noun} shown
        </p>
      )}
    </div>
  );
}
