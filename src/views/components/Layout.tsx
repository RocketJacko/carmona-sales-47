
import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import NewSidebar from './NewSidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Adjust main content margin based on sidebar state
    const sidebar = document.querySelector('.sidebar');
    
    const handleSidebarChange = () => {
      if (sidebar?.classList.contains('active')) {
        mainContentRef.current?.classList.add('margin-expanded');
      } else {
        mainContentRef.current?.classList.remove('margin-expanded');
      }
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleSidebarChange();
        }
      });
    });
    
    if (sidebar) {
      observer.observe(sidebar, { attributes: true });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NewSidebar />
      <main className="main-content flex-grow" ref={mainContentRef}>
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
