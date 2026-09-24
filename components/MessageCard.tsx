'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Message } from '@/lib/types';

/** A journal entry as a card: photograph, category, title, excerpt, byline. Used by the index and by "keep reading". */
export function MessageCard({ message }: { message: Message }) {
  return (
    <Link
      href={`/messages/${message.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-deep">
        <Image
          src={message.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="eyebrow text-accent">{message.category}</p>
        <h3 className="font-anton scale-step-h5 text-ink-strong">{message.title}</h3>
        <p className="meta line-clamp-3 text-ink/85">{message.excerpt}</p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-hairline pt-4">
          <p className="meta text-ink-muted">
            <span className="block text-ink">{message.author}</span>
            {message.date} · {message.readTime}
          </p>
          <span className="link-arrow shrink-0 text-ink-strong">
            <span>Read</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
