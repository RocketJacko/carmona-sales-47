import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  title?: string;
}

export const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  onSubmit,
  className = '',
  title
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const baseClasses = `
    w-full
    ${isMobile ? 'space-y-4' : 'space-y-6'}
  `;

  const containerClasses = `
    ${isMobile ? 'p-4' : 'p-6'}
    ${isTablet ? 'max-w-2xl mx-auto' : ''}
    bg-white rounded-lg shadow-md
  `;

  return (
    <form 
      onSubmit={onSubmit}
      className={`${baseClasses} ${className}`}
    >
      <div className={containerClasses}>
        {title && (
          <h2 className={`
            mb-6
            ${isMobile ? 'text-xl' : 'text-2xl'}
            font-semibold text-gray-800
          `}>
            {title}
          </h2>
        )}
        <div className={`
          grid
          ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}
        `}>
          {children}
        </div>
      </div>
    </form>
  );
};

interface ResponsiveFormFieldProps {
  children: React.ReactNode;
  label: string;
  error?: string;
  className?: string;
  fullWidth?: boolean;
}

export const ResponsiveFormField: React.FC<ResponsiveFormFieldProps> = ({
  children,
  label,
  error,
  className = '',
  fullWidth = false
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`
      ${fullWidth ? 'col-span-2' : ''}
      ${className}
    `}>
      <label className={`
        block
        ${isMobile ? 'text-sm' : 'text-base'}
        font-medium text-gray-700
        mb-2
      `}>
        {label}
      </label>
      {children}
      {error && (
        <p className={`
          mt-1
          ${isMobile ? 'text-xs' : 'text-sm'}
          text-red-600
        `}>
          {error}
        </p>
      )}
    </div>
  );
}; 