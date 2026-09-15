import {
  AUTH_COOKIE,
  SESSION_DURATION_SECONDS,
  createSessionToken,
  passcodeMatches,
  sendJson,
} from './_auth.js';

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const clientId = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const previous = attempts.get(clientId);
  if (previous && previous.resetAt > Date.now() && previous.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((previous.resetAt - Date.now()) / 1000);
    sendJson(res, 429, { error: 'Too many attempts. Please wait before trying again.' }, { 'Retry-After': String(retryAfter) });
    return;
  }

  if (!passcodeMatches(req.body?.passcode)) {
    const current = previous && previous.resetAt > Date.now()
      ? previous
      : { count: 0, resetAt: Date.now() + ATTEMPT_WINDOW_MS };
    current.count += 1;
    attempts.set(clientId, current);
    sendJson(res, 401, { error: 'Invalid access code.' });
    return;
  }

  attempts.delete(clientId);
  const token = createSessionToken();
  const cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`;
  sendJson(res, 200, { authenticated: true }, { 'Set-Cookie': cookie });
}
