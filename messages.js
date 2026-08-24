constructor() {
        this.messages = [];
        this.unreadCount = 0;
        this.initialize();
    }

    async initialize() {
        await this.loadMessages();
        this.setupEventListeners();
    }

    async loadMessages() {
        try {
            const response = await fetch('/api/instagram/messages', {
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load messages');
            }

            this.messages = await response.json();
            this.unreadCount = this.messages.filter(m => !m.is_read).length;
            this.renderMessages();
            this.updateUnreadBadge();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = this.messages.map(message => `
            <div class="message-card ${!message.is_read ? 'unread' : ''}">
                <div class="message-header">
                    <img src="https://via.placeholder.com/50" alt="${message.username}" class="message-avatar">
                    <div class="message-user">
                        <h4>${message.username}</h4>
                        <span class="message-time">${this.formatTime(message.sent_at)}</span>
                    </div>
                    ${!message.is_read ? '<span class="unread-dot"></span>' : ''}
                </div>
                <div class="message-body">
                    <p>${message.message_text}</p>
                </div>
                <div class="message-actions">
                    <button class="reply-btn" onclick="messageManager.replyToMessage('${message.instagram_user_id}')">
                        💬 Reply
                    </button>
                    <button class="archive-btn" onclick="messageManager.archiveMessage(${message.id})">
                        📁 Archive
                    </button>
                </div>
            </div>
        `).join('');
    }

    async replyToMessage(userId) {
        const replyModal = document.getElementById('replyModal');
        replyModal.classList.add('active');
        replyModal.dataset.userId = userId;
    }

    async sendReply() {
        const replyText = document.getElementById('replyText').value;
        const userId = document.getElementById('replyModal').dataset.userId;

        try {
            const response = await fetch('/api/instagram/messages/reply', {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({
                    user_id: userId,
                    message: replyText
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send reply');
            }

            document.getElementById('replyModal').classList.remove('active');
            document.getElementById('replyText').value = '';
            await this.loadMessages();
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    }

    async archiveMessage(messageId) {
        try {
            const response = await fetch(`/api/instagram/messages/${messageId}/archive`, {
                method: 'POST',
                headers: authManager.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to archive message');
            }

            await this.loadMessages();
        } catch (error) {
            console.error('Error archiving message:', error);
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 3600000) {
            return `${Math.floor(diff / 60000)} minutes ago`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)} hours ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    updateUnreadBadge() {
        const badge = document.getElementById('unreadBadge');
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    setupEventListeners() {
        document.getElementById('sendReplyBtn').addEventListener('click', () => {
            this.sendReply();
        });

        document.getElementById('refreshMessages').addEventListener('click', () => {
            this.loadMessages();
        });
    }
}

const messageManager = new MessageManager();

javascript