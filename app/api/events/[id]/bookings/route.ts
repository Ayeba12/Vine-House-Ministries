import { forwardToWordPress, looksLikeEmail, passCode, readJson, reject, simulated, str, wpConfigured } from '@/lib/wp-rest';

/**
 * Booking a place. Vine House Events: POST /events/{id}/bookings. WordPress
 * holds the capacity line and answers with the booking's status (confirmed
 * or waitlisted), its pass code and a cancel token; 200 with `existing: true`
 * when the same email already holds a place.
 */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await readJson(request);
  const name = str(body, 'name');
  const email = str(body, 'email').toLowerCase();
  const guestsCount = Math.min(20, Math.max(1, Number(body.guestsCount) || 1));
  if (name.length < 2) return reject('Please enter your name.', 'name');
  if (!looksLikeEmail(email)) return reject('Please enter your email address.', 'email');

  const payload = {
    name,
    email,
    phone: str(body, 'phone'),
    guestsCount,
    isFirstTimeVisitor: Boolean(body.isFirstTimeVisitor),
    notes: str(body, 'notes'),
    website: str(body, 'website'),
  };

  if (!wpConfigured) {
    return simulated({ id: 0, status: 'confirmed', passCode: passCode(), guests: guestsCount, existing: false });
  }
  if (!/^\d+$/.test(id)) return reject('That event is no longer available.', undefined, 404);
  return forwardToWordPress(`events/${id}/bookings`, payload, request);
}
