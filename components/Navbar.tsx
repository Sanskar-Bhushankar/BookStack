import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.logo}>
          Bookstack
        </Link>
      </div>
      <div className={styles.navbarRight}>
        <button className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            <Link href="/profile" className={styles.dropdownItem} onClick={toggleMenu}>
              My Profile
            </Link>
            <Link href="/gallery" className={styles.dropdownItem} onClick={toggleMenu}>
              Find a Book
            </Link>
            <button className={styles.dropdownItem} onClick={() => { /* Implement logout logic here */ toggleMenu(); }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 