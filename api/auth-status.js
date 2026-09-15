import { AUTH_COOKIE, readCookies, sendJson, sessionIsValid } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const cookies = readCookies(req.headers.cookie);
  sendJson(res, 200, { authenticated: sessionIsValid(cookies[AUTH_COOKIE]) });
}
