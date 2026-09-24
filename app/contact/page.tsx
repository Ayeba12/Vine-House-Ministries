'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SanctuaryInteractiveMap } from '@/components/SanctuaryInteractiveMap';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Select } from '@/components/ui/Select';
import { Reveal } from '@/components/ui/Reveal';

type Category = 'general' | 'prayer' | 'sacraments' | 'charity';

const CATEGORIES: { id: Category; label: string; title: string; placeholder: string }[] = [
  { id: 'general', label: 'General enquiry', title: 'General Ministry Enquiry', placeholder: 'A question about ministry activities' },
  { id: 'prayer', label: 'Pastoral & prayer', title: 'Confidential Prayer & Pastoral Care', placeholder: 'Prayer for family health, or a pastoral consultation' },
  { id: 'sacraments', label: 'Sacred rites', title: 'Sacred Rites & Pastoral Request', placeholder: 'A baptism enquiry, or a child dedication' },
  { id: 'charity', label: 'Charity & trust', title: 'Charity Commission & Governance Enquiry', placeholder: 'A partnership, or trustee correspondence' },
];

const DOORS = [
  {
    tag: 'Administration',
    title: 'Ministry office',
    desc: 'General administrative enquiries, charity governance, venue information, and volunteering.',
    email: 'enquiries@vinehouseministries.org.uk',
    note: 'Monday to Friday, 09:00 – 17:00',
  },
  {
    tag: 'Pastoral care',
    title: 'Pastoral care & prayer team',
    desc: 'Confidential prayer requests, hospital or home visits, pastoral counselling appointments, and bereavement support.',
    email: 'pastoral@vinehouseministries.org.uk',
    note: 'Confidential reply within 24 hours',
  },
  {
    tag: 'Sacred rites',
    title: 'Sacred rites & partnerships',
    desc: 'Water baptisms, infant and child dedications, Christian wedding blessings, and community charity partnerships.',
    email: 'sacraments@vinehouseministries.org.uk',
    note: 'Greater London & Essex',
  },
];

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

const EMPTY = { name: '', email: '', phone: '', area: 'Greater London', subject: '', message: '' };

