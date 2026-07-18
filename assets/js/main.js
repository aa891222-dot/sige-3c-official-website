const body = document.body;
const menuButton = document.querySelector("[data-menu-button]");
const langToggle = document.querySelector("[data-lang-toggle]");
const chatBubble = document.querySelector("[data-chat-bubble]");
const layers = [...document.querySelectorAll(".layer")];
const canvas = document.querySelector("[data-particles]");
const ctx = canvas?.getContext("2d");
const progressBar = document.querySelector("[data-scroll-progress]");
const reviewForm = document.querySelector("[data-review-form]");
const thankYou = document.querySelector("[data-thank-you]");
const closeThankYou = document.querySelector("[data-close-thank-you]");
const promoCarousel = document.querySelector("[data-promo-carousel]");
const promoTrack = document.querySelector("[data-promo-track]");
const promoPrev = document.querySelector("[data-promo-prev]");
const promoNext = document.querySelector("[data-promo-next]");
const promoDots = document.querySelector("[data-promo-dots]");
const productList = document.querySelector("[data-product-list]");
const categoryTabs = document.querySelector("[data-category-tabs]");
const cartPanel = document.querySelector("[data-cart-panel]");
const cartToggle = document.querySelector("[data-cart-toggle]");
const cartClose = document.querySelector("[data-cart-close]");
const cartCount = document.querySelector("[data-cart-count]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const checkoutForm = document.querySelector("[data-checkout-form]");
const checkoutStatus = document.querySelector("[data-checkout-status]");
const shippingAddress = document.querySelector("[data-shipping-address]");
const announcement = document.querySelector("[data-announcement]");
const announcementTitle = document.querySelector("[data-announcement-title]");
const announcementText = document.querySelector("[data-announcement-text]");
const adMarquee = document.querySelector("[data-ad-marquee]");
const adMarqueeLabels = [...document.querySelectorAll("[data-ad-marquee-label]")];
const adMarqueeTexts = [...document.querySelectorAll("[data-ad-marquee-text]")];
const lineLinks = [...document.querySelectorAll("[data-line-link]")];
const lineLabels = [...document.querySelectorAll("[data-line-label]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = navigator.connection?.saveData === true;

const googleReviewUrl = "https://www.google.com/search?q=%E5%9B%9B%E5%93%A53C%20%E6%89%8B%E6%A9%9F%E9%85%8D%E4%BB%B6%20%E8%A9%95%E8%AB%96";
const googleMapUrl = "https://maps.app.goo.gl/wZMD5sJQXV1rrDbW6?g_st=ic";
const facebookUrl = "https://www.facebook.com/share/1BZJysJbQC/?mibextid=wwXIfr";
const defaultLineUrl = "https://line.me/R/ti/p/@sige3c";
const money = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });

const translations = {
  zh: {
    skip: "跳到主要內容",
    brand: "四哥3C",
    navHome: "首頁",
    navProducts: "現場商品",
    navShop: "線上購物",
    navAnnouncement: "公告",
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
    heroShopCta: "線上預訂商品",
    bubbleCat: "喵～現場看看！",
    bubbleDog: "包膜優惠中！",
    railProducts: "現場商品",
    railShop: "線上購物",
    railAnnouncement: "公告",
    railOffers: "最新優惠",
    railReviews: "Google 評論",
    catWrap: "專業包膜",
    catProtector: "保護貼",
    catCases: "手機殼",
    catLens: "鏡頭貼",
    catPower: "充電配件",
    catAudio: "耳機配件",
    productsTitle: "現場有賣什麼商品",
    productsNote: "可先線上預訂已上架商品；其他配件歡迎到店挑選、詢問與體驗。",
    shopTitle: "線上預訂商品",
    shopNote: "送出訂單後，門市會依資料與你確認；有問題也可以直接加官方 LINE 聯絡。",
    catAll: "全部",
    shopCatCable: "充電線",
    shopCatCharger: "充電頭",
    shopCatPowerbank: "行動電源",
    cartOpen: "購物車",
    cartTitle: "購物車",
    cartTotal: "總計",
    orderName: "姓名",
    orderPhone: "電話",
    orderLine: "LINE ID（選填）",
    orderNote: "備註（選填）",
    orderSubmit: "送出訂單",
    deliveryMethod: "送貨方式",
    deliveryPickup: "到門市領取",
    deliveryShipping: "寄貨",
    shippingAddress: "寄送地址",
    paymentMethod: "付款方式",
    paymentLinePay: "LINE Pay",
    paymentTransfer: "轉帳",
    productsLoading: "正在載入商品...",
    productsLoadingNote: "請稍候，系統正在讀取最新庫存與價格。",
    addToCart: "加入購物車",
    soldOut: "暫無庫存",
    emptyCart: "購物車是空的。",
    orderSuccess: "訂單已送出，門市會再與你確認。",
    orderEmpty: "請先加入商品。",
    stockLabel: "庫存",
    saleLabel: "優惠",
    checkoutSending: "訂單送出中...",
    chooseOptions: "選擇規格",
    addOnTitle: "加購商品",
    selectedOptions: "已選規格",
    productCode: "商品編號",
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
    reviewOneName: "林先生",
    reviewOneText: "服務超棒，手機殼款式很多，店員很專業！",
    reviewTwoName: "陳小姐",
    reviewTwoText: "貼膜技術一流，價格實在，會再回訪。",
    reviewThreeName: "黃先生",
    reviewThreeText: "品質很好，現場說明清楚，強力推薦！",
    reviewFormTitle: "留下你的支持",
    reviewFormNote: "送出後會顯示感謝訊息；若要公開評論，請使用上方 Google 評論按鈕。",
    reviewName: "姓名",
    reviewMessage: "評論內容",
    reviewNamePlaceholder: "王先生",
    reviewMessagePlaceholder: "服務很好，會再回訪！",
    reviewSubmit: "送出評論",
    storeTitle: "門市資訊",
    storeText: "歡迎來店挑選手機配件、保護貼、包膜與充電周邊。",
    storeMapTitle: "Google 地圖",
    storeMap: "一鍵導航到店",
    storePhone: "立即來電詢問",
    storeFacebook: "追蹤最新活動",
    storeGoogleTitle: "Google 評論",
    storeGoogle: "查看與留下評論",
    thanksTitle: "謝謝您的支持",
    thanksText: "你的鼓勵我們收到了，期待下次再為你服務。",
    footerText: "手機配件、包膜、保護貼與現場服務"
  },
  en: {
    skip: "Skip to content",
    brand: "Sige 3C",
    navHome: "Home",
    navProducts: "In-store Goods",
    navShop: "Shop",
    navAnnouncement: "News",
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
    heroShopCta: "Pre-order Online",
    bubbleCat: "Meow, come browse!",
    bubbleDog: "Wrap offers now!",
    railProducts: "Goods",
    railShop: "Shop",
    railAnnouncement: "News",
    railOffers: "Offers",
    railReviews: "Reviews",
    catWrap: "Wraps",
    catProtector: "Screen Films",
    catCases: "Phone Cases",
    catLens: "Lens Films",
    catPower: "Charging",
    catAudio: "Audio",
    productsTitle: "What We Sell In Store",
    productsNote: "Available products can be pre-ordered online. Visit us for other accessories.",
    shopTitle: "Online Pre-order",
    shopNote: "The store will confirm after submission. You can also contact the official LINE anytime.",
    catAll: "All",
    shopCatCable: "Cables",
    shopCatCharger: "Chargers",
    shopCatPowerbank: "Power Banks",
    cartOpen: "Cart",
    cartTitle: "Cart",
    cartTotal: "Total",
    orderName: "Name",
    orderPhone: "Phone",
    orderLine: "LINE ID (optional)",
    orderNote: "Note (optional)",
    orderSubmit: "Submit Order",
    deliveryMethod: "Delivery",
    deliveryPickup: "Store pickup",
    deliveryShipping: "Shipping",
    shippingAddress: "Shipping address",
    paymentMethod: "Payment",
    paymentLinePay: "LINE Pay",
    paymentTransfer: "Bank transfer",
    productsLoading: "Loading products...",
    productsLoadingNote: "Please wait while we load the latest prices and stock.",
    addToCart: "Add to Cart",
    soldOut: "Sold Out",
    emptyCart: "Your cart is empty.",
    orderSuccess: "Order submitted. The store will contact you for confirmation.",
    orderEmpty: "Please add a product first.",
    stockLabel: "Stock",
    saleLabel: "Sale",
    checkoutSending: "Submitting order...",
    chooseOptions: "Choose Options",
    addOnTitle: "Add-ons",
    selectedOptions: "Selected",
    productCode: "SKU",
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
    reviewOneName: "Mr. Lin",
    reviewOneText: "Great service, lots of phone cases, and very professional staff.",
    reviewTwoName: "Ms. Chen",
    reviewTwoText: "Excellent screen protector installation, fair pricing, and I will visit again.",
    reviewThreeName: "Mr. Huang",
    reviewThreeText: "Great quality, clear explanations, highly recommended.",
    reviewFormTitle: "Leave Your Support",
    reviewFormNote: "Submitting here shows a thank-you message. Use the Google button above for a public review.",
    reviewName: "Name",
    reviewMessage: "Review",
    reviewNamePlaceholder: "Your name",
    reviewMessagePlaceholder: "Great service. I will visit again!",
    reviewSubmit: "Submit Review",
    storeTitle: "Store Info",
    storeText: "Visit us for accessories, screen protectors, wraps, and charging gear.",
    storeMapTitle: "Google Maps",
    storeMap: "Navigate to store",
    storePhone: "Call us now",
    storeFacebook: "Follow updates",
    storeGoogleTitle: "Google Reviews",
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
  {
    label: "WRAP",
    title: { zh: "包膜優惠", en: "Wrap Offer" },
    desc: { zh: "手機包膜與保護服務，歡迎到店詢問。", en: "Phone wrap and protection service. Ask us in store." }
  },
  {
    label: "GIFT",
    title: { zh: "滿額贈禮", en: "Gift With Purchase" },
    desc: { zh: "消費滿額送精美小禮。", en: "Get a small gift when your purchase reaches the offer amount." }
  },
  {
    label: "VIP",
    title: { zh: "會員專屬", en: "Member Special" },
    desc: { zh: "會員最高 88 折扣。", en: "Members can receive up to 12% off." }
  }
];

const defaultProducts = [
  {
    id: 1,
    sku: "CB-C2C-60W",
    name: "Type-C to Type-C 快充線 60W",
    category: "cable",
    price: 290,
    salePrice: 250,
    stock: 12,
    description: "支援快充，適合 Android、iPad 與 Type-C 裝置。",
    imageUrl: "./assets/images/concept-design.jpeg",
    gallery: ["./assets/images/concept-design.jpeg", "./assets/images/homepage-visual.jpg"],
    colors: ["黑色", "鈦色", "藍色"],
    models: ["Type-C to Type-C", "Type-C to Lightning", "Lightning to USB"],
    specs: ["60公分", "120公分"],
    variantPrices: [
      { model: "Lightning to USB", spec: "60公分", price: 290 },
      { model: "Lightning to USB", spec: "120公分", price: 590 },
      { model: "Type-C to Type-C", spec: "60公分", price: 290 },
      { model: "Type-C to Type-C", spec: "120公分", price: 490 },
      { model: "Type-C to Lightning", spec: "60公分", price: 350 },
      { model: "Type-C to Lightning", spec: "120公分", price: 590 }
    ],
    addOns: [{ name: "線材保護套", price: 49 }, { name: "收納束帶", price: 29 }]
  },
  {
    id: 2,
    sku: "CB-LTG-USB",
    name: "Lightning 充電線",
    category: "cable",
    price: 250,
    salePrice: null,
    stock: 10,
    description: "iPhone 常用備用線，居家、公司、車上都方便。",
    imageUrl: "./assets/images/homepage-visual.jpg",
    gallery: ["./assets/images/homepage-visual.jpg"],
    colors: ["白色", "黑色"],
    models: ["Lightning to USB", "Type-C to Lightning"],
    specs: ["1米", "2米"],
    addOns: [{ name: "線材保護套", price: 49 }]
  },
  {
    id: 3,
    sku: "CH-20W-PD",
    name: "PD 20W 快充頭",
    category: "charger",
    price: 390,
    salePrice: 350,
    stock: 8,
    description: "小體積快充頭，適合日常快速補電。",
    imageUrl: "./assets/images/hero-main.jpg",
    gallery: ["./assets/images/hero-main.jpg"],
    colors: ["白色", "黑色"],
    models: ["單孔 PD", "迷你款"],
    specs: ["20W"],
    addOns: [{ name: "Type-C 快充線加購", price: 199 }]
  },
  {
    id: 4,
    sku: "CH-35W-DUAL",
    name: "雙孔 35W 充電頭",
    category: "charger",
    price: 590,
    salePrice: null,
    stock: 6,
    description: "雙裝置同時充電，手機與耳機一起補電。",
    imageUrl: "./assets/images/hero-store-bg.webp",
    gallery: ["./assets/images/hero-store-bg.webp"],
    colors: ["白色", "黑色"],
    models: ["雙孔 USB-C", "USB-C + USB-A"],
    specs: ["35W"],
    addOns: [{ name: "快充線組合價", price: 250 }]
  },
  {
    id: 5,
    sku: "PB-10000",
    name: "10000mAh 行動電源",
    category: "powerbank",
    price: 790,
    salePrice: 690,
    stock: 5,
    description: "通勤與外出常備容量，輕巧好攜帶。",
    imageUrl: "./assets/images/homepage-visual-hq.jpg",
    gallery: ["./assets/images/homepage-visual-hq.jpg"],
    colors: ["黑色", "白色"],
    models: ["標準版", "磁吸版"],
    specs: ["10000mAh"],
    addOns: [{ name: "短線加購", price: 99 }]
  },
  {
    id: 6,
    sku: "PB-20000",
    name: "20000mAh 大容量行動電源",
    category: "powerbank",
    price: 1190,
    salePrice: null,
    stock: 3,
    description: "旅行與長時間外出適用，續航更安心。",
    imageUrl: "./assets/images/homepage-visual-original.jpg",
    gallery: ["./assets/images/homepage-visual-original.jpg"],
    colors: ["黑色", "白色"],
    models: ["標準版", "大輸出版"],
    specs: ["20000mAh"],
    addOns: [{ name: "快充頭加購", price: 299 }]
  }
];

const offerTranslations = {
  "包膜優惠": "Wrap Offer",
  "手機包膜與保護服務，歡迎到店詢問。": "Phone wrap and protection service. Ask us in store.",
  "滿額贈禮": "Gift With Purchase",
  "消費滿額送精美小禮。": "Get a small gift when your purchase reaches the offer amount.",
  "會員專屬": "Member Special",
  "會員最高 88 折扣。": "Members can receive up to 12% off."
};

const defaultProductCategories = [
  { id: "cable", label: "充電線", labelEn: "Cables" },
  { id: "charger", label: "充電頭", labelEn: "Chargers" },
  { id: "powerbank", label: "行動電源", labelEn: "Power Banks" },
  { id: "protector", label: "保護貼", labelEn: "Screen Protectors" },
  { id: "phonecase", label: "手機殼", labelEn: "Phone Cases" }
];

const defaultSettings = {
  announcementActive: 1,
  announcementTitle: "門市公告",
  announcementText: "歡迎加入 LINE 詢問商品庫存、顏色與取貨方式。",
  marqueeActive: 1,
  marqueeLabel: "暑假限定",
  marqueeText: "手持風扇優惠準備開跑，炎炎夏日一起涼一下。歡迎加官方 LINE 詢問現貨與活動內容。",
  lineLabel: "加入 LINE 詢問",
  lineUrl: defaultLineUrl,
  productCategories: defaultProductCategories
};

let language = localStorage.getItem("sige3c-lang") || "zh";
let chatIndex = 0;
let particles = [];
let currentOffers = defaultOffers;
let currentProducts = defaultProducts;
let currentSettings = defaultSettings;
let currentProductCategories = defaultProductCategories;
let activeCategory = "all";
let selectedProductOptions = {};
let cart = JSON.parse(localStorage.getItem("sige3c-cart") || "[]");
let pointerFrame = 0;
let pendingPointer = null;
let particleFrame = 0;
let scrollFrame = 0;
let promoIndex = 0;
let promoTimer = 0;
let promoInView = false;

menuButton?.addEventListener("click", () => {
  body.classList.toggle("menu-open");
});

function useHeavyEffects() {
  return !reduceMotion && !saveData && window.innerWidth >= 1100;
}

function applyPerformanceMode() {
  body.classList.toggle("performance-lite", !useHeavyEffects());
}

document.addEventListener("pointermove", (event) => {
  if (!useHeavyEffects()) return;
  pendingPointer = { x: event.clientX, y: event.clientY };
  if (pointerFrame) return;

  pointerFrame = requestAnimationFrame(() => {
    const x = (pendingPointer.x / window.innerWidth - 0.5) * 2;
    const y = (pendingPointer.y / window.innerHeight - 0.5) * 2;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.setProperty("--mx", `${x * depth * 18}px`);
      layer.style.setProperty("--my", `${y * depth * 13}px`);
    });
    pointerFrame = 0;
  });
}, { passive: true });

