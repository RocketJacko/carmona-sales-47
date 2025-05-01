
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
      <div className={`container relative w-[850px] h-[550px] bg-white m-5 rounded-[30px] shadow-lg overflow-hidden ${isActive ? 'active' : ''}`}>
        
        {/* Login Form */}
        <div 
          className="form-box login absolute w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10"
          style={{
            left: isActive ? '-50%' : '0',
            transition: 'all 0.6s ease-in-out',
            transitionDelay: isActive ? '0s' : '0.7s',
            opacity: isActive ? '0' : '1',
          }}
        >
          <LoginForm onSubmit={handleLoginSubmit} />
        </div>
        
        {/* Register Form */}
        <div 
          className="form-box register absolute w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10"
          style={{
            right: isActive ? '0' : '-50%',
            transition: 'all 0.6s ease-in-out',
            transitionDelay: isActive ? '0.7s' : '0s',
            opacity: isActive ? '1' : '0',
          }}
        >
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
