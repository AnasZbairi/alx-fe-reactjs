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
 * Search GitHub users with advanced filters including minRepos
 * @param {Object} params - Search parameters
 * @param {string} [params.username] - Username to search
 * @param {string} [params.location] - Location filter
 * @param {number} [params.minRepos] - Minimum repositories filter
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.perPage=10] - Results per page
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async ({
  username = '',
  location = '',
  minRepos = 0,
  page = 1,
  perPage = 10
} = {}) => {
  try {
    // Build query components
    let queryParts = [];
    if (username) queryParts.push(`${username} in:login`);
    if (location) queryParts.push(`location:${location}`);
    if (minRepos > 0) queryParts.push(`repos:>${minRepos}`);
    
    if (queryParts.length === 0) {
      throw new Error('At least one search parameter is required');
    }

    const queryString = queryParts.join('+');
    const searchUrl = `/search/users?q=${queryString}&page=${page}&per_page=${perPage}`;

    const { data } = await api.get(searchUrl);

    return {
      items: data.items,
      total_count: data.total_count,
      page,
      perPage,
      minRepos // Include minRepos in the return object if needed
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
      public_repos: data.public_repos, // Includes repository count
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
