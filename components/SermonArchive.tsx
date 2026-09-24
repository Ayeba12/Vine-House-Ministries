'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { Sermon } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

interface SermonArchiveProps {
  sermons: Sermon[];
  activeSermon: Sermon | null;
  isPlaying: boolean;
  onPlaySermon: (sermon: Sermon) => void;
}

/**
 * The "works" grid: sermons as photographs with a dark caption panel, in
 * alternating wide/narrow pairs. Filtering is a row of plain text tabs;
 * the full search lives on /sermons.
 */
export function SermonArchive({ sermons, activeSermon, isPlaying, onPlaySermon }: SermonArchiveProps) {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const seriesList = ['All', ...Array.from(new Set(sermons.map((s) => s.series)))];
  const visible = sermons.filter((s) => selectedSeries === 'All' || s.series === selectedSeries);

  return (
    <section id="sermons" className="bg-surface-deep text-ink-on-dark">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="flex flex-col gap-6 border-b border-hairline-dark pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3 text-ink-on-dark-muted">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Selected teachings
            </p>
            <h2 className="font-anton scale-step-h2 mt-4 uppercase text-ink-on-dark">Messages that anchor us</h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="meta text-ink-on-dark-muted">Archive / Series / 2026</p>
            <Link href="/sermons" className="link-arrow text-ink-on-dark">
              <span>All sermons</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-7 gap-y-2 py-6" role="tablist" aria-label="Sermon series">
          {seriesList.map((series) => {
            const active = selectedSeries === series;
            return (
              <button
                key={series}
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedSeries(series)}
                className={`eyebrow border-b pb-1 transition-colors ${
                  active
                    ? 'border-accent-on-dark text-ink-on-dark'
                    : 'border-transparent text-ink-on-dark-muted hover:text-ink-on-dark'
                }`}
              >
                {series}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {visible.map((sermon, idx) => {
            const wide = idx % 4 === 0 || idx % 4 === 3;
            const isActive = activeSermon?.id === sermon.id;
            const playing = isActive && isPlaying;
            return (
              <Reveal
                key={sermon.id}
                delay={(idx % 2) * 0.08}
                className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
              >
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface-dark ${
                    isActive ? 'ring-1 ring-accent-on-dark' : ''
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={sermon.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="eyebrow rounded-md bg-surface-deep/85 px-2.5 py-1 text-ink-on-dark backdrop-blur-sm">
                        {sermon.series}
                      </span>
                      {playing && (
                        <span className="eyebrow rounded-md bg-accent-on-dark px-2.5 py-1 text-ink">Now playing</span>
                      )}
                    </div>
                    <button
                      onClick={() => onPlaySermon(sermon)}
                      className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-on-dark text-ink transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-on-dark"
                      aria-label={playing ? `Pause ${sermon.title}` : `Play ${sermon.title}`}
                    >
                      {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <h3 className="font-anton scale-step-h5 text-ink-on-dark">{sermon.title}</h3>
                      <dl className="meta grid shrink-0 grid-cols-[auto_1fr] gap-x-3 text-ink-on-dark-muted sm:text-right sm:grid-cols-1">
                        <dt className="sm:hidden">Passage</dt>
                        <dd className="text-ink-on-dark">{sermon.scripture}</dd>
                        <dt className="sm:hidden">Length</dt>
                        <dd>{sermon.duration}</dd>
                      </dl>
                    </div>
                    <p className="scale-step-body line-clamp-2 max-w-[60ch] text-ink-on-dark/85">{sermon.summary}</p>
                    <p className="meta mt-auto text-ink-on-dark-muted">
                      {sermon.speaker} · {sermon.date}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="meta py-16 text-center text-ink-on-dark-muted">Nothing in this series yet.</p>
        )}
      </div>
    </section>
  );
}
