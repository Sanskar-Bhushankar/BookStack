"use client"
import React, { useState, useEffect } from 'react';
import styles from './gallery.module.css';

const GalleryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://book-stack-backend.onrender.com/gallery');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Couldn’t fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
      <h1>Trending Books</h1>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search for books, authors..."
          className={styles.searchBarInput}
        />
      </div>
      <div className={styles.bookGrid}>
        {books.map(book => (
          <div key={book.open_library_key} className={styles.bookCard}>
            <img
              src={book.image_url.includes('via.placeholder.com') ? '/default-book-cover.png' : book.image_url}
              alt={book.title}
              className={styles.bookCover}
            />
            <h2 className={styles.bookTitle}>{book.title}</h2>
            <p className={styles.bookAuthor}>{book.author_name}</p>
            <p className={styles.bookYear}>{book.first_publish_year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;