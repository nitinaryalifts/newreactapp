import React, { useEffect, useRef, useCallback } from 'react';
import Slider from 'react-slick';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const TestimonialsSlider = ({ testimonials }) => {
    const sliderRef = useRef(null);


    const setEqualHeight = useCallback(() => {
        if (sliderRef.current) {
            const slides = sliderRef.current.innerSlider.list.querySelectorAll('.slide_ht');
            let maxHeight = 0;

            slides.forEach(slide => {
                slide.style.height = 'auto';
            });

            setTimeout(() => {
                slides.forEach(slide => {
                    const height = slide.offsetHeight;
                    maxHeight = Math.max(maxHeight, height);
                });

                slides.forEach(slide => {
                    slide.style.height = `${maxHeight}px`;
                });
            }, 100);
        }
    }, [testimonials]);

    useEffect(() => {
        setEqualHeight();

        const handleResize = () => {
            setEqualHeight();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [testimonials, setEqualHeight]);

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <IoIosArrowForward />,
        prevArrow: <IoIosArrowBack />,
        arrows: true,
        adaptiveHeight: false,
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

    return (
        <Slider ref={sliderRef} {...sliderSettings}>
            {testimonials.map((item) =>  (
                        <div key={item.id} className="testimonial-container slide_ht d-flex flex-column">
                            <div className='testimonial-content'>
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
                    ))} 
                </Slider>
    );
};

export default TestimonialsSlider;
