'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Pause, Play, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Reveal } from '@/components/ui/Reveal';
import { INITIAL_SERMONS } from '@/lib/data';
import { Sermon } from '@/lib/types';

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

export default function SermonsPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [sermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState('All');
  const [topic, setTopic] = useState('All');
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(INITIAL_SERMONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reading, setReading] = useState<Sermon | null>(null);

  const allSeries = ['All', ...Array.from(new Set(sermons.map((s) => s.series)))];
  const allTopics = ['All', ...Array.from(new Set(sermons.flatMap((s) => s.tags)))];
  const filtering = query !== '' || series !== 'All' || topic !== 'All';

  const visible = sermons.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q || [s.title, s.speaker, s.scripture, s.summary].some((field) => field.toLowerCase().includes(q));
    return matchesQuery && (series === 'All' || s.series === series) && (topic === 'All' || s.tags.includes(topic));
  });

  const play = (sermon: Sermon) => {
    if (activeSermon?.id === sermon.id) setIsPlayingAudio((p) => !p);
    else {
      setActiveSermon(sermon);
      setIsPlayingAudio(true);
    }
  };
  const playingId = isPlayingAudio ? activeSermon?.id : null;
  const latest = sermons[0];

  return (
    <main className="min-h-screen bg-surface pb-28 text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar isPlayingAudio={isPlayingAudio} onToggleAudio={() => setIsPlayingAudio((p) => !p)} activeSermonTitle={activeSermon?.title} />

      <PageHeader
        eyebrow="The living word & lectionary"
        crumb="Sermons"
        title="Spoken Truth &"
        titleSecond="Scripture Exegesis"
        lead="Weekly pastoral teachings from Pastor Mercy Yerifor and ministry guests, grounded in original biblical languages, historical theology, and contemplative practice."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Messages</dt>
            <dd className="text-ink">{sermons.length} in the archive</dd>
            <dt>Series</dt>
            <dd className="text-ink">{allSeries.length - 1}</dd>
            <dt>Latest</dt>
            <dd className="text-ink">{latest?.date}</dd>
          </dl>
        }
      />

      {/* Latest teaching */}
      {latest && !filtering && (
        <section className="bg-surface-dark text-ink-on-dark">
          <div className={`${CONTAINER} col-rules-dark py-20 sm:py-28`}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <Reveal className="lg:col-span-7">
                <p className="eyebrow text-accent-on-dark">Latest teaching · {latest.series}</p>
                <h2 className="font-anton scale-step-h2 mt-4 text-ink-on-dark">{latest.title}</h2>
                <p className="scale-step-body mt-6 max-w-[52ch] text-ink-on-dark/90">{latest.summary}</p>
                <dl className="meta mt-6 flex flex-wrap gap-x-8 gap-y-1 text-ink-on-dark-muted">
                  <div><dt className="inline">Scripture </dt><dd className="inline text-ink-on-dark">{latest.scripture}</dd></div>
                  <div><dt className="inline">Speaker </dt><dd className="inline text-ink-on-dark">{latest.speaker}</dd></div>
                  <div><dt className="inline">Length </dt><dd className="inline text-ink-on-dark">{latest.duration}</dd></div>
                </dl>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <button onClick={() => play(latest)} className="btn btn-on-dark">
                    {playingId === latest.id ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    <span>{playingId === latest.id ? 'Pause' : 'Listen to the message'}</span>
                  </button>
                  <button onClick={() => setReading(latest)} className="link-arrow text-ink-on-dark">
                    <span>Read the transcript</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-5">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-deep">
                  <Image src={latest.imageUrl} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" referrerPolicy="no-referrer" priority />
                  <figcaption className="meta absolute bottom-5 left-5 text-ink-on-dark">{latest.speakerRole}</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Archive */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="The archive" title="Every message" meta={`${visible.length} of ${sermons.length} messages`} />

        {/* One row: search, then two dropdowns. Applied filters appear as chips beneath. */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12 lg:items-end">
          <SearchField
            className="lg:col-span-6"
            id="sermon-search"
            label="Search"
            placeholder="Title, scripture, speaker or keyword"
            value={query}
            onChange={setQuery}
          />
          <Select
            className="lg:col-span-3"
            id="sermon-series"
            label="Series"
            value={series}
            onChange={setSeries}
            options={allSeries.map((s) => ({ value: s, label: s === 'All' ? 'All series' : s }))}
          />
          <Select
            className="lg:col-span-3"
            id="sermon-topic"
            label="Topic"
            value={topic}
            onChange={setTopic}
            options={allTopics.map((t) => ({ value: t, label: t === 'All' ? 'All topics' : t }))}
          />
        </div>

        {filtering && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {query && (
              <button onClick={() => setQuery('')} className="chip" aria-label={`Remove search “${query}”`}>
                <span>“{query}”</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {series !== 'All' && (
              <button onClick={() => setSeries('All')} className="chip" aria-label={`Remove series ${series}`}>
                <span>{series}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {topic !== 'All' && (
              <button onClick={() => setTopic('All')} className="chip" aria-label={`Remove topic ${topic}`}>
                <span>{topic}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            <button onClick={() => { setQuery(''); setSeries('All'); setTopic('All'); }} className="link-arrow ml-2 text-ink-muted">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map((sermon, idx) => {
            const playing = playingId === sermon.id;
            return (
              <Reveal key={sermon.id} delay={(idx % 2) * 0.08}>
                <article id={sermon.id} className={`group flex h-full flex-col overflow-hidden rounded-xl bg-surface-raised ring-1 ${activeSermon?.id === sermon.id ? 'ring-ink-strong' : 'ring-hairline'}`}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-deep">
                    <Image src={sermon.imageUrl} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" referrerPolicy="no-referrer" />
                    <span className="eyebrow absolute left-4 top-4 rounded-md bg-surface-deep/85 px-2.5 py-1 text-ink-on-dark backdrop-blur-sm">{sermon.series}</span>
                    {playing && <span className="eyebrow absolute right-4 top-4 rounded-md bg-accent-on-dark px-2.5 py-1 text-ink">Now playing</span>}
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                    <div className="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
                      <h3 className="font-anton scale-step-h5 text-ink-strong">{sermon.title}</h3>
                      <p className="meta text-ink-muted xl:shrink-0 xl:text-right">
                        <span className="text-ink xl:block">{sermon.scripture}</span>
                        <span className="xl:hidden"> · </span>
                        {sermon.duration} · {sermon.date}
                      </p>
                    </div>
                    <p className="scale-step-body max-w-[56ch] text-ink/85">{sermon.summary}</p>
                    <ul className="meta flex flex-col gap-1 text-ink/80">
                      {sermon.keyTakeaways.slice(0, 2).map((t) => (
                        <li key={t} className="flex gap-2"><span className="text-ink-muted">—</span><span>{t}</span></li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4">
                      <button onClick={() => play(sermon)} className="btn btn-outline px-4 py-2.5">
                        {playing ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                        <span>{playing ? 'Pause' : 'Listen'}</span>
                      </button>
                      <button onClick={() => setReading(sermon)} className="link-arrow text-ink-strong">
                        <span>Read transcript</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="meta py-16 text-center text-ink-muted">No messages match. Try another series, topic or search term.</p>
        )}
      </section>

      {/* Transcript reader */}
      {reading && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-surface-deep/80 p-4 backdrop-blur-sm sm:items-center sm:p-6">
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-6 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-surface text-ink"
          >
            <div className="bg-surface-dark p-6 text-ink-on-dark sm:p-8">
              <button onClick={() => setReading(null)} className="absolute right-5 top-5 p-1 text-ink-on-dark-muted hover:text-ink-on-dark" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <p className="eyebrow text-accent-on-dark">Study guide &amp; transcript</p>
              <h2 className="font-anton scale-step-h4 mt-2 pr-10 text-ink-on-dark">{reading.title}</h2>
              <dl className="meta mt-4 flex flex-wrap gap-x-6 gap-y-1 text-ink-on-dark-muted">
                <dd className="text-ink-on-dark">{reading.scripture}</dd>
                <dd>{reading.speaker}</dd>
                <dd>{reading.series}</dd>
                <dd>{reading.date}</dd>
              </dl>
            </div>
            <div className="flex flex-col gap-8 overflow-y-auto p-6 sm:p-8">
              <blockquote className="scale-step-lead max-w-[46ch] text-ink">&ldquo;{reading.transcriptSnippet}&rdquo;</blockquote>
              <div>
                <p className="eyebrow mb-2 text-accent">Key takeaways</p>
                <ol className="divide-y divide-hairline border-y border-hairline">
                  {reading.keyTakeaways.map((k, idx) => (
                    <li key={idx} className="meta grid grid-cols-[2rem_1fr] gap-x-3 py-3 text-ink/90">
                      <span className="text-ink-muted">0{idx + 1}</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button onClick={() => { play(reading); setReading(null); }} className="btn btn-primary">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Listen now</span>
                </button>
                <button onClick={() => setReading(null)} className="link-arrow text-ink-muted">Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <AudioPlayerBar
        sermon={activeSermon}
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio((p) => !p)}
        onClose={() => { setIsPlayingAudio(false); setActiveSermon(null); }}
        onSelectSermon={(s) => { setActiveSermon(s); setIsPlayingAudio(true); }}
        allSermons={sermons}
      />

      <Footer onSubscribe={() => {}} onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
