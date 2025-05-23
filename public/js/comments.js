// Comments System - comments.js

class CommentSystem {
    constructor() {
        this.comments = [];
        this.currentPage = 1;
        this.commentsPerPage = 10;
        this.init();
    }

    init() {
        this.loadComments();
        this.bindEvents();
        this.createCommentForm();
    }

    async loadComments(postId = 'home') {
        try {
            const response = await utils.api.get(`/api/comments/${postId}`);
            this.comments = response || [];
            this.renderComments();
        } catch (error) {
            console.error('Error loading comments:', error);
            // Load sample comments for demo
            this.loadSampleComments();
        }
    }

    loadSampleComments() {
        this.comments = [
            {
                id: 1,
                name: 'Sarah Chen',
                content: 'Excellent article! The insights on AI development are particularly compelling. I especially appreciate the discussion on ethical considerations.',
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                avatar: 'SC'
            },
            {
                id: 2,
                name: 'Michael Rodriguez',
                content: 'Great work on explaining complex topics in an accessible way. Looking forward to more content like this!',
                createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                avatar: 'MR'
            },
            {
                id: 3,
                name: 'Dr. Emily Watson',
                content: 'As someone working in the AI field, I can confirm that these trends are indeed shaping our industry. The section on neural networks was spot-on.',
                createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
                avatar: 'EW'
            },
            {
                id: 4,
                name: 'Alex Kumar',
                content: 'This really opened my eyes to the potential of AI. The writing is clear and engaging. Keep up the excellent work!',
                createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
                avatar: 'AK'
            }
        ];
        this.renderComments();
    }

    createCommentForm() {
        const commentsSection = utils.dom.create('section', {
            className: 'comments-section',
            innerHTML: `
                <div class="container">
                    <h2 class="section-title">Reader Discussion</h2>
                    <div class="comments-stats">
                        <span class="comment-count">${this.comments.length} Comments</span>
                        <div class="comment-sort">
                            <label for="sort-select">Sort by:</label>
                            <select id="sort-select" class="sort-select">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                    
                    <form class="comment-form" id="comment-form">
                        <h3 class="form-title">Join the Discussion</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="comment-name">Name *</label>
                                <input 
                                    type="text" 
                                    id="comment-name" 
                                    name="name" 
                                    class="form-control" 
                                    placeholder="Your name"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="comment-email">Email *</label>
                                <input 
                                    type="email" 
                                    id="comment-email" 
                                    name="email" 
                                    class="form-control" 
                                    placeholder="your@email.com"
                                    required
                                >
                                <div class="form-help">Your email will not be published</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="comment-content">Comment *</label>
                            <textarea 
                                id="comment-content" 
                                name="content" 
                                class="form-control" 
                                rows="4"
                                placeholder="Share your thoughts..."
                                required
                            ></textarea>
                            <div class="character-count">
                                <span class="current-count">0</span>/500 characters
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary comment-submit">
                            <i class="fas fa-paper-plane"></i>
                            Post Comment
                        </button>
                    </form>
                    
                    <div class="comments-list" id="comments-list">
                        <!-- Comments will be rendered here -->
                    </div>
                    
                    <div class="comments-pagination" id="comments-pagination">
                        <!-- Pagination will be rendered here -->
                    </div>
                </div>
            `
        });

        // Add CSS for comments section
        this.addCommentStyles();

        // Insert comments section after main content
        const mainContent = utils.dom.qs('.main-content');
        if (mainContent && mainContent.parentNode) {
            mainContent.parentNode.insertBefore(commentsSection, mainContent.nextSibling);
        }
    }