function textFor(value) {
  if (!value) return "";
  if (typeof value === "object") return value[language] || value.zh || value.en || "";
  if (language === "en") return offerTranslations[value] || value;
  return value;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function compactText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/type\s*[-_ ]?\s*c/g, "typec")
    .replace(/iphone|ios|蘋果/g, "lightning")
    .replace(/臺/g, "台")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
}

function normalizeModelValue(value) {
  const text = compactText(value);
  const typecCount = (text.match(/typec/g) || []).length;
  const hasTypeC = typecCount > 0;
  const hasLightning = text.includes("lightning");
  const hasUsb = text.includes("usb");

  if (typecCount >= 2) return "typec-typec";
  if (hasTypeC && hasLightning) return "typec-lightning";
  if (hasLightning && hasUsb) return "lightning-usb";
  if (hasTypeC && hasUsb) return "typec-usb";
  return text;
}

function normalizeSpecValue(value) {
  let text = String(value || "")
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/公分|厘米/g, "cm")
    .replace(/公尺|米/g, "m")
    .replace(/\s+/g, "");
  const centimeters = text.match(/(\d+(?:\.\d+)?)cm/);
  if (centimeters) return `${Number(centimeters[1])}cm`;
  const meters = text.match(/(\d+(?:\.\d+)?)m(?!ah)/);
  if (meters) return `${Number(meters[1]) * 100}cm`;
  return compactText(text);
}

