constructor(database) {
    this.db = database;
  }

  calculateEngagementRate(followers, likes, comments) {
    if (followers === 0) return 0;
    return ((likes + comments) / followers) * 100;
  }

  async getAccountAnalytics(accountId, timeframe = '30d') {
    const query = `
      SELECT 
        a.date,
        a.followers_gained,
        a.followers_lost,
        a.impressions,
        a.reach,
        a.profile_views,
        (a.followers_gained - a.followers_lost) as net_growth
      FROM analytics a
      WHERE a.account_id = ?
        AND a.date >= datetime('now', '-${timeframe}')
      ORDER BY a.date DESC
    `;
    
    return await this.db.query(query, [accountId]);
  }

  async getTopPosts(accountId, limit = 10) {
    const query = `
      SELECT 
        p.instagram_post_id,
        p.caption,
        p.likes_count,
        p.comments_count,
        (p.likes_count + p.comments_count) as total_engagement,
        p.posted_at
      FROM posts p
      WHERE p.account_id = ?
      ORDER BY total_engagement DESC
      LIMIT ?
    `;
    
    return await this.db.query(query, [accountId, limit]);
  }

  async getGrowthMetrics(accountId) {
    const query = `
      SELECT 
        SUM(followers_gained) as total_gained,
        SUM(followers_lost) as total_lost,
        SUM(impressions) as total_impressions,
        SUM(reach) as total_reach,
        AVG(engagement_rate) as avg_engagement_rate
      FROM analytics
      WHERE account_id = ?
    `;
    
    return await this.db.query(query, [accountId]);
  }
}

module.exports = AnalyticsService;

html