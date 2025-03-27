import { useState } from 'react';
import { fetchUserData, searchUsers } from '../services/githubService';

export default function Search() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [minRepos, setMinRepos] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('basic');

  const handleBasicSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserData(username);
      setUser(data);
      setUsers([]);
    } catch (err) {
      setError('Looks like we cant find the user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let query = username ? `user:${username}` : '';
      if (location) query += ` location:${location}`;
      if (minRepos) query += ` repos:>${minRepos}`;
      
      const data = await searchUsers(query);
      setUsers(data.items);
      setUser(null);
    } catch (err) {
      setError('Error searching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex mb-4">
        <button
          onClick={() => setSearchType('basic')}
          className={`px-4 py-2 ${searchType === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Basic Search
        </button>
        <button
          onClick={() => setSearchType('advanced')}
          className={`px-4 py-2 ${searchType === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Advanced Search
        </button>
      </div>

      {searchType === 'basic' ? (
        <form onSubmit={handleBasicSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="flex-1 p-2 border border-gray-300 rounded-l"
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdvancedSearch} className="mb-6 space-y-4">
          <div>
            <label className="block mb-1">Username (optional)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="GitHub username"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Minimum Repositories (optional)</label>
            <input
              type="number"
              value={minRepos}
              onChange={(e) => setMinRepos(e.target.value)}
              placeholder="e.g., 10"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Advanced Search
          </button>
        </form>
      )}

      {loading && <p className="text-center py-4">Loading...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {user && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar_url} 
              alt={user.login} 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {user.name || user.login}
                </a>
              </h2>
              {user.bio && <p className="text-gray-600">{user.bio}</p>}
              {user.location && <p className="text-gray-600">📍 {user.location}</p>}
              <div className="flex space-x-4 mt-2">
                <span className="text-gray-600">Repos: {user.public_repos}</span>
                <span className="text-gray-600">Followers: {user.followers}</span>
                <span className="text-gray-600">Following: {user.following}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results ({users.length})</h3>
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded shadow flex items-center space-x-4">
              <img 
                src={user.avatar_url} 
                alt={user.login} 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium">
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {user.login}
                  </a>
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
