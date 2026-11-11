// Veridyne site: header state, films on demand, entrances, product screenshots on scroll, contact form.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header gets its hairline once the page moves ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Films: nothing is fetched until a visitor asks for it ----------
     Product tiles show a still; on a desktop, pointing at one fetches and plays its short silent loop.
     Skipped with reduced motion, data saver or a slow connection. */
  var conn = navigator.connection || {};
  var light = reduce || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  if (!light && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.ptile').forEach(function (tile) {
      var v = tile.querySelector('video[data-src]');
      if (!v) return;
      tile.addEventListener('pointerenter', function () {
        if (!v.src) v.src = v.getAttribute('data-src');
        var p = v.play();
        if (p && p.then) p.then(function () { tile.classList.add('is-live'); }, function () {});
      });
      tile.addEventListener('pointerleave', function () { tile.classList.remove('is-live'); v.pause(); });
    });
  }

  /* "Watch the film": opens the launch film in a dialog and only then starts loading it.
     Without JavaScript (or without <dialog>) the link opens the film file itself. */
  var film = document.getElementById('film');
  if (film && typeof film.showModal === 'function') {
    var filmVideo = film.querySelector('video');
    document.querySelectorAll('a[data-film]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        if (!filmVideo.src) filmVideo.src = filmVideo.getAttribute('data-src');
        film.showModal();
        var p = filmVideo.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
    film.addEventListener('close', function () { filmVideo.pause(); });
    film.addEventListener('click', function (e) { if (e.target === film) film.close(); });
  }

  /* ---------- Theme switch (the theme itself is set by js-flag.js before paint) ---------- */
  var root = document.documentElement;
  var themeButtons = document.querySelectorAll('.theme-toggle');
  function labelTheme() {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    themeButtons.forEach(function (b) {
      b.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      var l = b.querySelector('.theme-toggle-label');
      if (l) l.textContent = next === 'dark' ? 'Dark theme' : 'Light theme';
    });
  }
  themeButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (window.veridyneTheme) window.veridyneTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      labelTheme();
    });
  });
  labelTheme();

  /* ---------- Phone menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    function setMenu(open) {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
    }
    toggle.addEventListener('click', function () { setMenu(!header.classList.contains('menu-open')); });
    header.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('menu-open') && !header.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Entrances: siblings come in one after another ---------- */
  var targets = document.querySelectorAll('.rise');
  var groups = new Map();
  targets.forEach(function (el) {
    var parent = el.parentElement;
    var n = groups.get(parent) || 0;
    el.style.setProperty('--d', Math.min(n * 90, 360) + 'ms');
    groups.set(parent, n + 1);
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* ---------- Product screenshots lean back, then settle flat as they reach the middle ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.product-shot'));
  if (shots.length && !reduce) {
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      shots.forEach(function (shot) {
        var r = shot.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        // 0 when the shot's top enters at the bottom, 1 when it reaches 30% from the top
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
        shot.style.setProperty('--tilt', ((1 - p) * 14).toFixed(2) + 'deg');
        shot.style.setProperty('--grow', (0.9 + p * 0.1).toFixed(3));
      });
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* ---------- Links from other pages arrive as /?topic=…#contact ---------- */
  var topicParam = new URLSearchParams(window.location.search).get('topic');
  var topicSelect = document.getElementById('cf-topic');
  if (topicParam && topicSelect) {
    Array.prototype.forEach.call(topicSelect.options, function (o) {
      if (o.value === topicParam) topicSelect.value = topicParam;
    });
  }

  /* ---------- Links that pick a contact topic ---------- */
  document.querySelectorAll('a[data-topic]').forEach(function (link) {
    link.addEventListener('click', function () {
      var select = document.getElementById('cf-topic');
      if (select) select.value = link.getAttribute('data-topic');
    });
  });

  /* ---------- Secure sign-in: choose a portal, then a short hand-off to its own SSO ----------
     Without JavaScript the links go to /signin, which lists the same two portals. */
  var PORTALS = { 'my.veridyne.eu': true, 'team.veridyne.eu': true };
  var gate = document.getElementById('gate');

  function setState(panel, state, text) {
    panel.setAttribute('data-state', state);
    if (text) panel.querySelector('.gate-status').textContent = text;
  }

  function resetPanel(panel) {
    setState(panel, 'ready', 'Secure channel ready');
    panel.querySelectorAll('.is-chosen').forEach(function (o) { o.classList.remove('is-chosen'); });
    panel.querySelectorAll('.gate-steps .done').forEach(function (s) { s.classList.remove('done'); });
  }

  function openGate() {
    if (!gate || typeof gate.showModal !== 'function') return false;
    var panel = gate.querySelector('.gate-panel');
    resetPanel(panel);
    gate.showModal();
    if (!reduce) {
      setState(panel, 'opening', 'Opening a secure channel');
      setTimeout(function () { if (panel.getAttribute('data-state') === 'opening') setState(panel, 'ready', 'Secure channel ready'); }, 750);
    }
    return true;
  }

  document.querySelectorAll('[data-gate]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (openGate()) e.preventDefault();
    });
  });

  if (gate) {
    gate.querySelector('.gate-close').addEventListener('click', function () { gate.close(); });
    // A click on the dimmed backdrop lands on the dialog itself.
    gate.addEventListener('click', function (e) { if (e.target === gate) gate.close(); });
  }

  // Each step below is a check this code really makes before leaving the page.
  document.querySelectorAll('.gate-option').forEach(function (option) {
    option.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var url;
      try { url = new URL(option.href); } catch (err) { e.preventDefault(); return; }
      if (url.protocol !== 'https:' || !PORTALS[url.host] || url.host !== option.getAttribute('data-host')) { e.preventDefault(); return; }
      if (reduce) return;
      e.preventDefault();
      var panel = option.closest('.gate-panel');
      if (panel.getAttribute('data-state') === 'going') return;
      option.classList.add('is-chosen');
      setState(panel, 'going', 'Connecting to ' + url.host);
      var steps = option.querySelectorAll('.gate-steps span');
      [260, 620, 980].forEach(function (t, i) {
        setTimeout(function () {
          steps[i].classList.add('done');
          if (i === 2) setState(panel, 'going', 'Handing off to Veridyne SSO');
        }, t);
      });
      setTimeout(function () { window.location.assign(url.href); }, 1400);
    });
  });

  // Coming back with the Back button shows the page as it was left; start fresh.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.querySelectorAll('.gate-panel').forEach(resetPanel);
    if (gate && gate.open) gate.close();
  });

  /* ---------- Certifications offer: shown only while certifications.veridyne.eu says the code still works ---------- */
  var bar = document.querySelector('.promo-bar');
  var callout = document.querySelector('.promo-callout');
  if ((bar || callout) && window.fetch) {
    fetch('https://certifications.veridyne.eu/api/offer').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      var o = d && d.offer;
      if (!o || !o.code || !o.percent) return;
      var closedKey = 'veridyne-offer-closed';
      var closed = null;
      try { closed = localStorage.getItem(closedKey); } catch (e) {}
      var pc = o.percent + '%';
      var what = o.certification ? 'the Veridyne Certified ' + o.certification + ' voucher' : 'every Veridyne Certifications voucher';
      var day = o.ends ? new Date(o.ends).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Europe/Bucharest' }) : '';
      var dayFull = o.ends ? new Date(o.ends).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Bucharest' }) : '';
      var left = o.uses != null && o.left != null ? o.left + ' of ' + o.uses + ' left' : '';
      var bn = o.banner || {};
      var showDetails = bn.details !== false;
      var text = {
        code: o.code,
        percent: pc,
        label: (bn.label || 'Launch offer') + ':',
        long: bn.text || pc + ' off ' + what,
        short: bn.short || pc + ' off ' + (o.certification ? 'the ' + o.certification + ' voucher' : 'certification vouchers'),
        when: showDetails ? [day ? 'until ' + day : '', left].filter(Boolean).join(', ') : '',
        link: bn.link || 'Get certified',
        body: (bn.body || 'Type the code on the payment page for ' + pc + ' off ' + (o.certification ? 'the ' + o.certification + ' voucher' : 'any voucher') + ': exam, retake or maintenance.') +
          (showDetails && (left || dayFull) ? ' ' + [left ? left.charAt(0).toUpperCase() + left.slice(1) : '', dayFull ? 'until ' + dayFull : ''].filter(Boolean).join(', ') + '.' : '')
      };
      document.querySelectorAll('[data-offer]').forEach(function (el) { el.textContent = text[el.getAttribute('data-offer')] || ''; });
      document.querySelectorAll('.promo-when').forEach(function (el) { el.hidden = !text.when; });
      document.querySelectorAll('.promo-code').forEach(function (b) {
        b.setAttribute('aria-label', 'Copy the code ' + o.code);
        b.addEventListener('click', function () {
          var label = b.querySelector('.promo-copy');
          var done = function () { if (label) { label.textContent = 'Copied'; setTimeout(function () { label.textContent = 'Copy'; }, 1800); } };
          if (navigator.clipboard) navigator.clipboard.writeText(o.code).then(done, function () {});
        });
      });
      if (callout) callout.hidden = false;
      if (bar && closed !== o.code) {
        bar.hidden = false;
        var close = bar.querySelector('.promo-close');
        if (close) close.addEventListener('click', function () {
          bar.hidden = true;
          try { localStorage.setItem(closedKey, o.code); } catch (e) {}
        });
      }
    }).catch(function () {});
  }

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
  if (sent === '1') say('ok', 'Almost done. Check your inbox and press the link we sent to confirm your message.');
  if (sent === '0') say('err', 'Your message could not be sent. ' + FALLBACK);
  var confirmed = new URLSearchParams(window.location.search).get('confirmed');
  if (confirmed === '1') say('ok', 'Thank you, your message has been sent. We will reply within one working day.');
  if (confirmed === '0') say('err', 'That link has expired. Send the form again for a new one.');

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
          say('ok', 'Almost done. Check your inbox and press the link we sent to confirm your message.');
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
