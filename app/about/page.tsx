'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';

const ANCHORS = [
  {
    title: 'Christocentricity',
    scripture: 'Colossians 1:15–20',
    description:
      'Jesus Christ is the living centre of all scripture, all liturgy, and all fellowship. We do not preach self-help or cultural trend; we proclaim Christ crucified, resurrected, and reigning in mercy.',
  },
  {
    title: 'Contemplative Reverence',
    scripture: 'Psalm 46:10 · 1 Kings 19:12',
    description:
      'In a culture saturated with hurried noise, we create sanctuary for holy silence, sacred liturgy, deep exegesis, and stillness where God speaks in sheer stillness.',
  },
  {
    title: 'Unconditional Grace & Open Table',
    scripture: 'Romans 8:38–39 · Luke 14:12–14',
    description:
      'We welcome seekers, sceptics, and believers alike without religious pretence. The table of communion is not earned by moral performance; it is a gift offered to all who thirst.',
  },
  {
    title: 'Regional Mercy & Active Solidarity',
    scripture: 'Micah 6:8 · Jeremiah 29:7',
    description:
      'Vine House Ministries does not exist in an enclave. As a registered charity in England & Wales (No. 1148977), we seek the peace and tangible flourishing of Greater London and Essex through community food solidarity and compassionate care.',
  },
  {
    title: 'Scriptural Authority & Honest Inquiry',
    scripture: '2 Timothy 3:16 · Acts 17:11',
    description:
      'We honour the living Word of God with intellectual rigour and historical context, welcoming honest questions and wrestling as genuine expressions of developing faith.',
  },
];

const LEADERS = [
  {
    name: 'Pastor Mercy Yerifor',
    role: 'Lead Pastor & Spiritual Director',
    bio: 'The visionary lead pastor of Vine House Ministries. Combining rich contemplative and sacramental traditions with warm gospel vitality, she has for over sixteen years guided seekers and believers into deep scripture immersion, prayer, and quiet spiritual formation across Greater London and Essex.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    education: 'Theological & Ministerial Leadership · London & International Studies',
  },
  {
    name: 'Minister David K. Sterling',
    role: 'Associate Minister of Liturgy & Teaching',
    bio: 'David oversees the liturgical rhythm, weekly exegesis research, and adult discipleship. His passion lies at the intersection of historical church liturgy and contemporary UK community life.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    education: 'M.T.S. Applied Theology & Liturgy',
  },
  {
    name: 'Elena Rostova',
    role: 'Director of Sacred Music & Choral Arts',
    bio: 'An accomplished choral director and musician, Elena curates our acoustic worship, weaving historical hymns, contemporary psalms, and acoustic reflection into Sunday worship.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    education: 'M.M. Choral Conducting & Sacred Arts',
  },
  {
    name: 'Marcus Thorne',
    role: 'Director of Community Mercy & Charity Outreach',
    bio: 'Marcus coordinates our charity initiatives, food solidarity distributions, community partnerships, and family outreach programmes across Greater London and Essex.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    education: 'B.Sc. Community Development & Social Action',
  },
];

const MILESTONES = [
  {
    year: '2012',
    tag: 'Foundation',
    title: 'Charity Commission registration',
    desc: 'Vine House Ministries is formally constituted and registered as a charity in England & Wales under Charity Commission number 1148977, establishing our spiritual charter.',
  },
  {
    year: '2016',
    tag: 'Expansion',
    title: 'Greater London & Essex rhythms',
    desc: 'The ministry establishes regular gatherings, lectionary teaching cohorts, and neighbourhood prayer tables serving families across East London and the Essex corridor.',
  },
  {
    year: '2021',
    tag: 'Liturgy',
    title: 'Contemplative Sunday liturgies',
    desc: 'Vine House launches dedicated Sunday morning liturgies combining acoustic hymnody, contemplative silence, lectionary scripture readings, and intentional table communion.',
  },
  {
    year: '2026',
    tag: 'Community',
    title: 'Flourishing ministry & mercy action',
    desc: 'Today Vine House welcomes hundreds of worshippers weekly, operates neighbourhood fellowship tables, and leads ongoing community outreach throughout London and Essex.',
  },
];

