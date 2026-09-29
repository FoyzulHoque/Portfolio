/* Runs ONLY on the GitHub Pages copy (*.github.io).
   If the homelab site is up, send the visitor there. If it is down, they simply stay on this copy.
   The homelab answers /health with "ok" (and allows this origin via CORS); the Pages copy has no /health,
   so a fallback response can never be mistaken for "homelab is up". */
(function () {
  var PRIMARY = 'https://foyzulhoque.com.bd';
  if (!/\.github\.io$/i.test(location.hostname)) return;   // homelab and localhost never redirect
  if (/[?&]stay=1(&|$)/.test(location.search)) return;      // add ?stay=1 to inspect this copy
  if (!window.fetch || !window.AbortController) return;

  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 2500);
  fetch(PRIMARY + '/health', { cache: 'no-store', signal: ctrl.signal })
    .then(function (r) { return r.ok ? r.text() : ''; })
    .then(function (t) {
      clearTimeout(timer);
      if (t.trim() !== 'ok') return;
      var path = location.pathname.replace(/^\/Portfolio(?=\/|$)/, '') || '/';
      location.replace(PRIMARY + path + location.search + location.hash);
    })
    .catch(function () { clearTimeout(timer); });
})();
