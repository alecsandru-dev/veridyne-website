#!/usr/bin/env python3
"""Writes the Veridyne site pages with one shared header and footer.
Run: python3 build_pages.py <site dir>"""
import sys, pathlib

SITE = pathlib.Path(sys.argv[1])

def head(title, desc, path):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://www.veridyne.eu{path}">
<meta name="theme-color" content="#FFFFFF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Veridyne Solutions">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://www.veridyne.eu{path}">
<meta property="og:image" content="https://www.veridyne.eu/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script src="/js-flag.js"></script>
<script src="/main.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
'''

def header(current):
    def cur(key):
        return ' aria-current="page"' if key == current else ''
    return f'''
<header class="site-header" id="top">
  <div class="site-header-inner">
    <a class="wordmark" href="/" aria-label="Veridyne Solutions home">
      <img class="logo-light" src="/assets/veridyne-wordmark.png" alt="" width="190" height="38">
      <img class="logo-dark" src="/assets/veridyne-wordmark-dark.png" alt="" width="171" height="38">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-bars" aria-hidden="true"></span><span class="nav-toggle-label">Menu</span></button>
    <nav class="nav-links" id="site-nav" aria-label="Main">
      <a href="/services"{cur("services")}>Services</a>
      <a href="/services#approach">How we work</a>
      <a href="/#products"{cur("products")}>Products</a>
      <a class="nav-employee" href="/signin" data-gate><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Secure sign-in</a>
      <a class="nav-cta" href="/#contact">Contact</a>
      <button class="theme-toggle" type="button" aria-label="Switch to dark theme"><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><span class="theme-toggle-label">Dark theme</span></button>
    </nav>
  </div>
</header>
'''

def gate_panel(title_id, closable):
    """The sign-in chooser. Used in the dialog on every page and on /signin without JavaScript."""
    close = ('<button class="gate-close" type="button" aria-label="Close">'
             '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>') if closable else ''
    def option(href, host, icon, name, text):
        return f'''
      <a class="gate-option" href="{href}" data-host="{host}">
        <span class="gate-icon" aria-hidden="true">{icon}</span>
        <span class="gate-text"><strong>{name}</strong><span>{text}</span></span>
        <span class="gate-arrow" aria-hidden="true"></span>
        <span class="gate-url"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>{host}</span>
        <span class="gate-more" aria-hidden="true"><span class="gate-more-inner">
          <span class="gate-steps"><span>Destination checked: {host}</span><span>Encrypted connection (HTTPS)</span><span>Handing off to Veridyne SSO</span></span>
          <span class="gate-progress"><span></span></span>
        </span></span>
      </a>'''
    building = '<svg viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h4M8 11h4M8 15h4"/></svg>'
    team = '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.7c2 .6 3.5 2.3 3.5 5.3"/></svg>'
    return f'''<div class="gate-panel" data-state="ready">
    <div class="gate-emblem" aria-hidden="true">
      <svg class="gate-ring" viewBox="0 0 120 120"><circle class="gate-track" cx="60" cy="60" r="54"/><circle class="gate-sweep" cx="60" cy="60" r="54" pathLength="100"/></svg>
      <svg class="gate-lock" viewBox="0 0 24 24"><path class="gate-shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/><rect x="4.5" y="11" width="15" height="10" rx="2.5"/><path d="M12 15v2.2"/></svg>
    </div>
    <p class="gate-status" role="status">Secure channel ready</p>
    <h2 id="{title_id}">Secure sign-in</h2>
    <p class="gate-sub">Choose your portal. Both sign in through Veridyne single sign-on.</p>
    <div class="gate-options">{option("https://my.veridyne.eu/auth/login", "my.veridyne.eu", building, "Client portal", "Your projects, hours delivered and company details.")}{option("https://team.veridyne.eu/auth/login", "team.veridyne.eu", team, "Team", "For Veridyne employees.")}
    </div>
    <p class="gate-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6z"/></svg>We never ask for your password on this website. You enter it only on auth.veridyne.eu or your Google sign-in.</p>
    {close}
  </div>'''

GATE_DIALOG = f'''
<dialog class="gate" id="gate" aria-labelledby="gate-title">
  {gate_panel("gate-title", True)}
