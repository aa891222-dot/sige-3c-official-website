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
    addOns: [{ name: "線材保護套", price: 49 }, { name: "收納束帶", price: 29 }],
    active: 1
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
    addOns: [{ name: "線材保護套", price: 49 }],
    active: 1
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
    addOns: [{ name: "Type-C 快充線加購", price: 199 }],
    active: 1
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
    addOns: [{ name: "快充線組合價", price: 250 }],
    active: 1
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
    addOns: [{ name: "短線加購", price: 99 }],
    active: 1
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
    addOns: [{ name: "快充頭加購", price: 299 }],
    active: 1
  }
];

const categories = new Set(["cable", "charger", "powerbank"]);

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

function parseJsonArray(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return String(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }
}

function cleanList(value) {
  return parseJsonArray(value).map((item) => String(item || "").trim().slice(0, 60)).filter(Boolean);
}

function cleanAddOns(value) {
  const source = Array.isArray(value) ? value : parseJsonArray(value);
  return source.map((item) => {
    if (typeof item === "string") {
      const [name, price = "0"] = item.split("|").map((part) => part.trim());
      return { name, price: Math.max(0, Math.round(Number(price || 0))) };
    }
    return {
      name: String(item.name || "").trim().slice(0, 60),
      price: Math.max(0, Math.round(Number(item.price || 0)))
    };
  }).filter((item) => item.name);
}

function defaultFor(id) {
  return defaultProducts.find((product) => Number(product.id) === Number(id)) || {};
}

function normalizeProduct(row) {
  const fallback = defaultFor(row.id);
  return {
    id: Number(row.id),
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: Number(row.price || 0),
    salePrice: row.sale_price === null || row.sale_price === undefined ? null : Number(row.sale_price),
    stock: Number(row.stock || 0),
    description: row.description || "",
    imageUrl: row.image_url || fallback.imageUrl || "",
    gallery: parseJsonArray(row.gallery, fallback.gallery || []),
    colors: parseJsonArray(row.colors, fallback.colors || []),
    models: parseJsonArray(row.models, fallback.models || []),
    specs: parseJsonArray(row.specs, fallback.specs || []),
    addOns: parseJsonArray(row.add_ons, fallback.addOns || []),
    active: Number(row.active ?? 1)
  };
}

function sanitizeProduct(product, fallbackId) {
  const id = Number(product.id || fallbackId || 0);
  const sku = String(product.sku || "").trim().slice(0, 40);
  const name = String(product.name || "").trim().slice(0, 90);
  const category = String(product.category || "").trim();
  const price = Math.max(0, Math.round(Number(product.price || 0)));
  const rawSale = product.salePrice ?? product.sale_price;
  const salePrice = rawSale === "" || rawSale === null || rawSale === undefined
    ? null
    : Math.max(0, Math.round(Number(rawSale || 0)));
  const stock = Math.max(0, Math.round(Number(product.stock || 0)));
  const description = String(product.description || "").trim().slice(0, 220);
  const imageUrl = String(product.imageUrl || product.image_url || "").trim().slice(0, 320);
  const gallery = cleanList(product.gallery).slice(0, 6);
  const colors = cleanList(product.colors).slice(0, 12);
  const models = cleanList(product.models).slice(0, 12);
  const specs = cleanList(product.specs).slice(0, 12);
  const addOns = cleanAddOns(product.addOns ?? product.add_ons).slice(0, 12);
  const active = product.active === false || Number(product.active) === 0 ? 0 : 1;

  if (!id || !sku || !name || !categories.has(category) || !price) {
    throw new Error("商品資料不完整，請確認 SKU、名稱、分類與原價。");
  }

  return {
    id,
    sku,
    name,
    category,
    price,
    salePrice: salePrice && salePrice < price ? salePrice : null,
    stock,
    description,
    imageUrl,
    gallery,
    colors,
    models,
    specs,
    addOns,
    active
  };
}

async function ensureProductSchema(env) {
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

  const columns = await env.DB.prepare("PRAGMA table_info(products)").all();
  const existing = new Set((columns.results || []).map((column) => column.name));
  const additions = [
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

  for (const [name, definition] of additions) {
    if (!existing.has(name)) {
      await env.DB.prepare(`ALTER TABLE products ADD COLUMN ${definition}`).run();
    }
  }
}

async function seedDefaultProducts(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM products").first();
  if (Number(row?.count || 0) > 0) return;
  for (const product of defaultProducts) {
    await env.DB.prepare(`
      INSERT INTO products (id, sku, name, category, price, sale_price, stock, description, image_url, gallery, colors, models, specs, add_ons, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.id,
      product.sku,
      product.name,
      product.category,
      product.price,
      product.salePrice,
      product.stock,
      product.description,
      product.imageUrl,
      JSON.stringify(product.gallery || []),
      JSON.stringify(product.colors || []),
      JSON.stringify(product.models || []),
      JSON.stringify(product.specs || []),
      JSON.stringify(product.addOns || []),
      product.active
    ).run();
  }
}

async function readProducts(env, includeInactive = false) {
  if (!env.DB) return defaultProducts;
  await ensureProductSchema(env);
  await seedDefaultProducts(env);
  const sql = includeInactive
    ? "SELECT * FROM products ORDER BY id ASC"
    : "SELECT * FROM products WHERE active = 1 ORDER BY id ASC";
  const result = await env.DB.prepare(sql).all();
  return result.results?.length ? result.results.map(normalizeProduct) : defaultProducts;
}

export async function onRequestGet({ request, env }) {
  try {
    const includeInactive = request.headers.get("X-Admin-Password") === env.ADMIN_PASSWORD;
    return json({ products: await readProducts(env, includeInactive) });
  } catch (error) {
    return json({ products: defaultProducts, warning: error.message || "Using fallback products" });
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is missing" }, 500);
  const adminError = requireAdmin(request, env);
  if (adminError) return json({ error: adminError }, adminError.includes("missing") ? 500 : 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON 格式錯誤" }, 400);
  }

  const products = Array.isArray(body.products) ? body.products : [];
  if (!products.length) return json({ error: "至少需要 1 筆商品資料" }, 400);

  try {
    await ensureProductSchema(env);
    for (const [index, product] of products.entries()) {
      const item = sanitizeProduct(product, index + 1);
      await env.DB.prepare(`
        INSERT INTO products (id, sku, name, category, price, sale_price, stock, description, image_url, gallery, colors, models, specs, add_ons, active, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          sku = excluded.sku,
          name = excluded.name,
          category = excluded.category,
          price = excluded.price,
          sale_price = excluded.sale_price,
          stock = excluded.stock,
          description = excluded.description,
          image_url = excluded.image_url,
          gallery = excluded.gallery,
          colors = excluded.colors,
          models = excluded.models,
          specs = excluded.specs,
          add_ons = excluded.add_ons,
          active = excluded.active,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        item.id,
        item.sku,
        item.name,
        item.category,
        item.price,
        item.salePrice,
        item.stock,
        item.description,
        item.imageUrl,
        JSON.stringify(item.gallery || []),
        JSON.stringify(item.colors || []),
        JSON.stringify(item.models || []),
        JSON.stringify(item.specs || []),
        JSON.stringify(item.addOns || []),
        item.active
      ).run();
    }
    return json({ products: await readProducts(env, true) });
  } catch (error) {
    return json({ error: error.message || "商品儲存失敗" }, 400);
  }
}
