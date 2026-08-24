class InstagramDatabase extends Database {
  constructor() {
    super('instagram_crm.db');
    this.initializeTables();
  }

  initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS instagram_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        instagram_username TEXT NOT NULL,
        instagram_user_id TEXT,
        access_token TEXT,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        engagement_rate REAL DEFAULT 0,
        last_sync DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER,
        instagram_post_id TEXT,
        caption TEXT,
        media_url TEXT,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        posted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES instagram_accounts(id)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        instagram_comment_id TEXT,
        username TEXT,
        text TEXT,
        sentiment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id)
      );

      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER,
        date DATE,
        followers_gained INTEGER DEFAULT 0,
        followers_lost INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        reach INTEGER DEFAULT 0,
        profile_views INTEGER DEFAULT 0,
        FOREIGN KEY (account_id) REFERENCES instagram_accounts(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER,
        instagram_user_id TEXT,
        username TEXT,
        message_text TEXT,
        is_read BOOLEAN DEFAULT 0,
        sent_at DATETIME,
        FOREIGN KEY (account_id) REFERENCES instagram_accounts(id)
      );
    `);
  }
}

module.exports = new InstagramDatabase();

javascript