import React from 'react';

interface SanctuaryPassProps {
  /** The six-character pass code, e.g. VH-K3WFSB. */
  code: string;
  guests: number;
  /** The facts under the code: event, when, where, attendee. */
  rows: { label: string; value: string }[];
  /** The line at the foot of the card. */
  note: string;
  /** Replaces the guest count at the top right when the pass is not a plain confirmed one. */
  status?: string;
  /** A released pass: the code is struck through and loses its gold. */
  released?: boolean;
}

/**
 * The booking pass: a dark card with the church's name, the pass code in the
 * display face and the facts of the booking beneath. Shown when a booking is
 * made and again on the manage-my-booking page, so both read as one object.
 */
export function SanctuaryPass({ code, guests, rows, note, status, released = false }: SanctuaryPassProps) {
  return (
    <div className="rounded-xl bg-surface-dark p-6 text-ink-on-dark sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-hairline-dark pb-4">
        <div>
          <p className="font-anton scale-step-lead text-ink-on-dark">Vine House Ministries</p>
          <p className="meta text-ink-on-dark-muted">Sanctuary pass</p>
        </div>
        <p className="meta text-right text-ink-on-dark-muted">
          {status ?? `${guests} guest${guests === 1 ? '' : 's'}`}
        </p>
      </div>
      <p
        className={`font-anton scale-step-h3 mt-5 tabular-nums ${
          released ? 'text-ink-on-dark-muted line-through decoration-1' : 'text-accent-on-dark'
        }`}
      >
        {code}
      </p>
      <dl className="meta mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-ink-on-dark-muted">
        {rows.map((row) => (
          <React.Fragment key={row.label}>
            <dt>{row.label}</dt>
            <dd className="text-ink-on-dark">{row.value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="meta mt-5 border-t border-hairline-dark pt-4 text-ink-on-dark-muted">{note}</p>
    </div>
  );
}
