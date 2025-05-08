import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Footer from './Footer';
import { useMediaQuery } from '@/hooks/use-media-query';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else if (isTablet) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 h-[var(--header-height)] bg-white border-b border-border z-50 flex items-center px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-xl font-semibold">CRM Sistema</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-[var(--header-height)]">
        {/* Sidebar */}
        <aside
          className={`fixed top-[var(--header-height)] left-0 h-[calc(100vh-var(--header-height))] bg-white border-r border-border transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isTablet ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-collapsed)]'}`}
        >
          <nav className="h-full overflow-y-auto">
            {/* Aquí va el contenido del sidebar */}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? isTablet
                ? 'ml-[var(--sidebar-width)]'
                : 'ml-[var(--sidebar-width-collapsed)]'
              : 'ml-0'
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
