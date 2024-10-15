import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Helmet } from 'react-helmet';

const API = "https://mancuso.ai/wp-json/v1/portfolios";

const Single = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API);
        const data = response.data;
        setPosts(data);

        const singlePost = data.find(post => post.id === parseInt(id));
        if (singlePost) {
          setPost(singlePost);

          setMetaTitle(singlePost.title);
          const pfDescription = singlePost.post_meta?.fw_options?.portfolio_type?.standard?.pf_description;

          const cleanDescription = pfDescription.replace(/<[^>]+>/g, '');
          setMetaDescription(cleanDescription);
        } else {
          console.error('Post not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  const handlePrevious = () => {
    const currentIndex = posts.findIndex(post => post.id === parseInt(id));
    if (currentIndex > 0) {
      const previousPost = posts[currentIndex - 1];
      navigate(`/portfolio/${previousPost.id}`);
    }
  };

  const handleNext = () => {
    const currentIndex = posts.findIndex(post => post.id === parseInt(id));
    if (currentIndex < posts.length - 1) {
      const nextPost = posts[currentIndex + 1];
      navigate(`/portfolio/${nextPost.id}`);
    }
  };

  const handleClose = () => {
    navigate('/portfolio');
  };

  // Loader condition while data is being fetched
  if (loading) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color={"#217074"} loading={loading} size={80} />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  const currentIndex = posts.findIndex(post => post.id === parseInt(id));
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1;

  return (
    <>
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
   </Helmet>

    <div className='main_Content single-portfolio'>
      <div className='row mt-3 mb-1'>
        <div className='col-md-12 portfolio-top-nav'>
          <div className='d-flex justify-content-end w-100 position-relative'>
            {/* {hasPrevious && (
              <a href='' onClick={(e) => { e.preventDefault(); handlePrevious(); }} className='icon-box text-white p-2 m-1'>
                <i className="fa-solid fa-angle-left"></i>
              </a>
            )}
            {hasNext && (
              <a href='' onClick={(e) => { e.preventDefault(); handleNext(); }} className='icon-box text-white p-2 m-1'>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            )} */}
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
              <div><a href='https://www.facebook.com/share_channel/?link=https%3A%2F%2Fmancuso.ai%2Fproject%2Fplatform-consolidation%2F&app_id=966242223397117&source_surface=external_reshare&display&hashtag' target="_blank"><i className="fa-brands fa-facebook-f"></i></a></div>
              <div><a href='https://x.com/intent/post?url=https%3A%2F%2Fmancuso.ai%2Fproject%2Fplatform-consolidation%2F' target="_blank"><i className="fa-brands fa-twitter"></i></a></div>
              <div><a href='https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fmancuso.ai%2Fproject%2Fplatform-consolidation%2F' target="_blank"><i className="fa-brands fa-linkedin-in"></i></a></div>
              <div><a href='https://digg.com/' target="_blank"><i className="fa-brands fa-digg"></i></a></div>
            </div>
          </div>
          <div className='col-lg-4 col-md-12 order-lg-2 order-md-1'>
            <img src={post.featured_image} alt={post.title} className='img-fluid' />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Single;
