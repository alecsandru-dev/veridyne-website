// Runs before first paint so entrance styles and the theme apply without a flash. Kept as a file: the CSP blocks inline scripts.
document.documentElement.classList.add('js');

/* Theme: dark unless the visitor chose light with the header switch (the site's look follows the films). */
(function () {
  var KEY = 'veridyne-theme';
  var root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07111F' : '#FFFFFF');
  }
  apply(saved() === 'light' ? 'light' : 'dark');
  window.veridyneTheme = function (theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
  };
  document.addEventListener('DOMContentLoaded', function () { apply(root.getAttribute('data-theme')); });
})();

