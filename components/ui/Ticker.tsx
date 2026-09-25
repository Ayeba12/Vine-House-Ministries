'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface TickerProps {
  text: string;
  /** Classes for the text itself: its size, face and colour. */
  className?: string;
  /** Pixels per second the loop travels. */
  speed?: number;
  /** Space between the two copies of the text in the loop. */
  gap?: number;
  /** Whether the loop may run at all. False keeps a long text still; the parent decides when. */
  active?: boolean;
  /** What a text that fits, or must stay still, does with overflow: cut it off, or wrap. */
  overflow?: 'truncate' | 'wrap';
}

/**
 * One line of text that scrolls as a ticker only when it does not fit. The
 * text is measured live; while it fits it sits still. The loop runs on
 * transform alone, pauses under the pointer and once scrolled out of view,
 * and never runs for anyone with reduced motion on, who gets the text cut
 * off (or wrapped) instead.
 */
export function Ticker({ text, className = '', speed = 48, gap = 64, active = true, overflow = 'truncate' }: TickerProps) {
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

  const ticker = textWidth > 0 && active && !reduceMotion;
  const duration = (textWidth + gap) / speed;

  return (
    <div ref={wrapRef} className="relative min-w-0 overflow-hidden">
      {/* Always present and invisible: the width the text takes on one line. */}
      <span ref={measureRef} className={`invisible absolute left-0 top-0 whitespace-nowrap ${className}`} aria-hidden="true">
        {text}
      </span>
      {ticker ? (
        <div
          className="notice-ticker"
          style={{ '--ticker-duration': `${duration}s`, animationPlayState: visible ? 'running' : 'paused' } as React.CSSProperties}
        >
          <span className={`whitespace-nowrap ${className}`} style={{ paddingInlineEnd: gap }}>
            {text}
          </span>
          <span className={`whitespace-nowrap ${className}`} style={{ paddingInlineEnd: gap }} aria-hidden="true">
            {text}
          </span>
        </div>
      ) : (
        <p className={`${overflow === 'wrap' && reduceMotion ? 'text-pretty' : 'truncate'} ${className}`}>{text}</p>
      )}
    </div>
  );
}
