/**
 * The WordPress data layer.
 *
 * One fetch function per entity, each returning the interfaces in
 * `lib/types.ts`, so no component changes when the source swaps. Reads go
 * through WPGraphQL (WPGraphQL for ACF exposes the field groups the Vine
 * House Content plugin ships; Vine House Events registers its own fields).
 *
 * Source policy:
 * - No `WORDPRESS_GRAPHQL_ENDPOINT` set: the seed content in `lib/data.ts`,
 *   so the site runs without a WordPress at all.
 * - Endpoint set but unreachable or erroring: the empty value, logged. A
 *   page without a list beats a build that fails.
 *
 * Server only. Never import this from a client component.
 */

import type {
  ChurchEvent,
  GatheringPillar,
  Message,
  Sermon,
  SiteSettings,
  Testimonial,
} from '@/lib/types';
import { GATHERING_PILLARS, INITIAL_EVENTS, INITIAL_SERMONS, MESSAGES, TESTIMONIALS } from '@/lib/data';

const ENDPOINT = (process.env.WORDPRESS_GRAPHQL_ENDPOINT ?? '').trim();
const IS_DEV = process.env.NODE_ENV === 'development';
const TIMEOUT_MS = 8000;

/** ISR window in production. The revalidate route shortens it on publish. */
export const REVALIDATE_SECONDS = 300;

/** Cache tags, one per entity. The revalidate route and the WordPress webhook speak these names. */
export const TAGS = {
  sermons: 'sermons',
  events: 'events',
  messages: 'messages',
  gatherings: 'gatherings',
  testimonials: 'testimonials',
  settings: 'settings',
} as const;

export type ContentSource = 'wordpress' | 'seed';
export const contentSource: ContentSource = ENDPOINT ? 'wordpress' : 'seed';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  noticeBanner: 'Sunday Sanctuary Gathering: 10:00 AM & 12:00 PM • In-Person & Broadcast Live',
  officeEmail: 'enquiries@vinehouseministries.org.uk',
  charityNumber: '1148977',
  region: 'Greater London & Essex',
  addressLine: '',
  accessNote: 'Step-free access · free visitor parking',
  serviceTimes: [
    { label: 'Sunday liturgy', value: '10:00' },
    { label: 'Sunday communion', value: '12:00' },
    { label: 'Midweek scripture', value: 'Wed 19:00' },
    { label: 'Youth & young adults', value: 'Fri 19:30' },
  ],
};

// ---- transport -------------------------------------------------------------

