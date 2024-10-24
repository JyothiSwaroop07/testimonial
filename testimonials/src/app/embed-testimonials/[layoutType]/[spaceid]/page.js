"use client";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import styles from './carousel.module.css'; // Optional CSS module for styling

const EmbedTestimonial = ({ params }) => {
  const { spaceid } = params;

  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current slide
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Firebase
  const fetchTestimonials = async () => {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(
        testimonialsRef,
        where('spaceId', '==', spaceid),
        where('isLiked', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(fetchedTestimonials);
      setTestimonials(fetchedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceid) fetchTestimonials();
  }, [spaceid]);

  if (loading) return <p>Loading testimonials...</p>;
  if (testimonials.length === 0) return <p>No testimonials found.</p>;

  // Handle Next and Previous slide navigation
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Helper to embed YouTube videos
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselItem}>
        {testimonials[currentIndex].video && (
          <iframe
            className={styles.video}
            src={getYouTubeEmbedUrl(testimonials[currentIndex].video)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        {testimonials[currentIndex].text && (
          <div className={styles.textTestimonial}>
            <p>{testimonials[currentIndex].text}</p>
            <p style={{ textAlign: 'right' }}>
              — {testimonials[currentIndex].name}
            </p>
          </div>
        )}
      </div>

      {/* Carousel Navigation Buttons */}
      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.controlButton}>
          Previous
        </button>
        <button onClick={handleNext} className={styles.controlButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EmbedTestimonial;
