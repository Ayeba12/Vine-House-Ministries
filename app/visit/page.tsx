'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SanctuaryInteractiveMap } from '@/components/SanctuaryInteractiveMap';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

const STEPS = [
  {
    title: 'Arrival & coffee',
    desc: 'Doors open thirty minutes early. Pour-over coffee and fresh sourdough pastries in the glass atrium.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Acoustic liturgy & word',
    desc: 'Take a seat in the oak pews. Choral chant and hymns, then thoughtful, verse-by-verse scripture exegesis.',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Eucharist & quiet prayer',
    desc: 'Open communion every Sunday. Pastoral prayer teams wait quietly in the side alcoves for anyone who wants them.',
    image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Courtyard fellowship',
    desc: 'Stay on in the courtyard garden to meet Pastor Mercy, talk with members, and ask whatever you like.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  },
];

const FAQS = [
  {
    q: 'What should I wear?',
    a: 'There is no dress code. Our community dresses across the spectrum, from casual denim and jumpers to thoughtful Sunday attire. Come as you are, comfortably and authentically.',
  },
  {
    q: 'What is the Sunday service format and length?',
    a: 'Services last about 75 minutes and follow a historic four-fold rhythm: Gathering & Call to Worship, Word & Scriptural Exegesis, Table Communion & Prayers of Intercession, and the Sending Benediction.',
  },
  {
    q: 'Who can take communion?',
    a: 'We practise an Open Table. All baptised followers of Jesus, regardless of denominational heritage, and all who sincerely seek God’s grace are welcome to receive the bread and the cup.',
  },
  {
    q: 'What is there for children?',
    a: 'Vine NextGen children’s liturgy runs for infants through to Year 6 during both the 10:00 and 12:00 services. All caregivers are background-checked and trained in trauma-informed safety.',
  },
  {
    q: 'Is the sanctuary wheelchair accessible?',
    a: 'Yes. Street-level step-free entrances, a lift to all levels, accessible toilets on every floor, and designated seating with a hearing loop in the main hall.',
  },
];

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

export default function VisitPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', service: '10:00 Sanctuary Liturgy', guests: '1', children: false });
  const [pass, setPass] = useState<null | { id: string; name: string; service: string; guests: string; host: string }>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setPass({
      id: `VH-VISIT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name,
      service: form.service,
      guests: form.guests,
      host: 'Elena Vance, Welcome Team Lead',
    });
  };

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="Sunday sanctuary guide"
        crumb="Visit"
        title="Enter Into"
        titleSecond="Sacred Space"
        lead="Every Sunday at 10:00 and 12:00. Serving Greater London & Essex as a registered charity (No. 1148977). Here is everything you need to feel at peace for your first gathering."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Sundays</dt>
            <dd className="text-ink">10:00 &amp; 12:00</dd>
            <dt>Doors</dt>
            <dd className="text-ink">Open thirty minutes before</dd>
            <dt>Parking</dt>
            <dd className="text-ink">Free, on site</dd>
            <dt>Children</dt>
            <dd className="text-ink">Vine NextGen during both services</dd>
          </dl>
        }
      />

      {/* The Sunday journey */}
      <section className={`${CONTAINER} col-rules py-16 sm:py-24`}>
        <SectionHeader eyebrow="Sunday morning rhythm" title="The Sunday journey" meta="01 — 04" />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, idx) => (
            <Reveal key={step.title} delay={idx * 0.06} className="flex flex-col gap-4">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-deep">
                <Image src={step.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" referrerPolicy="no-referrer" />
                <span className="font-anton scale-step-h4 absolute right-4 top-3 text-ink-on-dark drop-shadow-md">0{idx + 1}</span>
              </figure>
              <div>
                <h3 className="font-anton scale-step-lead text-ink-strong">{step.title}</h3>
                <p className="meta mt-2 max-w-[40ch] text-ink/85">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-surface-dark text-ink-on-dark">
        <div className={`${CONTAINER} col-rules-dark py-24 sm:py-32`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-6">
              <p className="eyebrow text-accent-on-dark">Location &amp; transit</p>
              <h2 className="font-anton scale-step-h2 mt-4 text-ink-on-dark">Sanctuary Hall, Greater London &amp; Essex</h2>
              <p className="scale-step-body mt-6 max-w-[48ch] text-ink-on-dark/90">
                In the Greater London &amp; Essex corridor, easily reached by rail, the Elizabeth Line, the Underground and
                bus, with dedicated on-site parking.
              </p>
              <dl className="mt-8 divide-y divide-hairline-dark border-y border-hairline-dark">
                <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="font-anton scale-step-lead text-ink-on-dark">Rail &amp; Underground</dt>
                  <dd className="meta text-ink-on-dark/85">Direct connections via the Elizabeth Line, Central Line and regional buses, with step-free access throughout.</dd>
                </div>
                <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="font-anton scale-step-lead text-ink-on-dark">On-site parking</dt>
                  <dd className="meta text-ink-on-dark/85">Free church parking with hospitality wardens helping families on arrival.</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-deep">
                <Image src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80" alt="The atrium at Sanctuary Hall" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-transparent to-transparent" />
                <figcaption className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                  <span className="font-anton scale-step-h5 text-ink-on-dark">Every Sunday</span>
                  <span className="meta text-ink-on-dark-muted">10:00 morning liturgy · 12:00 noon gathering</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="Find us" title="Sanctuary Hall" meta="IG1 4TZ" />
        <div className="mt-10">
          <SanctuaryInteractiveMap showTransitGuide={false} />
        </div>
      </section>

      {/* Welcome pass */}
      <section className="bg-surface-tint">
        <div className={`${CONTAINER} py-24 sm:py-32`}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                Welcome concierge
              </p>
              <h2 className="font-anton scale-step-h2 mt-4 text-ink-strong">Reserve a welcome pass</h2>
              <p className="scale-step-body mt-6 max-w-[44ch] text-ink/85">
                Let the hospitality team know you are coming. A welcome guide will meet you at the door, save you seats,
                and hand you our welcome packet and gift.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              {pass ? (
                <div className="rounded-xl bg-surface-dark p-6 text-ink-on-dark sm:p-8">
                  <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
                    <div>
                      <p className="eyebrow text-accent-on-dark">Sanctuary welcome pass</p>
                      <p className="font-anton scale-step-h5 mt-1 text-ink-on-dark">Welcome, {pass.name.split(' ')[0]}.</p>
                    </div>
                  </div>
                  <p className="font-anton scale-step-h3 mt-5 text-accent-on-dark">{pass.id}</p>
                  <dl className="meta mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-on-dark-muted">
                    <dt>Gathering</dt><dd className="text-ink-on-dark">{pass.service}</dd>
                    <dt>Party</dt><dd className="text-ink-on-dark">{pass.guests} guest{pass.guests === '1' ? '' : 's'}</dd>
                    <dt>Your host</dt><dd className="text-ink-on-dark">{pass.host}</dd>
                  </dl>
                  <p className="meta mt-5 border-t border-hairline-dark pt-4 text-ink-on-dark-muted">
                    Show this at the welcome table in the atrium. Your host will have your welcome gift ready and walk you to your seats.
                  </p>
                  <button onClick={() => setPass(null)} className="link-arrow mt-6 text-ink-on-dark">
                    <span>Create another pass</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="visit-name" className="field-label">Full name</label>
                    <input id="visit-name" type="text" required placeholder="Jordan Mitchell" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
                  </div>
                  <div>
                    <label htmlFor="visit-email" className="field-label">Email address</label>
                    <input id="visit-email" type="email" required placeholder="jordan@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
                  </div>
                  <div>
                    <label htmlFor="visit-service" className="field-label">Sunday liturgy</label>
                    <select id="visit-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="field">
                      <option value="10:00 Sanctuary Liturgy">10:00 morning gathering</option>
                      <option value="12:00 Sanctuary Liturgy">12:00 noon gathering</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="visit-guests" className="field-label">People in your group</label>
                    <select id="visit-guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="field">
                      <option value="1">1 — just me</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4 or more</option>
                    </select>
                  </div>
                  <label className="meta flex cursor-pointer items-center gap-3 text-ink sm:col-span-2">
                    <input type="checkbox" checked={form.children} onChange={(e) => setForm({ ...form, children: e.target.checked })} className="h-4 w-4 accent-[#2C3E2D]" />
                    I am bringing children who will need nursery or NextGen check-in
                  </label>
                  <div className="sm:col-span-2">
                    <button type="submit" className="btn btn-primary">
                      <span>Reserve my pass</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="Questions" title="Before you come" meta={`${FAQS.length} questions`} />
        <dl className="mt-4 divide-y divide-hairline border-b border-hairline">
          {FAQS.map((faq, idx) => {
            const open = openFaq === idx;
            return (
              <div key={faq.q}>
                <dt>
                  <button
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                    className="grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 text-left"
                  >
                    <span className="meta text-ink-muted">0{idx + 1}</span>
                    <span className="font-anton scale-step-lead text-ink-strong">{faq.q}</span>
                    <span className="font-anton scale-step-lead text-ink-muted" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </dt>
                {open && (
                  <dd className="scale-step-body -mt-2 max-w-[60ch] pb-6 pl-[3.5rem] text-ink/85">{faq.a}</dd>
                )}
              </div>
            );
          })}
        </dl>
      </section>

      <Footer onSubscribe={() => {}} onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