    addCommentStyles() {
        if (document.querySelector('#comment-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'comment-styles',
            innerHTML: `
                .comments-section {
                    margin-top: var(--space-3xl);
                    padding-top: var(--space-3xl);
                    border-top: 3px solid var(--accent-primary);
                }
                
                .comments-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-xl);
                    padding-bottom: var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .comment-count {
                    font-family: var(--font-headline);
                    font-size: var(--text-lg);
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .comment-sort {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }
                
                .sort-select {
                    padding: var(--space-xs) var(--space-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: var(--text-sm);
                }
                
                .comment-form {
                    background-color: var(--bg-secondary);
                    padding: var(--space-xl);
                    border-radius: var(--border-radius-lg);
                    border: 1px solid var(--border-color);
                    margin-bottom: var(--space-3xl);
                }
                
                .form-title {
                    font-family: var(--font-headline);
                    font-size: var(--text-2xl);
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--space-lg);
                    padding-bottom: var(--space-sm);
                    border-bottom: 2px solid var(--accent-primary);
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-lg);
                }
                
                .character-count {
                    text-align: right;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: var(--space-xs);
                }
                
                .comment-submit {
                    margin-top: var(--space-md);
                }
                
                .comment-item {
                    background-color: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-lg);
                    padding: var(--space-xl);
                    margin-bottom: var(--space-lg);
                    transition: all var(--transition-normal);
                }
                
                .comment-item:hover {
                    box-shadow: var(--shadow-medium);
                    border-color: var(--accent-primary);
                }
                
                .comment-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    margin-bottom: var(--space-md);
                }
                
                .comment-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-sans);
                    font-weight: 700;
                    font-size: var(--text-sm);
                }
                
                .comment-meta {
                    flex: 1;
                }
                
                .comment-author {
                    font-family: var(--font-sans);
                    font-size: var(--text-base);
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--space-xs);
                }
                
                .comment-date {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }
                
                .comment-content {
                    line-height: 1.7;
                    color: var(--text-primary);
                    margin-bottom: var(--space-md);
                }
                
                .comment-actions {
                    display: flex;
                    gap: var(--space-md);
                }
                
                .comment-action {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                    cursor: pointer;
                    padding: var(--space-xs) 0;
                    transition: color var(--transition-fast);
                }
                
                .comment-action:hover {
                    color: var(--accent-primary);
                }
                
                .comments-pagination {
                    display: flex;
                    justify-content: center;
                    gap: var(--space-sm);
                    margin-top: var(--space-xl);
                }
                
                .page-btn {
                    padding: var(--space-sm) var(--space-md);
                    border: 1px solid var(--border-color);
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    cursor: pointer;
                    border-radius: var(--border-radius);
                    transition: all var(--transition-fast);
                }
                
                .page-btn:hover,
                .page-btn.active {
                    background-color: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .comments-stats {
                        flex-direction: column;
                        gap: var(--space-md);
                        align-items: flex-start;
                    }
                    
                    .comment-form {
                        padding: var(--space-lg);
                    }
                    
                    .comment-item {
                        padding: var(--space-lg);
                    }
                }
            `
        });
        document.head.appendChild(styles);
    }

