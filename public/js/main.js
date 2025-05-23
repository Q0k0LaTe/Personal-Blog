// Main Application - main.js

const { useState, useEffect, useRef } = React;

// Sample newspaper data
const sampleData = {
    breakingNews: "TECH BREAKTHROUGH: New AI Model Achieves Human-Level Performance in Complex Reasoning Tasks",
    
    featuredArticle: {
        id: 1,
        title: "The Future of Artificial Intelligence: Beyond Human Capabilities",
        excerpt: "As we stand on the precipice of a new technological era, artificial intelligence continues to evolve at an unprecedented pace. Recent breakthroughs in machine learning and neural network architectures are pushing the boundaries of what we once thought possible, bringing us closer to artificial general intelligence.",
        content: `The landscape of artificial intelligence has transformed dramatically over the past decade, with developments that seemed like science fiction becoming everyday reality. From language models that can engage in sophisticated conversations to computer vision systems that surpass human accuracy, AI is reshaping every aspect of our digital world.

Recent advances in transformer architectures have enabled machines to understand context and nuance in ways previously impossible. These systems can now generate human-like text, create stunning visual art, and even write functional code. The implications for industries ranging from healthcare to entertainment are profound and far-reaching.

However, with great power comes great responsibility. As AI systems become more capable, questions of ethics, safety, and societal impact become increasingly critical. Researchers and policymakers are working together to ensure that these powerful tools are developed and deployed responsibly.

The next frontier in AI development focuses on achieving true understanding rather than mere pattern matching. Scientists are exploring new approaches that combine symbolic reasoning with neural networks, potentially leading to systems that can truly comprehend and interact with the world in ways similar to human intelligence.

As we look toward the future, one thing is certain: artificial intelligence will continue to be a driving force in technological advancement, challenging our assumptions about intelligence, creativity, and what it means to be human in an increasingly digital world.`,
        author: "Q0k0LaTes",
        authorName: "Terrence Zhuoting Han",
        date: new Date().toISOString(),
        category: "Technology",
        tags: ["AI", "Machine Learning", "Future Tech"],
        image: "https://via.placeholder.com/800x400/1a1a1a/ffffff?text=AI+Future",
        readTime: "8 min read"
    },

    articles: [
        {
            id: 2,
            title: "Web Development Trends Shaping 2025",
            excerpt: "From progressive web apps to edge computing, discover the technologies that are defining the future of web development.",
            author: "Q0k0LaTes",
            authorName: "Terrence Zhuoting Han",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            category: "Web Development",
            tags: ["Web Dev", "Trends", "JavaScript"],
            image: "https://via.placeholder.com/400x250/d32f2f/ffffff?text=Web+Dev+2025",
            readTime: "5 min read"
        },
        {
            id: 3,
            title: "The Rise of Quantum Computing",
            excerpt: "Quantum computers are moving from theoretical concepts to practical applications, promising to revolutionize computing as we know it.",
            author: "Q0k0LaTes",
            authorName: "Terrence Zhuoting Han",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            category: "Quantum Computing",
            tags: ["Quantum", "Computing", "Science"],
            image: "https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Quantum+Computing",
            readTime: "7 min read"
        },
        {
            id: 4,
            title: "Cybersecurity in the Modern Age",
            excerpt: "As our digital footprint expands, understanding the latest cybersecurity threats and protection strategies becomes crucial.",
            author: "Q0k0LaTes",
            authorName: "Terrence Zhuoting Han",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            category: "Security",
            tags: ["Security", "Privacy", "Technology"],
            image: "https://via.placeholder.com/400x250/b71c1c/ffffff?text=Cybersecurity",
            readTime: "6 min read"
        },
        {
            id: 5,
            title: "The Evolution of Mobile Technology",
            excerpt: "From smartphones to foldable devices, mobile technology continues to push the boundaries of what's possible in our pockets.",
            author: "Q0k0LaTes",
            authorName: "Terrence Zhuoting Han",
            date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            category: "Mobile",
            tags: ["Mobile", "Innovation", "Hardware"],
            image: "https://via.placeholder.com/400x250/d32f2f/ffffff?text=Mobile+Tech",
            readTime: "4 min read"
        },
        {
            id: 6,
            title: "Blockchain Beyond Cryptocurrency",
            excerpt: "Exploring the diverse applications of blockchain technology beyond digital currencies, from supply chain to healthcare.",
            author: "Q0k0LaTes",
            authorName: "Terrence Zhuoting Han",
            date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            category: "Blockchain",
            tags: ["Blockchain", "Innovation", "Finance"],
            image: "https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Blockchain+Tech",
            readTime: "6 min read"
        }
    ],

    sidebarArticles: [
        {
            id: 7,
            title: "5G Network Expansion Accelerates",
            date: new Date(Date.now() - 86400000).toISOString(),
            image: "https://via.placeholder.com/80x60/d32f2f/ffffff?text=5G"
        },
        {
            id: 8,
            title: "New Programming Languages to Watch",
            date: new Date(Date.now() - 172800000).toISOString(),
            image: "https://via.placeholder.com/80x60/1a1a1a/ffffff?text=Code"
        },
        {
            id: 9,
            title: "Cloud Computing Market Trends",
            date: new Date(Date.now() - 259200000).toISOString(),
            image: "https://via.placeholder.com/80x60/b71c1c/ffffff?text=Cloud"
        }
    ]
};

