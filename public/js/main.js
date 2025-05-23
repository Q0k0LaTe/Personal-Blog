// Clean Integration - Enhanced main.js
// This replaces the existing main.js with proper photos and fixed About page

const { useState, useEffect, useRef } = React;

// Sample data with proper photos
const blogData = {
    author: {
        name: "Terrence Zhuoting Han",
        handle: "Q0k0LaTes",
        bio: "Full-stack developer passionate about creating innovative web solutions. I love exploring new technologies, sharing knowledge, and building tools that make developers' lives easier.",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        location: "San Francisco, CA",
        skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS"],
        social: {
            github: "https://github.com/Q0k0LaTes",
            twitter: "https://twitter.com/Q0k0LaTes",
            linkedin: "https://linkedin.com/in/terrence-han",
            email: "terrence@q0k0lates.dev"
        }
    },
    articles: [
        {
            id: 1,
            title: "Building My Personal Blog with React and Express",
            excerpt: "A deep dive into the architecture and design decisions behind this personal blog. From newspaper-style CSS to React components, here's how I built a modern yet classic-looking blog.",
            content: `When I decided to create my personal blog, I wanted something that felt both modern and timeless. The newspaper aesthetic appealed to me because it represents the fundamental purpose of sharing information and stories.

## The Tech Stack

I chose React for the frontend because of its component-based architecture and excellent developer experience. For the backend, Express.js provides a lightweight yet powerful server framework.

### Frontend Architecture
- **React Components**: Modular, reusable UI elements
- **CSS Variables**: Dynamic theming system
- **Responsive Design**: Mobile-first approach

### Backend Architecture  
- **Express.js**: RESTful API endpoints
- **MongoDB**: Document-based data storage
- **Mongoose**: Elegant MongoDB object modeling

## Design Philosophy

The newspaper-style design isn't just aesthetic - it's functional. The column layout, typography choices, and spacing create a reading experience that's both familiar and engaging.

This blog represents my journey as a developer and my commitment to sharing knowledge with the community.`,
            category: "Web Development",
            tags: ["React", "Express", "MongoDB", "Personal"],
            date: new Date().toISOString(),
            featured: true,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
            readTime: "8 min read"
        },
        {
            id: 2,
            title: "My Journey into Full-Stack Development",
            excerpt: "From my first 'Hello World' to building production applications - here's my story of becoming a full-stack developer and the lessons learned along the way.",
            content: "Full article content here...",
            category: "Personal",
            tags: ["Career", "Learning", "Development"],
            date: new Date(Date.now() - 86400000).toISOString(),
            featured: false,
            image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
            readTime: "6 min read"
        },
        {
            id: 3,
            title: "Why I Choose Open Source",
            excerpt: "Contributing to open source has shaped my career and philosophy as a developer. Here's why I believe every developer should consider contributing.",
            content: "Full article content here...",
            category: "Opinion",
            tags: ["Open Source", "Community", "Development"],
            date: new Date(Date.now() - 172800000).toISOString(),
            featured: false,
            image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop",
            readTime: "5 min read"
        },
        {
            id: 4,
            title: "JavaScript Tips That Changed My Coding",
            excerpt: "Five JavaScript techniques that transformed how I write code and made me a more efficient developer.",
            content: "Full article content here...",
            category: "Tutorial",
            tags: ["JavaScript", "Tips", "Best Practices"],
            date: new Date(Date.now() - 259200000).toISOString(),
            featured: false,
            image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop",
            readTime: "4 min read"
        }
    ],
    sidebarArticles: [
        {
            id: 5,
            title: "5G Network Expansion Accelerates",
            date: new Date(Date.now() - 86400000).toISOString(),
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=60&fit=crop"
        },
        {
            id: 6,
            title: "New Programming Languages to Watch",
            date: new Date(Date.now() - 172800000).toISOString(),
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=80&h=60&fit=crop"
        },
        {
            id: 7,
            title: "Cloud Computing Market Trends",
            date: new Date(Date.now() - 259200000).toISOString(),
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&h=60&fit=crop"
        }
    ]
};

// Theme management
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(current => current === 'light' ? 'dark' : 'light');
    };

    return [theme, toggleTheme];
};