function normalizeVariantValue(key, value) {
  if (key === "model") return normalizeModelValue(value);
  if (key === "spec") return normalizeSpecValue(value);
  return compactText(value);
}

function variantFieldMatches(key, variantValue, selectedValue) {
  if (!variantValue) return true;
  const variant = normalizeVariantValue(key, variantValue);
  const selected = normalizeVariantValue(key, selectedValue);
  return Boolean(variant && selected && variant === selected);
}

function variantPricesFor(product) {
  const value = product.variantPrices ?? product.variant_prices;
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {}
  return [];
}

function matchingVariant(product, options = {}) {
  const variants = variantPricesFor(product).map((variant) => ({
    color: String(variant.color || "").trim(),
    model: String(variant.model || "").trim(),
    spec: String(variant.spec || "").trim(),
    price: Number(variant.price || 0),
    salePrice: variant.salePrice ?? variant.sale_price
  })).filter((variant) => variant.price > 0);

  return variants
    .filter((variant) => {
      return variantFieldMatches("color", variant.color, options.color)
        && variantFieldMatches("model", variant.model, options.model)
        && variantFieldMatches("spec", variant.spec, options.spec);
    })
    .sort((a, b) => {
      const score = (variant) => Number(Boolean(variant.color)) + Number(Boolean(variant.model)) + Number(Boolean(variant.spec));
      return score(b) - score(a);
    })[0] || null;
}

function regularPrice(product, options = {}) {
  const variant = matchingVariant(product, options);
  return Number(variant?.price || product.price || 0);
}

