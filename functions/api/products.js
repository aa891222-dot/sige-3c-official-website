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
      INSERT INTO products (id, sku, name, category, price, sale_price, stock, description, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.id,
      product.sku,
      product.name,
      product.category,
      product.price,
      product.salePrice,
      product.stock,
      product.description,
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
        INSERT INTO products (id, sku, name, category, price, sale_price, stock, description, active, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          sku = excluded.sku,
          name = excluded.name,
          category = excluded.category,
          price = excluded.price,
          sale_price = excluded.sale_price,
          stock = excluded.stock,
          description = excluded.description,
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
        item.active
      ).run();
    }
    return json({ products: await readProducts(env, true) });
  } catch (error) {
    return json({ error: error.message || "商品儲存失敗" }, 400);
  }
}
