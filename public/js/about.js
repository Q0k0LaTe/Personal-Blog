// About Page Component - public/js/about.js

class AboutPage {
    constructor() {
        this.authorData = {
            name: "Terrence Zhuoting Han",
            handle: "Q0k0LaTes",
            bio: "Full-stack developer passionate about creating innovative web solutions. I love exploring new technologies, sharing knowledge, and building tools that make developers' lives easier.",
            photo: "https://via.placeholder.com/200x200/8b0000/ffffff?text=TZH",
            location: "San Francisco, CA",
            skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS", "Express", "CSS", "Git"],
            experience: "3+ years",
            currentFocus: "Building scalable web applications and contributing to open source",
            social: {
                github: "https://github.com/Q0k0LaTes",
                twitter: "https://twitter.com/Q0k0LaTes",
                linkedin: "https://linkedin.com/in/terrence-han",
                email: "terrence@q0k0lates.dev"
            },
            interests: ["Open Source", "Web Performance", "UI/UX Design", "Coffee", "Photography"],
            currentlyLearning: ["TypeScript", "GraphQL", "Docker", "Machine Learning"]
        };
        this.init();
    }

    init() {
        this.createAboutPage();
        this.addAboutStyles();
        this.bindEvents();
    }

    createAboutPage() {
        const aboutContainer = utils.dom.create('div', {
            className: 'about-page-container hidden',
            id: 'about-page',
            innerHTML: `
                <div class="container">
                    <div class="about-content">
                        <!-- Hero Section -->
                        <div class="about-hero">
                            <div class="about-photo-container">
                                <img src="${this.authorData.photo}" alt="${this.authorData.name}" class="about-photo">
                                <div class="photo-overlay">
                                    <i class="fas fa-camera"></i>
                                </div>
                            </div>
                            <div class="about-intro">
                                <h1 class="about-title">About ${this.authorData.name}</h1>
                                <p class="about-subtitle">${this.authorData.handle} • ${this.authorData.location}</p>
                                <p class="about-bio">${this.authorData.bio}</p>
                                <div class="about-stats">
                                    <div class="stat-item">
                                        <span class="stat-number">${this.authorData.experience}</span>
                                        <span class="stat-label">Experience</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">${this.authorData.skills.length}+</span>
                                        <span class="stat-label">Technologies</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">∞</span>
                                        <span class="stat-label">Curiosity</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Story Section -->
                        <div class="about-section">
                            <h2 class="section-title">My Story</h2>
                            <div class="story-content">
                                <div class="story-text">
                                    <p class="story-paragraph">
                                        My journey into the world of programming began during my college years when I encountered 
                                        my first programming challenge. What started as a simple task to automate a repetitive process 
                                        quickly became a passion that would shape my entire career.
                                    </p>
                                    <p class="story-paragraph">
                                        I remember the exact moment when I wrote my first Python script that actually worked. 
                                        The feeling of seeing code transform into something useful, something that could solve 
                                        real problems, was nothing short of magical. That spark has never left me.
                                    </p>
                                    <p class="story-paragraph">
                                        Today, I work as a full-stack developer, crafting digital experiences that bridge the gap 
                                        between complex technology and human needs. Every project is an opportunity to learn 
                                        something new and create something meaningful.
                                    </p>
                                    <p class="story-paragraph">
                                        When I'm not coding, you'll find me exploring San Francisco's vibrant coffee culture, 
                                        contributing to open source projects, or capturing the city's beautiful moments through 
                                        my camera lens. I believe in the power of community and sharing knowledge – which is 
                                        why this blog exists.
                                    </p>
                                </div>
                                <div class="story-timeline">
                                    <div class="timeline-item">
                                        <div class="timeline-year">2021</div>
                                        <div class="timeline-event">Started my development journey</div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-year">2022</div>
                                        <div class="timeline-event">First professional project</div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-year">2023</div>
                                        <div class="timeline-event">Contributed to open source</div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-year">2024</div>
                                        <div class="timeline-event">Built major applications</div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-year">2025</div>
                                        <div class="timeline-event">Launched this blog</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Skills Section -->
                        <div class="about-section">
                            <h2 class="section-title">What I Work With</h2>
                            <div class="skills-grid">
                                <div class="skill-category">
                                    <h3 class="category-title">
                                        <i class="fas fa-code"></i>
                                        Frontend
                                    </h3>
                                    <div class="skills-list">
                                        ${this.renderSkills(['JavaScript', 'React', 'CSS', 'HTML'])}
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h3 class="category-title">
                                        <i class="fas fa-server"></i>
                                        Backend
                                    </h3>
                                    <div class="skills-list">
                                        ${this.renderSkills(['Node.js', 'Express', 'MongoDB', 'Python'])}
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h3 class="category-title">
                                        <i class="fas fa-tools"></i>
                                        Tools & Others
                                    </h3>
                                    <div class="skills-list">
                                        ${this.renderSkills(['Git', 'AWS', 'Docker', 'VS Code'])}
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h3 class="category-title">
                                        <i class="fas fa-graduation-cap"></i>
                                        Currently Learning
                                    </h3>
                                    <div class="skills-list">
                                        ${this.renderSkills(this.authorData.currentlyLearning, 'learning')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Interests Section -->
                        <div class="about-section">
                            <h2 class="section-title">Beyond Code</h2>
                            <div class="interests-grid">
                                ${this.authorData.interests.map(interest => `
                                    <div class="interest-item">
                                        <i class="fas ${this.getInterestIcon(interest)}"></i>
                                        <span>${interest}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Connect Section -->
                        <div class="about-section">
                            <h2 class="section-title">Let's Connect</h2>
                            <p class="connect-intro">
                                I'm always interested in connecting with fellow developers, discussing new projects, 
                                or just having a chat about technology and coffee. Feel free to reach out!
                            </p>
                            <div class="social-links-grid">
                                <a href="${this.authorData.social.github}" class="social-card github" target="_blank">
                                    <div class="social-icon">
                                        <i class="fab fa-github"></i>
                                    </div>
                                    <div class="social-info">
                                        <h3>GitHub</h3>
                                        <p>Check out my code and projects</p>
                                    </div>
                                </a>
                                <a href="${this.authorData.social.twitter}" class="social-card twitter" target="_blank">
                                    <div class="social-icon">
                                        <i class="fab fa-twitter"></i>
                                    </div>
                                    <div class="social-info">
                                        <h3>Twitter</h3>
                                        <p>Follow my tech thoughts and updates</p>
                                    </div>
                                </a>
                                <a href="${this.authorData.social.linkedin}" class="social-card linkedin" target="_blank">
                                    <div class="social-icon">
                                        <i class="fab fa-linkedin"></i>
                                    </div>
                                    <div class="social-info">
                                        <h3>LinkedIn</h3>
                                        <p>Connect professionally</p>
                                    </div>
                                </a>
                                <a href="mailto:${this.authorData.social.email}" class="social-card email">
                                    <div class="social-icon">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="social-info">
                                        <h3>Email</h3>
                                        <p>Drop me a line directly</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <!-- Fun Facts Section -->
                        <div class="about-section fun-facts">
                            <h2 class="section-title">Fun Facts</h2>
                            <div class="facts-grid">
                                <div class="fact-item">
                                    <i class="fas fa-coffee"></i>
                                    <p>I've tried over 50 different coffee shops in San Francisco</p>
                                </div>
                                <div class="fact-item">
                                    <i class="fas fa-code-branch"></i>
                                    <p>My first GitHub commit was a "Hello World" in Python</p>
                                </div>
                                <div class="fact-item">
                                    <i class="fas fa-camera"></i>
                                    <p>I use photography to inspire my UI design choices</p>
                                </div>
                                <div class="fact-item">
                                    <i class="fas fa-book"></i>
                                    <p>I read at least one technical article every morning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });

        // Insert after main content
        const mainContent = utils.dom.qs('.main-content') || utils.dom.qs('main') || document.body;
        mainContent.parentNode.insertBefore(aboutContainer, mainContent.nextSibling);
    }

