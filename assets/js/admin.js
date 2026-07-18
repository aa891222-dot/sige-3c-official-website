const adminForm = document.querySelector("[data-admin-form]");
const adminStatus = document.querySelector("[data-admin-status]");
const passwordInput = document.querySelector("[data-shared-password]");
const refreshButton = document.querySelector("[data-refresh-admin]");
const productForm = document.querySelector("[data-product-form]");
const productFields = document.querySelector("[data-product-fields]");
const productStatus = document.querySelector("[data-product-status]");
const addProductRow = document.querySelector("[data-add-product-row]");
const categoryListInput = document.querySelector("[data-category-list]");
const settingsForm = document.querySelector("[data-settings-form]");
const settingsStatus = document.querySelector("[data-settings-status]");
const loadOrdersButton = document.querySelector("[data-load-orders]");
const orderStatus = document.querySelector("[data-order-status]");
const ordersList = document.querySelector("[data-orders-list]");

const money = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });

const defaultOffers = [
  { label: "WRAP", title: "包膜優惠", desc: "手機包膜與保護服務，歡迎到店詢問。" },
  { label: "GIFT", title: "滿額贈禮", desc: "消費滿額送精美小禮。" },
  { label: "VIP", title: "會員專屬", desc: "會員最高 88 折扣。" }
];

const defaultProducts = [
  { id: 1, sku: "CB-C2C-60W", name: "Type-C to Type-C 快充線 60W", category: "cable", price: 290, salePrice: 250, stock: 12, description: "支援快充，適合 Android、iPad 與 Type-C 裝置。", imageUrl: "./assets/images/concept-design.jpeg", gallery: ["./assets/images/concept-design.jpeg"], colors: ["黑色", "鈦色", "藍色"], models: ["Type-C to Type-C", "Type-C to Lightning", "Lightning to USB"], specs: ["60公分", "120公分"], variantPrices: [{ model: "Lightning to USB", spec: "60公分", price: 290 }, { model: "Lightning to USB", spec: "120公分", price: 590 }], addOns: [{ name: "線材保護套", price: 49 }], active: 1 },
  { id: 2, sku: "CB-LTG-USB", name: "Lightning 充電線", category: "cable", price: 250, salePrice: null, stock: 10, description: "iPhone 常用備用線，居家、公司、車上都方便。", imageUrl: "./assets/images/homepage-visual.jpg", gallery: ["./assets/images/homepage-visual.jpg"], colors: ["白色", "黑色"], models: ["Lightning to USB"], specs: ["1米", "2米"], addOns: [{ name: "線材保護套", price: 49 }], active: 1 },
  { id: 3, sku: "CH-20W-PD", name: "PD 20W 快充頭", category: "charger", price: 390, salePrice: 350, stock: 8, description: "小體積快充頭，適合日常快速補電。", imageUrl: "./assets/images/hero-main.jpg", gallery: ["./assets/images/hero-main.jpg"], colors: ["白色", "黑色"], models: ["單孔 PD"], specs: ["20W"], addOns: [{ name: "Type-C 快充線加購", price: 199 }], active: 1 },
  { id: 4, sku: "CH-35W-DUAL", name: "雙孔 35W 充電頭", category: "charger", price: 590, salePrice: null, stock: 6, description: "雙裝置同時充電，手機與耳機一起補電。", imageUrl: "./assets/images/hero-store-bg.webp", gallery: ["./assets/images/hero-store-bg.webp"], colors: ["白色", "黑色"], models: ["雙孔 USB-C"], specs: ["35W"], addOns: [{ name: "快充線組合價", price: 250 }], active: 1 },
  { id: 5, sku: "PB-10000", name: "10000mAh 行動電源", category: "powerbank", price: 790, salePrice: 690, stock: 5, description: "通勤與外出常備容量，輕巧好攜帶。", imageUrl: "./assets/images/homepage-visual-hq.jpg", gallery: ["./assets/images/homepage-visual-hq.jpg"], colors: ["黑色", "白色"], models: ["標準版", "磁吸版"], specs: ["10000mAh"], addOns: [{ name: "短線加購", price: 99 }], active: 1 },
  { id: 6, sku: "PB-20000", name: "20000mAh 大容量行動電源", category: "powerbank", price: 1190, salePrice: null, stock: 3, description: "旅行與長時間外出適用，續航更安心。", imageUrl: "./assets/images/homepage-visual-original.jpg", gallery: ["./assets/images/homepage-visual-original.jpg"], colors: ["黑色", "白色"], models: ["標準版"], specs: ["20000mAh"], addOns: [{ name: "快充頭加購", price: 299 }], active: 1 }
];

