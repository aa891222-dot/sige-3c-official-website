const preloader = document.getElementById("preloader");
const greeting = document.getElementById("timeGreeting");
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const header = document.getElementById("siteHeader");
const glow = document.getElementById("cursorGlow");

const fallbackLinks = {
  googleReview: "https://www.google.com/search?q=%E5%9B%9B%E5%93%A53C%20%E6%89%8B%E6%A9%9F%E9%85%8D%E4%BB%B6%20%E8%A9%95%E8%AB%96",
  facebook: "https://www.facebook.com/share/1BZJysJbQC/?mibextid=wwXIfr",
  googleMap: "https://maps.app.goo.gl/wZMD5sJQXV1rrDbW6?g_st=ic",
  phone: "tel:033639939"
};

window.addEventListener("load", () => {
  window.setTimeout(() => preloader?.classList.add("hide"), 420);
});

const hour = new Date().getHours();
if (greeting) {
  if (hour < 12) greeting.textContent = "早安！歡迎來到四哥3C";
  else if (hour < 18) greeting.textContent = "下午好！需要手機配件嗎？";
  else greeting.textContent = "晚安！感謝您支持四哥3C";
}

async function hydrateLinks() {
  try {
    const response = await fetch("assets/data/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error("site data unavailable");
    const data = await response.json();
    const links = {
      googleReview: data.googleReview || fallbackLinks.googleReview,
      facebook: data.facebook || fallbackLinks.facebook,
      googleMap: data.googleMap || fallbackLinks.googleMap,
      phone: data.phone ? `tel:${String(data.phone).replace(/[^\d]/g, "")}` : fallbackLinks.phone
    };

    document.querySelectorAll("[data-action]").forEach((element) => {
      const href = links[element.dataset.action];
      if (href) element.href = href;
    });
  } catch {
    document.querySelectorAll("[data-action]").forEach((element) => {
      const href = fallbackLinks[element.dataset.action];
      if (href) element.href = href;
    });
  }
}

hydrateLinks();

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  document.body.classList.toggle("menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((anchor) => {
  anchor.addEventListener("click", () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      activeObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("show"));
}

document.querySelectorAll(".btn, .quick-card, .footer-links a").forEach((element) => {
  element.addEventListener("click", () => {
    if (!element.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.animate(
      [{ transform: "scale(1)" }, { transform: "scale(.97)" }, { transform: "scale(1)" }],
      { duration: 180, easing: "ease-out" }
    );
  });
});

let glowX = 0;
let glowY = 0;
let glowPending = false;

window.addEventListener("pointermove", (event) => {
  if (!glow || window.matchMedia("(pointer: coarse)").matches) return;
  glowX = event.clientX;
  glowY = event.clientY;
  if (glowPending) return;
  glowPending = true;
  requestAnimationFrame(() => {
    glow.style.transform = `translate3d(${glowX - 120}px, ${glowY - 120}px, 0)`;
    glowPending = false;
  });
}, { passive: true });

let lastScroll = window.scrollY;
let scrollPending = false;

window.addEventListener("scroll", () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => {
    const current = window.scrollY;
    header?.classList.toggle("is-scrolled", current > 12);
    if (header) {
      header.style.transform = current > lastScroll && current > 140 ? "translateY(-100%)" : "translateY(0)";
    }
    lastScroll = current;
    scrollPending = false;
  });
}, { passive: true });
