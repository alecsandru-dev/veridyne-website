// The waiting enquiry travels inside the emailed link, signed so nobody can write one, so nothing is stored for
// addresses that never confirm. The key comes from the mail key, because without that nothing can be sent anyway.
import { createHmac, timingSafeEqual } from 'node:crypto';

const LIFETIME = 48 * 3600000;

function sign(body) {
  const key = createHmac('sha256', process.env.RESEND_API_KEY || '').update('veridyne-contact-confirm').digest();
  return createHmac('sha256', key).update(body).digest();
}

export function seal(enquiry, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ ...enquiry, expires: now + LIFETIME })).toString('base64url');
  return `${body}.${sign(body).toString('base64url')}`;
}

export function open(token, now = Date.now()) {
  const [body, mac, extra] = String(token || '').split('.');
  if (!body || !mac || extra !== undefined) return null;
  const given = Buffer.from(mac, 'base64url');
  const wanted = sign(body);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
  try {
    const { expires, ...enquiry } = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return typeof expires === 'number' && expires > now ? enquiry : null;
  } catch {
    return null;
  }
}
