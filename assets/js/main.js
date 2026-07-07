const body = document.body;
const menuButton = document.querySelector("[data-menu-button]");
const langToggle = document.querySelector("[data-lang-toggle]");
const chatBubble = document.querySelector("[data-chat-bubble]");
const layers = [...document.querySelectorAll(".layer")];
const canvas = document.querySelector("[data-particles]");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("[data-scroll-progress]");
const reviewForm = document.querySelector("[data-review-form]");
const thankYou = document.querySelector("[data-thank-you]");
const closeThankYou = document.querySelector("[data-close-thank-you]");

const googleReviewUrl = "https://www.google.com/maps/search/?api=1&query=%E5%9B%9B%E5%93%A53C";

const translations = {
  zh: {
    skip: "跳到主要內容",
    brand: "四哥3C",
    navHome: "首頁",
    navProducts: "現場商品",
    navOffers: "優惠",
    navReviews: "Google 評論",
    navStore: "門市資訊",
    heroKicker: "ANIME × CYBER TECH × MOBILE LIFE",
    heroSubtitle: "手機配件專門店",
    heroText: "到店挑選手機配件、保護貼、包膜與耳機周邊，現場幫你配到好。",
    featureQuality: "品質保證",
    featureInstall: "專業安裝",
    featureWrap: "專業包膜",
    featureCare: "貼心服務",
    heroReviewCta: "Google 高評價 4.9",
    heroOfferCta: "查看最新優惠",
    railProducts: "現場商品",
    railOffers: "最新優惠",
    railReviews: "Google 評論",
    catWrap: "專業包膜",
    catProtector: "保護貼",
    catCases: "手機殼",
    catLens: "鏡頭貼",
    catPower: "充電配件",
    catAudio: "耳機配件",
    productsTitle: "現場有賣什麼商品",
    productsNote: "本網站不做線上購物，歡迎到店挑選、詢問與體驗。",
    serviceRepair: "維修服務",
    serviceRepairDesc: "現場評估手機狀況，提供維修與處理建議。",
    serviceWrap: "專業包膜",
    serviceWrapDesc: "手機、平板與常用設備包膜，細節現場討論。",
    serviceProtector: "保護貼",
    serviceProtectorDesc: "玻璃貼、防窺貼、鏡頭保護與現場安裝。",
    serviceCases: "手機殼",
    serviceCasesDesc: "防摔、透明、潮流、磁吸與日常款式。",
    serviceLens: "鏡頭貼",
    serviceLensDesc: "鏡頭保護貼與相機模組防護配件。",
    servicePower: "充電配件",
    servicePowerDesc: "線材、充電頭、車充、磁吸充電與行動電源。",
    serviceBt: "藍芽耳機",
    serviceBtDesc: "通勤、運動與日常使用的藍芽音訊配件。",
    serviceWired: "有線耳機",
    serviceWiredDesc: "有線耳機、轉接頭與音訊周邊。",
    serviceWatch: "Apple Watch 配件",
    serviceWatchDesc: "錶帶、保護殼、保護貼與充電周邊。",
    offersTitle: "最新優惠",
    featuresTitle: "品牌特色",
    featureQualityDesc: "嚴選優質手機配件。",
    featureInstallDesc: "保護貼、包膜與現場服務。",
    featureWrapDesc: "依照設備與使用習慣推薦材質。",
    featureCareDesc: "售後安心回店詢問。",
    reviewsTitle: "Google 五星評論",
    reviewsCount: "來自 300+ 則評論",
    googleReviewButton: "前往 Google 評論",
    reviewFormTitle: "留下你的支持",
    reviewFormNote: "送出後會顯示感謝訊息；若要公開評論，請使用上方 Google 評論按鈕。",
    reviewName: "姓名",
    reviewMessage: "評論內容",
    reviewSubmit: "送出評論",
    storeTitle: "門市資訊",
    storeText: "歡迎來店挑選手機配件、保護貼、包膜與充電周邊。",
    storeMap: "一鍵導航到店",
    storePhone: "立即來電詢問",
    storeFacebook: "追蹤最新活動",
    storeGoogle: "查看與留下評論",
    thanksTitle: "謝謝您的支持",
    thanksText: "你的鼓勵我們收到了，期待下次再為你服務。",
    footerText: "手機配件、包膜、保護貼與現場服務"
  },
  en: {
    skip: "Skip to content",
    brand: "Sige 3C",
    navHome: "Home",
    navProducts: "In-store",
    navOffers: "Offers",
    navReviews: "Google Reviews",
    navStore: "Store Info",
    heroKicker: "ANIME × CYBER TECH × MOBILE LIFE",
    heroSubtitle: "Mobile Accessories Store",
    heroText: "Visit us for phone accessories, screen protectors, wraps, and audio gear. We help you choose on site.",
    featureQuality: "Quality Picks",
    featureInstall: "Pro Install",
    featureWrap: "Device Wraps",
    featureCare: "Friendly Care",
    heroReviewCta: "Google Rating 4.9",
    heroOfferCta: "View Offers",
    railProducts: "In-store",
    railOffers: "Offers",
    railReviews: "Reviews",
    catWrap: "Wraps",
    catProtector: "Screen Films",
    catCases: "Cases",
    catLens: "Lens Films",
    catPower: "Charging",
    catAudio: "Audio",
    productsTitle: "What We Sell In Store",
    productsNote: "No online shopping here. Visit the store to browse, ask, and try products.",
    serviceRepair: "Repair Service",
    serviceRepairDesc: "On-site checkup with repair and handling suggestions.",
    serviceWrap: "Professional Wraps",
    serviceWrapDesc: "Phone, tablet, and daily-device wrapping with in-store advice.",
    serviceProtector: "Screen Protectors",
    serviceProtectorDesc: "Glass, privacy, lens protection, and installation.",
    serviceCases: "Phone Cases",
    serviceCasesDesc: "Drop-proof, clear, stylish, magnetic, and everyday cases.",
    serviceLens: "Lens Films",
    serviceLensDesc: "Camera lens protection and module accessories.",
    servicePower: "Charging Gear",
    servicePowerDesc: "Cables, chargers, car chargers, magnetic charging, and power banks.",
    serviceBt: "Bluetooth Earbuds",
    serviceBtDesc: "Audio gear for commuting, exercise, and daily use.",
    serviceWired: "Wired Earphones",
    serviceWiredDesc: "Wired earphones, adapters, and audio accessories.",
    serviceWatch: "Apple Watch Gear",
    serviceWatchDesc: "Bands, cases, films, and charging accessories.",
    offersTitle: "Latest Offers",
    featuresTitle: "Why Sige 3C",
    featureQualityDesc: "Selected quality mobile accessories.",
    featureInstallDesc: "Screen protectors, wraps, and in-store service.",
    featureWrapDesc: "Material advice based on your device and usage.",
    featureCareDesc: "Come back anytime for after-service questions.",
    reviewsTitle: "Google Reviews",
    reviewsCount: "From 300+ reviews",
    googleReviewButton: "Open Google Reviews",
    reviewFormTitle: "Leave Your Support",
    reviewFormNote: "Submitting here shows a thank-you message. Use the Google button above for a public review.",
    reviewName: "Name",
    reviewMessage: "Review",
    reviewSubmit: "Submit Review",
    storeTitle: "Store Info",
    storeText: "Visit us for accessories, screen protectors, wraps, and charging gear.",
    storeMap: "Navigate to store",
    storePhone: "Call us now",
    storeFacebook: "Follow updates",
    storeGoogle: "View and leave reviews",
    thanksTitle: "Thank you for your support",
    thanksText: "We received your encouragement and look forward to serving you again.",
    footerText: "Accessories, wraps, screen protectors, and in-store service"
  }
};

