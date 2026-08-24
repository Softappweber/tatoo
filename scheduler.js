constructor() {
        this.scheduledPosts = [];
        this.interval = null;
        this.initialize();
    }

    async initialize() {
        await this.loadScheduledPosts();
        this.startScheduler();
        this.setupEventListeners();
    }

    async loadScheduledPosts() {
        try {
            const response = await fetch('/api/instagram/scheduled-posts', {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load scheduled posts');
            }

            this.scheduledPosts = await response.json();
            this.renderScheduledPosts();
        } catch (error) {
            console.error('Error loading scheduled posts:', error);
        }
    }

    startScheduler() {
        // Check every minute for posts to publish
        this.interval = setInterval(() => {
            this.checkForDuePosts();
        }, 60000);
    }

    async checkForDuePosts() {
        const now = new Date();
        
        for (const post of this.scheduledPosts) {
            const scheduledTime = new Date(post.scheduled_time);
            
            if (scheduledTime <= now && post.status === 'scheduled') {
                await this.publishPost(post);
            }
        }
    }

    async publishPost(post) {
        try {
            const response = await fetch('/api/instagram/posts/publish', {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({
                    post_id: post.id,
                    caption: post.caption,
                    image: post.image_url
                })
            });

            if (!response.ok) {
                throw new Error('Failed to publish post');
            }

            post.status = 'published';
            this.renderScheduledPosts();
            this.showNotification('Post published successfully!', 'success');
        } catch (error) {
            console.error('Error publishing post:', error);
            post.status = 'failed';
            this.renderScheduledPosts();
            this.showNotification('Failed to publish post', 'error');
        }
    }

    renderScheduledPosts() {
        const container = document.getElementById('scheduledPosts');
        container.innerHTML = this.scheduledPosts.map(post => `
            <div class="scheduled-post-item">
                <div class="post-preview">
                    <img src="${post.image_url}" alt="Post image">
                </div>
                <div class="post-details">
                    <p class="post-caption">${post.caption}</p>
                    <div class="post-meta">
                        <span>Scheduled for: ${new Date(post.scheduled_time).toLocaleString()}</span>
                        <span class="status-badge status-${post.status}">${post.status}</span>
                    </div>
                </div>
                <div class="post-actions">
                    <button onclick="postScheduler.cancelPost(${post.id})">Cancel</button>
                    <button onclick="postScheduler.editPost(${post.id})">Edit</button>
                </div>
            </div>
        `).join('');
    }

    async cancelPost(postId) {
        try {
            const response = await fetch(`/api/instagram/scheduled-posts/${postId}`, {
                method: 'DELETE',
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to cancel post');
            }

            await this.loadScheduledPosts();
            this.showNotification('Post cancelled', 'info');
        } catch (error) {
            console.error('Error cancelling post:', error);
        }
    }

    showNotification(message, type) {
        // Notification implementation
        console.log(`${type}: ${message}`);
    }

    setupEventListeners() {
        document.getElementById('schedulePostBtn').addEventListener('click', () => {
            document.getElementById('scheduleModal').classList.add('active');
        });
    }
}

const postScheduler = new PostScheduler();

javascript