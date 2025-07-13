import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Removed useRouter
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Removed: const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    const checkSession = async () => {
      console.log("Navbar: Checking session...");
      console.log("Navbar: Cookies available:", document.cookie); // New log to check for cookies
      try {
        const response = await fetch('https://book-stack-backend-production.up.railway.app/auth/check-session', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Navbar: Session active, data:", data);
          setIsLoggedIn(true);
        } else {
          console.log(`Navbar: Session check failed with status: ${response.status}`);
          const errorData = await response.json().catch(() => ({ message: 'No error message from server' }));
          console.error("Navbar: Session check error response:", errorData);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Navbar: Error checking session status:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();

    // Add event listener for route changes if necessary, though useEffect should re-run on path change with `usePathname`
    // For Next.js App Router, useRouter() changes trigger re-renders, and useEffect usually re-runs
    // if its dependencies change. If you navigate client-side, the component might not remount.
    // A simple dependency on router.pathname might be needed if state isn't updating.
  }, [pathname]); // Use pathname as a dependency

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
            {isLoggedIn && (
              <button className={styles.dropdownItem} onClick={async () => {
                try {
                  const response = await fetch('https://book-stack-backend-production.up.railway.app/auth/logout', {
                    method: 'POST',
                    credentials: 'include' // Send cookies for logout as well
                  });
                  console.log(`Logout attempt status: ${response.status}`); // New log for logout status
                  if (response.ok) {
                    console.log('Logged out successfully');
                    setIsLoggedIn(false); // Update login status
                    window.location.href = '/'; // Redirect to home page
                  } else {
                    const errorData = await response.json().catch(() => ({ message: 'No error message from server' }));
                    console.error('Logout failed:', errorData.message, 'Status:', response.status); // Refine this log
                    alert(`Logout failed: ${errorData.message}`);
                  }
                } catch (error) {
                  console.error('Error during logout:', error);
                  alert('An error occurred during logout.');
                }
                toggleMenu();
              }}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 