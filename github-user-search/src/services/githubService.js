import axios from 'axios';

// Hardcoded GitHub API URL (already correctly placed at top)
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Search GitHub users with ALL required parameters
 * @param {Object} params - Search parameters
 * @param {string} [params.username] - Username search term
 * @param {string} [params.location] - Location filter
 * @param {number} [params.minRepos=0] - Minimum repositories (repos:>N)
 * @param {number} [params.page=1] - Pagination page
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
    // Build the EXACT required query format
    let queryParts = [];
    if (username) queryParts.push(`${username} in:login`);
    if (location) queryParts.push(`location:${location}`);
    if (minRepos > 0) queryParts.push(`repos:>${minRepos}`);

    if (queryParts.length === 0) {
      throw new Error('At least one search parameter is required');
    }

    // Using the hardcoded GITHUB_API_URL constant
    const searchUrl = `${GITHUB_API_URL}/search/users?q=${encodeURIComponent(queryParts.join(' '))}&page=${page}&per_page=${perPage}`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return {
      items: data.items,
      total_count: data.total_count,
      page,
      perPage,
      minRepos // Included in response
    };
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('API rate limit exceeded. Try again later.');
    }
    throw new Error(error.message || 'Failed to search users');
  }
};

/**
 * Get detailed user data
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserData = async (username) => {
  try {
    const { data } = await axios.get(`${GITHUB_API_URL}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return {
      ...data,
      minRepos: data.public_repos // Include repo count
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found on GitHub');
    }
    throw new Error('Failed to fetch user data');
  }
};