const defaultSettings = {
  announcementActive: 1,
  announcementTitle: "門市公告",
  announcementText: "歡迎加入 LINE 詢問商品庫存、顏色與取貨方式。",
  marqueeActive: 1,
  marqueeLabel: "暑假限定",
  marqueeText: "手持風扇優惠準備開跑，炎炎夏日一起涼一下。歡迎加官方 LINE 詢問現貨與活動內容。",
  lineLabel: "加入 LINE 詢問",
  lineUrl: "https://line.me/R/ti/p/@sige3c",
  productCategories: [
    { id: "cable", label: "充電線", labelEn: "Cables" },
    { id: "charger", label: "充電頭", labelEn: "Chargers" },
    { id: "powerbank", label: "行動電源", labelEn: "Power Banks" },
    { id: "protector", label: "保護貼", labelEn: "Screen Protectors" },
    { id: "phonecase", label: "手機殼", labelEn: "Phone Cases" }
  ]
};

let categories = [...defaultSettings.productCategories];

const orderStatuses = {
  new: "新訂單",
  confirmed: "已確認",
  ready: "可取貨",
  completed: "已完成",
  cancelled: "已取消"
};

const deliveryLabels = {
  pickup: "到門市領取",
  shipping: "寄貨"
};

const paymentLabels = {
  linepay: "LINE Pay",
  transfer: "轉帳"
};

let products = [];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function password() {
  return passwordInput?.value || "";
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#ff6b72" : "";
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }
}

function listText(value) {
  return asList(value).join("\n");
}

function addOnsText(value) {
  return asList(value).map((item) => {
    if (typeof item === "string") return item;
    return `${item.name || ""}|${Number(item.price || 0)}`;
  }).filter(Boolean).join("\n");
}

function quantityDealsText(value) {
  return asList(value).map((item) => {
    if (typeof item === "string") return item;
    const quantity = item.quantity ?? item.qty ?? item.count ?? "";
    return quantity && item.price ? `${Number(quantity)}|${Number(item.price || 0)}` : "";
  }).filter(Boolean).join("\n");
}

function variantPricesText(value) {
  return asList(value).map((item) => {
    if (typeof item === "string") return item;
    const salePrice = item.salePrice ?? item.sale_price ?? "";
    return `${item.model || ""}|${item.spec || ""}|${Number(item.price || 0)}|${salePrice}`;
  }).filter(Boolean).join("\n");
}