</dialog>'''

FOOTER = '''
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-cols">
      <div class="footer-brand">
        <img class="logo-light" src="/assets/veridyne-wordmark.png" alt="Veridyne Solutions" width="190" height="38" loading="lazy">
        <img class="logo-dark" src="/assets/veridyne-wordmark-dark.png" alt="Veridyne Solutions" width="171" height="38" loading="lazy">
        <p><a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a><br><a href="tel:+40755577744">+40 755 577 744</a><br>Bucharest, Romania</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <div>
          <h2>Professional Services</h2>
          <a href="/services">Auth0 and Okta consulting</a>
          <a href="/services#security">Secure by default</a>
          <a href="/services#approach">How we work</a>
        </div>
        <div>
          <h2>Products</h2>
          <a href="/authlens">AuthLens</a>
          <a href="/authcanvas">AuthCanvas</a>
          <a href="/roiall">Roiall</a>
          <a href="/sa-sparring">SA Sparring</a>
        </div>
        <div>
          <h2>Company</h2>
          <a href="/#contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/signin" data-gate>Secure sign-in</a>
        </div>
      </nav>
    </div>
    <div class="footer-legal">
      <p><strong>VERIDYNE SOLUTIONS S.R.L.</strong> · CUI 51635423 · Reg. Com. J2025027184005 · EUID ROONRC.J2025027184005<br>Registered office: Str. Guliver nr. 13, bl. C1, sc. 1, et. 5, ap. 49, Sector 6, Bucharest, Romania</p>
      <p>Copyright © 2026 Veridyne Solutions S.R.L. All rights reserved.</p>
    </div>
  </div>
