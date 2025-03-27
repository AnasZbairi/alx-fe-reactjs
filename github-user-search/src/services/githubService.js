import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  },
  timeout: 8000
});

/**
 * Search GitHub users using the exact required endpoint format
 * @param {string} query - Search query string
 * @param {number} [page=1] - Page number
 * @param {number} [perPage=10] - Results per page
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async (query, page = 1, perPage = 10) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Valid search query is required');
  }

  try {
    // Explicitly construct the exact required endpoint URL
    const searchUrl = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    
    const { data } = await axios.get(searchUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return {
      items: data.items,
      total_count: data.total_count,
      page,
      perPage
    };
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('API rate limit exceeded. Try again later.');
    }
    throw new Error(error.message || 'Failed to search users');
  }
};

/**
 * Get user details
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User data
 */
export const fetchUserData = async (username) => {
  try {
    const { data } = await api.get(`/users/${username}`);
    return {
      id: data.id,
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      bio: data.bio,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found on GitHub');
    }
    throw new Error('Failed to fetch user data');
  }
};

/**
 * Check GitHub API rate limits
 * @returns {Promise<Object>} Rate limit info
 */
export const checkRateLimit = async () => {
  try {
    const { data } = await api.get('/rate_limit');
    return {
      limit: data.resources.core.limit,
      remaining: data.resources.core.remaining,
      reset: new Date(data.resources.core.reset * 1000)
    };
  } catch (error) {
    throw new Error('Failed to check rate limit');
  }
};
