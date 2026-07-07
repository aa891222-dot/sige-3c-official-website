const adminForm = document.querySelector("[data-admin-form]");
const adminStatus = document.querySelector("[data-admin-status]");

const defaultOffers = [
  { label: "WRAP", title: "包膜優惠", desc: "手機包膜與保護服務，歡迎到店詢問。" },
  { label: "GIFT", title: "滿額贈禮", desc: "消費滿額送精美小禮。" },
  { label: "VIP", title: "會員專屬", desc: "會員最高 88 折扣。" }
];

function setStatus(message, isError = false) {
  adminStatus.textContent = message;
  adminStatus.style.color = isError ? "#ff6b72" : "";
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
    setStatus("已載入目前優惠。");
  } catch {
    fillOffers(defaultOffers);
    setStatus("目前無法讀取雲端優惠，已顯示預設內容。", true);
  }
}

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("正在儲存...");

  try {
    const response = await fetch("./api/offers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": adminForm.elements.password.value
      },
      body: JSON.stringify({ offers: readFormOffers() })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "儲存失敗");
    fillOffers(payload.offers || readFormOffers());
    setStatus("已儲存到 Cloudflare D1，重新整理前台即可看到最新優惠。");
  } catch (error) {
    setStatus(error.message || "儲存失敗，請確認密碼與 Cloudflare 設定。", true);
  }
});

loadOffers();
