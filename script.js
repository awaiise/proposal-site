/* script.js
   Handles:
   - auto-name from URL (?name=)
   - reveal proposal
   - heart particles
   - clickable rose petals on user taps
   - yes/no responses and fireworks
   - music play/pause with custom file 'romance.mp3'
   - opening qr.html
*/

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
const volumeSlider = document.getElementById('volumeSlider');   // may already exist
const loopCheckbox = document.getElementById('loopCheckbox');
const inlineQrArea = document.getElementById('inlineQrArea');
const inlineUrlInput = document.getElementById('inlineUrlInput');
const generateInlineQr = document.getElementById('generateInlineQr');
const downloadInlineQr = document.getElementById('downloadInlineQr');
const inlineQrcode = document.getElementById('inlineQrcode');


const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');

let particles = []; // hearts / petals / fireworks
let width = 0, height = 0;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

/* ------------------ Utility ------------------ */
function rand(min, max) { return Math.random() * (max - min) + min; }

/* ------------------ Auto-fill name from URL ------------------ */
(function autofillFromURL(){
  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  if(name){
    nameInput.value = decodeURIComponent(name);
    title.textContent = `For ${name}...`;
    proposalText.textContent = `Will you marry me, ${name}?`;
  }
})();

/* ------------------ Heart particle (for proposal reveal) ------------------ */
function createHeart(x, y, scale=1){
  const hue = Math.floor(rand(330, 360));
  particles.push({
    type: 'heart',
    x, y,
    vx: rand(-1.6, 1.6),
    vy: rand(-3.2, -1.2),
    life: rand(80, 160),
    size: rand(12, 28) * scale,
    rot: rand(0, Math.PI*2),
    rotV: rand(-0.08, 0.08),
    hue
  });
}

/* ------------------ Petal particle (on click) ------------------ */
function createPetal(x, y){
  particles.push({
    type: 'petal',
    x, y,
    vx: rand(-2.8, 2.8),
    vy: rand(-1.5, 1.5),
    life: rand(160, 320),
    size: rand(10, 22),
    rot: rand(0, Math.PI*2),
    rotV: rand(-0.12, 0.12),
    hue: Math.floor(rand(330, 355))
  });
}

/* ------------------ Firework particle (celebration) ------------------ */
function createFirework(x, y, count=40){
  for(let i=0;i<count;i++){
    const angle = rand(0, Math.PI*2);
    const speed = rand(1.5, 6.0);
    particles.push({
      type: 'spark',
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      life: rand(80, 180),
      size: rand(3, 7),
      hue: Math.floor(rand(0, 360))
    });
  }
}

/* draw helper functions */
function drawHeart(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(1, 1);
  const s = p.size;
  ctx.fillStyle = `hsl(${p.hue}deg 90% 60%)`;
  ctx.beginPath();
  // simple heart with bezier curves
  ctx.moveTo(0, s/4);
  ctx.bezierCurveTo(s/2, -s/2, s*1.5, s/3, 0, s);
  ctx.bezierCurveTo(-s*1.5, s/3, -s/2, -s/2, 0, s/4);
  ctx.fill();
  ctx.restore();
}

function drawPetal(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = `hsl(${p.hue}deg 85% 60%)`;
  ctx.beginPath();
  ctx.ellipse(0,0,p.size*0.6,p.size,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawSpark(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = `hsl(${p.hue}deg 80% 60%)`;
  ctx.beginPath();
  ctx.arc(0,0,p.size,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

/* update & draw loop */
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if(p.type === 'heart' || p.type === 'petal'){
      p.vy += 0.04; // gravity
      p.rot += p.rotV;
      p.life--;
      if(p.type === 'petal') p.vx *= 0.998;
    } else if(p.type === 'spark'){
      p.vy += 0.02;
      p.vx *= 0.995;
      p.vy *= 0.999;
      p.life--;
    }
    if(p.life <= 0 || p.y > height + 60 || p.x < -60 || p.x > width + 60){
      particles.splice(i,1);
    }
  }
}

function render(){
  ctx.clearRect(0,0,width,height);
  for(const p of particles){
    if(p.type === 'heart') drawHeart(p);
    else if(p.type === 'petal') drawPetal(p);
    else if(p.type === 'spark') drawSpark(p);
  }
  requestAnimationFrame(render);
}
render();
setInterval(updateParticles, 1000/60);

/* ------------------ Interaction: reveal, play, qr ------------------ */
showBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if(name){
    title.textContent = `For ${name}...`;
    proposalText.textContent = `Will you marry me, ${name}?`;
  } else {
    title.textContent = `A special question...`;
    proposalText.textContent = `Will you marry me?`;
  }
  proposalBox.classList.remove('hidden');

  // spawn many hearts from center
  const cx = width/2, cy = height/3;
  for(let i=0;i<30;i++) createHeart(cx + rand(-140,140), cy + rand(-40,40), rand(0.8,1.4));
});

