"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './BookDetailsPage.module.css';

const BookDetailsPage = ({ openLibraryKey }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!openLibraryKey) {
        setError("Book ID not provided.");
        setLoading(false);
        return;
      }

      // Extract only the ID part from openLibraryKey (e.g., "OL8894965W" from "/works/OL8894965W")
      const bookId = openLibraryKey.startsWith('/works/') ? openLibraryKey.substring('/works/'.length) : openLibraryKey;

      try {
        const response = await fetch(`https://book-stack-backend-production.up.railway.app/gallery/works/${bookId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookDetails(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Couldn’t fetch book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [openLibraryKey]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading book details...</div>;
  }

  if (error) {
    return <div className={styles.errorAlert}><p>{error}</p></div>;
  }

  if (!bookDetails) {
    return <div className={styles.errorAlert}><p>No book details found.</p></div>;
  }

  // Helper to get image URL, handling potential covers array or placeholder
  const getImageUrl = () => {
    if (bookDetails.image_url && !bookDetails.image_url.includes('via.placeholder.com')) {
      return bookDetails.image_url;
    } else if (bookDetails.covers && bookDetails.covers.length > 0) {
      return `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`;
    }
    return '/default-open-book.png'; // Fallback to a default sketch
  };

  const imageUrl = getImageUrl();
  const descriptionContent = bookDetails.description?.value || bookDetails.description || "No description available.";
  const authorName = bookDetails.authors && bookDetails.authors.length > 0 ? bookDetails.authors[0].name : "Unknown Author";
  const authorBio = bookDetails.authors && bookDetails.authors.length > 0 && bookDetails.authors[0].bio ? bookDetails.authors[0].bio : "No bio available.";
  const firstPublished = bookDetails.first_publish_date || bookDetails.first_publish_year || "N/A";

  return (
    <div className={styles.bookDetailsPage}>
      <Link href="/gallery" className={styles.backButton}>&larr; Back to Library</Link>
      <div className={styles.deskBackground}>
        <div className={styles.bookContainer}>
          {/* Left Column: Book Cover */}
          <div className={styles.leftColumn}>
            <div className={styles.bookCoverWrapper}>
              <img src={imageUrl} alt={bookDetails.title} className={styles.bookCover} />
              {/* Curled edge effect */}
              <div className={styles.curledEdgeTop}></div>
              <div className={styles.curledEdgeBottom}></div>
            </div>
          </div>

          {/* Right Column: Book Details */}
          <div className={styles.rightColumn}>
            <h1 className={styles.bookTitle}>{bookDetails.title}</h1>
            <p className={styles.bookAuthor}>by {authorName}</p>
            <p className={styles.firstPublished}>First Published: {firstPublished}</p>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About this Book</h2>
              <p className={styles.description}>{descriptionContent}</p>
            </div>

            {bookDetails.subjects && bookDetails.subjects.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Subjects & Themes</h2>
                <div className={styles.subjectPills}>
                  {bookDetails.subjects.map((subject, index) => (
                    <span key={index} className={styles.subjectPill}>{subject}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About the Author</h2>
              <p className={styles.authorName}>{authorName}</p>
              <p className={styles.authorBio}>{authorBio}</p>
              {bookDetails.authors && bookDetails.authors.length > 0 && bookDetails.authors[0].birth_date && (
                <p className={styles.authorDates}>Born: {bookDetails.authors[0].birth_date}</p>
              )}
              {bookDetails.authors && bookDetails.authors.length > 0 && bookDetails.authors[0].death_date && (
                <p className={styles.authorDates}>Died: {bookDetails.authors[0].death_date}</p>
              )}
              <div className={styles.quillIllustration}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage; 