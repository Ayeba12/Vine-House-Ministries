import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/ui/PageHeader';

export type LegalBlock = string | { list: string[] } | { note: string };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

interface LegalDocumentProps {
  eyebrow: string;
  crumb: string;
  title: string;
  titleSecond?: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
  /** The other two policies, for the rail. */
  related: { href: string; label: string }[];
}

const CONTAINER = 'mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12';

/**
 * A policy page: the site's page header, then a contents rail beside a
 * numbered document at reading measure. Sections are plain data so the
 * three policies share one shape and can move to WordPress pages later.
 */
export function LegalDocument({ eyebrow, crumb, title, titleSecond, lead, updated, sections, related }: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-surface text-ink selection:bg-surface-dark selection:text-ink-on-dark">
      <Navbar />

      <PageHeader
        eyebrow={eyebrow}
        crumb={crumb}
        title={title}
        titleSecond={titleSecond}
        lead={lead}
        aside={
          <dl className="meta grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-muted">
            <dt>Last updated</dt>
            <dd className="text-ink">{updated}</dd>
            <dt>Charity</dt>
            <dd className="text-ink">No. 1148977, England &amp; Wales</dd>
            <dt>Questions</dt>
            <dd className="text-ink">
              <a href="mailto:enquiries@vinehouseministries.org.uk" className="transition-opacity hover:opacity-70">
                enquiries@vinehouseministries.org.uk
              </a>
            </dd>
          </dl>
        }
      />

      <section className={`${CONTAINER} col-rules pb-24 pt-8 sm:pb-32`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3 lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-ink-muted">Contents</p>
            <ol className="meta mt-3 flex flex-col gap-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex gap-3 text-ink transition-colors hover:text-accent">
                    <span className="tabular-nums text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="eyebrow mt-10 text-ink-muted">Also</p>
            <ul className="meta mt-3 flex flex-col gap-2">
              {related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 border-t border-hairline py-10 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-5">
                  <span className="meta tabular-nums text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="font-anton scale-step-h4 text-balance text-ink-strong">{section.heading}</h2>
                </div>
                <div className="mt-5 flex max-w-[66ch] flex-col gap-5">
                  {section.blocks.map((block, i) => {
                    if (typeof block === 'string') {
                      return (
                        <p key={i} className="scale-step-body text-pretty text-ink">
                          {block}
                        </p>
                      );
                    }
                    if ('list' in block) {
                      return (
                        <ul key={i} className="scale-step-body flex list-disc flex-col gap-2 ps-5 text-ink marker:text-ink-muted">
                          {block.list.map((item) => (
                            <li key={item} className="text-pretty">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="meta rounded-lg bg-surface-tint px-5 py-4 text-pretty text-ink-muted">
                        {block.note}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
