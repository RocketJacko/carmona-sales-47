
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            MVC React App
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline px-3 py-2">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className="hover:underline px-3 py-2">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/usuarios" className="hover:underline px-3 py-2">
                Usuarios
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
