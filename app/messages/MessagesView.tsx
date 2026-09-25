'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MessageCard } from '@/components/MessageCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Reveal } from '@/components/ui/Reveal';
import { LoadMore, useLoadMore } from '@/components/ui/LoadMore';
import { Message } from '@/lib/types';

const CATEGORIES = ['All', 'Pastoral Letter', 'Reflection', 'Teaching', 'Community'];
const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';
/** How many messages the journal shows before the next batch loads: three rows of the three-column grid. */
const PAGE_SIZE = 9;

/** The journal index as a client island: search and the category select over the posts the server fetched. */
export function MessagesView({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtering = query !== '' || category !== 'All';

  const latest = messages[0];
  const visible = messages.filter((m) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q || [m.title, m.excerpt, m.author, ...m.tags].some((field) => field.toLowerCase().includes(q));
    return matchesQuery && (category === 'All' || m.category === category);
  });
  const { shown, hasMore, pending, loadMore } = useLoadMore(visible, PAGE_SIZE, `${query}|${category}`);
  const writers = new Set(messages.map((m) => m.author)).size;

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="The Vine Journal"
        crumb="Messages"
        title="Reflections &"
        titleSecond="Pastoral Letters"
        lead="Weekly writing from the pastoral team: letters from Pastor Mercy, lectionary reflections, teaching notes to sit alongside the sermons, and news from the life of the sanctuary."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Published</dt>
            <dd className="text-ink">Every Thursday</dd>
            <dt>Writers</dt>
            <dd className="text-ink">{writers} from the pastoral team</dd>
            <dt>Latest</dt>
            <dd className="text-ink">{latest?.date ?? 'Soon'}</dd>
          </dl>
        }
      />

      {/* Latest */}
      {latest && !filtering && (
        <section className="bg-surface-dark text-ink-on-dark">
          <div className={`${CONTAINER} col-rules-dark py-20 sm:py-28`}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <Reveal className="lg:col-span-6">
                <p className="eyebrow text-accent-on-dark">
                  Latest · {latest.category} · {latest.date}
                </p>
                <h2 className="font-anton scale-step-h2 mt-4 text-ink-on-dark">{latest.title}</h2>
                <p className="scale-step-lead mt-6 max-w-[44ch] text-ink-on-dark/90">{latest.excerpt}</p>
                <p className="meta mt-6 text-ink-on-dark-muted">
                  <span className="text-ink-on-dark">{latest.author}</span> · {latest.authorRole} · {latest.readTime}
                </p>
                <Link href={`/messages/${latest.slug}`} className="btn btn-on-dark mt-8">
                  <span>Read the message</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-6">
                <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-deep">
                  <Image
                    src={latest.imageUrl}
                    alt={latest.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* The journal */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="Every message" title="The journal" meta={`${visible.length} of ${messages.length}`} />

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12 lg:items-end">
          <SearchField
            className="lg:col-span-7"
            id="message-search"
            label="Search"
            placeholder="Title, author or theme"
            value={query}
            onChange={setQuery}
          />
          <Select
            className="lg:col-span-5"
            id="message-category"
            label="Category"
            value={category}
            onChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c, label: c === 'All' ? 'All categories' : c }))}
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
            {category !== 'All' && (
              <button onClick={() => setCategory('All')} className="chip" aria-label={`Remove category ${category}`}>
                <span>{category}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            <button onClick={() => { setQuery(''); setCategory('All'); }} className="link-arrow ml-2 text-ink-muted">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((message, idx) => (
            <Reveal key={message.id} delay={(idx % 3) * 0.06}>
              <MessageCard message={message} />
            </Reveal>
          ))}
        </div>

        {visible.length > 0 ? (
          <LoadMore hasMore={hasMore} pending={pending} onMore={loadMore} shown={shown.length} total={visible.length} noun="messages" />
        ) : (
          <p className="meta py-16 text-center text-ink-muted">Nothing matches. Try another category or clear the search.</p>
        )}
      </section>

      <Footer onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
