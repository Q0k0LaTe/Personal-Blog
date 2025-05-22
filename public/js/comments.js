// MongoDB Comment Integration
function setupCommentSystem() {
  // Comment form submission handler
  const handleCommentSubmit = async (event, postId = 'home') => {
    event.preventDefault();
    
    const nameInput = event.target.querySelector('[name="name"]');
    const commentInput = event.target.querySelector('[name="comment"]');
    
    const name = nameInput.value.trim();
    const content = commentInput.value.trim();
    
    // Validate inputs
    if (!name || !content) {
      alert('Please provide both your name and a comment');
      return;
    }
    
    try {
      // Send comment to server
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          content,
          postId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const newComment = await response.json();
      
      // Clear form
      nameInput.value = '';
      commentInput.value = '';
      
      // Add comment to UI without refreshing
      addCommentToUI(newComment);
      
      // Show success message
      showNotification('Comment posted successfully!', 'success');
    } catch (error) {
      console.error('Error posting comment:', error);
      showNotification('Failed to post comment. Please try again.', 'error');
    }
  };
  
  // Add a new comment to the UI
  const addCommentToUI = (comment) => {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">
          <i class="fas fa-user-circle"></i>
          ${escapeHtml(comment.name)}
        </div>
        <div class="comment-date">${formatDate(comment.createdAt)}</div>
      </div>
      <div class="comment-body">${escapeHtml(comment.content)}</div>
    `;
    
    // Add to the beginning of the list
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    
    // Add fade-in animation
    setTimeout(() => {
      commentElement.style.opacity = '1';
      commentElement.style.transform = 'translateY(0)';
    }, 10);
  };
  
  // Load comments from server
  const loadComments = async (postId = 'home') => {
    try {
      const response = await fetch(`/api/comments/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const comments = await response.json();
      
      // Clear existing comments
      const commentsList = document.querySelector('.comments-list');
      if (commentsList) {
        commentsList.innerHTML = '';
        
        // Add comments to UI
        comments.forEach(comment => {
          addCommentToUI(comment);
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      showNotification('Failed to load comments', 'error');
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Helper function to escape HTML
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Show notification
  const showNotification = (message, type = 'info') => {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
      
      // Style the notification
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.padding = '12px 24px';
      notification.style.borderRadius = '8px';
      notification.style.fontWeight = '500';
      notification.style.zIndex = '9999';
      notification.style.transition = 'all 0.3s ease';
      notification.style.opacity = '0';
    }
    
    // Set type-specific styles
    if (type === 'success') {
      notification.style.backgroundColor = 'var(--accent-primary)';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#ff3860';
      notification.style.color = 'white';
    } else {
      notification.style.backgroundColor = 'var(--card-bg)';
      notification.style.color = 'var(--text-primary)';
      notification.style.border = '1px solid var(--border-color)';
    }
    
    // Set message and show
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };
  
  // Initialize comment system
  const init = () => {
    // Find all comment forms and attach submit handlers
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
      const postId = form.dataset.postId || 'home';
      form.addEventListener('submit', (event) => handleCommentSubmit(event, postId));
    });
    
    // Load initial comments
    loadComments();
  };
  
  // Run initialization when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Return public methods
  return {
    loadComments,
    handleCommentSubmit
  };
}

// Initialize comment system when script is loaded
const commentSystem = setupCommentSystem();
