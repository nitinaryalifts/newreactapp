// SinglePost.js
import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

const SinglePost = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const navigate = useNavigate();

  if (!post) {
    return <p>Post not found.</p>;
  }

  const handleClose = () => {
    navigate('/Posts/');
};

  return (
    <>
      <Helmet>
        <title>{post.title.rendered}</title>
        <meta name="description" content={post.excerpt.rendered} />
      </Helmet>
      <div className="main_Content">
        <section className={`portfolio_section section_padding py-5 bg-white`}>
        <div className='d-flex justify-content-end w-100 position-relative'>
              <a href='' onClick={(e) => { e.preventDefault(); handleClose(); }} className='icon-box text-white p-2 m-1'>
                <i className="fa-solid fa-xmark"></i>
              </a>
            </div>
          <h1 className="post-title">{post.title.rendered}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: post.content.rendered,
            }}
          />
        </section>
      </div>
    </>
  );
};

export default SinglePost;
