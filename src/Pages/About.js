// About.js
import React, { useRef, useCallback, useEffect } from 'react';
import { useAbout } from '../Context/AboutContext';
import '../Style.css';
import Slider from "react-slick";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaCompass, FaDiagramProject, FaLightbulb, FaPaperPlane } from "react-icons/fa6";
import { Row, Col } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import ContactModal from './ContactModal';
import Logosslide from './LogoSlider';
import { Helmet } from 'react-helmet';

function About() {
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
        bigAvatar,
        theme,
        whatWeDo,
        testimonials,
        loading,
        showContactModal,
        handleShowContactModal,
        handleCloseContactModal,
        faviconUrl,
    } = useAbout();

    const sliderRef = useRef(null);

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


    useEffect(() => {
        if (faviconUrl) {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, [faviconUrl]);
    


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
                        <meta name="og:title" content={ogTitle} />
                        <meta name="og:description" content={ogDescription} />
                        <link rel="canonical" href={canonicalURL} />
                        <meta property="og:type" content={ogType}></meta>
                        <meta property="og:image" content={ogImage}></meta>
                        <meta property="og:url" content={ogURL}></meta>
                        <meta name="robots" content={robotsContent} />
                        {faviconUrl && <link rel="icon" href={faviconUrl} />}
                    </Helmet>
                    
                    <div className='about_sections'>
                        {/* About Me Section */}
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

                        {/* What I Do Section */}
                        <section className='what_iDo text-start bg-white section_padding py-5'>
                            <h3 className='heading'>What I Do</h3>
                            <Row>
                                {whatWeDo.map((item, index) => (
                                    <Col md={6} key={index}>
                                        <div className='info_box d-flex gap-4 py-3 pe-3'>
                                            <div className='leftIcon'>
                                                {/* Icons based on index */}
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

                        {/* Logo Slider */}
                        <Logosslide />

                        {/* Testimonials Section */}
                        <section className='TestimonialSlider bg-white section_padding text-start pb-5 py-5'>
                            <h3 className='heading'>Testimonials</h3>
                            <div className='SliderItems pb-4 pb-sm-5'>
                                <Slider {...settings} ref={sliderRef}>
                                    {testimonials.map((item, key) => (
                                        <div className='Slider_Item d-flex flex-column' key={key}>
                                            <div className='disc_'>
                                                <p>{item.quote}</p>
                                            </div>
                                            <div className='testimonial_credits'>
                                                <p className='avtar_name'>{item.name}</p>
                                                <a href={item.link} className='desg'>{item.company}</a>
                                                <img className='sliderAvtar_' src={item.image.url} height="auto" width="auto" alt="testimonial" />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </section>

                        {/* Contact Modal */}
                        <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
                    </div>
                </>
            )}
        </div>
    );
}

export default About;
