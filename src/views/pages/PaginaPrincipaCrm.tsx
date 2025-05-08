import React from 'react';
import { Outlet } from 'react-router-dom';
import NewSidebar from '../components/NewSidebar';
import Footer from '../components/Footer';

// Importar las páginas
import Home from './Home';
import UsuariosPage from './UsuariosPage';
import MensajesPage from './MensajesPage';
import AgendamientosPage from './AgendamientosPage';
import CreditosPage from './CreditosPage';
import SearchPage from './SearchPage';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';

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
    <div className="min-h-screen">
      <NewSidebar />
      <main className="main-content" ref={mainContentRef}>
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default PaginaPrincipaCrm;
