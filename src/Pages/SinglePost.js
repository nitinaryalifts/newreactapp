import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { usePosts } from "../Context/PostsContext"; // Import your context

const SinglePost = () => {
  const location = useLocation();
  const { post } = location.state || {};
  const navigate = useNavigate();

  const { posts } = usePosts(); // Get posts from context

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [canonicalURL, setCanonicalURL] = useState("");
  const [ogType, setOgType] = useState("");
  const [ogURL, setOgURL] = useState("");
  const [ogImage, setOgImage] = useState("");
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

      const schemaData = yoastData.schema["@graph"].find(
        (item) =>
          item["@type"].includes("Person") &&
          item["@type"].includes("Organization")
      );

      if (schemaData) {
        const description =
          schemaData.description.length > 167
            ? schemaData.description.slice(0, 167) + "..."
            : schemaData.description;
        setMetaDescription(description);
      }

      if (yoastData.og_image && yoastData.og_image.length > 0) {
        setOgImage(yoastData.og_image[0].url);
      }

      if (yoastData.robots) {
        const {
          index,
          follow,
          "max-snippet": maxSnippet,
          "max-image-preview": maxImagePreview,
          "max-video-preview": maxVideoPreview,
        } = yoastData.robots;
        const robotsArray = [
          index ? index : null,
          follow ? follow : null,
          maxSnippet ? `max-snippet:${maxSnippet}` : null,
          maxImagePreview ? `max-image-preview:${maxImagePreview}` : null,
          maxVideoPreview ? `max-video-preview:${maxVideoPreview}` : null,
        ].filter(Boolean);
        setRobotsContent(robotsArray.join(", "));
      }
    }
  }, [post]);

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Find the author from the context posts
  const author =
    posts.find((p) => p.id === post.id)?.authorName || "Unknown Author";

  const handleClose = () => {
    navigate("/Posts/");
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="og:title" content={ogTitle} />
        <meta name="og:description" content={ogDescription} />
        <link rel="canonical" href={canonicalURL} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogURL} />
        <meta name="robots" content={robotsContent} />
      </Helmet>
      <div className="main_Content">
        <section className={`portfolio_section section_padding py-5 bg-white`}>
        <div className='row mb-1'>
          <div className='col-md-12 portfolio-top-nav'>
            <div className='d-flex justify-content-end w-100 position-relative'>
              <a href='' onClick={(e) => { e.preventDefault(); handleClose(); }} className='icon-box text-white p-2 m-1'>
                <i className="fa-solid fa-xmark"></i>
              </a>
            </div>
          </div>
        </div>
          <h1 className="post-title">{post.title.rendered}</h1>
          <div className="row">
          <div className="col-md-7 mainContentPart">
          
          <div className="d-flex justify-content-between">
            <p>Author: {author}</p>
            <p>Date: {new Date(post.date).toLocaleDateString()}</p>
          </div>

          <p>Categories: {post.categories}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: post.content.rendered,
            }}
          />
          <p>Comments: {post.comment_count}</p>
          </div>

          <div className="col-md-5 imgBOX">
          <img
            src={post.yoast_head_json.og_image[0].url}
            alt={post.title.rendered}
            className="img-fluid mb-3"
          />
          </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SinglePost;
