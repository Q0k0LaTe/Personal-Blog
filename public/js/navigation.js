// Enhanced Navigation - public/js/navigation-enhanced.js
// This replaces the existing navigation.js with personal blog features

class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.mobileMenuOpen = false;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.addNavigationLinks();
        this.bindEvents();
        this.createBreadcrumbs();
        this.handleScrollNavigation();
        this.initializeSectionNavigation();
    }

    addNavigationLinks() {
        // Add About and Admin links to existing navigation
        const navMenu = utils.dom.qs('.nav-menu');
        if (!navMenu) return;

        // Check if links already exist
        if (utils.dom.qs('.nav-link[href="#about"]')) return;

        // Add About link
        const aboutItem = utils.dom.create('li', {
            className: 'nav-item',
            innerHTML: `
                <a href="#about" class="nav-link">
                    <i class="fas fa-user"></i> About
                </a>
            `
        });

        // Add Admin link
        const adminItem = utils.dom.create('li', {
            className: 'nav-item',
            innerHTML: `
                <a href="#admin" class="nav-link">
                    <i class="fas fa-cog"></i> Admin
                </a>
            `
        });

        // Insert before the last item or append
        navMenu.appendChild(aboutItem);
        navMenu.appendChild(adminItem);

        // Add to mobile menu if it exists
        const mobileNav = utils.dom.qs('.mobile-nav');
        if (mobileNav) {
            const aboutMobileLink = utils.dom.create('a', {
                className: 'nav-link',
                href: '#about',
                innerHTML: '<i class="fas fa-user"></i> About'
            });
            
            const adminMobileLink = utils.dom.create('a', {
                className: 'nav-link',
                href: '#admin',
                innerHTML: '<i class="fas fa-cog"></i> Admin'
            });

            mobileNav.appendChild(aboutMobileLink);
            mobileNav.appendChild(adminMobileLink);
        }
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

        // Handle browser back/forward
        utils.dom.on(window, 'popstate', () => {
            this.handlePopState();
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
            
            // Update active states
            this.setActiveLink(link);
            this.closeMobileMenu();
            
            // Handle different sections
            const section = href.substring(1);
            this.navigateToSection(section);
            
            // Update URL
            if (history.pushState) {
                history.pushState({ section }, '', href);
            }
            
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

    navigateToSection(section) {
        this.currentSection = section;
        
        switch (section) {
            case '':
            case 'home':
                this.showHome();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'admin':
                this.showAdmin();
                break;
            default:
                this.scrollToSection(section);
                break;
        }
    }

    showHome() {
        // Show main content
        const mainContent = utils.dom.qs('.newspaper-grid, .main-content');
        if (mainContent) {
            mainContent.style.display = '';
        }

        // Hide other pages
        this.hideAbout();
        this.hideAdmin();

        // Update page title
        document.title = 'The Q0k0LaTes Chronicle - Tech News & Insights';
        
        // Update active navigation
        this.updateActiveNavigation('home');
    }

    showAbout() {
        if (window.aboutPage) {
            window.aboutPage.showAboutPage();
        }
        this.updateActiveNavigation('about');
    }

    showAdmin() {
        if (window.adminDashboard) {
            window.adminDashboard.showAdminDashboard();
        }
        this.updateActiveNavigation('admin');
    }

    hideAbout() {
        if (window.aboutPage) {
            window.aboutPage.hideAboutPage();
        }
    }

    hideAdmin() {
        if (window.adminDashboard) {
            window.adminDashboard.hideAdminDashboard();
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

        // Add active class to clicked link and corresponding mobile link
        utils.dom.addClass(activeLink, 'active');
        
        // Update corresponding link in other menu (desktop/mobile)
        const href = activeLink.getAttribute('href');
        if (href) {
            const correspondingLink = utils.dom.qs(`.nav-link[href="${href}"]:not(.active)`);
            if (correspondingLink) {
                utils.dom.addClass(correspondingLink, 'active');
            }
        }
    }

    updateActiveNavigation(section) {
        const navLinks = utils.dom.qsa('.nav-link, .section-nav-link');
        
        navLinks.forEach(link => {
            utils.dom.removeClass(link, 'active');
            
            const href = link.getAttribute('href');
            if (
                (section === 'home' && (!href || href === '#' || href === '#home')) ||
                (href === `#${section}`)
            ) {
                utils.dom.addClass(link, 'active');
            }
        });
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

        // Quick navigation shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.navigateToSection('home');
                    break;
                case '2':
                    event.preventDefault();
                    this.navigateToSection('about');
                    break;
                case '3':
                    event.preventDefault();
                    this.navigateToSection('admin');
                    break;
            }
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

    handlePopState() {
        const hash = window.location.hash;
        const section = hash ? hash.substring(1) : 'home';
        this.navigateToSection(section);
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