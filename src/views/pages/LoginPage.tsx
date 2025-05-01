
import React, { useState, useEffect } from 'react';
import { Facebook, Github, Linkedin, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#375c5d]/80 to-[#375c5d]">
      <div className={`relative w-[850px] h-[550px] bg-white m-5 rounded-[30px] shadow-lg overflow-hidden ${isActive ? 'active' : ''}`}>
        
        {/* Login Form */}
        <div className={`form-box login absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-600 ease-in-out delay-[1.2s] ${isActive ? 'right-1/2' : ''}`}>
          <form onSubmit={handleLoginSubmit} className="w-full">
            <h1 className="text-3xl font-bold mb-5">Login</h1>
            
            <div className="relative my-7">
              <input 
                type="text" 
                placeholder="Username" 
                required 
                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium" 
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600">
                <User size={20} />
              </div>
            </div>
            
            <div className="relative my-7">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium" 
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            
            <div className="forgot-link text-left -mt-3 mb-5">
              <a href="#" className="text-sm text-[#375c5d] hover:underline">Forgot Password?</a>
            </div>
            
            <button type="submit" className="w-full h-12 bg-[#375c5d] rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-[#375c5d]/90 transition-colors">
              Login
            </button>
            
            <p className="text-sm my-4">or login with social platforms</p>
            
            <div className="social-icons flex justify-center">
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Mail size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </form>
        </div>
        
        {/* Register Form */}
        <div className={`form-box register absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-600 ease-in-out delay-[1.2s] ${isActive ? 'visible' : 'invisible'}`}>
          <form onSubmit={handleRegisterSubmit} className="w-full">
            <h1 className="text-3xl font-bold mb-5">Registration</h1>
            
            <div className="relative my-7">
              <input 
                type="text" 
                placeholder="Username" 
                required 
                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium" 
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600">
                <User size={20} />
              </div>
            </div>
            
            <div className="relative my-7">
              <input 
                type="email" 
                placeholder="Email" 
                required 
                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium" 
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Mail size={20} />
              </div>
            </div>
            
            <div className="relative my-7">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium" 
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            
            <button type="submit" className="w-full h-12 bg-[#375c5d] rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-[#375c5d]/90 transition-colors">
              Register
            </button>
            
            <p className="text-sm my-4">or register with social platforms</p>
            
            <div className="social-icons flex justify-center">
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Mail size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#375c5d] hover:text-[#375c5d] transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </form>
        </div>
        
        {/* Toggle Box */}
        <div className="toggle-box absolute w-full h-full">
          <div className="absolute left-[-250%] w-[300%] h-full bg-[#f1d6b8] rounded-[150px] z-20 transition-all duration-[1.8s] ease-in-out before:content-none" style={{ left: isActive ? '50%' : '-250%' }}></div>
          
          {/* Toggle Left Panel */}
          <div className={`toggle-panel toggle-left absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-600 ease-in-out delay-[1.2s] ${isActive ? 'left-[-50%] delay-[0.6s]' : 'left-0'}`}>
            <h1 className="text-3xl font-bold mb-0">Hello, Welcome!</h1>
            <p className="text-sm mb-5">Don't have an account?</p>
            <button 
              onClick={handleRegisterClick} 
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Register
            </button>
          </div>
          
          {/* Toggle Right Panel */}
          <div className={`toggle-panel toggle-right absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-600 ease-in-out ${isActive ? 'right-0 delay-[1.2s]' : 'right-[-50%] delay-[0.6s]'}`}>
            <h1 className="text-3xl font-bold mb-0">Welcome Back!</h1>
            <p className="text-sm mb-5">Already have an account?</p>
            <button 
              onClick={handleLoginClick} 
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      
      <style>
        {`
        @media screen and (max-width: 650px) {
          .form-box {
            bottom: 0;
            width: 100%;
            height: 70%;
          }
          
          .form-box.login {
            ${isActive ? 'right: 0; bottom: 30%;' : ''}
          }
          
          .toggle-box::before {
            left: 0;
            top: -270%;
            width: 100%;
            height: 300%;
            border-radius: 20vw;
          }
          
          ${isActive ? `
          .toggle-box::before {
            left: 0;
            top: 70%;
          }
          
          .toggle-panel.toggle-left {
            left: 0;
            top: -30%;
          }` : ''}
          
          .toggle-panel {
            width: 100%;
            height: 30%;
          }
          
          .toggle-panel.toggle-left {
            top: 0;
          }
          
          .toggle-panel.toggle-right {
            right: 0;
            bottom: -30%;
            ${isActive ? 'bottom: 0;' : ''}
          }
        }
        
        @media screen and (max-width: 400px) {
          .form-box {
            padding: 20px;
          }
          
          .toggle-panel h1 {
            font-size: 30px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
