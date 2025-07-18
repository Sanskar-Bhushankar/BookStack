# BookStack API Documentation

This document provides a comprehensive overview of all the API endpoints for the BookStack application.

---

## Table of Contents
1.  [Authentication Routes](#authentication-routes)
2.  [Book & Gallery Routes](#book--gallery-routes)
3.  [Rating Routes](#rating-routes)
4.  [Recommendation Routes](#recommendation-routes)
5.  [User Profile & Library Routes](#user-profile--library-routes)

---

## Authentication Routes

These routes handle user registration, login, logout, and session management.

### 1. User Signup

*   **Endpoint**: `POST /auth/signup`
*   **Description**: Registers a new user, creates their profile, and starts a new session.
*   **Authentication**: None
*   **Request Body**:
    ```json
    {
      "username": "newuser",
      "email": "user@example.com",
      "password": "a_strong_password"
    }
    ```
*   **Success Response (201)**:
    ```json
    {
      "message": "User registered and logged in successfully!",
      "user": {
        "id": "a-uuid-string",
        "email": "user@example.com",
        "username": "newuser"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If username, email, or password are not provided.
    *   `409 Conflict`: If the email address is already registered.
    *   `500 Internal Server Error`: For other server-side failures.

### 2. User Login

*   **Endpoint**: `POST /auth/login`
*   **Description**: Authenticates an existing user and starts a new session.
*   **Authentication**: None
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "the_correct_password"
    }
    ```
*   **Success Response (200)**:
    ```json
    {
      "message": "Logged in successfully!",
      "user": {
        "id": "a-uuid-string",
        "email": "user@example.com",
        "username": "the_username"
      }
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: If the credentials are invalid.
    *   `500 Internal Server Error`: If the user profile cannot be found or for other failures.

### 3. User Logout

*   **Endpoint**: `POST /auth/logout`
*   **Description**: Signs the user out and destroys their session.
*   **Authentication**: Required (must be logged in)
*   **Request Body**: None
*   **Success Response (200)**:
    ```json
    {
      "message": "Logged out successfully."
    }
    ```

### 4. Check Session

*   **Endpoint**: `GET /auth/check-session`
*   **Description**: Checks if the current user has an active session.
*   **Authentication**: Required (must be logged in)
*   **Request Body**: None
*   **Success Response (200)**:
    ```json
    {
      "message": "Session is active! You are logged in.",
      "userId": "a-uuid-string",
      "username": "the_username"
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: If the user is not logged in.

---

## Book & Gallery Routes

These routes provide access to book information from the Open Library API.

### 1. Get Trending Books

*   **Endpoint**: `GET /gallery/`
*   **Description**: Fetches a list of 10 trending books from the Open Library.
*   **Authentication**: None
*   **Success Response (200)**:
    ```json
    [
      {
        "title": "A Popular Book Title",
        "author_name": "Famous Author",
        "first_publish_year": 1999,
        "open_library_key": "/works/OL12345W",
        "image_url": "https://covers.openlibrary.org/b/id/12345-M.jpg"
      }
    ]
    ```

### 2. Search for Books

*   **Endpoint**: `GET /gallery/search?q={searchQuery}`
*   **Description**: Searches for books on the Open Library based on a query parameter.
*   **Authentication**: None
*   **Success Response (200)**:
    ```json
    [
      {
        "title": "A Searched Book Title",
        "author_name": "Famous Author",
        "first_publish_year": 2005,
        "open_library_key": "/works/OL54321W",
        "image_url": "https://covers.openlibrary.org/b/id/54321-M.jpg"
      }
    ]
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If the `q` query parameter is missing.

### 3. Get Book Details

*   **Endpoint**: `GET /gallery/works/:workId`
*   **Description**: Fetches detailed information for a specific book from Open Library. This is a public route. It also includes aggregated ratings and the current user's personal rating if they are logged in.
*   **Authentication**: Optional. If a user is logged in, their session cookie will be used to fetch their personal rating for the book, which will be returned in the `userRating` field. For non-logged-in users, `userRating` will be `null`.
*   **Success Response (200)**:
    ```json
    {
      "open_library_key": "/works/OL12345W",
      "title": "A Popular Book Title",
      "author_name": "Famous Author",
      "image_url": "https://covers.openlibrary.org/b/id/12345-M.jpg",
      "ratings": {
        "one_star": 5,
        "two_star": 12,
        "three_star": 25
      },
      "averageRating": 2.5,
      "userRating": 3, // The logged-in user's rating, or null for guests
      "work": {
        "title": "A Popular Book Title",
        "description": "A summary of the book.",
        "subjects": ["Fiction", "Fantasy"],
        "first_publish_date": "1999",
        "covers": ["https://covers.openlibrary.org/b/id/12345-L.jpg"]
      },
      "authors": [
        {
          "name": "Famous Author",
          "bio": "Author's biography.",
          "birth_date": "1950-01-01",
          "death_date": "2020-01-01"
        }
      ]
    }
    ```

---

## Rating Routes

### 1. Rate a Book

*   **Endpoint**: `POST /ratings/rate`
*   **Description**: Submits or updates a user's rating for a book. This action is atomic and updates both the user's personal rating and the book's aggregate rating counts. If the book's `subjects` are provided, it will also trigger a background update of the user's taste profile.
*   **Authentication**: Required
*   **Request Body**:
    ```json
    {
      "open_library_key": "/works/OL12345W",
      "rating": 3,
      "title": "A Popular Book Title",
      "author_name": "Famous Author",
      "image_url": "https://covers.openlibrary.org/b/id/12345-M.jpg",
      "subjects": ["Fiction", "Fantasy", "Adventure"]
    }
    ```
*   **Success Response (200)**:
    ```json
    {
      "message": "Rating submitted successfully.",
      "ratings": {
        "one_star": 6,
        "two_star": 12,
        "three_star": 25
      },
      "averageRating": 2.52
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If required fields are missing or the rating is not between 1 and 3.
    *   `401 Unauthorized`: If the user is not logged in.

### 2. Get Book Ratings

*   **Endpoint**: `GET /ratings/:workId`
*   **Description**: A dedicated endpoint to get the aggregated ratings and the current user's rating for a book.
*   **Authentication**: Optional
*   **Success Response (200)**:
    ```json
    {
      "ratings": {
        "one_star": 5,
        "two_star": 12,
        "three_star": 25
      },
      "averageRating": 2.5,
      "userRating": 3 // The logged-in user's rating, or null
    }
    ```

---

## Recommendation Routes

These routes leverage the Gemini API to provide personalized book recommendations for logged-in users. The results are enriched with data from the Open Library API.

### 1. Get Recommendations From Profile

*   **Endpoint**: `GET /recommendations/from-profile`
*   **Description**: Generates book recommendations based on the user's overall saved taste profile and their existing library (to avoid duplicates).
*   **Authentication**: Required
*   **Request Body**: None
*   **Success Response (200)**:
    ```json
    {
      "recommendations": [
        {
          "title": "A Recommended Book",
          "author_name": "A Recommended Author",
          "open_library_key": "/works/OL67890W",
          "image_url": "https://covers.openlibrary.org/b/id/98765-M.jpg",
          "reason": "Based on your high preference for Fantasy, you would enjoy this classic adventure."
        }
      ]
    }
    ```

### 2. Get Recommendations From a Specific Book

*   **Endpoint**: `GET /recommendations/from-book/:workId`
*   **Description**: Generates "live" book recommendations based on a specific book's Open Library ID. It fetches the book's subjects, normalizes them into canonical genres, and then asks the AI for similar books.
*   **Authentication**: Required
*   **URL Parameters**:
    *   `workId` (string, required): The Open Library ID of the book (e.g., `OL45883W`).
*   **Request Body**: None
*   **Success Response (200)**:
    ```json
    {
      "recommendations": [
        {
          "title": "A Similar Book",
          "author_name": "Another Author",
          "open_library_key": "/works/OL98765W",
          "image_url": "https://covers.openlibrary.org/b/id/54321-M.jpg",
          "reason": "Because you showed interest in the original book's genre, you might like this one."
        }
      ]
    }
    ```

---

## User Profile & Library Routes

All routes in this section require authentication and are prefixed with `/profile`.

### 1. Add a Book to My Library

*   **Endpoint**: `POST /profile/my-books`
*   **Description**: Adds a book to the logged-in user's personal library. It checks to prevent duplicate entries for the same book.
*   **Authentication**: Required
*   **Request Body**:
    ```json
    {
      "open_library_key": "/works/OL12345W",
      "title": "A Book Title",
      "author_name": "An Author",
      "image_url": "https://covers.openlibrary.org/b/id/12345-M.jpg"
    }
    ```
*   **Success Response (201)**:
    ```json
    {
      "message": "Book added to profile successfully!",
      "userBook": {
        "id": "a-user-book-uuid",
        "user_id": "the-user-uuid",
        "open_library_key": "/works/OL12345W",
        "title": "A Book Title",
        "author_name": "An Author",
        "image_url": "https://covers.openlibrary.org/b/id/12345-M.jpg",
        "current_page_number": 0,
        "status": "to-read",
        "rating": null
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If required fields are missing.
    *   `409 Conflict`: If the book already exists in the user's library.

### 2. Get My Library

*   **Endpoint**: `GET /profile/my-books`
*   **Description**: Retrieves a list of all books in the logged-in user's library. Each book is augmented with its associated reading sessions.
*   **Authentication**: Required
*   **Success Response (200)**:
    ```json
    [
      {
        "id": "a-user-book-uuid",
        "user_id": "the-user-uuid",
        "open_library_key": "/works/OL12345W",
        "title": "A Book Title",
        "status": "reading",
        "rating": 3,
        "openLibraryDetails": {},
        "readingSessions": [
          {
            "id": "session-uuid",
            "user_book_id": "a-user-book-uuid",
            "pages_read_in_session": 50,
            "session_date": "2023-10-27T10:00:00.000Z",
            "notes": "First session notes."
          }
        ]
      }
    ]
    ```

### 3. Get a Specific Book from My Library

*   **Endpoint**: `GET /profile/my-books/:userBookId`
*   **Description**: Retrieves full details for a single book from the user's library, including augmented data from Open Library and all reading sessions.
*   **Authentication**: Required
*   **Success Response (200)**:
    ```json
    {
      "id": "a-user-book-uuid",
      "title": "A Book Title",
      "status": "reading",
      "openLibraryDetails": {
          "description": "A detailed description of the book.",
          "number_of_pages": 350
      },
      "readingSessions": [
        {
          "id": "session-uuid",
          "pages_read_in_session": 50,
          "notes": "First session notes."
        }
      ]
    }
    ```
*   **Error Responses**:
    *   `404 Not Found`: If the book is not found in the user's library.

### 4. Log a Reading Session

*   **Endpoint**: `POST /profile/my-books/:userBookId/add-session`
*   **Description**: Logs a new reading session for a specific book and updates the book's `current_page_number`.
*   **Authentication**: Required
*   **Request Body**:
    ```