const SPACE = [
  {
    tag: 'Material craft',
    title: 'Raw materials',
    desc: 'White American oak pews, polished natural concrete, and hand-cut limestone. No synthetic veneers or disposable plastics.',
    image: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80',
  },
  {
    tag: 'Harmonics',
    title: 'Acoustic clarity',
    desc: 'Tuned for warm unamplified choral singing and clear speech, fostering an intimate dialogue between scripture reader and congregation.',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  },
  {
    tag: 'Sacred light',
    title: 'Natural skylights',
    desc: 'Three high clerestory light wells illuminate the communion table and altar, marking the transit of daylight across the sanctuary during liturgy.',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
  },
];

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="Our genesis & convictions"
        crumb="About"
        title="Ancient Liturgy"
        titleSecond="Modern Sanctuary"
        lead="Vine House Ministries is registered as a charity in England & Wales (Charity Commission number 1148977). We exist as a sanctuary of spiritual depth in Greater London & Essex where timeless Christian liturgy, thoughtful scripture exegesis, and radical hospitality converge."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Founded</dt>
            <dd className="text-ink">2012</dd>
            <dt>Charity</dt>
            <dd className="text-ink">No. 1148977, England &amp; Wales</dd>
            <dt>Region</dt>
            <dd className="text-ink">Greater London &amp; Essex</dd>
            <dt>Sundays</dt>
            <dd className="text-ink">10:00 &amp; 12:00</dd>
          </dl>
        }
      />

      {/* Hero photograph */}
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal>
          <figure className="relative overflow-hidden rounded-xl bg-surface-deep">
            <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
              <Image
                src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1800&q=80"
                alt="The interior of Sanctuary Hall"
                fill
                sizes="(min-width: 1440px) 1344px, 100vw"
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-transparent to-transparent" />
            </div>
            <figcaption className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3 sm:bottom-8 sm:left-8 sm:right-8">
              <span className="font-anton scale-step-h5 text-ink-on-dark">A clearing for contemplation &amp; prayer</span>
              <span className="meta text-ink-on-dark-muted">Sanctuary Hall · Greater London &amp; Essex</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Mission: the dark manifesto */}
      <section className="bg-surface-dark text-ink-on-dark">
        <div className={`${CONTAINER} col-rules-dark py-24 sm:py-32`}>
          <p className="eyebrow text-accent-on-dark">Mission &amp; story</p>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <h2 className="font-anton scale-step-h1 text-ink-on-dark">A church without noise or pretension.</h2>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8 lg:pt-3">
              <p className="scale-step-body text-ink-on-dark/90">
                In a restless metropolis where attention is constantly commodified, Vine House stands as a deliberate
                counter-culture. We do not construct religious spectacles. Instead, we create a holy clearing where tired
                souls can rest, listen, pray, and encounter the transcendent presence of the Living God.
              </p>
              <p className="scale-step-body text-ink-on-dark/90">
                Named after Christ&rsquo;s teaching in John 15 (&ldquo;I am the vine; you are the branches&rdquo;), we
                believe that spiritual vitality is not achieved through exhausted human striving, but received through
                intimate connection to Jesus Christ.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-16 sm:mt-20">
            <p className="eyebrow mb-2 text-ink-on-dark-muted">Our core rhythm</p>
            <dl className="divide-y divide-hairline-dark border-y border-hairline-dark">
              {[
                ['Word & Sacrament', 'Every service centres on deep scripture exegesis and weekly open communion.'],
                ['Silence & Song', 'Moments of contemplative stillness woven with acoustic choral hymnody.'],
                ['Table & City', 'Moving from sacred worship into radical hospitality and city mercy.'],
              ].map(([term, detail], idx) => (
                <div key={term} className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 py-5 lg:grid-cols-[2.5rem_1fr_2fr] lg:gap-x-8">
                  <span className="meta pt-1 text-ink-on-dark-muted">0{idx + 1}</span>
                  <dt className="font-anton scale-step-lead text-ink-on-dark">{term}</dt>
                  <dd className="scale-step-body col-start-2 text-ink-on-dark/85 lg:col-start-3">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Journey ledger */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="Historical heritage" title="Our journey & milestones" meta="2012 — 2026" />
        <ol className="divide-y divide-hairline">
          {MILESTONES.map((m, idx) => (
            <Reveal key={m.year} delay={idx * 0.05}>
              <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-8 lg:grid-cols-[160px_1fr_1fr] lg:items-start lg:gap-x-10">
                <span className="font-anton scale-step-h3 text-ink-strong">{m.year}</span>
                <div>
                  <p className="eyebrow text-accent">{m.tag}</p>
                  <h3 className="font-anton scale-step-h5 mt-1 text-ink-strong">{m.title}</h3>
                </div>
                <p className="scale-step-body col-span-2 max-w-[52ch] text-ink/85 lg:col-span-1">{m.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Statement of faith */}
      <section className={`${CONTAINER} col-rules pb-24 sm:pb-32`}>
        <SectionHeader eyebrow="Statement of faith" title="Theological foundations" meta="Five anchors" />
        <p className="scale-step-body mt-8 max-w-[60ch] text-ink/85">
          Rooted in historical Christian orthodoxy, the Nicene Creed, and the historic Protestant tradition, these five
          anchors guide our preaching, community life, and pastoral care.
        </p>
        <ol className="mt-10 divide-y divide-hairline border-y border-hairline">
          {ANCHORS.map((a, idx) => (
            <Reveal key={a.title} delay={idx * 0.04}>
              <li className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-6 lg:grid-cols-[2.5rem_2fr_3fr] lg:gap-x-8">
                <span className="meta pt-1 text-ink-muted">0{idx + 1}</span>
                <div>
                  <h3 className="font-anton scale-step-lead text-ink-strong">{a.title}</h3>
                  <p className="meta mt-1 text-accent">{a.scripture}</p>
                </div>
                <p className="scale-step-body col-start-2 max-w-[56ch] text-ink/85 lg:col-start-3">{a.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Leadership */}
      <section className="bg-surface-tint">
        <div className={`${CONTAINER} py-24 sm:py-32`}>
          <SectionHeader eyebrow="Pastoral leadership" title="The shepherds" meta="Led by Pastor Mercy Yerifor" />
          <p className="scale-step-body mt-8 max-w-[60ch] text-ink/85">
            Our leadership team is dedicated to rigorous biblical scholarship, empathetic pastoral care, and deep
            spiritual direction.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {LEADERS.map((leader, idx) => (
              <Reveal key={leader.name} delay={idx * 0.06} className="flex flex-col gap-4">
                <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-deep">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/85 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-5 left-5 right-5">
                    <p className="eyebrow text-accent-on-dark">{leader.role}</p>
                    <p className="font-anton scale-step-h5 mt-1 text-ink-on-dark">{leader.name}</p>
                  </figcaption>
                </figure>
                <p className="meta text-ink/85">{leader.bio}</p>
                <p className="meta text-ink-muted">{leader.education}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred space */}
      <section className={`${CONTAINER} col-rules py-24 sm:py-32`}>
        <SectionHeader eyebrow="Sacred space" title="The sanctuary architecture" meta="Material · Sound · Light" />
        <p className="scale-step-body mt-8 max-w-[60ch] text-ink/85">
          Designed in collaboration with minimalist liturgical architects, our sanctuary was intentionally crafted to
          shape the human heart through material truth and light.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {SPACE.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.06} className="flex flex-col gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-deep">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="eyebrow text-accent">{item.tag}</p>
                <h3 className="font-anton scale-step-h5 mt-1 text-ink-strong">{item.title}</h3>
                <p className="meta mt-2 max-w-[44ch] text-ink/85">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="bg-surface-dark text-ink-on-dark">
        <div className={`${CONTAINER} col-rules-dark flex flex-col items-center py-28 text-center sm:py-36`}>
          <p className="eyebrow text-accent-on-dark">Join us this Sunday</p>
          <h2 className="font-anton scale-step-h1 mt-6 max-w-4xl text-ink-on-dark">
            Experience sacred liturgy in London &amp; Essex.
          </h2>
          <p className="scale-step-lead mt-6 max-w-[42ch] text-ink-on-dark/85">
            Whether you are stepping into church for the first time in years or searching for a deeper contemplative
            spiritual home, our doors and tables are open.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/visit" className="btn btn-on-dark">
              <span>Plan your visit</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/sermons" className="btn btn-outline-on-dark">
              <span>Explore teachings</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer onSubscribe={() => {}} onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
