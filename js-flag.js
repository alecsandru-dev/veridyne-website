// Runs before first paint so entrance styles and the theme apply without a flash. Kept as a file: the CSP blocks inline scripts.
document.documentElement.classList.add('js');

/* Theme: the visitor's saved choice, else the system setting, which is followed live until they choose. */
(function () {
  var KEY = 'veridyne-theme';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07111F' : '#FFFFFF');
  }
  apply(saved() || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); });
  window.veridyneTheme = function (theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
  };
  document.addEventListener('DOMContentLoaded', function () { apply(root.getAttribute('data-theme')); });
})();

/* Launch offer: hidden everywhere once it has ended, and the top bar hidden for anyone who closed it. */
(function () {
  var root = document.documentElement;
  if (Date.now() > Date.parse('2026-12-31T21:59:59Z')) root.classList.add('promo-ended');
  try { if (localStorage.getItem('veridyne-promo-closed') === 'LAUNCH50') root.classList.add('promo-closed'); } catch (e) {}
})();
