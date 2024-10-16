import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import '../Style.css';
import { ClipLoader } from 'react-spinners';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


// API Endpoints
const API = "https://mancuso.ai/mancusov2/wp-json/v1/timeline";
const APIC = "https://mancuso.ai/mancusov2/wp-json/v1/certificates";
const APIT = "https://mancuso.ai/mancusov2/wp-json/v1/get_tags";
const APIS = "https://mancuso.ai/mancusov2/wp-json/v1/get_testimonial_byid/";


function Resume() {
    const [metaTitle, setMetaTitle] = useState();
    const [metaDescription, setMetaDescription] = useState();
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [education, setEducation] = useState([]);
    const [tags, setTags] = useState([]);
    const [testimonials, setTestimonials] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state

    const getLimitedDescription = (description) => {
        if (!description) return "";
        return description.length > 170 ? `${description.substring(0, 167)}...` : description;
    };    


    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const setEqualHeight = () => {
        if (sliderRef.current) {
            const slides = sliderRef.current.innerSlider.list.querySelectorAll('.slide_ht');
            let maxHeight = 0;
    
            slides.forEach(slide => {
                slide.style.height = 'auto';
            });
    
            requestAnimationFrame(() => {
                slides.forEach(slide => {
                    const height = slide.offsetHeight;
                    maxHeight = Math.max(maxHeight, height);
                });
    
                slides.forEach(slide => {
                    slide.style.height = `${maxHeight}px`;
                });
            });
        }
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

    const removeShortcodes = (text) => {
        return text.replace(/\[rt-testimonial id="\d+" title="[^\"]+"\]/g, '');
    };

    const stripHtmlTags = (text) => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.body.textContent || "";
    };

useEffect(() => {
    setEqualHeight();

    const handleResize = debounce(() => {
        setEqualHeight();
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, [testimonials]); 



    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get(API);
                setExperiences(response.data);

                const testimonialIds = new Set();
                response.data.forEach(experience => {
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
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);


    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(APIC);
                setCertificates(response.data);
            } catch (error) {
                console.error('Error fetching certificates:', error);
            }
        };
        fetchCertificates();
    }, []);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await axios.get(APIC);
                setEducation(response.data);
            } catch (error) {
                console.error('Error fetching education:', error);
            }
        };
        fetchEducation();
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(APIT);
                console.log("Tags response:", response.data);
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <IoIosArrowForward />,
        prevArrow: <IoIosArrowBack />,
        arrows: true,
        appendDots: dots => (
            <div style={{ position: 'absolute', bottom: 0, right: '50%', transform: 'translateX(50%)' }}>
                <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
            </div>
        )
    };
    
    const canonicalURL = window.location.href;

    return (
        <div className='main_Content'>
            {loading ? (
                <div className="text-center loader_pos_abs">
                    {/* Spinner is shown while loading */}
                    <ClipLoader color="#217074" loading={loading} size={80} />
                </div>
            ) : (
                <>
                    <Helmet>
                       <title>{metaTitle}</title>
                       <meta name="description" content={metaDescription} />
                       <link rel="canonical" href={canonicalURL} />
                    </Helmet>
                    <div className='resume_section section_padding py-5 bg-white'>
                        <h2 className='section-title text-start pt-4'>Resume</h2>
                        <h5 className="section-description text-end">15+ Years of Experience</h5>
                        <Row className='py-5'>
                            <Col md={8}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h3 className="heading">Experience</h3>
                                    <button className='mainBtn' onClick={() => window.open('https://mancuso.ai/wp-content/uploads/2024/07/Michael-Mancuso-Resume-2024.pdf', '_blank')}>Download resume</button>
                                </div>
                                <div>
                                    {experiences.length > 0 ? (
                                        experiences.map((experience, index) => (
                                            <div key={index}>
                                                <ul className='ps-0 list-unstyled'>
                                                    {experience.settings && experience.settings.timeline && experience.settings.timeline.length > 0 ? (
                                                        experience.settings.timeline.map((timelineItem, idx) => {
                                                            const testimonialId = extractTestimonialId(timelineItem.text);
                                                            return (
                                                                <li key={idx} className='Exp_ItemBox mt-3'>
                                                                    <span className="item-period">
                                                                        {timelineItem.period || "No period available"}
                                                                    </span>
                                                                    <div className='exp_item ps-4 pt-2'>
                                                                        {timelineItem.logo && timelineItem.logo.url && (
                                                                            <img src={timelineItem.logo.url} className="companyN" alt='logoimg' height={50}
                                                                            width="auto" 
                                                                            loading="lazy" />
                                                                        )}
                                                                        <p dangerouslySetInnerHTML={{ __html: removeShortcodes(timelineItem.text) }}></p>

                                                                        {/* Testimonial Slider */}
                                                                        {testimonialId &&
                                                                            testimonials[testimonialId] &&
                                                                            testimonials[testimonialId].length > 0 && (
                                                                                <Slider key={testimonialId} ref={sliderRef} {...sliderSettings} className="custom-carousel">
                                                                                    {testimonials[testimonialId].map((item) => (
                                                                                        <div key={item.id} className="testimonial-container">
                                                                                            <div className='slide_ht'>
                                                                                                <div className="testimonial-content">
                                                                                                    <p>{stripHtmlTags(item.content)}</p>
                                                                                                </div>
                                                                                                <div className='d-flex gap-3'>
                                                                                                    <div className="testimonial-image">
                                                                                                        <img
                                                                                                            src={item.featured_image}
                                                                                                            className="d-block"
                                                                                                            alt={item.title}
                                                                                                            loading="lazy"
                                                                                                            height="auto"
                                                                                                            width="auto"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="testimonial-info text-left">
                                                                                                        <h5>{item.title}</h5>
                                                                                                        <h6>{item.post_meta.tss_company}</h6>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </Slider>
                                                                            )}
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                    ) : (
                                                        <p>No timeline data available.</p>
                                                    )}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p>.</p>
                                    )}
                                </div>
                            </Col>
                            <Col md={4}>
                                <h3 className="heading">Education</h3>
                                {education[0] && (
                                    <div className='collegeCard mb-5' key={education[0].id}>
                                        <a href={education[0].settings.image.url} target="_blank" rel="noopener noreferrer">
                                            <div className='coll_inner d-flex align-items-stretch'>
                                                <div className='coll_logo align-content-center p-4'>
                                                    <img src={education[0].settings.logo.url} alt={education[0].settings.title} className="img-fluid" loading="lazy" height="auto" width="auto" />
                                                </div>
                                                <div className='collegeContent p-4'>
                                                    <div className="certi-content">
                                                        <h4>{education[0].settings.title}</h4>
                                                        <div className="certi-id">
                                                            <span>{education[0].settings.membership}</span>
                                                        </div>
                                                        <div className="certi-date">
                                                            <span>{education[0].settings.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                )}
                                <div className='edu'>
                                    <h3 className="heading">Certifications</h3>
                                    <div className='collegeCardContainer'>
                                        {certificates.slice(1).map((certificate) => (
                                            <div className='collegeCard' key={certificate.id}>
                                                <a href={certificate.settings.image.url} target="_blank" rel="noopener noreferrer">
                                                    <div className='coll_inner d-flex align-items-stretch'>
                                                        <div className='coll_logo align-content-center p-4'>
                                                            <img src={certificate.settings.logo.url} alt="logo" className="img-fluid" loading="lazy" height="auto" width="auto" />
                                                        </div>
                                                        <div className='collegeContent p-4'>
                                                            <div className="certi-content">
                                                                <h4>{certificate.settings.title}</h4>
                                                                <div className="certi-id">
                                                                    <span>{certificate.settings.membership}</span>
                                                                </div>
                                                                <div className="certi-date">
                                                                    <span>{certificate.settings.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="heading">Skills</h3>
                                    <ul className='ps-0'>
                                        {tags.map((tag) => (
                                            <div key={tag.id}>
                                                {tag.settings.knowledges.map((knowledgeItem, index) => (
                                                    <li className='customBages' key={index}>
                                                        {knowledgeItem.knowledge}
                                                    </li>
                                                ))}
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </div>
    );
}

export default Resume;
