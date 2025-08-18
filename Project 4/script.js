const BLOG_STORAGE_KEY = 'vividVoicesBlogs';
const LIKES_STORAGE_KEY = 'blogLikes';
const COMMENTS_STORAGE_KEY = 'blogComments';
const MAX_CONTENT_LENGTH = 100;
const DEFAULT_IMAGE = 'default-blog.jpg';

// Utility Functions
const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
};

// Data Initialization
function initializeData() {
    initializeBlogs();
    initializeLikes();
    initializeComments();
}
function initializeBlogs() {
    let existingBlogs = getSavedBlogs();
    const needsReset = !existingBlogs || existingBlogs.length === 0;

    if (needsReset) {
        const sampleBlogs = [
            {
                id: 1,
                title: "Five Street Foods You Have to Try Before You Die – Pakistan Edition 🇵🇰🍢",
                content: `Pakistan's street food scene is a flavorful adventure — spicy, tangy, and full of character. If you're visiting, these five are non-negotiable.\n\n1. Bun Kebab – A Karachi classic: spicy beef or chicken patty in a soft bun with chutney, onions, and egg.\n\n2. Gol Gappay – Crispy shells filled with tangy tamarind water, chickpeas, and potatoes — a perfect burst of flavor.\n\n3. Chana Chaat – A mix of chickpeas, potatoes, tomatoes, onions, and chutneys, balanced between spicy and sweet.\n\n4. Seekh Kebabs – Skewered minced meat grilled to smoky perfection, often served with naan and green chutney.\n\n5. Jalebi – Bright orange coils of crispy, syrupy sweetness — a must-have dessert on the go.`,
                image: "food.webp",
                category: "Food",
                date: getCurrentDate(),
                isFeatured: true
            },
            {
                id: 2,
                title: "Sketching in Coffee Shops ☕🎨",
                content: `There's something magical about sketching in a coffee shop. The hum of conversation, the hiss of the espresso machine, the occasional clink of cups — it all becomes part of the drawing.\n\nI usually start with the easy subjects: the curve of a mug, the swirl of steam, a half-eaten pastry. But soon my pencil wanders to the people — the student lost in notes, the couple sharing headphones, the barista moving like choreography behind the counter.\n\nSketching in public teaches speed and subtlety. People don't pose; they shift, laugh, and sip. You learn to capture the essence before the moment changes.\n\nSometimes, strangers notice and smile. A few even ask to see the sketch. Those small connections are as satisfying as the drawing itself.\n\nFor me, coffee shops aren't just places to caffeinate — they're living sketchbooks.`,
                image: "img2.PNG",
                category: "Art",
                date: getCurrentDate()
            },
            {
                id: 3,
                title: "Five Ways AI Saves Me an Hour a Day ⏳",
                content: `AI has become my quiet productivity partner, shaving about an hour off my daily routine without much effort.\n\n1. Email Sorting – AI filters flag urgent emails so I skip the inbox overwhelm and get straight to what matters.\n\n2. Quick Summaries – Long reports, articles, and meeting notes get condensed into bullet points in seconds.\n\n3. Fast Drafting – Need a blog intro or reply? AI gives me a rough draft so I never start from scratch.\n\n4. Smart Scheduling – AI tools reshuffle my calendar automatically when deadlines or meetings shift.\n\n5. Instant Designs – Instead of spending 30 minutes on graphics, AI gives me ready-to-edit visuals in minutes.\n\nAI doesn't replace my work — it clears the busywork so I can focus on the things that actually matter.`,
                image: "AI.PNG",
                category: "Technology",
                date: getCurrentDate()
            }
        ];
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(sampleBlogs));
    }
}

function initializeLikes() {
    if (!localStorage.getItem(LIKES_STORAGE_KEY)) {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify({}));
    }
}

function initializeComments() {
    if (!localStorage.getItem(COMMENTS_STORAGE_KEY)) {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify({}));
    }
}

// Data Management
function getSavedBlogs() {
    const savedBlogs = localStorage.getItem(BLOG_STORAGE_KEY);
    return savedBlogs ? JSON.parse(savedBlogs) : [];
}

function saveNewBlog(title, content, category = "New Post", image = DEFAULT_IMAGE) {
    const blogs = getSavedBlogs();
    const newBlog = {
        id: Date.now(),
        title: escapeHTML(title),
        content: escapeHTML(content),
        image,
        category,
        date: getCurrentDate()
    };
    blogs.unshift(newBlog);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
    return newBlog;
}

function toggleLike(blogId) {
    const likes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY));
    likes[blogId] = likes[blogId] ? likes[blogId] + 1 : 1;
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    return likes[blogId];
}

function getLikeCount(blogId) {
    const likes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY));
    return likes[blogId] || 0;
}

function addComment(blogId, text) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY));
    if (!comments[blogId]) comments[blogId] = [];
    
    const newComment = {
        id: Date.now(),
        text: escapeHTML(text),
        date: new Date().toLocaleString()
    };
    
    comments[blogId].unshift(newComment);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    return newComment;
}

function getComments(blogId) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY));
    return comments[blogId] || [];
}