// Breaking News Component - REMOVED

// Header Component
function NewspaperHeader() {
    const [theme, toggleTheme] = useTheme();
    const currentDate = new Date();
    
    return React.createElement('header', { className: 'newspaper-header' },
        // Theme Toggle
        React.createElement('button', { 
            className: 'theme-toggle',
            onClick: toggleTheme,
            'aria-label': 'Toggle theme'
        }, React.createElement('i', { className: `fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}` })),
        
        // Info Bar
        React.createElement('div', { className: 'header-info-bar' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'info-bar-content' },
                    React.createElement('div', { className: 'date-info' },
                        React.createElement('div', { className: 'current-date' },
                            React.createElement('i', { className: 'far fa-calendar-alt' }),
                            React.createElement('span', null, utils.formatDate(currentDate))
                        ),
                        React.createElement('div', { className: 'current-time' },
                            React.createElement('i', { className: 'far fa-clock' }),
                            React.createElement('span', null, currentDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }))
                        )
                    ),
                    React.createElement('div', { className: 'weather-info' },
                        React.createElement('i', { className: 'fas fa-cloud-sun' }),
                        React.createElement('span', null, '22°C San Francisco')
                    )
                )
            )
        ),
        
        // Main Header
        React.createElement('div', { className: 'main-header' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'edition-info' }, 
                    `Vol. 1, No. 1 • ${utils.formatDate(currentDate)}`
                ),
                React.createElement('h1', { className: 'masthead' }, "Q0k0LaTes' Personal Blog"),
                // Removed tagline
            )
        )
    );
}

// Navigation Component
function Navigation({ currentPage, onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    return React.createElement('nav', { className: 'newspaper-nav' },
        React.createElement('div', { className: 'container nav-container' },
            React.createElement('button', { 
                className: 'mobile-nav-toggle',
                onClick: toggleMobileMenu,
                'aria-label': 'Toggle navigation'
            },
                React.createElement('i', { className: mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars' })
            ),
            
            React.createElement('ul', { className: 'nav-menu' },
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { 
                        className: `nav-link ${currentPage === 'home' ? 'active' : ''}`,
                        href: '#',
                        onClick: (e) => { e.preventDefault(); onNavigate('home'); }
                    }, 'Home')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { 
                        className: `nav-link ${currentPage === 'about' ? 'active' : ''}`,
                        href: '#',
                        onClick: (e) => { e.preventDefault(); onNavigate('about'); }
                    }, 'About')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { 
                        className: `nav-link ${currentPage === 'admin' ? 'active' : ''}`,
                        href: '#',
                        onClick: (e) => { e.preventDefault(); onNavigate('admin'); }
                    }, 'Admin')
                )
            ),
            
            // Mobile Menu
            React.createElement('div', { 
                className: `mobile-nav ${mobileMenuOpen ? 'active' : ''}` 
            },
                React.createElement('a', { 
                    className: `nav-link ${currentPage === 'home' ? 'active' : ''}`,
                    href: '#',
                    onClick: (e) => { e.preventDefault(); onNavigate('home'); setMobileMenuOpen(false); }
                }, 'Home'),
                React.createElement('a', { 
                    className: `nav-link ${currentPage === 'about' ? 'active' : ''}`,
                    href: '#',
                    onClick: (e) => { e.preventDefault(); onNavigate('about'); setMobileMenuOpen(false); }
                }, 'About'),
                React.createElement('a', { 
                    className: `nav-link ${currentPage === 'admin' ? 'active' : ''}`,
                    href: '#',
                    onClick: (e) => { e.preventDefault(); onNavigate('admin'); setMobileMenuOpen(false); }
                }, 'Admin')
            )
        )
    );
}

