import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';

const AboutContext = createContext();

export const useAbout = () => {
    return useContext(AboutContext);
};

export const AboutProvider = ({ children }) => {
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [ogTitle, setOgTitle] = useState("");
    const [ogDescription, setOgDescription] = useState("");
    const [canonicalURL, setCanonicalURL] = useState("");
    const [ogType, setOgType] = useState("");
    const [ogURL, setOgURL] = useState("");
    const [bigAvatar, setBigAvatar] = useState("");
    const [ogImage, setOgImage] = useState("");
    const [keywords, setKeywords] = useState("");
    const [robotsContent, setRobotsContent] = useState("");
    const [theme, setTheme] = useState({});
    const [whatWeDo, setWhatWeDo] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [faviconUrl, setFaviconUrl] = useState("");

    const handleShowContactModal = () => setShowContactModal(true);
    const handleCloseContactModal = () => setShowContactModal(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://mancuso.ai/mancusov2/wp-json/wp/v2/pages');
                const pagesData = response.data;

                const targetSlug = "about-me";
                const targetPage = pagesData.find(page => page.slug === targetSlug);

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
                } else {
                    console.warn("Page not found for slug:", targetSlug);
                }

                // Fetching additional theme data
                const themeResponse = await axios.get("https://mancuso.ai/mancusov2/wp-json/v1/main_section");
                const servicesResponse = await axios.get("https://mancuso.ai/mancusov2/wp-json/v1/services");
                const testimonialsResponse = await axios.get("https://mancuso.ai/mancusov2/wp-json/v1/home_testimonial");

                setTheme(themeResponse.data[0].settings);
                setBigAvatar(themeResponse.data[0].settings.image.url);
                setWhatWeDo(servicesResponse.data);
                setTestimonials(testimonialsResponse.data[0].settings.testimonials);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchFavicon = async () => {
        try {
            const response = await axios.get("https://mancuso.ai/wp-json/v1/theme-settings");
            const faviconUrl = response.data.photo.url;
            if (faviconUrl) {
                setFaviconUrl(faviconUrl);
            } else {
                console.warn("Favicon URL is undefined or not available.");
            }
        } catch (error) {
            console.error("Error fetching favicon:", error);
        }
    };

    useEffect(() => {
        fetchFavicon();
    }, []);

    return (
        <AboutContext.Provider value={{
            metaTitle,
            metaDescription,
            ogTitle,
            ogURL,
            ogDescription,
            canonicalURL,
            ogType,
            ogImage,
            keywords,
            robotsContent,
            bigAvatar,
            theme,
            whatWeDo,
            testimonials,
            loading,
            showContactModal,
            handleShowContactModal,
            handleCloseContactModal,
            faviconUrl,
        }}>
            {children}
        </AboutContext.Provider>
    );
};
