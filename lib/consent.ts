/**
 * Cookie consent, kept in one small first-party cookie so a later server
 * component or analytics loader can read it too. The site sets no other
 * cookies; this is the only one the banner has to explain.
 */

export const CONSENT_COOKIE = 'vh_consent';
export const CONSENT_MONTHS = 6;

export type Consent = 'all' | 'essential';

/** Components subscribe here so a choice made anywhere updates them without polling. */
const listeners = new Set<() => void>();

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.slice(CONSENT_COOKIE.length + 1);
  return value === 'all' || value === 'essential' ? value : null;
}

export function writeConsent(value: Consent): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setMonth(expires.getMonth() + CONSENT_MONTHS);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
  notify();
}

export function clearConsent(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${CONSENT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  notify();
}

/** True only when the visitor accepted everything. Anything optional (analytics, embeds) checks this first. */
export function hasOptionalConsent(): boolean {
  return readConsent() === 'all';
}
