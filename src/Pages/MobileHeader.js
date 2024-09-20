import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { TfiMenu } from 'react-icons/tfi';
import ContactModal from './ContactModal';
import DesktopSidebar from './DesktopSidebar';

function MobileHeader() {
  const [show, setShow] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleShowContactModal = () => setShowContactModal(true);
  const handleCloseContactModal = () => setShowContactModal(false);

  return (
    <div className='MobileHeader'>
      <div className="mobile_header d-flex flex-row-reverse w-100 justify-content-between px-4 align-items-center">
        <a className="menu-toggle">
          <TfiMenu className='text-black' onClick={handleShow} />
        </a>
        <div>
        <img src="https://mancuso.ai/wp-content/uploads/2024/07/Mancuso-Headshot.png" width={35} alt="description" />
        <a href="" className='site-title-name'>Michael Mancuso</a>
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