function effectivePrice(product, options = {}) {
  const variant = matchingVariant(product, options);
  const price = regularPrice(product, options);
  const salePrice = variant ? (variant.salePrice ?? variant.sale_price) : (product.salePrice ?? product.sale_price);
  const normalizedSale = salePrice === "" || salePrice === null || salePrice === undefined
    ? 0
    : Number(salePrice || 0);
  return normalizedSale > 0 && normalizedSale < price ? normalizedSale : price;
}

function discountPercent(product, options = {}) {
  const price = regularPrice(product, options);
  const finalPrice = effectivePrice(product, options);
  if (!price || finalPrice >= price) return 0;
  return Math.max(1, Math.round((1 - finalPrice / price) * 100));
}

function ensureArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return String(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function normalizeProductCategories(value) {
  const seen = new Set();
  const categories = ensureArray(value).map((item) => {
    if (typeof item === "string") {
      const [id = "", label = "", labelEn = ""] = item.split("|").map((part) => part.trim());
      return { id, label: label || id, labelEn };
    }

    return {
      id: String(item.id || item.value || "").trim(),
      label: String(item.label || item.name || item.id || "").trim(),
      labelEn: String(item.labelEn || item.label_en || "").trim()
    };
  }).filter((item) => {
    if (!item.id || !item.label || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return categories.length ? categories : defaultProductCategories;
}

function categoryLabel(category) {
  const matched = currentProductCategories.find((item) => item.id === category);
  if (!matched) return category;
  return language === "en" ? (matched.labelEn || matched.label) : matched.label;
}

function renderCategoryTabs() {
  if (!categoryTabs) return;
  const hasActiveCategory = activeCategory === "all" || currentProductCategories.some((item) => item.id === activeCategory);
  if (!hasActiveCategory) activeCategory = "all";

  const tabs = [
    `<button type="button" class="${activeCategory === "all" ? "is-active" : ""}" data-category="all">${translations[language].catAll}</button>`,
    ...currentProductCategories.map((category) => (
      `<button type="button" class="${activeCategory === category.id ? "is-active" : ""}" data-category="${escapeHtml(category.id)}">${escapeHtml(categoryLabel(category.id))}</button>`
    ))
  ];
  categoryTabs.innerHTML = tabs.join("");
}

function addOnsFor(product) {
  const value = product.addOns ?? product.add_ons;
  if (Array.isArray(value)) {
    return value.map((item) => ({
      name: String(item.name || "").trim(),
      price: Math.max(0, Number(item.price || 0))
    })).filter((item) => item.name);
  }
  if (!value) return [];
  try {
    return addOnsFor({ addOns: JSON.parse(value) });
  } catch {}
  return String(value).split(/\r?\n/).map((line) => {
    const [name, price = "0"] = line.split("|").map((item) => item.trim());
    return { name, price: Math.max(0, Number(price || 0)) };
  }).filter((item) => item.name);
}

function quantityDealsFor(product) {
  const value = product.quantityDeals ?? product.quantity_deals;
  const source = Array.isArray(value) ? value : (() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return String(value).split(/\r?\n/);
    }
  })();

  return source.map((item) => {
    if (typeof item === "string") {
      const parts = (item.includes("|") ? item.split("|") : item.split(/\s+/)).map((part) => part.trim());
      return {
        quantity: Math.max(0, Math.round(Number(String(parts[0] || "").replace(/[^\d]/g, "")))),
        price: Math.max(0, Number(String(parts[1] || "").replace(/[^\d.]/g, "")))
      };
    }
    return {
      quantity: Math.max(0, Math.round(Number(item.quantity ?? item.qty ?? item.count ?? 0))),
      price: Math.max(0, Number(item.price || 0))
    };
  }).filter((item) => item.quantity >= 2 && item.price > 0);
}

function subtotalWithQuantityDeals(unitPrice, deals = [], quantity = 1) {
  const qty = Math.max(0, Math.round(Number(quantity || 0)));
  const price = Math.max(0, Number(unitPrice || 0));
  if (!qty || !price) return 0;

  const usableDeals = deals
    .filter((deal) => deal.quantity >= 2 && deal.price > 0 && deal.price < deal.quantity * price)
    .sort((a, b) => b.quantity - a.quantity);

  if (!usableDeals.length) return price * qty;

  const best = Array(qty + 1).fill(Infinity);
  best[0] = 0;
  for (let count = 1; count <= qty; count += 1) {
    best[count] = best[count - 1] + price;
    usableDeals.forEach((deal) => {
      if (count >= deal.quantity) {
        best[count] = Math.min(best[count], best[count - deal.quantity] + deal.price);
      }
    });
  }
  return Math.round(best[qty]);
}

function productQuantityDealLabel(product) {
  const basePrice = effectivePrice(product, productSelection(product));
  const deal = quantityDealsFor(product)
    .filter((item) => item.price < item.quantity * basePrice)
    .sort((a, b) => a.quantity - b.quantity)[0];
  return deal ? `任選 ${deal.quantity} 件 ${money.format(deal.price)}` : "";
}

function productDisplayOrder(product) {
  const order = Math.round(Number(product.displayOrder ?? product.display_order ?? 0));
  return order > 0 ? order : 999999;
}

function sortProductsForDisplay(products = []) {
  return [...products].sort((a, b) => {
    return productDisplayOrder(a) - productDisplayOrder(b)
      || Number(a.id || 0) - Number(b.id || 0);
  });
}

function promoProducts(products = currentProducts) {
  const active = (products || []).filter((product) => {
    return (product.active === undefined || Number(product.active) === 1) && productImage(product);
  });
  const byFeaturedOrder = (a, b) => {
    const orderA = Number(a.featuredOrder ?? a.featured_order ?? 0) || 9999;
    const orderB = Number(b.featuredOrder ?? b.featured_order ?? 0) || 9999;
    return orderA - orderB || productDisplayOrder(a) - productDisplayOrder(b) || Number(a.id || 0) - Number(b.id || 0);
  };
  const featured = active
    .filter((product) => Number(product.featured ?? product.carouselFeatured ?? product.carousel_featured ?? 0) === 1)
    .sort(byFeaturedOrder);
  return (featured.length ? featured : (active.length ? active.sort(byFeaturedOrder) : defaultProducts)).slice(0, 6);
}

function updatePromoCarousel() {
  if (!promoTrack) return;
  const slides = [...promoTrack.querySelectorAll(".promo-slide")];
  if (!slides.length) return;
  promoIndex = (promoIndex + slides.length) % slides.length;
  promoTrack.style.transform = `translateX(${-promoIndex * 100}%)`;
  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === promoIndex);
    slide.setAttribute("aria-hidden", index === promoIndex ? "false" : "true");
  });
  promoDots?.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === promoIndex);
    dot.setAttribute("aria-current", index === promoIndex ? "true" : "false");
  });
}

