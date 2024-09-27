import React, { useEffect, useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { TfiMenu } from 'react-icons/tfi';
import ContactModal from './ContactModal';
import DesktopSidebar from './DesktopSidebar';
import axios from 'axios';

function MobileHeader() {
  const [show, setShow] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [logo, setLogo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://mancuso.ai/wp-json/v1/theme-settings");
        setLogo(response.data.logo);
        setPhotoUrl(response.data.photo.url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='MobileHeader'>
      <div className="mobile_header d-flex flex-row-reverse w-100 justify-content-between px-4 align-items-center">
        <a className="menu-toggle">
          <TfiMenu className='text-black' onClick={handleShow} />
        </a>
        <div>
          <img src={photoUrl} width={35} alt="description" loading="lazy" />
          <a href="#" className='site-title-name'>{logo}</a>
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <div className='mobileView'>
            <DesktopSidebar closeMenu={handleClose} />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
    </div>
  );
}

export default MobileHeader;
