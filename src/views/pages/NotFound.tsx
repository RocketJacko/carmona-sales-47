
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Página no encontrada</h2>
      <p className="mb-6">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
        Volver a Inicio
      </Link>
    </div>
  );
};

export default NotFound;