function startPromoAutoplay() {
  window.clearInterval(promoTimer);
  const slideCount = promoTrack?.querySelectorAll(".promo-slide").length || 0;
  if (reduceMotion || !promoInView || slideCount <= 1) return;
  promoTimer = window.setInterval(() => {
    promoIndex += 1;
    updatePromoCarousel();
  }, 5200);
}

function schedulePromoRender(products = currentProducts) {
  const run = () => renderPromoCarousel(products);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1400 });
    return;
  }
  window.setTimeout(run, 260);
}

function renderPromoCarousel(products = currentProducts) {
  if (!promoCarousel || !promoTrack) return;
  const slides = promoProducts(products);
  if (!slides.length) {
    promoCarousel.hidden = true;
    return;
  }

  promoCarousel.hidden = false;
  if (promoIndex >= slides.length) promoIndex = 0;
  promoTrack.innerHTML = slides.map((product, index) => {
    const selection = productSelection(product);
    const price = regularPrice(product, selection);
    const finalPrice = effectivePrice(product, selection);
    const discount = discountPercent(product, selection);
    const image = productImage(product);
    const deal = productQuantityDealLabel(product);
    return `
      <article class="promo-slide ${index === promoIndex ? "is-active" : ""}" aria-hidden="${index === promoIndex ? "false" : "true"}">
        <div class="promo-copy">
          <p class="eyebrow">${escapeHtml(categoryName(product.category))}</p>
          <h2>${escapeHtml(product.name || "四哥3C 精選商品")}</h2>
          <p>${escapeHtml(product.description || "精選手機配件，歡迎線上預訂或加官方 LINE 詢問。")}</p>
          ${deal ? `<span class="promo-deal">${escapeHtml(deal)}</span>` : ""}
          <div class="promo-price">
            <strong>${money.format(finalPrice)}</strong>
            ${discount ? `<s>${money.format(price)}</s><em>優惠 -${discount}%</em>` : ""}
          </div>
          <a class="primary-button pulse-button" href="#shop">查看線上商品</a>
        </div>
        <div class="promo-visual">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name || "四哥3C 精選商品")}" loading="lazy" decoding="async" />
        </div>
      </article>
    `;
  }).join("");

  if (promoDots) {
    promoDots.innerHTML = slides.map((_, index) => (
      `<button type="button" class="${index === promoIndex ? "is-active" : ""}" data-promo-dot="${index}" aria-label="第 ${index + 1} 張商品"></button>`
    )).join("");
  }
  updatePromoCarousel();
  startPromoAutoplay();
}

function imageSrc(value) {
  const src = String(value || "").trim();
  if (!src) return "";
  if (src.startsWith("./api/image") || src.startsWith("/api/image")) return src;
  if (src.startsWith("api/image")) return `./${src}`;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
  if (src.startsWith("products/")) return `./api/image?key=${encodeURIComponent(src)}`;
  return src;
}

function productImage(product) {
  return imageSrc(product.imageUrl || product.image_url || ensureArray(product.gallery)[0] || "");
}

function optionImageKey(value) {
  const text = compactText(value);
  if (text.includes("color") || text.includes("colour") || text.includes("顏色") || text.includes("颜色")) return "color";
  if (text.includes("model") || text.includes("type") || text.includes("型號") || text.includes("型号")) return "model";
  if (text.includes("spec") || text.includes("size") || text.includes("規格") || text.includes("规格") || text.includes("長度") || text.includes("长度")) return "spec";
  if (["color", "model", "spec"].includes(text)) return text;
  return "";
}

function optionImageEntries(product) {
  const source = product.optionImages ?? product.option_images;
  return ensureArray(source).map((item) => {
    if (typeof item === "string") {
      const parts = item.split("|").map((part) => part.trim()).filter(Boolean);
      if (parts.length >= 3) {
        return {
          key: optionImageKey(parts[0]),
          value: parts[1],
          image: imageSrc(parts.slice(2).join("|"))
        };
      }
      if (parts.length === 2) {
        return {
          key: "color",
          value: parts[0],
          image: imageSrc(parts[1])
        };
      }
      return null;
    }

    const rawKey = item.optionType || item.option_type || item.type || item.key || item.field
      || (item.color ? "color" : item.model ? "model" : item.spec ? "spec" : "");
    return {
      key: optionImageKey(rawKey) || rawKey,
      value: String(item.optionValue || item.option_value || item.value || item.name || item.color || item.model || item.spec || "").trim(),
      image: imageSrc(item.imageUrl || item.image_url || item.url || item.image || "")
    };
  }).filter((item) => item && item.key && item.value && item.image);
}

function matchingOptionImage(product, selection = {}) {
  const matched = optionImageEntries(product).find((entry) => {
    return selection[entry.key] && variantFieldMatches(entry.key, entry.value, selection[entry.key]);
  });
  return matched?.image || "";
}

function selectedProductImage(product, selection = productSelection(product)) {
  return matchingOptionImage(product, selection) || productImage(product);
}

function productGallery(product, selection = productSelection(product)) {
  const selected = selectedProductImage(product, selection);
  const main = productImage(product);
  const gallery = ensureArray(product.gallery).map(imageSrc);
  const optionImages = optionImageEntries(product).map((item) => item.image);
  return [...new Set([selected, main, ...gallery, ...optionImages].filter(Boolean))];
}

function optionGroups(product) {
  return [
    { key: "color", label: "顏色", values: ensureArray(product.colors) },
    { key: "model", label: "型號", values: ensureArray(product.models) },
    { key: "spec", label: "規格", values: ensureArray(product.specs) }
  ].filter((group) => group.values.length);
}

function productSelection(product) {
  const groups = optionGroups(product);
  const saved = selectedProductOptions[product.id] || {};
  const selection = {};
  groups.forEach((group) => {
    if (saved[group.key] && group.values.includes(saved[group.key])) {
      selection[group.key] = saved[group.key];
    }
  });
  return selection;
}

function missingOptionGroups(product) {
  const selection = productSelection(product);
  return optionGroups(product).filter((group) => !selection[group.key]);
}

function productOptionsReady(product) {
  return missingOptionGroups(product).length === 0;
}

function optionPrompt(product) {
  const missing = missingOptionGroups(product);
  if (!missing.length) return translations[language].addToCart;
  return `請先選擇${missing.map((group) => group.label).join(" / ")}`;
}

function itemKey(productId, options = {}, addOns = []) {
  return JSON.stringify({
    productId: Number(productId),
    options,
    addOns: addOns.map((item) => `${item.name}:${item.price}`).sort()
  });
}

function optionsSummary(options = {}) {
  return Object.entries(options)
    .filter(([, value]) => value)
    .map(([key, value]) => `${{ color: "顏色", model: "型號", spec: "規格" }[key] || key}：${value}`)
    .join(" / ");
}

function addonsSubtotal(addOns = []) {
  return addOns.reduce((sum, item) => sum + Number(item.price || 0), 0);
}

