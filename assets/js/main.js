const body = document.body;
const menuButton = document.querySelector("[data-menu-button]");
const chatBubble = document.querySelector("[data-chat-bubble]");
const layers = [...document.querySelectorAll(".layer")];
const canvas = document.querySelector("[data-particles]");
const ctx = canvas.getContext("2d");

const chatLines = [
  "需要我推薦適合你的手機殼嗎？",
  "保護貼現場安裝，快速完成。",
  "今天想找 MagSafe 還是防摔殼？",
  "LINE 詢問優惠，店長幫你配到好。"
];

let chatIndex = 0;
let particles = [];

menuButton?.addEventListener("click", () => {
  body.classList.toggle("menu-open");
});

document.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  layers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0);
    layer.style.setProperty("--mx", `${x * depth * 28}px`);
    layer.style.setProperty("--my", `${y * depth * 20}px`);
  });
});

setInterval(() => {
  if (!chatBubble) return;
  chatIndex = (chatIndex + 1) % chatLines.length;
  chatBubble.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 420, easing: "ease-out" }
  );
  window.setTimeout(() => {
    chatBubble.textContent = chatLines[chatIndex];
  }, 190);
}, 3600);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * ratio);
  canvas.height = Math.floor(canvas.clientHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    speed: 0.25 + Math.random() * 0.8,
    size: 1 + Math.random() * 2.2,
    alpha: 0.18 + Math.random() * 0.55
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin(particle.y * 0.01) * 0.18;
    if (particle.y < -12) {
      particle.y = canvas.clientHeight + 12;
      particle.x = Math.random() * canvas.clientWidth;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 38, 56, ${particle.alpha})`;
    ctx.shadowColor = "rgba(255, 38, 56, .9)";
    ctx.shadowBlur = 12;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
