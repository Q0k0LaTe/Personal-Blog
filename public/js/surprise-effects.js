// Text Scramble Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char" style="color: var(--accent-primary);">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Typing Animation
class TypingAnimation {
  constructor(el, text, speed = 100, startDelay = 0) {
    this.el = el;
    this.text = text;
    this.speed = speed;
    this.startDelay = startDelay;
    this.isDeleting = false;
    this.loopNum = 0;
    this.tick();
  }
  
  tick() {
    const i = this.loopNum % this.text.length;
    const fullText = this.text[i];
    
    if (this.isDeleting) {
      this.el.innerHTML = fullText.substring(0, this.el.innerHTML.length - 1);
    } else {
      this.el.innerHTML = fullText.substring(0, this.el.innerHTML.length + 1);
    }
    
    let delta = this.speed;
    
    if (this.isDeleting) {
      delta /= 2;
    }
    
    if (!this.isDeleting && this.el.innerHTML === fullText) {
      delta = 3000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.el.innerHTML === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
    
    setTimeout(() => this.tick(), delta);
  }
}

// 3D Card Hover Effect
function setup3DCardEffect() {
  const cards = document.querySelectorAll('.post-card, .featured-post, .comment, .author-info');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleCardHover);
    card.addEventListener('mouseleave', resetCardPosition);
  });
  
  function handleCardHover(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.transition = 'transform 0.1s ease';
    
    // Add highlight effect
    const intensity = 0.2;
    const highlightX = (x / rect.width) * 100;
    const highlightY = (y / rect.height) * 100;
    
    card.style.background = `
      linear-gradient(
        135deg,
        var(--card-bg) 0%,
        var(--card-bg) 40%,
        rgba(93, 63, 211, ${intensity}) 50%,
        var(--card-bg) 60%,
        var(--card-bg) 100%
      )
    `;
    card.style.backgroundPosition = `${highlightX}% ${highlightY}%`;
  }
  
  function resetCardPosition() {
    this.style.transform = '';
    this.style.background = '';
    this.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease, background 0.5s ease';
  }
}

// Code Syntax Highlighting
function setupCodeHighlighting() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    // Add syntax highlighting classes
    const lines = block.innerHTML.split('\n');
    let highlightedCode = '';
    
    lines.forEach(line => {
      // Simple syntax highlighting for JavaScript
      let highlightedLine = line
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(true|false|null|undefined|this)\b/g, '<span class="literal">$1</span>')
        .replace(/("[^"]*")|('[^']*')|(`[^`]*`)/g, '<span class="string">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        .replace(/\/\/(.*)/g, '<span class="comment">//$1</span>');
      
      highlightedCode += highlightedLine + '\n';
    });
    
    block.innerHTML = highlightedCode;
    
    // Add line numbers
    const pre = block.parentElement;
    pre.classList.add('code-block');
    
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    
    for (let i = 1; i <= lines.length; i++) {
      const lineNumber = document.createElement('span');
      lineNumber.textContent = i;
      lineNumbers.appendChild(lineNumber);
    }
    
    pre.insertBefore(lineNumbers, block);
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = 'Copy to clipboard';
    
    copyButton.addEventListener('click', () => {
      const code = block.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      });
    });
    
    pre.appendChild(copyButton);
  });
  
  // Add CSS for code highlighting
  const style = document.createElement('style');
  style.textContent = `
    .code-block {
      position: relative;
      background: var(--bg-secondary);
      border-radius: 10px;
      padding: 1rem 0 1rem 3.5rem;
      margin: 1.5rem 0;
      overflow: auto;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      border: 1px solid var(--border-color);
    }
    
    .line-numbers {
      position: absolute;
      top: 1rem;
      left: 0;
      width: 3rem;
      text-align: right;
      padding-right: 0.5rem;
      color: var(--text-secondary);
      opacity: 0.5;
      user-select: none;
    }
    
    .line-numbers span {
      display: block;
      line-height: 1.5;
    }
    
    .copy-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--bg-primary);
      border: none;
      border-radius: 4px;
      padding: 0.3rem 0.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .copy-button:hover {
      background: var(--accent-primary);
      color: white;
    }
    
    .keyword { color: var(--accent-primary); }
    .string { color: #9D4EDD; }
    .number { color: #2E0854; }
    .literal { color: #7B5FFF; }
    .comment { color: var(--text-secondary); opacity: 0.7; }
  `;
  
  document.head.appendChild(style);
}

// Reading Progress Bar
function setupReadingProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.style.position = 'fixed';
  progressBar.style.top = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '4px';
  progressBar.style.width = '0%';
  progressBar.style.background = 'var(--accent-primary)';
  progressBar.style.zIndex = '1000';
  progressBar.style.transition = 'width 0.1s ease';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${scrollPercentage}%`;
  });
}

// Scroll Reveal Animation
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.post-card, .featured-post, .comment, .author-info, .section-title');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
  });
  
  // Add CSS for revealed elements
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize text scramble effect on headings
  const headings = document.querySelectorAll('.header-title, .section-title, .featured-title');
  headings.forEach(heading => {
    const originalText = heading.textContent;
    const scramble = new TextScramble(heading);
    
    // Scramble text on hover
    heading.addEventListener('mouseenter', () => {
      scramble.setText(originalText);
    });
  });
  
  // Initialize 3D card hover effect
  setup3DCardEffect();
  
  // Initialize code syntax highlighting
  setupCodeHighlighting();
  
  // Initialize reading progress bar
  setupReadingProgressBar();
  
  // Initialize scroll reveal animation
  setupScrollReveal();
  
  // Add Easter egg
  console.log('%c👋 Hello curious developer!', 'font-size: 20px; color: #5D3FD3; font-weight: bold;');
  console.log('%cWelcome to Q0k0LaTes Blog by Terrence Zhuoting Han', 'font-size: 14px; color: #9D4EDD;');
  console.log('%cFeel free to explore the code and get inspired!', 'font-size: 12px; color: #2E0854;');
});
