import axios from 'axios';

// Using Vite's environment variable prefix
const API_BASE_URL = import.meta.env.VITE_GITHUB_API_URL || 'https://api.github.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  },
  timeout: 10000
});

export const searchUsers = async ({ 
  username = '', 
  location = '', 
  minRepos = 0, 
  page = 1, 
  perPage = 10 
} = {}) => {
  try {
    // Build GitHub search query
    let queryParts = [];
    if (username) queryParts.push(`${username} in:login`);
    if (location) queryParts.push(`location:${location}`);
    if (minRepos > 0) queryParts.push(`repos:>${minRepos}`);
    
    if (queryParts.length === 0) {
      throw new Error('At least one search parameter is required');
    }

    const query = queryParts.join(' ');
    const searchUrl = `${API_BASE_URL}/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const { data } = await api.get(searchUrl);
    
    return {
      items: data.items,
      total_count: data.total_count,
      page,
      perPage,
      minRepos
    };
  } catch (error) {
    handleApiError(error);
  }
};

// Add other functions (fetchUserData, checkRateLimit) here...

function handleApiError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        throw new Error('Authentication failed');
      case 403:
        throw new Error('API rate limit exceeded');
      case 404:
        throw new Error('Resource not found');
      default:
        throw new Error(`GitHub API error: ${error.response.status}`);
    }
  } else if (error.request) {
    throw new Error('No response received from server');
  } else {
    throw new Error('Request setup error');
  }
}
