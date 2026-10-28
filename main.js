// Veridyne site: migration lookup, product index, section entrances, contact form.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Migration lookup ----------
     Short findings from the AuthCanvas migration research (docs/research, checked 2026-10-17).
     Each source has a display word, then per target: path, passwords, mfa, watch. */
  var IDS = {
    auth0: 'You can keep each user’s old ID on import. Auth0 adds a prefix (auth0|…), so apps that compare the raw sub claim need a small change.',
    okta: 'Okta creates its own user IDs. We keep the old ID on the profile and send it as a claim, so your apps can match each user on their first sign-in.'
  };
  var MFA_BASE = 'Phone numbers and email factors carry over. Passkeys and push apps are tied to the old domain and always need re-enrolling.';
  var T = { auth0: 'Auth0', okta: 'Okta' };

  var SOURCES = {
    adfs: {
      word: 'ADFS',
      auth0: {
        path: 'Connect first, move later',
        passwords: 'AD password hashes don’t export in a form Auth0 can use. Staff usually keep signing in against AD through Auth0’s AD/LDAP connector, so nobody resets a password.',
        watch: 'Auth0 accepts ADFS as a WS-Fed connection directly, so your apps can move before your users do.'
      },
      okta: {
        path: 'Connect first, move later',
        passwords: 'AD stays the source of passwords through the Okta AD agent (delegated authentication), so nobody resets a password.',
        watch: 'Okta doesn’t take WS-Fed from ADFS as an identity provider. The trust is set up as SAML or OIDC instead.'
      }
    },
    siteminder: {
      word: 'SiteMinder',
      auth0: {
        path: 'Import from the directory behind it',
        passwords: 'SiteMinder keeps no passwords of its own. If they sit in an LDAP directory ({SSHA} and similar), Auth0 imports the hashes as they are. If they sit in AD, AD stays the source through the connector.',
        watch: 'Apps that read user headers from the SiteMinder agent need a gateway in front of them: Okta Access Gateway with Auth0, or a reverse proxy.'
      },
      okta: {
        path: 'Import, after testing one user',
        passwords: 'SiteMinder keeps no passwords of its own. Salted SHA hashes from an LDAP directory can be split into the parts Okta accepts; we prove it on one user first. AD-backed users stay on AD through the Okta agent.',
        watch: 'Apps that read user headers from the SiteMinder agent need Okta Access Gateway in front of them.'
      }
    },
    pingfed: {
      word: 'PingFederate',
      both: {
        path: 'Federate first, then move credentials',
        passwords: 'PingFederate checks passwords against a directory behind it, so what moves depends on that directory. With PingDirectory, its salted SHA-256 hashes import into {T}.',
        watch: '{T} goes in front with PingFederate as the identity provider; apps move one at a time, then the credentials follow and the trust is cut.',
        mfa: 'PingID has no documented export, so its users re-enrol. Phone numbers and email factors carry over.'
      }
    },
    pingone: {
      word: 'PingOne',
      auth0: {
        path: 'Move users as they sign in',
        passwords: 'PingOne doesn’t export password hashes. Each user moves on their first sign-in: Auth0 checks the password against PingOne once, then keeps it.',
        watch: 'PingOne has to stay up for the whole window. We set the end date and a plan for users who never sign in.',
        mfa: 'PingID has no documented export, so its users re-enrol. Phone numbers and email factors carry over.'
      },
      okta: {
        path: 'Move users as they sign in',
        passwords: 'PingOne doesn’t export password hashes. Users are created in Okta first, and Okta’s password import hook checks each one against PingOne on their first sign-in.',
        watch: 'The hook has a three-second limit, so the check against PingOne has to be quick. PingOne stays up for the whole window.',
        mfa: 'PingID has no documented export, so its users re-enrol. Phone numbers and email factors carry over.'
      }
    },
    keycloak: {
      word: 'Keycloak',
      auth0: {
        path: 'Bulk import, passwords included',
        passwords: 'Keycloak exports its users with their password hashes, and Auth0 accepts both its Argon2 and PBKDF2 formats. Nobody resets a password.',
        watch: 'Users federated from LDAP inside Keycloak keep their hashes in that directory, so they follow the directory’s path.',
        mfa: 'Keycloak’s export includes one-time-password secrets, so authenticator apps can come along. Passkeys always need re-enrolling.'
      },
      okta: {
        path: 'Bulk import, plus sign-in moves for Argon2',
        passwords: 'Okta accepts Keycloak’s older PBKDF2 hashes but not Argon2, the default since Keycloak 25. Those users move on their first sign-in through Okta’s password hook.',
        watch: 'Users federated from LDAP inside Keycloak keep their hashes in that directory, so they follow the directory’s path.',
        mfa: 'Keycloak’s export includes one-time-password secrets, which Okta takes as a custom TOTP factor. Passkeys always need re-enrolling.'
      }
    },
    cognito: {
      word: 'Cognito',
      auth0: {
        path: 'Move users as they sign in',
        passwords: 'Cognito never exports password hashes. Auth0 checks each password against Cognito on the user’s first sign-in, which needs USER_PASSWORD_AUTH on the app client.',
        watch: 'A user who forgets their password before moving needs the reset to reach Cognito too. We plan that path before launch.',
        mfa: 'Cognito doesn’t export authenticator secrets, so those users re-enrol. Phone numbers carry over.'
      },
      okta: {
        path: 'Move users as they sign in',
        passwords: 'Cognito never exports password hashes. Users are created in Okta first, and the password import hook checks each one against Cognito on their first sign-in.',
        watch: 'The hook has a three-second limit and one retry, so the check against Cognito has to be quick and reliable.',
        mfa: 'Cognito doesn’t export authenticator secrets, so those users re-enrol. Phone numbers carry over.'
      }
    },
    gigya: {
      word: 'Gigya',
      both: {
        path: 'Bulk import, passwords included',
        passwords: 'SAP Customer Data Cloud exports each user’s hash with its settings, usually PBKDF2, which {T} imports. Nobody resets a password.',
        watch: 'Social sign-ins need re-linking when the social app registrations change.',
        mfa: 'Its two-factor data has no documented export, so authenticator users re-enrol. Phone numbers carry over.'
      }
    },
    janrain: {
      word: 'Janrain',
      both: {
        path: 'Bulk import, before the deadline',
        passwords: 'Akamai Identity Cloud exports bcrypt hashes, which {T} accepts. Nobody resets a password.',
        watch: 'Akamai ends Identity Cloud on 31 December 2027, so the migration window is fixed. Start with the import, then catch the changes.'
      }
    },
    homegrown: {
      word: 'Yours',
      auth0: {
        path: 'Bulk import, passwords included',
        passwords: 'Auth0 imports bcrypt, PBKDF2, Argon2, scrypt, SHA and MD5 hashes. Custom or nested schemes move on each user’s first sign-in instead.',
        watch: 'Disabled and locked accounts must stay disabled. We map every account state before anything is imported.',
        mfa: 'If you hold authenticator secrets, Auth0 imports them directly. Passkeys always need re-enrolling.'
      },
      okta: {
        path: 'Bulk import, passwords included',
        passwords: 'Okta imports bcrypt, PBKDF2, SHA and MD5 hashes. Argon2, scrypt or custom schemes move on each user’s first sign-in through the password hook.',
        watch: 'Disabled and locked accounts must stay disabled. We map every account state before anything is imported.',
        mfa: 'If you hold authenticator secrets, Okta takes them as a custom TOTP factor. Passkeys always need re-enrolling.'
      }
    }
  };

  var pick = document.getElementById('mig-pick');
  if (pick) {
    var el = function (id) { return document.getElementById(id); };
    var specFrom = el('spec-from'), specTo = el('spec-to');

    // Fit both giant words to their columns at one shared size, so long names stay whole.
    var size = function (node) {
      node.style.fontSize = '';
      var max = parseFloat(getComputedStyle(node).fontSize);
      var box = getComputedStyle(node.parentElement);
      var room = node.parentElement.clientWidth - parseFloat(box.paddingLeft) - parseFloat(box.paddingRight);
      return Math.min(max, Math.floor(max * room / node.scrollWidth));
    };
    var fitBoth = function () {
      var n = Math.min(size(specFrom), size(specTo));
      specFrom.style.fontSize = specTo.style.fontSize = n + 'px';
      // The section edge cuts both words at about two thirds of their height.
      var box = specFrom.closest('.specimens');
      if (window.matchMedia('(min-width: 761px)').matches) box.style.height = Math.round(n * 0.62) + 'px';
      else box.style.height = '';
    };
    var fit = function () { fitBoth(); };

    var setWord = function (node, word) {
      if (node.textContent === word) return;
      if (reduce) { node.textContent = word; fit(node); return; }
      node.classList.add('swap');
      setTimeout(function () {
        node.textContent = word; fit(node);
        node.classList.remove('swap');
      }, 200);
    };

    var render = function () {
      var from = pick.elements.from.value, to = pick.elements.to.value;
      var src = SOURCES[from];
      var d = src.both || src[to];
      var t = function (s) { return s.replace(/\{T\}/g, T[to]); };
      setWord(specFrom, src.word);
      setWord(specTo, T[to]);
      el('f-path').textContent = t(d.path);
      el('f-passwords').textContent = t(d.passwords);
      el('f-mfa').textContent = d.mfa ? t(d.mfa) : MFA_BASE;
      el('f-ids').textContent = IDS[to];
      el('f-watch').textContent = t(d.watch);
    };
    pick.addEventListener('change', render);
    window.addEventListener('resize', fitBoth);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBoth);
    render();
  }

  /* ---------- Products: the index follows the scroll ---------- */
  var products = document.querySelector('.products');
  if (products) {
    var rows = products.querySelectorAll('.product-index li');
    var notes = products.querySelectorAll('.product-note');
    var pics = products.querySelectorAll('.pp');
    var current = 0;
    var show = function (n) {
      if (n === current) return;
      current = n;
      [rows, notes].forEach(function (list) { list.forEach(function (x, i) { x.classList.toggle('is-current', i === n); }); });
      pics.forEach(function (x, i) { x.classList.toggle('is-current', i === n); x.classList.toggle('is-past', i < n); });
    };
    var wide = window.matchMedia('(min-width: 761px)');
    var onScroll = function () {
      if (!wide.matches) return;
      var r = products.getBoundingClientRect();
      var span = products.offsetHeight - window.innerHeight;
      var p = Math.min(Math.max(-r.top / span, 0), 0.999);
      show(Math.floor(p * pics.length));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    products.querySelectorAll('[data-go]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (!wide.matches) return;
        e.preventDefault();
        var n = Number(a.getAttribute('data-go'));
        var top = products.getBoundingClientRect().top + window.scrollY;
        var span = products.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + span * (n + 0.5) / pics.length, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Section entrances: heading, then text, then picture ---------- */
  var groups = [
    ['.board', '.tile'],
    ['.consulting-text', '.services li, p, .link-strong'],
    ['.mig-head', 'h2, p'],
    ['.mig-pick', 'fieldset'],
    ['.findings', '.finding-path, dl > div, .findings-note'],
    ['.how', 'h2, .stage'],
    ['.contact', 'h2, .contact-line, .contact-card, .form .form-row, .form > .field, .form-foot'],
    ['.site-footer', '.footer-places li, .footer-links > div']
  ];
  var targets = [];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (root) {
      root.querySelectorAll(g[1]).forEach(function (node, i) {
        node.setAttribute('data-reveal', '');
        node.style.setProperty('--d', i);
        targets.push(node);
      });
    });
  });
  document.querySelectorAll('.reveal').forEach(function (node) { node.classList.remove('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* ---------- Links that pick a contact topic ---------- */
  document.querySelectorAll('a[data-topic]').forEach(function (link) {
    link.addEventListener('click', function () {
      var select = document.getElementById('cf-topic');
      if (select) select.value = link.getAttribute('data-topic');
    });
  });

  /* ---------- Contact form: send with fetch and show the result inline ----------
     Without JavaScript the form posts normally and /api/contact redirects back with ?sent=. */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('cf-status');
  if (!form || !status) return;

  var FALLBACK = 'Please email us at <a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a> instead.';
  function say(kind, html) {
    status.className = 'form-status ' + kind;
    status.innerHTML = html;
  }

  var sent = new URLSearchParams(window.location.search).get('sent');
  if (sent === '1') say('ok', 'Thank you, your message has been sent. We will reply within one working day.');
  if (sent === '0') say('err', 'Your message could not be sent. ' + FALLBACK);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

    if (!data.name.trim() || !data.message.trim()) {
      say('err', 'Please fill in your name and a message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      say('err', 'Please enter a valid email address.');
      document.getElementById('cf-email').focus();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say('', 'Sending…');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          say('ok', 'Thank you, your message has been sent. We will reply within one working day.');
        } else if (res.status === 400) {
          say('err', 'Please check the form: name, a valid email and a message are required.');
        } else {
          say('err', 'Your message could not be sent. ' + FALLBACK);
        }
      })
      .catch(function () {
        say('err', 'Your message could not be sent. ' + FALLBACK);
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
