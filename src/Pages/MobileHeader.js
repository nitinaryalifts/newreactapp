import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { TfiMenu } from 'react-icons/tfi';
import axios from 'axios';

const ContactModal = lazy(() => import('./ContactModal'));
const DesktopSidebar = lazy(() => import('./DesktopSidebar'));

function MobileHeader() {
  const [show, setShow] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [logo, setLogo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);
  
  const handleShowContactModal = useCallback(() => setShowContactModal(true), []);
  const handleCloseContactModal = useCallback(() => setShowContactModal(false), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("https://mancuso.ai/wp-json/v1/theme-settings");
        setLogo(data.logo);
        setPhotoUrl(data.photo.url);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='MobileHeader'>
      <div className="mobile_header d-flex flex-row-reverse w-100 justify-content-between px-4 align-items-center">
        <a className="menu-toggle" onClick={handleShow}>
          <TfiMenu className='text-black' />
        </a>
        <div>
          <img src={photoUrl} width={35} loading="lazy" />
          <a href="#" className='site-title-name'>{logo}</a>
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Suspense fallback={<div>Loading Sidebar...</div>}>
            <DesktopSidebar closeMenu={handleClose} />
          </Suspense>
        </Offcanvas.Body>
      </Offcanvas>

      <Suspense fallback={<div>Loading Modal...</div>}>
        <ContactModal show={showContactModal} handleClose={handleCloseContactModal} />
      </Suspense>
    </div>
  );
}

export default MobileHeader;
