import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";

const SinglePost = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const navigate = useNavigate();
  
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [canonicalURL, setCanonicalURL] = useState("");
  const [ogType, setOgType] = useState("");
  const [ogURL, setOgURL] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [robotsContent, setRobotsContent] = useState("");

  useEffect(() => {
    if (!post) return;

    const yoastData = post.yoast_head_json;
    if (yoastData) {
      setMetaTitle(yoastData.title);
      setOgTitle(yoastData.og_title);
      setOgDescription(yoastData.og_description);
      setCanonicalURL(yoastData.canonical);
      setOgType(yoastData.og_type);
      setOgURL(yoastData.og_url);
      
      const schemaData = yoastData.schema["@graph"].find(item => 
        item["@type"].includes("Person") && item["@type"].includes("Organization")
      );

      if (schemaData) {
        const description = schemaData.description.length > 167 
          ? schemaData.description.slice(0, 167) + '...' 
          : schemaData.description;
        setMetaDescription(description);
      }

      if (yoastData.og_image && yoastData.og_image.length > 0) {
        setOgImage(yoastData.og_image[0].url);
      }

      if (yoastData.keywords) {
        setKeywords(yoastData.keywords);
      }

      if (yoastData.robots) {
        const { index, follow, "max-snippet": maxSnippet, "max-image-preview": maxImagePreview, "max-video-preview": maxVideoPreview } = yoastData.robots;
        const robotsArray = [
          index ? index : null,
          follow ? follow : null,
          maxSnippet ? `max-snippet:${maxSnippet}` : null,
          maxImagePreview ? `max-image-preview:${maxImagePreview}` : null,
          maxVideoPreview ? `max-video-preview:${maxVideoPreview}` : null,
        ].filter(Boolean);
        setRobotsContent(robotsArray.join(', '));
      }
    }
  }, [post]);

  if (!post) {
    return <p>Post not found.</p>;
  }

  const handleClose = () => {
    navigate('/Posts/');
  };

  return (
    <>
      <Helmet>
      <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="og:title" content={ogTitle} />
            <meta name="og:description" content={ogDescription} />
            <link rel="canonical" href={canonicalURL} />
            <meta property="og:type" content={ogType}></meta>
            <meta property="og:image" content={ogImage}></meta>
            <meta property="og:url" content={ogURL}></meta>
            <meta name="robots" content={robotsContent} />
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
