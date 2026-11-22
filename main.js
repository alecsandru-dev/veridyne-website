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

  /* Hero film: nanites build the gateway once, then the finished gateway idles in a loop.
     Only where it will play well (a desktop pointer, motion allowed, no data saver); everyone else keeps the still
     of the finished gateway. The page never waits for it: it is fetched after everything else has loaded. */
  var heroStage = document.querySelector('.hero-stage');
  var build = heroStage && heroStage.querySelector('.hero-film-build');
  if (build) {
    var idle = heroStage.querySelector('.hero-film-idle');
    var wants = !light && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!wants) heroStage.classList.add('no-film');
    else {
      var giveUp = function () { heroStage.classList.remove('film-on', 'film-idle'); heroStage.classList.add('no-film'); };
      var startFilm = function () {
        build.src = build.getAttribute('data-src'); build.load();
        build.addEventListener('error', giveUp);
        build.addEventListener('canplaythrough', function once() {
          build.removeEventListener('canplaythrough', once);
          var p = build.play();
          if (p && p.then) p.then(function () { heroStage.classList.add('film-on'); idle.src = idle.getAttribute('data-src'); idle.load(); }, giveUp);
        });
        build.addEventListener('ended', function () {
          var p = idle.play();
          if (p && p.then) p.then(function () { heroStage.classList.add('film-idle'); }, function () { heroStage.classList.add('film-done'); });
          else heroStage.classList.add('film-done');
        });
        if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
          if (!heroStage.classList.contains('film-idle')) return;
          if (en[0].isIntersecting) { var p = idle.play(); if (p && p.catch) p.catch(function () {}); } else idle.pause();
        }, { threshold: 0.05 }).observe(heroStage);
      };
      if (document.readyState === 'complete') startFilm(); else window.addEventListener('load', startFilm);
    }
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

  /* "A word from our founder" (home hero): a small looping preview in the button, the 55-second video in a dialog
     with sound, then an end screen that sends people on to /welcome. Closing after half the video marks the
     "About us" pill as up next. Visitors who finished it once see "Watch again" and no attention pulse.
     Without JavaScript (or without <dialog>) the link opens the video file itself. */
  var founderLink = document.querySelector('a[data-founder]');
  var founder = document.getElementById('founder');
  if (founderLink && founder && typeof founder.showModal === 'function') {
    var fv = founder.querySelector('video');
    var fEnd = founder.querySelector('.founder-end');
    var aboutLink = document.querySelector('.about-link');
    var KEY = 'veridyneFounderWatched';
    var seen = false;
    try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
    var markSeen = function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      if (aboutLink) aboutLink.classList.add('up-next');
    };
    var fTitle = founderLink.querySelector('.founder-title');
    if (seen) {
      founderLink.classList.add('founder-seen');
      if (fTitle) fTitle.textContent = 'Watch again';
      if (aboutLink) aboutLink.classList.add('up-next');
    }

    var teaser = founderLink.querySelector('.founder-teaser');
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saver = navigator.connection && navigator.connection.saveData;
    if (teaser && !still && !saver) {
      var startTeaser = function () {
        teaser.src = teaser.getAttribute('data-src');
        var tp = teaser.play();
        if (tp && tp.catch) tp.catch(function () {});
      };
      if (document.readyState === 'complete') startTeaser(); else window.addEventListener('load', startTeaser);
    }

    var reached = 0;
    founderLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (!fv.src) fv.src = fv.getAttribute('data-src');
      fEnd.hidden = true;
      founder.showModal();
      var p = fv.play();
      if (p && p.catch) p.catch(function () {});
    });
    fv.addEventListener('timeupdate', function () {
      if (!fv.duration) return;
      var r = fv.currentTime / fv.duration;
      if (r > reached) reached = r;
      if (reached >= 0.9) markSeen();
    });
    fv.addEventListener('ended', function () { markSeen(); fEnd.hidden = false; });
    fv.addEventListener('play', function () { fEnd.hidden = true; });
    founder.querySelector('.founder-replay').addEventListener('click', function () {
      fEnd.hidden = true;
      fv.currentTime = 0;
      var p = fv.play();
      if (p && p.catch) p.catch(function () {});
    });
    founder.querySelector('.founder-book').addEventListener('click', function () { founder.close(); });
    founder.addEventListener('close', function () {
      fv.pause();
      if (!fv.ended && reached >= 0.5 && aboutLink) {
        aboutLink.classList.add('up-next');
        var box = aboutLink.getBoundingClientRect();
        if (box.top < 0 || box.bottom > window.innerHeight) aboutLink.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
      }
    });
    founder.addEventListener('click', function (e) { if (e.target === founder) founder.close(); });
  }

  /* /welcome: the film starts with sound where the browser allows it. Where it does not (most first visits), it plays
     muted, and the first tap, click or key anywhere on the page turns the sound on; the button does the same.
     With reduced motion asked for, it waits for Play. */
  var wv = document.getElementById('welcome-video');
  if (wv) {
    var ws = document.querySelector('.welcome-sound');
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var showSound = function () { if (ws) ws.hidden = !wv.muted || wv.paused; };
    var soundOn = function () {
      if (!wv.muted) return;
      wv.muted = false;
      if (wv.ended) wv.currentTime = 0;
      var p = wv.play();
      if (p && p.catch) p.catch(function () {});
      showSound();
    };
    var firstTouch = function (e) {
      if (e.target && e.target.closest && e.target.closest('a, video')) return;
      soundOn();
      ['pointerdown', 'keydown'].forEach(function (ev) { document.removeEventListener(ev, firstTouch, true); });
    };
    if (!calm) {
      wv.muted = false;
      var wp = wv.play();
      if (wp && wp.then) {
        wp.then(showSound, function () {
          wv.muted = true;
          var w2 = wv.play();
          if (w2 && w2.then) w2.then(showSound, function () {});
          ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, firstTouch, true); });
        });
      }
    }
    if (ws) ws.addEventListener('click', function (e) { e.stopPropagation(); soundOn(); });
    ['volumechange', 'play', 'pause'].forEach(function (ev) { wv.addEventListener(ev, showSound); });
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
      var left = o.left != null ? o.left + ' left' : '';
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

  /* ---------- Holiday themes: the owner turns one on in the admin console (Setup → Theme switcher) ----------
     my.veridyne.eu/api/public/season says which ("none", "thanksgiving", "christmas" or "national", Romania's National
     Day); the last answer is kept so a return visit shows it at once. The hero never changes: the season shows from the
     first section after it, in the threads between sections, beside the menu (Thanksgiving, National Day) and in a strip
     above the menu, under any running offer (Christmas, National Day). */
  (function () {
    var main = document.getElementById('main');
    if (!main) return;
    var KEY = 'veridyne-season';
    var MAPLE = 'M12 2L13.6 6.2L16.4 4.8L15.8 9L20 7.6L18.6 11L22 12.4L17.4 14.6L18.4 17L13 16L12.6 22L11.4 22L11 16L5.6 17L6.6 14.6L2 12.4L5.4 11L4 7.6L8.2 9L7.6 4.8L10.4 6.2Z';
    var LEAVES = ['#e8590c', '#c2410c', '#f2b33d', '#d9480f', '#b45309'];
    var SEASONS = { thanksgiving: 1, christmas: 1, national: 1 };
    var layer = null;
    var placeLayer = function () {
      if (!layer) return;
      var hero = main.querySelector(':scope > .hero');
      layer.style.top = hero ? (hero.offsetTop + hero.offsetHeight) + 'px' : '0px';
    };
    var clear = function () {
      root.removeAttribute('data-season');
      document.querySelectorAll('.season-layer, .season-greet, .season-bar').forEach(function (el) { el.remove(); });
      layer = null;
    };
    var apply = function (season) {
      if (!SEASONS[season]) { clear(); return; }
      if (root.getAttribute('data-season') === season && layer) return;
      clear();
      root.setAttribute('data-season', season);
      layer = document.createElement('div');
      layer.className = 'season-layer';
      layer.setAttribute('aria-hidden', 'true');
      var sky = document.createElement('div');
      sky.className = 'season-sky';
      var seed = 13;
      var r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (var i = 0; i < 18; i++) {
        var f = document.createElement('i');
        var d = 12 + r() * 12;
        f.style.setProperty('--x', (r() * 100).toFixed(1) + '%');
        f.style.setProperty('--z', Math.round(16 + r() * 14) + 'px');
        f.style.setProperty('--s', (2 + r() * 4).toFixed(1) + 'px');
        f.style.setProperty('--d', d.toFixed(1) + 's');
        f.style.setProperty('--dl', (-r() * d).toFixed(1) + 's');
        f.style.setProperty('--sx', Math.round((r() - 0.5) * 80) + 'px');
        f.style.setProperty('--y', Math.round(r() * 90) + '%');
        if (season === 'thanksgiving') f.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + MAPLE + '" fill="' + LEAVES[i % LEAVES.length] + '"/></svg>';
        sky.appendChild(f);
      }
      layer.appendChild(sky);
      main.prepend(layer);
      placeLayer();
      if (season === 'thanksgiving' || season === 'national') {
        var cta = document.querySelector('.nav-links .nav-cta');
        if (cta) {
          var greet = document.createElement('span');
          greet.className = 'season-greet';
          greet.textContent = season === 'national' ? 'Happy National Day' : 'Happy Thanksgiving';
          cta.parentNode.insertBefore(greet, cta);
        }
      }
      if (season === 'christmas' || season === 'national') {
        /* Shown with or without an offer: it sits under the offer bar, just above the menu. */
        var sb = document.createElement('aside');
        sb.className = 'season-bar';
        sb.setAttribute('aria-label', 'Season greeting');
        sb.innerHTML = season === 'national'
          ? '<p><b>1 December</b> · Happy National Day, Romania</p>'
          : '<p><b>Happy holidays</b> from all of us in Bucharest.</p>';
        var head = document.querySelector('.site-header');
        if (head) head.parentNode.insertBefore(sb, head);
      }
    };
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) apply(saved);
    window.addEventListener('resize', placeLayer);
    window.addEventListener('load', placeLayer);
    if (window.fetch) {
      fetch('https://my.veridyne.eu/api/public/season').then(function (res) { return res.ok ? res.json() : null; }).then(function (d) {
        if (!d) return;
        var s = SEASONS[d.season] ? d.season : 'none';
        try { localStorage.setItem(KEY, s); } catch (e) {}
        apply(s);
      }).catch(function () {});
    }
  })();

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
