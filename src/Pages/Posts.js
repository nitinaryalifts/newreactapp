// Posts.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePosts } from "../Context/PostsContext";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useBeforeUnload, useLocation } from "react-router-dom";


const Posts = () => {
    const { posts, loading, error, metaData } = usePosts();
    const [animationClass, setAnimationClass] = useState("");

    useEffect(() => {
        if (!loading) {
          // Apply slide-in animation once loading is complete
          let timeout = setTimeout(() => setAnimationClass("slide-enter"), 0);
          return () => clearTimeout(timeout);
        }
      }, [loading]);
    
      useBeforeUnload(() => {
        let timeout = setTimeout(() => setAnimationClass("slide-exit"), 100);
        return () => clearTimeout(timeout);
      });

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