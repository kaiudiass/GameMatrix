import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Layout.module.css';

export function Header({ showLogo = true, showProfile = true }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      {showLogo && (
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <span className={styles.bracket}>[</span>
            <span className={styles.logoText}>vovómatrix</span>
            <span className={styles.bracket}>]</span>
            <span className={styles.cursorBlink}></span>
          </div>
          {showProfile && (
            <div className={styles.profileContainer} ref={dropdownRef}>
              <button 
                className={styles.profileBtn} 
                type="button" 
                aria-label="Perfil do usuário"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className={`material-symbols-outlined ${styles.profileIcon}`}>person</span>
                {user?.username && (
                  <span className={styles.profileUsername}>
                    {user.username}
                  </span>
                )}
              </button>
              
              {showDropdown && (
                <div className={styles.dropdown}>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                    <span>SAIR</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export function Navigation({ activePath }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link
          to="/lobby"
          className={`${styles.navItem} ${activePath === 'lobby' ? styles.navItemActive : ''}`}
        >
          <span className="material-symbols-outlined">hub</span>
          <span className={styles.navItemText}>[LOBBY]</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`${styles.navItem} ${styles.navItemLogout}`}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className={styles.navItemText}>[SAIR]</span>
        </button>
      </div>
    </nav>
  );
}

export function Layout({ children, showHeader = true, showLogo = true, showProfile = true, activePath, hideNav = false }) {
  const showNav = activePath && !hideNav;
  
  return (
    <>
      {showHeader && <Header showLogo={showLogo} showProfile={showProfile} />}
      <main className={`${styles.main} ${!showNav ? styles.mainNoNav : ''}`}>
        {children}
      </main>
      {showNav && <Navigation activePath={activePath} />}
    </>
  );
}

export default Layout;