// UI Rendering
function renderBlogCard(blog) {
    const isLong = blog.content.length > MAX_CONTENT_LENGTH;
    const shortContent = isLong 
        ? blog.content.substring(0, MAX_CONTENT_LENGTH) + '...' 
        : blog.content;
    
    const featuredTag = blog.isFeatured ? 'featured-tag' : '';
    
    return `
    <div class="card-grid" data-id="${blog.id}">
        <div class="card">
            <img src="${blog.image}" alt="${escapeHTML(blog.title)}" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="card-category ${featuredTag}">${blog.category}</div>
        </div>
        <div class="card-body">
            <div class="card-date">${blog.date}</div>
            <h3 class="card-title">${escapeHTML(blog.title)}</h3>
            <p class="blog-content">${shortContent.replace(/\n/g, '<br>')}</p>
            <div class="blog-actions">
                <button class="read-toggle">
                    ${isLong ? 'Read More' : 'Show Full'}
                    <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button class="like-btn" data-id="${blog.id}">
                    <i class="heart-icon fas fa-heart"></i>
                    <span class="like-count">${getLikeCount(blog.id)}</span>
                </button>
                <button class="comment-toggle">
                    <i class="far fa-comment"></i> 
                    <span class="comment-count">${getComments(blog.id).length}</span>
                </button>
            </div>
            <div class="comments-section hidden" data-id="${blog.id}">
                ${renderComments(blog.id)}
                <form class="comment-form" data-id="${blog.id}">
                    <input type="text" placeholder="Add a comment..." required>
                    <button type="submit">Post</button>
                </form>
            </div>
        </div>
    </div>`;
}

function renderComments(blogId) {
    const comments = getComments(blogId);
    
    if (comments.length === 0) {
        return '<p class="no-comments">No comments yet. Be the first!</p>';
    }
    
    return `
    <div class="comments-list">
        ${comments.map(comment => `
            <div class="comment">
                <p class="comment-text">${comment.text}</p>
                <small class="comment-date">${comment.date}</small>
            </div>
        `).join('')}
    </div>`;
}

function displayAllBlogs() {
    const blogsContainer = document.querySelector('.blogs');
    if (!blogsContainer) return;

    const allBlogs = getSavedBlogs();
    const featuredBlog = allBlogs.find(blog => blog.isFeatured);
    const regularBlogs = allBlogs.filter(blog => !blog.isFeatured);

    let html = '';

    if (featuredBlog) {
        html += renderBlogCard(featuredBlog);
    }

    regularBlogs.forEach(blog => {
        html += renderBlogCard(blog);
    });

    blogsContainer.innerHTML = html;
    setupEventListeners();
}

// Event Handlers
function setupReadToggleButtons() {
    document.querySelectorAll('.read-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('[data-id]');
            const content = card.querySelector('.blog-content');
            const blogId = parseInt(card.getAttribute('data-id'));
            const blog = getSavedBlogs().find(b => b.id === blogId);
            const arrowIcon = this.querySelector('.arrow-icon');

            if (!blog) return;

            if (this.textContent.includes('More') || this.textContent.includes('Show')) {
                content.innerHTML = blog.content.replace(/\n/g, '<br>');
                this.innerHTML = 'Read Less <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                arrowIcon.style.transform = 'rotate(180deg)';
            } else {
                const displayContent = blog.content.length > MAX_CONTENT_LENGTH
                    ? blog.content.substring(0, MAX_CONTENT_LENGTH) + '...'
                    : blog.content;
                content.innerHTML = displayContent.replace(/\n/g, '<br>');
                this.innerHTML = `${blog.content.length > MAX_CONTENT_LENGTH ? 'Read More' : 'Show Full'} <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
                arrowIcon.style.transform = 'rotate(0deg)';
            }

            card.classList.add('animate-card');
            setTimeout(() => card.classList.remove('animate-card'), 300);
        });
    });
}

function setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const blogId = this.getAttribute('data-id');
            const newCount = toggleLike(blogId);
            
            const heart = this.querySelector('.heart-icon');
            heart.classList.add('animate-heart');
            setTimeout(() => heart.classList.remove('animate-heart'), 1000);
            
            this.querySelector('.like-count').textContent = newCount;
        });
    });
}

function setupCommentSections() {
    document.querySelectorAll('.comment-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const blogId = this.closest('[data-id]').getAttribute('data-id');
            const commentsSection = document.querySelector(`.comments-section[data-id="${blogId}"]`);
            commentsSection.classList.toggle('hidden');
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-comment');
            icon.classList.toggle('fa-comment-dots');
        });
    });

    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const blogId = this.getAttribute('data-id');
            const input = this.querySelector('input');
            const commentText = input.value.trim();
            
            if (commentText) {
                addComment(blogId, commentText);
                input.value = '';
                
                const commentsSection = this.closest('.comments-section');
                commentsSection.innerHTML = `
                    ${renderComments(blogId)}
                    <form class="comment-form" data-id="${blogId}">
                        <input type="text" placeholder="Add a comment..." required>
                        <button type="submit">Post</button>
                    </form>
                `;
                
                // Update comment count in the toggle button
                const commentToggle = document.querySelector(`.comment-toggle[data-id="${blogId}"]`);
                if (commentToggle) {
                    commentToggle.querySelector('.comment-count').textContent = getComments(blogId).length;
                }
                
                setupCommentSections();
            }
        });
    });
}

function setupBlogForm() {
    const form = document.getElementById('add-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const title = form.elements['title'].value.trim();
            const content = form.elements['blog'].value.trim();
            const category = form.elements['category']?.value || "New Post";

            if (title && content) {
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner"></span> Publishing...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    saveNewBlog(title, content, category);
                    displayAllBlogs();
                    form.reset();
                    
                    showSuccessMessage('✓ Blog published successfully!');
                    
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }
}

function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = message;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.opacity = '1';
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => successMsg.remove(), 500);
        }, 2000);
    }, 10);
}

function setupEventListeners() {
    setupReadToggleButtons();
    setupLikeButtons();
    setupCommentSections();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    displayAllBlogs();
    setupBlogForm();
});