const defaultProducts = [
  ["CB-C2C-60W", "Type-C to Type-C 快充線 60W", "cable", 290, 250, 12, "支援快充，適合 Android、iPad 與 Type-C 裝置。"],
  ["CB-LTG-USB", "Lightning 充電線", "cable", 250, null, 10, "iPhone 常用備用線，居家、公司、車上都方便。"],
  ["CH-20W-PD", "PD 20W 快充頭", "charger", 390, 350, 8, "小體積快充頭，適合日常快速補電。"],
  ["CH-35W-DUAL", "雙孔 35W 充電頭", "charger", 590, null, 6, "雙裝置同時充電，手機與耳機一起補電。"],
  ["PB-10000", "10000mAh 行動電源", "powerbank", 790, 690, 5, "通勤與外出常備容量，輕巧好攜帶。"],
  ["PB-20000", "20000mAh 大容量行動電源", "powerbank", 1190, null, 3, "旅行與長時間外出適用，續航更安心。"]
];

const validStatuses = new Set(["new", "confirmed", "ready", "completed", "cancelled"]);
const validDeliveryMethods = new Set(["pickup", "shipping"]);
const validPaymentMethods = new Set(["linepay", "transfer"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function requireAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return "ADMIN_PASSWORD is missing";
  const password = request.headers.get("X-Admin-Password") || "";
  return password === env.ADMIN_PASSWORD ? "" : "管理密碼錯誤";
}

function clean(value, max = 160) {
  return String(value || "").trim().slice(0, max);
}

function productPrice(product) {
  const price = Number(product.price || 0);
  const salePrice = product.sale_price === null || product.sale_price === undefined ? 0 : Number(product.sale_price || 0);
  return salePrice > 0 && salePrice < price ? salePrice : price;
}

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function cleanOptions(value) {
  const options = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    color: clean(options.color, 60),
    model: clean(options.model, 80),
    spec: clean(options.spec, 80)
  };
}

function cleanAddOns(value) {
  const source = Array.isArray(value) ? value : [];
  return source.map((item) => ({
    name: clean(item.name, 80),
    price: Math.max(0, Math.round(Number(item.price || 0)))
  })).filter((item) => item.name);
}

function parseJsonObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function addOnsSubtotal(addOns) {
  return addOns.reduce((sum, item) => sum + Number(item.price || 0), 0);
}

function normalizeProduct(row) {
  return {
    id: Number(row.id),
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: Number(row.price || 0),
    salePrice: row.sale_price === null || row.sale_price === undefined ? null : Number(row.sale_price),
    stock: Number(row.stock || 0),
    description: row.description || "",
    imageUrl: row.image_url || "",
    gallery: parseJsonArray(row.gallery),
    colors: parseJsonArray(row.colors),
    models: parseJsonArray(row.models),
    specs: parseJsonArray(row.specs),
    addOns: parseJsonArray(row.add_ons),
    active: Number(row.active ?? 1)
  };
}

async function ensureSchemas(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      sale_price INTEGER,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      gallery TEXT NOT NULL DEFAULT '[]',
      colors TEXT NOT NULL DEFAULT '[]',
      models TEXT NOT NULL DEFAULT '[]',
      specs TEXT NOT NULL DEFAULT '[]',
      add_ons TEXT NOT NULL DEFAULT '[]',
      active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  const productColumns = await env.DB.prepare("PRAGMA table_info(products)").all();
  const productExisting = new Set((productColumns.results || []).map((column) => column.name));
  const productAdditions = [
    ["sale_price", "sale_price INTEGER"],
    ["stock", "stock INTEGER NOT NULL DEFAULT 0"],
    ["description", "description TEXT NOT NULL DEFAULT ''"],
    ["image_url", "image_url TEXT NOT NULL DEFAULT ''"],
    ["gallery", "gallery TEXT NOT NULL DEFAULT '[]'"],
    ["colors", "colors TEXT NOT NULL DEFAULT '[]'"],
    ["models", "models TEXT NOT NULL DEFAULT '[]'"],
    ["specs", "specs TEXT NOT NULL DEFAULT '[]'"],
    ["add_ons", "add_ons TEXT NOT NULL DEFAULT '[]'"],
    ["active", "active INTEGER NOT NULL DEFAULT 1"],
    ["updated_at", "updated_at TEXT"]
  ];
  for (const [name, definition] of productAdditions) {
    if (!productExisting.has(name)) {
      await env.DB.prepare(`ALTER TABLE products ADD COLUMN ${definition}`).run();
    }
  }

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_line TEXT NOT NULL DEFAULT '',
      delivery_method TEXT NOT NULL DEFAULT 'pickup',
      payment_method TEXT NOT NULL DEFAULT 'linepay',
      shipping_address TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      total INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      unit_price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      selected_options TEXT NOT NULL DEFAULT '{}',
      add_ons TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY(order_id) REFERENCES orders(id)
    )
  `).run();

  const orderColumns = await env.DB.prepare("PRAGMA table_info(orders)").all();
  const orderExisting = new Set((orderColumns.results || []).map((column) => column.name));
  const orderAdditions = [
    ["delivery_method", "delivery_method TEXT NOT NULL DEFAULT 'pickup'"],
    ["payment_method", "payment_method TEXT NOT NULL DEFAULT 'linepay'"],
    ["shipping_address", "shipping_address TEXT NOT NULL DEFAULT ''"],
    ["updated_at", "updated_at TEXT"]
  ];
  for (const [name, definition] of orderAdditions) {
    if (!orderExisting.has(name)) {
      await env.DB.prepare(`ALTER TABLE orders ADD COLUMN ${definition}`).run();
    }
  }

  const itemColumns = await env.DB.prepare("PRAGMA table_info(order_items)").all();
  const itemExisting = new Set((itemColumns.results || []).map((column) => column.name));
  const itemAdditions = [
    ["selected_options", "selected_options TEXT NOT NULL DEFAULT '{}'"],
    ["add_ons", "add_ons TEXT NOT NULL DEFAULT '[]'"]
  ];
  for (const [name, definition] of itemAdditions) {
    if (!itemExisting.has(name)) {
      await env.DB.prepare(`ALTER TABLE order_items ADD COLUMN ${definition}`).run();
    }
  }
}

async function seedProducts(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM products").first();
  if (Number(row?.count || 0) > 0) return;
  for (const [index, product] of defaultProducts.entries()) {
    await env.DB.prepare(`
      INSERT INTO products (id, sku, name, category, price, sale_price, stock, description, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(index + 1, ...product).run();
  }
}