export default function ContactPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>('general');
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState<null | { ref: string; name: string; email: string; title: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = CATEGORIES.find((c) => c.id === category)!;

  /** Posts to the site's route handler, which passes the enquiry to Vine House Forms and the office inbox. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || submitting) return;
    setSubmitting(true);
    setError(null);
    const header = [form.subject ? `Subject: ${form.subject}` : '', `Region: ${form.area}`].filter(Boolean).join('\n');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `${header}\n\n${form.message}`,
          source: 'contact',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: number; message?: string };
      if (!res.ok) {
        setError(data.message ?? 'That did not go through. Please try again.');
        return;
      }
      setSent({
        ref: data.id ? `VHM-${String(data.id).padStart(6, '0')}` : `VHM-${Math.floor(100000 + Math.random() * 900000)}`,
        name: form.name,
        email: form.email,
        title: current.title,
      });
    } catch {
      setError('The church office could not be reached. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow="Charity office & pastoral care"
        crumb="Contact"
        title="Get in Touch &"
        titleSecond="Pastoral Enquiries"
        lead="Whether you are seeking pastoral prayer, requesting sacramental rites, contacting the ministry office, or asking about our charity outreach across Greater London & Essex, we welcome your correspondence."
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Office</dt>
            <dd className="text-ink">Monday to Friday, 09:00 – 17:00</dd>
            <dt>Telephone</dt>
            <dd className="text-ink">+44 (0)20 8553 1188</dd>
            <dt>Charity</dt>
            <dd className="text-ink">No. 1148977, England &amp; Wales</dd>
          </dl>
        }
      />

      {/* Three doors */}
      <section className={`${CONTAINER} col-rules py-16 sm:py-24`}>
        <SectionHeader eyebrow="Who to write to" title="Three doors" meta="Every door answers within 24 hours" />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {DOORS.map((door, idx) => (
            <Reveal key={door.title} delay={idx * 0.06}>
              <div className="tile h-full min-h-[280px] justify-between gap-8">
                <div>
                  <p className="eyebrow text-accent">{door.tag}</p>
                  <h3 className="font-anton scale-step-h5 mt-2 text-ink-strong">{door.title}</h3>
                  <p className="meta mt-3 max-w-[40ch] text-ink/85">{door.desc}</p>
                </div>
                <div className="border-t border-hairline pt-4">
                  <a href={`mailto:${door.email}`} className="link-arrow break-all text-ink-strong normal-case tracking-normal">
                    {door.email}
                  </a>
                  <p className="meta mt-2 text-ink-muted">{door.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className={`${CONTAINER} col-rules pb-24 sm:pb-32`}>
        <div className="grid grid-cols-1 gap-14 border-t border-hairline pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              Send a message
            </p>
            <h2 className="font-anton scale-step-h2 mt-4 text-ink-strong">Write to the office</h2>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2" role="tablist" aria-label="Enquiry type">
              {CATEGORIES.map((c) => (
                <button key={c.id} role="tab" aria-selected={category === c.id} onClick={() => setCategory(c.id)} className="tab">
                  {c.label}
                </button>
              ))}
            </div>

            {sent ? (
              <div className="mt-10 rounded-xl bg-surface-tint p-8">
                <p className="eyebrow text-accent">Received by the ministry office</p>
                <p className="font-anton scale-step-h3 mt-3 text-ink-strong">{sent.ref}</p>
                <p className="scale-step-body mt-4 max-w-[46ch] text-ink/85">
                  Thank you, {sent.name.split(' ')[0]}. Your {sent.title.toLowerCase()} has been routed to the right
                  team, and a confirmation is on its way to <strong>{sent.email}</strong>.
                </p>
                <button onClick={() => { setSent(null); setForm(EMPTY); }} className="link-arrow mt-8 text-ink-strong">
                  <span>Send another message</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="field-label">Full name</label>
                  <input id="c-name" type="text" required placeholder="David Sterling" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="c-email" className="field-label">Email address</label>
                  <input id="c-email" type="email" required placeholder="david@example.co.uk" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
                </div>
                <div>
                  <label htmlFor="c-phone" className="field-label">Telephone (optional)</label>
                  <input id="c-phone" type="tel" placeholder="020 8553 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
                </div>
                <Select
                  id="c-area"
                  label="Region"
                  value={form.area}
                  onChange={(v) => setForm({ ...form, area: v })}
                  options={[
                    { value: 'Greater London', label: 'Greater London' },
                    { value: 'Essex', label: 'Essex' },
                    { value: 'Other UK', label: 'Elsewhere in England & Wales' },
                    { value: 'International', label: 'International' },
                  ]}
                />
                <div className="sm:col-span-2">
                  <label htmlFor="c-subject" className="field-label">Subject</label>
                  <input id="c-subject" type="text" placeholder={current.placeholder} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-message" className="field-label">{category === 'prayer' ? 'Your prayer request' : 'Your message'}</label>
                  <textarea id="c-message" rows={4} required placeholder="Share the details of your enquiry or request" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field" />
                </div>
                {category === 'prayer' && (
                  <p className="meta border-l border-accent pl-4 text-ink-muted sm:col-span-2">
                    Pastoral discretion is guaranteed. Prayer requests are held in strict pastoral confidence.
                  </p>
                )}
                {error && (
                  <p className="meta text-accent sm:col-span-2" role="alert">
                    {error}
                  </p>
                )}
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitting} className="btn btn-primary disabled:opacity-60">
                    <span>{submitting ? 'Sending' : 'Send message'}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div className="rounded-xl bg-surface-dark p-6 text-ink-on-dark sm:p-7">
              <p className="eyebrow text-accent-on-dark">Legal &amp; charity registration</p>
              <p className="font-anton scale-step-h5 mt-2 text-ink-on-dark">Vine House Ministries</p>
              <dl className="meta mt-5 divide-y divide-hairline-dark border-t border-hairline-dark">
                {[
                  ['Charity Commission No.', '1148977'],
                  ['Jurisdiction', 'England & Wales'],
                  ['Operational area', 'Greater London & Essex'],
                  ['Governing document', 'Constitution (trustees)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-on-dark-muted">{k}</dt>
                    <dd className="text-right text-ink-on-dark">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <dl className="meta divide-y divide-hairline border-y border-hairline">
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                <dt className="text-ink-muted">Address</dt>
                <dd className="text-ink">Sanctuary Hall, Greater London &amp; Essex, United Kingdom</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                <dt className="text-ink-muted">Telephone</dt>
                <dd className="text-ink">+44 (0)20 8553 1188</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                <dt className="text-ink-muted">Office</dt>
                <dd className="text-ink">Monday to Friday, 09:00 – 17:00</dd>
              </div>
              <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                <dt className="text-ink-muted">Sundays</dt>
                <dd className="text-ink">10:00 &amp; 12:00</dd>
              </div>
            </dl>

            <div>
              <p className="meta max-w-[36ch] text-ink/85">
                Planning to attend a Sunday liturgy? Reserve a welcome pass and check transit routes.
              </p>
              <Link href="/visit" className="link-arrow mt-4 text-ink-strong">
                <span>Plan your visit</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Map */}
      <section className={`${CONTAINER} col-rules pb-24 sm:pb-32`}>
        <SectionHeader
          eyebrow="Find Sanctuary Hall"
          title="Directions & transit"
          meta={
            <a href="https://www.google.com/maps/dir/?api=1&destination=Vine+House+Ministries,+Sanctuary+Hall,+Greater+London" target="_blank" rel="noopener noreferrer" className="link-arrow text-ink-strong">
              <span>Open in Maps</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          }
        />
        <div className="mt-10">
          <SanctuaryInteractiveMap showTransitGuide />
        </div>
      </section>

      <Footer onPlanVisit={() => router.push('/visit')} />
    </main>
  );
}