    renderSkills(skills, type = 'skill') {
        return skills.map(skill => `
            <span class="skill-tag ${type}">${skill}</span>
        `).join('');
    }

    getInterestIcon(interest) {
        const iconMap = {
            'Open Source': 'fa-heart',
            'Web Performance': 'fa-tachometer-alt',
            'UI/UX Design': 'fa-paint-brush',
            'Coffee': 'fa-coffee',
            'Photography': 'fa-camera'
        };
        return iconMap[interest] || 'fa-star';
    }

    addAboutStyles() {
        if (document.querySelector('#about-page-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'about-page-styles',
            innerHTML: `
                .about-page-container {
                    margin-top: var(--space-2xl);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease;
                }

                .about-page-container.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .about-content {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .about-hero {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: var(--space-2xl);
                    margin-bottom: var(--space-3xl);
                    padding: var(--space-2xl);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-dark);
                    position: relative;
                }

                .about-photo-container {
                    position: relative;
                    align-self: start;
                }

                .about-photo {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid var(--accent-primary);
                    transition: all var(--transition-normal);
                }

                .photo-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(139, 0, 0, 0.8);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity var(--transition-normal);
                    color: white;
                    font-size: var(--text-xl);
                }

                .about-photo-container:hover .photo-overlay {
                    opacity: 1;
                }

                .about-title {
                    font-family: var(--font-headline);
                    font-size: var(--text-4xl);
                    font-weight: bold;
                    color: var(--text-primary);
                    margin-bottom: var(--space-sm);
                    line-height: 1.2;
                }

                .about-subtitle {
                    font-size: var(--text-lg);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-lg);
                    font-style: italic;
                }

                .about-bio {
                    font-size: var(--text-lg);
                    line-height: 1.7;
                    color: var(--text-primary);
                    margin-bottom: var(--space-xl);
                }

                .about-stats {
                    display: flex;
                    gap: var(--space-xl);
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-family: var(--font-headline);
                    font-size: var(--text-2xl);
                    font-weight: bold;
                    color: var(--accent-primary);
                    line-height: 1;
                }

                .stat-label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .about-section {
                    margin-bottom: var(--space-3xl);
                    padding: var(--space-2xl);
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                }

                .section-title {
                    font-family: var(--font-headline);
                    font-size: var(--text-3xl);
                    font-weight: bold;
                    color: var(--text-primary);
                    margin-bottom: var(--space-xl);
                    padding-bottom: var(--space-sm);
                    border-bottom: 3px solid var(--accent-primary);
                    display: inline-block;
                }

                .story-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: var(--space-2xl);
                }

                .story-paragraph {
                    font-size: var(--text-lg);
                    line-height: 1.8;
                    margin-bottom: var(--space-lg);
                    text-align: justify;
                    color: var(--text-primary);
                }

                .story-timeline {
                    background: var(--bg-secondary);
                    padding: var(--space-xl);
                    border: 1px solid var(--border-color);
                }

                .timeline-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--space-lg);
                    position: relative;
                }

                .timeline-item:not(:last-child)::after {
                    content: '';
                    position: absolute;
                    left: 30px;
                    top: 100%;
                    width: 2px;
                    height: var(--space-lg);
                    background: var(--accent-primary);
                }

                .timeline-year {
                    background: var(--accent-primary);
                    color: white;
                    padding: var(--space-xs) var(--space-sm);
                    font-weight: bold;
                    font-size: var(--text-sm);
                    margin-right: var(--space-md);
                    min-width: 60px;
                    text-align: center;
                }

                .timeline-event {
                    font-size: var(--text-sm);
                    color: var(--text-primary);
                }

                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-xl);
                }

                .skill-category {
                    background: var(--bg-secondary);
                    padding: var(--space-xl);
                    border: 1px solid var(--border-color);
                }

                .category-title {
                    font-family: var(--font-headline);
                    font-size: var(--text-lg);
                    color: var(--text-primary);
                    margin-bottom: var(--space-lg);
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .category-title i {
                    color: var(--accent-primary);
                }

                .skills-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                }

                .skill-tag {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    padding: var(--space-xs) var(--space-sm);
                    font-size: var(--text-sm);
                    border: 1px solid var(--border-color);
                    transition: all var(--transition-fast);
                }

                .skill-tag:hover {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .skill-tag.learning {
                    background: var(--accent-light);
                    border-color: var(--accent-primary);
                    position: relative;
                }

                .skill-tag.learning::after {
                    content: '🌱';
                    margin-left: var(--space-xs);
                }

                .interests-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-lg);
                }

                .interest-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    padding: var(--space-lg);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    transition: all var(--transition-normal);
                }

                .interest-item:hover {
                    background: var(--bg-tertiary);
                    border-color: var(--accent-primary);
                }

                .interest-item i {
                    font-size: var(--text-xl);
                    color: var(--accent-primary);
                }

                .connect-intro {
                    font-size: var(--text-lg);
                    line-height: 1.7;
                    color: var(--text-primary);
                    margin-bottom: var(--space-xl);
                    text-align: center;
                }

                .social-links-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: var(--space-lg);
                }

                .social-card {
                    display: flex;
                    align-items: center;
                    gap: var(--space-lg);
                    padding: var(--space-xl);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    text-decoration: none;
                    color: var(--text-primary);
                    transition: all var(--transition-normal);
                }

                .social-card:hover {
                    border-color: var(--accent-primary);
                    background: var(--bg-tertiary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-medium);
                }

                .social-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-xl);
                    color: white;
                }

                .social-card.github .social-icon { background: #333; }
                .social-card.twitter .social-icon { background: #1da1f2; }
                .social-card.linkedin .social-icon { background: #0077b5; }
                .social-card.email .social-icon { background: var(--accent-primary); }

                .social-info h3 {
                    font-family: var(--font-headline);
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-xs);
                }

                .social-info p {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin: 0;
                }

                .fun-facts {
                    background: var(--accent-light);
                    border-color: var(--accent-primary);
                }

                .facts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-lg);
                }

                .fact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-md);
                    padding: var(--space-lg);
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                }

                .fact-item i {
                    color: var(--accent-primary);
                    font-size: var(--text-lg);
                    margin-top: var(--space-xs);
                }

                .fact-item p {
                    margin: 0;
                    font-size: var(--text-sm);
                    line-height: 1.6;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .about-hero {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: var(--space-xl);
                    }

                    .about-photo {
                        width: 150px;
                        height: 150px;
                    }

                    .about-stats {
                        justify-content: center;
                        gap: var(--space-lg);
                    }

                    .about-title {
                        font-size: var(--text-3xl);
                    }

                    .story-content {
                        grid-template-columns: 1fr;
                    }

                    .skills-grid {
                        grid-template-columns: 1fr;
                    }

                    .social-links-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindEvents() {
        // Show about page when about navigation is clicked
        utils.dom.on(document, 'click', (e) => {
            const aboutLink = e.target.closest('a[href="#about"], .nav-link[href="#about"]');
            if (aboutLink) {
                e.preventDefault();
                this.showAboutPage();
            }
        });

        // Hide about page when other navigation is clicked
        utils.dom.on(document, 'click', (e) => {
            const navLink = e.target.closest('.nav-link:not([href="#about"])');
            if (navLink) {
                this.hideAboutPage();
            }
        });
    }

    showAboutPage() {
        // Hide main content
        const mainContent = utils.dom.qs('.newspaper-grid, .main-content');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Show about page
        const aboutPage = utils.dom.id('about-page');
        if (aboutPage) {
            aboutPage.classList.remove('hidden');
            setTimeout(() => {
                aboutPage.classList.add('visible');
            }, 100);
        }

        // Update navigation
        const navLinks = utils.dom.qsa('.nav-link');
        navLinks.forEach(link => utils.dom.removeClass(link, 'active'));
        
        const aboutNavLink = utils.dom.qs('.nav-link[href="#about"]');
        if (aboutNavLink) {
            utils.dom.addClass(aboutNavLink, 'active');
        }

        // Update page title
        document.title = 'About - The Q0k0LaTes Chronicle';
    }

    hideAboutPage() {
        // Show main content
        const mainContent = utils.dom.qs('.newspaper-grid, .main-content');
        if (mainContent) {
            mainContent.style.display = '';
        }

        // Hide about page
        const aboutPage = utils.dom.id('about-page');
        if (aboutPage) {
            aboutPage.classList.remove('visible');
            setTimeout(() => {
                aboutPage.classList.add('hidden');
            }, 300);
        }

        // Reset page title
        document.title = 'The Q0k0LaTes Chronicle - Tech News & Insights';
    }

    // Public method to update author data
    updateAuthorData(newData) {
        this.authorData = { ...this.authorData, ...newData };
        // Re-render the about page with new data
        const aboutPage = utils.dom.id('about-page');
        if (aboutPage) {
            aboutPage.remove();
            this.createAboutPage();
        }
    }
}

// Initialize About Page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other components to load first
    setTimeout(() => {
        window.aboutPage = new AboutPage();
    }, 1500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}