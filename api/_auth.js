import crypto from 'crypto';

export const AUTH_COOKIE = 'its_reviewer_session';
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

const DEFAULT_PASSCODE_HASH = '6ccf5eb0b98684778c3b1a5415fdeecd6819dd2ef1cfb22eee2c775cc41dc9cf';
const DEFAULT_SESSION_SECRET = 'f139b998ed5f9bb89951b7f466b185951c1d81e21e9969fbe1198a12bc475bb1';

const hash = (value) => crypto.createHash('sha256').update(value).digest();
const signingSecret = () => process.env.ITS_REVIEWER_SESSION_SECRET || DEFAULT_SESSION_SECRET;

export const passcodeMatches = (passcode) => {
  if (typeof passcode !== 'string' || passcode.length > 64) return false;
  const configuredPasscode = process.env.ITS_REVIEWER_PASSCODE;
  const expectedHash = configuredPasscode ? hash(configuredPasscode) : Buffer.from(DEFAULT_PASSCODE_HASH, 'hex');
  return crypto.timingSafeEqual(hash(passcode), expectedHash);
};

const sign = (payload) => crypto
  .createHmac('sha256', signingSecret())
  .update(payload)
  .digest('base64url');

export const createSessionToken = () => {
  const payload = Buffer.from(JSON.stringify({
    expiresAt: Date.now() + (SESSION_DURATION_SECONDS * 1000),
    nonce: crypto.randomBytes(16).toString('base64url'),
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};

export const readCookies = (header = '') => Object.fromEntries(
  header
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf('=');
      const rawValue = separator === -1 ? '' : part.slice(separator + 1);
      let value = rawValue;
      try {
        value = decodeURIComponent(rawValue);
      } catch {
        // Ignore malformed percent-encoding and let validation reject the value.
      }
      return separator === -1
        ? [part, '']
        : [part.slice(0, separator), value];
    }),
);

export const sessionIsValid = (token) => {
  if (typeof token !== 'string') return false;
  const separator = token.lastIndexOf('.');
  if (separator === -1) return false;

  const payload = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  const expectedSignature = sign(payload);
  if (suppliedSignature.length !== expectedSignature.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(suppliedSignature), Buffer.from(expectedSignature))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(data.expiresAt) && data.expiresAt > Date.now();
  } catch {
    return false;
  }
};

export const sendJson = (res, status, data, extraHeaders = {}) => {
  Object.entries({
    'Cache-Control': 'no-store, private',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  }).forEach(([name, value]) => res.setHeader(name, value));
  res.status(status).json(data);
};
