(function () {
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      if (!current) {
        current = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('rm-theme', next); } catch (e) {}
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  var bar = document.getElementById('navProgress');
  if (bar) {
    var ticking = false;
    var update = function () {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
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
