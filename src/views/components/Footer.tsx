
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} - MVC React App</p>
      </div>
    </footer>
  );
};

export default Footer;