async function readActiveProducts(env) {
  const result = await env.DB.prepare("SELECT * FROM products WHERE active = 1 ORDER BY id ASC").all();
  return result.results?.map(normalizeProduct) || [];
}

async function readOrderItems(env, orderId) {
  const result = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC").bind(orderId).all();
  return result.results?.map((item) => ({
    id: Number(item.id),
    productId: Number(item.product_id),
    sku: item.sku,
    name: item.name,
    unitPrice: Number(item.unit_price || 0),
    originalPrice: Number(item.original_price || 0),
    quantity: Number(item.quantity || 0),
    subtotal: Number(item.subtotal || 0),
    selectedOptions: parseJsonObject(item.selected_options),
    addOns: parseJsonArray(item.add_ons)
  })) || [];
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is missing" }, 500);
  const adminError = requireAdmin(request, env);
  if (adminError) return json({ error: adminError }, adminError.includes("missing") ? 500 : 401);

  await ensureSchemas(env);
  const result = await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100").all();
  const orders = [];
  for (const row of result.results || []) {
    orders.push({
      id: Number(row.id),
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerLine: row.customer_line,
      deliveryMethod: row.delivery_method || "pickup",
      paymentMethod: row.payment_method || "linepay",
      shippingAddress: row.shipping_address || "",
      note: row.note,
      total: Number(row.total || 0),
      status: row.status,
      createdAt: row.created_at,
      items: await readOrderItems(env, row.id)
    });
  }

  return json({ orders });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is missing" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON 格式錯誤" }, 400);
  }

  const customer = body.customer || {};
  const name = clean(customer.name, 60);
  const phone = clean(customer.phone, 40);
  const line = clean(customer.line, 60);
  const deliveryMethod = validDeliveryMethods.has(customer.deliveryMethod) ? customer.deliveryMethod : "pickup";
  const paymentMethod = validPaymentMethods.has(customer.paymentMethod) ? customer.paymentMethod : "linepay";
  const shippingAddress = deliveryMethod === "shipping" ? clean(customer.shippingAddress, 220) : "";
  const note = clean(customer.note, 240);
  const items = Array.isArray(body.items) ? body.items : [];

  if (!name || !phone) return json({ error: "請填寫姓名與電話" }, 400);
  if (deliveryMethod === "shipping" && !shippingAddress) return json({ error: "請填寫寄送地址" }, 400);
  if (!items.length) return json({ error: "請先加入商品" }, 400);

  await ensureSchemas(env);
  await seedProducts(env);

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const productId = Number(item.id || item.productId || 0);
    const quantity = Math.max(1, Math.min(20, Math.round(Number(item.quantity || 1))));
    const selectedOptions = cleanOptions(item.options);
    const product = await env.DB.prepare("SELECT * FROM products WHERE id = ? AND active = 1").bind(productId).first();
    if (!product) return json({ error: "商品不存在或已下架" }, 400);
    if (Number(product.stock || 0) < quantity) return json({ error: `${product.name} 庫存不足` }, 400);

    const availableAddOns = parseJsonArray(product.add_ons);
    const addOns = cleanAddOns(item.addOns).map((requested) => {
      return availableAddOns.find((available) => available.name === requested.name) || requested;
    });
    const unitPrice = productPrice(product) + addOnsSubtotal(addOns);
    const subtotal = unitPrice * quantity;
    total += subtotal;
    orderItems.push({ product, quantity, unitPrice, subtotal, selectedOptions, addOns });
  }

  const created = await env.DB.prepare(`
    INSERT INTO orders (customer_name, customer_phone, customer_line, delivery_method, payment_method, shipping_address, note, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
  `).bind(name, phone, line, deliveryMethod, paymentMethod, shippingAddress, note, total).run();
  const orderId = Number(created.meta?.last_row_id || 0);

  for (const item of orderItems) {
    await env.DB.prepare(`
      INSERT INTO order_items (order_id, product_id, sku, name, unit_price, original_price, quantity, subtotal, selected_options, add_ons)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      item.product.id,
      item.product.sku,
      item.product.name,
      item.unitPrice,
      Number(item.product.price || 0),
      item.quantity,
      item.subtotal,
      JSON.stringify(item.selectedOptions || {}),
      JSON.stringify(item.addOns || [])
    ).run();
    await env.DB.prepare("UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(item.quantity, item.product.id)
      .run();
  }

  return json({
    orderId,
    total,
    products: await readActiveProducts(env)
  }, 201);
}

export async function onRequestPatch({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is missing" }, 500);
  const adminError = requireAdmin(request, env);
  if (adminError) return json({ error: adminError }, adminError.includes("missing") ? 500 : 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON 格式錯誤" }, 400);
  }

  const id = Number(body.id || 0);
  const status = String(body.status || "").trim();
  if (!id || !validStatuses.has(status)) return json({ error: "訂單狀態資料錯誤" }, 400);

  await ensureSchemas(env);
  await env.DB.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(status, id)
    .run();

  return json({ ok: true });
}
