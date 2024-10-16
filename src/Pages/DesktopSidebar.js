import React, { useEffect, useState, useCallback } from 'react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { NavLink, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import ContactModal from './ContactModal';

const api = axios.create({
  baseURL: 'https://mancuso.ai/wp-json/v1',
});

function DesktopSidebar({ closeMenu }) {
  const [sidebar, setSidebar] = useState("");
  const [headerimg, setHeaderimg] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get("/theme-settings");
      setSidebar(data);
      setHeaderimg(data.photo.url);
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  return (
    <>
      <div className='header_content'>
        <div className='topContent text-center mx-auto my-4'>
          <div className="header-image">
            <Link to="/" onClick={closeMenu}>
              <img 
                src={headerimg}
                width={60} 
                height="auto"
                loading="lazy" 
                alt={sidebar.logo}
              />

            </Link>
          </div>
          <div className="site-title-block mt-4">
            <Link to="/" onClick={closeMenu}>
              <h1 className="site-title">{sidebar.logo}</h1>
            </Link>
          </div>
        </div>
        <Nav className="flex-column sideTabs">
          <ul className='list-unstyled'>
            <li>
              <NavLink to="/" onClick={closeMenu}>About me</NavLink>
            </li>
            <li>
              <NavLink to="/resume" onClick={closeMenu}>Resume</NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" onClick={closeMenu}>Portfolio</NavLink>
            </li>
            <li>
              <NavLink className={() => ''} to="#" onClick={(e) => { e.preventDefault(); handleShowContactModal(); }}>Contact</NavLink>
            </li>
          </ul>
        </Nav>
        <div className='social_icons'>
          <a target="_blank" href='https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fmancuso.ai%2Fproject%2Fplatform-consolidation%2F'>
            <FaLinkedinIn className='custom_icons' />
          </a>
        </div>
        <div className="copyrights">{sidebar.copyrights}</div>
      </div>
      <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
    </>
  );
}

export default DesktopSidebar;
