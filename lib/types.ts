export interface Sermon {
  id: string;
  title: string;
  series: string;
  speaker: string;
  speakerRole: string;
  date: string;
  duration: string;
  audioDurationSeconds: number;
  scripture: string;
  summary: string;
  keyTakeaways: string[];
  audioUrl: string;
  imageUrl: string;
  transcriptSnippet: string;
  tags: string[];
}

export interface ChurchEvent {
  id: string;
  title: string;
  category: 'Worship' | 'Fellowship' | 'Outreach' | 'Study' | 'Youth';
  date: string;
  time: string;
  location: string;
  room: string;
  capacity: number;
  rsvpdCount: number;
  description: string;
  host: string;
  imageUrl: string;
  highlights: string[];
  /** From WordPress: open, waitlist, full, closed, not_yet_open or disabled. Absent in the seed data. */
  bookingStatus?: string;
}

export interface RSVPRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  guestsCount: number;
  isFirstTimeVisitor: boolean;
  notes?: string;
  createdAt: string;
  qrPassCode: string;
  checkedIn: boolean;
}

export interface GatheringPillar {
  number: string;
  title: string;
  subtitle: string;
  timing: string;
  location: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  tag: string;
  avatarUrl?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  frequency: 'Weekly Devotional' | 'Event Announcements' | 'All Updates';
  subscribedAt: string;
}

/** A written piece in the journal: a pastoral letter, a reflection, a teaching note, or news from the community. */
export interface Message {
  id: string;
  slug: string;
  title: string;
  category: 'Pastoral Letter' | 'Reflection' | 'Teaching' | 'Community';
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  scripture?: string;
  imageUrl: string;
  imageAlt: string;
  body: string[];
  pullQuote?: string;
  tags: string[];
}

/** The Site Settings options page in WordPress: the notice banner, service times and office details. */
export interface SiteSettings {
  /** Null when the banner is switched off. */
  noticeBanner: string | null;
  officeEmail: string;
  charityNumber: string;
  region: string;
  addressLine: string;
  accessNote: string;
  serviceTimes: { label: string; value: string }[];
}
