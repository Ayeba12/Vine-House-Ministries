import { forwardToWordPress, looksLikeEmail, passCode, readJson, reject, simulated, str, wpConfigured } from '@/lib/wp-rest';

/** The Sunday visitor pass. Vine House Forms: POST /visit-plan, returns the pass code WordPress generated. */
export async function POST(request: Request) {
  const body = await readJson(request);
  const name = str(body, 'name');
  const email = str(body, 'email').toLowerCase();
  const service = str(body, 'service');
  const partySize = Math.min(20, Math.max(1, Number(body.partySize) || 1));
  if (name.length < 2) return reject('Please enter your name.', 'name');
  if (!looksLikeEmail(email)) return reject('Please enter your email address.', 'email');
  if (service.length < 2) return reject('Please choose a service.', 'service');

  const payload = {
    name,
    email,
    phone: str(body, 'phone'),
    service,
    date: str(body, 'date'),
    partySize,
    children: Boolean(body.children),
    childrenAges: str(body, 'childrenAges'),
    welcomeHost: Boolean(body.welcomeHost),
    notes: str(body, 'notes'),
    website: str(body, 'website'),
  };
  if (!wpConfigured) return simulated({ id: 0, passCode: passCode() });
  return forwardToWordPress('visit-plan', payload, request);
}
