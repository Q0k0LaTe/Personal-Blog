const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Q0k0LaTes:Hanzhuoting0324-@cluster0.ngvjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('📰 Connected to MongoDB - The Q0k0LaTes Chronicle Database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Article Schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Q0k0LaTes',
    trim: true
  },
  authorName: {
    type: String,
    default: 'Terrence Zhuoting Han',
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Article = mongoose.model('Article', articleSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  articleId: {
    type: String,
    required: true,
    default: 'home'
  },
  approved: {
    type: Boolean,
    default: true // Auto-approve for now
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);

// Newsletter Subscription Schema
const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  active: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// API Routes

// Get all articles with pagination and filtering
app.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const featured = req.query.featured;

    let query = { published: true };

    // Add category filter
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }

    // Add featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const articles = await Article
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Exclude full content for list view

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalArticles: total
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server error while fetching articles' });
  }
});

// Get featured article
app.get('/api/articles/featured', async (req, res) => {
  try {
    const featuredArticle = await Article.findOne({ featured: true, published: true });
    res.json(featuredArticle);
  } catch (err) {
    console.error('Error fetching featured article:', err);
    res.status(500).json({ message: 'Server error while fetching featured article' });
  }
});

// Get single article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article || !article.published) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ message: 'Server error while fetching article' });
  }
});

// Create new article (admin only - would need authentication in production)
app.post('/api/articles', async (req, res) => {
  try {
    // Validate required fields
    const { title, content, excerpt, category } = req.body;
    
    if (!title || !content || !excerpt || !category) {
      return res.status(400).json({ 
        message: 'Title, content, excerpt, and category are required' 
      });
    }

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / wordsPerMinute)} min read`;

    const newArticle = new Article({
      ...req.body,
      readTime,
      updatedAt: new Date()
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Server error while creating article' });
  }
});

// Update article
app.put('/api/articles/:id', async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(updatedArticle);
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ message: 'Server error while updating article' });
  }
});

// Get comments for an article
app.get('/api/comments/:articleId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const comments = await Comment
      .find({ 
        articleId: req.params.articleId,
        approved: true 
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-email'); // Don't expose emails

    const total = await Comment.countDocuments({ 
      articleId: req.params.articleId,
      approved: true 
    });

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// Add a comment
app.post('/api/comments', async (req, res) => {
  try {
    const { name, email, content, articleId } = req.body;
    
    // Validate required fields
    if (!name || !email || !content) {
      return res.status(400).json({ 
        message: 'Name, email, and content are required' 
      });
    }

    // Basic content filtering (you might want to use a more sophisticated solution)
    const filteredContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '');

    const newComment = new Comment({
      name: name.substring(0, 100), // Limit name length
      email,
      content: filteredContent.substring(0, 500), // Limit content length
      articleId: articleId || 'home'
    });
    
    const savedComment = await newComment.save();
    
    // Don't return email in response
    const { email: _, ...commentResponse } = savedComment.toObject();
    
    res.status(201).json(commentResponse);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.active) {
        return res.status(409).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existingSubscription.active = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();
    
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    res.status(500).json({ message: 'Server error while subscribing' });
  }
});

// Get site statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [articleCount, commentCount, subscriberCount] = await Promise.all([
      Article.countDocuments({ published: true }),
      Comment.countDocuments({ approved: true }),
      Newsletter.countDocuments({ active: true })
    ]);

    const totalViews = await Article.aggregate([
      { $match: { published: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.json({
      articles: articleCount,
      comments: commentCount,
      subscribers: subscriberCount,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// Search articles
app.get('/api/search', async (req, res) => {
  try {
    const { query, category, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let searchQuery = {
      published: true,
      $text: { $search: query }
    };

    if (category && category !== 'all') {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    const articles = await Article
      .find(searchQuery, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content');

    const total = await Article.countDocuments(searchQuery);

    res.json({
      articles,
      query,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total
    });
  } catch (err) {
    console.error('Error searching articles:', err);
    res.status(500).json({ message: 'Server error while searching' });
  }
});

// Get popular articles
app.get('/api/articles/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const popularArticles = await Article
      .find({ published: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .select('title excerpt image category views createdAt');

    res.json(popularArticles);
  } catch (err) {
    console.error('Error fetching popular articles:', err);
    res.status(500).json({ message: 'Server error while fetching popular articles' });
  }
});

// Serve the main HTML file for all routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📰 Shutting down The Q0k0LaTes Chronicle server...');
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('🗞️  ====================================');
  console.log('📰  The Q0k0LaTes Chronicle Server');
  console.log('🗞️  ====================================');
  console.log(`📡  Server running on port ${PORT}`);
  console.log(`🌐  Local: http://localhost:${PORT}`);
  console.log(`👤  Author: Terrence Zhuoting Han`);
  console.log(`📧  Contact: Q0k0LaTes`);
  console.log('🗞️  ====================================');
});