    renderComments() {
        const commentsList = utils.dom.id('comments-list');
        if (!commentsList) return;

        const startIndex = (this.currentPage - 1) * this.commentsPerPage;
        const endIndex = startIndex + this.commentsPerPage;
        const pageComments = this.comments.slice(startIndex, endIndex);

        commentsList.innerHTML = '';

        if (pageComments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <i class="fas fa-comments" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p>Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }

        pageComments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });

        this.renderPagination();
        this.updateCommentCount();
    }

    createCommentElement(comment) {
        const commentElement = utils.dom.create('div', {
            className: 'comment-item fade-in',
            innerHTML: `
                <div class="comment-header">
                    <div class="comment-avatar">${comment.avatar || comment.name.charAt(0).toUpperCase()}</div>
                    <div class="comment-meta">
                        <div class="comment-author">${utils.dom.create('div').textContent = comment.name, utils.dom.create('div').innerHTML}</div>
                        <div class="comment-date">
                            <i class="far fa-clock"></i>
                            ${utils.timeAgo(comment.createdAt)}
                        </div>
                    </div>
                </div>
                <div class="comment-content">${this.formatCommentContent(comment.content)}</div>
                <div class="comment-actions">
                    <button class="comment-action like-btn" data-id="${comment.id}">
                        <i class="far fa-thumbs-up"></i> Like
                    </button>
                    <button class="comment-action reply-btn" data-id="${comment.id}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                </div>
            `
        });

        // Add animation delay
        setTimeout(() => {
            commentElement.classList.add('visible');
        }, 100);

        return commentElement;
    }

    formatCommentContent(content) {
        // Basic text formatting and sanitization
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    renderPagination() {
        const pagination = utils.dom.id('comments-pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.comments.length / this.commentsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}">
                <i class="fas fa-chevron-left"></i> Previous
            </button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}">
                Next <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    updateCommentCount() {
        const countElement = utils.dom.qs('.comment-count');
        if (countElement) {
            const count = this.comments.length;
            countElement.textContent = `${count} Comment${count !== 1 ? 's' : ''}`;
        }
    }

    bindEvents() {
        // Form submission
        utils.dom.on(document, 'submit', (e) => {
            if (e.target.id === 'comment-form') {
                e.preventDefault();
                this.handleCommentSubmit(e.target);
            }
        });

        // Character counter
        utils.dom.on(document, 'input', (e) => {
            if (e.target.name === 'content') {
                this.updateCharacterCount(e.target);
            }
        });

        // Sort functionality
        utils.dom.on(document, 'change', (e) => {
            if (e.target.id === 'sort-select') {
                this.sortComments(e.target.value);
            }
        });

        // Pagination
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.page-btn')) {
                const page = parseInt(e.target.closest('.page-btn').dataset.page);
                this.goToPage(page);
            }
        });

        // Comment actions
        utils.dom.on(document, 'click', (e) => {
            if (e.target.closest('.like-btn')) {
                this.handleLike(e.target.closest('.like-btn'));
            }
            if (e.target.closest('.reply-btn')) {
                this.handleReply(e.target.closest('.reply-btn'));
            }
        });
    }

    async handleCommentSubmit(form) {
        const formData = new FormData(form);
        const commentData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            content: formData.get('content').trim()
        };

        // Validation
        if (!this.validateComment(commentData)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.comment-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="loading"></i> Posting...';
        submitBtn.disabled = true;

        try {
            // Try to post to server
            const response = await utils.api.post('/api/comments', {
                ...commentData,
                postId: 'home'
            });

            // Add comment to local array
            const newComment = {
                id: Date.now(),
                name: commentData.name,
                content: commentData.content,
                createdAt: new Date().toISOString(),
                avatar: commentData.name.split(' ').map(n => n[0]).join('').toUpperCase()
            };

            this.comments.unshift(newComment);
            this.renderComments();
            form.reset();
            this.updateCharacterCount(form.querySelector('[name="content"]'));
            
            utils.notify.success('Comment posted successfully!');
            
            // Scroll to comments
            setTimeout(() => {
                utils.dom.qs('.comments-list').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } catch (error) {
            console.error('Error posting comment:', error);
            
            // Still add comment locally for demo
            const newComment = {
                id: Date.now(),
                name: commentData.name,
                content: commentData.content,
                createdAt: new Date().toISOString(),
                avatar: commentData.name.split(' ').map(n => n[0]).join('').toUpperCase()
            };

            this.comments.unshift(newComment);
            this.renderComments();
            form.reset();
            this.updateCharacterCount(form.querySelector('[name="content"]'));
            
            utils.notify.success('Comment posted successfully!');
            
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateComment(data) {
        const errors = [];

        if (!utils.validate.notEmpty(data.name)) {
            errors.push('Name is required');
        }
        if (!utils.validate.email(data.email)) {
            errors.push('Valid email is required');
        }
        if (!utils.validate.notEmpty(data.content)) {
            errors.push('Comment content is required');
        }
        if (!utils.validate.maxLength(data.content, 500)) {
            errors.push('Comment must be 500 characters or less');
        }

        if (errors.length > 0) {
            utils.notify.error('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    updateCharacterCount(textarea) {
        const counter = utils.dom.qs('.current-count');
        if (counter && textarea) {
            const count = textarea.value.length;
            counter.textContent = count;
            
            // Change color when approaching limit
            const parent = counter.parentElement;
            if (count > 450) {
                parent.style.color = 'var(--error-color)';
            } else if (count > 400) {
                parent.style.color = 'var(--warning-color)';
            } else {
                parent.style.color = 'var(--text-muted)';
            }
        }
    }

    sortComments(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
        }
        
        this.currentPage = 1;
        this.renderComments();
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderComments();
        
        // Scroll to comments list
        utils.dom.qs('.comments-list').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    handleLike(button) {
        const commentId = parseInt(button.dataset.id);
        button.classList.toggle('liked');
        
        if (button.classList.contains('liked')) {
            button.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
            button.style.color = 'var(--accent-primary)';
        } else {
            button.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
            button.style.color = '';
        }
    }

    handleReply(button) {
        const commentId = parseInt(button.dataset.id);
        utils.notify.info('Reply functionality coming soon!');
    }
}

// Initialize comment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main content to load first
    setTimeout(() => {
        window.commentSystem = new CommentSystem();
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommentSystem;
}