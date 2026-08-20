// ================== PERSONALIZAR ==================
// Fecha en que empezaron (o en la que se conocieron) para el contador de días.
// Fijada para que el estudio muestre 1595 días al 2026-08-20; sigue sumando desde ahí.
const START_DATE = "2022-04-08";
// ====================================================

// Evita que el navegador restaure el scroll donde había quedado al recargar.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

function initDayCounter() {
  const el = document.getElementById("dayCount");
  const start = new Date(START_DATE);
  const days = Math.max(0, Math.floor((Date.now() - start) / 86400000));
  let current = 0;
  const step = Math.max(1, Math.floor(days / 60));
  const timer = setInterval(() => {
    current += step;
    if (current >= days) { current = days; clearInterval(timer); }
    el.textContent = current;
  }, 20);
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((item) => observer.observe(item));
}

function initScrollCue() {
  document.getElementById("scrollCue").addEventListener("click", () => {
    document.getElementById("counter").scrollIntoView({ behavior: "smooth" });
  });
}

function initEnvelope() {
  const envelope = document.getElementById("envelope");
  const hint = document.getElementById("envelopeHint");
  envelope.addEventListener("click", () => {
    envelope.classList.toggle("open");
    hint.textContent = envelope.classList.contains("open") ? "tocá para cerrar" : "tocá el sobre para abrirlo";
  });
}

function initDodgeButton() {
  const btnNo = document.getElementById("btnNo");
  let dodges = 0;
  let cooling = false;

  function moveButtonAwayFrom(clientX, clientY) {
    const btnRect = btnNo.getBoundingClientRect();
    const w = btnRect.width;
    const h = btnRect.height;
    const margin = 16;
    const maxLeft = Math.max(margin, window.innerWidth - w - margin);
    const maxTop = Math.max(margin, window.innerHeight - h - margin);
    let x = margin, y = margin, tries = 0;
    do {
      x = margin + Math.random() * (maxLeft - margin);
      y = margin + Math.random() * (maxTop - margin);
      tries += 1;
    } while (Math.hypot(x + w / 2 - clientX, y + h / 2 - clientY) < 260 && tries < 25);

    btnNo.style.position = "fixed";
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
    btnNo.style.margin = "0";
    dodges += 1;
    if (dodges >= 3) {
      btnNo.textContent = "la muestra parece insuficiente";
    }
    if (dodges >= 8) {
      btnNo.textContent = "los datos apuntan a que sí";
    }
  }

  function handlePointerMove(e) {
    if (cooling) return;
    const btnRect = btnNo.getBoundingClientRect();
    const cx = btnRect.left + btnRect.width / 2;
    const cy = btnRect.top + btnRect.height / 2;
    if (Math.hypot(cx - e.clientX, cy - e.clientY) < 160) {
      moveButtonAwayFrom(e.clientX, e.clientY);
      cooling = true;
      setTimeout(() => { cooling = false; }, 200);
    }
  }

  document.addEventListener("mousemove", handlePointerMove);
  btnNo.addEventListener("click", (e) => { e.preventDefault(); moveButtonAwayFrom(e.clientX, e.clientY); });
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    moveButtonAwayFrom(t.clientX, t.clientY);
  }, { passive: false });
}

const HEART_PATH = "M16 29C8 22 0 16.8 0 9.6 0 4.3 4 0 9.1 0c2.9 0 5.5 1.4 6.9 3.6C17.4 1.4 20 0 22.9 0 28 0 32 4.3 32 9.6 32 16.8 24 22 16 29z";
const HEART_COLORS = ["#e11d3c", "#ff4d6d", "#ff85a1", "#ffb3c1", "#c9184a", "#a4133c", "#ff8fa3", "#d90429"];

function spawnHeartWave(count) {
  const layer = document.getElementById("petal-layer");
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement("div");
      piece.className = "confetti-piece heart-piece";
      const drift = `${(Math.random() * 220 - 110).toFixed(0)}px`;
      piece.style.setProperty("--drift", drift);
      const size = 10 + Math.random() * 42;
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.9}px`;
      piece.innerHTML = `<svg viewBox="0 0 32 29" width="100%" height="100%"><path d="${HEART_PATH}" fill="${color}"/></svg>`;
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.opacity = `${0.65 + Math.random() * 0.35}`;
      piece.style.setProperty("--spin", `${(Math.random() * 720 - 360).toFixed(0)}deg`);
      piece.style.animationDuration = `${2.4 + Math.random() * 3.2}s`;
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 7000);
    }, i * 10);
  }
}

function spawnConfetti() {
  spawnHeartWave(160);
  setTimeout(() => spawnHeartWave(160), 250);
  setTimeout(() => spawnHeartWave(140), 550);
  setTimeout(() => spawnHeartWave(120), 900);
  setTimeout(() => spawnHeartWave(100), 1300);
  setTimeout(() => spawnHeartWave(80), 1800);
}

function initQuestion() {
  const btnYes = document.getElementById("btnYes");
  const questionBox = document.getElementById("questionBox");
  const celebration = document.getElementById("celebration");
  const questionSection = document.getElementById("question");
  const audio = document.getElementById("celebrationAudio");
  const audio2 = document.getElementById("celebrationAudio2");
  audio.addEventListener("ended", () => {
    audio2.currentTime = 0;
    audio2.play().catch(() => {});
  });
  btnYes.addEventListener("click", () => {
    questionBox.hidden = true;
    celebration.hidden = false;
    questionSection.querySelectorAll(".deco").forEach((deco) => { deco.style.display = "none"; });
    spawnConfetti();
    questionSection.classList.add("shake");
    setTimeout(() => questionSection.classList.remove("shake"), 550);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
  initDayCounter();
  initScrollReveal();
  initScrollCue();
  initEnvelope();
  initDodgeButton();
  initQuestion();
});

// Si el navegador restaura la página desde la caché (botón atrás/adelante),
// también forzar el scroll al principio.
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.scrollTo(0, 0);
});
