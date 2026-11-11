// The link in the confirmation email. GET shows a button, because mail scanners open links but don't press buttons.
// POST is the only thing that sends an enquiry to the Veridyne inbox.
import { open } from './_contact-token.js';

const PITCH_RE = /\b(seo|search index|search engine|search result|backlinks?|lead generation|marketing|outsourc\w*|web design)\b|https?:\/\/|\bwww\.|\b[a-z0-9-]+\.(live|xyz|top|click|online|site|shop)\b/i;

const page = (title, text, action) => `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#050C18">
<title>${title} | Veridyne</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main class="confirm-page">
  <div class="confirm-card">
    <img src="/assets/veridyne-wordmark-dark.png" alt="Veridyne Solutions" width="171" height="38">
    <h1>${title}</h1>
    <p>${text}</p>
    ${action}
  </div>
</main>
</body>
</html>`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const token = String(req.query.t || '');
    const html = open(token)
      ? page('Confirm your message', 'Press the button and your message reaches our team.',
        `<form action="/api/contact-confirm" method="post"><input type="hidden" name="token" value="${token}"><button class="btn" type="submit">Send my message</button></form>`)
      : page('This link has expired', 'Send your message again and we will email you a new link.', '<p><a class="btn" href="/#contact">Contact us</a></p>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const enquiry = open(req.body && req.body.token);
  if (!enquiry) return res.redirect(303, '/?confirmed=0#contact');

  const { name, email, company, topic, message } = enquiry;
  const mark = PITCH_RE.test(`${name} ${company} ${message}`) ? '[Likely spam] ' : '';
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `About: ${topic}`,
    '',
    message,
    '',
    '— Sent from the contact form on veridyne.eu, email confirmed',
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Veridyne Website <website@veridyne.eu>',
        to: [process.env.CONTACT_TO || 'solutions@veridyne.eu'],
        reply_to: email,
        subject: `${mark}Website enquiry: ${topic} — ${name}`,
        text,
      }),
    });
    if (!response.ok) {
      console.error('contact confirm: Resend rejected the email', response.status, await response.text());
      return res.redirect(303, '/?sent=0#contact');
    }
  } catch (error) {
    console.error('contact confirm: Resend request failed', error);
    return res.redirect(303, '/?sent=0#contact');
  }
  return res.redirect(303, '/?confirmed=1#contact');
}
