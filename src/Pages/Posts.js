import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Helmet } from 'react-helmet';

const API = "https://mancuso.ai/wp-json/wp/v2/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <>
      <Helmet>
        <title>Blog Posts</title>
        <meta name="description" content="Read the latest blog posts." />
      </Helmet>
      <div className='main_Content'>
        <section className={`portfolio_section section_padding py-5 bg-white`}>
          <h2 className='section-title text-start portfolio-title pt-4'>Blog Posts</h2>
          {loading ? (
            <div className="loading">
              <ClipLoader loading={loading} size={50} />
            </div>
          ) : error ? (
            <p>Error fetching posts: {error}</p>
          ) : (
            <ul>
              {posts.map(post => (
                <div key={post.id}>
                  <h1 className='single-post-title'>{post.title.rendered}</h1>
                  <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                </div>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default Posts;
