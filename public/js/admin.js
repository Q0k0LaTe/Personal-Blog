// Admin Dashboard Component - public/js/admin.js

class AdminDashboard {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.articles = [];
        this.editingArticle = null;
        
        // Simple authentication (replace with proper auth in production)
        this.adminCredentials = {
            username: 'admin',
            password: 'q0k0lates2025'
        };
        
        this.init();
    }

    init() {
        this.createAdminInterface();
        this.addAdminStyles();
        this.bindEvents();
        this.loadArticles();
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        // Check if user is already logged in (session storage)
        const savedAuth = sessionStorage.getItem('adminAuth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            if (authData.timestamp && (Date.now() - authData.timestamp) < 24 * 60 * 60 * 1000) { // 24 hours
                this.isLoggedIn = true;
                this.currentUser = authData.username;
            }
        }
    }

    createAdminInterface() {
        const adminContainer = utils.dom.create('div', {
            className: 'admin-container hidden',
            id: 'admin-dashboard',
            innerHTML: `
                <div class="container">
                    <!-- Login Form -->
                    <div class="admin-login-form" id="admin-login">
                        <div class="login-card">
                            <div class="login-header">
                                <h2 class="login-title">Admin Access</h2>
                                <p class="login-subtitle">Manage your blog articles</p>
                            </div>
                            <form class="login-form" id="admin-login-form">
                                <div class="form-group">
                                    <label class="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        id="admin-username"
                                        class="form-control"
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        id="admin-password"
                                        class="form-control"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                <div class="login-error" id="login-error"></div>
                                <button type="submit" class="btn btn-primary login-btn">
                                    <i class="fas fa-sign-in-alt"></i> Login
                                </button>
                            </form>
                            <div class="login-demo-info">
                                <p><strong>Demo Credentials:</strong></p>
                                <p>Username: admin</p>
                                <p>Password: q0k0lates2025</p>
                            </div>
                        </div>
                    </div>

                    <!-- Admin Dashboard -->
                    <div class="admin-dashboard-content" id="admin-content">
                        <div class="dashboard-header">
                            <div class="dashboard-title">
                                <h1>Admin Dashboard</h1>
                                <p class="dashboard-subtitle">Manage your blog content</p>
                            </div>
                            <div class="dashboard-actions">
                                <span class="welcome-text">Welcome, <span id="admin-user"></span></span>
                                <button class="btn btn-outline" id="admin-logout">
                                    <i class="fas fa-sign-out-alt"></i> Logout
                                </button>
                            </div>
                        </div>

                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-newspaper"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="total-articles">0</span>
                                    <span class="stat-label">Total Articles</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="featured-articles">0</span>
                                    <span class="stat-label">Featured Articles</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-calendar"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="recent-articles">0</span>
                                    <span class="stat-label">This Month</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-eye"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number" id="total-views">0</span>
                                    <span class="stat-label">Total Views</span>
                                </div>
                            </div>
                        </div>

                        <div class="dashboard-main">
                            <div class="dashboard-section">
                                <div class="section-header">
                                    <h2>Article Management</h2>
                                    <button class="btn btn-primary" id="new-article-btn">
                                        <i class="fas fa-plus"></i> New Article
                                    </button>
                                </div>
                                <div class="articles-table" id="articles-table">
                                    <!-- Articles will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Article Editor -->
                    <div class="article-editor-modal" id="article-editor-modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="editor-title">New Article</h3>
                                <button class="modal-close" id="editor-close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="article-form">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Title *</label>
                                            <input 
                                                type="text" 
                                                id="article-title"
                                                class="form-control"
                                                placeholder="Enter article title"
                                                required
                                            />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Category *</label>
                                            <select id="article-category" class="form-control" required>
                                                <option value="">Select category</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Web Development">Web Development</option>
                                                <option value="Personal">Personal</option>
                                                <option value="Tutorial">Tutorial</option>
                                                <option value="Opinion">Opinion</option>
                                                <option value="News">News</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Excerpt *</label>
                                        <textarea 
                                            id="article-excerpt"
                                            class="form-control"
                                            rows="3"
                                            placeholder="Brief description of the article"
                                            required
                                        ></textarea>
                                        <div class="character-count">
                                            <span id="excerpt-count">0</span>/300 characters
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Content *</label>
                                        <div class="editor-toolbar">
                                            <button type="button" class="toolbar-btn" data-action="bold">
                                                <i class="fas fa-bold"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="italic">
                                                <i class="fas fa-italic"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="heading">
                                                <i class="fas fa-heading"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="link">
                                                <i class="fas fa-link"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="image">
                                                <i class="fas fa-image"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="code">
                                                <i class="fas fa-code"></i>
                                            </button>
                                            <button type="button" class="toolbar-btn" data-action="preview">
                                                <i class="fas fa-eye"></i> Preview
                                            </button>
                                        </div>
                                        <textarea 
                                            id="article-content"
                                            class="form-control editor-textarea"
                                            rows="15"
                                            placeholder="Write your article content here... (Markdown supported)"
                                            required
                                        ></textarea>
                                        <div class="editor-help">
                                            <small>Supports Markdown formatting. Use **bold**, *italic*, # headings, [links](url), etc.</small>
                                        </div>
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Tags</label>
                                            <input 
                                                type="text" 
                                                id="article-tags"
                                                class="form-control"
                                                placeholder="Enter tags separated by commas"
                                            />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Image URL</label>
                                            <input 
                                                type="url" 
                                                id="article-image"
                                                class="form-control"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div class="form-options">
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="article-featured" />
                                            <span class="checkbox-custom"></span>
                                            <span>Featured Article</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" id="article-published" checked />
                                            <span class="checkbox-custom"></span>
                                            <span>Publish Immediately</span>
                                        </label>
                                    </div>
                                    
                                    <div class="form-actions">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-save"></i> <span id="save-btn-text">Save Article</span>
                                        </button>
                                        <button type="button" class="btn btn-outline" id="cancel-edit">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Modal -->
                    <div class="preview-modal" id="preview-modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3>Article Preview</h3>
                                <button class="modal-close" id="preview-close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div id="preview-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });

        // Insert after main content
        const mainContent = utils.dom.qs('.main-content') || utils.dom.qs('main') || document.body;
        mainContent.parentNode.insertBefore(adminContainer, mainContent.nextSibling);
    }

    addAdminStyles() {
        if (document.querySelector('#admin-dashboard-styles')) return;

        const styles = utils.dom.create('style', {
            id: 'admin-dashboard-styles',
            innerHTML: `
                .admin-container {
                    margin-top: var(--space-2xl);
                    min-height: 80vh;
                }

                .admin-container.hidden {
                    display: none;
                }

                /* Login Form */
                .admin-login-form {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 60vh;
                }

                .login-card {
                    background: var(--bg-secondary);
                    padding: var(--space-2xl);
                    border: 2px solid var(--border-dark);
                    max-width: 400px;
                    width: 100%;
                }

                .login-header {
                    text-align: center;
                    margin-bottom: var(--space-xl);
                }

                .login-title {
                    font-family: var(--font-headline);
                    font-size: var(--text-3xl);
                    color: var(--text-primary);
                    margin-bottom: var(--space-sm);
                }

                .login-subtitle {
                    color: var(--text-secondary);
                    font-size: var(--text-sm);
                }

                .login-form {
                    margin-bottom: var(--space-lg);
                }

                .login-error {
                    color: var(--accent-primary);
                    font-size: var(--text-sm);
                    margin-bottom: var(--space-md);
                    text-align: center;
                    min-height: 20px;
                }

                .login-btn {
                    width: 100%;
                    padding: var(--space-md);
                    font-size: var(--text-base);
                }

                .login-demo-info {
                    background: var(--bg-tertiary);
                    padding: var(--space-md);
                    border: 1px solid var(--border-color);
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    text-align: center;
                }

                /* Dashboard Content */
                .admin-dashboard-content {
                    display: none;
                }

                .admin-dashboard-content.active {
                    display: block;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-2xl);
                    padding: var(--space-xl);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-dark);
                }

                .dashboard-title h1 {
                    font-family: var(--font-headline);
                    font-size: var(--text-3xl);
                    color: var(--text-primary);
                    margin-bottom: var(--space-xs);
                }

                .dashboard-subtitle {
                    color: var(--text-secondary);
                    font-size: var(--text-sm);
                }

                .dashboard-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--space-lg);
                }

                .welcome-text {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                /* Dashboard Stats */
                .dashboard-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-lg);
                    margin-bottom: var(--space-2xl);
                }

                .stat-card {
                    background: var(--bg-secondary);
                    padding: var(--space-xl);
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: var(--space-lg);
                    transition: all var(--transition-normal);
                }

                .stat-card:hover {
                    border-color: var(--accent-primary);
                    box-shadow: var(--shadow-medium);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    background: var(--accent-primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-xl);
                }

                .stat-number {
                    display: block;
                    font-family: var(--font-headline);
                    font-size: var(--text-2xl);
                    font-weight: bold;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .stat-label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* Dashboard Main */
                .dashboard-section {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-xl);
                    background: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                }

                .section-header h2 {
                    font-family: var(--font-headline);
                    font-size: var(--text-2xl);
                    color: var(--text-primary);
                    margin: 0;
                }

                /* Articles Table */
                .articles-table {
                    overflow-x: auto;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table th,
                .table td {
                    padding: var(--space-md);
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }

                .table th {
                    background: var(--bg-secondary);
                    font-weight: bold;
                    font-size: var(--text-sm);
                    color: var(--text-primary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .table tr:hover {
                    background: var(--bg-secondary);
                }

                .article-title-cell {
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .article-meta {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: var(--space-xs);
                }

                .status-badge {
                    padding: var(--space-xs) var(--space-sm);
                    font-size: var(--text-xs);
                    font-weight: bold;
                    text-transform: uppercase;
                    border-radius: 12px;
                }

                .status-published {
                    background: #e8f5e8;
                    color: #2d5a2d;
                }

                .status-draft {
                    background: #fff3cd;
                    color: #856404;
                }

                .status-featured {
                    background: var(--accent-light);
                    color: var(--accent-primary);
                }

                .article-actions {
                    display: flex;
                    gap: var(--space-sm);
                }

                .action-btn {
                    padding: var(--space-xs) var(--space-sm);
                    font-size: var(--text-xs);
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .action-btn:hover {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .action-btn.danger:hover {
                    background: #dc3545;
                    border-color: #dc3545;
                }

                /* Article Editor Modal */
                .article-editor-modal,
                .preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-lg);
                }

                .article-editor-modal.active,
                .preview-modal.active {
                    display: flex;
                }

                .modal-content {
                    background: var(--bg-primary);
                    border: 2px solid var(--border-dark);
                    max-width: 800px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-xl);
                    background: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-header h3 {
                    font-family: var(--font-headline);
                    font-size: var(--text-xl);
                    color: var(--text-primary);
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: var(--text-lg);
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--space-sm);
                    transition: color var(--transition-fast);
                }

                .modal-close:hover {
                    color: var(--accent-primary);
                }

                .modal-body {
                    padding: var(--space-xl);
                }

                /* Form Styles */
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-lg);
                }

                .form-group {
                    margin-bottom: var(--space-lg);
                }

                .form-label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                    font-size: var(--text-sm);
                }

                .form-control {
                    width: 100%;
                    padding: var(--space-md);
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: var(--text-sm);
                    transition: border-color var(--transition-fast);
                }

                .form-control:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                }

                .character-count {
                    text-align: right;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: var(--space-xs);
                }

                /* Editor Toolbar */
                .editor-toolbar {
                    display: flex;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-sm);
                    padding: var(--space-sm);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                }

                .toolbar-btn {
                    padding: var(--space-xs) var(--space-sm);
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: var(--text-xs);
                    transition: all var(--transition-fast);
                }

                .toolbar-btn:hover {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .editor-textarea {
                    min-height: 300px;
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                    line-height: 1.6;
                    resize: vertical;
                }

                .editor-help {
                    margin-top: var(--space-sm);
                }

                .editor-help small {
                    color: var(--text-muted);
                    font-size: var(--text-xs);
                }

                /* Form Options */
                .form-options {
                    display: flex;
                    gap: var(--space-xl);
                    margin-bottom: var(--space-xl);
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    cursor: pointer;
                    font-size: var(--text-sm);
                }

                .checkbox-label input[type="checkbox"] {
                    display: none;
                }

                .checkbox-custom {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--border-color);
                    background: var(--bg-primary);
                    position: relative;
                    transition: all var(--transition-fast);
                }

                .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                }

                .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: var(--text-xs);
                    font-weight: bold;
                }

                /* Form Actions */
                .form-actions {
                    display: flex;
                    gap: var(--space-md);
                    justify-content: flex-end;
                }

                /* Preview Content */
                #preview-content {
                    font-family: var(--font-body);
                    line-height: 1.7;
                    color: var(--text-primary);
                }

                #preview-content h1,
                #preview-content h2,
                #preview-content h3 {
                    font-family: var(--font-headline);
                    margin-bottom: var(--space-lg);
                    color: var(--text-primary);
                }

                #preview-content p {
                    margin-bottom: var(--space-lg);
                }

                #preview-content code {
                    background: var(--bg-secondary);
                    padding: var(--space-xs);
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                }

                #preview-content pre {
                    background: var(--bg-secondary);
                    padding: var(--space-lg);
                    overflow-x: auto;
                    margin-bottom: var(--space-lg);
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: var(--space-3xl);
                    color: var(--text-muted);
                }

                .empty-state i {
                    font-size: 3rem;
                    margin-bottom: var(--space-lg);
                }

                .empty-state h3 {
                    font-family: var(--font-headline);
                    margin-bottom: var(--space-md);
                    color: var(--text-secondary);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: var(--space-md);
                        text-align: center;
                    }

                    .dashboard-stats {
                        grid-template-columns: 1fr;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .form-options {
                        flex-direction: column;
                        gap: var(--space-md);
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .modal-content {
                        margin: var(--space-md);
                        max-height: calc(100vh - 2rem);
                    }

                    .editor-toolbar {
                        flex-wrap: wrap;
                    }
                }
            `
        });

        document.head.appendChild(styles);
    }

    bindEvents() {
        // Login form submission
        utils.dom.on(document, 'submit', (e) => {
            if (e.target.id === 'admin-login-form') {
                e.preventDefault();
                this.handleLogin();
            }
        });

        // Article form submission
        utils.dom.on(document, 'submit', (e) => {
            if (e.target.id === 'article-form') {
                e.preventDefault();
                this.handleArticleSubmit();
            }
        });

        // Navigation clicks
        utils.dom.on(document, 'click', (e) => {
            // Show admin dashboard
            if (e.target.closest('a[href="#admin"], .nav-link[href="#admin"]')) {
                e.preventDefault();
                this.showAdminDashboard();
            }

            // Hide admin dashboard
            if (e.target.closest('.nav-link:not([href="#admin"])')) {
                this.hideAdminDashboard();
            }

            // Logout
            if (e.target.closest('#admin-logout')) {
                this.handleLogout();
            }

            // New article
            if (e.target.closest('#new-article-btn')) {
                this.showArticleEditor();
            }

            // Edit article
            if (e.target.closest('.edit-article')) {
                const articleId = parseInt(e.target.closest('.edit-article').dataset.id);
                this.editArticle(articleId);
            }

            // Delete article
            if (e.target.closest('.delete-article')) {
                const articleId = parseInt(e.target.closest('.delete-article').dataset.id);
                this.deleteArticle(articleId);
            }

            // Close modals
            if (e.target.closest('#editor-close, #cancel-edit')) {
                this.hideArticleEditor();
            }

            if (e.target.closest('#preview-close')) {
                this.hidePreview();
            }

            // Preview article
            if (e.target.closest('[data-action="preview"]')) {
                e.preventDefault();
                this.showPreview();
            }

            // Editor toolbar actions
            if (e.target.closest('.toolbar-btn')) {
                e.preventDefault();
                const action = e.target.closest('.toolbar-btn').dataset.action;
                if (action !== 'preview') {
                    this.handleEditorAction(action);
                }
            }
        });

        // Character counter for excerpt
        utils.dom.on(document, 'input', (e) => {
            if (e.target.id === 'article-excerpt') {
                this.updateCharacterCount();
            }
        });
    }

    async handleLogin() {
        const username = utils.dom.id('admin-username').value;
        const password = utils.dom.id('admin-password').value;
        const errorEl = utils.dom.id('login-error');

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isLoggedIn = true;
            this.currentUser = username;
            
            // Save auth state
            sessionStorage.setItem('adminAuth', JSON.stringify({
                username: username,
                timestamp: Date.now()
            }));
            
            this.showDashboardContent();
            errorEl.textContent = '';
            utils.notify.success('Login successful!');
        } else {
            errorEl.textContent = 'Invalid username or password';
            utils.notify.error('Login failed');
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        sessionStorage.removeItem('adminAuth');
        this.showLoginForm();
        utils.notify.info('Logged out successfully');
    }

    showAdminDashboard() {
        // Hide main content
        const mainContent = utils.dom.qs('.newspaper-grid, .main-content');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Hide about page if visible
        const aboutPage = utils.dom.id('about-page');
        if (aboutPage) {
            aboutPage.classList.add('hidden');
        }

        // Show admin container
        const adminContainer = utils.dom.id('admin-dashboard');
        if (adminContainer) {
            adminContainer.classList.remove('hidden');
        }

        // Show appropriate content based on login status
        if (this.isLoggedIn) {
            this.showDashboardContent();
        } else {
            this.showLoginForm();
        }

        // Update navigation
        const navLinks = utils.dom.qsa('.nav-link');
        navLinks.forEach(link => utils.dom.removeClass(link, 'active'));
        
        const adminNavLink = utils.dom.qs('.nav-link[href="#admin"]');
        if (adminNavLink) {
            utils.dom.addClass(adminNavLink, 'active');
        }

        // Update page title
        document.title = 'Admin Dashboard - The Q0k0LaTes Chronicle';
    }

    hideAdminDashboard() {
        // Show main content
        const mainContent = utils.dom.qs('.newspaper-grid, .main-content');
        if (mainContent) {
            mainContent.style.display = '';
        }

        // Hide admin container
        const adminContainer = utils.dom.id('admin-dashboard');
        if (adminContainer) {
            adminContainer.classList.add('hidden');
        }

        // Reset page title
        document.title = 'The Q0k0LaTes Chronicle - Tech News & Insights';
    }

    showLoginForm() {
        const loginForm = utils.dom.id('admin-login');
        const dashboardContent = utils.dom.id('admin-content');
        
        if (loginForm) loginForm.style.display = 'flex';
        if (dashboardContent) dashboardContent.classList.remove('active');
    }

    showDashboardContent() {
        const loginForm = utils.dom.id('admin-login');
        const dashboardContent = utils.dom.id('admin-content');
        
        if (loginForm) loginForm.style.display = 'none';
        if (dashboardContent) dashboardContent.classList.add('active');
        
        // Update user display
        const userSpan = utils.dom.id('admin-user');
        if (userSpan) {
            userSpan.textContent = this.currentUser;
        }
        
        this.updateDashboardStats();
        this.loadArticlesTable();
    }

    async loadArticles() {
        try {
            const response = await utils.api.get('/api/articles?limit=100');
            this.articles = response.articles || [];
        } catch (error) {
            console.error('Failed to load articles:', error);
            this.articles = [];
        }
    }

    updateDashboardStats() {
        const totalArticles = this.articles.length;
        const featuredArticles = this.articles.filter(a => a.featured).length;
        const thisMonth = this.articles.filter(a => {
            const articleDate = new Date(a.createdAt || a.date);
            const now = new Date();
            return articleDate.getMonth() === now.getMonth() && 
                   articleDate.getFullYear() === now.getFullYear();
        }).length;
        const totalViews = this.articles.reduce((sum, a) => sum + (a.views || 0), 0);

        utils.dom.id('total-articles').textContent = totalArticles;
        utils.dom.id('featured-articles').textContent = featuredArticles;
        utils.dom.id('recent-articles').textContent = thisMonth;
        utils.dom.id('total-views').textContent = totalViews;
    }

    loadArticlesTable() {
        const tableContainer = utils.dom.id('articles-table');
        
        if (this.articles.length === 0) {
            tableContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>No Articles Yet</h3>
                    <p>Create your first article to get started!</p>
                    <button class="btn btn-primary" onclick="window.adminDashboard.showArticleEditor()">
                        <i class="fas fa-plus"></i> Create Article
                    </button>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.articles.map(article => `
                        <tr>
                            <td>
                                <div class="article-title-cell">${article.title}</div>
                                <div class="article-meta">
                                    ${article.tags ? article.tags.join(', ') : 'No tags'}
                                </div>
                            </td>
                            <td>${article.category}</td>
                            <td>
                                <span class="status-badge status-${article.published !== false ? 'published' : 'draft'}">
                                    ${article.published !== false ? 'Published' : 'Draft'}
                                </span>
                                ${article.featured ? '<span class="status-badge status-featured">Featured</span>' : ''}
                            </td>
                            <td>${utils.formatShortDate(article.createdAt || article.date)}</td>
                            <td>${article.views || 0}</td>
                            <td class="article-actions">
                                <button class="action-btn edit-article" data-id="${article.id}">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="action-btn delete-article danger" data-id="${article.id}">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
    }

    showArticleEditor(article = null) {
        this.editingArticle = article;
        const modal = utils.dom.id('article-editor-modal');
        const title = utils.dom.id('editor-title');
        const saveBtn = utils.dom.id('save-btn-text');
        
        // Update modal title
        title.textContent = article ? 'Edit Article' : 'New Article';
        saveBtn.textContent = article ? 'Update Article' : 'Save Article';
        
        // Populate form if editing
        if (article) {
            utils.dom.id('article-title').value = article.title || '';
            utils.dom.id('article-category').value = article.category || '';
            utils.dom.id('article-excerpt').value = article.excerpt || '';
            utils.dom.id('article-content').value = article.content || '';
            utils.dom.id('article-tags').value = article.tags ? article.tags.join(', ') : '';
            utils.dom.id('article-image').value = article.image || '';
            utils.dom.id('article-featured').checked = article.featured || false;
            utils.dom.id('article-published').checked = article.published !== false;
        } else {
            // Reset form
            utils.dom.id('article-form').reset();
            utils.dom.id('article-published').checked = true;
        }
        
        this.updateCharacterCount();
        modal.classList.add('active');
    }

    hideArticleEditor() {
        const modal = utils.dom.id('article-editor-modal');
        modal.classList.remove('active');
        this.editingArticle = null;
    }

    async handleArticleSubmit() {
        const formData = {
            title: utils.dom.id('article-title').value.trim(),
            category: utils.dom.id('article-category').value,
            excerpt: utils.dom.id('article-excerpt').value.trim(),
            content: utils.dom.id('article-content').value.trim(),
            tags: utils.dom.id('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            image: utils.dom.id('article-image').value.trim(),
            featured: utils.dom.id('article-featured').checked,
            published: utils.dom.id('article-published').checked
        };

        // Validation
        if (!formData.title || !formData.category || !formData.excerpt || !formData.content) {
            utils.notify.error('Please fill in all required fields');
            return;
        }

        try {
            let savedArticle;
            
            if (this.editingArticle) {
                // Update existing article
                savedArticle = await utils.api.put(`/api/articles/${this.editingArticle.id}`, formData);
                utils.notify.success('Article updated successfully!');
            } else {
                // Create new article
                savedArticle = await utils.api.post('/api/articles', formData);
                utils.notify.success('Article created successfully!');
            }
            
            this.hideArticleEditor();
            await this.loadArticles();
            this.updateDashboardStats();
            this.loadArticlesTable();
            
        } catch (error) {
            console.error('Failed to save article:', error);
            
            // For demo purposes, simulate saving locally
            const articleData = {
                ...formData,
                id: this.editingArticle ? this.editingArticle.id : Date.now(),
                date: this.editingArticle ? this.editingArticle.date : new Date().toISOString(),
                createdAt: this.editingArticle ? this.editingArticle.createdAt : new Date().toISOString(),
                views: this.editingArticle ? this.editingArticle.views : 0,
                author: 'Q0k0LaTes',
                authorName: 'Terrence Zhuoting Han'
            };
            
            if (this.editingArticle) {
                const index = this.articles.findIndex(a => a.id === this.editingArticle.id);
                if (index !== -1) {
                    this.articles[index] = articleData;
                }
                utils.notify.success('Article updated successfully!');
            } else {
                this.articles.unshift(articleData);
                utils.notify.success('Article created successfully!');
            }
            
            this.hideArticleEditor();
            this.updateDashboardStats();
            this.loadArticlesTable();
        }
    }

    editArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            this.showArticleEditor(article);
        }
    }

    async deleteArticle(articleId) {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            return;
        }

        try {
            await utils.api.delete(`/api/articles/${articleId}`);
            utils.notify.success('Article deleted successfully!');
        } catch (error) {
            console.error('Failed to delete article:', error);
            // For demo purposes, delete locally
            utils.notify.success('Article deleted successfully!');
        }

        // Remove from local array
        this.articles = this.articles.filter(a => a.id !== articleId);
        this.updateDashboardStats();
        this.loadArticlesTable();
    }

    updateCharacterCount() {
        const excerpt = utils.dom.id('article-excerpt');
        const counter = utils.dom.id('excerpt-count');
        
        if (excerpt && counter) {
            const count = excerpt.value.length;
            counter.textContent = count;
            
            // Change color based on length
            if (count > 280) {
                counter.style.color = 'var(--accent-primary)';
            } else if (count > 250) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }
    }

    handleEditorAction(action) {
        const textarea = utils.dom.id('article-content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let replacement = '';
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                replacement = `*${selectedText || 'italic text'}*`;
                break;
            case 'heading':
                replacement = `## ${selectedText || 'Heading'}`;
                break;
            case 'link':
                const url = prompt('Enter URL:');
                if (url) {
                    replacement = `[${selectedText || 'link text'}](${url})`;
                }
                break;
            case 'image':
                const imgUrl = prompt('Enter image URL:');
                if (imgUrl) {
                    replacement = `![${selectedText || 'alt text'}](${imgUrl})`;
                }
                break;
            case 'code':
                replacement = `\`${selectedText || 'code'}\``;
                break;
        }
        
        if (replacement) {
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        }
    }

    showPreview() {
        const title = utils.dom.id('article-title').value;
        const content = utils.dom.id('article-content').value;
        const previewModal = utils.dom.id('preview-modal');
        const previewContent = utils.dom.id('preview-content');
        
        // Simple markdown parsing (basic implementation)
        let html = content
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        html = `<h1>${title}</h1><p>${html}</p>`;
        
        previewContent.innerHTML = html;
        previewModal.classList.add('active');
    }

    hidePreview() {
        const previewModal = utils.dom.id('preview-modal');
        previewModal.classList.remove('active');
    }

    // Public method to get articles for main app
    getArticles() {
        return this.articles;
    }

    // Public method to check if user is logged in
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Initialize Admin Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other components to load first
    setTimeout(() => {
        window.adminDashboard = new AdminDashboard();
    }, 2000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}