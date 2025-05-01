
import React from 'react';

interface LoginResponsiveStylesProps {
  isActive: boolean;
}

const LoginResponsiveStyles: React.FC<LoginResponsiveStylesProps> = ({ isActive }) => {
  return (
    <style>
      {`
        @media screen and (max-width: 650px) {
          .form-box {
            bottom: 0;
            width: 100%;
            height: 70%;
            transition: all 2s ease-in-out 2s;
          }
          
          .form-box.login {
            ${isActive ? 'right: 0; bottom: 30%; transition: all 2s ease-in-out 2s;' : ''}
          }
          
          .toggle-box::before {
            left: 0;
            top: -270%;
            width: 100%;
            height: 300%;
            border-radius: 20vw;
            transition: all 5s ease-in-out;
          }
          
          ${isActive ? `
          .toggle-box::before {
            left: 0;
            top: 70%;
            transition: all 5s ease-in-out;
          }
          
          .toggle-panel.toggle-left {
            left: 0;
            top: -30%;
            transition: all 3s ease-in-out 2s;
          }` : ''}
          
          .toggle-panel {
            width: 100%;
            height: 30%;
            transition: all 3s ease-in-out;
          }
          
          .toggle-panel.toggle-left {
            top: 0;
          }
          
          .toggle-panel.toggle-right {
            right: 0;
            bottom: -30%;
            transition: all 3s ease-in-out 2s;
            ${isActive ? 'bottom: 0; transition: all 3s ease-in-out 3s;' : ''}
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
  );
};

export default LoginResponsiveStyles;
