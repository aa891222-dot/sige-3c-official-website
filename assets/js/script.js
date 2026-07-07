const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const page = document.body.dataset.page;

if (header) {
  window.addEventListener("scroll", () => {
    header.toggleAttribute("data-scrolled", window.scrollY > 12);
  }, { passive: true });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (page) {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navLink === page);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    if (!selector || selector === "#") return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
