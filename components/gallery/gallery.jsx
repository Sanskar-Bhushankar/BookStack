"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './gallery.module.css';

const GalleryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [header, setHeader] = useState('Trending Books');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://book-stack-backend-production.up.railway.app/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch trending books.');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`https://book-stack-backend-production.up.railway.app/gallery/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`Search failed for "${searchQuery}". Please try again.`);
      }
      const data = await response.json();
      setBooks(data);
      if (data.length === 0) {
        setHeader(`No results found for "${searchQuery}"`);
      } else {
        setHeader(`Search Results for "${searchQuery}"`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.pageFlip}></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorAlert}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.galleryPage}>
      <h1>{header}</h1>
      <form className={styles.searchBarContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for books, authors..."
          className={styles.searchBarInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isSearching}
        />
        <button type="submit" className={styles.searchButton} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {isSearching ? (
        <div className={styles.loadingContainer}>
            <div className={styles.pageFlip}></div>
            <p>Searching for books...</p>
        </div>
      ) : books.length > 0 ? (
        <div className={styles.bookGrid}>
          {books.map(book => {
            return (
              <Link key={book.open_library_key} href={`/book${book.open_library_key}`} className={styles.bookCard}>
                <img
                  src={book.image_url.includes('via.placeholder.com') ? '/default-book-cover.png' : book.image_url}
                  alt={book.title}
                  className={styles.bookCover}
                />
                <h2 className={styles.bookTitle}>{book.title}</h2>
                <p className={styles.bookAuthor}>{book.author_name}</p>
                <p className={styles.bookYear}>{book.first_publish_year}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
            <h2>No books found.</h2>
            <p>Try a different search, or check back later for trending books.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;