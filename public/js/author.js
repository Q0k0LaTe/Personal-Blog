// Author Information Component
function AuthorInfo({ authorName, authorTitle, showAvatar = true }) {
  return React.createElement('div', { className: 'author-info' },
    showAvatar && React.createElement('div', { className: 'author-avatar' },
      React.createElement('div', { className: 'author-avatar-glow' }),
      React.createElement('div', { className: 'author-avatar-image' },
        React.createElement('i', { className: 'fas fa-user' })
      )
    ),
    
    React.createElement('div', { className: 'author-details' },
      React.createElement('div', { className: 'author-name' }, authorName),
      authorTitle && React.createElement('div', { className: 'author-title' }, authorTitle)
    )
  );
}

// Owner Verification
function verifyOwnership() {
  // This function ensures only Q0k0LaTes can post articles
  // It would typically be used in an admin interface
  
  const OWNER_USERNAME = 'Q0k0LaTes';
  const OWNER_FULLNAME = 'Terrence Zhuoting Han';
  
  // Check if current user is the owner
  const isOwner = (username) => {
    return username === OWNER_USERNAME;
  };
  
  // Get owner information
  const getOwnerInfo = () => {
    return {
      username: OWNER_USERNAME,
      fullName: OWNER_FULLNAME,
      title: 'Web Developer & Tech Enthusiast'
    };
  };
  
  // Add owner information to posts
  const addOwnerToPosts = (posts) => {
    return posts.map(post => ({
      ...post,
      author: OWNER_USERNAME,
      authorFullName: OWNER_FULLNAME
    }));
  };
  
  // Return public methods
  return {
    isOwner,
    getOwnerInfo,
    addOwnerToPosts
  };
}

// Initialize ownership verification
const ownerVerification = verifyOwnership();
