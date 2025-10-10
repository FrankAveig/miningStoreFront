import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaRegUser , FaExpandAlt , FaCompressAlt, FaBitcoin, FaServer, FaFolderOpen, FaShoppingCart, FaBolt, FaCog } from 'react-icons/fa';

import { useAuth } from '../../../../context/AuthContext';

import './Sidebar.scss';

export const Sidebar = () => {
  // Recuperar el estado del menú desde localStorage o usar false por defecto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarMobileOpen');
    return saved ? JSON.parse(saved) : false;
  });
  const { hasRole, isAdmin } = useAuth();

  // Manejar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      // Si la pantalla es grande (mayor a 768px), cerrar el menú móvil
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        localStorage.setItem('adminSidebarMobileOpen', JSON.stringify(false));
      }
    };

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Configuración de permisos por rol para cada elemento del menú
  const menuItems = [
    { 
      path: '/admin/home', 
      icon: FaHome, 
      label: 'Home',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/criptomonedas', 
      icon: FaBitcoin, 
      label: 'Criptomonedas',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/servicios', 
      icon: FaServer, 
      label: 'Servicios',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/categorias', 
      icon: FaFolderOpen, 
      label: 'Categorías',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/catalogo', 
      icon: FaShoppingCart, 
      label: 'Catálogo',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/precios-electricidad', 
      icon: FaBolt, 
      label: 'Precios Electricidad',
      roles: ['ADMIN'] // Solo ADMIN
    },

    { 
      path: '/admin/configuraciones', 
      icon: FaCog, 
      label: 'Configuraciones',
      roles: ['ADMIN'] // Solo ADMIN
    },
 
    { 
      path: '/admin/usuarios', 
      icon: FaRegUser, 
      label: 'Usuarios',
      roles: ['ADMIN'] // Solo ADMIN
    },

  ];

  // Filtrar elementos del menú basados en los roles del usuario
  const visibleMenuItems = menuItems.filter(item => {
    // Si es admin, puede ver todo
    if (isAdmin()) return true;
    
    // Si no es admin, verificar si tiene alguno de los roles requeridos para ese elemento
    return item.roles.some(role => hasRole(role));
  });

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    // Guardar el estado en localStorage para que persista entre recargas
    localStorage.setItem('adminSidebarMobileOpen', JSON.stringify(newState));
  };

  return (
    <>
      <button 
        className="admin-sidebar__mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileMenuOpen ? <FaCompressAlt /> : <FaExpandAlt />}
      </button>

      <aside 
        className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar--mobile-open' : ''}`} 
        role="complementary"
      >
        <nav className="admin-sidebar__nav" role="navigation">
          <ul className="admin-sidebar__menu">
            {visibleMenuItems.map((item) => (
              <li key={item.path} className="admin-sidebar__menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-sidebar__menu-link ${isActive ? 'admin-sidebar__menu-link--active' : ''}`
                  }
                  aria-current="page"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    localStorage.setItem('adminSidebarMobileOpen', JSON.stringify(false));
                  }}
                >
                  <item.icon className="admin-sidebar__menu-icon" aria-hidden="true" />
                  <span className="admin-sidebar__menu-label">{item.label}</span>
                  
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}; 