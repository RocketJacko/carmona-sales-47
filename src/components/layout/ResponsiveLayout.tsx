import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  header,
  footer
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            {header}
          </div>
        </header>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        {sidebar && (
          <aside className={`
            ${isMobile ? 'w-full' : 'w-64'}
            ${isMobile ? 'fixed bottom-0' : 'sticky top-16'}
            bg-white shadow-md z-40
            transition-all duration-300 ease-in-out
          `}>
            <div className="p-4">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`
          flex-1
          ${isMobile ? 'pb-16' : ''}
          ${sidebar ? 'md:ml-64' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 gap-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="bg-white shadow-inner">
          <div className="container mx-auto px-4 py-4">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}; 