// PostsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PostsContext = createContext();

export const usePosts = () => {
  return useContext(PostsContext);
};

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "https://mancuso.ai/wp-json/wp/v2/posts";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API);
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, loading, error }}>
      {children}
    </PostsContext.Provider>
  );
};
