/* ============================================================
   MAIN
   Three jobs only: header hairline, nav current-section state,
   and scroll reveals. Everything else is CSS.
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Header hairline appears once the masthead scrolls off --- */

  var header = document.querySelector(".header");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Nav current-section state ------------------------------- */

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var watched = links
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (watched.length && "IntersectionObserver" in window) {
    var setCurrent = function (id) {
      links.forEach(function (link) {
        link.classList.toggle("is-current", link.getAttribute("href") === "#" + id);
      });
    };

    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      // Band across the upper-middle of the viewport, so the
      // marker changes when a section takes over the screen.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    watched.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* --- Scroll reveals: 8px rise, staggered, fires once --------- */

  var targets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  var revealAll = function () {
    targets.forEach(function (el) {
      el.classList.add("is-in");
    });
  };

  if (reduced || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    targets.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Anything already on screen at load reveals immediately.
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-in");
        }
      });
    });
  }

  /* --- Footer year -------------------------------------------- */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
