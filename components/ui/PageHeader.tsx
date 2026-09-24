'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

interface PageHeaderProps {
  eyebrow: string;
  crumb: string;
  title: string;
  titleSecond?: string;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
}

/**
 * Every inner page opens the same way: eyebrow and breadcrumb on one line,
 * the title in the display face with its second line stepped right, then a
 * hairline with the lead paragraph and, optionally, a block of small facts.
 */
export function PageHeader({ eyebrow, crumb, title, titleSecond, lead, aside }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <header className="col-rules mx-auto max-w-[1440px] px-5 pb-10 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pt-44">
      <motion.div {...rise(0)} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="eyebrow flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          {eyebrow}
        </p>
        <p className="meta text-ink-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{crumb}</span>
        </p>
      </motion.div>

      <motion.h1 {...rise(0.08)} className="font-anton scale-step-h1 mt-10 text-ink-strong sm:mt-14">
        <span className="block">{title}</span>
        {titleSecond && <span className="block pl-[8%] text-ink sm:pl-[14%] lg:pl-[18%]">{titleSecond}</span>}
      </motion.h1>

      {(lead || aside) && (
        <motion.div
          {...rise(0.16)}
          className="mt-10 grid grid-cols-1 gap-8 border-t border-hairline pt-8 sm:mt-14 lg:grid-cols-12"
        >
          {lead && <div className="scale-step-lead max-w-[46ch] text-ink lg:col-span-7">{lead}</div>}
          {aside && <div className="lg:col-span-5 lg:justify-self-end">{aside}</div>}
        </motion.div>
      )}
    </header>
  );
}
