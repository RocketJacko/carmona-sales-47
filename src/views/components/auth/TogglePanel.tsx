
import React from 'react';

interface TogglePanelProps {
  isActive: boolean;
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const TogglePanel: React.FC<TogglePanelProps> = ({ isActive, onRegisterClick, onLoginClick }) => {
  return (
    <div className="toggle-box absolute w-full h-full">
      <div 
        className="absolute left-[-250%] w-[300%] h-full bg-[#f1d6b8] rounded-[150px] z-20 transition-all duration-[3.6s] ease-in-out before:content-none" 
        style={{ left: isActive ? '50%' : '-250%' }}
      ></div>
      
      {/* Toggle Left Panel */}
      <div className={`toggle-panel toggle-left absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-[1.2s] ease-in-out delay-[2.4s] ${isActive ? 'left-[-50%] delay-[1.2s]' : 'left-0'}`}>
        <h1 className="text-3xl font-bold mb-0">Hello, Welcome!</h1>
        <p className="text-sm mb-5">Don't have an account?</p>
        <button 
          onClick={onRegisterClick} 
          className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold hover:bg-white/10 transition-colors"
        >
          Register
        </button>
      </div>
      
      {/* Toggle Right Panel */}
      <div className={`toggle-panel toggle-right absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-20 transition-all duration-[1.2s] ease-in-out ${isActive ? 'right-0 delay-[2.4s]' : 'right-[-50%] delay-[1.2s]'}`}>
        <h1 className="text-3xl font-bold mb-0">Welcome Back!</h1>
        <p className="text-sm mb-5">Already have an account?</p>
        <button 
          onClick={onLoginClick} 
          className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg shadow-none cursor-pointer text-base text-white font-semibold hover:bg-white/10 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default TogglePanel;
