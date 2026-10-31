# veridyne.eu website

Static site for Veridyne Solutions, served by Vercel (project `veridyne-website`). Pushing to
`main` deploys to production at https://www.veridyne.eu. No framework and no build step.

## Layout

- `index.html`, `services.html`, `authbeam.html`, `authlens.html`, `authcanvas.html`, `sa-sparring.html`, `roiall.html`, `signin.html`:
  generated pages (see below). `privacy.html` is hand-written.
- `styles.css`, `main.js`, `js-flag.js`: one stylesheet and the scripts (the CSP is `script-src 'self'`,
  so no inline scripts).
- `main.js` holds the "Secure sign-in" gateway: the header/footer link opens a dialog that sends
  people to the client portal (my.veridyne.eu) or the team portal (team.veridyne.eu). Destinations
  are an allowlist (`PORTALS`). `/signin` is the no-JavaScript version.
- `api/contact.js`: the contact form endpoint (env in Vercel; local copy in `.env.local`, never committed).
- `assets/`: logos, photos, OG image and the email signature banner. These are public and CORS-open,
  so other apps and emails link to them:
  - `assets/veridyne-wordmark.png`: navy wordmark for light backgrounds
  - `assets/veridyne-wordmark-dark.png`: white wordmark for dark backgrounds (also the Auth0 login logo)
  - `assets/veridyne-logo-square.png`: square mark
  - `assets/email-signature-banner.png`: Gmail signature banner
- `vercel.json`: clean URLs, security headers and redirects from the old site's paths.

## Editing pages

The shared head, header, footer and sign-in dialog live in `tools/build_pages.py`, along with each
page's content. Edit there, then regenerate:

    python3 tools/build_pages.py .

Commit both the script and the generated HTML.

## Email signature

- `tools/email-signature/banner.html`: the banner design. Re-render the PNG with
  `node tools/email-signature/render.mjs` (needs Playwright, see the comment at the top of the file).
- `tools/email-signature/signature.html`: the signature as a static page for copy-paste.
- Team members generate their own signature at https://team.veridyne.eu/signature.

`tools/` and this README are listed in `.vercelignore`, so they are not published on the site.

## Related repos

- `veridyne-team`: team portal, team.veridyne.eu. It also holds the shared database schema and the
  Auth0 Universal Login template and Action.
- `veridyne-clients`: client portal, my.veridyne.eu.
