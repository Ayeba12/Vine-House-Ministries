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
  description: string;
  tags: string[];
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
