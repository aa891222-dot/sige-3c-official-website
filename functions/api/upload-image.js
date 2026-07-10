const maxImageSize = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

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

function extensionFor(type, name = "") {
  const extension = String(name).split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) return extension === "jpeg" ? "jpg" : extension;
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
  }[type] || "bin";
}

export async function onRequestPost({ request, env }) {
  if (!env.PRODUCT_IMAGES) return json({ error: "R2 binding PRODUCT_IMAGES is missing" }, 500);
  const adminError = requireAdmin(request, env);
  if (adminError) return json({ error: adminError }, adminError.includes("missing") ? 500 : 401);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "圖片上傳格式錯誤" }, 400);
  }

  const image = form.get("image");
  if (!image || typeof image === "string") return json({ error: "請選擇圖片檔案" }, 400);
  if (!allowedTypes.has(image.type)) return json({ error: "只支援 JPG、PNG、WEBP、GIF 圖片" }, 400);
  if (image.size > maxImageSize) return json({ error: "圖片不可超過 8MB" }, 400);

  const extension = extensionFor(image.type, image.name);
  const key = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  await env.PRODUCT_IMAGES.put(key, image.stream(), {
    httpMetadata: {
      contentType: image.type,
      cacheControl: "public, max-age=31536000, immutable"
    },
    customMetadata: {
      originalName: image.name || "",
      uploadedAt: new Date().toISOString()
    }
  });

  return json({
    key,
    url: `./api/image?key=${encodeURIComponent(key)}`
  }, 201);
}
