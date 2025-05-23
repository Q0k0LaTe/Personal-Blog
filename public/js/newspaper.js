// Newspaper Components - newspaper.js

// Breaking News Ticker
class BreakingNewsManager {
    constructor() {
        this.newsItems = [
            "TECH BREAKTHROUGH: New AI Model Achieves Human-Level Performance in Complex Reasoning Tasks",
            "BREAKING: Major Cloud Provider Announces Revolutionary Edge Computing Platform",
            "URGENT: Critical Security Vulnerability Discovered in Popular JavaScript Framework",
            "DEVELOPING: Tech Giant Unveils Next-Generation Quantum Computing Chip"
        ];
        this.currentIndex = 0;
        this.isActive = false;
        this.init();
    }

    init() {
        this.createBreakingNewsBanner();
        this.startNewsTicker();
        this.bindEvents();
    }

    createBreakingNewsBanner() {
        const existingBanner = utils.dom.qs('.breaking-news');
        if (existingBanner) return;

        const banner = utils.dom.create('div', {
            className: 'breaking-news',
            innerHTML: `
                <div class="breaking-news-content">
                    <span class="breaking-label">🚨 BREAKING:</span>
                    <span class="breaking-text">${this.newsItems[0]}</span>
                </div>
                <button class="breaking-close" aria-label="Close breaking news">
                    <i class="fas fa-times"></i>
                </button>
            `
        });

        document.body.insertBefore(banner, document.body.firstChild);
        this.isActive = true;

        // Add styles
        this.addBreakingNewsStyles();
    }

