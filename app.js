constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.token = localStorage.getItem('token');
        this.initialize();
    }

    async initialize() {
        await this.loadDashboard();
        this.setupEventListeners();
        this.initializeChart();
    }

    async loadDashboard() {
        try {
            const [stats, posts, messages] = await Promise.all([
                this.fetchData('/analytics/stats'),
                this.fetchData('/instagram/posts'),
                this.fetchData('/instagram/messages')
            ]);

            this.updateStats(stats);
            this.renderPosts(posts);
            this.renderMessages(messages);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBase}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    updateStats(stats) {
        // Update stat cards with real data
        document.querySelector('.stat-value').textContent = stats.followers;
        // Add more stat updates here
    }

    renderPosts(posts) {
        const postsList = document.getElementById('postsList');
        postsList.innerHTML = posts.map(post => `
            <div class="post-item">
                <div class="post-header">
                    <span class="post-id">Post ${post.id}</span>
                    <span class="post-date">${new Date(post.posted_at).toLocaleDateString()}</span>
                </div>
                <p class="post-caption">${post.caption || 'No caption'}</p>
                <div class="post-metrics">
                    <span>❤️ ${post.likes_count} likes</span>
                    <span>💬 ${post.comments_count} comments</span>
                </div>
            </div>
        `).join('');
    }

    renderMessages(messages) {
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = messages.map(message => `
            <div class="message-item">
                <img src="https://via.placeholder.com/40" alt="${message.username}" class="message-avatar">
                <div class="message-info">
                    <span class="message-username">${message.username}</span>
                    <p class="message-text">${message.message_text}</p>
                </div>
                <span class="message-time">${new Date(message.sent_at).toLocaleTimeString()}</span>
                ${!message.is_read ? '<span class="unread-badge">!</span>' : ''}
            </div>
        `).join('');
    }

    initializeChart() {
        const ctx = document.getElementById('growthChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Followers',
                    data: [120, 190, 310, 250, 280, 320, 400],
                    borderColor: '#405DE6',
                    backgroundColor: 'rgba(64, 93, 230, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Engagement',
                    data: [80, 120, 150, 140, 180, 200, 250],
                    borderColor: '#C13584',
                    backgroundColor: 'rgba(193, 53, 132, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Post modal
        const postModal = document.getElementById('postModal');
        const newPostBtn = document.querySelector('.btn-primary');
        const closeBtn = document.querySelector('.close-btn');

        newPostBtn.addEventListener('click', () => {
            postModal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            postModal.classList.remove('active');
        });

        // Post form submission
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const postData = {
                caption: document.getElementById('postCaption').value,
                image: document.getElementById('postImage').value,
                schedule: document.getElementById('postSchedule').value
            };

            await this.createPost(postData);
            postModal.classList.remove('active');
            await this.loadDashboard();
        });

        // Time selector for analytics
        document.querySelector('.time-selector').addEventListener('change', async (e) => {
            await this.updateAnalytics(e.target.value);
        });
    }

    async createPost(postData) {
        try {
            const response = await fetch(`${this.apiBase}/instagram/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            this.showNotification('Post created successfully!', 'success');
        } catch (error) {
            console.error('Error creating post:', error);
            this.showNotification('Failed to create post', 'error');
        }
    }

    async updateAnalytics(timeframe) {
        try {
            const data = await this.fetchData(`/analytics?timeframe=${timeframe}`);
            // Update chart with new data
            this.updateChart(data);
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }

    updateChart(data) {
        // Chart update logic
        console.log('Updating chart with:', data);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new InstagramCRM();
});

javascript