// --------- Volume & Fade-in support ---------
const volumeSlider = document.getElementById('volumeSlider');

// initialize volume (use 1.0 default if slider not present)
audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 1.0;

// When slider moves, update audio.volume immediately
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    audio.volume = v;
    currentVolumeTarget = v;
  });
}

// Fade parameters
let fadeInterval = null;
let currentVolumeTarget = audio.volume;

/**
 * Smoothly fade audio volume from current value to target over duration (ms)
 */
function fadeTo(target, duration = 3000) {
  if (!audio) return;
  clearInterval(fadeInterval);
  const start = audio.volume;
  const diff = target - start;
  if (duration <= 0) {
    audio.volume = target;
    if (volumeSlider) volumeSlider.value = target;
    return;
  }

  const steps = Math.round(duration / 50);
  let step = 0;
  fadeInterval = setInterval(() => {
    step++;
    const pct = step / steps;
    const val = start + diff * pct;
    audio.volume = Math.min(1, Math.max(0, val));
    if (volumeSlider) volumeSlider.value = audio.volume.toFixed(2);
    if (step >= steps) {
      clearInterval(fadeInterval);
      audio.volume = target;
      if (volumeSlider) volumeSlider.value = target;
    }
  }, 50);
}

// Enhanced play/pause button with fade-in when starting playback
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.volume = 0.0001;
    currentVolumeTarget = parseFloat(volumeSlider ? volumeSlider.value : 1.0);
    audio.play().then(() => {
      playBtn.textContent = 'Pause Music';
      fadeTo(currentVolumeTarget, 3000);
    }).catch(() => {
      alert("Audio autoplay blocked — please tap Play again if needed.");
      if (volumeSlider) volumeSlider.value = currentVolumeTarget;
    });
  } else {
    audio.pause();
    playBtn.textContent = 'Play Music';
    clearInterval(fadeInterval);
  }
});


qrBtn.addEventListener('click', () => {
  window.open('qr.html', '_blank');
});

/* Click/tap to create rose petals */
canvas.addEventListener('click', (e) => {
  // generate petals near click
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for(let i=0;i<14;i++) createPetal(x + rand(-12,12), y + rand(-12,12));
});

/* Mobile: also generate petals on touch */
canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if(!touch) return;
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  for(let i=0;i<18;i++) createPetal(x + rand(-18,18), y + rand(-18,18));
});

/* Yes / No behaviour */
yesBtn.addEventListener('click', () => {
  afterResponse.textContent = "They said YES! Celebrate together 🎉";
  yesBtn.disabled = true;
  noBtn.disabled = true;

  // fireworks at top center
  createFirework(width/2, height/3, 120);
  // bigger hearts burst
  for(let i=0;i<80;i++) createHeart(width/2 + rand(-240,240), height/3 + rand(-80,80), rand(0.6,1.5));
  // optionally open a secret page after a short delay
  setTimeout(()=> {
    // open secret.html in a new tab (ensure uploaded)
    window.open('secret.html', '_blank');
  }, 1800);
});

noBtn.addEventListener('click', () => {
  afterResponse.textContent = "It’s okay — give them time and stay kind. 💙";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  // gentle petals
  for(let i=0;i<40;i++) createPetal(rand(width*0.2, width*0.8), rand(height*0.05, height*0.4));
});

/* ------------------ Extra: small continuous hearts floating (ambient) ------------------ */
setInterval(()=> {
  // small ambient hearts rising gently on corners
  const side = Math.random() < 0.5 ? 0.08*width : 0.92*width;
  createHeart(side + rand(-30,30), height + 10, rand(0.6,1.0));
}, 900);

/* ------------------ Notes about audio file ------------------ */
/* Put a file named 'romance.mp3' in the same folder as index.html to use your own song.
   If you want to keep the placeholder, it's using 'romance.mp3' so replace that file or change
   the <source> src in index.html to the URL of your audio.
*/

/* ------------------ End ------------------ */
