type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  originalOpacity: number;
  accelX: number;
  accelY: number;
};

export function initParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let animationId: number;
  const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  // Set canvas size
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  // Create particles
  const particles: Particle[] = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: Math.random() * 0.8 - 0.4,
      speedY: Math.random() * 0.8 - 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      originalOpacity: Math.random() * 0.6 + 0.2,
      accelX: 0,
      accelY: 0,
    });
  }

  function updateParticle(p: Particle, mouseX: number, mouseY: number) {
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      const force = (200 - dist) / 200;
      p.accelX += (dx / dist) * force * 0.05;
      p.accelY += (dy / dist) * force * 0.05;
    }
    
    p.speedX += p.accelX;
    p.speedY += p.accelY;
    p.speedX *= 0.98;
    p.speedY *= 0.98;
    p.accelX *= 0.9;
    p.accelY *= 0.9;
    
    p.x += p.speedX;
    p.y += p.speedY;
    
    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;
    if (p.y > canvas.height) p.y = 0;
    if (p.y < 0) p.y = canvas.height;
    
    const proximityDist = Math.hypot(dx, dy);
    p.opacity = p.originalOpacity * (1 + Math.min(1, (100 - proximityDist) / 100) * 0.5);
  }

  function drawParticle(p: Particle) {
    if (!ctx) return;
    ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      updateParticle(p, mousePos.x, mousePos.y);
      drawParticle(p);
    });
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const opacity = 0.2 * (1 - dist / 150) * (particles[i].opacity + particles[j].opacity) / 2;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  };

  document.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', resize);
  animate();

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', resize);
    canvas.width = 0;
    canvas.height = 0;
  };
}

export function cleanupParticles() {
  // Additional cleanup if needed
}
