import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

export function Header({ showLogo = true, showProfile = true }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
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
            <div className={styles.profileContainer}>
              <button 
                className={styles.profileBtn} 
                type="button" 
                aria-label="Perfil"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className={`material-symbols-outlined ${styles.profileIcon}`}>person</span>
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
  const navigate = useNavigate();

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
        <Link
          to="/game"
          className={`${styles.navItem} ${activePath === 'game' ? styles.navItemActive : ''}`}
        >
          <span className="material-symbols-outlined">grid_3x3</span>
          <span className={styles.navItemText}>[GAME]</span>
        </Link>
        <button
          onClick={() => navigate('/')}
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

