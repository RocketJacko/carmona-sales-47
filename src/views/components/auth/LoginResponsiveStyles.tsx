
import React from 'react';

interface LoginResponsiveStylesProps {
  isActive: boolean;
}

const LoginResponsiveStyles: React.FC<LoginResponsiveStylesProps> = ({ isActive }) => {
  return (
    <style>
      {`
        @media screen and (max-width: 650px) {
          .container {
            height: calc(100vh - 40px);
          }
          
          .form-box {
            bottom: 0;
            width: 100%;
            height: 70%;
          }
          
          .container.active .form-box {
            right: 0;
            bottom: 30%;
          }
          
          .toggle-box::before {
            left: 0;
            top: -270%;
            width: 100%;
            height: 300%;
            border-radius: 20vw;
          }
          
          .container.active .toggle-box::before {
            left: 0;
            top: 70%;
          }
          
          .container.active .toggle-panel.toggle-left {
            left: 0;
            top: -30%;
          }
          
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
          }
          
          .container.active .toggle-panel.toggle-right {
            bottom: 0;
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