// Article Card Component
function ArticleCard({ article }) {
    return React.createElement('article', { className: 'article-card' },
        React.createElement('div', { className: 'image-wrapper' },
            React.createElement('img', {
                className: 'article-image',
                src: article.image,
                alt: article.title,
                loading: 'lazy'
            })
        ),
        
        React.createElement('div', { className: 'article-content' },
            React.createElement('div', { className: 'article-meta' },
                React.createElement('span', { className: 'article-category' }, article.category),
                React.createElement('div', { className: 'article-date' },
                    React.createElement('i', { className: 'far fa-clock' }),
                    utils.timeAgo(article.date)
                ),
                React.createElement('span', { className: 'read-time' }, article.readTime)
            ),
            
            React.createElement('h3', { className: 'headline-tertiary' }, article.title),
            React.createElement('div', { className: 'byline' },
                'By ',
                React.createElement('span', { className: 'author' }, blogData.author.name)
            ),
            React.createElement('p', { className: 'article-excerpt' }, article.excerpt),
            React.createElement('div', { className: 'article-tags' },
                article.tags && article.tags.map((tag, index) =>
                    React.createElement('span', { className: 'tag-item', key: index }, tag)
                )
            ),
            React.createElement('a', { 
                className: 'read-more',
                href: `#article-${article.id}`,
                onClick: (e) => { e.preventDefault(); /* Handle article view */ }
            },
                'Read Article',
                React.createElement('i', { className: 'fas fa-arrow-right' })
            )
        )
    );
}

// Featured Article Component
function FeaturedArticle({ article }) {
    return React.createElement('article', { className: 'featured-article' },
        React.createElement('div', { className: 'featured-layout' },
            React.createElement('div', { className: 'featured-image-container' },
                React.createElement('div', { className: 'featured-badge' }, 'Featured'),
                React.createElement('img', {
                    className: 'featured-image',
                    src: article.image,
                    alt: article.title,
                    loading: 'lazy'
                })
            ),
            
            React.createElement('div', { className: 'featured-content' },
                React.createElement('div', { className: 'section-label' }, article.category),
                React.createElement('h2', { className: 'headline-primary' }, article.title),
                React.createElement('div', { className: 'byline' },
                    'By ',
                    React.createElement('span', { className: 'author' }, blogData.author.name),
                    ' • ',
                    React.createElement('span', { className: 'dateline' }, utils.timeAgo(article.date)),
                    ' • ',
                    React.createElement('span', { className: 'read-time' }, article.readTime)
                ),
                React.createElement('p', { className: 'lead-text' }, article.excerpt),
                React.createElement('a', { 
                    className: 'read-more',
                    href: `#article-${article.id}`,
                    onClick: (e) => { e.preventDefault(); /* Handle article view */ }
                },
                    'Continue Reading',
                    React.createElement('i', { className: 'fas fa-arrow-right' })
                )
            )
        )
    );
}

// Sidebar Component
function Sidebar() {
    return React.createElement('aside', { className: 'sidebar' },
        // About Me Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'About Me'),
            React.createElement('div', { className: 'author-card' },
                React.createElement('img', {
                    src: blogData.author.photo,
                    alt: blogData.author.name,
                    className: 'author-photo',
                    loading: 'lazy'
                }),
                React.createElement('div', { className: 'author-info' },
                    React.createElement('h4', { className: 'author-name' }, blogData.author.name),
                    React.createElement('p', { className: 'author-handle' }, `@${blogData.author.handle}`),
                    React.createElement('p', { className: 'author-bio' }, blogData.author.bio),
                    React.createElement('p', { className: 'author-location' },
                        React.createElement('i', { className: 'fas fa-map-marker-alt' }),
                        ' ',
                        blogData.author.location
                    )
                )
            )
        ),

        // Skills Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'Skills'),
            React.createElement('div', { className: 'skills-list' },
                blogData.author.skills.map(skill =>
                    React.createElement('span', { className: 'skill-tag', key: skill }, skill)
                )
            )
        ),
        
        // Latest News Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'Latest News'),
            blogData.sidebarArticles.map(article =>
                React.createElement('div', { className: 'sidebar-item', key: article.id },
                    React.createElement('img', {
                        className: 'sidebar-item-image',
                        src: article.image,
                        alt: article.title,
                        loading: 'lazy'
                    }),
                    React.createElement('div', { className: 'sidebar-item-content' },
                        React.createElement('h4', { className: 'sidebar-item-title' }, article.title),
                        React.createElement('div', { className: 'sidebar-item-date' }, 
                            utils.timeAgo(article.date)
                        )
                    )
                )
            )
        ),
        
        // Connect Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'Connect'),
            React.createElement('div', { className: 'social-links' },
                React.createElement('a', { 
                    href: blogData.author.social.github,
                    className: 'social-link',
                    target: '_blank',
                    rel: 'noopener noreferrer'
                },
                    React.createElement('i', { className: 'fab fa-github' }),
                    ' GitHub'
                ),
                React.createElement('a', { 
                    href: blogData.author.social.twitter,
                    className: 'social-link',
                    target: '_blank',
                    rel: 'noopener noreferrer'
                },
                    React.createElement('i', { className: 'fab fa-twitter' }),
                    ' Twitter'
                ),
                React.createElement('a', { 
                    href: blogData.author.social.linkedin,
                    className: 'social-link',
                    target: '_blank',
                    rel: 'noopener noreferrer'
                },
                    React.createElement('i', { className: 'fab fa-linkedin' }),
                    ' LinkedIn'
                ),
                React.createElement('a', { 
                    href: `mailto:${blogData.author.social.email}`,
                    className: 'social-link'
                },
                    React.createElement('i', { className: 'fas fa-envelope' }),
                    ' Email'
                )
            )
        )
    );
}

