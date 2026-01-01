
console.log("app.js loaded");

function getBasePrefix() {
    // GitHub Pages repo = /sandbox/..., en local = /
    return window.location.pathname.startsWith("/sandbox/") ? "/sandbox" : "";
  }
  const BASE = getBasePrefix();
  

const previewModal = document.getElementById("previewModal");
if (previewModal) {
  previewModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    if (!button) return;

    const imgSrc = button.getAttribute("data-img");
    const title = button.getAttribute("data-title");

    const imgEl = document.getElementById("previewImage");
    const titleEl = document.getElementById("previewTitle");
    if (imgEl) imgEl.src = imgSrc || "";
    if (titleEl) titleEl.textContent = title || "";
  });
}



async function loadTranslations(lang) {
    const url = `${BASE}/assets/i18n/${lang}.json`;
    console.log("Loading i18n:", url);
  
    const res = await fetch(url, { cache: "no-store" });
    console.log("i18n status:", res.status);
  
    if (!res.ok) throw new Error(`Cannot load i18n file: ${lang}.json`);
    return await res.json();
  }
  
  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[key];
      if (value === undefined) return; // key manquante => on ignore
      el.textContent = value;
    });
  
    // bonus: placeholders si tu en as
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = dict[key];
      if (value === undefined) return;
      el.setAttribute("placeholder", value);
    });
  }
  
  function setLangUI(lang) {
    document.querySelectorAll(".lang-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.lang === lang);
      a.setAttribute("aria-current", a.dataset.lang === lang ? "true" : "false");
    });
  }
  
  async function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    setLangUI(lang);
  
    try {
      const dict = await loadTranslations(lang);
      applyTranslations(dict);
      document.documentElement.lang = lang;
    } catch (err) {
      console.error(err);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lang") || "en";
    setLanguage(saved);
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobileMenu");

    if (toggle && menu) {
    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    }

  
    const links = document.querySelectorAll(".lang-link");
    if (!links.length) {
      console.warn("No .lang-link found on this page");
      return;
    }
  
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setLanguage(a.dataset.lang);
      });
    });
  });
  
  document.querySelectorAll("#mobileMenu a").forEach(a => {
    a.addEventListener("click", () => {
      const menu = document.getElementById("mobileMenu");
      const toggle = document.querySelector(".menu-toggle");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      const menu = document.getElementById("mobileMenu");
      const toggle = document.querySelector(".menu-toggle");
      if (menu) menu.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
  