    addBreakingNewsStyles() {
        if (document.querySelector('#breaking-news-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'breaking-news-styles',
            innerHTML: `
                .breaking-news {
                    background: var(--accent-primary);
                    color: white;
                    padding: var(--space-sm) 0;
                    text-align: center;
                    font-family: var(--font-sans);
                    font-weight: 600;
                    position: relative;
                    z-index: 1000;
                    animation: slideDown 0.5s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                
                .breaking-news-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 var(--space-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-md);
                }
                
                .breaking-label {
                    font-size: var(--text-sm);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .breaking-text {
                    font-size: var(--text-sm);
                    flex: 1;
                    text-align: left;
                }
                
                .breaking-close {
                    position: absolute;
                    right: var(--space-lg);
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: white;
                    font-size: var(--text-lg);
                    cursor: pointer;
                    padding: var(--space-xs);
                    opacity: 0.8;
                    transition: opacity var(--transition-fast);
                }
                
                .breaking-close:hover {
                    opacity: 1;
                }
                
                @media (max-width: 768px) {
                    .breaking-news-content {
                        flex-direction: column;
                        gap: var(--space-xs);
                        padding: 0 var(--space-md);
                    }
                    
                    .breaking-text {
                        text-align: center;
                        font-size: var(--text-xs);
                    }
                    
                    .breaking-close {
                        position: static;
                        transform: none;
                        margin-top: var(--space-xs);
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    startNewsTicker() {
        if (this.newsItems.length <= 1) return;

        setInterval(() => {
            if (this.isActive) {
                this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
                this.updateNewsText();
            }
        }, 8000); // Change news every 8 seconds
    }

    updateNewsText() {
        const textElement = utils.dom.qs('.breaking-text');
        if (textElement) {
            textElement.style.opacity = '0';
            
            setTimeout(() => {
                textElement.textContent = this.newsItems[this.currentIndex];
                textElement.style.opacity = '1';
            }, 250);
        }
    }

    bindEvents() {
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.breaking-close')) {
                this.closeBanner();
            }
        });
    }

    closeBanner() {
        const banner = utils.dom.qs('.breaking-news');
        if (banner) {
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                banner.remove();
                this.isActive = false;
            }, 300);
        }
    }

    addNews(newsText) {
        this.newsItems.unshift(newsText);
        if (this.newsItems.length > 10) {
            this.newsItems = this.newsItems.slice(0, 10);
        }
    }
}

// Article Reading Progress
class ReadingProgressManager {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.bindScrollEvent();
    }

    createProgressBar() {
        this.progressBar = utils.dom.create('div', {
            className: 'reading-progress',
            innerHTML: '<div class="reading-progress-fill"></div>'
        });

        document.body.appendChild(this.progressBar);
        this.addProgressStyles();
    }

    addProgressStyles() {
        if (document.querySelector('#reading-progress-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'reading-progress-styles',
            innerHTML: `
                .reading-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    transition: opacity var(--transition-normal);
                }
                
                .reading-progress-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    width: 0%;
                    transition: width 0.1s ease;
                }
                
                .reading-progress.hidden {
                    opacity: 0;
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindScrollEvent() {
        utils.dom.on(window, 'scroll', utils.throttle(() => {
            this.updateProgress();
        }, 50));
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;

        const fillElement = utils.dom.qs('.reading-progress-fill');
        if (fillElement) {
            fillElement.style.width = `${Math.min(scrollPercentage, 100)}%`;
        }

        // Hide progress bar at top of page
        if (scrollTop < 100) {
            utils.dom.addClass(this.progressBar, 'hidden');
        } else {
            utils.dom.removeClass(this.progressBar, 'hidden');
        }
    }
}

// Print Styles Manager
class PrintManager {
    constructor() {
        this.init();
    }

    init() {
        this.addPrintStyles();
        this.bindPrintEvents();
    }

    addPrintStyles() {
        if (document.querySelector('#print-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'print-styles',
            innerHTML: `
                @media print {
                    /* Hide non-essential elements */
                    .breaking-news,
                    .newspaper-nav,
                    .theme-toggle,
                    .weather-widget,
                    .stock-ticker,
                    .newsletter-signup,
                    .comments-section,
                    .sidebar,
                    .reading-progress {
                        display: none !important;
                    }
                    
                    /* Ensure proper printing layout */
                    .newspaper-grid {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .main-content {
                        max-width: 100% !important;
                    }
                    
                    /* Typography for print */
                    body {
                        font-size: 12pt !important;
                        line-height: 1.4 !important;
                        color: black !important;
                        background: white !important;
                    }
                    
                    .masthead {
                        font-size: 24pt !important;
                        color: black !important;
                        border-bottom: 2px solid black !important;
                        margin-bottom: 20pt !important;
                    }
                    
                    .headline-primary {
                        font-size: 18pt !important;
                        color: black !important;
                        margin-bottom: 10pt !important;
                    }
                    
                    .headline-secondary {
                        font-size: 16pt !important;
                        color: black !important;
                    }
                    
                    .headline-tertiary {
                        font-size: 14pt !important;
                        color: black !important;
                    }
                    
                    /* Article spacing */
                    .article-card,
                    .featured-article {
                        page-break-inside: avoid;
                        margin-bottom: 20pt !important;
                        border: 1px solid black !important;
                        padding: 10pt !important;
                    }
                    
                    /* Images */
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    
                    /* Links */
                    a {
                        color: black !important;
                        text-decoration: underline !important;
                    }
                    
                    /* Page breaks */
                    .featured-article {
                        page-break-after: always;
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindPrintEvents() {
        // Add print button functionality
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.print-button')) {
                this.printPage();
            }
        });

        // Keyboard shortcut (Ctrl+P)
        utils.dom.on(document, 'keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                // Let browser handle default print behavior
            }
        });
    }

    printPage() {
        window.print();
    }

    addPrintButton() {
        const nav = utils.dom.qs('.newspaper-nav .nav-menu');
        if (!nav || utils.dom.qs('.print-button')) return;

        const printButton = utils.dom.create('li', {
            className: 'nav-item',
            innerHTML: `
                <button class="nav-link print-button" aria-label="Print page">
                    <i class="fas fa-print"></i>
                </button>
            `
        });

        nav.appendChild(printButton);
    }
}

// Social Share Manager
class SocialShareManager {
    constructor() {
        this.init();
    }

    init() {
        this.createShareButtons();
        this.bindEvents();
    }

    createShareButtons() {
        const articles = utils.dom.qsa('.article-card, .featured-article');
        
        articles.forEach(article => {
            if (article.querySelector('.share-buttons')) return;

            const title = article.querySelector('.headline-primary, .headline-secondary, .headline-tertiary')?.textContent || '';
            const url = window.location.href;

            const shareButtons = utils.dom.create('div', {
                className: 'share-buttons',
                innerHTML: `
                    <span class="share-label">Share:</span>
                    <button class="share-btn twitter-share" data-title="${title}" data-url="${url}">
                        <i class="fab fa-twitter"></i>
                    </button>
                    <button class="share-btn facebook-share" data-title="${title}" data-url="${url}">
                        <i class="fab fa-facebook-f"></i>
                    </button>
                    <button class="share-btn linkedin-share" data-title="${title}" data-url="${url}">
                        <i class="fab fa-linkedin-in"></i>
                    </button>
                    <button class="share-btn copy-link" data-url="${url}">
                        <i class="fas fa-link"></i>
                    </button>
                `
            });

            const content = article.querySelector('.article-content, .featured-content');
            if (content) {
                content.appendChild(shareButtons);
            }
        });

        this.addShareStyles();
    }

    addShareStyles() {
        if (document.querySelector('#share-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'share-styles',
            innerHTML: `
                .share-buttons {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    margin-top: var(--space-lg);
                    padding-top: var(--space-md);
                    border-top: 1px solid var(--border-color);
                }
                
                .share-label {
                    font-family: var(--font-sans);
                    font-size: var(--text-sm);
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                
                .share-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    font-size: var(--text-sm);
                }
                
                .twitter-share {
                    background: #1DA1F2;
                    color: white;
                }
                
                .facebook-share {
                    background: #1877F2;
                    color: white;
                }
                
                .linkedin-share {
                    background: #0A66C2;
                    color: white;
                }
                
                .copy-link {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .share-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-medium);
                }
                
                .copy-link:hover {
                    background: var(--accent-primary);
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .share-buttons {
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindEvents() {
        utils.dom.on(document, 'click', (e) => {
            const button = e.target.closest('.share-btn');
            if (!button) return;

            const title = button.dataset.title || document.title;
            const url = button.dataset.url || window.location.href;

            if (button.classList.contains('twitter-share')) {
                this.shareToTwitter(title, url);
            } else if (button.classList.contains('facebook-share')) {
                this.shareToFacebook(url);
            } else if (button.classList.contains('linkedin-share')) {
                this.shareToLinkedIn(title, url);
            } else if (button.classList.contains('copy-link')) {
                this.copyToClipboard(url, button);
            }
        });
    }

    shareToTwitter(title, url) {
        const tweetText = encodeURIComponent(`${title} ${url} via @Q0k0LaTes`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=600,height=400');
    }

    shareToFacebook(url) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    }

    shareToLinkedIn(title, url) {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=400');
    }

    async copyToClipboard(url, button) {
        try {
            await navigator.clipboard.writeText(url);
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success-color)';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
                button.style.color = '';
            }, 2000);
            
            utils.notify.success('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
            utils.notify.error('Failed to copy link');
        }
    }
}

// Article Analytics
class ArticleAnalytics {
    constructor() {
        this.viewedArticles = new Set();
        this.readingTimes = new Map();
        this.init();
    }

    init() {
        this.trackPageViews();
        this.trackReadingTime();
        this.trackScrollDepth();
    }

    trackPageViews() {
        // Track when articles come into view
        const articles = utils.dom.qsa('.article-card, .featured-article');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.viewedArticles.has(entry.target)) {
                    this.viewedArticles.add(entry.target);
                    this.recordArticleView(entry.target);
                }
            });
        }, { threshold: 0.5 });