// About Page Component
function AboutPage() {
    return React.createElement('div', { className: 'about-page' },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'about-content' },
                // Hero Section
                React.createElement('div', { className: 'about-hero' },
                    React.createElement('div', { className: 'about-photo-container' },
                        React.createElement('img', {
                            src: blogData.author.photo,
                            alt: blogData.author.name,
                            className: 'about-photo'
                        })
                    ),
                    React.createElement('div', { className: 'about-intro' },
                        React.createElement('h1', { className: 'about-title' }, 
                            `About ${blogData.author.name}`
                        ),
                        React.createElement('p', { className: 'about-subtitle' }, 
                            `${blogData.author.handle} • ${blogData.author.location}`
                        ),
                        React.createElement('p', { className: 'about-bio' }, blogData.author.bio)
                    )
                ),

                // Story Section
                React.createElement('div', { className: 'about-section' },
                    React.createElement('h2', { className: 'section-title' }, 'My Story'),
                    React.createElement('div', { className: 'story-content' },
                        React.createElement('p', { className: 'story-paragraph' },
                            'My journey into the world of programming began during my college years when I encountered my first programming challenge. What started as a simple task to automate a repetitive process quickly became a passion that would shape my entire career.'
                        ),
                        React.createElement('p', { className: 'story-paragraph' },
                            'I remember the exact moment when I wrote my first Python script that actually worked. The feeling of seeing code transform into something useful, something that could solve real problems, was nothing short of magical. That spark has never left me.'
                        ),
                        React.createElement('p', { className: 'story-paragraph' },
                            'Today, I work as a full-stack developer, crafting digital experiences that bridge the gap between complex technology and human needs. Every project is an opportunity to learn something new and create something meaningful.'
                        )
                    )
                ),

                // Skills Section
                React.createElement('div', { className: 'about-section' },
                    React.createElement('h2', { className: 'section-title' }, 'What I Work With'),
                    React.createElement('div', { className: 'skills-grid' },
                        blogData.author.skills.map(skill =>
                            React.createElement('div', { className: 'skill-item', key: skill },
                                React.createElement('span', { className: 'skill-name' }, skill)
                            )
                        )
                    )
                ),

                // Connect Section
                React.createElement('div', { className: 'about-section' },
                    React.createElement('h2', { className: 'section-title' }, "Let's Connect"),
                    React.createElement('p', { className: 'connect-intro' },
                        "I'm always interested in connecting with fellow developers, discussing new projects, or just having a chat about technology and coffee. Feel free to reach out!"
                    ),
                    React.createElement('div', { className: 'social-cards' },
                        React.createElement('a', { 
                            href: blogData.author.social.github,
                            className: 'social-card',
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        },
                            React.createElement('i', { className: 'fab fa-github' }),
                            React.createElement('div', null,
                                React.createElement('h3', null, 'GitHub'),
                                React.createElement('p', null, 'Check out my code and projects')
                            )
                        ),
                        React.createElement('a', { 
                            href: blogData.author.social.twitter,
                            className: 'social-card',
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        },
                            React.createElement('i', { className: 'fab fa-twitter' }),
                            React.createElement('div', null,
                                React.createElement('h3', null, 'Twitter'),
                                React.createElement('p', null, 'Follow my tech thoughts')
                            )
                        ),
                        React.createElement('a', { 
                            href: blogData.author.social.linkedin,
                            className: 'social-card',
                            target: '_blank',
                            rel: 'noopener noreferrer'
                        },
                            React.createElement('i', { className: 'fab fa-linkedin' }),
                            React.createElement('div', null,
                                React.createElement('h3', null, 'LinkedIn'),
                                React.createElement('p', null, 'Connect professionally')
                            )
                        ),
                        React.createElement('a', { 
                            href: `mailto:${blogData.author.social.email}`,
                            className: 'social-card'
                        },
                            React.createElement('i', { className: 'fas fa-envelope' }),
                            React.createElement('div', null,
                                React.createElement('h3', null, 'Email'),
                                React.createElement('p', null, 'Drop me a line directly')
                            )
                        )
                    )
                )
            )
        )
    );
}

