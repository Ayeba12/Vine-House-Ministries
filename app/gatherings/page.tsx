'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

const PILLARS = [
  {
    number: '01',
    subtitle: 'Sanctuary central',
    title: 'Sunday Liturgy & Eucharist',
    desc: 'Our central weekly corporate gathering at Sanctuary Hall. Acoustic choral worship, deep biblical exegesis, moments of silent prayer, and open table communion.',
    when: '10:00 & 12:00',
    link: { label: 'Plan a visit', href: '/visit' },
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
  },
  {
    number: '02',
    subtitle: 'Neighbourhoods',
    title: 'The Contemplative Table',
    desc: 'Intimate midweek house fellowships of 8–14 people meeting in homes across Greater London & Essex for shared home-cooked meals, lectio divina, and deep mutual care.',
    when: 'Midweek evenings',
    link: { label: 'Find a group', href: '#neighbourhood-groups' },
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    number: '03',
    subtitle: 'Ages 0–18',
    title: 'Vine NextGen & Kids Sanctuary',
    desc: 'A safe, joyful space for children and youth to explore scripture through Montessori-inspired Godly Play, creative art, and loving pastoral mentorship.',
    when: 'Sundays, during services',
    link: { label: 'Kids check-in', href: '/visit' },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  },
  {
    number: '04',
    subtitle: 'London & Essex',
    title: 'Community Mercy & Food Solidarity',
    desc: 'Every Saturday morning our charity outreach teams prepare and distribute warm meals and care packages for families and vulnerable neighbours across Greater London and Essex.',
    when: 'Saturdays, 09:00',
    link: { label: 'Volunteer roster', href: '/events' },
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
  },
];

type Borough = 'All' | 'Greater London' | 'Essex' | 'East London';

const HOUSE_GROUPS = [
  {
    id: 'hg-01',
    name: 'Ilford & Redbridge Contemplative Table',
    borough: 'Essex',
    neighbourhood: 'Ilford / Redbridge',
    day: 'Every Tuesday',
    time: '19:00 – 20:30',
    hosts: 'Marcus & Rachel Vance',
    description: 'A quiet gathering around a shared meal, contemplative silent prayer of examen, and lectionary discussion.',
    spotsOpen: 4,
  },
  {
    id: 'hg-02',
    name: 'Stratford & Newham Fellowship House',
    borough: 'East London',
    neighbourhood: 'Stratford / Olympic Park',
    day: 'Every Wednesday',
    time: '19:30 – 21:00',
    hosts: 'Julian & Sarah Chen',
    description: 'Focused on young creatives, professionals, and seekers exploring Christian theology and community vocation.',
    spotsOpen: 6,
  },
  {
    id: 'hg-03',
    name: 'Central London Liturgy Circle',
    borough: 'Greater London',
    neighbourhood: 'City / Central London',
    day: 'Every Thursday',
    time: '18:30 – 20:00',
    hosts: 'Dr Aaron & Hannah Miller',
    description: 'Dinner with scripture reflections, shared prayer requests, and mutual support for city professionals.',
    spotsOpen: 3,
  },
  {
    id: 'hg-04',
    name: 'Brentwood & Chelmsford Table of Peace',
    borough: 'Essex',
    neighbourhood: 'Brentwood & Mid-Essex',
    day: 'Alternate Thursdays',
    time: '19:00 – 20:45',
    hosts: 'Elena & Mateo Rostova',
    description: 'A warm hospitality table with acoustic worship, scripture lectio divina, and intercession.',
    spotsOpen: 5,
  },
  {
    id: 'hg-05',
    name: 'Greenwich & South London Seekers',
    borough: 'Greater London',
    neighbourhood: 'Greenwich / Canary Wharf',
    day: 'Every Monday',
    time: '19:15 – 20:45',
    hosts: 'Minister David K. Sterling',
    description: 'An open dialogue space for questions, historical apologetics, and deep philosophical wrestling with faith.',
    spotsOpen: 8,
  },
] as const;

const BOROUGHS: Borough[] = ['All', 'Greater London', 'Essex', 'East London'];

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

