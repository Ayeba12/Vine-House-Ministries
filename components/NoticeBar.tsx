'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface NoticeBarProps {
  text: string;
  onDismiss: () => void;
}

/** Pixels per second the ticker travels. Slow enough to read at a glance. */
const TICKER_SPEED = 48;
/** Space between the two copies of the text in the loop. */
const TICKER_GAP = 64;

/**
 * The notice above the navigation. Short notices sit still. A notice longer
 * than the space it has scrolls as a ticker: the text is measured, and only
 * when it overflows does the loop run, on transform alone, pausing under
 * the pointer and once the bar has scrolled out of view. With reduced
 * motion on, a long notice wraps instead.
 */
export function NoticeBar({ text, onDismiss }: NoticeBarProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    if (!wrap || !measure) return;
    const resize = new ResizeObserver(() => {
      const width = measure.scrollWidth;
      setTextWidth(width > wrap.clientWidth ? width : 0);
    });
    resize.observe(wrap);
    resize.observe(measure);
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    intersection.observe(wrap);
    return () => {
      resize.disconnect();
      intersection.disconnect();
    };
  }, [text]);

  const ticker = textWidth > 0 && !reduceMotion;
  const duration = (textWidth + TICKER_GAP) / TICKER_SPEED;

  return (
    <aside
      id="top-sanctuary-notice-bar"
      aria-label="Sanctuary notice"
      className="relative z-50 border-b border-hairline-dark bg-surface-dark text-ink-on-dark"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:px-12">
        <span className="eyebrow shrink-0 py-2 text-accent-on-dark">Live</span>
        <span className="h-4 w-px shrink-0 bg-hairline-dark" aria-hidden="true" />

        <div ref={wrapRef} className="relative min-w-0 flex-1 overflow-hidden py-2">
          {/* Always present and invisible: the width the text would take on one line. */}
          <span ref={measureRef} className="meta invisible absolute left-0 top-0 whitespace-nowrap" aria-hidden="true">
            {text}
          </span>

          {ticker ? (
            <div
              className="notice-ticker"
              style={{ '--ticker-duration': `${duration}s`, animationPlayState: visible ? 'running' : 'paused' } as React.CSSProperties}
            >
              <span className="meta whitespace-nowrap" style={{ paddingInlineEnd: TICKER_GAP }}>
                {text}
              </span>
              <span className="meta whitespace-nowrap" style={{ paddingInlineEnd: TICKER_GAP }} aria-hidden="true">
                {text}
              </span>
            </div>
          ) : (
            <p className={`meta ${reduceMotion ? 'text-pretty' : 'truncate'}`}>{text}</p>
          )}
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
