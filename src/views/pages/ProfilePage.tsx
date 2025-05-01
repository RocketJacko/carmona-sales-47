
import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
      <p className="mb-4 text-white">Esta página mostrará el perfil del usuario.</p>
      <p className="text-white/70">
        (Esta es una página de ejemplo. Los datos del perfil se cargarán cuando se implemente la conexión con el backend de ASP.NET Core)
      </p>
    </div>
  );
};

export default ProfilePage;
