
import React from 'react';

interface TogglePanelProps {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  secondaryColor: string;
}

const TogglePanel: React.FC<TogglePanelProps> = ({ isActive, onToggle, secondaryColor }) => {
  return (
    <div className="toggle-box">
      <div className="toggle-panel toggle-left">
        <h1>Hello, Welcome!</h1>
        <p>Don't have an account?</p>
        <button 
          className="btn register-btn" 
          type="button"
          onClick={() => onToggle(true)}
          style={{ borderColor: secondaryColor, color: secondaryColor }}
        >
          Register
        </button>
      </div>

      <div className="toggle-panel toggle-right">
        <h1>Welcome Back!</h1>
        <p>Already have an account?</p>
        <button 
          className="btn login-btn" 
          type="button"
          onClick={() => onToggle(false)}
          style={{ borderColor: secondaryColor, color: secondaryColor }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default TogglePanel;