function cartItemPricing(item) {
  const quantity = Math.max(0, Math.round(Number(item.quantity || 0)));
  const product = currentProducts.find((productItem) => Number(productItem.id) === Number(item.id));
  const options = item.options || {};
  const addOnUnitPrice = addonsSubtotal(item.addOns || []);
  const baseUnitPrice = product
    ? effectivePrice(product, options)
    : Math.max(0, Number(item.basePrice || item.price || 0) - addOnUnitPrice);
  const deals = product ? quantityDealsFor(product) : (item.quantityDeals || []);
  const regularBaseSubtotal = baseUnitPrice * quantity;
  const baseSubtotal = subtotalWithQuantityDeals(baseUnitPrice, deals, quantity);
  const addOnsTotal = addOnUnitPrice * quantity;
  return {
    unitPrice: baseUnitPrice + addOnUnitPrice,
    subtotal: baseSubtotal + addOnsTotal,
    dealApplied: baseSubtotal < regularBaseSubtotal,
    saved: Math.max(0, regularBaseSubtotal - baseSubtotal)
  };
}

function renderSettings(settings = currentSettings) {
  currentSettings = { ...defaultSettings, ...(settings || {}) };
  currentProductCategories = normalizeProductCategories(currentSettings.productCategories || currentSettings.product_categories);
  const active = Number(currentSettings.announcementActive ?? currentSettings.announcement_active ?? 1) === 1;
  const marqueeActive = Number(currentSettings.marqueeActive ?? currentSettings.marquee_active ?? 1) === 1;
  const noticeTitle = currentSettings.announcementTitle || currentSettings.announcement_title || defaultSettings.announcementTitle;
  const noticeText = currentSettings.announcementText || currentSettings.announcement_text || defaultSettings.announcementText;
  const marqueeLabel = currentSettings.marqueeLabel || currentSettings.marquee_label || defaultSettings.marqueeLabel;
  const marqueeText = currentSettings.marqueeText || currentSettings.marquee_text || defaultSettings.marqueeText;
  if (announcement) announcement.hidden = !active;
  if (adMarquee) adMarquee.hidden = !marqueeActive;
  if (announcementTitle) announcementTitle.textContent = noticeTitle;
  if (announcementText) announcementText.textContent = noticeText;
  adMarqueeLabels.forEach((item) => {
    item.textContent = marqueeLabel;
  });
  adMarqueeTexts.forEach((item) => {
    item.textContent = marqueeText;
  });

  const lineUrl = currentSettings.lineUrl || currentSettings.line_url || defaultLineUrl;
  const lineLabel = currentSettings.lineLabel || currentSettings.line_label || defaultSettings.lineLabel;
  lineLinks.forEach((link) => {
    link.href = lineUrl || "#store";
    if (lineUrl && lineUrl !== "#store") link.target = "_blank";
  });
  lineLabels.forEach((label) => {
    label.textContent = lineLabel;
  });
  renderProducts(currentProducts);
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language === "zh" ? "zh-Hant-TW" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = translations[language][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (translations[language][key]) element.placeholder = translations[language][key];
  });
  if (langToggle) langToggle.textContent = language === "zh" ? "EN" : "中";
  if (chatBubble) chatBubble.textContent = chatLines[language][chatIndex % chatLines[language].length];
  renderOffers(currentOffers);
  renderSettings(currentSettings);
  renderCart();
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
  currentOffers = offers?.length ? offers : defaultOffers;
  currentOffers.slice(0, 3).forEach((offer, index) => {
    const label = document.querySelector(`[data-offer-label="${index}"]`);
    const title = document.querySelector(`[data-offer-title="${index}"]`);
    const desc = document.querySelector(`[data-offer-desc="${index}"]`);
    if (label) label.textContent = offer.label;
    if (title) title.textContent = textFor(offer.title);
    if (desc) desc.textContent = textFor(offer.desc || offer.description);
  });
}

function categoryName(category) {
  return categoryLabel(category);
}

