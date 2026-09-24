'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const DOCTRINES = [
  {
    title: 'The Centrality of Christ',
    scripture: 'John 15:5',
    summary:
      'Jesus Christ is the living centre of all faith and life. As branches connected to the true Vine, our vitality, fruitfulness and identity flow from abiding in him, not from religious performance.',
  },
  {
    title: 'Biblical Authority & Thoughtful Exegesis',
    scripture: '2 Timothy 3:16–17',
    summary:
      'The Scriptures are God-inspired, timeless truth guiding our doctrine, ethics and daily living. We encourage curiosity, rigorous contextual study and transformative personal application.',
  },
  {
    title: 'Sacred Liturgy & Weekly Communion',
    scripture: '1 Corinthians 11:23–26',
    summary:
      'Our gatherings prioritise contemplative prayer, acoustic praise and the weekly sharing of the Lord’s Table — a tangible means of grace where all who seek Christ are welcomed.',
  },
  {
    title: 'Radical Hospitality & Active Compassion',
    scripture: 'Micah 6:8 · Matthew 25:40',
    summary:
      'True spirituality shows in how we love our neighbours. We invest in food security, restorative justice, youth mentorship and open-door community care across our city.',
  },
];

export function AboutLeadership({ onPlanVisit }: { onPlanVisit: () => void }) {
  return (
    <section id="about-leadership" className="col-rules mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="border-b border-hairline pb-8">
        <p className="eyebrow flex items-center gap-3 text-accent">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          Pastoral leadership
        </p>
        <h2 className="font-anton scale-step-h2 mt-4 uppercase text-ink-strong">The shepherd &amp; the vision</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-deep">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
              alt="Pastor Mercy Yerifor, Lead Pastor of Vine House Ministries"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/85 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 left-6 right-6">
              <p className="eyebrow text-accent-on-dark">Lead Pastor &amp; Spiritual Director</p>
              <p className="font-anton scale-step-h4 mt-1 text-ink-on-dark">Mercy Yerifor</p>
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="eyebrow text-ink-muted">A letter from Pastor Mercy</p>
            <h3 className="font-anton scale-step-h4 mt-3 text-ink-strong">
              &ldquo;We built Vine House Ministries for those seeking depth, peace, and unvarnished truth.&rdquo;
            </h3>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col gap-4">
            <p className="scale-step-body max-w-[60ch] text-ink/90">
              In our fast-paced modern world it is easy to find entertainment, but remarkably difficult to find
              genuine spiritual sanctuary. Our mission is simple: to create a warm, sacred space where individuals
              and families can encounter Christ, be nourished by sound biblical exegesis, and find authentic
              community.
            </p>
            <p className="scale-step-body max-w-[60ch] text-ink/90">
              Whether you are a lifelong follower of Christ, a curious seeker, or someone returning to faith after
              years away, you are welcome here. We don’t ask for perfection or performance — just an open heart to
              abide in the Vine.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="eyebrow mb-2 text-ink-muted">What we hold to</p>
            <ol className="divide-y divide-hairline border-y border-hairline">
              {DOCTRINES.map((doc, idx) => (
                <li key={doc.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-5 lg:grid-cols-[2.5rem_2fr_3fr] lg:gap-x-8">
                  <span className="meta pt-1 text-ink-muted">0{idx + 1}</span>
                  <div>
                    <p className="font-anton scale-step-lead text-ink-strong">{doc.title}</p>
                    <p className="meta mt-1 text-accent">{doc.scripture}</p>
                  </div>
                  <p className="meta col-start-2 text-ink/80 lg:col-start-3">{doc.summary}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.2}>
            <button onClick={onPlanVisit} className="link-arrow text-ink-strong">
              <span>Meet the pastoral team</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
