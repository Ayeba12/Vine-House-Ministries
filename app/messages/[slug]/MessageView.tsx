'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MessageCard } from '@/components/MessageCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Message } from '@/lib/types';

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

interface MessageViewProps {
  post: Message;
  newer?: Message;
  older?: Message;
  more: Message[];
}

/** One message, as a client island for the share control. The server resolves the post and its neighbours. */
export function MessageView({ post, newer, older, more }: MessageViewProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      {/* Title block */}
      <header className={`${CONTAINER} col-rules pb-10 pt-32 sm:pt-40 lg:pt-44`}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {post.category}
          </p>
          <p className="meta text-ink-muted">
            <Link href="/" className="transition-colors hover:text-ink">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/messages" className="transition-colors hover:text-ink">Messages</Link>
          </p>
        </div>
        <h1 className="font-anton scale-step-h1 mt-10 max-w-[18ch] text-ink-strong sm:mt-14">{post.title}</h1>
        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-hairline pt-8 sm:mt-14 lg:grid-cols-12">
          <p className="scale-step-lead max-w-[44ch] text-ink lg:col-span-7">{post.excerpt}</p>
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted lg:col-span-5 lg:justify-self-end">
            <dt>Written by</dt>
            <dd className="text-ink">
              {post.author}
              <span className="block text-ink-muted">{post.authorRole}</span>
            </dd>
            <dt>Published</dt>
            <dd className="text-ink">{post.date}</dd>
            <dt>Reading</dt>
            <dd className="text-ink">{post.readTime}</dd>
            {post.scripture && (
              <>
                <dt>Scripture</dt>
                <dd className="text-ink">{post.scripture}</dd>
              </>
            )}
          </dl>
        </div>
      </header>

      {/* Photograph */}
      <section className={`${CONTAINER} pb-16 sm:pb-20`}>
        <Reveal>
          <figure className="relative overflow-hidden rounded-xl bg-surface-deep">
            <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                fill
                sizes="(min-width: 1440px) 1344px, 100vw"
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
            </div>
          </figure>
        </Reveal>
      </section>

      {/* Body */}
      <article className={`${CONTAINER} col-rules pb-24 sm:pb-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="flex flex-col gap-8 lg:col-span-3 lg:sticky lg:top-32 lg:self-start">
            <div>
              <p className="eyebrow text-ink-muted">Themes</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="chip cursor-default">{tag}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-4">
              <button onClick={copyLink} className="link-arrow text-ink-strong">
                <span>{copied ? 'Link copied' : 'Share this message'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <Link href="/messages" className="link-arrow text-ink-muted">
                <span>All messages</span>
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="flex max-w-[66ch] flex-col gap-7">
              {post.body.map((paragraph, i) => (
                <React.Fragment key={i}>
                  <p className={`text-ink/90 ${i === 0 ? 'scale-step-lead' : 'scale-step-body'}`}>{paragraph}</p>
                  {post.pullQuote && i === 1 && (
                    <blockquote className="my-6 border-l border-accent pl-6">
                      <p className="font-anton scale-step-h4 text-ink-strong">{post.pullQuote}</p>
                    </blockquote>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-14 border-t border-hairline pt-8">
              <p className="meta text-ink-muted">
                <span className="text-ink">{post.author}</span> · {post.authorRole}
              </p>
            </div>
          </div>
        </div>

        {/* Newer / older */}
        <nav aria-label="Other messages" className="mt-20 grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="py-6 sm:pr-8">
            {newer ? (
              <Link href={`/messages/${newer.slug}`} className="group flex flex-col gap-2">
                <span className="eyebrow text-ink-muted">Newer</span>
                <span className="font-anton scale-step-lead text-ink-strong transition-colors group-hover:text-accent">{newer.title}</span>
              </Link>
            ) : (
              <span className="eyebrow text-ink-muted">This is the latest message</span>
            )}
          </div>
          <div className="py-6 sm:pl-8 sm:text-right">
            {older ? (
              <Link href={`/messages/${older.slug}`} className="group flex flex-col gap-2 sm:items-end">
                <span className="eyebrow text-ink-muted">Older</span>
                <span className="font-anton scale-step-lead text-ink-strong transition-colors group-hover:text-accent">{older.title}</span>
              </Link>
            ) : (
              <span className="eyebrow text-ink-muted">This is the first message</span>
            )}
          </div>
        </nav>
      </article>

      {/* Keep reading */}
      <section className="bg-surface-tint">
        <div className={`${CONTAINER} py-24 sm:py-32`}>
          <SectionHeader
            eyebrow="Keep reading"
            title="More from the journal"
            meta={
              <Link href="/messages" className="link-arrow text-ink-strong">
                <span>All messages</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {more.map((m, idx) => (
              <Reveal key={m.id} delay={idx * 0.06}>
                <MessageCard message={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
