
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={onSubmit} className="w-full">
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
    </form>
  );
};

export default RegisterForm;
