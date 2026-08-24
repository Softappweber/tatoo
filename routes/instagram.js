const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const instagramService = require('../services/instagramService');
const database = require('../database');

// Get Instagram account info
router.get('/account', authMiddleware, async (req, res) => {
    try {
        const account = await database.query(
            'SELECT * FROM instagram_accounts WHERE user_id = ?',
            [req.userId]
        );

        if (account.length === 0) {
            return res.status(404).json({ error: 'No Instagram account connected' });
        }

        res.json(account[0]);
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: 'Failed to fetch account' });
    }
});

// Connect Instagram account
router.post('/connect', authMiddleware, async (req, res) => {
    try {
        const { access_token, instagram_username } = req.body;

        // Verify token with Instagram API
        const accountInfo = await instagramService.getAccountInfo(access_token);

        await database.query(`
            INSERT INTO instagram_accounts 
            (user_id, instagram_username, instagram_user_id, access_token)
            VALUES (?, ?, ?, ?)
        `, [req.userId, instagram_username, accountInfo.id, access_token]);

        res.json({ success: true, message: 'Instagram account connected' });
    } catch (error) {
        console.error('Error connecting Instagram:', error);
        res.status(500).json({ error: 'Failed to connect Instagram account' });
    }
});

// Get posts
router.get('/posts', authMiddleware, async (req, res) => {
    try {
        const { limit = 25 } = req.query;
        const posts = await database.query(`
            SELECT * FROM posts 
            WHERE account_id IN (
                SELECT id FROM instagram_accounts WHERE user_id = ?
            )
            ORDER BY posted_at DESC
            LIMIT ?
        `, [req.userId, limit]);

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create new post
router.post('/posts', authMiddleware, async (req, res) => {
    try {
        const { caption, image, schedule } = req.body;

        await database.query(`
            INSERT INTO posts (account_id, caption, media_url, posted_at)
            VALUES (?, ?, ?, ?)
        `, [req.userId, caption, image, schedule || new Date()]);

        res.json({ success: true, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get messages
router.get('/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await database.query(`
            SELECT * FROM messages 
            WHERE account_id IN (
                SELECT id FROM instagram_accounts WHERE user_id = ?
            )
            ORDER BY sent_at DESC
        `, [req.userId]);

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;

javascript