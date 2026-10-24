// Stats, publication filters and active-nav highlighting.
// Papers are tagged in index.html with data-topic="ssl|mm", plus data-first / data-top.
(function () {
  var papers = Array.prototype.slice.call(document.querySelectorAll('.paper'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.pub-group'));

  function matches(paper, filter) {
    if (filter === 'all') return true;
    if (filter === 'first') return paper.hasAttribute('data-first');
    return paper.getAttribute('data-topic') === filter;
  }

  function count(filter) {
    return papers.filter(function (p) { return matches(p, filter); }).length;
  }

  // Sidebar stats stay in sync with the publication list
  var stats = {
    papers: papers.length,
    first: count('first'),
    top: papers.filter(function (p) { return p.hasAttribute('data-top'); }).length
  };
  document.querySelectorAll('[data-stat]').forEach(function (el) {
    el.textContent = stats[el.getAttribute('data-stat')];
  });

  // Filter chips
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  document.querySelectorAll('[data-count]').forEach(function (el) {
    el.textContent = count(el.getAttribute('data-count'));
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      papers.forEach(function (p) { p.hidden = !matches(p, filter); });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector('.paper:not([hidden])');
      });
    });
  });

  // Highlight the nav link of the section currently in view
  var links = {};
  document.querySelectorAll('.topnav-links a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !links[entry.target.id]) return;
      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-active', id === entry.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
