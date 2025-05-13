import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  title,
  className = '',
  onClick
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  const baseClasses = `
    bg-white rounded-lg shadow-md
    transition-all duration-300 ease-in-out
    ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
  `;

  const responsiveClasses = `
    ${isMobile ? 'p-3' : 'p-4'}
    ${isMobile ? 'text-sm' : 'text-base'}
    ${isTablet ? 'max-w-2xl mx-auto' : ''}
    ${isDesktop ? 'max-w-4xl mx-auto' : ''}
  `;

  return (
    <div 
      className={`${baseClasses} ${responsiveClasses} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className={`
          mb-4
          ${isMobile ? 'text-lg' : 'text-xl'}
          font-semibold text-gray-800
        `}>
          {title}
        </div>
      )}
      <div className={`
        ${isMobile ? 'space-y-2' : 'space-y-4'}
      `}>
        {children}
      </div>
    </div>
  );
}; 