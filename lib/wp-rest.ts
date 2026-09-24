/**
 * Submissions to the WordPress plugins (Vine House Forms, Vine House Events)
 * over their authenticated REST routes under /wp-json/vine/v1/.
 *
 * Only route handlers import this. The application password is a server-side
 * environment variable and never reaches the browser; the visitor's address
 * is forwarded in X-Vine-Client-IP so the plugins can rate-limit per person
 * rather than per Vercel edge.
 *
 * Without credentials (a checkout with no WordPress yet) every submission is
 * simulated: the handler answers as WordPress would, marks the payload
 * `simulated: true`, and stores nothing.
 */

import { NextResponse } from 'next/server';

const BASE = (process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '').trim().replace(/\/$/, '');
const USER = (process.env.WORDPRESS_APP_USER ?? '').trim();
const PASSWORD = (process.env.WORDPRESS_APP_PASSWORD ?? '').trim();
const TIMEOUT_MS = 10000;

export const wpConfigured = Boolean(BASE && USER && PASSWORD);

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? '';
  return first.trim();
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export const str = (body: Record<string, unknown>, key: string): string =>
  typeof body[key] === 'string' ? (body[key] as string).trim() : '';

export const looksLikeEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Six characters from an alphabet with no 0/O or 1/I confusion, matching the plugins. */
export function passCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `VH-${code}`;
}

export function simulated<T extends object>(payload: T, status = 201): NextResponse {
  console.warn('[wp-rest] WordPress credentials are not set; simulating the submission.');
  return NextResponse.json({ ...payload, simulated: true }, { status });
}

export function reject(message: string, field?: string, status = 400): NextResponse {
  return NextResponse.json({ message, field }, { status });
}

/**
 * POST to a plugin route and relay its answer. A WP_Error comes back as
 * `{ code, message, data: { status, field } }`; it is flattened to
 * `{ message, field }` with the same status so forms can mark the field.
 */
export async function forwardToWordPress(path: string, body: Record<string, unknown>, request: Request): Promise<NextResponse> {
  const authorization = `Basic ${Buffer.from(`${USER}:${PASSWORD}`).toString('base64')}`;
  let response: Response;
  try {
    response = await fetch(`${BASE}/wp-json/vine/v1/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authorization,
        'X-Vine-Client-IP': clientIp(request),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error(`[wp-rest] ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return reject('The church office could not be reached. Please try again in a moment.', undefined, 503);
  }

  const raw = await response.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
  }

  if (!response.ok && data && typeof data === 'object' && 'message' in data) {
    const error = data as { message: string; data?: { field?: string } };
    return reject(error.message, error.data?.field, response.status);
  }
  return NextResponse.json(data, { status: response.status });
}
