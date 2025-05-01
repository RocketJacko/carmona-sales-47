
import React, { useState } from 'react';
import { Facebook, Github, Linkedin, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={onSubmit} className="w-full">
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
      
      <button type="submit" className="w-full h-12 bg-[#f1d6b8] rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold hover:bg-[#f1d6b8]/90 transition-colors">
        Login
      </button>
      
      <p className="text-sm my-4">or login with social platforms</p>
      
      <div className="social-icons flex justify-center">
        <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#f1d6b8] hover:text-[#f1d6b8] transition-colors">
          <Mail size={24} />
        </a>
        <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#f1d6b8] hover:text-[#f1d6b8] transition-colors">
          <Facebook size={24} />
        </a>
        <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#f1d6b8] hover:text-[#f1d6b8] transition-colors">
          <Github size={24} />
        </a>
        <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-gray-800 mx-2 hover:border-[#f1d6b8] hover:text-[#f1d6b8] transition-colors">
          <Linkedin size={24} />
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