</footer>
GATE_DIALOG
</body>
</html>
'''.replace('GATE_DIALOG', GATE_DIALOG)

ICONS = {
    'setup': '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="14" width="22" height="14" rx="3"/><path d="M10 14V10a6 6 0 0 1 12 0v4"/></svg>',
    'migrate': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 11h18l-5-5M27 21H9l5 5"/></svg>',
    'review': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l10 4v7c0 7-4.5 11-10 13C10.5 26 6 22 6 15V8z"/><path d="M11.5 16l3 3 6-6"/></svg>',
    'train': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 10l-6 6 6 6M21 10l6 6-6 6"/></svg>',
}

SERVICES = [
    ('setup', 'New setups',
     'A new Auth0 or Okta tenant, planned and configured.',
     'A new Auth0 or Okta tenant planned and configured from an empty start: applications, connections, roles and branding.'),
    ('migrate', 'Migrations',
     'Off ADFS, SiteMinder, Ping, Keycloak, Cognito or your own login.',
     'Off ADFS, SiteMinder, Ping, Keycloak, Cognito or a login you built yourselves. Users keep their passwords wherever the old system allows it.'),
    ('review', 'Security reviews',
     'Findings ranked by risk, with a fix for each one.',
     'A review of the setup you already run, with findings ranked by risk and a fix for each one.'),
    ('train', 'Developer training',
     'Hands-on sessions for the team who will own it.',
     'Hands-on sessions for the developers who will own the setup after we leave.'),
]

def service_grid(full):
    items = ''.join(
        f'''
      <li class="service rise">
        {ICONS[icon]}
        <h3>{name}</h3>
        <p>{long if full else short}</p>
      </li>''' for icon, name, short, long in SERVICES)
    return f'<ul class="service-grid{"" if full else " service-grid-compact"}">{items}\n    </ul>'

# ---------- products ----------
PRODUCTS = {
    'authlens': dict(
        kind='Posture reports for Auth0, Okta and Entra ID',
        name='AuthLens', cls='product-authlens', title_id='authlens-title',
        logo='<img class="product-logo" src="/assets/authlens-lockup.png" alt="AuthLens" width="729" height="214">',
        badge='<p class="badge">Early access</p>', card_badge='Early access',
        tagline='Find what is misconfigured, and fix it.',
        lead='AuthLens reads an Auth0, Okta or Microsoft Entra ID tenant through one read-only app and reports what is misconfigured, with the vendor page behind each finding and the exact fix.',
        card='Posture reports for Auth0, Okta and Entra ID: what is misconfigured, why, and the exact fix.',
        btn='<a class="btn btn-authlens" href="https://getauthlens.com">Visit getauthlens.com</a>',
        shot='<img src="/assets/authlens.png" alt="AuthLens: connect a tenant with read scopes, read its configuration, and get a report with a score and findings" width="1600" height="940"',
        features=[('Read-only by design', 'One app with read scopes only. Nothing in your tenant changes.'),
                  ('Every rule cites the vendor', 'Each finding links the documentation it is based on, with a fix.'),
                  ('Drift, weekly', 'A weekly run shows what was fixed, what regressed and what is new.')],
        meta='AuthLens, by Veridyne: read-only posture reports for Auth0, Okta and Microsoft Entra ID, with the vendor source and the exact fix for every finding.'),
    'authcanvas': dict(
        kind='Identity journey design',
        name='AuthCanvas', cls='product-ac', title_id='ac-title',
        logo='<img class="product-logo" src="/assets/authcanvas-logo.png" alt="AuthCanvas" width="1737" height="315">',
        badge='<p class="badge">Private alpha</p>', card_badge='Private alpha',
        tagline='Design the login before you build it.',
        lead='Teams moving off a legacy login draw the journeys they want on Auth0, Okta or Entra ID. Every block is checked as they go.',
        card='Draw identity journeys on Auth0, Okta or Entra ID, checked as you go.',
        btn='<a class="btn btn-ac" href="/?topic=AuthCanvas%20early%20access#contact">Request early access</a>',
        shot='<img src="/assets/authcanvas.png" alt="AuthCanvas: a login flow drawn as connected blocks, with ACE\'s recommendation for the MFA step in the side panel" width="1536" height="760"',
        features=[('Draw the journey', 'Customers, apps and sign-in steps as blocks you connect.'),
                  ('Checked as you go', 'Every block and connection is validated while you design.'),
                  ('ACE, our identity expert', 'An AI adviser recommends how to build each step.')],
        meta='AuthCanvas, by Veridyne: design identity journeys on Auth0, Okta or Entra ID before you build them. In private alpha.'),
    'roiall': dict(
        kind='Results of creator marketing',
        name='Roiall', cls='product-roiall', title_id='roiall-title',
        logo='<img class="product-logo" src="/assets/roiall-lockup-on-light.png" alt="Roiall" width="1137" height="317">',
        badge='',
        tagline='See what creator deals really bring in.',
        lead='Roiall shows businesses the real customers their creator and influencer deals bring, confirmed at the counter.',
        card='The real customers your creator and influencer deals bring in.',
        btn='<a class="btn btn-roiall" href="https://roiall.ro">Visit roiall.ro</a>',
        shot='<img src="/assets/roiall-dashboard.png" alt="Roiall dashboard: customers brought by creators this month, cost per customer and a weekly chart" width="1600" height="810"',
        features=[('Real customers', 'Each visit is confirmed at the counter, not guessed from clicks.'),
                  ('Cost per customer', 'What every customer from a creator actually cost you.'),
                  ('Week by week', 'See which campaigns and creators keep working.')],
        meta='Roiall, by Veridyne: see the real customers your creator and influencer deals bring in, confirmed at the counter.'),
    'sa-sparring': dict(
        kind='Practice for Auth0 architects',
        name='SA Sparring', cls='product-sas', title_id='sas-title',
        logo='<span class="sas-mark sas-title">SA <em>Sparring</em></span>',
        badge='',
        tagline='Practice the call. Get graded.',
        lead='A practice ground for Auth0 solutions architects. A simulated customer pushes back on every call.',
        card='A practice ground for Auth0 solutions architects, graded like a senior SA would.',
        btn='<a class="btn btn-sas" href="https://www.auth0shell.dev">Visit auth0shell.dev</a>',
        shot='<img src="/assets/sa-sparring.png" alt="SA Sparring sign-in screen: Practice the call. Get graded." width="1720" height="940"',
        features=[('Real conversations', 'Customer scenarios built on how Auth0 calls actually go.'),
                  ('Graded answers', 'Each answer is graded the way a senior SA would grade it.'),
                  ('By invitation', 'Sign in with Google or GitHub once you are invited.')],
        meta='SA Sparring, by Veridyne: a practice ground for Auth0 solutions architects, with a simulated customer and graded answers.'),
}

def product_showcase(exclude=None, group='product'):
    """The products as one stage: a list to pick from, the chosen product large on its own ground.
    Picking works in CSS (:has on the radios); main.js only moves it on by itself. On phones the products stack."""
    items = [(slug, p) for slug, p in PRODUCTS.items() if slug != exclude]
    tabs, panels = [], []
    for i, (slug, p) in enumerate(items):
        logo = p['logo'].replace('class="product-logo"', 'class="pcard-logo"').replace('class="sas-mark sas-title"', 'class="sas-mark pcard-logo"')
        badge = f'<span class="badge">{p["card_badge"]}</span>' if p.get('card_badge') else ''
        tabs.append(f'''
        <label class="pshow-tab">
          <input type="radio" name="{group}" value="{slug}"{' checked' if i == 0 else ''}>
          <span class="pshow-tab-name">{p['name']}</span>
          <span class="pshow-tab-line">{p['kind']}</span>
          <span class="pshow-time" aria-hidden="true"><span></span></span>
        </label>''')
        panels.append(f'''
        <a class="pshow-panel pcard-{slug}" href="/{slug}" data-for="{slug}">
          <span class="pshow-copy">
            <span class="pcard-top">{logo}{badge}</span>
            <span class="pcard-tagline">{p['tagline']}</span>
            <span class="pcard-text">{p['card']}</span>
            <span class="pcard-more">Learn more<span class="sr-only"> about {p['name']}</span></span>
          </span>
          <span class="pshow-shot">{p['shot']} loading="lazy"></span>
        </a>''')
    return f'''
    <div class="pshow rise">
      <div class="pshow-tabs" role="radiogroup" aria-label="Products">{''.join(tabs)}
      </div>
      <div class="pshow-stage">{''.join(panels)}
      </div>
    </div>'''

def product_page(slug):
    p = PRODUCTS[slug]
    feats = ''.join(f'<li><h3>{h}</h3><p>{t}</p></li>' for h, t in p['features'])
    body = f'''
