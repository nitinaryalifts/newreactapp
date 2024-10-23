// src/context/PortfolioContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};

export const PortfolioProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Meta data states
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [canonicalURL, setCanonicalURL] = useState("");
  const [ogType, setOgType] = useState("");
  const [ogURL, setOgURL] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [robotsContent, setRobotsContent] = useState({});
  
  const API = "https://mancuso.ai/wp-json/v1/portfolios";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API);
        const allPosts = response.data;

        const allCategories = allPosts.flatMap(post => post.categories || []);
        const uniqueCategories = ['all', ...new Set(allCategories)].filter(Boolean).sort();
        
        const sortedCategories = ['all', ...uniqueCategories.filter(category => category !== 'all')];

        setFilterOptions(sortedCategories);
        setPosts(allPosts);
        setFilteredPosts(allPosts);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    const fetchMetadata = async () => {
      try {
        const response = await axios.get('https://mancuso.ai/mancusov2/wp-json/wp/v2/pages');
        const pagesData = response.data;

        const targetSlug = "portfolio";
        const targetPage = pagesData.find(page => page.slug === targetSlug);

        if (targetPage) {
          const yoastData = targetPage.yoast_head_json;
          setMetaTitle(yoastData.title);
          setOgTitle(yoastData.og_title);
          setCanonicalURL(yoastData.canonical);
          setOgType(yoastData.og_type);
          setOgURL(yoastData.og_url);
          setOgDescription(yoastData.og_description);

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

      } else {
          console.warn("Page not found for slug:", targetSlug);
      }
        
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchPosts();
    fetchMetadata();
  }, []);

  const filterPosts = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.categories?.includes(category));
      setFilteredPosts(filtered);
    }
  };

  const value = {
    posts,
    filteredPosts,
    filterOptions,
    activeCategory,
    loading,
    filterPosts,
    setActiveCategory,
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    canonicalURL,
    ogType,
    ogURL,
    ogImage,
    keywords,
    robotsContent,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