function renderProducts(products = currentProducts) {
  if (!productList) return;
  renderCategoryTabs();
  currentProducts = sortProductsForDisplay(products?.length ? products : defaultProducts);
  const visibleProducts = currentProducts.filter((product) => {
    const isActive = product.active === undefined || Number(product.active) === 1;
    return isActive && (activeCategory === "all" || product.category === activeCategory);
  });

  productList.innerHTML = visibleProducts.map((product, index) => {
    const stock = Number(product.stock || 0);
    const selection = productSelection(product);
    const optionsReady = productOptionsReady(product);
    const disabled = stock <= 0 || !optionsReady ? "disabled" : "";
    const buttonText = stock <= 0 ? translations[language].soldOut : (optionsReady ? translations[language].addToCart : optionPrompt(product));
    const image = selectedProductImage(product, selection);
    const price = regularPrice(product, selection);
    const finalPrice = effectivePrice(product, selection);
    const discount = discountPercent(product, selection);
    const groups = optionGroups(product);
    const addOns = addOnsFor(product);
    const quantityDeal = productQuantityDealLabel(product);
    const gallery = productGallery(product, selection);
    return `
      <article class="product-card reveal-card is-visible" data-product-card="${product.id}" style="--delay:${index * 60}ms">
        <div class="product-image">
          ${image ? `<img data-product-main-image src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" />` : `<span>SIGE 3C</span>`}
        </div>
        ${gallery.length > 1 ? `<div class="product-thumbs">${gallery.map((src) => `<button type="button" class="${src === image ? "is-active" : ""}" data-product-image="${escapeHtml(src)}" aria-label="切換商品圖片"><img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" /></button>`).join("")}</div>` : ""}
        <span class="product-tag">${categoryName(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <small class="product-sku">${translations[language].productCode}：${escapeHtml(product.sku || "")}</small>
        <p>${escapeHtml(product.description || "")}</p>
        ${quantityDeal ? `<div class="quantity-deal-row" data-quantity-deal>${escapeHtml(quantityDeal)}</div>` : ""}
        ${groups.length ? `
          <div class="product-options">
            <strong>${translations[language].chooseOptions}</strong>
            <small class="option-required" data-option-required ${optionsReady ? "hidden" : ""}>${escapeHtml(optionPrompt(product))}</small>
            ${groups.map((group) => `
              <div class="option-group" data-option-group="${group.key}">
                <span>${group.label}</span>
                <div>
                  ${group.values.map((value) => `<button type="button" data-option-value="${escapeHtml(value)}" class="${selection[group.key] === value ? "is-active" : ""}">${escapeHtml(value)}</button>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}
        ${addOns.length ? `
          <div class="add-on-group">
            <strong>${translations[language].addOnTitle}</strong>
            ${addOns.map((item, itemIndex) => `
              <label>
                <input type="checkbox" data-addon-index="${itemIndex}" />
                <span>${escapeHtml(item.name)} +${money.format(item.price)}</span>
              </label>
            `).join("")}
          </div>
        ` : ""}
        <div class="product-meta">
          <div class="price-row">
            <strong>${money.format(finalPrice)}</strong>
            ${discount ? `<s>${money.format(price)}</s><em>${translations[language].saleLabel} -${discount}%</em>` : ""}
          </div>
          <span>${translations[language].stockLabel} ${stock}</span>
        </div>
        <button class="secondary-button" type="button" data-add-product="${product.id}" ${disabled}>${buttonText}</button>
      </article>
    `;
  }).join("") || `
    <article class="product-card reveal-card is-visible">
      <span class="product-tag">準備中</span>
      <h3>暫時還未上架</h3>
      <p>新品整理中，請再等等。也可以先加官方 LINE 詢問。</p>
    </article>
  `;
}

function updateProductCardPricing(card, product) {
  if (!card || !product) return;
  const selection = productSelection(product);
  const price = regularPrice(product, selection);
  const finalPrice = effectivePrice(product, selection);
  const discount = discountPercent(product, selection);
  const priceRow = card.querySelector(".price-row");
  if (priceRow) {
    priceRow.innerHTML = `
      <strong>${money.format(finalPrice)}</strong>
      ${discount ? `<s>${money.format(price)}</s><em>${translations[language].saleLabel} -${discount}%</em>` : ""}
    `;
  }

  const quantityDeal = productQuantityDealLabel(product);
  let dealRow = card.querySelector("[data-quantity-deal]");
  if (quantityDeal && !dealRow) {
    dealRow = document.createElement("div");
    dealRow.className = "quantity-deal-row";
    dealRow.dataset.quantityDeal = "";
    const anchor = card.querySelector(".product-options, .add-on-group, .product-meta");
    card.insertBefore(dealRow, anchor || null);
  }
  if (dealRow) {
    dealRow.textContent = quantityDeal;
    dealRow.hidden = !quantityDeal;
  }
}

function setProductCardImage(card, src, alt = "") {
  if (!card || !src) return;
  const imageBox = card.querySelector(".product-image");
  if (!imageBox) return;
  let image = imageBox.querySelector("[data-product-main-image]");
  if (!image) {
    imageBox.textContent = "";
    image = document.createElement("img");
    image.dataset.productMainImage = "";
    image.loading = "lazy";
    image.decoding = "async";
    imageBox.appendChild(image);
  }
  imageBox.classList.remove("is-empty");
  image.src = src;
  image.alt = alt;
  card.querySelectorAll("[data-product-image]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.productImage === src);
  });
}

function updateProductCardImage(card, product) {
  if (!card || !product) return;
  const image = selectedProductImage(product, productSelection(product));
  if (image) setProductCardImage(card, image, product.name || "");
}

function updateProductCardControls(card, product) {
  if (!card || !product) return;
  const button = card.querySelector("[data-add-product]");
  const hint = card.querySelector("[data-option-required]");
  const stock = Number(product.stock || 0);
  const ready = productOptionsReady(product);
  if (button) {
    button.disabled = stock <= 0 || !ready;
    button.textContent = stock <= 0 ? translations[language].soldOut : (ready ? translations[language].addToCart : optionPrompt(product));
  }
  if (hint) {
    hint.hidden = ready;
    hint.textContent = optionPrompt(product);
  }
}

function saveCart() {
  localStorage.setItem("sige3c-cart", JSON.stringify(cart));
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + cartItemPricing(item).subtotal, 0);
}

function renderCart() {
  if (!cartItems || !cartCount || !cartTotal) return;
  cart = cart.map((item) => ({
    ...item,
    key: item.key || itemKey(item.id, item.options || {}, item.addOns || [])
  }));
  cartCount.textContent = String(cartQuantity());
  cartTotal.textContent = money.format(cartSubtotal());

  if (!cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">${translations[language].emptyCart}</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const pricing = cartItemPricing(item);
    return `
      <div class="cart-item">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          ${item.options ? `<small>${escapeHtml(optionsSummary(item.options))}</small>` : ""}
          ${item.addOns?.length ? `<small>加購：${escapeHtml(item.addOns.map((addOn) => addOn.name).join("、"))}</small>` : ""}
          <span>${money.format(pricing.unitPrice)} × ${item.quantity}</span>
          ${pricing.dealApplied ? `<small class="cart-deal">數量優惠已套用，省 ${money.format(pricing.saved)}</small>` : ""}
          <small>小計 ${money.format(pricing.subtotal)}</small>
        </div>
        <div class="cart-controls">
          <button type="button" data-cart-minus="${escapeHtml(item.key)}">−</button>
          <button type="button" data-cart-plus="${escapeHtml(item.key)}">＋</button>
          <button type="button" data-cart-remove="${escapeHtml(item.key)}">移除</button>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId, card) {
  const product = currentProducts.find((item) => Number(item.id) === Number(productId));
  if (!product || Number(product.stock || 0) <= 0) return;
  if (!productOptionsReady(product)) {
    updateProductCardControls(card, product);
    card?.querySelector("[data-option-required]")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  const options = productSelection(product);
  const allAddOns = addOnsFor(product);
  const quantityDeals = quantityDealsFor(product);
  const selectedAddOns = card
    ? [...card.querySelectorAll("[data-addon-index]:checked")].map((input) => allAddOns[Number(input.dataset.addonIndex)]).filter(Boolean)
    : [];
  const basePrice = effectivePrice(product, options);
  const unitPrice = basePrice + addonsSubtotal(selectedAddOns);
  const key = itemKey(product.id, options, selectedAddOns);
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity += 1;
  else {
    cart.push({
      key,
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: unitPrice,
      basePrice,
      originalPrice: regularPrice(product, options),
      quantityDeals,
      options,
      addOns: selectedAddOns,
      quantity: 1
    });
  }
  saveCart();
  renderCart();
  cartPanel.hidden = false;
}

function updateCartItem(cartKey, delta) {
  const item = cart.find((entry) => entry.key === cartKey);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.key !== cartKey);
  saveCart();
  renderCart();
}

categoryTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category || "all";
  categoryTabs.querySelectorAll("[data-category]").forEach((tab) => {
    tab.classList.toggle("is-active", tab === button);
  });
  renderProducts(currentProducts);
});

promoPrev?.addEventListener("click", () => {
  promoIndex -= 1;
  updatePromoCarousel();
  startPromoAutoplay();
});

promoNext?.addEventListener("click", () => {
  promoIndex += 1;
  updatePromoCarousel();
  startPromoAutoplay();
});

promoDots?.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-promo-dot]");
  if (!dot) return;
  promoIndex = Number(dot.dataset.promoDot || 0);
  updatePromoCarousel();
  startPromoAutoplay();
});

promoCarousel?.addEventListener("mouseenter", () => window.clearInterval(promoTimer));
promoCarousel?.addEventListener("mouseleave", startPromoAutoplay);

productList?.addEventListener("click", (event) => {
  const imageButton = event.target.closest("[data-product-image]");
  if (imageButton) {
    event.preventDefault();
    const card = imageButton.closest("[data-product-card]");
    const product = currentProducts.find((item) => Number(item.id) === Number(card?.dataset.productCard));
    setProductCardImage(card, imageButton.dataset.productImage, product?.name || "");
    return;
  }

  const optionButton = event.target.closest("[data-option-value]");
  if (optionButton) {
    event.preventDefault();
    const card = optionButton.closest("[data-product-card]");
    const group = optionButton.closest("[data-option-group]");
    if (!card || !group) return;
    const productId = card.dataset.productCard;
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;
    optionButton.blur();
    selectedProductOptions[productId] = {
      ...(selectedProductOptions[productId] || {}),
      [group.dataset.optionGroup]: optionButton.dataset.optionValue
    };
    group.querySelectorAll("[data-option-value]").forEach((button) => {
      button.classList.toggle("is-active", button === optionButton);
    });
    const product = currentProducts.find((item) => Number(item.id) === Number(productId));
    updateProductCardPricing(card, product);
    updateProductCardImage(card, product);
    updateProductCardControls(card, product);
    window.scrollTo({ top: scrollTop, left: scrollLeft, behavior: "auto" });
    return;
  }

  const button = event.target.closest("[data-add-product]");
  if (!button) return;
  addToCart(button.dataset.addProduct, button.closest("[data-product-card]"));
});

productList?.addEventListener("error", (event) => {
  const image = event.target.closest("img");
  if (!image) return;
  const thumbList = image.closest(".product-thumbs");
  if (thumbList) {
    (image.closest("[data-product-image]") || image).remove();
    return;
  }
  const imageBox = image.closest(".product-image");
  if (imageBox) {
    imageBox.classList.add("is-empty");
    image.remove();
  }
}, true);

cartToggle?.addEventListener("click", () => {
  cartPanel.hidden = false;
});

cartClose?.addEventListener("click", () => {
  cartPanel.hidden = true;
});

cartPanel?.addEventListener("click", (event) => {
  if (event.target === cartPanel) {
    cartPanel.hidden = true;
    return;
  }
  const minus = event.target.closest("[data-cart-minus]");
  const plus = event.target.closest("[data-cart-plus]");
  const remove = event.target.closest("[data-cart-remove]");
  if (minus) updateCartItem(minus.dataset.cartMinus, -1);
  if (plus) updateCartItem(plus.dataset.cartPlus, 1);
  if (remove) updateCartItem(remove.dataset.cartRemove, -999);
});

checkoutForm?.addEventListener("change", (event) => {
  if (event.target.name !== "deliveryMethod" || !shippingAddress) return;
  const isShipping = event.target.value === "shipping";
  shippingAddress.hidden = !isShipping;
  const input = shippingAddress.querySelector("input");
  if (input) input.required = isShipping;
});

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cart.length) {
    if (checkoutStatus) checkoutStatus.textContent = translations[language].orderEmpty;
    return;
  }

  if (checkoutStatus) checkoutStatus.textContent = translations[language].checkoutSending;
  const form = new FormData(checkoutForm);

  try {
    const response = await fetch("./api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: String(form.get("name") || "").trim(),
          phone: String(form.get("phone") || "").trim(),
          line: String(form.get("line") || "").trim(),
          deliveryMethod: String(form.get("deliveryMethod") || "pickup"),
          paymentMethod: String(form.get("paymentMethod") || "linepay"),
          shippingAddress: String(form.get("shippingAddress") || "").trim(),
          note: String(form.get("note") || "").trim()
        },
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          options: item.options || {},
          addOns: item.addOns || []
        }))
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "訂單送出失敗");
    cart = [];
    saveCart();
    renderCart();
    checkoutForm.reset();
    if (checkoutStatus) checkoutStatus.textContent = translations[language].orderSuccess;
    if (payload.products?.length) renderProducts(payload.products);
  } catch (error) {
    if (checkoutStatus) checkoutStatus.textContent = error.message || "訂單送出失敗，請改用電話聯絡門市。";
  }
});

async function loadProducts() {
  try {
    const response = await fetch("./api/products", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Product API unavailable");
    const payload = await response.json();
    renderProducts(payload.products?.length ? payload.products : defaultProducts);
  } catch {
    renderProducts(defaultProducts);
  }
  schedulePromoRender(currentProducts);
  renderCart();
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

async function loadSettings() {
  try {
    const response = await fetch("./api/settings", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Settings API unavailable");
    const payload = await response.json();
    renderSettings(payload.settings || defaultSettings);
  } catch {
    renderSettings(defaultSettings);
  }
}

function resizeCanvas() {
  applyPerformanceMode();
  if (!canvas || !ctx) return;
  if (!useHeavyEffects()) {
    particles = [];
    canvas.hidden = true;
    return;
  }
  canvas.hidden = false;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
  canvas.width = Math.floor(canvas.clientWidth * ratio);
  canvas.height = Math.floor(canvas.clientHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(18, Math.floor(window.innerWidth / 84)) }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    speed: 0.18 + Math.random() * 0.45,
    size: 1 + Math.random() * 1.8,
    alpha: 0.16 + Math.random() * 0.36
  }));
  if (!particleFrame) particleFrame = requestAnimationFrame(drawParticles);
}

function drawParticles() {
  if (!canvas || !ctx || !useHeavyEffects()) {
    particleFrame = 0;
    return;
  }
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
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  particleFrame = requestAnimationFrame(drawParticles);
}

function updateScrollHud() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function requestScrollHudUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollHud();
    scrollFrame = 0;
  });
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
      child.style.setProperty("--delay", `${index * 45}ms`);
    });
  });

  cards.forEach((card) => observer.observe(card));
}

function setupPromoVisibility() {
  if (!promoCarousel) return;
  if (!("IntersectionObserver" in window)) {
    promoInView = true;
    startPromoAutoplay();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    promoInView = entries.some((entry) => entry.isIntersecting);
    if (promoInView) {
      startPromoAutoplay();
      return;
    }
    window.clearInterval(promoTimer);
  }, { rootMargin: "180px 0px" });
  observer.observe(promoCarousel);
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

document.querySelectorAll("[data-google-review-link]").forEach((link) => {
  link.href = googleReviewUrl;
});

document.querySelectorAll("[data-google-map-link]").forEach((link) => {
  link.href = googleMapUrl;
});

document.querySelectorAll("[data-facebook-link]").forEach((link) => {
  link.href = facebookUrl;
});

setupReveal();
setupPromoVisibility();
applyLanguage(language);
loadOffers();
loadProducts();
loadSettings();
updateScrollHud();
window.setTimeout(resizeCanvas, 420);

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", requestScrollHudUpdate, { passive: true });

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