// Breaking News Component
function BreakingNews({ news }) {
    return React.createElement('div', { className: 'breaking-news' },
        React.createElement('span', null, '🚨 BREAKING: '),
        news
    );
}

// Header Component
function NewspaperHeader() {
    const currentDate = new Date();
    
    return React.createElement('header', { className: 'newspaper-header' },
        // Info Bar
        React.createElement('div', { className: 'header-info-bar' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'info-bar-content' },
                    React.createElement('div', { className: 'weather-info' },
                        React.createElement('i', { className: 'fas fa-cloud-sun' }),
                        React.createElement('span', null, '22°C San Francisco')
                    )
                )
            )
        ),
        
        // Main Header
        React.createElement('div', { className: 'main-header' },
            React.createElement('div', { className: 'header-decoration' }),
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'edition-info' }, 
                    `Vol. 1, No. 1 • ${utils.formatDate(currentDate)}`
                ),
                React.createElement('h1', { className: 'masthead' }, 'The Q0k0LaTes Chronicle'),
                React.createElement('p', { className: 'tagline' }, 
                    'Technology News & Insights by Terrence Zhuoting Han'
                )
            )
        )
    );
}

// Navigation Component
function Navigation() {
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
                React.createElement('i', { className: 'fas fa-bars' })
            ),
            
            React.createElement('ul', { className: 'nav-menu' },
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { className: 'nav-link active', href: '#' }, 'Home')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { className: 'nav-link', href: '#technology' }, 'Technology')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { className: 'nav-link', href: '#web-dev' }, 'Web Development')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { className: 'nav-link', href: '#opinion' }, 'Opinion')
                ),
                React.createElement('li', { className: 'nav-item' },
                    React.createElement('a', { className: 'nav-link', href: '#about' }, 'About')
                )
            ),
            
            // Mobile Menu
            React.createElement('div', { 
                className: `mobile-nav ${mobileMenuOpen ? 'active' : ''}` 
            },
                React.createElement('a', { className: 'nav-link', href: '#' }, 'Home'),
                React.createElement('a', { className: 'nav-link', href: '#technology' }, 'Technology'),
                React.createElement('a', { className: 'nav-link', href: '#web-dev' }, 'Web Development'),
                React.createElement('a', { className: 'nav-link', href: '#opinion' }, 'Opinion'),
                React.createElement('a', { className: 'nav-link', href: '#about' }, 'About')
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
                    alt: article.title
                })
            ),
            
            React.createElement('div', { className: 'featured-content' },
                React.createElement('div', { className: 'section-label' }, article.category),
                React.createElement('h2', { className: 'headline-primary' }, article.title),
                React.createElement('div', { className: 'byline' },
                    'By ',
                    React.createElement('span', { className: 'author' }, article.authorName),
                    ' • ',
                    React.createElement('span', { className: 'dateline' }, utils.timeAgo(article.date)),
                    ' • ',
                    React.createElement('span', { className: 'read-time' }, article.readTime)
                ),
                React.createElement('p', { className: 'lead-text' }, article.excerpt),
                React.createElement('a', { 
                    className: 'read-more',
                    href: `#article-${article.id}`
                },
                    'Continue Reading',
                    React.createElement('i', { className: 'fas fa-arrow-right' })
                )
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
                alt: article.title
            })
        ),
        
        React.createElement('div', { className: 'article-content' },
            React.createElement('div', { className: 'article-meta' },
                React.createElement('span', { className: 'article-category' }, article.category),
                React.createElement('div', { className: 'article-date' },
                    React.createElement('i', { className: 'far fa-clock' }),
                    utils.timeAgo(article.date)
                )
            ),
            
            React.createElement('h3', { className: 'headline-tertiary' }, article.title),
            React.createElement('div', { className: 'byline' },
                'By ',
                React.createElement('span', { className: 'author' }, article.authorName)
            ),
            React.createElement('p', { className: 'article-excerpt' }, article.excerpt),
            React.createElement('div', { className: 'article-tags' },
                article.tags.map((tag, index) =>
                    React.createElement('span', { className: 'tag-item', key: index }, tag)
                )
            ),
            React.createElement('a', { 
                className: 'read-more',
                href: `#article-${article.id}`
            },
                'Read Article',
                React.createElement('i', { className: 'fas fa-arrow-right' })
            )
        )
    );
}

