/* =============================================================
   ADVANCE HOME INTERIOR — shared interactions
   Sticky header · mobile nav · scroll reveals · stat counters
   Vanilla JS, no dependencies.
   ============================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Sticky header state ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    const close = () => document.body.classList.remove("menu-open");
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Scroll reveal ---------- */
  const reveal = document.querySelectorAll("[data-reveal]");
  if (reveal.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      reveal.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );
      reveal.forEach((el) => io.observe(el));
    }
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      if (reduce) { el.textContent = target.toFixed(dec); return; }
      const dur = 1600;
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => io.observe(el));
    }
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      // No backend is wired up yet — this is a graceful front-end acknowledgement.
      setTimeout(() => {
        if (status) {
          status.hidden = false;
          status.textContent =
            "Thank you — your enquiry has been noted. We'll be in touch shortly. (Connect this form to email/WhatsApp to receive submissions.)";
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send enquiry"; }
      }, 700);
    });
  }
})();
