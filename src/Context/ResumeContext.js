import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ResumeContext = createContext();

const API = "https://mancuso.ai/mancusov2/wp-json/v1/timeline";
const APIC = "https://mancuso.ai/mancusov2/wp-json/v1/certificates";
const APIT = "https://mancuso.ai/mancusov2/wp-json/v1/get_tags";
const APIS = "https://mancuso.ai/mancusov2/wp-json/v1/get_testimonial_byid/";
const PAGE_API = "https://mancuso.ai/mancusov2/wp-json/wp/v2/pages";

export const ResumeProvider = ({ children }) => {
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [education, setEducation] = useState([]);
    const [tags, setTags] = useState([]);
    const [testimonials, setTestimonials] = useState({});
    const [loading, setLoading] = useState(true);
    
    // New state for metadata
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


    const fetchTestimonials = async (id) => {
        try {
            const response = await axios.get(`${APIS}${id}`);
            setTestimonials(prev => ({ ...prev, [id]: response.data }));
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    const extractTestimonialId = (text) => {
        const match = text.match(/\[rt-testimonial id="(\d+)" title="[^"]+"\]/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [experiencesRes, certificatesRes, educationRes, tagsRes, pageRes] = await Promise.all([
                    axios.get(API),
                    axios.get(APIC),
                    axios.get(APIC),
                    axios.get(APIT),
                    axios.get(PAGE_API)
                ]);
                
                setExperiences(experiencesRes.data);
                setCertificates(certificatesRes.data);
                setEducation(educationRes.data);
                setTags(tagsRes.data);

                const testimonialIds = new Set();
                experiencesRes.data.forEach(experience => {
                    if (experience.settings && experience.settings.timeline) {
                        experience.settings.timeline.forEach(timelineItem => {
                            const id = extractTestimonialId(timelineItem.text);
                            if (id) {
                                testimonialIds.add(id);
                            }
                        });
                    }
                });
                testimonialIds.forEach(id => fetchTestimonials(id));

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

        fetchData();
    }, []);

    return (
        <ResumeContext.Provider value={{ 
            experiences, 
            certificates, 
            education, 
            tags, 
            testimonials, 
            loading, 
            metaTitle,
            metaDescription,
            ogTitle,
            ogType,
            ogURL,
            ogImage,
            keywords,
            ogDescription,
            canonicalURL,
            robotsContent
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    return React.useContext(ResumeContext);
};
