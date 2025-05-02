
import React from 'react';
import { Outlet } from 'react-router-dom';
import NewSidebar from '../components/NewSidebar';
import Footer from '../components/Footer';

const PaginaPrincipaCrm: React.FC = () => {
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
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
          <h1 className="text-2xl font-bold mb-6">Panel Principal CRM</h1>
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default PaginaPrincipaCrm;
