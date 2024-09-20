import React from 'react';
import './App.css';
import './Style.css';
import { Routes, Route } from 'react-router-dom';
import About from './Pages/About';
import Resume from './Pages/Resume';
import Portfolio from './Pages/Portfolio';
import Single from './Pages/Single';
import DesktopSidebar from './Pages/DesktopSidebar';
import MobileHeader from './Pages/MobileHeader';
import Error404 from './Pages/Error404';

function App() {
  return (
    <div className="App">
      <div className='site_header'>
        <DesktopSidebar />
      </div>
      <div className='MobileMenus'>
        <MobileHeader />
      </div>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="resume" element={<Resume />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:id" element={<Single />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