        articles.forEach(article => observer.observe(article));
    }

    recordArticleView(article) {
        const title = article.querySelector('.headline-primary, .headline-secondary, .headline-tertiary')?.textContent;
        if (title) {
            console.log(`Article viewed: ${title}`);
            // In production, send to analytics service
            this.sendAnalytics('article_view', { title });
        }
    }

    trackReadingTime() {
        const startTime = Date.now();
        
        // Track time when user leaves page
        utils.dom.on(window, 'beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.sendAnalytics('reading_time', { seconds: timeSpent });
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        utils.dom.on(window, 'scroll', utils.throttle(() => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentDepth = Math.round((scrollTop / documentHeight) * 100);
            
            if (currentDepth > maxScrollDepth) {
                maxScrollDepth = currentDepth;
                
                // Track milestone depths
                if ([25, 50, 75, 100].includes(maxScrollDepth)) {
                    this.sendAnalytics('scroll_depth', { depth: maxScrollDepth });
                }
            }
        }, 1000));
    }

    sendAnalytics(event, data) {
        // In production, send to your analytics service
        console.log(`Analytics: ${event}`, data);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
    }
}

// Archive Navigation
class ArchiveManager {
    constructor() {
        this.archives = [];
        this.init();
    }

    init() {
        this.createArchiveNavigation();
        this.loadArchiveData();
    }

