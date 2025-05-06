
import React from 'react';

interface UsuariosPageHeaderProps {
  children: React.ReactNode;
}

const UsuariosPageHeader: React.FC<UsuariosPageHeaderProps> = ({ children }) => {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default UsuariosPageHeader;
