import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useResume } from "../Context/ResumeContext";
import "../Style.css";
import TestimonialsSlider from "./TestimonialsSlider";

function Resume() {
  const {
    experiences,
    certificates,
    education,
    tags,
    testimonials,
    loading,
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    canonicalURL,
    ogType,
    ogURL,
    ogImage,
    robotsContent,
  } = useResume();

  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (!loading) {
      let timeout = setTimeout(() => setAnimationClass("slide-enter"), 0);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const extractTestimonialId = (text) => {
    const match = text.match(/\[rt-testimonial id="(\d+)" title="[^"]+"\]/);
    return match ? match[1] : null;
  };

  const removeShortcodes = (text) => {
    return text.replace(/\[rt-testimonial id="\d+" title="[^\"]+"\]/g, "");
  };

  const stripHtmlTags = (text) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  };

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

  return (
    <div className={`main_Content `}>
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
          </Helmet>
          <div
            className={`resume_section section_padding py-5 bg-white animate_section ${animationClass}`}
          >
            <h2 className="section-title text-start pt-4">Resume</h2>
            <h5 className="section-description text-end">
              15+ Years of Experience
            </h5>
            <Row className="py-5">
              <Col md={8}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="heading">Experience</h3>
                  <button
                    className="mainBtn"
                    onClick={() =>
                      window.open(
                        "https://mancuso.ai/wp-content/uploads/2024/07/Michael-Mancuso-Resume-2024.pdf",
                        "_blank"
                      )
                    }
                  >
                    Download resume
                  </button>
                </div>
                <div>
                  {experiences.length > 0 ? (
                    experiences.map((experience, index) => (
                      <div key={index}>
                        <ul className="ps-0 list-unstyled">
                          {experience.settings &&
                          experience.settings.timeline &&
                          experience.settings.timeline.length > 0 ? (
                            experience.settings.timeline.map(
                              (timelineItem, idx) => {
                                const testimonialId = extractTestimonialId(
                                  timelineItem.text
                                );
                                return (
                                  <li key={idx} className="Exp_ItemBox mt-3">
                                    <span className="item-period">
                                      {timelineItem.period ||
                                        "No period available"}
                                    </span>
                                    <div className="exp_item ps-4 pt-2">
                                      {timelineItem.logo &&
                                        timelineItem.logo.url && (
                                          <img
                                            src={timelineItem.logo.url}
                                            className="companyN"
                                            alt="logoimg"
                                            height={50}
                                            width="auto"
                                            loading="lazy"
                                          />
                                        )}
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: removeShortcodes(
                                            timelineItem.text
                                          ),
                                        }}
                                      ></p>
                                      <div>
                                        {testimonialId &&
                                          testimonials[testimonialId]?.length >
                                            0 && (
                                            <TestimonialsSlider
                                              testimonials={
                                                testimonials[testimonialId]
                                              }
                                            />
                                          )}
                                      </div>
                                    </div>
                                  </li>
                                );
                              }
                            )
                          ) : (
                            <p>No timeline data available.</p>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No experiences found.</p>
                  )}
                </div>
              </Col>
              <Col md={4}>
                <h3 className="heading">Education</h3>
                {education[0] && (
                  <div className="collegeCard mb-5" key={education[0].id}>
                    <a
                      href={education[0].settings.image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="coll_inner d-flex align-items-stretch">
                        <div className="coll_logo align-content-center p-4">
                          <img
                            src={education[0].settings.logo.url}
                            alt={education[0].settings.title}
                            className="img-fluid"
                            loading="lazy"
                            height="auto"
                            width="auto"
                          />
                        </div>
                        <div className="collegeContent p-4">
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
                <div className="edu">
                  <h3 className="heading">Certifications</h3>
                  <div className="collegeCardContainer">
                    {certificates.slice(1).map((certificate) => (
                      <div className="collegeCard" key={certificate.id}>
                        <a
                          href={certificate.settings.image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="coll_inner d-flex align-items-stretch">
                            <div className="coll_logo align-content-center p-4">
                              <img
                                src={certificate.settings.logo.url}
                                alt="logo"
                                className="img-fluid"
                                loading="lazy"
                                height="auto"
                                width="auto"
                              />
                            </div>
                            <div className="collegeContent p-4">
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
                  <ul className="ps-0">
                    {tags.map((tag) => (
                      <div key={tag.id}>
                        {tag.settings.knowledges.map((knowledgeItem, index) => (
                          <li className="customBages" key={index}>
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