    createArchiveNavigation() {
        const sidebar = utils.dom.qs('.sidebar');
        if (!sidebar || utils.dom.qs('.archive-section')) return;

        const archiveSection = utils.dom.create('div', {
            className: 'sidebar-section archive-section',
            innerHTML: `
                <h3 class="sidebar-title">Archives</h3>
                <div class="archive-list" id="archive-list">
                    <!-- Archive items will be loaded here -->
                </div>
            `
        });

        sidebar.appendChild(archiveSection);
        this.addArchiveStyles();
    }

    addArchiveStyles() {
        if (document.querySelector('#archive-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'archive-styles',
            innerHTML: `
                .archive-list {
                    list-style: none;
                }
                
                .archive-item {
                    margin-bottom: var(--space-sm);
                }
                
                .archive-link {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-sm);
                    color: var(--text-primary);
                    text-decoration: none;
                    border-radius: var(--border-radius);
                    transition: all var(--transition-fast);
                    font-size: var(--text-sm);
                }
                
                .archive-link:hover {
                    background: var(--bg-secondary);
                    color: var(--accent-primary);
                }
                
                .archive-date {
                    font-weight: 500;
                }
                
                .archive-count {
                    background: var(--bg-secondary);
                    color: var(--text-muted);
                    padding: var(--space-xs) var(--space-sm);
                    border-radius: var(--border-radius);
                    font-size: var(--text-xs);
                    font-weight: 500;
                }
                
                .archive-link:hover .archive-count {
                    background: var(--accent-primary);
                    color: white;
                }
            `
        });

        document.head.appendChild(styles);
    }

    loadArchiveData() {
        // Generate demo archive data
        const currentDate = new Date();
        const archives = [];
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const count = Math.floor(Math.random() * 15) + 1;
            
            archives.push({
                date: date,
                count: count,
                url: `#archive-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            });
        }
        
        this.archives = archives;
        this.renderArchives();
    }

    renderArchives() {
        const archiveList = utils.dom.id('archive-list');
        if (!archiveList) return;

        archiveList.innerHTML = this.archives.map(archive => `
            <div class="archive-item">
                <a href="${archive.url}" class="archive-link">
                    <span class="archive-date">
                        ${archive.date.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                        })}
                    </span>
                    <span class="archive-count">${archive.count}</span>
                </a>
            </div>
        `).join('');
    }
}

// Lazy Loading Manager
class LazyLoadManager {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        this.setupImageLazyLoading();
        this.setupContentLazyLoading();
    }

    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });

            // Observe all images with data-src
            const lazyImages = utils.dom.qsa('img[data-src]');
            lazyImages.forEach(img => this.imageObserver.observe(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    setupContentLazyLoading() {
        // Lazy load article content when scrolled into view
        const articles = utils.dom.qsa('.article-card[data-content-url]');
        
        if (articles.length && 'IntersectionObserver' in window) {
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadArticleContent(entry.target);
                        contentObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px' });

            articles.forEach(article => contentObserver.observe(article));
        }
    }

    async loadArticleContent(article) {
        const contentUrl = article.dataset.contentUrl;
        if (!contentUrl) return;

        try {
            const response = await fetch(contentUrl);
            const data = await response.json();
            
            // Update article with loaded content
            const excerptElement = article.querySelector('.article-excerpt');
            if (excerptElement && data.excerpt) {
                excerptElement.textContent = data.excerpt;
            }
            
            article.removeAttribute('data-content-url');
        } catch (error) {
            console.error('Failed to load article content:', error);
        }
    }

    // Public method to add new lazy images
    observeImage(img) {
        if (this.imageObserver && img.dataset.src) {
            this.imageObserver.observe(img);
        }
    }
}

// Initialize all newspaper components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components with slight delays to prevent blocking
    setTimeout(() => {
        window.breakingNewsManager = new BreakingNewsManager();
    }, 100);
    
    setTimeout(() => {
        window.readingProgressManager = new ReadingProgressManager();
    }, 200);
    
    setTimeout(() => {
        window.printManager = new PrintManager();
        window.printManager.addPrintButton();
    }, 300);
    
    setTimeout(() => {
        window.socialShareManager = new SocialShareManager();
    }, 400);
    
    setTimeout(() => {
        window.articleAnalytics = new ArticleAnalytics();
    }, 500);
    
    setTimeout(() => {
        window.archiveManager = new ArchiveManager();
    }, 600);
    
    setTimeout(() => {
        window.lazyLoadManager = new LazyLoadManager();
    }, 700);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BreakingNewsManager,
        ReadingProgressManager,
        PrintManager,
        SocialShareManager,
        ArticleAnalytics,
        ArchiveManager,
        LazyLoadManager
    };
}