// Contact form endpoint. Emails the sender a confirmation link through Resend. Only pressing the button behind that
// link sends the enquiry to the Veridyne inbox (api/contact-confirm.js).
// Env: RESEND_API_KEY (required), CONTACT_FROM (a sender on a domain verified in Resend),
// CONTACT_TO (defaults to solutions@veridyne.eu).

import { seal } from './_contact-token.js';

const LIMITS = { name: 100, email: 200, company: 150, topic: 60, message: 4000 };
const TOPICS = ['Identity & access consulting', 'VeriGate', 'Veridyne Certifications', 'AuthBeam', 'AuthLens access', 'Veridyne FGA', 'Eye of the Tenant', 'AuthCanvas early access', 'Veridyne Companion', 'Something else'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Scam senders register lookalike domains such as search-getauthlens.com and pitch search listings or SEO.
const OUR_DOMAINS = new Set(['veridyne.eu', 'getauthlens.com']);
const LOOKALIKE_RE = /veridyne|authlens|authcanvas|authbeam/;
const recent = new Map();

function field(body, key) {
  return String(body[key] ?? '').trim().slice(0, LIMITS[key]);
}

function oneLine(value) {
  return value.replace(/[\r\n]+/g, ' ');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const wantsJson = (req.headers.accept || '').includes('application/json');
  const reply = (status, payload) =>
    wantsJson
      ? res.status(status).json(payload)
      : res.redirect(303, `/?sent=${status === 200 ? '1' : '0'}#contact`);

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: real visitors never fill this in. Pretend success so bots learn nothing.
  if (body.website) return reply(200, { ok: true });

  const name = oneLine(field(body, 'name'));
  const email = oneLine(field(body, 'email')).toLowerCase();
  const company = oneLine(field(body, 'company'));
  const topic = TOPICS.includes(body.topic) ? body.topic : 'Something else';
  const message = field(body, 'message');

  if (!name || !message || !EMAIL_RE.test(email)) {
    return reply(400, { error: 'invalid_input' });
  }

  // Nobody real writes from a lookalike domain. Pretend success, as the honeypot does.
  const domain = email.split('@')[1];
  if (LOOKALIKE_RE.test(domain) && !OUR_DOMAINS.has(domain)) return reply(200, { ok: true });

  // A few requests per address per hour is plenty; this keeps the confirmation from being used as a relay.
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600000);
  if (hits.length >= 5) return reply(429, { error: 'too_many' });
  recent.set(ip, [...hits, now]);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return reply(503, { error: 'not_configured' });
  }

  const link = `https://www.veridyne.eu/api/contact-confirm?t=${seal({ name, email, company, topic, message })}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Veridyne Website <website@veridyne.eu>',
        to: [email],
        subject: 'Confirm your message to Veridyne',
        // Echoes nothing they typed, so this can't carry a message to a stranger.
        text: `Please confirm your message to Veridyne:\n\n${link}\n\nThe link works for 48 hours. If this was not you, ignore this email and nothing more will be sent.`,
      }),
    });
    if (!response.ok) {
      console.error('contact: Resend rejected the email', response.status, await response.text());
      return reply(502, { error: 'send_failed' });
    }
  } catch (error) {
    console.error('contact: Resend request failed', error);
    return reply(502, { error: 'send_failed' });
  }

  return reply(200, { ok: true });
}
