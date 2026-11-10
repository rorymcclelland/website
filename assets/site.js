(function () {
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      if (!current) {
        current = 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      try { localStorage.setItem('rm-theme', next); } catch (e) {}
    });
  }

  // Writing index: filter posts by theme
  var pills = document.querySelectorAll('.filters .ipill');
  if (pills.length) {
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        var t = p.getAttribute('data-filter');
        pills.forEach(function (q) { q.classList.toggle('active', q === p); q.setAttribute('aria-pressed', q === p ? 'true' : 'false'); });
        document.querySelectorAll('.post-list .pcard').forEach(function (c) {
          c.hidden = !(t === 'all' || c.getAttribute('data-topic') === t);
        });
      });
    });
  }
})();
