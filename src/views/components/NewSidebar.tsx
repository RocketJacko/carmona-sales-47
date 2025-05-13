import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Contact, MessageSquare, Calendar, Search, Settings, LogOut, FileText } from 'lucide-react';
import '@/styles/sidebar.css';
import { authService } from '@/services/auth.service';

const NewSidebar: React.FC = () => {
  const menuToggleRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuListItemsRef = useRef<NodeListOf<HTMLLIElement> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle menu toggle
    const handleMenuToggle = () => {
      menuToggleRef.current?.classList.toggle("active");
      sidebarRef.current?.classList.toggle("active");
    };

    menuToggleRef.current?.addEventListener('click', handleMenuToggle);

    // Handle menu item active state
    const menuItems = document.querySelectorAll<HTMLLIElement>(".Menulist li");
    menuListItemsRef.current = menuItems;
    
    const activeLink = function(this: HTMLLIElement) {
      menuItems.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    };

    menuItems.forEach((item) => item.addEventListener("click", activeLink));

    return () => {
      menuToggleRef.current?.removeEventListener('click', handleMenuToggle);
      if (menuListItemsRef.current) {
        menuListItemsRef.current.forEach((item) => 
          item.removeEventListener("click", activeLink)
        );
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response.success) {
        // Limpiar cualquier estado local o almacenamiento
        localStorage.clear();
        sessionStorage.clear();
        // Redirigir al login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <div className="menuToggle" ref={menuToggleRef}></div>
      <div className="sidebar" ref={sidebarRef}>
        <ul>
          <li className="logo" style={{ '--bg': '#672CAE' } as React.CSSProperties}>
            <Link to="/crm">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>
              </div>
              <div className="text">CRM Carmona</div>
            </Link>
          </li>
          <div className="Menulist">
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm">
                <div className="icon">
                  <Home />
                </div>
                <div className="text">Home</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/usuarios">
                <div className="icon">
                  <Contact />
                </div>
                <div className="text">Usuarios</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/mensajes">
                <div className="icon">
                  <MessageSquare />
                </div>
                <div className="text">Mensajes</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/agendamientos">
                <div className="icon">
                  <Calendar />
                </div>
                <div className="text">Agendamientos</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/creditos">
                <div className="icon">
                  <FileText />
                </div>
                <div className="text">Créditos</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/search">
                <div className="icon">
                  <Search />
                </div>
                <div className="text">Búsqueda</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/crm/settings">
                <div className="icon">
                  <Settings />
                </div>
                <div className="text">Configuración</div>
              </Link>
            </li>
          </div>
          <div className="bottom">
            <li style={{ '--bg': '#333' } as React.CSSProperties}>
              <Link to="/crm/profile">
                <div className="icon">
                  <div className="imageBox">
                    <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=50" alt="profile image" />
                  </div>
                </div>
                <div className="text">Usuario</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <div className="icon">
                  <LogOut />
                </div>
              </button>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default NewSidebar;
