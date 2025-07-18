"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const response = await fetch('https://book-stack-backend-production.up.railway.app/profile/my-books', {
          credentials: 'include',
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch your library. The server might be down.');
        }

        const data = await response.json();
        setMyBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [router]);

  const handleGetRecommendations = async () => {
    setIsRecsLoading(true);
    setRecsError(null);
    try {
      const response = await fetch('https://book-stack-backend-production.up.railway.app/recommendations/from-profile', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Could not fetch recommendations at this time.');
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setRecsError(err.message);
    } finally {
      setIsRecsLoading(false);
    }
  };


  if (loading) {
    return <div className={styles.loadingContainer}>Loading your library...</div>;
  }

  if (error) {
    return <div className={styles.errorAlert}>{error}</div>;
  }

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.pageTitle}>My Library</h1>
      {myBooks.length > 0 ? (
        <div className={styles.bookGrid}>
          {myBooks.map((book) => (
            <Link key={book.id} href={`/book${book.open_library_key}`} className={styles.bookCard}>
              <img src={book.image_url} alt={book.title} className={styles.bookCover} />
              <div className={styles.bookInfo}>
                <h2 className={styles.bookTitle}>{book.title}</h2>
                <p className={styles.bookAuthor}>{book.author_name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>Your library is empty.</h2>
          <p>Start by exploring books and adding them to your collection!</p>
          <Link href="/gallery" className={styles.exploreButton}>
            Find Your Next Read
          </Link>
        </div>
      )}

      {myBooks.length > 0 && (
          <div className={styles.recommendationCta}>
              <button onClick={handleGetRecommendations} disabled={isRecsLoading} className={styles.recommendationButton}>
                {isRecsLoading ? 'Generating...' : 'Get Personalised Recommendations'}
              </button>
          </div>
      )}

      {isRecsLoading && <div className={styles.loadingContainer}>Finding new books for you...</div>}
      {recsError && <div className={styles.errorAlert}>{recsError}</div>}
      
      {recommendations.length > 0 && (
          <div className={styles.recommendationsSection}>
              <h2 className={styles.sectionTitle}>Based on Your Taste...</h2>
              <div className={styles.bookGrid}>
                  {recommendations.map((rec) => (
                      <Link key={rec.open_library_key} href={`/book${rec.open_library_key}`} className={`${styles.bookCard} ${styles.recommendationCard}`}>
                          <img src={rec.image_url} alt={rec.title} className={styles.bookCover} />
                          <div className={styles.bookInfo}>
                              <h2 className={styles.bookTitle}>{rec.title}</h2>
                              <p className={styles.bookAuthor}>{rec.author_name}</p>
                              <p className={styles.recommendationReason}>{rec.reason}</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ProfilePage; 