export default function GatheringsPage() {
  const router = useRouter();
  const [borough, setBorough] = useState<Borough>('All');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    neighbourhood: 'Ilford / Redbridge & Essex',
    notes: '',
  });

  const groups = HOUSE_GROUPS.filter((g) => borough === 'All' || g.borough === borough);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="The body & the table"
        crumb="Gatherings"
        title="Gatherings of Reverence"
        titleSecond="& Table Communion"
        lead="Vine House gathers not merely in a central sanctuary on Sundays, but across living rooms, kitchen tables, and community fellowship spaces throughout Greater London and Essex."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Sundays</dt>
            <dd className="text-ink">10:00 &amp; 12:00, Sanctuary Hall</dd>
            <dt>Midweek</dt>
            <dd className="text-ink">Five neighbourhood tables</dd>
            <dt>Saturdays</dt>
            <dd className="text-ink">09:00, community mercy</dd>
          </dl>
        }
      />

      {/* Four rhythms */}
      <section className={`${CONTAINER} col-rules py-16 sm:py-24`}>
        <SectionHeader eyebrow="Four rhythms" title="From sanctuary to street" meta="01 — 04" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PILLARS.map((p, idx) => (
            <Reveal key={p.number} delay={(idx % 2) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-deep">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-anton scale-step-h4 absolute right-5 top-4 text-ink-on-dark drop-shadow-md">
                    {p.number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                  <div>
                    <p className="eyebrow text-accent">{p.subtitle}</p>
                    <h3 className="font-anton scale-step-h5 mt-1 text-ink-strong">{p.title}</h3>
                  </div>
                  <p className="scale-step-body max-w-[56ch] text-ink/85">{p.desc}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                    <span className="meta text-ink-muted">{p.when}</span>
                    <Link href={p.link.href} className="link-arrow text-ink-strong">
                      <span>{p.link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* House groups: the dark ledger */}
      <section id="neighbourhood-groups" className="bg-surface-dark text-ink-on-dark">
        <div className={`${CONTAINER} col-rules-dark py-24 sm:py-32`}>
          <SectionHeader
            onDark
            eyebrow="Midweek table fellowship"
            title="Neighbourhood house groups"
            meta={`${groups.length} of ${HOUSE_GROUPS.length} tables`}
          />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <p className="scale-step-body max-w-[52ch] text-ink-on-dark/90 lg:col-span-7">
              Church is not confined to Sunday morning. Across Greater London and Essex our members gather in living
              rooms for shared supper, scripture reflection, and mutual encouragement.
            </p>
            <div className="flex flex-wrap gap-x-7 gap-y-2 lg:col-span-5 lg:justify-self-end" role="tablist" aria-label="Filter by area">
              {BOROUGHS.map((b) => (
                <button key={b} role="tab" aria-selected={borough === b} onClick={() => setBorough(b)} className="tab tab-on-dark">
                  {b}
                </button>
              ))}
            </div>
          </div>

          <ol className="mt-12 divide-y divide-hairline-dark border-y border-hairline-dark">
            {groups.map((g, idx) => (
              <Reveal key={g.id} delay={idx * 0.04}>
                <li className="grid grid-cols-1 gap-x-10 gap-y-4 py-7 lg:grid-cols-[1fr_260px_auto] lg:items-center">
                  <div className="min-w-0">
                    <p className="eyebrow text-accent-on-dark">
                      {g.borough} · {g.neighbourhood}
                    </p>
                    <h3 className="font-anton scale-step-h5 mt-1 text-ink-on-dark">{g.name}</h3>
                    <p className="scale-step-body mt-2 max-w-[60ch] text-ink-on-dark/85">{g.description}</p>
                  </div>
                  <dl className="meta grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-ink-on-dark-muted">
                    <dt>When</dt>
                    <dd className="text-ink-on-dark">
                      {g.day}, {g.time}
                    </dd>
                    <dt>Hosts</dt>
                    <dd className="text-ink-on-dark">{g.hosts}</dd>
                    <dt>Seats</dt>
                    <dd className="text-ink-on-dark">{g.spotsOpen} open</dd>
                  </dl>
                  <a
                    href="#interest-form"
                    onClick={() => setForm((prev) => ({ ...prev, neighbourhood: `${g.borough} – ${g.neighbourhood}` }))}
                    className="btn btn-outline-on-dark lg:justify-self-end"
                  >
                    <span>Request to join</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Interest form */}
      <section id="interest-form" className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Connect with a shepherd
            </p>
            <h2 className="font-anton scale-step-h2 mt-4 text-ink-strong">Find your midweek table</h2>
            <p className="scale-step-body mt-6 max-w-[44ch] text-ink/85">
              Fill out this brief form and our community director will personally introduce you to host shepherds in
              your neighbourhood.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {submitted ? (
              <div className="rounded-xl bg-surface-tint p-8">
                <p className="eyebrow text-accent">Request received</p>
                <p className="font-anton scale-step-h4 mt-3 text-ink-strong">Thank you, {form.name.split(' ')[0]}.</p>
                <p className="scale-step-body mt-4 max-w-[46ch] text-ink/85">
                  A host shepherd from {form.neighbourhood} will reach out to you at <strong>{form.email}</strong> within
                  48 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="link-arrow mt-8 text-ink-strong">
                  <span>Submit another request</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="hg-name" className="field-label">Full name</label>
                  <input id="hg-name" type="text" required placeholder="Rachel Adams" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="hg-email" className="field-label">Email address</label>
                  <input id="hg-email" type="email" required placeholder="rachel@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="hg-phone" className="field-label">Phone (optional)</label>
                  <input id="hg-phone" type="tel" placeholder="07700 900000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="hg-neighbourhood" className="field-label">Preferred neighbourhood</label>
                  <input id="hg-neighbourhood" type="text" value={form.neighbourhood} onChange={(e) => setForm({ ...form, neighbourhood: e.target.value })} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="hg-notes" className="field-label">Questions, dietary or childcare notes</label>
                  <textarea id="hg-notes" rows={3} placeholder="Anything that will help us connect you to the right host" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn btn-primary">
                    <span>Submit request</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer onSubscribe={() => {}} onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
