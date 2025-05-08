import React, { useEffect } from 'react';
import './sidebar.js';

const Sidebar = () => {
  useEffect(() => {
    // El script de sidebar.js se ejecutará automáticamente
  }, []);

  return (
    <div className="sidebar">
      <ul className="Menulist">
        <li className="logo">
          <a href="#">
            <ion-icon name="business-outline" className="icon"></ion-icon>
            <span className="text">CRM</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="home-outline" className="icon"></ion-icon>
            <span className="text">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="people-outline" className="icon"></ion-icon>
            <span className="text">Clientes</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="cart-outline" className="icon"></ion-icon>
            <span className="text">Ventas</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="calendar-outline" className="icon"></ion-icon>
            <span className="text">Calendario</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="stats-chart-outline" className="icon"></ion-icon>
            <span className="text">Reportes</span>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="settings-outline" className="icon"></ion-icon>
            <span className="text">Configuración</span>
          </a>
        </li>
        <li className="bottom">
          <a href="#">
            <div className="imageBox">
              <img src="https://i.pravatar.cc/150?img=12" alt="Profile" />
            </div>
            <span className="text">Perfil</span>
          </a>
        </li>
      </ul>
      <div className="menuToggle"></div>
    </div>
  );
};

export default Sidebar;
