function response(message, status = 400) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

function safeKey(value) {
  const key = String(value || "").trim();
  if (!key || key.includes("..") || key.startsWith("/") || !key.startsWith("products/")) return "";
  return key;
}

export async function onRequestGet({ request, env }) {
  if (!env.PRODUCT_IMAGES) return response("R2 binding PRODUCT_IMAGES is missing", 500);

  const url = new URL(request.url);
  const key = safeKey(url.searchParams.get("key"));
  if (!key) return response("Invalid image key", 400);

  const object = await env.PRODUCT_IMAGES.get(key);
  if (!object) return response("Image not found", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
