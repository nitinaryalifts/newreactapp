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
    const [metaData, setMetaData] = useState({
        metaTitle: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        canonicalURL: "",
        ogType: "",
        ogImage: "",
        ogURL: "",
        robotsContent: "",
    });

    const API = "https://mancuso.ai/wp-json/wp/v2/posts";

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API);
                const postsData = response.data;

                const authors = await Promise.all(
                    postsData.map(post =>
                        axios.get(`https://mancuso.ai/wp-json/wp/v2/users/${post.author}`)
                    )
                );

                const categories = await Promise.all(
                    postsData.map(post =>
                        Promise.all(post.categories.map(categoryId =>
                            axios.get(`https://mancuso.ai/wp-json/wp/v2/categories/${categoryId}`)
                        ))
                    )
                );

                const updatedPosts = postsData.map((post, index) => ({
                    ...post,
                    authorName: authors[index]?.data?.name || "Unknown Author",
                    categories: categories[index]?.map(cat => cat.data.name).join(', ') || "Uncategorized",
                    comment_count: post.comment_count || 0,
                }));

                setPosts(updatedPosts);

                const firstPost = updatedPosts[0];
                if (firstPost) {
                    const yoastData = firstPost.yoast_head_json;
                    setMetaData({
                        metaTitle: yoastData.title,
                        metaDescription: yoastData.og_description,
                        ogTitle: yoastData.og_title,
                        ogDescription: yoastData.og_description,
                        canonicalURL: yoastData.canonical,
                        ogType: yoastData.og_type,
                        ogURL: yoastData.og_url,
                        ogImage: yoastData.og_image && yoastData.og_image.length > 0 ? yoastData.og_image[0].url : '',
                        robotsContent: yoastData.robots ? yoastData.robots.index ? 'index' : 'noindex' : 'index',
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <PostsContext.Provider value={{ posts, loading, error, metaData }}>
            {children}
        </PostsContext.Provider>
    );
};
