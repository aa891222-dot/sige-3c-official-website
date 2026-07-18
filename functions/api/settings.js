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
  lineUrl: "https://line.me/R/ti/p/@sige3c",
  productCategories: defaultProductCategories
};

const keys = {
  announcement_active: "announcementActive",
  announcement_title: "announcementTitle",
  announcement_text: "announcementText",
  marquee_active: "marqueeActive",
  marquee_label: "marqueeLabel",
  marquee_text: "marqueeText",
  line_label: "lineLabel",
  line_url: "lineUrl",
  product_categories: "productCategories"
};

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
    return fallback;
  }
}

function sanitizeProductCategories(value) {
  const source = parseJsonArray(value, defaultProductCategories);
  const seen = new Set();
  const categories = source.map((item) => {
    if (typeof item === "string") {
      const [id = "", label = "", labelEn = ""] = item.split("|").map((part) => part.trim());
      return { id, label: label || id, labelEn };
    }

    return {
      id: String(item.id || item.value || "").trim().slice(0, 40),
      label: String(item.label || item.name || item.id || "").trim().slice(0, 40),
      labelEn: String(item.labelEn || item.label_en || "").trim().slice(0, 60)
    };
  }).filter((item) => {
    if (!item.id || !item.label || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return categories.length ? categories : defaultProductCategories;
}

async function ensureSettingsSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function readSettings(env) {
  if (!env.DB) return defaultSettings;
  await ensureSettingsSchema(env);
  const result = await env.DB.prepare("SELECT key, value FROM site_settings").all();
  const settings = { ...defaultSettings };
  for (const row of result.results || []) {
    const mapped = keys[row.key];
    if (!mapped) continue;
    if (mapped === "announcementActive" || mapped === "marqueeActive") {
      settings[mapped] = Number(row.value);
    } else if (mapped === "productCategories") {
      settings[mapped] = sanitizeProductCategories(row.value);
    } else {
      settings[mapped] = row.value;
    }
  }
  return settings;
}

function sanitizeSettings(settings = {}) {
  return {
    announcementActive: Number(settings.announcementActive ?? settings.announcement_active ?? 1) === 1 ? 1 : 0,
    announcementTitle: String(settings.announcementTitle || settings.announcement_title || defaultSettings.announcementTitle).trim().slice(0, 80),
    announcementText: String(settings.announcementText || settings.announcement_text || defaultSettings.announcementText).trim().slice(0, 260),
    marqueeActive: Number(settings.marqueeActive ?? settings.marquee_active ?? 1) === 1 ? 1 : 0,
    marqueeLabel: String(settings.marqueeLabel || settings.marquee_label || defaultSettings.marqueeLabel).trim().slice(0, 40),
    marqueeText: String(settings.marqueeText || settings.marquee_text || defaultSettings.marqueeText).trim().slice(0, 220),
    lineLabel: String(settings.lineLabel || settings.line_label || defaultSettings.lineLabel).trim().slice(0, 40),
    lineUrl: String(settings.lineUrl || settings.line_url || defaultSettings.lineUrl).trim().slice(0, 320),
    productCategories: sanitizeProductCategories(settings.productCategories ?? settings.product_categories)
  };
}

export async function onRequestGet({ env }) {
  try {
    return json({ settings: await readSettings(env) });
  } catch {
    return json({ settings: defaultSettings });
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

  const settings = sanitizeSettings(body.settings || body);
  if (!settings.announcementTitle || !settings.announcementText || !settings.marqueeLabel || !settings.marqueeText || !settings.lineLabel || !settings.lineUrl) {
    return json({ error: "公告、跑馬燈與 LINE 欄位不可空白" }, 400);
  }

  await ensureSettingsSchema(env);
  const rows = [
    ["announcement_active", String(settings.announcementActive)],
    ["announcement_title", settings.announcementTitle],
    ["announcement_text", settings.announcementText],
    ["marquee_active", String(settings.marqueeActive)],
    ["marquee_label", settings.marqueeLabel],
    ["marquee_text", settings.marqueeText],
    ["line_label", settings.lineLabel],
    ["line_url", settings.lineUrl],
    ["product_categories", JSON.stringify(settings.productCategories)]
  ];

  for (const [key, value] of rows) {
    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).bind(key, value).run();
  }

  return json({ settings: await readSettings(env) });
}
