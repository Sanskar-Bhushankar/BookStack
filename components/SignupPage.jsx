"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://book-stack-backend-production.up.railway.app/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.authLabel}>Username:</label>
          <input
            type="text"
            id="username"
            className={styles.authInput}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.authLabel}>Email:</label>
          <input
            type="email"
            id="email"
            className={styles.authInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.authLabel}>Password:</label>
          <input
            type="password"
            id="password"
            className={styles.authInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.authButton} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p className={styles.authSwitchText}>
        Already have an account? <Link href="/login" className={styles.authLink}>Sign In</Link>
      </p>
    </div>
  );
};

export default SignupPage; 