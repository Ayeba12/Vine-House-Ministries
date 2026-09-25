import type { Metadata } from 'next';
import { LegalDocument, type LegalSection } from '@/components/LegalDocument';

export const metadata: Metadata = {
  title: 'Terms and conditions — Vine House Ministries',
  description: 'The terms on which Vine House Ministries offers this website, its content and event bookings.',
};

const UPDATED = '25 September 2026';

const SECTIONS: LegalSection[] = [
  {
    id: 'about-these-terms',
    heading: 'About these terms',
    blocks: [
      'This website is published by Vine House Ministries, a registered charity in England and Wales, number 1148977. By using it you agree to these terms. They are written to be read, not to catch anyone out; if anything is unclear, ask the ministry office at enquiries@vinehouseministries.org.uk.',
    ],
  },
  {
    id: 'using-the-site',
    heading: 'Using the site',
    blocks: [
      'You are welcome to read, share links to, and print pages from this site for personal, non-commercial use. Please do not copy sermons, writing or photographs for republication without asking us first, and do not use the site to send anything unlawful, abusive or misleading, or to attempt to interfere with how it runs.',
      'We aim to keep the site available at all times, but it may be taken down for maintenance or fail for reasons outside our control, and we do not promise uninterrupted access.',
    ],
  },
  {
    id: 'content',
    heading: 'Sermons, writing and photographs',
    blocks: [
      'The sermons, messages, photographs and other material on this site belong to Vine House Ministries or are used with permission. Scripture quotations are from the translations named where they appear. Where a photograph shows a person, it is used with their agreement; if you appear on the site and would rather not, tell us and we will remove it.',
      'What is written here is offered as teaching and encouragement within the life of the church. It is not legal, financial, medical or counselling advice, and nothing on the site replaces a conversation with a pastor or a qualified professional.',
    ],
  },
  {
    id: 'bookings',
    heading: 'Event bookings',
    blocks: [
      'Booking a place at an event through this site is free. When you book, we send you a pass code by email; show it at the door, on your phone or written down. A booking is for the number of guests you entered, and each event has a limited number of places.',
      {
        list: [
          'If an event is full, your booking may be placed on a waiting list. We will email you if a place comes free.',
          'To cancel, use the link in your confirmation email or write to the office. Please do, so someone else can have the place.',
          'We may need to change the time, venue or details of an event, or cancel it. We will tell everyone who has booked as soon as we can, by email.',
          'Bookings are personal to the person named and cannot be sold. They carry no monetary value.',
        ],
      },
    ],
  },
  {
    id: 'visiting',
    heading: 'Planning a visit',
    blocks: [
      'The visitor pass you can create on the Visit page is a welcome, not a ticket: every gathering is free and open, and you do not need a pass to attend. It simply lets the welcome team expect you.',
    ],
  },
  {
    id: 'accuracy',
    heading: 'Accuracy',
    blocks: [
      'We take care to keep service times, event details and contact information correct, and we update the site as soon as something changes. Even so, mistakes happen. If you are travelling for a particular gathering, the events page and the office are the places to confirm the details.',
    ],
  },
  {
    id: 'links',
    heading: 'Links to other sites',
    blocks: [
      'Where the site links to other websites, those sites have their own terms and privacy practices, which we do not control and are not responsible for.',
    ],
  },
  {
    id: 'liability',
    heading: 'Our responsibility to you',
    blocks: [
      'Nothing in these terms limits our responsibility for death or personal injury caused by our negligence, for fraud, or for anything else the law does not allow us to limit. Beyond that, we are not responsible for loss or damage arising from your use of the site or your reliance on its contents, or from events outside our reasonable control.',
    ],
  },
  {
    id: 'law',
    heading: 'Law and changes',
    blocks: [
      'These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction over any dispute about them.',
      { note: `We may update these terms; the date at the top shows the current version. Last updated ${UPDATED}.` },
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Using this site"
      crumb="Terms"
      title="Terms &"
      titleSecond="Conditions"
      lead="The terms on which we offer this website, the sermons and writing on it, and the free bookings you can make through it."
      updated={UPDATED}
      sections={SECTIONS}
      related={[
        { href: '/privacy', label: 'Privacy policy' },
        { href: '/cookies', label: 'Cookie policy' },
      ]}
    />
  );
}
