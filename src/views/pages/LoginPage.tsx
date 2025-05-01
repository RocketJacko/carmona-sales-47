
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import TogglePanel from '../components/auth/TogglePanel';
import LoginResponsiveStyles from '../components/auth/LoginResponsiveStyles';

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    setIsActive(true);
  };
  
  const handleLoginClick = () => {
    setIsActive(false);
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to home page as there's no actual authentication yet
    navigate('/');
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to home page as there's no actual registration yet
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#375c5d]/80 to-[#375c5d]">
      <div className={`relative w-[850px] h-[550px] bg-white m-5 rounded-[30px] shadow-lg overflow-hidden ${isActive ? 'active' : ''}`}>
        
        {/* Login Form */}
        <div className={`form-box login absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-[1.2s] ease-in-out delay-[2.4s] ${isActive ? 'right-1/2' : ''}`}>
          <LoginForm onSubmit={handleLoginSubmit} />
        </div>
        
        {/* Register Form */}
        <div className={`form-box register absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-[1.2s] ease-in-out delay-[2.4s] ${isActive ? 'visible' : 'invisible'}`}>
          <RegisterForm onSubmit={handleRegisterSubmit} />
        </div>
        
        {/* Toggle Panel */}
        <TogglePanel 
          isActive={isActive} 
          onRegisterClick={handleRegisterClick} 
          onLoginClick={handleLoginClick} 
        />
      </div>
      
      {/* Responsive Styles */}
      <LoginResponsiveStyles isActive={isActive} />
    </div>
  );
};

export default LoginPage;