// Sidebar Component
function Sidebar({ articles }) {
    return React.createElement('aside', { className: 'sidebar' },
        // Latest News Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'Latest News'),
            articles.map(article =>
                React.createElement('div', { className: 'sidebar-item', key: article.id },
                    React.createElement('img', {
                        className: 'sidebar-item-image',
                        src: article.image,
                        alt: article.title
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
        
        // Newsletter Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('div', { className: 'newsletter-signup' },
                React.createElement('h3', { className: 'newsletter-title' }, 'Stay Updated'),
                React.createElement('p', { className: 'newsletter-desc' }, 
                    'Get the latest tech news and insights delivered to your inbox.'
                ),
                React.createElement('form', { className: 'newsletter-form' },
                    React.createElement('input', {
                        type: 'email',
                        className: 'newsletter-input',
                        placeholder: 'Enter your email'
                    }),
                    React.createElement('button', {
                        type: 'submit',
                        className: 'newsletter-button'
                    }, 'Subscribe')
                )
            )
        ),
        
        // Tags Section
        React.createElement('div', { className: 'sidebar-section' },
            React.createElement('h3', { className: 'sidebar-title' }, 'Popular Tags'),
            React.createElement('div', { className: 'tags-cloud' },
                ['AI', 'Web Development', 'JavaScript', 'React', 'Technology', 'Programming', 'Security', 'Mobile'].map(tag =>
                    React.createElement('a', { 
                        className: 'tag-item',
                        href: `#tag-${utils.slugify(tag)}`,
                        key: tag
                    }, tag)
                )
            )
        )
    );
}

// Main App Component
function App() {
    const [articles, setArticles] = useState(sampleData.articles);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.article-card, .featured-article, .sidebar-section');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
        
        return () => observer.disconnect();
    }, []);
    
    return React.createElement('div', { className: 'newspaper-app' },
        // Breaking News
        React.createElement(BreakingNews, { news: sampleData.breakingNews }),
        
        // Header
        React.createElement(NewspaperHeader),
        
        // Navigation
        React.createElement(Navigation),
        
        // Main Content
        React.createElement('main', { className: 'container' },
            React.createElement('div', { className: 'newspaper-grid' },
                React.createElement('div', { className: 'main-content' },
                    // Featured Article
                    React.createElement(FeaturedArticle, { 
                        article: sampleData.featuredArticle 
                    }),
                    
                    // Articles Grid
                    React.createElement('section', { className: 'article-grid' },
                        React.createElement('div', { className: 'article-columns' },
                            articles.map(article =>
                                React.createElement(ArticleCard, { 
                                    article: article,
                                    key: article.id
                                })
                            )
                        )
                    )
                ),
                
                // Sidebar
                React.createElement(Sidebar, { 
                    articles: sampleData.sidebarArticles 
                })
            )
        ),
        
        // Footer
        React.createElement('footer', { className: 'newspaper-footer' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('p', { className: 'footer-text' },
                        '© 2025 The Q0k0LaTes Chronicle. All rights reserved. ',
                        React.createElement('br'),
                        'Published by Terrence Zhuoting Han'
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