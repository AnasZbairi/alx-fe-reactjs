import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

// Function to fetch posts from the API
const fetchPosts = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data;
};

const PostsComponent = () => {
  // Use React Query to fetch data with additional options
  const { data, isLoading, isError, error, refetch } = useQuery('posts', fetchPosts, {
    cacheTime: 60000, // Cache data for 1 minute
    refetchOnWindowFocus: true, // Refetch data when the window regains focus
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 10000, // Data is considered fresh for 10 seconds
  });

  // Loading state
  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  // Error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Posts</h2>
      <button onClick={refetch}>Refresh Posts</button>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsComponent;
