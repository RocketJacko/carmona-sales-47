
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#375c5d]/80 text-white/70 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} - MVC React App</p>
      </div>
    </footer>
  );
};

export default Footer;
