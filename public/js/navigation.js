// Navigation - navigation.js

class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.mobileMenuOpen = false;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.bindEvents();
        this.createBreadcrumbs();
        this.handleScrollNavigation();
        this.initializeSectionNavigation();
    }

    bindEvents() {
        // Mobile menu toggle
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.mobile-nav-toggle')) {
                this.toggleMobileMenu();
            }
        });

        // Navigation link clicks
        utils.dom.on(document, 'click', (e) => {
            const navLink = e.target.closest('.nav-link, .section-nav-link');
            if (navLink) {
                this.handleNavigation(e, navLink);
            }
        });

        // Close mobile menu when clicking outside
        utils.dom.on(document, 'click', (e) => {
            if (this.mobileMenuOpen && !e.target.closest('.newspaper-nav')) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        utils.dom.on(window, 'resize', utils.debounce(() => {
            if (window.innerWidth > 768 && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));

        // Scroll spy for navigation
        utils.dom.on(window, 'scroll', utils.throttle(() => {
            this.updateScrollSpy();
            this.handleStickyNavigation();
        }, 100));

        // Keyboard navigation
        utils.dom.on(document, 'keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const mobileNav = utils.dom.qs('.mobile-nav');
        const toggle = utils.dom.qs('.mobile-nav-toggle');
        
        if (mobileNav) {
            utils.dom.toggleClass(mobileNav, 'active');
        }
        
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = this.mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
        const mobileNav = utils.dom.qs('.mobile-nav');
        const toggle = utils.dom.qs('.mobile-nav-toggle');
        
        if (mobileNav) {
            utils.dom.removeClass(mobileNav, 'active');
        }
        
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }

        document.body.style.overflow = '';
    }

    handleNavigation(event, link) {
        const href = link.getAttribute('href');
        
        // Handle hash links (sections on same page)
        if (href && href.startsWith('#')) {
            event.preventDefault();
            this.scrollToSection(href.substring(1));
            this.closeMobileMenu();
            return;
        }

        // Handle external links
        if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
            return; // Let default behavior handle it
        }

        // Handle internal navigation
        if (href && !href.startsWith('#')) {
            this.setActiveLink(link);
            this.closeMobileMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = utils.dom.id(sectionId) || utils.dom.qs(`[data-section="${sectionId}"]`);
        
        if (section) {
            const headerHeight = this.getHeaderHeight();
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL without triggering page reload
            if (history.pushState) {
                history.pushState(null, null, `#${sectionId}`);
            }
        }
    }

    getHeaderHeight() {
        const header = utils.dom.qs('.newspaper-header');
        const nav = utils.dom.qs('.newspaper-nav');
        let height = 0;
        
        if (header) height += header.offsetHeight;
        if (nav) height += nav.offsetHeight;
        
        return height;
    }

    setActiveLink(activeLink) {
        // Remove active class from all nav links
        const allLinks = utils.dom.qsa('.nav-link, .section-nav-link');
        allLinks.forEach(link => {
            utils.dom.removeClass(link, 'active');
        });

        // Add active class to clicked link
        utils.dom.addClass(activeLink, 'active');
    }

    updateScrollSpy() {
        const sections = utils.dom.qsa('[data-section]');
        const headerHeight = this.getHeaderHeight();
        let currentSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top - headerHeight;
            const sectionBottom = rect.bottom - headerHeight;

            if (sectionTop <= 100 && sectionBottom >= 100) {
                currentSection = section.getAttribute('data-section');
            }
        });

        if (currentSection && currentSection !== this.currentSection) {
            this.currentSection = currentSection;
            this.updateActiveNavigation(currentSection);
        }
    }

    updateActiveNavigation(section) {
        const navLinks = utils.dom.qsa('.nav-link, .section-nav-link');
        
        navLinks.forEach(link => {
            utils.dom.removeClass(link, 'active');
            
            const href = link.getAttribute('href');
            if (href === `#${section}` || href === section) {
                utils.dom.addClass(link, 'active');
            }
        });
    }

    handleStickyNavigation() {
        const nav = utils.dom.qs('.newspaper-nav');
        if (!nav) return;

        if (window.scrollY > this.scrollThreshold) {
            utils.dom.addClass(nav, 'sticky');
        } else {
            utils.dom.removeClass(nav, 'sticky');
        }
    }

    handleKeyboardNavigation(event) {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Arrow keys for navigation (when focused)
        if (document.activeElement && document.activeElement.classList.contains('nav-link')) {
            const navLinks = Array.from(utils.dom.qsa('.nav-link'));
            const currentIndex = navLinks.indexOf(document.activeElement);

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[prevIndex].focus();
            }
        }
    }

    createBreadcrumbs() {
        const breadcrumbContainer = utils.dom.qs('.breadcrumb-container');
        if (!breadcrumbContainer) return;

        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);
        
        let breadcrumbHTML = `
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <ol class="breadcrumb-list">
                    <li class="breadcrumb-item">
                        <a href="/" class="breadcrumb-link">Home</a>
                    </li>
        `;

        let currentPath_build = '';
        pathSegments.forEach((segment, index) => {
            currentPath_build += '/' + segment;
            const isLast = index === pathSegments.length - 1;
            const displayName = this.formatBreadcrumbName(segment);

            if (isLast) {
                breadcrumbHTML += `
                    <li class="breadcrumb-item">
                        <span class="breadcrumb-current">${displayName}</span>
                    </li>
                `;
            } else {
                breadcrumbHTML += `
                    <li class="breadcrumb-item">
                        <a href="${currentPath_build}" class="breadcrumb-link">${displayName}</a>
                    </li>
                `;
            }
        });

        breadcrumbHTML += '</ol></nav>';
        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    formatBreadcrumbName(segment) {
        return segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    initializeSectionNavigation() {
        // Create section navigation if it doesn't exist
        this.createSectionNavigation();
        
        // Initialize smooth scrolling for anchor links
        this.initializeAnchorLinks();
    }

    createSectionNavigation() {
        const sections = ['Technology', 'Web Development', 'AI & ML', 'Security', 'Mobile', 'Opinion'];
        const navContainer = utils.dom.qs('.newspaper-nav .container');
        
        if (!navContainer || utils.dom.qs('.section-nav')) return;

        const sectionNav = utils.dom.create('div', {
            className: 'section-nav',
            innerHTML: `
                <div class="container">
                    <ul class="section-nav-list">
                        ${sections.map(section => `
                            <li class="section-nav-item">
                                <a href="#${utils.slugify(section)}" class="section-nav-link">
                                    ${section}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `
        });

        navContainer.parentNode.insertBefore(sectionNav, navContainer.parentNode.nextSibling);
    }

    initializeAnchorLinks() {
        const anchorLinks = utils.dom.qsa('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            utils.dom.on(link, 'click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    this.scrollToSection(href.substring(1));
                }
            });
        });
    }

    // Public methods for external use
    navigateToSection(sectionId) {
        this.scrollToSection(sectionId);
    }

    getCurrentSection() {
        return this.currentSection;
    }

    isMobileMenuOpen() {
        return this.mobileMenuOpen;
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.searchResults = [];
        this.currentQuery = '';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.bindEvents();
    }

    createSearchInterface() {
        const nav = utils.dom.qs('.newspaper-nav .nav-menu');
        if (!nav) return;

        const searchItem = utils.dom.create('li', {
            className: 'nav-item search-item',
            innerHTML: `
                <button class="nav-link search-toggle" aria-label="Toggle search">
                    <i class="fas fa-search"></i>
                </button>
                <div class="search-dropdown">
                    <div class="search-form">
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Search articles..."
                            aria-label="Search"
                        >
                        <button class="search-btn" type="button">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
            `
        });

        nav.appendChild(searchItem);
        this.addSearchStyles();
    }

    addSearchStyles() {
        if (document.querySelector('#search-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'search-styles',
            innerHTML: `
                .search-item {
                    position: relative;
                }
                
                .search-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 350px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-medium);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all var(--transition-normal);
                    z-index: 1000;
                }
                
                .search-dropdown.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .search-form {
                    display: flex;
                    padding: var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    padding: var(--space-sm);
                    font-size: var(--text-sm);
                    background: transparent;
                    color: var(--text-primary);
                }
                
                .search-btn {
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    padding: var(--space-sm) var(--space-md);
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: background-color var(--transition-fast);
                }
                
                .search-btn:hover {
                    background: var(--accent-secondary);
                }
                
                .search-results {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .search-result-item {
                    padding: var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    transition: background-color var(--transition-fast);
                }
                
                .search-result-item:hover {
                    background: var(--bg-secondary);
                }
                
                .search-result-item:last-child {
                    border-bottom: none;
                }
                
                .search-result-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--space-xs);
                }
                
                .search-result-excerpt {
                    font-size: var(--text-sm);
                    color: var(--text-secondary);
                    line-height: 1.4;
                }
                
                @media (max-width: 768px) {
                    .search-dropdown {
                        width: 280px;
                        right: -100px;
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindEvents() {
        // Toggle search dropdown
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.search-toggle')) {
                this.toggleSearchDropdown();
            }
        });

        // Search input
        utils.dom.on(document, 'input', (e) => {
            if (e.target.classList.contains('search-input')) {
                this.handleSearchInput(e.target.value);
            }
        });

        // Search button
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.search-btn')) {
                const input = utils.dom.qs('.search-input');
                if (input) {
                    this.performSearch(input.value);
                }
            }
        });

        // Close search when clicking outside
        utils.dom.on(document, 'click', (e) => {
            if (!e.target.closest('.search-item')) {
                this.closeSearchDropdown();
            }
        });

        // Enter key in search
        utils.dom.on(document, 'keydown', (e) => {
            if (e.target.classList.contains('search-input') && e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value);
            }
        });
    }

    toggleSearchDropdown() {
        const dropdown = utils.dom.qs('.search-dropdown');
        if (dropdown) {
            utils.dom.toggleClass(dropdown, 'active');
            
            if (utils.dom.hasClass(dropdown, 'active')) {
                const input = utils.dom.qs('.search-input');
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            }
        }
    }

    closeSearchDropdown() {
        const dropdown = utils.dom.qs('.search-dropdown');
        if (dropdown) {
            utils.dom.removeClass(dropdown, 'active');
        }
    }

    handleSearchInput(query) {
        clearTimeout(this.searchTimeout);
        this.currentQuery = query.trim();

        if (this.currentQuery.length < 2) {
            this.clearSearchResults();
            return;
        }

        // Debounce search requests
        this.searchTimeout = setTimeout(() => {
            this.performSearch(this.currentQuery);
        }, 300);
    }

    async performSearch(query) {
        if (!query.trim()) return;

        try {
            const response = await utils.api.get(`/api/search?query=${encodeURIComponent(query)}&limit=5`);
            this.searchResults = response.articles || [];
            this.renderSearchResults();
        } catch (error) {
            console.error('Search error:', error);
            // Use demo search results
            this.performDemoSearch(query);
        }
    }

    performDemoSearch(query) {
        // Demo search functionality
        const demoArticles = [
            { id: 1, title: 'The Future of AI Development', excerpt: 'Exploring cutting-edge AI technologies...' },
            { id: 2, title: 'Web Development Best Practices', excerpt: 'Modern approaches to building web applications...' },
            { id: 3, title: 'JavaScript Framework Comparison', excerpt: 'React vs Vue vs Angular in 2025...' }
        ];

        this.searchResults = demoArticles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSearchResults();
    }

    renderSearchResults() {
        const resultsContainer = utils.dom.id('search-results');
        if (!resultsContainer) return;

        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">No results found</div>
                    <div class="search-result-excerpt">Try different keywords</div>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = this.searchResults.map(article => `
            <div class="search-result-item" data-id="${article.id}">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-excerpt">${article.excerpt}</div>
            </div>
        `).join('');

        // Add click handlers to results
        const resultItems = resultsContainer.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            utils.dom.on(item, 'click', () => {
                const articleId = item.dataset.id;
                this.navigateToArticle(articleId);
                this.closeSearchDropdown();
            });
        });
    }

    navigateToArticle(articleId) {
        // Navigate to article (implement based on your routing)
        window.location.href = `#article-${articleId}`;
    }

    clearSearchResults() {
        const resultsContainer = utils.dom.id('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
    window.searchManager = new SearchManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, SearchManager };
}