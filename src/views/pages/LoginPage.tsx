
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Facebook, Github, Linkedin } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // Mock login function - this would be replaced with actual authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to home
    navigate('/');
  };

  useEffect(() => {
    // Get container and button elements
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    // Add event listeners
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        setIsActive(true);
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        setIsActive(false);
      });
    }

    // Clean up event listeners
    return () => {
      if (registerBtn) {
        registerBtn.removeEventListener('click', () => {
          setIsActive(true);
        });
      }

      if (loginBtn) {
        loginBtn.removeEventListener('click', () => {
          setIsActive(false);
        });
      }
    };
  }, []);

  return (
    <div className="login-page flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200">
      <div className={`container ${isActive ? 'active' : ''}`}>
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i><User size={20} /></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i><Lock size={20} /></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn">Login</button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M9 15h6l3 3v-3h2V9h-2m-9 0h6a3 3 0 1 1 0 6H9V9Z"/></svg></a>
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Github size={24} /></a>
              <a href="#"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form action="#">
            <h1>Registration</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i><User size={20} /></i>
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <i><Mail size={20} /></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i><Lock size={20} /></i>
            </div>
            <button type="submit" className="btn">Register</button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M9 15h6l3 3v-3h2V9h-2m-9 0h6a3 3 0 1 1 0 6H9V9Z"/></svg></a>
              <a href="#"><Facebook size={24} /></a>
              <a href="#"><Github size={24} /></a>
              <a href="#"><Linkedin size={24} /></a>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn">Register</button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
