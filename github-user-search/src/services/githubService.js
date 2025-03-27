import axios from 'axios';

// Base URL for GitHub API from environment variables
const API_URL = import.meta.env.VITE_APP_GITHUB_API_URL;

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  },
  timeout: 10000 // 10 seconds timeout
});

/**
 * Fetches detailed data for a specific GitHub user
 * @param {string} username - GitHub username to lookup
 * @returns {Promise<Object>} User data object
 * @throws {Error} With descriptive message if request fails
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
    if (error.response) {
      // Handle GitHub API error responses
      if (error.response.status === 404) {
        throw new Error('User not found on GitHub');
      }
      if (error.response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to fetch user data. Please check your connection.');
  }
};

/**
 * Searches GitHub users based on multiple criteria
 * @param {Object} params - Search parameters
 * @param {string} [params.username] - Username to search
 * @param {string} [params.location] - Location filter
 * @param {number} [params.minRepos] - Minimum repositories
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.perPage=10] - Results per page
 * @returns {Promise<Object>} { items: Array, total_count: Number }
 * @throws {Error} If search fails
 */
export const searchUsers = async ({ 
  username = '', 
  location = '', 
  minRepos = 0, 
  page = 1, 
  perPage = 10 
} = {}) => {
  try {
    // Build query string from parameters
    let query = '';
    if (username) query += `user:${username}`;
    if (location) query += ` location:${location}`;
    if (minRepos > 0) query += ` repos:>${minRepos}`;
    
    if (!query.trim()) {
      throw new Error('At least one search parameter is required');
    }

    const { data } = await api.get('/search/users', {
      params: {
        q: query,
        page,
        per_page: perPage
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
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error(error.message || 'Failed to search users');
  }
};

/**
 * Fetches detailed data for multiple GitHub users in parallel
 * @param {Array<string>} usernames - Array of GitHub usernames
 * @returns {Promise<Array<Object>>} Array of user objects
 */
export const fetchMultipleUsers = async (usernames) => {
  try {
    const requests = usernames.map(username => 
      fetchUserData(username).catch(() => null) // Skip failed requests
    );
    const results = await Promise.all(requests);
    return results.filter(user => user !== null); // Filter out failed requests
  } catch (error) {
    throw new Error('Failed to fetch multiple users: ' + error.message);
  }
};

/**
 * Gets GitHub API rate limit status
 * @returns {Promise<Object>} Rate limit information
 */
export const getRateLimit = async () => {
  try {
    const { data } = await api.get('/rate_limit');
    return data.resources.core;
  } catch (error) {
    throw new Error('Failed to get rate limit info');
  }
};
