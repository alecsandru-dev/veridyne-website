// Contact form endpoint. Sends the enquiry to the Veridyne inbox through Resend.
// Env: RESEND_API_KEY (required), CONTACT_FROM (a sender on a domain verified in Resend),
// CONTACT_TO (defaults to solutions@veridyne.eu).

const LIMITS = { name: 100, email: 200, company: 150, topic: 60, message: 4000 };
const TOPICS = ['Identity & access consulting', 'AuthLens access', 'AuthCanvas early access', 'Roiall', 'SA Sparring', 'Something else'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Scam senders register lookalike domains such as search-getauthlens.com and pitch search listings or SEO.
const OUR_DOMAINS = new Set(['veridyne.eu', 'getauthlens.com']);
const LOOKALIKE_RE = /veridyne|authlens|authcanvas|authbeam/;
const PITCH_RE = /\b(seo|search index|search engine|search result|backlinks?|lead generation|marketing|outsourc\w*|web design)\b|https?:\/\/|\bwww\.|\b[a-z0-9-]+\.(live|xyz|top|click|online|site|shop)\b/i;

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

  // A likely pitch still arrives, marked, so a real enquiry is never lost.
  const mark = PITCH_RE.test(`${name} ${company} ${message}`) ? '[Likely spam] ' : '';

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return reply(503, { error: 'not_configured' });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `About: ${topic}`,
    '',
    message,
    '',
    '— Sent from the contact form on veridyne.eu',
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Veridyne Website <website@veridyne.eu>',
        to: [process.env.CONTACT_TO || 'solutions@veridyne.eu'],
        reply_to: email,
        subject: `${mark}Website enquiry: ${topic} — ${name}`,
        text,
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
