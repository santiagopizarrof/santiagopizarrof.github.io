// ================== PERSONALIZAR ==================
// Fecha en que empezaron (o en la que se conocieron) para el contador de días.
// Fijada para que el estudio muestre 1595 días al 2026-08-18; sigue sumando desde ahí.
const START_DATE = "2022-04-06";
// ====================================================

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

function spawnConfettiWave(count) {
  const layer = document.getElementById("petal-layer");
  const colors = ["#f6f1e2", "#d97b52", "#91a980", "#e8c5a5", "#4a5c40", "#b9623d"];
  const emojis = ["🎉", "💚", "✨", "🌿", "❤️", "🥳"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const useEmoji = Math.random() < 0.22;
      const drift = `${(Math.random() * 160 - 80).toFixed(0)}px`;
      piece.style.setProperty("--drift", drift);
      if (useEmoji) {
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.fontSize = `${16 + Math.random() * 14}px`;
      } else {
        const w = 6 + Math.random() * 8;
        piece.style.width = `${w}px`;
        piece.style.height = `${Math.random() < 0.5 ? w : w * 2.2}px`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() < 0.4) piece.style.borderRadius = "50%";
      }
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.animationDuration = `${2.6 + Math.random() * 2.8}s`;
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 6500);
    }, i * 18);
  }
}

function spawnConfetti() {
  spawnConfettiWave(110);
  setTimeout(() => spawnConfettiWave(90), 350);
  setTimeout(() => spawnConfettiWave(70), 750);
}

function initQuestion() {
  const btnYes = document.getElementById("btnYes");
  const questionBox = document.getElementById("questionBox");
  const celebration = document.getElementById("celebration");
  const questionSection = document.getElementById("question");
  const audio = document.getElementById("celebrationAudio");
  btnYes.addEventListener("click", () => {
    questionBox.hidden = true;
    celebration.hidden = false;
    spawnConfetti();
    questionSection.classList.add("shake");
    setTimeout(() => questionSection.classList.remove("shake"), 550);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDayCounter();
  initScrollReveal();
  initScrollCue();
  initEnvelope();
  initDodgeButton();
  initQuestion();
});
