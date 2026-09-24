import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  meta?: React.ReactNode;
  onDark?: boolean;
}

/** Eyebrow with a leading rule, an uppercase display heading, small metadata at the right, one hairline beneath. */
export function SectionHeader({ eyebrow, title, meta, onDark = false }: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-5 border-b pb-8 md:flex-row md:items-end md:justify-between ${
        onDark ? 'border-hairline-dark' : 'border-hairline'
      }`}
    >
      <div>
        <p className={`eyebrow flex items-center gap-3 ${onDark ? 'text-accent-on-dark' : 'text-accent'}`}>
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className={`font-anton scale-step-h2 mt-4 uppercase ${onDark ? 'text-ink-on-dark' : 'text-ink-strong'}`}>
          {title}
        </h2>
      </div>
      {meta && <div className={`meta ${onDark ? 'text-ink-on-dark-muted' : 'text-ink-muted'}`}>{meta}</div>}
    </div>
  );
}
