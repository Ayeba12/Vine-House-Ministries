'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface SanctuaryInteractiveMapProps {
  className?: string;
  showTransitGuide?: boolean;
}

const ADDRESS = 'Vine House Ministries, Sanctuary Hall, Cranbrook & Eastern Gateway, Greater London & Essex, IG1 4TZ';
const LAT = 51.559;
const LNG = 0.074;

const GOOGLE = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
const APPLE = `https://maps.apple.com/?q=${encodeURIComponent('Vine House Ministries')}&ll=${LAT},${LNG}`;
const CITYMAPPER = `https://citymapper.com/directions?endcoord=${LAT}%2C${LNG}&endname=${encodeURIComponent('Vine House Ministries Sanctuary Hall')}`;
const OSM = `https://www.openstreetmap.org/export/embed.html?bbox=0.0450%2C51.5450%2C0.1050%2C51.5730&layer=mapnik&marker=${LAT}%2C${LNG}`;

const ARRIVAL = [
  {
    title: 'Rail & Elizabeth Line',
    sub: 'Elizabeth & Central Line',
    detail: 'Direct high-frequency links: 12 minutes from Stratford, 18 from Liverpool Street, with step-free lifts and easy street access.',
    note: '4-minute walk · step-free',
  },
  {
    title: 'Free on-site parking',
    sub: '60+ dedicated bays',
    detail: 'Complimentary parking on church grounds with a steward greeting, designated Blue Badge bays, and EV charging points.',
    note: 'Opens 08:30 on Sundays',
  },
  {
    title: 'Local bus routes',
    sub: 'Routes 86, 128, 145, 150',
    detail: 'TfL and regional buses stop directly opposite Sanctuary Hall at the Church Gate shelter, with covered seating and live boards.',
    note: 'Every 3–5 minutes',
  },
  {
    title: 'Full accessibility',
    sub: 'Step-free & induction loop',
    detail: 'Zero-threshold entry from street level, wheelchair bays in the sanctuary, a T-coil hearing loop, and a calm family nursing lounge.',
    note: 'All levels',
  },
];

/** The sanctuary on a map, with the ways to get there set as a ledger beneath it. */
export function SanctuaryInteractiveMap({ className = '', showTransitGuide = true }: SanctuaryInteractiveMapProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard?.writeText(ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`flex flex-col gap-12 ${className}`} id="sanctuary-map-container">
      <figure className="overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline">
        <div className="relative h-[360px] w-full bg-surface-tint sm:h-[440px]">
          <iframe title="Map of Sanctuary Hall" src={OSM} className="h-full w-full border-0" loading="lazy" />
        </div>
        <figcaption className="grid grid-cols-1 gap-6 p-6 sm:p-7 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-accent">Sanctuary Hall &amp; charity office</p>
            <p className="font-anton scale-step-h5 mt-1 text-ink-strong">Vine House Ministries</p>
            <p className="meta mt-2 max-w-[44ch] text-ink-muted">
              Cranbrook &amp; Eastern Gateway, Greater London &amp; Essex · IG1 4TZ · Sundays 10:00 &amp; 12:00
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-x-7 gap-y-3 lg:col-span-6 lg:justify-end">
            {[
              ['Google Maps', GOOGLE],
              ['Apple Maps', APPLE],
              ['Citymapper', CITYMAPPER],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="link-arrow text-ink-strong">
                <span>{label}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
            <button type="button" onClick={copyAddress} className="link-arrow text-ink-strong">
              <span>{copied ? 'Address copied' : 'Copy address'}</span>
            </button>
          </div>
        </figcaption>
      </figure>

      {showTransitGuide && (
        <dl className="divide-y divide-hairline border-y border-hairline">
          {ARRIVAL.map((item, idx) => (
            <div key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-6 lg:grid-cols-[2.5rem_2fr_3fr_auto] lg:items-start lg:gap-x-8">
              <span className="meta pt-1 text-ink-muted">0{idx + 1}</span>
              <dt>
                <span className="font-anton scale-step-lead block text-ink-strong">{item.title}</span>
                <span className="meta mt-1 block text-accent">{item.sub}</span>
              </dt>
              <dd className="scale-step-body col-start-2 max-w-[52ch] text-ink/85 lg:col-start-3">{item.detail}</dd>
              <dd className="meta col-start-2 text-ink-muted lg:col-start-4 lg:text-right">{item.note}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
