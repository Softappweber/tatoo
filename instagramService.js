class InstagramService {
  constructor() {
    this.baseURL = 'https://graph.instagram.com/v12.0';
  }

  async getAccountInfo(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/me`, {
        params: {
          fields: 'id,username,account_type,media_count',
          access_token: accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram account:', error);
      throw error;
    }
  }

  async getPosts(accessToken, limit = 25) {
    try {
      const response = await axios.get(`${this.baseURL}/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          limit,
          access_token: accessToken
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getComments(mediaId, accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/${mediaId}/comments`, {
        params: {
          fields: 'id,username,text,timestamp',
          access_token: accessToken
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async getInsights(mediaId, accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/${mediaId}/insights`, {
        params: {
          metric: 'engagement,impressions,reach,saved',
          access_token: accessToken
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }
}

module.exports = new InstagramService();

javascript