<main id="main">
  <section class="product product-page {p['cls']}" aria-labelledby="{p['title_id']}">
    <div class="product-head rise">
      <a class="crumb" href="/#products">Products</a>
      {p['badge']}
      <h1 id="{p['title_id']}">{p['logo']}</h1>
      <p class="product-tagline">{p['tagline']}</p>
      <p class="product-lead">{p['lead']}</p>
      <div class="product-actions">
        {p['btn']}
      </div>
    </div>
    <figure class="product-shot rise">
      {p['shot']}>
    </figure>
    <ul class="features rise">{feats}</ul>
  </section>

  <section class="cta-band" aria-labelledby="cta-title">
    <div class="cta-inner rise">
      <h2 id="cta-title">Questions about {p['name']}?</h2>
      <p class="lead">Tell us what you need and we reply within one working day.</p>
      <a class="btn" href="/?topic={ {'authcanvas': 'AuthCanvas%20early%20access', 'authlens': 'AuthLens%20access'}.get(slug, p['name'].replace(' ', '%20')) }#contact">Contact us</a>
    </div>
  </section>

  <section class="more-products" aria-labelledby="more-title">
    <h2 id="more-title" class="rise">More from Veridyne</h2>
    {product_showcase(exclude=slug, group='more-product')}
  </section>
