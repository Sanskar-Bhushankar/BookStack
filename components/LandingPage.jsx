"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation';

// Hero Section Component
const HeroSection = () => {
  const router = useRouter();
  const handleStartLibraryClick = async () => {
    try {
      const response = await fetch('https://book-stack-backend-production.up.railway.app/auth/check-session', {
        credentials: 'include' // Essential for sending cookies with cross-origin requests
      });
      if (response.ok) {
        // User is logged in
        router.push('/profile');
      } else {
        // User is not logged in
        router.push('/signup');
      }
    } catch (error) {
      console.error("Error checking session:", error);
      // In case of network error or other issues, redirect to signup as a fallback
      router.push('/signup');
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="paper-texture"></div>
        <div className="sketched-elements">
          <div className="sketch-books"></div>
          <div className="sketch-lamp"></div>
          <div className="sketch-plant"></div>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Turn Pages. Build Habits.
            <span className="title-accent">Rediscover Reading.</span>
          </h1>
          <p className="hero-subtitle">
            Find your next great read, track your progress, and follow your favorite authors—all in one beautiful
            library.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartLibraryClick}>Start Your Library</button>
            <Link href="/gallery">
              <button className="btn-secondary">Explore Books</button>
            </Link>
          </div>
        </div>

        <div className="hero-mockup">
          <div className="journal-page">
            <div className="journal-header">
              <h3>My Reading Journal</h3>
              <div className="journal-date">March 15, 2024</div>
            </div>

            <div className="journal-section">
              <h4>Currently Reading</h4>
              <div className="current-book">
                <div className="book-cover"></div>
                <div className="book-info">
                  <div className="book-title">The Seven Husbands of Evelyn Hugo</div>
                  <div className="book-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <span>68% complete</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="journal-section">
              <h4>Daily Habit Streak</h4>
              <div className="habit-streak">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`streak-day ${i < 5 ? "completed" : ""}`}>
                    {i + 10}
                  </div>
                ))}
              </div>
              <div className="streak-text">5 days in a row! 🌱</div>
            </div>

            <div className="journal-section">
              <h4>Upcoming Releases</h4>
              <div className="author-updates">
                <div className="author-update">
                  <span className="author-name">Taylor Jenkins Reid</span>
                  <span className="release-date">New book in 2 weeks</span>
                </div>
                <div className="author-update">
                  <span className="author-name">Colleen Hoover</span>
                  <span className="release-date">Interview tomorrow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Narrative Features Section Component
const NarrativeFeaturesSection = () => {
  const [visibleStep, setVisibleStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const steps = document.querySelectorAll(".story-step")
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.7) {
          setVisibleStep(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="narrative-features">
      <div className="container">
        <div className="story-step" data-step="0">
          <div className="step-content">
            <div className="step-visual">
              <div className="bookshelf-illustration">
                <div className="shelf-books">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`book-spine ${visibleStep >= 0 ? "animate-in" : ""}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="step-text">
              <h2>Discover Your Bookshelf</h2>
              <p>
                Search millions of titles and save them to your personal shelf. From bestsellers to hidden gems, build a
                collection that reflects your unique taste.
              </p>
            </div>
          </div>
        </div>

        <div className="story-step" data-step="1">
          <div className="step-content reverse">
            <div className="step-visual">
              <div className="habit-calendar">
                <div className="calendar-header">March 2024</div>
                <div className="calendar-grid">
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className={`calendar-day ${i < 15 && visibleStep >= 1 ? "reading-day" : ""}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="habit-stats">
                  <div className="stat">
                    <span className="stat-number">15</span>
                    <span className="stat-label">days this month</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">127</span>
                    <span className="stat-label">pages read</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-text">
              <h2>Build a Reading Habit</h2>
              <p>
                Track your daily reading, set achievable goals, and celebrate your streaks. Turn reading from a wish
                into a wonderful daily ritual.
              </p>
            </div>
          </div>
        </div>

        <div className="story-step" data-step="2">
          <div className="step-content">
            <div className="step-visual">
              <div className="notifications-feed">
                <div className="feed-header">Author Updates</div>
                <div className="notification-items">
                  {[
                    { author: "Taylor Jenkins Reid", update: "New book announcement!", time: "2h ago" },
                    { author: "Colleen Hoover", update: "Live Q&A tomorrow", time: "1d ago" },
                    { author: "Sally Rooney", update: "Book tour dates released", time: "3d ago" },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className={`notification-item ${visibleStep >= 2 ? "slide-in" : ""}`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className="notif-avatar"></div>
                      <div className="notif-content">
                        <div className="notif-author">{notif.author}</div>
                        <div className="notif-text">{notif.update}</div>
                        <div className="notif-time">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="step-text">
              <h2>Stay Close to Authors</h2>
              <p>
                Never miss a new release or author update again. Get personalized notifications about your favorite
                writers and discover new voices in literature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Community Section Component
const CommunitySection = () => {
  const bookCovers = [
    { title: "The Seven Husbands", color: "#d4a574" },
    { title: "Where the Crawdads Sing", color: "#8fbc8f" },
    { title: "The Silent Patient", color: "#cd853f" },
    { title: "Educated", color: "#daa520" },
    { title: "The Midnight Library", color: "#9acd32" },
    { title: "Atomic Habits", color: "#f4a460" },
    { title: "The Guest List", color: "#bc8f8f" },
    { title: "The Invisible Life", color: "#deb887" },
  ]

  return (
    <section className="community-section">
      <div className="library-corner-bg">
        <div className="window-light"></div>
        <div className="corner-plant"></div>
        <div className="corner-books"></div>
      </div>

      <div className="container">
        <div className="community-header">
          <h2>Join a World of Readers</h2>
          <p>Share your progress, get inspired by others, and be part of a cozy reading community.</p>
        </div>

        <div className="bookshelves-mosaic">
          {bookCovers.map((book, index) => (
            <div key={index} className="bookshelf-item">
              <div className="book-cover-mini" style={{ backgroundColor: book.color }}>
                <div className="book-title-mini">{book.title}</div>
              </div>
              <div className="reader-info">
                <div className="reader-avatar"></div>
                <div className="reader-progress">
                  <div className="progress-mini">
                    <div className="progress-fill-mini"></div>
                  </div>
                  <span className="progress-text">Reading now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "BookJournal transformed my reading life! I'm reading more than ever and finally finishing books.",
      author: "Priya K.",
    },
    { text: "The habit tracker is a game-changer. So motivating to see my streak grow!", author: "David S." },
    {
      text: "Discovering new authors through their updates has been fantastic. Highly recommend!",
      author: "Sarah L.",
    },
  ]
  return (
    <section className="testimonials-section">
      <div className="container">
        <h2>What Readers Are Saying</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final Call to Action Section Component
const FinalCTASection = () => {
  return (
    <section className="final-cta-section">
      <div className="final-cta-content">
        <h2>Ready to Begin Your Reading Journey?</h2>
        <p>Join thousands of readers rediscovering the joy of books with BookJournal.</p>
        <button className="btn-primary">Get Started Now</button>
      </div>
    </section>
  )
}

// Custom hook for scroll animations
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in-view")
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = document.querySelectorAll(
      ".hero-section, .narrative-features, .community-section, .testimonials-section, .final-cta-section",
    )
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
}

const LandingPage = () => {
  useScrollAnimation() // Apply scroll animations

  return (
    <>
      <HeroSection />
      <NarrativeFeaturesSection />
      <CommunitySection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  )
}

export default LandingPage 