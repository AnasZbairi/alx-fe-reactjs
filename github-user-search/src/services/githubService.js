import axios from 'axios';

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com';

// Create axios instance with GitHub API configuration
const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': '' // Add token here if needed for higher rate limits
  },
  timeout: 8000 // 8 seconds timeout
});

/**
 * Fetches detailed data for a specific GitHub user
 * @param {string} username - GitHub username to lookup
 * @returns {Promise<Object>} User data object
 * @throws {Error} With descriptive message if request fails
 */
export const fetchUserData = async (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Valid username is required');
  }

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
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error('User not found on GitHub');
        case 403:
          throw new Error('API rate limit exceeded. Try again later.');
        case 401:
          throw new Error('Authentication failed');
        default:
          throw new Error(`GitHub API error: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error('Network error - failed to reach GitHub API');
    } else {
      throw new Error('Request setup error');
    }
  }
};

/**
 * Searches GitHub users with advanced filters
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Username search string
 * @param {string} [params.location] - Location filter
 * @param {number} [params.minRepos] - Minimum repositories
 * @param {number} [params.page=1] - Pagination page
 * @param {number} [params.perPage=10] - Results per page
 * @returns {Promise<Object>} { items: Array, total_count: Number }
 * @throws {Error} If search fails
 */
export const searchUsers = async ({
  query = '',
  location = '',
  minRepos = 0,
  page = 1,
  perPage = 10
} = {}) => {
  try {
    // Build GitHub search query syntax
    let q = '';
    if (query) q += `${query} in:login`;
    if (location) q += ` location:${location}`;
    if (minRepos > 0) q += ` repos:>${minRepos}`;
    
    if (!q.trim()) {
      throw new Error('At least one search parameter is required');
    }

    const { data } = await api.get('/search/users', {
      params: {
        q,
        page,
        per_page: perPage,
        sort: 'joined',
        order: 'desc'
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
 * Gets GitHub API rate limit status
 * @returns {Promise<Object>} Rate limit information
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
