// Posts.js
import React from "react";
import { usePosts } from "../Context/PostsContext";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Posts = () => {
    const { posts, loading, error, metaData } = usePosts();

    return (
        <>
            <Helmet>
                <title>Blogs</title>
            </Helmet>
            <div className="main_Content">
                <section className={`portfolio_section section_padding py-5 bg-white`}>
                    <h2 className="section-title text-start portfolio-title pt-4">Blog Posts</h2>
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
                                                <h1 className="post-title pt-3">{post.title.rendered}</h1>
                                                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
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