class WordPressError extends Error {}

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>, tags: string[]): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...(IS_DEV ? { cache: 'no-store' as const } : { next: { revalidate: REVALIDATE_SECONDS, tags } }),
  });
  if (!res.ok) throw new WordPressError(`WordPress answered ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new WordPressError(json.errors.map((e) => e.message).join('; '));
  if (!json.data) throw new WordPressError('Empty GraphQL response');
  return json.data;
}

async function source<T>(name: string, seed: () => T, empty: T, read: () => Promise<T>): Promise<T> {
  if (!ENDPOINT) return seed();
  try {
    return await read();
  } catch (error) {
    console.error(`[wordpress] ${name}: ${error instanceof Error ? error.message : String(error)}`);
    return empty;
  }
}

// ---- helpers ---------------------------------------------------------------

type Connection<T> = { nodes?: (T | null)[] | null } | null | undefined;
type ImageNode = { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null | undefined;

const text = (value: unknown): string => (typeof value === 'string' ? value : '');
const names = (connection: Connection<{ name?: string | null }>): string[] =>
  (connection?.nodes ?? []).map((n) => n?.name ?? '').filter(Boolean);
const image = (node: ImageNode) => ({ url: node?.node?.sourceUrl ?? '', alt: node?.node?.altText ?? '' });

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/** Plain text from a WordPress HTML field, whitespace collapsed. */
export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Block content as an array of paragraphs, which is how the message page renders a body. */
export function htmlToParagraphs(html: string): string[] {
  return html
    .split(/<\/(?:p|h[1-6]|li|blockquote)>|<br\s*\/?>\s*<br\s*\/?>/i)
    .map(stripHtml)
    .filter(Boolean);
}

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** "2026-08-16" to "August 16, 2026", the form the seed data and the pages already use. */
export function formatDate(value: string, withWeekday = false): string {
  const date = parseDate(value);
  if (!date) return value;
  return date.toLocaleDateString('en-US', {
    ...(withWeekday ? { weekday: 'long' as const } : {}),
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

/** "19:30" to "7:30 PM". */
function formatTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  return new Date(2000, 0, 1, Number(match[1]), Number(match[2])).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const formatDuration = (seconds: number): string => `${Math.max(1, Math.round(seconds / 60))} mins`;

const readingTime = (body: string): string => `${Math.max(1, Math.round(body.split(/\s+/).length / 200))} min read`;

const today = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// ---- sermons ---------------------------------------------------------------

const SERMONS_QUERY = /* GraphQL */ `
  query Sermons {
    sermons(first: 100, where: { status: PUBLISH }) {
      nodes {
        databaseId
        title
        date
        excerpt
        content
        featuredImage { node { sourceUrl altText } }
        sermonSeriesList { nodes { name } }
        sermonTopics { nodes { name } }
        sermonFields {
          speaker
          speakerRole
          sermonDate
          durationSeconds
          scripture
          summary
          keyTakeaways { text }
          audioFile { node { mediaItemUrl } }
          audioUrl
          transcriptSnippet
        }
      }
    }
  }
`;

interface SermonNode {
  databaseId: number;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: ImageNode;
  sermonSeriesList?: Connection<{ name?: string | null }>;
  sermonTopics?: Connection<{ name?: string | null }>;
  sermonFields?: {
    speaker?: string | null;
    speakerRole?: string | null;
    sermonDate?: string | null;
    durationSeconds?: number | null;
    scripture?: string | null;
    summary?: string | null;
    keyTakeaways?: ({ text?: string | null } | null)[] | null;
    audioFile?: string | { node?: { mediaItemUrl?: string | null } | null } | null;
    audioUrl?: string | null;
    transcriptSnippet?: string | null;
  } | null;
}

function mapSermon(node: SermonNode): Sermon & { sortKey: string } {
  const f = node.sermonFields ?? {};
  const seconds = Number(f.durationSeconds ?? 0);
  const audioFile = typeof f.audioFile === 'string' ? f.audioFile : (f.audioFile?.node?.mediaItemUrl ?? '');
  const rawDate = text(f.sermonDate) || text(node.date);
  return {
    id: String(node.databaseId),
    title: node.title ?? '',
    series: names(node.sermonSeriesList)[0] ?? 'Teaching',
    speaker: text(f.speaker) || 'Pastor Mercy Yerifor',
    speakerRole: text(f.speakerRole),
    date: formatDate(rawDate),
    duration: formatDuration(seconds),
    audioDurationSeconds: seconds,
    scripture: text(f.scripture),
    summary: text(f.summary) || stripHtml(node.excerpt ?? ''),
    keyTakeaways: (f.keyTakeaways ?? []).map((row) => text(row?.text)).filter(Boolean),
    audioUrl: audioFile || text(f.audioUrl),
    imageUrl: image(node.featuredImage).url,
    transcriptSnippet: text(f.transcriptSnippet) || stripHtml(node.content ?? '').slice(0, 600),
    tags: names(node.sermonTopics),
    sortKey: rawDate,
  };
}

export function getSermons(): Promise<Sermon[]> {
  return source(
    'sermons',
    () => INITIAL_SERMONS,
    [],
    async () => {
      const data = await fetchGraphQL<{ sermons: Connection<SermonNode> }>(SERMONS_QUERY, {}, [TAGS.sermons]);
      return (data.sermons?.nodes ?? [])
        .filter((n): n is SermonNode => Boolean(n))
        .map(mapSermon)
        .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
        .map(({ sortKey: _sortKey, ...sermon }) => sermon);
    }
  );
}

// ---- events ----------------------------------------------------------------

const EVENTS_QUERY = /* GraphQL */ `
  query Events {
    churchEvents(first: 100, where: { status: PUBLISH }) {
      nodes {
        databaseId
        title
        excerpt
        content
        featuredImage { node { sourceUrl altText } }
        eventCategories { nodes { name } }
        eventDate
        startTime
        endTime
        location
        room
        host
        highlights
        capacity
        bookedCount
        remaining
        bookingStatus
        maxGuestsPerBooking
      }
    }
  }
`;

const EVENT_CATEGORIES = ['Worship', 'Fellowship', 'Outreach', 'Study', 'Youth'] as const;

interface EventNode {
  databaseId: number;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: ImageNode;
  eventCategories?: Connection<{ name?: string | null }>;
  eventDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  room?: string | null;
  host?: string | null;
  highlights?: (string | null)[] | null;
  capacity?: number | null;
  bookedCount?: number | null;
  remaining?: number | null;
  bookingStatus?: string | null;
  maxGuestsPerBooking?: number | null;
}

function mapEvent(node: EventNode): ChurchEvent {
  const categories = names(node.eventCategories);
  const start = text(node.startTime);
  const end = text(node.endTime);
  return {
    id: String(node.databaseId),
    title: node.title ?? '',
    category: EVENT_CATEGORIES.find((c) => categories.includes(c)) ?? 'Fellowship',
    date: formatDate(text(node.eventDate), true),
    time: start ? `${formatTime(start)}${end ? ` – ${formatTime(end)}` : ''}` : '',
    location: text(node.location),
    room: text(node.room),
    capacity: node.capacity ?? 0,
    rsvpdCount: node.bookedCount ?? 0,
    description: stripHtml(node.excerpt || node.content || ''),
    host: text(node.host),
    imageUrl: image(node.featuredImage).url,
    highlights: (node.highlights ?? []).filter((h): h is string => Boolean(h)),
    bookingStatus: text(node.bookingStatus) || undefined,
  };
}

/** Upcoming published events, soonest first. */
export function getEvents(): Promise<ChurchEvent[]> {
  return source(
    'events',
    () => INITIAL_EVENTS,
    [],
    async () => {
      const data = await fetchGraphQL<{ churchEvents: Connection<EventNode> }>(EVENTS_QUERY, {}, [TAGS.events]);
      const cutoff = today();
      return (data.churchEvents?.nodes ?? [])
        .filter((n): n is EventNode => Boolean(n) && text(n?.eventDate) >= cutoff)
        .sort((a, b) => text(a.eventDate).localeCompare(text(b.eventDate)) || text(a.startTime).localeCompare(text(b.startTime)))
        .map(mapEvent);
    }
  );
}

// ---- messages (the journal: standard posts) --------------------------------

const MESSAGE_FIELDS = /* GraphQL */ `
  fragment MessageFields on Post {
    databaseId
    slug
    title
    date
    excerpt
    content
    featuredImage { node { sourceUrl altText } }
    categories { nodes { name } }
    tags { nodes { name } }
    author { node { name } }
    messageFields { authorRole scripture readTime pullQuote }
  }
`;

const MESSAGES_QUERY = /* GraphQL */ `
  ${MESSAGE_FIELDS}
  query Messages {
    posts(first: 100, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes { ...MessageFields }
    }
  }
`;

const MESSAGE_QUERY = /* GraphQL */ `
  ${MESSAGE_FIELDS}
  query Message($slug: ID!) {
    post(id: $slug, idType: SLUG) { ...MessageFields }
  }
`;

const MESSAGE_CATEGORIES = ['Pastoral Letter', 'Reflection', 'Teaching', 'Community'] as const;

interface MessageNode {
  databaseId: number;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: ImageNode;
  categories?: Connection<{ name?: string | null }>;
  tags?: Connection<{ name?: string | null }>;
  author?: { node?: { name?: string | null } | null } | null;
  messageFields?: {
    authorRole?: string | null;
    scripture?: string | null;
    readTime?: string | null;
    pullQuote?: string | null;
  } | null;
}

function mapMessage(node: MessageNode): Message {
  const f = node.messageFields ?? {};
  const categories = names(node.categories);
  const body = htmlToParagraphs(node.content ?? '');
  const picture = image(node.featuredImage);
  return {
    id: String(node.databaseId),
    slug: node.slug ?? String(node.databaseId),
    title: node.title ?? '',
    category: MESSAGE_CATEGORIES.find((c) => categories.includes(c)) ?? 'Reflection',
    excerpt: stripHtml(node.excerpt ?? '') || body[0] || '',
    date: formatDate(text(node.date)),
    readTime: text(f.readTime) || readingTime(body.join(' ')),
    author: node.author?.node?.name ?? 'Vine House Ministries',
    authorRole: text(f.authorRole),
    scripture: text(f.scripture) || undefined,
    imageUrl: picture.url,
    imageAlt: picture.alt,
    body,
    pullQuote: text(f.pullQuote) || undefined,
    tags: names(node.tags),
  };
}

export function getMessages(): Promise<Message[]> {
  return source(
    'messages',
    () => MESSAGES,
    [],
    async () => {
      const data = await fetchGraphQL<{ posts: Connection<MessageNode> }>(MESSAGES_QUERY, {}, [TAGS.messages]);
      return (data.posts?.nodes ?? []).filter((n): n is MessageNode => Boolean(n)).map(mapMessage);
    }
  );
}

export function getMessage(slug: string): Promise<Message | null> {
  return source(
    `message ${slug}`,
    () => MESSAGES.find((m) => m.slug === slug) ?? null,
    null,
    async () => {
      const data = await fetchGraphQL<{ post: MessageNode | null }>(MESSAGE_QUERY, { slug }, [TAGS.messages]);
      return data.post ? mapMessage(data.post) : null;
    }
  );
}

// ---- gatherings ------------------------------------------------------------

const GATHERINGS_QUERY = /* GraphQL */ `
  query Gatherings {
    gatherings(first: 12, where: { status: PUBLISH, orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        databaseId
        title
        featuredImage { node { sourceUrl altText } }
        gatheringFields { pillarNumber subtitle timing location }
      }
    }
  }
`;

interface GatheringNode {
  databaseId: number;
  title?: string | null;
  featuredImage?: ImageNode;
  gatheringFields?: {
    pillarNumber?: string | null;
    subtitle?: string | null;
    timing?: string | null;
    location?: string | null;
  } | null;
}

function mapGathering(node: GatheringNode, index: number): GatheringPillar {
  const f = node.gatheringFields ?? {};
  return {
    number: text(f.pillarNumber) || String(index + 1).padStart(2, '0'),
    title: node.title ?? '',
    subtitle: text(f.subtitle),
    timing: text(f.timing),
    location: text(f.location),
    imageUrl: image(node.featuredImage).url || undefined,
  };
}

export function getGatherings(): Promise<GatheringPillar[]> {
  return source(
    'gatherings',
    () => GATHERING_PILLARS,
    [],
    async () => {
      const data = await fetchGraphQL<{ gatherings: Connection<GatheringNode> }>(GATHERINGS_QUERY, {}, [TAGS.gatherings]);
      return (data.gatherings?.nodes ?? []).filter((n): n is GatheringNode => Boolean(n)).map(mapGathering);
    }
  );
}

// ---- testimonials ----------------------------------------------------------

const TESTIMONIALS_QUERY = /* GraphQL */ `
  query Testimonials {
    testimonials(first: 20, where: { status: PUBLISH }) {
      nodes {
        databaseId
        title
        content
        featuredImage { node { sourceUrl altText } }
        testimonialFields { role tag }
      }
    }
  }
`;

interface TestimonialNode {
  databaseId: number;
  title?: string | null;
  content?: string | null;
  featuredImage?: ImageNode;
  testimonialFields?: { role?: string | null; tag?: string | null } | null;
}

function mapTestimonial(node: TestimonialNode): Testimonial {
  const f = node.testimonialFields ?? {};
  return {
    id: String(node.databaseId),
    quote: stripHtml(node.content ?? ''),
    author: node.title ?? '',
    role: text(f.role),
    tag: text(f.tag),
    avatarUrl: image(node.featuredImage).url || undefined,
  };
}

export function getTestimonials(): Promise<Testimonial[]> {
  return source(
    'testimonials',
    () => TESTIMONIALS as Testimonial[],
    [],
    async () => {
      const data = await fetchGraphQL<{ testimonials: Connection<TestimonialNode> }>(TESTIMONIALS_QUERY, {}, [TAGS.testimonials]);
      return (data.testimonials?.nodes ?? []).filter((n): n is TestimonialNode => Boolean(n)).map(mapTestimonial);
    }
  );
}

// ---- site settings (ACF options page) --------------------------------------

const SETTINGS_QUERY = /* GraphQL */ `
  query SiteSettings {
    siteSettings {
      siteSettingsFields {
        noticeBannerEnabled
        noticeBanner
        officeEmail
        charityNumber
        region
        addressLine
        accessNote
        serviceTimes { label value }
      }
    }
  }
`;

interface SettingsNode {
  siteSettingsFields?: {
    noticeBannerEnabled?: boolean | null;
    noticeBanner?: string | null;
    officeEmail?: string | null;
    charityNumber?: string | null;
    region?: string | null;
    addressLine?: string | null;
    accessNote?: string | null;
    serviceTimes?: ({ label?: string | null; value?: string | null } | null)[] | null;
  } | null;
}

export function getSiteSettings(): Promise<SiteSettings> {
  return source(
    'site settings',
    () => DEFAULT_SITE_SETTINGS,
    DEFAULT_SITE_SETTINGS,
    async () => {
      const data = await fetchGraphQL<{ siteSettings: SettingsNode | null }>(SETTINGS_QUERY, {}, [TAGS.settings]);
      const f = data.siteSettings?.siteSettingsFields ?? {};
      const serviceTimes = (f.serviceTimes ?? [])
        .map((row) => ({ label: text(row?.label), value: text(row?.value) }))
        .filter((row) => row.label && row.value);
      return {
        noticeBanner: f.noticeBannerEnabled && text(f.noticeBanner) ? text(f.noticeBanner) : null,
        officeEmail: text(f.officeEmail) || DEFAULT_SITE_SETTINGS.officeEmail,
        charityNumber: text(f.charityNumber) || DEFAULT_SITE_SETTINGS.charityNumber,
        region: text(f.region) || DEFAULT_SITE_SETTINGS.region,
        addressLine: text(f.addressLine),
        accessNote: text(f.accessNote) || DEFAULT_SITE_SETTINGS.accessNote,
        serviceTimes: serviceTimes.length ? serviceTimes : DEFAULT_SITE_SETTINGS.serviceTimes,
      };
    }
  );
}
