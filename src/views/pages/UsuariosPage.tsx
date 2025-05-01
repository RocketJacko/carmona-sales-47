
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UsuariosPage: React.FC = () => {
  return (
    <section id="profile" className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-6xl font-extrabold text-white/10 text-center">Usuarios</h1>
      <div className="flex flex-col items-center gap-4">
        <p className="text-white text-xl max-w-md text-center">
          This page will display user information. You need to be logged in to view user data.
        </p>
        <Link to="/login">
          <Button className="bg-[#f1d6b8] text-[#375c5d] hover:bg-[#f1d6b8]/90 font-semibold px-8 py-6 text-lg">
            Go to Login
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default UsuariosPage;
