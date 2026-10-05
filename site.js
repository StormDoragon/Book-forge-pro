/*
 * site.js - presentational chrome for the BookForge Pro site.
 *
 * This file owns only the marketing/website behavior: theme toggle, mobile
 * navigation, scroll reveal, active-link tracking, the "try an example" demo,
 * and the footer year. The blueprint engine lives entirely in script.js; this
 * script never touches generation logic, it only drives the UI shell.
 */

(function () {
  "use strict";

  const root = document.documentElement;
  const THEME_KEY = "bookforge-theme";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme ---------------- */

  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector(".theme-icon");
      if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
      themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} theme`);
    }
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage blocked */ }
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  initTheme();

  /* ---------------- Mobile navigation ---------------- */

  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const open = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  }

  /* ---------------- Scroll reveal ---------------- */

  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      // A pixel margin, not a ratio: a long generated blueprint makes the
      // studio many screens tall, so a ratio threshold could never be met.
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------------- Active nav link on scroll ---------------- */

  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------------- Try an example ---------------- */

  const tryExampleBtn = document.getElementById("tryExampleBtn");
  const generateBtn = document.getElementById("generateBtn");

  const EXAMPLE = {
    projectName: "The Quiet Empire",
    bookIdea:
      "A village baker named Mara discovers a hidden letter revealing her grandmother was a wartime spy, " +
      "and uncovering the truth could expose a betrayal the town buried for fifty years.",
    genre: "Historical",
    bookType: "Fiction",
    targetReader: "book clubs that love character-driven historical fiction",
    tone: "Cinematic",
    depthLevel: "Professional Blueprint",
    positioning: "an intimate family mystery set against a national betrayal",
    length: "75000"
  };

  function setField(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    // Only assign select values that actually exist as options.
    if (el.tagName === "SELECT") {
      const match = Array.from(el.options).some((opt) => opt.value === value);
      if (match) el.value = value;
    } else {
      el.value = value;
    }
  }

  if (tryExampleBtn) {
    tryExampleBtn.addEventListener("click", () => {
      Object.keys(EXAMPLE).forEach((id) => setField(id, EXAMPLE[id]));
      const studio = document.getElementById("studio");
      if (studio) studio.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      // Let the scroll start, then generate via the engine's own handler.
      if (generateBtn) {
        window.setTimeout(() => generateBtn.click(), prefersReducedMotion ? 0 : 480);
      }
    });
  }

  /* ---------------- Footer year ---------------- */

  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
