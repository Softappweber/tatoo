constructor() {
        this.followers = [];
        this.following = [];
        this.initialize();
    }

    async initialize() {
        await this.loadFollowers();
        this.setupEventListeners();
    }

    async loadFollowers() {
        try {
            const [followers, following] = await Promise.all([
                this.fetchFollowers(),
                this.fetchFollowing()
            ]);

            this.followers = followers;
            this.following = following;
            this.renderFollowers();
            this.updateStats();
        } catch (error) {
            console.error('Error loading followers:', error);
        }
    }

    async fetchFollowers() {
        const response = await fetch('/api/instagram/followers', {
            headers: authManager.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch followers');
        }

        return await response.json();
    }

    async fetchFollowing() {
        const response = await fetch('/api/instagram/following', {
            headers: authManager.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch following');
        }

        return await response.json();
    }

    renderFollowers() {
        const container = document.getElementById('followersList');
        container.innerHTML = this.followers.map(follower => `
            <div class="follower-item">
                <img src="${follower.avatar_url}" alt="${follower.username}" class="follower-avatar">
                <div class="follower-info">
                    <h4>${follower.username}</h4>
                    <span>${follower.full_name}</span>
                </div>
                <div class="follower-actions">
                    <button class="follow-btn" onclick="followerManager.followUser('${follower.username}')">
                        Follow
                    </button>
                </div>
            </div>
        `).join('');
    }

    async followUser(username) {
        try {
            const response = await fetch(`/api/instagram/follow/${username}`, {
                method: 'POST',
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to follow user');
            }

            await this.loadFollowers();
            this.showNotification(`Now following ${username}`, 'success');
        } catch (error) {
            console.error('Error following user:', error);
            this.showNotification('Failed to follow user', 'error');
        }
    }

    updateStats() {
        document.getElementById('followersCount').textContent = this.followers.length;
        document.getElementById('followingCount').textContent = this.following.length;
        
        const notFollowingBack = this.following.filter(user => 
            !this.followers.some(follower => follower.username === user.username)
        );
        
        document.getElementById('notFollowingBack').textContent = notFollowingBack.length;
    }

    showNotification(message, type) {
        console.log(`${type}: ${message}`);
    }

    setupEventListeners() {
        document.getElementById('refreshFollowers').addEventListener('click', () => {
            this.loadFollowers();
        });

        document.getElementById('searchFollowers').addEventListener('input', (e) => {
            this.filterFollowers(e.target.value);
        });
    }

    filterFollowers(searchTerm) {
        const filtered = this.followers.filter(follower => 
            follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            follower.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderFilteredFollowers(filtered);
    }

    renderFilteredFollowers(followers) {
        const container = document.getElementById('followersList');
        container.innerHTML = followers.map(follower => `
            <div class="follower-item">
                <img src="${follower.avatar_url}" alt="${follower.username}" class="follower-avatar">
                <div class="follower-info">
                    <h4>${follower.username}</h4>
                    <span>${follower.full_name}</span>
                </div>
                <div class="follower-actions">
                    <button class="follow-btn">Follow</button>
                </div>
            </div>
        `).join('');
    }
}

const followerManager = new FollowerManager();

javascript