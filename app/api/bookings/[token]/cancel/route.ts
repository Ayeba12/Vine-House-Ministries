import { forwardToWordPress, reject, simulated, wpConfigured } from '@/lib/wp-rest';

/**
 * Cancelling a booking from its manage link. Vine House Events:
 * POST /bookings/{token}/cancel. The token in the address is the only proof
 * of ownership, exactly as in the email it came from. WordPress releases the
 * place, emails the confirmation and promotes the waitlist; it answers with
 * the booking as it now stands.
 */
export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{32}$/.test(token)) return reject('We could not find that booking.', undefined, 404);
  if (!wpConfigured) return simulated({ status: 'cancelled' }, 200);
  return forwardToWordPress(`bookings/${token}/cancel`, {}, request);
}
