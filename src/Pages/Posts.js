import React, { useEffect, useState } from "react";
import { usePosts } from "../Context/PostsContext";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Posts = () => {
    const { posts, loading, error, metaData } = usePosts();
    const [animationClass, setAnimationClass] = useState("");

    useEffect(() => {
        if (!loading) {
            let timeout = setTimeout(() => setAnimationClass("slide-enter"), 0);
            return () => clearTimeout(timeout);
        }
    }, [loading]);

    return (
        <>
            <Helmet>
                <title>Blogs - Michael Mancuso</title>
            </Helmet>
            <div className="main_Content">
                <section className={`portfolio_section section_padding py-5 bg-white animate_section ${animationClass}`}>
                    <h2 className="section-title text-start portfolio-title pt-4">Blogs</h2>
                    {loading ? (
                        <div className="loading">
                            <ClipLoader loading={loading} size={50} />
                        </div>
                    ) : error ? (
                        <p>Error fetching posts: {error}</p>
                    ) : (
                        <div className="blogs_flex">
                            <div className="container me-3 my-3">
                                <div className="row single-post-content">
                                    {posts.map((post) => (
                                        <div className="col-md-4" key={post.id}>
                                            <div className="border p-3">
                                                {post.featured_media && (
                                                    <img 
                                                        src={post.yoast_head_json.og_image[0].url} 
                                                        alt={post.title.rendered} 
                                                        className="img-fluid mb-3" 
                                                    />
                                                )}
                                                <h1 className="post-title">{post.title.rendered}</h1>
                                                <div className="d-flex justify-content-between">
                                                <p>Author: {post.authorName}</p>
                                                <p>Date: {new Date(post.date).toLocaleDateString()}</p>
                                                </div>
                                                {/* <p>Categories: {post.categories}</p> */}
                                                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                                                {/* <p>Comments: {post.comment_count}</p> */}
                                                <span className="read_btn">
                                                    <Link to={`/posts/${post.id}`} state={{ post }}>
                                                        Read more
                                                    </Link>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Posts;
