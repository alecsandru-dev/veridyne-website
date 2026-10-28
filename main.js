// Veridyne site: header state, entrances, product screenshots on scroll, contact form.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header gets its hairline once the page moves ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

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