const chatLines = {
  zh: [
    "需要我推薦適合你的手機殼嗎？",
    "保護貼現場安裝，快速完成。",
    "專業包膜優惠中，歡迎到店詢問。",
    "想找充電配件或耳機也可以現場看。"
  ],
  en: [
    "Need help choosing a phone case?",
    "Screen protector installation is available in store.",
    "Device wrap offers are available now.",
    "Charging gear and earbuds are ready to browse."
  ]
};

const defaultOffers = [
  { label: "WRAP", title: "包膜優惠", desc: "手機包膜與保護服務，歡迎到店詢問。" },
  { label: "GIFT", title: "滿額贈禮", desc: "消費滿額送精美小禮。" },
  { label: "VIP", title: "會員專屬", desc: "會員最高 88 折扣。" }
];

let language = localStorage.getItem("sige3c-lang") || "zh";
let chatIndex = 0;
let particles = [];

menuButton?.addEventListener("click", () => {
  body.classList.toggle("menu-open");
});

document.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  layers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0);
    layer.style.setProperty("--mx", `${x * depth * 28}px`);
    layer.style.setProperty("--my", `${y * depth * 20}px`);
  });
});

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language === "zh" ? "zh-Hant-TW" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = translations[language][key];
  });
  if (langToggle) langToggle.textContent = language === "zh" ? "EN" : "中";
  if (chatBubble) chatBubble.textContent = chatLines[language][chatIndex % chatLines[language].length];
  localStorage.setItem("sige3c-lang", language);
}

