// DOM elements
const nameInput = document.getElementById('nameInput');
const showBtn = document.getElementById('showBtn');
const playBtn = document.getElementById('playBtn');
const qrBtn = document.getElementById('qrBtn');
const title = document.getElementById('title');
const proposalBox = document.getElementById('proposalBox');
const proposalText = document.getElementById('proposalText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const afterResponse = document.getElementById('afterResponse');
const audio = document.getElementById('proposal-audio');

// Show personalized proposal and start confetti
showBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    title.textContent = `For ${name}...`;
    proposalText.textContent = `Will you marry me, ${name}?`;
  } else {
    title.textContent = `A special question...`;
    proposalText.textContent = `Will you marry me?`;
  }

  // show the proposal box
  proposalBox.classList.remove('hidden');

  // start confetti burst
  runConfettiBurst();
});

// Play / pause audio
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {
      alert("Audio autoplay blocked — please tap Play again if needed.");
    });
    playBtn.textContent = 'Pause Music';
  } else {
    audio.pause();
    playBtn.textContent = 'Play Music';
  }
});

// Open QR generator
qrBtn.addEventListener('click', () => {
  window.open('qr.html', '_blank');
});

// Yes / No response behavior
yesBtn.addEventListener('click', () => {
  afterResponse.textContent = "They said YES! Celebrate together 🎉";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  // add a longer confetti celebration
  spawnConfetti(400);
});

noBtn.addEventListener('click', () => {
  afterResponse.textContent = "It’s okay — give them time and stay kind. 💙";
  yesBtn.disabled = true;
  noBtn.disabled = true;
});

// -------------------- Confetti (simple implementation) --------------------
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let confettiParticles = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

function spawnConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: rand(0, canvas.width),
      y: rand(-canvas.height * 0.4, canvas.height),
      w: rand(6, 14),
      h: rand(8, 18),
      vx: rand(-3, 3),
      vy: rand(2, 6),
      angle: rand(0, Math.PI * 2),
      angularVel: rand(-0.2, 0.2),
      color: `hsl(${Math.floor(rand(0, 360))}deg ${Math.floor(rand(65, 90))}% ${Math.floor(rand(40, 60))}%)`,
      ttl: rand(120, 260)
    });
  }
}

function updateParticles() {
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.angle += p.angularVel;
    p.ttl--;
    if (p.y > canvas.height + 60 || p.ttl <= 0) confettiParticles.splice(i, 1);
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
}

function loop() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(loop);
}
loop();

function runConfettiBurst() {
  spawnConfetti(180);
}
