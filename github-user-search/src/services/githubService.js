import axios from 'axios';

// 1. Hardcoded URL exactly as required
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Search GitHub users - NOW WITH EXACT REQUIRED FORMAT
 */
export const searchUsers = async ({
  username = '',
  location = '',
  minRepos = 0,
  page = 1,
  perPage = 10
} = {}) => {
  try {
    // 2. Build query with EXACT required format
    let query = '';
    if (username) query += `${username} in:login`;
    if (location) query += ` location:${location}`;
    if (minRepos > 0) query += ` repos:>${minRepos}`;
    
    // 3. THE CRITICAL FIX - Exact endpoint format with encoded query
    const searchUrl = `${GITHUB_API_URL}/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return {
      items: data.items,
      total_count: data.total_count,
      minRepos, // Explicitly included
      page,
      perPage
    };
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('API rate limit exceeded');
    }
    throw new Error(error.message || 'Search failed');
  }
};

// Keep your existing fetchUserData function
export const fetchUserData = async (username) => {
  /* ... existing implementation ... */
};