langToggle?.addEventListener("click", () => {
  applyLanguage(language === "zh" ? "en" : "zh");
});

setInterval(() => {
  if (!chatBubble) return;
  chatIndex = (chatIndex + 1) % chatLines[language].length;
  chatBubble.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 420, easing: "ease-out" }
  );
  window.setTimeout(() => {
    chatBubble.textContent = chatLines[language][chatIndex];
  }, 190);
}, 3600);

function renderOffers(offers) {
  offers.slice(0, 3).forEach((offer, index) => {
    const label = document.querySelector(`[data-offer-label="${index}"]`);
    const title = document.querySelector(`[data-offer-title="${index}"]`);
    const desc = document.querySelector(`[data-offer-desc="${index}"]`);
    if (label) label.textContent = offer.label;
    if (title) title.textContent = offer.title;
    if (desc) desc.textContent = offer.desc || offer.description;
  });
}

async function loadOffers() {
  try {
    const response = await fetch("./api/offers", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Offer API unavailable");
    const payload = await response.json();
    renderOffers(payload.offers?.length ? payload.offers : defaultOffers);
  } catch {
    renderOffers(defaultOffers);
  }
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * ratio);
  canvas.height = Math.floor(canvas.clientHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(100, Math.floor(window.innerWidth / 16)) }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    speed: 0.25 + Math.random() * 0.9,
    size: 1 + Math.random() * 2.4,
    alpha: 0.18 + Math.random() * 0.55
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.y * 0.01) * 0.18;
    if (particle.y < -12) {
      particle.y = canvas.clientHeight + 12;
      particle.x = Math.random() * canvas.clientWidth;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 38, 56, ${particle.alpha})`;
    ctx.shadowColor = "rgba(255, 38, 56, .9)";
    ctx.shadowBlur = 12;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

function updateScrollHud() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function setupReveal() {
  const cards = [...document.querySelectorAll(".reveal-card, .reveal-ready")];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty("--delay", `${index * 80}ms`);
    });
  });

  cards.forEach((card) => observer.observe(card));
}

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  thankYou.hidden = false;
  reviewForm.reset();
});

closeThankYou?.addEventListener("click", () => {
  thankYou.hidden = true;
});

thankYou?.addEventListener("click", (event) => {
  if (event.target === thankYou) thankYou.hidden = true;
});

document.querySelectorAll('a[href*="google.com/maps"]').forEach((link) => {
  link.href = googleReviewUrl;
});

resizeCanvas();
drawParticles();
setupReveal();
applyLanguage(language);
loadOffers();
updateScrollHud();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", updateScrollHud, { passive: true });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  });
}
