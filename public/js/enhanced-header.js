// Enhanced Header Component
function EnhancedHeader({ title, subtitle, authorName }) {
    // Generate random positions for circuit elements
    const generateCircuitElements = () => {
        const elements = [];
        const numHorizontal = 5;
        const numVertical = 5;
        const numNodes = 8;
        
        // Horizontal lines
        for (let i = 0; i < numHorizontal; i++) {
            const top = Math.floor(Math.random() * 100);
            const delay = Math.floor(Math.random() * 10);
            const duration = 10 + Math.floor(Math.random() * 10);
            
            elements.push(
                React.createElement('div', {
                    className: 'circuit-line horizontal-line',
                    style: {
                        top: `${top}%`,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`
                    },
                    key: `h-${i}`
                })
            );
        }
        
        // Vertical lines
        for (let i = 0; i < numVertical; i++) {
            const left = Math.floor(Math.random() * 100);
            const delay = Math.floor(Math.random() * 10);
            const duration = 10 + Math.floor(Math.random() * 10);
            
            elements.push(
                React.createElement('div', {
                    className: 'circuit-line vertical-line',
                    style: {
                        left: `${left}%`,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`
                    },
                    key: `v-${i}`
                })
            );
        }
        
        // Nodes
        for (let i = 0; i < numNodes; i++) {
            const top = Math.floor(Math.random() * 100);
            const left = Math.floor(Math.random() * 100);
            const delay = Math.floor(Math.random() * 2);
            
            elements.push(
                React.createElement('div', {
                    className: 'circuit-node',
                    style: {
                        top: `${top}%`,
                        left: `${left}%`,
                        animationDelay: `${delay}s`
                    },
                    key: `n-${i}`
                })
            );
        }
        
        return elements;
    };
    
    return React.createElement('header', { className: 'enhanced-header' },
        // Circuit background
        React.createElement('div', { className: 'circuit-container' },
            ...generateCircuitElements()
        ),
        
        // Decorative elements
        React.createElement('div', { className: 'header-decoration decoration-1' }),
        React.createElement('div', { className: 'header-decoration decoration-2' }),
        React.createElement('div', { className: 'header-decoration decoration-3' }),
        React.createElement('div', { className: 'header-decoration decoration-4' }),
        React.createElement('div', { className: 'header-decoration decoration-5' }),
        React.createElement('div', { className: 'header-decoration decoration-6' }),
        
        // Main content
        React.createElement('div', { className: 'container header-content' },
            // Logo
            React.createElement('div', { className: 'logo-container' },
                React.createElement('div', { className: 'logo-glow' }),
                React.createElement('div', { className: 'logo-circle' },
                    React.createElement('div', { className: 'logo-text' }, 'Q')
                )
            ),
            
            // Title and subtitle
            React.createElement('h1', { className: 'header-title neon-glow' }, title),
            React.createElement('p', { className: 'header-subtitle' }, subtitle),
            
            // Author info
            React.createElement('div', { className: 'header-author' },
                React.createElement('i', { className: 'fas fa-user-circle' }),
                `By ${authorName}`
            ),
            
            // Call to action buttons
            React.createElement('div', { className: 'header-cta' },
                React.createElement('a', { 
                    href: 'about.html',
                    className: 'header-button primary-button'
                },
                    React.createElement('i', { className: 'fas fa-user' }),
                    'About Me'
                ),
                React.createElement('a', { 
                    href: '#contact',
                    className: 'header-button secondary-button'
                },
                    React.createElement('i', { className: 'fas fa-envelope' }),
                    'Contact'
                )
            )
        )
    );
}
