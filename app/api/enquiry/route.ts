import { forwardToWordPress, looksLikeEmail, readJson, reject, simulated, str, wpConfigured } from '@/lib/wp-rest';

const CATEGORIES = ['general', 'prayer', 'sacraments', 'charity', 'gathering'];

/** The contact form. Vine House Forms: POST /enquiry, emails the office per category. */
export async function POST(request: Request) {
  const body = await readJson(request);
  const name = str(body, 'name');
  const email = str(body, 'email').toLowerCase();
  const message = str(body, 'message');
  if (name.length < 2) return reject('Please enter your name.', 'name');
  if (!looksLikeEmail(email)) return reject('Please enter your email address.', 'email');
  if (!message) return reject('Please write a message.', 'message');

  const payload = {
    category: CATEGORIES.includes(str(body, 'category')) ? str(body, 'category') : 'general',
    name,
    email,
    phone: str(body, 'phone'),
    message,
    source: str(body, 'source') || 'contact',
    website: str(body, 'website'),
  };
  if (!wpConfigured) return simulated({ id: 0 });
  return forwardToWordPress('enquiry', payload, request);
}
