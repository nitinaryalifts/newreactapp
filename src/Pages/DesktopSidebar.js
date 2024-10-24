import React, { useEffect, useState, useCallback } from 'react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import ContactModal from './ContactModal';
import { useSpring, animated } from 'react-spring';

const api = axios.create({
  baseURL: 'https://mancuso.ai/wp-json/v1',
});

function DesktopSidebar({ closeMenu = () => {} }) {
  const [sidebar, setSidebar] = useState({});
  const [headerimg, setHeaderimg] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get("/theme-settings");
      setSidebar(data);
      setHeaderimg(data.photo.url);
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const { data } = await api.get("/menus");
      setMenuItems(data[0].items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchMenuItems();
  }, [fetchData, fetchMenuItems]);

  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  const styles = useSpring({
    opacity: 1,
    transform: `translateX(0)`,
    from: { opacity: 0, transform: `translateX(-100%)` },
  });

  const handleMenuClick = (item) => {
    closeMenu();
    if (item.title === "Contact") {
      handleShowContactModal();
    } else {
      const fullUrl = item.url ? new URL(item.url).pathname : `/${item.slug}`;
      navigate(fullUrl);
    }
  };

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
            {menuItems.map(item => (
              <li key={item.ID}>
                <NavLink 
                  to={item.url ? new URL(item.url).pathname : `/${item.slug}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item);
                  }}
                  className={({ isActive }) => 
                    isActive || 
                    (item.slug === 'about-me' && (location.pathname === '/' || location.pathname === '/about-me'))
                      ? 'active' 
                      : ''
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </Nav>
        <div className='social_icons'>
          <a target="_blank" rel="noopener noreferrer" href='https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fmancuso.ai%2Fproject%2Fplatform-consolidation%2F'>
            <FaLinkedinIn className='custom_icons' />
          </a>
        </div>
        <div className="copyrights">{sidebar.copyrights}</div>
      </div>
      <animated.div style={styles}>
        <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
      </animated.div>
    </>
  );
}

export default DesktopSidebar;