</main>
'''
    return head(f'{p["name"]} — Veridyne Solutions', p['meta'], f'/{slug}') + header('products') + body + FOOTER

# ---------- home ----------
HOME = '''
<main id="main">

  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="pill rise"><span class="pill-dot"></span>Identity and access, Auth0 and Okta</p>
      <h1 id="hero-title" class="rise">Secure sign-in, built right from the first login.</h1>
      <p class="lead rise">Veridyne is a technology company in Bucharest. Our consultants design and secure how your customers and staff sign in, and our product team builds software of its own.</p>
      <div class="hero-actions rise">
        <a class="btn" href="#contact" data-topic="Identity &amp; access consulting">Book a free call</a>
        <a class="link-more" href="/services">Our services</a>
      </div>
    </div>

    <!-- A sign-in moving through its checks: decorative, the text above says it all -->
    <div class="flow rise" aria-hidden="true">
      <div class="flow-card flow-login">
        <img src="/assets/veridyne-icon-dark.png" alt="" width="52" height="34">
        <p class="flow-h">Sign in</p>
        <p class="flow-field">elena@company.com</p>
        <p class="flow-btn"><svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="4"/><path d="M2 21c0-3.3 2.7-6 6-6M14 13l2-2 2 2v6l-2 2-2-2z"/></svg>Continue with passkey</p>
      </div>
      <div class="flow-wire"><span></span></div>
      <div class="flow-card flow-checks">
        <p class="flow-h">Checks</p>
        <ul>
          <li><i></i>Passkey verified</li>
          <li><i></i>Known device</li>
          <li><i></i>Risk score low</li>
          <li><i></i>Role: finance-viewer</li>
        </ul>
      </div>
      <div class="flow-wire"><span></span></div>
      <div class="flow-card flow-token">
        <svg class="flow-shield" viewBox="0 0 32 32"><path d="M16 3l11 4.5V15c0 7.5-4.8 12-11 14C9.8 27 5 22.5 5 15V7.5z"/><path d="M11 16l3.5 3.5L21.5 12"/></svg>
        <p class="flow-h">Access granted</p>
        <code>sub: auth0|8f2c41…<br>amr: ["mfa"]<br>exp: 15 min</code>
      </div>
    </div>

    <div class="split">
      <a class="split-tile split-services rise" href="/services">
        <span class="split-kind">Professional Services</span>
        <span class="split-title">Auth0 and Okta consulting</span>
        <span class="split-text">Setups, migrations, security reviews and training, by the people who do the work.</span>
        <span class="split-more">Explore services</span>
        <img src="/assets/photos/veridyne-hq.jpg" alt="The Veridyne Solutions logo on the front of our headquarters building" width="396" height="364">
      </a>
      <a class="split-tile split-products rise" href="#products">
        <span class="split-kind">Products</span>
        <span class="split-title">Software we build</span>
        <span class="split-text">AuthLens, AuthCanvas, Roiall and SA Sparring. Built, hosted and supported by us.</span>
        <span class="split-more">See the products</span>
        <span class="split-shots" aria-hidden="true">
          <img src="/assets/authlens.png" alt="" width="1600" height="940">
          <img src="/assets/authcanvas.png" alt="" width="1536" height="760">
          <img src="/assets/roiall-dashboard.png" alt="" width="1600" height="810">
        </span>
      </a>
    </div>
  </section>

  <section class="services services-home" id="services" aria-labelledby="services-title">
    <div class="intro rise">
      <p class="division">Professional Services</p>
      <h2 id="services-title">Auth0 and Okta,<br> set up properly.</h2>
      <p class="lead">We plan, build and review how customers and staff sign in, secure by default and documented for your team.</p>
    </div>
    SERVICE_GRID
    <div class="services-foot rise">
      <ul class="chips" aria-label="Secure by default">
        <li>Passkeys and MFA</li><li>Least privilege</li><li>Short-lived tokens</li><li>Auditable logs</li>
      </ul>
      <a class="link-more" href="/services">How we work</a>
    </div>
  </section>

  <section class="products-home" id="products" aria-labelledby="products-title">
    <div class="intro rise">
      <p class="division">Products</p>
      <h2 id="products-title">Software we build,<br> host and support.</h2>
      <p class="lead">Separate from our consulting work: four products, each made for its own users.</p>
    </div>
    PRODUCT_SHOWCASE
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="contact-head rise">
      <h2 id="contact-title">Let’s talk.</h2>
      <p class="lead">A consulting project or one of our products: tell us where you are. We reply within one working day.</p>
      <p class="contact-direct"><a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a><a href="tel:+40755577744">+40 755 577 744</a></p>
    </div>

    <form class="form rise" id="contact-form" action="/api/contact" method="post" novalidate>
      <div class="form-row">
        <div class="field">
          <label for="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" autocomplete="name" maxlength="100" required>
        </div>
        <div class="field">
          <label for="cf-email">Work email</label>
          <input id="cf-email" name="email" type="email" autocomplete="email" maxlength="200" required>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="cf-company">Company <span class="opt">(optional)</span></label>
          <input id="cf-company" name="company" type="text" autocomplete="organization" maxlength="150">
        </div>
        <div class="field">
          <label for="cf-topic">About</label>
          <select id="cf-topic" name="topic">
            <option>Identity &amp; access consulting</option>
            <option>AuthLens access</option>
            <option>AuthCanvas early access</option>
            <option>Roiall</option>
            <option>SA Sparring</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows="5" maxlength="4000" required></textarea>
      </div>
      <div class="hp" aria-hidden="true">
        <label for="cf-website">Leave this empty</label>
        <input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="form-foot">
        <p class="form-note">We only use your details to reply to you. See our <a href="/privacy">privacy notice</a>.</p>
        <button class="btn" type="submit">Send message</button>
      </div>
      <p class="form-status" id="cf-status" role="status" aria-live="polite"></p>
    </form>
  </section>
