'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Subscriber } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

interface FooterProps {
  onSubscribe: (sub: Subscriber) => void;
  onPlanVisit: () => void;
}

type Frequency = Subscriber['frequency'];

const NAVIGATE = [
  { label: 'About', href: '/about' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Gatherings', href: '/gatherings' },
  { label: 'Events', href: '/events' },
  { label: 'Visit', href: '/visit' },
  { label: 'Contact', href: '/contact' },
];

const GATHER = [
  { label: 'Sunday liturgy', value: '10:00' },
  { label: 'Sunday communion', value: '12:00' },
  { label: 'Midweek scripture', value: 'Wed 19:00' },
  { label: 'Youth & young adults', value: 'Fri 19:30' },
];

export function Footer({ onSubscribe, onPlanVisit }: FooterProps) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Weekly Devotional');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    onSubscribe({
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toLocaleDateString('en-GB'),
      frequency,
    });
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer id="site-footer" className="bg-surface-deep text-ink-on-dark">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 sm:pt-24 lg:px-12">
        <div className="grid grid-cols-1 gap-14 border-b border-hairline-dark pb-16 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-accent-on-dark">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              The Weekly Vine Journal
            </p>
            <h3 className="font-anton scale-step-h4 mt-4 text-ink-on-dark">Stay rooted in scripture &amp; grace</h3>
            <p className="meta mt-3 max-w-[44ch] text-ink-on-dark-muted">
              Lectionary reflections, pastoral letters and gathering updates, every Thursday morning.
            </p>

            {subscribed ? (
              <p className="scale-step-body mt-8 max-w-[44ch] text-ink-on-dark">
                Welcome to the fellowship. Expect your first reflection this Thursday.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-4">
                <div className="flex border-b border-hairline-dark focus-within:border-ink-on-dark">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-3 font-sans text-sm text-ink-on-dark placeholder:text-ink-on-dark-muted focus:outline-none"
                  />
                  <button type="submit" className="link-arrow self-center border-b-0 text-ink-on-dark">
                    <span>Join</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="meta flex flex-wrap gap-x-6 gap-y-2 text-ink-on-dark-muted">
                  {(['Weekly Devotional', 'Event Announcements'] as Frequency[]).map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="footer-frequency"
                        checked={frequency === option}
                        onChange={() => setFrequency(option)}
                        className="h-3.5 w-3.5 accent-[#D4A373]"
                      />
                      <span>{option === 'Weekly Devotional' ? 'Reflections & sermons' : 'Key gatherings only'}</span>
                    </label>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            <div>
              <p className="eyebrow text-ink-on-dark-muted">Navigate</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {NAVIGATE.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="font-sans text-sm text-ink-on-dark transition-opacity hover:opacity-70">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-ink-on-dark-muted">Gather</p>
              <dl className="meta mt-5 flex flex-col gap-2.5">
                {GATHER.map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <dt className="text-ink-on-dark">{item.label}</dt>
                    <dd className="text-ink-on-dark-muted">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-ink-on-dark-muted">The sanctuary</p>
              <address className="meta mt-5 flex flex-col gap-2.5 not-italic text-ink-on-dark">
                <span>Greater London &amp; Essex</span>
                <span className="text-ink-on-dark-muted">Step-free access · free visitor parking</span>
                <a href="mailto:enquiries@vinehouseministries.org.uk" className="break-all transition-opacity hover:opacity-70">
                  enquiries@vinehouseministries.org.uk
                </a>
                <span className="text-ink-on-dark-muted">Registered charity No. 1148977</span>
              </address>
              <button onClick={onPlanVisit} className="link-arrow mt-6 text-ink-on-dark">
                <span>Plan a visit</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* The wordmark */}
        <Reveal className="flex justify-end overflow-hidden pb-6 pt-14 sm:pt-20">
          <p className="font-anton scale-step-display select-none text-right leading-none text-ink-on-dark">Vine House.</p>
        </Reveal>

        <div className="meta flex flex-col gap-3 border-t border-hairline-dark pt-6 text-ink-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vine House Ministries. Registered charity in England &amp; Wales, No. 1148977.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/contact" className="transition-colors hover:text-ink-on-dark">Safeguarding</Link>
            <Link href="/contact" className="transition-colors hover:text-ink-on-dark">Pastoral care</Link>
            <Link href="/visit" className="transition-colors hover:text-ink-on-dark">Directions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
