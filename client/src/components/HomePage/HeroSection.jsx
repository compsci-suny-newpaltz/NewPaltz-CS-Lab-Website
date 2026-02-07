import { useEffect, useState, useRef } from 'react';
import { IoMdArrowDown } from 'react-icons/io';

// Available slide numbers (some may be missing in sequence)
const SLIDE_NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Slide 1 always first, then shuffle the rest
const shuffledSlides = [1, ...shuffleArray(SLIDE_NUMBERS)];

// Build image arrays with shuffled order
const normalImages = shuffledSlides.map(i => 
  new URL(`../../assets/homepage/slideshow/slide-${i}.jpg`, import.meta.url).href
);
const lowQualityImages = shuffledSlides.map(i => 
  new URL(`../../assets/homepage/slideshow/slide-${i}-low.jpg`, import.meta.url).href
);

/**
 * HeroSection Component
 * Loads low quality images for slow connections/devices
 * Features smooth parallax scroll animation
 */

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [useHighQuality, setUseHighQuality] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  // Smooth parallax scroll effect
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const sectionHeight = sectionRef.current.offsetHeight;
            
            // Only animate when section is visible
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              // Calculate scroll progress (0 to 1) based on section position
              const scrollProgress = Math.max(0, -rect.top / sectionHeight);
              setScrollY(scrollProgress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check connection speed and device capability
  useEffect(() => {
    const checkPerformance = () => {
      // Check for slow connection
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowConnection = connection.effectiveType === 'slow-2g' ||
                               connection.effectiveType === '2g' ||
                               connection.effectiveType === '3g' ||
                               connection.saveData === true;
        if (slowConnection) {
          setUseHighQuality(false);
          return;
        }
      }

      // Check device memory (if available)
      if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        setUseHighQuality(false);
        return;
      }

      // Check for mobile with small screen
      if (window.innerWidth < 768) {
        setUseHighQuality(false);
        return;
      }

      setUseHighQuality(true);
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  // Get current image set based on quality preference
  const images = useHighQuality ? normalImages : lowQualityImages;

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Calculate parallax transforms
  const contentTranslateY = scrollY * 120; // Content moves up faster
  const contentOpacity = Math.max(0, 1 - scrollY * 1.5); // Fade out as scrolling
  const contentScale = Math.max(0.9, 1 - scrollY * 0.15); // Subtle scale down

  const handleScrollToSection = () => {
    const targetSection = document.getElementById('bento-box-section');
    if (targetSection) {
      const offset = 75;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative mx-auto flex h-[70vh] md:h-[80vh] w-full items-center justify-center overflow-hidden rounded-3xl text-center shadow-lg"
    >
      {/* Background images */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transform bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${image})`,
            opacity: currentImageIndex === index ? 1 : 0,
            transform: currentImageIndex === index ? 'scale(1.05)' : 'scale(1)',
          }}
          aria-hidden={currentImageIndex !== index}
        />
      ))}

      {/* Overlay - SUNY New Paltz Blue */}
      <div className="absolute inset-0 bg-np-blue bg-opacity-50" />

      {/* Content with parallax scroll animation */}
      <div 
        ref={contentRef}
        className="relative z-10 mx-auto max-w-6xl space-y-5 px-4 md:px-12 text-center will-change-transform"
        style={{
          transform: `translateY(-${contentTranslateY}px) scale(${contentScale})`,
          opacity: contentOpacity,
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
        }}
      >
        <h1 className="font-bold text-white drop-shadow-lg text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
          Welcome to the Hydra Lab!
        </h1>

        <p className="text-lg md:text-2xl text-white/90 drop-shadow-md font-light tracking-wide">
          Code. Create. Collaborate.
        </p>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-xl shadow-lg backdrop-blur-md">
          <span role="img" aria-label="location">📍</span>
          <span className="font-medium text-white">Science Hall 260</span>
        </div>

        <div>
          <button
            onClick={handleScrollToSection}
            className="mt-3 rounded-full bg-np-orange px-5 py-2.5 md:px-6 md:py-3 text-base md:text-lg font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-np-orange-600 hover:shadow-xl"
            aria-label="Scroll to explore"
          >
            <span className="flex items-center gap-2 text-white">
              Explore
              <IoMdArrowDown size={18} className="animate-bounce" />
            </span>
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10 max-w-[90%] flex-wrap justify-center">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              currentImageIndex === index
                ? 'bg-white w-3 md:w-4'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
