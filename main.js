// Contact form: send with fetch and show the result inline.
// Without JavaScript the form posts normally and /api/contact redirects back with ?sent=.
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('cf-status');
  if (!form || !status) return;

  var FALLBACK = 'Please email us at <a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a> instead.';

  function show(kind, html) {
    status.className = 'form-status ' + kind;
    status.innerHTML = html;
  }

  var sent = new URLSearchParams(window.location.search).get('sent');
  if (sent === '1') show('ok', 'Thank you, your message has been sent. We will reply within one working day.');
  if (sent === '0') show('err', 'Your message could not be sent. ' + FALLBACK);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

    if (!data.name.trim() || !data.message.trim()) {
      show('err', 'Please fill in your name and a message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      show('err', 'Please enter a valid email address.');
      document.getElementById('cf-email').focus();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    show('', 'Sending…');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          show('ok', 'Thank you, your message has been sent. We will reply within one working day.');
        } else if (res.status === 400) {
          show('err', 'Please check the form: name, a valid email and a message are required.');
        } else {
          show('err', 'Your message could not be sent. ' + FALLBACK);
        }
      })
      .catch(function () {
        show('err', 'Your message could not be sent. ' + FALLBACK);
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
