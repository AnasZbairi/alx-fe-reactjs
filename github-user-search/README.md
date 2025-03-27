# GitHub User Search Application

A React application that allows users to search for GitHub profiles using the GitHub API.

## Features
- Basic search by username
- Advanced search by location and minimum repositories
- Responsive UI with Tailwind CSS
- Display user details including avatar, bio, and stats

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

### 2. `src/services/githubService.js` (updated)
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_GITHUB_API_URL;

/**
 * Fetches data for a specific GitHub user
 * @param {string} username - GitHub username to search for
 * @returns {Promise<Object>} User data object
 * @throws {Error} If user is not found or API request fails
 */
export const fetchUserData = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch user data');
  }
};

/**
 * Searches GitHub users based on query parameters
 * @param {string} query - Search query (e.g., "user:john location:newyork repos:>10")
 * @returns {Promise<Object>} Search results object
 * @throws {Error} If search fails
 */
export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search/users?q=${query}&per_page=10`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to search users');
  }
};

/**
 * Fetches detailed information for multiple users
 * @param {Array<string>} usernames - Array of GitHub usernames
 * @returns {Promise<Array<Object>>} Array of user data objects
 */
export const fetchMultipleUsers = async (usernames) => {
  try {
    const requests = usernames.map(username => 
      axios.get(`${API_URL}/users/${username}`)
        .then(response => response.data)
        .catch(() => null) // Skip failed requests
    );
    return Promise.all(requests);
  } catch (error) {
    throw new Error('Failed to fetch multiple users');
  }
};
