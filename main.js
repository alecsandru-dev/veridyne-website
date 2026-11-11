// Veridyne site: header state, films on demand, entrances, product screenshots on scroll, contact form.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header gets its hairline once the page moves ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Hero: sign-ins passing one gate (people on one side, their apps on the other) ----------
     Drawn on a canvas so it stays sharp on any screen. Most sign-ins pass and light up an app; now and then one is
     refused at the gate. Still with reduced motion; paused while off screen or in a hidden tab. */
  var flow = document.querySelector('.hero-flow');
  if (flow && flow.getContext) (function () {
    var ctx = flow.getContext('2d'), stage = flow.parentNode;
    var W = 0, H = 0, dpr = 1, R, gate, people = [], apps = [], parts = [], rings = [], seed = 11, last = 0, since = 0, live = false, seen = true;
    var CY = '127, 219, 255', AMB = '255, 179, 64';
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function layout() {
      var rect = stage.getBoundingClientRect(), i;
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      W = rect.width; H = rect.height;
      flow.width = Math.round(W * dpr); flow.height = Math.round(H * dpr);
      var stacked = window.matchMedia('(max-width: 1280px)').matches;
      var band = stacked ? parseFloat(getComputedStyle(stage).paddingTop) || H * 0.4 : H;
      R = stacked ? { x: W * 0.07, y: 26, w: W * 0.86, h: band - 74 } : { x: W * 0.5, y: H * 0.13, w: W * 0.44, h: H * 0.7 };
      gate = { x: R.x + R.w * 0.5, y: R.y + R.h * 0.5, rx: Math.max(13, R.h * 0.07), ry: R.h * 0.4, pulse: 0, deny: 0 };
      var small = R.w < 560, nIn = small ? 5 : 7, nOut = small ? 4 : 5, s = Math.max(26, Math.min(50, R.h * 0.125));
      people = []; apps = [];
      for (i = 0; i < nIn; i++) people.push({ x: R.x + 5, y: R.y + R.h * (0.04 + 0.92 * i / (nIn - 1)) });
      for (i = 0; i < nOut; i++) apps.push({ x: R.x + R.w - s / 2, y: R.y + R.h * (0.08 + 0.84 * i / (nOut - 1)), s: s, glow: 0 });
      parts.forEach(function (p) { p.lane %= nIn; p.app %= nOut; });
    }
    // The two halves of a sign-in's path: person to gate, gate to app.
    function inPath(i) {
      var a = people[i], k = (i / (people.length - 1) - 0.5) * 2, b = { x: gate.x, y: gate.y + k * gate.ry * 0.55 }, d = b.x - a.x;
      return [a, { x: a.x + d * 0.5, y: a.y }, { x: b.x - d * 0.3, y: b.y }, b];
    }
    function outPath(i, j) {
      var k = (i / (people.length - 1) - 0.5) * 2, a = { x: gate.x, y: gate.y + k * gate.ry * 0.55 }, t = apps[j], b = { x: t.x - t.s / 2 - 5, y: t.y }, d = b.x - a.x;
      return [a, { x: a.x + d * 0.3, y: a.y }, { x: b.x - d * 0.5, y: b.y }, b];
    }
    function at(c, t) {
      var u = 1 - t, a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t;
      return { x: a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x, y: a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y };
    }
    function curve(c) { ctx.beginPath(); ctx.moveTo(c[0].x, c[0].y); ctx.bezierCurveTo(c[1].x, c[1].y, c[2].x, c[2].y, c[3].x, c[3].y); ctx.stroke(); }
    function spawn(t0) {
      var ok = rnd() > 0.09;
      parts.push({ lane: Math.floor(rnd() * people.length), app: Math.floor(rnd() * apps.length), t: t0 || 0, phase: 0, hold: 0, ok: ok, v: 0.3 + rnd() * 0.12, a: 1 });
    }
    function step(dt) {
      since += dt;
      if (since > 0.46 && parts.length < 22) { since = 0; spawn(); }
      gate.pulse = Math.max(0, gate.pulse - dt * 2.2); gate.deny = Math.max(0, gate.deny - dt * 1.4);
      apps.forEach(function (a) { a.glow = Math.max(0, a.glow - dt * 1.1); });
      rings = rings.filter(function (r) { r.t += dt * 1.6; return r.t < 1; });
      parts = parts.filter(function (p) {
        if (p.phase === 0) { p.t += dt * p.v; if (p.t >= 1) { p.t = 1; p.phase = 1; p.hold = 0.16; if (p.ok) gate.pulse = 1; else gate.deny = 1; } }
        else if (p.phase === 1) { p.hold -= dt; if (p.hold <= 0) { if (p.ok) { p.phase = 2; p.t = 0; rings.push({ y: at(inPath(p.lane), 1).y, t: 0 }); } else p.phase = 3; } }
        else if (p.phase === 2) { p.t += dt * (p.v + 0.16); if (p.t >= 1) { apps[p.app].glow = 1; return false; } }
        else { p.t -= dt * 0.5; p.a -= dt * 1.5; if (p.a <= 0) return false; }
        return true;
      });
    }
    function dot(p) {
      var c = p.phase === 2 ? outPath(p.lane, p.app) : inPath(p.lane), col = p.ok ? CY : AMB, i, q;
      for (i = 6; i >= 1; i--) { q = at(c, Math.max(0, p.t - i * 0.016)); ctx.fillStyle = 'rgba(' + col + ', ' + (0.1 * (7 - i) / 6 * p.a) + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, 6.2832); ctx.fill(); }
      q = at(c, Math.max(0, Math.min(1, p.t)));
      ctx.fillStyle = 'rgba(' + col + ', ' + 0.22 * p.a + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 7, 0, 6.2832); ctx.fill();
      ctx.fillStyle = p.ok ? 'rgba(255, 255, 255, ' + p.a + ')' : 'rgba(' + AMB + ', ' + p.a + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 2.4, 0, 6.2832); ctx.fill();
    }
    function box(x, y, s, r) { ctx.beginPath(); ctx.moveTo(x - s / 2 + r, y - s / 2); ctx.arcTo(x + s / 2, y - s / 2, x + s / 2, y + s / 2, r); ctx.arcTo(x + s / 2, y + s / 2, x - s / 2, y + s / 2, r); ctx.arcTo(x - s / 2, y + s / 2, x - s / 2, y - s / 2, r); ctx.arcTo(x - s / 2, y - s / 2, x + s / 2, y - s / 2, r); ctx.closePath(); }
    function label(text, x, y) { ctx.fillText(text, x, y); }
    function draw() {
      var i, j, g;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      g = ctx.createRadialGradient(gate.x, gate.y, 0, gate.x, gate.y, gate.ry * 1.9);
      g.addColorStop(0, 'rgba(0, 150, 240, 0.32)'); g.addColorStop(0.5, 'rgba(0, 110, 210, 0.1)'); g.addColorStop(1, 'rgba(0, 110, 210, 0)');
      ctx.fillStyle = g; ctx.fillRect(gate.x - gate.ry * 2, gate.y - gate.ry * 2, gate.ry * 4, gate.ry * 4);
      // paths
      ctx.lineWidth = 1;
      for (i = 0; i < people.length; i++) {
        g = ctx.createLinearGradient(people[i].x, 0, gate.x, 0); g.addColorStop(0, 'rgba(' + CY + ', 0.05)'); g.addColorStop(1, 'rgba(' + CY + ', 0.3)');
        ctx.strokeStyle = g; curve(inPath(i));
      }
      ctx.strokeStyle = 'rgba(' + CY + ', 0.16)';
      for (j = 0; j < apps.length; j++) curve(outPath(Math.round(j * (people.length - 1) / (apps.length - 1)), j));
      // people
      for (i = 0; i < people.length; i++) {
        ctx.fillStyle = '#07111F'; ctx.strokeStyle = 'rgba(' + CY + ', 0.75)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(people[i].x, people[i].y, 5, 0, 6.2832); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(' + CY + ', 0.9)'; ctx.beginPath(); ctx.arc(people[i].x, people[i].y, 1.6, 0, 6.2832); ctx.fill();
      }
      // apps
      apps.forEach(function (a) {
        box(a.x, a.y, a.s, a.s * 0.26);
        ctx.fillStyle = 'rgba(' + (12 + 0 * a.glow) + ', ' + Math.round(26 + 110 * a.glow) + ', ' + Math.round(46 + 170 * a.glow) + ', 0.92)'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(' + CY + ', ' + (0.4 + 0.6 * a.glow) + ')'; ctx.stroke();
        if (a.glow > 0.02) { ctx.save(); ctx.shadowColor = 'rgba(0, 180, 255, ' + a.glow + ')'; ctx.shadowBlur = 22; ctx.stroke(); ctx.restore(); }
        ctx.strokeStyle = 'rgba(233, 239, 247, ' + (0.45 + 0.55 * a.glow) + ')'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(a.x - a.s * 0.2, a.y - a.s * 0.09); ctx.lineTo(a.x + a.s * 0.2, a.y - a.s * 0.09);
        ctx.moveTo(a.x - a.s * 0.2, a.y + a.s * 0.11); ctx.lineTo(a.x + a.s * 0.04, a.y + a.s * 0.11); ctx.stroke();
      });
      // the gate: a tall ring of light, seen slightly from the side
      var col = gate.deny > 0.02 ? AMB : CY, hot = Math.max(gate.pulse, gate.deny);
      g = ctx.createLinearGradient(gate.x - gate.rx, 0, gate.x + gate.rx, 0);
      g.addColorStop(0, 'rgba(' + col + ', 0)'); g.addColorStop(0.5, 'rgba(' + col + ', ' + (0.1 + 0.16 * hot) + ')'); g.addColorStop(1, 'rgba(' + col + ', 0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(gate.x, gate.y, gate.rx, gate.ry, 0, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.shadowColor = 'rgba(' + (gate.deny > 0.02 ? AMB : '0, 180, 255') + ', ' + (0.7 + 0.3 * hot) + ')'; ctx.shadowBlur = 18 + 22 * hot;
      ctx.strokeStyle = 'rgba(' + col + ', 0.95)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(gate.x, gate.y, gate.rx, gate.ry, 0, 0, 6.2832); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = 'rgba(' + col + ', 0.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(gate.x, gate.y, gate.rx * 1.9, gate.ry * 1.12, 0, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = 'rgba(' + col + ', 0.16)'; ctx.beginPath(); ctx.ellipse(gate.x, gate.y, gate.rx * 3, gate.ry * 1.26, 0, 0, 6.2832); ctx.stroke();
      rings.forEach(function (r) { ctx.strokeStyle = 'rgba(' + CY + ', ' + 0.7 * (1 - r.t) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(gate.x, r.y, 3 + 9 * r.t, 6 + 20 * r.t, 0, 0, 6.2832); ctx.stroke(); });
      parts.forEach(dot);
      // three quiet words
      ctx.font = '600 11px Archivo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(159, 176, 198, 0.85)';
      try { ctx.letterSpacing = '2px'; } catch (e) {}
      var ly = R.y + R.h + 16;
      ctx.textAlign = 'left'; label('PEOPLE', R.x - 4, ly);
      ctx.textAlign = 'center'; label(R.w < 560 ? 'SIGN-IN' : 'ONE SECURE SIGN-IN', gate.x, ly);
      ctx.textAlign = 'right'; label(R.w < 560 ? 'APPS' : 'THEIR APPS', R.x + R.w, ly);
    }
    function frame(now) {
      if (!live) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
      if (seen && !document.hidden) { step(dt); draw(); }
      requestAnimationFrame(frame);
    }
    function start() {
      layout();
      if (!parts.length) { for (var i = 0; i < 9; i++) { spawn(rnd()); if (i % 3 === 0) { var p = parts[parts.length - 1]; p.phase = 2; p.ok = true; } } apps[1].glow = 0.8; }
      draw();
      if (!reduce && !live) { live = true; last = performance.now(); requestAnimationFrame(frame); }
    }
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { layout(); draw(); }, 120); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }, { threshold: 0.02 }).observe(flow);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  })();

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
