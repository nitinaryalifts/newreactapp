import React, { createContext, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { InlineWidget } from 'react-calendly';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function ContactModal({ show, handleClose }) {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogType, setOgType] = useState("");
  const [ogURL, setOgURL] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonicalURL, setCanonicalURL] = useState("");
  const [robotsContent, setRobotsContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Fetching data...");
      try {
        const response = await axios.get('https://mancuso.ai/mancusov2/wp-json/wp/v2/pages');
        const pageRes = response.data;

        console.log("Response data:", pageRes);

        const targetSlug = "resume";
        const targetPage = pageRes.data.find(page => page.slug === targetSlug);

        if (targetPage) {
          const yoastData = targetPage.yoast_head_json;
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
          } else {
            console.warn("Schema data for Person and Organization not found.");
          }         

          if (yoastData.og_image && yoastData.og_image.length > 0) {
            setOgImage(yoastData.og_image[0].url);
          } else {
            console.warn("og_image not found in yoast data.");
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

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
        <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="og:title" content={ogTitle} />
        <meta name="og:description" content={ogDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={ogURL} />
        <meta property="og:image" content={ogImage} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalURL} />
        <meta name="robots" content={robotsContent} />
      </Helmet>
      <Modal.Header className='border-0'>
      <a href='' onClick={(e) => { e.preventDefault(); handleClose(); }} className='icon-boxx text-white p-2 m-1'>
              <i className="fa-solid fa-xmark"></i>
            </a>
      </Modal.Header>
      <Modal.Body>
        <InlineWidget url="https://calendly.com/mikemancuso?hide_gdpr_banner=1" />
      </Modal.Body>
    </Modal>
  );
}

export default ContactModal;
