// Final Integration Script
document.addEventListener('DOMContentLoaded', () => {
  // Load all scripts in the correct order
  const scripts = [
    '/js/enhanced-header.js',
    '/js/comments.js',
    '/js/author.js',
    '/js/particle-background.js',
    '/js/surprise-effects.js'
  ];
  
  // Load CSS files
  const styles = [
    '/css/enhanced-header.css',
    '/css/author.css'
  ];
  
  // Load CSS files
  styles.forEach(style => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = style;
    document.head.appendChild(link);
  });
  
  // Load scripts sequentially
  let scriptIndex = 0;
  
  function loadNextScript() {
    if (scriptIndex < scripts.length) {
      const script = document.createElement('script');
      script.src = scripts[scriptIndex];
      script.onload = loadNextScript;
      document.body.appendChild(script);
      scriptIndex++;
    } else {
      // All scripts loaded, initialize components
      console.log('All scripts loaded successfully!');
      
      // Initialize any remaining components
      if (typeof setupReadingProgressBar === 'function') {
        setupReadingProgressBar();
      }
      
      // Add font for code blocks
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  
  // Start loading scripts
  loadNextScript();
  
  // Add meta tags for SEO and social sharing
  const metaTags = [
    { name: 'description', content: 'Personal tech blog by Q0k0LaTes (Terrence Zhuoting Han)' },
    { name: 'keywords', content: 'tech, web development, programming, Q0k0LaTes, Terrence Zhuoting Han' },
    { property: 'og:title', content: 'Q0k0LaTes Blog - Terrence Zhuoting Han' },
    { property: 'og:description', content: 'Personal tech blog by Q0k0LaTes (Terrence Zhuoting Han)' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://via.placeholder.com/1200x630/5D3FD3/FFFFFF?text=Q0k0LaTes+Blog' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Q0k0LaTes Blog - Terrence Zhuoting Han' },
    { name: 'twitter:description', content: 'Personal tech blog by Q0k0LaTes (Terrence Zhuoting Han)' },
    { name: 'twitter:image', content: 'https://via.placeholder.com/1200x630/5D3FD3/FFFFFF?text=Q0k0LaTes+Blog' }
  ];
  
  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    Object.keys(tag).forEach(key => {
      meta.setAttribute(key, tag[key]);
    });
    document.head.appendChild(meta);
  });
  
  // Add favicon
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABJpJREFUWEe9l21sU2UUx//PbdfSrh0dGzA6YGMTJJKYGUS/mEwwJiZGE40fNPHFxGg0JiaKiYmJMZqYaDQxRD9oTIwaP/hBEz9IjAkxBIgZLxsqyGBjr2zr9nJ7X+71nHvb3a7t3XoXSHjSJved55z/7zznec65hFn+aJb9Yx4BPFrALBfwvwLQdZ0GBgbQ3t4OXdfR1NSE/v5+NDY2YmhoCMuWLUNvby9aWlowODiIpUuXor+/H62trRgYGMDy5cvR19eHtrY29PX1YcWKFejt7UVHRwf6+vrQ3t6Onp4erFy5EuFwGF1dXQiHw1i1ahUikQi6u7uxevVqRCIRdHV1IRqNYs2aNYhGo+js7MTatWsRjUbR2dmJdevWIRaLYfHixdi4cSNisRg6OjqwYcMGxGIxrF+/Hps2bUI8HkdrayvWrVuHeDyOtrY2bN68GYlEAi0tLdi6dSsSiQSam5uxbds2JJNJNDc3Y/v27UgmkyBmRjKZRCqVQiqVQjqdRjqdRiaTQSaTQTabRTabRTabRVNTE3K5HHK5HJqbm5HP55HP57FkyRIUCgUUCgUsXboUxWIRxWIRy5YtQ6lUQqlUwvLly1EqlVAul7FixQqUy2WUy2WsXLkSlUoFlUoFq1atQrVaRbVaxerVq1GtVlGtVrFmzRrUajXUajWsXbsW9XodtVoN69atQ71eR71ex/r161Gv11Gv17Fhwwbk83nk83ls3LgRuVwOuVwOmzZtQjabRTabxebNm5HJZJDJZLBlyxak02mk02ls3boVqVQKqVQK27ZtQzKZRDKZxI4dO5BIJJBIJLBz504kEgkkEgns2rUL8XgcTU1N2L17N+LxOOLxOPbs2YN4PI54PI69e/ciHo8jHo9j3759iMViiMVi2L9/P2KxGGKxGA4cOIBoNIpoNIqDBw8iGo0iGo3i0KFDiEQiiEQiOHz4MCKRCCKRCHp6ehAOhxEOh3HkyBGEw2GEw2EcPXoU4XAY4XAYx44dQzgcRjgcxvHjxxEKhRAKhXDixAmEQiGEQiGcPHkSoVAIoVAIp06dQjAYRDAYxOnTpxEMBhEMBnHmzBkEg0EEg0GcPXsWgUAAgUAAXV1d8Pv98Pv9OHfuHPx+P/x+P86fPw+fzwefz4cLFy7A5/PB5/Ph4sWL8Hq98Hq9uHTpErxeL7xeLy5fvgyPxwOPx4MrV67A4/HA4/Hg6tWrcLvdcLvduHbtGtxuN9xuN65fvw6XywWXy4UbN27A5XLB5XLh5s2bcDqdcDqduHXrFpxOJ5xOJ27fvg2HwwGHw4E7d+7A4XDA4XDg7t27sNvtsNvtuHfvHux2O+x2O+7fvw+bzQabzYYHDx7AZrPBZrPh4cOHsFqtsFqteOSRR2CxWGCxWPDo0SNYLBZYLBbEYjGYzWaYzWY8fvwYZrMZZrMZT548gdlshtlsxtOnT2EymWAymfDs2TOYTCaYTCY8f/4cRqMRRqMRL168gNFohNFoxMuXL2EwGGAwGPDq1SsYDAYYDAa8fv0aer0eer0eb968gV6vh16vx9u3b6HT6aDT6fDu3TvodDrodDq8f/8eWq0WWq0WHz58gFarhVarxcePH6HRaKDRaPDp0ydoNBpoNBp8/vwZarUaarUaX758gVqthlqtxtevX6FSqaBSqfDt2zeoVCqoVCp8//4dSqUSSqUS+vkTkVKpxI8fP6BUKvETaQpn8dDwJCIAAAAASUVORK5CYII=';
  document.head.appendChild(favicon);
});
