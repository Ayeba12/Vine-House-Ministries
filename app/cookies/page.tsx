import type { Metadata } from 'next';
import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { CONSENT_COOKIE, CONSENT_MONTHS } from '@/lib/consent';

export const metadata: Metadata = {
  title: 'Cookie policy — Vine House Ministries',
  description: 'The one cookie this website sets, what it does, and how to change your choice.',
};

const UPDATED = '25 September 2026';

const SECTIONS: LegalSection[] = [
  {
    id: 'what-cookies-are',
    heading: 'What cookies are',
    blocks: [
      'A cookie is a small text file a website asks your browser to keep, so that the site can recognise your browser the next time. Some are needed for a site to work at all; others follow you around to measure or advertise. UK law lets a site set the first kind without asking and requires your consent for the second.',
    ],
  },
  {
    id: 'what-we-set',
    heading: 'What this site sets',
    blocks: [
      'One cookie, and only after you have made a choice in the notice at the foot of the page:',
      {
        list: [
          `${CONSENT_COOKIE}: remembers whether you chose "Accept all" or "Essential only", so we do not ask again. It holds one of those two words and nothing else. It lasts ${CONSENT_MONTHS} months.`,
        ],
      },
      'That is the whole list. The website sets no analytics, advertising or social media cookies, and it loads no third-party scripts that would set their own. Fonts are served from our own site rather than from a fonts service, so no request leaves this site when a page loads.',
    ],
  },
  {
    id: 'what-we-do-not-set',
    heading: 'What we do not do',
    blocks: [
      {
        list: [
          'No visitor statistics. If we ever add them, they will be off by default and switched on only for visitors who chose "Accept all", and this page will be updated first.',
          'No advertising or tracking of any kind.',
          'No embedded players or social widgets that set their own cookies. Sermon audio is served by the site itself.',
        ],
      },
    ],
  },
  {
    id: 'your-choice',
    heading: 'Changing your choice',
    blocks: [
      'Because the only cookie is the one that records your choice, "Essential only" and "Accept all" currently behave the same; the difference matters only if optional tools are added later.',
      `To choose again, delete the ${CONSENT_COOKIE} cookie for this site in your browser’s settings, or clear the site’s data, and the notice will return on your next visit. Every browser lets you block cookies entirely; this site keeps working if you do.`,
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    blocks: [
      { note: `Last updated ${UPDATED}. If the list of cookies changes, this page changes first and the notice asks again.` },
    ],
  },
];

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Your browser"
      crumb="Cookies"
      title="Cookie"
      titleSecond="Policy"
      lead="This website sets one small cookie, to remember the choice you make in the notice at the foot of the page. Here is exactly what it does."
      updated={UPDATED}
      sections={SECTIONS}
      related={[
        { href: '/privacy', label: 'Privacy policy' },
        { href: '/terms', label: 'Terms and conditions' },
      ]}
    />
  );
}
