
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialIcons from '@/components/auth/SocialIcons';
import TogglePanel from '@/components/auth/TogglePanel';
import './LoginPage.css'; // Añadimos CSS específico para la página de login

// Colores personalizados según lo solicitado
const primaryColor = "#375c5d";
const secondaryColor = "#f1d6b8";

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    navigate('/');
  };
  
  const handleRegisterSuccess = () => {
    // Cambiamos a la vista de login después de un registro exitoso
    setIsActive(false);
  };

  return (
    <div className="login-page flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200">
      <div className={`container ${isActive ? 'active' : ''}`}>
        <div className="form-box login">
          <LoginForm 
            onSuccess={handleLoginSuccess}
            primaryColor={primaryColor}
          />
        </div>

        <div className="form-box register">
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            primaryColor={primaryColor}
          />
        </div>

        <TogglePanel 
          isActive={isActive}
          onToggle={setIsActive}
          secondaryColor={secondaryColor}
        />
      </div>
    </div>
  );
};

export default LoginPage;
