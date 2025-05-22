const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample blog data (in a real app, this would be from a database)
let blogPosts = [
  {
    id: 1,
    title: "Getting Started with Node.js and React",
    author: "John Doe",
    date: "2025-05-20",
    excerpt: "Learn how to build modern web applications using Node.js backend with React frontend. This comprehensive guide covers everything you need to know.",
    content: `
      <p>Building modern web applications has never been easier with the powerful combination of Node.js and React. In this comprehensive guide, we'll explore how to create full-stack applications that are both scalable and maintainable.</p>
      
      <h3>Why Node.js and React?</h3>
      <p>Node.js provides a robust backend environment that allows JavaScript developers to use the same language on both client and server sides. React, on the other hand, offers a component-based approach to building user interfaces that makes development efficient and enjoyable.</p>
      
      <h3>Setting Up Your Development Environment</h3>
      <p>First, make sure you have Node.js installed on your system. You can download it from the official website. Once installed, you can create your project structure and start building amazing applications.</p>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use environment variables for configuration</li>
        <li>Implement proper error handling</li>
        <li>Follow RESTful API conventions</li>
        <li>Use proper state management in React</li>
      </ul>
    `,
    category: "Technology",
    tags: ["nodejs", "react", "javascript", "web-development"],
    readTime: "5 min read",
    likes: 42,
    views: 1250
  },
  {
    id: 2,
    title: "The Future of Web Development in 2025",
    author: "Jane Smith",
    date: "2025-05-18",
    excerpt: "Exploring the latest trends and technologies that are shaping the future of web development. From AI integration to new frameworks.",
    content: `
      <p>The web development landscape is constantly evolving, and 2025 promises to be an exciting year with numerous technological advancements and paradigm shifts.</p>
      
      <h3>AI-Powered Development</h3>
      <p>Artificial Intelligence is revolutionizing how we write code. Tools like GitHub Copilot and ChatGPT are helping developers be more productive than ever before. We're seeing AI assistance in debugging, code generation, and even architecture decisions.</p>
      
      <h3>Edge Computing and Serverless</h3>
      <p>The rise of edge computing is bringing processing power closer to users, resulting in faster applications and better user experiences. Serverless architectures are becoming mainstream, allowing developers to focus on code rather than infrastructure.</p>
      
      <h3>New JavaScript Frameworks</h3>
      <p>While React, Vue, and Angular continue to dominate, new frameworks like Svelte and Solid.js are gaining traction with their innovative approaches to reactivity and performance.</p>
      
      <h3>WebAssembly (WASM)</h3>
      <p>WebAssembly is opening new possibilities for web applications, allowing developers to run high-performance code written in languages like Rust, C++, and Go directly in the browser.</p>
    `,
    category: "Technology",
    tags: ["web-development", "ai", "future", "trends"],
    readTime: "7 min read",
    likes: 67,
    views: 2100
  },
  {
    id: 3,
    title: "Building Responsive Designs with CSS Grid",
    author: "Mike Johnson",
    date: "2025-05-15",
    excerpt: "Master CSS Grid to create beautiful, responsive layouts that work perfectly on all devices. Tips, tricks, and real-world examples included.",
    content: `
      <p>CSS Grid has revolutionized how we approach layout design on the web. Unlike flexbox, which is one-dimensional, CSS Grid provides a two-dimensional layout system that gives us unprecedented control over our designs.</p>
      
      <h3>Understanding Grid Basics</h3>
      <p>CSS Grid introduces concepts like grid containers, grid items, grid lines, and grid areas. Understanding these fundamentals is crucial for mastering grid layouts.</p>
      
      <h3>Creating Responsive Layouts</h3>
      <p>One of the most powerful features of CSS Grid is its ability to create responsive layouts without media queries. Using functions like minmax(), repeat(), and auto-fit, we can create layouts that automatically adapt to different screen sizes.</p>
      
      <h3>Grid vs Flexbox</h3>
      <p>While both are powerful layout tools, they serve different purposes:</p>
      <ul>
        <li>Use Flexbox for one-dimensional layouts (rows or columns)</li>
        <li>Use Grid for two-dimensional layouts (rows and columns)</li>
        <li>They work great together in complex designs</li>
      </ul>
      
      <h3>Browser Support</h3>
      <p>CSS Grid is now supported in all modern browsers, making it safe to use in production environments. For older browsers, you can provide fallbacks using flexbox or floats.</p>
    `,
    category: "Design",
    tags: ["css", "grid", "responsive", "layout"],
    readTime: "6 min read",
    likes: 35,
    views: 890
  },
  {
    id: 4,
    title: "Database Design Best Practices",
    author: "Sarah Wilson",
    date: "2025-05-12",
    excerpt: "Learn essential database design principles that will make your applications more efficient, scalable, and maintainable.",
    content: `
      <p>Good database design is the foundation of any successful application. Poor database design can lead to performance issues, data inconsistencies, and maintenance nightmares.</p>
      
      <h3>Normalization</h3>
      <p>Database normalization is the process of organizing data to reduce redundancy and improve data integrity. Understanding the different normal forms (1NF, 2NF, 3NF) is essential for creating efficient database schemas.</p>
      
      <h3>Indexing Strategies</h3>
      <p>Proper indexing can dramatically improve query performance. However, indexes come with trade-offs - they speed up reads but can slow down writes. Choose your indexes carefully based on your application's usage patterns.</p>
      
      <h3>Relationships and Constraints</h3>
      <p>Properly defining relationships between tables and implementing constraints ensures data integrity and prevents common data-related bugs.</p>
      
      <h3>Performance Considerations</h3>
      <ul>
        <li>Use appropriate data types</li>
        <li>Avoid unnecessary columns</li>
        <li>Consider denormalization for read-heavy applications</li>
        <li>Plan for scalability from the beginning</li>
      </ul>
    `,
    category: "Backend",
    tags: ["database", "sql", "design", "performance"],
    readTime: "8 min read",
    likes: 89,
    views: 1560
  }
];

// API Routes

// Get all blog posts
app.get('/api/posts', (req, res) => {
  const { category, tag, search } = req.query;
  let filteredPosts = [...blogPosts];

  // Filter by category
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by tag
  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.includes(tag.toLowerCase())
    );
  }

  // Search functionality
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm)
    );
  }

  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(filteredPosts);
});

// Get single blog post
app.get('/api/posts/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Increment views
  post.views += 1;
  
  res.json(post);
});

// Like a post
app.post('/api/posts/:id/like', (req, res) => {
  const post = blogPosts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.likes += 1;
  res.json({ likes: post.likes });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  res.json(categories);
});

// Get popular tags
app.get('/api/tags', (req, res) => {
  const allTags = blogPosts.flatMap(post => post.tags);
  const tagCounts = {};
  
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  res.json(popularTags);
});

// Add new blog post
app.post('/api/posts', (req, res) => {
  const { title, author, excerpt, content, category, tags } = req.body;
  
  if (!title || !author || !content) {
    return res.status(400).json({ error: 'Title, author, and content are required' });
  }
  
  const newPost = {
    id: Math.max(...blogPosts.map(p => p.id)) + 1,
    title,
    author,
    date: new Date().toISOString().split('T')[0],
    excerpt: excerpt || content.substring(0, 150) + '...',
    content,
    category: category || 'General',
    tags: tags || [],
    readTime: Math.ceil(content.split(' ').length / 200) + ' min read',
    likes: 0,
    views: 0
  };
  
  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📝 Blog server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});