// Simple Admin Login Component
function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            onLogin(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    return React.createElement('div', { className: 'admin-login' },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'login-card' },
                React.createElement('h2', { className: 'login-title' }, 'Admin Access'),
                React.createElement('form', { onSubmit: handleSubmit },
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Password'),
                        React.createElement('input', {
                            type: 'password',
                            className: 'form-control',
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            placeholder: 'Enter admin password'
                        })
                    ),
                    error && React.createElement('p', { className: 'error-message' }, error),
                    React.createElement('button', { 
                        type: 'submit',
                        className: 'btn btn-primary'
                    }, 'Login')
                ),
                React.createElement('p', { className: 'demo-info' }, 'Demo password: admin123')
            )
        )
    );
}

// Main App Component
function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const renderPage = () => {
        switch (currentPage) {
            case 'about':
                return React.createElement(AboutPage);
            case 'admin':
                if (!isAdminLoggedIn) {
                    return React.createElement(AdminLogin, { onLogin: setIsAdminLoggedIn });
                }
                return React.createElement('div', { className: 'admin-dashboard' },
                    React.createElement('div', { className: 'container' },
                        React.createElement('h1', null, 'Admin Dashboard'),
                        React.createElement('p', null, 'Article management would go here.'),
                        React.createElement('button', { 
                            className: 'btn',
                            onClick: () => {
                                setIsAdminLoggedIn(false);
                                setCurrentPage('home');
                            }
                        }, 'Logout')
                    )
                );
            default:
                // Home page
                const featuredArticle = blogData.articles.find(article => article.featured);
                const otherArticles = blogData.articles.filter(article => !article.featured);
                
                return React.createElement('main', { className: 'container' },
                    React.createElement('div', { className: 'newspaper-grid' },
                        React.createElement('div', { className: 'main-content' },
                            // Featured Article
                            featuredArticle && React.createElement(FeaturedArticle, { 
                                article: featuredArticle 
                            }),
                            
                            // Articles Grid
                            React.createElement('section', { className: 'article-grid' },
                                React.createElement('div', { className: 'article-columns' },
                                    otherArticles.map(article =>
                                        React.createElement(ArticleCard, { 
                                            article: article,
                                            key: article.id
                                        })
                                    )
                                )
                            )
                        ),
                        
                        // Sidebar
                        React.createElement(Sidebar)
                    )
                );
        }
    };

    return React.createElement('div', { className: 'newspaper-app' },
        // Header
        React.createElement(NewspaperHeader),
        
        // Navigation
        React.createElement(Navigation, { 
            currentPage: currentPage,
            onNavigate: setCurrentPage
        }),
        
        // Page Content
        renderPage(),
        
        // Footer
        React.createElement('footer', { className: 'newspaper-footer' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('p', { className: 'footer-text' },
                        '© 2025 Q0k0LaTes Personal Blog. Built with ❤️ by ',
                        blogData.author.name
                    )
                )
            )
        )
    );
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        ReactDOM.render(React.createElement(App), root);
    }
});