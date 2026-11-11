# veridyne-website (veridyne.eu)

Big picture: see ~/veridyne-context (README.md, PORTFOLIO.md, ARCHITECTURE.md).

## What it is
Public marketing site of Veridyne Solutions S.R.L. (Auth0/Okta identity consulting + own products). Static HTML, no
framework, no build step on Vercel. Live at https://www.veridyne.eu. Design = "Version B" (Apple-style centered tiles,
compact), rebuilt on the Oct 2026 brand. Offer: two things only, consulting and in-house products (no programs/packages).

## Status
Live. Last commit a22cb5e (2026-11-08). Pages: / , /services, /verigate, /certifications, /authbeam, /authlens, /eot, /authcanvas,
/companion, /fga, /privacy, /signin. Roiall is benched (2026-11-08: off list, footer, form, sitemap; /roiall
redirects to /#products, temporary). Rentolio is not shown.

## Stack
Static HTML + one `styles.css` + `main.js` + `js-flag.js`; `api/*.js` Vercel Node functions (Node 24.x, ESM);
`tools/build_pages.py` (Python 3) generates the pages. Archivo font self-hosted in `fonts/`.

## Repo layout
- `tools/build_pages.py` source of shared head/header/footer/gate dialog + PRODUCTS dict + SERVICES + HOME/SERVICES_PAGE.
  Generated: index, services, verigate, certifications, authbeam, authlens, eot, fga, authcanvas, companion, signin.
  `privacy.html`, `styles.css`, `main.js`, `sitemap.xml`, `robots.txt` are hand-edited.
- `api/contact.js`, `api/contact-confirm.js`, `api/_contact-token.js` contact form (see below).
- `assets/` logos, product screenshots, `photos/` (HQ + business card), OG image, email-signature banner. Public,
  CORS-open: other apps and emails hot-link them (wordmark, wordmark-dark = also Auth0 login logo, logo-square).
- `tools/email-signature/` banner.html + render.mjs (Playwright) + signature.html. Team members use team.veridyne.eu/signature.
- `tools/` and README.md are in `.vercelignore` (not published).

## Run / edit / deploy
- Edit pages: change `tools/build_pages.py`, then `python3 tools/build_pages.py .` and commit script AND generated HTML.
  Never hand-edit generated HTML (it is overwritten).
- Preview: any static server in the folder (e.g. `python3 -m http.server`); `/api/*` needs `vercel dev`.
- Deploy: `git push origin main` (Vercel project `veridyne-website`, prj_DN2ihhPSeo1SfkSeeuuL6JypqlE4, git-linked;
  GitHub public repo alecsandru-dev/veridyne-website). Commit as "Alecsandru Mihalcea"
  <182538622+alecsandru-dev@users.noreply.github.com> or Vercel blocks the deploy (happened 2026-10-28).
- After a deploy, hard-reload (Cmd+Shift+R) before testing; old tabs keep the previous deployment.
- Deploy order when the offer bar changes: deploy certifications app first, then push the website.

## Env vars (names only; set in Vercel, local copy in .env.local never committed)
RESEND_API_KEY (required; also the key the confirm-link tokens are sealed with, rotating it kills waiting links),
CONTACT_FROM (sender on a Resend-verified domain), CONTACT_TO (default solutions@veridyne.eu).

## Contact form (api/contact.js)
Honeypot field `website`; lookalike-domain senders (veridyne/authlens/authcanvas/authbeam but not own domains) get a fake
success; 5 requests/hour/IP; sender gets an emailed confirmation link, only pressing the button behind it sends the
enquiry to the inbox (api/contact-confirm.js). Added after "add your site to Google's search index" scams (2026-11-02).
TOPICS list in contact.js must match the products list (keep in sync when adding/removing a product).

## Sign-in gateway
Header pill + footer "Secure sign-in" open a dialog with Client portal (my.veridyne.eu) and Team (team.veridyne.eu).
Destinations are an allowlist (`PORTALS` in main.js). `/signin` works without JS. `/employees` redirects (302) to
team.veridyne.eu/auth/login?connection=Employees. Old program paths (/keystone etc.) 301 to /services. Old /logos/* URLs
redirect to the new assets.

## Offer bar (LAUNCH50)
Bar above header on every generated page + callout on /certifications, hidden by default. `main.js` fetches
https://certifications.veridyne.eu/api/offer (CDN s-maxage 60) and shows the first active code in the line-up with its
own text (managed in the Certifications admin). Hidden when none/stopped/used up/expired. X is remembered per code in
localStorage. The offer JS must stay ABOVE the contact-form block in main.js (that block returns early on pages
without the form). CSP connect-src allows the certifications origin.

## Headers / CSP (vercel.json)
CSP `script-src 'self'; style-src 'self'` so NO inline scripts or styles; img-src 'self' data:; frame-ancestors none;
HSTS; cleanUrls, no trailing slash. /fonts and /assets cached 1 day, CORS *.

## Rebrand (Oct 2026) facts
- Palette (styles.css :root): Midnight Navy #0B1F3B (--navy; text/ink), navy-2 #16304F, Vivid Cyan #00B4FF (--cyan),
  cyan-ink #0070B8 (cyan dark enough for text on white), Steel Gray #A7B4C4, mist #F2F5F8, white. Muted #4A5A70,
  line #E2E8EF. Dark theme (follows system + header switch): page #07111F, card #0C1A2E, ink #E9EFF7, line #1E3352,
  button fill becomes cyan.
- Product accents (sections coloured per product): AuthCanvas blue #2459E6 on #070F1E, AuthBeam amber #FF9F0A on
  #0B0C0E, Roiall teal #45E3CF / #141E3A, Veridyne FGA blue #138DFD on #02102D.
- Type: Archivo only (self-hosted woff2 latin + latin-ext). Sora/Inter rejected as looking "generative AI". Mono for
  code only. Moderate sizes: hero clamp(38px,4.6vw,60px), h2 clamp(30px,3.4vw,46px), h3 20px, body 16px.
- Layout tokens: --wide 1180px, --radius 22px, --ease cubic-bezier(0.22,1,0.36,1). Fluid animated motion; respect reduced motion.
- Logo: new V mark + wordmark, cut from the brand board (ChatGPT brand board 3 in ~/Downloads). NEVER redraw it; use the
  files. Site copies in `assets/`: veridyne-wordmark.png (navy, light bg), veridyne-wordmark-dark.png (white, dark bg),
  veridyne-logo-square.png, veridyne-icon-dark.png, favicon-32, apple-touch-icon, icon-512, og-image.
- Brand assets folder: `/Users/alecs/Veridyne rebrand/brand/` : veridyne-icon(.png/-dark), veridyne-wordmark(.png/-dark),
  veribot-slack-icon(.png/.svg), embroidery-108x70mm/ (V flat 3-colors, flat for dark shirts, gradient; pdf/png/svg),
  zoom-waiting-room (1600x800 png, 400 logo, html source, two mp4 videos + source), roiall-dashboard / roiall-lockup /
  rentolio-login screenshots. App tokens (team/clients/admin) live in each app's `app/globals.css`; --strong = button
  fill (navy light, cyan dark), localStorage key `veridyne-theme`.
- Brand-kit photos (HQ building, business card) are cropped from board 3 into assets/photos/.
- Admin console uses a navy-gold look only to tell it from the regular account; emails stay normal Veridyne.

## Content rules
- Public address = street, number, city, country only (Str. Guliver nr. 13, București, Romania). Full registered office
  (Sector 6, bl. C1, sc. 1, et. 5, ap. 49) only in contracts. CUI 51635423.
- Contact: solutions@veridyne.eu and +40 755 577 744 as a plain phone number. No WhatsApp, no LinkedIn.
- Services (Auth0/Okta consulting) visibly separate from Products. Each product has its own section/page.
- Certifications copy must say they are Veridyne's own, independent of Okta/Auth0, never a comparison or replacement.
- Apple/tech style, moderate type; do not let a design skill's "dealt direction" override this.

## Gotchas
- CSP blocks inline JS/CSS: put code in main.js / styles.css.
- The legacy site (May 2026: React-in-browser, 6 languages, mailto form) is replaced; see ../LEGACY_VERIDYNE.md.
- Products list is compact (description only on the chosen one) to keep panel height with eight products.
- When searching site-wide text (e.g. address changes) search all of ~: authbeam, authcanvas, Veyra, Roiall live outside
  "Veridyne rebrand".

## Redesign v3 (branch `redesign-v3`, Nov 2026; not on main until Alecs says "go live")
- Dark by default (js-flag.js: dark unless the visitor chose light; no longer follows the system). Look of the films.
- Home = hero, Professional Services, Products (V.I.E), contact, joined by `.thread`. The sign-in sketch and the two
  summary tiles were removed on purpose. Services are four scene tiles (`.service.stile`), products a grid of scene
  tiles (`product_grid()`, `.ptile`; first two larger with the screenshot; compact grid under each product page).
- Hero = nanites building a keyhole gateway (Higgsfield, Nov 2026). Stills first (`hero-end-*.webp` everywhere,
  `hero-start-*.webp` where the film will play); main.js fetches `hero-build.mp4` (silent; the gateway rises out of a puddle of nanites on the floor) after page load on
  desktops with motion allowed, plays it once, then loops `hero-idle.mp4` (1.1 MB). Phones, reduced motion and data
  saver keep the finished-gateway still. All hero media are 5:3 (16:9 plus a smeared 6.7% top pad for headroom), so
  stills and films line up. Below 1281px the gateway sits in a band above the words. `film-poster.jpg` is the launch
  video's poster. (A city still, a 3D V and a canvas drawing were tried and dropped.)
- `assets/vie/`: stills cut from the films' own artwork (scene-<slug>.jpg, svc-*.jpg, contact.jpg),
  hover loops (loop-<slug>.mp4, fetched only on hover on desktops) and the launch video (veridyne-vie-launch.mp4,
  fetched only on Play, in `dialog#film`; its quiet opening is lifted ~12 dB for the web copy). No video loads by itself.
- A new product needs `assets/vie/scene-<slug>.jpg` and `loop-<slug>.mp4`.

## Branches
main (live). Old: redesign, redesign-2026, companion-app, privacy-cloudflare (all fully merged into main; origin has
redesign, redesign-2026). Nothing in flight. Working tree clean at time of writing.
