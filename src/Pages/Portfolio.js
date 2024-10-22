// src/Pages/Portfolio.js
import React, { useState, useEffect } from 'react';
import '../Style.css';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import the spinner component
import { Helmet } from 'react-helmet';
import { usePortfolio } from '../Context/PortfolioContext'; // Import the context

function App() {
  const {
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    canonicalURL,
    ogType,
    ogURL,
    ogImage,
    robotsContent,
    loading,
    filterOptions,
    activeCategory,
    filterPosts,
    filteredPosts,
  } = usePortfolio();

  return (
    <>
      <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <meta name="og:title" content={ogTitle} />
          <meta name="og:description" content={ogDescription} />
          <link rel="canonical" href={canonicalURL} />
          <meta property="og:type" content={ogType}></meta>
          <meta property="og:url" content={ogURL}></meta>
          <meta property="og:image" content={ogImage}></meta>
          <meta name="robots" content={robotsContent} />
      </Helmet>
                    
    <div className="bg-white section_padding">
      <div className='d-flex flex-wrap justify-content-end gap-2'>
        {filterOptions.map((category) => (
          <button 
            className={`text-capitalize ${activeCategory === category ? 'active' : ''}`}
            key={category}
            onClick={() => filterPosts(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="row" style={{ marginTop: '30px' }}>
        {loading ? (
          <div className="d-flex justify-content-center loader_pos_abs">
            <ClipLoader color={"#217074"} loading={loading} size={80} />
          </div>
        ) : (
          filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div className="col-md-3 mb-0" key={post.id} style={{padding:'8px'}}>
                <Link
                  to={`/portfolio/${post.id}`}
                  state={{ post: post }}
                  style={{ textDecoration: 'none' }}
                  className='portfolio_card'
                >
                  <div className='image-container' style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      loading="lazy"
                      width="100%"
                      height='auto'
                    />
                    {/* Overlay elements */}
                    <div className='overlay-col' style={{
                      position: 'absolute',
                      width:'100%',
                      height:'100%',
                      top: '0',
                      left: '0',
                      backgroundColor: '#217074',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                    }}>
                    </div>
                    <div className='overlay-text' style={{
                      position: 'absolute',
                      margin: '10px',
                      padding: '10px',
                      width:'78%',
                      top: '0',
                      left: '0',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                    }}>
                      <p title="">{post.title}</p>
                    </div>
                    <div className='overlay-text-3' style={{
                      position: 'absolute',
                      margin: '10px',
                      padding: '2px 7px',
                      bottom: '0',
                      right: '0',
                      backgroundColor: '#fff',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                    }}>
                      <span><i className="fa-regular fa-file-lines"></i></span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )
        )}
      </div>
    </div>
    </>
  );
}

function Portfolio() {
  const [metaTitle, setMetaTitle] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [error, setError] = useState(null);

  const getLimitedDescription = (description) => {
    if (!description) return "";
    return description.length > 170 ? `${description.substring(0, 167)}...` : description;
  };

  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch('https://mancuso.ai/mancusov2/wp-json/wp/v2/pages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setMetaTitle(data[0].yoast_head_json.title);

          const graphArray = data[0].yoast_head_json.schema["@graph"];
          const personOrgItem = graphArray.find(
            (item) => item["@type"].includes("Person") || item["@type"].includes("Organization")
          );

          const personOrgDescription = personOrgItem?.description || '';
          const limitedDescription = getLimitedDescription(personOrgDescription);
          setMetaDescription(limitedDescription);
          setError(null);
        } else {
          throw new Error('No data found');
        }
      } catch (error) {
        console.error("Error fetching meta tags:", error);
        setError("Failed to fetch meta tags. Please try again later.");
      }
    };

    fetchMetaTags();
  }, []);

  const canonicalURL = window.location.href;

  return (
    <>
      <div className='main_Content'>
        <section className={`portfolio_section section_padding py-5 bg-white`}>
          <h2 className='section-title text-start portfolio-title pt-4'>Portfolio</h2>
          <h5 className="section-description text-end">My Works</h5>
        </section>
        <section className='portfolio_content bg-white'>
          <App />
        </section>
      </div>
    </>
  );
}

export default Portfolio;
