const adminForm = document.querySelector("[data-admin-form]");
const adminStatus = document.querySelector("[data-admin-status]");
const passwordInput = document.querySelector("[data-shared-password]");
const refreshButton = document.querySelector("[data-refresh-admin]");
const productForm = document.querySelector("[data-product-form]");
const productFields = document.querySelector("[data-product-fields]");
const productStatus = document.querySelector("[data-product-status]");
const addProductRow = document.querySelector("[data-add-product-row]");
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
  { id: 1, sku: "CB-C2C-60W", name: "Type-C to Type-C 快充線 60W", category: "cable", price: 290, salePrice: 250, stock: 12, description: "支援快充，適合 Android、iPad 與 Type-C 裝置。", active: 1 },
  { id: 2, sku: "CB-LTG-USB", name: "Lightning 充電線", category: "cable", price: 250, salePrice: null, stock: 10, description: "iPhone 常用備用線，居家、公司、車上都方便。", active: 1 },
  { id: 3, sku: "CH-20W-PD", name: "PD 20W 快充頭", category: "charger", price: 390, salePrice: 350, stock: 8, description: "小體積快充頭，適合日常快速補電。", active: 1 },
  { id: 4, sku: "CH-35W-DUAL", name: "雙孔 35W 充電頭", category: "charger", price: 590, salePrice: null, stock: 6, description: "雙裝置同時充電，手機與耳機一起補電。", active: 1 },
  { id: 5, sku: "PB-10000", name: "10000mAh 行動電源", category: "powerbank", price: 790, salePrice: 690, stock: 5, description: "通勤與外出常備容量，輕巧好攜帶。", active: 1 },
  { id: 6, sku: "PB-20000", name: "20000mAh 大容量行動電源", category: "powerbank", price: 1190, salePrice: null, stock: 3, description: "旅行與長時間外出適用，續航更安心。", active: 1 }
];

const categories = {
  cable: "充電線",
  charger: "充電頭",
  powerbank: "行動電源"
};

const orderStatuses = {
  new: "新訂單",
  confirmed: "已確認",
  ready: "可取貨",
  completed: "已完成",
  cancelled: "已取消"
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

function productRow(product, index) {
  const salePrice = product.salePrice ?? product.sale_price ?? "";
  const categoryOptions = Object.entries(categories).map(([value, label]) => (
    `<option value="${value}" ${product.category === value ? "selected" : ""}>${label}</option>`
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
      <label class="product-admin-desc"><span>商品描述</span><textarea data-product-field="description" rows="3">${escapeHtml(product.description || "")}</textarea></label>
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
      description: read("description").value.trim(),
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
  renderProducts(payload.products || nextProducts);
  setStatus(productStatus, "商品已儲存。前台會顯示最新價格、折扣與庫存。");
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersList.innerHTML = `<p class="admin-empty">目前沒有訂單。</p>`;
    return;
  }

  ordersList.innerHTML = orders.map((order) => {
    const items = order.items.map((item) => (
      `<li>${escapeHtml(item.name)} × ${item.quantity} <strong>${money.format(item.subtotal)}</strong></li>`
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

addProductRow?.addEventListener("click", () => {
  const rows = readProductRows();
  const nextId = rows.reduce((max, product) => Math.max(max, Number(product.id || 0)), 0) + 1;
  rows.push({
    id: nextId,
    sku: `NEW-${nextId}`,
    name: "新商品",
    category: "cable",
    price: 0,
    salePrice: null,
    stock: 0,
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
  if (password()) loadOrders().catch((error) => setStatus(orderStatus, error.message || "訂單讀取失敗。", true));
});

loadOffers();
loadProducts();
