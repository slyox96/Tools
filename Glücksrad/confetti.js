const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];

function startConfetti() {
  createConfetti();
  requestAnimationFrame(animateConfetti);
}

function createConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 200; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10,
    });
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    p.y += p.d;
    p.x += Math.sin(p.tilt);
    p.tilt += 0.1;

    confettiCtx.beginPath();
    confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fill();
  });

  confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height);

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}
