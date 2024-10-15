import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../Style.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaCompass, FaDiagramProject, FaLightbulb, FaPaperPlane } from "react-icons/fa6";
import { Row, Col } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import ContactModal from './ContactModal';
import Logosslide from './LogoSlider';
import { Helmet } from 'react-helmet';

function About() {
    const [metaTitle, setMetaTitle] = useState();
    const [metaDescription, setMetaDescription] = useState();
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState("");
    const [bigAvatar, setBigAvatar] = useState([]);
    const [whatWeDo, setWhatWeDo] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const sliderRef = useRef(null);

    const handleShowContactModal = () => setShowContactModal(true);
    const handleCloseContactModal = () => setShowContactModal(false);

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
    
                    setMetaDescription(personOrgDescription);
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

    const setEqualHeight = useCallback(() => {
        if (sliderRef.current) {
            const slidesContainer = sliderRef.current.innerSlider.list;
            const slides = slidesContainer.querySelectorAll('.Slider_Item');

            let maxHeight = 0;

            slides.forEach(slide => {
                slide.style.height = 'auto';
            });

            slides.forEach(slide => {
                maxHeight = Math.max(maxHeight, slide.offsetHeight);
            });

            slides.forEach(slide => {
                slide.style.height = `${maxHeight}px`;
            });
        }
    }, []);

    const debounce = (func, delay) => {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    useEffect(() => {
        if (testimonials.length > 0) {
            setTimeout(() => {
                setEqualHeight();
            }, 500);
        }

        const handleResize = debounce(() => {
            setTimeout(() => {
                setEqualHeight();
            }, 500);
        }, 150);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [testimonials, setEqualHeight]);

    // Fetch data for the page
    useEffect(() => {
        axios.get("https://mancuso.ai/mancusov2/wp-json/v1/main_section")
            .then((resp) => {
                setTheme(resp.data[0].settings);
                setBigAvatar(resp.data[0].settings.image.url);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching main section data", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get("https://mancuso.ai/mancusov2/wp-json/v1/services")
            .then((resp) => {
                setWhatWeDo(resp.data);
            })
            .catch((error) => {
                console.error("Error fetching services", error);
            });
    }, []);

    useEffect(() => {
        axios.get("https://mancuso.ai/mancusov2/wp-json/v1/home_testimonial")
            .then((resp) => {
                setTestimonials(resp.data[0].settings.testimonials);
            })
            .catch((error) => {
                console.error("Error fetching testimonials", error);
            });
    }, []);

    const settings = {
        dots: false,
        arrow: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <IoIosArrowForward />,
        prevArrow: <IoIosArrowBack />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrow: true,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    return (
        <div className='main_Content'>
            {loading ? (
                <div className="text-center loader_pos_abs">
                    <ClipLoader color="#217074" loading={loading} size={80} />
                </div>
            ) : (
                <>
                    <Helmet>
                       <title>{metaTitle}</title>
                       <meta name="description" content={metaDescription} />
                    </Helmet>
                    
                    <div className='about_sections'>
                        <section className='aboutme_section'>
                            <Row>
                                <Col md={6}>
                                    <div className='leftimgbox' style={{ backgroundImage: `url(${bigAvatar})` }}></div>
                                </Col>
                                <Col md={6}>
                                    <div className='rightContetnbox text-start'>
                                        {theme.subtitles && theme.subtitles.length > 0 && (
                                            <div dangerouslySetInnerHTML={{ __html: theme.subtitles[0].subtitle }} />
                                        )}
                                        <h2 className="hp-main-title" dangerouslySetInnerHTML={{ __html: theme.title }}></h2>
                                        <div dangerouslySetInnerHTML={{ __html: theme.text }}></div>
                                        <div className="hp-buttons mt-4">
                                            {theme.buttons && theme.buttons.length > 0 && (
                                                <>
                                                    <a href={theme.buttons[0].url} target="yes" className="custom_btn custom-primary me-2" dangerouslySetInnerHTML={{ __html: theme.buttons[0].button_title }}></a>
                                                    <a href={theme.buttons[1].url}
                                                       target=""
                                                       className="custom_btn custom-secondary"
                                                       onClick={(e) => { e.preventDefault(); handleShowContactModal(); }}
                                                       dangerouslySetInnerHTML={{ __html: theme.buttons[1].button_title }}>
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </section>

                        <section className='what_iDo text-start bg-white section_padding py-5'>
                            <h3 className='heading'>What I Do</h3>
                            <Row>
                                {whatWeDo && whatWeDo.map((item, index) => (
                                    <Col md={6} key={index}>
                                        <div className='info_box d-flex gap-4 py-3 pe-3'>
                                            <div className='leftIcon'>
                                                {index === 0 && <FaCompass />}
                                                {index === 1 && <FaDiagramProject />}
                                                {index === 2 && <FaLightbulb />}
                                                {index === 3 && <FaPaperPlane />}
                                            </div>
                                            <div className='infoContent'>
                                                <h4 className='mt-1 heading_bl' dangerouslySetInnerHTML={{ __html: item.settings.title }}></h4>
                                                <p className='about_parah' dangerouslySetInnerHTML={{ __html: item.settings.description }}></p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </section>

                        <Logosslide />

                        <section className='TestimonialSlider bg-white section_padding text-start pb-5 py-5'>
                            <h3 className='heading'>Testimonials</h3>
                            <div className='SliderItems pb-4 pb-sm-5'>
                                <Slider {...settings} ref={sliderRef}>
                                    {testimonials.map((items, key) => (
                                        <div className='Slider_Item d-flex flex-column' key={key}>
                                            <div className='disc_'>
                                                <p>{items.quote}</p>
                                            </div>
                                            <div className='testimonial_credits'>
                                                <p className='avtar_name'>{items.name}</p>
                                                <a href={items.link} className='desg'>{items.company}</a>
                                                <img className='sliderAvtar_' src={items.image.url} alt="testimonial" loading="lazy" />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </section>

                        <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
                    </div>
                </>
            )}
        </div>
    );
}

export default About;