</main>
'''.replace('SERVICE_GRID', service_grid(False)).replace('PRODUCT_SHOWCASE', product_showcase())

# ---------- services ----------
SERVICES_PAGE = '''
<main id="main">
  <section class="page-hero" aria-labelledby="page-title">
    <div class="intro rise">
      <p class="division">Professional Services</p>
      <h1 id="page-title">Auth0 and Okta,<br> set up properly.</h1>
      <p class="lead">We plan, build and review how customers and staff sign in. Every engagement ends with documentation your team can own.</p>
      <div class="hero-actions">
        <a class="btn" href="/?topic=Identity%20%26%20access%20consulting#contact">Book a free call</a>
        <a class="link-more" href="#approach">How we work</a>
      </div>
    </div>
  </section>

  <section class="services services-page" aria-label="What we do">
    SERVICE_GRID

    <div class="security rise" id="security">
      <h2>Secure by default</h2>
      <ul>
        <li><strong>Passkeys and MFA</strong><span>Phishing-resistant sign-in wherever your users can take it.</span></li>
        <li><strong>Least privilege</strong><span>Roles and scopes that give each app and person only what they need.</span></li>
        <li><strong>Short-lived tokens</strong><span>Sessions and refresh rules set for your risk, not left at defaults.</span></li>
        <li><strong>Logs you can audit</strong><span>Sign-in events streamed to where your team already looks.</span></li>
      </ul>
    </div>

    <div class="engagement" id="approach">
      <div class="engagement-text rise">
        <h2>How an engagement works</h2>
        <ol class="steps">
          <li><strong>A free 30-minute call</strong><span>With the person who would do the work.</span></li>
          <li><strong>A written proposal</strong><span>Scope, timeline and price, agreed before anything starts.</span></li>
          <li><strong>The work, on your tenant</strong><span>You see every change as it happens.</span></li>
          <li><strong>Handover</strong><span>Full documentation, and we stay reachable after.</span></li>
        </ol>
        <a class="btn" href="/?topic=Identity%20%26%20access%20consulting#contact">Book a call</a>
      </div>
      <figure class="engagement-photo rise">
        <img src="/assets/photos/veridyne-card.jpg" alt="A Veridyne Solutions business card with the logo printed in blue and silver" width="346" height="364" loading="lazy">
      </figure>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="cta-title">
    <div class="cta-inner rise">
      <h2 id="cta-title">Moving to Auth0 or Okta?</h2>
      <p class="lead">Tell us where you are today. The first call is free and with the person who would do the work.</p>
      <a class="btn" href="/?topic=Identity%20%26%20access%20consulting#contact">Contact us</a>
    </div>
  </section>
</main>
'''.replace('SERVICE_GRID', service_grid(True))

pages = {
    'index.html': head('Veridyne Solutions — Auth0 and Okta consulting, and our own software',
                       'Veridyne Solutions is a Bucharest technology company. Our professional services team sets up, migrates and reviews Auth0 and Okta. Our products team builds AuthCanvas, Roiall and SA Sparring.', '/')
                  + header('home') + HOME + FOOTER,
    'services.html': head('Professional Services — Veridyne Solutions',
                          'Auth0 and Okta consulting from Bucharest: new setups, migrations, security reviews and developer training, secure by default.', '/services')
                     + header('services') + SERVICES_PAGE + FOOTER,
}
for slug in PRODUCTS:
    pages[f'{slug}.html'] = product_page(slug)

# /signin works without JavaScript and is a link people can bookmark.
pages['signin.html'] = (head('Secure sign-in — Veridyne Solutions',
                             'Sign in to the Veridyne client portal or the team portal.', '/signin')
                        + header('signin')
                        + f'''
<main id="main" class="gate-page">
  {gate_panel("signin-title", False)}
</main>
''' + FOOTER)

for name, html in pages.items():
    (SITE / name).write_text(html)
    print('wrote', name, len(html))
