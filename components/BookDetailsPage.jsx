"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './BookDetailsPage.module.css';

const Star = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    className={`${styles.star} ${filled ? styles.filled : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const BookDetailsPage = ({ openLibraryKey }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookInLibrary, setIsBookInLibrary] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [isSimilarLoading, setIsSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!openLibraryKey) {
        setError("Book ID not provided.");
        setLoading(false);
        return;
      }
      const bookId = openLibraryKey.startsWith('/works/') ? openLibraryKey.substring('/works/'.length) : openLibraryKey;
      try {
        const response = await fetch(`https://book-stack-backend-production.up.railway.app/gallery/works/${bookId}`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookDetails(data);
        setUserRating(data.userRating || 0);
        // We can also check if the book is in the library from this response if the API supports it
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Couldn’t fetch book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const checkLibraryStatus = async () => {
        // This is a placeholder. A real implementation would need an endpoint like:
        // GET /my-books/status?key=/works/OL...
        // For demonstration, we'll assume it's not in the library initially.
    };

    fetchBookDetails();
    checkLibraryStatus();
  }, [openLibraryKey]);

  const getImageUrl = () => {
    if (bookDetails?.image_url && !bookDetails.image_url.includes('via.placeholder.com')) {
      return bookDetails.image_url;
    } else if (bookDetails?.covers && bookDetails.covers.length > 0) {
      return `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`;
    }
    return '/default-open-book.png';
  };

  const handleAddToProfile = async () => {
    if (isBookInLibrary) return;

    try {
      const response = await fetch(`https://book-stack-backend-production.up.railway.app/profile/my-books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          open_library_key: openLibraryKey,
          title: bookDetails.title,
          author_name: bookDetails.authors?.[0]?.name || "Unknown Author",
          image_url: getImageUrl(),
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setIsBookInLibrary(true);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        alert(data.message || 'Could not add book to your library.');
      }
    } catch (err) {
      console.error("Failed to add book to profile", err);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleRateBook = async (rating) => {
    try {
      const response = await fetch('https://book-stack-backend-production.up.railway.app/ratings/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          open_library_key: openLibraryKey,
          rating: rating,
          title: bookDetails.title,
          author_name: bookDetails.authors?.[0]?.name || "Unknown Author",
          image_url: getImageUrl(),
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUserRating(rating);
        // Optimistically update the ratings breakdown and average
        const newRatings = { ...bookDetails.ratings, [rating]: (bookDetails.ratings[rating] || 0) + 1 };
        const totalRatings = Object.values(newRatings).reduce((sum, count) => sum + count, 0);
        const weightedSum = (newRatings['1'] || 0) * 1 + (newRatings['2'] || 0) * 2 + (newRatings['3'] || 0) * 3;
        const newAverage = totalRatings > 0 ? (weightedSum / totalRatings) : 0;

        setBookDetails(prev => ({ ...prev, ratings: newRatings, averageRating: newAverage }));
        alert('Thank you for rating!');
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        alert(`Error: ${data.message || 'Could not submit your rating.'}`);
      }
    } catch (err) {
      console.error("Failed to rate book", err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleGetSimilarRecommendations = async () => {
    setIsSimilarLoading(true);
    setSimilarError(null);
    const workId = openLibraryKey.substring(openLibraryKey.lastIndexOf('/') + 1);

    try {
      const response = await fetch(`https://book-stack-backend-production.up.railway.app/recommendations/from-book/${workId}`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Could not fetch recommendations at this time.');
      }
      const data = await response.json();
      setSimilarBooks(data.recommendations);
    } catch (err) {
      setSimilarError(err.message);
    } finally {
      setIsSimilarLoading(false);
    }
  };


  if (loading) return <div className={styles.loadingContainer}>Loading book details...</div>;
  if (error) return <div className={styles.errorAlert}><p>{error}</p></div>;
  if (!bookDetails) return <div className={styles.errorAlert}><p>No book details found.</p></div>;

  const imageUrl = getImageUrl();
  const descriptionContent = bookDetails.description?.value || bookDetails.description || "No description available.";
  const authorName = bookDetails.authors?.[0]?.name || "Unknown Author";
  const firstPublished = bookDetails.first_publish_date || bookDetails.first_publish_year || "N/A";
  const ratings = bookDetails.ratings || { '1': 0, '2': 0, '3': 0 };
  const totalRatings = Object.values(ratings).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.bookDetailsPage}>
      <Link href="/gallery" className={styles.backButton}>&larr; Back to Library</Link>
      <div className={styles.deskBackground}>
        <div className={styles.bookContainer}>
          <div className={styles.leftColumn}>
            <div className={styles.bookCoverWrapper}>
              <img src={imageUrl} alt={bookDetails.title} className={styles.bookCover} />
              <div className={styles.curledEdgeTop}></div>
              <div className={styles.curledEdgeBottom}></div>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.titleContainer}>
                <h1 className={styles.bookTitle}>{bookDetails.title}</h1>
                <div className={styles.ratingSection}>
                  <div className={styles.stars}>
                    {[1, 2, 3].map(star => (
                      <Star key={star} filled={star <= userRating} onClick={() => handleRateBook(star)} />
                    ))}
                  </div>
                  <span className={styles.averageRating}>
                    {bookDetails.averageRating ? `${bookDetails.averageRating.toFixed(2)} avg.` : 'No ratings yet'}
                  </span>
                </div>
            </div>
            <p className={styles.bookAuthor}>by {authorName}</p>
            <button 
              onClick={handleAddToProfile} 
              className={`${styles.addToProfileButton} ${isBookInLibrary ? styles.added : ''}`}
              disabled={isBookInLibrary}
            >
              {isBookInLibrary ? 'Added to Library' : 'Add to My Library'}
            </button>
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
              {bookDetails.authors && bookDetails.authors.length > 0 && bookDetails.authors[0].bio &&
                <p className={styles.authorBio}>{bookDetails.authors[0].bio.value || bookDetails.authors[0].bio}</p>
              }
              {bookDetails.authors?.[0]?.birth_date && (
                <p className={styles.authorDates}>Born: {bookDetails.authors[0].birth_date}</p>
              )}
              {bookDetails.authors?.[0]?.death_date && (
                <p className={styles.authorDates}>Died: {bookDetails.authors[0].death_date}</p>
              )}
              <div className={styles.quillIllustration}></div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Community Ratings</h2>
              <div className={styles.ratingsDistribution}>
                <div className={styles.ratingBar}>
                  <span>3 Stars</span>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${totalRatings > 0 ? (ratings['3'] / totalRatings) * 100 : 0}%` }}></div>
                  </div>
                  <span>{ratings['3']}</span>
                </div>
                <div className={styles.ratingBar}>
                  <span>2 Stars</span>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${totalRatings > 0 ? (ratings['2'] / totalRatings) * 100 : 0}%` }}></div>
                  </div>
                  <span>{ratings['2']}</span>
                </div>
                <div className={styles.ratingBar}>
                  <span>1 Star</span>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${totalRatings > 0 ? (ratings['1'] / totalRatings) * 100 : 0}%` }}></div>
                  </div>
                  <span>{ratings['1']}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.similarRecsContainer}>
        <div className={styles.recommendationCta}>
          <button onClick={handleGetSimilarRecommendations} disabled={isSimilarLoading} className={styles.recommendationButton}>
            {isSimilarLoading ? 'Searching...' : 'Get AI Recommendations'}
          </button>
        </div>

        {isSimilarLoading && <div className={styles.loadingContainer}>Finding similar books for you...</div>}
        {similarError && <div className={styles.errorAlert}><p>{similarError}</p></div>}

        {similarBooks.length > 0 && (
          <div className={styles.recommendationsSection}>
            <h2 className={styles.recommendationsSectionTitle}>More Books You Might Like</h2>
            <div className={styles.bookGrid}>
              {similarBooks.map((rec) => (
                <Link key={rec.open_library_key} href={`/book${rec.open_library_key}`} className={styles.recBookCard}>
                  <img src={rec.image_url} alt={rec.title} className={styles.recBookCover} />
                  <div className={styles.recBookInfo}>
                    <h2 className={styles.recBookTitle}>{rec.title}</h2>
                    <p className={styles.recBookAuthor}>{rec.author_name}</p>
                    <p className={styles.recommendationReason}>{rec.reason}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage; 