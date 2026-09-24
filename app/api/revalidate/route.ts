import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { TAGS } from '@/lib/wordpress';

/** Which pages each cache tag reaches, so an edit shows everywhere it appears. */
const PATHS_BY_TAG: Record<string, string[]> = {
  [TAGS.sermons]: ['/', '/sermons'],
  [TAGS.events]: ['/', '/events'],
  [TAGS.messages]: ['/messages'],
  [TAGS.gatherings]: ['/'],
  [TAGS.testimonials]: ['/'],
  [TAGS.settings]: ['/'],
};

/**
 * WordPress calls this on publish (Vine House Content pings it with the
 * tags that changed), so edits appear without waiting out the ISR window.
 * Guarded by REVALIDATE_SECRET in the X-Vine-Revalidate-Secret header.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret) return NextResponse.json({ message: 'REVALIDATE_SECRET is not set.' }, { status: 503 });

  const url = new URL(request.url);
  const supplied = request.headers.get('x-vine-revalidate-secret') ?? url.searchParams.get('secret') ?? '';
  if (supplied !== secret) return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });

  let body: { tags?: unknown; paths?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const known = new Set<string>(Object.values(TAGS));
  const tags = (Array.isArray(body.tags) ? body.tags : []).filter((t): t is string => typeof t === 'string' && known.has(t));
  const paths = new Set<string>(
    (Array.isArray(body.paths) ? body.paths : []).filter((p): p is string => typeof p === 'string' && p.startsWith('/'))
  );
  for (const tag of tags) {
    revalidateTag(tag, 'max');
    for (const path of PATHS_BY_TAG[tag] ?? []) paths.add(path);
  }
  if (tags.includes(TAGS.messages)) revalidatePath('/messages/[slug]', 'page');
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: true, tags, paths: [...paths], at: new Date().toISOString() });
}
