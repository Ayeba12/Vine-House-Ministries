import type { Metadata } from 'next';
import { LegalDocument, type LegalSection } from '@/components/LegalDocument';

export const metadata: Metadata = {
  title: 'Privacy policy — Vine House Ministries',
  description: 'What Vine House Ministries collects through this website, why, how long it is kept, and your rights under UK data protection law.',
};

const UPDATED = '25 September 2026';

const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    blocks: [
      'Vine House Ministries is a Christian church and a registered charity in England and Wales, number 1148977, serving Greater London and Essex. For the purposes of the UK General Data Protection Regulation and the Data Protection Act 2018, the charity is the data controller for the personal information collected through this website.',
      'You can reach us about anything in this policy at enquiries@vinehouseministries.org.uk, or by writing to the ministry office at Sanctuary Hall, Greater London and Essex.',
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect, and when',
    blocks: [
      'Reading this website collects nothing about you. We only hold personal information when you choose to send it to us through one of these forms:',
      {
        list: [
          'Booking a place at an event: your name, email address, telephone number if you give it, how many guests are coming, whether it is your first visit, and any notes you add.',
          'Planning a Sunday visit: your name, email address, the service you have chosen, the size of your party and whether children are coming.',
          'The newsletter: your email address and which updates you asked for.',
          'Contacting us: your name, email address, telephone number if you give it, the kind of enquiry, and your message.',
        ],
      },
      'A message sent to the pastoral care team may contain a prayer request or something about your health, family or faith. Information of that kind is held in strict pastoral confidence, seen only by the pastoral team, and never used for any other purpose.',
    ],
  },
  {
    id: 'why-we-use-it',
    heading: 'Why we use it',
    blocks: [
      'We use what you send us for the purpose you sent it: to hold your place and welcome you at the door, to prepare for your visit, to send you the updates you asked for, or to answer your enquiry. That is either the performance of what you asked us to do or our legitimate interest in running the life of the church.',
      'For prayer requests and pastoral matters, which the law treats as special category data, we rely on the condition for not-for-profit religious bodies processing the information of people in regular contact with them, together with your explicit choice to share it with us.',
      'We do not sell personal information, share it with advertisers, or use it to build profiles.',
    ],
  },
  {
    id: 'where-it-goes',
    heading: 'Where it is kept',
    blocks: [
      'Submissions are stored in the church’s own content system, hosted by our web hosting provider, and are visible only to the ministry office and the pastoral team. Each submission also produces an email to the relevant office inbox.',
      'The website itself is served by our hosting platform, which keeps short-lived technical logs (such as the address a request came from) to keep the site running and secure. Those logs are not used to identify visitors.',
      'We do not transfer your information outside the United Kingdom other than as part of the hosting described above, under the safeguards those providers offer.',
    ],
  },
  {
    id: 'how-long',
    heading: 'How long we keep it',
    blocks: [
      {
        list: [
          'Event bookings: twelve months after the event, so we can welcome you back and understand attendance.',
          'Visit plans: six months after the Sunday you planned to visit.',
          'Newsletter subscriptions: until you ask to stop receiving them.',
          'Enquiries: two years, unless the matter is still open.',
          'Prayer requests and pastoral correspondence: only as long as the pastoral team needs them.',
        ],
      },
      'After these periods the records are deleted from the content system and the office inbox.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    blocks: [
      'You have the right to ask what information we hold about you, to have it corrected, to have it deleted, to restrict or object to how it is used, and to receive a copy of it. Email enquiries@vinehouseministries.org.uk and we will respond within one month.',
      'To stop the newsletter, reply to any issue or email the office and we will remove you.',
      'If you are unhappy with how we have handled your information, you can complain to the Information Commissioner’s Office at ico.org.uk or on 0303 123 1113. We would welcome the chance to put things right first.',
    ],
  },
  {
    id: 'children',
    heading: 'Children',
    blocks: [
      'Our forms are meant to be completed by adults. When you tell us children are coming with you, we record only that fact and, if you choose to give them, their ages, so the welcome team and Vine NextGen can be ready. We do not collect information from children directly through this website.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    blocks: [
      'We will update this page when our practices change and show the date at the top. Significant changes will also be announced on the site.',
      { note: `This policy was last updated on ${UPDATED}. Our cookie policy explains the one cookie this site sets.` },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Your information"
      crumb="Privacy"
      title="Privacy"
      titleSecond="Policy"
      lead="What we collect when you book, visit, subscribe or write to us, why we use it, how long we keep it, and what you can ask of us."
      updated={UPDATED}
      sections={SECTIONS}
      related={[
        { href: '/cookies', label: 'Cookie policy' },
        { href: '/terms', label: 'Terms and conditions' },
      ]}
    />
  );
}
