import { forwardToWordPress, looksLikeEmail, readJson, reject, simulated, str, wpConfigured } from '@/lib/wp-rest';

const FREQUENCIES = ['Weekly Devotional', 'Event Announcements', 'All Updates'];

/** The footer newsletter form. Vine House Forms: POST /subscribe, idempotent on email. */
export async function POST(request: Request) {
  const body = await readJson(request);
  const email = str(body, 'email').toLowerCase();
  const frequency = FREQUENCIES.includes(str(body, 'frequency')) ? str(body, 'frequency') : 'All Updates';
  if (!looksLikeEmail(email)) return reject('Please enter your email address.', 'email');

  const payload = { email, frequency, website: str(body, 'website') };
  if (!wpConfigured) return simulated({ id: 0, alreadySubscribed: false });
  return forwardToWordPress('subscribe', payload, request);
}
