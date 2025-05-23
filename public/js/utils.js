// Utilities - utils.js

// Utility functions for the newspaper blog
const utils = {
    // Date formatting
    formatDate: (date) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    // Short date format
    formatShortDate: (date) => {
        const options = { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    // Time ago format
    timeAgo: (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInMs = now - past;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return utils.formatShortDate(date);
        }
    },

    // Capitalize first letter
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Truncate text
    truncate: (text, length = 100) => {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    },

    // Generate reading time estimate
    readingTime: (text) => {
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    },

    // Slugify text for URLs
    slugify: (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },

    // DOM utilities
    dom: {
        // Get element by ID
        id: (id) => document.getElementById(id),

        // Query selector
        qs: (selector) => document.querySelector(selector),

        // Query selector all
        qsa: (selector) => document.querySelectorAll(selector),

        // Add class
        addClass: (element, className) => {
            if (element) element.classList.add(className);
        },

        // Remove class
        removeClass: (element, className) => {
            if (element) element.classList.remove(className);
        },

        // Toggle class
        toggleClass: (element, className) => {
            if (element) element.classList.toggle(className);
        },

        // Has class
        hasClass: (element, className) => {
            return element ? element.classList.contains(className) : false;
        },

        // Create element
        create: (tag, attributes = {}, content = '') => {
            const element = document.createElement(tag);
            
            Object.keys(attributes).forEach(attr => {
                if (attr === 'className') {
                    element.className = attributes[attr];
                } else if (attr === 'innerHTML') {
                    element.innerHTML = attributes[attr];
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            });

            if (content) {
                element.textContent = content;
            }

            return element;
        },

        // Add event listener
        on: (element, event, handler, options = {}) => {
            if (element) {
                element.addEventListener(event, handler, options);
            }
        },

        // Remove event listener
        off: (element, event, handler) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        }
    },

    // Animation utilities
    animate: {
        // Fade in element
        fadeIn: (element, duration = 300) => {
            if (!element) return;
            
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            
            function fade(timestamp) {
                const elapsed = timestamp - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    element.style.opacity = progress;
                    requestAnimationFrame(fade);
                } else {
                    element.style.opacity = '1';
                }
            }
            
            requestAnimationFrame(fade);
        },

        // Fade out element
        fadeOut: (element, duration = 300) => {
            if (!element) return;
            
            const start = performance.now();
            const startOpacity = parseFloat(getComputedStyle(element).opacity);
            
            function fade(timestamp) {
                const elapsed = timestamp - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    element.style.opacity = startOpacity * (1 - progress);
                    requestAnimationFrame(fade);
                } else {
                    element.style.opacity = '0';
                    element.style.display = 'none';
                }
            }
            
            requestAnimationFrame(fade);
        },

        // Slide down element
        slideDown: (element, duration = 300) => {
            if (!element) return;
            
            element.style.height = '0px';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            const start = performance.now();
            
            function slide(timestamp) {
                const elapsed = timestamp - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    element.style.height = (targetHeight * progress) + 'px';
                    requestAnimationFrame(slide);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(slide);
        },

        // Slide up element
        slideUp: (element, duration = 300) => {
            if (!element) return;
            
            const startHeight = element.offsetHeight;
            element.style.height = startHeight + 'px';
            element.style.overflow = 'hidden';
            
            const start = performance.now();
            
            function slide(timestamp) {
                const elapsed = timestamp - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    element.style.height = (startHeight * (1 - progress)) + 'px';
                    requestAnimationFrame(slide);
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(slide);
        }
    },

    // Validation utilities
    validate: {
        email: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        url: (url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        notEmpty: (value) => {
            return value && value.toString().trim().length > 0;
        },

        minLength: (value, min) => {
            return value && value.toString().length >= min;
        },

        maxLength: (value, max) => {
            return value && value.toString().length <= max;
        }
    },

    // API utilities
    api: {
        get: async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('API GET error:', error);
                throw error;
            }
        },

        post: async (url, data) => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('API POST error:', error);
                throw error;
            }
        }
    },

    // Notification system
    notify: {
        show: (message, type = 'info', duration = 3000) => {
            const notification = utils.dom.create('div', {
                className: `notification notification-${type}`,
                innerHTML: `
                    <div class="notification-content">
                        <span class="notification-message">${message}</span>
                        <button class="notification-close">&times;</button>
                    </div>
                `
            });

            document.body.appendChild(notification);

            // Add styles if not already present
            if (!document.querySelector('#notification-styles')) {
                const styles = utils.dom.create('style', {
                    id: 'notification-styles',
                    innerHTML: `
                        .notification {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            padding: 16px 20px;
                            border-radius: 8px;
                            color: white;
                            font-family: var(--font-sans);
                            font-size: 14px;
                            z-index: 1000;
                            transform: translateX(100%);
                            transition: transform 0.3s ease;
                            max-width: 400px;
                        }
                        .notification.show {
                            transform: translateX(0);
                        }
                        .notification-info { background-color: #2196f3; }
                        .notification-success { background-color: #4caf50; }
                        .notification-warning { background-color: #ff9800; }
                        .notification-error { background-color: #f44336; }
                        .notification-content {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            gap: 12px;
                        }
                        .notification-close {
                            background: none;
                            border: none;
                            color: white;
                            font-size: 18px;
                            cursor: pointer;
                            padding: 0;
                            line-height: 1;
                        }
                    `
                });
                document.head.appendChild(styles);
            }

            // Show notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Auto hide
            const hideTimeout = setTimeout(() => {
                utils.notify.hide(notification);
            }, duration);

            // Manual close
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(hideTimeout);
                utils.notify.hide(notification);
            });

            return notification;
        },

        hide: (notification) => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        },

        success: (message, duration) => utils.notify.show(message, 'success', duration),
        error: (message, duration) => utils.notify.show(message, 'error', duration),
        warning: (message, duration) => utils.notify.show(message, 'warning', duration),
        info: (message, duration) => utils.notify.show(message, 'info', duration)
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
} else {
    window.utils = utils;
}