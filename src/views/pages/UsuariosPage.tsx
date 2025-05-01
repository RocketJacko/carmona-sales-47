
import React from 'react';

const UsuariosPage: React.FC = () => {
  return (
    <section id="profile" className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-6xl font-extrabold text-white/10 text-center">Usuarios</h1>
      <div className="flex flex-col items-center gap-4">
        <p className="text-white text-xl max-w-md text-center">
          This page will display user information.
        </p>
      </div>
    </section>
  );
};

export default UsuariosPage;
