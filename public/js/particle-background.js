// Interactive Particle Background
function setupParticleBackground() {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-background';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  canvas.style.opacity = '0.3';
  document.body.appendChild(canvas);
  
  // Get canvas context
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  // Initialize particles
  let particles = [];
  const particleCount = 50;
  const particleColors = [
    'rgba(93, 63, 211, 0.7)',
    'rgba(157, 78, 221, 0.7)',
    'rgba(46, 8, 84, 0.7)'
  ];
  
  // Create particles
  const createParticles = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        connections: []
      });
    }
  };
  
  // Draw particles
  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Reset connections
      particle.connections = [];
    });
    
    // Draw connections between nearby particles
    const maxDistance = 150;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          particles[i].connections.push(j);
          
          // Draw connection
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(93, 63, 211, ${1 - distance / maxDistance})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    // Request next frame
    requestAnimationFrame(drawParticles);
  };
  
  // Initialize
  const init = () => {
    resizeCanvas();
    createParticles();
    drawParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    
    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
      // Find the closest particle and push it away
      let closestParticle = null;
      let closestDistance = Infinity;
      
      particles.forEach(particle => {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestParticle = particle;
        }
      });
      
      if (closestParticle && closestDistance < 100) {
        const angle = Math.atan2(
          closestParticle.y - e.clientY,
          closestParticle.x - e.clientX
        );
        
        closestParticle.speedX += Math.cos(angle) * 0.5;
        closestParticle.speedY += Math.sin(angle) * 0.5;
      }
    });
  };
  
  // Return public methods
  return {
    init,
    toggleVisibility: (visible) => {
      canvas.style.opacity = visible ? '0.3' : '0';
    }
  };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const particleBackground = setupParticleBackground();
  particleBackground.init();
  
  // Add toggle to settings if needed
  const themeSwitch = document.querySelector('.theme-switch-wrapper');
  if (themeSwitch) {
    const particleToggle = document.createElement('div');
    particleToggle.className = 'particle-toggle';
    particleToggle.style.position = 'fixed';
    particleToggle.style.bottom = '80px';
    particleToggle.style.right = '20px';
    particleToggle.style.zIndex = '1000';
    particleToggle.style.display = 'flex';
    particleToggle.style.alignItems = 'center';
    particleToggle.style.justifyContent = 'center';
    particleToggle.style.background = 'var(--accent-primary)';
    particleToggle.style.width = '50px';
    particleToggle.style.height = '50px';
    particleToggle.style.borderRadius = '50%';
    particleToggle.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    particleToggle.style.cursor = 'pointer';
    particleToggle.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    particleToggle.innerHTML = '<i class="fas fa-atom" style="color: white; font-size: 1.5rem;"></i>';
    
    particleToggle.addEventListener('mouseover', () => {
      particleToggle.style.transform = 'translateY(-5px)';
      particleToggle.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
    });
    
    particleToggle.addEventListener('mouseout', () => {
      particleToggle.style.transform = '';
      particleToggle.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    let particlesVisible = true;
    particleToggle.addEventListener('click', () => {
      particlesVisible = !particlesVisible;
      particleBackground.toggleVisibility(particlesVisible);
    });
    
    document.body.appendChild(particleToggle);
  }
});
