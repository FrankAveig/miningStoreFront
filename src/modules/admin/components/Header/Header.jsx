import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logos/logo.avif';
import './Header.scss';

export const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="admin-header" role="banner">
      <div className="admin-header__container">
        <div className="admin-header__logo">
          <img src={logo} alt="logo" className="admin-header__logo-image" />
      
        </div>
        
        <nav className="admin-header__nav" role="navigation">
          <div className="admin-header__user" ref={dropdownRef}>
            <button
              type="button"
              className="admin-header__user-trigger"
              onClick={() => setOpen(v => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              title="Abrir menú de usuario"
            >
              <FaUser className="admin-header__user-icon" aria-hidden="true" />
              <span className="admin-header__user-name">{user?.name}</span>
              <FaChevronDown className={`admin-header__caret ${open ? 'admin-header__caret--open' : ''}`} aria-hidden="true" />
            </button>
            {open && (
              <div className="admin-header__dropdown" role="menu">
            
                <button type="button" className="admin-header__dropdown-item" onClick={() => { setOpen(false); logout(); }}>
                  <FaSignOutAlt aria-hidden="true" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}; 