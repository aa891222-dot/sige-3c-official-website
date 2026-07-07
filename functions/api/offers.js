const defaultOffers = [
  { id: 1, label: "WRAP", title: "包膜優惠", desc: "手機包膜與保護服務，歡迎到店詢問。" },
  { id: 2, label: "GIFT", title: "滿額贈禮", desc: "消費滿額送精美小禮。" },
  { id: 3, label: "VIP", title: "會員專屬", desc: "會員最高 88 折扣。" }
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function normalizeOffer(row) {
  return {
    id: row.id,
    label: row.label,
    title: row.title,
    desc: row.description || row.desc
  };
}

async function readOffers(env) {
  if (!env.DB) return defaultOffers;
  const result = await env.DB.prepare(
    "SELECT id, label, title, description FROM offers ORDER BY id ASC LIMIT 3"
  ).all();
  return result.results?.length ? result.results.map(normalizeOffer) : defaultOffers;
}

export async function onRequestGet({ env }) {
  try {
    return json({ offers: await readOffers(env) });
  } catch (error) {
    return json({ offers: defaultOffers, warning: "Using fallback offers" });
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is missing" }, 500);
  if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD is missing" }, 500);

  const password = request.headers.get("X-Admin-Password") || "";
  if (password !== env.ADMIN_PASSWORD) return json({ error: "管理密碼錯誤" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON 格式錯誤" }, 400);
  }

  const offers = Array.isArray(body.offers) ? body.offers.slice(0, 3) : [];
  if (offers.length !== 3) return json({ error: "需要 3 筆優惠資料" }, 400);

  for (const [index, offer] of offers.entries()) {
    const id = index + 1;
    const label = String(offer.label || "").trim().slice(0, 24);
    const title = String(offer.title || "").trim().slice(0, 80);
    const desc = String(offer.desc || offer.description || "").trim().slice(0, 220);
    if (!label || !title || !desc) return json({ error: "優惠欄位不可空白" }, 400);

    await env.DB.prepare(
      "INSERT INTO offers (id, label, title, description) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET label = excluded.label, title = excluded.title, description = excluded.description"
    ).bind(id, label, title, desc).run();
  }

  return json({ offers: await readOffers(env) });
}
