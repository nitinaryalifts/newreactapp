import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { Helmet } from 'react-helmet';

const Single = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    if (post) {
      setMetaTitle(post.title);
      
      const pfDescription = post.post_meta?.fw_options?.portfolio_type?.standard?.pf_description || '';

      const cleanDescription = pfDescription.replace(/<[^>]+>/g, '');
      const limitedDescription = cleanDescription.length > 170 
          ? `${cleanDescription.substring(0, 167)}...` 
          : cleanDescription;
      setMetaDescription(limitedDescription);
    }
  }, [post]);

  const handleClose = () => {
    navigate('/portfolio');
};
  

  if (!post) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color={"#217074"} loading={true} size={80} />
      </div>
    );
  }

  const canonicalURL = `${window.location.origin}/portfolio/${post.id}`;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalURL} />
      </Helmet>

      <div className='main_Content single-portfolio'>
        <div className='row mt-3 mb-1'>
          <div className='col-md-12 portfolio-top-nav'>
            <div className='d-flex justify-content-end w-100 position-relative'>
              <a href='' onClick={(e) => { e.preventDefault(); handleClose(); }} className='icon-box text-white p-2 m-1'>
                <i className="fa-solid fa-xmark"></i>
              </a>
            </div>
          </div>
        </div>

        <h1 className='single-post-title'>{post.title}</h1>
        <div className='container'>
          <div className='row single-post-content'>
            <div className='single-post-desc col-lg-8 col-md-12 order-lg-1 order-md-2'>
              <h3>Description</h3>
              <p className='user_pf_client'><i className="fa fa-user"></i>{post.post_meta.fw_options.portfolio_type.standard.pf_client}</p>
              <p className='user_pf_date'><i className="fa fa-calendar"></i>{post.post_meta.fw_options.portfolio_type.standard.pf_date}</p>
              <p dangerouslySetInnerHTML={{ __html: post.post_meta.fw_options.portfolio_type.standard.pf_description }}></p>
              <h3>Share</h3>
              <div className='social_icons_2'>
                <div><a href={`https://www.facebook.com/share_channel/?link=${encodeURIComponent(canonicalURL)}`} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a></div>
                <div><a href={`https://x.com/intent/post?url=${encodeURIComponent(canonicalURL)}`} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter"></i></a></div>
                <div><a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalURL)}`} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a></div>
                <div><a href='https://digg.com/' target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-digg"></i></a></div>
              </div>
            </div>
            <div className='col-lg-4 col-md-12 order-lg-2 order-md-1'>
              <img src={post.featured_image} alt={post.title} width="auto" height="auto" className='img-fluid' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Single;
