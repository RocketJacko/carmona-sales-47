
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Contact, MessageSquare, BarChart2, Search, Settings, LogOut } from 'lucide-react';

const NewSidebar: React.FC = () => {
  const menuToggleRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuListItemsRef = useRef<NodeListOf<HTMLLIElement> | null>(null);

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

    // Set active menu item based on current path
    const path = window.location.pathname;
    menuItems.forEach((item) => {
      const link = item.querySelector('a');
      if (link && path.includes(link.getAttribute('href')?.replace('#', '') || '')) {
        item.classList.add('active');
      }
    });

    return () => {
      menuToggleRef.current?.removeEventListener('click', handleMenuToggle);
      if (menuListItemsRef.current) {
        menuListItemsRef.current.forEach((item) => 
          item.removeEventListener("click", activeLink)
        );
      }
    };
  }, []);

  return (
    <>
      <div className="menuToggle" ref={menuToggleRef}></div>
      <div className="sidebar" ref={sidebarRef}>
        <ul>
          <li className="logo" style={{ '--bg': '#672CAE' } as React.CSSProperties}>
            <Link to="/">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>
              </div>
              <div className="text">MVC React App</div>
            </Link>
          </li>
          <div className="Menulist">
            <li style={{ '--bg': '#ffa117' } as React.CSSProperties} className="active">
              <Link to="/">
                <div className="icon">
                  <Home />
                </div>
                <div className="text">Home</div>
              </Link>
            </li>
            <li style={{ '--bg': '#0fc70f' } as React.CSSProperties}>
              <Link to="/usuarios">
                <div className="icon">
                  <Contact />
                </div>
                <div className="text">Usuarios</div>
              </Link>
            </li>
            <li style={{ '--bg': '#f44336' } as React.CSSProperties}>
              <Link to="/mensajes">
                <div className="icon">
                  <MessageSquare />
                </div>
                <div className="text">Mensajes</div>
              </Link>
            </li>
            <li style={{ '--bg': '#f44336' } as React.CSSProperties}>
              <Link to="/analytics">
                <div className="icon">
                  <BarChart2 />
                </div>
                <div className="text">Analytics</div>
              </Link>
            </li>
            <li style={{ '--bg': '#b145e9' } as React.CSSProperties}>
              <Link to="/search">
                <div className="icon">
                  <Search />
                </div>
                <div className="text">Search</div>
              </Link>
            </li>
            <li style={{ '--bg': '#e91e63' } as React.CSSProperties}>
              <Link to="/settings">
                <div className="icon">
                  <Settings />
                </div>
                <div className="text">Settings</div>
              </Link>
            </li>
          </div>
          <div className="bottom">
            <li style={{ '--bg': '#333' } as React.CSSProperties}>
              <Link to="/profile">
                <div className="icon">
                  <div className="imageBox">
                    <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=50" alt="profile image" />
                  </div>
                </div>
                <div className="text">Usuario</div>
              </Link>
            </li>
            <li style={{ '--bg': '#2258BC' } as React.CSSProperties}>
              <Link to="/logout">
                <div className="icon">
                  <LogOut />
                </div>
                <div className="text">Logout</div>
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
};

export default NewSidebar;