function readLines(value) {
  return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function uniqueLines(lines) {
  return [...new Set(lines.map((line) => String(line || "").trim()).filter(Boolean))];
}

function normalizeCategory(item) {
  if (typeof item === "string") {
    const [rawId = "", rawLabel = "", rawLabelEn = ""] = item.split("|").map((part) => part.trim());
    return {
      id: rawId,
      label: rawLabel || rawId,
      labelEn: rawLabelEn
    };
  }

  return {
    id: String(item?.id || item?.value || "").trim(),
    label: String(item?.label || item?.name || item?.id || "").trim(),
    labelEn: String(item?.labelEn || item?.label_en || "").trim()
  };
}

function normalizeCategories(value) {
  const seen = new Set();
  const normalized = asList(value).map(normalizeCategory).filter((item) => {
    if (!item.id || !item.label || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  return normalized.length ? normalized : [...defaultSettings.productCategories];
}

function categoriesText(value = categories) {
  return normalizeCategories(value)
    .map((item) => `${item.id}|${item.label}${item.labelEn ? `|${item.labelEn}` : ""}`)
    .join("\n");
}

function readCategories(value) {
  return normalizeCategories(readLines(value));
}

function setCategories(nextCategories) {
  categories = normalizeCategories(nextCategories);
  if (categoryListInput) categoryListInput.value = categoriesText(categories);
}

function categoryEntries(extraCategory = "") {
  const entries = [...categories];
  if (extraCategory && !entries.some((item) => item.id === extraCategory)) {
    entries.push({ id: extraCategory, label: extraCategory, labelEn: "" });
  }
  return entries;
}

function readAddOns(value) {
  return readLines(value).map((line) => {
    const [name, price = "0"] = line.split("|").map((item) => item.trim());
    return { name, price: Number(price || 0) };
  }).filter((item) => item.name);
}

function readQuantityDeals(value) {
  return readLines(value).map((line) => {
    const parts = (line.includes("|") ? line.split("|") : line.split(/\s+/)).map((item) => item.trim());
    const quantity = Number(String(parts[0] || "").replace(/[^\d]/g, ""));
    const price = parseMoneyToken(parts[1] || "");
    return { quantity, price };
  }).filter((item) => item.quantity >= 2 && item.price > 0);
}

function parseMoneyToken(value) {
  const normalized = String(value || "").replace(/[^\d.]/g, "");
  return normalized ? Number(normalized) : 0;
}

function looksLikeSpecToken(value) {
  const text = String(value || "").trim().toLowerCase();
  return /\d/.test(text) && /(cm|公分|厘米|mm|毫米|mah|w|瓦|米|公尺|m$)/i.test(text);
}

function looksLikeMoney(value) {
  const text = String(value || "").trim();
  return !looksLikeSpecToken(text) && parseMoneyToken(text) > 0 && /^[^\d]*\d/.test(text);
}

function parseLooseVariantLine(line) {
  const tokens = String(line || "").split(/\s+/).map((item) => item.trim()).filter(Boolean);
  if (tokens.length < 3 || !looksLikeMoney(tokens[tokens.length - 1])) return null;

  let salePrice = null;
  let price = parseMoneyToken(tokens.pop());
  if (tokens.length >= 3 && looksLikeMoney(tokens[tokens.length - 1])) {
    salePrice = price;
    price = parseMoneyToken(tokens.pop());
  }

  const spec = tokens.pop() || "";
  const model = tokens.join(" ");
  return { color: "", model, spec, price, salePrice };
}

function readVariantPrices(value) {
  return readLines(value).map((line) => {
    if (!line.includes("|")) return parseLooseVariantLine(line);
    const parts = line.split("|").map((item) => item.trim());
    let color = "";
    let model = "";
    let spec = "";
    let price = 0;
    let salePrice = null;

    if (parts.length >= 5) {
      [color, model, spec] = parts;
      price = Number(parts[3] || 0);
      salePrice = parts[4] ? Number(parts[4]) : null;
    } else {
      [model, spec] = parts;
      price = Number(parts[2] || 0);
      salePrice = parts[3] ? Number(parts[3]) : null;
    }

    return { color, model, spec, price, salePrice };
  }).filter((item) => item && (item.model || item.spec || item.color) && item.price > 0);
}

function optionSummary(options = {}) {
  return Object.entries(options)
    .filter(([, value]) => value)
    .map(([key, value]) => `${{ color: "顏色", model: "型號", spec: "規格" }[key] || key}：${value}`)
    .join(" / ");
}

function adminHeaders(extra = {}) {
  return {
    ...extra,
    "X-Admin-Password": password()
  };
}

function fillOffers(offers) {
  offers.slice(0, 3).forEach((offer, index) => {
    adminForm.elements[`label${index}`].value = offer.label || "";
    adminForm.elements[`title${index}`].value = offer.title || "";
    adminForm.elements[`desc${index}`].value = offer.desc || offer.description || "";
  });
}

function readFormOffers() {
  return defaultOffers.map((_, index) => ({
    id: index + 1,
    label: adminForm.elements[`label${index}`].value.trim(),
    title: adminForm.elements[`title${index}`].value.trim(),
    desc: adminForm.elements[`desc${index}`].value.trim()
  }));
}

async function loadOffers() {
  try {
    const response = await fetch("./api/offers", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("讀取失敗");
    const payload = await response.json();
    fillOffers(payload.offers?.length ? payload.offers : defaultOffers);
    setStatus(adminStatus, "已載入目前優惠。");
  } catch {
    fillOffers(defaultOffers);
    setStatus(adminStatus, "目前無法讀取雲端優惠，已顯示預設內容。", true);
  }
}

function fillSettings(settings = defaultSettings) {
  settingsForm.elements.announcementTitle.value = settings.announcementTitle || "";
  settingsForm.elements.announcementText.value = settings.announcementText || "";
  settingsForm.elements.marqueeLabel.value = settings.marqueeLabel || settings.marquee_label || defaultSettings.marqueeLabel;
  settingsForm.elements.marqueeText.value = settings.marqueeText || settings.marquee_text || defaultSettings.marqueeText;
  settingsForm.elements.lineLabel.value = settings.lineLabel || "";
  settingsForm.elements.lineUrl.value = settings.lineUrl || "";
  settingsForm.elements.announcementActive.checked = Number(settings.announcementActive ?? 1) === 1;
  settingsForm.elements.marqueeActive.checked = Number(settings.marqueeActive ?? settings.marquee_active ?? 1) === 1;
  setCategories(settings.productCategories || settings.product_categories || categories);
  if (products.length) renderProducts(products);
}

function readSettings() {
  return {
    announcementTitle: settingsForm.elements.announcementTitle.value.trim(),
    announcementText: settingsForm.elements.announcementText.value.trim(),
    marqueeLabel: settingsForm.elements.marqueeLabel.value.trim(),
    marqueeText: settingsForm.elements.marqueeText.value.trim(),
    lineLabel: settingsForm.elements.lineLabel.value.trim(),
    lineUrl: settingsForm.elements.lineUrl.value.trim(),
    announcementActive: settingsForm.elements.announcementActive.checked ? 1 : 0,
    marqueeActive: settingsForm.elements.marqueeActive.checked ? 1 : 0,
    productCategories: readCategories(categoryListInput?.value || categoriesText(categories))
  };
}

async function loadSettings() {
  try {
    const response = await fetch("./api/settings", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("讀取公告設定失敗");
    const payload = await response.json();
    fillSettings(payload.settings || defaultSettings);
    setStatus(settingsStatus, "已載入公告與 LINE 設定。");
  } catch {
    fillSettings(defaultSettings);
    setStatus(settingsStatus, "目前無法讀取公告設定，已顯示預設內容。", true);
  }
}

function productRow(product, index) {
  const salePrice = product.salePrice ?? product.sale_price ?? "";
  const categoryOptions = categoryEntries(product.category).map((category) => (
    `<option value="${escapeHtml(category.id)}" ${product.category === category.id ? "selected" : ""}>${escapeHtml(category.label)}</option>`
  )).join("");

  return `
    <article class="product-admin-row" data-product-index="${index}">
      <div class="product-admin-head">
        <strong>${escapeHtml(product.name || "新商品")}</strong>
        <button type="button" data-remove-product="${index}" aria-label="移除此商品">×</button>
      </div>
      <input type="hidden" data-product-field="id" value="${product.id || index + 1}" />
      <label><span>SKU</span><input data-product-field="sku" value="${escapeHtml(product.sku || "")}" required /></label>
      <label><span>商品名稱</span><input data-product-field="name" value="${escapeHtml(product.name || "")}" required /></label>
      <label><span>分類</span><select data-product-field="category">${categoryOptions}</select></label>
      <label><span>原價</span><input data-product-field="price" type="number" min="0" step="1" value="${Number(product.price || 0)}" required /></label>
      <label><span>優惠價</span><input data-product-field="salePrice" type="number" min="0" step="1" value="${salePrice === null ? "" : salePrice}" placeholder="可留空" /></label>
      <label><span>庫存</span><input data-product-field="stock" type="number" min="0" step="1" value="${Number(product.stock || 0)}" required /></label>
      <label class="admin-checkbox">
        <input data-product-field="active" type="checkbox" ${Number(product.active ?? 1) === 1 ? "checked" : ""} />
        <span>上架顯示</span>
      </label>
      <label><span>主圖片網址</span><input data-product-field="imageUrl" value="${escapeHtml(product.imageUrl || product.image_url || "")}" placeholder="./assets/images/product.jpg" /></label>
      <label class="product-admin-upload">
        <span>上傳主圖片到 R2</span>
        <input data-image-upload="main" type="file" accept="image/*" />
        <small>選一張圖片，上傳後會自動填入主圖片欄位。</small>
      </label>
      <label class="product-admin-upload">
        <span>上傳多張圖片到 R2</span>
        <input data-image-upload="gallery" type="file" accept="image/*" multiple />
        <small>可一次選多張，上傳後會加到多張圖片欄位。</small>
      </label>
      <label class="product-admin-desc"><span>商品描述</span><textarea data-product-field="description" rows="3">${escapeHtml(product.description || "")}</textarea></label>
      <label class="product-admin-desc"><span>多張圖片網址（一行一張）</span><textarea data-product-field="gallery" rows="3" placeholder="./assets/images/product-1.jpg">${escapeHtml(listText(product.gallery))}</textarea></label>
      <label><span>顏色（一行一個）</span><textarea data-product-field="colors" rows="4">${escapeHtml(listText(product.colors))}</textarea></label>
      <label><span>型號（一行一個）</span><textarea data-product-field="models" rows="4">${escapeHtml(listText(product.models))}</textarea></label>
      <label><span>規格（一行一個）</span><textarea data-product-field="specs" rows="4">${escapeHtml(listText(product.specs))}</textarea></label>
      <label class="product-admin-desc"><span>規格組合價格（一行一筆：型號|規格|原價|優惠價，也可填 USB TO IOS 60cm 290）</span><textarea data-product-field="variantPrices" rows="4" placeholder="USB TO IOS 60cm 290&#10;USB TO IOS 120cm 590&#10;Type-C to Type-C|60公分|290">${escapeHtml(variantPricesText(product.variantPrices || product.variant_prices))}</textarea></label>
      <label class="product-admin-desc"><span>數量優惠（一行一筆：數量|優惠總價，例如 2|1000。買 4 隻會自動算兩組）</span><textarea data-product-field="quantityDeals" rows="3" placeholder="2|1000">${escapeHtml(quantityDealsText(product.quantityDeals || product.quantity_deals))}</textarea></label>
      <label class="product-admin-desc"><span>加購商品（一行一筆：名稱|價格）</span><textarea data-product-field="addOns" rows="4" placeholder="線材保護套|49">${escapeHtml(addOnsText(product.addOns || product.add_ons))}</textarea></label>
    </article>
  `;
}

function renderProducts(nextProducts) {
  products = nextProducts?.length ? nextProducts : defaultProducts;
  productFields.innerHTML = products.map(productRow).join("");
}

function readProductRows() {
  return [...productFields.querySelectorAll("[data-product-index]")].map((row, index) => {
    const read = (field) => row.querySelector(`[data-product-field="${field}"]`);
    const saleValue = read("salePrice").value.trim();
    return {
      id: Number(read("id").value || index + 1),
      sku: read("sku").value.trim(),
      name: read("name").value.trim(),
      category: read("category").value,
      price: Number(read("price").value || 0),
      salePrice: saleValue ? Number(saleValue) : null,
      stock: Number(read("stock").value || 0),
      imageUrl: read("imageUrl").value.trim(),
      description: read("description").value.trim(),
      gallery: readLines(read("gallery").value),
      colors: readLines(read("colors").value),
      models: readLines(read("models").value),
      specs: readLines(read("specs").value),
      variantPrices: readVariantPrices(read("variantPrices").value),
      quantityDeals: readQuantityDeals(read("quantityDeals").value),
      addOns: readAddOns(read("addOns").value),
      active: read("active").checked ? 1 : 0
    };
  });
}

async function loadProducts() {
  try {
    const response = await fetch("./api/products", {
      headers: adminHeaders({ Accept: "application/json" })
    });
    if (!response.ok) throw new Error("讀取商品失敗");
    const payload = await response.json();
    renderProducts(payload.products?.length ? payload.products : defaultProducts);
    setStatus(productStatus, "已載入目前商品。可在此設定原價、優惠價與庫存。");
  } catch {
    renderProducts(defaultProducts);
    setStatus(productStatus, "目前無法讀取雲端商品，已顯示預設內容。", true);
  }
}

async function saveProducts() {
  setCategories(readCategories(categoryListInput?.value || categoriesText(categories)));
  const nextProducts = readProductRows();
  const invalidDiscount = nextProducts.find((product) => product.salePrice && product.salePrice >= product.price);
  if (invalidDiscount) {
    setStatus(productStatus, `「${invalidDiscount.name}」的優惠價要低於原價，或留空。`, true);
    return;
  }

  setStatus(productStatus, "正在儲存商品...");
  const response = await fetch("./api/products", {
    method: "PUT",
    headers: adminHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ products: nextProducts })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "商品儲存失敗");

  const settingsResponse = await fetch("./api/settings", {
    method: "PUT",
    headers: adminHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ settings: readSettings() })
  });
  const settingsPayload = await settingsResponse.json().catch(() => ({}));
  if (!settingsResponse.ok) throw new Error(settingsPayload.error || "商品種類儲存失敗");

  renderProducts(payload.products || nextProducts);
  setStatus(productStatus, "商品與種類已儲存。前台會顯示最新分類、價格、折扣與庫存。");
}

async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const response = await fetch("./api/upload-image", {
    method: "POST",
    headers: adminHeaders(),
    body: form
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "圖片上傳失敗");
  return payload.url;
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersList.innerHTML = `<p class="admin-empty">目前沒有訂單。</p>`;
    return;
  }

  ordersList.innerHTML = orders.map((order) => {
    const items = order.items.map((item) => (
      `<li>
        ${escapeHtml(item.name)} × ${item.quantity} <strong>${money.format(item.subtotal)}</strong>
        ${item.selectedOptions ? `<small>${escapeHtml(optionSummary(item.selectedOptions))}</small>` : ""}
        ${item.addOns?.length ? `<small>加購：${escapeHtml(item.addOns.map((addOn) => `${addOn.name} +${money.format(addOn.price)}`).join("、"))}</small>` : ""}
      </li>`
    )).join("");
    const options = Object.entries(orderStatuses).map(([value, label]) => (
      `<option value="${value}" ${order.status === value ? "selected" : ""}>${label}</option>`
    )).join("");

    return `
      <article class="order-card" data-order-id="${order.id}">
        <div class="order-card-head">
          <div>
            <span class="product-tag">#${order.id}</span>
            <h3>${escapeHtml(order.customerName)}｜${escapeHtml(order.customerPhone)}</h3>
            <p>${escapeHtml(order.createdAt || "")}</p>
          </div>
          <strong>${money.format(order.total)}</strong>
        </div>
        <ul>${items}</ul>
        <p>送貨方式：${deliveryLabels[order.deliveryMethod] || order.deliveryMethod || "到門市領取"}｜付款方式：${paymentLabels[order.paymentMethod] || order.paymentMethod || "LINE Pay"}</p>
        ${order.shippingAddress ? `<p>寄送地址：${escapeHtml(order.shippingAddress)}</p>` : ""}
        ${order.customerLine ? `<p>LINE：${escapeHtml(order.customerLine)}</p>` : ""}
        ${order.note ? `<p>備註：${escapeHtml(order.note)}</p>` : ""}
        <div class="order-card-actions">
          <select data-order-status-select>${options}</select>
          <button class="secondary-button" type="button" data-save-order>更新狀態</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadOrders() {
  setStatus(orderStatus, "正在讀取訂單...");
  const response = await fetch("./api/orders", {
    headers: adminHeaders({ Accept: "application/json" })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "訂單讀取失敗");
  renderOrders(payload.orders || []);
  setStatus(orderStatus, "已載入最新訂單。");
}

adminForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(adminStatus, "正在儲存...");

  try {
    const response = await fetch("./api/offers", {
      method: "PUT",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ offers: readFormOffers() })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "儲存失敗");
    fillOffers(payload.offers || readFormOffers());
    setStatus(adminStatus, "優惠已儲存到 Cloudflare D1。");
  } catch (error) {
    setStatus(adminStatus, error.message || "儲存失敗，請確認密碼與 Cloudflare 設定。", true);
  }
});

productForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await saveProducts();
  } catch (error) {
    setStatus(productStatus, error.message || "商品儲存失敗，請確認密碼與 Cloudflare 設定。", true);
  }
});

settingsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(settingsStatus, "正在儲存公告、LINE 與商品種類...");
  try {
    const response = await fetch("./api/settings", {
      method: "PUT",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ settings: readSettings() })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "公告設定儲存失敗");
    fillSettings(payload.settings || readSettings());
    setStatus(settingsStatus, "公告、LINE 與商品種類已儲存。");
  } catch (error) {
    setStatus(settingsStatus, error.message || "公告設定儲存失敗，請確認密碼。", true);
  }
});

categoryListInput?.addEventListener("change", () => {
  const rows = productFields?.children.length ? readProductRows() : products;
  setCategories(readCategories(categoryListInput.value));
  renderProducts(rows);
  setStatus(productStatus, "商品種類列表已套用，記得按「儲存商品」。");
});

addProductRow?.addEventListener("click", () => {
  const rows = readProductRows();
  const nextId = rows.reduce((max, product) => Math.max(max, Number(product.id || 0)), 0) + 1;
  rows.push({
    id: nextId,
    sku: `NEW-${nextId}`,
    name: "新商品",
    category: categories[0]?.id || "cable",
    price: 0,
    salePrice: null,
    stock: 0,
    imageUrl: "",
    gallery: [],
    colors: [],
    models: [],
    specs: [],
    variantPrices: [],
    quantityDeals: [],
    addOns: [],
    description: "",
    active: 0
  });
  renderProducts(rows);
});

productFields?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-product]");
  if (!button) return;
  const index = Number(button.dataset.removeProduct || -1);
  const rows = readProductRows().filter((_, rowIndex) => rowIndex !== index);
  renderProducts(rows);
  setStatus(productStatus, "商品已從畫面移除，請按「儲存商品」才會正式刪除。");
});

productFields?.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-image-upload]");
  if (!input) return;
  const files = [...(input.files || [])];
  if (!files.length) return;
  if (!password()) {
    setStatus(productStatus, "請先輸入管理密碼，再上傳圖片。", true);
    input.value = "";
    return;
  }

  const row = input.closest("[data-product-index]");
  const mode = input.dataset.imageUpload;
  const imageUrlInput = row.querySelector('[data-product-field="imageUrl"]');
  const galleryInput = row.querySelector('[data-product-field="gallery"]');

  try {
    setStatus(productStatus, `正在上傳 ${files.length} 張圖片到 R2...`);
    const urls = [];
    for (const file of files) {
      urls.push(await uploadImage(file));
    }

    if (mode === "main") {
      imageUrlInput.value = urls[0];
      const galleryLines = readLines(galleryInput.value);
      galleryInput.value = uniqueLines([urls[0], ...galleryLines]).join("\n");
    } else {
      const galleryLines = readLines(galleryInput.value);
      galleryInput.value = uniqueLines([...galleryLines, ...urls]).join("\n");
      if (!imageUrlInput.value && urls[0]) imageUrlInput.value = urls[0];
    }

    setStatus(productStatus, "圖片已上傳並填入欄位，記得按「儲存商品」。");
  } catch (error) {
    setStatus(productStatus, error.message || "圖片上傳失敗，請確認 R2 綁定與管理密碼。", true);
  } finally {
    input.value = "";
  }
});

loadOrdersButton?.addEventListener("click", async () => {
  try {
    await loadOrders();
  } catch (error) {
    setStatus(orderStatus, error.message || "訂單讀取失敗，請確認密碼。", true);
  }
});

ordersList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-save-order]");
  if (!button) return;
  const card = button.closest("[data-order-id]");
  const id = Number(card.dataset.orderId || 0);
  const status = card.querySelector("[data-order-status-select]").value;
  setStatus(orderStatus, "正在更新訂單狀態...");

  try {
    const response = await fetch("./api/orders", {
      method: "PATCH",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id, status })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "訂單更新失敗");
    setStatus(orderStatus, "訂單狀態已更新。");
  } catch (error) {
    setStatus(orderStatus, error.message || "訂單更新失敗，請確認密碼。", true);
  }
});

refreshButton?.addEventListener("click", () => {
  loadOffers();
  loadProducts();
  loadSettings();
  if (password()) loadOrders().catch((error) => setStatus(orderStatus, error.message || "訂單讀取失敗。", true));
});

loadOffers();
loadProducts();
loadSettings();
