// Theme Management - theme.js

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Check for saved theme preference or default to system preference
        const savedTheme = utils.storage.get('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        this.currentTheme = savedTheme || systemTheme;
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.bindEvents();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        utils.storage.set('theme', theme);
        
        // Update theme toggle icon
        this.updateToggleIcon();
        
        // Emit theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.currentTheme } 
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add animation class to toggle button
        const toggle = utils.dom.qs('.theme-toggle');
        if (toggle) {
            toggle.classList.add('rotating');
            setTimeout(() => {
                toggle.classList.remove('rotating');
            }, 300);
        }
    }

    createThemeToggle() {
        const toggle = utils.dom.create('button', {
            className: 'theme-toggle',
            'aria-label': 'Toggle theme',
            innerHTML: '<i class="fas fa-moon"></i>'
        });

        document.body.appendChild(toggle);

        // Add rotation animation styles
        if (!document.querySelector('#theme-toggle-styles')) {
            const styles = utils.dom.create('style', {
                id: 'theme-toggle-styles',
                innerHTML: `
                    .theme-toggle.rotating {
                        transform: rotate(360deg);
                    }
                    .theme-toggle.rotating i {
                        transform: scale(0.8);
                    }
                `
            });
            document.head.appendChild(styles);
        }

        return toggle;
    }

    updateToggleIcon() {
        const toggle = utils.dom.qs('.theme-toggle i');
        if (toggle) {
            toggle.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    bindEvents() {
        // Theme toggle click
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!utils.storage.get('theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        utils.dom.on(document, 'keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Get current theme
    getTheme() {
        return this.currentTheme;
    }

    // Check if dark theme is active
    isDark() {
        return this.currentTheme === 'dark';
    }

    // Check if light theme is active
    isLight() {
        return this.currentTheme === 'light';
    }
}

// Weather Widget
class WeatherWidget {
    constructor() {
        this.apiKey = 'demo'; // Replace with actual API key
        this.city = 'San Francisco'; // Default city
        this.init();
    }

    init() {
        this.createWidget();
        this.updateWeather();
        
        // Update weather every 30 minutes
        setInterval(() => {
            this.updateWeather();
        }, 30 * 60 * 1000);
    }

    createWidget() {
        const sidebar = utils.dom.qs('.sidebar');
        if (!sidebar) return;

        const weatherSection = utils.dom.create('div', {
            className: 'sidebar-section weather-section',
            innerHTML: `
                <h3 class="sidebar-title">Weather</h3>
                <div class="weather-widget">
                    <div class="weather-icon">
                        <i class="fas fa-cloud-sun"></i>
                    </div>
                    <div class="weather-temp">22°C</div>
                    <div class="weather-desc">Partly Cloudy</div>
                    <div class="weather-location">${this.city}</div>
                </div>
            `
        });

        sidebar.appendChild(weatherSection);
    }

    async updateWeather() {
        try {
            // Demo weather data (replace with actual API call)
            const weatherData = {
                temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
                condition: this.getRandomCondition(),
                icon: this.getWeatherIcon()
            };

            this.renderWeather(weatherData);
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }

    getRandomCondition() {
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    getWeatherIcon() {
        const icons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-moon'];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    renderWeather(data) {
        const widget = utils.dom.qs('.weather-widget');
        if (!widget) return;

        const icon = widget.querySelector('.weather-icon i');
        const temp = widget.querySelector('.weather-temp');
        const desc = widget.querySelector('.weather-desc');

        if (icon) icon.className = `fas ${data.icon}`;
        if (temp) temp.textContent = `${data.temperature}°C`;
        if (desc) desc.textContent = data.condition;
    }
}

// Stock Ticker
class StockTicker {
    constructor() {
        this.stocks = [
            { symbol: 'AAPL', price: 150.25, change: +2.5 },
            { symbol: 'GOOGL', price: 2750.80, change: -15.3 },
            { symbol: 'MSFT', price: 305.50, change: +5.2 },
            { symbol: 'TSLA', price: 850.75, change: -12.8 },
            { symbol: 'AMZN', price: 3200.90, change: +25.6 }
        ];
        this.init();
    }

    init() {
        this.createTicker();
        this.updateStocks();
        
        // Update stocks every 5 minutes
        setInterval(() => {
            this.updateStocks();
        }, 5 * 60 * 1000);
    }

    createTicker() {
        const headerBar = utils.dom.qs('.header-info-bar .container');
        if (!headerBar) return;

        const tickerContainer = utils.dom.create('div', {
            className: 'stock-ticker',
            innerHTML: `
                <div class="ticker-content">
                    ${this.stocks.map(stock => this.createTickerItem(stock)).join('')}
                </div>
            `
        });

        headerBar.appendChild(tickerContainer);
    }

    createTickerItem(stock) {
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = stock.change >= 0 ? '+' : '';
        
        return `
            <div class="ticker-item">
                <span class="ticker-symbol">${stock.symbol}</span>
                <span class="ticker-price">$${stock.price.toFixed(2)}</span>
                <span class="ticker-change ${changeClass}">
                    ${changeSymbol}${stock.change.toFixed(2)}
                </span>
            </div>
        `;
    }

    updateStocks() {
        // Simulate stock price changes
        this.stocks.forEach(stock => {
            const changePercent = (Math.random() - 0.5) * 0.1; // ±5% max change
            const priceChange = stock.price * changePercent;
            stock.price += priceChange;
            stock.change = priceChange;
        });

        this.renderStocks();
    }

    renderStocks() {
        const tickerContent = utils.dom.qs('.ticker-content');
        if (!tickerContent) return;

        tickerContent.innerHTML = this.stocks.map(stock => this.createTickerItem(stock)).join('');
    }
}

// Date and Time Display
class DateTimeDisplay {
    constructor() {
        this.init();
    }

    init() {
        this.createDateDisplay();
        this.updateDateTime();
        
        // Update every minute
        setInterval(() => {
            this.updateDateTime();
        }, 60000);
    }

    createDateDisplay() {
        const infoBar = utils.dom.qs('.info-bar-content');
        if (!infoBar) return;

        const dateInfo = utils.dom.create('div', {
            className: 'date-info',
            innerHTML: `
                <div class="current-date">
                    <i class="far fa-calendar-alt"></i>
                    <span class="date-text"></span>
                </div>
                <div class="current-time">
                    <i class="far fa-clock"></i>
                    <span class="time-text"></span>
                </div>
            `
        });

        infoBar.insertBefore(dateInfo, infoBar.firstChild);
    }

    updateDateTime() {
        const now = new Date();
        
        const dateText = utils.dom.qs('.date-text');
        const timeText = utils.dom.qs('.time-text');

        if (dateText) {
            dateText.textContent = utils.formatDate(now);
        }

        if (timeText) {
            timeText.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}

// Initialize theme system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Initialize weather widget
    window.weatherWidget = new WeatherWidget();
    
    // Initialize stock ticker
    window.stockTicker = new StockTicker();
    
    // Initialize date/time display
    window.dateTimeDisplay = new DateTimeDisplay();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, WeatherWidget, StockTicker, DateTimeDisplay };
}