'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Message } from '@/lib/types';

/**
 * A journal entry as a card: photograph, title, excerpt, then the byline.
 * The whole card is the link, so it carries no control of its own; the
 * hairline ring darkens on hover and the title leads. Used by the index and
 * by "keep reading".
 */
export function MessageCard({ message }: { message: Message }) {
  return (
    <Link
      href={`/messages/${message.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline transition-shadow duration-150 ease-out hover:ring-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
    >
      <div className="relative aspect-[4/3] w-full bg-surface-deep outline-1 -outline-offset-1 outline-black/10">
        <Image
          src={message.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-anton scale-step-h5 text-balance text-ink-strong">{message.title}</h3>
        <p className="scale-step-body mt-2.5 line-clamp-3 text-pretty text-ink">{message.excerpt}</p>
        <div className="mt-auto pt-6">
          <p className="meta flex flex-col gap-0.5 border-t border-hairline pt-4 tabular-nums text-ink-muted">
            <span className="text-ink">{message.author}</span>
            <span>
              {message.category} · {message.date} · {message.readTime}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
