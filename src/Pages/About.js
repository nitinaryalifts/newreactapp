import React, { useEffect, useState, useRef } from 'react';
import '../Style.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaCompass, FaDiagramProject, FaLightbulb, FaPaperPlane } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Logosslide from './LogoSlider';
import { Col, Row } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import ContactModal from './ContactModal';

function About() {
    const [theme, setTheme] = useState("");
    const [bigavtar, setBigAvtar] = useState([]);
    const [whatwedo, setWhatwedo] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const sliderRef = useRef([]);

    const handleShowContactModal = () => setShowContactModal(true);
    const handleCloseContactModal = () => setShowContactModal(false);

    const setEqualHeight = () => {
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
    };

    useEffect(() => {
        if (testimonials.length > 0) {
            setEqualHeight();
        }

        window.addEventListener('resize', setEqualHeight);

        return () => {
            window.removeEventListener('resize', setEqualHeight);
        };
    }, [testimonials]);

    
    useEffect(() => {
        axios.get("https://mancuso.ai/mancusov2/wp-json/v1/main_section")
            .then((resp) => {
                setTheme(resp.data[0].settings);
                setBigAvtar(resp.data[0].settings.image.url);
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
                setWhatwedo(resp.data);
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

    var settings = {
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
                    <div className='about_sections'>
                        <section className='aboutme_section'>
                            <Row>
                                <Col md={6}>
                                    <div className='leftimgbox' style={{ backgroundImage: `url(${bigavtar})` }}>
                                    </div>
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
                                {whatwedo && whatwedo.map((item, index) => (
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

                        <section className='TestimonialSlider bg-white section_padding text-start py-5'>
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
                            <img className='sliderAvtar_' src={items.image.url} alt="testimonial" />
                        </div>
             </div>
            ))}
        </Slider>
    </div>
    <div>
        
    </div>
</section>

                    </div>
                    <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
                </>
            )}
        </div>
    );
}

export default About;