# veridyne-website (veridyne.eu)

Big picture: see ~/veridyne-context (README.md, PORTFOLIO.md, ARCHITECTURE.md).

## What it is
Public marketing site of Veridyne Solutions S.R.L. (Auth0/Okta identity consulting + own products). Static HTML, no
framework, no build step on Vercel. Live at https://www.veridyne.eu. Design = Redesign v3 (dark, look of the films; see
below), on the Oct 2026 brand. Offer: two things only, consulting and in-house products (no programs/packages).

## Status
Live. Redesign v3 went live 2026-11-11. Pages: / , /services, /secure-ai, /verigate, /certifications, /authbeam, /authlens, /eot,
/authcanvas, /companion, /fga, /neural-network, /transformer, /privacy, /signin, /welcome. Product order (2026-11-18): Veridyne Secure AI first, Veridyne Neural Network second, Veridyne Transformer third (2026-11-21), VeriGate last (set by the
line under PRODUCTS in build_pages.py; the first two get the large tiles). Roiall is benched (2026-11-08: off list, footer, form, sitemap; /roiall
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
  #0B0C0E, Roiall teal #45E3CF / #141E3A, Veridyne FGA blue #138DFD on #02102D. Veridyne Secure AI purple #8A3FFC on #0B0F3B (lavender #DCC7FF). Veridyne Neural Network (own brand board): cobalt #0F4FDB, electric cyan #19C2FF, neural violet #7B4DFF on #070F24.
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

## Veridyne Neural Network (2026-11-18)
Page `/neural-network` (app in the client portal, my.veridyne.eu/neural-network; Veridyne switches it on per company via
`vnn_entitlements`, so the page says "Ask for access"). Badge "New", tagline from its brand board ("Connected intelligence,
clearly mapped."). Mark `assets/vnn-mark.png` is rendered from the portal's `public/brand/vnn/vnn-icon.svg`. Screenshots
(`vnn.png`, `vnn-map.png`, `vnn-agent.png`, `vnn-findings.png`) are the portal's real components rendered with its demo
tenant (`lib/vnn/demo.ts` on PGlite), labelled demo data. Scene/loop from Higgsfield (neural web over a glass plane).
Privacy notice: `#neural-network` paragraph + legal basis sentence. Pricing (hours) is not on the site.

## Veridyne Transformer (2026-11-21)
Page `/transformer`, badge "Pilot" (app at transformer.veridyne.eu, its own repo alecsandru-dev/veridyne-transformer).
Mark `assets/transformer-mark.png` (three chevrons) is cut from "Veridyne Transformer Brand Style Board.png" (~/Downloads, 21 Nov 2026), never redrawn; palette from that board (deep navy #0B1733, cobalt #0F4FDB, electric blue #19C2FF, coral #FF6B57 for buttons).
Screenshots (`transformer*.png`) are the real web app in local mode with the engine's sample Okta tenant, project named
"Northwind: Okta to Auth0 (sample)". Scene/loop from Higgsfield (cubes streaming into a new crystal tower); the tile
shows the right side of the scene (object-position 82%). Privacy: `#transformer` paragraph + legal basis sentence.
Live reads/apply are not proven yet (pilot); the copy promises neither.

## /welcome (2026-11-18)
About page for the link in client emails: the Veridyne film (`assets/vie/veridyne-welcome.mp4`, 3:12 since 2026-11-21 with Neural Network and Transformer, ~1.9 Mbps, under
50 MB for GitHub; poster `welcome-poster.jpg`) starts with sound where the browser allows it; otherwise it plays muted and
the first tap/click/key anywhere (or the "Turn sound on" button) turns sound on (main.js). Waits for Play under reduced
motion. Below, an editorial run (no card grids; Alecs rejected the 3-column look): opening statement + short intro,
three full-bleed chapters on film stills (`about-*.jpg`: Auth0, Okta, IAM; never state years of experience), "How we do
identity right" as a numbered list with a sticky heading, one sentence on the two ways to work with us (links to
/services and /#products; no product tiles, the home page lists the apps), closing stage on the dawn gate. `noindex`, not in the sitemap or nav; the home hero links to it with the "About us" pill (`.about-link`, 2026-11-21, in place of "Watch the launch video"). Film sources and build scripts are outside this repo (/home/claude/vp).

## Founder video (2026-11-22)
Home hero has "A word from our founder" (`.founder-link`, above the hero actions): round looping preview
(`assets/vie/founder-teaser.mp4`, 400x400, muted, starts after load unless reduced motion or data saver) and the 55 s
AI dot-hologram video of Alecs (`founder-video.mp4`, 720p, poster `founder-poster.jpg`, captions burned in plus
`founder-video.en.vtt` track off by default) in `dialog#founder`. End screen: "Watch our story" -> /welcome, "Book a
30-minute call" -> #contact, Replay. Closing after 50% or finishing adds the "Up next" tag to the About us pill
(`.about-link.up-next`); `localStorage.veridyneFounderWatched = "1"` at 90%/end turns the button into "Watch again".
The line "Alecs's avatar and voice in this video are AI-generated." stays under the video (EU AI Act transparency).
Video made in Higgsfield (Seedance lip-sync, ElevenLabs voice "Knox", ElevenLabs music); sources outside this repo.

## Redesign v3 (live on main since 2026-11-11; built on branch `redesign-v3`)
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
  hover loops (loop-<slug>.mp4, fetched only on hover on desktops) and the launch video (veridyne-vie-launch-v2.mp4, 3:03 since 2026-11-21: Secure AI, Neural Network, Transformer and
  Client Portal added, Team Portal out, built from the welcome film's morphs on the launch's own soundtrack with two
  phrase repeats; fetched only on Play, in `dialog#film`; its quiet opening is lifted ~12 dB for the web copy). No video loads by itself.
- A new product needs `assets/vie/scene-<slug>.jpg` and `loop-<slug>.mp4`.
- Veridyne Secure AI (2026-11-18): page `/secure-ai` (the app itself is in the client portal, my.veridyne.eu/secure-ai; badge "New",
  open to every client since 2026-11-18 per Alecs). Its screenshots are the portal's own design components rendered with the "travel" test fixture and
  sample names; the "Features that cover it" part is left out on purpose (plan lines there are still "needs validation").
  Privacy notice has its paragraph (`#secure-ai`), legal basis sentence and the AI provider in the processor list.
- One look on every page (2026-11-11): `/services` opens with a hero stage (`.hero-sub`, `services-hero.webp`); every
  product page sits on the same ground (#050C18) with framed galleries; every `cta-band` is a closing stage on
  `contact.jpg` with a `.thread` before it (`.thread-short` between smaller blocks).
- Sign-in: the dialog is a glass panel with a keyhole emblem (`.gate-keyhole`, no image behind it: that looked
  cluttered); `/signin` shows the panel on the left and the finished gateway (`hero-end-1600.webp`) on the right,
  centred below 900px. The page behind the emailed confirm link (`api/contact-confirm.js`) uses `.confirm-page` /
  `.confirm-card` from styles.css (no inline styles, CSP).

## Branches
main (live). Old: redesign, redesign-2026, redesign-v3, companion-app, privacy-cloudflare (all fully merged into main;
origin has redesign, redesign-2026, redesign-v3). Nothing in flight. Working tree clean at time of writing.
